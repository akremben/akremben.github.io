export type Language = 'fr' | 'en';

export type SkillCategory = 'all' | 'gis' | 'ai' | 'dev' | 'data';

export interface ProjectCaseStudy {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  organization: string;
  location: string;
  period: string;
  category: SkillCategory;
  categoryLabel: string;
  featured: boolean;
  image: string;
  coordinates: string;
  summary: string;
  challenge: string;
  architecture: string[];
  outcomes: string[];
  stack: string[];
  role?: string;
  projectObjective?: string;
  shortDescription?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  type: string;
  category: SkillCategory;
  highlights: string[];
  technologies: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  institution: string;
  location: string;
  date: string;
  duration: string;
  director: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  focus: string;
  coordinates: string;
  thesisTitle?: string;
  thesisRole?: string;
  thesisDescription?: string;
}

export interface SkillGroup {
  id: SkillCategory;
  title: string;
  subtitle: string;
  items: {
    name: string;
    context: string;
    level: string;
  }[];
}

export interface CVContent {
  meta: {
    name: string;
    title: string;
    shortTitle: string;
    location: string;
    coordinates: string;
    academicEmail: string;
    personalEmail: string;
    phone: string;
    availability: string;
    workModes: string;
    status: string;
  };
  nav: {
    projects: string;
    experience: string;
    skills: string;
    education: string;
    contact: string;
    printCv: string;
  };
  hero: {
    kicker: string;
    headlineMain: string;
    headlineSerif: string;
    summary: string;
    primaryCta: string;
    secondaryCta: string;
    metrics: {
      value: string;
      label: string;
      detail: string;
    }[];
  };
  marquee: string[];
  projectsSection: {
    index: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterGis: string;
    filterAi: string;
    filterDev: string;
    inspectLabel: string;
    modalChallenge: string;
    modalArchitecture: string;
    modalOutcomes: string;
    modalStack: string;
    closeModal: string;
  };
  projects: ProjectCaseStudy[];
  experienceSection: {
    index: string;
    title: string;
    subtitle: string;
  };
  experiences: ExperienceItem[];
  skillsSection: {
    index: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
  };
  skillGroups: SkillGroup[];
  educationSection: {
    index: string;
    title: string;
    subtitle: string;
    interestsTitle: string;
    interests: string[];
    certificationsTitle: string;
    certifications: CertificationItem[];
    memoireLabel: string;
  };
  education: EducationItem[];
  contactSection: {
    index: string;
    title: string;
    subtitle: string;
    copyEmail: string;
    copied: string;
    copyPhone: string;
    formTitle: string;
    nameLabel: string;
    orgLabel: string;
    modeLabel: string;
    modes: string[];
    messageLabel: string;
    messagePlaceholder: string;
    sendMailCta: string;
  };
  assistant: {
    badge: string;
    modalTitle: string;
    modalSubtitle: string;
    openButton: string;
    quickPromptsLabel: string;
    quickPrompts: string[];
    inputPlaceholder: string;
    sendButton: string;
    thinkingText: string;
    emptyGreeting: string;
    emptyDescription: string;
    disclaimer: string;
    errorUnavailable: string;
  };
}

