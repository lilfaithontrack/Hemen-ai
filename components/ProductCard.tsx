
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { CartIcon, CheckoutIcon } from './icons';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleCheckout = () => {
    window.open(product.originalUrl, '_blank', 'noopener,noreferrer');
  };

  const placeholderImage = 'https://picsum.photos/400/300';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when the product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product.originalUrl]);

  const imageUrls = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [];

  const handleImageError = () => {
    // If the current image fails, try the next one in the array
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Determine the image to display. Fallback to placeholder if array is empty or all images failed.
  const displayImage = imageUrls[currentImageIndex] || placeholderImage;

  return (
    <div className="bg-brand-surface rounded-lg overflow-hidden shadow-xl max-w-sm border border-gray-700">
      <img
        key={displayImage} // Add key to force re-render if the src string is the same but should be retried
        src={displayImage}
        alt={product.name}
        className="w-full h-56 object-cover"
        onError={handleImageError}
      />
      <div className="p-4">
        <p className="text-sm text-gray-400 mb-1">{product.storeName}</p>
        <h3 className="text-lg font-bold text-white mb-2 truncate">{product.name}</h3>
        <p className="text-brand-text text-sm mb-4 h-20 overflow-y-auto">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-brand-pink">{product.price}</span>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
          >
            <CartIcon />
            <span className="ml-2">Add to Cart</span>
          </button>
          <button
            onClick={handleCheckout}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-pink-600 transition-colors duration-300"
          >
            <CheckoutIcon />
            <span className="ml-2">Checkout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;