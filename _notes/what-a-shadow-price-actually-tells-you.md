---
title: "What a shadow price actually tells you (and where it stops being true)"
topic: "Linear programming"
module: "Optimisation & Decision Models"
date: 2026-08-26
updated: 2026-09-04
level: applied
featured: false
index_order: 13
source_schema: 2
takeaway: "A shadow price is a local marginal value that holds only while the active constraints stay unchanged."
reading_time: 9
summary: "A solver's sensitivity report prints a shadow price for every constraint and an allowable range next to it. The number is a slope measured at one point, and the range is the part of the report that says how far that slope can be trusted."
prerequisites: "Linear programming in two variables, and reading a feasible region off a set of inequalities."
sources:
  - id: mit-ocw-15053
    author: "James Orlin and Ebrahim Nasrabadi"
    title: "Sensitivity analysis and shadow prices (15.053 Optimization Methods in Management Science, Lecture 6)"
    publication: "MIT OpenCourseWare, MIT Sloan School of Management; free full text"
    year: 2013
    url: "https://ocw.mit.edu/courses/15-053-optimization-methods-in-management-science-spring-2013/resources/mit15_053s13_lec6/"
    supports: "The definition of a shadow price as the increase in the optimal objective value per unit increase in the right-hand side of a constraint; the statement that a shadow price is valid only within that constraint’s allowable right-hand-side range, which sensitivity reports print as an allowable increase and decrease; that the report does not say what happens outside that range; and that the shadow price of every non-binding constraint is zero."
  - id: boyd-vandenberghe-2004
    author: "Stephen Boyd and Lieven Vandenberghe"
    title: "Convex Optimization, §5.6 ‘Perturbation and sensitivity analysis’"
    publication: "Cambridge University Press; free full text from the authors"
    year: 2004
    url: "https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf"
    supports: "The perturbed optimal value function p*(u) and its convexity; the global inequality p*(u) ≥ p*(0) − λ*ᵀu, which makes the shadow-price extrapolation a bound rather than a prediction away from the measured point; and the local result λ*ᵢ = −∂p*(0)/∂uᵢ, that optimal dual variables are exactly the local sensitivities of the optimal value when that function is differentiable and strong duality holds."
---

A sensitivity report answers a question that sounds like "what is an hour of labour worth to us?" It actually answers a narrower one: "if the plan were re-optimised with one more hour available, and nothing else about which constraints matter changed, how much more contribution would the plan earn?" The two questions have the same answer over a stated interval and different answers outside it, and the interval sits two columns further along the same row, split into an allowable increase and an allowable decrease.

## A plan with two scarce resources

Two products, $x$ and $y$, each earning a contribution of £4 and £3 per unit. Each unit of $x$ uses 2 labour hours and 1 machine hour; each unit of $y$ uses 1 labour hour and 3 machine hours. There are 18 labour hours and 24 machine hours in the week:

$$\max\; z = 4x + 3y \quad \text{subject to} \quad 2x + y \le 18, \quad x + 3y \le 24, \quad x, y \ge 0.$$

A constraint is *binding* at a solution when it holds with equality — the resource is fully used — and has *slack* otherwise. The feasible region here has four corners: $(0,0)$ with $z = 0$, $(9,0)$ with $z = 36$, $(0,8)$ with $z = 24$, and the point where the two resource lines meet, $(6,6)$, with $z = 42$. The optimum is $(6,6)$, and both resources are used to the last hour.

## Reading 1.8 as a rate, not a price tag

The shadow price of a constraint is the increase in the optimal objective value per unit increase in that constraint's right-hand side [1](#source-mit-ocw-15053){: .source-ref}. For this plan the labour constraint's shadow price is £1.80 an hour and the machine constraint's is £0.40 an hour.

<details class="reveal">
  <summary>Where 1.8 and 0.4 come from, and a direct check<span class="reveal-tag">5 lines</span></summary>
  <div class="reveal-body" markdown="1">
At an optimum where both constraints bind, the objective's gradient is a non-negative combination of the two constraint gradients — the stationarity condition of the Karush–Kuhn–Tucker conditions. Writing $y_1$ and $y_2$ for the weights on the labour and machine constraints:

$$\begin{aligned}
4 &= 2y_1 + 1y_2 \\
3 &= 1y_1 + 3y_2
\end{aligned}$$

Substituting $y_2 = 4 - 2y_1$ into the second equation gives $y_1 - 6y_1 + 12 = 3$, so $y_1 = 1.8$ and $y_2 = 0.4$.

Re-solving confirms both. With 19 labour hours the optimum moves to $(6.6, 5.8)$ and $z = 43.8$, up by exactly 1.8. With 25 machine hours it moves to $(5.8, 6.4)$ and $z = 42.4$, up by exactly 0.4.
  </div>
</details>

<div class="callout callout-key" markdown="1">
<span class="callout-label">A dual value is not the price you pay for the resource</span>
The £1.80 is the weight $y_1$ solved for above — a *dual value*, one number per constraint rather than one per product. It is not what an hour of labour costs, and it is not an accounting figure recorded anywhere in the ledger. It is the rate at which the optimised plan converts one more hour into contribution, given everything else the plan is up against. The same hour, in a week where labour is not the thing holding the plan back, is worth £0 by this measure while costing exactly what it always did. Because it is a marginal value rather than a price, it also depends on what is already in the objective: the comparison "£1.80 beats £1.50 an hour" only makes sense if that £1.50 is an extra cost not already deducted inside the £4 and £3 contributions.
</div>

