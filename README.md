# 🎮 Gamood — GameCenter

> **Sistema web para gestão de Game Center: Aluguel de Jogos e Agendamento de Horários.**

O **Gamood** é uma aplicação web completa desenvolvida para gerenciar as operações de um centro de jogos (Game Center). O sistema une o catálogo de jogos disponíveis à alocação de horários/estações de jogo para clientes, oferecendo autenticação segura, painel de controle e prevenção de conflitos de agendamento em tempo real.

---

## 📌 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias (Stack)](#-tecnologias-stack)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução Local](#-instalação-e-execução-local)
- [Modelo de Dados](#-modelo-de-dados)
- [Roadmap de Desenvolvimento](#-roadmap-de-desenvolvimento)
- [Licença](#-licença)

---

## 🎯 Visão Geral

O projeto nasceu com o objetivo de criar uma solução robusta e escalável para centros de entretenimento gamer, servindo tanto aos clientes finais quanto aos administradores do estabelecimento:

- **Para o usuário/cliente:** Explorar o catálogo de jogos, consultar horários vagos, realizar reservas de forma simples e gerenciar seu histórico através de um painel pessoal.
- **Para a administração:** Gerenciar o acervo de jogos, cadastrar e disponibilizar novos slots de horários e ter controle sobre reservas e cancelamentos.
- **Foco técnico:** Implementação de arquitetura **MVC** adaptada ao ecossistema Next.js, modelagem relacional com **PostgreSQL** e **Prisma ORM**, controle de concorrência com transações e autenticação com cookies seguros.

---

## ✨ Funcionalidades

### 🔐 Autenticação & Segurança

- Cadastro e login de usuários com validação de dados.
- Criptografia de senhas usando `bcrypt`.
- Sessão segura baseada em JWT armazenado em cookies `httpOnly`.
- Proteção de rotas privadas via Next.js Middleware.

### 🎮 Catálogo de Jogos (CRUD)

- Listagem detalhada de jogos com status de disponibilidade.
- Cadastro, edição e desativação/exclusão de títulos.
- Validação de integridade para impedir remoção de jogos com reservas ativas.

### ⏰ Gestão de Horários (Time Slots)

- Criação e manutenção de blocos de horário para as sessões de jogo.
- Visualização em tempo real de horários livres e ocupados.
- Tratamento de cancelamento e liberação de horários.

### 📅 Sistema de Reservas (Core)

- Fluxo guiado para seleção de jogo + horário.
- **Prevenção de concorrência:** Uso de transações do Prisma (`$transaction`) para garantir que dois usuários não reservem o mesmo slot simultaneamente.
- Cancelamento de reserva com restauração imediata da disponibilidade do slot.

### 👤 Painel do Usuário

- Histórico completo de reservas ativas e passadas.
- Atualização e gestão de dados do perfil do jogador.
- Estado global de autenticação com React Context API.

---

## 🧱 Tecnologias (Stack)

| Camada | Tecnologia | Descrição |
|---|---|---|
| **Frontend** | [Next.js](https://nextjs.org/) + [React](https://react.dev/) | Interface moderna utilizando App Router e Server/Client Components |
| **Backend** | Next.js (Server Actions / Route Handlers) | Lógica de negócio e APIs seguindo padrão arquitetural MVC |
| **Banco de Dados** | [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional com integridade referencial e transações ACID |
| **ORM** | [Prisma](https://www.prisma.io/) | Mapeamento objeto-relacional, tipagem forte e controle de migrações |
| **Infraestrutura Local** | [Docker](https://www.docker.com/) + Docker Compose | Containerização do banco de dados para ambiente de desenvolvimento |
| **Segurança** | `bcrypt` + `jsonwebtoken` | Hashing seguro de senhas e autenticação via cookies protegidos |

---

## 🏛 Arquitetura do Projeto

O projeto adota o padrão **MVC (Model-View-Controller)** adaptado para o Next.js:

```
┌─────────────────────────────────────────────────────────┐
│                     View (Next.js)                      │
│   src/app/ (Pages, Server Components, Client Components) │
└───────────────────────────┬─────────────────────────────┘
                            │ Dispara ações / requisições
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Controller Layer                      │
│   src/controllers/ (Regras de negócio e validações)      │
└───────────────────────────┬─────────────────────────────┘
                            │ Executa operações de dados
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      Model Layer                        │
│   src/models/ (Abstração e chamadas ao Prisma Client)   │
└───────────────────────────┬─────────────────────────────┘
                            │ Prisma ORM
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 PostgreSQL Database                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Estrutura de Pastas e Convenções

```text
GameCenter-Gamood/
├── prisma/              # Schema do banco de dados e migrações do Prisma ORM
│   ├── schema.prisma
│   └── migrations/
├── public/              # Assets estáticos (imagens, ícones, logos)
├── src/
│   ├── app/             # Rotas, layouts e views do Next.js (App Router)
│   ├── components/      # Componentes de UI reutilizáveis (botões, cards, modais)
│   ├── controllers/     # Regras de negócio, validações e tratamento de erros
│   ├── contexts/        # Contextos React (ex: AuthContext)
│   ├── hooks/           # Custom hooks React (ex: useAuth)
│   ├── lib/             # Módulos compartilhados (ex: prisma.js - Instância global do Prisma Client)
│   ├── models/          # Camada de abstração de dados (Serviços/Repositórios)
│   └── middleware.js    # Proteção de rotas autenticadas
├── docker-compose.yml   # Configuração do container PostgreSQL
├── package.json         # Dependências e scripts do projeto
├── roadmap.md           # Planejamento detalhado em Milestones e Issues
└── README.md            # Documentação principal
```

### 📋 O que vai em cada pasta:

- **`prisma/`**: Contém o arquivo `schema.prisma` que define toda a modelagem do banco de dados e as configurações de conexão. O Prisma gerencia as migrações automaticamente através da subpasta `migrations/`.
- **`public/`**: Arquivos estáticos que o Next.js serve diretamente na raiz do site (imagens, ícones, logos, banners).
- **`src/app/` (View Layer)**: Rotas do Next.js no padrão App Router. Contém as páginas (`page.js`), layouts persistentes (`layout.js`) e estados de carregamento (`loading.js`). Focada apenas em apresentar a interface ao usuário e disparar ações para os controllers.
- **`src/components/`**: Componentes visuais de interface (UI) reutilizáveis em múltiplas páginas (ex: botões personalizados, cards de exibição de jogos, badges de status, modais de confirmação). Devem ser agnósticos a regras de negócio.
- **`src/controllers/` (Controller Layer)**: Regras de negócio da aplicação. É onde ficam as validações de entrada, formatação de dados, orquestração de chamadas aos Models e tratamento de erros antes de responder à View.
- **`src/models/` (Model Layer)**: Camada de abstração de banco de dados. Contém funções de serviço que encapsulam o uso do `PrismaClient` para realizar consultas, inserções e transações, mantendo as regras de acesso a dados isoladas dos Controllers.
- **`src/contexts/`**: Provedores de estado global do React (ex: `AuthContext` para compartilhar dados do usuário logado entre componentes no client-side).
- **`src/hooks/`**: Custom hooks React para abstrair e reutilizar lógica do lado do cliente (ex: `useAuth`, `useModal`).
- **`src/lib/`**: Instâncias de bibliotecas e utilitários globais compartilhados, como a instância única do Prisma Client (`prisma.js`) e helpers auxiliares.
- **`src/middleware.js`**: Interceptador de requisições do Next.js. Executa antes de uma rota privada ser acessada para validar cookies de sessão/JWT e redirecionar usuários não autenticados.

---

## 📋 Pré-requisitos
## � Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18.x ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## 🚀 Instalação e Execução Local

### 1. Clonar o repositório

```bash
git clone https://github.com/eduRossetti/GameCenter-Gamood.git
cd GameCenter-Gamood
```

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# Banco de Dados
DATABASE_URL=postgres://postgres:postgres@localhost:5432/gamood_db
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gamood_db

# Autenticação
JWT_SECRET=sua_chave_secreta_super_segura_aqui
```

### 3. Iniciar o banco de dados via Docker

Suba a instância do PostgreSQL:

```bash
docker compose up -d
```

### 4. Instalar as dependências

```bash
npm install
```

### 5. Configurar o banco com Prisma e rodar os seeds

Inicialize as tabelas usando as migrações do Prisma e popule com dados de teste:

```bash
npx prisma migrate dev
npx prisma db seed
```

### 6. Executar o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar a aplicação.

---

## 🗄 Modelo de Dados
## � Modelo de Dados

O banco relacional é estruturado em torno de quatro entidades principais:

```mermaid
erDiagram
    USERS ||--o{ RESERVATIONS : "realiza"
    GAMES ||--o{ RESERVATIONS : "é alugado em"
    TIME_SLOTS ||--o| RESERVATIONS : "reserva"

    USERS {
        uuid id PK
        string name
        string email UK
        string password_hash
        timestamp created_at
    }

    GAMES {
        uuid id PK
        string title
        text description
        boolean available
        timestamp created_at
    }

    TIME_SLOTS {
        uuid id PK
        timestamp start_time
        timestamp end_time
        boolean is_available
    }

    RESERVATIONS {
        uuid id PK
        uuid user_id FK
        uuid game_id FK
        uuid time_slot_id FK
        string status
        timestamp created_at
    }
```

---

## 🗺 Roadmap de Desenvolvimento

O ciclo de desenvolvimento do projeto está organizado em **8 Milestones** progressivas (para detalhes das tarefas e critérios de aceite, consulte o arquivo [`roadmap.md`](./roadmap.md)):

- [ ] **Milestone 0: Fundação** — Setup do Next.js, container Docker PostgreSQL, Prisma ORM e estrutura MVC.
- [ ] **Milestone 1: Modelagem do Banco** — Definição do `schema.prisma`, migrações e scripts de seed.
- [ ] **Milestone 2: Autenticação** — Cadastro, login com hash `bcrypt`, sessões seguras e middleware de proteção.
- [ ] **Milestone 3: CRUD de Jogos** — Catálogo de jogos, formulários de criação, edição e remoção.
- [ ] **Milestone 4: CRUD de Horários** — Gerenciamento e listagem de blocos de horários livres e ocupados.
- [ ] **Milestone 5: Sistema de Reservas** — Fluxo integrado de agendamento e controle de concorrência com transações.
- [ ] **Milestone 6: Painel do Usuário** — Histórico individual de reservas, perfil do jogador e contexto global de auth.
- [ ] **Milestone 7: Polimento e Deploy** — Tratamento de estados de loading/erro, refinamento visual e deploy em produção.

---

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e profissionais de portfólio sob a licença [MIT](LICENSE).

Criado por [Eduardo Rossetti](https://github.com/eduRossetti).

