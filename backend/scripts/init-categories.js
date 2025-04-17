const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function initCategories() {
  try {
    console.log('🔄 Initializing categories...');

    // Check if categories already exist
    const existingCategories = await prisma.category.findMany();
    if (existingCategories.length > 0) {
      console.log('✅ Categories already exist:', existingCategories);
      return;
    }

    // Create initial categories
    const categories = [
      { name: 'Electronics' },
      { name: 'Clothing' },
      { name: 'Books' },
      { name: 'Home & Kitchen' }
    ];

    const createdCategories = await prisma.category.createMany({
      data: categories
    });

    console.log('✅ Created categories:', createdCategories);
    console.log('✨ Categories initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initCategories(); 