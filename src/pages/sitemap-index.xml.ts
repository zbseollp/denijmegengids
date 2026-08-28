import type { APIRoute } from 'astro';

export const prerender = true;

// Index die naar de enige sitemap wijst; blijft bestaan voor eerder ingediende URL's.
export const GET: APIRoute = async () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="https://denijmegengids.nl/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://denijmegengids.nl/sitemap.xml</loc>
  </sitemap>
</sitemapindex>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
