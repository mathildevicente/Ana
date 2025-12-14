import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass-pill';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'glass-pill', 
  isLoading = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center font-display font-bold tracking-wide";
  
  const variants = {
    // Style "Glass Morphism" Pill button from reference
    'glass-pill': `
      rounded-xl
      bg-white/20
      hover:bg-white/30
      backdrop-blur-md
      border border-white/40
      text-white
      uppercase
      shadow-lg shadow-black/5
    `,
    primary: "bg-white text-black hover:bg-gray-100 rounded-xl uppercase",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      ) : (
        children
      )}
    </button>
  );
};