'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [resetResult, setResetResult] = useState<any>(null);

  const testDatabase = async () => {
    try {
      setLoading(true);
      toast.loading('Testing database connection...');
      
      const response = await fetch('/api/test-db');
      const data = await response.json();
      
      setTestResult(data);
      
      toast.dismiss();
      if (data.success) {
        toast.success('Database connection successful!');
      } else {
        toast.error('Database connection failed!');
      }
    } catch (error) {
      console.error('Error testing database:', error);
      toast.dismiss();
      toast.error('An error occurred while testing the database');
    } finally {
      setLoading(false);
    }
  };

  const resetDatabase = async () => {
    if (!confirm('Are you sure you want to reset the database? This will delete ALL existing data.')) {
      return;
    }
    
    try {
      setLoading(true);
      toast.loading('Resetting database...');
      
      const response = await fetch('/api/admin/reset-db', {
        method: 'POST',
      });
      const data = await response.json();
      
      setResetResult(data);
      
      toast.dismiss();
      if (data.success) {
        toast.success('Database reset successful!');
      } else {
        toast.error('Database reset failed!');
      }
    } catch (error) {
      console.error('Error resetting database:', error);
      toast.dismiss();
      toast.error('An error occurred while resetting the database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Database Management</h2>
            <div className="space-y-4">
              <button
                onClick={testDatabase}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                Test Database Connection
              </button>
              
              <button
                onClick={resetDatabase}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                Reset Database (Warning: Deletes All Data)
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="space-y-4">
              {testResult && (
                <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                  <h3 className="font-medium mb-2">Database Test Result:</h3>
                  <pre className="text-sm overflow-auto max-h-40 p-2 bg-gray-900 rounded">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
              
              {resetResult && (
                <div className={`p-4 rounded-lg ${resetResult.success ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                  <h3 className="font-medium mb-2">Database Reset Result:</h3>
                  <pre className="text-sm overflow-auto max-h-40 p-2 bg-gray-900 rounded">
                    {JSON.stringify(resetResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Environment Variables:</h3>
              <p className="text-gray-400 text-sm mb-2">Check that your .env file contains:</p>
              <pre className="text-sm overflow-auto p-2 bg-gray-800 rounded">
                DATABASE_URL="postgresql://postgres:FREDDY%402005@localhost:5432/postgres?schema=public"
              </pre>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Troubleshooting Steps:</h3>
              <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
                <li>Ensure PostgreSQL is installed and running on your system</li>
                <li>Verify your PostgreSQL username and password are correct</li>
                <li>Check that your database exists and is accessible</li>
                <li>Try restarting your PostgreSQL service</li>
                <li>If problems persist, manually execute the schema.sql file in your PostgreSQL client</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 