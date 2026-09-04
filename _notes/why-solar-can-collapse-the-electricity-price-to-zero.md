---
title: "Solar can push the electricity price to zero — and that's a problem"
topic: "Merit-order dispatch"
module: "Energy Analytics"
date: 2026-08-26
updated: 2026-09-04
level: applied
featured: false
index_order: 17
source_schema: 2
takeaway: "In a marginal-price market, enough zero-cost supply drives the clearing price down to the lowest offer in the stack."
reading_time: 9
summary: "In a uniform-price wholesale market the clearing price is set by the last generator needed, so zero-marginal-cost solar lowers it by displacement rather than by averaging. Follow that far enough and the price hits the floor of the bid stack while demand is still fully served."
prerequisites: "What marginal cost means, and how a uniform-price auction clears."
sources:
  - id: ferc-primer-2020
    author: "Federal Energy Regulatory Commission, Office of Enforcement"
    title: "Energy Primer: A Handbook for Energy Market Basics, ‘Grid Operations’ and ‘Wholesale Electricity Markets’"
    publication: "FERC, June 2020"
    year: 2020
    url: "https://www.ferc.gov/sites/default/files/2020-06/energy-primer-2020.pdf"
    supports: "The supply stack sorted by marginal cost of production with dollars per MWh on the vertical axis and the cheapest units to the left, the clearing price as the intersection of aggregate supply and demand curves, cleared generators being paid that clearing price rather than their own offer, locational marginal price as the marginal cost of serving load, and negative prices arising in the Pacific Northwest when transmission is full and local load cannot absorb the generation."
  - id: caiso-duck-2016
    author: "California Independent System Operator"
    title: "Fast Facts: What the duck curve tells us about managing a green grid"
    publication: "California ISO, CommPR/2016"
    year: 2016
    url: "https://www.caiso.com/documents/flexibleresourceshelprenewables_fastfacts.pdf"
    supports: "Net load defined as forecast load minus forecast production from variable generation, the mid-afternoon belly and evening arch that give the duck chart its name, the 8,000 MW morning ramp and 11,000 MW evening ramp, the spring requirement to supply an additional 13,000 MW within about three hours as solar output ends, and the statement that wholesale prices during oversupply can be very low and even go negative."
  - id: eia-caiso-2025
    author: "Lori Aniti, US Energy Information Administration"
    title: "Solar and wind power curtailments are increasing in California (Today in Energy, 28 May 2025)"
    publication: "US Energy Information Administration"
    year: 2025
    url: "https://www.eia.gov/todayinenergy/detail.php?id=65364"
    supports: "The 2024 CAISO curtailment volume of 3.4 million MWh and its 29% year-on-year rise, solar as 93% of curtailed energy and spring as the peak season, the growth of California wind and solar photovoltaic capacity from 9.7 GW in 2014 to 28.2 GW in 2024, the requirement that a certain amount of gas generation stay online to meet NERC reliability standards and be ready to ramp in the evening, and solar supplying almost half of CAISO demand between 08:00 and 16:00 while demand rises later in the evening."
  - id: kirschen-strbac-2004
    author: "Daniel S. Kirschen & Goran Strbac"
    title: "Fundamentals of Power System Economics, chapter 3, ‘Markets for Electrical Energy’"
    publication: "Wiley, pp. 49–72; publisher copy is subscription-gated"
    year: 2004
    url: "https://doi.org/10.1002/0470020598.ch3"
    supports: "The standard textbook treatment of energy market clearing and merit-order dispatch that the operational account in this note follows; every specific claim made here is also carried by the FERC and CAISO sources."
---

Adding cheap generation to a power system does not pull the price down by averaging with the expensive generation. In a uniform-price market it pulls the price down by **displacement**: the clearing price is whatever the last generator needed to serve demand costs, so removing that generator from the margin moves the price to whatever the next one down the stack costs. The steps can be large, they can be uneven, and pushed far enough they reach the bottom of the stack — while demand is still being met in full.

## How a uniform-price auction picks its price

