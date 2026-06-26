/**
 * @file DisciplinasTable.tsx
 * @description Tabela de exibição global das disciplinas com paginação interativa e botões de ação rápidos.
 */

import React from 'react';
import type { DisciplinaGlobalItem, NivelDisciplina, StatusDisciplina, TurnoDisciplina } from '../../services/types';

export interface DisciplinasTableProps {
  disciplinas: DisciplinaGlobalItem[];
  isLoading: boolean;
  onViewDetailsClick: (disciplina: DisciplinaGlobalItem) => void;
  onEditClick: (disciplina: DisciplinaGlobalItem) => void;
  onDeleteClick: (disciplina: DisciplinaGlobalItem) => void;
}

const getStatusBadgeStyle = (status: StatusDisciplina): string => {
  switch (status) {
    case 'Em atividade':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-950/40';
    case 'Inativo':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-950/40';
    case 'Suspenso':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-950/40';
    default:
      return 'bg-slate-800 text-slate-400 border-slate-700';
  }
};

const getLevelBadgeStyle = (nivel: NivelDisciplina): string => {
  return nivel === 'Pós-Graduação'
    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
    : 'bg-purple-500/10 text-purple-300 border-purple-500/20';
};

const getShiftBadgeStyle = (turno: TurnoDisciplina): string => {
  switch (turno) {
    case 'Noturno':
      return 'text-sky-300 bg-sky-950/50 border-sky-800/40';
    case 'Integral':
      return 'text-violet-300 bg-violet-950/50 border-violet-800/40';
    case 'Matutino':
      return 'text-amber-300 bg-amber-950/50 border-amber-800/40';
    default:
      return 'text-slate-300 bg-slate-800/60 border-slate-700/60';
  }
};

export const DisciplinasTable: React.FC<DisciplinasTableProps> = ({
  disciplinas,
  isLoading,
  onViewDetailsClick,
  onEditClick,
  onDeleteClick,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden shadow-2xl animate-pulse">
        <div className="h-12 bg-slate-800/60 border-b border-slate-800" />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((rowId) => (
          <div key={rowId} className="h-16 border-b border-slate-800/50 bg-slate-900/30 px-6 flex items-center gap-4">
            <div className="w-16 h-6 rounded bg-slate-800" />
            <div className="flex-1 h-6 rounded bg-slate-800/80" />
            <div className="w-32 h-6 rounded bg-slate-800/60" />
            <div className="w-24 h-6 rounded bg-slate-800/60" />
          </div>
        ))}
      </div>
    );
  }

  if (disciplinas.length === 0) {
    return (
      <div className="p-16 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-4">
        <div className="w-14 h-14 rounded-full bg-slate-800/80 text-purple-400 flex items-center justify-center mx-auto text-2xl font-mono shadow-inner">
          ?
        </div>
        <h3 className="text-lg font-bold text-slate-200">Nenhuma disciplina cadastrada ou encontrada</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Tente ajustar os termos da barra de pesquisa ou redefinir os filtros selecionados para visualizar os itens do ementário.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl overflow-x-auto shadow-2xl transition-all">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-gradient-to-r from-purple-950/30 via-slate-900/80 to-indigo-950/30 text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <th className="py-4 px-6 w-28">Código</th>
            <th className="py-4 px-6 min-w-[240px]">Disciplina</th>
            <th className="py-4 px-6 hidden lg:table-cell">Área</th>
            <th className="py-4 px-4 text-center">Nível</th>
            <th className="py-4 px-4 text-center hidden md:table-cell">Turno</th>
            <th className="py-4 px-4 text-center">Status</th>
            <th className="py-4 px-6 text-right w-44">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-sm">
          {disciplinas.map((disc) => (
            <tr
              key={disc.id}
              onClick={() => onViewDetailsClick(disc)}
              className="group hover:bg-slate-800/50 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <td className="py-4 px-6">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-purple-950/90 text-purple-300 border border-purple-800/60 shadow-sm group-hover:border-purple-500/50 transition-colors">
                  {disc.codigo}
                </span>
              </td>

              <td className="py-4 px-6">
                <div className="font-bold text-white group-hover:text-purple-300 transition-colors">
                  {disc.nome}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
                  <span>{disc.cargaHoraria}h</span>
                  {disc.unidade && (
                    <>
                      <span className="text-slate-500 truncate max-w-[200px] hidden sm:inline" title={disc.unidade}>
                        {disc.unidade}
                      </span>
                    </>
                  )}
                </div>
              </td>

              <td className="py-4 px-6 text-xs text-slate-300 hidden lg:table-cell">
                <span className="line-clamp-1" title={disc.area}>
                  {disc.area}
                </span>
              </td>

              <td className="py-4 px-4 text-center">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-md font-medium border ${getLevelBadgeStyle(
                    disc.nivel
                  )}`}
                >
                  {disc.nivel}
                </span>
              </td>

              <td className="py-4 px-4 text-center hidden md:table-cell">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-md font-mono font-medium border ${getShiftBadgeStyle(
                    disc.turno
                  )}`}
                >
                  {disc.turno}
                </span>
              </td>

              <td className="py-4 px-4 text-center">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium border shadow-sm ${getStatusBadgeStyle(
                    disc.status
                  )}`}
                >
                  {disc.status === 'Em atividade' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  {disc.status}
                </span>
              </td>

              <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onViewDetailsClick(disc)}
                    title="Ver detalhes e ementa"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 border border-slate-700/80 hover:border-purple-500/40 transition-all cursor-pointer active:scale-95 text-xs font-medium"
                  >
                    Detalhes
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditClick(disc)}
                    title="Editar disciplina"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-700/80 hover:border-indigo-500/40 transition-all cursor-pointer active:scale-95 text-xs font-medium"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteClick(disc)}
                    title="Excluir disciplina"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 border border-slate-700/80 hover:border-rose-500/40 transition-all cursor-pointer active:scale-95 text-xs font-medium"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
