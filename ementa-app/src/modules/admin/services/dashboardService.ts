/**
 * @file dashboardService.ts
 * @description Serviço assíncrono para buscar dados estatísticos institucionais do endpoint /api/dashboard/ no Django, com fallback em memória.
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
 * Dados de fallback offline para simulação de desenvolvimento.
 */
const MOCK_DASHBOARD_DATA: DashboardOverviewFrontend = {
  ultimaSincronizacao: new Date().toISOString(),
  metricas: {
    totalCursos: 42,
    sincronizados: 38,
    desatualizados: 3,
    inseridosManualmente: 1,
  },
  atividadeRecente: [
    {
      codigo: 'BSI101',
      titulo: 'Algoritmos e Estruturas de Dados I',
      area: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      status: 'Sincronizado!',
    },
    {
      codigo: 'DIR204',
      titulo: 'Direito Constitucional Avançado',
      area: 'Centro de Ciências Jurídicas - CCJ',
      status: 'Manual',
    },
    {
      codigo: 'MED305',
      titulo: 'Anatomia Humana e Patologia',
      area: 'Centro de Ciências da Saúde e do Esporte - CCSE',
      status: 'Sincronizado!',
    },
    {
      codigo: 'PED102',
      titulo: 'Psicologia da Educação e Aprendizagem',
      area: 'Centro de Educação, Letras e Artes - CELA',
      status: 'Desatualizado',
    },
    {
      codigo: 'AGR401',
      titulo: 'Manejo de Solos e Sustentabilidade',
      area: 'Centro de Ciências Biológicas e da Natureza - CCBN',
      status: 'Sincronizado!',
    },
  ],
};

/**
 * Busca o painel de monitoramento do Back-End (/api/dashboard/).
 */
export async function fetchDashboardOverview(): Promise<DashboardOverviewFrontend> {
  try {
    const response = await apiClient<DashboardOverviewDto>('/dashboard/');
    if (response && response.metrics) {
      return mapDashboardDtoToFrontend(response);
    }
  } catch (error) {
    console.warn('Falha ao conectar com /api/dashboard/. Usando fallback em memória:', error);
  }

  // Fallback em memória
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_DASHBOARD_DATA;
}
