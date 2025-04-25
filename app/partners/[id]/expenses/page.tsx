"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

type PartnerExpense = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category?: string;
  notes?: string;
};

type Partner = {
  id: string;
  name: string;
  email: string;
};

export default function PartnerExpenses({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const [partner, setPartner] = useState<Partner | null>(null);
  const [expenses, setExpenses] = useState<PartnerExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Örnek veri - gerçek uygulamada API'den gelecek
  useEffect(() => {
    // Partner bilgilerini al
    const partnerData = id === 'partner1' 
      ? { id: 'partner1', name: 'Mehmet', email: 'mehmet@example.com' }
      : { id: 'partner2', name: 'Abdülaziz', email: 'abdulaziz@example.com' };
    
    // Harcama verilerini al
    const expensesData = id === 'partner1' 
      ? [
          { id: '1', date: '2025-04-15', description: 'Araç yakıt gideri', amount: 1200, category: 'Yakıt' },
          { id: '2', date: '2025-04-10', description: 'İş yemeği', amount: 800, category: 'Yemek' },
          { id: '3', date: '2025-04-05', description: 'Telefon faturası', amount: 500, category: 'Telefon' },
          { id: '4', date: '2025-03-25', description: 'Malzeme alımı', amount: 3500, category: 'Malzeme' },
          { id: '5', date: '2025-03-20', description: 'Araç bakım', amount: 2000, category: 'Ulaşım' },
        ]
      : [
          { id: '6', date: '2025-04-18', description: 'Malzeme alımı', amount: 5000, category: 'Malzeme' },
          { id: '7', date: '2025-04-12', description: 'Araç bakım', amount: 2500, category: 'Ulaşım' },
          { id: '8', date: '2025-04-03', description: 'İş yemeği', amount: 1000, category: 'Yemek' },
          { id: '9', date: '2025-03-28', description: 'Telefon faturası', amount: 450, category: 'Telefon' },
          { id: '10', date: '2025-03-15', description: 'Yakıt gideri', amount: 1100, category: 'Yakıt' },
        ];
    
    setPartner(partnerData);
    setExpenses(expensesData);
    
    // Toplam tutarı hesapla
    const total = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalAmount(total);
    
    setLoading(false);
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
  const handleDelete = (expenseId: string) => {
    if (window.confirm('Bu harcamayı silmek istediğinizden emin misiniz?')) {
      // Harcamayı listeden kaldır
      const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
      setExpenses(updatedExpenses);
      
      // Toplam tutarı güncelle
      const deletedExpense = expenses.find(expense => expense.id === expenseId);
      if (deletedExpense) {
        setTotalAmount(prev => prev - deletedExpense.amount);
      }
      
      // Gerçek uygulamada burada API'ye istek gönderilecek
      alert('Harcama başarıyla silindi!');
    }
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
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">PVC Muhasebe</h1>
              <p className="text-sm">Ortak Harcamaları</p>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Summary */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">Aylık Özet</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Nisan 2025</span>
                    <span className="text-red-600 font-medium">{formatCurrency(id === 'partner1' ? 2500 : 8500)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Mart 2025</span>
                    <span className="text-red-600 font-medium">{formatCurrency(id === 'partner1' ? 5500 : 1550)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Şubat 2025</span>
                    <span className="text-red-600 font-medium">{formatCurrency(id === 'partner1' ? 3200 : 1800)}</span>
                  </div>
                </div>
              </div>
              
              {/* Category Summary */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">Kategori Bazlı</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Malzeme</span>
                    <span className="text-red-600 font-medium">{formatCurrency(id === 'partner1' ? 3500 : 5000)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Yakıt</span>
                    <span className="text-red-600 font-medium">{formatCurrency(id === 'partner1' ? 1200 : 1100)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Yemek</span>
                    <span className="text-red-600 font-medium">{formatCurrency(id === 'partner1' ? 800 : 1000)}</span>
                  </div>
                </div>
              </div>
            </div>
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
