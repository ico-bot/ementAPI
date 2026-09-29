/**
 * @file types.ts
 * @description Definições de tipos e interfaces para os dados do Painel Administrativo.
 */

export interface DashboardMetricsDto {
  total_cursos: number;
  sincronizados: number;
  desatualizados: number;
  inseridos_manualmente: number;
}

export interface RecentActivityDto {
  code: string;
  title: string;
  area: string;
  status: string;
}

export interface DashboardOverviewDto {
  last_sync: string | null;
  metrics: DashboardMetricsDto;
  recent_activity: RecentActivityDto[];
}

export interface DashboardMetricsFrontend {
  totalCursos: number;
  sincronizados: number;
  desatualizados: number;
  inseridosManualmente: number;
}

export interface RecentActivityFrontend {
  codigo: string;
  titulo: string;
  area: string;
  status: string;
}

export interface DashboardOverviewFrontend {
  ultimaSincronizacao: string | null;
  metricas: DashboardMetricsFrontend;
  atividadeRecente: RecentActivityFrontend[];
}
