import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../types';

export async function getWishlist(req: AuthRequest, res: Response): Promise<void> {
  const items = await prisma.wishlist.findMany({
    where: { userId: req.user!.userId },
    include: { product: { include: { category: { select: { name: true, slug: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: items });
}

export async function addToWishlist(req: AuthRequest, res: Response): Promise<void> {
  const { productId } = req.body;

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId: req.user!.userId, productId } },
  });

  if (existing) {
    res.json({ success: true, message: 'Already in wishlist' });
    return;
  }

  const item = await prisma.wishlist.create({
    data: { userId: req.user!.userId, productId },
    include: { product: true },
  });

  res.status(201).json({ success: true, data: item });
}

export async function removeFromWishlist(req: AuthRequest, res: Response): Promise<void> {
  const { productId } = req.params;

  await prisma.wishlist.deleteMany({
    where: { userId: req.user!.userId, productId },
  });

  res.json({ success: true, message: 'Removed from wishlist' });
}
