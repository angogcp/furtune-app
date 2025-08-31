// 本地开发API服务器
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { fetch } = require('undici');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = 3002;

// 中间件
app.use(cors());
app.use(express.json());

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('Global error handler caught an error:');
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    error: 'Internal Server Error',
    details: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// 通用请求日志中间件
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// 测试根路由
app.get('/', (req, res) => {
  res.send('API server is running!');
});

// LLM Chat API端点
app.post('/llm/chat', async (req, res) => {
  console.log('Received request to /llm/chat');
  console.log('Request headers:', req.headers);
  try {
    // 获取环境变量配置
    const API_ENDPOINT = process.env.VITE_LLM_API_ENDPOINT || process.env.LLM_API_ENDPOINT;
    const API_KEY = process.env.VITE_LLM_API_KEY || process.env.LLM_API_KEY;
    const API_MODEL = process.env.VITE_LLM_MODEL || process.env.LLM_MODEL || 'gpt-3.5-turbo';
    const API_TEMPERATURE = parseFloat(process.env.VITE_LLM_TEMPERATURE || process.env.LLM_TEMPERATURE || '0.8');
    const API_MAX_TOKENS = parseInt(process.env.VITE_LLM_MAX_TOKENS || process.env.LLM_MAX_TOKENS || '800');
    const API_TIMEOUT = parseInt(process.env.VITE_LLM_TIMEOUT || process.env.LLM_TIMEOUT || '30000');

    // 验证必需的环境变量
    if (!API_ENDPOINT || !API_KEY) {
      return res.status(500).json({ 
        error: 'LLM API configuration missing. Please set LLM_API_ENDPOINT and LLM_API_KEY environment variables.' 
      });
    }

    // 提取请求数据
    const { messages, temperature, max_tokens } = req.body;

    console.log('LLM_REQUEST_DEBUG: Received request body:', JSON.stringify(req.body, null, 2));

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' });
    }

    // 准备请求头
    const headers = {
      'Content-Type': 'application/json'
    };

    // 根据不同的API提供商配置请求头
    if (API_ENDPOINT.includes('openai.com')) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    } else if (API_ENDPOINT.includes('deepseek.com')) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    } else if (API_ENDPOINT.includes('openrouter.ai')) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
      headers['HTTP-Referer'] = 'http://localhost:5173';
      headers['X-Title'] = 'Fortune Telling App';
    } else if (API_ENDPOINT.includes('anthropic.com')) {
      headers['x-api-key'] = API_KEY;
      headers['anthropic-version'] = '2023-06-01';
    } else {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    }

    // 准备请求体
    let requestBody;
    if (API_ENDPOINT.includes('anthropic.com')) {
      requestBody = {
        model: API_MODEL,
        max_tokens: max_tokens || API_MAX_TOKENS,
        temperature: temperature || API_TEMPERATURE,
        messages: messages
      };
    } else {
      requestBody = {
        messages: messages,
        model: API_MODEL,
        temperature: temperature || API_TEMPERATURE,
        max_tokens: max_tokens || API_MAX_TOKENS
      };
    }

    console.log('Making LLM API request to:', API_ENDPOINT);
    console.log('LLM_REQUEST_DEBUG: Request headers:', JSON.stringify(headers, null, 2));
    console.log('LLM_REQUEST_DEBUG: Request body:', JSON.stringify(requestBody, null, 2));
    console.log('Full LLM API request URL:', API_ENDPOINT);

    // 创建超时控制器
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      // 发送请求到LLM API
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('LLM API Error: Status', response.status, 'Status Text', response.statusText, 'Error Body:', errorText);
        console.error('LLM API Error Response Headers:', JSON.stringify(Object.fromEntries(response.headers), null, 2));
        return res.status(response.status).json({
          error: `LLM API Error: ${response.status} ${response.statusText}`,
          details: errorText
        });
      }

      try {
        const data = await response.json(); // 直接使用 response.json()
        console.log('LLM API response received successfully');
        console.log('LLM API response data:', JSON.stringify(data, null, 2));
        console.log('LLM API response headers:', JSON.stringify(Object.fromEntries(response.headers), null, 2));
        console.log('Before sending response - res.headersSent:', res.headersSent, 'res.statusCode:', res.statusCode);
         console.log('LLM API response status:', response.status, 'headers:', Object.fromEntries(response.headers));
          console.log('Type of data before sending:', typeof data);
          console.log('Raw data from LLM API (truncated):', JSON.stringify(data).substring(0, 500));
          try {
               console.log('Sending response to client with status:', response.status, 'and data:', JSON.stringify(data, null, 2));
                 return res.status(response.status).json(data);
          } catch (sendError) {
              console.error('Error sending response to client:', sendError);
              console.error('Error stack:', sendError.stack);
             return res.status(500).send('Internal Server Error during response sending');
         }
      } catch (jsonError) { // 更改变量名以避免混淆
        let rawResponseText = '';
        try {
          rawResponseText = await response.text(); // 如果 json() 失败，再尝试获取原始文本
        } catch (textError) {
          console.error('Failed to get raw response text after JSON parse error:', textError);
        }
        console.error('Failed to parse LLM API response as JSON:', jsonError);
        console.error('Raw LLM API response (if available):', rawResponseText);
        return res.status(500).json({
          error: 'Failed to parse LLM API response',
          details: jsonError.message,
          rawResponse: rawResponseText // 提供原始响应文本
        });
      }

      // This block is replaced by the new block above to handle JSON parsing and logging.

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return res.status(408).json({ error: 'Request timeout' });
      }
      
      console.error('Fetch error:', fetchError);
      console.error('Fetch error details:', JSON.stringify(fetchError, Object.getOwnPropertyNames(fetchError), 2));
      console.error('LLM_REQUEST_DEBUG: API_ENDPOINT:', API_ENDPOINT);
      console.error('LLM_REQUEST_DEBUG: API_KEY (first 5 chars):', API_KEY ? API_KEY.substring(0, 5) + '...' : 'Not set');
      console.error('LLM_REQUEST_DEBUG: API_MODEL:', API_MODEL);
      return res.status(500).json({
        error: 'Failed to communicate with LLM API',
        details: fetchError.message
      });
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 启动服务器
console.log('Server setup complete, waiting for connections...');

const server = app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log('Environment variables loaded:');
  console.log('- LLM_API_ENDPOINT:', process.env.VITE_LLM_API_ENDPOINT || 'Not set');
  console.log('- LLM_MODEL:', process.env.VITE_LLM_MODEL || 'Not set');
  console.log('Server is ready to accept connections');
});

// 错误处理
server.on('error', (error) => {
  console.error('Server error:', error);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// 防止进程意外退出
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Server setup complete, waiting for connections...');