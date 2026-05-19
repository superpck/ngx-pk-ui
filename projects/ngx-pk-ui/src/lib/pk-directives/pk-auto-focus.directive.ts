import { AfterViewInit, booleanAttribute, Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Focuses the host element after the view initialises.
 * Set `[pkAutoFocus]="false"` to disable conditionally.
 *
 * ```html
 * <input pkAutoFocus />
 * <input [pkAutoFocus]="isDialogOpen()" />
 * ```
 */
@Directive({ selector: '[pkAutoFocus]', standalone: true })
export class PkAutoFocusDirective implements AfterViewInit {
  /**
   * Set to `false` to disable auto-focus (e.g. conditionally in a modal).
   * Defaults to `true`.
   */
  readonly pkAutoFocus = input(true, { transform: booleanAttribute });

  private readonly _el = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    if (this.pkAutoFocus()) {
      // Defer one tick so the element is fully rendered/visible.
      setTimeout(() => this._el.nativeElement.focus(), 0);
    }
  }
}
