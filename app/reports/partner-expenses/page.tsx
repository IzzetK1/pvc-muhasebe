"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { partnerFunctions, partnerExpenseFunctions, Partner, PartnerExpense } from '../../../lib/database';
import Header from '../../Header';

export default function PartnerExpensesReport() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [expenses, setExpenses] = useState<PartnerExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // month, quarter, year, all
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [quarter, setQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);

  // Verileri yükle
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Ortakları getir
        const partnersData = await partnerFunctions.getAll();
        setPartners(partnersData);

        // Tüm ortak harcamalarını getir
        const allExpenses = await partnerExpenseFunctions.getAll();
        setExpenses(allExpenses);
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

  // Seçilen döneme göre harcamaları filtrele
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const expenseYear = expenseDate.getFullYear();
    const expenseMonth = expenseDate.getMonth();
    const expenseQuarter = Math.floor(expenseMonth / 3) + 1;

    if (period === 'month') {
      return expenseYear === year && expenseMonth === month;
    } else if (period === 'quarter') {
      return expenseYear === year && expenseQuarter === quarter;
    } else if (period === 'year') {
      return expenseYear === year;
    }
    return true; // 'all' durumunda tüm harcamaları göster
  });

  // Ortak bazlı harcamaları hesapla
  const expensesByPartner: Record<string, number> = {};

  filteredExpenses.forEach(expense => {
    const partnerId = expense.partner_id;
    expensesByPartner[partnerId] = (expensesByPartner[partnerId] || 0) + expense.amount;
  });

  // Kategori bazlı harcamaları hesapla
  const expensesByCategory: Record<string, number> = {};

  filteredExpenses.forEach(expense => {
    const categoryId = expense.category_id || 'uncategorized';
    expensesByCategory[categoryId] = (expensesByCategory[categoryId] || 0) + expense.amount;
  });

  // Toplam harcama
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

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
    } else if (period === 'year') {
      return `${year} Yılı`;
    } else {
      return 'Tüm Zamanlar';
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
            Ortak Harcamaları Raporu
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
                <option value="all">Tüm Zamanlar</option>
              </select>
            </div>

            {period !== 'all' && (
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
            )}

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Toplam Harcama:</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Ortak Sayısı:</p>
              <p className="text-2xl font-bold text-blue-600">
                {Object.keys(expensesByPartner).length}
              </p>
            </div>
          </div>
        </div>

        {/* Partner Expenses */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-800">Ortak Bazlı Harcamalar</h3>
          </div>

          {loading ? (
            <p className="text-center py-8">Yükleniyor...</p>
          ) : filteredExpenses.length === 0 ? (
            <p className="text-center py-8">Bu dönem için harcama bulunmamaktadır.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-gray-600">Ortak</th>
                    <th className="px-6 py-3 text-gray-600 text-right">Harcama Tutarı</th>
                    <th className="px-6 py-3 text-gray-600 text-right">Oran</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => {
                    const partnerExpense = expensesByPartner[partner.id] || 0;
                    const percentage = totalExpenses > 0
                      ? (partnerExpense / totalExpenses) * 100
                      : 0;

                    return (
                      <tr key={partner.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{partner.name}</td>
                        <td className="px-6 py-4 text-right text-red-600 font-medium">
                          {formatCurrency(partnerExpense)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          %{percentage.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-100 font-medium">
                  <tr>
                    <td className="px-6 py-4">Toplam</td>
                    <td className="px-6 py-4 text-right text-red-600">
                      {formatCurrency(totalExpenses)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      %100
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-800">Harcama Listesi</h3>
          </div>

          {loading ? (
            <p className="text-center py-8">Yükleniyor...</p>
          ) : filteredExpenses.length === 0 ? (
            <p className="text-center py-8">Bu dönem için harcama bulunmamaktadır.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-gray-600">Tarih</th>
                    <th className="px-6 py-3 text-gray-600">Ortak</th>
                    <th className="px-6 py-3 text-gray-600">Açıklama</th>
                    <th className="px-6 py-3 text-gray-600">Kategori</th>
                    <th className="px-6 py-3 text-gray-600 text-right">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => {
                    const partner = partners.find(p => p.id === expense.partner_id);

                    return (
                      <tr key={expense.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{new Date(expense.date).toLocaleDateString('tr-TR')}</td>
                        <td className="px-6 py-4">{partner ? partner.name : 'Bilinmeyen'}</td>
                        <td className="px-6 py-4">{expense.description}</td>
                        <td className="px-6 py-4">{expense.category_id || '-'}</td>
                        <td className="px-6 py-4 text-right text-red-600 font-medium">
                          {formatCurrency(expense.amount)}
                        </td>
                      </tr>
                    );
                  })}
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
