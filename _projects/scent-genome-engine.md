---
title: "Scent Genome Engine"
description: "A GenAI fragrance recommendation engine built for L'Oréal Brandstorm 2026: embeddings-based note similarity plus LangChain prompt chains that generate personalised scent stories."
category: "Generative AI"
group: "ai"
org: "L'Oréal Brandstorm 2026"
date: 2026-02-15
impact: "Explainable by design"
impact_label: "every recommendation states its reasoning, with a generated scent narrative"
tech:
  - Python
  - LangChain
  - OpenAI API
  - MySQL
  - Streamlit
---

## The idea

Fragrance discovery is stuck between two bad options: overwhelming shelves and generic quizzes. For L'Oréal Brandstorm 2026 I prototyped a recommendation engine that treats scent like a genome: decompose fragrances into notes, learn similarity between them, and explain every recommendation in plain language.

## What I built

- **Note similarity scoring** using embeddings and collaborative filtering, with botanical constraints and neuroscience-backed personalisation baked into the ranking
- **A GenAI scent story generator** using LangChain prompt chains over the OpenAI API, producing personalised fragrance narratives mapped to user profiles and the botanicals of their city
- **Explainability by design**: fine-tuned prompt chains so every recommendation says why, and renders as a shareable tile with maps and notes
- **Streamlit front end on a MySQL backend** so the whole prototype is something you can actually click through

## Why it matters

Most recommendation engines are black boxes. This one shows its reasoning, and the generated narratives turn a model output into something a customer actually wants to share. The same pattern applies to enterprise decision support: retrieval plus generation plus explainability.
