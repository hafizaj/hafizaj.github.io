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
