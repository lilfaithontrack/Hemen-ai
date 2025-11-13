
import React from 'react';
import type { Product } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (productUrl: string) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove }) => {
  const handleCheckout = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
    
  const placeholderImage = 'https://picsum.photos/400/300';

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-30 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-brand-surface shadow-2xl z-40 transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Your Cart</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </header>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <h3 className="text-lg font-semibold text-white">Your cart is empty</h3>
              <p className="text-gray-400 mt-1">Add products from your chat!</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.originalUrl} className="flex items-start space-x-4 bg-gray-800 p-3 rounded-lg">
                  <img 
                    src={item.imageUrls?.[0] || placeholderImage} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-md" 
                    onError={(e) => { e.currentTarget.src = placeholderImage; }}
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                    <p className="text-brand-pink font-bold">{item.price}</p>
                     <button onClick={() => handleCheckout(item.originalUrl)} className="text-xs text-cyan-400 hover:underline mt-1">
                        View Original
                     </button>
                  </div>
                  <button onClick={() => onRemove(item.originalUrl)} className="text-gray-500 hover:text-red-500 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;