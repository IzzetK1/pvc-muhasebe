@echo off
echo Supabase ve dosya yukleme icin gerekli paketler yukleniyor...
call npm install @supabase/supabase-js uuid
call npm install --save-dev @types/uuid

echo.
echo Supabase veritabani semasi olusturuluyor...
echo Asagidaki SQL sorgularini Supabase SQL editorunde calistirin:
echo.
echo -- Kullanicilar tablosu zaten Supabase Auth tarafindan olusturulur
echo.
echo -- Ortaklar tablosu
echo CREATE TABLE partners (
echo   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
echo   name TEXT NOT NULL,
echo   email TEXT,
echo   phone TEXT,
echo   role TEXT,
echo   share_percentage INTEGER,
echo   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
echo   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
echo );
echo.
echo -- Kategoriler tablosu
echo CREATE TABLE categories (
echo   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
echo   name TEXT NOT NULL,
echo   type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'partner')),
echo   description TEXT,
echo   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
echo   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
echo );
echo.
echo -- Islemler tablosu
echo CREATE TABLE transactions (
echo   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
echo   date DATE NOT NULL,
echo   description TEXT NOT NULL,
echo   amount DECIMAL(12, 2) NOT NULL,
echo   type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
echo   category_id UUID REFERENCES categories(id),
echo   partner_id UUID REFERENCES partners(id),
echo   notes TEXT,
echo   file_ids TEXT[],
echo   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
echo   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
echo );
echo.
echo -- Ortak harcamalari tablosu
echo CREATE TABLE partner_expenses (
echo   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
echo   partner_id UUID NOT NULL REFERENCES partners(id),
echo   date DATE NOT NULL,
echo   amount DECIMAL(12, 2) NOT NULL,
echo   description TEXT NOT NULL,
echo   category_id UUID REFERENCES categories(id),
echo   notes TEXT,
echo   file_ids TEXT[],
echo   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
echo   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
echo );
echo.
echo -- Dosyalar tablosu
echo CREATE TABLE files (
echo   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
echo   name TEXT NOT NULL,
echo   size INTEGER NOT NULL,
echo   type TEXT NOT NULL,
echo   path TEXT NOT NULL,
echo   transaction_id UUID REFERENCES transactions(id),
echo   partner_expense_id UUID REFERENCES partner_expenses(id),
echo   uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
echo );
echo.
echo -- Ornek veriler
echo -- Ortaklar
echo INSERT INTO partners (name, email, phone, role, share_percentage)
echo VALUES 
echo   ('Mehmet', 'mehmet@example.com', '0555 123 4567', 'Ortak', 50),
echo   ('Abdulaziz', 'abdulaziz@example.com', '0555 987 6543', 'Ortak', 50);
echo.
echo -- Kategoriler
echo INSERT INTO categories (name, type, description)
echo VALUES 
echo   ('Proje', 'income', 'Proje gelirleri'),
echo   ('Montaj', 'income', 'Montaj gelirleri'),
echo   ('Diger Gelir', 'income', 'Diger gelir kalemleri'),
echo   ('Malzeme', 'expense', 'Malzeme giderleri'),
echo   ('Iscilik', 'expense', 'Iscilik giderleri'),
echo   ('Kira', 'expense', 'Kira giderleri'),
echo   ('Fatura', 'expense', 'Fatura giderleri'),
echo   ('Ulasim', 'expense', 'Ulasim giderleri'),
echo   ('Yakit', 'partner', 'Ortak yakit giderleri'),
echo   ('Yemek', 'partner', 'Ortak yemek giderleri'),
echo   ('Telefon', 'partner', 'Ortak telefon giderleri');
echo.
echo -- Storage bucket olustur
echo -- Supabase Dashboard'dan manuel olarak 'files' adinda bir bucket olusturun ve public erisime acin
echo.
echo.
echo Kurulum tamamlandi!
echo Supabase Dashboard'dan 'files' adinda bir storage bucket olusturmayi unutmayin.
echo Ayrica .env.local dosyasini duzenleyerek Supabase baglanti bilgilerinizi ekleyin.
pause
