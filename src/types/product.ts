export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  materials: Material[];
  colors: Color[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  inStock: boolean;
}

export interface Material {
  id: string;
  name: string;
  type: 'fabric' | 'wood' | 'metal' | 'leather';
  texture?: string;
  priceModifier: number; // percentage change from base price
}

export interface Color {
  id: string;
  name: string;
  hex: string;
  materialId: string;
}

export interface CartItem {
  product: Product;
  selectedMaterial: Material;
  selectedColor: Color;
  quantity: number;
}