"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { customerFunctions, customerInvoiceFunctions, projectFunctions, Customer, Project } from '../../../../../lib/database';
import Header from '../../../../components/Header';

export default function NewInvoice() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [formData, setFormData] = useState({
    invoice_number: '',
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 gün sonra
    amount: 0,
    project_id: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Müşteri bilgilerini yükle
        const customerData = await customerFunctions.getById(customerId);
        setCustomer(customerData);
        
        // Müşterinin projelerini yükle
        const projectsData = await projectFunctions.getByCustomerId(customerId);
        setProjects(projectsData);
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
    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Zorunlu alan kontrolü
      if (!formData.invoice_number.trim()) {
        throw new Error('Fatura numarası zorunludur.');
      }

      if (formData.amount <= 0) {
        throw new Error('Fatura tutarı sıfırdan büyük olmalıdır.');
      }

      // Faturayı oluştur
      const invoice = await customerInvoiceFunctions.create({
        customer_id: customerId,
        project_id: formData.project_id || undefined,
        invoice_number: formData.invoice_number,
        date: formData.date,
        due_date: formData.due_date,
        amount: formData.amount,
        paid_amount: 0,
        status: 'unpaid',
        notes: formData.notes || undefined
      });

      // Başarılı olursa müşteri detay sayfasına yönlendir
      router.push(`/customers/${customerId}`);
    } catch (err) {
      console.error('Fatura eklenirken hata oluştu:', err);
      setError(err instanceof Error ? err.message : 'Fatura eklenirken bir hata oluştu.');
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

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Müşteri bulunamadı.</p>
          <Link href="/customers" className="text-blue-600 hover:underline">
            Müşteriler sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Yeni Fatura Ekle</h2>
          <Link
            href={`/customers/${customerId}`}
            className="text-blue-600 hover:underline"
          >
            Müşteri Detayına Dön
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Müşteri Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">Müşteri Adı:</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              {customer.company_name && (
                <div>
                  <p className="text-gray-600 mb-1">Firma Adı:</p>
                  <p className="font-medium">{customer.company_name}</p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="invoice_number" className="block text-gray-700 font-medium mb-2">
                  Fatura Numarası <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="invoice_number"
                  name="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="project_id" className="block text-gray-700 font-medium mb-2">
                  Proje
                </label>
                <select
                  id="project_id"
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Proje Seçin</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                  Fatura Tarihi <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="due_date" className="block text-gray-700 font-medium mb-2">
                  Vade Tarihi <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
                  Tutar <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(formData.amount)}
                </p>
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
            
            <div className="flex justify-end space-x-4">
              <Link
                href={`/customers/${customerId}`}
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
