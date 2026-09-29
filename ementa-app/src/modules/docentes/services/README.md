# Serviços do Módulo de Docentes

Este diretório contém a camada de serviços assíncronos e tipagens do domínio de Docentes.

## Arquivos

- **`types.ts`**: Definições estritas em TypeScript simétricas ao arquivo `base_ementario/models.py` do Back-End Django, incluindo interfaces de `Docente`, `DocenteDisciplinaVinculo` e seleções literais (`TitulacaoDocente`, `CargoDocente`).
- **`docentesMock.ts`**: Conjunto de dados estruturados em memória utilizados para simulação em desenvolvimento local e como fallback resiliente quando a API Back-End estiver indisponível.
- **`docentesService.ts`**: Funções de consumo da API REST (`fetchDocentes`, `fetchDocenteById`, `fetchDisciplinasByDocenteId`) integrando com `/api/docentes/` e `/api/docente-disciplinas/`.
