---
title: "Before you build an agent, decide whether you should"
topic: "Field notes · AI Adoption Strategy"
module: "Azure AI Architecture"
style: editorial
provenance: professional
date: 2026-08-26
reading_time: 7
summary: "The Cloud Adoption Framework's AI strategy guidance exists because most failed AI projects don't fail on the model. They fail because nobody decided, before writing a line of code, whether the problem needed to be built, bought, or extended."
sources:
  - "Microsoft Learn, Cloud Adoption Framework, <em>AI strategy — guidance to set your organization's AI strategy</em>."
  - "Microsoft Learn, Cloud Adoption Framework, <em>Plan for AI adoption</em>."
---

Every architecture design session I've sat in has the same early moment: someone asks what the agent should do, and the room jumps straight to how. Which model, which orchestration pattern, which tools. Nobody has yet asked whether the use case needs a custom-built agent at all, and that question, asked late or not at all, is where a lot of AI budget quietly disappears.

The Cloud Adoption Framework's AI strategy guidance is Microsoft's answer to that ordering problem: decide the *what* and the *how much customisation* before the *how*.

## Four ways to get the same capability

The framework's real contribution isn't a checklist, it's a reframe: build, buy, and extend aren't three competing philosophies, they're four points on a single spectrum that trades customisation for simplicity.

<div class="callout callout-note" markdown="1">
<span class="callout-label">The spectrum</span>
At one end sits a fully custom-built agent — maximum control, maximum engineering cost, maximum ongoing ownership. At the other end sits an out-of-the-box Copilot capability you turn on. In between sit two more pragmatic options: extending an existing Copilot with your own data and tools, or buying a vertical AI product built by someone who's already solved your specific problem for other customers.
</div>

Most teams default to the build end of that spectrum because it's the most visible way to demonstrate technical capability. It's rarely the right default. A custom agent is the correct answer when the use case is genuinely differentiating — something a competitor buying the same off-the-shelf tool couldn't replicate. For everything else, the honest question is whether you're solving a problem or building a monument to the fact that you could.

> The build option is the only one on the spectrum where the six-month maintenance bill shows up after the demo, not before it.

## Scoring the use case before scoring the vendor

Before any build-versus-buy conversation is useful, the framework pushes you to score the use case itself on a small number of axes: business impact, technical complexity, resource requirements, and how tightly it aligns with where the organisation is actually trying to go. That last one matters more than it sounds — a technically elegant agent that automates a process the business is planning to retire in eight months is still a bad investment, however well it's built.

This scoring step is also where the ROI conversation should actually happen, not after the agent is built and someone asks why it hasn't paid for itself. High business impact plus low technical complexity is the use case you ship first; it's the fastest path to a credible internal reference before you ask for budget on something harder.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The sequencing mistake</span>
Doing the build-vs-buy analysis before the impact-vs-complexity scoring gets the order backwards. You end up optimising the delivery approach for a use case that never should have been prioritised in the first place. Score the use case first; let that score constrain which points on the build-buy-extend spectrum are even worth evaluating.
</div>

## What this looks like in a real design session

In practice, this means the first slide in an AI architecture conversation shouldn't be an architecture diagram. It should be the use case's score against those four axes, and a one-line justification for where it sits on the build-buy-extend spectrum. Everything in the notes on [Microsoft Foundry](/notes/microsoft-foundry-one-platform-not-three-products/) and [multi-agent orchestration](/notes/copilot-studio-multi-agent-orchestration-a2a-mcp/) only becomes relevant once that first slide has actually been agreed on. Skip it, and you can still ship a technically correct agent for a use case that was never worth building in the first place.

<details class="reveal reveal-recall">
  <summary>What are the four points on the Cloud Adoption Framework's build-vs-buy spectrum?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Fully custom build, extend an existing Copilot with your own data and tools, buy a vertical AI product, or adopt an out-of-the-box Copilot capability — trading customisation for simplicity as you move along the spectrum.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does use-case scoring need to happen before the build-vs-buy decision?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the delivery approach should be constrained by the use case's business impact, complexity, and strategic alignment — deciding how to build before deciding whether the use case deserves it risks polishing the delivery of something that shouldn't have been prioritised.
  </div>
</details>
