import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import ProductImage from '../components/ProductImage';
import Footer from '../components/Footer';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const platformFee = 12;
  const deliveryFee = cartTotal >= 5000 ? 0 : 99;
  const totalAmount = cartTotal + platformFee + deliveryFee;

  // Payment form state matching reference UI
  const [email, setEmail] = useState(user?.email || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [hasPromoCode, setHasPromoCode] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Shipping details state
  const [shippingName, setShippingName] = useState(user?.name || '');
  const [shippingPhone, setShippingPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [shippingCity, setShippingCity] = useState(user?.city || 'Chennai');
  const [shippingPincode, setShippingPincode] = useState(user?.pincode || '600048');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'NMNORA10') {
      const discount = Math.round(cartTotal * 0.1);
      setPromoDiscount(discount);
    } else {
      alert('Invalid promo code. Use code NMNORA10 for 10% off.');
    }
  };

  const finalPayable = Math.max(0, totalAmount - promoDiscount);

  const handleBuyNow = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!shippingAddress.trim() || !shippingPhone.trim()) {
      setShowAddressModal(true);
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customer: {
          name: shippingName.trim() || user?.name || 'Customer',
          email: email.trim().toLowerCase(),
          phone: shippingPhone.trim() || '1234567890',
          address: shippingAddress.trim() || 'Street Address',
          city: shippingCity.trim() || 'Chennai',
          pincode: shippingPincode.trim() || '600048',
        },
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
        })),
        subtotal: cartTotal,
        deliveryFee,
        total: finalPayable,
      };

      const placedOrder = await createOrder(orderPayload);
      clearCart();
      navigate(`/order-success/${placedOrder.orderNumber || placedOrder.id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to place order. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white border border-slate-200/90 rounded-3xl p-10 shadow-xl shadow-slate-200/60">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Browse our catalog for authentic iPhones (11 to 17 Pro Max), 9H tempered glass, and MagSafe cases.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm"
          >
            Start Shopping Now →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edf2f7] text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Floating Card Container Matching Reference Image */}
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xl shadow-slate-300/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* ════════════════════════════════════════
                LEFT COLUMN: SHOPPING CART LIST
            ════════════════════════════════════════ */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Shopping Cart
                  </h1>
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Price
                  </span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-6 flex gap-4 sm:gap-6 items-start">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 border border-slate-100 rounded-2xl p-2 shrink-0 flex items-center justify-center">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          name={item.name}
                          category={item.category}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-tight">
                              {item.name}
                            </h3>
                            <p className="text-xs text-rose-600 font-semibold mt-0.5">
                              Only 3 left in stock - order soon.
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Eligible for FREE delivery
                            </p>
                            {item.category && (
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Category: <span className="text-slate-800 font-semibold">{item.category}</span>
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm sm:text-base font-extrabold text-slate-900 font-mono">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Controls matching uploaded UI */}
                        <div className="flex items-center gap-3 mt-4 text-xs">
                          {/* Qty dropdown */}
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                            <span className="text-slate-500 text-xs font-medium">Qty:</span>
                            <select
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="bg-transparent text-slate-900 font-bold text-xs outline-none cursor-pointer"
                            >
                              {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                                <option key={num} value={num} className="bg-white text-slate-900">
                                  {num}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-600 font-medium transition-colors"
                          >
                            Delete
                          </button>

                          <button
                            onClick={() => navigate('/shop')}
                            className="text-slate-400 hover:text-blue-600 font-medium transition-colors"
                          >
                            Save for Later
                          </button>

                          <button
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({ title: item.name, url: window.location.href });
                              } else {
                                alert(`Copied product: ${item.name}`);
                              }
                            }}
                            className="text-slate-400 hover:text-blue-600 font-medium transition-colors"
                          >
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal summary for items */}
                <div className="pt-6 border-t border-slate-100 text-right">
                  <span className="text-xs text-slate-500">
                    Subtotal: {cartCount} item{cartCount !== 1 ? 's' : ''}{' '}
                  </span>
                  <span className="text-base font-extrabold text-slate-900 font-mono ml-2">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Bottom bar of Left Column */}
              <div className="pt-8 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/shop"
                  className="px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  &lt; Continue Shopping
                </Link>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-400">Total:</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    ₹{finalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════
                RIGHT COLUMN: PAYMENT DETAILS
            ════════════════════════════════════════ */}
            <div className="lg:col-span-5 p-6 sm:p-10 bg-[#fafcff] flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">
                  Payment Details
                </h2>

                {error && (
                  <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleBuyNow} className="space-y-4">
                  {/* Email input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 text-sm font-medium"
                    />
                  </div>

                  {/* Credit Card Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Credit Card Number / UPI ID
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="XXXX  XXXX  XXXX  XXXX"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 text-sm font-mono tracking-wider"
                    />
                  </div>

                  {/* Expiry Date & CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM / YY"
                        maxLength={5}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 text-sm font-mono text-center font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="X X X"
                        maxLength={4}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 text-sm font-mono text-center font-medium"
                      />
                    </div>
                  </div>

                  {/* Promo Code Toggle */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={hasPromoCode}
                        onChange={(e) => setHasPromoCode(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      I've a promo code
                    </label>

                    {hasPromoCode && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="e.g. NMNORA10"
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs uppercase font-bold"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="pt-4 space-y-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900 font-mono">
                        ₹{cartTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-500">
                      <span>Platform Fee</span>
                      <span className="font-bold text-slate-900 font-mono">₹12.00</span>
                    </div>

                    <div className="flex justify-between text-slate-500">
                      <span>Delivery Fee</span>
                      <span className="font-bold text-emerald-600 font-mono">
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}.00`}
                      </span>
                    </div>

                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Promo Discount (10%)</span>
                        <span className="font-mono">-₹{promoDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-baseline pt-3 border-t border-slate-100 text-sm">
                      <span className="font-extrabold text-slate-900">Total Amount</span>
                      <span className="text-xl font-black text-slate-950 font-mono">
                        ₹{finalPayable.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Location Summary */}
                  <div className="p-3 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-600 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="font-bold text-slate-900">Deliver To: </span>
                      <span className="text-slate-600">
                        {shippingAddress ? `${shippingAddress}, ${shippingCity}` : 'Set address'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(true)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-bold ml-2 shrink-0 underline"
                    >
                      {shippingAddress ? 'Change' : 'Enter Address'}
                    </button>
                  </div>

                  {/* Payment Options Logos (Exact from reference) */}
                  <div className="pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Payment Options
                    </p>
                    <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl flex-wrap shadow-xs">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                        ✓ UPI
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-red-50 text-red-600 text-[11px] font-bold border border-red-200">
                        Mastercard
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                        PayPal
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200">
                        VISA
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 text-[11px] font-bold border border-slate-200">
                        AMEX
                      </span>
                    </div>
                  </div>

                  {/* Buy Now Button (Bright blue full width) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-500/25 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing Order...' : 'Buy now'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Edit Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-xl font-extrabold text-slate-900 mb-4">Delivery Information</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="1234567890"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street address or hostel"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="Ramanathapuram"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={shippingPincode}
                    onChange={(e) => setShippingPincode(e.target.value)}
                    placeholder="623525"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default CartPage;
