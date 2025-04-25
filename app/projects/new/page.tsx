"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { projectFunctions, categoryFunctions, customerFunctions, Category, Customer } from '../../../lib/database';
import Header from '../../Header';

// SearchParams wrapper component with useSearchParams hook
function NewProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customer_id');

  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'active',
    category_id: '',
    customer_id: customerId || '',
    total_income: 0,
    total_expense: 0,
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Kategorileri yükle
        const categoriesData = await categoryFunctions.getByType('project');
        setCategories(categoriesData);

        // Müşterileri yükle
        const customersData = await customerFunctions.getAll();
        setCustomers(customersData);

        // Eğer URL'den bir müşteri ID'si geldiyse, o müşteriyi seç
        if (customerId) {
          const customer = customersData.find(c => c.id === customerId);
          if (customer) {
            setSelectedCustomer(customer);
          }
        }
      } catch (err) {
        console.error('Veriler yüklenirken hata oluştu:', err);
        setError('Veriler yüklenirken bir hata oluştu.');
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, [customerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Sayısal değerler için dönüşüm yap
    if (name === 'total_income' || name === 'total_expense') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Müşteri değiştiğinde, seçilen müşteriyi güncelle
    if (name === 'customer_id') {
      const customer = customers.find(c => c.id === value);
      setSelectedCustomer(customer || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Zorunlu alan kontrolü
      if (!formData.name.trim()) {
        throw new Error('Proje adı zorunludur.');
      }

      // Projeyi oluştur
      const project = await projectFunctions.create({
        name: formData.name,
        description: formData.description || undefined,
        start_date: formData.start_date,
        end_date: formData.end_date || undefined,
        status: formData.status as 'active' | 'completed' | 'cancelled',
        category_id: formData.category_id || undefined,
        customer_id: formData.customer_id || undefined,
        total_income: formData.total_income,
        total_expense: formData.total_expense,
        notes: formData.notes || undefined
      });

      // Başarılı olursa proje detay sayfasına yönlendir
      router.push(`/projects/${project.id}`);
    } catch (err) {
      console.error('Proje eklenirken hata oluştu:', err);
      setError(err instanceof Error ? err.message : 'Proje eklenirken bir hata oluştu.');
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

  // Kar ve kar marjını hesapla
  const profit = formData.total_income - formData.total_expense;
  const profitMargin = formData.total_income > 0 ? (profit / formData.total_income) * 100 : 0;

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Yeni Proje Ekle</h2>
          <Link
            href="/projects"
            className="text-blue-600 hover:underline"
          >
            Projeler Listesine Dön
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Proje Adı <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="category_id" className="block text-gray-700 font-medium mb-2">
                  Kategori
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="customer_id" className="block text-gray-700 font-medium mb-2">
                  Müşteri
                </label>
                <select
                  id="customer_id"
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Müşteri Seçin</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} {customer.company_name ? `(${customer.company_name})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                  Durum
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Devam Ediyor</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
              </div>

              <div>
                <label htmlFor="start_date" className="block text-gray-700 font-medium mb-2">
                  Başlangıç Tarihi <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="end_date" className="block text-gray-700 font-medium mb-2">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="total_income" className="block text-gray-700 font-medium mb-2">
                  Toplam Gelir
                </label>
                <input
                  type="number"
                  id="total_income"
                  name="total_income"
                  value={formData.total_income}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="total_expense" className="block text-gray-700 font-medium mb-2">
                  Toplam Gider
                </label>
                <input
                  type="number"
                  id="total_expense"
                  name="total_expense"
                  value={formData.total_expense}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
                  Notlar
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            {/* Kar Özeti */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Kar Özeti</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Toplam Gelir:</p>
                  <p className="text-lg font-medium text-green-600">{formatCurrency(formData.total_income)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Toplam Gider:</p>
                  <p className="text-lg font-medium text-red-600">{formatCurrency(formData.total_expense)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Kar:</p>
                  <p className="text-lg font-medium text-blue-600">
                    {formatCurrency(profit)} <span className="text-sm text-gray-500">(%{profitMargin.toFixed(1)})</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Müşteri Bilgisi */}
            {selectedCustomer && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Seçilen Müşteri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 mb-1">Müşteri Adı:</p>
                    <p className="font-medium">{selectedCustomer.name}</p>
                  </div>
                  {selectedCustomer.company_name && (
                    <div>
                      <p className="text-gray-600 mb-1">Firma Adı:</p>
                      <p className="font-medium">{selectedCustomer.company_name}</p>
                    </div>
                  )}
                  {selectedCustomer.email && (
                    <div>
                      <p className="text-gray-600 mb-1">E-posta:</p>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                  )}
                  {selectedCustomer.phone && (
                    <div>
                      <p className="text-gray-600 mb-1">Telefon:</p>
                      <p className="font-medium">{selectedCustomer.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Link
                href="/projects"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
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

// Main component that wraps the content with Suspense
export default function NewProject() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-xl">Yükleniyor...</p>
    </div>}>
      <NewProjectContent />
    </Suspense>
  );
}
