import { Directive, ElementRef, HostListener, inject, input, OnDestroy } from '@angular/core';

export type PkTooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type PkTooltipType = 'primary' | 'success' | 'danger' | 'info';

@Directive({
  selector: '[pkTooltip]',
})
export class PkTooltip implements OnDestroy {
  pkTooltip         = input.required<string>();
  pkTooltipPosition = input<PkTooltipPosition>('top');
  pkTooltipType     = input<PkTooltipType>('primary');

  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private tooltipEl: HTMLDivElement | null = null;

  @HostListener('mouseenter')
  onMouseEnter(): void { this.show(); }

  @HostListener('mouseleave')
  onMouseLeave(): void { this.hide(); }

  @HostListener('focusin')
  onFocusIn(): void { this.show(); }

  @HostListener('focusout')
  onFocusOut(): void { this.hide(); }

  ngOnDestroy(): void {
    this.hide();
  }

  private show(): void {
    const text = this.pkTooltip();
    if (!text || this.tooltipEl) return;

    const tooltip = document.createElement('div');
    tooltip.className = [
      'pk-tooltip-box',
      `pk-tooltip-box--${this.pkTooltipPosition()}`,
      `pk-tooltip-box--${this.pkTooltipType()}`,
    ].join(' ');
    tooltip.textContent = text;
    tooltip.style.visibility = 'hidden';
    document.body.appendChild(tooltip);
    this.tooltipEl = tooltip;

    this.reposition();
    tooltip.style.visibility = '';
  }

  private reposition(): void {
    const tooltip = this.tooltipEl;
    if (!tooltip) return;

    const host = (this.hostEl.nativeElement as HTMLElement).getBoundingClientRect();
    const tip  = tooltip.getBoundingClientRect();
    const gap  = 8;
    let top: number;
    let left: number;

    switch (this.pkTooltipPosition()) {
      case 'bottom':
        top  = host.bottom + gap;
        left = host.left + (host.width - tip.width) / 2;
        break;
      case 'left':
        top  = host.top + (host.height - tip.height) / 2;
        left = host.left - tip.width - gap;
        break;
      case 'right':
        top  = host.top + (host.height - tip.height) / 2;
        left = host.right + gap;
        break;
      default: // top
        top  = host.top - tip.height - gap;
        left = host.left + (host.width - tip.width) / 2;
    }

    tooltip.style.top  = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  private hide(): void {
    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
  }
}
