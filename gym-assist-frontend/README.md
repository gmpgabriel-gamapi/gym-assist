# Projeto Gym Assist

Este documento serve como um guia completo para a arquitetura, funcionalidades e estado atual do projeto.

---

## 1. Documentação de Onboarding

_Versão: Setembro de 2025_
_Arquiteto: O Arquiteto de Código_

### Objetivo Principal

O objetivo do Gym Assist é ser uma plataforma web full-stack robusta e intuitiva, projetada para profissionais de fitness (Professores e Academias) gerenciarem seus clientes (Alunos). A aplicação permite a criação, atribuição e acompanhamento de planos de treino altamente personalizados e flexíveis, substituindo métodos ultrapassados por uma ferramenta digital, interativa e inteligente. O foco principal é na **flexibilidade**, **personalização** e, crucialmente, no **registro histórico** da jornada e evolução do aluno.

### 2. Arquitetura e Tecnologias Utilizadas

- **Frontend:**

  - **Framework:** React (criado com Vite).
  - **Estilização:** `styled-components` para componentização de estilos.
  - **Roteamento:** `react-router-dom`.
  - **Comunicação com API:** `axios`.
  - **Interatividade (Drag and Drop):** `dnd-kit`.

- **Backend:**

  - **Ambiente:** Node.js.
  - **Framework:** Express.js para a construção da API RESTful.
  - **Autenticação:** Baseada em JSON Web Tokens (JWT) com a biblioteca `jsonwebtoken`.
  - **Segurança:** Criptografia de senhas com `bcrypt`.
  - **Utilitários:** `cors` para segurança de requisições, `dotenv` para variáveis de ambiente.

- **Banco de Dados:**
  - **SGBD:** PostgreSQL.
  - **Driver Node.js:** `pg`.

### 3. Setup e Desenvolvimento Local

1.  **Clone o repositório:** `git clone https://github.com/gmpgabriel-gamapi/gym-assist.git`
2.  **Instale as dependências do Frontend:**
    - Navegue até a pasta `frontend` (ou a raiz, se for o caso).
    - Rode `npm install`.
3.  **Instale as dependências do Backend:**
    - Navegue até a pasta `backend`.
    - Rode `npm install`.
4.  **Configure as Variáveis de Ambiente:**
    - Crie um arquivo `.env` na pasta `backend` com as chaves do banco de dados e JWT_SECRET.
5.  **Inicie os servidores:**
    - No terminal do Backend, rode `npm run dev`.
    - No terminal do Frontend, rode `npm run dev`.

### 4. Modelo de Dados (Tabelas do Banco de Dados)

A seguir, a estrutura atual e definitiva do nosso banco de dados:

- `users`: Armazena dados de login e perfil de todas as _pessoas_ (alunos, professores, donos de academia).
- `academias`: Guarda os dados da entidade de negócio "Academia".
- `academia_membros`: Tabela de ligação que define a relação de um `user` com uma `academia` e seu papel (`owner`, `professor`, `aluno`, etc.).
- `professor_alunos`: Tabela de ligação para a relação direta e pessoal entre um professor e um aluno.
- `muscle_groups`, `muscle_subgroups`, `muscles`: A hierarquia de conhecimento muscular.
- `movements`: O catálogo de movimentos articulares fundamentais (o "cérebro" cinesiológico).
- `base_exercises`: A biblioteca de exercícios curada pelo sistema, com dados ricos.
- `custom_exercises`: Os exercícios criados pelos usuários, com uma estrutura simplificada.
- `base_exercise_movements`: Tabela de ligação entre exercícios base e os movimentos que eles envolvem.
- `movement_to_muscle`: O mapeamento de conhecimento que liga movimentos aos músculos que eles recrutam.
- `series`: A "biblioteca" de séries de treino independentes, criadas pelos usuários.
- `series_exercises`: Tabela de ligação que detalha quais exercícios (e com qual configuração de sets/reps) compõem uma série.
- `training_plans`: Armazena as "versões" de um plano de treino de um usuário.
- `training_plan_series`: A "montagem" que liga as séries de uma biblioteca a uma versão específica de um plano de treino.
- `user_measurements`: O histórico de medições físicas do usuário (peso, altura, etc.).
- `executions`: A tabela que armazenará cada _set_ de cada exercício executado durante um treino (a base para os relatórios).

