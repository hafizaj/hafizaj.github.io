# Regression tests for scripts/note-filter.lua.
#
#   ruby test/note_filter_test.rb
#
# The filter only has meaning inside Pandoc, so these tests drive the real
# binary rather than re-implementing its semantics. Pandoc is not a hard
# dependency of the site build, so every test skips when it is missing; set
# PANDOC=/path/to/pandoc to point at a non-standard install.
require "minitest/autorun"
require "open3"

class NoteFilterTest < Minitest::Test
  FILTER = File.expand_path("../scripts/note-filter.lua", __dir__)
  FROM = "markdown+raw_html+tex_math_dollars+pipe_tables".freeze

  def self.pandoc_path
    return @pandoc_path if defined?(@pandoc_path)

    candidates = [ENV["PANDOC"], "pandoc"]
    if ENV["LOCALAPPDATA"]
      candidates << File.join(ENV["LOCALAPPDATA"], "Pandoc", "pandoc.exe")
    end

    @pandoc_path = candidates.compact.find do |candidate|
      Open3.capture2e(candidate, "--version")
      true
    rescue Errno::ENOENT
      false
    end
  end

  def setup
    skip "pandoc not installed" unless self.class.pandoc_path
  end

  def convert(markdown, to:)
    stdout, stderr, status = Open3.capture3(
      self.class.pandoc_path,
      "--from=#{FROM}",
      "--to=#{to}",
      "--lua-filter=#{FILTER}",
      stdin_data: markdown
    )
    assert status.success?, "pandoc failed: #{stderr}"
    stdout
  end

  def note(front_matter, body = "Body text.\n")
    "---\ntitle: Example\n#{front_matter}---\n\n#{body}"
  end

  # --- sources list -------------------------------------------------------

  def test_structured_sources_render_anchored_numbered_entries
    latex = convert(note(<<~YAML), to: "latex")
      sources:
        - id: alpha
          title: Alpha paper
          url: https://example.com/alpha
          supports: The first claim.
    YAML

    assert_includes latex, "Sources and further reading"
    assert_includes latex, "\\begin{itemize}"
    assert_includes latex, "source-alpha"
    assert_includes latex, "1{]}"
    assert_includes latex, "Used for: The first claim."
  end

  def test_legacy_string_sources_are_kept_as_plain_items
    latex = convert(note(<<~YAML), to: "latex")
      sources:
        - "[Old paper](https://example.com/old) — the original result."
        - Another plain source
    YAML

    assert_includes latex, "Sources and further reading"
    assert_includes latex, "the original result."
    assert_includes latex, "Another plain source"
  end

  def test_mixed_schemas_keep_both_kinds_of_source
    latex = convert(note(<<~YAML), to: "latex")
      sources:
        - id: alpha
          title: Alpha paper
          url: https://example.com/alpha
          supports: The first claim.
        - Another plain source
    YAML

    assert_includes latex, "source-alpha"
    assert_includes latex, "Another plain source"
  end

  def test_empty_sources_list_emits_no_heading_and_no_empty_itemize
    latex = convert(note("sources: []\n"), to: "latex")
    html = convert(note("sources: []\n"), to: "html")

    refute_includes latex, "Sources and further reading"
    refute_includes latex, "\\begin{itemize}"
    refute_includes html, "<ul"
  end

  def test_note_without_sources_is_untouched
    latex = convert(note(""), to: "latex")

    refute_includes latex, "Sources and further reading"
    refute_includes latex, "\\begin{itemize}"
  end

  # --- source-ref citations ------------------------------------------------

  def test_kramdown_source_ref_ial_becomes_a_classed_link
    html = convert(note("", "A claim [1](#source-alpha){: .source-ref}.\n"), to: "html")

    assert_includes html, '<a href="#source-alpha" class="source-ref">1</a>'
    refute_includes html, "{:"
    refute_includes html, ".source-ref}"
  end

  def test_compact_source_ref_ial_becomes_a_classed_link
    html = convert(note("", "A claim [1](#source-alpha){:.source-ref}.\n"), to: "html")

    assert_includes html, '<a href="#source-alpha" class="source-ref">1</a>'
    refute_includes html, "{:"
  end

  def test_pandoc_native_link_attribute_still_works
    html = convert(note("", "A claim [1](#source-alpha){.source-ref}.\n"), to: "html")

    assert_includes html, '<a href="#source-alpha" class="source-ref">1</a>'
  end

  def test_unrelated_ial_tokens_are_left_alone
    html = convert(note("", "A link [1](#source-alpha){: .other} and {: .source-ref} alone.\n"), to: "html")

    assert_includes html, "{:"
    assert_includes html, ".other}"
    assert_includes html, ".source-ref}"
    refute_includes html, 'class="source-ref"'
  end
end
