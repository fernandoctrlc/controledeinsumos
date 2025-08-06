'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { materialsAPI, getUser } from '@/lib/api';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
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
    loadProdutos();
  }, [router]);

  const loadProdutos = async () => {
    try {
      setIsLoading(true);
      const response = await materialsAPI.listar();
      setProdutos(response.materiais || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await materialsAPI.deletar(id);
      toast.success('Produto excluído com sucesso');
      loadProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const getStatusColor = (quantidade, quantidadeMinima) => {
    if (quantidade <= 0) return 'text-red-600 bg-red-100';
    if (quantidade <= quantidadeMinima) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusText = (quantidade, quantidadeMinima) => {
    if (quantidade <= 0) return 'Sem estoque';
    if (quantidade <= quantidadeMinima) return 'Estoque baixo';
    return 'Em estoque';
  };

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
              <p className="text-gray-600">Gerencie o cadastro de produtos e controle de estoque</p>
            </div>
            <button
              onClick={() => router.push('/produtos/novo')}
              className="btn btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Produto
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full max-w-md"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProdutos.map((produto) => (
            <div key={produto.id} className="card hover:shadow-lg transition-shadow">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {produto.nome}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{produto.categoria}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(produto.quantidade, produto.quantidadeMinima)}`}>
                        {getStatusText(produto.quantidade, produto.quantidadeMinima)}
                      </span>
                      {produto.quantidade <= produto.quantidadeMinima && (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/produtos/${produto.id}`)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/produtos/${produto.id}/editar`)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(produto.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Quantidade:</span>
                    <span className="font-medium">{produto.quantidade}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Mínimo:</span>
                    <span className="font-medium">{produto.quantidadeMinima}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Unidade:</span>
                    <span className="font-medium">{produto.unidadeDeMedida}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/produtos/${produto.id}/estoque`)}
                      className="btn btn-sm btn-outline flex-1 flex items-center justify-center"
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Estoque
                    </button>
                    <button
                      onClick={() => router.push(`/produtos/${produto.id}/ajuste`)}
                      className="btn btn-sm btn-outline flex-1 flex items-center justify-center"
                    >
                      <TrendingDown className="w-4 h-4 mr-1" />
                      Ajuste
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProdutos.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Tente ajustar os termos de busca'
                : 'Comece cadastrando o primeiro produto'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => router.push('/produtos/novo')}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Cadastrar Produto
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 