import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating})</span>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      className="card cursor-pointer group overflow-hidden"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = 'https://via.placeholder.com/400?text=No+Image'; }}
        />
      </div>

      <div className="p-4">
        {/* Category badge */}
        <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="text-gray-900 font-semibold text-sm mb-1 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <StarRating rating={product.rating} />

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-indigo-600 font-bold text-lg">${product.price?.toFixed(2)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-gray-400 text-sm line-through">${product.originalPrice?.toFixed(2)}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
