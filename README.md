# Creator Agent Field Guide

A free, public, code-guided course for content creators who want to understand and build autonomous AI agents without starting from a computer-science textbook.

The course uses the complete public [Sharlet codebase](https://github.com/porkytheblack/sharlet) as its production reference. Lessons explain the architecture and decisions first, then link directly to the files that implement them:

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

Open the local URL printed by Vinext.

## Verify a production build

```bash
pnpm typecheck
pnpm build
pnpm start
```

## Course design

The course contains **37 guided units across 12 chapters**. It begins with the complete system trace, then repeatedly zooms into one software boundary at a time and ends with a learner-facing capstone:

1. creator routine → system boundaries;
2. workbench → monorepo → domain language;
3. Effect services → PostgreSQL/Drizzle persistence;
4. Glove reasoning → Foundry runtime → bounded specialists;
5. fixture-first Apify research → asset and generation lineage;
6. durable schedules → exact-version approvals → creator UI;
7. end-to-end verification → secure production operations.

Every unit includes:

- a plain-language and technical mental model;
- a description of where the unit sits in the end-to-end flow;
- three detailed explanations of responsibility and tradeoffs;
- exact paths in the public reference repository;
- ordered learning activities, with executable commands and expected results whenever the unit changes or verifies code;
- an embedded, line-numbered code workspace;
- checkpoints, a knowledge check, and an explain-back note; and
- per-step and per-unit progress stored in the learner's browser; unit completion requires every activity, a passed knowledge check, and an explain-back note.

## Public production reference

Sharlet is public and intended to be read alongside the course. It contains the actual TypeScript monorepo, Effect integrations, Drizzle/PostgreSQL persistence, Glove/Foundry agent, bounded research tools, specialist definitions, schedules, web control surface, migrations, and tests.

```bash
git clone https://github.com/porkytheblack/sharlet.git
cd sharlet
pnpm install
pnpm check
```

The checked-in tests and research fixtures are credential-free and deterministic. Live-provider smoke tests remain explicit, bounded later steps. The smaller [`reference/creator-agent-lab`](reference/creator-agent-lab) remains available as an optional scratch implementation, but the course links and embedded excerpts use Sharlet itself as the source of truth.

Progress is stored in browser `localStorage`. The course has no backend, analytics, account system, or API keys.

## Publishing

The public course is live at [creator-agent-field-guide.denv.chatgpt.site](https://creator-agent-field-guide.denv.chatgpt.site) and hosted with OpenAI Sites. The included GitHub Actions workflow type-checks and builds the exact source on every change to `main`.

## Teaching

See [docs/teaching-guide.md](docs/teaching-guide.md) for a suggested learning rhythm and facilitation notes.

## Security

This repository intentionally contains no credentials and ignores `.env` files. All provider examples use placeholders or fixture implementations. Never commit OpenRouter, Apify, ElevenLabs, database, or deployment credentials.

## License

MIT. Use it, remix it, teach with it, and improve it.
