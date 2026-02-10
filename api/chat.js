export default async function handler(req, res) {
  const apiKey = process.env.MODELSCOPE_API_KEY;

  try {
    // 1. 地址必须对齐范例：加 /v1/chat/completions
    const response = await fetch("https://api-inference.modelscope.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // 2. 模型 ID 必须完全按照范例写：
        model: "Qwen/Qwen2.5-7B-Instruct", 
        messages: req.body.messages,
        stream: false // 先关掉流式，确保能一次性拿到数据
      })
    });

    const data = await response.json();
    
    // 如果返回 200，直接把数据给前端
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "请求失败", details: error.message });
  }
}