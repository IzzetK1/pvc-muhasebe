"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { customerFunctions, projectFunctions, customerInvoiceFunctions, customerPaymentFunctions, Customer, Project, CustomerInvoice, CustomerPayment } from '../../../lib/database';
import Header from '../../Header';

type AccountSummary = {
  customer: Customer;
  projects: Project[];
  invoices: CustomerInvoice[];
  payments: CustomerPayment[];
  summary: {
    totalInvoiced: number;
    totalPaid: number;
    balance: number;
  };
};

export default function CustomerDetail() {
  const params = useParams();
  const customerId = params.id as string;

  const [accountSummary, setAccountSummary] = useState<AccountSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomerData() {
      try {
        const data = await customerFunctions.getAccountSummary(customerId);
        setAccountSummary(data);
      } catch (err) {
        console.error('Müşteri bilgileri yüklenirken hata oluştu:', err);
        setError('Müşteri bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    loadCustomerData();
  }, [customerId]);

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

  if (error || !accountSummary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Müşteri bulunamadı.'}</p>
          <Link href="/customers" className="text-blue-600 hover:underline">
            Müşteriler sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  const { customer, projects, invoices, payments, summary } = accountSummary;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{customer.name}</h2>
          <div className="flex space-x-2">
            <Link
              href={`/customers/${customer.id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Düzenle
            </Link>
            <Link
              href={`/customers/${customer.id}/invoices/new`}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
            >
              Fatura Ekle
            </Link>
            <Link
              href={`/customers/${customer.id}/payments/new`}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors"
            >
              Ödeme Ekle
            </Link>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Müşteri Bilgileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Firma Adı:</p>
              <p className="font-medium">{customer.company_name || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Vergi No:</p>
              <p className="font-medium">{customer.tax_id || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">E-posta:</p>
              <p className="font-medium">{customer.email || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Telefon:</p>
              <p className="font-medium">{customer.phone || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600 mb-1">Adres:</p>
              <p className="font-medium">{customer.address || '-'}</p>
            </div>
            {customer.notes && (
              <div className="md:col-span-2">
                <p className="text-gray-600 mb-1">Notlar:</p>
                <p className="font-medium">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Account Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Hesap Özeti</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Toplam Fatura Tutarı:</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.totalInvoiced)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Toplam Ödeme:</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalPaid)}</p>
            </div>
            <div className={`p-4 rounded-lg ${summary.balance > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              <p className="text-gray-600 mb-1">Bakiye:</p>
              <p className={`text-2xl font-bold ${summary.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(summary.balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Projeler</h3>
            <Link
              href={`/projects/new?customer_id=${customer.id}`}
              className="text-blue-600 hover:underline"
            >
              Yeni Proje Ekle
            </Link>
          </div>

          {projects.length === 0 ? (
            <p className="text-center py-4">Bu müşteriye ait proje bulunmamaktadır.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-gray-600">Proje Adı</th>
                    <th className="px-4 py-2 text-gray-600">Tarih</th>
                    <th className="px-4 py-2 text-gray-600">Durum</th>
                    <th className="px-4 py-2 text-gray-600 text-right">Gelir</th>
                    <th className="px-4 py-2 text-gray-600 text-right">Gider</th>
                    <th className="px-4 py-2 text-gray-600 text-right">Kar</th>
                    <th className="px-4 py-2 text-gray-600 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">
                        <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                          {project.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2">
                        {formatDate(project.start_date)}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.status === 'active' ? 'Devam Ediyor' :
                           project.status === 'completed' ? 'Tamamlandı' :
                           'İptal Edildi'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right text-green-600">
                        {formatCurrency(project.total_income)}
                      </td>
                      <td className="px-4 py-2 text-right text-red-600">
                        {formatCurrency(project.total_expense)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="font-medium text-blue-600">{formatCurrency(project.profit || 0)}</div>
                        <div className="text-xs text-gray-500">%{(project.profit_margin || 0).toFixed(1)}</div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Link href={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-800">
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

        {/* Invoices */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Faturalar</h3>
            <Link
              href={`/customers/${customer.id}/invoices/new`}
              className="text-blue-600 hover:underline"
            >
              Yeni Fatura Ekle
            </Link>
          </div>

          {invoices.length === 0 ? (
            <p className="text-center py-4">Bu müşteriye ait fatura bulunmamaktadır.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-gray-600">Fatura No</th>
                    <th className="px-4 py-2 text-gray-600">Tarih</th>
                    <th className="px-4 py-2 text-gray-600">Vade Tarihi</th>
                    <th className="px-4 py-2 text-gray-600">Durum</th>
                    <th className="px-4 py-2 text-gray-600 text-right">Tutar</th>
                    <th className="px-4 py-2 text-gray-600 text-right">Ödenen</th>
                    <th className="px-4 py-2 text-gray-600 text-right">Kalan</th>
                    <th className="px-4 py-2 text-gray-600 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">
                        <Link href={`/invoices/${invoice.id}`} className="text-blue-600 hover:underline">
                          {invoice.invoice_number}
                        </Link>
                      </td>
                      <td className="px-4 py-2">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="px-4 py-2">
                        {formatDate(invoice.due_date)}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status === 'paid' ? 'Ödendi' :
                           invoice.status === 'partially_paid' ? 'Kısmi Ödendi' :
                           'Ödenmedi'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-4 py-2 text-right text-green-600">
                        {formatCurrency(invoice.paid_amount)}
                      </td>
                      <td className="px-4 py-2 text-right text-red-600">
                        {formatCurrency(invoice.amount - invoice.paid_amount)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <Link href={`/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-800">
                            Görüntüle
                          </Link>
                          <Link href={`/invoices/${invoice.id}/payment`} className="text-green-600 hover:text-green-800">
                            Ödeme Ekle
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payments */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Ödemeler</h3>
            <Link
              href={`/customers/${customer.id}/payments/new`}
              className="text-blue-600 hover:underline"
            >
              Yeni Ödeme Ekle
            </Link>
          </div>

          {payments.length === 0 ? (
            <p className="text-center py-4">Bu müşteriye ait ödeme bulunmamaktadır.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-gray-600">Tarih</th>
                    <th className="px-4 py-2 text-gray-600">Açıklama</th>
                    <th className="px-4 py-2 text-gray-600">Ödeme Tipi</th>
                    <th className="px-4 py-2 text-gray-600">Proje</th>
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
                      <td className="px-4 py-2">
                        {payment.project_id ? (
                          <Link href={`/projects/${payment.project_id}`} className="text-blue-600 hover:underline">
                            {projects.find(p => p.id === payment.project_id)?.name || 'Proje'}
                          </Link>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-2 text-right text-green-600 font-medium">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <Link href={`/payments/${payment.id}`} className="text-blue-600 hover:text-blue-800">
                            Görüntüle
                          </Link>
                          <Link href={`/payments/${payment.id}/edit`} className="text-blue-600 hover:text-blue-800">
                            Düzenle
                          </Link>
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
