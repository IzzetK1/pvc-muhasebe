"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Header from '../../Header';
import Link from 'next/link';

// Supabase istemcisini oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
  id: string;
  username: string;
  name: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  ip_address: string;
  created_at: string;
  user?: User;
}

export default function LogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtreleme durumu
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    entityType: '',
    startDate: '',
    endDate: '',
  });

  // Sayfalama
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const logsPerPage = 20;

  useEffect(() => {
    // Kullanıcı oturumu kontrolü
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Kullanıcı admin değilse dashboard'a yönlendir
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    // Kullanıcıları ve logları yükle
    if (status === 'authenticated') {
      loadUsers();
      loadLogs();
    }
  }, [status, session, page, filters]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, name')
        .order('username');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      setError('Kullanıcılar yüklenirken bir hata oluştu.');
    }
  };

  const loadLogs = async () => {
    try {
      setLoading(true);
      
      // Temel sorgu
      let query = supabase
        .from('activity_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });
      
      // Filtreleri uygula
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      
      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }
      
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      
      if (filters.endDate) {
        // Bitiş tarihine 1 gün ekle (gün sonuna kadar)
        const endDate = new Date(filters.endDate);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('created_at', endDate.toISOString());
      }
      
      // Sayfalama
      const from = (page - 1) * logsPerPage;
      const to = from + logsPerPage - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Kullanıcı bilgilerini ekle
      const logsWithUserInfo = await Promise.all((data || []).map(async (log) => {
        const user = users.find(u => u.id === log.user_id);
        return { ...log, user };
      }));
      
      setLogs(logsWithUserInfo);
      
      // Toplam sayfa sayısını hesapla
      if (count !== null) {
        setTotalPages(Math.ceil(count / logsPerPage));
      }
      
      setError(null);
    } catch (error) {
      console.error('Loglar yüklenirken hata:', error);
      setError('Loglar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Filtre değiştiğinde ilk sayfaya dön
  };

  const resetFilters = () => {
    setFilters({
      userId: '',
      action: '',
      entityType: '',
      startDate: '',
      endDate: '',
    });
    setPage(1);
  };

  // İşlem tipini Türkçe'ye çevir
  const translateAction = (action: string) => {
    const actionMap: {[key: string]: string} = {
      'create': 'Oluşturma',
      'update': 'Güncelleme',
      'delete': 'Silme',
      'view': 'Görüntüleme',
      'login': 'Giriş',
      'logout': 'Çıkış',
      'export': 'Dışa Aktarma',
      'import': 'İçe Aktarma',
      'payment': 'Ödeme',
      'other': 'Diğer'
    };
    return actionMap[action] || action;
  };

  // Varlık tipini Türkçe'ye çevir
  const translateEntityType = (entityType: string) => {
    const entityMap: {[key: string]: string} = {
      'customer': 'Müşteri',
      'project': 'Proje',
      'transaction': 'İşlem',
      'partner': 'Ortak',
      'partner_expense': 'Ortak Harcaması',
      'user': 'Kullanıcı',
      'report': 'Rapor',
      'system': 'Sistem'
    };
    return entityMap[entityType] || entityType;
  };

  // Tarih formatla
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Sistem Logları</h2>
          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-center"
          >
            Yönetim Paneline Dön
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Filtreler */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Filtreler</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                Kullanıcı
              </label>
              <select
                id="userId"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tümü</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.username}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
                İşlem Tipi
              </label>
              <select
                id="action"
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tümü</option>
                <option value="create">Oluşturma</option>
                <option value="update">Güncelleme</option>
                <option value="delete">Silme</option>
                <option value="view">Görüntüleme</option>
                <option value="login">Giriş</option>
                <option value="logout">Çıkış</option>
                <option value="export">Dışa Aktarma</option>
                <option value="import">İçe Aktarma</option>
                <option value="payment">Ödeme</option>
                <option value="other">Diğer</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="entityType" className="block text-sm font-medium text-gray-700 mb-1">
                Varlık Tipi
              </label>
              <select
                id="entityType"
                name="entityType"
                value={filters.entityType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tümü</option>
                <option value="customer">Müşteri</option>
                <option value="project">Proje</option>
                <option value="transaction">İşlem</option>
                <option value="partner">Ortak</option>
                <option value="partner_expense">Ortak Harcaması</option>
                <option value="user">Kullanıcı</option>
                <option value="report">Rapor</option>
                <option value="system">Sistem</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>

        {/* Log Tablosu */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p>Loglar yükleniyor...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Kayıtlı log bulunamadı.</p>
            </div>
          ) : (
            <>
              {/* Masaüstü Görünüm */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-gray-600">Tarih</th>
                      <th className="px-4 py-3 text-gray-600">Kullanıcı</th>
                      <th className="px-4 py-3 text-gray-600">İşlem</th>
                      <th className="px-4 py-3 text-gray-600">Varlık Tipi</th>
                      <th className="px-4 py-3 text-gray-600">Varlık ID</th>
                      <th className="px-4 py-3 text-gray-600">IP Adresi</th>
                      <th className="px-4 py-3 text-gray-600">Detaylar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{formatDate(log.created_at)}</td>
                        <td className="px-4 py-3">{log.user?.name || log.user?.username || log.user_id}</td>
                        <td className="px-4 py-3">{translateAction(log.action)}</td>
                        <td className="px-4 py-3">{translateEntityType(log.entity_type)}</td>
                        <td className="px-4 py-3 text-sm">{log.entity_id || '-'}</td>
                        <td className="px-4 py-3 text-sm">{log.ip_address || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          {log.details ? (
                            <details>
                              <summary className="cursor-pointer text-blue-600 hover:underline">Detaylar</summary>
                              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobil Görünüm */}
              <div className="md:hidden">
                {logs.map(log => (
                  <div key={log.id} className="border-b p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{log.user?.name || log.user?.username || log.user_id}</div>
                      <div className="text-sm text-gray-500">{formatDate(log.created_at)}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-gray-600">İşlem:</span>
                        <span className="ml-1">{translateAction(log.action)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Varlık:</span>
                        <span className="ml-1">{translateEntityType(log.entity_type)}</span>
                      </div>
                      {log.entity_id && (
                        <div>
                          <span className="text-gray-600">ID:</span>
                          <span className="ml-1">{log.entity_id}</span>
                        </div>
                      )}
                      {log.ip_address && (
                        <div>
                          <span className="text-gray-600">IP:</span>
                          <span className="ml-1">{log.ip_address}</span>
                        </div>
                      )}
                    </div>
                    
                    {log.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-blue-600 hover:underline text-sm">Detaylar</summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Sayfa <span className="font-medium">{page}</span> / <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded ${
                    page === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Önceki
                </button>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded ${
                    page === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Sonraki
                </button>
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
