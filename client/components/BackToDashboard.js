'use client';

import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';

export default function BackToDashboard({ className = '' }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/dashboard')}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${className}`}
    >
      <Home className="w-4 h-4 mr-2" />
      Voltar ao Dashboard
    </button>
  );
} 