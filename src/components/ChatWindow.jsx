import React, { useState } from 'react';
import { useDigitalAvatar } from '../context/DigitalAvatarContext';

const ChatWindow = () => {
  const { isChatOpen, setIsChatOpen } = useDigitalAvatar();

  return (
    <>
      {/* 右下角的浮动触发按钮 */}
      <div 
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          backgroundColor: '#ff69b4', // 粉色，让你一眼能看到
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '24px'
        }}
      >
        💬
      </div>

      {/* 实际的聊天窗口 */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '30px',
          width: '300px',
          height: '400px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          border: '1px solid #eee'
        }}>
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px', fontWeight: 'bold' }}>
            小可助理
          </div>
          <div style={{ flex: 1, color: '#666' }}>你好！我是你的 AI 助理。</div>
          <input type="text" placeholder="输入消息..." style={{ width: '100%', padding: '8px', marginTop: '10px' }} />
        </div>
      )}
    </>
  );
};

export default ChatWindow;