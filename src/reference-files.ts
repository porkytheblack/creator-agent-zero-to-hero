export type ReferenceFile = {
  path: string;
  language: string;
  purpose: string;
  code: string;
};

// These are selected excerpts from the public Sharlet repository. The GitHub
// link in the code workspace always opens the complete, current source file.
export const referenceFiles: ReferenceFile[] = [
  {
    path: "README.md",
    language: "md",
    purpose: "Sharlet's public entry point explains product intent, package ownership, local operation, provider boundaries, and production topology.",
    code: `# Sharlet

Sharlet is an autonomous, evidence-led creator studio. It continuously
researches public signals, combines them with durable brand memory and the
creator's own reference media, and produces shoot-ready creative work.

## Architecture

- apps/runtime — autonomous Foundry service
- apps/web — human operator console and controlled API boundary
- packages/database — Drizzle schema, repositories, conversation store,
  and Foundry data adapter
- packages/integrations — Effect-native Apify and image generation
- packages/agent — system prompt and operational skills
- packages/domain — shared Effect Schema contracts`,
  },
  {
    path: "package.json",
    language: "json",
    purpose: "The root package is the monorepo control plane. It coordinates checks without owning product code.",
    code: `{
  "name": "sharlet",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@10.28.2",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
}`,
  },
  {
    path: "pnpm-workspace.yaml",
    language: "yaml",
    purpose: "The workspace declares apps and packages as one installable dependency graph.",
    code: `packages:
  - "apps/*"
  - "packages/*"

onlyBuiltDependencies:
  - "esbuild"`,
  },
  {
    path: "turbo.json",
    language: "json",
    purpose: "Turborepo records task dependencies, caches deterministic work, and keeps development processes persistent.",
    code: `{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "typecheck": { "dependsOn": ["^typecheck"] },
    "lint": { "dependsOn": ["^lint"] },
    "test": { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "dev": { "cache": false, "persistent": true }
  }
}`,
  },
  {
    path: ".env.example",
    language: "bash",
    purpose: "Configuration names are public; real credentials stay in local or hosted secret stores.",
    code: `OPENROUTER_API_KEY=
OPENROUTER_MODEL=anthropic/claude-sonnet-4
OPENROUTER_IMAGE_MODEL=google/gemini-3.1-flash-image
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
DATABASE_URL=
PGLITE_DATA_DIR=
APIFY_API_TOKEN=
FOUNDRY_URL=http://127.0.0.1:4141
SHARLET_WORKSPACE_ID=aster-house
SHARLET_OPERATOR_PASSWORD=
SHARLET_SESSION_SECRET=`,
  },
  {
    path: "compose.yaml",
    language: "yaml",
    purpose: "Local PostgreSQL mirrors the durable production database boundary without embedding it inside application processes.",
    code: `services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: sharlet
      POSTGRES_USER: sharlet
      POSTGRES_PASSWORD: sharlet
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sharlet -d sharlet"]`,
  },
  {
    path: "packages/domain/src/models.ts",
    language: "ts",
    purpose: "Effect Schema gives the product one provider-independent vocabulary for programs, media, artifacts, projects, requests, and responses.",
    code: `import { Schema } from "effect";

export const CreatorProgram = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  initialPrompt: Schema.String.pipe(Schema.minLength(3)),
  timezone: Schema.String,
  cadence: CreatorCadence,
  platforms: Schema.Array(Channel),
  outputTypes: Schema.Array(Schema.Literal(
    "script", "shot_list", "storyboard", "image", "caption",
    "photoshoot_brief", "video_treatment"
  )),
  status: Schema.Literal("active", "paused")
});

export const CreativeProject = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  creativeThesis: Schema.String,
  trendSummary: Schema.String,
  status: Schema.Literal("planning", "producing", "in_review", "approved", "archived", "failed"),
  sourceAssetIds: Schema.Array(Schema.String),
  artifacts: Schema.Array(CreativeArtifact)
});`,
  },
  {
    path: "packages/integrations/src/apify.ts",
    language: "ts",
    purpose: "The real Effect-native Apify boundary owns authorization, cost and item bounds, timeout, retry, provider decoding, and normalization.",
    code: `import { Data, Effect, Schedule, Schema } from "effect";

export class ResearchProviderError extends Data.TaggedError("ResearchProviderError")<{
  readonly operation: "configuration" | "request" | "decode";
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class ApifyResearchClient {
  harvest(source: HarvestSource): Effect.Effect<
    ReadonlyArray<NormalizedObservation>, ResearchProviderError
  > {
    if (!this.options.token) {
      return Effect.fail(new ResearchProviderError({
        operation: "configuration",
        message: "APIFY_API_TOKEN is not configured"
      }));
    }

    // Build one bounded actor request, then decode and normalize the dataset.
    // The complete file shows headers, charge ceiling, timeout, retry schedule,
    // heterogeneous field mapping, and safe fallbacks.
  }
}`,
  },
  {
    path: "packages/integrations/src/apify-fixtures.ts",
    language: "ts",
    purpose: "Synthetic Reddit, TikTok, Instagram, and review payloads retain provider differences and are explicitly marked as fixtures.",
    code: `const fixture = (rows: ReadonlyArray<Record<string, unknown>>) =>
  rows.map((row) => ({ ...row, _fixture: true }));

export const fixtureResearchPayloads = {
  reddit: fixture([{ id: "reddit-1", title: "...", score: 188 }]),
  tiktok: fixture([{ id: "tiktok-1", text: "...", playCount: 248000 }]),
  instagram: fixture([{ id: "instagram-1", caption: "...", likesCount: 9200 }]),
  reviews: fixture([{ reviewId: "review-1", reviewText: "...", rating: 5 }])
};

// Open the complete file to inspect realistic heterogeneous fixture shapes.`,
  },
  {
    path: "packages/integrations/src/apify.test.ts",
    language: "ts",
    purpose: "Contract tests prove that provider-shaped payloads cross the production HTTP and normalization boundary with limits intact.",
    code: `describe("ApifyResearchClient", () => {
  it("normalizes heterogeneous actor rows", async () => {
    const client = new ApifyResearchClient({ token: "fixture-token", fetch });
    const observations = await Effect.runPromise(client.harvest(source));

    expect(observations).toHaveLength(2);
    expect(observations[0]).toMatchObject({
      sourceKind: "instagram",
      sourceLabel: "Creator watch"
    });
  });

  it("fails explicitly without a token", async () => {
    const exit = await Effect.runPromiseExit(client.harvest(source));
    expect(Exit.isFailure(exit)).toBe(true);
  });
});`,
  },
  {
    path: "packages/integrations/src/openrouter-images.ts",
    language: "ts",
    purpose: "Image generation is a typed Effect boundary that accepts selected references and returns bytes plus safe lineage metadata.",
    code: `export interface GenerateImageInput {
  readonly prompt: string;
  readonly model?: string;
  readonly aspectRatio?: "1:1" | "3:2" | "2:3" | "4:3" | "3:4" | "16:9" | "9:16" | "21:9";
  readonly references?: ReadonlyArray<ImageReference>;
}

export class OpenRouterImageClient {
  generate(input: GenerateImageInput): Effect.Effect<GeneratedImage, ImageGenerationError> {
    return Effect.tryPromise({
      try: async () => {
        if (!this.#token) throw new Error("OPENROUTER_API_KEY is not configured");
        // POST one bounded generation request with at most fourteen references.
        // Decode base64 into bytes; return model, MIME type, revised prompt, usage.
      },
      catch: (cause) => new ImageGenerationError({ operation: "OpenRouter image generation", cause })
    });
  }
}`,
  },
  {
    path: "packages/database/src/schema.ts",
    language: "ts",
    purpose: "Drizzle tables split records by lifecycle and encode workspace scope, relationships, status, and uniqueness in PostgreSQL.",
    code: `export const creatorPrograms = pgTable("creator_programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: text("organization_id").notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  initialPrompt: text("initial_prompt").notNull().default(""),
  timezone: text("timezone").notNull().default("UTC"),
  cadence: jsonb("cadence").notNull(),
  platforms: jsonb("platforms").notNull(),
  outputTypes: jsonb("output_types").notNull(),
  status: creatorProgramStatus("status").notNull().default("active"),
  ...timestamps
}, (table) => [uniqueIndex("creator_programs_org_uidx").on(table.organizationId)]);

export const creativeProjects = pgTable("creative_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: text("organization_id").notNull(),
  creativeThesis: text("creative_thesis").notNull(),
  signalIds: jsonb("signal_ids").notNull(),
  sourceAssetIds: jsonb("source_asset_ids").notNull(),
  status: creativeProjectStatus("status").notNull().default("planning")
});`,
  },
  {
    path: "packages/database/src/repositories.ts",
    language: "ts",
    purpose: "Repositories are Effect programs: they own workspace-scoped queries, idempotent writes, error mapping, and product invariants.",
    code: `export class RepositoryError extends Data.TaggedError("RepositoryError")<{
  readonly operation: string;
  readonly cause: unknown;
}> {}

const query = <A>(operation: string, run: () => Promise<A>) =>
  Effect.tryPromise({
    try: run,
    catch: (cause) => new RepositoryError({ operation, cause })
  });

export const ensureWorkspace = (workspaceId: string, name = "Sharlet workspace") =>
  query("ensureWorkspace", async () => {
    const { db } = await database();
    await db.insert(organizations)
      .values({ id: workspaceId, name, slug: workspaceId })
      .onConflictDoNothing();
  });`,
  },
  {
    path: "packages/agent/src/prompt.ts",
    language: "ts",
    purpose: "The system prompt states durable creative policy and documents the real tool surface without pretending prompts enforce database guarantees.",
    code: `export const SHARLET_SYSTEM_PROMPT = \`You are Sharlet, an embedded social media strategist for a non-technical brand owner.

Operating principles:
- Research before recommendation. Name the signal behind an idea.
- Adapt the idea to each channel; never paste the same copy everywhere.
- Keep external publishing gated.
- Treat uploaded media as first-class creative references.
- A creator packet needs executable artifacts: full script, timed scenes,
  production direction, platform copy, and requested generated frames.

Tools:
- read_creator_studio(workspaceId)
- harvest_research_sources(workspaceId)
- read_research_signals(workspaceId, days?, limit?)
- persist_creative_package(...)
- generate_creative_image(...)
- request_content_approval(...)\`;`,
  },
  {
    path: "packages/agent/src/skills/research-first.ts",
    language: "ts",
    purpose: "A Glove skill is a focused procedure the parent or learner can invoke without bloating the permanent prompt.",
    code: `export const researchFirstSkill = {
  name: "research-first",
  description: "Ground campaign strategy in audience language, category movement, and competitive evidence.",
  exposeToAgent: true,
  handler: async ({ args }: { args?: string }) =>
    \`Research mode is active\${args ? \` for: \${args}\` : ""}. Separate observations from inference. Prefer current first-party customer language. State the signal behind every creative recommendation.\`
};`,
  },
  {
    path: "apps/runtime/package.json",
    language: "json",
    purpose: "The continuously running Foundry app declares Glove, Foundry, workbench, and workspace package dependencies.",
    code: `{
  "name": "@sharlet/runtime",
  "type": "module",
  "scripts": {
    "dev": "glove foundry dev",
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run --passWithNoTests"
  },
  "dependencies": {
    "@sharlet/agent": "workspace:*",
    "@sharlet/database": "workspace:*",
    "@sharlet/integrations": "workspace:*",
    "effect": "^3.22.1",
    "glove-core": "^3.6.0",
    "glove-foundry": "^0.1.0",
    "glove-js": "^0.1.0"
  }
}`,
  },
  {
    path: "apps/runtime/foundry.application.ts",
    language: "ts",
    purpose: "The Foundry application composition root chooses durable data, conversation storage, and inbound routes.",
    code: `import { DrizzleConversationStore, DrizzleFoundryDataAdapter, migrateDatabase } from "@sharlet/database";
import { defineApplication, defineInboundRoute } from "glove-foundry";

const database = await migrateDatabase();
export const data = new DrizzleFoundryDataAdapter(database.db);

export default defineApplication({
  name: "Sharlet",
  data,
  conversationStore: (scope) =>
    new DrizzleConversationStore(database.db, scope.conversationId),
  accounts: [],
  routes: [researchIngress],
  bindings: []
});`,
  },
  {
    path: "apps/runtime/foundry.config.ts",
    language: "ts",
    purpose: "Foundry runtime policy sets network binding, polling, concurrency, attempts, backoff, event retention, and route strictness.",
    code: `export default defineConfig({
  server: {
    host: process.env.FOUNDRY_HOST ?? "127.0.0.1",
    port: Number(process.env.FOUNDRY_PORT ?? 4141)
  },
  execution: {
    pollIntervalMs: 100,
    idlePollIntervalMs: 1_000,
    maxConcurrent: Number(process.env.FOUNDRY_MAX_CONCURRENT ?? 8),
    maxAttempts: 3,
    retryBackoffMs: 2_000
  },
  observability: { maxEvents: 50_000 },
  strictFileRoutes: true
});`,
  },
  {
    path: "apps/runtime/agents/sharlet/tools/research.tool.ts",
    language: "ts",
    purpose: "The model sees a narrow Glove tool; the implementation coordinates configured sources, bounded concurrency, Effect integrations, and repositories.",
    code: `export const harvestResearchTool: GloveFoldArgs<{ workspaceId: string }> = {
  name: "harvest_research_sources",
  description: "Run every active external research source and persist normalized observations.",
  inputSchema: z.object({ workspaceId: z.string().min(1) }),
  async do({ workspaceId }) {
    const program = Effect.gen(function* () {
      const sources = yield* listActiveResearchSources(workspaceId);
      const client = new ApifyResearchClient({
        token: process.env.APIFY_API_TOKEN ?? ""
      });
      const results = yield* Effect.forEach(sources, (source) =>
        client.harvest(toHarvestSource(source)).pipe(
          Effect.flatMap((rows) => saveObservations(workspaceId, source.id, rows)),
          Effect.catchAll((error) => Effect.succeed({ error: String(error) }))
        ), { concurrency: 3 });
      return summarize(results);
    });
    const data = await Effect.runPromise(program);
    return { status: "success" as const, data, generateSummaryArgs: data };
  }
};`,
  },
  {
    path: "apps/runtime/agents/sharlet/subagents.ts",
    language: "ts",
    purpose: "Research, strategy, and editorial specialists have isolated prompts, narrow tools, and explicit turn budgets.",
    code: `export const researchAnalyst = defineSubagent({
  name: "research-analyst",
  description: "Harvests configured sources and turns evidence into ranked signals.",
  systemPrompt: "Separate observation from inference, preserve URLs, flag weak evidence, and never invent a trend.",
  durable: true,
  serverMode: true,
  maxTurns: 10,
  tools: [harvestResearchTool, readResearchTool]
});

export const editorialReviewer = defineSubagent({
  name: "editorial-reviewer",
  description: "Reviews drafts for brand voice, evidence, channel fit, compliance, and repetition.",
  serverMode: true,
  maxTurns: 6,
  tools: [readBrandProfileTool, reviewCalendarTool]
});`,
  },
  {
    path: "apps/runtime/agents/sharlet/agent.ts",
    language: "ts",
    purpose: "This production definition assembles Glove reasoning and Foundry autonomy: model, prompt, skills, tools, specialists, schedules, workbench, and completion guards.",
    code: `export default defineAgent({
  description: "Autonomous, evidence-led social media manager with human-gated publishing",
  tags: ["social", "research", "strategy", "autonomous"],
  components,
  model: createSharletModel,
  systemPrompt: (_agent, context) => [
    SHARLET_SYSTEM_PROMPT,
    \`Foundry workspace: \${context.workspaceId}\`,
    \`Agent instance: \${context.agentId}\`,
    "Subagents are isolated. Pass every fact they need."
  ].join("\\n\\n"),
  skills: [brandVoiceSkill, researchFirstSkill, channelCraftSkill, safePublishingSkill],
  tools: [readBrandProfileTool, readCreatorStudioTool, harvestResearchTool,
    readResearchTool, persistCreativePackageTool, generateCreativeImageTool],
  subagents: [researchAnalyst, contentStrategist, editorialReviewer],
  schedules: (_agent, context) => schedulesFor(context.timezone),
  workingEnvironment: sharletWorkspace,
  repl: (_agent, context) => createSharletRepl(context.workspaceId, context.agentId),
  serverMode: true,
  maxTurns: 24,
  maxRetries: 2
});`,
  },
  {
    path: "apps/web/src/components/operator-console.tsx",
    language: "tsx",
    purpose: "The real creator UI projects system state into familiar work: Today, Trends, Media library, Content, and Brand kit.",
    code: `type View = "studio" | "radar" | "assets" | "production" | "brand";

const nav = [
  ["studio", "Today", Home],
  ["radar", "Trends", Search],
  ["assets", "Media library", Aperture],
  ["production", "Content", Clapperboard],
  ["brand", "Brand kit", BookOpen]
] as const;

export function OperatorConsole() {
  const [view, setView] = useState<View>("studio");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  const refresh = useCallback(async () => {
    const response = await fetch(
      "/api/operator/snapshot?workspace=aster-house",
      { cache: "no-store" }
    );
    setSnapshot(await response.json());
  }, []);

  // The complete component renders setup, live run state, evidence,
  // reference media, production packets, voice briefing, and review actions.
}`,
  },
  {
    path: "docs/architecture/run-trace.md",
    language: "md",
    purpose: "The course spine links each end-to-end transition to the actual Sharlet file that owns it.",
    code: `# Trace one Sharlet creator run

1. Durable creator intent is validated and persisted.
2. Foundry materializes autonomous work from the saved cadence.
3. Glove reasons inside the reconstructed run.
4. Research becomes normalized, persisted evidence.
5. Specialists receive bounded, explicit assignments.
6. One coherent production packet persists with asset lineage.
7. Human approval remains a separate authority.

creator intent
  → PostgreSQL records
  → Foundry schedule and run
  → Glove model/tool loop
  → Effect integration
  → normalized evidence
  → bounded specialist analysis
  → versioned production packet
  → creator-facing review
  → explicit human approval`,
  },
];

export const referenceFileByPath = new Map(referenceFiles.map((file) => [file.path, file]));
