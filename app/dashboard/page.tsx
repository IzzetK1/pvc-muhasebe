"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { transactionFunctions, partnerExpenseFunctions, Transaction } from '../../lib/database';

export default function Dashboard() {
  const [financialSummary, setFinancialSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    profit: 0,
    profitMargin: 0,
    partnerExpenses: [] as { name: string; amount: number }[],
    recentTransactions: [] as Transaction[]
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verileri yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // İşlemleri getir
        const transactions = await transactionFunctions.getAll();

        // Ortak harcamalarını getir
        const partnerExpenses = await partnerExpenseFunctions.getAll();

        // Toplam gelir ve giderleri hesapla
        const totalIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        const profit = totalIncome - totalExpense;
        const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

        // Ortak harcamalarını grupla
        const partnerExpenseSummary = [
          {
            name: 'Mehmet',
            amount: partnerExpenses
              .filter(e => e.partner_id === 'partner1')
              .reduce((sum, e) => sum + e.amount, 0)
          },
          {
            name: 'Abdülaziz',
            amount: partnerExpenses
              .filter(e => e.partner_id === 'partner2')
              .reduce((sum, e) => sum + e.amount, 0)
          }
        ];

        // Son 5 işlemi al
        const recentTransactions = transactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        setFinancialSummary({
          totalIncome,
          totalExpense,
          profit,
          profitMargin,
          partnerExpenses: partnerExpenseSummary,
          recentTransactions
        });
      } catch (err) {
        console.error('Veriler yüklenirken hata:', err);
        console.log('Hata detayları:', JSON.stringify(err, null, 2));
        setError(`Veriler yüklenirken bir hata oluştu: ${err.message || 'Bilinmeyen hata'}. Lütfen sayfayı yenileyin.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Para birimini formatlama fonksiyonu
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">PVC Muhasebe</h1>
              <p className="text-sm">Yönetim Paneli</p>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:underline">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/transactions" className="hover:underline">
                    İşlemler
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="hover:underline">
                    Raporlar
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="hover:underline">
                    Ortaklar
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Finansal Özet</h2>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p>Veriler yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Sayfayı Yenile
            </button>
          </div>
        ) : (
          <>
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-500">Toplam Gelir</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(financialSummary.totalIncome)}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-500">Toplam Gider</h3>
                <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(financialSummary.totalExpense)}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-500">Kar</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(financialSummary.profit)}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-500">Kar Marjı</h3>
                <p className="text-2xl font-bold text-purple-600 mt-2">%{financialSummary.profitMargin.toFixed(1)}</p>
              </div>
            </div>
          </>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Transactions */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Son İşlemler</h3>
                  <Link href="/transactions" className="text-blue-600 hover:underline text-sm">
                    Tümünü Gör
                  </Link>
                </div>

                {financialSummary.recentTransactions.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <p>Henüz işlem kaydı bulunmamaktadır.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-3 pr-4">Tarih</th>
                          <th className="pb-3 pr-4">Açıklama</th>
                          <th className="pb-3 text-right">Tutar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financialSummary.recentTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 pr-4">{new Date(transaction.date).toLocaleDateString('tr-TR')}</td>
                            <td className="py-3 pr-4">{transaction.description}</td>
                            <td className={`py-3 text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(transaction.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Partner Expenses */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Ortak Harcamaları</h3>
                  <Link href="/partners" className="text-blue-600 hover:underline text-sm">
                    Detaylar
                  </Link>
                </div>

                {financialSummary.partnerExpenses.length === 0 ||
                 financialSummary.partnerExpenses.every(p => p.amount === 0) ? (
                  <div className="py-4 text-center text-gray-500">
                    <p>Henüz ortak harcaması bulunmamaktadır.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {financialSummary.partnerExpenses.map((partner, index) => (
                      partner.amount > 0 && (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-medium">{partner.name}</span>
                          <span className="text-red-600 font-medium">{formatCurrency(partner.amount)}</span>
                        </div>
                      )
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <Link
                    href="/partners/expenses/new"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition-colors"
                  >
                    Harcama Ekle
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Hızlı İşlemler</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/transactions/new?type=income"
                  className="bg-green-100 hover:bg-green-200 p-4 rounded-lg text-center transition-colors"
                >
                  <div className="text-green-600 font-medium">Gelir Ekle</div>
                </Link>

                <Link
                  href="/transactions/new?type=expense"
                  className="bg-red-100 hover:bg-red-200 p-4 rounded-lg text-center transition-colors"
                >
                  <div className="text-red-600 font-medium">Gider Ekle</div>
                </Link>

                <Link
                  href="/partners/expenses/new"
                  className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center transition-colors"
                >
                  <div className="text-blue-600 font-medium">Ortak Harcaması Ekle</div>
                </Link>

                <Link
                  href="/partners/settings"
                  className="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg text-center transition-colors"
                >
                  <div className="text-purple-600 font-medium">Ayarlar</div>
                </Link>
              </div>
            </div>
          </>
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
