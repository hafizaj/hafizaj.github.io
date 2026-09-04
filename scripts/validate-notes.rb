# frozen_string_literal: true

require "date"
require "yaml"

module NotesValidation
  Finding = Data.define(:severity, :path, :message)

  Result = Data.define(:findings, :strict) do
    def errors = findings.select { |finding| finding.severity == :error }
    def warnings = findings.select { |finding| finding.severity == :warning }
    def success? = errors.empty?
    def strict? = strict
  end

  Note = Data.define(:path, :slug, :data, :body)

  class Validator
    LEVELS = %w[foundation applied advanced].freeze
    REQUIRED_SOURCE_FIELDS = %w[id title url supports].freeze
    SOURCE_REFERENCE = /\[(?<label>[^\]]+)\]\(#source-(?<id>[^)]+)\)\{:\s*\.source-ref(?:\s+[^}]*)?\}/

    def initialize(root:, strict: nil)
      @root = File.expand_path(root)
      @strict_override = strict
      @findings = []
    end

    # Strict mode is inferred from the corpus: once every published note declares
    # source_schema 2 the collection-wide checks switch on and any remaining legacy
    # note becomes an error rather than a warning. Passing strict: overrides that.
    def call
      notes = load_notes
      published_notes = notes.select { |note| published?(note) }
      strict = @strict_override.nil? ? published_notes.all? { |note| note.data["source_schema"] == 2 } : @strict_override
      notes.each { |note| validate_note(note, strict:) }
      validate_hubs(published_notes)
      validate_collection(published_notes, strict:)
      Result.new(findings: @findings.freeze, strict:)
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
        unless data.is_a?(Hash)
          add(:error, path, "front matter must be a mapping")
          data = {}
        end
        Note.new(path, File.basename(path, ".md"), data, text[match.end(0)..])
      rescue Psych::SyntaxError => error
        add(:error, path, "invalid YAML: #{error.message}")
        Note.new(path, File.basename(path, ".md"), {}, "")
      # Psych raises DisallowedClass for values the safe loader will not build —
      # most often a bare timestamp such as `date: 2026-08-26 10:00:00`, which
      # this schema does not accept. Report it as a finding instead of letting
      # the exception escape and abort the whole run.
      rescue Psych::Exception => error
        add(:error, path, "unsupported YAML value: #{disallowed_message(error)}")
        Note.new(path, File.basename(path, ".md"), {}, "")
      end
    end

    # Psych's own message for a rejected class reads "Tried to load unspecified
    # class: Time", which is accurate but says nothing about the fix. Front
    # matter dates must be date-only scalars, so say that instead.
    def disallowed_message(error)
      return error.message unless error.is_a?(Psych::DisallowedClass)

      "#{error.message} (front matter accepts date-only scalars such as 2026-08-26, not timestamps)"
    end

    def validate_note(note, strict:)
      return unless published?(note)

      if note.data["source_schema"] == 2
        validate_migrated_note(note)
      elsif strict
        add(:error, note.path, "source_schema must be 2")
      else
        add(:warning, note.path, "legacy source schema remains")
      end
    end

    def validate_migrated_note(note)
      validate_date(note, "date")
      validate_date(note, "updated")
      add(:error, note.path, "level must be one of: #{LEVELS.join(", ")}") unless LEVELS.include?(note.data["level"])
      add(:error, note.path, "featured must be Boolean") unless [true, false].include?(note.data["featured"])

      index_order = note.data["index_order"]
      add(:error, note.path, "index_order must be a positive integer") unless index_order.is_a?(Integer) && index_order.positive?

      validate_length(note, "takeaway", 140)
      validate_length(note, "summary", 280)
      validate_sources(note)
      validate_review_date(note) if note.data["provenance"] == "professional"
    end

    def validate_date(note, field)
      value = note.data[field]
      valid = value.is_a?(Date) || (value.is_a?(String) && Date.parse(value))
      add(:error, note.path, "#{field} must be a parseable date") unless valid
    rescue Date::Error
      add(:error, note.path, "#{field} must be a parseable date")
    end

    def validate_length(note, field, maximum)
      value = note.data[field]
      if !value.is_a?(String) || value.empty?
        add(:error, note.path, "#{field} must be present")
      elsif value.length > maximum
        add(:error, note.path, "#{field} must be no greater than #{maximum} characters")
      end
    end

    def validate_sources(note)
      sources = note.data["sources"]
      structured_sources = sources.is_a?(Array) ? sources.select { |source| source.is_a?(Hash) } : []
      unless structured_sources.length >= 2
        add(:error, note.path, "sources must contain at least two structured sources")
      end

      Array(sources).each_with_index do |source, index|
        unless source.is_a?(Hash)
          add(:error, note.path, "source #{index + 1} must be a structured object")
          next
        end
        REQUIRED_SOURCE_FIELDS.each do |field|
          add(:error, note.path, "source #{index + 1} requires #{field}") if source[field].nil? || source[field].to_s.strip.empty?
        end
      end

      ids = structured_sources.filter_map { |source| source["id"] }
      add(:error, note.path, "source ids must be unique") unless ids.uniq.length == ids.length
      validate_source_references(note, ids)
    end

    def validate_source_references(note, source_ids)
      references = note.body.to_s.scan(SOURCE_REFERENCE)
      references.each do |label, id|
        add(:error, note.path, "source reference targets unknown source #{id}") unless source_ids.include?(id)
        source_index = source_ids.index(id)
        expected_number = source_index + 1 if source_index
        if !label.match?(/\A\d+\z/)
          add(:error, note.path, "source reference requires a visible reference number")
        elsif expected_number && label.to_i != expected_number
          add(:error, note.path, "source #{id} requires visible reference number #{expected_number}")
        end
      end
    end

    def validate_review_date(note)
      value = note.data["reviewed_on"]
      unless value
        add(:error, note.path, "reviewed_on is required for professional notes")
        return
      end

      reviewed_on = value.is_a?(Date) ? value : Date.parse(value.to_s)
      add(:warning, note.path, "reviewed_on is older than 180 days") if Date.today - reviewed_on > 180
    rescue Date::Error
      add(:error, note.path, "reviewed_on must be a parseable date")
    end

    def validate_collection(notes, strict:)
      return unless strict

      validate_featured(notes)
      validate_index_order(notes)
      validate_headings(notes)
    end

    def validate_featured(notes)
      return if notes.count { |note| note.data["featured"] == true } == 1

      add(:error, File.join(@root, "_notes"), "strict collection requires exactly one featured note")
    end

    def validate_index_order(notes)
      duplicates = notes
        .group_by { |note| note.data["index_order"] }
        .select { |index_order, grouped| index_order.is_a?(Integer) && index_order.positive? && grouped.length > 1 }

      duplicates.each do |index_order, grouped|
        add(:error, File.join(@root, "_notes"), "duplicate index_order #{index_order}: #{grouped.map(&:slug).join(", ")}")
      end
    end

    def validate_headings(notes)
      headings_by_note = notes.to_h { |note| [note, h2_headings(note)] }

      headings_by_note.each do |note, headings|
        add(:error, note.path, "strict notes must not contain ## The setup") if headings.include?("The setup")
      end

      headings_by_note
        .reject { |_note, headings| headings.empty? }
        .group_by { |_note, headings| headings }
        .each_value do |grouped|
          next unless grouped.length > 1

          slugs = grouped.map { |note, _headings| note.slug }
          add(:error, File.join(@root, "_notes"), "duplicate ordered H2 sequence: #{slugs.join(", ")}")
        end

      heading_notes = Hash.new { |hash, heading| hash[heading] = [] }
      headings_by_note.each do |note, headings|
        headings.uniq.each { |heading| heading_notes[heading] << note.slug }
      end
      heading_notes.each do |heading, slugs|
        next unless slugs.length > 3

        add(:warning, File.join(@root, "_notes"), "H2 '#{heading}' appears in more than three notes: #{slugs.join(", ")}")
      end
    end

    def h2_headings(note)
      note.body.to_s.each_line.filter_map do |line|
        match = line.match(/\A##[ \t]+(.+?)[ \t]*#*[ \t]*\r?\n?\z/)
        match && match[1]
      end
    end

    def validate_hubs(notes)
      path = File.join(@root, "_data", "note_hubs.yml")
      hubs = YAML.safe_load_file(path, permitted_classes: [Date], aliases: false) || {}
      unless hubs.is_a?(Hash)
        add(:error, path, "note hubs must be a mapping")
        return
      end
      notes_by_slug = notes.to_h { |note| [note.slug, note] }

      hubs.each do |hub_module, hub|
        unless hub.is_a?(Hash)
          add(:error, path, "hub #{hub_module} must be a mapping")
          next
        end

        order = hub["order"]
        unless order.is_a?(Array)
          add(:error, path, "hub #{hub_module} order must be an array")
          order = []
        end

        start = hub["start"]
        add(:error, path, "hub #{hub_module} start #{start.inspect} must exist in its order") unless start && order.include?(start)
        if start && order.include?(start) && start != order.first
          add(:error, path, "hub #{hub_module} start #{start.inspect} must be the first entry in its order")
        end

        notes.select { |note| note.data["module"] == hub_module }.each do |note|
          count = order.count(note.slug)
          add(:error, path, "hub #{hub_module} order must contain #{note.slug} exactly once") unless count == 1
        end

        order.each do |slug|
          note = notes_by_slug[slug]
          if note.nil?
            add(:error, path, "hub order slug #{slug} does not resolve to a published note")
          elsif note.data["module"] != hub_module
            add(:error, path, "hub order slug #{slug} must belong to #{hub_module}")
          end
        end

        related = hub.fetch("related", [])
        unless related.is_a?(Array)
          add(:error, path, "hub #{hub_module} related must be an array")
          next
        end
        related.each do |slug|
          if order.include?(slug)
            add(:error, path, "hub #{hub_module} related slug #{slug} must be outside its order")
          elsif !notes_by_slug.key?(slug)
            add(:error, path, "hub #{hub_module} related slug #{slug} does not resolve to a published note")
          end
        end
      end
    rescue Errno::ENOENT
      add(:error, path, "missing note hubs data")
    rescue Psych::SyntaxError => error
      add(:error, path, "invalid YAML: #{error.message}")
    rescue Psych::Exception => error
      add(:error, path, "unsupported YAML value: #{disallowed_message(error)}")
    end

    def published?(note)
      note.data["published"] != false
    end

    def add(severity, path, message)
      @findings << Finding.new(severity, relative(path), message)
    end

    def relative(path)
      path.delete_prefix("#{@root}#{File::SEPARATOR}")
    end
  end
end

if $PROGRAM_NAME == __FILE__
  result = NotesValidation::Validator.new(root: Dir.pwd).call
  result.findings.each do |finding|
    puts "#{finding.severity.to_s.upcase} #{finding.path}: #{finding.message}"
  end
  exit(result.success? ? 0 : 1)
end
