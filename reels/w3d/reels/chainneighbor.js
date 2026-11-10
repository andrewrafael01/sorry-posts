// 670 invention chain: neighbor's dog on the lawn -> fence -> dog digs under -> fence deeper -> hole through the Earth -> dog is famous in China -> NO DOGS sign -> dog moves in.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, mat, Crowd, Particles, clamp, smooth, lerp, attach, tree } = lib;
  const A = makeStage({ fog: 0xbcd8ee, fogNear: 60, fogFar: 210, clouds: false, skyTop: 0x3f86d8, skyMid: 0x9cc8f0, skyBot: 0xe2eef9, shadowExtent: 15, shadowRes: 2048, hemi: 1.5, sunI: 1.9, sunDir: [-.35, .9, .55], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t, w, h }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rbox = (w, h, d, c, o = {}) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * .2), o.mat || mat(c, o.m || {})); m.castShadow = o.cast !== false; m.receiveShadow = true; return m; };
  const box = (par, x, y, z, w, h, d, c, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.mat || mat(c, o.m || {})); m.position.set(x, y, z); if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.rx) m.rotation.x = o.rx; m.castShadow = o.cast !== false; m.receiveShadow = true; par.add(m); return m; };
  const put = (par, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); par.add(m); return m; };
  const grp = (x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); S.add(g); return g; };
  const ORG = { L: [0, 0, 0], U: [500, 0, 0], C: [0, 0, -450], R: [-500, 0, 0] };
  const L = grp(...ORG.L), U = grp(...ORG.U), C = grp(...ORG.C), R = grp(...ORG.R);
  const flatPlane = (par, w, d, color, x, y, z, map) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), map ? new THREE.MeshStandardMaterial({ map, roughness: 1 }) : mat(color, { roughness: 1 })); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; par.add(m); return m; };
  const noiseTex = (base, rep, seed = 2) => { const q = cvs(256, 256, (g) => { g.fillStyle = base; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 2600; i++) { const s = 1 + cr(i, seed) * 3; g.fillStyle = `rgba(${cr(i, seed + 1) < .5 ? '255,255,255' : '0,40,0'},${.035 + cr(i, seed + 2) * .05})`; g.fillRect(cr(i, seed + 3) * 256, cr(i, seed + 4) * 256, s, s); } }); q.t.wrapS = q.t.wrapT = THREE.RepeatWrapping; q.t.repeat.set(rep, rep); return q.t; };
  const mkLabel = (text, c1, c2, w = 640, size = 110) => { const l = cvs(w, 180, (g, ww) => { txt(g, text, ww / 2, 92, size, c1, { stroke: c2, sw: 22 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; s.userData.ar = w / 180; S.add(s); return s; };
  const lbShow = (s, on, pos, h = .5, a = 1) => { s.visible = on && a > .01; if (!s.visible) return; s.position.copy(pos); const k = clamp(a); s.scale.set(h * s.userData.ar * k, h * k, 1); };
  const heartTex = cvs(128, 128, (g) => { g.fillStyle = '#ff3b5c'; g.strokeStyle = '#7a0f26'; g.lineWidth = 8; g.beginPath(); g.moveTo(64, 112); g.bezierCurveTo(8, 72, 12, 18, 48, 20); g.bezierCurveTo(60, 21, 64, 32, 64, 36); g.bezierCurveTo(64, 32, 68, 21, 80, 20); g.bezierCurveTo(116, 18, 120, 72, 64, 112); g.fill(); g.stroke(); g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(40, 44, 9, 6, -.6, 0, 7); g.fill(); });
  const mkHeart = () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: heartTex.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const hearts = []; for (let i = 0; i < 14; i++) hearts.push(mkHeart());

  // =============================================================== LAWN (beats 0, 4)
  const lawnTex = noiseTex('#6fa84e', 28); flatPlane(L, 400, 400, 0, 0, -.02, 0, lawnTex);
  for (let i = 0; i < 8; i++) flatPlane(L, 1.5, 22, 0x68a049, -7.5 + i * 2, .004, 0).material.color.set(i % 2 ? 0x73ae52 : 0x66a047);
  flatPlane(L, 22, 22, 0x7bb356, 14.5, .005, 0);
  box(L, -.5, .01, -6.2, 1.8, .03, 11, 0xd9d2c2, { cast: false });
  { const H = new THREE.Group(); H.position.set(-.5, 0, -14); L.add(H);
    box(H, 0, 2.4, 0, 11, 4.8, 7, 0xf2e2c4);
    for (const s of [-1, 1]) { const r = box(H, s * 2.95, 5.65, 0, 6.4, .35, 8, 0x8a3a2e, { rz: -s * .52 }); }
    box(H, 0, 5.1, -3.9, 11, 1.3, .3, 0xf2e2c4); box(H, 3.6, 6.2, -1.2, 1, 2.4, 1, 0xa5503a);
    box(H, -2.2, .95, 3.56, 1.5, 1.9, .12, 0x7a4a28); put(H, new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), mat(0xe8c24a)), -1.7, .95, 3.68);
    for (const [x, y] of [[2.1, 2.7], [-3.8, 2.7], [3.7, 2.7], [-3.8, 1.2]]) { box(H, x, y, 3.56, 1.5, 1.3, .1, 0xffffff); box(H, x, y, 3.6, 1.3, 1.1, .06, 0x9fd0f0, { m: { roughness: .1, metalness: .2 } }); box(H, x, y, 3.64, .06, 1.1, .05, 0xffffff); box(H, x, y, 3.64, 1.3, .06, .05, 0xffffff); }
    box(H, -4.3, .5, 4.1, 3, 1, 1.2, 0x3f8a3c); }
  tree(L, -8.2, -5, 1.6, 3); tree(L, -9.5, 5, 1.9, 8); tree(L, 12.5, -9, 2.0, 5); tree(L, 15, 5, 1.7, 13);
  for (let i = 0; i < 40; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.07, 6, 5), mat([0xffd92a, 0xff6b8a, 0xffffff, 0xc77dff][i % 4])); f.position.set(-8 + cr(i, 3) * 9.5, .08, -6 + cr(i, 4) * 14); L.add(f); }
  { const N = new THREE.Group(); N.position.set(15, 0, -10); L.add(N); box(N, 0, 2.1, 0, 7, 4.2, 6, 0xc9d8e8); for (const s of [-1, 1]) box(N, s * 1.7, 5, 0, 4.2, .3, 7, 0x42536b, { rz: -s * .5 }); box(N, -1.5, 1.2, 3.02, 1.4, 1.5, .1, 0xffffff);
    const D = new THREE.Group(); D.position.set(8.2, 0, 3); L.add(D); box(D, 0, .5, 0, 1.3, 1, 1.5, 0xb6452f); for (const s of [-1, 1]) box(D, s * .42, 1.15, 0, .85, .08, 1.7, 0x6c2a1e, { rz: -s * .8 }); box(D, 0, .4, .76, .5, .8, .05, 0x1a0f0a); }
  { const ct = cvs(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.5, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }); for (let i = 0; i < 10; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ct.t, transparent: true, opacity: .8, fog: false, depthWrite: false })); sp.position.set(-70 + i * 16, 38 + cr(i, 1) * 14, -90 - cr(i, 2) * 30); sp.scale.set(38, 12, 1); L.add(sp); } }
  const FX = 2.6; const pickets = []; const fenceG = new THREE.Group(); L.add(fenceG); const railsG = [];
  { const pg = new THREE.BoxGeometry(.06, 1.15, .22); const pm = mat(0xfafafa, { roughness: .6 }); const tg = new THREE.ConeGeometry(.155, .2, 4); for (let i = 0; i < 15; i++) { const z = -3.5 + i * .5; const g = new THREE.Group(); g.position.set(FX, 0, z); const b = new THREE.Mesh(pg, pm); b.position.y = .575; b.castShadow = true; b.receiveShadow = true; g.add(b); const t = new THREE.Mesh(tg, pm); t.position.y = 1.2; t.rotation.y = Math.PI / 4; t.scale.set(.5, 1, 1.4); t.castShadow = true; g.add(t); fenceG.add(g); pickets.push({ g, z }); }
    for (const y of [.3, .85]) railsG.push(box(fenceG, FX - .07, y, 0, .06, .08, 7.3, 0xeeeeee)); }
  // sign
  const sign = new THREE.Group(); L.add(sign);
  { box(sign, 0, 1.1, 0, .13, 2.2, .13, 0x6b4a2a);
    const st = cvs(512, 400, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c4161c'; g.lineWidth = 16; g.strokeRect(10, 10, w - 20, h - 20);
      g.save(); g.translate(256, 150); g.fillStyle = '#222'; g.fillRect(-58, -18, 96, 50); g.fillRect(34, -48, 40, 38); g.fillRect(62, -34, 24, 18); g.fillRect(-58, 28, 18, 38); g.fillRect(-26, 28, 18, 38); g.fillRect(14, 28, 18, 38); g.fillRect(40, 28, 18, 38); g.fillRect(-78, -40, 18, 38); g.fillRect(38, -66, 14, 22); g.restore();
      g.strokeStyle = '#c4161c'; g.lineWidth = 22; g.beginPath(); g.arc(256, 150, 112, 0, 7); g.stroke(); g.beginPath(); g.moveTo(177, 71); g.lineTo(335, 229); g.stroke();
      txt(g, 'NO DOGS', w / 2, 330, 104, '#c4161c'); });
    const bd = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.17, .07), [mat(0xdddddd), mat(0xdddddd), mat(0xdddddd), mat(0xdddddd), new THREE.MeshStandardMaterial({ map: st.t, roughness: .5 }), new THREE.MeshStandardMaterial({ map: st.t, roughness: .5 })]); bd.position.set(0, 1.62, .05); bd.castShadow = true; sign.add(bd); }
  const SGN = V3(-.5, 0, 1.0), SYAW = .55; sign.position.copy(SGN); sign.rotation.y = SYAW; sign.visible = false;
  // =============================================================== dog (golden, blocky)
  const dog = new THREE.Group(); S.add(dog); const dogP = {};
  { const fur = 0xe3a93c, dark = 0xb4741c, lite = 0xf7dfa0; const c = (k, m) => { dogP[k] = m; return m; };
    c('body', put(dog, rbox(.34, .3, .62, fur), 0, .36, 0)); put(dog, rbox(.3, .12, .5, lite), 0, .24, .02);
    const hd = new THREE.Group(); hd.position.set(0, .6, .36); dog.add(hd); dogP.head = hd; put(hd, rbox(.3, .27, .27, fur), 0, 0, 0); put(hd, rbox(.2, .14, .17, lite), 0, -.06, .14); put(hd, rbox(.08, .06, .05, 0x1a1a1a), 0, -.02, .24);
    c('tongue', put(hd, rbox(.07, .02, .1, 0xff7a98), 0, -.13, .2));
    for (const sx of [-1, 1]) { put(hd, rbox(.05, .05, .03, 0x111111), sx * .08, .06, .14); put(hd, rbox(.07, .2, .12, dark), sx * .17, 0, -.03, 0, 0, sx * .25); }
    dogP.legs = [[-.1, .2], [.1, .2], [-.1, -.2], [.1, -.2]].map(([x, z]) => { const p = new THREE.Group(); p.position.set(x, .26, z); dog.add(p); const l = rbox(.1, .28, .12, fur); l.position.y = -.14; p.add(l); const f = rbox(.11, .05, .15, lite); f.position.set(0, -.27, .02); p.add(f); return p; });
    const tp = new THREE.Group(); tp.position.set(0, .44, -.3); dog.add(tp); dogP.tail = tp; const tl2 = rbox(.14, .6, .14, fur); tl2.position.y = .3; tp.add(tl2); const tl3 = rbox(.22, .2, .2, lite); tl3.position.y = .6; tp.add(tl3); }
  dog.visible = false;
  const setDog = (d) => { const s = d.s ?? 1.35, sit = d.sit || 0, lie = d.lie || 0; dog.visible = true; dog.scale.setScalar(s); dog.position.set(d.x, d.y - .17 * sit * s - .1 * lie * s, d.z); dog.rotation.set((d.pitch || 0) - .72 * sit, d.yaw || 0, d.roll || 0, 'YXZ');
    dogP.legs.forEach((p, i) => { const hind = i > 1; p.rotation.x = d.run ? Math.sin(d.run + (i % 2 ? Math.PI : 0) + (hind ? Math.PI * .5 : 0)) * .9 : 0; if (sit && hind) p.rotation.x = -1.35 * sit; p.scale.set(1, lie ? .35 : 1, 1); p.position.y = lie ? .18 : .26; });
    dogP.tail.rotation.set(-.15 - .35 * sit + lie * 1.1, 0, Math.sin(d.wag || 0) * (.6 - lie * .25)); dogP.tongue.visible = !!d.tongue; dogP.head.rotation.set(d.hx || 0, d.hy || 0, 0); dogP.tail.scale.setScalar(1 + (d.tailBig || 0) * .5); };
  // =============================================================== UNDERGROUND cross-section + Earth (beats 1, 2)
  const dirtTex = (base, stones = 0) => { const q = cvs(128, 128, (g) => { g.fillStyle = base; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(${cr(i, 20) < .5 ? '255,235,200' : '30,15,5'},${.07 + cr(i, 21) * .1})`; const s = 2 + cr(i, 22) * 5; g.fillRect(cr(i, 23) * 128, cr(i, 24) * 128, s, s); } for (let i = 0; i < stones; i++) { g.fillStyle = '#8f8a82'; g.fillRect(cr(i, 25) * 110, cr(i, 26) * 110, 7 + cr(i, 27) * 9, 6 + cr(i, 28) * 6); } }); return q.t; };
  const dmat = (base, stones) => new THREE.MeshStandardMaterial({ map: dirtTex(base, stones), roughness: 1 });
  const matTop = dmat('#5b3a1d', 0), matMid = dmat('#8c5a2e', 0), matBot = dmat('#6a4424', 8);
  const SZ0 = -.5, SZ1 = .55, SD = SZ1 - SZ0, SZC = (SZ0 + SZ1) / 2;
  const sbox = (x0, x1, y0, y1, m) => { const b = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y0 - y1, SD), m); b.position.set((x0 + x1) / 2, (y0 + y1) / 2, SZC); b.castShadow = true; b.receiveShadow = true; U.add(b); return b; };
  box(U, 0, -1.2, -.58, 9, 2.4, .1, 0x2a1a0e); box(U, 0, -2.5, -.6, 9, .3, .1, 0x2a1a0e);
  sbox(-4, -1.9, 0, -.5, matTop); sbox(-1.1, 1.1, 0, -.5, matTop); sbox(1.9, 4, 0, -.5, matTop); sbox(-4, -1.9, -.5, -1.5, matMid); sbox(1.9, 4, -.5, -1.5, matMid); sbox(-4, 4, -1.5, -2.4, matBot);
  const plugs = {}; plugs.L1 = sbox(-1.9, -1.1, 0, -.5, matTop); plugs.L2 = sbox(-1.9, -1.1, -.5, -1.5, matMid); plugs.R2 = sbox(1.1, 1.9, -.5, -1.5, matMid); plugs.R1 = sbox(1.1, 1.9, 0, -.5, matTop);
  plugs.H = []; for (let i = 0; i < 8; i++) plugs.H.push(sbox(-1.1 + i * .275, -1.1 + (i + 1) * .275, -.5, -1.5, matMid));
  const plugList = [plugs.L1, plugs.L2, ...plugs.H, plugs.R2, plugs.R1]; const plugS = plugList.map((p) => p.scale.clone());
  const capM = mat(0x4fa03a); for (const [a, b] of [[-4, -1.9], [-1.1, 1.1], [1.9, 4]]) { const c = new THREE.Mesh(new THREE.BoxGeometry(b - a, .14, SD + .02), capM); c.position.set((a + b) / 2, .07, SZC); c.receiveShadow = true; U.add(c); }
  const capL = new THREE.Mesh(new THREE.BoxGeometry(.8, .14, SD + .02), capM); capL.position.set(-1.5, .07, SZC); U.add(capL); const capR = capL.clone(); capR.position.x = 1.5; U.add(capR);
  box(U, -2.6, -2.0, SZ1 + .01, .5, .12, .05, 0xf4efe2); box(U, -2.78, -2.0, SZ1 + .01, .14, .2, .05, 0xf4efe2); box(U, -2.42, -2.0, SZ1 + .01, .14, .2, .05, 0xf4efe2);
  const board = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat(0xfafafa, { roughness: .6 })); board.castShadow = true; U.add(board); const boardTip = new THREE.Mesh(new THREE.ConeGeometry(.1, .22, 4), mat(0xfafafa)); boardTip.rotation.y = Math.PI / 4; U.add(boardTip);
  const slit = new THREE.Mesh(new THREE.BoxGeometry(1, 1, .02), new THREE.MeshStandardMaterial({ color: 0x120a06, roughness: 1 })); U.add(slit);
  const ER = 40; let earthDisc;
  { const ft = cvs(2048, 2048, (g, w) => { const c = w / 2, sc = c / ER; const ring = (r0, r1, a, b) => { const gr = g.createRadialGradient(c, c, r0 * sc, c, c, r1 * sc); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.beginPath(); g.arc(c, c, r1 * sc, 0, 7); g.fill(); };
      ring(0, ER, '#6a4424', '#6a4424'); ring(ER * .55, ER * .94, '#b83a14', '#e8731f'); ring(ER * .2, ER * .55, '#f7a21b', '#f6c433'); g.fillStyle = '#fff0b0'; g.beginPath(); g.arc(c, c, ER * .2 * sc, 0, 7); g.fill();
      g.fillStyle = '#6a4424'; g.beginPath(); g.arc(c, c, ER * sc, 0, 7); g.arc(c, c, ER * .94 * sc, 0, 7, true); g.fill('evenodd');
      for (let i = 0; i < 90; i++) { const a = cr(i, 31) * 6.283, r = (ER * .94 + cr(i, 32) * (ER * .05)) * sc; g.fillStyle = `rgba(0,0,0,${.07 + cr(i, 33) * .1})`; g.fillRect(c + Math.cos(a) * r, c + Math.sin(a) * r, 6 + cr(i, 34) * 14, 6 + cr(i, 35) * 12); }
      for (let i = 0; i < 40; i++) { const a = cr(i, 36) * 6.283, r = (ER * .55 + cr(i, 37) * ER * .39) * sc; g.fillStyle = 'rgba(255,230,170,.10)'; g.beginPath(); g.arc(c + Math.cos(a) * r, c + Math.sin(a) * r, 8 + cr(i, 38) * 22, 0, 7); g.fill(); }
      g.lineWidth = 12; g.strokeStyle = '#4fa03a'; g.beginPath(); g.arc(c, c, (ER - .15) * sc, 0, 7); g.stroke(); });
    const sideT = cvs(512, 64, (g, w, h) => { g.fillStyle = '#3f9a3a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 9; i++) { g.fillStyle = '#2b7ed8'; g.fillRect(cr(i, 41) * w, 8, 30 + cr(i, 42) * 50, h - 16); } });
    earthDisc = new THREE.Mesh(new THREE.CylinderGeometry(ER, ER, 1.0, 200, 1), [new THREE.MeshStandardMaterial({ map: sideT.t, roughness: 1 }), new THREE.MeshStandardMaterial({ map: ft.t, roughness: 1 }), new THREE.MeshStandardMaterial({ map: ft.t, roughness: 1 })]); earthDisc.rotation.x = Math.PI / 2; earthDisc.position.set(0, -ER, -1.1); earthDisc.receiveShadow = true; U.add(earthDisc); }
  const stars = (() => { const pts = []; for (let i = 0; i < 900; i++) { const a = cr(i, 51) * 6.283, b = Math.acos(2 * cr(i, 52) - 1), d = 700; pts.push(ORG.U[0] + Math.cos(a) * Math.sin(b) * d, -40 + Math.cos(b) * d, Math.sin(a) * Math.sin(b) * d); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false, transparent: true, opacity: 0 })); S.add(m); return m; })();
  const topHouse = new THREE.Group(); U.add(topHouse); topHouse.position.set(7, 0, 0); { box(topHouse, 0, 1.4, 0, 3.4, 2.8, 2.4, 0xf2e2c4); for (const s of [-1, 1]) box(topHouse, s * .9, 3.15, 0, 2.2, .24, 2.8, 0x8a3a2e, { rz: -s * .62 }); box(topHouse, -.6, .8, 1.22, .8, 1.6, .06, 0x7a4a28); box(topHouse, .9, 1.7, 1.22, .9, .8, .06, 0x9fd0f0); } topHouse.visible = false;
  // =============================================================== CHINA street (beat 3)
  const paveT = cvs(512, 512, (g, w) => { g.fillStyle = '#c9b99a'; g.fillRect(0, 0, w, w); g.strokeStyle = 'rgba(80,60,40,.35)'; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, w); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); } for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(60,40,20,${.04 + cr(i, 60) * .06})`; g.fillRect(cr(i, 61) * w, cr(i, 62) * w, 3 + cr(i, 63) * 6, 3 + cr(i, 64) * 6); } }); paveT.t.wrapS = paveT.t.wrapT = THREE.RepeatWrapping; paveT.t.repeat.set(18, 18);
  flatPlane(C, 160, 160, 0, 0, 0, 0, paveT.t);
  const RED = 0xc8281e, GOLD = 0xe8b930, DRED = 0x8a1a14, TEAL = 0x2d6b66;
  { const P = new THREE.Group(); P.position.set(0, 0, -15); C.add(P); box(P, 0, .3, 0, 8, .6, 8, 0xb9ae98);
    for (let k = 0; k < 4; k++) { const w = 4.6 - k * .8, y0 = .6 + k * 2.1; box(P, 0, y0 + .75, 0, w, 1.5, w, RED); box(P, 0, y0 + .75, w / 2 + .01, w * .45, 1.1, .05, 0x4a2410); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(P, sx * (w / 2 - .12), y0 + .75, sz * (w / 2 - .12), .22, 1.5, .22, DRED);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(w * .95, .95, 4), mat(TEAL, { roughness: .5 })); cone.rotation.y = Math.PI / 4; cone.position.y = y0 + 1.5 + .4; cone.castShadow = true; P.add(cone); box(P, 0, y0 + 1.5 + .03, 0, w * 1.4, .08, w * 1.4, GOLD, { ry: Math.PI / 4 }); }
    const sp = new THREE.Mesh(new THREE.CylinderGeometry(.06, .1, 1.6, 8), mat(GOLD, { metalness: .5 })); sp.position.y = 10.2; P.add(sp); put(P, new THREE.Mesh(new THREE.SphereGeometry(.22, 10, 8), mat(GOLD, { metalness: .5 })), 0, 9.6, 0); }
  for (const s of [-1, 1]) { const B = new THREE.Group(); B.position.set(s * 9.5, 0, -2 - (s > 0 ? 1 : 0)); C.add(B); box(B, 0, 1.9, 0, 5, 3.8, 6, s > 0 ? 0xf0e4c8 : 0xe6d3b0); box(B, 0, 4.1, 0, 5.4, .5, 6.4, TEAL); for (let i = 0; i < 3; i++) box(B, -s * 2.55, 2.4, -2 + i * 2, .12, 1.2, 1.1, 0x4a2410); box(B, -s * 2.75, 3.3, 0, 1.2, .1, 6.2, RED, { rz: s * .45 }); }
  const lanternG = new THREE.Group(); C.add(lanternG); const lanterns = [];
  { const lm = new THREE.MeshStandardMaterial({ color: 0xe0281c, emissive: 0xff3a10, emissiveIntensity: .55, roughness: .4 }); const sg = new THREE.SphereGeometry(.34, 16, 12); const cap = new THREE.CylinderGeometry(.16, .16, .08, 10); const capM2 = mat(GOLD, { metalness: .6, roughness: .35 });
    const mkL = (x, y, z, s = 1) => { const g = new THREE.Group(); g.position.set(x, y, z); const b = new THREE.Mesh(sg, lm); b.scale.set(s, .85 * s, s); g.add(b); const c1 = new THREE.Mesh(cap, capM2); c1.position.y = .3 * s; g.add(c1); const c2 = c1.clone(); c2.position.y = -.3 * s; g.add(c2); const ts = new THREE.Mesh(new THREE.BoxGeometry(.04, .3, .04), capM2); ts.position.y = -.5 * s; g.add(ts); lanternG.add(g); lanterns.push({ g, y, x, z }); return g; };
    for (const zz of [-6, -2.5]) { for (const sx of [-1, 1]) box(lanternG, sx * 5.2, 2.6, zz, .16, 5.2, .16, DRED); const N = 11; for (let i = 0; i < N; i++) { const u = i / (N - 1), x = lerp(-5.2, 5.2, u), y = 4.9 - Math.sin(u * Math.PI) * .75; mkL(x, y - .5, zz); } box(lanternG, 0, 4.6, zz, 10.4, .03, .03, 0x2a1a14, { cast: false }); }
    for (const sx of [-1, 1]) for (const zz of [1.5, 5]) { box(lanternG, sx * 5.8, 1.9, zz, .14, 3.8, .14, DRED); mkL(sx * 5.8, 3.8, zz, 1.15); } }
  { const bt = cvs(1024, 256, (g, w, h) => { g.fillStyle = '#c8281e'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e8b930'; g.lineWidth = 12; g.strokeRect(10, 10, w - 20, h - 20); txt(g, 'WE LOVE DOG', 590, 134, 120, '#ffe08a', { stroke: '#5a0f0a', sw: 14 });
      g.fillStyle = '#ffe08a'; g.beginPath(); g.ellipse(150, 160, 46, 38, 0, 0, 7); g.fill(); for (const [dx, dy] of [[-58, -6], [-20, -32], [22, -32], [60, -6]]) { g.beginPath(); g.ellipse(150 + dx, 140 + dy, 17, 22, 0, 0, 7); g.fill(); } });
    const bn = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.6), new THREE.MeshStandardMaterial({ map: bt.t, roughness: .8, side: THREE.DoubleSide })); bn.position.set(0, 3.9, -4.2); C.add(bn); for (const sx of [-1, 1]) box(C, sx * 3.3, 2.3, -4.2, .14, 4.6, .14, DRED); }
  { const ring = new THREE.Mesh(new THREE.CylinderGeometry(.95, 1.05, .1, 32), mat(0x7a5a38)); ring.position.set(0, .05, 0); ring.receiveShadow = true; C.add(ring); const hole = new THREE.Mesh(new THREE.CircleGeometry(.78, 32), new THREE.MeshBasicMaterial({ color: 0x0a0604 })); hole.rotation.x = -Math.PI / 2; hole.position.set(0, .106, 0); C.add(hole); }
  // =============================================================== LIVING ROOM (beat 5)
  { const woodT = cvs(512, 512, (g, w) => { g.fillStyle = '#b8864f'; g.fillRect(0, 0, w, w); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#a97a45' : '#c0905a'; g.fillRect(0, i * 64, w, 62); g.fillStyle = 'rgba(60,35,15,.4)'; g.fillRect(0, i * 64 + 62, w, 2); for (let j = 0; j < 3; j++) g.fillRect((cr(i, 70 + j) * w) | 0, i * 64, 2, 62); } }); woodT.t.wrapS = woodT.t.wrapT = THREE.RepeatWrapping; woodT.t.repeat.set(2, 1.5);
    flatPlane(R, 12, 9, 0, 0, .001, .5, woodT.t); flatPlane(R, 200, 200, 0x6fa84e, 0, -.03, -105);
    const wallC = 0xf1e6d2; const wall = (x0, x1, y0, y1) => box(R, (x0 + x1) / 2, (y0 + y1) / 2, -3.1, x1 - x0, y1 - y0, .2, wallC);
    wall(-6, -2.3, 0, 3.2); wall(.5, 6, 0, 3.2); wall(-2.3, .5, 0, 1.15); wall(-2.3, .5, 2.55, 3.2);
    box(R, -1.9, 1.85, -3.0, .12, 1.5, .12, 0xffffff); box(R, .1, 1.85, -3.0, .12, 1.5, .12, 0xffffff); box(R, -.9, 2.55, -3.0, 2.9, .12, .12, 0xffffff); box(R, -.9, 1.15, -2.95, 2.9, .1, .3, 0xffffff);
    box(R, -6, 1.6, .2, .2, 3.2, 7, 0xe8dcc4); box(R, 0, .06, -3.0, 12, .12, .1, 0xcfc4a8, { cast: false });
    const hs = cvs(512, 320, (g, w, h) => { g.fillStyle = '#7a4a28'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff4dc'; g.fillRect(18, 18, w - 36, h - 36); txt(g, 'HOME', w / 2, 120, 120, '#c8281e'); txt(g, 'SWEET HOME', w / 2, 224, 66, '#3a2a1a'); });
    const hsm = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.06), new THREE.MeshStandardMaterial({ map: hs.t, roughness: .8 })); hsm.position.set(3.2, 2.0, -2.98); R.add(hsm);
    const CU = new THREE.Group(); CU.position.set(0, 0, -2.2); R.add(CU); const cm = 0x3f6fb5, cd = 0x2f5594;
    box(CU, 0, .22, 0, 3.8, .44, 1.3, cd); box(CU, -.95, .55, .12, 1.8, .24, 1.0, cm); box(CU, .95, .55, .12, 1.8, .24, 1.0, cm); box(CU, 0, .85, -.55, 3.8, .95, .3, cd); box(CU, -1.95, .62, .1, .3, .75, 1.2, cd); box(CU, 1.95, .62, .1, .3, .75, 1.2, cd);
    box(CU, 1.5, .85, .15, .45, .45, .15, 0xffd23f, { rz: .3 }); box(CU, -1.5, .85, .15, .45, .45, .15, 0xff7a59, { rz: -.2 });
    flatPlane(R, 4.6, 3.2, 0xc8281e, 0, .004, 1.3); flatPlane(R, 4.0, 2.6, 0xf4e2b8, 0, .006, 1.3);
    box(R, -4.4, .75, -2.4, .5, 1.5, .5, 0x6b4a2a); put(R, new THREE.Mesh(new THREE.ConeGeometry(.55, .6, 12, 1, true), new THREE.MeshStandardMaterial({ color: 0xffe08a, emissive: 0xffd070, emissiveIntensity: .35, side: THREE.DoubleSide })), -4.4, 1.8, -2.4);
    box(R, -5.85, 1.15, 1.8, .1, 2.3, 1.2, 0x7a4a28);
    const bone = new THREE.Group(); box(bone, 0, 0, 0, .5, .12, .12, 0xf4efe2); for (const s of [-1, 1]) { box(bone, s * .27, .06, .05, .14, .14, .14, 0xf4efe2); box(bone, s * .27, .06, -.05, .14, .14, .14, 0xf4efe2); } bone.position.set(-2.6, .1, 1.5); R.add(bone); }
  // =============================================================== people
  const NPEOPLE = 20; const crowd = new Crowd(S, NPEOPLE, 91); const PP = crowd.p; const YOU = PP[0], NEI = PP[1];
  const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  col(0, ['torso', 'armL', 'armR'], 0x3a78d8); col(0, ['legL', 'legR'], 0x2b3347); col(0, ['hair'], 0x4a2f1c); col(0, ['head', 'neck', 'handL', 'handR'], 0xe8b48a);
  col(1, ['torso', 'armL', 'armR'], 0x3f9a58); col(1, ['legL', 'legR'], 0x55504a); col(1, ['hair'], 0xb9b4aa); col(1, ['head', 'neck', 'handL', 'handR'], 0xd9a07a);
  const SHIRTC = [0xc8281e, 0xe8b930, 0x2d6b66, 0xe66a2c, 0xd9d2c2, 0x8a1a14]; const SKINC = [0xe9c29a, 0xdfb08a, 0xd4a07a, 0xe8bd95];
  for (let i = 2; i < NPEOPLE; i++) { col(i, ['torso', 'armL', 'armR'], SHIRTC[i % 6]); col(i, ['legL', 'legR'], [0x22262e, 0x3a3f4a, 0x2a2a30][i % 3]); col(i, ['hair'], 0x14110e); col(i, ['head', 'neck', 'handL', 'handR'], SKINC[i % 4]); }
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; o.h = 1; };
  const hide = (o) => { o.vis = false; o.x = 0; o.y = -50; o.z = 0; };
  const hammer = new THREE.Group(); { box(hammer, 0, -.22, 0, .05, .44, .05, 0x8a5a30); box(hammer, 0, -.45, 0, .09, .1, .26, 0x4a4e57, { m: { metalness: .7, roughness: .35 } }); hammer.visible = false; S.add(hammer); }
  const thumb = new THREE.Group(); { const th = rbox(.07, .07, .16, 0xd9a07a); th.position.set(0, -.02, .1); thumb.add(th); thumb.visible = false; S.add(thumb); }
  const dirtP = new Particles(S, 60, 0x7a4a26, .075, { rough: 1 });
  const lbWoof = mkLabel('WOOF!', '#ffe23a', '#111', 400, 110), lbClever = mkLabel('CLEVER!', '#ffe23a', '#111'), lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111', 900, 108), lbYou = mkLabel('YOU', '#ffffff', '#111', 360, 120), lbChina = mkLabel('CHINA', '#ffd92a', '#111', 560, 120), lbGood = mkLabel('GOOD BOY', '#ffe23a', '#111', 760, 112), lbThanks = mkLabel('THANKS!', '#ffffff', '#111', 640, 120), lbPlus = mkLabel('+1', '#ff5a4a', '#111', 300, 120);
  const LBS = [lbWoof, lbClever, lbBetter, lbYou, lbChina, lbGood, lbThanks, lbPlus];
  // =============================================================== camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3();
  const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t, shake = 0, off = [0, 0, 0]) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u) + off[0], lerp(e0[1], e1[1], u) + off[1], lerp(e0[2], e1[2], u) + off[2]); T2.set(lerp(g0[0], g1[0], u) + off[0], lerp(g0[1], g1[1], u) + off[1], lerp(g0[2], g1[2], u) + off[2]); E.x += Math.sin(t * .9) * .03 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .025 + Math.cos(t * 57) * shake; E.z += Math.cos(t * .8) * .03; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .008); };
  const dk = (x, y, z) => [x, y, z];
  const skyU = A.sky.material.uniforms; const skyBase = { top: skyU.top.value.clone(), mid: skyU.mid.value.clone(), bot: skyU.bot.value.clone() }; const skySpace = { top: new THREE.Color(0x03040c), mid: new THREE.Color(0x070a1c), bot: new THREE.Color(0x0b1030) };
  globalThis.__post.pm.uniforms.amt.value = 4.5; globalThis.__post.pm.uniforms.band.value = .3;
  const FOGC = new THREE.Color(0xbcd8ee), FOGSP = new THREE.Color(0x070a1c);
  const fenceVisible = (on) => { pickets.forEach((pk) => { pk.g.visible = on; pk.g.scale.set(1, 1, 1); }); railsG.forEach((r) => { r.visible = on; r.scale.z = 1; r.position.z = 0; }); };

  // ============================================================================ frame
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    L.visible = bi === 0 || bi === 4; U.visible = bi === 1 || bi === 2; C.visible = bi === 3; R.visible = bi === 5;
    let faceShock = false; let focus = [0, 0]; let spaceU = 0; let counter = null; let an = {};
    PP.forEach((o) => hide(o)); dog.visible = false; hammer.visible = false; thumb.visible = false; dirtP.clear(); sign.visible = false; hearts.forEach((h) => { h.visible = false; }); LBS.forEach((s) => { s.visible = false; }); topHouse.visible = false;
    let hammerFor = null;
    if (bi === 0) {
      const CY = .85; let visits = 0; const dpos = V3(6, 0, 1.2); let dyaw = Math.PI / 2, run = 0, sit = 0;
      const zz = [1.2, -.8, .6];
      if (lt < 2.55) { const k = Math.min(2, Math.floor(lt / CY)), c = lt - k * CY; const z0 = zz[k];
        if (c < .3) { const u = c / .3; dpos.set(lerp(6.2, -1.0, u), 0, z0); dyaw = -Math.PI / 2; run = t * 26; }
        else if (c < .55) { const u = (c - .3) / .25; const a = u * 6.283; dpos.set(-1.0 + Math.sin(a) * .5, Math.abs(Math.sin(u * 9)) * .12, z0 + (1 - Math.cos(a)) * .5); dyaw = -Math.PI / 2 + a; run = t * 22; }
        else { const u = (c - .55) / .3; dpos.set(lerp(-1.0, 6.2, smooth(u)), 0, z0); dyaw = Math.PI / 2; run = t * 26; }
        visits = c >= .3 ? k + 1 : k;
        if (c > .3 && c < .75) lbShow(lbPlus, true, V3(dpos.x - .2, 1.7 + (c - .3) * .8, dpos.z), .5, Math.min(1, (c - .3) * 8));
      } else { visits = 3; dpos.set(4.9, 0, clamp(lerp(-3.5, 3.4, smooth((lt - 2.55) / 2.0)) - 1.6, -2.2, 1.6)); dyaw = -Math.PI / 2 - .35 + Math.sin(t * 2) * .12; sit = 1; }
      setDog({ x: dpos.x, y: dpos.y, z: dpos.z, yaw: dyaw, run, wag: t * 18, tongue: true, sit });
      const bt = lt - 2.55; const bu = smooth(bt / 2.0);
      if (lt < 2.55) { place(YOU, -3.6, 0, -1.5, Math.PI / 2 - .5 + Math.sin(lt * 1.1) * .08, 'idle', .4); YOU.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 }; faceShock = lt > .5; }
      else { const yz = lerp(-3.5, 3.4, bu); place(YOU, 1.95, 0, yz, Math.PI / 2, 'idle', .6);
        if (bt < .35) { const w = smooth(bt / .35); YOU.x = lerp(-3.6, 1.95, w); YOU.z = lerp(-1.5, -3.5, w); YOU.anim = 'walk'; YOU.speed = 1.6; YOU.yaw = Math.PI / 2 - .4 * (1 - w); }
        YOU.arms = { lx: -1.15, lz: -.1, rx: -1.8 - Math.sin(bt * 17) * .6, rz: .1 }; YOU.pitch = .12; hammerFor = YOU; }
      if (lt >= 2.55) { const zy = YOU.z; pickets.forEach((pk) => { const e = smooth((zy + .35 - pk.z) / .5); pk.g.visible = bt > .3 && e > 0; const pop = 1 + Math.sin(e * Math.PI) * .12; pk.g.scale.set(1, Math.max(.01, e) * pop, 1); }); railsG.forEach((r) => { r.visible = bt > .4; const sc = Math.max(.01, smooth((zy + 3.7) / 7.4)); r.scale.z = sc; r.position.z = -3.7 + 3.7 * sc; }); }
      else fenceVisible(false);
      if (lt >= 2.55) fenceVisible2(); function fenceVisible2() { }
      counter = ['DOG VISITS', String(lt >= 2.55 ? 3 : visits), lt >= 2.55 ? 'fence time' : ['it likes your grass', 'it really likes your grass', 'it has a favorite spot'][Math.min(2, visits)], true];
      if (lt >= 2.55) lbShow(lbWoof, bt > .5 && bt < 1.2, V3(4.9, 1.9, .4), .45, Math.min(1, (bt - .5) * 6));
      rig(lt, [[0, dk(-6.2, 2.7, 9.6), dk(-4.6, 2.4, 9.2), dk(1.6, .9, 0), dk(1.6, .9, 0), 50, 46], [2.4, (a) => [-3.6, 2.3, a.yz + 7.4], (a) => [-3.2, 2.3, a.yz + 7.0], (a) => [2.3, .95, a.yz], (a) => [2.4, .95, a.yz], 46, 44]], { yz: clamp(YOU.z, -3.5, 3.4) }, t);
    } else if (bi === 1) {
      const ph = lt; let dx = -1.2, dy = 0, pitch = 0, run = 0, hy = 0, wag = t * 14, dsit = 0, tongue = false; let digging = false;
      const T_DIG = 1.4, T_DESC = 1.85, T_HOR = 2.75, T_CLIMB = 3.1;
      if (ph < .9) { dx = -1.2; dsit = 1; hy = Math.sin(ph * 8) * .2; wag = t * 10; }
      else if (ph < T_DIG) { dx = -1.5; pitch = .75; digging = true; }
      else if (ph < T_DESC) { const u = smooth((ph - T_DIG) / (T_DESC - T_DIG)); dx = -1.5; dy = lerp(0, -1.5, u); pitch = u < .8 ? lerp(.75, 1.5, u / .8) : lerp(1.5, 0, (u - .8) / .2); digging = true; }
      else if (ph < T_HOR) { const u = (ph - T_DESC) / (T_HOR - T_DESC); dx = lerp(-1.5, 1.5, u); dy = -1.5; pitch = .12; run = t * 24; digging = true; }
      else if (ph < T_CLIMB) { const u = smooth((ph - T_HOR) / (T_CLIMB - T_HOR)); dx = 1.5; dy = lerp(-1.5, 0, u); pitch = u < .85 ? -1.25 * Math.sin(Math.min(1, u / .85) * Math.PI * .5) : lerp(-1.25, 0, (u - .85) / .15); digging = true; }
      else { const u = (ph - T_CLIMB) / (3.49 - T_CLIMB); dx = lerp(1.5, 2.6, smooth(u)); dy = Math.abs(Math.sin(u * 12)) * .12; run = u < .8 ? t * 20 : 0; tongue = true; }
      const hideAt = [T_DIG + .1, T_DIG + .3]; for (let i = 0; i < 8; i++) hideAt.push(T_DESC + ((-1.1 + (i + .5) * .275 + 1.5 - .5) / 3.0) * (T_HOR - T_DESC)); hideAt.push(T_HOR - .15, T_HOR + .1);
      plugList.forEach((pl, i) => { const k = clamp((ph - hideAt[i]) / .12); pl.visible = k < 1; pl.scale.set(plugS[i].x, plugS[i].y * (1 - k), plugS[i].z); });
      capL.visible = ph < T_DIG + .1; capR.visible = ph < T_HOR + .3;
      const OX = ORG.U[0];
      setDog({ s: 1.0, x: OX + dx, y: dy, z: 0, yaw: Math.PI / 2, pitch, run, wag, tongue, sit: dsit, hy });
      if (digging && ph < T_CLIMB + .1) { for (let i = 0; i < 40; i++) { const u = (ph * 1.1 + i * .043) % 1; let ox = dx + .05, oy = dy + .2; if (ph >= T_DESC && ph < T_HOR) { ox = dx - .45; oy = -1.3; } const vx = (cr(i, 80) - .5) * 2.2 - (ph >= T_DESC && ph < T_HOR ? 1.3 : 0), vy = 1.5 + cr(i, 81) * 2.4, tt = u * .8; dirtP.set(i, OX + ox + vx * tt, oy + vy * tt - 5 * tt * tt, .1 + (cr(i, 82) - .5) * .5, (1 - u) * .9 + .1); } dirtP.done(); }
      board.position.set(0, .46, SZC + .03); board.scale.set(.2, 1.08, SD + .12); board.position.y = .38; boardTip.position.set(0, 1.02, SZC + .03); boardTip.scale.set(1.4, 1, 3.3); slit.visible = false;
      lbShow(lbClever, ph > .12 && ph < 1.25, V3(OX - .9, 1.95, .6), .42, Math.min(1, (ph - .12) * 6));
      counter = ['DOG VISITS', ph >= T_CLIMB ? '4' : '3', ph >= T_CLIMB ? 'under the fence' : 'fence: installed', true];
      focus = [OX, 0];
      const cx = OX + clamp(dx * .75, -1.2, 1.4), cy = lerp(.35, -.55, smooth((ph - 1.3) / .5)) + (ph >= T_CLIMB ? .55 * smooth((ph - T_CLIMB) / .3) : 0);
      A.cam(cx - .15, cy + .45, 7.6, cx, cy, 0, 40, Math.sin(t * .7) * .008);
    } else if (bi === 2) {
      const OX = ORG.U[0]; const farU = smooth((lt - 2.75) / 3.2); const grow = smooth((lt - .55) / 1.7);
      const bottom = lt < 2.4 ? lerp(-.16, -2.3, grow) : lerp(-2.3, -ER * 2 + 1.4, smooth((lt - 2.3) / 2.6)); const wScale = lerp(1, 7.5, farU); const topY = .92;
      board.scale.set(.2 * wScale, topY - bottom, SD + .12); board.position.set(0, (topY + bottom) / 2, SZC + .03); boardTip.position.set(0, topY + .1 * wScale, SZC + .03); boardTip.scale.set(1.4 * wScale, wScale, 3.3);
      slit.visible = bottom < -2.4; slit.scale.set(.5 * wScale, Math.max(.01, -2.4 - bottom), 1); slit.position.set(0, (-2.4 + bottom) / 2, -.5);
      plugList.forEach((pl, i) => { pl.visible = true; pl.scale.copy(plugS[i]); }); capL.visible = true; capR.visible = true;
      if (lt < 2.6) { place(YOU, OX + 1.05, .14, 0, -Math.PI / 2, 'idle', .6); YOU.arms = { lx: -1.1, lz: -.1, rx: -1.9 - Math.sin(lt * 15) * .75, rz: .1 }; YOU.pitch = .12; hammerFor = YOU; }
      else { place(YOU, OX + 1.05, .14, 0, -.2, 'idle', .6); YOU.arms = { lx: -.2, lz: -.1, rx: -2.8 + Math.sin((lt - 2.6) * 11) * .15, rz: .25 }; YOU.pitch = -.05; }
      if (lt < 3.2) setDog({ s: 1.0, x: OX - 1.35, y: .14, z: 0, yaw: Math.PI / 2, wag: t * 4, sit: 1 });
      else setDog({ s: 6.5, x: OX, y: -ER * 2 - .35, z: .75, yaw: -.35, roll: Math.PI, wag: t * 16, tongue: true });
      topHouse.visible = farU > .25; topHouse.scale.setScalar(lerp(.01, 1.15, smooth((farU - .25) / .3))); stars.material.opacity = smooth((farU - .25) / .6);
      spaceU = smooth((farU - .1) / .65);
      lbShow(lbBetter, lt > 2.26 && lt < 3.3, V3(OX - .1, .4, .8), .36, Math.min(1, (lt - 2.26) * 6));
      lbShow(lbYou, farU > .8, V3(OX + 25, 7, 1), 6.5, Math.min(1, (farU - .8) * 8)); lbShow(lbChina, lt > 4.9, V3(OX + 14, -ER * 2 + 8, 1), 6.5, Math.min(1, (lt - 4.9) * 4));
      const g = smooth((lt - 1.0) / 4.6); const ft = 6 * Math.pow(42240000 / 6, g); const mi = ft / 5280;
      counter = ['FENCE DEPTH', lt < 1.0 ? '6 FT' : ft < 1e6 ? fmt(ft) + ' FT' : (g >= .995 ? '8,000 MILES' : fmt(Math.min(7999, mi)) + ' MILES'), ['fence: deeper', 'much deeper', 'other side of the world'][lt < 1.0 ? 0 : farU < .3 ? 1 : 2], true];
      focus = [OX, 0];
      const dFar = 255, dNear = 8.6; const dd = dNear * Math.pow(dFar / dNear, farU); const nt = smooth((lt - 1.0) / 1.3); const cy0 = lerp(.95, -.5, nt); const cyT = lerp(cy0, -55, farU); const ey = lerp(cy0 + .2, -55, farU); const ex = OX;
      const nearTilt = 0;
      A.cam(ex, ey + nearTilt * .4, dd, ex, cyT + nearTilt, 0, lerp(40, 46, farU), Math.sin(t * .7) * .006); faceShock = lt > 2.9;
    } else if (bi === 3) {
      const CZ = ORG.C[2]; const L0 = .35; const air = clamp((lt - L0) / .95);
      if (lt >= L0) { let dy = 0, dz = 0, pitch = 0, yaw = Math.PI, run = 0;
        if (lt < L0 + .95) { dy = Math.sin(air * Math.PI) * 3.0; dz = air * 2.4; pitch = -.5 * Math.cos(air * Math.PI); run = t * 20; }
        else { const l = lt - L0 - .95; dz = 2.4; dy = Math.exp(-l * 7) * Math.abs(Math.sin(l * 18)) * .1; yaw = Math.PI + Math.sin(l * 2.2) * 1.0; }
        setDog({ x: 0, y: dy, z: CZ + dz, yaw, pitch, run, wag: t * 18, tongue: true }); }
      for (let i = 0; i < 40; i++) { const u = clamp((lt - L0 + .05) / 1.1); const a = cr(i, 90) * 6.283; const r = u * (.6 + cr(i, 91) * 1.3); const hh = Math.sin(clamp(u * 1.3) * Math.PI) * (1 + cr(i, 92) * 2.2); if (u > 0 && u < 1) dirtP.set(i, Math.cos(a) * r, .1 + hh, CZ + Math.sin(a) * r, (1 - u) * .8 + .2); } dirtP.done();
      const N = 16; const ringR = 3.6;
      for (let i = 0; i < N; i++) { const o = PP[2 + i]; const th = Math.PI + ((i + .5) / N * 2 - 1) * 2.3; const rr = ringR + (i % 3) * .75; const tx = Math.sin(th) * rr, tz = Math.cos(th) * rr;
        const arrive = clamp((lt - (1.0 + cr(i, 93) * .55)) / .8); const px = lerp(Math.sin(th) * 11, tx, smooth(arrive)), pz = lerp(Math.cos(th) * 11, tz, smooth(arrive));
        place(o, px, 0, CZ + pz, Math.atan2(-px, -pz), arrive < 1 ? 'walk' : 'panic', arrive < 1 ? 1.1 : 1.0 + cr(i, 95) * .5); o.phase = cr(i, 96) * 6; if (arrive >= 1) o.y = Math.abs(Math.sin(t * 7 + i)) * .12; o.vis = lt > 1.0 + cr(i, 94) * .3 || (i % 3 === 0 && lt > .3); }
      faceShock = lt > 1.0;
      hearts.forEach((h, i) => { const l = lt - (2.2 + i * .2); if (l < 0 || l > 1.3) return; h.visible = true; h.position.set(Math.sin(i * 2.3) * 1.3, 1.5 + l * .6, CZ + 2.2 + Math.cos(i * 1.7) * .8); const s = .3 + Math.sin(clamp(l / .3) * Math.PI * .5) * .12; h.scale.set(s, s, 1); h.material.opacity = 1 - clamp((l - .9) / .4); });
      lbShow(lbWoof, lt > 1.5 && lt < 2.2, V3(.9, 2.3, CZ + 2.4), .5, Math.min(1, (lt - 1.5) * 6));
      const foll = lt < 2.0 ? 0 : lt < 3.5 ? Math.round(lerp(0, 3200, smooth((lt - 2.0) / 1.5))) : Math.round(lerp(3200, 1200000, Math.pow(smooth((lt - 3.5) / 1.8), 2.2)));
      counter = ['DOG FOLLOWERS', fmt(foll), lt < 2.0 ? 'just arrived' : lt < 3.5 ? 'making friends' : 'famous in China', foll > 1000];
      focus = [0, CZ];
      rig(lt, [[0, dk(.7, 1.1, CZ + 6.6), dk(.3, 1.3, CZ + 6.9), dk(0, 1.5, CZ + .6), dk(0, 1.3, CZ + 1.0), 54, 50], [1.7, dk(-1.6, 2.3, CZ + 8.6), dk(1.8, 2.6, CZ + 8.8), dk(0, .9, CZ + 1.2), dk(0, 1.1, CZ + 1.0), 48, 46], [3.6, dk(1.8, 2.2, CZ + 7.4), dk(-.4, 2.1, CZ + 6.2), dk(0, 1.0, CZ + 1.5), dk(0, .95, CZ + 1.6), 46, 40]], an, t);
    } else if (bi === 4) {
      fenceVisible(true);
      const D = V3(SGN.x + Math.sin(SYAW) * 2.0, 0, SGN.z + Math.cos(SYAW) * 2.0);
      sign.visible = true; const sp = smooth(clamp((lt - .1) / .35)); const drop = lt < .6 ? Math.max(0, 1 - clamp((lt - .1) / .5)) * 1.3 : 0; sign.position.set(SGN.x, -drop * 0, SGN.z); sign.scale.setScalar(.2 + .8 * sp);
      const walkOff = smooth((lt - 1.5) / .9);
      if (lt < 2.4) { place(YOU, lerp(SGN.x - 1.15, SGN.x - 4.2, walkOff), 0, lerp(SGN.z + .25, SGN.z - .6, walkOff), lt < 1.5 ? Math.PI / 2 - .2 : -Math.PI / 2 - .3, lt < 1.5 ? 'idle' : 'walk', lt < 1.5 ? .6 : 1.2); if (lt < 1.5) { YOU.arms = { lx: -1.1, lz: -.1, rx: -2.0 - Math.sin(lt * 16) * .7, rz: .1 }; YOU.pitch = .12; hammerFor = YOU; } }
      const arriveT = 2.55;
      if (lt >= arriveT && lt < 3.3) { const u = smooth((lt - arriveT) / .75); const sx = D.x + 3.5, sz = D.z + 3.5; setDog({ x: lerp(sx, D.x, u), y: 0, z: lerp(sz, D.z, u), yaw: Math.atan2(D.x - sx, D.z - sz), run: t * 26, wag: t * 20, tongue: true }); }
      else if (lt >= 3.3) { const l = lt - 3.3; const read = lt < 4.94; const sc = Math.sin((lt - 3.5) * 3.6); const happy = lt >= 4.94;
        setDog({ x: D.x, y: 0, z: D.z, yaw: SYAW + Math.PI + (read ? sc * .1 : 0), sit: smooth(l / .25), wag: t * (happy ? 28 : 7), tongue: happy, hy: read ? sc * .45 : 0, hx: read ? -.1 : 0, tailBig: happy ? 1 : 0 }); }
      hearts.forEach((h, i) => { const l = lt - (5.0 + i * .13); if (l < 0 || l > 1.7 || i > 8) return; h.visible = true; h.position.set(D.x + Math.sin(i * 2.1) * .7, 1.3 + l * .6, D.z + Math.cos(i * 1.3) * .3); const s = .28 + .08 * Math.sin(l * 9); h.scale.set(s, s, 1); h.material.opacity = 1 - clamp((l - 1.2) / .5); });
      lbShow(lbGood, lt > 5.2 && lt < 6.9, V3(D.x, 2.0, D.z), .42, Math.min(1, (lt - 5.2) * 6));
      faceShock = lt > 1.0 && lt < 2.0;
      counter = ['DOG VISITS TODAY', '0', lt < 2.55 ? 'sign: installed' : lt < 4.94 ? 'the dog can read' : 'a very good boy', false];
      focus = [0, 1];
      rig(lt, [[0, dk(-3.8, 1.7, 6.2), dk(-3.4, 1.6, 5.8), dk(SGN.x - .3, 1.2, SGN.z), dk(SGN.x, 1.3, SGN.z), 44, 42], [1.5, dk(-3.0, 1.4, 9.2), dk(-2.6, 1.3, 9.0), dk(.05, 1.3, 1.8), dk(.3, 1.3, 1.9), 44, 44], [3.2, dk(-2.6, 1.3, 9.0), dk(-2.2, 1.2, 8.4), dk(.4, 1.3, 2.0), dk(.5, 1.2, 2.1), 44, 42], [4.94, dk(1.0, .9, -1.2), dk(.9, .95, -.9), dk(D.x, .9, D.z), dk(D.x, .95, D.z), 42, 38]], an, t);
    } else {
      const RX = ORG.R[0];
      const dpath = (() => { if (lt < .75) { const u = lt / .75; return { x: lerp(-5.2, -1.3, smooth(u)), y: 0, z: lerp(1.8, -.6, smooth(u)), yaw: Math.atan2(3.9, -2.4), run: t * 24, lie: 0 }; }
        if (lt < 1.15) { const u = (lt - .75) / .4; return { x: lerp(-1.3, -1.0, u), y: Math.sin(u * Math.PI) * .55 + u * .5, z: lerp(-.6, -2.0, u), yaw: Math.PI, run: t * 20, lie: 0, pitch: -.2 }; }
        const l = lt - 1.15; return { x: -1.0, y: .66, z: -2.0, yaw: Math.PI - .15, run: 0, lie: smooth(l / .25), pitch: 0 }; })();
      setDog({ s: 1.35, x: dpath.x + RX, y: dpath.y, z: dpath.z, yaw: dpath.yaw, run: dpath.run, lie: dpath.lie, pitch: dpath.pitch || 0, wag: t * (lt > 1.4 ? 14 : 6), tongue: lt > 1.4 });
      place(YOU, RX + 1.15, .28, -2.1, Math.PI, 'sit', .4); YOU.arms = { lx: -.5, lz: -.1, rx: lt > 1.2 ? -1.1 + Math.sin(lt * 7) * .15 : -.55, rz: .35 }; YOU.pitch = .05;
      const nl = lt - 1.3; const nup = smooth((nl - .1) / .35);
      place(NEI, RX - .95, 0, -3.85, 0, 'idle', .6); NEI.arms = { lx: -.2, lz: .12, rx: lerp(-.2, -1.55, nup), rz: -.12 }; NEI.h = 1.12; NEI.vis = lt > 1.1;
      lbShow(lbThanks, lt > 2.0, V3(RX - .3, 3.15, -3.0), .5, Math.min(1, (lt - 2.0) * 6));
      hearts.forEach((h, i) => { if (i > 5) return; const l = lt - (1.6 + i * .12); if (l < 0 || l > 1.6) return; h.visible = true; h.position.set(RX - 1.0 + Math.sin(i * 2.4) * .5, 1.55 + l * .5, -1.2); const s = .22 + .06 * Math.sin(l * 8); h.scale.set(s, s, 1); h.material.opacity = 1 - clamp((l - 1.0) / .5); });
      counter = ['DOG RESIDENTS', lt < 1.15 ? '0' : '1', lt < 1.15 ? 'moving in' : lt < 2.0 ? 'on your couch' : 'neighbor approves', lt >= 1.15];
      focus = [RX, 0];
      rig(lt, [[0, dk(-1.8, 1.8, 7.6), dk(-.6, 1.7, 7.0), dk(-2.8, .8, .2), dk(-1.4, .9, -.8), 54, 48], [1.1, dk(.75, 1.6, 6.5), dk(.55, 1.6, 6.1), dk(.4, 1.15, -2.5), dk(.4, 1.3, -2.7), 48, 44]], an, t, 0, [RX, 0, 0]);
    }
    skyU.top.value.copy(skyBase.top).lerp(skySpace.top, spaceU); skyU.mid.value.copy(skyBase.mid).lerp(skySpace.mid, spaceU); skyU.bot.value.copy(skyBase.bot).lerp(skySpace.bot, spaceU);
    if (bi === 1 || bi === 2) { S.fog.near = 2000; S.fog.far = 4000; } else { S.fog.near = 60; S.fog.far = 210; } S.fog.color.copy(FOGC).lerp(FOGSP, spaceU);
    stars.visible = bi === 2;
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t);
    if (hammerFor) { attach(hammer, hammerFor, 'handR', [0, -.02, .02], [0, 0, 0]); hammer.visible = true; }
    if (bi === 5 && NEI.vis) { attach(thumb, NEI, 'handR', [0, 0, .02], [0, 0, 0]); thumb.visible = smooth(((lt - 1.3) - .1) / .35) > .6; thumb.matrix.scale(V3(2.2, 2.2, 2.2)); }
    A.follow(focus[0], focus[1]); A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    if (counter) hud.counter(counter[0], counter[1], counter[2], '', counter[3]);
    hud.tm(''); hud.pop('', 0);
  } };
}
