"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { projectFunctions, categoryFunctions, Project, Category } from '../../lib/database';
import Header from '../components/Header';

// Proje kategorileri için tip
type ProjectCategory = Category & {
  activeCount: number;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Projeleri getir
        const projectsData = await projectFunctions.getAll();
        setProjects(projectsData);

        // Proje kategorilerini getir
        const categoriesData = await categoryFunctions.getByType('project');

        // Her kategori için aktif proje sayısını hesapla
        const categoriesWithCounts = await Promise.all(
          categoriesData.map(async (category) => {
            const categoryProjects = projectsData.filter(project => project.category_id === category.id);
            const activeCount = categoryProjects.filter(project => project.status === 'active').length;

            return {
              ...category,
              activeCount
            };
          })
        );

        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

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
      <Header />

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
              {formatCurrency(projects.reduce((sum, project) => sum + (project.profit || 0), 0))}
            </p>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {loading ? (
            <p className="text-center py-8">Yükleniyor...</p>
          ) : projects.length === 0 ? (
            <p className="text-center py-8">Henüz proje bulunmamaktadır.</p>
          ) : (
            <>
              {/* Masaüstü Görünüm */}
              <div className="hidden md:block overflow-x-auto">
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
                          <div>{new Date(project.start_date).toLocaleDateString('tr-TR')}</div>
                          {project.end_date && (
                            <div className="text-sm text-gray-500">
                              {new Date(project.end_date).toLocaleDateString('tr-TR')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(project.status)}
                        </td>
                        <td className="px-6 py-4 text-right text-green-600">
                          {formatCurrency(project.total_income)}
                        </td>
                        <td className="px-6 py-4 text-right text-red-600">
                          {formatCurrency(project.total_expense)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-medium text-blue-600">{formatCurrency(project.profit || 0)}</div>
                          <div className="text-sm text-gray-500">%{(project.profit_margin || 0).toFixed(1)}</div>
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

              {/* Mobil Görünüm */}
              <div className="md:hidden">
                {projects.map((project) => (
                  <div key={project.id} className="border-b p-4">
                    <div className="mb-2">
                      <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline font-medium">
                        {project.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm">
                        <div>{new Date(project.start_date).toLocaleDateString('tr-TR')}</div>
                        {project.end_date && (
                          <div className="text-gray-500">
                            {new Date(project.end_date).toLocaleDateString('tr-TR')}
                          </div>
                        )}
                      </div>
                      <div>
                        {getStatusBadge(project.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                      <div>
                        <div className="text-gray-500">Gelir</div>
                        <div className="text-green-600 font-medium">{formatCurrency(project.total_income)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Gider</div>
                        <div className="text-red-600 font-medium">{formatCurrency(project.total_expense)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Kar</div>
                        <div className="text-blue-600 font-medium">{formatCurrency(project.profit || 0)}</div>
                        <div className="text-xs text-gray-500">%{(project.profit_margin || 0).toFixed(1)}</div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Link
                        href={`/projects/${project.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Düzenle
                      </Link>
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Project Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Proje Kategorileri</h3>

          {loading ? (
            <p className="text-center py-4">Yükleniyor...</p>
          ) : categories.length === 0 ? (
            <p className="text-center py-4">Henüz kategori bulunmamaktadır.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map(category => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">{category.name}</h4>
                  <div className="text-sm text-gray-600 mb-2">
                    {category.activeCount > 0
                      ? `${category.activeCount} aktif proje`
                      : 'Aktif proje yok'}
                  </div>
                  <Link
                    href={`/projects?category=${category.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Projeleri Görüntüle
                  </Link>
                </div>
              ))}

              <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                <Link
                  href="/projects/categories"
                  className="text-blue-600 hover:underline"
                >
                  Kategorileri Yönet
                </Link>
              </div>
            </div>
          )}
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
