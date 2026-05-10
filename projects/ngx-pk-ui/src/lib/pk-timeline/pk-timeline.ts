import { AfterContentInit, Component, contentChildren, effect, input } from '@angular/core';
import { PkTimelineItem } from './pk-timeline-item';

@Component({
  selector: 'pk-timeline',
  standalone: true,
  imports: [PkTimelineItem],
  styleUrl: './pk-timeline.css',
  host: {
    class: 'pk-timeline',
    '[class.pk-timeline--horizontal]': 'direction() === "horizontal"',
    '[class.pk-timeline--vertical]': 'direction() === "vertical"',
  },
  template: `<ng-content />`,
})
export class PkTimeline implements AfterContentInit {
  direction = input<'vertical' | 'horizontal'>('vertical');
  lineStyle = input<'solid' | 'dashed'>('solid');

  items = contentChildren(PkTimelineItem);

  constructor() {
    effect(() => {
      const items = this.items();
      const last = items.length - 1;
      const ls = this.lineStyle();
      items.forEach((item, i) => {
        item._isLast.set(i === last);
        item._lineStyle.set(ls);
      });
    });
  }

  ngAfterContentInit(): void {}
}
