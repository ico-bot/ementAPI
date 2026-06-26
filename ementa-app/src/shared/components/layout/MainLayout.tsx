/**
 * @file MainLayout.tsx
 * @description Layout base encapsulando o container estilizado padrão para as telas da aplicação.
 */

import React from 'react';
import { Header } from './Header';

export interface MainLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, hideHeader = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 p-8 font-sans antialiased selection:bg-purple-600 selection:text-white">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {!hideHeader && <Header />}
        <main>{children}</main>
      </div>
    </div>
  );
};
