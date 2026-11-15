// Top 5 Strongest Hindu Gods — Woodcut Print, 1080×1920.
// Every plate is drawn in plate coordinates (PW×PH) on a carve mask (white = cut) and a colour plate,
// then printed by the woodcut compositor. Timings come from the narration's own pauses (TREATMENT.md).
import * as WC from './engine/index.js';
import { clamp, lerp, seg, ss, eio, eo, ei, mulberry } from '/core/lib.js';
import { curl, peelState } from './trans.js';

const W = 1080, H = 1920, IMG = { x: 40, y: 40, w: 1000, h: 1440 }, PW = 1000, PH = 1440;
const SAF = '#E2662A';                         // the one colour: divine power
export const DUR = 77.95;

const [M, m] = WC.canvas(W, H), [C, c] = WC.canvas(W, H);
const [A, a] = WC.canvas(W, H), [B, b] = WC.canvas(W, H);
let PR;
const L = WC.light(.55, -.7, .5);

// ---------- geometry ----------
const E = (cx, cy, rx, ry, rot = 0, n = 48) => { const o = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2, x = Math.cos(t) * rx, y = Math.sin(t) * ry; o.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); } return o; };
function cr(P, n = 10) {                       // Catmull-Rom through P
  if (P.length < 3) return P.slice();
  const o = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t;
      o.push([0, 1].map(j => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); }
  }
  o.push(P[P.length - 1]); return o;
}
// a tapered limb / body / tail along a path: radius r0 → r1
function tube(P, r0, r1 = r0) {
  const S = cr(P, 8), l = [], r = [];
  for (let i = 0; i < S.length; i++) {
    const p = S[Math.max(0, i - 1)], q = S[Math.min(S.length - 1, i + 1)], dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy) || 1;
    const rr = lerp(r0, r1, i / (S.length - 1)), nx = -dy / d * rr, ny = dx / d * rr;
    l.push([S[i][0] + nx, S[i][1] + ny]); r.push([S[i][0] - nx, S[i][1] - ny]);
  }
  const cap = (pt, n, s) => { const o = []; for (let k = 1; k < 6; k++) { const t = k / 6 * Math.PI; o.push([pt[0] + n[0] * Math.cos(t) * s + n[1] * Math.sin(t) * s, pt[1] + n[1] * Math.cos(t) * s - n[0] * Math.sin(t) * s]); } return o; };
  const e = S.length - 1, d0 = [S[1][0] - S[0][0], S[1][1] - S[0][1]], de = [S[e][0] - S[e - 1][0], S[e][1] - S[e - 1][1]];
  const nrm = v => { const d = Math.hypot(...v) || 1; return [v[0] / d, v[1] / d]; };
  const n0 = nrm(d0), ne = nrm(de);
  return [...l, ...cap(S[e], [-ne[1], ne[0]], r1).map(p => p), ...r.reverse(), ...cap(S[0], [ne[1] * 0 + n0[1], -n0[0]], r0)];
}
const xf = (P, x = 0, y = 0, s = 1, rot = 0, fx = 1) => P.map(([px, py]) => { px *= s * fx; py *= s; return [x + px * Math.cos(rot) - py * Math.sin(rot), y + px * Math.sin(rot) + py * Math.cos(rot)]; });

// a figure = parts drawn in order. part: {p: polygon, white?, flat?: '#000' | '#fff' (no hatching), sp, halo}
let seedN = 1;
function fig(parts, o = {}) {
  return parts.map(pt => pt.flat ? pt : { ...pt, S: WC.shape([pt.p], { light: o.light || L, sp: pt.sp ?? o.sp ?? 9, halo: pt.halo ?? o.halo ?? 7, white: pt.white, seed: seedN++, res: o.res ?? 2, reveal: o.reveal, lo: .25 }) });
}
function drawFig(F, t, g = m) {
  for (const pt of F) { if (pt.flat) WC.fillPoly(g, [pt.p], pt.flat); else pt.S.draw(g, t); }
}

// ---------- page ----------
function begin(cam = {}, mirror = false) {
  for (const g of [m, c]) g.setTransform(1, 0, 0, 1, 0, 0);
  m.fillStyle = '#fff'; m.fillRect(0, 0, W, H); c.clearRect(0, 0, W, H);
  for (const g of [m, c]) {
    g.save(); g.beginPath(); g.rect(IMG.x, IMG.y, IMG.w, IMG.h); g.clip();
    if (mirror) { g.translate(W, 0); g.scale(-1, 1); }
    const z = cam.z ?? 1; g.translate(IMG.x + IMG.w / 2, IMG.y + IMG.h / 2); g.scale(z, z); g.translate(-(cam.x ?? PW / 2), -(cam.y ?? PH / 2));
  }
  m.fillStyle = '#000'; m.fillRect(-8000, -8000, 16000, 16000);
}
function end() { m.restore(); c.restore(); }
function carveText(txt, x, y, px, o = {}) {           // carved into the block (white), in plate coords
  m.save(); m.font = `400 ${px}px "IM Fell English SC"`; m.textAlign = 'center'; m.textBaseline = 'middle';
  if (o.clip != null) { const w = m.measureText(txt).width; m.beginPath(); m.rect(x - w / 2 - 20, y - px, (w + 40) * o.clip, px * 2); m.clip(); }
  m.fillStyle = o.ink || '#fff'; m.fillText(txt, x, y); m.restore();
}
function print(g, t, o = {}) {
  const hit = EV.some(e => e.type === 'impression' && t >= e.t && t < e.t + 2 / 24);   // a new impression: two frames of misregistration
  const out = PR.render(M, C, { seed: 3, inkSeed: Math.floor(t * 12) + (o.imp || 0) * 7, plate: SAF, mode: o.mode || 'print', reg: hit ? [9, 6] : [3, 2], sheen: .14 });
  g.drawImage(out, 0, 0);
}

