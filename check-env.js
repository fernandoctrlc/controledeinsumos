require('dotenv').config();

console.log('🔍 Verificando variáveis de ambiente...\n');

console.log('📋 Variáveis de Banco de Dados:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS ? '***' : 'NÃO DEFINIDA');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('');

console.log('📋 Variáveis do Servidor:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'DEFINIDA' : 'NÃO DEFINIDA');
console.log('');

console.log('📋 Variáveis do Frontend:');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('');

// Testar conexão com banco
const { testConnection } = require('./server/config/database.js');

console.log('🔗 Testando conexão com banco...');
testConnection(); 