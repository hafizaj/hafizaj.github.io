# Curious Systems Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing Notes collection into the approved Curious Systems experience and individually revise all 20 published notes for clarity, human voice, verifiable sourcing, and factual consistency.

**Architecture:** Keep Jekyll, Tailwind, Liquid, vanilla JavaScript, KaTeX, native disclosures, and the existing widget registry. Introduce one standard-library Ruby content validator, a dual-schema source migration, a Notes index controller, and curated hub ordering; migrate content in reviewed batches so every commit remains readable and buildable.

**Tech Stack:** Jekyll 4.3, Liquid, kramdown, Tailwind CSS 4 CLI, vanilla JavaScript, Node.js built-in test runner, Ruby 3.3 standard library and Minitest, Pandoc Lua filters, KaTeX.

**Spec:** `docs/superpowers/specs/2026-09-03-curious-systems-notes-redesign.md`

## Global Constraints

- Keep the current HJ monogram, global navigation, global footer, and sitewide palette.
- Use only Bricolage Grotesque, Instrument Sans, and IBM Plex Mono.
- No cream background, serif typeface, separate Notes logo, gradients, glass effects, stock illustration, emoji UI icons, faux handwriting, or JavaScript framework.
- Keep all 17 existing widgets; revise their caption, controls, or placement only when it improves comprehension.
- Preserve KaTeX, generated contents navigation, active recall, no-JavaScript readability, and PDF semantics.
- Rewrite every published note individually; do not perform a corpus-wide prose substitution.
- Every migrated source requires `id`, `title`, `url`, and `supports`.
- First-party product documentation is valid primary evidence for product behavior; product marketing is not sufficient on its own.
- Every professional note requires a visible `reviewed_on` date and must avoid unconfirmed first-person experience claims.
- Use UK spelling and the current academic-integrity disclaimers.
- Preserve a 150 KB compressed first-party HTML/CSS/JavaScript budget on the Notes landing page, excluding fonts and existing images.
- Include `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>` in every implementation commit.

## File and responsibility map

### New files

- `scripts/validate-notes.rb` — parse the collection and hub data, enforce migration-safe and final metadata/content rules, and print warnings for stale professional reviews.
- `test/validate_notes_test.rb` — Minitest coverage for validator migration mode, strict mode, references, feature count, order uniqueness, and hub completeness.
- `assets/js/notes-index.js` — accessible client-side filtering and result counts for the complete Notes index.
- `test/notes_index_test.cjs` — Node built-in tests for the pure note-filter predicate and result summary.
- `docs/notes-review-ledger.yml` — persistent note-by-note evidence for source access, arithmetic, widget parity, clarity, and author confirmations.

### Existing files with changed responsibilities

- `_layouts/note.html` — render the Curious Systems article header, dual-schema sources, source anchors, mobile contents disclosure, review dates, and next-note navigation.
- `_layouts/note-hub.html` — render curated hub order and a designated start note.
- `_includes/note-card.html` — render a compact, filterable browse row with takeaway and decision metadata.
- `_includes/note-hub-card.html` — render a visual collection entry point with a start-note cue.
- `notes/index.html` — render the Curious Systems hero, featured note, collections, live interaction spotlight, and all-note index.
- `_data/note_hubs.yml` — own hub start slugs and complete reading order.
- `assets/js/notes.js` — mount widgets outside article bodies and populate desktop/mobile contents navigation without duplicating widget calculations.
- `assets/js/widgets/privacy-budget.js` — expose the existing calculation for parity testing while preserving browser registration.
- `_tailwind/input.css` — own reusable Curious Systems, article, source, index, filter, and responsive styles.
- `assets/css/tailwind.css` — committed compiled output from `npm run css`.
- `scripts/note-filter.lua` — preserve claim references and append structured sources to PDF exports.
- `.github/workflows/pages.yml` — run the note validator before the Jekyll build.
- `_notes/*.md` — add honest metadata, structured sources, claim links, note-specific headings, clearer explanations, and review-ledger-backed corrections.

---

### Task 1: Content validator and migration contract

**Files:**
- Create: `scripts/validate-notes.rb`
- Create: `test/validate_notes_test.rb`
- Modify: `Gemfile`
- Modify: `Gemfile.lock`
- Modify: `.github/workflows/pages.yml:29-37`

**Interfaces:**
- Produces: `NotesValidation::Validator.new(root:, strict: nil).call -> NotesValidation::Result`
- Produces: `NotesValidation::Result#errors -> Array<NotesValidation::Finding>`
- Produces: `NotesValidation::Result#warnings -> Array<NotesValidation::Finding>`
- Produces: CLI `ruby scripts/validate-notes.rb`, with strict mode inferred when every published note has `source_schema: 2`
- Consumes: `_notes/*.md`, `_data/note_hubs.yml`

- [ ] **Step 1: Restore the repository runtimes**

Check:

```powershell
Get-Command ruby,bundle,node,npm
```

The project requires Ruby 3.3, Bundler, and the locked Node dependencies. If Ruby
or Bundler is missing on Windows, install RubyInstaller with DevKit 3.3, open a
fresh PowerShell process, and run:

```powershell
winget install --exact --id RubyInstallerTeam.RubyWithDevKit.3.3 --accept-package-agreements --accept-source-agreements
gem install bundler
bundle install
npm ci
ruby --version
bundle --version
node --version
```

Expected: Ruby reports 3.3.x, Bundler resolves `Gemfile.lock`, and `npm ci` exits
0. Do not replace the repository’s locked Jekyll or Tailwind versions.

- [ ] **Step 2: Add the Windows timezone dependencies required by Jekyll**

Add to `Gemfile`:

```ruby
gem "tzinfo", "~> 2.0", platforms: [:mingw, :x64_mingw, :mswin]
gem "tzinfo-data", platforms: [:mingw, :x64_mingw, :mswin]
```

Run:

```powershell
$env:Path = "C:\Ruby33-x64\bin;$env:Path"
bundle install
```

Expected: `Gemfile.lock` gains the `x64-mingw-ucrt` platform and locked `tzinfo`
dependencies without changing the locked Jekyll version.

- [ ] **Step 3: Write validator tests for migration-safe behavior**

Create `test/validate_notes_test.rb` with temporary fixtures. The first tests must establish that legacy notes remain deployable while migrated notes are strict:

```ruby
# frozen_string_literal: true

require "minitest/autorun"
require "tmpdir"
require "fileutils"
require_relative "../scripts/validate-notes"

class ValidateNotesTest < Minitest::Test
  def with_site(notes:, hubs: {})
    Dir.mktmpdir do |root|
      FileUtils.mkdir_p(File.join(root, "_notes"))
      FileUtils.mkdir_p(File.join(root, "_data"))
      notes.each do |name, content|
        File.write(File.join(root, "_notes", "#{name}.md"), content)
      end
      File.write(File.join(root, "_data", "note_hubs.yml"), hubs.to_yaml)
      yield root
    end
  end

  def migrated_note(overrides = {})
    data = {
      "title" => "A clear note",
      "topic" => "Testing",
      "module" => "Module A",
      "date" => "2026-08-26",
      "updated" => "2026-09-03",
      "reading_time" => 5,
      "summary" => "A concise search summary.",
      "takeaway" => "The answer is visible before the derivation.",
      "level" => "foundation",
      "featured" => true,
      "index_order" => 1,
      "source_schema" => 2,
      "sources" => [
        {
          "id" => "source-one",
          "title" => "Primary source",
          "url" => "https://example.com/primary",
          "supports" => "The main definition."
        },
        {
          "id" => "source-two",
          "title" => "Accessible explanation",
          "url" => "https://example.com/explanation",
          "supports" => "The worked example."
        }
      ]
    }.merge(overrides)

    "---\n#{data.to_yaml.sub(/\A---\s*\n/, "")}---\n\n" \
      "A supported claim [1](#source-source-one){: .source-ref}.\n\n" \
      "## A note-specific example\n\nBody.\n"
  end

  def test_legacy_note_is_allowed_during_migration
    legacy = "---\ntitle: Legacy\nmodule: Module A\nsources:\n  - Old source\n---\n\n## The setup\n"
    with_site(notes: { "legacy" => legacy }) do |root|
      result = NotesValidation::Validator.new(root: root).call
      assert_empty result.errors
      assert result.warnings.any? { |finding| finding.message.include?("legacy source schema") }
    end
  end

  def test_migrated_note_requires_complete_source_objects
    bad_sources = [{ "id" => "source-one", "title" => "Missing fields" }]
    with_site(notes: { "bad" => migrated_note("sources" => bad_sources) }) do |root|
      result = NotesValidation::Validator.new(root: root).call
      assert result.errors.any? { |finding| finding.message.include?("url") }
      assert result.errors.any? { |finding| finding.message.include?("supports") }
    end
  end
end
```

