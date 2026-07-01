/**
 * @file DocentesListPage.tsx
 * @description Página principal de visualização e filtragem do catálogo de Corpo Docente e suas atribuições didáticas e de coordenação.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCursos } from '../../cursos/services/cursosService';
import type { Curso } from '../../cursos/services/types';
import { DocenteCard } from '../components/DocenteCard';
import { DocenteDetailModal } from '../components/DocenteDetailModal';
import { DocentesFilterBar } from '../components/DocentesFilterBar';
import { fetchDocentes, fetchVinculosDocenteDisciplina } from '../services/docentesService';
import type { CargoDocente, Docente, DocenteDisciplinaVinculo, TitulacaoDocente } from '../services/types';

export interface DocentesListPageProps {
  onSelectCurso?: (cursoId: string) => void;
}

export const DocentesListPage: React.FC<DocentesListPageProps> = ({ onSelectCurso }) => {
  const navigate = useNavigate();
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [vinculos, setVinculos] = useState<DocenteDisciplinaVinculo[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estados dos filtros (variáveis de estado lógico em inglês conforme Regra 3)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTitulacao, setSelectedTitulacao] = useState<TitulacaoDocente | 'Todos'>('Todos');
  const [selectedCargo, setSelectedCargo] = useState<CargoDocente | 'Todos'>('Todos');

  // Estado do Modal
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);

  const loadData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [docentesData, vinculosData, cursosData] = await Promise.all([
        fetchDocentes({
          termo: searchTerm,
          titulacao: selectedTitulacao,
          cargo: selectedCargo,
        }),
        fetchVinculosDocenteDisciplina(),
        fetchCursos(),
      ]);

      setDocentes(docentesData);
      setVinculos(vinculosData);
      setCursos(cursosData);
    } catch (error) {
      console.error('Erro ao carregar dados do catálogo de docentes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedTitulacao, selectedCargo]);

  const handleResetFilters = (): void => {
    setSearchTerm('');
    setSelectedTitulacao('Todos');
    setSelectedCargo('Todos');
  };

  const handleSelectCursoFromModal = (cursoId: string) => {
    if (onSelectCurso) {
      onSelectCurso(cursoId);
    } else {
      navigate(`/cursos/${cursoId}/disciplinas`);
    }
  };

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 text-[11px] font-bold tracking-wide uppercase font-mono shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
              Sincronizado • /api/docentes/
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Corpo Docente da Instituição
            {!isLoading && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-purple-300 font-mono font-semibold border border-purple-500/20">
                {docentes.length}
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Consulte professores, titulações, coordenações de cursos e matérias lecionadas
          </p>
        </div>
      </div>

      <DocentesFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTitulacao={selectedTitulacao}
        onTitulacaoChange={setSelectedTitulacao}
        selectedCargo={selectedCargo}
        onCargoChange={setSelectedCargo}
        onResetFilters={handleResetFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((skeletonId) => (
            <div key={skeletonId} className="h-56 rounded-3xl bg-slate-900/60 border border-slate-800/80" />
          ))}
        </div>
      ) : docentes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto text-xl font-mono">
            ?
          </div>
          <h3 className="text-base font-semibold text-slate-200">Nenhum professor encontrado</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Não encontramos resultados compatíveis com os filtros selecionados.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docentes.map((docente) => {
            const materiasCount = vinculos.filter((v) => v.docenteId === docente.id).length;
            const cursosCoordenadosPorEste = cursos.filter((c) => c.coordenador?.id === docente.id || c.coordenador?.nome === docente.nome);
            const isCoordenador = cursosCoordenadosPorEste.length > 0;
            const cursoCoordenadoNome = isCoordenador ? cursosCoordenadosPorEste[0].nome : undefined;

            return (
              <DocenteCard
                key={docente.id}
                docente={docente}
                totalDisciplinasLecionadas={materiasCount}
                isCoordenador={isCoordenador}
                cursoCoordenadoNome={cursoCoordenadoNome}
                onClick={setSelectedDocente}
              />
            );
          })}
        </div>
      )}

      {selectedDocente && (
        <DocenteDetailModal
          docente={selectedDocente}
          cursosCoordenados={cursos
            .filter((c) => c.coordenador?.id === selectedDocente.id || c.coordenador?.nome === selectedDocente.nome)
            .map((c) => ({ id: c.id, nome: c.nome }))}
          onClose={() => setSelectedDocente(null)}
          onSelectCurso={handleSelectCursoFromModal}
        />
      )}
    </section>
  );
};
