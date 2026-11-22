import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, discountPercent } from '../utils/formatPrice';
import { Star, ShoppingCart, Sparkles, Eye } from 'lucide-react';
import ProductImage from './ProductImage';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const discount = discountPercent(product.originalPrice, product.price);
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate 3D tilt angles
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const isPro = product.name?.toLowerCase().includes('pro');

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group transition-all duration-300 ease-out cursor-pointer select-none"
      style={{
        perspective: '1200px',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden border border-gray-100/80 shadow-md hover:shadow-2xl transition-all duration-300 transform-gpu"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(10px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic 3D Glare Light Reflection */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-3xl"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 65%)`,
            opacity: glare.opacity,
          }}
        />

        <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square group">
          {/* Product Image with Fallback */}
          <ProductImage
            src={product.image}
            alt={product.name}
            name={product.name}
            category={product.category}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {discount > 0 && (
              <span className="badge bg-red-600 text-white font-black shadow-lg shadow-red-500/30 text-xs px-2.5 py-1">
                {discount}% OFF
              </span>
            )}
            {product.bestseller && (
              <span className="badge bg-amber-400 text-amber-950 font-black shadow-md text-xs px-2.5 py-1 flex items-center gap-1">
                🔥 Bestseller
              </span>
            )}
            {isPro && !product.bestseller && (
              <span className="badge bg-indigo-600 text-white font-bold shadow-md text-xs px-2.5 py-1 flex items-center gap-1">
                <Sparkles size={11} /> PRO SERIES
              </span>
            )}
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20">
              <span className="text-white font-bold text-xs bg-red-600/90 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}

          {/* Quick View Button on Hover */}
          <div className="absolute inset-x-0 bottom-3 px-3 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
            <span className="bg-white/90 backdrop-blur-md text-gray-900 font-semibold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-white">
              <Eye size={13} /> View Specs
            </span>
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-4 bg-white relative z-10">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.8'}</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-indigo-600 transition-colors h-10">
              {product.name}
            </h3>
          </Link>

          {/* Price & Action */}
          <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-100">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium block">
                Free Delivery Chennai
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (product.inStock) addToCart(product);
              }}
              disabled={!product.inStock}
              className={`p-2.5 rounded-xl transition-all duration-200 active:scale-90 flex items-center justify-center ${
                product.inStock
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title={product.inStock ? 'Add to Cart' : 'Out of Stock'}
              aria-label="Add to cart"
            >
              <ShoppingCart size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
