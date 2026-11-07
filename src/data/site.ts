// Single source of truth for links used across the site.
export const UPWORK_URL = 'https://www.upwork.com/freelancers/~01fac4ae5d7206c51e';
export const GITHUB_URL = 'https://github.com/yatharth-anand-2410';
export const LINKEDIN_URL = 'https://linkedin.com/in/yatharth-anand-6945aa202';

export interface Offer {
  slug: string;
  name: string;
  tagline: string;
  forWho: string;
  youGet: string[];
  proof: { label: string; href: string };
}

// Offers are drawn from work already shown on this site. Prices and timelines are
// agreed per project on Upwork, so none are published here.
export const offers: Offer[] = [
  {
    slug: 'whatsapp-voice-agent',
    name: 'WhatsApp or voice AI agent',
    tagline: 'An agent that talks to your customers in their language and logs what happens.',
    forWho: 'Businesses that reach many customers by phone or WhatsApp and want to automate first contact, follow-ups, or order capture.',
    youGet: [
      'A working agent on WhatsApp, voice, or both, set up for your use case',
      'Outreach rules: calling hours, retry limits, stop-on-reply',
      'Conversation logging and post-call analysis against a goal you define',
      'A handover document so your team can run it',
    ],
    proof: { label: 'See AgriVoice', href: '/work/agrivoice/' },
  },
  {
    slug: 'document-qa',
    name: 'Document Q&A chatbot (RAG)',
    tagline: 'Ask questions of your own documents and get answers that point back to the source.',
    forWho: 'Teams with manuals, policies, catalogues, or knowledge bases that people struggle to search.',
    youGet: [
      'Ingestion of your documents into a searchable index',
      'A chat interface or API that answers with references',
      'Basic evaluation: a test set of real questions and how the system scores',
      'Guidance on cost and keeping the index up to date',
    ],
    proof: { label: 'See Chessmasters', href: '/work/chessmasters/' },
  },
  {
    slug: 'llm-cost-audit',
    name: 'LLM cost and reliability audit',
    tagline: 'Find where your LLM spend goes and cut it without hurting quality.',
    forWho: 'Teams already running LLM features whose bills or error rates are growing.',
    youGet: [
      'A review of your prompts, context size, and call patterns',
      'Specific changes such as prompt caching, context trimming, and model routing',
      'Retries and fallbacks for failure cases',
      'A short written report with prioritised fixes',
    ],
    proof: { label: 'About my background', href: '/about/' },
  },
];
