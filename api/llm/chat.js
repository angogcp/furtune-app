// Vercel serverless function to handle LLM API requests securely
// This keeps the API key on the server side and prevents client-side exposure

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get configuration from environment variables (server-side only)
    const API_ENDPOINT = process.env.LLM_API_ENDPOINT;
    const API_KEY = process.env.LLM_API_KEY;
    const API_MODEL = process.env.LLM_MODEL || 'gpt-3.5-turbo';
    const API_TEMPERATURE = parseFloat(process.env.LLM_TEMPERATURE || '0.8');
    const API_MAX_TOKENS = parseInt(process.env.LLM_MAX_TOKENS || '800');
    const API_TIMEOUT = parseInt(process.env.LLM_TIMEOUT || '30000');

    // Validate required environment variables
    if (!API_ENDPOINT || !API_KEY) {
      return res.status(500).json({ 
        error: 'LLM API configuration missing. Please set LLM_API_ENDPOINT and LLM_API_KEY environment variables.' 
      });
    }

    // Extract request data
    const { messages, temperature, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' });
    }

    // Prepare headers based on API provider
    const headers = {
      'Content-Type': 'application/json'
    };

    // Configure headers for different providers
    if (API_ENDPOINT.includes('openai.com')) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    } else if (API_ENDPOINT.includes('deepseek.com')) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    } else if (API_ENDPOINT.includes('openrouter.ai')) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
      headers['HTTP-Referer'] = 'https://your-domain.vercel.app'; // Update with your actual domain
      headers['X-Title'] = 'Fortune Telling App';
    } else if (API_ENDPOINT.includes('anthropic.com')) {
      headers['x-api-key'] = API_KEY;
      headers['anthropic-version'] = '2023-06-01';
    } else {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    }

    // Prepare request body based on API provider
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

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      // Make request to LLM API
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('LLM API Error:', response.status, errorText);
        return res.status(response.status).json({ 
          error: `LLM API Error: ${response.status} ${response.statusText}`,
          details: errorText
        });
      }

      const data = await response.json();
      
      // Return the response to the client
      return res.status(200).json(data);

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return res.status(408).json({ error: 'Request timeout' });
      }
      
      console.error('Fetch error:', fetchError);
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
}

// Export the handler for Vercel
export { handler as default };