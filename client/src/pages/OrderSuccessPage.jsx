import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Calendar, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const orderItems = location.state?.items || [];

  // Delivery estimate
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 3);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 5);
  const dateFmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 fill-green-50 stroke-green-500" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-6">Thank you for shopping with NMNORA. Your order is confirmed!</p>

        {/* Order ID */}
        <div className="bg-indigo-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-indigo-700">
            <Package className="w-5 h-5" />
            <span className="font-semibold text-sm">Order ID:</span>
          </div>
          <p className="font-mono font-bold text-indigo-800 text-lg mt-1">{orderId}</p>
        </div>

        {/* Delivery estimate */}
        <div className="bg-green-50 rounded-xl p-4 mb-6 flex items-center justify-center gap-2 text-green-700">
          <Calendar className="w-5 h-5" />
          <div className="text-sm">
            <span className="font-semibold">Estimated Delivery:</span>{' '}
            <span>{dateFmt(minDate)} – {dateFmt(maxDate)}</span>
            <p className="text-xs text-green-600 mt-0.5">3–5 business days</p>
          </div>
        </div>

        {/* Items list (if available from state) */}
        {orderItems.length > 0 && (
          <div className="text-left mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" onError={e => { e.target.src = 'https://via.placeholder.com/40'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
