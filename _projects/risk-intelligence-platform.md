---
title: "Central bank risk intelligence platform"
description: "One Power BI platform consolidating 52 disparate departmental datasets into a single view of institutional risk for the Central Bank of Malaysia."
category: "Data platform"
org: "Central Bank of Malaysia"
date: 2022-06-01
impact: "5,000 hrs/year"
impact_label: "of manual reporting eliminated across 52 datasets"
tech:
  - Power BI
  - Python
  - MySQL
  - Neo4j
---

## Context

Risk data at the central bank lived in 52 separate departmental datasets, each
with its own format and owner. Building an institution-wide risk picture meant
weeks of manual collection and reporting.

## What I built

A centralised risk intelligence platform:

- Consolidated the 52 datasets into a single modelled layer feeding **Power BI**
- Added asset vulnerability tracking using Python web scraping with a **Neo4j
  graph database** to map dependencies between systems, improving SLA adherence
  by 30%
- Built a multi-source social media analytics pipeline (LinkedIn, Facebook,
  Instagram, Twitter APIs) with NLP sentiment analysis and automated
  controversy flagging for reputational risk

## Results

- **5,000 hours** of manual reporting eliminated annually
- One authoritative risk view where there had been 52 partial ones
- **30% improvement** in SLA adherence from dependency-aware vulnerability tracking
