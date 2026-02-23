import api from './api';
import type { ProductsResponse, Product, Category } from '../types';

export const productsApi = {
  getAll: (params?: Record<string, string | number>) =>
    api.get<ProductsResponse>('/products', { params }),

  getBySlug: (slug: string) =>
    api.get<{ success: boolean; data: Product }>(`/products/${slug}`),

  getCategories: () =>
    api.get<{ success: boolean; data: Category[] }>('/products/categories'),

  getFilterOptions: () =>
    api.get<{ success: boolean; data: { colors: string[]; materials: string[] } }>(
      '/products/filter-options'
    ),

  // Admin
  create: (data: Partial<Product>) => api.post('/products', data),
  update: (id: string, data: Partial<Product>) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  adjustStock: (id: string, stock: number) => api.patch(`/products/${id}/stock`, { stock }),
};
