import {
  AfterContentInit,
  Component,
  contentChildren,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { PkSplitPanel } from './pk-split-panel';
import type { PkSplitDirection } from './pk-split.model';

@Component({
  selector: 'pk-split',
  imports: [NgTemplateOutlet],
  templateUrl: './pk-split.html',
  styleUrl: './pk-split.css',
})
export class PkSplit implements AfterContentInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);

  panels = contentChildren(PkSplitPanel);

  /** Layout direction — 'horizontal' (left/right) or 'vertical' (top/bottom) */
  direction = input<PkSplitDirection>('horizontal');

  /** Initial size of the first panel as a percentage (0–100) */
  initialSize = input<number>(50);

  /** Minimum percentage each panel can shrink to */
  minSize = input<number>(10);

  /** Divider thickness in pixels */
  gutterSize = input<number>(6);

  /** Emits [sizeA%, sizeB%] after each drag */
  readonly sizeChange = output<[number, number]>();

  readonly sizeA = signal(50);
  readonly sizeB = signal(50);
  readonly dragging = signal(false);

  ngAfterContentInit(): void {
    const init = Math.max(0, Math.min(100, this.initialSize()));
    this.sizeA.set(init);
    this.sizeB.set(100 - init);
  }

  ngOnDestroy(): void {
    this.removeListeners();
  }

  onGutterMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this.dragging.set(true);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onGutterTouchStart(e: TouchEvent): void {
    e.preventDefault();
    this.dragging.set(true);
    document.addEventListener('touchmove', this.onTouchMove, { passive: false });
    document.addEventListener('touchend', this.onTouchEnd);
  }

  private readonly onMouseMove = (e: MouseEvent): void => {
    this.resize(e.clientX, e.clientY);
  };

  private readonly onMouseUp = (): void => {
    this.dragging.set(false);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  private readonly onTouchMove = (e: TouchEvent): void => {
    if (e.touches.length < 1) return;
    e.preventDefault();
    this.resize(e.touches[0].clientX, e.touches[0].clientY);
  };

  private readonly onTouchEnd = (): void => {
    this.dragging.set(false);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  };

  private resize(clientX: number, clientY: number): void {
    const rect = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    const min = this.minSize();
    const gutter = this.gutterSize();

    let a: number;
    if (this.direction() === 'horizontal') {
      a = ((clientX - rect.left - gutter / 2) / (rect.width - gutter)) * 100;
    } else {
      a = ((clientY - rect.top - gutter / 2) / (rect.height - gutter)) * 100;
    }

    a = Math.max(min, Math.min(100 - min, a));
    this.sizeA.set(a);
    this.sizeB.set(100 - a);
    this.sizeChange.emit([a, 100 - a]);
  }

  private removeListeners(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  }
}
