import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'pk-dg-column',
  template: '<ng-content></ng-content>',
  standalone: false,
  host: {
    'style': 'display: none'
  }
})
export class PkDgColumnComponent implements AfterViewInit {
  @Input() pkDgField?: string;
  @Input() pkDgFilterKey?: string;
  @Input('style.width.px') widthPx?: number;
  
  width?: string;
  headerText: string = '';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Extract text content for header
    const nativeElement = this.el.nativeElement;
    this.headerText = nativeElement.textContent?.trim() || '';

    // @Input('style.width.px') is bypassed by Angular's style binding pipeline —
    // read from the host element's actual inline style as the reliable source
    if (!this.widthPx) {
      const styleWidth = nativeElement.style.width as string;
      if (styleWidth && styleWidth.endsWith('px')) {
        this.widthPx = parseInt(styleWidth, 10);
      }
    }
  }
}