- [ ] **Step 4: Run the migration tests and verify they fail**

Run:

```powershell
ruby test\validate_notes_test.rb
```

Expected: `LoadError` for `scripts/validate-notes` because the validator does not exist.

- [ ] **Step 5: Implement YAML/front-matter loading and migration-safe validation**

Create `scripts/validate-notes.rb` around these exact public types:

```ruby
# frozen_string_literal: true

require "date"
require "yaml"

module NotesValidation
  Finding = Data.define(:severity, :path, :message)

  Result = Data.define(:findings) do
    def errors = findings.select { |finding| finding.severity == :error }
    def warnings = findings.select { |finding| finding.severity == :warning }
    def success? = errors.empty?
  end

  Note = Data.define(:path, :slug, :data, :body)

  class Validator
    LEVELS = %w[foundation applied advanced].freeze
    REQUIRED_SOURCE_FIELDS = %w[id title url supports].freeze

    def initialize(root:, strict: nil)
      @root = File.expand_path(root)
      @strict_override = strict
      @findings = []
    end

    def call
      notes = load_notes
      strict = @strict_override.nil? ? notes.all? { |note| note.data["source_schema"] == 2 } : @strict_override
      notes.each { |note| validate_note(note, strict:) }
      validate_collection(notes, strict:)
      Result.new(@findings.freeze)
    end

    private

    def load_notes
      Dir.glob(File.join(@root, "_notes", "*.md")).sort.map do |path|
        text = File.read(path, encoding: "UTF-8")
        match = text.match(/\A---\s*\n(?<yaml>.*?)\n---\s*\n/m)
        unless match
          add(:error, path, "missing YAML front matter")
          next Note.new(path, File.basename(path, ".md"), {}, text)
        end
        data = YAML.safe_load(match[:yaml], permitted_classes: [Date], aliases: false) || {}
        Note.new(path, File.basename(path, ".md"), data, text[match.end(0)..])
      rescue Psych::SyntaxError => error
        add(:error, path, "invalid YAML: #{error.message}")
        Note.new(path, File.basename(path, ".md"), {}, "")
      end
    end

    def validate_note(note, strict:)
      if note.data["source_schema"] == 2
        validate_migrated_note(note)
      elsif strict
        add(:error, note.path, "source_schema must be 2")
      else
        add(:warning, note.path, "legacy source schema remains")
      end
    end

    def add(severity, path, message)
      @findings << Finding.new(severity, relative(path), message)
    end

    def relative(path)
      path.delete_prefix("#{@root}#{File::SEPARATOR}")
    end
  end
end
```

Complete `validate_migrated_note` with explicit checks for parseable `date` and `updated`, valid `level`, Boolean `featured`, positive integer `index_order`, takeaway length no greater than 140 characters, summary length no greater than 280 characters, at least two structured sources, required source fields, unique source IDs, reference targets, and visible reference numbers.

- [ ] **Step 6: Add failing strict-collection tests**

Append tests covering:

```ruby
def test_strict_collection_requires_one_feature_and_unique_index_order
  first = migrated_note("featured" => false, "index_order" => 1)
  second = migrated_note("featured" => false, "index_order" => 1)
  with_site(notes: { "first" => first, "second" => second }) do |root|
    result = NotesValidation::Validator.new(root: root, strict: true).call
    assert result.errors.any? { |finding| finding.message.include?("exactly one featured note") }
    assert result.errors.any? { |finding| finding.message.include?("duplicate index_order") }
  end
end

def test_professional_note_requires_review_date
  professional = migrated_note("provenance" => "professional").sub("reviewed_on", "removed_review_date")
  with_site(notes: { "professional" => professional }) do |root|
    result = NotesValidation::Validator.new(root: root).call
    assert result.errors.any? { |finding| finding.message.include?("reviewed_on") }
  end
end

def test_hub_order_must_contain_every_module_note_once
  hubs = {
    "Module A" => {
      "url" => "/notes/module-a/",
      "teaser" => "A complete collection.",
      "start" => "first",
      "order" => ["first"]
    }
  }
  with_site(
    notes: {
      "first" => migrated_note("title" => "First", "index_order" => 1),
      "second" => migrated_note("title" => "Second", "index_order" => 2, "featured" => false)
    },
    hubs:
  ) do |root|
    result = NotesValidation::Validator.new(root: root, strict: true).call
    assert result.errors.any? { |finding| finding.message.include?("second") }
  end
end
```

- [ ] **Step 7: Implement collection-level checks**

Add `validate_collection` and `validate_hubs` so strict mode enforces:

- Exactly one featured published note.
- Unique positive `index_order` across published notes.
- No `## The setup`.
- No duplicate ordered H2 sequence.
- A warning when an H2 appears in more than three notes.
- Every hub start slug exists in the hub order.
- Every published note whose module has a hub appears exactly once in that order.
- Every hub order slug resolves to a published note in the same module.
- Every related slug resolves to a published note outside that hub’s own ordered
  list.
- `reviewed_on` is required for professional notes; a date older than 180 days warns.

- [ ] **Step 8: Run validator tests**

Run:

```powershell
ruby test\validate_notes_test.rb
```

Expected: all tests pass.

- [ ] **Step 9: Wire migration-safe validation into Pages**

Insert immediately before the current Jekyll build step in `.github/workflows/pages.yml`:

```yaml
      - name: Validate notes
        run: ruby scripts/validate-notes.rb
```

The CLI must print each finding as `ERROR path: message` or `WARNING path: message` and exit 1 only when errors exist.

- [ ] **Step 10: Verify the current legacy site remains buildable**

Run:

```powershell
ruby scripts\validate-notes.rb
bundle exec jekyll build
```

Expected: validator exits 0 with legacy-schema warnings; Jekyll build exits 0.

- [ ] **Step 11: Commit the validator**

```powershell
git add Gemfile Gemfile.lock scripts\validate-notes.rb test\validate_notes_test.rb .github\workflows\pages.yml
git commit -m "Add migration-safe notes validation" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 2: Source rendering, PDF support, and two-note pilot

**Files:**
- Modify: `_layouts/note.html:25-75`
- Modify: `_tailwind/input.css:180-380`
- Modify: `scripts/note-filter.lua`
- Modify: `_notes/why-your-privacy-budget-shrinks-with-every-query.md`
- Modify: `_notes/before-you-build-an-agent-decide-whether-you-should.md`
- Create: `docs/notes-review-ledger.yml`

**Interfaces:**
- Consumes: source objects `{id, author?, organisation?, title, publication?, year?, url, supports}`
- Produces: HTML anchors `id="source-<id>"` and inline links `a.source-ref[href="#source-<id>"]`
- Produces: PDF source list through `Pandoc(doc) -> doc` in `scripts/note-filter.lua`
- Produces: two schema-2 notes that establish the editorial pattern without becoming a reusable prose template

- [ ] **Step 1: Add dual-schema source rendering to the article layout**

Replace the existing flat source list with a compatibility branch:

```liquid
{% if page.sources %}
<section class="note-sources" aria-labelledby="sources-heading">
  <p class="eyebrow text-muted">Sources and further reading</p>
  <h2 id="sources-heading" class="sr-only">Sources and further reading</h2>
  <ol>
    {% for source in page.sources %}
      {% if source.id and source.url %}
      <li id="source-{{ source.id }}">
        <a href="{{ source.url }}" rel="noopener" class="note-source-link">
          {{ source.title }}
          <span class="sr-only">(external source)</span>
        </a>
        {% if source.author %}<span>{{ source.author }}</span>{% endif %}
        {% if source.organisation %}<span>{{ source.organisation }}</span>{% endif %}
        {% if source.publication %}<span>{{ source.publication }}</span>{% endif %}
        {% if source.year %}<span>{{ source.year }}</span>{% endif %}
        <p><strong>Used for:</strong> {{ source.supports }}</p>
      </li>
      {% else %}
      <li>{{ source }}</li>
      {% endif %}
    {% endfor %}
  </ol>
