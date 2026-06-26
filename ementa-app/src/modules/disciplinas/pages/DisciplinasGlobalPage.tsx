/**
 * @file DisciplinasGlobalPage.tsx
 * @description Tela completa do Catálogo Geral de Disciplinas com barra de buscas, paginação e modais integrados.
 */

import React, { useEffect, useState } from 'react';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { DisciplinaDetailModal } from '../components/modals/DisciplinaDetailModal';
import { DisciplinasTable } from '../components/list/DisciplinasTable';
import { EditDisciplinaModal } from '../components/modals/EditDisciplinaModal';
import { Pagination } from '../../../shared/components/ui/Pagination';
import { deleteDisciplinaGlobal, fetchDisciplinasGlobal, updateDisciplinaGlobal } from '../services/disciplinasService';
import type { DisciplinaGlobalItem, NivelDisciplina, StatusDisciplina } from '../services/types';

export const DisciplinasGlobalPage: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<DisciplinaGlobalItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string | 'Todos'>('Todos');
  const [selectedLevel, setSelectedLevel] = useState<NivelDisciplina | 'Todos'>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<StatusDisciplina | 'Todos'>('Todos');

  // Modal selection states
  const [detailsModalDisciplina, setDetailsModalDisciplina] = useState<DisciplinaGlobalItem | null>(null);
  const [editModalDisciplina, setEditModalDisciplina] = useState<DisciplinaGlobalItem | null>(null);
  const [deleteModalDisciplina, setDeleteModalDisciplina] = useState<DisciplinaGlobalItem | null>(null);

  const loadCatalog = async (pageToLoad = currentPage, limit = itemsPerPage): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetchDisciplinasGlobal(pageToLoad, limit, {
        termo: searchTerm,
        area: selectedArea,
        nivel: selectedLevel,
        status: selectedStatus,
      });

      setDisciplinas(response.items);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error('Erro ao buscar catálogo global:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCatalog(1, itemsPerPage); // Reinicia na página 1 ao alterar busca ou filtro
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedArea, selectedLevel, selectedStatus]);

  useEffect(() => {
    loadCatalog(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newCount: number): void => {
    setItemsPerPage(newCount);
    setCurrentPage(1);
  };

  const handleSaveEdit = async (updatedItem: DisciplinaGlobalItem): Promise<void> => {
    await updateDisciplinaGlobal(updatedItem);
    await loadCatalog(currentPage, itemsPerPage);
    if (detailsModalDisciplina?.id === updatedItem.id) {
      setDetailsModalDisciplina(updatedItem);
    }
  };

  const handleConfirmDelete = async (itemToDelete: DisciplinaGlobalItem): Promise<void> => {
    await deleteDisciplinaGlobal(itemToDelete.id);
    // Se a última disciplina da página for excluída e houver mais páginas, volta uma página
    const newTotalItems = totalItems - 1;
    const maxPage = Math.ceil(newTotalItems / itemsPerPage) || 1;
    const nextPage = Math.min(currentPage, maxPage);
    await loadCatalog(nextPage, itemsPerPage);
  };

  const handleResetFilters = (): void => {
    setSearchTerm('');
    setSelectedArea('Todos');
    setSelectedLevel('Todos');
    setSelectedStatus('Todos');
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
            onClick={() => console.log('Abrir modal de criação de nova disciplina')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-purple-600/20 border border-purple-500/30 transition-all duration-200 cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            Nova Disciplina
          </button>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {(searchTerm !== '' || selectedArea !== 'Todos' || selectedLevel !== 'Todos' || selectedStatus !== 'Todos') && (
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

      {/* Tabela Principal */}
      <DisciplinasTable
        disciplinas={disciplinas}
        isLoading={isLoading}
        onViewDetailsClick={(disc) => setDetailsModalDisciplina(disc)}
        onEditClick={(disc) => setEditModalDisciplina(disc)}
        onDeleteClick={(disc) => setDeleteModalDisciplina(disc)}
      />

      {/* Paginação */}
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
    </section>
  );
};
