# 🔒 Security & Deployment Guide

## Overview

This guide explains how to securely deploy your Fortune Telling App to Vercel while protecting sensitive API keys from client-side exposure.

## 🚨 Security Issue Fixed

**Problem**: Previously, LLM API keys were stored in client-side environment variables (prefixed with `VITE_`), making them visible to anyone who inspected the browser's network requests or JavaScript bundle.

**Solution**: We've implemented a secure server-side API route (`/api/llm/chat`) that handles all LLM API requests on the server, keeping your API keys completely hidden from the client.

## 🛠️ Architecture Changes

### Before (Insecure)
```
Browser → Direct API Call → LLM Provider (OpenAI/DeepSeek/etc.)
         ↑ API Key Exposed
```

### After (Secure)
```
Browser → Vercel API Route → LLM Provider (OpenAI/DeepSeek/etc.)
         ↑ No API Key      ↑ API Key Secure
```

## 📁 Files Modified

1. **`/api/llm/chat.js`** - New secure server-side API endpoint
2. **`src/App.tsx`** - Updated to use secure API route
3. **`.env`** - Removed sensitive API keys from client-side
4. **This guide** - Deployment instructions

## 🚀 Deployment Steps

### Step 1: Set Up Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following **server-side** environment variables:

#### For DeepSeek (Current Configuration)
```
LLM_API_ENDPOINT=https://api.deepseek.com/v1/chat/completions
LLM_API_KEY=sk-603a57ae782845ea8733f914e97d3004
LLM_MODEL=deepseek-chat
LLM_TEMPERATURE=0.8
LLM_MAX_TOKENS=800
LLM_TIMEOUT=30000
```

#### For OpenAI (Alternative)
```
LLM_API_ENDPOINT=https://api.openai.com/v1/chat/completions
LLM_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4o-mini
LLM_TEMPERATURE=0.8
LLM_MAX_TOKENS=800
LLM_TIMEOUT=30000
```

#### For Claude/Anthropic (Alternative)
```
LLM_API_ENDPOINT=https://api.anthropic.com/v1/messages
LLM_API_KEY=your_claude_api_key_here
LLM_MODEL=claude-3-sonnet-20240229
LLM_TEMPERATURE=0.8
LLM_MAX_TOKENS=800
LLM_TIMEOUT=30000
```

#### For OpenRouter (Alternative)
```
LLM_API_ENDPOINT=https://openrouter.ai/api/v1/chat/completions
LLM_API_KEY=your_openrouter_api_key_here
LLM_MODEL=anthropic/claude-3-sonnet
LLM_TEMPERATURE=0.8
LLM_MAX_TOKENS=800
LLM_TIMEOUT=30000
```

### Step 2: Update API Route Domain (Optional)

In `/api/llm/chat.js`, update line 42 with your actual domain:
```javascript
headers['HTTP-Referer'] = 'https://your-actual-domain.vercel.app';
```

### Step 3: Deploy to Vercel

```bash
# Build and test locally first
npm run build
npm run preview

# Deploy to Vercel
vercel --prod
```

### Step 4: Verify Security

1. Open your deployed app in the browser
2. Open Developer Tools → Network tab
3. Perform a fortune telling reading
4. Check that API calls go to `/api/llm/chat` (not directly to LLM providers)
5. Verify that no API keys are visible in the requests

## 🔍 Security Verification Checklist

- [ ] API keys are not in client-side `.env` file
- [ ] API keys are set in Vercel environment variables
- [ ] Browser network requests show `/api/llm/chat` endpoint only
- [ ] No API keys visible in browser developer tools
- [ ] No API keys in JavaScript bundle (check source)
- [ ] Fortune telling functionality works correctly

## 🛡️ Additional Security Recommendations

### 1. Rate Limiting
Consider adding rate limiting to prevent API abuse:

```javascript
// In /api/llm/chat.js
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
};
```

### 2. Request Validation
Add input validation to prevent malicious requests:

```javascript
// Validate message content length
if (messages.some(msg => msg.content.length > 10000)) {
  return res.status(400).json({ error: 'Message too long' });
}
```

### 3. CORS Configuration
Restrict API access to your domain only:

```javascript
// Add CORS headers
res.setHeader('Access-Control-Allow-Origin', 'https://your-domain.vercel.app');
```

### 4. API Key Rotation
Regularly rotate your API keys and update them in Vercel environment variables.

## 🔧 Troubleshooting

### Common Issues

1. **"LLM API configuration missing" error**
   - Check that environment variables are set in Vercel dashboard
   - Ensure variable names match exactly (no `VITE_` prefix)

2. **API calls failing**
   - Verify API endpoint URLs are correct
   - Check API key validity
   - Review Vercel function logs

3. **Timeout errors**
   - Increase `LLM_TIMEOUT` value
   - Check LLM provider status

### Debugging

View Vercel function logs:
```bash
vercel logs your-project-name
```

## 📊 Cost Optimization

1. **Token Limits**: Set appropriate `LLM_MAX_TOKENS` to control costs
2. **Model Selection**: Use cost-effective models like `gpt-3.5-turbo` or `deepseek-chat`
3. **Caching**: Consider implementing response caching for similar queries
4. **Monitoring**: Set up billing alerts with your LLM provider

## 🔄 Migration from Old Setup

If you're migrating from the old insecure setup:

1. Remove old `VITE_LLM_*` variables from Vercel environment variables
2. Add new server-side variables (without `VITE_` prefix)
3. Redeploy your application
4. Test thoroughly

## 📞 Support

If you encounter issues:

1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Test API endpoints manually
4. Review this guide for missed steps

---

**✅ Your API keys are now secure and hidden from client-side access!**

The app will continue to work exactly as before, but with enterprise-grade security protecting your sensitive API credentials.