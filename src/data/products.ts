import { Product } from '@/types/product';
import sofaImage from '@/assets/sofa-beige.jpg';
import chairImage from '@/assets/chair-oak.jpg';
import tableImage from '@/assets/table-walnut.jpg';
import bookshelfImage from '@/assets/bookshelf-pine.jpg';

export const products: Product[] = [
  {
    id: 'sofa-01',
    name: 'Nordic Comfort Sofa',
    category: 'Seating',
    price: 1299,
    description: 'Luxurious three-seater sofa with premium cushioning and timeless design. Perfect for modern living spaces.',
    image: sofaImage,
    dimensions: { width: 210, height: 85, depth: 95 },
    inStock: true,
    materials: [
      { id: 'fabric-linen', name: 'Linen', type: 'fabric', priceModifier: 0 },
      { id: 'fabric-velvet', name: 'Velvet', type: 'fabric', priceModifier: 15 },
      { id: 'leather-genuine', name: 'Genuine Leather', type: 'leather', priceModifier: 25 },
    ],
    colors: [
      { id: 'beige', name: 'Warm Beige', hex: '#F5E6D3', materialId: 'fabric-linen' },
      { id: 'charcoal', name: 'Charcoal', hex: '#3A3A3A', materialId: 'fabric-linen' },
      { id: 'forest', name: 'Forest Green', hex: '#2F5233', materialId: 'fabric-velvet' },
      { id: 'terracotta', name: 'Terracotta', hex: '#C65D32', materialId: 'fabric-velvet' },
      { id: 'cognac', name: 'Cognac', hex: '#A0522D', materialId: 'leather-genuine' },
    ]
  },
  {
    id: 'chair-01',
    name: 'Artisan Dining Chair',
    category: 'Seating',
    price: 289,
    description: 'Handcrafted solid oak dining chair with ergonomic design and natural finish.',
    image: chairImage,
    dimensions: { width: 45, height: 80, depth: 55 },
    inStock: true,
    materials: [
      { id: 'wood-oak', name: 'Oak', type: 'wood', priceModifier: 0 },
      { id: 'wood-walnut', name: 'Walnut', type: 'wood', priceModifier: 20 },
      { id: 'wood-cherry', name: 'Cherry', type: 'wood', priceModifier: 15 },
    ],
    colors: [
      { id: 'natural', name: 'Natural', hex: '#D2B48C', materialId: 'wood-oak' },
      { id: 'honey', name: 'Honey', hex: '#DAA520', materialId: 'wood-oak' },
      { id: 'dark-walnut', name: 'Dark Walnut', hex: '#654321', materialId: 'wood-walnut' },
      { id: 'cherry-red', name: 'Cherry', hex: '#8B4513', materialId: 'wood-cherry' },
    ]
  },
  {
    id: 'table-01',
    name: 'Metropolitan Coffee Table',
    category: 'Tables',
    price: 649,
    description: 'Contemporary coffee table featuring rich walnut wood top with sleek metal legs.',
    image: tableImage,
    dimensions: { width: 120, height: 45, depth: 60 },
    inStock: true,
    materials: [
      { id: 'wood-walnut-table', name: 'Walnut Top', type: 'wood', priceModifier: 0 },
      { id: 'wood-oak-table', name: 'Oak Top', type: 'wood', priceModifier: -10 },
    ],
    colors: [
      { id: 'walnut-natural', name: 'Natural Walnut', hex: '#5D4037', materialId: 'wood-walnut-table' },
      { id: 'oak-light', name: 'Light Oak', hex: '#D2B48C', materialId: 'wood-oak-table' },
    ]
  },
  {
    id: 'bookshelf-01',
    name: 'Scandinavian Bookshelf',
    category: 'Storage',
    price: 459,
    description: 'Clean-lined bookshelf in sustainable pine wood with adjustable shelves.',
    image: bookshelfImage,
    dimensions: { width: 80, height: 180, depth: 35 },
    inStock: true,
    materials: [
      { id: 'wood-pine', name: 'Pine', type: 'wood', priceModifier: 0 },
      { id: 'wood-birch', name: 'Birch', type: 'wood', priceModifier: 12 },
    ],
    colors: [
      { id: 'pine-natural', name: 'Natural Pine', hex: '#F5DEB3', materialId: 'wood-pine' },
      { id: 'pine-white', name: 'White Stain', hex: '#F8F8FF', materialId: 'wood-pine' },
      { id: 'birch-light', name: 'Light Birch', hex: '#E6D2B5', materialId: 'wood-birch' },
    ]
  }
];