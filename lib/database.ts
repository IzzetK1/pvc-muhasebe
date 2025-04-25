import { supabase } from './supabase';

// Tablo tipleri
export type Transaction = {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category_id: string;
  partner_id?: string;
  notes?: string;
  file_ids?: string[];
  created_at?: string;
  updated_at?: string;
};

export type Partner = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  share_percentage?: number;
  created_at?: string;
  updated_at?: string;
};

export type PartnerExpense = {
  id: string;
  partner_id: string;
  date: string;
  amount: number;
  description: string;
  category_id?: string;
  notes?: string;
  file_ids?: string[];
  created_at?: string;
  updated_at?: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'cancelled';
  category_id?: string;
  total_income: number;
  total_expense: number;
  profit?: number;
  profit_margin?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'partner' | 'project';
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type FileObject = {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  transaction_id?: string;
  partner_expense_id?: string;
  project_id?: string;
  uploaded_at: string;
};

// İşlem fonksiyonları
export const transactionFunctions = {
  // Tüm işlemleri getir
  getAll: async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Belirli bir işlemi getir
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Yeni işlem ekle
  create: async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transaction,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  // İşlem güncelle
  update: async (id: string, transaction: Partial<Transaction>) => {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        ...transaction,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // İşlem sil
  delete: async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // İşlemleri filtrele
  filter: async (filters: {
    dateFrom?: string;
    dateTo?: string;
    type?: string;
    category_id?: string;
  }) => {
    let query = supabase
      .from('transactions')
      .select('*');

    if (filters.dateFrom) {
      query = query.gte('date', filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte('date', filters.dateTo);
    }

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    query = query.order('date', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }
};

// Ortak fonksiyonları
export const partnerFunctions = {
  // Tüm ortakları getir
  getAll: async () => {
    const { data, error } = await supabase
      .from('partners')
      .select('*');

    if (error) throw error;
    return data;
  },

  // Belirli bir ortağı getir
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Yeni ortak ekle
  create: async (partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('partners')
      .insert([{
        ...partner,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Ortak güncelle
  update: async (id: string, partner: Partial<Partner>) => {
    const { data, error } = await supabase
      .from('partners')
      .update({
        ...partner,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Ortak sil
  delete: async (id: string) => {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

// Ortak harcamaları fonksiyonları
export const partnerExpenseFunctions = {
  // Tüm ortak harcamalarını getir
  getAll: async () => {
    const { data, error } = await supabase
      .from('partner_expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Belirli bir ortağın harcamalarını getir
  getByPartnerId: async (partnerId: string) => {
    const { data, error } = await supabase
      .from('partner_expenses')
      .select('*')
      .eq('partner_id', partnerId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Belirli bir harcamayı getir
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('partner_expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Yeni harcama ekle
  create: async (expense: Omit<PartnerExpense, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('partner_expenses')
      .insert([{
        ...expense,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Harcama güncelle
  update: async (id: string, expense: Partial<PartnerExpense>) => {
    const { data, error } = await supabase
      .from('partner_expenses')
      .update({
        ...expense,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Harcama sil
  delete: async (id: string) => {
    const { error } = await supabase
      .from('partner_expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

// Kategori fonksiyonları
export const categoryFunctions = {
  // Tüm kategorileri getir
  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  // Belirli bir tipteki kategorileri getir
  getByType: async (type: 'income' | 'expense' | 'partner') => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', type)
      .order('name');

    if (error) throw error;
    return data;
  },

  // Belirli bir kategoriyi getir
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Yeni kategori ekle
  create: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        ...category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Kategori güncelle
  update: async (id: string, category: Partial<Category>) => {
    const { data, error } = await supabase
      .from('categories')
      .update({
        ...category,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Kategori sil
  delete: async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

// Proje fonksiyonları
export const projectFunctions = {
  // Tüm projeleri getir
  getAll: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Belirli bir projeyi getir
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Belirli bir kategorideki projeleri getir
  getByCategory: async (categoryId: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category_id', categoryId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Belirli bir durumdaki projeleri getir
  getByStatus: async (status: 'active' | 'completed' | 'cancelled') => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', status)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Yeni proje ekle
  create: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'profit' | 'profit_margin'>) => {
    // Kar ve kar marjını hesapla
    const profit = project.total_income - project.total_expense;
    const profitMargin = project.total_income > 0 ? (profit / project.total_income) * 100 : 0;

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...project,
        profit,
        profit_margin: profitMargin,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Proje güncelle
  update: async (id: string, project: Partial<Project>) => {
    // Eğer gelir veya gider güncellendiyse, kar ve kar marjını yeniden hesapla
    let updatedProject = { ...project };

    if (project.total_income !== undefined || project.total_expense !== undefined) {
      // Önce mevcut projeyi al
      const { data: existingProject, error: fetchError } = await supabase
        .from('projects')
        .select('total_income, total_expense')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Yeni değerleri hesapla
      const totalIncome = project.total_income !== undefined ? project.total_income : existingProject.total_income;
      const totalExpense = project.total_expense !== undefined ? project.total_expense : existingProject.total_expense;
      const profit = totalIncome - totalExpense;
      const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

      updatedProject = {
        ...updatedProject,
        profit,
        profit_margin: profitMargin
      };
    }

    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updatedProject,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Proje sil
  delete: async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

// Dosya fonksiyonları
export const fileFunctions = {
  // Dosya yükle
  upload: async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Dosya URL'sini al
    const { data } = supabase.storage
      .from('files')
      .getPublicUrl(filePath);

    // Dosya bilgilerini veritabanına kaydet
    const { data: fileData, error: dbError } = await supabase
      .from('files')
      .insert([{
        name: file.name,
        size: file.size,
        type: file.type,
        path: filePath,
        uploaded_at: new Date().toISOString()
      }])
      .select();

    if (dbError) throw dbError;

    return {
      ...fileData[0],
      url: data.publicUrl
    };
  },

  // İşleme dosya ekle
  addToTransaction: async (fileId: string, transactionId: string) => {
    const { data, error } = await supabase
      .from('files')
      .update({ transaction_id: transactionId })
      .eq('id', fileId)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Ortak harcamasına dosya ekle
  addToPartnerExpense: async (fileId: string, expenseId: string) => {
    const { data, error } = await supabase
      .from('files')
      .update({ partner_expense_id: expenseId })
      .eq('id', fileId)
      .select();

    if (error) throw error;
    return data[0];
  },

  // İşleme ait dosyaları getir
  getByTransactionId: async (transactionId: string) => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('transaction_id', transactionId);

    if (error) throw error;
    return data;
  },

  // Ortak harcamasına ait dosyaları getir
  getByPartnerExpenseId: async (expenseId: string) => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('partner_expense_id', expenseId);

    if (error) throw error;
    return data;
  },

  // Dosya sil
  delete: async (id: string) => {
    // Önce dosya bilgilerini al
    const { data: fileData, error: fetchError } = await supabase
      .from('files')
      .select('path')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Storage'dan dosyayı sil
    const { error: storageError } = await supabase.storage
      .from('files')
      .remove([fileData.path]);

    if (storageError) throw storageError;

    // Veritabanından kaydı sil
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return true;
  }
};
