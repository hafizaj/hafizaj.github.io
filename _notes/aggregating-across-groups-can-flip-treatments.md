---
title: "Can a treatment win in every subgroup and still lose overall?"
topic: "Confounding"
module: "Causal Modelling"
date: 2026-08-26
updated: 2026-09-04
level: foundation
featured: false
index_order: 11
takeaway: "Unequal subgroup weights can reverse an aggregate comparison even when every subgroup agrees."
source_schema: 2
reading_time: 10
summary: "Every rate in the table is correct and the comparison still reverses when the groups are pooled. The reversal is arithmetic; deciding which table to act on is not, and the wrong choice of variable to stratify by creates bias rather than removing it."
prerequisites: "Conditional probability, and what it means for two variables to be independent."
sources:
  - id: simpson-1951
    author: "Edward H. Simpson"
    title: "The Interpretation of Interaction in Contingency Tables"
    publication: "Journal of the Royal Statistical Society, Series B 13(2), 238–241; publisher copy is subscription-gated"
    year: 1951
    url: "https://doi.org/10.1111/j.2517-6161.1951.tb00088.x"
    supports: "The 1951 paper the reversal is named after. The publisher copy is gated, so what it says is reported here through Pearl’s account of it rather than quoted from the original."
  - id: pearl-2014
    author: "Judea Pearl"
    title: "Comment: Understanding Simpson’s Paradox"
    publication: "The American Statistician 68(1), 8–13; free author’s reprint from UCLA"
    year: 2014
    url: "https://ftp.cs.ucla.edu/pub/stat_ser/r414-reprint.pdf"
    supports: "The definition of the reversal as an association between two variables changing sign on conditioning a third; the sure-thing theorem, which rules out reversal for an action that does not change the distribution of the subpopulations; Simpson’s own observation that the more sensible reading is sometimes the aggregate table and sometimes the subgroups; the back-door criterion for deciding whether a covariate should be conditioned on; Pearl’s account of Lindley and Novick’s result that no statistical criterion warns an investigator against the wrong choice; and the treatment of colliders, where conditioning on a common consequence of two independent causes makes them dependent."
  - id: hernan-robins-whatif
    author: "Miguel A. Hernán and James M. Robins"
    title: "Causal Inference: What If, §6.5, §7.1–7.3 and §8.1–8.3"
    publication: "Chapman & Hall/CRC; free full text, edition dated 19 August 2026"
    year: 2026
    url: "https://miguelhernan.org/whatifbook"
    supports: "The structural distinction between confounding, which is created by a common cause of treatment and outcome, and selection bias, which is created by conditioning on a common effect of treatment and outcome."
---

Neither reading of the trial below contains an arithmetic error, and the two disagree about which treatment to give. Split by severity, Treatment A recovers more patients than Treatment B among easy cases, 95% against 90%, and among hard cases, 25% against 20%. Pool the four cells and B wins by a distance: 83.6% against 31.4%. No patient has been counted twice, and neither treatment changed between the two views of the data.

Reversals like this are named after Simpson's 1951 paper on interpreting contingency tables [1](#source-simpson-1951){: .source-ref}. Judea Pearl states the phenomenon compactly: conditioning on a third variable — remaking the comparison separately within each value that variable takes — reverses the sign of the association between the first two, and does so regardless of which value is taken [2](#source-pearl-2014){: .source-ref}. The arithmetic behind it is elementary. The decision it forces is not.

## Four counts and the rates they generate

| Group | Treatment A | Treatment B |
|---|---|---|
| Easy | 19 / 20 (95.0%) | 180 / 200 (90.0%) |
| Hard | 50 / 200 (25.0%) | 4 / 20 (20.0%) |
| **Pooled** | **69 / 220 (31.4%)** | **184 / 220 (83.6%)** |

Both arms treated 220 patients, so the pooled denominators match. What does not match is where those patients came from: A treated 20 easy cases and 200 hard ones, and B did the reverse. A pooled rate is the weighted average of the two subgroup rates using each arm's *own* mix as the weights, and the two arms bring different weights to the average:

$$\text{pooled}_A = 0.95\times\frac{20}{220} + 0.25\times\frac{200}{220} = 0.0864 + 0.2273 = 0.3136.$$

The corresponding sum for B is $0.90 \times \frac{200}{220} + 0.20 \times \frac{20}{220} = 0.8182 + 0.0182 = 0.8364$. Nothing in either calculation compares like with like.

## Why the composition wins so easily

The gap between treatments is 5 percentage points among easy cases and 5 among hard ones. The gap between groups is 70 points for A (95% against 25%) and 70 for B. When a variable that swings the outcome by 70 points is distributed unevenly between the arms, it does not need much unevenness to overwhelm a 5-point effect.

Standardising makes that concrete. Apply one shared severity mix to both arms instead of each arm's own — the pooled study population happens to be exactly half easy and half hard, since 20 + 200 patients are easy and 200 + 20 are hard — and the arms are compared at $(0.95 + 0.25)/2 = 60\%$ against $(0.90 + 0.20)/2 = 55\%$. A wins by the 5 points the subgroups showed all along.

## How little imbalance it takes

Let $s$ run from 0 to 1 and split each arm's 220 patients as $110 - 90s$ easy and $110 + 90s$ hard for A, and the mirror image for B. At $s = 0$ both arms see an identical 110/110 mix; at $s = 1$ the split is the 20/200 of the table above. The within-group recovery rates never move.

<details class="reveal">
  <summary>Solving for the skew at which the arms swap places<span class="reveal-tag">6 lines</span></summary>
  <div class="reveal-body" markdown="1">
Each pooled rate is a weighted average of fixed subgroup rates with sizes that depend on $s$:

$$\begin{aligned}
\text{pooled}_A(s) &= \frac{0.95(110 - 90s) + 0.25(110 + 90s)}{220} = \frac{132 - 63s}{220} \\[4pt]
\text{pooled}_B(s) &= \frac{0.90(110 + 90s) + 0.20(110 - 90s)}{220} = \frac{121 + 63s}{220}
\end{aligned}$$

Both are straight lines in $s$, moving in opposite directions at the same rate. Setting them equal gives $132 - 63s = 121 + 63s$, so $s = 11/126 \approx 0.087$, where both arms read 57.5%.

At that point each arm holds 102.1 easy and 117.9 hard patients: about 7.9 patients out of 110 have moved, and the easy share of each arm has slipped from 50% to 46.4%. The model lets group sizes take fractional values so the lines are continuous; a real trial would land on whole patients either side.
  </div>
</details>

At $s = 0$ the two arms read 60.0% and 55.0%, with A correctly ahead. The crossing happens before a tenth of the way along the slider, and everything to the right of it is a pooled table that says B is better.

<div class="widget" data-widget="simpson-crossover">
  <div class="widget-head">
    <span class="widget-title">Overall recovery rate · confounding skew</span>
    <span class="widget-readout" data-readout>s = 0.000   A = 60.0%   B = 55.0%</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Overall recovery rates for treatment A and B crossing over as allocation skew increases"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="simpson-skew">s</label>
      <input type="range" id="simpson-skew" min="0" max="1000" step="1" value="0">
    </div>
  </div>
  <p class="widget-caption">Horizontal axis: the allocation skew s, from 0 (both arms see the same 110/110 severity mix) to 1 (the 20/200 split of the table above). Vertical axis: pooled recovery rate, 0% to 100%. The two lines are the pooled rates for A and B; the dashed vertical line marks where they cross, at s = 11/126. The subgroup rates behind both lines are fixed at 95%/90% and 25%/20% throughout, so every movement on the chart comes from allocation alone.</p>
  <p class="widget-noscript">This figure needs JavaScript. The two straight-line formulas above generate the same chart, and the table gives their endpoints at s = 1.</p>
</div>

## Which table answers the question

Reversal is a fact about the numbers. Whether to act on the subgroup rates or the pooled ones is a question about how the data were generated, and the numbers cannot settle it. Pearl records that Simpson himself observed as much: depending on the story behind the data, the more sensible reading sometimes belongs to the aggregate table and sometimes to the subgroups [2](#source-pearl-2014){: .source-ref}. Pearl's back-door criterion turns that observation into a condition for a single covariate: it may be conditioned on when it is not a descendant of the treatment and it blocks every path that ends with an arrow into the treatment [2](#source-pearl-2014){: .source-ref}. Severity as described here — present before treatment was chosen, influencing both the choice and the recovery — satisfies that, which is why the subgroup tables are the ones to trust in this example.

The same criterion refuses in other structures. Pearl works through cases where the aggregated table is the correct one, including a variable that is a common consequence of treatment and outcome, where conditioning opens a spurious path that was closed while the variable was left alone [2](#source-pearl-2014){: .source-ref}. That case has its own name and its own structure: Hernán and Robins classify bias from conditioning on a common effect of treatment and outcome as selection bias, and treat it as structurally distinct from confounding, which comes from a common cause [3](#source-hernan-robins-whatif){: .source-ref}.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Adjusting for everything is not the safe default</span>
Conditioning on a collider — a variable that both the treatment and the outcome influence — creates an association between them that was not there before, the effect Pearl illustrates with Berkson's observation that a common consequence of two independent causes renders those causes dependent [2](#source-pearl-2014){: .source-ref}. Adding it to a model does not shrink bias towards zero; it manufactures bias in a comparison that may have been unbiased. Being in the dataset is not evidence that a variable belongs in the adjustment set, and Pearl records Lindley and Novick's demonstration that no statistical criterion warns an investigator away from the wrong conclusion here — the sorting is done by the assumed causal structure, not by the counts [2](#source-pearl-2014){: .source-ref}.
</div>

<div class="callout callout-key" markdown="1">
<span class="callout-label">Why the reversal feels impossible</span>
The intuition that a treatment cannot be better for everyone and worse overall is defensible, and Pearl states it as a sure-thing theorem: an action that raises the probability of an outcome in every subpopulation raises it in the population as a whole, provided the action does not change the distribution of those subpopulations [2](#source-pearl-2014){: .source-ref}. The proviso is where the table above escapes. Its patients were not assigned by an action that left the severity mix alone — allocation and severity moved together, so the pooled comparison is not the comparison the intuition is about.
</div>

<details class="reveal reveal-recall">
  <summary>Both arms treated 220 patients. Why doesn't that make the pooled comparison fair?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because equal totals are not equal composition. A's 220 were 20 easy and 200 hard; B's were 200 easy and 20 hard. Each pooled rate averages the subgroup rates using its own arm's mix, so the two averages are taken over different populations — and severity moves recovery by 70 points, against a treatment effect of 5.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A colleague proposes adjusting for every variable in the dataset "to be safe". What is wrong with that?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Some variables are colliders — common effects of treatment and outcome — and conditioning on one opens a path that was blocked, introducing an association that is not causal. That is selection bias: structurally a common effect conditioned on, where confounding is a common cause left unadjusted, so an adjustment can create it rather than remove it. Which variables are safe depends on the assumed causal structure.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Given the raw counts, how would you produce a comparison that is not driven by allocation?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Compare within each severity stratum, or standardise: apply one shared severity distribution to both arms as weights. Using the study's own half-easy, half-hard population gives 60% for A against 55% for B, restoring the 5-point advantage that both subgroups showed.
  </div>
</details>
