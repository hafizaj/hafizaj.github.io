# frozen_string_literal: true

require "fileutils"
require "minitest/autorun"
require "open3"
require "rbconfig"

class NoteContinuationTest < Minitest::Test
  ROOT = File.expand_path("..", __dir__)
  DESTINATION = File.join(ROOT, "_site", "note-continuation-test")

  def test_rendered_continuation_respects_hub_order_without_cycles
    FileUtils.rm_rf(DESTINATION)
    bundle = Gem.bin_path("bundler", "bundle")
    _stdout, stderr, status = Open3.capture3(
      RbConfig.ruby,
      bundle,
      "exec",
      "jekyll",
      "build",
      "--destination",
      DESTINATION,
      chdir: ROOT
    )
    assert status.success?, stderr

    expected_next = {
      "why-nameplate-capacity-overstates-what-a-plant-delivers" =>
        "/notes/why-solar-can-collapse-the-electricity-price-to-zero/",
      "why-solar-can-collapse-the-electricity-price-to-zero" =>
        "/notes/why-battery-arbitrage-needs-a-price-spread-not-just-a-gap/",
      "why-battery-arbitrage-needs-a-price-spread-not-just-a-gap" =>
        "/notes/why-confidence-lies-and-lift-tells-the-truth/",
      "before-you-build-an-agent-decide-whether-you-should" =>
        "/notes/microsoft-foundry-one-platform-not-three-products/",
      "microsoft-foundry-one-platform-not-three-products" =>
        "/notes/copilot-studio-multi-agent-orchestration-a2a-mcp/",
      "copilot-studio-multi-agent-orchestration-a2a-mcp" =>
        "/notes/why-your-most-central-node-depends-on-the-measure/",
      "why-confidence-lies-and-lift-tells-the-truth" =>
        "/notes/why-price-sensitivity-sets-your-optimal-markup/",
      "why-price-sensitivity-sets-your-optimal-markup" =>
        "/notes/why-targeting-likely-buyers-wastes-your-promo-budget/",
      "why-targeting-likely-buyers-wastes-your-promo-budget" => nil,
      "what-a-shadow-price-actually-tells-you" =>
        "/notes/why-pooling-warehouses-can-halve-safety-stock/"
    }

    expected_next.each do |slug, expected_href|
      actual_href = rendered_next_href(slug)
      expected_href ? assert_equal(expected_href, actual_href, slug) : assert_nil(actual_href, slug)
    end
  ensure
    FileUtils.rm_rf(DESTINATION)
  end

  private

  def rendered_next_href(slug)
    html = File.read(File.join(DESTINATION, "notes", slug, "index.html"))
    html[/<a href="([^"]+)" class="note-next-primary">/, 1]
  end
end
