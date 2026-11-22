import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Truck, RefreshCw, Award, ChevronRight, Smartphone, Sparkles, Zap, Headphones, CheckCircle2, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import Footer from '../components/Footer';
import { getProducts } from '../services/api';
import { formatPrice } from '../utils/formatPrice';

const CATEGORIES = [
  { name: 'iPhones (11 to 17 Pro Max)', key: 'iPhone', icon: Smartphone, desc: 'Flagship & Pro Series', gradient: 'from-blue-600 via-indigo-600 to-purple-700', badge: '100% Genuine' },
  { name: 'Cases & Covers', key: 'Cases & Covers', icon: Shield, desc: 'MagSafe & Armor Covers', gradient: 'from-purple-600 via-pink-600 to-rose-600', badge: 'Military Drop' },
  { name: 'Temper Glass', key: 'Temper Glass', icon: Sparkles, desc: '9H Sapphire & Privacy', gradient: 'from-cyan-500 via-blue-600 to-indigo-700', badge: 'Anti-Scratch' },
  { name: 'Wireless Audio', key: 'Wireless Headphones', icon: Zap, desc: 'AirPods & TWS Earbuds', gradient: 'from-emerald-500 via-teal-600 to-cyan-700', badge: 'Spatial Audio' },
  { name: 'Wired EarPods', key: 'Wired Headphones', icon: Headphones, desc: 'Lightning & USB-C Original', gradient: 'from-amber-500 via-orange-600 to-red-600', badge: 'Lossless DAC' },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroRotate, setHeroRotate] = useState({ x: -12, y: 18 });
  const heroRef = useRef(null);

  useEffect(() => {
    getProducts()
      .then(p => { setProducts(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setHeroRotate({
      x: -(y / (rect.height / 2)) * 18,
      y: (x / (rect.width / 2)) * 24,
    });
  };

  const handleHeroMouseLeave = () => {
    setHeroRotate({ x: -8, y: 14 });
  };

  const featured = products.filter(p => p.featured).slice(0, 8);
  const proSeries = products.filter(p => p.name?.toLowerCase().includes('pro')).slice(0, 4);
  const bestsellers = products.filter(p => p.bestseller).slice(0, 4);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ── 3D Interactive Hero Section ── */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-[92vh] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center overflow-hidden py-16"
        style={{ perspective: '1600px' }}
      >
        {/* Animated Background 3D Glow Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-[130px] animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[160px]" />
          <div className="absolute top-10 right-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-[110px]" />
          {/* Subtle 3D grid line floor */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Live Store Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs font-semibold shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>CHENNAI'S PREMIER APPLE DESTINATION</span>
              <span className="text-white/40">•</span>
              <span className="text-white">Shop Open Now</span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08]">
              iPhone 11 to 17 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_2px_25px_rgba(245,158,11,0.3)]">
                PRO & PRO MAX
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Experience the pinnacle of Apple technology. 100% brand new, authentic Apple devices, genuine 9H tempered glass, MagSafe cases, and pure studio audio in Chennai.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/shop?category=iPhone"
                className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/40 hover:shadow-indigo-500/60 transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-2 group"
              >
                <span>Explore All iPhones</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop"
                className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base backdrop-blur-md border border-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                View Accessories
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Shield size={16} className="text-emerald-400" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Truck size={16} className="text-cyan-400" />
                <span>Fast Chennai Delivery</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Award size={16} className="text-amber-400" />
                <span>100% Genuine</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <RefreshCw size={16} className="text-purple-400" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Device Showcase */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div
              className="relative w-72 sm:w-80 h-[480px] sm:h-[520px] transition-transform duration-200 ease-out transform-gpu cursor-grab"
              style={{
                transform: `rotateX(${heroRotate.x}deg) rotateY(${heroRotate.y}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Backglow Ambient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 to-indigo-600/30 rounded-[50px] blur-2xl -z-10 scale-95" />

              {/* 3D Phone Body */}
              <div
                className="w-full h-full rounded-[50px] bg-gradient-to-b from-stone-800 via-stone-900 to-black p-3.5 shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.25)] border-[3px] border-amber-300/40 relative overflow-hidden"
                style={{ transform: 'translateZ(30px)' }}
              >
                {/* Screen Reflection Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-white/5 to-transparent pointer-events-none z-20 rounded-[44px]" />

                {/* Display Area */}
                <div className="w-full h-full rounded-[42px] bg-slate-950 overflow-hidden relative flex flex-col justify-between p-6 border border-stone-700/50">
                  {/* Dynamic Island */}
                  <div className="flex justify-center z-30">
                    <div className="w-28 h-6 bg-black rounded-full border border-stone-800 flex items-center justify-between px-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-950 border border-blue-800" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Inside Display Content */}
                  <div className="space-y-4 my-auto text-center z-10">
                    <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-2xl border border-amber-400/30">
                      <img src="/products/iphone-promax.svg" alt="iPhone 17 Pro Max" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                        TITANIUM FLAGSHIP
                      </span>
                      <h3 className="text-xl font-black text-white mt-2">iPhone 17 Pro Max</h3>
                      <p className="text-amber-300 font-extrabold text-2xl mt-1">₹1,54,900</p>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p>Triple 48MP Periscope Telephoto</p>
                      <p>A19 Pro Chip with Apple Intelligence</p>
                    </div>
                  </div>

                  {/* Bottom Home Indicator */}
                  <div className="w-32 h-1 bg-white/40 rounded-full mx-auto" />
                </div>
              </div>

              {/* Floating 3D Floating Badge 1 */}
              <div
                className="absolute -top-4 -left-6 bg-slate-900/95 backdrop-blur-xl border border-amber-400/40 text-white rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 z-30 animate-float"
                style={{ transform: 'translateZ(70px)' }}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-black">
                  <Star size={18} className="fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-amber-300 font-semibold uppercase">Customer Rating</p>
                  <p className="text-sm font-black text-white">4.9 / 5.0 (2,400+)</p>
                </div>
              </div>

              {/* Floating 3D Floating Badge 2 */}
              <div
                className="absolute -bottom-6 -right-6 bg-slate-900/95 backdrop-blur-xl border border-indigo-400/40 text-white rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 z-30 animate-float"
                style={{ transform: 'translateZ(80px)', animationDelay: '1.2s' }}
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-black">
                  <CheckCircle2 size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-300 font-semibold uppercase">Authenticity</p>
                  <p className="text-sm font-black text-white">100% Genuine Apple</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3D Categories Grid ── */}
      <section className="py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
              EXPLORE OUR COLLECTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 mt-3 tracking-tight">
              Curated Apple Mobile Store
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Only authentic iPhone models, shatter-resistant temper glass, MagSafe cases, and audiophile earphones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.key}
                  to={`/shop?category=${encodeURIComponent(cat.key)}`}
                  className="group relative bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Top Category Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={26} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      {cat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                    <span>Browse Products</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Pro Showcase Section ── */}
      {proSeries.length > 0 && (
        <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                  FLAGSHIP PERFORMANCE
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
                  iPhone Pro & Pro Max Lineup
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Engineered with titanium, triple Pro camera system, and ultra-high dynamic range displays.
                </p>
              </div>
              <Link
                to="/shop?category=iPhone"
                className="text-amber-400 hover:text-amber-300 font-bold text-sm flex items-center gap-1.5"
              >
                <span>View all Pro Models</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {proSeries.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── All Featured Products Grid ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                TOP PICKS TODAY
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 mt-2">
                Featured Products & Accessories
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Everything in stock and ready for immediate dispatch across Chennai and India.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-indigo-600 hover:text-indigo-700 font-bold text-sm flex items-center gap-1.5"
            >
              <span>Explore All ({products.length})</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-3xl bg-gray-100 aspect-square animate-pulse" />
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

      {/* ── Bestsellers Section ── */}
      {bestsellers.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
                <h2 className="text-3xl font-black text-gray-900 mt-2">🔥 Customer Bestsellers</h2>
              </div>
              <Link to="/shop" className="text-indigo-600 font-bold text-sm flex items-center gap-1">
                See all <ChevronRight size={15} />
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

      {/* ── Promotional Express Banner ── */}
      <section className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <Truck size={32} className="text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-3">
            Free Express Delivery in Chennai
          </h2>
          <p className="text-indigo-100 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            Orders placed before 2:00 PM are dispatched same-day with secure insurance and delivery tracking right to your doorstep.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl shadow-xl hover:bg-slate-100 transition-all duration-200 active:scale-95"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