</section>
{% endif %}
```

Add visible `date`, `updated`, and professional `reviewed_on` metadata. Keep the existing provenance disclaimer.

- [ ] **Step 2: Add source and metadata styles**

Add `.note-sources`, `.note-source-link`, and `.source-ref` components using existing tokens. Source references must be visually compact, underlined, and keyboard-focusable; source-list body text must remain at least `0.875rem`.

- [ ] **Step 3: Make PDF export append structured sources**

Extend `scripts/note-filter.lua` with a `Pandoc` callback. Use a source ID span so links authored as `[1](#source-id)` remain meaningful:

```lua
local function meta_text(value)
  if not value then return '' end
  return pandoc.utils.stringify(value)
end

function Pandoc(doc)
  local sources = doc.meta.sources
  if not sources then return doc end

  table.insert(doc.blocks, pandoc.Header(2, 'Sources and further reading'))
  local items = {}

  for index, source in ipairs(sources) do
    if source.id and source.title and source.url then
      local source_id = 'source-' .. meta_text(source.id)
      local prefix = pandoc.Span(
        { pandoc.Str('[' .. index .. ']') },
        pandoc.Attr(source_id)
      )
      local title = pandoc.Link(
        { pandoc.Str(meta_text(source.title)) },
        meta_text(source.url)
      )
      local used_for = pandoc.Str(' Used for: ' .. meta_text(source.supports))
      table.insert(items, { pandoc.Plain({ prefix, pandoc.Space(), title, used_for }) })
    end
  end

  table.insert(doc.blocks, pandoc.BulletList(items))
  return doc
end
```

- [ ] **Step 4: Migrate the privacy-budget note**

Use these source objects:

```yaml
source_schema: 2
takeaway: "A privacy guarantee applies to the whole sequence of queries, not to each query in isolation."
level: applied
featured: true
updated: 2026-09-03
index_order: 1
sources:
  - id: dwork-2006
    author: "Cynthia Dwork, Frank McSherry, Kobbi Nissim & Adam Smith"
    title: "Calibrating Noise to Sensitivity in Private Data Analysis"
    publication: "Theory of Cryptography Conference"
    year: 2006
    url: "https://doi.org/10.1007/11681878_14"
    supports: "The Laplace mechanism and calibration of noise to global sensitivity."
  - id: dwork-roth-2014
    author: "Cynthia Dwork & Aaron Roth"
    title: "The Algorithmic Foundations of Differential Privacy"
    publication: "Foundations and Trends in Theoretical Computer Science"
    year: 2014
    url: "https://www.cis.upenn.edu/~aaroth/Papers/privacybook.pdf"
    supports: "Sequential composition, privacy budgets, and the limits of repeated queries."
```

Set `date` to the file’s first-added Git date, found with:

```powershell
git --no-pager log --follow --diff-filter=A --format=%cs -- _notes\why-your-privacy-budget-shrinks-with-every-query.md
```

Replace `## The setup` with a heading tied to the count-query example. Put the one-sentence answer before the first equation, define sensitivity and epsilon at first use, add source links to the Laplace mechanism and sequential composition claims, and reduce recall prompts to three distinct questions.

- [ ] **Step 5: Recalculate privacy examples and widget parity**

Run:

```powershell
node -e "for (const k of [1,10,50]) console.log(k, (Math.sqrt(2)*k).toFixed(2))"
```

Expected:

```text
1 1.41
10 14.14
50 70.71
```

Confirm article values and widget defaults use the same formula.

- [ ] **Step 6: Migrate the agent-decision field note**

Use these official source objects:

```yaml
source_schema: 2
takeaway: "Choose the least autonomous architecture that can complete the job reliably."
level: foundation
featured: false
updated: 2026-09-03
reviewed_on: 2026-09-03
index_order: 2
sources:
  - id: microsoft-ai-strategy
    organisation: "Microsoft"
    title: "AI strategy — Guidance to set your organization's AI strategy"
    publication: "Cloud Adoption Framework"
    year: 2026
    url: "https://learn.microsoft.com/azure/cloud-adoption-framework/ai/strategy"
    supports: "The sequence from use-case identification to technology choice and responsible adoption."
  - id: microsoft-ai-plan
    organisation: "Microsoft"
    title: "Plan for AI adoption"
    publication: "Cloud Adoption Framework"
    year: 2026
    url: "https://learn.microsoft.com/azure/cloud-adoption-framework/ai/plan"
    supports: "Use-case prioritisation, proof-of-concept planning, skills, data, and responsible-AI readiness."
```

Rewrite the opening around one concrete architecture decision. Define “agent” operationally before comparing implementation options. Distinguish Microsoft-documented adoption guidance from the author’s decision heuristic. Remove or hedge first-person design-session claims unless they are independently supportable.

- [ ] **Step 7: Create the review ledger for the pilot**

Create `docs/notes-review-ledger.yml` with one entry per pilot note:

```yaml
"why-your-privacy-budget-shrinks-with-every-query":
  reviewer: "Copilot implementation review"
  reviewed_on: "2026-09-03"
  arithmetic: "pass — k=1,10,50 recomputed independently"
  widget_parity: "pass — sqrt(2) * k at epsilon_total=1 and sensitivity=1"
  clarity: "pass — question and one-sentence answer precede notation"
  author_confirmations: []
  sources:
    dwork-2006:
      accessed_on: "2026-09-03"
      status: "reachable — final HTTP response recorded during implementation"
    dwork-roth-2014:
      accessed_on: "2026-09-03"
      status: "reachable — final HTTP response recorded during implementation"

"before-you-build-an-agent-decide-whether-you-should":
  reviewer: "Copilot implementation review"
  reviewed_on: "2026-09-03"
  arithmetic: "not applicable"
  widget_parity: "not applicable"
  clarity: "pass — agent definition and decision question precede options"
  author_confirmations: []
  sources:
    microsoft-ai-strategy:
      accessed_on: "2026-09-03"
      status: "reachable — final HTTP response recorded during implementation"
    microsoft-ai-plan:
      accessed_on: "2026-09-03"
      status: "reachable — final HTTP response recorded during implementation"
```

Replace each descriptive status with the actual final HTTP status and resolved URL
after performing the URL checks.

- [ ] **Step 8: Verify pilot sources**

Run:

```powershell
$urls = @(
  'https://doi.org/10.1007/11681878_14',
  'https://www.cis.upenn.edu/~aaroth/Papers/privacybook.pdf',
  'https://learn.microsoft.com/azure/cloud-adoption-framework/ai/strategy',
  'https://learn.microsoft.com/azure/cloud-adoption-framework/ai/plan'
)
foreach ($url in $urls) {
  curl.exe --location --fail --silent --show-error --output NUL $url
  if ($LASTEXITCODE -ne 0) { throw "Source check failed: $url" }
}
```

Expected: all four requests exit 0. Record resolved status in the ledger.

- [ ] **Step 9: Run pilot validation and build**

Run:

```powershell
ruby scripts\validate-notes.rb
npm run css
bundle exec jekyll build
```

Expected: the two migrated notes pass strict per-note validation, legacy notes warn, CSS compiles, and Jekyll builds.

- [ ] **Step 10: Spot-check PDF when Pandoc is available**

Run:

```powershell
& 'C:\Program Files\Git\bin\bash.exe' scripts/note-to-pdf.sh _notes/why-your-privacy-budget-shrinks-with-every-query.md
```

Expected: `_pdf/why-your-privacy-budget-shrinks-with-every-query.pdf` contains numbered claim links and a two-item source list. If Pandoc or LaTeX is unavailable, record the environment blocker in the ledger and do not claim PDF verification.

- [ ] **Step 11: Commit the pilot**

```powershell
git add _layouts\note.html _tailwind\input.css assets\css\tailwind.css scripts\note-filter.lua _notes\why-your-privacy-budget-shrinks-with-every-query.md _notes\before-you-build-an-agent-decide-whether-you-should.md docs\notes-review-ledger.yml
git commit -m "Establish sourced notes editorial contract" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 3: Complete browse metadata

**Files:**
- Modify: `_notes/aggregating-across-groups-can-flip-treatments.md`
- Modify: `_notes/copilot-studio-multi-agent-orchestration-a2a-mcp.md`
- Modify: `_notes/correlation-decides-your-diversification-benefit.md`
- Modify: `_notes/microsoft-foundry-one-platform-not-three-products.md`
- Modify: `_notes/ridge-shrinks-correlated-predictors.md`
- Modify: `_notes/what-a-shadow-price-actually-tells-you.md`
- Modify: `_notes/why-a-better-fit-on-your-training-data-can-predict-worse.md`
- Modify: `_notes/why-a-non-zero-y-axis-can-turn-a-flat-trend-into-a-crisis.md`
- Modify: `_notes/why-battery-arbitrage-needs-a-price-spread-not-just-a-gap.md`
- Modify: `_notes/why-confidence-lies-and-lift-tells-the-truth.md`
- Modify: `_notes/why-deep-sigmoid-gradients-vanish.md`
- Modify: `_notes/why-ignoring-censored-patients-biases-survival-estimates.md`
- Modify: `_notes/why-nameplate-capacity-overstates-what-a-plant-delivers.md`
- Modify: `_notes/why-pooling-warehouses-can-halve-safety-stock.md`
- Modify: `_notes/why-price-sensitivity-sets-your-optimal-markup.md`
- Modify: `_notes/why-solar-can-collapse-the-electricity-price-to-zero.md`
- Modify: `_notes/why-targeting-likely-buyers-wastes-your-promo-budget.md`
- Modify: `_notes/why-your-most-central-node-depends-on-the-measure.md`

**Interfaces:**
- Produces: complete `takeaway`, `level`, `featured`, `date`, `updated`, and `index_order` metadata for index and article templates
- Preserves: legacy flat source strings until each editorial batch migrates them atomically

- [ ] **Step 1: Apply the complete metadata matrix**

Use this exact matrix. The two pilot rows are included for cross-checking but were
already applied in Task 2:

| Order | Slug | Level | Takeaway |
|---:|---|---|---|
| 1 | `why-your-privacy-budget-shrinks-with-every-query` | applied | A privacy guarantee applies to the whole sequence of queries, not to each query in isolation. |
| 2 | `before-you-build-an-agent-decide-whether-you-should` | foundation | Choose the least autonomous architecture that can complete the job reliably. |
| 3 | `microsoft-foundry-one-platform-not-three-products` | foundation | Microsoft Foundry joins model, agent, tool, and evaluation work around shared project resources. |
| 4 | `copilot-studio-multi-agent-orchestration-a2a-mcp` | applied | MCP connects an orchestrator to tools; A2A coordinates agents across a separate trust boundary. |
| 5 | `why-your-most-central-node-depends-on-the-measure` | foundation | The most important node changes when the question changes from reach to brokerage. |
| 6 | `why-a-non-zero-y-axis-can-turn-a-flat-trend-into-a-crisis` | foundation | Changing an axis floor changes perceived movement even when every data value stays fixed. |
| 7 | `why-a-better-fit-on-your-training-data-can-predict-worse` | foundation | Lower training error can mean worse unseen predictions when extra flexibility starts fitting noise. |
| 8 | `ridge-shrinks-correlated-predictors` | advanced | Ridge shrinks coefficients most along directions the observed data identifies least reliably. |
| 9 | `why-deep-sigmoid-gradients-vanish` | applied | Chaining sigmoid derivatives no larger than 0.25 can shrink a deep gradient exponentially. |
| 10 | `why-ignoring-censored-patients-biases-survival-estimates` | applied | A censored patient still contributes survival information until the moment they leave observation. |
| 11 | `aggregating-across-groups-can-flip-treatments` | foundation | Unequal subgroup weights can reverse an aggregate comparison even when every subgroup agrees. |
| 12 | `correlation-decides-your-diversification-benefit` | applied | Diversification depends on covariance between assets, not on the number of assets alone. |
| 13 | `what-a-shadow-price-actually-tells-you` | applied | A shadow price is a local marginal value that holds only while the active constraints stay unchanged. |
| 14 | `why-pooling-warehouses-can-halve-safety-stock` | applied | The square-root pooling benefit assumes independent demand; positive correlation erodes it. |
| 15 | `why-battery-arbitrage-needs-a-price-spread-not-just-a-gap` | applied | A battery breaks even on energy only when the high price exceeds the low price divided by efficiency. |
| 16 | `why-nameplate-capacity-overstates-what-a-plant-delivers` | foundation | Capacity factor converts a plant’s nameplate rating into the energy it actually produces over time. |
| 17 | `why-solar-can-collapse-the-electricity-price-to-zero` | applied | In a marginal-price market, enough low-bid supply can make the clearing price zero or lower. |
| 18 | `why-confidence-lies-and-lift-tells-the-truth` | foundation | Confidence ignores how common the consequent already is; lift compares against that baseline. |
| 19 | `why-price-sensitivity-sets-your-optimal-markup` | applied | Under the stated demand assumptions, the optimal markup is pinned down by elasticity. |
| 20 | `why-targeting-likely-buyers-wastes-your-promo-budget` | applied | Promotion targeting should rank incremental responders, not customers already likely to buy. |

Set `featured: false` on every row except order 1. Takeaways must use the exact text
above so index behavior can be implemented before the deeper editorial batches.

- [ ] **Step 2: Replace synthetic dates with honest Git dates**

The first-added date is `2026-08-26` for every current note. Set every `date` to
that value. Set `updated` to `2026-08-27` for notes whose latest pre-redesign
commit is that date and `2026-08-26` for the remaining notes. Do not invent
different days to force ordering; `index_order` owns display order.

- [ ] **Step 3: Check metadata without forcing source migration**

Run:

```powershell
ruby scripts\validate-notes.rb
```

Expected: pilot notes pass schema-2 checks; the other 18 notes emit legacy-source
warnings but no metadata error.

- [ ] **Step 4: Build and inspect the complete index inputs**

Run:

```powershell
bundle exec jekyll build
```

Inspect generated note metadata through the built pages or a temporary Liquid
debug print. Confirm all 20 orders are unique and every takeaway is at most 140
characters. Remove the debug print before committing.

- [ ] **Step 5: Commit browse metadata**

```powershell
git add _notes
git commit -m "Add curated Notes discovery metadata" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 4: Curious Systems article shell

**Files:**
- Modify: `_layouts/note.html`
- Modify: `assets/js/notes.js`
- Modify: `_tailwind/input.css`
- Modify: `assets/css/tailwind.css`

**Interfaces:**
- Consumes: `takeaway`, `level`, `date`, `updated`, `reviewed_on`, provenance, module mark
- Produces: `[data-note-body]`, `[data-note-toc]`, `[data-note-mobile-toc]`, and existing `#recall-mode`
- Preserves: `window.NoteWidgets.register(name, mount)`

- [ ] **Step 1: Refactor contents generation to support two navigation surfaces**

Change `buildToc` to query all `[data-note-toc]` containers. Create one anchor per H2/H3 per container, retain the current heading-ID algorithm, and update matching links in both containers from the same `IntersectionObserver`.

- [ ] **Step 2: Add mobile contents markup**

Render a native disclosure after the article header:

```html
<details class="note-mobile-toc lg:hidden">
  <summary>On this page</summary>
  <nav data-note-toc aria-label="Table of contents"></nav>
</details>
```

Change the desktop nav from `id="note-toc"` to `data-note-toc`.

- [ ] **Step 3: Recompose the article header**

Use a two-column hero at desktop and one column on mobile. Keep metadata as text, not icon-only UI. The visible order is topic/provenance, title, takeaway, date/update/review metadata, “You only need …”, then artwork.

The body remains in the current readable measure. Do not apply rotation or overlapping art inside `.note-prose`.

- [ ] **Step 4: Add global next-note navigation**

Use `index_order` to identify the next higher ordered note. Render one specific
link plus “Browse every note.” Hub-aware sequencing is added in Task 7 after
curated hub order exists.

- [ ] **Step 5: Compile and build**

Run:

```powershell
npm run css
bundle exec jekyll build
```

Expected: build passes; both pilot article pages contain one H1, desktop and mobile contents nav, structured sources, and no duplicate element IDs.

- [ ] **Step 6: Browser-check both article modes**

Check at 390×844 and 1440×900:

- Privacy note renders KaTeX, widget, sources, recall, and both contents modes.
- Agent note renders review date and no empty widget controls.
- No document-level horizontal overflow.
- Keyboard focus reaches mobile contents, citations, recall, and next-note links.

- [ ] **Step 7: Commit the article shell**

```powershell
git add _layouts\note.html assets\js\notes.js _tailwind\input.css assets\css\tailwind.css
git commit -m "Build Curious Systems article shell" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 5: Shared widget mounting and filter controller

**Files:**
- Modify: `assets/js/notes.js`
- Modify: `assets/js/widgets/privacy-budget.js`
- Create: `assets/js/notes-index.js`
- Create: `test/notes_index_test.cjs`

**Interfaces:**
- Produces: `window.NoteWidgets.mountWithin(root)`
- Produces: `window.PrivacyBudget.noiseStd(k, epsilonTotal, sensitivity) -> number`
- Produces: `NotesIndex.matches(filters, note) -> boolean`
- Produces: `NotesIndex.summary(visible, total) -> string`

- [ ] **Step 1: Write pure filter tests**

Create `test/notes_index_test.cjs`:

```javascript
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const NotesIndex = require('../assets/js/notes-index.js');

test('matches selected subject, provenance, and format', function () {
  const note = { module: 'Retail Analytics', provenance: 'academic', interactive: true };
  assert.equal(NotesIndex.matches({
    module: 'Retail Analytics',
    provenance: 'academic',
    format: 'interactive'
  }, note), true);
  assert.equal(NotesIndex.matches({
    module: 'Energy Analytics',
    provenance: 'academic',
    format: 'interactive'
  }, note), false);
});

test('all values leave a note visible', function () {
  const note = { module: 'Retail Analytics', provenance: 'academic', interactive: false };
  assert.equal(NotesIndex.matches({
    module: 'all',
    provenance: 'all',
    format: 'all'
  }, note), true);
});

test('summary reports visible and total counts', function () {
  assert.equal(NotesIndex.summary(7, 20), 'Showing 7 of 20 notes');
});
```

- [ ] **Step 2: Run the filter tests and verify they fail**

Run:

```powershell
node --test test\notes_index_test.cjs
```

Expected: module-not-found failure for `assets/js/notes-index.js`.

- [ ] **Step 3: Implement the filter module**

Use a UMD-style module so Node tests can load pure functions and the browser can initialise the DOM controller:

```javascript
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.NotesIndex = api;
}(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  function matches(filters, note) {
    return (filters.module === 'all' || filters.module === note.module) &&
      (filters.provenance === 'all' || filters.provenance === note.provenance) &&
      (filters.format === 'all' ||
        (filters.format === 'interactive' ? note.interactive : !note.interactive));
  }

  function summary(visible, total) {
    return 'Showing ' + visible + ' of ' + total + ' notes';
  }

  function init() {
    var form = document.querySelector('[data-notes-filter]');
    if (!form) return;
    var rows = Array.prototype.slice.call(document.querySelectorAll('[data-note-row]'));
    var output = document.querySelector('[data-notes-count]');

    function readFilters() {
      var pressed = function (name) {
        var active = form.querySelector('[data-filter="' + name + '"][aria-pressed="true"]');
        return active ? active.value : 'all';
      };
      return {
        module: form.elements.module.value,
        provenance: pressed('provenance'),
        format: pressed('format')
      };
    }

    function apply() {
      var filters = readFilters();
      var visible = 0;
      rows.forEach(function (row) {
        var show = matches(filters, {
          module: row.dataset.module,
          provenance: row.dataset.provenance,
          interactive: row.dataset.interactive === 'true'
        });
        row.hidden = !show;
        if (show) visible += 1;
      });
      if (output) output.textContent = summary(visible, rows.length);
    }

    form.addEventListener('change', apply);
    form.addEventListener('click', function (event) {
      var button = event.target.closest('[data-filter]');
      if (!button) return;
      form.querySelectorAll('[data-filter="' + button.dataset.filter + '"]').forEach(function (peer) {
        peer.setAttribute('aria-pressed', String(peer === button));
      });
      apply();
    });
    apply();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }

  return { matches: matches, summary: summary, init: init };
}));
```

- [ ] **Step 4: Expose privacy calculation and shared mounting**

Move `noiseStd` behind:

```javascript
window.PrivacyBudget = {
  noiseStd: function (k, epsilonTotal, sensitivity) {
    return Math.sqrt(2) * sensitivity * k / epsilonTotal;
  }
};
```

Have the widget call `window.PrivacyBudget.noiseStd(k, EPS_TOTAL, DELTA)`.

In `notes.js`, remove the article-body early return. Keep article-only features guarded by `[data-note-body]`, and expose `NoteWidgets.mountWithin(root)` so the index and article both discover `[data-widget]` elements.

- [ ] **Step 5: Run JavaScript tests**

Run:

```powershell
node --test test\notes_index_test.cjs
```

Expected: three passing tests.

- [ ] **Step 6: Commit shared behavior**

```powershell
git add assets\js\notes.js assets\js\widgets\privacy-budget.js assets\js\notes-index.js test\notes_index_test.cjs
git commit -m "Add reusable notes discovery behavior" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 6: Curious Systems landing page