## How far the 1.8 reaches

Hold machine hours at 24 and let $t$ be the labour hours available. Solving the two binding equations as functions of $t$ gives $x = (3t-24)/5$ and $y = (48-t)/5$. That vertex is the optimum only while both coordinates are non-negative, which is the interval $8 \le t \le 48$. Inside it the optimal value is $z(t) = (9t + 48)/5$, whose slope is $9/5 = 1.8$. Outside it, the optimum sits somewhere else:

$$z(t) = \begin{cases} 3t & 0 \le t \le 8 \\[2pt] \dfrac{9t+48}{5} & 8 \le t \le 48 \\[2pt] 96 & t \ge 48 \end{cases}$$

Below 8 hours labour is so scarce that machine time is never exhausted; the plan makes only $y$, and each labour hour converts at the full £3. Above 48 hours labour stops binding, the plan settles at $(24, 0)$ with $z = 96$, and further hours are worth nothing — the shadow price of a non-binding constraint is zero [1](#source-mit-ocw-15053){: .source-ref}. This is what a sensitivity report is recording when it prints an allowable increase and an allowable decrease beside each shadow price: at $t = 18$ the allowable decrease is 10 hours and the allowable increase is 30, and the report is explicit that it does not say what happens beyond them [1](#source-mit-ocw-15053){: .source-ref}.

<div class="widget" data-widget="shadow-price">
  <div class="widget-head">
    <span class="widget-title">Optimal profit z* · Resource A limit (t)</span>
    <span class="widget-readout" data-readout>t = 18   z* = 42.0   shadow price = 1.8</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Piecewise linear optimal value as Resource A's limit increases, with the slope changing twice"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="shadow-t">t</label>
      <input type="range" id="shadow-t" min="0" max="60" step="1" value="18">
    </div>
  </div>
  <p class="widget-caption">Resource A is the labour constraint. Horizontal axis: labour hours available, t, from 0 to 60, with dashed lines at the two breakpoints, 8 and 48. Vertical axis: optimal contribution z in £, from 0 to about 105. The readout gives the slope of the segment the marker sits on, which is the shadow price at that t: 3 below 8, 1.8 between 8 and 48, 0 above 48. The slider opens at t = 18, the week described above.</p>
  <p class="widget-noscript">This figure needs JavaScript. The piecewise formula above gives the same curve, and its three slopes are the three shadow prices.</p>
</div>

## Why the slope will not extrapolate

The curve is concave and built from straight pieces, so the line drawn through one piece's slope sits above the true curve everywhere else on it. Extrapolating from $t = 18$ at £1.80 an hour predicts $42 + 1.8 \times 42 = £117.60$ at 60 hours. The true optimum there is £96. The linear estimate is 22.5% too high, and it was never a forecast in the first place.

That is a general property rather than an accident of these numbers. Boyd and Vandenberghe define the perturbed optimal value $p^{\star}(u)$ as the optimum after each constraint is loosened by $u_i$, and show that under strong duality it satisfies $p^{\star}(u) \ge p^{\star}(0) - \lambda^{\star \mathsf{T}} u$ for every $u$: the affine function built from the dual values is a bound on the true optimal value curve, not a description of it [2](#source-boyd-vandenberghe-2004){: .source-ref}. Only in the limit does the dual value become an equality — where $p^{\star}$ is differentiable, $\lambda^{\star}_i = -\partial p^{\star}(0)/\partial u_i$, so the optimal dual variables are exactly the local sensitivities of the optimal value [2](#source-boyd-vandenberghe-2004){: .source-ref}. Their statement is for a minimisation, where $p^{\star}$ is convex and the affine estimate sits below the curve; the maximisation above is the mirror image, with a concave curve and an estimate that sits above it.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The purchase that pays until it suddenly doesn't</span>
Overtime at £1.50 an hour looks unambiguously good against a shadow price of £1.80. Buy 30 extra hours, taking labour from 18 to the top of its allowable range at 48, and contribution rises from £42 to £96 for a cost of £45 — a £9 gain. Buy 42 hours instead and contribution still rises to £96, because the last 12 hours are past the point where labour binds, while the bill rises to £63. The same £1.50 rate that made money over the first 30 hours loses £9 over 42. The report never flagged it, because the question it answered was about one hour, not forty-two.
</div>

<details class="reveal reveal-recall">
  <summary>What is the shadow price of a constraint that has slack at the optimum, and why?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Zero. The plan is not using all of that resource, so one more unit of it changes neither the optimal plan nor its value. In the example this is what happens to labour above 48 hours: the optimum stays at (24, 0) and z stays at 96.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Labour has a shadow price of £1.80 with an allowable increase of 30 hours. What does the report say about buying 42 extra hours?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Nothing at all — that is outside the range the number was computed for. Re-solving is the only way to find out, and here it shows that the last 12 of those 42 hours are worth £0 each, so the true gain is £54 rather than the £75.60 the shadow price would suggest.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does the slope fall from 3 to 1.8 at t = 8, and to 0 at t = 48?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the set of binding constraints changes at each breakpoint. Below 8 hours only labour binds and each hour converts at the full objective coefficient of 3. Between 8 and 48 both constraints bind and the extra hour has to be shared with machine time, giving 1.8. Above 48 labour no longer binds at all, so extra hours add nothing.
  </div>
</details>
