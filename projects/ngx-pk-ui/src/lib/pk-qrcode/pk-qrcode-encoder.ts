// QR Code main encoder — ISO/IEC 18004:2015
// Returns a boolean[][] matrix (true = dark module)

import type { PkQrEcLevel, PkQrMode } from './pk-qrcode.model';
import { QR_BYTE_CAPACITY, QR_ALIGNMENT, QR_REMAINDER, getEcParams } from './pk-qrcode-tables';
import { rsEncode } from './pk-qrcode-rs';

const EC_IDX = { L: 0, M: 1, Q: 2, H: 3 } as const;

// ─── Mode detection ───────────────────────────────────────────────────────────
function detectMode(text: string): PkQrMode {
  if (/^\d+$/.test(text)) return 'numeric';
  if (/^[0-9A-Z $%*+\-./:]+$/.test(text)) return 'alphanumeric';
  return 'byte';
}

// ─── Version selection ────────────────────────────────────────────────────────
function selectVersion(text: string, ecLevel: PkQrEcLevel): number {
  const idx = EC_IDX[ecLevel];
  const byteLen = new TextEncoder().encode(text).length;
  for (let v = 1; v <= 40; v++) {
    if (QR_BYTE_CAPACITY[v - 1][idx] >= byteLen) return v;
  }
  throw new Error('QR Code: data too long (max 2953 bytes for version 40-L)');
}

// ─── Bit stream helpers ───────────────────────────────────────────────────────
class BitBuf {
  private bits: number[] = [];
  put(val: number, len: number): void {
    for (let i = len - 1; i >= 0; i--) this.bits.push((val >> i) & 1);
  }
  get length(): number { return this.bits.length; }
  get data(): number[] { return this.bits; }
  toBytes(): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < this.bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | (this.bits[i + j] ?? 0);
      bytes.push(b);
    }
    return bytes;
  }
}

// ─── Data encoding ────────────────────────────────────────────────────────────
const ALNUM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
const CC_LEN: Record<PkQrMode, [number, number, number]> = {
  // [v1-9, v10-26, v27-40] char-count bits
  numeric:      [10, 12, 14],
  alphanumeric: [9,  11, 13],
  byte:         [8,  16, 16],
};
const MODE_IND: Record<PkQrMode, number> = { numeric: 1, alphanumeric: 2, byte: 4 };

function ccLen(mode: PkQrMode, version: number): number {
  const idx = version <= 9 ? 0 : version <= 26 ? 1 : 2;
  return CC_LEN[mode][idx];
}

function encodeData(text: string, mode: PkQrMode, version: number, ecLevel: PkQrEcLevel): number[] {
  const buf = new BitBuf();
  const bytes = new TextEncoder().encode(text);
  const len = mode === 'byte' ? bytes.length : text.length;

  buf.put(MODE_IND[mode], 4);
  buf.put(len, ccLen(mode, version));

  if (mode === 'numeric') {
    for (let i = 0; i < text.length; i += 3) {
      const chunk = text.slice(i, i + 3);
      if (chunk.length === 3) buf.put(parseInt(chunk), 10);
      else if (chunk.length === 2) buf.put(parseInt(chunk), 7);
      else buf.put(parseInt(chunk), 4);
    }
  } else if (mode === 'alphanumeric') {
    for (let i = 0; i < text.length; i += 2) {
      if (i + 1 < text.length)
        buf.put(ALNUM.indexOf(text[i]) * 45 + ALNUM.indexOf(text[i + 1]), 11);
      else
        buf.put(ALNUM.indexOf(text[i]), 6);
    }
  } else {
    for (const byte of bytes) buf.put(byte, 8);
  }

  const ep = getEcParams(version, ecLevel);
  const totalBits = ep.total * 8;

  // Terminator (up to 4 zeros)
  const term = Math.min(4, totalBits - buf.length);
  buf.put(0, term);
  // Pad to byte boundary
  while (buf.length % 8 !== 0) buf.put(0, 1);
  // Pad to total capacity with alternating bytes 0xEC, 0x11
  const padBytes = [0xEC, 0x11];
  let pi = 0;
  while (buf.toBytes().length < ep.total) { buf.put(padBytes[pi++ % 2], 8); }

  return buf.toBytes().slice(0, ep.total);
}

