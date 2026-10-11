// Récupère les actualités géomatique / télédétection depuis des sources officielles
// et écrit public/news.json. Exécuté par GitHub Actions (quotidien + à chaque déploiement).
// Aucune dépendance : Node 22 (fetch natif). Si une source échoue, elle est ignorée
// et les anciennes nouvelles de cette source sont conservées.
import { readFile, writeFile } from 'node:fs/promises';

const OUT = new URL('../public/news.json', import.meta.url);

// Mots-clés pour filtrer les flux généralistes (ASC, RNCan)
const GEO_KEYWORDS = [
  'satellite', 'radarsat', 'observation de la terre', 'earth observation', 'télédétection',
  'remote sensing', 'imagerie', 'imagery', 'cartograph', 'géospatial', 'geospatial',
  'géomatique', 'geomatics', 'lidar', 'radar à synthèse', 'synthetic aperture', 'gnss', 'wildfire', 'feux de forêt', 'inondation',
  'flood', 'climat', 'climate', 'glaces', 'sea ice', 'pergélisol', 'permafrost', 'landsat', 'sentinel',
];

const SOURCES = [
  {
    id: 'nasa-eo',
    name: 'NASA Earth Observatory',
    org: 'NASA',
    category: 'agences',
    type: 'gov', lang: 'en',
    home: 'https://science.nasa.gov/earth/earth-observatory/',
    feed: 'https://science.nasa.gov/feed/?science_org=19791%2C22453',
    filter: false,
  },
  {
    id: 'esa-eo',
    name: 'ESA — Observing the Earth',
    org: 'Agence spatiale européenne',
    category: 'agences',
    type: 'gov', lang: 'en',
    home: 'https://www.esa.int/Applications/Observing_the_Earth',
    feed: 'https://www.esa.int/rssfeed/Our_Activities/Observing_the_Earth',
    filter: false,
  },
  {
    id: 'asc',
    name: 'Agence spatiale canadienne',
    org: 'ASC / CSA',
    category: 'canada',
    type: 'gov', lang: 'fr',
    home: 'https://www.asc-csa.gc.ca/fra/',
    feed: 'https://api.io.canada.ca/io-server/gc/news/fr/v2?dept=canadianspaceagency&sort=publishedDate&orderBy=desc&pick=40&format=atom',
    filter: true,
  },
  {
    id: 'rncan',
    name: 'Ressources naturelles Canada',
    org: 'RNCan',
    category: 'canada',
    type: 'gov', lang: 'fr',
    home: 'https://ressources-naturelles.canada.ca/',
    feed: 'https://api.io.canada.ca/io-server/gc/news/fr/v2?dept=naturalresourcescanada&sort=publishedDate&orderBy=desc&pick=60&format=atom',
    filter: true,
  },
  {
    id: 'copernicus',
    name: 'Copernicus Data Space Ecosystem',
    org: 'Commission européenne / ESA',
    category: 'agences',
    type: 'gov', lang: 'en',
    home: 'https://dataspace.copernicus.eu/news',
    feed: 'https://dataspace.copernicus.eu/rss.xml',
    filter: false,
  },
  {
    id: 'usgs-landsat',
    name: 'USGS — Landsat Missions',
    org: 'U.S. Geological Survey',
    category: 'agences',
    type: 'gov', lang: 'en',
    home: 'https://www.usgs.gov/landsat-missions/news',
    feed: 'https://www.usgs.gov/science-support/41903/news/feed',
    filter: false,
  },
  {
    id: 'univ-qc',
    name: 'Universités canadiennes',
    org: 'Sherbrooke, Laval, UQAM, INRS, McGill, Montréal',
    category: 'universites',
    type: 'univ', lang: 'fr',
    home: 'https://www.usherbrooke.ca/cartel/',
    // Communiqués des universités uniquement (recherche limitée à leurs domaines officiels)
    feed:
      'https://news.google.com/rss/search?q=' +
      encodeURIComponent(
        '(télédétection OR géomatique OR "imagerie satellitaire" OR "observation de la Terre" OR "remote sensing") ' +
          '(site:usherbrooke.ca OR site:ulaval.ca OR site:uqam.ca OR site:inrs.ca OR site:mcgill.ca OR site:umontreal.ca) when:120d',
      ) +
      '&hl=fr-CA&gl=CA&ceid=CA:fr',
    filter: false,
    googleNews: true,
  },
  {
    id: 'univ-intl',
    name: 'Universités internationales',
    org: 'Communiqués de recherche universitaires (.edu)',
    category: 'universites',
    type: 'univ', lang: 'en',
    home: 'https://www.eurekalert.org/',
    feed:
      'https://news.google.com/rss/search?q=' +
      encodeURIComponent('("remote sensing" OR "satellite imagery" OR geospatial OR "Earth observation") site:edu when:30d') +
      '&hl=en-US&gl=US&ceid=US:en',
    filter: false,
    googleNews: true,
  },
  {
    id: 'mdpi-rs',
    name: 'Remote Sensing (revue scientifique, MDPI)',
    org: 'Publications évaluées par les pairs',
    category: 'recherche',
    type: 'peer', lang: 'en',
    home: 'https://www.mdpi.com/journal/remotesensing',
    feed: 'https://www.mdpi.com/rss/journal/remotesensing',
    filter: false,
  },
];

