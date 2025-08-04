const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
const { sequelize } = require('./server/config/database');

async function testRouteDebug() {
  try {
    console.log('🔍 Debugando rota de login da API...');
    
    // Simular dados da requisição
    const req = {
      body: {
        email: 'joao.silva@escola.com',
        senha: '123456'
      }
    };
    
    const { email, senha } = req.body;
    
    console.log('📧 Email recebido:', email);
    console.log('🔑 Senha recebida:', senha);
    
    // Validações básicas
    if (!email || !senha) {
      console.log('❌ Email e senha são obrigatórios');
      return;
    }

    // Buscar usuário
    const usuario = await User.findOne({ 
      where: { email: email.toLowerCase() }
    });
    
    console.log('👤 Usuário encontrado:', usuario ? 'Sim' : 'Não');
    
    if (!usuario) {
      console.log('❌ Usuário não encontrado');
      return;
    }

    // Verificar se usuário está ativo
    console.log('✅ Usuário ativo:', usuario.ativo);
    if (!usuario.ativo) {
      console.log('❌ Usuário inativo');
      return;
    }

    // Verificar senha - testar diferentes métodos
    console.log('📝 Senha hash no banco:', usuario.senha);
    
    // Método 1: bcrypt.compare direto
    const senhaValida1 = await bcrypt.compare(senha, usuario.senha);
    console.log('🔐 Senha válida (bcrypt.compare):', senhaValida1);
    
    // Método 2: método do modelo
    const senhaValida2 = await usuario.compararSenha(senha);
    console.log('🔐 Senha válida (método modelo):', senhaValida2);
    
    // Método 3: comparar com string
    const senhaValida3 = await bcrypt.compare('123456', usuario.senha);
    console.log('🔐 Senha válida (string hardcoded):', senhaValida3);
    
    if (!senhaValida1 || !senhaValida2 || !senhaValida3) {
      console.log('❌ Senha incorreta');
      return;
    }

    console.log('✅ Login válido!');
    
    // Atualizar último acesso
    usuario.ultimoAcesso = new Date();
    await usuario.save();
    console.log('✅ Último acesso atualizado');

    // Gerar token
    const token = jwt.sign(
      { userId: usuario.id },
      'sua_chave_secreta_muito_segura_aqui',
      { expiresIn: '7d' }
    );
    
    console.log('🎫 Token gerado:', token.substring(0, 50) + '...');
    
    // Simular resposta da API
    const response = {
      message: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    };
    
    console.log('📤 Resposta da API:', JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await sequelize.close();
  }
}

testRouteDebug(); 