// ---------- captions (letterpress in the bottom margin) ----------
const VO = [
  [0.00, 1.91, 'Who is the strongest Hindu god?'], [2.44, 4.96, 'Here are five you never want to stand against.'],
  [5.65, 7.33, 'Number five: Hanuman.'], [7.93, 12.70, 'When Lakshmana lay dying, Hanuman flew to the Himalayas for one healing herb.'],
  [13.33, 17.43, "He couldn't find it, so he tore off the whole mountain and carried it back."], [18.13, 21.37, 'Number four: Indra, king of the heavens.'],
  [21.87, 24.61, "The serpent Vritra swallowed the world's rivers."], [25.08, 29.59, 'Indra struck him down with the Vajra, his thunderbolt, and set the waters free.'], [30.37, 31.92, 'Number three: Durga.'],
  [32.44, 36.24, 'The buffalo demon Mahishasura could not be killed by any god.'], [36.79, 39.56, 'So the gods poured their power into one warrior.'],
  [40.14, 42.87, 'Ten arms, ten weapons, riding a lion.'], [43.39, 44.23, 'She ended him.'],
  [44.99, 47.51, 'Number two: Vishnu, the preserver.'], [48.11, 52.13, 'As the dwarf Vamana, he asked a demon king for three steps of land.'],
  [52.63, 58.15, 'Then he grew until his three steps covered the earth, the sky, and everything beyond.'],
  [58.81, 61.58, 'And number one: Shiva, the destroyer.'], [62.11, 66.28, 'One glance from his third eye burned the god of desire to ash.'],
  [66.71, 69.81, 'And when the universe ends, it ends in his dance.'], [70.45, 76.13, 'To many devotees, Shiva, Vishnu or the Goddess is the supreme power above all.'],
  [76.80, 77.95, "Who's your number one?"],
];
export const SUBS = VO.map(([s, e, text], i) => {
  const nx = i + 1 < VO.length ? VO[i + 1][0] - .07 : DUR + 9;   // the last caption stays up through the final hold
  const t1 = Math.min(nx, i + 1 < VO.length ? DUR : DUR + 9, Math.max(e + .6, s + 1.8));
  return { t0: Math.max(0, s - .05), t1: s < 58.15 ? Math.min(t1, 58.15) : t1, text };   // nothing on screen in the silence
});
const CAP = { px: 54, lh: 70, y: 1700, w: 940 };
function wrap(g, text) {
  g.font = `400 ${CAP.px}px "IM Fell English"`; const words = text.split(' '), lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > CAP.w && cur) { lines.push(cur); cur = w; } else cur = t; }
  lines.push(cur); return lines;
}
function caption(t) {
  const s = SUBS.find(s => t >= s.t0 && t < s.t1); if (!s) return;
  const al = Math.min(seg(t, s.t0, s.t0 + .1), 1 - seg(t, s.t1 - .15, s.t1));
  const lines = wrap(m, s.text);
  m.save(); m.setTransform(1, 0, 0, 1, 0, 0); m.textAlign = 'center'; m.textBaseline = 'middle'; m.fillStyle = `rgba(0,0,0,${al})`;
  lines.forEach((ln, i) => m.fillText(ln, W / 2, CAP.y + (i - (lines.length - 1) / 2) * CAP.lh));
  m.restore();
}
export function texts(t) {
  const s = SUBS.find(s => t >= s.t0 && t < s.t1); if (!s) return [];
  const n = wrap(m, s.text).length;
  return [{ id: 'cap' + SUBS.indexOf(s), text: s.text, x0: 70, x1: W - 70, y0: CAP.y - n * CAP.lh / 2, y1: CAP.y + n * CAP.lh / 2 }];
}

// ---------- shared pieces ----------
const R = mulberry(77);
const starPts = (n, x0, x1, y0, y1, r = [2, 5], seed = 9) => { const q = mulberry(seed), o = []; for (let i = 0; i < n; i++) o.push([lerp(x0, x1, q()), lerp(y0, y1, q()), lerp(r[0], r[1], q())]); return o; };
function plateStroke(pts, w, al = 1) { c.save(); c.strokeStyle = `rgba(0,0,0,${al})`; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.stroke(); c.restore(); }
function plateDisc(x, y, r, al = 1) { c.save(); c.fillStyle = `rgba(0,0,0,${al})`; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.restore(); }
const cloud = (cx, cy, w, s = 1) => { const o = []; for (let i = 0; i < 7; i++) o.push(E(cx - w / 2 + i * w / 6, cy - Math.sin(i / 6 * Math.PI) * 40 * s, 70 * s, 48 * s)); return o; };

