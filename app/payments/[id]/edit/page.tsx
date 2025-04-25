"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { customerPaymentFunctions, customerInvoiceFunctions, CustomerPayment, CustomerInvoice } from '../../../../lib/database';
import Header from '../../../Header';

// Ödeme düzenleme içerik bileşeni
function EditPaymentContent() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params.id as string;

  const [formData, setFormData] = useState<Partial<CustomerPayment>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    payment_type: 'cash',
    description: '',
    invoice_id: ''
  });

  const [invoice, setInvoice] = useState<CustomerInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ödeme bilgilerini yükle
  useEffect(() => {
    async function loadPayment() {
      try {
        setLoading(true);
        const payment = await customerPaymentFunctions.getById(paymentId);
        
        // Tarih formatını düzelt (YYYY-MM-DD)
        const formattedDate = new Date(payment.date).toISOString().split('T')[0];
        
        setFormData({
          date: formattedDate,
          amount: payment.amount,
          payment_type: payment.payment_type,
          description: payment.description || '',
          invoice_id: payment.invoice_id
        });

        // Fatura bilgilerini getir
        if (payment.invoice_id) {
          const invoiceData = await customerInvoiceFunctions.getById(payment.invoice_id);
          setInvoice(invoiceData);
        }

        setError(null);
      } catch (error) {
        console.error('Ödeme bilgileri yüklenirken hata oluştu:', error);
        setError('Ödeme bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    loadPayment();
  }, [paymentId]);

  // Form değişikliklerini işle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Sayısal değerler için dönüşüm yap
    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Formu gönder
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Zorunlu alan kontrolü
      if (!formData.date) {
        throw new Error('Tarih zorunludur.');
      }
      
      if (!formData.amount || formData.amount <= 0) {
        throw new Error('Geçerli bir tutar giriniz.');
      }

      // Ödemeyi güncelle
      await customerPaymentFunctions.update(paymentId, formData);

      // Başarılı olursa fatura detay sayfasına yönlendir
      if (formData.invoice_id) {
        router.push(`/invoices/${formData.invoice_id}`);
      } else {
        router.push('/payments');
      }
    } catch (error) {
      console.error('Ödeme güncellenirken hata oluştu:', error);
      setError(error instanceof Error ? error.message : 'Ödeme güncellenirken bir hata oluştu.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Ödeme Düzenle</h2>
          {invoice && (
            <Link
              href={`/invoices/${invoice.id}`}
              className="text-blue-600 hover:underline"
            >
              Fatura Detaylarına Dön
            </Link>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          {invoice && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Fatura Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Fatura No:</p>
                  <p className="font-medium">{invoice.invoice_number}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Toplam Tutar:</p>
                  <p className="font-medium">{new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                  }).format(invoice.amount)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Kalan Tutar:</p>
                  <p className="font-medium text-red-600">{new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                  }).format(invoice.amount - invoice.paid_amount)}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                  Tarih <span className="text-red-600">*</span>
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
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
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
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link
                href={invoice ? `/invoices/${invoice.id}` : '/payments'}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
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

// Ana bileşen
export default function EditPayment() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-xl">Yükleniyor...</p>
    </div>}>
      <EditPaymentContent />
    </Suspense>
  );
}
