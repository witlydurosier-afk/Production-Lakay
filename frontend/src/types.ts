export interface ProductPrice {
  label: string;
  value: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number; // Base price
  prices?: ProductPrice[]; // Variations
  // Backend retourne snake_case
  image_url?: string;
  gallery?: string[];
  category: string;
  unit?: string;
  is_available?: boolean;
  created_at?: any;
  updated_at?: any;
  // Alias camelCase (compatibilité locale)
  imageUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  selectedVariation?: string;
  note?: string;
}

