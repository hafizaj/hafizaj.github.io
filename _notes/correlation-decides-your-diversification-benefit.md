---
title: "Does adding more assets actually diversify a portfolio?"
topic: "Portfolio theory"
module: "Financial Analytics"
date: 2026-08-26
reading_time: 9
summary: "Adding more assets to a portfolio doesn't automatically reduce risk. What buys you a lower-risk frontier is how those assets move relative to each other — and at the extreme, correlation alone can eliminate risk entirely."
prerequisites: "Expected value and variance of a weighted sum of two random variables."
sources:
  - "Markowitz, H. (1952), 'Portfolio Selection', <em>The Journal of Finance</em> — the original mean-variance framework."
  - "Bodie, Z., Kane, A. & Marcus, A., <em>Investments</em> — the standard treatment used across CFA-level courses."
---

Add a second, riskier asset to a portfolio and ask what happens to total risk. Not the return — that's just the weighted average, no surprise there — but the risk. Pair an asset returning 8% with 10% volatility against one returning 14% with 20% volatility, and even when the two move in ways that share nothing in common ($\rho = 0$), the resulting portfolio can end up safer than either asset held alone. "Diversification" is usually taught as "hold more things," which is true often enough to be dangerous. **The real lever is correlation, not count** — two assets are already enough to see the whole mechanism.

## The setup

For a portfolio with weight $w$ in Asset 1 and $(1-w)$ in Asset 2:

$$\mu_p = w\mu_1 + (1-w)\mu_2, \qquad \sigma_p^2 = w^2\sigma_1^2 + (1-w)^2\sigma_2^2 + 2w(1-w)\rho\sigma_1\sigma_2$$

<div class="callout callout-key" markdown="1">
<span class="callout-label">Return ignores correlation; risk doesn't</span>
Expected return is <strong>always</strong> the weighted average — it does not know or care what $\rho$ is. Every ounce of the diversification story lives in the variance formula, entirely through the correlation term.
</div>

## A higher-return, higher-volatility pair

Asset 1: $\mu_1 = 8\%$, $\sigma_1 = 10\%$. Asset 2: $\mu_2 = 14\%$, $\sigma_2 = 20\%$ — higher return, twice the risk.

<details class="reveal">
  <summary>Show the two boundary cases<span class="reveal-tag">algebra</span></summary>
  <div class="reveal-body" markdown="1">
At $\rho = 1$, the variance expression is a perfect square:

$$w^2\sigma_1^2 + (1-w)^2\sigma_2^2 + 2w(1-w)\sigma_1\sigma_2 = \big(w\sigma_1 + (1-w)\sigma_2\big)^2$$

so $\sigma_p$ is exactly the linear interpolation between $\sigma_1$ and $\sigma_2$ — no bowing, no benefit. The lowest achievable risk within $w \in [0,1]$ is just $\sigma_1$ itself, at $w=1$.

At $\rho = -1$, it is a perfect square with the opposite sign:

$$\big(w\sigma_1 - (1-w)\sigma_2\big)^2$$

which hits **exactly zero** when $w\sigma_1 = (1-w)\sigma_2$, i.e. $w^\* = \dfrac{\sigma_2}{\sigma_1+\sigma_2} = \dfrac{20}{30} = \tfrac{2}{3}$. At that weight, $\mu_p = \tfrac{2}{3}(8\%) + \tfrac{1}{3}(14\%) = 10\%$ with **zero risk** — a perfect hedge.
  </div>
</details>

<div class="widget" data-widget="efficient-frontier">
  <div class="widget-head">
    <span class="widget-title">Risk–return frontier · correlation ρ</span>
    <span class="widget-readout" data-readout>ρ = 0.00</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Two-asset risk-return frontier bowing left as correlation decreases toward negative one"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="frontier-rho">ρ</label>
      <input type="range" id="frontier-rho" min="-1000" max="1000" step="1" value="0">
    </div>
  </div>
  <p class="widget-caption">The two asset points never move — only the curve connecting them bows, from a straight line at ρ = 1 toward a spike that touches zero risk as ρ → −1. The marked point is the minimum-risk portfolio achievable at the current ρ.</p>
  <p class="widget-noscript">This figure needs JavaScript. The two boundary cases above carry the same argument.</p>
</div>

## The surprising middle case

Even at $\rho = 0$ — the two assets moving completely independently, no hedge relationship at all — the minimum-variance weight is $w^\* = \sigma_2^2/(\sigma_1^2+\sigma_2^2) = 400/500 = 0.8$, giving a portfolio risk of $\sqrt{80\%^2} \approx 8.94\%$. That is **below** Asset 1's own risk of 10%, even though Asset 1 is already the lower-risk asset on its own. Mixing in some of the riskier, merely-uncorrelated Asset 2 reduces total risk below either asset held alone — the part of diversification that actually surprises people the first time they see it.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Counting assets isn't diversification</span>
"More assets" is not the mechanism — low or negative correlation is. Twenty stocks in the same sector, all moving together with $\rho \approx 0.8$, buy far less risk reduction than five holdings spread across genuinely uncorrelated asset classes. Counting names in a portfolio tells you nothing about how diversified it actually is.
</div>

<details class="reveal reveal-recall">
  <summary>Does a two-asset portfolio's expected return depend on the correlation between the assets?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
No — it is always the weighted average of the two individual expected returns, regardless of ρ. Only the variance depends on correlation.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>At ρ = −1 with σ₁ = 10%, σ₂ = 20%, what weight in Asset 1 gives exactly zero portfolio risk, and why?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
w* = σ₂/(σ₁+σ₂) = 2/3. At ρ = −1, portfolio variance is the perfect square (wσ₁ − (1−w)σ₂)², which is zero exactly when the two volatility contributions cancel.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>At ρ = 1, why can mixing the two assets never reduce risk below the lower-volatility asset alone?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because at ρ = 1, portfolio volatility is exactly the weighted average of the two individual volatilities — also a perfect square, this time with a plus sign — so within long-only weights it's minimised at the boundary: 100% in whichever asset already has the lower volatility.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why is "hold more assets" incomplete diversification advice?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the risk reduction comes specifically from low or negative correlation between holdings, not from the count of holdings. Many highly correlated assets can diversify less than a handful of assets that move independently or in opposite directions.
  </div>
</details>
