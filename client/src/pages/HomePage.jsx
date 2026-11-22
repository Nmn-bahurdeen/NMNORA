import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, Headphones, ArrowRight, ChevronRight, Sparkles, Smartphone, Shield, Zap } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { getProducts } from '../services/api';

const CATEGORIES = [
  { name: 'iPhones & Pro Series', key: 'iPhone', icon: Smartphone, count: '19 Models', desc: 'Titanium & Bionic Performance' },
  { name: 'MagSafe Cases & Covers', key: 'Cases & Covers', icon: Shield, count: '5 Collections', desc: 'Shockproof Military Defense' },
  { name: '9H Tempered Glass', key: 'Temper Glass', icon: Sparkles, count: '7 Varieties', desc: 'Sapphire & Privacy Crystal Clear' },
  { name: 'Wireless Audio & TWS', key: 'Wireless Headphones', icon: Zap, count: '4 Models', desc: 'Spatial Sound & Active ANC' },
  { name: 'Original Wired EarPods', key: 'Wired Headphones', icon: Headphones, count: '3 Types', desc: 'Lightning & USB-C High-Res DAC' },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(p => { setProducts(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const featured = products.filter(p => p.featured).slice(0, 8);
  const bestsellers = products.filter(p => p.bestseller).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* ── LUXURY STUDIO HERO SECTION (Reference: Next Level Tech) ── */}
      <section className="relative bg-[#06080e] text-white overflow-hidden min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Subtle studio glow & laser beams */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 -left-20 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-sky-500/15 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Reference Kicker */}
              <div className="text-blue-400 font-bold tracking-[0.25em] text-xs sm:text-sm uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                NEXT LEVEL TECH. ELEVATED.
              </div>

              {/* Reference Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-black tracking-tight leading-[1.08] text-white uppercase font-sans">
                ENGINEERED <br />
                FOR PERFORMANCE. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  BUILT FOR YOU.
                </span>
              </h1>

              {/* Reference Subtext */}
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
                Premium gadgets. Cutting-edge technology. <br className="hidden sm:inline" />
                Designed to enhance the way you live, work, and play.
              </p>

              {/* Reference Two Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  to="/shop"
                  className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/shop"
                  className="border border-white/20 hover:border-white/50 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 rounded-lg transition-all duration-200 hover:bg-white/5 hover:-translate-y-0.5"
                >
                  EXPLORE COLLECTIONS
                </Link>
              </div>
            </div>

            {/* Right Studio Product Visual on Pedestal */}
            <div className="lg:col-span-6 flex justify-center items-center relative">
              <div className="relative w-full max-w-[580px] aspect-[4/3] rounded-3xl overflow-hidden flex items-center justify-center">
                <img
                  src="/images/hero-studio-headphone.svg"
                  alt="Flagship Performance Gear on Studio Pedestal"
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(2,132,199,0.25)] hover:scale-102 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4-FEATURE TRUST STRIP (Exactly Matching Reference Bottom Strip) ── */}
      <section className="bg-[#0b0e14] border-t border-b border-gray-800 text-gray-300 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Feature 1: Free Delivery */}
            <div className="flex items-center gap-3.5">
              <div className="text-gray-300 shrink-0">
                <Truck size={24} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-wider text-white">FREE EXPRESS DELIVERY</p>
                <p className="text-[11px] text-gray-400">On orders over ₹5,000</p>
              </div>
            </div>

            {/* Feature 2: Easy Returns */}
            <div className="flex items-center gap-3.5">
              <div className="text-gray-300 shrink-0">
                <RotateCcw size={24} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-wider text-white">30-DAY EASY RETURNS</p>
                <p className="text-[11px] text-gray-400">Hassle-free returns</p>
              </div>
            </div>

            {/* Feature 3: Warranty */}
            <div className="flex items-center gap-3.5">
              <div className="text-gray-300 shrink-0">
                <ShieldCheck size={24} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-wider text-white">2-YEAR WARRANTY</p>
                <p className="text-[11px] text-gray-400">Premium coverage</p>
              </div>
            </div>

            {/* Feature 4: Expert Support */}
            <div className="flex items-center gap-3.5">
              <div className="text-gray-300 shrink-0">
                <Headphones size={24} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-wider text-white">24/7 EXPERT SUPPORT</p>
                <p className="text-[11px] text-gray-400">We're here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRENDING CATEGORIES ── */}
      <section className="py-16 sm:py-20 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold text-blue-600 tracking-widest uppercase">
                PREMIUM SELECTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1 uppercase tracking-tight">
                SHOP BY CATEGORY
              </h2>
            </div>
            <Link to="/shop" className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1">
              <span>View All Categories</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.key}
                  to={`/shop?category=${encodeURIComponent(cat.key)}`}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                      {cat.count}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] font-bold text-blue-600">
                    <span>Explore</span>
                    <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS GRID ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold text-blue-600 tracking-widest uppercase">
                NEW ARRIVALS & TRENDING
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1 uppercase tracking-tight">
                FEATURED PRODUCTS
              </h2>
            </div>
            <Link to="/shop" className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1">
              <span>View All ({products.length})</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-100 aspect-square animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      {bestsellers.length > 0 && (
        <section className="py-16 bg-gray-50/70 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11px] font-bold text-rose-600 tracking-widest uppercase">
                  TOP CUSTOMER CHOICES
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1 uppercase tracking-tight">
                  BEST SELLERS
                </h2>
              </div>
              <Link to="/shop" className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1">
                <span>See All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {bestsellers.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CHENNAI STORE ASSURANCE BANNER ── */}
      <section className="bg-black text-white py-14 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-blue-400 font-bold text-xs tracking-widest uppercase mb-2 inline-block">
            AUTHENTIC QUALITY PROMISE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4">
            CERTIFIED GENUINE GEAR. DELIVERED DIRECTLY TO YOU.
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
            NMNORA offers authentic products with full warranty support. Located at 123 Commerce Street, Chennai – 600 048. Contact our support team directly at +91 99438 81393.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase px-7 py-3 rounded-lg transition-colors"
            >
              SHOP THE STORE
            </Link>
            <a
              href="tel:9943881393"
              className="border border-white/20 hover:border-white/50 text-white font-semibold text-xs tracking-wider uppercase px-7 py-3 rounded-lg transition-colors"
            >
              CALL +91 99438 81393
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
