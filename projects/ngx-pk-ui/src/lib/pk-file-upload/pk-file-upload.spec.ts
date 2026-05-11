import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { PkFileUpload } from './pk-file-upload';
import type { PkUploadFile } from './pk-file-upload.model';
// ── Helpers ────────────────────────────────────────────────────────────────

function makeFile(name: string, type: string, size = 100): File {
  const blob = new Blob(['x'.repeat(size)], { type });
  return new File([blob], name, { type });
}

/** Build a pseudo-FileList without DataTransfer (jsdom doesn't support it). */
function makeFileList(files: File[]): FileList {
  const list: Record<string | number | symbol, unknown> = {
    length: files.length,
    item: (i: number) => files[i] ?? null,
    [Symbol.iterator]: function* () { yield* files; },
  };
  files.forEach((f, i) => { list[i] = f; });
  return list as unknown as FileList;
}

/** Directly invoke the private addFiles() on a PkFileUpload instance. */
function addFiles(component: PkFileUpload, files: File[]): void {
  (component as unknown as { addFiles(fl: FileList): void }).addFiles(makeFileList(files));
}

// ── Host component ─────────────────────────────────────────────────────────

@Component({
  imports: [PkFileUpload],
  template: `
    <pk-file-upload
      #uploader
      [accept]="accept()"
      [multiple]="multiple()"
      [maxSize]="maxSize()"
      [maxFiles]="maxFiles()"
      [disabled]="disabled()"
      [uploading]="uploading()"
      (filesChange)="onFilesChange($event)"
      (onUpload)="onUpload($event)"
    />
  `,
})
class TestHostComponent {
  accept   = signal('');
  multiple = signal(true);
  maxSize  = signal(0);
  maxFiles = signal(0);
  disabled = signal(false);
  uploading = signal(false);

  filesChangeSpy: PkUploadFile[] = [];
  uploadSpy: PkUploadFile[] = [];

  onFilesChange(files: PkUploadFile[]): void { this.filesChangeSpy = files; }
  onUpload(files: PkUploadFile[]): void { this.uploadSpy = files; }
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('PkFileUpload', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let component: PkFileUpload;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    component = fixture.debugElement.children[0].componentInstance as PkFileUpload;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the drop zone', () => {
    const zone = fixture.nativeElement.querySelector('.pk-file-upload__zone');
    expect(zone).toBeTruthy();
  });

  it('detects previewType=image for an image file', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:img');
    addFiles(component, [makeFile('photo.png', 'image/png')]);
    expect(component.files()[0].previewType).toBe('image');
    expect(component.files()[0].previewUrl).toBe('blob:img');
  });

  it('detects previewType=pdf for a PDF file', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:pdf');
    addFiles(component, [makeFile('doc.pdf', 'application/pdf')]);
    expect(component.files()[0].previewType).toBe('pdf');
    expect(component.files()[0].previewUrl).toBe('blob:pdf');
  });

  it('detects previewType=text for a .txt file (text/plain)', () => {
    addFiles(component, [makeFile('notes.txt', 'text/plain')]);
    expect(component.files()[0].previewType).toBe('text');
    expect(component.files()[0].previewUrl).toBeNull();
  });

  it('detects previewType=text for a .json file by extension', () => {
    addFiles(component, [makeFile('data.json', 'application/json')]);
    expect(component.files()[0].previewType).toBe('text');
  });

  it('detects previewType=none for an unknown file', () => {
    addFiles(component, [makeFile('archive.zip', 'application/zip')]);
    expect(component.files()[0].previewType).toBe('none');
    expect(component.files()[0].previewUrl).toBeNull();
  });

  it('emits filesChange with the added files', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:img');
    addFiles(component, [makeFile('a.png', 'image/png')]);
    expect(host.filesChangeSpy.length).toBe(1);
    expect(host.filesChangeSpy[0].file.name).toBe('a.png');
  });

  it('emits filesChange when a file is removed', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:img');
    vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined);
    addFiles(component, [makeFile('a.png', 'image/png'), makeFile('b.png', 'image/png')]);
    const id = component.files()[0].id;
    component.removeFile(id);
    expect(host.filesChangeSpy.length).toBe(1);
  });

  it('sets an error when file exceeds maxSize', () => {
    host.maxSize.set(50);
    fixture.detectChanges();
    addFiles(component, [makeFile('big.png', 'image/png', 100)]);
    expect(component.files()[0].error).toBeTruthy();
    expect(component.files()[0].previewUrl).toBeNull();
  });

  it('excludes error files from onUpload emit', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:img');
    host.maxSize.set(50);
    fixture.detectChanges();
    addFiles(component, [
      makeFile('ok.png', 'image/png', 10),
      makeFile('big.png', 'image/png', 100),
    ]);
    component.submitUpload();
    expect(host.uploadSpy.length).toBe(1);
    expect(host.uploadSpy[0].file.name).toBe('ok.png');
  });

  it('replaces files when multiple=false', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:img');
    vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined);
    host.multiple.set(false);
    fixture.detectChanges();
    addFiles(component, [makeFile('a.png', 'image/png')]);
    addFiles(component, [makeFile('b.png', 'image/png')]);
    expect(component.files().length).toBe(1);
    expect(component.files()[0].file.name).toBe('b.png');
  });

  it('respects maxFiles limit', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:img');
    host.maxFiles.set(2);
    fixture.detectChanges();
    addFiles(component, [
      makeFile('a.png', 'image/png'),
      makeFile('b.png', 'image/png'),
      makeFile('c.png', 'image/png'),
    ]);
    expect(component.files().length).toBe(2);
  });

  it('clear() resets the file list and emits filesChange([])', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:img');
    vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined);
    addFiles(component, [makeFile('a.png', 'image/png')]);
    component.clear();
    expect(component.files().length).toBe(0);
    expect(host.filesChangeSpy.length).toBe(0);
  });

  it('ngOnDestroy revokes object URLs', () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:img');
    addFiles(component, [makeFile('a.png', 'image/png')]);
    component.ngOnDestroy();
    expect(revokeSpy).toHaveBeenCalledWith('blob:img');
  });
});
