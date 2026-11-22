// 687 invention chain: grandma keeps feeding you -> "I'm full" -> second plate -> pockets -> metal detector -> flush -> travelling stove -> couch-size you -> restaurant.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, mat, Crowd, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0xf3e6d0, fogNear: 60, fogFar: 200, clouds: false, skyTop: 0xf6dfb8, skyMid: 0xf8e8c8, skyBot: 0xfaf0dc, shadowExtent: 10, shadowRes: 2048, hemi: 1.75, sunI: 1.55, sunDir: [-.25, .85, .8], exposure: 1.12 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const ramp = (x, a, b) => smooth((x - a) / (b - a));
  const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rbox = (w, h, d, c, o = {}) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * (o.r ?? .2)), o.mat || mat(c, o.m || {})); m.castShadow = o.cast !== false; m.receiveShadow = true; return m; };
  const box = (par, x, y, z, w, h, d, c, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.mat || mat(c, o.m || {})); m.position.set(x, y, z); if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.rx) m.rotation.x = o.rx; m.castShadow = o.cast !== false; m.receiveShadow = true; par.add(m); return m; };
  const put = (par, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); par.add(m); return m; };
  const sph = (par, r, c, x, y, z, sc = [1, 1, 1], o = {}) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), o.mat || mat(c, o.m || { roughness: .6 })); m.position.set(x, y, z); m.scale.set(...sc); m.castShadow = true; par.add(m); return m; };
  const cyl = (par, rt, rb, h, c, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, o.seg || 20, 1, o.open || false), o.mat || mat(c, o.m || {})); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.rz) m.rotation.z = o.rz; m.castShadow = true; m.receiveShadow = true; par.add(m); return m; };
  const grp = (x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); S.add(g); return g; };
  const DX = 0, BX = 16, LX = -16, WZ = -3.3;
  const flat = (par, w, d, x, y, z, map, color) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), map ? new THREE.MeshStandardMaterial({ map, roughness: .8 }) : mat(color, { roughness: .9 })); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; par.add(m); return m; };
  const woodT = (c1, c2) => { const q = cvs(512, 512, (g, w) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? c1 : c2; g.fillRect(0, i * 64, w, 62); g.fillStyle = 'rgba(60,35,15,.35)'; g.fillRect(0, i * 64 + 62, w, 2); for (let j = 0; j < 4; j++) g.fillRect((cr(i, 70 + j) * w) | 0, i * 64, 2, 62); } }); q.t.wrapS = q.t.wrapT = THREE.RepeatWrapping; q.t.repeat.set(4, 3); return q.t; };
  const roomShell = (G, o) => { // floor, back wall, side walls
    flat(G, 18, 14, 0, 0, 2, woodT(o.f1 || '#c79a64', o.f2 || '#b88954'));
    const wp = cvs(512, 512, (g, w) => { g.fillStyle = o.wall; g.fillRect(0, 0, w, w); g.fillStyle = o.stripe; for (let i = 0; i < 16; i++) g.fillRect(i * 32 + 8, 0, 14, w); for (let i = 0; i < 70; i++) { g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(cr(i, 3) * w, cr(i, 4) * w, 3, 3); } }); wp.t.wrapS = wp.t.wrapT = THREE.RepeatWrapping; wp.t.repeat.set(3, 1);
    box(G, 0, 1.9, WZ - .1, 18, 3.8, .2, 0, { mat: new THREE.MeshStandardMaterial({ map: wp.t, roughness: .9 }) });
    box(G, 0, .55, WZ + .02, 18, 1.1, .06, o.wain, { cast: false }); box(G, 0, 1.12, WZ + .04, 18, .08, .1, 0xffffff, { cast: false }); box(G, 0, .06, WZ + .05, 18, .12, .06, 0xffffff, { cast: false });
    for (const s of [-1, 1]) box(G, s * 8, 1.9, 2, .2, 3.8, 14, o.wall);
  };
  // ================================================================ bubbles, labels, sparkles
  const bubs = {}; const bub = (text) => { if (!bubs[text]) { const q = cvs(640, 330, (g, w, h) => { const lines = text.split('\n'); g.fillStyle = '#fff'; g.strokeStyle = '#161616'; g.lineWidth = 14; g.lineJoin = 'round'; g.beginPath(); g.moveTo(w * .2, h - 86); g.lineTo(w * .12, h - 12); g.lineTo(w * .42, h - 92); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.roundRect(14, 14, w - 28, h - 96, 60); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.fillRect(w * .2 + 6, h - 100, w * .2, 22);
      const mx = Math.max(...lines.map((l) => l.length)); const sz = Math.min(lines.length > 1 ? 104 : 140, 560 / (mx * .66)); lines.forEach((l, i) => txt(g, l, w / 2, (h - 96) / 2 + 14 + (i - (lines.length - 1) / 2) * sz * .98, sz, '#161616')); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: q.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); bubs[text] = s; } return bubs[text]; };
  const bubOn = new Set(); const sayAt = (text, x, y, z, a = 1, h = .85) => { const s = bub(text); const k = clamp(a); s.visible = k > .01; s.position.set(x, y, z); s.scale.set(h * .62 * 1.94 * k, h * .62 * k, 1); bubOn.add(s); };
  const spr = (draw, w = 128, h = 128) => { const q = cvs(w, h, draw); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: q.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const heartDraw = (g) => { g.fillStyle = '#ff3b5c'; g.strokeStyle = '#7a0f26'; g.lineWidth = 8; g.beginPath(); g.moveTo(64, 112); g.bezierCurveTo(8, 72, 12, 18, 48, 20); g.bezierCurveTo(60, 21, 64, 32, 64, 36); g.bezierCurveTo(64, 32, 68, 21, 80, 20); g.bezierCurveTo(116, 18, 120, 72, 64, 112); g.fill(); g.stroke(); };
  const starDraw = (g) => { g.fillStyle = '#ffe23a'; g.strokeStyle = '#a8740a'; g.lineWidth = 6; g.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 14 : 58, a = i * Math.PI / 4 - Math.PI / 2; g.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke(); };
  const hearts = []; for (let i = 0; i < 8; i++) hearts.push(spr(heartDraw)); const stars = []; for (let i = 0; i < 10; i++) stars.push(spr(starDraw));
  const bulbS = spr((g) => { g.fillStyle = '#ffe23a'; g.strokeStyle = '#7a5a0a'; g.lineWidth = 7; g.beginPath(); g.arc(64, 54, 36, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#bbb'; g.fillRect(48, 88, 32, 26); g.strokeRect(48, 88, 32, 26); g.strokeStyle = '#ffb02a'; g.lineWidth = 6; for (let i = 0; i < 7; i++) { const a = -Math.PI + i * Math.PI / 6; g.beginPath(); g.moveTo(64 + Math.cos(a) * 48, 54 + Math.sin(a) * 48); g.lineTo(64 + Math.cos(a) * 62, 54 + Math.sin(a) * 62); g.stroke(); } });
  const showSpr = (s, x, y, z, sz, a = 1) => { s.visible = a > .01; s.position.set(x, y, z); s.scale.set(sz * clamp(a), sz * clamp(a), 1); };

  // ================================================================ DINING / KITCHEN (beats 0-2)
  const DG = grp(DX, 0, 0); roomShell(DG, { wall: '#f6e4b4', stripe: '#f0d596', wain: 0x7bb59a });
  const TX = DX + 1.15, TZ = -1.7, TOPY = .93;
  // counter + stove on the left, window on the right, cabinets, clock
  box(DG, -3.6, .46, -2.85, 4.6, .92, .8, 0x5aa9a0); box(DG, -3.6, .96, -2.82, 4.8, .08, .88, 0xf3ede0);
  for (let i = 0; i < 5; i++) { box(DG, -5.4 + i * .9, .46, -2.43, .8, .8, .03, 0x4a948c); box(DG, -5.4 + i * .9 + .3, .55, -2.4, .05, .05, .04, 0xe8e0c8); }
  box(DG, -4.6, 2.3, -3.05, 3.4, 1.0, .5, 0xf1e3c0); for (let i = 0; i < 4; i++) box(DG, -5.8 + i * .85 + .4, 2.3, -2.78, .8, .88, .03, 0xe0cfa0);
  { const st = new THREE.Group(); st.position.set(-2.0, 0, -2.85); DG.add(st); box(st, 0, .47, 0, 1.0, .94, .8, 0xe9e9ee, { m: { metalness: .3, roughness: .4 } }); for (const [x, z] of [[-.25, -.15], [.25, -.15], [-.25, .17], [.25, .17]]) cyl(st, .13, .13, .03, 0x222222, x, .955, z); box(st, 0, .52, .41, .8, .45, .03, 0x2a2a30); }
  { const wg = new THREE.Group(); wg.position.set(DX + 4.2, 2.0, WZ + .05); DG.add(wg); box(wg, 0, 0, 0, 1.9, 1.6, .1, 0xffffff); box(wg, 0, 0, .06, 1.6, 1.3, .04, 0xbfe4ff, { m: { emissive: 0x9fd0f0, emissiveIntensity: .6 } }); box(wg, 0, 0, .1, .06, 1.3, .05, 0xffffff); box(wg, 0, 0, .1, 1.6, .06, .05, 0xffffff); for (const s of [-1, 1]) box(wg, s * 1.1, .05, .14, .45, 1.8, .1, 0xe05a5a); box(wg, 0, 1.0, .12, 2.6, .1, .12, 0x8a5a2e); }
  { const ck = cvs(256, 256, (g) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 128, 118, 0, 7); g.fill(); g.strokeStyle = '#d24a4a'; g.lineWidth = 14; g.stroke(); g.strokeStyle = '#222'; g.lineWidth = 9; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 52); g.moveTo(128, 128); g.lineTo(180, 150); g.stroke(); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.fillStyle = '#222'; g.fillRect(128 + Math.cos(a) * 98 - 4, 128 + Math.sin(a) * 98 - 4, 8, 8); } }); const m = new THREE.Mesh(new THREE.CircleGeometry(.4, 24), new THREE.MeshBasicMaterial({ map: ck.t })); m.position.set(-.1, 2.7, WZ + .06); DG.add(m); }
  { const pf = (x, y, c) => { box(DG, x, y, WZ + .05, .8, .64, .05, 0x7a4a28); box(DG, x, y, WZ + .08, .68, .52, .03, c); sph(DG, .12, 0xfff3c8, x - .1, y + .05, WZ + .1, [1, 1, .2]); }; pf(1.2, 2.55, 0xc9a0d8); pf(-.9, 2.0, 0xa0d0c0); }
  // table with checkered cloth
  const clothT = cvs(256, 256, (g, w) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, w); g.fillStyle = '#e04a4a'; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if ((i + j) % 2) g.fillRect(i * 32, j * 32, 32, 32); }); clothT.t.wrapS = clothT.t.wrapT = THREE.RepeatWrapping;
  const mkTable = (par, x, z, w, d, h, tex) => { const g = new THREE.Group(); g.position.set(x, 0, z); par.add(g); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, sx * (w / 2 - .12), (h - .1) / 2, sz * (d / 2 - .12), .1, h - .1, .1, 0x8a5a2e); const t = rbox(w, .07, d, 0, { mat: new THREE.MeshStandardMaterial({ map: tex || clothT.t, roughness: .85 }), r: .3 }); t.position.y = h - .035; g.add(t); box(g, 0, h - .19, 0, w + .08, .26, d + .08, 0xffffff, { cast: true }); return g; };
  const table = mkTable(DG, TX - DX, TZ, 1.5, 1.3, TOPY - .03);
  const mkChair = (par, x, z, ry, c = 0xb5763a) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; par.add(g); box(g, 0, .48, 0, .56, .07, .56, c); box(g, 0, .86, -.26, .56, .7, .06, c); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, sx * .24, .22, sz * .24, .06, .44, .06, 0x8a5a2e); return g; };
  const chairD = mkChair(DG, -.15 - DX, TZ, Math.PI / 2);
  { const rug = cvs(256, 256, (g, w) => { g.fillStyle = '#d96a4a'; g.fillRect(0, 0, w, w); g.strokeStyle = '#f6d66a'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, w - 28); g.strokeStyle = '#fff'; g.lineWidth = 5; g.strokeRect(34, 34, w - 68, w - 68); }); flat(DG, 5.2, 3.6, 1.2, .01, -1.5, rug.t); }
  // ================================================================ BATHROOM (beat 3)
  const BG = grp(BX, 0, 0); { // tiles
    const tile = cvs(256, 256, (g, w) => { g.fillStyle = '#b6e1ea'; g.fillRect(0, 0, w, w); g.strokeStyle = '#ffffff'; g.lineWidth = 6; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, w); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); } }); tile.t.wrapS = tile.t.wrapT = THREE.RepeatWrapping; tile.t.repeat.set(5, 1.5);
    const ft = cvs(256, 256, (g, w) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = (i + j) % 2 ? '#f4f4f6' : '#6aaed0'; g.fillRect(i * 64, j * 64, 64, 64); } }); ft.t.wrapS = ft.t.wrapT = THREE.RepeatWrapping; ft.t.repeat.set(6, 5);
    flat(BG, 14, 10, 0, 0, 1, ft.t); const wm = new THREE.MeshStandardMaterial({ map: tile.t, roughness: .4 });
    // back wall with a door opening at x=-2.4
    box(BG, -6.6, 1.9, WZ - .1, 6.8, 3.8, .2, 0, { mat: wm }); box(BG, 3.25, 1.9, WZ - .1, 9.7, 3.8, .2, 0, { mat: wm }); box(BG, -2.4, 3.15, WZ - .1, 1.6, 1.3, .2, 0, { mat: wm });
    for (const s of [-1, 1]) box(BG, s * 7, 1.9, 1.5, .2, 3.8, 10, 0, { mat: wm });
    box(BG, -2.4, 1.2, WZ - 1.5, 1.6, 2.5, .1, 0xf1d9a8, { cast: false }); flat(BG, 1.6, 3, -2.4, .02, WZ - 1.5, null, 0xb98a58); const hallL = new THREE.PointLight(0xffe0a0, 6, 6); hallL.position.set(-2.4, 2.2, WZ - 1); BG.add(hallL);
    for (const s of [-1, 1]) box(BG, -2.4 + s * .86, 1.2, WZ - .1, .12, 2.5, .26, 0xffffff); box(BG, -2.4, 2.5, WZ - .1, 1.84, .12, .26, 0xffffff);
    // toilet (against back wall at x=0.9)
    const T = new THREE.Group(); T.position.set(.9, 0, WZ + .65); BG.add(T); const wh = { r: .25, m: { roughness: .15 } };
    const tb = rbox(.62, .42, .86, 0xffffff, wh); tb.position.set(0, .22, .1); T.add(tb); const tk = rbox(.66, .78, .26, 0xffffff, wh); tk.position.set(0, .9, -.18); T.add(tk); const seat = rbox(.58, .07, .72, 0xf4f4f4, wh); seat.position.set(0, .46, .12); T.add(seat);
    const lid = rbox(.54, .06, .62, 0xffffff, wh); lid.position.set(0, .56, -.12); lid.rotation.x = -1.35; T.add(lid); const water = new THREE.Mesh(new THREE.CircleGeometry(.22, 24), new THREE.MeshStandardMaterial({ color: 0x58a8f0, roughness: .05 })); water.rotation.x = -Math.PI / 2; water.position.set(0, .5, .14); T.add(water);
    const swirlT = cvs(128, 128, (g) => { g.fillStyle = '#58a8f0'; g.fillRect(0, 0, 128, 128); g.strokeStyle = '#fff'; g.lineWidth = 9; g.lineCap = 'round'; for (let k = 0; k < 3; k++) { g.beginPath(); for (let i = 0; i < 40; i++) { const a = i * .22 + k * 2.1, r = 6 + i * 1.3; g.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); } g.stroke(); } });
    const swirl = new THREE.Mesh(new THREE.CircleGeometry(.24, 24), new THREE.MeshBasicMaterial({ map: swirlT.t })); swirl.rotation.x = -Math.PI / 2; swirl.position.set(0, .52, .14); T.add(swirl); const lever = box(T, .3, 1.12, -.02, .14, .05, .05, 0xc9ced6, { m: { metalness: .8 } });
    BG.userData = { water, swirl, lever, lid, T };
    const door = new THREE.Group(); door.position.set(-3.2, 0, WZ - .08); BG.add(door); box(door, .8, 1.15, 0, 1.6, 2.3, .09, 0xc98f58); box(door, .8, 1.15, .06, 1.3, 1.95, .03, 0xb87a46); sph(door, .06, 0xe8c24a, 1.35, 1.1, .1); const wc = cvs(256, 128, (g, w, h) => { g.fillStyle = '#2b6cb0'; g.fillRect(0, 0, w, h); txt(g, 'WC', w / 2, 68, 90, '#fff'); }); const wcm = new THREE.Mesh(new THREE.PlaneGeometry(.5, .25), new THREE.MeshBasicMaterial({ map: wc.t })); wcm.position.set(.8, 1.75, .08); door.add(wcm); BG.userData.door = door;
    box(BG, -.6, 2.0, WZ + .05, .8, 1.0, .05, 0xdde9f5, { m: { metalness: .9, roughness: .05 } });
    for (let i = 0; i < 3; i++) box(BG, 3.0, 1.3 + i * .0, WZ + .08, 1.2, .1, .12, 0xeeeeee);
    box(BG, 3.0, 1.9, WZ + .08, 1.0, .8, .06, 0xf4d6e0); }
  // ================================================================ LIVING ROOM / RESTAURANT (beats 4, 5)
  const LG = grp(LX, 0, 0); roomShell(LG, { wall: '#e7cdd9', stripe: '#dfbfd0', wain: 0x8a6aa8, f1: '#b98d5c', f2: '#a97d4c' });
  { const rug = cvs(256, 256, (g, w) => { g.fillStyle = '#6a8fd0'; g.fillRect(0, 0, w, w); g.strokeStyle = '#fff'; g.lineWidth = 8; g.strokeRect(16, 16, w - 32, w - 32); for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.arc(cr(i, 1) * w, cr(i, 2) * w, 8, 0, 7); g.fill(); } }); flat(LG, 7, 4.5, 0, .01, -.2, rug.t); }
  const couch = new THREE.Group(); couch.position.set(-.2, 0, -2.5); LG.add(couch); { const c = 0xd7673f; const base = rbox(3.1, .6, 1.2, c, { r: .15 }); base.position.y = .45; couch.add(base); const back = rbox(3.1, .9, .35, c, { r: .15 }); back.position.set(0, .95, -.45); couch.add(back); for (const s of [-1, 1]) { const arm = rbox(.4, .85, 1.2, c, { r: .2 }); arm.position.set(s * 1.4, .6, 0); couch.add(arm); } for (const s of [-1, 1]) { const cu = rbox(1.2, .22, .95, 0xe97d52, { r: .2 }); cu.position.set(s * .65, .8, .05); couch.add(cu); } sph(couch, .2, 0xf6d66a, -1.0, 1.0, .05, [1, 1, .4]); }
  { const lamp = new THREE.Group(); lamp.position.set(2.5, 0, -2.9); LG.add(lamp); cyl(lamp, .04, .06, 1.5, 0x4a3a2a, 0, .75, 0); cyl(lamp, .22, .36, .4, 0xfff0c0, 0, 1.7, 0, { m: { emissive: 0xffe9a0, emissiveIntensity: .5 } }); const pl = new THREE.Group(); pl.position.set(-3.6, 0, -2.8); LG.add(pl); cyl(pl, .26, .2, .4, 0xb5543a, 0, .2, 0); for (let i = 0; i < 6; i++) sph(pl, .22, 0x3f9a4a, Math.cos(i) * .18, .65 + (i % 3) * .2, Math.sin(i) * .18, [.8, 1.6, .5]); }
  { const tvg = new THREE.Group(); tvg.position.set(LX < 0 ? 3.3 : 0, 0, 0); LG.add(tvg); box(LG, 3.2, 2.2, WZ + .05, .9, .6, .06, 0x1c1c22); }
  const signG = new THREE.Group(); signG.position.set(0, 0, WZ + .3); LG.add(signG); { const sg = cvs(1024, 280, (g, w, h) => { g.fillStyle = '#7a1f2a'; g.beginPath(); g.roundRect(8, 8, w - 16, h - 16, 40); g.fill(); g.strokeStyle = '#f6d66a'; g.lineWidth = 12; g.stroke(); txt(g, "GRANDMA'S", w / 2, 150, 150, '#ffe9a0', { stroke: '#3a0a10', sw: 20 }); for (let i = 0; i < 24; i++) { g.fillStyle = '#fff6c0'; g.beginPath(); g.arc(34 + i * 40.5, 26, 8, 0, 7); g.arc(34 + i * 40.5, h - 26, 8, 0, 7); g.fill(); } });
    const sm = new THREE.Mesh(new RoundedBoxGeometry(3.9, 1.1, .12, 2, .05), [mat(0x5a1018), mat(0x5a1018), mat(0x5a1018), mat(0x5a1018), new THREE.MeshStandardMaterial({ map: sg.t, roughness: .5, emissive: 0xffffff, emissiveMap: sg.t, emissiveIntensity: .35 }), mat(0x5a1018)]); sm.castShadow = true; signG.add(sm); for (const s of [-1, 1]) box(signG, s * 1.7, .9, -.05, .03, 1.0, .03, 0x333333); }
  signG.position.y = 3.0;
  const openS = new THREE.Group(); LG.add(openS); { const og = cvs(256, 128, (g, w, h) => { g.fillStyle = '#2d9a4a'; g.beginPath(); g.roundRect(6, 6, w - 12, h - 12, 24); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 6; g.stroke(); txt(g, 'OPEN', w / 2, 68, 80, '#fff'); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(.7, .35), new THREE.MeshStandardMaterial({ map: og.t, emissive: 0x2d9a4a, emissiveIntensity: .3, emissiveMap: og.t })); put(openS, m, 0, 0, 0); openS.position.set(-3.6, 1.6, WZ + .1); }
  const restTables = []; { const wt = cvs(256, 256, (g, w) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, w); g.fillStyle = '#f0b0b0'; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if ((i + j) % 2) g.fillRect(i * 32, j * 32, 32, 32); }); wt.t.wrapS = wt.t.wrapT = THREE.RepeatWrapping;
    for (const [x, z] of [[-3.4, -1.5], [3.6, -1.5], [-2.8, 1.3]]) { const tg = mkTable(LG, x, z, 1.1, 1.1, .8, wt.t); mkChair(tg, -.8, 0, Math.PI / 2, 0x9a6a3a); mkChair(tg, .8, 0, -Math.PI / 2, 0x9a6a3a); const cd = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .22, 8), mat(0xfff6dc)); cd.position.set(0, .9, 0); tg.add(cd); restTables.push(tg); } }
  const mainT = (() => { const wt = cvs(256, 256, (g, w) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, w); g.fillStyle = '#e04a4a'; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if ((i + j) % 2) g.fillRect(i * 32, j * 32, 32, 32); }); wt.t.wrapS = wt.t.wrapT = THREE.RepeatWrapping; return mkTable(LG, .3, -.4, 2.2, 1.3, .98, wt.t); })();
  { const cd = cyl(mainT, .05, .05, .26, 0xfff6dc, -.8, 1.12, -.35); sph(mainT, .06, 0xffb02a, -.8, 1.3, -.35, [.7, 1.4, .7], { m: { emissive: 0xffa010, emissiveIntensity: 1.5 } }); const card = cvs(256, 160, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = '#7a1f2a'; g.lineWidth = 8; g.strokeRect(6, 6, w - 12, h - 12); txt(g, 'TABLE', w / 2, 56, 56, '#7a1f2a'); txt(g, 'FOR ONE', w / 2, 112, 56, '#7a1f2a'); }); const cm = new THREE.Mesh(new THREE.PlaneGeometry(.4, .25), new THREE.MeshBasicMaterial({ map: card.t, side: THREE.DoubleSide })); put(mainT, cm, .75, 1.06, .45, -.5, 0, 0); }
  const chairBig = mkChair(LG, -2.1, -.4, Math.PI / 2, 0x9a6a3a); chairBig.visible = false;

  // ================================================================ characters
  const crowd = new Crowd(S, 2, 91); const P = crowd.p; const YOU = P[0], G = P[1];
  const setCol = (i, ks, c) => ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c)));
  const flush = () => { for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true; };
  setCol(0, ['torso', 'armL', 'armR'], 0x4f86d9); setCol(0, ['legL', 'legR'], 0x2e3f6e); setCol(0, ['hair'], 0x3a2418); setCol(0, ['head', 'neck', 'handL', 'handR'], 0xe6b88f);
  setCol(1, ['torso', 'armL', 'armR'], 0xd9889f); setCol(1, ['legL', 'legR'], 0xe8cbb0); setCol(1, ['hair'], 0xdcdce2); setCol(1, ['head', 'neck', 'handL', 'handR'], 0xf4d3b6); flush();
  G.h = .82; G.hs = 1.18; YOU.h = 1;
  const reset = (o) => { o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; o.extra = 0; o.speed = .5; o.anim = 'idle'; o.roll = 0; o.y = 0; };
  const place = (o, x, y, z, yaw, anim = 'idle', sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; };
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const armsT = (o, lx, lz, rx, rz) => { o.arms = { lx, lz, rx, rz }; };
  const FWD = -Math.PI / 2;
  // grandma costume
  const gHS = G.hs; const gAttach = []; const onG = (m, key, off, rot) => { gAttach.push([m, key, off, rot]); S.add(m); return m; };
  { const apT = cvs(256, 256, (g, w) => { g.fillStyle = '#fffdf4'; g.fillRect(0, 0, w, w); for (let i = 0; i < 26; i++) { g.fillStyle = ['#e87a90', '#f4b43c', '#7ac0d4'][i % 3]; g.beginPath(); g.arc(cr(i, 8) * w, cr(i, 9) * w, 9, 0, 7); g.fill(); } g.strokeStyle = '#e87a90'; g.lineWidth = 10; g.strokeRect(0, 0, w, w); });
    const apM = new THREE.MeshStandardMaterial({ map: apT.t, roughness: .9 });
    onG(rbox(.5, .62, .03, 0, { mat: apM, r: .3 }), 'torso', [0, -.0, .175]); onG(rbox(.62, .5, .03, 0, { mat: apM, r: .3 }), 'torso', [0, -.52, .31]);
    onG(rbox(.2, .16, .03, 0xfff0c8, { r: .3 }), 'torso', [.12, -.42, .345]); onG(rbox(.05, .4, .03, 0xe87a90, { r: .3 }), 'torso', [-.14, .34, .17], [0, 0, .5]); onG(rbox(.05, .4, .03, 0xe87a90, { r: .3 }), 'torso', [.14, .34, .17], [0, 0, -.5]);
    const sk = cyl(new THREE.Group(), .3, .4, .62, 0x7b5fa8, 0, 0, 0, { open: true, seg: 24 }); sk.material.side = THREE.DoubleSide; sk.castShadow = true; onG(sk, 'torso', [0, -.6, .02]);
    const hairM = mat(0xdcdce2, { roughness: .9 }); onG(sph(new THREE.Group(), .14 * gHS, 0xdcdce2, 0, 0, 0), 'head', [0, .27 * gHS, -.1 * gHS]); onG(sph(new THREE.Group(), .08 * gHS, 0xdcdce2, 0, 0, 0), 'head', [0, .19 * gHS + .17, -.17 * gHS]);
    for (const s of [-1, 1]) onG(sph(new THREE.Group(), .09 * gHS, 0xdcdce2, 0, 0, 0, [.8, 1.1, 1]), 'head', [s * .21 * gHS, .12 * gHS, -.02]);
    const fy = -.03 * gHS, fz = .222 * gHS; const gm = mat(0x3b2f2f, { roughness: .4 });
    for (const s of [-1, 1]) { const rg = new THREE.Mesh(new THREE.TorusGeometry(.058 * gHS, .009, 8, 28), gm); onG(rg, 'head', [s * .078 * gHS, fy + .016 * gHS, fz + .012]); const ln = new THREE.Mesh(new THREE.CircleGeometry(.058 * gHS, 20), new THREE.MeshBasicMaterial({ color: 0xcfe8ff, transparent: true, opacity: .16, depthWrite: false })); onG(ln, 'head', [s * .078 * gHS, fy + .016 * gHS, fz + .008]); }
    onG(rbox(.03, .01, .01, 0x3b2f2f, { r: .1 }), 'head', [0, fy + .026 * gHS, fz + .012]);
  }
  // grandma's own face (the shared decal is hidden for her): features on a transparent plane
  const EXPR = { calm: ['open', 'flat', 'smile', 0], happy: ['arc', 'up', 'grin', .6], stern: ['half', 'angry', 'flat', 0], gasp: ['wide', 'high', 'O', 0], proud: ['arc', 'up', 'grin', 1], smug: ['half', 'smug', 'smirk', 0], shout: ['squint', 'angry', 'yell', .2], dead: ['half', 'flat', 'flat', 0], sly: ['half', 'up', 'smirk', .2] };
  const faceCache = {}; const faceTex = (ex, look) => { const key = ex + look; if (faceCache[key]) return faceCache[key]; const [eye, brow, mouth, blush] = EXPR[ex]; const q = cvs(256, 192, (g) => {
      g.lineCap = 'round'; const ex2 = [78, 178]; const ey = 86;
      if (blush) for (const x of [34, 222]) { const gr = g.createRadialGradient(x, 124, 2, x, 124, 30); gr.addColorStop(0, `rgba(240,90,110,${.7 * blush})`); gr.addColorStop(1, 'rgba(240,90,110,0)'); g.fillStyle = gr; g.fillRect(x - 32, 92, 64, 64); }
      for (const x of ex2) { if (eye === 'arc') { g.strokeStyle = '#3a2a20'; g.lineWidth = 9; g.beginPath(); g.arc(x, ey + 12, 22, Math.PI * 1.12, Math.PI * 1.88); g.stroke(); continue; }
        const rx = eye === 'wide' ? 28 : 24, ry = eye === 'wide' ? 28 : eye === 'squint' ? 11 : 20; g.save(); g.beginPath(); g.ellipse(x, ey, rx, ry, 0, 0, 7); g.clip(); g.fillStyle = '#fff'; g.fillRect(x - 30, ey - 30, 60, 60); g.fillStyle = '#2a1a14'; g.beginPath(); g.arc(x + look * 8, ey + 2, eye === 'wide' ? 8 : 11, 0, 7); g.fill(); g.fillStyle = '#fff'; g.fillRect(x + look * 8 - 3, ey - 6, 5, 5);
        if (eye === 'half') { g.fillStyle = '#f0c8a8'; g.fillRect(x - 30, ey - 30, 60, 30); } g.restore(); g.strokeStyle = '#3a2a20'; g.lineWidth = eye === 'half' ? 8 : 5; g.beginPath(); if (eye === 'half') { g.moveTo(x - rx, ey); g.lineTo(x + rx, ey); } else g.ellipse(x, ey, rx, ry, 0, 0, 7); g.stroke(); }
      g.strokeStyle = '#9a9aa4'; g.lineWidth = 12; const bl = (x0, y0, x1, y1) => { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
      if (brow === 'flat') { bl(52, 50, 104, 50); bl(152, 50, 204, 50); } else if (brow === 'up') { bl(52, 40, 104, 32); bl(152, 32, 204, 40); } else if (brow === 'angry') { bl(52, 34, 106, 54); bl(150, 54, 204, 34); } else if (brow === 'high') { bl(54, 28, 104, 20); bl(152, 20, 202, 28); } else if (brow === 'smug') { bl(52, 54, 104, 50); bl(152, 24, 204, 34); }
      g.strokeStyle = '#a0505a'; g.fillStyle = '#6a2a30'; g.lineWidth = 8;
      if (mouth === 'smile') { g.beginPath(); g.arc(128, 142, 32, .2 * Math.PI, .8 * Math.PI); g.stroke(); } else if (mouth === 'grin') { g.beginPath(); g.moveTo(80, 136); g.quadraticCurveTo(128, 196, 176, 136); g.quadraticCurveTo(128, 148, 80, 136); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(92, 142); g.quadraticCurveTo(128, 166, 164, 142); g.quadraticCurveTo(128, 150, 92, 142); g.fill(); }
      else if (mouth === 'flat') { bl(104, 152, 152, 152); } else if (mouth === 'O') { g.beginPath(); g.ellipse(128, 152, 17, 23, 0, 0, 7); g.fill(); g.stroke(); } else if (mouth === 'smirk') { g.beginPath(); g.moveTo(104, 156); g.quadraticCurveTo(136, 160, 160, 138); g.stroke(); } else if (mouth === 'yell') { g.beginPath(); g.ellipse(128, 150, 36, 26, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#e07a82'; g.beginPath(); g.ellipse(128, 164, 20, 10, 0, 0, 7); g.fill(); }
      g.strokeStyle = 'rgba(140,90,70,.5)'; g.lineWidth = 6; g.beginPath(); g.moveTo(124, 100); g.quadraticCurveTo(116, 122, 128, 124); g.stroke(); }); faceCache[key] = q.t; return q.t; };
  const gFace = new THREE.Mesh(new THREE.PlaneGeometry(.4 * gHS, .3 * gHS), new THREE.MeshBasicMaterial({ map: faceTex('calm', 0), transparent: true, alphaTest: .05 })); S.add(gFace);
  const setGFace = (ex, look = 0) => { gFace.material.map = faceTex(ex, look); };
  const zeroM = new THREE.Matrix4().makeScale(0, 0, 0);
  // belly + pockets on YOU
  const bellyW = new THREE.Group(); S.add(bellyW); const belly = sph(bellyW, .5, 0x4f86d9, 0, 0, 0, [1, 1, 1], { m: { roughness: .75 } }); const bellyBtn = [-1, 0, 1].map((k) => sph(bellyW, .04, 0xfff3d8, 0, 0, 0)); const navel = sph(bellyW, .04, 0x3a5fa0, 0, 0, 0, [1, 1, .3]);
  const bulges = [-1, 1].map((s) => { const g = new THREE.Group(); S.add(g); sph(g, .16, 0x2e3f6e, 0, 0, 0, [1, 1.1, .8]); const flap = rbox(.22, .08, .1, 0x2e3f6e, { r: .3 }); flap.position.set(0, .15, .05); g.add(flap); return g; });

  // ================================================================ props
  const reg = []; const R_ = (o) => { reg.push(o); return o; };
  const mkPlate = (Rr, food = true) => { const g = new THREE.Group(); const d = new THREE.Mesh(new THREE.CylinderGeometry(Rr, Rr * .74, .05, 36), mat(0xffffff, { roughness: .22 })); d.position.y = .025; d.castShadow = d.receiveShadow = true; g.add(d); const rm = new THREE.Mesh(new THREE.TorusGeometry(Rr * .88, .014, 6, 40), mat(0x3a7bd5)); rm.rotation.x = Math.PI / 2; rm.position.y = .052; g.add(rm);
    if (food) { sph(g, Rr * .62, 0xf2cf6a, 0, .1, 0, [1, .5, 1]); sph(g, Rr * .5, 0xd24a2a, 0, .2 * Rr + .1, 0, [1, .4, 1]); for (let i = 0; i < 4; i++) sph(g, Rr * .15, 0x7a3a1c, Math.cos(i * 1.6) * Rr * .3, .2 * Rr + .2, Math.sin(i * 1.6) * Rr * .3); sph(g, Rr * .09, 0x3f9a4a, 0, .2 * Rr + .3, 0, [1.5, .5, 1]); } S.add(g); g.visible = false; return R_(g); };
  const plateEmpty = mkPlate(.36, false); sph(plateEmpty, .05, 0xd9a05a, .08, .06, .04, [1.4, .5, 1]); const plateBig = mkPlate(.42); const plateBig2 = mkPlate(.58); const plateHand = mkPlate(.3);
  const casserole = R_(new THREE.Group()); S.add(casserole); casserole.scale.setScalar(.8); { const d = rbox(1.3, .38, .85, 0xf0a63a, { r: .15 }); d.position.y = .19; casserole.add(d); const top = rbox(1.14, .1, .7, 0xf6d66a, { r: .3 }); top.position.y = .4; casserole.add(top); for (let i = 0; i < 9; i++) sph(casserole, .09, 0xc7742a, -.44 + (i % 5) * .22, .47, -.2 + Math.floor(i / 5) * .4 + (i % 2) * .1, [1, .6, 1]); for (const s of [-1, 1]) { const h = rbox(.14, .1, .3, 0xd88a2a, { r: .3 }); h.position.set(s * .72, .32, 0); casserole.add(h); } const pat = cvs(256, 64, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#e87a90' : '#7ac0d4'; g.fillRect(i * 32, 0, 32, h); } }); } casserole.visible = false;
  const steam = []; for (let i = 0; i < 6; i++) { const s = spr((g) => { const gr = g.createRadialGradient(64, 64, 4, 64, 64, 60); gr.addColorStop(0, 'rgba(255,255,255,.85)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }); s.material.depthTest = true; s.renderOrder = 3; steam.push(s); }
  const mkFood = (k) => { const g = new THREE.Group(); const add = (geo, c, x = 0, y = 0, z = 0, sc = [1, 1, 1], rot = [0, 0, 0]) => { const q = new THREE.Mesh(geo, mat(c, { roughness: .55 })); q.position.set(x, y, z); q.scale.set(...sc); q.rotation.set(...rot); q.castShadow = true; g.add(q); return q; };
    const kk = k % 6; if (kk === 0) { add(new THREE.SphereGeometry(.1, 14, 10), 0xd9a05a, 0, 0, 0, [1.5, .85, 1]); add(new THREE.SphereGeometry(.03, 8, 6), 0xf0c888, 0, .08, 0, [4, .5, 1]); } else if (kk === 1) { add(new THREE.CylinderGeometry(.06, .04, .22, 10), 0xb5651d, 0, 0, 0, [1, 1, 1], [0, 0, 1.2]); add(new THREE.CylinderGeometry(.018, .018, .12, 8), 0xf5f0e0, -.16, -.05, 0, [1, 1, 1], [0, 0, 1.2]); add(new THREE.SphereGeometry(.03, 8, 6), 0xf5f0e0, -.22, -.08, 0); } else if (kk === 2) add(new THREE.SphereGeometry(.09, 12, 10), 0x7a3a1c); else if (kk === 3) add(new THREE.CylinderGeometry(.12, .12, .09, 3), 0xf6c431, 0, 0, 0, [1, 1, 1], [Math.PI / 2, 0, .4]); else if (kk === 4) { add(new THREE.CylinderGeometry(.05, .05, .24, 10), 0xf4cf2a, 0, 0, 0, [1, 1, 1], [0, 0, 1.5]); add(new THREE.CylinderGeometry(.03, .06, .12, 8), 0x4f9a3a, .16, 0, 0, [1, 1, 1], [0, 0, 1.5]); } else { add(new THREE.BoxGeometry(.2, .04, .18), 0xe8c88a); add(new THREE.BoxGeometry(.2, .03, .18), 0x4f9a3a, 0, .04, 0); add(new THREE.BoxGeometry(.2, .04, .18), 0xe8c88a, 0, .08, 0); } S.add(g); g.visible = false; return R_(g); };
  const foods = []; for (let i = 0; i < 18; i++) foods.push(mkFood(i));
  const foodAt = (i, x, y, z, s = 1, r = 0) => { const f = foods[i]; f.visible = s > .02; f.position.set(x, y, z); f.rotation.set(r * .7, r, r * .4); f.scale.setScalar(s); };
  const wand = R_(new THREE.Group()); S.add(wand); { box(wand, 0, 0, 0, .06, .5, .06, 0x222226); const pd = rbox(.14, .04, .3, 0x2a2a30, { r: .3 }); pd.position.set(0, .3, .08); wand.add(pd); box(wand, 0, .3, .08, .08, .05, .2, 0xffd23a); } const wandLed = sph(wand, .035, 0xff2020, 0, .06, .03, [1, 1, 1], { m: { emissive: 0xff0000, emissiveIntensity: 2 } }); wand.visible = false;
  const ladle = R_(new THREE.Group()); S.add(ladle); { cyl(ladle, .02, .02, .75, 0x9a9aa6, 0, .1, 0, { m: { metalness: .8, roughness: .3 } }); const bowl = new THREE.Mesh(new THREE.SphereGeometry(.12, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xbfc4cf, { metalness: .8, roughness: .3 })); bowl.position.y = .5; bowl.scale.set(1, .8, 1); bowl.rotation.x = Math.PI; ladle.add(bowl); } ladle.visible = false;
  const cart = R_(new THREE.Group()); S.add(cart); { box(cart, 0, .55, 0, 1.0, .06, .7, 0xcfd3da, { m: { metalness: .6, roughness: .35 } }); for (const [x, z] of [[-.45, -.3], [.45, -.3], [-.45, .3], [.45, .3]]) { box(cart, x, .3, z, .05, .5, .05, 0x777b83); const w = cyl(cart, .08, .08, .05, 0x222226, x, .08, z, { rz: Math.PI / 2 }); } box(cart, 0, .3, 0, .9, .04, .6, 0x9a9faa); cyl(cart, .3, .34, .12, 0x2a2a30, 0, .64, 0); cyl(cart, .24, .24, .5, 0xd0d4dc, 0, .95, 0, { m: { metalness: .7, roughness: .3 } }); cyl(cart, .27, .27, .04, 0xd0d4dc, 0, 1.2, 0, { m: { metalness: .7 } }); sph(cart, .34, 0xd24a2a, 0, 1.18, 0, [.85, .3, .85]); for (const s of [-1, 1]) box(cart, s * .3, 1.0, 0, .05, .08, .08, 0x222226); box(cart, 0, .85, -.4, .8, .06, .05, 0x3a3a42); for (const s of [-1, 1]) box(cart, s * .38, .75, -.38, .05, .5, .05, 0x3a3a42); }
  const flames = []; for (let i = 0; i < 6; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(.04, .14, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffb02a : 0x4aa8ff })); f.visible = false; S.add(f); flames.push(f); }
  const stovePot = R_(new THREE.Group()); S.add(stovePot); { cyl(stovePot, .22, .2, .3, 0xd0d4dc, 0, .15, 0, { m: { metalness: .7, roughness: .3 } }); sph(stovePot, .2, 0xd24a2a, 0, .3, 0, [1, .3, 1]); } stovePot.visible = false;
  const napkin = R_(rbox(.4, .5, .05, 0xffffff, { r: .3 })); S.add(napkin); napkin.visible = false;
  // simple menu board (plain)
  const menuB = R_(rbox(.36, .5, .04, 0xfff0c0, { r: .2 })); S.add(menuB); menuB.visible = false; const pad = R_(rbox(.2, .26, .03, 0xffffff, { r: .2 })); S.add(pad); pad.visible = false;
  const towel = R_(rbox(.3, .14, .22, 0xffffff, { r: .3 })); S.add(towel); towel.visible = false; const bowtie = R_(new THREE.Group()); S.add(bowtie); for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.ConeGeometry(.07, .12, 4), mat(0xc8281e)); c.rotation.z = s * Math.PI / 2; c.position.x = s * .06; bowtie.add(c); } bowtie.visible = false;
  const buttons = [0, 1].map(() => sph(S, .05, 0xfff3d8, 0, 0, 0)); buttons.forEach((b) => { b.visible = false; });
  const waves = []; for (let i = 0; i < 3; i++) { const w = new THREE.Mesh(new THREE.TorusGeometry(.3, .02, 6, 28, Math.PI), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })); w.visible = false; S.add(w); waves.push(w); }

  // ================================================================ camera
  const FOVK = 1.2; const E = new THREE.Vector3(), T2 = new THREE.Vector3(); const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .5);
    const e0 = s[1], e1 = s[2], g0 = s[3], g1 = s[4]; E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .02 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .02 + Math.cos(t * 57) * shake; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u) * FOVK, Math.sin(t * .7) * .006); };
  const D = (x, y, z) => [x, y, z];
  const itemFly = (i, a, b, u, arc = .5, s0 = 1, s1 = 1) => { foodAt(i, lerp(a.x, b.x, u), lerp(a.y, b.y, u) + Math.sin(u * Math.PI) * arc, lerp(a.z, b.z, u), lerp(s0, s1, u), u * 6 + i); };
  const sceneVis = (z) => { DG.visible = z === 0; BG.visible = z === 1; LG.visible = z === 2; };
  const COUNT = [[0, 1], [1, 2], [2, 7], [7, 31], [31, 112], [112, 482]];

  // ================================================================ frame
  const inner = ({ t, bi, lt, p }, pre) => {
    bi = Math.min(bi, 5); const post = [];
    for (const o of P) reset(o); for (const r of reg) r.visible = false; for (const f of foods) f.visible = false; bubOn.forEach((s) => { s.visible = false; }); bubOn.clear();
    hearts.forEach((s) => { s.visible = false; }); stars.forEach((s) => { s.visible = false; }); bulbS.visible = false; waves.forEach((w) => { w.visible = false; }); flames.forEach((f) => { f.visible = false; }); steam.forEach((s) => { s.visible = false; });
    sceneVis(bi <= 2 ? 0 : bi === 3 ? 1 : 2); chairD.visible = bi <= 1; chairBig.visible = false; signG.visible = openS.visible = bi === 5; mainT.visible = bi === 5; restTables.forEach((q) => { q.visible = bi === 5; }); couch.visible = true; napkin.visible = false;
    let shake = 0, gx = ['calm', 0], bellyK = .55, bulgeK = 0, zone = 0, youFace = false; let counter = [COUNT[bi][0], COUNT[bi][1]];
    const L = lt; const w = (a, b) => ramp(L, a, b);
    const gBob = Math.sin(t * 7) * .02;
    if (bi === 0) {
      zone = DX; bellyK = .55 + .05 * Math.sin(t * 2); 
      // you at the table
      place(YOU, DX - .15, -.3, TZ, .85, 'sit', .3); const pat = w(2.2, 2.5); YOU.pitch = -.12 * pat;
      armsT(YOU, lerp(-1.2, -1.0 + .18 * Math.sin(t * 15), pat), lerp(.1, -.05, pat), lerp(-1.1, -.95 - .18 * Math.sin(t * 15 + 1), pat), lerp(-.1, .05, pat)); bellyK = .55 + .07 * pat * (1 + Math.sin(t * 15) * .25);
      if (L > 2.3) sayAt("I'M FULL!", DX + .2, 2.55, TZ + .2, ramp(L, 2.3, 2.45) * (1 - ramp(L, 4.1, 4.28)), .95);
      // grandma walks in with the casserole
      const walkIn = w(.05, 1.15), putDown = w(1.2, 1.7);
      const gxx = lerp(DX + 6.2, DX + 2.35, walkIn); place(G, gxx, 0, TZ + .1, lerp(-1.4, -.9, walkIn), walkIn < 1 ? 'walk' : 'idle', .9);
      if (walkIn >= 1) G.yaw = -.9;
      armsT(G, FWD + .1 + putDown * .15, .25, FWD + .1 + putDown * .15, -.25);
      post.push(() => { const hl = hp(G, 'handL'), hr = hp(G, 'handR'); const mid = hl.clone().add(hr).multiplyScalar(.5); const tp = V3(DX + 1.15, TOPY + .02, TZ - .3); casserole.visible = true; const q = putDown; casserole.position.set(lerp(mid.x, tp.x, q), lerp(mid.y - .02, tp.y, q), lerp(mid.z + .1, tp.z, q)); casserole.rotation.y = lerp(.9, 0, q) * 0; });
      gx = L < .4 ? ['calm', 0] : L < 2.3 ? ['shout', -1] : L < 3.1 ? ['gasp', -1] : ['dead', -1]; if (L > .5 && L < 1.9) gx = ['shout', -1]; if (L >= 1.9 && L < 2.3) gx = ['happy', -1];
      if (L > .45 && L < 1.95) sayAt('EAT!', gxx - .5, 2.35, TZ + .3, ramp(L, .45, .6) * (1 - ramp(L, 1.8, 1.95)), .85);
      plateEmpty.visible = false;
      youFace = L > 2.3 && L < 3.3;
    } else if (bi === 1) {
      zone = DX; bellyK = .6 + .03 * Math.sin(t * 2);
      place(YOU, DX - .15, -.3, TZ, .85, 'sit', .3); const tap = w(.05, .3); armsT(YOU, -1.15, .1, lerp(-1.0, -2.55, tap) + .05 * Math.sin(t * 12) * tap, lerp(-.05, -.4, tap)); YOU.pitch = -.08;
      if (L > .1 && L < 1.4) showSpr(bulbS, DX - .15, 2.7, TZ, .75, ramp(L, .1, .3) * (1 - ramp(L, 1.2, 1.4)));
      const exitU = w(2.5, 3.3), backU = w(3.1, 3.9); const hips = w(1.0, 1.3) * (1 - w(2.3, 2.5));
      let gxx = DX + 2.35; let walking = false;
      if (L >= 2.3 && L < 3.1) { gxx = lerp(DX + 2.35, DX + 6.4, exitU); walking = true; } else if (L >= 3.1) { gxx = lerp(DX + 6.4, DX + 2.35, backU); walking = backU < 1; }
      place(G, gxx, 0, TZ + .1, walking ? (L < 3.1 ? 1.5 : -1.4) : -.9, walking ? 'walk' : 'idle', .95);
      if (!walking && L < 2.3) { armsT(G, lerp(FWD, -.4, hips), lerp(.2, -.75, hips), lerp(FWD, -.4, hips), lerp(-.2, .75, hips)); if (L > 1.4 && L < 2.3) { const wg = Math.sin(t * 13) * .2; G.arms.rx = -2.7 + wg; G.arms.rz = .2; } G.yaw = -.9 + (L > 1.0 && L < 2.3 ? Math.sin(t * 9) * .1 : 0); }
      if (walking) { const carry = L >= 3.1 && L < 3.95; if (carry) armsT(G, FWD + .15, .2, FWD + .15, -.2); else armsT(G, -.3, -.2, -.3, .2); }
      if (!walking && L >= 3.9) { const sl = w(3.9, 4.1); armsT(G, -.4, -.75, -.4, .75); }
      gx = L < .95 ? ['gasp', -1] : L < 2.3 ? ['stern', -1] : L < 3.1 ? ['smug', 0] : L < 3.95 ? ['sly', -1] : ['smug', -1];
      post.push(() => { casserole.visible = true; casserole.position.set(DX + 1.15, TOPY + .02, TZ - .3); plateEmpty.visible = false;
        const tp = V3(DX + 1.0, TOPY + .02, TZ - .05); plateBig.visible = true; if (L < 3.1) plateBig.visible = false; else if (L < 3.95) { const hl = hp(G, 'handL'), hr = hp(G, 'handR'); const mid = hl.clone().add(hr).multiplyScalar(.5); plateBig.position.set(mid.x, mid.y + .04, mid.z + .1); } else { const d = ramp(L, 3.95, 4.15); const dy = 1 - d; plateBig.position.set(DX + 1.05, TOPY + .02 + Math.abs(Math.sin(d * Math.PI * 2.4)) * .0 + (L < 4.2 ? .18 * (1 - d) : 0), TZ + .05); } });
      if (L > 1.0 && L < 3.1) sayAt('THAT\'S\nIMPOSSIBLE!', DX + 1.75, 2.75, TZ + .2, ramp(L, 1.0, 1.15) * (1 - ramp(L, 2.9, 3.05)), 1.05);
      if (L > 3.95) shake = .045 * Math.max(0, 1 - (L - 3.95) / .25);
    } else if (bi === 2) {
      zone = DX; bellyK = .62; bulgeK = ramp(L, .2, 1.5); const yx = DX - .05, yz = -1.2;
      place(YOU, yx, 0, yz, 1.15, 'idle', .5); YOU.arms = null;
      const stuff = (i, t0) => { const u = ramp(L, t0, t0 + .3); return u; };
      // you hold the plate in the left hand and stuff items into hip pockets with the right
      const phase = L < 1.7 ? Math.sin(L * 9) : 0; armsT(YOU, FWD + .55, -.15, L < 1.7 ? -.65 + .5 * Math.max(0, phase) : -.2, .35);
      if (L > 2.2 && L < 3.4) { armsT(YOU, FWD + .55, -.15, -2.4, .3); }
      if (L >= 3.4 && L < 4.3) { armsT(YOU, -2.5, -.3, -2.5, .3); YOU.extra = .05; }
      if (L >= 4.3 && L < 5.5) { armsT(YOU, -2.3 + .2 * Math.sin(t * 16), -.3, -2.3 - .2 * Math.sin(t * 16), .3); }
      if (L >= 5.5) armsT(YOU, -1.3, -.55, -1.3, .55);
      youFace = L >= 3.4;
      // grandma: stove (back turned) -> storms over -> pats down -> wand
      const walkU = w(3.5, 4.35), turnA = w(3.4, 3.75);
      const stoveX = DX + 2.2, stoveZ = -2.7, patX = DX + .95, patZ = -.75;
      if (L < 3.5) { place(G, stoveX, 0, stoveZ, Math.PI, 'idle', .5); armsT(G, FWD + .3, .1 + .1 * Math.sin(t * 6), FWD + .3, -.1); gx = ['calm', 0]; if (L > .3 && L < 1.7) gx = ['happy', 0]; }
      else { const gx2 = lerp(stoveX, patX, walkU), gz2 = lerp(stoveZ, patZ, walkU); place(G, gx2, 0, gz2, lerp(Math.PI, -1.15, turnA), walkU < 1 ? 'walk' : 'idle', 1.0); gx = ['stern', -1];
        if (walkU < 1) armsT(G, -.4, -.3, -.4, .3); else if (L < 5.3) { const pt = Math.sin(L * 20) * .16; armsT(G, -1.0 + pt, .0, -1.0 - pt, .0); } else armsT(G, -.3, -.2, -1.5, .3); }
      if (L >= 5.3) { const q = w(5.3, 5.6); G.yaw = lerp(-1.15, -.35, q); gx = ['dead', 0]; armsT(G, -.4, -.25, -1.35 + .08 * Math.sin(t * 9), .12); }
      // flying food into pockets (0.2..1.6)
      const fl = (i, t0, side) => { const u = (L - t0) / .35; if (u > 0 && u < 1) { const hpv = V3(yx + .55 * Math.sin(1.15) * 0 + .1, .5, yz); itemFly(i, V3(yx + .45, 1.25, yz + .25), V3(yx + side * .3 * .4 - .1, .75, yz + .2), u, .35, 1, .3); } };
      for (let i = 0; i < 5; i++) fl(i, .25 + i * .28, i % 2 ? 1 : -1);
      // dropped food (4.6..) falls out of pockets
      for (let i = 0; i < 9; i++) { const t0 = 4.55 + i * .13; const u = L - t0; if (u > 0) { const dx = (i % 3 - 1) * .32 + (cr(i, 5) - .5) * .3, dz = .18 + (i % 2) * .3; const sx = yx + .2, sy = .8, sz = yz + .15; const r = lib.dropBounce(sy, 0, u, .35); foodAt(5 + i, sx + dx * Math.min(1, u * 2.5), r.y + .06, sz + dz * Math.min(1, u * 2.5), 1, i * 1.3); } }
      post.push(() => { plateHand.visible = L < 3.3; const hl = hp(YOU, 'handL'); plateHand.position.set(hl.x, hl.y + .02, hl.z + .12); plateHand.rotation.set(.2, 0, .1);
        if (L > 2.8 && L < 4.3) { showSpr(stars[0], yx + .2, 2.5, yz + .2, 0); }
        if (L >= 5.35) { wand.visible = true; const hr = hp(G, 'handR'); const sc = Math.sin((L - 5.35) * 4.2) * .5; wand.position.set(hr.x + .05, hr.y + .05, hr.z + .12); wand.rotation.set(0, .3, Math.PI / 2 + .35 * sc); wand.scale.setScalar(.85); wandLed.visible = true; wandLed.material.emissiveIntensity = Math.sin(t * 40) > 0 ? 3 : .2; }
      });
      if (L > 5.5) { const on = Math.sin(t * 14) > -.3; sayAt('BEEP BEEP!', DX + .5, 2.3, -.8, on ? ramp(L, 5.5, 5.65) : 0, .85); }
      if (L < 2.2) showSpr(stars[1], 0, -9, 0, 0, 0);
    } else if (bi === 3) {
      zone = BX; bellyK = .8; bulgeK = 0;
      const toiletX = BX + .9, ty = WZ + .65;
      const run = w(.1, 1.15); const yx = lerp(BX - 3.4, BX - .55, run);
      const flee = w(3.1, 3.8); place(YOU, yx + flee * 7, 0, -2.0, run < 1 ? 1.3 : .95, (run < 1 || flee > 0) ? 'sprint' : 'idle', .65); if (flee > 0) YOU.yaw = 1.5; const tip = w(1.2, 1.5);
      armsT(YOU, FWD + .15, .1, FWD + .15 - tip * .5, -.1); if (L > 2.4) armsT(YOU, -2.6 + .2 * Math.sin(t * 20), -.1, -2.6, .1); youFace = L > 2.4;
      const flushU = w(1.45, 1.75);
      const sw = BG.userData.swirl, lev = BG.userData.lever; sw.visible = L > 1.5; sw.rotation.z = -t * 9; sw.scale.setScalar(Math.max(.01, 1 - w(1.55, 2.3))); lev.position.y = 1.12 - .04 * (L > 1.45 && L < 1.75 ? 1 : 0);
      post.push(() => { plateHand.visible = L < 1.5; const hl = hp(YOU, 'handL'), hr = hp(YOU, 'handR'); const mid = hl.clone().add(hr).multiplyScalar(.5); plateHand.position.set(mid.x, mid.y + .05, mid.z + .1); plateHand.rotation.set(0, 0, -tip * .9);
        for (let i = 0; i < 6; i++) { const u = (L - (1.25 + i * .05)) / .5; if (u > 0 && u < 1) foodAt(i, mid.x + .2 + u * .3, lerp(mid.y, .5, u * u), mid.z + .2 + u * .2, 1 - u * .5, u * 5 + i); } });
      const door = BG.userData.door; const open = w(2.35, 2.55); door.rotation.y = -1.75 * open;
      sw.visible = L > 1.5 && L < 2.4; if (L > 1.5 && L < 2.6) sayAt('FLUSH!', BX - .6, 2.55, -2.6, ramp(L, 1.5, 1.6) * (1 - ramp(L, 2.3, 2.5)), .8);
      // grandma appears at the door, hears, rolls in the stove
      const gz0 = WZ - .2; const push = w(3.65, 4.6);
      const hears = w(2.4, 2.6);
      const cz = lerp(WZ - .6, -1.2, push), gzz = cz - .85;
      if (L > 2.35) { place(G, BX - 2.4, 0, L < 3.65 ? gz0 : gzz, 0, push > 0 && push < 1 ? 'walk' : 'idle', .9); if (L >= 3.65) G.x = BX - 2.4 + push * 1.5; }
      else G.vis = false;
      if (L > 2.35 && L < 3.65) { armsT(G, -.4, -.7, -2.5, .5); G.yaw = .1 * Math.sin(t * 30) * (L < 2.8 ? 1 : 0); }
      else if (L >= 3.65) { armsT(G, FWD + .1, .1, -2.55, .15); }
      gx = L < 3.1 ? ['stern', 1] : L < 3.65 ? ['smug', 0] : ['happy', 0];
      if (L >= 3.4 && L < 3.7) gx = ['smug', 0];
      if (L > 2.55 && L < 3.7) sayAt('I HEARD\nTHAT.', BX - 1.6, 3.15, -2.8, ramp(L, 2.55, 2.7) * (1 - ramp(L, 3.5, 3.65)), 1.0);
      if (L > 3.7) { cart.visible = true; cart.position.set(BX - 2.4 + push * 1.5, 0, cz); const fl = (L * 14); steam.forEach((s, i) => { const u = ((t * .8 + i / 6) % 1); s.visible = true; s.position.set(cart.position.x + (cr(i, 4) - .5) * .25, 1.35 + u * .9, cart.position.z); s.scale.setScalar(.35 + u * .5); s.material.opacity = (1 - u) * .8; });
        flames.forEach((f, i) => { f.visible = true; const a = i / 6 * 6.28; f.position.set(cart.position.x + Math.cos(a) * .2, .72, cart.position.z + Math.sin(a) * .2); f.scale.set(1, .8 + .5 * Math.sin(t * 30 + i), 1); });
        post.push(() => { ladle.visible = true; const hr = hp(G, 'handR'); ladle.position.set(hr.x - .02, hr.y + .05, hr.z + .02); ladle.rotation.set(.1, 0, -.1 + Math.sin(t * 5) * .1); }); }
      else if (L > 2.5) post.push(() => { ladle.visible = true; const hr = hp(G, 'handR'); ladle.position.set(hr.x, hr.y + .05, hr.z + .02); ladle.rotation.set(.1, 0, -.1); });
      if (L > 2.55 && L < 3.2) { waves.forEach((wv, i) => { const u = ((L - 2.55 - i * .12) / .6); wv.visible = u > 0 && u < 1; wv.position.set(lerp(toiletX, BX - 2.0, u), 1.2, -2.8); wv.rotation.set(0, 0, Math.PI / 2); wv.scale.setScalar(.6 + u * .8); wv.material.opacity = 1 - u; }); }
    } else if (bi === 4) {
      zone = LX; bellyK = 1.0 + .03 * Math.sin(t * 3); const sc = 1.45; const yx = LX + .7;
      place(YOU, yx, -.32 * sc, -.9, .35, 'sit', .3); YOU.scale = sc; armsT(YOU, -.8, -.95, -.8, .95);
      const happy = w(1.9, 2.2);
      if (L > .6 && L < 1.6) buttons.forEach((b, i) => { const u = (L - .6 - i * .15) / .6; b.visible = u > 0 && u < 1; b.position.set(yx + (i ? .7 : -.7) * u, 1.9 + Math.sin(u * 3.1) * 1.1 - u * .6, -.2 + u * .8); b.scale.setScalar(1.8); });
      // grandma proud
      place(G, LX + 2.95, 0, -.5, -.75, 'idle', .5); armsT(G, -1.15 + .04 * Math.sin(t * 3), .45, -1.15, -.45); gx = L < 1.6 ? ['gasp', -1] : ['proud', -1]; if (L > 1.6 && L < 2.1) gx = ['happy', -1];
      if (L >= 2.1) { G.pitch = -.05; armsT(G, -1.35, .15, -1.35, -.15); }
      if (L > 2.15) { for (let i = 0; i < 5; i++) { const u = ((t * .7 + i / 5) % 1); showSpr(hearts[i], LX + 2.6 + (i - 2) * .38 + Math.sin(u * 6 + i) * .12, 1.9 + u * .9, -.2, .32 * (1 - u * .3), (1 - u) * ramp(L, 2.15, 2.4)); } for (let i = 0; i < 8; i++) { const a = t * 1.6 + i * .785; showSpr(stars[i], LX + 2.95 + Math.cos(a) * .85, 1.3 + Math.sin(a * 1.3) * .45, -.1, .2 + .08 * Math.sin(t * 9 + i), ramp(L, 2.15, 2.4)); } }
      youFace = L < 1.2;
    } else {
      zone = LX; bellyK = 1.0; const sc = 1.0; const yx = LX - .9;
      const sign = w(.1, .65); const bounce = Math.max(0, 1 - ramp(L, .6, 1.2)) * Math.sin((L - .6) * 16) * .15;
      signG.position.y = lerp(6.4, 3.65, sign) + (L > .6 ? bounce * .5 : 0); openS.visible = L > .9; const popT = w(.9, 1.2); openS.scale.setScalar(.2 + .8 * popT);
      mainT.scale.setScalar(.2 + .8 * w(.5, 1.0)); restTables.forEach((q, i) => { q.scale.setScalar(.2 + .8 * w(.8 + i * .15, 1.3 + i * .15)); });
      place(YOU, LX - .95, -.32, -.4, 1.4, 'sit', .3); YOU.scale = 1.2; YOU.y = -.32 * 1.2 + .12; chairBig.visible = false; armsT(YOU, -1.45, -.3, -1.45, .3); bellyK = 1.0 + .015 * Math.sin(t * 3);
      post.push(() => { attach(napkin, YOU, 'torso', [0, .0, .9]); napkin.visible = L > 1.6; });
      // grandma waiter
      const slide = w(1.1, 1.8); place(G, lerp(LX + 4.6, LX + 2.0, slide), 0, -.45, -.95, slide < 1 ? 'walk' : 'idle', .9);
      if (slide >= 1) { armsT(G, -.7, .15, -1.7, -.3); } else armsT(G, -.4, -.2, -.4, .2);
      gx = L < 1.8 ? ['happy', -1] : L < 2.7 ? ['proud', -1] : ['happy', -1];
      post.push(() => { bowtie.visible = L > 1.2; attach(bowtie, G, 'torso', [0, .36, .19]); bowtie.visible = L > 1.2;
        towel.visible = L > 1.2; const hl = hp(G, 'handL'); towel.position.set(hl.x, hl.y + .1, hl.z); pad.visible = L > 1.8; const hr = hp(G, 'handR'); pad.position.set(hr.x + .02, hr.y + .06, hr.z + .1); pad.rotation.set(-.4, G.yaw, 0); menuB.visible = false; });
      if (L > 2.7) sayAt('TABLE FOR\nONE?', LX + 1.5, 2.85, -.3, ramp(L, 2.7, 2.85), .95);
      if (L > 2.0 && L < 2.7) sayAt('WELCOME!', LX + 1.5, 2.85, -.3, ramp(L, 2.0, 2.15) * (1 - ramp(L, 2.55, 2.7)), .8);
      youFace = L > 2.8;
    }
    // ---- grandma detail / face
    if (G.vis) { setGFace(gx[0], gx[1]); gFace.visible = true; } else gFace.visible = false;
    for (const [m, k, off, rot] of gAttach) { attach(m, G, k, off, rot || [0, 0, 0]); m.visible = G.vis; }
    crowd.setFace(youFace ? 'shock' : 'calm'); crowd.update(t); crowd.parts.face.setMatrixAt(1, zeroM); crowd.parts.face.instanceMatrix.needsUpdate = true;
    attach(gFace, G, 'head', [0, -.03 * gHS, .222 * gHS + .004]); gFace.visible = G.vis;
    // belly + pockets
    bellyW.visible = YOU.vis; if (bellyW.visible) { attach(bellyW, YOU, 'torso', [0, -.1 - (bi >= 4 ? .08 : 0), .1 + (bi >= 4 ? .12 : 0)]); const k = bellyK; const rx = .12 + .58 * k * k; belly.scale.set(rx * 2, rx * 1.7, rx * 1.8); belly.position.set(0, 0, 0); bellyBtn.forEach((b) => { b.visible = false; }); navel.position.set(0, .05, rx * .9 - .02); }
    bulges.forEach((b, i) => { b.visible = bulgeK > .02 && YOU.vis; if (b.visible) { attach(b, YOU, 'torso', [(i ? 1 : -1) * .3, -.4, .12]); } });
    if (bi < 2 || bi > 3) bulges.forEach((b) => { b.visible = false; });
    if (bi === 2) bulges.forEach((b, i) => { b.visible = bulgeK > .02; b.children[0].scale.set(.7 + bulgeK * .3, .8 + bulgeK * .4, .7 + bulgeK * .3); });
    if (bi === 2) { // food peeking out of the pockets
      for (let i = 0; i < 2; i++) { if (bulgeK > .5 && L < 4.55) foodAt(14 + i, YOU.x + (i ? .3 : -.1), .98, YOU.z + .2, .9, 1 + i); }
    }
    post.forEach((f) => f()); sayAt; if (pre) return;
    // ---- camera
    A.follow(zone, 0);
    if (bi === 0) rig(L, [[0, D(DX + 1.2, 1.85, 4.3), D(DX + 1.15, 1.8, 4.0), D(DX + 1.2, 1.0, TZ), D(DX + 1.2, 1.0, TZ), 48, 46], [2.1, D(DX + .95, 1.65, 3.9), D(DX + .95, 1.6, 3.7), D(DX + 1.05, .95, TZ), D(DX + 1.05, .95, TZ), 46, 44]], t);
    else if (bi === 1) rig(L, [[0, D(DX + .6, 1.7, 3.7), D(DX + .6, 1.65, 3.4), D(DX + .6, 1.15, TZ), D(DX + .6, 1.1, TZ), 44, 42], [1.0, D(DX + 1.9, 1.5, 3.4), D(DX + 2.1, 1.45, 3.1), D(DX + 2.2, 1.15, TZ), D(DX + 2.3, 1.2, TZ), 40, 36], [3.0, D(DX + 1.3, 1.7, 4.4), D(DX + 1.2, 1.7, 4.6), D(DX + 1.2, 1.0, TZ), D(DX + 1.2, 1.0, TZ), 46, 48]], t, shake);
    else if (bi === 2) rig(L, [[0, D(DX + 1.0, 1.8, 4.0), D(DX + .9, 1.7, 3.7), D(DX + .9, 1.05, -1.5), D(DX + .8, 1.05, -1.5), 46, 42], [3.4, D(DX + .7, 1.55, 3.2), D(DX + .6, 1.5, 2.9), D(DX + .2, 1.05, -.95), D(DX + .15, 1.0, -.95), 40, 36], [5.3, D(DX + .75, 1.5, 3.2), D(DX + .8, 1.45, 3.0), D(DX + .3, 1.1, -.95), D(DX + .3, 1.15, -.95), 38, 34]], t);
    else if (bi === 3) rig(L, [[0, D(BX - .6, 1.7, 4.4), D(BX - .1, 1.6, 3.8), D(BX - .5, 1.1, -2.0), D(BX + .2, 1.0, -2.2), 50, 42], [2.3, D(BX + .2, 1.8, 3.8), D(BX - 1.8, 1.7, 3.4), D(BX + .2, 1.2, -2.0), D(BX - 2.2, 1.35, -3.0), 46, 40], [3.6, D(BX - 1.8, 1.8, 3.6), D(BX - 1.4, 1.7, 3.2), D(BX - 2.0, 1.15, -2.8), D(BX - 1.6, 1.0, -2.2), 40, 38]], t);
    else if (bi === 4) rig(L, [[0, D(LX + 1.6, 1.9, 6.4), D(LX + 1.5, 1.9, 6.0), D(LX + 1.3, 1.3, -.8), D(LX + 1.4, 1.3, -.8), 50, 46], [1.7, D(LX + 1.8, 1.8, 6.0), D(LX + 2.3, 1.7, 4.6), D(LX + 1.4, 1.3, -.8), D(LX + 2.3, 1.2, -.5), 46, 36]], t);
    else rig(L, [[0, D(LX + .5, 2.5, 7.2), D(LX + .5, 2.4, 7.0), D(LX + .3, 1.9, -.6), D(LX + .3, 1.9, -.6), 50, 48], [2.4, D(LX + .5, 2.4, 7.0), D(LX + .5, 2.2, 8.2), D(LX + .3, 1.9, -.6), D(LX + .3, 2.0, -.6), 48, 50]], t);
    A.render();
    const lab = 'PLATES SERVED'; const val = lerp(counter[0], counter[1], ramp(L, 0, tl.beats[bi].dur * .85));
    const notes = ['YOU: "I\'M FULL"', 'GRANDMA: "IMPOSSIBLE"', 'POCKETS: SEARCHED', 'TOILET: FLUSHED. SHE HEARD.', 'YOU: COUCH-SIZED', 'CUSTOMERS: 1'];
    hud.style('C'); hud.layout('B'); hud.question('', 0); hud.counter(lab, fmt(val), notes[bi], '', bi >= 3); hud.tm('');
  };
  return { frame(a) { inner(a, true); inner(a, false); } };
}
