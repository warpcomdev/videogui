/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'badajoz.urbo2.es',
        port: '',
        pathname: '/v1/media/**',
      },
    ],
  },
}

module.exports = nextConfig
