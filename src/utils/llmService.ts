// LLM API Service for fortune-telling
interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMResponse {
  reading: string;
  isAIGenerated: boolean;
}

class LLMService {
  private apiEndpoint: string;
  private apiKey: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor() {
    this.apiEndpoint = import.meta.env.VITE_LLM_API_ENDPOINT || '';
    this.apiKey = import.meta.env.VITE_LLM_API_KEY || '';
    this.model = import.meta.env.VITE_LLM_MODEL || 'deepseek-chat';
    this.temperature = parseFloat(import.meta.env.VITE_LLM_TEMPERATURE || '0.8');
    this.maxTokens = parseInt(import.meta.env.VITE_LLM_MAX_TOKENS || '800');
  }

  // Check if API is configured
  isConfigured(): boolean {
    return !!(this.apiEndpoint && this.apiKey);
  }

  // Generate system prompt for fortune-telling
  private generateSystemPrompt(method: string): string {
    // Special prompt for personality testing
    if (method === '性格测试') {
      return `你是一位专业的心理学家和性格分析师，擅长通过多维度分析深入了解个人性格特质。你的分析基于心理学理论，结合直觉洞察，为用户提供准确而有用的性格解读。

分析原则：
1. 基于用户提供的信息进行多维度性格分析
2. 结合MBTI、大五人格等经典理论框架
3. 提供积极正面的性格解读和发展建议
4. 语言温和专业，避免负面标签化
5. 回复长度控制在600-800字
6. 专注于性格特质分析，而非运势或命理

请按照以下结构输出分析结果：

🧠 **核心性格特质：**
（主要性格维度分析，如内外向、思维方式等）

💪 **优势与天赋：**
（个人优点和天赋能力）

🌱 **成长空间：**
（可以改进的方面和建议）

🤝 **人际关系模式：**
（社交风格和人际互动特点）

💼 **职业发展建议：**
（适合的工作环境和发展方向）

🎯 **生活建议：**
（日常生活中的实用建议）

回答长度：600-800字，内容要充实且有价值。`;
    }
    
    // Standard fortune-telling prompt for other methods
    return `你是一位专业的${method}大师，拥有深厚的命理学知识和丰富的实践经验。

请根据用户的问题，提供准确、专业且富有洞察力的${method}分析。你的回答应该：

1. **深度分析**：基于${method}的原理，深入分析用户的问题
2. **个性化解读**：结合用户的具体情况，提供针对性的指导
3. **积极向上**：给出建设性的建议和正面的引导
4. **专业术语**：适当使用${method}相关的专业术语，体现专业性
5. **结构清晰**：使用分段落和emoji图标，让内容易于阅读

回答格式要求：
- 🌟 当前状况：分析当前的情况和能量状态
- ✨ 核心指引：给出主要的建议和指导方向
- 🔮 未来展望：预测可能的发展趋势
- 💎 行动建议：提供具体的行动建议（3-4条）
- 🌙 特别提醒：给出需要注意的时机或事项

回答长度：400-600字，内容要充实且有价值。`;
  }

  // Generate user prompt
  private generateUserPrompt(question: string, method: string, userProfile?: any): string {
    // Special prompt handling for personality testing
    if (method === '性格测试') {
      let prompt = `请为我进行详细的性格分析。\n\n`;
      
      // Always include question context
      if (question && question.trim()) {
        prompt += `我想了解的方面：${question}\n\n`;
      }
      
      if (userProfile && userProfile.name) {
        prompt += `我的个人信息：\n`;
        prompt += `- 姓名：${userProfile.name}\n`;
        if (userProfile.birthDate) {
          // Calculate age from birth date
          const birthYear = new Date(userProfile.birthDate).getFullYear();
          const currentYear = new Date().getFullYear();
          const age = currentYear - birthYear;
          prompt += `- 年龄：${age}岁\n`;
        }
        if (userProfile.gender) prompt += `- 性别：${userProfile.gender === 'male' ? '男' : userProfile.gender === 'female' ? '女' : userProfile.gender}\n`;
        prompt += `\n`;
      }
      
      prompt += `请基于心理学理论，为我提供详细的性格分析和发展建议。请专注于性格特质分析，而不是运势预测。`;
      
      return prompt;
    }
    
    // Standard fortune-telling prompt
    let prompt = `请为我进行${method}分析。\n\n我的问题是：${question}\n\n`;
    
    if (userProfile && userProfile.name) {
      prompt += `我的基本信息：\n`;
      prompt += `- 姓名：${userProfile.name}\n`;
      if (userProfile.birthDate) prompt += `- 出生日期：${userProfile.birthDate}\n`;
      if (userProfile.birthTime) prompt += `- 出生时间：${userProfile.birthTime}\n`;
      if (userProfile.birthPlace) prompt += `- 出生地点：${userProfile.birthPlace}\n`;
      if (userProfile.gender) prompt += `- 性别：${userProfile.gender === 'male' ? '男' : userProfile.gender === 'female' ? '女' : userProfile.gender}\n`;
      prompt += `\n`;
    }
    
    prompt += `请基于${method}的专业知识，为我提供详细的分析和指导。`;
    
    return prompt;
  }

