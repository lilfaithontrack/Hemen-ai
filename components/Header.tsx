
import React from 'react';
import { CartIcon } from './icons';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick }) => {
  return (
    <header className="bg-brand-surface sticky top-0 z-20 flex items-center justify-between p-4 shadow-lg">
      <h1 className="text-2xl font-bold text-white tracking-wider">
        <span className="text-brand-pink">Denkuan</span> Shop
      </h1>
      <button
        onClick={onCartClick}
        className="relative text-white hover:text-brand-pink transition-colors duration-300"
        aria-label="Open cart"
      >
        <CartIcon />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-brand-pink rounded-full">
            {cartItemCount}
          </span>
        )}
      </button>
    </header>
  );
};

export default Header;
