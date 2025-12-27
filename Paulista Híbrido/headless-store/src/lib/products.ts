export interface Product {
  id: string; // Nuvemshop Product ID
  name: string;
  shape: 'oval' | 'square' | 'round' | 'universal' | 'unknown';
  dimensions?: string;
  price: number;
  imageUrl?: string;
}

// Mock Database - TO BE REPLACED WITH REAL NUVEMSHOP IDs
export const PRODUCTS: Product[] = [
  {
    id: '123456789', // Example ID
    name: 'Assento Sanitário Oval Premium',
    shape: 'oval',
    price: 149.90,
  },
  {
    id: '987654321',
    name: 'Assento Sanitário Quadrado Soft Close',
    shape: 'square',
    price: 189.90,
  },
  {
    id: '456789123',
    name: 'Assento Universal Básico',
    shape: 'universal',
    price: 89.90,
  }
];

export function findProduct(shape: string): Product | undefined {
  return PRODUCTS.find(p => p.shape === shape);
}

export function getCheckoutUrl(productId: string): string {
    // Direct link to Nuvemshop cart
    // Format: https://YOUR_STORE.com.br/carrinho/adicionar/PRODUCT_ID
    // Using a placeholder domain for now.
    const STORE_DOMAIN = 'https://loja-exemplo-nuvemshop.com.br'; 
    return `${STORE_DOMAIN}/carrinho/adicionar/${productId}`;
}

export function getWhatsAppUrl(text: string): string {
    const PHONE = '5511999999999'; // Replace with Client's Number
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${PHONE}?text=${encodedText}`;
}
