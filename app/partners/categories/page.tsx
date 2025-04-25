"use client";

import Link from 'next/link';
import { useState } from 'react';

type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'partner';
  description?: string;
};

export default function Categories() {
  // Örnek veri - gerçek uygulamada veritabanından gelecek
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Proje', type: 'income', description: 'Proje gelirleri' },
    { id: '2', name: 'Montaj', type: 'income', description: 'Montaj gelirleri' },
    { id: '3', name: 'Diğer Gelir', type: 'income', description: 'Diğer gelir kalemleri' },
    { id: '4', name: 'Malzeme', type: 'expense', description: 'Malzeme giderleri' },
    { id: '5', name: 'İşçilik', type: 'expense', description: 'İşçilik giderleri' },
    { id: '6', name: 'Kira', type: 'expense', description: 'Kira giderleri' },
    { id: '7', name: 'Fatura', type: 'expense', description: 'Fatura giderleri' },
    { id: '8', name: 'Ulaşım', type: 'expense', description: 'Ulaşım giderleri' },
    { id: '9', name: 'Yakıt', type: 'partner', description: 'Ortak yakıt giderleri' },
    { id: '10', name: 'Yemek', type: 'partner', description: 'Ortak yemek giderleri' },
    { id: '11', name: 'Telefon', type: 'partner', description: 'Ortak telefon giderleri' },
  ]);

  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense' | 'partner',
    description: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form değişikliklerini izle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Kategori ekleme
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name) {
      alert('Lütfen kategori adını girin.');
      return;
    }
    
    if (editMode && editId) {
      // Mevcut kategoriyi güncelle
      const updatedCategories = categories.map(category => 
        category.id === editId 
          ? { ...category, name: newCategory.name, type: newCategory.type, description: newCategory.description }
          : category
      );
      
      setCategories(updatedCategories);
      setEditMode(false);
      setEditId(null);
    } else {
      // Yeni kategori ekle
      const newId = (categories.length + 1).toString();
      setCategories([...categories, { id: newId, ...newCategory }]);
    }
    
    // Formu temizle
    setNewCategory({
      name: '',
      type: 'expense',
      description: ''
    });
  };

  // Kategori düzenleme
  const handleEdit = (category: Category) => {
    setNewCategory({
      name: category.name,
      type: category.type,
      description: category.description || ''
    });
    setEditMode(true);
    setEditId(category.id);
  };

  // Kategori silme
  const handleDelete = (id: string) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      const updatedCategories = categories.filter(category => category.id !== id);
      setCategories(updatedCategories);
    }
  };

  // Formu iptal et
  const handleCancel = () => {
    setNewCategory({
      name: '',
      type: 'expense',
      description: ''
    });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">PVC Muhasebe</h1>
              <p className="text-sm">Kategori Yönetimi</p>
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
              Kategori Yönetimi
            </h2>
          </div>

          {/* Category Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {editMode ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </h3>
            
            <form onSubmit={handleAddCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Kategori Adı</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={newCategory.name}
                    onChange={handleChange}
                    placeholder="Kategori adı girin"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Kategori Tipi</label>
                  <select 
                    id="type" 
                    name="type"
                    value={newCategory.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="income">Gelir</option>
                    <option value="expense">Gider</option>
                    <option value="partner">Ortak Harcaması</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Açıklama (İsteğe Bağlı)</label>
                <textarea 
                  id="description" 
                  name="description"
                  value={newCategory.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Kategori açıklaması"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-4">
                {editMode && (
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="py-2 px-4 border border-gray-300 rounded transition-colors bg-white text-gray-700 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                )}
                <button 
                  type="submit"
                  className="py-2 px-4 rounded transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editMode ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Kategoriler</h3>
            </div>
            
            {/* Income Categories */}
            <div className="p-6 border-b">
              <h4 className="text-lg font-medium text-green-700 mb-4">Gelir Kategorileri</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-gray-600">Kategori Adı</th>
                      <th className="px-6 py-3 text-gray-600">Açıklama</th>
                      <th className="px-6 py-3 text-gray-600 text-center">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.filter(cat => cat.type === 'income').map((category) => (
                      <tr key={category.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{category.name}</td>
                        <td className="px-6 py-4">{category.description || '-'}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button 
                              onClick={() => handleEdit(category)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Düzenle
                            </button>
                            <button 
                              onClick={() => handleDelete(category.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Expense Categories */}
            <div className="p-6 border-b">
              <h4 className="text-lg font-medium text-red-700 mb-4">Gider Kategorileri</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-gray-600">Kategori Adı</th>
                      <th className="px-6 py-3 text-gray-600">Açıklama</th>
                      <th className="px-6 py-3 text-gray-600 text-center">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.filter(cat => cat.type === 'expense').map((category) => (
                      <tr key={category.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{category.name}</td>
                        <td className="px-6 py-4">{category.description || '-'}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button 
                              onClick={() => handleEdit(category)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Düzenle
                            </button>
                            <button 
                              onClick={() => handleDelete(category.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Partner Expense Categories */}
            <div className="p-6">
              <h4 className="text-lg font-medium text-blue-700 mb-4">Ortak Harcama Kategorileri</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-gray-600">Kategori Adı</th>
                      <th className="px-6 py-3 text-gray-600">Açıklama</th>
                      <th className="px-6 py-3 text-gray-600 text-center">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.filter(cat => cat.type === 'partner').map((category) => (
                      <tr key={category.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{category.name}</td>
                        <td className="px-6 py-4">{category.description || '-'}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button 
                              onClick={() => handleEdit(category)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Düzenle
                            </button>
                            <button 
                              onClick={() => handleDelete(category.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
