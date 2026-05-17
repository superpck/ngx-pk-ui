import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  forwardRef,
  inject,
  input,
  signal,
  computed,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass, NgStyle } from '@angular/common';
import {
  PK_TEXTAREA_FONTS,
  PkTextareaFontSize,
  PkTextareaMode,
  PkTextareaTheme,
  PkTextareaValue,
} from './pk-textarea.model';

@Component({
  selector: 'pk-textarea',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './pk-textarea.html',
  styleUrls: ['./pk-textarea.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PkTextarea),
      multi: true,
    },
  ],
})
export class PkTextarea implements ControlValueAccessor, OnInit, AfterViewInit {
  private el = inject(ElementRef);

  // ── Inputs ──────────────────────────────────────────────────────────────────
  placeholder  = input<string>('Type something...');
  theme        = input<PkTextareaTheme>('light');
  showToolbar  = input<boolean>(true);
  minHeight    = input<string>('200px');
  customClass  = input<string>('');
  customStyle  = input<Record<string, string> | null>(null);
  disabled     = input<boolean>(false);

  // ── ViewChild ────────────────────────────────────────────────────────────────
  editorEl = viewChild<ElementRef<HTMLDivElement>>('editor');

  // ── State signals ────────────────────────────────────────────────────────────
  toolbarVisible  = signal(true);
  mode            = signal<PkTextareaMode>('edit');
  activeStates    = signal({ bold: false, italic: false, underline: false, strike: false, blockquote: false });
  selectedColor     = signal('#000000');
  selectedHighlight = signal('#ffff00');
  fontDropdownOpen = signal(false);
  sizeDropdownOpen = signal(false);
  htmlContent     = signal('');
  textContent     = signal('');

  private _cvaDisabled = signal(false);
  readonly isDisabled  = computed(() => this.disabled() || this._cvaDisabled());

  // ── Fonts list ───────────────────────────────────────────────────────────────
  readonly fonts = PK_TEXTAREA_FONTS;

  // ── ControlValueAccessor ─────────────────────────────────────────────────────
  private _onChange: (val: PkTextareaValue) => void = () => {};
  private _onTouched: () => void = () => {};
  private _pendingHtml: string | null = null;
  private _savedRange: Range | null = null;