Generating units are ranked by their marginal cost of production, cheapest to the left, most expensive to the right. FERC calls the resulting curve the **supply stack** and plots cost of production in dollars per MWh on the vertical axis; in the New York market the dispatch order runs wind, then hydroelectric, nuclear, and coal-, gas- and oil-fired units [1](#source-ferc-primer-2020){: .source-ref}. The market operator builds aggregate supply and demand curves from submitted offers and bids, and their intersection identifies the market-clearing price [1](#source-ferc-primer-2020){: .source-ref}.

Two features of that mechanism do the work in this note. Offers below the clearing price are scheduled, and generators whose offers clear are paid the clearing price rather than the price they offered [1](#source-ferc-primer-2020){: .source-ref}. And the price reflects the marginal cost of serving the next increment of load given the units actually dispatched, which is what a locational marginal price is [1](#source-ferc-primer-2020){: .source-ref}. This is the standard treatment of energy market clearing [4](#source-kirschen-strbac-2004){: .source-ref}.

<div class="callout callout-note" markdown="1">
<span class="callout-label">Scope</span>
Everything below applies to markets that clear at a single marginal price, which is how the US regional transmission organisations and independent system operators described by FERC work [1](#source-ferc-primer-2020){: .source-ref}. A market that pays each generator its own offer, or that sets prices administratively, does not produce this behaviour, and the arithmetic here should not be carried across to one.
</div>

## Five tranches and a sliding net demand

The stack below is a teaching example, not a real market. Its numbers are chosen to make the steps legible:

| Tranche | Capacity (MW) | Marginal cost (USD/MWh) | Cumulative capacity (MW) |
|---|---|---|---|
| Wind | 2,000 | 0 | 2,000 |
| Nuclear | 1,000 | 10 | 3,000 |
| Coal | 1,500 | 30 | 4,500 |
| Gas CCGT | 2,000 | 50 | 6,500 |
| Gas peaker | 1,000 | 120 | 7,500 |

Demand is fixed at 6,000 MW. Solar enters at a marginal cost low enough that it is always dispatched, so rather than taking a place in the stack it subtracts from what the stack has to serve. That residual is **net demand** — the ISO definition is forecast load minus forecast production from variable generation such as wind and solar [2](#source-caiso-duck-2016){: .source-ref}. The clearing price is the marginal cost of the first tranche whose cumulative capacity reaches net demand.

<div class="widget" data-widget="merit-order-stack">
  <div class="widget-head">
    <span class="widget-title">Merit-order stack · solar output</span>
    <span class="widget-readout" data-readout>Solar = 0 MW   net demand = 6000 MW   marginal = Gas CCGT   price = <span>$</span>50/MWh</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Merit order supply stack with a vertical net-demand line showing which generator sets the market clearing price"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="solar-mw">S</label>
      <input type="range" id="solar-mw" min="0" max="4000" step="10" value="0">
    </div>
  </div>
  <p class="widget-caption">Bars are the five tranches in merit order. The horizontal axis is cumulative capacity in MW; the vertical axis is marginal cost in USD per MWh, ticked at 0, 30, 60, 90 and 120. The slider is solar output in MW, from 0 to 4,000 in 10 MW steps, and the vertical line is the resulting net demand of 6,000 MW minus solar. The zero-cost wind bar is drawn with a small minimum height so it does not vanish into the axis at zero.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above and the four boundaries below carry the same argument.</p>
</div>

Sliding the solar output up gives four prices and three step changes, and the steps do not arrive at even intervals:

| Solar output (MW) | Net demand (MW) | Marginal tranche | Clearing price (USD/MWh) |
|---|---|---|---|
| 0 to 1,490 | 6,000 down to 4,510 | Gas CCGT | 50 |
| 1,500 to 2,990 | 4,500 down to 3,010 | Coal | 30 |
| 3,000 to 3,990 | 3,000 down to 2,010 | Nuclear | 10 |
| 4,000 | 2,000 | Wind | 0 |

The first 1,500 MW of solar cuts the price by USD 20/MWh, from 50 to 30. The next 1,500 MW cuts it by USD 20 more, to 10. The 1,000 MW after that cuts it by only USD 10, to zero. And within any one of those bands, extra solar changes the *quantity* each tranche is dispatched for without changing the price at all: at 2,000 MW and at 2,500 MW of solar the price is USD 30/MWh either way. Price moves only when net demand crosses a tranche boundary.

At the top of the slider, 4,000 MW of solar leaves net demand at 2,000 MW, exactly wind's capacity, and the clearing price is USD 0/MWh. **Demand has not fallen.** All 6,000 MW is still being served — 4,000 MW by solar and 2,000 MW by wind — and the price is zero because the marginal unit's offer is zero.

<details class="reveal">
  <summary>Why the boundary lands where it does<span class="reveal-tag">3 lines</span></summary>
  <div class="reveal-body" markdown="1">
The dispatch rule is: find the first tranche whose cumulative capacity is greater than or equal to net demand, and take its marginal cost. Cumulative capacities are 2,000, 3,000, 4,500, 6,500 and 7,500 MW. So the price changes exactly when net demand falls to 4,500, then 3,000, then 2,000 MW, which is at solar outputs of 1,500, 3,000 and 4,000 MW.

The comparison uses "greater than or equal to", so at the knife edge — net demand of exactly 2,000 MW — wind alone covers it and sets the price. A rule using strict inequality would keep nuclear marginal at that single point. The convention matters only at three exact values and is stated here so the table can be checked.
  </div>
</details>

## Where zero stops and negative begins

In this stack the price cannot go below zero, no matter how much solar is added, because no tranche offers below zero. Zero is the floor of *this* bid stack, and that is the whole reason the two cases have to be kept apart:

- A **zero** price means the marginal generator's offer is zero. Nothing unusual is happening; a zero-cost unit is setting the price.
- A **negative** price means some generator is offering below zero — paying to keep producing. That requires a reason to run that is not the energy price.

Those reasons are documented. CAISO reports that during oversupply, when generation exceeds real-time demand, wholesale prices "can be very low and even go negative in which generators have to pay utilities to take the energy" [2](#source-caiso-duck-2016){: .source-ref}. The EIA notes that CAISO curtails solar partly to keep a certain amount of gas generation online, both to comply with North American Electric Reliability Corporation reliability standards and to have units ready to ramp up in the evening [3](#source-eia-caiso-2025){: .source-ref}. A unit held online to meet a reliability standard, or held online so that it is in position to ramp when the sun sets, has a reason to keep producing that the energy price does not capture. FERC describes a separate route to the same outcome in the Pacific Northwest, where abundant hydro output combined with full transmission lines and insufficient local load drives off-peak prices negative [1](#source-ferc-primer-2020){: .source-ref}.

The volumes involved are not trivial. CAISO curtailed 3.4 million MWh of utility-scale wind and solar in 2024, up 29% on 2023, with solar accounting for 93% of it and the spring the worst season — a period when solar output is relatively high and mild temperatures keep demand relatively low. Behind that is capacity growth from 9.7 GW of wind and solar photovoltaic in 2014 to 28.2 GW by the end of 2024 [3](#source-eia-caiso-2025){: .source-ref}.

## The ramp the belly creates

Let solar follow the shape of a real day instead of sitting at one level, and the net-demand curve acquires a mid-afternoon belly and an evening arch — the shape CAISO's own document reports the industry calls the duck chart [2](#source-caiso-duck-2016){: .source-ref}. The belly is the mechanism above playing out over hours: solar supplies almost half of CAISO's demand between 08:00 and 16:00, and demand then rises in the evening as people get home [3](#source-eia-caiso-2025){: .source-ref}.

The arch is the operational half of the same story, and it has numbers attached. CAISO's analysis identifies a morning ramp of 8,000 MW, an evening ramp of 11,000 MW as the sun sets from around 16:00, and, on its spring net-load chart, a requirement to supply an additional 13,000 MW within approximately three hours to replace the electricity lost as solar output ends [2](#source-caiso-duck-2016){: .source-ref}.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The price signal and the reliability requirement point opposite ways</span>
The midday hours that drive the clearing price toward the bottom of the stack are the same hours in which the system has to hold fast-ramping capacity ready for the evening. That is why CAISO curtails solar to keep gas online rather than simply taking the free energy [3](#source-eia-caiso-2025){: .source-ref}. Reading the low midday price as a signal that the system has spare capacity gets it backwards: at that moment the system is short of flexibility, not long on it, and the price is low precisely because the cheapest resource is abundant and the expensive one has been pushed off the margin.
</div>

<details class="reveal reveal-recall">
  <summary>Why does adding 500 MW of solar sometimes move the price by USD 20/MWh and sometimes not at all?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the price is set by which tranche is marginal, and that only changes when net demand crosses a cumulative-capacity boundary. Going from 1,000 MW to 1,500 MW of solar takes net demand from 5,000 to 4,500 MW, crossing out of Gas CCGT into Coal, a USD 20/MWh step. Going from 2,000 MW to 2,500 MW takes net demand from 4,000 to 3,500 MW, both inside Coal, so the price stays at USD 30/MWh and only the dispatched quantities change.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>The clearing price is USD 0/MWh. What can and cannot be inferred about demand?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Nothing about demand being low. In the stack here, USD 0/MWh occurs with all 6,000 MW of demand served — 4,000 MW by solar and 2,000 MW by wind. What can be inferred is that the marginal unit offered zero, so every cleared generator is paid zero for that interval regardless of what it offered.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What has to be true for the price to go below zero rather than stopping at it?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Some generator has to offer below zero, which means it has a reason to run that is not the energy price. Documented reasons include reliability requirements that keep a minimum amount of generation online, the need to have units positioned to ramp up later in the day, and transmission constraints that prevent output reaching load elsewhere. In a bid stack whose lowest offer is zero, no amount of additional zero-cost supply produces a negative price.
  </div>
</details>
