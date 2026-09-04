---
title: "Pooling warehouses can halve your safety stock — if demand actually cooperates"
topic: "Inventory pooling"
module: "Logistics & Supply Chain Analytics"
date: 2026-08-26
updated: 2026-09-04
level: applied
featured: false
index_order: 14
source_schema: 2
takeaway: "The square-root pooling benefit assumes independent demand; positive correlation erodes it."
reading_time: 8
summary: "Consolidate four warehouses into one and the square root law promises half the safety stock. The promise is a theorem with named assumptions, one of which is that demand at the locations is uncorrelated — and the benefit shrinks continuously as that assumption fails."
prerequisites: "Variance of a sum of random variables, and what safety stock is for."
sources:
  - id: maister-1976
    author: "David H. Maister"
    title: "Centralisation of Inventories and the ‘Square Root Law’"
    publication: "International Journal of Physical Distribution 6(3), 124–134; publisher copy is subscription-gated"
    year: 1976
    url: "https://doi.org/10.1108/eb014366"
    supports: "The original statement that total inventory in a system is proportional to the square root of the number of locations at which a product is stocked."
  - id: eppen-1979
    author: "Gary D. Eppen"
    title: "Note—Effects of Centralization on Expected Costs in a Multi-Location Newsboy Problem"
    publication: "Management Science 25(5), 498–501; publisher copy is subscription-gated"
    year: 1979
    url: "https://doi.org/10.1287/mnsc.25.5.498"
    supports: "The result that the saving from centralisation depends on the correlation of demand between locations, and that the square-root case is the special case of identical, uncorrelated demands."
  - id: boylan-1997
    author: "John E. Boylan"
    title: "The Centralisation of Inventory and the Modelling of Demand, §2.2–2.4 and §14.3.2"
    publication: "PhD thesis, University of Warwick; free full text from the Warwick Research Archive Portal"
    year: 1997
    url: "https://wrap.warwick.ac.uk/id/eprint/71204/"
    supports: "Maister’s claim quoted verbatim with its √3 worked example, the ceteris paribus condition and the eight assumptions behind it, Das’s (1978) proof that the decentralised-to-centralised ratio is below √n unless demand variability is equal at every location, Eppen’s three results and his assumptions, the Zinn–Levy–Bowersox two-depot correlation formula, and the difficulty of estimating pairwise demand covariances in practice."
---

