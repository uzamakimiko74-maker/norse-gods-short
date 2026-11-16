/* Top 5 Strongest Hindu Gods — worlds, shot table (cut on the narration's own word times), HUD, and the
   Lemo-Opuscar page contract (window.render(t), DUR, EV, TEXTS). Everything is a pure function of t. */
const DUR = 79.4;
const WORDS = window.WORDS_JSON;

/* fog belongs to the sets, not to the sky domes and far glows */
const _dome = dome, _glowSp = glowSp;
dome = (p, tx) => { const m = _dome(p, tx); m.material.fog = false; return m };
glowSp = (...a) => { const s = _glowSp(...a); s.material.fog = false; return s };

/* ---------- small set builders ---------- */
const GOLD = PH(0xe8b830, { shininess: 90 }), GOLDD = PH(0xb8862a);
function shikhara(parent, x, z, s, col, dk) {        // a temple tower: plinth, stacked tiers, amalaka, kalasha, flag
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); parent.add(g);
  const m = FL(col), d = FL(dk);
  mesh(g, new THREE.BoxGeometry(2.4, .5, 2.4), d, 0, .25, 0); mesh(g, new THREE.BoxGeometry(2, 1.4, 2), m, 0, 1.2, 0);
  mesh(g, new THREE.BoxGeometry(.7, 1, .1), B(0x2a1608), 0, 1, 1.01);
  for (let i = 0; i < 5; i++) { const r = 1.05 - i * .17; mesh(g, new THREE.CylinderGeometry(r * .86, r, .5, 8), i % 2 ? d : m, 0, 2.15 + i * .48, 0) }
  mesh(g, new THREE.CylinderGeometry(.42, .42, .18, 16), d, 0, 4.6, 0).scale.set(1, 1, 1);
  mesh(g, new THREE.SphereGeometry(.2, 12, 10), GOLD, 0, 4.85, 0); mesh(g, new THREE.ConeGeometry(.08, .4, 8), GOLD, 0, 5.15, 0);
  const fl = mesh(g, new THREE.PlaneGeometry(.5, .3), L(0xff8a2b, { side: THREE.DoubleSide }), .25, 5.3, 0); return { g, fl };
}
function lotusMesh(parent, x, y, z, s, col) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); parent.add(g);
  for (let i = 0; i < 8; i++) { const p = mesh(g, new THREE.SphereGeometry(.3, 10, 8), L(col), Math.cos(i / 8 * 6.283) * .26, .12, Math.sin(i / 8 * 6.283) * .26); p.scale.set(.55, .3, 1.1); p.rotation.y = -i / 8 * 6.283; p.rotation.x = .5 }
  mesh(g, new THREE.SphereGeometry(.14, 10, 8), L(0xffd34d), 0, .18, 0);
  mesh(g, new THREE.CircleGeometry(.6, 16), L(0x3f9a4c), 0, .01, 0).rotation.x = -Math.PI / 2; return g;
}
function cloudPuff(parent, x, y, z, s, col = 0xffffff) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); parent.add(g);
  [[0, 0, 0, .9], [-.8, -.15, .1, .65], [.8, -.1, 0, .7], [-.35, .35, -.1, .6], [.4, .3, .1, .55]].forEach(([a, b, c2, r]) => mesh(g, new THREE.SphereGeometry(r, 14, 10), L(col), a, b, c2)); return g;
}
function templeSeat(grp, main, dk, glow) {            // each god's throne: plinth, seat, arched back, two kalasha pillars, glowing crest
  const t = new THREE.Group(); grp.add(t);
  mesh(t, new THREE.BoxGeometry(2.9, .3, 2.4), dk, 0, .15, -1.9); mesh(t, new THREE.BoxGeometry(2.3, .4, 2), main, 0, .5, -1.8); mesh(t, new THREE.BoxGeometry(2.3, 2.4, .36), main, 0, 1.6, -2.6);
  const arch = mesh(t, new THREE.TorusGeometry(1.15, .2, 10, 30, Math.PI), main, 0, 2.8, -2.6);
  mesh(t, new THREE.CircleGeometry(1.0, 30, 0, Math.PI), dk, 0, 2.8, -2.4);
  [-1.1, 1.1].forEach(x => { mesh(t, new THREE.BoxGeometry(.3, .9, 2), main, x, .95, -1.8); mesh(t, new THREE.SphereGeometry(.2, 12, 10), GOLD, x, 1.42, -.86) });
  [-1.4, 1.4].forEach(x => { mesh(t, new THREE.CylinderGeometry(.16, .2, 3.8, 12), dk, x, 1.9, -2.6); mesh(t, new THREE.SphereGeometry(.28, 12, 10), GOLD, x, 4.0, -2.6); mesh(t, new THREE.ConeGeometry(.1, .4, 8), GOLD, x, 4.35, -2.6);[.9, 1.9, 2.9].forEach(y => mesh(t, new THREE.TorusGeometry(.2, .05, 6, 14), GOLD, x, y, -2.6).rotation.x = Math.PI / 2) });
  const crest = mesh(t, new THREE.SphereGeometry(.26, 16, 14), new THREE.MeshPhongMaterial({ color: glow, emissive: glow, emissiveIntensity: .6 }), 0, 4.15, -2.6);
  return { t, crest };
}
function streakTex(c0) { return ctex(64, 256, (g, w, h) => { for (let y = 0; y < h; y += 2) { g.fillStyle = `rgba(${c0},${.25 + .5 * Math.abs(Math.sin(y * .11) * Math.sin(y * .037))})`; g.fillRect(0, y, w, 2) } }) }
const rngW = rng(21);

/* ---------- DEVALOKA (intro, outro): dawn temple court ---------- */
const dvG = world(); dvG.visible = true;
mesh(dvG, new THREE.CylinderGeometry(11, 12, 1, 32), L(0xe9c48a, { map: groundTex('#e6c08a', ['#f2d4a2', '#d8ac72', '#ecc890'], false) }), 0, -.5, 0);
dome(dvG, skyTexDetailed('#ff7fa8', '#ffb46a', '#ffe7b0', 'rgba(255,244,226,.45)', 22, 41));
glowSp(dvG, glowTex('rgba(255,250,225,1)', 'rgba(255,190,90,.7)'), 22, 0, 6, -48);
[[-20, -26, 8, 9], [-8, -32, 9, 11], [9, -30, 10, 12], [21, -24, 7, 8]].forEach(([x, z, r, h]) => mesh(dvG, new THREE.ConeGeometry(r, h, 7), FL(0xc8708a), x, h / 2 - .6, z));
const dvTemple = shikhara(dvG, 0, -12, 2.2, 0xf0d6a8, 0xc98f5a), dvSh = [shikhara(dvG, -7, -9, 1.2, 0xf6e2c0, 0xd09a62), shikhara(dvG, 7, -9, 1.2, 0xf6e2c0, 0xd09a62)];
mesh(dvG, new THREE.CircleGeometry(3.2, 32), PH(0x3fa7d6, { shininess: 120 }), 0, .02, -5.2).rotation.x = -Math.PI / 2;
[[-1.6, -4.6], [.9, -5.8], [2, -4.4], [-.4, -6.4], [-2.4, -5.8]].forEach(([x, z], i) => lotusMesh(dvG, x, .03, z, .55 + (i % 2) * .15, i % 2 ? 0xff8fb8 : 0xfff0f6));
const dvDiyas = [-4.2, -3, 3, 4.2].map(x => { mesh(dvG, new THREE.CylinderGeometry(.16, .1, .16, 12), L(0xb8642a), x, .08, -1.6); const f = makeFlame(0xff8a2b, 0xffd34d); f.grp.position.set(x, .12, -1.6); f.grp.scale.setScalar(.45); dvG.add(f.grp); return f });
[[-3.6, 1.3], [3.6, 1.3]].forEach(([x, z]) => { mesh(dvG, new THREE.CylinderGeometry(.18, .22, 3.4, 12), FL(0xd09a62), x, 1.7, z - 4); mesh(dvG, new THREE.SphereGeometry(.3, 12, 10), GOLD, x, 3.55, z - 4) });
const garl = []; for (let i = 0; i <= 18; i++) { const u = i / 18, x = lerp(-3.6, 3.6, u), y = 3.3 - Math.sin(u * Math.PI) * .9; garl.push(mesh(dvG, new THREE.SphereGeometry(.13, 10, 8), L(i % 2 ? 0xff9f1c : 0xffd34d), x, y, -2.7)) }
const petals = []; for (let i = 0; i < 46; i++) { const m = mesh(dvG, new THREE.CircleGeometry(.05, 6), B(i % 3 ? 0xff8fb8 : 0xffd34d, { side: THREE.DoubleSide }), 0, 0, 0); m.userData = { x: (rngW() - .5) * 14, z: (rngW() - .5) * 10 + 1, sp: .4 + rngW() * .5, o: rngW() * 9, w: rngW() * 6 }; petals.push(m) }

