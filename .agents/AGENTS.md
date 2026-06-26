# Diretrizes de Comportamento do Agente Antigravity

## 1. Escopo e Papel
* **Atuação Principal:** O usuário é um desenvolvedor Front-End trabalhando em dupla neste projeto. O foco absoluto das suas execuções deve ser a construção da interface utilizando React e Vite.
* **Restrição do Back-End:** O Back-End e os scripts de extração de dados ainda estão em desenvolvimento. Você **NÃO** deve alterar arquivos de Back-End ou executar comandos de terminal relacionados a ele (ex: `pip install`, `python manage.py`), a menos que seja expressamente autorizado.
* **Lidando com a Incompletude:** Como as APIs ainda não estão prontas, baseie o desenvolvimento do Front-End prevendo o formato provável dos dados com base nos documentos de requisitos e nas melhores práticas de arquitetura de software.

## 2. Regras para Intervenção no Back-End
* Você tem total liberdade para ler o código do Back-End, questionar decisões arquiteturais e sugerir melhorias. Se a sugestão for bem aceita, o próprio usuário poderá implementá-la.
* **Formato da Sugestão:** Ao sugerir qualquer alteração no Back-End, você DEVE obrigatoriamente fornecer:
    1. Uma explicação detalhada da necessidade da mudança.
    2. Como essa mudança afetará toda a aplicação (análise de impacto).
    3. Um **Grau de Urgência** (Baixo, Médio, Alto ou Crítico).

## 3. Padrões de Código Front-End
* **Simetria com o Back-End (Inspeção de Models):** Antes de criar ou alterar qualquer interface de entidade em `types.ts` (ex: `Curso`, `Disciplina`, `Docente`), você DEVE obrigatoriamente ler o arquivo `base_ementario/models.py` (ou equivalente do Django) para garantir compatibilidade exata dos nomes de propriedades opcionais e dos valores literais de `TextChoices` (ex: mapear `Em atividade` em vez de `Ativo`).
* **TypeScript Estrito:** Utilize TypeScript estrito em todos os arquivos (`.tsx` e `.ts`). É expressamente **proibido o uso de `any`**. Se o tipo exato não for conhecido, utilize `unknown` ou crie uma `interface` baseada na suposição estrutural dos dados do backend. Todo componente React deve ter suas `Props` explicitamente tipadas.
* **Estilização:** Utilize **exclusivamente Tailwind CSS** para toda a estilização dos componentes via classes utilitárias (`className`). Não crie arquivos CSS isolados, a menos que seja para configurações globais estritas.
* **Integração e Mocks:** Centralize as chamadas de API em serviços isolados (ex: `src/modules/cursos/services`). Como a API real não está pronta, gere arquivos de Mock locais (objetos JSON tipados) para simular o retorno do backend durante o desenvolvimento das telas.
* **Idioma do Código:** Nomes de variáveis, interfaces e rotas ligadas estritamente à regra de negócio do domínio acadêmico devem ser em **Português (ex: `Curso`, `Disciplina`, `docenteId`)**. Ações, estados lógicos do React e funções utilitárias devem ser em **Inglês (ex: `isLoading`, `fetchCursos`, `handleClick`)**.

## 4. Fluxo de Trabalho (Workflow)
* **Planejamento Obrigatório:** Sempre faça um planejamento detalhado da solução e apresente ao usuário antes de começar a codificar uma nova task.
* **Justificativa de Desvios:** Se no decorrer do desenvolvimento for necessário mudar algo em relação ao plano original, especifique o motivo da mudança no final da sua resposta.
* **Versionamento:** Sempre que sugerir comandos de Git, utilize o padrão *Conventional Commits* (ex: `feat:`, `fix:`).
* **Transparência no Terminal:** ANTES de solicitar permissão para executar qualquer comando no meu terminal (shell), você DEVE explicar brevemente, em português, o que aquele comando faz e por que ele é necessário para a tarefa atual.
* **Comandos que não precisam de aprovação:** npm run build.

## 5. Encerramento de Task
Sempre que uma tarefa for concluída, você DEVE finalizar sua resposta seguindo este checklist exato:
1. **Resumo:** Apresente um resumo claro e conciso do que foi feito/alterado.
2. **Gerenciamento de Contexto:** Sugira a criação de um novo chat (para que o contexto anterior não pese nas próximas respostas), a não ser que o contexto atual seja estritamente necessário para o próximo passo.
3. **Próximos Passos:** Liste sugestões das próximas tarefas a serem feitas. Para cada uma, indique o grau de necessidade e faça uma recomendação explícita de qual priorizar.

## 6. Idioma de Comunicação
* **Chat em Português:** Todas as suas explicações, planejamentos, resumos, justificativas e interações gerais no chat DEVEM ser estritamente em **Português do Brasil (PT-BR)**.
* **Preservação Técnico (Sem Viés):** NUNCA traduza palavras reservadas de linguagens de programação, nomes de bibliotecas, comandos de terminal, jargões técnicos universais (ex: `deploy`, `build`, `commit`, `array`) ou trechos de código. O código gerado deve continuar respeitando a regra de idioma definida na seção de "Padrões de Código".

* **Documentação Contínua (Auto-documentação):** Sempre que criar uma nova pasta estrutural no projeto (como novos módulos, páginas ou diretórios compartilhados), você DEVE criar um arquivo `README.md` curto dentro dela explicando a sua finalidade e o tipo de arquivo que deve ser armazenado ali. Além disso, inclua um breve comentário de cabeçalho (ex: padrão JSDoc) nos novos arquivos `.ts` e `.tsx` criados, resumindo a responsabilidade daquele código para facilitar o entendimento da equipe.
