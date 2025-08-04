'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Package,
  User,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getUser, clearAuthData, authAPI, requisitionsAPI } from '@/lib/api';
import { getProfileLabel } from '@/lib/utils';

export default function RequisicoesPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requisicoes, setRequisicoes] = useState([]);
  const [filtros, setFiltros] = useState({
    status: '',
    prioridade: '',
    search: ''
  });
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = getUser();
        if (!userData) {
          router.push('/login');
          return;
        }

        setUser(userData);
        await loadRequisicoes();
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        toast.error('Erro ao carregar dados do usuário');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const loadRequisicoes = async () => {
    try {
      const response = await requisitionsAPI.listar(filtros);
      setRequisicoes(response.requisicoes || []);
    } catch (error) {
      console.error('Erro ao carregar requisições:', error);
      toast.error('Erro ao carregar requisições');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovada': return 'text-green-600 bg-green-100';
      case 'rejeitada': return 'text-red-600 bg-red-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'urgente': return 'text-red-600 bg-red-100';
      case 'alta': return 'text-orange-600 bg-orange-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'baixa': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'aprovada': return <CheckCircle className="w-4 h-4" />;
      case 'rejeitada': return <XCircle className="w-4 h-4" />;
      case 'pendente': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-2"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Requisições</h1>
            </div>

            {user.perfil === 'professor' && (
              <button
                onClick={() => router.push('/requisicoes/nova')}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Requisição
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por material..."
                    className="input pl-10"
                    value={filtros.search}
                    onChange={(e) => setFiltros({...filtros, search: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="input"
                  value={filtros.status}
                  onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                >
                  <option value="">Todos</option>
                  <option value="pendente">Pendente</option>
                  <option value="aprovada">Aprovada</option>
                  <option value="rejeitada">Rejeitada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <select
                  className="input"
                  value={filtros.prioridade}
                  onChange={(e) => setFiltros({...filtros, prioridade: e.target.value})}
                >
                  <option value="">Todas</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={loadRequisicoes}
                  className="btn btn-primary w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Requisições */}
        <div className="card">
          <div className="card-body">
            {requisicoes.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma requisição encontrada
                </h3>
                <p className="text-gray-500 mb-4">
                  {user.perfil === 'professor' 
                    ? 'Você ainda não fez nenhuma requisição.'
                    : 'Não há requisições para exibir.'
                  }
                </p>
                {user.perfil === 'professor' && (
                  <button
                    onClick={() => router.push('/requisicoes/nova')}
                    className="btn btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Fazer Primeira Requisição
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Material
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prioridade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Necessidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requisicoes.map((requisicao) => (
                      <tr key={requisicao.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Package className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {requisicao.materialObj?.nome || 'Material não encontrado'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {requisicao.justificativa}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {requisicao.quantidade} {requisicao.materialObj?.unidadeDeMedida}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(requisicao.status)}`}>
                            {getStatusIcon(requisicao.status)}
                            <span className="ml-1 capitalize">{requisicao.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadeColor(requisicao.prioridade)}`}>
                            {requisicao.prioridade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(requisicao.dataNecessidade)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => router.push(`/requisicoes/${requisicao.id}`)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 