// ---------- builders (all at init: every cache builds itself before the first frame) ----------
let K = {};
function build() {
  // ===== intro
  K.introRays = WC.rays(500, 640, { n: 54, r0: 70, r1: [260, 560], w: 18, seed: 4, reveal: { t0: .25, t1: 1.6, jit: .5 } });
  K.introEye = WC.shape([[[380, 640], [440, 590], [500, 572], [560, 590], [620, 640], [560, 690], [500, 708], [440, 690]]], { light: L, sp: 7, halo: 8, white: true, reveal: { t0: 0, t1: .9, key: (x, y) => clamp(Math.abs(x - 500) / 130) } });
  K.introFlames = [0, 1, 2, 3, 4].map(i => WC.rays(180 + i * 160, 1140, { n: 9, r0: 6, r1: [40, 90], w: 9, a0: -Math.PI * .85, a1: -Math.PI * .15, seed: 30 + i, reveal: { t0: 2.5 + i * .35, t1: 2.9 + i * .35 } }));

  // ===== V Hanuman — flying (local frame: body along +x, then rotated)
  const hf = [
    { p: tube([[-50, 20], [-190, 70], [-310, 60]], 34, 22) }, { p: tube([[-40, 40], [-170, 120], [-270, 170]], 32, 20) },
    { p: tube([[-90, -10], [-190, -120], [-140, -230], [-50, -215]], 18, 9) },
    { p: E(0, 0, 130, 72) },
    { p: tube([[40, 30], [-10, 100], [-60, 150]], 26, 20) }, { p: tube([[-70, 150], [-30, 270]], 9, 9) }, { p: E(-25, 300, 58, 58), sp: 7 },
    { p: E(150, -30, 60, 58) }, { p: [[108, -72], [150, -170], [192, -72]] }, { p: E(168, -22, 36, 30), white: true, halo: 4 },
    { p: E(176, -32, 7, 6), flat: '#000' }, { p: E(205, -6, 30, 22), halo: 4 },
    { p: tube([[80, -20], [200, -90], [310, -150]], 26, 19) }, { p: E(322, -156, 28, 28) },
  ];
  K.hanFly = fig(hf.map(pt => ({ ...pt, p: xf(pt.p, 470, 650, 1.25, -.6) })), { reveal: { t0: 0, t1: .8, key: (x, y) => clamp(1 - y / PH) } });
  K.himal = WC.shape([[[0, 1440], [0, 1210], [120, 1120], [210, 1180], [330, 1040], [460, 1170], [560, 1090], [700, 960], [820, 1110], [910, 1050], [1000, 1130], [1000, 1440]]], { light: WC.light(.6, -.6, .35), sp: 8, halo: 6, seed: 5, res: 3, dir: Math.PI * .25, lo: .15 });
  K.stars5 = WC.flecks(starPts(90, 0, 1000, 0, 900, [2, 5], 3), { seed: 2 });
  K.herb = WC.rays(700, 968, { n: 14, r0: 4, r1: [26, 52], w: 6, seed: 8 });
  // holding the mountain
  const hs = [
    { p: tube([[-40, 120], [-70, 300], [-60, 470]], 36, 26) }, { p: tube([[40, 120], [80, 300], [90, 470]], 36, 26) },
    { p: tube([[-60, 120], [-170, 60], [-230, -60], [-200, -140]], 16, 8) },
    { p: E(0, 40, 92, 140) },
    { p: tube([[-70, -60], [-140, -170], [-150, -300]], 28, 22) }, { p: tube([[70, -60], [140, -170], [150, -300]], 28, 22) },
    { p: E(0, -150, 58, 60) }, { p: [[-40, -192], [0, -290], [40, -192]] }, { p: E(12, -140, 34, 32), white: true, halo: 4 }, { p: E(20, -150, 7, 6), flat: '#000' },
  ];
  K.hanLift = fig(hs.map(pt => ({ ...pt, p: xf(pt.p, 500, 900, 1.2) })));
  K.mount = WC.shape([[[180, 560], [300, 380], [380, 430], [500, 250], [620, 420], [700, 360], [820, 560], [700, 600], [500, 620], [300, 600]]], { light: WC.light(.5, -.7, .4), sp: 8, halo: 8, seed: 12, dir: Math.PI * .3 });
  K.mountHerb = WC.rays(500, 300, { n: 16, r0: 6, r1: [30, 60], w: 7, seed: 9 });
  K.chips = WC.flecks(starPts(40, 220, 780, 0, 260, [3, 7], 21), { seed: 4 });
  K.cloud5 = cloud(500, 1420, 1100, 1.4).map((p, i) => WC.cutAlong(p, { closed: true, w: 10, kind: 'u', seed: 40 + i }));

  // ===== IV Indra
  const ind = [
    { p: tube([[-40, 120], [-50, 300], [-55, 470]], 38, 28) }, { p: tube([[40, 120], [50, 300], [55, 470]], 38, 28) },
    { p: [[-110, 60], [110, 60], [150, 330], [-150, 330]] },
    { p: E(0, 0, 105, 150) },
    { p: tube([[-90, -60], [-170, 40], [-150, 160]], 26, 20) },
    { p: tube([[90, -60], [180, -150], [210, -290]], 26, 20) },
    { p: E(0, -200, 62, 70) }, { p: [[-55, -250], [-40, -380], [0, -430], [40, -380], [55, -250]], sp: 7 },
    { p: E(0, -190, 42, 48), white: true, halo: 4 }, { p: E(-16, -200, 8, 5), flat: '#000' }, { p: E(16, -200, 8, 5), flat: '#000' }, { p: [[-12, -168], [12, -168], [0, -160]], flat: '#000' },
    { p: [[200, -300], [175, -420], [210, -360], [225, -460], [240, -360], [275, -420], [250, -300]], sp: 6 },   // vajra prongs
  ];
  K.indra = fig(ind.map(pt => ({ ...pt, p: xf(pt.p, 500, 760, 1.15) })), { reveal: { t0: 0, t1: .7, key: (x, y) => clamp(y / PH) } });
  K.indraRays = WC.rays(500, 530, { n: 64, r0: 120, r1: [380, 700], w: 16, seed: 14 });
  K.cloud4 = cloud(500, 1380, 1100, 1.5).map((p, i) => WC.cutAlong(p, { closed: true, w: 10, kind: 'u', seed: 60 + i }));
  K.serpent = WC.shape([tube([[1080, 260], [820, 300], [600, 520], [820, 760], [560, 980], [260, 900], [140, 1140], [380, 1320], [-80, 1420]], 30, 88)], { light: L, sp: 8, halo: 9, seed: 70, res: 3, dir: 'contour' });
  K.sHead = fig([{ p: E(1010, 250, 120, 78, -.12) }, { p: [[900, 236], [780, 150], [920, 200]] }, { p: [[900, 268], [790, 330], [930, 290]] }, { p: E(1010, 218, 14, 9), white: true, halo: 3 }]);
  K.rivers = [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const y = 120 + i * 165, P = []; for (let x = -40; x <= 1040; x += 40) P.push([x, y + Math.sin(x / 90 + i) * 18]); return WC.cutAlong(P, { w: 7, kind: 'v', seed: 80 + i, seg: [60, 150] }); }).flat();
  const bolt = [[1060, -40], [760, 120], [860, 150], [700, 210], [820, 220], [600, 250], [880, 190], [770, 175], [930, 100], [800, 110]];
  K.bolt = WC.shape([bolt], { light: L, sp: 6, halo: 10, white: true, seed: 90 });
  K.boltPoly = bolt;
  K.flash = WC.rays(640, 240, { n: 40, r0: 60, r1: [260, 620], w: 14, seed: 91 });
  K.falls = [...Array(14)].map((_, i) => { const x = 60 + i * 68, P = []; for (let y = -200; y <= 2100; y += 60) P.push([x + Math.sin(y / 110 + i * 1.7) * 14, y]); return WC.cutAlong(P, { w: 9, kind: 'u', seed: 100 + i, seg: [80, 200], reveal: { t0: 0, t1: 1.0, speed: 2200 } }); }).flat();

  // ===== III Durga
  const dem = [
    { p: E(500, 1280, 470, 330) },
    { p: tube([[300, 1300], [270, 1440]], 70, 60) }, { p: tube([[700, 1300], [730, 1440]], 70, 60) },
    { p: E(500, 860, 210, 190) },
    { p: tube([[340, 760], [140, 660], [60, 420], [150, 260]], 52, 18) }, { p: tube([[660, 760], [860, 660], [940, 420], [850, 260]], 52, 18) },
    { p: E(500, 1010, 110, 70), halo: 5 },
    { p: E(420, 830, 24, 14, .3), white: true, halo: 3 }, { p: E(580, 830, 24, 14, -.3), white: true, halo: 3 },
  ];
  K.demon = fig(dem, { res: 3, reveal: { t0: 0, t1: .9, key: (x, y) => clamp(1 - y / PH) } });
  K.demonRays = WC.rays(500, 700, { n: 70, r0: 240, r1: [700, 1100], w: 18, seed: 120 });
  K.beams = [...Array(18)].map((_, i) => { const a = i / 18 * Math.PI * 2, P = [[500 + Math.cos(a) * 1000, 640 + Math.sin(a) * 1000], [500 + Math.cos(a) * 60, 640 + Math.sin(a) * 60]]; return { P, S: WC.cutAlong(P, { w: 22, kind: 'u', seed: 130 + i, seg: [200, 400], gap: [0, 2], reveal: { t0: i * .06, t1: i * .06 + .9, speed: 1400 } }) }; });
  const dur = [
    { p: E(0, 0, 80, 120) }, { p: E(0, -165, 50, 55) }, { p: [[-42, -205], [-30, -300], [0, -330], [30, -300], [42, -205]], sp: 7 },
    { p: E(0, -158, 34, 40), white: true, halo: 4 }, { p: E(-13, -165, 7, 4), flat: '#000' }, { p: E(13, -165, 7, 4), flat: '#000' },
    { p: [[-80, 60], [80, 60], [140, 230], [-140, 230]] },
  ];
  K.durga = fig(dur.map(pt => ({ ...pt, p: xf(pt.p, 500, 640, 1.25) })));
  K.arms = [...Array(10)].map((_, i) => {
    const side = i < 5 ? -1 : 1, k = i % 5, ang = (-1.1 + k * .55), ox = 500 + side * 60, oy = 600;
    const ex = ox + side * Math.cos(ang) * 300, ey = oy + Math.sin(ang) * 300;
    const tip = [ex + side * Math.cos(ang) * 70, ey + Math.sin(ang) * 70];
    return { S: fig([{ p: tube([[ox, oy], [lerp(ox, ex, .5), lerp(oy, ey, .5) - 20], [ex, ey]], 20, 15) }, { p: [[ex - 8, ey - 8], [tip[0], tip[1]], [ex + 8, ey + 8]], sp: 6, halo: 5 }]), tip };
  });
  const lion = [
    { p: E(500, 1150, 330, 120) }, { p: tube([[260, 1180], [240, 1330]], 34, 28) }, { p: tube([[740, 1180], [760, 1330]], 34, 28) },
    { p: tube([[840, 1120], [960, 1020], [940, 920]], 16, 9) }, { p: E(190, 1060, 95, 85) },
    { p: E(150, 1050, 22, 14), white: true, halo: 3 },
  ];
  K.lion = fig(lion);
  K.mane = WC.rays(200, 1060, { n: 30, r0: 96, r1: [140, 190], w: 10, seed: 140 });
  K.durgaRays = WC.rays(500, 470, { n: 60, r0: 90, r1: [260, 520], w: 14, seed: 141 });
  K.horns = fig([{ p: tube([[120, 1250], [300, 1180], [420, 1240], [380, 1330]], 48, 12) }, { p: tube([[880, 1260], [700, 1190], [600, 1250], [640, 1330]], 48, 12) }]);
  K.trident = fig([{ p: tube([[500, 1340], [500, 520]], 12, 12) }, { p: [[420, 560], [440, 380], [470, 540], [500, 300], [530, 540], [560, 380], [580, 560]], sp: 6 }]);
  K.ground3 = WC.cutAlong([[-40, 1340], [1040, 1340]], { w: 14, kind: 'u', seed: 150 });

  // ===== II Vishnu
  K.vamana = fig([
    { p: tube([[-20, 60], [-30, 160]], 18, 15) }, { p: tube([[20, 60], [30, 160]], 18, 15) }, { p: E(0, 20, 52, 70) },
    { p: E(0, -75, 38, 40) }, { p: E(8, -70, 24, 26), white: true, halo: 3 }, { p: E(14, -76, 5, 4), flat: '#000' },
    { p: tube([[-40, -10], [-70, -160]], 7, 7) }, { p: [[-210, -150], [-70, -260], [70, -150]], sp: 6 },
  ].map(pt => ({ ...pt, p: xf(pt.p, 330, 1110, 1.5) })));
  K.king = fig([
    { p: tube([[-30, 120], [-40, 330]], 26, 22) }, { p: tube([[30, 120], [40, 330]], 26, 22) }, { p: [[-90, 40], [90, 40], [120, 260], [-120, 260]] },
    { p: E(0, 0, 80, 120) }, { p: E(0, -165, 50, 55) }, { p: [[-40, -205], [-30, -290], [0, -260], [30, -290], [40, -205]], sp: 7 },
    { p: E(-6, -158, 34, 40), white: true, halo: 4 }, { p: E(-18, -165, 7, 4), flat: '#000' },
    { p: tube([[-70, -40], [-150, 40], [-210, 0]], 20, 16) },
  ].map(pt => ({ ...pt, p: xf(pt.p, 720, 940, 1.3) })));
  K.ground2 = WC.cutAlong([[-40, 1360], [1040, 1360]], { w: 16, kind: 'u', seed: 160 });
  K.fire2 = WC.rays(520, 1330, { n: 18, r0: 10, r1: [50, 120], w: 10, a0: -Math.PI * .9, a1: -Math.PI * .1, seed: 161 });
  K.earth = WC.shape([E(500, 2700, 1450, 1450, 0, 140)], { light: WC.light(.3, -.9, .4), sp: 12, halo: 10, seed: 170, res: 6, dir: WC.dirRing(500, 2700, 1) });
  K.cosmos = WC.flecks(starPts(420, -1400, 2400, -2100, 1250, [4, 12], 171), { seed: 5 });
  K.giant = fig([
    { p: tube([[440, 520], [380, 900], [360, 1260]], 120, 80) },
    { p: tube([[560, 520], [900, 240], [1250, -250], [1500, -700]], 120, 80) },
    { p: E(500, 200, 300, 420) },
    { p: tube([[300, -40], [40, 80], [-180, -40]], 70, 55) }, { p: tube([[300, 60], [60, 320], [-120, 420]], 70, 55) },
    { p: tube([[700, -40], [960, -260], [1040, -560]], 70, 55) }, { p: tube([[700, 60], [960, 160], [1180, 80]], 70, 55) },
    { p: E(500, -330, 160, 180) }, { p: [[380, -440], [420, -780], [500, -880], [580, -780], [620, -440]], sp: 12 },
    { p: E(500, -310, 110, 130), white: true, halo: 6 }, { p: E(460, -330, 18, 10), flat: '#000' }, { p: E(540, -330, 18, 10), flat: '#000' },
    { p: E(-260, -60, 90, 90), halo: 10 },
  ], { sp: 14, halo: 12, res: 4 });
  K.discRing = WC.cutAlong(E(-260, -60, 60, 60, 0, 40), { closed: true, w: 18, kind: 'u', seed: 172 });
  K.steps = [[360, 1250, 1], [1500, -760, 1.1], [1350, -1750, 1.2]];
  K.stepCuts = K.steps.map(([x, y, s], i) => WC.shape([E(x, y, 90 * s, 50 * s, -.4)], { light: L, sp: 8, halo: 10, white: true, seed: 180 + i }));

  // ===== I Shiva
  K.shiva = fig([
    { p: [[120, 1440], [180, 1060], [340, 940], [660, 940], [820, 1060], [880, 1440]], sp: 10 },
    { p: tube([[440, 860], [440, 980]], 70, 80) },
    { p: [[330, 560], [360, 140], [440, 40], [560, 40], [640, 140], [670, 560], [620, 420], [380, 420]], sp: 7 },
    { p: E(500, 640, 175, 235), white: true, halo: 8, sp: 7 },
    { p: [[355, 580], [460, 560], [455, 575], [360, 600]], flat: '#000' }, { p: [[645, 580], [540, 560], [545, 575], [640, 600]], flat: '#000' },
    { p: E(410, 640, 44, 14), flat: '#000' }, { p: E(590, 640, 44, 14), flat: '#000' },
    { p: [[490, 650], [480, 740], [520, 740], [510, 650]], flat: '#000' },
    { p: [[430, 790], [500, 805], [570, 790], [500, 820]], flat: '#000' },
    { p: tube([[300, 990], [420, 1060], [580, 1060], [700, 990], [760, 880], [720, 830]], 28, 16) },
  ], { reveal: { t0: 0, t1: .8, key: (x, y) => clamp(y / PH) } });
  K.moon = WC.shape([[...E(620, 170, 80, 80, 0, 40).filter((_, i) => i < 21), ...E(650, 150, 64, 64, 0, 40).filter((_, i) => i < 21).reverse()]], { light: L, sp: 6, halo: 5, white: true, seed: 190 });
  K.jataCuts = [...Array(12)].map((_, i) => WC.cutAlong([[380 + i * 20, 400], [400 + i * 18, 200], [450 + i * 10, 70]], { w: 4, kind: 'v', seed: 200 + i }));
  K.trishul = fig([{ p: tube([[880, 1440], [880, 420]], 13, 13) }, { p: [[800, 460], [815, 260], [850, 440], [880, 190], [910, 440], [945, 260], [960, 460]], sp: 6 }]);
  K.eyeShape = [[500, 470], [520, 500], [500, 530], [480, 500]];
  K.eyeRays = WC.rays(500, 500, { n: 90, r0: 40, r1: [700, 1300], w: 20, seed: 210, reveal: { t0: .4, t1: 2.2, jit: .4 } });
  K.ash = WC.flecks(starPts(160, 0, 1000, 0, 1440, [3, 7], 211), { seed: 6 });
  // the dance
  K.ring = WC.cutAlong(E(500, 720, 430, 430, 0, 120), { closed: true, w: 26, kind: 'u', seed: 220 });
  K.flames = (k) => { const o = []; const q = mulberry(230 + k); for (let i = 0; i < 44; i++) { const a = i / 44 * Math.PI * 2, r0 = 450, l = 50 + q() * 70; o.push(WC.cutAlong([[500 + Math.cos(a) * r0, 720 + Math.sin(a) * r0], [500 + Math.cos(a + .06) * (r0 + l * .6), 720 + Math.sin(a + .06) * (r0 + l * .6)], [500 + Math.cos(a) * (r0 + l), 720 + Math.sin(a) * (r0 + l)]], { w: 14, kind: 'u', seed: 240 + i + k * 50 })); } return o.flat(); };
  K.flameSets = [0, 1, 2, 3].map(K.flames);
  K.nataraja = fig([
    { p: tube([[480, 820], [440, 1000], [460, 1160]], 34, 24) },
    { p: tube([[520, 820], [680, 880], [600, 1000], [700, 1060]], 34, 24) },
    { p: E(500, 700, 80, 130) },
    { p: tube([[440, 620], [320, 600], [220, 520]], 22, 17) }, { p: tube([[440, 650], [330, 720], [260, 820]], 22, 17) },
    { p: tube([[560, 620], [680, 600], [780, 520]], 22, 17) }, { p: tube([[560, 650], [660, 700], [720, 640]], 22, 17) },
    { p: E(500, 530, 52, 58) }, { p: E(500, 540, 36, 42), white: true, halo: 4 }, { p: E(487, 535, 6, 4), flat: '#000' }, { p: E(513, 535, 6, 4), flat: '#000' },
    { p: tube([[460, 480], [320, 420], [200, 440]], 8, 4) }, { p: tube([[540, 480], [680, 420], [800, 440]], 8, 4) },
    { p: E(500, 1180, 140, 26) },
  ]);

  // ===== outro: five prints
  K.cards = [['V', 'HANUMAN'], ['IV', 'INDRA'], ['III', 'DURGA'], ['II', 'VISHNU'], ['I', 'SHIVA']].map(([n, name], i) => ({ n, name, a: (i - 2) * .07, x: 500 + (i - 2) * 186, y: 720 + Math.abs(i - 2) * 22 }));
}

