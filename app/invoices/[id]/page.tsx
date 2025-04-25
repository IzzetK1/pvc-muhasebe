"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { customerInvoiceFunctions, customerFunctions, projectFunctions, customerPaymentFunctions, CustomerInvoice, Customer, Project, CustomerPayment } from '../../../lib/database';
import Header from '../../Header';

// İçerik bileşeni
function InvoiceDetailContent() {
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<CustomerInvoice | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Fatura bilgilerini getir
        const invoiceData = await customerInvoiceFunctions.getById(invoiceId);
        setInvoice(invoiceData);

        // Müşteri bilgilerini getir
        const customerData = await customerFunctions.getById(invoiceData.customer_id);
        setCustomer(customerData);

        // Proje bilgilerini getir (eğer varsa)
        if (invoiceData.project_id) {
          const projectData = await projectFunctions.getById(invoiceData.project_id);
          setProject(projectData);
        }

        // Faturaya ait ödemeleri getir
        // Not: Bu fonksiyon henüz eklenmedi, ama eklenecek
        // const paymentsData = await customerPaymentFunctions.getByInvoiceId(invoiceId);
        // setPayments(paymentsData);

        // Şimdilik boş bir dizi kullanıyoruz
        setPayments([]);
      } catch (err) {
        console.error('Veriler yüklenirken hata oluştu:', err);
        setError('Fatura bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [invoiceId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    );
  }

  if (error || !invoice || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Fatura bulunamadı.'}</p>
          <Link href="/invoices" className="text-blue-600 hover:underline">
            Faturalar sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Fatura #{invoice.invoice_number}</h2>
          <div className="flex space-x-2">
            <Link
              href={`/customers/${customer.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Müşteri Detayı
            </Link>
            {invoice.status !== 'paid' && (
              <Link
                href={`/invoices/${invoice.id}/payment`}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
              >
                Ödeme Ekle
              </Link>
            )}
          </div>
        </div>

        {/* Invoice Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Fatura Bilgileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Fatura No:</p>
              <p className="font-medium">{invoice.invoice_number}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Tarih:</p>
              <p className="font-medium">{formatDate(invoice.date)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Vade Tarihi:</p>
              <p className="font-medium">{formatDate(invoice.due_date)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Durum:</p>
              <p className="font-medium">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.status === 'paid' ? 'Ödendi' :
                   invoice.status === 'partially_paid' ? 'Kısmi Ödendi' :
                   'Ödenmedi'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Toplam Tutar:</p>
              <p className="font-medium">{formatCurrency(invoice.amount)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Ödenen Tutar:</p>
              <p className="font-medium text-green-600">{formatCurrency(invoice.paid_amount)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Kalan Tutar:</p>
              <p className="font-medium text-red-600">{formatCurrency(invoice.amount - invoice.paid_amount)}</p>
            </div>
            {project && (
              <div>
                <p className="text-gray-600 mb-1">Proje:</p>
                <p className="font-medium">
                  <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                    {project.name}
                  </Link>
                </p>
              </div>
            )}
            {invoice.notes && (
              <div className="md:col-span-3">
                <p className="text-gray-600 mb-1">Notlar:</p>
                <p className="font-medium">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Müşteri Bilgileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Müşteri Adı:</p>
              <p className="font-medium">
                <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:underline">
                  {customer.name}
                </Link>
              </p>
            </div>
            {customer.company_name && (
              <div>
                <p className="text-gray-600 mb-1">Firma Adı:</p>
                <p className="font-medium">{customer.company_name}</p>
              </div>
            )}
            {customer.email && (
              <div>
                <p className="text-gray-600 mb-1">E-posta:</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            )}
            {customer.phone && (
              <div>
                <p className="text-gray-600 mb-1">Telefon:</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            )}
            {customer.tax_id && (
              <div>
                <p className="text-gray-600 mb-1">Vergi No:</p>
                <p className="font-medium">{customer.tax_id}</p>
              </div>
            )}
            {customer.address && (
              <div className="md:col-span-2">
                <p className="text-gray-600 mb-1">Adres:</p>
                <p className="font-medium">{customer.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payments */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Ödemeler</h3>
            {invoice.status !== 'paid' && (
              <Link
                href={`/invoices/${invoice.id}/payment`}
                className="text-blue-600 hover:underline text-sm"
              >
                Ödeme Ekle
              </Link>
            )}
          </div>

          {payments.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              <p>Bu faturaya ait ödeme bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-gray-600">Tarih</th>
                    <th className="px-4 py-2 text-gray-600">Açıklama</th>
                    <th className="px-4 py-2 text-gray-600">Ödeme Tipi</th>
                    <th className="px-4 py-2 text-gray-600 text-right">Tutar</th>
                    <th className="px-4 py-2 text-gray-600 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-4 py-2">
                        {payment.description || '-'}
                      </td>
                      <td className="px-4 py-2">
                        {payment.payment_type === 'cash' ? 'Nakit' :
                         payment.payment_type === 'bank_transfer' ? 'Havale/EFT' :
                         payment.payment_type === 'credit_card' ? 'Kredi Kartı' :
                         payment.payment_type === 'check' ? 'Çek' : 'Diğer'}
                      </td>
                      <td className="px-4 py-2 text-right text-green-600 font-medium">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Link href={`/payments/${payment.id}`} className="text-blue-600 hover:text-blue-800">
                          Görüntüle
                        </Link>
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

// Ana bileşen
export default function InvoiceDetail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-xl">Yükleniyor...</p>
    </div>}>
      <InvoiceDetailContent />
    </Suspense>
  );
}
