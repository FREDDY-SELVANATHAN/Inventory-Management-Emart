'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { api, Product } from '@/lib/api';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link
            href="/products/add"
            className="dark-button bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Product
          </Link>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-950 rounded-lg overflow-hidden border border-gray-900 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="h-48 bg-gray-900 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-lg font-semibold text-gray-200 hover:text-white transition-colors"
                  >
                    {product.name}
                  </Link>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300">
                    {product.category.name}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.description || 'No description available'}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <div className="text-xl font-bold text-gray-200">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    product.quantity <= 5 
                      ? 'bg-red-900/40 text-red-400' 
                      : product.quantity <= 20 
                        ? 'bg-yellow-900/40 text-yellow-400' 
                        : 'bg-green-900/40 text-green-400'
                  }`}>
                    {product.quantity} in stock
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Link
                    href={`/products/edit/${product.id}`}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 