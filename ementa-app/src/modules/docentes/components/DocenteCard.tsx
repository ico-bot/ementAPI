/**
 * @file DocenteCard.tsx
 * @description Card interativo visualizando informações resumidas de um Docente, com badging de titulação e cargo.
 */

import React from 'react';
import type { Docente } from '../services/types';

export interface DocenteCardProps {
  docente: Docente;
  totalDisciplinasLecionadas?: number;
  isCoordenador?: boolean;
  cursoCoordenadoNome?: string;
  onClick: (docente: Docente) => void;
}

export const DocenteCard: React.FC<DocenteCardProps> = ({
  docente,
  totalDisciplinasLecionadas = 0,
  isCoordenador = false,
  cursoCoordenadoNome,
  onClick,
}) => {
  const getTitulacaoBadgeStyle = () => {
    switch (docente.titulacao) {
      case 'Doutorado':
      case 'Pós-Doutorado':
        return 'bg-purple-500/20 text-purple-200 border-purple-500/40 shadow-[0_0_12px_-3px_rgba(168,85,247,0.4)]';
      case 'Mestrado':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Especialização':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div
      onClick={() => onClick(docente)}
      className="group relative p-6 rounded-3xl bg-gradient-to-br from-slate-900/80 via-purple-950/20 to-slate-900/80 hover:from-slate-900 hover:via-purple-900/30 hover:to-slate-900 border border-purple-500/10 hover:border-purple-500/40 backdrop-blur-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between gap-5 cursor-pointer overflow-hidden"
    >
      {/* Brilho decorativo ao passar o mouse */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {docente.titulacao && (
              <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${getTitulacaoBadgeStyle()}`}>
                {docente.titulacao}
              </span>
            )}
            {isCoordenador && (
              <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                Coordenador
              </span>
            )}
            {(docente.editadoManualmente || docente.inseridoManualmente) ? (
              <span
                title="Registro editado/inserido manualmente e protegido contra sobrescrita automática"
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1"
              >
                Personalizado
              </span>
            ) : (
              <span
                title="Registro sincronizado diretamente com a API /api/docentes/"
                className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1"
              >
                API
              </span>
            )}
          </div>

          {docente.cargo && (
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 shrink-0">
              {docente.cargo}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
          {docente.nome}
        </h3>

        {docente.centroLotacao && (
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed italic line-clamp-2">
            {docente.centroLotacao}
          </p>
        )}

        {isCoordenador && cursoCoordenadoNome && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-xs text-amber-200/90 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="truncate">Coordena: {cursoCoordenadoNome}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <span className="p-1 rounded-md bg-purple-500/10 text-purple-400"></span>
          <span>
            {totalDisciplinasLecionadas === 0
              ? 'Nenhuma disciplina alocada'
              : `${totalDisciplinasLecionadas} matéria${totalDisciplinasLecionadas > 1 ? 's' : ''} lecionada${totalDisciplinasLecionadas > 1 ? 's' : ''}`}
          </span>
        </div>

        {docente.jornada && (
          <span className="font-mono text-[11px] text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            {docente.jornada}
          </span>
        )}
      </div>
    </div>
  );
};
