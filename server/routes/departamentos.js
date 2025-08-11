const express = require('express');
const { Op, sequelize } = require('sequelize');
const Departamento = require('../models/Departamento');
const User = require('../models/User');
const { auth, coordenador, coordenadorOuAlmoxarife } = require('../middleware/auth');

const router = express.Router();

// GET /api/departamentos - Listar departamentos (todos podem ver)
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      ativo = true 
    } = req.query;

    const whereClause = {};
    
    // Filtro por busca
    if (search) {
      whereClause[Op.or] = [
        { nome: { [Op.like]: `%${search}%` } },
        { sigla: { [Op.like]: `%${search}%` } },
        { responsavel: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Filtro por status ativo
    if (ativo !== undefined) {
      whereClause.ativo = ativo === 'true';
    }

    const offset = (page - 1) * limit;
    
    const { count, rows: departamentos } = await Departamento.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'criadoPorDepartamento', 
          attributes: ['nome'] 
        }
      ],
      order: [['nome', 'ASC']],
      offset: offset,
      limit: parseInt(limit)
    });

    res.json({
      departamentos,
      paginacao: {
        pagina: parseInt(page),
        limite: parseInt(limit),
        total: count,
        paginas: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar departamentos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/departamentos/ativos - Listar apenas departamentos ativos
router.get('/ativos', auth, async (req, res) => {
  try {
    const departamentos = await Departamento.findAll({
      where: { ativo: true },
      attributes: ['id', 'nome', 'sigla'],
      order: [['nome', 'ASC']]
    });

    res.json({ departamentos });

  } catch (error) {
    console.error('Erro ao listar departamentos ativos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/departamentos/:id - Buscar departamento específico
router.get('/:id', auth, async (req, res) => {
  try {
    const departamento = await Departamento.findByPk(req.params.id, {
      include: [
        { 
          model: User, 
          as: 'criadoPorDepartamento', 
          attributes: ['nome', 'email'] 
        }
      ]
    });

    if (!departamento) {
      return res.status(404).json({
        error: 'Departamento não encontrado'
      });
    }

    res.json({ departamento });

  } catch (error) {
    console.error('Erro ao buscar departamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/departamentos - Criar departamento (apenas coordenador)
router.post('/', auth, coordenador, async (req, res) => {
  try {
    const { 
      nome, 
      sigla, 
      descricao, 
      responsavel, 
      email, 
      telefone 
    } = req.body;

    // Validações básicas
    if (!nome || !sigla) {
      return res.status(400).json({
        error: 'Nome e sigla são obrigatórios'
      });
    }

    // Verificar se nome já existe
    const nomeExistente = await Departamento.findOne({
      where: { nome: nome.trim() }
    });

    if (nomeExistente) {
      return res.status(400).json({
        error: 'Já existe um departamento com este nome'
      });
    }

    // Verificar se sigla já existe
    const siglaExistente = await Departamento.findOne({
      where: { sigla: sigla.trim().toUpperCase() }
    });

    if (siglaExistente) {
      return res.status(400).json({
        error: 'Já existe um departamento com esta sigla'
      });
    }

    const departamento = await Departamento.create({
      nome: nome.trim(),
      sigla: sigla.trim().toUpperCase(),
      descricao: descricao?.trim(),
      responsavel: responsavel?.trim(),
      email: email?.trim(),
      telefone: telefone?.trim(),
      criadoPor: req.user.id
    });

    // Popular dados para retorno
    await departamento.reload({
      include: [
        { 
          model: User, 
          as: 'criadoPorDepartamento', 
          attributes: ['nome'] 
        }
      ]
    });

    res.status(201).json({
      message: 'Departamento criado com sucesso',
      departamento
    });

  } catch (error) {
    console.error('Erro ao criar departamento:', error);
    
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

// PUT /api/departamentos/:id - Atualizar departamento (apenas coordenador)
router.put('/:id', auth, coordenador, async (req, res) => {
  try {
    const { 
      nome, 
      sigla, 
      descricao, 
      responsavel, 
      email, 
      telefone,
      ativo 
    } = req.body;

    const departamento = await Departamento.findByPk(req.params.id);

    if (!departamento) {
      return res.status(404).json({
        error: 'Departamento não encontrado'
      });
    }

    // Verificar se nome já existe (excluindo o próprio)
    if (nome && nome.trim() !== departamento.nome) {
      const nomeExistente = await Departamento.findOne({
        where: { 
          nome: nome.trim(),
          id: { [Op.ne]: req.params.id }
        }
      });

      if (nomeExistente) {
        return res.status(400).json({
          error: 'Já existe um departamento com este nome'
        });
      }
    }

    // Verificar se sigla já existe (excluindo o próprio)
    if (sigla && sigla.trim().toUpperCase() !== departamento.sigla) {
      const siglaExistente = await Departamento.findOne({
        where: { 
          sigla: sigla.trim().toUpperCase(),
          id: { [Op.ne]: req.params.id }
        }
      });

      if (siglaExistente) {
        return res.status(400).json({
          error: 'Já existe um departamento com esta sigla'
        });
      }
    }

    // Atualizar departamento
    await departamento.update({
      nome: nome ? nome.trim() : departamento.nome,
      sigla: sigla ? sigla.trim().toUpperCase() : departamento.sigla,
      descricao: descricao !== undefined ? descricao?.trim() : departamento.descricao,
      responsavel: responsavel !== undefined ? responsavel?.trim() : departamento.responsavel,
      email: email !== undefined ? email?.trim() : departamento.email,
      telefone: telefone !== undefined ? telefone?.trim() : departamento.telefone,
      ativo: ativo !== undefined ? ativo : departamento.ativo
    });

    // Popular dados para retorno
    await departamento.reload({
      include: [
        { 
          model: User, 
          as: 'criadoPorDepartamento', 
          attributes: ['nome'] 
        }
      ]
    });

    res.json({
      message: 'Departamento atualizado com sucesso',
      departamento
    });

  } catch (error) {
    console.error('Erro ao atualizar departamento:', error);
    
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

// DELETE /api/departamentos/:id - Desativar departamento (apenas coordenador)
router.delete('/:id', auth, coordenador, async (req, res) => {
  try {
    const departamento = await Departamento.findByPk(req.params.id);

    if (!departamento) {
      return res.status(404).json({
        error: 'Departamento não encontrado'
      });
    }

    // Verificar se há requisições vinculadas a este departamento
    // TODO: Implementar verificação quando o modelo de Requisição for atualizado

    // Desativar departamento (soft delete)
    await departamento.update({ ativo: false });

    res.json({
      message: 'Departamento desativado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao desativar departamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/departamentos/:id/requisicoes - Listar requisições de um departamento
router.get('/:id/requisicoes', auth, coordenadorOuAlmoxarife, async (req, res) => {
  try {
    const departamento = await Departamento.findByPk(req.params.id);

    if (!departamento) {
      return res.status(404).json({
        error: 'Departamento não encontrado'
      });
    }

    // TODO: Implementar quando o modelo de Requisição for atualizado
    // Por enquanto, retornar mensagem
    res.json({
      message: 'Funcionalidade será implementada quando as requisições incluírem departamentos',
      departamento: {
        id: departamento.id,
        nome: departamento.nome,
        sigla: departamento.sigla
      }
    });

  } catch (error) {
    console.error('Erro ao buscar requisições do departamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 