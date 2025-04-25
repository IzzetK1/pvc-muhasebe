"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">PVC Muhasebe</h1>
            <p className="text-sm">
              {pathname.includes('/customers') ? 'Müşteriler' :
               pathname.includes('/projects') ? 'Projeler' :
               pathname.includes('/partners') ? 'Ortaklar' :
               pathname.includes('/transactions') ? 'İşlemler' :
               pathname.includes('/reports') ? 'Raporlar' :
               'Panel'}
            </p>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  href="/dashboard" 
                  className={`hover:underline ${isActive('/dashboard') ? 'font-bold' : ''}`}
                >
                  Panel
                </Link>
              </li>
              <li>
                <Link 
                  href="/customers" 
                  className={`hover:underline ${isActive('/customers') ? 'font-bold' : ''}`}
                >
                  Müşteriler
                </Link>
              </li>
              <li>
                <Link 
                  href="/projects" 
                  className={`hover:underline ${isActive('/projects') ? 'font-bold' : ''}`}
                >
                  Projeler
                </Link>
              </li>
              <li>
                <Link 
                  href="/partners" 
                  className={`hover:underline ${isActive('/partners') ? 'font-bold' : ''}`}
                >
                  Ortaklar
                </Link>
              </li>
              <li>
                <Link 
                  href="/transactions" 
                  className={`hover:underline ${isActive('/transactions') ? 'font-bold' : ''}`}
                >
                  İşlemler
                </Link>
              </li>
              <li>
                <Link 
                  href="/reports" 
                  className={`hover:underline ${isActive('/reports') ? 'font-bold' : ''}`}
                >
                  Raporlar
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
