---
layout: ../../layouts/BlogPost.astro
title: "🧱 Refactoring for Sanity: Taming a Wild Merchandising Widget"
description: "A deep dive into how I stabilized a high-traffic merchandising widget by rebuilding it layer by layer—from fragile frontend to brittle backend."
pubDate: 2017-05-18T12:00:00Z
category: engineering
tags: [refactoring, debugging, reliability, observability, javascript, rest, amazon]
---


When I joined the team, one of the first things handed to me was a customer-facing widget that looked deceptively simple: a Pinterest-style scroll of products we called “Waterfall.” It was popular with users and internal teams alike, but behind the scenes, it was a mess.

The bug count? High. The incident rate? Frequent. The joy of working on it? Low.

Here’s what I did to fix that—and what I learned in the process.


### What We Were Dealing With

The frontend had been written as a single, sprawling JavaScript file—no modules, no tests, no real separation of concerns. Imagine working inside a cluttered attic where touching one box knocks five others over.

On the backend, the rendering service relied on JSP templates that tried to serialize Java objects into JSON, with just enough brittle glue code to break regularly. There were mysterious null pointer exceptions, layout issues that varied by marketplace, and a general sense that any change was risky.

The data API was also... an adventure. Instead of clean REST endpoints, it served big blobs of data tailored to very specific frontend assumptions. Debugging it felt like time-traveling with a blindfold.



### The Approach: One Layer at a Time

Rather than rewrite everything (which I definitely fantasized about), I started decomposing the system into testable, observable pieces.

#### 1. Rebuilding the Frontend

I broke the JavaScript into smaller modules using a basic MVC structure, introduced a build pipeline, and wrote unit tests. This alone uncovered multiple hidden bugs. I also added frontend metrics and logging so we could trace what was happening in the browser—something we never had before.

#### 2. Stabilizing the Rendering Layer

I replaced the fragile JSP/JSON combo with proper model classes and a dedicated JSON serializer. This removed a whole class of bugs we’d been patching over manually.

#### 3. Fixing the API

Instead of one overloaded endpoint that served all data to all clients, I split things into clean, focused REST endpoints. I also added debug flags, so on-call engineers could turn up log verbosity without deploying new code.

#### 4. Making It Operable

The app had no dashboards, no alerts, and no rollout safety. I wired it up to our CI pipeline with automated tests, set up proper staging, added log rotation, metrics, and dashboards. After that, releases stopped feeling like gambling.



### Results (and Relief)

After the refactor:

- The average bug report count dropped from ~12/month to ~1.
- On-call time plummeted.
- Engineers could understand the codebase, test it, and make changes without fear.
- We actually started getting compliments instead of complaints.



### What I Took Away

- **If you can’t observe it, you can’t fix it.** Adding logs and metrics made everything else easier.
- **Testing isn’t just about correctness—it’s about courage.** It gave us the confidence to make improvements without breaking things.
- **You don’t always need a rewrite.** Modularizing what’s there, and wrapping it in guardrails, can go a long way.



This was one of those projects that reminded me: good engineering isn’t just building something flashy—it’s making sure what you’ve built can survive contact with the real world.
