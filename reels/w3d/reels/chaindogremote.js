// 693 invention chain: dog keeps stealing the remote. shelf -> pillow tower -> freezer (spoon) -> safe (dog sits on it) -> nose on the TV -> dog documentary -> it cries -> tissue.
// The DOG is the star: a canvas-drawn face (eyes, lids, brows, mouth, tear) that changes expression every beat.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, mat, Crowd, Particles, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0xe9dcc6, fogNear: 60, fogFar: 210, clouds: false, skyTop: 0xdfd3bd, skyMid: 0xe9dcc6, skyBot: 0xefe4d0, shadowExtent: 11, shadowRes: 2048, hemi: 1.55, sunI: 1.5, sunDir: [-.3, .9, .6], exposure: 1.12 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t, w, h }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const rbox = (w, h, d, c, o = {}) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * (o.r ?? .2)), o.mat || mat(c, o.m || {})); m.castShadow = o.cast !== false; m.receiveShadow = true; return m; };
  const box = (par, x, y, z, w, h, d, c, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.mat || mat(c, o.m || {})); m.position.set(x, y, z); if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.rx) m.rotation.x = o.rx; m.castShadow = o.cast !== false; m.receiveShadow = true; par.add(m); return m; };
  const put = (par, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); par.add(m); return m; };
  const grp = (x, y, z, par = S) => { const g = new THREE.Group(); g.position.set(x, y, z); par.add(g); return g; };
  const flat = (par, w, d, color, x, y, z, map) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), map ? new THREE.MeshStandardMaterial({ map, roughness: 1 }) : mat(color, { roughness: 1 })); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; par.add(m); return m; };
  const mkLabel = (text, c1, c2, w = 640, size = 110) => { const l = cvs(w, 180, (g, ww) => { txt(g, text, ww / 2, 92, size, c1, { stroke: c2, sw: 22 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; s.userData.ar = w / 180; S.add(s); return s; };
  const lbShow = (s, on, pos, h = .5, a = 1) => { s.visible = on && a > .01; if (!s.visible) return; s.position.copy(pos); const k = clamp(a); s.scale.set(h * s.userData.ar * k, h * k, 1); };
  const ease = (a, b, t) => clamp((t - a) / (b - a));
  const sm = (a, b, t) => smooth(ease(a, b, t));

  const M = grp(0, 0, 0), TX = 100, T = grp(TX, 0, 0);
  // ---------------------------------------------------------------- shared room shell (a set per location)
  const woodT = cvs(512, 512, (g, w) => { g.fillStyle = '#b98a55'; g.fillRect(0, 0, w, w); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#aa7b47' : '#c4965f'; g.fillRect(0, i * 64, w, 62); g.fillStyle = 'rgba(60,35,15,.4)'; g.fillRect(0, i * 64 + 62, w, 2); for (let j = 0; j < 3; j++) g.fillRect((cr(i, 70 + j) * w) | 0, i * 64, 2, 62); } }); woodT.t.wrapS = woodT.t.wrapT = THREE.RepeatWrapping; woodT.t.repeat.set(4, 2.4);
  const wallT = cvs(256, 256, (g, w) => { g.fillStyle = '#e8d4b4'; g.fillRect(0, 0, w, w); for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(${cr(i, 5) < .5 ? '255,255,255' : '120,80,40'},${.03 + cr(i, 6) * .04})`; g.fillRect(cr(i, 7) * w, cr(i, 8) * w, 2 + cr(i, 9) * 5, 2 + cr(i, 10) * 5); } }); wallT.t.wrapS = wallT.t.wrapT = THREE.RepeatWrapping; wallT.t.repeat.set(4, 1.2);
  const shell = (G) => {
    flat(G, 18, 12, 0, 0, 0, 0, woodT.t);
    const wm = new THREE.MeshStandardMaterial({ map: wallT.t, roughness: 1 });
    const bw = new THREE.Mesh(new THREE.BoxGeometry(18, 4.6, .2), wm); bw.position.set(0, 2.3, -3.3); bw.receiveShadow = true; G.add(bw);
    for (const s of [-1, 1]) { const sw = new THREE.Mesh(new THREE.BoxGeometry(.2, 4.6, 12), wm); sw.position.set(s * 9, 2.3, 2.7); sw.receiveShadow = true; G.add(sw); }
    box(G, 0, .1, -3.17, 18, .2, .08, 0xf6efe0, { cast: false });
    const ceil = new THREE.Mesh(new THREE.BoxGeometry(18, .2, 12), mat(0xf3ead8)); ceil.position.set(0, 4.7, 2.7); G.add(ceil);
  };
  shell(M); shell(T);
  // ---------------------------------------------------------------- M set: shelf, window, couch, fridge, safe, pillows, lamp
  const SHX = -.7, SHY = 1.98;
  { box(M, SHX, SHY - .04, -2.95, 2.0, .09, .5, 0x7a4a28); for (const s of [-1, 1]) box(M, SHX + s * .85, SHY - .22, -3.0, .09, .3, .3, 0x5a3718);
    const bk = [0xc8452e, 0x2f6fb5, 0xe3b53a, 0x3f9a58, 0x8a4aa0]; for (let i = 0; i < 5; i++) box(M, SHX - .9 + i * .1, SHY + .17 + (i % 2) * .03, -3.0, .08, .34 + (i % 2) * .06, .3, bk[i]);
    const pl = new THREE.Mesh(new THREE.CylinderGeometry(.1, .08, .16, 10), mat(0xc4673a)); pl.position.set(SHX + .75, SHY + .09, -2.95); M.add(pl); for (let i = 0; i < 5; i++) { const lf = rbox(.06, .22, .03, 0x3f9a58); lf.position.set(SHX + .75 + Math.sin(i * 2) * .06, SHY + .28, -2.95); lf.rotation.z = Math.sin(i * 2) * .5; M.add(lf); } }
  { const wx = 3.6; box(M, wx, 2.5, -3.17, 2.0, 1.7, .06, 0xffffff); box(M, wx, 2.5, -3.12, 1.8, 1.5, .04, 0xaee0f5); box(M, wx, 2.5, -3.1, .05, 1.5, .04, 0xffffff); box(M, wx, 2.5, -3.1, 1.8, .05, .04, 0xffffff); }
  { box(M, -3.2, 2.8, -3.17, 1.2, .9, .05, 0x5a3718); box(M, -3.2, 2.8, -3.13, 1.05, .75, .04, 0xf4d28c); box(M, -3.2, 2.7, -3.1, .4, .35, .02, 0xe0762e, { rz: .4 }); }
  flat(M, 6.2, 3.6, 0x3d6aa8, -1.4, .006, .4); flat(M, 5.6, 3.0, 0xf1deb4, -1.4, .008, .4);
  // couch (right side), faces +z
  const CX = 3.45, CZ = -2.0;
  { const C = grp(CX, 0, CZ, M); const cm = 0x4f78c0, cd = 0x37599a; box(C, 0, .22, 0, 3.4, .44, 1.5, cd); box(C, -.85, .56, .15, 1.6, .26, 1.1, cm); box(C, .85, .56, .15, 1.6, .26, 1.1, cm); box(C, 0, 1.0, -.65, 3.4, 1.05, .35, cd); box(C, -1.75, .64, .1, .32, .8, 1.4, cd); box(C, 1.75, .64, .1, .32, .8, 1.4, cd); }
  // fridge (left), freezer at the bottom, door swings out toward camera
  const FRX = -6.1, FRZ = -2.45, FRW = 1.5, FD = .95;
  const frost = 0xcfe6f2;
  { const F = grp(FRX, 0, FRZ, M); const sd = 0xe6e9ee;
    box(F, 0, 2.05, 0, FRW, 3.1, FD, sd, { m: { metalness: .25, roughness: .35 } }); // upper fridge (solid)
    box(F, 0, 2.05, FD / 2 + .02, FRW - .06, 3.05, .05, 0xf2f4f7, { m: { metalness: .3, roughness: .3 } }); box(F, .55, 2.5, FD / 2 + .08, .06, 1.1, .08, 0x8a929c, { m: { metalness: .7 } });
    const fz = 1.35; // freezer cavity bottom 0..1.35
    box(F, 0, .04, 0, FRW, .08, FD, sd); box(F, 0, 1.31, 0, FRW, .08, FD, sd); box(F, -FRW / 2 + .04, .68, 0, .08, 1.27, FD, sd); box(F, FRW / 2 - .04, .68, 0, .08, 1.27, FD, sd); box(F, 0, .68, -FD / 2 + .04, FRW, 1.27, .08, 0xdff1fa);
    box(F, 0, .68, 0, FRW - .2, .04, FD - .2, frost, { m: { roughness: .4 } }); // inner shelf
    box(F, -.45, .3, .05, .5, .22, .4, 0xffffff, { m: { roughness: .3 } }); box(F, .5, .98, -.1, .45, .3, .35, 0xffd6a0);
    const lamp = new THREE.PointLight(0xbfe6ff, 0, 4.5); lamp.position.set(0, .7, .3); F.add(lamp); F.userData.lamp = lamp;
    const doorPiv = grp(FRW / 2 - .02, 0, FD / 2 + .02, F); const door = new THREE.Group(); doorPiv.add(door);
    box(door, -FRW / 2 + .02, .68, .04, FRW - .04, 1.25, .1, 0xf2f4f7, { m: { metalness: .3, roughness: .3 } }); box(door, -FRW + .2, .95, .13, .07, .5, .08, 0x8a929c, { m: { metalness: .7 } });
    const ft = cvs(256, 64, (g, w, h) => { g.fillStyle = '#7fb8e6'; g.fillRect(0, 0, w, h); txt(g, '❄ FREEZER', w / 2, 34, 38, '#fff', { stroke: '#2b6ea8', sw: 8 }); }); const fl = new THREE.Mesh(new THREE.PlaneGeometry(.9, .22), new THREE.MeshBasicMaterial({ map: ft.t })); fl.position.set(-FRW / 2 + .1, 1.12, .095); door.add(fl);
    M.userData.F = F; M.userData.door = doorPiv; }
  const fridgeG = M.userData.F, doorPiv = M.userData.door;
  // remote
  const REM = new THREE.Group(); { const b = rbox(.1, .04, .3, 0x1c1f26, { r: .3 }); REM.add(b); put(REM, rbox(.06, .02, .05, 0xe5301e), 0, .025, -.1); for (let i = 0; i < 6; i++) put(REM, rbox(.025, .015, .025, [0xdddddd, 0x4aa3df, 0x6cc070, 0xf3c13a][i % 4]), -.025 + (i % 2) * .05, .022, -.03 + Math.floor(i / 2) * .055); REM.scale.setScalar(1.5); S.add(REM); }
  const remoteTo = (par, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => { REM.matrixAutoUpdate = true; REM.parent && REM.parent.remove(REM); par.add(REM); REM.position.set(x, y, z); REM.rotation.set(rx, ry, rz); REM.scale.setScalar(par === dogP.head ? .55 : 1.5); REM.visible = true; };
  // spoon
  const SPN = new THREE.Group(); { const hd = rbox(.06, .05, 1.1, 0xc9ced6, { r: .5, m: { metalness: .85, roughness: .25 } }); SPN.add(hd); const bw = new THREE.Mesh(new THREE.SphereGeometry(.2, 16, 12), mat(0xd7dce3, { metalness: .85, roughness: .2 })); bw.scale.set(.85, .32, 1.1); bw.position.z = .66; bw.castShadow = true; SPN.add(bw); SPN.visible = false; S.add(SPN); }
  // pillows & lamp
  const PILC = [0xe85d75, 0x4aa3df, 0xf3c13a, 0x6cc070]; const pillows = PILC.map((c) => { const p = rbox(.95, .3, .95, c, { r: .45 }); p.castShadow = true; M.add(p); return p; });
  const lampG = new THREE.Group(); { put(lampG, new THREE.Mesh(new THREE.CylinderGeometry(.2, .24, .1, 16), mat(0x3a3a3a)), 0, .05, 0); put(lampG, new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .5, 8), mat(0xc9a64a, { metalness: .6 })), 0, .33, 0); put(lampG, new THREE.Mesh(new THREE.CylinderGeometry(.2, .34, .36, 18, 1, true), new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffd88a, emissiveIntensity: .5, side: THREE.DoubleSide })), 0, .72, 0); lampG.traverse((o) => { o.castShadow = true; }); M.add(lampG); }
  // safe (faces +z)
  const SAFE = grp(0, 0, 0, M); const safeDoor = new THREE.Group();
  { box(SAFE, 0, .5, 0, 1.0, 1.0, .9, 0x6b737e, { m: { metalness: .6, roughness: .4 } }); box(SAFE, 0, .5, .05, .8, .8, .8, 0x2a2d33);
    safeDoor.position.set(-.5, .5, .46); SAFE.add(safeDoor);
    const sg = cvs(256, 256, (g, w) => { g.fillStyle = '#7d8591'; g.fillRect(0, 0, w, w); g.strokeStyle = '#4a515b'; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, w - 20); txt(g, 'SAFE', w / 2, 52, 64, '#2b3038'); g.fillStyle = '#c8cdd4'; g.beginPath(); g.arc(128, 150, 52, 0, 7); g.fill(); g.strokeStyle = '#2b3038'; g.lineWidth = 6; g.stroke(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.beginPath(); g.moveTo(128 + Math.cos(a) * 40, 150 + Math.sin(a) * 40); g.lineTo(128 + Math.cos(a) * 49, 150 + Math.sin(a) * 49); g.stroke(); } g.fillStyle = '#c22'; g.fillRect(124, 98, 8, 18); });
    const dp = new THREE.Mesh(new THREE.BoxGeometry(.96, .96, .1), [mat(0x6b737e), mat(0x6b737e), mat(0x6b737e), mat(0x6b737e), new THREE.MeshStandardMaterial({ map: sg.t, roughness: .4, metalness: .5 }), mat(0x6b737e)]); dp.position.set(.48, 0, 0); dp.castShadow = true; safeDoor.add(dp);
    const hd = grp(.52, 0, .1, safeDoor); safeDoor.userData.handle = hd; for (let i = 0; i < 3; i++) { const sp = rbox(.5, .06, .06, 0xd4d9e0, { m: { metalness: .8 } }); sp.rotation.z = i * Math.PI / 3; hd.add(sp); } SAFE.userData.hd = hd; }
  const safeHandle = SAFE.userData.hd;
  // ---------------------------------------------------------------- T set: TV with screen canvas, stand, buttons, couch
  const TVY = 2.0;
  { box(T, 0, .45, -2.7, 3.6, .9, .95, 0x4a2f1c); box(T, 0, .45, -2.21, 3.4, .75, .04, 0x5d3a22); box(T, 0, 1.1, -2.9, .6, .2, .3, 0x222222); box(T, 0, TVY, -3.0, 3.25, 1.95, .18, 0x15171c, { m: { roughness: .4 } });
    for (const [x, c, n] of [[.35, 0xe5301e, 'CH-'], [.95, 0x3fa04a, 'CH+']]) { const bt = rbox(.32, .32, .08, c, { r: .5 }); bt.position.set(x, .72, -2.17); T.add(bt); T.userData['b' + n] = bt; const l = cvs(128, 48, (g, w, h) => { txt(g, n, w / 2, 26, 38, '#fff', { stroke: '#222', sw: 7 }); }); const lm = new THREE.Mesh(new THREE.PlaneGeometry(.34, .13), new THREE.MeshBasicMaterial({ map: l.t, transparent: true })); lm.position.set(x, .45, -2.18); T.add(lm); }
    box(T, -1.4, .22, -2.17, .4, .1, .02, 0x222222); box(T, 1.5, .6, -2.17, .08, .08, .02, 0xff3030); }
  const btnPlus = T.userData['bCH+'], btnMinus = T.userData['bCH-'];
  const scr = cvs(512, 288); const scrM = new THREE.Mesh(new THREE.PlaneGeometry(3.05, 1.72), new THREE.MeshBasicMaterial({ map: scr.t, toneMapped: false })); scrM.position.set(0, TVY, -2.905); T.add(scrM);
  const glow = new THREE.PointLight(0xaec8ff, 1.2, 8); glow.position.set(0, TVY, -1.6); T.add(glow);
  { const C = grp(1.9, 0, 1.5, T); const cm = 0xb8452e, cd = 0x8c3320; box(C, 0, .22, 0, 3.4, .44, 1.5, cd); box(C, -.85, .56, -.15, 1.6, .26, 1.1, cm); box(C, .85, .56, -.15, 1.6, .26, 1.1, cm); box(C, 0, 1.0, .65, 3.4, 1.05, .35, cd); box(C, -1.75, .64, -.1, .32, .8, 1.4, cd); box(C, 1.75, .64, -.1, .32, .8, 1.4, cd); }
  flat(T, 7, 4.2, 0x2f6a5a, 0, .006, 0); flat(T, 6.4, 3.6, 0xf1deb4, 0, .008, 0);
  const CH = [['NEWS', '#1d4a9a', '#fff'], ['COOKING', '#c9672a', '#fff'], ['SOAP OPERA', '#c2467a', '#fff'], ['GAME SHOW', '#6a3fb5', '#ffe14a'], ['GOLF', '#3f8f3f', '#fff'], ['SHOPPING', '#d7aa1c', '#222'], ['WEATHER', '#2b8fcb', '#fff']];
  const drawScreen = (mode, k = 0, tt = 0) => { const g = scr.g; g.clearRect(0, 0, 512, 288);
    if (mode === 'show') { const gr = g.createLinearGradient(0, 0, 0, 288); gr.addColorStop(0, '#2a1a5a'); gr.addColorStop(1, '#6a2a8a'); g.fillStyle = gr; g.fillRect(0, 0, 512, 288); for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(255,220,90,${.1 + .1 * Math.sin(tt * 3 + i)})`; g.beginPath(); g.arc(30 + i * 36, 40 + Math.sin(tt * 2 + i) * 14, 9, 0, 7); g.fill(); } txt(g, 'THE BIG', 256, 108, 70, '#ffe14a', { stroke: '#2a1040', sw: 10 }); txt(g, 'SHOW', 256, 188, 88, '#fff', { stroke: '#2a1040', sw: 12 }); g.fillStyle = '#e5301e'; g.fillRect(396, 14, 100, 30); txt(g, '● LIVE', 446, 30, 22, '#fff'); }
    else if (mode === 'ch') { const [n, bg, fg] = CH[k % CH.length]; g.fillStyle = bg; g.fillRect(0, 0, 512, 288); g.fillStyle = 'rgba(255,255,255,.14)'; for (let i = 0; i < 6; i++) g.fillRect(0, i * 52 + ((tt * 200) % 52), 512, 20); txt(g, n, 256, 150, n.length > 8 ? 64 : 86, fg, { stroke: 'rgba(0,0,0,.45)', sw: 10 }); g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(20, 20, 118, 44); txt(g, 'CH ' + (3 + (k % CH.length) * 4), 79, 43, 30, '#7dff6a'); }
    else if (mode === 'static') { for (let y = 0; y < 288; y += 6) for (let x = 0; x < 512; x += 8) { const v = (cr(x + y * 7, Math.floor(tt * 30)) * 255) | 0; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(x, y, 8, 6); } }
    else if (mode === 'dogs') { const gr = g.createLinearGradient(0, 0, 0, 288); gr.addColorStop(0, '#78b8e8'); gr.addColorStop(.62, '#cfe8f7'); gr.addColorStop(.62, '#6fae4a'); gr.addColorStop(1, '#4e8a34'); g.fillStyle = gr; g.fillRect(0, 0, 512, 288);
      g.fillStyle = '#e3a93c'; const dx = 120 + ((tt * 60) % 300); g.fillRect(dx, 150, 90, 44); g.fillRect(dx + 70, 124, 44, 44); g.fillRect(dx + 8, 190, 14, 36); g.fillRect(dx + 58, 190, 14, 36); g.fillRect(dx - 14, 130, 14, 44); g.fillStyle = '#222'; g.fillRect(dx + 98, 138, 8, 8);
      g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(0, 196, 512, 92); txt(g, 'NATURE', 256, 226, 36, '#cfe8f7'); txt(g, 'DOGS', 256, 266, 62, '#ffe14a', { stroke: '#222', sw: 8 }); g.fillStyle = '#fff'; g.font = `900 22px ${FONT}`; g.textAlign = 'left'; g.fillText('A Documentary', 22, 36); }
    scr.t.needsUpdate = true; };
  // tissue + box
  const tissue = new THREE.Group(); { const t1 = rbox(.2, .3, .2, 0xffffff, { r: .5 }); t1.position.y = .1; tissue.add(t1); const t2 = rbox(.14, .2, .14, 0xf4f8ff, { r: .5 }); t2.position.set(.04, .26, 0); tissue.add(t2); tissue.visible = false; S.add(tissue); }
  // ---------------------------------------------------------------- dog (golden, expressive canvas face)
  const dog = new THREE.Group(); S.add(dog); const dogP = {};
  const faceC = cvs(256, 224), mouthC = cvs(256, 96);
  { const fur = 0xe3a93c, dark = 0xb4741c, lite = 0xf7dfa0;
    dogP.body = put(dog, rbox(.36, .32, .64, fur), 0, .36, 0); put(dog, rbox(.3, .12, .5, lite), 0, .24, .02);
    const hd = new THREE.Group(); hd.position.set(0, .62, .36); dog.add(hd); dogP.head = hd; put(hd, rbox(.34, .3, .28, fur), 0, 0, 0);
    put(hd, rbox(.22, .17, .17, lite), 0, -.07, .14); put(hd, rbox(.1, .06, .05, 0x1a1a1a, { r: .4 }), 0, -.005, .245);
    const fm = new THREE.Mesh(new THREE.PlaneGeometry(.31, .27), new THREE.MeshBasicMaterial({ map: faceC.t, transparent: true })); fm.position.set(0, .01, .1405); hd.add(fm);
    const mm = new THREE.Mesh(new THREE.PlaneGeometry(.2, .075), new THREE.MeshBasicMaterial({ map: mouthC.t, transparent: true })); mm.position.set(0, -.105, .2305); hd.add(mm);
    dogP.tongue = put(hd, rbox(.07, .02, .1, 0xff7a98), 0, -.15, .19); dogP.ears = [-1, 1].map((sx) => { const p = new THREE.Group(); p.position.set(sx * .17, .1, -.03); hd.add(p); const e = rbox(.07, .24, .15, dark); e.position.y = -.1; p.add(e); p.userData.sx = sx; return p; });
    dogP.legs = [[-.11, .21], [.11, .21], [-.11, -.21], [.11, -.21]].map(([x, z]) => { const p = new THREE.Group(); p.position.set(x, .26, z); dog.add(p); const l = rbox(.11, .28, .13, fur); l.position.y = -.14; p.add(l); const f = rbox(.12, .05, .16, lite); f.position.set(0, -.27, .02); p.add(f); return p; });
    const tp = new THREE.Group(); tp.position.set(0, .44, -.3); dog.add(tp); dogP.tail = tp; const tl2 = rbox(.14, .6, .14, fur); tl2.position.y = .3; tp.add(tl2); const tl3 = rbox(.22, .2, .2, lite); tl3.position.y = .6; tp.add(tl3); }
  dog.visible = false;
  const EXP = { smug: { lid: .5, brow: -.15, smile: .55, smirk: 1, px: .3, py: 0 }, determined: { lid: .22, brow: -.95, smile: -.2, px: 0, py: -.2 }, scheme: { lid: .3, brow: -.6, smile: .35, smirk: .6, px: -.7, py: -.5 }, sad: { lid: .12, brow: .95, smile: -.9, px: 0, py: .4, tear: 1 }, sadStart: { lid: .1, brow: .6, smile: -.6, px: -.3, py: .3, tear: 0 }, happy: { lid: .05, brow: .1, smile: 1, open: .8, px: 0, py: 0 }, strain: { lid: .62, brow: -.9, smile: -.35, px: 0, py: 0 }, wide: { lid: -.15, brow: .35, smile: .1, px: 0, py: 0 }, side: { lid: .4, brow: -.3, smile: .7, smirk: 1, px: 1, py: .1 }, up: { lid: .15, brow: -.5, smile: 0, px: 0, py: -1 } };
  const lerpE = (a, b, u) => { const o = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) o[k] = lerp(a[k] ?? 0, b[k] ?? 0, u); return o; };
  const expAt = (lt, keys) => { let i = 0; while (i < keys.length - 1 && lt >= keys[i + 1][0]) i++; if (i >= keys.length - 1) return EXP[keys[i][1]]; const k0 = keys[i], k1 = keys[i + 1]; const u = ease(k1[0] - .22, k1[0], lt); return lerpE(EXP[k0[1]], EXP[k1[1]], smooth(u)); };
  const FURC = '#e3a93c';
  const drawFace = (e, t, blink) => { const g = faceC.g; g.clearRect(0, 0, 256, 224); const lid = clamp((e.lid ?? 0) + blink, -.2, 1);
    for (const sx of [-1, 1]) { const cx = 128 + sx * 66, cy = 82;
      g.fillStyle = '#fffdf6'; g.strokeStyle = '#3a2410'; g.lineWidth = 5; g.beginPath(); g.ellipse(cx, cy, 31, 36 + (lid < 0 ? 6 : 0), 0, 0, 7); g.fill(); g.stroke();
      const px = cx + (e.px || 0) * 11 * sx * (sx > 0 ? 1 : 1), py = cy + (e.py || 0) * 14; g.fillStyle = '#2a1608'; g.beginPath(); g.arc(px, py, 17, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(px - 5, py - 6, 5, 0, 7); g.fill();
      if (lid > 0) { const slant = (e.brow || 0) * 14; const yo = cy - 42 + lid * 78; g.fillStyle = FURC; g.beginPath(); g.moveTo(cx - 40, cy - 60); g.lineTo(cx + 40, cy - 60); g.lineTo(cx + 40, yo - slant * sx * -1 * 0 + (sx > 0 ? slant : slant) * (-.5)); g.lineTo(cx - 40, yo + (sx > 0 ? slant : slant) * .5); g.closePath(); g.fill(); g.strokeStyle = '#3a2410'; g.lineWidth = 5; g.beginPath(); g.moveTo(cx - 33, yo + slant * .45); g.lineTo(cx + 33, yo - slant * .45); g.stroke(); }
      // brows: inner end (towards face centre) goes down when angry (brow<0), up when sad (brow>0)
      const bi = (e.brow || 0); const inner = -sx; const yb = cy - 56 - (lid < .3 ? 0 : 0) - (bi > 0 ? 6 : 0); g.strokeStyle = '#6a3d0c'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx + inner * -38, yb - (-bi) * -8 * 0 + (bi > 0 ? 6 : -4) * 0 + (-bi) * 0 + (bi > 0 ? 0 : 0) + 0); g.moveTo(cx - inner * 38, yb + bi * 8); g.lineTo(cx + inner * 34, yb - bi * 22); g.stroke();
    }
    if (e.tear > .02) { const k = e.tear; for (const sx of [-1, 1]) { g.fillStyle = 'rgba(120,200,255,.9)'; g.beginPath(); g.moveTo(128 + sx * 82, 108); g.lineTo(128 + sx * 82 + 8, 108 + 20 + k * 60); g.arc(128 + sx * 82, 128 + k * 60, 12, 0, Math.PI); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.arc(128 + sx * 82 - 4, 124 + k * 58, 4, 0, 7); g.fill(); } }
    faceC.t.needsUpdate = true;
    const m = mouthC.g; m.clearRect(0, 0, 256, 96); const sml = e.smile || 0, open = e.open || 0; m.strokeStyle = '#4a2410'; m.lineWidth = 9; m.lineCap = 'round'; m.lineJoin = 'round';
    const lx = 40, rx = 216, my = 34 - sml * 4; const sk = (e.smirk || 0) * 14;
    if (open > .05) { m.fillStyle = '#7a1f2a'; m.beginPath(); m.moveTo(lx, my); m.quadraticCurveTo(128, my + 30 + sml * 22, rx, my); m.quadraticCurveTo(128, my + 24 + open * 52, lx, my); m.fill(); m.fillStyle = '#ff7a98'; m.beginPath(); m.ellipse(128, my + 40, 30, 12 * open, 0, 0, 7); m.fill(); }
    m.beginPath(); m.moveTo(lx, my - sk * .5); m.quadraticCurveTo(128, my + sml * 48, rx, my + sk * .7); m.stroke();
    mouthC.t.needsUpdate = true; };
  const setDog = (d) => { const s = d.s ?? 1.35, sit = d.sit || 0, lie = d.lie || 0; dog.visible = true; dog.scale.setScalar(s); dog.position.set(d.x, d.y - .17 * sit * s - .1 * lie * s, d.z); dog.rotation.set((d.pitch || 0) - .72 * sit, d.yaw || 0, d.roll || 0, 'YXZ');
    dogP.legs.forEach((p, i) => { const hind = i > 1; let r = d.run ? Math.sin(d.run + (i % 2 ? Math.PI : 0) + (hind ? Math.PI * .5 : 0)) * .9 : 0; if (sit && hind) r = -1.35 * sit; if (!hind && d.fl != null) r = d.fl + (i % 2 ? .25 : 0) * (d.flS || 0); if (hind && d.hl != null) r = d.hl; p.rotation.x = r; p.scale.set(1, lie ? .35 : 1, 1); p.position.y = lie ? .18 : .26; });
    dogP.tail.rotation.set(-.15 - .35 * sit + lie * 1.1, 0, Math.sin(d.wag || 0) * (.6 - lie * .25)); dogP.tongue.visible = !!d.tongue; dogP.head.rotation.set(d.hx || 0, d.hy || 0, d.hz || 0); dogP.tail.scale.setScalar(1 + (d.tailBig || 0) * .5);
    const ed = d.ear ?? .25; dogP.ears.forEach((p) => { p.rotation.z = p.userData.sx * ed; }); };
  // head world frame helpers for close-ups
  const hp = V3(0, 0, 0), hf = V3(0, 0, 1), hr = V3(1, 0, 0); const head = (an) => { dog.updateMatrixWorld(true); dogP.head.getWorldPosition(hp); hf.set(0, 0, 1).transformDirection(dogP.head.matrixWorld); hf.y *= .35; hf.normalize(); hr.set(hf.z, 0, -hf.x).normalize(); an.h = hp.clone(); an.f = hf.clone(); an.r = hr.clone(); };
  const fc = (an, d, u, r, tu = 0) => ({ e: [an.h.x + an.f.x * d + an.r.x * r, an.h.y + an.f.y * d + u, an.h.z + an.f.z * d + an.r.z * r], g: [an.h.x, an.h.y + tu, an.h.z] });
  // ---------------------------------------------------------------- people
  const crowd = new Crowd(S, 4, 91); const PP = crowd.p; const YOU = PP[0];
  const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  col(0, ['torso', 'armL', 'armR'], 0x3a78d8); col(0, ['legL', 'legR'], 0x2b3347); col(0, ['hair'], 0x4a2f1c); col(0, ['head', 'neck', 'handL', 'handR'], 0xe8b48a);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; o.h = 1; };
  const hide = (o) => { o.vis = false; o.x = 0; o.y = -50; o.z = 0; };
  const mist = new Particles(S, 40, 0xeaf6ff, .16, { rough: 1 }); const dust = new Particles(S, 30, 0xcdbfa6, .1, { rough: 1 }); const tears = new Particles(S, 12, 0x7fcfff, .035, { rough: .1 });
  const lbs = { clever: mkLabel('CLEVER!', '#ffe23a', '#111'), better: mkLabel('MUCH BETTER!', '#7dff6a', '#111', 900, 108), woof: mkLabel('WOOF!', '#ffe23a', '#111', 400, 110), wob: mkLabel('WOBBLE', '#ff8a3a', '#111', 520, 100), cold: mkLabel('BRRR', '#9fdcff', '#112', 380, 110), safe: mkLabel('SAFE!', '#ffffff', '#111', 480, 110), sit: mkLabel('*sits*', '#ffe23a', '#111', 420, 100), boop: mkLabel('BOOP', '#ffe23a', '#111', 420, 110), sob: mkLabel('SOB', '#9fdcff', '#112', 340, 110), steal: mkLabel('+1 STOLEN', '#ff5a4a', '#111', 700, 100), mine: mkLabel('MINE', '#ffe23a', '#111', 380, 110) };
  const LB = Object.values(lbs);
  // ---------------------------------------------------------------- camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3(); const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t, off = [0, 0, 0]) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u) + off[0], lerp(e0[1], e1[1], u) + off[1], lerp(e0[2], e1[2], u) + off[2]); T2.set(lerp(g0[0], g1[0], u) + off[0], lerp(g0[1], g1[1], u) + off[1], lerp(g0[2], g1[2], u) + off[2]); E.x += Math.sin(t * .9) * .02; E.y += Math.sin(t * 1.3 + 1) * .02; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .006); };
  const dk = (x, y, z) => [x, y, z];
  globalThis.__post.pm.uniforms.amt.value = 3.5; globalThis.__post.pm.uniforms.band.value = .3;
  const sit = (o, x, z, yaw, a) => { place(o, x, .3, z, yaw, 'sit', .4); o.arms = a; };

  // ============================================================================ frame
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    M.visible = bi <= 3; T.visible = bi >= 4;
    const prep = () => { if (dogSet) { dogSet.x += OX; setDog(dogSet); head(an); drawFace(expr, t, blinkK); } };
    PP.forEach(hide); dog.visible = false; LB.forEach((s) => { s.visible = false; }); mist.clear(); dust.clear(); tears.clear(); SPN.visible = false; tissue.visible = false; REM.visible = false;
    let shock = false, counter = null, focusX = 0, expr = EXP.smug; const an = {}; let handRemote = false, handTissue = false; let blinkK = (Math.sin(t * 2.3) > .985 || Math.sin(t * 5.1 + 2) > .992) ? .6 : 0; let dogSet = null;
    pillows.forEach((q, i) => { q.visible = true; q.position.set(CX - 1.0 + i * .6, .75 + (i % 2) * .02, CZ + .2); q.rotation.set(0, (i - 1.5) * .25, (i - 1.5) * .08); });
    lampG.position.set(1.8, 0, -2.5); lampG.rotation.set(0, 0, 0); lampG.visible = true; lampG.scale.setScalar(1);
    safeDoor.rotation.y = 0; safeHandle.rotation.z = 0; SAFE.position.set(-.4, 0, -1.6); SAFE.rotation.set(0, 0, 0); SAFE.visible = bi === 3; doorPiv.rotation.y = 0; fridgeG.userData.lamp.intensity = 0;
    const OX = bi >= 4 ? TX : 0; const TWR = { x: SHX, z: -2.45 };

    if (bi === 0) {
      const bt = lt; const ph = t * 26;
      // dog: run across with remote, skid, turn to camera, hand over, then sit under shelf staring up
      let d = { x: 0, y: 0, z: .5, yaw: Math.PI / 2, run: 0, wag: t * 16, tongue: false };
      if (bt < .95) { const u = bt / .95; d.x = lerp(3.4, -.6, u); d.yaw = -Math.PI / 2; d.run = ph; d.y = Math.abs(Math.sin(bt * 22)) * .08; remoteTo(dogP.head, 0, -.13, .22, 0, Math.PI / 2, 0); expr = EXP.smug; }
      else if (bt < 1.9) { const u = (bt - .95) / .95; d.x = lerp(-.6, -1.1, smooth(u)); d.yaw = -Math.PI / 2 + smooth(ease(0, .5, u)) * (Math.PI / 2 + .25); d.run = u < .3 ? ph : 0; d.wag = t * 24; remoteTo(dogP.head, 0, -.13, .22, 0, Math.PI / 2, 0); expr = EXP.smug; }
      else if (bt < 2.6) { d.x = -1.1; d.yaw = .25; d.hx = .1; d.wag = t * 6; expr = bt < 2.2 ? EXP.smug : EXP.sadStart; if (bt < 2.15) remoteTo(dogP.head, 0, -.13, .22, 0, Math.PI / 2, 0); else handRemote = true; d.sit = smooth(ease(2.2, 2.5, bt)); d.tongue = false; }
      else { d.x = -1.1; d.z = .5; d.yaw = .3; d.sit = 1; d.hx = -.5; d.wag = t * 7; expr = bt < 3.5 ? EXP.up : EXP.determined; }
      d.ear = .25; dogSet = d;
      lbShow(lbs.steal, bt > .25 && bt < 1.2, V3(lerp(3.4, -.6, clamp(bt / .95)) + .1, 1.9, .5), .4, Math.min(1, (bt - .25) * 8));
      // you: chase in, take remote, shelf
      if (bt < 1.7) { const w = smooth(bt / 1.7); place(YOU, lerp(-4.6, -2.7, w), 0, -.2, Math.PI / 2 - .2, 'walk', 1.5); YOU.arms = { lx: -.8, lz: .1, rx: -.8, rz: -.1 }; shock = true; }
      else if (bt < 2.45) { place(YOU, -2.4, 0, -.2, Math.PI / 2 - .35, 'idle', .5); YOU.arms = { lx: -.2, lz: .1, rx: bt > 2.0 ? -1.15 : -1.0, rz: -.1 }; handRemote = bt > 2.15; }
      else { const w = sm(2.45, 3.25, bt); const xx = lerp(-2.4, -1.75, w), zz = lerp(-.2, -2.3, w); place(YOU, xx, 0, zz, lerp(Math.PI / 2 - .35, Math.PI * .72, w), w < 1 ? 'walk' : 'idle', 1.3); YOU.arms = bt < 3.25 ? { lx: -.2, lz: .1, rx: -1.15, rz: -.1 } : { lx: -.2, lz: .1, rx: -2.9, rz: .1 }; handRemote = bt < 3.5; }
      if (bt >= 3.5) { remoteTo(M, SHX + .05, SHY + .035, -2.95, 0, .6, 0); REM.scale.setScalar(1.5); }
  const REMS = (v) => REM.scale.setScalar(v);
      if (bt >= 3.75) { const w = sm(3.75, 4.2, bt); YOU.x = lerp(-1.75, -.1, w); YOU.z = lerp(-2.3, -1.0, w); YOU.yaw = lerp(Math.PI * .72, .6, w); YOU.anim = w < 1 ? 'walk' : 'idle'; YOU.arms = { lx: -.2, lz: .1, rx: -.2, rz: -.1 }; }
      counter = ['REMOTE STOLEN', String(bt < .3 ? 2 : 3), bt < 2.4 ? 'again' : 'you hide it', true];
      const r0 = (a) => [a.h.x + 1.3, 1.2, 3.2];
      prep();
      rig(lt, [[0, (a) => [a.h.x + .8, .95, 3.4], (a) => [a.h.x + .8, .9, 3.0], (a) => [a.h.x - .2, .65, .5], (a) => [a.h.x - .4, .7, .5], 40, 36], [.95, (a) => { const f = fc(a, 2.6, .12, .35); return f.e; }, (a) => fc(a, 2.4, .1, .15).e, (a) => fc(a, 2.4, 0, 0).g, (a) => fc(a, 1.5, 0, 0).g, 34, 30], [1.85, dk(-1.3, 1.5, 6.3), dk(-1.0, 1.7, 6.0), dk(-1.5, 1.2, -.4), dk(-1.4, 1.5, -1.2), 44, 46], [3.3, dk(-.3, 2.3, 4.7), dk(-.2, 2.1, 4.6), dk(-1.2, 1.9, -2.5), dk(-1.0, 1.8, -2.5), 42, 42], [3.8, (a) => fc(a, 2.7, -.05, .4).e, (a) => fc(a, 2.3, .05, .1).e, (a) => fc(a, 1, 0, 0, .05).g, (a) => fc(a, 1, 0, 0, .05).g, 36, 30]], an, t);
      focusX = -1;
    } else if (bi === 1) {
      const bt = lt; const w = bt * 18;
      // pillows: start on couch, flick over to tower (4), lamp, dog climbs, grabs remote
      const sx = CX - 1.0; const landY = (i) => .15 + i * .3; const launch = [1.4, 1.75, 2.1, 2.45]; const flight = .48;
      const sway = (bt > 2.0 ? Math.sin(bt * 8) * Math.min(.05, (bt - 2.0) * .03) * 1 : 0) + (bt > 3.0 ? Math.sin(bt * 11) * .035 * smooth(ease(3.2, 3.9, bt)) * 2 + Math.sin(bt * 8) * .03 : 0);
      pillows.forEach((q, i) => { const l = ease(launch[i], launch[i] + flight, bt); if (bt < launch[i]) return; const x0 = sx + i * .6, y0 = .75, z0 = CZ + .2; const x1 = TWR.x, y1 = landY(i), z1 = TWR.z; const u = l; q.position.set(lerp(x0, x1, u), lerp(y0, y1, u) + Math.sin(u * Math.PI) * 1.6, lerp(z0, z1, u)); q.rotation.set(Math.sin(u * 6) * .6 * (1 - u), (i - 1.5) * .25 * (1 - u) + u * 6.28, (i - 1.5) * .08 * (1 - u));
        if (u >= 1) { const hgt = (i + 1); q.rotation.set(0, i * .1, 0); q.rotation.z = sway * (i + 1) * .6; q.position.x = TWR.x + sway * (i + 1) * 1.6 + (i % 2 ? .04 : -.04); q.position.y = landY(i); } });
      // lamp arc
      { const l = ease(2.85, 3.3, bt); if (bt >= 2.85) { const x1 = TWR.x - .3 + sway * 4.5, y1 = 1.2, z1 = TWR.z; lampG.position.set(lerp(1.8, x1, l), lerp(0, y1, l) + Math.sin(l * Math.PI) * 1.4, lerp(-2.5, z1, l)); lampG.rotation.z = l < 1 ? (1 - l) * -1.0 : sway * 5; } }
      // dog
      let d = { x: -1.2, y: 0, z: -.9, yaw: 0, wag: t * 10, tongue: false, ear: .25 }; expr = EXP.determined;
      if (bt < 1.0) { d.x = -.9; d.z = .3; d.yaw = .2; d.sit = 1; d.hx = -.45; d.wag = t * 8; expr = bt < .55 ? EXP.up : EXP.scheme; }
      else if (bt < 1.45) { const u = sm(1.0, 1.45, bt); d.x = lerp(-.9, 1.1, u); d.z = lerp(.3, -.7, u); d.yaw = lerp(.2, Math.PI / 2 + .2, u) * 1; d.run = w * 1.4; expr = EXP.scheme; d.sit = 1 - smooth(ease(1.0, 1.15, bt)); }
      else if (bt < 2.75) { d.x = 1.15; d.z = -.7; d.yaw = Math.PI / 2 + .35; d.hx = Math.sin((bt - 1.4) * 15.5) * .3 - .1; d.wag = t * 22; expr = EXP.smug; d.tongue = true; }
      else if (bt < 3.25) { const u = ease(2.75, 3.25, bt); d.x = lerp(1.15, -.3, smooth(u)); d.z = lerp(-.7, -1.7, smooth(u)); d.yaw = lerp(Math.PI / 2 + .35, -Math.PI / 2 - .1, smooth(u)) + Math.PI * 0; d.run = w * 1.4; expr = EXP.determined; }
      else if (bt < 3.95) { const u = ease(3.25, 3.95, bt); const x1 = TWR.x - .05, y1 = 1.2, z1 = TWR.z + .3; d.yaw = Math.PI - .2; d.x = lerp(-.3 + (-.6), x1, smooth(u)); d.z = lerp(-1.7, z1, smooth(u)); d.y = lerp(0, y1, smooth(u)) + Math.sin(u * Math.PI) * .7; d.pitch = -1.15 * smooth(ease(.15, .85, u)); d.fl = -1.3; d.hl = -.2; d.wag = t * 12; expr = EXP.strain; }
      else { const u = ease(3.95, 4.9, bt); d.x = TWR.x - .05 + sway * 4; d.y = 1.2; d.z = TWR.z + .3; d.yaw = Math.PI - .2; const turn = sm(4.55, 4.95, bt); d.yaw = lerp(Math.PI - .2, .55, turn); d.pitch = lerp(-1.15, -.85, smooth(ease(4.4, 4.9, bt))); d.fl = lerp(-1.3, -.6, turn); d.hl = -.2; d.wag = t * 24; d.tongue = bt > 4.9; expr = bt < 4.5 ? EXP.strain : EXP.smug; d.hx = lerp(-.3, 0, turn); }
      dogSet = d;
      if (bt >= 4.55) remoteTo(dogP.head, 0, -.13, .22, 0, Math.PI / 2, 0); else if (bt >= 0) { REM.visible = true; remoteTo(M, SHX + .05, SHY + .035, -2.95, 0, .6, 0); }
      lbShow(lbs.clever, bt > .08 && bt < 1.1, V3(-.1, 2.1, -.6), .42, Math.min(1, (bt - .08) * 6));
      lbShow(lbs.wob, bt > 3.35 && bt < 4.15, V3(TWR.x + 1.1, 2.3, -1.4), .4, Math.min(1, (bt - 3.35) * 8));
      // you: leave
      if (bt < 1.2) { const k = smooth(bt / 1.2); place(YOU, lerp(-.1, 3.2, k), 0, lerp(-1.0, .6, k), Math.PI / 2 - .3, 'walk', 1.3); YOU.arms = { lx: -.2, lz: .1, rx: -.2, rz: -.1 }; }
      shock = bt > 4.0;
      counter = ['DOG vs YOU', bt > 4.55 ? '1 - 0' : '0 - 0', bt < 1.4 ? 'plan: top shelf' : bt < 3.0 ? 'pillows: four' : 'it is climbing', bt > 4.55];
      prep();
      rig(lt, [[0, (a) => fc(a, 2.7, .15, .3).e, (a) => fc(a, 2.4, .1, .15).e, (a) => fc(a, 1, 0, 0, .05).g, (a) => fc(a, 1, 0, 0, .05).g, 34, 32], [1.0, dk(-.4, 1.5, 6.4), dk(-.1, 1.5, 6.3), dk(-.5, 1.1, -.9), dk(-.2, 1.1, -1.0), 46, 46], [2.7, dk(-.6, 1.6, 6.0), dk(-.5, 1.9, 6.0), dk(-.5, 1.15, -1.9), dk(-.5, 1.4, -2.3), 44, 40], [3.5, dk(.4, 1.8, 5.8), dk(.2, 2.0, 5.5), dk(-.7, 1.4, -2.3), dk(-.8, 1.7, -2.4), 40, 36], [4.45, (a) => fc(a, 2.8, .12, .4, .0).e, (a) => fc(a, 2.4, .06, .1).e, (a) => fc(a, 1, 0, 0, .0).g, (a) => fc(a, 1, 0, 0, .0).g, 38, 30]], an, t);
      focusX = -.5;
    } else if (bi === 2) {
      const bt = lt; const FX = FRX;
      // door: you open at .2-.8, place, close .9-1.3; dog opens 4.9-6.2
      let door = 0; if (bt < 1.4) door = bt < .9 ? sm(.2, .8, bt) * 1.7 : (1 - sm(.95, 1.3, bt)) * 1.7; else if (bt > 4.9) door = sm(4.9, 5.4, bt) * .3 + sm(5.5, 6.2, bt) * 1.5; doorPiv.rotation.y = door;
      fridgeG.userData.lamp.intensity = door > .1 ? clamp(door) * 1.2 : 0;
      const remInside = bt < 6.45; if (bt < .6) { remoteTo(M, 0, 0, 0); REM.matrixAutoUpdate = true; handRemote = true; } else if (remInside) remoteTo(fridgeG, -.4, .76, .05, 0, .5, 0); else remoteTo(dogP.head, 0, -.13, .22, 0, Math.PI / 2, 0);
      // you
      if (bt < 1.7) { place(YOU, FX + 1.95, 0, FRZ + 1.45, -Math.PI / 2 - .6, 'idle', .5); YOU.arms = { lx: -.4, lz: .1, rx: bt < .55 ? -1.2 : -.9 + Math.sin(bt * 5) * .1, rz: -.1 }; YOU.pitch = bt > .2 && bt < 1.0 ? .3 : .05; }
      else { const k = sm(2.0, 3.2, bt); place(YOU, lerp(FX + 1.95, FX + 5.5, k), 0, lerp(FRZ + 1.45, FRZ + 2.4, k), lerp(-Math.PI / 2 - .6, Math.PI / 2 - .3, smooth(ease(1.8, 2.4, bt))), k < 1 ? 'walk' : 'idle', 1.2); YOU.arms = { lx: -.2, lz: .1, rx: -2.5, rz: .3 }; }
      lbShow(lbs.better, bt > 2.25 && bt < 3.6, V3(FX + 1.6, 3.0, FRZ + 1.5), .38, Math.min(1, (bt - 2.25) * 6));
      // dog: enters at 3.3 with spoon, works the door
      let d = null; const DXs = FX + .55, DZs = FRZ + 1.05;
      if (bt >= 2.35 && bt < 3.35) { const u = sm(2.35, 3.35, bt); d = { x: lerp(FX + 4.8, FX + 2.4, u), y: 0, z: DZs + .55, yaw: -Math.PI / 2, run: t * 22, wag: t * 20 }; expr = EXP.scheme; }
      if (bt >= 3.35 && bt < 4.35) { const u = sm(3.35, 4.1, bt); d = { x: lerp(FX + 2.4, FX + 1.25, u), y: 0, z: lerp(DZs + .55, DZs + .35, u), yaw: lerp(-Math.PI / 2, -Math.PI / 2 - .35, u), run: u < 1 ? t * 22 : 0, wag: t * 10, hx: .0, sit: 0 }; expr = EXP.determined; if (bt > 3.9) d.sit = smooth(ease(3.9, 4.3, bt)) * .0; SPN.visible = true; }
      if (bt >= 4.35 && bt < 6.5) { const pry = Math.sin((bt - 4.6) * 11) * .5 * (bt > 4.6 && bt < 5.9 ? 1 : 0); d = { x: FX + 1.25, y: .0, z: DZs + .45, yaw: -Math.PI / 2 - .2, pitch: -.85 * sm(4.35, 4.75, bt), fl: -1.3, hl: -.15, wag: t * 14, hx: pry * .5, hz: pry * .18 }; expr = bt < 5.6 ? EXP.strain : EXP.smug; if (bt > 6.1) { expr = EXP.smug; d.tongue = true; } SPN.visible = bt < 6.15; }
      if (bt >= 6.5) { d = { x: FX + 1.25, y: 0, z: DZs + .45, yaw: -Math.PI / 2 + sm(6.45, 6.95, bt) * (Math.PI * .55), pitch: -.4, fl: -.5, hl: -.15, wag: t * 24, tongue: true, tailBig: 1 }; expr = EXP.smug; }
      if (d == null) { d = { x: FX + 4.8, y: 0, z: DZs, yaw: Math.PI / 2 }; d.s = .001; }
      d.ear = .25; dogSet = d; shock = bt > 6.2;
      if (SPN.visible) { SPN.parent !== dogP.head && dogP.head.add(SPN); SPN.matrixAutoUpdate = true; SPN.position.set(0, -.14, .35); SPN.rotation.set(.05, 0, 0); SPN.scale.setScalar(1.0); }
      for (let i = 0; i < 30; i++) { const u = (bt * .9 + i * .071) % 1; if (door > .35) mist.set(i, FX + .1 + (cr(i, 3) - .5) * 1.0 + u * .9, .15 + u * (.5 + cr(i, 4) * .6), FRZ + .7 + cr(i, 5) * .5 + u * .9, (1 - u) * .85 * clamp(door) * (door > .35 ? 1 : 0)); } mist.done();
      lbShow(lbs.cold, bt > 5.85 && bt < 6.9, V3(FX + .5, 2.4, FRZ + 1.9), .42, Math.min(1, (bt - 5.85) * 7));
      counter = ['DOG vs YOU', bt > 6.4 ? '2 - 0' : '1 - 0', bt < 1.5 ? 'remote: freezer' : bt < 4.0 ? 'dog: thinking' : 'dog: spoon', bt > 6.4];
      prep();
      rig(lt, [[0, dk(FX + 3.5, 1.5, 6.2), dk(FX + 3.1, 1.5, 5.8), dk(FX + 1.3, 1.1, FRZ + .9), dk(FX + 1.1, 1.0, FRZ + .8), 44, 40], [1.9, dk(FX + 3.2, 1.7, 6.2), dk(FX + 3.4, 1.8, 6.2), dk(FX + 2.2, 1.0, FRZ + 1.4), dk(FX + 2.2, .9, FRZ + 1.2), 46, 44], [3.2, dk(FX + 3.0, 1.2, 4.5), dk(FX + 2.6, 1.0, 4.0), dk(FX + 1.7, .8, FRZ + 1.4), dk(FX + 1.4, .8, FRZ + 1.2), 40, 36], [4.35, dk(FX + 3.0, 1.5, 4.8), dk(FX + 3.0, 1.4, 4.2), dk(FX + .9, 1.0, FRZ + .9), dk(FX + .8, 1.0, FRZ + .8), 40, 38], [5.7, (a) => fc(a, 2.9, .1, -.5).e, (a) => fc(a, 2.5, .05, -.3).e, (a) => fc(a, 1, 0, 0, 0).g, (a) => fc(a, 1, 0, 0, 0).g, 36, 30]], an, t);
      focusX = -5;
    } else if (bi === 3) {
      const bt = lt; const SX0 = -.4, SX1 = CX - .1;
      // safe: door open .0-.9 (you put remote), closed + spin, dog pushes 2.1-3.1, hop onto couch 3.1-3.6
      const dopen = bt < .9 ? sm(.05, .45, bt) * 1.8 : (1 - sm(.55, .95, bt)) * 1.8; safeDoor.rotation.y = -(bt < .55 ? sm(.05, .45, bt) * 1.8 : (1 - sm(.55, .95, bt)) * 1.8);
      safeHandle.rotation.z = bt > 1.0 ? sm(1.0, 1.35, bt) * 3.5 : 0;
      let sxp = SX0, syp = 0, sz = -1.6, sry = 0, srz = 0;
      if (bt >= 2.15 && bt < 3.4) { const u = sm(2.15, 3.35, bt); sxp = lerp(SX0, CX - 1.95, u); sz = -1.6; syp = Math.abs(Math.sin(bt * 22)) * .015; srz = Math.sin(bt * 26) * .015; }
      if (bt >= 3.4) { const u = sm(3.4, 3.95, bt); sxp = lerp(CX - 1.95, CX, u); syp = lerp(0, .56, u) + Math.sin(u * Math.PI) * .35; sz = lerp(-1.6, CZ + .15, u); sry = 0; srz = Math.sin(u * Math.PI) * -.12; }
      SAFE.position.set(sxp, syp, sz); SAFE.rotation.z = srz;
      if (bt < .6) { remoteTo(M, 0, 0, 0); handRemote = bt > .1 && bt < .5; if (!handRemote) remoteTo(SAFE, 0, .5, .05, 0, .3, 0); } else if (bt < .62 || bt < 1.0) remoteTo(SAFE, 0, .5, .05, 0, .3, 0); else REM.visible = false;
      if (bt < .6 && handRemote) { /* in hand */ } else if (bt < 1.0) { REM.visible = true; }
      // you
      if (bt < 1.4) { place(YOU, SX0 + 1.5, 0, -.7, -Math.PI / 2 - .5, 'idle', .5); YOU.arms = { lx: -.3, lz: .1, rx: bt < .5 ? -1.3 : -1.05 + (bt > 1.0 ? Math.sin(bt * 20) * .15 : 0), rz: -.1 }; YOU.pitch = .08; }
      else { const k = sm(1.4, 2.4, bt); place(YOU, lerp(SX0 + 1.5, 4.2, k), 0, lerp(-.7, 2.6, k), lerp(-Math.PI / 2 - .5, Math.PI * .5, smooth(ease(1.4, 1.8, bt))), k < 1 ? 'walk' : 'idle', 1.2); YOU.arms = { lx: -.2, lz: .1, rx: -2.7, rz: .2 }; YOU.vis = bt < 2.6; }
      lbShow(lbs.safe, bt > .85 && bt < 1.9, V3(SX0 + .3, 1.9, -.9), .38, Math.min(1, (bt - .85) * 7));
      // dog
      let d = { x: -3.5, y: 0, z: -1.2, yaw: Math.PI / 2, s: .001 };
      if (bt >= 1.4 && bt < 2.15) { const u = sm(1.4, 2.1, bt); d = { x: lerp(-3.8, SX0 - 1.4, u), y: 0, z: -1.45, yaw: Math.PI / 2, run: t * 24, wag: t * 22, tongue: true }; expr = EXP.scheme; }
      if (bt >= 2.15 && bt < 3.45) { const u = sm(2.15, 3.35, bt); d = { x: lerp(SX0 - 1.4, CX - 1.95 - 1.35, u), y: Math.abs(Math.sin(bt * 22)) * .04, z: -1.55, yaw: Math.PI / 2, pitch: .22, run: t * 24, wag: t * 14, hx: .12 }; expr = EXP.strain; }
      if (bt >= 3.45 && bt < 4.05) { const u = sm(3.45, 4.05, bt); d = { x: lerp(CX - 3.3, CX - 1.0, u), y: lerp(0, 1.55, smooth(ease(.3, 1, u))) + Math.sin(u * Math.PI) * .5, z: lerp(-1.55, CZ + .15, u), yaw: lerp(Math.PI / 2, 0, u), pitch: -.4 * Math.sin(u * Math.PI), run: t * 22, wag: t * 22 }; expr = EXP.wide; }
      if (bt >= 4.05) { const u = sm(4.05, 4.4, bt); d = { x: CX - 1.0 * (1 - u) * 1, y: 1.55 + .0, z: CZ + .15, yaw: 0, sit: smooth(ease(4.05, 4.5, bt)), wag: t * 9, hx: -.05, tongue: false }; d.x = lerp(CX - 1.0, CX, u); expr = bt < 4.5 ? EXP.wide : EXP.smug; }
      d.ear = .25; if (d.s == null || d.s > .01) d.s = 1.35; dogSet = d; shock = bt > 3.6;
      for (let i = 0; i < 20; i++) { const u = (bt * 1.5 + i * .09) % 1; if (bt > 2.2 && bt < 3.4) dust.set(i, lerp(SX0, CX - 1.95, sm(2.15, 3.35, bt)) + .6 + u * .9, .05 + u * .5, -1.2 + (cr(i, 2) - .5) * .8, (1 - u) * .8); } dust.done();
      lbShow(lbs.sit, bt > 4.15 && bt < 5.2, V3(CX + 1.4, 2.7, CZ + 1.2), .36, Math.min(1, (bt - 4.15) * 7));
      counter = ['DOG vs YOU', bt > 4.3 ? '3 - 0' : '2 - 0', bt < 1.5 ? 'remote: safe' : bt < 3.4 ? 'dog: pushing' : 'dog: on the safe', bt > 4.3];
      prep();
      rig(lt, [[0, dk(SX0 + 3.2, 1.3, 5.2), dk(SX0 + 3.0, 1.35, 5.0), dk(SX0 + 1.1, .75, -1.0), dk(SX0 + .8, .75, -1.1), 42, 40], [2.0, dk(-1.0, 1.0, 5.4), (a) => [a.cx - 1.0, 1.0, 5.3], dk(-.2, .7, -1.3), (a) => [a.cx, .8, -1.5], 42, 42], [3.35, dk(CX - 2.4, 1.8, 6.0), dk(CX - 1.1, 2.0, 5.2), dk(CX - 1.0, .9, -1.8), dk(CX, 1.4, -1.9), 44, 42], [4.3, (a) => fc(a, 3.0, .0, -.45, .05).e, (a) => fc(a, 2.5, -.1, -.2, .0).e, (a) => fc(a, 1, 0, 0, .0).g, (a) => fc(a, 1, 0, 0, .0).g, 38, 30]], Object.assign(an, { cx: sxp }), t);
      focusX = 1;
    } else if (bi === 4) {
      const bt = lt; const NX = .5, NZ = -1.58; // nose lines up with CH+ at x=.95 -> use CH+ then CH-
      // you sit on the couch end (back to camera-left view), no remote
      const seatX = 2.7; sit(YOU, seatX, 1.55, Math.PI, bt < 1.7 ? { lx: -1.0 - Math.sin(bt * 5) * .12, lz: .35, rx: -1.0 + Math.sin(bt * 5) * .12, rz: -.35 } : { lx: -.5, lz: .1, rx: -.5, rz: -.1 }); YOU.pitch = bt < 1.7 ? 0 : .05; if (bt > 3.0) shock = true; else shock = false;
      if (bt < 1.7) YOU.y = .3 + .0;
      // screen
      let mode = 'show', k = 0; const presses = [3.05, 3.5, 3.9, 4.3, 4.75]; const nPress = presses.filter((x) => bt >= x + .1).length;
      if (bt < 2.7) { mode = 'show'; } else { mode = nPress === 0 ? 'show' : 'ch'; k = nPress - 1; if (nPress > 0 && bt - (presses[nPress - 1] + .1) < .08) mode = 'static'; }
      drawScreen(mode, k, t);
      glow.color.set(mode === 'ch' ? 0xffd9a0 : 0xaec8ff);
      // dog
      let d = null; const dx = .55;
      if (bt >= 2.3 && bt < 3.0) { const u = sm(2.3, 3.0, bt); d = { x: lerp(-3.8, dx, u), y: Math.abs(Math.sin(bt * 22)) * .05, z: lerp(.6, -1.58, smooth(ease(.4, 1, u))), yaw: lerp(Math.PI / 2, Math.PI, smooth(ease(.5, 1, u))), run: u < .98 ? t * 24 : 0, wag: t * 20, tongue: true }; expr = EXP.scheme; }
      if (bt >= 3.0) { const press = presses.some((x) => bt > x && bt < x + .22); const which = (nPress % 2) ? 0 : 1; const px = nPress >= 1 ? lerp(.35, .95, (nPress % 2)) : .35; let targetX = (Math.floor(Math.max(0, nPress)) % 2 === 0) ? .35 : .95; const xx = lerp(dx, .35 + 0.0, 1);
        const tx = bt < 3.4 ? .35 : (presses.findIndex((p) => bt < p + .45) % 2 === 0 ? .35 : .95); d = { x: tx + .0, y: 0, z: -1.58 + (press ? -.2 : .0), yaw: Math.PI, hx: press ? .22 : .0, wag: t * 14, ear: .2 }; d.hy = 0; expr = bt < 4.4 ? EXP.side : EXP.smug; if (bt > 5.0) { expr = EXP.smug; d.tongue = true; } d.hx = (press ? .25 : .05); }
      if (d == null) d = { x: -4, y: 0, z: 0, yaw: 0, s: .001 };
      d.ear = d.ear ?? .25; dogSet = d;
      const pressing = (i) => bt > presses[i] && bt < presses[i] + .22; for (let i = 0; i < 5; i++) if (pressing(i)) { const b = (i % 2 === 0) ? btnMinus : btnPlus; b.position.z = -2.17 + .05; } else { btnMinus.position.z = btnMinus.position.z; }
      btnMinus.position.z = presses.some((x, i) => i % 2 === 0 && bt > x && bt < x + .22) ? -2.12 : -2.17; btnPlus.position.z = presses.some((x, i) => i % 2 === 1 && bt > x && bt < x + .22) ? -2.12 : -2.17;
      presses.forEach((pt) => { if (bt > pt && bt < pt + .5) lbShow(lbs.boop, true, V3(TX + .65, 1.35, -1.0), .32, Math.min(1, (bt - pt) * 9)); });
      counter = ['DOG vs YOU', bt > 3.1 ? '4 - 0' : '3 - 0', bt < 2.3 ? 'no remote, no problem' : 'dog: channel surfing', bt > 3.1];
      prep();
      rig(lt, [[0, dk(TX - 2.6, 1.9, 6.0), dk(TX - 2.0, 1.9, 5.4), dk(TX + .6, 1.7, -1.2), dk(TX + .8, 1.6, -1.2), 46, 44], [2.3, dk(TX - 3.4, 1.3, 3.2), dk(TX - 3.0, 1.3, 2.4), dk(TX + .1, 1.0, -1.4), dk(TX + .3, 1.3, -2.0), 44, 44], [3.15, dk(TX - 2.8, 1.0, -.7), dk(TX - 2.5, 1.0, -.8), dk(TX + .4, .95, -2.2), dk(TX + .5, 1.0, -2.25), 40, 36], [4.5, dk(TX - 3.0, 1.1, -.2), dk(TX - 2.7, 1.2, -.4), dk(TX + .5, 1.0, -2.2), dk(TX + .6, 1.1, -2.2), 42, 40], [5.0, (a) => fc(a, 2.6, .1, .6).e, (a) => fc(a, 2.3, .1, .3).e, (a) => fc(a, 1, 0, 0, 0).g, (a) => fc(a, 1, 0, 0, 0).g, 36, 30]], an, t);
      focusX = TX;
    } else {
      const bt = lt; const DXp = .5, DZp = -1.0;
      // screen: surf then land on DOGS at 1.55
      let mode = 'ch', k = Math.floor(bt * 7) % 7; if (bt < .35) { mode = 'ch'; k = 4; } if (bt >= 1.5) mode = 'dogs'; else if (Math.floor(bt * 14) % 4 === 0) mode = 'static'; drawScreen(mode, k, t); glow.color.set(mode === 'dogs' ? 0xcfe8ff : 0xffd9a0);
      // you on couch; after 4.3 walk over with tissue
      const seatX = 2.7;
      if (bt < 4.2) { sit(YOU, seatX, 1.55, Math.PI, { lx: -.5, lz: .1, rx: -.5, rz: -.1 }); YOU.vis = true; }
      else { const w = sm(4.2, 5.1, bt); place(YOU, lerp(seatX, 2.1, w), 0, lerp(1.55, -.7, w), lerp(Math.PI, Math.PI + 1.4, w), w < 1 ? 'walk' : 'idle', 1.3); YOU.arms = { lx: -.2, lz: .1, rx: bt < 5.0 ? -.6 : -1.45 - Math.sin(bt * 6) * .05, rz: -.1 }; handTissue = bt > 4.4; }
      // dog: sits facing the TV turned slightly to camera, face changes
      const sad = bt > 2.7; let d = { x: DXp, y: 0, z: DZp, yaw: Math.PI + .75, sit: 1, wag: t * (bt < 1.6 ? 14 : 3), tongue: bt < 2.3, hx: 0, hy: 0, ear: 0.25 };
      if (bt < .6) { d.x = lerp(.1, DXp, bt / .6); d.sit = smooth(ease(.35, .6, bt)); d.run = bt < .4 ? t * 22 : 0; d.yaw = Math.PI + .2; }
      if (bt >= 1.5) { d.hy = -.5 + Math.sin(bt * 4) * .08; } if (bt > 2.7) { d.ear = lerp(.25, .85, smooth(ease(2.7, 3.4, bt))); d.hx = lerp(0, .2, smooth(ease(2.7, 3.5, bt))); d.hy = lerp(-.5, -.15, smooth(ease(2.7, 3.5, bt))); d.wag = 0; } if (bt > 4.3) { d.hy = lerp(-.15, .9, smooth(ease(4.3, 4.9, bt))); d.hx = lerp(.2, -.25, smooth(ease(4.3, 5.0, bt))); }
      dogSet = d;
      expr = expAt(bt, [[0, 'smug'], [1.5, 'happy'], [2.5, 'wide'], [2.9, 'sadStart'], [3.5, 'sad'], [5.0, 'sad']]); if (bt > 4.3) expr = Object.assign({}, EXP.sad, { px: lerp(0, .5, ease(4.3, 4.9, bt)), py: lerp(.4, -.5, ease(4.3, 4.9, bt)) });
      const tearOn = bt > 3.3; expr = Object.assign({}, expr, { tear: tearOn ? smooth(ease(3.3, 4.2, bt)) : 0 });
      shock = false;
      lbShow(lbs.sob, bt > 3.6 && bt < 5.4, V3(TX + .2, 1.9, -.4), .34, Math.min(1, (bt - 3.6) * 6));
      counter = ['DOG vs YOU', bt > 1.55 ? '5 - 0' : '4 - 0', bt < 1.55 ? 'dog: picking a show' : bt < 3.3 ? 'show: DOGS' : 'it is crying', bt > 1.55];
      prep();
      // tear droplets (3D), falling from the eye
      if (tearOn) for (let i = 0; i < 12; i++) { const u = (bt * 1.3 + i * .083) % 1; const eyeP = an.h.clone().addScaledVector(an.r, (i % 2 ? .1 : -.1) * 1.35).addScaledVector(an.f, .17); tears.set(i, eyeP.x, eyeP.y - .02 - u * .45, eyeP.z, (1 - u) * 1.0 * (bt > 3.3 ? 1 : 0)); } tears.done();
      rig(lt, [[0, dk(TX - 3.4, 1.7, 4.8), dk(TX - 2.8, 1.6, 4.3), dk(TX + .3, 1.5, -1.6), dk(TX + .4, 1.5, -1.8), 44, 44], [2.55, (a) => fc(a, 2.9, .05, -.6).e, (a) => fc(a, 2.4, .0, -.35).e, (a) => fc(a, 1, 0, 0, 0).g, (a) => fc(a, 1, 0, 0, 0).g, 36, 28], [4.3, dk(TX - 3.2, 1.5, 3.6), dk(TX - 2.4, 1.5, 3.2), dk(TX + 1.1, .85, -.9), dk(TX + 1.0, .95, -.8), 40, 36], [5.35, (a) => fc(a, 2.9, .05, -.7).e, (a) => fc(a, 2.4, .0, -.5).e, (a) => fc(a, 1, 0, 0, 0).g, (a) => fc(a, 1, 0, 0, 0).g, 36, 28]], an, t);
      focusX = TX;
    }
    if (bi >= 4 && YOU.vis) YOU.x += TX;
    crowd.setFace(shock ? 'shock' : 'calm'); crowd.update(t);
    if (handRemote) { attach(REM, YOU, 'handR', [0, -.05, .06], [Math.PI / 2, 0, 0]); REM.visible = true; }
    if (handTissue) { attach(tissue, YOU, 'handR', [0, -.12, .12], [0, 0, 0]); tissue.visible = true; tissue.matrix.scale(V3(1.5, 1.5, 1.5)); }
    A.follow(focusX, 0); A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    if (counter) hud.counter(counter[0], counter[1], counter[2], '', counter[3]);
    hud.tm(''); hud.pop('', 0);
  } };
}