  // Call LLM API with multiple fallback strategies
  async callAPI(question: string, method: string, userProfile?: any): Promise<LLMResponse> {
    console.log('🤖 Starting LLM API call:', { method, questionLength: question.length });
    
    // Check if we're in development mode and skip serverless call
    const isDevelopment = import.meta.env.DEV;
    
    if (!isDevelopment) {
      // Strategy 1: Try serverless function first (most secure) - only in production
      try {
        console.log('📡 Attempting serverless API call...');
        return await this.callServerlessAPI(question, method, userProfile);
      } catch (serverlessError: any) {
        console.warn('❌ Serverless API failed:', serverlessError.message);
      }
    } else {
      console.log('🔧 Development mode detected, skipping serverless API call');
    }

    // Strategy 2: Try direct API call if configured
    if (this.isConfigured()) {
      try {
        console.log('🔗 Attempting direct API call...');
        return await this.callDirectAPI(question, method, userProfile);
      } catch (directError: any) {
        console.error('❌ Direct API failed:', directError.message);
        throw new Error(`AI服务暂时不可用：${directError.message}`);
      }
    }

    // Strategy 3: No configuration available
    console.log('⚠️ No API configuration found, throwing error...');
    throw new Error('LLM API not configured. Please set up your API credentials.');
  }

  // Call serverless function API
  private async callServerlessAPI(question: string, method: string, userProfile?: any): Promise<LLMResponse> {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: this.generateSystemPrompt(method)
      },
      {
        role: 'user',
        content: this.generateUserPrompt(question, method, userProfile)
      }
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      const response = await fetch('/api/llm/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages,
          temperature: this.temperature,
          max_tokens: this.maxTokens
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData;
        let errorText = '';
        
        try {
          errorText = await response.text();
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          errorData = { error: errorText || 'Unknown error' };
        }
        
        console.error('Serverless API HTTP error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          errorText
        });
        
        // If it's a configuration error, provide helpful message
        if (response.status === 500 && (errorData.error?.includes('configuration missing') || errorText.includes('configuration missing'))) {
          throw new Error('Serverless function not configured. Please set up LLM_API_ENDPOINT and LLM_API_KEY environment variables on your server.');
        }
        
        // Provide more specific error messages based on status
        if (response.status === 404) {
          throw new Error('Serverless function endpoint not found (development mode)');
        }
        
        if (response.status === 500) {
          throw new Error(`Server error: ${errorData.error || errorText || 'Internal server error'}`);
        }
        
