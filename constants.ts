import { PlanType } from "./types";

export const APP_NAME = "AprovaIA";
export const PRIMARY_COLOR = "#00FF88"; // Neon Green

export const PLANS = [
  {
    id: PlanType.MONTHLY,
    name: "Mensal",
    price: 29.90,
    features: ["Professor IA 24h", "Simulados Ilimitados", "Módulo de Inglês Básico"],
    popular: false
  },
  {
    id: PlanType.QUARTERLY,
    name: "Trimestral",
    price: 79.90,
    features: ["Economize 15%", "Tudo do mensal", "Cronograma Inteligente"],
    popular: false
  },
  {
    id: PlanType.YEARLY,
    name: "Anual",
    price: 199.90,
    features: ["Economize 50%", "Mentor IA Dedicado", "Inglês Fluência IA", "Acesso Antecipado"],
    popular: true
  },
];

export const MOCK_USER_ID = "user_12345";

export const BADGES = [
  { id: 'first_step', name: 'Primeiro Passo', icon: '🦶', desc: 'Criou a conta' },
  { id: 'study_machine', name: 'Máquina', icon: '🤖', desc: 'Estudou 4h seguidas' },
  { id: 'week_streak', name: 'Constância', icon: '🔥', desc: '7 dias seguidos' },
  { id: 'polyglot', name: 'Poliglota', icon: '🌍', desc: 'Completou 10 lições de Inglês' },
  { id: 'edital_slayer', name: 'Matador de Edital', icon: '⚔️', desc: 'Fechou 50% de um edital' },
  { id: 'duel_master', name: 'Gladiador', icon: '🛡️', desc: 'Venceu 10 duelos' },
];

export const STORE_ITEMS = [
  { id: 'theme_cyber', name: 'Tema Cyberpunk', price: 1000, type: 'theme', icon: '👾' },
  { id: 'avatar_lion', name: 'Avatar Leão Dourado', price: 500, type: 'avatar', icon: '🦁' },
  { id: 'effect_fire', name: 'Efeito de Fogo no Perfil', price: 2000, type: 'effect', icon: '🔥' },
];