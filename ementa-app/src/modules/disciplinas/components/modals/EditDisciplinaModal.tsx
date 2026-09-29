/**
 * @file EditDisciplinaModal.tsx
 * @description Modal interativo de edição da ficha curricular da Disciplina, organizado por abas pedagógicas e com distinção clara entre atributos próprios e atributos herdados do Curso.
 */

import React, { useEffect, useState } from 'react';
import type { DisciplinaGlobalItem } from '../../services/types';

export interface EditDisciplinaModalProps {
  disciplina: DisciplinaGlobalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: DisciplinaGlobalItem) => Promise<void>;
}

type TabType = 'geral' | 'pedagogico' | 'bibliografia';

export const EditDisciplinaModal: React.FC<EditDisciplinaModalProps> = ({
  disciplina,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<DisciplinaGlobalItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('geral');

  useEffect(() => {
    if (disciplina) {
      setFormData({ ...disciplina });
      setActiveTab('geral');
    }
  }, [disciplina, isOpen]);

  if (!isOpen || !formData) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar disciplina:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in custom-scrollbar">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Cabeçalho */}
        <div className="p-6 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {formData.codigo}
              </span>
              {(formData.editadoManualmente || formData.inseridoManualmente) && (
                <span className="text-[11px] font-sans px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Protegida (Edição Manual)
                </span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Editar Ficha da Disciplina
            </h3>
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

        {/* Barra de Abas (Tabs) */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('geral')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'geral'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
          Geral & Atributos
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pedagogico')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pedagogico'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
          Plano Pedagógico
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bibliografia')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'bibliografia'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
           Bibliografias
          </button>
        </div>

        {/* Formulário com Scroll Interno */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-sm">
            
            {/* Aviso de Proteção de Sincronização */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-amber-200 text-xs shadow-sm">
              <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <span className="font-bold block text-amber-300">Proteção de Dados Ativada</span>
                Ao salvar estas alterações, a disciplina será sinalizada no Back-End como <code className="font-mono bg-amber-950/60 px-1 rounded">editado_manualmente: true</code>, prevenindo sobrescritas durante a extração automática periódica do portal acadêmico.
              </div>
            </div>

            {/* ABA 1: GERAL & ATRIBUTOS */}
            {activeTab === 'geral' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Campos Próprios Editáveis */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Dados Próprios da Disciplina (Editáveis)
                  </h4>

                  <div>
                    <label htmlFor="editNome" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Nome da Disciplina *
                    </label>
                    <input
                      id="editNome"
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      placeholder="Ex: Banco de Dados I"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="editCarga" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Carga Horária (h)
                      </label>
                      <input
                        id="editCarga"
                        type="number"
                        min="0"
                        value={formData.cargaHoraria}
                        onChange={(e) => setFormData({ ...formData, cargaHoraria: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="editCreditos" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Créditos
                      </label>
                      <input
                        id="editCreditos"
                        type="number"
                        min="0"
                        value={formData.creditos}
                        onChange={(e) => setFormData({ ...formData, creditos: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="editNota" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Nota Mín. Aprovação
                      </label>
                      <input
                        id="editNota"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={formData.notaMinimaAprovacao}
                        onChange={(e) => setFormData({ ...formData, notaMinimaAprovacao: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Seção de Atributos Herdados do Curso (Read-Only) */}
                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      Atributos Acadêmicos (Leitura • Sincronizados com o Curso)
                    </h4>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">
                      Herdados
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200/90 leading-relaxed">
                    <p className="font-semibold text-indigo-300 mb-1">Por que estes campos não são editáveis aqui?</p>
                    Na arquitetura acadêmica institucional, atributos como <strong>Área de Conhecimento</strong>, <strong>Nível</strong>, <strong>Turno</strong> e <strong>Status de Funcionamento</strong> pertencem ao Curso vinculado (<code className="font-mono bg-indigo-950 px-1 rounded">Curso</code>) e não à disciplina isolada. Alterações estruturais nesses campos devem ser realizadas nas configurações da Matriz Curricular ou do Curso.
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase block font-sans mb-1">Código</span>
                      <strong className="text-slate-300">{formData.codigo}</strong>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-sans">
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Nível</span>
                      <strong className="text-slate-300">{formData.nivel}</strong>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-sans">
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Turno</span>
                      <strong className="text-slate-300">{formData.turno}</strong>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-sans">
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Status</span>
                      <strong className="text-emerald-400">{formData.status}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <span className="text-[10px] text-slate-500 uppercase block font-sans mb-1">Área de Conhecimento / Unidade</span>
                    <strong className="text-slate-300 block truncate">{formData.area} • {formData.unidade || 'UFAC'}</strong>
                  </div>
                </div>

              </div>
            )}

            {/* ABA 2: PLANO PEDAGÓGICO */}
            {activeTab === 'pedagogico' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label htmlFor="editEmenta" className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1 flex items-center justify-between">
                    <span>Ementa Curricular</span>
                    <span className="text-[10px] font-normal text-slate-500">Resumo dos tópicos abordados</span>
                  </label>
                  <textarea
                    id="editEmenta"
                    rows={4}
                    placeholder="Digite a ementa oficial da disciplina..."
                    value={formData.ementa || ''}
                    onChange={(e) => setFormData({ ...formData, ementa: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 text-xs leading-relaxed focus:outline-none focus:border-purple-500 custom-scrollbar transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="editObjetivos" className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1 flex items-center justify-between">
                    <span>Objetivos da Disciplina</span>
                    <span className="text-[10px] font-normal text-slate-500">Competências e habilidades esperadas</span>
                  </label>
                  <textarea
                    id="editObjetivos"
                    rows={4}
                    placeholder="Especifique os objetivos gerais e específicos..."
                    value={formData.objetivos || ''}
                    onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 text-xs leading-relaxed focus:outline-none focus:border-purple-500 custom-scrollbar transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="editPrograma" className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1 flex items-center justify-between">
                    <span>Conteúdo Programático (Programa)</span>
                    <span className="text-[10px] font-normal text-slate-500">Detalhamento por unidades ou aulas</span>
                  </label>
                  <textarea
                    id="editPrograma"
                    rows={5}
                    placeholder="Unidade I: Introdução...&#10;Unidade II: Desenvolvimento..."
                    value={formData.programa || ''}
                    onChange={(e) => setFormData({ ...formData, programa: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 text-xs leading-relaxed focus:outline-none focus:border-purple-500 custom-scrollbar transition-colors font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="editMetodologia" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Metodologia de Ensino
                    </label>
                    <textarea
                      id="editMetodologia"
                      rows={3}
                      placeholder="Ex: Aulas expositivas, laboratório prático, seminários..."
                      value={formData.metodologia || ''}
                      onChange={(e) => setFormData({ ...formData, metodologia: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 px-3.5 py-2.5 text-xs leading-relaxed focus:outline-none focus:border-purple-500 custom-scrollbar transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="editAvaliacao" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Critérios de Avaliação
                    </label>
                    <textarea
                      id="editAvaliacao"
                      rows={3}
                      placeholder="Ex: Duas avaliações teóricas (P1, P2) e trabalhos práticos..."
                      value={formData.avaliacao || ''}
                      onChange={(e) => setFormData({ ...formData, avaliacao: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 px-3.5 py-2.5 text-xs leading-relaxed focus:outline-none focus:border-purple-500 custom-scrollbar transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: BIBLIOGRAFIAS */}
            {activeTab === 'bibliografia' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label htmlFor="editBiblioBasica" className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1 flex items-center justify-between">
                    <span>Bibliografia Básica</span>
                    <span className="text-[10px] font-normal text-slate-500">Mínimo de 3 títulos fundamentais</span>
                  </label>
                  <textarea
                    id="editBiblioBasica"
                    rows={6}
                    placeholder="AUTOR, Nome. Título do livro. Edição. Local: Editora, Ano.&#10;AUTOR 2, Nome. Título..."
                    value={formData.bibliografiaBasica || ''}
                    onChange={(e) => setFormData({ ...formData, bibliografiaBasica: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-300 px-4 py-3 text-xs leading-relaxed focus:outline-none focus:border-purple-500 custom-scrollbar transition-colors font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="editBiblioComp" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                    <span>Bibliografia Complementar</span>
                    <span className="text-[10px] font-normal text-slate-500">Leituras de aprofundamento</span>
                  </label>
                  <textarea
                    id="editBiblioComp"
                    rows={6}
                    placeholder="AUTOR COMPLEMENTAR, Nome. Título da obra..."
                    value={formData.bibliografiaComplementar || ''}
                    onChange={(e) => setFormData({ ...formData, bibliografiaComplementar: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-300 px-4 py-3 text-xs leading-relaxed focus:outline-none focus:border-purple-500 custom-scrollbar transition-colors font-mono"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Rodapé do Modal */}
          <div className="p-4 md:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              ID: {formData.id}
            </span>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-900/40 transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                <span>{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
