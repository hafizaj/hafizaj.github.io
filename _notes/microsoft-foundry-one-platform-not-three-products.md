---
title: "Microsoft Foundry is one platform pretending to be three products"
topic: "Field notes · Cloud Platform"
module: "Azure AI Architecture"
style: editorial
provenance: professional
date: 2026-08-26
updated: 2026-09-04
reviewed_on: 2026-09-04
reading_time: 7
level: foundation
featured: false
index_order: 3
source_schema: 2
takeaway: "Microsoft Foundry joins model, agent, tool, and evaluation work around shared project resources."
summary: "The overview page carries its own migration table, and it shows the rebrand moved more than a name: the resource model, the developer libraries, the agent interface, and the vocabulary all changed with it. That makes one platform a claim you can check."
sources:
  - id: foundry-overview
    organisation: "Microsoft"
    title: "What is Microsoft Foundry?"
    publication: "Microsoft Learn"
    url: "https://learn.microsoft.com/azure/foundry/what-is-foundry"
    supports: "The platform's stated scope — agents, models, and tools under a single management grouping with unified role-based access control, networking, and policies — the declarative-to-full-code build spectrum, the evolution table mapping previous concepts to current ones, and the preview status of parts of observability."
  - id: foundry-agent-service
    organisation: "Microsoft"
    title: "What is Microsoft Foundry Agent Service?"
    publication: "Microsoft Learn"
    url: "https://learn.microsoft.com/azure/foundry/agents/overview"
    supports: "The two agent types (prompt agents and hosted agents), the third build path through the Responses API and its ephemeral agents, the built-in and custom tool surfaces, and the runtime, identity, and networking capabilities attached to each."
  - id: foundry-toolbox
    organisation: "Microsoft"
    title: "What is Toolbox in Microsoft Foundry?"
    publication: "Microsoft Learn"
    url: "https://learn.microsoft.com/azure/foundry/agents/concepts/toolbox-overview"
    supports: "The problem Toolbox is documented to solve — per-agent tool wiring producing duplicated configuration, credentials, and governance — and the single MCP-compatible endpoint that replaces it."
  - id: foundry-control-plane
    organisation: "Microsoft"
    title: "What is Microsoft Foundry Control Plane?"
    publication: "Microsoft Learn"
    url: "https://learn.microsoft.com/azure/foundry/control-plane/overview"
    supports: "Cross-project inventory, observability, compliance, and security in one interface, and the prerequisites that gate the advanced governance features."
---

The most useful page in the Microsoft Foundry documentation for testing the claim in this note's title is not a marketing page. It is a table near the end of the overview, in a section headed "Evolution of Foundry", that sets each previous concept beside its current equivalent [1](#source-foundry-overview){: .source-ref}. Read it as a diff rather than a glossary and the question answers itself.

