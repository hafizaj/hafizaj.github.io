---
title: "Price sensitivity alone sets your optimal markup"
topic: "Pricing"
module: "Retail Analytics"
date: 2026-08-26
updated: 2026-09-04
level: applied
featured: false
index_order: 19
takeaway: "Under the stated demand assumptions, the optimal markup is pinned down by elasticity."
source_schema: 2
reading_time: 7
summary: "Ninety-two years on, the rule still reads: profit-maximising margin equals one over the elasticity. What it never says is which elasticity — and the category figures a retailer can actually measure are mostly below one, where the rule has no solution at all."
prerequisites: "What price elasticity of demand means, and basic calculus (one derivative)."
sources:
  - id: lerner-1934
    author: "Abba P. Lerner"
    title: "The Concept of Monopoly and the Measurement of Monopoly Power"
    publication: "The Review of Economic Studies, volume 1, issue 3, 157–175; now published by Oxford University Press and subscription-gated"
    year: 1934
    url: "https://doi.org/10.2307/2967480"
    supports: "The origin of the ratio of price less marginal cost to price as a measure of monopoly power, and the name it is still known by. The DOI resolves to academic.oup.com, which returned HTTP 403 to automated clients on 4 September 2026, so the paper was not read; the bibliographic record was confirmed against Crossref and the definition and the attribution are carried here by Hall, who states both in a document that is free in full."
  - id: hall-2018
    author: "Robert E. Hall"
    title: "Using Empirical Marginal Cost to Measure Market Power in the US Economy"
    publication: "NBER Working Paper 25251; full PDF free from nber.org"
    year: 2018
    url: "https://www.nber.org/system/files/working_papers/w25251/w25251.pdf"
    supports: "The Lerner index named and defined as the ratio of price less marginal cost to price; the statement that a firm facing constant-elastic residual demand maximises profit where the Lerner index equals one over that elasticity, which is the word residual this note leans on; the markup ratio identity μ = 1/(1−L); and the reported typical Lerner index of 0.15 across 60 KLEMS industries between 1988 and 2015."
  - id: pindyck-2010
    author: "Robert S. Pindyck"
    title: "Lecture Notes on Pricing, MIT Sloan 15.013 Industrial Economics for Strategic Decisions"
    publication: "Massachusetts Institute of Technology, August 2010; PDF free from the author's MIT page"
    year: 2010
    url: "https://www.mit.edu/~rpindyck/Courses/Pricing_10.pdf"
    supports: "The markup condition written with a negative elasticity, (P − MC)/P = −1/E_d, and its rearrangement P = MC/(1 + 1/E_d); the statement that E_d is the firm's own price elasticity of demand and that the market elasticity is the relevant one only if the firm is a monopolist; and the Cournot construction used to get from one to the other."
  - id: core-econ-unit7
    author: "The CORE Econ team"
    title: "The Economy 1.0, Unit 7: The firm and its customers"
    publication: "CORE Econ; free online textbook"
    url: "https://books.core-econ.org/the-economy-v1/book/text/07.html"
    supports: "The opposite sign convention, in which the price elasticity of demand is expressed as a positive number and demand is called elastic above one; the definition of the price markup as price minus marginal cost divided by price; the derivation of (P − MC)/P = 1/elasticity from the tangency of the isoprofit curve and the demand curve for a differentiated product; and the textbook's own reproduction of the Harding and Lovenheim food elasticities."
  - id: harding-lovenheim-2013
    author: "Matthew Harding and Michael Lovenheim"
    title: "The Effect of Prices on Nutrition: Comparing the Impact of Product- and Nutrient-Specific Taxes"
    publication: "NBER Working Paper 19781; full PDF free from nber.org"
    year: 2013
    url: "https://www.nber.org/system/files/working_papers/w19781/w19781.pdf"
    supports: "Table 3, the mean own-price elasticities for all 33 food category groups estimated from 2002–2007 Nielsen Homescan data, and the paper's own summary that most products are fairly price inelastic with soda, milk and cold beverages the exception. Every category figure quoted here was read from that table rather than from the textbook that reproduces part of it."