/* ---------- HIMALAYA (Hanuman): moonlit snow ---------- */
const hmG = world();
mesh(hmG, new THREE.CylinderGeometry(10, 11, 1, 28), L(0xd8e4f8, { map: groundTex('#dce6f8', ['#eef4ff', '#c4d2ec', '#d0dcf2'], false) }), 0, -.5, 0);
dome(hmG, nightTex('#050a26', '#1b2f6a', '#5a78b8', { stars: 320, seed: 4 }));
glowSp(hmG, glowTex('rgba(255,255,240,1)', 'rgba(200,220,255,.5)'), 9, 9, 16, -40);
[[-16, -22, 7, 13], [-7, -26, 8, 16], [4, -28, 9, 18], [14, -22, 7, 12], [22, -14, 6, 9], [-22, -12, 6, 9]].forEach(([x, z, r, h]) => snowCone(hmG, x, z, r, h, 0x3a4c88));
const hmSeat = templeSeat(hmG, PH(0xe8762a), PH(0x8a3f1c), 0xffd34d);
const hmFl = [-3.2, 3.2].map(x => { mesh(hmG, new THREE.CylinderGeometry(.2, .28, 1, 8), FL(0x6a4a3a), x, .5, .3); const f = makeFlame(0xff6a2b, 0xffc04d); f.grp.position.set(x, 1, .3); hmG.add(f.grp); return f });
const drona = new THREE.Group(); hmG.add(drona); PROPS.drona = drona;
mesh(drona, new THREE.ConeGeometry(1.5, 2.2, 7), FL(0x7d8090), 0, 1.1, 0); mesh(drona, new THREE.ConeGeometry(.62, .9, 7), FL(0xffffff), 0, 1.78, 0);
mesh(drona, new THREE.CylinderGeometry(1.5, .9, .5, 7), FL(0x5e5248), 0, -.25, 0);
const herbs = [[.6, .9, .9], [-.5, 1.1, .8], [.1, .55, 1.25], [.85, .4, .6], [-.9, .45, .7]].map(([x, y, z]) => glowSp(drona, glowTex('rgba(220,255,200,1)', 'rgba(120,255,110,.6)'), .55, x, y, z));
const hmSnow = []; for (let i = 0; i < 50; i++) { const m = mesh(hmG, new THREE.SphereGeometry(.03 + rngW() * .03, 5, 4), B(0xffffff)); m.userData = { x: (rngW() - .5) * 16, z: (rngW() - .5) * 12, sp: .5 + rngW() * .7, o: rngW() * 9, w: rngW() * 6 }; hmSnow.push(m) }

/* ---------- SVARGA (Indra): palace above the clouds; storm and rivers for Vritra ---------- */
const svG = world();
const svSky = dome(svG, skyTexDetailed('#3f93ff', '#9fd4ff', '#fff1d0', 'rgba(255,255,255,.55)', 24, 9));
for (let i = 0; i < 26; i++) { const a = i / 26 * 6.283, r = 3 + rngW() * 7; cloudPuff(svG, Math.cos(a) * r, -.35, Math.sin(a) * r - 1, 1 + rngW() * .8) }
mesh(svG, new THREE.CylinderGeometry(10, 10, .6, 30), L(0xf4f8ff), 0, -.4, 0);
for (let i = -3; i <= 3; i++) { mesh(svG, new THREE.CylinderGeometry(.3, .34, 5, 14), GOLD, i * 1.9, 2.5, -10); }
mesh(svG, new THREE.BoxGeometry(14, .6, 1.6), GOLD, 0, 5.2, -10);
[-4, 0, 4].forEach((x, i) => { mesh(svG, new THREE.SphereGeometry(i === 1 ? 2.2 : 1.4, 24, 16, 0, 6.3, 0, Math.PI / 2), GOLD, x, 5.5, -11); mesh(svG, new THREE.ConeGeometry(.12, .8, 8), GOLDD, x, i === 1 ? 7.9 : 7.1, -11) });
const svSeat = templeSeat(svG, GOLD, PH(0x2f6fd6), 0x9fd4ff);
const rivers = new THREE.Group(); svG.add(rivers); PROPS.rivers = rivers;
const rivTex = streakTex('120,200,255'); rivTex.wrapS = rivTex.wrapT = THREE.RepeatWrapping;
const rivM = [-3.2, -1.2, 1.4, 3.4].map((x, i) => { const m = mesh(rivers, new THREE.PlaneGeometry(.8, 14), B(0xffffff, { map: rivTex, transparent: true, opacity: .9 }), x, .02, -2); m.rotation.x = -Math.PI / 2; m.rotation.z = (i - 1.5) * .14; return m });
const boltTex = [3, 8, 15].map(seed => ctex(128, 512, (g, w, h) => { const r = rng(seed), pts = [[64, 0]]; let x = 64; for (let y = 40; y <= h; y += 40) { x = clamp(x + (r() - .5) * 60, 14, 114); pts.push([x, y]) }
  g.lineJoin = g.lineCap = 'round'; g.shadowColor = '#bfe0ff'; g.shadowBlur = 24;[[22, 'rgba(160,200,255,.5)'], [10, '#fff8c8'], [4, '#ffffff']].forEach(([lw, c]) => { g.strokeStyle = c; g.lineWidth = lw; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke() }) }));
const boltSp = boltTex.map(tx => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.visible = false; scene.add(s); return s });

/* ---------- RANABHUMI (Durga): the battlefield at sunset ---------- */
const rnG = world();
mesh(rnG, new THREE.CylinderGeometry(10, 11, 1, 28), L(0x8a4a3a, { map: groundTex('#8a4a3a', ['#a85a42', '#6a3428', '#9a523a'], true) }), 0, -.5, 0);
dome(rnG, skyTexDetailed('#3a0f2a', '#c43a2a', '#ffb04a', 'rgba(255,170,90,.35)', 18, 27));
glowSp(rnG, glowTex('rgba(255,240,200,1)', 'rgba(255,110,40,.75)'), 24, 6, 3, -46);
[[-14, -20, 6, 7], [10, -24, 8, 9], [20, -12, 5, 6], [-20, -8, 5, 6]].forEach(([x, z, r, h]) => mesh(rnG, new THREE.ConeGeometry(r, h, 5), FL(0x3a1a28), x, h / 2 - .6, z));
[[-4.4, -3, 2.4], [4.6, -3.4, 2.8], [-6, 0, 1.6], [6, -.4, 1.8]].forEach(([x, z, h]) => mesh(rnG, new THREE.DodecahedronGeometry(h * .5), FL(0x5a3a3a), x, h * .3, z));
const rnSeat = templeSeat(rnG, PH(0xd8283a), PH(0x6a1424), 0xffd34d);
const rnFl = [-3.4, 3.4].map(x => { mesh(rnG, new THREE.CylinderGeometry(.2, .28, 1, 8), FL(0x3a2a2a), x, .5, .3); const f = makeFlame(0xff4a2b, 0xffc04d); f.grp.position.set(x, 1, .3); rnG.add(f.grp); return f });
const beams = new THREE.Group(); rnG.add(beams); PROPS.beams = beams;
const BEAMSRC = [[-1.7, .9, .6, 0x4f9dff], [-.85, .9, -.4, 0xffd34d], [.85, .9, -.4, 0x7fe0ff], [1.7, .9, .6, 0xff8a2b]];
const beamM = BEAMSRC.map(([x, y, z, col]) => { const m = mesh(beams, new THREE.CylinderGeometry(.07, .07, 1, 8), B(col, { transparent: true, opacity: .9, blending: THREE.AdditiveBlending }), 0, 0, 0); return { m, from: new THREE.Vector3(x, y, z), g: glowSp(beams, glowTex('rgba(255,255,255,1)', 'rgba(255,220,160,.5)'), .6, x, y, z) } });
const orb = glowSp(beams, glowTex('rgba(255,255,240,1)', 'rgba(255,200,90,.7)'), 1, 0, 1.6, .5);

