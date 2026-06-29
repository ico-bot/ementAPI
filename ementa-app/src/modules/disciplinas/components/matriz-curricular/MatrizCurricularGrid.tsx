/**
 * @file MatrizCurricularGrid.tsx
 * @description Grade visual organizando as Disciplinas agrupadas por períodos ideais do curso.
 */

import React from 'react';
import { DisciplinaCard } from '../list/DisciplinaCard';
import type { Disciplina } from '../../services/types';

export interface MatrizCurricularGridProps {
  disciplinas: Disciplina[];
  onSelectDisciplina: (disciplina: Disciplina) => void;
}

export const MatrizCurricularGrid: React.FC<MatrizCurricularGridProps> = ({
  disciplinas,
  onSelectDisciplina,
}) => {
  if (disciplinas.length === 0) {
    return (
      <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-800/80 text-purple-400 flex items-center justify-center mx-auto text-2xl font-bold font-mono border border-white/5">
          !
        </div>
        <h3 className="text-lg font-bold text-slate-200">Nenhuma disciplina cadastrada nesta matriz</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          O ementário deste curso ainda não possui matérias cadastradas ou os filtros atuais ocultaram todos os resultados.
        </p>
      </div>
    );
  }

  // Agrupar disciplinas por período ideal (1, 2... 8, 0 para optativas sem período fixo)
  const periodosMap: Record<number, Disciplina[]> = {};
  disciplinas.forEach((disc) => {
    const p = disc.periodoIdeal || 0;
    if (!periodosMap[p]) {
      periodosMap[p] = [];
    }
    periodosMap[p].push(disc);
  });

  const periodosOrdenados = Object.keys(periodosMap)
    .map(Number)
    .sort((a, b) => {
      if (a === 0) return 1; // Colocar período 0 (Optativas/Eletivas gerais) no final
      if (b === 0) return -1;
      return a - b;
    });

  return (
    <div className="space-y-10 animate-fade-in">
      {periodosOrdenados.map((periodo) => {
        const dLista = periodosMap[periodo];
        const tituloPeriodo = periodo === 0 ? 'Disciplinas Optativas / Eletivas Gerais' : `${periodo}º Período Ideal`;
        const totalCreditosPeriodo = dLista.reduce((acc, curr) => acc + curr.creditos, 0);

        return (
          <section key={periodo} className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md shadow-purple-500/50" />
                <h3 className="text-xl font-extrabold text-white tracking-tight">{tituloPeriodo}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                  {dLista.length} matéria{dLista.length !== 1 ? 's' : ''}
                </span>
              </div>

              <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                {totalCreditosPeriodo} Créditos no Período
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dLista.map((disciplina) => (
                <DisciplinaCard
                  key={disciplina.id}
                  disciplina={disciplina}
                  onClick={onSelectDisciplina}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
