#!/usr/bin/env bash
# Export a note to PDF using the shared LaTeX design.
#
#   ./scripts/note-to-pdf.sh _notes/ridge-shrinks-correlated-predictors.md
#
# Requires pandoc and a LaTeX distribution:
#   brew install pandoc && brew install --cask mactex-no-gui
set -euo pipefail

note="${1:?usage: note-to-pdf.sh <path-to-note.md>}"
[ -f "$note" ] || { echo "no such note: $note" >&2; exit 1; }

for bin in pandoc pdflatex; do
  command -v "$bin" >/dev/null 2>&1 || {
    echo "missing: $bin — see the header of this script" >&2; exit 1; }
done

root="$(cd "$(dirname "$0")/.." && pwd)"
out="${root}/_pdf"
mkdir -p "$out"
base="$(basename "${note%.*}")"

pandoc "$note" \
  --from=markdown+raw_html+tex_math_dollars+pipe_tables \
  --to=pdf \
  --pdf-engine=pdflatex \
  --lua-filter="${root}/scripts/note-filter.lua" \
  --include-in-header="${root}/docs/notes-preamble.tex" \
  --variable=fontsize:11pt \
  --variable=papersize:a4 \
  --variable=colorlinks:true \
  --variable=linkcolor:hjroyal \
  --output="${out}/${base}.pdf"

echo "wrote ${out}/${base}.pdf"
