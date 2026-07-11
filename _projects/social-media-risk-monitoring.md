---
title: "Reputational risk monitoring platform"
description: "A multi-source social media analytics platform integrating LinkedIn, Facebook, Instagram, and Twitter APIs with NLP sentiment analysis and automated controversy flagging for reputational risk."
category: "Risk & communications"
org: "Bank Negara Malaysia"
date: 2022-01-01
impact: "4 platforms"
impact_label: "unified into one real-time sentiment and controversy-tracking pipeline"
tech:
  - Python
  - NLP
  - REST APIs
  - MySQL
---

## The problem

A central bank's reputation moves in public conversation long before it shows up in a formal complaint. Communications and risk teams had no systematic way to see that building, so they found out about a brewing controversy the same way everyone else did: after it was already a headline.

## What I built

- A multi-source ingestion pipeline pulling from **LinkedIn, Facebook, Instagram, and Twitter REST APIs** into a MySQL backend
- **NLP sentiment analysis** scoring public conversation as it comes in, instead of relying on manual monitoring
- **Automated controversy flagging** that surfaces spikes in negative sentiment early, so the response is proactive rather than reactive

## Why it matters

Four disconnected feeds became one real-time view. Risk and communications teams could see reputational exposure building and act on it, backed by data instead of anecdote.
