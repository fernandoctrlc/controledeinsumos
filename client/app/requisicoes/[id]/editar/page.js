'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft,
  Package,
  Calendar,
  AlertCircle,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getUser, materialsAPI, requisitionsAPI } from '@/lib/api';
import BackToDashboard from '@/components/BackToDashboard';

export default function EditarRequisicaoPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [materiais, setMateriais] = useState([]);
  const [requisicao, setRequisicao] = useState(null);
  const [formData, setFormData] = useState({
    material: '',
    quantidade: '',
    justificativa: '',
    observacoes: '',
    prioridade: 'media',
    dataNecessidade: ''
  });
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
        await Promise.all([
          loadMateriais(),
          loadRequisicao()
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
        router.push('/requisicoes');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router, requisicaoId]);

  const loadMateriais = async () => {
    try {
      const response = await materialsAPI.listar({ ativo: true });
      setMateriais(response.materiais || []);
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
      toast.error('Erro ao carregar materiais');
    }
  };

  const loadRequisicao = async () => {
    try {
      const response = await requisitionsAPI.buscar(requisicaoId);
      const req = response.requisicao;
      
      // Verificar se o usuário pode editar esta requisição
      if (req.solicitante !== user?.id || req.status !== 'pendente') {
        toast.error('Você não pode editar esta requisição');
        router.push('/requisicoes');
        return;
      }

      setRequisicao(req);
      setFormData({
        material: req.material.toString(),
        quantidade: req.quantidade.toString(),
        justificativa: req.justificativa,
        observacoes: req.observacoes || '',
        prioridade: req.prioridade,
        dataNecessidade: req.dataNecessidade.split('T')[0] // Formato YYYY-MM-DD
      });
    } catch (error) {
      console.error('Erro ao carregar requisição:', error);
      toast.error('Requisição não encontrada');
      router.push('/requisicoes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await requisitionsAPI.atualizar(requisicaoId, formData);
      toast.success('Requisição atualizada com sucesso!');
      router.push(`/requisicoes/${requisicaoId}`);
    } catch (error) {
      console.error('Erro ao atualizar requisição:', error);
      toast.error('Erro ao atualizar requisição');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              <h1 className="text-xl font-semibold text-gray-900">Editar Requisição #{requisicaoId}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Material */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material *
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="input pl-10"
                    required
                  >
                    <option value="">Selecione um material</option>
                    {materiais.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.nome} - Estoque: {material.quantidade} {material.unidadeDeMedida}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade *
                </label>
                <input
                  type="number"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleInputChange}
                  className="input"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              {/* Justificativa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justificativa *
                </label>
                <textarea
                  name="justificativa"
                  value={formData.justificativa}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  placeholder="Explique o motivo da requisição..."
                  required
                />
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  placeholder="Informações adicionais (opcional)..."
                />
              </div>

              {/* Prioridade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade *
                </label>
                <select
                  name="prioridade"
                  value={formData.prioridade}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              {/* Data de Necessidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Necessidade *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    name="dataNecessidade"
                    value={formData.dataNecessidade}
                    onChange={handleInputChange}
                    className="input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Alertas */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-blue-400 mr-2" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Importante:</p>
                    <ul className="mt-1 list-disc list-inside">
                      <li>Apenas requisições pendentes podem ser editadas</li>
                      <li>Alterar a prioridade pode afetar o tempo de aprovação</li>
                      <li>Verifique a disponibilidade do material antes de solicitar</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push(`/requisicoes/${requisicaoId}`)}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
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