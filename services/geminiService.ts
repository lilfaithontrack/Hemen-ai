import { GoogleGenAI } from '@google/genai';
import type { Product } from '../types';

// Initialize the Google AI client. The execution environment is expected to 
// provide the API key via process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractProductDetails = async (url: string): Promise<Omit<Product, 'originalUrl'> | null> => {
  let rawResponseText = '';
  try {
    const prompt = `
      Based on the content of this URL: ${url}, please extract the product information.
      
      I need you to provide the following details in a valid JSON object format:
      - "name": The full name of the product.
      - "description": A concise and appealing description of the product, limited to 2-3 sentences.
      - "price": The accurate price of the product as a string, including the currency symbol (e.g., "$19.99", "£25.00").
      - "imageUrls": An array of direct, public, and working URLs to high-quality images of the product. Prioritize the main product images. Provide at least one URL, and up to 3 if available.
      - "storeName": The name of the online store selling the product (e.g., "Amazon", "Nike", "Etsy").
      
      Your entire response must be ONLY the raw JSON object itself, without any surrounding text, explanations, or markdown formatting like \`\`\`json.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Upgraded to a more capable model for complex pages
      contents: prompt,
      config: {
        // Use Google Search grounding to allow the model to access the URL content.
        tools: [{googleSearch: {}}],
      },
    });

    rawResponseText = response.text;
    let jsonString = rawResponseText.trim();
    
    // Defensive parsing in case the model includes markdown.
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7, -3).trim();
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.slice(3, -3).trim();
    }
    
    if (!jsonString) {
        console.error("Gemini API returned an empty response.");
        return null;
    }

    const productData = JSON.parse(jsonString);

    if (!productData.imageUrls || !Array.isArray(productData.imageUrls) || productData.imageUrls.length === 0) {
      console.error("Gemini API did not return a valid 'imageUrls' array.");
      return null;
    }

    return productData as Omit<Product, 'originalUrl'>;

  } catch (error) {
    console.error('Error calling Gemini API or parsing response:', error);
    // Log the raw text response if it exists and parsing fails, to aid debugging.
    if (error instanceof SyntaxError && rawResponseText) {
        console.error("Failed to parse JSON from model response. Raw text:", rawResponseText);
    }
    return null;
  }
};