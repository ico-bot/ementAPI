/**
 * @file DisciplinasPage.tsx
 * @description Tela contêiner principal do Módulo de Disciplinas, exibindo cabeçalho da matriz, filtros e grade de matérias.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CurriculoHeader } from '../components/matriz-curricular/CurriculoHeader';
import { DisciplinaDetailModal } from '../components/modals/DisciplinaDetailModal';
import { MatrizCurricularGrid } from '../components/matriz-curricular/MatrizCurricularGrid';
import {
  fetchCurriculoByCursoId,
  fetchDisciplinasByCursoId,
} from '../services/disciplinasService';
import type { Curriculo, Disciplina, TipoDisciplina } from '../services/types';

export interface DisciplinasPageProps {
  cursoId?: string;
  onBackClick?: () => void;
}

export const DisciplinasPage: React.FC<DisciplinasPageProps> = ({
  cursoId: propCursoId,
  onBackClick: propOnBackClick,
}) => {
  const params = useParams<{ cursoId: string }>();
  const navigate = useNavigate();

  const cursoId = propCursoId || params.cursoId || '1';
  const handleBackClick = () => {
    if (propOnBackClick) {
      propOnBackClick();
    } else {
      navigate('/cursos');
    }
  };

  const [curriculo, setCurriculo] = useState<Curriculo | null>(null);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal detail state
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Filter state variables (English names as per Rule 3)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<number | 'Todos'>('Todos');
  const [selectedType, setSelectedType] = useState<TipoDisciplina | 'Todos'>('Todos');

  const loadData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [currData, discData] = await Promise.all([
        fetchCurriculoByCursoId(cursoId),
        fetchDisciplinasByCursoId(cursoId, {
          termo: searchTerm,
          periodo: selectedPeriod,
          tipo: selectedType,
        }),
      ]);
      setCurriculo(currData);
      setDisciplinas(discData);
    } catch (error) {
      console.error('Erro ao carregar dados do ementário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(timer);
  }, [cursoId, searchTerm, selectedPeriod, selectedType]);

  const handleOpenDetail = (disciplina: Disciplina) => {
    setSelectedDisciplina(disciplina);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedPeriod('Todos');
    setSelectedType('Todos');
  };

  return (
    <section className="space-y-8 animate-fade-in">
      {isLoading && !curriculo ? (
        <div className="h-64 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
      ) : curriculo ? (
        <CurriculoHeader
          curriculo={curriculo}
          totalDisciplinas={disciplinas.length}
          onBackClick={handleBackClick}
          onNewDisciplinaClick={() => alert('A funcionalidade de cadastro de nova disciplina será implementada em breve!')}
        />
      ) : (
        <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Matriz Curricular não encontrada</h3>
            <p className="text-sm opacity-80 mt-1">
              Não encontramos um PPC vigente cadastrado para o curso selecionado.
            </p>
          </div>
          <button
            type="button"
            onClick={handleBackClick}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-all"
          >
            ← Voltar
          </button>
        </div>
      )}

      {/* Barra de Filtros */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Pesquisa por Termo */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por nome da matéria, código ou trecho da ementa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>

        {/* Filtros Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Período */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value === 'Todos' ? 'Todos' : Number(e.target.value))}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 text-xs font-medium focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="Todos">Todos os Períodos</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
              <option key={p} value={p}>
                {p}º Período Ideal
              </option>
            ))}
            <option value={0}>Sem Período Fixo (Optativas)</option>
          </select>

          {/* Tipo de Disciplina */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as TipoDisciplina | 'Todos')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 text-xs font-medium focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="Todos">Todos os Tipos</option>
            <option value="Obrigatória">Obrigatória</option>
            <option value="Optativa">Optativa</option>
            <option value="Eletiva">Eletiva</option>
          </select>

          {(searchTerm !== '' || selectedPeriod !== 'Todos' || selectedType !== 'Todos') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-medium transition-all cursor-pointer border border-purple-500/20"
            >
              ✕ Limpar Filtros
            </button>
          )}

        </div>

      </div>

      {/* Grid de Disciplinas */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((sk) => (
            <div key={sk} className="h-44 rounded-2xl bg-slate-900/50 border border-slate-800" />
          ))}
        </div>
      ) : (
        <MatrizCurricularGrid
          disciplinas={disciplinas}
          onSelectDisciplina={handleOpenDetail}
        />
      )}

      {/* Modal Detalhado */}
      <DisciplinaDetailModal
        disciplina={selectedDisciplina}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
