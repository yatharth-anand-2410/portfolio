---
title: "Chessmasters: AI coaching for finished chess games"
summary: "A web app that runs Stockfish over a Lichess or Chess.com game and streams back a plain-English coaching report."
kind: "Product"
status: "Live, with a free tier and a paid plan"
stack: ["FastAPI", "Stockfish", "LLM (Gemini)", "Server-sent events", "TypeScript", "Supabase", "Render"]
liveUrl: "https://www.chessmasterss.in"
repoUrl: "https://github.com/yatharth-anand-2410/chess-masters"
video: "/videos/chessmasters-demo.mp4"
poster: "/videos/chessmasters-demo.jpg"
order: 1
---

## The problem

Players in the 800 to 1800 rating range review their games on Lichess or Chess.com and get engine numbers they cannot yet read. A centipawn swing tells you a move was bad. It does not tell you why, or what to practise. Chessmasters is built around that gap: coaching, not engine output.

## How it works

You paste a game URL. For Chess.com you also give your username, and the app finds the game in your public archive from the last three months. No password or account link is needed.

The backend runs Stockfish first. That gives it hard facts: where the evaluation swung, which moves were blunders, how many centipawns each one cost. Only then does a language model write the report, using those evaluations as its input. The engine decides what happened. The model explains it.

The report always has five sections: Strength, Weakness, Game Overview, Focus Areas, and Resources, which link to Lichess study drills. Key moments come with an interactive board, and the report includes evaluation and accuracy charts.

## Design decisions

**Engine first, model second.** Language models are unreliable at judging chess positions on their own. Feeding them Stockfish output keeps the coaching tied to evaluated moves instead of plausible-sounding guesses.

**Streaming over a spinner.** Analysis takes on the order of 10 to 15 seconds, which is long enough to lose a user staring at a loading wheel. The API streams status updates (extracting game data, running the engine, writing the report) and then the report text itself over server-sent events, so the page fills in as the answer is produced.

**A fixed report structure.** Constraining the model to five headings makes every report scannable and comparable between games, and lets the frontend render each section with its own components, such as the evaluation chart.

**An optional personality layer.** After three analyses, the app builds a psychological profile from the user's own blunders, covering tilt resistance, composure, and playing style.

## Product

The first analysis is free without an account, and signing in unlocks four more. The Pro plan is ₹399 a month for 100 analyses and adds follow-up questions about a game. The product is independent and not affiliated with Chess.com, Lichess, or the Stockfish project.

## What it taught me

Splitting the work between a deterministic tool and a language model is the same pattern I use in production agent systems: let the tool produce facts, let the model produce language, and keep the boundary between them explicit.
