/**
 * @file DisciplinaDetailModal.tsx
 * @description Modal unificado de visualização detalhada de Disciplinas, organizado em abas pedagógicas limpas e sem poluição visual.
 */

import React, { useState, useEffect } from 'react';
import type { Disciplina, DisciplinaGlobalItem } from '../../services/types';

export interface DisciplinaDetailModalProps<
  T extends Disciplina | DisciplinaGlobalItem = Disciplina | DisciplinaGlobalItem
> {
  disciplina: T | null;
  isOpen: boolean;
  onClose: () => void;
  onEditClick?: (disciplina: T) => void;
}

type DetailTabType = 'geral' | 'pedagogico';

export const DisciplinaDetailModal = <
  T extends Disciplina | DisciplinaGlobalItem = Disciplina | DisciplinaGlobalItem
>({
  disciplina,
  isOpen,
  onClose,
  onEditClick,
}: DisciplinaDetailModalProps<T>): React.ReactElement | null => {
  const [activeTab, setActiveTab] = useState<DetailTabType>('geral');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('geral');
    }
  }, [isOpen, disciplina]);

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
        <div className="p-6 md:p-8 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border-b border-white/10 flex items-start justify-between gap-4 shrink-0">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-950/60 border-b border-white/5 text-center font-mono shrink-0">
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

        {/* Barra de Abas (Tabs) - Limpa, sem ícones ou tags visuais */}
        <div className="flex border-b border-white/10 bg-slate-950/40 px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('geral')}
            className={`py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'geral'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            Visão Geral & Docentes
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pedagogico')}
            className={`py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'pedagogico'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            Plano Pedagógico
          </button>

          
        </div>

        {/* Corpo Scrollável de Detalhes */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm leading-relaxed custom-scrollbar">
          
          {/* ABA 1: VISÃO GERAL & DOCENTES */}
          {activeTab === 'geral' && (
            <div className="space-y-6 animate-fade-in">
              {(disciplina.editadoManualmente || disciplina.inseridoManualmente) && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
                  <strong className="block text-amber-300 font-semibold mb-0.5">Dado Personalizado e Protegido</strong>
                  Esta disciplina possui edições manuais ou cadastro personalizado no sistema. O Back-End a sinalizou para que sua ficha não seja alterada ou sobrescrita pela sincronização periódica automática.
                </div>
              )}

              {/* Corpo Docente (Apenas vindo de Matriz Curricular) */}
              {isCurriculoDisc && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 font-mono">
                      Corpo Docente (Ministrantes)
                    </h4>
                    {temDocentes && (
                      <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                        {disciplina.docentes!.length} professor{disciplina.docentes!.length !== 1 ? 'es' : ''}
                      </span>
                    )}
                  </div>

                  {temDocentes ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {disciplina.docentes!.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all shadow-sm"
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
                    <p className="italic text-slate-500 text-xs bg-slate-950/40 p-4 rounded-2xl border border-dashed border-slate-800">
                      Docente não informado no ementário institucional desta matriz.
                    </p>
                  )}
                </div>
              )}

              {/* Pré-requisitos */}
              {disciplina.preRequisitos && (
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 font-mono">
                    Pré-requisitos Curriculares
                  </h4>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-200 text-xs">
                    {disciplina.preRequisitos}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-xs text-slate-400 space-y-1 font-mono">
                <p><strong className="text-slate-300">Código Oficial:</strong> {disciplina.codigo}</p>
                <p><strong className="text-slate-300">Carga Horária Ideal:</strong> {disciplina.cargaHoraria || disciplina.creditos * 15} horas</p>
                <p><strong className="text-slate-300">Créditos:</strong> {disciplina.creditos} ({disciplina.creditos * 15}h teóricas/práticas)</p>
                <p><strong className="text-slate-300">Média de Aprovação:</strong> {typeof disciplina.notaMinimaAprovacao === 'number' ? disciplina.notaMinimaAprovacao.toFixed(1) : disciplina.notaMinimaAprovacao}</p>
              </div>
            </div>
          )}

          {/* ABA 2: PLANO PEDAGÓGICO */}
          {activeTab === 'pedagogico' && (
            <div className="space-y-6 animate-fade-in divide-y divide-white/5">
              
              {/* Ementa */}
              <div className="space-y-2.5 pt-4 first:pt-0">
                <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 font-mono">
                  Ementa Curricular Oficial
                </h4>
                {disciplina.ementa ? (
                  <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 text-slate-200 whitespace-pre-line font-sans leading-relaxed text-xs sm:text-sm">
                    {disciplina.ementa}
                  </div>
                ) : (
                  <p className="italic text-slate-500 text-xs bg-slate-950/40 p-4 rounded-2xl border border-dashed border-slate-800">
                    Informação não cadastrada.
                  </p>
                )}
              </div>

              {/* Objetivos */}
              <div className="space-y-2.5 pt-6">
                <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 font-mono">
                  Objetivos da Disciplina
                </h4>
                {disciplina.objetivos ? (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-200 whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                    {disciplina.objetivos}
                  </div>
                ) : disciplina.ppc ? (
                  <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-purple-200 font-medium">
                        Objetivos alinhados às diretrizes institucionais do PPC do curso.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {disciplina.ppc.conteudo || 'Consulte o documento oficial da matriz curricular sincronizado na API /api/ppcs/.'}
                      </p>
                    </div>
                    {disciplina.ppc.arquivoUrl && (
                      <a
                        href={disciplina.ppc.arquivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-semibold transition-all shrink-0"
                      >
                        Ver no PPC
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="italic text-slate-500 text-xs bg-slate-950/40 p-4 rounded-2xl border border-dashed border-slate-800">
                    Informação não cadastrada.
                  </p>
                )}
              </div>

              {/* Programa */}
              <div className="space-y-2.5 pt-6">
                <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 font-mono">
                  Conteúdo Programático (Programa)
                </h4>
                {disciplina.programa ? (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-200 whitespace-pre-line text-xs sm:text-sm leading-relaxed font-mono">
                    {disciplina.programa}
                  </div>
                ) : disciplina.ppc ? (
                  <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-purple-200 font-medium">
                        Programa e ementário detalhados no Projeto Pedagógico de Curso (PPC).
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {disciplina.ppc.conteudo || 'Consulte o arquivo oficial do PPC para o detalhamento aula a aula e bibliografias.'}
                      </p>
                    </div>
                    {disciplina.ppc.arquivoUrl && (
                      <a
                        href={disciplina.ppc.arquivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-semibold transition-all shrink-0"
                      >
                        Abrir Documento
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="italic text-slate-500 text-xs bg-slate-950/40 p-4 rounded-2xl border border-dashed border-slate-800">
                    Informação não cadastrada.
                  </p>
                )}
              </div>

              {/* Metodologia de Ensino */}
              <div className="space-y-2.5 pt-6">
                <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 font-mono">
                  Metodologia de Ensino
                </h4>
                {disciplina.metodologia ? (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-200 whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                    {disciplina.metodologia}
                  </div>
                ) : (
                  <p className="italic text-slate-500 text-xs bg-slate-950/40 p-4 rounded-2xl border border-dashed border-slate-800">
                    Informação não cadastrada.
                  </p>
                )}
              </div>

              {/* Critérios de Avaliação */}
              <div className="space-y-2.5 pt-6">
                <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 font-mono">
                  Critérios e Instrumentos de Avaliação
                </h4>
                {disciplina.avaliacao ? (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-200 whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                    {disciplina.avaliacao}
                  </div>
                ) : (
                  <p className="italic text-slate-500 text-xs bg-slate-950/40 p-4 rounded-2xl border border-dashed border-slate-800">
                    Informação não cadastrada.
                  </p>
                )}
              </div>

            </div>
          )}

          
        </div>

        {/* Rodapé */}
        <div className="p-4 md:p-6 bg-slate-950 border-t border-white/10 flex items-center justify-between gap-4 shrink-0">
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
