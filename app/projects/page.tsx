"use client";

import Link from 'next/link';

export default function Projects() {
  // Örnek veri - gerçek uygulamada veritabanından gelecek
  const projects = [
    {
      id: '1',
      name: 'Balkon Kapama Projesi - Merkez Apt.',
      description: '5 adet balkon kapama işi',
      startDate: '2025-04-10',
      endDate: '2025-04-25',
      status: 'active',
      totalIncome: 15000,
      totalExpense: 8500,
      profit: 6500,
      profitMargin: 43.3,
    },
    {
      id: '2',
      name: 'PVC Pencere Değişimi - Yıldız Sitesi',
      description: '12 daire için pencere değişimi',
      startDate: '2025-03-15',
      endDate: '2025-04-05',
      status: 'completed',
      totalIncome: 45000,
      totalExpense: 28000,
      profit: 17000,
      profitMargin: 37.8,
    },
    {
      id: '3',
      name: 'Sineklik Montajı - Güneş Apt.',
      description: '8 daire için sineklik montajı',
      startDate: '2025-04-18',
      endDate: null,
      status: 'active',
      totalIncome: 6000,
      totalExpense: 2800,
      profit: 3200,
      profitMargin: 53.3,
    },
    {
      id: '4',
      name: 'Alüminyum Doğrama - Ofis Binası',
      description: 'Ofis binası için alüminyum doğrama işleri',
      startDate: '2025-04-01',
      endDate: '2025-04-15',
      status: 'completed',
      totalIncome: 35000,
      totalExpense: 22000,
      profit: 13000,
      profitMargin: 37.1,
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

  // Proje durumuna göre renk ve etiket belirleme
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Devam Ediyor</span>;
      case 'completed':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Tamamlandı</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">İptal Edildi</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">Belirsiz</span>;
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
              <p className="text-sm">Projeler</p>
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
          <h2 className="text-2xl font-semibold text-gray-800">Projeler</h2>
          <Link
            href="/projects/new"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
          >
            Yeni Proje Ekle
          </Link>
        </div>

        {/* Project Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-500">Toplam Proje</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{projects.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-500">Devam Eden</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">{projects.filter(p => p.status === 'active').length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-500">Tamamlanan</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{projects.filter(p => p.status === 'completed').length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-500">Toplam Kar</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {formatCurrency(projects.reduce((sum, project) => sum + project.profit, 0))}
            </p>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-gray-600">Proje Adı</th>
                  <th className="px-6 py-3 text-gray-600">Tarih</th>
                  <th className="px-6 py-3 text-gray-600">Durum</th>
                  <th className="px-6 py-3 text-gray-600 text-right">Gelir</th>
                  <th className="px-6 py-3 text-gray-600 text-right">Gider</th>
                  <th className="px-6 py-3 text-gray-600 text-right">Kar</th>
                  <th className="px-6 py-3 text-gray-600 text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                        {project.name}
                      </Link>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>{new Date(project.startDate).toLocaleDateString('tr-TR')}</div>
                      {project.endDate && (
                        <div className="text-sm text-gray-500">
                          {new Date(project.endDate).toLocaleDateString('tr-TR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-6 py-4 text-right text-green-600">
                      {formatCurrency(project.totalIncome)}
                    </td>
                    <td className="px-6 py-4 text-right text-red-600">
                      {formatCurrency(project.totalExpense)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium text-blue-600">{formatCurrency(project.profit)}</div>
                      <div className="text-sm text-gray-500">%{project.profitMargin.toFixed(1)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link
                          href={`/projects/${project.id}/edit`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Düzenle
                        </Link>
                        <button className="text-red-600 hover:text-red-800">
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

        {/* Project Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Proje Kategorileri</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">PVC Doğrama</h4>
              <div className="text-sm text-gray-600 mb-2">2 aktif proje</div>
              <Link href="/projects?category=pvc" className="text-blue-600 hover:underline text-sm">
                Projeleri Görüntüle
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Balkon Kapama</h4>
              <div className="text-sm text-gray-600 mb-2">1 aktif proje</div>
              <Link href="/projects?category=balkon" className="text-blue-600 hover:underline text-sm">
                Projeleri Görüntüle
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Sineklik</h4>
              <div className="text-sm text-gray-600 mb-2">1 aktif proje</div>
              <Link href="/projects?category=sineklik" className="text-blue-600 hover:underline text-sm">
                Projeleri Görüntüle
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Alüminyum Doğrama</h4>
              <div className="text-sm text-gray-600 mb-2">1 tamamlanan proje</div>
              <Link href="/projects?category=aluminyum" className="text-blue-600 hover:underline text-sm">
                Projeleri Görüntüle
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Pergüle Sistemi</h4>
              <div className="text-sm text-gray-600 mb-2">Aktif proje yok</div>
              <Link href="/projects?category=pergule" className="text-blue-600 hover:underline text-sm">
                Projeleri Görüntüle
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center">
              <Link
                href="/projects/categories"
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
