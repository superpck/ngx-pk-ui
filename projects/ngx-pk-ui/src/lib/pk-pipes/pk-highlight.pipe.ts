import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

/**
 * Wraps occurrences of `search` in `<mark class="pk-highlight">…</mark>`.
 * The `value` is HTML-escaped before matching to prevent XSS.
 * Use with `[innerHTML]` binding, not `{{ }}` interpolation.
 *
 * ```html
 * <span [innerHTML]="item.name | pkHighlight: query"></span>
 * ```
 */
@Pipe({ name: 'pkHighlight', standalone: true, pure: true })
export class PkHighlightPipe implements PipeTransform {
  private readonly _san = inject(DomSanitizer);

  transform(value: string | null | undefined, search: string | null | undefined): SafeHtml {
    if (!value) return '';
    // HTML-escape the raw value first to prevent XSS
    const safe = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    if (!search?.trim()) return this._san.bypassSecurityTrustHtml(safe);
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const html = safe.replace(
      new RegExp(`(${escaped})`, 'gi'),
      '<mark class="pk-highlight">$1</mark>',
    );
    return this._san.bypassSecurityTrustHtml(html);
  }
}
