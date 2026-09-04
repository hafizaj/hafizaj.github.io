---
title: "A better fit on your training data can predict worse"
topic: "Bias-variance tradeoff"
module: "Machine Learning"
date: 2026-08-26
updated: 2026-09-04
reading_time: 9
level: foundation
featured: false
index_order: 7
source_schema: 2
takeaway: "Lower training error can mean worse unseen predictions when extra flexibility starts fitting noise."
summary: "A model that fits every wiggle in your training data almost always predicts worse on new data than one that fits it a little worse. Pushing training error toward zero doesn't buy you a better model — past a point, it buys you a model that has memorised your noise."
prerequisites: "What least-squares regression fits, and what a training/test split is."
sources:
  - id: geman-1992
    author: "Stuart Geman, Elie Bienenstock & René Doursat"
    title: "Neural Networks and the Bias/Variance Dilemma"
    publication: "Neural Computation 4(1), 1–58"
    year: 1992
    url: "https://doi.org/10.1162/neco.1992.4.1.1"
    supports: "The paper that named the bias/variance dilemma and framed it as a constraint on flexible estimators rather than a defect of a particular model."
  - id: esl-2009
    author: "Trevor Hastie, Robert Tibshirani & Jerome Friedman"
    title: "The Elements of Statistical Learning, 2nd edition, §7.2–§7.3"
    publication: "Springer; full text free from the authors"
    year: 2009
    url: "https://hastie.su.domains/ElemStatLearn/"
    supports: "The formal decomposition into irreducible error, squared bias and variance, the distinction between test error for one fixed training set and expected test error, and the behaviour of training error as complexity rises."
  - id: isl-2021
    author: "Gareth James, Daniela Witten, Trevor Hastie & Robert Tibshirani"
    title: "An Introduction to Statistical Learning, 2nd edition, §2.2.2"
    publication: "Springer; full text free from statlearning.com"
    year: 2021
    url: "https://www.statlearning.com/"
    supports: "The definition of expected test MSE as an average over repeated training sets, the plain-language definitions of bias and variance, and the statement that flexibility raises variance and lowers bias only as a general rule."
---

Which of two fitted curves should you trust: the one that misses many of your data points, or the one that passes almost exactly through them all? The second answer is the intuitive one, and here it is wrong. A degree-2 polynomial through nine noisy points of discount percentage against conversion lift leaves a training mean squared error of 2.88; pushing to degree 7 threads the curve through nearly every point and drops that to 1.34. On eight held-out points the ranking reverses: degree 2 scores 2.29 and degree 7 scores 4.13. The fit that looks better on the data it was given is the one to discard.

## Seven polynomial fits to the same nine points

The data here is synthetic, which is what makes the comparison legible: the relationship the points were generated from is

$$f(x) = 20 + 1.4x - 0.03x^2$$

a single-peaked curve where lift rises with the discount and then falls as heavy discounts start reading as a signal of low quality. Nine training points sit at $x = 0, 5, 10, \dots, 40$ with fixed, deliberately chosen noise added. Eight test points sit at the midpoints between them, $x = 2.5, 7.5, \dots, 37.5$, with their own fixed noise. Both sets are held constant so that the only thing changing between rows below is the degree of the fitted polynomial. Errors are mean squared errors in the units of lift, squared.

| Degree | Train MSE | Test MSE |
|---|---|---|
| 1 | 23.47 | 15.33 |
| 2 | **2.88** | **2.29** |
| 3 | 2.83 | 2.57 |
| 4 | 1.85 | 2.94 |
| 5 | 1.82 | 3.18 |
| 6 | 1.34 | 4.29 |
| 7 | 1.34 | 4.13 |

Training error never rises as the degree increases, and that is guaranteed rather than lucky: every degree-$d$ polynomial is also a degree-$(d{+}1)$ polynomial with a zero leading coefficient, so the larger family can match the smaller family's fit and then look for something better. Test error behaves differently. It reaches its minimum at degree 2, the order of the curve that generated the data, and by degree 7 it is about 80% higher.

The degree-2 fit recovers coefficients of $19.55$, $1.448$ and $-0.0310$ against the true $20$, $1.4$ and $-0.03$. Degree 2 was not chosen to flatter the example. It is the smallest degree with enough freedom to represent the generating curve, and nothing above it has any signal left to find.

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
  <p class="widget-caption">Horizontal axis is the discount in per cent; vertical axis is conversion lift. Filled circles are the nine training points, hollow diamonds the eight test points, and the dashed grey line is the generating curve, visible only because the data is synthetic. The readout reproduces the two error columns in the table above.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above carries the same argument.</p>
</div>

## Three sources of error, one of which you cannot touch

