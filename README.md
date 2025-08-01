# 🔮 Fortune Telling App - AI占卜应用

一个基于React + TypeScript + Vite构建的现代化占卜应用，集成了AI大语言模型，提供专业的塔罗牌、占星术、易经和数字命理学占卜服务。

## ✨ 功能特色

### 🎯 占卜方法
- **塔罗牌占卜** - 78张经典塔罗牌，支持多卡组合解读
- **占星术分析** - 基于出生信息的星座运势分析
- **易经占卜** - 64卦象的传统易经解读
- **数字命理** - 生命数字计算与性格分析

### 📊 占卜类型
- 💕 感情运势
- 💼 事业发展
- 💰 财富运程
- 🏥 健康状况
- 🌟 综合运势

### 🤖 AI集成特性
- **智能解读** - 集成大语言模型提供专业占卜解读
- **多模型支持** - 支持OpenAI、Claude、本地模型等
- **离线模式** - API不可用时自动切换到本地算法
- **重试机制** - 智能重试确保服务稳定性

### 🎨 用户体验
- **响应式设计** - 完美适配桌面和移动设备
- **渐变主题** - 神秘紫色渐变UI设计
- **动画效果** - 流畅的交互动画
- **无障碍支持** - 完整的键盘导航和屏幕阅读器支持

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装步骤

1. **安装依赖**
```bash
npm install
# 或
yarn install
```

2. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入你的API配置
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

4. **打开浏览器**
访问 `http://localhost:5173` 开始使用

## ⚙️ 配置说明

### 环境变量配置

在 `.env` 文件中配置以下变量：

```env
# LLM API配置
REACT_APP_LLM_API_ENDPOINT=https://api.openai.com/v1/chat/completions
REACT_APP_LLM_API_KEY=your_api_key_here
REACT_APP_LLM_MODEL=gpt-3.5-turbo

# API参数
REACT_APP_LLM_TEMPERATURE=0.8
REACT_APP_LLM_MAX_TOKENS=500
REACT_APP_LLM_TIMEOUT=30000

# 功能开关
REACT_APP_ENABLE_FALLBACK=true
REACT_APP_ENABLE_RETRY=true
REACT_APP_MAX_RETRIES=3
```

### 支持的LLM提供商

#### OpenAI
```env
REACT_APP_LLM_API_ENDPOINT=https://api.openai.com/v1/chat/completions
REACT_APP_LLM_MODEL=gpt-3.5-turbo
```

#### Claude/Anthropic
```env
REACT_APP_LLM_API_ENDPOINT=https://api.anthropic.com/v1/messages
REACT_APP_LLM_MODEL=claude-3-sonnet-20240229
```

#### 本地模型 (Ollama)
```env
REACT_APP_LLM_API_ENDPOINT=http://localhost:11434/api/chat
REACT_APP_LLM_MODEL=llama2
REACT_APP_LLM_API_KEY=
```

## 🛠️ 技术栈

- **前端框架**: React 19.1.1
- **构建工具**: Vite 7.0.4
- **语言**: TypeScript 5.8.3
- **样式**: Tailwind CSS 3.4.17
- **图标**: Lucide React 0.534.0
- **代码质量**: ESLint

## 📱 使用指南

### 1. 选择占卜方法
点击四种占卜方法中的任意一种：
- 🃏 塔罗牌占卜
- ⭐ 占星术分析
- ☯️ 易经占卜
- 🔢 数字命理

### 2. 选择占卜类型
根据你的需求选择：
- 💕 感情运势
- 💼 事业发展
- 💰 财富运程
- 🏥 健康状况
- 🌟 综合运势

### 3. 填写占卜信息
根据选择的方法填写相应信息：
- **塔罗牌**: 选择1-10张牌
- **占星术**: 填写出生日期、时间、地点
- **易经**: 选择卦象
- **数字命理**: 填写姓名和出生日期

### 4. 提出问题
在问题框中详细描述你想了解的问题

### 5. 获取解读
点击"开始占卜"按钮，等待AI生成专业解读

## 🚨 注意事项

### 安全性
- 不要在代码中硬编码API密钥
- 使用环境变量管理敏感信息
- 在生产环境中启用HTTPS

### 占卜伦理
- 应用仅供娱乐和参考
- 不应用于重要决策
- 避免过度依赖占卜结果

---

✨ **愿占卜为你带来智慧与指引** ✨
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
