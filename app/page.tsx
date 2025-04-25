import Link from "next/link";
import Header from "./Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hoş Geldiniz</h2>
            <p className="text-gray-600 mb-6">
              PVC doğrama montaj, sineklik, balkon kapama, alüminyum doğrama ve montaj işleriniz için
              özel olarak tasarlanmış muhasebe sistemine hoş geldiniz. Bu sistem ile:
            </p>
            <ul className="list-disc pl-5 text-gray-600 mb-6 space-y-2">
              <li>Gelir ve giderlerinizi takip edebilir</li>
              <li>Ortakların harcamalarını ayrı ayrı kaydedebilir</li>
              <li>Kar/zarar analizlerini görüntüleyebilir</li>
              <li>Detaylı raporlar ve grafikler oluşturabilirsiniz</li>
            </ul>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors text-center"
              >
                Panele Git
              </Link>
              <Link
                href="/transactions/new"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors text-center"
              >
                İşlem Ekle
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hızlı Erişim</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/transactions"
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-blue-600 font-medium">İşlemler</div>
                <p className="text-sm text-gray-600 mt-2">Tüm gelir ve giderleri görüntüle</p>
              </Link>
              <Link
                href="/reports"
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-blue-600 font-medium">Raporlar</div>
                <p className="text-sm text-gray-600 mt-2">Finansal raporları ve grafikleri görüntüle</p>
              </Link>
              <Link
                href="/partners"
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-blue-600 font-medium">Ortaklar</div>
                <p className="text-sm text-gray-600 mt-2">Ortak harcamalarını yönet</p>
              </Link>
              <Link
                href="/projects"
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-blue-600 font-medium">Projeler</div>
                <p className="text-sm text-gray-600 mt-2">Projeleri ve iş takibini yönet</p>
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
