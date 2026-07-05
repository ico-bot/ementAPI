/**
 * @file index.tsx
 * @description Árvore central de rotas da aplicação, definindo as URLs acadêmicas e os componentes de página correspondentes.
 */

import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CursosListPage } from '../modules/cursos/pages/CursosListPage';
import { DisciplinasGlobalPage } from '../modules/disciplinas/pages/DisciplinasGlobalPage';
import { DisciplinasPage } from '../modules/disciplinas/pages/DisciplinasPage';
import { DocentesListPage } from '../modules/docentes/pages/DocentesListPage';
import { LoginPage } from '../modules/login/pages/LoginPage';
import { AdminDashboardPage } from '../modules/admin/pages/AdminDashboardPage';
import { isAuthenticated } from '../modules/login/services/authService';

/**
 * @component AppRoutes
 * @description Renderiza o roteador declarativo conectando caminhos de URL aos módulos de Cursos e Disciplinas.
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirecionamento da raiz para a tela de login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rota de login do sistema */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rota principal de listagem do catálogo de cursos */}
      <Route path="/cursos" element={<CursosListPage />} />

      {/* Rota da matriz curricular de um curso específico */}
      <Route path="/cursos/:cursoId/disciplinas" element={<DisciplinasPage />} />

      {/* Rota global de todas as disciplinas da instituição */}
      <Route path="/disciplinas" element={<DisciplinasGlobalPage />} />

      {/* Rota do catálogo de corpo docente da instituição */}
      <Route path="/docentes" element={<DocentesListPage />} />

      {/* Rota protegida do painel administrativo institucional */}
      <Route
        path="/admin"
        element={isAuthenticated() ? <AdminDashboardPage /> : <Navigate to="/login" replace />}
      />

      {/* Fallback (404): Redireciona caminhos inexistentes para a página inicial */}
      <Route path="*" element={<Navigate to="/cursos" replace />} />
    </Routes>
  );
};
