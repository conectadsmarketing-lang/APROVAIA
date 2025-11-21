
import React from 'react';
import { Card } from '../components/Card';
import { BackButton } from '../components/BackButton';
import { db } from '../services/mockDb';

export const AchievementsPage: React.FC = () => {
  const achievements = db.getAchievements();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton className="mb-4" />
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Conquistas</h1>
        <p className="text-gray-400">Desbloqueie medalhas e ganhe recompensas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <Card 
            key={ach.id} 
            className={`
              relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]
              ${ach.unlocked ? 'bg-[#18181B] border-white/10' : 'bg-[#0E0F11] border-white/5 opacity-60 grayscale'}
            `}
          >
             <div className="flex items-start gap-4">
                <div className={`
                  text-4xl p-4 rounded-2xl mb-2
                  ${ach.unlocked ? 'bg-[#00A86B]/10 shadow-lg shadow-[#00A86B]/10' : 'bg-gray-800'}
                `}>
                  {ach.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${ach.unlocked ? 'text-white' : 'text-gray-500'}`}>
                    {ach.name}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mt-1">{ach.description}</p>
                  {ach.unlocked && (
                    <span className="inline-block mt-3 text-[10px] font-bold bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">
                      DESBLOQUEADO
                    </span>
                  )}
                </div>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
