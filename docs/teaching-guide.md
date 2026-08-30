# Teaching guide

This course is designed for a capable creator who is new to software—not for someone who lacks intelligence. Avoid translating technical terms into childish language. Connect each term to something the learner already controls in a creative production.

## Recommended rhythm

Use three 90-minute sessions per week and treat one unit—not one chapter—as the normal session boundary:

1. **Map for 20 minutes.** Read the mental model and trace this unit's input, responsibility, and output.
2. **Read code for 20 minutes.** Open every named file in the embedded workspace and then in GitHub. Explain why that responsibility belongs there.
3. **Build for 35 minutes.** Follow the guided steps on a learning branch of the public Sharlet repository. Type the important lines instead of pasting everything.
4. **Prove for 15 minutes.** Run the smallest check, answer the knowledge check, and write the explain-back note from memory.

Take a full week for Effect, PostgreSQL, research, assets, and shipping. The learner should not mark a unit complete because the page has been read. Completion means they can name the boundary, find its code, predict its failure mode, and show the relevant check passing.

## The system-spine method

Keep returning to one unchanging trace: schedule → Foundry run → Glove reasoning → tool → Effect service → repository → persisted evidence/version → creator UI → approval gate. Each chapter zooms into part of that trace. At the end of a unit, ask the learner to point one step upstream and one step downstream from the code they changed. This prevents isolated vocabulary from replacing a real mental model.

The embedded code viewer contains selected Sharlet excerpts for orientation. The public Sharlet repository is the source of truth; every named file links directly to its complete implementation.

## How to handle errors

Use this order every time:

1. Read the entire error from the first line.
2. Identify the file and line number.
3. Say what the program expected and what it received.
4. Change one thing.
5. rerun the smallest relevant command.
6. Commit once the project is healthy again.

Errors are part of the curriculum. Do not silently repair every issue for the learner.

## Provider spend

The core course must work with fixtures and no paid provider calls. Add a live provider only after the deterministic pipeline passes. Every live smoke test should have an item limit, timeout, and maximum spend.

## Capstone review

The learner is ready when they can demonstrate this complete scenario:

- define a fictional brand and creator routine;
- add a realistic source fixture and a reference product image;
- trigger the same scheduled time twice;
- produce exactly one review-ready content packet;
- show the evidence and source-asset lineage;
- approve one exact version;
- edit it and prove the old approval no longer applies; and
- show that no path published automatically.

Ask four questions after the demo:

1. What does the model decide?
2. What does the surrounding software guarantee?
3. What survives a process restart?
4. What is the agent never authorized to do?

If the learner can answer those clearly, they understand the system rather than merely operating it.
