// 681 invention chain: lose keys -> belt -> metal detector -> spare under mat -> raccoon -> raccoon moves in & pays rent -> animal control loses keys -> tent, house has 5 stars.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, mat, Crowd, clamp, smooth, lerp, attach, tree } = lib;
  const A = makeStage({ fog: 0xbcd8ee, fogNear: 55, fogFar: 190, clouds: true, skyTop: 0x3f86d8, skyMid: 0x9cc8f0, skyBot: 0xe2eef9, shadowExtent: 12, shadowRes: 2048, hemi: 1.5, sunI: 1.9, sunDir: [-.35, .9, .55], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const box = (par, x, y, z, w, h, d, c, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.mat || mat(c, o.m || {})); m.position.set(x, y, z); if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.rx) m.rotation.x = o.rx; m.castShadow = o.cast !== false; m.receiveShadow = true; par.add(m); return m; };
  const cyl = (par, x, y, z, r, h, c, o = {}) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, o.r2 ?? r, h, o.seg || 20), o.mat || mat(c, o.m || {})); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.rz) m.rotation.z = o.rz; m.castShadow = true; m.receiveShadow = true; par.add(m); return m; };
  const plane = (par, w, h, tex, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: .8, transparent: !!o.tr })); m.position.set(x, y, z); if (o.ry) m.rotation.y = o.ry; par.add(m); return m; };
  const faceTo = (o, x, z) => { o.yaw = Math.atan2(x - o.x, z - o.z); };

  // ------------------------------------------------------------------ ground
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), mat(0x6fa84e)); grass.rotation.x = -Math.PI / 2; grass.position.y = -.02; grass.receiveShadow = true; S.add(grass);
  // ------------------------------------------------------------------ house (door at x=0, wall front z=-3)
  const HZ = -3.0; const wallC = 0xf1e3c4;
  box(S, -3.3, 1.7, HZ - .15, 5.5, 3.4, .3, wallC); box(S, 3.3, 1.7, HZ - .15, 5.5, 3.4, .3, wallC); box(S, 0, 2.8, HZ - .15, 1.1, 1.2, .3, wallC); box(S, 0, 3.7, HZ - 1.6, 13, .3, 3.9, 0x8a4b3a);
  box(S, 0, 3.52, HZ + .12, 12.6, .22, .3, 0xd9ccb0); // eave
  for (const sx of [-1, 1]) { box(S, sx * 3.7, 1.7, HZ + .02, 1.2, 1.4, .08, 0xffffff); box(S, sx * 3.7, 1.7, HZ + .06, 1.0, 1.2, .04, 0x9fd0f0, { m: { roughness: .1, metalness: .2 } }); box(S, sx * 3.7, 1.7, HZ + .09, .05, 1.2, .03, 0xffffff); box(S, sx * 3.7, 1.7, HZ + .09, 1.0, .05, .03, 0xffffff); }
  // stoop + path
  box(S, 0, .06, -2.2, 3.4, .12, 1.7, 0xb9b2a4); box(S, 0, .02, 3.0, 1.6, .05, 12, 0xc9c2b4, { cast: false });
  for (let i = 0; i < 7; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(.45 + cr(i, 1) * .2, 1), mat(0x3f8a3c, { flatShading: true })); b.position.set(i < 4 ? -2.6 - i * 1.2 : 2.6 + (i - 4) * 1.2, .3, HZ + .5); b.castShadow = true; S.add(b); }
  // interior (visible through the open door)
  { box(S, 0, .1, -5.6, 5, .1, 5, 0x8a5e3a, { cast: false }); box(S, 0, 1.6, -8.1, 5, 3.2, .1, 0xe8c9a0, { cast: false }); box(S, -2.5, 1.6, -5.6, .1, 3.2, 5, 0xdcb98c, { cast: false }); box(S, 2.5, 1.6, -5.6, .1, 3.2, 5, 0xdcb98c, { cast: false }); box(S, 0, 3.2, -5.6, 5, .1, 5, 0xf2e6d0, { cast: false });
    box(S, -1.4, .5, -7.2, 2.2, .7, .9, 0xc0453a); box(S, -1.4, 1.0, -7.6, 2.2, .7, .25, 0xa83a30); box(S, -2.2, .72, -6.9, .3, .4, .9, 0xa83a30); box(S, 1.2, .55, -6.5, .9, .08, .9, 0x7a4e28); cyl(S, 1.2, .3, -6.5, .06, .5, 0x7a4e28);
    const pic = cvs(128, 96, (g, w, h) => { g.fillStyle = '#6fb0e8'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8c85a'; g.beginPath(); g.arc(90, 26, 14, 0, 7); g.fill(); g.fillStyle = '#4a9a4a'; g.fillRect(0, 62, w, 34); }); box(S, 0, 2.1, -8.0, 1.5, 1.1, .06, 0x5a3a1c); plane(S, 1.3, .9, pic.t, 0, 2.1, -7.96);
    const lamp = new THREE.PointLight(0xffd9a0, 5, 9); lamp.position.set(0, 2.6, -5); S.add(lamp); S.userData.lamp = lamp; }
  // front door (hinge at x=-.55)
  const door = new THREE.Group(); door.position.set(-.55, 0, HZ + .04); S.add(door);
  { const dt = cvs(128, 256, (g, w, h) => { g.fillStyle = '#2f6fb0'; g.fillRect(0, 0, w, h); g.fillStyle = '#245a92'; g.fillRect(14, 20, 44, 96); g.fillRect(70, 20, 44, 96); g.fillRect(14, 136, 100, 100); }); const ds = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.2, .07), mat(0x2f6fb0)); ds.position.set(.55, 1.15, 0); ds.castShadow = true; door.add(ds); plane(door, 1.08, 2.18, dt.t, .55, 1.15, .037); box(door, .95, 1.1, .1, .09, .09, .09, 0xe2b94a); }
  // welcome mat + spare key
  const MATZ = -1.95; const matG = new THREE.Group(); matG.position.set(0, .12, MATZ - .37); S.add(matG); // pivot at back edge
  { const mt = cvs(256, 160, (g, w, h) => { g.fillStyle = '#a07a46'; g.fillRect(0, 0, w, h); g.fillStyle = '#7d5a2e'; g.fillRect(8, 8, w - 16, h - 16); g.fillStyle = '#c9a46a'; g.fillRect(14, 14, w - 28, h - 28); txt(g, 'WELCOME', w / 2, h / 2 + 4, 52, '#4a2f12'); });
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.4, .04, .78), [mat(0x7d5a2e), mat(0x7d5a2e), new THREE.MeshStandardMaterial({ map: mt.t, roughness: 1 }), mat(0x7d5a2e), mat(0x7d5a2e), mat(0x7d5a2e)]); m.position.set(0, .02, .39); m.castShadow = true; m.receiveShadow = true; matG.add(m); }
  const makeKeys = (sc = 1) => { const g = new THREE.Group(); const gold = mat(0xe8b830, { metalness: .8, roughness: .3 }), sil = mat(0xc8ccd4, { metalness: .85, roughness: .3 }), blue = mat(0x2a7ad8, { roughness: .5 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.07, .014, 8, 24), sil); ring.position.y = 0; g.add(ring);
    [[-.5, gold, .24], [0, sil, .27], [.5, gold, .21]].forEach(([a, m, L], i) => { const k = new THREE.Group(); k.position.y = -.06; k.rotation.z = a; const hd = new THREE.Mesh(new THREE.TorusGeometry(.04, .014, 6, 16), i === 1 ? blue : m); hd.position.y = -.03; k.add(hd); const sh = new THREE.Mesh(new THREE.BoxGeometry(.028, L, .018), m); sh.position.y = -.07 - L / 2; k.add(sh); for (let j = 0; j < 3; j++) { const tt = new THREE.Mesh(new THREE.BoxGeometry(.05, .025, .018), m); tt.position.set(.03, -.07 - L + .02 + j * .05, 0); k.add(tt); } g.add(k); });
    g.traverse((o) => { o.castShadow = true; }); g.scale.setScalar(sc); return g; };
  const spare = makeKeys(1.5); spare.rotation.set(Math.PI / 2, 0, 0); S.add(spare); // lies flat, ring toward +z
  const beltKeys = makeKeys(1.5); beltKeys.visible = false; S.add(beltKeys);
  const ratKeys = makeKeys(1.7); ratKeys.visible = false; S.add(ratKeys);
  const handKeys = makeKeys(1.5); handKeys.visible = false; S.add(handKeys);
  // ------------------------------------------------------------------ raccoon
  const makeRac = () => { const g = new THREE.Group(); const grey = mat(0x8d9098), dk = mat(0x23232a), wh = mat(0xeeeae0), lg = mat(0xb4b6bc); const u = {};
    const body = new THREE.Group(); body.position.y = .3; g.add(body); u.body = body; box(body, 0, .03, .2, .36, .3, .5, 0, { mat: grey }); box(body, 0, -.1, .22, .3, .08, .42, 0, { mat: wh });
    const head = new THREE.Group(); head.position.set(0, .13, .52); body.add(head); u.head = head; box(head, 0, 0, 0, .36, .3, .3, 0, { mat: grey }); box(head, 0, -.06, .2, .17, .13, .14, 0, { mat: wh }); box(head, 0, -.0, .285, .07, .05, .04, 0, { mat: dk });
    box(head, 0, .04, .0, .38, .11, .305, 0, { mat: dk }); for (const sx of [-1, 1]) { box(head, sx * .09, .05, .155, .08, .075, .03, 0, { mat: wh }); box(head, sx * .09, .05, .175, .04, .05, .02, 0, { mat: dk }); box(head, sx * .13, .19, -.03, .1, .12, .06, 0, { mat: grey }); box(head, sx * .13, .18, -.0, .05, .07, .04, 0, { mat: mat(0xe8a0a8) }); box(head, sx * .1, .115, .152, .11, .03, .02, 0, { mat: wh, ry: 0 }); }
    for (const sx of [-1, 1]) { const arm = new THREE.Group(); arm.position.set(sx * .21, .0, .4); body.add(arm); u[sx < 0 ? 'armL' : 'armR'] = arm; box(arm, 0, -.15, 0, .1, .3, .1, 0, { mat: grey }); const paw = box(arm, 0, -.33, 0, .11, .1, .12, 0, { mat: dk }); u[sx < 0 ? 'pawL' : 'pawR'] = paw; }
    for (const sx of [-1, 1]) { const leg = new THREE.Group(); leg.position.set(sx * .13, .3, .0); g.add(leg); u[sx < 0 ? 'legL' : 'legR'] = leg; box(leg, 0, -.14, 0, .12, .28, .13, 0, { mat: grey }); box(leg, 0, -.28, .04, .13, .05, .2, 0, { mat: dk }); }
    const tail = new THREE.Group(); tail.position.set(0, .03, -.05); body.add(tail); u.tail = tail; for (let i = 0; i < 7; i++) { const s = 1 - i * .04; box(tail, 0, .015 * i * i * .35, -.07 - i * .095, .15 * s, .15 * s, .1, 0, { mat: i % 2 ? dk : lg }); }
    const sg = new THREE.Group(); box(sg, 0, 0, 0, .34, .06, .03, 0, { mat: mat(0x0a0a0a, { roughness: .2 }) }); box(sg, 0, 0, 0, .16, .05, .035, 0, { mat: mat(0x0a0a0a) }); sg.position.set(0, .08, .165); sg.visible = false; head.add(sg); u.shades = sg;
    g.userData = u; g.traverse((o) => { o.castShadow = true; }); return g; };
  // A = world arm angle (0 down, -1.57 forward, -3.14 up); body pitch th (0 flat, -1.35 upright)
  const rac = makeRac(); S.add(rac); const RU = rac.userData;
  const poseRac = (o) => { const th = o.th ?? -.05; RU.body.rotation.x = th; RU.armL.rotation.x = (o.al ?? 0) - th; RU.armR.rotation.x = (o.ar ?? 0) - th; RU.armL.rotation.z = o.alz ?? 0; RU.armR.rotation.z = o.arz ?? 0; const w = o.walk || 0; RU.legL.rotation.x = Math.sin(w) * .7; RU.legR.rotation.x = -Math.sin(w) * .7; RU.tail.rotation.x = (o.tail ?? .25) + Math.sin((o.tw ?? 0)) * .0; RU.tail.rotation.y = Math.sin(o.tw ?? 0) * .3; RU.head.rotation.x = -th * .9 + (o.hx ?? 0); RU.head.rotation.y = o.hy ?? 0; RU.shades.visible = !!o.shades; rac.position.set(o.x, o.y, o.z); rac.rotation.y = o.yaw ?? 0; rac.scale.setScalar(o.s ?? 1.4); rac.visible = o.vis !== false; };
  // ------------------------------------------------------------------ people
  const crowd = new Crowd(S, 4, 91); const P = crowd.p; const YOU = P[0], G1 = P[1], G2 = P[2], OFF = P[3];
  const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  col(0, ['torso', 'armL', 'armR'], 0x3a78d8); col(0, ['legL', 'legR'], 0x2b3347); col(0, ['hair'], 0x4a2f1c);
  for (const i of [1, 2]) { col(i, ['torso', 'armL', 'armR'], 0x23325a); col(i, ['legL', 'legR'], 0x15171e); col(i, ['hair'], 0x1a1410); }
  col(3, ['torso', 'armL', 'armR'], 0x7a8a4a); col(3, ['legL', 'legR'], 0x4a4a3a); col(3, ['hair'], 0x2a1c10);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  P.forEach((o) => { o.h = 1; });
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; };
  const hide = (o) => { place(o, 0, -5, 0, 0, 'idle'); o.vis = false; };
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const REST = (side) => ({ lx: -.1, lz: -.1, rx: -.1, rz: .1 });
  // cap for guards/officer, belt for you
  const mkCap = (c) => { const g = new THREE.Group(); box(g, 0, .0, 0, .52, .12, .52, 0, { mat: mat(c) }); box(g, 0, -.04, .3, .5, .03, .22, 0, { mat: mat(0x0c0c10) }); box(g, 0, .02, .27, .12, .06, .02, 0, { mat: mat(0xe8c050) }); S.add(g); g.visible = false; return g; };
  const cap1 = mkCap(0x23325a), cap2 = mkCap(0x23325a), capO = mkCap(0x5d6a38);
  const belt = new THREE.Group(); { box(belt, 0, 0, 0, .64, .075, .36, 0, { mat: mat(0x1a1410) }); box(belt, 0, 0, .185, .12, .09, .03, 0, { mat: mat(0xe8c050, { metalness: .7, roughness: .3 }) }); box(belt, .21, -.04, .19, .07, .1, .03, 0, { mat: mat(0x1a1410) }); } S.add(belt); belt.visible = false;
  const badge = new THREE.Group(); { box(badge, 0, 0, 0, .13, .15, .02, 0, { mat: mat(0xf0c840, { metalness: .6, roughness: .3 }) }); } S.add(badge); badge.visible = false;
  const wand = new THREE.Group(); { box(wand, 0, -.28, 0, .05, .55, .05, 0, { mat: mat(0x16161a) }); box(wand, 0, -.58, 0, .07, .12, .07, 0, { mat: mat(0xf2d000) }); } S.add(wand); wand.visible = false;
  // ------------------------------------------------------------------ labels / bubbles
  const mkLabel = (text, c1, c2, w = 640, size) => { const l = cvs(w, 180, (g, ww, h) => { txt(g, text, ww / 2, 94, size || (text.length > 9 ? 92 : 120), c1, { stroke: c2, sw: 22 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const mkBubble = (text, fill, tc) => { const l = cvs(512, 256, (g, w, h) => { g.fillStyle = '#111'; g.beginPath(); g.roundRect(14, 14, w - 28, 170, 56); g.moveTo(190, 170); g.lineTo(150, 240); g.lineTo(250, 176); g.fill(); g.fillStyle = fill; g.beginPath(); g.roundRect(30, 30, w - 60, 138, 44); g.moveTo(196, 160); g.lineTo(166, 222); g.lineTo(240, 166); g.fill(); txt(g, text, w / 2, 100, text.length > 5 ? 84 : 104, tc || '#fff', { stroke: '#7a0a00', sw: 0 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 11; S.add(s); return s; };
  const lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111'), lbClever = mkLabel('CLEVER!', '#ffe23a', '#111');
  const plusA = []; { const base = mkLabel('+1', '#ff5a4a', '#111', 256); for (let i = 0; i < 3; i++) { const s = base.clone(); s.material = base.material.clone(); S.add(s); plusA.push(s); } }
  const beeps = []; for (let i = 0; i < 8; i++) beeps.push(mkBubble(['BEEP!', 'BEEP!', 'BEEP BEEP!', 'BEEEP!'][i % 4], '#e8252b'));
  const qmarks = []; for (let i = 0; i < 3; i++) qmarks.push(mkBubble('?!', '#ffe23a', '#222'));
  // ------------------------------------------------------------------ metal detector (x=40)
  const GX = 40; const lampM = new THREE.MeshStandardMaterial({ color: 0x501010, emissive: 0xff1a10, emissiveIntensity: 0 }); const ledM = []; const lampPt = new THREE.PointLight(0xff2010, 0, 9); lampPt.position.set(GX, 2.7, 0); S.add(lampPt);
  { box(S, GX, -.0, 0, 14, .08, 14, 0, { mat: new THREE.MeshStandardMaterial({ map: (() => { const c = cvs(128, 128, (g) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = (i + j) % 2 ? '#d8d8dc' : '#9aa0aa'; g.fillRect(i * 32, j * 32, 32, 32); } }); c.t.wrapS = c.t.wrapT = THREE.RepeatWrapping; c.t.repeat.set(7, 7); return c.t; })(), roughness: .35 }), cast: false });
    box(S, GX - 6, 2.2, 0, .2, 4.4, 14, 0xdfe6ee, { cast: false }); box(S, GX, 2.2, -7, 14, 4.4, .2, 0xdfe6ee, { cast: false }); box(S, GX, 4.3, 0, 14, .2, 14, 0xf4f6f8, { cast: false });
    const sgn = cvs(512, 128, (g, w, h) => { g.fillStyle = '#1a3a7a'; g.fillRect(0, 0, w, h); txt(g, 'SECURITY CHECK', w / 2, 66, 62, '#fff'); }); plane(S, 3.6, .9, sgn.t, GX - 5.85, 3.4, 1.5, { ry: Math.PI / 2 });
    const stripe = cvs(256, 64, (g, w, h) => { for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? '#111' : '#f2c800'; g.beginPath(); g.moveTo(i * 28, 0); g.lineTo(i * 28 + 28, 0); g.lineTo(i * 28 + 8, h); g.lineTo(i * 28 - 20, h); g.fill(); } });
    for (const sz of [-1, 1]) { box(S, GX, 1.2, sz * .95, .55, 2.4, .26, 0x2c3340); box(S, GX, .06, sz * .95, .7, .14, .5, 0x1c2128); box(S, GX + .29, 1.2, sz * .95, .02, 2.1, .2, 0x15191f); for (let i = 0; i < 6; i++) { const lm = new THREE.MeshStandardMaterial({ color: 0x402020, emissive: 0xff2a10, emissiveIntensity: 0 }); ledM.push(lm); box(S, GX + .31, .6 + i * .28, sz * .95, .03, .12, .12, 0, { mat: lm, cast: false }); } }
    box(S, GX, 2.5, 0, .6, .3, 2.4, 0x2c3340); const lp = new THREE.Mesh(new THREE.SphereGeometry(.2, 16, 12), lampM); lp.position.set(GX, 2.78, 0); S.add(lp); cyl(S, GX, 2.68, 0, .22, .1, 0x555b66);
    const ps = cvs(256, 128, (g, w, h) => { g.fillStyle = '#111'; g.fillRect(0, 0, w, h); txt(g, 'NO METAL', w / 2, 40, 44, '#ffd23a'); txt(g, 'PAST HERE', w / 2, 92, 44, '#ffd23a'); }); plane(S, .5, .25, ps.t, GX + .295, 2.0, .95, { ry: Math.PI / 2 });
    // conveyor for flavour
    box(S, GX + 3, .45, 3.8, .9, .9, 4.2, 0x3a3f48); box(S, GX + 3, .93, 3.8, .8, .06, 4.1, 0x15171c); [[.2, 0xd8453a], [-.9, 0x3a8ad8]].forEach(([dz, c]) => box(S, GX + 3, 1.18, 3.8 + dz, .55, .4, .38, c)); }
  // ------------------------------------------------------------------ animal-control van (x=-40)
  const VX = -40; const van = new THREE.Group(); S.add(van);
  { const side = cvs(512, 256, (g, w, h) => { g.fillStyle = '#f4f4f0'; g.fillRect(0, 0, w, h); g.fillStyle = '#1f6fd0'; g.fillRect(0, 150, w, 36); txt(g, 'ANIMAL', w / 2 + 40, 56, 66, '#1f4fa0'); txt(g, 'CONTROL', w / 2 + 40, 118, 66, '#1f4fa0'); g.fillStyle = '#1f4fa0'; g.beginPath(); g.arc(70, 78, 40, 0, 7); g.fill(); g.fillStyle = '#f4f4f0'; [[50, 50], [74, 40], [98, 52]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y + 14, 8, 0, 7); g.fill(); }); g.beginPath(); g.arc(74, 88, 16, 0, 7); g.fill(); });
    box(van, 0, 1.15, 0, 4.4, 1.7, 2.0, 0xf4f4f0); box(van, 2.5, .8, 0, 1.2, 1.0, 1.9, 0xf4f4f0); box(van, 2.2, 1.55, 0, .8, .7, 1.8, 0x7fbfe8, { m: { roughness: .1, metalness: .3 } }); box(van, 3.12, .55, 0, .06, .3, 1.7, 0x2a2a30); box(van, 1.0, 1.95, 0, 1.1, .22, .5, 0xe8252b); box(van, .6, 2.05, 0, .35, .12, .35, 0xffb000);
    for (const sz of [-1, 1]) { plane(van, 3.8, 1.9, side.t, -.1, 1.15, sz * 1.012, { ry: sz > 0 ? 0 : Math.PI }); for (const wx of [-1.3, 2.3]) { const w = cyl(van, wx, .45, sz * .95, .45, .3, 0x16161a, { rx: Math.PI / 2 }); cyl(van, wx, .45, sz * 1.1, .22, .06, 0xc8ccd4, { rx: Math.PI / 2 }); } }
    van.position.set(VX, 0, -2.2); }
  // road
  { const rd = new THREE.Mesh(new THREE.PlaneGeometry(40, 8), mat(0x3a3d44)); rd.rotation.x = -Math.PI / 2; rd.position.set(VX, 0, -2.0); rd.receiveShadow = true; S.add(rd); for (let i = 0; i < 12; i++) box(S, VX - 18 + i * 3.4, .005, -2.0, 1.6, .02, .16, 0xf2d24a, { cast: false }); box(S, VX, .05, 2.4, 40, .12, 1.2, 0xb9b2a4, { cast: false }); tree(S, VX - 7, 6, 1.6, 4); tree(S, VX + 6, 7, 1.8, 9); }
  // ------------------------------------------------------------------ tent + sign (beat 5)
  const tent = new THREE.Group(); tent.position.set(-3.6, 0, 2.2); S.add(tent);
  { const cone = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.6, 4, 1), new THREE.MeshStandardMaterial({ color: 0xf08a24, roughness: .9, flatShading: true })); cone.rotation.y = Math.PI / 4; cone.position.y = .8; cone.castShadow = true; tent.add(cone); const fl = new THREE.Mesh(new THREE.PlaneGeometry(.7, 1.0), mat(0x2a1c10)); fl.position.set(0, .55, 1.12); fl.rotation.x = -.2; tent.add(fl); box(tent, 0, .015, 0, 3.6, .02, 3.6, 0x4a8a3a, { cast: false }); box(tent, 0, 1.7, 0, .05, .4, .05, 0xcccccc); box(tent, -.52, 1.58, 0, .03, .3, .3, 0xe8252b); }
  const sign = new THREE.Group(); sign.position.set(1.5, 0, HZ + .04); S.add(sign);
  { const st = cvs(768, 384, (g, w, h) => { g.fillStyle = '#16365a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f2d24a'; g.lineWidth = 12; g.strokeRect(14, 14, w - 28, h - 28); txt(g, 'GREAT LANDLORD', w / 2, 70, 76, '#fff'); txt(g, '5.0  (1 review)', w / 2, 330, 58, '#f2d24a'); txt(g, '"won\'t leave."', w / 2, 255, 42, '#cfe3ff', { w: 700 }); });
    box(sign, 0, 2.0, .03, 3.0, 1.5, .06, 0x2a1c10); plane(sign, 2.9, 1.45, st.t, 0, 2.0, .065);
    const sh = new THREE.Shape(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .17 : .4; i ? sh.lineTo(Math.cos(a) * r, Math.sin(a) * r) : sh.moveTo(Math.cos(a) * r, Math.sin(a) * r); } sh.closePath();
    var stars = []; for (let i = 0; i < 5; i++) { const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: 0xffc81e })); m.position.set(-1.08 + i * .54, 2.08, .09); m.scale.setScalar(.001); sign.add(m); stars.push(m); } }
  // lounge chair on porch for raccoon
  
  const porch = new THREE.Group(); S.add(porch); box(porch, -1.15, .28, -2.5, .7, .1, .7, 0x3a8ad8); box(porch, -1.15, .6, -2.85, .7, .6, .1, 0x3a8ad8); box(porch, -1.43, .14, -2.5, .08, .28, .6, 0x2a5a98); box(porch, -.87, .14, -2.5, .08, .28, .6, 0x2a5a98); const drink = new THREE.Group(); cyl(drink, 0, 0, 0, .06, .16, 0xffe85a); cyl(drink, 0, .1, 0, .07, .03, 0xffd000); box(drink, .03, .16, 0, .015, .12, .015, 0xff5a8a); S.add(drink); drink.position.set(-.45, .34, -2.45); box(porch, -.45, .15, -2.45, .35, .05, .35, 0x7a4e28); porch.add(drink);
  // rent envelope + cash
  const env = new THREE.Group(); { const et = cvs(256, 160, (g, w, h) => { g.fillStyle = '#f6f2e6'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9c0a8'; g.lineWidth = 4; g.strokeRect(2, 2, w - 4, h - 4); g.beginPath(); g.moveTo(2, 2); g.lineTo(w / 2, 70); g.lineTo(w - 2, 2); g.stroke(); txt(g, 'RENT', w / 2, 92, 42, '#c0281c'); txt(g, '$5', w / 2, 136, 40, '#1a6a2a'); }); const m = new THREE.Mesh(new THREE.BoxGeometry(.5, .31, .02), [mat(0xf6f2e6), mat(0xf6f2e6), mat(0xf6f2e6), mat(0xf6f2e6), new THREE.MeshStandardMaterial({ map: et.t }), mat(0xf6f2e6)]); m.castShadow = true; env.add(m);
    const bt = cvs(128, 64, (g, w, h) => { g.fillStyle = '#6fcf6a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2a7a2a'; g.lineWidth = 4; g.strokeRect(4, 4, w - 8, h - 8); txt(g, '5', w / 2, 34, 44, '#1a5a1a'); }); const bill = new THREE.Mesh(new THREE.BoxGeometry(.3, .15, .008), new THREE.MeshStandardMaterial({ map: bt.t })); bill.position.set(.1, .21, -.02); bill.rotation.z = -.35; env.add(bill); env.scale.setScalar(1.1); S.add(env); env.visible = false; }
  // ------------------------------------------------------------------ camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3();
  const rig = (lt, shots, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    E.set(lerp(s[1][0], s[2][0], u), lerp(s[1][1], s[2][1], u), lerp(s[1][2], s[2][2], u)); T2.set(lerp(s[3][0], s[4][0], u), lerp(s[3][1], s[4][1], u), lerp(s[3][2], s[4][2], u)); E.x += Math.sin(t * .9) * .015 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .012 + Math.cos(t * 57) * shake; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .006); };
  const d3 = (x, y, z) => [x, y, z];
  const lb = (s, on, pos, k = 1, w = 1.2, h = .34) => { s.visible = on; if (on) { s.position.copy(pos); const a = clamp(k); s.scale.set(w * a, h * a, 1); } };
  // ------------------------------------------------------------------ frame
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    let shock = false, keysLost = 0, note = '', beltOn = true, capsOn = false, wandOn = false, handKeysOn = false, ratOn = false, spareOn = false, envOn = false, doorA = 0, matLift = 0, shake = 0, lampI = 0;
    [G1, G2, OFF].forEach(hide); beltKeys.visible = false; ratKeys.visible = false; spare.visible = false; handKeys.visible = false; rac.visible = false; env.visible = false; wand.visible = false; badge.visible = false; qmarks.forEach((s) => { s.visible = false; });
    plusA.forEach((s) => { s.visible = false; }); lbBetter.visible = false; lbClever.visible = false; beeps.forEach((s) => { s.visible = false; }); stars.forEach((s) => s.scale.setScalar(.001));
    van.visible = bi === 4 || true; door.rotation.y = 0; matG.rotation.x = 0; porch.visible = bi === 5; sign.visible = bi === 5;
    let camShots = null; let camShake = 0; let beepN = 0;
    const patArms = (o, k, ph = 0) => { const s = Math.sin(lt * 21 + ph) * .1; o.arms = { lx: -.28 + s, lz: .3 * k, rx: -.28 - s, rz: -.3 * k }; };
    const upd = (v) => { shock = v; };
    if (bi === 0) {
      place(YOU, 0, 0, 1.0, 0, 'idle', .3); YOU.arms = REST();
      const pat = lt < 1.9; const m = lt < 1.9 ? (lt > .2 ? 1 : 0) : 0;
      if (pat) { YOU.arms = { lx: -.28 + Math.sin(lt * 20) * .12, lz: .36 + Math.sin(lt * 20 + 1) * .1, rx: -.28 - Math.sin(lt * 20) * .12, rz: -.36 }; if (lt > 1.05 && lt < 1.3) YOU.arms = { lx: -.3 + Math.sin(lt * 20) * .1, lz: .38, rx: -.3, rz: -.38 }; YOU.pitch = .06; YOU.extra = 0; }
      shock = lt > .35 && lt < 1.9; keysLost = lt > .35 ? (lt > .85 ? (lt > 1.35 ? 3 : 2) : 1) : 0; note = lt < 2.0 ? 'where are they' : 'attached.';
      // keys in left hand then clip on belt
      if (lt >= 1.7 && lt < 2.6) { const k = smooth((lt - 1.7) / .9); YOU.arms = { lx: lerp(-.28, -.9, Math.sin(k * Math.PI)), lz: lerp(.36, .25, k), rx: -.28, rz: -.36 }; handKeysOn = true; }
      beltOn = true; keysLost = Math.max(keysLost, 0);
      [.35, .85, 1.35].forEach((st, k) => { const l = lt - st; const on = l > 0 && l < .75; plusA[k].visible = on; if (on) { plusA[k].position.set(.55 + (k - 1) * .22, 1.9 + l * .8, 1.2); const a = Math.min(1, l * 6); plusA[k].scale.set(.5 * a, .25 * a, 1); plusA[k].material.opacity = 1 - l / .75; } });
      camShots = [[0, d3(2.4, 1.3, 5.6), d3(1.9, 1.25, 5.0), d3(0, .9, 1), d3(0, .9, 1), 40, 38], [1.8, d3(1.3, 1.0, 3.3), d3(.95, .95, 2.8), d3(.1, .85, 1), d3(.12, .8, 1), 32, 28]];
      if (lt > 2.6) YOU.arms = { lx: -.15, lz: -.08, rx: -.15 + Math.sin(lt * 7) * .0, rz: .15 };
      faceYes();
    } else if (bi === 1) {
      const w = clamp(lt / 1.3); const zz = lerp(4.5, .3, w); const walking = lt < 1.3; const turn = smooth((lt - 1.15) / .45);
      place(YOU, GX, 0, walking ? zz : .3, lerp(Math.PI, Math.PI / 2, turn), walking ? 'walk' : 'idle', walking ? .45 : .3); YOU.arms = walking ? null : REST(); if (!walking) YOU.arms = { lx: -.35, lz: -.55, rx: -.35, rz: .55 };
      place(G1, GX + 1.5, 0, -1.4, 0, 'idle', .3); faceTo(G1, GX, .3); place(G2, GX - 2.2, 0, -2.4, 0, 'idle', .3); faceTo(G2, GX, .3); G2.arms = { lx: -1.2, lz: -.7, rx: -1.2, rz: .7 };
      capsOn = true; shock = lt > 1.45; const al = lt > 1.4; lampI = al ? (Math.sin(lt * 24) > -.1 ? 1 : .2) : 0; wandOn = true;
      const sw = Math.sin(lt * 7); G1.arms = { lx: -.15, lz: -.1, rx: lt > 1.7 ? -1.45 + sw * .3 : -.3, rz: lt > 1.7 ? -.25 : .1 };
      beepN = al ? Math.floor((lt - 1.3) / .16) + 1 : 0; keysLost = 3; note = beepN ? 'BEEPS: ' + beepN : 'walking in';
      beeps.forEach((s, j) => { const kk = beepN - 1; const k = kk - ((((kk - j) % 8) + 8) % 8); const l = lt - (1.3 + k * .16); const on = beepN > 0 && k >= 0 && l >= 0 && l < .65; s.visible = on; if (on) { const a = Math.min(1, l * 7) * (l > .5 ? 1 - (l - .5) / .15 : 1); const sx = (cr(k, 3) - .5) * 1.7; s.position.set(GX + .8, 2.7 + l * .7 + (k % 3) * .35, sx); s.scale.set(1.3 * a, .65 * a, 1); } });
      camShots = [[0, d3(GX + 9.5, 1.7, 4.2), d3(GX + 8.2, 1.6, 2.2), d3(GX, 1.4, -.3), d3(GX, 1.5, -.2), 46, 44], [1.9, d3(GX + 7.0, 1.9, 1.6), d3(GX + 6.0, 1.7, 1.2), d3(GX, 1.5, -.2), d3(GX, 1.3, -.1), 42, 38], [3.3, d3(GX + 4.4, 1.3, 1.2), d3(GX + 3.8, 1.2, 1.0), d3(GX, 1.0, -.1), d3(GX, .95, 0), 36, 32]];
      camShake = al ? .004 : 0;
    } else if (bi === 2) {
      const lift = lt > 3.9 ? smooth((lt - 3.9) / .35) : 0; matLift = lift * .0;
      // you place the key then step aside
      const bendU = smooth(lt / .6) * (1 - smooth((lt - 1.2) / .4)); const moveU = smooth((lt - 1.9) / .7);
      place(YOU, lerp(.3, -1.7, moveU), .12, lerp(-2.6, -1.55, moveU), lerp(0, Math.PI / 2 - .35, moveU), 'idle', .3);
      YOU.pitch = .95 * bendU; YOU.arms = lt < 1.9 ? { lx: -.2, lz: -.05, rx: -.3 * bendU, rz: .1 } : REST(); if (lt < 1.9) YOU.arms.rx = lerp(-.1, -.2, bendU);
      if (lt >= 1.9) { const th = smooth((lt - 2.2) / .3) * (1 - smooth((lt - 3.3) / .3)); YOU.arms = { lx: -.15, lz: -.1, rx: lerp(-.1, -2.2, th), rz: .1 }; }
      const peek = lt > 1.0; spareOn = true; const slide = lt < 1.0 ? 0 : 1;
      spare.visible = true; const hand = lt < .95 ? hp(YOU, 'handR') : null;
      if (hand) { spare.position.copy(hand); spare.position.y = Math.max(.16, spare.position.y); spare.position.z += .05; } else { spare.position.set(-.05, .14, MATZ + .46); }
      keysLost = 3 + (lt > 4.3 ? 1 : 0); note = lt < 3 ? 'spare: hidden' : lt < 4.3 ? 'spare: hidden (well)' : 'spare: found'; shock = lt > 3.2;
      lb(lbBetter, lt > 2.55 && lt < 3.7, V3(0, 2.7, MATZ - .6), Math.min(1.1, (lt - 2.55) * 5) * 1.25, 1.6, .46);
      // raccoon: walks in along z=-2.0 facing -x, turns to camera, grabs key, lifts it
      const rx0 = lt < 3.6 ? lerp(3.4, .25, smooth((lt - 2.9) / .7)) : .25; const walkP = lt > 2.9 && lt < 3.6;
      const turnU = smooth((lt - 3.55) / .3); const rYaw = lerp(-Math.PI / 2, 0, turnU);
      if (lt > 2.9) { ratOn = true; const grab = smooth((lt - 3.9) / .3); const lift = smooth((lt - 4.3) / .45); const al = lerp(lerp(0, -.7, grab), -3.0, lift), ar = al;
        poseRac({ x: rx0, y: .16, z: MATZ - .15, yaw: rYaw, s: 1.15, th: lerp(-.05, -.45 - .5 * lift, turnU), al, ar, alz: .12, arz: -.12, walk: walkP ? lt * 22 : 0, tw: lt * 6, tail: .3 + lift * .3, hx: lt > 3.6 && lt < 4.3 ? .3 : 0, vis: true }); }
      if (lt > 4.25) { ratKeys.visible = true; spare.visible = false; const pw = RU.pawL.getWorldPosition(new THREE.Vector3()); const pw2 = RU.pawR.getWorldPosition(new THREE.Vector3()); ratKeys.position.set((pw.x + pw2.x) / 2, (pw.y + pw2.y) / 2 + .22, (pw.z + pw2.z) / 2 + .06); ratKeys.rotation.set(0, 0, Math.sin(lt * 14) * .25); }
      camShots = [[0, d3(2.9, 2.5, 1.9), d3(2.5, 2.3, 1.5), d3(0, .6, -2.1), d3(0, .6, -2.1), 40, 36], [2.0, d3(2.3, 2.1, 1.1), d3(1.9, 2.0, .9), d3(0, .7, MATZ), d3(0, .75, MATZ), 38, 36], [3.3, d3(3.2, 2.1, 1.8), d3(2.4, 1.9, 1.4), d3(.05, .8, -2.0), d3(0, .95, -2.0), 40, 38]];
    } else if (bi === 3) {
      doorA = -1.9 * smooth(lt / .7);
      place(YOU, -1.1, .12, -1.5, 1.0, 'idle', .3); YOU.arms = REST(); shock = lt > .8;
      const tk = smooth((lt - 3.0) / .5); // you reach for the envelope
      YOU.arms = { lx: -.15, lz: -.1, rx: lerp(-.15, -1.45, tk) + Math.sin(lt * 3) * .0, rz: .1 }; if (lt > 3.3) { YOU.arms.rx = -1.45; }
      ratOn = true; const ext = smooth((lt - 2.2) / .5); const bob = Math.sin(lt * 7) * .03 * (lt > 2.2 ? 1 : 0);
      poseRac({ x: 0, y: .12 + bob, z: -2.5, yaw: lerp(0, .15, 1), s: 1.4, th: -1.2, al: -1.1 + ext * -.5, alz: 0, ar: lerp(-.5, -1.55, ext), arz: -.2 * ext, tail: .3, tw: lt * 5, walk: 0, hx: .1, vis: lt > .5 });
      ratKeys.visible = lt > .5; { const pw = RU.pawL.getWorldPosition(new THREE.Vector3()); ratKeys.position.set(pw.x, pw.y + .1, pw.z + .06); ratKeys.rotation.set(0, 0, Math.sin(lt * 10) * .3); }
      env.visible = lt > .5; { const pw = RU.pawR.getWorldPosition(new THREE.Vector3()); env.position.set(pw.x + .05, pw.y + .06, pw.z + .1); env.rotation.set(-.15, 0, Math.sin(lt * 4) * .05 - .1); }
      keysLost = 4; note = lt < 2.4 ? 'new tenant: raccoon' : 'rent paid: $5'; if (lt > 3.6) note = 'rent paid: $5. in cash.';
      camShots = [[0, d3(3.8, 2.1, 2.4), d3(3.3, 1.9, 2.0), d3(-.5, 1.0, -2.0), d3(-.5, 1.0, -2.0), 42, 40], [2.0, d3(3.0, 1.6, 1.6), d3(2.5, 1.4, 1.2), d3(-.45, .95, -2.0), d3(-.45, .95, -2.0), 38, 34]];
      lampI = 1;
    } else if (bi === 4) {
      const vx = lt < 1.5 ? lerp(VX - 11, VX - 1.6, 1 - Math.pow(1 - clamp(lt / 1.5), 2)) : VX - 1.6; van.position.x = vx; van.position.z = -2.2;
      const outU = smooth((lt - 1.2) / .35); place(OFF, VX + 1.0, 0, lerp(-.9, 1.3, outU), 0, 'idle', .3); OFF.vis = lt > 1.1; capsOn = true; badge.visible = OFF.vis;
      OFF.arms = REST(); shock = lt > 2.45;
      if (lt > 2.2 && lt < 3.2) { OFF.arms = { lx: -.28 + Math.sin(lt * 20) * .12, lz: .36, rx: -.28 - Math.sin(lt * 20) * .12, rz: -.36 }; }
      if (lt >= 3.2) { const sr = smooth((lt - 3.2) / .3); OFF.arms = { lx: -.5, lz: lerp(.36, -.95, sr), rx: -.5, rz: lerp(-.36, .95, sr) }; }
      place(YOU, VX + 3.0, 0, 2.2, -2.5, 'idle', .3); YOU.arms = REST(); YOU.vis = lt > .3;
      if (lt > 3.3) YOU.arms = { lx: -2.4, lz: -.2, rx: -2.4, rz: .2 };
      keysLost = lt > 2.45 ? (lt > 2.95 ? 6 : 5) : 4; note = lt < 2.2 ? 'animal control: arrived' : lt < 3.2 ? 'animal control: keys?' : 'animal control: no keys';
      [2.3, 2.75].forEach((st, k) => { const l = lt - st; const on = l > 0 && l < .75; plusA[k].visible = on; if (on) { plusA[k].position.set(VX + 1.7 + k * .15, 2.1 + l * .7, 1.3); const a = Math.min(1, l * 6); plusA[k].scale.set(.5 * a, .25 * a, 1); plusA[k].material.opacity = 1 - l / .75; } });
      qmarks.forEach((s, k) => { const st = 3.3 + k * .12; const l = lt - st; const on = l > 0; s.visible = on; if (on) { const a = Math.min(1, l * 6); s.position.set(VX + 1.0 + (k - 1) * .75, 2.7 + (k === 1 ? .15 : 0) + Math.sin(lt * 5 + k) * .04, 1.3); s.scale.set(.9 * a, .45 * a, 1); } });
      camShots = [[0, d3(VX - 1, 1.5, 7.5), d3(VX + .5, 1.5, 6.5), d3(VX - 4, 1.0, -2), d3(VX - 1, 1.0, -2), 46, 42], [1.5, d3(VX + 1.6, 1.4, 5.6), d3(VX + 1.2, 1.35, 5.0), d3(VX + 1.0, 1.15, 1.3), d3(VX + 1.0, 1.1, 1.3), 40, 36]];
    } else {
      place(YOU, -3.6 + 1.2, .0, 2.4, 1.5, 'sit', .3); YOU.arms = { lx: -.9, lz: .5, rx: -.9, rz: -.5 }; YOU.pitch = .2 + Math.sin(lt * 25) * .01; shock = false;
      if (lt > 3.4) YOU.arms = { lx: -2.6, lz: -.3, rx: -.9, rz: -.5 };
      ratOn = true; poseRac({ x: -1.15, y: .4, z: -2.5, yaw: 0, s: 1.4, th: -.95, al: -.6 + Math.sin(lt * 5) * .0, ar: lt > 2.6 ? -2.8 + Math.sin(lt * 9) * .35 : -.5, alz: .25, arz: -.2, tail: .5, tw: lt * 3, shades: true, hx: -.05 });
      const sl = (i) => smooth((lt - (3.2 + i * .14)) / .22); stars.forEach((s, i) => s.scale.setScalar(Math.max(.001, .75 * sl(i) * (1 + .25 * Math.sin(clamp((lt - (3.2 + i * .14)) / .3) * Math.PI)))));
      keysLost = 6; note = lt < 1.5 ? 'weather: tent' : lt < 3.2 ? 'house: occupied' : 'house reviews: 5.0'; if (lt > 4.1) note = 'house reviews: 5.0 stars';
      camShots = [[0, d3(-.2, 1.7, 8.8), d3(-.9, 1.6, 8.0), d3(-3.0, 1.0, 2.3), d3(-3.0, 1.0, 2.3), 40, 38], [1.55, d3(-.3, 1.5, 5.0), d3(-.6, 1.45, 4.3), d3(-1.0, .85, -2.5), d3(-1.05, .9, -2.5), 38, 36], [3.0, d3(.2, 2.0, 9.4), d3(.4, 2.0, 8.2), d3(.5, 1.7, -3), d3(.6, 1.8, -3), 46, 42]];
    }
    function faceYes() {}
    // ---- crowd update & attachments
    crowd.setFace(shock ? 'shock' : 'calm'); crowd.update(t);
    door.rotation.y = doorA;
    S.userData.lamp.intensity = 5; lampM.emissiveIntensity = lampI * 3; ledM.forEach((m, i) => { m.emissiveIntensity = lampI * (i % 2 ? 3 : 2.4); }); lampPt.intensity = lampI * 60;
    // belt + keys on YOU
    belt.visible = beltOn && YOU.vis; if (belt.visible) { attach(belt, YOU, 'torso', [0, -.285, 0]); belt.visible = YOU.vis; }
    const clipped = bi > 0 || lt > 2.3; if (YOU.vis && beltOn && clipped && bi !== 3) { beltKeys.visible = true; const sw = bi === 1 ? Math.sin(lt * 18) * .2 : Math.sin(lt * 3) * .06; attach(beltKeys, YOU, 'torso', [.24, -.3, .2], [-.05, 0, sw]); beltKeys.visible = true; }
    if (handKeysOn) { handKeys.visible = true; attach(handKeys, YOU, 'handL', [0, -.1, .1], [0, 0, Math.sin(lt * 14) * .3]); handKeys.visible = true; }
    if (capsOn) { if (bi === 1) { attach(cap1, G1, 'head', [0, .26, 0]); attach(cap2, G2, 'head', [0, .26, 0]); cap1.visible = cap2.visible = true; } if (bi === 4) { attach(capO, OFF, 'head', [0, .26, 0]); capO.visible = OFF.vis; attach(badge, OFF, 'torso', [.17, .12, .17]); badge.visible = OFF.vis; } } else { cap1.visible = cap2.visible = capO.visible = false; }
    if (bi !== 1) { cap1.visible = cap2.visible = false; } if (bi !== 4) capO.visible = false;
    if (wandOn) { attach(wand, G1, 'handR', [0, 0, 0], [.3, 0, 0]); wand.visible = true; }
    rac.visible = ratOn; if (!ratOn) { ratKeys.visible = false; }
    // ---- camera
    rig(lt, camShots, t, camShake);
    A.follow(bi === 1 ? GX : bi === 4 ? VX : 0, 0); A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    hud.counter('KEYS LOST', String(Math.round(keysLost)), note, '', keysLost > 0);
    hud.tm(''); hud.pop('', 0);
  } };
}
