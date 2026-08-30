import type { TrendSignal } from "@creator-lab/domain";
import { Context, Data, Effect, Layer } from "effect";

export class ResearchFailure extends Data.TaggedError("ResearchFailure")<{
  readonly reason: "missing-token" | "provider" | "invalid-payload" | "budget";
  readonly message: string;
}> {}

export class Research extends Context.Tag("Research")<Research, {
  readonly findSignals: (topics: readonly string[]) => Effect.Effect<readonly TrendSignal[], ResearchFailure>;
}>() {}

export const FixtureResearch = Layer.succeed(Research, {
  findSignals: (topics) => Effect.succeed(topics.map((topic, index) => ({
    id: `fixture-${index}`,
    platform: index % 2 === 0 ? "tiktok" as const : "instagram" as const,
    sourceUrl: `https://example.invalid/signals/${index}`,
    observedAt: new Date("2026-08-01T07:00:00Z"),
    hook: `A specific opening about ${topic}`,
    evidenceText: `Synthetic observation for ${topic}; use only for local learning.`,
    score: 78 - index
  })))
});

export const ApifyResearch = Layer.effect(Research, Effect.gen(function* () {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) {
    return yield* new ResearchFailure({ reason: "missing-token", message: "APIFY_API_TOKEN is not set" });
  }

  return {
    findSignals: (topics) => Effect.tryPromise({
      try: async () => {
        // Replace this teaching request with the actor and input your research plan selects.
        // Keep token transport, item limits, timeout, normalization, and cost ceiling here.
        const response = await fetch("https://api.apify.com/v2/acts/example/runs", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
          body: JSON.stringify({ topics, maxItems: 5, maxTotalChargeUsd: 0.05 })
        });
        if (!response.ok) throw new Error(`Apify returned ${response.status}`);
        return [] as readonly TrendSignal[];
      },
      catch: (error) => new ResearchFailure({ reason: "provider", message: String(error) })
    }).pipe(
      Effect.timeoutFail({
        duration: "30 seconds",
        onTimeout: () => new ResearchFailure({ reason: "provider", message: "Apify request timed out" })
      }),
      Effect.retry({ times: 2 })
    )
  };
}));
