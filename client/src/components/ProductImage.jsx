import { useState, useEffect } from 'react';

const getCategoryFallback = (name = '', category = '') => {
  const n = (name + ' ' + category).toLowerCase();
  if (n.includes('pro max')) return '/products/iphone-promax.svg';
  if (n.includes('pro')) return '/products/iphone-pro.svg';
  if (n.includes('iphone')) return '/products/iphone-base.svg';
  if (n.includes('temper') || n.includes('glass')) return '/products/temperglass.svg';
  if (n.includes('case') || n.includes('cover')) return '/products/phonecase.svg';
  if (n.includes('wired') || n.includes('earpod') || n.includes('basshead')) return '/products/earpods.svg';
  if (n.includes('wireless') || n.includes('airpod') || n.includes('airdopes') || n.includes('headphone') || n.includes('jbl') || n.includes('rockerz')) return '/products/airpods.svg';
  return '/products/iphone-promax.svg';
};

const ProductImage = ({ src, alt = '', name = '', category = '', className = '', priority = false }) => {
  const fallback = getCategoryFallback(name, category);
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallback);
    setHasError(false);
  }, [src, fallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-100 flex items-center justify-center ${className}`}>
      {/* Clean subtle shimmer while loading */}
      {!loaded && !hasError && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
      )}
      <img
        src={imgSrc || fallback}
        alt={alt || name || 'Product Image'}
        onError={handleError}
        onLoad={() => setLoaded(true)}
        loading={priority ? 'eager' : 'lazy'}
        className="w-full h-full object-contain p-3.5 transition-all duration-300 drop-shadow-md group-hover:scale-105"
      />
    </div>
  );
};

export default ProductImage;
