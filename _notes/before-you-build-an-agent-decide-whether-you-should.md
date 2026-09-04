---
title: "Before you build an agent, decide whether you should"
topic: "Field notes · AI Adoption Strategy"
module: "Azure AI Architecture"
style: editorial
provenance: professional
date: 2026-08-26
updated: 2026-09-03
reviewed_on: 2026-09-03
reading_time: 7
level: foundation
featured: false
index_order: 2
source_schema: 2
takeaway: "Choose the least autonomous architecture that can complete the job reliably."
summary: "The Cloud Adoption Framework's AI strategy guidance exists because most failed AI projects don't fail on the model. They fail because nobody decided, before writing a line of code, whether the problem needed to be built, bought, or extended."
sources:
  - id: microsoft-ai-strategy
    organisation: "Microsoft"
    title: "AI strategy — Guidance to set your organization's AI strategy"
    publication: "Cloud Adoption Framework; continuously updated, read 4 September 2026"
    url: "https://learn.microsoft.com/azure/cloud-adoption-framework/ai/strategy"
    supports: "The sequence from use-case identification to technology choice and responsible adoption, and the four AI adoption models that trade customisation for simplicity: ready-to-use Copilots, low-code SaaS development, managed PaaS development, and Azure infrastructure."
  - id: microsoft-ai-plan
    organisation: "Microsoft"
    title: "Plan for AI adoption"
    publication: "Cloud Adoption Framework; continuously updated, read 3 September 2026"
    url: "https://learn.microsoft.com/azure/cloud-adoption-framework/ai/plan"
    supports: "Use-case prioritisation, proof-of-concept planning, skills, data, and responsible-AI readiness."
---

A procurement team wants faster answers to questions like "which of our supplier contracts renew in the next quarter, and which of those have penalty clauses?" That single request can be met four different ways, and the architecture question that decides cost, delivery date, and who maintains it for the next three years is not *which model* — it is whether this needs an agent at all.

Worth being precise about the word first. Throughout this note, an **agent** means a system that is given a goal rather than a fixed script, chooses its own sequence of steps, calls tools or data sources to carry them out, and decides when it is done. That autonomy is the expensive part: a system that plans its own steps needs guardrails, evaluation, and monitoring that a fixed retrieval-and-answer pipeline does not. A search box over the contract repository is not an agent. Neither is a summarisation prompt with one retrieval step.

Microsoft's Cloud Adoption Framework addresses this ordering problem directly: identify the use case and settle how much customisation it justifies before choosing the technology to deliver it [1](#source-microsoft-ai-strategy){: .source-ref}.

## Four ways to get the same capability

The framework's real contribution isn't a checklist, it's a reframe: build, buy, and extend aren't three competing philosophies. Microsoft sets out four AI adoption models that trade customisation for simplicity — ready-to-use Copilots, low-code SaaS development, managed PaaS development, and Azure infrastructure [1](#source-microsoft-ai-strategy){: .source-ref}. That makes them points on a single spectrum rather than rival camps.

<div class="callout callout-note" markdown="1">
<span class="callout-label">My restatement of the spectrum, not the framework's wording</span>
The framework names its four models after the platform layer you build on. I find the same spectrum easier to reason about in delivery terms. At one end sits a fully custom-built agent — maximum control, maximum engineering cost, maximum ongoing ownership. At the other end sits an out-of-the-box Copilot capability you turn on. In between sit two more pragmatic options: extending an existing Copilot with your own data and tools, or buying a vertical AI product built by someone who's already solved your specific problem for other customers. That last option is my own addition — buying a vendor product is not one of the framework's four models.
</div>

For the contract question above, all four are live options: a custom agent that plans its own multi-step search, a Copilot extended with the contract repository as a data source, a procurement-specific vendor product, or an out-of-the-box assistant pointed at the same documents.

<div class="callout callout-key" markdown="1">
<span class="callout-label">My own heuristic, not framework guidance</span>
The framework describes the spectrum and the scoring axes; it does not tell you where to land. The rule I apply on top of it is to choose the least autonomous architecture that can complete the job reliably, and to treat every step of added autonomy as a cost that the use case has to justify. Treat this as one practitioner's default, not documented Microsoft guidance.
</div>

Custom building is the most visible way to demonstrate technical capability, which makes it a tempting default. A custom agent earns its cost when the use case is genuinely differentiating — something a competitor buying the same off-the-shelf tool couldn't replicate. For everything else, the honest question is whether you're solving a problem or building a monument to the fact that you could.

> The build option is the only one on the spectrum where the six-month maintenance bill shows up after the demo, not before it.

## Scoring the use case before scoring the vendor

Before any build-versus-buy conversation is useful, the framework pushes you to score the use case itself on a small number of axes: business impact, technical complexity, resource requirements, and how tightly it aligns with where the organisation is actually trying to go [2](#source-microsoft-ai-plan){: .source-ref}. That last one matters more than it sounds — a technically elegant agent that automates a process the business is planning to retire in eight months is still a bad investment, however well it's built.

This scoring step is also where the ROI conversation should actually happen, not after the agent is built and someone asks why it hasn't paid for itself. High business impact plus low technical complexity is the use case you ship first; it's the fastest path to a credible internal reference before you ask for budget on something harder.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The sequencing mistake</span>
Doing the build-vs-buy analysis before the impact-vs-complexity scoring gets the order backwards. You end up optimising the delivery approach for a use case that never should have been prioritised in the first place. Score the use case first; let that score constrain which points on the build-buy-extend spectrum are even worth evaluating.
</div>

## What this changes about the first architecture conversation

Applied to the contract example, this means the opening artefact isn't an architecture diagram. It's the use case's score against those four axes, plus a one-line justification for where it sits on the build-buy-extend spectrum — and, if the answer is "agent", what the system is allowed to decide for itself. Everything in the notes on [Microsoft Foundry](/notes/microsoft-foundry-one-platform-not-three-products/) and [multi-agent orchestration](/notes/copilot-studio-multi-agent-orchestration-a2a-mcp/) only becomes relevant once that has been agreed. Skip it, and you can still ship a technically correct agent for a use case that was never worth building.

<details class="reveal reveal-recall">
  <summary>What distinguishes an agent from a retrieval-and-answer pipeline?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
An agent is given a goal rather than a fixed script: it chooses its own sequence of steps, calls tools or data sources to execute them, and decides when it is finished. A retrieval-and-answer pipeline follows a fixed sequence the designer chose in advance.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What four delivery options does this note place on the build-vs-buy spectrum?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Fully custom build, extend an existing Copilot with your own data and tools, buy a vertical AI product, or adopt an out-of-the-box Copilot capability — trading customisation for simplicity as you move along the spectrum. That framing is this note's restatement; the Cloud Adoption Framework's own four adoption models are ready-to-use Copilots, low-code SaaS development, managed PaaS development, and Azure infrastructure.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Why does use-case scoring need to happen before the build-vs-buy decision?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Because the delivery approach should be constrained by the use case's business impact, complexity, and strategic alignment — deciding how to build before deciding whether the use case deserves it risks polishing the delivery of something that shouldn't have been prioritised.
  </div>
</details>
