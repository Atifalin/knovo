import api from './api';
import type { CartItem, CheckoutForm, OrderBreakdown } from '../types';

export const ordersApi = {
  createPaymentIntent: (items: { productId: string; quantity: number }[], province: string) =>
    api.post<{ success: boolean; clientSecret: string; breakdown: OrderBreakdown }>(
      '/orders/payment-intent',
      { items, province }
    ),

  createOrder: (data: {
    items: { productId: string; quantity: number }[];
    stripePaymentId: string;
  } & CheckoutForm) => api.post('/orders', data),

  getMyOrders: () => api.get('/orders/my-orders'),

  getOrder: (id: string) => api.get(`/orders/${id}`),

  // Admin
  getAllOrders: () => api.get('/orders/admin'),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
};

export function cartItemsToPayload(items: CartItem[]) {
  return items.map((i) => ({ productId: i.product.id, quantity: i.quantity }));
}
