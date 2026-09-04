---
title: "What happens to the patients still alive when a trial ends?"
topic: "Survival analysis"
module: "Healthcare & Medical Analytics"
date: 2026-08-26
updated: 2026-09-04
reading_time: 9
level: applied
featured: false
index_order: 10
source_schema: 2
takeaway: "A censored patient still contributes survival information until the moment they leave observation."
summary: "Some patients in a study are still fine when the study ends — you just don't know what happens to them next. Treat that unknown as if it were known, and every reasonable-looking way of doing it pushes your estimate of survival in the same wrong direction: down."
prerequisites: "What a survival probability means, and basic conditional probability."
sources:
  - id: kaplan-meier-1958
    author: "Edward L. Kaplan & Paul Meier"
    title: "Nonparametric Estimation from Incomplete Observations"
    publication: "Journal of the American Statistical Association 53(282), 457–481; DOI 10.1080/01621459.1958.10501452"
    year: 1958
    url: "https://www.jstor.org/stable/2281868"
    supports: "The original product-limit estimator for survival from incomplete observations."
  - id: clark-2003
    author: "Taane G. Clark, Michael J. Bradburn, Sharon B. Love & Douglas G. Altman"
    title: "Survival Analysis Part I: Basic concepts and first analyses"
    publication: "British Journal of Cancer 89(2), 232–238"
    year: 2003
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2394262/"
    supports: "The definition of right censoring and the three ways it arises, the statement that censored times underestimate the true time to event, the product-limit formula in terms of the number at risk, and the uninformative-censoring assumption."
  - id: bland-altman-1998
    author: "J. Martin Bland & Douglas G. Altman"
    title: "Statistics Notes: Survival probabilities (the Kaplan-Meier method)"
    publication: "BMJ 317(7172), 1572"
    year: 1998
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1114388/"
    supports: "The worked treatment of conditional probabilities, the effect of a censored observation on the number at risk in the next interval, and the direction of the distortion in the study they work through, where censoring was related to the outcome."
---

Eight patients are followed for relapse. Five relapse at known times. Three are still relapse-free when their observation stops. Their records read like data with a hole in them, and the two obvious repairs both distort the answer: dropping them discards real evidence, and recording their last known-good month as a relapse invents an event that never happened. Both moves push the estimated survival downwards.

## What censoring is, before any formula

