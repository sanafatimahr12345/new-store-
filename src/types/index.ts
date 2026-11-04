export type ProductCategory = 'all' | 'ghee' | 'honey' | 'pickles' | 'oils' | 'spices';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'ghee' | 'honey' | 'pickles' | 'oils' | 'spices';
  categoryLabel: string;
  description: string;
  longDescription: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image: string;
  sizes: string[];
  defaultSize: string;
  origin: string;
  ingredients: string[];
  nutritionalHighlights: string[];
  inStock: boolean;
  featured?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  id: string; // unique item id = productId + '-' + size
  product: Product;
  size: string;
  quantity: number;
  price: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: 'cod' | 'jazzcash' | 'meezan' | 'bank_transfer';
  transactionRef?: string;
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  date: string;
  status: 'Confirmed' | 'Processing' | 'In Transit' | 'Delivered';
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  productPurchased: string;
  comment: string;
  verified: boolean;
}
