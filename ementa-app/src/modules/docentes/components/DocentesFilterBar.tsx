/**
 * @file DocentesFilterBar.tsx
 * @description Barra de filtros e busca em tempo real para o catálogo de professores.
 */

import React from 'react';
import type { CargoDocente, TitulacaoDocente } from '../services/types';

export interface DocentesFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTitulacao: TitulacaoDocente | 'Todos';
  onTitulacaoChange: (value: TitulacaoDocente | 'Todos') => void;
  selectedCargo: CargoDocente | 'Todos';
  onCargoChange: (value: CargoDocente | 'Todos') => void;
  onResetFilters: () => void;
}

const TITULACOES_OPCOES: Array<TitulacaoDocente | 'Todos'> = [
  'Todos',
  'Pós-Doutorado',
  'Doutorado',
  'Mestrado',
  'Especialização',
  'Graduação',
];

const CARGOS_OPCOES: Array<CargoDocente | 'Todos'> = [
  'Todos',
  'Professor Titular',
  'Professor Adjunto',
  'Professor Assistente',
  'Professor Substituto',
  'Professor do Magistério Superior',
];

export const DocentesFilterBar: React.FC<DocentesFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedTitulacao,
  onTitulacaoChange,
  selectedCargo,
  onCargoChange,
  onResetFilters,
}) => {
  const hasActiveFilters =
    searchTerm !== '' || selectedTitulacao !== 'Todos' || selectedCargo !== 'Todos';

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-purple-500/20 backdrop-blur-xl shadow-xl space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Campo de Busca por Nome */}
        <div className="md:col-span-6 relative">
          <label htmlFor="docenteSearch" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Buscar Professor ou Centro
          </label>
          <div className="relative">
            <input
              id="docenteSearch"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Ex: Alan Turing, CCEN..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-purple-500 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            <span className="absolute left-3.5 top-3 text-slate-500">🔍</span>
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filtro de Titulação */}
        <div className="md:col-span-3">
          <label htmlFor="filtroTitulacao" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Titulação Acadêmica
          </label>
          <select
            id="filtroTitulacao"
            value={selectedTitulacao}
            onChange={(e) => onTitulacaoChange(e.target.value as TitulacaoDocente | 'Todos')}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-purple-500 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
          >
            {TITULACOES_OPCOES.map((t) => (
              <option key={t} value={t} className="bg-slate-900 text-slate-200">
                {t === 'Todos' ? 'Todas as Titulações' : t}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Cargo */}
        <div className="md:col-span-3">
          <label htmlFor="filtroCargo" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Cargo Docente
          </label>
          <select
            id="filtroCargo"
            value={selectedCargo}
            onChange={(e) => onCargoChange(e.target.value as CargoDocente | 'Todos')}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-purple-500 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
          >
            {CARGOS_OPCOES.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-slate-200">
                {c === 'Todos' ? 'Todos os Cargos' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
          <span className="text-purple-300 font-medium">✨ Filtros ativos aplicados ao catálogo</span>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-slate-400 hover:text-rose-400 font-semibold underline underline-offset-4 transition-colors cursor-pointer"
          >
            Limpar Todos os Filtros
          </button>
        </div>
      )}
    </div>
  );
};
