# 🎮 GameZone — CRUD de Aluguel de Jogos & Reserva de Horários

> Roadmap detalhado, já quebrado em **Issues prontas para colar no GitHub**. Cada Milestone abaixo vira uma *Milestone* do GitHub; cada bloco "Issue" vira uma *Issue* vinculada a ela (copie o título e o corpo direto).

## 🧱 Stack

| Camada          | Tecnologia                                 |
|-----------------|----------------------------------------------|
| Frontend        | Next.js + React (JavaScript)                 |
| Backend         | Next.js (Server Actions / API Routes) — MVC  |
| Banco de dados  | PostgreSQL (via Docker)                      |
| Driver          | `pg` (node-postgres)                         |
| Auth            | JWT ou cookie de sessão                      |

---

## 🏁 Milestone 0 — Fundação
**Descrição da Milestone:** Preparar o ambiente de desenvolvimento e a estrutura MVC do projeto antes de escrever qualquer regra de negócio.

### Issue: Criar projeto Next.js base
**Descrição:** Inicializar o projeto Next.js em JavaScript (sem TypeScript), usando o App Router.
**Tarefas:**
- [x] Rodar `npx create-next-app@latest` com App Router e JavaScript
- [x] Remover boilerplate/CSS de exemplo desnecessário
- [x] Subir o servidor local com `npm run dev` e confirmar que carrega
**Critério de aceite:** Projeto sobe localmente na porta padrão sem erros.
**Labels:** `milestone-0`, `setup`

---

### Issue: Subir PostgreSQL via Docker
**Descrição:** Criar um `docker-compose.yml` com um serviço de PostgreSQL para desenvolvimento local.
**Tarefas:**
- [ ] Criar `docker-compose.yml` com imagem `postgres` (definir versão)
- [ ] Definir usuário, senha e nome do banco via variáveis de ambiente
- [ ] Mapear porta 5432 e um volume para persistência dos dados
- [ ] Subir com `docker compose up -d` e validar conexão via DBeaver ou `psql`
**Critério de aceite:** Banco acessível localmente na porta 5432 com os dados persistindo entre restarts do container.
**Labels:** `milestone-0`, `infra`, `docker`

---

### Issue: Configurar pool de conexão com `pg`
**Descrição:** Criar o módulo central de acesso ao banco, que será importado por todos os Models.
**Tarefas:**
- [ ] Instalar `pg`
- [ ] Criar `.env` com `DATABASE_URL` (ou host/porta/usuário/senha separados)
- [ ] Criar `src/lib/db.js` exportando um `Pool` configurado
- [ ] Testar uma query simples (`SELECT NOW()`) a partir de uma rota de teste
**Critério de aceite:** Uma chamada de teste retorna dado real do banco via o pool configurado.
**Labels:** `milestone-0`, `backend`

---

### Issue: Estruturar pastas no padrão MVC
**Descrição:** Organizar o projeto para separar claramente Views (rotas Next), Controllers (regras de negócio) e Models (acesso a dados).
**Tarefas:**
- [x] Criar `src/controllers/`
- [x] Criar `src/models/`
- [x] Criar `src/components/` para componentes React reutilizáveis
- [x] Documentar a convenção no `README.md` (o que vai em cada pasta)
**Critério de aceite:** Estrutura de pastas criada e documentada no README.
**Labels:** `milestone-0`, `setup`

---

## 🏁 Milestone 1 — Modelagem do banco de dados
**Descrição da Milestone:** Desenhar o schema relacional que sustenta todo o domínio: usuários, jogos, horários e reservas.

### Issue: Criar tabela `users`
**Descrição:** Tabela de usuários do sistema.
**Tarefas:**
- [ ] Colunas: `id`, `name`, `email` (único), `password_hash`, `created_at`
- [ ] Script SQL de criação em `migrations/`
**Critério de aceite:** Tabela criada no banco via script versionado (não manualmente).
**Labels:** `milestone-1`, `database`

---

