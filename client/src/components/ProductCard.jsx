import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, discountPercent } from '../utils/formatPrice';
import { Star, ShoppingCart, Zap } from 'lucide-react';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const discount = discountPercent(product.originalPrice, product.price);

  return (
    <div
      className="card group cursor-pointer overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <Link to={`/product/${product.id}`}>
        {/* Image container */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="badge bg-red-500 text-white">{discount}% OFF</span>
            )}
            {product.bestseller && (
              <span className="badge bg-amber-400 text-amber-900">🔥 Bestseller</span>
            )}
            {product.featured && !product.bestseller && (
              <span className="badge bg-indigo-600 text-white">Featured</span>
            )}
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mt-1 mb-2 text-sm leading-snug line-clamp-2 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews?.toLocaleString('en-IN')})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-black text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (product.inStock) addToCart(product);
          }}
          disabled={!product.inStock}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95
            ${product.inStock
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-200 hover:shadow-lg'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          <ShoppingCart size={15} />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
