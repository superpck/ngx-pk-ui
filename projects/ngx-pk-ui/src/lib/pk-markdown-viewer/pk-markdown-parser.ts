// ─── Lightweight Markdown → HTML parser ─────────────────────────────────────
// Pure function — no external dependencies.

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineFormat(text: string): string {
  const tokens: string[] = [];
  const save = (html: string): string => {
    tokens.push(html);
    return `\u0000${tokens.length - 1}\u0000`;
  };

  // Inline code — save before escaping
  text = text.replace(/`([^`]+)`/g, (_, c) => save(`<code>${esc(c)}</code>`));

  // Images — save before escaping
  text = text.replace(
    /!\[([^\]]*)\]\(([^)\s"]+)(?:\s+"([^"]*)")?\)/g,
    (_, alt, src, title) =>
      save(
        `<img src="${src}" alt="${esc(alt)}"${title ? ` title="${esc(title)}"` : ''} style="max-width:100%">`,
      ),
  );

  // Links — save before escaping
  text = text.replace(
    /\[([^\]]+)\]\(([^)\s"]+)(?:\s+"([^"]*)")?\)/g,
    (_, t, href, title) =>
      save(
        `<a href="${href}"${title ? ` title="${esc(title)}"` : ''} target="_blank" rel="noopener noreferrer">${esc(t)}</a>`,
      ),
  );

  // Escape remaining HTML entities
  text = esc(text);

  // Bold + Italic
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  text = text.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  text = text.replace(/(?<!\w)_([^_\n]+)_(?!\w)/g, '<em>$1</em>');
  // Strikethrough
  text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Restore saved tokens
  return text.replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[+i]);
}

export function parseMarkdown(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Fenced code block ───────────────────────────────────────────────────
    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(esc(lines[i]));
        i++;
      }
      out.push(
        `<pre><code${lang ? ` class="language-${esc(lang)}"` : ''}>${code.join('\n')}</code></pre>`,
      );
      i++; // skip closing ```
      continue;
    }

    // ── Heading ─────────────────────────────────────────────────────────────
    const hm = line.match(/^(#{1,6})\s+(.*)/);
    if (hm) {
      const lvl = hm[1].length;
      const raw = hm[2].trim();
      const id = raw
        .toLowerCase()
        .replace(/`[^`]*`|\*\*|__|\*|_|~~|!\[[^\]]*\]\([^)]*\)|\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      out.push(`<h${lvl} id="${id}">${inlineFormat(raw)}</h${lvl}>`);
      i++;
      continue;
    }

    // ── Horizontal rule (---, ***, ___) ─────────────────────────────────────
    if (/^(---+|\*\*\*+|___+)\s*$/.test(line)) {
      out.push('<hr>');
      i++;
      continue;
    }

    // ── Blockquote ───────────────────────────────────────────────────────────
    if (line.startsWith('>')) {
      const bq: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        bq.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote>${parseMarkdown(bq.join('\n'))}</blockquote>`);
      continue;
    }

    // ── Unordered list ───────────────────────────────────────────────────────
    if (/^[-*+] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+] /.test(lines[i])) {
        items.push(`<li>${inlineFormat(lines[i].replace(/^[-*+] /, ''))}</li>`);
        i++;
      }
      out.push(`<ul>\n${items.join('\n')}\n</ul>`);
      continue;
    }

    // ── Ordered list ─────────────────────────────────────────────────────────
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${inlineFormat(lines[i].replace(/^\d+\. /, ''))}</li>`);
        i++;
      }
      out.push(`<ol>\n${items.join('\n')}\n</ol>`);
      continue;
    }

    // ── Table ────────────────────────────────────────────────────────────────
    if (line.includes('|') && i + 1 < lines.length && /^[\|:\- ]+$/.test(lines[i + 1])) {
      const sepCols = lines[i + 1].split('|').filter(c => c.trim());
      const aligns = sepCols.map(c => {
        const t = c.trim();
        if (t.startsWith(':') && t.endsWith(':')) return 'center';
        if (t.endsWith(':')) return 'right';
        return 'left';
      });
      const heads = line
        .split('|')
        .filter(c => c.trim())
        .map(
          (c, ci) =>
            `<th style="text-align:${aligns[ci] ?? 'left'}">${inlineFormat(c.trim())}</th>`,
        );
      out.push(`<table>\n<thead>\n<tr>${heads.join('')}</tr>\n</thead>\n<tbody>`);
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        const cells = lines[i]
          .split('|')
          .filter(c => c.trim())
          .map(
            (c, ci) =>
              `<td style="text-align:${aligns[ci] ?? 'left'}">${inlineFormat(c.trim())}</td>`,
          );
        out.push(`<tr>${cells.join('')}</tr>`);
        i++;
      }
      out.push(`</tbody>\n</table>`);
      continue;
    }

    // ── Empty line ───────────────────────────────────────────────────────────
    if (line.trim() === '') {
      i++;
      continue;
    }

    // ── Paragraph ────────────────────────────────────────────────────────────
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,6} /.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^>/.test(lines[i]) &&
      !/^[-*+] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !/^(---+|\*\*\*+|___+)\s*$/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    if (para.length) {
      out.push(`<p>${inlineFormat(para.join('<br>'))}</p>`);
    }
  }

  return out.join('\n');
}

/** Build a full HTML document string from parsed markdown (used for print / HTML export). */
export function buildHtmlDocument(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
           max-width: 860px; margin: 40px auto; padding: 0 24px;
           color: #1a1a1a; line-height: 1.7; font-size: 16px; }
    h1, h2, h3, h4, h5, h6 { margin: 1.6em 0 0.4em; line-height: 1.3; font-weight: 600; }
    h1 { font-size: 2em; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.2em; }
    h3 { font-size: 1.25em; }
    p { margin: 0.8em 0; }
    a { color: #2563eb; text-decoration: underline; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px;
           font-size: 0.875em; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace; }
    pre { background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 8px;
          overflow-x: auto; margin: 1.2em 0; font-size: 0.875em; line-height: 1.6; }
    pre code { background: none; padding: 0; color: inherit; font-size: inherit; }
    blockquote { border-left: 4px solid #3b82f6; margin: 1em 0; padding: 4px 0 4px 16px;
                 color: #6b7280; }
    blockquote p { margin: 0.3em 0; }
    ul, ol { padding-left: 1.5em; margin: 0.8em 0; }
    li { margin: 0.25em 0; }
    table { border-collapse: collapse; width: 100%; margin: 1.2em 0; font-size: 0.95em; }
    th, td { border: 1px solid #e5e7eb; padding: 8px 12px; }
    th { background: #f9fafb; font-weight: 600; }
    tr:nth-child(even) td { background: #fafafa; }
    img { max-width: 100%; height: auto; border-radius: 4px; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 2em 0; }
    del { opacity: 0.6; }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}