### Issue: Criar tabela `games`
**Descrição:** Catálogo de jogos disponíveis para aluguel.
**Tarefas:**
- [ ] Colunas: `id`, `title`, `description`, `available` (boolean), `created_at`
- [ ] Script SQL de criação
**Critério de aceite:** Tabela criada e validada com um `INSERT` manual de teste.
**Labels:** `milestone-1`, `database`

---

### Issue: Criar tabela `time_slots`
**Descrição:** Horários disponíveis para jogar (ex: blocos de 1h).
**Tarefas:**
- [ ] Colunas: `id`, `start_time`, `end_time`, `is_available` (boolean)
- [ ] Script SQL de criação
**Critério de aceite:** Tabela criada, aceitando horários futuros cadastrados manualmente.
**Labels:** `milestone-1`, `database`

---

### Issue: Criar tabela `reservations`
**Descrição:** Liga um usuário, um jogo e um horário — o núcleo do sistema.
**Tarefas:**
- [ ] Colunas: `id`, `user_id` (FK), `game_id` (FK), `time_slot_id` (FK), `status`, `created_at`
- [ ] Definir constraint de unicidade (não deixar dois usuários reservarem o mesmo `time_slot_id`)
**Critério de aceite:** Tabela criada com as três foreign keys funcionando (`ON DELETE` definido).
**Labels:** `milestone-1`, `database`

---

### Issue: Script de seed
**Descrição:** Popular o banco com dados de teste para desenvolvimento.
**Tarefas:**
- [ ] Seed com 3-5 usuários, 5-10 jogos, 10+ horários
- [ ] Rodar via `npm run seed` (script no `package.json`)
**Critério de aceite:** Rodar o comando de seed deixa o banco pronto para testar toda a aplicação manualmente.
**Labels:** `milestone-1`, `database`

---

## 🏁 Milestone 2 — Autenticação
**Descrição da Milestone:** Permitir que o usuário se cadastre, faça login e tenha rotas protegidas.

### Issue: Registro de usuário
**Descrição:** Formulário e lógica de criação de conta.
**Tarefas:**
- [ ] Página `/registro` com formulário controlado (`useState`)
- [ ] Controller `authController.js` com função `register`
- [ ] Hash de senha com `bcrypt` antes de salvar
- [ ] Validação de e-mail duplicado
**Critério de aceite:** Consigo criar uma conta e ela aparece no banco com a senha hasheada (nunca em texto puro).
**Labels:** `milestone-2`, `auth`, `frontend`

---

### Issue: Login
**Descrição:** Autenticação do usuário já cadastrado.
**Tarefas:**
- [ ] Página `/login` com formulário controlado
- [ ] Controller com função `login` comparando hash da senha
- [ ] Gerar JWT (ou cookie de sessão) ao autenticar com sucesso
- [ ] Salvar token em cookie `httpOnly`
**Critério de aceite:** Login bem-sucedido redireciona pra área logada e o cookie é enviado nas próximas requisições.
**Labels:** `milestone-2`, `auth`

---

### Issue: Middleware de proteção de rotas
**Descrição:** Impedir acesso a páginas privadas sem estar logado.
**Tarefas:**
- [ ] Criar `middleware.js` na raiz de `src/`
- [ ] Verificar presença/validade do token em rotas como `/reservas`, `/perfil`
- [ ] Redirecionar para `/login` se não autenticado
**Critério de aceite:** Acessar `/reservas` deslogado redireciona automaticamente para o login.
**Labels:** `milestone-2`, `auth`

---

### Issue: Logout
**Descrição:** Encerrar a sessão do usuário.
**Tarefas:**
- [ ] Botão de logout na interface
- [ ] Limpar cookie/token
**Critério de aceite:** Após logout, tentar acessar rota protegida redireciona pro login.
**Labels:** `milestone-2`, `auth`

---

## 🏁 Milestone 3 — CRUD de Jogos
**Descrição da Milestone:** Gerenciamento do catálogo de jogos (lado administrativo).

### Issue: Listagem de jogos
**Descrição:** Exibir todos os jogos cadastrados.
**Tarefas:**
- [ ] Server Component que busca jogos via `gameModel.getAll()`
- [ ] Exibir em cards/lista com nome, descrição e disponibilidade
**Critério de aceite:** Página `/jogos` lista todos os jogos existentes no banco.
**Labels:** `milestone-3`, `frontend`

