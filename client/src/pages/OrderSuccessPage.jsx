import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, Copy, Check } from 'lucide-react';
import { getOrder } from '../services/api';
import { formatPrice } from '../utils/formatPrice';
import ProductImage from '../components/ProductImage';
import Footer from '../components/Footer';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getOrder(orderId).then(o => { setOrder(o); setLoading(false); }).catch(() => setLoading(false));
  }, [orderId]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin-slow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center animate-scale-in">
          {/* Success icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-200 rounded-full blur-xl animate-pulse scale-150" />
            <CheckCircle className="w-20 h-20 text-green-500 relative z-10" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-8">Thank you for shopping with NMNORA. Your order is confirmed!</p>

          {/* Order ID */}
          <div className="bg-indigo-50 rounded-2xl p-5 mb-8 inline-block">
            <div className="flex items-center gap-2 text-indigo-700 mb-1">
              <Package size={16} />
              <span className="text-sm font-semibold">Order ID</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-black text-indigo-800 text-lg">{orderId}</span>
              <button onClick={copyOrderId} className="text-indigo-500 hover:text-indigo-700 transition-colors">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Order details */}
          {order && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-3">
                {order.items?.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      name={item.name}
                      category={item.category}
                      className="w-12 h-12 rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between text-sm font-bold text-gray-900">
                  <span>Total Paid</span>
                  <span className="text-indigo-600 text-lg">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Delivery info */}
          <div className="flex items-center gap-3 bg-blue-50 rounded-2xl p-4 mb-8 text-left">
            <Truck size={20} className="text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Estimated Delivery</p>
              <p className="text-xs text-blue-600">3–5 business days (Same day in Chennai)</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-primary inline-flex items-center justify-center gap-2 px-8">
              Continue Shopping <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn-outline inline-flex items-center justify-center gap-2 px-8">
              Go Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
