import React, { useState } from 'react';
import { AVATAR_COLORS } from '../utils/avatarGenerator';

interface AvatarImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  themeColor?: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackText,
  themeColor
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const initial = (fallbackText || alt || 'J').charAt(0).toUpperCase();
  const color = themeColor || '#8b5cf6';

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Fallback avatar with vibrant initial and glowing background */}
      {(!isLoaded || hasError) && (
        <div
          className="absolute inset-0 flex items-center justify-center font-display font-black text-white text-base select-none"
          style={{
            background: `radial-gradient(circle at center, ${color} 0%, #1e1b4b 100%)`
          }}
        >
          {initial}
        </div>
      )}

      {/* Actual Avatar Image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
        />
      )}
    </div>
  );
};
