/**
 * @file AdminDashboardPage.tsx
 * @description Página do Painel Administrativo institucional, exibindo métricas globais de sincronização e atalhos de gestão.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardOverview } from '../services/dashboardService';
import type { DashboardOverviewFrontend } from '../services/types';
import { getLoggedUser } from '../../login/services/authService';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardOverviewFrontend | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const username = getLoggedUser() || 'Administrador';

  const loadDashboardData = () => {
    setIsLoading(true);
    setError(null);
    fetchDashboardOverview()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError('Não foi possível carregar os dados do painel institucional. Verifique a conexão com a API Back-End e tente novamente.');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === 'Sincronizado!') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          {status}
        </span>
      );
    }
    if (status === 'Manual') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
          {status}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Cabeçalho do Painel */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 p-6 sm:p-8 border border-purple-500/30 shadow-[0_0_50px_-15px_rgba(168,85,247,0.25)]">
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/40 flex items-center gap-1.5">
                Administrador Institucional
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono border border-emerald-500/20">
                Sincronizado • /api/dashboard/
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Painel de Controle Institucional
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Bem-vindo, <strong className="text-purple-300">{username}</strong>. Acompanhe a saúde de sincronização com o SIGAA/UFAC, gerencie catálogos e monitore atualizações de ementas.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Atualizar Dados
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Métricas */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 md:p-12 text-center rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-4 animate-fade-in shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold border border-rose-500/20 shadow-inner">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-rose-200">Falha ao Carregar Painel</h3>
            <p className="text-sm text-rose-300/80 leading-relaxed">
              {error}
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={loadDashboardData}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all active:scale-95 shadow-lg shadow-rose-900/30 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tentar Novamente
            </button>
          </div>
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Cursos */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/30 transition-all shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">Total de Cursos</span>
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-white font-mono">{data.metricas.totalCursos}</span>
                <span className="text-[11px] text-slate-400 block mt-1">Catálogo institucional</span>
              </div>
            </div>

            {/* Card 2: Sincronizados */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">Sincronizados</span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">{data.metricas.sincronizados}</span>
                <span className="text-[11px] text-emerald-500/80 block mt-1">Conectados à UFAC</span>
              </div>
            </div>

            {/* Card 3: Desatualizados */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/30 transition-all shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">Pendentes / Desatualizados</span>
                <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-rose-400 font-mono">{data.metricas.desatualizados}</span>
                <span className="text-[11px] text-rose-500/80 block mt-1">Requerem revisão</span>
              </div>
            </div>

            {/* Card 4: Inseridos Manualmente */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">Edições Manuais</span>
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-amber-300 font-mono">{data.metricas.inseridosManualmente}</span>
                <span className="text-[11px] text-amber-400/80 block mt-1">Protegidos de sobrescrita</span>
              </div>
            </div>
          </div>

          {/* Seção de Acesso Rápido para Gestão */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-200">
              Acesso Rápido para Gestão
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => navigate('/cursos')}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-purple-950/20 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group flex items-center justify-between shadow-md"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                    Gerenciar Cursos e PPCs
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Consultar matrizes, projetos pedagógicos e coordenadores.
                  </p>
                </div>
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>

              <div
                onClick={() => navigate('/disciplinas')}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-indigo-950/20 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group flex items-center justify-between shadow-md"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    Catálogo de Disciplinas
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Inspecionar ementas, bibliografias e cargas horárias.
                  </p>
                </div>
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>

              <div
                onClick={() => navigate('/docentes')}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/20 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group flex items-center justify-between shadow-md"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    Corpo Docente e Vínculos
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verificar atribuições de matérias e cargas didáticas.
                  </p>
                </div>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </div>

          {/* Tabela de Log de Atividade Recente */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-200">
                Atividade Recente no Ementário
              </h2>
              {data.ultimaSincronizacao && (
                <span className="text-xs font-mono text-slate-400">
                  Última varredura: {new Date(data.ultimaSincronizacao).toLocaleString('pt-BR')}
                </span>
              )}
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/50">
                      <th className="py-3 px-4">Código</th>
                      <th className="py-3 px-4">Disciplina</th>
                      <th className="py-3 px-4">Unidade / Centro</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {data.atividadeRecente.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-purple-300">
                          {item.codigo}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-200">
                          {item.titulo}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {item.area}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {getStatusBadge(item.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
