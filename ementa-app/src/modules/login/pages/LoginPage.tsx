/**
 * @file LoginPage.tsx
 * @description Tela de Login da aplicação
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center p-4 overflow-hidden">
      {/* Glow Blobs / Background Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-purple-500/20 backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(168,85,247,0.25)] transition-all duration-300">
        
        {/* Header decoration - Capelo Icon */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-500/30 shadow-inner shrink-0 inline-block">
            <svg
              className="w-10 h-10 text-purple-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.5)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-indigo-300 bg-clip-text text-transparent">
              EmentAPI • Admin
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Acesso restrito ao administrador para gerenciar ementários e sincronização.
            </p>
          </div>
        </div>

        {/* Componente de Formulário Integrado */}
        <LoginForm onLoginSuccess={() => navigate('/admin')} />
      </div>
    </div>
  );
};
