import { makeBubble } from './_drake.js';
// What if every "I love to travel" dating bio was true? One blocky guy per beat, one visual gag per beat, big label via hud.pop.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, beach, mat, Crowd, clamp, smooth, lerp, attach } = lib;
  const CZ = 20;
  const SK = [0xe7b48f, 0x8d5a3b];
  const easeBack = (u) => { u = clamp(u); const c1 = 1.9; return 1 + (c1 + 1) * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
  const FONT = 'Liberation Sans, Arial';

  // ---------- generic helpers
  const mkTex = (w, h, draw) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { t, cv, g }; };
  const panel = (S, w, h, cw, ch, draw, o = {}) => { const T = mkTex(cw, ch, draw); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: T.t, transparent: o.tr !== false, side: THREE.DoubleSide, depthWrite: o.dw !== false })); if (o.ro) m.renderOrder = o.ro; if (!o.bb) m.geometry.rotateY(Math.PI); S.add(m); return { m, ...T }; };
  const bx = (S, w, h, d, c, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c, o.m)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; S.add(m); return m; };
  const cyl = (S, r1, r2, h, c, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, o.seg || 8), mat(c, o.m)); m.position.set(x, y, z); m.castShadow = true; S.add(m); return m; };
  const txt = (g, s, x, y, size, fill, stroke, align = 'center', wt = 900) => { g.font = wt + ' ' + size + 'px ' + FONT; g.textAlign = align; if (stroke) { g.strokeStyle = stroke; g.lineWidth = size * .14; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = fill; g.fillText(s, x, y); };
  const planeIcon = (g, x, y, s, c) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = c; g.beginPath(); g.ellipse(0, 0, 60, 13, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(-6, -4); g.lineTo(-28, -50); g.lineTo(-12, -50); g.lineTo(22, -4); g.fill(); g.beginPath(); g.moveTo(-6, 4); g.lineTo(-28, 50); g.lineTo(-12, 50); g.lineTo(22, 4); g.fill(); g.beginPath(); g.moveTo(-52, -2); g.lineTo(-66, -26); g.lineTo(-52, -26); g.lineTo(-36, -2); g.fill(); g.restore(); };
  const globeIcon = (g, x, y, r) => { g.fillStyle = '#2f86e0'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip(); g.fillStyle = '#4cb868'; g.beginPath(); g.ellipse(x - r * .3, y - r * .25, r * .42, r * .3, .4, 0, 7); g.fill(); g.beginPath(); g.ellipse(x + r * .35, y + r * .3, r * .3, r * .38, -.3, 0, 7); g.fill(); g.restore(); g.strokeStyle = '#16181d'; g.lineWidth = r * .1; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); };
  const suitcase = (S, color, k = 1, flags = true) => {
    const g = new THREE.Group(); const inn = new THREE.Group(); inn.scale.setScalar(k); g.add(inn);
    const add = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; inn.add(o); return o; };
    add(new lib.RoundedBoxGeometry(.72, .95, .36, 3, .07), mat(color, { roughness: .45 }), 0, .6, 0);
    add(new THREE.BoxGeometry(.06, .96, .38), mat(0x16181d), -.2, .6, 0); add(new THREE.BoxGeometry(.06, .96, .38), mat(0x16181d), .2, .6, 0);
    add(new THREE.BoxGeometry(.05, .3, .05), mat(0x222222), -.2, 1.22, 0); add(new THREE.BoxGeometry(.05, .3, .05), mat(0x222222), .2, 1.22, 0); add(new THREE.BoxGeometry(.5, .06, .09), mat(0x222222), 0, 1.38, 0);
    add(new THREE.CylinderGeometry(.06, .06, .06, 8).rotateZ(Math.PI / 2), mat(0x111111), -.22, .06, 0); add(new THREE.CylinderGeometry(.06, .06, .06, 8).rotateZ(Math.PI / 2), mat(0x111111), .22, .06, 0);
    if (flags) { const T = mkTex(128, 192, (c, w, h) => { const cols = ['#ffd92a', '#ff3b6b', '#4cd9a0', '#5b8cff', '#fff', '#ff9a3c']; for (let i = 0; i < 7; i++) { c.save(); c.translate(24 + (i % 2) * 72, 26 + i * 24); c.rotate((i - 3) * .12); c.fillStyle = cols[i % 6]; c.fillRect(-18, -12, 40, 24); c.restore(); } }); const st = new THREE.Mesh(new THREE.PlaneGeometry(.5, .75), new THREE.MeshBasicMaterial({ map: T.t, transparent: true })); st.position.set(0, .6, -.185); st.rotation.y = Math.PI; inn.add(st); }
    S.add(g); return g;
  };
  const palm = (S, x, z, tilt = 0) => {
    const g = new THREE.Group(); g.position.set(x, 0, z);
    for (let i = 0; i < 7; i++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(.2 - i * .012, .23 - i * .012, .8, 7), mat(0x8a6238)); m.position.set(tilt * i * i * .02, .4 + i * .78, 0); m.rotation.z = -tilt * i * .035; m.castShadow = true; g.add(m); }
    const top = new THREE.Group(); top.position.set(tilt * 49 * .02, 5.9, 0); g.add(top);
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; const fr = new THREE.Mesh(new THREE.BoxGeometry(2.4, .07, .7), mat(0x2f9a4a, { roughness: .7 })); fr.position.set(Math.cos(a) * 1.15, -.15, Math.sin(a) * 1.15); fr.rotation.y = -a; fr.rotation.z = -.35; fr.castShadow = true; top.add(fr); }
    for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(new THREE.SphereGeometry(.2, 8, 6), mat(0x6a4a22)); c.position.set((k - 1) * .22, -.35, .1 * (k - 1)); top.add(c); }
    S.add(g); return g;
  };
  const dressP = (crowd, i, shirt, pants, skin, hair) => { const col = (k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; }; ['torso', 'armL', 'armR'].forEach((k) => col(k, shirt)); ['legL', 'legR'].forEach((k) => col(k, pants)); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(k, skin)); col('hair', hair); };
  const world = (o = {}) => {
    const st = makeStage(Object.assign({ shadowExtent: 30, fogNear: 110, fogFar: 460, sunDir: [-.5, .8, -.3], sunI: 2.8 }, o)); const S = st.scene;
    return { st, S, bb: [], extra: [] };
  };
  const crowdFor = (w, n = 4) => { const crowd = new Crowd(w.S, n, 21); w.crowd = crowd; w.P = crowd.p; w.P.forEach((p) => { p.h = 1; }); dressP(crowd, 0, 0xe8742a, 0x2f3a52, SK[0], 0x2a1d12); dressP(crowd, 1, 0x1d2f5a, 0x14203a, SK[1], 0x101010); dressP(crowd, 2, 0x6a3f9a, 0x3a3a46, 0xf0c7a4, 0x4a2c18); dressP(crowd, 3, 0x2f8f6a, 0x4a4036, SK[1], 0x15100c); };
  const place = (w, i, x, z, yaw, anim = 'idle', o = {}) => { const p = w.P[i]; p.x = x; p.z = z; p.yaw = yaw; p.anim = anim; p.y = o.y || 0; p.speed = o.sp ?? 1; p.scale = o.sc ?? 1; p.vis = true; p.pitch = o.pitch || 0; p.sitPitch = o.sitPitch || 0; p.arms = o.arms || null; p.extra = o.extra || 0; p.phase = o.ph ?? p.phase; };
  const reset = (w) => { w.P.forEach((o) => { o.vis = false; o.arms = null; o.pitch = 0; o.sitPitch = 0; o.extra = 0; }); w.bb.forEach((m) => (m.visible = false)); };
  const interior = (S, sign1, sub) => {
    bx(S, 90, .4, 50, 0xc9ced6, 0, -.2, CZ + 8, { m: { roughness: .3, metalness: .15 }, cast: false });
    bx(S, 90, 14, .5, 0xe9e5dc, 0, 7, CZ + 8, { cast: false });
    bx(S, 90, 1.2, .52, 0x2b3a55, 0, .6, CZ + 8, { cast: false });
    const win = panel(S, 11, 3.6, 880, 288, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#6ab6f0'); gr.addColorStop(1, '#cfe8fa'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#8a929c'; g.fillRect(0, 210, w, 78); planeIcon(g, 560, 150, 2.2, '#f4f4f4'); planeIcon(g, 220, 200, 1.1, '#d8dde4'); g.strokeStyle = '#3a4252'; g.lineWidth = 14; g.strokeRect(0, 0, w, h); g.lineWidth = 8; g.beginPath(); g.moveTo(w / 3, 0); g.lineTo(w / 3, h); g.moveTo(2 * w / 3, 0); g.lineTo(2 * w / 3, h); g.stroke(); });
    win.m.position.set(-.5, 3.4, CZ + 7.7);
    const sg = panel(S, 6.4, 1.35, 768, 162, (g, w, h) => { g.fillStyle = '#ffcf1f'; g.beginPath(); g.roundRect(4, 4, w - 8, h - 8, 22); g.fill(); g.strokeStyle = '#16181d'; g.lineWidth = 8; g.stroke(); g.fillStyle = '#16181d'; g.beginPath(); g.arc(90, h / 2, 54, 0, 7); g.fill(); txt(g, sub, 90, h / 2 + 30, 86, '#ffcf1f'); txt(g, sign1, 440, h / 2 + 26, 74, '#16181d'); }, { tr: false });
    sg.m.position.set(.6, 6.1, CZ + 7.6); bx(S, .08, 1.6, .08, 0x333333, -2, 7.2, CZ + 7.6, { cast: false }); bx(S, .08, 1.6, .08, 0x333333, 3.2, 7.2, CZ + 7.6, { cast: false });
    for (let i = 0; i < 4; i++) { const x = 3.4 - i * 1.0; bx(S, .9, .12, .8, 0x2f6fd8, x, .55, CZ + 4.5); bx(S, .9, .8, .12, 0x2f6fd8, x, 1.0, CZ + 4.9); bx(S, .08, .55, .08, 0x666a72, x, .27, CZ + 4.5); }
    return { win, sg };
  };

  // ======================================================== WORLD 0: street
  const W0 = world(); { const city = buildStreet(W0.S, { seed: 7 }); city.cars.forEach((c) => (c.m.visible = false)); city.crowd.p.forEach((o) => (o.vis = false)); city.crowd.update(0); W0.city = city; }
  crowdFor(W0);
  const card = (() => { const T = mkTex(640, 900, (g) => {
    g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 28; g.shadowOffsetY = 10; g.fillStyle = '#fbfbfd'; g.beginPath(); g.roundRect(40, 30, 560, 840, 54); g.fill(); g.shadowColor = 'transparent';
    g.save(); g.beginPath(); g.roundRect(40, 30, 560, 840, 54); g.clip(); const gr = g.createLinearGradient(0, 30, 640, 300); gr.addColorStop(0, '#5bb8ff'); gr.addColorStop(1, '#ffffff'); g.fillStyle = gr; g.fillRect(40, 30, 560, 250); g.restore();
    g.fillStyle = '#e8742a'; g.beginPath(); g.roundRect(215, 205, 210, 130, [60, 60, 0, 0]); g.fill(); g.fillStyle = '#e9c3a2'; g.beginPath(); g.arc(320, 150, 70, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 10; g.beginPath(); g.arc(320, 150, 74, 0, 7); g.stroke();
    txt(g, 'Tyler, 29', 320, 400, 60, '#16181d', null, 'center', 800); txt(g, 'ABOUT ME', 320, 440, 26, '#d33a5a', null, 'center', 700);
    txt(g, '“I love', 320, 530, 78, '#16181d', null, 'center', 900); txt(g, 'to travel”', 320, 612, 78, '#16181d', null, 'center', 900);
    planeIcon(g, 215, 700, 1.1, '#2f86e0'); globeIcon(g, 420, 700, 46);
    g.fillStyle = '#ff3b6b'; g.beginPath(); g.arc(320, 800, 48, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(320, 826); g.bezierCurveTo(276, 796, 285, 764, 306, 768); g.bezierCurveTo(314, 770, 320, 777, 320, 781); g.bezierCurveTo(320, 777, 326, 770, 334, 768); g.bezierCurveTo(355, 764, 364, 796, 320, 826); g.fill();
  }); const m = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.39), new THREE.MeshBasicMaterial({ map: T.t, transparent: true, depthWrite: false })); m.renderOrder = 5; W0.S.add(m); W0.bb.push(m); return m; })();
  const case0 = suitcase(W0.S, 0xd8423c, 1.15);
  const jet = new THREE.Group(); { const wm = mat(0xf4f4f6, { roughness: .4 }); const f = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, 7, 10).rotateZ(Math.PI / 2), wm); jet.add(f); const nose = new THREE.Mesh(new THREE.ConeGeometry(.5, 1.2, 10).rotateZ(-Math.PI / 2), wm); nose.position.x = 4.1; jet.add(nose); const wing = new THREE.Mesh(new THREE.BoxGeometry(1.4, .1, 7.6), wm); wing.position.set(.4, 0, 0); jet.add(wing); const tail = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.6, .1), mat(0x2f86e0)); tail.position.set(-3.2, .9, 0); jet.add(tail); const tw = new THREE.Mesh(new THREE.BoxGeometry(.8, .1, 2.4), wm); tw.position.set(-3.2, .2, 0); jet.add(tw); const trail = new THREE.Mesh(new THREE.BoxGeometry(22, .35, .35), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .55 })); trail.position.x = -14.5; jet.add(trail); jet.scale.setScalar(3.2); W0.S.add(jet); }

  // ======================================================== WORLD 1: Cancun beach
  const W1 = world({ fog: 0xcfe9f8, fogNear: 120, fogFar: 520 }); const bch = beach(W1.S, { shoreZ: 44, gulls: 5, boats: 2, dress: .5, seed: 4 }); crowdFor(W1);
  const palms = [palm(W1.S, 3.3, CZ + 2.6, .5), palm(W1.S, -3.3, CZ + 2.6, -.5)];
  const post = bx(W1.S, .2, 2.4, .2, 0x7a5430, -2.0, 1.2, CZ + 3.5);
  const cancunSign = panel(W1.S, 3.4, 1.4, 680, 280, (g, w, h) => { g.fillStyle = '#e8b04a'; g.beginPath(); g.roundRect(6, 6, w - 12, h - 12, 24); g.fill(); g.strokeStyle = '#6a431c'; g.lineWidth = 14; g.stroke(); g.fillStyle = 'rgba(106,67,28,.25)'; for (let i = 0; i < 5; i++) g.fillRect(14, 40 + i * 48, w - 28, 5); txt(g, 'CANCUN', w / 2, 140, 120, '#fff', '#6a431c'); txt(g, 'x2', w / 2, 240, 110, '#e0211f', '#fff'); }, { tr: false });
  cancunSign.m.position.set(-2.0, 2.9, CZ + 3.4);
  const case1 = suitcase(W1.S, 0xd8423c, 1.0);
  const shades = [bx(W1.S, .5, .1, .06, 0x050507, 0, 0, 0), bx(W1.S, .5, .06, .05, 0x050507, 0, 0, 0)]; shades.forEach((m) => { m.matrixAutoUpdate = false; });
  const stampT = (n) => (g, w, h) => { g.clearRect(0, 0, w, h); g.save(); g.translate(w / 2, h / 2); g.rotate(-.18); g.strokeStyle = '#d02a2a'; g.fillStyle = 'rgba(255,248,236,.92)'; g.lineWidth = 12; g.beginPath(); g.arc(0, 0, 170, 0, 7); g.fill(); g.stroke(); g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 146, 0, 7); g.stroke(); txt(g, 'CANCUN', 0, -30, 70, '#d02a2a'); txt(g, 'TRIP ' + n, 0, 70, 82, '#d02a2a'); planeIcon(g, 0, 120, .45, '#d02a2a'); g.restore(); };
  const stamp = panel(W1.S, 2.1, 2.1, 400, 400, stampT(1), { ro: 6, bb: true }); W1.bb.push(stamp.m); let stampN = 0;
  const tripsPanel = panel(W1.S, 2.2, .8, 440, 160, (g, w, h) => { g.fillStyle = '#16181d'; g.beginPath(); g.roundRect(4, 4, w - 8, h - 8, 26); g.fill(); txt(g, 'PASSPORT STAMPS', w / 2, 46, 36, '#ffd92a'); txt(g, '0', w / 2, 130, 88, '#fff'); }, { ro: 6, bb: true }); W1.bb.push(tripsPanel.m); let tripsN = -1;
  const drawTrips = (n) => { const g = tripsPanel.g; g.clearRect(0, 0, 440, 160); g.fillStyle = '#16181d'; g.beginPath(); g.roundRect(4, 4, 432, 152, 26); g.fill(); txt(g, 'PASSPORT STAMPS', 220, 46, 36, '#ffd92a'); txt(g, String(n), 220, 130, 88, '#fff'); tripsPanel.t.needsUpdate = true; };

  // ======================================================== WORLD 2: airport terminal B
  const W2 = world({ fog: 0xe9e5dc, fogNear: 60, fogFar: 200, sunI: 2.2 }); crowdFor(W2, 4);
  const air = interior(W2.S, 'TERMINAL B →', 'B');
  const case2 = suitcase(W2.S, 0xd8423c, 1.15);
  const board = panel(W2.S, 4.6, 2.8, 552, 336, () => {}, { tr: false }); board.m.position.set(-3.6, 3.7, CZ + 7.65); let boardKey = '';
  const drawBoard = (k) => { const g = board.g; g.fillStyle = '#0c1a33'; g.fillRect(0, 0, 552, 336); txt(g, 'DEPARTURES', 24, 46, 40, '#ffd92a', null, 'left'); const rows = [['AA 214', 'CANCUN', 'DELAYED'], ['UA 88', 'PARIS', 'DELAYED'], ['DL 301', 'TOKYO', 'DELAYED'], ['BA 17', 'LONDON', 'CANCELLED'], ['AA 590', 'CANCUN', 'DELAYED'], ['NK 6', 'ORLANDO', 'DELAYED']]; rows.forEach((r, i) => { const y = 100 + i * 42; g.fillStyle = i % 2 ? '#0f2142' : '#0c1a33'; g.fillRect(0, y - 30, 552, 42); txt(g, r[0], 24, y, 28, '#fff', null, 'left', 700); txt(g, r[1], 190, y, 28, '#9ad0ff', null, 'left', 700); const on = (Math.floor(k) + i) % 2 === 0 || r[2] === 'CANCELLED'; txt(g, r[2], 530, y, 28, on ? '#ff4a4a' : '#7a2a2a', null, 'right', 900); }); board.t.needsUpdate = true; };
  const zz = [0, 1, 2].map(() => { const p = panel(W2.S, .7, .7, 128, 128, (g) => { txt(g, 'Z', 64, 100, 100, '#fff', '#111'); }, { bb: true }); W2.bb.push(p.m); return p; });

  // ======================================================== WORLD 3: security / passport
  const W3 = world({ fog: 0xe9e5dc, fogNear: 60, fogFar: 200, sunI: 2.2 }); crowdFor(W3, 4);
  interior(W3.S, 'SECURITY', 'S');
  bx(W3.S, 9, 1.0, 1.2, 0x3a4252, 0, .5, CZ + 1.5); bx(W3.S, 9.2, .1, 1.4, 0xb8bec9, 0, 1.05, CZ + 1.5, { m: { metalness: .4, roughness: .3 } });
  const ppT = mkTex(760, 520, (g, w, h) => { g.fillStyle = '#12285a'; g.beginPath(); g.roundRect(0, 0, w, h, 30); g.fill(); g.fillStyle = '#f4ecd2'; g.beginPath(); g.roundRect(18, 18, w / 2 - 24, h - 36, 14); g.fill(); g.beginPath(); g.roundRect(w / 2 + 6, 18, w / 2 - 24, h - 36, 14); g.fill(); g.fillStyle = '#d8d0b4'; g.fillRect(w / 2 - 4, 18, 8, h - 36);
    txt(g, 'PASSPORT', w * .25, 70, 44, '#12285a'); g.fillStyle = '#9ac4e8'; g.fillRect(52, 100, 150, 190); g.fillStyle = '#e9c3a2'; g.beginPath(); g.arc(127, 175, 42, 0, 7); g.fill(); g.fillStyle = '#e8742a'; g.fillRect(77, 220, 100, 70); g.fillStyle = '#2a1d12'; g.beginPath(); g.arc(127, 160, 42, Math.PI, 0); g.fill();
    g.fillStyle = '#12285a'; [[230, 120], [230, 160], [230, 200]].forEach(([x, y]) => g.fillRect(x, y, 100, 8)); txt(g, 'TYLER', 56, 345, 36, '#12285a', null, 'left', 800); txt(g, 'TRAVELER', 56, 390, 36, '#12285a', null, 'left', 800);
    txt(g, 'EXPIRES', w * .75, 100, 34, '#6a6450', null, 'center', 800); txt(g, '03 MAR 2019', w * .75, 160, 46, '#12285a'); txt(g, 'ISSUED 2009', w * .75, 230, 30, '#6a6450', null, 'center', 800);
    g.fillStyle = '#12285a'; for (let i = 0; i < 4; i++) g.fillRect(w / 2 + 40, 300 + i * 30, 270 + (i % 2) * 40, 8); g.fillRect(w / 2 + 40, 430, 280, 10); });
  const passport = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.6).rotateY(Math.PI), new THREE.MeshBasicMaterial({ map: ppT.t, side: THREE.DoubleSide })); W3.S.add(passport);
  const expT = panel(W3.S, 3.9, 1.3, 760, 250, (g, w, h) => { g.save(); g.translate(w / 2, h / 2); g.rotate(-.22); g.strokeStyle = '#e0211f'; g.lineWidth = 16; g.strokeRect(-330, -85, 660, 170); g.lineWidth = 5; g.strokeRect(-318, -73, 636, 146); txt(g, 'EXPIRED', 0, 52, 150, '#e0211f'); g.restore(); }, { ro: 7 });
  const stampTool = bx(W3.S, .26, .5, .26, 0x6a431c, 0, 0, 0); stampTool.matrixAutoUpdate = false; const stampBase = bx(W3.S, .4, .12, .4, 0x2a1d12, 0, 0, 0); stampBase.matrixAutoUpdate = false;
  const cap = [bx(W3.S, .52, .16, .52, 0x14203a, 0, 0, 0), bx(W3.S, .52, .04, .26, 0x0a0f1c, 0, 0, 0)]; cap.forEach((m) => { m.matrixAutoUpdate = false; });
  const badge = bx(W3.S, .14, .16, .03, 0xffd23a, 0, 0, 0); badge.matrixAutoUpdate = false;
  const bubs3 = [makeBubble(lib, W3.S, 1.5, .55)];

  // ======================================================== WORLD 4: jungle monkey
  const W4 = world({ fog: 0x2d6a3c, fogNear: 14, fogFar: 56, sunI: 2.6, sunColor: 0xfff0b8, skyTop: 0x3a8a4a, skyMid: 0x6aa86a, skyBot: 0x9ac89a, hemiSky: 0xb8e8c0, hemiGround: 0x2a5a30 }); crowdFor(W4, 4);
  bx(W4.S, 120, .4, 80, 0x3f8a40, 0, -.2, CZ + 10, { cast: false });
  { const r = (a) => { const v = Math.sin(a * 12.9898) * 43758.5453; return v - Math.floor(v); };
    for (let i = 0; i < 34; i++) { const x = (r(i) - .5) * 26, z = CZ + 3.5 + r(i + 40) * 14; if (Math.abs(x) < 2.2 && z < CZ + 8) continue; const h = 7 + r(i + 80) * 7; cyl(W4.S, .25 + r(i) * .1, .35 + r(i) * .1, h, 0x6a4a28, x, h / 2, z, { seg: 6 }); for (let k = 0; k < 3; k++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8 + r(i + k) * 1.2, 1), mat([0x1f7a3a, 0x2f9a4a, 0x2a8a3a][k], { roughness: .8, flatShading: true })); m.position.set(x + (k - 1) * 1.1, h + k * .5 - .5, z + (r(i + k * 7) - .5) * 1.5); m.castShadow = true; W4.S.add(m); } }
    for (let i = 0; i < 14; i++) { const x = (r(i + 120) - .5) * 14, z = CZ + 2 + r(i + 160) * 6; const l = 3 + r(i + 200) * 3; cyl(W4.S, .04, .04, l, 0x2a6a30, x, 8 - l / 2, z); }
    for (let i = 0; i < 16; i++) { const x = (r(i + 240) - .5) * 12, z = CZ + 2.5 + r(i + 280) * 5; const m = new THREE.Mesh(new THREE.IcosahedronGeometry(.35 + r(i + 300) * .5, 0), mat(0xff6aa0 + 0 * i, { flatShading: true })); m.material.color.setHex(i % 2 ? 0xff5a8a : 0xffd23a); m.position.set(x, .35, z); m.scale.y = .6; W4.S.add(m); } }
  const phone4 = bx(W4.S, .26, .46, .04, 0x15181f, 0, 0, 0); phone4.matrixAutoUpdate = false;
  const monkey = new THREE.Group(); const mk = { head: new THREE.Group(), tail: [], arm: null, banana: null };
  { const br = mat(0x7a4a24, { roughness: .9 }), tan = mat(0xe6c196, { roughness: .8 }); const add = (g, geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; g.add(o); return o; };
    add(monkey, new lib.RoundedBoxGeometry(.34, .42, .28, 3, .08), br, 0, 0, 0); add(monkey, new lib.RoundedBoxGeometry(.2, .22, .04, 2, .02), tan, 0, -.02, .15);
    mk.head.position.set(0, .36, .02); monkey.add(mk.head); add(mk.head, new lib.RoundedBoxGeometry(.34, .3, .3, 3, .08), br, 0, .05, 0); add(mk.head, new lib.RoundedBoxGeometry(.24, .17, .06, 2, .03), tan, 0, -.0, .15); add(mk.head, new THREE.BoxGeometry(.06, .06, .03), mat(0x111111), -.08, .09, .19); add(mk.head, new THREE.BoxGeometry(.06, .06, .03), mat(0x111111), .08, .09, .19); add(mk.head, new THREE.BoxGeometry(.05, .03, .03), mat(0x3a1d10), 0, -.02, .19);
    add(mk.head, new THREE.SphereGeometry(.1, 8, 6), tan, -.21, .08, 0); add(mk.head, new THREE.SphereGeometry(.1, 8, 6), tan, .21, .08, 0);
    for (let i = 0; i < 6; i++) { const t = new THREE.Group(); t.position.set(0, -.12 - i * .13, -.16 - Math.sin(i * .5) * .1); monkey.add(t); add(t, new THREE.BoxGeometry(.07, .15, .07), br, 0, 0, 0); mk.tail.push(t); }
    mk.arm = new THREE.Group(); mk.arm.position.set(-.2, .12, .05); monkey.add(mk.arm); add(mk.arm, new THREE.BoxGeometry(.09, .3, .09), br, 0, -.14, 0); mk.banana = add(mk.arm, new THREE.BoxGeometry(.07, .26, .07), mat(0xffd92a), 0, -.3, .06);
    add(monkey, new THREE.BoxGeometry(.09, .28, .09), br, .2, -.08, .04); add(monkey, new THREE.BoxGeometry(.1, .1, .22), br, -.1, -.25, .12); add(monkey, new THREE.BoxGeometry(.1, .1, .22), br, .1, -.25, .12);
    monkey.matrixAutoUpdate = false; W4.S.add(monkey); }
  const flash = new THREE.Mesh(new THREE.PlaneGeometry(9, 14), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthTest: false, depthWrite: false })); flash.renderOrder = 20; W4.S.add(flash);
  const burst = panel(W4.S, 1.2, 1.2, 128, 128, (g) => { g.fillStyle = '#fff'; g.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = i % 2 ? 24 : 62; g.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); } g.fill(); }, { ro: 8, bb: true }); W4.bb.push(burst.m);
  const selfieFrame = panel(W4.S, 3.4, 5.4, 340, 540, (g, w, h) => { g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 8; const L = 50, m = 10; [[m, m, 1, 1], [w - m, m, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1]].forEach(([x, y, a, b]) => { g.beginPath(); g.moveTo(x + a * L, y); g.lineTo(x, y); g.lineTo(x, y + b * L); g.stroke(); }); g.fillStyle = '#ff3b3b'; g.beginPath(); g.arc(w - 34, 54, 12, 0, 7); g.fill(); }, { ro: 9, bb: true }); W4.bb.push(selfieFrame.m);

  // ======================================================== WORLD 5: apartment, rain
  const W5 = world({ fog: 0x2a2f3c, fogNear: 30, fogFar: 90, sunI: .9, hemi: .55, exposure: .95 }); crowdFor(W5, 4);
  bx(W5.S, 40, .4, 30, 0x6a4a30, 0, -.2, CZ + 4, { cast: false }); bx(W5.S, 40, 12, .4, 0xa8a090, 0, 6, CZ + 4.6, { cast: false }); bx(W5.S, .4, 12, 30, 0x988f80, -6, 6, CZ + 4, { cast: false }); bx(W5.S, .4, 12, 30, 0x988f80, 6, 6, CZ + 4, { cast: false });
  bx(W5.S, 3.0, .5, 1.1, 0x4a5f8a, 0, .45, CZ + 1.1); bx(W5.S, 3.0, 1.1, .35, 0x3f5278, 0, 1.05, CZ + 1.75); bx(W5.S, .35, .9, 1.1, 0x3f5278, -1.6, .75, CZ + 1.1); bx(W5.S, .35, .9, 1.1, 0x3f5278, 1.6, .75, CZ + 1.1);
  bx(W5.S, 3.2, .06, 1.5, 0x8a3a3a, 0, .03, CZ - .9, { cast: false });
  const rain = panel(W5.S, 3.4, 3.4, 256, 256, () => {}, { tr: false }); rain.m.position.set(2.4, 3.6, CZ + 4.35); bx(W5.S, 3.7, .18, .2, 0xeeeeee, 2.4, 5.4, CZ + 4.3); bx(W5.S, 3.7, .18, .2, 0xeeeeee, 2.4, 1.8, CZ + 4.3); bx(W5.S, .18, 3.6, .2, 0xeeeeee, .6, 3.6, CZ + 4.3); bx(W5.S, .18, 3.6, .2, 0xeeeeee, 4.2, 3.6, CZ + 4.3); bx(W5.S, .1, 3.4, .2, 0xeeeeee, 2.4, 3.6, CZ + 4.3);
  const drawRain = (t) => { const g = rain.g; const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#3a4258'); gr.addColorStop(1, '#6a7388'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); g.fillStyle = 'rgba(40,44,58,.9)'; g.fillRect(10, 170, 40, 86); g.fillRect(60, 130, 50, 126); g.fillRect(150, 150, 44, 106); g.fillRect(200, 110, 46, 146);
    g.strokeStyle = 'rgba(210,225,255,.75)'; g.lineWidth = 3; for (let i = 0; i < 46; i++) { const sd = (i * 97.13) % 1; const x = ((i * 53.7) % 256), y = ((t * 380 + i * 41.3) % 300) - 20; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 7, y + 28); g.stroke(); }
    g.fillStyle = 'rgba(200,220,255,.55)'; for (let i = 0; i < 14; i++) { const x = (i * 71.3) % 256, y = ((t * 40 + i * 63) % 270); g.beginPath(); g.ellipse(x, y, 4, 8, 0, 0, 7); g.fill(); g.fillRect(x - 1, y - 30, 2, 24); }
    rain.t.needsUpdate = true; };
  const lampL = new THREE.PointLight(0xffc27a, 9, 16); lampL.position.set(-3.3, 3.8, CZ + 2.8); W5.S.add(lampL); bx(W5.S, .12, 2.4, .12, 0x2a2a2a, -3.3, 1.2, CZ + 3.2); bx(W5.S, .7, .5, .7, 0xffe0a0, -3.3, 2.7, CZ + 3.2, { m: { emissive: 0xffc070, emissiveIntensity: .8 } });
  const case5 = bx(W5.S, .4, .3, .14, 0xd8423c, 0, 0, 0); case5.matrixAutoUpdate = false; const case5h = bx(W5.S, .16, .05, .05, 0x222222, 0, 0, 0); case5h.matrixAutoUpdate = false;
  const tears = [0, 1].map(() => { const m = bx(W5.S, .05, .1, .03, 0x5ac8ff, 0, 0, 0, { cast: false }); m.matrixAutoUpdate = false; return m; });
  const thought = panel(W5.S, 3.0, 2.4, 600, 480, (g, w, h) => {
    g.save(); g.beginPath(); g.ellipse(300, 210, 280, 190, 0, 0, 7); g.clip(); const gr = g.createLinearGradient(0, 20, 0, 400); gr.addColorStop(0, '#6ac8ff'); gr.addColorStop(1, '#c8ecff'); g.fillStyle = gr; g.fillRect(0, 0, w, 400); g.fillStyle = '#ffd92a'; g.beginPath(); g.arc(470, 100, 48, 0, 7); g.fill(); g.fillStyle = '#2aa8d8'; g.fillRect(0, 240, w, 70); g.fillStyle = '#7ad0f0'; for (let i = 0; i < 6; i++) g.fillRect(40 + i * 90, 262 + (i % 2) * 18, 54, 6); g.fillStyle = '#f0d89a'; g.fillRect(0, 305, w, 140);
    g.strokeStyle = '#8a5a2a'; g.lineWidth = 14; g.beginPath(); g.moveTo(130, 360); g.quadraticCurveTo(150, 230, 210, 150); g.stroke(); g.fillStyle = '#2f9a4a'; for (let k = 0; k < 6; k++) { const a = -.6 + k * .55; g.save(); g.translate(210, 150); g.rotate(a - 1.2); g.beginPath(); g.ellipse(52, 0, 56, 14, 0, 0, 7); g.fill(); g.restore(); }
    g.fillStyle = '#e0211f'; g.fillRect(330, 330, 80, 14); g.restore(); g.strokeStyle = '#16181d'; g.lineWidth = 12; g.beginPath(); g.ellipse(300, 210, 280, 190, 0, 0, 7); g.stroke();
    g.fillStyle = '#fff'; g.strokeStyle = '#16181d'; g.lineWidth = 8; [[110, 436, 26], [58, 470, 16]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.stroke(); }); }, { ro: 6, bb: true }); W5.bb.push(thought.m);

  const W = [W0, W1, W2, W3, W4, W5];
  { const sty = document.createElement('style'); sty.textContent = '#val,#lab,#note,#tag{-webkit-text-stroke:2px #111;paint-order:stroke fill;text-shadow:0 2px 12px rgba(0,0,0,.9)}'; document.head.appendChild(sty); }
  const POP = ['', 'CANCUN. TWICE.', 'AIRPORT. TERMINAL B.', 'PASSPORT. EXPIRED.', 'PHOTO WITH A MONKEY.', 'HOME. SAD.'];
  const bub2 = (b, text, x, y, z) => b.show(text, x, y, z);
  const mtx = new THREE.Matrix4();

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); const w = W[bi]; const { st, S, P } = w; reset(w);
    let cam = [0, 2.4, CZ - 8, 0, 2.6, CZ, 52];
    if (bi === 0) {
      const u = smooth(clamp(lt / 4.7));
      const wave = lt > 1.0 ? -2.5 + .45 * Math.sin(lt * 9) : -.2;
      place(w, 0, .5, CZ, Math.PI, 'idle', { sc: 1.1, arms: { lx: -.2, rx: wave, lz: .1, rz: lt > 1.0 ? -.25 : -.1 } });
      card.visible = true; card.position.set(.5, 3.75 + Math.sin(t * 2.2) * .05, CZ); card.scale.setScalar(1.0 * (1 + .025 * Math.sin(t * 5)));
      case0.position.set(-1.45, 0, CZ + .1); case0.rotation.y = Math.sin(t * 1.4) * .1; case0.rotation.z = lt > 3.0 ? Math.sin((lt - 3.0) * 14) * .05 * Math.max(0, 1 - (lt - 3.0)) : 0;
      jet.visible = true; jet.position.set(lerp(-26, 30, clamp((lt - .2) / 4.4)), 30, CZ + 70); jet.rotation.z = .12;
      cam = [lerp(1.0, -.3, u), 2.5, CZ - lerp(9.5, 7.0, u), 0, 2.7, CZ, 54];
    } else if (bi === 1) {
      bch.update(t);
      const spin = smooth(clamp((lt - 1.0) / .8)) * Math.PI * 2;
      place(w, 0, 0, CZ, Math.PI + spin, 'jump', { sc: 1.15, sp: .85 });
      case1.position.set(1.35, 0, CZ - .2); case1.rotation.y = .2;
      palms.forEach((pm, k) => { const g = easeBack((lt - (k ? 1.05 : .1)) / .5); pm.scale.setScalar(Math.max(.01, g)); pm.visible = g > .02; });
      const s1 = lt > .3, s2 = lt > 1.25; const n = s2 ? 2 : s1 ? 1 : 0;
      if (n !== stampN && n > 0) { stampN = n; stampT(n)(stamp.g, 400, 400); stamp.t.needsUpdate = true; }
      if (n !== tripsN) { tripsN = n; drawTrips(n); }
      const su = n === 2 ? (lt - 1.25) : (lt - .3); const sk = n > 0 ? 1 + Math.max(0, 1 - su / .14) * 1.6 : 0.01;
      stamp.m.visible = n > 0 && su < 1.0; stamp.m.position.set(.2, 5.0, CZ - .3); stamp.m.scale.setScalar(Math.max(.01, sk));
      tripsPanel.m.visible = true; tripsPanel.m.position.set(1.15, 6.9, CZ + 1.2); tripsPanel.m.scale.setScalar(1.1);
      cam = [lerp(-.5, .5, p), 2.6, CZ - 10.5, 0, 2.9, CZ + 1, 56];
    } else if (bi === 2) {
      const k = Math.floor(t * 2.5); if (String(k) !== boardKey) { boardKey = String(k); drawBoard(k); }
      place(w, 0, 0, CZ - .05, Math.PI, 'sit', { sc: 1.0, y: .33, sitPitch: .5 + .05 * Math.sin(t * 1.6), arms: { lx: -.95, rx: -.95, lz: .3, rz: -.3 } });
      case2.position.set(0, 0, CZ + .1);
      const wx = lerp(-6, 6, (lt * .45) % 1); place(w, 2, wx, CZ + 3.0, Math.PI / 2 * (wx > 0 ? 1 : 1), 'walk', { sc: 1.0, sp: .9 });
      place(w, 3, lerp(7, -7, ((lt + .5) * .38) % 1), CZ + 3.4, -Math.PI / 2, 'walk', { sc: 1.0, sp: .8 });
      zz.forEach((q, j) => { const u = ((lt * .85 + j / 3) % 1); q.m.visible = true; q.m.position.set(.5 + u * .8 + j * .12, 2.3 + u * 1.3, CZ - .3); q.m.scale.setScalar(.7 + u * .8); q.m.material.opacity = 1 - u; });
      cam = [lerp(1.0, -.3, p), 2.7, CZ - lerp(8.6, 7.0, smooth(p)), 0, 2.9, CZ + 1, 54];
    } else if (bi === 3) {
      const a = clamp((lt - .95) / .25); const slam = lt > 1.15;
      const armUp = lt > .55 && lt < 1.2; const rx = armUp ? lerp(-1.2, -2.7, smooth(clamp((lt - .55) / .4))) - 0 : (lt >= 1.2 ? -.7 : -1.0);
      place(w, 0, -1.9, CZ - .9, Math.PI - .25, 'idle', { sc: 1.1, arms: { lx: -.3, rx: -.35, lz: slam ? 1.1 : .2, rz: slam ? -1.1 : -.2 } });
      const shake = lt > 1.45 ? Math.sin((lt - 1.45) * 13) * .55 * Math.max(0, 1 - (lt - 1.45) / 1.0) : 0;
      place(w, 1, 1.9, CZ + .4, Math.PI + shake * .6, 'idle', { sc: 1.12, arms: armUp ? { lx: -1.0, rx: rx, lz: .5, rz: -.1 } : (lt >= 1.2 && lt < 1.45 ? { lx: -1.0, rx: -1.1, lz: .5, rz: -.1 } : { lx: -1.05, rx: -1.05, lz: .6, rz: -.6 }) });
      passport.position.set(.2, 4.9 + Math.sin(t * 2.2) * .06, CZ - .2); passport.rotation.set(-.12, 0, Math.sin(t * 1.5) * .02 + (lt > 1.15 && lt < 1.3 ? .04 : 0)); passport.scale.setScalar(1.0);
      const su = lt - 1.15; expT.m.visible = slam; expT.m.position.set(.2, 4.9, CZ - .5); expT.m.rotation.set(-.12, 0, 0); expT.m.scale.setScalar(slam ? 1 + Math.max(0, 1 - su / .12) * 1.8 : .01);
      if (slam) w.crowd.setFace('shock'); else w.crowd.setFace('calm');
      if (lt > 1.6) bub2(bubs3[0], 'NOPE.', 1.95, 3.9, CZ + .1); else bubs3[0].hide();
      cam = [lerp(.5, -.4, p), 2.8, CZ - 9.2, 0, 3.4, CZ, 54];
    } else if (bi === 4) {
      const fl1 = lt > .85 && lt < 1.0, fl2 = lt > 1.5 && lt < 1.62; const fl = fl1 ? 1 - (lt - .85) / .15 : fl2 ? 1 - (lt - 1.5) / .12 : 0;
      place(w, 0, 0, CZ, Math.PI, 'idle', { sc: 1.15, arms: { lx: -.25, rx: -1.75, lz: .05, rz: -.08 }, extra: 0 });
      selfieFrame.m.visible = true; selfieFrame.m.position.set(0, 2.75, CZ - 3.2);
      burst.m.visible = fl > 0; burst.m.position.set(-.85, 3.1, CZ - 1.1); burst.m.scale.setScalar(.8 + fl * 1.6);
      flash.material.opacity = fl * .85; flash.visible = fl > 0;
      cam = [lerp(-.3, .4, p), 2.4, CZ - 9.0, 0, 2.6, CZ, 52];
    } else {
      place(w, 0, 0, CZ + 1.05, Math.PI, 'sit', { sc: 1.0, y: .14, sitPitch: .32 + .04 * Math.sin(t * 2.4), arms: { lx: -.85, rx: -.85, lz: .25, rz: -.25 } });
      drawRain(t);
      thought.m.visible = true; const bu = easeBack((lt - .25) / .5); thought.m.position.set(-1.1, 4.7 + Math.sin(t * 1.8) * .08, CZ + .6); thought.m.scale.setScalar(Math.max(.01, bu));
      cam = [lerp(.5, 0, p), 2.5, CZ - lerp(7.8, 6.2, smooth(p)), 0, 2.5, CZ + 1, 54];
    }
    w.crowd.update(t);
    // props that ride on bodies (after crowd.update)
    if (bi === 0) { /* free-standing */ }
    if (bi === 1) { attach(shades[0], P[0], 'head', [0, .06, .245]); mtx.copy(shades[0].matrix); shades[1].visible = false; shades[0].scale.set(1, 1, 1); }
    if (bi === 3) { cap[0].visible = cap[1].visible = badge.visible = true; attach(cap[0], P[1], 'head', [0, .46, 0]); attach(cap[1], P[1], 'head', [0, .4, .26]); attach(badge, P[1], 'torso', [.18, .18, .17]); attach(stampTool, P[1], 'handR', [0, -.12, .08]); attach(stampBase, P[1], 'handR', [0, -.3, .08]); }
    if (bi === 4) {
      attach(phone4, P[0], 'handR', [0, -.12, .12], [Math.PI / 2 + .3, 0, 0]);
      attach(monkey, P[0], 'torso', [-.55, .55, .02], [0, Math.sin(t * 1.5) * .15, 0]); monkey.visible = true;
      mk.head.rotation.set(Math.sin(t * 2.2) * .12, Math.sin(t * 1.3) * .5 + (lt > 1.0 ? .3 : 0), Math.sin(t * 1.7) * .1);
      mk.tail.forEach((s, i) => { s.rotation.x = Math.sin(t * 3 - i * .6) * .25; });
      mk.arm.rotation.x = -1.5 + Math.sin(t * 5) * .5 * (lt > .3 ? 1 : 0);
    }
    if (bi === 5) {
      attach(case5, P[0], 'handR', [-.2, -.12, .14], [.5, 0, 0]); attach(case5h, P[0], 'handR', [-.2, -.0, .14], [.5, 0, 0]); case5.visible = case5h.visible = true;
      tears.forEach((m, j) => { attach(m, P[0], 'head', [j ? .11 : -.11, -.02 - ((lt * 1.0 + j * .5) % 1) * .35, .24]); m.visible = true; });
    }
    st.cam(...cam); st.follow(cam[3], cam[5]);
    w.bb.forEach((m) => { if (m.visible) m.quaternion.copy(st.camera.quaternion); });
    if (bi === 4) { flash.position.copy(st.camera.position).add(new THREE.Vector3(0, 0, 0)); flash.quaternion.copy(st.camera.quaternion); const dv = new THREE.Vector3(); st.camera.getWorldDirection(dv); flash.position.addScaledVector(dv, 1.2); selfieFrame.m.position.copy(st.camera.position).addScaledVector(dv, 6.0); selfieFrame.m.scale.setScalar(1.0); selfieFrame.m.quaternion.copy(st.camera.quaternion); }
    if (bi === 3) { expT.m.quaternion.copy(passport.quaternion); }
    if (bi !== 0) card.visible = false;
    st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if every *I love to travel* bio was true?' : '', bi === 0 ? 1 : 0); hud.counter('', '', ''); hud.tm('');
    hud.pop(POP[bi], Math.min(1, Math.max(0, (lt - .12) * 8)));
  } };
}
