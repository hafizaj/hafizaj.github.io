---
title: "Tax classification model, built solo in Costa Rica"
description: "A supervised ML model that classifies financial transactions for tax treatment. Built from scratch on site, and it replaced an external vendor entirely."
category: "Machine learning"
org: "AstraZeneca"
date: 2023-11-01
impact: "90% accuracy"
impact_label: "and an external vendor dependency removed"
tech:
  - Python
  - scikit-learn
  - Feature engineering
  - Supervised learning
---

## Context

Tax classification of transactions was outsourced to an external vendor: an
ongoing cost, a black box, and a dependency the finance team wanted gone. I was
deployed to Costa Rica to solve it in-house.

## What I built

A supervised classification model developed end to end on site:

- Worked directly with the local finance team to encode their classification
  rules and edge cases into labelled training data
- Spent most of the effort on **feature engineering**. The signal was in how
  transaction attributes combined, not in any single field
- Delivered the model with a retraining process the team could run without me

## Results

- **90% classification accuracy**, validated against expert review
- The vendor contract ended, and the capability now lives in-house
- **480+ hours a year** released from manual classification and rework
