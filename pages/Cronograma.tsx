
import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { Play, Pause, RotateCcw, CheckCircle, ChevronRight } from 'lucide-react';
import { db } from '../services/mockDb';

export const CronogramaPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [editais] = useState(db.getEditais());

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notify
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = (newMode: 'focus' | 'short' | 'long') => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'focus') setTimeLeft(25 * 60);
    if (newMode === 'short') setTimeLeft(5 * 60);
    if (newMode === 'long') setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (editais.length === 0) {
    return (
      <div className="text-center py-20">
        <BackButton className="mb-4" />
        <h2 className="text-2xl text-white font-bold">Nenhum cronograma ativo</h2>
        <p className="text-gray-500">Envie um edital primeiro.</p>
      </div>
    );
  }

  const edital = editais[0]; // Focusing on primary edital

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Schedule List */}
      <div className="lg:col-span-2 space-y-6">
        <BackButton className="mb-4" />
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Cronograma da Semana</h2>
          <Button variant="outline" size="sm">Exportar Agenda</Button>
        </div>
        
        <div className="space-y-4">
          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((day, i) => (
            <div key={day} className="relative pl-8 border-l border-white/10 pb-6 last:pb-0">
              <div className={`absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-[#09090B] ${i === 0 ? 'bg-[#00A86B]' : 'bg-gray-700'}`}></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#18181B] border border-white/5 p-4 rounded-xl hover:border-[#00A86B]/30 transition-all">
                <div>
                   <h4 className={`font-bold ${i === 0 ? 'text-[#00A86B]' : 'text-white'}`}>{day}</h4>
                   <p className="text-sm text-gray-400">Direito Constitucional • 2h</p>
                </div>
                {i === 0 && (
                   <Button size="sm" className="mt-2 md:mt-0">Começar</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pomodoro & Quick Actions */}
      <div className="space-y-6 pt-12 lg:pt-0">
        <Card className="bg-[#18181B] border-white/5 flex flex-col items-center p-8">
           <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-6">Foco Total</h3>
           <div className="text-7xl font-bold text-white font-mono mb-8 tracking-tighter">
             {formatTime(timeLeft)}
           </div>
           
           <div className="flex gap-2 mb-8">
             <button onClick={() => resetTimer('focus')} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${mode === 'focus' ? 'bg-[#00A86B]/20 text-[#00A86B]' : 'text-gray-500 hover:text-white'}`}>Foco</button>
             <button onClick={() => resetTimer('short')} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${mode === 'short' ? 'bg-[#00A86B]/20 text-[#00A86B]' : 'text-gray-500 hover:text-white'}`}>Curto</button>
             <button onClick={() => resetTimer('long')} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${mode === 'long' ? 'bg-[#00A86B]/20 text-[#00A86B]' : 'text-gray-500 hover:text-white'}`}>Longo</button>
           </div>

           <div className="flex gap-4 w-full">
             <Button 
               onClick={toggleTimer} 
               className={`flex-1 ${isActive ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}`}
             >
               {isActive ? <Pause size={20} /> : <Play size={20} />}
               {isActive ? 'Pausar' : 'Iniciar'}
             </Button>
             <Button variant="secondary" onClick={() => resetTimer(mode)} className="px-4">
               <RotateCcw size={20} />
             </Button>
           </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#00A86B] to-[#006341] border-none text-white">
          <h3 className="font-bold text-lg mb-2">Revisão Inteligente</h3>
          <p className="text-sm opacity-90 mb-4">Você tem 12 tópicos pendentes para revisão espaçada (24h).</p>
          <Button variant="glass" className="w-full justify-between group">
            Revisar Agora <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>
      </div>
    </div>
  );
};
