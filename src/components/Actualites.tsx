import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowUpRight, FlaskConical, GraduationCap, Landmark, Languages, LayoutGrid, Map as MapIcon,
  MessageSquareQuote, Satellite, Search, Share2, X,
} from 'lucide-react';
import type { Language } from '../data/cvData';
import { NEWS_COMMENTS } from '../data/newsComments';
import { NewsMap } from './NewsMap';

type Category = 'all' | 'agences' | 'canada' | 'universites' | 'recherche';
type Cat = Exclude<Category, 'all'>;

interface NewsItem {
  title: string;
  link: string;
  date: string | null;
  summary: string;
  source: string;
  sourceId: string;
  org: string;
  category: Cat;
  type?: 'gov' | 'peer' | 'univ';
  lang?: 'fr' | 'en';
  image?: string | null;
  translated?: { lang: 'fr' | 'en'; title: string; summary: string };
}

interface NewsFile {
  updatedAt: string;
  items: NewsItem[];
}

const T = {
  fr: {
    back: 'Retour au portfolio',
    kicker: 'Ma veille · Mise à jour chaque matin',
    titleMain: 'Actualités en géomatique',
    titleSerif: 'et télédétection.',
    subtitle: 'Les nouvelles que je suis au quotidien, issues uniquement de sources reconnues : agences spatiales, gouvernements, universités et revues scientifiques.',
    sharePage: 'Partager ma veille',
    iotd: 'Image satellite du jour',
    filters: { all: 'Tout', agences: 'Agences spatiales', canada: 'Canada', universites: 'Universités', recherche: 'Revues scientifiques' },
    searchPh: 'Rechercher…',
    periods: { all: 'Toutes les dates', '7': '7 jours', '30': '30 jours', '90': '3 mois' },
    list: 'Liste',
    map: 'Carte',
    results: (n: number) => `${n} article${n > 1 ? 's' : ''}`,
    clear: 'Effacer',
    more: 'Voir plus',
    read: 'Lire',
    share: 'Partager sur LinkedIn',
    analysesTitle: 'Mon analyse',
    commented: 'Commenté',
    translatedFrom: { en: 'Traduit de l’anglais', fr: 'Traduit du français' },
    original: 'Titre original',
    types: { gov: 'Source gouvernementale', peer: 'Revue évaluée par les pairs', univ: 'Communiqué universitaire' },
    loading: 'Chargement…',
    error: 'Les actualités ne sont pas disponibles pour le moment.',
    empty: 'Aucun article ne correspond à ta recherche.',
    whyTitle: 'Pourquoi cette veille',
    whyText: 'Les missions satellitaires et les méthodes d’analyse évoluent vite. Cette veille nourrit directement mes projets :',
    links: [
      { label: 'IA et données environnementales — stage Mitacs', href: '#projects' },
      { label: 'Cartographie des risques naturels — BILC', href: '#experience' },
      { label: 'Maîtrise en télédétection — UdeS', href: '#education' },
    ],
    openTitle: 'Données ouvertes que j’utilise',
    note: 'Titres traduits automatiquement · chaque lien mène à l’article original, propriété de son éditeur.',
  },
  en: {
    back: 'Back to portfolio',
    kicker: 'My watch · Updated every morning',
    titleMain: 'Geomatics and',
    titleSerif: 'remote sensing news.',
    subtitle: 'The news I follow every day, only from recognized sources: space agencies, governments, universities and scientific journals.',
    sharePage: 'Share my watch',
    iotd: 'Satellite image of the day',
    filters: { all: 'All', agences: 'Space agencies', canada: 'Canada', universites: 'Universities', recherche: 'Journals' },
    searchPh: 'Search…',
    periods: { all: 'All dates', '7': '7 days', '30': '30 days', '90': '3 months' },
    list: 'List',
    map: 'Map',
    results: (n: number) => `${n} article${n > 1 ? 's' : ''}`,
    clear: 'Clear',
    more: 'Show more',
    read: 'Read',
    share: 'Share on LinkedIn',
    analysesTitle: 'My analysis',
    commented: 'Commented',
    translatedFrom: { en: 'Translated from English', fr: 'Translated from French' },
    original: 'Original title',
    types: { gov: 'Government source', peer: 'Peer-reviewed journal', univ: 'University news release' },
    loading: 'Loading…',
    error: 'News is not available at the moment.',
    empty: 'No article matches your search.',
    whyTitle: 'Why I keep this watch',
    whyText: 'Satellite missions and analysis methods evolve fast. This watch feeds directly into my projects:',
    links: [
      { label: 'AI and environmental data — Mitacs internship', href: '#projects' },
      { label: 'Natural-hazard mapping — BILC', href: '#experience' },
      { label: 'Master’s in remote sensing — UdeS', href: '#education' },
    ],
    openTitle: 'Open data I use',
    note: 'Titles machine-translated · every link leads to the original article, owned by its publisher.',
  },
};