---

### Issue: Criar jogo
**Descrição:** Formulário de cadastro de novo jogo.
**Tarefas:**
- [ ] Formulário controlado (Client Component) com `useState`
- [ ] Server Action ou API Route chamando `gameController.create`
- [ ] Validação de campos obrigatórios
**Critério de aceite:** Novo jogo criado aparece na listagem sem precisar dar refresh manual.
**Labels:** `milestone-3`, `frontend`, `backend`

---

### Issue: Editar jogo
**Descrição:** Atualizar dados de um jogo existente.
**Tarefas:**
- [ ] Página/modal de edição pré-preenchido com dados atuais
- [ ] Server Action chamando `gameController.update`
**Critério de aceite:** Alteração salva reflete na listagem imediatamente.
**Labels:** `milestone-3`, `frontend`, `backend`

---

### Issue: Remover jogo
**Descrição:** Excluir um jogo do catálogo.
**Tarefas:**
- [ ] Botão de exclusão com confirmação
- [ ] Server Action chamando `gameController.delete`
- [ ] Tratar caso o jogo tenha reservas ativas (impedir ou avisar)
**Critério de aceite:** Jogo removido some da listagem; regra de reserva ativa é respeitada.
**Labels:** `milestone-3`, `backend`

---

## 🏁 Milestone 4 — CRUD de Horários
**Descrição da Milestone:** Gerenciar os horários disponíveis para os usuários reservarem.

### Issue: Cadastrar horário
**Descrição:** Criar novos blocos de horário disponíveis.
**Tarefas:**
- [ ] Formulário com seleção de data/hora de início e fim
- [ ] Controller `timeSlotController.create`
**Critério de aceite:** Horário criado aparece como "disponível" na listagem.
**Labels:** `milestone-4`, `frontend`, `backend`

---

### Issue: Listar horários (livres/ocupados)
**Descrição:** Exibir todos os horários com status visual.
**Tarefas:**
- [ ] `useEffect` ou Server Component buscando horários
- [ ] Indicador visual de disponível vs ocupado
**Critério de aceite:** Usuário consegue diferenciar visualmente horários livres dos ocupados.
**Labels:** `milestone-4`, `frontend`

---

### Issue: Editar/cancelar horário
**Descrição:** Alterar ou remover um horário cadastrado.
**Tarefas:**
- [ ] Ação de editar horário (se ainda sem reserva)
- [ ] Ação de cancelar horário (cancela reserva vinculada, se houver, com aviso)
**Critério de aceite:** Não é possível editar um horário já reservado sem tratamento explícito.
**Labels:** `milestone-4`, `backend`

---

## 🏁 Milestone 5 — Sistema de Reservas (núcleo do projeto)
**Descrição da Milestone:** Unir jogo, horário e usuário em uma reserva, com as regras de negócio mais importantes do sistema.

### Issue: Fluxo de reserva (jogo + horário)
**Descrição:** Tela onde o usuário escolhe um jogo e um horário disponível.
**Tarefas:**
- [ ] Página `/reservas/nova` com seleção de jogo e horário
- [ ] Lifting state up entre os componentes de seleção
- [ ] Server Action chamando `reservationController.create`
**Critério de aceite:** Usuário logado consegue concluir uma reserva de ponta a ponta.
**Labels:** `milestone-5`, `frontend`, `backend`

---

### Issue: Validação de conflito de horário
**Descrição:** Impedir que dois usuários reservem o mesmo horário.
**Tarefas:**
- [ ] Checagem no Controller antes do `INSERT`
- [ ] Usar transação (`BEGIN`/`COMMIT`) para evitar condição de corrida
- [ ] Retornar erro claro para o frontend se o horário já foi ocupado
**Critério de aceite:** Duas tentativas simultâneas de reservar o mesmo horário resultam em apenas uma reserva confirmada.
**Labels:** `milestone-5`, `backend`

---

