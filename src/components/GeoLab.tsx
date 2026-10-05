import React, { useEffect, useMemo, useRef, useState } from 'react';
import { geoOrthographic, geoPath, geoGraticule10, geoInterpolate, geoDistance } from 'd3-geo';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import world from 'world-atlas/countries-110m.json';
import { Layers, Minus, Plus, X } from 'lucide-react';
import type { Language } from '../data/cvData';

type LayerKey = 'exp' | 'edu' | 'route' | 'grid';
type Txt = { fr: string; en: string };
interface PlaceItem { layer: 'exp' | 'edu'; when: Txt; title: Txt; org: Txt }
interface Place { id: string; name: Txt; coord: [number, number]; items: PlaceItem[] }

const t = (fr: string, en = fr): Txt => ({ fr, en });

const PLACES: Place[] = [
  {
    id: 'sher',
    name: t('Sherbrooke, Québec'),
    coord: [-71.89, 45.4],
    items: [
      { layer: 'exp', when: t('Mai 2025 – janv. 2026', 'May 2025 – Jan. 2026'), title: t('Stage de recherche Mitacs, IA appliquée à l’environnement', 'Mitacs research internship, AI for the environment'), org: t('T2 Environnement & Université de Sherbrooke') },
      { layer: 'edu', when: t('2024 – 2026'), title: t('Maîtrise en géomatique appliquée et télédétection', 'Master’s in applied geomatics and remote sensing'), org: t('Université de Sherbrooke') },
    ],
  },
  {
    id: 'sba',
    name: t('Sidi Bel Abbès, Algérie', 'Sidi Bel Abbès, Algeria'),
    coord: [-0.63, 35.19],
    items: [
      { layer: 'exp', when: t('2022 – 2023'), title: t('Mémoire de master, stationnement intelligent (fog computing, iFogSim)', 'Master’s thesis, fog-computing smart parking (iFogSim)'), org: t('Université Djillali Liabès', 'Djillali Liabès University') },
      { layer: 'edu', when: t('2021 – 2023'), title: t('Master en réseaux, systèmes et sécurité de l’information', 'Master’s in networks, systems and information security'), org: t('Université Djillali Liabès', 'Djillali Liabès University') },
      { layer: 'exp', when: t('2020 – 2021'), title: t('Stage de fin de baccalauréat, développement web', 'Bachelor’s internship, web development'), org: t('Sidi Bel Abbès') },
      { layer: 'exp', when: t('2019 – 2020'), title: t('Stage SIG', 'GIS internship'), org: t('Bureau d’ingénierie et laboratoire BILC', 'BILC engineering office and lab') },
      { layer: 'edu', when: t('2018 – 2021'), title: t('Licence en systèmes informatiques', 'Bachelor’s in computer systems'), org: t('Université Djillali Liabès', 'Djillali Liabès University') },
    ],
  },
];

