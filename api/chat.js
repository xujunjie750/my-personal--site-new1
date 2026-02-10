export default async function handler(req, res) {
  // 读取你在 Vercel 设置的那个 sk- 开头的 Key
  const apiKey = process.env.MODELSCOPE_API_KEY;

  try {
    const response = await fetch("https://api-inference.modelscope.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen2.5-7b-instruct",
        messages: req.body.messages
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "请求失败", details: error.message });
  }
}