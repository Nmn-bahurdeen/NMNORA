import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    getProducts().then(setAllProducts).catch(() => {});
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 1) {
      const filtered = allProducts
        .filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setMenuOpen(false);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.id}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const { formatPrice } = (() => {
    const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
    return { formatPrice: fmt };
  })();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop?category=iPhone', label: 'iPhones' },
    { to: '/shop?category=Cases & Covers', label: 'Cases' },
    { to: '/admin', label: 'Admin' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 rounded-xl p-1.5 group-hover:bg-indigo-700 transition-colors">
              <Smartphone className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              NMN<span className="text-indigo-600">ORA</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition-all duration-200 px-3 py-1.5 rounded-lg text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="hidden md:flex relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="flex items-center bg-gray-100 hover:bg-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 rounded-xl px-3 py-2 w-64 transition-all duration-200">
              <Search className="text-gray-400 w-4 h-4 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search iPhones, cases..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-400"
              />
            </form>
            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-scale-in">
                {suggestions.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors text-left"
                  >
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-indigo-600 font-semibold">{formatPrice(product.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart + Hamburger */}
          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative p-2 hover:bg-indigo-50 rounded-xl transition-colors">
              <ShoppingCart className="text-gray-700 hover:text-indigo-600 w-6 h-6 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse-glow">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-fade-in-up">
            <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-xl px-3 py-2 mb-4">
              <Search className="text-gray-400 w-4 h-4 mr-2" />
              <input
                type="text"
                placeholder="Search iPhones, cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm text-gray-700 w-full"
              />
            </form>
            <div className="space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block py-2.5 px-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition-colors rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
