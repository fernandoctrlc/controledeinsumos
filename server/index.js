const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection, syncDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const materialRoutes = require('./routes/materials');
const requisitionRoutes = require('./routes/requisitions');
const movimentacaoRoutes = require('./routes/movimentacoes');
const departamentoRoutes = require('./routes/departamentos');

// Carregar associações dos modelos
require('./models/associations');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar trust proxy para funcionar com Nginx
app.set('trust proxy', 1);

// Configuração de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por janela
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});

// Middlewares
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://insumos.escolamega.com.br'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Testar conexão com MySQL
testConnection();

// Sincronizar banco de dados
syncDatabase();

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/requisitions', requisitionRoutes);
app.use('/api/movimentacoes', movimentacaoRoutes);
app.use('/api/departamentos', departamentoRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Rota para arquivos não encontrados
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 API disponível em http://localhost:${PORT}/api`);
}); 