---

Abba Lerner wrote the ratio down in 1934 — price less marginal cost, over price [1](#source-lerner-1934){: .source-ref} — and ninety-two years of pricing research have not displaced it. What that ratio measures is market power. What turns it into a pricing rule is a second result — a firm facing constant-elastic residual demand maximises profit exactly where the ratio equals the reciprocal of that elasticity [2](#source-hall-2018){: .source-ref}. Almost everything that goes wrong in applying it goes wrong on the word *residual*.

## Where the reciprocal comes from

Let $Q(P)$ be quantity demanded at price $P$, and let $c$ be constant marginal cost. Profit is $\pi(P) = (P-c)\,Q(P)$. Differentiate, set to zero, and divide through by $Q$:

$$Q + (P-c)\frac{dQ}{dP} = 0 \quad\Longrightarrow\quad \frac{P-c}{P}\cdot\underbrace{\frac{P}{Q}\frac{dQ}{dP}}_{\varepsilon} = -1 .$$

That is the whole derivation. Nothing after it is new information; it is one rearrangement:

$$\frac{P-c}{P} = -\frac{1}{\varepsilon}.$$

Two sign conventions are in circulation and they disagree by a minus sign, not by content. Pindyck's lecture notes write $\varepsilon$ as the negative number it is for a normal good and carry the minus sign in the formula, $(P - MC)/P = -1/E_d$ [3](#source-pindyck-2010){: .source-ref}. CORE's textbook defines the elasticity as a positive number and drops it, $(P - MC)/P = 1/\varepsilon$ [4](#source-core-econ-unit7){: .source-ref}. This note follows the first when it writes $\varepsilon$ and the second when it writes $\lvert\varepsilon\rvert$, and the widget below is labelled with magnitudes throughout.

<details class="reveal">
  <summary>The closed form when elasticity is the same at every price<span class="reveal-tag">Derivation</span></summary>
  <div class="reveal-body" markdown="1">
Assume $Q(P) = A P^{\varepsilon}$, where the positive constant $A$ sets the scale of demand. Then $\dfrac{P}{Q}\dfrac{dQ}{dP} = \varepsilon$ at *every* price, not merely at the optimum, which is what makes the family convenient. Profit is $A\left(P^{\varepsilon+1} - cP^{\varepsilon}\right)$, so

$$\frac{d\pi}{dP} = AP^{\varepsilon-1}\big[(\varepsilon+1)P - c\varepsilon\big] = 0 \quad\Longrightarrow\quad P^{\ast} = \frac{c\,\varepsilon}{\varepsilon+1} = \frac{c\lvert\varepsilon\rvert}{\lvert\varepsilon\rvert-1}.$$

Substituting back gives $(P^{\ast}-c)/P^{\ast} = 1/\lvert\varepsilon\rvert$. The scale constant $A$ divides out of the first-order condition before the solution appears, so it changes how much is sold and never which price is best.

The equivalent statement in Hall's notation is the markup ratio $\mu = P/c = 1/(1-L)$, where $L$ is the Lerner index [2](#source-hall-2018){: .source-ref}. At $L = 0.40$ that is $\mu = 1.667$, a price of $1.667c$.
  </div>
</details>

## Which elasticity belongs in the denominator

The derivation used $dQ/dP$ for the demand curve **the firm itself faces** when it changes its own price and everyone else holds still. Hall states the result for constant-elastic *residual* demand [2](#source-hall-2018){: .source-ref}; Pindyck writes $E_d$ for the firm's price elasticity and says the market elasticity $E_D$ is the right input only if the firm is a monopolist, then spends the following section deriving the firm's from the market's under Cournot competition [3](#source-pindyck-2010){: .source-ref}. A category elasticity estimated from category-level price variation is the second quantity, not the first, and substituting it is the most common way to get a confident wrong answer out of this formula.

Three further conditions are doing silent work:

- **Constant elasticity.** $Q = AP^{\varepsilon}$ fixes $\varepsilon$ at every price. Under any other demand curve the elasticity is a local property, so $-1/\varepsilon$ is a condition the optimum satisfies rather than a price you can compute from an elasticity measured somewhere else on the curve.
- **Constant marginal cost.** $c$ does not move with volume, which rules out capacity limits, volume discounts on inputs, and learning effects. And it is *marginal* cost: fixed costs never enter, so a price that satisfies the rule is not thereby profitable.
- **Elastic demand.** Marginal revenue is $P\left(1 + 1/\varepsilon\right)$, which is positive only when $\lvert\varepsilon\rvert > 1$. Below that the closed form returns a negative price, which is the algebra reporting that there is no interior optimum to find: under constant inelastic demand, revenue $AP^{\varepsilon+1}$ grows without bound as price rises while variable cost falls to zero.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The rule prices one product, once, against no one</span>
Nothing in the derivation contains a competitor, a second product, or a second period. A rival's response to the new price would change the residual demand curve the elasticity was measured on. A complement in the same basket means the margin foregone on this product can be recovered on another, so the single-product optimum is not the assortment optimum. And a durable or stockpiled good moves purchases between periods rather than creating them, which a static first-order condition cannot see. Each of these is a reason the arithmetic below can be exactly right and still be the wrong price.
</div>

## A unit cost of USD 10 across the slider's range

Fix $c$ at USD 10 and read the optimum across the whole range the slider offers. Every row is $P^{\ast} = 10\lvert\varepsilon\rvert/(\lvert\varepsilon\rvert-1)$, and the margin column is the reciprocal it implies.

| $\lvert\varepsilon\rvert$ | $P^{\ast}$ (USD) | Margin on price $(P^{\ast}-c)/P^{\ast}$ | $1/\lvert\varepsilon\rvert$ | Markup on cost $P^{\ast}/c - 1$ |
|---|---|---|---|---|
| 1.2 | 60.00 | 83.3% | 83.3% | 500.0% |
| 1.5 | 30.00 | 66.7% | 66.7% | 200.0% |
| 2.0 | 20.00 | 50.0% | 50.0% | 100.0% |
| 2.5 | **16.67** | **40.0%** | 40.0% | 66.7% |
| 3.0 | 15.00 | 33.3% | 33.3% | 50.0% |
| 4.0 | 13.33 | 25.0% | 25.0% | 33.3% |
| 5.0 | 12.50 | 20.0% | 20.0% | 25.0% |
| 6.0 | 12.00 | 16.7% | 16.7% | 20.0% |

The third and fourth columns agree row by row, which is the identity rather than a coincidence. The fifth is a different number from the third and the two are routinely confused: at $\lvert\varepsilon\rvert = 2.5$ a 40% margin on price is a 66.7% markup on cost.

<div class="widget" data-widget="elasticity-markup">
  <div class="widget-head">
    <span class="widget-title">Optimal margin · elasticity magnitude |ε|</span>
    <span class="widget-readout" data-readout>|ε| = 2.50   margin = 40.0%   P* = <span>$</span>16.67 (c=<span>$</span>10)</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Optimal profit margin percentage falling as elasticity magnitude rises"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="eps-mag">|ε|</label>
      <input type="range" id="eps-mag" min="120" max="600" step="1" value="250">
    </div>
  </div>
  <p class="widget-caption">Horizontal axis: elasticity magnitude, running from 1.2 to 6.0; vertical axis: optimal margin as a percentage of price, with gridlines at 0, 25, 50, 75 and 100%. Elasticity magnitude and margin are both unitless; the price in the readout is USD against a unit cost of USD 10. The curve is 1/|ε| exactly, so it falls from 83.3% at the left-hand limit to 16.7% at the right, and bends hardest where demand is least sensitive.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above lists eight points on the same curve, including both slider limits.</p>
</div>

## What the measured category elasticities say

Harding and Lovenheim estimated mean own-price elasticities for 33 food category groups from 2002–2007 Nielsen Homescan data [5](#source-harding-lovenheim-2013){: .source-ref}. Twenty of the 33 come back with a magnitude below 1, and three of those are estimated with the wrong sign altogether. Their own summary is that most products are fairly price inelastic, with soda, milk and cold beverages the exception; the two soda groups are the most responsive in the table at −2.260 and −2.197 [5](#source-harding-lovenheim-2013){: .source-ref}.

| Category group | Own-price elasticity | $1/\lvert\varepsilon\rvert$ |
|---|---|---|
| Soda, group 11 | −2.260 | 44.2% |
| Milk, group 31 | −1.972 | 50.7% |
| Fruits & vegetables, group 1 | −1.128 | 88.7% |
| Grain, pasta, bread, group 15 | −0.845 | no interior optimum |
| Snacks, candy, group 28 | −0.270 | no interior optimum |
| Meat, protein, group 23 | +0.011 | no interior optimum |

Read the right-hand column literally and it says a supermarket should take an 88.7% margin on fruit and vegetables and has no profit-maximising price for bread at all. It says that because the left-hand column is the wrong elasticity: it describes how a category's total volume responds when the price of the whole category moves, which is not the curve any single seller faces. Hall's measured Lerner indexes, computed from marginal cost rather than from demand, come in at a typical 0.15 across the 60 KLEMS industries he covers [2](#source-hall-2018){: .source-ref} — which, read back through the same rule, implies a residual elasticity near 6.7: roughly the right-hand end of the slider above, and close to three times the magnitude of the most elastic category in the table.

<div class="callout callout-note" markdown="1">
<span class="callout-label">Two ways to reach the same margin, only one of which needs a demand curve</span>
Hall's approach is deliberately the other way round: measure marginal cost directly from the change in cost against the change in output, and read the Lerner index off price and cost without estimating any elasticity at all [2](#source-hall-2018){: .source-ref}. The demand-side route this note derives and the production-side route Hall takes are two estimators of the same ratio, so a gap between them is informative. If a category's measured margin sits far from $1/\lvert\varepsilon\rvert$, the candidate explanations are a mismeasured marginal cost, an elasticity taken at the wrong level of aggregation, or a price that is not maximising static profit — and the formula cannot tell you which.
</div>

<details class="reveal reveal-recall">
  <summary>Why does the demand constant $A$ never appear in the optimal price?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because it factors out before the optimum is solved for. Profit is $A(P^{\varepsilon+1} - cP^{\varepsilon})$, and the derivative is $AP^{\varepsilon-1}[(\varepsilon+1)P - c\varepsilon]$; setting that to zero divides $A$ away, leaving $P^{\ast} = c\varepsilon/(\varepsilon+1)$. Scaling demand up or down changes how many units sell at the best price, not which price is best.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A category's measured own-price elasticity is −0.85. What does the rule say the seller's margin should be?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Nothing, twice over. First, the closed form needs $\lvert\varepsilon\rvert > 1$; at 0.85 marginal revenue $P(1 + 1/\varepsilon)$ is negative and the model has no finite optimum. Second, a category elasticity is not the residual demand elasticity the derivation requires — it measures what happens when every seller in the category moves price together, which is not the experiment a single seller runs.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Marginal cost is USD 10 and the optimal price is USD 16.67. Is the markup 40% or 66.7%?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Both, in different bases. The margin on price is $(16.67 - 10)/16.67 = 40\%$, and that is the quantity the Lerner index and this rule are about. The markup on cost is $16.67/10 - 1 = 66.7\%$, which is the figure a buying team is more likely to quote. They coincide only at zero, and the gap widens fast: at $\lvert\varepsilon\rvert = 1.2$ they are 83.3% and 500%.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>The rule returns the profit-maximising price. Why is that not the same as returning a profitable price?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because only marginal cost enters it. The first-order condition compares the revenue from one more unit against the cost of one more unit, and fixed costs are identical whichever price is chosen, so they cannot influence the answer. A product can sit exactly at $1/\lvert\varepsilon\rvert$ and still lose money once shelf space, staff and overhead are counted; the rule finds the best of the available prices, not a guarantee that the best one clears the fixed costs.
  </div>
</details>
