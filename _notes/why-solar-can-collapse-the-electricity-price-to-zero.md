---
title: "Solar can push the electricity price to zero — and that's a problem"
topic: "Merit-order dispatch"
module: "Energy Analytics"
date: 2026-06-09
reading_time: 9
summary: "Wholesale electricity markets clear at the cost of the most expensive generator still needed — not the average. Add enough zero-marginal-cost solar and that price can fall all the way to zero long before demand does, which is exactly the mechanism behind the grid's famous 'duck curve.'"
prerequisites: "What marginal cost means, and how a uniform-price auction clears."
sources:
  - "California ISO (2013), the original 'duck curve' net-load chart — the canonical illustration of this effect."
  - "Kirschen, D. S. & Strbac, G., <em>Fundamentals of Power System Economics</em> — the standard treatment of merit-order dispatch."
---

Push enough solar onto a grid and the wholesale price of electricity can fall to zero in the middle of a sunny afternoon — not at 3 a.m. when demand is genuinely slack, but at the hour households are running air conditioners and demand is nowhere near zero. The textbook explanation of market pricing — that price reflects the marginal generator's cost — is true and gives no hint why this happens. **Cheap, zero-marginal-cost supply doesn't lower the price by averaging with the expensive stuff; it lowers the price by knocking the most expensive generator off the margin entirely**, and if that knockout reaches deep enough into the stack, the price can hit zero while demand is still very much being served.

## The setup

Generators bid into the market in order of marginal cost, cheapest first — the **merit order**. The market clearing price is the marginal cost of the *last* generator whose capacity is needed to satisfy demand:

<div class="callout callout-key" markdown="1">
<span class="callout-label">It's displacement, not dilution</span>
Cheap, must-run generation — wind, solar, nuclear — doesn't lower the price by averaging with the expensive stuff. It lowers the price by <strong>displacing</strong> the most expensive generator from the margin entirely, so a small amount of free supply can have an outsized effect on price if it happens to push the market past a cheap-to-expensive boundary in the stack.
</div>

## A five-generator merit-order stack

Five tranches of generation, cheapest first:

| Generator | Capacity (MW) | Marginal cost ($/MWh) |
|---|---|---|
| Wind | 2,000 | 0 |
| Nuclear | 1,000 | 10 |
| Coal | 1,500 | 30 |
| Gas CCGT | 2,000 | 50 |
| Gas peaker | 1,000 | 120 |

Fix demand at 6,000 MW — a typical afternoon load — and add solar as a slider. Solar has near-zero marginal cost, so it doesn't join the stack; it simply reduces how much of the stack the market still has to dispatch, by reducing **net demand** (demand minus solar output).

<div class="widget" data-widget="merit-order-stack">
  <div class="widget-head">
    <span class="widget-title">Merit-order stack · solar output</span>
    <span class="widget-readout" data-readout>Solar = 0 MW</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Merit order supply stack with a vertical net-demand line showing which generator sets the market clearing price"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="solar-mw">S</label>
      <input type="range" id="solar-mw" min="0" max="4000" step="10" value="0">
    </div>
  </div>
  <p class="widget-caption">The bars are the stack, cheapest first. The vertical line is net demand — wherever it lands sets the price for every generator running, not just the marginal one. Push solar output up and watch the line slide left through the stack, taking the price with it.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above carries the same argument at solar = 0.</p>
</div>

At solar = 0, net demand is 6,000 MW — the Gas CCGT tranche is marginal, price is **$50/MWh**. Push solar to 2,000 MW and net demand falls to 4,000 MW — Coal becomes marginal, price drops to **$30**. At 3,500 MW of solar, Nuclear is marginal at **$10**. By 4,000 MW of solar — two-thirds of total demand — Wind alone covers net demand and the price falls to **$0/MWh**, with 2,000 MW of demand still being served.

## The duck curve

Now let solar output track the actual shape of a day instead of a fixed penetration level: rising through the morning, peaking at midday, collapsing to zero by early evening — at almost exactly the moment household demand starts climbing as people get home and turn on lights, heating, and appliances. Net demand (demand minus solar) traces a shape with a deep midday belly and a steep late-afternoon climb: California ISO's 2013 chart, which made this famous, nicknamed the shape after the silhouette it traces — the **duck curve**.

The belly is the mechanism above, playing out over a single day: the market price collapses through the middle of the day as solar displaces expensive marginal generation, then has to climb an unusually steep ramp back up in a few hours as the sun sets and demand keeps rising. That ramp is an operational problem, not just a pricing one — it requires bringing fast-responding generation online quickly, right as the grid's cheapest resource disappears.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The stack doesn't stop at zero</span>
At high enough solar penetration, net demand can fall so low that inflexible baseload plants — nuclear especially, which is slow and expensive to shut down and restart — would rather bid a <strong>negative</strong> price than stop running. Paying the grid to keep taking their output is cheaper than a shutdown-restart cycle. This is the real mechanism behind the negative wholesale prices increasingly observed on high-solar grids: not a market malfunction, but must-run generators being pushed below the bottom of a stack that was never designed to go negative.
</div>

<details class="reveal reveal-recall">
  <summary>Why does the market clearing price equal the marginal generator's cost, not the average cost across the stack?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because it's a uniform-price auction: every generator that clears gets paid the same price, set by the most expensive unit still needed. Averaging would underpay the marginal generator relative to its cost, which wouldn't clear the market.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>In the stack above, why does adding 2,000 MW of solar (from 0 to 2,000) drop the price by $20, while adding another 500 MW (2,000 to 2,500) only drops it a little further?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The price only moves when net demand crosses from one tranche into a cheaper one. The first 2,000 MW of solar happens to push net demand exactly out of the Gas CCGT tranche and into Coal — a full $20 step. Further solar within the same tranche keeps chipping away at Coal's dispatched volume without changing the marginal price, until net demand crosses the next boundary.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does the duck curve's steep evening ramp matter operationally, not just for pricing?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because grid operators have to bring several thousand megawatts of generation online in a short window as solar output collapses and demand keeps rising — a fast-ramping requirement that only fast-responding plants (typically gas peakers) can meet, straining reliability and requiring extra reserve capacity that sits mostly idle the rest of the day.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why would a generator ever accept a negative price rather than simply switching off?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because shutting down and restarting — especially for a plant like nuclear — carries its own real cost and operational risk. If that shutdown-restart cost exceeds what it would take to pay the market to keep absorbing their output for a few hours, bidding negative is the cheaper option.
  </div>
</details>
