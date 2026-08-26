---
title: "Why targeting your likeliest buyers wastes most of your promo budget"
topic: "Uplift modelling"
module: "Retail Analytics"
date: 2026-08-26
reading_time: 9
summary: "The obvious way to target a promotion is to find customers most likely to buy. That predicts the wrong thing. It can't tell apart a customer who buys because of your promotion from one who was always going to buy anyway — and in the worst case, it can even target the customers your promotion actively drives away."
prerequisites: "What a randomized treatment/control test is, and basic conditional probability."
sources:
  - "Radcliffe, N. J. & Surry, P. D. (2011), 'Real-World Uplift Modelling with Significance-Based Uplift Trees' — the four-segment framework used here."
  - "Gutierrez, P. & Gérardy, J-Y. (2017), 'Causal Inference and Uplift Modelling: A Review of the Literature' — the modern survey of the field."
---

A standard response model answers "how likely is this customer to buy if I send them a promotion?" and targets whoever scores highest. That question sounds like exactly what a retailer needs, and it is the wrong question. It can't tell the difference between a customer who buys *because* of the promotion and one who was always going to buy — and paying to convert someone who needed no convincing is pure margin lost, not a marketing win.

## The setup

Run the promotion as a genuine randomized test: some customers see it (treated), some don't (control). For any customer, the quantity that actually matters is their **uplift**:

$$\text{uplift} = P(\text{buy} \mid \text{treated}) - P(\text{buy} \mid \text{control})$$

<div class="callout callout-key" markdown="1">
<span class="callout-label">The one thing to hold on to</span>
$P(\text{buy}\mid\text{treated})$ alone can't distinguish a customer who needed the promotion from one who didn't. A customer can score 0.82 on that measure and still be almost worthless to target, if 0.80 of that was going to happen without you spending a cent.
</div>

Every customer falls into one of four types, by how they'd behave with and without the promotion:

| | Would buy without promo | Wouldn't buy without promo |
|---|---|---|
| **Would buy with promo** | Sure thing — wasted spend | Persuadable — the target |
| **Wouldn't buy with promo** | Sleeping dog — promo backfires | Lost cause — wasted spend |

## A deliberately awkward test result

Four segments of 300 (100 for sleeping dogs), each with its own treated and control purchase rate from a real randomized test:

<div class="widget" data-widget="uplift-segments">
  <div class="widget-head">
    <span class="widget-title">Purchase rate · segment</span>
    <span class="widget-readout" data-readout>Sure things: uplift +0.02</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Control versus treated purchase rate for the selected segment, with the incremental purchase count from targeting it"></canvas></div>
  <div class="widget-controls">
    <div class="recall-actions" data-toggle-group>
      <button type="button" class="recall-btn" data-segment="sure" aria-pressed="true">Sure things</button>
      <button type="button" class="recall-btn" data-segment="lost" aria-pressed="false">Lost causes</button>
      <button type="button" class="recall-btn" data-segment="persuadable" aria-pressed="false">Persuadables</button>
      <button type="button" class="recall-btn" data-segment="sleeping" aria-pressed="false">Sleeping dogs</button>
    </div>
  </div>
  <p class="widget-caption">Click each segment. The light bar is the control rate — what happens with no promotion. The dark bar is treated. The gap between them, multiplied by segment size, is the incremental purchases the promotion actually caused — the only number that should decide who gets targeted.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table below carries the same argument.</p>
</div>

| Segment | Size | Control rate | Treated rate | Uplift | Incremental purchases |
|---|---|---|---|---|---|
| Sure things | 300 | 80% | 82% | +2pp | **6** |
| Lost causes | 300 | 5% | 6% | +1pp | **3** |
| Persuadables | 300 | 10% | 45% | +35pp | **105** |
| Sleeping dogs | 100 | 60% | 40% | −20pp | **−20** |

## Why the naive strategy fails

Sort by raw treated-group purchase rate and Sure Things wins easily at 82% — the naive choice for a budget that can only reach one 300-person segment. But of the 246 people who'd buy in that segment under treatment, 240 were going to buy anyway. The promotion produced **6** incremental sales, mostly paying full promotional cost for purchases that cost nothing to obtain.

Sort by uplift instead, and Persuadables wins at +35 percentage points, delivering **105** incremental purchases from a segment of the same size — **17.5× the incremental impact**, targeting a group the naive ranking would have placed *behind* Sleeping Dogs.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Where this bites</span>
A response model doesn't just miss the best segment — it can actively recommend the worst one. Sleeping Dogs still post a respectable 40% treated purchase rate, high enough to look attractive on raw response alone. Targeting them destroys 20 purchases that would have happened without any spend at all: over-marketing pushes some real customers to unsubscribe, switch to a competitor, or simply feel spammed into not buying. A raw-probability model has no way to see this coming, because it never looks at the control group at all.
</div>

<details class="reveal reveal-recall">
  <summary>Why can a customer with an 82% predicted purchase probability be a poor target for a promotion?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because that probability doesn't say whether the purchase depends on the promotion. If the control-group rate for that same customer type is nearly as high — 80%, say — almost all of the predicted purchases would have happened anyway, and the promotion is buying almost nothing incremental.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does uplift modelling require a randomized treatment/control test, rather than just historical purchase data?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because uplift is defined as the difference between two counterfactual outcomes for the same customer — what they'd do treated versus untreated — and only one of those is ever actually observed for any real customer. Randomization is what lets a control group stand in for "what this type of customer would have done anyway."
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What makes a "sleeping dog" segment actively dangerous to target, rather than merely a wasted opportunity like sure things or lost causes?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Its uplift is negative — the promotion doesn't just fail to add sales, it actively reduces purchases below what would have happened with no marketing at all. Sure things and lost causes waste budget; sleeping dogs make the outcome worse than doing nothing.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>In the example, why is targeting Persuadables 17.5× more effective than targeting Sure Things, despite Sure Things having the higher raw purchase rate?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because incremental purchases depend on uplift, not raw rate. Sure Things' high 82% rate is mostly baseline behaviour (80% control rate), leaving only 2 points of true uplift. Persuadables have a much lower raw rate (45%) but a much larger gap from their control rate (10%), giving 35 points of uplift — the number that actually determines how many extra purchases the promotion causes.
  </div>
</details>
