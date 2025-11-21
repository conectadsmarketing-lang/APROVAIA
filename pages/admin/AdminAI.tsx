
import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Sparkles, Instagram, Mail, Zap, Copy } from 'lucide-react';
import { generateMarketingContent } from '../../services/geminiService';
import { Loader } from '../../components/Loader';

export const AdminAI: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<'instagram' | 'email' | 'motivation'>('instagram');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setResult('');
    const text = await generateMarketingContent(topic, type);
    setResult(text);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="text-purple-500"/> Ferramentas IA do Admin
        </h1>
        <p className="text-gray-400">Gere conteúdo, comunicados e materiais para o SaaS.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-[#111] border-white/5 space-y-6">
           <div>
             <label className="text-xs text-gray-500 font-bold uppercase">Tópico / Tema</label>
             <textarea 
               value={topic}
               onChange={e => setTopic(e.target.value)}
               placeholder="Ex: Promoção de Black Friday, Dica de estudo para iniciantes..."
               className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-white mt-2 h-32 resize-none focus:border-purple-500 outline-none"
             />
           </div>

           <div>
             <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">Tipo de Conteúdo</label>
             <div className="grid grid-cols-3 gap-2">
               <button onClick={() => setType('instagram')} className={`p-3 rounded-lg border flex flex-col items-center gap-1 text-xs ${type === 'instagram' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'border-white/10 text-gray-400'}`}>
                 <Instagram size={16} /> Insta
               </button>
               <button onClick={() => setType('email')} className={`p-3 rounded-lg border flex flex-col items-center gap-1 text-xs ${type === 'email' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-white/10 text-gray-400'}`}>
                 <Mail size={16} /> Email
               </button>
               <button onClick={() => setType('motivation')} className={`p-3 rounded-lg border flex flex-col items-center gap-1 text-xs ${type === 'motivation' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'border-white/10 text-gray-400'}`}>
                 <Zap size={16} /> Frase
               </button>
             </div>
           </div>

           <Button onClick={handleGenerate} isLoading={loading} className="w-full bg-purple-600 hover:bg-purple-700">
             Gerar Conteúdo
           </Button>
        </Card>

        <Card className="lg:col-span-2 bg-[#111] border-white/5 min-h-[400px]">
           {loading ? (
             <Loader text="A IA está criando..." />
           ) : result ? (
             <div className="relative">
               <button className="absolute top-0 right-0 p-2 text-gray-500 hover:text-white" title="Copiar">
                 <Copy size={16} onClick={() => navigator.clipboard.writeText(result)} />
               </button>
               <div className="prose prose-invert prose-sm max-w-none whitespace-pre-line">
                 {result}
               </div>
             </div>
           ) : (
             <div className="flex items-center justify-center h-full text-gray-600 text-sm">
               O resultado aparecerá aqui.
             </div>
           )}
        </Card>
      </div>
    </div>
  );
};