### 5. Decisões Arquiteturais e Regras de Negócio Chave

- **Versionamento e Histórico:** Nenhum plano de treino ou série que já foi executado é sobrescrito. Em vez disso, criamos uma nova versão, preservando 100% do histórico do aluno.
- **Modelo Híbrido de Exercícios:** O sistema tem exercícios "base" ricos em dados (ligados a movimentos), enquanto os exercícios customizados pelo usuário são mais simples (ligados a um grupo muscular), priorizando a facilidade de uso.
- **Ciclo de Vida do Usuário (`status`):** Um usuário pode ser `'active'` (pode logar) ou `'provisioned'` (pré-cadastrado por um professor, sem senha), permitindo um fluxo de onboarding flexível.
- **Hub do Aluno (Contexto Focado):** Abandonamos um seletor de contexto global em favor de um "workspace" dedicado (`/aluno/:id`) quando um professor gerencia um aluno.
- **Templates de Séries vs. Compartilhamento:** O professor utiliza sua biblioteca de séries para criar templates de treinos completos. O compartilhamento de exercícios individuais é uma funcionalidade focada na Academia (para padronizar o maquinário).
- **Trilha de Auditoria:** A futura tabela `executions` registrará qual usuário (`logged_by_user_id`) salvou cada série executada, garantindo a rastreabilidade.

### 6. Status Atual das Funcionalidades

- **Módulo: Autenticação e Perfis**

  - Backend API (CRUD Completo): **OK**
  - Frontend UI (Páginas e Contexto): **OK**

- **Módulo: Base de Conhecimento (Músculos, Movimentos, Exercícios Base)**

  - Backend (Schema e Seeding): **OK**

- **Módulo: Gerenciamento de Exercícios Customizados**

  - Backend API (CRUD Completo): **OK**
  - Frontend (Página de Gerenciamento e Formulários): **OK**

- **Módulo: Associações (Professor-Aluno)**

  - Backend (Schema e API para Adicionar/Listar): **OK**
  - Frontend (Página "Meus Alunos" e navegação para o Hub): **OK**

- **Módulo: Player de Treino**

  - Frontend (Interface e Lógica de Execução): **OK**
  - Backend (API para buscar séries a serem executadas): **OK**
  - Conexão para salvar execuções (`executions`): **PENDENTE**

- **Módulo: Gerenciamento de Séries e Planos de Treino**

  - Backend (Schema do Banco de Dados com Versionamento): **OK**
  - Backend (API CRUD para a biblioteca de `Séries`): **OK**
  - Backend (API para montar/salvar o `Plano de Treino`): **OK**
  - Frontend (Interface do `SeriesEditor` para montar uma série): **OK**
  - Frontend (Interface do `StudentHub` para montar um plano): **OK**
  - **Conexão Final do Fluxo:** **PENDENTE**
    - O botão "Salvar" no `SeriesEditor` ainda está simulado.
    - A página `MyTraining` ainda exibe um plano de treino mockado.

- **Módulo: Relatórios**
  - Planejamento: **PENDENTE**
  - Implementação: **PENDENTE**

---

## Anexo A: Conceito Original e Brainstorm de Funcionalidades

_(Esta seção contém o prompt inicial usado para conceber o projeto e serve como um registro histórico das ideias originais.)_

#### Objetivo Original

O objetivo do Gym Assist é ser um parceiro de treino para o usuário, proporcionando a sensação de estar treinando junto de um amigo que entende do assunto, para que ele não se sinta sozinho.

#### Glossário Inicial

