import { Schema } from "effect";

export const Platform = Schema.Literal("tiktok", "instagram");
export type Platform = typeof Platform.Type;

export const TrendSignal = Schema.Struct({
  id: Schema.String,
  platform: Platform,
  sourceUrl: Schema.String,
  observedAt: Schema.DateFromString,
  hook: Schema.String,
  evidenceText: Schema.String,
  score: Schema.Number.pipe(Schema.between(0, 100))
});
export type TrendSignal = typeof TrendSignal.Type;

export const CreatorBrief = Schema.Struct({
  workspaceId: Schema.String,
  audience: Schema.String,
  voice: Schema.Array(Schema.String),
  boundaries: Schema.Array(Schema.String),
  topics: Schema.Array(Schema.String)
});
export type CreatorBrief = typeof CreatorBrief.Type;

export const ContentPacket = Schema.Struct({
  id: Schema.String,
  workspaceId: Schema.String,
  version: Schema.Number.pipe(Schema.int(), Schema.positive()),
  status: Schema.Literal("drafting", "in_review", "approved", "rejected"),
  angle: Schema.String,
  script: Schema.String,
  shotList: Schema.Array(Schema.String),
  evidenceIds: Schema.Array(Schema.String)
});
export type ContentPacket = typeof ContentPacket.Type;