// ─── Block interleaving ───────────────────────────────────────────────────────
function interleave(version: number, ecLevel: PkQrEcLevel, data: number[]): number[] {
  const ep = getEcParams(version, ecLevel);
  // Split data into blocks, compute RS for each
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];
  let pos = 0;
  for (const spec of ep.blocks) {
    for (let b = 0; b < spec.n; b++) {
      const block = data.slice(pos, pos + spec.dc);
      dataBlocks.push(block);
      ecBlocks.push(rsEncode(block, spec.ec));
      pos += spec.dc;
    }
  }
  // Interleave data codewords
  const result: number[] = [];
  const maxDc = Math.max(...dataBlocks.map(b => b.length));
  for (let i = 0; i < maxDc; i++)
    for (const b of dataBlocks) if (i < b.length) result.push(b[i]);
  // Interleave EC codewords
  const maxEc = Math.max(...ecBlocks.map(b => b.length));
  for (let i = 0; i < maxEc; i++)
    for (const b of ecBlocks) if (i < b.length) result.push(b[i]);
  return result;
}

// ─── Matrix construction ──────────────────────────────────────────────────────
type Mat = (boolean | null)[][];  // null = not yet placed (reserved for data)

function makeMatrix(size: number): Mat {
  return Array.from({ length: size }, () => new Array(size).fill(null));
}

function setModule(m: Mat, row: number, col: number, dark: boolean): void {
  m[row][col] = dark;
}

// Finder pattern (7×7 with separators)
function placeFinderPattern(m: Mat, row: number, col: number): void {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const pr = row + r, pc = col + c;
      if (pr < 0 || pr >= m.length || pc < 0 || pc >= m.length) continue;
      const inFinder = r >= 0 && r <= 6 && c >= 0 && c <= 6;
      const onRing = r === 0 || r === 6 || c === 0 || c === 6;
      const inCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      setModule(m, pr, pc, inFinder && (onRing || inCenter));
    }
  }
}

// Alignment pattern (5×5)
function placeAlignmentPattern(m: Mat, row: number, col: number): void {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const onEdge = r === -2 || r === 2 || c === -2 || c === 2;
      const isCenter = r === 0 && c === 0;
      setModule(m, row + r, col + c, onEdge || isCenter);
    }
  }
}

function placeTimingPatterns(m: Mat, size: number): void {
  for (let i = 8; i < size - 8; i++) {
    const dark = i % 2 === 0;
    if (m[6][i] === null) setModule(m, 6, i, dark);
    if (m[i][6] === null) setModule(m, i, 6, dark);
  }
}

function reserveFormatAreas(m: Mat, size: number): void {
  // Around top-left finder
  for (let i = 0; i <= 8; i++) {
    if (m[8][i] === null) m[8][i] = false;
    if (m[i][8] === null) m[i][8] = false;
  }
  // Top-right and bottom-left format areas
  for (let i = size - 8; i < size; i++) {
    if (m[8][i] === null) m[8][i] = false;
    if (m[i][8] === null) m[i][8] = false;
  }
  // Dark module
  m[size - 8][8] = true;
}

function reserveVersionAreas(m: Mat, size: number, version: number): void {
  if (version < 7) return;
  for (let i = 0; i < 6; i++) {
    for (let j = size - 11; j <= size - 9; j++) {
      m[i][j] = false;
      m[j][i] = false;
    }
  }
}

function placeStructuralPatterns(m: Mat, size: number, version: number): void {
  placeFinderPattern(m, 0, 0);
  placeFinderPattern(m, 0, size - 7);
  placeFinderPattern(m, size - 7, 0);
  placeTimingPatterns(m, size);
  const positions = QR_ALIGNMENT[version - 1] ?? [];
  for (const r of positions) {
    for (const c of positions) {
      if (m[r][c] !== null) continue; // skip if already occupied (finder area)
      placeAlignmentPattern(m, r, c);
    }
  }
  reserveFormatAreas(m, size);
  reserveVersionAreas(m, size, version);
}

