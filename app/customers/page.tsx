"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { customerFunctions, Customer } from '../../lib/database';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await customerFunctions.getAll();
        setCustomers(data);
      } catch (error) {
        console.error('Müşteriler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">PVC Muhasebe</h1>
              <p className="text-sm">Müşteriler</p>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:underline">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:underline">
                    Panel
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="hover:underline">
                    Projeler
                  </Link>
                </li>
                <li>
                  <Link href="/transactions" className="hover:underline">
                    İşlemler
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Müşteriler</h2>
          <Link
            href="/customers/new"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
          >
            Yeni Müşteri Ekle
          </Link>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {loading ? (
            <p className="text-center py-8">Yükleniyor...</p>
          ) : customers.length === 0 ? (
            <p className="text-center py-8">Henüz müşteri bulunmamaktadır.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-gray-600">Müşteri Adı</th>
                    <th className="px-6 py-3 text-gray-600">İletişim</th>
                    <th className="px-6 py-3 text-gray-600">Vergi No</th>
                    <th className="px-6 py-3 text-gray-600 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">
                        <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:underline">
                          {customer.name}
                        </Link>
                        {customer.company_name && (
                          <p className="text-sm text-gray-500">{customer.company_name}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {customer.email && <div>{customer.email}</div>}
                        {customer.phone && <div className="text-sm text-gray-500">{customer.phone}</div>}
                      </td>
                      <td className="px-6 py-4">
                        {customer.tax_id || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <Link
                            href={`/customers/${customer.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Görüntüle
                          </Link>
                          <Link
                            href={`/customers/${customer.id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Düzenle
                          </Link>
                          <button className="text-red-600 hover:text-red-800">
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">&copy; {new Date().getFullYear()} PVC Muhasebe - Tüm Hakları Saklıdır</p>
        </div>
      </footer>
    </div>
  );
}
