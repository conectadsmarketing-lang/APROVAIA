
import React from 'react';

interface MarkdownProps {
  content: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Sanitize: Ensure double asterisks for bold if user provides single ones erroneously in some contexts,
  // or handle standard markdown correctly.
  // The requirement says "Converta *texto* automaticamente em <b>texto</b>".
  
  // We will process line by line
  const lines = content.split('\n');

  return (
    <div className={`space-y-3 ${className}`}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        
        // Handle Headers (Basic implementation)
        if (trimmed.startsWith('### ')) {
           return <h3 key={index} className="text-lg font-bold text-[#00FF88] mt-4 mb-2">{trimmed.substring(4)}</h3>;
        }
        if (trimmed.startsWith('## ')) {
           return <h2 key={index} className="text-xl font-bold text-white mt-6 mb-3 border-b border-white/10 pb-2">{trimmed.substring(3)}</h2>;
        }

        // Handle Bullet Points
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const text = trimmed.substring(2);
          return (
            <div key={index} className="flex gap-3 ml-2 items-start">
              <span className="text-[#00FF88] font-bold mt-1.5">•</span>
              <div className="text-gray-300 leading-relaxed">
                <FormattedText text={text} />
              </div>
            </div>
          );
        }
        
        // Handle Empty Lines
        if (!trimmed) {
          return <div key={index} className="h-2"></div>;
        }

        // Standard Paragraph
        return (
          <p key={index} className="text-gray-200 leading-relaxed">
            <FormattedText text={line} />
          </p>
        );
      })}
    </div>
  );
};

// Helper to parse bold and italic
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // We need to handle **bold** and *bold* as requested (treating single asterisk as bold too if that's the preference, or strict markdown).
  // The user said: "Converta *texto* ... em <b>texto</b>". This implies single asterisk should be bold.
  // Standard markdown: **bold**, *italic*.
  // We will support both as Bold for this specific "Professor IA" requirement to avoid "asteriscos crus".

  // Regex strategy: 
  // 1. Match **text**
  // 2. Match *text*
  // Replace matches with bold elements.

  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
           // Per request: Treat single asterisk as bold to avoid raw display
           return <strong key={i} className="text-white font-bold">{part.slice(1, -1)}</strong>;
        }
        return part;
      })}
    </>
  );
};