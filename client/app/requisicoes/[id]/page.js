'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft,
  Package,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getUser, requisitionsAPI } from '@/lib/api';
import BackToDashboard from '@/components/BackToDashboard';

export default function DetalhesRequisicaoPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requisicao, setRequisicao] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const requisicaoId = params.id;

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = getUser();
        if (!userData) {
          router.push('/login');
          return;
        }

        setUser(userData);
        await loadRequisicao();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados da requisição');
        router.push('/requisicoes');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router, requisicaoId]);

  const loadRequisicao = async () => {
    try {
      const response = await requisitionsAPI.buscar(requisicaoId);
      setRequisicao(response.requisicao);
    } catch (error) {
      console.error('Erro ao carregar requisição:', error);
      toast.error('Requisição não encontrada');
      router.push('/requisicoes');
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
      case 'aprovada': return <CheckCircle className="w-5 h-5" />;
      case 'rejeitada': return <XCircle className="w-5 h-5" />;
      case 'pendente': return <Clock className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEdit = () => {
    if (!user || !requisicao) return false;
    return user.perfil === 'professor' && requisicao.status === 'pendente';
  };

  const canApprove = () => {
    if (!user || !requisicao) return false;
    return (user.perfil === 'coordenador' || user.perfil === 'almoxarife') && requisicao.status === 'pendente';
  };

  const handleAprovar = async () => {
    if (!confirm('Tem certeza que deseja aprovar esta requisição?')) return;
    
    setIsSubmitting(true);
    try {
      await requisitionsAPI.aprovar(requisicaoId);
      toast.success('Requisição aprovada com sucesso!');
      await loadRequisicao();
    } catch (error) {
      console.error('Erro ao aprovar requisição:', error);
      toast.error('Erro ao aprovar requisição');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejeitar = async () => {
    const motivo = prompt('Digite o motivo da rejeição:');
    if (!motivo) return;
    
    setIsSubmitting(true);
    try {
      await requisitionsAPI.rejeitar(requisicaoId, motivo);
      toast.success('Requisição rejeitada com sucesso!');
      await loadRequisicao();
    } catch (error) {
      console.error('Erro ao rejeitar requisição:', error);
      toast.error('Erro ao rejeitar requisição');
    } finally {
      setIsSubmitting(false);
    }
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

  if (!user || !requisicao) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BackToDashboard className="mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Requisição #{requisicao.id}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              {canEdit() && (
                <button
                  onClick={() => router.push(`/requisicoes/${requisicaoId}/editar`)}
                  className="btn btn-secondary"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </button>
              )}
              
              {canApprove() && (
                <>
                  <button
                    onClick={handleAprovar}
                    disabled={isSubmitting}
                    className="btn btn-success"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Aprovando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprovar
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleRejeitar}
                    disabled={isSubmitting}
                    className="btn btn-danger"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeitar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações Principais */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {requisicao.materialObj?.nome || 'Material não encontrado'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(requisicao.status)}`}>
                      {getStatusIcon(requisicao.status)}
                      <span className="ml-1 capitalize">{requisicao.status}</span>
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPrioridadeColor(requisicao.prioridade)}`}>
                      {requisicao.prioridade}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes da Requisição</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Quantidade</dt>
                        <dd className="text-sm text-gray-900">
                          {requisicao.quantidade} {requisicao.materialObj?.unidadeDeMedida}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Justificativa</dt>
                        <dd className="text-sm text-gray-900">{requisicao.justificativa}</dd>
                      </div>
                      {requisicao.observacoes && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Observações</dt>
                          <dd className="text-sm text-gray-900">{requisicao.observacoes}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Data de Necessidade</dt>
                        <dd className="text-sm text-gray-900">{formatDate(requisicao.dataNecessidade)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Sistema</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Solicitante</dt>
                        <dd className="text-sm text-gray-900">{requisicao.solicitanteUser?.nome}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Data de Criação</dt>
                        <dd className="text-sm text-gray-900">{formatDate(requisicao.createdAt)}</dd>
                      </div>
                      {requisicao.aprovadoPorUser && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Aprovado por</dt>
                          <dd className="text-sm text-gray-900">{requisicao.aprovadoPorUser.nome}</dd>
                        </div>
                      )}
                      {requisicao.dataAprovacao && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Data de Aprovação</dt>
                          <dd className="text-sm text-gray-900">{formatDate(requisicao.dataAprovacao)}</dd>
                        </div>
                      )}
                      {requisicao.motivoRejeicao && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Motivo da Rejeição</dt>
                          <dd className="text-sm text-red-600">{requisicao.motivoRejeicao}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ações</h3>
                
                <div className="space-y-3">
                  {canEdit() && (
                    <button
                      onClick={() => router.push(`/requisicoes/${requisicaoId}/editar`)}
                      className="w-full btn btn-primary"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Requisição
                    </button>
                  )}
                  
                  {canApprove() && (
                    <>
                      <button
                        onClick={handleAprovar}
                        disabled={isSubmitting}
                        className="w-full btn btn-success"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprovar Requisição
                      </button>
                      
                      <button
                        onClick={handleRejeitar}
                        disabled={isSubmitting}
                        className="w-full btn btn-danger"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeitar Requisição
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => router.push('/requisicoes')}
                    className="w-full btn btn-secondary"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar à Lista
                  </button>
                </div>

                {requisicao.status === 'pendente' && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                      <div className="text-sm text-yellow-700">
                        <p className="font-medium">Requisição Pendente</p>
                        <p className="mt-1">Aguardando aprovação do coordenador ou almoxarife.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 