// ---------- scenes: each draws on the mask (inside begin/end) ----------
function intro(t) {
  begin({}, true);
  WC.drawStrokes(m, K.introRays, { t });
  K.introEye.draw(m, t);
  carveText('WHO IS THE', 500, 230, 110, { clip: seg(t, .2, 1.0) });
  carveText('STRONGEST?', 500, 360, 120, { clip: seg(t, .6, 1.6) });
  carveText('FIVE GODS', 500, 1000, 130, { clip: seg(t, 2.45, 3.4) });
  K.introFlames.forEach(f => WC.drawStrokes(m, f, { t }));
  end();
}
function card(n, name, mirror) {
  begin({}, mirror);
  WC.drawStrokes(m, K.frame, { t: 99 });
  carveText(n, 500, 620, 520);
  carveText(name, 500, 1080, 120);
  end();
}
function scene5(t, tl) {                               // tl = local time
  if (t < 14.44) {
    const z = lerp(1, 1.18, ss(seg(t, 7.7, 14.44)));
    begin({ x: 480, y: 700, z });
    WC.drawStrokes(m, K.stars5, { t: 99 });
    K.himal.draw(m, 99);
    if (t > 9.69) { WC.drawStrokes(m, K.herb, { t: 99 }); plateDisc(700, 968, 30 * ss(seg(t, 9.69, 10.4)) + 4); }
    drawFig(K.hanFly, tl);
    end();
  } else {
    const u = seg(t, 14.44, 15.8), lift = 520 * (1 - eo(u)), y = lerp(980, 640, ss(seg(t, 14.44, 17.2)));
    begin({ x: 500, y });
    K.cloud5.forEach(cl => WC.drawStrokes(m, cl, { t: 99 }));
    m.save(); c.save(); m.translate(0, lift); c.translate(0, lift);
    K.mount.draw(m, 99); WC.drawStrokes(m, K.mountHerb, { t: 99 }); plateDisc(500, 300, 34);
    m.restore(); c.restore();
    if (u < 1) { m.save(); m.translate(0, lift + 560 + (t - 14.44) * 300); WC.drawStrokes(m, K.chips, { t: 99 }); m.restore(); }
    drawFig(K.hanLift, 99);
    end();
  }
}
function scene4(t, tl) {
  if (t < 21.87) {
    begin({ z: lerp(1, 1.08, ss(seg(t, 19.9, 21.87))), y: 700 });
    WC.drawStrokes(m, K.indraRays, { t: 99 }); K.cloud4.forEach(cl => WC.drawStrokes(m, cl, { t: 99 }));
    drawFig(K.indra, tl); plateDisc(725, 245, 26);
    end(); return;
  }
  if (t < 28.39) {
    const snap = t >= 25.08 ? lerp(1, 1.7, eo(seg(t, 25.08, 25.26))) : 1, cx = t >= 25.08 ? lerp(500, 860, eo(seg(t, 25.08, 25.26))) : lerp(520, 480, seg(t, 21.87, 25.08));
    begin({ x: cx, y: t >= 25.08 ? lerp(720, 300, eo(seg(t, 25.08, 25.26))) : 720, z: snap });
    WC.drawStrokes(m, K.rivers, { t: 99 });
    if (t >= 25.08) { WC.drawStrokes(m, K.flash, { t: 99 }); }
    K.serpent.draw(m, 99); drawFig(K.sHead, 99);
    if (t >= 25.08) { K.bolt.draw(m, 99); WC.plate(c, [K.boltPoly], 1); }
    end(); return;
  }
  const y = lerp(700, 1000, ss(seg(t, 28.39, 29.59)));
  begin({ y });
  WC.drawStrokes(m, K.falls, { t: t - 28.39 });
  end();
}
function scene3(t, tl) {
  if (t < 36.79) {
    begin({ y: lerp(860, 760, ss(seg(t, 32.2, 36.79))), z: lerp(1.05, 1.12, seg(t, 32.2, 36.79)) });
    WC.drawStrokes(m, K.demonRays, { t: 99 });
    drawFig(K.demon, tl);
    end(); return;
  }
  if (t < 40.14) {
    const u = t - 36.79;
    begin({ y: 680, z: lerp(1, 1.1, seg(t, 36.79, 40.14)) });
    for (const bm of K.beams) { WC.drawStrokes(m, bm.S, { t: u }); const k = clamp((u - .3) / 1.6); if (k > 0) plateStroke([bm.P[0], [lerp(bm.P[0][0], bm.P[1][0], k), lerp(bm.P[0][1], bm.P[1][1], k)]], 18); }
    if (u > 2.2) plateDisc(500, 640, 140 * eo(seg(u, 2.2, 3.3)));
    end(); return;
  }
  if (t < 43.39) {
    begin({ y: 760, z: lerp(.98, 1.04, seg(t, 40.14, 43.39)) });
    WC.drawStrokes(m, K.durgaRays, { t: 99 });
    WC.drawStrokes(m, K.mane, { t: 99 }); drawFig(K.lion, 99);
    K.arms.forEach((ar, i) => { if (t >= 40.14 + i * .27) { drawFig(ar.S, 99); plateDisc(ar.tip[0], ar.tip[1], 16); } });
    drawFig(K.durga, 99);
    end(); return;
  }
  begin({ y: 900 });
  WC.drawStrokes(m, K.ground3, { t: 99 });
  drawFig(K.horns, 99); drawFig(K.trident, 99);
  WC.plate(c, [[[420, 560], [440, 380], [470, 540], [500, 300], [530, 540], [560, 380], [580, 560]]], 1);
  end();
}
function scene2(t, tl) {
  if (t < 52.63) {
    begin({ y: 900, z: lerp(1, 1.06, seg(t, 47.7, 52.63)) });
    WC.drawStrokes(m, K.ground2, { t: 99 }); WC.drawStrokes(m, K.stars5, { t: 99 });
    WC.drawStrokes(m, K.fire2, { t: 99 });
    drawFig(K.king, tl); drawFig(K.vamana, tl);
    end(); return;
  }
  const u = ss(seg(t, 52.63, 56.0));
  begin({ x: lerp(380, 700, u), y: lerp(1120, -280, u), z: lerp(1.1, .4, u) });
  WC.drawStrokes(m, K.cosmos, { t: 99 });
  K.earth.draw(m, 99);
  drawFig(K.giant, 99); WC.drawStrokes(m, K.discRing, { t: 99 });
  [56.05, 56.93, 57.55].forEach((ts, i) => { if (t >= ts) { K.stepCuts[i].draw(m, 99); const [x, y, s] = K.steps[i]; WC.plate(c, [E(x, y, 90 * s, 50 * s, -.4)], 1); } });
  end();
}
function scene1(t, tl) {
  if (t < 66.71) {
    begin({ y: 700, z: lerp(1, 1.06, seg(t, 61.8, 66.71)) });
    const open = seg(t, 62.11, 62.4);
    if (t > 62.11) WC.drawStrokes(m, K.eyeRays, { t: t - 62.11 + .4 });
    drawFig(K.shiva, tl);
    K.jataCuts.forEach(j => WC.drawStrokes(m, j, { t: 99 }));
    K.moon.draw(m, 99); drawFig(K.trishul, 99);
    if (open > 0) {
      WC.fillPoly(m, [K.eyeShape.map(([x, y]) => [x, 500 + (y - 500) * open])], '#fff');
      WC.fillPoly(m, [E(500, 500, 8, 12 * open)], '#000');
      const r = 2000 * ei(seg(t, 62.4, 64.8)) + 30;
      plateDisc(500, 500, r, 1);
    }
    if (t > 64.2) { m.save(); m.translate(0, -(t - 64.2) * 70); WC.drawStrokes(m, K.ash, { t: 99 }); m.restore(); }
    end(); return;
  }
  begin({ y: 760, z: lerp(1.3, .95, ss(seg(t, 66.71, 70.2))) });
  const k = Math.floor(t * 12) % 4;                     // fire boils on twos
  WC.drawStrokes(m, K.ring, { t: 99 }); WC.drawStrokes(m, K.flameSets[k], { t: 99 });
  c.save(); c.strokeStyle = '#000'; c.lineWidth = 170; c.beginPath(); c.arc(500, 720, 480, 0, Math.PI * 2); c.stroke(); c.restore();
  drawFig(K.nataraja, 99);
  end();
}
function outro(t) {
  begin({ y: 760, z: lerp(1.06, .97, ss(seg(t, 70.45, 77.9))) });
  K.cards.forEach((cd, i) => {
    for (const g of [m, c]) { g.save(); g.translate(cd.x, cd.y); g.rotate(cd.a); }
    m.fillStyle = '#fff'; m.fillRect(-82, -150, 164, 300);
    m.font = '400 112px "IM Fell English SC"'; m.textAlign = 'center'; m.textBaseline = 'middle'; m.fillStyle = '#000'; m.fillText(cd.n, 0, -30);
    m.font = '400 26px "IM Fell English SC"'; m.fillText(cd.name, 0, 70);
    if (t >= 70.45 + i * .5) { c.fillStyle = '#000'; c.fillRect(-50, 108, 100, 12); }
    m.restore(); c.restore();
  });
  if (t >= 76.8) carveText('YOUR NUMBER ONE?', 500, 1150, 92, { clip: seg(t, 76.8, 77.5) });
  end();
}

