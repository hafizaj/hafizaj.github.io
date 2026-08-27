---
title: "A sigmoid's gradient tops out at 0.25 — that's the vanishing-gradient problem"
topic: "Backpropagation"
module: "Deep Learning & Neural Networks"
date: 2026-03-10
reading_time: 8
summary: "Backpropagation multiplies a gradient signal through every layer it passes. When each layer's multiplier is reliably below one — which a saturating activation like sigmoid all but guarantees — the product collapses geometrically with depth, and early layers stop learning."
prerequisites: "The chain rule, and what a partial derivative of a loss with respect to a weight represents."
sources:
  - "Hochreiter, S. (1991) — the original identification of the vanishing gradient problem."
  - "Glorot, X. & Bengio, Y. (2010), 'Understanding the difficulty of training deep feedforward neural networks' — the initialization analysis."
  - "Goodfellow, I., Bengio, Y. & Courville, A., <em>Deep Learning</em>, §8.2.5 — the modern textbook treatment."
---

Every sigmoid unit's derivative peaks at 0.25, and only exactly at $z=0$ — everywhere else it's smaller. Chain that ceiling through backpropagation across just ten layers, even in the best case where every unit sits at that peak, and less than a millionth of the original gradient survives to reach the front of the network. That's not a quirk of any particular architecture; it's what the chain rule does to a factor that's reliably below one. Twenty-layer sigmoid networks from the 1990s were nearly untrainable for exactly this reason, and it took over a decade for the fix — ReLU, better initialisation, batch normalisation, residual connections — to become standard practice.

## The setup

Backpropagation sends the gradient of the loss backward through the network by the chain rule. For a simple chain, the gradient reaching an early weight is (loosely, but correctly in spirit) a product of per-layer factors:

$$\frac{\partial \mathcal{L}}{\partial w_1} \;\approx\; \frac{\partial \mathcal{L}}{\partial a_L}\prod_{l=2}^{L} w_l\,\sigma'(z_l)$$

<div class="callout callout-key" markdown="1">
<span class="callout-label">Why 0.25 is a ceiling, not a typical value</span>
The sigmoid derivative $\sigma'(z) = \sigma(z)\big(1-\sigma(z)\big)$ has a maximum value of exactly <strong>0.25</strong>, reached only at $z=0$. Every sigmoid layer, in the best possible case, multiplies the backward-flowing gradient by no more than a quarter — and away from $z=0$, where units are even slightly saturated, by much less.
</div>

<details class="reveal">
  <summary>Verify the 0.25 maximum<span class="reveal-tag">3 lines</span></summary>
  <div class="reveal-body" markdown="1">
Writing $\sigma'(z) = \sigma(1-\sigma)$ as a function of $\sigma \in (0,1)$: $\dfrac{d}{d\sigma}\big[\sigma - \sigma^2\big] = 1 - 2\sigma = 0 \implies \sigma = 0.5$, and the second derivative is $-2 < 0$, confirming a maximum. At $\sigma = 0.5$ (i.e. $z=0$): $\sigma'(z) = 0.5 \times 0.5 = 0.25$.
  </div>
</details>

## What 0.25 compounds into over ten layers

Define $m$ as a typical per-layer multiplier: weight magnitude times activation derivative. For sigmoid with modestly-sized weights near 1, even the *best case* gives $m \approx 1 \times 0.25 = 0.25$. For ReLU, an active unit's derivative is exactly 1, so with initialisation tuned to keep signal variance roughly stable across layers, $m$ stays close to 1.

$$\text{relative gradient magnitude after } L \text{ layers} \;\approx\; m^L$$

<div class="widget" data-widget="vanishing-gradient">
  <div class="widget-head">
    <span class="widget-title">Gradient magnitude · depth L</span>
    <span class="widget-readout" data-readout>m = 1.00</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Relative gradient magnitude collapsing exponentially with depth for a per-layer multiplier below one"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="grad-m">m</label>
      <input type="range" id="grad-m" min="5" max="150" step="1" value="100">
    </div>
  </div>
  <p class="widget-caption">At m = 0.25 — an optimistic sigmoid layer — the gradient at layer 10 is already about a millionth of its size at the output. At m = 0.90, typical of a well-initialised ReLU stack, about 35% survives the same ten layers.</p>
  <p class="widget-noscript">This figure needs JavaScript. The numbers in the caption carry the same argument.</p>
</div>

At $m=0.25$: $0.25^{10} \approx 9.5 \times 10^{-7}$ — roughly a millionth of the original signal, after just ten layers, in the *optimistic* case where every unit sits exactly at $z=0$. At $m=0.9$: $0.9^{10} \approx 0.349$ — still a third of the signal remains. That gap compounds catastrophically with every additional layer, which is exactly why the earliest layers of a deep sigmoid network barely move during training: the gradient reaching them has, for practical purposes, already vanished.

## Why ReLU changes this — and what it doesn't fix

ReLU's derivative is exactly 1 for any active unit and 0 for an inactive one, so it removes the automatic sub-one ceiling sigmoid imposes on every single layer.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The dying-ReLU trade-off</span>
Switching to ReLU trades the vanishing-gradient problem for the "dying ReLU" problem: a unit that falls into the negative region can end up with a permanently zero derivative and never update again. And even with ReLU, genuinely deep networks (50+ layers) typically still need batch normalisation or residual connections to train reliably — ReLU alone raises the depth ceiling, it does not remove it.
</div>

<details class="reveal reveal-recall">
  <summary>What is the maximum possible value of the sigmoid derivative, and where does it occur?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
0.25, at z = 0 (where σ(z) = 0.5). Away from zero, as a unit saturates toward 0 or 1, the derivative shrinks further.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does a chain of sigmoid layers cause the gradient to shrink geometrically with depth, even in the best case?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Backpropagation multiplies a per-layer factor — roughly weight times activation derivative — through every layer. Sigmoid's derivative is capped at 0.25, so a product of many factors each no larger than that (times typical weight sizes) shrinks exponentially in the number of layers.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does replacing sigmoid with ReLU help, and what does it not fix on its own?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
ReLU's derivative is exactly 1 for active units, removing sigmoid's automatic sub-one ceiling. It introduces the dying-ReLU problem instead, and very deep ReLU networks still typically need batch normalisation or residual connections to train reliably.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>At a per-layer multiplier of 0.25, roughly what fraction of the gradient survives after 10 layers?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
About a millionth (0.25¹⁰ ≈ 9.5 × 10⁻⁷) — vanishingly small, which is why the earliest layers of a deep sigmoid network barely update.
  </div>
</details>
