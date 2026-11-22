import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Truck, Shield } from 'lucide-react';
import Footer from '../components/Footer';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const deliveryFee = cartTotal >= 5000 ? 0 : 99;
  const grandTotal = cartTotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-indigo-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products yet</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            <ShoppingBag size={18} /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900">Shopping Cart</h1>
          <span className="text-sm text-gray-500">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in">
            {/* Price header */}
            <div className="hidden sm:flex justify-end px-6 text-sm font-semibold text-gray-500">
              Price
            </div>

            {cartItems.map((item, idx) => (
              <div key={item.id}
                className="bg-white rounded-2xl shadow-md p-5 flex gap-5 animate-fade-in-up hover:shadow-lg transition-shadow duration-200"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                {/* Image */}
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl hover:scale-105 transition-transform duration-300" />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-bold text-gray-900 hover:text-indigo-600 transition-colors text-sm sm:text-base">{item.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                      {item.inStock !== false && (
                        <p className="text-xs text-green-600 font-medium mt-1">✓ In Stock</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">Eligible for FREE delivery</p>
                    </div>
                    <span className="text-base sm:text-lg font-black text-gray-900 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4 mt-4 flex-wrap">
                    {/* Quantity */}
                    <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <Minus size={13} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-gray-900 bg-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <Plus size={13} />
                      </button>
                    </div>

                    <span className="text-gray-200">|</span>

                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 transition-colors">
                      <Trash2 size={14} /> Delete
                    </button>

                    <span className="text-gray-200">|</span>

                    <Link to="/shop" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
                      Save for Later
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Subtotal row */}
            <div className="text-right py-4 text-sm text-gray-600">
              Subtotal: {cartCount} item{cartCount !== 1 ? 's' : ''} — <span className="font-bold text-gray-900 text-lg">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="animate-slide-right">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-28">
              <h2 className="text-xl font-black text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee</span>
                  <span className="font-semibold text-gray-900">₹12</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-indigo-600 mt-1">
                    Add {formatPrice(5000 - cartTotal)} more for free delivery!
                  </p>
                )}

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900 text-base">Total Amount</span>
                    <span className="font-black text-gray-900 text-xl">{formatPrice(grandTotal + 12)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl mt-6 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-indigo-200 hover:shadow-xl text-base"
              >
                Buy Now
              </Link>

              {/* Trust */}
              <div className="mt-5 space-y-2">
                {[
                  { icon: Shield, text: '100% Genuine Products' },
                  { icon: Truck, text: 'Free delivery above ₹5,000' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                    <Icon size={13} className="text-indigo-400" />
                    {text}
                  </div>
                ))}
              </div>

              {/* Payment icons */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-3">Payment Options</p>
                <div className="flex gap-2 flex-wrap">
                  {['💳 Visa', '💳 Mastercard', '📱 UPI', '🏦 Net Banking', '💵 COD'].map(opt => (
                    <span key={opt} className="text-xs bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 text-gray-600 font-medium">{opt}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8">
          <Link to="/shop" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors hover:gap-3 duration-200">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
