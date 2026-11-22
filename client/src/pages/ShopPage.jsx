import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { getProducts } from '../services/api';

const CATEGORIES = ['iPhone', 'Cases & Covers', 'Temper Glass', 'Wireless Headphones', 'Wired Headphones'];
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('default');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getProducts().then(p => { setProducts(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  // Sync URL params → local state
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    setSearchQuery(search);
    setSelectedCategory(category);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    switch (sortBy) {
      case 'price-low': return result.sort((a, b) => a.price - b.price);
      case 'price-high': return result.sort((a, b) => b.price - a.price);
      case 'rating': return result.sort((a, b) => b.rating - a.rating);
      case 'newest': return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default: return result;
    }
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (selectedCategory !== 'All') params.category = selectedCategory;
    setSearchParams(params);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const params = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (cat !== 'All') params.category = cat;
    setSearchParams(params);
    setSidebarOpen(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('default');
    setSearchParams({});
  };

  const hasFilters = searchQuery || selectedCategory !== 'All' || sortBy !== 'default';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex items-center bg-gray-100 rounded-xl px-4 py-2.5 gap-2">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search iPhones, cases, headphones..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-400"
              />
              {searchQuery && (
                <button type="button" onClick={() => { setSearchQuery(''); setSearchParams({}); }}>
                  <X size={14} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </form>

            {/* Sort */}
            <div className="relative hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent outline-none text-sm text-gray-700 pr-6 cursor-pointer appearance-none"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="text-gray-400 absolute right-3 pointer-events-none" />
            </div>

            {/* Filter button (mobile) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700"
            >
              <SlidersHorizontal size={16} />
              Filter
            </button>

            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 whitespace-nowrap">
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                  Search: "{searchQuery}"
                  <button onClick={() => { setSearchQuery(''); setSearchParams({}); }}><X size={12} /></button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                  {selectedCategory}
                  <button onClick={() => handleCategorySelect('All')}><X size={12} /></button>
                </span>
              )}
              <span className="text-xs text-gray-500 self-center">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`w-56 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-2xl shadow-md p-5 sticky top-36">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} />
                Categories
              </h3>
              <div className="space-y-1">
                {['All', ...CATEGORIES].map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                      ${selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Sort By</h3>
                <div className="space-y-1">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-200
                        ${sortBy === opt.value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                {searchQuery && <span className="text-gray-500 font-normal text-base"> for "{searchQuery}"</span>}
              </h2>
              <span className="text-sm text-gray-500">{filteredProducts.length} products</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-md">
                    <div className="skeleton aspect-square" />
                    <div className="p-4 space-y-2">
                      <div className="skeleton h-3 w-1/3" />
                      <div className="skeleton h-4 w-full" />
                      <div className="skeleton h-4 w-2/3" />
                      <div className="skeleton h-10 w-full mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 animate-fade-in">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? `No results for "${searchQuery}"` : 'No products in this category yet'}
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopPage;
