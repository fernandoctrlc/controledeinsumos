'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  User,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getUser, departamentosAPI } from '@/lib/api';
import BackToDashboard from '@/components/BackToDashboard';

export default function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

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
    loadDepartamentos();
  }, [router]);

  const loadDepartamentos = async () => {
    try {
      setIsLoading(true);
      const response = await departamentosAPI.listar();
      setDepartamentos(response.departamentos || []);
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
      toast.error('Erro ao carregar departamentos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja desativar este departamento?')) return;

    try {
      await departamentosAPI.deletar(id);
      toast.success('Departamento desativado com sucesso');
      loadDepartamentos();
    } catch (error) {
      console.error('Erro ao desativar departamento:', error);
      toast.error('Erro ao desativar departamento');
    }
  };

  const getStatusColor = (ativo) => {
    return ativo ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getStatusText = (ativo) => {
    return ativo ? 'Ativo' : 'Inativo';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredDepartamentos = departamentos.filter(departamento =>
    departamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    departamento.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
    departamento.responsavel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando departamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departamentos</h1>
              <p className="text-gray-600">Gerencie os departamentos da escola</p>
            </div>
            {user?.perfil === 'coordenador' && (
              <div className="flex items-center space-x-3">
                <BackToDashboard />
                <button
                  onClick={() => router.push('/departamentos/novo')}
                  className="btn btn-primary flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Novo Departamento
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar departamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full max-w-md"
            />
          </div>
        </div>

        {/* Departamentos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartamentos.map((departamento) => (
            <div key={departamento.id} className="card hover:shadow-lg transition-shadow">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Building2 className="w-5 h-5 text-primary-500 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {departamento.nome}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                        {departamento.sigla}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(departamento.ativo)}`}>
                        {getStatusText(departamento.ativo)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/departamentos/${departamento.id}`)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {user?.perfil === 'coordenador' && (
                      <>
                        <button
                          onClick={() => router.push(`/departamentos/${departamento.id}/editar`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(departamento.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {departamento.descricao && (
                    <p className="text-sm text-gray-600">{departamento.descricao}</p>
                  )}
                  
                  <div className="space-y-2">
                    {departamento.responsavel && (
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{departamento.responsavel}</span>
                      </div>
                    )}
                    
                    {departamento.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{departamento.email}</span>
                      </div>
                    )}
                    
                    {departamento.telefone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{departamento.telefone}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Criado por: {departamento.criadoPorUser?.nome}</span>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(departamento.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDepartamentos.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum departamento encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Tente ajustar os termos de busca.' : 'Comece criando o primeiro departamento.'}
            </p>
            {user?.perfil === 'coordenador' && !searchTerm && (
              <button
                onClick={() => router.push('/departamentos/novo')}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Departamento
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 