// ---------- timeline ----------
const RANKS = [
  { t0: 5.65, n: 'V', name: 'HANUMAN', t1: 7.7 }, { t0: 17.43, n: 'IV', name: 'INDRA', t1: 19.9 },
  { t0: 29.59, n: 'III', name: 'DURGA', t1: 32.2 }, { t0: 44.23, n: 'II', name: 'VISHNU', t1: 47.7 },
  { t0: 58.81, n: 'I', name: 'SHIVA', t1: 61.8 },
];
export const EV = [];
export function init() {
  PR = WC.makePrinter(W, H);
  build();
  K.frame = WC.cutAlong(WC.rect(80, 80, 840, 1280), { closed: true, w: 12, kind: 'u', seed: 7 });
  // sound events (the mixer reads events.json)
  const ev = (t, type, o = {}) => EV.push({ t, type, ...o });
  ev(0, 'carve', { d: 1.6 }); ev(2.45, 'carve', { d: 1.4 }); ev(4.75, 'peel');
  for (const r of RANKS) { ev(r.t0, 'impression'); ev(r.t0 + .02, 'carve', { d: .55 }); ev(r.t0 + .6, 'peel'); ev(r.t1, 'impression'); }
  ev(14.44, 'rumble', { d: 2.4 }); ev(14.44, 'impression');
  ev(21.87, 'impression'); ev(21.87, 'water', { d: 2.7 }); ev(25.08, 'thunder'); ev(28.39, 'impression'); ev(28.39, 'water', { d: 1.4, v: 1.4 });
  ev(36.79, 'impression'); ev(36.79, 'swell', { d: 3.3 }); ev(40.14, 'impression');
  for (let i = 0; i < 10; i++) ev(40.14 + i * .27, 'ring', { i });
  ev(41.0, 'growl'); ev(43.39, 'impression'); ev(43.39, 'fall');
  ev(52.63, 'swell', { d: 3.4 }); [56.05, 56.93, 57.55].forEach(t => ev(t, 'stride'));
  ev(58.15, 'silence', { d: .66 });
  ev(62.11, 'eye'); ev(62.4, 'fire', { d: 4.3 }); ev(66.71, 'impression'); ev(66.71, 'fire', { d: 3.74, v: 1.3 });
  ev(70.45, 'impression'); for (let i = 0; i < 5; i++) ev(70.45 + i * .5, 'sheet'); ev(76.8, 'carve', { d: .7 });
  EV.sort((x, y) => x.t - y.t);
}

