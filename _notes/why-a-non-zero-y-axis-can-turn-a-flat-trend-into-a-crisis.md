---
title: "Why a non-zero y-axis can turn a flat trend into a crisis"
topic: "Chart axis truncation"
module: "Data Wrangling and Visualisation"
date: 2026-08-26
reading_time: 7
summary: "Bar and line charts are judged by relative height before anyone reads an axis label. Start the y-axis above zero and the exact same numbers can be made to look flat, alarming, or triumphant — with no change to the data at all."
prerequisites: "None."
sources:
  - "Cleveland, W. S., McGill, R. (1984), 'Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods', <em>JASA</em> — the foundational study on how accurately people read different chart encodings."
  - "Tufte, E. R., <em>The Visual Display of Quantitative Information</em> — the 'lie factor' concept this note's distortion factor is a special case of."
---

A chart is read before it's read. The eye compares bar heights, or the steepness of a line, well before anyone gets to the axis labels — and a lot of very ordinary charting decisions quietly weaponise that. The most common one is also the easiest to miss: where the y-axis is allowed to start.

## The setup

A bar's height is supposed to be a visual stand-in for its value. That only works if the axis starts at zero — otherwise the rendered height is proportional to *value minus the axis floor*, not to the value itself, and the reader has no way to tell the difference just by looking. Two values that differ by 4% in reality can be made to differ by 4%, 44%, or 200% on screen, purely by choosing where the axis starts.

<div class="callout callout-key" markdown="1">
<span class="callout-label">The one thing to hold on to</span>
A zero-based axis makes bar height <strong>proportional to the value</strong> — a fair encoding. Any other floor makes bar height proportional to the value's <strong>distance above the floor</strong>, which is a different, and generally smaller, number. Shrinking the denominator without telling the reader is what does the damage.
</div>

## The same five numbers, three times

Five quarters of a metric that moved from 100 to 101 to 99 to 103 to 102 — a genuinely flat series, wobbling inside a 4-point band around 100:

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
  <p class="widget-caption">Every number printed above every bar stays exactly the same as you drag the slider. Only the story the shape tells changes — from "flat" to "look at that jump" without a single value moving.</p>
  <p class="widget-noscript">This figure needs JavaScript. The values (100, 101, 99, 103, 102) are unchanged regardless of how they're plotted — only the visual impression shifts.</p>
</div>

At an axis floor of 90, the real 4.0% gap between Q3 and Q4 renders as a 44% difference in bar height. Push the floor to 97 — still comfortably below every value in the series — and the same 4.0% gap renders as 200%: Q4's bar is visually three times the height of Q3's, describing data that barely moved.

<details class="reveal">
  <summary>Why the distortion has an exact formula, not just a direction<span class="reveal-tag">derivation</span></summary>
  <div class="reveal-body" markdown="1">
Let two adjacent values be $v_1$ and $v_2 = v_1(1+r)$, where $r$ is the true relative change. On an axis with floor $y_0 < v_1$, the rendered bar heights are $h_1 = v_1 - y_0$ and $h_2 = v_2 - y_0$. The *visual* relative change a reader perceives is

$$r_{\text{visual}} = \frac{h_2}{h_1} - 1 = \frac{v_2 - v_1}{v_1 - y_0} = r \cdot \frac{v_1}{v_1 - y_0}$$

The factor $\dfrac{v_1}{v_1-y_0}$ is the exact distortion multiplier, and it depends only on how close the floor sits to the data, not on anything about the true change itself. With $v_1 = 99$ (Q3) and $y_0 = 90$: $\frac{99}{99-90} = 11$, so a true 4.0% change is rendered as $4.0\% \times 11 \approx 44\%$ — matching the widget exactly. At $y_0 = 97$: $\frac{99}{99-97} = 49.5$, giving $4.0\% \times 49.5 \approx 200\%$. The multiplier grows without bound as the floor approaches the data — there is no fixed "how bad is too bad," only a factor that keeps climbing.
  </div>
</details>

## What this means in practice

A non-zero axis is not always dishonest — a line chart of a stock index or a physiological measurement that never approaches zero can reasonably zoom into the range where the actual variation lives, and error bars or confidence bands are routinely (and legitimately) shown on a zoomed axis. The line is intent and disclosure: a zoomed axis presented as a zoomed axis, with the floor labelled and the reason stated, is a legitimate design choice. A zoomed axis that lets a bar chart's height imply proportionality it doesn't have is the same technique used to mislead.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Where this bites</span>
Bar charts and area charts encode value as <strong>length from a baseline</strong> — the reader's visual system assumes that baseline is zero unless told otherwise, so truncating it breaks the encoding's basic promise. Line charts are read more by slope than by absolute height, so the same truncation is less severe there, though a steep-looking line on a truncated axis still overstates volatility. When in doubt: default axes to zero for anything encoded as bar height or area, and reserve zoomed axes — clearly labelled — for line charts where the reader's actual question is "how did this move," not "how big is this."
</div>

<details class="reveal reveal-recall">
  <summary>Why does a non-zero axis floor distort a bar chart more than it distorts a line chart?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Bar and area charts encode a value as length from a baseline, so the reader's visual system treats bar height as proportional to the value itself — an assumption that only holds when the baseline is zero. Line charts are read primarily by slope rather than absolute height, so a shifted floor is a milder distortion, though a very tight floor still exaggerates apparent volatility.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What does the distortion factor v₁/(v₁−y₀) tell you, and what happens to it as the axis floor approaches the data?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
It's the exact multiplier between the true relative change and the visually perceived relative change on a chart with axis floor y₀. As y₀ approaches v₁ (the floor gets closer to the smallest value being plotted), the denominator shrinks toward zero and the distortion factor grows without bound — there's no natural ceiling on how misleading a truncated axis can be made.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Is a non-zero y-axis always a red flag?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
No — a zoomed axis can be a legitimate choice, particularly for line charts where the reader cares about the shape of movement rather than absolute magnitude, provided the floor is clearly labelled and the zoom is disclosed rather than hidden. The problem isn't truncation itself, it's an undisclosed truncation on a chart type (bars, area) whose visual encoding implies proportionality to zero.
  </div>
</details>
