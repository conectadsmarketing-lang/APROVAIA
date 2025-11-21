import React from 'react';
import { Brain } from 'lucide-react';

interface LoaderProps {
  text?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ text = "Carregando...", fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative">
        <div className="absolute inset-0 bg-[#00FF88]/20 blur-xl rounded-full animate-pulse"></div>
        <div className="relative z-10 w-16 h-16 bg-[#121214] border border-[#00FF88]/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,255,136,0.2)]">
          <Brain className="text-[#00FF88] animate-pulse" size={32} />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00FF88] rounded-full animate-bounce"></div>
      </div>
      <div className="text-center">
        <h3 className="text-white font-bold text-lg">{text}</h3>
        <div className="flex gap-1 justify-center mt-1">
          <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#09090B]/90 backdrop-blur-md z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};