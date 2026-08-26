---
title: "Why nameplate capacity overstates what a power plant actually delivers"
topic: "Capacity factor"
module: "Energy Analytics"
date: 2026-08-26
reading_time: 7
summary: "A 100 MW solar farm and a 100 MW gas plant are not the same asset, even on paper. One runs a fifth of the time it could; the other runs most of it. The gap between them is capacity factor, and it changes both how much energy a plant actually delivers and how its true cost per unit of energy compares to its headline size."
prerequisites: "Nothing beyond basic algebra and unit conversion."
sources:
  - "IEA & NEA, <em>Projected Costs of Generating Electricity</em> — the standard reference for capacity factor assumptions across technologies."
  - "IRENA, <em>Renewable Power Generation Costs</em> — annual LCOE benchmarking by technology."
---

Two power plants, each rated at 100 MW. Announced side by side in a press release, they sound identical. They are not, because "100 MW" describes what a plant can produce at its absolute peak, not what it actually delivers averaged across a year — and the gap between those two numbers is exactly what capacity factor measures.

## The setup

$$\text{Capacity factor} = \frac{\text{energy actually produced}}{\text{nameplate capacity} \times \text{hours in the period}}$$

<div class="callout callout-key" markdown="1">
<span class="callout-label">The one thing to hold on to</span>
Capacity factor isn't a measure of how "good" a technology is — it reflects the physical reality of the resource driving it. Solar can only run when the sun is up; a gas plant can run whenever it's dispatched. Comparing two technologies by nameplate MW alone silently assumes they have the same capacity factor, which is almost never true.
</div>

## A deliberately awkward pair

Two 100 MW plants, one full year (8,760 hours):

| Plant | Capacity factor | Annual energy |
|---|---|---|
| Solar | 20% | 175,200 MWh |
| Gas (near-baseload) | 85% | 744,600 MWh |

Identical nameplate rating. The gas plant delivers **4.25× the actual annual energy** of the solar plant, purely because it can run over four times as many effective hours.

## How this bends the cost per unit of energy

A simplified Levelized Cost of Energy divides a fixed annual cost by annual energy produced: $\text{LCOE} = \text{FixedCost} / (\text{Capacity} \times \text{Hours} \times \text{CF})$. Hold the fixed cost and the nameplate capacity constant, and capacity factor is the only thing left in the denominator — so LCOE scales as **exactly $1/\text{CF}$**:

<div class="widget" data-widget="capacity-factor">
  <div class="widget-head">
    <span class="widget-title">Annual energy &amp; LCOE multiplier · capacity factor</span>
    <span class="widget-readout" data-readout>CF = 85%</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Annual energy rising linearly and LCOE multiplier falling as capacity factor increases, for a fixed 100 megawatt plant"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="cf-slider">CF</label>
      <input type="range" id="cf-slider" min="10" max="100" step="1" value="85">
    </div>
  </div>
  <p class="widget-caption">Energy delivered (blue) is a straight line in capacity factor — no surprises there. The cost multiplier (indigo) is not: halving capacity factor from 40% to 20% doesn't add a fixed amount to cost per MWh, it doubles it, because the same fixed cost is now being divided across half the energy.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above carries the same relationship at two fixed points.</p>
</div>

<details class="reveal">
  <summary>Why LCOE is exactly proportional to 1/CF<span class="reveal-tag">2 lines</span></summary>
  <div class="reveal-body" markdown="1">
$\text{LCOE}(\text{CF}) = \dfrac{\text{FixedCost}}{\text{Capacity} \times \text{Hours} \times \text{CF}}$. Every term except CF is held fixed by construction, so $\text{LCOE}(\text{CF}) / \text{LCOE}(1.0) = 1/\text{CF}$ follows immediately — at CF = 0.20, cost per unit of energy is exactly 5× what the same asset would cost per unit at CF = 1.0.
  </div>
</details>

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Where this bites</span>
This is precisely why capacity-factor assumptions are the single most consequential — and most disputed — input in any LCOE comparison. A generation technology's headline cost figure can look dramatically better or worse than a competitor's purely from an optimistic or conservative capacity-factor assumption baked into the model, well before construction cost or financing terms enter the picture at all.
</div>

<details class="reveal reveal-recall">
  <summary>Why can two 100 MW plants deliver very different amounts of annual energy?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because nameplate capacity only states the maximum instantaneous output — it says nothing about how much of the year the plant actually runs at or near that output. That fraction is the capacity factor, and it can differ enormously by technology and resource.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>If a plant's capacity factor drops from 40% to 20%, what happens to its LCOE, holding fixed costs constant?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
It doubles. LCOE is proportional to 1/CF, so halving capacity factor exactly doubles cost per unit of energy delivered — the same fixed cost is now spread across half as much output.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why is comparing two generation technologies by nameplate MW alone misleading?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because it implicitly assumes both technologies have the same capacity factor, which is almost never true — a resource-constrained technology like solar or wind runs a much smaller fraction of the year than a dispatchable plant like gas, so equal nameplate MW does not mean equal delivered energy.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why are capacity-factor assumptions often the most disputed input in an LCOE comparison?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because LCOE is exactly proportional to 1/CF, a modest change in the assumed capacity factor produces a large, mechanical swing in the resulting cost figure — enough to flip which technology looks cheaper — well before any dispute about actual construction or financing costs comes into play.
  </div>
</details>
