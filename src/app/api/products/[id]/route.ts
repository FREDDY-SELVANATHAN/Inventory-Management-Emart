import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await request.json();
    
    // Basic validation
    if (product.price !== undefined && (isNaN(product.price) || product.price < 0)) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    if (product.quantity !== undefined && (isNaN(product.quantity) || product.quantity < 0)) {
      return NextResponse.json(
        { error: 'Quantity must be a non-negative number' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Track if this is a quantity update to potentially create a stock alert
    const isQuantityUpdate = 
      product.quantity !== undefined && 
      existingProduct.quantity !== product.quantity;
    
    const oldQuantity = existingProduct.quantity;
    const newQuantity = product.quantity;

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: product.name !== undefined ? product.name : undefined,
        description: product.description !== undefined ? product.description : undefined,
        price: product.price !== undefined ? product.price : undefined,
        quantity: product.quantity !== undefined ? product.quantity : undefined,
        imageUrl: product.imageUrl !== undefined ? product.imageUrl : undefined,
        categoryId: product.categoryId !== undefined ? product.categoryId : undefined,
        updatedAt: new Date(),
      },
      include: { category: true }
    });

    // If this was a quantity update, check if we need to create a stock alert
    if (isQuantityUpdate && newQuantity < 10 && newQuantity < oldQuantity) {
      try {
        // Create a stock alert using raw SQL to avoid Prisma client issues
        await prisma.$executeRaw`
          INSERT INTO "StockAlert" ("productId", "message", "isRead", "createdAt")
          VALUES (
            ${updatedProduct.id},
            ${`Stock updated: ${updatedProduct.name} quantity reduced from ${oldQuantity} to ${newQuantity}.`},
            false,
            ${new Date()}
          )
        `;
      } catch (alertError) {
        console.error('Error creating stock alert:', alertError);
        // Continue since the main product update was successful
      }
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 