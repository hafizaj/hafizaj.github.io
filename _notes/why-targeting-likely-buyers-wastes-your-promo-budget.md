---
title: "Targeting your likeliest buyers wastes most of your promo budget"
topic: "Uplift modelling"
module: "Retail Analytics"
date: 2026-08-26
updated: 2026-09-04
level: applied
featured: false
index_order: 20
takeaway: "Promotion targeting should rank incremental responders, not customers already likely to buy."
source_schema: 2
reading_time: 9
summary: "One word separates the customers likely to buy if they get an offer from the customers likely to buy only if they get one. A response model cannot see that word, and the quantity that can — a difference between two randomised arms — is never observable for any individual."
prerequisites: "What a randomized treatment/control test is, and basic conditional probability."
sources:
  - id: radcliffe-2007
    organisation: "Stochastic Solutions Limited"
    title: "Generating Incremental Sales: maximizing the incremental impact of cross-selling, up-selling and deep-selling through uplift modelling"
    publication: "Stochastic Solutions white paper; the only named contact on the paper is Nicholas J. Radcliffe, and the copyright line reads 2007"
    year: 2007
    url: "https://www.stochasticsolutions.com/pdf/CrossSell.pdf"
    supports: "The one-word distinction between targeting people likely to buy if they are included in a campaign and people likely to buy only if they are included; the observation that conventional response models target on the former basis and concentrate on people who would have bought anyway; the Fundamental Campaign Segmentation and all four of its cell names, Persuadables, Sure Things, Lost Causes and Sleeping Dogs, including the note that the first two of those split the earlier Immovables segment; the statement that both outcomes cannot be measured for any customer because one cannot simultaneously treat and not treat an individual; and the requirement that the only systematic difference between control and treated groups is the treatment."
  - id: radcliffe-surry-2011
    author: "Nicholas J. Radcliffe and Patrick D. Surry"
    title: "Real-World Uplift Modelling with Significance-Based Uplift Trees"
    publication: "Portrait Technical Report TR-2011-1, Stochastic Solutions white paper"
    year: 2011
    url: "https://www.stochasticsolutions.com/pdf/sig-based-up-trees.pdf"
    supports: "Uplift modelling defined as modelling the change in behaviour that results directly from a specified treatment; the description of the control group as chosen uniformly at random from the target population; the uplift critique of conventional propensity modelling, that none of the standard approaches is designed to model incremental impact and that most targeted marketing is therefore targeted on non-incremental models; and the incremental gains curve on which a campaign can generate more incremental sales by treating 80% of a population than by treating all of it, because of negative effects in the last two deciles. This paper does not use the four segment names; those come from the 2007 white paper above."
  - id: gutierrez-gerardy-2017
    author: "Pierre Gutierrez and Jean-Yves Gérardy"
    title: "Causal Inference and Uplift Modelling: A Review of the Literature"
    publication: "Proceedings of the 3rd International Conference on Predictive Applications and APIs, PMLR 67:1–13; the author PDF carries an earlier 2016 proceedings header"
    year: 2017
    url: "https://proceedings.mlr.press/v67/gutierrez17a.html"
    supports: "The Rubin potential-outcome notation used here, the individual causal effect Y(1) − Y(0), the conditional average treatment effect, and the observed-outcome identity; the statement that uplift modelling amounts to estimating a CATE; the warning that the difference of two observed conditional means does not identify it unless treatment is independent of both potential outcomes given the covariates, which they name the unconfoundedness or conditional independence assumption; and the point that uplift modelling relies on randomised assignment to make that assumption hold."
  - id: hernan-robins-whatif
    author: "Miguel A. Hernán and James M. Robins"
    title: "Causal Inference: What If, chapters 2 and 3"
    publication: "Chapman & Hall/CRC; free full-text PDF, edition dated 19 August 2026 on its title page"
    year: 2026
    url: "https://miguelhernan.org/whatifbook"
    supports: "The three identifiability conditions named as exchangeability, positivity and consistency, and the statement that in ideal randomised experiments they hold by design; the definition of a marginally randomised experiment as one using a single unconditional randomisation probability common to all individuals, and the exchangeability it produces, written as the potential outcome being independent of the treatment actually received."
---

