---
title: "Confidence lies about which products sell each other"
topic: "Market basket analysis"
module: "Retail Analytics"
date: 2026-08-26
updated: 2026-09-04
level: foundation
featured: false
index_order: 18
takeaway: "Confidence ignores how common the consequent already is; lift compares against that baseline."
source_schema: 2
reading_time: 7
summary: "Two cross-sell rules can post an identical 50% confidence and point in opposite directions. What separates them is the second item's own popularity, which confidence never divides out — and the standard correction for that is symmetric, so it ranks pairs, not directions."
prerequisites: "Basic conditional probability."
sources:
  - id: agrawal-1993
    author: "Rakesh Agrawal, Tomasz Imieliński and Arun Swami"
    title: "Mining Association Rules Between Sets of Items in Large Databases"
    publication: "Proceedings of the 1993 ACM SIGMOD International Conference on Management of Data, 207–216; the ACM copy is subscription-gated"
    year: 1993
    url: "https://doi.org/10.1145/170035.170072"
    supports: "The original definition of an association rule as a directed implication from a set of items to a single item, the confidence factor as the fraction of the transactions satisfying the antecedent that also satisfy the consequent, support as the fraction of transactions satisfying the rule, and the paper's own list of queries, which asks for rules with a named item in the consequent and rules with a named item in the antecedent as two separate requests. The ACM copy returns 403 to automated clients; the text relied on here was read from the authors' own PDF preserved by the Internet Archive, and the bibliographic record was confirmed against Crossref."
  - id: brin-1997
    author: "Sergey Brin, Rajeev Motwani and Craig Silverstein"
    title: "Beyond Market Baskets: Generalizing Association Rules to Correlations"
    publication: "Proceedings of the 1997 ACM SIGMOD International Conference on Management of Data, 265–276; the ACM copy is subscription-gated"
    year: 1997
    url: "https://doi.org/10.1145/253260.253327"
    supports: "The proposal to replace confidence with the interest factor because of confidence's limitation. The ACM copy is gated and was not read, so this attribution is carried here through Tan, Steinbach, Karpatne and Kumar's bibliographic note, which names this paper as the source both of the interest factor and of the tea-and-coffee example; the pagination, authors and year were confirmed against Crossref."
  - id: tan-2019
    author: "Pang-Ning Tan, Michael Steinbach, Anuj Karpatne and Vipin Kumar"
    title: "Introduction to Data Mining, second edition, chapter 5: Association Analysis"
    publication: "Pearson; free chapter PDF published by the authors at the University of Minnesota"
    year: 2019
    url: "https://www-users.cse.umn.edu/~kumar001/dmbook/ch5_association_analysis.pdf"
    supports: "The definitions of support count, support and confidence used here; the statement that confidence measures the deviation of the joint support from the antecedent's support alone and so fails to account for the support of the consequent; the interest factor, which the chapter says is also called the lift; its three-way reading as independent, positively related or negatively related; and the tea-and-coffee and tea-and-honey contingency tables with their values of 0.9375 and 4.1667."
  - id: leskovec-mmds
    author: "Jure Leskovec, Anand Rajaraman and Jeffrey D. Ullman"
    title: "Mining of Massive Datasets, chapter 6: Frequent Itemsets"
    publication: "Cambridge University Press, third edition; free chapter PDF from the Stanford InfoLab, linked as chapter 6 from mmds.org"
    url: "http://infolab.stanford.edu/~ullman/mmds/ch6.pdf"
    supports: "The observation that a high co-occurrence of bread and milk is of little interest because both items were already known to be popular individually; the substitution reading of a negative association, illustrated there with Coke and Pepsi; and this chapter's competing definition of interest as confidence minus the consequent's support, a difference rather than a ratio, which is why the word alone does not identify the measure."
---

"Half the customers who buy diapers also buy beer" is a sentence about diapers, and on its own it is evidence of nothing. The identical figure can describe a pairing that doubles a shopper's chance of buying beer or one that pushes it below what a randomly chosen shopper would do. Which of the two it is turns on a quantity the sentence never mentions: how often beer sells at all.

## One hundred baskets and two rules