The square root law of inventory centralisation says that consolidating $n$ stocking locations into one leaves you holding $1/\sqrt{n}$ of the stock those $n$ sites held between them [1](#source-maister-1976){: .source-ref}. Maister's own illustration is that three depots hold 1.732 times what one depot would [3](#source-boylan-1997){: .source-ref}. It is a real theorem with a clean proof — and it arrives with a list of stated assumptions, one of which is that demand at the separate locations is uncorrelated. That assumption is not a technicality at the edge of the result. It is the entire mechanism.

## Where the square root comes from

Safety stock at a single location, over a fixed lead time, is $z\sigma$: a service-level multiple $z$ times the standard deviation $\sigma$ of demand over that lead time, in units of stock. Run $n$ locations, each sized the same way, and the decentralised total is

$$\text{decentralised} = n \, z\sigma \quad (\text{units}).$$

Consolidate into one location serving the same total demand. Its safety stock depends on the standard deviation of the *pooled* demand, and that is where the assumption enters. For $n$ locations each with variance $\sigma^2$ and a common pairwise correlation $\rho$,

$$\operatorname{Var}(\text{total}) = n\sigma^2 + n(n-1)\rho\sigma^2 = n\sigma^2\bigl(1 + (n-1)\rho\bigr),$$

because there are $n$ variance terms and $n(n-1)$ ordered covariance terms, each equal to $\rho\sigma^2$. Taking the square root and multiplying by $z$,

$$\text{pooled} = z\sigma\sqrt{n\bigl(1 + (n-1)\rho\bigr)}, \qquad \frac{\text{pooled}}{\text{decentralised}} = \sqrt{\frac{1 + (n-1)\rho}{n}}.$$

Set $\rho = 0$ and the covariance terms vanish, leaving $\sqrt{1/n}$ — the square root law. Nothing about consolidation itself produced that; the zero did.

<div class="callout callout-note" markdown="1">
<span class="callout-label">What else the theorem assumes</span>
Boylan sets out the assumptions behind Maister's safety-stock result: equal demand variance at every location, the same safety-stock multiple everywhere (which implies a fixed lead time), uncorrelated demand between locations, and unchanged total system demand before and after consolidation, with everything else held constant [3](#source-boylan-1997){: .source-ref}. Equal variance is doing real work too: Das proved in 1978 that the decentralised-to-centralised ratio is strictly below $\sqrt{n}$ unless demand variability is the same at all locations, in which case it attains its maximum of $\sqrt{n}$ [3](#source-boylan-1997){: .source-ref}. The square root law is the best case, not the typical one.
</div>

## Four warehouses at a 95% service level

Four regional warehouses. Weekly demand at each has standard deviation $\sigma = 100$ units, the service target is 95%, and the one-sided normal quantile for 95% is 1.6449, rounded here to $z = 1.65$:

$$\text{decentralised} = 4 \times 1.65 \times 100 = 660 \text{ units}, \qquad \text{pooled at } \rho = 0 = 1.65 \times 100 \times \sqrt{4} = 330 \text{ units}.$$

Exactly half, and the halving does not depend on $z$: the ratio $\sqrt{n}\,z\sigma / (n z\sigma)$ cancels $z$ and $\sigma$ entirely, so it would be 0.5 at a 90% or a 99% service level too. Using the unrounded 1.6449 gives 657.94 and 328.97 units — the same ratio, and a reminder that the 660 and 330 are rounded quantities of stock, not exact ones.

## Turning the correlation dial

Now move $\rho$ and hold everything else. With $n = 4$ the ratio is $\sqrt{(1+3\rho)/4}$:

| Pairwise correlation ρ | Pooled ÷ decentralised (unitless) | Pooled safety stock (units) | Reduction |
|---|---|---|---|
| −1/3 | 0.000 | 0 | 100% |
| 0 | 0.500 | 330 | 50% |
| 0.25 | 0.661 | 437 | 34% |
| 0.5 | 0.791 | 522 | 21% |
| 0.75 | 0.901 | 595 | 10% |
| 1 | 1.000 | 660 | 0% |

A third of the headline benefit is gone by $\rho = 0.25$ and three-fifths of it by $\rho = 0.5$. At $\rho = 1$ every location moves in lockstep, the combined standard deviation is $n\sigma$, and consolidation buys nothing at all. This is Eppen's result in the form used here: the magnitude of the saving depends on the correlation of demand, and the square-root case is the special case in which demands are identical and uncorrelated [2](#source-eppen-1979){: .source-ref}[3](#source-boylan-1997){: .source-ref}.

<div class="widget" data-widget="pooling-correlation">
  <div class="widget-head">
    <span class="widget-title">Pooled ÷ decoupled safety stock · correlation ρ</span>
    <span class="widget-readout" data-readout>ρ = 0.00   ratio = 0.500   reduction = 50%</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Ratio of pooled to decoupled safety stock rising from zero toward one as correlation between locations increases"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="pool-rho">ρ</label>
      <input type="range" id="pool-rho" min="0" max="1000" step="1" value="250">
    </div>
  </div>
  <p class="widget-caption">Fixed at n = 4 locations; “decoupled” in the title is the decentralised total used above. The horizontal axis is the common pairwise correlation ρ, running from −1/3 to 1; the vertical axis is the pooled-to-decoupled safety-stock ratio, unitless, ticked from 0.00 to 1.00. The slider opens at ρ = 0, the independence case. The left-hand limit is −1/3 rather than −1 because a common correlation across n locations cannot fall below −1/(n − 1) without making the variance negative.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above carries the same relationship at six fixed points.</p>
</div>

<details class="reveal">
  <summary>Why the correlation floor is −1/3 and not −1<span class="reveal-tag">2 lines</span></summary>
  <div class="reveal-body" markdown="1">
Combined variance is $n\sigma^2(1 + (n-1)\rho)$, and a variance cannot be negative, so $1 + (n-1)\rho \ge 0$, giving $\rho \ge -1/(n-1)$. At $n = 4$ that floor is $-1/3$, where the combined variance is exactly zero and pooled safety stock is zero.

Two locations *can* reach $\rho = -1$, since $-1/(n-1) = -1$ at $n = 2$; that is the equal-weight version of the perfect hedge in two-asset portfolio theory. Four locations cannot all be perfectly opposed to one another simultaneously, which is what the $-1/3$ floor records.
  </div>
</details>

## What a consolidation case has to estimate

The gap between $\rho = 0$ and the real $\rho$ is not a rounding error in a business case; at $\rho = 0.5$ it is the difference between a 50% and a 21% reduction, or 192 units of stock in the worked example above. So the question a consolidation proposal has to answer is not whether pooling helps — Eppen showed the centralised system's expected holding and penalty costs never exceed the decentralised system's [2](#source-eppen-1979){: .source-ref}[3](#source-boylan-1997){: .source-ref} — but by how much, and that answer is set by a correlation the proposal has usually not measured.

Any shared driver pushes $\rho$ upward: a national promotion, a common seasonal pattern, a macroeconomic cycle, an upstream disruption that hits every region at once. None of those are exotic, and each one moves the answer toward the right-hand end of the table.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Estimating ρ is itself the hard part</span>
The honest version of the pitch estimates pairwise correlation from historical demand data rather than assuming zero. That estimate is not free: Boylan notes that covariance estimates carry large sampling errors, particularly for slow-moving items where demand data is sparse, and that the models requiring a correlation for every pair of depots can be difficult to apply for exactly that reason [3](#source-boylan-1997){: .source-ref}. Reporting a range of outcomes across a plausible band of ρ is more defensible than reporting a single √n figure — and considerably more defensible than reporting one without saying which ρ produced it.
</div>

<details class="reveal reveal-recall">
  <summary>Which step in the derivation is the independence assumption actually used?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The variance of the pooled demand. In general $\operatorname{Var}(\text{total}) = n\sigma^2(1 + (n-1)\rho)$, with $n$ variance terms and $n(n-1)$ covariance terms. Independence sets every covariance term to zero, leaving $n\sigma^2$, a combined standard deviation of $\sigma\sqrt{n}$, and a ratio of $1/\sqrt{n}$. Everything else in the derivation — the service multiple, the demand scale, the number of locations — survives unchanged when $\rho \ne 0$.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A four-site consolidation is pitched on a 50% safety-stock saving. Historical demand shows ρ ≈ 0.5. What is the saving?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
About 21%. The ratio is $\sqrt{(1 + 3 \times 0.5)/4} = \sqrt{0.625} = 0.791$, so 660 units of decentralised safety stock becomes about 522 rather than 330 — 192 units more than the pitch claimed, and less than half the promised reduction.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why can't four warehouses reach the zero-variance case that two can?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because a common pairwise correlation across $n$ locations is bounded below by $-1/(n-1)$, or the combined variance would be negative. Two locations can be perfectly opposed at $\rho = -1$; four can only reach $-1/3$, which is still enough to drive the combined variance to zero, but it is not "exact opposition" and no arrangement of four locations achieves that.
  </div>
</details>
