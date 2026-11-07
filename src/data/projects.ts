export interface Project {
  title: string;
  repo: string;
  summary: string;
  tags: string[];
}

// Curated list. Descriptions are taken from each repository's own description.
export const research: Project[] = [
  {
    title: 'Quantization-Aware Prompt Evolution',
    repo: 'quantized-slm-prompt-optimization',
    summary:
      'Evolutionary prompt optimization for small language models on consumer hardware, testing whether prompt mutations preserve reasoning quality under low-precision inference.',
    tags: ['SLMs', 'quantization', 'prompt optimization'],
  },
  {
    title: 'Llama 3 MLX Research Lab',
    repo: 'llama3-mlx-research-lab',
    summary:
      'An AI research lab exploring Llama 3 with Apple MLX: local inference, LoRA fine-tuning, direct weight manipulation, and quantized weight sensitivity analysis.',
    tags: ['MLX', 'Llama 3', 'LoRA'],
  },
  {
    title: 'Mechanistic Interpretability',
    repo: 'llm-mechanistic-interpretability',
    summary:
      'PyTorch tooling for activation patching, Logit Lens analysis, and transformer layer inspection, studying how prompt formatting changes internal representations in Llama 3.',
    tags: ['PyTorch', 'interpretability'],
  },
  {
    title: 'LLM Decoding Strategies',
    repo: 'llm-decoding-strategies',
    summary:
      'What happens after the logits: comparing decoding strategies such as contrastive search, top-p, and min-p, including how well they recover a model with corrupted weights.',
    tags: ['decoding', 'MLX', 'NumPy'],
  },
];

export interface Contribution {
  repo: string;
  stars: string;
  title: string;
  url: string;
  note: string;
}

export const contributions: Contribution[] = [
  {
    repo: 'getzep/graphiti',
    stars: '~32k stars',
    title: 'fix(attributes): preserve prior node attributes when no entity type applies',
    url: 'https://github.com/getzep/graphiti/pull/1764',
    note: 'Merged. A data-integrity fix in a knowledge-graph memory library for AI agents, shipped with regression tests that fail before the fix and pass after.',
  },
];
