"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { customerPaymentFunctions, customerInvoiceFunctions, customerFunctions, CustomerPayment, CustomerInvoice, Customer } from '../../../lib/database';
import Header from '../../Header';

// Ödeme detay içerik bileşeni
function PaymentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;

  const [payment, setPayment] = useState<CustomerPayment | null>(null);
  const [invoice, setInvoice] = useState<CustomerInvoice | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Ödeme bilgilerini getir
        const paymentData = await customerPaymentFunctions.getById(paymentId);
        setPayment(paymentData);

        // Fatura bilgilerini getir
        if (paymentData.invoice_id) {
          const invoiceData = await customerInvoiceFunctions.getById(paymentData.invoice_id);
          setInvoice(invoiceData);

          // Müşteri bilgilerini getir
          const customerData = await customerFunctions.getById(invoiceData.customer_id);
          setCustomer(customerData);
        }
      } catch (err) {
        console.error('Veriler yüklenirken hata oluştu:', err);
        setError('Ödeme bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [paymentId]);

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

  // Ödeme silme fonksiyonu
  const handleDelete = async () => {
    if (window.confirm('Bu ödemeyi silmek istediğinizden emin misiniz?')) {
      try {
        await customerPaymentFunctions.delete(paymentId);
        
        // Başarılı olursa fatura detay sayfasına yönlendir
        if (invoice) {
          router.push(`/invoices/${invoice.id}`);
        } else {
          router.push('/payments');
        }
      } catch (error) {
        console.error('Ödeme silinirken hata oluştu:', error);
        setError('Ödeme silinirken bir hata oluştu.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Ödeme bulunamadı.'}</p>
          <Link href="/payments" className="text-blue-600 hover:underline">
            Ödemeler sayfasına dön
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
          <h2 className="text-2xl font-semibold text-gray-800">Ödeme Detayı</h2>
          <div className="flex space-x-2">
            {invoice && (
              <Link
                href={`/invoices/${invoice.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              >
                Fatura Detayı
              </Link>
            )}
            <Link
              href={`/payments/${payment.id}/edit`}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
            >
              Düzenle
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
            >
              Sil
            </button>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ödeme Bilgileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Ödeme ID:</p>
              <p className="font-medium">{payment.id}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Tarih:</p>
              <p className="font-medium">{formatDate(payment.date)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Tutar:</p>
              <p className="font-medium text-green-600">{formatCurrency(payment.amount)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Ödeme Tipi:</p>
              <p className="font-medium">
                {payment.payment_type === 'cash' ? 'Nakit' :
                 payment.payment_type === 'bank_transfer' ? 'Havale/EFT' :
                 payment.payment_type === 'credit_card' ? 'Kredi Kartı' :
                 payment.payment_type === 'check' ? 'Çek' : 'Diğer'}
              </p>
            </div>
            {payment.description && (
              <div className="md:col-span-3">
                <p className="text-gray-600 mb-1">Açıklama:</p>
                <p className="font-medium">{payment.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Info */}
        {invoice && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Fatura Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Fatura No:</p>
                <p className="font-medium">
                  <Link href={`/invoices/${invoice.id}`} className="text-blue-600 hover:underline">
                    {invoice.invoice_number}
                  </Link>
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Fatura Tarihi:</p>
                <p className="font-medium">{formatDate(invoice.date)}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Vade Tarihi:</p>
                <p className="font-medium">{formatDate(invoice.due_date)}</p>
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
            </div>
          </div>
        )}

        {/* Customer Info */}
        {customer && (
          <div className="bg-white rounded-lg shadow-md p-6">
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

// Ana bileşen
export default function PaymentDetail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-xl">Yükleniyor...</p>
    </div>}>
      <PaymentDetailContent />
    </Suspense>
  );
}
