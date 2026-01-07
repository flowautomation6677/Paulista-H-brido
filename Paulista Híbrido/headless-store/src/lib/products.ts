export interface Product {
  id: string; // Nuvemshop Product ID
  name: string;
  shape: 'oval' | 'square' | 'round' | 'universal' | 'unknown';
  dimensions?: string;
  price: number;
  originalPrice?: number; // For "De: R$ XX,XX"
  imageUrl?: string;
  images?: string[]; // Multiple images for carousel
  holeDistance?: string; // e.g. "15cm"
  technicalDiagramUrl?: string; // URL for the measurement diagram
  features?: string[]; // Bullet points like "Batida Suave", "Acabamento impecável"
  rating?: {
    stars: number;
    count: number;
  };
  testimonial?: {
    name: string;
    text: string;
  };
}

export interface ProductRecommendations {
  best: Product;
  economy?: Product;
  luxury?: Product;
}

// Mock Database - TO BE REPLACED WITH REAL NUVEMSHOP IDs
export const PRODUCTS: Product[] = [
  {
    id: '123456789', // Example ID
    name: 'Assento Sanitário Almofadado Oval Premium',
    shape: 'oval',
    price: 189.90,
    originalPrice: 220,
    holeDistance: '15cm',
    features: ['O melhor custo-benefício', 'Batida Suave (Não faz barulho)', 'Acabamento impecável e fácil limpeza'],
    rating: { stars: 5, count: 42 },
    images: ['/images/assento-oval-premium-1.jpg', '/images/assento-oval-premium-2.jpg', '/images/assento-oval-premium-3.jpg'],
    testimonial: {
      name: 'Ana P.',
      text: 'Encaixou perfeito no meu vaso Deca oval. Instalação fácil.'
    }
  },
  {
    id: '987654321',
    name: 'Assento Quadrado Premium',
    shape: 'square',
    price: 189.9,
    originalPrice: 220,
    imageUrl: '/images/quadrado-branco.png',
    images: ['/images/assento-premium-1.png', '/images/assento-premium-2.png', '/images/assento-quadrado-3.png'],
    holeDistance: '15cm',
    features: ['O melhor custo-benefício', 'Fecha sem barulho (Soft Close)', 'Acabamento impecável e fácil limpeza'],
    rating: { stars: 5, count: 42 },
    testimonial: {
      name: 'Carlos M.',
      text: 'Design moderno e serviu certinho no modelo da Incepa.'
    }
  },
  {
    id: '456789123',
    name: 'Assento Redondo (Padrão)',
    shape: 'universal',
    price: 79.9,
    imageUrl: '/images/redondo-comum.png',
    holeDistance: '15cm',
    features: ['Solução econômica', 'Instalação simples', 'Material resistente'],
    testimonial: {
      name: 'Mariana S.',
      text: 'Simples e funcional. Resolveu meu problema.'
    }
  },
  {
    id: 'round-premium',
    name: 'Assento Sanitário Almofadado Redondo',
    shape: 'universal',
    price: 189.90,
    originalPrice: 199.90,
    holeDistance: '15cm',
    features: ['Fechamento Suave (Não bate)', 'Acabamento Premium', 'Fácil limpeza'],
    rating: { stars: 5, count: 30 },
    images: ['/images/redondo-comum.png'],
    testimonial: {
      name: 'Julia C.',
      text: 'Muito melhor que o comum. Vale o preço.'
    }
  },
  // ECONOMY & LUXURY MOCKS
  {
    id: 'eco-round',
    name: 'Assento Sanitário Universal Polipropileno',
    shape: 'universal',
    price: 79.90,
    features: ['Versão econômica adaptável', 'Instalação simples para vasos padrões'],
    imageUrl: '/images/assento-redondo-basico-1.png'
  },
  {
    id: 'eco-square',
    name: 'Assento Rígido Classique Paris/Sabatini',
    shape: 'square',
    price: 119.90,
    features: ['Opção simples em plástico rígido', 'Resistente', 'A tampa bate ao fechar (não é soft close)'],
    imageUrl: '/images/quadrado-branco.png' // Using same image for now or placeholder
  },
  {
    id: 'lux-square',
    name: 'Versão Luxo (Resina)',
    shape: 'square',
    price: 409.9,
    features: ['Alto Brilho e Design'],
    imageUrl: '/images/quadrado-astra.png'
  },
  {
    id: 'lux-oval',
    name: 'Versão Luxo (Resina)',
    shape: 'oval',
    price: 409.9,
    features: ['Alto Brilho e Design', 'Cores Exclusivas', 'Incluso: Borboleta Azul'],
    imageUrl: '/images/resina-oval-borboleta-azul.jpg',
    images: ['/images/resina-oval-borboleta-azul.jpg', '/images/resina-borboleta-azul-aberto.jpg', '/images/resina-oval-preta.jpg']
  },
  {
    id: 'lux-round',
    name: 'Versão Luxo (Resina)',
    shape: 'universal',
    price: 409.9,
    features: ['Alto Brilho e Design', 'Cores Exclusivas', 'Modelo: Peixes'],
    imageUrl: '/images/resina-vermelha-peixes.jpg',
    images: ['/images/resina-vermelha-peixes.jpg', '/images/resina-vermelha-peixes-aberto.jpg', '/images/resina-preta-peixes.jpg']
  }
];

export function getRecommendations(shape: string): ProductRecommendations | null {
  let mainProduct = PRODUCTS.find(p => p.shape === shape && !p.id.startsWith('eco-') && !p.id.startsWith('lux-') && p.id !== 'round-premium');

  if (!mainProduct) return null;

  // Mocking logic to find eco and luxury for square, others can be just main for now
  let economy: Product | undefined;
  let luxury: Product | undefined;

  if (shape === 'square') {
    economy = PRODUCTS.find(p => p.id === 'eco-square');
    luxury = PRODUCTS.find(p => p.id === 'lux-square');
  } else if (shape === 'oval') {
    economy = {
      id: 'eco-oval',
      name: 'Assento Sanitário Universal Polipropileno',
      shape: 'oval',
      price: 79.90,
      features: ['O modelo de entrada', 'Plástico fino e funcional', 'Para quem quer economizar ao máximo'],
      imageUrl: '/images/assento-oval-premium-1.jpg'
    };
    luxury = PRODUCTS.find(p => p.id === 'lux-oval');
  } else if (shape === 'universal') {
    economy = PRODUCTS.find(p => p.id === 'eco-round');
    luxury = PRODUCTS.find(p => p.id === 'lux-round');
  }

  // Override mainProduct for Universal to choose Premium one if available
  if (shape === 'universal') {
    const premiumRound = PRODUCTS.find(p => p.id === 'round-premium');
    if (premiumRound) mainProduct = premiumRound;
  }

  return {
    best: mainProduct,
    economy,
    luxury
  };
}


export function getCheckoutUrl(product: Product): string {
  // Redirect to WhatsApp for purchase negotiation
  return getWhatsAppUrl(`Olá! Quero comprar o ${product.name} (R$ ${product.price.toFixed(2)}). Como prosseguir?`);
}

export function getWhatsAppUrl(text: string): string {
  const PHONE = '552131025898'; // Updated Client Number
  const sourceTag = " (Vim do Google)";
  const encodedText = encodeURIComponent(text + sourceTag);
  return `https://wa.me/${PHONE}?text=${encodedText}`;
}
