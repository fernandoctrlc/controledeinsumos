'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Building2, Save, User, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUser, departamentosAPI } from '@/lib/api';
import BackToDashboard from '@/components/BackToDashboard';

export default function NovoDepartamentoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    const userData = getUser();
    if (!userData) {
      router.push('/login');
      return;
    }

    // Verificar permissões
    if (!['coordenador', 'administrador'].includes(userData.perfil)) {
      toast.error('Acesso negado. Apenas coordenadores podem criar departamentos.');
      router.push('/dashboard');
      return;
    }

    setUser(userData);
  }, [router]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      await departamentosAPI.criar(data);
      toast.success('Departamento criado com sucesso!');
      router.push('/departamentos');
    } catch (error) {
      console.error('Erro ao criar departamento:', error);
      const message = error.response?.data?.error || 'Erro ao criar departamento';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BackToDashboard className="mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Novo Departamento</h1>
                <p className="text-gray-600">Cadastre um novo departamento no sistema</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Departamento *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      {...register('nome', { 
                        required: 'Nome é obrigatório',
                        minLength: { value: 3, message: 'Nome deve ter pelo menos 3 caracteres' },
                        maxLength: { value: 100, message: 'Nome deve ter no máximo 100 caracteres' }
                      })}
                      className="input pl-10"
                      placeholder="Ex: Departamento de Matemática"
                    />
                  </div>
                  {errors.nome && (
                    <p className="text-red-600 text-sm mt-1">{errors.nome.message}</p>
                  )}
                </div>

                {/* Sigla */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sigla *
                  </label>
                  <input
                    type="text"
                    {...register('sigla', { 
                      required: 'Sigla é obrigatória',
                      minLength: { value: 2, message: 'Sigla deve ter pelo menos 2 caracteres' },
                      maxLength: { value: 10, message: 'Sigla deve ter no máximo 10 caracteres' }
                    })}
                    className="input"
                    placeholder="Ex: DMAT"
                    style={{ textTransform: 'uppercase' }}
                  />
                  {errors.sigla && (
                    <p className="text-red-600 text-sm mt-1">{errors.sigla.message}</p>
                  )}
                </div>

                {/* Responsável */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsável
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      {...register('responsavel', {
                        maxLength: { value: 100, message: 'Responsável deve ter no máximo 100 caracteres' }
                      })}
                      className="input pl-10"
                      placeholder="Ex: Prof. João Silva"
                    />
                  </div>
                  {errors.responsavel && (
                    <p className="text-red-600 text-sm mt-1">{errors.responsavel.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      {...register('email', {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido'
                        },
                        maxLength: { value: 100, message: 'Email deve ter no máximo 100 caracteres' }
                      })}
                      className="input pl-10"
                      placeholder="Ex: departamento@escola.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      {...register('telefone', {
                        maxLength: { value: 20, message: 'Telefone deve ter no máximo 20 caracteres' }
                      })}
                      className="input pl-10"
                      placeholder="Ex: (11) 99999-9999"
                    />
                  </div>
                  {errors.telefone && (
                    <p className="text-red-600 text-sm mt-1">{errors.telefone.message}</p>
                  )}
                </div>

                {/* Descrição */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    {...register('descricao', {
                      maxLength: { value: 500, message: 'Descrição deve ter no máximo 500 caracteres' }
                    })}
                    className="input"
                    rows="4"
                    placeholder="Descreva as responsabilidades e características do departamento..."
                  />
                  {errors.descricao && (
                    <p className="text-red-600 text-sm mt-1">{errors.descricao.message}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push('/departamentos')}
                  className="btn btn-secondary"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Criar Departamento
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 