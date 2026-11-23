import axios from 'axios';
import { fallbackProducts } from '../data/fallbackProducts';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 6000,
});

// Automatically inject JWT token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nmnora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ─── Products API with Intelligent High-Availability Fallback ───
export const getProducts = async (params) => {
  try {
    const res = await api.get('/products', { params });
    if (Array.isArray(res.data) && res.data.length > 0) {
      try {
        localStorage.setItem('nmnora_cached_products', JSON.stringify(res.data));
      } catch (e) {}
      return res.data;
    }
  } catch (err) {
    console.warn('[Products API] Live fetch error, falling back to local catalog:', err.message);
  }

  // Check cached products or bundled catalog
  try {
    const cached = localStorage.getItem('nmnora_cached_products');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  return fallbackProducts;
};

export const getProduct = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    if (res.data) return res.data;
  } catch (err) {
    console.warn('[Product Detail API] Fallback to local catalog:', err.message);
  }

  const all = await getProducts();
  const found = all.find((p) => p.id === id);
  if (found) return found;
  throw new Error('Product not found');
};

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
