import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 配置环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// 中间件
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 导入 API 处理器
let contactHandler, llmHandler;

try {
  const contactModule = await import('./api/contact/send.js');
  contactHandler = contactModule.default;
  console.log('✅ Contact handler loaded');
} catch (error) {
  console.error('❌ Failed to load contact handler:', error.message);
}

try {
  const llmModule = await import('./api/llm/chat.js');
  llmHandler = llmModule.default;
  console.log('✅ LLM handler loaded');
} catch (error) {
  console.error('❌ Failed to load LLM handler:', error.message);
}

// API 路由
app.post('/api/contact/send', async (req, res) => {
  try {
    if (contactHandler && typeof contactHandler === 'function') {
      await contactHandler(req, res);
    } else {
      res.status(500).json({ error: 'Contact handler not available' });
    }
  } catch (error) {
    console.error('Contact API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  }
});

app.post('/api/llm/chat', async (req, res) => {
  try {
    if (llmHandler && typeof llmHandler === 'function') {
      await llmHandler(req, res);
    } else {
      res.status(500).json({ error: 'LLM handler not available' });
    }
  } catch (error) {
    console.error('LLM API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    endpoints: [
      'POST /api/contact/send',
      'POST /api/llm/chat',
      'GET /api/health'
    ]
  });
});

// CORS 预检处理
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});

// 404 处理
app.use((req, res) => {
  if (req.url.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.status(404).send('Not Found');
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/contact/send`);
  console.log(`   POST http://localhost:${PORT}/api/llm/chat`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`\n📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});