export type CodeBlock = {
  title: string;
  language: string;
  code: string;
  note?: string;
};

export type CourseStep = {
  title: string;
  body: string;
  why?: string;
};

export type CourseModule = {
  id: string;
  number: number;
  phase: "Orient" | "Foundation" | "Intelligence" | "Autonomy" | "Ship";
  title: string;
  subtitle: string;
  time: string;
  outcome: string;
  creatorAnalogy: string;
  objectives: string[];
  steps: CourseStep[];
  codeBlocks: CodeBlock[];
  checkpoint: string[];
  pitfalls: string[];
  teachBack: string;
};

export const phases = ["Orient", "Foundation", "Intelligence", "Autonomy", "Ship"] as const;

export const modules: CourseModule[] = [
  {
    id: "start-here",
    number: 0,
    phase: "Orient",
    title: "Start here: turn your creative routine into a system",
    subtitle: "No code yet. First, learn what you are actually building.",
    time: "35 min",
    outcome: "You can explain an AI agent in everyday language and draw the workflow it will automate.",
    creatorAnalogy: "An agent is a junior producer with a brief, a toolkit, a notebook, and permission rules. The model is only the producer’s reasoning voice—not the whole studio.",
    objectives: [
      "Separate an AI model from an agent and from an application",
      "Turn a morning content routine into inputs, decisions, outputs, and approvals",
      "Choose a small first version without losing the long-term architecture"
    ],
    steps: [
      {
        title: "Write the real routine",
        body: "Describe one normal morning with verbs: watch, save, compare, choose, write, shoot, review. Do not mention AI yet.",
        why: "Agents automate decisions and actions. A vague goal like ‘manage social media’ hides both."
      },
      {
        title: "Mark the boundaries",
        body: "Circle what the system may do alone. Put a stop sign beside publishing, spending money, deleting assets, or changing the brand voice.",
        why: "Autonomy is a permission design problem before it is a model problem."
      },
      {
        title: "Choose the first complete loop",
        body: "Use this loop: collect five signals, choose one angle, create one script and one image brief, then wait for review.",
        why: "One complete loop teaches more than ten disconnected features."
      }
    ],
    codeBlocks: [
      {
        title: "Your first system map",
        language: "text",
        code: `INPUTS\n  brand brief + reference media + public trend signals\n        ↓\nAGENT LOOP\n  observe → choose → use a tool → inspect result → continue\n        ↓\nOUTPUTS\n  angle + script + shot list + image brief\n        ↓\nHUMAN GATE\n  approve, request changes, or reject`,
        note: "Keep this map beside you. Every future package should fit one box."
      }
    ],
    checkpoint: [
      "I can say what the model does and what the surrounding software does",
      "I have written one specific creator workflow",
      "I know which actions always require a human"
    ],
    pitfalls: [
      "Starting with ‘make an autonomous agency’ instead of one complete loop",
      "Treating the model response as trustworthy data",
      "Adding publishing before versioned approval exists"
    ],
    teachBack: "Explain the four boxes—inputs, loop, outputs, gate—to a friend without using the words LLM, API, runtime, or orchestration."
  },
  {
    id: "workbench",
    number: 1,
    phase: "Foundation",
    title: "Set up your workbench",
    subtitle: "Install the few tools that let you build, run, and recover your project.",
    time: "60–90 min",
    outcome: "Your computer can run Node, pnpm, Git, Docker, and a TypeScript file.",
    creatorAnalogy: "This is preparing the studio before a shoot: charged batteries, labeled cards, clean lenses, and a place for every file.",
    objectives: [
      "Understand the terminal as a text-based way to operate your computer",
      "Verify each tool instead of assuming installation worked",
      "Create a Git history you can safely return to"
    ],
    steps: [
      { title: "Install Node 22 LTS", body: "Install Node from nodejs.org or a version manager. Open a new terminal and verify it.", why: "Node runs TypeScript’s compiled JavaScript outside the browser." },
      { title: "Enable pnpm", body: "Run corepack enable, then install the course package-manager version.", why: "pnpm installs packages efficiently and understands workspaces." },
      { title: "Install Git and Docker Desktop", body: "Git records code changes. Docker gives you a repeatable PostgreSQL database without manual database setup." },
      { title: "Create a learning folder", body: "Make one folder named creator-agent-lab. Open only that folder in your editor.", why: "A clear project boundary prevents accidental edits elsewhere on your computer." }
    ],
    codeBlocks: [
      {
        title: "Verify the workbench",
        language: "bash",
        code: `node --version\ncorepack enable\ncorepack prepare pnpm@10.28.2 --activate\npnpm --version\ngit --version\ndocker --version\n\nmkdir creator-agent-lab\ncd creator-agent-lab\ngit init`,
        note: "Every version command should print a version, not ‘command not found’."
      },
      {
        title: "Create the first safe checkpoint",
        language: "bash",
        code: `printf "# Creator Agent Lab\\n" > README.md\ngit add README.md\ngit commit -m "Start creator agent lab"`
      }
    ],
    checkpoint: ["node --version works", "pnpm --version works", "docker --version works", "git log shows my first commit"],
    pitfalls: ["Pasting commands without noticing which folder you are in", "Skipping a new terminal window after installation", "Putting API keys in README.md"],
    teachBack: "Point to Node, pnpm, Git, and Docker and say one sentence about the job of each."
  },
  {
    id: "typescript",
    number: 2,
    phase: "Foundation",
    title: "Learn the TypeScript you actually need",
    subtitle: "Model the things in your creator workflow before writing clever code.",
    time: "2–3 hours",
    outcome: "You can represent brands, signals, assets, and content packets with checked types.",
    creatorAnalogy: "Types are call-sheet fields. If ‘location’ is required, the shoot cannot quietly proceed without one.",
    objectives: ["Read objects, arrays, functions, unions, and async functions", "Use types to make impossible states harder to create", "Validate unknown outside data at the boundary"],
    steps: [
      { title: "Describe nouns as types", body: "Start with BrandProfile, TrendSignal, MediaAsset, and ContentPacket. Use names a creator recognizes." },
      { title: "Use unions for real choices", body: "A platform can be tiktok or instagram. A packet status can be drafting, in_review, approved, or rejected." },
      { title: "Treat network data as unknown", body: "A scraper, model, or form can return unexpected shapes. Validate before the rest of your program trusts it." },
      { title: "Keep transformations pure", body: "Write small functions that turn validated inputs into new values without reaching into global state." }
    ],
    codeBlocks: [
      {
        title: "Domain language first",
        language: "ts",
        code: `type Platform = "tiktok" | "instagram";\ntype PacketStatus = "drafting" | "in_review" | "approved" | "rejected";\n\ntype TrendSignal = {\n  platform: Platform;\n  sourceUrl: string;\n  hook: string;\n  score: number;\n};\n\ntype ContentPacket = {\n  id: string;\n  angle: string;\n  script: string;\n  status: PacketStatus;\n  evidence: TrendSignal[];\n};\n\nconst readyForReview = (packet: ContentPacket): ContentPacket => ({\n  ...packet,\n  status: "in_review"\n});`
      },
      {
        title: "Validate the outside world",
        language: "ts",
        code: `import { Schema } from "effect";\n\nconst TrendSignal = Schema.Struct({\n  platform: Schema.Literal("tiktok", "instagram"),\n  sourceUrl: Schema.String,\n  hook: Schema.String,\n  score: Schema.Number.pipe(Schema.between(0, 100))\n});\n\nconst decodeSignal = Schema.decodeUnknown(TrendSignal);`
      }
    ],
    checkpoint: ["I can read a type error without panicking", "My platform and status values are finite choices", "Unknown provider data is validated once at the boundary"],
    pitfalls: ["Using any to silence every type error", "Creating database-shaped names instead of creator-shaped names", "Confusing a TypeScript type with runtime validation"],
    teachBack: "Explain why TypeScript can catch a misspelled status, but cannot prove that an HTTP response tells the truth."
  },
  {
    id: "monorepo",
    number: 3,
    phase: "Foundation",
    title: "Build a monorepo without getting lost",
    subtitle: "Give the website, agent, database, and shared language separate homes.",
    time: "90 min",
    outcome: "You have a pnpm/Turborepo with independently testable apps and packages.",
    creatorAnalogy: "A monorepo is one production building with separate rooms: edit suite, prop room, archive, and control desk. Shared hallways prevent duplicate equipment.",
    objectives: ["Know why packages have boundaries", "Wire workspace dependencies", "Run checks across the entire project with Turbo"],
    steps: [
      { title: "Create apps and packages", body: "Use apps/web and apps/runtime for processes. Use packages/domain, database, integrations, and agent for reusable capabilities." },
      { title: "Name workspace packages", body: "Give each package a scoped name such as @studio/domain. Depend on it with workspace:* so local code is linked." },
      { title: "Add one root command", body: "The root should run build, typecheck, and test across the graph. A newcomer should not memorize package order." },
      { title: "Enforce direction", body: "Apps may depend on packages. Domain should not depend on web, database, or provider packages." }
    ],
    codeBlocks: [
      {
        title: "Folder map",
        language: "text",
        code: `creator-agent-lab/\n├── apps/\n│   ├── runtime/       # autonomous agent process\n│   └── web/           # creator-facing control surface\n├── packages/\n│   ├── domain/        # shared creator language\n│   ├── database/      # persistence\n│   ├── integrations/  # Apify, models, image providers\n│   └── agent/         # prompt, skills, tool definitions\n├── package.json\n├── pnpm-workspace.yaml\n└── turbo.json`
      },
      {
        title: "Root scripts",
        language: "json",
        code: `{
  "private": true,
  "packageManager": "pnpm@10.28.2",
  "scripts": {
    "dev": "turbo run dev --parallel",
    "check": "turbo run typecheck test build"
  },
  "devDependencies": { "turbo": "^2.5.0", "typescript": "^5.9.0" }
}`
      }
    ],
    checkpoint: ["pnpm install succeeds from the root", "pnpm check visits every package", "Domain imports no provider or UI code"],
    pitfalls: ["Making one giant shared package", "Importing source through ../../.. paths", "Putting business rules inside a page component"],
    teachBack: "Draw the dependency arrows. If an arrow points from domain to web, explain why that is suspicious."
  },
  {
    id: "effect",
    number: 4,
    phase: "Foundation",
    title: "Use Effect as the operating system",
    subtitle: "Make failures, dependencies, retries, and cleanup visible in the code.",
    time: "3–4 hours",
    outcome: "One creator workflow runs as a typed Effect program with replaceable services.",
    creatorAnalogy: "Effect is a production plan that lists the crew you need, the problems that can happen, and the result you expect—before call time.",
    objectives: ["Read Effect<A, E, R> as success, error, requirements", "Create services and Layers", "Use tagged errors instead of throwing strings", "Add controlled retry and timeout policies"],
    steps: [
      { title: "Read the three channels", body: "Effect<Packet, ResearchError, ResearchService> says what succeeds, what fails, and what must be provided." },
      { title: "Define a service contract", body: "Describe what research can do without deciding whether Apify, fixtures, or another provider does it." },
      { title: "Supply implementations with Layers", body: "Use a fixture Layer in tests and an Apify Layer in production." },
      { title: "Name operational failures", body: "Timeout, provider rejection, invalid payload, and budget exceeded deserve different errors and recovery decisions." }
    ],
    codeBlocks: [
      {
        title: "A replaceable research service",
        language: "ts",
        code: `import { Context, Data, Effect, Layer } from "effect";\n\nclass ResearchError extends Data.TaggedError("ResearchError")<{\n  message: string;\n}> {}\n\nclass Research extends Context.Tag("Research")<Research, {\n  findSignals: (topics: string[]) => Effect.Effect<TrendSignal[], ResearchError>\n}>() {}\n\nconst FixtureResearch = Layer.succeed(Research, {\n  findSignals: (topics) => Effect.succeed(\n    topics.map((hook, index) => ({\n      platform: "tiktok" as const,\n      sourceUrl: \`fixture://signal/\${index}\`,\n      hook,\n      score: 70 + index\n    }))\n  )\n});`
      },
      {
        title: "Compose the workflow",
        language: "ts",
        code: `const morningResearch = Effect.gen(function* () {\n  const research = yield* Research;\n  const signals = yield* research.findSignals(["evening ritual", "sober curious"]);\n  return signals.toSorted((a, b) => b.score - a.score).slice(0, 5);\n}).pipe(\n  Effect.timeout("30 seconds"),\n  Effect.retry({ times: 2 }),\n  Effect.provide(FixtureResearch)\n);`
      }
    ],
    checkpoint: ["My workflow does not call process.env everywhere", "Tests can replace the live provider Layer", "Timeout and retry behavior is explicit"],
    pitfalls: ["Wrapping every one-line function in Effect", "Catching all errors and returning an empty array", "Reading secrets inside domain code"],
    teachBack: "Read one Effect type aloud as: succeeds with…, can fail with…, needs…."
  },
  {
    id: "postgres",
    number: 5,
    phase: "Foundation",
    title: "Give the agent durable memory with PostgreSQL",
    subtitle: "Store evidence, brand context, assets, runs, and approvals as real records.",
    time: "3–4 hours",
    outcome: "The agent can restart without forgetting the creator or inventing its history.",
    creatorAnalogy: "PostgreSQL is the studio archive and production log. Chat history is only one shelf inside it.",
    objectives: ["Run PostgreSQL locally with Docker", "Model provenance and status explicitly", "Use Drizzle migrations", "Separate repositories from agent reasoning"],
    steps: [
      { title: "Start one local database", body: "Use Docker Compose with a named volume. A container can be replaced without deleting the archive." },
      { title: "Design records around questions", body: "Can we prove where this trend came from? Which asset influenced this image? Which exact version was approved?" },
      { title: "Write migrations", body: "A migration is a versioned change to the archive. Commit it alongside the code that expects it." },
      { title: "Create repositories", body: "The agent asks a repository to savePacket or listEvidence. It should not write SQL inside a tool description." }
    ],
    codeBlocks: [
      {
        title: "Local PostgreSQL",
        language: "yaml",
        code: `services:\n  postgres:\n    image: postgres:17-alpine\n    environment:\n      POSTGRES_DB: creator_agent\n      POSTGRES_USER: studio\n      POSTGRES_PASSWORD: studio\n    ports: ["5432:5432"]\n    volumes: ["creator_data:/var/lib/postgresql/data"]\nvolumes:\n  creator_data:`
      },
      {
        title: "Approval belongs to an exact version",
        language: "ts",
        code: `export const contentVersions = pgTable("content_versions", {\n  id: uuid("id").primaryKey().defaultRandom(),\n  packetId: uuid("packet_id").notNull(),\n  version: integer("version").notNull(),\n  body: jsonb("body").notNull(),\n  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()\n});\n\nexport const approvals = pgTable("approvals", {\n  id: uuid("id").primaryKey().defaultRandom(),\n  contentVersionId: uuid("content_version_id").notNull(),\n  approvedBy: text("approved_by").notNull(),\n  approvedAt: timestamp("approved_at", { withTimezone: true }).notNull().defaultNow()\n});`
      }
    ],
    checkpoint: ["docker compose ps says healthy", "A fresh database can run every migration", "Every scraped signal has source provenance", "Approvals reference immutable content versions"],
    pitfalls: ["Storing only the latest draft", "Treating model output as the source of truth", "Saving binary assets directly in random local folders"],
    teachBack: "Explain why ‘approved packet 42’ is unsafe unless the approval identifies packet 42’s exact version."
  },
  {
    id: "glove-agent",
    number: 6,
    phase: "Intelligence",
    title: "Build the agent loop with Glove",
    subtitle: "Give the model a role, a small toolkit, and observable turns.",
    time: "3 hours",
    outcome: "A server-side Glove agent can choose and run typed tools while preserving its conversation.",
    creatorAnalogy: "Glove is the stage manager. It hands the producer the brief, tracks the conversation, calls departments, and records what happened.",
    objectives: ["Configure a server-side agent", "Design narrow tools", "Distinguish tool data from UI render data", "Observe tool calls and model turns"],
    steps: [
      { title: "Write a precise system prompt", body: "State the agent’s job, evidence rules, available outputs, and approval boundary. Do not hide product rules in marketing copy." },
      { title: "Create one tool per capability", body: "Research signals, read brand memory, create a packet, and request approval are separate contracts." },
      { title: "Keep tools deterministic", body: "The model chooses a tool. The tool validates input, runs business code, and returns a factual result." },
      { title: "Subscribe to events", body: "Record tool start, tool result, token use, and final response. Observability is part of production behavior." }
    ],
    codeBlocks: [
      {
        title: "A minimal server agent",
        language: "ts",
        code: `import { Glove, Displaymanager, createAdapter } from "glove-core";\nimport { z } from "zod";\n\nexport const agent = new Glove({\n  model: createAdapter({ provider: "openrouter", stream: true }),\n  displayManager: new Displaymanager(),\n  serverMode: true,\n  systemPrompt: "You are a creator strategist. Use evidence. Never publish.",\n  compaction_config: {\n    compaction_instructions: "Preserve decisions, evidence IDs, and pending approvals."\n  }\n})\n  .fold({\n    name: "list_trend_signals",\n    description: "Read recent evidence already stored for this creator.",\n    inputSchema: z.object({ limit: z.number().int().min(1).max(20) }),\n    async do({ limit }) {\n      const rows = await evidenceRepository.listRecent(limit);\n      return { status: "success", data: rows };\n    }\n  })\n  .build();`
      }
    ],
    checkpoint: ["The agent has fewer than ten focused tools", "Every tool input is validated", "The prompt says never publish", "Tool events are logged without secrets"],
    pitfalls: ["One giant do_everything tool", "Letting tool descriptions grant authority", "Returning sensitive client data to the model unnecessarily"],
    teachBack: "For one agent turn, narrate: user message → model choice → tool → tool result → model continuation."
  },
  {
    id: "skills-memory",
    number: 7,
    phase: "Intelligence",
    title: "Teach skills and memory without bloating the prompt",
    subtitle: "Give the agent reusable craft knowledge and the right memory at the right time.",
    time: "2–3 hours",
    outcome: "Brand context, research practice, channel craft, and publishing safety are modular and testable.",
    creatorAnalogy: "A skill is a department playbook. Memory is the archive. The main prompt is the call sheet—not the entire studio handbook.",
    objectives: ["Know when to use a prompt, skill, tool, or memory record", "Keep ambient creator preferences small", "Delegate deep retrieval to bounded subagents"],
    steps: [
      { title: "Separate permanent rules from optional expertise", body: "Safety and role stay in the system prompt. Research method and channel craft become named skills." },
      { title: "Store facts outside prompt text", body: "Brand voice, audience, boundaries, and active campaign live in structured records with timestamps." },
      { title: "Retrieve only what matters", body: "A content request should not load every old campaign. Ask a retrieval subagent for the relevant slice." },
      { title: "Test skill activation", body: "A skill should change decisions in observable ways, not merely add inspirational prose." }
    ],
    codeBlocks: [
      {
        title: "A small, explicit skill",
        language: "ts",
        code: `agent.defineSkill({\n  name: "research-first",\n  description: "Use when proposing content from current public signals.",\n  exposeToAgent: true,\n  handler: async ({ source, args }) => [\n    "Before proposing an angle:",\n    "1. Retrieve persisted evidence.",\n    "2. Cite evidence IDs in the packet.",\n    "3. Separate observation from inference.",\n    "4. Say when evidence is too weak.",\n    source === "agent" ? \`Current focus: \${args ?? "general"}\` : ""\n  ].join("\\n")\n});`
      },
      {
        title: "Prompt, skill, tool, or memory?",
        language: "text",
        code: `SYSTEM PROMPT  permanent identity + non-negotiable rules\nSKILL          reusable method the agent can invoke\nTOOL           action with validated input and a factual result\nMEMORY         durable creator facts and past events\nSUBAGENT       bounded reasoning with a smaller tool surface`
      }
    ],
    checkpoint: ["Brand facts are structured and timestamped", "Skills are short enough to inspect", "Deep memory search is not dumped on the main agent", "A test proves each skill changes behavior"],
    pitfalls: ["Calling a very long system prompt a memory system", "Saving model guesses as brand facts", "Giving the main agent every memory mutation tool"],
    teachBack: "Take ‘never show alcohol to minors’ and ‘write better TikTok hooks.’ Place each in the correct mechanism and explain why."
  },
  {
    id: "research",
    number: 8,
    phase: "Intelligence",
    title: "Build an evidence pipeline with Apify",
    subtitle: "Collect public signals as data; do not let scraped text become instructions.",
    time: "4 hours",
    outcome: "Fixture and live research travel through the same validation, normalization, deduplication, scoring, and persistence path.",
    creatorAnalogy: "A scraper is a research assistant dropping clippings on your desk. The clippings are evidence, never the creative director.",
    objectives: ["Create a provider boundary", "Normalize different platform shapes", "Use fixtures before spending live credits", "Track source, time, and cost"],
    steps: [
      { title: "Start with realistic fixtures", body: "Save small TikTok, Instagram, Reddit, and review payloads that resemble provider responses and are clearly labeled synthetic." },
      { title: "Normalize once", body: "Convert provider-specific rows into one TrendSignal shape. Keep the raw payload for debugging, not for everyday reasoning." },
      { title: "Deduplicate and score", body: "Use stable external IDs or normalized URLs. Make freshness, engagement, relevance, and source diversity separate score inputs." },
      { title: "Add a bounded live smoke test", body: "Limit results, duration, and maximum spend. A test should fail clearly when the token is missing." }
    ],
    codeBlocks: [
      {
        title: "Provider data is untrusted",
        language: "ts",
        code: `const NormalizedSignal = Schema.Struct({\n  provider: Schema.Literal("apify"),\n  platform: Schema.Literal("tiktok", "instagram", "reddit", "reviews"),\n  externalId: Schema.String,\n  sourceUrl: Schema.String,\n  text: Schema.String,\n  observedAt: Schema.DateFromString,\n  metrics: Schema.Record({ key: Schema.String, value: Schema.Number }),\n  rawPayload: Schema.Unknown\n});\n\nconst safeText = (text: string) =>\n  text.replaceAll(/ignore previous instructions/gi, "[untrusted instruction removed]");`
      },
      {
        title: "One boundary, two implementations",
        language: "text",
        code: `ResearchClient\n├── FixtureResearchClient   → deterministic, free, CI-safe\n└── ApifyResearchClient     → live actors, budgets, timeouts\n             ↓\n       normalize → dedupe → score → persist\n             ↓\n         EvidenceRepository`
      }
    ],
    checkpoint: ["Fixtures use the production normalization path", "Live smoke tests have hard item and spend limits", "Scraped text is never inserted into the system prompt as trusted instructions", "Every signal can be traced to a source URL"],
    pitfalls: ["Writing dashboard rows directly in the fixture seed", "Scoring only by likes", "Sending an API token in a query string", "Allowing provider text to redefine the agent’s job"],
    teachBack: "Explain the difference between ‘TikTok says this hook is trending’ and ‘a stored observation suggests this hook deserves investigation.’"
  },
  {
    id: "assets-generation",
    number: 9,
    phase: "Intelligence",
    title: "Turn brand assets into scripts, shots, and images",
    subtitle: "Preserve lineage from the creator’s source media to every generated deliverable.",
    time: "4–5 hours",
    outcome: "A content packet can use selected reference media and produce structured deliverables plus a generated image with provenance.",
    creatorAnalogy: "A source asset is not just an upload. It is a casting reference, prop reference, location reference, or visual constraint with usage notes.",
    objectives: ["Store asset metadata and binaries safely", "Create a coherent content packet before rendering", "Condition image generation on selected assets", "Record model and prompt lineage"],
    steps: [
      { title: "Ask how the asset should be used", body: "Label it product, person, place, previous shoot, style reference, video, audio, or document. Capture consent and restrictions where relevant." },
      { title: "Create one structured packet", body: "Angle, evidence, script, shot list, caption, visual direction, and platform notes should agree before image generation starts." },
      { title: "Generate through a provider service", body: "The agent calls generateImage with a prompt and asset IDs. The service resolves files, calls the provider, and persists the result." },
      { title: "Save lineage", body: "Record source asset IDs, model, prompt, provider request ID, cost, created time, and content version." }
    ],
    codeBlocks: [
      {
        title: "Image generation request",
        language: "ts",
        code: `type ImageRequest = {\n  contentVersionId: string;\n  prompt: string;\n  referenceAssetIds: string[];\n  aspectRatio: "1:1" | "4:5" | "9:16";\n};\n\nconst generateCampaignFrame = (request: ImageRequest) =>\n  Effect.gen(function* () {\n    const assets = yield* AssetRepository.resolveMany(request.referenceAssetIds);\n    const image = yield* ImageProvider.generate({ ...request, assets });\n    return yield* AssetRepository.saveGenerated({\n      ...image,\n      lineage: request\n    });\n  });`
      }
    ],
    checkpoint: ["Uploads have a declared usage role", "Every generated asset links to a content version", "The provider key never enters the database", "A failed image does not erase the completed script"],
    pitfalls: ["Putting base64 files in model-visible tool data", "Generating visuals before the content direction is coherent", "Losing the prompt and source-asset lineage"],
    teachBack: "Pick one product photo and narrate its path from upload to a generated 9:16 scene, including every record you need for an audit."
  },
  {
    id: "autonomy",
    number: 10,
    phase: "Autonomy",
    title: "Make it autonomous without making it reckless",
    subtitle: "Schedule durable runs, isolate failures, and keep publishing behind a human gate.",
    time: "4 hours",
    outcome: "The agent wakes on a creator-defined cadence, resumes context, creates work, and stops at review.",
    creatorAnalogy: "Autonomy is a recurring production call. The crew arrives on schedule, follows the same safety rules, leaves a call sheet, and never airs the spot without sign-off.",
    objectives: ["Distinguish interactive and scheduled runs", "Make runs idempotent", "Persist run state and errors", "Design exact-version approvals"],
    steps: [
      { title: "Store the creator’s routine", body: "Persist cadence, timezone, platforms, expected outputs, and the durable brief. Do not encode a user’s schedule only in a server cron string." },
      { title: "Create one run record first", body: "A unique run key such as routine + scheduled time prevents a retry from making duplicate packets." },
      { title: "Resume with persistent storage", body: "Triggered agents must use a store that survives subprocess restarts. In-memory history is not autonomy." },
      { title: "Stop at review", body: "Generation changes status to in_review. A different, permissioned pathway may later publish only the approved version." }
    ],
    codeBlocks: [
      {
        title: "Idempotent scheduled run",
        language: "ts",
        code: `const executeRoutine = (routine: CreatorRoutine, scheduledFor: Date) =>\n  Effect.gen(function* () {\n    const runKey = \`\${routine.id}:\${scheduledFor.toISOString()}\`;\n    const existing = yield* RunRepository.findByKey(runKey);\n    if (existing?.status === "completed") return existing;\n\n    const run = yield* RunRepository.start({ runKey, routineId: routine.id });\n    return yield* createContentPacket(routine).pipe(\n      Effect.tap((packet) => RunRepository.complete(run.id, packet.id)),\n      Effect.tapError((error) => RunRepository.fail(run.id, error))\n    );\n  });`
      },
      {
        title: "The non-negotiable gate",
        language: "text",
        code: `scheduled run → research → draft → generate → IN REVIEW\n                                                   │\n                                        creator approves v3\n                                                   │\n                                  publisher verifies approval(v3)\n                                                   │\n                                                publish v3\n\nAny edit creates v4. Approval(v3) cannot publish v4.`
      }
    ],
    checkpoint: ["Retrying the same schedule does not duplicate content", "Run failures are visible and resumable", "The schedule respects the creator’s timezone", "No generation tool can publish"],
    pitfalls: ["Using setInterval inside the web process", "Treating a retry as a brand-new run", "Letting approval be a boolean on a mutable draft"],
    teachBack: "Explain why a scheduled run needs both a persistent agent store and a separate run record."
  },
  {
    id: "creator-ui",
    number: 11,
    phase: "Autonomy",
    title: "Design the creator control surface",
    subtitle: "Hide the machinery without hiding what the agent is doing.",
    time: "3–4 hours",
    outcome: "A non-technical creator can set up, run, inspect, and review the system using familiar language.",
    creatorAnalogy: "The interface is a production desk, not an engine room. Show today’s work, sources, media, content, and brand kit—not queues, actors, and database rows.",
    objectives: ["Center the daily job", "Use progressive disclosure for technical settings", "Show evidence and status without raw dumps", "Make review a focused deliverable workspace"],
    steps: [
      { title: "Use the creator’s nouns", body: "Today, Trends, Media library, Content, and Brand kit are primary. Provider actor configuration belongs under Advanced." },
      { title: "Give Today one main action", body: "Create today’s content should be unmistakable. Optional one-off direction should not overwrite the durable routine." },
      { title: "Show one deliverable at a time", body: "Let the creator choose Script, Shot list, Caption, Storyboard, or Generated frame in a familiar preview pane." },
      { title: "State the safety promise", body: "Say exactly what happens: You approve every post. The agent never publishes on its own." }
    ],
    codeBlocks: [
      {
        title: "Translate system terms",
        language: "text",
        code: `INTERNAL TERM             CREATOR-FACING TERM\nproduction packet         Content\nlistening source          Trend source\nasset record              Media item\ninstance schedule         Content routine\nmateriality score         Why it matters\nin_review                 Ready for review\nactor input               Advanced settings`
      },
      {
        title: "A UI boundary returns creator concepts",
        language: "ts",
        code: `type TodaySnapshot = {\n  nextRoutine: { label: string; localTime: string };\n  bestIdea: { title: string; score: number; sourceLabel: string } | null;\n  reviewCount: number;\n  newestContent: ContentSummary | null;\n  mediaPreview: MediaSummary[];\n};\n\n// The page never needs to understand provider run IDs or SQL rows.\nconst snapshot = await creatorDashboard.getToday(workspaceId);`
      }
    ],
    checkpoint: ["A creator can describe every navigation item", "The main daily action is visible without scrolling", "Raw provider payloads are not the trend page", "Review-ready content appears first"],
    pitfalls: ["Making the dashboard an observability console", "Showing every artifact expanded at once", "Calling a technical term ‘simple’ instead of translating it"],
    teachBack: "Ask a creator to complete the setup without coaching. Write down every word they hesitate on; those words are design bugs."
  },
  {
    id: "ship",
    number: 12,
    phase: "Ship",
    title: "Test, secure, deploy, and operate",
    subtitle: "Prove the whole loop with fixtures before trusting live providers or autonomous schedules.",
    time: "1–2 days",
    outcome: "Your capstone runs end to end in production with secrets, migrations, backups, health checks, and a review gate.",
    creatorAnalogy: "This is delivery day: final export, color check, music license, backups, client approval, and a plan for what happens if the upload fails.",
    objectives: ["Build a test pyramid around business risk", "Run a deterministic end-to-end fixture scenario", "Manage secrets and authentication", "Deploy web, runtime, and PostgreSQL separately"],
    steps: [
      { title: "Test rules before pixels", body: "Unit-test normalization, scoring, idempotency, version invalidation, and permission checks. These failures can harm trust even when the UI looks perfect." },
      { title: "Play the fixture movie", body: "Seed a fictional brand, trend sources, and a reference asset. Run the production workflow with fixture providers. Assert a review-ready packet and image lineage exist." },
      { title: "Add bounded live smoke tests", body: "Test one small provider call at a time with hard spend and item limits. Never make live calls part of ordinary CI." },
      { title: "Deploy three concerns", body: "Use managed PostgreSQL, a continuously running Foundry/runtime service, and a web service. Keep the runtime port private." },
      { title: "Operate what you shipped", body: "Add health checks, structured logs, alerts, backups, migration discipline, and a kill switch for schedules." }
    ],
    codeBlocks: [
      {
        title: "One command must prove the repository",
        language: "json",
        code: `{
  "scripts": {
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "build": "turbo run build",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
}`
      },
      {
        title: "Capstone acceptance test",
        language: "text",
        code: `GIVEN\n  a fictional brand + creator routine + trend fixtures + product image\nWHEN\n  the scheduled creator workflow runs twice for the same time\nTHEN\n  one run completes\n  one content packet is Ready for review\n  its evidence points to normalized fixture signals\n  its image points to the product source asset\n  no publication record exists\n  editing the packet invalidates the prior approval`
      }
    ],
    checkpoint: ["pnpm check passes from a clean clone", "The fixture E2E test spends no money", "Production secrets exist only in a secret manager", "PostgreSQL backups and restore steps are documented", "A creator can pause future schedules"],
    pitfalls: ["Calling mocked UI rows an end-to-end test", "Logging provider tokens", "Running the autonomous runtime as a short-lived web function", "Deploying without a database restore rehearsal"],
    teachBack: "Give a five-minute production readiness review: what can fail, how you notice, how you recover, and what the agent is never allowed to do."
  }
];

