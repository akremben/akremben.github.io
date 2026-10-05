import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

/**
 * Fills the __SITE_URL__ placeholders in index.html (canonical URL, social image, structured data).
 * - Build with APP_URL set (e.g. static hosting): the real address is written into the HTML.
 * - Dev server: replaced with relative URLs.
 */
function siteUrl(command: 'build' | 'serve'): Plugin {
  const url = (process.env.APP_URL || '').replace(/\/$/, '');
  const valid = url && !url.startsWith('MY_');
  const gsc = process.env.GOOGLE_SITE_VERIFICATION || '';
  return {
    name: 'site-url',
    transformIndexHtml(html) {
      // Optional Google Search Console verification tag (free)
      if (gsc) html = html.replace('</head>', `    <meta name="google-site-verification" content="${gsc}" />\n  </head>`);
      if (valid) return html.split('__SITE_URL__').join(url);
      return html.split('__SITE_URL__').join('');
    },
    // Static hosting (GitHub Pages): write robots.txt and sitemap.xml at build time
    generateBundle() {
      if (command !== 'build' || !valid) return;
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n` });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url><loc>${url}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>\n` +
          `</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ command }) => {
  return {
    plugins: [react(), tailwindcss(), siteUrl(command)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
