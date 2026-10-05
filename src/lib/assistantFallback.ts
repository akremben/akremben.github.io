import type { Language } from '../data/cvData';
import { SYSTEM_INSTRUCTION } from '../data/assistantProfile';

type Turn = { role: 'user' | 'assistant'; content: string };

const EMAIL = 'akrem.benchiha@usherbrooke.ca';
const PHONE = '(819) 993-9777';

/* ------------------------------------------------------------------ */
/* 1. Claude, when the page is opened inside a claude.ai viewer        */
/* ------------------------------------------------------------------ */
let samplePromise: Promise<any> | null = null;
function getSample(): Promise<any> {
  if (!samplePromise) {
    const c = (window as any).claude;
    samplePromise = c && typeof c.use === 'function' ? c.use('sample').catch(() => null) : Promise.resolve(null);
  }
  return samplePromise as Promise<any>;
}
let sampleDisabled = false;

export async function askClaude(history: Turn[], question: string, lang: Language): Promise<string | null> {
  if (sampleDisabled) return null;
  const sample = await getSample();
  if (!sample) return null;
  const convo = history
    .slice(-8, -1)
    .map((t) => `${t.role === 'user' ? 'Visiteur' : 'Assistant'} : ${t.content}`)
    .join('\n');
  const prompt =
    `${SYSTEM_INSTRUCTION}\n\nConsignes supplémentaires : réponds en ${lang === 'fr' ? 'français' : 'anglais'}, en 1 à 5 phrases, texte simple sans markdown.` +
    (convo ? `\n\nCONVERSATION :\n${convo}` : '') +
    `\n\nQuestion du visiteur : ${question}\n\nRéponse :`;
  try {
    const { text } = await sample(prompt, { modelTier: 'quick', cache: false });
    return text?.trim() || null;
  } catch (e: any) {
    if (e?.code === 'not_granted' || e?.code === 'unavailable') sampleDisabled = true;
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* 2. Built-in answers from the CV, always available                   */
/* ------------------------------------------------------------------ */
const A: Record<string, Record<Language, string>> = {
  contact: {
    fr: `Vous pouvez joindre Akrem par courriel à ${EMAIL} (ou akrembenchiha@gmail.com) ou par téléphone au ${PHONE}. Il est basé à Sherbrooke, au Québec.`,
    en: `You can reach Akrem by email at ${EMAIL} (or akrembenchiha@gmail.com) or by phone at ${PHONE}. He is based in Sherbrooke, Québec.`,
  },
  avail: {
    fr: 'Akrem termine sa maîtrise en géomatique appliquée et télédétection à l’Université de Sherbrooke et est disponible pour un poste à temps plein, en présentiel (Sherbrooke, Québec, Montréal), en mode hybride ou en télétravail.',
    en: 'Akrem is completing his master’s in applied geomatics and remote sensing at Université de Sherbrooke and is available for a full-time role, on site (Sherbrooke, Québec City, Montréal), hybrid or remote.',
  },
  ai: {
    fr: 'Pendant son stage Mitacs chez T2 Environnement (mai 2025 à janv. 2026), Akrem a conçu une plateforme d’aide à la décision environnementale : base de connaissances vectorielle (rapports, diagnostics, données géospatiales, publications), agent conversationnel RAG avec LLM et interface web associant chatbot et carte. Il était supervisé par les professeurs Germain, Foucher et Bouroubi. Outils : Python, LangChain, OpenAI API, PostGIS, QGIS.',
    en: 'During his Mitacs internship with T2 Environnement (May 2025 to Jan. 2026), Akrem designed an environmental decision-support platform: a vector knowledge base (reports, site assessments, geospatial data, papers), a RAG conversational agent using an LLM, and a web interface combining a chatbot and a map. He was supervised by Professors Germain, Foucher and Bouroubi. Tools: Python, LangChain, OpenAI API, PostGIS, QGIS.',
  },
  parking: {
    fr: 'Pour son mémoire de master (2022–2023, en binôme), Akrem a conçu une architecture de stationnement intelligent basée sur le fog computing, avec détection des places par caméras. Simulée avec iFogSim, elle réduit la latence, l’usage du réseau, le temps d’exécution et la consommation d’énergie par rapport au cloud.',
    en: 'For his master’s thesis (2022–2023, two-person project), Akrem designed a fog-computing smart parking architecture with camera-based spot detection. Simulated in iFogSim, it reduced latency, network usage, execution time and energy use compared with the cloud.',
  },
  drone: {
    fr: 'Akrem a suivi la formation « Drones et télédétection environnementale » de l’Université de Sherbrooke (15 heures, mai 2026) : capteurs (optique, LiDAR, multispectral, thermique), réglementation de Transports Canada, planification de missions et traitement d’imagerie.',
    en: 'Akrem completed the “Drones and environmental remote sensing” training at Université de Sherbrooke (15 hours, May 2026): sensors (optical, LiDAR, multispectral, thermal), Transport Canada regulations, mission planning and image processing.',
  },
  gis: {
    fr: 'En SIG et télédétection, Akrem utilise ArcGIS Pro, QGIS, GeoServer et PostGIS, avec de l’analyse géostatistique, du traitement d’images satellites, de la modélisation spatiale et de la cartographie thématique. Au bureau BILC (2019–2020), il a produit des cartes de risques naturels et des études de géomarketing.',
    en: 'In GIS and remote sensing, Akrem uses ArcGIS Pro, QGIS, GeoServer and PostGIS, with geostatistics, satellite image processing, spatial modelling and thematic mapping. At the BILC office (2019–2020) he produced natural-hazard maps and geomarketing studies.',
  },
  tech: {
    fr: 'Langages : Python, Java, C, SQL, HTML/CSS. Bases de données : PostgreSQL/PostGIS, MySQL, MongoDB Atlas, Neo4j. IA : LangChain, OpenAI API, RAG, embeddings vectoriels, agents conversationnels. Outils : Git, Linux.',
    en: 'Languages: Python, Java, C, SQL, HTML/CSS. Databases: PostgreSQL/PostGIS, MySQL, MongoDB Atlas, Neo4j. AI: LangChain, OpenAI API, RAG, vector embeddings, conversational agents. Tools: Git, Linux.',
  },
  edu: {
    fr: 'Maîtrise en géomatique appliquée et télédétection, Université de Sherbrooke (2024–2026) ; master en réseaux, systèmes et sécurité de l’information (2021–2023) et licence en systèmes informatiques (2018–2021), Université Djillali Liabès, Algérie.',
    en: 'Master’s in applied geomatics and remote sensing, Université de Sherbrooke (2024–2026); master’s in networks, systems and information security (2021–2023) and bachelor’s in computer systems (2018–2021), Djillali Liabès University, Algeria.',
  },
  exp: {
    fr: 'Parcours : stage de recherche Mitacs en IA pour l’environnement chez T2 Environnement (2025–2026), mémoire de master en fog computing (2022–2023), stage de développement web (2020–2021) et stage SIG au bureau d’ingénierie BILC (2019–2020).',
    en: 'Background: Mitacs research internship in AI for the environment at T2 Environnement (2025–2026), master’s thesis on fog computing (2022–2023), web development internship (2020–2021) and GIS internship at the BILC engineering office (2019–2020).',
  },
  hobby: {
    fr: 'En dehors du travail : randonnée, natation, football et veille technologique en GeoAI.',
    en: 'Outside work: hiking, swimming, football and keeping up with GeoAI.',
  },
  about: {
    fr: 'Akrem Benchiha est spécialisé en géomatique, télédétection et IA appliquée (RAG, LLM, cartographie web). Posez-moi une question sur son projet chez T2 Environnement, ses compétences, sa formation, sa disponibilité ou ses coordonnées.',
    en: 'Akrem Benchiha specializes in geomatics, remote sensing and applied AI (RAG, LLMs, web mapping). Ask me about his T2 Environnement project, skills, education, availability or contact details.',
  },
};

const RULES: [string, RegExp][] = [
  ['contact', /(t[ée]l[ée]phone|phone|num[ée]ro|number|appel|call|joindre|contact|reach|e-?mail|courriel|coordonn)/],
  ['avail', /(dispon|availab|temps plein|full.?time|t[ée]l[ée]travail|remote|hybride|hybrid|embauch|hire|start|commenc)/],
  ['drone', /(drone|lidar|uav|attestation|certif|formation continue)/],
  ['parking', /(parking|stationnement|fog|ifogsim|edge|m[ée]moire de master|thesis)/],
  ['ai', /(\bia\b|\bai\b|intelligence|rag|llm|mitacs|t2|chatbot|langchain|nlp|agent|openai|gpt)/],
  ['gis', /(\bsig\b|\bgis\b|arcgis|qgis|t[ée]l[ée]d[ée]tection|remote sensing|satellite|carto|\bmap|geoserver|postgis|g[ée]omarketing|risque|hazard)/],
  ['tech', /(langage|language|programm|python|java|sql|base de donn|database|mongo|neo4j|outil|tool|stack|techno)/],
  ['edu', /(formation|[ée]tud|educat|dipl[oô]m|degree|universit|ma[iî]trise|master|licence|bachelor)/],
  ['hobby', /(loisir|hobb|sport|int[ée]r[eê]t|interest|randonn|hik|natation|swim|football)/],
  ['exp', /(exp[ée]r|parcours|career|travail|work|stage|intern|projet|project)/],
];

export function localAnswer(question: string, lang: Language): string {
  const q = question.toLowerCase();
  for (const [key, re] of RULES) if (re.test(q)) return A[key][lang];
  return A.about[lang];
}
