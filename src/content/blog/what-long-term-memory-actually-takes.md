---
title: "What long-term memory for agents actually takes"
description: "Three research problems hide behind 'long-term memory'. The engineering problems that eat your time are different, and they fail silently."
date: 2026-08-20
tags: [agents, memory]
---

"Long-term memory" sounds like one feature. It is a bundle of problems, and the ones that cost me the most time are not the ones in the papers.

## Three research problems

**1. What do you keep?** Not every moment is worth saving. AdaMem frames this as a write-control problem: learn what is worth remembering for a particular user or role.

**2. How do you find and use what you kept?** MemCon treats memory access as a learned decision. Retrieve less when memory is sparse. Reuse a plan for familiar tasks. Re-query when stuck. Consolidate and forget as memory grows.

**3. What do you believe?** When new information challenges old, an old memory may need replacing. Both may be valid in different contexts. Or they genuinely contradict and need reconciling. This is a belief-update problem, not a retrieval problem.

The papers I read to think about this: Generative Agents, Reflexion, Voyager, MemGPT, A-MEM, AdaMem and MemCon.

Those are the interesting problems. They are not the ones that consumed my time.

## The engineering nobody writes papers about

### The failures are silent

A broken memory system does not crash. There is no stack trace, no failed request, no alert. It returns 200 OK with a confident answer assembled from data that should never have been in scope.

Every serious bug I have hit in this space looked exactly like success. A benchmark tells you your accuracy. Production tells you nothing at all, because there is nothing to catch. One example I found and fixed upstream: [a node quietly losing attributes](/blog/the-bug-that-makes-data-disappear).

### Isolation is a correctness property, not a config

The moment memory is multi-tenant, "whose memory is this" stops being a privacy checkbox. It becomes a correctness constraint. A retrieval path that leaks across tenants is a wrong-answer generator.

And it has to hold in every read path. Not the one you tested. Every one.

### Extraction is the expensive default, and often the wrong one

A lot of what an agent "remembers" is data you already had in structured form. Paying a model to rediscover fields you wrote yourself is slow, expensive and lossy.

Worse, extraction merges things. A bad merge fuses two entities permanently. Use extraction where you genuinely do not know the shape. Write deterministically where you do.

### Forgetting is not deletion

Belief update looks like deletion right up until someone asks what you believed last month. Keeping both versions with a validity window solves that. It also creates a new problem: now every read has to filter. The one read that forgets will happily show the stale fact next to the current one.

### Every quality gain has a per-write price

Turning on real deduplication of facts made writes materially slower. That is the cost of not storing three copies of the same belief. The mistake is not paying that cost. The mistake is paying it by accident.

## Takeaway

The research questions tell you what a good memory should do. The engineering questions decide whether it does it on a Tuesday, for the right customer, without telling you it failed.

If I had to pick one thing to build first, it would be a way to know when memory is wrong. Without that, the rest is guesswork.