function frameTo(g, fn, t, o) { fn(); caption(t); print(g, t, o); }
export function render(g, t) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  // intro: the mirrored block, then the sheet peels to the true print
  if (t < 5.65) {
    if (t < 4.75) return frameTo(g, () => intro(t), t, { mode: 'block' });
    const u = seg(t, 4.75, 5.45);
    frameTo(b, () => { intro(99); }, t, { mode: 'block' });
    frameTo(a, () => { intro(99); }, t, {});
    if (u < 1) { g.drawImage(B, 0, 0); const s = peelState(u, 160); curl(g, A, A, s.xf, s.r); } else frameTo(g, () => {
      begin(); WC.drawStrokes(m, K.introRays, { t: 99 }); K.introEye.draw(m, 99); carveText('WHO IS THE', 500, 230, 110); carveText('STRONGEST?', 500, 360, 120); carveText('FIVE GODS', 500, 1000, 130); K.introFlames.forEach(f => WC.drawStrokes(m, f, { t: 99 })); plateDisc(500, 640, 70); end();
    }, t, {});
    return;
  }
  // silence: the uncut block
  if (t >= 58.15 && t < 58.81) { begin(); end(); return print(g, t, { mode: 'block' }); }
  const rk = RANKS.find(r => t >= r.t0 && t < r.t1);
  if (rk) {
    const u = t - rk.t0;
    const blockCard = () => { card(rk.n, rk.name, true); m.save(); m.setTransform(1, 0, 0, 1, 0, 0); const cl = seg(u, 0, .55); m.fillStyle = '#000'; m.fillRect(IMG.x + IMG.w * cl, IMG.y, IMG.w * (1 - cl) + 1, IMG.h); m.restore(); };
    if (u < .6) return frameTo(g, blockCard, t, { mode: 'block' });
    const trueCard = () => { card(rk.n, rk.name, false); };
    if (u < 1.35) { frameTo(b, trueCard, t, {}); frameTo(a, blockCard, t, { mode: 'block' }); g.drawImage(B, 0, 0); const s = peelState(seg(u, .6, 1.35), 150); curl(g, A, A, s.xf, s.r); return; }
    return frameTo(g, trueCard, t, {});
  }
  if (t < 17.43) return frameTo(g, () => scene5(t, t - 7.7), t, { imp: t < 14.44 ? 0 : 1 });
  if (t < 29.59) return frameTo(g, () => scene4(t, t - 19.9), t, {});
  if (t < 44.23) return frameTo(g, () => scene3(t, t - 32.2), t, {});
  if (t < 58.15) return frameTo(g, () => scene2(t, t - 47.7), t, {});
  if (t < 70.45) return frameTo(g, () => scene1(t, t - 61.8), t, {});
  return frameTo(g, () => outro(t), t, {});
}
