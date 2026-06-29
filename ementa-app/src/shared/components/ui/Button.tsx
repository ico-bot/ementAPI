/**
 * @file Button.tsx
 * @description Componente de botão reutilizável com variações visuais estilizadas via Tailwind CSS.
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/25',
    secondary: 'bg-white/10 hover:bg-white/15 text-slate-100 border border-white/10 backdrop-blur-md',
    outline: 'bg-transparent hover:bg-white/5 text-purple-300 border border-purple-500/30',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/25',
  };

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
