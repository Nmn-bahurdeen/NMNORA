import { useState, useEffect } from 'react';
import { formatPrice } from '../utils/formatPrice';
import { getProducts, createProduct, updateProduct, deleteProduct, getOrders, updateOrderStatus } from '../services/api';
import { Package, ShoppingBag, IndianRupee, TrendingUp, Plus, Pencil, Trash2, X, Eye, AlertTriangle, Shield, ChevronDown } from 'lucide-react';
import ProductImage from '../components/ProductImage';

const CATEGORIES = ['iPhone', 'Cases & Covers', 'Temper Glass', 'Wireless Headphones', 'Wired Headphones'];
const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const emptyForm = { name: '', price: '', originalPrice: '', category: 'iPhone', description: '', image: '', stock: '10', rating: '4.0', reviews: '0', inStock: true, featured: false, bestseller: false };

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('products');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [p, o] = await Promise.all([getProducts(), getOrders()]);
      setProducts(p);
      setOrders(o);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  const openAdd = () => { setForm(emptyForm); setEditingProduct(null); setModalOpen(true); };
  const openEdit = (product) => {
    setForm({
      name: product.name, price: String(product.price), originalPrice: String(product.originalPrice || ''),
      category: product.category, description: product.description || '', image: product.image || '',
      stock: String(product.stock || 10), rating: String(product.rating || 4), reviews: String(product.reviews || 0),
      inStock: product.inStock !== false, featured: product.featured === true, bestseller: product.bestseller === true,
    });
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) return alert('Name, price and category are required');
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, form);
      } else {
        await createProduct(form);
      }
      setModalOpen(false);
      load();
    } catch (err) { alert('Failed to save product'); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setDeleting(null);
      load();
    } catch (err) { alert('Failed to delete product'); }
  };

  const handleStatusChange = async (orderId, status) => {
    try { await updateOrderStatus(orderId, status); load(); }
    catch (err) { alert('Failed to update status'); }
  };

  const statusColor = (s) => {
    switch (s) {
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-indigo-100 text-indigo-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-amber-500" />
            <div>
              <h1 className="text-lg font-black text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Demo admin panel — not for production use</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: 'Total Products', value: products.length, color: 'text-indigo-600 bg-indigo-50' },
            { icon: ShoppingBag, label: 'Total Orders', value: orders.length, color: 'text-blue-600 bg-blue-50' },
            { icon: IndianRupee, label: 'Total Revenue', value: formatPrice(totalRevenue), color: 'text-green-600 bg-green-50' },
            { icon: TrendingUp, label: 'Pending Orders', value: pendingOrders, color: 'text-amber-600 bg-amber-50' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 animate-fade-in-up">
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xl font-black text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
          {['products', 'orders'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize
                ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t} {t === 'products' ? `(${products.length})` : `(${orders.length})`}
            </button>
          ))}
        </div>

        {/* Products tab */}
        {tab === 'products' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Product Management</h2>
              <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
                <Plus size={16} /> Add Product
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Price</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600">Stock</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map(product => (
                      <tr key={product.id || product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <ProductImage
                              src={product.image}
                              alt={product.name}
                              name={product.name}
                              category={product.category}
                              className="w-10 h-10 rounded-lg flex-shrink-0"
                            />
                            <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="badge bg-indigo-100 text-indigo-700">{product.category}</span></td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatPrice(product.price)}</td>
                        <td className="px-4 py-3 text-center">{product.stock || 0}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`badge ${product.inStock !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.inStock !== false ? 'In Stock' : 'Out'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => openEdit(product)} className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"><Pencil size={15} /></button>
                            <button onClick={() => setDeleting(product)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Management</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-gray-500">No orders yet. Orders will appear here when customers place them.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id || order._id} className="bg-white rounded-2xl shadow-md p-5 animate-fade-in-up">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="font-mono font-bold text-gray-900 text-sm">{order.id}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`badge ${statusColor(order.status)}`}>{order.status}</span>
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-6 cursor-pointer bg-white"
                          >
                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {order.customer && (
                      <div className="text-xs text-gray-500 mb-3">
                        <span className="font-medium text-gray-700">{order.customer.name}</span> • {order.customer.phone} • {order.customer.city}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 mb-3">
                      {order.items?.map(item => (
                        <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                          <ProductImage
                            src={item.image}
                            alt={item.name}
                            name={item.name}
                            category={item.category}
                            className="w-8 h-8 rounded flex-shrink-0"
                          />
                          <div>
                            <p className="text-xs font-medium text-gray-900 truncate max-w-[150px]">{item.name}</p>
                            <p className="text-xs text-gray-500">×{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-right font-black text-indigo-600">{formatPrice(order.total)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="e.g. Apple iPhone 15 Pro" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input" placeholder="99999" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} className="input" placeholder="129900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input" rows={3} placeholder="Product description..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="input" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
                  <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Reviews</label>
                  <input type="number" value={form.reviews} onChange={e => setForm({ ...form, reviews: e.target.value })} className="input" />
                </div>
              </div>
              <div className="flex gap-6 py-2">
                {[
                  { key: 'inStock', label: 'In Stock' },
                  { key: 'featured', label: 'Featured' },
                  { key: 'bestseller', label: 'Bestseller' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                    {label}
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-scale-in">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-6">"{deleting.name}" will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleting.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-colors">Delete</button>
              <button onClick={() => setDeleting(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
