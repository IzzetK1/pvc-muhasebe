import { createClient } from '@supabase/supabase-js';

// Supabase bağlantı bilgilerini çevre değişkenlerinden al
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase istemcisini oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Kullanıcı oturumu işlevleri
export const auth = {
  // Kullanıcı girişi
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Kullanıcı kaydı
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Kullanıcı çıkışı
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },
  
  // Mevcut kullanıcıyı al
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
  
  // Oturum durumunu izle
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
