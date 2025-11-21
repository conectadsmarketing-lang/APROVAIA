
import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- HELPER: TIMEOUT & JSON PARSER ---

const AI_TIMEOUT_MS = 15000; // 15 Seconds Max (Regra de Ouro)

// Função cirúrgica para extrair JSON de respostas com texto misturado
const extractJSON = (text: string): string => {
  try {
    if (!text) return "{}";
    // Remove markdown code blocks
    let clean = text.replace(/```json/g, '').replace(/```/g, '');
    
    // Encontra o primeiro { e o último } para garantir objeto válido
    const firstOpen = clean.indexOf('{');
    const lastClose = clean.lastIndexOf('}');
    
    if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
      clean = clean.substring(firstOpen, lastClose + 1);
    }
    
    return clean.trim();
  } catch (e) {
    return "{}";
  }
};

const callAI = async <T>(apiCall: Promise<any>, fallback: T): Promise<T> => {
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout: A IA demorou a responder.")), AI_TIMEOUT_MS)
    );

    const response = await Promise.race([apiCall, timeoutPromise]) as any;
    
    if (!response.text) throw new Error("Resposta vazia da IA");
    
    try {
      const jsonStr = extractJSON(response.text);
      const parsed = JSON.parse(jsonStr);
      
      // Validação: se esperamos array e veio objeto (ou vice versa), retorne fallback ou tente corrigir
      if (Array.isArray(fallback) && !Array.isArray(parsed) && parsed.questions) return parsed.questions; // Adaptação comum
      if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
      
      return parsed as T;
    } catch (jsonError) {
      console.warn("Erro ao fazer parse do JSON da IA.", jsonError);
      // Se falhar o parse, mas o fallback for string, retorna o texto cru
      if (typeof fallback === 'string') return response.text as unknown as T;
      return fallback;
    }
  } catch (error) {
    console.error("AI Service Error:", error);
    return fallback;
  }
};

// --- TYPES ---

export type ChatMode = 'standard' | 'child' | 'university' | 'analogy' | 'funny' | 'technical' | 'summarized';

// --- FUNCTIONS ---

export const processEditalText = async (text: string): Promise<{ institution: string; position: string; subjects: any[]; summary: string; tips: string[] }> => {
  // Se o usuário enviou "Arquivo Carregado...", instruímos a IA a criar um plano genérico robusto
  const isFileSimulation = text.includes("[ARQUIVO CARREGADO]");
  
  const prompt = `
    ATENÇÃO: VOCÊ É UM ESPECIALISTA EM CONCURSOS.
    ${isFileSimulation ? 'O usuário fez upload de um edital PDF. Gere um plano de estudos PADRÃO PARA CONCURSOS PÚBLICOS (Português, Direito, RLM, Informática) de nível médio/superior.' : 'Analise este texto de edital.'}
    
    Retorne APENAS JSON VÁLIDO com esta estrutura:
    {
      "institution": "Nome da Banca (ou Estimada)",
      "position": "Cargo Identificado (ou Sugerido)",
      "summary": "Resumo estratégico de 3 linhas",
      "tips": ["Dica prática 1", "Dica prática 2", "Dica prática 3"],
      "subjects": [
        { 
          "name": "Nome da Matéria", 
          "weight": 3, 
          "topics": [{ "name": "Tópico 1" }, { "name": "Tópico 2" }] 
        }
      ]
    }
    
    Conteúdo: ${text.substring(0, 30000)}
  `;

  const fallback = {
    institution: "Banca Examinadora",
    position: "Cargo Público",
    summary: "Não foi possível ler os detalhes específicos, mas geramos um plano base.",
    tips: ["Foque nas matérias básicas", "Resolva muitas questões"],
    subjects: [
      { name: "Língua Portuguesa", weight: 3, topics: [{ name: "Interpretação de Texto" }, { name: "Gramática" }] },
      { name: "Direito Constitucional", weight: 2, topics: [{ name: "Direitos Fundamentais" }] },
      { name: "Raciocínio Lógico", weight: 1, topics: [{ name: "Lógica Proposicional" }] }
    ]
  };

  return callAI(
    ai.models.generateContent({ 
      model: 'gemini-2.5-flash', 
      contents: prompt,
      config: { responseMimeType: 'application/json' } 
    }),
    fallback
  );
};

