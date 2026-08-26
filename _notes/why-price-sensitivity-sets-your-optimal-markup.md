---
title: "Why price sensitivity alone sets your optimal markup"
topic: "Pricing"
module: "Retail Analytics"
date: 2026-08-26
reading_time: 7
summary: "You don't need to know your customers' willingness to pay to find the profit-maximizing price — just how sensitive demand is to price. That single number pins down the optimal markup exactly, and it explains why some categories carry razor-thin margins while others carry huge ones by design, not accident."
prerequisites: "What price elasticity of demand means, and basic calculus (one derivative)."
sources:
  - "Lerner, A. P. (1934), 'The Concept of Monopoly and the Measurement of Monopoly Power' — the original markup rule."
  - "Phillips, R., <em>Pricing and Revenue Optimization</em> — the modern retail/revenue-management treatment."
---

Retailers set very different margins across categories — thin on staples, wide on discretionary goods — and it isn't guesswork. A single number, price elasticity, pins down the profit-maximizing markup exactly, with a formula simple enough to compute on the spot.

## The setup

Price elasticity $\varepsilon = \dfrac{\%\Delta Q}{\%\Delta P}$ measures how sharply quantity demanded falls as price rises — always negative for a normal good, and "elastic" ($\varepsilon < -1$) means demand is sensitive enough that a price rise still costs you revenue overall.

For demand of the constant-elasticity form $Q(P) = A P^{\varepsilon}$, maximizing profit $\pi(P) = (P-c)Q(P)$ over price gives a strikingly clean result:

<div class="callout callout-key" markdown="1">
<span class="callout-label">The one thing to hold on to</span>
$$\frac{P^* - c}{P^*} = -\frac{1}{\varepsilon}$$
Your optimal margin, as a fraction of price, is exactly the <strong>reciprocal of elasticity magnitude</strong>. Nothing else about the demand curve matters — not the constant $A$, not the price level. Price sensitivity alone sets the markup.
</div>

<details class="reveal">
  <summary>Where the formula comes from<span class="reveal-tag">4 lines</span></summary>
  <div class="reveal-body" markdown="1">
$\pi(P) = (P-c)AP^{\varepsilon} = A(P^{\varepsilon+1} - cP^{\varepsilon})$. Differentiating and setting to zero:

$$\frac{d\pi}{dP} = A P^{\varepsilon-1}\big[(\varepsilon+1)P - c\varepsilon\big] = 0 \;\implies\; P^* = \frac{c\varepsilon}{\varepsilon+1}$$

Substituting back: $(P^*-c)/P^* = -1/\varepsilon$ — the Lerner index, a century-old result from managerial economics, still the working rule behind most retail and revenue-management pricing today.
  </div>
</details>

## A deliberately awkward example

Marginal cost $c$ is **$10**. Watch the optimal price and margin swing as elasticity magnitude changes:

<div class="widget" data-widget="elasticity-markup">
  <div class="widget-head">
    <span class="widget-title">Optimal margin · elasticity magnitude |ε|</span>
    <span class="widget-readout" data-readout>|ε| = 2.5</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Optimal profit margin percentage falling as elasticity magnitude rises"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="eps-mag">|ε|</label>
      <input type="range" id="eps-mag" min="120" max="600" step="1" value="250">
    </div>
  </div>
  <p class="widget-caption">At |ε| = 1.2 — customers barely react to price — the optimal margin is 83% of price. At |ε| = 6 — customers switch the instant price moves — it collapses to under 17%. The relationship is 1/|ε|, so it bends hardest exactly where demand is least sensitive.</p>
  <p class="widget-noscript">This figure needs JavaScript. The formula above carries the same argument.</p>
</div>

At $\lvert\varepsilon\rvert = 2.5$ — a fairly typical figure for a mid-sensitivity discretionary category — the optimal price works out to **$16.67**, a 40% margin over the **$10** cost. Push sensitivity up to $\lvert\varepsilon\rvert=5$, closer to a commodity staple with easy substitutes, and the optimal margin nearly halves to 20%, landing at **$12.50**.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Where this bites</span>
The formula only has a finite, positive-margin solution when $\lvert\varepsilon\rvert > 1$. As elasticity magnitude approaches 1 from above, the optimal price explodes toward infinity — the model's way of saying that near-unit-elastic demand has no profit-maximizing price at all under this framework, only ever-larger margins chasing an ever-shrinking, barely price-reactive customer base. Real pricing stops well short of that limit for reasons the pure elasticity model doesn't capture: competition, customer goodwill, and regulatory attention on margins that look unreasonable.
</div>

<details class="reveal reveal-recall">
  <summary>Why does higher elasticity magnitude imply a lower optimal margin?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because optimal margin equals $1/\lvert\varepsilon\rvert$ — as customers become more price-sensitive (larger $\lvert\varepsilon\rvert$), any given markup drives away proportionally more sales, so the profit-maximizing price sits closer to marginal cost.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Two categories have the same marginal cost but different elasticities: −1.5 and −4. Which carries the higher optimal margin, and why?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The −1.5 category. Optimal margin is $1/\lvert\varepsilon\rvert$, so the less elastic category (smaller $\lvert\varepsilon\rvert$) gets the higher margin — 1/1.5 ≈ 67% versus 1/4 = 25%. Less price-sensitive customers can bear a wider markup before demand collapses.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does the inverse elasticity rule break down as ε approaches −1?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The formula requires $\lvert\varepsilon\rvert > 1$ for the optimum to be finite. As $\lvert\varepsilon\rvert \to 1$ from above, the optimal price diverges toward infinity — the constant-elasticity model has no well-defined profit-maximizing price at unit elasticity or below.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why doesn't the optimal-markup formula depend on the demand constant A?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because A cancels out in the first-order condition — it scales demand up or down uniformly at every price, so it affects how much you sell but not which price ratio to marginal cost maximizes profit. Only the elasticity, which governs the curve's shape, survives into the optimum.
  </div>
</details>
