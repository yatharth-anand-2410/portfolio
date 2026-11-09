---
title: "Zero writes at 9.5% CPU"
summary: "A knowledge graph that completed no writes for hours while the database sat nearly idle. Four real bottlenecks, one missing index, and a contention problem we built ourselves."
date: 2026-10-01
metric: "OOM errors 9,066/day → 0"
tags: [knowledge-graphs, neptune, performance]
order: 2
---

## The problem

Our knowledge graph completed zero writes for hours. The database was 9.5% busy.

A database at 9.5% CPU is either doing nothing because there is nothing to do, or doing nothing because every query is waiting on a lock. Those look identical on a CPU graph. We had work queued, so it was not the first. That left waiting, and CPU would never tell us what it was waiting on.

## What we changed

### Four real bottlenecks, none of them the cause

We fixed four things before we found the cause. Each was a genuine problem. Each was worth fixing. None of them was it.

- **Duplicate consumers on every worker.** Every worker was starting its own consumers for the same queue, so they competed for the same work.
- **Ungated writes firing off an HTTP callback.** Writes could start without any limit, triggered from a callback, so bursts piled onto the database.
- **Lock contention on hot vertices.** A few nodes were touched by many writes at once, and those writes queued behind each other.
- **One query per node.** Writing a batch meant a round trip for each node, where fewer queries would do.

### The cause: a missing index

The database was Neptune. It keeps three fixed statement indexes and gives you no user-defined property index. So when we matched a node on its uuid property, the query compiled down to a scan over every node carrying one.

The evidence was in records scanned per write. It tracked the node count exactly. Roughly 15,000 one week, over 90,000 the next. The system got slower every time we wrote to it. Each write made the next write more expensive.

### Key on the element id

The element id is something Neptune does index. Keying on it turned the scan into a prefix lookup. The cost of a write no longer grew with the size of the graph.

Out of memory errors went from 9,066 in 24 hours to zero.

### Success rate stayed at 0%

Out of memory errors going to zero was a real win, and it did not fix the writes. Success rate stayed at 0%.

The next cause was in how we had deployed. Nine or ten containers were writing into a graph with a single writer instance. That contention was ours. We built it by scaling out.

The fix was to elect one writer across the fleet and let the rest sit idle. One process writes.

## What I learned

Low CPU is not a signal that things are healthy. It tells you the database is not computing. It does not tell you why.

Fixing real bottlenecks is not the same as finding the cause. I spent time on four true problems because each one was easy to confirm. The number that cracked it was records scanned per write, lined up against node count. If a cost grows with the size of your data, look for a scan.

And parallelism into a single writer is not throughput. It is negative work. Before scaling a write path out, find out how many writers the thing at the other end actually has.

What I trust now for a write path is simple: completed writes, and the cost of one write as the graph grows. Everything else is a hint.
