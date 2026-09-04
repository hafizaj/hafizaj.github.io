# frozen_string_literal: true

require "minitest/autorun"
require "tmpdir"
require "fileutils"
require "open3"
require "rbconfig"
require_relative "../scripts/validate-notes"

class ValidateNotesTest < Minitest::Test
  VALIDATOR_SCRIPT = File.expand_path("../scripts/validate-notes.rb", __dir__)

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

  def legacy_note(overrides = {})
    data = {
      "title" => "A legacy note",
      "module" => "Module A"
    }.merge(overrides)

    "---\n#{data.to_yaml.sub(/\A---\s*\n/, "")}---\n\nLegacy body.\n"
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

  def test_migrated_note_rejects_invalid_scalar_metadata
    invalid_values = {
      "date" => "not-a-date",
      "updated" => "not-a-date",
      "level" => "expert",
      "featured" => "true",
      "index_order" => 0,
      "takeaway" => "t" * 141,
      "summary" => "s" * 281
    }

    invalid_values.each do |field, value|
      with_site(notes: { field => migrated_note(field => value) }) do |root|
        messages = NotesValidation::Validator.new(root: root).call.errors.map(&:message)
        assert messages.any? { |message| message.include?(field) }, "expected an error for #{field}: #{messages}"
      end
    end
  end

  def test_migrated_note_requires_two_sources_with_unique_ids
    duplicate_sources = [
      { "id" => "same", "title" => "First", "url" => "https://example.com/1", "supports" => "One." },
      { "id" => "same", "title" => "Second", "url" => "https://example.com/2", "supports" => "Two." }
    ]
    with_site(notes: { "bad" => migrated_note("sources" => duplicate_sources) }) do |root|
      messages = NotesValidation::Validator.new(root: root).call.errors.map(&:message)
      assert messages.any? { |message| message.include?("unique") }
    end

    with_site(notes: { "bad" => migrated_note("sources" => duplicate_sources.first(1)) }) do |root|
      messages = NotesValidation::Validator.new(root: root).call.errors.map(&:message)
      assert messages.any? { |message| message.include?("at least two") }
    end

    mixed_sources = [duplicate_sources.first, "unstructured"]
    with_site(notes: { "bad" => migrated_note("sources" => mixed_sources) }) do |root|
      messages = NotesValidation::Validator.new(root: root).call.errors.map(&:message)
      assert messages.any? { |message| message.include?("at least two structured") }
    end

    with_site(notes: { "bad" => migrated_note("sources" => "not-an-array") }) do |root|
      result = NotesValidation::Validator.new(root: root).call
      messages = result.errors.map(&:message)
      assert messages.any? { |message| message.include?("at least two structured") }
    end
  end

  def test_source_references_require_known_targets_and_visible_numbers
    body = migrated_note
      .sub("#source-source-one", "#source-missing")
      .sub("[1]", "[one]")
    with_site(notes: { "bad" => body }) do |root|
      messages = NotesValidation::Validator.new(root: root).call.errors.map(&:message)
      assert messages.any? { |message| message.include?("unknown source") }
      assert messages.any? { |message| message.include?("visible reference number") }
    end
  end

  def test_source_reference_number_matches_source_order
    with_site(notes: { "bad" => migrated_note.sub("[1]", "[2]") }) do |root|
      messages = NotesValidation::Validator.new(root: root).call.errors.map(&:message)
      assert messages.any? { |message| message.include?("visible reference number 1") }
    end
  end

  def test_invalid_front_matter_is_reported
    with_site(notes: { "missing" => "No front matter", "invalid" => "---\nfoo: [\n---\n" }) do |root|
      messages = NotesValidation::Validator.new(root: root).call.errors.map(&:message)
      assert messages.any? { |message| message.include?("missing YAML front matter") }
      assert messages.any? { |message| message.include?("invalid YAML") }
    end
  end

  def test_disallowed_yaml_values_become_findings_rather_than_crashes
    timestamp_note = "---\ntitle: Timestamped\nmodule: Module A\ndate: 2026-08-26 10:30:00\n---\n\nBody.\n"
    with_site(notes: { "timestamp" => timestamp_note }) do |root|
      result = nil
      assert_silent { result = NotesValidation::Validator.new(root: root).call }
      messages = result.errors.map(&:message)
      assert messages.any? { |message| message.include?("unsupported YAML value") }, messages.to_s
      assert messages.any? { |message| message.include?("date-only scalars") }, messages.to_s
    end
  end

  def test_disallowed_yaml_values_in_hubs_become_findings
    with_site(notes: { "good" => migrated_note }) do |root|
      File.write(
        File.join(root, "_data", "note_hubs.yml"),
        "Module A:\n  start: a\n  order: [a]\n  published_at: 2026-08-26 10:30:00\n"
      )
      result = nil
      assert_silent { result = NotesValidation::Validator.new(root: root).call }
      assert result.errors.any? { |finding| finding.message.include?("unsupported YAML value") }
    end
  end

  def test_front_matter_and_hubs_must_be_mappings
    with_site(notes: { "bad" => "---\n- not-a-mapping\n---\n" }) do |root|
      result = NotesValidation::Validator.new(root: root).call
      messages = result.errors.map(&:message)
      assert messages.any? { |message| message.include?("front matter must be a mapping") }
    end

    with_site(notes: { "good" => migrated_note }, hubs: ["not-a-mapping"]) do |root|
      result = NotesValidation::Validator.new(root: root).call
      messages = result.errors.map(&:message)
      assert messages.any? { |message| message.include?("note hubs must be a mapping") }
    end
  end

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

  def test_strict_collection_rejects_setup_and_duplicate_h2_sequences
    first = migrated_note
    second = migrated_note("featured" => false, "index_order" => 2)
    first = first.sub("## A note-specific example", "## The setup")
    second = second.sub("## A note-specific example", "## The setup")

    with_site(notes: { "first" => first, "second" => second }) do |root|
      messages = NotesValidation::Validator.new(root: root, strict: true).call.errors.map(&:message)
      assert messages.any? { |message| message.include?("## The setup") }
      assert messages.any? { |message| message.include?("duplicate ordered H2 sequence") }
    end
  end

  def test_common_h2_heading_warns_after_three_notes
    notes = (1..4).to_h do |number|
      [
        "note-#{number}",
        migrated_note("featured" => number == 1, "index_order" => number)
          .sub("## A note-specific example", "## Shared explanation")
      ]
    end

    with_site(notes:) do |root|
      warnings = NotesValidation::Validator.new(root: root, strict: true).call.warnings.map(&:message)
      assert warnings.any? { |message| message.include?("Shared explanation") }
    end
  end

  def test_hub_start_order_entries_and_related_slugs_are_validated
    hubs = {
      "Module A" => {
        "start" => "missing-start",
        "order" => ["first", "missing-order", "other-module"],
        "related" => ["first", "missing-related"]
      }
    }
    notes = {
      "first" => migrated_note("featured" => true, "index_order" => 1),
      "other-module" => migrated_note("module" => "Module B", "featured" => false, "index_order" => 2)
    }

    with_site(notes:, hubs:) do |root|
      messages = NotesValidation::Validator.new(root: root, strict: true).call.errors.map(&:message)
      assert messages.any? { |message| message.include?("start") && message.include?("missing-start") }
      assert messages.any? { |message| message.include?("missing-order") && message.include?("published note") }
      assert messages.any? { |message| message.include?("other-module") && message.include?("Module A") }
      assert messages.any? { |message| message.include?("related") && message.include?("first") }
      assert messages.any? { |message| message.include?("related") && message.include?("missing-related") }
    end
  end

  def test_hub_start_is_validated_during_inferred_migration_mode
    hubs = {
      "Module A" => {
        "start" => "missing-start",
        "order" => ["first", "legacy"]
      }
    }
    notes = {
      "first" => migrated_note,
      "legacy" => legacy_note
    }

    with_site(notes:, hubs:) do |root|
      result = NotesValidation::Validator.new(root: root).call
      assert result.warnings.any? { |finding| finding.message.include?("legacy source schema") }
      assert result.errors.any? { |finding| finding.message.include?("start") && finding.message.include?("missing-start") }
    end
  end

  def test_hub_order_is_validated_during_inferred_migration_mode
    hubs = {
      "Module A" => {
        "start" => "first",
        "order" => ["first", "legacy", "missing-order"]
      }
    }
    notes = {
      "first" => migrated_note,
      "legacy" => legacy_note
    }

    with_site(notes:, hubs:) do |root|
      result = NotesValidation::Validator.new(root: root).call
      assert result.warnings.any? { |finding| finding.message.include?("legacy source schema") }
      assert result.errors.any? { |finding| finding.message.include?("missing-order") && finding.message.include?("published note") }
    end
  end

  def test_hub_related_is_validated_during_inferred_migration_mode
    hubs = {
      "Module A" => {
        "start" => "first",
        "order" => ["first", "legacy"],
        "related" => ["missing-related"]
      }
    }
    notes = {
      "first" => migrated_note,
      "legacy" => legacy_note
    }

    with_site(notes:, hubs:) do |root|
      result = NotesValidation::Validator.new(root: root).call
      assert result.warnings.any? { |finding| finding.message.include?("legacy source schema") }
      assert result.errors.any? { |finding| finding.message.include?("related") && finding.message.include?("missing-related") }
    end
  end

  def test_hub_start_must_be_first_in_order
    hubs = {
      "Module A" => {
        "start" => "second",
        "order" => ["first", "second"]
      }
    }
    notes = {
      "first" => migrated_note,
      "second" => migrated_note("featured" => false, "index_order" => 2)
    }

    with_site(notes:, hubs:) do |root|
      messages = NotesValidation::Validator.new(root: root).call.errors.map(&:message)
      assert messages.any? { |message| message.include?("start") && message.include?("first entry") }
    end
  end

  def test_stale_professional_review_date_warns
    reviewed_on = (Date.today - 181).iso8601
    note = migrated_note("provenance" => "professional", "reviewed_on" => reviewed_on)
    with_site(notes: { "professional" => note }) do |root|
      warnings = NotesValidation::Validator.new(root: root).call.warnings.map(&:message)
      assert warnings.any? { |message| message.include?("reviewed_on") && message.include?("180 days") }
    end
  end

  def test_unpublished_legacy_note_does_not_disable_inferred_strict_mode
    unpublished = "---\ntitle: Draft\npublished: false\n---\n"
    with_site(notes: { "published" => migrated_note, "draft" => unpublished }) do |root|
      result = NotesValidation::Validator.new(root: root).call
      assert_empty result.errors
      assert_empty result.warnings
    end
  end

  def test_migrated_only_corpus_infers_strict_mode
    notes = {
      "first" => migrated_note("index_order" => 1),
      "second" => migrated_note("featured" => false, "index_order" => 1)
    }

    with_site(notes:) do |root|
      result = NotesValidation::Validator.new(root: root).call
      assert result.strict?, "expected strict to be inferred for an all-schema-2 corpus"
      assert_empty result.warnings.select { |finding| finding.message.include?("legacy source schema") }
      assert result.errors.any? { |finding| finding.message.include?("duplicate index_order") },
        "collection-wide checks only run in strict mode"
    end
  end

  def test_one_legacy_note_among_migrated_notes_falls_back_to_migration_mode
    notes = {
      "first" => migrated_note("index_order" => 1),
      "second" => migrated_note("featured" => false, "index_order" => 1),
      "legacy" => legacy_note("sources" => ["Old source"])
    }

    with_site(notes:) do |root|
      result = NotesValidation::Validator.new(root: root).call
      refute result.strict?, "one legacy note must disable inferred strict mode"
      assert result.warnings.any? { |finding| finding.message.include?("legacy source schema") }
      assert_empty result.errors.select { |finding| finding.message.include?("duplicate index_order") },
        "collection-wide checks must stay off during migration"
    end
  end

  def test_repository_corpus_validates_strictly_with_no_legacy_warning
    root = File.expand_path("..", __dir__)
    result = NotesValidation::Validator.new(root: root).call

    assert result.strict?, "the repository corpus must infer strict mode"
    assert_empty result.errors.map(&:message)
    assert_empty result.warnings.map(&:message)

    stdout, stderr, status = Open3.capture3(RbConfig.ruby, VALIDATOR_SCRIPT, chdir: root)
    assert status.success?, stderr
    assert_equal "", stdout
    refute_match(/legacy/i, stdout)
  end

  def test_cli_prints_warnings_and_exits_zero_for_legacy_notes
    legacy = "---\ntitle: Legacy\nmodule: Module A\n---\n"
    with_site(notes: { "legacy" => legacy }) do |root|
      stdout, stderr, status = Open3.capture3(RbConfig.ruby, VALIDATOR_SCRIPT, chdir: root)
      assert status.success?, stderr
      assert_match(/\AWARNING _notes[\\\/]legacy\.md: legacy source schema remains\n\z/, stdout)
    end
  end

  def test_cli_prints_errors_and_exits_one
    bad_note = migrated_note("sources" => [])
    with_site(notes: { "bad" => bad_note }) do |root|
      stdout, _stderr, status = Open3.capture3(RbConfig.ruby, VALIDATOR_SCRIPT, chdir: root)
      assert_equal 1, status.exitstatus
      assert_match(/^ERROR _notes[\\\/]bad\.md: sources must contain at least two structured sources$/, stdout)
    end
  end
end
