import React, { useMemo, useState } from 'react';
import { geoNaturalEarth1, geoPath, geoCentroid, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import world from 'world-atlas/countries-110m.json';
import { ArrowUpRight, X } from 'lucide-react';
import type { Language } from '../data/cvData';

export interface MapItem {
  title: string; // titre affiché (traduit si besoin)
  text: string; // texte original + traduction, utilisé pour détecter le lieu
  link: string;
  source: string;
}

const COUNTRIES = feature(world as any, (world as any).objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;
const BY_NAME = new Map(COUNTRIES.features.map((f) => [f.properties.name, f]));
const GRATICULE = geoGraticule10();

// Noms français, pays courants et régions (États, provinces) → nom du pays dans l'atlas
const ALIASES: Record<string, string> = {
  'united states': 'United States of America', 'u.s.': 'United States of America', usa: 'United States of America',
  'états-unis': 'United States of America', americain: 'United States of America', américain: 'United States of America',
  texas: 'United States of America', california: 'United States of America', californie: 'United States of America',
  alaska: 'United States of America', florida: 'United States of America', floride: 'United States of America',
  colorado: 'United States of America', hawaii: 'United States of America', arizona: 'United States of America',
  louisiana: 'United States of America', louisiane: 'United States of America', nebraska: 'United States of America',
  québec: 'Canada', quebec: 'Canada', ontario: 'Canada', 'british columbia': 'Canada', 'colombie-britannique': 'Canada',
  alberta: 'Canada', manitoba: 'Canada', saskatchewan: 'Canada', nunavut: 'Canada', yukon: 'Canada',
  'nouvelle-écosse': 'Canada', 'nova scotia': 'Canada', 'nouveau-brunswick': 'Canada', 'new brunswick': 'Canada',
  canadien: 'Canada', canadienne: 'Canada', canadian: 'Canada', sherbrooke: 'Canada', montréal: 'Canada', montreal: 'Canada',
  thaïlande: 'Thailand', bangkok: 'Thailand', népal: 'Nepal', inde: 'India', chine: 'China', japon: 'Japan',
  brésil: 'Brazil', amazon: 'Brazil', amazonie: 'Brazil', mexique: 'Mexico', argentine: 'Argentina', chili: 'Chile',
  pérou: 'Peru', colombie: 'Colombia', espagne: 'Spain', allemagne: 'Germany', italie: 'Italy', grèce: 'Greece',
  'royaume-uni': 'United Kingdom', 'united kingdom': 'United Kingdom', britain: 'United Kingdom', irlande: 'Ireland',
  norvège: 'Norway', suède: 'Sweden', islande: 'Iceland', groenland: 'Greenland', russie: 'Russia', turquie: 'Turkey',
  algérie: 'Algeria', maroc: 'Morocco', tunisie: 'Tunisia', libye: 'Libya', égypte: 'Egypt', éthiopie: 'Ethiopia',
  'afrique du sud': 'South Africa', nigéria: 'Nigeria', kenya: 'Kenya', soudan: 'Sudan', tchad: 'Chad',
  'arabie saoudite': 'Saudi Arabia', irak: 'Iraq', iran: 'Iran', pakistan: 'Pakistan', bangladesh: 'Bangladesh',
  indonésie: 'Indonesia', philippines: 'Philippines', vietnam: 'Vietnam', australie: 'Australia',
  'nouvelle-zélande': 'New Zealand', 'new zealand': 'New Zealand', antarctique: 'Antarctica', antarctic: 'Antarctica',
  sahara: 'Algeria', himalaya: 'Nepal', gandak: 'Nepal',
};

// Mots-clés : nom anglais de chaque pays de l'atlas + alias
const KEYWORDS: [RegExp, string][] = [
  ...COUNTRIES.features
    .map((f) => f.properties.name)
    .filter((n) => n.length > 3 && n !== 'Georgia' && n !== 'Jordan')
    .map((n) => [n.toLowerCase(), n] as [string, string]),
  ...Object.entries(ALIASES),
].map(([k, v]) => [new RegExp(`(^|[^a-zà-ÿ])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-zà-ÿ]|$)`, 'i'), v]);

export function locate(text: string): string[] {
  const found = new Set<string>();
  for (const [re, country] of KEYWORDS) if (BY_NAME.has(country) && re.test(text)) found.add(country);
  return [...found];
}

const FR_NAMES: Record<string, string> = {
  'United States of America': 'États-Unis', Canada: 'Canada', Thailand: 'Thaïlande', Nepal: 'Népal', India: 'Inde',
  China: 'Chine', Brazil: 'Brésil', Algeria: 'Algérie', Australia: 'Australie', Greenland: 'Groenland',
  Antarctica: 'Antarctique', Russia: 'Russie', 'United Kingdom': 'Royaume-Uni', Germany: 'Allemagne', Spain: 'Espagne',
  Italy: 'Italie', Mexico: 'Mexique', Indonesia: 'Indonésie', Japan: 'Japon', Morocco: 'Maroc', Egypt: 'Égypte',
};

const W = 960;
const H = 470;

export function NewsMap({ items, lang }: { items: MapItem[]; lang: Language }) {
  const [selected, setSelected] = useState<string | null>(null);
  const projection = useMemo(() => geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'Sphere' }), []);
  const path = useMemo(() => geoPath(projection), [projection]);

  const byCountry = useMemo(() => {
    const m = new Map<string, MapItem[]>();
    for (const it of items) for (const c of locate(it.text)) m.set(c, [...(m.get(c) ?? []), it]);
    return m;
  }, [items]);

  const max = Math.max(1, ...[...byCountry.values()].map((v) => v.length));
  const name = (c: string) => (lang === 'fr' ? FR_NAMES[c] ?? c : c);
  const list = selected ? byCountry.get(selected) ?? [] : [];
  const located = [...byCountry.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 bg-white border border-slate-900/10 rounded-2xl p-3 sm:p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={lang === 'fr' ? 'Carte du monde des actualités' : 'World map of news'}>
          <path d={path({ type: 'Sphere' }) || ''} fill="#EEF3F8" stroke="#CBD5E1" />
          <path d={path(GRATICULE) || ''} fill="none" stroke="#D5DEE8" strokeWidth={0.5} />
          {COUNTRIES.features.map((f: Feature<Geometry, { name: string }>) => {
            const n = byCountry.get(f.properties.name)?.length ?? 0;
            const active = selected === f.properties.name;
            return (
              <path
                key={f.properties.name}
                d={path(f) || ''}
                fill={n ? (active ? '#1D4ED8' : `rgba(37, 99, 235, ${0.25 + 0.55 * (n / max)})`) : '#D9DED6'}
                stroke="#F4F4F0"
                strokeWidth={0.5}
                className={n ? 'cursor-pointer transition-colors' : ''}
                onClick={() => n && setSelected(active ? null : f.properties.name)}
              >
                <title>{n ? `${name(f.properties.name)} — ${n}` : name(f.properties.name)}</title>
              </path>
            );
          })}
          {located.map(([c, arr]) => {
            const f = BY_NAME.get(c)!;
            const [x, y] = projection(geoCentroid(f)) ?? [0, 0];
            return (
              <g key={c} className="cursor-pointer" onClick={() => setSelected(selected === c ? null : c)}>
                <circle cx={x} cy={y} r={12} fill="#2563EB" opacity={0.18} className="geo-ring" />
                <circle cx={x} cy={y} r={9} fill="#0F172A" stroke="#fff" strokeWidth={1.5} />
                <text x={x} y={y + 3.5} textAnchor="middle" fontSize="10" fontWeight="600" fill="#fff" className="font-mono-tabular">
                  {arr.length}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="lg:col-span-4 bg-white border border-slate-900/10 rounded-2xl p-6 flex flex-col">
        {selected ? (
          <>
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-900/10">
              <h3 className="text-lg font-semibold text-slate-900">{name(selected)}</h3>
              <button type="button" onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="divide-y divide-slate-900/10">
              {list.map((it) => (
                <li key={it.link}>
                  <a href={it.link} target="_blank" rel="noopener noreferrer" className="group block py-3">
                    <span className="block text-[11px] text-slate-500 font-mono-tabular">{it.source}</span>
                    <span className="text-sm font-medium text-slate-900 group-hover:text-[#2563EB] inline-flex gap-1">
                      {it.title} <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-[0.12em] pb-4 border-b border-slate-900/10">
              {lang === 'fr' ? 'Régions dans l’actualité' : 'Regions in the news'}
            </h3>
            <ul className="divide-y divide-slate-900/10">
              {located.map(([c, arr]) => (
                <li key={c}>
                  <button type="button" onClick={() => setSelected(c)} className="w-full flex items-center justify-between py-3 text-sm text-slate-800 hover:text-[#2563EB] cursor-pointer">
                    <span>{name(c)}</span>
                    <span className="font-mono-tabular text-xs text-slate-500">{arr.length}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-4 text-xs text-slate-500">
              {lang === 'fr'
                ? 'Lieux détectés automatiquement dans les titres et résumés. Cliquez sur un pays pour voir ses nouvelles.'
                : 'Locations detected automatically from titles and summaries. Click a country to see its news.'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
