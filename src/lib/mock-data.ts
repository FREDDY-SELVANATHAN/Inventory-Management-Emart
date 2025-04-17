// Mock data for products
export const mockProducts = [
  {
    id: 1,
    name: "Laptop Pro",
    description: "High-performance laptop with 16GB RAM",
    price: 1299.99,
    quantity: 10,
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&q=80",
    category: { id: 1, name: "Electronics" },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: "Smartphone X",
    description: "Latest smartphone with amazing camera",
    price: 899.99,
    quantity: 15,
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&q=80",
    category: { id: 1, name: "Electronics" },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: "Cotton T-shirt",
    description: "Comfortable cotton t-shirt",
    price: 19.99,
    quantity: 50,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&q=80",
    category: { id: 2, name: "Clothing" },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    name: "Coffee Maker",
    description: "Automatic coffee maker with timer",
    price: 79.99,
    quantity: 8,
    imageUrl: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=500&h=500&q=80",
    category: { id: 4, name: "Home & Kitchen" },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    name: "Wireless Headphones",
    description: "Noise cancelling headphones with 20hr battery life",
    price: 199.99,
    quantity: 25,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&q=80",
    category: { id: 1, name: "Electronics" },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock data for categories
export const mockCategories = [
  { 
    id: 1, 
    name: "Electronics", 
    productCount: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 2, 
    name: "Clothing", 
    productCount: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 3, 
    name: "Books", 
    productCount: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 4, 
    name: "Home & Kitchen", 
    productCount: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 