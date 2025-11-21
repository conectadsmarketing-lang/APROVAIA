
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  className?: string;
  fallbackPath?: string;
  absolute?: boolean;
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  label = "Voltar", 
  className = "", 
  fallbackPath = "/",
  absolute = false,
  onClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (onClick) {
      onClick();
      return;
    }

    // Check if there is a history state to go back to
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  const baseClass = "flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm py-2 px-4 rounded-lg hover:bg-white/5 w-fit";
  const absoluteClass = absolute ? "absolute top-4 left-4 z-40" : "";

  return (
    <button 
      onClick={handleBack} 
      className={`${baseClass} ${absoluteClass} ${className}`}
    >
      <ArrowLeft size={18} />
      <span>{label}</span>
    </button>
  );
};
