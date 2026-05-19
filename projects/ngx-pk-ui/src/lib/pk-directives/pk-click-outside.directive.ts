import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

/**
 * Emits `(pkClickOutside)` when the user clicks anywhere outside the host element.
 *
 * ```html
 * <div [pkClickOutside]="true" (pkClickOutside)="close()">…</div>
 * ```
 */
@Directive({ selector: '[pkClickOutside]', standalone: true })
export class PkClickOutsideDirective {
  /** Emits the MouseEvent when a click occurs outside the host element. */
  readonly pkClickOutside = output<MouseEvent>();

  private readonly _el = inject(ElementRef<HTMLElement>);

  @HostListener('document:mousedown', ['$event'])
  _onDocumentMouseDown(event: MouseEvent): void {
    if (!this._el.nativeElement.contains(event.target as Node)) {
      this.pkClickOutside.emit(event);
    }
  }
}
