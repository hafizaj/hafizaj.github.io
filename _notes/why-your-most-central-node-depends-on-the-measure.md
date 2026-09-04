---
title: "Betweenness and degree can crown different nodes on the same graph"
topic: "Centrality"
module: "Network Analytics"
date: 2026-08-26
updated: 2026-09-04
reading_time: 8
level: foundation
featured: false
index_order: 5
source_schema: 2
takeaway: "The most important node changes when the question changes from reach to brokerage."
summary: "Degree centrality asks who has the most connections. Betweenness centrality asks who sits on the most shortest paths between everyone else. On the same graph, they can crown completely different nodes — and the one betweenness picks is often the one degree most badly underrates."
prerequisites: "What a graph, a node, an edge, and a shortest path are."
sources:
  - id: freeman-1977
    author: "Linton C. Freeman"
    title: "A Set of Measures of Centrality Based on Betweenness"
    publication: "Sociometry 40(1), 35–41"
    year: 1977
    url: "https://doi.org/10.2307/3033543"
    supports: "The original definition of betweenness centrality as a sum of shortest-path shares over pairs of other nodes."
  - id: brandes-2001
    author: "Ulrik Brandes"
    title: "A Faster Algorithm for Betweenness Centrality"
    publication: "Journal of Mathematical Sociology 25(2), 163–177; author's copy free from the University of Konstanz"
    year: 2001
    url: "https://www.uni-konstanz.de/algo/publications/b-fabc-01.pdf"
    supports: "The formal statement of the betweenness index, the treatment of tied shortest paths, the convention of normalising to the interval zero to one, and the running time and space of exact computation."
  - id: networkx-betweenness
    organisation: "NetworkX project"
    title: "betweenness_centrality — NetworkX documentation"
    publication: "NetworkX reference, algorithms, centrality"
    url: "https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.betweenness_centrality.html"
    supports: "The convention that an undirected graph counts each pair of nodes once, and the resulting normalisation divisor used for the values in this note."
---

Run two standard centrality measures over the same small graph and they will not agree on which node matters most. Degree centrality picks C and E. Betweenness centrality picks D, which ties for the *lowest* degree in the graph. Nothing about the graph changes between those two answers. What changes is the question, from "who has the most connections" to "who stands between everyone else."

## Counting neighbours and counting routes

**Degree centrality** counts a node's direct neighbours. It is local, it needs one pass over the edge list, and it treats every connection as equivalent.

