---
title: "Copilot Studio didn't need a new protocol until agents had to talk to each other"
topic: "Field notes · Multi-Agent Systems"
module: "Azure AI Architecture"
style: editorial
provenance: professional
date: 2026-08-26
updated: 2026-09-04
reviewed_on: 2026-09-04
reading_time: 8
level: applied
featured: false
index_order: 4
source_schema: 2
takeaway: "MCP connects an orchestrator to tools; A2A coordinates agents across a separate trust boundary."
summary: "Both are open protocols with published specifications, and the A2A project describes the two as complementary rather than competing. The design question is not which one wins. It is which boundary a step in your flow crosses, and who is accountable on the far side."
sources:
  - id: mcp-specification
    organisation: "Model Context Protocol project"
    title: "Specification"
    publication: "Revision 2026-07-28"
    url: "https://modelcontextprotocol.io/specification/2026-07-28"
    supports: "The definition of MCP as an open protocol between LLM applications and external data and tools, the host-client-server roles, the server features (resources, prompts, tools) and client feature (elicitation), the optional opt-in extensions defined beyond the core protocol (Tasks, Skills over MCP, MCP Apps) and their negotiation requirement, and the security principles on user consent and untrusted tool descriptions."
  - id: mcp-architecture
    organisation: "Model Context Protocol project"
    title: "Architecture overview"
    publication: "Model Context Protocol documentation"
    url: "https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture"
    supports: "One client per server inside a host, the JSON-RPC 2.0 data layer, the deprecation of sampling at revision 2026-07-28, the statement that optional extensions build on the core protocol with the Tasks extension's durable handles as the worked example, and the explicit statement that MCP covers context exchange and does not dictate how an application uses its model."
  - id: a2a-specification
    organisation: "A2A Project"
    title: "Agent2Agent (A2A) Protocol Specification"
    publication: "Version 1.0.0"
    url: "https://a2a-protocol.org/v1.0.0/specification/"
    supports: "The definition of A2A as a standard for independent, potentially opaque agent systems, the goal of exchanging information without access to another agent's internal state, memory, or tools, the opaque-execution principle, and the reuse of HTTP, JSON-RPC 2.0, and Server-Sent Events."
  - id: a2a-what-is
    organisation: "A2A Project"
    title: "What is A2A?"
    publication: "a2a-protocol.org"
    url: "https://a2a-protocol.org/latest/topics/what-is-a2a/"
    supports: "The project's own comparison with the Model Context Protocol, the framing of the two as complementary, and the argument that wrapping an agent as a tool fails to capture what it can do."
  - id: copilot-studio-mcp
    organisation: "Microsoft"
    title: "Extend your agent with Model Context Protocol"
    publication: "Microsoft Learn"
    url: "https://learn.microsoft.com/microsoft-copilot-studio/agent-extend-action-mcp"
    supports: "What a Copilot Studio agent gains from a connected MCP server, the documented limitation to tools and resources, dynamic reflection of server-side changes, and the generative orchestration prerequisite."
  - id: copilot-studio-a2a
    organisation: "Microsoft"
    title: "Connect to an agent over the Agent2Agent (A2A) protocol"
    publication: "Microsoft Learn"
    url: "https://learn.microsoft.com/microsoft-copilot-studio/add-agent-agent-to-agent"
    supports: "The A2A connection flow and agent card lookup, the supported authentication options, the routing table for alternative integration patterns, and the responsibilities Microsoft assigns to whoever connects an external agent."
  - id: copilot-studio-multi-agent
    organisation: "Microsoft"
    title: "Multi-agent orchestration patterns and best practices"
    publication: "Microsoft Learn"
    url: "https://learn.microsoft.com/microsoft-copilot-studio/guidance/multi-agent-patterns"
    supports: "The distinction between inline and connected agents, the context-inclusion behaviour of each, the three tests for separating an agent, and the documented advice to start with one agent."
---

Here is the question that decides the design, and it is not "how many agents does this need." Take any single step in a flow and ask: is it fetching something that will not decide anything, or handing work to something that will? Copilot Studio answers those two with different mechanisms, and choosing the wrong one is expensive in ways that surface late.

Both mechanisms rest on open protocols with published specifications, so it is worth defining them from those rather than from the marketing.

