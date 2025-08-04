require('dotenv').config();

console.log('🔍 Verificando variáveis de ambiente...');
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('NODE_ENV:', process.env.NODE_ENV); 