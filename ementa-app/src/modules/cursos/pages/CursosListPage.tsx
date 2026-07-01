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

  // Filter state variables (English names as per Rule 3)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFunctioning, setSelectedFunctioning] = useState<StatusFuncionamento | 'Todos'>('Todos');
  const [selectedLevel, setSelectedLevel] = useState<NivelCurso | 'Todos'>('Todos');
  const [selectedShift, setSelectedShift] = useState<TurnoCurso | 'Todos'>('Todos');

  const loadCursos = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await fetchCursos({
        termo: searchTerm,
        funcionamento: selectedFunctioning,
        nivel: selectedLevel,
        turno: selectedShift,
      });
      setCursos(data);
    } catch (error) {
      console.error('Erro ao buscar cursos filtrados:', error);
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

      {isLoading ? (
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