- **Exercício:** Uma atividade específica feita pelo usuário com o intuito de fortalecer um ou mais músculos.
- **Série:** Agrupamento de exercícios.
- **Treino:** Agrupamento de séries.
- **Treino Ativo:** O treino mais atual do usuário. Toda vez que o usuário altera algo, é criada uma nova versão do treino por questões de histórico.
- **Execução:** Registro de exercícios feitos pelo usuário.

#### Brainstorm de Características

- **Montagem de Treinos e Séries:** Interfaces para o usuário criar e customizar seus treinos e séries.
- **Exercícios com IA:** Um sistema com exercícios base e a possibilidade de o usuário cadastrar os seus, com uma IA associando o novo exercício a movimentos e grupos musculares.
- **Dados de Usuário e "Fit":** Coleta de dados de cadastro e métricas corporais para relatórios.
- **Associações (Professor/Academia):** Permitir que profissionais gerenciem seus alunos.
- **Módulo de Timer:** Um timer customizável com tempo de preparo, ação, descanso e repetições.
- **Player de Treino:** Uma interface guiada para a execução do treino, com timers de descanso integrados entre séries e exercícios.
- **Relatórios:** Visualização de progresso em calendário com diversos filtros.
- **Nutrição:** Ferramentas para cálculo de calorias e registro de alimentação.
- **Perfis (Professor/Academia):** Funcionalidades específicas para cada tipo de usuário.
- **Vendas:** Módulo a ser definido.

---

## Anexo B: P.R.E.V.C. - Fase de Planejamento

_(Esta seção detalha a arquitetura, tecnologias e estrutura inicial propostas no início do projeto.)_

#### 1. Arquitetura do Sistema

Proponho uma arquitetura de micro-serviços desacoplada, o que nos dará flexibilidade para escalar e manter o sistema no futuro.

- **Frontend:** Uma Single Page Application (SPA). Ele será responsável por toda a interface visual e interação com o usuário.
- **Backend:** Uma API RESTful. O backend será o cérebro da aplicação, responsável pelas regras de negócio, autenticação de usuários, e comunicação com o banco de dados.
- **Banco de Dados:** Um banco de dados relacional (SQL).
- **Serviço de IA (para análise de exercícios):** Este será um serviço separado. Quando um usuário cadastrar um novo exercício, o backend enviará os dados para este serviço, que fará a análise e retornará os grupos musculares associados.

#### 2. Identidade Visual

