--[[
  Pandoc Lua filter: map the notes' HTML components onto the LaTeX
  environments in docs/notes-preamble.tex.

  The web components are authored as raw HTML in Markdown (kramdown style),
  so Pandoc sees them as RawBlock elements rather than Divs. This filter
  rewrites the opening and closing tags into environment delimiters and lets
  the Markdown between them convert normally.
]]

local function opens(html, class)
  return html:match('class="[^"]*' .. class .. '[^"]*"') ~= nil
end

-- Maps a detected class to its LaTeX environment.
local function env_for(html)
  if opens(html, 'callout%-key')   then return 'keybox'     end
  if opens(html, 'callout%-warn')  then return 'warnbox'    end
  if opens(html, 'callout%-note')  then return 'notebox'    end
  if opens(html, 'reveal%-recall') then return 'recall'     end
  if opens(html, 'reveal')         then return 'derivation' end
  if opens(html, 'widget')         then return 'widgetstub' end
  return nil
end

-- Track how deep we are so closing tags pair with the right environment.
local stack = {}

function RawBlock(el)
  if el.format ~= 'html' then return nil end
  local html = el.text

  local env = env_for(html)
  if env and html:match('^%s*<') and not html:match('^%s*</') then
    table.insert(stack, env)
    if env == 'widgetstub' then
      return pandoc.RawBlock('latex',
        '\\begin{widgetstub}\\footnotesize\\textsc{interactive figure} --- ' ..
        'this note has a live version at the URL above.\\par')
    end
    return pandoc.RawBlock('latex', '\\begin{' .. env .. '}')
  end

  if html:match('^%s*</div>') or html:match('^%s*</details>') then
    local top = table.remove(stack)
    if top then return pandoc.RawBlock('latex', '\\end{' .. top .. '}') end
    return pandoc.RawBlock('latex', '')
  end

  -- Drop everything else that is web-only: canvases, sliders, summaries.
  if html:match('<canvas') or html:match('<input') or html:match('<script')
     or html:match('widget%-noscript') then
    return pandoc.RawBlock('latex', '')
  end

  -- <summary> carries the question on a recall card; keep it as bold text.
  local summary = html:match('<summary[^>]*>(.-)</summary>')
  if summary then
    summary = summary:gsub('<[^>]->', ''):gsub('%s+', ' ')
    return pandoc.RawBlock('latex', '\\textbf{' .. summary .. '}\\par')
  end

  return pandoc.RawBlock('latex', '')
end

-- kramdown needs the colon in a span IAL ({: .source-ref}); Pandoc only accepts
-- link attributes without it ({.source-ref}) and leaves the kramdown form as
-- literal text next to the link. Both forms were checked against
-- kramdown-parser-gfm and pandoc 3.11, and no single spelling satisfies both,
-- so the notes keep the kramdown syntax the site needs and this filter folds
-- the residual tokens back into the link they belong to. Only the source-ref
-- IAL is matched; every other brace token is left alone.
local function source_ref_ial(inlines, index)
  local first = inlines[index]
  if not first or first.t ~= 'Str' then return nil end

  local compact = first.text:match('^{:%s*%.source%-ref}(.*)$')
  if compact then return 1, compact end

  if first.text ~= '{:' then return nil end

  local space, class = inlines[index + 1], inlines[index + 2]
  if space and space.t == 'Space' and class and class.t == 'Str' then
    local trailing = class.text:match('^%.source%-ref}(.*)$')
    if trailing then return 3, trailing end
  end

  return nil
end

function Inlines(inlines)
  local result = pandoc.Inlines({})
  local index = 1

  while index <= #inlines do
    local current = inlines[index]
    local consumed, trailing
    if current.t == 'Link' then
      consumed, trailing = source_ref_ial(inlines, index + 1)
    end

    if consumed then
      local link = current:clone()
      link.classes:insert('source-ref')
      result:insert(link)
      -- Punctuation that followed the IAL is part of the sentence, not the
      -- attribute, so put it back after the link.
      if trailing ~= '' then result:insert(pandoc.Str(trailing)) end
      index = index + 1 + consumed
    else
      result:insert(current)
      index = index + 1
    end
  end

  return result
end

-- Front-matter sources are metadata, so Pandoc never emits them on its own.
-- Append them as a list whose anchors match the web layout, so references
-- authored as [1](#source-id) stay meaningful in the PDF.
local function meta_text(value)
  if not value then return '' end
  return pandoc.utils.stringify(value)
end

function Pandoc(doc)
  local sources = doc.meta.sources
  if not sources then return doc end

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
    else
      -- Legacy schema: a source is a bare string. Keep it, rendered as a plain
      -- list item, so unmigrated notes do not silently lose their sources.
      local text = meta_text(source)
      if text ~= '' then
        table.insert(items, { pandoc.Plain(pandoc.Inlines(pandoc.Str(text))) })
      end
    end
  end

  -- An empty bullet list becomes an empty LaTeX itemize, which pdflatex
  -- rejects, and an orphaned heading reads as a rendering bug. Emit neither
  -- unless there is at least one source to show.
  if #items > 0 then
    table.insert(doc.blocks, pandoc.Header(2, 'Sources and further reading'))
    table.insert(doc.blocks, pandoc.BulletList(items))
  end

  return doc
end
