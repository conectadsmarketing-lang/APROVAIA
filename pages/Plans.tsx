
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { Check, Crown, Star, X, Lock, ArrowRight } from 'lucide-react';
import { db } from '../services/mockDb';

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [user, setUser] = useState(db.getUser());

  useEffect(() => {
    setUser(db.getUser());
  }, []);

  const handleUnlock = () => {
    setShowWaitlistModal(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center relative overflow-hidden font-sans pt-10 pb-10 px-4">
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-30">
        <BackButton label="Voltar ao Dashboard" />
      </div>

      {/* Modal Payment Placeholder */}
      {showWaitlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 px-4">
          <div className="bg-[#121214] border border-[#00FF88]/30 p-8 rounded-[32px] max-w-md w-full text-center shadow-[0_0_100px_rgba(0,255,136,0.1)] relative">
            <button onClick={() => setShowWaitlistModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <div className="w-20 h-20 bg-[#00FF88]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse border border-[#00FF88]/20">
              <Lock className="text-[#00FF88]" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Gateway em Atualização</h3>
            <p className="text-gray-400 mb-8 leading-relaxed text-sm">
              Estamos integrando uma nova camada de segurança com o PicPay. O sistema de pagamentos estará disponível nas próximas horas.
            </p>
            <Button onClick={() => setShowWaitlistModal(false)} className="w-full bg-[#00FF88] text-black font-bold hover:bg-[#00D170] shadow-[0_0_30px_rgba(0,255,136,0.3)]">
              Entendido
            </Button>
          </div>
        </div>
      )}

      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#00FF88]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10 mt-16">
        
        {/* Hero Text */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF88]/5 text-[#00FF88] text-[10px] font-bold uppercase tracking-widest border border-[#00FF88]/20 shadow-[0_0_20px_rgba(0,255,136,0.1)]">
            <Star size={12} fill="currentColor" /> Assinatura Premium
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
            NÃO ESTUDE MAIS. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-emerald-500">ESTUDE PARA PASSAR.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
            O <strong className="text-white">AprovaIA 3.0</strong> substitui cursos caros e planilhas manuais. <br className="hidden md:block"/>
            Tenha acesso ao Professor IA 24h, Cronograma Dinâmico e Análise Preditiva.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* MENSAL */}
          <div className="bg-[#0A0A0A] rounded-[32px] p-8 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden">
             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-6">Mensal</h3>
             <div className="flex items-baseline gap-1 mb-8">
               <span className="text-4xl font-bold text-white">R$ 29,90</span>
               <span className="text-gray-600 text-sm">/mês</span>
             </div>
             <ul className="space-y-4 mb-8">
               <li className="flex items-center gap-3 text-gray-400 text-sm"><div className="p-1 rounded-full bg-white/5"><Check size={12} className="text-[#00FF88]"/></div> Acesso ao App</li>
               <li className="flex items-center gap-3 text-gray-400 text-sm"><div className="p-1 rounded-full bg-white/5"><Check size={12} className="text-[#00FF88]"/></div> Cronograma Básico</li>
               <li className="flex items-center gap-3 text-gray-400 text-sm"><div className="p-1 rounded-full bg-white/5"><Check size={12} className="text-[#00FF88]"/></div> Flashcards Limitados</li>
             </ul>
             <Button onClick={handleUnlock} variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 rounded-xl h-12">
               Selecionar Mensal
             </Button>
          </div>

          {/* ANUAL (Featured) */}
          <div className="bg-[#0F0F11] rounded-[32px] p-1 relative transform md:-translate-y-8 shadow-[0_0_60px_rgba(0,255,136,0.15)] border border-[#00FF88]/40 z-10">
             <div className="absolute -top-5 left-1/2 -translate-x-1/2">
               <span className="bg-[#00FF88] text-black text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
                 <Star size={10} fill="black"/> Recomendado
               </span>
             </div>
             <div className="bg-[#0A0A0A] rounded-[28px] p-8 h-full relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#00FF88]/10 rounded-full blur-[50px] pointer-events-none"></div>

                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-[#00FF88] font-bold uppercase tracking-widest text-sm">Anual PRO</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-6xl font-bold text-white tracking-tighter">R$ 199,90</span>
                </div>
                <p className="text-xs text-gray-500 mb-10 font-medium">Equivalente a R$ 16,65/mês (45% OFF)</p>
                
                <ul className="space-y-5 mb-10">
                  <li className="flex items-center gap-3 text-white font-medium text-sm"><div className="p-1 rounded-full bg-[#00FF88]/20"><Check size={12} className="text-[#00FF88]"/></div> IA Avançada Ilimitada</li>
                  <li className="flex items-center gap-3 text-white font-medium text-sm"><div className="p-1 rounded-full bg-[#00FF88]/20"><Check size={12} className="text-[#00FF88]"/></div> Professor 24h (Voz/Texto)</li>
                  <li className="flex items-center gap-3 text-white font-medium text-sm"><div className="p-1 rounded-full bg-[#00FF88]/20"><Check size={12} className="text-[#00FF88]"/></div> Análise Preditiva de Aprovação</li>
                  <li className="flex items-center gap-3 text-white font-medium text-sm"><div className="p-1 rounded-full bg-[#00FF88]/20"><Check size={12} className="text-[#00FF88]"/></div> Laboratório de Questões</li>
                  <li className="flex items-center gap-3 text-white font-medium text-sm"><div className="p-1 rounded-full bg-[#00FF88]/20"><Check size={12} className="text-[#00FF88]"/></div> Módulo Inglês Fluência</li>
                </ul>

                <Button onClick={handleUnlock} className="w-full h-14 bg-[#00FF88] hover:bg-[#00D170] text-black font-bold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:shadow-[0_0_50px_rgba(0,255,136,0.6)] hover:scale-[1.02] transition-all rounded-xl">
                  Desbloquear Agora <ArrowRight size={18} className="ml-2"/>
                </Button>
                <p className="text-center text-[10px] text-gray-500 mt-4 font-medium">Garantia incondicional de 7 dias.</p>
             </div>
          </div>

          {/* TRIMESTRAL */}
          <div className="bg-[#0A0A0A] rounded-[32px] p-8 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden">
             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-6">Trimestral</h3>
             <div className="flex items-baseline gap-1 mb-8">
               <span className="text-4xl font-bold text-white">R$ 79,90</span>
               <span className="text-gray-600 text-sm">/trimestre</span>
             </div>
             <ul className="space-y-4 mb-8">
               <li className="flex items-center gap-3 text-gray-400 text-sm"><div className="p-1 rounded-full bg-white/5"><Check size={12} className="text-[#00FF88]"/></div> Recursos Essenciais</li>
               <li className="flex items-center gap-3 text-gray-400 text-sm"><div className="p-1 rounded-full bg-white/5"><Check size={12} className="text-[#00FF88]"/></div> Sem anúncios</li>
               <li className="flex items-center gap-3 text-gray-400 text-sm"><div className="p-1 rounded-full bg-white/5"><Check size={12} className="text-[#00FF88]"/></div> Economia de 15%</li>
             </ul>
             <Button onClick={handleUnlock} variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 rounded-xl h-12">
               Selecionar Trimestral
             </Button>
          </div>

        </div>
      </div>
    </div>
  );
};
