---
title: "Expense fraud detection at scale"
description: "Unsupervised ML that screens 11,000+ monthly expense submissions for anomalies, replacing manual spot-checks with ranked, explainable flags."
category: "Machine learning"
org: "AstraZeneca"
date: 2024-06-01
impact: "400 hrs/month"
impact_label: "of manual audit effort eliminated"
tech:
  - Python
  - scikit-learn
  - K-Means
  - Isolation Forest
  - SAP Concur
---

## Context

Every month, more than 11,000 expense submissions flowed through SAP Concur.
Compliance reviews relied on manual spot-checks: slow, inconsistent, and blind to
patterns that only show up across thousands of records.

## What I built

An anomaly detection pipeline combining two complementary methods:

- **K-Means clustering** to group submissions into behavioural profiles, so an
  expense is judged against its own peer group rather than a global average
- **Isolation Forest** to score how isolated each submission is within its
  cluster, surfacing the records that genuinely don't fit

The output is a ranked review queue: auditors start with the highest-risk
submissions instead of sampling at random, and each flag carries the features
that drove it.

## Results

- **400 hours per month** of manual audit effort eliminated
- Review coverage went from a sample to the full monthly volume
- The same approach was later extended to CAPEX asset tracking, protecting
  **$20M in IT assets** and cutting 1,500+ annual auditing hours
