---
title: "The same five numbers, three axis floors, three different stories"
topic: "Chart axis truncation"
module: "Data Wrangling and Visualisation"
date: 2026-08-26
updated: 2026-09-04
level: foundation
featured: false
index_order: 6
source_schema: 2
takeaway: "Changing an axis floor changes perceived movement even when every data value stays fixed."
reading_time: 7
summary: "Move a chart's y-axis floor and the exaggeration it produces has a closed form: the true change multiplied by the value divided by its distance above the floor. The experimental evidence on who is fooled by it is less convenient than the usual advice suggests."
prerequisites: "None."
sources:
  - id: cleveland-mcgill-1984
    author: "William S. Cleveland and Robert McGill"
    title: "Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods"
    publication: "Journal of the American Statistical Association 79(387), 531–554; publisher copy is subscription-gated"
    year: 1984
    url: "https://doi.org/10.1080/01621459.1984.10478080"
    supports: "Cleveland and McGill is cited here only for the encoding-accuracy ranking of elementary perceptual tasks; the task as Heer and Bostock describe it did not manipulate an axis floor."
  - id: heer-bostock-2010
    author: "Jeffrey Heer and Michael Bostock"
    title: "Crowdsourcing Graphical Perception: Using Mechanical Turk to Assess Visualization Design"
    publication: "Proceedings of ACM CHI 2010, 203–212; free author copy from the UW Interactive Data Lab"
    year: 2010
    url: "https://idl.cs.washington.edu/files/2010-MTurk-CHI.pdf"
    supports: "An accessible description of Cleveland and McGill’s task — participants shown charts and asked what percentage the smaller of two marked values was of the larger — and a replication whose ranking of judgement types by accuracy is consistent with the original, with position encoding still significantly outperforming length encoding. The replication’s manipulated factors were the visual encoding (seven judgement types) and the true proportional difference between the two marks; no axis floor was varied."
  - id: correll-2020
    author: "Michael Correll, Enrico Bertini and Steven Franconeri"
    title: "Truncating the Y-Axis: Threat or Menace?"
    publication: "Proceedings of ACM CHI 2020, 1–12, doi:10.1145/3313831.3376222; free author copy on arXiv"
    year: 2020
    url: "https://arxiv.org/abs/1907.02035"
    supports: "The encoding argument that truncation breaks the convention that a difference in bar height is proportional to a difference in values; the survey of existing guidance that treats truncation as less pressing for line charts because they are read from position rather than length; and two crowdsourced experiments, with 40 and 32 participants and a y-axis beginning at 0%, 25% or 50%, finding that greater truncation raised perceived severity of an effect with all three levels differing, that bar and line designs did not differ significantly in that respect, and that broken-axis and gradient designs intended to signal truncation showed no significant difference from a plain truncated bar chart. Also the recommendation that designers work from the scale of effect sizes and variation they intend to communicate rather than from a binary of deceptive and truthful axes."
---

If a bar chart's vertical axis starts at 90 instead of 0, a quarter-on-quarter move of 4.0% arrives on the page as a bar 44% taller than its neighbour. Start the same axis at 97 and that same 4.0% becomes 200% taller — three times the height. The quarterly figures behind both drawings are identical: 100, 101, 99, 103, 102, whose largest move is the 4.0% from Q3 to Q4.

The chart has not misreported any value. It has changed what a bar's height is proportional to, and the size of that change can be written down exactly.

## What a bar's height stands in for

On an axis starting at zero, a bar of height $h$ representing a value $v$ satisfies $h \propto v$, so the ratio of two bar heights is the ratio of the two values. On an axis with floor $y_0$, the bar starts at the floor, so $h \propto v - y_0$ and the ratio of heights is a ratio of distances above the floor instead. That is the whole mechanism; the rest is division.

<details class="reveal">
  <summary>Turning that into a multiplier<span class="reveal-tag">derivation</span></summary>
  <div class="reveal-body" markdown="1">
Take two values $v_1$ and $v_2 = v_1(1 + r)$, where $r$ is the true relative change. With floor $y_0 < v_1$ the rendered heights are $h_1 = v_1 - y_0$ and $h_2 = v_2 - y_0$, so the relative difference in height is

$$r_{\text{visual}} = \frac{h_2}{h_1} - 1 = \frac{v_2 - v_1}{v_1 - y_0} = r \cdot \frac{v_1}{v_1 - y_0}.$$

The factor $v_1/(v_1 - y_0)$ depends only on where the floor sits relative to the data, never on the size of the change being shown. At $y_0 = 0$ it equals 1 and the encoding is faithful. As $y_0$ approaches $v_1$ the denominator approaches zero and the factor has no upper bound.
  </div>
</details>

Applying it to Q3 = 99 and Q4 = 103, whose true change is $4/99 = 4.04\%$:

| Axis floor | Q3 bar height | Q4 bar height | Multiplier | Change as drawn |
|---|---|---|---|---|
| 0 | 99 | 103 | 1.00 | 4.0% |
| 50 | 49 | 53 | 2.02 | 8.2% |
| 90 | 9 | 13 | 11.00 | 44.4% |
| 95 | 4 | 8 | 24.75 | 100.0% |
| 97 | 2 | 6 | 49.50 | 200.0% |
| 98 | 1 | 5 | 99.00 | 400.0% |

Every floor in that table is below every value in the series, so no bar is cut off and no data is hidden. The last row is the widget's maximum: one unit of headroom under the smallest value turns a 4% move into a bar five times the height of its neighbour.

