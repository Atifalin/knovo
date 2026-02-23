import { Router } from 'express';
import {
  createPaymentIntent, createOrder, getMyOrders,
  getOrder, getAllOrders, updateOrderStatus, stripeWebhook,
} from '../controllers/order.controller';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/webhook', stripeWebhook);
router.post('/payment-intent', createPaymentIntent);
router.post('/', optionalAuth, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/admin', authenticate, requireAdmin, getAllOrders);
router.get('/:id', authenticate, getOrder);
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus);

export default router;
