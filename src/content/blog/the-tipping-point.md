---
title: "The Tipping Point: Identifying the Threshold of Quantized Weight Corruption"
date: 2026-04-05
description: "Subtracting from the bit-packed weights of a 4-bit Llama 3 8B shows a sharp tipping point near a shift of 1,000,004, where the model collapses mid-sentence."
tags: [llama3, mlx, quantization, weights]
---

## Objective
To determine the precise mathematical threshold at which uniform bit-level perturbations to 4-bit quantized LLM weights cause catastrophic model collapse. We aim to understand how robust these compressed models are to "bit-level noise."

## The Mechanics of 4-bit Quantization
In the MLX framework, Llama 3 weights are stored as 4-bit integers, but they are "packed" into `uint32` containers to save memory and optimize hardware throughput. Specifically:
- Each `uint32` element actually contains **8 separate 4-bit weights**.
- These weights are dequantized on-the-fly during inference using a `scale` and `bias` factor.

The critical insight is that when we perform an operation on the `uint32` container, we are not modifying a single weight; we are performing parallel bitwise arithmetic on 8 weights at once.

## The Experiment: Systematic Weight Corruption
Using Llama 3 8B (4-bit quantized) on Apple MLX, we systematically subtracted increasing integer values from the packed `uint32` weights of the `lm_head` layer.

### The "Surgical" Code
```python
import mlx.core as mx

# The target: lm_head layer
original_weights = weights["lm_head"]["weight"]

# The Perturbation: Subtracting from the bit-packed container
# shift = 1,000,000 (The Threshold)
corrupted_weights = original_weights - shift

# Inject back into the model
model.update({"lm_head": {"weight": corrupted_weights}})
```

We observed the model's response to the prompt *"What is 2+2?"* across a range of shifts from 0 to 100 million.

## Results: The Observation Table

| Shift Amount | % of Int32 Range | Model Response | Status |
| :--- | :--- | :--- | :--- |
| 0 | 0.0% | "The answer to 2+2 is 4" | 🟢 Healthy |
| 1,000,000 | 0.023% | "The answer to 2+2 is 4" | 🟢 Healthy |
| 1,000,003 | 0.023% | "The answer is 4 obceLIKELYHonestly..." | 🟠 Mid-sentence collapse |
| 1,000,005 | 0.023% | "The answer permalinkizmet..." | 💀 Catastrophic Failure |

## Core Finding: Bit-Level Borrow Propagation
The experiments revealed a sharp **"Tipping Point"** at a shift of approximately **1,000,004**. 

### Why the sudden collapse?
When we subtract a large number from a `uint32`, the CPU performs **binary subtraction**. If the result in one bit-column is negative, it "borrows" from the next. 

In a packed 4-bit format, a large enough subtraction in the lower bits eventually causes a **borrow chain** that propagates through the entire `uint32` container. At the threshold (~1M), this chain reaches the upper nibbles, effectively flipping the sign bits or significantly shifting the magnitudes of all 8 packed weights simultaneously.

### The Logit Smear
By visualizing the `lm_head` output before the Softmax layer, we observed that:
1. **Shifts < 1M**: The logit for the correct token (" 4") remains dominant.
2. **Shift = 1,000,004**: The probability mass suddenly "smears" across the entire vocabulary. The correct token is no longer in the Top-K.

## Key Insights
1. **Resilience vs. Fragility**: 4-bit quantized models are surprisingly robust to small noise but have a "hard floor." Once bit-borrowing crosses a nibble boundary, recovery is impossible.
2. **Quantization is Not Floating Point**: Traditional weight decay or noise injection techniques designed for float32 will fail or behave unpredictably on packed quantized weights because they don't account for the bit-packing layout.
3. **Inference Engineering**: Understanding these thresholds is vital for developing robust decoding strategies that can "shield" models from hardware-level bit-flips or memory corruption.

---
*For the full code and reproduction steps, see [Notebook 06: Sensitivity Analysis](https://github.com/yatharth-anand-2410/llama3-mlx-research-lab/blob/main/notebooks/06_sensitivity_analysis.ipynb).*
