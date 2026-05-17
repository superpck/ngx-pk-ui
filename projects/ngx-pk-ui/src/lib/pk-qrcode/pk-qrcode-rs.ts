// Reed-Solomon encoder over GF(256) — primitive polynomial 0x11D
// No Angular dependencies.

const GF = 256;
const PRIM = 0x11D;

// Pre-compute log and antilog tables
const LOG = new Uint8Array(GF);
const EXP = new Uint8Array(GF * 2);
(function buildTables() {
  let x = 1;
  for (let i = 0; i < GF - 1; i++) {
    EXP[i] = x;
    EXP[i + GF - 1] = x;
    LOG[x] = i;
    x <<= 1;
    if (x >= GF) x ^= PRIM;
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[(LOG[a] + LOG[b]) % (GF - 1)];
}

/** Compute generator polynomial for n error-correction codewords.
 *  Returns n coefficients, highest-degree-first, WITHOUT the leading x^n term.
 *  Algorithm adapted from Nayuki QR Code generator (reedSolomonComputeDivisor).
 */
function generatorPoly(n: number): Uint8Array {
  const result = new Uint8Array(n);
  result[n - 1] = 1;  // start with the degree-0 polynomial: 1
  let root = 1;
  for (let i = 0; i < n; i++) {
    // Multiply result by (x - root) = (x + root) in GF(2^8)
    for (let j = 0; j < n; j++) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < n) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 2);  // root = 2^(i+1) = α^(i+1)
  }
  return result;
}

/** Compute n RS error-correction codewords for data array */
export function rsEncode(data: number[], n: number): number[] {
  const gen = generatorPoly(n);
  // Polynomial long division: dividend = data * x^n, divisor = gen
  const remainder = new Uint8Array(n);
  for (const byte of data) {
    const lead = byte ^ remainder[0];
    remainder.copyWithin(0, 1);
    remainder[n - 1] = 0;
    if (lead !== 0) {
      for (let i = 0; i < n; i++) {
        remainder[i] ^= gfMul(gen[i], lead);
      }
    }
  }
  return Array.from(remainder);
}