export const glossary = [
  ["Agent", "Software that lets a model reason in a loop, use tools, inspect results, and continue toward a goal."],
  ["Model", "The language or multimodal reasoning engine. It does not provide memory, permissions, schedules, or databases by itself."],
  ["Tool", "A named capability with validated input and a factual result."],
  ["Runtime", "The long-running process that executes agent turns and scheduled work."],
  ["Effect", "A TypeScript library for describing success, typed failure, dependencies, concurrency, retries, and cleanup."],
  ["Layer", "An Effect recipe that supplies a service implementation, such as fixtures in tests or Apify in production."],
  ["Schema", "A runtime rule for checking unknown data before the application trusts it."],
  ["Migration", "A versioned, repeatable change to a database structure."],
  ["Provenance", "Evidence of where data or generated work came from and how it was produced."],
  ["Idempotent", "Safe to retry without creating duplicate effects."],
  ["Fixture", "A checked-in example provider response used for deterministic tests."],
  ["Human gate", "A required human decision before a sensitive action such as publishing."],
  ["Monorepo", "One repository containing multiple apps and packages with explicit dependency boundaries."],
  ["Foundry", "Glove’s service runtime for agents, schedules, durable state, tools, and inspection."],
  ["Content version", "An immutable snapshot of a draft. Approval must point to one exact version."]
] as const;
