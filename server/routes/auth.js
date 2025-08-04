const express = require('express');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Função para gerar token JWT
const gerarToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/registro
router.post('/registro', async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    // Validações básicas
    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios'
      });
    }

    // Verificar se o email já existe
    const usuarioExistente = await User.findOne({ 
      where: { email: email.toLowerCase() }
    });
    
    if (usuarioExistente) {
      return res.status(400).json({
        error: 'Email já cadastrado'
      });
    }

    // Criar novo usuário
    const usuario = await User.create({
      nome,
      email: email.toLowerCase(),
      senha,
      perfil
    });

    // Gerar token
    const token = gerarToken(usuario.id);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map(err => err.message);
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

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validações básicas
    if (!email || !senha) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const usuario = await User.findOne({ 
      where: { email: email.toLowerCase() }
    });
    
    if (!usuario) {
      return res.status(401).json({
        error: 'Email ou senha incorretos'
      });
    }

    // Verificar se usuário está ativo
    if (!usuario.ativo) {
      return res.status(401).json({
        error: 'Usuário inativo'
      });
    }

    // Verificar senha
    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({
        error: 'Email ou senha incorretos'
      });
    }

    // Atualizar último acesso
    usuario.ultimoAcesso = new Date();
    await usuario.save();

    // Gerar token
    const token = gerarToken(usuario.id);

    res.json({
      message: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/auth/perfil
router.get('/perfil', auth, async (req, res) => {
  try {
    res.json({
      usuario: req.user
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', auth, async (req, res) => {
  try {
    // Em uma implementação mais robusta, você poderia invalidar o token
    // Por enquanto, apenas retornamos sucesso
    res.json({
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/alterar-senha
router.post('/alterar-senha', auth, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        error: 'Senha atual e nova senha são obrigatórias'
      });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({
        error: 'Nova senha deve ter pelo menos 6 caracteres'
      });
    }

    // Buscar usuário com senha
    const usuario = await User.findByPk(req.user.id);
    
    // Verificar senha atual
    const senhaValida = await usuario.compararSenha(senhaAtual);
    if (!senhaValida) {
      return res.status(401).json({
        error: 'Senha atual incorreta'
      });
    }

    // Alterar senha
    usuario.senha = novaSenha;
    await usuario.save();

    res.json({
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 