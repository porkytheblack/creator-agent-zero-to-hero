import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { FixtureResearch, Research } from "./research.js";

describe("fixture research", () => {
  it("returns deterministic normalized signals without a network call", async () => {
    const program = Effect.gen(function* () {
      const research = yield* Research;
      return yield* research.findSignals(["editing", "creator workflow"]);
    }).pipe(Effect.provide(FixtureResearch));

    const signals = await Effect.runPromise(program);
    expect(signals).toHaveLength(2);
    expect(signals[0].hook).toContain("editing");
    expect(signals[0].sourceUrl).toContain("example.invalid");
  });
});
