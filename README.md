# Project Card Manager

**Creator:** Jennipher Troup · [girlwithstarryeyes@outlook.com](mailto:girlwithstarryeyes@outlook.com)

A full-stack TypeScript monorepo powering a portfolio site and project management system. Built with pnpm workspaces, TypeScript 5.9 composite project references, and an OpenAPI 3.1 codegen pipeline. The canvas physics engine handles real-time multi-pointer impulse handling via WebWorkers and Rapier.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 6, TypeScript 5.9 |
| Backend | Express 5, Node.js |
| Database | PostgreSQL + Drizzle ORM |
| API Spec | OpenAPI 3.1 → Orval codegen |
| Physics | Rapier (WASM) + WebWorker + Svelte multi-pointer |
| Monorepo | pnpm workspaces + TS composite project refs |
| Styling | CSS custom properties, no UI framework |

---

## Architecture

```
project-card-manager/
├── apps/
│   ├── web/          # React/Vite portfolio site
│   └── api/          # Express 5 server
├── packages/
│   ├── ui/           # Shared component library
│   ├── db/           # Drizzle ORM schema + migrations
│   └── openapi/      # OpenAPI spec + Orval config
└── pnpm-workspace.yaml
```

---

## Physics Engine

The canvas physics layer uses a WebWorker architecture for real-time soft-body and rigid-body simulation:

- **Impulse encoding** — 12-byte header + 32-byte records per pointer event, transferred as `ArrayBuffer` (zero-copy)
- **Multi-pointer handling** — per-`pointerId` state map with `setPointerCapture` on `pointerdown`
- **Worker loop** — decodes impulse buffer, applies to active cards only (bitmask), steps physics, computes `restMask`
- **Rapier integration** — rigid-body `applyImpulseAtPoint` or soft-body vertex distribution depending on card type
- **Energy proxy** — lightweight `card.energy` accumulator for rest detection without full physics query

---

## OpenAPI Codegen Pipeline

1. Author API in `packages/openapi/openapi.yaml` (OpenAPI 3.1)
2. Run `pnpm codegen` → Orval generates typed React Query hooks + Zod validators
3. Express routes are typed against the same schema via `openapi-typescript`
4. Single source of truth: the spec. Types flow in both directions.

---

## Running Locally

```bash
pnpm install
pnpm db:push          # push schema to local postgres
pnpm dev              # starts web + api concurrently
```

Requires: Node 20+, pnpm 9+, PostgreSQL 15+

---

## Design Doctrine

This project is a working proof of the same constraint-based philosophy behind the Morphica design systems: TypeScript composite project references enforce package boundaries the same way a material constraint enforces design integrity. The type system is the architecture.

---

girlwithstarryeyes@outlook.com · Philadelphia, PA
