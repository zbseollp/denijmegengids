import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://denijmegengids.nl",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
});
