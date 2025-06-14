/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Optional: Jika Anda menggunakan experimental features
  experimental: {
    serverComponentsExternalPackages: ['cloudinary'],
  },
}

module.exports = nextConfig