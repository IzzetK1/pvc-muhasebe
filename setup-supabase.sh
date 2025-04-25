#!/bin/bash

# Supabase ve dosya yükleme için gerekli paketleri yükle
npm install @supabase/supabase-js uuid

# TypeScript tiplerini yükle
npm install --save-dev @types/uuid

# Supabase veritabanı şemasını oluştur
echo "Supabase veritabanı şeması oluşturuluyor..."
echo "Aşağıdaki SQL sorgularını Supabase SQL editöründe çalıştırın:"

cat << 'EOF'
-- Kullanıcılar tablosu zaten Supabase Auth tarafından oluşturulur

-- Ortaklar tablosu
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  share_percentage INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kategoriler tablosu
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'partner')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İşlemler tablosu
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category_id UUID REFERENCES categories(id),
  partner_id UUID REFERENCES partners(id),
  notes TEXT,
  file_ids TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ortak harcamaları tablosu
CREATE TABLE partner_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  date DATE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  notes TEXT,
  file_ids TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dosyalar tablosu
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  type TEXT NOT NULL,
  path TEXT NOT NULL,
  transaction_id UUID REFERENCES transactions(id),
  partner_expense_id UUID REFERENCES partner_expenses(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Örnek veriler
-- Ortaklar
INSERT INTO partners (name, email, phone, role, share_percentage)
VALUES 
  ('Mehmet', 'mehmet@example.com', '0555 123 4567', 'Ortak', 50),
  ('Abdülaziz', 'abdulaziz@example.com', '0555 987 6543', 'Ortak', 50);

-- Kategoriler
INSERT INTO categories (name, type, description)
VALUES 
  ('Proje', 'income', 'Proje gelirleri'),
  ('Montaj', 'income', 'Montaj gelirleri'),
  ('Diğer Gelir', 'income', 'Diğer gelir kalemleri'),
  ('Malzeme', 'expense', 'Malzeme giderleri'),
  ('İşçilik', 'expense', 'İşçilik giderleri'),
  ('Kira', 'expense', 'Kira giderleri'),
  ('Fatura', 'expense', 'Fatura giderleri'),
  ('Ulaşım', 'expense', 'Ulaşım giderleri'),
  ('Yakıt', 'partner', 'Ortak yakıt giderleri'),
  ('Yemek', 'partner', 'Ortak yemek giderleri'),
  ('Telefon', 'partner', 'Ortak telefon giderleri');

-- Storage bucket oluştur
-- Supabase Dashboard'dan manuel olarak 'files' adında bir bucket oluşturun ve public erişime açın
EOF

echo ""
echo "Kurulum tamamlandı!"
echo "Supabase Dashboard'dan 'files' adında bir storage bucket oluşturmayı unutmayın."
echo "Ayrıca .env.local dosyasını düzenleyerek Supabase bağlantı bilgilerinizi ekleyin."
