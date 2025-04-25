import Link from 'next/link';

export default function Reports() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">PVC Muhasebe</h1>
              <p className="text-sm">Raporlar</p>
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Finansal Raporlar</h2>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Income/Expense Report */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Gelir/Gider Raporu</h3>
            <p className="text-gray-600 mb-4">
              Belirli bir tarih aralığındaki gelir ve giderlerin detaylı dökümü ve özeti.
            </p>
            <Link 
              href="/reports/income-expense" 
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition-colors"
            >
              Raporu Görüntüle
            </Link>
          </div>

          {/* Profit/Loss Report */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Kar/Zarar Analizi</h3>
            <p className="text-gray-600 mb-4">
              Aylık ve yıllık bazda kar/zarar durumu ve kar marjı analizi.
            </p>
            <Link 
              href="/reports/profit-loss" 
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition-colors"
            >
              Raporu Görüntüle
            </Link>
          </div>

          {/* Partner Expenses Report */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Ortak Harcamaları</h3>
            <p className="text-gray-600 mb-4">
              Ortakların harcamalarının karşılaştırmalı analizi ve detayları.
            </p>
            <Link 
              href="/reports/partner-expenses" 
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition-colors"
            >
              Raporu Görüntüle
            </Link>
          </div>
        </div>

        {/* Custom Report Generator */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Özel Rapor Oluştur</h3>
          
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">Rapor Tipi</label>
                <select 
                  id="reportType" 
                  name="reportType"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Rapor Tipi Seçin</option>
                  <option value="income-expense">Gelir/Gider Raporu</option>
                  <option value="profit-loss">Kar/Zarar Analizi</option>
                  <option value="partner-expenses">Ortak Harcamaları</option>
                  <option value="category-breakdown">Kategori Bazlı Analiz</option>
                  <option value="monthly-comparison">Aylık Karşılaştırma</option>
                </select>
              </div>

              <div>
                <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-2">Tarih Aralığı</label>
                <select 
                  id="dateRange" 
                  name="dateRange"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Tarih Aralığı Seçin</option>
                  <option value="this-month">Bu Ay</option>
                  <option value="last-month">Geçen Ay</option>
                  <option value="this-quarter">Bu Çeyrek</option>
                  <option value="last-quarter">Geçen Çeyrek</option>
                  <option value="this-year">Bu Yıl</option>
                  <option value="last-year">Geçen Yıl</option>
                  <option value="custom">Özel Tarih Aralığı</option>
                </select>
              </div>
            </div>

            {/* Custom Date Range (conditionally shown) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
                <input 
                  type="date" 
                  id="startDate" 
                  name="startDate"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
                <input 
                  type="date" 
                  id="endDate" 
                  name="endDate"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Additional Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rapor Seçenekleri</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    name="includeCharts" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">Grafikleri Dahil Et</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    name="includeDetails" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">Detaylı İşlem Listesi</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    name="includeSummary" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">Özet Bilgiler</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              >
                Rapor Oluştur
              </button>
            </div>
          </form>
        </div>

        {/* Saved Reports */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Kaydedilmiş Raporlar</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-gray-600">Rapor Adı</th>
                  <th className="px-6 py-3 text-gray-600">Tarih Aralığı</th>
                  <th className="px-6 py-3 text-gray-600">Oluşturulma Tarihi</th>
                  <th className="px-6 py-3 text-gray-600 text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">2025 Nisan Gelir/Gider Raporu</td>
                  <td className="px-6 py-4">01.04.2025 - 30.04.2025</td>
                  <td className="px-6 py-4">25.04.2025</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Link 
                        href="/reports/view/1"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Görüntüle
                      </Link>
                      <button className="text-red-600 hover:text-red-800">
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">2025 Q1 Kar/Zarar Analizi</td>
                  <td className="px-6 py-4">01.01.2025 - 31.03.2025</td>
                  <td className="px-6 py-4">05.04.2025</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Link 
                        href="/reports/view/2"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Görüntüle
                      </Link>
                      <button className="text-red-600 hover:text-red-800">
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
