const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockAlert {
  id: number;
  productId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  product?: Product;
}

export const api = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`/api/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  },

  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>): Promise<Product> => {
    const response = await fetch(`/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to create product');
    }
    return response.json();
  },

  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to update product');
    }
    return response.json();
  },

  deleteProduct: async (id: number): Promise<void> => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete product');
    }
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },

  createCategory: async (name: string): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create category');
    }
    return response.json();
  },

  updateCategory: async (id: number, name: string): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update category');
    }
    return response.json();
  },

  deleteCategory: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete category');
    }
  },

  // Stock Alerts
  async getStockAlerts(): Promise<StockAlert[]> {
    const response = await fetch('/api/stock-alerts');
    if (!response.ok) {
      throw new Error('Failed to fetch stock alerts');
    }
    return response.json();
  },

  async markAlertAsRead(id: number): Promise<{ success: boolean }> {
    const response = await fetch('/api/stock-alerts', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      throw new Error('Failed to update stock alert');
    }
    return response.json();
  },

  // Low Stock Products
  async getLowStockProducts(): Promise<Product[]> {
    const response = await fetch('/api/stock-alerts');
    if (!response.ok) {
      throw new Error('Failed to fetch low stock products');
    }
    return response.json();
  },
};