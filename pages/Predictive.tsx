
import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Brain, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { db } from '../services/mockDb';
import { generatePredictiveAnalysis } from '../services/geminiService';
import { PredictiveData } from '../types';

export const PredictivePage: React.FC = () => {
  const [data, setData] = useState<PredictiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const user = db.getUser();

  useEffect(() => {
    const loadData = async () => {
      // Simulate loading AI analysis
      setLoading(true);
      const result = await generatePredictiveAnalysis(user.xp, user.streak);
      // Mocking trend data for charts
      result.trends = [
        { date: 'W1', score: 45 }, { date: 'W2', score: 55 }, { date: 'W3', score: 52 },
        { date: 'W4', score: 60 }, { date: 'W5', score: 68 }, { date: 'Current', score: result.projectedScore }
      ];
      setData(result);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500 animate-pulse">Carregando Inteligência Preditiva APROVAIa...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton className="mb-4" />
      <div className="flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2"><TrendingUp className="text-[#00FF88]"/> Inteligência Preditiva</h1>
            <p className="text-gray-400">Análise futurista baseada nos seus dados de estudo.</p>
         </div>
         <div className="bg-[#121214] px-4 py-2 rounded-lg border border-white/10">
           <span className="text-xs text-gray-500 uppercase font-bold">Chance de Aprovação</span>
           <p className="text-2xl font-bold text-[#00FF88]">{data?.approvalProbability}%</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Probability Chart */}
        <Card className="lg:col-span-2">
           <h3 className="font-bold text-white mb-6">Tendência de Evolução</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data?.trends}>
                 <defs>
                   <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                 <XAxis dataKey="date" stroke="#666" />
                 <YAxis stroke="#666" />
                 <Tooltip contentStyle={{ backgroundColor: '#121214', border: '1px solid #333' }} />
                 <Area type="monotone" dataKey="score" stroke="#00FF88" fillOpacity={1} fill="url(#colorScore)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </Card>

        {/* Insights & Weaknesses */}
        <div className="space-y-6">
          <Card>
             <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Brain size={18} className="text-purple-400"/> APROVAIa Insights</h3>
             <ul className="space-y-3">
               {data?.insights.map((insight, i) => (
                 <li key={i} className="text-sm text-gray-300 flex gap-2 bg-[#18181B] p-3 rounded-lg border border-white/5">
                   <Target size={16} className="text-[#00FF88] flex-shrink-0 mt-0.5" /> {insight}
                 </li>
               ))}
             </ul>
          </Card>
          
          <Card className="bg-red-500/5 border-red-500/20">
             <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={18}/> Ponto Crítico</h3>
             <p className="text-sm text-gray-400">Sua matéria mais fraca é <span className="text-white font-bold">{data?.weakestSubject}</span>. Recomendamos 2h extras essa semana.</p>
             <Button size="sm" variant="danger" className="mt-4 w-full">Adicionar ao Cronograma</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
