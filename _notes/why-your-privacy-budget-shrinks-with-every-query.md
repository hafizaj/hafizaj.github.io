---
title: "How much of your privacy budget is left after ten queries?"
topic: "Differential privacy"
module: "Data Management & Ethics"
date: 2026-08-26
reading_time: 9
summary: "A single differentially private query can be both accurate and private. Run many of them against a fixed privacy budget, and the noise needed per query grows with every question you ask — which is exactly the mistake that turns a well-designed privacy mechanism into a useless one."
prerequisites: "What a probability distribution's variance means, and roughly what the 'sensitivity' of a query is."
sources:
  - "Dwork, C., McSherry, F., Nissim, K. & Smith, A. (2006), 'Calibrating Noise to Sensitivity in Private Data Analysis' — the original Laplace mechanism."
  - "Dwork, C. & Roth, A., <em>The Algorithmic Foundations of Differential Privacy</em> — the standard reference, including the composition theorems."
---

Run the same ε = 0.1 query against a dataset ten separate times, and every individual result looks comfortably private — 0.1 reads like a strong guarantee wherever it's quoted. Add those ten releases up under composition, though, and the system you've actually built provides ε = 1.0, ten times weaker than the number printed next to any one query. Differential privacy is usually explained as a single dial, $\varepsilon$: smaller means more noise and more privacy, larger means less noise and less privacy. That's true, and it's almost beside the point. **$\varepsilon$ is not a per-query dial — it's a budget, and it depletes with every question you ask.**

## The setup

The Laplace mechanism answers a numeric query by adding noise drawn from a Laplace distribution scaled to the query's **sensitivity** $\Delta$ — the largest amount one person's presence or absence can change the true answer — divided by $\varepsilon$:

$$\text{noise} \sim \text{Laplace}\!\left(0, \frac{\Delta}{\varepsilon}\right), \qquad \text{std. dev.} = \sqrt{2}\,\frac{\Delta}{\varepsilon}$$

<div class="callout callout-key" markdown="1">
<span class="callout-label">Privacy comes from noise, not secrecy</span>
For a count query, $\Delta = 1$ — one person can change a count by at most one. Smaller $\varepsilon$ means a larger noise scale, which is the entire mechanism: privacy comes from making the true answer statistically hard to pin down against the noise, not from hiding it outright.
</div>

## What happens to a count of 340 as ε shrinks

A query returns a true count of 340. Watch the noise standard deviation as $\varepsilon$ shrinks:

| ε | noise std. dev. |
|---|---|
| 1.0 | 1.41 — the count reads essentially cleanly |
| 0.1 | 14.14 — noticeably noisy, still roughly informative |
| 0.01 | 141.4 — the true value of 340 is swamped |

## Why composition changes the picture

Sequential composition says: if one query is $\varepsilon_1$-private and a second is $\varepsilon_2$-private, releasing both results together is $(\varepsilon_1+\varepsilon_2)$-private. Run $k$ queries, each spending $\varepsilon$, and the **total** privacy loss is $k\varepsilon$ — the budgets add.

<details class="reveal">
  <summary>What this forces on a fixed total budget<span class="reveal-tag">algebra</span></summary>
  <div class="reveal-body" markdown="1">
Fix a total budget $\varepsilon_{\text{total}}$ and plan to run $k$ queries. To stay within budget under sequential composition, each query gets only $\varepsilon_{\text{total}}/k$. Substituting into the noise formula:

$$\text{noise std. dev. per query} = \sqrt{2}\,\Delta \cdot \frac{k}{\varepsilon_{\text{total}}}$$

Noise grows **linearly** in the number of queries you plan to run, for a fixed total budget. At $\varepsilon_{\text{total}}=1,\ \Delta=1$: $k=1$ gives 1.41, $k=10$ gives 14.14, $k=50$ gives 70.7 — the same numbers as the table above, now driven by query count instead of a single query's $\varepsilon$.
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
  <summary>Under sequential composition, what is the total privacy loss of running 10 queries each at ε = 0.1?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
ε = 1.0 total. Sequential composition adds the individual budgets: 10 × 0.1 = 1.0, even though each individual query looks like a comfortably weak ε = 0.1 guarantee on its own.
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
