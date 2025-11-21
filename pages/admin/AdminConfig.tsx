
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Save, RefreshCw } from 'lucide-react';
import { db } from '../../services/mockDb';
import { SystemConfig } from '../../types';

export const AdminConfig: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);

  useEffect(() => {
    setConfig(db.getSystemConfig());
  }, []);

  const handleSave = () => {
    if (config) {
      db.updateSystemConfig(config);
      alert("Configurações salvas com sucesso! As alterações já estão em vigor.");
    }
  };

  const toggleFeature = (key: keyof SystemConfig['features']) => {
    if (config) {
      setConfig({
        ...config,
        features: { ...config.features, [key]: !config.features[key] }
      });
    }
  };

  if (!config) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-white">Configurações do Sistema (SaaS)</h1>
         <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
           <Save className="mr-2" size={18}/> Salvar Alterações
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card className="bg-[#111] border-white/5">
           <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Geral</h3>
           <div className="space-y-4">
             <div>
               <label className="text-xs text-gray-500 uppercase font-bold">Nome da Aplicação</label>
               <input 
                 value={config.appName}
                 onChange={e => setConfig({...config, appName: e.target.value})}
                 className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-white mt-1"
               />
             </div>
             <div>
               <label className="text-xs text-gray-500 uppercase font-bold">Preço Mensal (R$)</label>
               <input 
                 type="number"
                 value={config.monthlyPrice}
                 onChange={e => setConfig({...config, monthlyPrice: Number(e.target.value)})}
                 className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-white mt-1"
               />
             </div>
             <div>
               <label className="text-xs text-gray-500 uppercase font-bold">Mensagem de Boas-vindas</label>
               <textarea 
                 value={config.welcomeMessage}
                 onChange={e => setConfig({...config, welcomeMessage: e.target.value})}
                 className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-white mt-1 h-24 resize-none"
               />
             </div>
           </div>
        </Card>

        {/* Feature Flags */}
        <Card className="bg-[#111] border-white/5">
           <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Módulos & Features</h3>
           <div className="space-y-4">
             {[
               { key: 'english', label: 'Módulo de Inglês IA' },
               { key: 'duels', label: 'Sistema de Duelos PvP' },
               { key: 'tutorIA', label: 'Chat Professor IA (Gemini)' },
               { key: 'store', label: 'Loja de Itens' },
             ].map((item) => (
               <div key={item.key} className="flex items-center justify-between p-3 bg-[#050505] rounded-lg border border-white/5">
                 <span className="text-gray-300">{item.label}</span>
                 <button 
                   onClick={() => toggleFeature(item.key as any)}
                   className={`w-12 h-6 rounded-full relative transition-colors ${config.features[item.key as keyof typeof config.features] ? 'bg-green-500' : 'bg-gray-700'}`}
                 >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${config.features[item.key as keyof typeof config.features] ? 'left-7' : 'left-1'}`}></div>
                 </button>
               </div>
             ))}
           </div>
           <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-500">
             <span className="font-bold">Atenção:</span> Desativar módulos ocultará as abas para todos os alunos imediatamente.
           </div>
        </Card>
      </div>
    </div>
  );
};
