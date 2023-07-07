/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'badajoz.urbo2.es',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
}

module.exports = nextConfig
