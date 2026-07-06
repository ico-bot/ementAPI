/**
 * @file CursosListPage.tsx
 * @description Tela principal de listagem do catálogo de Cursos consumindo o serviço isolado com filtros e cadastro local.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CursoCard } from '../components/list/CursoCard';
import { CursosFilterBar } from '../components/filters/CursosFilterBar';
import { fetchCursos } from '../services/cursosService';
import type { Curso, NivelCurso, StatusFuncionamento, TurnoCurso } from '../services/types';

export interface CursosListPageProps {
  onSelectCurso?: (cursoId: string) => void;
}

export const CursosListPage: React.FC<CursosListPageProps> = ({ onSelectCurso }) => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state variables (English names as per Rule 3)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFunctioning, setSelectedFunctioning] = useState<StatusFuncionamento | 'Todos'>('Todos');
  const [selectedLevel, setSelectedLevel] = useState<NivelCurso | 'Todos'>('Todos');
  const [selectedShift, setSelectedShift] = useState<TurnoCurso | 'Todos'>('Todos');

  const loadCursos = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCursos({
        termo: searchTerm,
        funcionamento: selectedFunctioning,
        nivel: selectedLevel,
        turno: selectedShift,
      });
      setCursos(data);
    } catch (err: any) {
      console.error('Erro ao buscar cursos filtrados:', err);
      setError('Não foi possível carregar o catálogo de cursos. Verifique se o Back-End está online e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadCursos();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchTerm, selectedFunctioning, selectedLevel, selectedShift]);

  const handleResetFilters = (): void => {
    setSearchTerm('');
    setSelectedFunctioning('Todos');
    setSelectedLevel('Todos');
    setSelectedShift('Todos');
  };

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Catálogo de Cursos
            {!isLoading && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-purple-300 font-mono font-semibold border border-purple-500/20">
                {cursos.length}
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Consulte e filtre os cursos e matrizes curriculares extraídos da instituição
          </p>
        </div>
      </div>

      <CursosFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedFunctioning={selectedFunctioning}
        onFunctioningChange={setSelectedFunctioning}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
        selectedShift={selectedShift}
        onShiftChange={setSelectedShift}
        onResetFilters={handleResetFilters}
      />

      {error ? (
        <div className="p-8 md:p-12 text-center rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-4 animate-fade-in shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold border border-rose-500/20 shadow-inner">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-rose-200">Falha ao Carregar Cursos</h3>
            <p className="text-sm text-rose-300/80 leading-relaxed">
              {error}
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={loadCursos}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all active:scale-95 shadow-lg shadow-rose-900/30 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tentar Novamente
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((skeletonId) => (
            <div key={skeletonId} className="h-48 rounded-2xl bg-slate-900/60 border border-slate-800/80" />
          ))}
        </div>
      ) : cursos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto text-xl font-mono">
            ?
          </div>
          <h3 className="text-base font-semibold text-slate-200">Nenhum curso encontrado</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Não encontramos nenhum resultado correspondente aos critérios de busca selecionados.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-2 text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4 cursor-pointer"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cursos.map((curso) => (
            <CursoCard
              key={curso.id}
              curso={curso}
              onViewEmentasClick={(id) => (onSelectCurso ? onSelectCurso(id) : navigate(`/cursos/${id}/disciplinas`))}
            />
          ))}
        </div>
      )}
    </section>
  );
};
