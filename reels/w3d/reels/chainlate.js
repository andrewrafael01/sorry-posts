// invention chain: friend is always late -> party at 6 -> early + helps -> party at 5 -> vacuum -> cleans house + fridge -> he's the host -> you are late.
// One set per beat (spaced 40m apart), object close-ups, real movement, text-forward props (clock, poster, phone, fridge labels).
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, ground, Crowd, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0xf0e6d8, fogNear: 30, fogFar: 140, clouds: true, skyTop: 0x4a8ad8, skyMid: 0xa8cdf0, skyBot: 0xeaf0f8, shadowExtent: 12, shadowRes: 2048, hemi: 1.7, sunI: 1.7, sunDir: [-.3, .8, .7], exposure: 1.08 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const NZ = 6, ZX = (i) => i * 40;
  const Z = []; for (let i = 0; i < NZ; i++) { const g = new THREE.Group(); S.add(g); Z.push(g); }
  const bx = (g, x, y, z, w, h, d, c, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), c && c.isMaterial ? c : mat(c, o.m)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; g.add(m); return m; };
  const plane = (g, map, w, h, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map, roughness: o.r ?? .6, transparent: !!o.tr, emissive: o.em ? 0xffffff : 0, emissiveMap: o.em ? map : null, emissiveIntensity: o.em || 0 })); m.position.set(x, y, z); if (o.ry) m.rotation.y = o.ry; g.add(m); return m; };
  const sphere = (g, r, c, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), mat(c, o.m || { roughness: .35 })); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; };

  // ------------------------------------------------------------------ shared: room shell
  const room = (i, wall, floor, o = {}) => { const g = Z[i], x0 = ZX(i); bx(g, x0, -.06, -1, 16, .12, 12, floor); bx(g, x0, 3, -3.2, 16, 6.2, .2, wall); bx(g, x0, .1, -3.08, 16, .2, .06, 0xf2eee6); if (o.sides !== false) { bx(g, x0 - 7.5, 3, 1, .2, 6.2, 10, wall); bx(g, x0 + 7.5, 3, 1, .2, 6.2, 10, wall); } };
  // wall clock
  const mkClock = (g, x, y, z, r) => { const c = cvs(512, 600, null); const m = new THREE.Mesh(new THREE.CircleGeometry(r, 48), new THREE.MeshBasicMaterial({ map: c.t, transparent: true })); const grp = new THREE.Group(); grp.position.set(x, y, z); const plateM = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.07, r * 1.07, .06, 40), mat(0x2a2a30, { roughness: .4 })); plateM.rotation.x = Math.PI / 2; plateM.position.z = -.03; plateM.castShadow = true; grp.add(plateM);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(2 * r, 2 * r * 600 / 512), new THREE.MeshBasicMaterial({ map: c.t, transparent: true })); face.position.set(0, -r * (600 / 512 - 1), .002); grp.add(face); g.add(grp);
    const set = (hh, mm, hot = false) => { const g2 = c.g; g2.clearRect(0, 0, 512, 600); g2.fillStyle = '#fbfaf4'; g2.beginPath(); g2.arc(256, 256, 250, 0, 7); g2.fill(); g2.lineWidth = 12; g2.strokeStyle = '#1f2026'; g2.stroke(); for (let k = 0; k < 12; k++) { const a = k / 12 * 6.2832; g2.lineWidth = k % 3 ? 5 : 11; g2.beginPath(); g2.moveTo(256 + Math.sin(a) * 205, 256 - Math.cos(a) * 205); g2.lineTo(256 + Math.sin(a) * 232, 256 - Math.cos(a) * 232); g2.stroke(); }
      for (const n of [12, 3, 6, 9]) { const a = n / 12 * 6.2832; txt(g2, String(n), 256 + Math.sin(a) * 160, 256 - Math.cos(a) * 160 + 2, 54, '#1f2026'); }
      const ha = ((hh % 12) + mm / 60) / 12 * 6.2832, ma = mm / 60 * 6.2832; g2.lineCap = 'round'; g2.strokeStyle = '#1f2026'; g2.lineWidth = 20; g2.beginPath(); g2.moveTo(256, 256); g2.lineTo(256 + Math.sin(ha) * 108, 256 - Math.cos(ha) * 108); g2.stroke(); g2.lineWidth = 12; g2.beginPath(); g2.moveTo(256, 256); g2.lineTo(256 + Math.sin(ma) * 178, 256 - Math.cos(ma) * 178); g2.stroke(); g2.fillStyle = '#d63a2c'; g2.beginPath(); g2.arc(256, 256, 14, 0, 7); g2.fill();
      const mi = Math.round(mm); const s = `${Math.floor(hh) % 12 || 12}:${String(mi).padStart(2, '0')}`; g2.fillStyle = '#16171c'; g2.beginPath(); g2.roundRect(86, 482, 340, 104, 16); g2.fill(); txt(g2, s, 256, 536, 92, hot ? '#ff6a4a' : '#7dffa0', { w: 800 }); c.t.needsUpdate = true; };
    set(6, 0); return { grp, set }; };
  // poster
  const mkPoster = (g, x, y, z, w, h) => { const p = cvs(400, 560, (q) => { q.fillStyle = '#ffd23a'; q.fillRect(0, 0, 400, 560); q.fillStyle = '#e8483a'; q.fillRect(0, 0, 400, 40); q.fillRect(0, 520, 400, 40); for (let k = 0; k < 26; k++) { q.fillStyle = ['#2b9bff', '#ff4a8a', '#3bd16a', '#fff'][k % 4]; q.beginPath(); q.arc(20 + cr(k, 1) * 360, 60 + cr(k, 2) * 440, 7 + cr(k, 3) * 7, 0, 7); q.fill(); } txt(q, 'PARTY!', 200, 125, 120, '#e8483a', { stroke: '#111', sw: 16 }); txt(q, 'TONIGHT', 200, 238, 58, '#1c1c22'); q.fillStyle = '#fff'; q.fillRect(34, 285, 332, 150); q.lineWidth = 8; q.strokeStyle = '#111'; q.strokeRect(34, 285, 332, 150); txt(q, '7:00', 200, 358, 138, '#111'); txt(q, 'PM', 200, 420, 44, '#111'); txt(q, 'my place', 200, 482, 44, '#1c1c22', { w: 700 }); });
    const m = plane(g, p.t, w, h, x, y, z); bx(g, x, y, z - .03, w + .12, h + .12, .05, 0xf3efe6, { cast: false }); return m; };
  // phone
  const phone = new THREE.Group(); const phoneScr = cvs(360, 720, null); { bx(phone, 0, 0, 0, .56, 1.12, .07, 0x15151a, { m: { roughness: .3, metalness: .3 } }); const sc = new THREE.Mesh(new THREE.PlaneGeometry(.5, 1.0), new THREE.MeshBasicMaterial({ map: phoneScr.t })); sc.position.z = .037; phone.add(sc); phone.visible = false; S.add(phone); }
  const drawPhone = (typed, sent, reply) => { const g = phoneScr.g; g.fillStyle = '#f2f2f6'; g.fillRect(0, 0, 360, 720); g.fillStyle = '#3d7bd9'; g.fillRect(0, 0, 360, 96); txt(g, 'Dave', 180, 54, 40, '#fff'); g.fillStyle = '#b8c4d8'; g.beginPath(); g.arc(46, 52, 24, 0, 7); g.fill();
    if (sent) { g.fillStyle = '#3d7bd9'; g.beginPath(); g.roundRect(70, 150, 270, 110, 26); g.fill(); txt(g, 'party at 6', 205, 206, 54, '#fff', { w: 800 }); g.font = '700 22px Liberation Sans'; g.fillStyle = '#7a7f8a'; g.textAlign = 'right'; g.fillText('Delivered', 340, 284); }
    if (reply) { g.fillStyle = '#dcdde4'; g.beginPath(); g.roundRect(20, 320, 150, 90, 26); g.fill(); txt(g, 'ok!', 95, 366, 52, '#222', { w: 800 }); }
    g.fillStyle = '#fff'; g.fillRect(0, 624, 360, 96); g.fillStyle = '#e6e7ec'; g.beginPath(); g.roundRect(18, 640, 324, 64, 30); g.fill(); txt(g, typed, 36, 674, 38, '#111', { al: 'left', w: 700 }); phoneScr.t.needsUpdate = true; };

  // ------------------------------------------------------------------ people
  const crowd = new Crowd(S, 5, 77); const P = crowd.p; const YOU = P[0], FR = P[1];
  const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  col(0, ['torso', 'armL', 'armR'], 0x3a78d8); col(0, ['legL', 'legR'], 0x2b3347); col(0, ['hair'], 0x4a2f1c); col(1, ['torso', 'armL', 'armR'], 0xf0902a); col(1, ['legL', 'legR'], 0x3f5a3a); col(1, ['hair'], 0x16110c);
  col(2, ['torso', 'armL', 'armR'], 0xd84a7a); col(3, ['torso', 'armL', 'armR'], 0x4ab870); col(4, ['torso', 'armL', 'armR'], 0x8a5ad8);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  YOU.h = 1; FR.h = 1.04;
  const hide = (o) => { o.vis = false; };
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; };

  // ------------------------------------------------------------------ floating text labels
  const mkLabel = (text, c1, c2, w = 640, fs = 120) => { const l = cvs(w, 200, (g, ww, h) => { txt(g, text, ww / 2, 104, fs, c1, { stroke: c2, sw: 22 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const popL = (s, x, y, z, w, a, bounce = 0) => { s.visible = a > .01; s.position.set(x, y, z); const k = 1 + bounce * .12; s.scale.set(w * k, w * .3125 * k, 1); s.material.opacity = clamp(a); };
  const lbClever = mkLabel('CLEVER!', '#ffe23a', '#111'), lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111', 760, 112), lbVac = mkLabel('VRRRRR', '#ffffff', '#111', 640, 130), lbHost = mkLabel('HOST', '#ffe23a', '#111', 480, 150), lbLate = mkLabel('LATE!', '#ff5a4a', '#111', 560, 150), lbSix = mkLabel('6:00', '#ff6a4a', '#111', 480, 150);

  // ------------------------------------------------------------------ ZONE 0: wall with clock + poster, you texting
  room(0, 0xe9d9bf, 0xb98a5a); const c0 = mkClock(Z[0], ZX(0) - .2, 2.2, -3.05, .6); const poster0 = mkPoster(Z[0], ZX(0) + 1.05, 2.0, -3.04, 1.0, 1.4);
  bx(Z[0], ZX(0) - 2.1, .5, -2.6, 1.6, .9, .7, 0x8a5a38); bx(Z[0], ZX(0) - 2.1, 1.05, -2.6, 1.7, .2, .76, 0xa66a3a); // sideboard
  // ------------------------------------------------------------------ ZONE 1: front door at six
  const doorWall = (i, wall) => { const g = Z[i], x0 = ZX(i); bx(g, x0, -.06, 0, 18, .12, 14, 0x9aa890); bx(g, x0, .05, 1.2, 4.2, .12, 2.4, 0xc9c2b4); bx(g, x0 - 4.1, 2.2, -2.2, 6.2, 4.6, .3, wall); bx(g, x0 + 4.1, 2.2, -2.2, 6.2, 4.6, .3, wall); bx(g, x0, 3.9, -2.2, 2.2, 1.6, .3, wall); bx(g, x0, 3.05, -2.2, 2.2, .14, .34, 0xfaf6ee); bx(g, x0 - 1.08, 1.35, -2.2, .14, 2.7, .34, 0xfaf6ee); bx(g, x0 + 1.08, 1.35, -2.2, .14, 2.7, .34, 0xfaf6ee);
    bx(g, x0, 2.9, -6.8, 18, 6, .2, 0xf4ddb0); bx(g, x0, -.05, -5.2, 12, .12, 6, 0xb98a5a); bx(g, x0 - 5, 3, -5, .2, 6, 7, 0xf4ddb0); bx(g, x0 + 5, 3, -5, .2, 6, 7, 0xf4ddb0); };
  doorWall(1, 0xd8a86a); const c1 = mkClock(Z[1], ZX(1), 3.9, -2.02, .55);
  const strGroup = []; // streamers (zone 1): rope inside door + hanging strips
  for (let k = 0; k < 14; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.08, .9 + cr(k, 4) * .5, .01), mat([0xff4a8a, 0x2b9bff, 0xffd23a, 0x3bd16a][k % 4])); m.position.set(ZX(1) - 1.6 + k * .24, 2.55, -4.2); m.userData.k = k; Z[1].add(m); strGroup.push(m); }
  bx(Z[1], ZX(1), 3.05, -4.2, 3.6, .04, .04, 0x444444);
  // balloons (bunch, shared; attached to friend hand in beat 1, party balloons zone 4/5)
  const balloons = new THREE.Group(); const balCols = [0xff4a4a, 0x2b9bff, 0xffd23a, 0x3bd16a, 0xff4a8a]; const balPos = [[-.28, 1.0, 0], [.28, 1.15, .05], [0, 1.45, -.05], [-.34, 1.45, .1], [.3, 1.6, -.05]];
  balPos.forEach((p, i) => { const b = new THREE.Mesh(new THREE.SphereGeometry(.24, 18, 14), mat(balCols[i], { roughness: .2, metalness: .1 })); b.scale.y = 1.2; b.position.set(...p); b.castShadow = true; balloons.add(b); const l = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, p[1], 4), mat(0xffffff)); l.position.set(p[0] / 2, p[1] / 2 - .22, p[2] / 2); l.rotation.z = -Math.atan2(p[0], p[1]) * .0; balloons.add(l); }); balloons.visible = false; S.add(balloons);
  // ------------------------------------------------------------------ ZONE 2: living room, clock to five, vacuum
  room(2, 0xc9dcd0, 0xc8b08a); const c2 = mkClock(Z[2], ZX(2) - .9, 2.4, -3.05, .62);
  bx(Z[2], ZX(2) + 0.6, .01, -.2, 4.6, .03, 3.4, 0xb8483a); bx(Z[2], ZX(2) + .6, .02, -.2, 4.1, .03, 2.9, 0xd8664a); // rug
  bx(Z[2], ZX(2) - 3.1, .5, -2.2, 2.2, 1.0, 1.0, 0x5a7ab0); bx(Z[2], ZX(2) - 3.1, 1.0, -2.65, 2.2, .8, .3, 0x4a6a9c); // sofa
  const vac = new THREE.Group(); { const body = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .5, 24, 1, false, 0, 6.2832), mat(0xd8261e, { roughness: .35 })); body.rotation.z = Math.PI / 2; body.position.y = .36; body.castShadow = true; vac.add(body); const bag = new THREE.Mesh(new THREE.SphereGeometry(.27, 18, 12), mat(0xf2f2ee, { roughness: .6 })); bag.position.set(-.08, .64, 0); bag.scale.y = .8; bag.castShadow = true; vac.add(bag); for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, .08, 16), mat(0x222222)); w.rotation.x = Math.PI / 2; w.position.set(-.12, .14, s * .3); vac.add(w); }
    const head = new THREE.Mesh(new THREE.BoxGeometry(.7, .1, .34), mat(0x2a2a30)); head.position.set(.95, .06, 0); head.castShadow = true; vac.add(head); const pipe = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 1.0, 10), mat(0xc8c8d0, { metalness: .8, roughness: .3 })); pipe.position.set(.66, .5, 0); pipe.rotation.z = Math.atan2(.59, .94); pipe.position.set(.655, .53, 0); pipe.scale.y = 1.1; vac.add(pipe); const hdl = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, .34, 8), mat(0x222222)); hdl.rotation.x = Math.PI / 2; hdl.position.set(.36, 1.0, 0); vac.add(hdl); vac.visible = false; S.add(vac); }
  const dust = []; for (let i = 0; i < 16; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(.055, 8, 6), mat(0x9a948a)); d.visible = false; S.add(d); dust.push(d); }
  // ------------------------------------------------------------------ ZONE 3: sparkling house + fridge
  room(3, 0xf6f1e4, 0xe6dccb, { sides: false });
  { const g = Z[3], x0 = ZX(3); for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2) bx(g, x0 - 4.8 + i * 1.2, .01, -2.6 + j * 1.0, 1.2, .01, 1.0, 0xffffff, { cast: false, m: { roughness: .1, metalness: .2 } }); bx(g, x0 - 3.4, .45, -2.5, 2.0, .9, 1.0, 0x6a8ac0); bx(g, x0 - 3.4, 1.0, -2.95, 2.0, .7, .25, 0x5a7ab0); bx(g, x0 - 5.0, 1.1, -2.9, .9, 2.2, .5, 0x9a6a3a); const pl = new THREE.Mesh(new THREE.SphereGeometry(.4, 14, 10), mat(0x3f8a3c, { flatShading: true })); pl.position.set(x0 - 1.5, 1.0, -2.6); g.add(pl); bx(g, x0 - 1.5, .4, -2.6, .45, .8, .45, 0xc8c2b4); }
  const FX0 = ZX(3) + 3.6; // fridge origin
  const fridge = new THREE.Group(); fridge.position.set(FX0, 0, -2.2); Z[3].add(fridge);
  { const FW = 1.5, FH = 2.7, FD = .9; const st = new THREE.MeshStandardMaterial({ color: 0xe9ecef, roughness: .3, metalness: .5 }); const add = (w, h, d, x, y, z, m = st) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; fridge.add(b); return b; }; add(.1, FH, FD, -FW / 2 + .05, FH / 2, 0); add(.1, FH, FD, FW / 2 - .05, FH / 2, 0); add(FW, .1, FD, 0, FH - .05, 0); add(FW, .1, FD, 0, .05, 0); add(FW, FH, .06, 0, FH / 2, -FD / 2 + .03, new THREE.MeshStandardMaterial({ color: 0xfafcff, roughness: .4 }));
    const glow = new THREE.PointLight(0xfff4e0, 1.2, 4); glow.position.set(0, FH * .55, .5); fridge.add(glow); fridge.userData.glow = glow;
    for (let s = 1; s <= 3; s++) { const sh = new THREE.Mesh(new THREE.BoxGeometry(FW - .2, .035, FD - .1), new THREE.MeshStandardMaterial({ color: 0xcfe8f4, transparent: true, opacity: .75, roughness: .1 })); sh.position.set(0, .12 + s * .62, 0); fridge.add(sh); }
    fridge.userData.items = []; const LBL = [['MILK', 'EGGS', 'BUTTER'], ['A-Z SAUCES', 'LEFTOVERS MON', 'LEFTOVERS TUE'], ['YOGURT 1', 'YOGURT 2', 'YOGURT 3'], ['GREENS', 'FRUIT', 'JUICE']];
    const itemCol = [[0xf4f4ee, 0xf2dca0, 0xf4e48a], [0xd8483a, 0xe8c86a, 0xe8c86a], [0xe88aa8, 0xe88aa8, 0xe88aa8], [0x5ab84a, 0xe8863a, 0xf0b43a]];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const x = -.45 + c * .45, y = .18 + r * .62 + .0 + (r === 3 ? 0 : .0); const item = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(.36, .3, .4), mat(itemCol[r][c], { roughness: .4 })); body.position.y = .17; body.castShadow = true; item.add(body); const lab = cvs(256, 128, (g) => { g.fillStyle = '#fffbe8'; g.fillRect(0, 0, 256, 128); g.strokeStyle = '#222'; g.lineWidth = 8; g.strokeRect(4, 4, 248, 120); const t = LBL[r][c]; const sp = t.split(' '); if (sp.length > 1 && t.length > 8) { txt(g, sp.slice(0, -1).join(' '), 128, 42, 40, '#111'); txt(g, sp[sp.length - 1], 128, 92, 46, '#111'); } else txt(g, t, 128, 66, t.length > 6 ? 46 : 60, '#111'); }); const lm = new THREE.Mesh(new THREE.PlaneGeometry(.34, .17), new THREE.MeshBasicMaterial({ map: lab.t })); lm.position.set(0, .17, .202); item.add(lm); item.position.set(x, y + (r === 0 ? 0 : 0), 0); item.userData = { r, c, x, y, lbl: lm }; item.visible = false; fridge.add(item); fridge.userData.items.push(item); } }
  const fDoor = new THREE.Group(); fDoor.position.set(-.75, 0, .45); fridge.add(fDoor); { const m = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.7, .1), new THREE.MeshStandardMaterial({ color: 0xf2f4f7, roughness: .3, metalness: .5 })); m.position.set(.75, 1.35, .05); m.castShadow = true; fDoor.add(m); const h = new THREE.Mesh(new THREE.BoxGeometry(.06, .8, .08), mat(0x888d96, { metalness: .8, roughness: .3 })); h.position.set(1.35, 1.35, .13); fDoor.add(h); }
  const sparkTex = cvs(64, 64, (g) => { g.translate(32, 32); g.fillStyle = '#fff'; g.beginPath(); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.2832, r = k % 2 ? 6 : 30; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); }); const sparks = []; for (let i = 0; i < 36; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex.t, transparent: true, color: 0xfff6b0, depthWrite: false, depthTest: false })); s.renderOrder = 9; s.visible = false; S.add(s); sparks.push(s); }
  // ------------------------------------------------------------------ ZONE 4: spotless house, guests, host
  doorWall(4, 0xcfd8e8); const c4 = mkClock(Z[4], ZX(4), 3.9, -2.02, .55); c4.set(7, 0);
  for (let k = 0; k < 14; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.08, .9 + cr(k, 5) * .5, .01), mat([0xff4a8a, 0x2b9bff, 0xffd23a, 0x3bd16a][k % 4])); m.position.set(ZX(4) - 1.6 + k * .24, 2.55, -4.2); Z[4].add(m); strGroup.push(m); }
  bx(Z[4], ZX(4), 3.05, -4.2, 3.6, .04, .04, 0x444444);
  { const bn = cvs(512, 128, (g) => { g.fillStyle = '#ffd23a'; g.fillRect(0, 0, 512, 128); txt(g, 'WELCOME', 256, 66, 92, '#e8483a', { stroke: '#111', sw: 10 }); }); plane(Z[4], bn.t, 2.2, .55, ZX(4), 3.35, -2.02); }
  // ------------------------------------------------------------------ ZONE 5: street, house with party in window, you sprint with cake
  { const g = Z[5], x0 = ZX(5); bx(g, x0, -.08, 0, 40, .16, 24, 0x6fa84e); bx(g, x0, .0, 3.4, 40, .08, 4.2, 0x5c5f66); bx(g, x0, .03, 3.4, 40, .01, .12, 0xf2e65a, { cast: false }); bx(g, x0, .02, 1.0, 40, .07, 1.6, 0xc9c6bc); // road, sidewalk
    bx(g, x0 + 2.4, 2.4, -2.2, 8, 4.8, .4, 0xd8a47a); bx(g, x0 + 2.4, 5.2, -2.2, 9, 1, .5, 0x8a3a2e);
    const win = cvs(512, 340, (q) => { const gr = q.createLinearGradient(0, 0, 0, 340); gr.addColorStop(0, '#ffe9a8'); gr.addColorStop(1, '#ffb84a'); q.fillStyle = gr; q.fillRect(0, 0, 512, 340); for (let k = 0; k < 7; k++) { q.fillStyle = ['#ff4a8a', '#2b9bff', '#3bd16a', '#ffd23a'][k % 4]; q.beginPath(); q.arc(40 + k * 72, 70 + (k % 3) * 22, 30, 0, 7); q.fill(); } const guy = (x, c) => { q.fillStyle = c; q.fillRect(x - 28, 200, 56, 140); q.fillStyle = '#e8b890'; q.beginPath(); q.arc(x, 176, 30, 0, 7); q.fill(); q.fillStyle = '#ff4a8a'; q.beginPath(); q.moveTo(x - 16, 150); q.lineTo(x, 100); q.lineTo(x + 16, 150); q.fill(); }; guy(90, '#2b9bff'); guy(200, '#d84a7a'); guy(320, '#4ab870'); guy(440, '#8a5ad8'); txt(q, 'PARTY', 256, 270, 68, '#fff', { stroke: '#e8483a', sw: 12 }); });
    plane(g, win.t, 3.0, 2.0, x0 + 2.4, 2.0, -1.98, { em: .55 }); bx(g, x0 + 2.4, 3.05, -1.99, 3.3, .14, .08, 0xfaf6ee); bx(g, x0 + 2.4, .95, -1.99, 3.3, .14, .1, 0xfaf6ee); bx(g, x0 + .85, 2.0, -1.99, .14, 2.2, .08, 0xfaf6ee); bx(g, x0 + 3.95, 2.0, -1.99, .14, 2.2, .08, 0xfaf6ee);
    bx(g, x0 + 5.9, 1.2, -1.95, 1.2, 2.4, .12, 0x7a3a2a); } // lamp post below
  const c5 = mkClock(Z[5], ZX(5) + 2.4, 4.1, -1.9, .55); c5.set(8, 15, true);
  // cake
  const cake = new THREE.Group(); { const b1 = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .18, 24), mat(0xf6e0c0)); b1.position.y = .09; const b2 = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .16, 24), mat(0xff8ab0)); b2.position.y = .26; const pl = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .03, 24), mat(0xffffff)); pl.position.y = -.01; cake.add(pl, b1, b2); for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .12, 6), mat(0xfff0a0)); c.position.set((k - 1) * .09, .4, 0); cake.add(c); const f = new THREE.Mesh(new THREE.SphereGeometry(.03, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffa020 })); f.position.set((k - 1) * .09, .48, 0); f.userData.flame = true; cake.add(f); } cake.traverse((m) => { m.castShadow = true; }); cake.visible = false; S.add(cake); }
  // apron on friend torso
  const apron = new THREE.Group(); { bx(apron, 0, 0, 0, .52, .56, .03, 0xfaf6ee, { cast: false }); bx(apron, 0, .1, .02, .3, .2, .02, 0xe8483a, { cast: false }); bx(apron, 0, .31, 0, .04, .02, .02, 0x333, { cast: false }); apron.visible = false; S.add(apron); }
  // guests balloon on door (zone 4)
  const balloon4 = balloons.clone(); balloon4.visible = true; balloon4.position.set(ZX(4) + 2.3, 1.3, -1.9); balloon4.scale.setScalar(.75); balloon4.traverse((m) => { }); Z[4].add(balloon4);

  // ------------------------------------------------------------------ camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3();
  const rig = (x0, lt, shots, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .5);
    const e0 = s[1], e1 = s[2], g0 = s[3], g1 = s[4];
    E.set(x0 + lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(x0 + lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .02; E.y += Math.sin(t * 1.3 + 1) * .015 + Math.cos(t * 57) * shake; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .008); };
  const setSwing = (arr, t, amp = .08) => arr.forEach((m) => { m.rotation.z = Math.sin(t * 2.2 + m.userData.k) * amp; });
  const sparkleAt = (t, n, cx, cy, cz, sx, sy, sz, a) => { sparks.forEach((s, i) => { if (i >= n || a <= 0) { s.visible = false; return; } const ph = (t * 1.8 + cr(i, 9) * 3) % 1; const k = Math.sin(ph * Math.PI); s.visible = k > .02; s.position.set(cx + (cr(i, 1) - .5) * sx, cy + (cr(i, 2) - .5) * sy, cz + (cr(i, 3) - .5) * sz); const sc = (.12 + cr(i, 4) * .22) * k * a; s.scale.set(sc, sc, 1); s.material.rotation = ph * 3; }); };
  const DUR = tl.beats.map((b) => b.dur);

  // ------------------------------------------------------------------ frame
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); Z.forEach((g, i) => { g.visible = i === bi; });
    const x0 = ZX(bi); let shock = false; let counterLabel = 'TIMES HE WAS LATE', counterN = 0, note = '', hot = false;
    [YOU, FR, P[2], P[3], P[4]].forEach(hide);
    phone.visible = false; balloons.visible = false; vac.visible = false; dust.forEach((d) => { d.visible = false; }); cake.visible = false; apron.visible = false; sparks.forEach((s) => { s.visible = false; });
    [lbClever, lbBetter, lbVac, lbHost, lbLate, lbSix].forEach((s) => { s.visible = false; });
    A.follow(x0, 0);
    const walkTo = (o, xa, xb, za, zb, u, yaw) => { o.x = lerp(xa, xb, u); o.z = lerp(za, zb, u); o.yaw = yaw; };

    if (bi === 0) {
      // YOU texts "party at 6"; camera glides phone -> clock (6:00) -> poster (7:00). Friend late counter climbs.
      c0.set(6, 0); const typedN = Math.floor(clamp((lt - .5) / 1.5) * 10); const full = 'party at 6'; const sent = lt > 2.25; drawPhone(sent ? '' : full.slice(0, typedN) + (Math.floor(lt * 3) % 2 ? '|' : ''), sent, lt > 2.9);
      place(YOU, x0 - 1.6, 0, -.9, 0, 'idle', .3); YOU.pitch = .12; const tap = Math.sin(lt * 14) * .05; YOU.arms = { lx: -.2, lz: -.1, rx: -1.35 + tap, rz: .25 };
      phone.visible = true; phone.position.set(x0 - 1.2, 1.3, -.12); phone.rotation.set(-.05, -.1, 0); phone.scale.setScalar(.72);
      // reveal: poster highlight pulse at "seven"
      const pu = lt > 5.4 ? Math.sin(clamp((lt - 5.4) / .5) * Math.PI) * .08 : 0; poster0.scale.setScalar(1 + pu);
            counterN = Math.min(12, Math.floor(lt * 2.1)); note = 'always late';
      rig(x0, lt, [[0, [-.9, 1.55, 3.5], [-1.0, 1.5, 3.1], [-1.2, 1.35, -.2], [-1.2, 1.35, -.2], 42, 42], [2.4, [-.8, 1.7, 3.6], [.3, 1.9, 4.9], [-1.2, 1.35, -.2], [.35, 2.1, -3], 42, 46], [4.7, [.3, 2.0, 4.9], [.7, 2.1, 3.6], [.35, 2.1, -3], [1.05, 2.0, -3], 46, 40]], t);
    } else if (bi === 1) {
      // friend arrives at 6:00 with balloons; you hang streamers
      c1.set(6, 0, true); setSwing(strGroup.slice(0, 14), t, .1);
      const wu = smooth((lt - 1.0) / 1.3); place(FR, x0 - 3.3 + wu * 3.3, 0, 1.4 - wu * .1, Math.PI * .5 * (1 - wu), 'walk', 1.0); if (wu >= 1) { FR.anim = 'idle'; } if (wu > .02 && wu < 1) FR.yaw = Math.PI / 2 * (1 - wu * .85); else if (wu >= 1) FR.yaw = 0;
      FR.arms = { lx: -.2, lz: .15, rx: -2.6 + Math.sin(t * 6) * .08, rz: -.1 };
      // after arriving, he walks through the door
      if (lt > 2.9) { const w2 = smooth((lt - 2.9) / 1.2); FR.x = x0 + lerp(0, -.4, w2); FR.z = lerp(1.3, -3.4, w2); FR.anim = 'walk'; FR.speed = 1.0; FR.yaw = lerp(0, -.45, w2) + Math.PI * 0 ; FR.yaw = Math.PI + 0; FR.yaw = 0; }
      balloons.visible = true; { balloons.position.set(FR.x + .65, .9 + Math.sin(t * 2) * .03, FR.z + .2); balloons.rotation.z = Math.sin(t * 1.7) * .04; }
      if (FR.z < 1.2) { /* keep scene */ }
      place(YOU, x0 + 1.1, 0, -3.6, Math.PI * .1, 'idle', .3); YOU.arms = { lx: -2.6 + Math.sin(t * 5) * .15, lz: .1, rx: -2.5 - Math.sin(t * 5) * .15, rz: -.1 }; YOU.pitch = -.05; YOU.vis = lt > 2.9 || true;
      shock = lt > 1.8 && lt < 3.2;
      popL(lbClever, x0, 2.3, 0, 1.7, smooth((lt - .05) / .15) * (1 - smooth((lt - .95) / .25)), Math.sin(lt * 10));
      popL(lbSix, x0 + 1.4, 3.15, -1.6, 1.1, smooth((lt - 1.8) / .15) * (1 - smooth((lt - 3.1) / .3)), Math.sin(lt * 8));
      counterLabel = 'CHORES DONE BY HIM'; counterN = lt > 3.1 ? Math.min(4, Math.floor((lt - 3.1) * 4)) : 0; note = 'early. helpful. suspicious.';
      rig(x0, lt, [[0, [0, 3.4, 3.4], [0, 3.5, 3.2], [0, 3.8, -2], [0, 3.9, -2], 40, 40], [1.0, [-.6, 1.7, 6.4], [.4, 1.7, 6.0], [-.6, 1.2, 1], [.3, 1.2, .5], 44, 44], [2.7, [.8, 1.7, 5.6], [1.0, 1.7, 4.6], [.6, 1.4, -1], [1.2, 1.5, -3], 44, 44]], t);
    } else if (bi === 2) {
      // clock to five, then friend pushes a big vacuum
      const cm = lt < 1.4 ? 6 * 60 : lt < 2.9 ? lerp(6 * 60, 5 * 60, smooth((lt - 1.5) / 1.3)) : 5 * 60; c2.set(Math.floor(cm / 60), cm % 60, lt > 3.0);
      place(FR, x0 + 1.4, 0, -1.2, 0, 'idle', .3); FR.arms = { lx: -.2, lz: .15, rx: -.2, rz: -.15 };
      if (lt > 3.9) { const vu = clamp((lt - 3.9) / 3.7); const px = lerp(-2.6, 2.4, smooth(vu)) - Math.sin(vu * 9) * 0; const vx = x0 + (vu < .5 ? lerp(-1.4, 1.3, smooth(vu * 2)) : lerp(1.3, -.4, smooth((vu - .5) * 2)));
        const face = vu < .5 ? 1 : -1; place(FR, vx - face * .8, 0, -.3, face > 0 ? Math.PI / 2 : -Math.PI / 2, 'walk', 1.3); FR.arms = { lx: -1.1, lz: 0, rx: -1.1, rz: 0 };
        vac.visible = true; vac.position.set(vx - face * .05 + (face > 0 ? .0 : 0), 0, -.3 + Math.sin(lt * 14) * .006); vac.rotation.y = face > 0 ? 0 : Math.PI; vac.scale.setScalar(1.2);
        // dust sucked in
        dust.forEach((d, i) => { const ph = (lt * 1.3 + cr(i, 2)) % 1; d.visible = true; const nx = vx + face * (1.15 * 1.2 + .8 * (1 - ph)); d.position.set(nx, .06 + ph * .08 + (1 - ph) * .1, -.3 + (cr(i, 3) - .5) * .5 * (1 - ph)); d.scale.setScalar(1 - ph * .5); });
        popL(lbVac, vx, 1.6 + Math.sin(lt * 12) * .03, .4, 1.5, smooth((lt - 6.5) / .15) * 1, Math.sin(lt * 10)); }
      else { FR.yaw = 0; }
      shock = lt > 5.4; YOU.vis = false;
      // YOU on the sofa behind, blinking at it
      place(YOU, x0 - 3.1, .55, -1.55, 0, 'sit', .3); YOU.arms = { lx: -.4, lz: -.2, rx: -.4, rz: .2 };
      popL(lbBetter, x0 - .9, 3.5, -2.8, 1.9, smooth((lt - 3.0) / .15) * (1 - smooth((lt - 4.2) / .3)), Math.sin(lt * 9));
      counterLabel = 'CHORES DONE BY HIM'; counterN = 4 + (lt > 4.3 ? Math.min(9, Math.floor((lt - 4.3) * 4)) : 0); note = 'party starts at five';
      rig(x0, lt, [[0, [.5, 2.0, 6.6], [.3, 2.1, 6.2], [.5, 1.5, -1.4], [-.3, 1.8, -2.5], 46, 44], [1.5, [-.5, 2.3, 4.6], [-.9, 2.4, 3.6], [-.9, 2.35, -3], [-.9, 2.4, -3], 40, 40], [3.7, [0, 1.7, 7.0], [.1, 1.6, 6.6], [-.1, .9, -.3], [.2, .9, -.3], 46, 46], [5.9, [2.3, 1.0, 5.0], [1.5, 1.0, 4.6], [.3, .7, -.3], [-.2, .7, -.3], 46, 44]], t);
    } else if (bi === 3) {
      // sparkly house, then the fridge is reorganised
      const swp = clamp(lt / 2.0);
      place(FR, x0 - 2.4 + swp * 4.6, 0, -1.5, Math.PI / 2, 'walk', 1.2); FR.arms = { lx: -1.0 + Math.sin(t * 9) * .5, lz: 0, rx: -1.0 - Math.sin(t * 9) * .5, rz: 0 };
      sparkleAt(t, 36, x0 - 1.0, 1.4, -1.5, 7, 2.4, 2.6, lt < 2.2 ? 1.6 : 0);
      YOU.vis = false;
      // fridge phase
      const fo = smooth((lt - 2.0) / .5); fDoor.rotation.y = -fo * 1.9; fridge.userData.glow.intensity = 1.4 * fo;
      fridge.userData.items.forEach((it, i) => { const ru = clamp((lt - 2.4 - i * .12) / .3); it.visible = fo > .2; const k = smooth(ru); const mess = (cr(i, 5) - .5) * .4; it.position.x = it.userData.x + mess * (1 - k); it.rotation.y = (cr(i, 6) - .5) * 1.0 * (1 - k); it.position.y = it.userData.y + Math.sin(k * Math.PI) * .25; it.userData.lbl.visible = k > .5 || true; });
      if (lt > 2.0) { place(FR, FX0 + 1.4, 0, -.6, -Math.PI * .5 + .35, 'idle', .8); FR.arms = { lx: -.3, lz: .1, rx: -1.7 + Math.sin(t * 6) * .2, rz: -.1 }; FR.pitch = .1; } else if (false) { }
      if (lt > 2.2) sparkleAt(t, 14, FX0, 1.4, -1.8, 1.4, 2.4, .6, smooth((lt - 2.6) / .4));
      counterLabel = 'CHORES DONE BY HIM'; counterN = 13 + Math.floor(lt * 7.5); note = lt < 2.0 ? 'whole house: sparkling' : 'fridge: alphabetized';
      rig(x0, lt, [[0, [-4.2, 1.6, 5.4], [0, 1.7, 5.2], [-3.0, .9, -1.5], [.6, 1.1, -1.5], 46, 46], [1.5, [1.0, 1.7, 5.0], [3.4, 1.6, 3.2], [1.0, 1.2, -1.5], [3.6, 1.35, -2], 46, 44], [2.2, [3.4, 1.5, 1.7], [3.7, 1.55, 1.0], [3.6, 1.35, -2.0], [3.6, 1.35, -2.0], 44, 33]], t);
    } else if (bi === 4) {
      // guests arrive at seven, friend in an apron is the host, you wave behind him
      c4.set(7, 0); setSwing(strGroup.slice(14), t, .1); balloon4.position.y = 1.6 + Math.sin(t * 2) * .03;
      const gs = [P[2], P[3], P[4]]; gs.forEach((g, k) => { const w = smooth((lt - .2 - k * .35) / 1.8); place(g, x0 - 3.2 + w * (3.0 - k * .85), 0, .5 + k * .05, Math.PI / 2 * (1 - smooth((w - .75) / .25) * 1), w < .99 ? 'walk' : 'idle', 1.0); if (w >= .99) { g.yaw = 0; g.arms = { lx: -2.4 + Math.sin(t * 8 + k) * .3, lz: .2, rx: -.2, rz: -.1 }; g.yaw = Math.PI * .1 - k * .15; } });
      place(FR, x0 + .9, 0, -1.15, 0, 'idle', .5); FR.arms = { lx: -.2, lz: .15, rx: -2.6 + Math.sin(t * 7) * .35, rz: -.35 }; FR.pitch = .02; apron.visible = lt > 0; attach(apron, FR, 'torso', [0, -.0, .17]); apron.visible = true;
      place(YOU, x0 + 2.0, 0, -2.9, 0, 'idle', .5); YOU.arms = { lx: -.2, lz: -.1, rx: -2.7 + Math.sin(t * 9) * .3, rz: .35 }; YOU.pitch = 0;
      popL(lbHost, x0 + .9, 2.7, -.6, 1.2, smooth((lt - 3.9) / .15) * 1, Math.sin(lt * 9));
      counterLabel = 'GUESTS AT THE DOOR'; counterN = Math.min(23, Math.floor(lt * 5)); note = 'house: spotless';
      rig(x0, lt, [[0, [-.9, 1.6, 7.4], [-.3, 1.6, 7.0], [-.5, 1.2, 0], [-.2, 1.2, 0], 44, 44], [1.5, [-.2, 1.7, 6.8], [.1, 1.7, 6.4], [-.2, 1.4, -.3], [.3, 1.5, -1.0], 44, 42], [3.4, [.3, 1.8, 6.6], [.5, 1.75, 6.0], [.5, 1.5, -1.0], [.8, 1.55, -1.0], 42, 38]], t);
    } else {
      // you sprint with a cake past a lit window; lamp-post clock: 8:15
      const ru = smooth(clamp(lt / 3.2)); place(YOU, x0 - 3.6 + lerp(ru, clamp(lt / 3.4), .5) * 6.0, 0, .9, Math.PI / 2, 'sprint', 1.6); YOU.pitch = .22; YOU.arms = { lx: -1.7, lz: .1, rx: -1.7, rz: -.1 };
      cake.visible = true; { const h = new THREE.Vector3(YOU.x + .02, 1.05 + Math.abs(Math.sin(t * 13.5)) * .06, YOU.z + .3); cake.position.copy(h); cake.rotation.set(Math.sin(t * 13) * .05, 0, Math.cos(t * 13) * .08); cake.children.forEach((c) => { if (c.userData.flame) c.scale.setScalar(.8 + .4 * Math.sin(t * 30 + c.position.x * 30)); }); }
      shock = true; YOU.extra = 0;
      const mins = Math.min(75, Math.floor(lt * 28)); counterLabel = 'MINUTES YOU WERE LATE'; counterN = mins; hot = true; note = 'to your own party';
      popL(lbLate, YOU.x + .3, 2.5, 1.0, 1.4, smooth((lt - .9) / .15) * 1, Math.sin(lt * 11));
      { const ex = YOU.x + .4, tx = YOU.x + .8; A.cam(ex, 1.9, 7.6, tx, 2.0, -1, lerp(50, 46, p), 0); }
    }
    crowd.setFace(shock ? 'shock' : 'calm'); crowd.update(t);
    if (bi === 4) attach(apron, FR, 'torso', [0, -.05, .2]);
    if (bi === 0) { /* hand holds nothing extra */ }
    A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    hud.counter(counterLabel, String(Math.round(counterN)), note, '', hot || bi >= 2);
    hud.tm(''); hud.pop('', 0);
  } };
}