  // ── Lifecycle ────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.toolbarVisible.set(this.showToolbar());
  }

  ngAfterViewInit(): void {
    if (this._pendingHtml !== null) {
      const editor = this.editorEl()?.nativeElement;
      if (editor) {
        editor.innerHTML = this._pendingHtml;
        this.htmlContent.set(this._pendingHtml);
        this.textContent.set(editor.innerText ?? editor.textContent ?? '');
        this._pendingHtml = null;
      }
    }
  }

  // ── ControlValueAccessor API ─────────────────────────────────────────────────
  writeValue(value: PkTextareaValue | string | null): void {
    const html = typeof value === 'string' ? value : (value?.html ?? '');
    const editor = this.editorEl()?.nativeElement;
    if (editor) {
      editor.innerHTML = html;
      this.htmlContent.set(html);
      this.textContent.set(editor.innerText ?? editor.textContent ?? '');
    } else {
      this._pendingHtml = html;
    }
  }

  registerOnChange(fn: (val: PkTextareaValue) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._cvaDisabled.set(isDisabled);
  }

  // ── Editor event handlers ────────────────────────────────────────────────────
  onEditorInput(): void {
    this._emitValue();
  }

  onEditorKeyUp(): void {
    this._updateActiveStates();
  }

  onEditorMouseUp(): void {
    this._updateActiveStates();
  }

  onEditorBlur(): void {
    this._onTouched();
  }

  // ── Formatting commands ──────────────────────────────────────────────────────
  execFormat(command: string): void {
    const editor = this.editorEl()?.nativeElement;
    if (!editor || this.isDisabled()) return;
    editor.focus();
    document.execCommand(command, false);
    this._updateActiveStates();
    this._emitValue();
  }

  applyFontName(fontClass: string): void {
    const editor = this.editorEl()?.nativeElement;
    if (!editor || this.isDisabled()) return;
    this.fontDropdownOpen.set(false);
    this._restoreSelection();

    // Use fontSize trick: mark selection, then replace <font size="7"> with <span class="...">
    document.execCommand('fontSize', false, '7');
    editor.querySelectorAll<HTMLElement>('font[size="7"]').forEach(el => {
      const span = document.createElement('span');
      if (fontClass) span.className = fontClass;
      span.innerHTML = el.innerHTML;
      el.parentNode?.replaceChild(span, el);
    });
    this._emitValue();
  }

  applyFontSize(size: PkTextareaFontSize): void {
    const editor = this.editorEl()?.nativeElement;
    if (!editor || this.isDisabled()) return;
    this.sizeDropdownOpen.set(false);
    this._restoreSelection();

    if (size === 'h1' || size === 'h2' || size === 'h3') {
      document.execCommand('formatBlock', false, size);
    } else if (size === 'normal') {
      document.execCommand('formatBlock', false, 'p');
    } else {
      const sizeMap: Record<string, string> = { small: '0.75em', large: '1.5em' };
      document.execCommand('fontSize', false, '7');
      editor.querySelectorAll<HTMLElement>('font[size="7"]').forEach(el => {
        const span = document.createElement('span');
        span.style.fontSize = sizeMap[size];
        span.innerHTML = el.innerHTML;
        el.parentNode?.replaceChild(span, el);
      });
    }
    this._emitValue();
  }

  onColorMouseDown(event: MouseEvent): void {
    // preventDefault would block the native color dialog — save range manually instead
    this._saveSelection();
  }

  onHighlightMouseDown(_event: MouseEvent): void {
    this._saveSelection();
  }

  onHighlightChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.selectedHighlight.set(color);
    const editor = this.editorEl()?.nativeElement;
    if (!editor || this.isDisabled()) return;
    editor.focus();
    this._restoreSelection();
    document.execCommand('hiliteColor', false, color);
    this._emitValue();
  }

  toggleBlockquote(): void {
    const editor = this.editorEl()?.nativeElement;
    if (!editor || this.isDisabled()) return;
    editor.focus();
    const isBlockquote = document.queryCommandValue('formatBlock').toLowerCase() === 'blockquote';
    document.execCommand('formatBlock', false, isBlockquote ? 'p' : 'blockquote');
    this._updateActiveStates();
    this._emitValue();
  }

  onColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.selectedColor.set(color);
    const editor = this.editorEl()?.nativeElement;
    if (!editor || this.isDisabled()) return;
    editor.focus();
    this._restoreSelection();
    document.execCommand('foreColor', false, color);
    this._emitValue();
  }

  // ── Dropdown toggles ─────────────────────────────────────────────────────────
  toggleFontDropdown(): void {
    this._saveSelection();
    this.fontDropdownOpen.update(v => !v);
    this.sizeDropdownOpen.set(false);
  }

  toggleSizeDropdown(): void {
    this._saveSelection();
    this.sizeDropdownOpen.update(v => !v);
    this.fontDropdownOpen.set(false);
  }

  // ── Toolbar & mode controls ──────────────────────────────────────────────────
  toggleToolbar(): void {
    this.toolbarVisible.update(v => !v);
  }

  setMode(mode: PkTextareaMode): void {
    this.mode.set(mode);
    if (mode === 'edit') {
      // Sync editor with current htmlContent after returning to edit mode
      const editor = this.editorEl()?.nativeElement;
      if (editor && editor.innerHTML !== this.htmlContent()) {
        editor.innerHTML = this.htmlContent();
      }
    }
  }

  // ── Host listeners ───────────────────────────────────────────────────────────
  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.fontDropdownOpen.set(false);
      this.sizeDropdownOpen.set(false);
    }
  }

  @HostListener('document:selectionchange')
  onSelectionChange(): void {
    const editor = this.editorEl()?.nativeElement;
    if (!editor) return;
    const selection = window.getSelection();
    if (selection?.rangeCount && editor.contains(selection.anchorNode)) {
      this._savedRange = selection.getRangeAt(0).cloneRange();
      this._updateActiveStates();
    }
  }

  // ── Private helpers ──────────────────────────────────────────────────────────
  private _emitValue(): void {
    const editor = this.editorEl()?.nativeElement;
    if (!editor) return;
    const html = editor.innerHTML;
    const text = editor.innerText ?? editor.textContent ?? '';
    this.htmlContent.set(html);
    this.textContent.set(text);
    this._onChange({ html, text });
  }

  private _updateActiveStates(): void {
    this.activeStates.set({
      bold:       document.queryCommandState('bold'),
      italic:     document.queryCommandState('italic'),
      underline:  document.queryCommandState('underline'),
      strike:     document.queryCommandState('strikeThrough'),
      blockquote: document.queryCommandValue('formatBlock').toLowerCase() === 'blockquote',
    });
  }

  private _saveSelection(): void {
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      this._savedRange = selection.getRangeAt(0).cloneRange();
    }
  }

  private _restoreSelection(): void {
    if (!this._savedRange) return;
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(this._savedRange);
    }
  }
}
