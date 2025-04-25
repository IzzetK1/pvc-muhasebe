"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function PartnerSettings() {

  // Partner tipi tanımı
  type Partner = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    sharePercentage: number;
  };

  // Örnek veri - gerçek uygulamada veritabanından gelecek
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: 'partner1',
      name: 'Mehmet',
      email: 'mehmet@example.com',
      phone: '0555 123 4567',
      role: 'Ortak',
      sharePercentage: 50
    },
    {
      id: 'partner2',
      name: 'Abdülaziz',
      email: 'abdulaziz@example.com',
      phone: '0555 987 6543',
      role: 'Ortak',
      sharePercentage: 50
    }
  ]);

  const [editMode, setEditMode] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);

  // Ortak düzenleme modunu aç
  const handleEdit = (partner: Partner) => {
    setCurrentPartner({...partner});
    setEditMode(true);
  };

  // Form değişikliklerini izle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPartner(prev => ({
      ...prev,
      [name]: name === 'sharePercentage' ? parseInt(value) : value
    }));
  };

  // Değişiklikleri kaydet
  const handleSave = () => {
    if (!currentPartner) return;

    // Ortaklar listesini güncelle
    const updatedPartners = partners.map(partner =>
      partner.id === currentPartner.id ? currentPartner : partner
    );

    setPartners(updatedPartners);
    setEditMode(false);
    setCurrentPartner(null);

    // Gerçek uygulamada burada API'ye veri gönderilecek
    alert('Ortak bilgileri başarıyla güncellendi!');
  };

  // İptal et
  const handleCancel = () => {
    setEditMode(false);
    setCurrentPartner(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">PVC Muhasebe</h1>
              <p className="text-sm">Ortak Ayarları</p>
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
              Ortak Ayarları
            </h2>
          </div>

          {/* Partners List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Ortaklar</h3>

              {editMode ? (
                // Edit Form
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Ortak Bilgilerini Düzenle</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={currentPartner?.name || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={currentPartner?.email || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={currentPartner?.phone || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        value={currentPartner?.role || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="sharePercentage" className="block text-sm font-medium text-gray-700 mb-2">Ortaklık Payı (%)</label>
                    <input
                      type="number"
                      id="sharePercentage"
                      name="sharePercentage"
                      value={currentPartner?.sharePercentage || 0}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={handleCancel}
                      className="py-2 px-4 border border-gray-300 rounded transition-colors bg-white text-gray-700 hover:bg-gray-50"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleSave}
                      className="py-2 px-4 rounded transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              ) : (
                // Partners Table
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-gray-600">Ad Soyad</th>
                        <th className="px-6 py-3 text-gray-600">E-posta</th>
                        <th className="px-6 py-3 text-gray-600">Telefon</th>
                        <th className="px-6 py-3 text-gray-600">Rol</th>
                        <th className="px-6 py-3 text-gray-600 text-right">Ortaklık Payı</th>
                        <th className="px-6 py-3 text-gray-600 text-center">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partners.map((partner) => (
                        <tr key={partner.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{partner.name}</td>
                          <td className="px-6 py-4">{partner.email}</td>
                          <td className="px-6 py-4">{partner.phone}</td>
                          <td className="px-6 py-4">{partner.role}</td>
                          <td className="px-6 py-4 text-right">%{partner.sharePercentage}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleEdit(partner)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Düzenle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Company Settings */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Şirket Bilgileri</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">Şirket Adı</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    defaultValue="PVC Doğrama ve Montaj"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 mb-2">Vergi Numarası</label>
                  <input
                    type="text"
                    id="taxNumber"
                    name="taxNumber"
                    placeholder="Vergi numarası girin"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="Şirket adresi"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">İletişim Bilgileri</label>
                  <textarea
                    id="contactInfo"
                    name="contactInfo"
                    rows={3}
                    placeholder="Telefon, e-posta, web sitesi vb."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  className="py-2 px-4 rounded transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Şirket Bilgilerini Kaydet
                </button>
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
