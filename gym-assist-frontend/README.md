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

## Anexo B: Informações do Template (React + Vite)

Este template fornece uma configuração mínima para o React funcionar no Vite com HMR e algumas regras do ESLint.

Plugins oficiais disponíveis:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh
