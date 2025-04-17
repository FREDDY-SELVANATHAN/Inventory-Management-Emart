'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Add Product', path: '/products/add' },
    { name: 'Categories', path: '/categories' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <nav className="bg-gray-950 text-white p-4 border-b border-gray-900 shadow-xl">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-200 hover:text-white transition-colors duration-200">
          EMART Inventory
        </Link>
        <div className="space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                pathname === item.path
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-900 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 