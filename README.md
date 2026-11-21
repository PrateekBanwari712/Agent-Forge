# Agent-Forge

A visual AI agent builder and workflow runtime built with **Next.js (App Router)**, **TypeScript**, and **Prisma**. Design multi-node agent workflows on an interactive canvas, attach built-in or custom HTTP tools, connect GitHub integrations, and test agents in a real-time streaming playground.

---

## Key Features

- **Visual Node-Based Agent Builder**: Construct and connect `Start`, `Agent`, `Model`, `Memory`, `Tool`, and `End` nodes on an interactive workflow canvas with live node configuration panels and graph serialization.
- **Workflow Validation & Compilation Runtime**: Validates workflow graph topology (`validate-graph`), compiles canvas definitions into executable pipelines (`compile-workflow`), and executes agent runs via streaming API routes (`/api/agents/[agentId]/runs`).
- **Extensible Tooling Ecosystem**:
  - **Built-in Tools**: Web search, webpage reader, calculator, weather lookup, and GitHub repository operations.
  - **Custom HTTP Tools**: Define custom API endpoints, headers, and parameters directly inside the builder UI.
- **Interactive Streaming Playground**: Test configured agents in real time through a dedicated chat interface backed by a streaming client.
- **Templates & Agent Management**: Start from prebuilt agent templates or create custom agents from scratch with persistent storage and conversation history.
- **Authentication**: Built-in user authentication and session handling protecting dashboard routes and user-owned agents.

---

## Project Structure

```text
Agent-Forge/
├── app/
│   ├── (auth)/                  # Authentication routes (/login)
│   ├── (dashboard)/             # Protected dashboard routes (/agents, /agents/new, /agents/[agentId]/builder)
│   └── api/
│       ├── agents/[agentId]/runs/ # Streaming agent execution endpoint
│       └── auth/[...all]/       # Auth handler routes
├── components/
│   └── ui/                      # Reusable UI primitives (shadcn/ui)
├── lib/                         # Core utilities, auth setup, DB client, and icon mappings
├── modules/
│   ├── agents/                  # Agent CRUD actions, React Query hooks, templates, and cards
│   ├── auth/                    # Auth actions and session UI components
│   ├── builder/                 # Visual canvas, node components, settings panels, and Zustand store
│   ├── playground/              # Chat panel UI and streaming response client
│   ├── runtime/                 # Graph validation, workflow compilation, and execution engine
│   ├── tools/                   # Tool registry, GitHub client, custom HTTP runner, and built-in tools
│   └── workflows/               # Workflow schema definitions and v1 migration utilities
├── prisma/
│   ├── migrations/              # Database migration history
│   └── schema.prisma            # Database schema (Users, Agents, Conversations, Auth models)
├── prisma7.config.ts            # Prisma configuration
└── package.json
```

---

## Tech Stack

- **Framework**: Next.js (App Router) & React
- **Language**: TypeScript
- **Database & ORM**: Prisma ORM (`prisma/schema.prisma`)
- **State & Data Fetching**: Zustand (canvas state) & TanStack Query (server state)
- **Styling & UI**: Tailwind CSS & shadcn/ui components

---

## Getting Started

### 1. Prerequisites

- **Node.js** `18.18+` or `20+`
- **npm** (or `pnpm` / `yarn`)
- A supported database instance configured for Prisma

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/PrateekBanwari712/Agent-Forge.git
cd Agent-Forge
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env` and populate the required environment variables (database URL, authentication secrets, model provider API keys, and GitHub tokens/OAuth credentials):

```bash
cp .env.example .env
```

### 4. Database Setup

Run Prisma migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

*(If using the custom Prisma 7 config file, pass `--config prisma7.config.ts` to Prisma CLI commands as needed.)*

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser, sign in, and navigate to `/agents` to create or build an agent.

---

## Architecture Overview

1. **Design (`modules/builder`)**: Users assemble nodes (`Start`, `Model`, `Memory`, `Tool`, `Agent`, `End`) on the canvas. State is managed in `canvas-store.ts` and serialized via `serialize.ts` into a structured workflow schema (`modules/workflows`).
2. **Validate & Compile (`modules/runtime`)**: Before execution, `validate-graph.ts` verifies node connections and structural integrity, while `compile-workflow.ts` resolves models, memory settings, and registered tools from `modules/tools/lib/registry.ts`.
3. **Execute & Stream (`app/api/agents/[agentId]/runs` & `modules/playground`)**: Incoming user prompts trigger `run-agent.ts` / `run-agent-node.ts`, executing tool calls (including GitHub and custom HTTP requests) and streaming responses back to the playground chat panel.

---
