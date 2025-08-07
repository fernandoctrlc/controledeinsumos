/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para servir arquivos estáticos
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
  // Configuração para PWA
  experimental: {
    appDir: true,
  },
  // Configuração para copiar arquivos estáticos
  async rewrites() {
    const rewrites = [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://insumos.escolamega.com.br/api/:path*'
          : 'http://localhost:3001/api/:path*',
      },
    ];

    // Adicionar rewrites para arquivos estáticos em produção
    if (process.env.NODE_ENV === 'production') {
      rewrites.push(
        {
          source: '/sw.js',
          destination: '/_next/static/sw.js',
        },
        {
          source: '/manifest.json',
          destination: '/_next/static/manifest.json',
        },
        {
          source: '/icons/:path*',
          destination: '/_next/static/icons/:path*',
        },
        {
          source: '/favicon.ico',
          destination: '/_next/static/favicon.ico',
        }
      );
    }

    return rewrites;
  },
};

module.exports = nextConfig; 