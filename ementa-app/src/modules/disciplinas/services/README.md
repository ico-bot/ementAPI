# Camada de Serviços do Módulo de Disciplinas (`src/modules/disciplinas/services`)

Esta pasta armazena as tipagens estritas espelhando o Back-End (`models.py`), a base de dados simulada (`disciplinasMock.ts`) e o cliente de requisições assíncronas (`disciplinasService.ts`).

## Arquivos
* **`types.ts`**: Contém interfaces estritas sem o uso de `any` para `Disciplina`, `Curriculo` e filtros, modelando a realidade dos dados do ementário da UFAC.
* **`disciplinasMock.ts`**: Conjunto realista de matrizes curriculares e suas respectivas disciplinas divididas por período ideal.
* **`disciplinasService.ts`**: Funções assíncronas (`fetchDisciplinasByCurso`, `fetchDisciplinaById`) com latência artificial para emular chamadas à API REST.
