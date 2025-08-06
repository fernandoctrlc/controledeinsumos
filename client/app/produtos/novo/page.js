'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { materialsAPI, getUser } from '@/lib/api';

export default function NovoProdutoPage() {
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
    if (!['coordenador', 'almoxarife', 'administrador'].includes(userData.perfil)) {
      toast.error('Acesso negado. Apenas coordenadores e almoxarifes podem acessar esta página.');
      router.push('/dashboard');
      return;
    }

    setUser(userData);
  }, [router]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      await materialsAPI.criar({
        ...data,
        unidadeDeMedida: data.unidade, // Mapear unidade para unidadeDeMedida
        quantidade: parseInt(data.quantidade),
        quantidadeMinima: parseInt(data.quantidadeMinima),
        ativo: true
      });
      
      toast.success('Produto cadastrado com sucesso!');
      router.push('/produtos');
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      const message = error.response?.data?.error || 'Erro ao cadastrar produto';
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
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md mr-4"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
                <p className="text-gray-600">Cadastre um novo produto no sistema</p>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    {...register('nome', { 
                      required: 'Nome é obrigatório',
                      minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
                    })}
                    className="input"
                    placeholder="Ex: Papel A4"
                  />
                  {errors.nome && (
                    <p className="text-danger-600 text-sm mt-1">{errors.nome.message}</p>
                  )}
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    {...register('categoria', { required: 'Categoria é obrigatória' })}
                    className="input"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Papelaria">Papelaria</option>
                    <option value="Limpeza">Limpeza</option>
                    <option value="Informática">Informática</option>
                    <option value="Escritório">Escritório</option>
                    <option value="Higiene">Higiene</option>
                    <option value="Outros">Outros</option>
                  </select>
                  {errors.categoria && (
                    <p className="text-danger-600 text-sm mt-1">{errors.categoria.message}</p>
                  )}
                </div>

                {/* Quantidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade Inicial *
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('quantidade', { 
                      required: 'Quantidade é obrigatória',
                      min: { value: 0, message: 'Quantidade deve ser maior ou igual a 0' }
                    })}
                    className="input"
                    placeholder="0"
                  />
                  {errors.quantidade && (
                    <p className="text-danger-600 text-sm mt-1">{errors.quantidade.message}</p>
                  )}
                </div>

                {/* Quantidade Mínima */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade Mínima *
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('quantidadeMinima', { 
                      required: 'Quantidade mínima é obrigatória',
                      min: { value: 0, message: 'Quantidade mínima deve ser maior ou igual a 0' }
                    })}
                    className="input"
                    placeholder="0"
                  />
                  {errors.quantidadeMinima && (
                    <p className="text-danger-600 text-sm mt-1">{errors.quantidadeMinima.message}</p>
                  )}
                </div>

                {/* Unidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidade *
                  </label>
                  <select
                    {...register('unidade', { required: 'Unidade é obrigatória' })}
                    className="input"
                  >
                    <option value="">Selecione uma unidade</option>
                    <option value="unidade">Unidade</option>
                    <option value="caixa">Caixa</option>
                    <option value="pacote">Pacote</option>
                    <option value="fardo">Fardo</option>
                    <option value="resma">Resma</option>
                    <option value="litro">Litro</option>
                    <option value="quilo">Quilo</option>
                    <option value="metro">Metro</option>
                    <option value="rolo">Rolo</option>
                  </select>
                  {errors.unidade && (
                    <p className="text-danger-600 text-sm mt-1">{errors.unidade.message}</p>
                  )}
                </div>

                {/* Preço Unitário */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Unitário (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('precoUnitario', { 
                      min: { value: 0, message: 'Preço deve ser maior ou igual a 0' }
                    })}
                    className="input"
                    placeholder="0.00"
                  />
                  {errors.precoUnitario && (
                    <p className="text-danger-600 text-sm mt-1">{errors.precoUnitario.message}</p>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  {...register('descricao')}
                  rows="3"
                  className="input"
                  placeholder="Descrição detalhada do produto..."
                />
                {errors.descricao && (
                  <p className="text-danger-600 text-sm mt-1">{errors.descricao.message}</p>
                )}
              </div>

              {/* Fornecedor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fornecedor
                </label>
                <input
                  type="text"
                  {...register('fornecedor')}
                  className="input"
                  placeholder="Nome do fornecedor"
                />
                {errors.fornecedor && (
                  <p className="text-danger-600 text-sm mt-1">{errors.fornecedor.message}</p>
                )}
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  {...register('observacoes')}
                  rows="2"
                  className="input"
                  placeholder="Observações adicionais..."
                />
                {errors.observacoes && (
                  <p className="text-danger-600 text-sm mt-1">{errors.observacoes.message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn btn-outline"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Salvar Produto
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