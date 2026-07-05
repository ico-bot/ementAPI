/**
 * @file EditPPCModal.tsx
 * @description Modal administrativo para criação e edição autenticada do Projeto Pedagógico de Curso (PPC) via API /api/ppcs/.
 */

import React, { useState } from 'react';
import type { ProjetoPedagogicoCurso } from '../../services/types';
import { savePPC } from '../../services/disciplinasService';

export interface EditPPCModalProps {
  curriculoId: string;
  cursoNome?: string;
  ppc?: ProjetoPedagogicoCurso | null;
  onClose: () => void;
  onSuccess: (updatedPpc: ProjetoPedagogicoCurso) => void;
}

export const EditPPCModal: React.FC<EditPPCModalProps> = ({
  curriculoId,
  cursoNome = 'Curso Selecionado',
  ppc,
  onClose,
  onSuccess,
}) => {
  const [conteudo, setConteudo] = useState<string>(ppc?.conteudo || '');
  const [arquivoUrl, setArquivoUrl] = useState<string>(ppc?.arquivoUrl || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(ppc?.id);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!conteudo.trim()) {
      setError('Por favor, insira o resumo ou descrição pedagógica do curso.');
      return;
    }

    setIsLoading(true);
    try {
      const saved = await savePPC(curriculoId, {
        ppcId: ppc?.id,
        conteudo: conteudo.trim(),
        arquivoUrl: arquivoUrl.trim() || undefined,
      });
      onSuccess(saved);
      onClose();
    } catch (err) {
      setError('Ocorreu um erro ao salvar o Projeto Pedagógico. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop de Fundo */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
      />

      {/* Caixa do Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(168,85,247,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow de Fundo */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Cabeçalho */}
        <div className="p-6 sm:p-8 pb-4 border-b border-white/10 flex items-start justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                👑 Acesso Admin • /api/ppcs/
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-medium flex items-center gap-1" title="Alterações manuais são protegidas de sobrescrita pelos extratores automáticos">
                🔒 Protegido contra Sincronização
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {isEdit ? 'Editar Projeto Pedagógico (PPC)' : 'Cadastrar Projeto Pedagógico (PPC)'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Matriz Curricular: <strong className="text-purple-300">{cursoNome}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 relative z-10 custom-scrollbar">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5 animate-fade-in">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Campo de Descrição/Conteúdo */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
              Resumo e Diretrizes Pedagógicas *
            </label>
            <p className="text-[11px] text-slate-400">
              Descreva o perfil do egresso, objetivos gerais da matriz e diretrizes do ementário da universidade.
            </p>
            <textarea
              rows={5}
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Ex: Projeto Pedagógico focado em formação teórica e prática intensiva..."
              disabled={isLoading}
              className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/80 transition-all disabled:opacity-50 resize-y font-sans leading-relaxed"
            />
          </div>

          {/* Campo URL Oficial do PDF */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
              URL do Arquivo Oficial (PDF institucional)
            </label>
            <p className="text-[11px] text-slate-400">
              Link direto para consulta pública do documento no portal da universidade ou SIGAA.
            </p>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                📄
              </span>
              <input
                type="url"
                value={arquivoUrl}
                onChange={(e) => setArquivoUrl(e.target.value)}
                placeholder="https://www.ufac.br/portal/.../ppc_vigente.pdf"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/80 transition-all disabled:opacity-50 font-mono text-xs"
              />
            </div>
          </div>

          {/* Dica sobre Coexistência */}
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex items-start gap-3">
            <span className="text-base shrink-0 mt-0.5">💡</span>
            <div className="space-y-1">
              <strong className="font-bold block text-purple-100">Preservação de Dados Manuais (Regra 1):</strong>
              <p className="text-purple-300/90 leading-relaxed">
                Ao salvar este documento via painel administrativo, o sistema sinaliza o registro para que os scripts de extração automática ignorem a sobrescrita destas informações personalizadas.
              </p>
            </div>
          </div>

          {/* Rodapé e Botões */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-900/30 border border-purple-400/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Salving PPC...
                </span>
              ) : (
                <span>{isEdit ? '💾 Salvar Alterações' : '✨ Cadastrar PPC'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