**Files:**
- Modify: `notes/index.html`
- Modify: `_includes/note-card.html`
- Modify: `_includes/note-hub-card.html`
- Modify: `_tailwind/input.css`
- Modify: `assets/css/tailwind.css`

**Interfaces:**
- Consumes: one `featured` note, all published notes sorted by `index_order`, hub data, module marks, `NotesIndex`
- Produces: `[data-notes-filter]`, `[data-note-row]`, `[data-notes-count]`, and one `[data-widget="privacy-budget"]`

- [ ] **Step 1: Replace the current white masthead with the approved hero**

Build a Midnight two-column hero using the existing global shell. Derive counts:

```liquid
{% assign all_notes = site.notes | where_exp: "n", "n.draft != true" %}
{% assign module_list = all_notes | map: "module" | uniq %}
{% assign featured_notes = all_notes | where: "featured", true %}
{% assign featured_note = featured_notes | first %}
```

Count interactive notes with a Liquid loop that increments when
`note.content contains 'data-widget='`; do not rely on a `where_exp` parser
extension. Render “Open an idea. Move the pieces.”, actual counts, featured and
browse links, and three decorative existing module marks. All decorative
instances use `alt=""`.

- [ ] **Step 2: Build the featured panel and live spotlight**

Use the privacy note for both. The panel explains the note; the spotlight mounts the existing `privacy-budget` widget with the same `data-widget` markup and control IDs prefixed `index-` to prevent collisions.

