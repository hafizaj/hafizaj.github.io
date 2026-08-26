---
title: "Ridge shrinks the directions your data trusts least"
topic: "Regularisation"
module: "Advanced Machine Learning"
date: 2026-08-26
reading_time: 9
summary: "Ridge does not shrink every coefficient by the same amount. It shrinks hardest along the directions your data determines worst — which is exactly why correlated predictors get pulled toward each other."
prerequisites: "Ordinary least squares in matrix form, and eigenvalues of a symmetric matrix."
sources:
  - "Hastie, Tibshirani & Friedman, <em>The Elements of Statistical Learning</em>, §3.4.1 — the SVD view of ridge."
  - "James et al., <em>An Introduction to Statistical Learning</em>, §6.2 — the gentler treatment."
---

Fit ridge regression to two predictors correlated at 0.9, and something odd happens well before the penalty gets large: their coefficients don't drift toward zero independently, they collide, converging toward each other while both are still nowhere near zero. The textbook line — "ridge shrinks coefficients toward zero" — is true and almost beside the point. **Ridge does not shrink uniformly.** It shrinks some directions in predictor space almost not at all, and others into near-oblivion, and which is which is decided entirely by your design matrix rather than by you.

## The setup

Ridge solves the penalised least-squares problem

$$\hat\beta_{\text{ridge}} = \arg\min_\beta \; \lVert y - X\beta \rVert_2^2 + \lambda \lVert \beta \rVert_2^2$$

which has the closed form

$$\hat\beta(\lambda) = (X^\top X + \lambda I)^{-1} X^\top y.$$

<div class="callout callout-key" markdown="1">
<span class="callout-label">Why "toward zero" is the wrong mental model</span>
Adding $\lambda I$ does not nudge every coefficient equally. It adds a constant $\lambda$ to **every eigenvalue** of $X^\top X$ — and a constant is enormous relative to a small eigenvalue and negligible relative to a large one.
</div>

## A 2×2 collinear system

Take two standardised predictors with correlation $0.9$, so that

$$X^\top X = \begin{pmatrix} 100 & 90 \\ 90 & 100 \end{pmatrix}, \qquad X^\top y = \begin{pmatrix} 80 \\ 70 \end{pmatrix}.$$

Both predictors are positively associated with the response. Now solve at $\lambda = 0$ — plain OLS:

$$\hat\beta(0) = \begin{pmatrix} 0.895 \\ -0.105 \end{pmatrix}.$$

One coefficient is strongly positive and the other is **negative**, even though both predictors are positively correlated with $y$. Nothing has gone wrong with the arithmetic. This is what collinearity does: it leaves the *sum* of the coefficients well determined and the *difference* almost completely undetermined, so the fit is free to make one large and the other negative at almost no cost.

<div class="widget" data-widget="ridge-shrinkage">
  <div class="widget-head">
    <span class="widget-title">Coefficient paths · r = 0.9</span>
    <span class="widget-readout" data-readout>λ = 0.0</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Two ridge coefficient paths converging as the penalty lambda increases"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="ridge-lambda">λ</label>
      <input type="range" id="ridge-lambda" min="0" max="1000" step="1" value="0">
    </div>
  </div>
  <p class="widget-caption">Move λ away from zero and watch the two paths rush toward each other before either gets close to zero. The gap closes far faster than the magnitudes fall.</p>
  <p class="widget-noscript">This figure needs JavaScript. The numbers in the surrounding text carry the same argument.</p>
</div>

## Why they converge

The answer is visible the moment you stop looking at $\beta_1$ and $\beta_2$ and start looking at the eigenvectors of $X^\top X$.

For our matrix those eigenvectors are the **sum** direction and the **difference** direction:

$$u_1 = \tfrac{1}{\sqrt 2}\begin{pmatrix}1\\1\end{pmatrix}, \quad d_1 = 190, \qquad u_2 = \tfrac{1}{\sqrt 2}\begin{pmatrix}1\\-1\end{pmatrix}, \quad d_2 = 10.$$

