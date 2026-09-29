# Módulo de Docentes

Este módulo é responsável por gerenciar e visualizar todo o corpo docente da instituição no Front-End da aplicação.

## Estrutura de Pastas

- **`components/`**: Componentes visuais específicos de docentes, como cards (`DocenteCard`), barras de filtro (`DocentesFilterBar`) e modais detalhados (`DocenteDetailModal`).
- **`pages/`**: Páginas de navegação declarativa do módulo, como a página principal de listagem do catálogo de docentes (`DocentesListPage`).
- **`services/`**: Camada de integração de dados assíncrona, contendo chamadas à API REST Django (`/api/docentes/` e `/api/docente-disciplinas/`), dados de mock locais de fallback e tipagens estritas em TypeScript simétricas ao modelo `Docente` e `DocenteDisciplina` do Back-End.
