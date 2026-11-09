---
title: "Call and WhatsApp cadences as one system"
summary: "How scheduled calls, WhatsApp follow-ups, callbacks, qualification and memory fit together in a sales-AI product, and how call procedures improve themselves."
date: 2026-11-01
tags: [voice-agents, whatsapp, agents, architecture]
order: 3
draft: true
---

<!-- DRAFT: confirm confidentiality before publishing -->

## The problem

A sales conversation is rarely one call. A prospect misses the first one. They ask to be called later. They would rather chat on WhatsApp. Someone has to remember all of that and act on it.

At a B2B sales-AI startup, we built voice and WhatsApp agents to do this work. The hard part was not any one channel. It was getting the pieces to behave like one system, so a call, a message and a callback all know what the others did.

## What we changed

### Cadences, not single messages

The unit of work is a cadence: an ordered plan of calls and WhatsApp messages for a lead. Outbound calls are scheduled in batches with configurable spacing, so a campaign does not hit everyone at once. A qualify-and-demo cadence mixes both channels, for example a call followed by a WhatsApp message if nobody answers.

WhatsApp has its own rules. Templates can be retried when they fail. Free-form messages are only allowed inside the messaging window, so the system has to know which side of that window it is on before it chooses what to send.

### Route on what happened

After a call attempt, the outcome decides the next step. Connected and not-connected are different paths. A connected call goes to the conversation analysis. A call that did not connect goes back into the cadence, often with a WhatsApp message.

### Callbacks are first-class

People ask to be called back, sometimes explicitly ("call me later") and sometimes only by implication ("I'm driving right now"). The system detects both and turns them into a scheduled callback. The callback then re-enters the cadence instead of living in someone's notes.

### Disposition and qualification from transcripts

When a call or a WhatsApp chat ends, a model reads the transcript and assigns a disposition and a qualification. The same logic covers both channels, so a lead has one consistent status regardless of where the conversation happened. That status feeds back into the cadence: qualified leads move toward a demo, others go quiet or get a different follow-up.

### Memory shapes the first message

Before a call, customer memory is passed to the voice agent. The first message is generated from that memory and spoken at pickup. The agent opens with what we already know, not with a generic greeting. The same memory is available to WhatsApp, so the two channels do not contradict each other.

### Procedures that improve themselves

Calls are scored. The agent's call procedure, the script and rules it follows, is rewritten from the scored calls. Good patterns get kept and weak ones get revised. A person can review the change, but the loop is built to run without someone editing prompts by hand.

## What I learned

The channels are the easy part. The value is in the state between them: what happened, what the lead said, and what should happen next. If that state is wrong, a perfectly working call agent will still call the wrong person at the wrong time.

Two rules came out of this. Make every outcome an explicit state, including not-connected and callback requested. And keep qualification in one place that both channels write to, so the next action never depends on which channel the lead happened to use.
