---
title: "Why pooling four warehouses can cut your safety stock in half — or not at all"
topic: "Inventory pooling"
module: "Logistics & Supply Chain Analytics"
date: 2026-08-26
reading_time: 8
summary: "Consolidating regional stock into one location is supposed to buy you the square root law: pool n warehouses and safety stock drops by a factor of √n. That's only true if demand across locations is independent — and the moment it isn't, the benefit shrinks, or disappears completely."
prerequisites: "Variance of a sum of random variables, and what safety stock is for."
sources:
  - "Maister, D. H. (1976), 'Centralization of Inventories and the \"Square Root Law\"', <em>International Journal of Physical Distribution</em> — the original result."
  - "Silver, E. A., Pyke, D. F. & Peterson, R., <em>Inventory Management and Production Planning and Scheduling</em> — the standard textbook treatment of pooling."
---

Every operations course teaches some version of the square root law: consolidate $n$ regional stocking points into one, and the safety stock you need falls by a factor of $\sqrt{n}$. It is one of the cleanest results in supply chain theory, and it is also one of the most commonly overstated, because the entire result hinges on one assumption that real demand quietly violates.

## The setup

Safety stock for a single location is $z \cdot \sigma$, where $z$ is a service-level multiplier and $\sigma$ is the standard deviation of demand. Run $n$ separate locations, each independently sized:

$$\text{Decoupled safety stock} = n \cdot z\sigma$$

Consolidate into one central location serving the same total demand. **If** each location's demand is independent of the others, variances add: $\text{Var}(\text{total}) = n\sigma^2$, so the combined standard deviation is $\sigma\sqrt{n}$:

$$\text{Pooled safety stock} = z\sigma\sqrt{n}$$

<div class="callout callout-key" markdown="1">
<span class="callout-label">The one thing to hold on to</span>
The ratio of pooled to decoupled safety stock is $\sigma\sqrt{n} / n\sigma = 1/\sqrt{n}$ — <strong>but only under independence</strong>. That single word is doing all the work in "the square root law." Nothing about pooling itself guarantees it.
</div>

## A deliberately awkward example

Four regional warehouses, each with weekly demand $\sigma = 100$ units and a 95% service target ($z=1.65$):

$$\text{Decoupled: } 4 \times 1.65 \times 100 = 660 \text{ units} \qquad \text{Pooled: } 1.65 \times 100\sqrt{4} = 330 \text{ units}$$

Exactly half. That is the textbook result, and it is real — under independence.

<details class="reveal">
  <summary>What happens when demand is correlated<span class="reveal-tag">4 lines</span></summary>
  <div class="reveal-body" markdown="1">
For $n$ locations with pairwise demand correlation $\rho$ and equal variance $\sigma^2$:

$$\text{Var}(\text{total}) = n\sigma^2\big(1 + (n-1)\rho\big)$$

At $\rho=0$ this collapses to $n\sigma^2$, recovering $\sigma\sqrt{n}$. At $\rho=1$ — demand moving in lockstep, as it would under a shared seasonal driver — it becomes $n^2\sigma^2$, giving a combined standard deviation of $n\sigma$: **exactly the decoupled total**, with no benefit from pooling at all.
  </div>
</details>

<div class="widget" data-widget="pooling-correlation">
  <div class="widget-head">
    <span class="widget-title">Pooled ÷ decoupled safety stock · correlation ρ</span>
    <span class="widget-readout" data-readout>ρ = 0.00</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Ratio of pooled to decoupled safety stock rising from zero toward one as correlation between locations increases"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="pool-rho">ρ</label>
      <input type="range" id="pool-rho" min="0" max="1000" step="1" value="250">
    </div>
  </div>
  <p class="widget-caption">At ρ = 0, pooling four locations halves your safety stock. At ρ = 1, it does nothing. At the far negative end — locations whose demand moves in exact opposition — the ratio touches zero: a combined portfolio with no variance at all, the same perfect-hedge result that shows up in two-asset portfolio theory, applied to inventory instead of risk.</p>
  <p class="widget-noscript">This figure needs JavaScript. The boxed algebra above carries the same argument.</p>
</div>

## What this means in practice

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Where this bites</span>
Real regional demand is rarely independent. A national promotion, a shared macroeconomic cycle, or a common upstream supplier disruption pushes every region's demand up or down together — exactly the correlation that erodes the pooling benefit. Consultants and textbooks quote the √n figure as if it were guaranteed; the honest version of the pitch estimates the actual pairwise correlation in the historical demand data first, because a business case built on √n when the real ρ is 0.5 or higher will overstate the savings substantially.
</div>

<details class="reveal reveal-recall">
  <summary>Why does pooling four independent-demand warehouses cut safety stock exactly in half?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because independent variances add: combining n locations gives a combined standard deviation of σ√n rather than nσ. The ratio to the decoupled total is σ√n / nσ = 1/√n, which at n=4 is exactly 1/2.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What happens to the pooling benefit if demand across locations is perfectly correlated (ρ=1)?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
It disappears entirely. The combined standard deviation becomes nσ — identical to the decoupled total — because every location moves together, so consolidating them provides no diversification of the underlying uncertainty.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why should a real consolidation business case not simply assume ρ=0?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because real regional demand is often positively correlated — shared promotions, seasonality, or macroeconomic conditions move multiple regions together — so the actual achievable reduction is usually smaller than the textbook √n figure, sometimes substantially so.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What does a negative correlation between two locations' demand mean for their combined safety stock?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
It reduces combined variance below what independence alone would give, because one location's high demand tends to coincide with the other's low demand. Taken to its theoretical extreme, sufficiently negative correlation can drive the combined variance to zero — a perfect hedge, the same structure that appears in two-asset portfolio theory.
  </div>
</details>