const MAX_PER_SOURCE = 6;

const decode = (s = '') =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? m[1] : '';
};

const shorten = (text, max = 220) => {
  // retire la mention WordPress « The post … appeared first on … »
  const t = text.replace(/The post .* appeared first on .*$/i, '').trim();
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, '') + '…' : t;
};

function parseFeed(xml) {
  const items = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const b of blocks) {
    const title = decode(tag(b, 'title'));
    let link = decode(tag(b, 'link'));
    if (!link) {
      const m = b.match(/<link[^>]*href="([^"]+)"/i);
      link = m ? m[1] : '';
    }
    const date = decode(tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated') || tag(b, 'dc:date'));
    const summary = shorten(decode(tag(b, 'description') || tag(b, 'summary')));
    // Image : media:content / enclosure / première <img> de l'article
    const img =
      (b.match(/<media:(?:content|thumbnail)[^>]*url="([^"]+)"/i) ||
        b.match(/<enclosure[^>]*url="([^"]+\.(?:jpe?g|png|webp)[^"]*)"/i) ||
        b.match(/<img[^>]*src="(https:[^"]+\.(?:jpe?g|png|webp))/i) ||
        [])[1] || null;
    const image = img ? img.replace(/&amp;/g, '&').split('?')[0] + (img.includes('assets.science.nasa.gov') ? '?w=900' : '') : null;
    if (title && /^https?:\/\//.test(link)) items.push({ title, link, date, summary, image });
  }
  return items;
}

