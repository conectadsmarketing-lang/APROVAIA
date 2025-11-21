
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../services/mockDb';
import { Button } from '../components/Button';
import { Lock, Mail, User, ArrowRight, GraduationCap, Check } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsLoading(true);

    // Simulate network delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 1200));

    db.register(name, email, password);
    
    setIsLoading(false);
    // Force redirect to Paywall for new organic users
    navigate('/plans');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Ambient Lighting */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#00FF88]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[400px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-gray-500 text-sm">Junte-se à elite dos estudantes e seja aprovado.</p>
        </div>

        {/* Card */}
        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl shadow-black/50 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <form onSubmit={handleRegister} className="space-y-5">
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Nome Completo</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00FF88] transition-colors" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#121214] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-[#00FF88]/50 focus:outline-none focus:bg-[#00FF88]/5 transition-all placeholder-gray-700 text-sm font-medium"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00FF88] transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#121214] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-[#00FF88]/50 focus:outline-none focus:bg-[#00FF88]/5 transition-all placeholder-gray-700 text-sm font-medium"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00FF88] transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#121214] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-[#00FF88]/50 focus:outline-none focus:bg-[#00FF88]/5 transition-all placeholder-gray-700 text-sm font-medium"
                  placeholder="Crie uma senha forte"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Confirmar Senha</label>
              <div className="relative group">
                <Check className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00FF88] transition-colors" size={18} />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#121214] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-[#00FF88]/50 focus:outline-none focus:bg-[#00FF88]/5 transition-all placeholder-gray-700 text-sm font-medium"
                  placeholder="Repita sua senha"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-4 rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.2)] font-bold text-sm hover:scale-[1.02] transition-transform" isLoading={isLoading}>
              Avançar para Planos <ArrowRight size={18} className="ml-2"/>
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            Já possui conta? <Link to="/login" className="text-[#00FF88] font-bold hover:underline transition-all">Fazer Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
