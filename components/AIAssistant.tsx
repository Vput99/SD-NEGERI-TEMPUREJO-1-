
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Halo! Saya Bu Guru AI. Ada yang bisa saya bantu mengenai SD Negeri Tempurejo 1 Kota Kediri?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyTexts = messages.map(m => m.text);
    const responseText = await sendMessageToGemini(userMsg.text, historyTexts);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText || 'Maaf, saya tidak mengerti.',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      <div 
        className={`bg-white/95 backdrop-blur-xl w-80 sm:w-96 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto border border-white/50 ring-1 ring-black/5 ${
          isOpen ? 'scale-100 opacity-100 mb-4' : 'scale-0 opacity-0 mb-0 h-0'
        }`}
      >
        {/* Header */}
        <div className="bg-brand-primary p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
              👩‍🏫
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Bu Guru AI</h3>
              <p className="text-emerald-100 text-xs">Asisten Sekolah Pintar</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white bg-white/10 rounded-full p-1 hover:bg-white/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="h-80 overflow-y-auto p-4 bg-brand-light/30 space-y-3">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-brand-primary text-white rounded-br-sm shadow-md shadow-brand-primary/20' 
                  : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 flex gap-1">
                <span className="w-2 h-2 bg-brand-primary/50 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-brand-primary/50 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-brand-primary/50 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pertanyaan..."
            className="flex-grow bg-slate-50 text-sm px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/50 border border-slate-200"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-brand-primary text-white p-3 rounded-full hover:bg-brand-secondary disabled:opacity-50 transition-colors shadow-lg shadow-brand-primary/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-primary hover:bg-brand-secondary text-white w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(5,150,105,0.4)] flex items-center justify-center transition-transform hover:scale-110 pointer-events-auto border-2 border-white/20 backdrop-blur-sm animate-bounce"
      >
        {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        ) : (
            <span className="text-2xl">🌿</span>
        )}
      </button>
    </div>
  );
};

export default AIAssistant;
