import React, { useState, useEffect, useRef } from 'react';
import { performanceOptimizer } from '../../utils/performance/PerformanceOptimizer';

const LazyImage = ({ src, alt, className, placeholder, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    performanceOptimizer.runWhenIdle(() => {
      console.log('Image loaded:', src);
    });
  };

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${className || ''}`}
      style={{
        minHeight: placeholder ? 'auto' : '200px',
        backgroundColor: '#f0f0f0'
      }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
          loading="lazy"
          {...props}
        />
      )}
      {!isLoaded && placeholder && (
        <div className="image-placeholder">{placeholder}</div>
      )}
    </div>
  );
};

export default LazyImage;