Take the vocabulary in the order the field built it. A *transaction* is one basket, and $N$ is the total number of transactions. An *itemset* is any collection of items, and its **support** is the fraction of transactions containing it, written $s(X)$. An **association rule** $A \to B$ is a directed implication, and its **confidence** is the share of the transactions containing the antecedent $A$ that also contain the consequent $B$ [3](#source-tan-2019){: .source-ref}:

$$s(X) = \frac{\text{transactions containing } X}{N}, \qquad c(A \to B) = \frac{s(A, B)}{s(A)}.$$

Agrawal, Imieliński and Swami set both out in 1993, defining a rule as an implication from a set of items to a single item and its confidence factor $c$ as the property that at least a fraction $c$ of the transactions satisfying the antecedent also satisfy the consequent [1](#source-agrawal-1993){: .source-ref}. Neither definition refers to $s(B)$ at any point.

Here are 100 transactions with two rules read off them. Twenty baskets contain diapers, 25 contain beer, and 10 contain both; 40 contain bread, 60 contain milk, and 20 contain both.

| Rule | $s(A)$ | $s(B)$ | $s(A,B)$ | Confidence | Baskets expected if independent | Baskets observed |
|---|---|---|---|---|---|---|
| Diapers → Beer | 0.20 | 0.25 | 0.10 | **0.50** | 5 | 10 |
| Bread → Milk | 0.40 | 0.60 | 0.20 | **0.50** | 24 | 20 |

Both confidences are exactly $0.10/0.20 = 0.20/0.40 = 0.50$. The two right-hand columns are where they part. If diapers and beer were unrelated, the share of baskets holding both would be $0.20 \times 0.25 = 0.05$, so 5 baskets in 100; there are 10. If bread and milk were unrelated, the expected share would be $0.40 \times 0.60 = 0.24$, so 24 baskets; there are 20.

That comparison is the **interest factor**, which Tan, Steinbach, Karpatne and Kumar note is also called the **lift** [3](#source-tan-2019){: .source-ref}:

$$I(A,B) \;=\; \frac{s(A,B)}{s(A) \cdot s(B)} \;=\; \frac{c(A \to B)}{s(B)}.$$

It is the observed joint support divided by the support the two items would have shown under statistical independence, and it reads 1 when $A$ and $B$ are independent, above 1 when they are positively related and below 1 when they are negatively related [3](#source-tan-2019){: .source-ref}. Diapers and beer come out at $10/5 = 2.00$; bread and milk at $20/24 = 0.83$. Same confidence, opposite sides of one.

The correction is not new. Tan and colleagues attribute the proposal to use the interest factor, and the worked example that motivates it, to Brin, Motwani and Silverstein's 1997 paper [2](#source-brin-1997){: .source-ref}.

<div class="callout callout-note" markdown="1">
<span class="callout-label">The word "interest" names two different measures</span>
Tan and colleagues define interest as the <em>ratio</em> of observed to independent support, and say plainly that this is what is usually called lift [3](#source-tan-2019){: .source-ref}. Leskovec, Rajaraman and Ullman define the interest of a rule as the <em>difference</em> between its confidence and the fraction of baskets containing the consequent [4](#source-leskovec-mmds){: .source-ref}. Both compare a rule against the consequent's baseline; one divides and the other subtracts, and the two do not order a candidate list the same way. When a tool reports "interest", the number is not self-describing — check which of the two it computed.
</div>

## Swapping antecedent and consequent

Confidence has a direction because it divides by the antecedent's support. Read the same two pairs the other way round and the figures move:

| Rule | Confidence | Interest factor |
|---|---|---|
| Diapers → Beer | 0.50 | 2.00 |
| Beer → Diapers | $0.10/0.25 = 0.40$ | 2.00 |
| Bread → Milk | 0.50 | 0.83 |
| Milk → Bread | $0.20/0.60 = 0.33$ | 0.83 |

Confidence changed in both pairs. The interest factor did not change in either, and it cannot: its denominator $s(A) \cdot s(B)$ is symmetric in the two items, so the measure is a property of the pair rather than of the arrow drawn through it.

<details class="reveal">
  <summary>Why the two directions give the same interest factor<span class="reveal-tag">7 lines</span></summary>
  <div class="reveal-body" markdown="1">
Write both directions out from the definition:

$$I(A,B) = \frac{c(A \to B)}{s(B)} = \frac{s(A,B)}{s(A)\,s(B)}, \qquad I(B,A) = \frac{c(B \to A)}{s(A)} = \frac{s(B,A)}{s(B)\,s(A)}.$$

The joint support $s(A,B)$ counts baskets holding both items, so it does not depend on the order the two are written in, and multiplication commutes. The two expressions are one expression.

Confidence keeps its direction for the opposite reason. Dividing by $s(A)$ alone leaves the antecedent's own popularity in the answer, which is why beer → diapers reads 0.40 against diapers → beer's 0.50: beer is the commoner of the two items, so the same 10 shared baskets are a smaller share of them.
  </div>
</details>

The practical consequence is that a ranked list of interest factors is a list of pairs. Deciding which item goes on promotion and which one is expected to follow is a separate question, and the number will not answer it. Agrawal and colleagues treated the two directions as distinct from the start: the list of queries in their paper asks separately for rules with a named item as the consequent, which they suggest for planning how to boost that item's sales, and for rules with a named item in the antecedent, which they suggest for working out what is affected if the shop stops stocking it [1](#source-agrawal-1993){: .source-ref}.

## The same confidence at every baseline

Hold confidence fixed at 0.50 and let the consequent's support run. Because $I = c/s(B)$, the whole curve is a single division, and it crosses 1 exactly where $s(B) = 0.50$: an item that appears in half of all baskets and in half of the baskets containing $A$ has been told nothing by $A$.

<div class="widget" data-widget="basket-lift">
  <div class="widget-head">
    <span class="widget-title">Lift · baseline support of B (confidence fixed at 50%)</span>
    <span class="widget-readout" data-readout>support(B) = 0.25   lift = 2.00×</span>
  </div>
  <div class="widget-canvas-wrap"><canvas role="img" aria-label="Lift falling as B's baseline popularity rises, crossing the independence line of 1.0 at support 0.5"></canvas></div>
  <div class="widget-controls">
    <div class="widget-row">
      <label for="lift-supp">supp(B)</label>
      <input type="range" id="lift-supp" min="5" max="90" step="1" value="25">
    </div>
  </div>
  <p class="widget-caption">Horizontal axis: the consequent's support, running from 0.05 to 0.90; vertical axis: lift, with gridlines at 2×, 4×, 6×, 8× and 10× and a dashed line marking independence at 1×. Both quantities are unitless. Confidence is pinned at 0.50 throughout, so every movement on the chart comes from the consequent's own popularity. At the slider's left-hand limit lift reads 10.00×, at 0.50 it reads 1.00×, and at the right-hand limit 0.56×.</p>
  <p class="widget-noscript">This figure needs JavaScript. Lift here is 0.50 divided by the support shown on the slider, and the table above gives two fixed points on that curve, at 0.25 and 0.60.</p>
</div>

The curve bends hardest at the left because division does. Halving the baseline from 0.20 to 0.10 takes lift from 2.50× to 5.00×, while halving it from 0.80 to 0.40 moves it only from 0.63× to 1.25×. Rare consequents are where a fixed confidence figure buys the most, and they are also where the estimate rests on the fewest baskets. A pair in which each item appears in 1% of baskets and the two co-occur in 1% of baskets gives $0.01/(0.01 \times 0.01) = 100$. A lift of 100 computed from a single basket is arithmetic, not evidence.

## From a rule list to a shelf plan

Sorting candidate rules by confidence favours consequents that were already common, because a popular item co-occurs with almost anything at a high rate. Tan and colleagues make this concrete with a table of 1,000 beverage drinkers. The rule {Tea} → {Coffee} has support 15% and confidence 75%, which looks respectable, but 80% of everyone in the table drinks coffee, so knowing that a person drinks tea *lowers* their chance of drinking coffee from 80% to 75%; the interest factor is $0.15/(0.2 \times 0.8) = 0.9375$ [3](#source-tan-2019){: .source-ref}. The failure runs in the other direction too. {Tea} → {Honey} has a confidence of 50%, low enough to be discarded by a 70% threshold, and yet only 12% of the group uses honey at all, so its interest factor is $0.1/(0.12 \times 0.2) = 4.1667$ [3](#source-tan-2019){: .source-ref}. Confidence rejects the informative rule and keeps the misleading one.

Leskovec, Rajaraman and Ullman put the same point in market-basket terms: a search for frequent itemsets will report that many people buy bread and milk together, and that is of little interest, because both were already known to be popular individually [4](#source-leskovec-mmds){: .source-ref}. Their example of a negative association is Coke and Pepsi, where people tend to prefer one or the other [4](#source-leskovec-mmds){: .source-ref}. That substitution reading is the one to reach for first when a lift below 1 turns up between two items in the same category, as it does for bread and milk here.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">What a lift above one still does not establish</span>
The interest factor compares an observed co-occurrence with the co-occurrence expected under independence, and that is the whole of its content [3](#source-tan-2019){: .source-ref}. It does not say the antecedent caused the consequent, because it is symmetric and a symmetric measure cannot carry a direction. It does not say the effect is large in money, because a pair can sit several times above chance while appearing in a handful of baskets. And it does not say the association would survive an intervention: moving diapers next to beer changes the shopping trip that generated the data, and the rule was estimated on trips where the two sat apart.
</div>

<details class="reveal reveal-recall">
  <summary>Two rules have the same 50% confidence, one with lift 2.00 and one with lift 0.83. Which single quantity separates them?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The consequent's own support. Because lift equals confidence divided by $s(B)$, a rarer consequent lifts the ratio above 1 and a commoner one drags it below, with confidence held fixed. In the table, beer's 0.25 gives 2.00 and milk's 0.60 gives 0.83.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A colleague ranks cross-sell candidates by lift and asks which item to put on promotion. What is wrong with the question?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Lift is symmetric, so it scores the pair rather than either arrow through it: diapers → beer and beer → diapers both read 2.00. Confidence does separate the two directions, 0.50 against 0.40, but only because it leaves the antecedent's popularity in the answer. Which item leads has to come from the decision — what is being discounted, what is being delisted — rather than from the ranking.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>A rule pairs two items that each appear in 1% of baskets and co-occur in 1% of baskets. Its lift is 100. Why is that not a finding?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the ratio can be enormous while the counts behind it are tiny. Independence predicts $0.01 \times 0.01 = 0.0001$ of baskets, so one in 10,000; one in 100 is a hundred times that, and in a 100-transaction file it is a single basket. Lift measures how far a co-occurrence sits from the independence baseline, not how much of the trade it accounts for, which is why a support threshold is applied before the ratio is read.
  </div>
</details>
