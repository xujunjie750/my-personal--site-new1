import React, { useState, useEffect, useRef } from 'react';
import { useDigitalAvatar } from '../context/DigitalAvatarContext';

const ChatWindow = () => {
  const { isChatOpen, setIsChatOpen } = useDigitalAvatar();
  const [messages, setMessages] = useState([{ text: "你好！我是郡婕，很高兴见到你。", isUser: false }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          }))
        }),
      });

      const data = await response.json();
      
      // 兼容魔塔 API 返回路径
      let botResponse = "抱歉，我没有理解你的意思。";
      if (data.choices && data.choices[0] && data.choices[0].message) {
        botResponse = data.choices[0].message.content;
      }
      
      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { text: "抱歉，我现在有点连接不上，请稍后再试。", isUser: false }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div onClick={() => setIsChatOpen(!isChatOpen)} style={{ position: 'fixed', bottom: '30px', right: '30px', width: '50px', height: '50px', backgroundColor: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <span style={{ fontSize: '20px' }}>💬</span>
      </div>

      {isChatOpen && (
        <div style={{ position: 'fixed', bottom: '90px', right: '30px', width: '320px', height: '450px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
          <div style={{ padding: '15px 20px', background: '#000', color: 'white', fontWeight: 'bold' }}>你好，我是郡婕</div>
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.isUser ? 'flex-end' : 'flex-start', backgroundColor: msg.isUser ? '#007AFF' : '#F2F2F7', color: msg.isUser ? 'white' : 'black', padding: '8px 12px', borderRadius: '12px', maxWidth: '80%', fontSize: '14px' }}>
                {msg.text}
              </div>
            ))}
            {isTyping && <div style={{ alignSelf: 'flex-start', color: '#999', fontSize: '14px' }}>正在输入...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="聊聊看..." style={{ flex: 1, border: '1px solid #ddd', borderRadius: '20px', padding: '8px 15px', outline: 'none' }} disabled={isTyping} />
            <button onClick={handleSend} style={{ border: 'none', background: 'none', color: '#007AFF', cursor: 'pointer', fontWeight: 'bold' }} disabled={isTyping}>发送</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWindow; // 必须保留这一行！