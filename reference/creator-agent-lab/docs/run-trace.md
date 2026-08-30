# Trace one morning run

Follow one request before trying to understand every file.

1. Foundry materializes the `creator-morning-loop` schedule for an agent instance.
2. At the scheduled instant it claims one run and reconstructs the instance, conversation, selected tools, skills, layers, and workspace.
3. The system prompt receives the exact workspace ID. The agent cannot infer a different tenant from a brand name.
4. The model calls `harvest_research` with at most five topics.
5. The tool resolves the `Research` Effect service. Tests receive `FixtureResearch`; production receives an Apify Layer.
6. The integration returns normalized `TrendSignal` values or a typed `ResearchFailure`.
7. `EvidenceRepository.saveMany` persists provenance before strategy begins.
8. The parent invokes `research-analyst` with the workspace ID. The subagent reads only the evidence surface it needs.
9. The parent writes a packet draft, then gives the full draft and brand constraints to `editorial-reviewer`. Subagents do not inherit parent context automatically.
10. `ContentRepository.createVersion` writes immutable version 1 and changes the packet status to `in_review`.
11. The run completes. The web app sees a creator-facing `TodayView`; it does not read Foundry internals.
12. A human approves `contentVersionId`. If the draft changes, version 2 has no approval. A publisher must verify approval for the exact version at the moment of egress.

This trace is the spine of the course. Each chapter replaces one simplified seam with its production implementation while keeping the same flow.
