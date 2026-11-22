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
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Shipped':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Processing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">My Orders</h1>
            <p className="text-slate-400 text-sm mt-1">Track and manage your Apple devices & accessories orders</p>
          </div>
          <Link
            to="/shop"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors border border-slate-700"
          >
            Browse Store
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No orders placed yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              You haven't placed any orders with us yet. Browse our selection of genuine iPhones, 9H tempered glass, and MagSafe cases.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm"
            >
              Start Shopping Now →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Header */}
                <div className="p-6 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Order Number</span>
                    <p className="text-base font-bold text-white font-mono mt-0.5">{order.orderNumber}</p>
                    <span className="text-xs text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.status)}`}>
                      ● {order.status}
                    </span>
                    <span className="text-lg font-bold text-blue-400">
                      ₹{order.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 divide-y divide-slate-800/60">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-950 p-2 border border-slate-800 flex-shrink-0 flex items-center justify-center">
                        <ProductImage
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{item.productName}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Qty: <span className="text-slate-300 font-medium">{item.quantity}</span> × ₹{item.price?.toLocaleString('en-IN')}
                        </p>
                        {item.category && (
                          <span className="inline-block mt-1 text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-200">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer details */}
                <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800/60 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-300">Delivery Address: </span>
                    {order.shippingAddress}, {order.city} - {order.pincode}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300">Contact: </span>
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
