# Diretório de Rotas (`src/routes`)

Esta pasta é responsável por centralizar toda a configuração e mapeamento de navegação declarativa da aplicação utilizando **React Router Dom**.

## Finalidade e Arquitetura
- **Mapeamento de Domínio:** As rotas são nomeadas em **português** para refletir estritamente o domínio acadêmico do ementário (ex: `/cursos`, `/cursos/:cursoId/disciplinas`, `/disciplinas`).
- **Desacoplamento:** Mantém a lógica de roteamento e redirecionamento isolada dos componentes estruturais de layout e páginas.

## Tipos de Arquivos Armazenados
- **Arquivos de Definição de Rotas (`.tsx`):** Componentes como `index.tsx` que retornam a árvore de `<Routes>` e `<Route>`.
- **Guardas de Rota / Middlewares de Navegação:** Componentes de autenticação, autorização ou carregamento prévio (*loaders*) relacionados às transições de tela.
