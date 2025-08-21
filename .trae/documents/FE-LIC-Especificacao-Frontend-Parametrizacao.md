# Especificação de Frontend - Sistema de Parametrização de Licenciamento

## 1. Visão Geral do Sistema

O sistema de parametrização de licenciamento é uma aplicação web responsável pela gestão e configuração de todos os parâmetros necessários para o processo de licenciamento em Cabo Verde. A interface frontend é organizada de forma hierárquica e modular, permitindo navegação intuitiva entre diferentes níveis de configuração.

## 2. Estrutura de Navegação Principal

### 2.1 Menu Principal

**Estrutura Hierárquica:**

* **Configurações Base**

  * Opções Gerais

  * Parâmetros do Sistema

* **Parametrização de Licenciamento**

  * Setores

  * Categorias

  * Tipos de Licenças

* **Dossier Tipo Licença**

  * Dados Gerais

  * Legislações

  * Entidades

  * Associação Tipo Processos

  * Associação Taxas

### 2.2 Breadcrumbs

**Formato:** Home > Módulo > Submódulo > Página Atual

**Exemplos:**

* Home > Configurações Base > Opções Gerais

* Home > Parametrização > Setores > Novo Setor

* Home > Dossier Tipo Licença > Dados Gerais > Editar Parâmetros

### 2.3 Navegação por Tabs

**Aplicação em:**

* Página de Tipos de Licenças (inclui tab "Dossier Tipo Licença")

* Página de Dossier Tipo Licença (5 tabs principais)

* Formulários de edição complexos

## 3. Configurações Base

### 3.1 Página de Opções Gerais

**Estrutura da Página:**

* Header com título "Configurações Base - Opções Gerais"

* Barra de ações (Novo, Importar, Exportar)

* Lista principal com filtros

* Área de detalhes/formulário

**Lista de Opções:**

* **Colunas:** Código, Nome, Tipo, Valor, Status, Idioma, Ações

* **Filtros Disponíveis:**

  * Busca por texto (código/nome)

  * Filtro por tipo de opção

  * Filtro por status (Ativo/Inativo)

  * Filtro por idioma

* **Ordenação:** Por código, nome, tipo, data de criação

* **Paginação:** 25/50/100 itens por página

**Formulário de Opção:**

* **Campos Obrigatórios:**

  * Código da opção (único, alfanumérico)

  * Nome da opção

  * Tipo de opção (dropdown)

  * Valor da opção

* **Campos Opcionais:**

  * Descrição

  * Idioma (dropdown com idiomas suportados)

  * Status (Ativo/Inativo)

  * Ordem de exibição

* **Validações:**

  * Código único no sistema

  * Formato do valor conforme tipo selecionado

  * Nome obrigatório para cada idioma

**Ações Disponíveis:**

* **Na Lista:** Visualizar, Editar, Duplicar, Ativar/Desativar, Excluir

* **Globais:** Criar Nova Opção, Importar CSV, Exportar CSV/Excel

* **Em Lote:** Ativar/Desativar múltiplas opções, Excluir selecionadas

## 4. Parametrização de Licenciamento

### 4.1 Estrutura Hierárquica

**Navegação em Árvore:**

```
Setor
├── Categoria 1
│   ├── Tipo de Licença 1.1
│   └── Tipo de Licença 1.2
└── Categoria 2
    ├── Tipo de Licença 2.1
    └── Tipo de Licença 2.2
```

### 4.2 Página de Setores

**Layout da Página:**

* Painel tabulado: (Setores > Categorias > Tipos)

* Painel direito: Lista/Formulário do item selecionado

* Barra superior: Breadcrumbs e ações contextuais

**Lista de Setores:**

* **Colunas:** Nome, Código, Descrição, Nº Categorias, Status, Ações

* **Filtros:**

  * Busca por nome/código

  * Status (Ativo/Inativo/Todos)

* **Ordenação:** Alfabética, por código, por data de criação

**Formulário de Setor:**

* **Campos Obrigatórios:**

  * Nome do setor

  * Código do setor (único)

* **Campos Opcionais:**

  * Descrição

  * Status (Ativo/Inativo)

  * Ordem de exibição

* **Validações:**

  * Nome único dentro do sistema

  * Código alfanumérico único

  * Verificação de dependências antes da exclusão

### 4.3 Página de Categorias

**Contexto:** Exibida quando um setor é selecionado na árvore

**Lista de Categorias:**

* **Colunas:** Nome, Código, Setor, Nº Tipos de Licença, Status, Ações

* **Filtros:**

  * Busca por nome/código

  * Filtro por setor (se aplicável)

  * Status

* **Dependências:** Lista filtrada pelo setor selecionado

**Formulário de Categoria:**