<div class="widget" data-widget="truncated-axis">
  <div class="widget-head">
    <span class="widget-title">Same data · axis floor</span>
    <span class="widget-readout" data-readout>Axis starts at 0 · Q3→Q4 real change +4.0% · looks like +4%</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="A five-bar chart of nearly identical values, redrawn as the y-axis floor increases from 0 toward the data minimum"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="ta-floor">Axis floor</label>
      <input type="range" id="ta-floor" min="0" max="98" step="1" value="0">
    </div>
  </div>
  <p class="widget-caption">Five quarterly values — 100, 101, 99, 103, 102 — printed above their own bars and never changed. The slider sets the axis floor from 0 to 98, one unit below the smallest value; the readout compares the true Q3→Q4 change with the change in bar height, and the ratio between those two is the multiplier column of the table above.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above gives the same comparison at six fixed floors.</p>
</div>

## What the perception research supports, and what it doesn't

Cleveland and McGill's 1984 experiment is the usual citation here, and it is worth being exact about what it did. Participants were shown charts and asked to judge what percentage the smaller of two marked values was of the larger; the accuracy of those judgements was used to rank elementary perceptual tasks [1](#source-cleveland-mcgill-1984){: .source-ref}[2](#source-heer-bostock-2010){: .source-ref}. Heer and Bostock repeated the study with crowdsourced participants and found the ranking consistent with the original, position encoding still significantly outperforming length [2](#source-heer-bostock-2010){: .source-ref}. Neither the task as Heer and Bostock describe it nor their replication of it manipulated an axis floor: the factors varied were the encoding used and the true proportion between the two marks [2](#source-heer-bostock-2010){: .source-ref}. That establishes that people read these marks as magnitudes and how accurately they do it — not that truncation misleads.

For that, the direct evidence is more recent, and less flattering to the usual advice. Correll, Bertini and Franconeri ran crowdsourced experiments in which the same data was shown at three truncation levels, with the y-axis starting at 0%, 25% or 50%. Greater truncation produced significantly higher ratings of the severity of the effect, with all three levels differing from one another. Their second finding is the awkward one: bar charts and line charts did not differ significantly in how much truncation inflated those judgements. A follow-up experiment tested two designs meant to disclose truncation — a broken axis and a gradient at the base of each bar — and found no significant difference in perceived severity between those designs and a plain truncated bar chart [3](#source-correll-2020){: .source-ref}.

<div class="callout callout-note" markdown="1">
<span class="callout-label">Two arguments that are often merged</span>
The encoding argument and the perception evidence are separate, and only the first distinguishes bars from lines. Bars and areas encode a value as length or area measured from a baseline, so truncating breaks the convention that a difference in height is proportional to a difference in values, which is why guidance singles them out and treats the question as less pressing for line charts, whose values are read from position rather than from length [3](#source-correll-2020){: .source-ref}. The measured effect on readers' judgements did not respect that distinction. A truncated line chart may be defensible as an encoding and still leave its audience with an inflated sense of how much moved.
</div>

## Choosing a floor you can defend

None of this makes a non-zero floor indefensible. A series that never approaches zero — a stock index, a body temperature, a satisfaction score bounded at 60 — spends most of a zero-based chart as empty space, and the variation the reader came for is squeezed into a band too thin to read. Correll and colleagues end up in roughly that position: rather than a binary of deceptive and truthful axes, they suggest designers work from the scale of effect sizes and variation they intend to communicate [3](#source-correll-2020){: .source-ref}.

Two things follow from their results that are worth holding onto. Labelling the truncation is not sufficient on its own — the two disclosure designs they tested were not measurably different from a plain truncated chart — so the choice of floor is doing the work, not the annotation next to it. And the multiplier from the first section is a design parameter you can actually compute: a floor at 90 with data near 99 turns every change into eleven times itself before anyone reads a number.

<div class="callout callout-key" markdown="1">
<span class="callout-label">What this note is not claiming</span>
The distortion formula is arithmetic and holds exactly wherever a value is drawn as a distance from the axis floor. The claim about readers is narrower: it rests on the two crowdsourced experiments described above, with 40 and 32 participants, judging a subjective severity rating on synthetic data. That is enough to doubt the folk rule that truncation is fine for line charts and fine when labelled, and not enough to put a number on how much any particular audience will be misled by any particular chart.
</div>

<details class="reveal reveal-recall">
  <summary>A metric moves from 250 to 255 and is drawn on an axis starting at 240. How exaggerated is the change as drawn?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
By a factor of 250/(250 − 240) = 25. The true change is 5/250 = 2%, and the bar heights are 10 and 15, a 50% difference — twenty-five times the real one.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Does Cleveland and McGill's experiment show that truncated axes mislead?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
No. It ranked how accurately people judge different encodings using proportional judgements between two marks, varying the encoding and the true proportion rather than the axis floor. It supports the claim that bar length is read as a magnitude. The evidence that truncation inflates judgements of effect size comes from later experiments that manipulated truncation directly.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Is adding a broken-axis marker enough to make a truncated bar chart safe?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Not on the evidence available. Correll, Bertini and Franconeri tested a broken axis and a gradient base against a plain truncated bar chart and found no significant difference in the perceived severity of the effect. Disclosure is still worth doing, but the floor itself is what changes the impression.
  </div>
</details>
