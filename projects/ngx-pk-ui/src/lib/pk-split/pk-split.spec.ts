import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PkSplit } from './pk-split';
import { PkSplitPanel } from './pk-split-panel';

@Component({
  template: `
    <pk-split style="display:block;width:400px;height:300px">
      <pk-split-panel><div class="panel-a">Panel A</div></pk-split-panel>
      <pk-split-panel><div class="panel-b">Panel B</div></pk-split-panel>
    </pk-split>
  `,
  imports: [PkSplit, PkSplitPanel],
})
class TestHostComponent {}

@Component({
  template: `
    <pk-split direction="vertical" style="display:block;width:400px;height:300px">
      <pk-split-panel><div class="top">Top</div></pk-split-panel>
      <pk-split-panel><div class="bottom">Bottom</div></pk-split-panel>
    </pk-split>
  `,
  imports: [PkSplit, PkSplitPanel],
})
class VerticalHostComponent {}

@Component({
  template: `
    <pk-split [initialSize]="30" style="display:block;width:400px;height:300px">
      <pk-split-panel><div class="panel-a">A</div></pk-split-panel>
      <pk-split-panel><div class="panel-b">B</div></pk-split-panel>
    </pk-split>
  `,
  imports: [PkSplit, PkSplitPanel],
})
class CustomSizeHostComponent {}

describe('PkSplit', () => {
  describe('horizontal (default)', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();
      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
    });

    it('should render two panels', () => {
      const panels = fixture.nativeElement.querySelectorAll('.pk-split__panel');
      expect(panels.length).toBe(2);
    });

    it('should render a gutter', () => {
      const gutter = fixture.nativeElement.querySelector('.pk-split__gutter');
      expect(gutter).toBeTruthy();
    });

    it('should apply horizontal class', () => {
      const container = fixture.nativeElement.querySelector('.pk-split__container') as HTMLElement;
      expect(container.classList).toContain('pk-split--horizontal');
    });

    it('should project content into panels', () => {
      expect(fixture.nativeElement.querySelector('.panel-a')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.panel-b')).toBeTruthy();
    });

    it('should set equal flex-grow by default (50/50)', () => {
      const panels = fixture.nativeElement.querySelectorAll('.pk-split__panel') as NodeListOf<HTMLElement>;
      expect(parseFloat(panels[0].style.flexGrow)).toBeCloseTo(50, 0);
      expect(parseFloat(panels[1].style.flexGrow)).toBeCloseTo(50, 0);
    });
  });

  describe('vertical direction', () => {
    let fixture: ComponentFixture<VerticalHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [VerticalHostComponent],
      }).compileComponents();
      fixture = TestBed.createComponent(VerticalHostComponent);
      fixture.detectChanges();
    });

    it('should apply vertical class', () => {
      const container = fixture.nativeElement.querySelector('.pk-split__container') as HTMLElement;
      expect(container.classList).toContain('pk-split--vertical');
    });

    it('should project top and bottom content', () => {
      expect(fixture.nativeElement.querySelector('.top')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.bottom')).toBeTruthy();
    });
  });

  describe('custom initialSize', () => {
    let fixture: ComponentFixture<CustomSizeHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CustomSizeHostComponent],
      }).compileComponents();
      fixture = TestBed.createComponent(CustomSizeHostComponent);
      fixture.detectChanges();
    });

    it('should set first panel flex-grow to initialSize', () => {
      const panels = fixture.nativeElement.querySelectorAll('.pk-split__panel') as NodeListOf<HTMLElement>;
      expect(parseFloat(panels[0].style.flexGrow)).toBeCloseTo(30, 0);
      expect(parseFloat(panels[1].style.flexGrow)).toBeCloseTo(70, 0);
    });
  });
});