const CAT: Record<Cat, { dot: string; badge: string }> = {
  agences: { dot: 'bg-[#2563EB]', badge: 'bg-blue-50 text-blue-800 border-blue-200' },
  canada: { dot: 'bg-red-600', badge: 'bg-red-50 text-red-800 border-red-200' },
  universites: { dot: 'bg-violet-600', badge: 'bg-violet-50 text-violet-800 border-violet-200' },
  recherche: { dot: 'bg-emerald-600', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
};

const OPEN_DATA = [
  { name: 'USGS EarthExplorer', url: 'https://earthexplorer.usgs.gov/' },
  { name: 'Copernicus Browser', url: 'https://browser.dataspace.copernicus.eu/' },
  { name: 'NASA Earthdata', url: 'https://search.earthdata.nasa.gov/' },
  { name: 'EODMS (RADARSAT)', url: 'https://eodms-sgdot.nrcan-rncan.gc.ca/' },
  { name: 'GéoGratis', url: 'https://geogratis.gc.ca/' },
  { name: 'Données Québec', url: 'https://www.donneesquebec.ca/' },
  { name: 'Gouvernement ouvert', url: 'https://ouvert.canada.ca/' },
  { name: 'Earth Engine Catalog', url: 'https://developers.google.com/earth-engine/datasets' },
];

const PAGE_URL = 'https://akremben.github.io/#/actualites';
const linkedIn = (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
const COMMENTED = new Set(NEWS_COMMENTS.map((c) => c.link));
const DAY = 86400000;
const PAGE = 6;

export function Actualites({ lang }: { lang: Language }) {
  const t = T[lang];
  const [data, setData] = useState<NewsFile | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState<'all' | '7' | '30' | '90'>('all');
  const [mode, setMode] = useState<'list' | 'map'>('list');
  const [shown, setShown] = useState(PAGE);
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${import.meta.env.BASE_URL}news.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: NewsFile) => setData(d))
      .catch(() => setFailed(true));
  }, []);
  useEffect(() => setShown(PAGE), [filter, query, period]);

  const fmt = useMemo(
    () => new Intl.DateTimeFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', { day: 'numeric', month: 'short', year: 'numeric' }),
    [lang],
  );

  const view = (i: NewsItem) => {
    const tr = i.lang && i.lang !== lang && i.translated?.lang === lang ? i.translated : null;
    return { title: tr?.title || i.title, summary: tr?.summary || i.summary, translated: !!tr };
  };

  const norm = (x: string) => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const q = norm(query.trim());
  const items = (data?.items ?? []).filter((i) => {
    if (filter !== 'all' && i.category !== filter) return false;
    if (period !== 'all' && (!i.date || Date.now() - new Date(i.date).getTime() > Number(period) * DAY)) return false;
    if (!q) return true;
    const hay = norm([i.title, i.summary, i.source, i.translated?.title, i.translated?.summary].filter(Boolean).join(' '));
    return q.split(/\s+/).every((w) => hay.includes(w));
  });
  const searching = q !== '' || period !== 'all';
  const iotd = (data?.items ?? []).find((i) => i.sourceId === 'nasa-eo' && i.image && !broken[i.link]);
  const comment = [...NEWS_COMMENTS].sort((a, b) => b.date.localeCompare(a.date))[0]; // analyse la plus récente

  return (
    <main className="flex-1 no-print">
      {/* En-tête : titre + image satellite du jour */}
      <section className="max-w-[1280px] mx-auto px-6 pt-8 pb-8 md:pt-12">
        <a href="#top" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </a>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-mono-tabular">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" aria-hidden="true" />
              {t.kicker}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight text-slate-900 leading-[1.04]">
              {t.titleMain}{' '}
              <span className="font-serif-editorial italic font-normal text-[#2563EB] text-[1.08em]">{t.titleSerif}</span>
            </h1>
            <p className="text-base sm:text-[17px] text-slate-700 leading-[1.65] max-w-[60ch]">{t.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <a href={linkedIn(PAGE_URL)} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2.5 text-sm font-medium text-white bg-[#0A66C2] rounded-lg hover:bg-[#004182] transition-colors inline-flex items-center gap-2">
                <Share2 className="w-4 h-4" /> {t.sharePage}
              </a>
            </div>
          </div>

          {iotd && (
            <a href={iotd.link} target="_blank" rel="noopener noreferrer"
              className="lg:col-span-5 group relative block rounded-2xl overflow-hidden bg-slate-950 text-white">
              <img src={iotd.image!} alt={view(iotd).title} onError={() => setBroken((b) => ({ ...b, [iotd.link]: true }))}
                className="w-full h-[260px] sm:h-[300px] object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-slate-950/75">
                <div className="text-[11px] text-blue-300 font-mono-tabular inline-flex items-center gap-1.5">
                  <Satellite className="w-3.5 h-3.5" /> {t.iotd}{iotd.date && ` · ${fmt.format(new Date(iotd.date))}`}
                </div>
                <div className="mt-1 text-lg font-semibold leading-snug inline-flex gap-1">
                  {view(iotd).title} <ArrowUpRight className="w-4 h-4 shrink-0 mt-1" />
                </div>
                <div className="text-[11px] text-slate-400">NASA Earth Observatory</div>
              </div>
            </a>
          )}
        </div>
      </section>

      {/* Mon analyse (personnalité) */}
      {comment && (
        <section className="max-w-[1280px] mx-auto px-6 pb-10">
          <article className="bg-white border border-slate-900/10 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row gap-6">
            <div className="flex md:flex-col items-center md:items-start gap-3 md:w-44 shrink-0">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif-editorial italic text-2xl select-none">A</div>
              <div className="text-xs">
                <div className="font-semibold text-slate-900">{t.analysesTitle}</div>
                <div className="text-slate-500 font-mono-tabular">{fmt.format(new Date(comment.date + 'T12:00:00'))}</div>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="text-xs text-slate-500 font-mono-tabular">{comment.source}</div>
              <h2 className="text-xl font-semibold text-slate-900">{comment.title[lang]}</h2>
              <p className="font-serif-editorial italic text-[19px] leading-relaxed text-slate-800 border-l-2 border-[#2563EB] pl-5">
                « {comment.comment[lang]} »
              </p>
              <div className="flex items-center gap-4 pt-1 text-sm">
                <a href={comment.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-[#2563EB] hover:underline underline-offset-4">
                  {t.read} <ArrowUpRight className="w-4 h-4" />
                </a>
                <a href={linkedIn(comment.link)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-slate-500 hover:text-[#0A66C2]">
                  <Share2 className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Actualités : barre d'outils + liste ou carte */}
      <section className="max-w-[1280px] mx-auto px-6 pb-14 space-y-5">
        <div className="flex flex-wrap items-center gap-2" role="tablist">
          {(Object.keys(t.filters) as Category[]).map((key) => (
            <button key={key} type="button" role="tab" aria-selected={filter === key} onClick={() => setFilter(key)}
              className={`px-3.5 py-2 text-sm rounded-lg border transition-colors cursor-pointer inline-flex items-center gap-2 ${
                filter === key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white/60 text-slate-700 border-slate-300 hover:bg-white'
              }`}>
              {key !== 'all' && <span className={`w-1.5 h-1.5 rounded-full ${CAT[key].dot}`} aria-hidden="true" />}
              {t.filters[key]}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <label className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPh} aria-label={t.searchPh}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15" />
          </label>
          <select value={period} onChange={(e) => setPeriod(e.target.value as typeof period)} aria-label="Période"
            className="px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB] cursor-pointer">
            {(Object.keys(t.periods) as (keyof typeof t.periods)[]).map((k) => <option key={k} value={k}>{t.periods[k]}</option>)}
          </select>
          <div className="inline-flex p-1 bg-white border border-slate-300 rounded-lg">
            {(['list', 'map'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m}
                className={`px-3 py-1.5 text-sm rounded-md inline-flex items-center gap-1.5 cursor-pointer ${mode === m ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                {m === 'list' ? <LayoutGrid className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />} {m === 'list' ? t.list : t.map}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="font-mono-tabular">{t.results(items.length)}</span>
          {searching && (
            <button type="button" onClick={() => { setQuery(''); setPeriod('all'); }} className="inline-flex items-center gap-1 text-[#2563EB] hover:underline cursor-pointer">
              <X className="w-3.5 h-3.5" /> {t.clear}
            </button>
          )}
        </div>

        {!data && !failed && <p className="text-sm text-slate-500">{t.loading}</p>}
        {failed && <p className="text-sm text-slate-500">{t.error}</p>}
        {data && items.length === 0 && <p className="text-sm text-slate-500">{t.empty}</p>}

        {mode === 'map' && items.length > 0 && (
          <NewsMap
            lang={lang}
            items={items.map((i) => ({
              title: view(i).title,
              text: [i.title, i.summary, i.translated?.title, i.translated?.summary].filter(Boolean).join(' '),
              link: i.link,
              source: i.source,
            }))}
          />
        )}

        {mode === 'list' && items.length > 0 && (
          <>
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.slice(0, shown).map((item) => {
                const v = view(item);
                return (
                  <li key={item.link} className="bg-white border border-slate-900/10 rounded-2xl p-5 flex flex-col gap-3 hover:border-[#2563EB]/40 transition">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                      <span className={`px-2.5 py-1 rounded-md border font-medium ${CAT[item.category].badge}`}>{item.source}</span>
                      {item.date && <time dateTime={item.date} className="text-slate-500 font-mono-tabular">{fmt.format(new Date(item.date))}</time>}
                      {COMMENTED.has(item.link) && (
                        <span className="inline-flex items-center gap-1 text-[#2563EB] font-medium"><MessageSquareQuote className="w-3.5 h-3.5" /> {t.commented}</span>
                      )}
                    </div>
                    <h3 className="text-[17px] font-semibold text-slate-900 leading-snug">{v.title}</h3>
                    {v.summary && <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{v.summary}</p>}
                    <div className="mt-auto pt-3 flex items-center justify-between gap-3 border-t border-slate-900/5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500"
                        title={v.translated ? `${t.original} : ${item.title}` : undefined}>
                        {v.translated ? <Languages className="w-3.5 h-3.5" /> : item.type === 'peer' ? <FlaskConical className="w-3.5 h-3.5" /> : item.type === 'univ' ? <GraduationCap className="w-3.5 h-3.5" /> : <Landmark className="w-3.5 h-3.5" />}
                        {v.translated && item.lang ? t.translatedFrom[item.lang] : item.type ? t.types[item.type] : ''}
                      </span>
                      <span className="flex items-center gap-3">
                        <a href={linkedIn(item.link)} target="_blank" rel="noopener noreferrer" aria-label={t.share} title={t.share}
                          className="text-slate-400 hover:text-[#0A66C2]"><Share2 className="w-4 h-4" /></a>
                        <a href={item.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline underline-offset-4">
                          {t.read} <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            {shown < items.length && (
              <div className="text-center">
                <button type="button" onClick={() => setShown((n) => n + PAGE)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-900 border border-slate-900/20 rounded-lg hover:bg-white transition-colors cursor-pointer">
                  {t.more} ({items.length - shown})
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Démarche + données ouvertes, en un seul bloc */}
      <section className="border-t border-slate-900/10 bg-[#EAEAE4]/60">
        <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">{t.whyTitle}</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{t.whyText}</p>
            <ul className="space-y-1.5">
              {t.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-flex items-center gap-1.5 text-sm text-[#2563EB] hover:underline underline-offset-4">
                    <ArrowUpRight className="w-3.5 h-3.5" /> {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">{t.openTitle}</h2>
            <div className="flex flex-wrap gap-2">
              {OPEN_DATA.map((d) => (
                <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm px-3 py-1.5 rounded-lg bg-white border border-slate-900/10 text-slate-800 hover:border-[#2563EB]/40 hover:text-[#2563EB] transition">
                  {d.name}
                </a>
              ))}
            </div>
            <p className="text-xs text-slate-500 pt-2">{t.note}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
