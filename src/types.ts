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
  imageUrl?: string;
  gallery?: string[];
  category: string;
  unit?: string;
  createdAt: any;
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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
