import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PkTabs } from './pk-tabs';
import { PkTab } from './pk-tab';

@Component({
  template: `
    <pk-tabs>
      <pk-tab label="Tab 1">Content 1</pk-tab>
      <pk-tab label="Tab 2">Content 2</pk-tab>
      <pk-tab label="Tab 3" [disabled]="true">Content 3</pk-tab>
    </pk-tabs>
  `,
  imports: [PkTabs, PkTab],
})
class TestHostComponent {}

describe('PkTabs', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render tab labels', () => {
    const labels = fixture.nativeElement.querySelectorAll('.pk-tabs__nav-item');
    expect(labels.length).toBe(3);
    expect(labels[0].textContent.trim()).toBe('Tab 1');
  });

  it('should activate first tab by default', () => {
    const items = fixture.nativeElement.querySelectorAll('.pk-tabs__nav-item');
    expect(items[0].classList).toContain('pk-tabs__nav-item--active');
  });

  it('should switch tab on click', () => {
    const items = fixture.nativeElement.querySelectorAll('.pk-tabs__nav-item');
    items[1].click();
    fixture.detectChanges();
    expect(items[1].classList).toContain('pk-tabs__nav-item--active');
  });

  it('should not activate disabled tab', () => {
    const items = fixture.nativeElement.querySelectorAll('.pk-tabs__nav-item');
    items[2].click();
    fixture.detectChanges();
    expect(items[2].classList).not.toContain('pk-tabs__nav-item--active');
  });
});
