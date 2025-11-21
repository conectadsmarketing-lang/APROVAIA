
import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Brain, Trophy, CreditCard, X,
  CalendarClock, Layers, FlaskConical, Swords, Briefcase, Heart, 
  ShoppingBag, Medal, Globe, GraduationCap, LineChart, Zap, ShieldCheck
} from 'lucide-react';
import { db } from '../services/mockDb';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const user = db.getUser();
  const location = useLocation();

  const navItems = useMemo(() => [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: LineChart, label: 'Preditivo', path: '/predictive' }, 
    { icon: BookOpen, label: 'Meu Edital', path: '/editais' },
    { icon: Globe, label: 'Inglês IA', path: '/ingles' },
    { icon: CalendarClock, label: 'Cronograma', path: '/cronograma' },
    { icon: FlaskConical, label: 'Lab Questões', path: '/lab' }, 
    { icon: Swords, label: 'Duelos', path: '/duels' }, 
    { icon: Layers, label: 'Simulados', path: '/simulados' },
    { icon: Zap, label: 'Flashcards', path: '/flashcards' },
    { icon: Brain, label: 'Professor IA', path: '/professor' },
    { icon: Trophy, label: 'Ranking', path: '/ranking' },
    { icon: Medal, label: 'Conquistas', path: '/conquistas' },
    { icon: Briefcase, label: 'Carreira', path: '/career' }, 
    { icon: Heart, label: 'Saúde Mental', path: '/health' }, 
  ], []);

  const secondaryItems = useMemo(() => [
    { icon: ShoppingBag, label: 'Loja', path: '/store' },
    { icon: CreditCard, label: 'Assinatura', path: '/plans' },
  ], []);

  const isDashboard = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#0D0F12] text-gray-100 flex font-sans selection:bg-[#6CFF95]/30 selection:text-[#6CFF95] overflow-x-hidden">
      
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[90] lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Desktop) */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-[100] h-screen w-72 
        bg-[#0D0F12]/95 border-r border-white/5 backdrop-blur-xl
        transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="p-8 flex items-center gap-3 border-b border-white/5">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-[#6CFF95]/20 blur-lg rounded-full group-hover:bg-[#6CFF95]/40 transition-all"></div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A86B] to-[#6CFF95] flex items-center justify-center text-[#05060A] font-bold relative z-10 shadow-inner">
              <GraduationCap size={24} strokeWidth={2} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white leading-none">
              Aprovai<span className="text-[#6CFF95]">A</span>
            </span>
            <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-medium">Premium 12.3</span>
          </div>
          
          {/* Close Button Mobile */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden absolute right-4 top-8 text-gray-500 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Profile Mini */}
        <div className="px-6 py-6">
          <div className="p-3 rounded-2xl bg-[#1A1F27] border border-white/5 flex items-center gap-3 group cursor-pointer hover:border-[#6CFF95]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(108,255,149,0.1)]">
             <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden border-2 border-[#6CFF95]/50">
                {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs bg-[#6CFF95] text-black font-bold">{user.name[0]}</div>}
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex justify-between items-center mb-1">
                 <p className="text-sm font-bold text-white truncate group-hover:text-[#6CFF95] transition-colors">{user.name.split(' ')[0]}</p>
                 <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase flex items-center gap-1 bg-[#6CFF95] text-black shadow-[0_0_10px_rgba(108,255,149,0.4)]`}>
                   <ShieldCheck size={10} /> PRO
                 </span>
               </div>
               <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#6CFF95]" style={{width: `${(user.xp % 100)}%`}}></div>
               </div>
             </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-8">
          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-3 mt-2">Ferramentas</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'text-white bg-white/5 font-bold shadow-lg' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'}
                `}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#6CFF95] rounded-r-full shadow-[0_0_15px_#6CFF95]" />}
                <item.icon size={18} className={`transition-colors ${isActive ? 'text-[#6CFF95]' : 'text-gray-500 group-hover:text-white'}`} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}

          <div className="mt-8 text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-3">Conta</div>
          {secondaryItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'text-white bg-white/5 font-bold' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'}
                `}
              >
                <item.icon size={18} className={isActive ? 'text-[#6CFF95]' : 'text-gray-500 group-hover:text-white'} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col relative">
        
        {/* Floating Mobile Header / Menu Trigger */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center pointer-events-none px-4 py-3">
           {/* Logo on Mobile */}
           <div className="pointer-events-auto bg-[#0D0F12]/90 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 shadow-xl flex items-center gap-2">
              <GraduationCap size={22} className="text-[#6CFF95]" />
              <span className="text-lg font-bold text-white tracking-tight">Aprova<span className="text-[#6CFF95]">IA</span></span>
           </div>

           {/* Menu Button Right Aligned with Text Below */}
           <button 
            onClick={() => setIsMobileOpen(true)}
            className="pointer-events-auto flex flex-col items-center justify-center gap-0.5"
          >
            <div className="bg-[#0D0F12]/90 backdrop-blur-md border border-white/10 rounded-xl w-12 h-10 flex flex-col items-center justify-center gap-1 shadow-xl active:scale-95 transition-all">
                <div className="w-6 h-0.5 bg-[#6CFF95] rounded-full"></div>
                <div className="w-6 h-0.5 bg-[#6CFF95] rounded-full"></div>
                <div className="w-6 h-0.5 bg-[#6CFF95] rounded-full"></div>
            </div>
            <span className="text-[9px] font-bold text-[#6CFF95] tracking-wider shadow-black drop-shadow-sm">MENU</span>
          </button>
        </div>

        <div className={`flex-1 w-full ${isDashboard ? 'p-0' : 'p-4 md:p-8 pt-24 lg:pt-8'}`}>
          {children}
        </div>
      </main>
    </div>
  );
};
