require('dotenv').config();

console.log('🔍 Debugando JWT_SECRET...\n');

console.log('📋 Variáveis de ambiente:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'DEFINIDA' : 'NÃO DEFINIDA');
console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
console.log('');

console.log('📋 Verificando arquivo .env:');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo .env existe');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasJwtSecret = envContent.includes('JWT_SECRET');
  console.log('JWT_SECRET no arquivo:', hasJwtSecret ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
  
  if (hasJwtSecret) {
    const jwtLine = envContent.split('\n').find(line => line.startsWith('JWT_SECRET'));
    console.log('Linha JWT_SECRET:', jwtLine ? jwtLine.substring(0, 20) + '...' : 'NÃO ENCONTRADA');
  }
} else {
  console.log('❌ Arquivo .env não existe');
}
console.log('');

console.log('📋 Testando geração de token:');
const jwt = require('jsonwebtoken');

try {
  if (process.env.JWT_SECRET) {
    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('✅ Token gerado com sucesso');
    console.log('Token (primeiros 20 chars):', token.substring(0, 20) + '...');
  } else {
    console.log('❌ JWT_SECRET não definido');
  }
} catch (error) {
  console.log('❌ Erro ao gerar token:', error.message);
} 