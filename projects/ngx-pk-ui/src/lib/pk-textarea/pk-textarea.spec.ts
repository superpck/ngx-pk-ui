import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkTextarea } from './pk-textarea';
import type { PkTextareaValue } from './pk-textarea.model';

@Component({
  template: `<pk-textarea [(ngModel)]="value" />`,
  imports: [PkTextarea, FormsModule],
  standalone: true,
})
class TestHost {
  value: PkTextareaValue | null = null;
}

describe('PkTextarea', () => {
  let fixture: ComponentFixture<PkTextarea>;
  let component: PkTextarea;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PkTextarea],
    }).compileComponents();

    fixture = TestBed.createComponent(PkTextarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a contenteditable editor', () => {
    const editor = fixture.nativeElement.querySelector('[contenteditable]');
    expect(editor).toBeTruthy();
  });

  it('should show toolbar by default', () => {
    const toolbar = fixture.nativeElement.querySelector('.pk-ta__toolbar');
    expect(toolbar).toBeTruthy();
  });

  it('should hide toolbar when showToolbar input is false', () => {
    // Create a fresh fixture so setInput is applied before ngOnInit
    const f = TestBed.createComponent(PkTextarea);
    f.componentRef.setInput('showToolbar', false);
    f.detectChanges();
    expect(f.nativeElement.querySelector('.pk-ta__toolbar')).toBeFalsy();
  });

  it('should apply dark theme class', () => {
    fixture.componentRef.setInput('theme', 'dark');
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector('.pk-ta');
    expect(root.classList.contains('pk-ta--dark')).toBe(true);
  });

  it('writeValue sets editor innerHTML', () => {
    component.writeValue({ html: '<b>Hello</b>', text: 'Hello' });
    const editor = fixture.nativeElement.querySelector('[contenteditable]') as HTMLElement;
    expect(editor.innerHTML).toBe('<b>Hello</b>');
    expect(component.htmlContent()).toBe('<b>Hello</b>');
  });

  it('writeValue accepts a plain string as html', () => {
    component.writeValue('Plain <i>text</i>');
    const editor = fixture.nativeElement.querySelector('[contenteditable]') as HTMLElement;
    expect(editor.innerHTML).toBe('Plain <i>text</i>');
  });

  it('toggleToolbar switches toolbarVisible signal', () => {
    expect(component.toolbarVisible()).toBe(true);
    component.toggleToolbar();
    fixture.detectChanges();
    expect(component.toolbarVisible()).toBe(false);
    component.toggleToolbar();
    fixture.detectChanges();
    expect(component.toolbarVisible()).toBe(true);
  });

  it('setMode changes mode signal and shows view panel', () => {
    component.setMode('html');
    fixture.detectChanges();
    expect(component.mode()).toBe('html');
    const pre = fixture.nativeElement.querySelector('pre.pk-ta__view');
    expect(pre).toBeTruthy();

    component.setMode('text');
    fixture.detectChanges();
    expect(component.mode()).toBe('text');
    const ta = fixture.nativeElement.querySelector('textarea.pk-ta__view');
    expect(ta).toBeTruthy();

    component.setMode('edit');
    fixture.detectChanges();
    expect(component.mode()).toBe('edit');
  });

  it('onEditorInput emits onChange with html and text', () => {
    let emitted: PkTextareaValue | undefined;
    component.registerOnChange((v: PkTextareaValue) => { emitted = v; });

    const editor = fixture.nativeElement.querySelector('[contenteditable]') as HTMLElement;
    editor.innerHTML = '<b>Test</b>';
    component.onEditorInput();

    expect(emitted?.html).toBe('<b>Test</b>');
    expect(typeof emitted?.text).toBe('string');
  });

  it('setDisabledState sets contenteditable to false', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    const editor = fixture.nativeElement.querySelector('[contenteditable]') as HTMLElement;
    expect(editor.getAttribute('contenteditable')).toBe('false');
  });

  it('registerOnTouched is called on editor blur', () => {
    let touched = false;
    component.registerOnTouched(() => { touched = true; });
    component.onEditorBlur();
    expect(touched).toBe(true);
  });
});
