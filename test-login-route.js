const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
const { sequelize } = require('./server/config/database');

async function testLoginRoute() {
  try {
    console.log('🔍 Testando rota de login...');
    
    const email = 'joao.silva@escola.com';
    const senha = '123456';
    
    // Simular a lógica da rota de login
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

    // Verificar senha
    console.log('📝 Senha hash no banco:', usuario.senha);
    const senhaValida = await usuario.compararSenha(senha);
    console.log('🔐 Senha válida:', senhaValida);
    
    if (!senhaValida) {
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

testLoginRoute(); 