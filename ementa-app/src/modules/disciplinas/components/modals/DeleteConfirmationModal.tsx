/**
 * @file DeleteConfirmationModal.tsx
 * @description Modal de confirmação de exclusão para prevenir perdas acidentais de disciplinas no sistema.
 */

import React, { useState } from 'react';
import type { DisciplinaGlobalItem } from '../../services/types';

export interface DeleteConfirmationModalProps {
  disciplina: DisciplinaGlobalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (disciplina: DisciplinaGlobalItem) => Promise<void>;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  disciplina,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  if (!isOpen || !disciplina) {
    return null;
  }

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(disciplina);
      onClose();
    } catch (error) {
      console.error('Erro ao excluir disciplina:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-rose-500/30 p-6 md:p-8 shadow-2xl shadow-rose-950/20 text-center space-y-4 animate-scale-up">
        <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto text-2xl font-bold">
          !
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">Excluir Disciplina</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Tem certeza que deseja excluir permanentemente a disciplina{' '}
            <strong className="text-rose-300 font-mono">
              {disciplina.codigo} - {disciplina.nome}
            </strong>
            ? Essa ação não poderá ser desfeita.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-900/40 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
};
