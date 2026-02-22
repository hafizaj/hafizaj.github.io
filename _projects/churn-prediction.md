---
title: "Customer Churn Prediction Model"
description: "End-to-end ML pipeline predicting customer churn with 91% accuracy, deployed as an Azure ML endpoint integrated into Power BI."
category: data-science
date: 2024-01-15
tech:
  - Python
  - scikit-learn
  - Azure ML
  - Power BI
  - MLflow
github: "https://github.com/yourusername/churn-prediction"
demo: ""
featured: true
---

## Overview

This project built a production-grade customer churn prediction system for a
telecommunications client. The goal was to identify customers at high risk of
leaving within the next 30 days, enabling proactive retention campaigns.

## The Problem

The client was losing approximately 8% of their customer base each quarter with
no early warning system. Retention teams were working reactively, only engaging
customers who had already submitted a cancellation request.

## Solution Architecture

```
Raw Data (Azure Blob) → Azure Data Factory → Azure Synapse → Feature Store
                                                                    ↓
                                              Azure ML Training Pipeline
                                                                    ↓
                                              Real-time Scoring Endpoint
                                                                    ↓
                                              Power BI Risk Dashboard
```

## Model Development

I trained an ensemble of gradient boosting models (XGBoost + LightGBM) with the
following key features:

- Usage pattern changes (call duration, data consumption trends)
- Customer service interaction frequency and sentiment scores
- Contract type, tenure, and payment history
- Network quality metrics in the customer's area

## Results

- **91% AUC-ROC** on held-out test set
- **34% reduction** in quarterly churn after 6 months of deployment
- **£2.1M estimated revenue saved** in year one
- Integrated into existing Power BI environment so business users needed no new tooling

## Key Learnings

The most impactful insight wasn't model architecture — it was **feature engineering**.
The rate of change in customer behaviour (e.g., declining call duration over 60 days)
was far more predictive than absolute usage levels.
