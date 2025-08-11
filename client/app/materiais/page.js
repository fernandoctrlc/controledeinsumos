'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  Package,
  AlertTriangle,
  ArrowLeft,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getUser, materialsAPI } from '@/lib/api';
import BackToDashboard from '@/components/BackToDashboard';

export default function MateriaisPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [materiais, setMateriais] = useState([]);
  const [filtros, setFiltros] = useState({
    search: '',
    categoria: '',
    estoqueBaixo: false
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
        await loadMateriais();
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

  const loadMateriais = async () => {
    try {
      const response = await materialsAPI.listar(filtros);
      setMateriais(response.materiais || []);
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
      toast.error('Erro ao carregar materiais');
    }
  };

  const isEstoqueBaixo = (material) => {
    return material.quantidade <= material.quantidadeMinima;
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
              <BackToDashboard className="mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Materiais</h1>
            </div>

            {user.perfil === 'almoxarife' && (
              <button
                onClick={() => router.push('/materiais/novo')}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Material
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome..."
                    className="input pl-10"
                    value={filtros.search}
                    onChange={(e) => setFiltros({...filtros, search: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  className="input"
                  value={filtros.categoria}
                  onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
                >
                  <option value="">Todas</option>
                  <option value="papelaria">Papelaria</option>
                  <option value="limpeza">Limpeza</option>
                  <option value="tecnologia">Tecnologia</option>
                  <option value="esportes">Esportes</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={loadMateriais}
                  className="btn btn-primary w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Materiais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materiais.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum material encontrado
              </h3>
              <p className="text-gray-500">
                Não há materiais cadastrados no sistema.
              </p>
            </div>
          ) : (
            materiais.map((material) => (
              <div key={material.id} className="card hover:shadow-md transition-shadow">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Package className="w-8 h-8 text-primary-500 mr-3" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {material.nome}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {material.categoria}
                        </p>
                      </div>
                    </div>
                    {isEstoqueBaixo(material) && (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Estoque:</span>
                      <span className={`text-sm font-medium ${
                        isEstoqueBaixo(material) ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {material.quantidade} {material.unidadeDeMedida}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Mínimo:</span>
                      <span className="text-sm text-gray-900">
                        {material.quantidadeMinima} {material.unidadeDeMedida}
                      </span>
                    </div>
                  </div>

                  {material.descricao && (
                    <p className="text-sm text-gray-600 mb-4">
                      {material.descricao}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Criado por: {material.criadoPorUser?.nome || 'N/A'}
                    </span>
                    <button
                      onClick={() => router.push(`/materiais/${material.id}`)}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 