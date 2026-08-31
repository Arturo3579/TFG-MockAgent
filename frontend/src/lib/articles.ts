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
  },
  {
    slug: 'ai-claims-fnol-insurance-agents',
    title: 'AI for Claims and FNOL: What Agents Need to Know',
    description: "Agents aren't adjusters, but they're often the first call after a loss. Here's how AI is changing FNOL intake, fraud review, and damage estimation — and what stays outside the agent's control.",
    publishDate: '2026-08-29',
    lastReviewed: '2026-08-29',
    targetKeyword: 'AI claims FNOL insurance',
    vertical: 'general',
    topic: 'workflows',
    caseSummary: [
      `Claims experience is consistently one of the strongest drivers of whether a client renews — even though the agent doesn't process the claim.`,
      `AI-assisted FNOL (first notice of loss) intake replaces phone tag and paper forms with structured, faster data capture.`,
      `Fraud-detection models run on the carrier side and can delay a legitimate claim for review — agents should know this exists without speculating about specific cases.`,
      `Claims triage/routing tools and damage-estimation tools solve different problems; don't confuse the two when evaluating vendors.`
    ]
  },
  {
    slug: 'ai-chatbots-insurance-customer-service',
    title: 'Best AI Chatbots for 24/7 Insurance Customer Service',
    description: 'After-hours calls are expensive to staff and often simple to answer. Here\'s what makes an insurance chatbot actually useful — and the failure modes that erode client trust.',
    publishDate: '2026-08-29',
    lastReviewed: '2026-08-29',
    targetKeyword: 'AI chatbot insurance customer service',
    vertical: 'general',
    topic: 'workflows',
    caseSummary: [
      `Most after-hours contact is simple and repetitive: status checks, document requests, proof-of-insurance, appointment scheduling.`,
      `A good insurance chatbot knows exactly when to hand off to a human — the failure mode is a bot that pretends to know more than it does.`,
      `General customer-service platforms (Intercom, HubSpot, Zendesk) and custom bots built on OpenAI or Anthropic APIs both show up in this space, with different tradeoffs.`,
      `Coverage questions and privacy-sensitive requests should always escalate to a licensed human, not stay with the bot.`
    ]
  },
  {
    slug: 'chatgpt-claude-insurance-policy-summaries',
    title: 'How to Use ChatGPT or Claude to Draft Insurance Policy Summaries for Clients',
    description: 'Manually summarizing a policy for a client eats time you don\'t have. Here\'s a prompt framework that works, and the privacy line you shouldn\'t cross with client data.',
    publishDate: '2026-08-29',
    lastReviewed: '2026-08-29',
    targetKeyword: 'ChatGPT for insurance agents',
    vertical: 'general',
    topic: 'tutorials',
    caseSummary: [
      `General AI assistants like ChatGPT and Claude are genuinely useful for turning dense policy language into a plain-English summary a client can actually read.`,
      `A good prompt asks for structure (coverage, limits, exclusions, what changed) rather than a free-form paraphrase.`,
      `Never paste a client's full policy document, claim number, or personal details into a consumer-tier AI tool without checking your data-handling obligations first.`,
      `Always verify the AI-generated summary against the actual policy document before sending it to a client — the model can miss or misstate a detail.`
    ]
  },
  {
    slug: 'ai-prompts-insurance-follow-up-emails',
    title: 'AI Prompt Templates for Insurance Lead Follow-Up Emails',
    description: 'Five ready-to-adapt prompts for common follow-up scenarios, plus the compliance guardrails that matter more than the wording.',
    publishDate: '2026-08-29',
    lastReviewed: '2026-08-29',
    targetKeyword: 'insurance follow up email AI prompt',
    vertical: 'general',
    topic: 'tutorials',
    caseSummary: [
      `Follow-up timing matters more than follow-up wording — responding within the first five minutes has a bigger effect on conversion than a perfectly worded email sent hours later.`,
      `These five prompt templates cover the most common follow-up scenarios independent agents face.`,
      `Never let an AI-written email include guaranteed-savings language, promised approval odds, or anything that implies a quote before underwriting is complete.`,
      `Check your state's rules on required disclosures in client communication before sending AI-assisted messages at scale.`
    ]
  },
  {
    slug: 'free-ai-tools-insurance-agencies',
    title: 'Best Free & Budget AI Tools for Small Insurance Agencies',
    description: 'The vendor blogs push their own paid product. Here\'s what a solo agent or small agency can actually do with free and low-cost AI tools before spending anything.',
    publishDate: '2026-08-31',
    lastReviewed: '2026-08-31',
    targetKeyword: 'free AI tools insurance agency',
    vertical: 'general',
    topic: 'reviews',
    caseSummary: [
      `Most published "best AI tools for insurance agents" content is written by the software companies themselves, who have no reason to cover free options.`,
      `General-purpose AI assistants (ChatGPT, Claude, Gemini) offer genuinely useful free tiers for writing, summarizing, and drafting tasks — but message limits and features change frequently, so check current terms before relying on one.`,
      `Insurance-specific point tools rarely have a meaningful free tier; look for free trials instead, and use the 90-day proof-of-concept approach before paying for anything.`,
      `The right sequence for a solo agent is: exhaust free general-purpose tools first, then pay only for the one workflow that's your actual bottleneck.`
    ]
  },
  {
    slug: 'naic-ai-model-bulletin-insurance-agents',
    title: 'The NAIC AI Model Bulletin, Explained for Insurance Agents (Not Just Carriers)',
    description: 'The NAIC\'s AI bulletin is written for insurers, but it shapes what carriers expect from agents too. Here\'s what it actually says, which states have adopted it, and what to ask your carrier partners.',
    publishDate: '2026-08-31',
    lastReviewed: '2026-08-31',
    targetKeyword: 'NAIC AI model bulletin insurance agents',
    vertical: 'general',
    topic: 'compliance',
    caseSummary: [
      `The NAIC adopted its Model Bulletin on the Use of Artificial Intelligence Systems by Insurers on December 4, 2023.`,
      `By mid-2026, roughly 25 states plus DC had formally adopted it, with about 8 more in progress — this figure changes regularly, so verify current status.`,
      `The bulletin binds insurers directly, not agents — but it shapes what carriers require of agents during market-conduct exams and appointment renewals.`,
      `California, Colorado, New York, and Texas run their own separate AI-related insurance frameworks instead of adopting the NAIC bulletin outright.`
    ]
  },
  {
    slug: 'ai-vs-manual-underwriting-insurance-agents',
    title: 'AI vs. Manual Underwriting Support: What Independent Agents Should Know in 2026',
    description: 'Underwriting is moving faster with AI, but speed and accuracy trade off differently than agents might expect — and regulators are watching the fairness question closely.',
    publishDate: '2026-08-31',
    lastReviewed: '2026-08-31',
    targetKeyword: 'AI underwriting insurance agents',
    vertical: 'general',
    topic: 'workflows',
    caseSummary: [
      `AI-assisted underwriting has mainly changed turnaround time, not the fundamental judgment involved in complex or borderline risks.`,
      `Faster isn't always more accurate — algorithmic pre-screening can clear straightforward risks quickly while still routing complex cases to a human underwriter.`,
      `Bias and fairness in algorithmic underwriting are the specific focus of the regulatory frameworks covered in our NAIC bulletin guide.`,
      `Agents don't control underwriting outcomes, but they do control how clearly they set expectations with clients about what AI-accelerated underwriting can and can't guarantee.`
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
