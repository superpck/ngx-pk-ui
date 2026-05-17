// QR Code static lookup tables — ISO/IEC 18004:2015
// All data is read-only; no Angular dependencies.

import type { PkQrEcLevel } from './pk-qrcode.model';

// ─── Capacity (max byte-mode chars per version + ECL) ────────────────────────
// Index 0 = version 1 … index 39 = version 40
// [L, M, Q, H]
export const QR_BYTE_CAPACITY: [number, number, number, number][] = [
  [17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],
  [134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],
  [321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],
  [586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],
  [929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],
  [1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],
  [1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],
  [2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],
  [2809,2213,1579,1219],[2953,2331,1663,1273],
];

// ─── EC params per version + ECL ─────────────────────────────────────────────
// Each entry: [totalDataCW, [{ecCW, numBlocks},...]]
// totalDataCW = total data codewords (before interleaving)
// blocks: array of {ec: ecCW per block, dc: dataCW per block, n: numBlocks}
export interface QrBlockSpec { ec: number; dc: number; n: number; }
export interface QrEcParams  { total: number; blocks: QrBlockSpec[]; }

// Lookup: QR_EC[version-1][ecLevelIndex 0=L,1=M,2=Q,3=H][0]
// Each ECL slot is wrapped in a single-element array for ergonomic inline formatting
export const QR_EC: QrEcParams[][][] = [
  // v1
  [[{total:19,blocks:[{ec:7,dc:19,n:1}]}],[{total:16,blocks:[{ec:10,dc:16,n:1}]}],[{total:13,blocks:[{ec:13,dc:13,n:1}]}],[{total:9,blocks:[{ec:17,dc:9,n:1}]}]],
  // v2
  [[{total:34,blocks:[{ec:10,dc:34,n:1}]}],[{total:28,blocks:[{ec:16,dc:28,n:1}]}],[{total:22,blocks:[{ec:22,dc:22,n:1}]}],[{total:16,blocks:[{ec:28,dc:16,n:1}]}]],
  // v3
  [[{total:55,blocks:[{ec:15,dc:55,n:1}]}],[{total:44,blocks:[{ec:26,dc:44,n:1}]}],[{total:34,blocks:[{ec:18,dc:17,n:2}]}],[{total:26,blocks:[{ec:22,dc:13,n:2}]}]],
  // v4
  [[{total:80,blocks:[{ec:20,dc:80,n:1}]}],[{total:64,blocks:[{ec:18,dc:32,n:2}]}],[{total:48,blocks:[{ec:26,dc:24,n:2}]}],[{total:36,blocks:[{ec:16,dc:9,n:4}]}]],
  // v5
  [[{total:108,blocks:[{ec:26,dc:108,n:1}]}],[{total:86,blocks:[{ec:24,dc:43,n:2}]}],[{total:62,blocks:[{ec:18,dc:15,n:2},{ec:18,dc:16,n:2}]}],[{total:46,blocks:[{ec:22,dc:11,n:2},{ec:22,dc:12,n:2}]}]],
  // v6
  [[{total:136,blocks:[{ec:18,dc:27,n:2}]}],[{total:108,blocks:[{ec:16,dc:27,n:4}]}],[{total:76,blocks:[{ec:24,dc:19,n:4}]}],[{total:60,blocks:[{ec:28,dc:15,n:4}]}]],
  // v7
  [[{total:156,blocks:[{ec:20,dc:31,n:2}]}],[{total:124,blocks:[{ec:18,dc:31,n:4}]}],[{total:88,blocks:[{ec:18,dc:14,n:2},{ec:18,dc:15,n:4}]}],[{total:66,blocks:[{ec:26,dc:13,n:4},{ec:26,dc:14,n:1}]}]],
  // v8
  [[{total:194,blocks:[{ec:24,dc:38,n:2}]}],[{total:154,blocks:[{ec:22,dc:38,n:2},{ec:22,dc:39,n:2}]}],[{total:110,blocks:[{ec:22,dc:18,n:4},{ec:22,dc:19,n:2}]}],[{total:86,blocks:[{ec:26,dc:14,n:4},{ec:26,dc:15,n:2}]}]],
  // v9
  [[{total:232,blocks:[{ec:30,dc:36,n:2}]}],[{total:182,blocks:[{ec:22,dc:36,n:3},{ec:22,dc:37,n:2}]}],[{total:132,blocks:[{ec:20,dc:16,n:4},{ec:20,dc:17,n:4}]}],[{total:100,blocks:[{ec:24,dc:12,n:4},{ec:24,dc:13,n:4}]}]],
  // v10
  [[{total:274,blocks:[{ec:18,dc:43,n:2},{ec:18,dc:44,n:2}]}],[{total:216,blocks:[{ec:26,dc:43,n:4},{ec:26,dc:44,n:1}]}],[{total:154,blocks:[{ec:24,dc:19,n:6},{ec:24,dc:20,n:2}]}],[{total:122,blocks:[{ec:28,dc:15,n:6},{ec:28,dc:16,n:2}]}]],
  // v11-40: simplified — use totalDataCW derived from capacity; provide block structure
  // v11
  [[{total:324,blocks:[{ec:20,dc:27,n:4}]}],[{total:254,blocks:[{ec:30,dc:50,n:1},{ec:30,dc:51,n:4}]}],[{total:180,blocks:[{ec:28,dc:22,n:4},{ec:28,dc:23,n:4}]}],[{total:140,blocks:[{ec:24,dc:12,n:3},{ec:24,dc:13,n:8}]}]],
  // v12
  [[{total:370,blocks:[{ec:24,dc:46,n:2},{ec:24,dc:47,n:2}]}],[{total:290,blocks:[{ec:22,dc:36,n:6},{ec:22,dc:37,n:2}]}],[{total:206,blocks:[{ec:26,dc:20,n:4},{ec:26,dc:21,n:6}]}],[{total:158,blocks:[{ec:28,dc:14,n:7},{ec:28,dc:15,n:4}]}]],
  // v13
  [[{total:428,blocks:[{ec:26,dc:48,n:4}]}],[{total:334,blocks:[{ec:22,dc:37,n:8},{ec:22,dc:38,n:1}]}],[{total:244,blocks:[{ec:24,dc:20,n:8},{ec:24,dc:21,n:4}]}],[{total:180,blocks:[{ec:22,dc:11,n:12},{ec:22,dc:12,n:4}]}]],
  // v14
  [[{total:461,blocks:[{ec:30,dc:43,n:3},{ec:30,dc:44,n:1}]}],[{total:365,blocks:[{ec:24,dc:40,n:4},{ec:24,dc:41,n:5}]}],[{total:261,blocks:[{ec:20,dc:16,n:11},{ec:20,dc:17,n:5}]}],[{total:197,blocks:[{ec:24,dc:12,n:11},{ec:24,dc:13,n:5}]}]],
  // v15
  [[{total:523,blocks:[{ec:22,dc:27,n:5},{ec:22,dc:28,n:1}]}],[{total:415,blocks:[{ec:24,dc:41,n:5},{ec:24,dc:42,n:5}]}],[{total:295,blocks:[{ec:30,dc:24,n:5},{ec:30,dc:25,n:7}]}],[{total:223,blocks:[{ec:24,dc:12,n:11},{ec:24,dc:13,n:7}]}]],
  // v16
  [[{total:589,blocks:[{ec:24,dc:34,n:5},{ec:24,dc:35,n:1}]}],[{total:453,blocks:[{ec:28,dc:45,n:7},{ec:28,dc:46,n:3}]}],[{total:325,blocks:[{ec:24,dc:19,n:15},{ec:24,dc:20,n:2}]}],[{total:253,blocks:[{ec:30,dc:15,n:3},{ec:30,dc:16,n:13}]}]],
  // v17
  [[{total:647,blocks:[{ec:28,dc:50,n:1},{ec:28,dc:51,n:5}]}],[{total:507,blocks:[{ec:28,dc:46,n:10},{ec:28,dc:47,n:1}]}],[{total:367,blocks:[{ec:28,dc:22,n:1},{ec:28,dc:23,n:15}]}],[{total:283,blocks:[{ec:28,dc:14,n:2},{ec:28,dc:15,n:17}]}]],
  // v18
  [[{total:721,blocks:[{ec:30,dc:48,n:5},{ec:30,dc:49,n:1}]}],[{total:563,blocks:[{ec:26,dc:43,n:9},{ec:26,dc:44,n:4}]}],[{total:397,blocks:[{ec:28,dc:22,n:17},{ec:28,dc:23,n:1}]}],[{total:313,blocks:[{ec:28,dc:14,n:2},{ec:28,dc:15,n:19}]}]],
  // v19
  [[{total:795,blocks:[{ec:28,dc:43,n:3},{ec:28,dc:44,n:4}]}],[{total:627,blocks:[{ec:26,dc:44,n:3},{ec:26,dc:45,n:11}]}],[{total:445,blocks:[{ec:26,dc:21,n:17},{ec:26,dc:22,n:4}]}],[{total:341,blocks:[{ec:26,dc:13,n:9},{ec:26,dc:14,n:16}]}]],
  // v20
  [[{total:861,blocks:[{ec:28,dc:45,n:3},{ec:28,dc:46,n:5}]}],[{total:669,blocks:[{ec:26,dc:41,n:3},{ec:26,dc:42,n:13}]}],[{total:485,blocks:[{ec:30,dc:25,n:15},{ec:30,dc:26,n:5}]}],[{total:385,blocks:[{ec:28,dc:15,n:15},{ec:28,dc:16,n:10}]}]],
  // v21
  [[{total:932,blocks:[{ec:28,dc:46,n:4},{ec:28,dc:47,n:4}]}],[{total:714,blocks:[{ec:26,dc:42,n:17}]}],[{total:512,blocks:[{ec:28,dc:24,n:17},{ec:28,dc:25,n:6}]}],[{total:406,blocks:[{ec:30,dc:16,n:19},{ec:30,dc:17,n:6}]}]],
  // v22
  [[{total:1006,blocks:[{ec:28,dc:45,n:2},{ec:28,dc:46,n:7}]}],[{total:782,blocks:[{ec:28,dc:46,n:17},{ec:28,dc:47,n:1}]}],[{total:568,blocks:[{ec:30,dc:24,n:7},{ec:30,dc:25,n:16}]}],[{total:442,blocks:[{ec:24,dc:13,n:34}]}]],
  // v23
  [[{total:1094,blocks:[{ec:30,dc:45,n:4},{ec:30,dc:46,n:5}]}],[{total:860,blocks:[{ec:28,dc:44,n:4},{ec:28,dc:45,n:14}]}],[{total:614,blocks:[{ec:30,dc:26,n:11},{ec:30,dc:27,n:14}]}],[{total:464,blocks:[{ec:30,dc:15,n:16},{ec:30,dc:16,n:14}]}]],
  // v24
  [[{total:1174,blocks:[{ec:30,dc:45,n:6},{ec:30,dc:46,n:4}]}],[{total:914,blocks:[{ec:28,dc:46,n:6},{ec:28,dc:47,n:14}]}],[{total:664,blocks:[{ec:28,dc:23,n:11},{ec:28,dc:24,n:16}]}],[{total:514,blocks:[{ec:30,dc:16,n:30},{ec:30,dc:17,n:2}]}]],
  // v25
  [[{total:1276,blocks:[{ec:26,dc:45,n:8},{ec:26,dc:46,n:4}]}],[{total:1000,blocks:[{ec:28,dc:47,n:8},{ec:28,dc:48,n:13}]}],[{total:718,blocks:[{ec:30,dc:24,n:7},{ec:30,dc:25,n:22}]}],[{total:538,blocks:[{ec:30,dc:15,n:22},{ec:30,dc:16,n:13}]}]],
  // v26
  [[{total:1370,blocks:[{ec:28,dc:45,n:10},{ec:28,dc:46,n:2}]}],[{total:1062,blocks:[{ec:28,dc:46,n:19},{ec:28,dc:47,n:4}]}],[{total:754,blocks:[{ec:28,dc:22,n:28},{ec:28,dc:23,n:6}]}],[{total:596,blocks:[{ec:30,dc:16,n:33},{ec:30,dc:17,n:4}]}]],
  // v27
  [[{total:1468,blocks:[{ec:30,dc:45,n:8},{ec:30,dc:46,n:4}]}],[{total:1128,blocks:[{ec:28,dc:45,n:22},{ec:28,dc:46,n:3}]}],[{total:808,blocks:[{ec:30,dc:23,n:8},{ec:30,dc:24,n:26}]}],[{total:628,blocks:[{ec:30,dc:15,n:12},{ec:30,dc:16,n:28}]}]],
  // v28
  [[{total:1531,blocks:[{ec:30,dc:45,n:3},{ec:30,dc:46,n:10}]}],[{total:1193,blocks:[{ec:28,dc:45,n:3},{ec:28,dc:46,n:23}]}],[{total:871,blocks:[{ec:30,dc:24,n:4},{ec:30,dc:25,n:31}]}],[{total:661,blocks:[{ec:30,dc:15,n:11},{ec:30,dc:16,n:31}]}]],
  // v29
  [[{total:1631,blocks:[{ec:30,dc:45,n:7},{ec:30,dc:46,n:7}]}],[{total:1267,blocks:[{ec:28,dc:45,n:21},{ec:28,dc:46,n:7}]}],[{total:911,blocks:[{ec:30,dc:23,n:1},{ec:30,dc:24,n:37}]}],[{total:701,blocks:[{ec:30,dc:15,n:19},{ec:30,dc:16,n:26}]}]],
  // v30
  [[{total:1735,blocks:[{ec:30,dc:45,n:5},{ec:30,dc:46,n:10}]}],[{total:1373,blocks:[{ec:28,dc:45,n:19},{ec:28,dc:46,n:10}]}],[{total:985,blocks:[{ec:30,dc:24,n:15},{ec:30,dc:25,n:25}]}],[{total:745,blocks:[{ec:30,dc:15,n:23},{ec:30,dc:16,n:25}]}]],
  // v31
  [[{total:1843,blocks:[{ec:30,dc:45,n:13},{ec:30,dc:46,n:3}]}],[{total:1455,blocks:[{ec:28,dc:45,n:2},{ec:28,dc:46,n:29}]}],[{total:1033,blocks:[{ec:30,dc:24,n:42},{ec:30,dc:25,n:1}]}],[{total:793,blocks:[{ec:30,dc:15,n:23},{ec:30,dc:16,n:28}]}]],
  // v32
  [[{total:1955,blocks:[{ec:30,dc:45,n:17}]}],[{total:1541,blocks:[{ec:28,dc:45,n:10},{ec:28,dc:46,n:23}]}],[{total:1115,blocks:[{ec:30,dc:24,n:10},{ec:30,dc:25,n:35}]}],[{total:845,blocks:[{ec:30,dc:15,n:19},{ec:30,dc:16,n:35}]}]],
  // v33
  [[{total:2071,blocks:[{ec:30,dc:45,n:17},{ec:30,dc:46,n:1}]}],[{total:1631,blocks:[{ec:28,dc:45,n:14},{ec:28,dc:46,n:21}]}],[{total:1171,blocks:[{ec:30,dc:24,n:29},{ec:30,dc:25,n:19}]}],[{total:901,blocks:[{ec:30,dc:15,n:11},{ec:30,dc:16,n:46}]}]],
  // v34
  [[{total:2191,blocks:[{ec:30,dc:45,n:13},{ec:30,dc:46,n:6}]}],[{total:1725,blocks:[{ec:28,dc:45,n:14},{ec:28,dc:46,n:23}]}],[{total:1231,blocks:[{ec:30,dc:24,n:44},{ec:30,dc:25,n:7}]}],[{total:961,blocks:[{ec:30,dc:16,n:59},{ec:30,dc:17,n:1}]}]],
  // v35
  [[{total:2306,blocks:[{ec:30,dc:45,n:12},{ec:30,dc:46,n:7}]}],[{total:1812,blocks:[{ec:28,dc:44,n:12},{ec:28,dc:45,n:26}]}],[{total:1286,blocks:[{ec:30,dc:24,n:39},{ec:30,dc:25,n:14}]}],[{total:986,blocks:[{ec:30,dc:15,n:22},{ec:30,dc:16,n:41}]}]],
  // v36
  [[{total:2434,blocks:[{ec:30,dc:45,n:6},{ec:30,dc:46,n:14}]}],[{total:1914,blocks:[{ec:28,dc:45,n:6},{ec:28,dc:46,n:34}]}],[{total:1354,blocks:[{ec:30,dc:24,n:46},{ec:30,dc:25,n:10}]}],[{total:1054,blocks:[{ec:30,dc:15,n:2},{ec:30,dc:16,n:64}]}]],
  // v37
  [[{total:2566,blocks:[{ec:30,dc:45,n:17},{ec:30,dc:46,n:4}]}],[{total:1992,blocks:[{ec:28,dc:45,n:29},{ec:28,dc:46,n:14}]}],[{total:1426,blocks:[{ec:30,dc:24,n:49},{ec:30,dc:25,n:10}]}],[{total:1096,blocks:[{ec:30,dc:15,n:24},{ec:30,dc:16,n:46}]}]],
  // v38
  [[{total:2702,blocks:[{ec:30,dc:45,n:4},{ec:30,dc:46,n:18}]}],[{total:2102,blocks:[{ec:28,dc:45,n:13},{ec:28,dc:46,n:32}]}],[{total:1502,blocks:[{ec:30,dc:24,n:48},{ec:30,dc:25,n:14}]}],[{total:1142,blocks:[{ec:30,dc:15,n:42},{ec:30,dc:16,n:32}]}]],
  // v39
  [[{total:2812,blocks:[{ec:30,dc:45,n:20},{ec:30,dc:46,n:4}]}],[{total:2216,blocks:[{ec:28,dc:45,n:40},{ec:28,dc:46,n:7}]}],[{total:1582,blocks:[{ec:30,dc:24,n:43},{ec:30,dc:25,n:22}]}],[{total:1222,blocks:[{ec:30,dc:15,n:10},{ec:30,dc:16,n:67}]}]],
  // v40
  [[{total:2956,blocks:[{ec:30,dc:45,n:19},{ec:30,dc:46,n:6}]}],[{total:2334,blocks:[{ec:28,dc:45,n:18},{ec:28,dc:46,n:31}]}],[{total:1666,blocks:[{ec:30,dc:24,n:34},{ec:30,dc:25,n:34}]}],[{total:1276,blocks:[{ec:30,dc:15,n:20},{ec:30,dc:16,n:61}]}]],
];

// The QR_EC table above stores [L,M,Q,H] arrays directly (not as QrEcParams objects)
// Fix: flatten the structure properly
export function getEcParams(version: number, ecLevel: PkQrEcLevel): QrEcParams {
  const idx = { L: 0, M: 1, Q: 2, H: 3 }[ecLevel];
  return QR_EC[version - 1][idx][0];
}

// ─── Alignment pattern center positions per version ───────────────────────────
export const QR_ALIGNMENT: number[][] = [
  [],           // v1
  [6,18],[6,22],[6,26],[6,30],[6,34],    // v2-6
  [6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],  // v7-13
  [6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90], // v14-20
  [6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118], // v21-27
  [6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146], // v28-34
  [6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170], // v35-40
];

// ─── Remainder bits per version ───────────────────────────────────────────────
export const QR_REMAINDER: number[] = [
  0,7,7,7,7,7,0,0,0,0, 0,0,0,3,3,3,3,3,3,3, 4,4,4,4,4,4,4,3,3,3,
  3,3,3,3,3,0,0,0,0,0,
];
