"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Menü öğeleri
  const menuItems = [
    { path: '/dashboard', label: 'Panel' },
    { path: '/customers', label: 'Müşteriler' },
    { path: '/projects', label: 'Projeler' },
    { path: '/partners', label: 'Ortaklar' },
    { path: '/transactions', label: 'İşlemler' },
    { path: '/reports', label: 'Raporlar' }
  ];

  // Mobil menüyü aç/kapat
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">PVC Muhasebe</h1>
            <p className="text-xs md:text-sm">
              {pathname.includes('/customers') ? 'Müşteriler' :
               pathname.includes('/projects') ? 'Projeler' :
               pathname.includes('/partners') ? 'Ortaklar' :
               pathname.includes('/transactions') ? 'İşlemler' :
               pathname.includes('/reports') ? 'Raporlar' :
               pathname.includes('/invoices') ? 'Faturalar' :
               pathname.includes('/payments') ? 'Ödemeler' :
               'Panel'}
            </p>
          </div>

          {/* Mobil Menü Butonu */}
          <button
            className="md:hidden flex items-center"
            onClick={toggleMobileMenu}
            aria-label="Menüyü aç/kapat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Masaüstü Menü */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`hover:underline ${isActive(item.path) ? 'font-bold' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobil Menü */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <ul className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block py-1 hover:bg-blue-700 px-2 rounded ${isActive(item.path) ? 'font-bold bg-blue-700' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
