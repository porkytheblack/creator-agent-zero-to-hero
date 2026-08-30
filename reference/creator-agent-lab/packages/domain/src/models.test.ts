import { Schema } from "effect";
import { describe, expect, it } from "vitest";
import { ContentPacket, TrendSignal } from "./models.js";

describe("domain contracts", () => {
  it("decodes a valid observed trend", () => {
    const signal = Schema.decodeUnknownSync(TrendSignal)({
      id: "signal-1",
      platform: "tiktok",
      sourceUrl: "https://example.com/video/1",
      observedAt: "2026-08-01T07:00:00.000Z",
      hook: "Start with the failed attempt",
      evidenceText: "Three public examples used the same opening.",
      score: 82
    });
    expect(signal.platform).toBe("tiktok");
    expect(signal.observedAt).toBeInstanceOf(Date);
  });

  it("rejects an impossible content version", () => {
    expect(() => Schema.decodeUnknownSync(ContentPacket)({
      id: "packet-1",
      workspaceId: "workspace-1",
      version: 0,
      status: "in_review",
      angle: "Teach through a mistake",
      script: "Opening line",
      shotList: ["Close-up"],
      evidenceIds: ["signal-1"]
    })).toThrow();
  });
});
