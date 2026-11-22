import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Minus, Plus, ChevronRight, Shield, Truck, RefreshCw, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, discountPercent } from '../utils/formatPrice';
import { getProduct, getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    setAdded(false);
    getProduct(id)
      .then(p => {
        setProduct(p);
        return getProducts();
      })
      .then(all => {
        if (product || true) {
          getProduct(id).then(p => {
            const rel = all.filter(item => item.category === p.category && item.id !== p.id).slice(0, 4);
            setRelated(rel);
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.inStock) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="skeleton aspect-square rounded-3xl" />
          <div className="space-y-4">
            <div className="skeleton h-5 w-1/4" />
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-5 w-1/3" />
            <div className="skeleton h-10 w-1/3 mt-4" />
            <div className="skeleton h-20 w-full mt-4" />
            <div className="skeleton h-14 w-full mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <Link to="/shop" className="btn-primary mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const discount = discountPercent(product.originalPrice, product.price);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="hover:text-indigo-600">Shop</Link>
            <ChevronRight size={14} />
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-indigo-600">{product.category}</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="animate-slide-left">
            <div className="relative bg-gray-50 rounded-3xl overflow-hidden aspect-square">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              {discount > 0 && (
                <span className="absolute top-4 left-4 badge bg-red-500 text-white text-sm px-3 py-1.5">{discount}% OFF</span>
              )}
              {product.bestseller && (
                <span className="absolute top-4 right-4 badge bg-amber-400 text-amber-900 text-sm px-3 py-1.5">🔥 Bestseller</span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="animate-slide-right">
            <span className="badge bg-indigo-100 text-indigo-700 mb-3 inline-block">{product.category}</span>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
                <Star size={14} className="text-green-600 fill-green-600" />
                <span className="text-sm font-bold text-green-700">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-500">{product.reviews?.toLocaleString('en-IN')} reviews</span>
              {product.inStock ? (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1"><Package size={14} /> In Stock ({product.stock} left)</span>
              ) : (
                <span className="text-sm text-red-500 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-sm font-bold text-green-600">Save {formatPrice(product.originalPrice - product.price)}</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8 text-sm">{product.description}</p>

            {/* Quantity */}
            <div className="flex items-center gap-6 mb-8">
              <span className="text-sm font-semibold text-gray-700">Quantity</span>
              <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Minus size={16} />
                </button>
                <span className="w-14 text-center font-bold text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all duration-300 active:scale-95
                  ${added
                    ? 'bg-green-500 text-white'
                    : product.inStock
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-200 hover:shadow-xl'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                <ShoppingCart size={20} />
                {added ? '✓ Added to Cart!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <Link to="/cart" className="sm:w-auto flex items-center justify-center gap-2 py-4 px-8 rounded-2xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold transition-all duration-200 active:scale-95">
                View Cart
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, text: '1 Year Warranty' },
                { icon: Truck, text: 'Free Delivery' },
                { icon: RefreshCw, text: '7-Day Returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                  <Icon size={15} className="text-indigo-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-600">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
