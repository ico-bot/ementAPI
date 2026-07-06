/**
 * @file Header.tsx
 * @description Cabeçalho principal da aplicação estilizado com Glassmorphism avançado, indicadores de período e status em tempo real.
 */

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-purple-950/40 to-slate-900/90 border border-purple-500/20 backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(168,85,247,0.25)] group transition-all duration-500">
      {/* Elementos Decorativos de Brilho de Fundo (Glow Blobs) */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/20 transition-all duration-700" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-700" />

      {/* Seção Esquerda: Emblema, Título e Descrição */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-500/30 shadow-inner group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 shrink-0">
          <div className="absolute inset-0 rounded-2xl bg-purple-400/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Ícone de Capelo / Livro Acadêmico */}
          <svg
            className="w-8 h-8 text-purple-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.5)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
        </div>q
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-indigo-300 bg-clip-text text-transparent">
            Gestão de Ementários e Cursos
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
            Plataforma centralizada para administração inteligente de matrizes curriculares, componentes de ensino e corpo docente.
          </p>
        </div>
      </div>

      {/* Seção Direita: Cards de Status e Métricas Rápidas */}
      <div className="relative z-10 flex flex-wrap sm:flex-nowrap lg:flex-col justify-start lg:items-end gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
        {/* Card Período Vigente */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 shadow-sm hover:border-purple-500/40 transition-colors cursor-default w-full sm:w-auto">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Período Vigente</div>
            <div className="text-xs font-bold text-slate-200 font-mono">2026.1 • CICLO ATIVO</div>
          </div>
        </div>

        {/* Card Status do Sistema */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 shadow-sm hover:border-emerald-500/40 transition-colors cursor-default w-full sm:w-auto">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Serviços do Sistema</div>
            <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sincronizado
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
