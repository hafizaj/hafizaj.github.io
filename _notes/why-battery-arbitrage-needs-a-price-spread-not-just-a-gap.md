---
title: "1.18× is the arbitrage floor a battery actually needs"
topic: "Storage economics"
module: "Energy Analytics"
date: 2026-08-26
updated: 2026-09-04
level: applied
featured: false
index_order: 15
source_schema: 2
takeaway: "A battery breaks even on energy only when the high price exceeds the low price divided by efficiency."
reading_time: 7
summary: "Round-trip efficiency means a battery sells less energy than it buys, so breakeven is a price ratio rather than a price difference. That ratio is a floor on the spread, not the whole requirement, and it moves with which efficiency figure you were quoted."
prerequisites: "Nothing beyond basic algebra."
sources:
  - id: pnnl-2019
    author: "Kendall Mongird, Vilayanur V. Viswanathan, Patrick J. Balducci, Md Jan E. Alam, Vanshika Fotedar, Vladimir S. Koritarov & Boualem Hadjerioua"
    title: "Energy Storage Technology and Cost Characterization Report, §3.1.7, §3.1.9, §4.2.3.3 and Table ES.1"
    organisation: "Pacific Northwest National Laboratory, for the US Department of Energy"
    publication: "PNNL-28866; free full text from OSTI"
    year: 2019
    url: "https://www.osti.gov/biblio/1573487"
    supports: "Round-trip efficiency defined as net energy discharged over net energy charged with the system returned to its initial state; the separate DC-to-DC and AC-to-AC conventions and the 0.96 power-conversion factor linking them; the 86% system round-trip efficiency used for lithium-ion; measured AC-to-AC values of 83–87% and 81%; the 0.50% annual efficiency degradation factor; and the 3,500-cycle, ten-year lithium-ion life assumption."
  - id: iea-nea-2020
    author: "International Energy Agency & OECD Nuclear Energy Agency"
    title: "Projected Costs of Generating Electricity, 2020 Edition, chapter 6"
    publication: "OECD Publishing, ISBN 978-92-64-55471-9; free full text from the NEA"
    year: 2020
    url: "https://www.oecd-nea.org/jcms/pl_51110/projected-costs-of-generating-electricity-2020-edition"
    supports: "The relation between discharged and charged energy through round-trip efficiency, the worked 1,000 MWh discharge / 1,250 MWh charge example at 80% efficiency, the required average price spread and the three cost components it has to cover, and the characterisation of lithium-ion round-trip efficiency as around 85%."
  - id: sioshansi-2009
    author: "Ramteen Sioshansi, Paul Denholm, Thomas Jenkin & Jurgen Weiss"
    title: "Estimating the value of electricity storage in PJM: Arbitrage and some welfare effects"
    publication: "Energy Economics 31(2), 269–277; publisher copy is subscription-gated"
    year: 2009
    url: "https://doi.org/10.1016/j.eneco.2008.10.005"
    supports: "The standard framing of storage arbitrage value as the accumulated spread between charging and discharging prices net of round-trip losses."
---

A battery charging at USD 50/MWh and discharging at USD 57/MWh has bought low and sold high, and has still lost money — USD 1.55 for every MWh it charged. At a round-trip efficiency of 0.85 the discharge price has to clear **USD 58.82/MWh** before the trade breaks even on energy alone, because only 0.85 MWh comes back out for every 1 MWh that goes in. The requirement is a **ratio**, not a difference, and it does not depend on the price level: at USD 40/MWh in, breakeven is USD 47.06/MWh out, the same 1.1765 multiple. What the ratio does depend on is which of two different efficiency figures you were handed.

## What the round trip actually returns