export const CV_DATA: Record<Language, CVContent> = {
  fr: {
    meta: {
      name: 'Akrem Benchiha',
      title: 'Géomatique, télédétection et intelligence artificielle appliquée',
      shortTitle: 'Géomatique · Télédétection · IA Appliquée',
      location: 'Sherbrooke, QC, Canada',
      coordinates: '45.3780° N, 71.9280° W',
      academicEmail: 'akrembenchiha@usherbrooke.ca',
      personalEmail: 'akrembenchiha@gmail.com',
      phone: '(819) 993-9777',
      availability: 'Disponible pour un poste à temps plein — présentiel, hybride ou télétravail',
      workModes: 'Présentiel · Hybride · Télétravail',
      status: 'Finissant à la maîtrise en géomatique appliquée et télédétection — Université de Sherbrooke',
    },
    nav: {
      projects: 'Réalisations',
      experience: 'Parcours',
      skills: 'Compétences',
      education: 'Formation',
      contact: 'Contact',
      printCv: 'Version CV PDF',
    },
    hero: {
      kicker: 'Sherbrooke, Québec · Disponible immédiatement à temps plein',
      headlineMain: 'Je combine SIG, télédétection et IA pour',
      headlineSerif: 'éclairer les décisions environnementales.',
      summary:
        "Finissant à la maîtrise en géomatique appliquée et télédétection à l'Université de Sherbrooke. Lors de mon stage Mitacs avec T2 Environnement, j'ai conçu une plateforme qui combine une base de connaissances vectorielle, un agent conversationnel (RAG + LLM) et une carte web pour appuyer les décisions environnementales.",
      primaryCta: 'Explorer les réalisations',
      secondaryCta: 'Me contacter directement',
      metrics: [
        {
          value: 'RAG + SIG',
          label: 'Plateforme de recherche Mitacs',
          detail: 'T2 Environnement & Université de Sherbrooke (2025–2026)',
        },
        {
          value: '3 Diplômes',
          label: 'Diplômes universitaires',
          detail: 'Maîtrise Géomatique (UdeS) · Master Réseaux & Sécurité · Licence SI',
        },
        {
          value: '4+ Projets',
          label: 'Projets réalisés',
          detail: 'IA environnementale, Fog Computing IoT, Géomarketing & Web',
        },
      ],
    },
    marquee: [
      'Systèmes d’Information Géographique (SIG)',
      'Télédétection & Imagerie Satellite',
      'Architectures RAG & Agents LLM',
      'Cartographie Web Interactive',
      'Bases de Données Spatiales PostGIS & Vectorielles',
      'Fog Computing & IoT',
      'Modélisation Spatiale & Géostatistique',
    ],
    projectsSection: {
      index: '01. Études de cas & Réalisations',
      title: 'Systèmes géospatiaux et plateformes intelligentes',
      subtitle:
        'Sélection de projets de recherche appliquée et d’ingénierie combinant analyse spatiale, intelligence artificielle et systèmes distribués.',
      filterAll: 'Tous les domaines',
      filterGis: 'SIG & Télédétection',
      filterAi: 'IA & RAG',
      filterDev: 'Fog IoT & Web',
      inspectLabel: 'Examiner l’étude de cas',
      modalChallenge: 'Contexte & Problématique',
      modalArchitecture: 'Architecture & Méthodologie',
      modalOutcomes: 'Résultats & Livrables validés',
      modalStack: 'Technologies mobilisées',
      closeModal: 'Fermer',
    },
    projects: [
      {
        id: 'mitacs-geoai',
        index: '01',
        title: 'Plateforme intelligence pour la synthèse des connaissances environnementales et l’aide à la prise de décision',
        subtitle: 'Stage Mitacs — T2 Environnement & Université de Sherbrooke',
        organization: 'T2 Environnement & Université de Sherbrooke',
        location: 'Sherbrooke, QC',
        period: '2025 – 2026',
        category: 'ai',
        categoryLabel: 'IA Appliquée · Synthèse des connaissances environnementales',
        featured: true,
        image: '/images/project_mitacs_geoai.webp',
        coordinates: '45.4042° N, 71.8929° W',
        role: 'Stagiaire, Université de Sherbrooke (Département de géomatique appliquée)',
        projectObjective:
          'Développer une plateforme intelligente capable de comprendre des enjeux posés en langage naturel et d’y répondre en s’appuyant sur les données internes de l’entreprise et les meilleures sources externes disponibles.',
        shortDescription:
          'Face à la complexité croissante des enjeux environnementaux, l’entreprise T2 Environnement doit prendre des décisions rapides et éclairées à partir d’une grande quantité d’informations techniques, réglementaires et scientifiques. Grâce à l’intelligence artificielle, cette plateforme offrira un accès rapide, clair et pertinent à l’information, facilitant ainsi la prise de décision dans des contextes comme la restauration écologique, les évaluations environnementales ou les demandes d’autorisation.',
        summary:
          'Face à la complexité croissante des enjeux environnementaux, ce projet développe une plateforme intelligente capable de comprendre des enjeux posés en langage naturel et d’y répondre en s’appuyant sur les données internes et externes pour faciliter la prise de décision.',
        challenge:
          'Prendre des décisions rapides et éclairées à partir d’une grande quantité d’informations techniques, réglementaires et scientifiques face à la complexité croissante des enjeux environnementaux.',
        architecture: [
          'Compréhension des enjeux formulés en langage naturel à l’aide de l’intelligence artificielle.',
          'Interrogation et synthèse croisée s’appuyant sur les données internes de l’entreprise et les meilleures sources externes disponibles.',
          'Restitution d’un accès rapide, clair et pertinent à l’information décisionnelle.',
          'Facilitation de la prise de décision dans des contextes concrets tels que la restauration écologique, les évaluations environnementales et les demandes d’autorisation.',
        ],
        outcomes: [
          'Plateforme intelligente facilitant la prise de décision en contexte environnemental.',
          'Accès rapide, clair et pertinent à l’information technique, réglementaire et scientifique.',
          'Application aux mandats de restauration écologique, d’évaluations environnementales et de demandes d’autorisation.',
        ],
        stack: ['Intelligence Artificielle', 'Langage Naturel', 'Agent Conversationnel', 'Génération Augmentée de Données (RAG)', 'Bases de Connaissances', 'Grands Modèles de Langage (LLM)'],
      },
      {
        id: 'edge-smart-parking',
        index: '02',
        title: 'Système de stationnement intelligent basé sur le Fog Computing',
        subtitle: 'Mémoire de master — architecture fog simulée avec iFogSim',
        organization: 'Université Djillali Liabès',
        location: 'Sidi Bel Abbès, Algérie',
        period: '2022 – 2023',
        category: 'dev',
        categoryLabel: 'Fog Computing · IoT · Simulation',
        featured: false,
        image: '/images/project_edge_parking.webp',
        coordinates: '35.1899° N, 0.6309° W',
        summary:
          'Mémoire de master réalisé en binôme : conception d’une architecture de stationnement intelligent basée sur le fog computing, évaluée par simulation avec iFogSim face à une architecture entièrement cloud.',
        challenge:
          'Dans les systèmes de stationnement intelligent basés sur le cloud, la latence et l’usage du réseau deviennent problématiques. Le fog computing rapproche le calcul de la périphérie du réseau pour y remédier.',
        architecture: [
          'Architecture en couches : caméras de détection des places (vision par ordinateur), nœuds fog de proximité et cloud.',
          'Modélisation et simulation de la topologie avec iFogSim (scénario de 9 caméras reliées à 3 nœuds fog).',
          'Comparaison des scénarios fog et cloud seul selon la latence, l’usage du réseau, le temps d’exécution et la consommation d’énergie.',
        ],
        outcomes: [
          'L’architecture fog réduit la latence, l’usage du réseau, le temps d’exécution et la consommation d’énergie par rapport au cloud.',
          'Limites identifiées et pistes : confidentialité des images de caméras et équilibrage de charge à grande échelle.',
        ],
        stack: ['Fog Computing', 'Cloud Computing', 'IoT', 'iFogSim', 'Vision par ordinateur', 'Java', 'Simulation'],
      },
      {
        id: 'bilc-spatial-risk',
        index: '03',
        title: 'Analyse spatiale, Géomarketing & Cartographie des risques naturels',
        subtitle: 'Planification territoriale et bases de données géospatiales',
        organization: 'Bureau d’ingénierie et laboratoire BILC',
        location: 'Sidi Bel Abbès, Algérie',
        period: '2019 – 2020',
        category: 'gis',
        categoryLabel: 'SIG · Imagerie Satellite · Planification',
        featured: false,
        image: '/images/project_gis_planning.webp',
        coordinates: '35.1975° N, 0.6400° W',
        summary:
          'Structuration de bases de données géospatiales multi-sources et production d’analyses cartographiques d’aide à la décision pour l’aménagement du territoire.',
        challenge:
          'Synthétiser des données hétérogènes (imagerie satellite, relevés topographiques, statistiques démographiques) en cartes thématiques directement exploitables par les décideurs.',
        architecture: [
          'Conception et administration de bases de données géospatiales intégrant fonds cartographiques, imagerie satellite et séries statistiques.',
          'Traitements géostatistiques et modélisation spatiale sous ArcGIS Pro et QGIS pour l’évaluation des risques naturels.',
          'Réalisation d’études de géomarketing et rédaction de rapports techniques d’aide à la décision destinés aux clients.',
        ],
        outcomes: [
          'Cartes thématiques haute précision livrées à l’appui de la planification territoriale.',
          'Modèles d’évaluation des risques naturels intégrés aux rapports d’ingénierie.',
        ],
        stack: ['ArcGIS Pro', 'QGIS', 'PostGIS', 'GeoServer', 'Imagerie Satellite', 'Analyse Géostatistique', 'SQL'],
      },
    ],
    experienceSection: {
      index: '02. Expérience Professionnelle',
      title: 'Parcours en recherche appliquée, géomatique et ingénierie',
      subtitle:
        'De l’analyse spatiale en bureau d’ingénierie jusqu’à la conception d’architectures RAG géospatiales à l’Université de Sherbrooke.',
    },
    experiences: [
      {
        id: 'exp-mitacs',
        role: 'Stagiaire, Université de Sherbrooke — Stage Mitacs (T2 Environnement)',
        organization: 'T2 Environnement & Université de Sherbrooke (Département de géomatique appliquée)',
        location: 'Sherbrooke, QC',
        period: 'Mai 2025 – Janv. 2026',
        type: 'Stage de stratégie d’entreprise (Mitacs)',
        category: 'ai',
        highlights: [
          'Projet : Plateforme intelligence pour la synthèse des connaissances environnementales et l’aide à la prise de décision (8 mois, deux unités de stage Mitacs).',
          'Supervision : Pr Mickaël Germain, Pr Samuel Foucher et Pr Yacine Bouroubi (Département de géomatique appliquée, UdeS), avec l’équipe de biologistes de T2 Environnement.',
          'Objectif : Développer une plateforme intelligente capable de comprendre des enjeux posés en langage naturel et d’y répondre en s’appuyant sur les données internes de l’entreprise et les meilleures sources externes disponibles.',
          'Contexte : Face à la complexité croissante des enjeux environnementaux, T2 Environnement doit prendre des décisions rapides et éclairées à partir d’une grande quantité d’informations techniques, réglementaires et scientifiques.',
          'Impact : Offrir un accès rapide, clair et pertinent à l’information grâce à l’intelligence artificielle, facilitant la prise de décision dans des contextes comme la restauration écologique, les évaluations environnementales ou les demandes d’autorisation.',
        ],
        technologies: ['Intelligence Artificielle', 'Langage Naturel', 'Agent Conversationnel', 'Génération Augmentée de Données (RAG)', 'Bases de Connaissances', 'Grands Modèles de Langage (LLM)'],
      },
      {
        id: 'exp-edge',
        role: 'Mémoire de master — Stationnement intelligent (Fog Computing)',
        organization: 'Université Djillali Liabès (projet en binôme)',
        location: 'Sidi Bel Abbès, Algérie',
        period: '2022 – 2023',
        type: 'Recherche · Systèmes distribués',
        category: 'dev',
        highlights: [
          'Conçu une architecture de stationnement intelligent basée sur le fog computing, avec détection des places par caméras et vision par ordinateur.',
          'Simulé la topologie avec iFogSim (9 caméras, 3 nœuds fog) et l’ai comparée à une architecture entièrement cloud.',
          'Démontré une baisse de la latence, de l’usage du réseau, du temps d’exécution et de la consommation d’énergie.',
        ],
        technologies: ['Fog Computing', 'IoT', 'iFogSim', 'Vision par ordinateur', 'Java'],
      },
      {
        id: 'exp-web',
        role: 'Développeur web',
        organization: 'Projet de fin d’études (baccalauréat)',
        location: 'Sidi Bel Abbès, Algérie',
        period: '2020 – 2021',
        type: 'Développement Web & Données',
        category: 'dev',
        highlights: [
          'Développé et maintenu des sites web dynamiques (HTML, CSS), incluant l’intégration et la visualisation de données.',
          'Contribué à la conception graphique et à la correction d’anomalies techniques dans un environnement agile et collaboratif.',
        ],
        technologies: ['HTML/CSS', 'Visualisation de données', 'MySQL', 'Git', 'Méthode Agile'],
      },
      {
        id: 'exp-sig',
        role: 'Stagiaire SIG',
        organization: 'Bureau d’ingénierie et laboratoire BILC',
        location: 'Sidi Bel Abbès, Algérie',
        period: '2019 – 2020',
        type: 'Géomatique & Cartographie',
        category: 'gis',
        highlights: [
          'Conçu et géré des bases de données géospatiales intégrant cartes, imagerie satellite et données statistiques.',
          'Produit des cartes thématiques et réalisé des analyses spatiales à l’appui de la planification territoriale.',
          'Réalisé des études de géomarketing et des analyses cartographiques des risques naturels.',
          'Contribué à la rédaction de rapports d’aide à la décision destinés aux clients.',
        ],
        technologies: ['ArcGIS Pro', 'QGIS', 'PostGIS', 'Imagerie Satellite', 'Géomarketing', 'Analyse Spatiale'],
      },
    ],
    skillsSection: {
      index: '03. Compétences Techniques & Analytiques',
      title: 'Compétences en géomatique, en données et en IA',
      subtitle:
        'Du traitement d’images satellites aux bases de données spatiales, jusqu’aux agents conversationnels RAG et à la cartographie web.',
      searchPlaceholder: 'Filtrer une technologie (ex. PostGIS, LangChain, Python, QGIS)...',
    },
    skillGroups: [
      {
        id: 'gis',
        title: 'SIG & Télédétection',
        subtitle: 'Analyse spatiale, imagerie satellite et serveurs cartographiques',
        items: [
          { name: 'ArcGIS Pro & QGIS', context: 'Cartographie thématique, modélisation spatiale et risques naturels', level: 'Avancé' },
          { name: 'PostGIS & GeoServer', context: 'Bases de données spatiales et publication de flux cartographiques web', level: 'Avancé' },
          { name: 'Traitement d’images satellite', context: 'Télédétection, extraction d’indicateurs environnementaux et classification', level: 'Avancé' },
          { name: 'Analyse géostatistique', context: 'Interpolation spatiale, géomarketing et aide à la décision territoriale', level: 'Avancé' },
          { name: 'Modélisation spatiale', context: 'Automatisation de chaînes de traitement géomatique', level: 'Avancé' },
        ],
      },
      {
        id: 'ai',
        title: 'Intelligence Artificielle & NLP',
        subtitle: 'Architectures RAG, LLMs et systèmes d’aide à la décision',
        items: [
          { name: 'LangChain & Architectures RAG', context: 'Conception de pipelines Retrieval-Augmented Generation multi-sources', level: 'Avancé' },
          { name: 'OpenAI API & LLMs', context: 'Orchestration de modèles de langage et synthèse documentaire', level: 'Avancé' },
          { name: 'Embeddings vectoriels', context: 'Indexation sémantique de rapports, diagnostics et données spatiales', level: 'Avancé' },
          { name: 'Agents conversationnels', context: 'Chatbots spécialisés couplés à des interfaces cartographiques', level: 'Avancé' },
        ],
      },
      {
        id: 'data',
        title: 'Programmation & Bases de données',
        subtitle: 'Langages logiciels, bases relationnelles, NoSQL et graphes',
        items: [
          { name: 'Python', context: 'Géotraitement, pipelines IA/NLP, scripts scientifiques et API', level: 'Avancé' },
          { name: 'SQL, PostgreSQL / PgAdmin & MySQL', context: 'Requêtes spatiales et relationnelles complexes', level: 'Avancé' },
          { name: 'MongoDB Atlas & Neo4j', context: 'Bases documentaires NoSQL et bases de données orientées graphes', level: 'Maîtrisé' },
          { name: 'Java & C', context: 'Programmation orientée objet et algorithmique', level: 'Maîtrisé' },
        ],
      },
      {
        id: 'dev',
        title: 'Développement Web, IoT & Outils',
        subtitle: 'Interfaces interactives, systèmes distribués et environnement système',
        items: [
          { name: 'Cartographie web interactive', context: 'Visualisation dynamique de couches spatiales couplée aux agents IA', level: 'Avancé' },
          { name: 'Fog / Edge Computing & IoT', context: 'Architectures distribuées et simulation iFogSim (mémoire de master)', level: 'Maîtrisé' },
          { name: 'HTML / CSS & Interfaces Web', context: 'Conception d’interfaces réactives et tableaux de bord de données', level: 'Maîtrisé' },
          { name: 'Git, Linux & Suite Office', context: 'Gestion de versions, environnements Unix, Excel, Access, PowerPoint', level: 'Avancé' },
        ],
      },
    ],
    educationSection: {
      index: '04. Formation Académique & Certifications',
      title: 'Cursus universitaire, mémoire de recherche et certifications',
      subtitle:
        'Double compétence alliant les sciences géomatiques et télédétection (Université de Sherbrooke) et l’ingénierie des systèmes et réseaux informatiques.',
      interestsTitle: 'Centres d’intérêt & Engagement',
      interests: ['Randonnée en nature', 'Natation', 'Football', 'Veille technologique GeoAI'],
      certificationsTitle: 'Formations & Attestations spécialisées',
      memoireLabel: 'Mémoire / Projet de recherche',
      certifications: [
        {
          id: 'cert-drones-udes',
          title: 'Drones et télédétection environnementale',
          institution: 'Université de Sherbrooke (Centre universitaire de formation continue & Département de géomatique appliquée)',
          location: 'Formation à distance',
          date: '1er juin 2026 (formation les 26 et 27 mai 2026)',
          duration: '15 heures',
          director: 'Simon Nantel (Directeur, Centre universitaire de formation continue)',
          highlights: [
            'Caractéristiques techniques des drones et capteurs (optiques passifs, LiDAR, multispectraux, thermique)',
            'Aspects réglementaires de Transports Canada (opérations de base, avancées, microdrones)',
            'Préparation et planification de missions de vol (GCPs, RTK/PPK, altitude, recouvrement)',
            'Prétraitement et traitement d’imagerie visible et multispectrale (orthomosaïque, MNS, MNT, classification)',
          ],
        },
      ],
    },
    education: [
      {
        id: 'udes-maitrise',
        degree: 'Maîtrise en géomatique appliquée et télédétection',
        institution: 'Université de Sherbrooke',
        location: 'Sherbrooke, Québec, Canada',
        period: '2024 – 2026',
        focus: 'Télédétection avancée, analyse d’images satellite, SIG, modélisation environnementale et IA géospatiale.',
        coordinates: '45.3780° N, 71.9280° W',
        thesisTitle: 'Plateforme intelligence pour la synthèse des connaissances environnementales et l’aide à la prise de décision',
        thesisRole: 'Stagiaire, Université de Sherbrooke (Département de géomatique appliquée)',
        thesisDescription:
          'Projet de stage de recherche Mitacs réalisé en partenariat avec T2 Environnement visant à développer une plateforme intelligente capable de comprendre des enjeux posés en langage naturel et d’y répondre en s’appuyant sur les données internes et externes disponibles pour faciliter la prise de décision en contexte environnemental.',
      },
      {
        id: 'udl-master',
        degree: 'Master en réseaux, systèmes et sécurité de l’information',
        institution: 'Université Djillali Liabès',
        location: 'Sidi Bel Abbès, Algérie',
        period: '2021 – 2023',
        focus: 'Réseaux, systèmes distribués (cloud, fog et edge computing), sécurité de l’information et IoT.',
        coordinates: '35.1899° N, 0.6309° W',
        thesisTitle: 'Système de stationnement intelligent en utilisant le fog computing',
        thesisRole: 'Co-auteur (avec Djamel Eddine Yousfi), sous la direction de Dr Samah Bouamama',
        thesisDescription:
          'Mémoire de master proposant une architecture de stationnement intelligent basée sur le fog computing, avec détection des places par caméras. Simulée avec iFogSim, elle réduit la latence, l’usage du réseau, le temps d’exécution et la consommation d’énergie par rapport à une architecture cloud.',
      },
      {
        id: 'udl-licence',
        degree: 'Licence en systèmes informatiques',
        institution: 'Université Djillali Liabès',
        location: 'Sidi Bel Abbès, Algérie',
        period: '2018 – 2021',
        focus: 'Génie logiciel, bases de données relationnelles, algorithmique, programmation (Python, Java, C) et développement web.',
        coordinates: '35.1899° N, 0.6309° W',
      },
    ],
    contactSection: {
      index: '05. Contact & Disponibilité',
      title: 'Prêt à contribuer à vos projets en géomatique et IA',
      subtitle:
        'Disponible pour un poste à temps plein (présentiel à Sherbrooke / Québec, hybride ou télétravail). N’hésitez pas à me contacter pour échanger sur vos besoins.',
      copyEmail: 'Copier le courriel',
      copied: 'Copié !',
      copyPhone: 'Copier le numéro',
      formTitle: 'Composer un message direct',
      nameLabel: 'Votre nom',
      orgLabel: 'Organisation / Entreprise',
      modeLabel: 'Modalité de poste envisagée',
      modes: ['Temps plein — Hybride', 'Temps plein — Présentiel', 'Temps plein — Télétravail', 'Projet de recherche / Consultation'],
      messageLabel: 'Message ou description du poste',
      messagePlaceholder: 'Bonjour Akrem, nous aimerions échanger avec vous concernant un poste en géomatique / IA appliquée...',
      sendMailCta: 'Ouvrir dans votre client courriel',
    },
    assistant: {
      badge: 'Assistant IA',
      modalTitle: 'Assistant IA · Dossier Akrem Benchiha',
      modalSubtitle: 'Posez n’importe quelle question sur mes compétences, réalisations RAG, expériences ou disponibilité.',
      openButton: 'Poser une question à l’assistant IA',
      quickPromptsLabel: 'Questions fréquentes suggérées :',
      quickPrompts: [
        'Peux-tu résumer son projet RAG chez T2 Environnement ?',
        'Quelles sont ses compétences clés en SIG & Télédétection ?',
        'Quelle est sa formation et sa disponibilité actuelle ?',
        'Quels langages et bases de données maîtrise-t-il ?',
      ],
      inputPlaceholder: 'Posez une question sur le parcours d’Akrem...',
      sendButton: 'Envoyer',
      thinkingText: 'Analyse du dossier professionnel en cours...',
      emptyGreeting: 'Bonjour ! Je suis l’assistant IA d’Akrem Benchiha.',
      emptyDescription: 'Je suis programmé pour répondre avec précision à toutes vos questions sur ses compétences en géomatique, ses projets en intelligence artificielle (RAG, LLM), ses formations et sa disponibilité.',
      disclaimer: 'Réponses fondées uniquement sur le CV et les projets d’Akrem.',
      errorUnavailable: 'Le service IA est temporairement indisponible. Vous pouvez contacter Akrem directement par courriel ou téléphone.',
    },
  },
  en: {
    meta: {
      name: 'Akrem Benchiha',
      title: 'Geomatics, Remote Sensing & Applied Artificial Intelligence',
      shortTitle: 'Geomatics · Remote Sensing · Applied AI',
      location: 'Sherbrooke, QC, Canada',
      coordinates: '45.3780° N, 71.9280° W',
      academicEmail: 'akrembenchiha@usherbrooke.ca',
      personalEmail: 'akrembenchiha@gmail.com',
      phone: '(819) 993-9777',
      availability: 'Available for a full-time position — On-site, Hybrid, or Remote',
      workModes: 'On-site · Hybrid · Remote',
      status: 'Completing M.Sc. in Applied Geomatics and Remote Sensing — Université de Sherbrooke',
    },
    nav: {
      projects: 'Case Studies',
      experience: 'Experience',
      skills: 'Skills',
      education: 'Education',
      contact: 'Contact',
      printCv: 'Print / PDF Resume',
    },
    hero: {
      kicker: 'Sherbrooke, Quebec · Available Immediately for Full-Time Roles',
      headlineMain: 'I combine GIS, remote sensing and AI to',
      headlineSerif: 'support environmental decisions.',
      summary:
        'Completing a master’s in applied geomatics and remote sensing at Université de Sherbrooke. During my Mitacs internship with T2 Environnement, I built a platform that combines a vector knowledge base, a conversational agent (RAG + LLM) and a web map to support environmental decisions.',
      primaryCta: 'Explore Case Studies',
      secondaryCta: 'Get in Touch',
      metrics: [
        {
          value: 'RAG + GIS',
          label: 'Mitacs Applied Research Platform',
          detail: 'T2 Environnement & Université de Sherbrooke (2025–2026)',
        },
        {
          value: '3 Degrees',
          label: 'University degrees',
          detail: 'M.Sc. Geomatics (UdeS) · Master Networks & Security · B.Sc. CS',
        },
        {
          value: '4+ Projects',
          label: 'Completed projects',
          detail: 'Environmental AI, Fog computing IoT, Geomarketing & Web',
        },
      ],
    },
    marquee: [
      'Geographic Information Systems (GIS)',
      'Remote Sensing & Satellite Imagery',
      'RAG Architectures & LLM Agents',
      'Interactive Web Cartography',
      'PostGIS & Vector Knowledge Bases',
      'Fog Computing & IoT',
      'Spatial Modeling & Geostatistics',
    ],
    projectsSection: {
      index: '01. Selected Works & Case Studies',
      title: 'Geospatial intelligence & applied AI platforms',
      subtitle:
        'Featured research and engineering projects combining spatial analysis, natural language processing, and distributed systems.',
      filterAll: 'All Domains',
      filterGis: 'GIS & Remote Sensing',
      filterAi: 'Applied AI & RAG',
      filterDev: 'Fog IoT & Web',
      inspectLabel: 'Inspect Case Study',
      modalChallenge: 'Problem Statement & Context',
      modalArchitecture: 'System Architecture & Methodology',
      modalOutcomes: 'Validated Deliverables & Impact',
      modalStack: 'Technical Stack',
      closeModal: 'Close',
    },
    projects: [
      {
        id: 'mitacs-geoai',
        index: '01',
        title: 'Intelligent Platform for Environmental Knowledge Synthesis and Decision Support',
        subtitle: 'Mitacs Internship — T2 Environnement & Université de Sherbrooke',
        organization: 'T2 Environnement & Université de Sherbrooke',
        location: 'Sherbrooke, QC',
        period: '2025 – 2026',
        category: 'ai',
        categoryLabel: 'Applied AI · Environmental Knowledge Synthesis',
        featured: true,
        image: '/images/project_mitacs_geoai.webp',
        coordinates: '45.4042° N, 71.8929° W',
        role: 'Intern, Université de Sherbrooke (Applied Geomatics Department)',
        projectObjective:
          'Develop an intelligent platform capable of understanding environmental challenges expressed in natural language and answering them using internal company data and the best available external sources.',
        shortDescription:
          'Faced with the growing complexity of environmental challenges, T2 Environnement must make rapid, informed decisions based on large volumes of technical, regulatory, and scientific information. Powered by artificial intelligence, this platform will provide fast, clear, and relevant access to information, facilitating decision-making in contexts such as ecological restoration, environmental assessments, and permit applications.',
        summary:
          'Faced with growing environmental complexity, this project develops an intelligent platform capable of understanding questions in natural language and answering them using internal and external data to facilitate environmental decision-making.',
        challenge:
          'Making rapid and informed decisions based on large volumes of technical, regulatory, and scientific information in the face of increasingly complex environmental challenges.',
        architecture: [
          'Understanding issues formulated in natural language through artificial intelligence.',
          'Cross-source querying and synthesis relying on internal company data and top external sources.',
          'Delivering fast, clear, and actionable access to decision-critical information.',
          'Supporting decision-making across ecological restoration, environmental assessments, and authorization requests.',
        ],
        outcomes: [
          'Intelligent platform facilitating environmental decision-making.',
          'Rapid, clear, and relevant access to technical, regulatory, and scientific information.',
          'Direct applicability to ecological restoration, environmental assessments, and permit applications.',
        ],
        stack: ['Artificial Intelligence', 'Natural Language', 'Conversational Agent', 'Retrieval-Augmented Generation (RAG)', 'Knowledge Bases', 'Large Language Models (LLM)'],
      },
      {
        id: 'edge-smart-parking',
        index: '02',
        title: 'Smart Parking System Based on Fog Computing',
        subtitle: 'Master’s thesis — fog architecture simulated with iFogSim',
        organization: 'Djillali Liabès University',
        location: 'Sidi Bel Abbès, Algeria',
        period: '2022 – 2023',
        category: 'dev',
        categoryLabel: 'Fog Computing · IoT · Simulation',
        featured: false,
        image: '/images/project_edge_parking.webp',
        coordinates: '35.1899° N, 0.6309° W',
        summary:
          'Master’s thesis written as a two-person project: designed a fog-computing smart parking architecture and evaluated it in iFogSim against a cloud-only architecture.',
        challenge:
          'In cloud-based smart parking systems, latency and network usage become a problem. Fog computing moves processing closer to the network edge to address this.',
        architecture: [
          'Layered architecture: parking-spot cameras (computer vision), nearby fog nodes, and the cloud.',
          'Modelled and simulated the topology in iFogSim (scenario with 9 cameras linked to 3 fog nodes).',
          'Compared fog and cloud-only scenarios on latency, network usage, execution time and energy consumption.',
        ],
        outcomes: [
          'The fog architecture reduced latency, network usage, execution time and energy consumption compared with the cloud.',
          'Limitations and next steps identified: camera-image privacy and load balancing at larger scale.',
        ],
        stack: ['Fog Computing', 'Cloud Computing', 'IoT', 'iFogSim', 'Computer Vision', 'Java', 'Simulation'],
      },
      {
        id: 'bilc-spatial-risk',
        index: '03',
        title: 'Geospatial Database Management, Geomarketing & Natural Hazard Mapping',
        subtitle: 'Territorial planning and satellite imagery spatial analysis',
        organization: 'BILC Engineering Firm & Laboratory',
        location: 'Sidi Bel Abbès, Algeria',
        period: '2019 – 2020',
        category: 'gis',
        categoryLabel: 'GIS · Satellite Imagery · Territorial Planning',
        featured: false,
        image: '/images/project_gis_planning.webp',
        coordinates: '35.1975° N, 0.6400° W',
        summary:
          'Designed and managed multi-source geospatial databases and produced thematic maps and spatial analyses supporting territorial planning.',
        challenge:
          'Integrate heterogeneous spatial layers—satellite imagery, vector maps, and demographic statistics—into actionable decision-support reports.',
        architecture: [
          'Structured geospatial databases combining vector cartography, satellite imagery, and statistical series.',
          'Performed spatial analysis and geostatistical modeling in ArcGIS Pro and QGIS for territorial planning.',
          'Conducted geomarketing studies and cartographic assessments of natural hazards.',
        ],
        outcomes: [
          'Delivered thematic atlases and spatial decision-support reports directly to engineering clients.',
          'Standardized spatial database workflows across the laboratory.',
        ],
        stack: ['ArcGIS Pro', 'QGIS', 'PostGIS', 'GeoServer', 'Satellite Imagery', 'Geostatistics', 'SQL'],
      },
    ],
    experienceSection: {
      index: '02. Professional Experience',
      title: 'Applied research, geomatics, and software engineering trajectory',
      subtitle:
        'A progressive track record spanning GIS work, distributed IoT systems research, and environmental AI research in Quebec.',
    },
    experiences: [
      {
        id: 'exp-mitacs',
        role: 'Intern, Université de Sherbrooke — Mitacs Internship (T2 Environnement)',
        organization: 'T2 Environnement & Université de Sherbrooke (Applied Geomatics Department)',
        location: 'Sherbrooke, QC',
        period: 'May 2025 – Jan. 2026',
        type: 'Business Strategy Internship (Mitacs)',
        category: 'ai',
        highlights: [
          'Project: Intelligent Platform for Environmental Knowledge Synthesis and Decision Support (8 months, two Mitacs internship units).',
          'Supervision: Prof. Mickaël Germain, Prof. Samuel Foucher and Prof. Yacine Bouroubi (Applied Geomatics, UdeS), with T2 Environnement’s team of biologists.',
          'Objective: Develop an intelligent platform capable of understanding environmental challenges expressed in natural language and answering them using internal company data and top external sources.',
          'Context: Faced with the growing complexity of environmental challenges, T2 Environnement must make rapid, informed decisions based on large volumes of technical, regulatory, and scientific information.',
          'Impact: Provide fast, clear, and relevant access to information through artificial intelligence, facilitating decision-making in contexts such as ecological restoration, environmental assessments, and permit applications.',
        ],
        technologies: ['Artificial Intelligence', 'Natural Language', 'Conversational Agent', 'Retrieval-Augmented Generation (RAG)', 'Knowledge Bases', 'Large Language Models (LLM)'],
      },
      {
        id: 'exp-edge',
        role: 'Master’s thesis — Smart Parking (Fog Computing)',
        organization: 'Djillali Liabès University (two-person project)',
        location: 'Sidi Bel Abbès, Algeria',
        period: '2022 – 2023',
        type: 'Research · Distributed systems',
        category: 'dev',
        highlights: [
          'Designed a fog-computing smart parking architecture with camera-based spot detection using computer vision.',
          'Simulated the topology in iFogSim (9 cameras, 3 fog nodes) and compared it with a cloud-only architecture.',
          'Showed lower latency, network usage, execution time and energy consumption.',
        ],
        technologies: ['Fog Computing', 'IoT', 'iFogSim', 'Computer Vision', 'Java'],
      },
      {
        id: 'exp-web',
        role: 'Web Developer',
        organization: 'Undergraduate Capstone Project',
        location: 'Sidi Bel Abbès, Algeria',
        period: '2020 – 2021',
        type: 'Web Development & Data Visualization',
        category: 'dev',
        highlights: [
          'Developed and maintained dynamic websites (HTML, CSS), including data integration and visualization.',
          'Contributed to graphic design and technical bug resolution in an agile, collaborative environment.',
        ],
        technologies: ['HTML/CSS', 'Data Visualization', 'MySQL', 'Git', 'Agile Workflow'],
      },
      {
        id: 'exp-sig',
        role: 'GIS Intern',
        organization: 'BILC Engineering Office & Laboratory',
        location: 'Sidi Bel Abbès, Algeria',
        period: '2019 – 2020',
        type: 'Geomatics & Spatial Analysis',
        category: 'gis',
        highlights: [
          'Designed and managed geospatial databases integrating maps, satellite imagery, and statistical data.',
          'Produced thematic maps and conducted spatial analyses supporting territorial planning.',
          'Conducted geomarketing studies and cartographic analyses of natural hazards.',
          'Contributed to drafting decision-support reports for clients.',
        ],
        technologies: ['ArcGIS Pro', 'QGIS', 'PostGIS', 'Satellite Imagery', 'Geomarketing', 'Spatial Analysis'],
      },
    ],
    skillsSection: {
      index: '03. Technical & Analytical Matrix',
      title: 'Skills in geomatics, data and AI',
      subtitle:
        'From satellite image processing and spatial databases to RAG conversational agents and web mapping.',
      searchPlaceholder: 'Filter a technology or skill (e.g., PostGIS, LangChain, Python, QGIS)...',
    },
    skillGroups: [
      {
        id: 'gis',
        title: 'GIS & Remote Sensing',
        subtitle: 'Spatial analysis, satellite imagery & map servers',
        items: [
          { name: 'ArcGIS Pro & QGIS', context: 'Thematic cartography, spatial modeling, and natural risk analysis', level: 'Advanced' },
          { name: 'PostGIS & GeoServer', context: 'Spatial database architecture and web map service publishing', level: 'Advanced' },
          { name: 'Satellite Image Processing', context: 'Remote sensing, environmental index extraction, and classification', level: 'Advanced' },
          { name: 'Geostatistical Analysis', context: 'Spatial interpolation, geomarketing, and territorial decision support', level: 'Advanced' },
          { name: 'Spatial Modeling', context: 'Automated geoprocessing workflows and multi-criteria modeling', level: 'Advanced' },
        ],
      },
      {
        id: 'ai',
        title: 'Artificial Intelligence & NLP',
        subtitle: 'RAG architectures, LLMs & conversational decision support',
        items: [
          { name: 'LangChain & RAG Architectures', context: 'Multi-source Retrieval-Augmented Generation pipeline design', level: 'Advanced' },
          { name: 'OpenAI API & LLMs', context: 'Large Language Model orchestration and scientific synthesis', level: 'Advanced' },
          { name: 'Vector Embeddings', context: 'Semantic indexing of technical reports, diagnostics, and spatial metadata', level: 'Advanced' },
          { name: 'Conversational Agents', context: 'Domain-specific chatbots coupled with interactive web mapping', level: 'Advanced' },
        ],
      },
      {
        id: 'data',
        title: 'Programming & Databases',
        subtitle: 'Software engineering, relational, NoSQL & graph databases',
        items: [
          { name: 'Python', context: 'Geoprocessing, AI/NLP pipelines, data science, and backend APIs', level: 'Advanced' },
          { name: 'SQL, PostgreSQL / PgAdmin & MySQL', context: 'Complex relational and spatial query optimization', level: 'Advanced' },
          { name: 'MongoDB Atlas & Neo4j', context: 'Document NoSQL stores and graph database modeling', level: 'Proficient' },
          { name: 'Java & C', context: 'Object-oriented programming and algorithms', level: 'Proficient' },
        ],
      },
      {
        id: 'dev',
        title: 'Web Cartography, IoT & Tools',
        subtitle: 'Interactive interfaces, distributed systems & Unix workflows',
        items: [
          { name: 'Interactive Web Mapping', context: 'Dynamic spatial layer visualization integrated with AI assistants', level: 'Advanced' },
          { name: 'Fog / Edge Computing & IoT', context: 'Distributed architectures and iFogSim simulation (master’s thesis)', level: 'Proficient' },
          { name: 'HTML / CSS & Web Interfaces', context: 'Responsive front-end interfaces and data visualization dashboards', level: 'Proficient' },
          { name: 'Git, Linux & Office Suite', context: 'Version control, Unix environments, Excel, Access, PowerPoint', level: 'Advanced' },
        ],
      },
    ],
    educationSection: {
      index: '04. Academic Background & Certifications',
      title: 'Graduate degrees, research thesis, and certifications',
      subtitle:
        'Combining advanced applied geomatics and remote sensing at Université de Sherbrooke with a solid foundation in distributed systems and computer science.',
      interestsTitle: 'Interests & Activities',
      interests: ['Trail Hiking', 'Swimming', 'Football (Soccer)', 'GeoAI Research'],
      certificationsTitle: 'Specialized Training & Professional Attestations',
      memoireLabel: 'Master’s Thesis / Research Project',
      certifications: [
        {
          id: 'cert-drones-udes',
          title: 'Drones and Environmental Remote Sensing',
          institution: 'Université de Sherbrooke (Continuing Education Center & Applied Geomatics Department)',
          location: 'Online',
          date: 'June 1, 2026 (training on May 26–27, 2026)',
          duration: '15 hours',
          director: 'Simon Nantel (Director, Continuing Education Center)',
          highlights: [
            'Technical characteristics of UAVs and sensor payloads (passive optical, LiDAR, multispectral, thermal)',
            'Transport Canada regulatory framework (basic operations, advanced operations, microdrones)',
            'Flight mission planning (Ground Control Points - GCPs, RTK/PPK, altitude, overlap)',
            'Visible and multispectral imagery preprocessing and processing (orthomosaics, DSM, DTM, classification)',
          ],
        },
      ],
    },
    education: [
      {
        id: 'udes-maitrise',
        degree: 'M.Sc. in Applied Geomatics and Remote Sensing (Maîtrise)',
        institution: 'Université de Sherbrooke',
        location: 'Sherbrooke, Quebec, Canada',
        period: '2024 – 2026',
        focus: 'Advanced remote sensing, satellite image analysis, GIS, environmental modeling, and geospatial AI.',
        coordinates: '45.3780° N, 71.9280° W',
        thesisTitle: 'Intelligent Platform for Environmental Knowledge Synthesis and Decision Support',
        thesisRole: 'Intern, Université de Sherbrooke (Applied Geomatics Department)',
        thesisDescription:
          'Mitacs research project in partnership with T2 Environnement aiming to develop an intelligent platform capable of understanding questions in natural language and answering them using internal and external data to facilitate environmental decision-making.',
      },
      {
        id: 'udl-master',
        degree: 'Master in Networks, Systems, and Information Security',
        institution: 'Université Djillali Liabès',
        location: 'Sidi Bel Abbès, Algeria',
        period: '2021 – 2023',
        focus: 'Networks, distributed systems (cloud, fog and edge computing), information security and IoT.',
        coordinates: '35.1899° N, 0.6309° W',
        thesisTitle: 'Smart parking system using fog computing',
        thesisRole: 'Co-author (with Djamel Eddine Yousfi), supervised by Dr Samah Bouamama',
        thesisDescription:
          'Master’s thesis proposing a fog-computing smart parking architecture with camera-based spot detection. Simulated in iFogSim, it reduced latency, network usage, execution time and energy consumption compared with a cloud architecture.',
      },
      {
        id: 'udl-licence',
        degree: 'B.Sc. in Computer Systems (Licence)',
        institution: 'Université Djillali Liabès',
        location: 'Sidi Bel Abbès, Algeria',
        period: '2018 – 2021',
        focus: 'Software engineering, relational databases, algorithms, programming (Python, Java, C), and web development.',
        coordinates: '35.1899° N, 0.6309° W',
      },
    ],
    contactSection: {
      index: '05. Contact & Availability',
      title: 'Ready to contribute to your geomatics & AI initiatives',
      subtitle:
        'Available for full-time opportunities (on-site in Sherbrooke / Quebec, hybrid, or remote). Reach out directly to discuss how I can contribute to your team.',
      copyEmail: 'Copy Email',
      copied: 'Copied!',
      copyPhone: 'Copy Phone',
      formTitle: 'Compose a Direct Inquiry',
      nameLabel: 'Your Name',
      orgLabel: 'Organization / Company',
      modeLabel: 'Role Format',
      modes: ['Full-Time — Hybrid', 'Full-Time — On-site', 'Full-Time — Remote', 'Research / Technical Collaboration'],
      messageLabel: 'Message or Role Details',
      messagePlaceholder: 'Hello Akrem, we would like to discuss a full-time opportunity in Geomatics / Applied AI...',
      sendMailCta: 'Open in Email Client',
    },
    assistant: {
      badge: 'AI Assistant',
      modalTitle: 'AI Assistant · Akrem Benchiha Portfolio',
      modalSubtitle: 'Ask any question about my technical skills, RAG projects, background, or availability.',
      openButton: 'Ask AI Assistant about Akrem',
      quickPromptsLabel: 'Suggested questions:',
      quickPrompts: [
        'Can you summarize his RAG project at T2 Environnement?',
        'What are his key skills in GIS & Remote Sensing?',
        'What is his academic background and current availability?',
        'Which programming languages and databases does he master?',
      ],
      inputPlaceholder: 'Ask anything about Akrem’s background...',
      sendButton: 'Send',
      thinkingText: 'Analyzing professional record...',
      emptyGreeting: 'Hello! I am Akrem Benchiha’s AI Assistant.',
      emptyDescription: 'I am here to answer any questions from recruiters, collaborators, or team leads regarding his geomatics expertise, applied AI (RAG/LLM) systems, background, and full-time availability.',
      disclaimer: 'Answers based only on Akrem’s CV and projects.',
      errorUnavailable: 'AI Assistant is temporarily unavailable. You can reach out directly via email or phone.',
    },
  },
};
