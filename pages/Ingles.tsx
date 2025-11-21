
import React, { useState, useRef, useLayoutEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { Globe, MessageCircle, Book, Zap, RefreshCw, Send, Check } from 'lucide-react';
import { db } from '../services/mockDb';
import { generateEnglishLesson, getEnglishChatResponse, generateFlashcards } from '../services/geminiService';
import { EnglishLesson, ChatMessage } from '../types';
import { Markdown } from '../components/Markdown';

const LevelBadge: React.FC<{ level: string }> = ({ level }) => (
  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/10 text-pink-500 border border-pink-500/20">
    {level}
  </span>
);

export const InglesPage: React.FC = () => {
  const [user] = useState(db.getUser());
  const [tab, setTab] = useState<'lessons' | 'trainer' | 'flashcards'>('lessons');

  // LESSON STATE
  const [lesson, setLesson] = useState<EnglishLesson | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  
  // TRAINER STATE
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', content: `Hello ${user.name}! I am your English Teacher. Let's practice. How was your day?`, timestamp: new Date().toISOString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // FLASHCARDS STATE
  const [engCards, setEngCards] = useState<Array<{front: string, back: string}>>([]);
  const [loadingCards, setLoadingCards] = useState(false);

  // Auto Scroll for Chat
  useLayoutEffect(() => {
    if (chatEndRef.current && tab === 'trainer') {
      requestAnimationFrame(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages, chatLoading, tab]);

  // --- HANDLERS ---

  const handleCreateLesson = async () => {
    setLoadingLesson(true);
    try {
        const result = await generateEnglishLesson(user.englishLevel);
        if (result && (result.vocabulary || result.dialogue)) {
          setLesson({
            id: Date.now().toString(),
            level: user.englishLevel,
            completed: false,
            content: result
          } as any);
        } else {
            alert("A IA não conseguiu gerar a aula. Tente novamente.");
        }
    } catch (e) {
        console.error(e);
        alert("Erro de conexão.");
    }
    setLoadingLesson(false);
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: chatInput, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    const response = await getEnglishChatResponse(
      messages.map(m => ({role: m.role, content: m.content})),
      userMsg.content,
      user.englishLevel
    );

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: response || "I didn't understand.", timestamp: new Date().toISOString() }]);
    setChatLoading(false);
  };

  const handleGenFlashcards = async () => {
    setLoadingCards(true);
    setEngCards([]);
    try {
      const cards = await generateFlashcards(`Common phrases for ${user.englishLevel}`, 'english');
      if (cards && Array.isArray(cards)) {
        setEngCards(cards);
      }
    } catch (e) {
      alert("Error generating cards.");
    }
    setLoadingCards(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <BackButton className="mb-4" />

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-3xl p-8 border border-pink-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 p-8 opacity-10">
          <Globe size={200} className="text-pink-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <LevelBadge level={user.englishLevel} />
            <span className="text-pink-400 text-xs font-bold uppercase tracking-widest">Módulo Internacional</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">English Fluency IA</h1>
          <p className="text-gray-300 max-w-xl">
            Sua IA treinadora pessoal. Converse, aprenda vocabulário e corrija sua gramática em tempo real.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 border-b border-white/10 pb-1 overflow-x-auto">
        {[
          { id: 'lessons', label: 'Aula do Dia', icon: Book },
          { id: 'trainer', label: 'Treinador (Chat)', icon: MessageCircle },
          { id: 'flashcards', label: 'Vocabulário', icon: Zap }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id as any)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold transition-all whitespace-nowrap
              ${tab === item.id 
                ? 'bg-[#121214] text-white border-t border-x border-white/10 border-b-[#121214] -mb-[1px]' 
                : 'text-gray-500 hover:text-white'}
            `}
          >
            <item.icon size={16} className={tab === item.id ? 'text-pink-500' : ''} />
            {item.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[400px]">
        
        {/* TAB: LESSONS */}
        {tab === 'lessons' && (
          <div className="space-y-6">
            {!lesson ? (
              <Card className="text-center py-12 border-pink-500/20 bg-pink-500/5">
                <Book size={48} className="mx-auto text-pink-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Aula Diária ({user.englishLevel})</h3>
                <p className="text-gray-400 mb-6">A IA preparou uma aula personalizada baseada no seu nível.</p>
                <Button onClick={handleCreateLesson} isLoading={loadingLesson} className="bg-pink-600 hover:bg-pink-700">
                  Iniciar Aula
                </Button>
              </Card>
            ) : (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">{lesson?.title || "Aula Gerada"}</h2>
                  <Button variant="outline" onClick={() => setLesson(null)}>Fechar Aula</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Vocabulary */}
                  <Card>
                    <h3 className="font-bold text-pink-500 mb-4">New Vocabulary</h3>
                    <div className="space-y-3">
                      {lesson.content?.vocabulary?.map((vocab: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-[#18181B] border border-white/5">
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-white">{vocab?.word}</span>
                            <span className="text-gray-500 text-sm italic">{vocab?.translation}</span>
                          </div>
                          <p className="text-xs text-gray-400">"{vocab?.example}"</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Dialogue */}
                  <Card>
                    <h3 className="font-bold text-pink-500 mb-4">Dialogue Practice</h3>
                    <div className="space-y-4">
                      {lesson.content?.dialogue?.map((line: any, i: number) => (
                        <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                            {line?.speaker?.[0]}
                          </div>
                          <div className={`p-3 rounded-xl text-sm max-w-[80%] ${i % 2 === 0 ? 'bg-[#18181B] text-gray-200' : 'bg-pink-900/20 text-pink-100'}`}>
                            <p className="font-medium mb-1">{line?.text}</p>
                            <p className="text-xs opacity-50">{line?.translation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Grammar Tip */}
                  <Card className="lg:col-span-2 bg-pink-500/10 border-pink-500/20">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-pink-500/20 rounded-lg text-pink-500">
                        <Zap size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white mb-1">Grammar Tip</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{lesson.content?.grammarTip || "No tips for today."}</p>
                      </div>
                    </div>
                  </Card>
                  
                  <div className="lg:col-span-2">
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => { setLesson(null); alert('Aula concluída! +50 XP'); }}>
                      <Check className="mr-2" size={18} /> Marcar como Concluída (+50 XP)
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: TRAINER (CHAT) */}
        {tab === 'trainer' && (
          <Card className="h-[600px] flex flex-col p-0 bg-[#0E0F11] border-white/10 relative" noPadding>
            <div className="absolute top-0 left-0 right-0 p-4 bg-[#18181B] border-b border-white/5 z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">English Coach IA</h3>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pt-20 space-y-4 custom-scrollbar scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-pink-600 text-white rounded-br-none' : 'bg-[#18181B] text-gray-300 border border-white/5 rounded-bl-none'}`}>
                    <Markdown content={msg.content} />
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#18181B] p-4 rounded-2xl rounded-bl-none border border-white/5 flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} className="h-1" />
            </div>

            <div className="p-4 bg-[#18181B] border-t border-white/5">
              <div className="flex gap-2">
                <input 
                  className="flex-1 bg-[#0E0F11] border border-white/10 rounded-xl px-4 text-white focus:border-pink-500 outline-none transition-colors"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChatSend()}
                  disabled={chatLoading}
                />
                <Button onClick={handleChatSend} disabled={!chatInput.trim() || chatLoading} className="bg-pink-600 hover:bg-pink-700 rounded-xl px-4">
                  <Send size={20} />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* TAB: FLASHCARDS */}
        {tab === 'flashcards' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
               <h3 className="font-bold text-white">Vocabulário do Nível {user.englishLevel}</h3>
               <Button onClick={handleGenFlashcards} isLoading={loadingCards} size="sm" variant="secondary">
                 <RefreshCw className="mr-2" size={16} /> Gerar Novos
               </Button>
            </div>

            {engCards.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                <Zap className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-500">Clique em "Gerar Novos" para praticar palavras essenciais.</p>
                <Button onClick={handleGenFlashcards} className="mt-4" isLoading={loadingCards}>Gerar Agora</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {engCards.map((card, i) => (
                  <Card key={i} className="group hover:border-pink-500/30 transition-all cursor-pointer relative overflow-hidden min-h-[120px] flex flex-col justify-center">
                    <div className="absolute top-2 left-3 text-[10px] text-pink-500 font-bold uppercase tracking-widest">Termo</div>
                    <h4 className="text-xl font-bold text-white text-center mb-2">{card.front}</h4>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-[#18181B] flex flex-col items-center justify-center p-4 text-center z-10">
                       <p className="text-sm text-gray-300">{card.back}</p>
                    </div>
                    <div className="text-center text-xs text-gray-600 group-hover:opacity-0 mt-2">Passe o mouse para ver a tradução</div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
