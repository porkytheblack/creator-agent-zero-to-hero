import { integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey(),
  creatorBrief: jsonb("creator_brief").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const evidence = pgTable("evidence", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  platform: text("platform").notNull(),
  externalId: text("external_id").notNull(),
  sourceUrl: text("source_url").notNull(),
  observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
  normalized: jsonb("normalized").notNull(),
  rawPayload: jsonb("raw_payload").notNull()
}, (table) => [uniqueIndex("evidence_provider_identity").on(table.platform, table.externalId)]);

export const contentPackets = pgTable("content_packets", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  status: text("status").notNull().default("drafting"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const contentVersions = pgTable("content_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  packetId: uuid("packet_id").notNull().references(() => contentPackets.id),
  version: integer("version").notNull(),
  body: jsonb("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [uniqueIndex("content_packet_version").on(table.packetId, table.version)]);

export const approvals = pgTable("approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  contentVersionId: uuid("content_version_id").notNull().references(() => contentVersions.id),
  approvedBy: text("approved_by").notNull(),
  approvedAt: timestamp("approved_at", { withTimezone: true }).notNull().defaultNow()
});

export const runs = pgTable("runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  runKey: text("run_key").notNull().unique(),
  status: text("status").notNull(),
  error: jsonb("error"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true })
});
