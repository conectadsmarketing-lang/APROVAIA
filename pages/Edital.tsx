
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { FileText, Upload, Check, Search, Book, Zap, ChevronRight, Brain, AlertTriangle } from 'lucide-react';
import { processEditalText } from '../services/geminiService';
import { db } from '../services/mockDb';
import { Edital, Subject } from '../types';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { ProgressBar } from '../components/ProgressBar';
import { Skeleton } from '../components/Skeleton';

export const EditalPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'upload' | 'processing' | 'review'>('upload');
  const [processedData, setProcessedData] = useState<any>(null);
  const [editais, setEditais] = useState<Edital[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedEdital, setSelectedEdital] = useState<Edital | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'flashcards'>('overview');
  const [rawText, setRawText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditais(db.getEditais());
  }, []);

  // Logic to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mock reading delay
    setStep('processing');
    setTimeout(() => {
      // Since we can't read PDF client side without lib, we simulate or read text
      if (file.type === 'application/pdf') {
         setRawText(`[ARQUIVO CARREGADO]: ${file.name}\n\n(Conteúdo simulado para análise da IA...)`);
         handleProcessAI(`[ARQUIVO CARREGADO]: ${file.name} - Analise como um edital padrão.`);
      } else {
         // Try to read text files
         const reader = new FileReader();
         reader.onload = (ev) => {
            const text = ev.target?.result as string;
            setRawText(text);
            handleProcessAI(text);
         };
         reader.readAsText(file);
      }
    }, 1500);
  };

  const handleProcessAI = async (textToProcess: string) => {
    try {
      const result = await processEditalText(textToProcess);
      
      // Validate AI Response
      if (!result || !result.subjects || result.subjects.length === 0) {
        throw new Error("Falha na leitura da IA ou edital inválido.");
      }
      
      setProcessedData(result);
      setStep('review');
    } catch (error) {
      console.error(error);
      setStep('upload');
      alert("A IA não conseguiu processar este arquivo. Tente copiar e colar o texto.");
    }
  };

  const handleManualUpload = async () => {
    if (!rawText.trim() || rawText.length < 20) {
      return alert("Cole o texto do edital ou use o botão de upload.");
    }
    setStep('processing');
    await handleProcessAI(rawText);
  };

  const handleSave = () => {
    if (!processedData) return;

    const mappedSubjects: Subject[] = processedData.subjects.map((s: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: s.name,
      weight: s.weight || 3,
      progress: 0,
      color: '#00FF88',
      topics: (s.topics || []).map((t: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: t.name,
        studied: false,
        reviewCount: 0
      }))
    }));

    const newEdital: Edital = {
      id: Date.now().toString(),
      userId: db.getUser().id,
      title: `${processedData.position} - ${processedData.institution}`,
      institution: processedData.institution,
      position: processedData.position,
      subjects: mappedSubjects,
      summary: processedData.summary,
      strategicTips: processedData.tips,
      createdAt: new Date().toISOString(),
      status: 'ready'
    };

    db.saveEdital(newEdital);
    db.addXP(150);
    
    setEditais(db.getEditais());
    setStep('upload');
    setRawText('');
    setViewMode('list');
    setProcessedData(null);
    alert("Edital importado com sucesso!");
  };

  const openEdital = (edital: Edital) => {
    setSelectedEdital(edital);
    setViewMode('detail');
  };

  // --- RENDER DETAIL VIEW ---
  if (viewMode === 'detail' && selectedEdital) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <BackButton className="mb-4" onClick={() => setViewMode('list')} label="Voltar aos Editais" />
        
        <div className="flex justify-between items-end border-b border-white/10 pb-6 mt-2">
           <div>
             <h1 className="text-3xl font-bold text-white mb-1">{selectedEdital.title}</h1>
             <p className="text-gray-400">Planejamento Inteligente Ativo</p>
           </div>
           <div className="text-right hidden md:block">
             <p className="text-xs text-gray-500 uppercase font-bold mb-1">Progresso Geral</p>
             <div className="w-48">
               <ProgressBar progress={15} height="sm" />
             </div>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Visão Geral', icon: FileText },
            { id: 'content', label: 'Disciplinas', icon: Book },
            { id: 'flashcards', label: 'Flashcards', icon: Zap },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${activeTab === t.id ? 'bg-[#00FF88] text-black border-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.3)]' : 'bg-[#18181B] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'}`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Brain size={18} className="text-[#00FF88]"/> Resumo da IA</h3>
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{selectedEdital.summary}</p>
                  </Card>
                  <div className="grid gap-3">
                    {selectedEdital.subjects.map(sub => (
                      <div key={sub.id} className="bg-[#18181B] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-white">{sub.name}</p>
                            <p className="text-xs text-gray-500">{sub.topics.length} tópicos mapeados</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex gap-1 mb-1">
                              {[...Array(Math.min(sub.weight, 5))].map((_,i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#00FF88]"></div>)}
                            </div>
                            <span className="text-[10px] text-gray-500">Peso {sub.weight}</span>
                          </div>
                      </div>
                    ))}
                  </div>
              </div>
              <div>
                  <Card className="bg-[#00FF88]/5 border-[#00FF88]/20 sticky top-4">
                    <h3 className="font-bold text-[#00FF88] mb-3">Estratégia APROVAIa</h3>
                    <ul className="space-y-3">
                      {selectedEdital.strategicTips?.map((tip, i) => (
                        <li key={i} className="text-xs text-gray-300 flex gap-2 bg-black/20 p-2 rounded-lg border border-white/5">
                          <span className="text-[#00FF88] font-bold">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </Card>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedEdital.subjects.map(sub => (
                <Card 
                  key={sub.id} 
                  className="group hover:border-[#00FF88]/50 cursor-pointer transition-all relative overflow-hidden"
                  onClick={() => navigate(`/subject/${selectedEdital.id}/${sub.id}`)}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF88]">
                    <ChevronRight />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-1 group-hover:text-[#00FF88] transition-colors">{sub.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{sub.topics.length} Tópicos • Peso {sub.weight}</p>
                  <ProgressBar progress={sub.progress} height="sm" />
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-400">{Math.round(sub.progress)}% Concluído</span>
                    <span className="text-xs font-bold text-[#00FF88] uppercase tracking-wider">Estudar Agora</span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-[#18181B]">
                <Zap size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="font-bold text-white text-lg">Biblioteca Inteligente</h3>
                <p className="text-gray-500 mb-6">A IA pode gerar flashcards específicos para cada tópico dentro da área de disciplinas.</p>
                <Button onClick={() => setActiveTab('content')} variant="outline">Ir para Disciplinas</Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER LIST / UPLOAD VIEW ---
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton className="mb-4" />
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Meus Editais</h1>
        <p className="text-gray-400">Gerencie seus concursos e deixe a IA organizar sua rota.</p>
      </div>

      {editais.length > 0 && step === 'upload' && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
           {editais.map(edital => (
             <Card key={edital.id} onClick={() => openEdital(edital)} className="border border-white/5 hover:border-[#00FF88]/50 cursor-pointer transition-all hover:-translate-y-1 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-[#00FF88]/10 rounded-xl text-[#00FF88]">
                    <FileText size={24} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-[#00FF88]/10 text-[#00FF88] rounded-full uppercase tracking-wide border border-[#00FF88]/20">Ativo</span>
                </div>
                <h3 className="font-bold text-lg text-white mb-1 group-hover:text-[#00FF88] transition-colors truncate">{edital.position}</h3>
                <p className="text-sm text-gray-400 mb-6 truncate">{edital.institution}</p>
                <ProgressBar progress={15} height="sm" />
                <div className="flex justify-between text-xs text-gray-500 mt-4">
                   <span>15% Concluído</span>
                   <span className="text-[#00FF88] font-medium flex items-center">Abrir <ChevronRight size={12} /></span>
                </div>
             </Card>
           ))}
         </div>
      )}

      {step === 'upload' && (
        <div className="bg-[#121214] border-2 border-dashed border-white/10 rounded-3xl p-8 relative">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.txt,.doc,.docx"
            />

            <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[#00FF88]/10 text-[#00FF88] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Upload size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Novo Edital</h2>
                <p className="text-gray-400 text-sm mb-6">Arraste seu PDF ou cole o conteúdo.</p>
                
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mb-6">
                   Selecionar Arquivo (PDF/TXT)
                </Button>

                <div className="flex items-center gap-4 my-4">
                   <div className="h-px bg-white/10 flex-1"></div>
                   <span className="text-xs text-gray-600 font-bold uppercase">OU COLE O TEXTO</span>
                   <div className="h-px bg-white/10 flex-1"></div>
                </div>
            </div>
            
            <textarea 
              className="w-full h-40 bg-[#09090B] border border-white/10 rounded-xl p-4 text-white text-sm mb-4 focus:border-[#00FF88] outline-none"
              placeholder="Cole aqui o texto completo do edital (Conteúdo Programático)..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
            <Button size="lg" className="w-full" onClick={handleManualUpload}>
              Processar Texto
            </Button>
        </div>
      )}

      {step === 'processing' && (
        <div className="py-20 flex flex-col items-center gap-8">
           <Loader text="A IA está lendo seu edital e criando o plano..." />
           <div className="w-full max-w-md space-y-4">
             <Skeleton height={60} className="w-full" />
             <Skeleton height={20} className="w-3/4 mx-auto" />
             <div className="text-center text-xs text-gray-500 mt-4">Isso pode levar alguns segundos.</div>
           </div>
        </div>
      )}

      {step === 'review' && processedData && (
        <Card className="max-w-4xl mx-auto border-[#00FF88]/20">
            <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-6">
              <div className="w-16 h-16 bg-[#00FF88]/10 rounded-2xl flex items-center justify-center text-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.2)]">
                <Check size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{processedData.position}</h2>
                <p className="text-gray-400 text-lg">{processedData.institution}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-white text-lg flex items-center gap-2"><Search size={18}/> Matérias Identificadas</h3>
                <div className="grid gap-3">
                  {processedData.subjects.map((sub: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-[#09090B] rounded-xl border border-white/5 hover:border-[#00FF88]/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-1 h-12 bg-[#00FF88] rounded-full shadow-[0_0_10px_#00FF88]"></div>
                        <div>
                          <p className="font-bold text-white">{sub.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{sub.topics?.length || 0} tópicos</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="flex gap-1 mb-1 justify-end">
                           {[...Array(5)].map((_, i) => (
                             <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < sub.weight ? 'bg-[#00FF88]' : 'bg-gray-700'}`}></div>
                           ))}
                         </div>
                         <span className="text-[10px] text-gray-500 uppercase font-bold">Peso {sub.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-[#09090B] p-5 rounded-xl border border-white/5">
                    <h3 className="font-bold text-[#00FF88] mb-3">Dicas Estratégicas</h3>
                    <ul className="space-y-3">
                      {processedData.tips?.map((tip: string, i: number) => (
                        <li key={i} className="text-sm text-gray-300 flex gap-2">
                          <span className="text-[#00FF88] font-bold">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                 </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-4 pt-6 border-t border-white/5">
              <Button variant="ghost" onClick={() => { setStep('upload'); setProcessedData(null); }}>Cancelar</Button>
              <Button onClick={handleSave} size="lg" className="px-8 shadow-[0_0_20px_rgba(0,255,136,0.4)]">Salvar Plano</Button>
            </div>
        </Card>
      )}
    </div>
  );
};
