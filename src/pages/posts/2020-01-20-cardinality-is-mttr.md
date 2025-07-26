---
layout: ../../layouts/BlogPost.astro
title: "Cardinality Costs Me Money — And I Love It"
pubDate: 2020-01-20T12:00:00Z
category: observability
description: "High-cardinality logs and metrics can get expensive — but they're often the cheapest way to shrink your MTTR and keep your team sane. Here’s how I learned to love them."
tags: [observability, reliability, cardinality, on-call, debugging]
---

Most people think of cardinality as a problem. I think of it as a shortcut — the shortest path from “I don’t know what’s wrong” to “oh, that’s why.”

Yes, high-cardinality logs and metrics can be expensive. But if you're trying to debug a real system in production — one with global traffic, personalization, configuration drift, and unknown unknowns — they’re often the **cheapest way to reduce MTTR**.


## What Even *Is* Cardinality?

In the context of observability, **cardinality** refers to the number of unique values a dimension can take on. For example:

- `customerId` → high cardinality (millions)
- `campaignId` → high cardinality
- `region` or `statusCode` → low cardinality

Logs and metrics get harder (and pricier) to store, query, and render when they include high-cardinality dimensions. Vendors warn you about it. Infra teams warn you about it. And yet, during my time on-call for customer-facing content systems at Amazon, cardinality saved my ass more times than I can count.


## The 2AM Wakeup Call

Picture this: 2:13 AM, my phone buzzes. PagerDuty alert: `NA_FooService_responseTime_p99 > 500ms`. It’s North America, our content service, and the 99th percentile is spiking.

Our architecture was service-oriented, global, and configuration-driven. A given request might depend on customer history, product metadata, campaign targeting rules, and merchandiser-created widgets. When something failed, it failed selectively — one config, one region, one customer cohort at a time.

The first few times I got paged, I’d fumble through dashboards built around low-cardinality fields. Region, yes. HTTP status, sure. But which campaign was triggering the error? What customer segment? Which partner API was slow?

The answers were buried in vague log messages — when they were there at all.


## The Turning Point: Paying for Insight

Eventually, we made the call: if a field helps us explain or fix a problem, it belongs in logs and metrics. Even if it’s expensive.

We started emitting structured logs with `campaignId`, `pageType`, and `configMode`. We broke down latency metrics by widget class and render path. We tagged error logs with the user’s marketplace and experiment variant. We paid the cost.

But what we bought was **clarity**.

Debugging became a breadcrumb trail, not a scavenger hunt. Junior engineers could self-serve triage. Stakeholder escalations went down. And recurring issues stopped recurring — because we actually understood them.

> Cardinality became our **shortcut to narrative**. And narrative is everything during an incident.


## Using Cardinality With Judgment

It’s not free. But it’s not binary either. Here’s how we learned to use it well:

- **Tag logs with high-cardinality fields** but avoid indexing everything
- **Break down metrics** on key dimensions — campaign, region, API client — but keep it bounded
- Use **feature flags and toggles** to limit overhead in non-debug scenarios
- Build internal tooling (CLI wrappers, filters) to make high-card fields usable, not just present
- Make sure every high-card field answers: *"Would I wake up at 2AM to trace this?"*


## Final Thoughts

We talk a lot about incident response, but not enough about incident **context**. Cardinality gives you context — sometimes at a cost, always at a gain.

If MTTR is your goal, observability isn’t about cutting spend. It’s about **buying the right resolution path, in advance**.

So yes, cardinality costs me money. But every time I avoid a four-hour debugging session, I remember: it’s the best deal I’ve ever made.
