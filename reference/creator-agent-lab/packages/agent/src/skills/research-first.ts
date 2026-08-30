export const researchFirstSkill = {
  name: "research-first",
  description: "Use before proposing content based on current public signals.",
  exposeToAgent: true,
  handler: async ({ args }: { args?: string }) => [
    "Research protocol:",
    "1. Read persisted evidence; never browse by implication.",
    "2. Separate observations from your inference.",
    "3. Carry evidence IDs into the content packet.",
    "4. Prefer several independent sources over one viral outlier.",
    "5. Say that evidence is insufficient when it is.",
    `Current focus: ${args ?? "the creator's saved topics"}`
  ].join("\n")
};
