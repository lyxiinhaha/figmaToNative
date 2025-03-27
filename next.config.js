/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 配置Vercel部署
  output: 'standalone',
}

module.exports = nextConfig
