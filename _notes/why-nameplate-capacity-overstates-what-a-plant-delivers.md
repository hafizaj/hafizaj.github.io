---
title: "A 100 MW plant rarely delivers 100 MW"
topic: "Capacity factor"
module: "Energy Analytics"
date: 2026-08-26
updated: 2026-09-04
level: foundation
featured: false
index_order: 16
source_schema: 2
takeaway: "Capacity factor converts a plant’s nameplate rating into the energy it actually produces over time."
reading_time: 7
summary: "Nameplate megawatts state a peak, not an output. Capacity factor turns a rating into annual megawatt-hours — the EIA divides by net summer capacity — and because levelised cost divides by that energy, the capacity factor assumed can decide a comparison."
prerequisites: "Nothing beyond basic algebra and unit conversion."
sources:
  - id: eia-epm
    author: "US Energy Information Administration"
    title: "Electric Power Monthly, Technical Notes (‘Average Capacity Factors’) and Tables 6.07.A and 6.07.B"
    publication: "Data for June 2026 release, published 26 August 2026; annual capacity factors for utility-scale generators, 2016–2024"
    year: 2026
    url: "https://www.eia.gov/electricity/monthly/"
    supports: "The definition of capacity factor as actual output over maximum possible output for a period, the use of net summer capacity and generator-specific available time in the denominator, and the 2024 US fleet-average capacity factors quoted in the table."
  - id: iea-nea-2020
    author: "International Energy Agency & OECD Nuclear Energy Agency"
    title: "Projected Costs of Generating Electricity, 2020 Edition, §3.2 and §3.3"
    publication: "OECD Publishing, ISBN 978-92-64-55471-9; free full text from the NEA"
    year: 2020
    url: "https://www.oecd-nea.org/jcms/pl_51110/projected-costs-of-generating-electricity-2020-edition"
    supports: "The standard 85% capacity-factor assumption applied to nuclear, coal and CCGT plants and the 30% assumption for open-cycle gas turbines, the report’s own statement that 85% is higher than observed practice, the distinction between assumed dispatch and technical capability, and the treatment of planned and unplanned outages under capacity credit."
  - id: eia-glossary
    author: "US Energy Information Administration"
    title: "Glossary: ‘Capacity factor’, ‘Generator nameplate capacity (installed)’, ‘Net summer capacity’ and ‘Heat rate’"
    url: "https://www.eia.gov/tools/glossary/"
    supports: "Nameplate capacity as the maximum rated output under manufacturer-specified conditions, net summer capacity as the output demonstrated by a multi-hour test at summer peak demand net of station service, and heat rate as the measure of thermal efficiency in Btu per kilowatt-hour, used here to separate efficiency from capacity factor."
---

Run a generator flat out at 100 MW for a non-leap year and it produces 876,000 MWh, because 365 × 24 = 8,760 hours. No plant does. In 2024 the average US utility-scale solar photovoltaic generator produced 23.2% of what its rating and its time online would have allowed, and the average nuclear generator 90.8% [1](#source-eia-epm){: .source-ref}. The ratio between what a plant produced and what its rating would have allowed is its **capacity factor**, and it is the number that converts a megawatt rating into megawatt-hours.

## The ratio, and the hours underneath it

$$\text{capacity factor} = \frac{\text{energy produced over the period (MWh)}}{\text{rated capacity (MW)} \times \text{hours in the period (h)}}$$

The EIA states it as actual output over the maximum possible output for the period, which leaves three choices buried in the denominator worth stating out loud [1](#source-eia-epm){: .source-ref}.

**Which rating.** Nameplate capacity is the maximum rated output under conditions the manufacturer specifies [3](#source-eia-glossary){: .source-ref}. The EIA's published capacity factors use net summer capacity instead — the maximum output demonstrated by a multi-hour test at the time of summer peak demand, reduced for the electricity the station consumes itself [1](#source-eia-epm){: .source-ref}[3](#source-eia-glossary){: .source-ref}. Same plant, same generation, different denominator, different capacity factor.

**Which hours.** A non-leap calendar year is 8,760 h and a leap year is 8,784 h, 0.27% more. That is small, but it is not the main hazard: the EIA divides by each generator's own *available time*, meaning the part of the period during which that generator existed, so a unit which came online in June is not charged for the months before it did. The EIA warns that its published figures therefore differ from what you get by dividing annual generation by year-end capacity [1](#source-eia-epm){: .source-ref}.

**Which period.** A capacity factor with no stated period is meaningless. Every figure in this note is annual.

## A year at 100 MW of net summer capacity

Those published factors were divided by net summer capacity times each generator's own available time, so anything built from them has to use that same denominator. Take a hypothetical generator that reports **100 MW of net summer capacity** to the EIA and is present for the whole of a non-leap year, so its available time is the full 8,760 h. Its denominator is then 100 MW × 8,760 h = 876,000 MWh, on the basis the EIA itself used, and the 2024 US fleet averages give [1](#source-eia-epm){: .source-ref}:

| Technology (utility-scale, US, 2024) | Capacity factor | Annual energy from 100 MW net summer capacity (MWh) | LCOE multiplier, 1/CF |
|---|---|---|---|
| Solar photovoltaic | 23.2% | 203,232 | 4.31× |
| Wind | 34.3% | 300,468 | 2.92× |
| Coal | 42.6% | 373,176 | 2.35× |
| Natural gas combined cycle | 60.5% | 529,980 | 1.65× |
| Nuclear | 90.8% | 795,408 | 1.10× |

Every row holds the same 100 MW of net summer capacity and the same 8,760 h of available time, so only the capacity factor moves: the nuclear row delivers 3.91 times the annual energy of the solar row.

Read the table as a normalisation, not as five real machines sharing a nameplate. Net summer capacity is not nameplate: it is the output demonstrated by a multi-hour test at summer peak demand, reduced for the electricity the station consumes itself [3](#source-eia-glossary){: .source-ref}, so for a given machine it is the lower of the two numbers. Converting a nameplate rating into a net summer one is a separate step, and this table does not take it. What the table does is hold the EIA's own denominator fixed so that its five published factors can be compared against each other.

The last column is the point of the next section: a simplified levelised cost of energy divides a fixed annual cost by annual energy, $\text{LCOE} = \text{FixedCost} / (\text{Capacity} \times \text{Hours} \times \text{CF})$, so with capacity and hours held fixed the cost per MWh scales as exactly $1/\text{CF}$.

<div class="widget" data-widget="capacity-factor">
  <div class="widget-head">
    <span class="widget-title">Annual energy &amp; LCOE multiplier · capacity factor</span>
    <span class="widget-readout" data-readout>CF = 85%   energy = 744,600 MWh/yr   LCOE × = 1.18</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Annual energy rising linearly and LCOE multiplier falling as capacity factor increases, for a fixed 100 megawatt net summer capacity over 8,760 hours"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="cf-slider">CF</label>
      <input type="range" id="cf-slider" min="10" max="100" step="1" value="85">
    </div>
  </div>
  <p class="widget-caption">Fixed at 100 MW of net summer capacity and 8,760 h, the same basis as the table above. The slider runs the capacity factor from 10% to 100%. Blue, on the left axis, is annual energy in MWh, ticked at 0k, 400k and 800k — so 800k means 800,000 MWh. Indigo, on the right axis, is the unitless LCOE multiplier 1/CF, ticked at 1×, 4×, 7× and 10×. The two axes are drawn with separate ticks because they share no scale. The slider opens at 85%, the standard baseload assumption discussed below.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above carries the same relationship at five fixed points.</p>
</div>

<details class="reveal">
  <summary>Why the cost multiplier is exactly 1/CF<span class="reveal-tag">2 lines</span></summary>
  <div class="reveal-body" markdown="1">
$\text{LCOE}(\text{CF}) = \dfrac{\text{FixedCost}}{\text{Capacity} \times \text{Hours} \times \text{CF}}$. Every term except CF is held fixed by construction, so $\text{LCOE}(\text{CF}_1)/\text{LCOE}(\text{CF}_2) = \text{CF}_2/\text{CF}_1$. At CF = 0.232 the cost per MWh is 4.31 times what the same asset would cost per MWh at CF = 1.0, and halving any capacity factor exactly doubles the cost per MWh.

This is a deliberately stripped-down LCOE: it holds fuel, variable operating costs, discounting and lifetime constant so that only the capacity-factor term moves. A full calculation carries all of those as well.
  </div>
</details>

## Three things capacity factor is not

**It is not availability.** Whether a unit was *able* to run and how much energy it *produced* are different questions, and they come apart in both directions. A solar plant with no faults at all still lands near 23% [1](#source-eia-epm){: .source-ref}, because its resource is absent at night. A combined-cycle gas turbine in perfect working order can sit below 80% because it is too expensive to compete in the baseload market, which is a dispatch decision rather than an outage [2](#source-iea-nea-2020){: .source-ref}. Outages do pull capacity factor down — nuclear plants exceed 90% in years without refuelling outages, and capacity credit for dispatchable plant is set after accounting for planned and unplanned outages [2](#source-iea-nea-2020){: .source-ref} — but they are one input to capacity factor, not a synonym for it.

**It is not efficiency.** Thermal efficiency is measured by heat rate, in Btu per kilowatt-hour: how much fuel energy it takes to make a unit of electrical energy [3](#source-eia-glossary){: .source-ref}. Capacity factor has no fuel in it at all. A plant can be efficient and rarely dispatched, or inefficient and running constantly.

**It is not a ranking of technologies.** A capacity factor is a joint statement about a resource, a machine and a market. Solar photovoltaic sits near 23% because its resource is absent at night and variable by day, not because the equipment is deficient.

## Why the assumption decides the cost comparison

Because LCOE moves as $1/\text{CF}$, the capacity factor written into a cost model does more work than most of the cost inputs. The IEA and NEA are explicit about this in their own methodology: for the 2020 edition they applied a standard 85% capacity factor to nuclear, coal and combined-cycle gas plants on the assumption that all three run in baseload, and 30% to open-cycle gas turbines, using plant-specific factors only for renewables and combined heat and power [2](#source-iea-nea-2020){: .source-ref}.

They also say, in the same report, that 85% "is higher than the average observed capacity factors in practice, and particularly so for CCGT plants", and that coal plants "habitually only achieve 50-60% load factors in major markets" [2](#source-iea-nea-2020){: .source-ref}. The 2024 US fleet bears that out: 60.5% for combined cycle and 42.6% for coal [1](#source-eia-epm){: .source-ref}.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">What that gap is worth, in the same units as the answer</span>
Take the same plant and the same fixed cost, and change only the assumed capacity factor. Moving a combined-cycle gas plant from the observed 2024 fleet average of 60.5% to the standard 85% assumption divides its LCOE by 1.405 — it reports a cost 28.8% lower. For coal, 42.6% to 85% cuts the reported cost almost exactly in half. Neither move touches construction cost, fuel price or discount rate. The IEA and NEA state their assumption openly and explain why they made it — comparability across regions [2](#source-iea-nea-2020){: .source-ref} — which is precisely what makes it checkable. An LCOE comparison that does not state its capacity factors cannot be checked on the input that moves it most.
</div>

<details class="reveal reveal-recall">
  <summary>Two generators with the same 100 MW capacity rating report very different annual energy. What does that tell you, and what does it not?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
It tells you their capacity factors differ, since annual energy is capacity × hours × CF and — provided both ratings are measured on the same basis — the first two terms match. It does not tell you which plant was more available, more efficient, or better run: capacity factor bundles resource availability, outages and dispatch economics into one ratio and does not separate them.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A model quotes a capacity factor with no period attached. Why is that a problem?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the denominator is capacity × hours, and the hours depend entirely on the period. Annual figures divide by 8,760 h in a non-leap year and 8,784 h in a leap year; monthly and seasonal figures differ far more than that. The EIA additionally divides by each generator's own available time, so a unit that came online mid-year is not penalised for the months before it existed — which is why its published figures do not match annual generation divided by year-end capacity.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why can changing one assumption swing an LCOE comparison without changing any cost?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because LCOE is proportional to 1/CF. Raising an assumed capacity factor from the observed 60.5% for US combined-cycle gas to the 85% baseload convention lowers the reported cost per MWh by 28.8% on its own; for coal, 42.6% to 85% roughly halves it. The fix is not to distrust the metric but to read the capacity factor beside every LCOE figure and ask what it was set to and why.
  </div>
</details>
