import { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Pencil, Trash2, X, Package, ShoppingBag, DollarSign } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, getOrders, updateOrderStatus } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['Electronics', 'Clothing', 'Home & Living', 'Books', 'Sports'];
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const EMPTY_FORM = {
  name: '', price: '', originalPrice: '', category: 'Electronics',
  description: '', image: '', rating: '', reviews: '', inStock: true, stock: '', featured: false, bestseller: false,
};

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      getProducts().catch(() => []),
      getOrders().catch(() => []),
    ]).then(([prods, ords]) => {
      setProducts(Array.isArray(prods) ? prods : []);
      setOrders(Array.isArray(ords) ? ords : []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const openAdd = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({ ...product, price: product.price?.toString(), originalPrice: product.originalPrice?.toString(), rating: product.rating?.toString(), reviews: product.reviews?.toString(), stock: product.stock?.toString() });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(ps => ps.filter(p => p.id !== id));
    } catch { alert('Failed to delete product.'); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      originalPrice: parseFloat(form.originalPrice) || parseFloat(form.price),
      rating: parseFloat(form.rating) || 4.0,
      reviews: parseInt(form.reviews) || 0,
      stock: parseInt(form.stock) || 0,
    };
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, payload);
        setProducts(ps => ps.map(p => p.id === editingProduct.id ? updated : p));
      } else {
        const created = await createProduct(payload);
        setProducts(ps => [...ps, created]);
      }
      setModalOpen(false);
    } catch { alert('Failed to save product.'); }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(os => os.map(o => (o.id === orderId || o._id === orderId) ? { ...o, status } : o));
    } catch { alert('Failed to update order status.'); }
  };

  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Admin warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 mb-8">
          <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0" />
          <p className="text-amber-800 text-sm font-medium">Demo Admin Panel – Not for production use</p>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Products', value: products.length, icon: Package, color: 'bg-indigo-500' },
            { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-purple-500' },
            { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className={`${stat.color} rounded-xl p-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['products', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg font-semibold capitalize text-sm transition-colors ${
                activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Products ({products.length})</h2>
                  <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <tr>
                        {['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg" onError={e => { e.target.src = 'https://via.placeholder.com/40'; }} />
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{p.name}</td>
                          <td className="px-4 py-3">
                            <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{p.category}</span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900">${p.price?.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold ${p.inStock ? 'text-green-600' : 'text-red-500'}`}>
                              {p.inStock ? p.stock : 'Out'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => openEdit(p)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {products.length === 0 && <p className="text-center text-gray-500 py-10">No products found.</p>}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Orders ({orders.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <tr>
                        {['Order ID', 'Customer', 'Total', 'Status', 'Date', 'Update Status'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map(o => {
                        const oid = o.id || o._id;
                        return (
                          <tr key={oid} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{oid}</td>
                            <td className="px-4 py-3 font-medium">{o.customer?.fullName || 'N/A'}</td>
                            <td className="px-4 py-3 font-semibold">${o.total?.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                                o.status === 'delivered' ? 'bg-green-100 text-green-700'
                                  : o.status === 'cancelled' ? 'bg-red-100 text-red-600'
                                  : o.status === 'shipped' ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {o.status || 'pending'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-xs">
                              {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={o.status || 'pending'}
                                onChange={e => handleStatusChange(oid, e.target.value)}
                                className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-400"
                              >
                                {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {orders.length === 0 && <p className="text-center text-gray-500 py-10">No orders yet.</p>}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Name', name: 'name', span: 2 },
                { label: 'Price ($)', name: 'price', type: 'number' },
                { label: 'Original Price ($)', name: 'originalPrice', type: 'number' },
                { label: 'Rating (0-5)', name: 'rating', type: 'number' },
                { label: 'Reviews', name: 'reviews', type: 'number' },
                { label: 'Stock', name: 'stock', type: 'number' },
              ].map(f => (
                <div key={f.name} className={f.span === 2 ? 'col-span-2' : ''}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleFormChange}
                    required={['name', 'price'].includes(f.name)}
                    step="any"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                <input type="url" name="image" value={form.image} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none" />
              </div>

              <div className="flex items-center gap-4 col-span-2">
                {[{ name: 'inStock', label: 'In Stock' }, { name: 'featured', label: 'Featured' }, { name: 'bestseller', label: 'Bestseller' }].map(cb => (
                  <label key={cb.name} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" name={cb.name} checked={!!form[cb.name]} onChange={handleFormChange} className="accent-indigo-600" />
                    {cb.label}
                  </label>
                ))}
              </div>

              <div className="col-span-2 flex gap-3 justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:bg-indigo-400">
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
