/* The Hindu cast for the Norse painter: same round heads, dot eyes and thick outline, told apart by
   skin, robe, crown and what they hold. Hooks override the engine's per-kind painters and fall back to the originals. */
Object.assign(KINDS, {
  HN: { robe: '#e8762a', trim: '#ffd34d', skin: '#f7d9a8', beard: '#fff0d6', crown: 'monkey', prop: 'gada', tail: 1, sash: 1, garland: 1 },
  IN: { robe: '#2f6fd6', trim: '#ffd34d', skin: '#fff', crown: 'mukut', prop: 'vajra', sash: 1, jewel: '#ff4d6d' },
  DG: { robe: '#d8283a', trim: '#ffd34d', skin: '#fff', top: '#2a1630', hair: '#2a1630', locks: 1, crown: 'mukut', prop: 'trishul', bindi: 1, lash: 1, arms10: 1, sash: 1, jewel: '#4fd66a' },
  VN: { robe: '#f2c53d', trim: '#e8762a', skin: '#8fbcf2', crown: 'kirita', prop: 'lotus', arms4: 1, garland: 1, jewel: '#4fd66a' },
  SV: { robe: '#e09a3a', trim: '#7a4a12', skin: '#a9d0f5', crown: 'jata', prop: 'trishul', tiger: 1, snake: 1, eye3: 1 },
  VM: { robe: '#f2a03a', trim: '#c9622a', skin: '#8fbcf2', crown: 'tuft', prop: 'chhatra', sash: 1 },
  BL: { robe: '#7a3fa8', trim: '#ffd34d', skin: '#fff', beard: '#3a2a3a', crown: 'mukut', prop: '', sash: 1, jewel: '#ffd34d' },
  LK: { robe: '#3f8a4c', trim: '#ffd34d', skin: '#fff', crown: 'mukut', prop: 'bow' },
  KM: { robe: '#ff7fae', trim: '#ffd34d', skin: '#fff', crown: 'flower', prop: 'bow', blush: 1 },
});
const GODCOL = { HN: '#ff8a2b', IN: '#4f9dff', DG: '#ff3b5c', VN: '#ffd34d', SV: '#7fe0ff' };

