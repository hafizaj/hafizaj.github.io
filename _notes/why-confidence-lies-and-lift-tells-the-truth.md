---
title: "Confidence lies about which products sell each other"
topic: "Market basket analysis"
module: "Retail Analytics"
date: 2026-08-26
reading_time: 7
summary: "Two products can share the exact same confidence score — 'half the people who buy A also buy B' — and mean completely opposite things: one a genuinely strong association, the other actively negative. The difference is entirely explained by how popular B already was."
prerequisites: "Basic conditional probability."
sources:
  - "Agrawal, R., Imieliński, T. & Swami, A. (1993), 'Mining Association Rules Between Sets of Items in Large Databases' — the original support/confidence framework."
  - "Brin, S., Motwani, R., Ullman, J. D. & Tsur, S. (1997), 'Dynamic Itemset Counting and Implication Rules for Market Basket Data' — introduced lift to correct confidence's blind spot."
---

Two cross-sell rules can post the exact same confidence — 50% of A's buyers also bought B — and mean opposite things: one nearly doubles B's odds, the other actively suppresses them. The gap has nothing to do with A. It's entirely explained by how popular B already was before A ever entered the picture. **Confidence never asks how common B is on its own.**

## The setup

$$\text{support}(X) = P(X), \qquad \text{confidence}(A\!\to\!B) = P(B\mid A) = \frac{\text{support}(A \cap B)}{\text{support}(A)}$$

Confidence tells you how often B shows up alongside A. It never asks how often B shows up *anyway*.

<div class="callout callout-key" markdown="1">
<span class="callout-label">Why confidence can't see B's popularity</span>
$$\text{lift}(A\!\to\!B) = \frac{\text{support}(A\cap B)}{\text{support}(A)\cdot\text{support}(B)} = \frac{\text{confidence}(A\!\to\!B)}{\text{support}(B)}$$
Lift divides confidence by B's baseline popularity. <strong>Lift &gt; 1</strong> means A genuinely raises the chance of B above baseline. <strong>Lift = 1</strong> means A tells you nothing — B was exactly that likely anyway. <strong>Lift &lt; 1</strong> means A makes B <em>less</em> likely than baseline: a real, negative signal that plain confidence can't see at all.
</div>

## Same confidence, opposite verdicts

Out of 100 transactions:

| Rule | support(A) | support(B) | support(A∩B) | confidence | lift |
|---|---|---|---|---|---|
| Diapers → Beer | 0.20 | 0.25 | 0.10 | **0.50** | **2.00** |
| Bread → Milk | 0.40 | 0.60 | 0.20 | **0.50** | **0.83** |

**Identical confidence — 50% either way.** One is a genuine positive association twice as strong as chance. The other is a negative association: buying bread makes milk *less* likely than it already was for a random shopper, because milk is popular enough (60% baseline) that a 50% co-purchase rate is actually below average.

<div class="widget" data-widget="basket-lift">
  <div class="widget-head">
    <span class="widget-title">Lift · baseline support of B (confidence fixed at 50%)</span>
    <span class="widget-readout" data-readout>support(B) = 0.25</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Lift falling as B's baseline popularity rises, crossing the independence line of 1.0 at support 0.5"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="lift-supp">supp(B)</label>
      <input type="range" id="lift-supp" min="5" max="90" step="1" value="25">
    </div>
  </div>
  <p class="widget-caption">Holding confidence fixed at 50%, lift is purely a function of how common B already is. The curve crosses exactly 1.0 — true independence — right where support(B) also equals 50%: if B shows up in exactly the same share of all transactions as it does among A-buyers, A told you nothing.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above carries the same argument at two fixed points.</p>
</div>

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The popular-consequent trap</span>
Ranking candidate cross-sell or bundle rules by confidence alone systematically favours pairings with a popular consequent — toothpaste, milk, bread, anything nearly everyone buys — regardless of whether the antecedent adds anything. Ranking by lift instead surfaces the pairings a customer's basket actually predicts, which is usually a smaller, less obvious, and far more commercially useful list.
</div>

<details class="reveal reveal-recall">
  <summary>Two rules have identical confidence of 50%. What single number determines whether one is a strong positive association and the other a negative one?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The consequent's baseline support. Lift = confidence / support(B), so with confidence fixed, a rarer B (low support) pushes lift well above 1, while a very common B (high support) can push lift below 1 even with the same confidence figure.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What does a lift of exactly 1.0 mean?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Statistical independence between A and B — knowing a customer bought A gives you no information about whether they bought B. The co-occurrence rate exactly matches what you'd expect from B's baseline popularity alone.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does ranking cross-sell rules by confidence alone tend to favour popular consequent items?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because a popular item is likely to co-occur with almost anything at a high rate purely by chance — high confidence can appear even when the antecedent adds nothing, since confidence never divides out the consequent's own baseline popularity the way lift does.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A rule has lift = 0.83. What does that tell a retailer, practically?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Buying the antecedent makes the consequent less likely than baseline — a genuine negative association, not merely a weak positive one. It's a real signal (e.g., these items may substitute for each other, or serve different customer segments) that a confidence-only view would misread as a modest positive relationship.
  </div>
</details>
