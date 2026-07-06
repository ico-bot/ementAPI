/**
 * @file App.tsx
 * @description Componente raiz da aplicação coordenando layout principal e navegação por abas via React Router Dom.
 */

import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AppRoutes } from './routes';
import { MainLayout } from './shared/components/layout/MainLayout';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDisciplinasCursoRoute = location.pathname.includes('/disciplinas') && location.pathname !== '/disciplinas';

  // Verifica estado de autenticação simplificado para sincronia de render
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const username = localStorage.getItem('username') || '';

  const handleLogout = (): void => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <MainLayout hideHeader={location.pathname === '/login'}>
      {/* Barra de Navegação Superior por Abas - Ocultada na tela de login */}
      {location.pathname !== '/login' && (
        <nav className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
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

            <NavLink
              to="/docentes"
              className={({ isActive }) =>
                `px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30 border border-purple-400/30 font-bold'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`
              }
            >
              Corpo Docente
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30 border border-purple-400/30 font-bold'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`
                }
              >
                Painel Admin
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {isDisciplinasCursoRoute && (
              <span className="text-xs text-purple-300 hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-800/50 animate-fade-in font-mono">
                Matriz Específica Selecionada
              </span>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
                {/* Profile Badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-purple-300"> {username} </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 transition-all cursor-pointer"
                >
                  Sair
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30 border border-purple-400/30 font-bold'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`
                }
              >
                Entrar
              </NavLink>
            )}
          </div>
        </nav>
      )}

      {/* Renderização de Telas declarativas */}
      <div className="pt-6">
        <AppRoutes />
      </div>
    </MainLayout>
  );
}

export default App;

