# Hooks de Consultas e Mutações Reativas (TanStack Query)

Este diretório centraliza todos os hooks customizados de consulta (`useQuery`) e mutação (`useMutation`) utilizando a biblioteca **TanStack Query** (ex-React Query).

## Responsabilidade
- Isolar a lógica de busca assíncrona, paginação, cache em memória e revalidação em segundo plano.
- Prover hooks customizados reativos de leitura (ex: `useCursosPaginated`, `useDocentesPaginated`, `useDisciplinasGlobalPaginated`) para consumo direto em tabelas e listagens.
- Prover hooks customizados reativos de escrita e exclusão (ex: `useCreateCursoMutation`, `useUpdateDocenteMutation`, `useDeleteDisciplinaGlobalMutation`) que gerenciam estados de carregamento e invalidam o cache automaticamente (`queryClient.invalidateQueries`).
- Reduzir drasticamente o boilerplate de `useState` e `useEffect` nos componentes de UI, garantindo separação de conceitos, simplicidade, sincronização de dados com o Back-End Django e alta performance.
