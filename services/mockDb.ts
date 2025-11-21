
import { Edital, User, UserRole, PlanType, StudySession, Flashcard, Task, Simulado, Achievement, EnglishLesson, Duel, HealthLog, StoreItem, Subject, Payment, SystemConfig, AdminStats } from "../types";
import { MOCK_USER_ID, STORE_ITEMS } from "../constants";

// --- INITIAL DATA CONFIGURATION ---

const DEFAULT_USER: User = {
  id: MOCK_USER_ID,
  name: "Estudante APROVAIa",
  email: "aluno@aprovaia.com",
  role: UserRole.STUDENT,
  plan: PlanType.YEARLY,
  xp: 1250,
  level: 5,
  streak: 3,
  coins: 100,
  badges: [],
  createdAt: new Date().toISOString(),
  dailyGoal: 120,
  studiedToday: 45,
  englishLevel: 'B1',
  subscriptionStatus: 'ACTIVE',
  currentSessionId: 'mvp_session',
  isBanned: false
};

const INITIAL_CONFIG: SystemConfig = {
  appName: "AprovaIA",
  welcomeMessage: "Bem-vindo à Elite dos Concursos.",
  monthlyPrice: 29.90,
  features: {
    english: true,
    duels: true,
    tutorIA: true,
    store: true
  },
  colors: {
    primary: "#00FF88"
  }
};

// --- MOCK DATABASE STORAGE ---

