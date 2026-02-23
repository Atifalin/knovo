export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  images: string[];
  featured: boolean;
  importedBrand?: string;
  material?: string;
  color?: string;
  pattern?: string;
  active: boolean;
  lowStockThreshold: number;
  categoryId: string;
  category: { name: string; slug: string };
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: { products: number };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; images: string[] };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: PaginationMeta;
}

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface OrderBreakdown {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}
