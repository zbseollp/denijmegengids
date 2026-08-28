import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://denijmegengids.nl",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [
    sitemap({ filter: (p) => !p.includes("/404") }),
  ],
});
