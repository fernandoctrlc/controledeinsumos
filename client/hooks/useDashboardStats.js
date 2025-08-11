'use client';

import { useState, useEffect } from 'react';
import { materialsAPI, requisitionsAPI } from '@/lib/api';

export function useDashboardStats(user) {
  const [stats, setStats] = useState({
    materiais: 0,
    requisicoes: 0,
    pendentes: 0,
    aprovadas: 0,
    rejeitadas: 0,
    estoqueBaixo: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Carregar estatísticas de materiais
      const materiaisResponse = await materialsAPI.listar({ limit: 1000 });
      const totalMateriais = materiaisResponse.materiais?.length || 0;
      
      // Contar materiais com estoque baixo
      const estoqueBaixo = materiaisResponse.materiais?.filter(
        material => parseInt(material.quantidade) <= parseInt(material.quantidadeMinima)
      ).length || 0;

      // Carregar estatísticas de requisições
      const requisicoesResponse = await requisitionsAPI.estatisticas();
      const requisicoesStats = requisicoesResponse.estatisticas || {};

      setStats({
        materiais: totalMateriais,
        requisicoes: requisicoesStats.total || 0,
        pendentes: requisicoesStats.pendentes || 0,
        aprovadas: requisicoesStats.aprovadas || 0,
        rejeitadas: requisicoesStats.rejeitadas || 0,
        estoqueBaixo
      });

    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setError('Erro ao carregar estatísticas');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar estatísticas quando o usuário mudar
  useEffect(() => {
    loadStats();
  }, [user]);

  // Função para atualizar estatísticas manualmente
  const refreshStats = () => {
    loadStats();
  };

  return {
    stats,
    isLoading,
    error,
    refreshStats
  };
} 