# DRAFT — cashflow case study, architect depth

**Pick, don't write.** Every section below gives you concrete options in your
own voice. Tick the one that's true, edit the wording, delete the rest. If none
fit, the wrong ones are still useful — they show you the shape of the answer.

Nothing here is published. When the picks are in, this slots into
`_projects/multi-market-cashflow-forecasting.md` under the headings shown.

_Italics_ = already true on your live pages, lift as-is.

---

## Constraints

Almost certainly true, keep unless wrong:

- _Eight markets, each with its own currency, calendar, and reporting habits._
- _Three source systems already in place — SAP, BlackLine, Quantum — none of
  them mine to replace._
- The finance close is a fixed deadline. The pipeline had to fit inside the
  existing cycle, not extend it.

Pick what applied on data handling:

- [ ] **A.** Market financial data was commercially sensitive but not personal
      data, so the controls were access-based rather than residency-based.
- [ ] **B.** Some markets' data could not leave their region, so processing had
      to run where the data sat.
- [ ] **C.** Everything ran inside AstraZeneca's existing corporate estate, so
      residency was already settled by the platform I was building on.

Pick what you couldn't change:

- [ ] **A.** The close calendar and the source systems. Everything had to bend
      around those two.
- [ ] **B.** The existing BI estate and licensing — the output had to be Power
      BI because that's what Finance already ran on.
- [ ] **C.** Team size. I had no dedicated data engineers, so anything I built
      had to be operable by finance analysts after I moved on.

## Key decisions

### 1. A Python ETL layer instead of transforming inside Power BI

- [ ] **A.** The reconciliation logic was well past what Power Query could
      carry — multi-source matching, currency normalisation, and exception
      handling per market. Pushing it into Python kept the BI model thin and
      the logic testable.
- [ ] **B.** Eight markets meant eight variants of nearly the same
      transformation. Python let me write it once and parameterise it; doing
      that in Power Query would have meant eight copies drifting apart.
- [ ] **C.** I needed the transformation under version control with real tests.
      Logic embedded in a .pbix is invisible to review and impossible to
      diff.

Tradeoff (pick one):

- [ ] **A.** It added a runtime Finance didn't previously operate. I accepted
      that because the alternative was unmaintainable, and I documented the
      pipeline so it could be handed over.
- [ ] **B.** It created a skill dependency on Python in a team that mostly knew
      DAX. I mitigated it by keeping the code boring and the failure messages
      explicit.

### 2. Batch aligned to the close, not streaming

- [ ] **A.** The source systems refreshed on their own daily cycle, so
      intraday forecasting would have been precision the inputs couldn't
      support. Batch on the close rhythm matched how Finance actually decides.
- [ ] **B.** Streaming would have added real operational cost and complexity
      for a process whose decisions are made weekly. It wasn't a close call.
- [ ] **C.** _Not applicable — the cadence was never really in question._
      (If so, delete this decision and use the road-not-taken below instead.)

### 3. One consolidated model instead of eight market reports

Keep: _finance teams needed to drill into what was driving the numbers
themselves_, which a per-market report set can't do.

Tradeoff — what had to be forced into agreement (pick any that applied):

- [ ] **A.** Payment-type definitions. Markets categorised the same flows
      differently, and consolidating meant agreeing one taxonomy.
- [ ] **B.** Timing conventions — what counted as "in period" varied, so the
      calendar alignment had to be explicit rather than assumed.
- [ ] **C.** Currency treatment — which rate, applied when.

And who signed it off:

- [ ] **A.** Regional finance leads, market by market.
- [ ] **B.** The central FP&A function, with market leads consulted.
- [ ] **C.** It was settled in the Warsaw leadership forum.

### 4. The road not taken (pick one, or delete this section)

- [ ] **A.** There was pressure to keep the spreadsheets and just automate the
      consolidation step. That would have preserved the error surface I was
      trying to remove.
- [ ] **B.** An off-the-shelf treasury module was considered. It was too heavy
      for the problem and would have taken longer to configure than to build.
- [ ] **C.** Extending SAP's native reporting instead. Rejected because the
      forecast needed BlackLine and Quantum alongside it.

## Security and governance

How the pipeline reached SAP:

- [ ] **A.** A dedicated read-only service account with an extract-scoped role.
- [ ] **B.** Scheduled exports from SAP into a controlled landing area; the
      pipeline never connected to SAP directly.
- [ ] **C.** _Something else — describe in one line:_ `____________________`

Where data rested:

- [ ] **A.** A restricted SharePoint location governed by existing Finance
      access controls.
- [ ] **B.** A corporate SQL/file store with access by AD group.
- [ ] **C.** _Something else:_ `____________________`

Audit trail:

- [ ] **A.** Every run logged, with reconciliation exceptions written to a
      report the process owner reviewed each cycle.
- [ ] **B.** Power BI usage metrics plus Power Automate run history covered it.
- [ ] **C.** Honestly, this was thinner than it should have been. _(A real and
      respectable answer — pair it with the "what I'd do differently" section.)_

When a market's extract didn't land or arrived malformed:

- [ ] **A.** Power Automate flagged the failure to the process owner and the
      run halted rather than publishing a partial forecast.
- [ ] **B.** The pipeline published what it had and marked the missing market
      visibly in the dashboard, so nobody read a gap as a zero.
- [ ] **C.** _Something else:_ `____________________`

## Results

Already true — reuse verbatim: _3,200+ hours saved annually_ (each of the 8
markets spent roughly 3 days a cycle reconciling by hand), _95% forecast
accuracy_, _60% reduction in planning cycle time_, _real-time cash decisions
instead of waiting for month-end_, _presented at the Warsaw Finance Senior
Leadership Meeting_, _Finance Excellence Award_.

## What I would do differently

- [ ] **A.** I built the happy path first and bolted exception handling on
      afterwards. Now I'd design the failure cases first — in a finance
      pipeline, the interesting behaviour is what happens when a market is
      late or wrong.
- [ ] **B.** I'd push validation upstream. A lot of the ETL existed to absorb
      inconsistencies that would have been cheaper to fix at the source.
- [ ] **C.** I'd separate the forecasting logic from the ETL properly. They
      grew together, which made it harder than it needed to be to change one
      without touching the other.
- [ ] **D.** I'd agree the shared definitions with all eight markets before
      writing code, not during. The technical work was never the bottleneck;
      the agreement was.

---

## The Azure question — answer this first

The toolkit no longer claims Synapse, Data Factory, Azure ML, or Copilot
Studio, because no project evidenced them. Three questions decide whether they
go back:

- [ ] Did the Python ETL run on **Data Factory / Functions**, or on a scheduler,
      VM, or on-prem box?
- [ ] Did the Power BI model sit on a **Synapse or Fabric-backed** dataset, or
      import from files/SQL?
- [ ] Was the fraud-detection ML trained or served **anywhere in Azure**, or
      locally?

If the answer is "the enterprise work was Power Platform and on-prem; Azure is
certification-level for me" — that's a clean, respectable position. Say it
plainly and let the Azure AI reference build close the gap. It beats a claim
that dies to one follow-up question.
