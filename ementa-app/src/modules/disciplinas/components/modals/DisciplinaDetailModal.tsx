/**
 * @file DisciplinaDetailModal.tsx
 * @description Modal unificado de visualização detalhada de Disciplinas, suportando tanto o contexto de Matrizes Curriculares quanto o Catálogo Geral.
 */

import React from 'react';
import type { Disciplina, DisciplinaGlobalItem } from '../../services/types';

export interface DisciplinaDetailModalProps<
  T extends Disciplina | DisciplinaGlobalItem = Disciplina | DisciplinaGlobalItem
> {
  disciplina: T | null;
  isOpen: boolean;
  onClose: () => void;
  onEditClick?: (disciplina: T) => void;
}

export const DisciplinaDetailModal = <
  T extends Disciplina | DisciplinaGlobalItem = Disciplina | DisciplinaGlobalItem
>({
  disciplina,
  isOpen,
  onClose,
  onEditClick,
}: DisciplinaDetailModalProps<T>): React.ReactElement | null => {
  if (!isOpen || !disciplina) {
    return null;
  }

  // Type guards visuais
  const isCurriculoDisc = 'tipo' in disciplina;
  const isGlobalDisc = 'area' in disciplina;

  const temDocentes = isCurriculoDisc && disciplina.docentes && disciplina.docentes.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in custom-scrollbar">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Cabeçalho do Modal */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border-b border-white/10 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3 font-mono">
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-500/30 shadow-sm">
                {disciplina.codigo}
              </span>
              
              {isCurriculoDisc && (
                <span className="text-xs font-sans font-semibold px-3 py-1 rounded-md bg-white/10 text-slate-200 border border-white/5">
                  {disciplina.tipo}
                </span>
              )}

              {isGlobalDisc && (
                <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {disciplina.nivel}
                </span>
              )}

              {isCurriculoDisc && disciplina.periodoIdeal > 0 && (
                <span className="text-xs px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {disciplina.periodoIdeal}º Período Ideal
                </span>
              )}

              {isGlobalDisc && (
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                  {disciplina.turno}
                </span>
              )}

              {isGlobalDisc && (
                <span className="text-xs font-sans px-3 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-auto sm:ml-0">
                  {disciplina.status}
                </span>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {disciplina.nome}
            </h2>
            
            <p className="text-xs sm:text-sm text-purple-300 font-medium mt-1">
              {disciplina.unidade || (isGlobalDisc ? disciplina.area : 'Universidade Federal do Acre')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all text-lg font-bold cursor-pointer shrink-0"
            title="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Grade de Estatísticas Rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-950/60 border-b border-white/5 text-center font-mono">
          <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Carga Horária</span>
            <strong className="text-lg font-bold text-indigo-300">
              {disciplina.cargaHoraria || disciplina.creditos * 15}h
            </strong>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Créditos</span>
            <strong className="text-lg font-bold text-purple-300">{disciplina.creditos}</strong>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Nota Aprovação</span>
            <strong className="text-lg font-bold text-amber-400">
              {typeof disciplina.notaMinimaAprovacao === 'number'
                ? disciplina.notaMinimaAprovacao.toFixed(1)
                : disciplina.notaMinimaAprovacao}
            </strong>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 font-sans">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-mono">Unidade</span>
            <strong className="text-xs font-semibold text-slate-200 block truncate mt-1" title={disciplina.unidade}>
              {disciplina.unidade?.split('-')[1]?.trim() || disciplina.unidade || (isGlobalDisc ? disciplina.area : 'UFAC')}
            </strong>
          </div>
        </div>

        {/* Corpo Scrollável de Detalhes */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed custom-scrollbar divide-y divide-white/5">
          
          {/* Corpo Docente (Apenas vindo de Matriz Curricular) */}
          {isCurriculoDisc && (
            <div className="space-y-3 pt-2 first:pt-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Corpo Docente (Ministrantes)
                </h4>
                {temDocentes && (
                  <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20">
                    {disciplina.docentes!.length} professor{disciplina.docentes!.length !== 1 ? 'es' : ''}
                  </span>
                )}
              </div>

              {temDocentes ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {disciplina.docentes!.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 border border-purple-400/30 text-purple-200 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner font-mono">
                        {doc.nome.replace(/^(Dr\.|Dra\.|Me\.|Esp\.)\s+/i, '').charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-100 truncate" title={doc.nome}>
                          {doc.nome}
                        </p>
                        <p className="text-[10px] text-purple-300/80 font-mono mt-0.5 truncate">
                          {doc.titulacao || 'Docente UFAC'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="italic text-slate-500 text-xs bg-slate-950/40 p-3 rounded-xl border border-dashed border-slate-800">
                  Docente não informado no ementário institucional desta matriz.
                </p>
              )}
            </div>
          )}

          {/* Ementa */}
          <div className="space-y-2 pt-6 first:pt-0">
            <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Ementa Curricular Oficial
            </h4>
            {disciplina.ementa ? (
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 text-slate-200 whitespace-pre-line font-sans leading-relaxed">
                {disciplina.ementa}
              </div>
            ) : (
              <p className="italic text-slate-500 text-xs bg-slate-950/40 p-3 rounded-xl border border-dashed border-slate-800">
                Ementa não detalhada no cadastro institucional atual.
              </p>
            )}
          </div>

          {/* Objetivos */}
          <div className="space-y-2 pt-6">
            <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Objetivos da Disciplina
            </h4>
            {disciplina.objetivos ? (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-200 whitespace-pre-line">
                {disciplina.objetivos}
              </div>
            ) : (
              <p className="italic text-slate-500 text-xs bg-slate-950/40 p-3 rounded-xl border border-dashed border-slate-800">
                Objetivos não especificados no documento institucional.
              </p>
            )}
          </div>

          {/* Programa */}
          <div className="space-y-2 pt-6">
            <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Conteúdo Programático (Programa)
            </h4>
            {disciplina.programa ? (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-200 whitespace-pre-line">
                {disciplina.programa}
              </div>
            ) : (
              <p className="italic text-slate-500 text-xs bg-slate-950/40 p-3 rounded-xl border border-dashed border-slate-800">
                Programa detalhado não informado no ementário da universidade.
              </p>
            )}
          </div>

          {/* Metodologia e Avaliação (Específico do Catálogo Global) */}
          {isGlobalDisc && disciplina.metodologia && (
            <div className="space-y-2 pt-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 flex items-center gap-2 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Metodologia de Ensino
              </h4>
              <p className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-300">
                {disciplina.metodologia}
              </p>
            </div>
          )}

          {isGlobalDisc && disciplina.avaliacao && (
            <div className="space-y-2 pt-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 flex items-center gap-2 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Critérios e Instrumentos de Avaliação
              </h4>
              <p className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-300">
                {disciplina.avaliacao}
              </p>
            </div>
          )}

          {/* Pré-requisitos */}
          {disciplina.preRequisitos && (
            <div className="space-y-2 pt-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 flex items-center gap-2 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Pré-requisitos
              </h4>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-200">
                {disciplina.preRequisitos}
              </div>
            </div>
          )}

          {/* Bibliografia Básica */}
          {disciplina.bibliografiaBasica && (
            <div className="space-y-2 pt-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 flex items-center gap-2 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Bibliografia Básica
              </h4>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono text-slate-400 whitespace-pre-line leading-relaxed">
                {disciplina.bibliografiaBasica}
              </div>
            </div>
          )}

          {/* Bibliografia Complementar */}
          {disciplina.bibliografiaComplementar && (
            <div className="space-y-2 pt-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 flex items-center gap-2 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Bibliografia Complementar
              </h4>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono text-slate-400 whitespace-pre-line leading-relaxed">
                {disciplina.bibliografiaComplementar}
              </div>
            </div>
          )}

        </div>

        {/* Rodapé */}
        <div className="p-4 md:p-6 bg-slate-950 border-t border-white/10 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500 truncate hidden sm:inline">
            ID Interno: <code className="font-mono text-slate-400">{disciplina.id}</code>
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-all cursor-pointer border border-white/5"
            >
              Fechar Detalhes
            </button>

            {onEditClick && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditClick(disciplina);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-900/30 transition-all cursor-pointer active:scale-95"
              >
                Editar Disciplina
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
