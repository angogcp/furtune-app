# 🤖 LLM API 配置指南

您的占卜应用已准备好连接真实的AI大语言模型！按照以下步骤配置API即可获得真实的AI占卜服务。

## 🎯 推荐方案

### 1. DeepSeek API (推荐 - 免费额度丰富)

**优势**：
- ✅ 新用户赠送 ¥50 免费额度  
- ✅ 模型性能优秀，专门针对中文优化
- ✅ 价格便宜，每万tokens仅 ¥0.14
- ✅ 注册简单，支持微信登录

**获取步骤**：
1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 点击右上角"登录/注册"
3. 使用手机号或微信快速注册
4. 登录后进入 [API Keys](https://platform.deepseek.com/api_keys) 页面
5. 点击"Create API Key"创建新的API密钥
6. 复制API密钥（sk-开头的字符串）

**配置方法**：
```env
VITE_LLM_API_ENDPOINT=https://api.deepseek.com/v1/chat/completions
VITE_LLM_API_KEY=sk-your-actual-deepseek-api-key
VITE_LLM_MODEL=deepseek-chat
```

### 2. OpenAI API (经典选择)

**获取步骤**：
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册并登录账户
3. 进入 [API Keys](https://platform.openai.com/api-keys) 页面
4. 创建新的API密钥

**配置方法**：
```env
VITE_LLM_API_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_LLM_API_KEY=sk-your-actual-openai-api-key
VITE_LLM_MODEL=gpt-3.5-turbo
```

### 3. 其他兼容的API提供商

#### OpenRouter (多模型聚合)
```env
VITE_LLM_API_ENDPOINT=https://openrouter.ai/api/v1/chat/completions
VITE_LLM_API_KEY=sk-or-your-openrouter-key
VITE_LLM_MODEL=openai/gpt-3.5-turbo
```

#### 智谱AI (GLM-4)
```env
VITE_LLM_API_ENDPOINT=https://open.bigmodel.cn/api/paas/v4/chat/completions
VITE_LLM_API_KEY=your-zhipu-api-key
VITE_LLM_MODEL=glm-4
```

## ⚙️ 配置步骤

1. **编辑 .env 文件**：
   - 打开项目根目录下的 `.env` 文件
   - 找到 `VITE_LLM_API_KEY=your_deepseek_api_key_here` 这一行
   - 将 `your_deepseek_api_key_here` 替换为您的真实API密钥

2. **保存并重启**：
   - 保存 `.env` 文件
   - 重启开发服务器（Ctrl+C 停止，然后 `npm run dev` 重新启动）

3. **测试连接**：
   - 打开应用
   - 选择任意占卜方法进行测试
   - 如果配置正确，您将获得真实的AI占卜结果

## 🔍 验证配置

**成功标志**：
- ✅ 占卜结果内容丰富详细（500-800字）
- ✅ 每次占卜结果都不相同
- ✅ 结果针对您的具体问题和情况
- ✅ 控制台没有API相关错误

**失败标志**：
- ❌ 显示预构建的简短内容
- ❌ 控制台显示"开发环境需要配置 VITE_LLM_API_ENDPOINT 和 VITE_LLM_API_KEY"错误
- ❌ 每次占卜结果完全相同

## 💡 使用技巧

1. **成本控制**：
   - DeepSeek API价格便宜，正常使用几乎不会耗尽免费额度
   - 可以在 `.env` 中调整 `VITE_LLM_MAX_TOKENS` 控制回复长度

2. **模型选择**：
   - DeepSeek：中文表现优秀，价格便宜
   - GPT-3.5：英文表现好，通用性强
   - GLM-4：国产模型，支持国内服务

3. **安全注意**：
   - 不要将API密钥提交到Git仓库
   - `.env` 文件已在 `.gitignore` 中，本地使用安全

## 🆘 常见问题

**Q: API密钥无效？**
A: 检查密钥是否正确复制，确保没有多余的空格或字符。

**Q: 网络连接失败？**
A: 检查网络连接，某些API可能需要科学上网。

**Q: 仍然显示预构建内容？**
A: 确保重启了开发服务器，检查 `.env` 文件格式是否正确。

---

配置完成后，您就可以享受真正的AI驱动占卜体验了！🔮✨