import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, ChevronDown, LogOut, Package, UserCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/api';
import ProductImage from './ProductImage';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { cartCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    getProducts().then(setAllProducts).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
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
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.category.toLowerCase().includes(q.toLowerCase())
        )
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
    { name: 'Wireless Audio / AirPods', query: 'Audio' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-slate-950 text-slate-300 text-[11px] font-semibold tracking-widest uppercase py-2 px-4 text-center border-b border-white/5">
        <span>FREE EXPRESS SHIPPING IN CHENNAI & TAMIL NADU</span>
        <span className="mx-3 opacity-40">|</span>
        <span>CALL / WHATSAPP: +91 9943881393</span>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-slate-950 font-sans">
              NMN<span className="text-blue-600">ORA</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Apple Specialist
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              HOME
            </Link>

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
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full -left-4 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2.5 animate-scale-in">
                  {categories.map((cat) => (
                    <Link
                      key={cat.query}
                      to={`/shop?category=${encodeURIComponent(cat.query)}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/contact" className="hover:text-blue-600 transition-colors">
              CONTACT
            </Link>
          </div>

          {/* Right Action Icons: Search, User Account, Cart */}
          <div className="flex items-center gap-3">
            {/* Search Icon & Popover */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                title="Search Store"
              >
                <Search size={20} />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50">
                  <form onSubmit={handleSearch} className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
                    <Search size={16} className="text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search iPhones, temper glass, cases..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      autoFocus
                      className="bg-transparent outline-none text-xs text-slate-900 w-full placeholder-slate-400 font-medium"
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                        <X size={14} />
                      </button>
                    )}
                  </form>

                  {suggestions.length > 0 && (
                    <div className="mt-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product)}
                          className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-50 p-1 border border-slate-100 shrink-0 flex items-center justify-center">
                            <ProductImage src={product.image} alt={product.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-900 truncate">{product.name}</p>
                            <p className="text-[11px] font-bold text-blue-600">₹{product.price?.toLocaleString('en-IN')}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Customer Account / Auth Dropdown */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-200 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline-block max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={13} className="text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      </div>

                      {isAdmin ? (
                        <>
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-amber-600 hover:bg-slate-50 font-bold"
                          >
                            <span>🛡️ Admin Dashboard</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/my-account"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-semibold"
                          >
                            <UserCircle size={15} />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            to="/my-orders"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-semibold"
                          >
                            <Package size={15} />
                            <span>My Orders</span>
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left font-semibold"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <User size={15} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Shopping Cart Icon with Badge */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag size={21} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-md">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-5 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-blue-600"
            >
              Shop All Products
            </Link>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-blue-600"
            >
              Contact & Support
            </Link>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">Categories</p>
              {categories.map((c) => (
                <Link
                  key={c.query}
                  to={`/shop?category=${encodeURIComponent(c.query)}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <Link
                  to="/my-orders"
                  onClick={() => setMenuOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  My Orders
                </Link>
                <Link
                  to="/my-account"
                  onClick={() => setMenuOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  My Account Profile
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="block py-1.5 text-xs font-semibold text-rose-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-center bg-blue-600 text-white rounded-xl text-xs font-bold uppercase shadow-sm"
                >
                  Customer Sign In
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
