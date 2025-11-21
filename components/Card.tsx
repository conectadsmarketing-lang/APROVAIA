
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  noPadding?: boolean;
  onClick?: () => void;
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glass = false, noPadding = false, onClick, border = true }) => {
  // New Aesthetic: Matte Black (#121214) with subtle borders and interaction
  const baseClass = "rounded-2xl overflow-hidden transition-all duration-300 ease-in-out";
  const bgClass = glass 
    ? "backdrop-blur-2xl bg-[#121214]/80" 
    : "bg-[#121214]"; 
  const borderClass = border ? "border border-white/5" : "";
  const shadowClass = "shadow-lg shadow-black/50";
  const hoverClass = onClick ? "cursor-pointer hover:border-[#00FF88]/30 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,255,136,0.1)]" : "";

  return (
    <div 
      className={`${baseClass} ${bgClass} ${borderClass} ${shadowClass} ${hoverClass} ${className}`} 
      onClick={onClick}
    >
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};
