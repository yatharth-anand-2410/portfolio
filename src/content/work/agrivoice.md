---
title: "AgriVoice: voice and WhatsApp agents for the agri value chain"
summary: "A B2B platform where agri-input distributors build regional-language AI agents, run outreach campaigns to farmers and retailers, check farms against satellite and weather data, and capture purchase orders."
kind: "Product"
status: "Deployed, proof-of-concept stage (Bihar corn-seed campaign)"
stack: ["Django", "Postgres", "React", "Gemini", "ElevenLabs", "WhatsApp (Twilio / Meta)", "Sentinel-2 / emem", "Render", "Vercel"]
liveUrl: "https://agrivoice-rho.vercel.app"
order: 2
---

## The problem

An agri-input distributor sells seed and crop-care products through a network of retailers to farmers spread across many districts, speaking different dialects. Reaching them means phone calls in the right language at the right time, and knowing what each farmer's field actually needs. Doing that by hand does not scale, and a generic chatbot knows nothing about the farm or about which retailer has stock.

AgriVoice puts that whole loop in one dashboard: reach out, understand the farm, recommend the right product, and route the order to the nearest retailer that has it.

## How it works

**For the distributor.** They onboard a company, build an agent from a regional template (prompt, voice, model, language, knowledge base, tools), test it in the browser, and publish it as a live voice agent. They upload a lead sheet, and a campaign runs it as an outreach sequence: WhatsApp first, then a call, then SMS and follow-ups.

**For the farmer.** A farmer shares a name, a mobile number, and a pin on their farm. The platform then:

1. **Reads the field.** It resolves the location, finds the parcel boundary, and pulls Sentinel-2 vegetation and moisture indices, soil data, and weather. It infers the crop, its growth stage, and this week's risks.
2. **Calls in their dialect.** An outbound voice call carries the farm context into the conversation.
3. **Sends a WhatsApp report.** The farmer replies "YES", and the platform recommends products, finds the nearest retailer with stock, creates a purchase order, and routes it.

## Design decisions

**An outreach engine with guardrails, not a blast tool.** Each lead moves through a state machine over the agent's outreach sequence. Calls only go out between 09:00 and 19:00 IST, daily and per-lead caps apply, and the sequence stops as soon as the person replies. Every attempt is logged, so any lead's history can be reconstructed.

**Facts that can be verified.** Each satellite-derived fact about a farm is stored with a content identifier, so it can be checked independently afterwards. The crop and risk inference runs on a language model, with a rule-based fallback when no model is available. The model interprets the data, and the data stays traceable.

**Webhooks that survive the real world.** The post-call webhook is signature-checked and idempotent by conversation id, and a reconciliation job pulls any call whose webhook never arrived. The WhatsApp "YES" path is idempotent too: a repeated reply returns the existing order instead of creating a second one.

**Ranking retailers by business rules.** The distributor's retailer network is part of the agent's knowledge. When a farmer is ready to order, retailers are ranked by editable weighted rules (business model, available inventory, distance, manual override), and the agent reads out the top choice first.

**Post-call analysis against a goal.** After a call, the model judges whether the campaign goal was met for that lead and explains why. Conversions roll up into the campaign's success metric. Every LLM call is logged with its token count and purpose, so cost is visible per feature.

**Built to be tested without telephony.** Dev simulators run the whole loop (call, WhatsApp, order) without provider keys, which made it possible to test the full flow repeatedly without calling real people.

## Testing, and what was not tested

An API-level run of the full test sheet against a live local backend, with real Gemini and ElevenLabs calls, finished with **57 passed, 0 failed, and 2 partial**. The automated suite adds 47 passing tests. The run covered signup and organisation isolation, agent publishing, lead uploads, the outreach state machine, call-window enforcement, order routing, and journey insights.

It also found real bugs, which are fixed: a Gemini client that broke when requests crossed event loops, and transient model overloads that took down a feature until retries with backoff were added.

What it did not cover: a real phone call and a real WhatsApp delivery. Those steps need a purchased phone number and approved WhatsApp credentials, and the run used the platform's simulated path rather than ringing unknown numbers. Those are the next steps before this is more than a proof of concept.

## What it taught me

Voice agents fail at the edges, not in the conversation: a call at the wrong hour, a webhook that never arrives, a customer who replies twice. Most of the engineering went into making those paths boring and recoverable.
