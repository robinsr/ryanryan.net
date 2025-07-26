---
layout: ../../layouts/BlogPost.astro
title: "Observability First: How I Instrument New Features Before They Ship"
pubDate: 2019-10-12T12:00:00.000Z
category: observability
description: "Shipping new features is exciting — but if you can't observe them, you're flying blind. Here's how I approach instrumentation before rollout, not after things go sideways."
tags: [observability, instrumentation, engineering-practices, metrics, debugging, devex]
---

## Observability First: How I Instrument New Features Before They Ship

Shipping something new is fun. Debugging it blind in production? Not so much.

Over the years, I’ve learned that **the best time to add observability is before your code ever sees real traffic**. Instrumentation shouldn’t be a cleanup step or a postmortem action item — it should be **part of the feature itself**.

Here’s how I build with observability first.


## 1. Define “What Good Looks Like” — Then Make It Measurable

Before I write a line of code, I ask: *What should this feature do when it's working well? And how would I know if it's not?*

That turns into things like:

- Expected usage patterns (e.g. request volume, success/failure rates)
- Performance expectations (e.g. latency, cache hits, DB query times)
- Edge conditions (e.g. empty inputs, rare configs, error fallbacks)

These become the foundation for the **metrics, logs, and alerts** I design alongside the feature.

> You can’t monitor what you don’t define. So start by defining “healthy.”


## 2. Instrument the Happy Path *and* the Edges

A common mistake: adding a single success metric and calling it a day.

Instead, I aim to capture:

- Successes (counted and tagged)
- Failures (with structured reasons)
- Skipped paths (why this code didn’t run)
- Timing data (to detect latency regressions)

When possible, I also add counters for fallbacks, retries, or degradation modes — anything that tells the story of how the system behaves when things get weird.


## 3. Emit Context That Makes Debugging Possible

Good logs and metrics don’t just say what happened — they say **what was happening around it**.

So I include:

- Request IDs, trace IDs, or correlation tokens
- Config inputs (e.g. feature flags, environment settings)
- Key entities (e.g. customer ID, campaign ID, page type)
- A known set of log messages with consistent structure and phrasing

This helps me search logs easily and cross-reference incidents across services.

> Think of your future self at 2AM. What context will they need to make sense of this?


## 4. Bake Observability into the Rollout Plan

Every feature rollout plan should include:

- **Dashboards** showing usage, success/failure, latency
- **Alerts** for critical thresholds (with paging or ticketing levels)
- **Smoke test monitors** to validate post-deploy health
- **Query bookmarks** for common triage paths

I usually build or update these *before* launch. That way I’m not trying to do it in the middle of an incident.


## 5. Socialize It with the Team

If I’m adding a new metric or log structure, I make sure it’s documented or demoed:

- Slack post with dashboard links
- README updates in the repo
- Screenshots in the feature rollout doc
- Shared queries in our observability tool

This makes it easier for my teammates — and my future self — to find and use the data.


## Final Thoughts

Instrumentation isn't overhead — it’s how you buy visibility, trust, and sleep. When observability is built in from the start, you don't just ship faster — you ship **with confidence**.

So every time I build something new, I ask myself:

> *“If this breaks in production, how long will it take us to know? And how easily can we tell why?”*

That’s when I know the feature is really ready to ship.
