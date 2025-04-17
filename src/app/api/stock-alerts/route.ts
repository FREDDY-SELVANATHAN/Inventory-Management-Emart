import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const LOW_STOCK_THRESHOLD = 10;

// This function acts like a database trigger to check for low stock products
async function checkAndCreateLowStockAlerts() {
  try {
    // Find all products with quantity less than threshold
    const lowStockProducts = await prisma.product.findMany({
      where: {
        quantity: {
          lt: LOW_STOCK_THRESHOLD
        }
      },
      include: {
        category: true,
      }
    });

    // Process low stock products and create alerts as needed
    const productIdsWithAlerts = new Set();
    
    // Get existing active alerts to avoid duplicates
    try {
      const existingAlerts = await prisma.$queryRaw`
        SELECT "productId" FROM "StockAlert" 
        WHERE "isRead" = false
      `;
      
      // Add existing alert product IDs to the set
      if (Array.isArray(existingAlerts)) {
        existingAlerts.forEach((alert: any) => {
          if (alert.productId) {
            productIdsWithAlerts.add(alert.productId);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching existing alerts:', error);
    }

    // Create new alerts for products that don't have active alerts
    for (const product of lowStockProducts) {
      if (!productIdsWithAlerts.has(product.id)) {
        try {
          await prisma.$executeRaw`
            INSERT INTO "StockAlert" ("productId", "message", "isRead", "createdAt")
            VALUES (
              ${product.id},
              ${`Low stock alert: ${product.name} has only ${product.quantity} units remaining.`},
              false,
              ${new Date()}
            )
          `;
        } catch (error) {
          console.error(`Error creating alert for product ${product.id}:`, error);
        }
      }
    }

    return lowStockProducts;
  } catch (error) {
    console.error('Error in checkAndCreateLowStockAlerts:', error);
    throw error;
  }
}

export async function GET() {
  try {
    // Run the "trigger" function to check for low stock and create alerts
    const lowStockProducts = await checkAndCreateLowStockAlerts();

    return NextResponse.json(lowStockProducts);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch low stock products' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    // Mark alert as read
    await prisma.$executeRaw`
      UPDATE "StockAlert" 
      SET "isRead" = true 
      WHERE "id" = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating stock alert:', error);
    return NextResponse.json(
      { error: 'Failed to update stock alert' },
      { status: 500 }
    );
  }
}

