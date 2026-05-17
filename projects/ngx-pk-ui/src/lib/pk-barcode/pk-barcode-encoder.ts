import type { PkBarcodeBar, PkBarcodeFormat } from './pk-barcode.model';

// ─── Code 128 ────────────────────────────────────────────────────────────────
// Each entry = 6 bar widths (3 bars + 3 spaces alternating), sum = 11 modules
// Index 0-105 = symbol values; 106 = stop pattern (7 elements = 13 modules)
const C128: number[][] = [
  [2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],
  [1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],
  [2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],
  [1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],
  [2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],
  [3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],
  [2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],
  [1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],
  [2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],
  [1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],
  [2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],
  [3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],
  [3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],
  [1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],
  [1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],
  [2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],
  [1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],
  [1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],
  [2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],
  [1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],
  [1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],
  [2,1,1,2,3,2],[2,3,3,1,1,1], // 106 = stop (next entry)
];
// Stop bar: special 7-element pattern
const C128_STOP = [2,3,3,1,1,1,2]; // 13 modules total

const C128_START_B = 104;
const C128_START_C = 105;

function barsFromWidths(widths: number[], dark: boolean): PkBarcodeBar[] {
  return widths.map((w, i) => ({ width: w, dark: (dark ? i % 2 === 0 : i % 2 !== 0) }));
}

/** Encode string using Code 128 Code Set B (printable ASCII 32–126) */
function encodeCode128(value: string): PkBarcodeBar[] {
  if (!value) throw new Error('Code 128: value must not be empty');
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (c < 32 || c > 126) throw new Error(`Code 128: unsupported char '${value[i]}' (code ${c})`);
  }

  const symbols: number[] = [C128_START_B];
  for (let i = 0; i < value.length; i++) {
    symbols.push(value.charCodeAt(i) - 32); // Code B offset
  }
  // Checksum: start value + sum(position * symbol_value) mod 103
  let check = C128_START_B;
  for (let i = 1; i < symbols.length; i++) check += i * symbols[i];
  check %= 103;
  symbols.push(check);

  const bars: PkBarcodeBar[] = [];
  // Quiet zone (10 modules white)
  bars.push({ width: 10, dark: false });
  for (const sym of symbols) {
    barsFromWidths(C128[sym], true).forEach(b => bars.push(b));
  }
  // Stop bar (7 elements, always starts dark)
  C128_STOP.forEach((w, i) => bars.push({ width: w, dark: i % 2 === 0 }));
  bars.push({ width: 10, dark: false }); // trailing quiet zone
  return bars;
}

// ─── Code 39 ─────────────────────────────────────────────────────────────────
// Each character = 5 bars + 4 spaces = 9 elements; W=3 N=1; interchar space N=1
const C39_CHARS: Record<string, number[]> = {
  '0':[1,1,1,3,3,1,3,1,1],'1':[3,1,1,3,1,1,1,1,3],'2':[1,1,3,3,1,1,1,1,3],
  '3':[3,1,3,3,1,1,1,1,1],'4':[1,1,1,3,3,1,1,1,3],'5':[3,1,1,3,3,1,1,1,1],
  '6':[1,1,3,3,3,1,1,1,1],'7':[1,1,1,3,1,1,3,1,3],'8':[3,1,1,3,1,1,3,1,1],
  '9':[1,1,3,3,1,1,3,1,1],'A':[3,1,1,1,1,3,1,1,3],'B':[1,1,3,1,1,3,1,1,3],
  'C':[3,1,3,1,1,3,1,1,1],'D':[1,1,1,1,3,3,1,1,3],'E':[3,1,1,1,3,3,1,1,1],
  'F':[1,1,3,1,3,3,1,1,1],'G':[1,1,1,1,1,3,3,1,3],'H':[3,1,1,1,1,3,3,1,1],
  'I':[1,1,3,1,1,3,3,1,1],'J':[1,1,1,1,3,3,3,1,1],'K':[3,1,1,1,1,1,1,3,3],
  'L':[1,1,3,1,1,1,1,3,3],'M':[3,1,3,1,1,1,1,3,1],'N':[1,1,1,1,3,1,1,3,3],
  'O':[3,1,1,1,3,1,1,3,1],'P':[1,1,3,1,3,1,1,3,1],'Q':[1,1,1,1,1,1,3,3,3],
  'R':[3,1,1,1,1,1,3,3,1],'S':[1,1,3,1,1,1,3,3,1],'T':[1,1,1,1,3,1,3,3,1],
  'U':[3,3,1,1,1,1,1,1,3],'V':[1,3,3,1,1,1,1,1,3],'W':[3,3,3,1,1,1,1,1,1],
  'X':[1,3,1,1,3,1,1,1,3],'Y':[3,3,1,1,3,1,1,1,1],'Z':[1,3,3,1,3,1,1,1,1],
  '-':[1,3,1,1,1,1,3,1,3],'.':[3,3,1,1,1,1,3,1,1],' ':[1,3,3,1,1,1,3,1,1],
  '$':[1,3,1,3,1,3,1,1,1],'/':[1,3,1,3,1,1,1,3,1],'+':[1,3,1,1,1,3,1,3,1],
  '%':[1,1,1,3,1,3,1,3,1],'*':[1,3,1,1,3,1,3,1,1],
};

