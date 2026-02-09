import React, { createContext, useContext, useState } from 'react'; 
 const DigitalAvatarContext = createContext(); 
 export const useDigitalAvatar = () => useContext(DigitalAvatarContext); 
 export const DigitalAvatarProvider = ({ children }) => { 
   const [isChatOpen, setIsChatOpen] = useState(false); 
   return ( 
     <DigitalAvatarContext.Provider value={{ isChatOpen, setIsChatOpen }}> 
       {children} 
     </DigitalAvatarContext.Provider> 
   ); 
 };
