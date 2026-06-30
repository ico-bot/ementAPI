# Componentes Visuais do Módulo de Disciplinas (`src/modules/disciplinas/components`)

Esta pasta contém os componentes de interface React estruturados de forma modular e organizados por categoria funcional.

## Estrutura de Diretórios
* **`list/`**: Componentes de exibição em lista ou cards (`DisciplinasTable`, `DisciplinaCard`).
* **`modals/`**: Modais de interatividade, detalhes e formulários (`EditDisciplinaModal`, `DisciplinaDetailModal`, `DeleteConfirmationModal`).
* **`matriz-curricular/`**: Componentes exclusivos da visualização em grade por período (`MatrizCurricularGrid`, `CurriculoHeader`).

> **Nota de Arquitetura:** Componentes genéricos de UI (como paginação) foram promovidos para `src/shared/components/ui/`.