/* ---------- YAJNA (Vamana): Bali's sacrifice court ---------- */
const yjG = world();
mesh(yjG, new THREE.CylinderGeometry(10, 11, 1, 28), L(0xf4ecdc, { map: ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++)for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? '#efe2c8' : '#c9a87a'; g.fillRect(x * 32, y * 32, 32, 32) } }) }), 0, -.5, 0);
dome(yjG, skyTexDetailed('#6fb8ff', '#cfe9ff', '#fff3d0', 'rgba(255,255,255,.5)', 18, 13));
for (let i = 0; i < 6; i++) { const a = -2.2 + i * .88; mesh(yjG, new THREE.CylinderGeometry(.24, .28, 4, 12), PH(0xf6ead2), Math.cos(a) * 6, 2, Math.sin(a) * 6 - 2); mesh(yjG, new THREE.BoxGeometry(.7, .3, .7), GOLD, Math.cos(a) * 6, 4.1, Math.sin(a) * 6 - 2) }
mesh(yjG, new THREE.CylinderGeometry(6.6, 6.6, .3, 28, 1, true, Math.PI * 1.05, Math.PI * .9), L(0xd8283a, { side: THREE.DoubleSide }), 0, 4.4, -2);
const vnSeat = templeSeat(yjG, PH(0xf2c53d), PH(0x2f6fd6), 0x8fbcf2);
const havan = new THREE.Group(); yjG.add(havan); PROPS.havan = havan; havan.position.set(.15, 0, .3);
mesh(havan, new THREE.CylinderGeometry(.42, .5, .36, 4), FL(0xb8642a), 0, .18, 0).rotation.y = Math.PI / 4;
const havanF = makeFlame(0xff6a2b, 0xffd34d); havanF.grp.position.set(0, .36, 0); havan.add(havanF.grp);
const bthrone = new THREE.Group(); yjG.add(bthrone); PROPS.bthrone = bthrone;
mesh(bthrone, new THREE.BoxGeometry(1.1, .5, .9), PH(0x7a3fa8), 1.15, .25, -.9); mesh(bthrone, new THREE.BoxGeometry(1.1, 1.5, .2), PH(0x7a3fa8), 1.15, 1, -1.35); mesh(bthrone, new THREE.SphereGeometry(.16, 10, 8), GOLD, 1.15, 1.85, -1.35);

/* ---------- COSMOS (Vishnu grows): earth, sky and stars ---------- */
const csG = world();
dome(csG, nightTex('#04021a', '#1a0a4a', '#3a2a7a', { stars: 420, neb: 7, nebCol: ['rgba(160,90,255,.35)', 'rgba(80,160,255,.3)', 'rgba(255,120,200,.25)'], seed: 31 }));
const earth = mesh(csG, new THREE.SphereGeometry(30, 48, 32), L(0xffffff, { map: ctex(512, 256, (g, w, h) => { g.fillStyle = '#2f7fd8'; g.fillRect(0, 0, w, h); const r = rng(5); g.fillStyle = '#5fbf5a'; for (let i = 0; i < 40; i++) { g.beginPath(); g.ellipse(r() * w, h * (.2 + r() * .6), 10 + r() * 40, 6 + r() * 20, r() * 3, 0, 7); g.fill() } g.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 30; i++) { g.beginPath(); g.ellipse(r() * w, r() * h, 12 + r() * 30, 3 + r() * 6, 0, 0, 7); g.fill() } }) }), 0, -30, 0);
const atmo = glowSp(csG, glowTex('rgba(140,200,255,.8)', 'rgba(80,140,255,.25)'), 78, 0, -30, -2, .55);
const skyClouds = [[-6, 18, -6], [7, 22, -8], [0, 26, -10]].map(([x, y, z]) => cloudPuff(csG, x, y, z, 2.2));
const STEPS = [[-.9, .2, 1.2, 55.76], [9, 20, -6, 56.64], [-9, 29, -10, 57.6]];
const stepG = STEPS.map(([x, y, z]) => glowSp(csG, glowTex('rgba(255,250,210,1)', 'rgba(255,200,80,.7)'), 5, x, y, z, 0));
const csStars = []; for (let i = 0; i < 60; i++) csStars.push(glowSp(csG, glowTex('rgba(255,255,255,1)', 'rgba(180,200,255,.4)'), .6 + rngW() * 1.4, (rngW() - .5) * 90, 10 + rngW() * 60, -20 - rngW() * 30));

/* ---------- KAILASH (Shiva): night peak, crescent moon ---------- */
const klG = world();
mesh(klG, new THREE.CylinderGeometry(10, 11, 1, 28), L(0xe4ecfa, { map: groundTex('#e4ecfa', ['#f4f8ff', '#cad6ee', '#d6e0f4'], false) }), 0, -.5, 0);
dome(klG, nightTex('#04081e', '#202c66', '#6a5aa8', { stars: 300, seed: 17 }));
mesh(klG, new THREE.ConeGeometry(9, 15, 4), FL(0xb8c6e8), 0, 7, -30).rotation.y = Math.PI / 4;
mesh(klG, new THREE.ConeGeometry(3.6, 6, 4), FL(0xffffff), 0, 11.6, -30).rotation.y = Math.PI / 4;
[[-14, -20, 6, 9], [14, -20, 6, 10], [-22, -10, 5, 7], [22, -10, 5, 7]].forEach(([x, z, r, h]) => snowCone(klG, x, z, r, h, 0x404c88));
const moonC = ctex(256, 256, (g) => { g.fillStyle = '#fff7d6'; g.shadowColor = '#fff3c0'; g.shadowBlur = 30; g.beginPath(); g.arc(128, 128, 70, -1.2, 1.9); g.arc(108, 120, 58, 1.9, -1.2, true); g.closePath(); g.fill() });
const klMoon = mesh(klG, new THREE.PlaneGeometry(8, 8), B(0xffffff, { map: moonC, transparent: true, depthWrite: false }), -9, 17, -36);
const klSeat = templeSeat(klG, PH(0x8a96b8), PH(0x2a3050), 0x7fe0ff);
mesh(klG, new THREE.PlaneGeometry(2.4, 1.4), L(0xffffff, { map: ctex(256, 160, (g, w, h) => { g.fillStyle = '#e09a3a'; g.beginPath(); g.ellipse(w / 2, h / 2, w / 2 - 4, h / 2 - 4, 0, 0, 7); g.fill(); g.fillStyle = '#2a1608'; for (let i = 0; i < 9; i++) { g.fillRect(30 + i * 22, 30 + (i % 2) * 20, 8, 60) } }), transparent: true }), 0, .02, .8).rotation.x = -Math.PI / 2;
const eyebeam = new THREE.Group(); klG.add(eyebeam); PROPS.eyebeam = eyebeam;
const ebeam = mesh(eyebeam, new THREE.CylinderGeometry(.04, .09, 1, 10), B(0xff8a2b, { transparent: true, opacity: .9, blending: THREE.AdditiveBlending }), 0, 0, 0);
const klFl = [-3.2, 3.2].map(x => { mesh(klG, new THREE.CylinderGeometry(.2, .28, 1, 8), FL(0x5a6080), x, .5, .3); const f = makeFlame(0x7fe0ff, 0xffffff); f.grp.position.set(x, 1, .3); klG.add(f.grp); return f });

/* ---------- NATARAJA (the dance at the end of time) ---------- */
const ntG = world();
dome(ntG, nightTex('#05010f', '#2a0a3a', '#5a1a4a', { stars: 420, neb: 6, nebCol: ['rgba(255,90,60,.3)', 'rgba(255,170,60,.25)', 'rgba(160,60,255,.3)'], seed: 51 }));
lotusMesh(ntG, 0, 0, .4, 1.1, 0xff8fb8);
const ring = mesh(ntG, new THREE.TorusGeometry(1.75, .07, 10, 80), new THREE.MeshPhongMaterial({ color: 0xff8a2b, emissive: 0xff5a1c, emissiveIntensity: .9 }), 0, 1.45, .2);
const ringFl = []; for (let i = 0; i < 30; i++) { const a = i / 30 * 6.283, f = makeFlame(i % 2 ? 0xff4a2b : 0xffc04d, 0xffd34d); f.grp.position.set(Math.cos(a) * 1.75, 1.45 + Math.sin(a) * 1.75, .2); f.grp.rotation.z = a - Math.PI / 2; f.grp.scale.setScalar(.7); ntG.add(f.grp); ringFl.push(f) }
glowSp(ntG, glowTex('rgba(255,200,120,.9)', 'rgba(255,90,40,.35)'), 6.5, 0, 1.45, -.1, .7);

