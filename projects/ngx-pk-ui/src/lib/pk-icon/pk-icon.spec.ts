import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { PkIcon } from './pk-icon';
import { PK_ICONS, PkIconName, PkIconSet } from './pk-icon.model';

@Component({
  template: `
    <pk-icon
      [name]="name()"
      [iconSet]="iconSet()"
      [size]="size()"
      [color]="color()"
      [fillColor]="fillColor()"
      [viewBox]="viewBox()"
      [strokeWidth]="strokeWidth()"
    />
  `,
  imports: [PkIcon],
})
class TestHostComponent {
  name        = signal<PkIconName>('search');
  iconSet     = signal<PkIconSet>('pk');
  size        = signal(15);
  color       = signal('currentColor');
  fillColor   = signal('none');
  viewBox     = signal('0 0 24 24');
  strokeWidth = signal(2);
}

describe('PkIcon', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getSvg(): SVGElement {
    return fixture.nativeElement.querySelector('svg');
  }

  it('should render an svg element for the default icon', () => {
    expect(getSvg()).not.toBeNull();
  });

  it('should default to size 15', () => {
    expect(getSvg().getAttribute('width')).toBe('15');
    expect(getSvg().getAttribute('height')).toBe('15');
  });

  it('should reflect size input', () => {
    host.size.set(32);
    fixture.detectChanges();
    expect(getSvg().getAttribute('width')).toBe('32');
    expect(getSvg().getAttribute('height')).toBe('32');
  });

  it('should reflect color as svg stroke attribute', () => {
    host.color.set('#ff0000');
    fixture.detectChanges();
    expect(getSvg().getAttribute('stroke')).toBe('#ff0000');
  });

  it('should reflect fillColor as svg fill attribute', () => {
    host.fillColor.set('#00ff00');
    fixture.detectChanges();
    expect(getSvg().getAttribute('fill')).toBe('#00ff00');
  });

  it('should reflect custom viewBox', () => {
    host.viewBox.set('0 0 32 32');
    fixture.detectChanges();
    expect(getSvg().getAttribute('viewBox')).toBe('0 0 32 32');
  });

  it('should reflect strokeWidth', () => {
    host.strokeWidth.set(3);
    fixture.detectChanges();
    expect(getSvg().getAttribute('stroke-width')).toBe('3');
  });

  it('should render non-empty paths for a sample of icon names', () => {
    const sample: PkIconName[] = [
      'search', 'menu', 'user', 'close', 'check-mark',
      'warning', 'error', 'success', 'linkedin', 'trash',
    ];
    sample.forEach(name => {
      host.name.set(name);
      fixture.detectChanges();
      expect(getSvg()).not.toBeNull();
      expect(getSvg().innerHTML.length).toBeGreaterThan(0);
    });
  });

  it('should have SVG path data defined for every icon name', () => {
    const allNames = Object.keys(PK_ICONS) as PkIconName[];
    expect(allNames.length).toBe(92);
    allNames.forEach(name => {
      expect(PK_ICONS[name].trim().length).toBeGreaterThan(0);
    });
  });

  it('should render Material Symbols when iconSet is material-symbols', () => {
    host.iconSet.set('material-symbols');
    fixture.detectChanges();

    const symbol = fixture.nativeElement.querySelector('.pk-material-symbol');
    const svg = fixture.nativeElement.querySelector('svg');

    expect(symbol).not.toBeNull();
    expect(symbol.textContent.trim()).toBe('search');
    expect(svg).toBeNull();
  });
});
