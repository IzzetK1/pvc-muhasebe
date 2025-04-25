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

```bash
# Windows için
setup-supabase.bat

# Linux/Mac için
chmod +x setup-supabase.sh
./setup-supabase.sh
```

4. `.env.local.example` dosyasını `.env.local` olarak kopyalayın ve Supabase bilgilerinizi ekleyin:

```bash
cp .env.local.example .env.local
```

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