/* ---------- shot table ---------- */
const LINE = ['HN', 'IN', 'SV', 'VN', 'DG'], LX = [-1.9, -.95, 0, .95, 1.9];
const lineup = (ex, f) => () => LINE.map((k, i) => Object.assign({ k, ex, x: LX[i], z: 1.2, at: f ? i * .09 : 0 }, f ? {} : { pop: 0 }));
const S = (a, w, p0, p1, l0, l1, o) => Object.assign({ a, w, p0, p1, l0, l1 }, o || {});
const RANK = (a, w, k) => S(a, w, [0, 1.5, 7.5], [0, 1.05, 3.5], [0, .9, .8], [0, .9, .8], { rank: { HN: 5, IN: 4, DG: 3, VN: 2, SV: 1 }[k], cast: [{ k, ex: 'power' }] });
const dronaAt = (x, y, z) => { drona.position.set(x, y, z) };
const SHOTS = [
  S(0, 'dv', [0, 1.7, 11.4], [0, 1.2, 9.6], [0, .9, 1.2], [0, .9, 1.2], { cast: lineup('power', 1), title: 1 }),
  S(2.4, 'dv', [0, 1.3, 10], [0, 1.25, 9.3], [0, 1, 1.2], [0, 1, 1.2], { count: 1, cast: lineup('happy') }),
  S(4.0, 'dv', [-2.3, .45, 3.6], [2.3, .45, 3.6], [-1.6, .95, 1.2], [1.6, .95, 1.2], { cast: lineup('power') }),
  // #5 Hanuman
  RANK(5.6, 'hm', 'HN'),
  S(7.92, 'hm', [-.4, .95, 4], [-.2, .9, 3.4], [-.2, .55, .6], [-.2, .55, .6], { nothrone: 1, cast: [{ k: 'LK', ex: 'neutral', face: 'sleep', x: .35, y: -.17, z: .7, rot: Math.PI / 2, s: .9, nosh: 1, pop: 0 }, { k: 'HN', ex: 'worried', x: -.75, z: .5, fx: 'sweat' }] }),
  S(9.68, 'hm', [0, 2.2, 6.4], [.8, 2.6, 5.6], [0, 2.3, 0], [1, 2.7, 0], { nothrone: 1, burst: [.45, 'WHOOSH!', .5, .3, '#bfe8ff'], cast: lt => [{ k: 'HN', ex: 'reach', face: 'power', x: -2.6 + lt * 3.4, y: 1.5 + lt * .5, z: .5, rot: -.45, pop: 0, nosh: 1 }] }),
  S(10.72, 'hm', [0, 3.6, 12], [0, 3.2, 10.6], [0, 2.4, -6], [0, 2.4, -6], { nothrone: 1, on: ['drona'], fx: () => dronaAt(1.6, 0, -3.4), cast: lt => [{ k: 'HN', ex: 'reach', face: 'power', x: -1.6 + lt * 1.4, y: 3, z: 1, s: .6, rot: -.4, pop: 0, nosh: 1 }] }),
  S(11.68, 'hm', [-.3, 1.3, 3.6], [-.2, 1.25, 3.1], [.3, .95, -1], [.3, .95, -1], { nothrone: 1, on: ['drona'], fx: () => dronaAt(1.0, 0, -2.2), cast: [{ k: 'HN', ex: 'point', face: 'happy', x: -.55, z: .4, fx: 'spark' }] }),
  S(13.28, 'hm', [-.4, .95, 2.5], [-.25, .95, 2.2], [0, 1, .8], [0, 1, .8], { nothrone: 1, quest: [[.22, .3, .05], [.78, .26, .3]], cast: [{ k: 'HN', ex: 'worried', fx: 'sweat' }] }),
  S(14.48, 'hm', [0, 1.3, 6.6], [0, 1.6, 7.6], [0, 1.4, -1], [0, 2.3, -1], { nothrone: 1, on: ['drona'], shake: lt => lt > .5 && lt < 1.7 ? .045 : 0, burst: [1.44, 'LIFT!', .5, .22], fx: lt => { const u = ease((lt - .35) / 1.3); dronaAt(0, lerp(0, 2.05, u), lerp(-2.8, -1.4, u)); drona.scale.setScalar(lerp(1, .62, u)); herbs.forEach(h => h.material.opacity = .7 + .3 * Math.sin(lt * 8)) }, cast: [{ k: 'HN', ex: 'lift', face: 'power', x: 0, z: -.5, s: 1.1 }] }),
  S(16.52, 'hm', [-2.2, 2.4, 8.4], [2, 2.9, 8.4], [-1.5, 2.6, 0], [1.6, 3.1, 0], { nothrone: 1, on: ['drona'], fx: (lt) => { drona.scale.setScalar(.62); dronaAt(-2.1 + lt * 2.6, 1.6 + 1.6 + lt * .4, -.5) }, cast: lt => [{ k: 'HN', ex: 'lift', face: 'happy', x: -2.1 + lt * 2.6, y: 1.6 + lt * .4, z: -.2, pop: 0, nosh: 1 }] }),
  // #4 Indra
  RANK(18.4, 'sv', 'IN'),
  S(20.48, 'sv', [0, 1.3, 6.4], [0, 1.6, 8], [0, 1.6, -1], [0, 2.1, -2], { stamp: [.2, 'KING OF HEAVEN', '#ffd34d'], cast: [{ k: 'IN', ex: 'happy' }] }),
  S(21.92, 'sv', [0, 1.6, 7.6], [0, 1.4, 6.8], [0, 1.7, -1], [0, 1.6, -1], { storm: 1, nothrone: 1, on: ['rivers'], cast: [{ k: 'SN', ex: 'open', x: .2, z: -1.3, s: 3.2, pop: 0, nosh: 1 }] }),
  S(23.2, 'sv', [1.3, .8, 4.4], [1.1, .9, 3.9], [.3, 1.7, -1], [.3, 1.8, -1], { storm: 1, nothrone: 1, on: ['rivers'], drain: 1, burst: [.5, 'GULP!', .72, .26, '#bfe8ff'], cast: [{ k: 'SN', ex: 'open', x: .2, z: -1.3, s: 3.2, pop: 0, nosh: 1 }, { k: 'IN', ex: 'shocked', x: -1.1, z: .9, s: .8 }] }),
  S(25.28, 'sv', [-.5, 1.1, 4], [-.4, 1.15, 3.4], [0, 1.15, .7], [0, 1.25, .7], { storm: 1, nothrone: 1, cast: [{ k: 'IN', ex: 'power', fx: 'spark' }] }),
  S(26.64, 'sv', [.45, 1.05, 2.1], [.35, 1.05, 1.85], [.3, 1.02, .8], [.3, 1.02, .8], { storm: 1, nothrone: 1, cast: [{ k: 'IN', ex: 'power', pop: 0, fx: 'spark' }] }),
  S(27.52, 'sv', [0, 1.6, 7.4], [0, 1.5, 6.9], [.2, 1.7, -1], [.2, 1.6, -1], { storm: 1, nothrone: 1, on: ['rivers'], drain: 1, burst: [.12, 'ZAP!', .5, .24], shake: lt => .1 * Math.exp(-lt * 4), cast: [{ k: 'SN', ex: 'dizzy', face: 'dizzy', x: .2, z: -1.3, s: 3.2, pop: 0, nosh: 1, fx: 'stars' }] }),
  S(28.48, 'sv', [0, 2, 8], [0, 2.4, 9.4], [0, 1, -2], [0, .8, -2], { nothrone: 1, on: ['rivers'], cast: [{ k: 'IN', ex: 'happy', x: 0, z: .8 }] }),
  // #3 Durga
  RANK(30.56, 'rn', 'DG'),
  S(32.48, 'rn', [0, .3, 5], [0, .4, 4.2], [0, 2.3, -1], [0, 2.5, -1], { nothrone: 1, cast: [{ k: 'BF', ex: 'angry', x: 0, z: -1, s: 3.4, pop: 0 }] }),
  S(34.4, 'rn', [0, 1.6, 8.4], [0, 1.5, 7.8], [0, 1.5, -1], [0, 1.4, -1], { nothrone: 1, quest: [[.25, .33, .9], [.75, .3, 1.15]], cast: [{ k: 'BF', ex: 'angry', x: 0, z: -2, s: 3.4, pop: 0 }, { k: 'IN', ex: 'shocked', x: -1.6, z: 1, s: .75 }, { k: 'VN', ex: 'shocked', x: -.55, z: 1.4, s: .75 }, { k: 'SV', ex: 'worried', x: .55, z: 1.4, s: .75 }, { k: 'HN', ex: 'shocked', x: 1.6, z: 1, s: .75 }] }),
  S(36.88, 'rn', [0, 1.4, 7], [0, 1.6, 6], [0, 1.5, 0], [0, 1.6, 0], { nothrone: 1, on: ['beams'], cast: [{ k: 'IN', ex: 'power', x: -1.7, z: .6, s: .75, pop: 0 }, { k: 'VN', ex: 'power', x: -.85, z: -.4, s: .75, pop: 0 }, { k: 'SV', ex: 'power', x: .85, z: -.4, s: .75, pop: 0 }, { k: 'HN', ex: 'power', x: 1.7, z: .6, s: .75, pop: 0 }] }),
  S(39.36, 'rn', [0, 1.3, 5.2], [0, 1.1, 3.8], [0, .9, .8], [0, .9, .8], { cast: [{ k: 'DG', ex: 'power', fx: 'aura', armsN: 0 }] }),
  S(40.32, 'rn', [.5, 1, 3.4], [.3, 1, 2.7], [0, 1, .8], [0, 1, .8], { burst: [1.05, 'x10!', .78, .3, '#ff8fb8'], cast: (lt, p, t) => [{ k: 'DG', ex: 'power', armsN: clamp(Math.floor((t - 40.32) / .14), 0, 8), pop: 0 }] }),
  S(42.4, 'rn', [-2.6, 1.3, 5.8], [-1.6, 1.4, 5], [.2, 1.2, .4], [.2, 1.2, .4], { nothrone: 1, burst: [.6, 'ROAR!', .3, .27, '#ffd34d'], cast: [{ k: 'LN', ex: 'open', face: 'open', x: .2, z: .2, s: 2.4, pop: 0 }, { k: 'DG', ex: 'power', x: .5, y: .95, z: .45, s: .95, pop: 0, nosh: 1 }] }),
  S(43.6, 'rn', [0, 1.3, 7], [0, 1.5, 7.8], [0, 1.2, -.5], [0, 1.2, -.5], { nothrone: 1, shake: lt => lt > .35 ? .08 * Math.exp(-(lt - .35) * 4) : 0, burst: [.36, 'BOOM!', .5, .25, '#ffb26b'], cast: lt => [{ k: 'BF', ex: 'dizzy', face: 'dizzy', x: 1, z: -1.4, s: 2.6, rot: -ease((lt - .3) / .5) * 1.25, y: -ease((lt - .3) / .5) * .8, pop: 0, fx: 'stars' }, { k: 'DG', ex: 'power', x: -.9, z: .8, pop: 0 }] }),
  // #2 Vishnu
  RANK(45.2, 'yj', 'VN'),
  S(47.2, 'yj', [.5, .45, 2.5], [.3, .5, 2.2], [0, 1.05, .8], [0, 1.05, .8], { stamp: [.35, 'PRESERVER', '#ffd34d'], cast: [{ k: 'VN', ex: 'happy', pop: 0, fx: 'spark' }] }),
  S(48.24, 'yj', [0, 1.2, 5.4], [0, 1.15, 4.8], [.2, .9, .2], [.2, .9, .2], { nothrone: 1, on: ['havan', 'bthrone'], cast: [{ k: 'VM', ex: 'neutral', x: -.55, z: .8, s: .7 }, { k: 'BL', ex: 'neutral', x: 1.15, y: .45, z: -.75, s: .9 }] }),
  S(49.6, 'yj', [-1.3, .7, 3.2], [-1.1, .75, 2.8], [-.3, .8, .4], [-.3, .8, .4], { nothrone: 1, on: ['havan', 'bthrone'], cast: [{ k: 'VM', ex: 'point', x: -.9, z: .8, s: .7, pop: 0 }, { k: 'BL', ex: 'neutral', x: 1.15, y: .45, z: -.75, s: .9, pop: 0 }] }),
  S(50.88, 'yj', [1.4, 1.1, 3.4], [1.2, 1.15, 3], [.9, 1.1, -.5], [.9, 1.1, -.5], { nothrone: 1, on: ['havan', 'bthrone'], stamp: [.3, '3 STEPS?', '#ffd34d'], cast: [{ k: 'BL', ex: 'happy', face: 'happy', x: 1.15, y: .45, z: -.75, s: .9, pop: 0 }, { k: 'VM', ex: 'five', x: -.9, z: .8, s: .7, pop: 0 }] }),
  S(52.96, 'cs', [0, 1.4, 5], [0, 9, 34], [0, 1.2, 0], [0, 9, 0], { burst: [1.15, 'GROW!', .5, .25, '#ffd34d'], cast: (lt) => [{ k: lt < .35 ? 'VM' : 'VN', ex: 'power', fx: 'aura', x: 0, z: 0, s: lerp(.7, 13, ease((lt - .1) / 2.6)), pop: 0, nosh: 1 }] }),
  S(55.76, 'cs', [0, 9, 34], [0, 12, 40], [0, 9, 0], [0, 14, 0], { cast: [{ k: 'VN', ex: 'power', fx: 'aura', s: 13, pop: 0, nosh: 1 }] }),
  // #1 Shiva
  RANK(58.96, 'kl', 'SV'),
  S(60.24, 'kl', [0, 1, 7.4], [0, 1.2, 6.7], [0, 1.3, 1], [0, 1.3, 1], { crown: 1, cast: [{ k: 'SV', ex: 'power', pop: 0 }] }),
  S(61.44, 'kl', [.5, .45, 2.4], [.3, .5, 2.1], [0, 1.05, .8], [0, 1.05, .8], { stamp: [.25, 'DESTROYER', '#7fe0ff'], cast: [{ k: 'SV', ex: 'neutral', pop: 0 }] }),
  S(62.32, 'kl', [0, 1.02, 1.55], [0, 1.02, 1.3], [0, 1.02, .8], [0, 1.02, .8], { cast: lt => [{ k: 'SV', ex: 'neutral', pop: 0, eye3: ease((lt - .55) / .45) }] }),
  S(64.4, 'kl', [0, 1.1, 5.4], [0, 1.1, 4.9], [0, .9, 0], [0, .9, 0], { nothrone: 1, on: ['eyebeam'], burst: [.95, 'POOF!', .66, .32, '#d8d4e0'], cast: lt => [lt < .95 ? { k: 'KM', ex: 'shocked', x: 1, z: -.1, fx: lt > .3 ? 'fire' : 'hearts' } : { k: 'AS', x: 1, z: -.1, pop: 0 }, { k: 'SV', ex: 'neutral', eye3: 1, x: -.95, z: .8, pop: 0 }] }),
  S(66.8, 'nt', [0, 1.4, 9.6], [0, 1.4, 6.6], [0, 1.4, .4], [0, 1.4, .4], { cast: [{ k: 'SV', ex: 'power', fx: 'spark', s: 1.3, y: .12, pop: 0 }] }),
  S(68.88, 'nt', [0, 1.25, 4.4], [0, 1.4, 5.6], [0, 1.3, .4], [0, 1.4, .4], { burst: [.9, 'DANCE!', .5, .22, '#ffb26b'], cast: (lt, p, t) => { const b = Math.floor((t - 68.88) / .42) % 2; return [{ k: 'SV', ex: b ? 'happy' : 'power', face: 'happy', flip: b, rot: b ? .08 : -.08, s: 1.3, y: .12, pop: 0, fx: 'spark' }] } }),
  // outro
  S(70.56, 'dv', [0, 1.7, 11], [0, 1.4, 9.6], [0, .9, 1.2], [0, .9, 1.2], { cast: lineup('happy') }),
  S(71.92, 'dv', [0, 1.4, 9], [0, 1.35, 8.4], [0, 1.2, 1.2], [0, 1.2, 1.2], { bubbles: 1, cast: lineup('power') }),
  S(76.88, 'dv', [0, 1.6, 9.6], [0, 1.5, 9], [0, 1, 1.2], [0, 1, 1.2], { bubbles: 1, end: 1, cast: lineup('point') }),
];
function shotAt(t) { let si = 0; for (let i = 0; i < SHOTS.length; i++) { if (t >= SHOTS[i].a) si = i; else break } return si }
const WORLDG = { dv: dvG, hm: hmG, sv: svG, rn: rnG, yj: yjG, cs: csG, kl: klG, nt: ntG };
const SEAT = { hm: hmSeat, sv: svSeat, rn: rnSeat, yj: vnSeat, kl: klSeat };
const HEMI = { dv: [0xffe2c8, 1.0], hm: [0xc8d6ff, .85], sv: [0xffffff, 1.05], rn: [0xffb088, .95], yj: [0xfff4e0, 1.05], cs: [0xc8b8ff, .9], kl: [0xc0ccf0, .85], nt: [0xffb090, .9] };
const FOG = { dv: [0xffd0b0, 30, 70], hm: [0x1b2f6a, 25, 70], sv: [0xdfefff, 30, 80], rn: [0x8a3a2a, 22, 60], yj: [0xe8f4ff, 30, 80], kl: [0x202c66, 30, 80] };
const BOLTS = [[27.52, 'sv', -.6, -3, 9, 0], [27.62, 'sv', 1.4, -4, 9, 0], [25.4, 'sv', 3, -8, 10, 0], [26.1, 'sv', -3.4, -8, 10, 0]];
const stormAt = t => { let v = 0; for (const b of BOLTS) { const u = t - b[0]; if (u >= 0 && u < .5) v = Math.max(v, Math.exp(-u * 9)) } return v };
const _v = new THREE.Vector3(), LOOK = new THREE.Vector3();

