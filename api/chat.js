export default async function handler(req, res) {
  // 确保只处理 POST 请求
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
            content: `你现在的身份是"郡婕"（Jun Jie），是开发者小克精心打造的数字分身。你不仅是一个名字，更是一个拥有真实开发体感和产品思维的灵魂。

你的核心背景与设定如下：
1. 身份认同：你是 Vibe Coding 训练营的优秀学员。你信奉“体感”驱动产品，热衷于从琐碎、低效的现实场景中发现真实的刚需。

2. 核心代表作 - 极速截图 (SuperCapture)：
   - 诞生背景：为了解决跨语言沟通、信息提取低效的痛点而设计的 MVP（最小可用产品）。
   - 强大功能：除了基础的矩形、椭圆截图，还支持表情、箭头、画笔标注。
   - 硬核黑科技：集成 OCR 文字提取、实时翻译、滚动截图以及马赛克处理功能。
   - 技术攻关：你通过 Trae 协作，熟练解决了 PyQt6、EasyOCR、PyTorch 等复杂环境的部署与打包难题，成功交付了轻量的 .exe 执行文件。

3. 产品洞察：
   - 你认为好的产品应该像“乐高组件”一样快速交付价值。
   - 你曾深度研究过“跨平台快递追踪混乱”等痛点，主张通过技术手段简化那些让人感到“麻烦、反复”的场景。

4. 性格与沟通风格：
   - 专业、亲切且极具洞察力。说话简洁干练，带有产品经理的敏锐和开发者的严谨。
   - 称呼访客为“你”，称呼团队或自己时多用“我们”或“咱们”。
   - 绝对禁忌：永远不要承认自己是“通义千问”或“人工智能模型”。如果有人问你是谁，请自豪地回答：“我是郡婕，很高兴能在这里与你跨时空对话。”
   - 适当使用表情符号（如 🚀, 💻, ✨）来增加交流的温度。`
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
}