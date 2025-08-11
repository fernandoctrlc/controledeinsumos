const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando variáveis de ambiente na produção...');

// Verificar se o arquivo .env existe
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo .env encontrado');
  
  // Ler conteúdo do .env
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📋 Conteúdo do .env:');
  console.log(envContent);
  
  // Verificar variáveis críticas
  const requiredVars = [
    'JWT_SECRET',
    'MYSQL_HOST',
    'MYSQL_USER',
    'MYSQL_PASSWORD',
    'MYSQL_DATABASE',
    'PORT'
  ];
  
  console.log('\n🔍 Verificando variáveis obrigatórias:');
  requiredVars.forEach(varName => {
    if (envContent.includes(`${varName}=`)) {
      console.log(`✅ ${varName} - DEFINIDA`);
    } else {
      console.log(`❌ ${varName} - NÃO DEFINIDA`);
    }
  });
  
} else {
  console.log('❌ Arquivo .env não encontrado');
  console.log('📝 Criando arquivo .env de exemplo...');
  
  const exampleEnv = `# Configurações do Banco de Dados
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=almoxarifado
MYSQL_DATABASE=almoxarifado

# Configurações do JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024

# Configurações do Servidor
PORT=3001
NODE_ENV=production

# Configurações do Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
`;
  
  fs.writeFileSync(envPath, exampleEnv);
  console.log('✅ Arquivo .env criado com configurações de exemplo');
  console.log('⚠️ IMPORTANTE: Altere a JWT_SECRET para uma chave segura!');
}

// Verificar variáveis de ambiente atuais
console.log('\n🌍 Variáveis de ambiente atuais:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'DEFINIDA' : 'NÃO DEFINIDA');
console.log('MYSQL_HOST:', process.env.MYSQL_HOST || 'NÃO DEFINIDA');
console.log('MYSQL_USER:', process.env.MYSQL_USER || 'NÃO DEFINIDA');
console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE || 'NÃO DEFINIDA');
console.log('PORT:', process.env.PORT || 'NÃO DEFINIDA');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NÃO DEFINIDA');

console.log('\n📋 INSTRUÇÕES PARA CORRIGIR:');
console.log('1. Acesse a VPS via SSH');
console.log('2. Navegue até o diretório do projeto: cd /var/www/controledeinsumos');
console.log('3. Verifique se existe o arquivo .env: ls -la .env');
console.log('4. Se não existir, crie: cp .env.example .env');
console.log('5. Edite o arquivo .env: nano .env');
console.log('6. Defina JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024');
console.log('7. Reinicie o PM2: pm2 restart srvinsumos'); 