function update(t) {
  const si = shotAt(t), s = SHOTS[si], b = SHOTS[si + 1] ? SHOTS[si + 1].a : DUR, lt = t - s.a, p = clamp(lt / (b - s.a)), k = p * p * (3 - 2 * p), w = s.w;
  for (const n in WORLDG) WORLDG[n].visible = n === w;
  for (const n in PROPS) PROPS[n].visible = !!(s.on && s.on.indexOf(n) >= 0);
  if (SEAT[w]) SEAT[w].t.visible = !s.nothrone;
  const hm = HEMI[w]; hemi.color.set(hm[0]); hemi.intensity = hm[1] * .68;   // toon steps clip at full light, so the sets are lit a little lower
  const fg = FOG[w]; scene.fog = fg ? new THREE.Fog(fg[0], fg[1], fg[2]) : null;
  cam.position.set(lerp(s.p0[0], s.p1[0], k), lerp(s.p0[1], s.p1[1], k), lerp(s.p0[2], s.p1[2], k));
  LOOK.set(lerp(s.l0[0], s.l1[0], k), lerp(s.l0[1], s.l1[1], k), lerp(s.l0[2], s.l1[2], k)); cam.lookAt(LOOK);
  const sh = typeof s.shake === 'function' ? s.shake(lt) : (s.shake || 0);
  if (sh) { cam.position.x += Math.sin(t * 58) * sh; cam.position.y += Math.cos(t * 44) * sh }
  if (SEAT[w]) SEAT[w].crest.material.emissiveIntensity = .5 + .35 * Math.abs(Math.sin(t * 3));
  const st = stormAt(t);
  if (w === 'dv') { petals.forEach(m => { const u = m.userData; m.position.set(u.x + Math.sin(t * .8 + u.w) * .4, 6 - ((t * u.sp + u.o) % 6.4), u.z); m.rotation.set(t * 2 + u.w, t * 1.3, 0) }); dvDiyas.forEach((f, i) => animFlame(f, t, i * .3, 0)); [dvTemple, ...dvSh].forEach((q, i) => q.fl.rotation.y = Math.sin(t * 3 + i) * .4) }
  else if (w === 'hm') { hmSnow.forEach(m => { const u = m.userData; m.position.set(u.x + Math.sin(t * .8 + u.w) * .3, 7 - ((t * u.sp + u.o) % 7.4), u.z) }); hmFl.forEach((f, i) => animFlame(f, t, i * .4, 0)); herbs.forEach((h, i) => h.material.opacity = .6 + .4 * Math.abs(Math.sin(t * 3 + i))) }
  else if (w === 'sv') {
    const dark = s.storm ? 1 : 0; svSky.material.color.setRGB(lerp(1, .42, dark) + st * .5, lerp(1, .45, dark) + st * .5, lerp(1, .62, dark) + st * .4);
    hemi.intensity = hm[1] * .68 * (s.storm ? .7 : 1) + st * .6; rivTex.offset.y = -t * (s.drain ? 1.6 : .5); rivM.forEach(m => m.material.opacity = s.drain ? .55 : .9);
  }
  else if (w === 'rn') { rnFl.forEach((f, i) => animFlame(f, t, i * .4, 0));
    if (s.on && s.on.includes('beams')) { const u = ease((lt - .2) / 1.6), to = new THREE.Vector3(0, 1.6, .5);
      beamM.forEach((q, i) => { const end = _v.copy(q.from).lerp(to, u); const mid = q.from.clone().add(end).multiplyScalar(.5), len = q.from.distanceTo(end) + .001; q.m.position.copy(mid); q.m.scale.set(1, len, 1); q.m.lookAt(end); q.m.rotateX(Math.PI / 2); q.g.material.opacity = .9 });
      orb.scale.setScalar(.3 + 1.8 * ease((lt - 1.4) / 1.4) + .1 * Math.sin(t * 9)) } }
  else if (w === 'yj') { animFlame(havanF, t, 0, 0); vnSeat.crest.material.emissiveIntensity = .5 + .3 * Math.sin(t * 3) }
  else if (w === 'cs') { earth.rotation.y = t * .03; STEPS.forEach(([x, y, z, ts], i) => { const u = t - ts; stepG[i].material.opacity = u < 0 ? 0 : Math.min(1, u * 4); stepG[i].scale.setScalar(u < 0 ? 0 : 5 + 3 * Math.exp(-u * 4)) }); csStars.forEach((m, i) => m.material.opacity = .5 + .5 * Math.abs(Math.sin(t * 2 + i))) }
  else if (w === 'kl') { klFl.forEach((f, i) => animFlame(f, t, i * .4, 0));
    if (s.on && s.on.includes('eyebeam')) { const from = new THREE.Vector3(-.95, 1.0, .9), to = new THREE.Vector3(1, .8, -.1), u = ease(lt / .45), end = from.clone().lerp(to, u), mid = from.clone().add(end).multiplyScalar(.5); ebeam.position.copy(mid); ebeam.scale.set(1 + .4 * Math.sin(t * 30), from.distanceTo(end) + .001, 1); ebeam.lookAt(end); ebeam.rotateX(Math.PI / 2); ebeam.visible = lt < 1.2 } }
  else if (w === 'nt') { ring.rotation.z = t * .2; ringFl.forEach((f, i) => animFlame(f, t, i * .13, 0)) }
  const cast = typeof s.cast === 'function' ? s.cast(lt, p, t) : (s.cast || []); setCast(cast, t, lt);
  if (s.fx) s.fx(lt, p, t);
  boltSp.forEach(q => q.visible = false);
  BOLTS.forEach((bt, i) => { const u = t - bt[0]; if (u < 0 || u > .22 || bt[1] !== w) return; const q = boltSp[i % 3]; q.visible = true; q.scale.set(bt[4] * .25, bt[4], 1); q.position.set(bt[2], bt[5] + bt[4] / 2, bt[3]); q.material.opacity = (Math.floor(u * 40) % 2 ? .55 : 1) });
  return si;
}
// the engine keys a sprite repaint on these fields; armsN and eye3 must be part of it
const _setCast = setCast;
setCast = function (list, t, lt) { list.forEach(c => { if (c.armsN !== undefined || c.eye3 !== undefined) c.eyes = 'a' + (c.armsN ?? '') + 'e' + Math.round((c.eye3 ?? 0) * 20) }); _setCast(list, t, lt) };

