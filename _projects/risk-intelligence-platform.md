---
title: "Risk register consolidation and intelligence dashboards"
description: "52 manual departmental risk profiles consolidated into one centralised register with live Power BI dashboards, plus a social listening pipeline for reputational risk."
category: "Data platform"
org: "Bank Negara Malaysia"
date: 2022-03-01
impact: "5,000 hrs/year"
impact_label: "of analyst effort eliminated across 52 departments"
tech:
  - Power BI
  - SharePoint
  - Python
  - MySQL
  - NLP
---

## Context

Risk data at the central bank lived in 52 separate manual risk profiles, each with its own format and owner. Building an institution-wide risk picture meant weeks of collection and reporting, and it was out of date on arrival.

## What I built

- Consolidated all 52 manual risk profiles into a **centralised SharePoint risk register** feeding a **live Power BI dashboard**, giving management real-time cross-departmental visibility
- Built a **social media analytics platform** integrating LinkedIn, Facebook, Instagram, and Twitter REST APIs into a MySQL backend, with NLP sentiment analysis and real-time controversy tracking for reputational risk

## Results

- **5,000 hours** of analyst effort eliminated annually
- One authoritative, always-current risk view where there had been 52 partial ones
- Communications strategy backed by data instead of anecdote