/** Encode string using Code 39 (auto-uppercase) */
function encodeCode39(value: string): PkBarcodeBar[] {
  if (!value) throw new Error('Code 39: value must not be empty');
  const upper = value.toUpperCase();
  for (const ch of upper) {
    if (!C39_CHARS[ch]) throw new Error(`Code 39: unsupported char '${ch}'`);
  }

  const chars = ['*', ...upper.split(''), '*'];
  const bars: PkBarcodeBar[] = [];
  bars.push({ width: 10, dark: false });
  chars.forEach((ch, ci) => {
    const pat = C39_CHARS[ch];
    pat.forEach((w, i) => bars.push({ width: w, dark: i % 2 === 0 }));
    if (ci < chars.length - 1) bars.push({ width: 1, dark: false }); // interchar gap
  });
  bars.push({ width: 10, dark: false });
  return bars;
}

// ─── EAN Shared ──────────────────────────────────────────────────────────────
// L-encoding (odd parity), 7 modules, starts with space
const EAN_L = [
  [3,2,1,1],[2,2,2,1],[2,1,2,2],[1,4,1,1],[1,1,3,2],
  [1,2,3,1],[1,1,1,4],[1,3,1,2],[1,2,1,3],[3,1,1,2],
];
// R-encoding = complement of L: same widths as L, but rendered starting dark (bar first)
// Verified against ISO 15420: R[n] bit-pattern is bit-complement of L[n], which in
// run-length form has the same widths — the difference is only the starting color.
const EAN_R = EAN_L;

// G-encoding (even parity) = bit-reversal of R = reversed L widths, starts light
const EAN_G = EAN_L.map(p => [...p].reverse());

// First-digit parity patterns for EAN-13 (which of the 6 left digits use G vs L)
const EAN13_PARITY: boolean[][] = [
  [false,false,false,false,false,false], // 0 = LLLLLL
  [false,false,true, false,true, true],  // 1
  [false,false,true, true, false,true],  // 2
  [false,false,true, true, true, false], // 3
  [false,true, false,false,true, true],  // 4
  [false,true, true, false,false,true],  // 5
  [false,true, true, true, false,false], // 6
  [false,true, false,true, false,true],  // 7
  [false,true, false,true, true, false], // 8
  [false,true, true, false,true, false], // 9
];

function eanChecksum13(digits: number[]): number {
  // sum of odd-position digits + 3 * sum of even-position digits (1-based)
  let s = 0;
  for (let i = 0; i < 12; i++) s += digits[i] * (i % 2 === 0 ? 1 : 3);
  return (10 - (s % 10)) % 10;
}