/* ================= HUD (2D): flashes, lotus rank cards, badge + strength meter, stamps, bursts, one-word captions ================= */
const SECT = [[5.6, 5, 'HANUMAN', 'HN', .6], [18.4, 4, 'INDRA', 'IN', .72], [30.56, 3, 'DURGA', 'DG', .86], [45.2, 2, 'VISHNU', 'VN', .94], [58.96, 1, 'SHIVA', 'SV', 1]];
const OUT_T = 70.56, FONT = 'Fredoka, "Trebuchet MS", sans-serif';
const FLASHES = [[14.9, '#fff', .35], [27.52, '#fff', .75], [39.36, '#fff3c8', .7], [43.95, '#ffd0a0', .5], [52.96, '#fff3a0', .5], [62.87, '#ff8a2b', .55], [65.35, '#ffd0a0', .45], [58.15, '#0a0618', .0]];
function flashAt(t) { let col = '#fffbe0', a = 0;
  for (const s of SHOTS) { if (!s.rank) continue; const u = t - s.a; if (u >= 0 && u < .35) { const v = .55 * (1 - u / .35); if (v > a) { a = v; col = GODCOL[SECT[5 - s.rank][3]] } } }
  const st = stormAt(t) * .6; if (st > a) { a = st; col = '#eef2ff' }
  FLASHES.forEach(([ft, c, amp]) => { const u = t - ft; if (u >= 0 && u < .25) { const v = amp * (1 - u / .25); if (v > a) { a = v; col = c } } });
  return [col, a] }
function txt(g, s, x, y, size, fill, o) { o = o || {}; g.save(); g.translate(x, y); if (o.rot) g.rotate(o.rot); if (o.sc) g.scale(o.sc, o.sc); g.globalAlpha *= (o.a === undefined ? 1 : o.a);
  g.font = '700 ' + Math.round(size) + 'px ' + FONT; g.textAlign = o.align || 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.lineWidth = size * (o.sw || .18); g.strokeStyle = o.stroke || '#14102a'; g.strokeText(s, 0, size * .06); g.strokeText(s, 0, 0); g.fillStyle = fill; g.fillText(s, 0, 0); g.restore() }
function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath() }
function capIdx(t) { for (let i = 0; i < WORDS.length; i++) { const q = WORDS[i], n = WORDS[i + 1]; if (t < q.a) return -1; const end = (n && n.a - q.b < .3) ? n.a : q.b + .14; if (t < end) return i } return -1 }
/* a lotus medallion in place of the Norse shield: sixteen petals around a gold boss */
function lotusBadge(g, r, col, spin) { const dk = '#14102a'; g.save(); g.rotate(spin || 0);
  for (let layer = 0; layer < 2; layer++) for (let i = 0; i < 16; i++) { const a = (i + layer * .5) / 16 * 6.283, rr = r * (layer ? .82 : 1); g.save(); g.rotate(a); g.beginPath(); g.moveTo(0, -rr * .35); g.quadraticCurveTo(rr * .22, -rr * .7, 0, -rr); g.quadraticCurveTo(-rr * .22, -rr * .7, 0, -rr * .35); g.closePath(); g.fillStyle = layer ? '#ffffff' : col; g.globalAlpha = layer ? .55 : 1; g.fill(); g.globalAlpha = 1; g.lineWidth = r * .03; g.strokeStyle = dk; g.stroke(); g.restore() }
  g.beginPath(); g.arc(0, 0, r * .55, 0, 7); g.fillStyle = col; g.fill(); g.lineWidth = r * .1; g.strokeStyle = '#ffd34d'; g.stroke(); g.lineWidth = r * .04; g.strokeStyle = dk; g.stroke();
  g.restore() }
