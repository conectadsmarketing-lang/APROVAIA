
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.95] relative overflow-hidden";
  
  const variants = {
    primary: "bg-[#00FF88] hover:bg-[#00D170] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_35px_rgba(0,255,136,0.6)] border border-transparent hover:-translate-y-0.5",
    secondary: "bg-[#27272a] hover:bg-[#3f3f46] text-white border border-white/10 hover:border-white/20 hover:shadow-lg",
    outline: "border-2 border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/10 shadow-[0_0_10px_rgba(0,255,136,0.1)]",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5",
    glass: "backdrop-blur-md bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};