- **Tema Sugerido:** - Um tema "Dark Mode First" (Modo Escuro como Padrão). Ambientes de academia geralmente têm iluminação variada, e um tema escuro é mais confortável aos olhos e ajuda a destacar os elementos importantes da interface, como cronômetros e dados do exercício. Poderemos, claro, oferecer um tema claro como opção nas configurações.
- **Paletas de Cores:**
  - **Foco e Saúde:**
    - **Fundo Principal:** - Azul marinho muito escuro (ex: #1A202C).
    - **Elementos de Interface:** - Um azul acinzentado (ex: #2D3748).
    - **Cor de Destaque:** - Verde menta ou ciano (ex: #38B2AC). Essa paleta transmite uma sensação de saúde e tecnologia, menos "agressiva" que a primeira.
- **Tipografia** - Para garantir legibilidade e uma aparência moderna, sugiro a seguinte combinação de fontes (disponíveis gratuitamente no Google Fonts):
  - **Títulos e Destaques:** - Montserrat - Uma fonte moderna e geométrica, com boa presença.
  - **Textos e Parágrafos:** - Lato ou Roboto - Fontes extremamente legíveis em qualquer tamanho, ideais para exibir dados e instruções.
  - **Texto:** - Branco ou um cinza claro.

### 3. Proposta de Valor

O "Gym Assist" se diferencia por unir simplicidade e poder em uma única plataforma. Nosso objetivo é ir além de um simples rastreador de exercícios, atuando como um verdadeiro **parceiro de treino digital**. A interface intuitiva e a funcionalidade principal "Meu Treino" são projetadas para guiar o usuário de forma eficaz, enquanto relatórios detalhados de performance oferecem insights valiosos para a otimização contínua dos resultados.

### 4. Jornada do Usuário

A aplicação é projetada para atender a dois perfis principais de usuários:

- **Usuário Iniciante:** Pode ser facilmente integrado à plataforma por seu instrutor ou começar de forma independente, utilizando exercícios base e a funcionalidade guiada "Meu Treino" para construir uma rotina sólida.
- **Usuário Avançado:** Encontra no "Gym Assist" uma ferramenta poderosa para executar seus treinos personalizados com máxima eficiência e para analisar seu progresso através de métricas avançadas, como volume loading e frequência de grupos musculares trabalhados.

### 5. Visão de Futuro (Roadmap)

O projeto "Gym Assist" é concebido como uma plataforma em constante evolução. Os próximos passos estratégicos incluem:

- **Integração Academia-Usuário:** Criação de um canal para comunicação, promoções e informativos.
- **Expansão para Múltiplas Plataformas:** Desenvolvimento de versões para aplicativos mobile (iOS/Android) e smartwatches.
- **Assistente com IA:** Integração de uma Inteligência Artificial para comunicação e orientação via webhooks (WhatsApp, Telegram, etc.).

#### 6. Tecnologias Propostas (Tech Stack)

- **Frontend:**
  - **Framework:** React (com Vite).
  - **Linguagem:** TypeScript.
  - **Estilização:** Styled-components ou Tailwind CSS.
- **Backend:**
  - **Plataforma:** Node.js com o framework Express.js.
  - **Linguagem:** TypeScript.
- **Banco de Dados:**
  - **SGBD:** PostgreSQL.
- **Autenticação:**
  - **Método:** JWT (JSON Web Tokens).

#### 7. Estrutura de Arquivos Inicial (Frontend)

gym-assist-frontend/
├── public/
│ └── index.html
└── src/
├── assets/
│ └── images/
│ └── fonts/
├── components/
│ ├── common/ // Botões, Inputs, Cards genéricos
│ └── layout/ // Header, Sidebar, Footer
├── constants/
│ └── theme.js // Aqui definiremos nossa paleta de cores
├── mocks/
│ └── userMocks.js // Dados falsos para desenvolvimento inicial
├── pages/
│ ├── Login.jsx
│ ├── Dashboard.jsx
│ ├── MyTraining.jsx
│ └── WorkoutPlayer.jsx // A tela de execução do treino
├── services/
│ └── api.js // Configuração da comunicação com o backend
├── styles/
│ └── GlobalStyles.js // Estilos globais da aplicação
├── App.jsx
└── main.jsx

#### 8. Definição do MVP (Mínimo Produto Viável)

    Documento de Escopo: Produto Mínimo Viável (MVP) do Gym Assist
    Versão: 1.0
    Data: 10 de Setembro de 2025
    Propósito: Este documento detalha o escopo de funcionalidades para a primeira versão do "Gym Assist". O objetivo deste MVP é entregar um produto funcional que materialize a proposta de valor central do projeto: atuar como um "parceiro de treino digital" simples, poderoso e flexível.

    Módulos de Funcionalidades
    Módulo 1: Fundamento e Gestão de Usuário
    O alicerce do sistema, garantindo que cada usuário tenha uma identidade, segurança e um espaço pessoal dentro da aplicação.

    1.1. Cadastro de Usuário: Implementação de uma tela de cadastro que permita a um novo usuário criar sua conta pessoal de forma segura, fornecendo informações essenciais como nome, e-mail e senha.

    1.2. Autenticação de Usuário: Desenvolvimento de uma tela de login para que usuários registrados possam acessar a plataforma. Inclui um mecanismo seguro de logout para encerrar a sessão.

    1.3. Perfil do Usuário (Simplificado): Uma área básica e acessível dentro do aplicativo onde o usuário possa visualizar as informações da sua conta.

    Módulo 2: Biblioteca de Exercícios (Conteúdo Central, Dinâmica e Personalizada)
    Um hub central para todos os exercícios, tanto os pré-carregados ("Base") quanto os criados pelos diferentes usuários, com funcionalidades de gestão.
    A base de conhecimento da aplicação, contendo todos os exercícios que podem ser utilizados para montar séries e treinos.

    2.1. Visualização Unificada e Filtros: Uma tela que exibe uma lista combinada de exercícios de todas as fontes disponíveis para o usuário (Base, seus próprios exercícios, do seu professor, da sua academia). A interface deverá permitir filtrar por grupo muscular e pela origem do exercício. Deve incluir uma funcionalidade de busca por nome.

    2.2. Gestão de Exercícios Customizados: Funcionalidade completa de criar, editar e deletar os exercícios customizados que pertencem ao próprio usuário.

    2.3. Filtro por Grupo Muscular: Ferramenta essencial que permite ao usuário filtrar a biblioteca de exercícios por grupos musculares específicos (ex: Peito, Costas, Pernas, etc.), facilitando a montagem de treinos.

    2.4. Detalhes do Exercício: Uma tela de visualização para cada exercício, contendo seu nome, descrição detalhada das instruções de execução e um espaço designado para uma futura imagem ou GIF.

    2.5. Controle de Visibilidade: Uma opção para o usuário "esconder" ou "mostrar" grupos de exercícios (ex: ocultar todos os exercícios Base da lista principal).

    Módulo 3: Criação de Séries (Agrupador de Exercícios)
    O primeiro nível de personalização, onde o usuário agrupa exercícios da biblioteca para formar uma rotina de treino específica e reutilizável.

    3.1. Gestão de Séries: Uma área dedicada onde o usuário pode criar, visualizar, editar e deletar suas próprias séries (ex: "Série A - Foco em Peito", "Série de Aquecimento").

    3.2. Adição/Remoção de Exercícios: Dentro do editor de uma série, o usuário terá a capacidade de navegar e selecionar exercícios da Biblioteca (Módulo 2) para compor a rotina.

    3.3. Definição de Parâmetros: Para cada exercício adicionado a uma série, o usuário poderá especificar os parâmetros de execução: número de séries (sets), faixa de repetições (reps) e o tempo de descanso recomendado.

    Módulo 4: Montagem de Treinos (Agrupador de Séries)
    O segundo nível de personalização, permitindo que o usuário organize suas séries em um plano de treino estruturado (ex: semanal).

    4.1. Gestão de Treinos: Uma interface para o usuário criar, visualizar, editar e deletar seus planos de treino (ex: "Treino de Hipertrofia ABC", "Plano de 5 dias").

    4.2. Associação de Séries: Funcionalidade que permite ao usuário selecionar as séries criadas no Módulo 3 e associá-las ao seu plano de treino, organizando a estrutura (ex: Segunda-feira: Série A, Terça-feira: Série B, etc.).

    Módulo 5: Execução de Treino ("Meu Treino")
    O coração da aplicação. A experiência interativa e guiada que atua como o "parceiro de treino" durante a atividade física.

    5.1. Seleção de Série do Dia: Interface inicial onde o usuário escolhe seu plano de treino ativo e, em seguida, seleciona qual série específica daquele plano ele deseja executar na sessão atual.

    5.2. Interface de Treino Guiado: Uma tela imersiva e focada que guia o usuário exercício por exercício dentro da série escolhida. Esta interface permitirá a flexibilidade de adicionar ou remover exercícios durante a execução, garantindo que o treino se adapte à necessidade do momento.

    5.3. Resumo Pós-Série: Ao finalizar a sessão, uma tela de resumo será exibida, parabenizando o usuário e mostrando os resultados gerais do treino recém-concluído.

    Módulo 6: Histórico de Atividades (Básico)
    O diário de bordo do usuário, registrando de forma precisa o progresso real e servindo como fonte de motivação e análise.

    6.1. Diário de Treino (Log de Sessões): Uma tela que exibe uma lista cronológica de todas as sessões de treino finalizadas pelo usuário, funcionando como um log de atividades.

    6.2. Registro Fiel da Sessão (Snapshot): Ao selecionar um item do diário, o sistema exibirá um registro fiel e imutável (snapshot) do que foi efetivamente realizado naquela sessão. Este registro é independente da série original e detalha todos os exercícios feitos (incluindo os adicionados na hora), os pesos exatos, séries e repetições de cada um, fornecendo um histórico preciso do esforço real.

#### 9. Documento de Visão de Longo Prazo: O Futuro do Gym Assist (Pós-MVP)

    Versão: 1.1
    Data: 10 de Setembro de 2025
    Propósito: Este documento serve como um guia estratégico para a evolução do "Gym Assist" após o lançamento bem-sucedido do Produto Mínimo Viável (MVP). Ele delineia as futuras fases de desenvolvimento, projetadas para expandir a plataforma de uma ferramenta de treino pessoal para um ecossistema de fitness completo, social e inteligente.

    Fases de Evolução Pós-MVP
    Fase 2: Análise de Desempenho e Personalização Avançada
    O foco desta fase é enriquecer a experiência do usuário individual, transformando os dados coletados em insights acionáveis e aumentando as opções de personalização.

    2.1. Relatórios Avançados e Dashboard de Performance:

    Descrição: Implementação de uma seção de análise visual detalhada, com gráficos interativos que ilustram a progressão de métricas como Volume Loading (carga total levantada), recordes pessoais (PRs) por exercício, e a frequência de treino por grupo muscular.

    Valor: Capacita o usuário com dados concretos para otimizar seus treinos e visualizar seu progresso de forma clara e motivadora.

    2.2. Metas e Conquistas (Gamificação):

    Descrição: Introdução de um sistema que permite aos usuários definir metas personalizadas (ex: frequência semanal, volume total) e desbloquear conquistas (badges) por sua consistência e desempenho.

    Valor: Aumenta o engajamento e a retenção a longo prazo, adicionando uma camada de motivação e diversão à jornada de fitness.

    Fase 3: Ecossistema e Interação Social
    Nesta fase, expandimos o "Gym Assist" para se conectar com profissionais, outras plataformas e a comunidade, construindo um verdadeiro ecossistema.

    3.1. Funcionalidades para Personal Trainers e Academias (Sistema de Papéis):

    Descrição: Em vez de um portal separado, evoluiremos o "Gym Assist" para suportar diferentes papéis de usuário (Aluno, Trainer, Academia) dentro da mesma aplicação unificada. Isso incluirá o desenvolvimento de telas específicas por papel (ex: um painel "Meus Alunos" para trainers) e a adaptação de funcionalidades existentes para diferentes contextos, com forte ênfase na reutilização de componentes de UI (ex: o mesmo editor de séries será usado por um aluno para si mesmo ou por um trainer para um aluno).

    Valor: Integra os profissionais de fitness ao ecossistema, cria novas oportunidades de negócio (B2B) e melhora a experiência do aluno ao conectar sua vida na academia com a digital.

    3.2. Integração com APIs de Saúde:

    Descrição: Sincronização de dados com as principais plataformas de saúde do mercado, como Google Fit e Apple Health, permitindo um fluxo de informações de atividades físicas, calorias, entre outros.

    Valor: Posiciona o "Gym Assist" como uma peça central no ecossistema de saúde e bem-estar do usuário.

    3.3. Funcionalidades Sociais:

    Descrição: Implementação de recursos que permitem aos usuários adicionar amigos, compartilhar seus treinos e conquistas em um feed de atividades, e interagir com a comunidade.

    Valor: Fortalece a retenção de usuários através da criação de uma comunidade engajada e de apoio mútuo.

    Fase 4: Expansão para Novas Plataformas e Inteligência Artificial
    A fase final da visão, que torna o "Gym Assist" onipresente em todos os dispositivos do usuário e o transforma em um assistente proativo e inteligente.

    4.1. Aplicativo Mobile Nativo (iOS & Android):

    Descrição: Desenvolvimento de aplicativos mobile completos e otimizados para smartphones, aproveitando recursos nativos para oferecer a melhor experiência de usuário possível.

    Valor: Atende à principal necessidade do público-alvo, que é ter a ferramenta de treino acessível no bolso, dentro da academia.

    4.2. Aplicativo para Smartwatch:

    Descrição: Criação de um aplicativo complementar para smartwatches (Apple Watch, etc.), focado na execução de treinos. O usuário poderá visualizar exercícios, registrar séries/repetições/cargas e controlar o cronômetro de descanso diretamente do pulso.

    Valor: Oferece o máximo de conveniência e foco durante a atividade física, eliminando a distração do smartphone.

    4.3. Assistente de Treino com IA:

    Descrição: Integração de um assistente virtual inteligente que analisa o histórico do usuário para fornecer sugestões proativas, insights de performance e alertas. A comunicação poderá ser feita via chatbots no app ou por webhooks com plataformas como WhatsApp e Telegram.

    Valor: Concretiza a visão final do "parceiro de treino", oferecendo orientação personalizada e inteligente que se adapta à jornada do usuário.

---

## Anexo C: Etapa Atual

    Plano de Execução: Ciclo 1 - Módulo 1 (Fundamento e Gestão de Usuário)
    Objetivo do Ciclo: Implementar a interface de usuário (UI) e o fluxo de navegação completo para o cadastro, login e perfil do usuário. Ao final deste ciclo, teremos um protótipo clicável de todo o fluxo de autenticação, funcionando com dados mock, sem depender do backend.

    Tecnologias Frontend: React, Vite, react-router-dom.

    Tarefa 1: Estrutura de Rotas e Páginas
    Ação: Criar a estrutura de arquivos para as novas páginas e configurar o roteamento principal da aplicação.

    Detalhes:

    No App.jsx ou em um arquivo de rotas dedicado, definir as seguintes rotas:

    /login -> Página de Login

    /cadastro -> Página de Cadastro

    /perfil -> Página de Perfil (será uma rota protegida futuramente)

    / ou /dashboard -> Página principal da aplicação após o login.

    Criar os arquivos de componente vazios para cada página: src/pages/Register.jsx e src/pages/Profile.jsx.

    Tarefa 2: Desenvolvimento da Página de Cadastro (/cadastro)
    Ação: Construir o formulário e a interface da página de cadastro.

    Detalhes:

    Criar um componente de formulário reutilizável (ex: src/components/RegisterForm.jsx).

    O formulário deve conter os campos: Nome, E-mail, Senha e Confirmar Senha.

    Implementar validações básicas no lado do cliente (ex: campos obrigatórios, formato de e-mail, senhas coincidem).

    Ao submeter o formulário com sucesso, a função de callback irá, por enquanto, apenas exibir os dados no console (console.log(formData)).

    Adicionar um link de navegação para a página de Login (ex: "Já tem uma conta? Faça login").

    Tarefa 3: Revisão e Finalização da Página de Login (/login)
    Ação: Garantir que a página de login existente esteja alinhada e funcional (com dados mock).

    Detalhes:

    Revisar o componente src/components/Login/LoginForm.jsx.

    Assim como no cadastro, ao submeter o formulário, a função de callback exibirá os dados no console (console.log(credentials)).

    Após a submissão, simularemos um login bem-sucedido e redirecionaremos o usuário para a página principal (/dashboard).

    Garantir que haja um link de navegação para a página de Cadastro.

    Tarefa 4: Desenvolvimento da Página de Perfil (/perfil)
    Ação: Criar uma página simples para exibir os dados do usuário (mock) e permitir o logout.

    Detalhes:

    A página exibirá informações de um usuário estático (mock), por exemplo: "Nome: Usuário de Teste", "Email: teste@gymassist.com".

    Implementar um botão de "Sair" (Logout).

    A ação de logout irá simular o fim da sessão e redirecionar o usuário de volta para a página de login (/login).

---

## Anexo D: Informações do Template (React + Vite)

Este template fornece uma configuração mínima para o React funcionar no Vite com HMR e algumas regras do ESLint.

Plugins oficiais disponíveis:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https.swc.rs/) para Fast Refresh
