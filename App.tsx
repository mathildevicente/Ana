import React, { useState, useRef, useEffect } from 'react';
import { UserData, AppState, ChatMessage } from './types';
import { Onboarding } from './components/Onboarding';
import { MessageBubble } from './components/MessageBubble';
import { Button } from './components/Button';
import { initializeChat, sendMessageToAna } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    try {
      initializeChat(data);
      setAppState(AppState.CHATTING);
    } catch (e) {
      console.error("Failed to init chat", e);
      setAppState(AppState.ERROR);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const userText = inputText.trim();
    setInputText('');
    setIsProcessing(true);

    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userText }]);

    const anaMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: anaMsgId, role: 'ana', text: '', isTyping: true }]);

    try {
      const stream = await sendMessageToAna(userText);
      
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === anaMsgId 
            ? { ...msg, text: fullResponse, isTyping: true } 
            : msg
        ));
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === anaMsgId 
          ? { ...msg, isTyping: false } 
          : msg
      ));

    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === anaMsgId 
          ? { ...msg, text: "(Ana semble distraite...)", isTyping: false } 
          : msg
      ));
    } finally {
      setIsProcessing(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  if (appState === AppState.ERROR) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-white/80 font-display">
        SYSTEM FAILURE.
      </div>
    );
  }

  if (appState === AppState.ONBOARDING) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center p-4 md:p-8">
      
      {/* Background Orbs (Positioned to match image) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="bg-gradient-to-br from-[#8EC5FC] to-[#E0C3FC] absolute inset-0 opacity-20"></div>
        {/* Top Left Red/Orange */}
        <div className="orb orb-red w-[500px] h-[500px] top-[-100px] left-[-100px] animate-float-slow"></div>
        {/* Right Green */}
        <div className="orb orb-green w-[600px] h-[600px] top-[20%] right-[-200px] animate-float-medium"></div>
        {/* Bottom Purple */}
        <div className="orb orb-purple w-[400px] h-[400px] bottom-[-100px] left-[20%] animate-float-slow"></div>
      </div>

      {/* THE GLASS CARD */}
      <div className="relative z-10 w-full max-w-[500px] h-[85vh] md:h-[800px] flex flex-col rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/10 overflow-hidden animate-fade-in">
        
        {/* Card Header - Outlined Text */}
        <header className="px-8 pt-8 pb-4 flex flex-col items-center justify-center relative z-20 shrink-0">
          <h2 className="text-6xl font-display font-bold tracking-tight text-outline select-none opacity-90">
            ANA
          </h2>
          <div className="w-12 h-0.5 bg-white/30 mt-4 rounded-full"></div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
              <p className="text-white font-display text-lg uppercase tracking-widest mb-2">
                Digital Connection
              </p>
              <p className="text-white/60 text-sm font-light">
                Start the conversation
              </p>
            </div>
          )}
          
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Glass Pill style */}
        <div className="p-6 shrink-0 z-20">
          <form onSubmit={handleSendMessage} className="relative flex flex-col gap-3">
             <div className="relative group">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isProcessing}
                  placeholder="Type a message..."
                  className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-white/40 transition-all font-sans font-light shadow-inner"
                  autoFocus
                />
             </div>
            
             <Button 
                type="submit" 
                variant="glass-pill"
                disabled={!inputText.trim() || isProcessing}
                isLoading={isProcessing}
                className="w-full h-12 text-sm"
              >
                Send Message
              </Button>
          </form>
        </div>
      </div>

      {/* Decorative Corner text: 2030 */}
      <div className="absolute top-8 right-8 text-white/40 font-display font-bold text-xl tracking-widest z-0 pointer-events-none hidden md:block">
        2030
      </div>

    </div>
  );
};

export default App;