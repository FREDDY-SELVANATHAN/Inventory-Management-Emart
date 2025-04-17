'use client';

import { useState, useEffect } from 'react';
import { api, Product, Category } from '@/lib/api';
import { ChartBarIcon, CurrencyDollarIcon, CubeIcon, TagIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface CategoryStat {
  name: string;
  count: number;
  totalValue: number;
  products: Product[];
}

interface ReportData {
  totalProducts: number;
  totalCategories: number;
  totalValue: number;
  lowStockProducts: number;
  categoryStats: CategoryStat[];
  lowStockProductsData: Product[];
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [showStockAlert, setShowStockAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  useEffect(() => {
    // Show stock alert notification if there are low stock products
    if (reportData?.lowStockProductsData && reportData.lowStockProductsData.length > 0) {
      setShowStockAlert(true);
    }
  }, [reportData]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [products, categories, lowStockProductsData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getLowStockProducts(),
      ]);

      // Calculate total inventory value
      const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

      // Count low stock products (less than 10)
      const lowStockProducts = lowStockProductsData.length;

      // Calculate category statistics
      const categoryStats = categories.map(category => {
        const categoryProducts = products.filter(p => p.categoryId === category.id);
        return {
          name: category.name,
          count: categoryProducts.length,
          totalValue: categoryProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0),
          products: categoryProducts,
        };
      });

      setReportData({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalValue,
        lowStockProducts,
        categoryStats,
        lowStockProductsData,
      });
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = () => {
    setShowStockAlert(false);
  };

  const navigateToInventory = () => {
    window.location.href = '/products';
  };

  // New function to handle quick stock update
  const handleQuickUpdate = async () => {
    if (!selectedProduct || newQuantity < 0) return;
    
    try {
      setIsUpdating(true);
      await api.updateProduct(selectedProduct.id, {
        ...selectedProduct,
        quantity: newQuantity
      });
      
      setUpdateSuccess(`${selectedProduct.name} stock updated successfully.`);
      
      // Refresh data after successful update
      setTimeout(() => {
        fetchReportData();
        setSelectedProduct(null);
        setUpdateSuccess(null);
      }, 1500);
    } catch (error) {
      console.error('Error updating stock:', error);
      setError('Failed to update stock');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500 text-white p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Inventory Reports</h1>

        {/* Stock Alert Notification */}
        {showStockAlert && reportData?.lowStockProductsData && reportData.lowStockProductsData.length > 0 && (
          <div className="bg-amber-900/50 border border-amber-700 rounded-lg p-4 mb-6 relative">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-amber-400 font-semibold mb-1">Low Stock Alert</h3>
                <p className="text-amber-200 mb-3">
                  {reportData.lowStockProductsData.length} product{reportData.lowStockProductsData.length !== 1 ? 's' : ''} {reportData.lowStockProductsData.length !== 1 ? 'have' : 'has'} quantity below 10. Please update your inventory.
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={navigateToInventory}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm transition-colors"
                  >
                    Update Stock
                  </button>
                  <button 
                    onClick={dismissAlert}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md text-sm transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-950 rounded-lg p-6 border border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-gray-200">{reportData?.totalProducts}</p>
              </div>
              <CubeIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-950 rounded-lg p-6 border border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Categories</p>
                <p className="text-2xl font-bold text-gray-200">{reportData?.totalCategories}</p>
              </div>
              <TagIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-950 rounded-lg p-6 border border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Inventory Value</p>
                <p className="text-2xl font-bold text-gray-200">
                  ${reportData?.totalValue.toLocaleString()}
                </p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-950 rounded-lg p-6 border border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-200">{reportData?.lowStockProducts}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Category Statistics */}
        <div className="bg-gray-950 rounded-lg p-6 border border-gray-900 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Category Statistics</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400">
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Product Count</th>
                  <th className="pb-4">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.categoryStats.map((stat) => (
                  <tr key={stat.name} className="border-t border-gray-800">
                    <td className="py-4 text-gray-200">{stat.name}</td>
                    <td className="py-4 text-gray-300">{stat.count}</td>
                    <td className="py-4 text-gray-300">${stat.totalValue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stock Update Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Update Stock</h3>
                <button 
                  onClick={() => {
                    setSelectedProduct(null);
                    setUpdateSuccess(null);
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              {updateSuccess ? (
                <div className="bg-green-900/50 border border-green-700 text-green-200 p-3 rounded-md mb-4">
                  {updateSuccess}
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-gray-300 mb-1">Product:</p>
                    <p className="text-white font-medium">{selectedProduct.name}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-300 mb-1">Current Quantity:</p>
                    <p className="text-amber-400 font-medium">{selectedProduct.quantity}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="newQuantity" className="block text-gray-300 mb-1">
                      New Quantity:
                    </label>
                    <input
                      id="newQuantity"
                      type="number"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleQuickUpdate}
                      disabled={isUpdating}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
                    >
                      {isUpdating ? 'Updating...' : 'Update Stock'}
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Low Stock Products */}
        <div className="bg-gray-950 rounded-lg p-6 border border-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">
            Low Stock Products
            <span className="ml-2 px-2 py-1 bg-amber-700/60 text-amber-200 text-xs rounded-full">
              Action Required
            </span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400">
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Quantity</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.lowStockProductsData && reportData.lowStockProductsData.length > 0 ? (
                  reportData.lowStockProductsData.map(product => (
                    <tr key={product.id} className="border-t border-gray-800">
                      <td className="py-4 text-gray-200">{product.name}</td>
                      <td className="py-4 text-gray-300">{product.category.name}</td>
                      <td className="py-4 text-gray-300">
                        <span className={`${product.quantity < 5 ? 'text-red-400' : 'text-amber-400'}`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="py-4 text-gray-300">${product.price.toFixed(2)}</td>
                      <td className="py-4">
                        <button 
                          onClick={() => {
                            setSelectedProduct(product);
                            setNewQuantity(product.quantity);
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                        >
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-gray-800">
                    <td colSpan={5} className="py-4 text-center text-gray-400">
                      No low stock products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {reportData?.lowStockProductsData && reportData.lowStockProductsData.length > 0 && (
            <div className="mt-6 bg-amber-950/30 border border-amber-900 rounded p-4">
              <h3 className="text-amber-400 text-sm font-medium mb-2">Stock Level Warning</h3>
              <p className="text-amber-200 text-sm mb-4">
                Low stock items require attention to prevent stockouts. Please update your inventory levels 
                or place orders for these items as soon as possible.
              </p>
              <button 
                onClick={() => window.location.href = '/products'}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-md text-sm transition-colors"
              >
                Go to Inventory Management
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 