import { AfterContentInit, Component, contentChildren, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { PkAccordionItem } from './pk-accordion-item';

@Component({
  selector: 'pk-accordion',
  imports: [NgTemplateOutlet],
  templateUrl: './pk-accordion.html',
  styleUrl: './pk-accordion.css',
})
export class PkAccordion implements AfterContentInit {
  items = contentChildren(PkAccordionItem);

  /** Allow multiple panels to be open simultaneously */
  multi = input<boolean>(false);

  ngAfterContentInit(): void {
    this.items().forEach(item => item._isOpen.set(item.open()));
  }

  toggle(index: number): void {
    const items = this.items();
    const item = items[index];
    if (item.disabled()) return;

    const next = !item._isOpen();

    if (!this.multi()) {
      items.forEach((it, i) => { if (i !== index) it._isOpen.set(false); });
    }

    item._isOpen.set(next);
  }
}
