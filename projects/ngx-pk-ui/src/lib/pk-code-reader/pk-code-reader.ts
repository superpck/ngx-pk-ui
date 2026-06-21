import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  inject,
  input,
  output,
  signal,
  viewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { PkCodeFormat, PkCodeReaderError, PkCodeScanResult } from './pk-code-reader.model';
import jsQR from './vendor/jsqr/index';

@Component({
  selector: 'pk-code-reader',
  standalone: true,
  imports: [],
  templateUrl: './pk-code-reader.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pk-code-reader.css',
})
export class PkCodeReader implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private destroyRef  = inject(DestroyRef);

  // ── Inputs ──────────────────────────────────────────────────────────────
  /** Barcode/QR formats to scan for (filtered against device support on init) */
  formats       = input<PkCodeFormat[]>(['qr_code', 'code_128', 'ean_13', 'ean_8', 'code_39']);
  /** Preferred camera facing mode */
  facingMode    = input<'user' | 'environment'>('environment');
  /** Keep scanning after first result; same value debounced for 2 s */
  continuous    = input<boolean>(false);
  /** Pause scan loop without stopping the camera stream */
  paused        = input<boolean>(false);
  /** Milliseconds between scan attempts */
  interval      = input<number>(300);
  /** Show viewfinder overlay frame on the video */
  showOverlay   = input<boolean>(true);
  /** Highlight the bounding box of detected codes */
  showHighlight = input<boolean>(true);
  /** Play a short beep on successful scan */
  beep          = input<boolean>(false);
  /** Show torch/flashlight toggle button (hidden if device has no torch) */
  showTorch     = input<boolean>(true);
  /** Show front/back camera switch button */
  showSwitch    = input<boolean>(true);
  /** Show "Scan from image" upload button */
  allowUpload   = input<boolean>(true);
  /** Allow Ctrl+V / paste to scan from clipboard image */
  allowPaste    = input<boolean>(true);

  // ── Outputs ─────────────────────────────────────────────────────────────
  scan             = output<PkCodeScanResult>();
  error            = output<PkCodeReaderError>();
  /** Emits the formats the current device/browser actually supports */
  supportedFormats = output<PkCodeFormat[]>();

  // ── Internal state ───────────────────────────────────────────────────────
  readonly _supported        = signal(true);
  readonly _torchOn          = signal(false);
  readonly _torchSupported   = signal(false);
  readonly _currentFacing    = signal<'user' | 'environment'>('environment');
  readonly _permissionDenied = signal(false);
  /** True when running on iOS (WebKit — BarcodeDetector unavailable) */
  _isIos = false;

  // ── Template refs ────────────────────────────────────────────────────────
  readonly videoEl        = viewChild<ElementRef<HTMLVideoElement>>('videoEl');
  readonly overlayEl      = viewChild<ElementRef<HTMLCanvasElement>>('overlayEl');
  readonly fileInputEl    = viewChild<ElementRef<HTMLInputElement>>('fileInputEl');
  readonly captureInputEl = viewChild<ElementRef<HTMLInputElement>>('captureInputEl');

  // ── Private fields ───────────────────────────────────────────────────────
  private _stream:   MediaStream | null     = null;
  private _detector: BarcodeDetector | null = null;
  private _scanTimer: ReturnType<typeof setInterval> | null = null;
  private _rafId:    number | null          = null;
  private _audioCtx: AudioContext | null   = null;
  /** jsQR fallback: true when BarcodeDetector is unavailable */
  readonly _jsqrMode = signal(false);
  /** Off-screen canvas used for video-frame capture in jsQR mode */
  private _jsqrCanvas: HTMLCanvasElement | null = null;

  /** Highlight data: cornerPoints + expiry timestamp */
  private _highlight: {
    points: ReadonlyArray<{ x: number; y: number }>;
    box: DOMRectReadOnly;
    expires: number;
  } | null = null;

  /** Debounce same value in continuous mode */
  private _lastValue = '';
  private _lastValueAt = 0;

  constructor() {
    this.destroyRef.onDestroy(() => this._teardown());
  }

  /** Resolves when the BarcodeDetector check and camera start have settled */
  _initPromise: Promise<void> | null = null;

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this._initPromise = this._init();
  }

  // ── Initialisation ────────────────────────────────────────────────────────
  private async _init(): Promise<void> {
    this._isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (/Mac/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

    if (typeof BarcodeDetector === 'undefined') {
      // No BarcodeDetector — fall back to jsQR (QR-code only)
      this._jsqrMode.set(true);
      this.supportedFormats.emit(['qr_code']);
      this._currentFacing.set(this.facingMode());
      await this.startCamera();
      return;
    }

    try {
      const allFormats = await BarcodeDetector.getSupportedFormats();
      const requested  = this.formats();
      const available  = requested.filter(f => allFormats.includes(f)) as PkCodeFormat[];

      this.supportedFormats.emit(available);

      if (available.length === 0) {
        this._supported.set(false);
        this.error.emit('not-supported');
        return;
      }

      this._detector = new BarcodeDetector({ formats: available });
      this._currentFacing.set(this.facingMode());
      await this.startCamera();
    } catch {
      this._supported.set(false);
      this.error.emit('not-supported');
    }
  }

  // ── Camera ────────────────────────────────────────────────────────────────
  async startCamera(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this._stopStream();
    this._permissionDenied.set(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this._currentFacing() },
      });
      this._stream = stream;

      const video = this.videoEl()?.nativeElement;
      if (video) {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          this._syncCanvasSize();
          this._startOverlayLoop();
          if (!this.paused()) this._startScanLoop();
        };
      }

      // Check torch capability
      const track = stream.getVideoTracks()[0];
      if (track) {
        const caps = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
        this._torchSupported.set(!!caps.torch);
      }
    } catch (e: unknown) {
      const name = (e as DOMException)?.name ?? '';
      if (name === 'NotAllowedError') {
        this._permissionDenied.set(true);
        this.error.emit('permission-denied');
      } else {
        this.error.emit('no-camera');
      }
    }
  }

  async switchCamera(): Promise<void> {
    const next = this._currentFacing() === 'environment' ? 'user' : 'environment';
    this._currentFacing.set(next);
    await this.startCamera();
  }

  async toggleTorch(): Promise<void> {
    const track = this._stream?.getVideoTracks()[0];
    if (!track) return;
    const newVal = !this._torchOn();
    try {
      await track.applyConstraints({ advanced: [{ torch: newVal } as MediaTrackConstraintSet] });
      this._torchOn.set(newVal);
    } catch { /* device may not support it */ }
  }

  // ── Scan loop ─────────────────────────────────────────────────────────────
  private _startScanLoop(): void {
    this._stopScanLoop();
    this._scanTimer = setInterval(() => void this._scanFrame(), this.interval());
  }

  private _stopScanLoop(): void {
    if (this._scanTimer !== null) {
      clearInterval(this._scanTimer);
      this._scanTimer = null;
    }
  }

  private async _scanFrame(): Promise<void> {
    const video = this.videoEl()?.nativeElement;
    if (!video || video.readyState < 2 || this.paused()) return;
    if (this._detector) {
      try {
        const results = await this._detector.detect(video);
        if (results.length > 0) this._onDetected(results[0], 'camera');
      } catch { /* ignore per-frame decode errors */ }
    } else if (this._jsqrMode()) {
      const imageData = this._captureVideoFrame(video);
      if (imageData) this._detectWithJsQR(imageData, 'camera');
    }
  }

  // ── Detection result ──────────────────────────────────────────────────────
  private _onDetected(result: BarcodeDetectorResult, source: PkCodeScanResult['source']): void {
    const now = Date.now();

    // Debounce: skip same value within 2 s in continuous mode
    if (this.continuous() && result.rawValue === this._lastValue && now - this._lastValueAt < 2000) {
      return;
    }
    this._lastValue   = result.rawValue;
    this._lastValueAt = now;

    // Store highlight for next RAF frame
    if (this.showHighlight() && result.cornerPoints.length > 0) {
      this._highlight = {
        points:  result.cornerPoints,
        box:     result.boundingBox,
        expires: now + 800,
      };
    }

    if (this.beep()) this._playBeep();

    this.scan.emit({
      value:        result.rawValue,
      format:       result.format as PkCodeFormat,
      source,
      boundingBox:  result.boundingBox,
      cornerPoints: result.cornerPoints,
    });

    if (!this.continuous()) this._stopScanLoop();
  }

  // ── Upload ────────────────────────────────────────────────────────────────
  openFileInput(): void {
    this.fileInputEl()?.nativeElement.click();
  }

  // ── Capture fallback (for WebView permission-denied) ─────────────────────
  /** Opens a native camera picker via <input capture> — bypasses getUserMedia() */
  openCaptureInput(): void {
    this.captureInputEl()?.nativeElement.click();
  }

  async onCaptureChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    input.value = '';
    if (!file || (!this._detector && !this._jsqrMode())) return;
    await this._scanBlob(file, 'upload');
  }

  async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    input.value = '';
    if (!file || (!this._detector && !this._jsqrMode())) return;
    await this._scanBlob(file, 'upload');
  }

  // ── Clipboard paste ───────────────────────────────────────────────────────
  @HostListener('paste', ['$event'])
  async onPaste(event: ClipboardEvent): Promise<void> {
    if (!this.allowPaste() || (!this._detector && !this._jsqrMode())) return;
    const items = event.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        if (blob) { await this._scanBlob(blob, 'paste'); break; }
      }
    }
  }

  private async _scanBlob(blob: Blob, source: PkCodeScanResult['source']): Promise<void> {
    try {
      const bitmap = await createImageBitmap(blob);
      if (this._detector) {
        const results = await this._detector.detect(bitmap);
        bitmap.close();
        if (results.length > 0) {
          this._onDetected(results[0], source);
        } else {
          this.error.emit('decode-error');
        }
      } else if (this._jsqrMode()) {
        const canvas = document.createElement('canvas');
        canvas.width  = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (!this._detectWithJsQR(imageData, source)) {
          this.error.emit('decode-error');
        }
      }
    } catch {
      this.error.emit('decode-error');
    }
  }

  // ── jsQR helpers (fallback decoder) ──────────────────────────────────────
  private _captureVideoFrame(video: HTMLVideoElement): ImageData | null {
    const w = video.videoWidth  || video.clientWidth;
    const h = video.videoHeight || video.clientHeight;
    if (!w || !h) return null;
    if (!this._jsqrCanvas) this._jsqrCanvas = document.createElement('canvas');
    this._jsqrCanvas.width  = w;
    this._jsqrCanvas.height = h;
    const ctx = this._jsqrCanvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h);
  }

  /** Run jsQR on imageData; calls _onDetected on success; returns true if a code was found */
  private _detectWithJsQR(imageData: ImageData, source: PkCodeScanResult['source']): boolean {
    const result = jsQR(imageData.data, imageData.width, imageData.height);
    if (!result) return false;
    const loc = result.location;
    this._onDetected({
      rawValue:    result.data,
      format:      'qr_code',
      boundingBox: new DOMRect(
        loc.topLeftCorner.x,
        loc.topLeftCorner.y,
        loc.topRightCorner.x  - loc.topLeftCorner.x,
        loc.bottomLeftCorner.y - loc.topLeftCorner.y,
      ) as DOMRectReadOnly,
      cornerPoints: [
        loc.topLeftCorner,
        loc.topRightCorner,
        loc.bottomRightCorner,
        loc.bottomLeftCorner,
      ],
    } as BarcodeDetectorResult, source);
    return true;
  }

  // ── Reset (public) ────────────────────────────────────────────────────────
  /** Reset debounce state and restart scan loop (useful after continuous=false) */
  reset(): void {
    this._lastValue   = '';
    this._lastValueAt = 0;
    this._highlight   = null;
    if (!this.paused() && this._stream && (this._detector || this._jsqrMode())) {
      this._startScanLoop();
    }
  }

  // ── Canvas / Overlay ─────────────────────────────────────────────────────
  private _syncCanvasSize(): void {
    const video  = this.videoEl()?.nativeElement;
    const canvas = this.overlayEl()?.nativeElement;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth  || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;
  }

  private _startOverlayLoop(): void {
    const frame = () => {
      this._drawOverlayFrame();
      this._rafId = requestAnimationFrame(frame);
    };
    this._rafId = requestAnimationFrame(frame);
  }

  private _drawOverlayFrame(): void {
    const canvas = this.overlayEl()?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Keep canvas pixel size in sync with displayed size
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      const video = this.videoEl()?.nativeElement;
      if (video) {
        canvas.width  = video.videoWidth  || canvas.clientWidth;
        canvas.height = video.videoHeight || canvas.clientHeight;
      }
    }

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (this.showOverlay()) this._drawViewfinder(ctx, w, h);

    if (this.showHighlight() && this._highlight && Date.now() < this._highlight.expires) {
      this._drawHighlight(ctx, this._highlight.points, canvas);
    } else if (this._highlight && Date.now() >= this._highlight.expires) {
      this._highlight = null;
    }
  }

  private _drawViewfinder(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const size   = Math.min(w, h) * 0.65;
    const x      = (w - size) / 2;
    const y      = (h - size) / 2;
    const corner = size * 0.12;

    // Dim the area outside the viewfinder
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    // Cut out the centre using even-odd fill
    ctx.rect(x, y, size, size);
    ctx.fill('evenodd');
    ctx.restore();

    // Corner brackets
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth   = 3;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    // Top-left
    ctx.moveTo(x, y + corner); ctx.lineTo(x, y); ctx.lineTo(x + corner, y);
    // Top-right
    ctx.moveTo(x + size - corner, y); ctx.lineTo(x + size, y); ctx.lineTo(x + size, y + corner);
    // Bottom-right
    ctx.moveTo(x + size, y + size - corner); ctx.lineTo(x + size, y + size); ctx.lineTo(x + size - corner, y + size);
    // Bottom-left
    ctx.moveTo(x + corner, y + size); ctx.lineTo(x, y + size); ctx.lineTo(x, y + size - corner);
    ctx.stroke();
    ctx.restore();
  }

  private _drawHighlight(
    ctx: CanvasRenderingContext2D,
    points: ReadonlyArray<{ x: number; y: number }>,
    canvas: HTMLCanvasElement,
  ): void {
    if (points.length < 2) return;
    const video  = this.videoEl()?.nativeElement;
    const scaleX = canvas.width  / (video?.videoWidth  || canvas.width);
    const scaleY = canvas.height / (video?.videoHeight || canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x * scaleX, points[0].y * scaleY);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x * scaleX, points[i].y * scaleY);
    }
    ctx.closePath();
    ctx.fillStyle   = 'rgba(34,197,94,0.20)';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth   = 3;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // ── Beep ──────────────────────────────────────────────────────────────────
  private _playBeep(): void {
    try {
      if (!this._audioCtx) this._audioCtx = new AudioContext();
      const ctx  = this._audioCtx;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type             = 'sine';
      osc.frequency.value  = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch { /* AudioContext may be unavailable in test environment */ }
  }

  // ── Teardown ──────────────────────────────────────────────────────────────
  private _stopStream(): void {
    this._stopScanLoop();
    if (this._rafId !== null) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    this._stream?.getTracks().forEach(t => t.stop());
    this._stream = null;
    this._torchOn.set(false);
    this._torchSupported.set(false);
  }

  private _teardown(): void {
    this._stopStream();
    this._audioCtx?.close();
    this._jsqrCanvas = null;
  }
}