An observation is **right censored** when the event has not happened by the time observation stops. Clark and colleagues list three routes to it: the study closes before the patient has the event, the patient is lost to follow-up, or a different event makes further follow-up impossible [2](#source-clark-2003){: .source-ref}.

The distinction that matters for the arithmetic is that a censored time is not a missing value. It is a **lower bound**. A patient censored at month 6 is known to have survived at least six months, and their true event time, if it ever comes, is somewhere beyond that. Recording the censored time as though it were the event time therefore understates the true time to event [2](#source-clark-2003){: .source-ref}.

Write the eight observations as months to relapse, with E for an observed event and C for a censored observation:

$$2^{E},\ 3^{E},\ 4^{C},\ 4^{E},\ 6^{E},\ 6^{C},\ 8^{E},\ 9^{C}$$

## Following the risk set month by month

The Kaplan–Meier estimator, also called the product-limit estimator, uses each patient for exactly as long as they are known to be event-free [1](#source-kaplan-meier-1958){: .source-ref}[2](#source-clark-2003){: .source-ref}. At each time $t_j$ where an event occurs, it forms the conditional probability of getting through that moment given survival up to it, and multiplies those conditional probabilities together:

$$S(t_j) = S(t_{j-1}) \cdot \frac{n_j - d_j}{n_j}$$

where $n_j$ is the number of patients still under observation and event-free just before $t_j$ — the **risk set** — and $d_j$ is the number of events at $t_j$. The estimate holds still between event times and steps down only when an event occurs [2](#source-clark-2003){: .source-ref}. A censored observation never appears as an event; its only effect is to reduce the risk set for the intervals that follow [3](#source-bland-altman-1998){: .source-ref}.

The five event times give five steps; the final row records the last censored observation, where nothing changes. Times are months; $S(t)$ is a probability, so it is unitless.

| $t$ (months) | at risk $n_j$ | events $d_j$ | censored | factor | $S(t)$ |
|---|---|---|---|---|---|
| 2 | 8 | 1 | 0 | 7/8 | 0.8750 |
| 3 | 7 | 1 | 0 | 6/7 | 0.7500 |
| 4 | 6 | 1 | 1 | 5/6 | 0.6250 |
| 6 | 4 | 1 | 1 | 3/4 | 0.4688 |
| 8 | 2 | 1 | 0 | 1/2 | 0.2344 |
| 9 | 1 | 0 | 1 | — | 0.2344 |

Two rows repay a second look. At month 4 the risk set is 6 and includes both the patient who relapses and the patient who is censored, because the censored patient was confirmed event-free right up to that instant; they leave afterwards without ever being counted as an event. At month 9 there is no event at all, so the estimate does not move.

## The same arithmetic with the censoring thrown away

Now run the identical product-limit machinery, changing one thing: treat all eight observations as relapses. This is what "just use the recorded times" amounts to.

| $t$ (months) | at risk $n_j$ | events $d_j$ | factor | $S(t)$ |
|---|---|---|---|---|
| 2 | 8 | 1 | 7/8 | 0.8750 |
| 3 | 7 | 1 | 6/7 | 0.7500 |
| 4 | 6 | 2 | 4/6 | 0.5000 |
| 6 | 4 | 2 | 2/4 | 0.2500 |
| 8 | 2 | 1 | 1/2 | 0.1250 |
| 9 | 1 | 1 | 0/1 | 0.0000 |

The two tables agree at months 2 and 3, where there was nothing to disagree about, and then separate. By month 6 the naive estimate is 0.25 against the correct 0.4688, and at month 9 it reports that every patient has relapsed. Nothing in the data supports that. It is produced entirely by converting three "we stopped looking" records into three relapses.

<div class="widget" data-widget="km-vs-naive">
  <div class="widget-head">
    <span class="widget-title">Survival curve · correct vs. naive</span>
    <span class="widget-readout" data-readout>Correct: S(8) = 0.234, held to month 9</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Correct Kaplan-Meier survival curve holding above 0.23 through month 9, compared against a naive curve that incorrectly falls to zero at month 9"></canvas></div>
  <div class="widget-controls">
    <div class="recall-actions" data-toggle-group>
      <button type="button" class="recall-btn" data-curve="km" aria-pressed="true">Correct (Kaplan–Meier)</button>
      <button type="button" class="recall-btn" data-curve="naive" aria-pressed="false">Naive (ignores censoring)</button>
    </div>
  </div>
  <p class="widget-caption">Horizontal axis is months, vertical axis the estimated probability of remaining relapse-free. Both curves are the step functions tabulated above. The plot stops at month 9, the last observation of any kind in the study — the censored patient — so nothing here is drawn beyond the data. The correct curve's last step is at month 8, to 0.234, and it holds there through month 9 because no further event was seen. The naive curve reaches zero at month 9, which the data does not support.</p>
  <p class="widget-noscript">This figure needs JavaScript. The two tables above carry the same argument.</p>
</div>

## The assumption doing the work

Kaplan–Meier is not a way of recovering unknown outcomes. It works by never asserting one, and it rests on an assumption that has a name: censoring must be **uninformative**, meaning patients censored at any time have the same survival prospects as those who remain under observation [2](#source-clark-2003){: .source-ref}. Bland and Altman call that assumption not easily testable, and give a case where it fails: in the conception study they work through, censoring linked to failure to conceive would have biased the estimated probabilities downwards [3](#source-bland-altman-1998){: .source-ref}. The direction is not fixed in general. What is general is that if leaving observation carries information about the outcome, the estimate moves, and the estimator gives you no warning that it has.

That is worth taking seriously in any setting where people leave a study for reasons connected to how they are doing. Patients who withdraw because they feel worse, customers who churn before a contract ends, or units pulled from a reliability test after showing early signs of wear are all cases where the assumption is doubtful and the estimator's guarantees weaken with it.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">A shorter follow-up makes the naive answer worse, not just noisier</span>
Cutting the observation window earlier censors more patients, and the naive method converts each of them into a fabricated event. The distortion therefore grows with how early the study stops, rather than averaging out across a larger sample. The same failure appears far from medicine: an "average customer lifetime" computed by dropping still-active customers, or a reliability figure that counts units still working at the end of a test as failures.
</div>

## Where the curve stops carrying information

The last event here is at month 8 and the last observation of any kind is the censored patient at month 9. After month 8 the estimate has nothing to update it, so it holds at 0.2344; after month 9 there is no one left under observation at all. Software will happily draw the curve flat past that point, but that is a plotting convention, not a claim that 23.4% of patients never relapse — which is why the figure above stops at month 9. Reading a long flat tail as a cure rate is a common misreading, and it is the reason survival curves are usually annotated with the number still at risk beneath the time axis.

<details class="reveal reveal-recall">
  <summary>Why does a censored patient still count in the "at risk" number at their own censoring time?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because they were confirmed event-free right up to that instant, so they legitimately belong in the denominator of that interval's conditional probability. They leave the calculation afterwards, reducing the risk set for later intervals, without ever being recorded as an event.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What does the uninformative-censoring assumption claim, and when should you doubt it?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
That patients censored at a given time have the same survival prospects as those still being followed. Doubt it whenever leaving observation is plausibly connected to the outcome — patients withdrawing because they are deteriorating, or units removed from a test after early signs of failure. When censoring carries information about the outcome, the Kaplan–Meier estimate is biased, and the direction depends on the mechanism: if the patients who leave are at higher risk than those who stay, the curve is too optimistic, while Bland and Altman's conception study is a case in the other direction. The estimator gives no warning either way.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>The correct curve is flat from month 8 to the end of the plot. What does that flat stretch mean?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
That no further event was observed, not that survival has settled at that level. The estimate only changes at event times, so it holds at 0.234 from month 8 to month 9. The plot stops there because month 9 is the last observation of any kind; past it nobody remains under observation, and a flat line drawn beyond that point would carry no evidence either way.
  </div>
</details>
