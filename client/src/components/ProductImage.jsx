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
    setLoaded(false);
  }, [src, fallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-slate-950 flex items-center justify-center ${className}`}>
      {/* Subtle pulse placeholder while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-slate-900 animate-pulse" />
      )}
      <img
        src={imgSrc || fallback}
        alt={alt || name || 'Product Image'}
        onError={handleError}
        onLoad={() => setLoaded(true)}
        loading={priority ? 'eager' : 'lazy'}
        className={`w-full h-full object-contain p-2 transition-all duration-300 ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />
    </div>
  );
};

export default ProductImage;
