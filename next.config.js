/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint kontrollerini devre dışı bırak
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript kontrollerini devre dışı bırak
    ignoreBuildErrors: true,
  },
  swcMinify: false,
};

module.exports = nextConfig;
