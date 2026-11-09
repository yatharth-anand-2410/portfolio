// Registry for interactive research demos. Each slug has a page at src/pages/lab/<slug>.astro.
export interface LabDemo {
  slug: string;
  title: string;
  summary: string; // one line: what the visitor can do
  repo: string; // GitHub repo name under yatharth-anand-2410
  order: number;
}

export const lab: LabDemo[] = [
  { slug: 'decoding', title: 'Decoding playground', summary: 'Drag temperature, top-p and min-p and watch the next-token distribution change.', repo: 'llm-decoding-strategies', order: 1 },
  { slug: 'logit-lens', title: 'Logit lens', summary: 'Scrub through Llama 3’s layers and see where the answer first appears.', repo: 'llm-mechanistic-interpretability', order: 2 },
  { slug: 'qape', title: 'Prompt evolution for quantized SLMs', summary: 'Compare baseline and evolved prompts, and see how much a 4-bit model recovers.', repo: 'quantized-slm-prompt-optimization', order: 3 },
  { slug: 'weight-surgery', title: 'Weight surgery', summary: 'Corrupt a share of Llama 3’s weights and read how its output degrades.', repo: 'llama3-mlx-research-lab', order: 4 },
];