**Betweenness centrality** asks a global question: across all pairs of other nodes, how often does this node sit on a shortest path between them? Writing $\sigma_{st}$ for the number of shortest paths between $s$ and $t$, and $\sigma_{st}(v)$ for how many of those pass through $v$ [2](#source-brandes-2001){: .source-ref}:

$$C_B(v) = \sum_{\substack{s < t \\ s \ne v \ne t}} \frac{\sigma_{st}(v)}{\sigma_{st}}$$

The ratio, rather than a plain count, is how tied paths are handled. When a pair of nodes is joined by three shortest paths of equal length and $v$ lies on one of them, $v$ receives $1/3$ rather than 1, so the credit for that pair totals one however it is split. The graph below has no ties at all: every pair of its nodes is joined by exactly one shortest path, so every share is either 0 or 1.

## Which pairs get counted

The sum above runs over unordered pairs, $s < t$, which is the convention Freeman's original formulation uses for an undirected graph and the one behind every number in this note [1](#source-freeman-1977){: .source-ref}. Brandes states the same index as a sum over ordered pairs, $s \ne v \ne t$, which visits $\{s,t\}$ and $\{t,s\}$ separately and therefore returns exactly twice these values on an undirected graph [2](#source-brandes-2001){: .source-ref}.

Software resolves this explicitly rather than leaving it to the reader. NetworkX counts each pair of nodes once on an undirected graph and divides by $(n-1)(n-2)/2$ when normalisation is requested [3](#source-networkx-betweenness){: .source-ref}. If a betweenness score looks twice as large as expected, the pair convention is the first thing to check, before the graph.

## Seven nodes, two rankings

The graph is two triangles, $\{A,B,C\}$ and $\{E,F,G\}$, joined through a single node $D$:

$$A\!-\!B,\; A\!-\!C,\; B\!-\!C,\quad C\!-\!D,\; D\!-\!E,\quad E\!-\!F,\; E\!-\!G,\; F\!-\!G$$

Degree is a count of edges; raw betweenness is a sum of shortest-path shares, whole numbers here because no pair has tied paths; normalised betweenness divides by $(n-1)(n-2)/2 = 15$ and is unitless.

| Node | Degree | Betweenness | Normalised |
|---|---|---|---|
| A, B, F, G | 2 | 0 | 0.000 |
| C, E | **3** | 8 | 0.533 |
| D | 2 | **9** | 0.600 |

By degree, C and E tie at the top and D is indistinguishable from the four peripheral nodes. By betweenness, D leads outright.

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
  <p class="widget-caption">Each node is drawn with its name above and the selected measure's value below, using the raw counts from the table: degree in edges, betweenness in shortest paths. Node radius scales with that value and the leading node or nodes are filled. Switching measures resizes D from one of the graph's five joint-smallest nodes to the largest.</p>
  <p class="widget-noscript">This figure needs JavaScript. The table above carries the same argument.</p>
</div>

<details class="reveal">
  <summary>Where D's 9 and C's 8 come from<span class="reveal-tag">counting argument</span></summary>
  <div class="reveal-body" markdown="1">
D is a **cut vertex**: delete it and the graph falls into two disconnected triangles. Every path from $\{A,B,C\}$ to $\{E,F,G\}$ therefore runs through D. There are $3 \times 3 = 9$ such pairs, each with a single shortest path, so $C_B(D) = 9$.

C picks up two kinds of pair. It is the only route from A or B to D, giving 2. It is also on the unique shortest path from A or B to each of E, F and G, giving 6 more. That totals 8. C never appears as an intermediate on a path that starts or ends at C, and it is not needed for the pair $\{A, B\}$, which has a direct edge. E is the mirror image of C.

The four peripheral nodes score zero. Inside a triangle every pair already has a one-step route, so no peripheral node is ever needed as an intermediate, and no path between the clusters is routed through them.
  </div>
</details>

## Picking the measure the question needs

D has the profile of an intermediary: few connections, but the only route between two otherwise separate regions. Any question shaped like "what breaks this network in two" or "which account connects two clusters that otherwise never touch" is a betweenness question, and degree centrality would rank D as unremarkable. Questions shaped like "who reaches the most others directly" are degree questions, and betweenness has nothing to say about them.

The cost differs as sharply as the answers. Degree for every node is one pass over the edge list. Exact betweenness needs shortest paths between all pairs; Brandes's algorithm computes it in $O(nm)$ time and $O(n+m)$ space for an unweighted graph with $n$ nodes and $m$ edges, an improvement on the $O(n^3)$ time and $O(n^2)$ space that earlier standard implementations required [2](#source-brandes-2001){: .source-ref}. On graphs with millions of nodes even $O(nm)$ is often out of reach, which is why production systems reach for sampled approximations.

<details class="reveal reveal-recall">
  <summary>Why does D have the highest betweenness despite having the joint lowest degree?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
D is a cut vertex, so every shortest path between the two triangles passes through it. That is all nine cross-cluster pairs, more than any other node collects, even though D has only two neighbours. Degree cannot see this because it never looks beyond a node's immediate neighbourhood.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A pair of nodes has four shortest paths and this node lies on one. What does the pair contribute?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
One quarter, because the contribution is σ<sub>st</sub>(v)/σ<sub>st</sub> rather than a plain count. Splitting the credit this way keeps each pair worth a total of 1 across all the intermediates on its shortest paths.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A library reports betweenness values twice as large as yours. What is the likely cause?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The pair convention. Summing over ordered pairs on an undirected graph visits each pair twice and doubles every score against Freeman's unordered-pair definition. Checking whether the implementation halves its totals, or normalises by (n−1)(n−2)/2 rather than (n−1)(n−2), resolves it.
  </div>
</details>
