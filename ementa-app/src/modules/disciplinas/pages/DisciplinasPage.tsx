/**
 * @file DisciplinasPage.tsx
 * @description Tela contêiner principal do Módulo de Disciplinas, exibindo cabeçalho da matriz, filtros e grade de matérias.
 */

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CurriculoHeader } from '../components/matriz-curricular/CurriculoHeader';
import { DisciplinaDetailModal } from '../components/modals/DisciplinaDetailModal';
import { NewDisciplinaModal } from '../components/modals/NewDisciplinaModal';
import { MatrizCurricularGrid } from '../components/matriz-curricular/MatrizCurricularGrid';
import { useCurriculoByCursoId, useDisciplinasByCursoId } from '../../../shared/hooks/queries/useDisciplinasQuery';
import { useCreateDisciplinaMutation } from '../../../shared/hooks/queries/useDisciplinasMutations';
import type { Disciplina, TipoDisciplina } from '../services/types';

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

  // Filter state variables (English names as per Rule 3)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<number | 'Todos'>('Todos');
  const [selectedType, setSelectedType] = useState<TipoDisciplina | 'Todos'>('Todos');

  const { data: curriculo, isLoading: isCurriculoLoading, error: curriculoError, refetch: refetchCurriculo } = useCurriculoByCursoId(cursoId);
  const { data: disciplinasData, isLoading: isDisciplinasLoading, error: disciplinasError, refetch: refetchDisciplinas } = useDisciplinasByCursoId(
    cursoId,
    {
      termo: searchTerm,
      periodo: selectedPeriod,
      tipo: selectedType,
    }
  );

  const createDisciplinaMutation = useCreateDisciplinaMutation();

  const disciplinas = disciplinasData || [];
  const isLoading = isCurriculoLoading || isDisciplinasLoading;
  const error = (curriculoError || disciplinasError) ? 'Não foi possível carregar a matriz curricular e as disciplinas. Verifique a conexão com o servidor.' : null;

  // Modal detail state
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Modal de criação
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  const handleOpenDetail = (disciplina: Disciplina) => {
    setSelectedDisciplina(disciplina);
    setIsModalOpen(true);
  };

  const handleSaveNewDisciplina = async (newDisc: Omit<Disciplina, 'id'>, targetCursoId: string): Promise<void> => {
    try {
      await createDisciplinaMutation.mutateAsync({ cursoId: targetCursoId || cursoId, disciplina: newDisc });
    } catch (error) {
      console.error('Erro ao cadastrar nova disciplina:', error);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedPeriod('Todos');
    setSelectedType('Todos');
  };

  return (
    <section className="space-y-8 animate-fade-in">
      {error ? (
        <div className="p-8 md:p-12 text-center rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-4 animate-fade-in shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold border border-rose-500/20 shadow-inner">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-rose-200">Falha ao Carregar Matriz Curricular</h3>
            <p className="text-sm text-rose-300/80 leading-relaxed">
              {error}
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => { refetchCurriculo(); refetchDisciplinas(); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all active:scale-95 shadow-lg shadow-rose-900/30 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tentar Novamente
            </button>
          </div>
        </div>
      ) : isLoading && !curriculo ? (
        <div className="h-64 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
      ) : curriculo ? (
        <CurriculoHeader
          curriculo={curriculo}
          totalDisciplinas={disciplinas.length}
          onBackClick={handleBackClick}
          onNewDisciplinaClick={() => setIsNewModalOpen(true)}
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

      {/* Modal de Cadastro */}
      <NewDisciplinaModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSaveNewDisciplina}
        cursoIdPreSelecionado={cursoId}
      />
    </section>
  );
};
