
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut, 
  Shield,
  FileText,
  Sparkles,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';
import { db } from '../services/mockDb';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const user = db.getUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    db.logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Gestão de Usuários', path: '/admin/users' },
    { icon: Sparkles, label: 'Ferramentas IA', path: '/admin/ai' },
    { icon: Settings, label: 'Configurações SaaS', path: '/admin/config' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex font-sans selection:bg-blue-500/30 selection:text-blue-500">
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 
        bg-[#0A0A0A] border-r border-white/5
        transition-transform duration-300 ease-in-out
        flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <Shield size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white leading-none">
              APROVAI<span className="text-blue-500">a</span>
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Admin Pro</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-blue-600/10 text-blue-500 font-medium' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                `}
              >
                <item.icon size={18} className={isActive ? 'text-blue-500' : 'text-gray-500 group-hover:text-white'} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#0A0A0A]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
          >
            <LogOut size={18} />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
        
        {/* Admin Warning Header */}
        <div className="bg-yellow-500/10 border-b border-yellow-500/10 py-1.5 px-4 flex items-center justify-center gap-2 text-xs font-bold text-yellow-500">
           <AlertTriangle size={12} /> ⚠ Área Administrativa - Acesso Restrito
        </div>

        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-[#0A0A0A] border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-30">
          <span className="font-bold text-white">Admin Console</span>
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-gray-300">
            {isMobileOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
           {children}
        </div>
      </main>
    </div>
  );
};
