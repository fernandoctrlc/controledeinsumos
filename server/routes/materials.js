const express = require('express');
const { Op, sequelize } = require('sequelize');
const Material = require('../models/Material');
const User = require('../models/User');
const { auth, almoxarife } = require('../middleware/auth');

const router = express.Router();

// GET /api/materials/estoque/baixo - Listar materiais com estoque baixo
router.get('/estoque/baixo', auth, async (req, res) => {
  try {
    const materiais = await Material.findAll({
      where: {
        ativo: true
      },
      include: [
        { 
          model: User, 
          as: 'criadoPorUser', 
          attributes: ['nome'] 
        }
      ]
    });

    // Filtrar materiais com estoque baixo
    const materiaisEstoqueBaixo = materiais.filter(material => 
      parseInt(material.quantidade) <= parseInt(material.quantidadeMinima)
    );

    res.json({ materiais: materiaisEstoqueBaixo });

  } catch (error) {
    console.error('Erro ao buscar materiais com estoque baixo:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/materials/categorias - Listar categorias disponíveis
router.get('/categorias', auth, async (req, res) => {
  try {
    const materiais = await Material.findAll({
      where: {
        ativo: true,
        categoria: { [Op.ne]: null, [Op.ne]: '' }
      },
      attributes: ['categoria'],
      raw: true
    });

    const categorias = [...new Set(materiais.map(material => material.categoria))];

    res.json({ categorias });

  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/materials - Listar materiais (todos podem ver)
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      categoria = '',
      estoqueBaixo = false 
    } = req.query;

    const whereClause = { ativo: true };
    
    // Filtro por busca
    if (search) {
      whereClause.nome = { [Op.like]: `%${search}%` };
    }
    
    // Filtro por categoria
    if (categoria) {
      whereClause.categoria = categoria;
    }
    
    // Filtro por estoque baixo
    if (estoqueBaixo === 'true') {
      whereClause.quantidade = { [Op.lte]: sequelize.col('quantidadeMinima') };
    }

    const offset = (page - 1) * limit;
    
    const { count, rows: materiais } = await Material.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'criadoPorUser', 
          attributes: ['nome'] 
        }
      ],
      order: [['nome', 'ASC']],
      offset: offset,
      limit: parseInt(limit)
    });

    const total = count;

    res.json({
      materiais,
      paginacao: {
        pagina: parseInt(page),
        limite: parseInt(limit),
        total,
        paginas: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar materiais:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/materials/:id - Buscar material específico
router.get('/:id', auth, async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [
        { 
          model: User, 
          as: 'criadoPorUser', 
          attributes: ['nome'] 
        }
      ]
    });

    if (!material) {
      return res.status(404).json({
        error: 'Material não encontrado'
      });
    }

    res.json({ material });

  } catch (error) {
    console.error('Erro ao buscar material:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/materials - Criar material (apenas almoxarife)
router.post('/', auth, almoxarife, async (req, res) => {
  try {
    const { nome, unidadeDeMedida, quantidade, quantidadeMinima, descricao, categoria } = req.body;

    // Validações básicas
    if (!nome || !unidadeDeMedida || quantidade === undefined) {
      return res.status(400).json({
        error: 'Nome, unidade de medida e quantidade são obrigatórios'
      });
    }

    // Verificar se já existe material com mesmo nome
    const materialExistente = await Material.findOne({ 
      where: {
        nome: { [Op.like]: nome },
        ativo: true 
      }
    });

    if (materialExistente) {
      return res.status(400).json({
        error: 'Já existe um material com este nome'
      });
    }

    const material = await Material.create({
      nome,
      unidadeDeMedida,
      quantidade: parseInt(quantidade) || 0,
      quantidadeMinima: parseInt(quantidadeMinima) || 0,
      descricao,
      categoria,
      criadoPor: req.user.id
    });

    res.status(201).json({
      message: 'Material criado com sucesso',
      material
    });

  } catch (error) {
    console.error('Erro ao criar material:', error);
    
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

// PUT /api/materials/:id - Atualizar material (apenas almoxarife)
router.put('/:id', auth, almoxarife, async (req, res) => {
  try {
    const { nome, unidadeDeMedida, quantidade, quantidadeMinima, descricao, categoria } = req.body;

    const material = await Material.findByPk(req.params.id);
    
    if (!material) {
      return res.status(404).json({
        error: 'Material não encontrado'
      });
    }

    // Verificar se já existe outro material com mesmo nome
    if (nome && nome !== material.nome) {
      const materialExistente = await Material.findOne({ 
        where: {
          nome: { [Op.like]: nome },
          ativo: true,
          id: { [Op.ne]: req.params.id }
        }
      });

      if (materialExistente) {
        return res.status(400).json({
          error: 'Já existe um material com este nome'
        });
      }
    }

    // Atualizar campos
    if (nome) material.nome = nome;
    if (unidadeDeMedida) material.unidadeDeMedida = unidadeDeMedida;
    if (quantidade !== undefined) material.quantidade = parseInt(quantidade);
    if (quantidadeMinima !== undefined) material.quantidadeMinima = parseInt(quantidadeMinima);
    if (descricao !== undefined) material.descricao = descricao;
    if (categoria !== undefined) material.categoria = categoria;

    await material.save();

    res.json({
      message: 'Material atualizado com sucesso',
      material
    });

  } catch (error) {
    console.error('Erro ao atualizar material:', error);
    
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

// DELETE /api/materials/:id - Desativar material (apenas almoxarife)
router.delete('/:id', auth, almoxarife, async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    
    if (!material) {
      return res.status(404).json({
        error: 'Material não encontrado'
      });
    }

    // Verificar se há requisições pendentes para este material
    const Requisicao = require('../models/Requisicao');
    const requisicoesPendentes = await Requisicao.count({
      where: {
        material: req.params.id,
        status: 'pendente'
      }
    });

    if (requisicoesPendentes > 0) {
      return res.status(400).json({
        error: 'Não é possível desativar material com requisições pendentes'
      });
    }

    // Desativar material (soft delete)
    material.ativo = false;
    await material.save();

    res.json({
      message: 'Material desativado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao desativar material:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/materials/:id/adicionar-estoque - Adicionar ao estoque (apenas almoxarife)
router.post('/:id/adicionar-estoque', auth, almoxarife, async (req, res) => {
  try {
    const { quantidade } = req.body;

    if (!quantidade || quantidade <= 0) {
      return res.status(400).json({
        error: 'Quantidade deve ser maior que zero'
      });
    }

    const material = await Material.findByPk(req.params.id);
    
    if (!material) {
      return res.status(404).json({
        error: 'Material não encontrado'
      });
    }

    await material.adicionarEstoque(parseInt(quantidade));

    res.json({
      message: 'Estoque atualizado com sucesso',
      material
    });

  } catch (error) {
    console.error('Erro ao adicionar estoque:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 