Load scripts:

```html
<script defer src="{{ '/assets/js/notes.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/notes-index.js' | relative_url }}"></script>
```

- [ ] **Step 3: Rebuild collection cards**

Retain the three configured hubs, but render larger colour fields and offset marks. Include note count and the configured start-note title. Do not rotate text or controls.

- [ ] **Step 4: Render all notes in curated order**

Sort by `index_order`, not date:

```liquid
{% assign notes = all_notes | sort: "index_order" %}
```

Every row includes:

```liquid
data-note-row
data-module="{{ note.module }}"
data-provenance="{% if note.provenance == 'professional' %}professional{% else %}academic{% endif %}"
data-interactive="{% if note.content contains 'data-widget=' %}true{% else %}false{% endif %}"
```

Display topic, title, takeaway, reading time, level, provenance, and an “Interactive” label only when a widget exists.

- [ ] **Step 5: Add accessible filters**

Render one native `<select name="module">`, a provenance button group, a format button group, and:

```html
<p data-notes-count aria-live="polite">Showing {{ notes.size }} of {{ notes.size }} notes</p>
```

Buttons start with the “all” option pressed.

- [ ] **Step 6: Style the landing page**

Add focused `.notes-hero`, `.notes-art-stack`, `.notes-feature`, `.notes-collection-grid`, `.notes-spotlight`, `.notes-filter`, and `.note-index-row` components. Use existing colour tokens. Cap artwork rotation at six degrees and clip the art stack so it cannot cause horizontal overflow.

