/**
 * @file App.tsx
 * @description Componente raiz da aplicação coordenando layout principal e navegação por abas via React Router Dom.
 */

import { NavLink, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';
import { MainLayout } from './shared/components/layout/MainLayout';

function App() {
  const location = useLocation();
  const isDisciplinasCursoRoute = location.pathname.includes('/disciplinas') && location.pathname !== '/disciplinas';

  return (
    <MainLayout>
      {/* Barra de Navegação Superior por Abas */}
      <nav className="flex items-center gap-2 pb-6 border-b border-slate-800/80">
        <NavLink
          to="/cursos"
          className={({ isActive }) =>
            `px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
              isActive || isDisciplinasCursoRoute
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30 border border-purple-400/30 font-bold'
                : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`
          }
        >
          Catálogo de Cursos
        </NavLink>

        <NavLink
          to="/disciplinas"
          end
          className={({ isActive }) =>
            `px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
              isActive && !isDisciplinasCursoRoute
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30 border border-purple-400/30 font-bold'
                : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`
          }
        >
          Todas as Disciplinas
        </NavLink>

        {isDisciplinasCursoRoute && (
          <span className="text-xs text-purple-300 ml-auto hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-800/50 animate-fade-in font-mono">
            Matriz Específica Selecionada
          </span>
        )}
      </nav>

      {/* Renderização de Telas declarativas */}
      <div className="pt-6">
        <AppRoutes />
      </div>
    </MainLayout>
  );
}

export default App;

