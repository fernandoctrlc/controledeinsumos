/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  async rewrites() {
    // Detectar ambiente para definir a URL do backend
    const isProduction = process.env.NODE_ENV === 'production';
    const backendUrl = isProduction 
      ? 'https://insumos.escolamega.com.br/api/:path*'
      : 'http://localhost:3001/api/:path*';
    
    return [
      {
        source: '/api/:path*',
        destination: backendUrl,
      },
    ];
  },
};

module.exports = nextConfig; 