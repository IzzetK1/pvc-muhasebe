import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// Supabase istemcisini oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Supabase bağlantısını kontrol et
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL ve Service Role Key gereklidir. Lütfen .env dosyasını kontrol edin.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Kullanıcı adı ve şifre gereklidir");
        }

        // Kullanıcıyı veritabanında ara
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("username", credentials.username)
          .single();

        if (error || !user) {
          throw new Error("Kullanıcı bulunamadı");
        }

        // Şifreyi kontrol et
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Geçersiz şifre");
        }

        // Kullanıcı bilgilerini döndür (şifre hariç)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  callbacks: {
    async jwt({ token, user }) {
      // Kullanıcı bilgilerini token'a ekle
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Token'daki bilgileri session'a ekle
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

export { handler as GET, handler as POST };