// ─── Data placement ───────────────────────────────────────────────────────────
function placeDataBits(m: Mat, size: number, codewords: number[], remainder: number): void {
  // Build bit array
  const bits: boolean[] = [];
  for (const cw of codewords) {
    for (let i = 7; i >= 0; i--) bits.push(((cw >> i) & 1) === 1);
  }
  for (let i = 0; i < remainder; i++) bits.push(false);

  let bitIdx = 0;
  let goingUp = true;
  for (let rightCol = size - 1; rightCol >= 1; rightCol -= 2) {
    if (rightCol === 6) rightCol = 5; // skip timing column
    for (let rowOffset = 0; rowOffset < size; rowOffset++) {
      const row = goingUp ? size - 1 - rowOffset : rowOffset;
      for (let col = rightCol; col >= rightCol - 1; col--) {
        if (m[row][col] !== null) continue;
        m[row][col] = bits[bitIdx++] ?? false;
      }
    }
    goingUp = !goingUp;
  }
}

// ─── Masking ──────────────────────────────────────────────────────────────────
type MaskFn = (row: number, col: number) => boolean;
const MASKS: MaskFn[] = [
  (r, c) => (r + c) % 2 === 0,
  (r, _) => r % 2 === 0,
  (_, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

function applyMask(m: Mat, maskFn: MaskFn, isData: boolean[][]): boolean[][] {
  return m.map((row, r) =>
    row.map((cell, c) => {
      if (!isData[r][c]) return cell as boolean;
      return (cell as boolean) !== maskFn(r, c);
    })
  );
}

function penaltyScore(m: boolean[][]): number {
  const size = m.length;
  let score = 0;

  // Rule 1: 5+ consecutive same-color in row/col
  for (let r = 0; r < size; r++) {
    let runH = 1, runV = 1;
    for (let c = 1; c < size; c++) {
      if (m[r][c] === m[r][c - 1]) { runH++; if (runH === 5) score += 3; else if (runH > 5) score++; }
      else runH = 1;
      if (m[c][r] === m[c - 1][r]) { runV++; if (runV === 5) score += 3; else if (runV > 5) score++; }
      else runV = 1;
    }
  }
  // Rule 2: 2×2 same-color blocks
  for (let r = 0; r < size - 1; r++)
    for (let c = 0; c < size - 1; c++)
      if (m[r][c] === m[r][c+1] && m[r][c] === m[r+1][c] && m[r][c] === m[r+1][c+1]) score += 3;
  // Rule 3: finder-like patterns
  const pat1 = [true,false,true,true,true,false,true,false,false,false,false];
  const pat2 = [false,false,false,false,true,false,true,true,true,false,true];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - 11; c++) {
      const matchH1 = pat1.every((v, i) => m[r][c + i] === v);
      const matchH2 = pat2.every((v, i) => m[r][c + i] === v);
      const matchV1 = pat1.every((v, i) => m[r + i]?.[c] === v);
      const matchV2 = pat2.every((v, i) => m[r + i]?.[c] === v);
      if (matchH1 || matchH2) score += 40;
      if (matchV1 || matchV2) score += 40;
    }
  }
  // Rule 4: dark module proportion
  const total = size * size;
  const dark = m.flat().filter(Boolean).length;
  const pct = (dark / total) * 100;
  const prev5 = Math.floor(pct / 5) * 5;
  const next5 = prev5 + 5;
  score += Math.min(Math.abs(prev5 - 50), Math.abs(next5 - 50)) * 2 * 10;
  return score;
}

// ─── Format information ───────────────────────────────────────────────────────
const FORMAT_MASK = 0b101010000010010;
const EC_FORMAT = { L: 1, M: 0, Q: 3, H: 2 } as const;