### Issue: Cancelamento de reserva
**Descrição:** Usuário cancela uma reserva já feita.
**Tarefas:**
- [ ] Botão de cancelar na listagem de reservas do usuário
- [ ] Controller libera o `time_slot` novamente como disponível
**Critério de aceite:** Ao cancelar, o horário volta a aparecer como disponível para outros usuários.
**Labels:** `milestone-5`, `backend`

---

## 🏁 Milestone 6 — Painel do usuário
**Descrição da Milestone:** Área logada com histórico e perfil, usando estado de autenticação global.

### Issue: Histórico de reservas
**Descrição:** Listar as reservas passadas e futuras do usuário logado.
**Tarefas:**
- [ ] Página `/minhas-reservas`
- [ ] Query filtrando por `user_id` do usuário autenticado
**Critério de aceite:** Usuário só vê as próprias reservas, nunca as de outros usuários.
**Labels:** `milestone-6`, `frontend`, `backend`

---

### Issue: Contexto global de autenticação
**Descrição:** Compartilhar dados do usuário logado por toda a aplicação sem prop drilling.
**Tarefas:**
- [ ] Criar `AuthContext` com `useContext`
- [ ] Criar hook customizado `useAuth()`
- [ ] Substituir onde fizer sentido no lugar de passar `user` via props manualmente
**Critério de aceite:** Qualquer componente consegue acessar o usuário logado via `useAuth()`.
**Labels:** `milestone-6`, `frontend`

---

### Issue: Página de perfil
**Descrição:** Usuário visualiza e edita seus próprios dados.
**Tarefas:**
- [ ] Página `/perfil` com dados do usuário
- [ ] Formulário de edição (nome, e-mail)
**Critério de aceite:** Alteração de dados reflete no `AuthContext` sem precisar de novo login.
**Labels:** `milestone-6`, `frontend`, `backend`

---

## 🏁 Milestone 7 — Polimento e Deploy
**Descrição da Milestone:** Deixar o projeto apresentável e publicamente acessível.

### Issue: Estilização geral
**Descrição:** Aplicar um visual consistente em toda a aplicação.
**Tarefas:**
- [ ] Escolher entre Tailwind ou CSS Modules
- [ ] Aplicar em todas as páginas já construídas
**Critério de aceite:** Aplicação com visual consistente, sem CSS inline espalhado.
**Labels:** `milestone-7`, `frontend`

---

### Issue: Estados de loading e erro
**Descrição:** Tratar estados intermediários e falhas de forma amigável.
**Tarefas:**
- [ ] `loading.js` nas rotas principais
- [ ] `error.js` para captura de erros de renderização
- [ ] Mensagens de erro amigáveis nos formulários
**Critério de aceite:** Nenhuma tela em branco ou erro cru exibido ao usuário.
**Labels:** `milestone-7`, `frontend`

---

### Issue: Deploy
**Descrição:** Publicar a aplicação.
**Tarefas:**
- [ ] Deploy do frontend/backend Next.js na Vercel
- [ ] Banco gerenciado em produção (Neon, Supabase ou similar)
- [ ] Variáveis de ambiente configuradas em produção
**Critério de aceite:** Aplicação acessível publicamente via URL, funcionando com o banco de produção.
**Labels:** `milestone-7`, `deploy`

---

### Issue: README final
**Descrição:** Documentar o projeto para quem for ver o repositório.
**Tarefas:**
- [ ] Descrição do projeto e prints de tela
- [ ] Instruções de setup local (Docker + `.env` + seed)
- [ ] Stack utilizada
**Critério de aceite:** Alguém de fora consegue rodar o projeto localmente só seguindo o README.
**Labels:** `milestone-7`, `docs`

---

## ✅ Como usar

1. Crie 8 **Milestones** no GitHub (`Milestone 0` a `Milestone 7`), usando a descrição de cada uma acima.
2. Para cada bloco **Issue** acima, crie uma Issue nova: título = título do bloco, corpo = descrição + tarefas + critério de aceite.
3. Vincule a Issue à Milestone correspondente e aplique as labels sugeridas.
4. Vá fechando as Issues conforme avança — o progresso da Milestone é calculado automaticamente pelo GitHub.
