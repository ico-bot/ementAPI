/**
 * @file DisciplinaCard.tsx
 * @description Card interativo de resumo de uma Disciplina com badges coloridas e indicação de docentes.
 */

import React from 'react';
import type { Disciplina } from '../../services/types';

export interface DisciplinaCardProps {
  disciplina: Disciplina;
  onClick: (disciplina: Disciplina) => void;
}

export const DisciplinaCard: React.FC<DisciplinaCardProps> = ({ disciplina, onClick }) => {
  const getBadgeColors = () => {
    switch (disciplina.tipo) {
      case 'Obrigatória':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Optativa':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Eletiva':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  const temDocente = disciplina.docentes && disciplina.docentes.length > 0;

  return (
    <div
      onClick={() => onClick(disciplina)}
      className="group relative p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/40 backdrop-blur-xl shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between gap-4 cursor-pointer"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 border border-slate-700/80">
            {disciplina.codigo}
          </span>
          <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full border ${getBadgeColors()}`}>
            {disciplina.tipo}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors line-clamp-2 leading-snug">
          {disciplina.nome}
        </h3>

        {disciplina.unidade && (
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-1 italic">
            • {disciplina.unidade}
          </p>
        )}

        {(disciplina.editadoManualmente || disciplina.inseridoManualmente) && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 w-fit shadow-sm" title="Dado protegido contra sobrescrita pelo crawler automático">
            <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>{disciplina.inseridoManualmente ? 'Inserida manualmente (protegida)' : 'Editada manualmente (protegida)'}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-white/10 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
          <span title="Número de Créditos">{disciplina.creditos} Créditos</span>
          <span title="Carga Horária">{disciplina.cargaHoraria || disciplina.creditos * 15}h</span>
          <span title="Nota Mínima para Aprovação" className="text-amber-400/90 font-semibold">
            Nota {disciplina.notaMinimaAprovacao}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded-xl border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
          <span className="truncate">
            {temDocente
              ? disciplina.docentes!.map((d) => d.nome).join(', ')
              : 'Docente não informado no ementário'}
          </span>
        </div>
      </div>
    </div>
  );
};