The rows that matter are not the brand ones. The resource model moved from a hub plus an Azure OpenAI resource plus Azure AI Services to a single Foundry resource containing projects. The software development kit (SDK) surface moved from several separate packages addressing five or more endpoints to one project client against a single project endpoint. The agent application programming interface (API) moved from the Assistants API to the Responses API, and the vocabulary moved with it — threads, messages, runs, and assistants became conversations, items, responses, and agent versions [1](#source-foundry-overview){: .source-ref}.

That is a consolidation. A rename does not change your resource topology or the number of endpoints your code has to know about.

## The consolidation, row by row

Microsoft describes the current platform as unifying agents, models, and tools under a single management grouping, with tracing, monitoring, evaluations, and enterprise setup configuration built in, managed through one set of role-based access controls, networking rules, and policies under a single Azure resource provider namespace [1](#source-foundry-overview){: .source-ref}.

Role-based access control (RBAC) is worth expanding here because it carries most of the weight. Read the resource-model row again: the previous shape put a hub, an Azure OpenAI resource, and Azure AI Services side by side, so the question "who can call this, and with what data" had three places to be answered. The current shape has one resource to answer it against. The documentation states the consolidation; the consequence for access reviews is my reading of it.

<div class="callout callout-note" markdown="1">
<span class="callout-label">The consolidation is not finished, and the docs say so</span>
Hub-based projects still exist and are reached through the Foundry (classic) portal, with new investment directed at Foundry projects in the new portal. Parts of observability — the built-in monitoring dashboards in particular — are still marked preview [1](#source-foundry-overview){: .source-ref}. "One platform" is the documented direction of travel and the current default, not a completed migration for everyone already running on the older shape.
</div>

## The build spectrum, in Microsoft's own terms

The documentation frames the build decision as a spectrum from declarative to full code rather than a menu of products [1](#source-foundry-overview){: .source-ref}[2](#source-foundry-agent-service){: .source-ref}. Three positions on it are documented, and the count is easy to get wrong.

A **prompt agent** is defined entirely by configuration: instructions, a model, and tools. You can author one interactively in the portal, or define it programmatically so that the definition sits in version control and moves through code review like anything else. Foundry hosts and runs it, and there is no application code or container to maintain [2](#source-foundry-agent-service){: .source-ref}.

A **hosted agent** is code you wrote, using Agent Framework, LangGraph, the OpenAI Agents SDK, the Anthropic Agent SDK, the GitHub Copilot SDK, or your own code with no framework at all. You ship it as a container image or a zip archive of source, and Foundry runs it with a managed endpoint, automatic scaling, a dedicated Microsoft Entra identity per agent, session-level state persistence, and end-to-end tracing [2](#source-foundry-agent-service){: .source-ref}.

The third path is calling the **Responses API** directly from code that already runs elsewhere. Microsoft's term for what that produces is an *ephemeral agent*: the instructions, tools, and model live in your application rather than as a persisted Foundry resource, so there is nothing to create, update, or delete on the platform side. You still get catalog models, platform tools, project-scoped data, On-Behalf-Of authentication, and project-level observability [2](#source-foundry-agent-service){: .source-ref}.

So the precise statement is two agent types and three ways to build. Prompt agents and hosted agents are the agent types; the Responses API is a build path that creates no agent resource at all [2](#source-foundry-agent-service){: .source-ref}. Blur that in a design document and you invite an argument about whether something "is" an agent, when the real question is only where its definition is stored.

## Where tools stopped being per-agent plumbing

Agents act through tools. Foundry ships built-in ones — web search, file search, a code interpreter, memory — and takes custom ones through functions, OpenAPI specifications, and Model Context Protocol (MCP) servers [2](#source-foundry-agent-service){: .source-ref}.

The more interesting move is what sits above them. A **toolbox** is a curated set of tools defined once and exposed through a single MCP-compatible endpoint that any agent or runtime can consume regardless of framework, with authentication, governance, and versioning handled centrally and tool implementations updatable without touching agent code [2](#source-foundry-agent-service){: .source-ref}[3](#source-foundry-toolbox){: .source-ref}.

The Toolbox documentation is unusually direct about the failure it is answering. When every agent wires its own tools, APIs, and MCP servers, each connection needs its own configuration, authentication, and governance — which produces duplicated effort, inconsistent behaviour, fragile deployments, and operational overhead that grows with the number of agents [3](#source-foundry-toolbox){: .source-ref}.

<div class="callout callout-key" markdown="1">
<span class="callout-label">My reading of the pattern, not documented Microsoft guidance</span>
If you want one piece of evidence for the "one platform, not three products" framing, I would pick Toolbox over the branding. Every row of the evolution table consolidates something that used to be duplicated per resource; Toolbox consolidates something that was duplicated per agent, which is the axis that actually scales badly. Treat that as one practitioner's emphasis — the documentation describes the capability, not this ranking of it.
</div>

## What the platform still doesn't decide

Above individual projects sits Foundry Control Plane, a single interface for inventory, observability, compliance, and security across agents, models, and tools from multiple projects, integrating Microsoft Defender, Microsoft Purview, and Microsoft Entra. Without it, that work happens through individual portal blades and per-project views. Its advanced governance features have prerequisites of their own — an AI gateway configured for the purpose, and appropriate subscription-level RBAC [4](#source-foundry-control-plane){: .source-ref}.

None of this answers the question that should come first. A consolidated platform removes seams between components; it does not tell you whether the use case justified an agent, or which of the three build paths its requirements actually point at. That decision is the subject of the note on [deciding whether to build an agent at all](/notes/before-you-build-an-agent-decide-whether-you-should/), and the boundary between calling a tool and delegating to another agent is the subject of the note on [multi-agent orchestration](/notes/copilot-studio-multi-agent-orchestration-a2a-mcp/).

<details class="reveal reveal-recall">
  <summary>Beyond the brand, name three things the move to Microsoft Foundry changed.<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The resource model (a hub plus Azure OpenAI plus Azure AI Services became one Foundry resource containing projects), the SDK and endpoint surface (several packages against five or more endpoints became one project client against a single project endpoint), and the agent API with its vocabulary (the Assistants API became the Responses API; threads, messages, runs, and assistants became conversations, items, responses, and agent versions).
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>How many agent types does Foundry Agent Service define, and what is the third build path?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Two agent types: prompt agents, defined by configuration and run for you, and hosted agents, your own code and framework run as a container with a managed endpoint and a dedicated Entra identity. The third build path is calling the Responses API directly from code you already run elsewhere, which produces an ephemeral agent whose definition lives in your application and creates no agent resource in Foundry.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What does a toolbox solve that per-agent tool wiring does not?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Wiring tools per agent means each one carries its own configuration, credentials, and governance, which duplicates effort and drifts as the agent count grows. A toolbox curates the set once and exposes it through a single MCP-compatible endpoint that any agent or runtime can consume, centralising authentication, governance, and versioning, so tool implementations can change without editing agent code.
  </div>
</details>
