/**
 * @file Header.tsx
 * @description Cabeçalho principal da aplicação contendo título do ambiente acadêmico.
 */

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2x1">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Ambiente Acadêmico
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
          Gestão de Ementários e Cursos
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Plataforma centralizada para administração de matrizes curriculares e disciplinas.
        </p>
      </div>
    </header>
  );
};
