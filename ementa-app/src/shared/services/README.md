# Serviços Compartilhados (`src/shared/services`)

Contém clientes HTTP (ex: Axios ou Fetch wrappers), interceptores, tratamento de erros globais e simuladores assíncronos (mocks) utilizados por múltiplos módulos da aplicação.

## Arquivos
- `apiClient.ts`: Cliente HTTP centralizado utilizando a Fetch API e suporte a variáveis de ambiente (`VITE_API_BASE_URL`) para comunicação com a API Back-End Django.
- `mockClient.ts`: Utilitário para simular latência de rede em chamadas locais de mock.
