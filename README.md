# Creator Agent Field Guide

A free, public, hands-on course for content creators who want to understand and build autonomous AI agents without starting from a computer-science textbook.

The course uses a fictional **creator agent lab**. It does not expose or copy Sharlet's private code. Instead, it teaches the architecture and decisions needed to build a similar class of product independently:

- TypeScript, pnpm workspaces, and Turborepo
- Effect services, Layers, schemas, and typed failures
- PostgreSQL and Drizzle migrations
- Glove agent loops, tools, skills, memory, and Foundry
- fixture-first and bounded live Apify research
- reference assets and image-generation lineage
- scheduled autonomy with exact-version human approval
- creator-facing product design
- end-to-end tests, security, deployment, and operations

## Run locally

Requirements: Node.js 22+ and pnpm 10.28+.

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints, normally `http://localhost:5173`.

## Verify a production build

```bash
pnpm typecheck
pnpm build
pnpm preview
```

## Course design

The 13 stages move through five phases:

1. **Orient** — translate a creator routine into an agent system.
2. **Foundation** — set up the workbench, learn useful TypeScript, create a monorepo, use Effect, and persist data in PostgreSQL.
3. **Intelligence** — build the Glove loop, add skills and memory, research with Apify, and generate assets with lineage.
4. **Autonomy** — schedule durable, idempotent runs and design the creator control surface.
5. **Ship** — test, secure, deploy, and operate the capstone.

Every stage includes:

- a creator-world analogy;
- explicit learning outcomes;
- a slow, ordered build path;
- runnable or illustrative code blocks;
- common detours;
- a completion checklist; and
- a teach-back prompt saved only in the learner's browser.

Progress is stored in browser `localStorage`. The course has no backend, analytics, account system, or API keys.

## Publishing

The public course is hosted with OpenAI Sites. The included GitHub Actions workflow type-checks and builds the exact source on every change to `main`.

## Teaching

See [docs/teaching-guide.md](docs/teaching-guide.md) for a suggested learning rhythm and facilitation notes.

## Security

This repository intentionally contains no credentials and ignores `.env` files. All provider examples use placeholders or fixture implementations. Never commit OpenRouter, Apify, ElevenLabs, database, or deployment credentials.

## License

MIT. Use it, remix it, teach with it, and improve it.
