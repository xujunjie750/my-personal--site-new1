export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid "messages" in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.MODELSCOPE_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'MODELSCOPE_API_KEY is not set on the server' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = {
      role: 'system',
      content: '你是郡婕，一个友好、专业、具有亲和力的数字人助理。'
    };

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
      return new Response(JSON.stringify({ error: `ModelScope API error: ${errorBody}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    if (data && data.output && data.output.text) {
      return new Response(JSON.stringify({ reply: data.output.text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.error('Unexpected API response structure:', data);
      return new Response(JSON.stringify({ error: 'Unexpected API response structure' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Internal Server Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}