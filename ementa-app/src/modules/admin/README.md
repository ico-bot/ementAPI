# Módulo Administrativo (`/admin`)

Este módulo é responsável por concentrar as funcionalidades do **Painel Administrativo Institucional** do sistema EmentAPI.
O acesso é restrito exclusivamente a usuários com privilégios de **Administrador** (`is_staff: true`).

## Estrutura de Arquivos

* `pages/`: Componentes de página do painel administrativo (ex: `AdminDashboardPage.tsx`).
* `services/`: Serviços e definições de tipos para comunicação com endpoints de monitoramento e relatórios do Back-End (ex: `/api/dashboard/`).
* `components/`: Componentes visuais específicos do painel (cartões de métricas, gráficos, tabelas de logs e controle de sincronização).
