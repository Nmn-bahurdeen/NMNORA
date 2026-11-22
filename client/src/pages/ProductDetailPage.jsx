import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { getProduct, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} className={`w-5 h-5 ${s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))}
    <span className="text-gray-500 text-sm ml-1">({rating})</span>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    getProduct(id)
      .then(data => {
        setProduct(data);
        return getProducts().then(all =>
          setRelated(all.filter(p => p.category === data.category && p.id !== data.id).slice(0, 6))
        );
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><LoadingSpinner /></div>;
  if (!product) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <p className="text-2xl">😕</p>
      <p className="text-gray-600">Product not found.</p>
      <button onClick={() => navigate('/shop')} className="btn-primary">Back to Shop</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Product layout */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="bg-gray-50 p-8 flex items-center justify-center min-h-[400px]">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-96 w-full object-contain rounded-xl"
                onError={e => { e.target.src = 'https://via.placeholder.com/400?text=No+Image'; }}
              />
            </div>

            {/* Details */}
            <div className="p-8 flex flex-col justify-center">
              <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>
              <StarRating rating={product.rating} />
              <p className="text-gray-500 text-sm mt-1 mb-4">{product.reviews} reviews</p>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-extrabold text-indigo-600">${product.price?.toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice?.toFixed(2)}</span>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

              <div className={`inline-flex items-center gap-1 text-xs font-semibold mb-6 ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {product.inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-lg transition-colors ${
                  added
                    ? 'bg-green-500 text-white'
                    : product.inStock
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {related.map(p => (
                <div key={p.id} className="flex-shrink-0 w-56">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
