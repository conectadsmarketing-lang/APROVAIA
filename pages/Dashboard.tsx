
import React, { useEffect, useState } from 'react';
import { 
  Target, Zap, BookOpen, Swords, CalendarClock, 
  FlaskConical, Globe, ChevronRight, GraduationCap, Play, 
  Flame, ArrowRight, Sparkles, Trophy, TrendingUp
} from 'lucide-react';
import { db } from '../services/mockDb';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Card } from '../components/Card';

// Icon map helper
const iconMap: any = {
    "BookOpen": BookOpen,
    "Play": Play,
    "Target": Target,
    "Zap": Zap,
    "Globe": Globe
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(db.getUser());
  const [activeSlide, setActiveSlide] = useState(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const SLIDES = [
    {
      id: 0,
      title: "Desbloqueie seu Potencial com IA",
      subtitle: "Comece Agora",
      desc: "Planos de estudo, provas simuladas e resumos criados automaticamente a partir do seu edital.",
      gradient: "from-[#0D0F12] via-[#111827] to-[#064E3B]",
      accent: "#6CFF95"
    },
    {
      id: 1,
      title: "A IA estuda por você, você só avança.",
      subtitle: "Alta Performance",
      desc: "Algoritmos preditivos que eliminam o desperdício de tempo.",
      gradient: "from-[#0D0F12] via-[#111827] to-[#1E3A8A]",
      accent: "#60A5FA"
    },
    {
      id: 2,
      title: "Tecnologia 6.0 • IA treinada com provas reais.",
      subtitle: "Banco de Dados",
      desc: "Milhares de questões processadas para entender sua banca.",
      gradient: "from-[#0D0F12] via-[#111827] to-[#581C87]",
      accent: "#A855F7"
    },
    {
      id: 3,
      title: "Você envia o edital. A AprovaiA cria o plano perfeito.",
      subtitle: "Inteligência Pura",
      desc: "Esqueça planilhas. Deixe a IA organizar sua rota até a posse.",
      gradient: "from-[#0D0F12] via-[#111827] to-[#831843]",
      accent: "#F472B6"
    }
  ];

  const TOOLS = [
    { label: 'Enviar Edital', icon: BookOpen, path: '/editais', color: 'text-[#6CFF95]' },
    { label: 'Simulados', icon: Target, path: '/simulados', color: 'text-blue-400' },
    { label: 'Lab Questões', icon: FlaskConical, path: '/lab', color: 'text-purple-400' },
    { label: 'Inglês IA', icon: Globe, path: '/ingles', color: 'text-pink-400' },
    { label: 'Flashcards', icon: Zap, path: '/flashcards', color: 'text-yellow-400' },
    { label: 'Duelo IA', icon: Swords, path: '/duels', color: 'text-orange-400' },
    { label: 'Cronograma', icon: CalendarClock, path: '/cronograma', color: 'text-white' },
    { label: 'Meu Edital', icon: BookOpen, path: '/editais', color: 'text-white' },
  ];

  useEffect(() => {
    setUser(db.getUser());
    setRecommendations(db.getSmartRecommendations());

    const slideInterval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  const renderRecommendationItem = (item: any, i: number) => {
      const Icon = iconMap[item.icon] || Sparkles;
      return (
        <div key={i} onClick={() => navigate(item.action)} className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#0D0F12] border border-white/5 hover:border-white/20 transition-all cursor-pointer hover:-translate-x-1 mb-2">
            <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.text} flex items-center justify-center flex-shrink-0 shadow-inner`}>
                <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-200 truncate">{item.title}</h4>
                <p className="text-[11px] text-gray-500 truncate">{item.sub}</p>
            </div>
            <ChevronRight size={14} className="text-gray-600" />
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-gray-100 font-sans overflow-x-hidden pb-32">
      <style>{`
        @keyframes jump {
            0% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .tool-card-mobile {
            min-width: 110px !important;
            height: 120px !important;
            background: rgba(255,255,255,0.04);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            scroll-snap-align: center;
        }
      `}</style>

      {/* ================= MOBILE HERO (HOTFIX V12.3) ================= */}
      <div className="lg:hidden pt-20 px-4 w-full">
         <div className="w-full min-h-[420px] rounded-[22px] p-6 bg-[#101820] border border-white/5 shadow-[0_0_30px_rgba(108,255,149,0.07)] flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${SLIDES[activeSlide].gradient} opacity-80 transition-opacity duration-1000`}></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-[85px] h-[85px] flex items-center justify-center mb-4" style={{ animation: 'jump 1.8s ease-in-out infinite' }}>
                    <div className="absolute bg-[#6CFF95]/30 blur-xl w-16 h-16 rounded-full"></div>
                    <GraduationCap size={60} className="text-[#6CFF95] drop-shadow-lg relative z-10" />
                </div>

                <h1 className="text-[1.75rem] leading-[2.1rem] font-black text-white mb-3 tracking-tight">
                  {SLIDES[activeSlide].title}
                </h1>
                <p className="text-[1rem] text-gray-300 mb-6 opacity-90 leading-relaxed">
                  {SLIDES[activeSlide].desc}
                </p>
                
                <button 
                  onClick={() => navigate('/editais')}
                  className="w-full h-[56px] bg-[#6CFF95] hover:bg-[#5BE584] text-black font-bold text-[1.1rem] rounded-xl shadow-[0_0_20px_rgba(108,255,149,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Começar meus Estudos <ArrowRight size={20} />
                </button>
            </div>

            <div className="absolute bottom-4 flex gap-1.5 z-20">
              {SLIDES.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === activeSlide ? 'w-6 bg-[#6CFF95]' : 'w-1.5 bg-white/30'}`}></div>
              ))}
            </div>
         </div>
      </div>

      {/* ================= DESKTOP HERO (ORIGINAL PREMIUM) ================= */}
      <div className="hidden lg:block relative w-full h-[550px] overflow-hidden rounded-[40px] mx-auto mt-4 max-w-[96%] shadow-2xl border border-white/10 group">
        {SLIDES.map((slide, index) => (
          <div 
            key={slide.id}
            className={`
              absolute inset-0 w-full h-full transition-opacity duration-[1200ms] ease-in-out
              bg-gradient-to-br ${slide.gradient}
              ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            `}
          >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
          </div>
        ))}

        <div className="relative z-20 h-full flex items-center justify-between px-24">
          <div className="max-w-2xl flex flex-col items-start space-y-6">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
               <Sparkles size={14} className="text-[#6CFF95]" />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                 {SLIDES[activeSlide].subtitle}
               </span>
             </div>
             <h1 className="text-6xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                {SLIDES[activeSlide].title}
             </h1>
             <p className="text-lg font-medium text-gray-300 leading-relaxed max-w-lg">
                {SLIDES[activeSlide].desc}
             </p>
             <button 
               onClick={() => navigate('/editais')}
               className="relative overflow-hidden px-8 py-4 rounded-2xl bg-[#6CFF95] hover:bg-[#5BE584] text-[#05060A] font-bold text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(108,255,149,0.3)] hover:scale-[1.02] transition-all duration-300 group/btn"
             >
               <span className="relative z-10 flex items-center gap-3">
                 Começar meus Estudos <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
               </span>
             </button>
          </div>

          <div className="relative perspective-1000">
             <div className="relative w-72 h-72 flex items-center justify-center" style={{ animation: 'float 6s ease-in-out infinite' }}>
                <div className="absolute inset-0 bg-[#6CFF95]/20 blur-[80px] rounded-full animate-pulse"></div>
                <GraduationCap size={220} className="text-[#6CFF95] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" strokeWidth={0.8} />
             </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2.5">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === activeSlide ? 'w-8 bg-[#6CFF95] shadow-[0_0_10px_#6CFF95]' : 'w-2 bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* ================= TOOLS CAROUSEL (HOTFIX MOBILE) ================= */}
      <div className="mt-8 px-4 lg:px-12 max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Ferramentas IA
          </h2>
        </div>

        <div className="flex overflow-x-auto gap-3.5 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
           {TOOLS.map((tool, i) => (
             <div 
               key={i}
               onClick={() => navigate(tool.path)}
               className="tool-card-mobile shrink-0 cursor-pointer active:scale-95 transition-transform lg:w-44 lg:h-48 lg:bg-[#1A1F27] lg:hover:bg-[#222831] lg:border lg:border-white/5"
             >
                <div className={`mb-3 lg:p-4 lg:rounded-2xl lg:bg-[#0D0F12] ${tool.color}`}>
                   <tool.icon size={28} className="lg:w-9 lg:h-9" />
                </div>
                <span className="text-[10px] lg:text-xs font-bold text-white text-center px-2 leading-tight">
                  {tool.label}
                </span>
             </div>
           ))}
        </div>
      </div>

      {/* ================= WIDGETS / PROGRESS ================= */}
      <div className="mt-4 px-4 lg:px-12 max-w-[1800px] mx-auto">
        {/* Progress Section */}
        <div className="bg-white/5 rounded-[20px] p-5 mb-6 lg:hidden">
           <h3 className="text-[1.35rem] font-extrabold text-white mb-4">Seu Progresso</h3>
           <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
             <div className="min-w-[130px] p-4 bg-white/5 rounded-[18px] text-center">
                <div className="text-[1.8rem] font-black text-[#6CFF95] mb-1">{user.streak}</div>
                <div className="text-xs font-bold text-white">Dias Seguidos</div>
             </div>
             <div className="min-w-[130px] p-4 bg-white/5 rounded-[18px] text-center">
                <div className="text-[1.8rem] font-black text-[#6CFF95] mb-1">{user.xp}</div>
                <div className="text-xs font-bold text-white">XP Total</div>
             </div>
             <div className="min-w-[130px] p-4 bg-white/5 rounded-[18px] text-center">
                <div className="text-[1.8rem] font-black text-[#6CFF95] mb-1">Lvl {user.level}</div>
                <div className="text-xs font-bold text-white">Nível Atual</div>
             </div>
           </div>
        </div>

        {/* Desktop Widgets */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
           <div className="col-span-2 bg-[#1A1F27]/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#6CFF95]/5 rounded-full blur-[80px] pointer-events-none"></div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Seu Progresso</h3>
                  <p className="text-sm text-gray-400">Mantenha a constância.</p>
                </div>
                <div className="bg-[#0D0F12] px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg">
                  <Trophy size={16} className="text-yellow-500" />
                  <span className="text-xs font-bold text-white">Lvl {user.level}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 relative z-10">
                 <div className="bg-[#0D0F12] rounded-2xl p-5 border border-white/5 flex flex-col items-center justify-center text-center hover:border-orange-500/30 transition-colors">
                    <div className="mb-3 p-3 bg-orange-500/10 rounded-full text-orange-500">
                      <Flame size={24} fill="currentColor" />
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tight">{user.streak}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mt-1">Dias Seguidos</span>
                 </div>
                 <div className="bg-[#0D0F12] rounded-2xl p-5 border border-white/5 flex flex-col items-center justify-center text-center hover:border-[#6CFF95]/30 transition-colors">
                    <div className="mb-3 p-3 bg-[#6CFF95]/10 rounded-full text-[#6CFF95]">
                      <TrendingUp size={24} />
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tight">{user.xp}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mt-1">XP Total</span>
                 </div>
              </div>
           </div>

           {/* Recommended Desktop */}
           <div className="bg-[#1A1F27]/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 flex flex-col h-full">
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                 <Sparkles className="text-purple-400" size={18} /> Recomendado pela IA
               </h3>
               <div className="flex-1 space-y-3">
                 {recommendations.map((item, i) => renderRecommendationItem(item, i))}
               </div>
           </div>
        </div>

        {/* Recommended Section (Mobile Hotfix) */}
        <div className="bg-white/5 rounded-[20px] p-[22px] mt-6 mb-8 lg:hidden">
            <div className="text-[1.3rem] font-extrabold text-white mb-4">Recomendado pela IA</div>
            {recommendations.map((item, i) => (
               <div key={i} onClick={() => navigate(item.action)} className="bg-white/5 p-3.5 rounded-[16px] mb-3 flex items-center justify-between active:bg-white/10 transition-colors">
                   <div>
                       <div className="text-[1rem] font-bold text-white">{item.title}</div>
                       <div className="text-[0.85rem] text-gray-400">{item.sub}</div>
                   </div>
                   <div className="text-[#6CFF95] font-bold text-xl">→</div>
               </div>
            ))}
        </div>
      </div>

    </div>
  );
};
