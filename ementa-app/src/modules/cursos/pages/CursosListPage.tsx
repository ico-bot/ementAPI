/**
 * @file CursosListPage.tsx
 * @description Tela principal de listagem do catálogo de Cursos consumindo o serviço isolado do módulo.
 */

import React, { useEffect, useState } from 'react';
import { CursoCard } from '../components/CursoCard';
import { fetchCursos } from '../services/cursosService';
import type { Curso } from '../services/types';

export interface CursosListPageProps {
  onSelectCurso?: (cursoId: string) => void;
}

export const CursosListPage: React.FC<CursosListPageProps> = ({ onSelectCurso }) => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadCursos = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCursos();
        if (isMounted) {
          setCursos(data);
        }
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCursos();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
          Catálogo de Cursos
          {!isLoading && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {cursos.length}
            </span>
          )}
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map((skeletonId) => (
            <div key={skeletonId} className="h-44 rounded-2xl bg-slate-900/60 border border-slate-800/80" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cursos.map((curso) => (
            <CursoCard key={curso.id} curso={curso} onViewEmentasClick={onSelectCurso} />
          ))}
        </div>
      )}
    </section>
  );
};
