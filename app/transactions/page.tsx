"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { transactionFunctions, categoryFunctions, Transaction, Category } from '../../lib/database';
import Header from '../components/Header';

export default function Transactions() {
  // State tanımlamaları
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Verileri yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // İşlemleri getir
        const transactionsData = await transactionFunctions.getAll();
        setTransactions(transactionsData);
        setFilteredTransactions(transactionsData);
        setTotalCount(transactionsData.length);

        // Kategorileri getir
        const categoriesData = await categoryFunctions.getAll();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Veriler yüklenirken hata:', err);
        setError('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // İşlem silme fonksiyonu
  const deleteTransaction = async (id: string) => {
    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      try {
        // Veritabanından sil
        await transactionFunctions.delete(id);

        // State'i güncelle
        const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
        setTransactions(updatedTransactions);

        // Filtrelenmiş listeyi de güncelle
        const updatedFilteredTransactions = filteredTransactions.filter(transaction => transaction.id !== id);
        setFilteredTransactions(updatedFilteredTransactions);

        // Toplam sayıyı güncelle
        setTotalCount(prev => prev - 1);
      } catch (err) {
        console.error('İşlem silinirken hata:', err);
        alert('İşlem silinirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  // Filtreleme fonksiyonu
  const applyFilters = async () => {
    try {
      setLoading(true);

      // API'den filtrelenmiş verileri al
      type TransactionFilters = {
        dateFrom?: string;
        dateTo?: string;
        type?: string;
        category_id?: string;
      };

      const filters: TransactionFilters = {};

      if (dateFrom) filters.dateFrom = dateFrom;
      if (dateTo) filters.dateTo = dateTo;
      if (transactionType) filters.type = transactionType;
      if (categoryId) filters.category_id = categoryId;

      // Eğer hiç filtre yoksa, tüm işlemleri göster
      if (Object.keys(filters).length === 0) {
        setFilteredTransactions(transactions);
      } else {
        // Filtreleri uygula
        const filteredData = await transactionFunctions.filter(filters);
        setFilteredTransactions(filteredData);
      }
    } catch (err) {
      console.error('Filtreleme sırasında hata:', err);
      setError('Filtreleme sırasında bir hata oluştu.');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Tüm İşlemler</h2>
          <div className="flex space-x-4">
            <Link
              href="/transactions/new?type=income"
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
            >
              Gelir Ekle
            </Link>
            <Link
              href="/transactions/new?type=expense"
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
            >
              Gider Ekle
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
              <input
                type="date"
                id="dateFrom"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
              <input
                type="date"
                id="dateTo"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">İşlem Tipi</label>
              <select
                id="type"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                <option value="income">Gelir</option>
                <option value="expense">Gider</option>
              </select>
            </div>
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                id="category_id"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Filtrele
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p>Veriler yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-blue-600 hover:underline"
              >
                Sayfayı Yenile
              </button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Kayıt bulunamadı.</p>
            </div>
          ) : (
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
                  {filteredTransactions.map((transaction) => {
                    // Kategori adını bul
                    const category = categories.find(cat => cat.id === transaction.category_id);

                    return (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{new Date(transaction.date).toLocaleDateString('tr-TR')}</td>
                        <td className="px-6 py-4">{transaction.description}</td>
                        <td className="px-6 py-4">{category ? category.name : '-'}</td>
                        <td className={`px-6 py-4 text-right font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income'
                            ? formatCurrency(transaction.amount)
                            : `- ${formatCurrency(transaction.amount)}`}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Link
                              href={`/transactions/${transaction.id}/edit`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Düzenle
                            </Link>
                            <button
                              onClick={() => deleteTransaction(transaction.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-gray-600">
            {filteredTransactions.length > 0
              ? `Toplam ${totalCount} kayıttan ${filteredTransactions.length} tanesi gösteriliyor`
              : 'Kayıt bulunamadı'}
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Önceki
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Sonraki
            </button>
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
