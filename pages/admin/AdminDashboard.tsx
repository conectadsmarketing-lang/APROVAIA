
import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { 
  Users, DollarSign, FileText, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Activity, CreditCard, MessageSquare, BarChart2, AlertTriangle, Clock
} from 'lucide-react';
import { db } from '../../services/mockDb';
import { AdminStats } from '../../types';
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { Skeleton } from '../../components/Skeleton';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    // Simulate Loading
    setTimeout(() => {
      setStats(db.getAdminStats());
    }, 800);
  }, []);

  if (!stats) {
    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-4 gap-6">
           {[1,2,3,4].map(i => <Skeleton key={i} height={140} />)}
        </div>
        <Skeleton height={400} />
      </div>
    );
  }

  const cards = [
    { label: 'Receita Total', value: `R$ ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10', trend: '+15%', sub: 'vs. mês anterior' },
    { label: 'Usuários Totais', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: `+${stats.weeklyGrowth}%`, sub: 'Crescimento' },
    { label: 'Assinaturas Ativas', value: stats.activeSubscriptions.toLocaleString(), icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: `+${stats.newSubscriptionsMonth}`, sub: 'Novas este mês' },
    { label: 'Churn Rate', value: `${stats.churnRate}%`, icon: Activity, color: 'text-red-500', bg: 'bg-red-500/10', trend: '-0.5%', sub: 'Retenção estável' },
  ];

  const detailedMetrics = [
    { label: 'Conversão Paywall', value: `${stats.paywallConversion}%`, icon: TrendingUp },
    { label: 'Média Horas/Aluno', value: `${stats.avgStudyHours}h`, icon: Clock },
    { label: 'Simulados Realizados', value: stats.totalSimulados, icon: FileText },
    { label: 'Msgs Professor IA', value: stats.totalAIMessages, icon: MessageSquare },
  ];

  const revenueData = [
    { name: 'Seg', value: 1200 }, { name: 'Ter', value: 1900 }, { name: 'Qua', value: 1500 },
    { name: 'Qui', value: 2800 }, { name: 'Sex', value: 2100 }, { name: 'Sáb', value: 3500 }, { name: 'Dom', value: 4200 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard AprovaIA</h1>
          <p className="text-gray-400 text-sm">Visão geral de performance do SaaS.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-[#111] border border-white/10 text-gray-400 px-4 py-2 rounded-lg text-xs font-bold hover:text-white transition-colors">Exportar Relatório</button>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Card key={i} className="border-white/5 bg-[#0F0F11] hover:border-white/20 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                 <card.icon size={22} />
               </div>
               {card.trend && (
                 <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-white/5 ${card.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {card.trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {card.trend}
                 </div>
               )}
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{card.value}</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{card.label}</p>
            <p className="text-[10px] text-gray-600">{card.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 bg-[#0F0F11] border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white flex items-center gap-2"><DollarSign size={18} className="text-green-500"/> Receita Recorrente (MRR)</h3>
            <select className="bg-black border border-white/10 text-xs text-gray-400 rounded px-2 py-1 outline-none">
              <option>Últimos 7 dias</option>
              <option>Este Mês</option>
            </select>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#444" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#444" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#10B981' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Secondary Metrics */}
        <div className="space-y-6">
          <Card className="bg-[#0F0F11] border-white/5">
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-widest text-gray-500">Engajamento</h3>
            <div className="grid grid-cols-2 gap-4">
               {detailedMetrics.map((m, i) => (
                 <div key={i} className="p-4 rounded-xl bg-[#161618] border border-white/5 hover:border-white/10 transition-colors">
                    <m.icon size={18} className="text-gray-400 mb-2" />
                    <p className="text-xl font-bold text-white">{m.value}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{m.label}</p>
                 </div>
               ))}
            </div>
          </Card>

          <Card className="bg-[#0F0F11] border-white/5 flex-1">
             <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest text-gray-500">Atividade Recente</h3>
             <div className="space-y-4">
               {stats.recentActivity.map((act, i) => (
                 <div key={i} className="flex items-center justify-between text-sm pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <div>
                      <p className="text-white font-medium">{act.type}</p>
                      <p className="text-xs text-gray-500">{act.user}</p>
                    </div>
                    <span className="text-xs text-gray-600">{act.time}</span>
                 </div>
               ))}
             </div>
          </Card>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-green-500/5 border border-green-500/10 p-4 rounded-xl flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-green-500 font-bold text-sm">API Professor IA</p>
              <p className="text-xs text-gray-500">Operacional (Gemini 2.5)</p>
            </div>
         </div>
         <div className="bg-green-500/5 border border-green-500/10 p-4 rounded-xl flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-green-500 font-bold text-sm">Gateway Pagamento</p>
              <p className="text-xs text-gray-500">Operacional (PicPay/Pix)</p>
            </div>
         </div>
         <div className={`p-4 rounded-xl flex items-center gap-4 border ${stats.errorLogs > 0 ? 'bg-red-500/5 border-red-500/10' : 'bg-gray-800/20 border-white/5'}`}>
            <div className={`w-2 h-2 rounded-full ${stats.errorLogs > 0 ? 'bg-red-500' : 'bg-gray-500'}`}></div>
            <div>
              <p className={`${stats.errorLogs > 0 ? 'text-red-500' : 'text-gray-400'} font-bold text-sm`}>Logs de Erro</p>
              <p className="text-xs text-gray-500">{stats.errorLogs} incidentes</p>
            </div>
         </div>
      </div>
    </div>
  );
};