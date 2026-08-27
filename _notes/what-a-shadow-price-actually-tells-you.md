---
title: "What a shadow price actually tells you (and where it stops being true)"
topic: "Linear programming"
module: "Optimisation & Decision Models"
date: 2026-08-26
reading_time: 9
summary: "A shadow price is not a fixed number attached to a resource. It's the local slope of how far your optimum can move — and that slope changes the moment a different constraint takes over."
prerequisites: "Linear programming in two variables, and reading a feasible region off a set of inequalities."
sources:
  - "Hillier, F. S. & Lieberman, G. J., <em>Introduction to Operations Research</em> — the chapter on sensitivity analysis and the dual."
  - "Bertsimas, D. & Tsitsiklis, J. N., <em>Introduction to Linear Optimization</em> — for the formal duality theory behind it."
---

Pull a shadow price off a solver's sensitivity report and it reads like a fixed number — say, £1.80 an hour for labour. Push past the range the report was computed on, though, and that number quietly stops applying: a different constraint takes over, and the true marginal value becomes something else entirely, without the report ever raising a flag. The report isn't wrong, it's just answering a narrower question than it looks like it's answering. **A shadow price is a local slope, not a fixed price tag.**

## The setup

$$\max\; z = 4x + 3y \quad \text{s.t.} \quad 2x + y \le 18 \;(\text{Resource A}), \quad x + 3y \le 24 \;(\text{Resource B}), \quad x, y \ge 0$$

Checking the four corners of the feasible region — $(0,0)$, $(9,0)$, $(0,8)$, and the intersection of the two resource constraints — the optimum sits at $(6,6)$ with $z^\* = 42$, where **both** constraints are binding.

<div class="callout callout-key" markdown="1">
<span class="callout-label">A slope, not a sticker price</span>
A shadow price is the rate of change of the optimal objective value as you relax one binding constraint by a unit — nothing more. It is a property of the optimum's current geometry, not an inherent value stamped on the resource. A non-binding constraint's shadow price is always exactly zero, no matter how scarce that resource looks on paper.
</div>

<details class="reveal">
  <summary>Show the derivation<span class="reveal-tag">5 lines</span></summary>
  <div class="reveal-body" markdown="1">
At an optimum where two constraints bind, the objective gradient must be a non-negative combination of the two constraint gradients (this is the stationarity condition of the KKT optimality conditions):

$$\begin{aligned}
4 &= 2y_1 + 1y_2 \\
3 &= 1y_1 + 3y_2
\end{aligned}$$

Solving gives $y_1 = 1.8$ and $y_2 = 0.4$ — the shadow prices of Resource A and Resource B respectively. Checked directly: relaxing Resource A's limit from 18 to 19 re-solves to $z^\*=43.8$, a rise of exactly 1.8; relaxing Resource B's limit from 24 to 25 re-solves to $z^\*=42.4$, a rise of exactly 0.4.
  </div>
</details>

## Where it stops being true

Hold Resource B fixed at 24 and let $t$ be Resource A's limit. Solving the intersection vertex as a function of $t$ and tracking when it leaves the feasible region gives a **piecewise linear** optimal value:

$$z^*(t) = \begin{cases} 3t & 0 \le t \le 8 \\ \dfrac{9t+48}{5} & 8 \le t \le 48 \\ 96 & t \ge 48 \end{cases}$$

<div class="widget" data-widget="shadow-price">
  <div class="widget-head">
    <span class="widget-title">Optimal profit z* · Resource A limit (t)</span>
    <span class="widget-readout" data-readout>t = 0</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Piecewise linear optimal value as Resource A's limit increases, with the slope changing twice"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="shadow-t">t</label>
      <input type="range" id="shadow-t" min="0" max="60" step="1" value="18">
    </div>
  </div>
  <p class="widget-caption">Below t = 8, only Resource B binds and each extra unit of A is worth its full coefficient, 3. Between 8 and 48, both bind and the shadow price is 1.8. Above 48, Resource A stops mattering altogether — the shadow price drops to zero, no matter how much more of it you buy.</p>
  <p class="widget-noscript">This figure needs JavaScript. The piecewise formula above carries the same argument.</p>
</div>

The slope of that curve **is** the shadow price, and it changes twice: once at $t=8$, when Resource B stops being the only thing that matters, and again at $t=48$, when Resource A stops mattering at all and the optimum sits permanently at $(24,0)$. The 1.8 figure quoted from a solver's output is only the middle segment's slope — correct at $t=18$, meaningless at $t=100$.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The unstated expiry date</span>
Quoting a shadow price without its valid range is the single most common misuse of sensitivity analysis. "Labour is worth £1.80 an hour, so any amount of overtime under £1.80 is a good deal" is only true up to the point where a different constraint takes over — buying enough overtime will eventually shift which constraint binds, and the true marginal value at that point is a different number, trending toward zero as the resource stops being scarce at all.
</div>

<details class="reveal reveal-recall">
  <summary>What is the shadow price of a non-binding constraint, and why?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Zero. Slack in a constraint means you already have more of that resource than the optimum is using, so one more unit of it changes nothing about where the optimum sits or what it's worth.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why do the shadow prices satisfy 4 = 2(1.8) + 1(0.4) and 3 = 1(1.8) + 3(0.4)?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because at the optimum, the objective's gradient must equal a non-negative weighted sum of the gradients of the constraints that are binding there — that is the KKT stationarity condition, and the shadow prices are exactly the weights that make it hold.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A manager says overtime at £1.50/hr is a great deal because labour's shadow price is £1.80/hr, no matter how much they buy. What's wrong?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The £1.80 figure is only valid within the range where the same constraints stay binding. Buying enough overtime eventually shifts which constraint binds — or removes labour from being a binding constraint entirely — at which point the true marginal value is different, and can fall to zero.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>In the example, why is the shadow price 3 (not 1.8) for very small values of t?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Below t = 8, Resource A is so scarce that Resource B never binds at all — the optimum sits at (0, t), constrained only by A. There, every extra unit of A converts directly into extra y at its full objective coefficient of 3, with no competing constraint to share the benefit with.
  </div>
</details>
