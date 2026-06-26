/**
 * @file index.tsx
 * @description Árvore central de rotas da aplicação, definindo as URLs acadêmicas e os componentes de página correspondentes.
 */

import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CursosListPage } from '../modules/cursos/pages/CursosListPage';
import { DisciplinasGlobalPage } from '../modules/disciplinas/pages/DisciplinasGlobalPage';
import { DisciplinasPage } from '../modules/disciplinas/pages/DisciplinasPage';

/**
 * @component AppRoutes
 * @description Renderiza o roteador declarativo conectando caminhos de URL aos módulos de Cursos e Disciplinas.
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirecionamento da raiz para o catálogo de cursos */}
      <Route path="/" element={<Navigate to="/cursos" replace />} />

      {/* Rota principal de listagem do catálogo de cursos */}
      <Route path="/cursos" element={<CursosListPage />} />

      {/* Rota da matriz curricular de um curso específico */}
      <Route path="/cursos/:cursoId/disciplinas" element={<DisciplinasPage />} />

      {/* Rota global de todas as disciplinas da instituição */}
      <Route path="/disciplinas" element={<DisciplinasGlobalPage />} />

      {/* Fallback (404): Redireciona caminhos inexistentes para a página inicial */}
      <Route path="*" element={<Navigate to="/cursos" replace />} />
    </Routes>
  );
};
