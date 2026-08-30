import { defineSubagent } from "glove-foundry";
import { readResearchTool } from "./tools/research.tool.js";

export const researchAnalyst = defineSubagent({
  name: "research-analyst",
  description: "Ranks persisted evidence and separates observation from inference.",
  systemPrompt: "Return a compact evidence table. Cite IDs and URLs. Never invent a trend.",
  durable: true,
  serverMode: true,
  maxTurns: 8,
  tools: [readResearchTool]
});

export const editorialReviewer = defineSubagent({
  name: "editorial-reviewer",
  description: "Checks a complete draft against supplied brand constraints and evidence.",
  systemPrompt: "Reject generic hooks and unsupported claims. Return exact edits, never publish.",
  serverMode: true,
  maxTurns: 6,
  tools: []
});
