import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkOtp } from './pk-otp';

// ─── Test Host ─────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [PkOtp, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <pk-otp
      [length]="length()"
      [type]="type()"
      [capital]="capital()"
      [size]="size()"
      [title]="title()"
      [text]="text()"
      [showString]="showString()"
      [showTime]="showTime()"
      [disabled]="disabled()"
      [(ngModel)]="value"
      (onComplete)="lastComplete = $event"
      (onChange)="lastChange = $event"
    />
  `,
})
class TestHost {
  length     = signal(6);
  type       = signal<'number' | 'char' | 'none'>('number');
  capital    = signal(false);
  size       = signal<'sm' | 'md' | 'lg'>('md');
  title      = signal('');
  text       = signal('');
  showString = signal<string | null>(null);
  showTime   = signal(1000);
  disabled   = signal(false);
  value      = '';
  lastComplete = '';
  lastChange   = '';
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getInputs(fix: ComponentFixture<TestHost>): HTMLInputElement[] {
  return Array.from(fix.nativeElement.querySelectorAll('.pk-otp__input'));
}

function typeInto(input: HTMLInputElement, char: string): void {
  input.value = char;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function keydown(input: HTMLInputElement, key: string): void {
  input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

// ─── Specs ─────────────────────────────────────────────────────────────────

describe('PkOtp', () => {

  let fix: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fix = TestBed.createComponent(TestHost);
    host = fix.componentInstance;
    fix.detectChanges();
  });

  afterEach(() => vi.useRealTimers());

  // ── 1. Render ──────────────────────────────────────────────────────────────

  it('renders 6 input cells by default', () => {
    expect(getInputs(fix).length).toBe(6);
  });

  it('renders the correct number of cells when length changes', async () => {
    host.length.set(4);
    fix.detectChanges();
    await fix.whenStable();
    expect(getInputs(fix).length).toBe(4);
  });

  it('clamps length between 1 and 16', async () => {
    host.length.set(0);
    fix.detectChanges();
    await fix.whenStable();
    expect(getInputs(fix).length).toBe(1);

    host.length.set(99);
    fix.detectChanges();
    await fix.whenStable();
    expect(getInputs(fix).length).toBe(16);
  });

  it('shows title and text when provided', () => {
    host.title.set('Enter OTP');
    host.text.set('ref: ABC123');
    fix.detectChanges();
    const t = fix.nativeElement.querySelector('.pk-otp__title');
    const s = fix.nativeElement.querySelector('.pk-otp__text');
    expect(t?.textContent?.trim()).toBe('Enter OTP');
    expect(s?.textContent?.trim()).toBe('ref: ABC123');
  });

  it('applies sm / lg size classes', async () => {
    host.size.set('sm');
    fix.detectChanges();
    expect(fix.nativeElement.querySelector('.pk-otp--sm')).toBeTruthy();

    host.size.set('lg');
    fix.detectChanges();
    expect(fix.nativeElement.querySelector('.pk-otp--lg')).toBeTruthy();
  });

  it('disables all inputs when disabled=true', async () => {
    host.disabled.set(true);
    fix.detectChanges();
    const inputs = getInputs(fix);
    inputs.forEach(i => expect(i.disabled).toBe(true));
  });

  // ── 2. Type validation ────────────────────────────────────────────────────

  it('accepts digits when type=number', () => {
    const inputs = getInputs(fix);
    typeInto(inputs[0], '5');
    fix.detectChanges();
    expect(inputs[0].value).toBe('5');
  });

  it('rejects non-digits when type=number', () => {
    const inputs = getInputs(fix);
    typeInto(inputs[0], 'a');
    fix.detectChanges();
    expect(inputs[0].value).toBe('');
  });

  it('accepts letters when type=char', async () => {
    host.type.set('char');
    fix.detectChanges();
    const inputs = getInputs(fix);
    typeInto(inputs[0], 'a');
    fix.detectChanges();
    expect(inputs[0].value).toBe('a');
  });

  it('rejects digits when type=char', async () => {
    host.type.set('char');
    fix.detectChanges();
    const inputs = getInputs(fix);
    typeInto(inputs[0], '5');
    fix.detectChanges();
    expect(inputs[0].value).toBe('');
  });

  it('uppercases letters when capital=true and type=char', async () => {
    host.type.set('char');
    host.capital.set(true);
    fix.detectChanges();
    const inputs = getInputs(fix);
    typeInto(inputs[0], 'a');
    fix.detectChanges();
    expect(inputs[0].value).toBe('A');
  });

  it('accepts any char when type=none', async () => {
    host.type.set('none');
    fix.detectChanges();
    const inputs = getInputs(fix);
    typeInto(inputs[0], '@');
    fix.detectChanges();
    expect(inputs[0].value).toBe('@');
  });

  // ── 3. ngModel ────────────────────────────────────────────────────────────

  it('emits onChange on every keystroke', () => {
    const inputs = getInputs(fix);
    typeInto(inputs[0], '1');
    fix.detectChanges();
    expect(host.lastChange).toBe('1');
  });

  it('emits onComplete when all cells are filled', () => {
    const inputs = getInputs(fix);
    ['1','2','3','4','5','6'].forEach((c, i) => typeInto(inputs[i], c));
    fix.detectChanges();
    expect(host.lastComplete).toBe('123456');
  });

  it('writes value via ngModel writeValue', async () => {
    host.value = '987654';
    fix.detectChanges();
    await fix.whenStable();
    fix.detectChanges();
    const comp = fix.debugElement.children[0].componentInstance as PkOtp;
    expect(comp._values()).toEqual(['9','8','7','6','5','4']);
  });

  // ── 4. Keyboard navigation ────────────────────────────────────────────────

  it('clears cell on Backspace when cell has value', () => {
    const inputs = getInputs(fix);
    typeInto(inputs[0], '5');
    fix.detectChanges();
    keydown(inputs[0], 'Backspace');
    fix.detectChanges();
    expect(inputs[0].value).toBe('');
    expect(host.lastChange).toBe('');
  });

  it('clears and moves left on Backspace when cell is empty', async () => {
    const inputs = getInputs(fix);
    typeInto(inputs[0], '1');
    // Simulate focus on cell 1 (already empty)
    inputs[1].dispatchEvent(new Event('focus'));
    fix.detectChanges();
    keydown(inputs[1], 'Backspace');
    fix.detectChanges();
    expect(inputs[0].value).toBe('');
  });

  it('clears cell on Delete', () => {
    const inputs = getInputs(fix);
    typeInto(inputs[0], '5');
    fix.detectChanges();
    keydown(inputs[0], 'Delete');
    fix.detectChanges();
    expect(inputs[0].value).toBe('');
  });

  // ── 5. Paste ──────────────────────────────────────────────────────────────

  it('fills cells from paste', () => {
    const inputs = getInputs(fix);
    const ev = new Event('paste', { bubbles: true });
    Object.defineProperty(ev, 'clipboardData', { value: { getData: () => '123456' } });
    inputs[0].dispatchEvent(ev as ClipboardEvent);
    fix.detectChanges();
    expect(host.lastComplete).toBe('123456');
  });

  it('ignores invalid chars in paste when type=number', () => {
    const inputs = getInputs(fix);
    const ev = new Event('paste', { bubbles: true });
    Object.defineProperty(ev, 'clipboardData', { value: { getData: () => '1a2b3c' } });
    inputs[0].dispatchEvent(ev as ClipboardEvent);
    fix.detectChanges();
    const comp = fix.debugElement.children[0].componentInstance as PkOtp;
    expect(comp._values()).toEqual(['1','2','3','','','']);
  });

  // ── 6. showString masking ─────────────────────────────────────────────────

  it('shows mask immediately when showTime=0', async () => {
    host.showString.set('*');
    host.showTime.set(0);
    fix.detectChanges();
    const inputs = getInputs(fix);
    typeInto(inputs[0], '5');
    fix.detectChanges();
    expect(inputs[0].value).toBe('*');
    // actual value still recorded
    const comp = fix.debugElement.children[0].componentInstance as PkOtp;
    expect(comp._values()[0]).toBe('5');
  });

  it('shows actual char then masks after showTime ms', async () => {
    vi.useFakeTimers();
    host.showString.set('•');
    host.showTime.set(500);
    fix.detectChanges();
    const inputs = getInputs(fix);
    typeInto(inputs[0], '7');
    fix.detectChanges();
    // Immediately shows actual char
    expect(inputs[0].value).toBe('7');
    // After showTime, shows mask
    vi.advanceTimersByTime(500);
    fix.detectChanges();
    expect(inputs[0].value).toBe('•');
  });

  it('writeValue applies mask to existing value', () => {
    host.showString.set('*');
    host.showTime.set(0);
    fix.detectChanges();
    const comp = fix.debugElement.children[0].componentInstance as PkOtp;
    comp.writeValue('1234');
    fix.detectChanges();
    expect(comp._displayValues()[0]).toBe('*');
    expect(comp._displayValues()[1]).toBe('*');
    expect(comp._displayValues()[2]).toBe('*');
    expect(comp._displayValues()[3]).toBe('*');
    expect(comp._displayValues()[4]).toBe('');
    expect(comp._displayValues()[5]).toBe('');
  });
});
