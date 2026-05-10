import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'pk-timeline-item',
  standalone: true,
  styleUrl: './pk-timeline-item.css',
  host: {
    class: 'pk-timeline__item',
    '[class.pk-timeline__item--last]': '_isLast()',
    '[class.pk-timeline__item--active]': 'active()',
  },
  template: `
    <div class="pk-timeline__label-col">
      <span class="pk-timeline__label">{{ label() }}</span>
      @if (sublabel()) {
        <span class="pk-timeline__sublabel">{{ sublabel() }}</span>
      }
    </div>

    <div class="pk-timeline__connector">
      <div class="pk-timeline__dot"
           [class.pk-timeline__dot--filled]="active() && !image()"
           [class.pk-timeline__dot--image]="!!image()"
           [style.--_dot-color]="dotColor() || null"
           [style.border-color]="!active() && !image() ? (dotColor() || null) : null">
        @if (image()) {
          <img class="pk-timeline__dot-img" [src]="image()" alt="" />
        } @else if (icon()) {
          <span class="material-symbols-outlined pk-timeline__dot-icon">{{ icon() }}</span>
        }
      </div>
      @if (!_isLast()) {
        <div class="pk-timeline__line"
             [class.pk-timeline__line--dashed]="_lineStyle() === 'dashed'"></div>
      }
    </div>

    <div class="pk-timeline__content">
      <ng-content />
    </div>
  `,
})
export class PkTimelineItem {
  label     = input<string>('');
  sublabel  = input<string>('');
  icon      = input<string>('');
  image     = input<string>('');
  dotColor  = input<string>('');
  active    = input<boolean>(false);

  /** Set internally by PkTimeline parent */
  _isLast    = signal(false);
  _lineStyle = signal<'solid' | 'dashed'>('solid');
}
