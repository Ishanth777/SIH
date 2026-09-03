/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
  async redirects() {
    return [
      {
        source: '/admin/federation',
        destination: '/federation',
        permanent: false,
      },
      {
        source: '/admin/society',
        destination: '/society',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