export const getChatResponse = async (history: { role: string, content: string }[], message: string, mode: ChatMode = 'standard') => {
  const model = "gemini-2.5-flash";
  
  const modesInstructions = {
    standard: "Você é um Professor de Elite. Responda de forma direta, motivadora e didática. Use formatação Markdown.",
    child: "EXPLIQUE COMO PARA UMA CRIANÇA DE 10 ANOS. Use metáforas simples, brinquedos e linguagem fácil.",
    university: "Modo PhD Acadêmico. Use termos técnicos, cite teorias e seja profundo.",
    analogy: "USE APENAS ANALOGIAS. Explique comparando com futebol, culinária, carros ou situações cotidianas.",
    funny: "Seja um professor de cursinho engraçado, use gírias leves (tipo 'galera', 'bora') e seja carismático.",
    technical: "Seja estritamente técnico e jurídico. Cite leis, artigos e súmulas secamente.",
    summarized: "Responda em UM ÚNICO parágrafo curto e direto ao ponto."
  };

  const systemInstruction = `
    ${modesInstructions[mode]}
    Objetivo: Ensinar o aluno sobre concursos e estudos.
    Se não souber, admita.
    SEMPRE responda no idioma Português Brasil.
  `;

  try {
    // Limit history to last 8 messages to prevent token overload
    const safeHistory = history.slice(-8).map(h => ({ 
      role: h.role as 'user' | 'model', 
      parts: [{ text: h.content }] 
    }));

    const chat = ai.chats.create({
      model: model,
      config: { systemInstruction },
      history: safeHistory
    });

    const result = await Promise.race([
        chat.sendMessage({ message }),
        new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), AI_TIMEOUT_MS))
    ]) as any;

    return result.text;
  } catch (error) {
    return "⚠️ O Professor IA está recalculando a rota (Timeout). Por favor, pergunte novamente de outra forma.";
  }
};

export const generateFlashcards = async (topic: string, context: 'general' | 'english' = 'general'): Promise<Array<{front: string, back: string}>> => {
  const prompt = context === 'english'
    ? `Create 5 flashcards for English learning about: "${topic}". JSON ONLY: [{ "front": "English Term", "back": "Portuguese Translation/Definition" }]`
    : `Crie 5 flashcards didáticos sobre: "${topic}". RETORNE APENAS JSON: [{ "front": "Pergunta/Conceito", "back": "Resposta Curta" }]`;

  const fallback = [{ front: "Erro na IA", back: "Tente gerar novamente." }];

  return callAI(
    ai.models.generateContent({ 
      model: 'gemini-2.5-flash', 
      contents: prompt, 
      config: { responseMimeType: 'application/json' } 
    }),
    fallback
  );
};

export const generateEnglishLesson = async (level: string): Promise<any> => {
  const prompt = `
    Crie uma mini-aula de Inglês nível ${level}.
    RETORNE APENAS JSON.
    {
      "title": "Título em Inglês",
      "vocabulary": [{ "word": "Word", "translation": "Tradução", "example": "Sentence" }] (5 itens),
      "dialogue": [{ "speaker": "A", "text": "English phrase", "translation": "Frase em PT" }] (4 linhas),
      "grammarTip": "Dica gramatical em Português"
    }
  `;

  const fallback = {
    title: "Lesson Recovery",
    vocabulary: [{word: "Error", translation: "Erro", example: "Try again"}],
    dialogue: [{speaker: "System", text: "Connection failed", translation: "Falha na conexão"}],
    grammarTip: "Verifique sua conexão."
  };

  return callAI(
    ai.models.generateContent({ 
      model: 'gemini-2.5-flash', 
      contents: prompt, 
      config: { responseMimeType: 'application/json' } 
    }),
    fallback
  );
};

export const getEnglishChatResponse = async (history: { role: string, content: string }[], message: string, level: string) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `You are a friendly English Tutor for level ${level}. Correct mistakes politely. Keep it brief. Speak English 90% of the time.`,
      },
      history: history.slice(-6).map(h => ({ role: h.role as 'user' | 'model', parts: [{ text: h.content }] }))
    });

    const result = await Promise.race([
      chat.sendMessage({ message }),
      new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), AI_TIMEOUT_MS))
    ]) as any;

    return result.text;
  } catch (error) {
    return "I'm having trouble connecting. Can you repeat that?";
  }
};

