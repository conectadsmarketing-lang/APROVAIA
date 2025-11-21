
import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { FileText, Clock, CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';
import { db } from '../services/mockDb';
import { generateSimulado } from '../services/geminiService';
import { Loader } from '../components/Loader';
import { Simulado } from '../types';

export const SimuladosPage: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'loading' | 'quiz' | 'results'>('dashboard');
  const [simulados, setSimulados] = useState<Simulado[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setSimulados(db.getSimulados());
  }, []);

  const handleStartSimulado = async () => {
    // 1. RESET STATE COMPLETELY BEFORE ASYNC
    setActiveQuiz(null);
    setSelectedAnswers([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setView('loading');
    
    try {
      const editais = db.getEditais();
      const subjects = editais.length > 0 ? editais[0].subjects.map(s => s.name) : [];
      
      const quizData = await generateSimulado(subjects);
      
      // 2. STRICT VALIDATION
      if (!quizData || !quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
        throw new Error("Falha na estrutura da prova");
      }

      // 3. SET STATE ONLY ON SUCCESS
      setActiveQuiz(quizData);
      setSelectedAnswers(new Array(quizData.questions.length).fill(-1));
      setCurrentQuestionIndex(0);
      setView('quiz');
    } catch (error) {
      console.error(error);
      alert("A IA demorou ou encontrou um erro. Tente novamente.");
      setView('dashboard');
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    let calculatedScore = 0;
    activeQuiz.questions.forEach((q: any, idx: number) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    
    // Save to DB History
    const newSimulado: Simulado = {
        id: Date.now().toString(),
        title: `Simulado IA #${db.getSimulados().length + 1}`,
        totalQuestions: activeQuiz.questions.length,
        score: calculatedScore,
        status: 'completed',
        date: new Date().toLocaleDateString('pt-BR'),
        type: 'general'
    };
    db.saveSimuladoResult(newSimulado);
    setSimulados(db.getSimulados()); // Update list

    setView('results');
  };

  // --- DASHBOARD VIEW ---
  if (view === 'dashboard') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <BackButton className="mb-4" />
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Simulados Inteligentes</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#18181B] border-white/5 hover:border-[#00A86B]/50 transition-colors group cursor-pointer h-[300px] flex flex-col justify-center items-center text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-[#00A86B]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="p-4 bg-[#00A86B]/10 rounded-full text-[#00A86B] mb-4 group-hover:scale-110 transition-transform">
                <FileText size={40} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Gerar Simulado Completo</h3>
             <p className="text-gray-400 max-w-xs mb-6">IA cria 10 questões estilo banca focadas no seu edital.</p>
             <Button className="relative z-10" onClick={handleStartSimulado}>
               <Play size={18} className="mr-2" /> Iniciar Prova
             </Button>
          </Card>

          <Card className="bg-[#18181B] border-white/5 h-[300px] overflow-y-auto custom-scrollbar">
             <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Clock size={18}/> Histórico Recente</h3>
             <div className="space-y-3">
                {simulados.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-10">Nenhum simulado feito.</p>
                ) : (
                  simulados.map(sim => (
                    <div key={sim.id} className="p-3 rounded-lg bg-black/20 border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold text-sm">{sim.title}</p>
                        <p className="text-xs text-gray-500">{sim.date}</p>
                      </div>
                      <span className={`font-bold text-sm ${sim.score! / sim.totalQuestions >= 0.7 ? 'text-[#00A86B]' : 'text-yellow-500'}`}>
                        {sim.score ? Math.round((sim.score/sim.totalQuestions)*100) : 0}%
                      </span>
                    </div>
                  ))
                )}
             </div>
          </Card>
        </div>
      </div>
    );
  }

  // --- LOADING VIEW ---
  if (view === 'loading') {
    return <Loader fullScreen text="A IA está elaborando sua prova..." />;
  }

  // --- QUIZ VIEW ---
  if (view === 'quiz' && activeQuiz) {
    const question = activeQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;
    
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center mb-4">
           <span className="text-gray-400 text-sm">Questão {currentQuestionIndex + 1} de {activeQuiz.questions.length}</span>
           <span className="text-[#00A86B] font-bold text-sm">Simulado em Andamento</span>
        </div>
        
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-8">
          <div className="bg-[#00A86B] h-full transition-all duration-300" style={{width: `${progress}%`}}></div>
        </div>

        <Card className="min-h-[400px] flex flex-col">
           <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">{question.text}</h2>
           
           <div className="space-y-3 flex-1">
             {question.options.map((opt: string, idx: number) => (
               <button
                 key={idx}
                 onClick={() => handleSelectOption(idx)}
                 className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4
                   ${selectedAnswers[currentQuestionIndex] === idx 
                     ? 'bg-[#00A86B]/20 border-[#00A86B] text-white' 
                     : 'bg-[#18181B] border-white/10 text-gray-300 hover:bg-white/5'}
                 `}
               >
                 <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold flex-shrink-0 ${selectedAnswers[currentQuestionIndex] === idx ? 'bg-[#00A86B] border-[#00A86B] text-black' : 'border-gray-600 text-gray-500'}`}>
                   {String.fromCharCode(65 + idx)}
                 </div>
                 <span className="text-sm md:text-base">{opt}</span>
               </button>
             ))}
           </div>

           <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
             <Button 
                variant="secondary" 
                onClick={handlePrev} 
                disabled={currentQuestionIndex === 0}
             >
               Anterior
             </Button>
             
             {currentQuestionIndex === activeQuiz.questions.length - 1 ? (
               <Button 
                 onClick={handleFinish} 
                 className="bg-[#00A86B] hover:bg-[#008f5b] text-black font-bold px-8"
                 disabled={selectedAnswers.includes(-1)}
               >
                 Finalizar Prova
               </Button>
             ) : (
               <Button onClick={handleNext}>
                 Próxima
               </Button>
             )}
           </div>
        </Card>
      </div>
    );
  }

  // --- RESULTS VIEW ---
  if (view === 'results' && activeQuiz) {
    const percentage = Math.round((score / activeQuiz.questions.length) * 100);
    
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="text-center py-8">
           <h1 className="text-4xl font-bold text-white mb-2">Resultado Final</h1>
           <div className="text-6xl font-bold text-[#00A86B] mb-2">{percentage}%</div>
           <p className="text-gray-400">Você acertou {score} de {activeQuiz.questions.length} questões.</p>
           <div className="flex justify-center gap-4 mt-8">
             <Button variant="outline" onClick={() => setView('dashboard')}>Voltar ao Menu</Button>
             <Button onClick={handleStartSimulado}><RotateCcw size={18} className="mr-2"/> Novo Simulado</Button>
           </div>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
           <h3 className="text-white font-bold text-xl">Gabarito Comentado</h3>
           {activeQuiz.questions.map((q: any, idx: number) => {
             const isCorrect = selectedAnswers[idx] === q.correctIndex;
             return (
               <Card key={idx} className={`border ${isCorrect ? 'border-green-500/30' : 'border-red-500/30'}`}>
                 <div className="flex gap-4">
                    <div className={`mt-1 min-w-[24px] ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {isCorrect ? <CheckCircle /> : <XCircle />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">{idx + 1}. {q.text}</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        Sua resposta: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{q.options[selectedAnswers[idx]]}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-400 mb-4">
                          Correta: {q.options[q.correctIndex]}
                        </p>
                      )}
                      <div className="bg-[#18181B] p-3 rounded-lg border border-white/5 text-sm text-gray-300">
                        <strong>Explicação IA:</strong> {q.explanation}
                      </div>
                    </div>
                 </div>
               </Card>
             );
           })}
        </div>
      </div>
    );
  }

  return null;
};
