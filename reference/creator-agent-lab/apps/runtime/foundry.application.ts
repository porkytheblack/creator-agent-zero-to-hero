import { MemoryFoundryDataAdapter, defineApplication } from "glove-foundry";

export const data = new MemoryFoundryDataAdapter();

export default defineApplication({
  name: "Creator Agent Lab",
  data,
  accounts: [],
  routes: [],
  bindings: []
});
