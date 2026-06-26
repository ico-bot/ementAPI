# Módulo de Cursos (`src/modules/cursos`)

Este módulo encapsula toda a lógica de negócio, telas, componentes visuais específicos e serviços relacionados à gestão de **Cursos** e suas respectivas matrizes curriculares na plataforma EmentAPI.

## Estrutura de Pastas
- `components/`: Componentes visuais isolados estritamente ligados ao domínio de Cursos (ex: cards de curso, formulários de criação/edição).
- `pages/`: Telas e rotas principais do módulo (ex: Listagem de Cursos, Detalhes da Matriz Curricular).
- `services/`: Interfaces TypeScript de domínio (`types.ts`), dados simulados (`cursosMock.ts`) e chamadas assíncronas encapsuladas (`cursosService.ts`).
