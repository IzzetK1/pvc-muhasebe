"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { use } from 'react';
import { partnerFunctions, partnerExpenseFunctions, Partner, PartnerExpense } from '../../../../lib/database';
import Header from '../../../components/Header';

export default function PartnerExpenses({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [partner, setPartner] = useState<Partner | null>(null);
  const [expenses, setExpenses] = useState<PartnerExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        // Partner bilgilerini al
        const partnerData = await partnerFunctions.getById(id);
        setPartner(partnerData);

        // Harcama verilerini al
        const expensesData = await partnerExpenseFunctions.getByPartnerId(id);
        setExpenses(expensesData);

        // Toplam tutarı hesapla
        const total = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalAmount(total);
      } catch (err) {
        console.error('Veriler yüklenirken hata oluştu:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // Para birimini formatlama fonksiyonu
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Harcama silme işlevi
  const handleDelete = async (expenseId: string) => {
    if (window.confirm('Bu harcamayı silmek istediğinizden emin misiniz?')) {
      try {
        // API'ye istek gönder
        await partnerExpenseFunctions.delete(expenseId);

        // Harcamayı listeden kaldır
        const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
        setExpenses(updatedExpenses);

        // Toplam tutarı güncelle
        const deletedExpense = expenses.find(expense => expense.id === expenseId);
        if (deletedExpense) {
          setTotalAmount(prev => prev - deletedExpense.amount);
        }

        alert('Harcama başarıyla silindi!');
      } catch (err) {
        console.error('Harcama silinirken hata oluştu:', err);
        alert('Harcama silinirken bir hata oluştu.');
      }
    }
  };

  // Aylık harcamaları hesapla
  const calculateMonthlyExpenses = () => {
    const monthlyData: { name: string; amount: number }[] = [];
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    // Harcamaları aylara göre grupla
    const expensesByMonth: Record<string, number> = {};

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth()}`;

      expensesByMonth[monthYear] = (expensesByMonth[monthYear] || 0) + expense.amount;
    });

    // Son 3 ayı göster
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
      const amount = expensesByMonth[monthYear] || 0;

      monthlyData.push({
        name: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
        amount
      });
    }

    return monthlyData;
  };

  // Kategori bazlı harcamaları hesapla
  const calculateCategoryExpenses = () => {
    const categoryData: { name: string; amount: number }[] = [];

    // Harcamaları kategorilere göre grupla
    const expensesByCategory: Record<string, number> = {};

    expenses.forEach(expense => {
      const category = expense.category_id || 'uncategorized';
      expensesByCategory[category] = (expensesByCategory[category] || 0) + expense.amount;
    });

    // Kategorileri tutara göre sırala ve en yüksek 3 kategoriyi göster
    Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([category, amount]) => {
        categoryData.push({
          name: category,
          amount
        });
      });

    return categoryData;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Ortak bulunamadı!</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/partners" className="text-blue-600 hover:underline mr-4">
              &larr; Ortaklara Dön
            </Link>
            <h2 className="text-2xl font-semibold text-gray-800">
              {partner.name} - Harcamalar
            </h2>
          </div>

          {/* Partner Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{partner.name}</h3>
                <p className="text-gray-600">{partner.email}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium text-gray-700">Toplam Harcama</div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalAmount)}</div>
              </div>
            </div>
          </div>

          {/* Expenses List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Harcama Listesi</h3>
              <Link
                href="/partners/expenses/new"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              >
                Yeni Harcama Ekle
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-gray-600">Tarih</th>
                    <th className="px-6 py-3 text-gray-600">Açıklama</th>
                    <th className="px-6 py-3 text-gray-600">Kategori</th>
                    <th className="px-6 py-3 text-gray-600 text-right">Tutar</th>
                    <th className="px-6 py-3 text-gray-600 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length > 0 ? (
                    expenses.map((expense) => (
                      <tr key={expense.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{new Date(expense.date).toLocaleDateString('tr-TR')}</td>
                        <td className="px-6 py-4">{expense.description}</td>
                        <td className="px-6 py-4">{expense.category || '-'}</td>
                        <td className="px-6 py-4 text-right text-red-600 font-medium">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Link
                              href={`/partners/expenses/${expense.id}/edit`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Düzenle
                            </Link>
                            <button
                              onClick={() => handleDelete(expense.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        Henüz harcama kaydı bulunmamaktadır.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expense Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Harcama Özeti</h3>

            {expenses.length === 0 ? (
              <p className="text-center py-4 text-gray-500">Henüz harcama kaydı bulunmamaktadır.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Summary */}
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">Aylık Özet</h4>
                  {calculateMonthlyExpenses().map((month, index) => (
                    <div key={index} className="flex justify-between p-2 bg-gray-50 rounded mb-2">
                      <span>{month.name}</span>
                      <span className="text-red-600 font-medium">{formatCurrency(month.amount)}</span>
                    </div>
                  ))}
                </div>

                {/* Category Summary */}
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">Kategori Bazlı</h4>
                  {calculateCategoryExpenses().map((category, index) => (
                    <div key={index} className="flex justify-between p-2 bg-gray-50 rounded mb-2">
                      <span>{category.name || 'Kategorisiz'}</span>
                      <span className="text-red-600 font-medium">{formatCurrency(category.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
