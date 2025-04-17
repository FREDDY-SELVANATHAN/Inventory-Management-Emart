'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon, ChartBarIcon, TagIcon, PlusCircleIcon, CubeIcon, ArchiveBoxIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { mockProducts, mockCategories } from '@/lib/mock-data';

interface Stat {
  name: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface Product {
  _id: string;
  quantity: number;
}

type DashboardStats = {
  totalProducts: number;
  totalCategories: number;
  lowStockItems: number;
  totalValue: number;
};

type PopularProduct = {
  id: number;
  name: string;
  category: string;
  sales: number;
  revenue: number;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    lowStockItems: 0,
    totalValue: 0,
  });

  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([
    {
      id: 1,
      name: "Laptop Pro",
      category: "Electronics",
      sales: 42,
      revenue: 54599.58
    },
    {
      id: 2,
      name: "Smartphone X",
      category: "Electronics",
      sales: 38,
      revenue: 34199.62
    },
    {
      id: 3,
      name: "Wireless Headphones",
      category: "Electronics",
      sales: 30,
      revenue: 5999.70
    },
    {
      id: 5,
      name: "Coffee Maker",
      category: "Home & Kitchen",
      sales: 22,
      revenue: 1759.78
    },
    {
      id: 4,
      name: "Cotton T-shirt",
      category: "Clothing",
      sales: 18,
      revenue: 359.82
    }
  ]);

  useEffect(() => {
    // Use mock data to calculate stats
    const totalProducts = mockProducts.length;
    const totalCategories = mockCategories.length;
    const lowStockItems = mockProducts.filter(p => p.quantity < 10).length;
    const totalValue = mockProducts.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0);

    setStats({
      totalProducts,
      totalCategories,
      lowStockItems,
      totalValue
    });

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="dark-card p-6 flex items-center">
            <div className="rounded-full bg-blue-900/20 p-3 mr-4">
              <CubeIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
          </div>
          
          <div className="dark-card p-6 flex items-center">
            <div className="rounded-full bg-purple-900/20 p-3 mr-4">
              <TagIcon className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-white">{stats.totalCategories}</p>
            </div>
          </div>
          
          <div className="dark-card p-6 flex items-center">
            <div className="rounded-full bg-green-900/20 p-3 mr-4">
              <ArchiveBoxIcon className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Inventory Value</p>
              <p className="text-2xl font-bold text-white">
                ${stats.totalValue.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="dark-card p-6 flex items-center">
            <div className="rounded-full bg-red-900/20 p-3 mr-4">
              <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Low Stock Items</p>
              <p className="text-2xl font-bold text-white">{stats.lowStockItems}</p>
            </div>
          </div>
        </div>
        
        {/* Popular Products Section */}
        <div className="dark-card p-6 mb-8">
          <div className="flex items-center mb-4">
            <ShoppingCartIcon className="h-6 w-6 text-orange-500 mr-2" />
            <h2 className="text-xl font-bold text-white">Most Popular Products</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="dark-table">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Product</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Sales</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {popularProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-800">
                    <td className="py-3 px-4 text-sm text-white">{product.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{product.category}</td>
                    <td className="py-3 px-4 text-sm text-white">{product.sales} units</td>
                    <td className="py-3 px-4 text-sm text-white">${product.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/products/add">
            <div className="dark-card p-6 flex items-center cursor-pointer hover:bg-gray-900 transition-colors">
              <div className="rounded-full bg-blue-900/20 p-3 mr-4">
                <CubeIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-white">Add New Product</p>
                <p className="text-sm text-gray-400">Add a new product to inventory</p>
              </div>
            </div>
          </Link>
          
          <Link href="/categories">
            <div className="dark-card p-6 flex items-center cursor-pointer hover:bg-gray-900 transition-colors">
              <div className="rounded-full bg-purple-900/20 p-3 mr-4">
                <TagIcon className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-white">Manage Categories</p>
                <p className="text-sm text-gray-400">Create or edit product categories</p>
              </div>
            </div>
          </Link>
          
          <Link href="/reports">
            <div className="dark-card p-6 flex items-center cursor-pointer hover:bg-gray-900 transition-colors">
              <div className="rounded-full bg-green-900/20 p-3 mr-4">
                <ArchiveBoxIcon className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-white">View Reports</p>
                <p className="text-sm text-gray-400">Analyze inventory performance</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
