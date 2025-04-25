# PVC Muhasebe Sistemi

PVC Doğrama ve Montaj işletmesi için geliştirilmiş muhasebe yönetim sistemi.

## Özellikler

- Gelir ve gider takibi
- Ortak harcamaları yönetimi
- Kategori bazlı raporlama
- Dosya yükleme ve belge yönetimi
- Çoklu kullanıcı desteği
- Mobil uyumlu arayüz

## Başlangıç

### Gereksinimler

- Node.js 18.0 veya üzeri
- npm veya yarn
- Supabase hesabı (ücretsiz)

### Kurulum

1. Repoyu klonlayın:

```bash
git clone https://github.com/kullaniciadi/pvc-muhasebe.git
cd pvc-muhasebe
```

2. Bağımlılıkları yükleyin:

```bash
npm install
# veya
yarn install
```

3. Supabase kurulumunu yapın:

   a. [Supabase](https://supabase.com/) hesabı oluşturun
   b. Yeni bir proje oluşturun
   c. SQL Editor'de aşağıdaki SQL sorgularını çalıştırın (supabase-schema.sql dosyasında bulunabilir)
   d. Storage bölümünde "files" adında public bir bucket oluşturun

```bash
# Windows için (yerel geliştirme için)
setup-supabase.bat

# Linux/Mac için (yerel geliştirme için)
chmod +x setup-supabase.sh
./setup-supabase.sh
```

4. `.env.local.example` dosyasını `.env.local` olarak kopyalayın ve Supabase bilgilerinizi ekleyin:

```bash
cp .env.local.example .env.local
```

   a. Supabase Dashboard'dan "Project Settings" > "API" bölümünden "Project URL" ve "anon public" anahtarını kopyalayın
   b. Bu değerleri .env.local dosyasındaki ilgili alanlara yapıştırın
   c. Canlı ortam için NEXT_PUBLIC_APP_URL değerini güncelleyin

5. Geliştirme sunucusunu başlatın:

```bash
npm run dev
# veya
yarn dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyebilirsiniz.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Canlı Ortama Dağıtım

Uygulamayı canlı ortama dağıtmak için aşağıdaki adımları izleyin:

1. [Vercel](https://vercel.com/) hesabı oluşturun
2. GitHub reponuzu Vercel'e bağlayın
3. Yeni bir proje oluşturun ve GitHub reponuzu seçin
4. Çevre değişkenlerini ayarlayın:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXT_PUBLIC_APP_URL (uygulamanızın Vercel URL'si)
5. "Deploy" butonuna tıklayın

Daha fazla bilgi için [Next.js dağıtım dokümantasyonu](https://nextjs.org/docs/app/building-your-application/deploying)na göz atabilirsiniz.
