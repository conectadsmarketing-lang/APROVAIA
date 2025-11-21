
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { Loader } from '../components/Loader';
import { Markdown } from '../components/Markdown';
import { CheckCircle, Circle, BookOpen, HelpCircle, Sparkles } from 'lucide-react';
import { db } from '../services/mockDb';
import { generateTopicExplanation } from '../services/geminiService';
import { Edital, Subject } from '../types';

export const SubjectDetail: React.FC = () => {
  const { editalId, subjectId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<{ edital: Edital, subject: Subject } | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (editalId && subjectId) {
      const result = db.getSubjectById(editalId, subjectId);
      if (result) {
        setData(result);
      } else {
        navigate('/editais');
      }
    }
  }, [editalId, subjectId, navigate]);

  const handleToggleTopic = (topicId: string) => {
    if (editalId && subjectId) {
      db.toggleTopicStudy(editalId, subjectId, topicId);
      // Refresh data
      const result = db.getSubjectById(editalId, subjectId);
      setData(result);
      db.addXP(10); // Small reward for ticking a box
    }
  };

  const handleExplainTopic = async (topicName: string) => {
    if (!data) return;
    setSelectedTopic(topicName);
    setLoadingAI(true);
    const text = await generateTopicExplanation(topicName, data.subject.name);
    setExplanation(text);
    setLoadingAI(false);
  };

  if (!data) return <Loader fullScreen text="Carregando disciplina..." />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-end border-b border-white/10 pb-6 mt-8 lg:mt-0">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-white mb-2">{data.subject.name}</h1>
          <p className="text-gray-400 text-sm mb-4">{data.edital.title}</p>
          <ProgressBar progress={data.subject.progress} showLabel />
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" onClick={() => navigate('/flashcards')}>
             Flashcards
          </Button>
          <Button onClick={() => navigate('/lab')}>
             Criar Simulado
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Topic List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <BookOpen className="text-[#00FF88]" size={20}/> Conteúdo Programático
          </h3>
          <div className="grid gap-2">
            {data.subject.topics.map((topic) => (
              <Card 
                key={topic.id} 
                className={`
                  p-4 flex items-center justify-between group transition-all border
                  ${topic.studied ? 'bg-[#00FF88]/5 border-[#00FF88]/20' : 'bg-[#18181B] border-white/5 hover:border-white/20'}
                `}
                noPadding
              >
                 <div className="flex items-center gap-4 p-4 flex-1 cursor-pointer" onClick={() => handleToggleTopic(topic.id)}>
                   <div className={`transition-colors ${topic.studied ? 'text-[#00FF88]' : 'text-gray-600 group-hover:text-gray-400'}`}>
                      {topic.studied ? <CheckCircle size={24} /> : <Circle size={24} />}
                   </div>
                   <div>
                     <p className={`font-medium ${topic.studied ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                       {topic.name}
                     </p>
                     {topic.studied && <span className="text-[10px] text-[#00FF88] font-bold uppercase">Concluído</span>}
                   </div>
                 </div>
                 <div className="border-l border-white/5 pl-2 pr-4 py-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-[#00FF88] hover:bg-[#00FF88]/10"
                      onClick={(e) => { e.stopPropagation(); handleExplainTopic(topic.name); }}
                    >
                      <Sparkles size={16} />
                    </Button>
                 </div>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className="space-y-6">
           <Card className="sticky top-24 bg-[#18181B] border-white/10 min-h-[300px]">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2">
               <HelpCircle className="text-purple-400" size={20}/> Professor IA
             </h3>
             
             {!selectedTopic ? (
               <div className="text-center py-10 text-gray-500">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Sparkles size={32} />
                 </div>
                 <p>Selecione o ícone de magia (✨) em um tópico para receber uma explicação instantânea.</p>
               </div>
             ) : loadingAI ? (
               <Loader text="Gerando explicação..." />
             ) : (
               <div className="animate-in fade-in slide-in-from-right-4">
                 <div className="mb-4 pb-4 border-b border-white/5">
                   <span className="text-xs text-purple-400 font-bold uppercase">Tópico</span>
                   <h4 className="text-white font-bold text-lg">{selectedTopic}</h4>
                 </div>
                 <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                   <Markdown content={explanation || ''} />
                 </div>
                 <Button className="w-full mt-6" onClick={() => setSelectedTopic(null)}>
                   Fechar Explicação
                 </Button>
               </div>
             )}
           </Card>
        </div>
      </div>
    </div>
  );
};
