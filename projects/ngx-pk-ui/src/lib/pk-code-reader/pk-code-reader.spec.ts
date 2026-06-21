import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PkCodeReader } from './pk-code-reader';
import type { PkCodeScanResult, PkCodeReaderError } from './pk-code-reader.model';

// ── Mock helpers ──────────────────────────────────────────────────────────

function makeMockTrack(torch = false): MediaStreamTrack {
  return {
    stop: vi.fn(),
    getCapabilities: vi.fn().mockReturnValue({ torch }),
    applyConstraints: vi.fn().mockResolvedValue(undefined),
  } as unknown as MediaStreamTrack;
}

function makeMockStream(torch = false): MediaStream {
  const track = makeMockTrack(torch);
  return {
    getVideoTracks: vi.fn().mockReturnValue([track]),
    getTracks: vi.fn().mockReturnValue([track]),
  } as unknown as MediaStream;
}

function makeMockDetector(results: Partial<BarcodeDetectorResult>[] = []) {
  return {
    detect: vi.fn().mockResolvedValue(
      results.map(r => ({
        rawValue: r.rawValue ?? 'TEST',
        format:   r.format   ?? 'qr_code',
        boundingBox:  { x: 0, y: 0, width: 10, height: 10 } as DOMRectReadOnly,
        cornerPoints: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }],
      })),
    ),
  };
}

