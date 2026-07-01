/**
 * @file EditDisciplinaModal.tsx
 * @description Modal interativo para edição rápida simulada dos dados de uma Disciplina no catálogo global.
 */

import React, { useEffect, useState } from 'react';
import type { DisciplinaGlobalItem, NivelDisciplina, StatusDisciplina, TurnoDisciplina } from '../../services/types';

export interface EditDisciplinaModalProps {
  disciplina: DisciplinaGlobalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: DisciplinaGlobalItem) => Promise<void>;
}

export const EditDisciplinaModal: React.FC<EditDisciplinaModalProps> = ({
  disciplina,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<DisciplinaGlobalItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (disciplina) {
      setFormData({ ...disciplina });
    }
  }, [disciplina]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
        <div className="p-6 bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Editar Ficha da Disciplina</h3>
            <p className="text-xs text-purple-300 font-mono mt-0.5">{formData.codigo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-amber-200 text-xs">
            <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <span className="font-bold block text-amber-300">Proteção de Dados Ativada</span>
              Ao salvar alterações manuais, esta disciplina será protegida contra atualizações ou sobrescritas da extração periódica automática do site do ementário.
            </div>
          </div>

          <div>
            <label htmlFor="editNome" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Nome da Disciplina
            </label>
            <input
              id="editNome"
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="editArea" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Área de Conhecimento
              </label>
              <input
                id="editArea"
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="editStatus" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Status de Funcionamento
              </label>
              <select
                id="editStatus"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusDisciplina })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Em atividade">Em atividade</option>
                <option value="Inativo">Inativo</option>
                <option value="Suspenso">Suspenso</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="editNivel" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Nível Acadêmico
              </label>
              <select
                id="editNivel"
                value={formData.nivel}
                onChange={(e) => setFormData({ ...formData, nivel: e.target.value as NivelDisciplina })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Graduação">Graduação</option>
                <option value="Pós-Graduação">Pós-Graduação</option>
              </select>
            </div>

            <div>
              <label htmlFor="editTurno" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Turno
              </label>
              <select
                id="editTurno"
                value={formData.turno}
                onChange={(e) => setFormData({ ...formData, turno: e.target.value as TurnoDisciplina })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Integral">Integral</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
                <option value="Diurno">Diurno</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="editCarga" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Carga (horas)
              </label>
              <input
                id="editCarga"
                type="number"
                value={formData.cargaHoraria}
                onChange={(e) => setFormData({ ...formData, cargaHoraria: Number(e.target.value) })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="editCreditos" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Créditos
              </label>
              <input
                id="editCreditos"
                type="number"
                value={formData.creditos}
                onChange={(e) => setFormData({ ...formData, creditos: Number(e.target.value) })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="editNota" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Nota Mín.
              </label>
              <input
                id="editNota"
                type="number"
                step="0.1"
                value={formData.notaMinimaAprovacao}
                onChange={(e) => setFormData({ ...formData, notaMinimaAprovacao: Number(e.target.value) })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="editEmenta" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Ementa
            </label>
            <textarea
              id="editEmenta"
              rows={3}
              value={formData.ementa || ''}
              onChange={(e) => setFormData({ ...formData, ementa: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 px-4 py-2 text-xs focus:outline-none focus:border-purple-500 custom-scrollbar"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-purple-900/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
