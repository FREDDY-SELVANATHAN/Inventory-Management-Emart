'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: {
    id: number;
    name: string;
  };
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    imageUrl: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Import mock data
        const { mockProducts, mockCategories } = await import('@/lib/mock-data');
        
        // Find the product
        const foundProduct = mockProducts.find(p => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setFormData({
            name: foundProduct.name,
            description: foundProduct.description || '',
            price: foundProduct.price.toString(),
            quantity: foundProduct.quantity.toString(),
            categoryId: foundProduct.category.id.toString(),
            imageUrl: foundProduct.imageUrl || '',
          });
        } else {
          setError('Product not found');
          toast.error('Product not found');
        }
        
        setCategories(mockCategories);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('Failed to load product data');
        toast.error('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Validate form
      if (!formData.name || !formData.price || !formData.quantity || !formData.categoryId) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // In a real app, we would send this data to the API
      // For now, we'll just simulate a successful update
      
      console.log('Updated product data:', {
        id: productId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        categoryId: parseInt(formData.categoryId),
        imageUrl: formData.imageUrl
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Product updated successfully');
      
      // Redirect back to product page
      router.push(`/products/${productId}`);
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading product data...</p>
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href={`/products/${productId}`} className="text-blue-400 hover:text-blue-300 inline-flex items-center">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Product
          </Link>
        </div>
        
        <div className="dark-card p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="md:col-span-2 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 bg-gray-900 p-4 rounded flex items-center justify-center">
                  {formData.imageUrl ? (
                    <img 
                      src={formData.imageUrl} 
                      alt={formData.name}
                      className="max-w-full max-h-[200px] object-contain rounded"
                    />
                  ) : (
                    <div className="w-full h-[200px] flex items-center justify-center bg-gray-800 text-gray-500 rounded">
                      No image available
                    </div>
                  )}
                </div>
                
                <div className="w-full md:w-2/3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="dark-input w-full"
                    placeholder="Enter image URL"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Provide a URL to an image for this product
                  </p>
                </div>
              </div>
              
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="dark-input w-full"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="dark-input w-full"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="dark-input w-full"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="dark-input w-full"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              
              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="dark-input w-full h-32"
                  placeholder="Enter product description"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Link
                href={`/products/${productId}`}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="dark-button bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 