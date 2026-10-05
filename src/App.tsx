import React, { useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  Check,
  Copy,
  Download,
  Globe,
  Layers,
  Mail,
  MapPin,
  Phone,
  Printer,
  Search,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { CV_DATA, Language, ProjectCaseStudy, SkillCategory } from './data/cvData';
import { GeoLab } from './components/GeoLab';
import { Publications } from './components/Publications';
import { askClaude, localAnswer } from './lib/assistantFallback';

export function App() {
  const [lang, setLang] = useState<Language>('fr');
  const [projectFilter, setProjectFilter] = useState<SkillCategory>('all');
  const [experienceFilter, setExperienceFilter] = useState<SkillCategory>('all');
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Contact composer state
  const [senderName, setSenderName] = useState('');
  const [senderOrg, setSenderOrg] = useState('');
  const [roleMode, setRoleMode] = useState('');
  const [messageBody, setMessageBody] = useState('');

  // AI Assistant state
  const [showAssistantModal, setShowAssistantModal] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [assistantInput, setAssistantInput] = useState<string>('');
  const [isAssistantThinking, setIsAssistantThinking] = useState<boolean>(false);
  const [assistantError, setAssistantError] = useState<string | null>(null);

  const content = CV_DATA[lang];

  React.useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === 'fr'
        ? 'Akrem Benchiha — Géomatique, télédétection et IA appliquée'
        : 'Akrem Benchiha — Geomatics, remote sensing and applied AI';
    const desc = document.querySelector('meta[name="description"]');
    desc?.setAttribute(
      'content',
      lang === 'fr'
        ? 'Portfolio d’Akrem Benchiha : géomatique, télédétection et IA appliquée (RAG, LLM, cartographie web). Université de Sherbrooke.'
        : 'Akrem Benchiha’s portfolio: geomatics, remote sensing and applied AI (RAG, LLMs, web mapping). Université de Sherbrooke.'
    );
  }, [lang]);

  const handleSendAssistantMessage = async (queryText?: string) => {
    const textToSend = (queryText ?? assistantInput).trim();
    if (!textToSend || isAssistantThinking) return;

    setAssistantError(null);
    setAssistantInput('');
    const newMessages = [...chatMessages, { role: 'user' as const, content: textToSend }];
    setChatMessages(newMessages);
    setIsAssistantThinking(true);

    let reply: string | null = null;
    // 1) The site's own server (Gemini), when deployed with an API key
    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, message: textToSend }),
      });
      if (res.ok) {
        const data = await res.json();
        reply = data.reply || null;
      }
    } catch {
      // server not reachable (static hosting or preview): fall through
    }
    // 2) Claude, when the page is viewed inside claude.ai
    if (!reply) reply = await askClaude(newMessages, textToSend, lang);
    // 3) Built-in answers from the CV, always available
    if (!reply) reply = localAnswer(textToSend, lang);

    try {
      setChatMessages((prev) => [...prev, { role: 'assistant' as const, content: reply! }]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(key);
    setTimeout(() => {
      setCopiedField((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const filteredProjects = content.projects.filter((project) =>
    projectFilter === 'all' ? true : project.category === projectFilter
  );

  const filteredExperiences = content.experiences.filter((exp) =>
    experienceFilter === 'all' ? true : exp.category === experienceFilter
  );

  const filteredSkillGroups = content.skillGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
          item.context.toLowerCase().includes(skillSearch.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  const handleComposeMail = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveMode = roleMode || content.contactSection.modes[0];
    const subject = encodeURIComponent(
      `${lang === 'fr' ? 'Opportunité — Géomatique & IA' : 'Opportunity — Geomatics & AI'}${
        senderOrg ? ` (${senderOrg})` : ''
      }`
    );
    const body = encodeURIComponent(
      `${messageBody || content.contactSection.messagePlaceholder}\n\n---\n${
        senderName ? `${lang === 'fr' ? 'Nom' : 'Name'}: ${senderName}\n` : ''
      }${senderOrg ? `${lang === 'fr' ? 'Organisation' : 'Organization'}: ${senderOrg}\n` : ''}${
        lang === 'fr' ? 'Modalité' : 'Format'
      }: ${effectiveMode}`
    );
    window.location.href = `mailto:${content.meta.academicEmail}?cc=${content.meta.personalEmail}&subject=${subject}&body=${body}`;
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#0F172A] flex flex-col">
      {/* Top Bar Contract: Strictly 3 zones (Brand wordmark | 4-5 nav links | 1-2 primary actions) */}
      <header className="sticky top-0 z-30 bg-[#F4F4F0]/95 backdrop-blur-sm border-b border-slate-900/10 no-print">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-lg font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB]"
          >
            Akrem Benchiha
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-slate-600">
            <a
              href="#geolab"
              className="hover:text-slate-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'fr' ? 'Carte' : 'Map'}
            </a>
            <a
              href="#projects"
              className="hover:text-slate-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {content.nav.projects}
            </a>
            <a
              href="#experience"
              className="hover:text-slate-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {content.nav.experience}
            </a>
            <a
              href="#skills"
              className="hover:text-slate-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {content.nav.skills}
            </a>
            <a
              href="#education"
              className="hover:text-slate-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {content.nav.education}
            </a>
            <a
              href="#contact"
              className="hover:text-slate-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {content.nav.contact}
            </a>
          </nav>

          {/* Zone 3: 2 primary actions (Language switch + CV Print/PDF View) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 border border-slate-300 rounded-lg hover:bg-white/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              aria-label="Switch language"
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-[#2563EB] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {content.nav.printCv}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="top" className="flex-1 no-print">
        {/* Hero Section: Split-Screen Editorial Layout */}
        <section className="max-w-[1280px] mx-auto px-6 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Typographic Anchor + Key Metrics */}
            <div className="lg:col-span-7 space-y-8">
              {/* Quiet unboxed metadata line */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-mono-tabular">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" aria-hidden="true" />
                <span>{content.hero.kicker}</span>
                <span aria-hidden="true">·</span>
                <span>{content.meta.coordinates}</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-semibold tracking-tight text-slate-900 leading-[1.02]">
                  {content.meta.name}
                </h1>
                <p className="text-2xl sm:text-3xl lg:text-[34px] font-medium tracking-tight text-slate-800 leading-[1.2]">
                  {content.hero.headlineMain}{' '}
                  <span className="font-serif-editorial italic font-normal text-[#2563EB] text-[1.12em]">
                    {content.hero.headlineSerif}
                  </span>
                </p>
                <p className="text-base sm:text-[17px] text-slate-700 leading-[1.68] max-w-[68ch]">
                  {content.hero.summary}
                </p>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#projects"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-2"
                >
                  <span>{content.hero.primaryCta}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="#contact"
                  className="px-5 py-2.5 text-sm font-medium text-slate-900 border border-slate-900/20 rounded-lg hover:bg-white transition-colors whitespace-nowrap shrink-0"
                >
                  {content.hero.secondaryCta}
                </a>
                <button
                  type="button"
                  onClick={() => setShowAssistantModal(true)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-900 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-2 cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-[#2563EB]" />
                  <span>{content.assistant.openButton}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(content.meta.academicEmail, 'hero-email')}
                  className="px-4 py-2.5 text-xs font-mono-tabular text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-2 cursor-pointer"
                >
                  {copiedField === 'hero-email' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-emerald-700">{content.contactSection.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{content.meta.academicEmail}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quantitative Rigor & Proof Strip (Hairline grid, zero pill boxes) */}
              <div className="pt-8 border-t border-slate-900/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {content.hero.metrics.map((metric, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-2xl font-semibold tracking-tight text-slate-900 font-mono-tabular">
                      {metric.value}
                    </div>
                    <div className="text-sm font-semibold text-slate-800">{metric.label}</div>
                    <div className="text-xs text-slate-600 leading-relaxed">{metric.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Editorial Spatial Dossier & Geospatial Interactive Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-900/10 rounded-2xl p-6 sm:p-7 space-y-6">
                {/* Dossier Header */}
                <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-900/8">
                  <div className="space-y-1">
                    <div className="text-xs text-slate-500 font-mono-tabular">
                      {lang === 'fr' ? 'Profil' : 'Profile'}
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900">{content.meta.name}</h2>
                    <p className="text-xs text-slate-600">{content.meta.shortTitle}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif-editorial italic text-2xl shrink-0 select-none">
                    AB
                  </div>
                </div>

                {/* Spatial Telemetry & Coordinates Visual Map Canvas */}
                <div className="relative rounded-xl overflow-hidden bg-slate-950 text-white p-5 border border-slate-800">
                  {/* Topographic SVG Contour Backdrop */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
                    viewBox="0 0 400 220"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M-20 40 C 80 10, 160 90, 260 50 C 340 20, 390 80, 440 60"
                      stroke="#60A5FA"
                      strokeWidth="1"
                    />
                    <path
                      d="M-20 85 C 90 55, 180 135, 280 95 C 350 65, 390 120, 440 100"
                      stroke="#60A5FA"
                      strokeWidth="1"
                    />
                    <path
                      d="M-20 130 C 110 100, 190 180, 290 140 C 360 110, 400 165, 440 145"
                      stroke="#34D399"
                      strokeWidth="1"
                    />
                    <path
                      d="M-20 175 C 120 145, 210 215, 310 185 C 370 155, 410 200, 440 190"
                      stroke="#34D399"
                      strokeWidth="1"
                    />
                    <circle cx="285" cy="95" r="4" fill="#60A5FA" />
                    <circle cx="285" cy="95" r="14" stroke="#60A5FA" strokeWidth="1" strokeDasharray="3 3" />
                  </svg>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-mono-tabular text-slate-300">
                      <span>UNIVERSITÉ DE SHERBROOKE · MITACS</span>
                      <span>NAD83 / MTM Zone 7</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-blue-300 font-mono-tabular">
                        {lang === 'fr' ? 'Domaines' : 'Focus'}
                      </div>
                      <div className="text-base font-semibold tracking-wide text-white">
                        {lang === 'fr'
                          ? 'SIG, télédétection et IA appliquée (RAG)'
                          : 'GIS, remote sensing and applied AI (RAG)'}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 font-mono-tabular">
                      <span>ArcGIS Pro · QGIS · PostGIS</span>
                      <span>·</span>
                      <span>LangChain · OpenAI · Python</span>
                    </div>
                  </div>
                </div>

                {/* Key Dossier Facts (Unboxed clean rows) */}
                <dl className="space-y-3 text-sm">
                  <div className="flex items-baseline justify-between gap-4 py-1.5 border-b border-slate-900/6">
                    <dt className="text-slate-500">{lang === 'fr' ? 'Localisation' : 'Location'}</dt>
                    <dd className="font-medium text-slate-900 text-right">{content.meta.location}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-1.5 border-b border-slate-900/6">
                    <dt className="text-slate-500">{lang === 'fr' ? 'Formation actuelle' : 'Current Degree'}</dt>
                    <dd className="font-medium text-slate-900 text-right">
                      {lang === 'fr' ? 'M.Sc. Géomatique & Télédétection (UdeS)' : 'M.Sc. Geomatics & Remote Sensing (UdeS)'}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-1.5 border-b border-slate-900/6">
                    <dt className="text-slate-500">{lang === 'fr' ? 'Disponibilité' : 'Availability'}</dt>
                    <dd className="font-medium text-emerald-800 text-right">{content.meta.workModes}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-1.5">
                    <dt className="text-slate-500">{lang === 'fr' ? 'Téléphone direct' : 'Direct Phone'}</dt>
                    <dd className="font-mono-tabular font-medium text-slate-900 text-right">
                      <a href="tel:+18199939777" className="hover:text-[#2563EB] transition-colors">
                        {content.meta.phone}
                      </a>
                    </dd>
                  </div>
                </dl>

                {/* Direct Assistant Trigger inside Dossier */}
                <button
                  type="button"
                  onClick={() => setShowAssistantModal(true)}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-[#2563EB] text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-blue-300" />
                  <span>{content.assistant.openButton}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Subtle Editorial Marquee Divider (per Portfolio Reference 2.B) */}
        <div className="border-y border-slate-900/10 bg-[#EAEAE4] py-3.5 overflow-hidden select-none">
          <div className="animate-marquee flex items-center gap-8 text-xs font-mono-tabular text-slate-700">
            {[...content.marquee, ...content.marquee].map((item, idx) => (
              <React.Fragment key={idx}>
                <span className="whitespace-nowrap">{item}</span>
                <span className="text-slate-400" aria-hidden="true">
                  ·
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Geospatial lab: interactive career globe + spectral slider */}
        <GeoLab lang={lang} />

        {/* 01. Selected Case Studies & Bento Grid */}
        <section id="projects" className="max-w-[1280px] mx-auto px-6 py-20 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-mono-tabular text-[#2563EB]">{content.projectsSection.index}</div>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                {content.projectsSection.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {content.projectsSection.subtitle}
              </p>
            </div>

            {/* Interactive Segmented Filter Control */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start max-w-full overflow-x-auto">
              <button
                type="button"
                onClick={() => setProjectFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  projectFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {content.projectsSection.filterAll}
              </button>
              <button
                type="button"
                onClick={() => setProjectFilter('ai')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  projectFilter === 'ai'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {content.projectsSection.filterAi}
              </button>
              <button
                type="button"
                onClick={() => setProjectFilter('gis')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  projectFilter === 'gis'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {content.projectsSection.filterGis}
              </button>
              <button
                type="button"
                onClick={() => setProjectFilter('dev')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  projectFilter === 'dev'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {content.projectsSection.filterDev}
              </button>
            </div>
          </div>

          {/* Bento Box Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {filteredProjects.map((project) => {
              const isFeatured = project.featured && projectFilter === 'all';
              return (
                <article
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`group bg-white border border-slate-900/10 rounded-2xl overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer flex flex-col ${
                    isFeatured ? 'lg:col-span-12 lg:grid lg:grid-cols-12' : 'lg:col-span-6'
                  }`}
                >
                  {/* Media Container with Resilient Fallback */}
                  <div
                    className={`relative overflow-hidden bg-slate-900 ${
                      isFeatured ? 'lg:col-span-7 min-h-[280px] sm:min-h-[360px]' : 'aspect-[16/10]'
                    }`}
                  >
                    {!imageErrors[project.id] ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(project.id)}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white">
                        <Layers className="w-10 h-10 text-blue-400 mb-3" />
                        <span className="text-sm font-medium text-center">{project.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs text-white/90 font-mono-tabular">
                      <span>{project.organization}</span>
                      <span>{project.coordinates}</span>
                    </div>
                  </div>

                  {/* Editorial Content Container */}
                  <div
                    className={`p-6 sm:p-8 flex flex-col justify-between gap-6 ${
                      isFeatured ? 'lg:col-span-5' : 'flex-1'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Unboxed Metadata Kicker (Zero-Pill Discipline) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono-tabular">
                        <span className="font-semibold text-[#2563EB]">{project.index}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.period}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed">{project.summary}</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-900/8">
                      {/* Unboxed Tech Stack with typographic middots */}
                      <div className="text-xs text-slate-500 font-mono-tabular leading-relaxed">
                        {project.stack.join(' · ')}
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                        <span>{content.projectsSection.inspectLabel}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 02. Professional Experience Timeline */}
        <section id="experience" className="bg-white border-y border-slate-900/10 py-20 md:py-24">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div className="space-y-2 max-w-2xl">
                <div className="text-xs font-mono-tabular text-[#2563EB]">{content.experienceSection.index}</div>
                <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                  {content.experienceSection.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {content.experienceSection.subtitle}
                </p>
              </div>

              {/* Experience Domain Filter */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start max-w-full overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setExperienceFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    experienceFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {content.projectsSection.filterAll}
                </button>
                <button
                  type="button"
                  onClick={() => setExperienceFilter('ai')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    experienceFilter === 'ai'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {content.projectsSection.filterAi}
                </button>
                <button
                  type="button"
                  onClick={() => setExperienceFilter('gis')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    experienceFilter === 'gis'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {content.projectsSection.filterGis}
                </button>
                <button
                  type="button"
                  onClick={() => setExperienceFilter('dev')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    experienceFilter === 'dev'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {content.projectsSection.filterDev}
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-900/10">
              {filteredExperiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="py-10 first:pt-0 last:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start"
                >
                  {/* Left Column: Period, Location & Role Type */}
                  <div className="lg:col-span-4 space-y-1.5">
                    <div className="text-sm font-mono-tabular font-semibold text-slate-900">
                      0{idx + 1} · {exp.period}
                    </div>
                    <div className="text-sm font-medium text-slate-800">{exp.organization}</div>
                    <div className="text-xs text-slate-500">
                      {exp.location} · {exp.type}
                    </div>
                  </div>

                  {/* Right Column: Role Title, Achievements & Unboxed Stack */}
                  <div className="lg:col-span-8 space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900">{exp.role}</h3>
                    <ul className="space-y-2.5 text-[15px] text-slate-700 leading-relaxed">
                      {exp.highlights.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-3">
                          <span className="text-[#2563EB] font-mono-tabular select-none mt-1 text-xs">
                            —
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 text-xs font-mono-tabular text-slate-500">
                      {exp.technologies.join(' · ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03. Technical & Analytical Competence Matrix */}
        <section id="skills" className="max-w-[1280px] mx-auto px-6 py-20 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-mono-tabular text-[#2563EB]">{content.skillsSection.index}</div>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                {content.skillsSection.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {content.skillsSection.subtitle}
              </p>
            </div>

            {/* Search Filter Input */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder={content.skillsSection.searchPlaceholder}
                className="w-full pl-10 pr-8 py-2 text-xs bg-white border border-slate-900/15 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
              />
              {skillSearch && (
                <button
                  type="button"
                  onClick={() => setSkillSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredSkillGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white border border-slate-900/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-900/8">
                    <h3 className="text-lg font-semibold text-slate-900">{group.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{group.subtitle}</p>
                  </div>

                  <div className="divide-y divide-slate-900/6">
                    {group.items.map((skill, sIdx) => (
                      <div key={sIdx} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-sm font-semibold text-slate-900">{skill.name}</span>
                          <span className="text-xs font-mono-tabular text-[#2563EB] shrink-0">
                            {skill.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{skill.context}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 04. Education & Academic Foundation */}
        <section id="education" className="bg-white border-y border-slate-900/10 py-20 md:py-24">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="space-y-2 max-w-2xl mb-14">
              <div className="text-xs font-mono-tabular text-[#2563EB]">{content.educationSection.index}</div>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                {content.educationSection.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {content.educationSection.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.education.map((edu, idx) => (
                <div
                  key={edu.id}
                  className="bg-[#F4F4F0] border border-slate-900/10 rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-600">
                      <span>0{idx + 1} · {edu.period}</span>
                      <span>{edu.coordinates}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 leading-snug">{edu.degree}</h3>
                    <div className="text-sm font-medium text-[#2563EB]">{edu.institution}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{edu.focus}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-900/8 text-xs text-slate-500 font-mono-tabular">
                    {edu.location}
                  </div>
                </div>
              ))}
            </div>

            {/* Interests Bar (Unboxed clean typography) */}
            <div className="mt-12 pt-8 border-t border-slate-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-800">
                {content.educationSection.interestsTitle}
              </span>
              <div className="text-xs text-slate-600 font-mono-tabular">
                {content.educationSection.interests.join(' · ')}
              </div>
            </div>
          </div>
        </section>

        {/* Research work, thesis and certificates */}
        <Publications content={content} lang={lang} />

        {/* 05. Direct Contact & Recruitment Inquiry */}
        <section id="contact" className="max-w-[1280px] mx-auto px-6 py-20 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Direct Coordinates */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <div className="text-xs font-mono-tabular text-[#2563EB]">{content.contactSection.index}</div>
                <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                  {content.contactSection.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {content.contactSection.subtitle}
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Academic Email Card */}
                <div className="bg-white border border-slate-900/10 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">
                      {lang === 'fr' ? 'Courriel universitaire (UdeS)' : 'University Email (UdeS)'}
                    </div>
                    <a
                      href={`mailto:${content.meta.academicEmail}`}
                      className="text-sm font-mono-tabular font-semibold text-slate-900 hover:text-[#2563EB] truncate block"
                    >
                      {content.meta.academicEmail}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(content.meta.academicEmail, 'contact-udes')}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedField === 'contact-udes'
                      ? content.contactSection.copied
                      : content.contactSection.copyEmail}
                  </button>
                </div>

                {/* Personal Email Card */}
                <div className="bg-white border border-slate-900/10 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">
                      {lang === 'fr' ? 'Courriel direct' : 'Direct Email'}
                    </div>
                    <a
                      href={`mailto:${content.meta.personalEmail}`}
                      className="text-sm font-mono-tabular font-semibold text-slate-900 hover:text-[#2563EB] truncate block"
                    >
                      {content.meta.personalEmail}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(content.meta.personalEmail, 'contact-gmail')}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedField === 'contact-gmail'
                      ? content.contactSection.copied
                      : content.contactSection.copyEmail}
                  </button>
                </div>

                {/* Phone Card */}
                <div className="bg-white border border-slate-900/10 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">
                      {lang === 'fr' ? 'Téléphone — Sherbrooke, QC' : 'Phone — Sherbrooke, QC'}
                    </div>
                    <a
                      href="tel:+18199939777"
                      className="text-sm font-mono-tabular font-semibold text-slate-900 hover:text-[#2563EB] block"
                    >
                      {content.meta.phone}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(content.meta.phone, 'contact-phone')}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedField === 'contact-phone'
                      ? content.contactSection.copied
                      : content.contactSection.copyPhone}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Mail Composer */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleComposeMail}
                className="bg-white border border-slate-900/10 rounded-2xl p-6 sm:p-8 space-y-5"
              >
                <h3 className="text-lg font-semibold text-slate-900">{content.contactSection.formTitle}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="sender-name" className="block text-xs font-medium text-slate-700">
                      {content.contactSection.nameLabel}
                    </label>
                    <input
                      id="sender-name"
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Ex. Marie Tremblay"
                      className="w-full px-3.5 py-2 text-sm bg-[#F4F4F0]/60 border border-slate-900/15 rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="sender-org" className="block text-xs font-medium text-slate-700">
                      {content.contactSection.orgLabel}
                    </label>
                    <input
                      id="sender-org"
                      type="text"
                      value={senderOrg}
                      onChange={(e) => setSenderOrg(e.target.value)}
                      placeholder="Ex. Ministère / Bureau d’ingénierie"
                      className="w-full px-3.5 py-2 text-sm bg-[#F4F4F0]/60 border border-slate-900/15 rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="role-mode" className="block text-xs font-medium text-slate-700">
                    {content.contactSection.modeLabel}
                  </label>
                  <select
                    id="role-mode"
                    value={roleMode}
                    onChange={(e) => setRoleMode(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-[#F4F4F0]/60 border border-slate-900/15 rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    {content.contactSection.modes.map((mode, idx) => (
                      <option key={idx} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message-body" className="block text-xs font-medium text-slate-700">
                    {content.contactSection.messageLabel}
                  </label>
                  <textarea
                    id="message-body"
                    rows={4}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder={content.contactSection.messagePlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F4F4F0]/60 border border-slate-900/15 rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 font-mono-tabular">
                    {content.meta.academicEmail}
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{content.contactSection.sendMailCta}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-slate-900/10 bg-[#EAEAE4] py-8 no-print">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            © {new Date().getFullYear()} {content.meta.name} · {content.meta.location}
          </div>
          <div className="flex items-center gap-4 font-mono-tabular">
            <a href={`mailto:${content.meta.academicEmail}`} className="hover:text-slate-900">
              {content.meta.academicEmail}
            </a>
            <span aria-hidden="true">·</span>
            <a href="tel:+18199939777" className="hover:text-slate-900">
              {content.meta.phone}
            </a>
            <span aria-hidden="true">·</span>
            <a href="https://github.com/akremben" target="_blank" rel="me noopener" className="hover:text-slate-900">
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Case Study Lightbox / Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white border border-slate-900/10 rounded-2xl max-w-3xl w-full overflow-hidden my-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 sm:h-72 bg-slate-900">
              {!imageErrors[selectedProject.id] ? (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(selectedProject.id)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                  <Layers className="w-10 h-10 text-blue-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-medium hover:bg-black transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{content.projectsSection.closeModal}</span>
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
                <div className="text-xs font-mono-tabular text-blue-300">
                  {selectedProject.organization} · {selectedProject.period}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold">{selectedProject.title}</h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
              <div className="space-y-2">
                <h4 className="text-xs font-mono-tabular font-semibold text-[#2563EB]">
                  {content.projectsSection.modalChallenge}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedProject.challenge}</p>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-mono-tabular font-semibold text-[#2563EB]">
                  {content.projectsSection.modalArchitecture}
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  {selectedProject.architecture.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-mono-tabular text-xs text-slate-400 mt-0.5">0{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-mono-tabular font-semibold text-emerald-700">
                  {content.projectsSection.modalOutcomes}
                </h4>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {selectedProject.outcomes.map((out, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-900/10 space-y-1.5">
                <div className="text-xs font-mono-tabular text-slate-500">
                  {content.projectsSection.modalStack}
                </div>
                <div className="text-xs font-mono-tabular text-slate-800">
                  {selectedProject.stack.join(' · ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable One-Page Standard CV Preview Modal */}
      {showPrintModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowPrintModal(false)}
        >
          <div
            className="bg-white border border-slate-900/10 rounded-2xl max-w-4xl w-full overflow-hidden my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Toolbar */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4">
              <div className="text-sm font-medium">
                {lang === 'fr'
                  ? 'Aperçu officiel du CV — Format A4 / Lettre prêt à imprimer'
                  : 'Official CV Sheet — Print-Ready A4 / Letter Format'}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={triggerPrint}
                  className="px-4 py-1.5 text-xs font-medium bg-[#2563EB] text-white rounded-lg hover:bg-blue-500 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === 'fr' ? 'Imprimer / Enregistrer en PDF' : 'Print / Save as PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 text-slate-300 hover:text-white cursor-pointer"
                  aria-label="Close CV preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Clean Printable CV Sheet inside Modal */}
            <div className="p-8 sm:p-12 max-h-[80vh] overflow-y-auto space-y-6 text-slate-900">
              <div className="border-b-2 border-slate-900 pb-4">
                <h2 className="text-2xl font-bold tracking-tight">AKREM BENCHIHA</h2>
                <p className="text-sm font-medium text-[#2563EB] mt-0.5">{content.meta.title}</p>
                <p className="text-xs text-slate-600 mt-1.5 font-mono-tabular">
                  Sherbrooke, QC | {content.meta.academicEmail} | {content.meta.phone} | {content.meta.availability}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-wider text-[#2563EB] border-b border-slate-300 pb-1 mb-2">
                  {lang === 'fr' ? 'PROFIL PROFESSIONNEL' : 'PROFESSIONAL PROFILE'}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">{content.hero.summary}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-wider text-[#2563EB] border-b border-slate-300 pb-1 mb-2">
                  {lang === 'fr' ? 'COMPÉTENCES CLÉS' : 'CORE COMPETENCIES'}
                </h3>
                <div className="space-y-1 text-xs text-slate-800">
                  <div>
                    <strong>SIG & télédétection :</strong> ArcGIS Pro, QGIS, GeoServer, PostGIS, analyse géostatistique, traitement d’images satellite, modélisation spatiale
                  </div>
                  <div>
                    <strong>Intelligence artificielle & NLP :</strong> LangChain, OpenAI API, architectures RAG, embeddings vectoriels, agents conversationnels
                  </div>
                  <div>
                    <strong>Programmation :</strong> Python, Java, C, SQL, HTML/CSS
                  </div>
                  <div>
                    <strong>Bases de données :</strong> MySQL, MongoDB Atlas, PgAdmin, Neo4j
                  </div>
                  <div>
                    <strong>Développement web & systèmes distribués :</strong> cartographie web interactive, fog/edge computing et IoT (simulation iFogSim)
                  </div>
                  <div>
                    <strong>Outils :</strong> Git, Linux, Excel, Word, PowerPoint, Access
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-wider text-[#2563EB] border-b border-slate-300 pb-1 mb-3">
                  {lang === 'fr' ? 'EXPÉRIENCE PROFESSIONNELLE' : 'PROFESSIONAL EXPERIENCE'}
                </h3>
                <div className="space-y-4">
                  {content.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex items-baseline justify-between text-xs">
                        <strong className="text-slate-900">{exp.role}</strong>
                        <span className="font-mono-tabular text-slate-600">{exp.period}</span>
                      </div>
                      <div className="text-xs italic text-slate-600">
                        {exp.organization} — {exp.location}
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5 pt-0.5">
                        {exp.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-wider text-[#2563EB] border-b border-slate-300 pb-1 mb-2">
                  {lang === 'fr' ? 'FORMATION' : 'EDUCATION'}
                </h3>
                <div className="space-y-2">
                  {content.education.map((edu) => (
                    <div key={edu.id} className="flex items-baseline justify-between text-xs">
                      <div>
                        <strong className="text-slate-900">{edu.degree}</strong> —{' '}
                        <span className="italic text-slate-600">
                          {edu.institution}, {edu.location}
                        </span>
                      </div>
                      <span className="font-mono-tabular text-slate-600 shrink-0">{edu.period}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for AI Assistant */}
      <aside aria-label="AI Assistant Quick Access" className="fixed bottom-6 right-6 z-40 no-print">
        <button
          type="button"
          onClick={() => setShowAssistantModal(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          aria-label={content.assistant.openButton}
        >
          <div className="relative">
            <Bot className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap hidden sm:inline">
            {content.assistant.badge}
          </span>
        </button>
      </aside>

      {/* AI Assistant Modal Dialog */}
      {showAssistantModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-print"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowAssistantModal(false)}
        >
          <div
            className="bg-white border border-slate-900/10 rounded-2xl max-w-2xl w-full flex flex-col h-[85vh] sm:h-[620px] shadow-2xl overflow-hidden my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight">{content.assistant.modalTitle}</h3>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{content.assistant.modalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAssistantModal(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Fermer l'assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Message Scrollable Container */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F8F8F6]">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col justify-between py-2 space-y-6">
                  {/* Empty state greeting */}
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{content.assistant.badge}</span>
                    </div>
                    <h4 className="text-base font-semibold text-slate-900">
                      {content.assistant.emptyGreeting}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {content.assistant.emptyDescription}
                    </p>
                  </div>

                  {/* Suggested Quick Questions */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {content.assistant.quickPromptsLabel}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {content.assistant.quickPrompts.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleSendAssistantMessage(prompt)}
                          className="text-left p-2.5 text-xs text-slate-700 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all cursor-pointer group"
                        >
                          <span className="group-hover:text-blue-700 font-medium">{prompt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-md bg-slate-900 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-[#2563EB] text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}

                  {isAssistantThinking && (
                    <div className="flex gap-3 justify-start items-center text-xs text-slate-500">
                      <div className="w-7 h-7 rounded-md bg-slate-900 text-blue-400 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-xs">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                        <span className="font-mono-tabular text-slate-600">
                          {content.assistant.thinkingText}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Bar Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAssistantMessage();
              }}
              className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0 space-y-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  aria-label={content.assistant.inputPlaceholder}
                  maxLength={500}
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  placeholder={content.assistant.inputPlaceholder}
                  disabled={isAssistantThinking}
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#F4F4F0] border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isAssistantThinking || !assistantInput.trim()}
                  className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{content.assistant.sendButton}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-tabular px-1">
                <span>{content.assistant.disclaimer}</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Print-Only Layout (renders when user presses Ctrl+P or Print button) */}
      <div className="hidden print-only p-8 space-y-5 text-black bg-white">
        <div className="border-b-2 border-black pb-3">
          <div className="text-2xl font-bold">AKREM BENCHIHA</div>
          <p className="text-sm font-semibold">{content.meta.title}</p>
          <p className="text-xs mt-1">
            Sherbrooke, QC | {content.meta.academicEmail} | {content.meta.phone} | {content.meta.availability}
          </p>
        </div>
        <div>
          <h2 className="text-xs font-bold border-b border-black pb-1 mb-1.5">PROFIL PROFESSIONNEL</h2>
          <p className="text-xs leading-relaxed">{content.hero.summary}</p>
        </div>
        <div>
          <h2 className="text-xs font-bold border-b border-black pb-1 mb-1.5">COMPÉTENCES CLÉS</h2>
          <p className="text-xs leading-relaxed">
            SIG & Télédétection : ArcGIS Pro, QGIS, GeoServer, PostGIS, analyse géostatistique, traitement d’images satellite, modélisation spatiale · IA & NLP : LangChain, OpenAI API, RAG, embeddings vectoriels, agents conversationnels · Programmation : Python, Java, C, SQL, HTML/CSS · Bases de données : MySQL, MongoDB Atlas, PgAdmin, Neo4j · Web & systèmes distribués : cartographie web interactive, fog/edge computing et IoT (simulation iFogSim).
          </p>
        </div>
        <div>
          <h2 className="text-xs font-bold border-b border-black pb-1 mb-2">EXPÉRIENCE PROFESSIONNELLE</h2>
          <div className="space-y-3">
            {content.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between text-xs font-bold">
                  <span>{exp.role}</span>
                  <span>{exp.period}</span>
                </div>
                <div className="text-xs italic">
                  {exp.organization} — {exp.location}
                </div>
                <ul className="list-disc list-inside text-xs space-y-0.5 mt-1">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xs font-bold border-b border-black pb-1 mb-2">FORMATION</h2>
          <div className="space-y-1.5">
            {content.education.map((edu) => (
              <div key={edu.id} className="flex justify-between text-xs">
                <span>
                  <strong>{edu.degree}</strong> — {edu.institution} ({edu.location})
                </span>
                <span>{edu.period}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