const COUNTRIES = feature(world as any, (world as any).objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;
const HOME = new Set(['Canada', 'Algeria']);
const ROUTE = { type: 'LineString' as const, coordinates: Array.from({ length: 51 }, (_, i) => geoInterpolate(PLACES[1].coord, PLACES[0].coord)(i / 50)) };
const GRATICULE = geoGraticule10();

const W = 600;
const H = 520;
const BASE = 225;
const EXP_COLOR = '#047857';
const EDU_COLOR = '#2563EB';

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const viewFor = (c: [number, number]): [number, number, number] => [-c[0] + 18, -c[1] + 14, 0];
const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function fmtCoord(c: [number, number], lang: Language) {
  const [lon, lat] = c;
  return `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : lang === 'fr' ? 'O' : 'W'}`;
}

/* ------------------------------------------------------------------ */
/* Career globe                                                        */
/* ------------------------------------------------------------------ */
function CareerGlobe({ lang }: { lang: Language }) {
  const [rotation, setRotation] = useState<[number, number, number]>(viewFor(PLACES[1].coord));
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({ exp: true, edu: true, route: true, grid: false });
  const [selected, setSelected] = useState<string | null>(null);
  const [readout, setReadout] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const anim = useRef<number | null>(null);
  const drag = useRef<{ x: number; y: number; r: [number, number, number] } | null>(null);

  const projection = useMemo(
    () => geoOrthographic().translate([W / 2, H / 2]).scale(BASE * zoom).clipAngle(90).rotate(rotation),
    [rotation, zoom]
  );
  const path = useMemo(() => geoPath(projection), [projection]);
  const center = projection.invert!([W / 2, H / 2]) as [number, number];

  const stopAnim = () => {
    if (anim.current) cancelAnimationFrame(anim.current);
    anim.current = null;
  };

  const animateTo = (target: [number, number, number], ms: number, done?: () => void) => {
    stopAnim();
    if (prefersReduced() || ms === 0) {
      setRotation(target);
      done?.();
      return;
    }
    const from = rotation;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const e = easeInOut(p);
      setRotation([from[0] + (target[0] - from[0]) * e, from[1] + (target[1] - from[1]) * e, 0]);
      if (p < 1) anim.current = requestAnimationFrame(step);
      else {
        anim.current = null;
        done?.();
      }
    };
    anim.current = requestAnimationFrame(step);
  };

  // Intro: travel from Algeria to Sherbrooke, then open the Sherbrooke card
  useEffect(() => {
    const timer = window.setTimeout(() => animateTo(viewFor(PLACES[0].coord), 2600, () => setSelected('sher')), 700);
    return () => {
      window.clearTimeout(timer);
      stopAnim();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flyTo = (id: string) => {
    const p = PLACES.find((x) => x.id === id)!;
    setSelected(id);
    animateTo(viewFor(p.coord), 1100);
  };

  const toSvg = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * H) / r.height] as [number, number];
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest('[data-pin]')) return;
    stopAnim();
    svgRef.current!.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, r: rotation };
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag.current) {
      const r = svgRef.current!.getBoundingClientRect();
      const k = (75 / (BASE * zoom)) * (W / r.width);
      const d = drag.current;
      setRotation([d.r[0] + (e.clientX - d.x) * k, Math.max(-85, Math.min(85, d.r[1] - (e.clientY - d.y) * k)), 0]);
    }
    const [x, y] = toSvg(e);
    const dx = x - W / 2;
    const dy = y - H / 2;
    if (dx * dx + dy * dy > (BASE * zoom) ** 2) return setReadout(null);
    const c = projection.invert!([x, y]);
    setReadout(c ? fmtCoord(c as [number, number], lang) : null);
  };
  const endDrag = () => {
    drag.current = null;
  };

  const pinColor = (p: Place) => {
    if (layers.exp && p.items.some((i) => i.layer === 'exp')) return EXP_COLOR;
    if (layers.edu && p.items.some((i) => i.layer === 'edu')) return EDU_COLOR;
    return null;
  };

  const sel = PLACES.find((p) => p.id === selected) || null;
  const selItems = sel ? sel.items.filter((i) => layers[i.layer]) : [];

  const layerDefs: { key: LayerKey; label: Txt; swatch: React.ReactNode }[] = [
    { key: 'exp', label: t('Expérience', 'Experience'), swatch: <span className="w-2.5 h-2.5 rounded-full" style={{ background: EXP_COLOR }} /> },
    { key: 'edu', label: t('Formation', 'Education'), swatch: <span className="w-2.5 h-2.5 rounded-full" style={{ background: EDU_COLOR }} /> },
    { key: 'route', label: t('Trajet', 'Route'), swatch: <span className="w-3.5 h-0 border-t-2 border-dashed border-slate-900" /> },
    { key: 'grid', label: t('Graticule'), swatch: <span className="w-2.5 h-2.5 border border-slate-500 rounded-[2px]" /> },
  ];

  return (
    <figure className="m-0 bg-white border border-slate-900/10 rounded-2xl overflow-hidden flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-slate-900/10">
        <div>
          <div className="text-sm font-semibold text-slate-900">{lang === 'fr' ? 'Carte du parcours' : 'Career map'}</div>
          <div className="text-xs text-slate-500">{lang === 'fr' ? 'Glissez pour faire tourner le globe' : 'Drag to spin the globe'}</div>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={lang === 'fr' ? 'Couches' : 'Layers'}>
          {layerDefs.map((l) => (
            <button
              key={l.key}
              type="button"
              aria-pressed={layers[l.key]}
              onClick={() => setLayers((s) => ({ ...s, [l.key]: !s[l.key] }))}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                layers[l.key] ? 'border-slate-900 text-slate-900 bg-white' : 'border-slate-300 text-slate-500 bg-slate-50 opacity-70'
              }`}
            >
              {l.swatch}
              {l.label[lang]}
            </button>
          ))}
        </div>
      </div>

      <div className="relative bg-[radial-gradient(circle_at_50%_45%,#ffffff,#EEF0EA)]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full h-auto cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'none' }}
          role="img"
          aria-label={lang === 'fr' ? 'Globe interactif : Sherbrooke et Sidi Bel Abbès' : 'Interactive globe: Sherbrooke and Sidi Bel Abbès'}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => setReadout(null)}
        >
          <path d={path({ type: 'Sphere' }) || ''} fill="#E3EAF2" stroke="#CBD5E1" />
          {layers.grid && <path d={path(GRATICULE) || ''} fill="none" stroke="#B8C4D4" strokeWidth={0.5} />}
          {COUNTRIES.features.map((f, i) => {
            const home = HOME.has(f.properties.name);
            return (
              <path
                key={i}
                d={path(f) || ''}
                fill={home ? '#CDEBDF' : '#D6DBE2'}
                stroke={home ? EXP_COLOR : '#BAC3CF'}
                strokeWidth={home ? 0.8 : 0.5}
              />
            );
          })}
          {layers.route && <path d={path(ROUTE) || ''} className="geo-route" fill="none" stroke="#0F172A" strokeWidth={2} strokeDasharray="6 6" opacity={0.8} />}
          {PLACES.map((p) => {
            const col = pinColor(p);
            if (!col || geoDistance(p.coord, center) > Math.PI / 2 - 0.05) return null;
            const [x, y] = projection(p.coord)!;
            const isSel = selected === p.id;
            return (
              <g
                key={p.id}
                data-pin
                transform={`translate(${x},${y})`}
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={p.name[lang]}
                onClick={() => flyTo(p.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), flyTo(p.id))}
              >
                <circle r={8} fill="none" stroke={col} strokeWidth={2} className="geo-ring" />
                <circle r={isSel ? 9 : 7} fill={col} stroke="#fff" strokeWidth={2.5} />
                <text x={13} y={4} fontSize={12} fontWeight={600} fill="#0F172A" stroke="#fff" strokeWidth={4} paintOrder="stroke" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
                  {p.name[lang].split(',')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute right-3 top-3 flex flex-col bg-white border border-slate-900/10 rounded-lg overflow-hidden">
          <button type="button" aria-label="Zoom +" onClick={() => setZoom((z) => Math.min(4, z * 1.35))} className="w-8 h-8 grid place-items-center hover:bg-slate-50 cursor-pointer">
            <Plus className="w-4 h-4" />
          </button>
          <button type="button" aria-label="Zoom −" onClick={() => setZoom((z) => Math.max(0.8, z / 1.35))} className="w-8 h-8 grid place-items-center hover:bg-slate-50 border-t border-slate-900/10 cursor-pointer">
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {sel && (
          <div className="geo-pop relative sm:absolute sm:left-3 sm:bottom-3 mx-3 mb-3 sm:m-0 sm:w-[300px] max-h-[calc(100%-1.5rem)] overflow-auto bg-white border border-slate-900/10 rounded-xl shadow-lg p-4">
            <button type="button" onClick={() => setSelected(null)} aria-label={lang === 'fr' ? 'Fermer' : 'Close'} className="absolute top-2 right-2 p-1 text-slate-500 hover:text-slate-900 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
            <div className="text-sm font-semibold text-slate-900 pr-6">{sel.name[lang]}</div>
            <div className="text-[11px] font-mono-tabular text-slate-500 mb-3">{fmtCoord(sel.coord, lang)}</div>
            {selItems.length === 0 ? (
              <p className="text-xs text-slate-600">{lang === 'fr' ? 'Activez une couche pour voir les entrées.' : 'Turn on a layer to see entries.'}</p>
            ) : (
              <ul className="space-y-2.5">
                {selItems.map((i, k) => (
                  <li key={k} className="grid grid-cols-[10px_1fr] gap-2.5 text-[13px] leading-snug">
                    <span className="w-2.5 h-2.5 rounded-full mt-1" style={{ background: i.layer === 'exp' ? EXP_COLOR : EDU_COLOR }} />
                    <span>
                      <span className="font-semibold text-slate-900">{i.title[lang]}</span>
                      <span className="block text-xs text-slate-500">
                        {i.org[lang]} · {i.when[lang]}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-t border-slate-900/10 text-xs">
        <span className="font-mono-tabular text-slate-500">
          {readout ?? (lang === 'fr' ? 'Survolez le globe pour lire les coordonnées' : 'Hover the globe to read coordinates')}
        </span>
        <div className="flex gap-1.5">
          {PLACES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => flyTo(p.id)}
              className={`px-2.5 py-1 rounded-md border font-medium transition-colors cursor-pointer ${
                selected === p.id ? 'border-[#2563EB] text-[#2563EB] bg-blue-50' : 'border-slate-300 text-slate-800 hover:border-slate-900'
              }`}
            >
              {p.name[lang].split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Spectral comparison: true colour vs colour infrared + NDVI probe    */
/* ------------------------------------------------------------------ */
const SW = 240;
const SH = 150;
type Cls = 'water' | 'forest' | 'crop' | 'bare' | 'urban' | 'road';
const CLS: Cls[] = ['water', 'forest', 'crop', 'bare', 'urban', 'road'];
const CLS_NAME: Record<Language, Record<Cls, string>> = {
  fr: { water: 'Eau', forest: 'Forêt', crop: 'Cultures', bare: 'Sol nu', urban: 'Bâti', road: 'Route' },
  en: { water: 'Water', forest: 'Forest', crop: 'Crops', bare: 'Bare soil', urban: 'Built-up', road: 'Road' },
};
const NAT: Record<Cls, number[]> = { water: [30, 70, 104], forest: [44, 80, 46], crop: [118, 148, 68], bare: [176, 156, 118], urban: [156, 152, 148], road: [104, 104, 108] };
const CIR: Record<Cls, number[]> = { water: [10, 22, 54], forest: [176, 26, 40], crop: [230, 74, 96], bare: [178, 166, 170], urban: [96, 152, 178], road: [70, 118, 146] };
const NDVI: Record<Cls, number> = { water: -0.25, forest: 0.74, crop: 0.55, bare: 0.12, urban: 0.05, road: 0.02 };

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function noise(seed: number) {
  const r = rng(seed);
  const G = 64;
  const g = new Float32Array(G * G).map(() => r());
  const s = (x: number) => x * x * (3 - 2 * x);
  const at = (a: number, b: number) => g[(((b % G) + G) % G) * G + (((a % G) + G) % G)];
  const v = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = s(x - xi), yf = s(y - yi);
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  return (x: number, y: number) => {
    let total = 0, amp = 0.5, f = 1;
    for (let o = 0; o < 4; o++) {
      total += amp * v(x * f, y * f);
      amp *= 0.5;
      f *= 2;
    }
    return total / 0.9375;
  };
}

function buildScene() {
  const nH = noise(7), nM = noise(21), nU = noise(44), nR = noise(90);
  const rand = rng(1103);
  const cls = new Uint8Array(SW * SH);
  const jit = new Float32Array(SW * SH);
  for (let y = 0; y < SH; y++)
    for (let x = 0; x < SW; x++) {
      const i = y * SW + x;
      const h = nH(x / 55, y / 55), m = nM(x / 38 + 5, y / 38 + 5), u = nU(x / 30 + 9, y / 30 + 9);
      const ry = 72 + 26 * Math.sin(x / 34) + 14 * (nR(x / 20, 0.5) - 0.5) * 2;
      const rw = 2.2 + 1.4 * nR(x / 15, 3);
      let c: number;
      if (Math.abs(y - ry) < rw || h < 0.3) c = 0;
      else if (u > 0.6) c = x % 7 === 0 || y % 6 === 0 ? 5 : 4;
      else if (m > 0.56) c = 1;
      else {
        const px = Math.floor((x + Math.floor(y / 9) * 3) / 13), py = Math.floor(y / 9);
        c = rng(px * 7919 + py * 104729 + 13)() < 0.55 ? 2 : 3;
      }
      cls[i] = c;
      jit[i] = rand() - 0.5;
    }
  const paint = (pal: Record<Cls, number[]>) => {
    const cv = document.createElement('canvas');
    cv.width = SW;
    cv.height = SH;
    const ctx = cv.getContext('2d')!;
    const im = ctx.createImageData(SW, SH);
    for (let i = 0; i < SW * SH; i++) {
      const k = CLS[cls[i]], p = pal[k], s = 1 + jit[i] * (k === 'water' ? 0.12 : 0.22);
      im.data[i * 4] = Math.min(255, p[0] * s);
      im.data[i * 4 + 1] = Math.min(255, p[1] * s);
      im.data[i * 4 + 2] = Math.min(255, p[2] * s);
      im.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
    return cv;
  };
  return { cls, jit, nat: paint(NAT), cir: paint(CIR) };
}

function SpectralSlider({ lang }: { lang: Language }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scene = useRef<ReturnType<typeof buildScene> | null>(null);
  const [split, setSplit] = useState(1);
  const [probe, setProbe] = useState<{ cls: Cls; v: number } | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    scene.current = buildScene();
    if (prefersReduced()) return setSplit(0.5);
    let raf = 0;
    const start = performance.now() + 400;
    const step = (now: number) => {
      const p = Math.max(0, Math.min(1, (now - start) / 1400));
      setSplit(1 - 0.5 * (1 - Math.pow(1 - p, 3)));
      if (p < 1 && !dragging.current) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const s = scene.current, cv = canvasRef.current;
    if (!s || !cv) return;
    const ctx = cv.getContext('2d')!;
    const sx = Math.round(split * SW);
    ctx.drawImage(s.nat, 0, 0);
    if (sx < SW) ctx.drawImage(s.cir, sx, 0, SW - sx, SH, sx, 0, SW - sx, SH);
  }, [split]);

  const frac = (e: React.PointerEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };
  const readAt = (fx: number, fy: number) => {
    const s = scene.current;
    if (!s) return;
    const x = Math.max(0, Math.min(SW - 1, Math.floor(fx * SW))), y = Math.max(0, Math.min(SH - 1, Math.floor(fy * SH)));
    const i = y * SW + x, k = CLS[s.cls[i]];
    setProbe({ cls: k, v: NDVI[k] + s.jit[i] * 0.12 });
  };

  return (
    <figure className="m-0 bg-white border border-slate-900/10 rounded-2xl overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-slate-900/10">
        <div className="text-sm font-semibold text-slate-900">{lang === 'fr' ? 'Lecture spectrale' : 'Spectral reading'}</div>
        <div className="text-xs text-slate-500">
          {lang === 'fr' ? 'Glissez pour comparer, touchez un pixel pour lire son NDVI' : 'Drag to compare, tap a pixel to read its NDVI'}
        </div>
      </div>
      <div
        ref={wrapRef}
        className="relative cursor-ew-resize select-none focus-within:outline-2 focus-within:outline-[#2563EB]"
        style={{ aspectRatio: `${SW}/${SH}`, touchAction: 'pan-y' }}
        onPointerDown={(e) => {
          dragging.current = true;
          const f = frac(e);
          readAt(f.x, f.y);
          if (e.pointerType === 'mouse') setSplit(Math.max(0, Math.min(1, f.x)));
        }}
        onPointerMove={(e) => {
          const f = frac(e);
          if (dragging.current) setSplit(Math.max(0, Math.min(1, f.x)));
          if (e.pointerType === 'mouse') readAt(f.x, f.y);
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={(e) => {
          dragging.current = false;
          if (e.pointerType === 'mouse') setProbe(null);
        }}
      >
        <canvas ref={canvasRef} width={SW} height={SH} className="block w-full h-full" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
        <div className="absolute inset-y-0 w-0.5 bg-white pointer-events-none" style={{ left: `${split * 100}%`, transform: 'translateX(-1px)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md grid place-items-center text-slate-900 text-xs font-bold">
            ⇆
          </div>
        </div>
        <span className="absolute top-2.5 left-2.5 text-[11px] font-semibold text-white bg-slate-900/70 rounded px-2 py-1 pointer-events-none">
          {lang === 'fr' ? 'Couleurs naturelles' : 'True colour'}
        </span>
        <span className="absolute top-2.5 right-2.5 text-[11px] font-semibold text-white bg-slate-900/70 rounded px-2 py-1 pointer-events-none">
          {lang === 'fr' ? 'Infrarouge (fausses couleurs)' : 'Colour infrared'}
        </span>
        {probe && (
          <span className="absolute bottom-2.5 left-2.5 text-xs font-mono-tabular font-semibold text-slate-900 bg-white/95 rounded px-2 py-1 pointer-events-none" aria-live="polite">
            {CLS_NAME[lang][probe.cls]} · NDVI {probe.v >= 0 ? '+' : '−'}
            {Math.abs(probe.v).toFixed(2)}
          </span>
        )}
        <label className="sr-only" htmlFor="spectral-split">
          {lang === 'fr' ? 'Position du curseur de comparaison' : 'Comparison slider position'}
        </label>
        <input
          id="spectral-split"
          type="range"
          min={0}
          max={100}
          value={Math.round(split * 100)}
          onChange={(e) => setSplit(+e.target.value / 100)}
          className="sr-only"
        />
      </div>
      <div className="px-5 py-3 border-t border-slate-900/10 text-xs text-slate-600 leading-relaxed">
        {lang === 'fr'
          ? 'En infrarouge, la végétation saine réfléchit fortement et apparaît en rouge, tandis que l’eau devient presque noire. C’est la base du NDVI. Scène synthétique générée dans le navigateur.'
          : 'In infrared, healthy vegetation reflects strongly and shows up red, while water turns almost black. That is the basis of NDVI. Synthetic scene generated in the browser.'}
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */
export function GeoLab({ lang }: { lang: Language }) {
  return (
    <section id="geolab" className="max-w-[1280px] mx-auto px-6 py-20 md:py-24 no-print">
      <div className="space-y-2 max-w-2xl mb-10">
        <div className="text-xs font-mono-tabular text-[#2563EB] inline-flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          {lang === 'fr' ? 'Laboratoire géospatial' : 'Geospatial lab'}
        </div>
        <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          {lang === 'fr' ? 'Mon parcours sur la carte, et la télédétection en action' : 'My path on the map, and remote sensing in action'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {lang === 'fr'
            ? 'Faites tourner le globe et cliquez sur un lieu pour voir ce que j’y ai fait, puis comparez une scène en couleurs naturelles et en infrarouge.'
            : 'Spin the globe and click a place to see what I did there, then compare a scene in true colour and infrared.'}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <CareerGlobe lang={lang} />
        </div>
        <div className="lg:col-span-5">
          <SpectralSlider lang={lang} />
        </div>
      </div>
    </section>
  );
}
