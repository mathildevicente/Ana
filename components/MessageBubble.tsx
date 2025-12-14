import React from 'react';
import { ChatMessage } from '../types';
import { TypingIndicator } from './TypingIndicator';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAna = message.role === 'ana';

  return (
    <div className={`flex w-full ${isAna ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      <div 
        className={`
          max-w-[85%] px-5 py-3 rounded-2xl backdrop-blur-sm
          ${isAna 
            ? 'bg-white/10 border border-white/10 text-white rounded-tl-none' 
            : 'bg-white/20 border border-white/20 text-white rounded-br-none font-medium'
          }
        `}
      >
        <div className="text-sm md:text-base leading-relaxed font-sans">
          {message.text}
          {message.isTyping && <TypingIndicator />}
        </div>
      </div>
    </div>
  );
};