const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid "messages" in request body' });
  }

  const apiKey = process.env.MODELSCOPE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'MODELSCOPE_API_KEY is not set on the server' });
  }

  const systemPrompt = {
    role: 'system',
    content: '你是郡婕，一个友好、专业且具有亲和力的数字助理。'
  };

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        input: {
          messages: [systemPrompt, ...messages]
        },
        parameters: {}
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('ModelScope API Error:', errorBody);
      return res.status(response.status).json({ error: `ModelScope API error: ${errorBody}` });
    }

    const data = await response.json();
    
    if (data && data.output && data.output.text) {
      res.status(200).json({ reply: data.output.text });
    } else {
      console.error('Unexpected API response structure:', data);
      res.status(500).json({ error: 'Unexpected API response structure' });
    }

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
