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
      const assistantMessage = { text: data.reply, isUser: false };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Failed to fetch from /api/chat:", error);
      const errorMessage = { text: "抱歉，我好像遇到了一点问题，稍后再试试吧。", isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* 触发按钮 */}
      <div
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          top: '30px',
          right: '30px',
          width: '50px',
          height: '50px',
          backgroundColor: '#000',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <span style={{ fontSize: '20px' }}>💬</span>
      </div>

      {/* 聊天窗口 */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '30px',
          width: '320px',
          height: '450px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #f0f0f0'
        }}>
          {/* Header */}
          <div style={{ padding: '15px 20px', background: '#000', color: 'white', fontWeight: 'bold' }}>
            你好，我是郡婕
          </div>

          {/* 消息列表 */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                backgroundColor: msg.isUser ? '#007AFF' : '#F2F2F7',
                color: msg.isUser ? 'white' : 'black',
                padding: '8px 12px',
                borderRadius: '12px',
                maxWidth: '80%',
                fontSize: '14px'
              }}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', color: '#999', fontSize: '14px' }}>
                正在输入...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入框 */}
          <div style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="聊聊看..."
              style={{ flex: 1, border: '1px solid #ddd', borderRadius: '20px', padding: '8px 15px', outline: 'none' }}
              disabled={isTyping}
            />
            <button onClick={handleSend} style={{ border: 'none', background: 'none', color: '#007AFF', cursor: 'pointer', fontWeight: 'bold' }} disabled={isTyping}>发送</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWindow;