---
title: "Does adding more assets actually diversify a portfolio?"
topic: "Portfolio theory"
module: "Financial Analytics"
date: 2026-08-26
updated: 2026-09-04
level: applied
featured: false
index_order: 12
source_schema: 2
takeaway: "Diversification depends on covariance between assets, not on the number of assets alone."
reading_time: 9
summary: "Two assets are enough to show what diversification actually runs on. Hold the weights still and move only the correlation between them, and the risk of the combined holding moves by a factor of three while the expected return does not move at all."
prerequisites: "Expected value and variance of a weighted sum of two random variables."
sources:
  - id: markowitz-1952
    author: "Harry M. Markowitz"
    title: "Portfolio Selection"
    publication: "The Journal of Finance 7(1), 77–91; publisher copy is subscription-gated"
    year: 1952
    url: "https://doi.org/10.2307/2975974"
    supports: "The mean–variance framework used throughout this note: a holding judged by the expected return and the variance of return of the portfolio as a whole rather than security by security."
  - id: markowitz-1990
    author: "Harry M. Markowitz"
    title: "Foundations of Portfolio Theory (Nobel Prize lecture, 7 December 1990)"
    publication: "Nobel Foundation; free full text"
    year: 1990
    url: "https://www.nobelprize.org/uploads/2018/06/markowitz-lecture.pdf"
    supports: "Markowitz’s own account of the theory: that an investor acting on expected return alone would hold only the single security with the highest expected return, that the variance of the portfolio — the variance of a weighted sum — involves all covariance terms, and that the set of Pareto-optimal expected-return/variance combinations is now known as the efficient frontier."
---

Asset 1 has an expected return of 8% a year and a standard deviation of return of 10%. Asset 2 has an expected return of 14% and a standard deviation of 20%: more reward, twice the spread. Put four-fifths of the money in the safer asset and one-fifth in the riskier one, assume the two returns are uncorrelated, and the standard deviation of the combined holding is 8.94% a year. That is below the safer asset's own 10%, and it was bought by adding the riskier asset, not by avoiding it.

Nothing in that arithmetic counts holdings. It uses one quantity that a list of ticker symbols never shows you.

## Two formulas, one of which notices correlation

Write $\mu_1, \mu_2$ for the two expected returns, $\sigma_1, \sigma_2$ for the two standard deviations of return, and $\rho$ for the correlation coefficient between the returns, a number between $-1$ and $1$. Put weight $w$ in Asset 1 and $1-w$ in Asset 2, with no borrowing and no short selling, so $0 \le w \le 1$. Then

$$\mu_p = w\mu_1 + (1-w)\mu_2, \qquad \sigma_p^2 = w^2\sigma_1^2 + (1-w)^2\sigma_2^2 + 2w(1-w)\rho\sigma_1\sigma_2.$$

Expected return is the weighted average of the two expected returns and contains no $\rho$ at all. Variance contains a third term that exists only because the two returns move together, and $\rho$ sits inside it. Judging a holding by these two numbers together, rather than judging each security on its own, is the mean–variance framework Markowitz set out in 1952 [1](#source-markowitz-1952){: .source-ref}; in his Nobel lecture he notes that an investor who cared only about expected value would rationally hold one security, the one with the highest expected return, and that the plausibility of using variance came partly from the fact that the variance of a weighted sum involves all the covariance terms [2](#source-markowitz-1990){: .source-ref}.

<div class="callout callout-note" markdown="1">
<span class="callout-label">Correlation and covariance are the same fact, scaled differently</span>
The covariance between the two returns is $\operatorname{Cov} = \rho\sigma_1\sigma_2$, so the cross term above is just $2w(1-w)\operatorname{Cov}$. Correlation is the version rescaled to sit between −1 and 1, which makes it easier to read; covariance is the version that enters the variance arithmetic directly. Either way, this is the only place in the two formulas where the relationship between the assets appears — and there is no term anywhere for how many assets you hold.
</div>

## Five correlations, one pair of assets

Below, the pair is fixed at $\mu_1 = 8\%$, $\sigma_1 = 10\%$, $\mu_2 = 14\%$, $\sigma_2 = 20\%$. Only $\rho$ moves. The middle columns give the long-only weight that minimises variance and what that portfolio delivers; the last column holds the weights still at 50/50, where the expected return is 11% for every row.

| ρ | Weight in Asset 1 at minimum risk | Risk there (σ) | Expected return there | Risk of a fixed 50/50 split |
|---|---|---|---|---|
| −1 | 0.67 | 0.00% | 10.00% | 5.00% |
| −0.5 | 0.71 | 6.55% | 9.71% | 8.66% |
| 0 | 0.80 | 8.94% | 9.20% | 11.18% |
| 0.5 | 1.00 | 10.00% | 8.00% | 13.23% |
| 1 | 1.00 | 10.00% | 8.00% | 15.00% |

Read the last column first, because it is the cleanest statement of the mechanism: the same two assets in the same proportions, promising the same 11% expected return, carry three times the risk at $\rho = 1$ that they carry at $\rho = -1$. No holding was added or removed between those rows.

The figure below draws every long-only mix of this pair as a single curve. Its upper arm — the mixes that no other mix beats on expected return and variance at the same time — is the set of Pareto-optimal combinations that Markowitz's Nobel lecture records as having become known as the efficient frontier [2](#source-markowitz-1990){: .source-ref}. The marked point sits at the bottom of that arm, on the least risky mix available at the current $\rho$.

<div class="widget" data-widget="efficient-frontier">
  <div class="widget-head">
    <span class="widget-title">Risk–return frontier · correlation ρ</span>
    <span class="widget-readout" data-readout>ρ = 0.00   min risk = 8.94%   at w = 0.80</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Two-asset risk-return frontier bowing left as correlation decreases toward negative one"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="frontier-rho">ρ</label>
      <input type="range" id="frontier-rho" min="-1000" max="1000" step="1" value="0">
    </div>
  </div>
  <p class="widget-caption">Horizontal axis: risk σ, in percentage points of annual standard deviation, from 0 to 22. Vertical axis: expected return, 7% to 15%. The two labelled dots are the assets held alone and never move, because a single asset's own risk and return do not depend on ρ. The curve is every long-only mix of the two; the orange dot is the lowest-risk mix available at the current ρ. The slider opens at ρ = 0, the row of the table above with a minimum risk of 8.94% at a weight of 0.80.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above gives the same relationship at five fixed correlations.</p>
</div>

## The correlation at which mixing stops helping

At $\rho = 0.5$ and above, the table's answer is 100% in Asset 1: the safer asset alone, no mixing. That is not a rounding artefact of these particular numbers, and the threshold has a compact form.

<details class="reveal">
  <summary>Why the threshold is exactly σ₁/σ₂<span class="reveal-tag">3 lines</span></summary>
  <div class="reveal-body" markdown="1">
Differentiate the variance with respect to $w$ and evaluate at $w = 1$, the all-in-Asset-1 corner:

$$\frac{d\sigma_p^2}{dw}\bigg|_{w=1} = 2\sigma_1^2 - 2\rho\sigma_1\sigma_2 = 2\sigma_1(\sigma_1 - \rho\sigma_2).$$

Shifting a little weight away from Asset 1 lowers variance exactly when that derivative is positive, which happens when $\rho < \sigma_1/\sigma_2$. Here $\sigma_1/\sigma_2 = 10/20 = 0.5$. Below that, some of the riskier asset makes the whole holding safer; at or above it, the safer asset alone is the least risky long-only portfolio, whatever the mix.
  </div>
</details>

The two extremes are worth naming because they bracket everything else. At $\rho = 1$ the variance collapses to the perfect square $\big(w\sigma_1 + (1-w)\sigma_2\big)^2$, so portfolio risk is the straight-line average of the two risks and the best a long-only investor can do is 10%, Asset 1 alone. At $\rho = -1$ it collapses to $\big(w\sigma_1 - (1-w)\sigma_2\big)^2$, which is zero when $w\sigma_1 = (1-w)\sigma_2$, that is at $w = \sigma_2/(\sigma_1+\sigma_2) = 2/3$. That portfolio has a standard deviation of zero and an expected return of $\tfrac{2}{3}(8\%) + \tfrac{1}{3}(14\%) = 10\%$ — a perfect hedge, and the boundary of the model rather than a claim that any particular pair of assets sits on it.

## What a hundredth holding cannot remove

Counting is not useless, it is just bounded. Take $n$ assets in equal weights, each with standard deviation $\sigma$, and let $\bar\rho$ be the common correlation between any pair. There are $n$ variance terms and $n(n-1)$ covariance terms, each $\bar\rho\sigma^2$, so

$$\sigma_p^2 = \frac{1}{n^2}\Big(n\sigma^2 + n(n-1)\bar\rho\sigma^2\Big) = \sigma^2\left(\frac{1}{n} + \left(1 - \frac{1}{n}\right)\bar\rho\right).$$

The first term is the part that counting removes; it falls like $1/n$. The second term does not depend on $n$ at all beyond a mild correction, and as $n$ grows the whole expression approaches $\bar\rho\sigma^2$. With $\sigma = 10\%$ at each holding:

| Number of holdings | Risk at ρ̄ = 0 | Risk at ρ̄ = 0.3 |
|---|---|---|
| 5 | 4.47% | 6.63% |
| 20 | 2.24% | 5.79% |
| 100 | 1.00% | 5.54% |
| Limit as n → ∞ | 0.00% | 5.48% |

Twenty holdings that share a correlation of 0.3 are already within about 0.3 percentage points of the floor that no further holding can breach. Going from 20 names to 100 buys 0.25 points of risk; going from a correlation of 0.3 to 0 buys 3.55 points at 20 names. That is the sense in which the count is the smaller lever.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">What these numbers assume, and what a wrong ρ costs</span>
Every figure here treats $\sigma_1$, $\sigma_2$ and $\rho$ as known constants over a single holding period. They are not observed; they are estimated, and the arithmetic is unforgiving about the difference. Take the twenty-holding row above: at an assumed $\bar\rho$ of 0.3 it promises 5.79%, and if the realised correlation is 0.7 the same portfolio delivers $10\%\sqrt{0.05 + 0.95(0.7)} = 8.46\%$ — nearly half as much risk again, with no holding bought or sold. Read the tables as showing the direction and size of the correlation lever under a stated $\rho$, not as a forecast of next year's volatility.
</div>

<details class="reveal reveal-recall">
  <summary>Two assets, weights fixed at 50/50. What happens to expected return and to risk when ρ moves from −1 to 1?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Expected return does not change at all — it is $w\mu_1 + (1-w)\mu_2$, which contains no ρ. Risk changes a great deal: for this pair it rises from 5.00% to 15.00%, because the cross term $2w(1-w)\rho\sigma_1\sigma_2$ goes from subtracting to adding.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does a correlation of 0.5 mark the point where mixing stops reducing risk for this pair?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the threshold is σ₁/σ₂, and 10%/20% = 0.5. Below it, moving weight off the safer asset lowers portfolio variance; at or above it, the derivative of variance at the all-in-Asset-1 corner is no longer positive, so the least risky long-only portfolio is the safer asset held alone.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A fund holds 100 stocks that share an average pairwise correlation of 0.3. How much risk can the 101st stock remove?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Almost none. With equal weights and σ = 10% each, portfolio risk is 5.54% at 100 holdings against a floor of 5.48% that holds however many are added. What is left is the shared covariance, and only holdings with a lower correlation to the rest — not more holdings at the same correlation — can move it.
  </div>
</details>