function drawCape(g, K, t, ph) {
  if (!K.tail) return ORIG.drawCape(g, K, t, ph);
  const w = Math.sin(t * 3 + ph) * 8;                    // Hanuman's tail, behind the body, curling at the tip
  g.lineCap = 'round'; g.strokeStyle = OL; g.lineWidth = 22; g.beginPath(); g.moveTo(160, 268); g.bezierCurveTo(232, 262, 238 + w, 170, 210 + w, 120); g.stroke();
  g.strokeStyle = K.skin; g.lineWidth = 12; g.stroke();
  g.fillStyle = K.skin; g.strokeStyle = OL; g.lineWidth = 5; g.beginPath(); g.arc(206 + w, 112, 13, 0, 7); g.fill(); g.stroke();
}
function drawRobeN(g, c, K, t) {
  ORIG.drawRobeN(g, c, K, t);
  if (K.tiger) { g.fillStyle = '#3a2410'; for (let i = 0; i < 7; i++) { const x = 88 + i * 14, y = 214 + (i % 2) * 22; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 8, y + 10, x + 2, y + 24); g.quadraticCurveTo(x + 4, y + 10, x - 4, y + 2); g.closePath(); g.fill() } }
  if (K.arms10 || K.robe === '#d8283a') { g.strokeStyle = '#ffd34d'; g.lineWidth = 5; for (let x = 104; x < 160; x += 14) { g.beginPath(); g.moveTo(x, 252); g.lineTo(x - 2, 284); g.stroke() } }
}
function drawCollarN(g, c, K, t) {
  ORIG.drawCollarN(g, c, K, t);
  g.strokeStyle = OL;
  if (K.garland) [[92, 198], [104, 210], [118, 218], [128, 220], [138, 218], [152, 210], [164, 198]].forEach(([x, y], i) => { g.fillStyle = i % 2 ? '#ff9f1c' : '#ffd34d'; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); g.stroke() });
  if (K.jewel) { g.fillStyle = '#ffd34d'; g.lineWidth = 4; g.beginPath(); g.moveTo(100, 190); g.quadraticCurveTo(128, 222, 156, 190); g.lineTo(150, 188); g.quadraticCurveTo(128, 210, 106, 188); g.closePath(); g.fill(); g.stroke(); g.fillStyle = K.jewel; g.beginPath(); g.arc(128, 208, 7, 0, 7); g.fill(); g.stroke() }
  if (K.snake) {                                       // the serpent Vasuki around Shiva's neck
    g.lineCap = 'round'; g.lineWidth = 15; g.strokeStyle = OL; g.beginPath(); g.moveTo(86, 196); g.quadraticCurveTo(128, 228, 170, 196); g.quadraticCurveTo(178, 180, 168, 170); g.stroke();
    g.lineWidth = 8; g.strokeStyle = '#4fae5a'; g.stroke();
    g.fillStyle = '#4fae5a'; g.lineWidth = 4; g.strokeStyle = OL; g.beginPath(); g.ellipse(166, 162, 11, 9, -.4, 0, 7); g.fill(); g.stroke(); g.fillStyle = OL; g.beginPath(); g.arc(169, 159, 2.2, 0, 7); g.fill();
    ln(g, 172, 166, 182, 170 + Math.sin(t * 12) * 3, 2, '#e0261c'); g.strokeStyle = OL;
  }
}
// extra arms go here: after the robe, before the head
function drawBackHeadN(g, c, K, t) {
  ORIG.drawBackHeadN(g, c, K, t);
  const arm = (sx, sy, hx, hy, w) => { ln(g, sx, sy, hx, hy, 17, OL); ln(g, sx, sy, hx, hy, 10, K.robe); g.fillStyle = K.skin; g.strokeStyle = OL; g.lineWidth = 4; g.beginPath(); g.arc(hx, hy, 10, 0, 7); g.fill(); g.stroke(); if (w) w(hx, hy) };
  const wp = (type) => (x, y) => {
    g.save(); g.translate(x, y); g.strokeStyle = OL; g.lineWidth = 3;
    if (type === 'sword') { g.rotate(-.6); g.fillStyle = '#dfe4ee'; g.beginPath(); g.moveTo(-3, -6); g.lineTo(-3, -34); g.lineTo(0, -40); g.lineTo(3, -34); g.lineTo(3, -6); g.closePath(); g.fill(); g.stroke() }
    else if (type === 'disc') { g.rotate(t * 6); g.fillStyle = '#ffd34d'; g.beginPath(); g.arc(0, -16, 12, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#ff8a2b'; g.beginPath(); g.arc(0, -16, 4, 0, 7); g.fill() }
    else if (type === 'conch') { g.fillStyle = '#fff7ec'; g.beginPath(); g.ellipse(0, -14, 9, 14, .4, 0, 7); g.fill(); g.stroke(); ln(g, -4, -20, 4, -8, 2, '#d8b48a') }
    else if (type === 'bow') { g.lineWidth = 5; g.beginPath(); g.arc(-4, -14, 16, -1.2, 1.2); g.stroke(); g.strokeStyle = '#ffd34d'; g.lineWidth = 2.5; g.stroke() }
    else if (type === 'lotus') { g.fillStyle = '#ff8fb8'; [-1, 0, 1].forEach(d => { g.beginPath(); g.ellipse(d * 7, -14, 6, 12, d * .5, 0, 7); g.fill(); g.stroke() }) }
    else if (type === 'bell') { g.fillStyle = '#ffd34d'; g.beginPath(); g.moveTo(-9, -6); g.quadraticCurveTo(-9, -26, 0, -26); g.quadraticCurveTo(9, -26, 9, -6); g.closePath(); g.fill(); g.stroke() }
    else if (type === 'shield') { g.fillStyle = '#c9a23a'; g.beginPath(); g.arc(0, -10, 13, 0, 7); g.fill(); g.stroke() }
    else if (type === 'axe') { ln(g, 0, 4, 0, -30, 4, OL); g.fillStyle = '#dfe4ee'; g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(16, -26, 14, -14); g.lineTo(0, -18); g.closePath(); g.fill(); g.stroke() }
    g.restore(); g.strokeStyle = OL;
  };
  if (K.arms10) {
    const n = c.armsN === undefined ? 8 : c.armsN, L = [[38, 116, 'sword'], [26, 168, 'disc'], [34, 222, 'bow'], [58, 262, 'bell']], Rr = [[218, 116, 'conch'], [230, 168, 'lotus'], [222, 222, 'shield'], [198, 262, 'axe']];
    const fan = Math.sin(t * 4) * 3;
    for (let i = 0; i < Math.min(n, 8); i++) { const q = i % 2 ? Rr[i >> 1] : L[i >> 1], sx = i % 2 ? 160 : 96; arm(sx, 202, q[0] + (i % 2 ? fan : -fan), q[1], wp(q[2])) }
  }
  if (K.arms4) { arm(96, 202, 44, 150 + Math.sin(t * 3) * 3, wp('disc')); arm(160, 202, 212, 150 - Math.sin(t * 3) * 3, wp('conch')) }
  if (K.crown === 'monkey') { g.fillStyle = K.skin; g.strokeStyle = OL; g.lineWidth = 6;[[62, 132], [194, 132]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 19, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#e8b27a'; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); g.fillStyle = K.skin }) }
}
function drawFaceN(g, c, K, t, face) {
  ORIG.drawFaceN(g, c, K, t, face);
  if (K.bindi) { g.fillStyle = '#e0261c'; g.beginPath(); g.arc(128, 98, 5.5, 0, 7); g.fill() }
  if (K.crown === 'mukut' || K.crown === 'kirita') { g.fillStyle = '#e0261c'; g.beginPath(); g.ellipse(128, 100, 3, 7, 0, 0, 7); g.fill() }
  if (K.eye3) {                                        // tripundra lines and the third eye
    g.strokeStyle = '#fff'; g.lineWidth = 3.5;[90, 96, 102].forEach(y => { g.beginPath(); g.moveTo(98, y); g.quadraticCurveTo(128, y - 4, 158, y); g.stroke() });
    const op = c.eye3 || 0; g.strokeStyle = OL; g.lineWidth = 3;
    if (op > 0) { g.save(); g.shadowColor = '#ff7a2b'; g.shadowBlur = 30 * op; g.fillStyle = '#fff3c8'; g.beginPath(); g.ellipse(128, 96, 6, 12 * op, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#ff5a1c'; g.beginPath(); g.arc(128, 96, 4 * op, 0, 7); g.fill(); g.restore() }
    else { g.beginPath(); g.moveTo(128, 86); g.lineTo(128, 106); g.stroke() }
  }
  g.strokeStyle = OL; g.fillStyle = OL;
}
function drawCrownN(g, cr, K, t, c) {
  g.strokeStyle = OL;
  if (cr === 'mukut' || cr === 'kirita' || cr === 'monkey') {
    const tall = cr === 'kirita' ? 1.5 : 1, top = 66 - 52 * tall;
    g.fillStyle = '#ffd34d'; g.lineWidth = 6; g.beginPath(); g.moveTo(80, 84); g.lineTo(86, top + 24); g.quadraticCurveTo(128, top - 8, 170, top + 24); g.lineTo(176, 84); g.quadraticCurveTo(128, 70, 80, 84); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#e8b830'; g.lineWidth = 5; g.beginPath(); g.ellipse(128, 82, 50, 11, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.ellipse(104, top + 34, 7, 16, -.3, 0, 7); g.fill();
    [[104, top + 40, '#e0261c'], [128, top + 22, K.jewel || '#4fd66a'], [152, top + 40, '#e0261c']].forEach(([x, y, col]) => { g.fillStyle = col; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 6.5, 0, 7); g.fill(); g.stroke() });
    g.fillStyle = '#ffd34d'; g.lineWidth = 4; g.beginPath(); g.moveTo(120, top + 4); g.lineTo(128, top - 18); g.lineTo(136, top + 4); g.closePath(); g.fill(); g.stroke();
    if (cr === 'kirita') { g.save(); g.globalAlpha = .7 + .3 * Math.sin(t * 4); g.shadowColor = '#fff3a0'; g.shadowBlur = 16; g.fillStyle = '#fff6c8'; g.beginPath(); g.arc(128, top - 22, 6, 0, 7); g.fill(); g.restore() }
    return;
  }
  if (cr === 'jata') {                                 // Shiva's matted bun, crescent moon, and Ganga's spray
    g.fillStyle = '#3a2a4a'; g.lineWidth = 6; g.beginPath(); g.moveTo(84, 82); g.quadraticCurveTo(82, 40, 104, 30); g.quadraticCurveTo(100, 4, 128, 2); g.quadraticCurveTo(156, 4, 152, 30); g.quadraticCurveTo(174, 40, 172, 82); g.quadraticCurveTo(128, 64, 84, 82); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 3;[104, 118, 132, 146].forEach(x => { g.beginPath(); g.moveTo(x, 70); g.quadraticCurveTo(x + 4, 40, x - 2, 14); g.stroke() });
    g.strokeStyle = OL; g.fillStyle = '#fff7d6'; g.lineWidth = 4; g.beginPath(); g.arc(150, 30, 15, -1.3, 1.9); g.arc(146, 28, 11, 1.9, -1.3, true); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = 'rgba(160,220,255,.9)'; for (let i = 0; i < 4; i++) { const u = (t * 1.4 + i / 4) % 1; g.beginPath(); g.arc(112 - u * 26, 10 + u * 30, 4 * (1 - u) + 1.5, 0, 7); g.fill() }
    return;
  }
  if (cr === 'tuft') { g.fillStyle = '#2a1630'; g.lineWidth = 5; g.beginPath(); g.arc(128, 64, 13, 0, 7); g.fill(); g.stroke(); return }
  ORIG.drawCrownN(g, cr, K, t, c);
}
function drawPropN(g, type, x, y, t, K) {
  const P = () => { g.save(); g.translate(x, y); g.strokeStyle = OL; g.lineJoin = g.lineCap = 'round' };
  if (type === 'gada') { P(); g.rotate(.25); ln(g, 0, 40, 0, -40, 11, OL); ln(g, 0, 40, 0, -40, 6, '#c9a23a');
    g.fillStyle = '#ffd34d'; g.lineWidth = 5; g.beginPath(); g.arc(0, -66, 30, 0, 7); g.fill(); g.stroke(); g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.ellipse(-10, -76, 9, 6, -.6, 0, 7); g.fill();
    g.strokeStyle = '#c98f2a'; g.lineWidth = 3;[-.6, 0, .6].forEach(a => { g.beginPath(); g.ellipse(0, -66, 30 * Math.abs(Math.cos(a)) + 2, 30, 0, 0, 7); g.stroke() });
    g.fillStyle = '#ffd34d'; g.strokeStyle = OL; g.lineWidth = 4; g.beginPath(); g.moveTo(-7, -94); g.lineTo(0, -108); g.lineTo(7, -94); g.closePath(); g.fill(); g.stroke(); g.restore(); return true }
  if (type === 'vajra') { P(); g.rotate(.1); g.shadowColor = '#fff3a0'; g.shadowBlur = 16 + 8 * Math.sin(t * 9);
    ln(g, 0, 28, 0, -28, 12, OL); ln(g, 0, 28, 0, -28, 7, '#ffd34d'); g.fillStyle = '#ffd34d'; g.lineWidth = 4;
    [-1, 1].forEach(s => { g.beginPath(); g.moveTo(0, s * 26); g.quadraticCurveTo(-22, s * 40, -10, s * 62); g.lineTo(0, s * 50); g.lineTo(10, s * 62); g.quadraticCurveTo(22, s * 40, 0, s * 26); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-3, s * 50); g.lineTo(0, s * 76); g.lineTo(3, s * 50); g.closePath(); g.fill(); g.stroke() });
    g.shadowBlur = 0; g.beginPath(); g.arc(0, 0, 10, 0, 7); g.fillStyle = '#4f9dff'; g.fill(); g.stroke(); g.restore(); return true }
  if (type === 'trishul') { P(); g.rotate(.08); ln(g, 0, 70, 0, -86, 9, OL); ln(g, 0, 70, 0, -86, 5, '#d8dde8');
    g.fillStyle = '#e8ecf4'; g.lineWidth = 4; g.beginPath(); g.moveTo(-26, -78); g.quadraticCurveTo(-30, -104, -20, -120); g.quadraticCurveTo(-18, -100, -8, -88); g.lineTo(-5, -96); g.lineTo(0, -132); g.lineTo(5, -96); g.lineTo(8, -88); g.quadraticCurveTo(18, -100, 20, -120); g.quadraticCurveTo(30, -104, 26, -78); g.quadraticCurveTo(0, -70, -26, -78); g.closePath(); g.fill(); g.stroke();
    if (K && K.eye3) { g.fillStyle = '#c98f2a'; g.beginPath(); g.moveTo(-14, -52); g.lineTo(14, -52); g.lineTo(-14, -30); g.lineTo(14, -30); g.closePath(); g.fill(); g.stroke(); ln(g, 0, -41, 18 + Math.sin(t * 20) * 6, -36, 2, OL) }
    g.restore(); return true }
  if (type === 'lotus') { P(); g.fillStyle = '#ff8fb8'; g.lineWidth = 4;[-2, -1, 0, 1, 2].forEach(d => { g.save(); g.rotate(d * .38); g.beginPath(); g.ellipse(0, -22, 9, 22, 0, 0, 7); g.fill(); g.stroke(); g.restore() }); g.fillStyle = '#ffd34d'; g.beginPath(); g.arc(0, -6, 7, 0, 7); g.fill(); g.stroke(); g.restore(); return true }
  if (type === 'chhatra') { P(); ln(g, 0, 20, 0, -96, 7, OL); ln(g, 0, 20, 0, -96, 3, '#8a5a2b'); g.fillStyle = '#ffd34d'; g.lineWidth = 5; g.beginPath(); g.moveTo(-62, -82); g.quadraticCurveTo(0, -150, 62, -82); g.quadraticCurveTo(0, -96, -62, -82); g.closePath(); g.fill(); g.stroke(); g.strokeStyle = '#e8762a'; g.lineWidth = 3;[-30, 0, 30].forEach(d => { g.beginPath(); g.moveTo(0, -128); g.lineTo(d, -88); g.stroke() }); g.restore(); return true }
  if (type === 'herb') { P(); g.shadowColor = '#b8ff8a'; g.shadowBlur = 22; g.fillStyle = '#7ff06a'; g.lineWidth = 3;[-1, 0, 1].forEach(d => { g.beginPath(); g.ellipse(d * 10, -16, 6, 15, d * .6, 0, 7); g.fill(); g.stroke() }); g.restore(); return true }
  return ORIG.drawPropN(g, type, x, y, t, K);
}
function drawFxN(g, fx, t) {
  ORIG.drawFxN(g, fx, t);
  if (fx.includes('ash')) for (let i = 0; i < 9; i++) { const u = (t * .9 + i / 9) % 1; g.fillStyle = `rgba(140,136,150,${.85 * (1 - u)})`; g.beginPath(); g.arc(128 + Math.sin(i * 2.3 + u * 4) * 60 * u, 300 - u * 260, 10 + u * 22, 0, 7); g.fill() }
  if (fx.includes('fire')) for (let i = 0; i < 7; i++) { const u = (t * 2.2 + i / 7) % 1, x = 70 + i * 19; g.fillStyle = i % 2 ? `rgba(255,140,40,${1 - u})` : `rgba(255,220,90,${1 - u})`; g.beginPath(); g.ellipse(x + Math.sin(t * 9 + i) * 6, 320 - u * 160, 14 * (1 - u) + 4, 26 * (1 - u) + 6, 0, 0, 7); g.fill() }
  if (fx.includes('aura')) { g.save(); g.globalCompositeOperation = 'destination-over'; const gr = g.createRadialGradient(128, 140, 40, 128, 140, 128); gr.addColorStop(0, 'rgba(255,230,140,.9)'); gr.addColorStop(1, 'rgba(255,180,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 300); g.restore() }
}

/* non-human sprites: the serpent Vritra, the buffalo demon, Durga's lion, and the ash Kama leaves behind */
function drawSerpent(g, c, face, t, ph) {
  const SK = '#5a3f8a', BL = '#b89be8', w = Math.sin(t * 3 + ph) * 6;
  g.lineCap = g.lineJoin = 'round'; g.strokeStyle = OL;
  const body = () => { g.beginPath(); g.moveTo(20, 330); g.bezierCurveTo(60, 250 + w, 200, 330, 226, 250); g.bezierCurveTo(250, 170, 120, 210, 112, 150); };
  g.lineWidth = 64; body(); g.stroke(); g.strokeStyle = SK; g.lineWidth = 50; body(); g.stroke(); g.strokeStyle = BL; g.lineWidth = 14; g.setLineDash([10, 16]); body(); g.stroke(); g.setLineDash([]);
  g.fillStyle = SK; g.strokeStyle = OL; g.lineWidth = 7; g.beginPath(); g.ellipse(118, 110, 66, 52, -.15, 0, 7); g.fill(); g.stroke();
  g.fillStyle = '#7a5aa8';[[82, 66], [118, 56], [154, 66]].forEach(([x, y]) => { g.beginPath(); g.moveTo(x - 12, y + 10); g.lineTo(x, y - 18); g.lineTo(x + 12, y + 10); g.closePath(); g.fill(); g.stroke() });
  const ey = 100;
  if (face === 'dizzy') [96, 146].forEach((x, i) => { g.lineWidth = 4; g.beginPath(); for (let a = 0; a < 13; a += .4) { const r = a * 1.1, b = a + t * 8 * (i ? 1 : -1); g.lineTo(x + Math.cos(b) * r, ey + Math.sin(b) * r) } g.stroke() });
  else [96, 146].forEach(x => { g.fillStyle = '#ffd34d'; g.lineWidth = 4; g.beginPath(); g.ellipse(x, ey, 14, 11, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = OL; g.beginPath(); g.ellipse(x, ey, 3.5, 9, 0, 0, 7); g.fill() });
  if (face === 'open' || face === 'angry') { const jo = face === 'open' ? 36 + Math.sin(t * 8) * 6 : 16; g.fillStyle = '#7a1626'; g.lineWidth = 6; g.beginPath(); g.moveTo(70, 132); g.quadraticCurveTo(118, 140, 166, 132); g.quadraticCurveTo(160, 132 + jo, 118, 136 + jo); g.quadraticCurveTo(76, 132 + jo, 70, 132); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#fff'; g.lineWidth = 3;[96, 140].forEach(x => { g.beginPath(); g.moveTo(x - 6, 134); g.lineTo(x, 156); g.lineTo(x + 6, 134); g.closePath(); g.fill(); g.stroke() });
    if (face === 'open') { g.strokeStyle = '#5ab4ff'; g.lineWidth = 9; g.beginPath(); g.moveTo(118, 300); g.quadraticCurveTo(80, 220, 118, 150 + jo); g.stroke() } }
  else { g.lineWidth = 6; g.beginPath(); g.moveTo(84, 140); g.quadraticCurveTo(118, 150, 152, 140); g.stroke(); ln(g, 118, 146, 126, 166 + Math.sin(t * 14) * 4, 3, '#e0261c') }
}
function drawBuffalo(g, c, face, t, ph) {
  const FUR = '#3a2f3a', LT = '#5e4d5e', bob = Math.sin(t * 4 + ph) * 2, jit = face === 'angry' ? Math.sin(t * 40) * 1.5 : 0;
  g.translate(jit, bob); g.lineJoin = g.lineCap = 'round'; g.strokeStyle = OL;
  g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(128, 338, 90, 10, 0, 0, 7); g.fill();
  g.fillStyle = FUR; g.lineWidth = 7; g.beginPath(); g.moveTo(44, 334); g.quadraticCurveTo(30, 196, 128, 186); g.quadraticCurveTo(226, 196, 212, 334); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#c9a23a'; g.lineWidth = 5; g.beginPath(); g.rect(70, 244, 116, 16); g.fill(); g.stroke();
  [[-1, 1]].flat().forEach(s => { g.save(); g.translate(128 + s * 60, 92); g.scale(s, 1); g.fillStyle = '#f1e3c2'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 6); g.quadraticCurveTo(70, 10, 74, -60); g.quadraticCurveTo(52, -20, 0, -14); g.closePath(); g.fill(); g.stroke(); g.restore() });
  g.fillStyle = FUR; g.lineWidth = 7; g.beginPath(); g.ellipse(128, 120, 76, 66, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = LT; g.beginPath(); g.ellipse(128, 160, 48, 30, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = OL;[110, 146].forEach(x => { g.beginPath(); g.ellipse(x, 162, 7, 5, 0, 0, 7); g.fill() });
  g.strokeStyle = '#ffd34d'; g.lineWidth = 5; g.beginPath(); g.arc(128, 178, 12, .2, Math.PI - .2); g.stroke(); g.strokeStyle = OL;
  if (face === 'dizzy') [96, 160].forEach((x, i) => { g.lineWidth = 4; g.beginPath(); for (let a = 0; a < 13; a += .4) { const r = a * 1.1, b = a + t * 8 * (i ? 1 : -1); g.lineTo(x + Math.cos(b) * r, 104 + Math.sin(b) * r) } g.stroke() });
  else if (face === 'shocked') [96, 160].forEach(x => { g.fillStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.arc(x, 104, 15, 0, 7); g.fill(); g.stroke(); g.fillStyle = OL; g.beginPath(); g.arc(x, 104, 4, 0, 7); g.fill() });
  else { [96, 160].forEach(x => { g.fillStyle = '#ff3b2f'; g.lineWidth = 4; g.beginPath(); g.ellipse(x, 104, 13, 9, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = OL; g.beginPath(); g.arc(x, 104, 3.5, 0, 7); g.fill() }); ln(g, 76, 82, 114, 96, 9, OL); ln(g, 142, 96, 180, 82, 9, OL) }
  [[60, 250], [196, 250]].forEach(([x, y], i) => { ln(g, i ? 186 : 70, 206, x + (i ? 20 : -20), y - 30, 22, OL); ln(g, i ? 186 : 70, 206, x + (i ? 20 : -20), y - 30, 14, FUR) });
  if (c.fx) drawFx(g, c.fx, t);
}
function drawLion(g, c, face, t, ph) {
  const GO = '#f0b43c', DK = '#c9852a', MANE = '#c9622a', bob = Math.sin(t * 4 + ph) * 2;
  g.lineJoin = g.lineCap = 'round'; g.strokeStyle = OL;
  g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(128, 340, 110, 10, 0, 0, 7); g.fill();
  g.translate(0, bob);
  g.lineWidth = 7; g.strokeStyle = OL; g.beginPath(); g.moveTo(220, 262); g.quadraticCurveTo(250, 220 + Math.sin(t * 5) * 10, 236, 196); g.stroke(); g.strokeStyle = GO; g.lineWidth = 3; g.stroke(); g.strokeStyle = OL;
  g.fillStyle = MANE; g.lineWidth = 4; g.beginPath(); g.arc(238, 192, 9, 0, 7); g.fill(); g.stroke();
  g.fillStyle = GO; g.lineWidth = 7; g.beginPath(); g.ellipse(150, 262, 86, 48, 0, 0, 7); g.fill(); g.stroke();
  [[96, 300], [128, 304], [182, 304], [212, 298]].forEach(([x, y]) => { g.fillStyle = GO; g.beginPath(); g.rect(x - 11, y - 20, 22, 40); g.fill(); g.stroke(); g.beginPath(); g.ellipse(x, y + 22, 15, 9, 0, 0, 7); g.fill(); g.stroke() });
  g.fillStyle = MANE; g.beginPath(); for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283, r = i % 2 ? 62 : 78; g.lineTo(70 + Math.cos(a) * r, 206 + Math.sin(a) * r) } g.closePath(); g.fill(); g.stroke();
  g.fillStyle = GO; g.beginPath(); g.arc(70, 206, 48, 0, 7); g.fill(); g.stroke();
  [52, 92].forEach(x => { g.fillStyle = OL; g.beginPath(); g.arc(x, 196, 6, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x + 2, 194, 2, 0, 7); g.fill() });
  ln(g, 40, 180, 62, 186, 5, OL); ln(g, 82, 186, 104, 180, 5, OL);
  g.fillStyle = '#7a3a22'; g.beginPath(); g.moveTo(62, 212); g.lineTo(80, 212); g.lineTo(71, 222); g.closePath(); g.fill();
  if (face === 'open') { g.fillStyle = '#7a1626'; g.lineWidth = 5; g.beginPath(); g.ellipse(71, 236, 20, 14 + Math.sin(t * 9) * 3, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#fff';[60, 82].forEach(x => { g.beginPath(); g.moveTo(x - 4, 224); g.lineTo(x, 234); g.lineTo(x + 4, 224); g.closePath(); g.fill() }) }
  else { g.lineWidth = 4; g.beginPath(); g.moveTo(58, 228); g.quadraticCurveTo(71, 236, 84, 228); g.stroke() }
}
function drawAsh(g, c, t) {
  g.lineJoin = 'round'; g.strokeStyle = OL; g.fillStyle = '#8c8896'; g.lineWidth = 6; g.beginPath(); g.moveTo(60, 334); g.quadraticCurveTo(128, 270, 196, 334); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#ff8fb8'; g.lineWidth = 3;[[92, 322], [150, 318]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x, y, 8, 5, .4, 0, 7); g.fill(); g.stroke() });
  drawFxN(g, ['ash'], t);
}
function drawChar(g, c, t) {
  const sp = { SN: drawSerpent, BF: drawBuffalo, LN: drawLion }[c.k];
  if (!sp && c.k !== 'AS') return ORIG.drawChar(g, c, t);
  g.setTransform(SPR, 0, 0, SPR, 0, 0); g.clearRect(0, 0, 256, 352); if (c.flip) { g.translate(256, 0); g.scale(-1, 1) }
  if (c.k === 'AS') return drawAsh(g, c, t);
  sp(g, c, c.face || c.ex || 'neutral', t, c.ph || 0);
}
