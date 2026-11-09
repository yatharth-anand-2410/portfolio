---
title: "LeadForge: an agent that finds and verifies business leads"
summary: "Describe your ideal customer and a background agent finds matching businesses, crawls their sites, and returns a shortlist with verified contact details."
kind: "Open source"
status: "Open source, runs locally"
stack: ["Next.js", "TypeScript", "FastAPI", "Python", "SQLite", "LangChain deepagents", "OpenStreetMap", "Docker"]
repoUrl: "https://github.com/yatharth-anand-2410/leadforge"
order: 3
---

You can step through a real recorded run, with contacts masked, in the [LeadForge replay](/demos/leadforge/).

## The problem

Building a lead list by hand means searching maps, opening websites, hunting for contact pages, and checking whether an email address even works. Most of that is mechanical. LeadForge hands the mechanical part to an agent and keeps the judgment, which is deciding what a good lead looks like, with the user.

## How it works

You define an ideal customer profile: category, location, industry, company size, roles, and keywords. A job is queued, and a standalone worker picks it up and runs an agent.

The agent discovers real businesses from OpenStreetMap (through Overpass and Nominatim), with optional web search through SearXNG. It crawls each business's website, extracts contact points, and verifies them, including a DNS MX check on email domains. It deduplicates and scores the results.

The run stops when it has 10 leads, each with at least one verified contact, or when its sources run out.

## Design decisions

**A real job queue, kept simple.** Agent runs are slow and can fail halfway. The API writes a job to a table, and a separate worker process polls it. The web app never blocks on the agent, and a crashed run does not take the API down. SQLite keeps setup to a single file for a first version.

**Verified contacts, not scraped guesses.** A lead only counts if at least one contact point passed verification. That one rule keeps the output trustworthy at the cost of returning fewer results.

**Pluggable model providers.** The agent runs on Groq, Gemini, or OpenCode Go, so a user can choose by cost and speed rather than being tied to one vendor.

**Tracing from the start.** Runs are traced with LangSmith, so a bad result can be traced back to the step that produced it.

## Honest limits

Version 1 covers physical businesses only, because OpenStreetMap has little on SaaS and digital-only companies. Public SearXNG instances often block scrapers, which limits the optional web-search source.

## Run it

The repository includes a Makefile, a Docker Compose file, an `.env.example`, a pytest suite, and setup docs. You supply an API key for your chosen model provider, then run the API, the worker, and the web app.
