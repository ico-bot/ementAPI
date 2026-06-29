/**
 * @file NewCursoModal.tsx
 * @description Modal dedicado ao cadastro de novos Cursos encapsulando todas as regras de validação e tipagens do módulo.
 */

import React, { useState } from 'react';
import { createCurso } from '../../services/cursosService';
import type { CursoInput, NivelCurso, StatusFuncionamento, TurnoCurso } from '../../services/types';
import { Button } from '../../../../shared/components/ui/Button';
import { Modal } from '../../../../shared/components/ui/Modal';

export interface NewCursoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormState: CursoInput = {
  nome: '',
  codigo: '',
  cargaHoraria: 3200,
  periodos: 8,
  funcionamento: 'Em atividade',
  nivel: 'Graduação',
  turno: 'Noturno',
  modalidade: 'Bacharelado',
  grauAcademico: '',
  areaConhecimento: 'Ciências Exatas e da Terra',
  descricao: '',
};

export const NewCursoModal: React.FC<NewCursoModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CursoInput>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cargaHoraria' || name === 'periodos' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createCurso(formData);
      setFormData(initialFormState);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar curso no módulo isolado:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cadastrar Novo Curso">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1 custom-scrollbar">
        {/* Nome do Curso */}
        <div className="space-y-1">
          <label htmlFor="nome" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
            Nome do Curso <span className="text-purple-400">*</span>
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            placeholder="ex: Bacharelado em Engenharia de Software"
            value={formData.nome}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm transition-all"
          />
        </div>

        {/* Código, Carga Horária e Períodos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label htmlFor="codigo" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
              Código <span className="text-purple-400">*</span>
            </label>
            <input
              id="codigo"
              name="codigo"
              type="text"
              required
              placeholder="ex: ESOFT001"
              value={formData.codigo}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm font-mono uppercase transition-all"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="cargaHoraria" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
              Carga (h) <span className="text-purple-400">*</span>
            </label>
            <input
              id="cargaHoraria"
              name="cargaHoraria"
              type="number"
              required
              min={100}
              max={10000}
              value={formData.cargaHoraria}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm font-mono transition-all"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="periodos" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
              Períodos
            </label>
            <input
              id="periodos"
              name="periodos"
              type="number"
              min={1}
              max={20}
              value={formData.periodos ?? ''}
              onChange={handleInputChange}
              placeholder="ex: 8"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm font-mono transition-all"
            />
          </div>
        </div>

        {/* Status, Nível e Turno */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="funcionamento" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
              Status
            </label>
            <select
              id="funcionamento"
              name="funcionamento"
              value={formData.funcionamento}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white focus:outline-none focus:border-purple-500 text-xs cursor-pointer transition-all"
            >
              {(['Em atividade', 'Inativo', 'Suspenso'] as StatusFuncionamento[]).map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-white">
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="nivel" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
              Nível
            </label>
            <select
              id="nivel"
              name="nivel"
              value={formData.nivel}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white focus:outline-none focus:border-purple-500 text-xs cursor-pointer transition-all"
            >
              {(['Graduação', 'Pós-Graduação'] as NivelCurso[]).map((nv) => (
                <option key={nv} value={nv} className="bg-slate-900 text-white">
                  {nv}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/*Turno, Modalidade*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="turno" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
              Turno
            </label>
            <select
              id="turno"
              name="turno"
              value={formData.turno}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white focus:outline-none focus:border-purple-500 text-xs cursor-pointer transition-all"
            >
              {(['Integral', 'Matutino', 'Vespertino', 'Noturno', 'Diurno'] as TurnoCurso[]).map((tr) => (
                <option key={tr} value={tr} className="bg-slate-900 text-white">
                  {tr}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="modalidade" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
              Modalidade
            </label>
            <select
              id="modalidade"
              name="modalidade"
              value={formData.modalidade}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white focus:outline-none focus:border-purple-500 text-xs cursor-pointer transition-all"
            >
              {[
                'Bacharelado',
                'Licenciatura',
                'Residência',
                'Especialização',
                'Mestrado Acadêmico',
                'Mestrado Profissional',
                'Doutorado',
                'ABI',
              ].map((mod) => (
                <option key={mod} value={mod} className="bg-slate-900 text-white">
                  {mod}
                </option>
              ))}
            </select>
          </div>


        {/* Grau Acadêmico, Área */}
        </div>
        <div className="space-y-1">
          <label htmlFor="grauAcademico" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
            Grau Acadêmico
          </label>
          <input
            id="grauAcademico"
            name="grauAcademico"
            type="text"
            placeholder="ex: Bacharel (opcional)"
            value={formData.grauAcademico}
            onChange={handleInputChange}
            className="w-full px-2.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm transition-all"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="areaConhecimento" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
            Área de Conhecimento
          </label>
          <input
            id="areaConhecimento"
            name="areaConhecimento"
            type="text"
            placeholder="ex: Ciências Exatas"
            value={formData.areaConhecimento}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm transition-all"
          />
        </div>

        {/* Descrição */}
        <div className="space-y-1">
          <label htmlFor="descricao" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
            Descrição / Objetivos
          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows={2}
            placeholder="Resumo da proposta pedagógica e perfil do egresso..."
            value={formData.descricao}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm resize-none transition-all"
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Cadastrar Curso
          </Button>
        </div>
      </form>
    </Modal>
  );
};
