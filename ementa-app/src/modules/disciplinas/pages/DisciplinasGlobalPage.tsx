/**
 * @file DisciplinasGlobalPage.tsx
 * @description Tela completa do Catálogo Geral de Disciplinas com barra de buscas, paginação e modais integrados.
 */

import React, { useEffect, useState } from 'react';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { DisciplinaDetailModal } from '../components/modals/DisciplinaDetailModal';
import { NewDisciplinaModal } from '../components/modals/NewDisciplinaModal';
import { DisciplinasTable } from '../components/list/DisciplinasTable';
import { EditDisciplinaModal } from '../components/modals/EditDisciplinaModal';
import { Pagination } from '../../../shared/components/ui/Pagination';
import { useCursos } from '../../../shared/hooks/queries/useCursosQuery';
import { useDisciplinasGlobalPaginated } from '../../../shared/hooks/queries/useDisciplinasQuery';
import {
  useCreateDisciplinaMutation,
  useUpdateDisciplinaGlobalMutation,
  useDeleteDisciplinaGlobalMutation,
} from '../../../shared/hooks/queries/useDisciplinasMutations';
import type { DisciplinaGlobalItem, NivelDisciplina, StatusDisciplina, Disciplina } from '../services/types';

export const DisciplinasGlobalPage: React.FC = () => {
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string | 'Todos'>('Todos');
  const [selectedLevel, setSelectedLevel] = useState<NivelDisciplina | 'Todos'>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<StatusDisciplina | 'Todos'>('Todos');
  const [selectedCursoId, setSelectedCursoId] = useState<string | 'Todos'>('Todos');

  // Modal selection states
  const [detailsModalDisciplina, setDetailsModalDisciplina] = useState<DisciplinaGlobalItem | null>(null);
  const [editModalDisciplina, setEditModalDisciplina] = useState<DisciplinaGlobalItem | null>(null);
  const [deleteModalDisciplina, setDeleteModalDisciplina] = useState<DisciplinaGlobalItem | null>(null);

  // Cadastro modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  const { data, isLoading: isCatalogLoading, error: catalogError, refetch } = useDisciplinasGlobalPaginated(
    currentPage,
    itemsPerPage,
    {
      termo: searchTerm,
      area: selectedArea,
      nivel: selectedLevel,
      status: selectedStatus,
      cursoId: selectedCursoId,
    }
  );
  const { data: cursosData } = useCursos();
  const createDisciplinaMutation = useCreateDisciplinaMutation();
  const updateDisciplinaMutation = useUpdateDisciplinaGlobalMutation();
  const deleteDisciplinaMutation = useDeleteDisciplinaGlobalMutation();

  const disciplinas = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;
  const cursos = cursosData || [];
  const isLoading = isCatalogLoading;
  const error = catalogError ? 'Não foi possível carregar o catálogo geral de disciplinas. Verifique se o Back-End está em execução e tente novamente.' : null;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedArea, selectedLevel, selectedStatus, selectedCursoId]);

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newCount: number): void => {
    setItemsPerPage(newCount);
    setCurrentPage(1);
  };

  const handleSaveEdit = async (updatedItem: DisciplinaGlobalItem): Promise<void> => {
    await updateDisciplinaMutation.mutateAsync(updatedItem);
    if (detailsModalDisciplina?.id === updatedItem.id) {
      setDetailsModalDisciplina(updatedItem);
    }
  };

  const handleSaveNewDisciplina = async (newDisc: Omit<Disciplina, 'id'>, cursoId: string): Promise<void> => {
    try {
      await createDisciplinaMutation.mutateAsync({ cursoId, disciplina: newDisc });
      setCurrentPage(1);
    } catch (error) {
      console.error('Erro ao criar disciplina no catálogo global:', error);
    }
  };

  const handleConfirmDelete = async (itemToDelete: DisciplinaGlobalItem): Promise<void> => {
    await deleteDisciplinaMutation.mutateAsync(itemToDelete.id);
    const newTotalItems = totalItems - 1;
    const maxPage = Math.ceil(newTotalItems / itemsPerPage) || 1;
    const nextPage = Math.min(currentPage, maxPage);
    if (nextPage !== currentPage) {
      setCurrentPage(nextPage);
    }
  };

  const handleResetFilters = (): void => {
    setSearchTerm('');
    setSelectedArea('Todos');
    setSelectedLevel('Todos');
    setSelectedStatus('Todos');
    setSelectedCursoId('Todos');
  };

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Catálogo Geral de Disciplinas
            {!isLoading && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-purple-300 font-mono font-semibold border border-purple-500/20">
                {totalItems}
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Repositório centralizado de todos os componentes curriculares ofertados na instituição
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-purple-600/20 border border-purple-500/30 transition-all duration-200 cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            Nova Disciplina
          </button>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="searchGlobalInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Buscar Código ou Nome
            </label>
            <input
              id="searchGlobalInput"
              type="text"
              placeholder="Ex: BSI101 ou Cálculo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 text-white placeholder-slate-500 text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="cursoFilterSelect" className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
              Curso Vinculado
            </label>
            <select
              id="cursoFilterSelect"
              value={selectedCursoId}
              onChange={(e) => setSelectedCursoId(e.target.value)}
              className="w-full bg-slate-950/80 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Todos">Todos os Cursos</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} ({c.codigo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="areaFilterSelect" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Área de Conhecimento
            </label>
            <select
              id="areaFilterSelect"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-slate-950/80 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Todos">Todas as Áreas</option>
              <option value="Ciências Exactas e Tecnológicas">Ciências Exactas e Tecnológicas</option>
              <option value="Ciências Exatas e da Terra">Ciências Exatas e da Terra</option>
              <option value="Ciências da Saúde e Biológicas">Ciências da Saúde e Biológicas</option>
              <option value="Ciências Jurídicas e Sociais">Ciências Jurídicas e Sociais</option>
              <option value="Ciências Humanas e Letras">Ciências Humanas e Letras</option>
              <option value="Ciências Agrárias">Ciências Agrárias</option>
              <option value="Multidisciplinar">Multidisciplinar</option>
            </select>
          </div>

          <div>
            <label htmlFor="levelFilterSelect" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Nível
            </label>
            <select
              id="levelFilterSelect"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as NivelDisciplina | 'Todos')}
              className="w-full bg-slate-950/80 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Todos">Todos os Níveis</option>
              <option value="Graduação">Graduação</option>
              <option value="Pós-Graduação">Pós-Graduação</option>
            </select>
          </div>

          <div>
            <label htmlFor="statusFilterSelect" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Status
            </label>
            <select
              id="statusFilterSelect"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as StatusDisciplina | 'Todos')}
              className="w-full bg-slate-950/80 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Em atividade">Em atividade</option>
              <option value="Inativo">Inativo</option>
              <option value="Suspenso">Suspenso</option>
            </select>
          </div>
        </div>

        {(searchTerm !== '' || selectedCursoId !== 'Todos' || selectedArea !== 'Todos' || selectedLevel !== 'Todos' || selectedStatus !== 'Todos') && (
          <div className="flex justify-end pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4 cursor-pointer font-medium"
            >
              ✕ Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Tabela Principal e Paginação ou Erro */}
      {error ? (
        <div className="p-8 md:p-12 text-center rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-4 animate-fade-in shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold border border-rose-500/20 shadow-inner">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-rose-200">Falha ao Carregar Catálogo</h3>
            <p className="text-sm text-rose-300/80 leading-relaxed">
              {error}
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all active:scale-95 shadow-lg shadow-rose-900/30 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tentar Novamente
            </button>
          </div>
        </div>
      ) : (
        <>
          <DisciplinasTable
            disciplinas={disciplinas}
            isLoading={isLoading}
            onViewDetailsClick={(disc) => setDetailsModalDisciplina(disc)}
            onEditClick={(disc) => setEditModalDisciplina(disc)}
            onDeleteClick={(disc) => setDeleteModalDisciplina(disc)}
          />

          {!isLoading && totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </>
      )}

      {/* Modais */}
      <DisciplinaDetailModal
        disciplina={detailsModalDisciplina}
        isOpen={Boolean(detailsModalDisciplina)}
        onClose={() => setDetailsModalDisciplina(null)}
        onEditClick={(disc) => setEditModalDisciplina(disc)}
      />

      <EditDisciplinaModal
        disciplina={editModalDisciplina}
        isOpen={Boolean(editModalDisciplina)}
        onClose={() => setEditModalDisciplina(null)}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmationModal
        disciplina={deleteModalDisciplina}
        isOpen={Boolean(deleteModalDisciplina)}
        onClose={() => setDeleteModalDisciplina(null)}
        onConfirm={handleConfirmDelete}
      />

      <NewDisciplinaModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSaveNewDisciplina}
      />
    </section>
  );
};
