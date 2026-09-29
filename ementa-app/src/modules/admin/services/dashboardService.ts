/**
 * @file dashboardService.ts
 * @description Serviço assíncrono para buscar dados estatísticos institucionais do endpoint /api/dashboard/ no Django.
 */

import { apiClient } from '../../../shared/services/apiClient';
import type {
  DashboardOverviewDto,
  DashboardOverviewFrontend,
} from './types';

/**
 * Mapeia o DTO do Back-End para a estrutura consumida pela interface do Front-End.
 */
function mapDashboardDtoToFrontend(dto: DashboardOverviewDto): DashboardOverviewFrontend {
  return {
    ultimaSincronizacao: dto.last_sync,
    metricas: {
      totalCursos: dto.metrics?.total_cursos ?? 0,
      sincronizados: dto.metrics?.sincronizados ?? 0,
      desatualizados: dto.metrics?.desatualizados ?? 0,
      inseridosManualmente: dto.metrics?.inseridos_manualmente ?? 0,
    },
    atividadeRecente: (dto.recent_activity ?? []).map((item) => ({
      codigo: item.code || 'SN',
      titulo: item.title || 'Sem título',
      area: item.area || 'Área não informada',
      status: item.status || 'Sincronizado!',
    })),
  };
}

/**
 * Busca o painel de monitoramento do Back-End (/api/dashboard/).
 */
export async function fetchDashboardOverview(): Promise<DashboardOverviewFrontend> {
  try {
    const response = await apiClient<DashboardOverviewDto>('/dashboard/');
    if (response && response.metrics) {
      return mapDashboardDtoToFrontend(response);
    }
    throw new Error('Formato de resposta inválido retornado pelo servidor no dashboard.');
  } catch (error) {
    console.error('Erro ao buscar dados do painel no Back-End (/api/dashboard/):', error);
    throw error;
  }
}
