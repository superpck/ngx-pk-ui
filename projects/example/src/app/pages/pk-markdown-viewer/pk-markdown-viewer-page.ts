import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkMarkdownViewer } from 'ngx-pk-ui';
import type { PkMarkdownTheme } from 'ngx-pk-ui';

const DEMO_CONTENT = `# Markdown Viewer Demo

Write or paste **Markdown** here and it renders instantly.

## Features

- Renders \`fileName\` (fetch from URL) or \`content\` (raw string)
- Toolbar with **Print**, **Export .md**, **Export .html**
- Light & Dark themes
- Zero external dependencies

## Code Example

\`\`\`typescript
import { PkMarkdownViewer } from 'ngx-pk-ui';

@Component({
  imports: [PkMarkdownViewer],
  template: \`
    <pk-markdown-viewer fileName="assets/CHANGELOG.md" />
  \`,
})
export class AppComponent {}
\`\`\`

## Table

| Input       | Type                  | Default   | Description                     |
|:------------|:---------------------:|:---------:|:--------------------------------|
| \`fileName\`  | \`string\`              | \`''\`      | URL to a \`.md\` file to fetch    |
| \`content\`   | \`string\`              | \`''\`      | Raw markdown string             |
| \`theme\`     | \`'light' \\| 'dark'\`   | \`'light'\` | Color theme                     |
| \`showToolbar\`| \`boolean\`            | \`true\`    | Show/hide the toolbar           |
| \`title\`     | \`string\`              | \`''\`      | Override toolbar title          |

## Blockquote

> **Tip:** \`content\` takes priority over \`fileName\` when both are provided.

---

*Enjoy using **ngx-pk-ui**!*
`;

@Component({
  selector: 'app-pk-markdown-viewer-page',
  imports: [PkMarkdownViewer, FormsModule],
  templateUrl: './pk-markdown-viewer-page.html',
})
export class PkMarkdownViewerPage {
  // ── Tab state ──────────────────────────────────────────────────────────────
  activeTab = signal<'file' | 'content'>('file');

  // ── File mode ──────────────────────────────────────────────────────────────
  fileTheme = signal<PkMarkdownTheme>('light');
  showFileToolbar = signal(true);

  // ── Content mode ───────────────────────────────────────────────────────────
  editorText = signal(DEMO_CONTENT);
  contentTheme = signal<PkMarkdownTheme>('light');
  showContentToolbar = signal(true);

  setTab(tab: 'file' | 'content'): void {
    this.activeTab.set(tab);
  }
}
