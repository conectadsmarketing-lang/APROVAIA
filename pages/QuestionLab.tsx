
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { FlaskConical, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { generateLabQuestions } from '../services/geminiService';

export const QuestionLabPage: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!subject) return;
    
    setLoading(true);
    
    // FORCE RESET STATE TO PREVENT LOOP
    setQuestions([]);
    setShowResults(false);
    setSelectedAnswers({});
    
    try {
      const result = await generateLabQuestions(subject, difficulty);
      if (result && result.questions && Array.isArray(result.questions) && result.questions.length > 0) {
          setQuestions(result.questions);
      } else {
          alert("A IA não conseguiu gerar questões válidas para este tema. Tente ser mais específico.");
      }
    } catch (error) {
      alert("Erro de conexão ou timeout. Tente novamente.");
    }
    setLoading(false);
  };

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton className="mb-4" />
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <FlaskConical className="text-[#00FF88]" /> Laboratório de Questões
        </h1>
        <p className="text-gray-400">Crie provas personalizadas com IA sobre qualquer tema.</p>
      </div>

      {/* Configuration */}
      <Card className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
           <label className="text-xs text-gray-500 font-bold uppercase">Matéria / Assunto</label>
           <input 
             className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white mt-1 focus:border-[#00FF88] outline-none"
             placeholder="Ex: Crase, Direito Penal, Hardware"
             value={subject}
             onChange={(e) => setSubject(e.target.value)}
           />
        </div>
        <div className="w-full md:w-48">
           <label className="text-xs text-gray-500 font-bold uppercase">Dificuldade</label>
           <select 
             className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white mt-1 outline-none"
             value={difficulty}
             onChange={(e) => setDifficulty(e.target.value)}
           >
             <option value="easy">Fácil</option>
             <option value="medium">Médio</option>
             <option value="hard">Difícil (Banca)</option>
           </select>
        </div>
        <Button onClick={handleGenerate} isLoading={loading} className="w-full md:w-auto">
          Gerar Prova
        </Button>
      </Card>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <Card key={qIndex} className="relative">
             <h3 className="font-bold text-white mb-4 text-lg">{qIndex + 1}. {q.text}</h3>
             <div className="space-y-2">
               {q.options.map((opt: string, optIndex: number) => {
                 const isSelected = selectedAnswers[qIndex] === optIndex;
                 const isCorrect = q.correctIndex === optIndex;
                 let bgClass = 'bg-[#18181B] border-white/10 hover:bg-white/5';
                 
                 if (showResults) {
                   if (isCorrect) bgClass = 'bg-green-500/20 border-green-500/50 text-green-400';
                   else if (isSelected) bgClass = 'bg-red-500/20 border-red-500/50 text-red-400';
                 } else if (isSelected) {
                   bgClass = 'bg-[#00FF88]/20 border-[#00FF88]/50 text-[#00FF88]';
                 }

                 return (
                   <div 
                     key={optIndex}
                     onClick={() => handleSelect(qIndex, optIndex)}
                     className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${bgClass}`}
                   >
                     <span>{opt}</span>
                     {showResults && isCorrect && <CheckCircle size={16} />}
                     {showResults && isSelected && !isCorrect && <XCircle size={16} />}
                   </div>
                 );
               })}
             </div>
             {showResults && (
               <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
                 <strong>Explicação IA:</strong> {q.explanation}
               </div>
             )}
          </Card>
        ))}
      </div>

      {questions.length > 0 && !showResults && (
        <Button onClick={() => setShowResults(true)} size="lg" className="w-full shadow-[0_0_20px_#00FF88]/40">
          Finalizar e Corrigir
        </Button>
      )}
      
      {questions.length > 0 && showResults && (
         <Button onClick={handleGenerate} variant="secondary" className="w-full">
           <RefreshCw className="mr-2" /> Gerar Nova Prova
         </Button>
      )}
    </div>
  );
};