- [ ] **Step 7: Compile, validate, and build**

Run:

```powershell
node --test test\notes_index_test.cjs
ruby scripts\validate-notes.rb
npm run css
bundle exec jekyll build
```

Expected: tests and build pass; legacy content warnings remain until later batches.

- [ ] **Step 8: Browser-check landing behavior**

At 390×844, 768×1024, and 1440×900:

- Hero and artwork recompose without horizontal overflow.
- Featured link opens the privacy note.
- Privacy widget readout matches the article at `k=1`, `k=10`, and `k=50`.
- Subject, provenance, and format filters combine correctly.
- “Browse every note” exposes all 20 with JavaScript disabled.
- Keyboard focus order follows visual order.
- Reduced motion removes entrance and art movement.

- [ ] **Step 9: Measure first-party transfer**

Serve `_site` locally and record compressed HTML/CSS/JS totals:

```powershell
$urls = @(
  'http://localhost:4000/notes/',
  'http://localhost:4000/assets/css/tailwind.css',
  'http://localhost:4000/assets/js/notes.js',
  'http://localhost:4000/assets/js/notes-index.js',
  'http://localhost:4000/assets/js/widgets/privacy-budget.js'
)
$sizes = foreach ($url in $urls) {
  [int](curl.exe --compressed --silent --output NUL --write-out '%{size_download}' $url)
}
"first-party compressed bytes: $(($sizes | Measure-Object -Sum).Sum)"
```

Expected: no more than 153,600 bytes before images and fonts.

- [ ] **Step 10: Commit the landing page**

```powershell
git add notes\index.html _includes\note-card.html _includes\note-hub-card.html _tailwind\input.css assets\css\tailwind.css
git commit -m "Build Curious Systems notes landing page" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 7: Guided collection shelves

**Files:**
- Modify: `_data/note_hubs.yml`
- Modify: `_layouts/note-hub.html`
- Modify: `_layouts/note.html`
- Modify: `_tailwind/input.css`
- Modify: `assets/css/tailwind.css`

**Interfaces:**
- Consumes: hub keys `start` and `order`, each containing note slugs
- Produces: one featured start note and complete ordered list per configured hub

- [ ] **Step 1: Add explicit hub reading order**

Use exactly:

```yaml
"Energy Analytics":
  url: "/notes/energy-analytics/"
  teaser: "Price formation, capacity, and storage economics in real electricity markets."
  start: "why-nameplate-capacity-overstates-what-a-plant-delivers"
  order:
    - "why-nameplate-capacity-overstates-what-a-plant-delivers"
    - "why-solar-can-collapse-the-electricity-price-to-zero"
    - "why-battery-arbitrage-needs-a-price-spread-not-just-a-gap"
  related:
    - "what-a-shadow-price-actually-tells-you"
"Retail Analytics":
  url: "/notes/retail-analytics/"
  teaser: "Pricing, basket analysis, and targeting — where retail intuition and the numbers disagree."
  start: "why-confidence-lies-and-lift-tells-the-truth"
  order:
    - "why-confidence-lies-and-lift-tells-the-truth"
    - "why-price-sensitivity-sets-your-optimal-markup"
    - "why-targeting-likely-buyers-wastes-your-promo-budget"
  related:
    - "aggregating-across-groups-can-flip-treatments"
"Azure AI Architecture":
  url: "/notes/azure-ai-architecture/"
  teaser: "Field notes from my Microsoft role: Foundry, agent design, and Copilot Studio orchestration."
  start: "before-you-build-an-agent-decide-whether-you-should"
  order:
    - "before-you-build-an-agent-decide-whether-you-should"
    - "microsoft-foundry-one-platform-not-three-products"
    - "copilot-studio-multi-agent-orchestration-a2a-mcp"
  related:
    - "why-your-privacy-budget-shrinks-with-every-query"
```

- [ ] **Step 2: Render the start note and ordered remainder**

Resolve each slug through its guaranteed permalink:

```liquid
{% capture expected_url %}/notes/{{ slug }}/{% endcapture %}
{% assign ordered_note = notes | where: "url", expected_url | first %}
```

Render the start note in a larger panel, then iterate the same order excluding
`start`. Render the configured related note as a single bridge below the ordered
list. Do not silently skip unresolved slugs; the validator prevents them.

- [ ] **Step 3: Upgrade article next-note navigation to hub order**

When the current note belongs to a configured hub, locate its slug in that hub’s
`order` and link to the next slug. If it is the last hub note, fall back to the
next global `index_order`. Standalone notes continue using global order.

- [ ] **Step 4: Style and compile**

Give each hub a strong existing-token colour header, offset module art, plain-language description, start panel, and calm ordered rows.

Run:

```powershell
npm run css
ruby scripts\validate-notes.rb
bundle exec jekyll build
```

Expected: all three hub URLs build and contain their three notes exactly once.

- [ ] **Step 5: Browser-check all hubs**

Check desktop and mobile:

- Start note is obvious without hiding other notes.
- Reading order matches YAML.
- Artwork remains decorative and bounded.
- Back-to-index and start-note links are keyboard accessible.

- [ ] **Step 6: Commit hubs**

```powershell
git add _data\note_hubs.yml _layouts\note-hub.html _layouts\note.html _tailwind\input.css assets\css\tailwind.css
git commit -m "Turn note collections into guided shelves" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 8: Remaining professional notes

**Files:**
- Modify: `_notes/microsoft-foundry-one-platform-not-three-products.md`
- Modify: `_notes/copilot-studio-multi-agent-orchestration-a2a-mcp.md`
- Modify: `docs/notes-review-ledger.yml`

**Interfaces:**
- Consumes: source schema 2 and professional review contract
- Produces: two current, sourced professional notes with no unconfirmed experience claims

- [ ] **Step 1: Verify current first-party documentation before editing**

Use Microsoft Learn search for the current official pages covering:

- Microsoft Foundry platform composition and build choices.
- Microsoft Foundry Agent Service.
- Model Context Protocol tool connections.
- Agent2Agent protocol connections in Copilot Studio.
- Microsoft’s multi-agent orchestration guidance.

