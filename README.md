# 🔮 Fortune Telling App - AI占卜应用

一个基于React + TypeScript + Vite构建的现代化占卜应用，集成了AI大语言模型，提供专业的塔罗牌、占星术、易经、数字命理学、抽签和八字占卜服务。

## ✨ 功能特色

### 🎯 占卜方法
- **塔罗牌占卜** - 78张经典塔罗牌，支持多卡组合解读
- **占星术分析** - 基于出生信息的星座运势分析  
- **抽签占卜** - 传统抽签解读，包含诗词和寓意
- **掷筊占卜** - 传统掷筊问卜，获得神明指引
- **数字命理** - 生命数字计算与性格分析
- **八字分析** - 基于出生时间的八字命理解读

### 📊 占卜类型
- 💕 感情运势
- 💼 事业发展  
- 💰 财富运程
- 🏥 健康状况
- 🌟 综合运势
- 👥 人际关系

### 🤖 AI集成特性
- **智能解读** - 集成大语言模型提供专业占卜解读
- **多模型支持** - 支持OpenAI、Claude、DeepSeek、OpenRouter、本地模型等
- **环境分离** - 开发环境直连API，生产环境服务端代理
- **安全配置** - API密钥服务端管理，防止泄露
- **重试机制** - 智能重试确保服务稳定性
- **内容延续** - 支持长文本分段生成

### 🔐 用户系统 (可选)
- **用户认证** - 支持Supabase用户系统
- **每日签到** - 积分奖励系统
- **许愿墙** - 用户许愿和互动
- **成长记录** - 占卜历史追踪
- **个性化推荐** - 基于历史的内容推荐
- **命运提醒** - 定期占卜提醒功能

### 🎨 用户体验
- **响应式设计** - 完美适配桌面和移动设备
- **渐变主题** - 神秘紫色渐变UI设计
- **动画效果** - 流畅的交互动画
- **双模式** - 支持访客模式和登录模式
- **无障碍支持** - 完整的键盘导航和屏幕阅读器支持

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd fortune-app
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **配置环境变量 (开发环境)**
```bash
# 创建 .env 文件
cp .env.example .env

# 编辑 .env 文件，填入你的API配置
```

4. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

5. **打开浏览器**
访问显示的本地地址（通常是 `http://localhost:5173` 或 `http://localhost:5174`）

## ⚙️ 配置说明

### 开发环境配置

在 `.env` 文件中配置以下变量（仅用于本地开发）：

```env
# LLM API配置 (开发环境)
VITE_LLM_API_ENDPOINT=https://api.deepseek.com/v1/chat/completions
VITE_LLM_API_KEY=your_api_key_here
VITE_LLM_MODEL=deepseek-chat

# Supabase配置 (可选，用于用户系统)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 生产环境配置

生产环境使用服务端API路由 (`/api/llm/chat`) 处理LLM请求，需要在部署平台配置以下环境变量：

```env
# LLM API配置 (生产环境)
LLM_API_ENDPOINT=https://api.deepseek.com/v1/chat/completions
LLM_API_KEY=your_api_key_here
LLM_MODEL=deepseek-chat

# Supabase配置 (可选)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 支持的LLM提供商

#### DeepSeek (推荐)
```env
VITE_LLM_API_ENDPOINT=https://api.deepseek.com/v1/chat/completions
VITE_LLM_MODEL=deepseek-chat
```

#### OpenAI
```env
VITE_LLM_API_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_LLM_MODEL=gpt-3.5-turbo
```

#### Claude/Anthropic
```env
VITE_LLM_API_ENDPOINT=https://api.anthropic.com/v1/messages
VITE_LLM_MODEL=claude-3-sonnet-20240229
```

#### 本地模型 (Ollama)
```env
VITE_LLM_API_ENDPOINT=http://localhost:11434/v1/chat/completions
VITE_LLM_MODEL=llama2
VITE_LLM_API_KEY=placeholder
```

#### OpenRouter
```env
VITE_LLM_API_ENDPOINT=https://openrouter.ai/api/v1/chat/completions
VITE_LLM_MODEL=anthropic/claude-3-sonnet
```

## 🛠️ 技术栈

- **前端框架**: React 19.1.1
- **构建工具**: Vite 7.0.4
- **语言**: TypeScript 5.8.3
- **样式**: Tailwind CSS 3.4.17
- **图标**: Lucide React 0.534.0
- **路由**: React Router DOM 7.1.1
- **用户系统**: Supabase (可选)
- **代码质量**: ESLint

## 📱 使用指南

### 访客模式
无需注册即可使用所有占卜功能：
1. 选择占卜方法和类型
2. 填写相关信息
3. 提出问题
4. 获取AI解读

### 登录模式 (可选)
注册登录后可享受额外功能：
- 每日签到获得积分
- 在许愿墙发布愿望
- 查看占卜历史记录
- 获得个性化推荐
- 设置命运提醒

### 占卜方法详解

#### 🃏 塔罗牌占卜
- 选择1-10张牌进行占卜
- 支持大阿卡纳和小阿卡纳
- AI提供专业牌意解读

#### ⭐ 占星术分析
- 填写出生日期、时间、地点
- 生成个人星盘分析
- 包含行星位置和相位解读

#### 🎋 抽签占卜
- 传统抽签方式
- 包含诗词和详细寓意
- 适合日常指引

#### 🪙 掷筊占卜
- 传统掷筊问卜
- 圣筊、笑筊、阴筊解读
- 适合是非问题

#### 🔢 数字命理
- 基于姓名和生日计算
- 生命数字分析
- 性格特质解读

#### ☯️ 八字分析
- 精确到时辰的八字排盘
- 五行分析
- 运势预测

## 🔒 安全特性

### API密钥安全
- ✅ 开发环境：本地环境变量
- ✅ 生产环境：服务端代理
- ✅ 防止客户端暴露
- ✅ Git忽略敏感文件

### 数据安全
- ✅ 用户数据加密存储
- ✅ HTTPS传输
- ✅ 输入验证和清理
- ✅ 防XSS攻击

## 🚀 部署指南

### Vercel部署 (推荐)
1. 连接GitHub仓库
2. 配置环境变量
3. 自动部署

### 其他平台
- Netlify
- Railway
- Heroku
- 自建服务器

详细部署说明请参考 `SECURITY_DEPLOYMENT_GUIDE.md`

## 🚨 注意事项

### 安全性
- ❌ 不要在代码中硬编码API密钥
- ✅ 使用环境变量管理敏感信息
- ✅ 在生产环境中启用HTTPS
- ✅ 定期更新依赖包

### 占卜伦理
- 应用仅供娱乐和参考
- 不应用于重要决策
- 避免过度依赖占卜结果
- 保持理性和批判思维

### API使用
- 合理控制API调用频率
- 监控API使用量和成本
- 设置适当的超时和重试

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License

---

✨ **愿占卜为你带来智慧与指引** ✨

> 本应用集成了现代AI技术与传统占卜智慧，为用户提供便捷、安全、专业的占卜体验。无论是寻求人生指引还是娱乐放松，都能在这里找到属于你的答案。
