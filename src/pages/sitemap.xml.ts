import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

const SITE = 'https://denijmegengids.nl';

// Alle statisch gegenereerde bedrijfs- en categoriepagina's (src/pages/<slug>/index.astro)
const pageFiles = import.meta.glob('./**/index.astro');

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async () => {
  const urls = new Map<string, string | undefined>();

  for (const file of Object.keys(pageFiles)) {
    const slug = file.replace(/^\.\//, '').replace(/index\.astro$/, '');
    urls.set(`${SITE}/${slug}`, undefined);
  }

  for (const post of await getCollection('blog')) {
    const lastmod = post.data.updatedDate ?? post.data.pubDate;
    urls.set(`${SITE}/${post.id}/`, lastmod.toISOString().slice(0, 10));
  }

  const entries = [...urls.entries()].sort(([a], [b]) =>
    a === `${SITE}/` ? -1 : b === `${SITE}/` ? 1 : a.localeCompare(b, 'nl'),
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${SITE}/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(([loc, lastmod]) =>
    `  <url>\n    <loc>${escape(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