Round-trip efficiency is the ratio of net energy discharged to net energy charged, with the system returned to the state it started in [1](#source-pnnl-2019){: .source-ref}. Write it as $\eta$. Buy 1 MWh at the low price $P_{\text{low}}$ (USD per MWh), get $\eta$ MWh back, and sell it at the high price $P_{\text{high}}$:

$$\text{profit per MWh charged} = \eta \, P_{\text{high}} - P_{\text{low}} \quad (\text{USD/MWh})$$

Setting that to zero gives $\eta P_{\text{high}} = P_{\text{low}}$, so

$$P_{\text{high}} = \frac{P_{\text{low}}}{\eta}, \qquad \frac{P_{\text{high}}}{P_{\text{low}}} = \frac{1}{\eta}.$$

The same relation is what the IEA and NEA use when they cost storage: discharged energy equals $\eta$ times charged energy, so a unit discharging 1,000 MWh at 80% efficiency has to charge 1,250 MWh, and at EUR 20/MWh that charging costs EUR 25,000 [2](#source-iea-nea-2020){: .source-ref}. Expressed per unit of *output*, the charging cost is $P_{\text{low}}/\eta$ — which is the breakeven discharge price above, arrived at from the other direction.

Two consequences follow immediately. The threshold is scale-free: it says nothing about how many MWh you trade or how high prices are in absolute terms. And $1/\eta$ is convex, so efficiency losses bite disproportionately as $\eta$ falls. Going from $\eta = 0.85$ to $\eta = 0.50$ cuts efficiency by 41%, but it multiplies the excess of the required ratio over 1.0 — the part of the spread that pays for losses — by 5.7, from 0.1765 to 1.0000.

<div class="widget" data-widget="storage-breakeven">
  <div class="widget-head">
    <span class="widget-title">Breakeven price ratio · round-trip efficiency η</span>
    <span class="widget-readout" data-readout>η = 0.85   breakeven ratio = 1.176×   e.g. <span>$</span>50 → <span>$</span>58.82</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Breakeven price ratio rising sharply as round-trip efficiency falls below one"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="storage-eta">η</label>
      <input type="range" id="storage-eta" min="40" max="100" step="1" value="85">
    </div>
  </div>
  <p class="widget-caption">The slider runs η from 0.40 to 1.00; both η and the plotted ratio are unitless, and the worked example in the readout is in US dollars per MWh. Horizontal gridlines sit at 1.0×, 1.5× and 2.0×. The curve is 1/η, so it rises without bound as η falls and flattens to 1.0× only in the unreachable limit of a lossless round trip.</p>
  <p class="widget-noscript">This figure needs JavaScript. The formula above carries the same argument.</p>
</div>

## Which efficiency the 0.85 refers to

"85% round-trip" is ambiguous until you say where the energy was measured, and the two common measurement points differ by enough to change a trading decision.

**DC-to-DC** efficiency is measured at the battery terminals and excludes the power conversion system — the inverter and associated equipment that turns grid alternating current into direct current on the way in and back again on the way out. **AC-to-AC** efficiency is measured at the grid connection and includes those conversion losses. PNNL lists DC-to-DC figures per technology and multiplies by a 0.96 power-conversion factor to obtain the AC-to-AC system figure; on that convention a DC-to-DC efficiency of 89% corresponds to an AC-to-AC efficiency of 85% [1](#source-pnnl-2019){: .source-ref}.

**Unless a figure is explicitly labelled DC-to-DC, every efficiency in this note is AC-to-AC**, which is the convention a market participant needs, because the prices being compared are prices for energy delivered to and taken from the grid.

Using the wrong one is not a rounding error. At a USD 50/MWh charging price the required spread is USD 8.82/MWh on the AC-to-AC figure of 0.85 and USD 6.18/MWh on the DC-to-DC figure of 0.89 — the DC number understates the spread you actually need by 30%.

<details class="reveal">
  <summary>The two conventions, side by side at a USD 50/MWh charge price<span class="reveal-tag">table</span></summary>
  <div class="reveal-body" markdown="1">

| Efficiency figure | η | Breakeven discharge price (USD/MWh) | Required spread (USD/MWh) |
|---|---|---|---|
| DC-to-DC, battery terminals | 0.89 | 56.18 | 6.18 |
| AC-to-AC, grid connection | 0.85 | 58.82 | 8.82 |

The 0.89 and 0.85 pair is PNNL's own, linked by their 0.96 power-conversion factor [1](#source-pnnl-2019){: .source-ref}. The prices are this note's arithmetic: 50 ÷ 0.89 = 56.18 and 50 ÷ 0.85 = 58.82.
  </div>
</details>

## The floor at 85%, and what it leaves out

PNNL used a system round-trip efficiency of 86% for grid-scale lithium-ion, and the IEA and NEA describe lithium-ion as a high-efficiency store at around 85% [1](#source-pnnl-2019){: .source-ref}[2](#source-iea-nea-2020){: .source-ref}. At 0.86 the breakeven ratio is 1.1628, so a USD 50/MWh charge needs USD 58.14/MWh on discharge; at 0.85 it needs USD 58.82/MWh.

That figure is not fixed for the life of the asset. PNNL's own testing of grid-scale batteries returned AC-to-AC efficiencies of 83–87% over 1.5 years, against 81% for a battery more than five years old, and they attach an annual efficiency degradation factor of 0.50% to lithium-ion — while noting that the measured systems were different chemistries, so the comparison illustrates deterioration rather than measuring it [1](#source-pnnl-2019){: .source-ref}. At $\eta = 0.81$ the same USD 50/MWh charge needs USD 61.73/MWh to break even, USD 2.91/MWh more than at 0.85.

Efficiency is also only one of three things a spread has to cover. The IEA and NEA define a **required average price spread** for storage — the difference between the average discharge price and the average charging cost needed to break even — and it covers investment costs and fixed operation and maintenance costs *as well as* the cost of round-trip losses [2](#source-iea-nea-2020){: .source-ref}. The $1/\eta$ ratio is the loss term on its own. It is a necessary condition, not a sufficient one.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">A cycle is a consumable, and the trade spends one</span>
PNNL's lithium-ion assumptions pair a cycle life of 3,500 cycles at 80% depth of discharge with a calendar life of ten years [1](#source-pnnl-2019){: .source-ref}. Cycled once a day, the cycle budget runs out in about 9.6 years — so on a daily-arbitrage duty the two limits bind at roughly the same time, and each trade spends one of 3,500 cycles. That is why a spread that clears 1.18× can still be the wrong trade: the efficiency test asks only whether the energy paid for itself, and says nothing about whether the cycle did.
</div>

## Reading a spread before signing a trade

Three questions, in order. Is the quoted efficiency AC-to-AC or DC-to-DC, and if it is DC-to-DC, what conversion factor turns it into the AC-to-AC figure the market settles on? Is it the efficiency of a new system or of one several years into its life? And does the spread clear $1/\eta$ by enough to leave something for the investment and fixed costs that the required average price spread also has to absorb [2](#source-iea-nea-2020){: .source-ref}?

The published arbitrage-value literature works this way too: the value of storage in a wholesale market is accumulated from the spread between charging and discharging prices, net of round-trip losses, rather than from the raw gap between a low price and a high one [3](#source-sioshansi-2009){: .source-ref}.

<details class="reveal reveal-recall">
  <summary>Why is breakeven a price ratio rather than a fixed dollar gap?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the energy lost in the round trip is proportional to the energy stored, not a fixed quantity. Setting $\eta P_{\text{high}} = P_{\text{low}}$ gives $P_{\text{high}}/P_{\text{low}} = 1/\eta$, which has no absolute price level in it. At $\eta = 0.85$ the multiple is 1.1765 whether the charge price is USD 40/MWh or USD 400/MWh.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A vendor quotes 89% round-trip efficiency. What do you need to ask before using it?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Whether it is DC-to-DC or AC-to-AC. On PNNL's 0.96 power-conversion factor a DC-to-DC figure of 89% is an AC-to-AC figure of 85%, and the AC-to-AC one is what matters for prices settled at the grid connection. Taking 89% at face value at a USD 50/MWh charge price would put breakeven at USD 56.18/MWh instead of USD 58.82/MWh, understating the required spread by 30%.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A spread comfortably clears 1.18×. What has that test not established?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
That the trade is worth doing. The $1/\eta$ threshold covers only the energy lost in the round trip. The required average price spread the IEA and NEA define also has to cover investment costs and fixed operation and maintenance costs, and each cycle draws down a finite cycle life — 3,500 cycles at 80% depth of discharge in PNNL's lithium-ion assumptions.
  </div>
</details>
