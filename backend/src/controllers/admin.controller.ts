import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export async function getAnalytics(_req: Request, res: Response): Promise<void> {
  const [totalOrders, paidOrders, products, recentOrders, topProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      where: { status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] } },
      select: { total: true },
    }),
    prisma.product.count({ where: { active: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, orderNumber: true, status: true, total: true,
        firstName: true, lastName: true, createdAt: true,
      },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ]);

  const totalRevenue = paidOrders.reduce(
    (sum, o) => sum + parseFloat(o.total.toString()),
    0
  );

  const topProductIds = topProducts.map((t) => t.productId);
  const topProductDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, images: true, price: true },
  });

  const topProductsWithSales = topProducts.map((t) => ({
    ...topProductDetails.find((p) => p.id === t.productId),
    totalSold: t._sum.quantity,
  }));

  res.json({
    success: true,
    data: {
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      activeProducts: products,
      recentOrders,
      topProducts: topProductsWithSales,
    },
  });
}
