"use client";

import Link from 'next/link';

export default function Partners() {
  // Örnek veri - gerçek uygulamada veritabanından gelecek
  const partners = [
    {
      id: '1',
      name: 'Mehmet',
      email: 'mehmet@example.com',
      totalExpenses: 15000,
      recentExpenses: [
        { id: '1', date: '2025-04-15', description: 'Araç yakıt gideri', amount: 1200 },
        { id: '2', date: '2025-04-10', description: 'İş yemeği', amount: 800 },
        { id: '3', date: '2025-04-05', description: 'Telefon faturası', amount: 500 },
      ]
    },
    {
      id: '2',
      name: 'Abdülaziz',
      email: 'abdulaziz@example.com',
      totalExpenses: 12500,
      recentExpenses: [
        { id: '4', date: '2025-04-18', description: 'Malzeme alımı', amount: 5000 },
        { id: '5', date: '2025-04-12', description: 'Araç bakım', amount: 2500 },
        { id: '6', date: '2025-04-03', description: 'İş yemeği', amount: 1000 },
      ]
    },
  ];

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
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">PVC Muhasebe</h1>
              <p className="text-sm">Ortaklar</p>
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
                <li>
                  <Link href="/reports" className="hover:underline">
                    Raporlar
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Ortaklar</h2>
          <Link
            href="/partners/expenses/new"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
          >
            Ortak Harcaması Ekle
          </Link>
        </div>

        {/* Partners Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-100 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">{partner.name}</h3>
                  <span className="text-gray-600">{partner.email}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Toplam Harcama</h4>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(partner.totalExpenses)}</p>
                </div>

                <h4 className="text-lg font-medium text-gray-700 mb-2">Son Harcamalar</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-gray-600">Tarih</th>
                        <th className="px-4 py-2 text-gray-600">Açıklama</th>
                        <th className="px-4 py-2 text-gray-600 text-right">Tutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partner.recentExpenses.map((expense) => (
                        <tr key={expense.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{new Date(expense.date).toLocaleDateString('tr-TR')}</td>
                          <td className="px-4 py-2">{expense.description}</td>
                          <td className="px-4 py-2 text-right text-red-600 font-medium">
                            {formatCurrency(expense.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/partners/${partner.id}/expenses`}
                    className="text-blue-600 hover:underline"
                  >
                    Tüm Harcamaları Görüntüle
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ortak Harcamaları Karşılaştırması</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-gray-600">Ortak</th>
                  <th className="px-6 py-3 text-gray-600 text-right">Bu Ay</th>
                  <th className="px-6 py-3 text-gray-600 text-right">Geçen Ay</th>
                  <th className="px-6 py-3 text-gray-600 text-right">Bu Yıl</th>
                  <th className="px-6 py-3 text-gray-600 text-right">Toplam</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Mehmet</td>
                  <td className="px-6 py-4 text-right text-red-600">{formatCurrency(2500)}</td>
                  <td className="px-6 py-4 text-right text-red-600">{formatCurrency(3500)}</td>
                  <td className="px-6 py-4 text-right text-red-600">{formatCurrency(12000)}</td>
                  <td className="px-6 py-4 text-right text-red-600 font-bold">{formatCurrency(15000)}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Abdülaziz</td>
                  <td className="px-6 py-4 text-right text-red-600">{formatCurrency(8500)}</td>
                  <td className="px-6 py-4 text-right text-red-600">{formatCurrency(2000)}</td>
                  <td className="px-6 py-4 text-right text-red-600">{formatCurrency(10500)}</td>
                  <td className="px-6 py-4 text-right text-red-600 font-bold">{formatCurrency(12500)}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-medium">Toplam</td>
                  <td className="px-6 py-4 text-right text-red-600 font-bold">{formatCurrency(11000)}</td>
                  <td className="px-6 py-4 text-right text-red-600 font-bold">{formatCurrency(5500)}</td>
                  <td className="px-6 py-4 text-right text-red-600 font-bold">{formatCurrency(22500)}</td>
                  <td className="px-6 py-4 text-right text-red-600 font-bold">{formatCurrency(27500)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Partner Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ortak Ayarları</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">Ortak Bilgileri</h4>
              <p className="text-gray-600 mb-4">
                Ortak bilgilerini düzenleyebilir veya yeni ortak ekleyebilirsiniz.
              </p>
              <Link
                href="/partners/settings"
                className="text-blue-600 hover:underline"
              >
                Ortak Bilgilerini Düzenle
              </Link>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">Harcama Kategorileri</h4>
              <p className="text-gray-600 mb-4">
                Ortak harcamaları için özel kategoriler oluşturabilirsiniz.
              </p>
              <Link
                href="/partners/categories"
                className="text-blue-600 hover:underline"
              >
                Kategorileri Yönet
              </Link>
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
