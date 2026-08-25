# DRAFT — cashflow case study, architect depth

**This is a working draft, not publishable copy.** Everything in _italics_ is
already true on the live project page or the About page and can be lifted
as-is. Everything in `[[ ]]` is a blank only you can fill — do not publish
those sections with a guess in them, because they are exactly what an
interviewer will drill into.

Once the blanks are filled, this content slots into
`_projects/multi-market-cashflow-forecasting.md` under the headings shown.

---

## Constraints

Draft, from what the site already says plus the obvious pharma context:

- _Eight markets, each with its own currency, calendar, and reporting habits._
- _Three source systems already in place — SAP, BlackLine, Quantum — none of
  which were mine to replace._
- Finance close is a fixed deadline; the pipeline had to fit inside the cycle
  rather than extend it.
- `[[ Data residency / confidentiality rules that applied — did market data
  have to stay in-region? Was there a restriction on where the ETL could run? ]]`
- `[[ What you were NOT allowed to change — licences, existing BI estate,
  the close calendar, headcount? ]]`

## Key decisions

The highest-signal section on the page. Three candidates, each phrased the
right way — but the reasoning is yours, not mine:

1. **Chose a Python ETL layer over building inside the BI tool.**
   Because `[[ why — was it transformation complexity, testability, the number
   of source formats, reuse across markets? ]]`. The tradeoff was
   `[[ what you gave up — another runtime to operate? a skill dependency on
   the team? ]]`, acceptable because `[[ why ]]`.

2. **Chose batch over streaming.**
   `[[ Confirm this is even true. If the pipeline ran on the close cycle, the
   decision was probably "batch, aligned to close" — say what drove it:
   source system refresh rates? the close calendar? cost? ]]`

3. **Chose one consolidated dashboard over per-market reports.**
   Because _finance teams needed to drill into what was driving the numbers
   themselves_. The tradeoff was `[[ standardising eight markets' definitions
   into one model — what did you have to force into agreement, and who had to
   sign off? ]]`.

Add a fourth if there was a genuine road-not-taken: `[[ did anyone push for
an off-the-shelf treasury module, or for keeping the spreadsheets? ]]`

## Security and governance

All blanks — I have no basis for any of this:

- Identity and access: `[[ how did the pipeline authenticate to SAP? service
  account, managed identity, something else? ]]`
- Where sensitive data rested and who could reach it: `[[ ]]`
- Audit trail: `[[ was there one, and what did it capture? ]]`
- Monitoring and failure handling: `[[ what happened when a market's extract
  didn't land or arrived malformed? who got told? ]]`

## Results

Already true and already on the page — reuse verbatim:

- _3,200+ hours saved annually_ — _each of the 8 markets spent roughly 3 days a
  cycle manually reconciling SAP extracts and rebuilding the forecast by hand._
- _95% forecast accuracy across all 8 markets._
- _60% reduction in planning cycle time._
- _Finance teams make cash decisions in real time instead of waiting for
  month-end._
- _Presented at the Warsaw Finance Senior Leadership Meeting; won the Finance
  Excellence Award._

## What I would do differently

`[[ Yours entirely. The strongest answers name a real weakness: a piece that
was hard to operate, a market that never fit the standard model, a place where
you would now push work into the source system instead of the ETL. This is the
question you will be asked about this project in every interview — answering it
first, in writing, reads as seniority. ]]`

---

## Azure question — the one that needs settling first

The homepage toolkit previously claimed Synapse Analytics, Data Factory, Azure
Machine Learning, and Copilot Studio. No project on the site evidenced any of
them, so I removed the service names and rebuilt that pillar around your four
verifiable certifications instead.

**If you did use any of them, tell me which and where, and they go back in —
attached to the project that used them, which is far stronger than a skills
list.** Most likely candidates, if the answer is yes:

- Did the Python ETL run on Data Factory, Functions, or an on-prem/VM scheduler?
- Did the Power BI model sit on a Synapse or Fabric-backed dataset, or import
  from files?
- Was the fraud-detection ML trained/served anywhere in Azure, or locally?

If the honest answer is "the enterprise work was Power Platform and on-prem,
and Azure is certification-level knowledge" — that is a completely respectable
position, and the Azure AI reference build is what closes it. Saying so plainly
beats a claim that collapses under one question.
