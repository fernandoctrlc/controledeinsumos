'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Package, 
  FileText, 
  User, 
  LogOut, 
  Menu, 
  X,
  Plus,
  Search,
  Bell,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getUser, clearAuthData, authAPI } from '@/lib/api';
import { getProfileLabel } from '@/lib/utils';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [stats, setStats] = useState({
    materiais: 0,
    requisicoes: 0,
    pendentes: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('🔍 Carregando usuário...');
        const userData = getUser();
        console.log('📋 Dados do usuário:', userData);
        
        if (!userData) {
          console.log('❌ Usuário não encontrado, redirecionando para login');
          router.push('/login');
          return;
        }

        console.log('✅ Usuário carregado:', userData.nome);
        setUser(userData);
        
        // Carregar estatísticas baseadas no perfil
        await loadStats(userData.perfil);
      } catch (error) {
        console.error('❌ Erro ao carregar usuário:', error);
        toast.error('Erro ao carregar dados do usuário');
        router.push('/login');
      } finally {
        console.log('🏁 Finalizando carregamento');
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const loadStats = async (perfil) => {
    try {
      console.log('📊 Carregando estatísticas para perfil:', perfil);
      // Aqui você pode carregar estatísticas específicas do perfil
      // Por enquanto, vamos usar dados mockados
      const mockStats = {
        professor: { materiais: 45, requisicoes: 12, pendentes: 3 },
        coordenador: { materiais: 45, requisicoes: 25, pendentes: 8 },
        almoxarife: { materiais: 45, requisicoes: 25, pendentes: 8 },
      };
      
      const statsData = mockStats[perfil] || { materiais: 0, requisicoes: 0, pendentes: 0 };
      console.log('📈 Estatísticas carregadas:', statsData);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      clearAuthData();
      router.push('/login');
      toast.success('Logout realizado com sucesso');
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home, active: true },
    ];

    if (user?.perfil === 'administrador') {
      baseItems.push(
        { name: 'Usuários', href: '/usuarios', icon: User },
        { name: 'Produtos', href: '/produtos', icon: Package },
        { name: 'Requisições', href: '/requisicoes', icon: FileText },
        { name: 'Configurações', href: '/configuracoes', icon: Settings },
      );
    } else if (user?.perfil === 'almoxarife') {
      baseItems.push(
        { name: 'Produtos', href: '/produtos', icon: Package },
        { name: 'Requisições', href: '/requisicoes', icon: FileText },
      );
    } else if (user?.perfil === 'coordenador') {
      baseItems.push(
        { name: 'Produtos', href: '/produtos', icon: Package },
        { name: 'Requisições', href: '/requisicoes', icon: FileText },
      );
    } else if (user?.perfil === 'professor') {
      baseItems.push(
        { name: 'Nova Requisição', href: '/requisicoes/nova', icon: Plus },
        { name: 'Minhas Requisições', href: '/requisicoes', icon: FileText },
      );
    }

    return baseItems;
  };

  const getQuickActions = () => {
    const actions = [];

    if (user?.perfil === 'administrador') {
      actions.push(
        {
          title: 'Gerenciar Usuários',
          description: 'Criar e editar usuários',
          icon: User,
          href: '/usuarios',
          color: 'bg-purple-500',
        },
        {
          title: 'Adicionar Material',
          description: 'Cadastrar novo material',
          icon: Package,
          href: '/materiais/novo',
          color: 'bg-success-500',
        },
        {
          title: 'Ver Requisições',
          description: 'Aprovar ou rejeitar',
          icon: FileText,
          href: '/requisicoes',
          color: 'bg-warning-500',
        },
        {
          title: 'Configurações',
          description: 'Configurar sistema',
          icon: Settings,
          href: '/configuracoes',
          color: 'bg-gray-500',
        }
      );
    } else if (user?.perfil === 'professor') {
      actions.push({
        title: 'Nova Requisição',
        description: 'Solicitar materiais',
        icon: Plus,
        href: '/requisicoes/nova',
        color: 'bg-primary-500',
      });
    }

    if (user?.perfil === 'almoxarife') {
      actions.push(
        {
          title: 'Gerenciar Produtos',
          description: 'Cadastrar e controlar produtos',
          icon: Package,
          href: '/produtos',
          color: 'bg-success-500',
        },
        {
          title: 'Ver Requisições',
          description: 'Aprovar ou rejeitar',
          icon: FileText,
          href: '/requisicoes',
          color: 'bg-warning-500',
        }
      );
    }

    if (user?.perfil === 'coordenador') {
      actions.push(
        {
          title: 'Gerenciar Produtos',
          description: 'Cadastrar e controlar produtos',
          icon: Package,
          href: '/produtos',
          color: 'bg-success-500',
        },
        {
          title: 'Requisições Pendentes',
          description: 'Aprovar ou rejeitar',
          icon: FileText,
          href: '/requisicoes',
          color: 'bg-warning-500',
        }
      );
    }

    return actions;
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
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center">
                <div className="text-2xl mr-3">📚</div>
                <h1 className="text-xl font-semibold text-gray-900">Almoxarifado Escolar</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-5 h-5" />
              </button>
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.nome}</p>
                  <p className="text-xs text-gray-500">{getProfileLabel(user.perfil)}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 lg:pb-0 lg:bg-white lg:border-r lg:border-gray-200">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {getMenuItems().map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowMobileMenu(false)}></div>
            <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
              <div className="flex-1 flex flex-col pt-16 pb-4 overflow-y-auto">
                <nav className="flex-1 px-4 py-6 space-y-2">
                  {getMenuItems().map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        item.active
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </a>
                  ))}
                </nav>
                <div className="px-4 py-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{user.nome}</p>
                      <p className="text-xs text-gray-500">{getProfileLabel(user.perfil)}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="lg:pl-64 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bem-vindo, {user.nome}!
              </h2>
              <p className="text-gray-600">
                Aqui você pode gerenciar o almoxarifado escolar de forma eficiente.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Package className="w-8 h-8 text-primary-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total de Materiais</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.materiais}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="w-8 h-8 text-warning-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Requisições</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.requisicoes}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Bell className="w-8 h-8 text-danger-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Pendentes</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.pendentes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getQuickActions().map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    className="card hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="card-body">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{action.title}</p>
                          <p className="text-sm text-gray-500">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
              <div className="card">
                <div className="card-body">
                  <p className="text-gray-500 text-center py-8">
                    Nenhuma atividade recente para exibir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="mobile-nav safe-area-inset-bottom">
        <div className="flex justify-around">
          {getMenuItems().map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`mobile-nav-item ${item.active ? 'active' : ''}`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span>{item.name}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
} 