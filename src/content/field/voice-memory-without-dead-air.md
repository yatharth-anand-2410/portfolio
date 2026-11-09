---
title: "Voice memory without dead air"
summary: "Giving voice agents a memory lookup that never makes the caller wait: a fast graph query, a hard timeout, and fetching memory before anyone picks up."
date: 2026-10-15
metric: "p50 230ms"
tags: [voice-agents, latency, knowledge-graphs]
order: 1
---

## The problem

At a B2B sales-AI startup we gave our voice agents a memory tool. Mid-call, the agent could look up what we already know about the person on the line.

Our general memory search took 1 to 4 seconds a query. In chat that is fine. On a phone call it is dead air. The caller says something, then hears nothing, and starts wondering if the line dropped.

So the first job looked simple: make the lookup fast. The second job turned out to matter more. It was to stop the lookup from sitting inside the conversation at all.

## What we changed

### A separate, smaller path for voice

The general search does a lot. It uses embeddings, an LLM, and a cross-encoder to rerank. That is the right design when the question is open-ended. On a call, most questions are about the caller, and we already know who the caller is.

So we dropped embeddings, the LLM and the cross-encoder from the voice path. A question about the caller became one graph query that starts from a node id we can compute. No search step to find the node. No model call to interpret the question. We go straight to the node and read what is attached to it.

### Cap the tie-breaker

Ranking still had a fuzzy tie-breaker. When we profiled it, that tie-breaker was 93% of ranking time. We capped it at the top 50 candidates. Ranking went from 15.7ms to 6.8ms.

We tried lower. At 30 the answers changed. The tie-breaker was reordering candidates that mattered, and cutting at 30 dropped some of them. So 50 was the floor. A cap that changes answers is not an optimization, it is a regression.

### A hard timeout, no retry

Lookups about the caller time out at 800ms. We do not retry.

A retry looks safe, but on a call it is the worst option. A late correct answer arrives after the conversation has moved on. The agent either ignores it or says something out of context. An immediate empty result is better: the agent carries on with what it knows. So after 800ms we give up and the agent keeps talking.

With these changes p50 came down to 230ms.

### Turn 0 showed the real problem

Then we looked at a live call and found something the latency numbers had hidden.

The agent's first lookup fired at the start of the call. And the first thing people say is "Hello". On one live call, that "Hello" waited 4.1 seconds on a search that could never find anything. A greeting is not a question.

Making the search faster would not have fixed this. The search did not belong in that turn.

### Move the work in time

Now memory is fetched at the same time as call setup, before anyone picks up:

```
before:
  pickup -> "Hello" -> [search ........ 4.1s] -> agent speaks

after:
  dial ------------------------------> pickup -> agent speaks
  fetch memory (parallel with setup) -^   (already knows who it's talking to)

mid-call:
  caller speaks -> agent keeps talking
                   lookup runs alongside -> result joins when ready
```

The agent's first word already knows who it is talking to. Mid-call, lookups are non-blocking. The conversation keeps moving while the search runs, and the answer joins when it is ready instead of holding the turn hostage.

### Empty and failed look identical

One detail made this safe. The model reads tool output out loud. An instruction containing the word "error" once got spoken on a call.

So an empty result and a failed one are byte-identical. The agent cannot narrate the difference, because it cannot see one. A timeout, a missing node and a graph failure all return the same thing, and the agent behaves the same way for each.

## What I learned

Fast was not the goal. The goal was to keep the search out of the turn.

On voice, speed is not only about making the work faster. It is about choosing when the work happens. Prefetching at call setup removed the wait entirely for the case that happens on every call. The timeout and the identical empty result handled the case where the lookup is slow or broken.

Two smaller lessons came along with it. Check the cap against the answers, not just the timing. And whatever a tool returns will be spoken, so design the return value as if it were a script.