async function fetchSource(src) {
  const res = await fetch(src.feed, {
    headers: { 'User-Agent': 'akremben.github.io news bot (+https://akremben.github.io/)' },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let items = parseFeed(await res.text());
  if (src.filter) {
    items = items.filter((it) => {
      const hay = `${it.title} ${it.summary}`.toLowerCase();
      // mots entiers (évite « sar » dans « anniversaire », « ice » dans « service »)
      return GEO_KEYWORDS.some((k) => new RegExp(`(^|[^a-zà-ÿ])${k}`, 'i').test(hay));
    });
  }
  return items.slice(0, MAX_PER_SOURCE).map((it) => {
    const d = new Date(it.date);
    let source = src.name;
    if (src.googleNews) {
      const m = it.title.match(/^(.*)\s+-\s+([^-]+)$/);
      if (m) {
        it.title = m[1].trim();
        source = m[2].trim();
      }
      it.summary = ''; // le résumé Google News ne fait que répéter le titre
    }
    return {
      ...it,
      date: isNaN(d) ? null : d.toISOString(),
      source,
      sourceId: src.id,
      org: src.org,
      category: src.category,
      type: src.type,
      lang: src.lang,
    };
  });
}

let previous = { items: [] };
try {
  previous = JSON.parse(await readFile(OUT, 'utf8'));
} catch {}

const all = [];
const status = [];
for (const src of SOURCES) {
  try {
    const items = await fetchSource(src);
    all.push(...items);
    status.push({ id: src.id, ok: true, count: items.length });
    console.log(`✓ ${src.name}: ${items.length}`);
  } catch (err) {
    const kept = (previous.items || []).filter((i) => i.sourceId === src.id);
    all.push(...kept);
    status.push({ id: src.id, ok: false, count: kept.length });
    console.warn(`✗ ${src.name}: ${err.message} (conservé : ${kept.length})`);
  }
}

// Traduction EN↔FR avec mise en cache : seuls les nouveaux articles sont traduits.
const TR_EMAIL = process.env.MYMEMORY_EMAIL || 'akrem.benchiha@usherbrooke.ca'; // quota gratuit : 50 000 caractères/jour
const MAX_TRANSLATIONS = 60;
const cache = new Map((previous.items || []).filter((i) => i.translated).map((i) => [i.link, i.translated]));
let translations = 0;

async function translate(text, from, to) {
  if (!text) return '';
  const url =
    'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text.slice(0, 480)) +
    `&langpair=${from}|${to}&de=${encodeURIComponent(TR_EMAIL)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  const json = await res.json();
  if (json.responseStatus !== 200 && json.responseStatus !== '200') throw new Error(json.responseDetails || 'traduction refusée');
  return decode(json.responseData.translatedText);
}

for (const item of all) {
  if (!item.lang) continue;
  if (cache.has(item.link)) {
    item.translated = cache.get(item.link);
    continue;
  }
  if (translations >= MAX_TRANSLATIONS) continue;
  const to = item.lang === 'en' ? 'fr' : 'en';
  try {
    item.translated = {
      lang: to,
      title: await translate(item.title, item.lang, to),
      summary: await translate(item.summary, item.lang, to),
    };
    translations++;
  } catch (err) {
    console.warn(`Traduction impossible (${item.title.slice(0, 40)}…) : ${err.message}`);
    break; // quota atteint : on réessaiera au prochain passage
  }
}
console.log(`↻ ${translations} nouvelles traductions`);

const seen = new Set();
const items = all
  .filter((i) => (seen.has(i.link) ? false : seen.add(i.link)))
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

await writeFile(
  OUT,
  JSON.stringify(
    {
      updatedAt: new Date().toISOString(),
      sources: SOURCES.map(({ feed, filter, ...s }) => s),
      status,
      items,
    },
    null,
    2,
  ),
);
console.log(`→ ${items.length} actualités écrites dans public/news.json`);

// ── Flux RSS public de ma veille : https://akremben.github.io/veille.xml ──
const SITE = 'https://akremben.github.io';
const esc = (x = '') => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let comments = [];
try {
  comments = JSON.parse(await readFile(new URL('../src/data/newsComments.json', import.meta.url), 'utf8')).commentaires || [];
} catch {}
const rssItems = [
  ...comments.map((c) => ({
    title: `Analyse — ${c.title.fr}`,
    link: c.link,
    date: new Date(c.date + 'T12:00:00Z'),
    desc: `${c.comment.fr} (Source : ${c.source})`,
    cat: 'Mes analyses',
    guid: c.link + '#analyse-akrem',
  })),
  ...items.slice(0, 40).map((i) => {
    const fr = i.lang === 'en' && i.translated?.lang === 'fr' ? i.translated : null;
    return {
      title: fr?.title || i.title,
      link: i.link,
      date: i.date ? new Date(i.date) : new Date(),
      desc: `${fr?.summary || i.summary || ''} (Source : ${i.source})`.trim(),
      cat: i.source,
    };
  }),
];
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Veille géomatique et télédétection — Akrem Benchiha</title>
  <link>${SITE}/#/actualites</link>
  <atom:link href="${SITE}/veille.xml" rel="self" type="application/rss+xml" />
  <description>Actualités en géomatique, télédétection et observation de la Terre, sélectionnées et commentées par Akrem Benchiha.</description>
  <language>fr-CA</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems
  .map(
    (r) => `  <item>
    <title>${esc(r.title)}</title>
    <link>${esc(r.link)}</link>
    <guid isPermaLink="${r.guid ? 'false' : 'true'}">${esc(r.guid || r.link)}</guid>
    <pubDate>${r.date.toUTCString()}</pubDate>
    <category>${esc(r.cat)}</category>
    <description>${esc(r.desc)}</description>
  </item>`,
  )
  .join('\n')}
</channel>
</rss>
`;
await writeFile(new URL('../public/veille.xml', import.meta.url), rss);
console.log(`→ flux RSS public/veille.xml (${rssItems.length} entrées)`);
