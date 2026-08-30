import type { ContentPacket, CreatorBrief, TrendSignal } from "@creator-lab/domain";
import { Context, Data, Effect } from "effect";

export class RepositoryFailure extends Data.TaggedError("RepositoryFailure")<{
  readonly operation: string;
  readonly message: string;
}> {}

export class CreatorRepository extends Context.Tag("CreatorRepository")<CreatorRepository, {
  readonly getBrief: (workspaceId: string) => Effect.Effect<CreatorBrief, RepositoryFailure>;
}>() {}

export class EvidenceRepository extends Context.Tag("EvidenceRepository")<EvidenceRepository, {
  readonly saveMany: (workspaceId: string, rows: readonly TrendSignal[]) => Effect.Effect<void, RepositoryFailure>;
  readonly listRecent: (workspaceId: string, limit: number) => Effect.Effect<readonly TrendSignal[], RepositoryFailure>;
}>() {}

export class ContentRepository extends Context.Tag("ContentRepository")<ContentRepository, {
  readonly createVersion: (packet: ContentPacket) => Effect.Effect<ContentPacket, RepositoryFailure>;
  readonly approveVersion: (contentVersionId: string, actorId: string) => Effect.Effect<void, RepositoryFailure>;
}>() {}

// Production Layers implement these contracts with Drizzle and PostgreSQL.
// Tests provide deterministic in-memory Layers. Agent tools depend on the
// contracts, so the reasoning code never imports SQL or a database client.
