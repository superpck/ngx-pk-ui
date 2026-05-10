import { Component, ContentChildren, QueryList, AfterContentInit, Input, ElementRef, Renderer2, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { PkTabComponent } from '../pk-tab/pk-tab.component';

@Component({
  selector: 'pk-tabs',
  standalone: false,
  templateUrl: './pk-tabs.component.html',
  styleUrls: ['./pk-tabs.component.scss']
})
export class PkTabsComponent implements AfterContentInit, AfterViewInit {
  @ContentChildren(PkTabComponent) tabs!: QueryList<PkTabComponent>;
  @Input() customStyle: { [key: string]: any } = {};
  @Input() customClass: string = '';
  @Input() style: string = '';
  @Input() overflow: 'scrollx' | 'newline' = 'scrollx';
  @Output() onSelectTab = new EventEmitter<number>();

  private resizeObserver: ResizeObserver | null = null;
  private debounceResize: any;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterContentInit() {
    // ห่อด้วย setTimeout เพื่อเลื่อนการเรียก selectTab ไปรันหลัง change detection
    setTimeout(() => {
      const activeTabs = this.tabs.filter(tab => !tab.disabled && tab.active);
      if (activeTabs.length === 0 && this.tabs.first && !this.tabs.first.disabled) {
        this.selectTab(this.tabs.first);
      }
    }, 0);
  }

  ngAfterViewInit() {
    this.checkOverflowWithRetry();
    this.tabs.changes.subscribe(() => {
      this.checkOverflowWithRetry();
    });

    const header = this.el.nativeElement.querySelector('.pk-tabs-header');
    if (header) {
      this.resizeObserver = new ResizeObserver(() => {
        clearTimeout(this.debounceResize);
        this.debounceResize = setTimeout(() => {
          this.checkOverflowWithRetry();
        }, 100);
      });
      this.resizeObserver.observe(header);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    clearTimeout(this.debounceResize);
  }

  checkOverflowWithRetry(retryCount = 0) {
    setTimeout(() => {
      const header = this.el.nativeElement.querySelector('.pk-tabs-header');
      const tabs = this.el.nativeElement.querySelectorAll('.pk-tab-caption-wrapper');

      if (!header || !tabs.length) {
        if (retryCount < 3) {
          this.checkOverflowWithRetry(retryCount + 1);
        }
        return;
      }

      if (header.offsetWidth === 0 || header.offsetHeight === 0) {
        if (retryCount < 3) {
          this.checkOverflowWithRetry(retryCount + 1);
        }
        return;
      }
    }, retryCount * 100);
  }

  selectTab(selectedTab: PkTabComponent) {
    if (selectedTab.disabled) return;
    
    let index = -1;
    this.tabs.forEach((tab, i) => {
      const isSelected = tab === selectedTab;
      tab.active = isSelected;
      if (isSelected) index = i;
    });
    this.onSelectTab.emit(index);
  }
}