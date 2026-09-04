import { defineConfig } from "astro/config";
import rehypeRepairMediaUrls from './src/lib/rehype-repair-media-urls.mjs';

export default defineConfig({
  vite: { envPrefix: ['PUBLIC_', 'R2_', 'TENANT', 'PAYLOAD_'] },
  // Rewrites /media/... and bare-R2 <img> sources in post bodies.
  markdown: { rehypePlugins: [rehypeRepairMediaUrls] },
  site: "https://denijmegengids.nl",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
});
