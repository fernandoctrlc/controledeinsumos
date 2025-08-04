'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, saveAuthData, isAuthenticated } from '@/lib/api';
import { isValidEmail } from '@/lib/utils';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    // Se já estiver autenticado, redirecionar para dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      if (isRegisterMode) {
        // Registro
        const response = await authAPI.registro(data);
        saveAuthData(response.token, response.usuario);
        toast.success('Usuário criado com sucesso!');
      } else {
        // Login
        const response = await authAPI.login(data.email, data.senha);
        saveAuthData(response.token, response.usuario);
        toast.success('Login realizado com sucesso!');
      }
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro na autenticação:', error);
      const message = error.response?.data?.error || 'Erro na autenticação';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="w-full max-w-md">
        <div className="card animate-fade-in">
          <div className="card-header text-center">
            <div className="text-4xl mb-4">📚</div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRegisterMode ? 'Criar Conta' : 'Entrar'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isRegisterMode 
                ? 'Crie sua conta para acessar o sistema'
                : 'Faça login para acessar o sistema'
              }
            </p>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {isRegisterMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      {...register('nome', { 
                        required: 'Nome é obrigatório',
                        minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
                      })}
                      className="input pl-10"
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  {errors.nome && (
                    <p className="text-danger-600 text-sm mt-1">{errors.nome.message}</p>
                  )}
                </div>
              )}

              {isRegisterMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perfil
                  </label>
                  <select
                    {...register('perfil', { required: 'Perfil é obrigatório' })}
                    className="input"
                  >
                    <option value="">Selecione um perfil</option>
                    <option value="professor">Professor</option>
                    <option value="coordenador">Coordenador</option>
                    <option value="almoxarife">Almoxarife</option>
                  </select>
                  {errors.perfil && (
                    <p className="text-danger-600 text-sm mt-1">{errors.perfil.message}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email é obrigatório',
                      validate: value => isValidEmail(value) || 'Email inválido'
                    })}
                    className="input pl-10"
                    placeholder="Digite seu email"
                  />
                </div>
                {errors.email && (
                  <p className="text-danger-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('senha', { 
                      required: 'Senha é obrigatória',
                      minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
                    })}
                    className="input pl-10 pr-10"
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.senha && (
                  <p className="text-danger-600 text-sm mt-1">{errors.senha.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isRegisterMode ? 'Criando conta...' : 'Entrando...'}
                  </div>
                ) : (
                  isRegisterMode ? 'Criar Conta' : 'Entrar'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {isRegisterMode 
                  ? 'Já tem uma conta? Faça login'
                  : 'Não tem uma conta? Criar conta'
                }
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>📱 Instale como PWA para melhor experiência</p>
        </div>
      </div>
    </div>
  );
} 