There is one word between a campaign that pays and a campaign that does not. A brief asking for the customers likely to buy *if* they receive an offer and a brief asking for the customers likely to buy *only if* they receive one share almost all of their words and almost none of their answer [1](#source-radcliffe-2007){: .source-ref}. A response model is trained on the first. Nothing in it can separate the two, and the gap between them is where the promotional budget goes.

## Two outcomes per customer, one of them unobservable

Write $Y_i(1)$ for what customer $i$ would do if treated and $Y_i(0)$ for what the same customer would do if not. The causal effect on that customer is the difference [3](#source-gutierrez-gerardy-2017){: .source-ref}:

$$\tau_i = Y_i(1) - Y_i(0).$$

Let $W_i \in \lbrace 0,1 \rbrace$ record which arm the customer was actually assigned to. What the data contains is

$$Y_i^{\text{obs}} = W_i\,Y_i(1) + (1-W_i)\,Y_i(0),$$

which is one of the two terms in $\tau_i$ and never both. Radcliffe's version of the same point is operational rather than notational: both outcomes cannot be measured for any customer, because one cannot simultaneously treat and not treat an individual [1](#source-radcliffe-2007){: .source-ref}. So the individual effect is not a quantity that is hard to estimate — it is not observed at all, for anybody, ever.

What can be estimated is a group average. For a subgroup defined by covariates $X_i$, the conditional average treatment effect is

$$\tau(X_i) = \mathbb{E}\!\left[Y_i(1) \mid X_i\right] - \mathbb{E}\!\left[Y_i(0) \mid X_i\right],$$

and uplift modelling amounts to estimating exactly this [3](#source-gutierrez-gerardy-2017){: .source-ref}.

<div class="callout callout-key" markdown="1">
<span class="callout-label">The difference of two observed averages is not automatically the effect</span>
Gutierrez and Gérardy single out as a popular but wrong belief that $\tau(X)$ can always be recovered by subtracting the observed mean outcome among the untreated from the observed mean among the treated at the same $X$. That subtraction identifies the CATE only if assignment $W$ is independent of *both* potential outcomes given $X$ — the unconfoundedness, or conditional independence, assumption [3](#source-gutierrez-gerardy-2017){: .source-ref}. It is not a property of the arithmetic; it is a property of how the two groups came to exist. Randomised assignment is what makes it hold, which is why the design comes before the model rather than after it.
</div>

## The four cells a campaign sorts people into

Because each customer either would or would not buy under treatment, and either would or would not buy without it, everyone occupies one cell of a two-by-two — Radcliffe's Fundamental Campaign Segmentation [1](#source-radcliffe-2007){: .source-ref}:

| | Buys if **not** treated | Does not buy if not treated |
|---|---|---|
| **Buys if treated** | Sure Things — the spend is wasted | Persuadables — the only cell the campaign creates |
| **Does not buy if treated** | Sleeping Dogs — the spend destroys a sale | Lost Causes — the spend is wasted |

The first and last cells were originally one segment, the Immovables, and splitting them changes nothing about what to do: money spent on either has no effect on sales, while money spent on Sleeping Dogs is worse than doing nothing [1](#source-radcliffe-2007){: .source-ref}. Only the top right responds to being asked.

No customer arrives labelled. The cells are defined by two outcomes and only one is ever seen, so membership has to be predicted, and that is a different modelling target from the one propensity models optimise. Radcliffe and Surry put the consequence bluntly: none of the standard propensity approaches is designed to model incremental impact, so most targeted marketing today is targeted on non-incremental models even when it is measured on incremental ones [2](#source-radcliffe-surry-2011){: .source-ref}.

## Four illustrative segments and their incremental counts

The numbers below are constructed to make the arithmetic visible, not drawn from a published campaign. Each row gives a segment size, a control purchase rate and a treated purchase rate; the last column is the segment size multiplied by the difference, which is the extra purchases you would buy by treating the whole segment.

| Segment | Size | Control rate | Treated rate | Uplift | Incremental purchases |
|---|---|---|---|---|---|
| Sure Things | 300 | 80% | 82% | +2pp | **6** |
| Lost Causes | 300 | 5% | 6% | +1pp | **3** |
| Persuadables | 300 | 10% | 45% | +35pp | **105** |
| Sleeping Dogs | 100 | 60% | 40% | −20pp | **−20** |

<div class="widget" data-widget="uplift-segments">
  <div class="widget-head">
    <span class="widget-title">Purchase rate · segment</span>
    <span class="widget-readout" data-readout>Sure things: uplift +2pp   incremental purchases = 6.0 (of 300 customers)</span>
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
  <p class="widget-caption">Four buttons, one per row of the table. The light bar is the control purchase rate and the dark bar the treated rate, both as percentages on a vertical axis with gridlines at 0, 25, 50, 75 and 100%; the treated bar switches colour when it falls below the control bar, which happens only for Sleeping Dogs. The readout reports the gap in percentage points and the gap multiplied by the segment size. Purchase rates are unitless shares; incremental purchases are counts of customers.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above carries the same four segments and the same six columns.</p>
</div>

Sure Things buy 246 times out of 300 when treated and 240 times out of 300 when not, so the campaign adds six purchases to a base of 240 and pays for all 246. Persuadables buy 135 times against 30, so the campaign adds 105 to a base of 30. Same segment size, same spend, seventeen and a half times the effect.

## The two rankings the same table produces

Sort the four segments by treated purchase rate — the number a response model is trained to predict — and then by uplift:

| By treated purchase rate | By uplift |
|---|---|
| Sure Things, 82% | Persuadables, +35pp |
| Persuadables, 45% | Sure Things, +2pp |
| Sleeping Dogs, 40% | Lost Causes, +1pp |
| Lost Causes, 6% | Sleeping Dogs, −20pp |

The two orderings disagree at every position. At the top, a budget that reaches one segment buys 6 incremental purchases under the first and 105 under the second — a factor of 17.5 decided entirely by which column was sorted on. At the bottom, the response ranking's last place goes to Lost Causes, whose uplift is positive, while Sleeping Dogs, the only segment that removes purchases, sits one place higher.

<details class="reveal">
  <summary>What the same table says about budgets that reach more than one segment<span class="reveal-tag">5 lines</span></summary>
  <div class="reveal-body" markdown="1">
Treating all four segments — all 1,000 customers — produces $6 + 3 + 105 - 20 = 94$ incremental purchases. Following the response ranking down to three segments (Sure Things, Persuadables, Sleeping Dogs) produces $6 + 105 - 20 = 91$; following the uplift ranking down to three (Persuadables, Sure Things, Lost Causes) produces $114$.

So the best three-segment plan beats treating everyone, and the worst three-segment plan is beaten by it. That is the shape Radcliffe and Surry report from real campaigns, where an incremental gains curve can peak short of the full population and treating the last two deciles reduces the total [2](#source-radcliffe-surry-2011){: .source-ref}. Notice also that Persuadables alone, at 105, beat every plan that includes Sleeping Dogs.
  </div>
</details>

## What a difference of two rates does not settle

Randomisation is what licenses reading the control arm as the treated arm's counterfactual. Hernán and Robins list three identifiability conditions — exchangeability, positivity and consistency — and note that in an ideal randomised experiment they hold by design rather than by assumption; a marginally randomised experiment, one that assigns treatment with a single probability common to everyone, is what delivers the exchangeability [4](#source-hernan-robins-whatif){: .source-ref}. Radcliffe's operational version of the same requirement is that the only systematic difference between the control group and the treated group is the treatment [1](#source-radcliffe-2007){: .source-ref}. A holdout that quietly excludes the highest-value customers satisfies none of this, and no amount of modelling afterwards repairs it.

Three more things the table cannot tell you:

- **Whether the small gaps are real.** If each rate came from a treated arm and a control arm the size of its segment — 300 each, or 100 each for Sleeping Dogs — the standard error on a difference of two proportions is 3.20 percentage points for Sure Things, 1.86 for Lost Causes, 3.35 for Persuadables and 6.93 for Sleeping Dogs. The four uplifts then sit at 0.62, 0.54, 10.43 and −2.89 standard errors from zero. Two of the four rows are indistinguishable from no effect at that sample size, which is a stronger statement than "small".
- **Whether the effect is worth its cost.** Every figure here is a count of purchases, not money. A campaign yielding 105 incremental purchases is a loss if the contribution per purchase is below the cost of treating 300 customers, and the ranking by incremental purchases is not the ranking by profit unless treatment cost is flat across segments.
- **Who is in which segment next time.** The four cells are properties of a customer under one specific offer at one specific moment. A model that identifies Persuadables for a 20% discount in November has not identified them for a different offer, and the segmentation has to be re-estimated when the treatment changes.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Negative uplift is a measurement, not a story</span>
The mechanism usually offered for Sleeping Dogs — that contact irritates people into unsubscribing or defecting — is plausible and is not established by any number on this page. What the arithmetic establishes is narrower: for some subgroups the treated purchase rate comes in below the control rate, and Radcliffe reports that such negative effects are real and more frequent than expected across a range of campaigns [1](#source-radcliffe-2007){: .source-ref}. Why they occur is a separate question, answered by a different experiment. Treating the sign as evidence of a mechanism is the same error as treating a high response score as evidence of persuasion.
</div>

<details class="reveal reveal-recall">
  <summary>A customer scores 0.82 on a response model. What extra number do you need before you know whether to target them?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The rate at which comparable customers buy when they are *not* treated. 0.82 is an estimate of $\mathbb{E}[Y(1) \mid X]$ alone, and the quantity that decides the spend is the difference from $\mathbb{E}[Y(0) \mid X]$. With a control rate of 0.80 the offer is buying two points; with a control rate of 0.10 it is buying seventy-two. The score is identical in both cases.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why can't an uplift model be fitted to the same historical data a churn or response model uses?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the target variable does not exist in it. Response models predict an outcome that is recorded for every customer; uplift is a difference between two outcomes, of which only one is ever recorded per customer. Recovering it requires a randomised holdout so that the untreated group can stand in for the treated group's unobserved arm — the unconfoundedness condition — and historical data collected without one gives no comparison group with that property.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A response ranking places Sleeping Dogs third of four, above Lost Causes. Why is that ordering worse than it looks?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the two segments are not both merely unprofitable. Lost Causes waste the cost of treatment and leave sales unchanged; Sleeping Dogs waste the cost *and* remove 20 purchases that would have happened with no campaign at all. A ranking built on treated purchase rate cannot separate them, because it never looks at the control arm — and 40% is a perfectly respectable-looking treated rate.
  </div>
</details>
