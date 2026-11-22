import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Truck, RefreshCw, Award, ChevronRight, Smartphone, Package } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { getProducts } from '../services/api';

const CATEGORIES = [
  { name: 'iPhones', key: 'iPhone', emoji: '📱', desc: 'All models from 11 to 17', color: 'from-indigo-500 to-purple-600' },
  { name: 'Cases & Covers', key: 'Cases & Covers', emoji: '🛡️', desc: 'Silicone, Leather & MagSafe', color: 'from-pink-500 to-rose-600' },
  { name: 'Temper Glass', key: 'Temper Glass', emoji: '💎', desc: '9H hardness protection', color: 'from-cyan-500 to-blue-600' },
  { name: 'Wireless', key: 'Wireless Headphones', emoji: '🎧', desc: 'AirPods & TWS earbuds', color: 'from-emerald-500 to-teal-600' },
  { name: 'Wired', key: 'Wired Headphones', emoji: '🎵', desc: 'EarPods & earphones', color: 'from-amber-500 to-orange-600' },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(p => { setProducts(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const featured = products.filter(p => p.featured).slice(0, 8);
  const bestsellers = products.filter(p => p.bestseller).slice(0, 4);
  const latestIphones = products.filter(p => p.category === 'iPhone').slice(-4).reverse();

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 text-white min-h-[88vh] flex items-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-slide-left">
            <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              Chennai's #1 iPhone Store
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
              Premium<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">iPhones</span><br />
              in Chennai
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-md">
              100% authentic Apple products — iPhones, cases, temper glass & headphones. Delivered across India.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/shop?category=iPhone" className="btn-primary text-base px-8 py-3 rounded-full">
                Shop iPhones
              </Link>
              <Link to="/shop" className="border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:bg-white/5">
                All Products
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              {[
                { icon: Shield, text: '1 Year Warranty' },
                { icon: Truck, text: 'Free Delivery' },
                { icon: Award, text: '100% Authentic' },
                { icon: RefreshCw, text: '7-Day Returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={15} className="text-indigo-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* iPhone visual */}
          <div className="hidden md:flex justify-center items-center animate-slide-right">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl scale-110" />
              <img
                src="https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&h=600&fit=crop&auto=format"
                alt="iPhone Collection"
                className="w-72 h-72 lg:w-96 lg:h-96 object-cover rounded-3xl shadow-2xl animate-float relative z-10"
              />
              {/* Floating badges */}
              <div className="absolute -left-8 top-12 bg-white text-gray-900 rounded-2xl px-4 py-3 shadow-xl animate-fade-in z-20" style={{ animationDelay: '0.5s' }}>
                <p className="text-xs text-gray-500">Latest</p>
                <p className="font-bold text-sm">iPhone 17 Pro Max</p>
              </div>
              <div className="absolute -right-8 bottom-12 bg-indigo-600 text-white rounded-2xl px-4 py-3 shadow-xl animate-fade-in z-20" style={{ animationDelay: '0.8s' }}>
                <p className="text-xs text-indigo-200">Starting at</p>
                <p className="font-bold text-sm">₹34,999</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-indigo-600 text-white py-5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { n: '500+', label: 'Happy Customers' },
            { n: '20+', label: 'iPhone Models' },
            { n: '100%', label: 'Genuine Products' },
            { n: '24/7', label: 'Customer Support' },
          ].map(({ n, label }) => (
            <div key={label}>
              <p className="text-2xl font-black">{n}</p>
              <p className="text-indigo-200 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 mt-2">Find exactly what you need</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 stagger">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.key}
                to={`/shop?category=${encodeURIComponent(cat.key)}`}
                className="card p-5 text-center hover:-translate-y-1 animate-fade-in-up group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {cat.emoji}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Handpicked for you</p>
            </div>
            <Link to="/shop" className="flex items-center gap-1 text-indigo-600 font-semibold hover:gap-2 transition-all duration-200 text-sm">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton aspect-square" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-10 w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <Truck className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h2 className="text-2xl md:text-3xl font-black mb-2">Free Delivery on Orders Above ₹5,000</h2>
          <p className="text-indigo-200 mb-6">Shipped securely across all of India. Same-day dispatch in Chennai.</p>
          <Link to="/shop" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-3 rounded-full transition-all duration-200 shadow-lg">
            Shop Now
          </Link>
        </div>
      </section>

      {/* ── Latest iPhones ── */}
      {latestIphones.length > 0 && (
        <section className="py-16 bg-gray-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black">Latest iPhones</h2>
                <p className="text-gray-400 mt-1">The newest Apple lineup</p>
              </div>
              <Link to="/shop?category=iPhone" className="flex items-center gap-1 text-indigo-400 font-semibold hover:gap-2 transition-all duration-200 text-sm">
                All iPhones <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestIphones.map((product, i) => (
                <Link key={product.id} to={`/product/${product.id}`}
                  className="bg-gray-900 hover:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <img src={product.image} alt={product.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm mb-1">{product.name}</h3>
                    <p className="text-indigo-400 font-black">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bestsellers ── */}
      {bestsellers.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900">🔥 Bestsellers</h2>
                <p className="text-gray-500 mt-1">Most loved by our customers</p>
              </div>
              <Link to="/shop" className="flex items-center gap-1 text-indigo-600 font-semibold hover:gap-2 transition-all duration-200 text-sm">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {bestsellers.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why NMNORA ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">Why Choose NMNORA?</h2>
            <p className="text-gray-500 mt-2">We're committed to quality and your satisfaction</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {[
              { icon: Award, title: '100% Authentic', desc: 'All products are genuine Apple and certified accessories', color: 'text-indigo-600 bg-indigo-50' },
              { icon: Shield, title: '1 Year Warranty', desc: 'Full manufacturer warranty on every iPhone we sell', color: 'text-emerald-600 bg-emerald-50' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Same-day delivery in Chennai, 2–5 days across India', color: 'text-blue-600 bg-blue-50' },
              { icon: RefreshCw, title: '7-Day Returns', desc: 'Not happy? Return within 7 days for a full refund', color: 'text-purple-600 bg-purple-50' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6 text-center animate-fade-in-up hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
