/**
 * @file Pagination.tsx
 * @description Componente de paginação flexível e moderno construído com Tailwind CSS para navegação em grandes conjuntos de dados.
 */

import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
  onItemsPerPageChange?: (newCount: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <span
            key={`dots-${index}`}
            className="px-3 py-1.5 text-xs text-slate-500 font-mono select-none"
          >
            ...
          </span>
        );
      }

      const isCurrent = page === currentPage;
      return (
        <button
          key={`page-${page}`}
          type="button"
          onClick={() => onPageChange(Number(page))}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer active:scale-95 ${
            isCurrent
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40 border border-purple-400/30 font-bold'
              : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60'
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg animate-fade-in">
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span>
          Exibindo <strong className="text-slate-200 font-mono">{startItem}</strong> a{' '}
          <strong className="text-slate-200 font-mono">{endItem}</strong> de{' '}
          <strong className="text-purple-300 font-mono">{totalItems}</strong> disciplinas
        </span>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
            <label htmlFor="itemsPerPageSelect" className="text-slate-500 hidden md:inline">
              Por página:
            </label>
            <select
              id="itemsPerPageSelect"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700/60 inline-flex items-center gap-1 cursor-pointer"
        >
          &larr; <span className="hidden xs:inline">Anterior</span>
        </button>

        <div className="flex items-center gap-1 mx-1">{renderPageNumbers()}</div>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700/60 inline-flex items-center gap-1 cursor-pointer"
        >
          <span className="hidden xs:inline">Próxima</span> &rarr;
        </button>
      </div>
    </div>
  );
};