* **Campos Obrigatórios:**

  * Nome da categoria

  * Código da categoria

  * Setor pai (pré-selecionado se vier da árvore)

* **Campos Opcionais:**

  * Descrição

  * Status

  * Ordem dentro do setor

* **Validações:**

  * Nome único dentro do setor

  * Código único no sistema

  * Setor deve estar ativo

### 4.4 Página de Tipos de Licenças

**Estrutura com Tabs:**

1. **Tab "Tipos de Licenças"** (principal)
2. **Tab "Dossier Tipo Licença"** (integração)

**Tab Principal - Lista de Tipos:**

* **Colunas:** Nome, Código, Categoria, Setor, Status, Tem Dossier, Ações

* **Filtros:**

  * Busca por nome/código

  * Filtro por setor

  * Filtro por categoria (dependente do setor)

  * Status

  * Possui dossier (Sim/Não)

* **Indicadores Visuais:**

  * Ícone especial para tipos com dossier configurado

  * Cores diferentes por status

**Formulário de Tipo de Licença:**

* **Campos Obrigatórios:**

  * Nome do tipo

  * Código do tipo

  * Categoria pai

* **Campos Opcionais:**

  * Descrição

  * Status

  * Configurar dossier (checkbox)

* **Ações Condicionais:**

  * Se "Configurar dossier" marcado: botão "Configurar Dossier"

  * Link direto para tab "Dossier Tipo Licença"

## 5. Dossier Tipo Licença

### 5.1 Estrutura de Navegação por Tabs

**5 Tabs Principais:**

1. **Dados Gerais** - Parâmetros básicos do tipo de licença
2. **Legislações** - Documentos legais associados
3. **Entidades** - Organizações envolvidas no processo
4. **Associação Tipo Processos** - Processos aplicáveis
5. **Associação Taxas** - Taxas e custos associados

### 5.2 Tab "Dados Gerais"

**Formulário de Parâmetros:**

* **Seção Validade:**

  * Unidade de validade (dropdown: dias, meses, anos)

  * Período de validade (numérico)

  * Validade provisória (checkbox + período)

* **Seção Modelo:**

  * Modelo de licença (dropdown)

  * Tipo de documento (dropdown)

* **Seção Status:**

  * Status do parâmetro (Ativo/Inativo)

  * Data de vigência

* **Validações:**

  * Período deve ser maior que zero

  * Data de vigência não pode ser anterior à atual

  * Modelo deve estar disponível no sistema

### 5.3 Tab "Legislações"

**Lista de Legislações:**

* **Colunas:** Nome, Tipo, Data Publicação, Status, Documento, Ações

* **Filtros:**

  * Busca por nome

  * Tipo de legislação

  * Período de publicação (data início/fim)

  * Status

* **Ações:** Visualizar documento, Editar, Remover associação

**Formulário de Legislação:**

* **Campos Obrigatórios:**

  * Nome da legislação

  * Tipo (Lei, Decreto, Portaria, etc.)

  * Data de publicação

* **Campos Opcionais:**

  * Número oficial

  * Resumo/Descrição

  * URL do documento

  * Upload de arquivo

  * Status (Vigente/Revogada)

* **Integração:** Upload para Minio storage

### 5.4 Tab "Entidades"

**Lista de Entidades:**

* **Colunas:** Nome, Tipo, Contatos, Status, Ações

* **Filtros:**

  * Busca por nome

  * Tipo de entidade

  * Status

* **Visualização:** Cards ou lista detalhada

**Formulário de Entidade:**

* **Dados Principais:**

  * Nome da entidade

  * Tipo (dropdown)

  * Status

* **Seção Contatos (sub-formulário):**

  * Tipo de contato (Email, Telefone, Endereço)

  * Valor do contato

  * Contato principal (checkbox)

  * Status do contato

* **Ações:** Adicionar/Remover contatos dinamicamente

### 5.5 Tab "Associação Tipo Processos"

**Lista de Associações:**

* **Colunas:** Tipo de Processo, Servidor Activity, Status, Ações

* **Filtros:**

  * Busca por tipo de processo

  * Servidor de destino

  * Status da associação

**Formulário de Associação:**

* **Campos:**

  * Tipo de licença (pré-selecionado)

  * Tipo de processo (dropdown com busca)

  * Servidor Activity (dropdown)

  * Status da associação

* **Validações:**

  * Servidor deve estar ativo e acessível

  * Tipo de processo deve existir no servidor selecionado

  * Não permitir associações duplicadas

### 5.6 Tab "Associação Taxas"

**Estrutura Hierárquica:**

* **Categorias de Taxas** (nível superior)

* **Taxas por Tipo de Processo** (nível inferior)

**Lista de Categorias de Taxas:**

