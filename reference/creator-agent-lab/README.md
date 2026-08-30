# Creator Agent Lab

This is the neutral reference application used by the Creator Agent Field Guide. It is intentionally not Sharlet's source code. It is a smaller, teachable system that preserves the same production boundaries:

- domain contracts describe creator concepts;
- Effect services describe integrations and failures;
- repositories own durable state;
- Glove gives the model a bounded tool loop;
- Foundry owns instances, schedules, conversations, and autonomous runs;
- the web boundary reads creator-facing projections instead of runtime internals;
- publishing is impossible without approval of an exact immutable version.

The course links to these files directly. Build them in chapter order rather than copying the whole folder before you understand it.

## Start the lab

```bash
cp -R reference/creator-agent-lab ~/creator-agent-lab
cd ~/creator-agent-lab
corepack enable
pnpm install
pnpm check
pnpm --filter @creator-lab/runtime dev
```

The development runtime uses Foundry's in-memory data adapter. Chapter 5 replaces the application data and conversation-store seams with PostgreSQL implementations. That split is deliberate: learn the run loop first, then make it durable without changing the agent definition.

## Read the project in this order

1. `packages/domain/src/models.ts` — the language of the product.
2. `packages/integrations/src/research.ts` — one interface, fixture and live implementations.
3. `packages/database/src/schema.ts` — what must survive a restart.
4. `apps/runtime/agents/creator/tools/research.tool.ts` — how stored capability becomes an agent tool.
5. `apps/runtime/agents/creator/agent.ts` — how Foundry assembles the complete agent.
6. `docs/run-trace.md` — one request traced through every layer.

Never put real credentials in this folder. `.env.example` contains names only.
