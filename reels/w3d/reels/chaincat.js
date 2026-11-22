// 683 invention chain: cat knocks things off the table -> glass in the middle -> cat nudges it off while staring at you -> glue -> cat shoves the whole table -> cage -> cat has a key -> house on a cliff -> cat pushes it off -> cat on a pile of everything you own.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, mat, Crowd, Particles, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0xe9dcc6, fogNear: 40, fogFar: 200, clouds: true, skyTop: 0x62a8ee, skyMid: 0xb9dcf6, skyBot: 0xf3ead4, shadowExtent: 12, shadowRes: 2048, hemi: 1.9, sunI: 1.55, sunDir: [-.45, 1, .7], exposure: 1.1, hemiSky: 0xfff4e0, hemiGround: 0xc9b392 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t, w, h }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rbox = (w, h, d, c, o = {}) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * .2), o.mat || mat(c, o.m || {})); m.castShadow = o.cast !== false; m.receiveShadow = true; return m; };
  const box = (par, x, y, z, w, h, d, c, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.mat || mat(c, o.m || {})); m.position.set(x, y, z); if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.rx) m.rotation.x = o.rx; m.castShadow = o.cast !== false; m.receiveShadow = true; par.add(m); return m; };
  const cyl = (par, x, y, z, r0, r1, h, c, o = {}) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, o.seg || 20), o.mat || mat(c, o.m || {})); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; par.add(m); return m; };
  const put = (par, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); par.add(m); return m; };
  const grp = (x, y, z, par = S) => { const g = new THREE.Group(); g.position.set(x, y, z); par.add(g); return g; };
  const ORG = { K: [0, 0, 0], H: [500, 0, 0], P: [-500, 0, 0] };
  const K = grp(...ORG.K), H = grp(...ORG.H), P = grp(...ORG.P);
  const plane = (par, w, d, x, y, z, map, color = 0xffffff) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), map ? new THREE.MeshStandardMaterial({ map, roughness: .9 }) : mat(color, { roughness: 1 })); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; par.add(m); return m; };
  const board = (par, w, h, tex, x, y, z, ry = 0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: .8 })); m.position.set(x, y, z); m.rotation.y = ry; par.add(m); return m; };
  const mkLabel = (text, c1, c2, w = 640, size = 110) => { const l = cvs(w, 180, (g, ww) => { txt(g, text, ww / 2, 92, size, c1, { stroke: c2, sw: 22 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; s.userData.ar = w / 180; S.add(s); return s; };
  const lbShow = (s, on, pos, h = .5, a = 1) => { s.visible = on && a > .01; if (!s.visible) return; s.position.copy(pos); const k = clamp(a); s.scale.set(h * s.userData.ar * k, h * k, 1); };
  const heartTex = cvs(128, 128, (g) => { g.fillStyle = '#ff3b5c'; g.strokeStyle = '#7a0f26'; g.lineWidth = 8; g.beginPath(); g.moveTo(64, 112); g.bezierCurveTo(8, 72, 12, 18, 48, 20); g.bezierCurveTo(60, 21, 64, 32, 64, 36); g.bezierCurveTo(64, 32, 68, 21, 80, 20); g.bezierCurveTo(116, 18, 120, 72, 64, 112); g.fill(); g.stroke(); });
  const hearts = []; for (let i = 0; i < 8; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: heartTex.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); hearts.push(s); }
  const GR = 16; // gravity
  const drop = (y0, vy, tt, y1, e = .32) => { let y = y0, v = vy, t = tt; for (let n = 0; n < 8; n++) { const disc = v * v + 2 * GR * (y - y1); const tf = (v + Math.sqrt(Math.max(0, disc))) / GR; if (t < tf) return y + v * t - .5 * GR * t * t; t -= tf; v = e * -(v - GR * tf); y = y1; if (v < .5) return y1; } return y1; };
  const bell = (u) => Math.sin(clamp(u) * Math.PI);

  // ================================================================ KITCHEN (beats 0-3) at origin
  { const ck = cvs(512, 512, (g, w) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#7fb8b0' : '#f2ead8'; g.fillRect(i * 64, j * 64, 64, 64); } }); ck.t.wrapS = ck.t.wrapT = THREE.RepeatWrapping; ck.t.repeat.set(7, 4); plane(K, 28, 14, 1, 0, 3, ck.t); }
  box(K, 1, 2.6, -3.3, 28, 5.2, .15, 0xf1d98f); box(K, 1, .12, -3.2, 28, .24, .08, 0xffffff, { cast: false });
  box(K, -7.5, 2.6, 2, .15, 5.2, 12, 0xe9cf7f);
  { const wn = new THREE.Group(); wn.position.set(-1.9, 2.8, -3.2); K.add(wn); box(wn, 0, 0, 0, 2.2, 1.7, .08, 0xffffff); box(wn, 0, 0, .05, 1.95, 1.45, .04, 0x9fd8ff, { m: { emissive: 0x9fd8ff, emissiveIntensity: .6 } }); box(wn, 0, 0, .1, .07, 1.45, .04, 0xffffff); box(wn, 0, 0, .1, 1.95, .07, .04, 0xffffff); for (const s of [-1, 1]) box(wn, s * 1.2, -.1, .1, .32, 1.8, .1, 0xe8683a); }
  // counter + cabinets along the back wall (right side) and a fridge
  box(K, 5.0, .5, -2.75, 6, 1.0, .9, 0xe8e0cf); box(K, 5.0, 1.03, -2.75, 6.1, .07, 1.0, 0x6b4a2a); for (let i = 0; i < 6; i++) box(K, 2.4 + i * 1.0 + .5, .5, -2.29, .92, .86, .03, 0xd8cfba);
  for (let i = 0; i < 4; i++) { box(K, 3.0 + i * 1.5, 3.1, -3.0, 1.4, 1.1, .6, 0xe8e0cf); box(K, 3.0 + i * 1.5, 3.1, -2.69, 1.3, 1.0, .03, 0xd8cfba); box(K, 3.0 + i * 1.5 + .5, 3.1, -2.65, .05, .3, .04, 0x777777); }
  box(K, 9.5, 1.7, -2.6, 1.5, 3.4, 1.3, 0xf4f4f4); box(K, 9.5, 2.6, -1.93, 1.4, .03, .03, 0x999999); box(K, 9.0, 2.2, -1.9, .06, .8, .06, 0x999999); box(K, 9.0, 1.1, -1.9, .06, .8, .06, 0x999999);
  { const ck = cvs(256, 256, (g, w) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.strokeStyle = '#222'; g.lineWidth = 10; g.stroke(); g.lineWidth = 8; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 52); g.stroke(); g.beginPath(); g.moveTo(128, 128); g.lineTo(178, 150); g.stroke(); }); const c = new THREE.Mesh(new THREE.CircleGeometry(.4, 24), new THREE.MeshStandardMaterial({ map: ck.t, roughness: .6 })); c.position.set(0.9, 3.7, -3.1); K.add(c); }
  // rug
  { const rg = rbox(4.0, .03, 2.8, 0xe8683a); rg.position.set(0, .016, .1); K.add(rg); const rg2 = rbox(3.5, .035, 2.3, 0xffe3b0); rg2.position.set(0, .02, .1); K.add(rg2); }
  // table (group T slides in beat 2)
  const T = grp(0, 0, 0, K); const TW = 2.3, TD = 1.9, TH = .9;
  box(T, 0, TH, 0, TW, .09, TD, 0xc98a4b); box(T, 0, TH - .1, 0, TW - .1, .1, TD - .1, 0xa9743f); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(T, sx * 1.02, .42, sz * .78, .12, .85, .12, 0xa9743f);
  const mkChair = (par, x, z, ry) => { const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = ry; par.add(c); box(c, 0, .5, 0, .6, .07, .6, 0xe66a2c); box(c, 0, .95, -.27, .6, .8, .07, 0xe66a2c); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(c, sx * .25, .24, sz * .25, .07, .48, .07, 0x7a4a28); return c; };
  const chL = mkChair(K, -1.95, .2, Math.PI / 2), chR = mkChair(K, 1.95, .2, -Math.PI / 2);
  // glass factory
  const mkGlass = () => { const g = new THREE.Group(); const gl = new THREE.Mesh(new THREE.CylinderGeometry(.125, .095, .36, 22, 1, true), new THREE.MeshStandardMaterial({ color: 0xe4f6ff, roughness: .05, metalness: 0, transparent: true, opacity: .32, side: THREE.DoubleSide, depthWrite: false })); gl.position.y = .18; g.add(gl); const bt = new THREE.Mesh(new THREE.CylinderGeometry(.095, .095, .03, 22), new THREE.MeshStandardMaterial({ color: 0xcfeeff, roughness: .1, transparent: true, opacity: .6 })); bt.position.y = .015; g.add(bt);
    const wt = new THREE.Mesh(new THREE.CylinderGeometry(.115, .098, .24, 22), new THREE.MeshStandardMaterial({ color: 0x4fb4ff, roughness: .15, transparent: true, opacity: .85 })); wt.position.y = .15; g.add(wt); const rm = new THREE.Mesh(new THREE.TorusGeometry(.125, .008, 6, 22), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .1, transparent: true, opacity: .7 })); rm.rotation.x = Math.PI / 2; rm.position.y = .36; g.add(rm);
    const hl = new THREE.Mesh(new THREE.BoxGeometry(.018, .26, .01), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .75 })); hl.position.set(-.08, .17, .1); g.add(hl); g.traverse((o) => { if (o.isMesh) o.castShadow = false; }); return g; };
  const glassT = mkGlass(); T.add(glassT); glassT.visible = false; const glassFly = mkGlass(); glassFly.visible = false; S.add(glassFly);
  const glueBlob = cyl(T, 0, TH + .055, .3, .15, .17, .025, 0xffffff, { m: { roughness: .3 } }); glueBlob.visible = false;
  // glue bottle
  const glueB = new THREE.Group(); { const gt = cvs(128, 128, (g) => { g.fillStyle = '#fff'; g.fillRect(0, 0, 128, 128); g.fillStyle = '#2f6bd8'; g.fillRect(0, 30, 128, 70); txt(g, 'GLUE', 64, 65, 40, '#fff'); });
    const b = rbox(.2, .3, .13, 0xffffff); b.position.y = .15; glueB.add(b); const lb = new THREE.Mesh(new THREE.PlaneGeometry(.18, .18), new THREE.MeshStandardMaterial({ map: gt.t })); lb.position.set(0, .15, .068); glueB.add(lb); cyl(glueB, 0, .33, 0, .02, .07, .08, 0xff7a2a); cyl(glueB, 0, .39, 0, .015, .02, .06, 0xff7a2a); glueB.scale.setScalar(1.5); glueB.visible = false; S.add(glueB); }
  // table items
  const mug = new THREE.Group(); { cyl(mug, 0, .09, 0, .085, .075, .18, 0xffffff); cyl(mug, 0, .14, 0, .07, .07, .06, 0x4b2a14, { cast: false }); const h = new THREE.Mesh(new THREE.TorusGeometry(.055, .016, 6, 14), mat(0xffffff)); h.position.set(.095, .09, 0); mug.add(h); cyl(mug, 0, .09, 0, .0867, .0767, .05, 0xe8433a); mug.scale.setScalar(1.35); S.add(mug); }
  const remote = new THREE.Group(); { box(remote, 0, .02, 0, .42, .045, .15, 0x24262c); for (let i = 0; i < 6; i++) box(remote, -.14 + i * .055, .047, (i % 2 ? .035 : -.035), .035, .01, .035, [0xe8433a, 0x6fe08a, 0xffe23a][i % 3], { cast: false }); remote.scale.setScalar(1.2); S.add(remote); }
  const plant = new THREE.Group(); { cyl(plant, 0, .11, 0, .15, .11, .22, 0xc8643a); cyl(plant, 0, .22, 0, .16, .16, .04, 0xd8744a); for (let i = 0; i < 7; i++) { const l = rbox(.1, .3, .03, 0x4fae45); l.position.set(Math.cos(i * 1.4) * .06, .38, Math.sin(i * 1.4) * .06); l.rotation.set(Math.sin(i * 2.1) * .5, i * 1.1, Math.cos(i * 1.7) * .6); plant.add(l); } plant.scale.setScalar(1.2); S.add(plant); }
  const KN = [{ g: mug, x0: -.0 + .68, z0: -.28, vx: 3.4, spin: 9, t0: .72, hy: .13 }, { g: remote, x0: -.62, z0: -.3, vx: -3.4, spin: -7, t0: 1.28, hy: .03 }, { g: plant, x0: .86, z0: -.2, vx: 2.5, spin: 5, t0: 1.97, hy: .16 }];
  // cage
  const cage = new THREE.Group(); K.add(cage); cage.visible = false; const CX = 1.45, CZ = 1.12, CH = 2.7;
  { const bm = mat(0x2d2f38, { metalness: .6, roughness: .35 }); const bar = (par, x, y, z, h, r = .032) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 8), bm); m.position.set(x, y, z); m.castShadow = true; par.add(m); return m; }; const hb = (par, x, y, z, w, ax) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, w, 8), bm); m.rotation.z = ax === 'x' ? Math.PI / 2 : 0; m.rotation.x = ax === 'z' ? Math.PI / 2 : 0; m.position.set(x, y, z); m.castShadow = true; par.add(m); return m; };
    for (let i = 0; i <= 5; i++) { const x = -CX + i * (2 * CX / 5); bar(cage, x, CH / 2, -CZ, CH); } for (const sx of [-1, 1]) for (let i = 1; i < 5; i++) bar(cage, sx * CX, CH / 2, -CZ + i * (2 * CZ / 5), CH);
    for (const y of [.05, 1.0, 1.9, CH]) { hb(cage, 0, y, -CZ, 2 * CX, 'x'); for (const sx of [-1, 1]) hb(cage, sx * CX, y, 0, 2 * CZ, 'z'); }
    for (let i = 0; i <= 5; i++) hb(cage, -CX + i * (2 * CX / 5), CH, 0, 2 * CZ, 'z'); hb(cage, 0, CH, CZ, 2 * CX, 'x');
    const door = new THREE.Group(); door.position.set(-CX, 0, CZ); cage.add(door); cage.userData.door = door; for (let i = 0; i <= 5; i++) bar(door, i * (2 * CX / 5), CH / 2, 0, CH); for (const y of [.05, 1.0, 1.9, CH]) hb(door, CX, y, 0, 2 * CX, 'x'); for (const sx of [0, 2 * CX]) bar(door, sx, CH / 2, 0, CH, .04);
    const lock = new THREE.Group(); lock.position.set(2 * CX - .1, 1.58, .08); door.add(lock); cage.userData.lock = lock; box(lock, 0, 0, 0, .34, .28, .12, 0xe8c24a, { m: { metalness: .8, roughness: .3 } }); const sh = new THREE.Group(); sh.position.set(0, .14, 0); lock.add(sh); const sm = new THREE.Mesh(new THREE.TorusGeometry(.09, .026, 8, 16, Math.PI), mat(0xbfc4cc, { metalness: .9, roughness: .25 })); sm.position.set(0, 0, 0); sh.add(sm); cage.userData.shackle = sh; box(lock, 0, -.03, .07, .05, .09, .02, 0x222222); }
  // key
  const mkKey = () => { const k = new THREE.Group(); const gm = mat(0xffd23a, { metalness: .8, roughness: .3 }); const ring = new THREE.Mesh(new THREE.TorusGeometry(.055, .018, 8, 16), gm); ring.position.set(-.1, 0, 0); k.add(ring); const sh = new THREE.Mesh(new THREE.BoxGeometry(.2, .03, .03), gm); sh.position.set(.04, 0, 0); k.add(sh); for (const x of [.1, .14]) { const t = new THREE.Mesh(new THREE.BoxGeometry(.025, .06, .03), gm); t.position.set(x, -.035, 0); k.add(t); } k.traverse((o) => { o.castShadow = true; }); return k; };

  // ================================================================ THE CAT
  const cat = new THREE.Group(); S.add(cat); const CT = {}; cat.visible = false;
  const OR = 0xf29a38, ORD = 0xc4651c, CRM = 0xfff0d2, PINK = 0xff9bb0;
  { const bg = new THREE.Group(); bg.position.set(0, .2, -.28); cat.add(bg); CT.body = bg;
    put(bg, rbox(.38, .33, .64, OR), 0, .165, .32); put(bg, rbox(.3, .12, .5, CRM), 0, .03, .34); put(bg, rbox(.26, .22, .1, CRM), 0, .13, .62);
    for (const z of [.08, .22, .36, .5]) { box(bg, 0, .332, z, .2, .02, .06, ORD, { cast: false }); for (const sx of [-1, 1]) box(bg, sx * .191, .22, z, .02, .13, .06, ORD, { cast: false }); }
    for (const sx of [-1, 1]) put(cat, rbox(.14, .26, .32, OR), sx * .205, .2, -.16);
    CT.hind = [-1, 1].map((sx) => { const p = new THREE.Group(); p.position.set(sx * .13, .2, -.16); cat.add(p); put(p, rbox(.11, .22, .15, OR), 0, -.11, 0); put(p, rbox(.12, .05, .17, CRM), 0, -.2, .03); return p; });
    CT.front = [-1, 1].map((sx) => { const p = new THREE.Group(); p.position.set(sx * .12, .1, .5); bg.add(p); const l = rbox(.105, .3, .115, OR); l.position.y = -.15; p.add(l); const f = rbox(.12, .06, .15, CRM); f.position.set(0, -.29, .025); p.add(f); box(p, 0, -.2, .06, .106, .02, .02, ORD, { cast: false }); return p; });
    const hd = new THREE.Group(); hd.position.set(0, .3, .68); bg.add(hd); CT.head = hd;
    put(hd, rbox(.4, .32, .32, OR), 0, 0, 0); put(hd, rbox(.17, .085, .08, CRM), 0, -.085, .17); put(hd, rbox(.056, .038, .03, PINK), 0, -.035, .214);
    for (const sx of [-1, 1]) { box(hd, sx * .09, .165, .13, .05, .018, .04, ORD, { cast: false }); }
    box(hd, 0, .162, .165, .03, .02, .03, ORD, { cast: false });
    CT.mouthL = box(hd, -.038, -.115, .222, .07, .014, .012, 0x3a1a10, { cast: false }); CT.mouthR = box(hd, .038, -.115, .222, .07, .014, .012, 0x3a1a10, { cast: false }); CT.mouthO = box(hd, 0, -.135, .22, .08, .001, .012, 0x4a1520, { cast: false }); CT.tongue = box(hd, 0, -.15, .222, .04, .001, .012, 0xff7a98, { cast: false });
    CT.eyeG = []; CT.lids = []; CT.brows = [];
    for (const sx of [-1, 1]) { const eg = new THREE.Group(); eg.position.set(sx * .092, .035, .164); hd.add(eg); const sc = rbox(.115, .105, .03, 0xf6f6d6, { cast: false }); eg.add(sc); const ir = new THREE.Group(); ir.position.z = .014; eg.add(ir); const iris = rbox(.082, .082, .02, 0xb7dc3c, { cast: false }); ir.add(iris); const pu = rbox(.024, .078, .02, 0x0a0a0a, { cast: false }); pu.position.z = .012; ir.add(pu); const sh = rbox(.018, .018, .02, 0xffffff, { cast: false }); sh.position.set(.02, .025, .024); ir.add(sh); eg.userData.ir = ir;
      const lid = rbox(.13, .07, .045, OR); lid.position.set(sx * .092, .13, .17); lid.userData.sx = sx; hd.add(lid); CT.lids.push(lid); CT.eyeG.push(eg);
      const br = box(hd, sx * .092, .155, .17, .1, .02, .03, ORD, { cast: false }); br.userData.sx = sx; CT.brows.push(br); }
    for (const sx of [-1, 1]) { const ear = new THREE.Group(); ear.position.set(sx * .125, .2, -.02); hd.add(ear); const c1 = new THREE.Mesh(new THREE.ConeGeometry(.115, .2, 4), mat(OR)); c1.rotation.y = Math.PI / 4; c1.position.y = .06; c1.castShadow = true; ear.add(c1); const c2 = new THREE.Mesh(new THREE.ConeGeometry(.075, .15, 4), mat(PINK)); c2.rotation.y = Math.PI / 4; c2.position.set(0, .045, .03); ear.add(c2); ear.rotation.z = -sx * .22; ear.userData.sx = sx; (CT.ears = CT.ears || []).push(ear); }
    for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { const w = box(hd, sx * .2, -.075 + (k - 1) * .035, .2, .22, .006, .006, 0xffffff, { cast: false }); w.rotation.z = sx * ((k - 1) * .16); }
    CT.mouth = new THREE.Group(); CT.mouth.position.set(0, -.12, .23); hd.add(CT.mouth); CT.key = mkKey(); CT.key.scale.setScalar(2.1); CT.key.position.set(.05, -.0, .03); CT.key.rotation.set(0, 0, .12); CT.key.visible = false; CT.mouth.add(CT.key);
    const tl = new THREE.Group(); tl.position.set(0, .2, -.3); cat.add(tl); CT.tail = tl; put(tl, rbox(.075, .3, .075, OR), 0, .15, 0); const t2 = new THREE.Group(); t2.position.y = .3; tl.add(t2); put(t2, rbox(.075, .3, .075, OR), 0, .15, 0); box(t2, 0, .12, 0, .08, .02, .08, ORD, { cast: false }); const t3 = new THREE.Group(); t3.position.y = .3; t2.add(t3); put(t3, rbox(.08, .22, .08, ORD), 0, .11, 0); CT.t2 = t2; CT.t3 = t3; }
  // pose the cat. facing +z (toward camera) at yaw 0.
  const setCat = (d) => { const s = d.s ?? 1.4, sit = d.sit || 0; cat.visible = true; cat.scale.setScalar(s); cat.position.set(d.x, d.y || 0, d.z); cat.rotation.set(d.pitch || 0, d.yaw || 0, d.roll || 0, 'YXZ');
    CT.body.position.y = .2 - .07 * sit; CT.body.rotation.x = -.95 * sit + (d.lean || 0); const br = CT.body.rotation.x; const run = d.run || 0;
    CT.hind.forEach((p, i) => { p.position.y = .2 - .1 * sit; p.rotation.x = sit ? -1.45 * sit : (run ? Math.sin(run + (i ? Math.PI : 0)) * .9 : 0); });
    CT.front.forEach((p, i) => { const sx = i ? 1 : -1; const paw = i ? (d.pawS || 0) : (d.pawL || 0), pz = i ? (d.pawSz || 0) : (d.pawLz || 0); p.rotation.set(-br - paw + (run && !paw ? Math.sin(run + (i ? 0 : Math.PI)) * .9 : 0), 0, pz); p.scale.y = 1 + .9 * sit; });
    CT.head.rotation.set(-br + (d.hx || 0), d.hy || 0, d.hz || 0, 'YXZ');
    const lid = d.lid ?? .45, look = d.look || [0, 0], bl = d.blink || 0; CT.lids.forEach((l) => { const sx = l.userData.sx; const lv = clamp(lid + bl); l.position.y = .15 - .085 * lv; l.rotation.z = sx * (.04 * lv + (d.slant || 0) * .5); l.scale.y = .8 + lv * .6; });
    CT.eyeG.forEach((eg) => { eg.userData.ir.position.x = look[0] * .016; eg.userData.ir.position.y = look[1] * .014; });
    const bw = d.brow ?? .6; CT.brows.forEach((b) => { const sx = b.userData.sx; if (sx > 0) { b.position.y = .165 + bw * .04; b.rotation.z = .1 + bw * .14; b.position.x = .1; } else { b.position.y = .158 - bw * .005; b.rotation.z = -.1 - bw * .04; b.position.x = -.092; } });
    const sm = d.smirk ?? 1; CT.mouthL.rotation.z = -.4 + sm * .3; CT.mouthR.rotation.z = .4 + sm * .35; CT.mouthR.position.y = -.112 + sm * .018; CT.mouthL.position.y = -.118; CT.mouthL.position.x = -.04; CT.mouthR.position.x = .042 + sm * .01;
    const mo = d.mouth || 0; CT.mouthO.scale.y = 1 + mo * 80; CT.mouthO.position.y = -.135 - mo * .02; CT.tongue.scale.y = 1 + (d.tongue || 0) * 40; CT.tongue.position.y = -.15 - (d.tongue || 0) * .02;
    CT.ears.forEach((e) => { e.rotation.z = -e.userData.sx * (.22 + (d.earFlat || 0) * .7) + Math.sin((d.twitch || 0) * e.userData.sx * 3) * .05; e.rotation.x = (d.earFlat || 0) * .3; });
    CT.key.visible = !!d.key; const w = d.wag || 0; CT.tail.rotation.set(-.9 - .65 * sit, 0, -.55 + Math.sin(w) * (d.wagAmp ?? .3)); CT.t2.rotation.x = .75 + (d.tailUp ?? 0) * .3 + Math.sin(w * .7 + 1) * .12 * (d.wagAmp ?? .3) * 3; CT.t3.rotation.x = .65 + Math.sin(w * .9 + 2) * .15; };

  // ================================================================ people (just YOU, small)
  const crowd = new Crowd(S, 2, 31); const PP = crowd.p; const YOU = PP[0];
  const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  col(0, ['torso', 'armL', 'armR'], 0x3a78d8); col(0, ['legL', 'legR'], 0x2b3347); col(0, ['hair'], 0x4a2f1c); col(0, ['head', 'neck', 'handL', 'handR'], 0xe8b48a);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; o.h = 1; };
  const hide = (o) => { o.vis = false; o.x = 0; o.y = -50; o.z = 0; };

  // ================================================================ CLIFF (beat 4) at x=500
  const CLIFF = 1.6, SEA = -11;
  { const gt = cvs(512, 512, (g, w) => { g.fillStyle = '#7dba5a'; g.fillRect(0, 0, w, w); for (let i = 0; i < 120; i++) { g.fillStyle = cr(i, 1) > .5 ? '#8fcb68' : '#6aa84a'; g.fillRect(cr(i, 2) * w, cr(i, 3) * w, 10 + cr(i, 4) * 26, 4); } }); gt.t.wrapS = gt.t.wrapT = THREE.RepeatWrapping; gt.t.repeat.set(6, 3); plane(H, 40, 15.5, CLIFF - 20, .01, -4.25, gt.t); }
  box(H, CLIFF - 20, -4.5, -4.25, 40, 9, 15.5, 0xa98a62); box(H, CLIFF - .02, -4.5, -4.25, .04, 9, 15.5, 0xc9a77a, { cast: false });
  for (let i = 0; i < 9; i++) { box(H, CLIFF - 20, -.9 - i * 1.0, 3.52, 40, .12, .05, i % 2 ? 0x8a6c47 : 0x7a5e3c, { cast: false }); }
  { const sea = new THREE.Mesh(new THREE.PlaneGeometry(200, 120), new THREE.MeshStandardMaterial({ color: 0x2f9be0, roughness: .25, metalness: .1 })); sea.rotation.x = -Math.PI / 2; sea.position.set(CLIFF + 90, SEA + 2.2, 0); sea.receiveShadow = true; H.add(sea); }
  for (let i = 0; i < 14; i++) { const r = rbox(.6 + cr(i, 1) * .8, .3 + cr(i, 2) * .5, .6 + cr(i, 3) * .8, 0x7d7f86); r.position.set(CLIFF + 2 + cr(i, 4) * 10, SEA + 2.1 + .1, -8 + cr(i, 5) * 16); H.add(r); }
  for (let i = 0; i < 8; i++) { const w = box(H, CLIFF + 3 + i * 1.6, SEA + 2.25, -7 + cr(i, 11) * 14, .9 + cr(i, 12), .02, .2, 0xffffff, { cast: false }); }
  // far hills for depth
  for (let i = 0; i < 6; i++) { const h = rbox(14 + cr(i, 20) * 10, 5 + cr(i, 21) * 7, 8, 0x8fb08a); h.position.set(CLIFF + 28 + i * 9, SEA + 2.2 + 1.5, -30 - cr(i, 22) * 20); H.add(h); }
  // trees on the plateau
  for (let i = 0; i < 6; i++) { const x = -10 - i * 2.2 + cr(i, 1) * 1.5, z = -5 + cr(i, 2) * 9; if (Math.abs(z) < 3.5 && x > -9) continue; box(H, x, .6, z, .3, 1.2, .3, 0x6b4a2a); const c = rbox(1.5, 1.4, 1.5, 0x4fae45); c.position.set(x, 1.7, z); H.add(c); }
  // sign
  { const st = cvs(512, 256, (g, w, h) => { g.fillStyle = '#fff6dc'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c8281e'; g.lineWidth = 16; g.strokeRect(10, 10, w - 20, h - 20); txt(g, 'NO TABLES', w / 2, 100, 96, '#c8281e'); txt(g, 'ALLOWED', w / 2, 190, 70, '#222'); }); const sp = grp(-6.4, 0, 3.0, H); box(sp, 0, .6, 0, .12, 1.2, .12, 0x6b4a2a); const sg = board(sp, 1.7, .85, st.t, 0, 1.45, .08); sg.castShadow = true; }
  // house
  const house = new THREE.Group(); H.add(house); const HW = 1.7, HHt = 1.3;
  { box(house, 0, HHt / 2, 0, HW, HHt, 1.5, 0xfff0d2); const rf = new THREE.Mesh(new THREE.CylinderGeometry(.06, 1.35, .9, 4, 1), mat(0xc8281e)); rf.rotation.y = Math.PI / 4; rf.scale.set(1.0, 1, .88); rf.position.y = HHt + .45; rf.castShadow = true; house.add(rf); box(house, .5, HHt + .7, -.2, .22, .6, .22, 0x8a4a2a); box(house, -.15, .45, .76, .5, .9, .04, 0x7a4a28); box(house, .1, .45, .79, .06, .06, .04, 0xe8c24a); for (const sx of [-1, 1]) { box(house, sx * .5 + (sx > 0 ? .0 : -.0), .85, .76, .38, .38, .04, 0x9fd8ff, { m: { emissive: 0x9fd8ff, emissiveIntensity: .5 } }); } box(house, .55, .85, .78, .45, .04, .03, 0xffffff); box(house, .55, .85, .78, .04, .45, .03, 0xffffff); box(house, -.6, .85, .78, .45, .04, .03, 0xffffff);
    const mt = cvs(256, 128, (g, w, h) => { g.fillStyle = '#6b4a2a'; g.fillRect(0, 0, w, h); txt(g, 'HOME', w / 2, 64, 70, '#ffe9b0'); }); const wm = board(house, .55, .28, mt.t, -.15, 1.05, .8); }
  // tiny person's lawn chair? keep scene clean. dust + splash
  const dust = new Particles(S, 40, 0xf5efe2, .12, { rough: 1 }); const water = new Particles(S, 70, 0x8fd4ff, .09, { rough: .2 }); const bigW = new Particles(S, 50, 0xe8f6ff, .35, { rough: .3 });
  const shards = []; for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.05 + cr(i, 1) * .06, .01, .05 + cr(i, 2) * .06), new THREE.MeshStandardMaterial({ color: 0xcfeeff, transparent: true, opacity: .7, roughness: .1 })); m.visible = false; S.add(m); shards.push(m); }
  const puddle = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .012, 28), new THREE.MeshStandardMaterial({ color: 0x6fc4ff, transparent: true, opacity: .75, roughness: .1 })); puddle.visible = false; S.add(puddle);
  const sparkle = new Particles(S, 20, 0xfff3a0, .05, { rough: .3, emissive: 0xffe060 });

  // ================================================================ PILE (beat 5) at x=-500
  { const gt = cvs(512, 512, (g, w) => { g.fillStyle = '#d9c9a0'; g.fillRect(0, 0, w, w); for (let i = 0; i < 200; i++) { g.fillStyle = cr(i, 1) > .5 ? '#cdbb8e' : '#e4d6b0'; g.fillRect(cr(i, 2) * w, cr(i, 3) * w, 12 + cr(i, 4) * 30, 5); } }); gt.t.wrapS = gt.t.wrapT = THREE.RepeatWrapping; gt.t.repeat.set(8, 8); plane(P, 140, 140, 0, 0, 0, gt.t); }
  const PC = [0xe8433a, 0x3a78d8, 0x58b84a, 0xf2a21b, 0xc66bd8, 0x2fb7b0, 0xff8fb1, 0x8a5a30, 0xe8e0cf, 0x6b7fa8];
  const mkSofa = (c) => { const g = new THREE.Group(); box(g, 0, .3, 0, 1.9, .5, .95, c); box(g, 0, .85, -.4, 1.9, .7, .22, c); for (const sx of [-1, 1]) box(g, sx * .9, .55, .02, .22, .55, .95, c); for (const sx of [-1, 1]) box(g, sx * .42, .62, .08, .8, .14, .7, 0xffffff, { cast: false }); return g; };
  const mkFridge = () => { const g = new THREE.Group(); box(g, 0, .95, 0, .9, 1.9, .8, 0xf4f4f4); box(g, 0, 1.3, .41, .85, .03, .02, 0xaaaaaa); box(g, .3, 1.55, .43, .05, .5, .05, 0x999999); box(g, .3, .7, .43, .05, .6, .05, 0x999999); return g; };
  const mkTV = () => { const g = new THREE.Group(); box(g, 0, .6, 0, 1.6, .95, .12, 0x1a1c22); box(g, 0, .6, .07, 1.45, .8, .02, 0x4a7ac8, { m: { emissive: 0x3a60b8, emissiveIntensity: .7 }, cast: false }); box(g, 0, .08, 0, .5, .16, .3, 0x1a1c22); return g; };
  const mkBox = (c) => { const g = new THREE.Group(); box(g, 0, .4, 0, .95, .8, .85, c); box(g, 0, .81, 0, .12, .02, .86, 0xe8d9a8, { cast: false }); return g; };
  const mkChair2 = (c) => { const g = new THREE.Group(); box(g, 0, .5, 0, .65, .08, .65, c); box(g, 0, .95, -.28, .65, .8, .08, c); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, sx * .27, .24, sz * .27, .07, .5, .07, 0x7a4a28); return g; };
  const mkLamp = (c) => { const g = new THREE.Group(); cyl(g, 0, .05, 0, .25, .25, .1, 0x333333); cyl(g, 0, .75, 0, .03, .03, 1.5, 0x333333); cyl(g, 0, 1.6, 0, .25, .42, .5, c, { m: { emissive: c, emissiveIntensity: .25 } }); return g; };
  const mkPlant2 = () => { const g = new THREE.Group(); cyl(g, 0, .25, 0, .35, .27, .5, 0xc8643a); for (let i = 0; i < 8; i++) { const l = rbox(.16, .7, .05, 0x4fae45); l.position.set(Math.cos(i * 1.4) * .13, .85, Math.sin(i * 1.4) * .13); l.rotation.set(Math.sin(i * 2.1) * .6, i * 1.1, Math.cos(i * 1.7) * .6); g.add(l); } return g; };
  const mkMattress = (c) => { const g = new THREE.Group(); box(g, 0, .17, 0, 2.2, .34, 1.4, c); box(g, 0, .36, 0, 2.1, .06, 1.3, 0xffffff, { cast: false }); return g; };
  const mkSuit = (c) => { const g = new THREE.Group(); box(g, 0, .45, 0, 1.0, .9, .45, c); box(g, 0, .95, 0, .4, .1, .06, 0x222222); return g; };
  const mkTable2 = () => { const g = new THREE.Group(); box(g, 0, .9, 0, 2.3, .09, 1.9, 0xc98a4b); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, sx * 1.02, .42, sz * .78, .12, .85, .12, 0xa9743f); return g; };
  const mkBook = () => { const g = new THREE.Group(); for (let i = 0; i < 4; i++) box(g, 0, .08 + i * .16, 0, .7 - i * .04, .15, .5, PC[(i * 3) % 10]); return g; };
  const mkBike = () => { const g = new THREE.Group(); for (const x of [-.6, .6]) { const w = new THREE.Mesh(new THREE.TorusGeometry(.4, .04, 8, 20), mat(0x222222)); w.position.set(x, .45, 0); g.add(w); } box(g, 0, .75, 0, 1.2, .06, .06, 0xe8433a, { rz: .2 }); box(g, .5, 1.0, 0, .06, .5, .06, 0xe8433a); return g; };
  const MK = [() => mkSofa(PC[(Math.random() * 3) | 0]), mkFridge, mkTV, () => mkBox(0xc89a5a), () => mkChair2(0xe66a2c), () => mkLamp(0xffe08a), mkPlant2, () => mkMattress(0x7aa8e8), () => mkSuit(0x2d6b66), mkTable2, mkBook, mkBike];
  const pileItems = []; const PH = 8.4;
  { const core = new THREE.Mesh(new THREE.CylinderGeometry(.9, 3.5, PH, 18), mat(0x9c7a4c, { roughness: 1 })); core.position.y = PH / 2; core.castShadow = core.receiveShadow = true; P.add(core); }
  let pi = 0; for (let L = 0; L < 6; L++) { const y = L * 1.35; const R = 4.9 * (1 - L / 6.6); const n = L === 5 ? 3 : Math.max(4, Math.round(2 * Math.PI * R / 1.7)); for (let k = 0; k < n; k++, pi++) { const a = (k / n) * Math.PI * 2 + L * .6 + cr(pi, 2) * .3; const kind = (pi * 5 + ((cr(pi, 3) * 7) | 0)) % 12; let g; if (kind === 0 || kind === 12) g = mkSofa(PC[pi % 10]); else if (kind === 1) g = mkFridge(); else if (kind === 2) g = mkTV(); else if (kind === 3 || kind === 9) g = mkBox(pi % 2 ? 0xc89a5a : 0xb78848); else if (kind === 4) g = mkChair2(PC[pi % 10]); else if (kind === 5) g = mkLamp(PC[pi % 10]); else if (kind === 6) g = mkPlant2(); else if (kind === 7) g = mkMattress(PC[(pi + 3) % 10]); else if (kind === 8) g = mkSuit(PC[(pi + 5) % 10]); else if (kind === 10) g = mkTable2(); else g = mkBook(); g.scale.setScalar(1.45); const rr = R * (.82 + cr(pi, 1) * .25); g.position.set(Math.cos(a) * rr, y + .1, Math.sin(a) * rr * .9 - .3); g.rotation.set((cr(pi, 4) - .5) * .4, a + Math.PI / 2 + (cr(pi, 5) - .5) * 1.2, (cr(pi, 6) - .5) * .4); P.add(g); pileItems.push(g); } }
  // top sofa-throne for the cat
  const throne = mkMattress(0xf2a21b); throne.scale.setScalar(.9); throne.position.set(0, PH + .1, -.3); P.add(throne);
  const glassP = mkGlass(); glassP.scale.setScalar(2.2); glassP.position.set(1.15, PH + .55, .2); P.add(glassP);

  // ================================================================ labels
  const lbSwat = mkLabel('SWAT!', '#ffe23a', '#111', 500, 110), lbClever = mkLabel('CLEVER!', '#7dff6a', '#111', 640, 110), lbCrash = mkLabel('CRASH!', '#ff5a4a', '#111', 600, 120), lbGlued = mkLabel('GLUED!', '#7dff6a', '#111', 560, 110), lbShove = mkLabel('SHOVE!', '#ffe23a', '#111', 560, 120), lbClick = mkLabel('CLICK!', '#ffe23a', '#111', 520, 120), lbCage = mkLabel('CAGE', '#9fd0ff', '#111', 440, 110), lbBang = mkLabel('!', '#ff5a4a', '#111', 200, 150), lbQ = mkLabel('?', '#ffe23a', '#111', 200, 150), lbHmm = mkLabel('hmm.', '#ffffff', '#111', 420, 110), lbBye = mkLabel('BYE, HOUSE', '#ffe23a', '#111', 880, 100), lbPurr = mkLabel('purrrr', '#ffd1e8', '#111', 560, 110), lbNo = mkLabel('NO TABLES!', '#7dff6a', '#111', 760, 100), lbMuch = mkLabel('MUCH BETTER!', '#7dff6a', '#111', 900, 100), lbKey = mkLabel('KEY', '#ffe23a', '#111', 360, 130);
  const LBS = [lbSwat, lbClever, lbCrash, lbGlued, lbShove, lbClick, lbCage, lbBang, lbQ, lbHmm, lbBye, lbPurr, lbNo, lbMuch, lbKey];
  const rig = (lt, shots, t, off = [0, 0, 0]) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .5);
    const L3 = (a, b) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)]; const e = L3(s[1], s[2]), g = L3(s[3], s[4]);
    A.cam(e[0] + off[0] + Math.sin(t * .9) * .012, e[1] + off[1] + Math.sin(t * 1.3) * .01, e[2] + off[2], g[0] + off[0], g[1] + off[1], g[2] + off[2], lerp(s[5], s[6], u), Math.sin(t * .7) * .004); };
  const dk = (x, y, z) => [x, y, z];
  const arcTo = (a, b, u, h) => V3(lerp(a.x, b.x, u), lerp(a.y, b.y, u) + Math.sin(clamp(u) * Math.PI) * h, lerp(a.z, b.z, u));
  const TY = TH + .045; // table surface y
  const sway = (t, a = .25) => Math.sin(t * 2.2) * a;

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    K.visible = bi <= 3; H.visible = bi === 4; P.visible = bi === 5;
    PP.forEach((o) => hide(o)); cat.visible = false; dust.clear(); water.clear(); bigW.clear(); sparkle.clear(); hearts.forEach((h) => { h.visible = false; }); LBS.forEach((s) => { s.visible = false; }); shards.forEach((s) => { s.visible = false; }); puddle.visible = false;
    glassT.visible = false; glassFly.visible = false; glueB.visible = false; glueBlob.visible = false; cage.visible = false; [mug, remote, plant].forEach((g) => { g.visible = false; });
    T.position.x = 0; chR.position.set(1.95, 0, .2); chR.rotation.set(0, -Math.PI / 2, 0);
    let shock = false; let counter = null;
    const placeTableItems = (lt0) => { KN.forEach((k) => { k.g.visible = true; const dt = lt0 - k.t0; const sgn = Math.sign(k.vx); const edge = sgn * (TW / 2 + .02); let x = k.x0, y = TY + k.hy, z = k.z0, rz = 0, ry = 0; if (dt > 0) { const te = (edge - k.x0) / k.vx; if (dt < te) { x = k.x0 + k.vx * dt; rz = 0; } else { const df = dt - te; x = edge + k.vx * Math.min(df, .55) * .7 + k.vx * Math.max(0, df - .55) * .15; y = drop(TY + k.hy, 0, df, k.hy, .28); z = k.z0 + df * .9 * (k.z0 >= 0 ? 1 : 1); rz = k.spin * Math.min(df, .45) * .5; ry = k.spin * .1 * df; if (y <= k.hy + .001 && df > .6) rz = (k.g === remote ? 0 : Math.PI / 2 * .0); } } k.g.position.set(x, y, z); k.g.rotation.set(0, ry, rz); }); };
    if (bi === 0) {
      // ---- 0: cat swats the mug, the remote, the plant off the table. you put a glass in the middle.
      placeTableItems(lt);
      const nK = (lt > .72) + (lt > 1.28) + (lt > 1.97);
      let cx = 0, pawS = 0, pawSz = 0, pawL = 0, pawLz = 0, hz = 0, brow = .7, look = [0, 0], lid = .4, mo = 0;
      const sw = (t0, dur) => clamp((lt - (t0 - dur * .62)) / dur);
      let u = sw(.72, .5); if (u > 0 && u < 1) { pawS = 1.0 * bell(u); pawSz = lerp(-.35, 1.05, smooth(u)); hz = -.08 * bell(u); mo = .6 * bell(u); }
      u = sw(1.28, .5); if (u > 0 && u < 1) { pawL = 1.0 * bell(u); pawLz = lerp(.35, -1.05, smooth(u)); hz = .08 * bell(u); }
      cx = lerp(0, .3, smooth((lt - 1.45) / .35)); u = sw(1.97, .5); if (u > 0 && u < 1) { pawS = 1.0 * bell(u); pawSz = lerp(-.35, 1.05, smooth(u)); hz = -.1 * bell(u); mo = .5 * bell(u); }
      if (lt > 2.4) { cx = lerp(.3, -.02, smooth((lt - 2.5) / .5)); }
      // glass: you toss it into the middle at 3.5
      const gu = (lt - 3.2) / .45; let gx = 0, gy = TY, gz = .3;
      if (lt > 2.6 && lt < 3.9) { look = [clamp((lt - 2.6) * 1.5) * -1.0, -.8 * clamp((lt - 3.4) / .4)]; if (lt > 3.4) look = [lerp(-1, 0, smooth((lt - 3.4) / .5)), -.8]; lid = .4; }
      if (lt >= 3.9) { look = [0, 0]; lid = .55; brow = 1; }
      if (lt > 2.6) { glassFly.visible = true; if (lt < 3.2) { glassFly.matrixAutoUpdate = true; attach(glassFly, YOU, 'handR', [0, -.05, .1], [0, 0, 0]); } else if (lt < 3.65) { glassFly.matrixAutoUpdate = true; const q = arcTo(V3(-1.55, 1.35, -.1), V3(0, TY, .3), gu, .8); glassFly.position.copy(q); glassFly.rotation.set(0, 0, 0); glassFly.scale.setScalar(1); } else { glassFly.visible = false; glassT.visible = true; glassT.position.set(0, TY, .3); const hop = lt < 3.9 ? Math.max(0, .05 * Math.sin((lt - 3.65) * 12) * (1 - (lt - 3.65) * 4)) : 0; glassT.position.y += hop; glassT.rotation.set(0, 0, 0); } }
      setCat({ x: cx, y: TY - .045, z: -.4, wag: t * 3.5, wagAmp: .25, lid, brow, look, hz: hz + sway(t, .02), pawS, pawSz, pawL, pawLz, mouth: mo, smirk: lt > 2.2 ? 1 : .3, slant: lt > 2.2 ? .12 : 0, twitch: t });
      // you
      place(YOU, -1.95, 0, -.05, Math.PI / 2 + .05, 'idle', .5); YOU.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 };
      if (lt < 2.6) { YOU.x = -3.9; YOU.z = -.2; YOU.arms = { lx: -.3, lz: .1, rx: -.6, rz: -.1 }; YOU.anim = 'idle'; YOU.yaw = Math.PI / 2; }
      else if (lt < 3.2) { const w = smooth((lt - 2.6) / .6); YOU.x = lerp(-3.9, -2.1, w); YOU.z = -.2; YOU.anim = 'walk'; YOU.speed = 1.3; YOU.yaw = Math.PI / 2; YOU.arms = { lx: -.3, lz: .1, rx: -1.2, rz: -.1 }; }
      else { YOU.x = -2.1; YOU.z = -.2; YOU.yaw = Math.PI / 2 + .1; const th = clamp((lt - 3.2) / .35); YOU.arms = { lx: -.2, lz: .1, rx: lerp(-1.2, -1.9, th) * (lt < 3.7 ? 1 : 1) + (lt >= 3.7 ? (-.6 + (lt - 3.7) * -.3) : 0), rz: -.1 }; if (lt > 3.9) YOU.arms = { lx: -2.3, lz: .15, rx: -2.3, rz: -.15 }; YOU.y = lt > 3.9 ? Math.abs(Math.sin(t * 8)) * .04 : 0; }
      counter = ['KNOCKED OFF', String(nK), lt < .7 ? 'cat: warming up' : lt < 1.28 ? 'a mug' : lt < 1.97 ? 'the remote' : lt < 2.6 ? 'the plant' : lt < 3.6 ? 'you: new plan' : 'glass: in the middle', true];
      for (let i = 0; i < 3; i++) { const t0 = KN[i].t0 + .05; if (lt > t0 && lt < t0 + .5) lbShow(lbSwat, true, V3(KN[i].x0 + (KN[i].vx > 0 ? .5 : -.5), 1.95 + (lt - t0) * .5, .1), .3, Math.min(1, (lt - t0) * 10)); }
      if (lt > 4.1) lbShow(lbHmm, true, V3(.55, 2.7, .2), .3, Math.min(1, (lt - 4.1) * 6));
      rig(lt, [[0, dk(-.25, 2.2, 6.4), dk(-.3, 2.1, 5.8), dk(-.3, 1.2, 0), dk(-.3, 1.3, 0), 52, 48]], t);
    } else if (bi === 1) {
      // ---- 1: 'Clever!'. the cat stares into the camera and pushes the glass off, slowly.
      glassT.visible = true; chR.position.x = 1.95;
      const gz = lt < 2.2 ? .3 : .3 + .72 * clamp((lt - 2.2) / 2.25); // creeping to the edge (z .95)
      const fall = lt - 4.5; // after tipping
      let gy = TY, gx = 0, gzz = gz, rx = 0, rz = 0;
      if (fall > 0) { const e = .95 + .05; gzz = e + fall * .75; gy = drop(TY, 0, fall, .0, 0); gx = fall * .05; rx = fall * 5; rz = fall * 1.2; if (gy <= .001) { glassT.visible = false; } }
      const hitT = 4.5 + Math.sqrt(2 * TY / GR);
      glassT.position.set(gx, Math.max(0, gy), gzz); glassT.rotation.set(rx, 0, rz); if (gy <= .001 && fall > 0) glassT.visible = false;
      // cat
      let cz = lt < 2.2 ? -.55 : -.55 + (gz - .3) * .88; if (fall > 0) cz = Math.min(cz, .15) + fall * .0; const eyeLook = lt < 2.2 ? [Math.sin(lt * 2) * .0, -.9] : lt < 3.74 ? [0, -.7] : [0, 0];
      const prePush = clamp((lt - 1.2) / .8), pushing = lt >= 2.2 && lt < 4.5; let pawS = 0, pawSz = 0, pawL = 0, lean = 0, hx = 0;
      if (lt > 1.0) { pawS = 1.15 * smooth((lt - 1.0) / 1.2); } if (pushing) { pawS = 1.18 + Math.sin(lt * 1.4) * .02; lean = .06 * smooth((lt - 2.2) / 1); } if (lt >= 4.5) { pawS = lerp(1.18, .7, smooth((lt - 4.5) / .3)) * (lt < 4.8 ? 1 : lerp(1, 0, smooth((lt - 4.8) / .5))); }
      let lid = .55, brow = .9, hz = 0, mo = 0, smirk = 1;
      if (lt < 1.0) { lid = .35; brow = .5; }
      if (lt >= 3.74) { lid = .62; brow = 1; hz = .1 * Math.sin((lt - 3.74) * 1.2); }
      if (lt >= 4.7) { lid = .7; hz = .14; smirk = 1; }
      const blink = (lt > 3.0 && lt < 3.1) ? 1 : 0;
      const ex = lt >= 3.74 ? [0, 0] : eyeLook;
      setCat({ x: 0, y: TY - .045, z: cz, wag: t * 2.2, wagAmp: .22, lid, brow, look: ex, hz: hz + sway(t, .02), hx: lt < 3.74 ? .12 : 0, pawS, pawSz: lerp(0, .0, 1), lean, smirk, blink, slant: .1 });
      // splash when it hits the floor
      if (fall > 0 && fall >= hitT - 4.5 - 0.0) {
        const ht = hitT - 4.5; const l = fall - ht; if (l >= 0) { const o = V3(0 + .05 * ht, 0, .95 + .05 + ht * .75); for (let i = 0; i < 40; i++) { const vx = (cr(i, 1) - .5) * 2.4, vz = (cr(i, 2) - .2) * 2.2, vy = 2.2 + cr(i, 3) * 2.4; const y = vy * l - .5 * GR * .45 * l * l; if (y > 0) water.set(i, o.x + vx * l, y, o.z + vz * l, 1 + .2 * cr(i, 4)); }
          for (let i = 0; i < 10; i++) { const vx = (cr(i, 5) - .5) * 3, vz = (cr(i, 6) - .1) * 2.6, vy = 1.6 + cr(i, 7) * 2; const y = Math.max(.01, vy * l - .5 * GR * l * l); const s = shards[i]; s.visible = true; s.position.set(o.x + vx * Math.min(l, .5), y, o.z + vz * Math.min(l, .5)); s.rotation.set(l * 8 * cr(i, 8), l * 6, l * 5 * cr(i, 9)); }
          puddle.visible = true; puddle.position.set(o.x, .007, o.z + .12); const r = .08 + .5 * smooth(l / 1.0); puddle.scale.set(r, 1, r * .75); water.done(); if (l < 1.0) lbShow(lbCrash, true, V3(o.x, 1.1 + l * .5, o.z + .5), .42, Math.min(1, l * 9)); } }
      water.done();
      counter = ['KNOCKED OFF', fall > 0 && fall >= hitT - 4.5 ? '4' : '3', lt < 1.0 ? 'glass: installed' : lt < 2.2 ? 'cat: considering it' : lt < 3.74 ? 'pushing: slowly' : fall > 0 ? 'glass: gone' : 'eye contact: maintained', true];
      if (lt > .12 && lt < 1.0) lbShow(lbClever, true, V3(.0, 2.65, .3), .34, Math.min(1, (lt - .12) * 6));
      rig(lt, [[0, dk(0, 2.0, 4.8), dk(0, 1.85, 4.2), dk(0, 1.05, .15), dk(0, 1.1, .3), 50, 46], [3.6, dk(0, 1.85, 4.2), dk(0, 1.8, 3.9), dk(0, 1.1, .3), dk(0, .85, .55), 46, 46], [4.7, dk(0, 1.8, 3.9), dk(0, 1.7, 3.5), dk(0, .85, .55), dk(0, 1.2, .5), 46, 40]], t);
    } else if (bi === 2) {
      // ---- 2: glue the glass down. much better. the cat shoves the WHOLE TABLE.
      const shoveT = 3.35, su = clamp((lt - shoveT) / 2.0); const tx = 3.9 * su * su * (3 - 2 * su) * 1.0 + (lt > shoveT ? 0 : 0);
      T.position.x = tx; glassT.visible = true; glassT.position.set(0, TY, .3); glassT.rotation.set(0, 0, 0);
      const stuck = lt > .95; glueBlob.visible = lt > .75; glueBlob.position.set(0, TH + .055, .3); glueBlob.scale.set(clamp((lt - .75) / .3) * 1.0, 1, clamp((lt - .75) / .3));
      // bottle flies in from the left, squirts, leaves
      if (lt > .12 && lt < 1.6) { glueB.visible = true; glueB.matrixAutoUpdate = true; const a = V3(-2.4, 1.6, .5), b = V3(.0, 1.55, .32); let q; let tilt = 0; if (lt < .55) { q = arcTo(a, b, (lt - .12) / .43, .3); tilt = 0; } else if (lt < 1.2) { q = V3(b.x + .0, b.y - .0, b.z); tilt = Math.PI * 1.0 * smooth((lt - .55) / .2); q.y -= .1 * smooth((lt - .55) / .2); } else { const u = (lt - 1.2) / .4; q = arcTo(b, a, u, .3); tilt = Math.PI * (1 - smooth(u * 2)); } glueB.position.copy(q); glueB.rotation.set(0, 0, tilt > 0 ? tilt : 0); }
      if (lt > .75 && lt < 1.2) { const d = V3(0, 1.45, .3); for (let i = 0; i < 6; i++) { const u = (lt - .75 + i * .02) * 2.2 % 1; dust.set(i, 0, lerp(1.4, TY + .02, u), .3, .6); } dust.done(); }
      if (lt > 1.1 && lt < 2.2) lbShow(lbGlued, true, V3(-.55, 2.35, .3), .3, Math.min(1, (lt - 1.1) * 8));
      if (lt > 2.0 && lt < 3.2) lbShow(lbMuch, true, V3(0, 2.5, .3), .28, Math.min(1, (lt - 2.0) * 6));
      // cat: watches the bottle, then tests the glass: it does not move. then hops off and pushes the table
      let cx = -.3, cy = TY - .045, cz = -.45, yaw = 0, pawS = 0, pawSz = 0, hy = 0, run = 0, hz = 0, lid = .5, brow = .8, look = [0, 0], lean = 0, sit = 0, hx = 0, mo = 0, pawL = 0, smirk = 1;
      if (lt < 1.3) { look = [clamp(lt * 3) * -.6 + 0, .8 * clamp(lt * 3)]; hz = -.05; lid = .4; brow = .2; cx = -.3; }
      else if (lt < 2.9) { const sw1 = clamp((lt - 1.45) / .5), sw2 = clamp((lt - 2.0) / .5); cx = -.1; pawS = 1.15 * smooth((lt - 1.4) / .3) * (lt < 2.85 ? 1 : 0); pawSz = -Math.sin(Math.min(1, sw1) * Math.PI) * .0 + (lt > 1.5 && lt < 2.7 ? Math.sin((lt - 1.5) * 15) * .1 * (lt < 2.4 ? 1 : 0) : 0); lid = lt < 2.4 ? .45 : .6; look = [0, lt < 2.1 ? -.6 : 0]; brow = lt < 2.4 ? .3 : 1; hz = lt > 2.2 ? .1 : 0; cz = -.3;
        if (lt > 1.5 && lt < 2.5) { glassT.rotation.z = Math.sin((lt - 1.5) * 15) * .04 * (1 - clamp((lt - 1.5) / 1.0)); } }
      if (lt >= 2.9 && lt < shoveT + .0) { const u = (lt - 2.9) / .45; const a = V3(-.1, TY - .045, -.3), b = V3(-2.15, 0, .4); const q = arcTo(a, b, u, .9); cx = q.x; cy = q.y; cz = q.z; yaw = lerp(0, Math.PI / 2, smooth(u)); hy = -Math.PI / 2 * smooth(u); lid = .5; look = [0, 0]; if (u >= 1) { cx = b.x; cy = 0; cz = b.z; } }
      if (lt >= shoveT) { cx = -2.15 + tx; cy = 0; cz = .4; yaw = Math.PI / 2; hy = -Math.PI / 2 + .1; lean = .22 * clamp((lt - shoveT) / .3); pawS = .9; pawL = .9; run = lt * 22; lid = .5; brow = 1; look = [0, 0]; if (lt > 4.4) hz = .05 * Math.sin(t * 6); }
      // chair gets plowed
      const chx = Math.max(1.95, tx + TW / 2 + .32); chR.position.x = chx; if (tx > 1.6) { const k = clamp((tx - 1.6) / 1.2); chR.rotation.z = -k * 1.3; chR.position.y = Math.sin(k * Math.PI) * .12; chR.position.x += k * .5; }
      setCat({ x: cx, y: cy, z: cz, yaw, wag: t * 2.6, wagAmp: lt > shoveT ? .5 : .22, lid, brow, look, hz: hz + sway(t, .02), hy, hx, lean, pawS, pawSz, pawL, run, mouth: mo, smirk, twitch: t, earFlat: lt > shoveT ? .5 : 0 });
      // dust at the floor while shoving
      if (lt > shoveT + .1) { for (let i = 0; i < 24; i++) { const u = (((lt * 1.5) + i * .07) % 1); const bx = cx + (cr(i, 1) - .5) * .8 - u * .6, bz = cz + (cr(i, 2) - .5) * .5; dust.set(i, bx, .06 + u * .4, bz, (1 - u) * 1.3); } dust.done(); }
      // you: watching at the back-left wall
      place(YOU, -3.0, 0, -1.5, Math.PI / 2 + .6, 'idle', .5); YOU.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 };
      if (lt > 1.2 && lt < 2.9) { YOU.arms = { lx: -.2, lz: .1, rx: -2.4 + Math.sin(t * 9) * .1, rz: -.1 }; }
      if (lt >= shoveT) { YOU.arms = { lx: -2.7 + Math.sin(t * 14) * .12, lz: .15, rx: -2.7 + Math.sin(t * 14 + 1) * .12, rz: -.15 }; shock = true; }
      counter = ['KNOCKED OFF', lt > shoveT + .5 ? '5' : '4', lt < .75 ? 'you: very smart' : lt < 2.9 ? 'glass: glued. cat: unbothered' : lt < shoveT + .5 ? 'cat: new idea' : 'the whole table', true];
      if (lt > shoveT + .15 && lt < shoveT + 1.4) lbShow(lbShove, true, V3(cx + .2, 1.8, cz + .9), .36, Math.min(1, (lt - shoveT - .15) * 8));
      if (lt > shoveT + .1 && lt < shoveT + 1.4) lbShow(lbBang, true, V3(-3.0, 2.7, -1.5), .5, Math.min(1, (lt - shoveT - .1) * 8));
      { const bb = smooth((lt - (shoveT - .7)) / .7); const camX = tx - 1.05; const e0 = [0, 2.1, 5.6 - lt * .03], g0 = [0, 1.25, .1], e1 = [camX, 1.8, 7.4], g1 = [camX, 1.2, 0]; const m3 = (a, b) => [lerp(a[0], b[0], bb), lerp(a[1], b[1], bb), lerp(a[2], b[2], bb)]; const e = m3(e0, e1), g = m3(g0, g1); A.cam(e[0] + Math.sin(t * .9) * .012, e[1], e[2], g[0], g[1], g[2], lerp(48, 56, bb), Math.sin(t * .7) * .004); }
    } else if (bi === 3) {
      // ---- 3: cage drops over the table. cat pulls a key out of nowhere, opens it, smirks with the key in its mouth.
      T.position.x = 0; glassT.visible = true; glassT.position.set(-.6, TY, .15); glueBlob.visible = false; chR.position.set(1.95, 0, .2);
      cage.visible = lt > .3; const cu = lt - .3; const cy = lt < .3 ? 7 : drop(7, 0, cu, 0, .12); cage.position.y = cy; const door = cage.userData.door, lock = cage.userData.lock, shk = cage.userData.shackle;
      const open = clamp((lt - 3.2) / .55); door.rotation.y = -1.95 * smooth(open); shk.rotation.z = lt > 3.1 ? smooth((lt - 3.1) / .15) * 1.2 : 0; shk.position.y = .14 + (lt > 3.1 ? .06 * smooth((lt - 3.1) / .15) : 0);
      let lockFall = 0; if (lt > 3.3) { lockFall = lt - 3.3; const ly = drop(1.58, 0, lockFall, .15, .3); lock.position.y = ly - 0; lock.rotation.z = lockFall * 3; lock.position.z = .08 + lockFall * .4; }
      // cat
      let cx = 0, cz = -.15, sit = 0, hx = 0, hy = 0, hz = 0, lid = .5, brow = .9, key = false, mo = 0, look = [0, 0], lean = 0, pawS = 0, pawSz = 0, wagA = .25, tongue = 0;
      const bounce = lt > .3 ? Math.max(0, Math.sin(cu * 22) * .0) : 0;
      if (lt < 1.4) { look = [0, clamp((lt - .1) * 2) * 1.0]; lid = .4; brow = .5; if (lt > .3) { look = [0, 1]; hz = .05; } cx = 0; }
      else if (lt < 2.45) { lid = .6; brow = 1; look = [0, 0]; hz = lt > 1.7 ? .1 : 0; cx = 0; }
      else if (lt < 2.95) { const u = smooth((lt - 2.45) / .5); cx = lerp(0, 1.02, u); cz = -.2; key = lt > 2.65; mo = lt > 2.55 && lt < 2.7 ? .8 : 0; lid = .5; look = [0, 0]; if (lt > 2.65) { sparkle.clear(); for (let i = 0; i < 14; i++) { const l = lt - 2.65; if (l < 0 || l > .5) continue; const a = i * .45; sparkle.set(i, cx + Math.cos(a) * l * .6, 1.6 + Math.sin(a) * l * .6, cz + .9 + l * .2, 1 - l * 2); } sparkle.done(); } }
      else if (lt < 3.75) { cx = 1.02; cz = -.2; key = true; hx = .15 * bell((lt - 2.95) / .5); hy = 0; lid = .5; look = [lt < 3.3 ? .6 : 0, 0]; pawS = 0; hz = .0; if (lt > 3.4) { cx = lerp(1.02, .55, smooth((lt - 3.4) / .35)); } }
      else { const u = smooth((lt - 3.75) / .6); cx = lerp(.55, .15, u); cz = lerp(-.2, .12, u); key = true; sit = smooth((lt - 3.75) / .45); lid = .62; brow = 1; look = [0, 0]; hz = .08 * Math.sin((lt - 3.9) * 1.1) + .1; wagA = .35; tongue = 0; }
      setCat({ x: cx, y: TY - .045, z: cz, sit, wag: t * 2.4, wagAmp: wagA, lid, brow, look, hz: hz + sway(t, .02), hx, hy, key, mouth: mo, lean, pawS, pawSz, smirk: 1, twitch: t, slant: .12 });
      // you: tiny, wide-eyed, back-left outside the cage
      place(YOU, -2.6, 0, .9, Math.PI / 2 + .3, 'idle', .5); YOU.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 }; if (lt < 1.7) { YOU.arms = { lx: -1.2, lz: .1, rx: -1.2 + Math.sin(t * 6) * .1, rz: -.1 }; } if (lt > 3.2) { YOU.arms = { lx: -2.6 + Math.sin(t * 14) * .1, lz: .12, rx: -2.6 + Math.sin(t * 14 + 1) * .1, rz: -.12 }; shock = true; }
      counter = ['KNOCKED OFF', '5', lt < 1.5 ? 'cage: installing' : lt < 2.5 ? 'cage: secure. probably.' : lt < 3.2 ? 'cat: getting a key' : lt < 3.9 ? 'cage: opened' : 'key: acquired', true];
      if (lt > 1.45 && lt < 2.45) lbShow(lbCage, true, V3(0, 3.0, 1.2), .3, Math.min(1, (lt - 1.45) * 6) * (lt > 2.2 ? 1 - (lt - 2.2) * 4 : 1));
      if (lt > 3.05 && lt < 3.9) lbShow(lbClick, true, V3(1.4, 2.4, 1.3), .4, Math.min(1, (lt - 3.05) * 8));
      if (lt > 4.2) lbShow(lbKey, true, V3(1.1, 2.55, .3), .36, Math.min(1, (lt - 4.2) * 6));
      rig(lt, [[0, dk(.3, 2.5, 7.0), dk(.2, 2.35, 6.6), dk(0, 1.4, 0), dk(0, 1.5, 0), 54, 50], [2.3, dk(.2, 2.35, 6.6), dk(.9, 2.1, 5.8), dk(0, 1.5, 0), dk(.9, 1.6, .2), 50, 46], [3.7, dk(.9, 2.1, 5.8), dk(.35, 1.95, 3.9), dk(.9, 1.6, .2), dk(.2, 1.65, .2), 46, 42]], t);
    } else if (bi === 4) {
      // ---- 4: house on a cliff edge. a very big cat pushes it off.
      const OX = 500; const t0 = 2.75; const hx0 = -1.4, ES = CLIFF - HW / 2 + .18; const LAND = SEA + 2.4;
      const pushU = clamp((lt - t0) / .45); let hxp = lerp(hx0, ES, smooth(pushU)), hyp = 0, hrz = 0, hry = 0;
      const over = lt - (t0 + .45); let landed = -1;
      if (over > 0) { const ft = over; hxp = ES + ft * 1.0; hrz = -Math.min(ft, .45) * 2.4 - Math.max(0, ft - .45) * 3.6; hry = ft * .5; if (ft < .45) hyp = -ft * ft * 1.2; else { const f2 = ft - .45; hyp = -.24 - .5 * 30 * f2 * f2; if (hyp <= LAND) { landed = ft - .45 - Math.sqrt(2 * (LAND + .24) / -30 * -1); hyp = LAND; } } }
      const landAt = Math.sqrt(2 * (-LAND - .24) / 30); // seconds of free fall to the sea
      const l = over - .45 - landAt; // time since splash
      if (l > 0) { hyp = LAND - clamp(l - .15, 0, 1) * .9; hxp = ES + (.45 + landAt) * 1.0 + Math.min(l, .5) * .6; hrz = -(.45 * 2.4 + landAt * 3.6) - Math.min(l, .5) * .8; }
      house.position.set(hxp, hyp, 0); house.rotation.set(0, hry, hrz);
      if (l > 0) { for (let i = 0; i < 50; i++) { const a = cr(i, 1) * 6.28, v = 1.2 + cr(i, 2) * 3.5, vy = 5 + cr(i, 3) * 8; const y = vy * l - .5 * 22 * l * l; if (y > 0) bigW.set(i, OX + house.position.x + Math.cos(a) * v * l * .8, LAND + .2 + y, Math.sin(a) * v * l * .6, 1 - l * .45); } bigW.done(); lbShow(lbCrash, l < 1.0, V3(OX + house.position.x, LAND + 3.4 + l * 1.2, 1.8), 1.3, Math.min(1, l * 10)); }
      // the cat: huge, faces +x, head turned to the camera
      const cs = 3.2; const walking = lt < 2.3; const contactX = hxp - .85 - 2.25 + (over > 0 ? 0 : 0);
      const catXl = lt < t0 ? lerp(-11, hx0 - .85 - 2.25, smooth(clamp(lt / 2.3))) : Math.min(contactX, CLIFF - 3.2);
      let pawS = 0, hz = 0, lid = .5, brow = 1, lean = 0, hy = -Math.PI / 2 + .1;
      if (lt >= 2.0 && lt < t0) { pawS = 1.25 * smooth((lt - 2.0) / .5); lid = .55; }
      if (lt >= t0 && lt < t0 + .8) { pawS = 1.25 + .1 * Math.sin((lt - t0) * 8); lean = .12 * smooth((lt - t0) / .25); lid = .55; }
      if (lt >= t0 + .8) { pawS = lerp(1.3, 0, smooth((lt - t0 - .8) / .7)); lean = .12 * (1 - smooth((lt - t0 - .8) / .6)); lid = .62; hz = .12; }
      setCat({ s: cs, x: OX + catXl, y: 0, z: 0, yaw: Math.PI / 2, wag: t * 2.4, wagAmp: .3, lid, brow, look: [0, 0], hz: hz + sway(t, .015), hy, lean, pawS, run: walking ? lt * 13 : 0, smirk: 1, twitch: t, slant: .12, earFlat: .0 });
      // you: tiny and horrified, standing by the NO TABLES sign
      place(YOU, OX - 5.3, 0, 3.0, Math.PI / 2 - .5, 'idle', .5); YOU.scale = .6; YOU.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 };
      if (lt < 1.9) { YOU.arms = { lx: -.2, lz: .1, rx: -1.0, rz: -.1 }; YOU.yaw = .4; }
      if (lt >= 2.4) { YOU.arms = { lx: -2.7 + Math.sin(t * 14) * .1, lz: .12, rx: -2.7 + Math.sin(t * 14 + 1) * .1, rz: -.12 }; shock = true; YOU.yaw = .6; }
      counter = ['KNOCKED OFF', lt < t0 + .5 ? '5' : '6', lt < 2.0 ? 'house: no tables' : lt < t0 ? 'cat: arriving' : lt < t0 + .5 ? 'house: on the edge' : 'house: gone', true];
      if (lt > .2 && lt < 1.7) lbShow(lbNo, true, V3(OX - 6.0, 3.4, 3.0), .5, Math.min(1, (lt - .2) * 6));
      if (lt > 2.2 && lt < 2.9) lbShow(lbBang, true, V3(OX - 5.3, 2.5, 3.0), .8, Math.min(1, (lt - 2.2) * 8));
      if (lt > 4.5) lbShow(lbBye, true, V3(OX - 2.0, 6.4, 1.0), .75, Math.min(1, (lt - 4.5) * 6));
      rig(lt, [[0, dk(-5.0, 3.2, 15.0), dk(-4.2, 3.0, 14.6), dk(-4.2, 1.6, 0), dk(-3.6, 1.5, 0), 54, 54], [2.3, dk(-4.2, 3.0, 14.6), dk(-2.2, 2.8, 14.0), dk(-3.6, 1.5, 0), dk(-2.2, 1.3, 0), 54, 52], [3.05, dk(-2.2, 2.8, 14.0), dk(.2, .8, 13.5), dk(-2.2, 1.3, 0), dk(1.2, -1.6, 0), 52, 56], [3.55, dk(.2, .8, 13.5), dk(1.4, -5.0, 14.0), dk(1.2, -1.6, 0), dk(2.8, -7.2, 0), 56, 60], [4.3, dk(1.4, -5.0, 14.0), dk(1.4, -5.2, 14.0), dk(2.8, -7.2, 0), dk(2.8, -7.0, 0), 60, 60], [4.55, dk(1.4, -5.2, 14.0), dk(-2.8, 3.0, 13.5), dk(2.8, -7.0, 0), dk(-3.4, 1.8, 0), 60, 52]], t, [OX, 0, 0]);
    } else {
      // ---- 5: the cat sits on a pile of everything you own, satisfied. you, tiny, below.
      const OX = -500; const ptop = PH + .1 + .42;
      let lid = .62, brow = 1, hz = .1 + Math.sin(t * .8) * .03;
      if (lt > 3.66) { lid = lerp(.62, .97, smooth((lt - 3.66) / .5)); brow = .1; hz = .14; }
      setCat({ s: 2.0, x: OX - .2, y: ptop, z: -.5, yaw: 0, sit: 1, wag: t * 2.0, wagAmp: .45, lid, brow, look: [0, 0], hz, smirk: 1, twitch: t, slant: .1 });
      place(YOU, OX - 2.6, 0, 6.2, Math.PI, 'idle', .5); YOU.scale = .9; YOU.arms = { lx: -.15, lz: .1, rx: -.15, rz: -.1 }; YOU.pitch = .12;
      const stuff = lt < .15 ? 6 : lt < 3.4 ? Math.round(6 + (1847 - 6) * smooth(lt / 3.4)) : 1847;
      counter = ['KNOCKED OFF', fmt(stuff), lt < 1.3 ? 'everything you own' : lt < 3.4 ? 'pile: growing' : 'cat: satisfied', true];
      if (lt > 3.66) { hearts.forEach((h, i) => { if (i > 5) return; const l = lt - (3.8 + i * .13); if (l < 0 || l > 1.4) return; h.visible = true; h.position.set(OX - .2 + Math.sin(i * 2.3) * .9, ptop + 2.4 + l * .6, 1.0); const s = .4 + .08 * Math.sin(clamp(l / .25) * Math.PI * .5); h.scale.set(s, s, 1); h.material.opacity = 1 - clamp((l - .9) / .5); }); lbShow(lbPurr, true, V3(OX - .2, ptop + 5.4, 1.2), .9, Math.min(1, (lt - 3.7) * 6)); }
      rig(lt, [[0, dk(-.5, 1.7, 17.5), dk(-.3, 2.5, 15.5), dk(-.2, 5.2, 0), dk(-.2, 5.9, 0), 62, 58], [1.9, dk(-.3, 2.5, 15.5), dk(-.2, 7.8, 10.0), dk(-.2, 5.9, 0), dk(-.2, ptop + 1.0, 0), 58, 46], [3.5, dk(-.2, 7.8, 10.0), dk(-.2, ptop + 1.8, 5.3), dk(-.2, ptop + 1.0, 0), dk(-.2, ptop + 1.5, 0), 46, 38]], t, [OX, 0, 0]);
    }
    A.follow(bi === 4 ? 500 : bi === 5 ? -500 : 0, 0);
    S.fog.near = 60; S.fog.far = 300;
    crowd.setFace(shock ? 'shock' : 'calm'); crowd.update(t);
    if (bi === 0 && lt > 2.6 && lt < 3.2) attach(glassFly, YOU, 'handR', [0, -.05, .1], [0, 0, 0]);
    if (bi === 2 || (bi === 0 && lt < 2.6)) { /* noop */ }
    A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    if (counter) hud.counter(counter[0], counter[1], counter[2], '', counter[3]);
    hud.tm(''); hud.pop('', 0);
  } };
}
