---
title: "Manual Weight Surgery: Locating the LLM's 'Brain' and 'Voice'"
date: 2026-04-06
description: "Zeroing the embedding matrix and the LM head of a quantized Llama 3 to see which layers handle input understanding and which handle output."
tags: [llama3, mlx, interpretability]
---

## Objective
Can we manually identify which layers of a Large Language Model (LLM) are responsible for input understanding and output generation by literally "deleting" them?

## Setup
- **Model**: Llama-3-8B-Instruct-4bit (MLX)
- **Framework**: Apple MLX
- **Hardware**: MacBook M3 (16GB)

## Experiment
Using the MLX framework, I directly accessed the weight matrices of the quantized Llama 3 model. I performed two primary "surgeries":

1. **The Brain Removal**: I identified the `model.embed_tokens.weight` matrix and replaced all its values with zeros.
2. **The Voice Removal**: I identified the `lm_head.weight` matrix and replaced all its values with zeros.

```python
# Brain Surgery: Zeroing Embeddings
model.update({"model": {"embed_tokens": {"weight": mx.zeros_like(weights["model"]["embed_tokens"]["weight"])}}})

# Voice Surgery: Zeroing LM Head
model.update({"lm_head": {"weight": mx.zeros_like(weights["lm_head"]["weight"])}})
```

## Results
- **Zeroing Embeddings**: The model's input comprehension completely collapsed. Regardless of the prompt, the model produced nonsensical, random tokens. It could no longer "see" the meaning of the words coming in.
- **Zeroing LM Head**: The model's output capability was destroyed. It could process the input internally, but the final projection to the vocabulary space was zeroed out, resulting in constant, repetitive tokens (usually the same BOS or EOS token).

## Insights
This experiment empirically proves that:
- **Embeddings** are the "Brain": They map discrete tokens into the semantic hidden space where all reasoning happens.
- **LM Head** is the "Voice": It translates the high-dimensional hidden state back into human-readable tokens.
- **Quantization Resilience**: Interestingly, zeroing these layers didn't crash the MLX engine; the mathematical flow of tensors continued, demonstrating the robustness of the inference graph.

## Project Repository
[Llama 3 MLX Research Lab](https://github.com/yatharth-anand-2410/llama3-mlx-research-lab)
