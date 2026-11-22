import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductImage from '../components/ProductImage';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f8fafc]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">My Orders</h1>
            <p className="text-slate-500 text-sm mt-1">Track and manage your Apple devices & accessories orders</p>
          </div>
          <Link
            to="/shop"
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-colors border border-slate-200 shadow-xs"
          >
            Browse Store
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-xl shadow-slate-200/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No orders placed yet</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              You haven't placed any orders with us yet. Browse our selection of genuine iPhones, 9H tempered glass, and MagSafe cases.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm"
            >
              Start Shopping Now →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50"
              >
                {/* Header */}
                <div className="p-6 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Order Number</span>
                    <p className="text-base font-extrabold text-slate-900 font-mono mt-0.5">{order.orderNumber}</p>
                    <span className="text-xs text-slate-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                      ● {order.status}
                    </span>
                    <span className="text-lg font-black text-blue-600 font-mono">
                      ₹{order.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 divide-y divide-slate-100">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 p-2 border border-slate-100 flex-shrink-0 flex items-center justify-center">
                        <ProductImage
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{item.productName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Qty: <span className="text-slate-800 font-semibold">{item.quantity}</span> × ₹{item.price?.toLocaleString('en-IN')}
                        </p>
                        {item.category && (
                          <span className="inline-block mt-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900 font-mono">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer details */}
                <div className="px-6 py-3.5 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-700">Delivery Address: </span>
                    {order.shippingAddress}, {order.city} - {order.pincode}
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Contact: </span>
                    {order.customerPhone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
