import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PkAccordion } from './pk-accordion';
import { PkAccordionItem } from './pk-accordion-item';

@Component({
  template: `
    <pk-accordion>
      <pk-accordion-item label="Item 1">Content 1</pk-accordion-item>
      <pk-accordion-item label="Item 2">Content 2</pk-accordion-item>
      <pk-accordion-item label="Item 3" [disabled]="true">Content 3</pk-accordion-item>
    </pk-accordion>
  `,
  imports: [PkAccordion, PkAccordionItem],
})
class TestHostComponent {}

@Component({
  template: `
    <pk-accordion [multi]="true">
      <pk-accordion-item label="A">Content A</pk-accordion-item>
      <pk-accordion-item label="B">Content B</pk-accordion-item>
    </pk-accordion>
  `,
  imports: [PkAccordion, PkAccordionItem],
})
class MultiHostComponent {}

@Component({
  template: `
    <pk-accordion>
      <pk-accordion-item label="Pre-opened" [open]="true">Hello</pk-accordion-item>
      <pk-accordion-item label="Closed">World</pk-accordion-item>
    </pk-accordion>
  `,
  imports: [PkAccordion, PkAccordionItem],
})
class OpenHostComponent {}

describe('PkAccordion', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render all item headers', () => {
    const headers = fixture.nativeElement.querySelectorAll('.pk-accordion-item__header');
    expect(headers.length).toBe(3);
    expect(headers[0].textContent.trim()).toContain('Item 1');
  });

  it('should be closed by default', () => {
    const items = fixture.nativeElement.querySelectorAll('.pk-accordion-item');
    items.forEach((el: Element) => {
      expect(el.classList).not.toContain('pk-accordion-item--open');
    });
  });

  it('should open an item on click', () => {
    const headers = fixture.nativeElement.querySelectorAll('.pk-accordion-item__header');
    headers[0].click();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.pk-accordion-item');
    expect(items[0].classList).toContain('pk-accordion-item--open');
  });

  it('should close the previously open item in single mode', () => {
    const headers = fixture.nativeElement.querySelectorAll('.pk-accordion-item__header');
    headers[0].click();
    fixture.detectChanges();
    headers[1].click();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.pk-accordion-item');
    expect(items[0].classList).not.toContain('pk-accordion-item--open');
    expect(items[1].classList).toContain('pk-accordion-item--open');
  });

  it('should toggle closed when clicking an open item', () => {
    const headers = fixture.nativeElement.querySelectorAll('.pk-accordion-item__header');
    headers[0].click();
    fixture.detectChanges();
    headers[0].click();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.pk-accordion-item');
    expect(items[0].classList).not.toContain('pk-accordion-item--open');
  });

  it('should not open a disabled item', () => {
    const headers = fixture.nativeElement.querySelectorAll('.pk-accordion-item__header');
    headers[2].click();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.pk-accordion-item');
    expect(items[2].classList).not.toContain('pk-accordion-item--open');
  });
});

describe('PkAccordion — multi mode', () => {
  let fixture: ComponentFixture<MultiHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(MultiHostComponent);
    fixture.detectChanges();
  });

  it('should allow multiple items open simultaneously', () => {
    const headers = fixture.nativeElement.querySelectorAll('.pk-accordion-item__header');
    headers[0].click();
    fixture.detectChanges();
    headers[1].click();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.pk-accordion-item');
    expect(items[0].classList).toContain('pk-accordion-item--open');
    expect(items[1].classList).toContain('pk-accordion-item--open');
  });
});

describe('PkAccordion — open input', () => {
  let fixture: ComponentFixture<OpenHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OpenHostComponent);
    fixture.detectChanges();
  });

  it('should honour the open input on init', () => {
    const items = fixture.nativeElement.querySelectorAll('.pk-accordion-item');
    expect(items[0].classList).toContain('pk-accordion-item--open');
    expect(items[1].classList).not.toContain('pk-accordion-item--open');
  });
});