Record the final official URLs and access date in the ledger before writing claims.

- [ ] **Step 2: Migrate the Foundry note**

Add `source_schema: 2`, a 140-character takeaway, `level`, honest `date`, `updated`, `reviewed_on`, unique `index_order`, and at least three structured sources. Rewrite product taxonomy against current official wording. Separate documented platform behavior from the author’s architectural interpretation, and retain the caveat section only where current evidence supports it.

- [ ] **Step 3: Migrate the A2A/MCP note**

Define Model Context Protocol and Agent2Agent on first use. Cite official specifications or first-party connection documentation at the definitions. Replace categorical protocol claims with bounded statements about tool invocation versus peer-agent communication. Keep two recall questions, each testing a different boundary.

- [ ] **Step 4: Review professional-note consistency**

Confirm all three professional notes:

- Show `reviewed_on: 2026-09-03`.
- Expand acronyms on first use.
- Avoid invented customer, workshop, or design-session outcomes.
- Use Microsoft documentation for product behavior and open standards for protocol behavior.
- Have distinct heading sequences and openings.

- [ ] **Step 5: Validate, build, and update ledger**

Run:

```powershell
ruby scripts\validate-notes.rb
bundle exec jekyll build
```

Follow every new source URL with `curl.exe --location --fail --silent --show-error --output NUL`. Record results, claim boundaries, and “not applicable” arithmetic/widget checks in the ledger.

- [ ] **Step 6: Commit professional notes**

```powershell
git add _notes\microsoft-foundry-one-platform-not-three-products.md _notes\copilot-studio-multi-agent-orchestration-a2a-mcp.md docs\notes-review-ledger.yml
git commit -m "Ground professional notes in current sources" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 9: Modelling and data-method notes

**Files:**
- Modify: `_notes/ridge-shrinks-correlated-predictors.md`
- Modify: `_notes/why-a-better-fit-on-your-training-data-can-predict-worse.md`
- Modify: `_notes/why-deep-sigmoid-gradients-vanish.md`
- Modify: `_notes/why-your-most-central-node-depends-on-the-measure.md`
- Modify: `_notes/why-ignoring-censored-patients-biases-survival-estimates.md`
- Modify: `docs/notes-review-ledger.yml`

**Interfaces:**
- Produces: five schema-2 notes with independently checked calculations, widget parity, accessible primary sources, and distinct narrative structures

- [ ] **Step 1: Migrate ridge and bias-variance notes**

For ridge, verify the SVD shrinkage statement against *The Elements of Statistical Learning* and an accessible *Introduction to Statistical Learning* edition. Recompute the 2×2 example and compare every widget coefficient.

For bias-variance, verify decomposition language and distinguish expected test error from one observed split. Re-run polynomial predictions used by the widget and remove claims that “always” hold only in expectation.

- [ ] **Step 2: Migrate sigmoid-gradient note**

Verify the derivative maximum `σ(x)(1-σ(x)) ≤ 0.25`, recompute powers through ten layers, and distinguish activation saturation from all causes of vanishing gradients. Cite Glorot and Bengio plus the accessible Deep Learning textbook.

- [ ] **Step 3: Migrate centrality note**

Verify degree and betweenness values for the displayed graph. Define shortest-path ties and normalisation. Cite Freeman’s original paper and an accessible modern network reference.

- [ ] **Step 4: Migrate survival note**

Recompute the Kaplan–Meier risk sets and survival product for all event times. Define censoring before notation, state the non-informative-censoring assumption, and ensure the widget does not imply survival reaches zero after the last observed event.

- [ ] **Step 5: Remove batch-level templating**

Across the five files:

- Replace every `## The setup`.
- Use no duplicate ordered H2 sequence.
- Vary openings according to the actual problem.
- Keep all widgets but use two or three recall prompts only where they test distinct concepts.
- Remove redundant key/warning callouts rather than renaming them.

- [ ] **Step 6: Run calculations, link checks, validation, and build**

Use short Node or Ruby expressions to recompute each numeric table independently of widget code. Record commands and results in the ledger. Then run:

```powershell
ruby scripts\validate-notes.rb
bundle exec jekyll build
```

Expected: five migrated notes pass; remaining legacy notes warn.

- [ ] **Step 7: Commit modelling batch**

```powershell
git add _notes\ridge-shrinks-correlated-predictors.md _notes\why-a-better-fit-on-your-training-data-can-predict-worse.md _notes\why-deep-sigmoid-gradients-vanish.md _notes\why-your-most-central-node-depends-on-the-measure.md _notes\why-ignoring-censored-patients-biases-survival-estimates.md docs\notes-review-ledger.yml
git commit -m "Rewrite modelling notes around reader questions" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 10: Operations and energy notes

**Files:**
- Modify: `_notes/why-battery-arbitrage-needs-a-price-spread-not-just-a-gap.md`
- Modify: `_notes/why-nameplate-capacity-overstates-what-a-plant-delivers.md`
- Modify: `_notes/why-solar-can-collapse-the-electricity-price-to-zero.md`
- Modify: `_notes/why-pooling-warehouses-can-halve-safety-stock.md`
- Modify: `docs/notes-review-ledger.yml`

**Interfaces:**
- Produces: four schema-2 notes with correct units, bounded energy-market claims, and verified operational formulas

- [ ] **Step 1: Migrate battery-arbitrage note**

Recompute `P_high = P_low / η` and the `1 / 0.85 = 1.1765` floor. State whether efficiency is AC-to-AC or DC-to-DC, distinguish gross spread from revenue after degradation and market costs, and cite accessible storage-arbitrage research.

- [ ] **Step 2: Migrate capacity-factor note**

Verify annual-energy calculations in MWh, state the time basis, and distinguish capacity factor from availability and efficiency. Use IEA/NEA or IRENA reports with stable URLs and record report edition.

- [ ] **Step 3: Migrate merit-order note**

Bound zero-price claims to markets with marginal pricing and the stated bid stack. Distinguish zero from negative prices, cite an ISO or regulator source plus a power-system economics reference, and confirm the widget dispatch order.

- [ ] **Step 4: Migrate inventory-pooling note**

Recompute the square-root law example, make independence assumptions explicit, and show how positive correlation changes the result. Cite Maister’s original result and an accessible inventory-management treatment.

- [ ] **Step 5: Review units, widgets, sources, and voice**

Every axis, input, table, and worked number has a unit. Every note has a distinct opening and section order. Source links are checked and ledger entries contain arithmetic and widget parity evidence.

- [ ] **Step 6: Validate, build, and commit**

Run:

```powershell
ruby scripts\validate-notes.rb
bundle exec jekyll build
```

Then commit:

```powershell
git add _notes\why-battery-arbitrage-needs-a-price-spread-not-just-a-gap.md _notes\why-nameplate-capacity-overstates-what-a-plant-delivers.md _notes\why-solar-can-collapse-the-electricity-price-to-zero.md _notes\why-pooling-warehouses-can-halve-safety-stock.md docs\notes-review-ledger.yml
git commit -m "Clarify operations and energy notes" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 11: Decision, causal, and visual notes

**Files:**
- Modify: `_notes/correlation-decides-your-diversification-benefit.md`
- Modify: `_notes/what-a-shadow-price-actually-tells-you.md`
- Modify: `_notes/aggregating-across-groups-can-flip-treatments.md`
- Modify: `_notes/why-a-non-zero-y-axis-can-turn-a-flat-trend-into-a-crisis.md`
- Modify: `docs/notes-review-ledger.yml`

**Interfaces:**
- Produces: four schema-2 notes whose assumptions and decision limits are explicit

- [ ] **Step 1: Migrate diversification note**

Recompute portfolio variance and volatility for the displayed correlations. Distinguish diversification from simply adding asset count. Cite Markowitz and an accessible portfolio-theory reference.

- [ ] **Step 2: Migrate shadow-price note**

Re-solve the linear program around the stated resource range, identify the allowable range where the shadow price holds, and distinguish a dual value from an accounting price.