That eigenvalue gap *is* the collinearity. The data pins down "how much of the two predictors together" nineteen times more sharply than it pins down "which of the two."

<details class="reveal">
  <summary>Show the derivation<span class="reveal-tag">3 lines</span></summary>
  <div class="reveal-body" markdown="1">
Write the eigendecomposition $X^\top X = U D U^\top$. Because $U$ is orthogonal, $U U^\top = I$, so

$$X^\top X + \lambda I = U(D + \lambda I)U^\top \quad\Longrightarrow\quad (X^\top X + \lambda I)^{-1} = U(D+\lambda I)^{-1}U^\top.$$

Projecting $X^\top y$ onto the eigenbasis and writing $c_j = u_j^\top X^\top y$ gives

$$\hat\beta(\lambda) = \sum_j \frac{c_j}{d_j + \lambda}\, u_j.$$

So the coefficient along direction $j$ is the OLS coefficient $c_j/d_j$ multiplied by the shrinkage factor $d_j/(d_j+\lambda)$.
  </div>
</details>

The shrinkage factor is the whole story. For our two directions:

| λ | sum direction $\frac{190}{190+\lambda}$ | difference direction $\frac{10}{10+\lambda}$ |
|---|---|---|
| 0 | 1.00 | 1.00 |
| 10 | 0.95 | **0.50** |
| 50 | 0.79 | **0.17** |
| 190 | 0.50 | **0.05** |

At $\lambda = 10$ — a penalty small enough to barely touch the sum — the difference has already been halved. That is the convergence you can see in the figure. Ridge is not pulling the coefficients toward each other because it "likes" similar coefficients. It is destroying the one direction the data never determined in the first place, and what survives is their common component.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The scale-invariance trap</span>
Because the shrinkage factor depends on $d_j$, **ridge is not scale invariant**. Change the units of one predictor and you change its eigenvalues, and therefore change which directions get destroyed. Standardise your predictors before fitting, or you are letting your choice of units pick the penalty. This is also why the intercept is conventionally left unpenalised — shrinking it would make the fit depend on where you put the origin of $y$.
</div>

## Reading ridge coefficients under collinearity

The practical reading is that **ridge coefficients are not individually interpretable under collinearity, but their aggregate is.** If two predictors are strongly correlated, ridge will hand you two similar middling coefficients rather than one large and one negative. Neither answer is more "true" than the other; OLS picked an arbitrary point along a direction the data could not resolve, and ridge picked a different, more stable one.

If you actually need to know *which* of two correlated predictors matters, ridge is the wrong tool and no amount of tuning $\lambda$ will fix it. That question needs either better data — something that breaks the correlation — or a method that is willing to make a discrete choice, like the lasso, which will typically keep one and zero the other.

<details class="reveal reveal-recall">
  <summary>Why does ridge shrink some directions more than others?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the penalty adds a constant $\lambda$ to every eigenvalue of $X^\top X$, and the resulting shrinkage factor $d_j/(d_j+\lambda)$ depends on how large $d_j$ already was. A constant is large relative to a small eigenvalue and negligible relative to a large one, so poorly-determined directions collapse first.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Two predictors have correlation 0.95. What happens to their coefficients as λ grows?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
They converge toward each other much faster than they approach zero. High correlation makes the difference direction's eigenvalue small, so that direction is shrunk aggressively, while the shared component survives to much larger $\lambda$.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why must predictors be standardised before a ridge fit?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Ridge is not scale invariant. Rescaling a predictor changes the eigenvalues of $X^\top X$, which changes the shrinkage factors, which changes the fitted coefficients. Without standardisation the units you happened to measure in silently determine how hard each direction is penalised.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>When is ridge the wrong tool for correlated predictors?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
When you need to identify *which* of the correlated predictors is responsible. Ridge deliberately refuses to choose — it distributes weight across the correlated group. Use the lasso or elastic net if selection is the goal, or get data that breaks the correlation.
  </div>
</details>
