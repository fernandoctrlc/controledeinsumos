const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso não fornecido' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['senha'] }
    });
    
    if (!user || !user.ativo) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado ou inativo' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado' 
      });
    }
    console.error('Erro na autenticação:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

// Middleware para verificar perfil específico
const verificarPerfil = (perfis) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado' 
      });
    }

    const perfisArray = Array.isArray(perfis) ? perfis : [perfis];
    
    if (!perfisArray.includes(req.user.perfil)) {
      return res.status(403).json({ 
        error: 'Acesso negado. Perfil não autorizado.',
        perfilNecessario: perfisArray,
        perfilAtual: req.user.perfil
      });
    }

    next();
  };
};

// Middlewares específicos para cada perfil
const professor = verificarPerfil('professor');
const coordenador = verificarPerfil('coordenador');
const almoxarife = verificarPerfil('almoxarife');
const coordenadorOuAlmoxarife = verificarPerfil(['coordenador', 'almoxarife']);
const professorOuCoordenador = verificarPerfil(['professor', 'coordenador']);

module.exports = {
  auth,
  verificarPerfil,
  professor,
  coordenador,
  almoxarife,
  coordenadorOuAlmoxarife,
  professorOuCoordenador
}; 