Suppose the response is $y = f(x) + \varepsilon$ with $\mathbb{E}[\varepsilon] = 0$ and $\mathrm{Var}(\varepsilon) = \sigma^2$, and that $\hat f$ has been fitted to a training set drawn at random. At a single input $x$, the expected squared prediction error splits into three non-negative pieces [2](#source-esl-2009){: .source-ref}[3](#source-isl-2021){: .source-ref}:

$$\mathbb{E}\big[(y - \hat f(x))^2\big] = \underbrace{\big(f(x) - \mathbb{E}[\hat f(x)]\big)^2}_{\text{bias}^2} + \underbrace{\mathrm{Var}\big[\hat f(x)\big]}_{\text{variance}} + \sigma^2$$

**Bias** measures how far the model's *average* prediction sits from the truth, averaging over training sets. A model too rigid to represent the real relationship stays wrong there no matter how much data arrives. **Variance** measures how much the prediction at that same point would move if the model were refitted on a different sample from the same process [3](#source-isl-2021){: .source-ref}. It says nothing about how spread out the data is. The last term, $\sigma^2$, is the variance of the noise in the outcome itself, and no fitting procedure removes it, so the expected test error cannot fall below it [3](#source-isl-2021){: .source-ref}.

Training error only responds to the first of the three. That is why it kept falling in the table while test error turned around.

<details class="reveal">
  <summary>Where the three terms come from<span class="reveal-tag">derivation</span></summary>
  <div class="reveal-body" markdown="1">
Write $y = f(x) + \varepsilon$ with $\mathbb{E}[\varepsilon] = 0$, $\mathrm{Var}(\varepsilon) = \sigma^2$, and $\varepsilon$ independent of the training set $D$ that $\hat f$ was fitted on. Let $\bar f(x) = \mathbb{E}_D[\hat f(x)]$ be the average prediction over all possible training sets. Then

$$\mathbb{E}\big[(y-\hat f(x))^2\big] = \mathbb{E}\big[(f(x)+\varepsilon-\hat f(x))^2\big].$$

Add and subtract $\bar f(x)$ inside the square:

$$= \mathbb{E}\Big[\big((f(x)-\bar f(x)) + (\bar f(x)-\hat f(x)) + \varepsilon\big)^2\Big].$$

$f(x)-\bar f(x)$ is a constant once the average over $D$ has been taken. Expanding gives three squared terms and three cross terms. Each cross term is zero: $\varepsilon$ is mean-zero and independent of $D$, so it has zero covariance with anything built from $\hat f$, and $\mathbb{E}_D[\bar f(x)-\hat f(x)] = 0$ by the definition of $\bar f$. What remains is

$$\big(f(x)-\bar f(x)\big)^2 + \mathbb{E}\big[(\bar f(x)-\hat f(x))^2\big] + \mathbb{E}[\varepsilon^2] = \text{bias}^2 + \text{variance} + \sigma^2.$$

Nothing in that argument required $\hat f$ to be linear or $\varepsilon$ to be Gaussian, which is why the same three terms appear for any fitting procedure under squared-error loss. Geman, Bienenstock and Doursat used exactly this structure to argue that the trade-off constrains flexible estimators in general rather than any one model family [1](#source-geman-1992){: .source-ref}.
  </div>
</details>

## One split is not an expectation

The decomposition describes an average over training sets. The table describes one training set and one test set, and the difference shows up in the numbers. Test error rises from degree 2 to degree 6 and then falls slightly at degree 7, from 4.29 to 4.13. A decomposition that held pointwise for every fitted model would not permit that wobble; an average over many training sets would smooth it away.

The vocabulary for this is worth keeping straight. *The Elements of Statistical Learning* writes $\mathrm{Err}_{\mathcal{T}}$ for the test error of a model fitted on one specific training set $\mathcal{T}$, and plain $\mathrm{Err}$ for the expected test error, which averages that quantity over the randomness in the training set as well [2](#source-esl-2009){: .source-ref}. What a single held-out split reports is an estimate of the first quantity. The claim that more flexibility raises variance and lowers bias is a statement about the second, and both textbooks phrase it as a general tendency rather than a guarantee [2](#source-esl-2009){: .source-ref}[3](#source-isl-2021){: .source-ref}.

Two things here are exact rather than tendencies: training error is non-increasing in degree for nested families, and expected test error is bounded below by $\sigma^2$. Everything else in the shape of that curve is a strong regularity, not a law, and one split will show you a noisy version of it.

## A different knob from the ridge penalty

The <a href="/notes/ridge-shrinks-correlated-predictors/" class="font-semibold text-royal hover:text-midnight">ridge regression note</a> turns a different dial. There the model family is fixed and a penalty pulls the coefficients within it toward zero, buying lower variance for a little bias. Here the family itself grows, because degree 7 can represent everything degree 2 can and a great deal more. Shrinkage and model selection are separate mechanisms for the same purchase, and a production pipeline usually uses both.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Evaluating on the training set cannot see variance at all</span>
A model scored only on the data it was fitted to has no way to detect variance, because variance is defined by what would happen on data it has not seen. *The Elements of Statistical Learning* puts the consequence bluntly: training error drops toward zero as complexity rises, and a model with zero training error is typically overfitted and generalises poorly [2](#source-esl-2009){: .source-ref}. Held-out data or resampling such as cross-validation is what converts "this fits well" into evidence about "this will predict well."
</div>

<details class="reveal reveal-recall">
  <summary>Why does training error keep falling as complexity increases, even well past the point of overfitting?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because each more flexible family contains every function the less flexible one could fit. The larger family can reproduce the smaller family's solution and then search further, so its training error can only match or beat it. Training error measures fit to data already seen, which is precisely what added flexibility improves.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What exactly is "variance" measuring in the decomposition?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
How much the fitted model's prediction at a given point would change if the model were refitted on a different random sample from the same data-generating process. It is not a measure of how spread out the observed data is.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why can a single held-out split show test error falling when the model got more flexible?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because one split estimates the test error of one fitted model, not the expectation over training sets that the decomposition describes. The rise in expected test error with excess flexibility is a tendency; on any particular pair of samples, individual degrees can swap places, as degrees 6 and 7 do here.
  </div>
</details>
