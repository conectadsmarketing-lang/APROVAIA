
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { Heart, Sun, CloudRain, Coffee, Moon } from 'lucide-react';
import { db } from '../services/mockDb';

export const MentalHealthPage: React.FC = () => {
  const [mood, setMood] = useState<string | null>(null);

  const handleLogMood = (m: string) => {
    setMood(m);
    db.addHealthLog({
      date: new Date().toISOString(),
      mood: m as any,
      focusTime: 0
    });
    alert("Humor registrado. A IA ajustará suas tarefas hoje.");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton className="mb-4" />
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2"><Heart className="text-pink-500" fill="currentColor"/> Saúde Mental</h1>
        <p className="text-gray-400">Como você está se sentindo hoje?</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
         {[
           { id: 'happy', icon: Sun, label: 'Motivado', color: 'text-yellow-400' },
           { id: 'anxious', icon: CloudRain, label: 'Ansioso', color: 'text-blue-400' },
           { id: 'tired', icon: Coffee, label: 'Cansado', color: 'text-orange-400' },
           { id: 'focused', icon: Moon, label: 'Focado', color: 'text-purple-400' },
         ].map(item => (
           <button 
             key={item.id}
             onClick={() => handleLogMood(item.id)}
             className={`
               p-4 rounded-2xl border transition-all flex flex-col items-center gap-2
               ${mood === item.id 
                 ? 'bg-white/10 border-white text-white scale-105' 
                 : 'bg-[#18181B] border-white/5 text-gray-500 hover:bg-white/5'}
             `}
           >
             <item.icon className={mood === item.id ? item.color : ''} size={32} />
             <span className="text-xs font-bold">{item.label}</span>
           </button>
         ))}
      </div>

      {mood === 'anxious' && (
        <Card className="bg-blue-500/10 border-blue-500/20">
          <h3 className="font-bold text-blue-400 mb-2">Exercício de Respiração (4-7-8)</h3>
          <p className="text-white text-sm mb-4">A IA detectou ansiedade. Vamos fazer uma pausa de 2 minutos.</p>
          <Button className="w-full">Iniciar Guiado</Button>
        </Card>
      )}
      
      {mood === 'tired' && (
        <Card className="bg-orange-500/10 border-orange-500/20">
          <h3 className="font-bold text-orange-400 mb-2">Descanso Estratégico</h3>
          <p className="text-white text-sm mb-4">Seu cronograma foi ajustado automaticamente para tarefas mais leves (Revisão passiva).</p>
        </Card>
      )}
    </div>
  );
};
