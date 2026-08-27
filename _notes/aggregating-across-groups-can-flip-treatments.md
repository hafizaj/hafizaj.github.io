---
title: "Can a treatment win in every subgroup and still lose overall?"
topic: "Confounding"
module: "Causal Modelling"
date: 2026-08-26
reading_time: 10
summary: "A treatment can win in every subgroup and still lose overall. The reversal has nothing to do with the treatment — it comes from a variable that affects both who gets which treatment and how likely they are to recover."
prerequisites: "Conditional probability, and what it means for two variables to be independent."
sources:
  - "Simpson, E. H. (1951), 'The Interpretation of Interaction in Contingency Tables', <em>Journal of the Royal Statistical Society</em> — the original paper."
  - "Pearl, J., <em>Causality</em>, 2nd ed. — the formal treatment via causal graphs and the backdoor criterion."
---

Treatment A beats Treatment B among easy cases, 95% to 90%. Treatment A beats Treatment B among hard cases too, 25% to 20%. Pool the two groups together, and Treatment B comes out ahead overall, 83.6% to 31.4% — more than twice as effective. Nobody's data is wrong, nobody made an arithmetic mistake, and neither treatment changed between the subgroup analysis and the aggregate one. This is Simpson's paradox, and once you see the mechanism it stops being a paradox at all — it becomes a warning about a specific, nameable failure: comparing two groups without asking what decided who ended up in each one.

## The setup

Split patients into two severity groups, easy and hard. Within each group, record how many patients got each treatment and how many recovered. The **overall** recovery rate for a treatment is a weighted average of its two subgroup rates, where the weights are how many patients in that treatment happened to be easy versus hard.

<div class="callout callout-key" markdown="1">
<span class="callout-label">What makes the overall rate a fair comparison</span>
The overall rate is only a fair comparison if the treatments were given to **similarly composed** groups of patients. If one treatment was disproportionately given to the harder cases, its overall rate is dragged down by that composition — not by anything wrong with the treatment.
</div>

## The 220-patient reversal

Suppose Treatment A is genuinely better in both groups — by 5 to 6 percentage points, not a huge gap:

| Group | Treatment A | Treatment B |
|---|---|---|
| Easy | 19 / 20 (95%) | 180 / 200 (90%) |
| Hard | 50 / 200 (25%) | 4 / 20 (20%) |
| **Overall** | **69 / 220 (31.4%)** | **184 / 220 (83.6%)** |

A wins both subgroup comparisons cleanly. Overall, B looks more than twice as effective. The reason is visible in the raw counts: A was given to 200 hard patients and only 20 easy ones — the opposite of B, which was given to 200 easy patients and only 20 hard ones. Severity, not treatment, is doing almost all the work in the aggregate number, because A's patients were mostly drawn from the group where *everyone* recovers less often, regardless of treatment.

<div class="widget" data-widget="simpson-crossover">
  <div class="widget-head">
    <span class="widget-title">Overall recovery rate · confounding skew</span>
    <span class="widget-readout" data-readout>s = 0.00</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Overall recovery rates for treatment A and B crossing over as allocation skew increases"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="simpson-skew">s</label>
      <input type="range" id="simpson-skew" min="0" max="1000" step="1" value="0">
    </div>
  </div>
  <p class="widget-caption">s = 0 is balanced allocation: both treatments see the same mix of easy and hard cases, and A's real advantage shows through cleanly. s = 1 is the table above. The within-group rates never move — only how the two treatments are allocated across groups does.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above carries the same argument at maximum skew.</p>
</div>

## Why they cross

Fix the within-group recovery rates at the values above — A always wins each stratum by construction. Let $s \in [0,1]$ control how unevenly the 220 patients in each treatment arm are split between easy and hard, interpolating linearly from a balanced 110/110 split at $s=0$ to the fully skewed 20/200 split at $s=1$:

$$A_{\text{easy}}(s) = 110 - 90s, \qquad A_{\text{hard}}(s) = 110 + 90s$$
$$B_{\text{easy}}(s) = 110 + 90s, \qquad B_{\text{hard}}(s) = 110 - 90s$$

<details class="reveal">
  <summary>Show the derivation<span class="reveal-tag">6 lines</span></summary>
  <div class="reveal-body" markdown="1">
The overall rate is a weighted average of the fixed within-group rates, using the group sizes above as weights:

$$\begin{aligned}
\text{Overall}_A(s) &= \frac{0.95\,A_{\text{easy}}(s) + 0.25\,A_{\text{hard}}(s)}{220} = \frac{132 - 63s}{220} \\[4pt]
\text{Overall}_B(s) &= \frac{0.90\,B_{\text{easy}}(s) + 0.20\,B_{\text{hard}}(s)}{220} = \frac{121 + 63s}{220}
\end{aligned}$$

Both lines are functions of $s$ alone. Setting them equal gives the crossover point:

$$132 - 63s = 121 + 63s \;\implies\; s = \frac{11}{126} \approx 0.087.$$

At $s=0$ the two lines give 60% and 55% — A ahead, correctly reflecting that A really is better. By $s \approx 0.087$, a skew of under nine percent, they have already crossed.
  </div>
</details>

That crossover point is the whole story in one number: it takes only a **9% skew** in how the two treatments were allocated to completely overwhelm a genuine 5–6 point treatment effect, because the *between-group* gap (95%/90% for easy patients versus 25%/20% for hard ones — a roughly 70-point difference) so heavily outweighs the *within-group* gap. Any allocation process that is even mildly non-random with respect to severity — sicker patients steered toward one treatment, for whatever clinical reason — is enough to invert the comparison.

## Stratifying without introducing new bias

The fix is not "adjust for everything you have data on." It is to identify the variable that affects **both** who received which treatment and how likely they were to recover — the confounder — and compare within its strata, or reweight to a common reference distribution across it.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The opposite mistake exists too</span>
Adjusting for a variable that is a <em>consequence</em> of both the treatment and the outcome — a collider — does not remove bias, it manufactures it out of a comparison that was previously unbiased. More adjustment is not automatically safer. What matters is the causal structure connecting the variable to treatment and outcome, not whether the variable happens to be sitting in your dataset.
</div>

<details class="reveal reveal-recall">
  <summary>What made the aggregate comparison reverse, when Treatment A won in both subgroups?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Confounding: severity determined both which treatment a patient was likely to receive and how likely they were to recover regardless of treatment. Because A was disproportionately given to harder cases, its aggregate rate was dragged down by composition, not by lower efficacy.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>How would you fix the comparison, given the raw counts?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Stratify by severity and compare within each stratum, or standardise using one shared severity distribution as weights for both treatments so the comparison is no longer contaminated by how each treatment happened to be allocated.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why can't you just adjust for every variable you happen to have, to be safe?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because adjusting for a collider — a variable caused by both the treatment and the outcome, or downstream of both — introduces bias that was not present in the raw comparison. You need to know the causal structure, not just which variables are available in the data.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>In the widget, why does the crossover happen at such a small skew (s ≈ 0.09)?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the real treatment gap (5–6 percentage points within each group) is tiny next to the gap between the subgroups themselves (roughly 70 points between easy and hard patients). Even a mild reallocation of cases between groups is enough for that much larger gap to swamp the true effect in the aggregate.
  </div>
</details>
