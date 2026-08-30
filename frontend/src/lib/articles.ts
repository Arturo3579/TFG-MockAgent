export interface Article {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  lastReviewed: string;
  targetKeyword: string;
  vertical: 'life' | 'auto' | 'health' | 'home' | 'general';
  topic: 'workflows' | 'tutorials' | 'compliance' | 'reviews' | null;
  caseSummary?: string[];
  related?: { slug: string; title: string; description: string }[];
}

// Static article index — mirrors the MDX files in src/content/articles/
export const articles: Article[] = [
  {
    slug: 'ai-tools-for-independent-insurance-agents',
    title: 'The Complete Guide to AI Tools for Independent Insurance Agents in 2026',
    description: 'A field-reviewed guide to the AI tools reshaping lead intake, quoting, CRM, claims, and customer service for independent P&C and life/health agents.',
    publishDate: '2026-08-24',
    lastReviewed: '2026-08-24',
    targetKeyword: 'AI tools for insurance agents',
    vertical: 'general',
    topic: null,
    caseSummary: [
      'AI adoption among independent agencies jumped sharply after 2023, driven by faster quoting and 24/7 lead response.',
      'The five core workflows are lead intake, comparative rating, CRM/renewals, claims/FNOL support, and customer service.',
      'Point tools beat platforms for most small agencies starting out; integrate only after a workflow is clearly defined.',
      'Compliance obligations flow mostly from carriers and state DOIs, not the agent directly — but ignorance is not a defense.'
    ]
  },
  {
    slug: 'ai-tools-for-life-insurance-agents',
    title: 'Best AI Tools for Life Insurance Agents',
    description: 'Life insurance has a longer sales cycle and heavier paperwork than P&C. These AI tools help agents qualify leads, accelerate underwriting, and retain clients.',
    publishDate: '2026-08-24',
    lastReviewed: '2026-08-24',
    targetKeyword: 'AI tools for life insurance agents',
    vertical: 'life',
    topic: 'reviews',
    caseSummary: [
      'Life insurance needs different AI tools than P&C because the sales cycle spans weeks or months, not minutes.',
      'Lead qualification, accelerated underwriting, and policy-review automation are the highest-impact use cases.',
      'Health-adjacent data and HIPAA-adjacent workflows require extra caution before any tool is deployed.'
    ]
  },
  {
    slug: 'ai-tools-for-auto-insurance-agents',
    title: 'Best AI Tools for Auto Insurance Agents',
    description: 'Auto insurance is a speed game. Here are the AI tools that help independent agents respond faster, quote accurately, and retain price-shopping clients.',
    publishDate: '2026-08-24',
    lastReviewed: '2026-08-24',
    targetKeyword: 'AI tools for auto insurance agents',
    vertical: 'auto',
    topic: 'reviews',
    caseSummary: [
      'Speed-to-lead is the biggest conversion lever in auto insurance; a five-minute response can lift conversions 30-50%.',
      'Comparative rating and instant-quote tools are the most mature AI category for auto agents.',
      'Damage assessment and FNOL tools help agents retain clients after a claim, not just win the initial quote.'
    ]
  },
  {
    slug: 'ai-tools-for-health-insurance-agents',
    title: 'Best AI Tools for Health Insurance Agents',
    description: 'Open enrollment creates a predictable crunch. These AI tools help health agents match plans, communicate at scale, and stay mindful of privacy rules.',
    publishDate: '2026-08-24',
    lastReviewed: '2026-08-24',
    targetKeyword: 'AI tools for health insurance agents',
    vertical: 'health',
    topic: 'reviews',
    caseSummary: [
      'Health insurance automation is most valuable during open enrollment, when lead volume spikes and deadlines are fixed.',
      'Plan-matching and eligibility tools save agents from repeated manual lookups.',
      'Client communication tools must be configured to avoid guaranteeing coverage or outcomes.'
    ]
  },
  {
    slug: 'ai-tools-for-home-insurance-agents',
    title: 'Best AI Tools for Home & Property Insurance Agents',
    description: 'Property insurance has unique AI use cases: climate risk, aerial imagery, and damage estimation. Here is what home insurance agents should know.',
    publishDate: '2026-08-24',
    lastReviewed: '2026-08-24',
    targetKeyword: 'AI tools for home insurance agents',
    vertical: 'home',
    topic: 'reviews',
    caseSummary: [
      'Home insurance AI focuses on risk assessment before binding and damage estimation after a loss.',
      'Aerial imagery and climate-risk data are now accessible to independent agents, not just carriers.',
      'Property claims tools help agents advocate for policyholders during the repair process.'
    ]
  },
  {
    slug: 'ai-lead-qualification-insurance-agents',
    title: 'AI Lead Qualification for Insurance Agents: How It Actually Works',
    description: 'Static quote forms lose leads. Conversational AI can qualify prospects in real time and route them to the right carrier — if the workflow is set up correctly.',
    publishDate: '2026-08-24',
    lastReviewed: '2026-08-24',
    targetKeyword: 'AI lead qualification insurance',
    vertical: 'general',
    topic: 'workflows',
    caseSummary: [
      'Traditional quote forms convert poorly because they ask for too much before delivering value.',
      'Conversational AI collects intent first and data second, improving completion rates.',
      'Responding within five minutes can raise conversion likelihood by roughly 30-50%.'
    ]
  },
  {
    slug: 'ai-quoting-tools-insurance-agents',
    title: 'AI Quoting Tools: Faster Comparative Rating for Independent Agents',
    description: 'AI pre-fill and appetite matching are changing comparative rating. Learn how these tools work and where they still fall short.',
    publishDate: '2026-08-24',
    lastReviewed: '2026-08-24',
    targetKeyword: 'AI comparative rating insurance',
    vertical: 'general',
    topic: 'workflows',
    caseSummary: [
      'Quoting is the most mature AI workflow in independent insurance because the ROI is immediate and measurable.',
      'AI pre-fill reduces manual data entry; appetite matching routes risk to the right carrier faster.',
      'Single-carrier AI tools differ from multi-carrier comparative raters in scope and integration depth.'
    ]
  },
  {
    slug: 'ai-crm-tools-insurance-agents',
    title: 'Best AI CRM Tools for Insurance Agents (Renewals & Follow-Up)',
    description: 'Renewals are where agencies leak revenue. These AI CRM features help agents identify cross-sell opportunities and automate follow-up without sounding robotic.',
    publishDate: '2026-08-24',
    lastReviewed: '2026-08-24',
    targetKeyword: 'AI CRM insurance agents',
    vertical: 'general',
    topic: 'workflows',
    caseSummary: [
      'Renewals and lapses cost agencies more revenue than lost new business in most years.',
      'AI CRM tools identify cross-sell timing and flag policies likely to lapse.',
      'Integration with the existing AMS or agency management system is usually the biggest implementation hurdle.'
    ]
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}

export function getArticlesByVertical(vertical: string): Article[] {
  return articles.filter(a => a.vertical === vertical);
}

export function getArticlesByTopic(topic: string): Article[] {
  return articles.filter(a => a.topic === topic);
}

export function getAllArticles(): Article[] {
  return articles;
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return articles
    .filter(a => a.slug !== article.slug && (a.vertical === article.vertical || a.topic === article.topic))
    .slice(0, limit);
}
