---
title: "A sigmoid's gradient tops out at 0.25 — that's the vanishing-gradient problem"
topic: "Backpropagation"
module: "Deep Learning & Neural Networks"
date: 2026-08-26
updated: 2026-09-04
reading_time: 8
level: applied
featured: false
index_order: 9
source_schema: 2
takeaway: "Chaining sigmoid derivatives no larger than 0.25 can shrink a deep gradient exponentially."
summary: "Backpropagation multiplies a gradient signal through every layer it passes. A saturating activation like sigmoid caps the activation derivative at a quarter, so unless |w| reaches 4 each layer's multiplier stays below one and the product collapses with depth."
prerequisites: "The chain rule, and what a partial derivative of a loss with respect to a weight represents."
sources:
  - id: pascanu-2013
    author: "Razvan Pascanu, Tomas Mikolov & Yoshua Bengio"
    title: "On the difficulty of training recurrent neural networks"
    publication: "Proceedings of the 30th International Conference on Machine Learning, PMLR 28(3), 1310–1318"
    year: 2013
    url: "https://proceedings.mlr.press/v28/pascanu13.html"
    supports: "The bound on the layer Jacobian, the sufficient condition for vanishing gradients, and the value of the activation-derivative bound for sigmoid and tanh."
  - id: glorot-bengio-2010
    author: "Xavier Glorot & Yoshua Bengio"
    title: "Understanding the difficulty of training deep feedforward neural networks"
    publication: "Proceedings of the 13th International Conference on Artificial Intelligence and Statistics, PMLR 9, 249–256"
    year: 2010
    url: "https://proceedings.mlr.press/v9/glorot10a.html"
    supports: "The measured behaviour of logistic sigmoid networks under random initialisation, the depths at which they were trainable, and the normalised initialisation scheme."
  - id: goodfellow-2016
    author: "Ian Goodfellow, Yoshua Bengio & Aaron Courville"
    title: "Deep Learning, §6.3 and §8.2.5"
    publication: "MIT Press; full text free at deeplearningbook.org"
    year: 2016
    url: "https://www.deeplearningbook.org/contents/optimization.html"
    supports: "The rectified-linear derivative and its failure mode, the recommendation against sigmoid hidden units, and the limits of the vanishing-gradient story for feedforward networks."
---

The logistic sigmoid $\sigma(z) = 1/(1+e^{-z})$ has a derivative that never exceeds $0.25$, and reaches that value at exactly one input, $z = 0$. That ceiling constrains the activation derivative alone; what backpropagation multiplies at each layer is the weight times that derivative. Hold the weight magnitudes at or below 1 and $0.25$ becomes the best case for a whole layer, so ten of them pass on $0.25^{10} \approx 9.5 \times 10^{-7}$ of the gradient. That number is not an empirical finding about any particular architecture. It follows from the shape of one function, the chain rule, and an assumption about the weights worth stating out loud rather than smuggling in.

## Why a quarter is the ceiling

Backpropagation moves the gradient of the loss backwards through the network by repeated application of the chain rule. Take the simplest case, one unit per layer, with $z_l = w_l a_{l-1} + b_l$ and $a_l = \sigma(z_l)$: $z_l$ is the pre-activation input at layer $l$, $a_l$ its output, and $w_l$ the weight connecting the two. The sensitivity of the last layer's output to the first layer's output is then exactly

$$\frac{\partial a_L}{\partial a_1} \;=\; \prod_{l=2}^{L} w_l\,\sigma^{\prime}(z_l)$$

Because the gradient at the first weight factorises as $\frac{\partial \mathcal{L}}{\partial w_1} = \frac{\partial \mathcal{L}}{\partial a_L}\cdot\frac{\partial a_L}{\partial a_1}\cdot\frac{\partial a_1}{\partial w_1}$, that product is the entire distance-dependent part: everything the loss has to travel through to reach layer 1. Each factor $w_l\,\sigma^{\prime}(z_l)$ is what one layer does to the signal on the way back.

<details class="reveal">
  <summary>Verifying the 0.25 maximum<span class="reveal-tag">3 lines</span></summary>
  <div class="reveal-body" markdown="1">
