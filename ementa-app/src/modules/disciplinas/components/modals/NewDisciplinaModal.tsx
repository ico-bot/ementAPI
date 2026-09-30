/**
 * @file NewDisciplinaModal.tsx
 * @description Modal interativo para cadastro de uma nova Disciplina na matriz curricular ativa.
 */

import React, { useEffect, useState } from 'react';
import type { Disciplina, TipoDisciplina } from '../../services/types';
import { fetchCursos } from '../../../cursos/services/cursosService';
import type { Curso } from '../../../cursos/services/types';

export interface NewDisciplinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newDisc: Omit<Disciplina, 'id'>, cursoId: string) => Promise<void>;
  cursoIdPreSelecionado?: string;
}

export const NewDisciplinaModal: React.FC<NewDisciplinaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  cursoIdPreSelecionado,
}) => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedCursoId, setSelectedCursoId] = useState<string>('');
  const [isLoadingCursos, setIsLoadingCursos] = useState<boolean>(false);

  const [nome, setNome] = useState<string>('');
  const [codigo, setCodigo] = useState<string>('');
  const [cargaHoraria, setCargaHoraria] = useState<number>(60);
  const [ementa, setEmenta] = useState<string>('');
  const [preRequisitos, setPreRequisitos] = useState<string>('');
  
  // Campos estruturais auxiliares com valores padrão
  const [tipo, setTipo] = useState<TipoDisciplina>('Obrigatória');
  const [periodoIdeal, setPeriodoIdeal] = useState<number>(1);
  const [creditos, setCreditos] = useState<number>(4);
  const [notaMinimaAprovacao, setNotaMinimaAprovacao] = useState<number>(5.0);
  const [unidade, setUnidade] = useState<string>('Centro de Ciências Exatas e Tecnológicas - CCET');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingCursos(true);
      fetchCursos()
        .then((data) => {
          setCursos(data);
          if (cursoIdPreSelecionado) {
            setSelectedCursoId(cursoIdPreSelecionado);
          } else {
            setSelectedCursoId('');
          }
        })
        .catch((err) => {
          console.error('Erro ao buscar cursos no modal:', err);
        })
        .finally(() => {
          setIsLoadingCursos(false);
        });
    }
  }, [isOpen, cursoIdPreSelecionado]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação da Regra de Negócio 2: Curso obrigatório
    if (!selectedCursoId.trim()) {
      setError('É obrigatório selecionar um curso existente para associar a disciplina.');
      return;
    }

    // Validação simples de campos obrigatórios
    if (!nome.trim()) {
      setError('O nome da disciplina é obrigatório.');
      return;
    }
    if (!codigo.trim()) {
      setError('O código da disciplina é obrigatório.');
      return;
    }
    if (cargaHoraria <= 0) {
      setError('A carga horária deve ser maior que zero.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(
        {
          nome: nome.trim(),
          codigo: codigo.trim().toUpperCase(),
          cargaHoraria,
          ementa: ementa.trim(),
          preRequisitos: preRequisitos.trim() || undefined,
          tipo,
          periodoIdeal,
          creditos,
          notaMinimaAprovacao,
          unidade,
        },
        selectedCursoId
      );
      
      // Limpa formulário
      setNome('');
      setCodigo('');
      setCargaHoraria(60);
      setEmenta('');
      setPreRequisitos('');
      setTipo('Obrigatória');
      setPeriodoIdeal(1);
      setCreditos(4);
      
      onClose();
    } catch (err: any) {
      console.error(err);
      setError('Erro ao cadastrar disciplina. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in custom-scrollbar">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Cabeçalho do Modal */}
        <div className="p-6 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Cadastrar Nova Disciplina</h3>
            <p className="text-xs text-purple-300 mt-0.5">Adicione uma matéria à matriz curricular vigente do curso</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-lg font-bold w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5"
          >
            ✕
          </button>
        </div>

        {/* Formulário com Scroll Interno */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-sm custom-scrollbar">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs flex items-center gap-2.5">
              <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Seleção do Curso Associado (Regra de Negócio 2) */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
            <label htmlFor="newCursoSelect" className="block text-xs font-semibold uppercase tracking-wider text-purple-300">
              Curso Associado *
            </label>
            {isLoadingCursos ? (
              <div className="w-full h-10 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center px-3 text-xs text-slate-400 animate-pulse">
                Carregando lista de cursos da instituição...
              </div>
            ) : (
              <select
                id="newCursoSelect"
                value={selectedCursoId}
                onChange={(e) => setSelectedCursoId(e.target.value)}
                disabled={Boolean(cursoIdPreSelecionado)}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  -- Selecione o Curso ao qual a disciplina pertence --
                </option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.codigo})
                  </option>
                ))}
              </select>
            )}
            {cursoIdPreSelecionado ? (
              <p className="text-[11px] text-slate-400">
                Curso fixado automaticamente pela matriz curricular em visualização.
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                Toda nova disciplina deve obrigatoriamente estar vinculada a um curso existente.
              </p>
            )}
          </div>

          {/* Nome */}
          <div>
            <label htmlFor="newNome" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Nome da Disciplina *
            </label>
            <input
              id="newNome"
              type="text"
              placeholder="Ex: Algoritmos e Programação II"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Código */}
            <div>
              <label htmlFor="newCodigo" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Código da Disciplina *
              </label>
              <input
                id="newCodigo"
                type="text"
                placeholder="Ex: CCET021"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Carga Horária */}
            <div>
              <label htmlFor="newCarga" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Carga Horária (horas) *
              </label>
              <input
                id="newCarga"
                type="number"
                min="1"
                value={cargaHoraria}
                onChange={(e) => setCargaHoraria(Number(e.target.value))}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 font-mono transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tipo */}
            <div>
              <label htmlFor="newTipo" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Tipo
              </label>
              <select
                id="newTipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoDisciplina)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Obrigatória">Obrigatória</option>
                <option value="Optativa">Optativa</option>
                <option value="Eletiva">Eletiva</option>
              </select>
            </div>

            {/* Período Ideal */}
            <div>
              <label htmlFor="newPeriodo" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Período Ideal
              </label>
              <select
                id="newPeriodo"
                value={periodoIdeal}
                onChange={(e) => setPeriodoIdeal(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num}º Período
                  </option>
                ))}
                <option value={0}>Sem período fixo</option>
              </select>
            </div>

            {/* Créditos */}
            <div>
              <label htmlFor="newCreditos" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Créditos
              </label>
              <input
                id="newCreditos"
                type="number"
                min="1"
                value={creditos}
                onChange={(e) => setCreditos(Number(e.target.value))}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3.5 py-2 font-mono text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Pré-requisitos */}
          <div>
            <label htmlFor="newPreReqs" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Pré-requisitos
            </label>
            <input
              id="newPreReqs"
              type="text"
              placeholder="Ex: Introdução à Programação (CCET011), Álgebra Linear (CCET012)"
              value={preRequisitos}
              onChange={(e) => setPreRequisitos(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Ementa */}
          <div>
            <label htmlFor="newEmenta" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Ementa Curricular Oficial
            </label>
            <textarea
              id="newEmenta"
              rows={4}
              placeholder="Descreva a ementa oficial da disciplina..."
              value={ementa}
              onChange={(e) => setEmenta(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 custom-scrollbar transition-colors"
            />
          </div>

          

          {/* Unidade Acadêmica (Hidden default value, customizable) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="newUnidade" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Unidade Acadêmica / Departamento
              </label>
              <input
                id="newUnidade"
                type="text"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="newNotaMin" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Média Mínima para Aprovação
              </label>
              <input
                id="newNotaMin"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={notaMinimaAprovacao}
                onChange={(e) => setNotaMinimaAprovacao(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>
        </form>

        {/* Rodapé do Modal */}
        <div className="p-4 md:p-6 bg-slate-950 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-900/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Cadastrar Disciplina'}
          </button>
        </div>
      </div>
    </div>
  );
};
