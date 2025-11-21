import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = '#00FF88', 
  height = 'md',
  showLabel = false 
}) => {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-bold text-gray-400 uppercase tracking-wider">Progresso</span>
          <span className="font-bold text-white">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-800 rounded-full overflow-hidden ${heights[height]}`}>
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${Math.max(5, Math.min(100, progress))}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}40` }}
        >
          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] skew-x-12 transform -translate-x-full"></div>
        </div>
      </div>
    </div>
  );
};