
import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  variant = 'rect' 
}) => {
  const baseClass = "bg-white/5 animate-pulse";
  const roundedClass = variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'rounded' : 'rounded-xl';
  
  const style: React.CSSProperties = {
    width: width,
    height: height || (variant === 'text' ? '1em' : undefined)
  };

  return (
    <div 
      className={`${baseClass} ${roundedClass} ${className}`} 
      style={style}
    />
  );
};
