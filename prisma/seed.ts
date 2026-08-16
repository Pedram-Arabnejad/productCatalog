import { PrismaClient, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets, devices, and accessories' },
    { name: 'Books', slug: 'books', description: 'Fiction, non-fiction, and technical books' },
    { name: 'Clothing', slug: 'clothing', description: 'Apparel for every season' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Everything for your living space' },
  ];

  const categoryIds: Record<string, string> = {};
  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    });
    categoryIds[category.slug] = saved.id;
    console.log(`✅ Category: ${category.name}`);
  }

  const products = [
    {
      name: 'Wireless Noise-Cancelling Headphones',
      slug: 'wireless-noise-cancelling-headphones',
      description: 'Over-ear headphones with active noise cancellation and 30h battery life.',
      price: 249.99,
      stock: 45,
      status: ProductStatus.ACTIVE,
      categorySlug: 'electronics',
    },
    {
      name: 'Mechanical Keyboard - 75%',
      slug: 'mechanical-keyboard-75',
      description: 'Hot-swappable mechanical keyboard with RGB backlighting.',
      price: 129.0,
      stock: 120,
      status: ProductStatus.ACTIVE,
      categorySlug: 'electronics',
    },
    {
      name: 'Clean Architecture: A Craftsman\'s Guide',
      slug: 'clean-architecture-book',
      description: 'Robert C. Martin on structuring software systems.',
      price: 39.99,
      stock: 80,
      status: ProductStatus.ACTIVE,
      categorySlug: 'books',
    },
    {
      name: 'Design Patterns: Elements of Reusable OO Software',
      slug: 'design-patterns-book',
      description: 'The classic GoF reference on object-oriented design patterns.',
      price: 54.95,
      stock: 60,
      status: ProductStatus.ACTIVE,
      categorySlug: 'books',
    },
    {
      name: 'Merino Wool Sweater',
      slug: 'merino-wool-sweater',
      description: 'Lightweight merino wool sweater, machine washable.',
      price: 89.0,
      stock: 35,
      status: ProductStatus.DRAFT,
      categorySlug: 'clothing',
    },
    {
      name: 'Stainless Steel French Press',
      slug: 'stainless-french-press',
      description: '1L double-wall insulated French press coffee maker.',
      price: 34.5,
      stock: 0,
      status: ProductStatus.ARCHIVED,
      categorySlug: 'home-kitchen',
    },
  ];

  for (const product of products) {
    const { categorySlug, ...data } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        status: data.status,
        categoryId: categoryIds[categorySlug],
      },
      create: {
        ...data,
        categoryId: categoryIds[categorySlug],
      },
    });
    console.log(`✅ Product: ${product.name}`);
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
