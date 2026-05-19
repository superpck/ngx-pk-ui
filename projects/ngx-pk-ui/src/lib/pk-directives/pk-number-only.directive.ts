import { booleanAttribute, Directive, HostListener, input } from '@angular/core';

/**
 * Restricts an `<input>` to numeric characters only.
 * Set `[pkAllowDecimal]="true"` to allow a single decimal point.
 * Set `[pkNumberOnly]="false"` to disable the restriction conditionally.
 *
 * ```html
 * <input type="text" pkNumberOnly />
 * <input type="text" pkNumberOnly [pkAllowDecimal]="true" />
 * ```
 */
@Directive({ selector: '[pkNumberOnly]', standalone: true })
export class PkNumberOnlyDirective {
  /** Set to `false` to disable the restriction. Default: `true`. */
  readonly pkNumberOnly = input(true, { transform: booleanAttribute });

  /** Allow a single decimal point. Default: `false`. */
  readonly pkAllowDecimal = input(false, { transform: booleanAttribute });

  private static readonly ALLOWED_KEYS = new Set([
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End',
  ]);

  @HostListener('keydown', ['$event'])
  _onKeyDown(event: KeyboardEvent): void {
    if (!this.pkNumberOnly()) return;
    const { key, ctrlKey, metaKey } = event;
    // Allow control shortcuts (select-all, copy, cut, paste)
    if ((ctrlKey || metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(key.toLowerCase())) return;
    // Allow navigation / editing keys
    if (PkNumberOnlyDirective.ALLOWED_KEYS.has(key)) return;
    // Allow single decimal point
    if (this.pkAllowDecimal() && key === '.') {
      const input = event.target as HTMLInputElement;
      if (!input.value.includes('.')) return;
    }
    // Block everything else that isn't a digit
    if (!/^\d$/.test(key)) event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  _onPaste(event: ClipboardEvent): void {
    if (!this.pkNumberOnly()) return;
    const text = event.clipboardData?.getData('text') ?? '';
    const re = this.pkAllowDecimal() ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
    if (!re.test(text)) event.preventDefault();
  }
}
