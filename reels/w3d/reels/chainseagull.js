// 685 invention chain: a seagull keeps stealing your fries -> towel (waiter) -> car (already inside) -> driver's seat with your keys -> drives the speed limit -> parks at the fry stand, you pay.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, clamp, smooth, lerp, attach, beach } = lib;
  const A = makeStage({ fog: 0xc3e2f4, fogNear: 60, fogFar: 260, clouds: true, skyTop: 0x3f86d8, skyMid: 0x9cc8f0, skyBot: 0xe9f2fa, shadowExtent: 11, shadowRes: 2048, hemi: 1.5, sunI: 2.1, sunDir: [-.4, .9, -.35], exposure: 1.08 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const ez = (u) => 1 - (1 - clamp(u)) * (1 - clamp(u)), ei = (u) => clamp(u) * clamp(u);
  const bx = (par, w, h, d, x, y, z, m, o = {}) => { const a = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); a.position.set(x, y, z); if (o.rx) a.rotation.x = o.rx; if (o.ry) a.rotation.y = o.ry; if (o.rz) a.rotation.z = o.rz; a.castShadow = o.cast !== false; a.receiveShadow = true; par.add(a); return a; };
  const sp = (par, r, sx, sy, sz, m, x, y, z, o = {}) => { const a = new THREE.Mesh(new THREE.SphereGeometry(r, o.sg || 18, o.sh || 12), m); a.scale.set(sx, sy, sz); a.position.set(x, y, z); a.castShadow = o.cast !== false; par.add(a); return a; };
  const cy = (par, r1, r2, h, m, x, y, z, o = {}) => { const a = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, o.s || 14), m); a.position.set(x, y, z); if (o.rx) a.rotation.x = o.rx; if (o.rz) a.rotation.z = o.rz; a.castShadow = o.cast !== false; par.add(a); return a; };

  // ------------------------------------------------------------------ world: beach, highway, lot
  const SHORE = 44;
  const bch = beach(S, { shoreZ: SHORE, gulls: 0, boats: 2, dress: 0, seed: 7 });
  const asphalt = (w, d, rx, rz, lines) => { const t = cvs(256, 128, (g, W, H) => { g.fillStyle = '#41444c'; g.fillRect(0, 0, W, H); for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(255,255,255,${.03 + cr(i, 1) * .05})`; g.fillRect(cr(i, 2) * W, cr(i, 3) * H, 2, 2); } if (lines) { g.fillStyle = '#f2cf4a'; for (let k = 0; k < 2; k++) g.fillRect(k * 128 + 8, 62, 96, 5); g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(0, 5, W, 4); g.fillRect(0, H - 9, W, 4); } }); t.t.wrapS = t.t.wrapT = THREE.RepeatWrapping; t.t.repeat.set(rx, rz);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: t.t, roughness: .92 })); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; S.add(m); return m; };
  const RZ = 10; // highway centre line z
  { const r = asphalt(400, 12, 400 / 8, 1, true); r.position.set(250, .03, RZ); const lot = asphalt(60, 18, 6, 2, false); lot.position.set(150, .035, 19); const lot2 = asphalt(50, 18, 5, 2, false); lot2.position.set(300, .035, 14); }
  // curb + guard posts, sparse dune bushes along the shoulder
  for (let i = 0; i < 70; i++) { const x = 60 + i * 4.6; if (x > 110 && x < 190) continue; const b = new THREE.Mesh(new THREE.IcosahedronGeometry(.5 + cr(i, 4) * .35, 1), mat(0x6f9a4a, { flatShading: true })); b.position.set(x, .3, RZ - 8.5 - cr(i, 5) * 4); b.castShadow = true; S.add(b); }
  const palm = (x, z, s = 1) => { const g = new THREE.Group(); for (let k = 0; k < 6; k++) cy(g, .13 * s, .17 * s, 1.2 * s, mat(0x8a6a44), Math.sin(k * .35) * .12 * s, (.6 + k * 1.15) * s, 0, { rz: .05 }); for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28; const l = bx(g, .22 * s, .05 * s, 2.0 * s, Math.sin(a) * .9 * s, 7.2 * s, Math.cos(a) * .9 * s, mat(0x3f9a43), { ry: a, rx: .45 }); } g.position.set(x, 0, z); S.add(g); };
  for (let i = 0; i < 14; i++) palm(60 + i * 17 + cr(i, 6) * 6, RZ - 12 - cr(i, 7) * 4, .8 + cr(i, 8) * .3);
  palm(150, 40, .9);

  // ------------------------------------------------------------------ the seagull
  function makeGull() {
    const g = new THREE.Group(); const white = mat(0xffffff, { roughness: .72 }), grey = mat(0x949eaa, { roughness: .8 }), dark = mat(0x1d2025, { roughness: .6 }), beakM = mat(0xffc21a, { roughness: .45 }), orange = mat(0xff8a1f, { roughness: .6 }), red = mat(0xe5301f, { roughness: .5 });
    sp(g, 1, .37, .34, .6, white, 0, .6, 0); sp(g, 1, .31, .31, .32, white, 0, .64, .34); sp(g, 1, .26, .14, .4, grey, 0, .86, -.1);
    bx(g, .22, .04, .34, 0, .66, -.58, white, { rx: .22 }); bx(g, .22, .045, .1, 0, .665, -.72, dark, { rx: .22 });
    const wings = []; for (const sd of [-1, 1]) { const piv = new THREE.Group(); piv.position.set(sd * .33, .72, .08); const spr = new THREE.Group(); const mesh = new THREE.Group(); const w1 = sp(mesh, 1, .05, .17, .55, grey, 0, 0, -.5); const w2 = sp(mesh, 1, .052, .1, .22, dark, 0, -.01, -.95); const w3 = sp(mesh, 1, .045, .13, .3, white, sd * -.02, -.02, -.25); spr.add(mesh); piv.add(spr); g.add(piv); wings.push({ piv, spr, mesh, sd }); }
    const legs = []; for (const sd of [-1, 1]) { const lg = new THREE.Group(); lg.position.set(sd * .14, .42, .02); cy(lg, .028, .022, .42, orange, 0, -.21, 0, { s: 8 }); const ft = bx(lg, .15, .02, .17, 0, -.41, .06, orange); bx(lg, .03, .02, .1, sd * .05, -.41, .13, orange, { ry: sd * .3 }); g.add(lg); legs.push(lg); }
    const neck = new THREE.Group(); neck.position.set(0, .76, .38); g.add(neck); cy(neck, .1, .13, .36, white, 0, .17, 0, { s: 12 });
    const head = new THREE.Group(); head.position.set(0, .4, .02); neck.add(head); sp(head, 1, .21, .2, .22, white, 0, 0, 0);
    const upper = new THREE.Mesh(new THREE.ConeGeometry(.068, .36, 14), beakM); upper.rotation.x = Math.PI / 2; upper.position.set(0, -.01, .33); upper.castShadow = true; head.add(upper);
    const jaw = new THREE.Group(); jaw.position.set(0, -.045, .14); head.add(jaw); const lower = new THREE.Mesh(new THREE.ConeGeometry(.05, .28, 12), beakM); lower.rotation.x = Math.PI / 2; lower.position.set(0, 0, .15); jaw.add(lower); sp(jaw, 1, .03, .03, .03, red, 0, -.012, .26);
    const eyes = []; for (const sd of [-1, 1]) { const e = new THREE.Group(); e.position.set(sd * .118, .055, .15); head.add(e); sp(e, 1, .062, .062, .062, mat(0xffffff, { roughness: .3 }), 0, 0, 0, { cast: false }); sp(e, 1, .034, .034, .034, dark, 0, 0, .042, { cast: false, sg: 10, sh: 8 }); const brow = bx(head, .15, .032, .04, sd * .118, .15, .165, mat(0x4b4f57), { cast: false }); eyes.push({ e, brow, sd }); }
    const bow = new THREE.Group(); bow.position.set(0, .56, .64); g.add(bow); for (const sd of [-1, 1]) { const c = new THREE.Mesh(new THREE.ConeGeometry(.11, .2, 12), mat(0xd22a2a, { roughness: .5 })); c.rotation.z = -sd * Math.PI / 2; c.position.x = sd * .1; c.castShadow = true; bow.add(c); } sp(bow, 1, .045, .045, .045, mat(0x8f1414), 0, 0, 0); bow.visible = false;
    const shades = new THREE.Group(); head.add(shades); { const lm = new THREE.MeshStandardMaterial({ color: 0x0b0c10, roughness: .15, metalness: .5 }); for (const sd of [-1, 1]) { bx(shades, .15, .095, .03, sd * .118, .052, .212, lm, { cast: false }); bx(shades, .02, .02, .34, sd * .2, .06, .05, lm, { cast: false }); } bx(shades, .1, .02, .03, 0, .075, .214, lm, { cast: false }); } shades.visible = false;
    const tip = new THREE.Group(); tip.position.set(0, -.03, .5); head.add(tip);
    const keys = new THREE.Group(); keys.position.set(0, -.045, .43); head.add(keys); { const gold = mat(0xe8c24a, { roughness: .3 }); const ring = new THREE.Mesh(new THREE.TorusGeometry(.07, .014, 8, 18), mat(0xc9ced4, { roughness: .3, metalness: .8 })); ring.position.y = -.1; ring.rotation.y = 1.2; keys.add(ring); for (let k = 0; k < 3; k++) { const kg = new THREE.Group(); kg.position.set(0, -.16, 0); kg.rotation.z = (k - 1) * .5; kg.rotation.y = 1.2; bx(kg, .026, .17, .012, 0, -.08, 0, gold); bx(kg, .07, .03, .012, .025, -.15, 0, gold); sp(kg, 1, .04, .04, .012, gold, 0, 0, 0, { cast: false }); keys.add(kg); }
      const tag = cvs(128, 192, (c, w, h) => { c.fillStyle = '#d22a2a'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.fillRect(6, 6, w - 12, h - 12); c.fillStyle = '#d22a2a'; c.fillRect(10, 10, w - 20, h - 20); txt(c, 'MY', w / 2, 58, 44, '#fff'); txt(c, 'KEYS', w / 2, 112, 36, '#fff'); c.fillStyle = '#fff'; c.beginPath(); c.arc(w / 2, 24, 7, 0, 7); c.fill(); }); const tg = new THREE.Mesh(new THREE.BoxGeometry(.17, .26, .02), new THREE.MeshStandardMaterial({ map: tag.t, roughness: .5 })); tg.position.set(0, -.3, 0); tg.rotation.y = 1.2; keys.add(tg); } keys.visible = false;
    const fry = bx(head, .045, .045, .26, 0, -.035, .46, mat(0xf2c230, { roughness: .6 }), { rx: .1 }); fry.visible = false;
    const gl = { g, wings, legs, neck, head, jaw, eyes, bow, shades, keys, fry, tip, P: null };
    gl.reset = () => { gl.P = { wl: 0, wr: 0, fl: 0, fr: 0, tl: 0, tr: 0, walk: 0, stride: 0, tuck: 0, sit: 0, hp: 0, hy: 0, beak: 0, brow: .15, keys: 0, bow: false, shades: false, keysOn: false, fry: false }; };
    gl.apply = () => { const P = gl.P; const [wL, wR] = wings;
      wL.piv.rotation.set(P.tl, 0, -P.fl); wL.spr.rotation.y = P.wl; wL.mesh.rotation.z = Math.min(1, P.wl / 1.0) * Math.PI / 2; wR.piv.rotation.set(P.tr, 0, P.fr); wR.spr.rotation.y = -P.wr; wR.mesh.rotation.z = Math.min(1, P.wr / 1.0) * Math.PI / 2;
      const lf = lerp(0, -1.45, P.sit) + P.tuck * 1.1; legs[0].rotation.x = Math.sin(P.walk) * P.stride + lf; legs[1].rotation.x = -Math.sin(P.walk) * P.stride + lf;
      neck.rotation.set(P.hp, P.hy, 0); jaw.rotation.x = P.beak * .55; eyes.forEach(({ brow, sd }) => { brow.rotation.z = -sd * P.brow * 1.6 * -1; brow.position.y = .15 - Math.abs(P.brow) * .02; });
      gl.bow.visible = P.bow; gl.shades.visible = P.shades; gl.keys.visible = P.keysOn; gl.keys.rotation.z = Math.sin(P.keys) * .35; gl.keys.rotation.x = Math.cos(P.keys * .8) * .12; gl.fry.visible = P.fry; };
    gl.reset(); S.add(g); return gl;
  }
  const gull = makeGull();
  const gullFly = (P, t, k = 1) => { const f = Math.sin(t * 15) * .75 * k; P.wl = P.wr = 1.45; P.fl = P.fr = f; P.tuck = 1; P.stride = 0; };

  // ------------------------------------------------------------------ props: blanket set (origin)
  const BX = -.75, BZ = .55, CY = .44; // cooler / fry boat position
  const blanket = new THREE.Mesh(new THREE.BoxGeometry(3.4, .03, 2.6), new THREE.MeshStandardMaterial({ map: cvs(256, 128, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#f4efe4' : '#e0584a'; g.fillRect(i * 32, 0, 32, h); } }).t, roughness: .95 })); blanket.position.set(.1, .015, .6); blanket.receiveShadow = true; S.add(blanket);
  const cooler = new THREE.Group(); { bx(cooler, .95, .42, .62, 0, .21, 0, mat(0x2f78c8, { roughness: .5 })); bx(cooler, .99, .06, .66, 0, .45, 0, mat(0xf4f6f8, { roughness: .4 })); bx(cooler, .3, .05, .06, 0, .52, .0, mat(0x1d4f8a)); cooler.position.set(BX, 0, BZ); S.add(cooler); }
  const TOP = .48; // top surface of cooler
  const boat = new THREE.Group(); boat.position.set(BX, TOP, BZ); S.add(boat);
  { const chk = cvs(128, 64, (g, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) { g.fillStyle = (i + j) % 2 ? '#fff' : '#e03a30'; g.fillRect(i * 16, j * 16, 16, 16); } }); const bm = new THREE.MeshStandardMaterial({ map: chk.t, roughness: .8, side: THREE.DoubleSide });
    bx(boat, .56, .02, .32, 0, .01, 0, bm); bx(boat, .56, .2, .02, 0, .1, .17, bm, { rx: -.35 }); bx(boat, .56, .2, .02, 0, .1, -.17, bm, { rx: .35 }); bx(boat, .02, .18, .34, .29, .09, 0, bm, { rz: .3 }); bx(boat, .02, .18, .34, -.29, .09, 0, bm, { rz: -.3 }); }
  const NF = 26; const fryM = mat(0xf2c230, { roughness: .6 }); const fries = []; for (let i = 0; i < NF; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.045, .045, .3), fryM); m.position.set((cr(i, 1) - .5) * .42, .15 + cr(i, 2) * .08, (cr(i, 3) - .5) * .2); m.rotation.set(-1.0 + cr(i, 4) * .5 + (cr(i, 5) - .5) * .8, (cr(i, 6) - .5) * 1.4, (cr(i, 7) - .5) * 1.2); m.castShadow = true; boat.add(m); fries.push(m); }
  const towelTex = cvs(256, 128, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#fff' : '#27a8b8'; g.fillRect(0, i * 16, w, 16); } });
  const towelMat = new THREE.MeshStandardMaterial({ map: towelTex.t, roughness: .98, side: THREE.DoubleSide });
  const TW = .98, TD = .78; // towel length (hinge -> free edge) x depth
  const towel = new THREE.Group(); S.add(towel); const slab = new THREE.Mesh(new THREE.BoxGeometry(1, .035, TD), towelMat); slab.position.x = -.5; slab.castShadow = true; slab.receiveShadow = true; towel.add(slab);
  const skirts = new THREE.Group(); towel.add(skirts); const sk = []; for (const [x, z, w, d] of [[-.5, TD / 2, 1, .02], [-.5, -TD / 2, 1, .02], [0, 0, .02, TD], [-1, 0, .02, TD]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, .24, d), towelMat); m.position.set(x, -.12, z); m.castShadow = true; skirts.add(m); sk.push(m); }
  const umb = new THREE.Group(); { cy(umb, .035, .035, 2.6, mat(0xeeeeee), 0, 1.3, 0, { s: 6 }); const top = new THREE.Mesh(new THREE.ConeGeometry(1.7, .75, 10), new THREE.MeshStandardMaterial({ color: 0xf2c84b, roughness: .8 })); top.position.y = 2.7; top.castShadow = true; umb.add(top); umb.position.set(2.2, 0, 2.0); umb.rotation.z = .12; S.add(umb); }
  { const pail = cy(S, .2, .16, .3, mat(0xe85a8a), 1.5, .16, -.1); const sh = cy(S, .02, .02, .5, mat(0xf2c84b), 1.5, .22, -.1); sh.rotation.z = .4; }
  const sandals = (x, z, c) => { bx(S, .12, .03, .3, x, .04, z, mat(c), { ry: .3 }); bx(S, .12, .03, .3, x + .2, .04, z + .05, mat(c), { ry: .1 }); }; sandals(-.45, 1.9, 0x3a78d8);
  const myFry = new THREE.Mesh(new THREE.BoxGeometry(.045, .045, .3), fryM); myFry.castShadow = true; myFry.visible = false; S.add(myFry);

  // ------------------------------------------------------------------ the car (local: +z forward, +x driver side, origin on the ground)
  const SEAT = .85;
  function makeCar() {
    const c = new THREE.Group(); const paint = mat(0xe04a3c, { roughness: .35, metalness: .25 }), paintD = mat(0xb23428, { roughness: .4, metalness: .2 }), seatM = mat(0xd9b27c, { roughness: .8 }), blk = mat(0x1e2024, { roughness: .6 }), chrome = mat(0xc9ced4, { roughness: .25, metalness: .8 });
    bx(c, 2.1, .5, 5.4, 0, .4, 0, paintD); bx(c, 1.9, .06, 5.0, 0, .66, 0, mat(0x6b5a46, { roughness: 1 }));
    for (const sd of [-1, 1]) { bx(c, .14, .55, 5.4, sd * .98, .93, 0, paint); bx(c, .1, .05, 2.2, sd * .98, 1.22, -.2, chrome); }
    bx(c, 2.1, .52, 1.6, 0, .91, 1.9, paint); bx(c, 1.2, .06, .5, 0, 1.2, 2.2, paintD); bx(c, 2.1, .52, 1.3, 0, .91, -2.05, paint); bx(c, 2.1, .4, .12, 0, .5, 2.72, chrome); bx(c, 2.1, .4, .12, 0, .5, -2.72, chrome);
    bx(c, 2.0, .5, .5, 0, .93, 1.18, mat(0x2d3036, { roughness: .6 }));
    const wsM = new THREE.MeshStandardMaterial({ color: 0xcfeaff, transparent: true, opacity: .18, roughness: .05, metalness: .2, side: THREE.DoubleSide }); const ws = new THREE.Mesh(new THREE.PlaneGeometry(1.9, .9), wsM); ws.position.set(0, 1.58, 1.0); ws.rotation.x = -.38; c.add(ws);
    for (const sd of [-1, 1]) bx(c, .06, 1.0, .06, sd * .98, 1.55, 1.0, chrome, { rx: -.38 }); bx(c, 2.0, .06, .06, 0, 2.0, .82, chrome, { rx: -.38 });
    const seat = (x, z, back) => { bx(c, .8, .25, .75, x, SEAT - .14, z, seatM); if (back) { bx(c, .8, .8, .14, x, SEAT + .4, z - .36, seatM, { rx: -.12 }); bx(c, .3, .18, .1, x, SEAT + .86, z - .4, seatM, { rx: -.12 }); } };
    seat(-.5, -.2, true); seat(.5, -.2, true); for (const x of [-.5, .5]) { bx(c, .8, .25, .6, x, SEAT - .14, -1.35, seatM); } bx(c, 1.85, .8, .14, 0, SEAT + .4, -1.78, seatM, { rx: -.1 });
    const wheel = new THREE.Group(); wheel.position.set(.5, 1.42, .66); wheel.rotation.x = -.95; c.add(wheel); const rim = new THREE.Mesh(new THREE.TorusGeometry(.27, .035, 10, 26), blk); wheel.add(rim); for (let k = 0; k < 3; k++) { const s = bx(wheel, .5, .035, .03, 0, 0, 0, blk, { rz: k * Math.PI / 3 }); } cy(wheel, .06, .06, .06, chrome, 0, 0, 0, { rx: Math.PI / 2 }); cy(c, .03, .03, .5, blk, .5, 1.2, .8, { rx: -.95 });
    const wheels = []; for (const sx of [-1, 1]) for (const z of [-1.7, 1.7]) { const w = new THREE.Group(); w.position.set(sx * 1.0, .45, z); const t = new THREE.Mesh(new THREE.CylinderGeometry(.46, .46, .32, 22), blk); t.rotation.z = Math.PI / 2; t.castShadow = true; w.add(t); const hub = new THREE.Mesh(new THREE.CylinderGeometry(.26, .26, .34, 12), chrome); hub.rotation.z = Math.PI / 2; w.add(hub); for (let k = 0; k < 5; k++) bx(w, .36, .05, .06, sx * .01, 0, 0, blk, { rx: k * 1.2566 }); c.add(w); wheels.push(w); }
    const lt = new THREE.MeshStandardMaterial({ color: 0xfff1b8, emissive: 0xfff1b8, emissiveIntensity: .8 }); for (const sx of [-.7, .7]) { sp(c, 1, .16, .16, .1, lt, sx, .98, 2.72, { cast: false }); }
    const tailM = new THREE.MeshStandardMaterial({ color: 0x8a0e0e, emissive: 0xff1a1a, emissiveIntensity: 0 }); for (const sx of [-.8, .8]) bx(c, .3, .16, .06, sx, .95, -2.74, tailM, { cast: false });
    const plate = (z, ry) => { const p = cvs(256, 128, (g, w, h) => { g.fillStyle = '#f6f2e0'; g.fillRect(0, 0, w, h); g.strokeStyle = '#223'; g.lineWidth = 6; g.strokeRect(4, 4, w - 8, h - 8); txt(g, 'SQUAWK1', w / 2, 70, 58, '#1b3a8a'); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(.5, .25), new THREE.MeshStandardMaterial({ map: p.t, roughness: .5 })); m.position.set(0, .5, z); m.rotation.y = ry; c.add(m); }; plate(2.79, 0); plate(-2.79, Math.PI);
    S.add(c); return { g: c, wheels, wheel, tailM };
  }
  const CAR = makeCar();
  const SEATY = SEAT - .05; // you: hip height reference

  // ------------------------------------------------------------------ fry stand (counter faces -z, cashier camera sits inside)
  const SX = 150, SZ = 20.5;
  const STAND = new THREE.Group(); STAND.position.set(SX, 0, SZ); S.add(STAND);
  const registerG = new THREE.Group();
  { const wallM = mat(0xf3ead2, { roughness: .85 }), woodM = mat(0x9a6a3c, { roughness: .8 }); const FZ = -1.2; // front wall plane
    bx(STAND, 4.6, 1.15, .2, 0, .575, FZ, wallM); bx(STAND, 4.6, .8, .2, 0, 2.5, FZ, wallM); bx(STAND, 1.0, 1.0, .2, -1.8, 1.65, FZ, wallM); bx(STAND, 1.0, 1.0, .2, 1.8, 1.65, FZ, wallM);
    bx(STAND, 4.6, 2.9, .2, 0, 1.45, 1.6, wallM); bx(STAND, .2, 2.9, 2.8, -2.3, 1.45, .2, wallM); bx(STAND, .2, 2.9, 2.8, 2.3, 1.45, .2, wallM); bx(STAND, 4.8, .12, 3.0, 0, 2.95, .2, mat(0xe8e0c8));
    bx(STAND, 2.5, .09, .6, 0, 1.17, FZ - .35, woodM); bx(STAND, 2.5, .1, .1, 0, 2.12, FZ - .02, woodM);
    // striped awning
    const aw = cvs(256, 64, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#fff' : '#e0453a'; g.fillRect(i * 32, 0, 32, h); } }); const awM = new THREE.MeshStandardMaterial({ map: aw.t, roughness: .9, side: THREE.DoubleSide }); const awn = new THREE.Mesh(new THREE.BoxGeometry(4.9, .06, 1.7), awM); awn.position.set(0, 2.35, FZ - .75); awn.rotation.x = .22; awn.castShadow = true; STAND.add(awn);
    bx(STAND, 4.9, .3, .06, 0, 2.05 - .08, FZ - 1.55, awM, { rx: 0 });
    const sg = cvs(512, 160, (g, w, h) => { g.fillStyle = '#ffd92a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c62b20'; g.lineWidth = 12; g.strokeRect(8, 8, w - 16, h - 16); txt(g, 'FRIES', w / 2, 84, 124, '#c62b20'); }); const sgn = new THREE.Mesh(new THREE.BoxGeometry(2.4, .75, .1), new THREE.MeshStandardMaterial({ map: sg.t, roughness: .6 })); sgn.position.set(0, 3.45, FZ - .02); STAND.add(sgn); bx(STAND, .1, .6, .1, -.9, 3.0, FZ, woodM); bx(STAND, .1, .6, .1, .9, 3.0, FZ, woodM);
    const mn = cvs(256, 256, (g, w, h) => { g.fillStyle = '#23402f'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d9c9a0'; g.lineWidth = 8; g.strokeRect(6, 6, w - 12, h - 12); txt(g, 'MENU', w / 2, 44, 44, '#ffd92a'); txt(g, 'FRIES  $7.50', w / 2, 112, 34, '#fff'); txt(g, 'BIG FRIES  $9', w / 2, 160, 34, '#fff'); txt(g, 'SALT  FREE', w / 2, 208, 30, '#9fe8b0'); }); const mp = new THREE.Mesh(new THREE.PlaneGeometry(.85, .85), new THREE.MeshStandardMaterial({ map: mn.t, roughness: .7 })); mp.position.set(-1.8, 1.65, FZ - .11); mp.rotation.y = Math.PI; STAND.add(mp);
    // register inside, on the counter
    registerG.position.set(.55, 1.215, FZ - .35); registerG.scale.setScalar(.55); STAND.add(registerG); bx(registerG, .5, .22, .42, 0, .11, 0, mat(0x32363c, { roughness: .5 })); const scr = bx(registerG, .3, .2, .04, 0, .36, .12, mat(0x1a1d22), { rx: -.35 }); const scrT = cvs(128, 96, (g, w, h) => { g.fillStyle = '#1a3a22'; g.fillRect(0, 0, w, h); txt(g, '$7.50', w / 2, 48, 44, '#7dff8a'); }); const sc2 = new THREE.Mesh(new THREE.PlaneGeometry(.26, .16), new THREE.MeshBasicMaterial({ map: scrT.t })); sc2.position.set(0, .365, .145); sc2.rotation.x = -.35; registerG.add(sc2); bx(registerG, .36, .05, .04, 0, .24, -.12, mat(0x16181c));
    // fryer
    bx(STAND, .9, .9, .7, -1.4, .45, .6, mat(0xb9c0c8, { roughness: .3, metalness: .7 })); const lt = new THREE.PointLight(0xffe2a0, 1.1, 4); lt.position.set(0, 2.5, .3); STAND.add(lt); }
  // receipt (grows out of the register)
  const rcT = cvs(384, 640, (g, w, h) => { g.fillStyle = '#fbfaf3'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < 40; i++) { g.beginPath(); g.moveTo(0, i * 16 + 8); g.lineTo(w, i * 16 + 8); g.stroke(); }
    txt(g, 'FRY STAND', w / 2, 52, 52, '#222'); txt(g, '- - - - - - - - - -', w / 2, 96, 34, '#444', { w: 500 });
    txt(g, '1 LARGE FRIES', 28, 160, 30, '#222', { al: 'left', w: 700 }); txt(g, '$7.50', w - 28, 160, 30, '#222', { al: 'right', w: 700 });
    txt(g, 'TIP: SEAGULL', 28, 226, 30, '#222', { al: 'left', w: 700 }); txt(g, '$0.00', w - 28, 226, 30, '#222', { al: 'right', w: 700 });
    txt(g, '- - - - - - - - - -', w / 2, 284, 34, '#444', { w: 500 }); txt(g, 'TOTAL', 28, 340, 46, '#222', { al: 'left' }); txt(g, '$7.50', w - 28, 340, 46, '#222', { al: 'right' });
    txt(g, 'CUSTOMER: SEAGULL', 28, 430, 28, '#444', { al: 'left', w: 700 });
    g.save(); g.translate(w / 2, 540); g.rotate(-.06); g.fillStyle = '#d4221a'; g.fillRect(-176, -48, 352, 96); g.fillStyle = '#fbfaf3'; g.fillRect(-166, -38, 332, 76); txt(g, 'PAID BY: YOU', 0, 4, 52, '#d4221a'); g.restore(); });
  const rcGeo = new THREE.PlaneGeometry(.48, .8); rcGeo.translate(0, .4, 0); const receipt = new THREE.Mesh(rcGeo, new THREE.MeshStandardMaterial({ map: rcT.t, roughness: .9, side: THREE.DoubleSide })); receipt.castShadow = true; receipt.visible = false; S.add(receipt);
  const bill = new THREE.Group(); { const bt = cvs(128, 64, (g, w, h) => { g.fillStyle = '#6fb87a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2f6a3c'; g.lineWidth = 5; g.strokeRect(6, 6, w - 12, h - 12); txt(g, '$', w / 2, 34, 40, '#2f6a3c'); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(.3, .15), new THREE.MeshStandardMaterial({ map: bt.t, side: THREE.DoubleSide, roughness: .8 })); m.rotation.x = -Math.PI / 2; bill.add(m); bill.visible = false; S.add(bill); }
  const cartonG = new THREE.Group(); // fry carton the gull gets handed
  { const cm = mat(0xd22a2a, { roughness: .6 }); bx(cartonG, .26, .3, .1, 0, .15, 0, cm, { rz: 0 }); for (let i = 0; i < 9; i++) bx(cartonG, .035, .22, .035, (i - 4) * .026, .38 + cr(i, 3) * .08, (cr(i, 4) - .5) * .04, fryM, { rz: (cr(i, 5) - .5) * .5 }); cartonG.visible = false; S.add(cartonG); }

  // ------------------------------------------------------------------ people
  const crowd = new Crowd(S, 1, 91); const YOU = crowd.p[0]; YOU.h = 1;
  ['torso', 'armL', 'armR'].forEach((k) => crowd.parts[k].setColorAt(0, new THREE.Color(0x2f86d8))); ['legL', 'legR'].forEach((k) => crowd.parts[k].setColorAt(0, new THREE.Color(0xf0ede4))); crowd.parts.hair.setColorAt(0, new THREE.Color(0x3a2515)); for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const place = (o, x, y, z, yaw, anim, spd = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = spd; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; };
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);

  // floating labels
  const mkLabel = (text, c1, c2, o = {}) => { const w = o.w || 640, h = 170; const l = cvs(w, h, (g) => { if (o.bubble) { g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 10; g.beginPath(); g.roundRect(14, 10, w - 28, h - 56, 34); g.fill(); g.stroke(); g.beginPath(); g.moveTo(w * .42, h - 48); g.lineTo(w * .5, h - 8); g.lineTo(w * .56, h - 50); g.closePath(); g.fillStyle = '#fff'; g.fill(); txt(g, text, w / 2, (h - 56) / 2 + 10, o.size || 88, '#111'); } else txt(g, text, w / 2, h / 2, o.size || 108, c1, { stroke: c2, sw: 20 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const lbClever = mkLabel('CLEVER!', '#ffe23a', '#111', { w: 520 }), lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111', { size: 76 }), lbOrder = mkLabel('FRIES, PLEASE.', '', '', { bubble: true, w: 700, size: 80 }), lbMine = mkLabel('MINE.', '#fff', '#111', { w: 420 });
  const showLb = (s, on, pos, k = 1, w = 1.4) => { s.visible = on; if (on) { s.position.copy(pos); const a = clamp(k); s.scale.set(w * a, w * a * (170 / s.material.map.image.width), 1); } };

  // ------------------------------------------------------------------ camera
  const CC = { E: V(), T: V() };
  const shot = (lt, ks, t, sh = 0) => { let i = 0; while (i < ks.length - 1 && lt >= ks[i + 1][0]) i++; const a = ks[i], b = ks[Math.min(i + 1, ks.length - 1)]; let u = a === b ? 0 : clamp((lt - a[0]) / (b[0] - a[0])); u = lerp(u, smooth(u), .6); const L = (p, q, k) => lerp(p['xyz'[k]], q['xyz'[k]], u);
    A.cam(L(a[1], b[1], 0) + Math.sin(t * .9) * .025 + Math.sin(t * 57) * sh, L(a[1], b[1], 1) + Math.sin(t * 1.2 + 1) * .02 + Math.cos(t * 49) * sh, L(a[1], b[1], 2) + Math.cos(t * .8) * .025, L(a[2], b[2], 0), L(a[2], b[2], 1), L(a[2], b[2], 2), lerp(a[3], b[3], u), Math.sin(t * .7) * .006); };

  // car pose helpers
  const cw = new THREE.Matrix4(); const toW = (x, y, z) => V(x, y, z).applyMatrix4(CAR.g.matrixWorld);
  const setCar = (x, y, z, ry, roll = 0, pitch = 0) => { CAR.g.position.set(x, y, z); CAR.g.rotation.set(pitch, ry, roll, 'YXZ'); CAR.g.updateMatrixWorld(true); };
  const gullToCar = (on) => { if (on && gull.g.parent !== CAR.g) CAR.g.add(gull.g); if (!on && gull.g.parent !== S) S.add(gull.g); };
  const HEADSHOT = [.62, 1.55];

  const sign = new THREE.Group(); { const st = cvs(256, 320, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = '#111'; g.lineWidth = 12; g.strokeRect(8, 8, w - 16, h - 16); txt(g, 'SPEED', w / 2, 56, 52, '#111'); txt(g, 'LIMIT', w / 2, 108, 52, '#111'); txt(g, '55', w / 2, 220, 140, '#111'); });
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.62), new THREE.MeshStandardMaterial({ map: st.t, roughness: .5 })); face.position.y = 2.6; face.castShadow = true; sign.add(face); cy(sign, .05, .05, 2.2, mat(0x8a8f96), 0, 1.1, -.03, { s: 8 }); sign.visible = false; S.add(sign); }
  const TARGET = [3, 12, 47, 156, 420, 1000]; const NOTE = ['fries: unprotected', 'the towel was a mistake', 'fries: in the car', 'keys: not yours anymore', 'doing exactly 55', 'bill: yours'];
  const swoopPos = (lt, ts, Pa, Pg, Pb, ta = .45, tb = .42) => { if (lt < ts - ta || lt > ts + tb) return null; if (lt < ts) { const e = ez((lt - (ts - ta)) / ta); return V(lerp(Pa.x, Pg.x, e), lerp(Pa.y, Pg.y, e) - Math.sin(e * Math.PI) * -.15, lerp(Pa.z, Pg.z, e)); } const e = ei((lt - ts) / tb); return V(lerp(Pg.x, Pb.x, e), lerp(Pg.y, Pb.y, e), lerp(Pg.z, Pb.z, e)); };
  const faceVel = (gl, a, b) => { const d = b.clone().sub(a); gl.g.rotation.y = Math.atan2(d.x, d.z); gl.g.rotation.x = Math.atan2(-d.y, Math.hypot(d.x, d.z)) * .5; };

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); const P = (gull.reset(), gull.P);
    gull.g.rotation.set(0, 0, 0); gull.g.position.set(0, 0, 0); gull.g.scale.setScalar(1);
    let shock = false, count = 0, carVis = bi >= 2, hide = false, sh = 0;
    towel.visible = false; boat.visible = false; cooler.visible = false; blanket.visible = false; umb.visible = false; receipt.visible = false; bill.visible = false; cartonG.visible = false; myFry.visible = false; CAR.g.visible = bi >= 2; CAR.tailM.emissiveIntensity = 0;
    const setSet = (on) => { cooler.visible = boat.visible = blanket.visible = umb.visible = on; };
    gullToCar(false); fries.forEach((m) => { m.visible = true; });
    place(YOU, 0, -9, 0, 0, 'idle', .5); YOU.vis = false;
    let eye = null, lbs = [];
    // ========================================================= BEAT 0: steals, you cover the fries
    if (bi === 0) {
      setSet(true); towel.visible = false; boat.visible = true;
      place(YOU, .45, -.7, .95, Math.PI, 'sit', .35); YOU.pitch = .06; YOU.arms = { lx: -1.0, lz: -.1, rx: -.15, rz: .1 };
      const steals = [.55, 1.5, 2.4]; const Pa = [V(-5.2, 3.0, 2.8), V(-5.0, 2.6, 1.6), V(-5.2, 3.2, 3.4)], Pb = V(-.6, 4.4, -3.5); let flying = false; let stolen = 0;
      const eatC = (lt * 1.2) % 1; const reach = smooth(Math.sin(clamp(eatC) * Math.PI));
      YOU.arms = { lx: lerp(-1.25, -2.3, reach), lz: lerp(-.45, -.1, reach), rx: -.15, rz: .1 }; YOU.pitch = .06 + .05 * reach;
      myFry.visible = lt < 2.2 && reach > .25; attach(myFry, YOU, 'handL', [0, -.04, .08]); myFry.visible = (lt < 2.2 && reach > .15 && YOU.vis);
      steals.forEach((ts, k) => { if (lt >= ts) { stolen = k + 1; } });
      for (let k = 0; k < 3; k++) { const Pg = V(BX - .55, TOP + .38, BZ + .02 + k * .02); const pos = swoopPos(lt, steals[k], Pa[k], Pg, Pb); if (pos) { flying = true; const pos2 = swoopPos(lt + .03, steals[k], Pa[k], Pg, Pb) || pos.clone().add(V(.01, 0, 0)); gull.g.position.copy(pos); faceVel(gull, pos, pos2); gullFly(P, t, 1); P.hp = .35; P.fry = lt > steals[k] + .02; P.brow = .5; P.beak = lt > steals[k] ? 0 : .5; if (lt > steals[k] - .06 && lt < steals[k] + .2) { P.wl = P.wr = 1.1; } } }
      fries.forEach((m, i) => { m.visible = !(stolen >= 1 && i < 4) || false; if (stolen >= 2 && i < 9) m.visible = false; if (stolen >= 3 && i < 14) m.visible = false; if (!(stolen >= 1 && i < 4)) m.visible = !((stolen >= 2 && i < 9) || (stolen >= 3 && i < 14)); });
      shock = lt > 2.0 && lt < 3.2; if (lt > 2.4 && lt < 3.2) YOU.arms = { lx: -2.5, lz: -.4, rx: -2.5, rz: .4 };
      // towel: starts in a pile beside you, you toss it over the boat
      const tU = clamp((lt - 3.2) / .75); towel.visible = lt > 3.0; const drape = V(BX + .5, TOP + .24, BZ); const start = V(.9, .12, 1.5);
      if (lt >= 3.0) { const e = smooth(tU); const px = lerp(start.x, drape.x, e), pz = lerp(start.z, drape.z, e), py = lerp(start.y, drape.y, e) + Math.sin(e * Math.PI) * .75; towel.position.set(px, py, pz); towel.rotation.set(lerp(2.4, 0, e), 0, lerp(.5, 0, e)); const s = lerp(.45, 1, e); towel.scale.set(s, s, s); skirts.visible = tU > .85; if (tU >= 1) { towel.rotation.set(0, 0, 0); towel.scale.set(1, 1, 1); } }
      if (lt >= 3.0 && lt < 3.9) { const q = smooth((lt - 3.0) / .35) * (1 - smooth((lt - 3.65) / .3)); YOU.arms = { lx: lerp(-.15, -1.0, 0), lz: -.2, rx: lerp(-.15, -2.3, q), rz: .15 }; YOU.arms.lx = lerp(-1.25, -2.0, q); YOU.arms.lz = -.3; shock = false; }
      if (lt >= 3.95) { YOU.arms = { lx: -2.6, lz: -.5, rx: -2.6, rz: .5 }; YOU.pitch = -.08; shock = false; } // smug, hands behind head
      // gull lands, glares at the towel
      if (lt >= 3.2) { const u = clamp((lt - 3.2) / .65); if (u < 1) { const a = V(-3.5, 3.0, 2.6), b = V(-2.15, 0, .15); const e = ez(u); gull.g.position.set(lerp(a.x, b.x, e), lerp(a.y, b.y, e), lerp(a.z, b.z, e)); faceVel(gull, a, b); gullFly(P, t, 1 - u * .5); P.hp = .2; } else { gull.g.position.set(-2.15, 0, .15); gull.g.rotation.y = Math.PI / 2 + .75; P.brow = .55; P.hp = .25 + Math.sin(t * 6) * .04; P.beak = lt > 4.3 ? .25 : 0; P.walk = 0; P.stride = 0; P.wl = P.wr = .05; } if (u >= 1 && lt > 4.1) { P.hy = Math.sin((lt - 4.1) * 14) * .05; } }
      gull.g.visible = !(lt < .1);
      count = stolen;
      eye = [[0, V(.3, 1.75, -5.3), V(-.2, .8, .5), 54], [2.4, V(.2, 1.6, -4.8), V(-.2, .8, .6), 50], [3.0, V(.0, 1.5, -4.4), V(-.25, .75, .65), 48], [5.2, V(-.1, 1.45, -4.4), V(-.5, .75, .6), 48]];
    // ========================================================= BEAT 1: the waiter gull lifts the towel
    } else if (bi === 1) {
      setSet(true); towel.visible = true; boat.visible = true; skirts.visible = true;
      place(YOU, .45, -.7, .95, Math.PI, 'sit', .35); YOU.arms = { lx: -2.6, lz: -.5, rx: -2.6, rz: .5 }; YOU.pitch = -.08;
      shock = false; for (let i = 0; i < NF; i++) fries[i].visible = i >= 14;
      const k = smooth((lt - .08) / .25);
      // gull walks in (bow tie), bows, grabs the towel with its beak, lifts like a waiter, reveals the fries
      const gx = lerp(-3.6, -1.55, smooth(clamp((lt - .2) / 1.0))); const walking = lt > .2 && lt < 1.2; gull.g.position.set(gx, 0, BZ - .08); gull.g.rotation.y = Math.PI / 2 + .75; gull.g.scale.setScalar(.85); P.bow = true;
      if (walking) { P.walk = lt * 12; P.stride = .55; P.hp = .1 + Math.abs(Math.sin(lt * 12)) * .06; } else P.stride = 0;
      P.brow = lt < 1.0 ? .1 : -.1; const bowU = smooth((lt - 1.2) / .45); const upU = smooth((lt - 1.95) / .5);
      const lift = smooth((lt - 1.85) / .65); const hold = lt > 2.5 && lt < 3.2;
      P.hp = lerp(P.hp, .95, bowU) * (1 - upU * .7) - upU * .05; gull.g.rotation.x = .25 * bowU * (1 - upU); P.beak = lt > 1.5 && lt < 1.7 ? .5 : (lt > 1.7 && lt < 3.1 ? .22 : 0); P.wr = lerp(0, 1.2, smooth((lt - 2.0) / .35)) * (lt < 3.2 ? 1 : 1 - smooth((lt - 3.2) / .3)); P.fr = Math.sin(t * 5) * .08 + .35 * smooth((lt - 2.0) / .35); P.wl = .1;
      if (lt > 2.45 && lt < 3.1) { P.wl = lerp(.1, 1.5, smooth((lt - 2.45) / .25)); P.fl = .15 + Math.sin(t * 6) * .08; P.beak = .22; }
      // IK: towel free edge follows the beak
      gull.g.updateMatrixWorld(true); const beak = gull.tip.getWorldPosition(V()); const H = V(BX + .48, TOP + .24, BZ);
      const rest = { ang: 0, len: TW }; let ang = rest.ang, len = rest.len; const ff = clamp(lift * 1.0); if (lt > 1.6) { const dx = H.x - beak.x, dy = beak.y - H.y; const a2 = Math.atan2(dy, Math.max(.2, dx)); const l2 = clamp(Math.hypot(dx, dy), .45, 1.25); const w = smooth((lt - 1.6) / .25); ang = lerp(0, a2, w); len = lerp(TW, l2, w); }
      if (lt > 3.2) { const f = smooth((lt - 3.2) / .45); ang = lerp(ang, 1.5, f); len = lerp(len, 1.0, f); }
      const dropped = lt > 3.35; towel.position.copy(H); towel.rotation.set(0, 0, -ang); towel.scale.set(len, 1, 1); skirts.visible = lt < 1.75; if (dropped) { const f = smooth((lt - 3.35) / .3); towel.position.set(lerp(H.x, BX - .7, f), lerp(H.y, .05, f), lerp(H.z, BZ + .4, f)); towel.rotation.set(0, 0, lerp(-1.5, 0, f)); towel.scale.set(1, 1, 1); }
      if (lt > 3.3) { P.hp = .8 * smooth((lt - 3.3) / .15); P.fry = lt > 3.5; gull.g.rotation.x = .2; } shock = lt < .08;
      count = 3 + Math.floor(smooth((lt - 3.4) / .26) * 9);
      showLb(lbClever, lt > .05 && lt < .85, V(-.2, 2.1 + Math.min(.12, lt * .4), .5), Math.min(1.05, (lt - .05) * 6), 1.0);
      eye = [[0, V(-.1, 1.6, -5.6), V(-.9, .75, .5), 46], [1.6, V(-.5, 1.4, -5.0), V(-1.0, .8, .5), 44], [3.7, V(-.4, 1.6, -5.4), V(-.9, .8, .5), 46]];
    // ========================================================= BEAT 2: car, you eat; the gull is already in the car
    } else if (bi === 2) {
      setCar(300, 0, 14, 0); gullToCar(true); YOU.vis = true;
      const w = toW(-.5, SEAT - .84, -.12); place(YOU, w.x, w.y, w.z, 0, 'sit', .35); YOU.pitch = .02;
      const eatC = ((lt) * 1.1) % 1; const reach = smooth(Math.sin(clamp(eatC) * Math.PI)); YOU.arms = { lx: -.2, lz: -.1, rx: lerp(-1.0, -2.3, reach), rz: .1 };
      attach(myFry, YOU, 'handR', [0, -.04, .08]); myFry.visible = reach > .15 && lt < 3.1;
      // gull in the rear seat: hides behind you, then leans out and looks at the camera
      const peek = smooth((lt - 2.9) / .5); gull.g.position.set(lerp(-.5, .15, peek), SEAT - .24 + .05 * peek, -1.4); gull.g.rotation.y = lerp(0, .5, peek); P.sit = 1; P.brow = lerp(.1, .5, peek); P.hp = lerp(.1, .12, peek) + Math.sin(t * 7) * .03 * peek; P.beak = peek > .5 ? (Math.sin(t * 9) > .3 ? .35 : .05) : 0; P.fry = peek > .6; P.wl = P.wr = lerp(0, .1, peek);
      if (lt > 3.6) { P.wr = .3; P.fr = .1 + Math.sin(t * 4) * .1; P.wl = 1.2; P.fl = Math.sin(t * 4) * .2 + .1; }
      shock = lt > 3.2; if (lt > 3.3) { YOU.arms = { lx: -2.5, lz: -.3, rx: -2.5, rz: .3 }; YOU.pitch = -.05; }
      const h = hp(YOU, 'head'); showLb(lbBetter, lt > 1.75 && lt < 2.9, V(h.x + .55, h.y + .8, h.z + .3), Math.min(1.1, (lt - 1.75) * 5) * 1, 1.15);
      count = 12 + Math.floor(smooth((lt - 3.3) / .5) * 35);
      const cx = 300; eye = [[0, V(cx + 3.6, 3.2, 19.4), V(cx - .6, 1.4, 13.6), 50], [2.6, V(cx + 3.2, 3.2, 19.0), V(cx - .4, 1.4, 13.4), 48], [3.4, V(cx + 3.6, 3.1, 18.0), V(cx - .1, 1.4, 12.8), 46], [5.9, V(cx + 3.2, 3.0, 18.2), V(cx - .1, 1.3, 12.8), 46]];
    // ========================================================= BEAT 3: driver's seat, your keys
    } else if (bi === 3) {
      setCar(300, 0, 14, 0, 0, 0); gullToCar(true); YOU.vis = true;
      const lurch = lt > 2.7 ? Math.sin((lt - 2.7) * 9) * .012 * Math.exp(-(lt - 2.7) * 1.2) : 0; setCar(300, 0, 14 + lurch * 6, 0, lurch, -lurch * 2);
      gull.g.position.set(.5, SEAT - .24, -.18); gull.g.rotation.y = Math.sin(t * .8) * .03; P.sit = 1; P.shades = true; P.keysOn = lt > 1.2; P.brow = .4; P.keys = t * 7; P.hp = .1; P.wl = P.wr = 2.7; P.tl = P.tr = 0.05; P.fl = P.fr = .0;
      // wings forward on the wheel: left (-x side) wing rotates to +z via sp ~ pi
      P.wl = 2.85; P.wr = 2.85; P.fl = -.35; P.fr = -.35; P.tl = P.tr = .5;
      const sq = lt > 1.7 && lt < 2.7; P.beak = 0; P.hy = lt > 1.7 ? Math.sin((lt - 1.7) * 3) * .06 : 0; if (lt > 2.6) { P.hp = .05; }
      const w = toW(2.4, 0, 1.1); place(YOU, w.x, 0, w.z, -Math.PI / 2 - .85, 'idle', .5); YOU.arms = { lx: -2.6 + Math.sin(t * 9) * .1, lz: -.5, rx: -2.6, rz: .5 }; YOU.pitch = .12; shock = true; YOU.y = 0;
      CAR.wheel.rotation.z = Math.sin(t * 1.5) * .12;
      count = 47 + Math.floor(smooth((lt - 1.9) / .6) * 109);
      const cx = 300; eye = [[0, V(cx - 3.4, 3.2, 20.0), V(cx + 1.0, 1.4, 14.6), 50], [1.2, V(cx - 2.8, 2.9, 19.0), V(cx + .7, 1.5, 14.3), 46], [1.9, V(cx - 1.6, 2.6, 17.4), V(cx + .55, 1.5, 14.2), 40], [3.7, V(cx - 1.2, 2.6, 17.2), V(cx + .5, 1.45, 14.2), 38]];
    // ========================================================= BEAT 4: the highway chase
    } else if (bi === 4) {
      const sp = 11.5; const cxp = 250 - sp * lt; setCar(cxp, 0, RZ - 2, -Math.PI / 2, 0, 0); gullToCar(true);
      CAR.wheels.forEach((w) => { w.rotation.x = -(lt * sp) / .46; }); CAR.g.position.y = Math.sin(t * 14) * .006;
      gull.g.position.set(.5, SEAT - .24, -.18); P.sit = 1; P.shades = true; P.brow = .38; P.hp = .02; P.hy = Math.sin(t * .9) * .55 * smooth(lt / .5) * (lt > 1.4 ? 1 : .3); P.wl = 2.85; P.fl = -.3; P.tl = .5; P.wr = 1.5; P.fr = .1; P.tr = 0; P.beak = (lt > 3.4 && lt < 3.9) ? .3 : 0;
      if (lt > 1.1) { P.wr = lerp(2.85, 1.5, 0); }
      place(YOU, cxp + 4.4 + lt * 1.3, 0, RZ - 2 - .9 + Math.sin(t * .8) * .1, -Math.PI / 2, 'sprint', .72); YOU.arms = null; YOU.pitch = .22; shock = true;
      const h = hp(YOU, 'head'); gull.g.rotation.y = 0;
      count = 156 + Math.floor(smooth((lt - 1.5) / 2.5) * 264);
      eye = [[0, V(cxp - 7.5, 2.1, RZ - 4.8), V(cxp + 1.8, 1.3, RZ - 1.2), 56], [5.2, V(cxp - 7.5, 2.1, RZ - 4.8), V(cxp + 1.8, 1.3, RZ - 1.2), 54]];
      // speed-limit sign on the shoulder, 55 in huge numerals
      sign.visible = true; sign.position.set(250 - 1, 0, RZ - 3.8); sign.rotation.y = -Math.PI / 2 + .4; sh = .004;
    // ========================================================= BEAT 5: the fry stand
    } else {
      const arrive = clamp(lt / 1.35); const stopX = SX + 3.5; const x = stopX + (1 - ez(arrive)) * 14;
      setCar(x, 0, RZ + 4.7, -Math.PI / 2 + Math.sin(lt * 4) * 0.0, 0, arrive < 1 ? .02 * Math.sin(arrive * Math.PI) : 0); CAR.wheels.forEach((w) => { w.rotation.x = -x * 2.2; }); CAR.tailM.emissiveIntensity = (arrive > .4 && lt < 4.6) ? 1.6 : 0;
      // gull: in the seat, then flies to the counter
      const fl0 = 1.45, fl1 = 2.05;
      if (lt < fl0) { gullToCar(true); gull.g.position.set(.5, SEAT - .24, -.18); P.sit = 1; P.shades = true; P.brow = .38; P.hp = .02; P.wl = 2.85; P.fl = -.3; P.tl = .5; P.wr = 2.85; P.fr = -.3; P.tr = .5; P.hy = lt > .9 ? .3 : 0; }
      else { gullToCar(false); gull.reset(); const Pn = gull.P; const a = toW(.5, SEAT + .1, -.18); const b = V(SX - .02, 1.22, SZ - 1.62); const u = clamp((lt - fl0) / (fl1 - fl0)); if (u < 1) { const e = smooth(u); const pos = V(lerp(a.x, b.x, e), lerp(a.y, b.y, e) + Math.sin(e * Math.PI) * 1.3, lerp(a.z, b.z, e)); const pos2 = V(lerp(a.x, b.x, smooth(u + .03)), lerp(a.y, b.y, smooth(u + .03)) + Math.sin(smooth(u + .03) * Math.PI) * 1.3, lerp(a.z, b.z, smooth(u + .03))); gull.g.position.copy(pos); faceVel(gull, pos, pos2); gullFly(Pn, t, 1); Pn.shades = true; Pn.hp = .2; } else { gull.g.position.copy(b); gull.g.rotation.y = 0; gull.g.scale.setScalar(.6); Pn.shades = true; Pn.brow = .35 + Math.sin(t * 2) * .03; Pn.hp = .05; const spk = lt > 2.0 && lt < 3.4; Pn.beak = spk ? (Math.sin(t * 13) > 0 ? .4 : .08) : 0; Pn.wl = Pn.wr = .4 + (lt > 2.1 && lt < 3.1 ? Math.sin(t * 5) * .08 : 0); Pn.hy = lt > 3.6 ? Math.sin(t * 1.2) * .25 : 0; Pn.fry = lt > 3.8; if (lt > 3.9) { Pn.beak = Math.sin(t * 10) > .3 ? .25 : .0; } }
        Object.assign(P, gull.P); }
      // the carton on the counter later
      cartonG.visible = lt > 3.7; cartonG.position.set(SX - .45, 1.2, SZ - 1.4); cartonG.scale.setScalar(1.3);
      // you walk up from the left, pull out cash, pay; receipt prints
      const Y0 = SX + 6.0, Y1 = SX + .8, ZY = SZ - 2.3; const wu = clamp((lt - 2.9) / 1.1); YOU.vis = lt > 2.85; const px = lerp(Y0, Y1, smooth(wu)); const arrived = wu >= 1; place(YOU, px, 0, ZY, arrived ? lerp(-Math.PI / 2, 0, smooth((lt - 4.0) / .3)) : -Math.PI / 2, arrived ? 'idle' : 'walk', .9); YOU.vis = lt > 2.85; YOU.pitch = arrived ? .12 : .05;
      const hand = smooth((lt - 4.05) / .3); YOU.arms = arrived ? { lx: -.3, lz: -.12, rx: lerp(-.3, -1.7, hand), rz: .15 } : { lx: -.4, lz: -.12, rx: -.4, rz: .12 }; shock = false; crowd.setFace('calm');
      if (arrived && lt > 4.0) { bill.visible = lt < 4.55; attach(bill, YOU, 'handR', [0, -.02, .12], [0, 0, 0]); bill.visible = lt < 4.55 && YOU.vis; }
      if (lt > 4.4) { const r = smooth((lt - 4.4) / .6); receipt.visible = true; receipt.position.set(SX + .55, 1.5, SZ - 1.55); receipt.rotation.set(-.1, 0, 0); receipt.scale.set(.6, Math.max(.02, r) * .6, 1); }
      count = 420 + Math.floor(smooth((lt - 2.3) / 1.8) * 580);
      showLb(lbOrder, lt > 1.95 && lt < 3.3, V(SX - .02, 2.2, SZ - 1.4), Math.min(1.1, (lt - 1.95) * 6), 1.15);
      // camera: wide exterior of arrival, then inside the stand
      eye = [[0, V(SX + 16, 2.3, RZ - 1.5), V(SX + 3.5, 1.0, RZ + 4.7), 50], [1.2, V(SX + 8, 2.2, RZ - 2.2), V(SX + .5, 1.2, SZ - 1.5), 46], [2.0, V(SX + 5, 2.3, SZ - 8.5), V(SX - .2, 1.5, SZ - 1.5), 40], [2.8, V(SX + 4.6, 2.3, SZ - 8.0), V(SX - .2, 1.5, SZ - 1.5), 40], [2.9, V(SX + .3, 1.65, SZ + 1.5), V(SX + .3, 1.75, SZ - 2.0), 56], [4.2, V(SX + .35, 1.62, SZ + 1.2), V(SX + .35, 1.75, SZ - 2.0), 52], [5.2, V(SX + .45, 1.6, SZ + .9), V(SX + .45, 1.75, SZ - 1.8), 48]];
    }
    sign.visible = bi === 4; if (bi !== 4 && sign.parent) sign.visible = false;
    // ---- people / gull matrices
    crowd.setFace(shock ? 'shock' : 'calm'); crowd.update(t); gull.apply();
    if (bi === 1) { /* gull origin already set */ }
    // beat 1 needs the towel/fry after body update
    if (bi === 1 && P.fry) { /* fry in beak shown by gull */ }
    // sea / boats
    bch.seaMat.uniforms.time.value = t; bch.boats.forEach((b, i) => { b.position.y = Math.sin(t * 1.1 + i) * .12; });
    // beat 5 receipt attach to register; beat 0 timing of YOU fry already handled
    if (bi === 5) { gull.g.updateMatrixWorld(true); }
    // ---- camera
    const fo = bi >= 2 ? (bi === 4 ? [0, 0] : [0, 0]) : [0, 0];
    shot(lt, eye, t, sh);
    const fx = bi === 0 || bi === 1 ? 0 : bi === 2 || bi === 3 ? 300 : bi === 4 ? CAR.g.position.x : SX;
    A.follow(fx, bi >= 4 ? (bi === 4 ? RZ - 2 : (SZ - 4)) : (bi >= 2 ? 14 : 1));
    A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    const cnt = Math.max(1, count);
    hud.counter('FRIES STOLEN', cnt.toLocaleString('en-US'), NOTE[bi], '', bi >= 1);
    hud.tm(''); hud.pop('', 0);
  } };
}
