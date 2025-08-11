'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, TrendingUp, TrendingDown, Save, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { materialsAPI, movimentacoesAPI, getUser } from '@/lib/api';
import BackToDashboard from '@/components/BackToDashboard';

export default function ControleEstoquePage() {
  const [produto, setProduto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tipoOperacao, setTipoOperacao] = useState('entrada'); // 'entrada' ou 'saida'
  const router = useRouter();
  const params = useParams();

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
    loadProduto();
  }, [router, params.id]);

  const loadProduto = async () => {
    try {
      setIsLoading(true);
      const response = await materialsAPI.buscar(params.id);
      setProduto(response);
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
      
      if (tipoOperacao === 'saida' && quantidade > produto.quantidade) {
        toast.error('Quantidade insuficiente em estoque');
        return;
      }

      // Criar movimentação no histórico
      await movimentacoesAPI.criar({
        materialId: produto.id,
        tipo: tipoOperacao,
        quantidade: quantidade,
        motivo: motivo,
        observacoes: observacoes
      });

      if (tipoOperacao === 'entrada') {
        await materialsAPI.adicionarEstoque(produto.id, quantidade);
        toast.success('Estoque adicionado com sucesso!');
      } else {
        // Para saída, vamos criar uma API específica ou usar uma atualização
        const novaQuantidade = produto.quantidade - quantidade;
        await materialsAPI.atualizar(produto.id, {
          ...produto,
          quantidade: novaQuantidade
        });
        toast.success('Estoque reduzido com sucesso!');
      }
      
      router.push('/produtos');
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      const message = error.response?.data?.error || 'Erro ao atualizar estoque';
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BackToDashboard className="mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Controle de Estoque</h1>
                <p className="text-gray-600">Gerencie o estoque do produto</p>
              </div>
            </div>
          </div>
        </div>

        {/* Produto Info */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex items-center mb-4">
              <Package className="w-8 h-8 text-primary-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{produto.nome}</h2>
                <p className="text-gray-600">{produto.categoria}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Estoque Atual</p>
                <p className="text-2xl font-bold text-blue-600">{produto.quantidade}</p>
                <p className="text-sm text-gray-500">{produto.unidade}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">Estoque Mínimo</p>
                <p className="text-2xl font-bold text-yellow-600">{produto.quantidadeMinima}</p>
                <p className="text-sm text-gray-500">{produto.unidade}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Disponível</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(0, produto.quantidade - produto.quantidadeMinima)}
                </p>
                <p className="text-sm text-gray-500">{produto.unidade}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controle de Estoque */}
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Movimentação de Estoque</h3>
            
            {/* Tipo de Operação */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Operação
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="entrada"
                    checked={tipoOperacao === 'entrada'}
                    onChange={(e) => setTipoOperacao(e.target.value)}
                    className="mr-2"
                  />
                  <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Entrada de Estoque</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="saida"
                    checked={tipoOperacao === 'saida'}
                    onChange={(e) => setTipoOperacao(e.target.value)}
                    className="mr-2"
                  />
                  <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm font-medium">Saída de Estoque</span>
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      min: { value: 1, message: 'Quantidade deve ser maior que 0' },
                      max: tipoOperacao === 'saida' ? { 
                        value: produto.quantidade, 
                        message: `Quantidade máxima disponível: ${produto.quantidade}` 
                      } : undefined
                    })}
                    className="input"
                    placeholder="0"
                  />
                  {errors.quantidade && (
                    <p className="text-danger-600 text-sm mt-1">{errors.quantidade.message}</p>
                  )}
                </div>

                {/* Motivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo *
                  </label>
                  <select
                    {...register('motivo', { required: 'Motivo é obrigatório' })}
                    className="input"
                  >
                    <option value="">Selecione um motivo</option>
                    {tipoOperacao === 'entrada' ? (
                      <>
                        <option value="compra">Compra</option>
                        <option value="doacao">Doação</option>
                        <option value="devolucao">Devolução</option>
                        <option value="ajuste">Ajuste de Estoque</option>
                        <option value="outro">Outro</option>
                      </>
                    ) : (
                      <>
                        <option value="requisicao">Requisição</option>
                        <option value="perda">Perda/Danificação</option>
                        <option value="vencimento">Vencimento</option>
                        <option value="ajuste">Ajuste de Estoque</option>
                        <option value="outro">Outro</option>
                      </>
                    )}
                  </select>
                  {errors.motivo && (
                    <p className="text-danger-600 text-sm mt-1">{errors.motivo.message}</p>
                  )}
                </div>
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
                  placeholder="Observações sobre a movimentação..."
                />
                {errors.observacoes && (
                  <p className="text-danger-600 text-sm mt-1">{errors.observacoes.message}</p>
                )}
              </div>

              {/* Preview da Operação */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Resumo da Operação</h4>
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Operação:</span> {tipoOperacao === 'entrada' ? 'Entrada' : 'Saída'}
                  </p>
                  <p>
                    <span className="font-medium">Estoque Atual:</span> {produto.quantidade} {produto.unidade}
                  </p>
                  <p>
                    <span className="font-medium">Estoque Final:</span> {
                      tipoOperacao === 'entrada' 
                        ? `${produto.quantidade + (parseInt(document.querySelector('input[name="quantidade"]')?.value || 0))}`
                        : `${produto.quantidade - (parseInt(document.querySelector('input[name="quantidade"]')?.value || 0))}`
                    } {produto.unidade}
                  </p>
                </div>
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
                  className={`btn flex items-center ${
                    tipoOperacao === 'entrada' ? 'btn-success' : 'btn-warning'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {tipoOperacao === 'entrada' ? 'Adicionar Estoque' : 'Reduzir Estoque'}
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