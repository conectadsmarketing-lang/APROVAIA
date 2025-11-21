
import React, { useState, useRef, useLayoutEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { getChatResponse, ChatMode } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Markdown } from '../components/Markdown';

export const ProfessorIA: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      content: 'Olá! Sou o **Professor APROVAIa 6.0**. Escolha um estilo acima e vamos estudar! 🚀',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>('standard');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Robust Scroll Implementation
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useLayoutEffect(() => {
    requestAnimationFrame(scrollToBottom);
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const responseText = await getChatResponse(history, userMsg.content, mode);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText || "Não entendi, pode repetir?",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
      
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "⚠️ Ocorreu um erro na conexão. Tente novamente.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const modeLabels: Record<ChatMode, string> = {
    standard: 'Padrão',
    child: 'Criança',
    university: 'PhD',
    analogy: 'Analogias',
    funny: 'Engraçado',
    technical: 'Técnico',
    summarized: 'Resumido'
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in zoom-in duration-300">
      <BackButton className="mb-4" />
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="text-[#6CFF95]" /> Professor IA 6.0
          </h1>
          <p className="text-gray-500 text-sm">Gemini 2.5 - Sua mentoria definitiva.</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-2 bg-[#121214] p-1 rounded-lg border border-white/10 overflow-x-auto max-w-[280px] md:max-w-none scrollbar-hide">
             {(Object.keys(modeLabels) as ChatMode[]).map((m) => (
               <button
                 key={m}
                 onClick={() => setMode(m)}
                 className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${mode === m ? 'bg-[#6CFF95] text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
               >
                 {modeLabels[m]}
               </button>
             ))}
           </div>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden relative" noPadding border>
        {/* Chat Area - Scroll Fixed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                flex max-w-[95%] md:max-w-[85%] gap-4 
                ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}
              `}>
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border
                  ${msg.role === 'user' ? 'bg-[#121214] border-white/10' : 'bg-[#6CFF95]/10 text-[#6CFF95] border-[#6CFF95]/20'}
                `}>
                  {msg.role === 'user' ? <User size={18} className="text-gray-400" /> : <Bot size={20} />}
                </div>
                
                <div className={`
                  p-5 rounded-2xl text-sm shadow-lg
                  ${msg.role === 'user' 
                    ? 'bg-[#6CFF95] text-black font-medium rounded-br-none' 
                    : 'bg-[#1E1E22] text-gray-200 border border-white/5 rounded-bl-none'}
                `}>
                  {msg.role === 'model' ? (
                    <Markdown content={msg.content} />
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-in fade-in">
               <div className="flex max-w-[80%] gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#6CFF95]/10 text-[#6CFF95] flex items-center justify-center border border-[#6CFF95]/20">
                   <Sparkles size={18} className="animate-pulse" />
                 </div>
                 <div className="bg-[#1E1E22] p-4 rounded-2xl rounded-bl-none text-gray-500 text-sm flex items-center gap-1 border border-white/5">
                   <span>Gerando resposta no modo <strong>{modeLabels[mode]}</strong></span>
                   <span className="animate-bounce">.</span>
                   <span className="animate-bounce delay-100">.</span>
                   <span className="animate-bounce delay-200">.</span>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#121214] border-t border-white/5">
          <div className="flex gap-3 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Pergunte algo ao Professor ${modeLabels[mode]}...`}
              className="flex-1 bg-[#09090B] border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#6CFF95] focus:ring-1 focus:ring-[#6CFF95] text-white placeholder-gray-600 transition-all"
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="rounded-xl w-14 px-0 flex items-center justify-center bg-[#6CFF95] hover:bg-[#5AE885] text-black">
              <Send size={22} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
