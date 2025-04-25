import { createClient } from '@supabase/supabase-js';

// Supabase bağlantı bilgileri - gerçek uygulamada .env dosyasından alınmalıdır
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase istemcisini oluştur
export const supabase = createClient(supabaseUrl, supabaseKey);