function formatInfo(ecLevel: PkQrEcLevel, mask: number): number {
  let data = (EC_FORMAT[ecLevel] << 3) | mask;
  // BCH(15,5) error correction
  let b = data << 10;
  for (let i = 14; i >= 10; i--) {
    if ((b >> i) & 1) b ^= 0x537 << (i - 10);
  }
  return ((data << 10) | b) ^ FORMAT_MASK;
}

function placeFormatInfo(m: boolean[][], size: number, ecLevel: PkQrEcLevel, mask: number): void {
  const fmt = formatInfo(ecLevel, mask);

  // ── First copy — top-left region ─────────────────────────────────────────
  // Col 8, rows 0-5 (bits 0-5, LSB at row 0)
  for (let i = 0; i <= 5; i++) m[i][8] = ((fmt >> i) & 1) === 1;
  m[7][8] = ((fmt >> 6) & 1) === 1;  // row 7, col 8 (skip row 6 = vertical timing strip)
  m[8][8] = ((fmt >> 7) & 1) === 1;  // corner module
  m[8][7] = ((fmt >> 8) & 1) === 1;  // row 8, col 7 (skip col 6 = horizontal timing strip)
  // Row 8, cols 5 down to 0 (bits 9-14)
  for (let i = 9; i < 15; i++) m[8][14 - i] = ((fmt >> i) & 1) === 1;

  // ── Second copy ───────────────────────────────────────────────────────────
  // Top-right: row 8, cols size-1 down to size-8 (bits 0-7)
  for (let i = 0; i < 8; i++) m[8][size - 1 - i] = ((fmt >> i) & 1) === 1;
  // Bottom-left: col 8, rows size-7 to size-1 (bits 8-14)
  for (let i = 8; i < 15; i++) m[size - 15 + i][8] = ((fmt >> i) & 1) === 1;
}

// ─── Version information (v7+) ────────────────────────────────────────────────
function versionInfo(version: number): number {
  let b = version << 12;
  for (let i = 17; i >= 12; i--) {
    if ((b >> i) & 1) b ^= 0x1F25 << (i - 12);
  }
  return (version << 12) | b;
}

function placeVersionInfo(m: boolean[][], size: number, version: number): void {
  if (version < 7) return;
  const vi = versionInfo(version);
  for (let i = 0; i < 18; i++) {
    const bit = (vi >> i) & 1;
    const r = Math.floor(i / 3), c = size - 11 + (i % 3);
    m[r][c] = bit === 1;
    m[c][r] = bit === 1;
  }
}

// ─── Main encode function ─────────────────────────────────────────────────────
export function encodeQr(text: string, ecLevel: PkQrEcLevel): boolean[][] {
  const version = selectVersion(text, ecLevel);
  const size = version * 4 + 17;
  const mode = detectMode(text);

  // Encode data
  const dataBytes = encodeData(text, mode, version, ecLevel);
  const allCw = interleave(version, ecLevel, dataBytes);
  const remainder = QR_REMAINDER[version - 1];

  // Build matrix skeleton with structural patterns
  const skeleton = makeMatrix(size);
  placeStructuralPatterns(skeleton, size, version);

  // Mark which modules are data (null in skeleton)
  const isData = skeleton.map(row => row.map(cell => cell === null));

  // Place data bits
  placeDataBits(skeleton, size, allCw, remainder);

  // Try each mask, keep best penalty score
  let bestMatrix: boolean[][] | null = null;
  let bestScore = Infinity;
  let bestMask = 0;

  for (let maskIdx = 0; maskIdx < 8; maskIdx++) {
    const candidate = skeleton.map(row => row.map(c => c as boolean));
    const masked = applyMask(candidate, MASKS[maskIdx], isData);
    const score = penaltyScore(masked);
    if (score < bestScore) {
      bestScore = score;
      bestMatrix = masked;
      bestMask = maskIdx;
    }
  }

  const final = bestMatrix!.map(row => [...row]);
  placeFormatInfo(final, size, ecLevel, bestMask);
  placeVersionInfo(final, size, version);
  // Restore dark module (may have been overwritten by format info)
  final[size - 8][8] = true;

  return final;
}
