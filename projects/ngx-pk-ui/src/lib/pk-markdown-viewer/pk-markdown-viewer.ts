import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import type { PkMarkdownTheme } from './pk-markdown-viewer.model';
import { buildHtmlDocument, parseMarkdown } from './pk-markdown-parser';

@Component({
  selector: 'pk-markdown-viewer',
  imports: [],
  templateUrl: './pk-markdown-viewer.html',
  styleUrl: './pk-markdown-viewer.css',
})
export class PkMarkdownViewer implements OnDestroy {
  private readonly sanitizer  = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser  = isPlatformBrowser(this.platformId);

  // ── Inputs ───────────────────────────────────────────────────────────────
  /** URL / path to a markdown file (e.g. 'assets/CHANGELOG.md'). */
  fileName    = input<string>('');
  /** Raw markdown string to render directly. Takes priority over fileName. */
  content     = input<string>('');
  /** Color theme. */
  theme       = input<PkMarkdownTheme>('light');
  /** Show the toolbar (title, print, export). Default true. */
  showToolbar = input<boolean>(true);
  /** Override the title shown in the toolbar. */
  title       = input<string>('');

  // ── Internal state ────────────────────────────────────────────────────────
  readonly _rawContent = signal<string>('');
  readonly _loading    = signal<boolean>(false);
  readonly _error      = signal<string | null>(null);

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly _html = computed<SafeHtml>(() => {
    const html = parseMarkdown(this._rawContent());
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  readonly _displayTitle = computed(() => {
    if (this.title()) return this.title();
    if (this.fileName()) {
      const parts = this.fileName().split('/');
      return parts[parts.length - 1] ?? '';
    }
    return '';
  });

  constructor() {
    // content input takes priority
    effect(() => {
      const c = this.content();
      if (c) {
        this._rawContent.set(c);
        this._loading.set(false);
        this._error.set(null);
      }
    });

    // fileName — fetch when content is empty
    effect(() => {
      const fn = this.fileName();
      if (fn && !this.content()) {
        this._fetchFile(fn);
      }
    });
  }

  ngOnDestroy(): void {}

  // ── Actions ───────────────────────────────────────────────────────────────

  print(): void {
    if (!this.isBrowser) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    const doc = buildHtmlDocument(
      this._displayTitle() || 'Markdown',
      parseMarkdown(this._rawContent()),
    );
    win.document.open();
    win.document.write(doc);
    win.document.close();
    win.addEventListener('load', () => {
      win.focus();
      win.print();
    });
  }

  exportMarkdown(): void {
    this._download(
      this._rawContent(),
      this._baseFileName() + '.md',
      'text/markdown',
    );
  }

  exportHtml(): void {
    const doc = buildHtmlDocument(
      this._displayTitle() || 'document',
      parseMarkdown(this._rawContent()),
    );
    this._download(doc, this._baseFileName() + '.html', 'text/html');
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async _fetchFile(url: string): Promise<void> {
    if (!this.isBrowser) return;
    this._loading.set(true);
    this._error.set(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      this._rawContent.set(await res.text());
    } catch (e: unknown) {
      this._error.set(e instanceof Error ? e.message : 'Failed to load file');
    } finally {
      this._loading.set(false);
    }
  }

  private _baseFileName(): string {
    if (this.fileName()) {
      const name = this.fileName().split('/').pop() ?? 'document';
      return name.replace(/\.[^.]+$/, '');
    }
    return 'document';
  }

  private _download(content: string, filename: string, mimeType: string): void {
    if (!this.isBrowser) return;
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
