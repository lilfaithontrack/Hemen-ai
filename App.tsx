
import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, Product } from './types';
import { MessageType } from './types';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import ChatMessageComponent from './components/ChatMessage';
import Cart from './components/Cart';
import { extractProductDetails } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: Date.now(),
      sender: 'ai',
      type: MessageType.TEXT,
      content: 'Welcome to Denkuan Shop! Paste any product link, and I\'ll fetch the details for you.',
    },
  ]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (url: string) => {
    if (!url.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      type: MessageType.TEXT,
      content: url,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const productDetails = await extractProductDetails(url);
      if (productDetails) {
        const aiProductMessage: ChatMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          type: MessageType.PRODUCT,
          content: { ...productDetails, originalUrl: url },
        };
        setMessages((prev) => [...prev, aiProductMessage]);
      } else {
        throw new Error('Could not extract product details.');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      const aiErrorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        type: MessageType.TEXT,
        content: "I'm sorry, I couldn't get the details from that link. Please try another one.",
      };
      setMessages((prev) => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      if (prev.find(item => item.originalUrl === product.originalUrl)) {
        return prev;
      }
      return [...prev, product];
    });
    setIsCartOpen(true);
  };
  
  const handleRemoveFromCart = (productUrl: string) => {
    setCartItems(prev => prev.filter(item => item.originalUrl !== productUrl));
  };

  return (
    <div className="flex flex-col h-screen bg-brand-bg text-brand-text font-sans">
      <Header cartItemCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg} onAddToCart={handleAddToCart} />
        ))}
        {isLoading && (
          <div className="flex justify-start items-center space-x-2">
            <div className="w-10 h-10 bg-brand-surface rounded-full flex-shrink-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.225-.01.45-.016.675-.016a8.992 8.992 0 015.61 2.083m-5.61-2.083c.31-.223.635-.425.975-.599a11.96 11.96 0 00-3.513-1.01 11.96 11.96 0 00-3.513 1.01c.34.174.665.376.975.599m6.113 5.367c.36-.223.74-.406 1.14-.555a8.965 8.965 0 00-2.825-3.416m-2.825 3.416a8.965 8.965 0 01-2.825-3.416c.4.15.78.332 1.14.555m5.65 1.162a8.963 8.963 0 00-5.65 0m5.65 0a8.963 8.963 0 012.825 3.416m-2.825-3.416a8.963 8.963 0 00-2.825 3.416m0 0l-2.22 3.863m2.22-3.863a2.25 2.25 0 00-1.591 1.591l-2.22 3.863m4.44-5.454l-1.591-1.591M15 14.5l-1.591-1.591" /></svg>
            </div>
            <div className="bg-brand-surface rounded-lg p-3 max-w-sm">
                <LoadingSpinner />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onRemove={handleRemoveFromCart}
      />
    </div>
  );
};

export default App;
