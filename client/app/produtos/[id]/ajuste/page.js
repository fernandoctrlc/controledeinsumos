'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, TrendingDown, Save, Package, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { materialsAPI, movimentacoesAPI, getUser } from '@/lib/api';

export default function AjusteProdutoPage() {
  const [produto, setProduto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const params = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const tipoOperacao = watch('tipoOperacao');

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
    loadProduto();
  }, [router, params.id]);

  const loadProduto = async () => {
    try {
      setIsLoading(true);
      const response = await materialsAPI.buscar(params.id);
      setProduto(response.material);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      toast.error('Erro ao carregar produto');
      router.push('/produtos');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const quantidade = parseInt(data.quantidade);
      const motivo = data.motivo;
      const observacoes = data.observacoes;
      
      // Validar quantidade para saída
      if (tipoOperacao === 'saida' && quantidade > produto.quantidade) {
        toast.error('Quantidade insuficiente em estoque');
        return;
      }

      // Calcular nova quantidade
      let novaQuantidade;
      if (tipoOperacao === 'entrada') {
        novaQuantidade = produto.quantidade + quantidade;
      } else {
        novaQuantidade = produto.quantidade - quantidade;
      }

      // Criar movimentação no histórico
      await movimentacoesAPI.criar({
        materialId: produto.id,
        tipo: 'ajuste',
        quantidade: quantidade,
        motivo: motivo,
        observacoes: observacoes
      });

      // Atualizar produto
      await materialsAPI.atualizar(produto.id, {
        ...produto,
        quantidade: novaQuantidade
      });
      
      toast.success(`Ajuste realizado com sucesso! Nova quantidade: ${novaQuantidade}`);
      router.push('/produtos');
    } catch (error) {
      console.error('Erro ao realizar ajuste:', error);
      const message = error.response?.data?.error || 'Erro ao realizar ajuste';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Produto não encontrado</h3>
          <p className="text-gray-500 mb-4">O produto solicitado não foi encontrado.</p>
          <button
            onClick={() => router.push('/produtos')}
            className="btn btn-primary"
          >
            Voltar para Produtos
          </button>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Ajuste de Estoque</h1>
                <p className="text-gray-600">Ajustar quantidade do produto: {produto.nome}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Produto */}
        <div className="card mb-6">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Produto</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nome</label>
                <p className="text-gray-900 font-medium">{produto.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Quantidade Atual</label>
                <p className="text-gray-900 font-medium">{produto.quantidade} {produto.unidadeDeMedida}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Categoria</label>
                <p className="text-gray-900 font-medium">{produto.categoria}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tipo de Operação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Operação *
                  </label>
                  <select
                    {...register('tipoOperacao', { required: 'Tipo de operação é obrigatório' })}
                    className="input"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="entrada">Entrada (Adicionar)</option>
                    <option value="saida">Saída (Remover)</option>
                  </select>
                  {errors.tipoOperacao && (
                    <p className="text-danger-600 text-sm mt-1">{errors.tipoOperacao.message}</p>
                  )}
                </div>

                {/* Quantidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade *
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('quantidade', { 
                      required: 'Quantidade é obrigatória',
                      min: { value: 1, message: 'Quantidade deve ser maior que 0' }
                    })}
                    className="input"
                    placeholder="0"
                  />
                  {errors.quantidade && (
                    <p className="text-danger-600 text-sm mt-1">{errors.quantidade.message}</p>
                  )}
                </div>
              </div>

              {/* Motivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo do Ajuste *
                </label>
                <select
                  {...register('motivo', { required: 'Motivo é obrigatório' })}
                  className="input"
                >
                  <option value="">Selecione o motivo</option>
                  <option value="inventario">Inventário</option>
                  <option value="perda">Perda/Avaria</option>
                  <option value="vencimento">Vencimento</option>
                  <option value="correcao">Correção de Erro</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.motivo && (
                  <p className="text-danger-600 text-sm mt-1">{errors.motivo.message}</p>
                )}
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  {...register('observacoes')}
                  rows="3"
                  className="input"
                  placeholder="Observações adicionais sobre o ajuste..."
                />
                {errors.observacoes && (
                  <p className="text-danger-600 text-sm mt-1">{errors.observacoes.message}</p>
                )}
              </div>

              {/* Preview do Resultado */}
              {tipoOperacao && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Preview do Ajuste</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Quantidade Atual:</span>
                      <span className="ml-2 font-medium">{produto.quantidade} {produto.unidadeDeMedida}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Operação:</span>
                      <span className="ml-2 font-medium">
                        {tipoOperacao === 'entrada' ? 'Entrada' : 'Saída'} de {watch('quantidade') || 0} {produto.unidadeDeMedida}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-blue-700">Nova Quantidade:</span>
                      <span className="ml-2 font-medium text-lg">
                        {tipoOperacao === 'entrada' 
                          ? (produto.quantidade + (parseInt(watch('quantidade')) || 0))
                          : (produto.quantidade - (parseInt(watch('quantidade')) || 0))
                        } {produto.unidadeDeMedida}
                      </span>
                    </div>
                  </div>
                </div>
              )}

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
                      Salvar Ajuste
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