import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Category {
  id: number;
  name: string;
}

const products = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip and titanium design',
    price: 999.99,
    quantity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1695048133148-3e0e227f0946?q=80&w=1000',
    categoryId: 1,
  },
  {
    name: 'MacBook Pro M3',
    description: 'Powerful laptop with M3 chip and Liquid Retina XDR display',
    price: 1999.99,
    quantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000',
    categoryId: 1,
  },
  {
    name: 'AirPods Pro',
    description: 'Premium wireless earbuds with active noise cancellation',
    price: 249.99,
    quantity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1606220588911-5117e7654a3c?q=80&w=1000',
    categoryId: 1,
  },
  {
    name: 'Nike Air Max',
    description: 'Classic running shoes with Air cushioning',
    price: 129.99,
    quantity: 75,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000',
    categoryId: 2,
  },
  {
    name: 'Levi\'s 501 Jeans',
    description: 'Classic straight fit jeans',
    price: 79.99,
    quantity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000',
    categoryId: 2,
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic novel by F. Scott Fitzgerald',
    price: 12.99,
    quantity: 45,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000',
    categoryId: 3,
  },
  {
    name: 'To Kill a Mockingbird',
    description: 'Harper Lee\'s Pulitzer Prize-winning novel',
    price: 14.99,
    quantity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000',
    categoryId: 3,
  },
  {
    name: 'Smart Coffee Maker',
    description: 'WiFi-enabled coffee maker with app control',
    price: 149.99,
    quantity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000',
    categoryId: 4,
  },
  {
    name: 'Air Fryer',
    description: 'Digital air fryer with multiple cooking functions',
    price: 89.99,
    quantity: 35,
    imageUrl: 'https://images.unsplash.com/photo-1587015566902-5dc157c901cf?q=80&w=1000',
    categoryId: 4,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitoring',
    price: 199.99,
    quantity: 55,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000',
    categoryId: 1,
  },
];

async function main() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create categories if they don't exist
    const categories = await prisma.category.createMany({
      data: [
        { name: 'Electronics' },
        { name: 'Clothing' },
        { name: 'Books' },
        { name: 'Home & Kitchen' },
      ],
      skipDuplicates: true,
    });
    console.log(`✅ Created ${categories.count} categories`);

    // Get category IDs
    const categoryIds = await prisma.category.findMany({
      select: { id: true, name: true },
    });

    // Create products
    for (const product of products) {
      const category = categoryIds.find((c: Category) => c.name === 
        (product.categoryId === 1 ? 'Electronics' :
         product.categoryId === 2 ? 'Clothing' :
         product.categoryId === 3 ? 'Books' : 'Home & Kitchen'));
      
      if (category) {
        await prisma.product.create({
          data: {
            ...product,
            categoryId: category.id,
            updatedAt: new Date(),
          },
        });
      }
    }
    console.log(`✅ Created ${products.length} products`);

    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 