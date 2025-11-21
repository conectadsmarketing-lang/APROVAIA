
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { Briefcase, DollarSign, FileCheck, Dumbbell, Search } from 'lucide-react';
import { generateCareerGuide } from '../services/geminiService';

export const CareerPage: React.FC = () => {
  const [position, setPosition] = useState('');
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if(!position) return;
    setLoading(true);
    const result = await generateCareerGuide(position);
    setGuide(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton className="mb-4" />
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Módulo Carreira</h1>
        <p className="text-gray-400">Tudo o que acontece depois da aprovação. Salários, posse e TAF.</p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto flex gap-2">
         <input 
           className="flex-1 bg-[#18181B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00FF88] outline-none"
           placeholder="Digite o cargo (ex: Agente Polícia Federal)"
           value={position}
           onChange={(e) => setPosition(e.target.value)}
         />
         <Button onClick={handleSearch} isLoading={loading}><Search /></Button>
      </div>

      {guide && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="bg-green-500/10 border-green-500/20 text-center py-8">
              <DollarSign size={40} className="mx-auto text-green-400 mb-4" />
              <h3 className="text-gray-400 text-xs uppercase font-bold mb-2">Salário Inicial Estimado</h3>
              <p className="text-3xl font-bold text-white">{guide.salaryRange}</p>
           </Card>

           <Card>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><FileCheck className="text-[#00FF88]" /> Documentação para Posse</h3>
              <ul className="space-y-2">
                {guide.documentation?.map((doc: string, i: number) => (
                  <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div> {doc}
                  </li>
                ))}
              </ul>
           </Card>

           <Card className="md:col-span-2">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Dumbbell className="text-blue-400" /> Preparação TAF / Exames</h3>
              <p className="text-gray-300 leading-relaxed">{guide.tafTips}</p>
           </Card>
        </div>
      )}
    </div>
  );
};