- [ ] **Step 3: Migrate Simpson’s-paradox note**

Recalculate all subgroup and aggregate rates. Separate confounding from every instance of Simpson’s reversal, and state that stratification can introduce collider bias. Cite Simpson and a causal-graph source.

- [ ] **Step 4: Migrate chart-axis note**

Recompute the distortion factor, distinguish bar/area encodings from line charts, and cite graphical-perception evidence without overstating what the cited experiment proves.

- [ ] **Step 5: Review batch diversity and evidence**

Remove generic setup headings and repeated callout cadence. Confirm every formal claim has an inline source reference, every widget matches article values, and ledger records all checks.

- [ ] **Step 6: Validate, build, and commit**

Run:

```powershell
ruby scripts\validate-notes.rb
bundle exec jekyll build
```

Then commit:

```powershell
git add _notes\correlation-decides-your-diversification-benefit.md _notes\what-a-shadow-price-actually-tells-you.md _notes\aggregating-across-groups-can-flip-treatments.md _notes\why-a-non-zero-y-axis-can-turn-a-flat-trend-into-a-crisis.md docs\notes-review-ledger.yml
git commit -m "Strengthen decision and causal notes" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 12: Retail notes and final schema cutover

**Files:**
- Modify: `_notes/why-confidence-lies-and-lift-tells-the-truth.md`
- Modify: `_notes/why-price-sensitivity-sets-your-optimal-markup.md`
- Modify: `_notes/why-targeting-likely-buyers-wastes-your-promo-budget.md`
- Modify: `_layouts/note.html`
- Modify: `scripts/validate-notes.rb`
- Modify: `test/validate_notes_test.rb`
- Modify: `docs/notes-review-ledger.yml`

**Interfaces:**
- Produces: final three schema-2 notes
- Produces: strict-only source renderer with no legacy branch
- Produces: validator strict mode inferred for the entire corpus

- [ ] **Step 1: Migrate confidence/lift note**

Recompute support, confidence, baseline prevalence, and lift for both baskets. Define directionality of association rules, explain why lift above one matters, and cite the original association-rule and lift work.

- [ ] **Step 2: Migrate elasticity/markup note**

Re-derive the Lerner condition with the note’s sign convention. State the assumptions behind constant elasticity and marginal cost. Recompute every price shown by the widget and cite Lerner plus a current pricing reference.

- [ ] **Step 3: Migrate uplift note**

Recalculate treatment and control response differences for all four segments. Distinguish response propensity from incremental effect and state randomisation/identification assumptions.

- [ ] **Step 4: Complete review ledger and source checks**

Confirm the ledger has exactly 20 note keys and no `pending`, `unknown`, unresolved author confirmation, or missing source status. Run every external URL check and record manually verified exceptions.

- [ ] **Step 5: Remove source compatibility rendering**

Delete the flat-string source branch from `_layouts/note.html`. Every note now renders structured sources.

- [ ] **Step 6: Make strict validation explicit in tests**

Add a fixture containing only schema-2 notes and assert `strict` is inferred. Add a fixture with one legacy note among migrated notes and assert migration mode warns; then assert the real repository has no warning when the CLI runs.

- [ ] **Step 7: Run full content validation**

Run:

```powershell
ruby test\validate_notes_test.rb
node --test test\notes_index_test.cjs
ruby scripts\validate-notes.rb
bundle exec jekyll build
```

Expected: all tests pass and the validator prints no legacy-schema warning.

- [ ] **Step 8: Commit final content batch**

```powershell
git add _notes\why-confidence-lies-and-lift-tells-the-truth.md _notes\why-price-sensitivity-sets-your-optimal-markup.md _notes\why-targeting-likely-buyers-wastes-your-promo-budget.md _layouts\note.html scripts\validate-notes.rb test\validate_notes_test.rb docs\notes-review-ledger.yml
git commit -m "Complete sourced Notes corpus migration" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 13: Full integration, accessibility, and independent review

**Files:**
- Review: `notes/index.html`
- Review: `_layouts/note.html`
- Review: `_layouts/note-hub.html`
- Review: `_includes/note-card.html`
- Review: `_includes/note-hub-card.html`
- Review: `_tailwind/input.css`
- Review: `assets/js/notes.js`
- Review: `assets/js/notes-index.js`
- Modify: `assets/css/tailwind.css`

**Interfaces:**
- Consumes: complete schema-2 corpus and Curious Systems templates
- Produces: verified production build with no unresolved high-confidence review finding

- [ ] **Step 1: Run all local automated checks**

Run:

```powershell
ruby test\validate_notes_test.rb
node --test test\notes_index_test.cjs
ruby scripts\validate-notes.rb
npm run css
bundle exec jekyll build
git --no-pager diff --check
```

Expected: every command exits 0; validator emits no legacy warnings; diff check is silent.

- [ ] **Step 2: Start the production-equivalent local site**

Run Jekyll with production environment in a detached process:

```powershell
$env:JEKYLL_ENV = 'production'
bundle exec jekyll serve --no-watch
```

Verify `http://localhost:4000/notes/` returns HTTP 200 before browser testing.

- [ ] **Step 3: Test representative pages at four widths**

Check 360×800, 768×1024, 1280×800, and 1512×982:

- `/notes/`
- `/notes/azure-ai-architecture/`
- `/notes/why-your-privacy-budget-shrinks-with-every-query/`
- `/notes/before-you-build-an-agent-decide-whether-you-should/`

At each width confirm no document-level horizontal overflow, logical content order, visible focus, readable source entries, bounded artwork, and stable layout during image load.

- [ ] **Step 4: Test all interactions**

- Combine every index filter dimension and reset to all.
- Compare privacy widget readout at `k=1`, `k=10`, and `k=50` on index and article.
- Open/close desktop and mobile contents navigation.
- Enable recall mode, mark one question “Got it,” reload, and confirm persistence.
- Disable JavaScript and confirm all notes, sources, derivations, and widget fallback text remain readable.
- Emulate reduced motion and confirm entrance/transform animation is disabled.

- [ ] **Step 5: Inspect semantics and accessibility**

For each representative page, confirm:

- One H1 and monotonic heading hierarchy.
- Main, navigation, article, complementary, and footer landmarks are appropriate.
- Decorative marks have empty alt text.
- Filter groups have names, button state, and live result count.
- Source links disclose external destinations to assistive technology.
- Touch targets meet 44×44 CSS pixels.

- [ ] **Step 6: Recheck content invariants**

Run:

```powershell
rg --line-number "^## The setup" _notes
rg --line-number "pending|unknown|unresolved" docs\notes-review-ledger.yml
```

Expected: both searches return no matches.

Review built HTML for accidental KaTeX/currency pairing and unintended tables:

```powershell
rg --line-number "\\$[0-9]" _notes
rg --line-number "<table" _site\notes
```

Inspect each currency match to confirm it follows the existing bold-isolation rule.

- [ ] **Step 7: Run independent code review**

Invoke the code-review specialist against the full diff from the pre-implementation commit. Fix only high-confidence correctness, accessibility, security, data-loss, sourcing-rendering, or regression findings. Re-run Steps 1–6 after fixes.

- [ ] **Step 8: Request GitHub Actions verification**

Push the implementation branch, inspect the “Build and deploy site” workflow, and retrieve failed job logs if any job fails. Do not claim deployment success until the workflow and Pages deployment both succeed.

- [ ] **Step 9: Commit integration fixes**

```powershell
git add notes _layouts _includes _tailwind assets scripts test docs\notes-review-ledger.yml .github\workflows\pages.yml
git commit -m "Verify Curious Systems Notes release" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

- [ ] **Step 10: Final completion check**

Run:

```powershell
git --no-pager status --short
git --no-pager log --oneline -12
```

Expected: no uncommitted implementation files. The ignored visual-companion workspace may remain outside version control until the brainstorming server is stopped.
