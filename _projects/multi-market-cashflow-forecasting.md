---
title: "Multi-market cashflow forecasting system"
description: "AstraZeneca Finance's first multi-market cashflow forecasting system, built on SAP data pipelines, Python ETL, and Power BI across 8 markets."
category: "FP&A / Treasury"
group: "automation"
org: "AstraZeneca"
date: 2024-06-01
impact: "3,200+ hrs"
impact_label: "saved annually by automating reconciliation across 8 markets"
tech:
  - Python
  - SAP data pipelines
  - Power BI
  - Power Automate
---

## The problem

Cashflow visibility across 8 markets depended on analysts manually reconciling SAP extracts in spreadsheets. Each market had its own rhythm, currency, and reporting habits, so assembling one picture took weeks, and by the time it existed it was already stale.

## Architecture

<img src="/assets/diagrams/multi-market-cashflow-forecasting.svg"
     alt="SAP, BlackLine and Quantum feed a Python ETL layer that normalises each of eight markets' actuals; a forecasting layer turns those into forward cash positions, published to one consolidated Power BI dashboard, with Power Automate driving the submission and refresh cycle."
     class="my-8 w-full rounded-xl border border-mist bg-white p-4">

## What I built

The company's first multi-market cashflow forecasting system for Finance:

- **SAP data pipelines** feeding a Python ETL layer that standardises how each market's actuals come in
- **Forecasting logic** that turns reconciled actuals into forward-looking cash positions instead of backward-looking reports
- **Power BI delivery** so finance teams drill into what's driving the numbers themselves
- **Power Automate workflows** around the process that alone saved 3,200+ hours a year

## Key decisions

**A Python ETL layer, rather than transforming inside the BI tool.** The
transformation had to do two things the reporting layer couldn't: scale across
eight markets, and stay independent of any single system on either side of it.
Python let me write the reconciliation once and parameterise it per market
instead of maintaining eight near-identical copies of the same logic in Power
Query. It also kept the pipeline source- and consumer-agnostic: SAP, BlackLine,
and Quantum each land in the same standardised shape, and the layer producing
that shape doesn't care what reads it downstream. Adding a market, or swapping
what sits at either end, becomes a configuration change rather than a rebuild.

## Results

- **3,200+ hours saved annually.** Each of the 8 markets used to spend roughly 3 days a cycle manually reconciling SAP extracts and rebuilding the forecast by hand, on top of the rework that came with catching errors late. Automating that away is where most of the savings come from
- **95% forecast accuracy** across all 8 markets
- **60% reduction** in planning cycle time
- Finance teams make cash decisions in real time instead of waiting for month-end
- Earned an invitation to present the system at the **Warsaw Finance Senior Leadership Meeting**, and the **Finance Excellence Award** at AstraZeneca
