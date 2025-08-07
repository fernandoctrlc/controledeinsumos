import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Função para combinar classes CSS
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Formatação de data
export function formatDate(date) {
  if (!date) return '-';
  
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Formatação de data e hora
export function formatDateTime(date) {
  if (!date) return '-';
  
  const d = new Date(date);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Formatação de quantidade
export function formatQuantity(quantity, unit) {
  if (quantity === null || quantity === undefined) return '-';
  
  // Converter para número e remover casas decimais desnecessárias
  const numQuantity = parseInt(quantity);
  
  const formattedQuantity = numQuantity.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return `${formattedQuantity} ${unit || ''}`.trim();
}

// Formatação de status
export function getStatusBadge(status) {
  const statusConfig = {
    pendente: {
      label: 'Pendente',
      className: 'badge-warning',
      icon: '⏳',
    },
    aprovada: {
      label: 'Aprovada',
      className: 'badge-success',
      icon: '✅',
    },
    rejeitada: {
      label: 'Rejeitada',
      className: 'badge-danger',
      icon: '❌',
    },
  };

  const config = statusConfig[status] || {
    label: status,
    className: 'badge-info',
    icon: '❓',
  };

  return {
    ...config,
    status,
  };
}

// Formatação de prioridade
export function getPriorityBadge(priority) {
  const priorityConfig = {
    baixa: {
      label: 'Baixa',
      className: 'badge-info',
      icon: '🔵',
    },
    media: {
      label: 'Média',
      className: 'badge-warning',
      icon: '🟡',
    },
    alta: {
      label: 'Alta',
      className: 'badge-danger',
      icon: '🔴',
    },
    urgente: {
      label: 'Urgente',
      className: 'badge-danger',
      icon: '🚨',
    },
  };

  const config = priorityConfig[priority] || {
    label: priority,
    className: 'badge-info',
    icon: '❓',
  };

  return {
    ...config,
    priority,
  };
}

// Formatação de perfil
export function getProfileLabel(profile) {
  const profileLabels = {
    professor: 'Professor',
    coordenador: 'Coordenador',
    almoxarife: 'Almoxarife',
    administrador: 'Administrador',
  };

  return profileLabels[profile] || profile;
}

// Validação de email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de senha
export function isValidPassword(password) {
  return password && password.length >= 6;
}

// Validação de CPF (formato básico)
export function isValidCPF(cpf) {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return cpfRegex.test(cpf);
}

// Formatação de CPF
export function formatCPF(cpf) {
  if (!cpf) return '';
  
  // Remove tudo que não é dígito
  const numbers = cpf.replace(/\D/g, '');
  
  // Aplica a máscara
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para debounce
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Função para throttle
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Função para gerar ID único
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Função para capitalizar primeira letra
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Função para truncar texto
export function truncate(text, length = 50) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Função para formatar moeda
export function formatCurrency(value) {
  if (value === null || value === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Função para verificar se é mobile
export function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

// Função para verificar se é tablet
export function isTablet() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

// Função para verificar se é desktop
export function isDesktop() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}

// Função para obter dimensões da tela
export function getScreenSize() {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

// Função para copiar texto para clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erro ao copiar para clipboard:', err);
    return false;
  }
}

// Função para download de arquivo
export function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Função para abrir em nova aba
export function openInNewTab(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Função para scroll suave
export function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

// Função para scroll para topo
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
} 