The sigmoid satisfies $\sigma^{\prime}(z) = \sigma(z)\big(1-\sigma(z)\big)$. Treating that as a function of $s = \sigma(z) \in (0,1)$ gives $\frac{d}{ds}\big[s - s^2\big] = 1 - 2s$, which is zero at $s = 0.5$, and the second derivative is $-2 < 0$, so $s = 0.5$ is a maximum. At $s = 0.5$, which is $z = 0$, the derivative equals $0.5 \times 0.5 = 0.25$.
  </div>
</details>

The maximum sits at the one point where the unit is least committed, and the derivative falls away quickly on both sides:

| $z$ | $\sigma(z)$ | $\sigma^{\prime}(z)$ |
|---|---|---|
| 0 | 0.500 | **0.250** |
| 1 | 0.731 | 0.197 |
| 2 | 0.881 | 0.105 |
| 3 | 0.953 | 0.045 |
| 4 | 0.982 | 0.018 |

A unit whose pre-activation reaches $\pm 3$ is contributing a factor around $0.045$, under a fifth of the best case. This is what **saturation** means for a sigmoid: the output has moved close to 0 or 1, and the unit has become nearly insensitive to its input. *Deep Learning* notes that sigmoidal units saturate across most of their domain and are only strongly sensitive near $z = 0$, and on that basis discourages their use as hidden units in feedforward networks [3](#source-goodfellow-2016){: .source-ref}.

## From a ceiling to a sufficient condition

The scalar chain generalises. For a network whose layers apply a weight matrix and then an element-wise activation, the layer Jacobian is $W^\top \mathrm{diag}(\sigma^{\prime}(z))$, and its norm is bounded by the product of the two factors' norms. Pascanu, Mikolov and Bengio use exactly that bound to prove a condition for the recurrent case, where the same matrix $W$ repeats at every step: if $\lambda_1 < 1/\gamma$, where $\lambda_1$ is the largest singular value of $W$ and $\gamma$ bounds $\lVert \mathrm{diag}(\sigma^{\prime}(z))\rVert$, then long-range contributions to the gradient decay exponentially. They record $\gamma = 1$ for tanh and $\gamma = 1/4$ for sigmoid [1](#source-pascanu-2013){: .source-ref}.

Substituting turns the 0.25 ceiling into a number you can check against a recurrent model's shared matrix: for sigmoid, $\lambda_1 < 4$ is sufficient for long-range gradients to vanish. That guarantee stays inside the recurrent setting Pascanu, Mikolov and Bengio prove it in, where one $W$ repeats and so has one largest singular value to test; a feedforward stack has a different matrix at every layer and no single $\lambda_1$ to check it against. What does travel is the scalar version of the threshold: a per-layer factor $w\,\sigma^{\prime}(z)$ can only reach 1 if $\lvert w \rvert \ge 4$, since $\sigma^{\prime}$ cannot supply more than a quarter. Large weights are not a free escape route, though, because a large $w$ drives $z$ away from zero, which is where $\sigma^{\prime}$ collapses according to the table above.

## Ten layers of a quarter

Write $m$ for a representative per-layer factor, weight magnitude times activation derivative. Relative gradient magnitude after $L$ layers is then approximately $m^L$. For sigmoid units with weights near 1, the most optimistic value is $m = 0.25$. For a rectified linear unit, whose derivative is exactly 1 wherever the unit is active [3](#source-goodfellow-2016){: .source-ref}, $m$ is set by the weights alone and can sit near 1.

<div class="widget" data-widget="vanishing-gradient">
  <div class="widget-head">
    <span class="widget-title">Gradient magnitude · depth L</span>
    <span class="widget-readout" data-readout>m = 1.00   at L=10: 100.0%</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Relative gradient magnitude collapsing exponentially with depth for a per-layer multiplier below one"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="grad-m">m</label>
      <input type="range" id="grad-m" min="5" max="150" step="1" value="100">
    </div>
  </div>
  <p class="widget-caption">The slider sets the per-layer multiplier m from 0.05 to 1.50; the horizontal axis is depth L in layers, from 0 to 40, and the vertical axis is the surviving fraction of gradient magnitude, m<sup>L</sup>. The marker and readout track L = 10. At m = 0.25 the readout shows 9.5e-7; at m = 0.90 it shows 34.9%.</p>
  <p class="widget-noscript">This figure needs JavaScript. The numbers in the caption carry the same argument.</p>
</div>

Two values are worth holding onto. At $m = 0.25$, the sigmoid case in which every unit sits at $z = 0$ and no weight exceeds 1 in magnitude, ten layers leave $0.25^{10} \approx 9.5 \times 10^{-7}$, or one part in $1{,}048{,}576$. At $m = 0.9$, ten layers leave $0.9^{10} \approx 0.349$. The first number bounds the whole stack only under that weight assumption, because $0.25$ caps $\sigma^{\prime}$ rather than $w\,\sigma^{\prime}$: a layer carrying $\lvert w \rvert > 4$ can have a factor above 1, and does when $\sigma^{\prime}$ sits near its maximum, so the product can grow instead. What keeps that from being a general escape is the coupling noted above — pushing $\lvert w \rvert$ that high pushes $z$ off zero, where $\sigma^{\prime}$ is already much smaller than a quarter. The second number is an illustration of what a multiplier close to 1 buys, not a measurement of any particular network.

## What happened when people trained sigmoid networks

The arithmetic says a saturating activation makes deep gradients small. What that costs on a real training run was measured directly. Glorot and Bengio compared activation functions on the same tasks and found the logistic sigmoid unsuited to deep networks under random initialisation, because its non-zero mean output drives the top hidden layer into saturation. On their Shapeset-3×2 task the best depth was five layers for the other activations they tried and four for the sigmoid, and their depth-five sigmoid model never escaped the saturation regime during training [2](#source-glorot-bengio-2010){: .source-ref}.

Two details in that paper complicate the simple story. Saturated units sometimes did climb back out on their own, slowly, which is one explanation for the long plateaus seen during training. And the shrinking of back-propagated gradient variance towards the input layers was something they observed at initialisation, with the trend reversing quickly once learning started. Their proposed fix was not a new activation but a change to the initial weight scale, drawing from $U\left[-\sqrt{6}/\sqrt{n_j + n_{j+1}},\ \sqrt{6}/\sqrt{n_j + n_{j+1}}\right]$ so that signal variance is roughly preserved in both directions [2](#source-glorot-bengio-2010){: .source-ref}.

## What rectifiers fix, and what they leave

A rectified linear unit has derivative 1 wherever it is active, removing the sub-one ceiling sigmoid imposes on every layer. It replaces it with a different failure: a unit whose activation is zero on an example produces no gradient from that example at all, which is why leaky and parametric variants introduce a small non-zero slope on the negative side [3](#source-goodfellow-2016){: .source-ref}.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Saturation is one cause of vanishing gradients, not the whole account</span>
The strongest form of the problem comes from repeatedly multiplying by the <em>same</em> matrix, as a recurrent network does at every time step. Feedforward networks use a different matrix at each layer, and *Deep Learning* states that even very deep feedforward networks can largely avoid vanishing and exploding gradients for that reason [3](#source-goodfellow-2016){: .source-ref}. Reading a stalled deep network as "the activation function did it" therefore skips several other candidates, including the weight scale, the loss surface, and the depth of the computational graph itself.
</div>

<details class="reveal reveal-recall">
  <summary>What is the maximum value of the sigmoid derivative, and where does it occur?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
0.25, at z = 0, where σ(z) = 0.5. Moving away from zero in either direction makes the unit more saturated and the derivative smaller: about 0.10 at z = 2 and about 0.018 at z = 4.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What weight magnitude would a scalar sigmoid layer need for its backward factor to reach 1?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
At least 4, because the factor is w·σ′(z) and σ′ never exceeds 0.25. That is the scalar form of the condition Pascanu, Mikolov and Bengio state as λ₁ &lt; 1/γ with γ = 1/4 for sigmoid, which they prove for the shared matrix of a recurrent network rather than for a feedforward stack. Raising the weight that far pushes the pre-activation away from zero, where σ′ is smaller, so the two effects work against each other.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why is "sigmoid saturation" an incomplete explanation for a deep network that will not train?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the sharpest version of the vanishing-gradient problem comes from repeated multiplication by the same weight matrix, which is a recurrent-network property. Feedforward networks use distinct matrices per layer and can largely avoid it, so weight scale, initialisation and graph depth all have to be ruled out before the activation function is blamed.
  </div>
</details>
