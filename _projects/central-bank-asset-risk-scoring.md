---
title: "Central bank asset risk scoring engine"
description: "An end-to-end ML risk scoring system covering platform dependencies, cascading failure analysis, obsolescence mapping, and vulnerability ratings across every bank-critical system."
category: "Risk & infrastructure"
org: "Bank Negara Malaysia"
date: 2022-06-01
impact: "40% faster"
impact_label: "management decisions on critical infrastructure risk"
tech:
  - Python
  - Neo4j
  - Machine learning
  - Power BI
---

## The problem

A central bank's most dangerous blind spot is not knowing which systems depend on which. When a platform degrades, does the failure cascade? Assessments were manual, slow, and went stale the moment a system changed.

## What I built

An end-to-end asset risk scoring system covering all bank-critical systems:

- **Dependency mapping** with Python web scraping feeding a Neo4j graph database, so the bank has a live map of which platforms feed which
- **Cascading failure analysis** that follows those dependency chains to show what else breaks when one system goes down
- **Risk scoring** combining obsolescence mapping and vulnerability matrix ratings into a single ranked view
- **Automated Power BI dashboards** replacing the manual assessment cycle

## Results

- **40% faster** management decisions on critical infrastructure risk
- Manual assessment time cut across the board; the risk picture is always current
- **30% improvement** in SLA adherence by prioritising cascade-critical systems first
