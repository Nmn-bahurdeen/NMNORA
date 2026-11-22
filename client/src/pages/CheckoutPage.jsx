import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { createOrder } from '../services/api';
import { CreditCard, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import ProductImage from '../components/ProductImage';
import Footer from '../components/Footer';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart, cartCount } = useCart();
  const navigate = useNavigate();
  const deliveryFee = cartTotal >= 5000 ? 0 : 99;
  const platformFee = 12;
  const grandTotal = cartTotal + deliveryFee + platformFee;

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', pincode: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter valid 10-digit Indian phone number';
    if (!form.address.trim()) errs.address = 'Delivery address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.pincode.trim()) errs.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter valid 6-digit pincode';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const orderData = {
        customer: { ...form },
        items: cartItems.map(item => ({
          id: item.id, name: item.name, price: item.price,
          quantity: item.quantity, image: item.image, category: item.category,
        })),
        subtotal: cartTotal,
        deliveryFee,
        total: grandTotal,
      };
      const order = await createOrder(orderData);
      clearCart();
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      setErrors({ submit: 'Failed to place order. Please try again.' });
      setSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <Link to="/shop" className="btn-primary mt-4 inline-block">Go Shopping</Link>
        </div>
      </div>
    );
  }

  const InputField = ({ label, field, type = 'text', placeholder }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={handleChange(field)}
        placeholder={placeholder}
        className={`input ${errors[field] ? 'ring-2 ring-red-400 border-red-400' : ''}`}
      />
      {errors[field] && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/cart" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 animate-slide-left">
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
              <h1 className="text-2xl font-black text-gray-900 mb-6">Delivery Details</h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField label="Full Name" field="name" placeholder="Enter your full name" />
                  <InputField label="Email Address" field="email" type="email" placeholder="you@example.com" />
                </div>
                <InputField label="Phone Number" field="phone" type="tel" placeholder="10-digit mobile number" />
                <InputField label="Delivery Address" field="address" placeholder="House no, street, landmark" />
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField label="City" field="city" placeholder="City" />
                  <InputField label="Pincode" field="pincode" placeholder="6-digit pincode" />
                </div>

                {errors.submit && (
                  <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> {errors.submit}
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                    <Lock size={12} /> This is a demo checkout. No real payment is processed.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-2xl transition-all duration-200 active:scale-95 shadow-lg hover:shadow-indigo-200 hover:shadow-xl flex items-center justify-center gap-2 text-base"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                    ) : (
                      <>
                        <CreditCard size={18} /> Place Order — {formatPrice(grandTotal)}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 animate-slide-right">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-28">
              <h2 className="text-lg font-black text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      name={item.name}
                      category={item.category}
                      className="w-14 h-14 rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee</span>
                  <span className="font-semibold text-gray-900">{formatPrice(platformFee)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="font-black text-indigo-600 text-xl">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-2">Payment Options</p>
                <div className="flex gap-2 flex-wrap">
                  {['💳 Visa', '💳 MC', '📱 UPI', '🏦 Net Banking', '💵 COD'].map(opt => (
                    <span key={opt} className="text-xs bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-gray-500 font-medium">{opt}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
