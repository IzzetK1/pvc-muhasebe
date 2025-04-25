import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Geçici olarak devre dışı bırakıldı
  return NextResponse.next();

  /*
  const { pathname } = request.nextUrl;

  // Login sayfasını kontrol etme
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // Statik dosyaları ve API rotalarını kontrol etme
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') // Statik dosyalar genellikle bir uzantıya sahiptir
  ) {
    return NextResponse.next();
  }

  // JWT token'ı kontrol et
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Admin sayfalarına erişim kontrolü
  if (pathname.startsWith('/admin') && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
  */
}

// Middleware'in çalışacağı rotaları belirt
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
