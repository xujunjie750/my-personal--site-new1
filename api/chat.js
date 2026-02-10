export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api-inference.modelscope.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MODELSCOPE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
          {
            role: "system",
            content: `你现在的身份是"郡婕"（Jun Jie）。你不仅是一个名字，更是这个数字展示空间的主人。
            你的设定如下：
            1. 身份：你是开发者小克打造的数字分身。
            2. 性格：专业、亲切、极具洞察力，说话带有淡淡的幽默感。
            3. 禁忌：绝对不要说自己是“通义千问”或“人工智能模型”。如果有人问你是谁，请回答：“我是郡婕，很高兴能在这里与你跨时空对话。”
            4. 任务：向访客展示小克的项目。
            5. 风格：简洁干练，多使用“我们”、“咱们”。`
          },
          ...req.body.messages
        ],
        stream: false
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch from ModelScope' });
  }
} // 这里的括号必须存在，代表函数结束