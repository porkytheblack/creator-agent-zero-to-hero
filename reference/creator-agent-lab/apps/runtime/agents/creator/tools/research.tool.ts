import { EvidenceRepository } from "@creator-lab/database";
import type { TrendSignal } from "@creator-lab/domain";
import { FixtureResearch, Research } from "@creator-lab/integrations";
import { Effect, Layer } from "effect";
import type { GloveFoldArgs } from "glove-core";
import { z } from "zod";

const fixtureRows = new Map<string, readonly TrendSignal[]>();

const FixtureEvidenceRepository = Layer.succeed(EvidenceRepository, {
  saveMany: (workspaceId, rows) => Effect.sync(() => {
    fixtureRows.set(workspaceId, [...(fixtureRows.get(workspaceId) ?? []), ...rows]);
  }),
  listRecent: (workspaceId, limit) => Effect.succeed((fixtureRows.get(workspaceId) ?? []).slice(-limit))
});

const teachingServices = Layer.merge(FixtureResearch, FixtureEvidenceRepository);

export const harvestResearchTool: GloveFoldArgs<{ workspaceId: string; topics: string[] }> = {
  name: "harvest_research",
  description: "Collect a small bounded set of public signals and persist normalized evidence.",
  inputSchema: z.object({
    workspaceId: z.string().min(1),
    topics: z.array(z.string().min(1)).min(1).max(5)
  }),
  async do({ workspaceId, topics }) {
    const program = Effect.gen(function* () {
      const research = yield* Research;
      const evidence = yield* EvidenceRepository;
      const signals = yield* research.findSignals(topics);
      yield* evidence.saveMany(workspaceId, signals);
      return { saved: signals.length };
    }).pipe(Effect.provide(teachingServices));

    const data = await Effect.runPromise(program);
    return { status: "success" as const, data, generateSummaryArgs: data };
  },
  async generateToolSummary(args) {
    const { saved } = args as { saved: number };
    return `Saved ${saved} normalized research signals.`;
  }
};

export const readResearchTool: GloveFoldArgs<{ workspaceId: string; limit: number }> = {
  name: "read_research",
  description: "Read recent normalized evidence already stored for a workspace.",
  inputSchema: z.object({
    workspaceId: z.string().min(1),
    limit: z.number().int().min(1).max(20)
  }),
  async do({ workspaceId, limit }) {
    const program = Effect.gen(function* () {
      const evidence = yield* EvidenceRepository;
      return yield* evidence.listRecent(workspaceId, limit);
    }).pipe(Effect.provide(teachingServices));

    const data = await Effect.runPromise(program);
    return { status: "success" as const, data, generateSummaryArgs: { count: data.length } };
  },
  async generateToolSummary(args) {
    const { count } = args as { count: number };
    return `Read ${count} normalized research signals.`;
  }
};
