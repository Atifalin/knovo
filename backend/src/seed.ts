import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const tiesCategory = await prisma.category.upsert({
    where: { slug: 'ties' },
    update: {},
    create: { name: 'Ties', slug: 'ties', description: 'Premium imported silk and woven ties' },
  });

  const pocketSquaresCategory = await prisma.category.upsert({
    where: { slug: 'pocket-squares' },
    update: {},
    create: { name: 'Pocket Squares', slug: 'pocket-squares', description: 'Luxury pocket squares for the refined gentleman' },
  });

  const cufflinksCategory = await prisma.category.upsert({
    where: { slug: 'cufflinks' },
    update: {},
    create: { name: 'Cufflinks', slug: 'cufflinks', description: 'Handcrafted premium cufflinks' },
  });

  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@knovo.ca' },
    update: {},
    create: {
      email: 'admin@knovo.ca',
      password: hashedPassword,
      firstName: 'KNOVO',
      lastName: 'Admin',
      role: Role.ADMIN,
    },
  });

  // Ties — using picsum with fixed seeds for consistency
  const ties = [
    {
      name: 'Midnight Navy Silk Tie',
      slug: 'midnight-navy-silk-tie',
      description: 'A classic midnight navy silk tie with a subtle sheen. Perfect for boardroom meetings and formal occasions. Hand-finished with a clean blade and elegant lining.',
      price: 89.99,
      sku: 'TIE-001',
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      ],
      featured: true,
      importedBrand: 'Como, Italy',
      material: 'Silk',
      color: 'Navy',
      pattern: 'Solid',
      categoryId: tiesCategory.id,
    },
    {
      name: 'Gold Paisley Jacquard Tie',
      slug: 'gold-paisley-jacquard-tie',
      description: 'Richly woven gold paisley jacquard tie. A statement piece that exudes sophistication and pairs beautifully with navy or charcoal suits.',
      price: 99.99,
      sku: 'TIE-002',
      stock: 18,
      images: [
        'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800&q=80',
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
      ],
      featured: true,
      importedBrand: 'Lyon, France',
      material: 'Silk',
      color: 'Gold',
      pattern: 'Paisley',
      categoryId: tiesCategory.id,
    },
    {
      name: 'Charcoal Herringbone Wool Tie',
      slug: 'charcoal-herringbone-wool-tie',
      description: 'A refined charcoal herringbone wool tie ideal for autumn and winter. Textured weave adds depth and character to any ensemble.',
      price: 79.99,
      sku: 'TIE-003',
      stock: 20,
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
      ],
      featured: false,
      importedBrand: 'Edinburgh, Scotland',
      material: 'Wool',
      color: 'Charcoal',
      pattern: 'Herringbone',
      categoryId: tiesCategory.id,
    },
    {
      name: 'Burgundy Repp Stripe Tie',
      slug: 'burgundy-repp-stripe-tie',
      description: 'Classic repp stripe tie in deep burgundy and navy. A timeless pattern rooted in British tradition, crafted from premium silk.',
      price: 94.99,
      sku: 'TIE-004',
      stock: 15,
      images: [
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
        'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800&q=80',
      ],
      featured: false,
      importedBrand: 'Como, Italy',
      material: 'Silk',
      color: 'Burgundy',
      pattern: 'Stripe',
      categoryId: tiesCategory.id,
    },
    {
      name: 'Forest Green Micro-Dot Tie',
      slug: 'forest-green-micro-dot-tie',
      description: 'A sophisticated forest green tie with a subtle micro-dot pattern. Versatile enough for business and semi-formal occasions.',
      price: 84.99,
      sku: 'TIE-005',
      stock: 22,
      images: [
        'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      ],
      featured: false,
      importedBrand: 'Como, Italy',
      material: 'Silk',
      color: 'Green',
      pattern: 'Dot',
      categoryId: tiesCategory.id,
    },
    {
      name: 'Ivory Woven Silk Tie',
      slug: 'ivory-woven-silk-tie',
      description: 'A pristine ivory woven silk tie with a subtle texture. The perfect choice for weddings and white-tie events.',
      price: 109.99,
      sku: 'TIE-006',
      stock: 12,
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
      ],
      featured: true,
      importedBrand: 'Lyon, France',
      material: 'Silk',
      color: 'Ivory',
      pattern: 'Solid',
      categoryId: tiesCategory.id,
    },
  ];

  // Pocket Squares — using reliable fashion/fabric Unsplash photos
  const pocketSquares = [
    {
      name: 'White Linen Classic Pocket Square',
      slug: 'white-linen-classic-pocket-square',
      description: 'The quintessential white linen pocket square. Hand-rolled edges and impeccable finish. A wardrobe essential for every gentleman.',
      price: 39.99,
      sku: 'PS-001',
      stock: 40,
      images: [
        'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=800&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      ],
      featured: true,
      importedBrand: 'Dublin, Ireland',
      material: 'Linen',
      color: 'White',
      pattern: 'Solid',
      categoryId: pocketSquaresCategory.id,
    },
    {
      name: 'Navy Silk Pocket Square',
      slug: 'navy-silk-pocket-square',
      description: 'A luxurious navy silk pocket square with hand-rolled edges. Pairs perfectly with the KNOVO Midnight Navy Silk Tie for a coordinated look.',
      price: 49.99,
      sku: 'PS-002',
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=800&q=80',
      ],
      featured: true,
      importedBrand: 'Como, Italy',
      material: 'Silk',
      color: 'Navy',
      pattern: 'Solid',
      categoryId: pocketSquaresCategory.id,
    },
    {
      name: 'Gold Floral Silk Pocket Square',
      slug: 'gold-floral-silk-pocket-square',
      description: 'An opulent gold floral print silk pocket square. Adds a touch of artistry and personality to any formal or business ensemble.',
      price: 54.99,
      sku: 'PS-003',
      stock: 20,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      ],
      featured: false,
      importedBrand: 'Lyon, France',
      material: 'Silk',
      color: 'Gold',
      pattern: 'Floral',
      categoryId: pocketSquaresCategory.id,
    },
    {
      name: 'Burgundy Paisley Cotton Pocket Square',
      slug: 'burgundy-paisley-cotton-pocket-square',
      description: 'A rich burgundy paisley cotton pocket square. The perfect complement to grey or navy suits, adding warmth and depth.',
      price: 44.99,
      sku: 'PS-004',
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      ],
      featured: false,
      importedBrand: 'Milan, Italy',
      material: 'Cotton',
      color: 'Burgundy',
      pattern: 'Paisley',
      categoryId: pocketSquaresCategory.id,
    },
  ];

  // Cufflinks
  const cufflinks = [
    {
      name: 'Gold Knot Cufflinks',
      slug: 'gold-knot-cufflinks',
      description: 'Classic gold knot cufflinks crafted from polished brass with gold plating. A timeless accessory that elevates any French-cuff shirt.',
      price: 129.99,
      sku: 'CL-001',
      stock: 15,
      images: [
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      ],
      featured: true,
      importedBrand: 'Birmingham, England',
      material: 'Brass',
      color: 'Gold',
      pattern: 'Knot',
      categoryId: cufflinksCategory.id,
    },
    {
      name: 'Navy Enamel Silver Cufflinks',
      slug: 'navy-enamel-silver-cufflinks',
      description: 'Sleek silver cufflinks with deep navy enamel inlay. A modern and refined choice for the contemporary gentleman.',
      price: 149.99,
      sku: 'CL-002',
      stock: 12,
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
      ],
      featured: true,
      importedBrand: 'Birmingham, England',
      material: 'Sterling Silver',
      color: 'Navy',
      pattern: 'Enamel',
      categoryId: cufflinksCategory.id,
    },
    {
      name: 'Brushed Silver Bar Cufflinks',
      slug: 'brushed-silver-bar-cufflinks',
      description: 'Minimalist brushed silver bar cufflinks. Clean lines and understated elegance make these a versatile addition to any wardrobe.',
      price: 119.99,
      sku: 'CL-003',
      stock: 20,
      images: [
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      ],
      featured: false,
      importedBrand: 'Birmingham, England',
      material: 'Sterling Silver',
      color: 'Silver',
      pattern: 'Bar',
      categoryId: cufflinksCategory.id,
    },
    {
      name: 'Onyx Gold-Set Cufflinks',
      slug: 'onyx-gold-set-cufflinks',
      description: 'Dramatic black onyx stones set in polished gold. A bold statement piece for black-tie events and special occasions.',
      price: 189.99,
      sku: 'CL-004',
      stock: 8,
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
      ],
      featured: true,
      importedBrand: 'Florence, Italy',
      material: 'Gold & Onyx',
      color: 'Black',
      pattern: 'Stone',
      categoryId: cufflinksCategory.id,
    },
  ];

  for (const tie of ties) {
    await prisma.product.upsert({
      where: { sku: tie.sku },
      update: { images: tie.images },
      create: { ...tie, price: tie.price },
    });
  }

  for (const ps of pocketSquares) {
    await prisma.product.upsert({
      where: { sku: ps.sku },
      update: { images: ps.images },
      create: { ...ps, price: ps.price },
    });
  }

  for (const cl of cufflinks) {
    await prisma.product.upsert({
      where: { sku: cl.sku },
      update: { images: cl.images },
      create: { ...cl, price: cl.price },
    });
  }

  console.log('Seeding complete!');
  console.log('Admin credentials: admin@knovo.ca / Admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