export const db = {
  getUser: (): User => {
    const stored = localStorage.getItem('aprovaia_user');
    if (stored) return JSON.parse(stored);
    return DEFAULT_USER;
  },

  updateUser: (data: Partial<User>): User => {
    const current = db.getUser();
    const updated = { ...current, ...data };
    localStorage.setItem('aprovaia_user', JSON.stringify(updated));
    return updated;
  },

  login: (email: string, password: string): { success: boolean; user?: User; error?: string } => ({ success: true, user: DEFAULT_USER }),
  register: (name: string, email: string, password: string) => DEFAULT_USER,
  logout: () => {},
  verifySession: () => true,

  getSystemConfig: (): SystemConfig => {
    const stored = localStorage.getItem('aprovaia_config');
    return stored ? JSON.parse(stored) : INITIAL_CONFIG;
  },
  updateSystemConfig: (config: Partial<SystemConfig>) => {
    const current = db.getSystemConfig();
    const updated = { ...current, ...config };
    localStorage.setItem('aprovaia_config', JSON.stringify(updated));
    return updated;
  },
  
  getAllUsers: () => [DEFAULT_USER],
  banUser: (userId: string) => {},
  promoteUser: (userId: string) => {},
  getAdminStats: () => ({
    totalUsers: 15420,
    activeSubscriptions: 12892,
    totalRevenue: 452000,
    totalEditais: 3420,
    weeklyGrowth: 25,
    newSubscriptionsMonth: 1240,
    churnRate: 0.4,
    paywallConversion: 38.5,
    avgStudyHours: 5.2,
    totalSimulados: 15600,
    totalAIMessages: 89000,
    errorLogs: 0,
    recentActivity: []
  }),
  
  getPayments: (): Payment[] => [],
  createPayment: (payment: Payment) => {},
  updatePaymentStatus: (referenceId: string, status: 'paid' | 'failed') => true,

  getEditais: (): Edital[] => { const s = localStorage.getItem('aprovaia_editais'); return s ? JSON.parse(s) : []; },
  saveEdital: (e: Edital) => { const l = db.getEditais(); l.push(e); localStorage.setItem('aprovaia_editais', JSON.stringify(l)); return e; },
  getEditalById: (id: string) => db.getEditais().find(e => e.id === id),
  getSubjectById: (eid: string, sid: string) => { const e = db.getEditalById(eid); const s = e?.subjects.find(sub => sub.id === sid); return e && s ? { edital: e, subject: s } : null; },
  
  toggleTopicStudy: (eid: string, sid: string, tid: string) => { 
      const editais = db.getEditais();
      const eIdx = editais.findIndex(e => e.id === eid);
      if(eIdx === -1) return;
      const sIdx = editais[eIdx].subjects.findIndex(s => s.id === sid);
      if(sIdx === -1) return;
      const tIdx = editais[eIdx].subjects[sIdx].topics.findIndex(t => t.id === tid);
      if(tIdx === -1) return;
      editais[eIdx].subjects[sIdx].topics[tIdx].studied = !editais[eIdx].subjects[sIdx].topics[tIdx].studied;
      const totalTopics = editais[eIdx].subjects[sIdx].topics.length;
      const completedTopics = editais[eIdx].subjects[sIdx].topics.filter(t => t.studied).length;
      editais[eIdx].subjects[sIdx].progress = (completedTopics / totalTopics) * 100;
      localStorage.setItem('aprovaia_editais', JSON.stringify(editais));
  },

  addXP: (xp: number) => { const u = db.getUser(); if(u) db.updateUser({ xp: u.xp + xp }); },
  
  getRanking: () => Array.from({ length: 5 }).map((_, i) => ({ ...DEFAULT_USER, id: `fake_${i}`, name: `Usuário ${i+1}`, xp: 5000 - (i*500) })),
  getAchievements: () => [{ id: '1', name: 'Primeiro Passo', icon: '🦶', description: 'Criou a conta.', unlocked: true }],
  getStoreItems: () => STORE_ITEMS.map(i => ({ ...i, type: i.type as any, owned: false })),
  buyStoreItem: (id: string) => true,
  
  getDuels: (): Duel[] => [{ id: '1', opponentName: 'Ana', subject: 'Constitucional', scoreUser: 0, scoreOpponent: 0, status: 'waiting', opponentAvatar: '' }],
  createDuel: (subject: string) => ({ id: Date.now().toString(), opponentName: 'Aguardando...', opponentAvatar: '', subject, scoreUser: 0, scoreOpponent: 0, status: 'waiting' } as Duel),
  
  getHealthLogs: () => [],
  addHealthLog: (log: HealthLog) => {},
  
  // --- SIMULADOS MANAGEMENT ---
  getSimulados: (): Simulado[] => {
    const s = localStorage.getItem('aprovaia_simulados');
    return s ? JSON.parse(s) : [];
  },
  
  saveSimuladoResult: (simulado: Simulado) => {
    const list = db.getSimulados();
    list.unshift(simulado); // Add to top
    localStorage.setItem('aprovaia_simulados', JSON.stringify(list));
    db.addXP(simulado.totalQuestions * 10); // Reward
  },

  // --- RECOMMENDATION ENGINE ---
  getSmartRecommendations: () => {
    // Logic to recommend based on empty edital or last simulado
    const editais = db.getEditais();
    const simulados = db.getSimulados();
    
    const recs = [];
    
    if (editais.length === 0) {
      recs.push({ title: "Configurar Meu Edital", sub: "O primeiro passo para a aprovação", icon: "BookOpen", bg: "bg-green-500/10", text: "text-green-400", action: "/editais" });
    } else {
      const pendingSubject = editais[0].subjects.find(s => s.progress < 100);
      if (pendingSubject) {
        recs.push({ title: `Estudar ${pendingSubject.name}`, sub: "Continue de onde parou", icon: "Play", bg: "bg-blue-500/10", text: "text-blue-400", action: `/subject/${editais[0].id}/${pendingSubject.id}` });
      }
    }

    if (simulados.length === 0) {
      recs.push({ title: "Fazer 1º Simulado", sub: "Descubra seu nível atual", icon: "Target", bg: "bg-purple-500/10", text: "text-purple-400", action: "/simulados" });
    } else {
      const last = simulados[0];
      if (last.score && (last.score / last.totalQuestions) < 0.7) {
        recs.push({ title: "Revisão de Erros", sub: "Reforce pontos fracos do último teste", icon: "Zap", bg: "bg-red-500/10", text: "text-red-400", action: "/flashcards" });
      } else {
        recs.push({ title: "Novo Simulado Avançado", sub: "Aumente a dificuldade", icon: "Target", bg: "bg-purple-500/10", text: "text-purple-400", action: "/simulados" });
      }
    }
    
    // Always add English
    recs.push({ title: "Inglês - Prática Diária", sub: "Expanda seu vocabulário", icon: "Globe", bg: "bg-pink-500/10", text: "text-pink-400", action: "/ingles" });

    return recs.slice(0, 3);
  }
};