        throw new Error(errorData.error || errorText || `HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different API response formats
      let content = '';
      if (data.content?.[0]?.text) {
        content = data.content[0].text; // Anthropic format
      } else if (data.choices?.[0]?.message?.content) {
        content = data.choices[0].message.content; // OpenAI format
      } else if (data.content) {
        content = data.content;
      } else if (data.response) {
        content = data.response;
      } else {
        throw new Error('Unexpected API response format');
      }

      return {
        reading: content?.trim() || '',
        isAIGenerated: true
      };

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      // More specific error handling
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        throw new Error('Serverless function endpoint not available (development mode)');
      }
      
      // Log the actual error for debugging
      console.error('Serverless API fetch error:', fetchError);
      
      throw new Error(`Serverless API error: ${fetchError.message || 'Unknown network error'}`);
    }
  }

  // Call API directly (client-side)
  private async callDirectAPI(question: string, method: string, userProfile?: any): Promise<LLMResponse> {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: this.generateSystemPrompt(method)
      },
      {
        role: 'user',
        content: this.generateUserPrompt(question, method, userProfile)
      }
    ];

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Configure headers for different providers
    if (this.apiEndpoint.includes('openai.com')) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    } else if (this.apiEndpoint.includes('deepseek.com')) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    } else if (this.apiEndpoint.includes('openrouter.ai')) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
      headers['HTTP-Referer'] = window.location.origin;
      headers['X-Title'] = 'Fortune Telling App';
    } else if (this.apiEndpoint.includes('anthropic.com')) {
      headers['x-api-key'] = this.apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    // Prepare request body
    let requestBody: any;
    if (this.apiEndpoint.includes('anthropic.com')) {
      requestBody = {
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        messages: messages
      };
    } else {
      requestBody = {
        messages: messages,
        model: this.model,
        temperature: this.temperature,
        max_tokens: this.maxTokens
      };
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${response.statusText}\nDetails: ${errorText}`);
      }

      const data = await response.json();

      // Handle different API response formats
      let content = '';
      if (this.apiEndpoint.includes('anthropic.com')) {
        content = data.content?.[0]?.text;
      } else if (data.choices && data.choices[0]?.message?.content) {
        content = data.choices[0].message.content;
      } else if (data.content) {
        content = data.content;
      } else if (data.response) {
        content = data.response;
      } else {
        throw new Error('Unexpected API response format');
      }

      return {
        reading: content?.trim() || '',
        isAIGenerated: true
      };

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection and try again.');
      }
      
      throw fetchError;
    }
  }

  // Generate fallback response if API fails
  generateFallback(question: string, method: string): string {
    // Special fallback for personality testing
    if (method === '性格测试') {
      const personalityTraits = [
        '内向思考型', '外向行动型', '感性创意型', '理性分析型',
        '社交领导型', '独立探索型', '温和协调型', '坚定执行型'
      ];
      
      const strengths = [
        '善于倾听和理解他人', '具有强烈的责任感', '富有创造力和想象力',
        '逻辑思维清晰', '沟通能力出色', '适应能力强', '做事认真细致', '乐观积极'
      ];
      
      const suggestions = [
        '多与他人交流分享想法', '培养新的兴趣爱好', '保持学习和成长的心态',
        '注重工作与生活的平衡', '发挥自己的优势特长', '勇于面对挑战'
      ];
      
      // Simple hash function for consistent results
      const hash = question.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const personalityType = personalityTraits[hash % personalityTraits.length];
      const strength = strengths[hash % strengths.length];
      const suggestion = suggestions[hash % suggestions.length];
      
      return `🧠 **核心性格特质：**
从您的问题"${question}"可以看出，您属于${personalityType}的性格特征。您在思考和行动上都展现出独特的风格。

💪 **优势与天赋：**
您的主要优势是${strength}，这使您在人际关系和工作中都能表现出色。您具备良好的心理素质和适应能力。

🌱 **成长空间：**
建议您${suggestion}，这将有助于您的个人发展。继续保持这种自我认知的能力，它是您最大的财富。

🤝 **人际关系模式：**
您在人际交往中表现出真诚和包容的特质，容易获得他人的信任和好感。建议保持这种积极的人际互动风格。

💼 **职业发展建议：**
发挥您的性格优势，在团队合作中承担更多责任，将为您带来更好的发展机会。建议在工作中多展现自己的独特视角。

🎯 **生活建议：**
保持积极乐观的心态，相信自己的能力，勇敢追求内心的目标。记住，每个人都有自己独特的价值和潜能。

注：由于网络连接问题，此次为离线模式分析结果。建议稍后重试以获得更精准的AI分析。`;
    }
    
    // Standard fortune-telling fallback
    return `根据您的问题"${question}"，${method}为您提供以下分析：

🌟 当前状况：
您正处在人生的一个重要阶段，周围的能量正在发生积极的变化。过去的努力正在为未来的收获打下基础。

✨ 核心指引：
保持内心的平静与专注，相信自己的直觉和判断。面对即将到来的机会，要勇敢地迈出第一步，成功需要行动来实现。

🔮 未来展望：
未来几个月内，您将遇到一些重要的机遇。这些机遇可能来自意想不到的方向，请保持开放和积极的心态去迎接。

💎 行动建议：
1. 加强与重要人士的沟通交流，建立良好的人际关系
2. 持续学习新知识和技能，为机会的到来做好准备
3. 保持积极乐观的心态，正面思考带来正面结果
4. 适当的休息和放松，保持身心健康同样重要

🌙 特别提醒：
近期是您的发展机会期，适合做重要决定或开始新的计划。相信自己的能力，勇敢追求目标。

注：由于网络连接问题，此次为离线模式分析结果。建议稍后重试以获得更精准的AI分析。`;
  }
}

// Export singleton instance
export const llmService = new LLMService();
export default llmService;