# Fortune Telling App - LLM Setup Guide

This app supports real AI-powered fortune telling using various LLM providers. Follow these steps to enable AI analysis:

## Current Status

⚠️ **If you see "智能模板模式" (Smart Template Mode)**, it means AI is not configured and the app is using contextual template responses.

✅ **If you see "AI分析已配置" (AI Analysis Configured)**, real AI is enabled.

🔧 **In development mode**, the app automatically skips serverless function calls and uses direct API calls for better debugging.

## Quick Setup for Development

### Development vs Production Behavior

**Development Mode (npm run dev):**
- Automatically skips serverless function calls
- Uses direct API calls to LLM providers
- No need for server-side API setup
- Better error messages and debugging

**Production Mode (deployed):**
- First tries serverless function (`/api/llm/chat`)
- Falls back to direct API calls if serverless fails
- More secure as API keys stay server-side when using serverless

### Option 1: DeepSeek API (Recommended - Chinese Friendly & Affordable)

1. **Sign up**: Go to [DeepSeek](https://platform.deepseek.com/)
2. **Get API Key**: Create an account and get your API key from the dashboard
3. **Configure Environment**: Edit the `.env` file in your project root:

```env
# Uncomment and fill in your DeepSeek API key
VITE_LLM_API_ENDPOINT=https://api.deepseek.com/v1/chat/completions
VITE_LLM_API_KEY=sk-your-deepseek-api-key-here
VITE_LLM_MODEL=deepseek-chat
VITE_LLM_TEMPERATURE=0.8
VITE_LLM_MAX_TOKENS=800
```

4. **Restart Server**: Stop and restart your development server:
   ```bash
   # Press Ctrl+C to stop, then:
   npm run dev
   ```

### Option 2: OpenAI API

1. **Sign up**: Go to [OpenAI](https://platform.openai.com/)
2. **Get API Key**: Get your API key from the dashboard
3. **Configure**: Edit `.env`:

```env
VITE_LLM_API_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_LLM_API_KEY=sk-your-openai-api-key-here
VITE_LLM_MODEL=gpt-3.5-turbo
VITE_LLM_TEMPERATURE=0.8
VITE_LLM_MAX_TOKENS=800
```

### Option 3: OpenRouter (Access to Multiple Models)

1. **Sign up**: Go to [OpenRouter](https://openrouter.ai/)
2. **Get API Key**: Get your API key
3. **Configure**: Edit `.env`:

```env
VITE_LLM_API_ENDPOINT=https://openrouter.ai/api/v1/chat/completions
VITE_LLM_API_KEY=sk-or-your-key-here
VITE_LLM_MODEL=anthropic/claude-3-haiku
VITE_LLM_TEMPERATURE=0.8
VITE_LLM_MAX_TOKENS=800
```

## Production Deployment (Serverless Function)

For production, use the serverless function at `/api/llm/chat.js` to keep API keys secure:

### Vercel Deployment

Set these environment variables in your Vercel dashboard:
```
LLM_API_ENDPOINT=https://api.deepseek.com/v1/chat/completions
LLM_API_KEY=sk-your-api-key-here
LLM_MODEL=deepseek-chat
LLM_TEMPERATURE=0.8
LLM_MAX_TOKENS=800
```

### Other Platforms

Set the same environment variables (without `VITE_` prefix) in your deployment platform.

## Troubleshooting

### "POST http://localhost:5173/api/llm/chat 500 (Internal Server Error)"

**Problem**: You see this error in the browser console when trying to use fortune-telling

**Root Cause**: The development server is trying to proxy API requests to a non-existent backend server

**Solution**: This is now automatically handled! The app will:
1. Skip the serverless call in development mode
2. Use direct API calls if you have environment variables configured
3. Use smart template mode if no API is configured

**What This Means**:
- ✅ **Normal behavior** - The error will appear briefly in console but is immediately handled
- ✅ **App continues working** - You'll get either AI responses (if configured) or smart templates
- ✅ **No user impact** - The fortune-telling functionality works regardless

### Template Responses Instead of AI

**Problem**: Getting template-like responses

**Solutions**:
1. Check if your `.env` file has the correct API key
2. Restart your development server after changing `.env`
3. Check browser console for error messages
4. Verify your API key is valid and has credits

### CORS Errors

**Problem**: Cross-origin errors when calling APIs directly

**Solution**: Deploy with serverless function for production use

## Cost Estimates

- **DeepSeek**: ~$0.001 per request (very affordable)
- **OpenAI GPT-3.5**: ~$0.01-0.02 per request
- **OpenRouter**: Varies by model

## Testing Your Setup

1. Configure your API credentials in `.env`
2. Restart the development server
3. Try asking a fortune-telling question
4. Look for the WiFi icon (✅) or No-WiFi icon (⚠️) in the results
5. Check browser console for detailed logs

**The app will always provide results** - either real AI analysis or smart template responses!