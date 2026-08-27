---
title: "1.18× is the arbitrage floor a battery actually needs"
topic: "Storage economics"
module: "Energy Analytics"
date: 2026-06-23
reading_time: 7
summary: "Buy electricity cheap, store it, sell it expensive — the obvious battery business model. Round-trip efficiency means every cycle loses energy, which sets a hard minimum on how big the price spread has to be before that trade is even breakeven, before capital cost or degradation enter the picture at all."
prerequisites: "Nothing beyond basic algebra."
sources:
  - "Sioshansi, R., Denholm, P., Jenkin, T. & Weiss, J. (2009), 'Estimating the value of electricity storage in PJM: Arbitrage and some welfare effects', <em>Energy Economics</em> — the standard arbitrage-value framework."
  - "Zafirakis, D. et al. (2016), 'The value of arbitrage for energy storage', <em>Applied Energy</em> — round-trip efficiency and the breakeven spread."
---

Charge at **$50**/MWh on a modern battery running 0.85 round-trip efficiency, and breakeven isn't a price a dollar or two above **$50** — it's **$58.82**, a 1.176× multiple away. The obvious-sounding rule — "any positive price gap is a profitable trade" — is wrong, because every charge-discharge cycle loses energy. **The question isn't whether the high price beats the low price. It's whether it beats it by enough.**

## The setup

Buy 1 MWh at the low price $P_{\text{low}}$. Round-trip efficiency $\eta < 1$ means only $\eta$ MWh comes back out. Sell that at the high price $P_{\text{high}}$:

$$\text{profit} = \eta \, P_{\text{high}} - P_{\text{low}}$$

<div class="callout callout-key" markdown="1">
<span class="callout-label">A ratio requirement, not a dollar gap</span>
Breakeven is $\eta P_{\text{high}} = P_{\text{low}}$, which rearranges to $P_{\text{high}}/P_{\text{low}} = 1/\eta$. This is a <strong>ratio</strong> requirement, not a difference. A battery doesn't need the high price to beat the low price by some fixed dollar amount — it needs the high price to beat the low price by a fixed <em>multiple</em>, set entirely by how efficient the round trip is.
</div>

## The $58.82 breakeven at 85% efficiency

For a modern lithium-ion system with $\eta = 0.85$ (a realistic round-trip efficiency):

$$\frac{P_{\text{high}}}{P_{\text{low}}} > \frac{1}{0.85} \approx 1.176$$

Charge at $50/MWh and the discharge price needs to clear roughly **$58.82/MWh** just to break even on the energy lost in the round trip — before a single cent of capital cost, degradation, or cycling wear is even considered.

<div class="widget" data-widget="storage-breakeven">
  <div class="widget-head">
    <span class="widget-title">Breakeven price ratio · round-trip efficiency η</span>
    <span class="widget-readout" data-readout>η = 0.85</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Breakeven price ratio rising sharply as round-trip efficiency falls below one"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="storage-eta">η</label>
      <input type="range" id="storage-eta" min="40" max="100" step="1" value="85">
    </div>
  </div>
  <p class="widget-caption">At η = 100% (impossible, but the limit), any positive spread is profitable. Drop to η = 50% — closer to older storage technologies — and the discharge price needs to be double the charge price just to break even.</p>
  <p class="widget-noscript">This figure needs JavaScript. The formula above carries the same argument.</p>
</div>

<details class="reveal">
  <summary>Where the ratio comes from<span class="reveal-tag">2 lines</span></summary>
  <div class="reveal-body" markdown="1">
Set profit to zero and solve for the price ratio directly: $\eta P_{\text{high}} - P_{\text{low}} = 0 \implies P_{\text{high}} = P_{\text{low}}/\eta \implies P_{\text{high}}/P_{\text{low}} = 1/\eta$. The result depends on nothing except $\eta$ — not on the absolute price level, not on how much energy is being traded.
  </div>
</details>

## Efficiency isn't the binding constraint

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Capital and degradation, not efficiency, decide it</span>
Real wholesale markets frequently swing 2 to 4 times between overnight lows and evening peaks — comfortably clearing the roughly 1.18× threshold a modern battery needs on efficiency grounds alone. The efficiency loss is real, but for most grid-scale arbitrage it is a smaller drag on profitability than the two costs everyone underestimates instead: capital amortisation and cycling degradation, both of which keep accumulating even on trades that clear the efficiency threshold comfortably.
</div>

<details class="reveal reveal-recall">
  <summary>Why does battery arbitrage profitability depend on a price ratio rather than a price difference?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the energy lost to round-trip inefficiency scales with the energy stored, not with a fixed dollar amount — so the condition for breakeven, ηP_high = P_low, is a proportional (ratio) relationship rather than an additive one.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>At η = 0.85, roughly what discharge price is needed to break even on a $40/MWh charge price?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
About $47/MWh (40 / 0.85 ≈ 47.06) — the charge price divided by the round-trip efficiency, the same 1.176× multiple that applies at any price level.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does dropping round-trip efficiency from 85% to 50% more than double the required price ratio's distance above 1.0?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the required ratio is 1/η, which is convex in η — as η falls, 1/η rises faster than proportionally. Going from η=0.85 to η=0.50 moves the ratio from about 1.18 to 2.00, a much bigger jump than the drop in η alone would suggest.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>If real markets often swing 2 to 4× between low and high prices, why isn't grid-scale battery arbitrage automatically hugely profitable?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because round-trip efficiency loss is only one cost. Capital amortisation and degradation from cycling apply on every trade regardless of the price spread, and for most real projects those costs — not the efficiency threshold — are what determine whether arbitrage is actually worthwhile.
  </div>
</details>
