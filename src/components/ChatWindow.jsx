import React, { useState } from 'react'; 
 import { useDigitalAvatar } from '../context/DigitalAvatarContext'; 
 
 const ChatWindow = () => { 
   const { isChatOpen, setIsChatOpen } = useDigitalAvatar(); 
   const [messages, setMessages] = useState([{ text: "你好！我是郡婕，很高兴见到你。", isUser: false }]); 
   const [inputValue, setInputValue] = useState(''); 
 
   const handleSend = () => { 
     if (!inputValue.trim()) return; 
     // 添加用户消息 
     const newMessages = [...messages, { text: inputValue, isUser: true }]; 
     setMessages(newMessages); 
     setInputValue(''); 
 
     // 模拟郡婕的回应 
     setTimeout(() => { 
       setMessages(prev => [...prev, { text: "收到啦！这只是个初步演示，之后我可以接入真正的 AI 哦。", isUser: false }]); 
     }, 1000); 
   }; 
 
   return ( 
     <> 
       {/* 触发按钮：移动到右上角 */} 
       <div 
         onClick={() => setIsChatOpen(!isChatOpen)} 
         style={{ 
           position: 'fixed', 
           top: '30px',      // 改为顶部 
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
 
       {/* 聊天窗口：移动到右上角 */} 
       {isChatOpen && ( 
         <div style={{ 
           position: 'fixed', 
           top: '90px',      // 位于按钮下方 
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
           {/* Header：修改名字 */} 
           <div style={{ padding: '15px 20px', background: '#000', color: 'white', fontWeight: 'bold' }}> 
             你好，我是郡婕 
           </div> 
 
           {/* 消息列表：现在可以滚动并显示多条消息 */} 
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
           </div> 
 
           {/* 输入框：激活发送功能 */} 
           <div style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}> 
             <input 
               value={inputValue} 
               onChange={(e) => setInputValue(e.target.value)} 
               onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
               placeholder="聊聊看..." 
               style={{ flex: 1, border: '1px solid #ddd', borderRadius: '20px', padding: '8px 15px', outline: 'none' }} 
             /> 
             <button onClick={handleSend} style={{ border: 'none', background: 'none', color: '#007AFF', cursor: 'pointer', fontWeight: 'bold' }}>发送</button> 
           </div> 
         </div> 
       )} 
     </> 
   ); 
 }; 
 
 export default ChatWindow;