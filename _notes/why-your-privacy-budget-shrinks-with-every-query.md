---
title: "How much of your privacy budget is left after ten queries?"
topic: "Differential privacy"
module: "Data Management & Ethics"
date: 2026-08-26
updated: 2026-09-03
reading_time: 9
level: applied
featured: true
index_order: 1
source_schema: 2
takeaway: "A privacy guarantee applies to the whole sequence of queries, not to each query in isolation."
summary: "A single differentially private query can be both accurate and private. Run many against a fixed privacy budget and the noise each one needs grows with every question asked — the mistake that turns a well-designed privacy mechanism into a useless one."
prerequisites: "What a probability distribution's variance means, and roughly what the 'sensitivity' of a query is."
sources:
  - id: dwork-2006
    author: "Cynthia Dwork, Frank McSherry, Kobbi Nissim & Adam Smith"
    title: "Calibrating Noise to Sensitivity in Private Data Analysis"
    publication: "Theory of Cryptography Conference"
    year: 2006
    url: "https://doi.org/10.1007/11681878_14"
    supports: "The Laplace mechanism and calibration of noise to global sensitivity."
  - id: dwork-roth-2014
    author: "Cynthia Dwork & Aaron Roth"
    title: "The Algorithmic Foundations of Differential Privacy"
    publication: "Foundations and Trends in Theoretical Computer Science"
    year: 2014
    url: "https://www.cis.upenn.edu/~aaroth/Papers/privacybook.pdf"
    supports: "Sequential composition, privacy budgets, and the limits of repeated queries."
---

Run the same ε = 0.1 query against a dataset ten separate times, and every individual result looks comfortably private — 0.1 reads like a strong guarantee wherever it's quoted. Add those ten releases up under composition, though, and the system you've actually built provides ε = 1.0, ten times weaker than the number printed next to any one query. Differential privacy is usually explained as a single dial, $\varepsilon$: smaller means more noise and more privacy, larger means less noise and less privacy. That's true, and it's almost beside the point. **$\varepsilon$ is not a per-query dial — it's a budget, and it depletes with every question you ask.**

## Answering one count query privately

A count query — "how many patients in this dataset have condition X?" — is answered privately by returning the true count plus random noise. How much noise? Exactly enough that adding or removing any one person would barely shift the distribution of answers you might see.

Two quantities set that amount. **Sensitivity** $\Delta$ is the largest change one person's presence or absence can cause in the true answer; for a count, $\Delta = 1$, because one person changes a count by at most one. **Epsilon** $\varepsilon$ is the privacy parameter: the smaller it is, the harder it must be to tell those two worlds apart. The Laplace mechanism draws noise scaled to $\Delta/\varepsilon$ [1](#source-dwork-2006){: .source-ref}:

$$\text{noise} \sim \text{Laplace}\!\left(0, \frac{\Delta}{\varepsilon}\right), \qquad \text{std. dev.} = \sqrt{2}\,\frac{\Delta}{\varepsilon}$$

<div class="callout callout-key" markdown="1">
<span class="callout-label">Privacy comes from noise, not secrecy</span>
Smaller $\varepsilon$ means a larger noise scale, which is the entire mechanism: privacy comes from making the true answer statistically hard to pin down against the noise, not from hiding it outright.
</div>

## What happens to a count of 340 as ε shrinks

A query returns a true count of 340. Watch the noise standard deviation as $\varepsilon$ shrinks, with $\Delta = 1$:

| ε | noise std. dev. |
|---|---|
| 1.0 | 1.41 — the count reads essentially cleanly |
| 0.1 | 14.14 — noticeably noisy, still roughly informative |
| 0.01 | 141.42 — the true value of 340 is swamped |

## Why composition changes the picture

Sequential composition says: if one query is $\varepsilon_1$-private and a second is $\varepsilon_2$-private, releasing both results together is $(\varepsilon_1+\varepsilon_2)$-private. Run $k$ queries, each spending $\varepsilon$, and the **total** privacy loss is $k\varepsilon$ — the budgets add [2](#source-dwork-roth-2014){: .source-ref}.

<details class="reveal">
  <summary>What this forces on a fixed total budget<span class="reveal-tag">algebra</span></summary>
  <div class="reveal-body" markdown="1">
Fix a total budget $\varepsilon_{\text{total}}$ and plan to run $k$ queries. To stay within budget under sequential composition, each query gets only $\varepsilon_{\text{total}}/k$. Substituting into the noise formula:

$$\text{noise std. dev. per query} = \sqrt{2}\,\Delta \cdot \frac{k}{\varepsilon_{\text{total}}}$$

Noise grows **linearly** in the number of queries you plan to run, for a fixed total budget. At $\varepsilon_{\text{total}}=1,\ \Delta=1$: $k=1$ gives 1.41, $k=10$ gives 14.14, $k=50$ gives 70.71 — the first two match the table above, now driven by query count instead of a single query's $\varepsilon$.
  </div>
</details>

<div class="widget" data-widget="privacy-budget">
  <div class="widget-head">
    <span class="widget-title">Per-query noise std. dev. · queries planned (k)</span>
    <span class="widget-readout" data-readout>k = 1</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Per-query noise standard deviation rising linearly as the number of planned queries increases, for a fixed total privacy budget"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="privacy-k">k</label>
      <input type="range" id="privacy-k" min="1" max="50" step="1" value="1">
    </div>
  </div>
  <p class="widget-caption">This holds the total budget fixed at ε = 1 and asks: given that you're planning k queries, not one, how much noise does each one need to stay inside that budget? A dashboard with 50 questions needs fifty times the noise per answer that a single question would.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table and algebra above carry the same argument.</p>
</div>

<div class="callout callout-warn" markdown="1">
<span class="callout-label">When the advertised ε and the actual ε diverge</span>
The most common real-world failure is applying the same ε to every query in an interactive dashboard or API without tracking cumulative spend. Fifty queries each run at "ε = 1" is not an ε = 1 system — under sequential composition it is ε = 50, a far weaker guarantee than the number quoted anywhere in the documentation. A privacy budget has to be tracked and depleted across the system's entire lifetime, not reset with every request.
</div>

<details class="reveal reveal-recall">
  <summary>Why does a smaller ε mean the Laplace mechanism adds more noise?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The noise scale is Δ/ε — sensitivity divided by epsilon. As ε shrinks toward zero, the denominator shrinks and the scale (and standard deviation) grows without bound, which is precisely how the mechanism buys stronger privacy: a larger noise scale makes the true value statistically harder to recover.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does noise per query have to grow as you plan to run more queries against a fixed total budget?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the total budget ε_total must be divided across all k planned queries under sequential composition — each gets ε_total/k — and the noise scale for a given query is inversely proportional to its individual epsilon, so noise scales linearly with k.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What is the most common real-world mistake this composition rule exposes?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Applying the same ε to every query in a system with many queries — a dashboard or an API — without tracking cumulative privacy spend. The advertised per-query ε understates the true, much weaker system-wide guarantee once composition is accounted for.
  </div>
</details>
