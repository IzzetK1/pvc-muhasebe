"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../Header';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Supabase istemcisini oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client tarafında çalışıyorsa ve değişkenler tanımlıysa supabase istemcisini oluştur
const supabase = (typeof window !== 'undefined' && supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Yeni kullanıcı formu
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'user',
  });
  const [formError, setFormError] = useState<string | null>(null);

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

    // Kullanıcıları yükle
    if (status === 'authenticated') {
      loadUsers();
    }
  }, [status, session]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Supabase istemcisi yoksa hata ver
      if (!supabase) {
        throw new Error('Supabase istemcisi oluşturulamadı');
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, username, name, email, role, created_at')
        .order('username');

      if (error) throw error;
      setUsers(data || []);
      setError(null);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      setError('Kullanıcılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validasyon
    if (!newUser.username || !newUser.password || !newUser.name) {
      setFormError('Kullanıcı adı, şifre ve isim alanları zorunludur.');
      return;
    }

    try {
      // Supabase istemcisi yoksa hata ver
      if (!supabase) {
        throw new Error('Supabase istemcisi oluşturulamadı');
      }

      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(newUser.password, 10);

      // Kullanıcıyı ekle
      const { data, error } = await supabase
        .from('users')
        .insert({
          username: newUser.username,
          password: hashedPassword,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        })
        .select();

      if (error) {
        if (error.code === '23505') {
          setFormError('Bu kullanıcı adı zaten kullanılıyor.');
        } else {
          throw error;
        }
        return;
      }

      // Formu sıfırla ve kullanıcıları yeniden yükle
      setNewUser({
        username: '',
        password: '',
        name: '',
        email: '',
        role: 'user',
      });
      setShowForm(false);
      loadUsers();
    } catch (error) {
      console.error('Kullanıcı eklenirken hata:', error);
      setFormError('Kullanıcı eklenirken bir hata oluştu.');
    }
  };

  const deleteUser = async (userId: string) => {
    // Admin kullanıcısını silmeye çalışıyorsa engelle
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete?.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1) {
      alert('Son admin kullanıcısını silemezsiniz!');
      return;
    }

    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        // Supabase istemcisi yoksa hata ver
        if (!supabase) {
          throw new Error('Supabase istemcisi oluşturulamadı');
        }

        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);

        if (error) throw error;

        // Kullanıcıları yeniden yükle
        loadUsers();
      } catch (error) {
        console.error('Kullanıcı silinirken hata:', error);
        setError('Kullanıcı silinirken bir hata oluştu.');
      }
    }
  };

  // Tarih formatla
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Yönetim Paneli</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href="/admin/logs"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-center"
            >
              Sistem Logları
            </Link>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
            >
              {showForm ? 'İptal' : 'Yeni Kullanıcı Ekle'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Yeni Kullanıcı Formu */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Yeni Kullanıcı Ekle</h3>

            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Kullanıcı Adı *
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Şifre *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="user">Kullanıcı</option>
                    <option value="admin">Yönetici</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                >
                  Kullanıcı Ekle
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Kullanıcı Tablosu */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h3 className="text-lg font-medium text-gray-700 p-6 border-b">Kullanıcılar</h3>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p>Kullanıcılar yükleniyor...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Kayıtlı kullanıcı bulunamadı.</p>
            </div>
          ) : (
            <>
              {/* Masaüstü Görünüm */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-gray-600">Kullanıcı Adı</th>
                      <th className="px-6 py-3 text-gray-600">Ad Soyad</th>
                      <th className="px-6 py-3 text-gray-600">E-posta</th>
                      <th className="px-6 py-3 text-gray-600">Rol</th>
                      <th className="px-6 py-3 text-gray-600">Kayıt Tarihi</th>
                      <th className="px-6 py-3 text-gray-600 text-center">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{user.username}</td>
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.email || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{formatDate(user.created_at)}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={user.id === session?.user?.id}
                          >
                            {user.id === session?.user?.id ? 'Aktif Kullanıcı' : 'Sil'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobil Görünüm */}
              <div className="md:hidden">
                {users.map(user => (
                  <div key={user.id} className="border-b p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.name}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                      </span>
                    </div>

                    {user.email && (
                      <div className="text-sm mb-2">{user.email}</div>
                    )}

                    <div className="text-sm text-gray-500 mb-3">
                      Kayıt: {formatDate(user.created_at)}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        disabled={user.id === session?.user?.id}
                      >
                        {user.id === session?.user?.id ? 'Aktif Kullanıcı' : 'Sil'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
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
