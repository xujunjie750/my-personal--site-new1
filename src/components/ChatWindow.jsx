const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, isUser: true };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // --- 关键修正开始 ---
      // 魔塔标准路径是 data.choices[0].message.content
      let botResponse = "抱歉，我没有理解你的意思。";
      if (data.choices && data.choices[0] && data.choices[0].message) {
        botResponse = data.choices[0].message.content;
      }
      
      const assistantMessage = { text: botResponse, isUser: false };
      // --- 关键修正结束 ---
      
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Failed to fetch from /api/chat:", error);
      const errorMessage = { text: "抱歉，我好像遇到了一点问题，稍后再试试吧。", isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };