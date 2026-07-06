/**
 * @file DocenteDetailModal.tsx
 * @description Modal interativo exibindo o perfil completo do docente e todas as matérias e coordenações sob sua responsabilidade.
 */

import React, { useEffect, useState } from 'react';
import { fetchDisciplinasByDocenteId } from '../services/docentesService';
import type { Docente, DocenteDisciplinaVinculo } from '../services/types';

export interface DocenteDetailModalProps {
  docente: Docente | null;
  cursosCoordenados?: Array<{ id: string; nome: string }>;
  onClose: () => void;
  onSelectCurso?: (cursoId: string) => void;
}

export const DocenteDetailModal: React.FC<DocenteDetailModalProps> = ({
  docente,
  cursosCoordenados = [],
  onClose,
  onSelectCurso,
}) => {
  const [vinculos, setVinculos] = useState<DocenteDisciplinaVinculo[]>([]);
  const [isLoadingVinculos, setIsLoadingVinculos] = useState<boolean>(true);

  useEffect(() => {
    if (!docente) return;

    let isMounted = true;
    setIsLoadingVinculos(true);

    fetchDisciplinasByDocenteId(docente.id)
      .then((data) => {
        if (isMounted) setVinculos(data);
      })
      .catch((err) => {
        console.error('Erro ao buscar matérias lecionadas pelo docente:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingVinculos(false);
      });

    return () => {
      isMounted = false;
    };
  }, [docente]);

  if (!docente) return null;

  const totalCargaHoraria = vinculos.reduce((acc, curr) => acc + (curr.cargaHoraria || 60), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 border border-purple-500/30 shadow-[0_0_50px_-10px_rgba(168,85,247,0.3)] overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Cabeçalho do Modal */}
        <div className="p-6 sm:p-8 bg-slate-950/60 border-b border-white/10 relative flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {docente.titulacao && (
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {docente.titulacao}
                </span>
              )}
              {docente.cargo && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {docente.cargo}
                </span>
              )}
              {(docente.editadoManualmente || docente.inseridoManualmente) ? (
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Personalizado
                </span>
              ) : (
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  API /api/docentes/
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {docente.nome}
            </h2>

            {docente.centroLotacao && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1 italic">
                {docente.centroLotacao}
              </p>
            )}
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

        {/* Informações Complementares do Docente */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-slate-950/40 border-b border-white/5 font-mono text-center">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Regime de Jornada</span>
            <strong className="text-sm font-bold text-indigo-300">{docente.jornada || '40h'}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Tempo na UFAC</span>
            <strong className="text-sm font-bold text-purple-300">{docente.tempoCasa ? `${docente.tempoCasa} anos` : 'N/I'}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Carga Didática</span>
            <strong className="text-sm font-bold text-emerald-300">{totalCargaHoraria}h ({vinculos.length} mat.)</strong>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">E-mail Institucional</span>
            <strong className="text-xs font-bold text-slate-300 truncate block">{docente.email || 'N/I'}</strong>
          </div>
        </div>

        {/* Corpo do Modal (Scrollável) */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Seção de Coordenações */}
          {cursosCoordenados.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-mono">
                  Coordenação de Cursos ({cursosCoordenados.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cursosCoordenados.map((curso) => (
                  <button
                    key={curso.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onSelectCurso) onSelectCurso(curso.id);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold border border-amber-500/40 transition-all cursor-pointer shadow-sm"
                  >
                    <span>{curso.nome}</span>
                    <span className="text-[10px] opacity-80">→ Abrir Grade</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Seção de Disciplinas Lecionadas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Disciplinas Lecionadas ({vinculos.length})
              </h3>
            </div>

            {isLoadingVinculos ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="h-16 rounded-2xl bg-slate-900/80 border border-slate-800" />
                ))}
              </div>
            ) : vinculos.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-400 text-xs">
                Nenhum vínculo de disciplina lecionada cadastrado para este docente no período ativo.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {vinculos.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[11px] font-mono font-bold">
                          {v.codigoDisciplina || 'DISC'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[11px] font-mono border border-indigo-500/20">
                          {v.cargaHoraria || 60}h
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {v.ano ? `Período letivo: ${v.ano}/${v.semestre}` : `Período: Flexível (${v.semestre}º Sem.)`}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100">{v.disciplinaNome}</h4>
                      <p className="text-xs text-slate-400 italic">{v.cursoNome}</p>
                    </div>

                    {onSelectCurso && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectCurso(v.cursoId);
                        }}
                        className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 hover:border-purple-500 transition-all cursor-pointer shrink-0"
                      >
                        Ver Matriz Curricular →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
