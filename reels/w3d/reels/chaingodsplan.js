import { drakeLook } from './_drake.js';
// 664 invention chain: Drake gives away $1M -> one guy -> 100 shoppers -> store emptied -> buys store (free) -> Fed calls -> bananas.
// Generic parody caricature, no real lyrics. Outside sidewalk (z=50) + one grocery store (origin).
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, mat, ground, Crowd, clamp, smooth, lerp, attach, building, tree } = lib;
  const A = makeStage({ fog: 0xcfd8e4, fogNear: 60, fogFar: 200, clouds: true, skyTop: 0x3f86d8, skyMid: 0x9cc8f0, skyBot: 0xe2eef9, shadowExtent: 26, shadowRes: 2048, hemi: 1.7, sunI: 1.5, sunDir: [-.3, .9, .35], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const B = (g, x, y, z, w, h, d, c, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.material || mat(c, o.mat)); m.position.set(x, y, z); if (o.ry) m.rotation.y = o.ry; m.castShadow = o.cast !== false; m.receiveShadow = true; g.add(m); return m; };
  const panel = (g, tex, w, h, x, y, z, ry = 0, o = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, side: THREE.DoubleSide, transparent: !!o.tr })); m.position.set(x, y, z); m.rotation.y = ry; g.add(m); return m; };
  const OZ = 50; // outside street z
  ground(S, 0x8d9096, 500, { y: -.03 });

  // ------------------------------------------------------------------ OUTSIDE (beat 0)
  const outG = new THREE.Group(); S.add(outG);
  B(outG, 0, .05, OZ + 1, 60, .1, 9, 0xc9c6bf, { cast: false }); B(outG, 0, .06, OZ + 5.7, 60, .12, .4, 0xaaa79f, { cast: false });
  B(outG, 0, .01, OZ + 12, 60, .04, 14, 0x3a3d44, { cast: false });
  for (let i = -5; i <= 5; i++) B(outG, i * 5.5, .04, OZ + 12, 2.6, .02, .25, 0xe8d36a, { cast: false });
  [[-14, 0xb8604a, 10, 9], [-3, 0x6c86b0, 9, 11], [7, 0xd2b27a, 12, 8], [18, 0x7ea07a, 9, 10]].forEach(([x, c, w, h], i) => building(outG, x, OZ - 6.5, w, h, 7, c, 30 + i));
  [-9, 4, 14].forEach((x) => { B(outG, x, 2.1, OZ + 5.3, .12, 4.2, .12, 0x333840); B(outG, x, 4.2, OZ + 5.0, .12, .12, .8, 0x333840); B(outG, x, 4.14, OZ + 4.65, .5, .1, .25, 0xfff3c0, { material: new THREE.MeshBasicMaterial({ color: 0xfff3c0 }) }); });
  [-12, 11, 19].forEach((x, i) => tree(outG, x, OZ + 5.5, 1.1, 60 + i));
  B(outG, -4.2, .45, OZ + 4.5, 1.6, .12, .5, 0x8a5a34); B(outG, -4.2, .22, OZ + 4.5, 1.4, .44, .06, 0x5a3a20);

  // ------------------------------------------------------------------ STORE
  const stG = new THREE.Group(); S.add(stG);
  const floorT = cvs(512, 512, (g) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#e7e4dc' : '#d3cfc4'; g.fillRect(i * 64, j * 64, 64, 64); } }); floorT.t.wrapS = floorT.t.wrapT = THREE.RepeatWrapping; floorT.t.repeat.set(34 / 4, 30 / 4);
  { const f = new THREE.Mesh(new THREE.PlaneGeometry(34.6, 30.6), new THREE.MeshStandardMaterial({ map: floorT.t, roughness: .55 })); f.rotation.x = -Math.PI / 2; f.position.set(0, .01, 0); f.receiveShadow = true; stG.add(f); }
  const WALL = 0xf0e6cf;
  B(stG, 0, 3.5, -15.3, 35, 7, .4, WALL); B(stG, -17.3, 3.5, 0, .4, 7, 31, WALL);
  B(stG, 17.3, 3.5, -6.5, .4, 7, 17, WALL); B(stG, 17.3, 3.5, 12.5, .4, 7, 5.2, WALL); B(stG, 17.3, 6.0, 5, .4, 2, 8, WALL);
  B(stG, -9.5, 3.5, 15.3, 15.5, 7, .4, WALL); B(stG, 9.5, 3.5, 15.3, 15.5, 7, .4, WALL); B(stG, 0, 6.0, 15.3, 4, 2, .4, WALL);
  B(stG, 0, 6.8, -15.0, 34, .6, .5, 0x2f7a46, { cast: false }); // green stripe
  { const c = new THREE.Mesh(new THREE.PlaneGeometry(34.6, 30.6), new THREE.MeshStandardMaterial({ color: 0xf6f6f2, roughness: 1 })); c.rotation.x = Math.PI / 2; c.position.set(0, 7.0, 0); stG.add(c); }
  for (let i = -2; i <= 2; i++) for (let j = -1; j <= 1; j++) B(stG, i * 6.5, 6.93, j * 8, 4.2, .08, .7, 0xffffff, { material: new THREE.MeshBasicMaterial({ color: 0xfffbea }), cast: false });
  const signT = cvs(1024, 220, (g, w, h) => { g.fillStyle = '#1f7a3c'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffe14a'; g.fillRect(0, h - 18, w, 18); txt(g, 'FRESH MART', w / 2, 100, 150, '#fff', { stroke: '#0c3a1a', sw: 16 }); });
  panel(stG, signT.t, 9, 1.9, 0, 5.6, 14.95, Math.PI);

  // --- shelves + items (instanced)
  const TIERS = [.35, 1.05, 1.75, 2.45]; const items = []; const PAL = [0xe53935, 0xfdd835, 0x43a047, 0x1e88e5, 0xfb8c00, 0x8e24aa, 0xf5f5f5, 0xff7043, 0x26c6da, 0xd81b60];
  const shelfRun = (x0, z0, len, dir, face, tiers, doubleSide) => { // dir 'x' or 'z'; face = +1/-1 direction items face (perp axis)
    const cx = dir === 'x' ? x0 + len / 2 : x0, cz = dir === 'z' ? z0 + len / 2 : z0; const sx = dir === 'x' ? len : (doubleSide ? 1.1 : .8), sz = dir === 'x' ? (doubleSide ? 1.1 : .8) : len;
    const top = tiers[tiers.length - 1] + .75; B(stG, cx, top / 2, cz, sx * .98, top, sz * .98, 0x2b3a55, { cast: false, material: new THREE.MeshStandardMaterial({ color: 0x2b3a55, roughness: .9 }) }).visible = false;
    const post = (a, b) => { B(stG, dir === 'x' ? a : b, top / 2, dir === 'x' ? b : a, .1, top, .1, 0x35486b); };
    const nP = Math.max(2, Math.round(len / 4) + 1); for (let i = 0; i < nP; i++) { const a = (dir === 'x' ? x0 : z0) + len * i / (nP - 1); [-1, 1].forEach((s) => post(a, (dir === 'x' ? z0 : x0) + s * (doubleSide ? .52 : .0))); }
    tiers.forEach((ty) => { B(stG, cx, ty - .02, cz, sx, .05, sz, 0xdad6c8, { cast: false }); });
    if (!doubleSide) B(stG, dir === 'x' ? cx : x0 - face * .34, top / 2, dir === 'x' ? z0 - face * .34 : cz, dir === 'x' ? len : .05, top, dir === 'x' ? .05 : len, 0x35486b, { cast: false });
    const sides = doubleSide ? [-1, 1] : [face];
    sides.forEach((sd) => tiers.forEach((ty, ti) => { for (let k = .25; k < len - .2; k += .43 + cr(k * 7, ti) * .05) { const w = .26 + cr(k, ti) * .1, h = .32 + cr(ti, k) * .18, dp = .38; const off = (doubleSide ? .25 : .0) * sd; const px = dir === 'x' ? x0 + k : x0 + sd * (doubleSide ? .26 : .02) * 1 + face * (doubleSide ? 0 : .14); const pz = dir === 'x' ? z0 + sd * (doubleSide ? .26 : 0) + (doubleSide ? 0 : face * .14) : z0 + k; const cxp = dir === 'x' ? px : px + (doubleSide ? 0 : 0); items.push({ p: dir === 'x' ? [x0 + k, ty + h / 2, z0 + (doubleSide ? sd * .26 : face * .14)] : [x0 + (doubleSide ? sd * .26 : face * .14), ty + h / 2, z0 + k], s: dir === 'x' ? [w, h, dp] : [dp, h, w], c: PAL[(cr(k * 3.1, ti + sd) * PAL.length) | 0], th: cr(k * 5.3 + ti, x0 + z0 + sd) }); } }));
  };
  shelfRun(-16.2, -14.55, 32.4, 'x', 1, TIERS, false);
  shelfRun(-16.55, -14, 28, 'z', 1, TIERS, false);
  shelfRun(16.55, -14, 16, 'z', -1, TIERS, false);
  [-10, 0, 10].forEach((x) => shelfRun(x - 4.5, -8.5, 9, 'x', 1, TIERS.slice(0, 3), true));
  const itemMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat(0xffffff, { roughness: .6 }), items.length); itemMesh.castShadow = true; itemMesh.frustumCulled = false; stG.add(itemMesh);
  items.forEach((it, i) => itemMesh.setColorAt(i, new THREE.Color(it.c))); itemMesh.instanceColor.needsUpdate = true;
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _e = new THREE.Euler(); let lastE = -9;
  const setShelves = (e) => { const k = Math.round(e * 60); if (k === lastE) return; lastE = k; items.forEach((it, i) => { const on = it.th >= e; _m.compose(_p.set(...it.p), _q.identity(), on ? _s.set(...it.s) : _s.set(0, 0, 0)); itemMesh.setMatrixAt(i, _m); }); itemMesh.instanceMatrix.needsUpdate = true; };
  // aisle signs hanging
  ['PRODUCE', 'SNACKS', 'DAIRY'].forEach((n, i) => { const t = cvs(512, 140, (g, w, h) => { g.fillStyle = '#f2c230'; g.fillRect(0, 0, w, h); txt(g, n, w / 2, 74, 92, '#222'); }); [-10, 0, 10].forEach((x, j) => { if (j !== i) return; B(stG, x, 5.2, -8.5, .05, 1.4, .05, 0x555555); panel(stG, t.t, 2.2, .6, x, 4.6, -8.0, 0); panel(stG, t.t, 2.2, .6, x, 4.6, -9.0, Math.PI); }); });
  // banana display + crate
  const crate = new THREE.Group(); stG.add(crate); crate.position.set(-8, 0, 3.2);
  B(crate, 0, .45, 0, 2.2, .9, 1.4, 0xb98450); B(crate, 0, .96, 0, 1.9, .06, 1.1, 0x6a4524);
  const bnT = cvs(512, 160, (g, w, h) => { g.fillStyle = '#ffe14a'; g.fillRect(0, 0, w, h); txt(g, 'BANANAS', w / 2, 62, 96, '#222'); txt(g, '$0.29 / lb', w / 2, 124, 44, '#a11', { w: 800 }); });
  panel(crate, bnT.t, 1.8, .56, 0, 1.55, .7, 0); B(crate, 0, 1.2, .72, .06, .5, .06, 0x444444);
  const NB = 70; const bananaGeo = new THREE.CapsuleGeometry(.07, .34, 3, 6); const yel = mat(0xffd21f, { roughness: .6 });
  const crBan = new THREE.InstancedMesh(bananaGeo, yel, NB); crBan.castShadow = true; crBan.frustumCulled = false; crate.add(crBan); const crTh = []; for (let i = 0; i < NB; i++) crTh.push(cr(i, 9));
  const setCrate = (e) => { for (let i = 0; i < NB; i++) { const on = crTh[i] >= e; _e.set(Math.PI / 2 + (cr(i, 2) - .5) * .5, cr(i, 3) * 3, (cr(i, 4) - .5) * .6); _m.compose(_p.set((cr(i, 5) - .5) * 1.7, 1.02 + cr(i, 6) * .12, (cr(i, 7) - .5) * .9), _q.setFromEuler(_e), on ? _s.set(1, 1, 1) : _s.set(0, 0, 0)); crBan.setMatrixAt(i, _m); } crBan.instanceMatrix.needsUpdate = true; };
  // registers + FREE sign
  const cashiers = [-12, -8, -4]; cashiers.forEach((x) => { B(stG, x, .5, 10, 2.6, 1.0, 1.1, 0x2d3a52); B(stG, x, 1.02, 10, 2.6, .06, 1.1, 0x9aa4b5); B(stG, x + .6, 1.35, 9.9, .55, .5, .4, 0x15181f); const sc = cvs(128, 96, (g, w, h) => { g.fillStyle = '#0d3d1c'; g.fillRect(0, 0, w, h); txt(g, '$0.00', w / 2, h / 2, 40, '#6dff9a'); }); panel(stG, sc.t, .46, .34, x + .6, 1.4, 9.68, Math.PI); B(stG, x - .5, 1.1, 10, .9, .08, .6, 0x15181f); });
  const freeT = cvs(1024, 420, (g, w, h) => { g.fillStyle = '#e0141c'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 16; g.strokeRect(14, 14, w - 28, h - 28); txt(g, 'FREE', w / 2, 170, 260, '#fff', { stroke: '#5a0508', sw: 22 }); txt(g, 'EVERYTHING. NO CATCH.', w / 2, 340, 80, '#ffe14a', { stroke: '#5a0508', sw: 10 }); });
  const freeSign = new THREE.Group(); stG.add(freeSign); const poleG = new THREE.Group(); stG.add(poleG); panel(freeSign, freeT.t, 6.4, 2.6, 0, 0, 0, 0); freeSign.position.set(-8, 4.6, 7.0); freeSign.rotation.y = Math.PI; [-2.8, 2.8].forEach((x) => { B(poleG, -8 + x, 6, 7.0, .06, 2.8, .06, 0x555555); });
  const freeA = new THREE.Group(); stG.add(freeA); B(freeA, -.5, 1.0, 0, .12, 2.0, .9, 0xd01820); B(freeA, .5, 1.0, 0, .12, 2.0, .9, 0xd01820).rotation.z = 0; freeA.position.set(-3.5, 0, 4.5); freeA.children.forEach((c, i) => { c.rotation.z = i ? -.35 : .35; c.visible = false; });
  { const fa = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2), new THREE.MeshBasicMaterial({ map: freeT.t, toneMapped: false, side: THREE.DoubleSide })); fa.position.set(0, 1.1, 0); freeA.add(fa); }
  // TV
  const tvC = cvs(1024, 576); const tvM = panel(stG, tvC.t, 7.4, 4.16, 0, 4.0, -14.97, 0); B(stG, 0, 4.0, -15.05, 7.8, 4.5, .12, 0x15181f);
  const drawTV = (lt) => { const g = tvC.g, w = 1024, h = 576; g.fillStyle = '#0b1220'; g.fillRect(0, 0, w, h); g.fillStyle = '#16233a'; g.fillRect(0, 0, w, 78); txt(g, 'FOOD PRICE INDEX', 40, 40, 44, '#e8eef9', { al: 'left' }); txt(g, 'LIVE', w - 40, 40, 36, '#ff4a4a', { al: 'right' });
    g.strokeStyle = '#1f3050'; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(40, 90 + i * 70); g.lineTo(w - 40, 90 + i * 70); g.stroke(); }
    const u = clamp((lt - .6) / 4.0); const N = 60; g.strokeStyle = '#ff3b3b'; g.lineWidth = 9; g.lineJoin = 'round'; g.beginPath(); let last = [0, 0]; for (let i = 0; i <= N * u; i++) { const x = 50 + (w - 100) * i / N; const base = 1 - Math.pow(i / N, 1.7); const y = 120 + (1 - base) * 380 + Math.sin(i * 1.7) * 14 * (1 - i / N * .6); if (i === 0) g.moveTo(x, y); else g.lineTo(x, y); last = [x, y]; } g.stroke(); g.fillStyle = '#ff3b3b'; g.beginPath(); g.arc(last[0], last[1], 13, 0, 7); g.fill();
    const pct = -Math.round(97 * Math.pow(u, 1.0)); txt(g, pct + '%', w - 60, 140, 120, '#ff4a4a', { al: 'right', stroke: '#0b1220', sw: 10 }); txt(g, 'MARKETS PANIC', w / 2, 540, 46, '#ffe14a', { stroke: '#000', sw: 8 }); tvC.t.needsUpdate = true; };
  drawTV(0);

  // ------------------------------------------------------------------ props: stack, cart, bills, haul, phone, owl, mountain, confetti
  const stackT = cvs(512, 340, (g, w, h) => { g.fillStyle = '#2f9a4d'; g.fillRect(0, 0, w, h); g.fillStyle = '#287f40'; for (let i = 0; i < 9; i++) g.fillRect(0, i * 40 + 30, w, 4); g.fillStyle = '#f1e7c4'; g.fillRect(150, 0, 212, h); txt(g, '$1,000,000', w / 2, 118, 62, '#1d5a2c', { w: 900 }); txt(g, 'CASH', w / 2, 220, 80, '#1d5a2c'); });
  const stack = new THREE.Group(); S.add(stack); { const m = new THREE.Mesh(new THREE.BoxGeometry(1.5, .95, .75), [mat(0x2f9a4d), mat(0x2f9a4d), mat(0x3aa85a), mat(0x287f40), new THREE.MeshBasicMaterial({ map: stackT.t, toneMapped: false }), mat(0x2f9a4d)]); m.castShadow = true; stack.add(m); }
  const cart = new THREE.Group(); stG.add(cart); { B(cart, 0, .62, 0, 1.9, .14, 1.3, 0xb7bcc6); B(cart, 0, .95, .62, 1.9, .55, .06, 0xc9ced8); B(cart, 0, .95, -.62, 1.9, .55, .06, 0xc9ced8); B(cart, .92, .95, 0, .06, .55, 1.3, 0xc9ced8); B(cart, -.92, .95, 0, .06, .55, 1.3, 0xc9ced8); [[-.8, -.5], [.8, -.5], [-.8, .5], [.8, .5]].forEach(([x, z]) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .1, 12), mat(0x222222)); w.rotation.z = Math.PI / 2; w.position.set(x, .16, z); w.castShadow = true; cart.add(w); B(cart, x, .38, z, .08, .46, .08, 0x777777); });
    B(cart, 0, 1.3, -.7, 1.9, .06, .06, 0xdee2ea); for (let i = 0; i < 6; i++) B(cart, -.75 + i * .3, .85, 0, .22, .2 + (i % 3) * .08, .34, 0x2f9a4d, { cast: false }); }
  const NBILL = 110; const billM = new THREE.InstancedMesh(new THREE.BoxGeometry(.34, .012, .17), new THREE.MeshStandardMaterial({ color: 0x66c27e, roughness: .6 }), NBILL); billM.frustumCulled = false; billM.castShadow = true; S.add(billM);
  const NP = 100, N = 2 + NP + 3; const crowd = new Crowd(S, N, 77); const P = crowd.p; const D = P[0], GUY = P[1];
  const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  const look = drakeLook(lib, S, crowd, 0, { jersey: 0x1f5a3a }); D.h = 1; D.scale = 1.15;
  col(1, ['torso', 'armL', 'armR'], 0xd8d8d0); col(1, ['legL', 'legR'], 0x3a4a68); col(1, ['hair'], 0x2a1d14);
  for (let i = 0; i < 3; i++) { const j = 102 + i; col(j, ['torso', 'armL', 'armR'], 0x1f7a3c); col(j, ['legL', 'legR'], 0x222831); }
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const place = (o, x, z, yaw, anim, y = 0, sp = 1) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; };
  const facing = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
  // carts + hauls per shopper (instanced, attached to torso)
  const cartI = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat(0xb7bcc6, { roughness: .5, metalness: .3 }), NP); cartI.frustumCulled = false; cartI.castShadow = true; S.add(cartI);
  const lootI = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat(0xffffff), NP * 2); lootI.frustumCulled = false; lootI.castShadow = true; S.add(lootI);
  for (let i = 0; i < NP * 2; i++) lootI.setColorAt(i, new THREE.Color(PAL[(cr(i, 11) * PAL.length) | 0])); lootI.instanceColor.needsUpdate = true;
  const hideM = new THREE.Matrix4().makeScale(0, 0, 0); const MM = new THREE.Matrix4(), TT = new THREE.Matrix4(), SS = new THREE.Matrix4();
  const putOn = (mesh, idx, o, off, sc) => { MM.copy(o.M.torso); TT.makeTranslation(off[0], off[1], off[2]); MM.multiply(TT); SS.makeScale(sc[0], sc[1], sc[2]); MM.multiply(SS); mesh.setMatrixAt(idx, MM); };
  // phone
  const phT = cvs(512, 960); const phone = new THREE.Group(); S.add(phone); { B(phone, 0, 0, 0, 1.6, 2.9, .24, 0x15181f); const pm = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 2.74), new THREE.MeshBasicMaterial({ map: phT.t, toneMapped: false })); pm.position.z = .13; phone.add(pm); }
  const rings = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .04, 6, 40), new THREE.MeshBasicMaterial({ color: 0xffe14a, transparent: true, toneMapped: false })); S.add(m); return m; });
  const drawPhone = (lt) => { const g = phT.g, w = 512, h = 960; g.fillStyle = '#12172a'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8cfe2'; g.beginPath(); g.arc(256, 250, 110, 0, 7); g.fill(); g.fillStyle = '#6a7392'; g.fillRect(190, 300, 132, 40); g.beginPath(); g.arc(256, 215, 48, 0, 7); g.fill(); txt(g, 'FEDERAL', 256, 440, 84, '#fff'); txt(g, 'RESERVE', 256, 520, 84, '#fff'); txt(g, 'incoming call...', 256, 600, 40, '#9aa4c4', { w: 700 }); const pulse = .5 + .5 * Math.sin(lt * 14); g.fillStyle = `rgb(${200},${40 + pulse * 20 | 0},${40})`; g.beginPath(); g.arc(130, 790, 62, 0, 7); g.fill(); g.fillStyle = `rgb(40,${150 + pulse * 70 | 0},70)`; g.beginPath(); g.arc(382, 790, 62 + pulse * 8, 0, 7); g.fill(); txt(g, 'X', 130, 792, 64, '#fff'); txt(g, 'OK', 382, 792, 54, '#fff'); phT.t.needsUpdate = true; };
  // owl
  const owl = new THREE.Group(); S.add(owl); { const br = mat(0x7a5230), bel = mat(0xe6d3a8); const body = new THREE.Mesh(new THREE.SphereGeometry(.5, 14, 10), br); body.scale.set(1, 1.2, .9); body.position.y = .6; body.castShadow = true; const belly = new THREE.Mesh(new THREE.SphereGeometry(.38, 12, 8), bel); belly.position.set(0, .55, .22); belly.scale.set(1, 1.2, .6); const eyeM = new THREE.MeshBasicMaterial({ color: 0xffffff }), pup = new THREE.MeshBasicMaterial({ color: 0x111111 }); [-.2, .2].forEach((x) => { const e = new THREE.Mesh(new THREE.SphereGeometry(.17, 10, 8), eyeM); e.position.set(x, .86, .38); const pp = new THREE.Mesh(new THREE.SphereGeometry(.08, 8, 6), pup); pp.position.set(x, .86, .53); owl.add(e, pp); const ear = new THREE.Mesh(new THREE.ConeGeometry(.1, .25, 5), br); ear.position.set(x * 1.4, 1.28, 0); owl.add(ear); }); const beak = new THREE.Mesh(new THREE.ConeGeometry(.07, .18, 5), mat(0xf0a020)); beak.rotation.x = Math.PI / 2; beak.position.set(0, .76, .5); owl.add(body, belly, beak); owl.scale.setScalar(.9); }
  // banana mountain
  const MR = 5.8, MH = 5.4; const mtn = new THREE.Group(); S.add(mtn); mtn.position.set(0, 0, -2);
  const core = new THREE.Mesh(new THREE.ConeGeometry(MR * .94, MH, 28, 1, true), mat(0xb88a10, { roughness: .8 })); core.position.y = MH / 2; core.castShadow = true; core.receiveShadow = true; mtn.add(core);
  const NMB = 1500; const mBan = new THREE.InstancedMesh(new THREE.CapsuleGeometry(.17, .8, 3, 7), mat(0xffffff, { roughness: .55 }), NMB); mBan.frustumCulled = false; mBan.castShadow = true; mBan.receiveShadow = true; mtn.add(mBan);
  const MBd = []; for (let i = 0; i < NMB; i++) { const h = Math.pow(cr(i, 21), .8); const rad = (1 - h) * MR * (.85 + cr(i, 22) * .2) + .05; const a = cr(i, 23) * 6.283; const y = h * MH * .97 + .1; MBd.push({ p: [Math.cos(a) * rad, y, Math.sin(a) * rad], rot: [(cr(i, 24) - .5) * 2.4, cr(i, 25) * 6.28, Math.PI / 2 + (cr(i, 26) - .5) * 1.6], th: h, sc: .85 + cr(i, 27) * .4 }); mBan.setColorAt(i, new THREE.Color().setHSL(.14 + cr(i, 28) * .03 - (cr(i, 29) > .93 ? .06 : 0), .95, .36 + cr(i, 30) * .08)); } mBan.instanceColor.needsUpdate = true;
  const setMountain = (g) => { for (let i = 0; i < NMB; i++) { const b = MBd[i]; const u = clamp((g * 1.15 - b.th * .9) / .25); _e.set(...b.rot); _m.compose(_p.set(...b.p), _q.setFromEuler(_e), _s.setScalar(b.sc * u)); mBan.setMatrixAt(i, _m); } mBan.instanceMatrix.needsUpdate = true; core.scale.set(clamp(g * 1.5), clamp(g * 1.2), clamp(g * 1.5)); core.position.y = MH / 2 * clamp(g * 1.2); };
  const bsT = cvs(1024, 400, (g, w, h) => { g.fillStyle = '#ffe14a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#222'; g.lineWidth = 18; g.strokeRect(10, 10, w - 20, h - 20); txt(g, '$1 = 1 BANANA', w / 2, 200, 150, '#1a1a1a'); txt(g, 'OFFICIAL EXCHANGE RATE', w / 2, 330, 52, '#a11', { w: 800 }); });
  const bsign = new THREE.Group(); S.add(bsign); panel(bsign, bsT.t, 4.4, 1.7, 0, 3.0, 0, 0); B(bsign, -2.0, 1.5, -.05, .14, 3.0, .14, 0x5a3a20); B(bsign, 2.0, 1.5, -.05, .14, 3.0, .14, 0x5a3a20); bsign.position.set(-5.5, 0, 6);
  const NC = 180; const conf = new THREE.InstancedMesh(new THREE.BoxGeometry(.12, .02, .08), new THREE.MeshBasicMaterial({ toneMapped: false }), NC); conf.frustumCulled = false; S.add(conf); const CCOL = [0xffd92a, 0xff3b3b, 0x3bd1ff, 0x6dff6d, 0xff6bd6, 0xffffff]; for (let i = 0; i < NC; i++) conf.setColorAt(i, new THREE.Color(CCOL[i % 6])); conf.instanceColor.needsUpdate = true;
  const wb = (txtS) => { const t = cvs(256, 128, (g) => txt(g, txtS, 128, 70, 110, '#ffe14a', { stroke: '#111', sw: 14 })); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t.t, transparent: true, depthWrite: false })); sp.visible = false; S.add(sp); return sp; };
  const bangs = [wb('!?'), wb('!?'), wb('!?')];

  // ------------------------------------------------------------------ camera rig
  const E = V3(0, 0, 0), T2 = V3(0, 0, 0);
  const rig = (lt, shots, t) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .5);
    E.set(lerp(s[1][0], s[2][0], u), lerp(s[1][1], s[2][1], u), lerp(s[1][2], s[2][2], u)); T2.set(lerp(s[3][0], s[4][0], u), lerp(s[3][1], s[4][1], u), lerp(s[3][2], s[4][2], u)); E.x += Math.sin(t * .9) * .03; E.y += Math.sin(t * 1.3 + 1) * .025; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .01); };
  const hp = (o, key) => V3(0, 0, 0).setFromMatrixPosition(o.M[key]);
  // shopper layout
  const GX = 10, shop = []; for (let i = 0; i < NP; i++) { const c = i % GX, r = Math.floor(i / GX); shop.push({ gx: -6.5 + c * 1.45 + (cr(i, 1) - .5) * .4, gz: 1.6 + r * 1.2 + (cr(i, 2) - .5) * .3, d: cr(i, 3) * 1.3 }); }
  const DOOR = [16.5, 6.5];
  let lastBeat = -1;
  return { frame({ t, bi, lt }) {
    bi = Math.min(bi, 5);
    for (let i = 0; i < N; i++) P[i].vis = false;
    outG.visible = bi === 0; stG.visible = bi >= 1; billM.visible = bi === 1; stack.visible = bi === 0; cart.visible = bi === 1; phone.visible = bi === 4; owl.visible = bi === 4; mtn.visible = bi === 5; bsign.visible = bi === 5; conf.visible = bi === 5 && lt > 1.2; cartI.visible = lootI.visible = bi === 2 || bi === 3; freeA.visible = bi === 3; freeSign.visible = poleG.visible = bi >= 2 && bi <= 3; rings.forEach((r) => (r.visible = bi === 4)); bangs.forEach((b) => (b.visible = false));
    let faceShock = bi === 0 || bi === 2; let eShelf = 0;
    const camShots = [];
    const dirs = (o, x, z, tx, tz) => { o.yaw = facing(x, z, tx, tz); };
    // ================= beat 0 : sidewalk
    if (bi === 0) {
      const walkU = clamp(lt / 1.5); const dx = lerp(-8, -1.15, smooth(walkU)); place(D, dx, OZ, .93, walkU < 1 ? 'walk' : 'idle', 0, 1);
      place(GUY, 1.25, OZ, -.93, 'idle', 0, 1);
      const hand = clamp((lt - 1.5) / .9); const rec = smooth(hand);
      D.arms = { lx: lerp(-.3, -1.35, smooth(clamp(lt / 1.0))), lz: -.1, rx: lerp(-.3, -1.35, smooth(clamp(lt / 1.0))), rz: .1 }; if (lt > 2.4) { const c = smooth((lt - 2.5) / .35); D.arms = { lx: lerp(-1.35, -.3, c), lz: -.1, rx: lerp(-1.35, -2.5, c), rz: lerp(.1, .6, c) }; }
      if (lt < 1.5) D.arms = { lx: -1.35 + Math.sin(lt * 8.5) * .06, lz: -.1, rx: -1.35 - Math.sin(lt * 8.5) * .06, rz: .1 };
      GUY.arms = { lx: lerp(-.2, -1.4, smooth(clamp((lt - 1.1) / .4))), lz: -.1, rx: lerp(-.2, -1.4, smooth(clamp((lt - 1.1) / .4))), rz: .1 }; if (lt > 2.4) { GUY.pitch = .28 + Math.sin(lt * 4) * .03; const j = smooth((lt - 3.3) / .3); GUY.arms = { lx: -1.35 - j * .9, lz: -.2 - j * .5, rx: -1.35 - j * .9, rz: .2 + j * .5 }; }
      GUY.y = lt > 3.4 ? Math.abs(Math.sin((lt - 3.4) * 9)) * .25 : 0;
      for (let k = 0; k < 6; k++) { const o = P[2 + k]; const dirn = k % 2 ? 1 : -1; place(o, (k % 2 ? -16 : 16) + dirn * (lt * 2.4 + k * 3) * (k % 2 ? 1 : -1) * -1 * 0 + (k % 2 ? 1 : -1) * 0 + ((k % 2 ? 1 : -1) * (lt * 1.8 + k * 2.2)), OZ - 2.2 - (k % 3) * .7, k % 2 ? Math.PI / 2 : -Math.PI / 2, 'walk', 0, .9); o.x = (k % 2 ? -14 : 14) + (k % 2 ? 1 : -1) * (lt * 1.9 + k * 4.5); if (Math.abs(o.x) > 20) o.vis = false; }
      // stack
      crowd.update(t); look.update(); look.setVisible(true);
      const dm = V3(0, 0, 0).addVectors(hp(D, 'handL'), hp(D, 'handR')).multiplyScalar(.5); const gm = V3(0, 0, 0).addVectors(hp(GUY, 'handL'), hp(GUY, 'handR')).multiplyScalar(.5);
      const hs = smooth(clamp((lt - 1.5) / .8)); if (lt < 2.4) { stack.position.copy(dm).add(V3(.15, .35, .25)); stack.position.lerp(gm.clone().add(V3(-.15, .35, .25)), hs); stack.position.y += Math.sin(hs * Math.PI) * .3; } else { stack.position.copy(gm).add(V3(-.1, .38, .25)); }
      stack.rotation.set(0, Math.PI / 2 - .35, 0); stack.scale.setScalar(lt > 2.4 ? .75 : .7);
      if (lt > 2.4) { const b = lt - 2.4; bangs.forEach((s, i) => { s.visible = lt > 3.35 + i * .12; s.position.set(GUY.x + (i - 1) * .5, 3.15 + Math.sin(t * 5 + i) * .07, GUY.z); s.scale.setScalar(.7 * clamp((lt - 3.35 - i * .12) / .2)); }); }
      rig(lt, [[0, [-3, 1.9, OZ + 10.5], [-.5, 1.9, OZ + 9.5], [-4.5, 1.4, OZ], [0, 1.4, OZ], 50, 46], [1.5, [0, 2.4, OZ + 8.5], [.3, 2.3, OZ + 7.5], [0, 1.5, OZ], [0, 1.5, OZ], 46, 42], [3.3, [1.6, 2.2, OZ + 9], [.6, 2.5, OZ + 10.5], [.1, 1.9, OZ], [.1, 1.9, OZ], 48, 50]], t);
      A.follow(0, OZ);
    }
    // ================= store beats
    else {
      A.follow(0, 0);
      const stFace = (nm) => { };
      // shelves state per beat
      if (bi === 1) eShelf = 0; else if (bi === 2) eShelf = smooth(clamp((lt - .5) / 4.6)); else if (bi === 3) eShelf = lerp(.55, .9, clamp(lt / 7)); else eShelf = 1;
      setShelves(eShelf); setCrate(bi === 1 ? 0 : bi === 2 ? smooth(clamp((lt - .3) / 4.2)) : bi === 3 ? .9 : 1);
      // ---------- beat 1 : hand out cash
      if (bi === 1) {
        cart.position.set(0, 0, -2.6); cart.rotation.y = 0;
        place(D, 0, -2.6, 0, 'idle', .68, .6); D.scale = 1.0; D.arms = { lx: -1.2 + Math.sin(lt * 7) * .4, lz: -.3, rx: -1.3 - Math.sin(lt * 7) * .4, rz: .3 }; D.pitch = .05;
        shop.forEach((s, i) => { const o = P[2 + i]; place(o, s.gx, s.gz, Math.PI + (cr(i, 5) - .5) * .3, 'idle', 0, .8); const reach = Math.sin(lt * 4 + i * 1.7) * .12; o.arms = { lx: -1.25 + reach, lz: -.2, rx: -1.25 - reach, rz: .2 }; o.pitch = .05; });
        // bills
        const src = hp(D, 'handR').clone(); for (let j = 0; j < NBILL; j++) { const tau = ((lt * 1.15 + cr(j, 3) * 3.0) % 1); const tgt = shop[(j * 7 + 3) % NP]; const x = lerp(src.x, tgt.gx, tau) + Math.sin(tau * 6 + j) * .15, z = lerp(src.z, tgt.gz, tau), y = lerp(src.y, 1.5 + (j % 3) * .15, tau) + Math.sin(tau * Math.PI) * 1.4; _e.set(tau * 11 + j, j, tau * 8); _m.compose(_p.set(x, y, z), _q.setFromEuler(_e), _s.set(1, 1, 1)); billM.setMatrixAt(j, _m); } billM.instanceMatrix.needsUpdate = true;
        rig(lt, [[0, [-5, 4.4, 13], [-2.5, 4.6, 11.5], [0, 1.2, -1], [0, 1.4, -1.5], 52, 50], [2.2, [3.5, 4.0, 11], [6, 3.4, 8], [0, 1.0, 2], [-1, 1.0, 0], 54, 50], [4.4, [2.0, 3.0, 3.5], [0.8, 2.6, 2.2], [0, 1.3, -2.6], [0, 1.3, -2.6], 46, 40]], t);
      }
      // ---------- beat 2 : stampede
      else if (bi === 2) {
        let lastIdx = 0;
        shop.forEach((s, i) => { const o = P[2 + i]; const tgtS = i % 3; let tx, tz; if (tgtS === 0) { tx = lerp(-15, 15, cr(i, 7)); tz = -13.2; } else if (tgtS === 1) { tx = lerp(-13, 13, cr(i, 8)); tz = -6.7; } else { tx = lerp(-8, -7, cr(i, 9)); tz = 4.7; } const t0 = s.d * .6; const dist = Math.hypot(tx - s.gx, tz - s.gz); const T1 = dist / 7.2; const lu = lt - t0; if (lu < 0) { place(o, s.gx, s.gz, Math.PI, 'idle', 0, .8); o.arms = { lx: -1.25, lz: -.2, rx: -1.25, rz: .2 }; } else if (lu < T1) { const u = lu / T1; place(o, lerp(s.gx, tx, u), lerp(s.gz, tz, u), facing(s.gx, s.gz, tx, tz), 'sprint', 0, 1); } else { const ex = i % 2 ? 16.5 : -16.5, ez = 6.5; const T2d = Math.hypot(ex - tx, ez - tz) / 7.5; const u = (lu - T1 - .35) / T2d; if (u < 0) { place(o, tx, tz, tgtS === 0 ? Math.PI : Math.PI, 'bend', 0, 1.2); } else if (u < 1) place(o, lerp(tx, ex, u), lerp(tz, ez, u), facing(tx, tz, ex, ez), 'sprint', 0, 1); }
          o.cartOn = lu > 0; o.loot = clamp((lu - T1) / 1.2); });
        D.vis = false; faceShock = true;
        rig(lt, [[0, [12, 5.2, 11], [9, 4.4, 8], [-1, 1.4, -2], [-3, 1.4, -5], 56, 52], [2.2, [-13, 2.2, 1.5], [-10, 2.0, -2], [-13, 1.7, -12.5], [-9, 1.7, -12.5], 58, 52], [4.2, [-7.5, 2.1, 7.4], [-7.8, 1.9, 6.4], [-8, 1.1, 3.2], [-8, 1.0, 3.2], 42, 36], [5.6, [-3, 5.0, 12], [2, 4.8, 12], [0, 1.4, -4], [0, 1.4, -4], 60, 58]], t);
      }
      // ---------- beat 3 : buys store
      else if (bi === 3) {
        place(D, -5.5, 5.6, Math.PI + .5, 'idle', 0, .8); D.scale = 1.15; D.arms = { lx: -.2, lz: -.15, rx: -2.4 + Math.sin(lt * 5) * .1, rz: .35 };
        D.vis = lt > 4.5 && lt < 99; // cameo only in the haul shot
        cashiers.forEach((x, i) => { const o = P[102 + i]; place(o, x, 11.1, Math.PI, 'idle', 0, .7); o.arms = { lx: -.6 + Math.sin(lt * 1.5 + i) * .1, lz: -.1, rx: -.5, rz: .1 }; });
        shop.forEach((s, i) => { const o = P[2 + i]; const u0 = cr(i, 12) * .85, v = .08 + cr(i, 13) * .05; const u = u0 + (lt + 1.5) * v; if (u >= 1) return; const sx = lerp(-14, 12, cr(i, 14)), sz = lerp(-4, 8, cr(i, 15)); const x = lerp(sx, DOOR[0], u), z = lerp(sz, DOOR[1], u); place(o, x, z, facing(sx, sz, DOOR[0], DOOR[1]), 'walk', 0, .8); o.arms = { lx: -1.15, lz: -.1, rx: -1.15, rz: .1 }; o.pitch = -.05; o.loot = 1; o.big = 1; });
        const tvu = lt;
        rig(lt, [[0, [-1.5, 3.0, 1.8], [-3.5, 2.7, 3.2], [-8, 2.6, 8.8], [-8, 3.2, 9], 56, 50], [2.5, [5.5, 2.6, 0], [3.5, 3.2, -4], [0, 3.8, -14], [0, 3.9, -14.5], 50, 44], [4.8, [-14, 3.8, 14], [-7, 3.2, 12.5], [8, 1.3, 5], [10, 1.3, 5], 56, 50]], t);
        if (lt > 1.4) { /* keep registers area */ }
        drawTV(lt);
      }
      // ---------- beat 4 : Fed calls, Drake dances
      else if (bi === 4) {
        const ph = lt * 4; place(D, 1.6, -3, .4 + Math.sin(lt * 3) * .5, 'idle', Math.abs(Math.sin(lt * 7.5)) * .12, 1); D.scale = 1.15;
        const sw = Math.sin(lt * 7.5), sw2 = Math.sin(lt * 7.5 + 1.6); D.arms = { lx: -1.6 + sw * 1.0, lz: -.5 - sw2 * .4, rx: -1.6 - sw * 1.0, rz: .5 + sw2 * .4 }; D.pitch = .12 * sw; D.extra = 0;
        phone.position.set(-3.5 + Math.sin(lt * 40) * .015, 1.55 + Math.sin(lt * 33) * .02, -1.2); phone.rotation.set(0, .45, Math.sin(lt * 31) * .05); drawPhone(lt);
        rings.forEach((r, i) => { const f = ((lt * 1.4 + i / 3) % 1); r.position.set(phone.position.x, phone.position.y + .3, phone.position.z + .1); r.rotation.y = .45; r.scale.setScalar(.9 + f * 1.5); r.material.opacity = (1 - f) * .85; });
        owl.position.set(2.2, 2.95, -8.5); owl.rotation.y = Math.sin(lt * 1.2) * .25 + .15; owl.scale.setScalar(.95 + Math.sin(lt * 2) * .01);
        rig(lt, [[0, [-1.0, 2.1, 3.6], [-1.6, 2.0, 2.8], [-3.5, 1.5, -1.2], [-3.5, 1.5, -1.2], 40, 36], [1.5, [5.0, 3.4, 6.6], [3.2, 3.2, 6.6], [0.6, 1.5, -3], [1.4, 1.5, -3], 52, 48], [3.4, [5.6, 2.3, 1.8], [5.0, 2.4, .8], [1.2, 2.5, -6], [1.2, 2.6, -6], 46, 42]], t);
      }
      // ---------- beat 5 : banana mountain
      else {
        const g = smooth(clamp(lt / 1.6)); setMountain(g); const peakY = MH * clamp(g * 1.2) - .35; place(D, 0, -2, .25 + Math.sin(lt * 4) * .2, 'idle', peakY, 1); D.scale = 1.15; D.vis = true;
        const e = smooth((lt - 1.8) / .35); const cheer = Math.sin(lt * 9) * .18; D.arms = { lx: lerp(-.2, -2.6, e) + cheer * e, lz: lerp(-.15, -.7, e), rx: lerp(-.2, -2.6, e) - cheer * e, rz: lerp(.15, .7, e) }; D.pitch = -.12 * e;
        for (let i = 0; i < NC; i++) { const u = (lt - 1.6 - cr(i, 1) * .6) ; if (u < 0) { conf.setMatrixAt(i, hideM); continue; } const fall = ((u * (1.3 + cr(i, 2) * .8)) % 1); const y = 11 - fall * 11.5; _e.set(u * 6 + i, u * 4, u * 5); _m.compose(_p.set(Math.sin(u * 2 + i) * .8 + (cr(i, 3) - .5) * 14, y, -2 + (cr(i, 4) - .5) * 10), _q.setFromEuler(_e), _s.set(1, 1, 1)); conf.setMatrixAt(i, _m); } conf.instanceMatrix.needsUpdate = true;
        rig(lt, [[0, [-9, 4.4, 12], [-6.5, 4.8, 11], [0, 2.8, -2], [0, 3.4, -2], 56, 52], [1.6, [-4, 2.4, 14.2], [-4.8, 2.3, 13.2], [-5.5, 2.9, 6], [-5.5, 2.9, 6], 68, 64], [3.1, [2.5, 2.8, 5.0], [1.5, 3.2, 4.5], [0, 5.4, -2], [0, 5.8, -2], 44, 40]], t);
      }
    }
    // faces + crowd
    crowd.setFace(faceShock ? 'shock' : 'calm');
    if (bi !== 0) { crowd.update(t); look.update(); look.setVisible(D.vis); }
    // attach carts / loot
    if (bi === 2 || bi === 3) { for (let i = 0; i < NP; i++) { const o = P[2 + i]; const on = o.vis; if (bi === 2) { if (on && o.cartOn) { putOn(cartI, i, o, [0, -.62, .95], [.75, .5, .9]); const l = o.loot; putOn(lootI, i * 2, o, [-.12, -.28 + 0, .95], [.6 * l, .3 * l, .5 * l]); putOn(lootI, i * 2 + 1, o, [.14, -.2, 1.05], [.4 * l, .4 * l, .4 * l]); } else { cartI.setMatrixAt(i, hideM); lootI.setMatrixAt(i * 2, hideM); lootI.setMatrixAt(i * 2 + 1, hideM); } } else { cartI.setMatrixAt(i, hideM); if (on) { putOn(lootI, i * 2, o, [0, .05, .62], [.95, .8, .55]); putOn(lootI, i * 2 + 1, o, [.05, .72, .62], [.7, .55, .45]); } else { lootI.setMatrixAt(i * 2, hideM); lootI.setMatrixAt(i * 2 + 1, hideM); } } } cartI.instanceMatrix.needsUpdate = true; lootI.instanceMatrix.needsUpdate = true; }
    // stack follow needs crowd.update first for beat 0 (done above)
    A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    const fmt = (n) => Math.round(n).toLocaleString('en-US');
    const LAB = ['GIVEN AWAY', 'PEOPLE PAID', 'SHELVES LEFT', 'PRICE OF EVERYTHING', 'MISSED FED CALLS', 'DRAKE NET WORTH'][bi];
    let VAL = '', hot = bi >= 2;
    if (bi === 0) VAL = '$' + fmt(lt > 1.8 ? 1000000 : lerp(0, 1000000, smooth(clamp(lt / 1.8)))); else if (bi === 1) VAL = fmt(lerp(1, 100, smooth(clamp((lt - .3) / 3.5)))) + ' PEOPLE'; else if (bi === 2) VAL = Math.round(100 * (1 - eShelf)) + '%'; else if (bi === 3) VAL = '$0.00'; else if (bi === 4) VAL = String(Math.min(9, 1 + Math.floor(lt * 2.0))); else VAL = fmt(lerp(1e6, 1e9, smooth(clamp(lt / 3.6)))) + ' 🍌'.replace(' 🍌', '');
    hud.counter(LAB, VAL, bi === 5 ? 'BANANAS' : '', 'PARODY', hot);
    { const tg = document.getElementById('tag'); tg.style.display = 'block'; tg.style.top = '246px'; }
    hud.tm(''); hud.pop('', 0);
  } };
}
