import { Component, ContentChildren, QueryList, AfterContentInit, Input, ElementRef, Renderer2, AfterViewInit, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
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
  /**
   * Shortcut to set the active-tab accent color via CSS custom properties.
   * Accepts any valid CSS color string (e.g. '#e53935', 'rgb(229,57,53)', 'teal').
   * Setting this automatically derives a 12%-opacity tint for the active background.
   * For full control, set --pk-tabs-active-color / --pk-tabs-active-bg on the host element instead.
   */
  @Input() activeColor: string = '';
  @Output() onSelectTab = new EventEmitter<number>();

  /** Merges activeColor shortcut into customStyle so the CSS variables are injected inline. */
  get resolvedStyle(): { [key: string]: any } {
    if (!this.activeColor) return this.customStyle;
    return {
      '--pk-tabs-active-color': this.activeColor,
      '--pk-tabs-active-bg': this.activeColor + '1f', // ~12% opacity hex suffix
      '--pk-tabs-hover-bg': this.activeColor + '14',  // ~8% opacity hex suffix
      ...this.customStyle
    };
  }

  private resizeObserver: ResizeObserver | null = null;
  private debounceResize: any;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);

  constructor() { }

  ngAfterContentInit() {
    // ห่อด้วย setTimeout เพื่อเลื่อนการเรียก selectTab ไปรันหลัง change detection
    setTimeout(() => {
      this.syncActiveTab();
    }, 0);

    this.tabs.changes.subscribe(() => {
      this.syncActiveTab();
    });
  }

  private syncActiveTab() {
      const activeTabs = this.tabs.filter(tab => !tab.disabled && tab.active);
      if (activeTabs.length === 0 && this.tabs.first && !this.tabs.first.disabled) {
        this.selectTab(this.tabs.first);
      } else if (activeTabs.length > 0) {
        // If there's an active tab set from outside (e.g. [active]="xxx" changed), 
        // emit it and make sure internal state matches
        const activeTab = activeTabs[0];
        let index = -1;
        this.tabs.forEach((tab, i) => {
          if (tab === activeTab) index = i;
        });
        if (index > -1) {
            this.onSelectTab.emit(index);
        }
      }
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

  syncFromChild(activeTab: PkTabComponent) {
    if (activeTab.disabled) return;
    
    let index = -1;
    this.tabs.forEach((tab, i) => {
      const isSelected = tab === activeTab;
      if (tab.active !== isSelected) {
        tab.active = isSelected;
        tab.cdr.markForCheck(); // notify Angular that the internal state changed
      }
      if (isSelected) index = i;
    });
    this.cdr.markForCheck();
    // Do not emit here, as the parent is the one that triggered the change. 
    // Emitting could cause infinite loops or duplicate updates back to parent state
  }

  selectTab(selectedTab: PkTabComponent) {
    if (selectedTab.disabled) return;
    
    let index = -1;
    this.tabs.forEach((tab, i) => {
      const isSelected = tab === selectedTab;
      if (tab.active !== isSelected) {
        tab.active = isSelected;
        tab.cdr.markForCheck(); // notify Angular that the internal state changed
      }
      if (isSelected) index = i;
    });
    this.cdr.markForCheck();
    this.onSelectTab.emit(index);
  }
}