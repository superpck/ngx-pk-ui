import {
  AfterContentInit,
  Component,
  contentChildren,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { PkTab } from './pk-tab';

@Component({
  selector: 'pk-tabs',
  imports: [NgTemplateOutlet],
  templateUrl: './pk-tabs.html',
  styleUrl: './pk-tabs.css',
})
export class PkTabs implements AfterContentInit {
  tabs = contentChildren(PkTab);
  activeIndex = signal(0);

  ngAfterContentInit(): void {
    const firstEnabled = this.tabs().findIndex((t) => !t.disabled());
    this.activeIndex.set(firstEnabled >= 0 ? firstEnabled : 0);
  }

  selectTab(index: number): void {
    if (!this.tabs()[index]?.disabled()) {
      this.activeIndex.set(index);
    }
  }
}
