import axios from 'axios';

// Detectar automaticamente o ambiente e definir a URL da API
const getApiBaseUrl = () => {
  // Se a variável de ambiente estiver definida, usar ela
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Se estiver em produção (não localhost), usar o domínio
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `https://${window.location.hostname}/api`;
  }
  
  // Em desenvolvimento, usar localhost
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funções de autenticação
export const authAPI = {
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  },

  registro: async (userData) => {
    const response = await api.post('/auth/registro', userData);
    return response.data;
  },

  perfil: async () => {
    const response = await api.get('/auth/perfil');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  alterarSenha: async (senhaAtual, novaSenha) => {
    const response = await api.post('/auth/alterar-senha', { senhaAtual, novaSenha });
    return response.data;
  },
};

// Funções de materiais
export const materialsAPI = {
  listar: async (params = {}) => {
    const response = await api.get('/materials', { params });
    return response.data;
  },

  buscar: async (id) => {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  },

  criar: async (materialData) => {
    const response = await api.post('/materials', materialData);
    return response.data;
  },

  atualizar: async (id, materialData) => {
    const response = await api.put(`/materials/${id}`, materialData);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/materials/${id}`);
    return response.data;
  },

  adicionarEstoque: async (id, quantidade) => {
    const response = await api.post(`/materials/${id}/adicionar-estoque`, { quantidade });
    return response.data;
  },

  estoqueBaixo: async () => {
    const response = await api.get('/materials/estoque/baixo');
    return response.data;
  },

  categorias: async () => {
    const response = await api.get('/materials/categorias');
    return response.data;
  },
};

// Funções de movimentações
export const movimentacoesAPI = {
  listar: async (params = {}) => {
    const response = await api.get('/movimentacoes', { params });
    return response.data;
  },

  historicoMaterial: async (materialId, params = {}) => {
    const response = await api.get(`/movimentacoes/material/${materialId}`, { params });
    return response.data;
  },

  criar: async (movimentacaoData) => {
    const response = await api.post('/movimentacoes', movimentacaoData);
    return response.data;
  },

  estatisticas: async (params = {}) => {
    const response = await api.get('/movimentacoes/estatisticas', { params });
    return response.data;
  },
};

// Funções de requisições
export const requisitionsAPI = {
  listar: async (params = {}) => {
    const response = await api.get('/requisitions', { params });
    return response.data;
  },

  buscar: async (id) => {
    const response = await api.get(`/requisitions/${id}`);
    return response.data;
  },

  criar: async (requisicaoData) => {
    const response = await api.post('/requisitions', requisicaoData);
    return response.data;
  },

  aprovar: async (id) => {
    const response = await api.put(`/requisitions/${id}/aprovar`);
    return response.data;
  },

  rejeitar: async (id, motivoRejeicao) => {
    const response = await api.put(`/requisitions/${id}/rejeitar`, { motivoRejeicao });
    return response.data;
  },

  atualizar: async (id, requisicaoData) => {
    const response = await api.put(`/requisitions/${id}`, requisicaoData);
    return response.data;
  },

  estatisticas: async () => {
    const response = await api.get('/requisitions/estatisticas');
    return response.data;
  },

  pendentes: async (params = {}) => {
    const response = await api.get('/requisitions/pendentes', { params });
    return response.data;
  },
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

// Função para obter dados do usuário
export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Função para salvar dados de autenticação
export const saveAuthData = (token, user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Função para limpar dados de autenticação
export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default api; 