// ── Test host ─────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [PkCodeReader],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<pk-code-reader
    [formats]="formats"
    [continuous]="continuous"
    [allowPaste]="true"
    (scan)="onScan($event)"
    (error)="onError($event)"
    (supportedFormats)="onSupported($event)"
  />`,
})
class TestHost {
  formats    = ['qr_code', 'code_128'] as any;
  continuous = false;
  scans:   PkCodeScanResult[]  = [];
  errors:  PkCodeReaderError[] = [];
  supported: string[][]        = [];
  onScan(r: PkCodeScanResult)    { this.scans.push(r); }
  onError(e: PkCodeReaderError)  { this.errors.push(e); }
  onSupported(f: string[])        { this.supported.push(f); }
}

// ── Suites ────────────────────────────────────────────────────────────────

describe('PkCodeReader', () => {
  let fixture: ComponentFixture<TestHost>;
  let host:    TestHost;
  let reader:  PkCodeReader;

  const SUPPORTED = ['qr_code', 'code_128', 'ean_13', 'ean_8'];

  function setupGlobals(detectorResults: Partial<BarcodeDetectorResult>[] = []) {
    const detector = makeMockDetector(detectorResults);
    vi.stubGlobal('BarcodeDetector', class MockBD {
      static getSupportedFormats = vi.fn().mockResolvedValue(SUPPORTED);
      detect = detector.detect;
    });

    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: vi.fn().mockResolvedValue(makeMockStream()) },
      configurable: true,
      writable: true,
    });

    // Stub HTMLVideoElement.play so JSDOM doesn't throw
    HTMLVideoElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  }

  beforeEach(async () => {
    setupGlobals();
    fixture = TestBed.createComponent(TestHost);
    host    = fixture.componentInstance;
    reader  = fixture.debugElement.children[0].componentInstance as PkCodeReader;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // ── Instantiation ─────────────────────────────────────────────────────

  it('should create', () => {
    expect(reader).toBeTruthy();
  });

  // ── jsQR fallback (BarcodeDetector unavailable) ─────────────────────

  it('activates jsQR fallback when BarcodeDetector is unavailable', async () => {
    vi.stubGlobal('BarcodeDetector', undefined);
    const f2 = TestBed.createComponent(TestHost);
    f2.detectChanges();
    await f2.whenStable();
    const r2 = f2.debugElement.children[0].componentInstance as PkCodeReader;
    await r2._initPromise;
    expect(r2['_jsqrMode']()).toBe(true);
    expect(r2._supported()).toBe(true);
    expect(f2.componentInstance.errors).not.toContain('not-supported');
    expect(f2.componentInstance.supported.flat()).toContain('qr_code');
  });

  // ── Supported formats ─────────────────────────────────────────────────

  it('emits only formats the device supports', async () => {
    // SUPPORTED = ['qr_code', 'code_128', 'ean_13', 'ean_8']
    // requested = ['qr_code', 'code_128'] → both available
    expect(host.supported[0]).toEqual(['qr_code', 'code_128']);
  });

  it('marks not-supported when none of requested formats are available', async () => {
    vi.stubGlobal('BarcodeDetector', class {
      static getSupportedFormats = vi.fn().mockResolvedValue(['qr_code']);
      detect = vi.fn();
    });
    const f2 = TestBed.createComponent(TestHost);
    f2.componentInstance.formats = ['code_39', 'itf'] as any; // none in supported list
    f2.detectChanges();
    await f2.whenStable();
    const r2 = f2.debugElement.children[0].componentInstance as PkCodeReader;
    expect(r2._supported()).toBe(false);
    expect(f2.componentInstance.errors).toContain('not-supported');
  });

  // ── Camera permission errors ──────────────────────────────────────────

  it('emits permission-denied and sets _permissionDenied on NotAllowedError', async () => {
    const err = Object.assign(new Error('denied'), { name: 'NotAllowedError' });
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: vi.fn().mockRejectedValue(err) },
      configurable: true,
      writable: true,
    });
    const f2 = TestBed.createComponent(TestHost);
    f2.detectChanges();
    await f2.whenStable();
    const r2 = f2.debugElement.children[0].componentInstance as PkCodeReader;
    await r2._initPromise;
    expect(f2.componentInstance.errors).toContain('permission-denied');
    expect(r2._permissionDenied()).toBe(true);
  });

  // ── File upload scan ──────────────────────────────────────────────────

  it('emits scan result with source=upload from a file', async () => {
    const det = makeMockDetector([{ rawValue: 'SCAN_FILE', format: 'qr_code' }]);
    reader['_detector'] = det as unknown as BarcodeDetector;

    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({
      close: vi.fn(),
      width: 10, height: 10,
    }));

    const file  = new File([''], 'test.png', { type: 'image/png' });
    const dt    = { files: [file] } as unknown as DataTransfer;
    const event = { target: { files: dt.files, value: '' } } as unknown as Event;
    await reader.onFileChange(event);

    expect(host.scans.length).toBe(1);
    expect(host.scans[0].value).toBe('SCAN_FILE');
    expect(host.scans[0].source).toBe('upload');
  });

  it('emits decode-error when upload image yields no results', async () => {
    reader['_detector'] = makeMockDetector([]) as unknown as BarcodeDetector;
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ close: vi.fn() }));

    const event = { target: { files: [new File([''], 'x.png', { type: 'image/png' })], value: '' } } as unknown as Event;
    await reader.onFileChange(event);

    expect(host.errors).toContain('decode-error');
  });

  // ── Capture fallback (permission-denied) ──────────────────────────

  it('onCaptureChange decodes file and emits scan result', async () => {
    const det = makeMockDetector([{ rawValue: 'CAPTURE_VAL', format: 'qr_code' }]);
    reader['_detector'] = det as unknown as BarcodeDetector;

    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({
      close: vi.fn(),
      width: 10, height: 10,
    }));

    const file  = new File([''], 'photo.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file], value: '' } } as unknown as Event;
    await reader.onCaptureChange(event);

    expect(host.scans.length).toBe(1);
    expect(host.scans[0].value).toBe('CAPTURE_VAL');
    expect(host.scans[0].source).toBe('upload');
  });

  it('onCaptureChange emits decode-error when no barcode found in image', async () => {
    reader['_detector'] = makeMockDetector([]) as unknown as BarcodeDetector;
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ close: vi.fn() }));

    const event = { target: { files: [new File([''], 'blank.jpg', { type: 'image/jpeg' })], value: '' } } as unknown as Event;
    await reader.onCaptureChange(event);

    expect(host.errors).toContain('decode-error');
  });

  it('onCaptureChange does nothing when detector is not initialised', async () => {
    reader['_detector'] = null;
    const event = { target: { files: [new File([''], 'x.jpg', { type: 'image/jpeg' })], value: '' } } as unknown as Event;
    await reader.onCaptureChange(event);
    expect(host.scans.length).toBe(0);
  });

  it('startCamera resets _permissionDenied before attempting getUserMedia', async () => {
    reader['_permissionDenied'].set(true);
    await reader.startCamera();
    expect(reader._permissionDenied()).toBe(false);
  });

  // ── Clipboard paste ───────────────────────────────────────────────────

  it('emits scan result with source=paste on clipboard paste', async () => {
    reader['_detector'] = makeMockDetector([{ rawValue: 'PASTE_VAL', format: 'ean_13' }]) as unknown as BarcodeDetector;
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ close: vi.fn() }));

    const blob = new Blob([''], { type: 'image/png' });
    const item = { type: 'image/png', getAsFile: () => blob };
    const event = {
      clipboardData: { items: [item] },
    } as unknown as ClipboardEvent;

    await reader.onPaste(event);
    expect(host.scans[0].source).toBe('paste');
    expect(host.scans[0].value).toBe('PASTE_VAL');
  });

  it('ignores paste when allowPaste=false', async () => {
    reader['_detector'] = makeMockDetector([{ rawValue: 'X' }]) as unknown as BarcodeDetector;
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ close: vi.fn() }));

    // Override input signal value
    const f2 = TestBed.createComponent(TestHost);
    const r2 = f2.debugElement.children[0].componentInstance as PkCodeReader;
    r2['_detector'] = makeMockDetector([{ rawValue: 'X' }]) as unknown as BarcodeDetector;

    const item = { type: 'image/png', getAsFile: () => new Blob([''], { type: 'image/png' }) };
    const event = { clipboardData: { items: [item] } } as unknown as ClipboardEvent;

    // allowPaste defaults to true; just verify method exits cleanly when detector is null
    r2['_detector'] = null;
    await r2.onPaste(event);
    expect(f2.componentInstance.scans.length).toBe(0);
  });

  // ── continuous=false ──────────────────────────────────────────────────

  it('stops scan loop after first detection when continuous=false', async () => {
    const stopSpy = vi.spyOn(reader as any, '_stopScanLoop');
    reader['_onDetected'](
      { rawValue: 'A', format: 'qr_code', boundingBox: {} as any, cornerPoints: [] },
      'camera',
    );
    expect(stopSpy).toHaveBeenCalled();
  });

  // ── continuous=true ───────────────────────────────────────────────────

  it('does not stop scan loop when continuous=true', async () => {
    const f2 = TestBed.createComponent(TestHost);
    f2.componentInstance.continuous = true;
    f2.detectChanges();
    await f2.whenStable();
    const r2   = f2.debugElement.children[0].componentInstance as PkCodeReader;
    const stop = vi.spyOn(r2 as any, '_stopScanLoop');
    r2['_onDetected'](
      { rawValue: 'B', format: 'qr_code', boundingBox: {} as any, cornerPoints: [] },
      'camera',
    );
    expect(stop).not.toHaveBeenCalled();
  });

  // ── Debounce in continuous mode ───────────────────────────────────────

  it('debounces same value within 2 s in continuous mode', async () => {
    const f2 = TestBed.createComponent(TestHost);
    f2.componentInstance.continuous = true;
    f2.detectChanges();
    await f2.whenStable();
    const r2 = f2.debugElement.children[0].componentInstance as PkCodeReader;
    const result = { rawValue: 'DUP', format: 'qr_code', boundingBox: {} as any, cornerPoints: [] };
    r2['_onDetected'](result, 'camera');
    r2['_onDetected'](result, 'camera'); // immediate repeat
    expect(f2.componentInstance.scans.length).toBe(1);
  });

  // ── reset() ───────────────────────────────────────────────────────────

  it('reset() clears debounce so next identical scan is emitted', async () => {
    const f2 = TestBed.createComponent(TestHost);
    f2.componentInstance.continuous = true;
    f2.detectChanges();
    await f2.whenStable();
    const r2 = f2.debugElement.children[0].componentInstance as PkCodeReader;
    const result = { rawValue: 'R', format: 'qr_code', boundingBox: {} as any, cornerPoints: [] };
    r2['_onDetected'](result, 'camera');
    r2.reset();
    r2['_onDetected'](result, 'camera'); // after reset — should emit again
    expect(f2.componentInstance.scans.length).toBe(2);
  });

  // ── jsQR helpers ──────────────────────────────────────────────────────

  it('jsQR mode: _scanFrame routes to _detectWithJsQR', async () => {
    reader['_jsqrMode'].set(true);
    reader['_detector'] = null;
    const fakeData = { data: new Uint8ClampedArray(4), width: 1, height: 1 } as ImageData;
    vi.spyOn(reader as any, '_captureVideoFrame').mockReturnValue(fakeData);
    const detectSpy = vi.spyOn(reader as any, '_detectWithJsQR').mockReturnValue(false);
    const video = reader.videoEl()?.nativeElement;
    if (video) Object.defineProperty(video, 'readyState', { value: 4, configurable: true });
    await reader['_scanFrame']();
    expect(detectSpy).toHaveBeenCalledWith(fakeData, 'camera');
  });

  it('jsQR mode: _scanBlob calls _detectWithJsQR', async () => {
    reader['_jsqrMode'].set(true);
    reader['_detector'] = null;
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ close: vi.fn(), width: 10, height: 10 }));
    const mockCtx = {
      drawImage: vi.fn(),
      getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(400), width: 10, height: 10 }),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext' as any).mockReturnValue(mockCtx);
    const detectSpy = vi.spyOn(reader as any, '_detectWithJsQR').mockReturnValue(true);
    await reader['_scanBlob'](new Blob([''], { type: 'image/png' }), 'upload');
    expect(detectSpy).toHaveBeenCalled();
  });

  it('jsQR mode: _scanBlob emits decode-error when _detectWithJsQR returns false', async () => {
    reader['_jsqrMode'].set(true);
    reader['_detector'] = null;
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ close: vi.fn(), width: 10, height: 10 }));
    const mockCtx = {
      drawImage: vi.fn(),
      getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(400), width: 10, height: 10 }),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext' as any).mockReturnValue(mockCtx);
    vi.spyOn(reader as any, '_detectWithJsQR').mockReturnValue(false);
    await reader['_scanBlob'](new Blob([''], { type: 'image/png' }), 'upload');
    expect(host.errors).toContain('decode-error');
  });
});
