
export interface Product {
  name: string;
  description: string;
  price: string;
  imageUrls: string[];
  storeName: string;
  originalUrl: string;
}

export enum MessageType {
  TEXT = 'text',
  PRODUCT = 'product',
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  type: MessageType;
  content: string | Product;
}