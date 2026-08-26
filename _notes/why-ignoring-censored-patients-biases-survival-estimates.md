---
title: "Why ignoring censored patients makes survival look shorter than it is"
topic: "Survival analysis"
module: "Healthcare & Medical Analytics"
date: 2026-08-26
reading_time: 9
summary: "Some patients in a study are still fine when the study ends — you just don't know what happens to them next. Treat that unknown as if it were known, and every reasonable-looking way of doing it pushes your estimate of survival in the same wrong direction: down."
prerequisites: "What a survival probability means, and basic conditional probability."
sources:
  - "Kaplan, E. L. & Meier, P. (1958), 'Nonparametric Estimation from Incomplete Observations', <em>Journal of the American Statistical Association</em> — the original estimator."
  - "Kalbfleisch, J. D. & Prentice, R. L., <em>The Statistical Analysis of Failure Time Data</em> — the standard reference on censoring conventions."
---

Eight patients enter a study. By the time it ends, five have had the event being tracked — call it relapse — at known times. Three have not: the study simply finished before anything happened to them. Those three are **censored**, not missing. You know, with certainty, that they survived at least as long as they were observed. You just don't know for how much longer.

## The setup

Naive instincts about what to do with censored patients are all, in a specific and provable sense, wrong in the same direction.

<div class="callout callout-key" markdown="1">
<span class="callout-label">The one thing to hold on to</span>
A censored patient's true event time is <strong>unknown but bounded below</strong> — it is at least their censoring time, possibly much longer. Any method that treats their observed time as if it were their true event time, or drops them from the analysis entirely, throws away exactly the information that says "at least this long" and replaces it with something smaller or nothing at all. Both moves can only push an estimate of survival time downward, never up.
</div>

## A deliberately awkward example

Eight patients, months to relapse (E) or last known relapse-free (C):

$$2^{E},\ 3^{E},\ 4^{C},\ 4^{E},\ 6^{E},\ 6^{C},\ 8^{E},\ 9^{C}$$

The **Kaplan–Meier estimator** answers this correctly. At each *event* time, it computes the conditional probability of surviving past that point given survival up to just before it, and multiplies these conditional probabilities together — the product-limit estimate. Censored patients stay in the risk set right up until they're censored, contributing everything they can, and simply leave without being counted as an event.

<details class="reveal">
  <summary>Show the step-by-step calculation<span class="reveal-tag">6 steps</span></summary>
  <div class="reveal-body" markdown="1">
| t | at risk | events | factor | S(t) |
|---|---|---|---|---|
| 2 | 8 | 1 | 7/8 | 0.8750 |
| 3 | 7 | 1 | 6/7 | 0.7500 |
| 4 | 6 | 1 | 5/6 | 0.6250 |
| 6 | 4 | 1 | 3/4 | 0.4688 |
| 8 | 2 | 1 | 1/2 | 0.2344 |

At t = 4, the risk set of 6 includes both the censored patient and the one who relapses — the censored patient is still "at risk" up to that instant, and only leaves afterward, uncounted as an event. The curve stays flat at 0.2344 from t = 8 onward: the last patient (censored at t = 9) contributes nothing further, because nothing further is known.
  </div>
</details>

## What the naive version gets wrong

A common instinct: since censoring is annoying, just treat every recorded time as if it were the true event — pretend nobody was censored at all. Running the *same* product-limit logic but counting every observation as an event, including the three that were actually censored:

<div class="widget" data-widget="km-vs-naive">
  <div class="widget-head">
    <span class="widget-title">Survival curve · correct vs. naive</span>
    <span class="widget-readout" data-readout>Correct: KM</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Correct Kaplan-Meier survival curve staying elevated past month 8, compared against a naive curve that incorrectly falls to zero by month 9"></canvas></div>
  <div class="widget-controls">
    <div class="recall-actions" data-toggle-group>
      <button type="button" class="recall-btn" data-curve="km" aria-pressed="true">Correct (Kaplan–Meier)</button>
      <button type="button" class="recall-btn" data-curve="naive" aria-pressed="false">Naive (ignores censoring)</button>
    </div>
  </div>
  <p class="widget-caption">The correct curve ends at S(8) = 0.234 and stays there — the data simply doesn't say what happens after month 9. The naive curve, which treats every censored patient's last-known-well time as if it were a relapse, claims certainty that everyone has relapsed by month 9: S = 0. Nothing in the data supports that claim; it is a pure artefact of discarding the censoring information.</p>
  <p class="widget-noscript">This figure needs JavaScript. The two calculations above carry the same argument.</p>
</div>

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Where this bites</span>
The bias is always in the same direction and it compounds with study length. A short follow-up window censors more patients, and each one is treated by the naive method as if their good outcome were actually a bad one — the shorter the study, the worse a naive estimate gets, precisely when it is least likely to be caught in review. The same failure appears outside medicine: customer-churn "average lifetime" calculated by dropping still-active customers, or product reliability estimated by treating units still working at the end of a test as failures.
</div>

<details class="reveal reveal-recall">
  <summary>What does it mean for a patient's observation to be censored, precisely?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Their true event time is unknown but known to be at least their last observed time — the study ended, or they left the study, before the event (if any) occurred. It is a lower bound on their survival time, not a missing data point.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>In the Kaplan–Meier calculation, why does a censored patient still count in the "at risk" number at their own censoring time?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because they were confirmed to still be event-free right up until that point — they contribute everything they legitimately can to the risk set at that instant, and only leave the calculation afterward, without being counted as an event.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does treating every censored patient's last-known time as an event bias the survival curve downward?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because it converts "we don't know what happens after this point" into "the worst possible thing happened at this point" — manufacturing certainty the data doesn't contain, and every manufactured event can only pull the estimated survival probability down, never up.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does a shorter follow-up study make the naive method's bias worse, not just noisier?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
A shorter study censors more patients before their true event time, and the naive method mistreats every one of them as a premature event. More censored patients means more manufactured "failures," which pushes the naive estimate down further — the bias grows systematically with how early the study cuts off, not randomly.
  </div>
</details>
