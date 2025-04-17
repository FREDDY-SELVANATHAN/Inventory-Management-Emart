const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('🔄 Starting database reset...');

    // Test database connection first
    try {
      await prisma.$connect();
      console.log('✅ Database connection established');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error.message);
      console.log('Please check your database connection string in .env file');
      console.log('Current DATABASE_URL:', process.env.DATABASE_URL);
      return;
    }

    // Drop existing tables if they exist
    try {
      await prisma.$executeRawUnsafe(`
        DROP TABLE IF EXISTS "Product" CASCADE;
        DROP TABLE IF EXISTS "Category" CASCADE;
      `);
      console.log('✅ Dropped existing tables');
    } catch (error) {
      console.error('❌ Error dropping tables:', error.message);
      return;
    }

    // Create tables
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE "Category" (
          "id" SERIAL NOT NULL,
          "name" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
        );

        CREATE TABLE "Product" (
          "id" SERIAL NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "price" DOUBLE PRECISION NOT NULL,
          "quantity" INTEGER NOT NULL,
          "imageUrl" TEXT,
          "categoryId" INTEGER NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
        );

        CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

        ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" 
        FOREIGN KEY ("categoryId") REFERENCES "Category"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE;
      `);
      console.log('✅ Created tables and constraints');
    } catch (error) {
      console.error('❌ Error creating tables:', error.message);
      return;
    }

    // Insert some initial categories
    try {
      await prisma.category.createMany({
        data: [
          { name: 'Electronics' },
          { name: 'Clothing' },
          { name: 'Books' },
          { name: 'Home & Kitchen' }
        ]
      });
      console.log('✅ Added initial categories');
    } catch (error) {
      console.error('❌ Error adding initial categories:', error.message);
      return;
    }

    console.log('✨ Database reset completed successfully!');
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    try {
      await prisma.$disconnect();
      console.log('✅ Database connection closed');
    } catch (error) {
      console.error('❌ Error closing database connection:', error.message);
    }
  }
}

// Load environment variables
require('dotenv').config();

// Run the reset
resetDatabase(); 