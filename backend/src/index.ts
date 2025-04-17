import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Routes
app.get('/api/health', async (req: Request, res: Response) => {
  const dbConnected = await testDatabaseConnection();
  res.json({ 
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Products routes
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

interface CreateProductBody {
  name: string;
  description?: string;
  price: string | number;
  quantity: string | number;
  categoryId: string | number;
  imageUrl?: string;
}

app.post('/api/products', async (req: Request<{}, {}, CreateProductBody>, res: Response) => {
  try {
    console.log('Received product data:', req.body);

    // Validate required fields
    const { name, price, quantity, categoryId } = req.body;
    
    // Log validation state
    console.log('Validation state:', {
      name: { value: name, valid: !!name },
      price: { value: price, valid: !!price },
      quantity: { value: quantity, valid: !!quantity },
      categoryId: { value: categoryId, valid: !!categoryId }
    });

    if (!name || !price || !quantity || !categoryId) {
      const missingFields = {
        name: !name ? 'Product name is required' : undefined,
        price: !price ? 'Price is required' : undefined,
        quantity: !quantity ? 'Quantity is required' : undefined,
        categoryId: !categoryId ? 'Category is required' : undefined
      };
      
      console.log('Missing fields:', missingFields);
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: missingFields
      });
    }

    // Validate price and quantity are positive numbers
    const parsedPrice = parseFloat(String(price));
    const parsedQuantity = parseInt(String(quantity));
    
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      console.log('Invalid price:', price);
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      console.log('Invalid quantity:', quantity);
      return res.status(400).json({ error: 'Quantity must be a non-negative number' });
    }

    // Check if category exists
    const parsedCategoryId = parseInt(String(categoryId));
    if (isNaN(parsedCategoryId)) {
      console.log('Invalid category ID format:', categoryId);
      return res.status(400).json({ error: 'Invalid category ID format' });
    }

    const category = await prisma.category.findUnique({
      where: { id: parsedCategoryId }
    });

    if (!category) {
      console.log('Category not found:', parsedCategoryId);
      return res.status(400).json({ error: 'Category not found' });
    }

    // Create product
    const productData = {
      name: String(name),
      description: req.body.description || null,
      price: parsedPrice,
      quantity: parsedQuantity,
      imageUrl: req.body.imageUrl || null,
      categoryId: parsedCategoryId,
      updatedAt: new Date(),
    };

    console.log('Creating product with data:', productData);

    const product = await prisma.product.create({
      data: productData,
      include: {
        category: true,
      },
    });

    console.log('Successfully created product:', product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    res.status(500).json({ 
      error: 'Failed to create product',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
});

// Categories routes
app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Category name is required and must be a string' });
    }

    const category = await prisma.category.create({
      data: { 
        name,
        updatedAt: new Date(),
      },
    });
    res.status(201).json(category);
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Category name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
});

app.put('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Category name is required and must be a string' });
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { 
        name,
        updatedAt: new Date(),
      },
    });
    res.json(category);
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Category not found' });
    } else if (error.code === 'P2002') {
      res.status(400).json({ error: 'Category name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update category' });
    }
  }
});

app.delete('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // First, delete all products in this category
    await prisma.product.deleteMany({
      where: { categoryId: parseInt(id) },
    });

    // Then delete the category
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting category:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }
});

// Start server
app.listen(port, async () => {
  console.log(`🚀 Server is running on port ${port}`);
  await testDatabaseConnection();
}); 