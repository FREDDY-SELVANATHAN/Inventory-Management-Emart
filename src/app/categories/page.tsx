'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Category } from '@prisma/client';
import { toast } from 'react-hot-toast';

interface CategoryWithStringDates extends Omit<Category, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithStringDates[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<CategoryWithStringDates | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data.map(cat => ({
        ...cat,
        createdAt: new Date(cat.createdAt).toISOString(),
        updatedAt: new Date(cat.updatedAt).toISOString()
      })));
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const category = await api.createCategory(newCategoryName);
      setCategories([...categories, {
        ...category,
        createdAt: new Date(category.createdAt).toISOString(),
        updatedAt: new Date(category.updatedAt).toISOString()
      }]);
      setNewCategoryName('');
      toast.success('Category created successfully');
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;

    try {
      const updatedCategory = await api.updateCategory(editingCategory.id, editingCategory.name);
      setCategories(categories.map(cat => 
        cat.id === updatedCategory.id ? {
          ...updatedCategory,
          createdAt: new Date(updatedCategory.createdAt).toISOString(),
          updatedAt: new Date(updatedCategory.updatedAt).toISOString()
        } : cat
      ));
      setEditingCategory(null);
      toast.success('Category updated successfully');
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await api.deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <form onSubmit={handleCreateCategory} className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            Add Category
          </button>
        </form>
      </div>

      <div className="dark-card">
        <table className="dark-table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>
                  {editingCategory?.id === category.id ? (
                    <form onSubmit={handleUpdateCategory} className="flex gap-2">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    category.name
                  )}
                </td>
                <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 