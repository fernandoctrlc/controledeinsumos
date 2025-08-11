'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Package, TrendingUp, TrendingDown, AlertTriangle, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { materialsAPI, movimentacoesAPI, getUser } from '@/lib/api';
import BackToDashboard from '@/components/BackToDashboard';

export default function HistoricoProdutoPage() {
  const [produto, setProduto] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [paginacao, setPaginacao] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const params = useParams();

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
    loadData();
  }, [router, params.id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Carregar produto
      const produtoResponse = await materialsAPI.buscar(params.id);
      setProduto(produtoResponse.material);
      
      // Carregar histórico
      const historicoResponse = await movimentacoesAPI.historicoMaterial(params.id);
      setMovimentacoes(historicoResponse.movimentacoes);
      setPaginacao(historicoResponse.paginacao);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar histórico');
      router.push('/produtos');
    } finally {
      setIsLoading(false);
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'entrada':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'saida':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'ajuste':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'entrada':
        return 'Entrada';
      case 'saida':
        return 'Saída';
      case 'ajuste':
        return 'Ajuste';
      default:
        return tipo;
    }
  };

  const getMotivoLabel = (motivo) => {
    const motivos = {
      'compra': 'Compra',
      'doacao': 'Doação',
      'devolucao': 'Devolução',
      'requisicao': 'Requisição',
      'perda': 'Perda/Danificação',
      'vencimento': 'Vencimento',
      'inventario': 'Inventário',
      'correcao': 'Correção de Erro',
      'ajuste': 'Ajuste de Estoque',
      'outro': 'Outro'
    };
    return motivos[motivo] || motivo;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando histórico...</p>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BackToDashboard className="mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-500">Histórico de Movimentações</h1>
                <p className="text-gray-600">Histórico completo do produto: {produto.nome}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Produto */}
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
                <p className="text-sm text-gray-500">{produto.unidadeDeMedida}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">Estoque Mínimo</p>
                <p className="text-2xl font-bold text-yellow-600">{produto.quantidadeMinima}</p>
                <p className="text-sm text-gray-500">{produto.unidadeDeMedida}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Total de Movimentações</p>
                <p className="text-2xl font-bold text-green-600">{paginacao.total || 0}</p>
                <p className="text-sm text-gray-500">registros</p>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico de Movimentações */}
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Movimentações</h3>
            
            {movimentacoes.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma movimentação</h3>
                <p className="text-gray-500">Este produto ainda não possui movimentações registradas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {movimentacoes.map((movimentacao) => (
                  <div key={movimentacao.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getTipoIcon(movimentacao.tipo)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {getTipoLabel(movimentacao.tipo)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {movimentacao.quantidade} {produto.unidadeDeMedida}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(movimentacao.dataMovimentacao)}
                            </span>
                            <span className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {movimentacao.realizadoPorUser?.nome}
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {getMotivoLabel(movimentacao.motivo)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          <div>Anterior: {movimentacao.quantidadeAnterior}</div>
                          <div>Nova: {movimentacao.quantidadeNova}</div>
                        </div>
                      </div>
                    </div>
                    {movimentacao.observacoes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Observações:</span> {movimentacao.observacoes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Paginação */}
            {paginacao.paginas > 1 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Mostrando {movimentacoes.length} de {paginacao.total} movimentações
                  </div>
                  <div className="flex space-x-2">
                    {/* Implementar paginação se necessário */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 