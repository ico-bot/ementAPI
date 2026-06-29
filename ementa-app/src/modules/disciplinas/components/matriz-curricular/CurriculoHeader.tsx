/**
 * @file CurriculoHeader.tsx
 * @description Cabeçalho contendo informações resumidas e estatísticas da Matriz Curricular ativa de um Curso.
 */

import React from 'react';
import type { Curriculo } from '../../services/types';

export interface CurriculoHeaderProps {
  curriculo: Curriculo;
  totalDisciplinas: number;
  onBackClick: () => void;
  onNewDisciplinaClick?: () => void;
}

export const CurriculoHeader: React.FC<CurriculoHeaderProps> = ({
  curriculo,
  totalDisciplinas,
  onBackClick,
  onNewDisciplinaClick,
}) => {
  return (
    <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-purple-950/30 to-slate-900/90 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden space-y-6">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
        <div>
          <button
            type="button"
            onClick={onBackClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-all cursor-pointer mb-4"
          >
            ← Voltar para Lista de Cursos
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-semibold tracking-wide">
              {curriculo.versao}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
              Regime {curriculo.regimeLetivo}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Matriz Curricular: {curriculo.cursoNome}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Vigência a partir de {curriculo.anoInicio}/{curriculo.semestreInicio} • Período ideal planejado de {curriculo.numPeriodosIdeal} semestres.
          </p>
        </div>

        {onNewDisciplinaClick && (
          <button
            type="button"
            onClick={onNewDisciplinaClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-purple-900/30 transition-all active:scale-95 cursor-pointer shrink-0 mt-2 md:mt-0"
          >
            + Nova Disciplina
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 relative z-10">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-xs text-slate-400 font-medium">Total de Matérias</p>
          <p className="text-2xl font-bold text-white font-mono mt-0.5">{totalDisciplinas}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-xs text-slate-400 font-medium">Total de Créditos</p>
          <p className="text-2xl font-bold text-purple-300 font-mono mt-0.5">{curriculo.totalCreditos}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-xs text-slate-400 font-medium">Carga Horária Total</p>
          <p className="text-2xl font-bold text-indigo-300 font-mono mt-0.5">{curriculo.cargaHorariaTotal}h</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-xs text-slate-400 font-medium">Status do Currículo</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-base font-bold text-emerald-300">{curriculo.status}</span>
          </div>
        </div>
      </div>

      {/* Professores Vinculados à Matriz Curricular */}
      {curriculo.corpoDocente && curriculo.corpoDocente.length > 0 && (
        <div className="pt-5 border-t border-white/10 relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Professores Vinculados ao Curso ({curriculo.corpoDocente.length})
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
            {curriculo.corpoDocente.map((docente) => (
              <span
                key={docente.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 text-xs font-medium transition-all shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                <span className="font-semibold">{docente.nome}</span>
                {docente.titulacao && (
                  <span className="text-[10px] text-purple-200 bg-purple-500/20 px-1.5 py-0.5 rounded-md font-mono">
                    {docente.titulacao}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