function eanChecksum8(digits: number[]): number {
  let s = 0;
  for (let i = 0; i < 7; i++) s += digits[i] * (i % 2 === 0 ? 3 : 1);
  return (10 - (s % 10)) % 10;
}

function eanBars(pat: number[], startDark: boolean): PkBarcodeBar[] {
  return pat.map((w, i) => ({ width: w, dark: startDark ? i % 2 === 0 : i % 2 !== 0 }));
}

/** Encode EAN-13 (12 or 13 digits; checksum auto-computed if 12 given) */
function encodeEan13(value: string): PkBarcodeBar[] {
  if (!/^\d{12,13}$/.test(value)) throw new Error('EAN-13: must be 12 or 13 digits');
  const digits = value.split('').map(Number);
  if (digits.length === 12) digits.push(eanChecksum13(digits));
  else if (digits[12] !== eanChecksum13(digits.slice(0, 12)))
    throw new Error('EAN-13: invalid checksum');

  const first = digits[0];
  const parity = EAN13_PARITY[first];
  const bars: PkBarcodeBar[] = [];
  bars.push({ width: 11, dark: false }); // quiet zone
  // Start guard: 101
  bars.push({ width: 1, dark: true }); bars.push({ width: 1, dark: false }); bars.push({ width: 1, dark: true });
  // Left 6 digits (digits 1-6) using L or G encoding
  for (let i = 1; i <= 6; i++) {
    const enc = parity[i - 1] ? EAN_G[digits[i]] : EAN_L[digits[i]];
    // L/G both start with a space then dark
    enc.forEach((w, j) => bars.push({ width: w, dark: j % 2 !== 0 }));
  }
  // Center guard: 01010
  [0,1,0,1,0].forEach((d, i) => bars.push({ width: 1, dark: i % 2 !== 0 }));
  // Right 6 digits (digits 7-12) using R encoding (start dark)
  for (let i = 7; i <= 12; i++) {
    const enc = EAN_R[digits[i]];
    enc.forEach((w, j) => bars.push({ width: w, dark: j % 2 === 0 }));
  }
  // End guard: 101
  bars.push({ width: 1, dark: true }); bars.push({ width: 1, dark: false }); bars.push({ width: 1, dark: true });
  bars.push({ width: 7, dark: false }); // quiet zone
  return bars;
}

/** Encode EAN-8 (7 or 8 digits; checksum auto-computed if 7 given) */
function encodeEan8(value: string): PkBarcodeBar[] {
  if (!/^\d{7,8}$/.test(value)) throw new Error('EAN-8: must be 7 or 8 digits');
  const digits = value.split('').map(Number);
  if (digits.length === 7) digits.push(eanChecksum8(digits));
  else if (digits[7] !== eanChecksum8(digits.slice(0, 7)))
    throw new Error('EAN-8: invalid checksum');

  const bars: PkBarcodeBar[] = [];
  bars.push({ width: 7, dark: false });
  bars.push({ width: 1, dark: true }); bars.push({ width: 1, dark: false }); bars.push({ width: 1, dark: true });
  for (let i = 0; i < 4; i++) {
    EAN_L[digits[i]].forEach((w, j) => bars.push({ width: w, dark: j % 2 !== 0 }));
  }
  [0,1,0,1,0].forEach((_, i) => bars.push({ width: 1, dark: i % 2 !== 0 }));
  for (let i = 4; i < 8; i++) {
    EAN_R[digits[i]].forEach((w, j) => bars.push({ width: w, dark: j % 2 === 0 }));
  }
  bars.push({ width: 1, dark: true }); bars.push({ width: 1, dark: false }); bars.push({ width: 1, dark: true });
  bars.push({ width: 7, dark: false });
  return bars;
}

// ─── Public entry point ───────────────────────────────────────────────────────
export function encodeBarcode(value: string, format: PkBarcodeFormat): PkBarcodeBar[] {
  switch (format) {
    case 'code128': return encodeCode128(value);
    case 'code39':  return encodeCode39(value);
    case 'ean13':   return encodeEan13(value);
    case 'ean8':    return encodeEan8(value);
  }
}
