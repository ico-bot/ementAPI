/**
 * @file CursosFilterBar.tsx
 * @description Componente apresentacional contendo input de busca e seletores combinados de filtros de catálogo.
 */

import React from 'react';
import type { NivelCurso, StatusFuncionamento, TurnoCurso } from '../../services/types';

export interface CursosFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFunctioning: StatusFuncionamento | 'Todos';
  onFunctioningChange: (value: StatusFuncionamento | 'Todos') => void;
  selectedLevel: NivelCurso | 'Todos';
  onLevelChange: (value: NivelCurso | 'Todos') => void;
  selectedShift: TurnoCurso | 'Todos';
  onShiftChange: (value: TurnoCurso | 'Todos') => void;
  onResetFilters: () => void;
}

const functioningOptions: Array<StatusFuncionamento | 'Todos'> = [
  'Todos',
  'Em atividade',
  'Inativo',
  'Suspenso',
];

const levelOptions: Array<NivelCurso | 'Todos'> = [
  'Todos',
  'Graduação',
  'Pós-Graduação',
];

const shiftOptions: Array<TurnoCurso | 'Todos'> = [
  'Todos',
  'Integral',
  'Matutino',
  'Vespertino',
  'Noturno',
  'Diurno',
];

export const CursosFilterBar: React.FC<CursosFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedFunctioning,
  onFunctioningChange,
  selectedLevel,
  onLevelChange,
  selectedShift,
  onShiftChange,
  onResetFilters,
}) => {
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedFunctioning !== 'Todos' ||
    selectedLevel !== 'Todos' ||
    selectedShift !== 'Todos';

  return (
    <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-lg space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome do curso ou código..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/80 transition-all"
          />
        </div>

        
        {/* Filter selects group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Funcionamento Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-1.5">
            <span className="text-xs font-medium text-slate-400">Status:</span>
            <select
              value={selectedFunctioning}
              onChange={(e) => onFunctioningChange(e.target.value as StatusFuncionamento | 'Todos')}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer pr-2"
            >
              {functioningOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Nível Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-1.5">
            <span className="text-xs font-medium text-slate-400">Nível:</span>
            <select
              value={selectedLevel}
              onChange={(e) => onLevelChange(e.target.value as NivelCurso | 'Todos')}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer pr-2"
            >
              {levelOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Turno Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-1.5">
            <span className="text-xs font-medium text-slate-400">Turno:</span>
            <select
              value={selectedShift}
              onChange={(e) => onShiftChange(e.target.value as TurnoCurso | 'Todos')}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer pr-2"
            >
              {shiftOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all font-medium cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
