'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Package,
  Save,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getUser, materialsAPI } from '@/lib/api';
import BackToDashboard from '@/components/BackToDashboard';

export default function NovoMaterialPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    unidadeDeMedida: 'unidade',
    quantidade: '',
    quantidadeMinima: '',
    descricao: '',
    categoria: ''
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

        if (userData.perfil !== 'almoxarife') {
          toast.error('Acesso negado. Apenas almoxarifes podem cadastrar materiais.');
          router.push('/dashboard');
          return;
        }

        setUser(userData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await materialsAPI.criar(formData);
      toast.success('Material cadastrado com sucesso!');
      router.push('/materiais');
    } catch (error) {
      console.error('Erro ao cadastrar material:', error);
      toast.error('Erro ao cadastrar material');
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
              <h1 className="text-xl font-semibold text-gray-900">Novo Material</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Material *
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="input pl-10"
                    placeholder="Ex: Papel A4"
                    required
                  />
                </div>
              </div>

              {/* Unidade de Medida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidade de Medida *
                </label>
                <select
                  name="unidadeDeMedida"
                  value={formData.unidadeDeMedida}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="unidade">Unidade</option>
                  <option value="kg">Quilograma (kg)</option>
                  <option value="g">Grama (g)</option>
                  <option value="l">Litro (l)</option>
                  <option value="ml">Mililitro (ml)</option>
                  <option value="m">Metro (m)</option>
                  <option value="cm">Centímetro (cm)</option>
                  <option value="caixa">Caixa</option>
                  <option value="pacote">Pacote</option>
                  <option value="rolo">Rolo</option>
                  <option value="folha">Folha</option>
                </select>
              </div>

              {/* Quantidade Inicial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade Inicial *
                </label>
                <input
                  type="number"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleInputChange}
                  className="input"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  required
                />
              </div>

              {/* Quantidade Mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade Mínima *
                </label>
                <input
                  type="number"
                  name="quantidadeMinima"
                  value={formData.quantidadeMinima}
                  onChange={handleInputChange}
                  className="input"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  required
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="papelaria">Papelaria</option>
                  <option value="limpeza">Limpeza</option>
                  <option value="tecnologia">Tecnologia</option>
                  <option value="esportes">Esportes</option>
                  <option value="artesanato">Artesanato</option>
                  <option value="laboratorio">Laboratório</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  placeholder="Descrição detalhada do material..."
                />
              </div>

              {/* Alertas */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-blue-400 mr-2" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Dicas:</p>
                    <ul className="mt-1 list-disc list-inside">
                      <li>Use nomes descritivos para facilitar a busca</li>
                      <li>Defina uma quantidade mínima adequada para evitar falta</li>
                      <li>Categorize corretamente para melhor organização</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/materiais')}
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
                      Cadastrar Material
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