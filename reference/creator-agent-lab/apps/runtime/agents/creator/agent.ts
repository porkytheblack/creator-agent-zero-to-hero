import { CREATOR_AGENT_PROMPT, researchFirstSkill } from "@creator-lab/agent";
import { createAdapter } from "glove-core/models/providers";
import { defineAgent, defineSchedule } from "glove-foundry";
import { editorialReviewer, researchAnalyst } from "./subagents.js";
import { harvestResearchTool, readResearchTool } from "./tools/research.tool.js";

const morningSchedule = defineSchedule({
  name: "creator-morning-loop",
  description: "Research and prepare one review-ready creator packet.",
  timing: { kind: "cron", expression: "0 7 * * 1-5", timezone: "UTC" },
  message: "Read the saved creator brief, harvest bounded research, ask research-analyst to rank evidence, draft one coherent packet, ask editorial-reviewer for exact edits, then persist one version in review. Never publish."
});

export default defineAgent({
  description: "Evidence-led creator production agent with human-gated publishing",
  model: () => createAdapter({
    provider: process.env.OPENROUTER_API_KEY ? "openrouter" : "openai",
    model: process.env.OPENROUTER_MODEL ?? "gpt-4.1-mini",
    stream: true
  }),
  systemPrompt: (_agent, context) => [
    CREATOR_AGENT_PROMPT,
    `Current workspaceId: ${context.workspaceId}`,
    "Subagents are isolated. Copy the exact evidence or draft they need into each prompt."
  ].join("\n\n"),
  skills: [researchFirstSkill],
  tools: [harvestResearchTool, readResearchTool],
  subagents: [researchAnalyst, editorialReviewer],
  schedules: [morningSchedule],
  serverMode: true,
  maxTurns: 18,
  maxRetries: 2,
  maxConsecutiveErrors: 3,
  enableToolResultSummary: true,
  compactionLimit: 48_000,
  compactionInstructions: "Preserve workspace identity, evidence IDs, packet version, approval state, unfinished work, and errors."
});
