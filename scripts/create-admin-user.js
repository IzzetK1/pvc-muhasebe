const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Supabase istemcisini oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL veya Key bulunamadı. .env dosyasını kontrol edin.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    // Kullanıcı bilgileri
    const username = 'admin';
    const password = 'admin123'; // Bu şifreyi daha sonra değiştirmeyi unutmayın!
    const name = 'Admin Kullanıcı';
    const email = 'admin@example.com';
    const role = 'admin';

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı ekle
    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        password: hashedPassword,
        name,
        email,
        role,
      })
      .select();

    if (error) {
      if (error.code === '23505') {
        console.log('Bu kullanıcı adı zaten kullanılıyor.');
      } else {
        throw error;
      }
      return;
    }

    console.log('Admin kullanıcısı başarıyla oluşturuldu:', data[0]);
  } catch (error) {
    console.error('Kullanıcı oluşturulurken hata:', error);
  }
}

createAdminUser();
