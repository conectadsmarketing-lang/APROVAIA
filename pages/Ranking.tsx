
import React from 'react';
import { Card } from '../components/Card';
import { BackButton } from '../components/BackButton';
import { Trophy, Medal, Flame, Crown, Shield } from 'lucide-react';
import { db } from '../services/mockDb';

export const Ranking: React.FC = () => {
  const users = db.getRanking();
  const currentUser = db.getUser();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton className="mb-4" />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Liga Diamante
          </h1>
          <p className="text-gray-400">Top 10 estudantes da semana no Brasil.</p>
        </div>
        <div className="bg-[#00A86B]/10 border border-[#00A86B]/20 px-6 py-3 rounded-xl text-[#00A86B] font-bold flex items-center gap-3">
          <Flame size={20} fill="currentColor" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase leading-none mb-1">Sua Pontuação</p>
            <p className="text-xl leading-none">{currentUser.xp} XP</p>
          </div>
        </div>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 mb-12 items-end max-w-3xl mx-auto pt-8">
        {/* 2nd Place */}
        <div className="text-center relative">
          <div className="w-20 h-20 mx-auto rounded-2xl border-2 border-gray-500 bg-gray-800 overflow-hidden mb-4 shadow-lg shadow-gray-500/20 rotate-3 transform">
            <img src={users[1].avatarUrl} className="w-full h-full object-cover" />
          </div>
          <div className="h-32 bg-gradient-to-t from-gray-700/20 to-gray-700/5 border-t border-gray-600 rounded-t-xl flex items-center justify-center">
             <span className="text-4xl font-bold text-gray-600">2</span>
          </div>
          <div className="absolute bottom-4 left-0 right-0">
             <p className="font-bold text-white text-sm truncate">{users[1].name}</p>
             <p className="text-xs text-gray-500">{users[1].xp} XP</p>
          </div>
        </div>
        
        {/* 1st Place */}
        <div className="text-center relative z-10">
           <div className="absolute -top-12 left-0 right-0 flex justify-center animate-bounce">
             <Crown className="text-yellow-500 fill-yellow-500" size={40} />
           </div>
           <div className="w-24 h-24 mx-auto rounded-2xl border-4 border-yellow-500 bg-yellow-500/10 overflow-hidden mb-4 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <img src={users[0].avatarUrl} className="w-full h-full object-cover" />
           </div>
          <div className="h-40 bg-gradient-to-t from-yellow-500/20 to-yellow-500/5 border-t border-yellow-500 rounded-t-xl flex items-center justify-center">
             <span className="text-5xl font-bold text-yellow-500">1</span>
          </div>
          <div className="absolute bottom-6 left-0 right-0">
             <p className="font-bold text-white text-lg truncate">{users[0].name}</p>
             <p className="text-sm text-yellow-500 font-bold">{users[0].xp} XP</p>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="text-center relative">
          <div className="w-20 h-20 mx-auto rounded-2xl border-2 border-amber-700 bg-gray-800 overflow-hidden mb-4 shadow-lg shadow-amber-700/20 -rotate-3 transform">
            <img src={users[2].avatarUrl} className="w-full h-full object-cover" />
          </div>
          <div className="h-24 bg-gradient-to-t from-amber-900/20 to-amber-900/5 border-t border-amber-800 rounded-t-xl flex items-center justify-center">
             <span className="text-4xl font-bold text-amber-800">3</span>
          </div>
          <div className="absolute bottom-4 left-0 right-0">
             <p className="font-bold text-white text-sm truncate">{users[2].name}</p>
             <p className="text-xs text-gray-500">{users[2].xp} XP</p>
          </div>
        </div>
      </div>

      {/* List */}
      <Card className="bg-[#18181B] border-white/5 overflow-hidden" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-medium text-center w-20">#</th>
                <th className="px-6 py-4 font-medium">Estudante</th>
                <th className="px-6 py-4 font-medium">Nível</th>
                <th className="px-6 py-4 font-medium text-right">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.slice(3).map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`
                    hover:bg-white/5 transition-colors group
                    ${user.id === currentUser.id ? 'bg-[#00A86B]/10' : ''}
                  `}
                >
                  <td className="px-6 py-4 text-center font-mono text-gray-500 font-bold group-hover:text-white">
                    {index + 4}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 overflow-hidden">
                         {user.avatarUrl ? <img src={user.avatarUrl} /> : <div className="w-full h-full flex items-center justify-center text-xs">{user.name[0]}</div>}
                      </div>
                      <span className={`font-medium ${user.id === currentUser.id ? 'text-[#00A86B]' : 'text-white'}`}>
                        {user.name} {user.id === currentUser.id && '(Você)'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-white/5 text-xs text-gray-400 border border-white/5">
                      Lvl {user.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#00A86B]">
                    {user.xp.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
