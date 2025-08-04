const express = require('express');
const { Op, sequelize } = require('sequelize');
const Requisicao = require('../models/Requisicao');
const Material = require('../models/Material');
const User = require('../models/User');
const { auth, professor, coordenadorOuAlmoxarife } = require('../middleware/auth');

const router = express.Router();

// GET /api/requisitions/estatisticas - Estatísticas das requisições
router.get('/estatisticas', auth, async (req, res) => {
  try {
    const whereClause = {};
    
    // Filtro por perfil do usuário
    if (req.user.perfil === 'professor') {
      whereClause.solicitante = req.user.id;
    }

    const [pendentes, aprovadas, rejeitadas, total] = await Promise.all([
      Requisicao.count({ where: { ...whereClause, status: 'pendente' } }),
      Requisicao.count({ where: { ...whereClause, status: 'aprovada' } }),
      Requisicao.count({ where: { ...whereClause, status: 'rejeitada' } }),
      Requisicao.count({ where: whereClause })
    ]);

    // Estatísticas por prioridade
    const todasRequisicoes = await Requisicao.findAll({
      where: whereClause,
      attributes: ['prioridade'],
      raw: true
    });

    const porPrioridade = {};
    todasRequisicoes.forEach(req => {
      porPrioridade[req.prioridade] = (porPrioridade[req.prioridade] || 0) + 1;
    });

    res.json({
      estatisticas: {
        pendentes,
        aprovadas,
        rejeitadas,
        total
      },
      porPrioridade
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/requisitions/pendentes - Listar requisições pendentes (coordenador e almoxarife)
router.get('/pendentes', auth, coordenadorOuAlmoxarife, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const requisicoes = await Requisicao.findAll({
      where: { status: 'pendente' },
      include: [
        { 
          model: User, 
          as: 'solicitanteUser', 
          attributes: ['nome', 'email'] 
        },
        { 
          model: Material, 
          as: 'materialObj', 
          attributes: ['nome', 'unidadeDeMedida', 'quantidade'] 
        }
      ],
      order: [['prioridade', 'DESC'], ['createdAt', 'ASC']],
      offset: skip,
      limit: parseInt(limit)
    });

    const total = await Requisicao.count({ where: { status: 'pendente' } });

    res.json({
      requisicoes,
      paginacao: {
        pagina: parseInt(page),
        limite: parseInt(limit),
        total,
        paginas: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar requisições pendentes:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/requisitions - Listar requisições (filtrado por perfil)
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status = '',
      prioridade = '',
      dataInicio = '',
      dataFim = ''
    } = req.query;

    const whereClause = {};
    
    // Filtro por perfil do usuário
    if (req.user.perfil === 'professor') {
      whereClause.solicitante = req.user.id;
    }
    
    // Filtro por status
    if (status) {
      whereClause.status = status;
    }
    
    // Filtro por prioridade
    if (prioridade) {
      whereClause.prioridade = prioridade;
    }
    
    // Filtro por data
    if (dataInicio || dataFim) {
      whereClause.createdAt = {};
      if (dataInicio) {
        whereClause.createdAt[Op.gte] = new Date(dataInicio);
      }
      if (dataFim) {
        whereClause.createdAt[Op.lte] = new Date(dataFim);
      }
    }

    const offset = (page - 1) * limit;
    
    const { count, rows: requisicoes } = await Requisicao.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'solicitanteUser', 
          attributes: ['nome', 'email'] 
        },
        { 
          model: Material, 
          as: 'materialObj', 
          attributes: ['nome', 'unidadeDeMedida'] 
        },
        { 
          model: User, 
          as: 'aprovadoPorUser', 
          attributes: ['nome'] 
        }
      ],
      order: [['createdAt', 'DESC']],
      offset: offset,
      limit: parseInt(limit)
    });

    const total = count;

    res.json({
      requisicoes,
      paginacao: {
        pagina: parseInt(page),
        limite: parseInt(limit),
        total,
        paginas: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar requisições:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/requisitions/:id - Buscar requisição específica
router.get('/:id', auth, async (req, res) => {
  try {
    const requisicao = await Requisicao.findByPk(req.params.id, {
      include: [
        { 
          model: User, 
          as: 'solicitanteUser', 
          attributes: ['nome', 'email'] 
        },
        { 
          model: Material, 
          as: 'materialObj', 
          attributes: ['nome', 'unidadeDeMedida', 'quantidade'] 
        },
        { 
          model: User, 
          as: 'aprovadoPorUser', 
          attributes: ['nome'] 
        }
      ]
    });

    if (!requisicao) {
      return res.status(404).json({
        error: 'Requisição não encontrada'
      });
    }

    // Verificar se o usuário tem permissão para ver esta requisição
    if (req.user.perfil === 'professor' && requisicao.solicitante !== req.user.id) {
      return res.status(403).json({
        error: 'Acesso negado'
      });
    }

    res.json({ requisicao });

  } catch (error) {
    console.error('Erro ao buscar requisição:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/requisitions - Criar requisição (apenas professor)
router.post('/', auth, professor, async (req, res) => {
  try {
    const { 
      material, 
      quantidade, 
      justificativa, 
      observacoes, 
      prioridade = 'media',
      dataNecessidade 
    } = req.body;

    // Validações básicas
    if (!material || !quantidade || !justificativa || !dataNecessidade) {
      return res.status(400).json({
        error: 'Material, quantidade, justificativa e data de necessidade são obrigatórios'
      });
    }

    // Verificar se o material existe e está ativo
    const materialObj = await Material.findByPk(material);
    if (!materialObj || !materialObj.ativo) {
      return res.status(400).json({
        error: 'Material não encontrado ou inativo'
      });
    }

    // Verificar se há estoque suficiente
    if (materialObj.quantidade < quantidade) {
      return res.status(400).json({
        error: 'Quantidade solicitada maior que o estoque disponível',
        estoqueDisponivel: materialObj.quantidade
      });
    }

    const requisicao = await Requisicao.create({
      solicitante: req.user.id,
      material,
      quantidade: parseFloat(quantidade),
      justificativa,
      observacoes,
      prioridade,
      dataNecessidade: new Date(dataNecessidade)
    });

    // Popular dados para retorno
    await requisicao.reload({
      include: [
        { 
          model: User, 
          as: 'solicitanteUser', 
          attributes: ['nome', 'email'] 
        },
        { 
          model: Material, 
          as: 'materialObj', 
          attributes: ['nome', 'unidadeDeMedida'] 
        }
      ]
    });

    res.status(201).json({
      message: 'Requisição criada com sucesso',
      requisicao
    });

  } catch (error) {
    console.error('Erro ao criar requisição:', error);
    
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

// PUT /api/requisitions/:id/aprovar - Aprovar requisição (coordenador e almoxarife)
router.put('/:id/aprovar', auth, coordenadorOuAlmoxarife, async (req, res) => {
  try {
    const requisicao = await Requisicao.findByPk(req.params.id, {
      include: [
        { 
          model: Material, 
          as: 'materialObj'
        }
      ]
    });

    if (!requisicao) {
      return res.status(404).json({
        error: 'Requisição não encontrada'
      });
    }

    if (!requisicao.podeSerAprovada()) {
      return res.status(400).json({
        error: 'Requisição não pode ser aprovada'
      });
    }

    // Verificar se há estoque suficiente
    if (requisicao.materialObj.quantidade < requisicao.quantidade) {
      return res.status(400).json({
        error: 'Estoque insuficiente para aprovar esta requisição',
        estoqueDisponivel: requisicao.materialObj.quantidade,
        quantidadeSolicitada: requisicao.quantidade
      });
    }

    // Aprovar requisição
    await requisicao.aprovar(req.user.id);

    // Deduzir estoque
    await requisicao.materialObj.removerEstoque(requisicao.quantidade);

    // Popular dados para retorno
    await requisicao.reload({
      include: [
        { 
          model: User, 
          as: 'solicitanteUser', 
          attributes: ['nome', 'email'] 
        },
        { 
          model: Material, 
          as: 'materialObj', 
          attributes: ['nome', 'unidadeDeMedida'] 
        },
        { 
          model: User, 
          as: 'aprovadoPorUser', 
          attributes: ['nome'] 
        }
      ]
    });

    res.json({
      message: 'Requisição aprovada com sucesso',
      requisicao
    });

  } catch (error) {
    console.error('Erro ao aprovar requisição:', error);
    
    if (error.message === 'Quantidade insuficiente em estoque') {
      return res.status(400).json({
        error: 'Estoque insuficiente para aprovar esta requisição'
      });
    }

    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// PUT /api/requisitions/:id/rejeitar - Rejeitar requisição (coordenador e almoxarife)
router.put('/:id/rejeitar', auth, coordenadorOuAlmoxarife, async (req, res) => {
  try {
    const { motivoRejeicao } = req.body;

    if (!motivoRejeicao) {
      return res.status(400).json({
        error: 'Motivo da rejeição é obrigatório'
      });
    }

    const requisicao = await Requisicao.findByPk(req.params.id);

    if (!requisicao) {
      return res.status(404).json({
        error: 'Requisição não encontrada'
      });
    }

    if (!requisicao.podeSerRejeitada()) {
      return res.status(400).json({
        error: 'Requisição não pode ser rejeitada'
      });
    }

    // Rejeitar requisição
    await requisicao.rejeitar(req.user.id, motivoRejeicao);

    // Popular dados para retorno
    await requisicao.reload({
      include: [
        { 
          model: User, 
          as: 'solicitanteUser', 
          attributes: ['nome', 'email'] 
        },
        { 
          model: Material, 
          as: 'materialObj', 
          attributes: ['nome', 'unidadeDeMedida'] 
        },
        { 
          model: User, 
          as: 'aprovadoPorUser', 
          attributes: ['nome'] 
        }
      ]
    });

    res.json({
      message: 'Requisição rejeitada com sucesso',
      requisicao
    });

  } catch (error) {
    console.error('Erro ao rejeitar requisição:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 