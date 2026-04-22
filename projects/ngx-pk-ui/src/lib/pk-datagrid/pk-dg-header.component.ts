import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'pk-dg-header',
  template: '<ng-content></ng-content>',
  standalone: false,
  host: {
    'style': 'display: none'
  }
})
export class PkDgHeaderComponent implements AfterViewInit {
  @Input() pkDgSort?: string;
  @Input() pkDgFilter?: string;
  @Input('style.width.px') widthPx?: number;

  width?: string;
  headerText: string = '';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const nativeElement = this.el.nativeElement;
    this.headerText = nativeElement.textContent?.trim() || '';

    if (!this.widthPx) {
      const styleWidth = nativeElement.style.width as string;
      if (styleWidth && styleWidth.endsWith('px')) {
        this.widthPx = parseInt(styleWidth, 10);
      }
    }
  }
}
