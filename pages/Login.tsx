
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../services/mockDb';
import { Button } from '../components/Button';
import { Lock, Mail, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const result = db.login(email, password);

    setIsLoading(false);

    if (result.success && result.user) {
      if (result.user.role === UserRole.ADMIN) {
        navigate('/admin');
        return;
      } 
      
      // If subscription is active (Premium or Free Tier Test User), go to Dashboard
      if (result.user.subscriptionStatus === 'ACTIVE') {
        navigate('/');
        return;
      } 
      
      // Pending users go to paywall
      navigate('/plans');

    } else {
      setError(result.error || 'Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00FF88] to-transparent opacity-50"></div>
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#00FF88]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[400px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#0A0A0A] border border-[#00FF88]/20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-[#00FF88] shadow-[0_0_40px_rgba(0,255,136,0.1)] relative group">
             <GraduationCap size={36} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Aprova<span className="text-[#00FF88]">IA</span></h1>
          <p className="text-gray-500 text-sm font-medium">Acesso Seguro</p>
        </div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl shadow-black/50 relative">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#121214] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-[#00FF88]/50 focus:outline-none text-sm"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#121214] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-[#00FF88]/50 focus:outline-none text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 rounded-2xl bg-[#00FF88] hover:bg-[#00D170] text-black font-bold text-sm shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:scale-[1.02] transition-all duration-300" 
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link to="/register">
              <Button variant="secondary" className="w-full py-3 text-xs border-white/5 bg-white/5 hover:bg-white/10 hover:text-white text-gray-400">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};