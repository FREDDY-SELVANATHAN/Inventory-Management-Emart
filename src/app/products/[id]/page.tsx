'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api, Product } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getProduct(productId);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.deleteProduct(productId);
      toast.success('Product deleted successfully');
      router.push('/products');
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
          <p className="mt-4 text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto dark-card p-8 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-300 mb-6">{error || 'Product not found'}</p>
          <Link href="/products" className="dark-button inline-flex items-center">
            <ChevronLeftIcon className="h-5 w-5 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/products" className="text-blue-400 hover:text-blue-300 inline-flex items-center">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Products
          </Link>
        </div>
        
        <div className="dark-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="p-6 flex items-center justify-center bg-gray-900">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="max-w-full max-h-[400px] object-contain rounded"
                />
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center bg-gray-800 text-gray-500 rounded">
                  No image available
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="p-6">
              <div className="mb-2">
                <span className="px-3 py-1 text-sm rounded-full bg-blue-900/40 text-blue-400">
                  {product.category.name}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="text-2xl font-bold text-blue-400 mb-4">
                ${product.price.toFixed(2)}
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-gray-300">Description</h2>
                <p className="text-gray-400">{product.description || 'No description available'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h2 className="text-sm text-gray-400">Quantity In Stock</h2>
                  <p className="text-xl font-semibold">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      product.quantity <= 5 
                        ? 'bg-red-900/40 text-red-400' 
                        : product.quantity <= 20 
                          ? 'bg-yellow-900/40 text-yellow-400' 
                          : 'bg-green-900/40 text-green-400'
                    }`}>
                      {product.quantity} units
                    </span>
                  </p>
                </div>
                <div>
                  <h2 className="text-sm text-gray-400">Last Updated</h2>
                  <p className="text-gray-300">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Link
                  href={`/products/edit/${product.id}`}
                  className="dark-button bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md flex-1 text-center"
                >
                  Edit Product
                </Link>
                <button
                  onClick={handleDelete}
                  className="dark-button bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md flex-1"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 