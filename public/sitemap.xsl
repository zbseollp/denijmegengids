<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="nl">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>XML sitemap | De Nijmegen Gids</title>
        <style>
          :root { --brand:#215562; --brand-600:#256877; --brand-50:#eef7f8; --ink:#1c2426; --muted:#5b6b6f; --border:#e3e8e9; }
          * { box-sizing:border-box; }
          body { margin:0; background:#f7f9f9; color:var(--ink); font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; font-size:15px; line-height:1.5; }
          header { background:var(--brand); color:#fff; padding:1.75rem 1.25rem; }
          .wrap { margin:0 auto; max-width:1000px; }
          header h1 { font-size:1.4rem; margin:0 0 .35rem; }
          header p { color:#aed9de; margin:0; font-size:.9rem; }
          main { padding:1.5rem 1.25rem 3rem; }
          .count { color:var(--muted); font-size:.875rem; margin:0 0 1rem; }
          .count strong { color:var(--ink); }
          table { background:#fff; border:1px solid var(--border); border-collapse:collapse; border-radius:8px; overflow:hidden; width:100%; }
          th { background:var(--brand-50); color:var(--brand); font-size:.75rem; letter-spacing:.08em; padding:.7rem 1rem; text-align:left; text-transform:uppercase; }
          td { border-top:1px solid var(--border); padding:.6rem 1rem; vertical-align:top; }
          td.nr { color:var(--muted); font-variant-numeric:tabular-nums; width:3.5rem; }
          td.date { color:var(--muted); font-size:.85rem; white-space:nowrap; width:7rem; }
          a { color:var(--brand-600); text-decoration:none; word-break:break-all; }
          a:hover { text-decoration:underline; }
          tr:hover td { background:#fafcfc; }
        </style>
      </head>
      <body>
        <header>
          <div class="wrap">
            <h1>XML sitemap</h1>
            <p>Deze pagina is bedoeld voor zoekmachines. Bekijk <a href="/" style="color:#fff">denijmegengids.nl</a> voor de site zelf.</p>
          </div>
        </header>
        <main class="wrap">
          <xsl:apply-templates select="s:sitemapindex"/>
          <xsl:apply-templates select="s:urlset"/>
        </main>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="s:sitemapindex">
    <p class="count">Deze index bevat <strong><xsl:value-of select="count(s:sitemap)"/></strong> sitemap(s).</p>
    <table>
      <tr><th>#</th><th>Sitemap</th></tr>
      <xsl:for-each select="s:sitemap">
        <tr>
          <td class="nr"><xsl:value-of select="position()"/></td>
          <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>

  <xsl:template match="s:urlset">
    <p class="count">Deze sitemap bevat <strong><xsl:value-of select="count(s:url)"/></strong> URL's.</p>
    <table>
      <tr><th>#</th><th>URL</th><th>Laatst gewijzigd</th></tr>
      <xsl:for-each select="s:url">
        <tr>
          <td class="nr"><xsl:value-of select="position()"/></td>
          <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
          <td class="date"><xsl:value-of select="s:lastmod"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>
</xsl:stylesheet>
