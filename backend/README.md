# EMART Inventory Backend

This is the backend server for the EMART Inventory Management System, built with Express.js and Prisma, connected to a Neon PostgreSQL database.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   - Copy `.env.example` to `.env`
   - Update the `DATABASE_URL` with your Neon database connection string
   - Update `CORS_ORIGIN` if your frontend runs on a different port

3. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/:id` - Get a specific product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `GET /api/categories/:id` - Get a specific category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

## Database Schema

The database uses Prisma with the following models:

### Product
- id: Int (auto-increment)
- name: String
- description: String (optional)
- price: Float
- quantity: Int
- imageUrl: String (optional)
- categoryId: Int
- createdAt: DateTime
- updatedAt: DateTime

### Category
- id: Int (auto-increment)
- name: String (unique)
- createdAt: DateTime
- updatedAt: DateTime 