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

## What I built

The company's first multi-market cashflow forecasting system for Finance:

- **SAP data pipelines** feeding a Python ETL layer that standardises how each market's actuals come in
- **Forecasting logic** that turns reconciled actuals into forward-looking cash positions instead of backward-looking reports
- **Power BI delivery** so finance teams drill into what's driving the numbers themselves
- **Power Automate workflows** around the process that alone saved 3,200+ hours a year

## Results

- **3,200+ hours saved annually.** Each of the 8 markets used to spend roughly 3 days a cycle manually reconciling SAP extracts and rebuilding the forecast by hand, on top of the rework that came with catching errors late. Automating that away is where most of the savings come from
- **95% forecast accuracy** across all 8 markets
- **60% reduction** in planning cycle time
- Finance teams make cash decisions in real time instead of waiting for month-end
- Earned an invitation to present the system at the **Warsaw Finance Senior Leadership Meeting**, and the **Finance Excellence Award** at AstraZeneca
