import React, { useEffect, useState } from 'react';
import { Award, BookOpen, Download, FileText } from 'lucide-react';
import type { CVContent, Language } from '../data/cvData';

/** Extra, public-safe details for research documents (no signatures or personal data). */
const RESEARCH_EXTRA: Record<string, { type: Record<Language, string>; year: string; authors: string; supervision: Record<Language, string>; pdf?: string; keywords: Record<Language, string[]> }> = {
  'udl-master': {
    type: { fr: 'Mémoire de master', en: 'Master’s thesis' },
    year: '2023',
    authors: 'Djamel Eddine Yousfi, Akrem Benchiha',
    supervision: {
      fr: 'Direction : Dr Samah Bouamama · Jury : Dr Reda Adjoudj (président), Dr Noureddine Boukhari (examinateur)',
      en: 'Supervisor: Dr Samah Bouamama · Committee: Dr Reda Adjoudj (chair), Dr Noureddine Boukhari (examiner)',
    },
    pdf: '/docs/memoire-master-fog-computing.pdf',
    keywords: { fr: ['Fog computing', 'Cloud computing', 'IoT', 'iFogSim', 'Stationnement intelligent'], en: ['Fog computing', 'Cloud computing', 'IoT', 'iFogSim', 'Smart parking'] },
  },
  'udes-maitrise': {
    type: { fr: 'Projet de recherche appliquée (Mitacs)', en: 'Applied research project (Mitacs)' },
    year: '2025 – 2026',
    authors: 'Akrem Benchiha',
    supervision: {
      fr: 'Supervision : Pr Mickaël Germain, Pr Samuel Foucher, Pr Yacine Bouroubi · Partenaire : T2 Environnement',
      en: 'Supervision: Prof. Mickaël Germain, Prof. Samuel Foucher, Prof. Yacine Bouroubi · Partner: T2 Environnement',
    },
    keywords: { fr: ['RAG', 'LLM', 'Base de connaissances vectorielle', 'Cartographie web', 'Aide à la décision environnementale'], en: ['RAG', 'LLM', 'Vector knowledge base', 'Web mapping', 'Environmental decision support'] },
  },
};

export function Publications({ content, lang }: { content: CVContent; lang: Language }) {
  const research = content.education.filter((e) => e.thesisTitle && RESEARCH_EXTRA[e.id]);
  // Only show download buttons for documents that are actually published with the site
  const [available, setAvailable] = useState<Record<string, boolean>>({});
  useEffect(() => {
    Object.values(RESEARCH_EXTRA).forEach((x) => {
      if (!x.pdf) return;
      fetch(x.pdf, { method: 'HEAD' })
        .then((r) => {
          const type = r.headers.get('content-type') || '';
          setAvailable((a) => ({ ...a, [x.pdf!]: r.ok && type.includes('pdf') }));
        })
        .catch(() => setAvailable((a) => ({ ...a, [x.pdf!]: false })));
    });
  }, []);
  const certs = content.educationSection.certifications;
  const t = {
    kicker: lang === 'fr' ? 'Travaux et attestations' : 'Research and certificates',
    title: lang === 'fr' ? 'Mémoire, projets de recherche et formations' : 'Thesis, research projects and training',
    subtitle:
      lang === 'fr'
        ? 'Les travaux de recherche réalisés pendant mes études, et les formations attestées par un établissement.'
        : 'Research carried out during my studies, and training certified by an institution.',
    download: lang === 'fr' ? 'Télécharger le mémoire (PDF)' : 'Download the thesis (PDF)',
    lang: lang === 'fr' ? 'Rédigé en français' : 'Written in French',
    verified: lang === 'fr' ? 'Attestation disponible sur demande' : 'Certificate available on request',
  };

  return (
    <section id="publications" className="max-w-[1280px] mx-auto px-6 py-20 md:py-24">
      <div className="space-y-2 max-w-2xl mb-12">
        <div className="text-xs font-mono-tabular text-[#2563EB] inline-flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          {t.kicker}
        </div>
        <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900">{t.title}</h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{t.subtitle}</p>
      </div>

      <div className="space-y-5">
        {research.map((edu) => {
          const x = RESEARCH_EXTRA[edu.id];
          return (
            <article
              key={edu.id}
              className="bg-white border border-slate-900/10 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]"
            >
              <div className="lg:col-span-3 space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB]">
                  <FileText className="w-3.5 h-3.5" />
                  {x.type[lang]}
                </div>
                <div className="text-2xl font-semibold text-slate-900 font-mono-tabular">{x.year}</div>
                <div className="text-sm text-slate-700">{edu.institution}</div>
                <div className="text-xs text-slate-500">{edu.degree}</div>
              </div>
              <div className="lg:col-span-9 space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">{edu.thesisTitle}</h3>
                <div className="text-sm text-slate-700">{x.authors}</div>
                <div className="text-xs text-slate-500">{x.supervision[lang]}</div>
                <p className="text-sm text-slate-700 leading-relaxed max-w-[75ch]">{edu.thesisDescription}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
                  <span className="text-xs font-mono-tabular text-slate-500">{x.keywords[lang].join(' · ')}</span>
                </div>
                {x.pdf && available[x.pdf] && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={x.pdf}
                      download
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      {t.download}
                    </a>
                    <span className="text-xs text-slate-500">{t.lang} · 74 pages</span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {certs.length > 0 && (
        <div className="mt-12">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 inline-flex items-center gap-2">
            <Award className="w-4 h-4 text-[#2563EB]" />
            {content.educationSection.certificationsTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {certs.map((c) => (
              <article key={c.id} className="bg-[#F4F4F0] border border-slate-900/10 rounded-2xl p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular text-slate-600">
                  <span>{c.date}</span>
                  <span>
                    {c.duration} · {c.location}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-slate-900">{c.title}</h4>
                <div className="text-sm text-[#2563EB]">{c.institution}</div>
                <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
                  {c.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
                <div className="text-xs text-slate-500 pt-1">{t.verified}</div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
