import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Star } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
  { name: 'Electronics', emoji: '💻' },
  { name: 'Clothing', emoji: '👕' },
  { name: 'Home & Living', emoji: '🏠' },
  { name: 'Books', emoji: '📚' },
  { name: 'Sports', emoji: '⚽' },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = products.filter(p => p.featured);
  const bestsellers = products.filter(p => p.bestseller);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Discover Amazing Products
          </h1>
          <p className="text-indigo-100 text-xl mb-8 max-w-2xl mx-auto">
            Shop thousands of curated products across electronics, fashion, home, books, and more — all at unbeatable prices.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Shop Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Truck, label: 'Free Delivery', sub: 'On orders above $50' },
            { icon: Shield, label: 'Secure Payments', sub: '100% protected' },
            { icon: RotateCcw, label: 'Easy Returns', sub: '30-day return policy' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon className="text-indigo-600 w-7 h-7" />
              <p className="font-semibold text-gray-900 text-sm">{label}</p>
              <p className="text-gray-500 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="card flex flex-col items-center justify-center p-6 hover:border-indigo-300 border border-transparent transition-all group"
            >
              <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="font-semibold text-gray-800 text-sm text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/shop" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">No featured products available.</p>
        )}
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-8 text-white text-center">
          <Truck className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h3 className="text-2xl font-bold mb-1">Free Delivery on Orders Above $50</h3>
          <p className="text-indigo-100 mb-4">Shop more, save more on shipping costs!</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-white text-indigo-600 font-bold px-6 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-6">
            <Star className="text-yellow-400 fill-yellow-400 w-6 h-6" />
            <h2 className="text-3xl font-bold text-gray-900">Bestsellers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestsellers.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;
