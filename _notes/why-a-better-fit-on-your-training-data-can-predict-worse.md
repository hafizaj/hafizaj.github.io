---
title: "A better fit on your training data can predict worse"
topic: "Bias-variance tradeoff"
module: "Machine Learning"
date: 2026-08-26
reading_time: 9
summary: "A model that fits every wiggle in your training data almost always predicts worse on new data than one that fits it a little worse. Pushing training error toward zero doesn't buy you a better model — past a point, it buys you a model that has memorised your noise."
prerequisites: "What least-squares regression fits, and what a training/test split is."
sources:
  - "Hastie, T., Tibshirani, R., Friedman, J., <em>The Elements of Statistical Learning</em>, 2nd ed., §2.9 and §7.3 — the formal bias-variance decomposition."
  - "James, G., Witten, D., Hastie, T., Tibshirani, R., <em>An Introduction to Statistical Learning</em>, ch. 2 — the practitioner-level version of the same argument."
---

Fit a degree-2 polynomial to nine noisy points and it leaves real error on the table: a training MSE of 2.9. Push to degree 7 and that error nearly disappears, down to 1.3 — the curve threads through almost every point. On new data, though, the ranking flips: the degree-2 fit scores 2.3, the degree-7 fit 4.1. **The model with the better training fit is the one you should throw away.** "Fitting the data you have" and "fitting the relationship that generated it" are different goals, and past a certain point every extra bit of training accuracy is bought entirely from the first at the expense of the second.

## The setup

Split prediction error at a point $x$ into three pieces. If $y = f(x) + \varepsilon$ with $\mathbb{E}[\varepsilon] = 0$ and $\mathrm{Var}(\varepsilon) = \sigma^2$, and $\hat f$ is a model fitted on a random training set:

$$\mathbb{E}\big[(y - \hat f(x))^2\big] = \underbrace{\big(f(x) - \mathbb{E}[\hat f(x)]\big)^2}_{\text{bias}^2} + \underbrace{\mathrm{Var}\big[\hat f(x)\big]}_{\text{variance}} + \sigma^2$$

**Bias** is how wrong the model's average prediction is — a model too simple to represent the true relationship will be systematically off no matter how much data you give it. **Variance** is how much the fitted model would change if you retrained it on a different sample of the same underlying data — a model flexible enough to chase individual data points will swing wildly from one training set to the next. Training error only ever sees bias. Test error sees both, plus the noise floor $\sigma^2$ that no model can remove.

<div class="callout callout-key" markdown="1">
<span class="callout-label">Bias always falls; variance is the price</span>
Adding flexibility to a model always <strong>reduces bias, or leaves it unchanged</strong> — a more flexible family can always fit the training data at least as well. But added flexibility also <strong>increases variance</strong>, because the model now has more freedom to fit whatever noise happens to be in this particular sample. Training error only tracks the first effect. Test error tracks both, which is why the two curves part ways.
</div>

## The discount curve, fit at degrees 1 through 7

Suppose the true relationship between a discount percentage and conversion lift is a gentle, single-peaked curve — lift rises with the discount, then falls as heavy discounts start reading as a signal of low quality:

$$f(x) = 20 + 1.4x - 0.03x^2$$

Nine training points are sampled at $x = 0, 5, 10, \dots, 40$ with fixed, deliberately-chosen noise added (synthetic data — the true curve above is known here only because it was constructed for the example). An independent set of eight test points, at the midpoints between them, is drawn the same way. Fitting a polynomial of degree $d$ by least squares and increasing $d$ from 1 to 7 traces out exactly the story the decomposition predicts:

| Degree | Train MSE | Test MSE |
|---|---|---|
| 1 (straight line) | 23.5 | 15.3 |
| 2 (matches the true order) | **2.9** | **2.3** |
| 7 (near-interpolating) | 1.3 | 4.1 |

Train error falls every step of the way — a degree-7 polynomial has strictly more freedom than a degree-2 one, so it can always match or beat it on the nine points it was fit to. Test error does the opposite past degree 2: it bottoms out exactly at the true polynomial order, then climbs as the extra degrees start fitting noise instead of signal. The degree-2 fit recovers coefficients of roughly $19.6,\ 1.45,\ -0.03$ — close to the true $20,\ 1.4,\ -0.03$ — not because degree 2 was picked to match, but because it's the first degree with enough flexibility to represent the true curve and no more.

