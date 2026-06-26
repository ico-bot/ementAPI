/**
 * @file MainLayout.tsx
 * @description Layout base encapsulando o container estilizado padrão para as telas da aplicação.
 */

import React from 'react';
import { Header } from './Header';

export interface MainLayoutProps {
  children: React.ReactNode;
  onNewCursoClick?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, onNewCursoClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 p-8 font-sans antialiased selection:bg-purple-600 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <Header onNewCursoClick={onNewCursoClick} />
        <main>{children}</main>
      </div>
    </div>
  );
};
