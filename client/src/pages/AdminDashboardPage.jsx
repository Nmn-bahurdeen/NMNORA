import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats,
  getAdminOrders,
  getAdminCustomers,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductImage from '../components/ProductImage';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'orders', 'customers'
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'iPhone',
    stock: 20,
    image: '/products/iphone-promax.svg',
    description: '',
    compatibility: 'iPhone 11 to 17 Pro Max',
    inStock: true,
    featured: false,
    bestseller: false,
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, productsData, ordersData, customersData] = await Promise.all([
        getAdminStats(),
        getProducts(),
        getAdminOrders(),
        getAdminCustomers(),
      ]);
      setStats(statsData);
      setProducts(productsData);
      setOrders(ordersData);
      setCustomers(customersData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to load administrator dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      originalPrice: '',
      category: 'iPhone',
      stock: 25,
      image: '/products/iphone-promax.svg',
      description: '',
      compatibility: 'All iPhone Models',
      inStock: true,
      featured: false,
      bestseller: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      price: prod.price || '',
      originalPrice: prod.originalPrice || '',
      category: prod.category || 'iPhone',
      stock: prod.stock !== undefined ? prod.stock : 20,
      image: prod.image || '/products/iphone-promax.svg',
      description: prod.description || '',
      compatibility: prod.compatibility || '',
      inStock: prod.inStock !== false,
      featured: prod.featured === true,
      bestseller: prod.bestseller === true,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setActionSuccess('');
    setError('');
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
        setActionSuccess(`Updated product "${productForm.name}" successfully!`);
      } else {
        await createProduct(productForm);
        setActionSuccess(`Created new product "${productForm.name}" successfully!`);
      }
      setIsModalOpen(false);
      loadAllData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product.');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the database?`)) {
      return;
    }
    try {
      await deleteProduct(id);
      setActionSuccess(`Deleted product "${name}".`);
      loadAllData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setActionSuccess(`Order status updated to ${newStatus}.`);
      loadAllData();
    } catch (err) {
      setError('Failed to update order status.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'All') return true;
    return o.status === orderStatusFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold font-mono">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white tracking-wide">NMNORA ADMIN CONSOLE</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ROLE: {user?.role || 'ADMIN'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Database & Business Operations Control Center</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            ↗ View Public Storefront
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 rounded-lg border border-rose-500/30 transition-all"
          >
            Log Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Alerts */}
        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="text-emerald-400 hover:text-emerald-200">✕</button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-200">✕</button>
          </div>
        )}

        {/* 1. KEY BUSINESS METRICS ROW */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            Live Business Analytics (Restricted to Admin)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Total Revenue */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs text-slate-400 uppercase font-semibold">Total Revenue</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                ₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Cumulative sales</div>
            </div>

            {/* Total Sales */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs text-slate-400 uppercase font-semibold">Total Orders</div>
              <div className="text-2xl font-black text-white mt-1">
                {stats?.totalSales || 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Order transactions</div>
            </div>

            {/* Total Products */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs text-slate-400 uppercase font-semibold">Catalog Items</div>
              <div className="text-2xl font-black text-blue-400 mt-1">
                {stats?.totalProducts || 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">iPhones & Accessories</div>
            </div>

            {/* Total Customers */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs text-slate-400 uppercase font-semibold">Customers</div>
              <div className="text-2xl font-black text-purple-400 mt-1">
                {stats?.totalCustomers || 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Registered users</div>
            </div>

            {/* Pending Orders */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs text-slate-400 uppercase font-semibold">Pending Delivery</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {stats?.pendingOrders || 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Action required</div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs text-slate-400 uppercase font-semibold">Low Stock (&lt;10)</div>
              <div className="text-2xl font-black text-rose-400 mt-1">
                {stats?.lowStockCount || 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Restock alerts</div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 text-sm font-bold tracking-wide transition-all border-b-2 ${
              activeTab === 'inventory'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📦 Products & Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold tracking-wide transition-all border-b-2 ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 Orders Management ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-3 text-sm font-bold tracking-wide transition-all border-b-2 ${
              activeTab === 'customers'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            👥 Registered Customers ({customers.length})
          </button>
        </div>

        {/* TAB 1: INVENTORY & PRODUCTS */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-64"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="All">All Categories</option>
                  <option value="iPhone">iPhones</option>
                  <option value="Temper Glass">Temper Glass</option>
                  <option value="Cases & Covers">Cases & Covers</option>
                  <option value="Audio">Audio</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
              >
                <span>+ Add New Product</span>
              </button>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price (₹)</th>
                      <th className="px-6 py-4">Internal Stock</th>
                      <th className="px-6 py-4">Availability</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 p-1 flex-shrink-0 flex items-center justify-center">
                            <ProductImage src={p.image} alt={p.name} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">{p.name}</div>
                            {p.compatibility && (
                              <div className="text-xs text-slate-400">{p.compatibility}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          <span className="px-2.5 py-1 rounded-md text-xs bg-slate-800 text-slate-300 border border-slate-700">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-white">
                          ₹{p.price?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-mono font-bold px-2.5 py-1 rounded-md text-xs border ${
                            p.stock < 10
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            p.inStock && p.stock > 0
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            ● {p.inStock && p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg border border-rose-500/30 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <label className="text-xs uppercase font-semibold text-slate-400">Filter Status:</label>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Order ID & Date</th>
                      <th className="px-6 py-4">Customer & Contact</th>
                      <th className="px-6 py-4">Delivery Address</th>
                      <th className="px-6 py-4">Items Ordered</th>
                      <th className="px-6 py-4">Total (₹)</th>
                      <th className="px-6 py-4">Status & Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-mono font-bold text-white text-xs">{o.orderNumber}</div>
                          <div className="text-xs text-slate-400 mt-1">
                            {new Date(o.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{o.customerName}</div>
                          <div className="text-xs text-slate-400">{o.customerEmail}</div>
                          <div className="text-xs text-blue-400 font-mono mt-0.5">{o.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-300 max-w-xs">
                          <div>{o.shippingAddress}</div>
                          <div className="text-slate-400">{o.city} - {o.pincode}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-300">
                          {o.items?.map((item) => (
                            <div key={item.id} className="py-0.5">
                              • <span className="font-semibold text-white">{item.productName}</span> (×{item.quantity})
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                          ₹{o.total?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTERED CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Customer Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4">Orders Placed</th>
                    <th className="px-6 py-4">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{c.name}</td>
                      <td className="px-6 py-4 text-slate-300">{c.email}</td>
                      <td className="px-6 py-4 font-mono text-blue-400">{c.phone || '9943881393'}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{c.address ? `${c.address}, ${c.city}` : '123 Commerce St, Chennai'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold">
                          {c._count?.orders || 0} orders
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-8 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingProduct ? 'Edit Product Record' : 'Add New Product to Store'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Apple iPhone 17 Pro Max"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="154900"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="169900"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="iPhone">iPhone</option>
                    <option value="Temper Glass">Temper Glass</option>
                    <option value="Cases & Covers">Cases & Covers</option>
                    <option value="Audio">Audio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Internal Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="25"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Product Image Asset Path or URL
                </label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="/products/iphone-promax.svg or URL"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-2 mt-2 text-[11px] text-slate-400">
                  <span>Quick Presets:</span>
                  <button type="button" onClick={() => setProductForm({ ...productForm, image: '/products/iphone-promax.svg' })} className="text-blue-400 underline">Pro Max</button>
                  <button type="button" onClick={() => setProductForm({ ...productForm, image: '/products/iphone-pro.svg' })} className="text-blue-400 underline">Pro</button>
                  <button type="button" onClick={() => setProductForm({ ...productForm, image: '/products/iphone-base.svg' })} className="text-blue-400 underline">Base</button>
                  <button type="button" onClick={() => setProductForm({ ...productForm, image: '/products/temperglass.svg' })} className="text-blue-400 underline">Glass</button>
                  <button type="button" onClick={() => setProductForm({ ...productForm, image: '/products/phonecase.svg' })} className="text-blue-400 underline">Case</button>
                  <button type="button" onClick={() => setProductForm({ ...productForm, image: '/products/airpods.svg' })} className="text-blue-400 underline">AirPods</button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  iPhone Compatibility
                </label>
                <input
                  type="text"
                  value={productForm.compatibility}
                  onChange={(e) => setProductForm({ ...productForm, compatibility: e.target.value })}
                  placeholder="e.g. iPhone 17 Pro, iPhone 17 Pro Max"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed specifications..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-blue-500"
                  />
                  Featured on Home
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={productForm.bestseller}
                    onChange={(e) => setProductForm({ ...productForm, bestseller: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-blue-500"
                  />
                  Bestseller Tag
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/20"
                >
                  {editingProduct ? 'Save Changes' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
