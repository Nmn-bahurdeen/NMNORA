import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';
import ProductImage from './ProductImage';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    getProducts().then(setAllProducts).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
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
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSuggestions([]);
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.id}`);
    setSearchQuery('');
    setSuggestions([]);
    setSearchOpen(false);
  };

  const categories = [
    { name: 'iPhones (11 to 17 Pro Max)', query: 'iPhone' },
    { name: 'Cases & Covers', query: 'Cases & Covers' },
    { name: 'Temper Glass', query: 'Temper Glass' },
    { name: 'Wireless Headphones', query: 'Wireless Headphones' },
    { name: 'Wired Headphones', query: 'Wired Headphones' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* ── Top Announcement Bar (From Reference Design) ── */}
      <div className="bg-black text-gray-300 text-[11px] font-semibold tracking-widest uppercase py-2 px-4 text-center border-b border-white/10">
        <span>FREE EXPRESS SHIPPING ON ORDERS OVER ₹5,000</span>
        <span className="mx-3 opacity-40">|</span>
        <span>30-DAY RISK-FREE RETURNS</span>
      </div>

      {/* ── Main Navigation Bar ── */}
      <nav className="border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tight text-gray-950 font-sans">
                NMN<span className="text-blue-600">ORA</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-gray-700">
              <Link to="/shop" className="hover:text-blue-600 transition-colors">
                SHOP
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors uppercase py-2">
                  <span>CATEGORIES</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoriesOpen && (
                  <div className="absolute top-full -left-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2.5 animate-scale-in">
                    {categories.map(cat => (
                      <Link
                        key={cat.query}
                        to={`/shop?category=${encodeURIComponent(cat.query)}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="block px-4 py-2.5 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50/70 transition-colors capitalize tracking-normal"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/shop?category=iPhone" className="hover:text-blue-600 transition-colors">
                NEW ARRIVALS
              </Link>
              <Link to="/shop" className="hover:text-blue-600 transition-colors">
                BEST SELLERS
              </Link>
              <Link to="/shop" className="text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1">
                <Sparkles size={13} /> DEALS
              </Link>
              <Link to="/admin" className="hover:text-blue-600 transition-colors">
                ADMIN
              </Link>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-4 sm:gap-6 text-gray-700">
              {/* Search Toggle / Box */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                {searchOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50 animate-scale-in">
                    <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-xl px-3.5 py-2.5">
                      <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search devices, cases, accessories..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="bg-transparent outline-none text-xs text-gray-900 w-full font-medium"
                      />
                      {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                          <X size={14} />
                        </button>
                      )}
                    </form>

                    {/* Live suggestions */}
                    {suggestions.length > 0 && (
                      <div className="mt-2 divide-y divide-gray-50 max-h-72 overflow-y-auto">
                        {suggestions.map(product => (
                          <button
                            key={product.id}
                            onClick={() => handleSuggestionClick(product)}
                            className="w-full flex items-center gap-3 p-2 hover:bg-blue-50/60 rounded-xl transition-colors text-left"
                          >
                            <ProductImage
                              src={product.image}
                              name={product.name}
                              category={product.category}
                              className="w-10 h-10 rounded-lg shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-gray-900 truncate">{product.name}</p>
                              <p className="text-[11px] font-bold text-blue-600">₹{product.price?.toLocaleString('en-IN')}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Account icon */}
              <Link to="/admin" className="hidden sm:block p-2 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors" title="Admin Account">
                <User size={20} />
              </Link>

              {/* Shopping Cart Icon with Royal Blue badge */}
              <Link to="/cart" className="relative p-2 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingBag size={21} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-md">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle Menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-5 py-4 space-y-3 animate-fade-in-up">
            <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-xl px-3.5 py-2.5 mb-3">
              <Search size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-transparent outline-none text-xs text-gray-900 w-full font-medium"
              />
            </form>

            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-xs font-bold uppercase tracking-wider text-gray-800 hover:text-blue-600"
            >
              Shop All Products
            </Link>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] font-black uppercase text-gray-400 tracking-wider mb-2">Categories</p>
              {categories.map(c => (
                <Link
                  key={c.query}
                  to={`/shop?category=${encodeURIComponent(c.query)}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-xs font-bold uppercase tracking-wider text-gray-800 hover:text-blue-600"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
