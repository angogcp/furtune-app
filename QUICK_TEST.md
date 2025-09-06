# Quick Test Guide

## Testing the Fixed LLM Integration

### Current State (Template Mode)
1. **Open the app**: Click the preview button to open http://localhost:5177
2. **Navigate**: Click on any fortune-telling method (e.g., "八字命理" or "塔罗占卜")
3. **Ask a question**: Type any question like "健康" or "工作运势如何"
4. **Click "开始"**: The app will process and show results
5. **Check the result**: You should see:
   - ⚠️ "智能模板模式" indicator 
   - 🔌 "离线模式" status in results
   - Contextual, relevant response (not generic)

### What's Fixed
- ✅ **No more 500 errors**: App gracefully handles missing serverless function
- ✅ **Smart fallback**: Generates contextual responses based on question topics
- ✅ **Clear status**: Shows whether AI or template mode is active
- ✅ **Better UX**: Always provides meaningful results

### Console Output
Check browser DevTools Console to see:
```
Starting divination process...
LLM Service configured: false
Serverless function not available in development mode
LLM API not configured, using enhanced fallback
```

### To Enable Real AI (Optional)
1. **Get a DeepSeek API key**: Sign up at https://platform.deepseek.com/
2. **Edit `.env`**: Uncomment and add your API key:
   ```env
   VITE_LLM_API_ENDPOINT=https://api.deepseek.com/v1/chat/completions
   VITE_LLM_API_KEY=sk-your-actual-api-key-here
   VITE_LLM_MODEL=deepseek-chat
   VITE_LLM_TEMPERATURE=0.8
   VITE_LLM_MAX_TOKENS=800
   ```
3. **Server will auto-restart**: Vite detects `.env` changes
4. **Test again**: Should see "AI分析已配置" and real AI responses

### Expected Behavior
- **Without API**: Smart template responses, clearly marked as template mode
- **With API**: Real AI analysis, marked with "AI分析" status
- **API Failure**: Graceful fallback to smart templates with error message

The error `POST http://localhost:5173/api/llm/chat 500` is now handled gracefully and won't prevent the app from working!