---
title: "Why your most 'central' node depends entirely on which centrality you pick"
topic: "Centrality"
module: "Network Analytics"
date: 2026-08-26
reading_time: 8
summary: "Degree centrality asks who has the most connections. Betweenness centrality asks who sits on the most shortest paths between everyone else. On the same graph, they can crown completely different nodes — and the one betweenness picks is often the one degree most badly underrates."
prerequisites: "What a graph, a node, an edge, and a shortest path are."
sources:
  - "Freeman, L. C. (1977), 'A Set of Measures of Centrality Based on Betweenness', <em>Sociometry</em> — the original formalisation."
  - "Newman, M. E. J., <em>Networks: An Introduction</em> — the standard modern reference on centrality measures."
---

Ask "which node is most central?" and you have already made a choice, whether you noticed or not. Two of the most common answers to that question — degree and betweenness — can point at completely different nodes on the exact same graph, and the disagreement is not a technicality. It is the difference between "who has the most friends" and "who is the only route between two groups of people."

## The setup

**Degree centrality** counts a node's direct neighbours — purely local, one pass over the edge list. **Betweenness centrality** counts how often a node sits on the shortest path between two *other* nodes, summed across every pair in the graph:

$$C_B(v) = \sum_{s \ne v \ne t} \frac{\sigma_{st}(v)}{\sigma_{st}}$$

where $\sigma_{st}$ is the number of shortest paths between $s$ and $t$, and $\sigma_{st}(v)$ is how many of those pass through $v$.

<div class="callout callout-key" markdown="1">
<span class="callout-label">The one thing to hold on to</span>
Degree only looks at a node's immediate neighbourhood. Betweenness looks at the node's position in the <strong>whole network's</strong> shortest-path structure. A node can be locally unremarkable — a handful of connections — while being globally load-bearing: the only route between two otherwise separate regions of the graph.
</div>

## A deliberately awkward graph

Two triangles, $\{A,B,C\}$ and $\{E,F,G\}$, joined by a single bridge node $D$:

$$A\!-\!B,\; A\!-\!C,\; B\!-\!C,\quad C\!-\!D,\; D\!-\!E,\quad E\!-\!F,\; E\!-\!G,\; F\!-\!G$$

| Node | Degree | Betweenness |
|---|---|---|
| A, B, F, G | 2 | 0 |
| C, E | **3** | 8 |
| D | 2 | **9** |

By degree, C and E tie for most central, and D trails behind — the same as every peripheral node. By betweenness, **D wins outright**, ahead of C and E, despite having the *lowest* degree in the entire graph.

<div class="widget" data-widget="centrality-toggle">
  <div class="widget-head">
    <span class="widget-title">Node size · selected centrality measure</span>
    <span class="widget-readout" data-readout>Degree: C, E tied at 3</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Seven-node graph, two triangles joined by a bridge node, sized by the selected centrality measure"></canvas></div>
  <div class="widget-controls">
    <div class="recall-actions" data-toggle-group>
      <button type="button" class="recall-btn" data-measure="degree" aria-pressed="true">Degree</button>
      <button type="button" class="recall-btn" data-measure="betweenness" aria-pressed="false">Betweenness</button>
    </div>
  </div>
  <p class="widget-caption">Switch measures and watch D grow from the smallest node on the graph to the largest. Nothing about the graph changes — only the question being asked of it.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above carries the same argument.</p>
</div>

<details class="reveal">
  <summary>Why D scores 9 and C, E score 8<span class="reveal-tag">counting argument</span></summary>
  <div class="reveal-body" markdown="1">
D is a **cut vertex**: removing it disconnects the graph into two triangles. Every shortest path between a node in $\{A,B,C\}$ and a node in $\{E,F,G\}$ — nine such pairs — must pass through D, giving it a betweenness of exactly 9.

C is intermediate on eight of those same paths (every cross-cluster path that starts from A or B, plus D's own paths to A and B) but never on a path between C and the far cluster, since C is an endpoint there rather than an intermediate. E is symmetric with C by construction. The four peripheral nodes sit on no shortest path between any other two nodes at all — their triangle gives every pair inside it a direct one-step route, and they have no reason to appear on a path that doesn't involve them.
  </div>
</details>

## What this means in practice

D is exactly the profile a bridge or intermediary node has in a real network: a fraud ring's connective account between two otherwise-unrelated clusters of suspicious activity, or the one server whose failure splits a system in two. Degree centrality — the measure that's a single pass over the data and the first thing most people compute — would rank it as unremarkable. Betweenness is what finds it.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">Where this bites</span>
Betweenness is not free. Computing it exactly needs shortest paths between every pair of nodes — Brandes' algorithm, the standard exact method, runs in $O(VE)$ for an unweighted graph, against $O(V)$ for degree. On a graph with millions of nodes, exact betweenness is often impractical, and production systems reach for approximations or cheaper proxies instead. There is no single "right" centrality measure — the right one depends entirely on what "central" is supposed to mean for the question you're actually asking.
</div>

<details class="reveal reveal-recall">
  <summary>Why does node D have the highest betweenness despite having the lowest degree?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
D is a cut vertex — every shortest path between the two triangle clusters must pass through it. That places D on all 9 cross-cluster shortest paths, more than any other single node, even though D only has 2 direct neighbours.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What does it mean, structurally, for a node to have zero betweenness?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The node never lies on a shortest path between any other two nodes — removing it wouldn't change the shortest distance between anyone else in the graph. The four peripheral triangle nodes here all have betweenness zero.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why might a fraud-detection system care specifically about betweenness rather than degree?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
A high-betweenness, low-degree account is exactly the profile of a bridge connecting two otherwise-separate clusters of activity — the node degree centrality alone would rank as unremarkable, but that structurally matters most if you're trying to find the connective tissue between suspicious groups.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why is betweenness centrality more expensive to compute than degree centrality on a large graph?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Degree only requires counting each node's direct edges — one pass over the edge list. Betweenness requires computing shortest paths between every pair of nodes, a fundamentally larger computation: O(VE) for Brandes' algorithm on an unweighted graph, against O(V) for degree.
  </div>
</details>
