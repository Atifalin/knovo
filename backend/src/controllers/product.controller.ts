import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { ProductFilterQuery } from '../types';

export async function getProducts(req: Request, res: Response): Promise<void> {
  const {
    page = '1',
    limit = '12',
    category,
    color,
    material,
    minPrice,
    maxPrice,
    sort = 'newest',
    search,
    featured,
  } = req.query as ProductFilterQuery;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = { active: true };

  if (category) where.category = { slug: category };
  if (color) where.color = { equals: color, mode: 'insensitive' };
  if (material) where.material = { equals: material, mode: 'insensitive' };
  if (featured === 'true') where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice && { gte: parseFloat(minPrice) }),
      ...(maxPrice && { lte: parseFloat(maxPrice) }),
    };
  }

  const orderBy =
    sort === 'price_asc'
      ? { price: 'asc' as const }
      : sort === 'price_desc'
      ? { price: 'desc' as const }
      : { createdAt: 'desc' as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: { select: { name: true, slug: true } } },
  });

  if (!product || !product.active) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  res.json({ success: true, data: product });
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const {
    name, description, price, sku, categoryId, stock, images,
    featured, importedBrand, material, color, pattern, active, lowStockThreshold,
  } = req.body;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const product = await prisma.product.create({
    data: {
      name, slug, description, price, sku, categoryId, stock: stock || 0,
      images: images || [], featured: featured || false,
      importedBrand, material, color, pattern,
      active: active !== undefined ? active : true,
      lowStockThreshold: lowStockThreshold || 5,
    },
    include: { category: true },
  });

  res.status(201).json({ success: true, data: product });
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const data = req.body;

  if (data.name) {
    data.slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  const product = await prisma.product.update({
    where: { id },
    data,
    include: { category: true },
  });

  res.json({ success: true, data: product });
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await prisma.product.update({ where: { id }, data: { active: false } });
  res.json({ success: true, message: 'Product deactivated' });
}

export async function adjustStock(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { stock } = req.body;

  const product = await prisma.product.update({
    where: { id },
    data: { stock: parseInt(stock) },
  });

  res.json({ success: true, data: product });
}

export async function getCategories(_req: Request, res: Response): Promise<void> {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: { where: { active: true } } } } },
  });
  res.json({ success: true, data: categories });
}

export async function getFilterOptions(_req: Request, res: Response): Promise<void> {
  const [colors, materials] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, color: { not: null } },
      select: { color: true },
      distinct: ['color'],
    }),
    prisma.product.findMany({
      where: { active: true, material: { not: null } },
      select: { material: true },
      distinct: ['material'],
    }),
  ]);

  res.json({
    success: true,
    data: {
      colors: colors.map((p) => p.color).filter(Boolean),
      materials: materials.map((p) => p.material).filter(Boolean),
    },
  });
}
