"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { customerFunctions, Customer } from '../../lib/database';
import Header from '../Header';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Müşterileri yükle
  useEffect(() => {
    loadCustomers();
  }, []);

  // Müşterileri yükleme fonksiyonu
  async function loadCustomers() {
    try {
      setLoading(true);
      const data = await customerFunctions.getAll();
      setCustomers(data);
      setError(null);
    } catch (error) {
      console.error('Müşteriler yüklenirken hata oluştu:', error);
      setError('Müşteriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }

  // Müşteri silme fonksiyonu
  const deleteCustomer = async (id: string) => {
    if (window.confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      try {
        setLoading(true);
        await customerFunctions.delete(id);

        // Müşteri listesini güncelle
        setCustomers(customers.filter(customer => customer.id !== id));
        setError(null);
      } catch (error) {
        console.error('Müşteri silinirken hata oluştu:', error);
        setError('Müşteri silinirken bir hata oluştu. Bu müşteriye ait projeler veya faturalar olabilir.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Müşteriler</h2>
          <Link
            href="/customers/new"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-center sm:text-left"
          >
            Yeni Müşteri Ekle
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Customers List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {loading ? (
            <p className="text-center py-8">Yükleniyor...</p>
          ) : customers.length === 0 ? (
            <p className="text-center py-8">Henüz müşteri bulunmamaktadır.</p>
          ) : (
            {/* Masaüstü Görünüm */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-gray-600">Müşteri Adı</th>
                    <th className="px-4 py-3 text-gray-600">İletişim</th>
                    <th className="px-4 py-3 text-gray-600">Vergi No</th>
                    <th className="px-4 py-3 text-gray-600 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:underline">
                          {customer.name}
                        </Link>
                        {customer.company_name && (
                          <p className="text-sm text-gray-500">{customer.company_name}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {customer.email && <div>{customer.email}</div>}
                        {customer.phone && <div className="text-sm text-gray-500">{customer.phone}</div>}
                      </td>
                      <td className="px-4 py-3">
                        {customer.tax_id || '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
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
                          <button
                            onClick={() => deleteCustomer(customer.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobil Görünüm */}
            <div className="md:hidden">
              {customers.map((customer) => (
                <div key={customer.id} className="border-b py-4 px-4">
                  <div className="mb-2">
                    <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:underline font-medium">
                      {customer.name}
                    </Link>
                    {customer.company_name && (
                      <p className="text-sm text-gray-500">{customer.company_name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    {customer.email && (
                      <div>
                        <span className="text-gray-600">E-posta:</span> {customer.email}
                      </div>
                    )}
                    {customer.phone && (
                      <div>
                        <span className="text-gray-600">Telefon:</span> {customer.phone}
                      </div>
                    )}
                    {customer.tax_id && (
                      <div>
                        <span className="text-gray-600">Vergi No:</span> {customer.tax_id}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-2 border-t border-gray-100">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Görüntüle
                    </Link>
                    <Link
                      href={`/customers/${customer.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => deleteCustomer(customer.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
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
