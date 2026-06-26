/**
 * @file CursoCard.tsx
 * @description Componente apresentacional para exibição dos dados resumidos de um Curso em formato card.
 */

import React from 'react';
import type { Curso, StatusFuncionamento } from '../../services/types';

export interface CursoCardProps {
  curso: Curso;
  onViewEmentasClick?: (cursoId: string) => void;
}

const getFunctioningBadgeStyle = (status: StatusFuncionamento): string => {
  switch (status) {
    case 'Em atividade':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Inativo':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'Suspenso':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    default:
      return 'bg-slate-800 text-slate-400 border-slate-700';
  }
};

export const CursoCard: React.FC<CursoCardProps> = ({ curso, onViewEmentasClick }) => {
  return (
    <article className="group relative p-6 rounded-2xl bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800 hover:border-purple-500/40 shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/50">
              {curso.codigo}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
              {curso.nivel}
            </span>
            {curso.turno && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60">
                {curso.turno}
              </span>
            )}
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium border whitespace-nowrap ${getFunctioningBadgeStyle(
              curso.funcionamento
            )}`}
          >
            {curso.funcionamento}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors pt-3">
          {curso.nome}
        </h3>
        {curso.descricao && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{curso.descricao}</p>}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            Carga: <strong className="text-slate-200 font-mono">{curso.cargaHoraria}h</strong>
          </span>
          {curso.periodos && (
            <span className="border-l border-slate-800 pl-3">
              Períodos: <strong className="text-slate-200 font-mono">{curso.periodos}</strong>
            </span>
          )}
          {curso.modalidade && (
            <span className="text-slate-500 border-l border-slate-800 pl-3">
              {curso.modalidade}
            </span>
          )}
        </div>
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
