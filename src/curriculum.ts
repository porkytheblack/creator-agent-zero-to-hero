export type LessonSection = {
  title: string;
  paragraphs: string[];
  callout?: { label: string; text: string };
};

export type GuidedStep = {
  action: string;
  detail: string;
  command?: string;
  expected?: string;
};

export type FileReference = {
  path: string;
  reason: string;
  focus?: string;
};

export type LessonUnit = {
  id: string;
  title: string;
  duration: string;
  promise: string;
  mentalModel: {
    plain: string;
    technical: string;
    connection: string;
  };
  sections: LessonSection[];
  files: FileReference[];
  steps: GuidedStep[];
  trace?: string[];
  checks: string[];
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
};

export type CourseChapter = {
  id: string;
  number: number;
  phase: "Understand" | "Construct" | "Intelligence" | "Autonomy" | "Operate";
  title: string;
  subtitle: string;
  milestone: string;
  units: LessonUnit[];
};

export const REPO_BASE = "https://github.com/porkytheblack/creator-agent-zero-to-hero/blob/main/reference/creator-agent-lab";

export const chapters: CourseChapter[] = ([
  {
    id: "system",
    number: 0,
    phase: "Understand",
    title: "See the whole system",
    subtitle: "Build the mental model before touching the implementation.",
    milestone: "You can trace one creator request through every layer and explain who owns each decision.",
    units: [
      {
        id: "model-vs-agent",
        title: "A model is not an agent",
        duration: "35 min",
        promise: "You will stop treating the LLM as the application and identify the software that makes it useful, durable, and safe.",
        mentalModel: {
          plain: "The model is one talented producer. The agent is the producer plus a brief, a call sheet, a crew, an archive, and rules about what requires sign-off.",
          technical: "A model maps input tokens to output tokens. An agent loop repeatedly asks the model what to do, validates a chosen tool call, executes software, returns observations, and continues until a stopping condition is met.",
          connection: "Glove owns that loop. Foundry reconstructs and runs the loop over time. Effect describes dependencies and failures. PostgreSQL stores truth. The web app exposes human controls."
        },
        sections: [
          {
            title: "Separate intelligence from authority",
            paragraphs: [
              "A language model can propose an angle or select a tool, but it should not secretly acquire permissions. Authority comes from the tool surface and the surrounding product. If no publishing tool is registered, prose cannot publish. If a tool requires an exact approval record, a persuasive model response cannot bypass it.",
              "This distinction changes how you debug. A weak caption may be a prompt or evidence problem. A duplicate scheduled run is a runtime or idempotency problem. A missing record is a repository problem. Calling all three an ‘AI issue’ prevents you from finding the owner."
            ],
            callout: { label: "Rule", text: "The model may choose among capabilities. Your software decides which capabilities exist and what they are allowed to do." }
          },
          {
            title: "Name the five kinds of state",
            paragraphs: [
              "Creator context describes the brand and audience. Evidence records describe the outside world. Conversation state explains the current reasoning thread. Run state explains operational progress and retries. Content state describes immutable versions and approval. They are related, but they are not interchangeable.",
              "A chat transcript cannot replace a database schema. It is useful context for the next model turn, but it is a poor answer to questions such as ‘which source supported this claim?’ or ‘which exact script did Don approve?’"
            ]
          },
          {
            title: "Read the course spine once",
            paragraphs: [
              "The reference trace follows one weekday morning: Foundry claims a scheduled run, Glove coordinates tool calls, an Effect service collects fixture or live research, repositories persist evidence, subagents perform bounded analysis, a content version is saved, and the web app shows it for review.",
              "Every later lesson zooms into one seam of this same run. You are not collecting unrelated libraries; you are replacing simplified pieces while preserving one comprehensible flow."
            ]
          }
        ],
        files: [
          { path: "docs/run-trace.md", reason: "This is the end-to-end spine for every chapter.", focus: "Read all twelve numbered steps before opening implementation files." },
          { path: "README.md", reason: "It names the responsibility of each package without exposing a product-specific codebase." }
        ],
        steps: [
          { action: "Draw five boxes", detail: "Write Model, Agent loop, Tools, Durable state, Human interface. Put one sentence under each." },
          { action: "Trace one prompt", detail: "Use ‘Make tomorrow’s TikTok script’ and write what must happen before a trustworthy script exists." },
          { action: "Mark authority", detail: "Circle every place that can create, update, approve, spend, delete, or publish." },
          { action: "Compare with the reference trace", detail: "Find the owner of each step in docs/run-trace.md. If you cannot name the owner, keep reading before coding." }
        ],
        trace: ["Creator request", "Glove decides", "Validated tool executes", "Repository persists", "Model observes", "Human reviews"],
        checks: ["I can distinguish model output from application state", "I can name the owner of scheduling, reasoning, persistence, and approval", "I understand why missing tools are a stronger safety boundary than prompt wording"],
        quiz: {
          question: "The model says ‘Published successfully,’ but the application has no publishing tool. What happened?",
          options: ["The post was published through the model", "The model produced ungrounded text; no external action occurred", "Foundry automatically published it", "PostgreSQL inferred the action"],
          answer: 1,
          explanation: "Models emit content and tool requests. External action requires registered software with the required authority."
        }
      },
      {
        id: "creator-routine",
        title: "Translate the creator’s morning",
        duration: "45 min",
        promise: "You will convert a vague ‘manage my social media’ goal into explicit inputs, decisions, outputs, and gates.",
        mentalModel: {
          plain: "Write the creator’s routine like a documentary editor: what arrives, what gets compared, what gets chosen, what gets made, and who says yes.",
          technical: "A workflow specification defines typed inputs, deterministic transformations, model decisions, side effects, persisted artifacts, and terminal states.",
          connection: "The workflow becomes domain schemas, tools, repositories, schedules, and UI states later. Poor vocabulary here creates poor architecture everywhere else."
        },
        sections: [
          { title: "Begin with verbs, not features", paragraphs: ["‘Trend dashboard’ is a feature. ‘Collect public clips, normalize them, compare recurring hooks, and preserve source URLs’ is a workflow. Verbs reveal the data and decisions your system must support.", "Write the routine without mentioning AI. This prevents the model from becoming a vague answer to every step and exposes tasks that ordinary software should own."] },
          { title: "Define the evidence contract", paragraphs: ["A trend is not a row with a large like count. The agent needs a source, observation time, platform, normalized text, stable identity, metrics, and an explanation of relevance to this creator.", "The system must preserve both observation and inference. ‘Three creators opened with a cold-shower confession this week’ is an observation. ‘Our audience will respond to vulnerable morning rituals’ is an inference that may be useful but must stay labeled."] },
          { title: "Define one complete output", paragraphs: ["A coherent packet binds angle, evidence IDs, script, timing, shot list, caption, visual direction, reference assets, and status. Creating isolated captions and images makes later review impossible because no one can tell whether they belong to the same creative thesis.", "Your first complete loop should stop at in_review. Publishing is a separate pathway that verifies a human approval against an immutable version."] }
        ],
        files: [{ path: "packages/domain/src/models.ts", reason: "The first implementation of the nouns discovered in the workflow.", focus: "Notice that evidence IDs live inside the content packet." }],
        steps: [
          { action: "Write a real 45-minute routine", detail: "Use timestamps and verbs: watch, save, compare, choose, write, shoot, review." },
          { action: "Classify every item", detail: "Label each as input, observation, inference, transformation, artifact, or approval." },
          { action: "Choose the minimum complete loop", detail: "Five signals → one angle → one script and shot list → in review." },
          { action: "Write the stop conditions", detail: "The run ends when a review-ready version exists, or when a typed failure is persisted and shown." }
        ],
        checks: ["My workflow names source evidence", "My output is one coherent packet", "My run has explicit success and failure endings", "Publishing is outside generation"],
        quiz: { question: "Which statement is an inference rather than an observation?", options: ["The video was observed on 2026-08-30", "The opening phrase appeared in four saved clips", "Our audience will buy because confessional hooks are trending", "The source URL points to TikTok"], answer: 2, explanation: "The purchase prediction interprets evidence and adds an uncertain causal claim." }
      },
      {
        id: "responsibility-map",
        title: "Assign every responsibility",
        duration: "40 min",
        promise: "You will know where code belongs before creating folders.",
        mentalModel: {
          plain: "A studio works because the editor does not also run payroll, archive footage, and approve legal claims from the same desk.",
          technical: "Architecture is a set of dependency directions and ownership boundaries. Each policy has one authoritative implementation and can be tested without unrelated infrastructure.",
          connection: "Domain stays provider-free. Integrations translate providers. Database repositories own persistence. Agent tools expose capabilities. Foundry owns execution. Web owns human interaction."
        },
        sections: [
          { title: "Use a dependency test", paragraphs: ["Ask whether a piece of code could change when the provider changes. If yes, it does not belong in the domain. Ask whether it can make an external change. If yes, it belongs behind a capability boundary and probably needs permission, idempotency, and observability.", "The direction should mostly flow from apps into packages and from adapters into stable contracts. Domain code should not import the web app, Apify, Foundry, or SQL clients."] },
          { title: "Put policy near the invariant", paragraphs: ["The exact-version approval check belongs at the publishing boundary and in durable records, not only in a system prompt. The maximum Apify spend belongs in the integration input. The creator-facing vocabulary belongs in a projection layer, not in database column names.", "Duplicated policy eventually disagrees. Prefer one authoritative check with tests, then let UI copy explain the result."] },
          { title: "Recognize orchestration", paragraphs: ["Orchestration coordinates several capabilities but should not absorb their implementation. ‘Collect evidence, rank it, create a version, request review’ is orchestration. HTTP parsing, SQL, and image bytes remain inside their services.", "Glove performs reasoning orchestration within a turn. Foundry performs temporal orchestration across instances, schedules, retries, and runs."] }
        ],
        files: [{ path: "README.md", reason: "The architecture list is a responsibility map." }, { path: "docs/run-trace.md", reason: "Each numbered step should map to one owner." }],
        steps: [
          { action: "Create a responsibility table", detail: "Columns: responsibility, owner package, input, output, failure, side effect." },
          { action: "Test dependency direction", detail: "For each package, list what it may import and what it must never import." },
          { action: "Locate safety rules", detail: "Move each rule from prompt-only language to the boundary that can enforce it." },
          { action: "Explain one full run aloud", detail: "Name an owner at every transition without using ‘the AI does it.’" }
        ],
        checks: ["Every side effect has a named owner", "Domain is independent from providers", "Temporal work belongs to Foundry", "Human interaction belongs to the web boundary"],
        quiz: { question: "Where should the rule ‘an edit invalidates the old approval’ be enforced?", options: ["Only in the model prompt", "Only in button copy", "In versioned persistence and the publishing boundary", "Inside the Apify actor"], answer: 2, explanation: "The system that stores versions and performs egress can enforce the invariant regardless of model behavior." }
      }
    ]
  },
  {
    id: "research",
    number: 8,
    phase: "Intelligence",
    title: "Build an evidence pipeline",
    subtitle: "Use realistic fixtures, bounded Apify acquisition, normalization, scoring, and provenance.",
    milestone: "Fixture and live provider data travel through the same validated persistence path and are clearly distinguishable.",
    units: [
      {
        id: "fixture-first",
        title: "Fixtures are controlled observations",
        duration: "80 min",
        promise: "You will create realistic synthetic payloads without turning tests into fake dashboard inserts.",
        mentalModel: { plain: "A rehearsal uses marked prop documents that follow the same receiving and filing process as the real shoot.", technical: "Provider-shaped fixtures exercise HTTP decoding, normalization, deduplication, scoring, and repository persistence deterministically. They are labeled synthetic in provenance.", connection: "FixtureResearch and ApifyResearch implement the same service. Downstream tools and repositories do not branch on fixture mode." },
        sections: [
          { title: "Mock at the provider boundary", paragraphs: ["A useful fixture resembles heterogeneous provider output: missing metrics, different timestamp formats, captions, URLs, stable IDs, and irrelevant rows. The production normalizer must handle it.", "Directly inserting already-normalized TrendSignal rows tests the dashboard, not acquisition. It can hide broken mapping and sanitization."] },
          { title: "Keep synthetic provenance visible", paragraphs: ["Use impossible or reserved URLs, deterministic times, and an explicit fixture marker in raw provenance. Never merge fixture and live evidence into a production strategy without a visible boundary.", "Fixtures should be small enough to understand. Add one case per behavior rather than exporting a giant provider dump with unknown licensing or private data."] },
          { title: "Test decisions, not snapshots alone", paragraphs: ["Assert that duplicates collapse, stale items score lower, malicious text remains data, source URLs survive, and unsupported rows fail or skip with a reason.", "A fixture suite becomes executable documentation for what your product considers evidence."] }
        ],
        files: [{ path: "packages/integrations/src/research.ts", reason: "Fixture and live implementations share the Research contract." }, { path: "packages/domain/src/models.ts", reason: "The normalized output boundary." }],
        steps: [
          { action: "Create four provider-shaped rows", detail: "Use TikTok, Instagram, duplicate, and invalid/malicious examples." },
          { action: "Run production normalization", detail: "Do not construct domain rows directly in the seed." },
          { action: "Persist with provenance", detail: "Mark fixture source and preserve raw input." },
          { action: "Assert behavior", detail: "Check dedupe, score inputs, safe text handling, and source traceability." }
        ],
        checks: ["Fixtures enter at the provider boundary", "Synthetic evidence is labeled", "Normalization is shared with live mode", "Tests assert decisions and failure behavior"],
        quiz: { question: "Which fixture test is most valuable?", options: ["Insert a perfect TrendSignal directly", "Feed provider-shaped rows through production normalization and persistence", "Render a static screenshot", "Skip invalid data silently"], answer: 1, explanation: "It exercises the boundary where live data is most likely to drift." }
      },
      {
        id: "apify-live",
        title: "Add bounded live Apify research",
        duration: "100 min",
        promise: "You will call a live acquisition provider without giving it authority or unlimited spend.",
        mentalModel: { plain: "The research assistant has a list of approved sources, a clipping limit, a time box, and a petty-cash ceiling.", technical: "The Apify Layer owns authorization headers, actor selection, input mapping, polling, timeout, item and charge limits, output decoding, and typed failures. Actor output is untrusted data.", connection: "Foundry or Glove selects the harvest tool; the Effect integration performs bounded acquisition; repositories persist normalized evidence before reasoning." },
        sections: [
          { title: "Choose actors as adapters", paragraphs: ["An actor is a provider implementation, not a product concept. Store listening-source intent such as platform, topics, accounts, and cadence, then map it to actor-specific input in the integration.", "Keep actor IDs and advanced options out of the primary creator UI. They may exist in admin configuration or provenance."] },
          { title: "Bound every expensive dimension", paragraphs: ["Limit topics, actor items, pages, run duration, concurrency, retries, and maximum charge. Reject a request that cannot express a safe bound.", "Send tokens in authorization headers, never query strings or persisted actor input. Store a safe provider run ID and cost, not the credential."] },
          { title: "Fail honestly", paragraphs: ["Missing token, actor failure, timeout, invalid output, and budget breach should remain distinct. A broken provider is not ‘no trends today.’", "A live smoke test is intentionally small and may cost money. Keep it separate from CI and require an explicit credential and opt-in command."] }
        ],
        files: [{ path: "packages/integrations/src/research.ts", reason: "Live Layer owns token, bounds, timeout, retry, and failure mapping." }, { path: ".env.example", reason: "Credential name without value." }],
        steps: [
          { action: "Select one actor and purpose", detail: "Document platform coverage, required input, output shape, and known cost model." },
          { action: "Add hard bounds", detail: "Five items, thirty seconds, two request retries, USD 0.05 ceiling for smoke verification." },
          { action: "Decode output", detail: "Unknown → provider schema → normalized TrendSignal." },
          { action: "Run one live smoke", detail: "Use a disposable topic and inspect persisted evidence, safe request ID, cost, and no token leakage." }
        ],
        checks: ["Actors are integration details", "Every live run is bounded", "Provider output stays untrusted", "Live failures never become fixture success"],
        quiz: { question: "What authority should scraped actor output have?", options: ["It can rewrite the system prompt", "It is evidence data that must be normalized and evaluated", "It can publish when engagement is high", "It can select credentials"], answer: 1, explanation: "Acquisition supplies observations, not instructions or permissions." }
      },
      {
        id: "score-persist",
        title: "Normalize, deduplicate, score, persist",
        duration: "90 min",
        promise: "You will produce explainable evidence rankings rather than a mysterious trend score.",
        mentalModel: { plain: "The research desk labels every clipping, removes duplicates, and ranks it with a written rubric before the strategist sees it.", technical: "Normalization maps provider shapes into a stable domain. Dedup uses provider identity and canonical URLs. Scoring composes explainable features such as freshness, engagement, creator relevance, novelty, and source diversity.", connection: "The database stores normalized evidence plus raw provenance and score components. The analyst subagent reads persisted evidence IDs, not transient provider dumps." },
        sections: [
          { title: "Normalize deterministically", paragraphs: ["Convert timestamps, canonicalize URLs, map metrics, strip unsupported markup, and preserve the raw row. Version the normalizer when future changes would produce different domain values.", "Do not let provider-specific optional fields leak into every query. Use a metrics record or explicit normalized columns based on product needs."] },
          { title: "Deduplicate before strategy", paragraphs: ["Prefer stable external IDs within a platform. Fall back to canonical URLs or bounded content fingerprints when necessary. Record why rows merged when the decision is not obvious.", "A repeated viral clip across mirrors is evidence of distribution, not ten independent observations. Preserve source diversity separately."] },
          { title: "Make score components visible", paragraphs: ["Store component values or a score explanation. Likes alone bias toward account size and old content. Freshness alone overvalues noise.", "The UI should show ‘why it matters’ in creator language and retain the evidence details an operator can inspect."] }
        ],
        files: [{ path: "packages/domain/src/models.ts", reason: "Normalized evidence shape." }, { path: "packages/database/src/schema.ts", reason: "Unique provider identity and provenance storage." }, { path: "apps/runtime/agents/creator/subagents.ts", reason: "Analyst ranks stored evidence and cites IDs." }],
        steps: [
          { action: "Write a normalization table", detail: "Provider field → domain field → transform → failure behavior." },
          { action: "Choose dedupe keys", detail: "External ID first, canonical URL second, explicit fallback last." },
          { action: "Define five score components", detail: "Include weights and examples that should rank differently." },
          { action: "Persist the explanation", detail: "Make the final score auditable from stored data." }
        ],
        trace: ["Provider row", "Decode", "Normalize", "Canonical identity", "Dedupe", "Feature scores", "Persisted evidence"],
        checks: ["Normalization is deterministic", "Dedupe distinguishes distribution from independence", "Scores are explainable", "Strategy cites persisted IDs"],
        quiz: { question: "Why is like count alone a poor trend score?", options: ["Numbers cannot be stored", "It ignores age, account scale, relevance, novelty, and source diversity", "Apify never returns likes", "Models cannot read metrics"], answer: 1, explanation: "Engagement is one feature, not the whole decision." }
      }
    ]
  },
  {
    id: "assets",
    number: 9,
    phase: "Intelligence",
    title: "Create coherent media with lineage",
    subtitle: "Turn selected creator assets and evidence into scripts, shots, scenes, and generated imagery.",
    milestone: "Every generated deliverable belongs to one content version and can be traced to its prompt, model, evidence, and source assets.",
    units: [
      {
        id: "asset-ingestion",
        title: "An upload is a governed asset",
        duration: "85 min",
        promise: "You will model media roles, consent, storage, and retrieval before generation.",
        mentalModel: { plain: "A photo entering the studio gets a usage label: product reference, person likeness, location, prior shoot, or mood—not just IMG_1042.jpg.", technical: "Asset ingestion validates media type and size, stores bytes outside model context, records workspace scope and usage metadata, and returns an immutable asset ID.", connection: "Content versions reference asset IDs. Image tools resolve bytes inside the integration and store generated assets with lineage." },
        sections: [
          { title: "Capture intended use", paragraphs: ["Ask whether an asset is a product, person, place, archival shoot, style reference, video, audio, or document. Capture restrictions: preserve label text, do not alter identity, internal-only, expiry, or consent scope.", "The model should receive a safe description and selected bytes only when needed. It should not browse every private upload by default."] },
          { title: "Separate metadata and binary storage", paragraphs: ["The database stores identity, ownership, hash, MIME type, dimensions, role, restrictions, storage reference, and timestamps. Bytes live in a scoped blob/object store or a deliberately bounded database strategy.", "Hashing helps deduplication and integrity, but access control still uses workspace ownership and authenticated requests."] },
          { title: "Generate derivatives intentionally", paragraphs: ["Create thumbnails, transcripts, OCR, or embeddings as explicit background artifacts with parent asset IDs and processing status. A failure in one derivative must not lose the original.", "Do not send base64 assets through model-visible tool results. Resolve them inside the provider service and return IDs and safe previews."] }
        ],
        files: [{ path: "packages/domain/src/models.ts", reason: "Extend the domain with MediaAsset and AssetRole during the exercise." }, { path: "packages/database/src/schema.ts", reason: "Add asset metadata and generated-lineage tables in your lab." }],
        steps: [
          { action: "Define AssetRole", detail: "Use finite creator-recognizable choices and restrictions." },
          { action: "Validate an upload", detail: "Check MIME, bytes, dimensions/duration, hash, and workspace scope." },
          { action: "Persist metadata and bytes", detail: "Keep a storage reference and safe preview projection." },
          { action: "Add one derivative job", detail: "Make its parent, status, and failure independently visible." }
        ],
        checks: ["Uploads have usage roles", "Restrictions are explicit", "Binary bytes stay out of model results", "Derived artifacts preserve parent lineage"],
        quiz: { question: "What should a generation tool receive?", options: ["Every private asset in the workspace", "Selected asset IDs plus a validated generation request", "A browser local file path", "The database password"], answer: 1, explanation: "Selection and server-side resolution preserve scope and minimize exposure." }
      },
      {
        id: "content-packet",
        title: "Create one coherent content packet",
        duration: "95 min",
        promise: "You will generate a creative thesis before producing channel fragments.",
        mentalModel: { plain: "The script, shot list, caption, styling, and photo brief all belong to one creative treatment.", technical: "A content packet is a structured aggregate with one angle, evidence references, deliverables, platform adaptations, source assets, version, and review status.", connection: "The parent agent coordinates research analyst and editorial reviewer, then persists exactly one immutable packet version." },
        sections: [
          { title: "Synthesize before rendering", paragraphs: ["Choose the audience tension, evidence-backed angle, hook, emotional movement, and visual thesis. Then derive script, shots, caption, storyboard, and generation prompt from that shared direction.", "Generating each artifact independently creates contradictions: a quiet editorial image beside a loud comedy script, or a caption making claims the evidence never supported."] },
          { title: "Adapt by channel without cross-posting", paragraphs: ["Keep the strategic territory shared while changing pace, opening, framing, duration, text density, and call to action per channel.", "A skill can teach channel craft; the packet schema still keeps platform-specific outputs structurally separate and reviewable."] },
          { title: "Preserve review units", paragraphs: ["The creator should review one version as a coherent set. Changes produce a new version, not silent field mutation.", "Store model/provider metadata for generation, but the product’s primary view should show creator concepts and evidence—not internal pass IDs."] }
        ],
        files: [{ path: "packages/domain/src/models.ts", reason: "ContentPacket is the aggregate; extend it with deliverables during the exercise." }, { path: "packages/agent/src/prompt.ts", reason: "The parent’s evidence and review rules." }, { path: "apps/runtime/agents/creator/subagents.ts", reason: "Strategy and review remain bounded specialist stages." }],
        steps: [
          { action: "Write a creative thesis", detail: "Audience tension + evidence + distinctive angle + visual world." },
          { action: "Derive deliverables", detail: "Script, timed shots, caption, storyboard, photo brief, and generation prompt." },
          { action: "Adapt two channels", detail: "Keep thesis, change execution mechanics." },
          { action: "Persist one version", detail: "Save the full body and source references atomically in review." }
        ],
        checks: ["All deliverables share one thesis", "Evidence IDs are present", "Channel adaptations are native", "One immutable version contains the review set"],
        quiz: { question: "Why persist the packet before image generation?", options: ["Images cannot be generated first", "The generation request needs a coherent, versioned creative direction and failure should not erase text work", "PostgreSQL renders images", "Foundry requires a caption"], answer: 1, explanation: "Textual strategy and lineage remain durable even if the provider fails." }
      },
      {
        id: "generation-lineage",
        title: "Generate images with an audit trail",
        duration: "100 min",
        promise: "You will design a provider-neutral generation service with references, retries, cost, and lineage.",
        mentalModel: { plain: "Every rendered frame keeps the treatment, reference boards, camera brief, vendor job number, and invoice attached.", technical: "ImageProvider accepts a validated request and resolved references, performs a bounded external call, stores output bytes, and persists model, prompt, request ID, cost, timestamps, source IDs, and contentVersionId.", connection: "The agent chooses generation; the Effect integration owns provider mechanics; the asset repository owns output and lineage; the UI shows the result inside the version." },
        sections: [
          { title: "Keep the service provider-neutral", paragraphs: ["The domain request names aspect ratio, prompt, reference asset IDs, content version, and constraints. Provider adapters map this to OpenRouter or another image API.", "Do not store provider keys or transient signed URLs as durable creative records. Store stable asset references and safe provider metadata."] },
          { title: "Treat reference identity carefully", paragraphs: ["When the source is a product or person, preserve geometry, marks, color, label text, and identity constraints. Record which references were actually sent.", "A style reference is not a license to copy protected work. Store source/consent metadata and design prompts around permitted attributes."] },
          { title: "Make failure partial, not catastrophic", paragraphs: ["Generation can time out or be rejected after the packet is complete. Persist a failed artifact attempt and let the creator retry or choose another direction.", "Use provider idempotency/request IDs when available. Bound retries and costs; never regenerate endlessly inside a scheduled run."] }
        ],
        files: [{ path: "packages/integrations/src/research.ts", reason: "Reuse the same Effect adapter pattern for an ImageProvider service." }, { path: "packages/database/src/schema.ts", reason: "Add media assets and generation lineage linked to contentVersions." }],
        steps: [
          { action: "Define ImageRequest", detail: "Include version ID, prompt, aspect ratio, reference IDs, and constraints." },
          { action: "Resolve selected assets", detail: "Authorize workspace ownership before reading bytes." },
          { action: "Call a fixture provider", detail: "Return deterministic bytes/URL and cost metadata for tests." },
          { action: "Persist success or failure", detail: "Never lose the completed packet; keep attempt lineage." }
        ],
        checks: ["Generation is provider-neutral", "References are authorized and recorded", "Costs and request IDs persist", "Failure leaves the packet reviewable"],
        quiz: { question: "What links a generated frame to the approved creative work?", options: ["A filename convention", "contentVersionId plus source asset and provider lineage", "The chat’s final sentence", "The model temperature"], answer: 1, explanation: "Explicit identifiers make lineage queryable and reviewable." }
      }
    ]
  },
  {
    id: "safety",
    number: 10,
    phase: "Autonomy",
    title: "Make autonomy recoverable and safe",
    subtitle: "Use status machines, exact-version approval, egress checks, and operator-visible failure.",
    milestone: "Scheduled generation can run unattended, but publishing remains impossible without current human authority.",
    units: [
      {
        id: "state-machines",
        title: "Status is a state machine, not a label",
        duration: "80 min",
        promise: "You will define legal transitions for runs, packets, artifacts, and approvals.",
        mentalModel: { plain: "A cut moves from assembly to review to approved; no one relabels a rough cut as aired without the required handoff.", technical: "A state machine defines allowed transitions, required preconditions, actor authority, side effects, and terminal states. Repository operations enforce transitions transactionally.", connection: "Foundry run state handles execution. Product run and content state handle business progress. The UI derives actions from allowed transitions." },
        sections: [
          { title: "Separate runtime and business state", paragraphs: ["Foundry run succeeded means the agent turn completed. It does not necessarily mean a packet was approved or published. Product run state records the outcome relevant to the creator.", "Persist both and correlate them. A successful run with no expected artifact is an application invariant failure that completion guards or tests should catch."] },
          { title: "Define transitions as operations", paragraphs: ["submitForReview(versionId), approveVersion(versionId, actor), rejectVersion, and publishApprovedVersion are clearer than updateStatus(any string). Each operation validates current state and required records.", "Terminal and retryable failures should be visible. Do not leave a run in running forever after process loss; use leases, heartbeat/claim expiry, and reconciliation."] },
          { title: "Design compensation consciously", paragraphs: ["Not every external side effect is transactional with PostgreSQL. Record intent before the call, provider request ID after acceptance, and reconcile uncertain results.", "Avoid deleting useful partial work. A failed image, reviewer refusal, or provider timeout can remain an operator-visible step with a retry action."] }
        ],
        files: [{ path: "packages/database/src/schema.ts", reason: "Run, packet, version, and approval records have different lifecycles." }, { path: "docs/run-trace.md", reason: "Compare operational completion with product outcomes." }],
        steps: [
          { action: "Draw four state machines", detail: "Run, packet, artifact attempt, and approval." },
          { action: "Name transition owners", detail: "Agent, repository, human reviewer, publisher, reconciler." },
          { action: "Define preconditions", detail: "Evidence present, immutable version exists, actor authorized, approval current." },
          { action: "Design stuck-work recovery", detail: "Lease expiry, resume, fail, and operator retry." }
        ],
        checks: ["Foundry success differs from product success", "Transitions are repository operations", "Partial work remains inspectable", "Stuck runs can be reconciled"],
        quiz: { question: "A Foundry run ends successfully but creates no expected packet. What is true?", options: ["The product workflow succeeded", "The runtime completed, but an application invariant failed", "The packet was automatically published", "No record is needed"], answer: 1, explanation: "Operational completion and business outcome are separate layers." }
      },
      {
        id: "approval-egress",
        title: "Approval belongs to one immutable version",
        duration: "90 min",
        promise: "You will implement the non-negotiable boundary between autonomous production and publishing.",
        mentalModel: { plain: "The signature approves cut v3. If an editor changes one frame, v4 returns to review.", technical: "Approval is an append-only grant referencing contentVersionId and actor. The egress adapter loads the requested version and verifies an unrevoked grant at publish time.", connection: "Generation tools can create in-review versions. The publisher is separate, permissioned, and cannot infer approval from packet status or old versions." },
        sections: [
          { title: "Avoid mutable approval booleans", paragraphs: ["approved=true on a packet cannot identify what was reviewed. Editing the same row after approval preserves the boolean and silently expands authority.", "Immutable version bodies plus separate approval records make history and invalidation obvious."] },
          { title: "Check at egress", paragraphs: ["The API or channel adapter about to publish verifies workspace ownership, version identity, approval actor/policy, revocation, channel constraints, and idempotency. Do not rely on the UI having checked earlier.", "The model never supplies approval authority. It may request review or select an already-approved version by ID; the server verifies the grant."] },
          { title: "Make the promise visible", paragraphs: ["The creator UI should say ‘You approve every post. The agent never publishes on its own.’ Review shows the exact deliverables and evidence for that version.", "After any edit, the UI visibly returns the work to review and explains why prior approval no longer applies."] }
        ],
        files: [{ path: "packages/database/src/schema.ts", reason: "approvals reference contentVersions rather than mutable packets." }, { path: "packages/agent/src/prompt.ts", reason: "Behavioral rule mirrors the enforceable boundary." }],
        steps: [
          { action: "Implement approveVersion", detail: "Authorize actor, verify version and state, insert a grant." },
          { action: "Implement edit", detail: "Create version N+1; never mutate N." },
          { action: "Implement publish guard", detail: "Load approval for the exact requested version immediately before egress." },
          { action: "Test the race", detail: "Approve v3, create v4, attempt to publish v4, and require rejection." }
        ],
        trace: ["Draft v3", "Human reviews v3", "Approval(v3)", "Edit creates v4", "Approval(v3) remains history", "Publish(v4) denied"],
        checks: ["Approvals reference immutable versions", "Edits create new versions", "Egress rechecks authority", "The UI explains invalidation"],
        quiz: { question: "Can approval(v3) authorize publishing v4 if only punctuation changed?", options: ["Yes, if the model says equivalent", "No; v4 is a different immutable version", "Yes, if the score is high", "Only in fixture mode"], answer: 1, explanation: "The safety boundary is identity-based, not semantic guesswork." }
      },
      {
        id: "security-cost",
        title: "Bound identity, spend, and data exposure",
        duration: "90 min",
        promise: "You will review the system as an attacker, a finance owner, and a privacy-conscious creator.",
        mentalModel: { plain: "Keys stay in the safe, department budgets are capped, and each client’s footage stays in their own locked room.", technical: "Defense in depth combines authentication, authorization, tenant scoping, secret management, input validation, SSRF/file controls, rate and spend limits, redaction, audit logs, and least-privilege capabilities.", connection: "Every integration, repository, tool, Foundry adapter, upload route, and publisher participates; no single prompt or middleware is sufficient." },
        sections: [
          { title: "Authenticate then authorize", paragraphs: ["Authentication identifies the caller. Authorization verifies they may access this workspace and operation. Model-provided IDs and hidden form fields are untrusted input.", "Repository queries include authenticated scope. Asset download and provider proxy routes repeat the check rather than trusting the page that linked to them."] },
          { title: "Bound cost as data", paragraphs: ["Track provider, operation, estimated/actual cost, workspace, run, and budget window. Enforce per-call and cumulative limits before expensive requests.", "Retries consume budget. Scheduled concurrency and creator-configured cadence can multiply spend, so model worst-case totals rather than average happy paths."] },
          { title: "Minimize what crosses boundaries", paragraphs: ["Redact logs and events. Use safe URLs and block arbitrary internal network fetches. Validate archives and media parsers. Avoid giving the model unnecessary private assets or raw account data.", "Secrets remain runtime-only. If a credential leaks, rotate it and audit history; removing the current file does not erase Git history."] }
        ],
        files: [{ path: ".env.example", reason: "Secrets are named but never stored." }, { path: "packages/integrations/src/research.ts", reason: "Authorization and spend bounds live at provider boundary." }, { path: "packages/database/src/repositories.ts", reason: "Tenant-scoped use-case contracts." }],
        steps: [
          { action: "Threat-model one run", detail: "List attacker input, authority boundaries, sensitive data, spend, and egress." },
          { action: "Calculate worst-case cost", detail: "Schedules × concurrency × run retries × request retries × per-call ceiling." },
          { action: "Test cross-tenant IDs", detail: "An authorized user in workspace A must not read an asset or version from B." },
          { action: "Audit logs", detail: "Search for tokens, headers, raw media, provider payloads, and hidden reasoning." }
        ],
        checks: ["Tenant scope is enforced in repositories", "Spend has hard ceilings", "Secrets are runtime-only", "Logs and tool results minimize private data"],
        quiz: { question: "What authorizes access to a workspace record?", options: ["The model mentioning its ID", "Authenticated identity plus server-side workspace authorization", "Knowing the URL", "A high relevance score"], answer: 1, explanation: "Identifiers are not capabilities or proof of ownership." }
      }
    ]
  },
  {
    id: "operate",
    number: 11,
    phase: "Operate",
    title: "Build the creator surface and ship",
    subtitle: "Translate runtime truth into a focused product, then verify and operate it.",
    milestone: "A non-technical creator can configure, run, inspect, review, and recover the system without seeing provider machinery.",
    units: [
      {
        id: "creator-ui",
        title: "Design the interface around the daily job",
        duration: "95 min",
        promise: "You will create creator-facing projections instead of exposing database and runtime internals.",
        mentalModel: { plain: "The production desk shows today’s call, strongest signal, media, drafts, and review queue—not the wiring diagram for the building.", technical: "Application services project normalized records into task-focused view models. UI actions invoke use cases and display status, evidence, and recovery without leaking provider or database shapes.", connection: "TodayView is a stable creator-facing boundary. Foundry inspector remains an advanced operational surface, not the primary product." },
        sections: [
          { title: "Use creator nouns", paragraphs: ["Primary navigation can be Today, Trends, Media library, Content, and Brand kit. Actor input, run lease, provider dataset, and database row belong in advanced or internal surfaces.", "This is not hiding truth. Show source, freshness, status, cost when relevant, version, and approval clearly—translated into the user’s task."] },
          { title: "Center one daily action", paragraphs: ["Today should answer: what is next, what did the agent find, what needs review, and what can I do now? ‘Create today’s content’ is more useful than a grid of runtime metrics.", "Optional one-off direction applies to one run and does not silently overwrite the durable creator routine."] },
          { title: "Design review as a workspace", paragraphs: ["Show one deliverable at a time with easy switches for script, shots, caption, storyboard, and frame. Keep evidence and reference assets adjacent.", "Approve the exact visible version. Requesting changes creates a new draft cycle and removes publish eligibility until new approval."] }
        ],
        files: [{ path: "apps/web/src/today.ts", reason: "A creator-facing projection with no provider tokens or runtime leases." }, { path: "packages/domain/src/models.ts", reason: "The UI consumes product language." }],
        steps: [
          { action: "Write five user questions", detail: "What happens next? What changed? What needs me? What was used? Is anything stuck?" },
          { action: "Build TodayView", detail: "Project only the data needed to answer those questions." },
          { action: "Create review tabs", detail: "Script, shots, caption, storyboard, image, evidence." },
          { action: "Add empty and failure guidance", detail: "Explain the next corrective action in creator language." }
        ],
        checks: ["Primary UI uses creator vocabulary", "One daily action is obvious", "Review shows exact version and evidence", "Failures tell the user what to do"],
        quiz: { question: "Where should raw Apify actor configuration appear?", options: ["The main Today card", "Advanced/admin settings when needed", "Inside every caption", "In the approval button"], answer: 1, explanation: "The normal workflow uses creator concepts; provider configuration is secondary machinery." }
      },
      {
        id: "test-system",
        title: "Test boundaries and the complete flow",
        duration: "110 min",
        promise: "You will build a test pyramid that proves domain rules, adapters, tools, autonomy, and approval.",
        mentalModel: { plain: "Rehearse department moves separately, then run the whole production with marked props before paying for a live location.", technical: "Pure unit tests cover transformations and invariants. Layer tests cover services/repositories. Contract tests cover provider shapes. Integration tests cover PostgreSQL. E2E tests cover a fixture run through review. Bounded smoke tests verify live providers separately.", connection: "The neutral lab’s fixture Layer enables deterministic end-to-end runs; production smoke checks reuse the same normalizer and repositories." },
        sections: [
          { title: "Test the risks first", paragraphs: ["Highest-value tests include dedupe, tenant isolation, idempotent schedule retry, evidence provenance, subagent handoff completeness, exact-version approval, missing credential failure, and generated-asset lineage.", "Snapshotting large model prose is fragile and rarely proves the safety boundary. Assert structured outputs and persisted effects."] },
          { title: "Use deterministic model/provider seams", paragraphs: ["For workflow tests, replace the model or assert tool-level orchestration with deterministic responses. Replace Apify and image providers with fixture Layers that still pass through validation and persistence.", "Do not let CI spend provider credits or depend on internet volatility. Live smoke commands are opt-in and hard-bounded."] },
          { title: "Test recovery, not only success", paragraphs: ["Crash after evidence save, retry the same run key, and prove one packet. Fail image generation and prove text remains. Attempt cross-tenant access and prove denial. Approve v3, edit to v4, and prove publish denial.", "These tests teach architecture because each failure identifies the boundary responsible for recovery."] }
        ],
        files: [{ path: "packages/integrations/src/research.ts", reason: "Fixture Layer and live Layer share the contract." }, { path: "packages/database/src/schema.ts", reason: "Constraints make concurrency tests meaningful." }, { path: "docs/run-trace.md", reason: "Convert every transition into success and failure scenarios." }],
        steps: [
          { action: "Write the risk matrix", detail: "Risk, owner, test level, fixture, expected record." },
          { action: "Add pure tests", detail: "Normalization, scoring, state transitions, packet validation." },
          { action: "Add integration tests", detail: "PostgreSQL repositories, constraints, tenant scope, idempotency." },
          { action: "Run fixture E2E", detail: "Schedule/direct request → evidence → packet version → review projection." },
          { action: "Add opt-in live smoke", detail: "Hard item, time, retry, and spend limits." }
        ],
        trace: ["Fixture input", "Production boundary", "Persist evidence", "Agent/tool flow", "Persist version", "UI projection", "Approval test"],
        checks: ["Tests target invariants and recovery", "CI is deterministic and free", "Live smoke is bounded and separate", "E2E asserts durable outcomes"],
        quiz: { question: "What should an end-to-end fixture test assert?", options: ["Exact model punctuation", "Durable evidence, one packet version, review status, and provenance", "A live provider bill", "Every internal log line"], answer: 1, explanation: "Structured state proves the application outcome without brittle prose snapshots." }
      },
      {
        id: "deploy-operate",
        title: "Deploy two services and operate the system",
        duration: "100 min",
        promise: "You will design production topology, migrations, health, backups, and incident response.",
        mentalModel: { plain: "The public production desk and the private autonomous studio are separate rooms sharing the protected archive.", technical: "Deploy the web control boundary and continuously running Foundry runtime as separate services over managed PostgreSQL and object storage. Apply migrations, secrets, private networking, health checks, observability, backups, and bounded concurrency.", connection: "The web service authenticates humans. Foundry runs agents and schedules on a private surface. Both use application services and durable records; only approved egress reaches social channels." },
        sections: [
          { title: "Separate public and private surfaces", paragraphs: ["The web app is the public operator boundary with authentication, CSRF/session protection, rate limits, uploads, and review actions. Foundry’s operator/inspector port belongs on a private network or strongly controlled admin path.", "Do not run schedules only inside a serverless web process that can sleep. The autonomous runtime must remain available and coordinate claims durably."] },
          { title: "Deploy data changes safely", paragraphs: ["Run checked migrations against managed PostgreSQL. Coordinate backward-compatible schema changes when old and new services may overlap. Back up before risky transformations.", "Configure object storage lifecycle, database backups and point-in-time recovery, secret rotation, and retention policies for provider payloads and private media."] },
          { title: "Operate by user-visible outcomes", paragraphs: ["Health includes database access, claim loop progress, schedule lag, provider error rate, pending review count, stuck runs, and artifact failures—not only HTTP 200.", "Write runbooks for expired tokens, provider outage, migration failure, runaway spend, stuck lease, cross-tenant incident, and credential leak. Practice the actions before a creator depends on them."] }
        ],
        files: [{ path: "apps/runtime/foundry.config.ts", reason: "Runtime concurrency, attempts, polling, and observability policy." }, { path: "compose.yaml", reason: "Local topology is a small analogue of the production data service." }, { path: ".env.example", reason: "Production secret/config inventory begins here without values." }],
        steps: [
          { action: "Draw production topology", detail: "Browser → web; web/runtime → PostgreSQL/object storage; runtime → providers; private inspector." },
          { action: "Write deploy order", detail: "Backup, migrate, deploy compatible services, verify health, run bounded smoke." },
          { action: "Create outcome alerts", detail: "Schedule lag, stuck runs, repeated provider failures, spend, review backlog." },
          { action: "Write five runbooks", detail: "Each names detection, containment, recovery, verification, and follow-up." }
        ],
        checks: ["Foundry runtime stays continuously available", "Inspector is private", "Migrations and backups are planned", "Alerts represent user-visible health", "Incident runbooks exist"],
        quiz: { question: "Why deploy the Foundry runtime separately from the web app?", options: ["To use more repositories", "Autonomous schedules and claims need a continuously available private runtime, while web handles public human interaction", "React cannot call PostgreSQL", "Effect requires two domains"], answer: 1, explanation: "The services have different availability, trust, and workload responsibilities." }
      }
    ]
  },
  {
    id: "persistence",
    number: 4,
    phase: "Construct",
    title: "Make PostgreSQL the source of truth",
    subtitle: "Design durable records, repositories, migrations, and exact-version approvals.",
    milestone: "A restart preserves creator context, evidence, runs, content history, and approval state.",
    units: [
      {
        id: "durable-state",
        title: "Decide what must survive",
        duration: "75 min",
        promise: "You will separate conversation memory from product truth and design records around recovery.",
        mentalModel: { plain: "The archive contains footage, releases, edit versions, and sign-off sheets; the producer’s notebook does not replace it.", technical: "Durable application state is normalized, queryable data with explicit identity, tenancy, lifecycle, provenance, and timestamps. Conversation history is one persisted input to the agent, not the canonical store for business facts.", connection: "PostgreSQL backs repositories and Foundry adapters. Glove may read conversation context, but tools retrieve authoritative records through services." },
        sections: [
          { title: "Design for restart", paragraphs: ["Imagine the runtime process disappears between research and review. The database must reveal what ran, what completed, which evidence was saved, which content version exists, and whether retrying is safe.", "If the only record is model chat text, recovery depends on parsing prose. Use explicit run and content tables so recovery is a normal query."] },
          { title: "Design for tenancy", paragraphs: ["Every creator-owned record belongs to a workspace. A model-supplied workspace ID is not authorization; repositories scope queries with the authenticated workspace and reject cross-tenant identifiers.", "Indexes and unique constraints must include the right tenant or provider identity fields. A globally unique UUID helps identity but does not replace access checks."] },
          { title: "Design for provenance", paragraphs: ["Evidence needs observed time, source URL, external identity, normalization version, and raw payload. Generated assets need prompt, model, provider request ID, cost, and source asset IDs.", "Provenance is not optional logging. It is product data that supports explanation, reprocessing, dispute resolution, and creative iteration."] }
        ],
        files: [{ path: "packages/database/src/schema.ts", reason: "Workspace, evidence, packet, version, approval, and run records." }, { path: "docs/run-trace.md", reason: "The restart question at each transition." }],
        steps: [
          { action: "Run the restart test on paper", detail: "For each trace step, ask what record proves it happened." },
          { action: "Add workspace ownership", detail: "Mark every creator-owned table and repository input." },
          { action: "List provenance fields", detail: "Do this for evidence, uploads, generated images, and model-created content." },
          { action: "Separate transcript from truth", detail: "Move any fact needed by the UI or safety check into an explicit record." }
        ],
        checks: ["A restart can reconstruct work", "Every record is tenant-scoped", "Provenance is queryable", "Conversation text is not the only source of product truth"],
        quiz: { question: "Where should the fact ‘version 3 was approved by user 42’ live?", options: ["Only in the model conversation", "In an approval record referencing immutable version 3", "In an Apify payload", "In CSS state"], answer: 1, explanation: "It is durable authority that must be independently verifiable." }
      },
      {
        id: "schema-migrations",
        title: "Turn invariants into schema",
        duration: "90 min",
        promise: "You will understand tables, foreign keys, unique constraints, JSON boundaries, and migrations through product rules.",
        mentalModel: { plain: "Archive labels and shelf rules prevent two reels from claiming the same cut number or a release form from pointing to nothing.", technical: "Relational constraints enforce identity and referential integrity under concurrency. Migrations version schema changes so every environment reaches the same structure.", connection: "Drizzle expresses schema in TypeScript and generates SQL migrations. Repositories implement use cases over that schema." },
        sections: [
          { title: "Use constraints for race-safe truth", paragraphs: ["Checking then inserting is not safe when two workers race. Unique runKey and content packet/version constraints make duplicates impossible at the database boundary.", "Foreign keys ensure an approval cannot reference a missing version. Transactions combine multi-record state changes when partial completion would violate an invariant."] },
          { title: "Choose columns versus JSON", paragraphs: ["Put frequently filtered, joined, constrained, or independently updated fields in columns. Use JSON for versioned bodies or provider payloads whose internal shape changes and is read as a unit.", "JSON does not remove the need for runtime validation. Decode JSON when it enters the domain and preserve a schema or format version for migrations."] },
          { title: "Treat migrations as source", paragraphs: ["A schema file describes the desired structure; migration files describe the safe path from existing structure. Commit both with the application change that depends on them.", "Test migrations against an empty database and a representative previous state. Production deploy order must make old and new application versions safe during rollout when necessary."] }
        ],
        files: [{ path: "compose.yaml", reason: "Local PostgreSQL with a durable named volume and health check." }, { path: "packages/database/src/schema.ts", reason: "Relational constraints encode product invariants." }],
        steps: [
          { action: "Start PostgreSQL", detail: "Wait for the health check rather than assuming the port is ready.", command: "docker compose up -d postgres\ndocker compose ps", expected: "postgres reports healthy." },
          { action: "Explain every constraint", detail: "For each primary, foreign, and unique key, name the user-visible failure it prevents." },
          { action: "Classify fields", detail: "Choose column or JSON and write the query/invariant that justifies the choice." },
          { action: "Plan a migration", detail: "Add an optional generationCostUsd field, then describe deploy and backfill order." }
        ],
        checks: ["Unique constraints protect idempotency", "Approvals have foreign keys to versions", "JSON is validated", "Migrations are committed and tested"],
        quiz: { question: "Why is `find runKey, then insert` insufficient by itself?", options: ["Queries are slow", "Two workers can pass the check concurrently", "Foundry disallows queries", "UUIDs cannot be indexed"], answer: 1, explanation: "A unique database constraint is the concurrency-safe authority." }
      },
      {
        id: "repository-layers",
        title: "Keep SQL behind repository services",
        duration: "80 min",
        promise: "You will create use-case-shaped persistence contracts and replace in-memory storage without changing tools.",
        mentalModel: { plain: "The producer asks the archive for ‘recent approved cuts,’ not for shelf 7, box 14, row 3.", technical: "Repositories expose domain operations and hide query mechanics. Effect service tags define contracts; Layers provide Drizzle implementations or in-memory test implementations.", connection: "Agent tools depend on EvidenceRepository and ContentRepository. Foundry composition supplies PostgreSQL-backed Layers in production." },
        sections: [
          { title: "Name methods after intent", paragraphs: ["listRecentEvidence, createContentVersion, approveVersion, and claimRun describe product operations. Generic save or executeQuery pushes invariants back into every caller.", "Repository inputs include authenticated workspace scope and domain values. They do not accept arbitrary table names or raw model-generated SQL."] },
          { title: "Use transactions inside the owner", paragraphs: ["Creating a new version and changing packet status may be one repository operation because the repository owns the invariant. The agent should not coordinate separate SQL calls and hope both succeed.", "Return domain values or identifiers, not database driver rows. This keeps the public contract stable if column names or storage engines change."] },
          { title: "Swap storage at composition", paragraphs: ["Tests provide deterministic in-memory Layers. Local single-process exploration may use PGlite. Autonomous subprocesses and production use PostgreSQL. The repository contract stays unchanged.", "PGlite is not a shared multi-process production database. If scheduled agents run in subprocesses, point them at PostgreSQL so every process sees the same state."] }
        ],
        files: [{ path: "packages/database/src/repositories.ts", reason: "Use-case-shaped Effect service contracts." }, { path: "apps/runtime/foundry.application.ts", reason: "Development data adapter is selected at the composition root." }],
        steps: [
          { action: "Rewrite generic methods", detail: "Replace save(table, value) ideas with product operations." },
          { action: "Define transaction boundaries", detail: "Group writes that must succeed or fail together." },
          { action: "Implement a fixture Layer", detail: "Use Maps and deterministic IDs for tests." },
          { action: "Implement a PostgreSQL Layer", detail: "Keep Drizzle imports inside the database package." }
        ],
        checks: ["Tools import contracts rather than SQL", "Repository names express use cases", "Transactions enforce invariants", "Storage swaps at composition"],
        quiz: { question: "Why should an agent tool not contain raw SQL?", options: ["Models cannot spell SQL", "It couples reasoning exposure to persistence mechanics and duplicates invariants", "PostgreSQL is optional", "Effect forbids strings"], answer: 1, explanation: "The repository owns persistence behavior and can be tested or replaced independently." }
      }
    ]
  },
  {
    id: "glove",
    number: 5,
    phase: "Intelligence",
    title: "Build the reasoning loop with Glove",
    subtitle: "Give the model a precise role, a small capability surface, and observable turns.",
    milestone: "A Glove agent can retrieve stored evidence, invoke typed tools, and stop with a factual result.",
    units: [
      {
        id: "agent-loop",
        title: "Trace one Glove turn",
        duration: "75 min",
        promise: "You will understand exactly what repeats inside an agent run.",
        mentalModel: { plain: "The producer reads the brief, calls one department, reviews what came back, and decides whether another department is needed.", technical: "Glove appends a user message, constructs model context, calls the model, executes validated tool calls, appends tool results, and repeats until the model completes or runtime limits stop the loop.", connection: "Foundry invokes a Glove run. Tools bridge reasoning to Effect workflows. Store adapters preserve messages. Subscribers record operational events." },
        sections: [
          { title: "A tool call is a proposal", paragraphs: ["The model proposes a tool name and arguments. The executor verifies the tool exists, validates input, applies permissions, runs the implementation, and records a structured result.", "Never let the model generate arbitrary code or URLs when a narrower schema can express the capability. Tool surface design is authority design."] },
          { title: "Tool data returns observations", paragraphs: ["A successful result should state what software actually observed or changed: saved 5 signals with IDs, not ‘research complete’ if nothing was persisted.", "Errors return typed, safe messages. The model may adapt its plan, but it should not reinterpret a failed mutation as success."] },
          { title: "Limits are part of correctness", paragraphs: ["maxTurns, maxRetries, consecutive-error limits, abort signals, context limits, and tool timeouts stop runaway loops. They need operator-visible failure states so work does not disappear.", "Glove context compaction summarizes old conversation for the model while the durable store can retain full history. Preserve evidence IDs, content versions, approvals, and pending work in compaction instructions."] }
        ],
        files: [{ path: "apps/runtime/agents/creator/agent.ts", reason: "The complete Glove/Foundry agent definition and limits." }, { path: "packages/agent/src/prompt.ts", reason: "Permanent identity and non-negotiable rules." }],
        steps: [
          { action: "Narrate a turn", detail: "User → model → tool request → validation → software → result → model." },
          { action: "Classify failures", detail: "Unknown tool, invalid input, provider failure, repository failure, and max-turn stop." },
          { action: "Inspect limits", detail: "Write the reason and user-facing outcome for each configured limit." },
          { action: "Test no-tool behavior", detail: "Ask for a capability the agent does not have and verify no external action occurs." }
        ],
        trace: ["Message", "Model pass", "Tool proposal", "Executor", "Tool result", "Next model pass", "Completion"],
        checks: ["Tool calls are validated proposals", "Results report real observations", "Limits terminate safely", "Compaction preserves identifiers and pending state"],
        quiz: { question: "Who executes the side effect in a Glove tool call?", options: ["The model directly", "The tool implementation after executor validation", "The system prompt", "The React renderer"], answer: 1, explanation: "The model selects; software validates and executes." }
      },
      {
        id: "tool-design",
        title: "Design narrow, truthful tools",
        duration: "85 min",
        promise: "You will turn application services into a capability surface the model can use safely.",
        mentalModel: { plain: "Give the producer clear department request forms, not a master key to the building.", technical: "A tool contract combines an unambiguous name, behavior-focused description, constrained input schema, deterministic implementation, permission policy, and factual result.", connection: "Foundry shared tools expose Effect workflows. Glove display tools can separately render UI or wait for human input." },
        sections: [
          { title: "Describe when, not how", paragraphs: ["The description should say what the tool does, when to use it, and what it does not do. Avoid hidden policy or marketing language.", "Schema field descriptions help the model supply meaningful values. Constrain counts, enums, IDs, and sizes instead of accepting an unstructured prompt for every operation."] },
          { title: "Separate read and write authority", paragraphs: ["read_research and harvest_research are different capabilities. A read should not unexpectedly spend provider credits. A generation tool should not publish.", "Permission can depend on input. Reads may be automatic while writes, spending, deletion, or publishing require explicit policy and cached consent scoped to tool plus input."] },
          { title: "Keep model and UI data distinct", paragraphs: ["Glove tool data is sent back to the model. renderData is client-only and can support a rich history renderer without bloating model context.", "Do not place raw binary media, long provider payloads, or private user data in model-visible data. Persist them and return safe IDs and summaries."] }
        ],
        files: [{ path: "apps/runtime/agents/creator/tools/research.tool.ts", reason: "Two narrow tools with constrained inputs and Effect implementations." }, { path: "packages/database/src/repositories.ts", reason: "Tools call use cases rather than queries." }],
        steps: [
          { action: "Write one-sentence contracts", detail: "Do this for read evidence, harvest research, save version, and request approval." },
          { action: "Constrain schemas", detail: "Add limits for topic count, evidence limit, aspect ratio, and IDs." },
          { action: "Separate expensive reads", detail: "Do not hide live acquisition inside a read-recent tool." },
          { action: "Review result data", detail: "Return IDs, counts, status, and safe summaries only." }
        ],
        checks: ["Tool descriptions state boundaries", "Schemas constrain authority", "Reads do not hide spend", "Model-visible results are bounded"],
        quiz: { question: "Which tool surface is safer?", options: ["do_everything(prompt: string)", "harvest_research(workspaceId, topics[1..5])", "execute_any_code(code: string)", "publish_or_generate(data: unknown)"], answer: 1, explanation: "It exposes one capability with constrained, auditable inputs." }
      },
      {
        id: "prompt-observability",
        title: "Write prompts and observability for operations",
        duration: "75 min",
        promise: "You will know what belongs in the system prompt and what must be enforced or observed elsewhere.",
        mentalModel: { plain: "The call sheet explains the day and safety rules; access control and production logs still exist outside the call sheet.", technical: "The system prompt shapes model behavior. Runtime enforcement belongs to capabilities and data invariants. Subscribers and Foundry events expose passes, tools, retries, timings, and outcomes without chain-of-thought.", connection: "The prompt names workspace identity, evidence rules, and handoff contracts. Foundry’s inspector correlates the actual run." },
        sections: [
          { title: "Keep the prompt inspectable", paragraphs: ["State role, goals, trusted inputs, evidence rules, tool inventory, stopping conditions, and safety boundaries. Long reference methods become named skills; durable facts become memory or database records.", "Document tools explicitly even though schemas exist. Models select tools more reliably when the system prompt explains their place in the workflow."] },
          { title: "Do not ask prompts to enforce physics", paragraphs: ["‘Never publish’ is useful instruction, but the hard boundary is no publish capability or a publisher that verifies exact approval. ‘Use this workspace ID’ is useful context, but repositories still scope tenant access.", "Layer instruction and enforcement. The prompt helps the model choose correctly; software makes dangerous wrong choices impossible or reviewable."] },
          { title: "Observe behavior, not hidden thought", paragraphs: ["Record model pass start/end, tool name, validated arguments after redaction, result status, token use, retry, run status, and artifact IDs. Do not expose private chain-of-thought or secrets.", "Tool-result summaries can replace old large payloads in model context while keeping full data in durable history. Instrument only tools whose payloads genuinely bloat context."] }
        ],
        files: [{ path: "packages/agent/src/prompt.ts", reason: "Small permanent operating contract." }, { path: "apps/runtime/agents/creator/agent.ts", reason: "Runtime limits and compaction policy." }],
        steps: [
          { action: "Highlight prompt categories", detail: "Mark identity, evidence, tool behavior, safety, and stopping conditions." },
          { action: "Move one fact", detail: "Take a mutable creator preference out of the prompt and put it in stored context." },
          { action: "Move one invariant", detail: "Implement exact-version verification outside the prompt." },
          { action: "Design an event view", detail: "Show enough to debug a failed run without revealing secret or hidden reasoning." }
        ],
        checks: ["The system prompt is short enough to inspect", "Mutable facts live in data", "Safety is enforced outside prose", "Observability records actions and outcomes, not chain-of-thought"],
        quiz: { question: "Which belongs in observability?", options: ["Private chain-of-thought", "Raw API credentials", "Tool name, safe inputs, status, timing, and artifact IDs", "Unredacted uploaded documents"], answer: 2, explanation: "Operations need correlated facts without private reasoning or secrets." }
      }
    ]
  },
  {
    id: "foundry",
    number: 6,
    phase: "Autonomy",
    title: "Use Foundry for life over time",
    subtitle: "Understand definitions, instances, conversations, runs, schedules, and application data.",
    milestone: "One agent definition becomes a persisted instance that can wake on schedule and leave observable durable work.",
    units: [
      {
        id: "definition-instance-run",
        title: "Definition, instance, conversation, run",
        duration: "85 min",
        promise: "You will stop mixing code identity with mutable agent state.",
        mentalModel: { plain: "The production template defines how this kind of studio works; each creator gets a persistent production account; each project has conversations; each call time creates a run.", technical: "A Foundry definition is file-routed code. An instance is persisted data selecting a definition plus context, installations, schedules, workspace, and mutable choices. A conversation scopes messages. A run is one claimed execution attempt.", connection: "Foundry reconstructs the current definition and instance for each run, then assembles Glove surfaces lazily from current context." },
        sections: [
          { title: "Code and data evolve differently", paragraphs: ["Updating agent.ts changes what future reconstructions can do. It does not create a new instance or rewrite creator context. Instances persist across deploys and select the latest compatible definition.", "Use route identity from agents/<route>/agent.ts. Do not duplicate definition IDs inside code and create identity drift."] },
          { title: "One instance can have many conversations", paragraphs: ["A scheduled morning workflow, an operator chat, and a review follow-up may use separate conversations while sharing the same workspace and creator context.", "Conversation history supports reasoning continuity. Workspace entries, tasks, inboxes, schedules, and product repositories support shared operational continuity."] },
          { title: "Runs are operational facts", paragraphs: ["A run has source, status, attempts, timings, events, and result. It may be direct, scheduled, inbound, or background. The application can inspect a failed run without parsing the final assistant response.", "Foundry data adapters own durable instances, runs, claims, schedules, and related runtime state. Development memory adapters are not production durability."] }
        ],
        files: [{ path: "apps/runtime/agents/creator/agent.ts", reason: "A file-routed agent definition." }, { path: "apps/runtime/foundry.application.ts", reason: "Application-level data adapter selection." }, { path: "docs/run-trace.md", reason: "One schedule-created run across the complete system." }],
        steps: [
          { action: "Draw four identities", detail: "Definition route, instance ID, conversation ID, and run ID." },
          { action: "Change definition text on paper", detail: "Explain which IDs remain and which future behavior changes." },
          { action: "Split conversations", detail: "Design separate operator and scheduled conversations that share one workspace." },
          { action: "List run fields", detail: "Include source, status, attempts, timestamps, failure, and artifact references." }
        ],
        checks: ["Definitions are code", "Instances and runs are data", "Conversations are not workspaces", "Production uses durable Foundry adapters"],
        quiz: { question: "What changes when you edit the file-routed agent definition?", options: ["Every instance ID is replaced", "Future reconstructions use the updated code while persisted instances remain", "All conversations are deleted", "PostgreSQL becomes optional"], answer: 1, explanation: "Definitions describe what an instance may become; instances are separate persisted data." }
      },
      {
        id: "schedules-idempotency",
        title: "Schedules wake agents; idempotency protects effects",
        duration: "95 min",
        promise: "You will design autonomous runs that can retry without duplicating content or spend.",
        mentalModel: { plain: "A recurring call time gets the crew to the studio. A unique production number prevents the same shoot from being booked twice.", technical: "Foundry materializes instance-bound schedules and claims due work. Application-level run keys and database constraints make business effects idempotent across retries, crashes, or duplicate delivery.", connection: "Foundry retries operational execution; repositories protect business identity; integration retries protect individual requests. Each scope needs its own limits." },
        sections: [
          { title: "Store schedule intent as creator data", paragraphs: ["The creator chooses cadence, local time, timezone, platforms, and output types. Agent code maps that persisted routine into a Foundry schedule definition.", "A cron expression is runtime materialization, not the product record. Keep the human choice so the UI can explain and edit it."] },
          { title: "Build an idempotency key", paragraphs: ["A key such as routineId:scheduledFor identifies the intended business run. Create or claim it under a unique constraint before acquiring evidence or generating assets.", "Retries load the existing record and continue or return the completed result. They do not create a new packet merely because the runtime attempt ID changed."] },
          { title: "Avoid retry multiplication", paragraphs: ["If HTTP retries three times and Foundry retries the run three times, the provider could see nine attempts. Document limits and make expensive operations idempotent with provider request keys when available.", "Classify permanent failures such as missing credential or invalid input so they alert instead of consuming the full retry budget."] }
        ],
        files: [{ path: "apps/runtime/agents/creator/agent.ts", reason: "The creator-morning-loop schedule is code selected for an instance." }, { path: "packages/database/src/schema.ts", reason: "runs.runKey is a unique business identity." }],
        steps: [
          { action: "Model CreatorRoutine", detail: "Include timezone, cadence, topics, platforms, and expected outputs." },
          { action: "Derive scheduledFor", detail: "Use the creator timezone and preserve the UTC instant." },
          { action: "Claim runKey", detail: "Let a unique constraint decide the race." },
          { action: "Simulate a crash", detail: "Stop after evidence save, retry, and prove only one packet version results." }
        ],
        checks: ["Creator intent is stored separately from cron", "Business run identity survives retries", "Expensive effects are bounded", "Permanent failures do not retry forever"],
        quiz: { question: "Which ID should prevent duplicate morning packets?", options: ["The model pass ID", "A business run key from routine ID plus scheduled instant", "The browser tab ID", "The Apify token"], answer: 1, explanation: "Runtime attempts may differ while representing the same intended business run." }
      },
      {
        id: "application-observability",
        title: "Application adapters and the inspector",
        duration: "80 min",
        promise: "You will understand how Foundry stays deployment-neutral while production supplies durable infrastructure.",
        mentalModel: { plain: "The studio handbook names the archive service it needs; the building supplies the actual shelves, security, and backup system.", technical: "Foundry’s application composes data, conversation store, routes, account adapters, and bindings. Development can use memory; production implements the same adapter vocabulary over PostgreSQL and other durable services.", connection: "foundry.application.ts is the composition root. foundry.config.ts sets runtime execution and observability policies, not creator business data." },
        sections: [
          { title: "Keep deployment vocabulary outside definitions", paragraphs: ["Agent definitions speak in tools, schedules, workspace, playbooks, and instances. They should not mention worker queue tables, lease implementation, or cloud-specific network names.", "The application adapter implements atomic provisioning, claims, schedules, cancellations, and persistence. This separation lets runtime infrastructure change without rewriting agent intent."] },
          { title: "Use the inspector to follow causality", paragraphs: ["Filter events by run. Follow schedule activation, model passes, tool calls, retries, artifacts, and completion. Compare the event stream with database records when a run is partially complete.", "Safe observability includes declared work and outcomes. It excludes credentials, raw private payloads, and hidden model reasoning."] },
          { title: "Know the production requirements", paragraphs: ["Production adapters need atomic claims, leases, bounded concurrency, durable conversations and schedules, cancellation, VFS/artifact persistence, redaction, backups, and health checks.", "An in-memory adapter is a learning scaffold, not a production shortcut. The course makes the swap explicit so the mental model survives both modes."] }
        ],
        files: [{ path: "apps/runtime/foundry.application.ts", reason: "Current development composition uses MemoryFoundryDataAdapter." }, { path: "apps/runtime/foundry.config.ts", reason: "Execution attempts, polling, concurrency, and event retention." }],
        steps: [
          { action: "Start Foundry", detail: "Run the runtime development command and open the inspector URL it prints.", command: "pnpm --filter @creator-lab/runtime dev" },
          { action: "Trigger one fixture run", detail: "Follow it by run ID rather than scanning unrelated logs." },
          { action: "Map events to records", detail: "Identify which event corresponds to each durable effect." },
          { action: "Write the production adapter checklist", detail: "Do not deploy until claims, persistence, cancellation, redaction, and health are real." }
        ],
        checks: ["Definitions stay deployment-neutral", "The application owns adapters", "I can follow one run in the inspector", "Memory adapters are labeled development-only"],
        quiz: { question: "Where should a PostgreSQL-backed Foundry data adapter be selected?", options: ["Inside every tool", "At the Foundry application composition root", "In the creator’s prompt", "In CSS"], answer: 1, explanation: "The application wires runtime infrastructure while definitions remain neutral." }
      }
    ]
  },
  {
    id: "specialists",
    number: 7,
    phase: "Intelligence",
    title: "Add skills, memory, and specialists",
    subtitle: "Give the main agent the right context without giving it every capability.",
    milestone: "Reusable craft knowledge, durable facts, and bounded specialist reasoning have distinct homes and tests.",
    units: [
      {
        id: "prompt-skill-memory",
        title: "Prompt, skill, tool, or memory?",
        duration: "80 min",
        promise: "You will place each kind of knowledge in the mechanism that matches its lifecycle and authority.",
        mentalModel: { plain: "The call sheet has today’s non-negotiables; a department playbook teaches a method; a request form calls the crew; the archive stores facts.", technical: "System prompts are ambient instructions. Skills inject reusable procedures. Tools execute capabilities. Memory and repositories persist facts and events. Subagents perform bounded reasoning with smaller surfaces.", connection: "The reference agent keeps permanent safety in prompt.ts, research method in research-first.ts, evidence in repositories, and ranking in research-analyst." },
        sections: [
          { title: "Choose by lifecycle", paragraphs: ["Permanent identity and non-negotiable rules belong in the system prompt. Optional channel or research methods belong in named skills. Mutable brand voice and audience belong in stored context. Actions belong in tools.", "Do not call a very long system prompt a memory system. It has no provenance, lifecycle, query, or ownership and gets sent on every turn."] },
          { title: "Choose by authority", paragraphs: ["A skill can suggest a procedure but should not secretly mutate data. A tool can perform a validated action. Memory reader tools expose facts; curator tools mutate memory and should be more tightly scoped.", "Keep small ambient context on the main agent. Delegate deep retrieval to a subagent so the main tool list and context stay bounded."] },
          { title: "Test observable consequences", paragraphs: ["A skill test should show that evidence IDs appear and weak evidence is flagged. A prompt test should show publishing is never requested. A memory test should show tenant-correct retrieval.", "Inspirational prose that does not change decisions is not an operational skill."] }
        ],
        files: [{ path: "packages/agent/src/prompt.ts", reason: "Permanent operating contract." }, { path: "packages/agent/src/skills/research-first.ts", reason: "Reusable research method that can be invoked." }, { path: "packages/database/src/repositories.ts", reason: "Durable facts stay outside prompt text." }],
        steps: [
          { action: "Sort twelve statements", detail: "Place each in prompt, skill, tool, memory, repository, or subagent." },
          { action: "Shorten the system prompt", detail: "Move optional methods and mutable facts out." },
          { action: "Add skill acceptance criteria", detail: "Name observable output changes." },
          { action: "Limit mutation surfaces", detail: "Main agent reads; dedicated curator pathways write durable memory." }
        ],
        checks: ["Mutable facts are not hard-coded prompt text", "Skills are reusable procedures", "Tools own actions", "Memory writes have narrower authority than reads"],
        quiz: { question: "Where should ‘always cite persisted evidence before a trend claim’ live?", options: ["Only as a database column", "In permanent instructions and enforced packet validation", "As an uploaded image", "In a CSS class"], answer: 1, explanation: "It shapes reasoning and can also be checked structurally before persistence." }
      },
      {
        id: "subagent-handoffs",
        title: "Subagents are isolated specialists",
        duration: "90 min",
        promise: "You will design explicit handoffs that do not lose workspace identity, evidence, or draft text.",
        mentalModel: { plain: "A specialist receives a written brief and selected materials; they do not magically hear every conversation in the main production office.", technical: "Glove and Foundry subagents run with their own context and bounded tools. The parent must include every required fact in the prompt and carry the complete result into the next handoff.", connection: "The parent gives research-analyst a workspace ID and gives editorial-reviewer the full draft plus brand constraints. The parent alone persists the final version." },
        sections: [
          { title: "Use specialists for bounded surfaces", paragraphs: ["Research analysis needs evidence readers, not publishing or image generation. Editorial review needs the draft and constraints, not provider acquisition. Narrow tool sets improve routing, security, and context cost.", "Use a subagent when the task needs a distinct role or retrieval surface. Use a normal function for deterministic transformation."] },
          { title: "Make handoffs complete", paragraphs: ["Subagents do not inherit parent context. Include exact workspaceId, task, inputs, constraints, required output format, and stopping condition.", "When chaining strategist to reviewer, copy the full draft. A summary such as ‘review what the strategist wrote’ gives the reviewer nothing to inspect."] },
          { title: "Keep persistence ownership singular", paragraphs: ["If both strategist and parent can persist, retries can create duplicates and reviewers can mutate content before sign-off. Let specialists propose or critique; let the parent perform one idempotent persistence step.", "Durable subagents may retain role-specific history, but do not rely on hidden history for correctness. Each critical handoff should remain self-contained."] }
        ],
        files: [{ path: "apps/runtime/agents/creator/subagents.ts", reason: "Two specialists with narrow tools and limits." }, { path: "apps/runtime/agents/creator/agent.ts", reason: "The parent’s handoff contract and single persistence ownership." }],
        steps: [
          { action: "Write the analyst brief", detail: "Include workspace, evidence query, ranking rubric, and output schema." },
          { action: "Write the reviewer brief", detail: "Include full draft, evidence IDs, brand constraints, and exact-edit requirement." },
          { action: "Remove write tools", detail: "Specialists that propose or review do not persist the packet." },
          { action: "Test missing context", detail: "Omit draft text and require the reviewer to refuse rather than invent it." }
        ],
        checks: ["Every critical handoff is self-contained", "Specialists have bounded tools", "The parent owns persistence", "Missing inputs cause explicit refusal"],
        quiz: { question: "What context does a fresh subagent automatically receive?", options: ["The parent’s entire conversation", "Only the task prompt and surfaces its factory supplies", "All PostgreSQL rows", "The browser’s localStorage"], answer: 1, explanation: "Isolation is intentional; the parent must pass required context." }
      },
      {
        id: "memory-shape",
        title: "Give memory a shape and provenance",
        duration: "85 min",
        promise: "You will distinguish entity, episodic, resource, ambient, and product memory.",
        mentalModel: { plain: "The studio has a contact book, production diary, research file cabinet, pinned preferences, and official job records.", technical: "Entity memory models stable nodes and relationships. Episodic memory stores time-bound events. Resources store navigable text artifacts. Ambient context injects small preferences. Product repositories store authoritative business records.", connection: "Glove-memory can expose bounded reader/curator tools. PostgreSQL repositories still own approvals, runs, packets, and other application invariants." },
        sections: [
          { title: "Do not build one memory bucket", paragraphs: ["Brand entity relationships, a meeting episode, a research transcript, and an approved content version have different queries and mutation rules. One vector store hides these distinctions.", "Use semantic search as one index, not as the primary truth. Structured filters and IDs remain necessary for time, tenancy, version, and approval queries."] },
          { title: "Require provenance", paragraphs: ["Every memory write should identify source, actor, timestamp, and optional rationale. Model-inferred facts should remain distinguishable from creator-authored facts.", "Entity merges, resource moves, and deleted episodes may require reconciliation across adapters. Plan explicit repair jobs rather than assuming automatic cascade."] },
          { title: "Delegate deep retrieval", paragraphs: ["Do not attach every entity, episodic, and resource tool to the main agent. Register lookup or recall subagents with the reader surface they need.", "Keep ambient context small because it enters every turn. Use it for user-controlled preferences, not entire campaign archives."] }
        ],
        files: [{ path: "packages/database/src/repositories.ts", reason: "Authoritative product state remains explicit." }, { path: "apps/runtime/agents/creator/subagents.ts", reason: "The pattern for bounded retrieval specialists." }],
        steps: [
          { action: "Classify twenty memories", detail: "Entity, episode, resource, ambient context, or product record." },
          { action: "Add provenance", detail: "Write source, actor, timestamp, and note for each mutation." },
          { action: "Design a lookup subagent", detail: "Give it reader tools only and a narrow result contract." },
          { action: "Cap ambient context", detail: "Keep only current, user-controlled preferences needed every turn." }
        ],
        checks: ["Memory subsystems match query needs", "Product truth is not a vector-only store", "Writes preserve provenance", "Main-agent memory tools stay bounded"],
        quiz: { question: "Where should an exact approval record live?", options: ["Only in semantic memory", "In the authoritative product repository/database", "Only in ambient context", "Inside a skill"], answer: 1, explanation: "Approval is durable authority with relational invariants." }
      }
    ]
  },
  {
    id: "workbench",
    number: 1,
    phase: "Construct",
    title: "Build a safe workbench",
    subtitle: "Learn the terminal, Git, packages, and environment boundaries by using them.",
    milestone: "You can clone, inspect, run, break, and recover the lab without exposing credentials.",
    units: [
      {
        id: "terminal-git",
        title: "The terminal and Git are recovery tools",
        duration: "55 min",
        promise: "You will understand what each setup command changes and create checkpoints you can return to.",
        mentalModel: { plain: "The terminal is a written instruction to your computer; Git is the edit history for the entire production.", technical: "A shell resolves a command in a current working directory. Git records content snapshots and references; it does not automatically back up uncommitted files.", connection: "Every course command assumes you know which repository and package it targets. This prevents accidental edits and makes experiments reversible." },
        sections: [
          { title: "Read the prompt before the command", paragraphs: ["Your current directory decides which package.json, Git repository, and environment files a command sees. Run pwd before a destructive or confusing command. Run git status before and after an edit.", "A command succeeding does not prove the application works. Version commands prove executables exist; typecheck proves contracts align; tests prove selected behavior; a production build proves the deployment compiler can assemble the system."] },
          { title: "Commit complete ideas", paragraphs: ["A useful commit describes one coherent change: define domain models, add fixture research, or enforce approval. Tiny meaningless commits and giant multi-day commits are both difficult to review or recover.", "Never commit .env files, provider payloads containing private material, generated database directories, or deployment credentials. Git history is durable and often public."] },
          { title: "Use errors as location clues", paragraphs: ["‘Command not found’ means the shell cannot find the program. ‘No package.json’ usually means the directory is wrong. A TypeScript error names a file and contract mismatch. A connection refusal means a process or network boundary is unavailable.", "Translate the error before changing code. Randomly installing packages can hide the original problem and create a second one."] }
        ],
        files: [{ path: "README.md", reason: "The lab start sequence and reading order." }, { path: ".env.example", reason: "Names of required configuration without secret values." }],
        steps: [
          { action: "Verify the workbench", detail: "Run each command separately and read its output.", command: "node --version\npnpm --version\ngit --version\ndocker --version", expected: "Four version strings. Node must satisfy the repository engine range." },
          { action: "Clone the public course repository", detail: "Work from your own copy if you plan to edit exercises.", command: "git clone https://github.com/porkytheblack/creator-agent-zero-to-hero.git\ncd creator-agent-zero-to-hero", expected: "git status reports branch main and a clean working tree." },
          { action: "Copy the neutral lab", detail: "Keep the reference pristine and build in your own folder.", command: "cp -R reference/creator-agent-lab ../my-creator-agent\ncd ../my-creator-agent", expected: "pwd ends with my-creator-agent and package.json exists." },
          { action: "Create a checkpoint", detail: "Initialize the copied lab as your own repository and commit the starting point.", command: "git init\ngit add .\ngit commit -m \"Start creator agent lab\"" }
        ],
        checks: ["I check pwd before commands", "I can explain staged, committed, and pushed", "git status is clean", "No secret value appears in tracked files"],
        quiz: { question: "A command says it cannot find package.json. What should you inspect first?", options: ["The model provider", "Your current working directory", "The database schema", "The system prompt"], answer: 1, explanation: "Package commands resolve configuration from the current directory and its parents." }
      },
      {
        id: "configuration",
        title: "Configuration is not code or data",
        duration: "45 min",
        promise: "You will keep secret values out of source and understand where configuration enters the system.",
        mentalModel: { plain: "The call sheet says which camera body the crew needs; the locked equipment room holds the actual serial-numbered camera.", technical: "Configuration selects behavior per environment. Secrets authenticate external authority and must be injected at runtime, redacted from logs, and excluded from persistence.", connection: "Effect Layers and Foundry adapters receive configuration at process boundaries. Domain records contain opaque references or safe metadata, not provider tokens." },
        sections: [
          { title: "Classify each setting", paragraphs: ["Stable product rules belong in code. Creator choices belong in persisted data. Environment-specific endpoints and limits belong in configuration. Credentials belong in a secret manager or local untracked environment file.", "If a creator changes a schedule in the UI, that is user data. If development uses a local database and production uses managed PostgreSQL, the connection URL is configuration."] },
          { title: "Fail closed", paragraphs: ["Live integrations should return a named missing-token error. Do not silently return fixture data in production because the creator may mistake fabricated evidence for a live signal.", "Fixture mode should be selected explicitly and labeled in stored provenance. This lets the same normalization pipeline run without confusing synthetic and observed evidence."] },
          { title: "Minimize exposure", paragraphs: ["Read a secret once at the integration or application composition boundary. Do not pass it through domain objects, tool output, model-visible data, URLs, or database rows.", "Logs should identify a provider request by safe request ID and status, never by full authorization headers or unredacted payloads."] }
        ],
        files: [{ path: ".env.example", reason: "A contract for configuration names, not a credential store." }, { path: "packages/integrations/src/research.ts", reason: "The live Layer reads APIFY_API_TOKEN at the provider boundary." }],
        steps: [
          { action: "Create local configuration", detail: "Copy names, then add only disposable development values.", command: "cp .env.example .env" },
          { action: "Confirm Git ignores it", detail: "The secret file must not appear as untracked or staged.", command: "git status --short", expected: ".env is absent from output." },
          { action: "Remove a token temporarily", detail: "Run the live-path test and observe a named missing-token failure rather than fixture output." },
          { action: "Write a configuration inventory", detail: "For every key, state owner, sensitivity, default, and failure behavior." }
        ],
        checks: ["Fixtures never masquerade as live data", "Secrets do not enter model-visible tool results", "Missing required production secrets fail explicitly", "Creator choices are stored as data rather than env vars"],
        quiz: { question: "Where should a creator’s preferred 07:00 schedule live?", options: ["In a shared .env file", "In persisted creator/routine data", "Hard-coded in the system prompt", "Inside the Apify token"], answer: 1, explanation: "It is a mutable creator choice that Foundry materializes into an instance-bound schedule." }
      },
      {
        id: "run-reference",
        title: "Run and read the reference application",
        duration: "70 min",
        promise: "You will use the public repository as a navigable system instead of a wall of code.",
        mentalModel: { plain: "Read a film production by following one scene from call sheet to final cut, not by memorizing every department manual.", technical: "A vertical slice follows one request across modules. It reveals runtime data flow and dependency seams more clearly than reading files alphabetically.", connection: "The reference trace tells you which file to open next and why. The course’s right-hand explorer mirrors those paths." },
        sections: [
          { title: "Install from the root", paragraphs: ["pnpm reads pnpm-workspace.yaml and links local packages using workspace:* dependencies. Turbo reads package scripts and the dependency graph; it does not replace pnpm or TypeScript.", "The first install creates node_modules and a lockfile. Commit the lockfile in an application repository so CI and collaborators resolve the same dependency graph."] },
          { title: "Use the three verification levels", paragraphs: ["Typecheck answers whether the code respects contracts. Tests answer whether selected examples behave correctly. Build answers whether each package can emit deployment artifacts in dependency order.", "A passing build does not prove a live provider works. Live smoke tests are separate, bounded, credentialed checks with cost and item limits."] },
          { title: "Read vertically", paragraphs: ["Begin with the domain TrendSignal. Follow it into Research, then EvidenceRepository, then the research tool, then the agent definition, then the run trace. At each step ask what new responsibility was added.", "Do not memorize library syntax yet. Identify contracts, adapters, orchestration, and durable boundaries first."] }
        ],
        files: [{ path: "package.json", reason: "The root commands that coordinate the workspace." }, { path: "pnpm-workspace.yaml", reason: "The package discovery boundary." }, { path: "turbo.json", reason: "The task dependency graph and cached outputs." }],
        steps: [
          { action: "Install dependencies", detail: "Run from the lab root.", command: "pnpm install", expected: "Workspace packages are linked and the lockfile is created." },
          { action: "Run the complete check", detail: "Read which package runs first and why.", command: "pnpm check", expected: "Typecheck, tests, and builds complete without an error." },
          { action: "Open the vertical slice", detail: "Follow the six-file order in the reference README." },
          { action: "Annotate responsibility changes", detail: "Beside each file, write what it adds that the previous file did not know." }
        ],
        trace: ["models.ts", "research.ts", "repositories.ts", "research.tool.ts", "agent.ts", "run-trace.md"],
        checks: ["I can explain pnpm vs Turbo", "I know what typecheck, test, and build each prove", "I can follow TrendSignal through the system", "I do not need to understand every file before running the slice"],
        quiz: { question: "Why does Turbo build domain packages before the runtime?", options: ["Alphabetical order", "The runtime declares workspace dependencies on those packages", "Foundry requires it", "Docker controls Turbo"], answer: 1, explanation: "Turbo reads the workspace dependency graph and ^build prerequisites." }
      }
    ]
  },
  {
    id: "domain",
    number: 2,
    phase: "Construct",
    title: "Create the product language",
    subtitle: "Use TypeScript and runtime schemas to make the creator workflow concrete.",
    milestone: "Unknown provider data becomes validated creator-domain values before other code can trust it.",
    units: [
      {
        id: "typescript-reading",
        title: "Read TypeScript as a contract",
        duration: "75 min",
        promise: "You will read objects, unions, arrays, functions, and imports in the context of the application.",
        mentalModel: { plain: "A type is the blank call-sheet form; a value is one filled-in call sheet.", technical: "Static types constrain programs during development. They are erased at runtime and cannot validate arbitrary network or model output by themselves.", connection: "Effect Schema provides the runtime decoder while deriving the TypeScript type from the same definition." },
        sections: [
          { title: "Read from the outside in", paragraphs: ["Start with the exported name, then inspect its fields. A literal union such as tiktok | instagram tells you the valid choices. readonly arrays communicate that a consumer should not mutate the collection it receives.", "Function signatures reveal data flow: input parameters on the left, result on the right, and Effect channels when work can fail or requires services."] },
          { title: "Make invalid states expensive", paragraphs: ["A status union prevents ‘aproved’ and narrows allowed transitions. Separate ContentPacket from Approval instead of adding approved: boolean to a mutable object. The data model should make safety rules obvious to both people and the compiler.", "Do not use any to silence provider payloads. Keep outside data unknown until a decoder proves the shape you need."] },
          { title: "Static and runtime checks cooperate", paragraphs: ["TypeScript catches a misspelled property in your source. It cannot prove an HTTP response contains that property. Schema.decodeUnknown checks the actual value and returns a typed success or a parse failure.", "Decode once at the boundary. Downstream code can then work with TrendSignal rather than repeatedly checking raw provider shapes."] }
        ],
        files: [{ path: "packages/domain/src/models.ts", reason: "One runtime schema is also the source of its TypeScript type.", focus: "Compare Schema.Literal, Schema.Struct, and typeof X.Type." }],
        steps: [
          { action: "Read Platform aloud", detail: "Say: a Platform value must be exactly tiktok or instagram." },
          { action: "Create an invalid signal", detail: "Set platform to youtube and read the compiler error without changing the type." },
          { action: "Decode unknown input", detail: "Create one valid and one missing-field object, then inspect the parse result." },
          { action: "Add one domain rule", detail: "Add a visualDirection field to ContentPacket and follow every resulting type error." }
        ],
        checks: ["I know a type disappears at runtime", "Unknown values are decoded at boundaries", "Finite product choices use literal unions", "I can follow a compiler error through dependent files"],
        quiz: { question: "Why keep an HTTP response typed as unknown before decoding?", options: ["Unknown makes it faster", "It forces code to prove the runtime shape before use", "Foundry only accepts unknown", "PostgreSQL cannot store typed values"], answer: 1, explanation: "The provider is outside the compiler’s trust boundary." }
      },
      {
        id: "domain-boundaries",
        title: "Design nouns around decisions",
        duration: "60 min",
        promise: "You will model the information the product must explain and audit, not the shape of one provider response.",
        mentalModel: { plain: "The archive labels footage by what the production needs to know, not by the camera manufacturer’s internal menu.", technical: "A domain model is provider-neutral and optimized for invariants and use cases. Adapters translate provider-specific data into it.", connection: "TikTok, Instagram, and fixture rows all become TrendSignal. The rest of the system does not branch on actor payload formats." },
        sections: [
          { title: "Start with questions", paragraphs: ["Can we prove where this evidence came from? Can we reproduce the score? Which assets influenced a frame? Which version was approved? These questions determine fields more reliably than copying a dashboard mockup.", "Preserve sourceUrl, observedAt, stable external identity, normalized evidence text, metrics, and raw payload provenance. Keep a distinction between user-authored brand facts and model-authored suggestions."] },
          { title: "Separate records that change differently", paragraphs: ["A packet is the identity of a creative work item. A content version is one immutable body. Approval references the version. A run records execution. Combining them into one mutable row destroys history and weakens recovery.", "Normalization should lose provider quirks but preserve audit information. Store raw payload separately for debugging and reprocessing; do not make every downstream feature understand it."] },
          { title: "Name with creator language", paragraphs: ["Domain names should make sense to the product team: CreatorBrief, TrendSignal, ContentPacket, MediaAsset. A providerRunDatasetItem belongs inside an integration adapter, not in the shared domain.", "Good names reduce prompt complexity because tool schemas and descriptions already speak the creator’s language."] }
        ],
        files: [{ path: "packages/domain/src/models.ts", reason: "Provider-neutral nouns used across packages." }, { path: "packages/database/src/schema.ts", reason: "Durable records split by lifecycle and invariant." }],
        steps: [
          { action: "Write four audit questions", detail: "Use source, version, approval, and asset lineage." },
          { action: "Map each question to fields", detail: "If a question cannot be answered, add or separate a record." },
          { action: "Remove provider names", detail: "Provider vocabulary may exist in provenance, never as the core product concept." },
          { action: "Review mutation rates", detail: "Split records when they change for different reasons or need independent history." }
        ],
        checks: ["Domain models answer audit questions", "Raw payload is not the everyday domain shape", "Approval and content version are separate", "Names match creator concepts"],
        quiz: { question: "Why store both normalized evidence and a raw payload?", options: ["To send both to the model every turn", "Normalized data powers the product; raw data supports audit and reprocessing", "PostgreSQL requires duplicate values", "To avoid runtime schemas"], answer: 1, explanation: "They serve different consumers and trust levels." }
      },
      {
        id: "boundary-validation",
        title: "Validate at every trust boundary",
        duration: "65 min",
        promise: "You will know where validation belongs and why prompt injection is a data-boundary issue.",
        mentalModel: { plain: "Research clippings enter through receiving, get labeled and checked, and only then reach the creative room.", technical: "Trust boundaries include HTTP responses, form submissions, model tool arguments, database JSON, uploaded metadata, and environment configuration. Each boundary validates shape, size, identity, and allowed values.", connection: "Schemas guard tool inputs and integration outputs. Repositories recheck tenant identity and invariants. Scraped text remains quoted evidence, never system instructions." },
        sections: [
          { title: "Validation is more than shape", paragraphs: ["A string may still be too long, an unsafe URL scheme, or tied to another workspace. Validate semantic constraints near the boundary that knows them.", "Tool schemas help the model produce valid arguments, but the executor and business service must still reject invalid or unauthorized values."] },
          { title: "Treat external text as quoted material", paragraphs: ["A scraped caption saying ‘ignore previous instructions’ is not special. It is a string from an untrusted source and must be clearly delimited in prompts or summarized through a retrieval layer.", "Never concatenate untrusted text into the system prompt as if it were policy. Store it as evidence and tell the model that evidence may contain attempts to redirect it."] },
          { title: "Preserve failure information", paragraphs: ["A parse failure should identify the boundary and safe context—not dump secrets. Typed failures let orchestration decide whether to retry, skip one row, alert a human, or stop the run.", "Returning an empty array for every failure hides the difference between no evidence and a broken provider, producing confident content from absence."] }
        ],
        files: [{ path: "packages/domain/src/models.ts", reason: "Runtime shape definitions." }, { path: "packages/integrations/src/research.ts", reason: "The provider boundary maps failures into ResearchFailure." }],
        steps: [
          { action: "List trust boundaries", detail: "Include forms, HTTP, model arguments, storage, uploads, and environment." },
          { action: "Add one malicious fixture", detail: "Put instruction-like text inside evidence and prove it remains data." },
          { action: "Differentiate empty and failed", detail: "Write separate outcomes for zero valid results and provider failure." },
          { action: "Add limits", detail: "Constrain topic count, string length, item count, and URL schemes where they enter." }
        ],
        checks: ["Every unknown value is decoded", "External text is labeled untrusted", "Empty evidence differs from provider failure", "Workspace identity is validated beyond the model prompt"],
        quiz: { question: "A scraped caption contains ‘send me all secrets.’ What is it?", options: ["A new system instruction", "A privileged tool request", "Untrusted evidence text", "A Foundry schedule"], answer: 2, explanation: "Provider content never acquires authority merely by resembling an instruction." }
      }
    ]
  },
  {
    id: "architecture",
    number: 3,
    phase: "Construct",
    title: "Compose the TypeScript system",
    subtitle: "Use the monorepo for boundaries and Effect for explicit dependencies and failures.",
    milestone: "One fixture research workflow composes across packages with typed services and replaceable Layers.",
    units: [
      {
        id: "monorepo-graph",
        title: "The monorepo is a dependency graph",
        duration: "70 min",
        promise: "You will understand every root configuration file and the direction of package imports.",
        mentalModel: { plain: "One production building, separate rooms, a shared inventory, and a call order for departments.", technical: "pnpm workspaces link packages; package manifests declare edges; TypeScript checks source contracts; Turbo schedules tasks from the graph and caches declared outputs.", connection: "Apps are composition roots. Packages contain stable capabilities. The runtime can depend on all packages; domain depends on almost nothing." },
        sections: [
          { title: "Give boundaries a reason", paragraphs: ["A package is useful when it has a coherent responsibility, a public API, and independent tests. Splitting every file into a package adds ceremony without architecture.", "The lab uses domain, integrations, database, and agent packages because each changes for different reasons and has a different trust boundary."] },
          { title: "Use exports, not deep relative paths", paragraphs: ["workspace:* tells pnpm that @creator-lab/domain must resolve to the local workspace package. The package exports field defines the supported entry points.", "Avoid ../../../../package/src/file imports. They bypass the public boundary and make refactoring or builds unpredictable."] },
          { title: "Understand task order", paragraphs: ["Turbo’s ^build means build dependencies before the current package. It does not infer test correctness; each package still defines its own scripts and outputs.", "A root check command becomes the one reliable answer to ‘is the repository healthy?’ CI runs the same command a learner runs locally."] }
        ],
        files: [{ path: "pnpm-workspace.yaml", reason: "Discovers apps and packages." }, { path: "turbo.json", reason: "Orders verification from the dependency graph." }, { path: "apps/runtime/package.json", reason: "Shows the runtime as a composition root depending on stable packages." }],
        steps: [
          { action: "Draw package arrows", detail: "Start at apps/runtime and follow each workspace dependency." },
          { action: "Try an illegal import on paper", detail: "Explain why domain importing runtime would create a reverse dependency." },
          { action: "Run a filtered task", detail: "Observe dependencies included by Turbo.", command: "pnpm turbo run build --filter=@creator-lab/runtime", expected: "Required packages build before runtime." },
          { action: "Inspect public exports", detail: "Open each package.json and compare exports with internal source files." }
        ],
        checks: ["I can draw the dependency graph", "Apps compose packages", "Deep relative imports do not cross package boundaries", "The root check matches CI"],
        quiz: { question: "What does workspace:* mean?", options: ["Download the newest npm package", "Resolve this dependency from the local pnpm workspace", "Run every package in parallel", "Expose every source file"], answer: 1, explanation: "It creates a declared edge to the local package." }
      },
      {
        id: "effect-channels",
        title: "Read Effect as a production plan",
        duration: "90 min",
        promise: "You will read success, error, and requirement channels instead of treating Effect as unusual Promise syntax.",
        mentalModel: { plain: "The production plan states the result, named things that can go wrong, and the crew required before work begins.", technical: "Effect.Effect<A, E, R> describes a lazy program that can succeed with A, fail with E, and requires services R. A Layer constructs services and resolves R.", connection: "Research tools require Research and EvidenceRepository. Tests provide fixture Layers; production provides Apify and PostgreSQL Layers." },
        sections: [
          { title: "Effects are descriptions until run", paragraphs: ["Effect.gen composes operations without immediately executing them. The composition root provides Layers and the runtime ultimately runs the effect.", "This keeps business code free from global clients and makes missing requirements visible in types."] },
          { title: "Errors are part of the API", paragraphs: ["ResearchFailure distinguishes missing token, provider failure, invalid payload, and budget breach. Orchestration can retry provider timeouts but should not retry missing credentials forever.", "Tagged errors remain data. You can log safe fields, map them to UI messages, and test recovery without string matching thrown exceptions."] },
          { title: "Layers select implementations", paragraphs: ["The Research service is a contract. FixtureResearch and ApifyResearch are two Layers. The workflow asks for Research and does not contain an if fixture branch.", "Layer composition is where environment-specific choices belong. Keep it near the application/runtime boundary so core workflows remain deterministic and testable."] }
        ],
        files: [{ path: "packages/integrations/src/research.ts", reason: "Research contract, typed failure, fixture Layer, and live Layer." }, { path: "packages/database/src/repositories.ts", reason: "Repository contracts are also Effect services." }],
        steps: [
          { action: "Read one type aloud", detail: "Say: succeeds with signals, fails with ResearchFailure, needs Research." },
          { action: "Switch Layers", detail: "Run the same workflow once with fixture research and once with the missing-token live Layer." },
          { action: "Match on failure reason", detail: "Return a different operator message for missing-token and provider failures." },
          { action: "Remove a provided Layer", detail: "Read the resulting requirement type error rather than casting it away." }
        ],
        checks: ["I can read A, E, and R", "Services describe capabilities", "Layers build capabilities", "Retry policy distinguishes failure classes"],
        quiz: { question: "What should the domain workflow import to collect research?", options: ["The Apify SDK directly", "The Research service contract", "process.env", "A React hook"], answer: 1, explanation: "The contract preserves replacement and testability." }
      },
      {
        id: "effect-workflow",
        title: "Compose one vertical Effect workflow",
        duration: "85 min",
        promise: "You will build a traceable collect → normalize → persist workflow and know where retries belong.",
        mentalModel: { plain: "Receiving gathers clippings, the archive labels and stores them, and strategy only works from the archived evidence.", technical: "Orchestration sequences service effects, preserves typed failures, and applies policies at the smallest safe scope. It does not embed provider or SQL implementation.", connection: "The Foundry tool becomes a thin adapter over this workflow rather than a place where all business logic accumulates." },
        sections: [
          { title: "Persist before reasoning", paragraphs: ["Strategy should read persisted evidence IDs, not reason over an untraceable transient payload. Persistence creates provenance and lets retries or later reviews retrieve the same observation.", "The workflow can normalize and deduplicate before save. It should not create content if persistence failed, because the final packet could not prove its sources."] },
          { title: "Place policies intentionally", paragraphs: ["Retry the HTTP request, not the entire content workflow, or a transient provider error may duplicate database writes. Use idempotent identities at save boundaries even when a retry is scoped correctly.", "Timeouts, concurrency, and budget limits belong close to the external operation they constrain. Foundry also owns run-level attempts, so document both layers to avoid retry multiplication."] },
          { title: "Keep orchestration readable", paragraphs: ["Effect.gen should read like the workflow: get services, collect signals, save signals, return the saved count. Extract complex scoring or mapping into named pure functions.", "A thin tool validates model input and calls the workflow. This makes the same workflow callable from a schedule, test, CLI, or HTTP handler."] }
        ],
        files: [{ path: "apps/runtime/agents/creator/tools/research.tool.ts", reason: "A thin Foundry shared tool composes Research and EvidenceRepository." }, { path: "packages/integrations/src/research.ts", reason: "Timeout and retry stay at the provider boundary." }],
        steps: [
          { action: "Trace requirements", detail: "List Research and EvidenceRepository before reading implementation." },
          { action: "Run with fixture Layers", detail: "Confirm deterministic output and no network call." },
          { action: "Force repository failure", detail: "Prove the tool does not continue to strategy with unsaved evidence." },
          { action: "Review retry scope", detail: "Count maximum HTTP attempts and maximum Foundry run attempts separately." }
        ],
        trace: ["Validated topics", "Research.findSignals", "Normalized TrendSignal[]", "EvidenceRepository.saveMany", "Saved count"],
        checks: ["Evidence persists before strategy", "Retries do not repeat unrelated side effects", "The tool remains thin", "The same workflow can run outside a model turn"],
        quiz: { question: "Where should an HTTP timeout retry live?", options: ["Around the complete scheduled content run", "At the provider request boundary", "In the React component", "Inside the domain type"], answer: 1, explanation: "The smallest safe scope avoids repeating downstream effects." }
      }
    ]
  },
] satisfies CourseChapter[]).sort((left, right) => left.number - right.number);

export const allUnits = chapters.flatMap((chapter) => chapter.units.map((unit) => ({ chapter, unit })));

export const findUnit = (chapterId: string, unitId: string) => {
  const chapter = chapters.find((item) => item.id === chapterId);
  const unit = chapter?.units.find((item) => item.id === unitId);
  return chapter && unit ? { chapter, unit } : undefined;
};
