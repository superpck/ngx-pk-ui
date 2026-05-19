import { Directive, HostListener, input, OnDestroy, output } from '@angular/core';

/**
 * Debounces click events on the host element.
 * `[pkDebounceClick]` sets the delay in ms (default 300).
 * `(pkDebounceClicked)` fires after the debounce window.
 *
 * ```html
 * <!-- 300 ms default -->
 * <button pkDebounceClick (pkDebounceClicked)="search()">Search</button>
 *
 * <!-- custom delay -->
 * <button [pkDebounceClick]="500" (pkDebounceClicked)="save()">Save</button>
 * ```
 */
@Directive({ selector: '[pkDebounceClick]', standalone: true })
export class PkDebounceClickDirective implements OnDestroy {
  /** Debounce delay in milliseconds. Default: `300`. */
  readonly pkDebounceClick = input<number>(300);

  /** Emits once after the debounce window completes. */
  readonly pkDebounceClicked = output<void>();

  private _timer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('click')
  _onClick(): void {
    if (this._timer !== null) {
      clearTimeout(this._timer);
    }
    this._timer = setTimeout(() => {
      this._timer = null;
      this.pkDebounceClicked.emit();
    }, this.pkDebounceClick());
  }

  ngOnDestroy(): void {
    if (this._timer !== null) {
      clearTimeout(this._timer);
    }
  }
}
