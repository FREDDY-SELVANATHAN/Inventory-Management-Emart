import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Create a new product
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || data.price === undefined || data.quantity === undefined || !data.categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate price and quantity
    if (isNaN(data.price) || data.price < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    if (isNaN(data.quantity) || data.quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity must be a non-negative number' },
        { status: 400 }
      );
    }

    // Ensure category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        imageUrl: data.imageUrl || null,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });

    // Check if we need to create a stock alert
    if (product.quantity < 10) {
      try {
        // Create stock alert using raw SQL
        await prisma.$executeRaw`
          INSERT INTO "StockAlert" ("productId", "message", "isRead", "createdAt")
          VALUES (
            ${product.id},
            ${`New product added with low stock: ${product.name} has only ${product.quantity} units.`},
            false,
            ${new Date()}
          )
        `;
      } catch (alertError) {
        console.error('Error creating stock alert:', alertError);
        // Continue since product was created successfully
      }
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 