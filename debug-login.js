const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
const { sequelize } = require('./server/config/database');

async function debugLogin() {
  try {
    console.log('🔍 Debugando login...');
    
    const email = 'joao.silva@escola.com';
    const senha = '123456';
    
    console.log('📧 Email:', email);
    console.log('🔑 Senha:', senha);
    
    // Testar conexão com banco
    await sequelize.authenticate();
    console.log('✅ Conexão com banco OK');
    
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
    console.log('👤 Perfil:', usuario.perfil);

    // Testar comparação de senha diretamente
    const senhaValida1 = await bcrypt.compare(senha, usuario.senha);
    console.log('🔐 Senha válida (bcrypt):', senhaValida1);
    
    // Testar método do modelo
    const senhaValida2 = await usuario.compararSenha(senha);
    console.log('🔐 Senha válida (método):', senhaValida2);
    
    if (!senhaValida1 || !senhaValida2) {
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

debugLogin(); 