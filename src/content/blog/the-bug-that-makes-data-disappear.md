---
title: "The bug that makes data disappear"
description: "A one-line fix I got merged into Graphiti: an attribute extractor returned an empty dict and quietly wiped what earlier passes had already extracted."
date: 2026-09-10
tags: [open-source, knowledge-graphs]
---

I got a bug fix merged into Graphiti, Zep's open-source temporal knowledge graph library. It was the kind of bug that never throws an error. It just makes data quietly disappear.

PR: [getzep/graphiti#1764](https://github.com/getzep/graphiti/pull/1764)

## What I saw

I was working on a knowledge-graph project when I noticed entity nodes losing attributes they had a moment earlier. No exception. No warning. A node would have two attributes after one write, then just one after the next.

Nothing was crashing, so there was nothing to search logs for. I had to follow one node through several writes and watch it shrink.

## The root cause

The attribute extractor returns `{}` whenever no entity type applies to a node. That happens in two cases: `entity_types=None` on that call, or the node's label is not in the type map you passed.

That empty dict is assigned straight onto `node.attributes`. Three things then line up:

1. A deduplicated node is the node hydrated from the database, so it already carries attributes from earlier passes.
2. The extractor overwrites those attributes with `{}`.
3. The save query does a wholesale `SET n = $entity_data`, which replaces the stored properties with whatever is on the node.

So an untyped pass overwrites everything a previous, correctly-typed pass had extracted. Each step is reasonable alone. Together they erase data.

## The fix

One line. On that path, return the node's prior attributes instead of `{}`.

This is not new behavior. It brings this path in line with an invariant the codebase already enforces elsewhere: `add_triplet` explicitly merges rather than replaces, and has its own regression test. One code path had forgotten the rule everyone else was following.

I added two regression tests. Both fail cleanly against main and pass with the fix.

## What I took from it

Building agentic systems means depending on very new frameworks, and new frameworks have bugs. That includes well-maintained ones with 400+ passing tests. Tests cover the paths someone thought of. This one was a path where two correct pieces met.

Reading the library's source is not optional once you rely on it in production. And sometimes fixing it yourself upstream is faster than waiting for someone else to hit the same wall.
