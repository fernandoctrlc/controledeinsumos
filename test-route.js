const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
const { sequelize } = require('./server/config/database');

async function testRoute() {
  try {
    console.log('🔍 Testando rota de login...');
    
    const email = 'joao.silva@escola.com';
    const senha = '123456';
    
    console.log('📧 Email:', email);
    console.log('🔑 Senha:', senha);
    
    // Buscar usuário
    const usuario = await User.findOne({ 
      where: { email: email.toLowerCase() }
    });
    
    console.log('👤 Usuário encontrado:', usuario ? 'Sim' : 'Não');
    
    if (!usuario) {
      console.log('❌ Usuário não encontrado');
      return;
    }

    console.log('✅ Usuário ativo:', usuario.ativo);
    console.log('📝 Senha hash:', usuario.senha);

    // Verificar senha
    const senhaValida = await usuario.compararSenha(senha);
    console.log('🔐 Senha válida:', senhaValida);
    
    if (!senhaValida) {
      console.log('❌ Senha incorreta');
      return;
    }

    console.log('✅ Login válido!');
    
    // Gerar token
    const token = jwt.sign(
      { userId: usuario.id },
      'sua_chave_secreta_muito_segura_aqui',
      { expiresIn: '7d' }
    );
    
    console.log('🎫 Token gerado:', token.substring(0, 50) + '...');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await sequelize.close();
  }
}

testRoute(); 