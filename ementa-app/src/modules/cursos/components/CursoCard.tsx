/**
 * @file CursoCard.tsx
 * @description Componente apresentacional para exibição dos dados resumidos de um Curso em formato card.
 */

import React from 'react';
import type { Curso } from '../services/types';

export interface CursoCardProps {
  curso: Curso;
  onViewEmentasClick?: (cursoId: string) => void;
}

export const CursoCard: React.FC<CursoCardProps> = ({ curso, onViewEmentasClick }) => {
  return (
    <article className="group relative p-6 rounded-2xl bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800 hover:border-purple-500/40 shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/50">
            {curso.codigo}
          </span>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors pt-2">
            {curso.nome}
          </h3>
          {curso.descricao && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{curso.descricao}</p>}
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            curso.ativo
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {curso.ativo ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>
          Carga Horária: <strong className="text-slate-200 font-mono">{curso.cargaHoraria}h</strong>
        </span>
        {onViewEmentasClick && (
          <button
            type="button"
            onClick={() => onViewEmentasClick(curso.id)}
            className="text-purple-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-medium cursor-pointer"
          >
            Ver ementas &rarr;
          </button>
        )}
      </div>
    </article>
  );
};
