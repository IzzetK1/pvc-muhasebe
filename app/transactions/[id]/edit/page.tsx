"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  partner_id?: string | null;
  notes?: string;
};

export default function EditTransaction({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'income',
    category: '',
    partner_id: '',
    notes: ''
  });

  // Mock veri yerine gerçek uygulamada veritabanından veri çekilecek
  useEffect(() => {
    // Örnek veri - gerçek uygulamada API'den gelecek
    const mockTransactions = [
      { id: '1', date: '2025-04-20', description: 'Balkon kapama projesi', amount: 15000, type: 'income' as const, category: 'Proje', partner_id: null, notes: '' },
      { id: '2', date: '2025-04-18', description: 'Malzeme alımı', amount: 8500, type: 'expense' as const, category: 'Malzeme', partner_id: 'partner1', notes: 'Cam malzemeleri' },
      { id: '3', date: '2025-04-15', description: 'PVC pencere montajı', amount: 12000, type: 'income' as const, category: 'Montaj', partner_id: null, notes: '' },
      { id: '4', date: '2025-04-12', description: 'İşçi ödemesi', amount: 5000, type: 'expense' as const, category: 'İşçilik', partner_id: null, notes: 'Haftalık ödeme' },
      { id: '5', date: '2025-04-10', description: 'Sineklik montajı', amount: 3500, type: 'income' as const, category: 'Montaj', partner_id: null, notes: '' },
    ];

    const foundTransaction = mockTransactions.find(t => t.id === id);
    
    if (foundTransaction) {
      setTransaction(foundTransaction);
      setFormData({
        date: foundTransaction.date,
        description: foundTransaction.description,
        amount: foundTransaction.amount.toString(),
        type: foundTransaction.type,
        category: foundTransaction.category,
        partner_id: foundTransaction.partner_id || '',
        notes: foundTransaction.notes || ''
      });
    }
    
    setLoading(false);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form doğrulama
    if (!formData.date || !formData.description || !formData.amount || !formData.category) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    // Gerçek uygulamada API'ye gönderilecek
    alert('İşlem başarıyla güncellendi!');
    router.push('/transactions');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">İşlem bulunamadı!</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">PVC Muhasebe</h1>
              <p className="text-sm">İşlem Düzenle</p>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:underline">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:underline">
                    Panel
                  </Link>
                </li>
                <li>
                  <Link href="/transactions" className="hover:underline">
                    İşlemler
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/transactions" className="text-blue-600 hover:underline mr-4">
              &larr; İşlemlere Dön
            </Link>
            <h2 className="text-2xl font-semibold text-gray-800">
              İşlem Düzenle
            </h2>
          </div>

          {/* Transaction Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              {/* Transaction Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">İşlem Tipi</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="type" 
                      value="income" 
                      checked={formData.type === 'income'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Gelir</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="type" 
                      value="expense" 
                      checked={formData.type === 'expense'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Gider</span>
                  </label>
                </div>
              </div>

              {/* Date */}
              <div className="mb-6">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                <input 
                  type="date" 
                  id="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <input 
                  type="text" 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="İşlem açıklaması"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Amount */}
              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Tutar (TL)</label>
                <input 
                  type="number" 
                  id="amount" 
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select 
                  id="category" 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {formData.type === 'income' ? (
                    <>
                      <option value="Proje">Proje</option>
                      <option value="Montaj">Montaj</option>
                      <option value="Diğer Gelir">Diğer Gelir</option>
                    </>
                  ) : (
                    <>
                      <option value="Malzeme">Malzeme</option>
                      <option value="İşçilik">İşçilik</option>
                      <option value="Kira">Kira</option>
                      <option value="Fatura">Fatura</option>
                      <option value="Ulaşım">Ulaşım</option>
                      <option value="Diğer Gider">Diğer Gider</option>
                    </>
                  )}
                </select>
              </div>

              {/* Partner Assignment (only for expenses) */}
              {formData.type === 'expense' && (
                <div className="mb-6">
                  <label htmlFor="partner_id" className="block text-sm font-medium text-gray-700 mb-2">Ortak Harcaması</label>
                  <select 
                    id="partner_id" 
                    name="partner_id"
                    value={formData.partner_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Ortak Harcaması Değil</option>
                    <option value="partner1">Mehmet</option>
                    <option value="partner2">Abdülaziz</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">Eğer bu harcama bir ortağa aitse seçin</p>
                </div>
              )}

              {/* Notes */}
              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Notlar (İsteğe Bağlı)</label>
                <textarea 
                  id="notes" 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Ek notlar..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link 
                  href="/transactions"
                  className="py-2 px-4 border border-gray-300 rounded transition-colors bg-white text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </Link>
                <button 
                  type="submit"
                  className="py-2 px-4 rounded transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Güncelle
                </button>
              </div>
            </form>
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
