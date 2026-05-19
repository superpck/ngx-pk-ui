import { Directive, HostListener, input, output } from '@angular/core';

/**
 * Copies `[pkCopyToClipboard]` text to the clipboard on click.
 * Emits `(pkCopied)` with `true` on success or `false` on failure.
 *
 * ```html
 * <button [pkCopyToClipboard]="shareUrl" (pkCopied)="onCopied($event)">Copy link</button>
 * ```
 */
@Directive({ selector: '[pkCopyToClipboard]', standalone: true })
export class PkCopyToClipboardDirective {
  /** Text to copy to the clipboard. */
  readonly pkCopyToClipboard = input.required<string>();

  /** Emits `true` when the copy succeeded, `false` when it failed. */
  readonly pkCopied = output<boolean>();

  @HostListener('click')
  async _onClick(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.pkCopyToClipboard());
      this.pkCopied.emit(true);
    } catch {
      this.pkCopied.emit(false);
    }
  }
}
