const express = require('express');
const { Op } = require('sequelize');
const Movimentacao = require('../models/Movimentacao');
const Material = require('../models/Material');
const User = require('../models/User');
const { auth, almoxarife } = require('../middleware/auth');

const router = express.Router();

// GET /api/movimentacoes/material/:id - Histórico de movimentações de um material
router.get('/material/:id', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const materialId = req.params.id;

    // Verificar se o material existe
    const material = await Material.findByPk(materialId);
    if (!material) {
      return res.status(404).json({
        error: 'Material não encontrado'
      });
    }

    const resultado = await Movimentacao.historicoMaterial(materialId, { page, limit });

    res.json(resultado);

  } catch (error) {
    console.error('Erro ao buscar histórico de movimentações:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/movimentacoes - Listar todas as movimentações (apenas almoxarife)
router.get('/', auth, almoxarife, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      materialId = '',
      tipo = '',
      motivo = '',
      dataInicio = '',
      dataFim = ''
    } = req.query;

    const whereClause = {};
    
    // Filtro por material
    if (materialId) {
      whereClause.materialId = materialId;
    }
    
    // Filtro por tipo
    if (tipo) {
      whereClause.tipo = tipo;
    }
    
    // Filtro por motivo
    if (motivo) {
      whereClause.motivo = motivo;
    }
    
    // Filtro por data
    if (dataInicio || dataFim) {
      whereClause.dataMovimentacao = {};
      if (dataInicio) {
        whereClause.dataMovimentacao[Op.gte] = new Date(dataInicio);
      }
      if (dataFim) {
        whereClause.dataMovimentacao[Op.lte] = new Date(dataFim);
      }
    }

    const offset = (page - 1) * limit;
    
    const { count, rows: movimentacoes } = await Movimentacao.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: Material, 
          as: 'material', 
          attributes: ['nome', 'unidadeDeMedida'] 
        },
        { 
          model: User, 
          as: 'realizadoPorUser', 
          attributes: ['nome', 'email'] 
        }
      ],
      order: [['dataMovimentacao', 'DESC']],
      offset: offset,
      limit: parseInt(limit)
    });

    const total = count;

    res.json({
      movimentacoes,
      paginacao: {
        pagina: parseInt(page),
        limite: parseInt(limit),
        total,
        paginas: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar movimentações:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/movimentacoes - Criar movimentação (apenas almoxarife)
router.post('/', auth, almoxarife, async (req, res) => {
  try {
    const { 
      materialId, 
      tipo, 
      quantidade, 
      motivo, 
      observacoes 
    } = req.body;

    // Validações básicas
    if (!materialId || !tipo || !quantidade || !motivo) {
      return res.status(400).json({
        error: 'Material, tipo, quantidade e motivo são obrigatórios'
      });
    }

    // Verificar se o material existe
    const material = await Material.findByPk(materialId);
    if (!material) {
      return res.status(404).json({
        error: 'Material não encontrado'
      });
    }

    // Validar quantidade para saída
    if (tipo === 'saida' && parseInt(quantidade) > parseInt(material.quantidade)) {
      return res.status(400).json({
        error: 'Quantidade insuficiente em estoque'
      });
    }

    const quantidadeAnterior = parseInt(material.quantidade);
    let quantidadeNova;

    // Calcular nova quantidade
    if (tipo === 'entrada') {
      quantidadeNova = parseInt(material.quantidade) + parseInt(quantidade);
    } else if (tipo === 'saida') {
      quantidadeNova = parseInt(material.quantidade) - parseInt(quantidade);
    } else { // ajuste
      quantidadeNova = parseInt(quantidade);
    }

    // Atualizar quantidade do material
    material.quantidade = quantidadeNova;
    await material.save();

    // Criar movimentação
    const movimentacao = await Movimentacao.criarMovimentacao({
      materialId,
      tipo,
      quantidade: parseInt(quantidade),
      quantidadeAnterior: parseInt(material.quantidade),
      quantidadeNova,
      motivo,
      observacoes,
      realizadoPor: req.user.id
    });

    // Buscar movimentação com relacionamentos
    const movimentacaoCompleta = await Movimentacao.findByPk(movimentacao.id, {
      include: [
        { 
          model: Material, 
          as: 'material', 
          attributes: ['nome', 'unidadeDeMedida'] 
        },
        { 
          model: User, 
          as: 'realizadoPorUser', 
          attributes: ['nome'] 
        }
      ]
    });

    res.status(201).json({
      message: 'Movimentação registrada com sucesso',
      movimentacao: movimentacaoCompleta,
      material: {
        id: material.id,
        nome: material.nome,
        quantidade: material.quantidade,
        unidadeDeMedida: material.unidadeDeMedida
      }
    });

  } catch (error) {
    console.error('Erro ao criar movimentação:', error);
    
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Dados inválidos',
        detalhes: erros
      });
    }

    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/movimentacoes/estatisticas - Estatísticas de movimentações
router.get('/estatisticas', auth, almoxarife, async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    
    const whereClause = {};
    
    // Filtro por data
    if (dataInicio || dataFim) {
      whereClause.dataMovimentacao = {};
      if (dataInicio) {
        whereClause.dataMovimentacao[Op.gte] = new Date(dataInicio);
      }
      if (dataFim) {
        whereClause.dataMovimentacao[Op.lte] = new Date(dataFim);
      }
    }

    // Total de movimentações
    const totalMovimentacoes = await Movimentacao.count({ where: whereClause });

    // Movimentações por tipo
    const porTipo = await Movimentacao.findAll({
      where: whereClause,
      attributes: [
        'tipo',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('quantidade')), 'totalQuantidade']
      ],
      group: ['tipo']
    });

    // Movimentações por motivo
    const porMotivo = await Movimentacao.findAll({
      where: whereClause,
      attributes: [
        'motivo',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['motivo']
    });

    // Top materiais mais movimentados
    const topMateriais = await Movimentacao.findAll({
      where: whereClause,
      include: [
        { 
          model: Material, 
          as: 'material', 
          attributes: ['nome', 'unidadeDeMedida'] 
        }
      ],
      attributes: [
        'materialId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('quantidade')), 'totalQuantidade']
      ],
      group: ['materialId'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10
    });

    res.json({
      estatisticas: {
        total: totalMovimentacoes,
        porTipo,
        porMotivo,
        topMateriais
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 