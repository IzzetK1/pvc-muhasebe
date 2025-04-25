"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { use } from 'react';
import { customerInvoiceFunctions, customerPaymentFunctions, CustomerInvoice } from '../../../../lib/database';
import Header from '../../../Header';

export default function InvoicePayment() {
  const params = useParams();
  const resolvedParams = use(params);
  const router = useRouter();
  const invoiceId = resolvedParams.id as string;

  const [invoice, setInvoice] = useState<CustomerInvoice | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    payment_type: 'bank_transfer',
    description: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fatura bilgilerini yükle
        const invoiceData = await customerInvoiceFunctions.getById(invoiceId);
        setInvoice(invoiceData);

        // Kalan tutarı form verisine ekle
        const remainingAmount = invoiceData.amount - invoiceData.paid_amount;
        setFormData(prev => ({
          ...prev,
          amount: remainingAmount
        }));
      } catch (err) {
        console.error('Veriler yüklenirken hata oluştu:', err);
        setError('Veriler yüklenirken bir hata oluştu.');
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, [invoiceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Sayısal değerler için dönüşüm yap
    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!invoice) {
        throw new Error('Fatura bilgileri yüklenemedi.');
      }

      if (formData.amount <= 0) {
        throw new Error('Ödeme tutarı sıfırdan büyük olmalıdır.');
      }

      // Kalan tutardan fazla ödeme yapılmamasını kontrol et
      const remainingAmount = invoice.amount - invoice.paid_amount;
      if (formData.amount > remainingAmount) {
        throw new Error(`Ödeme tutarı kalan tutardan (${formatCurrency(remainingAmount)}) fazla olamaz.`);
      }

      // Ödemeyi oluştur
      const payment = await customerPaymentFunctions.create({
        customer_id: invoice.customer_id,
        project_id: invoice.project_id || undefined,
        date: formData.date,
        amount: formData.amount,
        payment_type: formData.payment_type as 'cash' | 'bank_transfer' | 'credit_card' | 'check' | 'other',
        description: formData.description || `Fatura #${invoice.invoice_number} ödemesi`,
        notes: formData.notes || undefined
      });

      // Fatura durumunu güncelle
      await customerInvoiceFunctions.updateStatus(invoiceId, formData.amount);

      // Başarılı olursa fatura detay sayfasına yönlendir
      router.push(`/invoices/${invoiceId}`);
    } catch (err) {
      console.error('Ödeme eklenirken hata oluştu:', err);
      setError(err instanceof Error ? err.message : 'Ödeme eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

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

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Fatura bulunamadı.</p>
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
          <h2 className="text-2xl font-semibold text-gray-800">Fatura Ödemesi Ekle</h2>
          <Link
            href={`/invoices/${invoiceId}`}
            className="text-blue-600 hover:underline"
          >
            Fatura Detayına Dön
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Fatura Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                  Ödeme Tarihi <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
                  Tutar <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  max={invoice.amount - invoice.paid_amount}
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(formData.amount)}
                </p>
              </div>

              <div>
                <label htmlFor="payment_type" className="block text-gray-700 font-medium mb-2">
                  Ödeme Tipi <span className="text-red-600">*</span>
                </label>
                <select
                  id="payment_type"
                  name="payment_type"
                  value={formData.payment_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="cash">Nakit</option>
                  <option value="bank_transfer">Havale/EFT</option>
                  <option value="credit_card">Kredi Kartı</option>
                  <option value="check">Çek</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Açıklama
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={`Fatura #${invoice.invoice_number} ödemesi`}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
                  Notlar
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href={`/invoices/${invoiceId}`}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Ödeme Ekle'}
              </button>
            </div>
          </form>
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
