import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Automatically inject JWT token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nmnora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ─── Products API ───
export const getProducts = (params) => api.get('/products', { params }).then((r) => r.data);
export const getProduct = (id) => api.get(`/products/${id}`).then((r) => r.data);
export const createProduct = (data) => api.post('/products', data).then((r) => r.data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data).then((r) => r.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);

// ─── Orders API ───
export const createOrder = (data) => api.post('/orders', data).then((r) => r.data);
export const getMyOrders = () => api.get('/orders/my-orders').then((r) => r.data);
export const getOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data);

// ─── Admin API (Protected with requireAdmin on backend) ───
export const getAdminStats = () => api.get('/admin/stats').then((r) => r.data);
export const getAdminOrders = () => api.get('/admin/orders').then((r) => r.data);
export const getAdminCustomers = () => api.get('/admin/customers').then((r) => r.data);
export const getAdminInventory = () => api.get('/admin/inventory').then((r) => r.data);
export const updateOrderStatus = (id, status) =>
  api.patch(`/admin/orders/${id}/status`, { status }).then((r) => r.data);

export default api;
