"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { transactionFunctions, categoryFunctions } from '../../../lib/database';
import FileUpload from '../../../components/FileUpload';

export default function NewTransaction({ searchParams }: { searchParams: { type?: string } }) {
  const router = useRouter();

  // URL'den işlem tipini al (gelir veya gider)
  const initialType = searchParams.type || 'income';

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: initialType,
    category_id: '',
    partner_id: '',
    notes: ''
  });

  // Kategori tipi tanımı
  type Category = {
    id: string;
    name: string;
    type: 'income' | 'expense' | 'partner';
    description?: string;
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Form değişikliklerini izle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Kategorileri yükle
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const type = formData.type as 'income' | 'expense';
        const data = await categoryFunctions.getByType(type);
        setCategories(data);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
      }
    };

    loadCategories();
  }, [formData.type]);

  // Dosya yükleme tamamlandığında
  const handleFileUpload = (fileId: string, _fileUrl: string) => {
    setUploadedFiles(prev => [...prev, fileId]);
  };

  // Form gönderildiğinde
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form doğrulama
    if (!formData.date || !formData.description || !formData.amount || !formData.category_id) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    setLoading(true);

    try {
      // İşlemi veritabanına kaydet
      await transactionFunctions.create({
        date: formData.date,
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type as 'income' | 'expense',
        category_id: formData.category_id,
        partner_id: formData.partner_id || undefined,
        notes: formData.notes || undefined,
        file_ids: uploadedFiles.length > 0 ? uploadedFiles : undefined
      });

      alert('İşlem başarıyla kaydedildi!');

      // İşlemler sayfasına yönlendir
      router.push('/transactions');
    } catch (error) {
      console.error('İşlem kaydedilirken hata:', error);
      alert('İşlem kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">PVC Muhasebe</h1>
              <p className="text-sm">Yeni İşlem Ekle</p>
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
              {formData.type === 'income' ? 'Yeni Gelir Ekle' : 'Yeni Gider Ekle'}
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
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-sm text-gray-500">
                  <Link href="/partners/categories" className="text-blue-600 hover:underline">
                    Kategori ekle/düzenle
                  </Link>
                </div>
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

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dosya Ekle (İsteğe Bağlı)</label>
                <FileUpload
                  onUploadComplete={handleFileUpload}
                  path={`transactions/${formData.type}`}
                  maxSize={10}
                  allowedTypes={['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Fatura, makbuz, sözleşme vb. belgeleri ekleyebilirsiniz. Maksimum dosya boyutu: 10MB
                </p>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700">{uploadedFiles.length} dosya yüklendi</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-2 px-4 rounded transition-colors ${
                    formData.type === 'income'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kaydediliyor...
                    </span>
                  ) : (
                    formData.type === 'income' ? 'Gelir Ekle' : 'Gider Ekle'
                  )}
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
