"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { transactionFunctions, Transaction } from '../../../lib/database';
import Header from '../../Header';

export default function ProfitLossReport() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  // Verileri yükle
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await transactionFunctions.getAll();
        setTransactions(data);
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error);
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

  // Seçilen yıla göre işlemleri filtrele
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getFullYear() === year;
  });

  // Aylık gelir, gider ve kar hesapla
  const monthlyData = Array(12).fill(0).map((_, index) => {
    const monthTransactions = filteredTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === index;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = income - expense;
    const profitMargin = income > 0 ? (profit / income) * 100 : 0;

    return {
      month: index,
      income,
      expense,
      profit,
      profitMargin
    };
  });

  // Toplam yıllık değerleri hesapla
  const yearlyTotals = {
    income: monthlyData.reduce((sum, month) => sum + month.income, 0),
    expense: monthlyData.reduce((sum, month) => sum + month.expense, 0),
    profit: monthlyData.reduce((sum, month) => sum + month.profit, 0)
  };

  const yearlyProfitMargin = yearlyTotals.income > 0
    ? (yearlyTotals.profit / yearlyTotals.income) * 100
    : 0;

  // Ay adlarını al
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/reports" className="text-blue-600 hover:underline mr-4">
            &larr; Raporlara Dön
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800">
            Kar-Zarar Raporu
          </h2>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="year" className="block text-gray-700 font-medium mb-2">
                Yıl
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* Yearly Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {year} Yılı Özeti
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Toplam Gelir:</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(yearlyTotals.income)}</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Toplam Gider:</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(yearlyTotals.expense)}</p>
            </div>

            <div className={`p-4 rounded-lg ${yearlyTotals.profit >= 0 ? 'bg-blue-50' : 'bg-red-50'}`}>
              <p className="text-gray-600 mb-1">Kar/Zarar:</p>
              <p className={`text-2xl font-bold ${yearlyTotals.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(yearlyTotals.profit)}
              </p>
            </div>

            <div className={`p-4 rounded-lg ${yearlyTotals.profit >= 0 ? 'bg-blue-50' : 'bg-red-50'}`}>
              <p className="text-gray-600 mb-1">Kar Marjı:</p>
              <p className={`text-2xl font-bold ${yearlyTotals.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                %{yearlyProfitMargin.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Data */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-800">Aylık Kar-Zarar</h3>
          </div>

          {loading ? (
            <p className="text-center py-8">Yükleniyor...</p>
          ) : filteredTransactions.length === 0 ? (
            <p className="text-center py-8">Bu yıl için işlem bulunmamaktadır.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-gray-600">Ay</th>
                    <th className="px-6 py-3 text-gray-600 text-right">Gelir</th>
                    <th className="px-6 py-3 text-gray-600 text-right">Gider</th>
                    <th className="px-6 py-3 text-gray-600 text-right">Kar/Zarar</th>
                    <th className="px-6 py-3 text-gray-600 text-right">Kar Marjı</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((data) => (
                    <tr key={data.month} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{monthNames[data.month]}</td>
                      <td className="px-6 py-4 text-right text-green-600">
                        {formatCurrency(data.income)}
                      </td>
                      <td className="px-6 py-4 text-right text-red-600">
                        {formatCurrency(data.expense)}
                      </td>
                      <td className={`px-6 py-4 text-right font-medium ${
                        data.profit >= 0 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(data.profit)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.income > 0 ? `%${data.profitMargin.toFixed(1)}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-medium">
                  <tr>
                    <td className="px-6 py-4">Toplam</td>
                    <td className="px-6 py-4 text-right text-green-600">
                      {formatCurrency(yearlyTotals.income)}
                    </td>
                    <td className="px-6 py-4 text-right text-red-600">
                      {formatCurrency(yearlyTotals.expense)}
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${
                      yearlyTotals.profit >= 0 ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(yearlyTotals.profit)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      %{yearlyProfitMargin.toFixed(1)}
                    </td>
                  </tr>
                </tfoot>
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
