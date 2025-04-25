"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPartnerExpense() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    partner_id: '',
    amount: '',
    description: '',
    category: '',
    notes: ''
  });
  
  // Form değişikliklerini izle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Form gönderildiğinde
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form doğrulama
    if (!formData.date || !formData.partner_id || !formData.amount || !formData.description) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    
    // Gerçek uygulamada burada API'ye veri gönderilecek
    // Şimdilik sadece başarılı mesajı gösterelim
    alert('Ortak harcaması başarıyla kaydedildi!');
    
    // Ortaklar sayfasına yönlendir
    router.push('/partners');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">PVC Muhasebe</h1>
              <p className="text-sm">Yeni Ortak Harcaması</p>
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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/partners" className="text-blue-600 hover:underline mr-4">
              &larr; Ortaklara Dön
            </Link>
            <h2 className="text-2xl font-semibold text-gray-800">
              Yeni Ortak Harcaması Ekle
            </h2>
          </div>

          {/* Expense Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              {/* Partner Selection */}
              <div className="mb-6">
                <label htmlFor="partner_id" className="block text-sm font-medium text-gray-700 mb-2">Ortak</label>
                <select 
                  id="partner_id" 
                  name="partner_id"
                  value={formData.partner_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Ortak Seçin</option>
                  <option value="partner1">Mehmet</option>
                  <option value="partner2">Abdülaziz</option>
                </select>
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

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <input 
                  type="text" 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Harcama açıklaması"
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
                >
                  <option value="">Kategori Seçin (İsteğe Bağlı)</option>
                  <option value="Yakıt">Yakıt</option>
                  <option value="Yemek">Yemek</option>
                  <option value="Telefon">Telefon</option>
                  <option value="Ulaşım">Ulaşım</option>
                  <option value="Malzeme">Malzeme</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

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
                  href="/partners"
                  className="py-2 px-4 border border-gray-300 rounded transition-colors bg-white text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </Link>
                <button 
                  type="submit"
                  className="py-2 px-4 rounded transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Harcama Ekle
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
