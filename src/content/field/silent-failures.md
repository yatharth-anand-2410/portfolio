---
title: "Silent failures in agent systems"
summary: "A WhatsApp message marked sent that never was, a signal pipeline that leaked its own answers, and why agent failures look like success."
date: 2026-11-01
tags: [reliability, whatsapp, data-quality, agents]
order: 4
draft: true
---

<!-- DRAFT: confirm confidentiality before publishing -->

## The problem

The worst bugs I have fixed in agent systems did not fail. They reported success.

Two examples from a B2B sales-AI startup. Neither raised an error. Both made the product look healthy while it did the wrong thing.

## What we changed

### A "sent" that was not sent

A WhatsApp message could fail to send and still be shown as sent. The status field said what we hoped, not what happened. A lead who never got a message looked, in the dashboard and in the cadence logic, like a lead who had.

That is worse than an error. An error would have triggered a retry or a different channel. A false "sent" told the system to wait for a reply that could never come.

The fix was to surface silent send failures as failed. A message counts as sent only when the provider confirms it. If the confirmation never arrives, or says otherwise, the status is failed and the cadence can react.

### A pipeline that graded its own homework

The second case was a pipeline that correlated intent signals with outcomes. It produced numbers, and the numbers looked fine. They were not.

There were three problems, and they compounded:

- **Data leakage.** Information from after the outcome had found its way into the inputs, so the signal appeared to predict things it had only been told.
- **Sampling bias.** The data we measured on was not the data we would see in use, so the correlations did not carry over.
- **A broken metric.** The score we used to judge the pipeline did not measure what we thought it measured.

Fixing it meant removing the leaked inputs, correcting the sample, and repairing the metric. We also capped training data at first conversion, so the model learned from what happened before a lead converted, not after.

## What I learned

Agent failures look like success. The system returns an answer, the status is green, and the dashboard fills in. Nothing throws. I wrote about the same pattern in memory systems in [The bug that makes data disappear](/blog/the-bug-that-makes-data-disappear), where a node quietly lost its attributes with no exception at all.

A few habits help:

- **Treat every status as a claim.** Ask what evidence backs it. "Sent" should mean a provider said so.
- **Check the metric before the model.** If the number is wrong, every decision made on it is wrong.
- **Look for the future in your inputs.** Leakage is almost always something known too late.
- **Build for the failure you cannot see.** If there is no alert for it, there is no failure as far as anyone knows.

Accuracy on a benchmark does not catch any of this. Production often tells you nothing, because there is nothing to catch. You have to go looking.
