/**
 * @file App.tsx
 * @description Componente raiz da aplicação coordenando layout principal e navegação entre módulos.
 */

import { useState } from 'react';
import { CursosListPage } from './modules/cursos/pages/CursosListPage';
import { createCurso } from './modules/cursos/services/cursosService';
import type { CursoInput } from './modules/cursos/services/types';
import { MainLayout } from './shared/components/layout/MainLayout';
import { Button } from './shared/components/ui/Button';
import { Modal } from './shared/components/ui/Modal';

function App() {
  const [isNewCursoModalOpen, setIsNewCursoModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [formData, setFormData] = useState<CursoInput>({
    nome: '',
    codigo: '',
    cargaHoraria: 3200,
    descricao: '',
  });

  const handleOpenModal = () => setIsNewCursoModalOpen(true);
  const handleCloseModal = () => setIsNewCursoModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cargaHoraria' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createCurso(formData);
      setRefreshKey((prev) => prev + 1);
      handleCloseModal();
      setFormData({ nome: '', codigo: '', cargaHoraria: 3200, descricao: '' });
    } catch (error) {
      console.error('Erro ao criar curso:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout onNewCursoClick={handleOpenModal}>
      <CursosListPage key={refreshKey} onSelectCurso={(id) => alert(`Exibindo disciplinas do curso ID: ${id}`)} />

      <Modal isOpen={isNewCursoModalOpen} onClose={handleCloseModal} title="Cadastrar Novo Curso">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="nome" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
              Nome do Curso
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              placeholder="ex: Engenharia de Software"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="codigo" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                Código
              </label>
              <input
                id="codigo"
                name="codigo"
                type="text"
                required
                placeholder="ex: ESOFT001"
                value={formData.codigo}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm font-mono"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="cargaHoraria"
                className="block text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Carga Horária (h)
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="descricao" className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows={3}
              placeholder="Resumo dos objetivos do curso..."
              value={formData.descricao}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Salvar Curso
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default App;