export const generatePredictiveAnalysis = async (userXP: number, streak: number): Promise<any> => {
  const prompt = `
    Analyze stats: ${userXP} XP, ${streak} day streak.
    Return JSON ONLY:
    {
      "approvalProbability": 72,
      "projectedScore": 75,
      "weakestSubject": "Raciocínio Lógico",
      "strongestSubject": "Português",
      "insights": ["Insight 1", "Insight 2"]
    }
  `;

  const fallback = { approvalProbability: 50, projectedScore: 50, weakestSubject: "Analisando...", strongestSubject: "Analisando...", insights: ["Continue estudando."] };

  return callAI(
    ai.models.generateContent({ 
      model: 'gemini-2.5-flash', 
      contents: prompt, 
      config: { responseMimeType: 'application/json' } 
    }),
    fallback
  );
};

export const generateLabQuestions = async (subject: string, difficulty: string): Promise<any> => {
  const prompt = `
    Gere 5 questões de múltipla escolha sobre "${subject}" (Nível: ${difficulty}).
    IDIOMA OBRIGATÓRIO: PORTUGUÊS BRASIL.
    RETORNE APENAS JSON.
    {
      "questions": [
        {
          "text": "Enunciado da questão",
          "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
          "correctIndex": 0,
          "explanation": "Explicação breve"
        }
      ]
    }
  `;

  const fallback = { questions: [] };
  return callAI(
    ai.models.generateContent({ 
      model: 'gemini-2.5-flash', 
      contents: prompt, 
      config: { responseMimeType: 'application/json' } 
    }),
    fallback
  );
};

export const generateSimulado = async (subjects: string[]): Promise<any> => {
  const subjectList = subjects.length ? subjects.join(', ') : "Português, Direito Constitucional, Informática, RLM";
  
  const prompt = `
    Crie um SIMULADO DE CONCURSO com 10 questões variadas.
    Matérias: ${subjectList}.
    IDIOMA: PORTUGUÊS BRASIL.
    RETORNE APENAS JSON:
    {
      "questions": [
        {
          "text": "Enunciado",
          "options": ["A", "B", "C", "D"],
          "correctIndex": 0,
          "explanation": "Comentário"
        }
      ]
    }
  `;

  const fallback = {
    questions: [
      {
        text: "Erro na geração do simulado. Tente novamente.",
        options: ["Erro", "Erro", "Erro", "Erro"],
        correctIndex: 0,
        explanation: "Falha de conexão."
      }
    ]
  };

  return callAI(
    ai.models.generateContent({ 
      model: 'gemini-2.5-flash', 
      contents: prompt, 
      config: { responseMimeType: 'application/json' } 
    }),
    fallback
  );
};

export const generateCareerGuide = async (position: string): Promise<any> => {
  const prompt = `Guide for "${position}" in Brazil. JSON ONLY: { "salaryRange": "R$ X - Y", "stepsToPosse": ["Step 1", "Step 2"], "tafTips": "Tips", "documentation": ["Doc 1", "Doc 2"] }`;
  return callAI(
    ai.models.generateContent({ 
      model: 'gemini-2.5-flash', 
      contents: prompt, 
      config: { responseMimeType: 'application/json' } 
    }),
    { salaryRange: "R$ -", stepsToPosse: [], tafTips: "Sem dados.", documentation: [] }
  );
};

export const generateTopicExplanation = async (topic: string, subject: string): Promise<string> => {
  const prompt = `Explique "${topic}" da matéria "${subject}" para concurso. Seja breve, didático e use markdown.`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text || "Erro ao gerar explicação.";
  } catch (e) {
    return "Serviço indisponível no momento.";
  }
};

export const generateMarketingContent = async (topic: string, type: string): Promise<string> => {
  const prompt = `Crie conteúdo (${type}) sobre "${topic}".`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text || "Erro.";
  } catch (e) {
    return "Erro.";
  }
};
