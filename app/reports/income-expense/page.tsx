"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { transactionFunctions, Transaction } from '../../../lib/database';
import Header from '../../../components/Header';

export default function IncomeExpenseReport() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // month, quarter, year
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [quarter, setQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);

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

  // Seçilen döneme göre işlemleri filtrele
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth();
    const transactionQuarter = Math.floor(transactionMonth / 3) + 1;

    if (period === 'month') {
      return transactionYear === year && transactionMonth === month;
    } else if (period === 'quarter') {
      return transactionYear === year && transactionQuarter === quarter;
    } else if (period === 'year') {
      return transactionYear === year;
    }
    return true;
  });

  // Gelir ve giderleri hesapla
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

  // Kategori bazlı gelir ve giderleri hesapla
  const incomeByCategory: Record<string, number> = {};
  const expenseByCategory: Record<string, number> = {};

  filteredTransactions.forEach(transaction => {
    const categoryId = transaction.category_id || 'uncategorized';
    if (transaction.type === 'income') {
      incomeByCategory[categoryId] = (incomeByCategory[categoryId] || 0) + transaction.amount;
    } else {
      expenseByCategory[categoryId] = (expenseByCategory[categoryId] || 0) + transaction.amount;
    }
  });

  // Dönem adını oluştur
  const getPeriodName = () => {
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    if (period === 'month') {
      return `${monthNames[month]} ${year}`;
    } else if (period === 'quarter') {
      return `${year} ${quarter}. Çeyrek`;
    } else {
      return `${year} Yılı`;
    }
  };

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
            Gelir-Gider Raporu
          </h2>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="period" className="block text-gray-700 font-medium mb-2">
                Dönem
              </label>
              <select
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="month">Aylık</option>
                <option value="quarter">Çeyreklik</option>
                <option value="year">Yıllık</option>
              </select>
            </div>

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

            {period === 'month' && (
              <div>
                <label htmlFor="month" className="block text-gray-700 font-medium mb-2">
                  Ay
                </label>
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Ocak</option>
                  <option value="1">Şubat</option>
                  <option value="2">Mart</option>
                  <option value="3">Nisan</option>
                  <option value="4">Mayıs</option>
                  <option value="5">Haziran</option>
                  <option value="6">Temmuz</option>
                  <option value="7">Ağustos</option>
                  <option value="8">Eylül</option>
                  <option value="9">Ekim</option>
                  <option value="10">Kasım</option>
                  <option value="11">Aralık</option>
                </select>
              </div>
            )}

            {period === 'quarter' && (
              <div>
                <label htmlFor="quarter" className="block text-gray-700 font-medium mb-2">
                  Çeyrek
                </label>
                <select
                  id="quarter"
                  value={quarter}
                  onChange={(e) => setQuarter(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1. Çeyrek (Ocak-Mart)</option>
                  <option value="2">2. Çeyrek (Nisan-Haziran)</option>
                  <option value="3">3. Çeyrek (Temmuz-Eylül)</option>
                  <option value="4">4. Çeyrek (Ekim-Aralık)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {getPeriodName()} Özeti
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Toplam Gelir:</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Toplam Gider:</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
            </div>

            <div className={`p-4 rounded-lg ${profit >= 0 ? 'bg-blue-50' : 'bg-red-50'}`}>
              <p className="text-gray-600 mb-1">Kar/Zarar:</p>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(profit)}
              </p>
            </div>

            <div className={`p-4 rounded-lg ${profit >= 0 ? 'bg-blue-50' : 'bg-red-50'}`}>
              <p className="text-gray-600 mb-1">Kar Marjı:</p>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                %{profitMargin.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-800">İşlem Listesi</h3>
          </div>

          {loading ? (
            <p className="text-center py-8">Yükleniyor...</p>
          ) : filteredTransactions.length === 0 ? (
            <p className="text-center py-8">Bu dönem için işlem bulunmamaktadır.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-gray-600">Tarih</th>
                    <th className="px-6 py-3 text-gray-600">Açıklama</th>
                    <th className="px-6 py-3 text-gray-600">Tür</th>
                    <th className="px-6 py-3 text-gray-600 text-right">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{new Date(transaction.date).toLocaleDateString('tr-TR')}</td>
                      <td className="px-6 py-4">{transaction.description}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'income' ? 'Gelir' : 'Gider'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(transaction.amount)}
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
