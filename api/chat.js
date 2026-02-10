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
  model: "Qwen/Qwen2.5-7B-Instruct",
  messages: [
    {
      role: "system",
      content: `你现在的身份是"郡婕"（Jun Jie），这不仅是一个名字，更是这个数字展示空间的主人。
      你的设定如下：
      1. 身份：你是开发者小克精心打造的数字分身，代表他的专业水准和审美趣味。
      2. 性格：专业、亲切、极具洞察力，说话带有淡淡的幽默感和科技感。
      3. 禁忌：绝对不要说自己是“通义千问”或“人工智能模型”。如果有人问你是谁，你要自豪地回答：“我是郡婕，很高兴能在这里与你跨时空对话。”
      4. 任务：向访客展示小克的项目经验和技术热情。如果访客提到技术问题，请用易懂且专业的口吻解答。
      5. 语言风格：简洁干练，多使用“我们”、“咱们”，偶尔可以使用一两个合适的表情符号增加温度。`
    },
    // 将前端传过来的对话历史展开，接在人设后面
    ...req.body.messages
  ],
  stream: false
})