/* each god's symbol, used on the badge and in the title */
function symb(g, k, x, y, s, col, lw) { g.save(); g.translate(x, y); g.lineCap = g.lineJoin = 'round'; g.strokeStyle = col; g.fillStyle = col; g.lineWidth = lw || s * .12;
  if (k === 'HN') { g.beginPath(); g.moveTo(0, s * .5); g.lineTo(0, -s * .05); g.stroke(); g.beginPath(); g.arc(0, -s * .25, s * .25, 0, 7); g.stroke() }
  else if (k === 'IN') { g.beginPath(); g.moveTo(s * .12, -s * .5); g.lineTo(-s * .15, 0); g.lineTo(s * .12, 0); g.lineTo(-s * .12, s * .5); g.stroke() }
  else if (k === 'DG' || k === 'SV2') { g.beginPath(); g.moveTo(0, s * .5); g.lineTo(0, -s * .5); g.moveTo(-s * .3, -s * .45); g.quadraticCurveTo(-s * .3, -s * .05, 0, -s * .1); g.quadraticCurveTo(s * .3, -s * .05, s * .3, -s * .45); g.stroke() }
  else if (k === 'VN') { g.beginPath(); g.arc(0, 0, s * .38, 0, 7); g.stroke(); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; g.beginPath(); g.moveTo(Math.cos(a) * s * .12, Math.sin(a) * s * .12); g.lineTo(Math.cos(a) * s * .38, Math.sin(a) * s * .38); g.stroke() } }
  else if (k === 'SV') { g.beginPath(); g.arc(0, 0, s * .38, -1.2, 1.9); g.arc(-s * .1, -s * .05, s * .3, 1.9, -1.2, true); g.closePath(); g.lineWidth = (lw || s * .12) * .6; g.fill(); g.stroke() }
  g.restore() }