The **Model Context Protocol (MCP)** is an open protocol for integrating large language model (LLM) applications with external data sources and tools. Its specification defines three roles: *hosts*, the LLM applications that initiate connections; *clients*, the connectors inside a host; and *servers*, the services that provide context and capabilities. Messages are JSON-RPC 2.0 [1](#source-mcp-specification){: .source-ref}. Inside a host, one client is created per server, each holding its own connection [2](#source-mcp-architecture){: .source-ref}.

The **Agent2Agent (A2A) protocol** is an open standard for communication between independent, potentially opaque agent systems built on different frameworks, in different languages, or by different vendors. Its stated goals are letting agents discover each other's capabilities, negotiate how they will exchange text, files, or structured data, manage collaborative tasks, and do all of that *without needing access to each other's internal state, memory, or tools* [3](#source-a2a-specification){: .source-ref}.

## What the MCP core protocol standardises, and what extensions add

The load-bearing part of the MCP core protocol is the small set of features each side may offer. Servers offer **resources** (context and data for the user or the model), **prompts** (templated messages and workflows for users), and **tools** (functions for the model to execute) [1](#source-mcp-specification){: .source-ref}.

It is tempting to compress this into "nothing on the far end of an MCP connection ever makes a decision." The specification does not support the categorical version. Clients may offer servers a feature of their own — **elicitation**, server-initiated requests for additional information from users [1](#source-mcp-specification){: .source-ref}. A second server-initiated capability, sampling, let a server request model completions from the host application; it is deprecated as of revision `2026-07-28`, with new implementations directed to integrate with model provider application programming interfaces (APIs) directly [2](#source-mcp-architecture){: .source-ref}.

The defensible statement is narrower and more useful. Across those core primitives, MCP standardises *what context and capabilities are offered and how they are described*, and it leaves planning to the host: the architecture documentation says outright that MCP covers the protocol for context exchange and does not dictate how an application uses its model or manages what it receives [2](#source-mcp-architecture){: .source-ref}. On the core surface the far side can expose a tool and can ask the user a question; what a resource, prompt, or tool call does not carry is a goal for the server to pursue on its own.

That is a claim about the core protocol, and only about it. The specification goes on to define optional **extensions** beyond the core, adding modular, specialised, or experimental functionality; they are always opt-in and require explicit support from both client and server, negotiated during initialisation. The three it singles out each widen the surface in a different direction: **Tasks** covers asynchronous execution of long-running operations with polling, mid-flight input, and durable handles; **Skills over MCP** covers rich, structured instructions for agent workflows, discovered and consumed through MCP; and **MCP Apps** covers interactive interface elements such as charts, forms, and video players rendered inline in a conversation [1](#source-mcp-specification){: .source-ref}. The architecture overview describes the same arrangement from the other side, noting that extensions build on the core protocol and using Tasks as its example: a server returns a durable handle for a long-running request that the client polls for later [2](#source-mcp-architecture){: .source-ref}. So the scope has to be stated rather than assumed. Describe the core protocol and the tool-shaped boundary holds; negotiate the extensions and long-running work, structured instructions, and user-facing surfaces come with them.

The specification also refuses to treat the host-to-server boundary as safe by default. Its trust-and-safety principles state that hosts must obtain explicit user consent before invoking any tool, that tools represent arbitrary code execution and should be treated with caution, and that tool descriptions and annotations should be considered untrusted unless they come from a trusted server. It is equally candid that MCP cannot enforce any of this at the protocol level; the obligation falls on implementors [1](#source-mcp-specification){: .source-ref}. "Just a tool call" is a statement about control flow, not about risk.

<div class="callout callout-note" markdown="1">
<span class="callout-label">What Copilot Studio actually accepts from an MCP server</span>
Connecting a server exposes its tools and resources to the agent, with the server supplying each item's name, description, inputs, and outputs, and changes on the server reflected without rewiring the agent. Two constraints are documented and easy to miss: Copilot Studio currently supports MCP tools and resources — not prompts — and generative orchestration must be turned on before MCP can be used at all [5](#source-copilot-studio-mcp){: .source-ref}.
</div>

## A2A, and the principle of opaque execution

A2A reuses ordinary web machinery — HTTP, JSON-RPC 2.0, and Server-Sent Events — and is asynchronous by design, built for tasks long enough that neither side stays continuously connected, including ones that pause for a human [3](#source-a2a-specification){: .source-ref}.

Its distinguishing principle is *opaque execution*: agents collaborate on declared capabilities and exchanged information, without exposing their internal reasoning, plans, or tool implementations [3](#source-a2a-specification){: .source-ref}. That is the substantive difference from MCP, and the A2A project draws the comparison itself rather than leaving it to interpretation. MCP's focus is reducing the complexity of connecting agents to tools and data, where tools are typically stateless and perform specific, predefined functions. A2A's focus is letting agents communicate as agents instead of being constrained to tool-shaped interactions, supporting multi-turn exchanges in which they reason, plan, and delegate. The project positions A2A as complementary to MCP, and argues explicitly that wrapping an agent as a tool fails to capture what that agent can do [4](#source-a2a-what-is){: .source-ref}.

> The A2A project describes the two protocols as complementary rather than competing. The argument worth having in a design review is therefore not which protocol is better — it is which boundary a given step actually crosses.

In Copilot Studio, an A2A connection is created by adding an A2A agent and supplying the endpoint used for communication with it. If that agent publishes a valid agent card at the standard well-known location, its name and description are pulled in automatically; otherwise you write a description good enough for the calling agent to know when to use it. Authentication is none, an API key, or OAuth 2.0. The documented outcome is that Copilot Studio can delegate a task to another agent rather than only call an API, which is the reason the mechanism exists at all [6](#source-copilot-studio-a2a){: .source-ref}.

<div class="callout callout-warn" markdown="1">
<span class="callout-label">The bill for the second reasoning layer is written down</span>
Microsoft places responsibility for a connected external agent on whoever connects it: that data flows, handling, and sharing between the agents suit the use case and meet relevant requirements and law; that the agent meets appropriate quality, reliability, security, and trustworthiness standards; that permissions, boundaries, and approvals are provisioned where prudent; and that observability, identity and traceability, and human oversight are in place [6](#source-copilot-studio-a2a){: .source-ref}. A tool call carries obligations of its own, as the MCP specification is at pains to say. What it does not carry is accountability for a second party's judgement, and that is the line this list is drawn along.
</div>

## The Copilot Studio decision, narrowed

The A2A article carries a routing table that settles most of the confusion without a judgement call. APIs or basic HTTP services go to custom connectors or HTTP tools. MCP tools or resources go to an MCP server. Agents built with the Microsoft 365 Agents SDK go over the Activity Protocol. A2A connections are for agents that already implement A2A — typically built on external frameworks, hosted outside Copilot Studio, or carrying their own domain-specific reasoning or workflows. These are not mutually exclusive: several integration models can coexist inside one agent [6](#source-copilot-studio-a2a){: .source-ref}.

The restraint guidance sits in a different article and is blunter. Do not create a separate agent for every subtask. Separate one only if the subtask is complex enough to warrant its own tools or knowledge, needs different governance or access controls than the parent, or is reusable across many parent agents. If none of those hold, an inline agent — a small reusable workflow inside the same agent, which always receives the parent's context — will usually do. Separate agents cost execution time through context switching and add the overhead of maintaining more than one agent, and a connected agent has a context-inclusion setting that decides whether it receives the conversation history at all, so that has to be checked rather than assumed. The stated advice is to start with one agent and split only when a real need for modularity, or a boundary a single agent should not cross, becomes visible [7](#source-copilot-studio-multi-agent){: .source-ref}.

<div class="callout callout-key" markdown="1">
<span class="callout-label">My working test, not documented Microsoft guidance</span>
I resolve this by asking what the far side is accountable for. If it is accountable for returning correct data, it is a tool, and an MCP server or a connector is the right shape. If it is accountable for judgement — deciding *how* to satisfy a request, in a way you would not want to specify step by step — it is an agent, and the trust boundary is real whether or not you formalise it with A2A. The documentation supplies the routing table and the separation tests; this phrasing is how I apply them, not a Microsoft recommendation.
</div>

The option skipped most easily is the one that needs no new protocol: everything fits inside a single well-scoped agent with its own tools and knowledge. That is the documented starting point [7](#source-copilot-studio-multi-agent){: .source-ref}, and it is a harder sell in a design deck than "multi-agent architecture" — which is a reason to be sceptical of the deck rather than of the guidance.

<details class="reveal reveal-recall">
  <summary>In the MCP core protocol, who coordinates, and what does the specification deliberately leave undefined?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
The host — the LLM application that initiates connections — coordinates, holding one client per server; servers offer resources, prompts, and tools. The protocol covers context exchange and does not dictate how the host uses its model or manages what it receives. Across those core primitives the far side can offer capabilities and can elicit input from the user, rather than receiving a goal of its own; that boundary is a property of the core protocol, and the optional opt-in extensions — Tasks, Skills over MCP, MCP Apps — widen it once both sides negotiate them. In Copilot Studio specifically, only tools and resources are supported, and generative orchestration must be switched on first.
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>What does A2A deliberately not require two agents to share, and what follows from that?<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">
Access to each other's internal state, memory, or tools — opaque execution is a guiding principle, so agents collaborate on declared capabilities and exchanged information alone. That is what allows the far agent to belong to a different framework, vendor, or organisation, and it is also why Copilot Studio assigns you responsibility for its data handling, quality, permissions, observability, and human oversight: you cannot inspect it, so you have to govern it.
  </div>
</details>
