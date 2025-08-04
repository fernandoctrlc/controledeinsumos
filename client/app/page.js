'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="text-center">
        <div className="animate-bounce-in">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Almoxarifado Escolar
          </h1>
          <p className="text-gray-600 mb-8">
            Sistema de controle de insumos escolares
          </p>
          <div className="animate-pulse">
            <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 