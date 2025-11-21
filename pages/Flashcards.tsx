
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { Zap, RefreshCw, RotateCcw } from 'lucide-react';
import { generateFlashcards } from '../services/geminiService';

export const FlashcardsPage: React.FC = () => {
  const [cards, setCards] = useState<Array<{front: string, back: string}>>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setCards([]); // Clear previous
    setCurrentCard(0);
    
    try {
      const newCards = await generateFlashcards(topic);
      if (newCards && newCards.length > 0) {
        setCards(newCards);
        setCurrentCard(0);
        setIsFlipped(false);
      } else {
        alert("IA não gerou cards. Tente outro tópico.");
      }
    } catch (e) {
      alert("Erro de conexão.");
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(curr => curr + 1);
      setIsFlipped(false);
    }
  };
  
  const handlePrev = () => {
    if (currentCard > 0) {
      setCurrentCard(curr => curr - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton className="mb-4" />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Zap className="text-[#00A86B]" fill="currentColor" /> Flashcards IA
        </h1>
        <p className="text-gray-400">Gere cartões de revisão instantâneos sobre qualquer tópico.</p>
      </div>

      {/* Generator Input */}
      <div className="flex gap-2 max-w-xl mx-auto">
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ex: Atos Administrativos, Crase, Regra de Três..." 
          className="flex-1 bg-[#18181B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00A86B] focus:outline-none"
        />
        <Button onClick={handleGenerate} isLoading={loading} disabled={!topic}>
          Gerar
        </Button>
      </div>

      {/* Card Display */}
      {cards.length > 0 && cards[currentCard] ? (
        <div className="relative h-80 w-full perspective-1000">
          <div 
            className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center p-8 border-[#00A86B]/20 bg-gradient-to-br from-[#18181B] to-[#111217]">
               <span className="text-xs text-[#00A86B] uppercase tracking-widest font-bold mb-4">Frente</span>
               <h3 className="text-2xl font-medium text-white">{cards[currentCard].front}</h3>
               <p className="text-gray-500 text-sm mt-8 absolute bottom-6">Clique para virar</p>
            </Card>

            {/* Back */}
            <Card className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center p-8 border-[#00A86B] bg-[#00A86B]/10">
               <span className="text-xs text-[#00A86B] uppercase tracking-widest font-bold mb-4">Verso</span>
               <h3 className="text-xl font-medium text-white">{cards[currentCard].back}</h3>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl bg-white/5">
           <p className="text-gray-500">{loading ? 'Gerando conteúdo inteligente...' : 'Nenhum flashcard ativo. Digite um tema acima.'}</p>
        </div>
      )}

      {/* Controls */}
      {cards.length > 0 && (
        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={handlePrev} disabled={currentCard === 0}>Anterior</Button>
          <span className="text-gray-500 text-sm">Card {currentCard + 1} de {cards.length}</span>
          <Button onClick={handleNext} disabled={currentCard >= cards.length - 1}>
            Próximo <RefreshCw size={18} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};