function drawHUD(g, t) {
  const si = shotAt(t), s = SHOTS[si], lt = t - s.a; g.save();
  const vg = g.createRadialGradient(W / 2, H / 2, H * .32, W / 2, H / 2, H * .72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(8,6,20,.42)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  const fl = flashAt(t); if (fl[1] > 0) { g.globalAlpha = fl[1]; g.fillStyle = fl[0]; g.fillRect(0, 0, W, H); g.globalAlpha = 1 }
  if (s.title) { const a = clamp(t * 5) * clamp((2.4 - t) * 8); txt(g, 'HINDU GODS', W / 2, H * .125, W * .13, '#fff4e0', { a, sc: 1 + .5 * Math.exp(-t * 10) }); txt(g, 'TOP 5 STRONGEST', W / 2, H * .195, W * .074, '#ffd34d', { a: a * clamp((t - .35) * 6), sc: 1 + .5 * Math.exp(-Math.max(0, t - .35) * 10) });
    LINE.forEach((k, i) => { const u = t - .6 - i * .1; if (u < 0) return; const sz = W * .06 * (1 + .8 * Math.exp(-u * 12)); g.save(); g.globalAlpha = a; symb(g, k, W * (.3 + i * .1), H * .245, sz, '#14102a', W * .016); symb(g, k, W * (.3 + i * .1), H * .245, sz, GODCOL[k], W * .008); g.restore() }) }
  if (s.count) { txt(g, 'TOP 5', W / 2, H * .11, W * .15, '#ffd34d', { sc: 1 + .8 * Math.exp(-lt * 12), rot: -.04 });
    ['HN', 'IN', 'DG', 'VN', 'SV'].forEach((k, i) => { const u = lt - .25 - i * .26; if (u < 0) return; const sc = 1 + 1.2 * Math.exp(-u * 14); g.save(); g.translate(W * (.14 + i * .18), H * .215); g.scale(sc, sc); lotusBadge(g, W * .075, GODCOL[k], Math.sin(t * 3 + i) * .1); g.restore(); txt(g, String(5 - i), W * (.14 + i * .18), H * .217, W * .075, '#fff', { sc }) }) }
  let sec = null; for (const q of SECT) if (t >= q[0] && t < OUT_T) sec = q;
  if (sec && !s.rank || sec && lt > 1.25) { const u = sec === SECT[5 - (s.rank || -9)] ? lt - 1.25 : 9, a = clamp(u * 5), col = GODCOL[sec[3]], x = W * .04, y = H * .085, bh = W * .09;
    g.globalAlpha = a; g.font = '700 ' + Math.round(bh * .6) + 'px ' + FONT; const label = '#' + sec[1] + ' ' + sec[2], bw = g.measureText(label).width + bh * 1.55;
    rrect(g, x, y, bw, bh, bh * .22); g.fillStyle = 'rgba(30,24,50,.9)'; g.fill(); g.lineWidth = W * .008; g.strokeStyle = col; g.stroke();
    g.save(); g.shadowColor = col; g.shadowBlur = W * .015; symb(g, sec[3], x + bh * .5, y + bh * .5, bh * .62, col, bh * .085); g.restore();
    g.fillStyle = '#fff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(label, x + bh * .98, y + bh * .54);
    const my = y + bh * 1.2, sw = W * .034, sh = W * .036, gap = W * .008, n = 10, fillK = sec[4] * ease((t - sec[0] - 1.2) / 1.4) * n;
    for (let i = 0; i < n; i++) { const sx = x + i * (sw + gap); g.beginPath(); g.moveTo(sx + sw * .2, my); g.lineTo(sx + sw, my); g.lineTo(sx + sw * .8, my + sh); g.lineTo(sx, my + sh); g.closePath(); g.fillStyle = i < fillK - .5 ? col : 'rgba(30,24,50,.85)'; g.fill(); g.lineWidth = W * .004; g.strokeStyle = '#fff'; g.stroke() }
    g.font = '700 ' + Math.round(W * .03) + 'px ' + FONT; g.fillStyle = '#fff'; g.fillText('STRENGTH', x + n * (sw + gap) + W * .012, my + sh * .55); g.globalAlpha = 1 }
  if (s.rank && lt < 1.35) { const a = clamp(lt * 10) * clamp((1.35 - lt) * 6), sc = 1 + 2.2 * Math.exp(-lt * 13), k = SECT[5 - s.rank][3], col = GODCOL[k];
    g.save(); g.globalAlpha = a; g.translate(W / 2, H * .2); g.scale(sc, sc); lotusBadge(g, W * .2, col, -.4 + lt * .5); g.restore();
    txt(g, '#' + s.rank, W / 2, H * .2, W * .2, '#fff', { a, sc, rot: -.06, sw: .16 }); g.save(); g.globalAlpha = a; symb(g, k, W * .5, H * .31, W * .07, '#14102a', W * .022); symb(g, k, W * .5, H * .31, W * .07, col, W * .011); g.restore() }
  if (s.crown) { const a = clamp(lt * 6); txt(g, '#1', W / 2, H * .16, W * .26, '#ffd34d', { a, sc: 1 + 1.5 * Math.exp(-lt * 12) + .04 * Math.sin(t * 6), rot: -.05, sw: .14 }); txt(g, 'STRONGEST', W / 2, H * .25, W * .085, '#fff', { a: clamp((lt - .4) * 6) }) }
  if (s.stamp && lt >= s.stamp[0]) { const u = lt - s.stamp[0], sc = 1 + 2.4 * Math.exp(-u * 14), sc2 = s.stamp[2] || '#ff5a4d'; g.save(); g.translate(W * .5, H * .24); g.rotate(-.1); g.scale(sc, sc); const fs = W * (s.stamp[1].length > 10 ? .085 : .11); g.font = '700 ' + Math.round(fs) + 'px ' + FONT;
    const bw = g.measureText(s.stamp[1]).width + fs * .8; rrect(g, -bw / 2, -fs * .75, bw, fs * 1.5, fs * .2); g.fillStyle = 'rgba(20,16,42,.85)'; g.fill(); g.lineWidth = fs * .1; g.strokeStyle = sc2; g.stroke();
    g.fillStyle = sc2; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s.stamp[1], 0, fs * .05); g.restore() }
  if (s.burst && lt >= s.burst[0] && lt < s.burst[0] + .75) { const u = lt - s.burst[0], n = s.burst[1].length, sc = (1 + 1.2 * Math.exp(-u * 16)) * W * (n > 6 ? .25 : .2), a = clamp((.75 - u) * 6); g.save(); g.globalAlpha = a; g.translate(W * s.burst[2], H * s.burst[3]); g.rotate(.14);
    g.beginPath(); for (let i = 0; i < 24; i++) { const r = (i % 2 ? .72 : 1.15) * sc, b = i / 24 * 6.283; g.lineTo(Math.cos(b) * r, Math.sin(b) * r * .8) } g.closePath(); g.fillStyle = s.burst[4] || '#ffe45c'; g.fill(); g.lineWidth = sc * .07; g.lineJoin = 'round'; g.strokeStyle = '#14102a'; g.stroke();
    g.restore(); txt(g, s.burst[1], W * s.burst[2], H * s.burst[3], sc * (n > 6 ? .3 : n > 5 ? .4 : .55), '#ff3b2f', { a, rot: .14 }) }
  if (s.quest) s.quest.forEach(([qx, qy, qt], i) => { const u = lt - qt; if (u >= 0) txt(g, '?', W * qx, H * qy + Math.sin(t * 6 + i) * H * .008, W * .22, i ? '#6ec6ff' : '#ffd34d', { sc: 1 + 1.2 * Math.exp(-u * 12), rot: (i ? .2 : -.2) }) });
  if (s.bubbles) [[.5, .26, 71.92, 'SV'], [.7, .31, 72.56, 'VN'], [.86, .24, 73.52, 'DG']].forEach(([bx, by, bt, k], i) => { const u = t - bt; if (u < 0) return; const sc = (1 + .6 * Math.exp(-u * 12)) * W * .1, x = W * bx, y = H * by + Math.sin(t * 3 + i) * H * .006;
    g.save(); g.translate(x, y); g.fillStyle = '#fff'; g.strokeStyle = '#14102a'; g.lineWidth = sc * .09; g.lineJoin = 'round'; g.beginPath(); g.moveTo(-sc * .3, sc * .5); g.lineTo(-sc * .5, sc * .95); g.lineTo(0, sc * .55); g.closePath(); g.fill(); g.stroke();
    rrect(g, -sc, -sc * .62, sc * 2, sc * 1.24, sc * .4); g.fill(); g.stroke(); symb(g, k, -sc * .5, 0, sc * .7, GODCOL[k], sc * .11); g.font = '700 ' + Math.round(sc * .62) + 'px ' + FONT; g.fillStyle = '#14102a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('#1', sc * .3, sc * .05); g.restore() });
  if (s.end) { const u = lt - .12;
    if (u >= 0) { const sc = (1 + .8 * Math.exp(-u * 12)) * (1 + .04 * Math.sin(t * 9)), bw = W * .62, bh = W * .15; g.save(); g.translate(W * .5, H * .13); g.scale(sc, sc);
      rrect(g, -bw / 2, -bh / 2, bw, bh, bh * .28); g.fillStyle = '#e62117'; g.fill(); g.lineWidth = W * .014; g.strokeStyle = '#14102a'; g.stroke();
      g.font = '700 ' + Math.round(bh * .56) + 'px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText('COMMENT', 0, bh * .04); g.restore() }
    [.22, .5, .78].forEach((ax, i) => { const y = H * .885 + Math.abs(Math.sin(t * 7 + i * .7)) * H * .02, sz = W * .07; g.save(); g.translate(W * ax, y); g.fillStyle = '#ffd34d'; g.strokeStyle = '#14102a'; g.lineWidth = sz * .16; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(-sz * .35, -sz); g.lineTo(sz * .35, -sz); g.lineTo(sz * .35, 0); g.lineTo(sz * .8, 0); g.lineTo(0, sz); g.lineTo(-sz * .8, 0); g.lineTo(-sz * .35, 0); g.closePath(); g.stroke(); g.fill(); g.restore() }) }
  const ci = capIdx(t);
  if (ci >= 0) { const q = WORDS[ci], word = q.w.toUpperCase(); let fs = W * .135; g.font = '700 ' + Math.round(fs) + 'px ' + FONT; const mw = g.measureText(word).width; if (mw > W * .88) fs *= W * .88 / mw;
    txt(g, word, W / 2, H * .79, fs, q.k ? '#ffd34d' : '#fff', { sc: 1 + .3 * Math.exp(-(t - q.a) * 22) }) }
  g.restore();
}

/* ---------- sound cues for mix.py (exported by events.mjs) ---------- */
const EV = [];
{ const e = (t, type, o = {}) => EV.push({ t, type, ...o });
  let lastW = '';
  SHOTS.forEach(s => { e(s.a, s.w !== lastW ? 'whoosh' : 'tick'); lastW = s.w; if (s.rank) e(s.a, 'gong', { rank: s.rank }); if (s.stamp) e(s.a + s.stamp[0], 'stamp'); if (s.burst) e(s.a + s.burst[0], 'pow') });
  e(.6, 'sparkle'); for (let i = 0; i < 5; i++) e(2.65 + i * .26, 'pop', { i });
  e(9.68, 'fly'); e(11.68, 'chime'); e(14.85, 'rumble'); e(16.52, 'fly');
  e(21.92, 'hiss'); e(23.7, 'gulp'); e(25.4, 'thunderFar'); e(26.1, 'thunderFar'); e(27.52, 'thunder'); e(28.48, 'water');
  e(32.48, 'roar'); e(36.88, 'swell'); e(39.36, 'fanfare'); for (let i = 0; i < 8; i++) e(40.32 + .14 * (i + 1), 'ring', { i }); e(42.95, 'lion'); e(43.95, 'thud');
  e(47.55, 'sparkle'); e(52.96, 'rise'); [55.76, 56.64, 57.6].forEach(t => e(t, 'stride'));
  e(62.87, 'eye'); e(64.4, 'beam'); e(65.35, 'poof'); e(66.8, 'tamtam'); for (let i = 0; i < 10; i++) e(68.88 + i * .42, 'damaru', { i });
  [71.92, 72.56, 73.52].forEach(t => e(t, 'pop')); e(76.88, 'fanfare');
  EV.sort((a, b) => a.t - b.t); }

/* ---------- the look: cel-shaded sets with ink outlines, depth of field, glow and grade ---------- */
const TOON = new THREE.DataTexture(new Uint8Array([88, 150, 205]), 3, 1, THREE.LuminanceFormat);
TOON.minFilter = TOON.magFilter = THREE.NearestFilter; TOON.needsUpdate = true;
const INKM = new THREE.MeshBasicMaterial({ color: 0x1d1830, side: THREE.BackSide });
{ const conv = new Map(), poolSp = new Set(POOL.map(p => p.sp));
  const big = m => { m.geometry.computeBoundingSphere(); return m.geometry.boundingSphere.radius };
  scene.traverse(o => {
    if (!o.isMesh || o.userData.ink) return;
    const m = o.material; if (!(m.isMeshLambertMaterial || m.isMeshPhongMaterial)) return;
    if (!conv.has(m)) conv.set(m, new THREE.MeshToonMaterial({ color: m.color, map: m.map, gradientMap: TOON, emissive: m.emissive || new THREE.Color(0), emissiveIntensity: m.emissiveIntensity ?? 1, transparent: m.transparent, opacity: m.opacity, side: m.side }));
    o.material = conv.get(m);
    const r = big(o); if (r > 6 || m.transparent || m.side === THREE.DoubleSide || o.geometry.type === 'PlaneGeometry' || o.geometry.type === 'CircleGeometry') return;
    const ink = new THREE.Mesh(o.geometry, INKM); ink.userData.ink = 1; ink.scale.setScalar(1 + .045 / Math.max(r, .05) * Math.min(1, r * 2 + .3)); o.add(ink);
  }) }
const WORLDS = Object.values(WORLDG);
sunL.intensity = .55; rimL.intensity = .3;
const bloomC = document.createElement('canvas'); bloomC.width = W / 4; bloomC.height = H / 4; const bloomX = bloomC.getContext('2d');
function composite(g, t) {
  // depth of field: on close and medium shots the set renders blurred, then the cast renders sharp on top
  const d = cam.position.distanceTo(LOOK), blur = clamp((5.6 - d) * 1.3, 0, 5);
  g.save(); g.filter = 'saturate(1.12) contrast(1.06)' + (blur > .3 ? ` blur(${blur.toFixed(2)}px)` : '');
  if (blur > .3) POOL.forEach(p => { p.vis = p.sp.visible; p.sp.visible = false });
  renderer.render(scene, cam); g.drawImage(glc, 0, 0, W, H);
  if (blur > .3) {
    const vis = WORLDS.map(w => w.visible), bolts = boltSp.map(b => b.visible);
    WORLDS.forEach(w => w.visible = false); boltSp.forEach(b => b.visible = false); POOL.forEach(p => p.sp.visible = p.vis);
    renderer.setClearColor(0x000000, 0); renderer.render(scene, cam);
    WORLDS.forEach((w, i) => w.visible = vis[i]); boltSp.forEach((b, i) => b.visible = bolts[i]);
    g.filter = 'saturate(1.12) contrast(1.06)'; g.drawImage(glc, 0, 0, W, H);
  }
  g.restore();
  // glow: the brightest parts, blurred at quarter size and screened back over the frame
  bloomX.filter = 'brightness(.55) contrast(4) blur(6px)'; bloomX.clearRect(0, 0, W / 4, H / 4); bloomX.drawImage(g.canvas, 0, 0, W / 4, H / 4);
  g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = .24; g.drawImage(bloomC, 0, 0, W, H); g.restore();
}

/* ---------- Lemo-Opuscar page contract ---------- */
const cv = document.getElementById('cv'), ctx2 = cv.getContext('2d');
window.DUR = DUR; window.EV = EV;
window.render = t => { update(t); composite(ctx2, t); drawHUD(ctx2, t) };
window.TEXTS = t => { const i = capIdx(t); return i < 0 ? [] : [{ id: 'w' + i, text: WORDS[i].w, x0: 60, x1: W - 60, y0: H * .74, y1: H * .84, pass: true }] };
document.fonts.load('700 40px Fredoka').then(() => { LABELS.forEach(r => r()); window.READY = true });
