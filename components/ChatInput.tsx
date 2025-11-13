
import React, { useState } from 'react';
import { SendIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <footer className="bg-brand-surface p-4 sticky bottom-0">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a product link here..."
          className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-pink text-white placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-brand-pink text-white p-3 rounded-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 disabled:bg-pink-800 disabled:cursor-not-allowed transition-all duration-300"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </form>
    </footer>
  );
};

export default ChatInput;
