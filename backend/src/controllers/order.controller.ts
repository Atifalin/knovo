import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest, CartItem } from '../types';
import { calculateTax, calculateShipping } from '../utils/tax';
import { sendOrderConfirmation, sendAdminOrderNotification } from '../utils/email';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
});

function generateOrderNumber(): string {
  return 'KNV-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

export async function createPaymentIntent(req: Request, res: Response): Promise<void> {
  const { items, province } = req.body as { items: CartItem[]; province: string };

  if (!items || items.length === 0) {
    res.status(400).json({ message: 'Cart is empty' });
    return;
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      res.status(400).json({ message: `Product not found: ${item.productId}` });
      return;
    }
    if (product.stock < item.quantity) {
      res.status(400).json({ message: `Insufficient stock for: ${product.name}` });
      return;
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + parseFloat(product.price.toString()) * item.quantity;
  }, 0);

  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal, province || 'ON');
  const total = subtotal + shipping + tax;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: 'cad',
    metadata: { items: JSON.stringify(items), province },
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    breakdown: {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    },
  });
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  const {
    items, firstName, lastName, email, address, city, province, postalCode,
    stripePaymentId,
  } = req.body as {
    items: CartItem[];
    firstName: string; lastName: string; email: string;
    address: string; city: string; province: string; postalCode: string;
    stripePaymentId: string;
  };

  const authReq = req as AuthRequest;

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.stock < item.quantity) {
      res.status(400).json({ message: `Stock issue for product: ${item.productId}` });
      return;
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + parseFloat(product.price.toString()) * item.quantity;
  }, 0);

  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal, province);
  const total = subtotal + shipping + tax;
  const orderNumber = generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        subtotal,
        shippingCost: shipping,
        taxAmount: tax,
        total,
        stripePaymentId,
        firstName, lastName, email, address, city, province, postalCode,
        userId: authReq.user?.userId,
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
      include: { items: { include: { product: true } } },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return newOrder;
  });

  await sendOrderConfirmation(email, orderNumber, total.toFixed(2));
  await sendAdminOrderNotification(orderNumber, email, total.toFixed(2));

  res.status(201).json({ success: true, data: order });
}

export async function getMyOrders(req: AuthRequest, res: Response): Promise<void> {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.userId },
    include: { items: { include: { product: { select: { name: true, images: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: orders });
}

export async function getOrder(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  if (req.user?.role !== 'ADMIN' && order.userId !== req.user?.userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  res.json({ success: true, data: order });
}

export async function getAllOrders(_req: Request, res: Response): Promise<void> {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: orders });
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  res.json({ success: true, data: order });
}

export async function stripeWebhook(req: Request, res: Response): Promise<void> {
  const sig = req.headers['stripe-signature'] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    res.status(400).json({ message: 'Webhook signature verification failed' });
    return;
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await prisma.order.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: { status: 'PAID' },
    });
  }

  res.json({ received: true });
}
