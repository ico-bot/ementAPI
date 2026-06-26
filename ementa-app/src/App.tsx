/**
 * @file App.tsx
 * @description Componente raiz da aplicação coordenando layout principal e navegação dinâmica entre Cursos e Disciplinas.
 */

import { useState } from 'react';
import { CursosListPage } from './modules/cursos/pages/CursosListPage';
import { DisciplinasGlobalPage } from './modules/disciplinas/pages/DisciplinasGlobalPage';
import { DisciplinasPage } from './modules/disciplinas/pages/DisciplinasPage';
import { MainLayout } from './shared/components/layout/MainLayout';

type ActiveView = 'cursos' | 'disciplinasCurso' | 'disciplinasGlobal';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('cursos');
  const [selectedCursoId, setSelectedCursoId] = useState<string | null>(null);

  const handleSelectCurso = (cursoId: string) => {
    setSelectedCursoId(cursoId);
    setActiveView('disciplinasCurso');
  };

  const handleBackToCursos = () => {
    setSelectedCursoId(null);
    setActiveView('cursos');
  };

  return (
    <MainLayout>
      {/* Barra de Navegação Superior por Abas */}
      <nav className="flex items-center gap-2 pb-6 border-b border-slate-800/80">
        <button
          type="button"
          onClick={() => setActiveView('cursos')}
          className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
            activeView === 'cursos' || activeView === 'disciplinasCurso'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30 border border-purple-400/30 font-bold'
              : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          🎓 Catálogo de Cursos
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedCursoId(null);
            setActiveView('disciplinasGlobal');
          }}
          className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
            activeView === 'disciplinasGlobal'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30 border border-purple-400/30 font-bold'
              : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          📚 Todas as Disciplinas (Geral)
        </button>

        {activeView === 'disciplinasCurso' && (
          <span className="text-xs text-purple-300 ml-auto hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-800/50 animate-fade-in font-mono">
            Matriz Específica Selecionada
          </span>
        )}
      </nav>

      {/* Renderização de Telas */}
      <div className="pt-6">
        {activeView === 'cursos' && <CursosListPage onSelectCurso={handleSelectCurso} />}
        {activeView === 'disciplinasCurso' && (
          <DisciplinasPage
            cursoId={selectedCursoId || '1'}
            onBackClick={handleBackToCursos}
          />
        )}
        {activeView === 'disciplinasGlobal' && <DisciplinasGlobalPage />}
      </div>
    </MainLayout>
  );
}

export default App;

