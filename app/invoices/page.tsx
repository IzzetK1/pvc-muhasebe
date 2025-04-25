"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { customerInvoiceFunctions, customerFunctions, CustomerInvoice, Customer } from '../../lib/database';
import Header from '../Header';

export default function Invoices() {
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);
  const [customers, setCustomers] = useState<Record<string, Customer>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fatura ve müşteri verilerini yükle
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Tüm faturaları getir
        const invoicesData = await customerInvoiceFunctions.getAll();
        setInvoices(invoicesData);
        
        // Müşteri bilgilerini getir
        const customersMap: Record<string, Customer> = {};
        const customerIds = [...new Set(invoicesData.map(invoice => invoice.customer_id))];
        
        for (const customerId of customerIds) {
          const customer = await customerFunctions.getById(customerId);
          customersMap[customerId] = customer;
        }
        
        setCustomers(customersMap);
        setError(null);
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error);
        setError('Faturalar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Para birimini formatlama fonksiyonu
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Tarih formatlama fonksiyonu
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  // Durum metni
  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Ödendi';
      case 'partially_paid':
        return 'Kısmi Ödendi';
      case 'unpaid':
        return 'Ödenmedi';
      default:
        return status;
    }
  };

  // Durum rengi
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partially_paid':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Faturalar</h2>
          <Link
            href="/invoices/new"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
          >
            Yeni Fatura Oluştur
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-center py-8">Yükleniyor...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-center py-8 text-gray-500">Henüz fatura bulunmamaktadır.</p>
            <div className="text-center">
              <Link
                href="/invoices/new"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              >
                İlk Faturanızı Oluşturun
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-gray-600">Fatura No</th>
                    <th className="px-4 py-3 text-gray-600">Müşteri</th>
                    <th className="px-4 py-3 text-gray-600">Tarih</th>
                    <th className="px-4 py-3 text-gray-600">Vade Tarihi</th>
                    <th className="px-4 py-3 text-gray-600">Tutar</th>
                    <th className="px-4 py-3 text-gray-600">Ödenen</th>
                    <th className="px-4 py-3 text-gray-600">Durum</th>
                    <th className="px-4 py-3 text-gray-600 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/invoices/${invoice.id}`} className="text-blue-600 hover:underline">
                          {invoice.invoice_number}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {customers[invoice.customer_id] ? (
                          <Link href={`/customers/${invoice.customer_id}`} className="text-blue-600 hover:underline">
                            {customers[invoice.customer_id].name}
                          </Link>
                        ) : (
                          'Yükleniyor...'
                        )}
                      </td>
                      <td className="px-4 py-3">{formatDate(invoice.date)}</td>
                      <td className="px-4 py-3">{formatDate(invoice.due_date)}</td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(invoice.amount)}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">{formatCurrency(invoice.paid_amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <Link href={`/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-800">
                            Görüntüle
                          </Link>
                          {invoice.status !== 'paid' && (
                            <Link href={`/invoices/${invoice.id}/payment`} className="text-green-600 hover:text-green-800">
                              Ödeme Ekle
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