<div class="widget" data-widget="bias-variance-fit">
  <div class="widget-head">
    <span class="widget-title">Fitted curve · polynomial degree</span>
    <span class="widget-readout" data-readout>Degree 1 · train MSE 23.47 · test MSE 15.33 — Underfitting — high bias</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="A scatter of training and test points with a fitted polynomial curve and the true underlying curve, as polynomial degree changes from 1 to 7"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="bv-degree">Degree</label>
      <input type="range" id="bv-degree" min="1" max="7" step="1" value="1">
    </div>
  </div>
  <p class="widget-caption">The dashed grey line is the true relationship — visible here because the data is synthetic. Drag the slider up: the fitted curve first straightens out the true bend (bias falling), then starts weaving through individual points that are really just noise (variance rising).</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above carries the same argument.</p>
</div>

<details class="reveal">
  <summary>Where the bias-variance formula actually comes from<span class="reveal-tag">derivation</span></summary>
  <div class="reveal-body" markdown="1">
Write $y = f(x) + \varepsilon$ with $\mathbb{E}[\varepsilon] = 0$, $\mathrm{Var}(\varepsilon) = \sigma^2$, and $\varepsilon$ independent of the training set $D$ that $\hat f$ was fitted on. Let $\bar f(x) = \mathbb{E}_D[\hat f(x)]$ denote the average prediction over all possible training sets.

$$\mathbb{E}\big[(y-\hat f(x))^2\big] = \mathbb{E}\big[(f(x)+\varepsilon-\hat f(x))^2\big]$$

Add and subtract $\bar f(x)$ inside the square, then expand:

$$= \mathbb{E}\Big[\big((f(x)-\bar f(x)) + (\bar f(x)-\hat f(x)) + \varepsilon\big)^2\Big]$$

$f(x)-\bar f(x)$ is a constant (no randomness left once you've averaged over $D$). Expanding the square gives three squared terms and three cross terms. Every cross term vanishes: $\varepsilon$ is independent of $D$ and mean zero, so it has zero covariance with anything built from $\hat f$; and $\mathbb{E}_D[\bar f(x)-\hat f(x)] = 0$ by the definition of $\bar f$, so its cross term with the constant $f(x)-\bar f(x)$ is also zero. What survives is

$$\big(f(x)-\bar f(x)\big)^2 + \mathbb{E}\big[(\bar f(x)-\hat f(x))^2\big] + \mathbb{E}[\varepsilon^2] = \text{bias}^2 + \text{variance} + \sigma^2$$

which is the decomposition above. Nothing here required $\hat f$ to be linear or the noise to be Gaussian — it holds for any fitting procedure.
  </div>
</details>

## Two different knobs on variance

This is a different knob from the one in the <a href="/notes/ridge-shrinks-correlated-predictors/" class="font-semibold text-royal hover:text-midnight">ridge regression note</a>. There, the model family was fixed and a penalty $\lambda$ shrank the coefficients within it. Here, the model family itself is growing — degree 7 can represent every function degree 2 can, plus far more. Shrinkage and model selection are two different ways of buying back variance; a production pipeline typically uses both, not one instead of the other.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The training-only evaluation trap</span>
The floor is $\sigma^2$, the irreducible noise in the outcome itself — no amount of model selection removes it, and mistaking a low training error for a low <em>total</em> error is the single most common way overfitting reaches production. A model evaluated only on the data it was trained on has no way to see variance at all; it needs a held-out test set, or resampling such as cross-validation, before "how well does this fit" can be trusted as "how well will this predict."
</div>

<details class="reveal reveal-recall">
  <summary>Why does training error keep falling as model complexity increases, even past the point where the model is clearly overfitting?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
A more flexible model family always contains everything a less flexible one could fit, plus more — so by construction it can match or beat the simpler model's training error. Training error only measures how well the model fits the data it has already seen, which is exactly what added flexibility is designed to improve.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What, precisely, is "variance" measuring in the bias-variance decomposition?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
How much the fitted model's prediction at a point would change if you retrained it on a different random sample from the same underlying data-generating process — not how spread out the data itself is.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why can't test error ever be driven to exactly zero, no matter how well the model is chosen?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The decomposition has an irreducible term, $\sigma^2$ — the variance of the noise in the outcome itself. Even a model that recovered the true $f(x)$ exactly, with zero bias and zero variance, would still miss individual observations by however much noise perturbed them.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why is comparing models by training error alone unreliable for choosing which one to ship?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Training error only ever reflects bias — it improves monotonically as flexibility increases and cannot see the variance a more flexible model is accumulating on data it hasn't seen. Two models can have the same training error while one generalises far worse, and the only way to tell them apart is to evaluate on held-out data the model didn't fit.
  </div>
</details>
