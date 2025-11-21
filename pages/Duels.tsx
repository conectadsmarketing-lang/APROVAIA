
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { Swords, Shield, UserPlus, Trophy } from 'lucide-react';
import { db } from '../services/mockDb';
import { Duel } from '../types';

export const DuelsPage: React.FC = () => {
  const [duels, setDuels] = useState<Duel[]>(db.getDuels());
  
  const createNewDuel = () => {
    const newDuel = db.createDuel("Direito Constitucional");
    setDuels(db.getDuels());
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton className="mb-4" />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3 mb-4">
          <Swords size={40} className="text-orange-500" /> Arena de Duelos
        </h1>
        <p className="text-gray-400">Desafie outros estudantes e suba no ranking global.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Active/Waiting Duels */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold">Seus Duelos</h3>
            <Button onClick={createNewDuel} size="sm" className="bg-orange-500 hover:bg-orange-600 shadow-orange-900/20">
              <Swords className="mr-2" size={16}/> Novo Duelo
            </Button>
          </div>

          {duels.map(duel => (
            <Card key={duel.id} className="flex items-center justify-between hover:border-orange-500/50 transition-all">
               <div className="flex items-center gap-4">
                 <div className="relative">
                   <img src={duel.opponentAvatar} className="w-12 h-12 rounded-full bg-gray-700" />
                   <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#121214] ${duel.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                 </div>
                 <div>
                   <h4 className="font-bold text-white">{duel.opponentName}</h4>
                   <p className="text-xs text-gray-500">{duel.subject}</p>
                 </div>
               </div>

               <div className="flex flex-col items-end">
                 {duel.status === 'finished' ? (
                   <div className={`text-sm font-bold ${duel.winner === 'user' ? 'text-green-500' : 'text-red-500'}`}>
                     {duel.winner === 'user' ? 'VITÓRIA' : 'DERROTA'} ({duel.scoreUser} x {duel.scoreOpponent})
                   </div>
                 ) : (
                   <Button size="sm" variant="outline" className="text-orange-500 border-orange-500 hover:bg-orange-500/10">
                     Jogar Agora
                   </Button>
                 )}
               </div>
            </Card>
          ))}
        </div>

        {/* Leaderboard Mini */}
        <Card className="bg-[#18181B] h-fit">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Trophy className="text-yellow-500" size={18}/> Top Gladiadores</h3>
           <ul className="space-y-4">
             {[1,2,3,4,5].map((i) => (
               <li key={i} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-3">
                   <span className={`font-mono font-bold ${i===1 ? 'text-yellow-500' : 'text-gray-500'}`}>{i}</span>
                   <span className="text-gray-300">Usuário {i}00</span>
                 </div>
                 <span className="text-orange-500 font-bold">{2000 - (i*100)} XP</span>
               </li>
             ))}
           </ul>
        </Card>
      </div>
    </div>
  );
};
