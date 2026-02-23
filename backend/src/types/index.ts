import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ProductFilterQuery extends PaginationQuery {
  category?: string;
  color?: string;
  material?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest';
  search?: string;
  featured?: string;
}

export interface TaxRate {
  gst: number;
  pst: number;
  hst: number;
  total: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}