* **Colunas:** Nome, Descrição, Nº Taxas, Status, Ações

* **Ações:** Expandir/Colapsar para mostrar taxas

**Lista de Taxas (expandida):**

* **Colunas:** Nome, Valor, Moeda, Tipo Processo, Status, Ações

* **Filtros:**

  * Busca por nome

  * Faixa de valores (min/max)

  * Moeda

  * Tipo de processo

  * Status

**Formulário de Taxa:**

* **Campos Obrigatórios:**

  * Nome da taxa

  * Valor base

  * Moeda (dropdown)

  * Tipo de processo associado

* **Campos Opcionais:**

  * Descrição

  * Fórmula de cálculo

  * Valor mínimo/máximo

  * Status

* **Validações:**

  * Valor deve ser positivo

  * Moeda deve estar ativa no sistema

  * Fórmula deve ser válida (se informada)

## 6. Funcionalidades Transversais

### 6.1 Operações CRUD

**Padrão de Ações:**

* **Criar:** Botão "+" ou "Novo" → Formulário em modal ou página

* **Visualizar:** Clique na linha ou ícone "olho" → Modo somente leitura

* **Editar:** Ícone "lápis" → Formulário editável

* **Excluir:** Ícone "lixeira" → Confirmação → Verificação de dependências

**Validações de Dependência:**

* Antes de excluir: verificar se item possui filhos ou associações

* Mensagens claras sobre impedimentos

* Sugestão de ações alternativas (desativar em vez de excluir)

### 6.2 Filtros e Busca

**Componentes Padrão:**

* **Busca Global:** Campo de texto no topo das listas

* **Filtros Laterais:** Painel colapsável com filtros específicos

* **Filtros Rápidos:** Chips/tags para filtros comuns

* **Filtros Avançados:** Modal com múltiplos critérios

**Funcionalidades:**

* Busca em tempo real (debounce)

* Combinação de múltiplos filtros

* Salvamento de filtros favoritos

* Limpeza rápida de todos os filtros

### 6.3 Responsividade

**Breakpoints:**

* **Desktop:** > 1200px - Layout completo com painéis laterais

* **Tablet:** 768px - 1200px - Painéis colapsáveis

* **Mobile:** < 768px - Layout em stack, navegação por drawer

**Adaptações Mobile:**

* Menu principal em drawer lateral

* Tabs horizontais com scroll

* Formulários em tela cheia

* Listas com cards em vez de tabelas

* Ações contextuais em menu dropdown

### 6.4 Estados e Feedback

**Estados Visuais:**

* **Loading:** Spinners e skeletons durante carregamento

* **Vazio:** Mensagens e ilustrações para listas vazias

* **Erro:** Mensagens de erro com ações de recuperação

* **Sucesso:** Notificações de confirmação de ações

**Indicadores de Status:**

* Cores padronizadas (verde=ativo, vermelho=inativo, amarelo=pendente)

* Ícones consistentes para cada tipo de status

* Tooltips explicativos

## 7. Integrações e Dependências

### 7.1 Dependências Hierárquicas

**Fluxo de Dependência:**

1. Setor → Categoria → Tipo de Licença
2. Tipo de Licença → Dossier (opcional)
3. Dossier → Legislações, Entidades, Processos, Taxas

**Comportamentos:**

* Desativação em cascata com confirmação

* Validação de integridade antes de alterações

* Mensagens claras sobre impactos das mudanças

### 7.2 Integrações Externas

**Activity Servers:**

* Validação de conectividade em tempo real

* Cache de tipos de processo disponíveis

* Indicadores visuais de status da conexão

**Minio Storage:**

* Upload de documentos com progress bar

* Preview de documentos quando possível

* Gestão de versões de arquivos

**Organizações Globais:**

* Sincronização de dados de entidades

* Validação de informações de contato

* Atualização automática de dados

## 8. Considerações de UX/UI

### 8.1 Princípios de Design

* **Consistência:** Padrões visuais e de interação uniformes

* **Clareza:** Informações organizadas e fáceis de encontrar

* **Eficiência:** Fluxos otimizados para tarefas frequentes

* **Feedback:** Resposta imediata às ações do usuário

* **Prevenção de Erros:** Validações e confirmações apropriadas

### 8.2 Acessibilidade

* **Navegação por teclado:** Todos os elementos acessíveis via Tab

* **Leitores de tela:** Labels e descrições apropriadas

* **Contraste:** Cores que atendem padrões WCAG

* **Tamanhos:** Elementos clicáveis com tamanho mínimo adequado

### 8.3 Performance

* **Lazy Loading:** Carregamento sob demanda de dados

* **Paginação:** Limitação de itens por página

* **Cache:** Armazenamento local de dados frequentes

* **Otimização:** Minimização de requisições desnecessárias

