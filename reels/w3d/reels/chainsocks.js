// 686 invention chain: dog steals socks -> drawer -> dog noses it open -> padlock -> dog finds key -> SOCK MUSEUM + gift shop -> $8 admission, dog at the desk -> family discount.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, mat, Crowd, Particles, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0xf3e6d2, fogNear: 30, fogFar: 90, clouds: false, skyTop: 0xf0e2cc, skyMid: 0xf3e6d2, skyBot: 0xf3e6d2, shadowExtent: 9, shadowRes: 2048, hemi: 1.9, sunI: 1.5, sunDir: [-.4, 1, .6], exposure: 1.12, hemiSky: 0xfff4e0, hemiGround: 0xc9b392 }); const S = A.scene;
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
  const grp = (x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); S.add(g); return g; };
  const ORG = { B: [0, 0, 0], M: [500, 0, 0], K: [-500, 0, 0] };
  const B = grp(...ORG.B), M = grp(...ORG.M), K = grp(...ORG.K);
  const plane = (par, w, d, x, y, z, map, color = 0xffffff) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), map ? new THREE.MeshStandardMaterial({ map, roughness: .9 }) : mat(color, { roughness: 1 })); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; par.add(m); return m; };
  const board = (par, w, h, tex, x, y, z, ry = 0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: .8 })); m.position.set(x, y, z); m.rotation.y = ry; par.add(m); return m; };
  const mkLabel = (text, c1, c2, w = 640, size = 110) => { const l = cvs(w, 180, (g, ww) => { txt(g, text, ww / 2, 92, size, c1, { stroke: c2, sw: 22 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; s.userData.ar = w / 180; S.add(s); return s; };
  const lbShow = (s, on, pos, h = .5, a = 1) => { s.visible = on && a > .01; if (!s.visible) return; s.position.copy(pos); const k = clamp(a); s.scale.set(h * s.userData.ar * k, h * k, 1); };
  const heartTex = cvs(128, 128, (g) => { g.fillStyle = '#ff3b5c'; g.strokeStyle = '#7a0f26'; g.lineWidth = 8; g.beginPath(); g.moveTo(64, 112); g.bezierCurveTo(8, 72, 12, 18, 48, 20); g.bezierCurveTo(60, 21, 64, 32, 64, 36); g.bezierCurveTo(64, 32, 68, 21, 80, 20); g.bezierCurveTo(116, 18, 120, 72, 64, 112); g.fill(); g.stroke(); g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(40, 44, 9, 6, -.6, 0, 7); g.fill(); });
  const hearts = []; for (let i = 0; i < 12; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: heartTex.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); hearts.push(s); }

  // ---------- socks
  const SOCKC = [[0xe8433a, 0xffffff], [0x3a78d8, 0xffe23a], [0x58b84a, 0xffffff], [0xf2a21b, 0x6b3fa0], [0xc66bd8, 0xffffff], [0x2fb7b0, 0xff6b8a], [0xffffff, 0xe8433a], [0xff8fb1, 0xffffff]];
  const mkSock = (ci = 0) => { const [a, b] = SOCKC[ci % SOCKC.length]; const g = new THREE.Group(); const m = mat(a, { roughness: 1 }), ms = mat(b, { roughness: 1 });
    const leg = rbox(.085, .24, .07, a, { mat: m }); leg.position.set(0, .12, 0); g.add(leg); const foot = rbox(.2, .085, .07, a, { mat: m }); foot.position.set(.055, .043, 0); g.add(foot);
    const cuff = rbox(.095, .05, .08, b, { mat: ms }); cuff.position.set(0, .235, 0); g.add(cuff); const stripe = rbox(.09, .028, .075, b, { mat: ms }); stripe.position.set(0, .15, 0); g.add(stripe); const heel = rbox(.06, .06, .075, b, { mat: ms }); heel.position.set(-.02, .03, 0); g.add(heel); g.traverse((o) => { o.castShadow = true; }); return g; };
  const SOX = []; for (let i = 0; i < 40; i++) { const s = mkSock(i); s.visible = false; S.add(s); SOX.push(s); }
  const sockAt = (i, x, y, z, rx = 0, ry = 0, rz = 0, sc = 1) => { const s = SOX[i]; s.visible = true; s.position.set(x, y, z); s.rotation.set(rx, ry, rz); s.scale.setScalar(sc); };

  // =============================================================== BEDROOM (beats 0-2)
  { const wt = cvs(512, 512, (g, w) => { g.fillStyle = '#c99a62'; g.fillRect(0, 0, w, w); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#bf8f58' : '#d4a46c'; g.fillRect(0, i * 64, w, 62); g.fillStyle = 'rgba(70,40,15,.35)'; g.fillRect(0, i * 64 + 62, w, 2); for (let j = 0; j < 3; j++) g.fillRect((cr(i, 70 + j) * w) | 0, i * 64, 2, 62); } }); wt.t.wrapS = wt.t.wrapT = THREE.RepeatWrapping; wt.t.repeat.set(2, 2);
    plane(B, 10, 10, -.5, 0, 0, wt.t); }
  box(B, -.5, 1.6, -2.65, 9, 3.2, .12, 0xc9dff0); box(B, -.5, .1, -2.57, 9, .2, .08, 0xffffff, { cast: false });
  box(B, 2.1, 1.6, -.4, .12, 3.2, 6.2, 0xc9dff0); box(B, 2.03, .1, -.4, .08, .2, 6.2, 0xffffff, { cast: false });
  box(B, -3.5, 1.6, 0, .12, 3.2, 6, 0xc9dff0);
  { const wn = new THREE.Group(); wn.position.set(-.7, 1.75, -2.57); B.add(wn); box(wn, 0, 0, 0, 1.5, 1.2, .06, 0xffffff); box(wn, 0, 0, .04, 1.3, 1.0, .04, 0x9fd8ff, { m: { emissive: 0x9fd8ff, emissiveIntensity: .55 } }); box(wn, 0, 0, .08, .06, 1.0, .04, 0xffffff); box(wn, 0, 0, .08, 1.3, .06, .04, 0xffffff); for (const s of [-1, 1]) box(wn, s * .85, -.1, .08, .25, 1.3, .08, 0xe8683a); }
  { const bed = new THREE.Group(); bed.position.set(-2.55, 0, -1.2); B.add(bed); box(bed, 0, .22, 0, 1.15, .3, 2.3, 0x7a4a28); box(bed, 0, .46, .05, 1.05, .22, 2.1, 0xffffff); box(bed, 0, .54, .5, 1.1, .12, 1.3, 0x3a78d8); box(bed, 0, .6, -.95, .7, .15, .38, 0xfff4dc); box(bed, 0, .6, -1.18, 1.15, .8, .08, 0x7a4a28); }
  { const rg = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, .02, 40), mat(0xe8683a, { roughness: 1 })); rg.position.set(-.5, .012, .6); rg.receiveShadow = true; B.add(rg); const rg2 = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, .02, 40), mat(0xffe3b0, { roughness: 1 })); rg2.position.set(-.5, .02, .6); B.add(rg2); }
  { const pt = cvs(256, 200, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#9ad06a'; g.fillRect(14, 14, w - 28, h - 28); txt(g, 'GOOD BOY', w / 2, 100, 46, '#fff', { stroke: '#2a5a1c', sw: 8 }); }); box(B, .8, 2.4, -2.58, .8, .6, .04, 0x6b4a2a); board(B, .72, .52, pt.t, .8, 2.4, -2.55); }
  // dresser (local: front at +z, rotated so the front faces -x)
  const D = new THREE.Group(); D.position.set(1.55, 0, -.2); D.rotation.y = -Math.PI / 2; B.add(D);
  box(D, 0, .45, 0, 1.7, .9, .8, 0xa9743f); box(D, 0, .93, 0, 1.82, .06, .92, 0xc08850);
  for (const y of [.2, .45]) { box(D, 0, y, .42, 1.55, .22, .04, 0xb9814a); box(D, 0, y, .46, .3, .05, .05, 0xe8c24a); }
  box(D, -.78, .02, .32, .08, .06, .08, 0x6b4a2a); box(D, .78, .02, .32, .08, .06, .08, 0x6b4a2a);
  const DR = new THREE.Group(); DR.position.set(0, .72, 0); D.add(DR);
  box(DR, 0, 0, .42, 1.55, .22, .05, 0xc99358); box(DR, 0, 0, .46, .3, .05, .05, 0xe8c24a);
  box(DR, 0, -.1, 0, 1.5, .02, .76, 0x8a5a30); box(DR, -.74, -.01, 0, .03, .2, .76, 0x8a5a30); box(DR, .74, -.01, 0, .03, .2, .76, 0x8a5a30); box(DR, 0, -.01, -.37, 1.5, .2, .03, 0x8a5a30);
  const inDrawer = []; for (let i = 0; i < 7; i++) { const s = mkSock(i); s.scale.setScalar(1.6); s.rotation.set(Math.PI / 2, 0, (cr(i, 3) - .5) * 1.6 + (i % 2 ? .6 : 2.5)); s.position.set(-.45 + (i % 4) * .3 + (cr(i, 4) - .5) * .08, -.06 + Math.floor(i / 4) * .04, .17 + (cr(i, 5) - .5) * .12 + (i > 3 ? .02 : 0)); DR.add(s); inDrawer.push(s); }
  // padlock on drawer front
  const lock = new THREE.Group(); lock.position.set(0, -.01, .5); DR.add(lock); lock.visible = false;
  { box(lock, 0, 0, 0, .2, .17, .08, 0xe8c24a, { m: { metalness: .8, roughness: .3 } }); const sh = new THREE.Mesh(new THREE.TorusGeometry(.065, .018, 8, 16, Math.PI), mat(0xbfc4cc, { metalness: .9, roughness: .25 })); sh.position.set(0, .085, 0); lock.add(sh); box(lock, 0, 0, .045, .035, .06, .02, 0x222222); }
  // key
  const mkKey = () => { const k = new THREE.Group(); const gm = mat(0xffd23a, { metalness: .8, roughness: .3 }); const ring = new THREE.Mesh(new THREE.TorusGeometry(.055, .018, 8, 16), gm); ring.position.set(-.1, 0, 0); k.add(ring); const sh = new THREE.Mesh(new THREE.BoxGeometry(.2, .03, .03), gm); sh.position.set(.04, 0, 0); k.add(sh); for (const x of [.1, .14]) { const t = new THREE.Mesh(new THREE.BoxGeometry(.025, .06, .03), gm); t.position.set(x, -.035, 0); k.add(t); } k.traverse((o) => { o.castShadow = true; }); return k; };
  const keyFly = mkKey(); keyFly.scale.setScalar(1.4); keyFly.visible = false; S.add(keyFly);
  const keyMouth = mkKey(); keyMouth.visible = false;
  // plant pot where the key gets hidden
  const POT = V3(-.75, 0, .55);
  { const pg = new THREE.Group(); pg.position.copy(POT); B.add(pg); cyl(pg, 0, .17, 0, .24, .17, .34, 0xc8643a); cyl(pg, 0, .35, 0, .26, .26, .05, 0xd8744a); cyl(pg, 0, .34, 0, .21, .21, .04, 0x4a2f1c); for (let i = 0; i < 7; i++) { const l = rbox(.1, .34, .03, 0x4fae45); l.position.set(Math.cos(i * 1.4) * .08, .55, Math.sin(i * 1.4) * .08); l.rotation.set(Math.sin(i * 2.1) * .5, i * 1.1, Math.cos(i * 1.7) * .6); pg.add(l); } }
  // =============================================================== dog
  const dog = new THREE.Group(); S.add(dog); const dogP = {};
  { const fur = 0xe3a93c, dark = 0xb4741c, lite = 0xf7dfa0; const c = (k, m) => { dogP[k] = m; return m; };
    c('body', put(dog, rbox(.34, .3, .62, fur), 0, .36, 0)); put(dog, rbox(.3, .12, .5, lite), 0, .24, .02);
    const hd = new THREE.Group(); hd.position.set(0, .6, .36); dog.add(hd); dogP.head = hd; put(hd, rbox(.3, .27, .27, fur), 0, 0, 0); put(hd, rbox(.2, .14, .17, lite), 0, -.06, .14); put(hd, rbox(.08, .06, .05, 0x1a1a1a), 0, -.02, .24);
    c('tongue', put(hd, rbox(.07, .02, .1, 0xff7a98), 0, -.13, .2));
    dogP.lids = []; dogP.eyes = [];
    for (const sx of [-1, 1]) { const e = put(hd, rbox(.07, .07, .03, 0x111111), sx * .08, .06, .14); dogP.eyes.push(e); put(hd, rbox(.02, .02, .02, 0xffffff), sx * .08 + .015, .075, .16); const lid = rbox(.095, .08, .04, dark); lid.position.set(sx * .08, .11, .145); lid.userData.sx = sx; hd.add(lid); dogP.lids.push(lid); put(hd, rbox(.07, .2, .12, dark), sx * .17, 0, -.03, 0, 0, sx * .25); }
    dogP.mouth = new THREE.Group(); dogP.mouth.position.set(0, -.1, .27); hd.add(dogP.mouth); dogP.mouth.add(keyMouth); dogP.mouthSock = mkSock(0); dogP.mouthSock.scale.setScalar(.9); dogP.mouthSock.position.set(0, -.06, 0); dogP.mouthSock.rotation.set(0, Math.PI / 2, 1.25); dogP.mouthSock.visible = false; dogP.mouth.add(dogP.mouthSock); keyMouth.position.set(0, -.04, .03); keyMouth.rotation.set(0, Math.PI / 2, 0);
    dogP.legs = [[-.1, .2], [.1, .2], [-.1, -.2], [.1, -.2]].map(([x, z]) => { const p = new THREE.Group(); p.position.set(x, .26, z); dog.add(p); const l = rbox(.1, .28, .12, fur); l.position.y = -.14; p.add(l); const f = rbox(.11, .05, .15, lite); f.position.set(0, -.27, .02); p.add(f); return p; });
    const tp = new THREE.Group(); tp.position.set(0, .44, -.3); tp.userData.base = .5; dog.add(tp); dogP.tail = tp; const tl2 = rbox(.14, .6, .14, fur); tl2.position.y = .3; tp.add(tl2); const tl3 = rbox(.22, .2, .2, lite); tl3.position.y = .6; tp.add(tl3);
    // name tag on the chest
    const nt = cvs(256, 160, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#d6232a'; g.fillRect(0, 0, w, 50); txt(g, 'HELLO', w / 2, 26, 34, '#fff'); txt(g, 'my name is', w / 2, 66, 24, '#333', { w: 700 }); txt(g, 'CHIEF', w / 2, 118, 56, '#111'); });
    dogP.tag = new THREE.Mesh(new THREE.PlaneGeometry(.26, .16), new THREE.MeshStandardMaterial({ map: nt.t, roughness: .6 })); dogP.tag.position.set(0, .34, .322); dogP.tag.visible = false; dog.add(dogP.tag); }
  dog.visible = false;
  const setDog = (d) => { const s = d.s ?? 1.35, sit = d.sit || 0, lie = d.lie || 0; dog.visible = true; dog.scale.setScalar(s); dog.position.set(d.x, d.y - .17 * sit * s, d.z); dog.rotation.set((d.pitch || 0) - .72 * sit, d.yaw || 0, d.roll || 0, 'YXZ');
    dogP.legs.forEach((p, i) => { const hind = i > 1; p.rotation.x = d.run ? Math.sin(d.run + (i % 2 ? Math.PI : 0) + (hind ? Math.PI * .5 : 0)) * .9 : 0; if (sit && hind) p.rotation.x = -1.35 * sit; if (d.paw && i === 1) p.rotation.x = -d.paw; if (d.paw2 && i === 0) p.rotation.x = -d.paw2; });
    dogP.tail.rotation.set(-.15 + .6 * sit, 0, Math.sin(d.wag || 0) * (d.wagAmp ?? .6)); dogP.tongue.visible = !!d.tongue; dogP.head.rotation.set(d.hx || 0, d.hy || 0, d.hz || 0); dogP.tail.scale.setScalar(.55 * (1 + (d.tailBig || 0) * .4));
    const lid = d.lid || 0; dogP.lids.forEach((l) => { l.position.y = .125 - lid * .055; l.scale.set(1, .6 + lid * .8, 1); l.rotation.z = -l.userData.sx * lid * .45; });
    dogP.mouthSock.visible = !!d.sock; keyMouth.visible = !!d.key; dogP.tag.visible = !!d.tag; };

  // =============================================================== MUSEUM (beat 3)
  { const ck = cvs(512, 512, (g, w) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#2c2a30' : '#efe8da'; g.fillRect(i * 64, j * 64, 64, 64); } }); ck.t.wrapS = ck.t.wrapT = THREE.RepeatWrapping; ck.t.repeat.set(4, 4); plane(M, 8, 14, 0, 0, -2, ck.t); }
  box(M, 0, 2.2, -7.1, 8, 4.4, .15, 0x6a1f2e); box(M, -4.05, 2.2, -2, .15, 4.4, 14, 0x7a2a3a); box(M, 4.05, 2.2, -2, .15, 4.4, 14, 0x7a2a3a); box(M, 0, 4.45, -2, 8.2, .12, 14.2, 0xe8d8b8); box(M, 0, .15, -7.0, 8, .3, .1, 0xe8d8b8, { cast: false });
  { const bt = cvs(1024, 300, (g, w, h) => { g.fillStyle = '#16213a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e8b930'; g.lineWidth = 14; g.strokeRect(12, 12, w - 24, h - 24); txt(g, 'SOCK MUSEUM', w / 2, 118, 136, '#ffd84a', { stroke: '#3a2a00', sw: 12 }); txt(g, 'EST. LAST TUESDAY', w / 2, 238, 54, '#cfd8ec', { w: 700 }); });
    board(M, 3.6, 1.06, bt.t, 0, 3.3, -7.0); }
  { const st = cvs(512, 160, (g, w, h) => { g.fillStyle = '#120a1e'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ff4fa3'; g.lineWidth = 10; g.strokeRect(10, 10, w - 20, h - 20); txt(g, 'GIFT SHOP', w / 2, 84, 100, '#ff9ad2', { stroke: '#ff2f8a', sw: 8 }); });
    const gs = new THREE.Mesh(new THREE.PlaneGeometry(2.0, .62), new THREE.MeshStandardMaterial({ map: st.t, emissive: 0xff5fb0, emissiveMap: st.t, emissiveIntensity: .8, roughness: .6 })); gs.position.set(3.93, 2.5, -1.2); gs.rotation.y = -Math.PI / 2; M.add(gs); }
  const pedC = [0xf6f1e6, 0xf6f1e6];
  for (let k = 0; k < 6; k++) { const sx = k % 2 ? 1 : -1, z = -3.6 - Math.floor(k / 2) * 1.5; const g = new THREE.Group(); g.position.set(sx * 2.45, 0, z); M.add(g); box(g, 0, .45, 0, .6, .9, .6, 0xf6f1e6); box(g, 0, .93, 0, .7, .06, .7, 0xdcd3c2); box(g, 0, 1.18, 0, .5, .44, .5, 0xcfe8f5, { cast: false, m: { transparent: true, opacity: .28, roughness: .05 } });
    const s = mkSock(k + 2); s.position.set(-.08, .96, 0); s.scale.setScalar(1.35); s.rotation.set(0, .5 * sx, .0); g.add(s); box(g, 0, .55, .31 * (1), .26, .12, .02, 0xe8c24a); }
  
  const stanch = (par, x, z) => { cyl(par, x, .03, z, .13, .13, .06, 0xe8c24a, { m: { metalness: .8, roughness: .3 } }); cyl(par, x, .45, z, .03, .03, .9, 0xe8c24a, { m: { metalness: .8, roughness: .3 } }); const t = new THREE.Mesh(new THREE.SphereGeometry(.06, 12, 10), mat(0xe8c24a, { metalness: .8, roughness: .3 })); t.position.set(x, .92, z); par.add(t); };
  const rope = (par, a, b, col = 0xb01830) => { const mid = a.clone().lerp(b, .5); mid.y -= .13; const cu = new THREE.CatmullRomCurve3([a, mid, b]); const m = new THREE.Mesh(new THREE.TubeGeometry(cu, 12, .022, 6), mat(col, { roughness: .7 })); m.castShadow = true; par.add(m); };
  for (const sx of [-1, 1]) for (let i = 0; i < 5; i++) { const z = 1.2 - i * 1.6, x = sx * 1.05; stanch(M, x, z); if (i < 4) rope(M, V3(x, .9, z), V3(x, .9, z - 1.6)); }
  // gift shop shelf + keychains
  { const sh = new THREE.Group(); sh.position.set(3.75, 0, -1.2); M.add(sh); box(sh, .1, 1.05, 0, .1, 2.1, 2.3, 0x6b4a2a); for (const y of [.18, .72, 1.26, 1.8]) box(sh, -.12, y, 0, .34, .06, 2.3, 0xb8864f); for (const z of [-1.15, 1.15]) box(sh, -.12, 1.0, z, .34, 2.1, .06, 0x6b4a2a);
    let n = 0; for (const y of [.75, 1.29, 1.83]) for (let j = 0; j < 5; j++) { const s = mkSock(n++); s.scale.setScalar(.55); s.position.set(-.1, y - .02, -.9 + j * .45); s.rotation.set(0, Math.PI / 2, 0); sh.add(s); const rg = new THREE.Mesh(new THREE.TorusGeometry(.04, .01, 6, 12), mat(0xd0d4da, { metalness: .9, roughness: .3 })); rg.position.set(-.1, y + .13, -.9 + j * .45 + .03); rg.rotation.y = Math.PI / 2; sh.add(rg); }
    const tt = cvs(256, 128, (g, w, h) => { g.fillStyle = '#ffe23a'; g.fillRect(0, 0, w, h); txt(g, 'SOCK KEYCHAIN', w / 2, 36, 38, '#111'); txt(g, '$5', w / 2, 92, 66, '#c8281e'); }); board(sh, .5, .25, tt.t, -.3, 1.0, -.02, -Math.PI / 2 + .0); }
  // register on a counter
  box(M, 2.45, .5, .9, 1.0, 1.0, .6, 0x8a5a30); box(M, 2.45, 1.02, .9, 1.1, .06, .7, 0xc08850); { const rg = new THREE.Group(); rg.position.set(2.7, 1.05, .9); M.add(rg); box(rg, 0, .1, 0, .3, .2, .3, 0x2a2e38); box(rg, -.05, .28, 0, .22, .16, .04, 0x6fe08a, { rx: -.3, m: { emissive: 0x2fc060, emissiveIntensity: .5 } }); }
  // =============================================================== LOBBY (beats 4-5)
  { const ft = cvs(512, 512, (g, w) => { g.fillStyle = '#d9d0c0'; g.fillRect(0, 0, w, w); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = (i + j) % 2 ? '#cbbfaa' : '#e6dece'; g.fillRect(i * 128, j * 128, 128, 128); } }); ft.t.wrapS = ft.t.wrapT = THREE.RepeatWrapping; ft.t.repeat.set(3, 3); plane(K, 9, 10, 0, 0, 0, ft.t); }
  box(K, 0, 2.2, -3.6, 9, 4.4, .15, 0x6a1f2e); box(K, -4.5, 2.2, 0, .15, 4.4, 10, 0x7a2a3a); box(K, 4.5, 2.2, 0, .15, 4.4, 10, 0x7a2a3a); box(K, 0, .12, -3.5, 9, .24, .1, 0xe8d8b8, { cast: false });
  { const bt = cvs(1024, 300, (g, w, h) => { g.fillStyle = '#16213a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e8b930'; g.lineWidth = 14; g.strokeRect(12, 12, w - 24, h - 24); txt(g, 'SOCK MUSEUM', w / 2, 128, 136, '#ffd84a', { stroke: '#3a2a00', sw: 12 }); txt(g, 'HOME OF YOUR SOCKS', w / 2, 238, 54, '#cfd8ec', { w: 700 }); });
    board(K, 3.3, .97, bt.t, 0, 3.2, -3.5); }
  box(K, 0, .5, -2.3, 1.4, 1.0, .5, 0x4a2f1c); // stool behind the desk
  box(K, 0, .5, -1.5, 2.4, 1.0, .75, 0x8a5a30); box(K, 0, 1.03, -1.5, 2.6, .07, .85, 0xc08850);
  { const at = cvs(512, 256, (g, w, h) => { g.fillStyle = '#ffe23a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#111'; g.lineWidth = 12; g.strokeRect(8, 8, w - 16, h - 16); txt(g, 'ADMISSION', w / 2, 76, 96, '#111'); txt(g, '$8', w / 2, 186, 130, '#c8281e'); });
    box(K, -.95, 1.35, -1.3, .8, .42, .05, 0x6b4a2a); board(K, .76, .38, at.t, -.95, 1.35, -1.27);
    const sg = cvs(512, 128, (g, w, h) => { g.fillStyle = '#c8281e'; g.fillRect(0, 0, w, h); txt(g, 'NO REFUNDS ON SOCKS', w / 2, 66, 40, '#fff'); }); board(K, 1.9, .42, sg.t, 0, .5, -1.12); }
  const BIGAD = cvs(512, 256, (g, w, h) => { g.fillStyle = '#ffe23a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#111'; g.lineWidth = 12; g.strokeRect(8, 8, w - 16, h - 16); txt(g, 'ADMISSION', w / 2, 76, 96, '#111'); txt(g, '$8', w / 2, 186, 130, '#c8281e'); });
  for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) { const x = -1.35, z = -.2 + i * 1.3; if (sx > 0) continue; stanch(K, x - .45, z); stanch(K, x + .45, z); if (i < 3) { rope(K, V3(x - .45, .9, z), V3(x - .45, .9, z + 1.3)); rope(K, V3(x + .45, .9, z), V3(x + .45, .9, z + 1.3)); } }
  // ticket (beat 5)
  const ticketTex = (stamped) => cvs(512, 320, (g, w, h) => { g.fillStyle = '#fff6dc'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c8281e'; g.lineWidth = 10; g.setLineDash([22, 14]); g.strokeRect(14, 14, w - 28, h - 28); g.setLineDash([]); txt(g, 'SOCK MUSEUM', w / 2, 62, 62, '#16213a'); txt(g, 'ONE VISIT', w / 2, 118, 44, '#555', { w: 700 });
    if (!stamped) txt(g, '$8', w / 2, 220, 130, '#c8281e'); else { g.save(); g.translate(w / 2, 238); g.rotate(-.1); g.fillStyle = 'rgba(200,40,30,.0)'; g.strokeStyle = '#d6232a'; g.lineWidth = 12; g.strokeRect(-232, -62, 464, 124); txt(g, 'FAMILY', 0, -26, 66, '#d6232a'); txt(g, 'DISCOUNT', 0, 36, 66, '#d6232a'); g.restore(); txt(g, '$4', 440, 80, 64, '#2a8a3a'); } });
  const tkA = ticketTex(false), tkB = ticketTex(true);
  const ticket = new THREE.Mesh(new THREE.PlaneGeometry(.82, .51), new THREE.MeshStandardMaterial({ map: tkA.t, roughness: .7, side: THREE.DoubleSide })); ticket.visible = false; K.add(ticket);
  const stamp = new THREE.Group(); K.add(stamp); stamp.visible = false; { cyl(stamp, 0, .06, 0, .09, .09, .12, 0xd6232a); cyl(stamp, 0, .17, 0, .04, .04, .12, 0x6b4a2a); box(stamp, 0, .25, 0, .12, .05, .12, 0x6b4a2a); }
  const bill = new THREE.Group(); { box(bill, 0, 0, 0, .26, .012, .12, 0x6fb86a); box(bill, 0, .008, 0, .1, .006, .06, 0xcfe8c8); bill.visible = false; S.add(bill); }
  const camProp = new THREE.Group(); { box(camProp, 0, 0, 0, .16, .1, .08, 0x2a2e38); box(camProp, 0, 0, .05, .06, .06, .04, 0x9fd0f0); camProp.visible = false; S.add(camProp); }
  // =============================================================== people
  const NP = 8; const crowd = new Crowd(S, NP, 91); const PP = crowd.p; const YOU = PP[0];
  const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  col(0, ['torso', 'armL', 'armR'], 0x3a78d8); col(0, ['legL', 'legR'], 0x2b3347); col(0, ['hair'], 0x4a2f1c); col(0, ['head', 'neck', 'handL', 'handR'], 0xe8b48a);
  const SHIRTC = [0xc8281e, 0xe8b930, 0x2d6b66, 0xe66a2c, 0xd9d2c2, 0x8a1a14, 0x7a4fb5], SKINC = [0xe9c29a, 0xdfb08a, 0xd4a07a, 0xe8bd95];
  for (let i = 1; i < NP; i++) { col(i, ['torso', 'armL', 'armR'], SHIRTC[i % 7]); col(i, ['legL', 'legR'], [0x22262e, 0x3a3f4a, 0x2a2a30][i % 3]); col(i, ['hair'], [0x14110e, 0xd9b45a, 0x6b3a1c][i % 3]); col(i, ['head', 'neck', 'handL', 'handR'], SKINC[i % 4]); }
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; o.h = 1; };
  const hide = (o) => { o.vis = false; o.x = 0; o.y = -50; o.z = 0; };
  const dirtP = new Particles(S, 40, 0x5a3a1d, .05, { rough: 1 });
  const lbPlus = mkLabel('+1', '#ff5a4a', '#111', 300, 120), lbClever = mkLabel('CLEVER!', '#ffe23a', '#111', 640, 110), lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111', 900, 108), lbWoof = mkLabel('SNIFF SNIFF', '#ffffff', '#111', 800, 100), lbKey = mkLabel('FOUND IT', '#ffe23a', '#111', 640, 110), lbStolen = mkLabel('SOCKS!', '#ff5a4a', '#111', 460, 110), lbDisc = mkLabel("FAMILY!", "#ffffff", "#111", 600, 110), lbQ = mkLabel('?', '#ffe23a', '#111', 200, 150), lbBang = mkLabel('!', '#ff5a4a', '#111', 200, 150);
  const LBS = [lbPlus, lbClever, lbBetter, lbWoof, lbKey, lbStolen, lbDisc, lbQ, lbBang];
  const E = new THREE.Vector3();
  const rig = (lt, shots, t, off = [0, 0, 0]) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .5);
    const L3 = (a, b) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)]; const e = L3(s[1], s[2]), g = L3(s[3], s[4]);
    A.cam(e[0] + off[0] + Math.sin(t * .9) * .015, e[1] + Math.sin(t * 1.3) * .012, e[2] + off[2], g[0] + off[0], g[1], g[2] + off[2], lerp(s[5], s[6], u), Math.sin(t * .7) * .005); };
  const dk = (x, y, z) => [x, y, z];
  const arcTo = (a, b, u, h) => V3(lerp(a.x, b.x, u), lerp(a.y, b.y, u) + Math.sin(u * Math.PI) * h, lerp(a.z, b.z, u));
  const OB = 0, OM = ORG.M[0], OK = ORG.K[0];
  const DOGPILE = V3(-.55, 0, .25);
  const drawerWorld = (open) => V3(1.55 - .42 - open, .85, -.2); // front of tray

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    B.visible = bi <= 2; M.visible = bi === 3; K.visible = bi >= 4;
    let shock = false; let counter = null;
    PP.forEach((o) => hide(o)); dog.visible = false; dirtP.clear(); hearts.forEach((h) => { h.visible = false; }); LBS.forEach((s) => { s.visible = false; }); SOX.forEach((s) => { s.visible = false; });
    keyFly.visible = false; bill.visible = false; camProp.visible = false; ticket.visible = false; stamp.visible = false; lock.visible = false;
    let hold = null, holdCam = null;
    let drawerOpen = 0; inDrawer.forEach((s) => { s.visible = false; });
    const youBase = (x, z, yaw) => { place(YOU, x, 0, z, yaw, 'idle', .5); };
    if (bi === 0) {
      // ---- 0: dog steals socks from the floor pile twice; you hide the pile in the drawer; dog sits and watches
      const stolen = lt < 1.0 ? 3 : lt < 1.5 ? 4 : 5;
      let dpos = V3(-1.9, 0, 3.4), dyaw = 0, run = 0, sit = 0, sock = false, lid = 0, hy = 0, hx = 0, hz = 0, tongue = true;
      const pileN = lt < 1.0 ? 6 : lt < 1.5 ? 5 : lt < 2.0 ? 4 : 0;
      for (let i = 0; i < 6; i++) if (i < pileN || (lt >= 2.0 && lt < 2.45)) { const q = lt >= 2.0 && lt < 2.45 ? 0 : 0; sockAt(i + 4, DOGPILE.x + (cr(i, 1) - .5) * .4, .05 + (i > 2 ? .08 : 0), DOGPILE.z + (cr(i, 2) - .5) * .35, Math.PI / 2, cr(i, 3) * 3, 0, 1.7); }
      if (lt < 1.45) { const k = lt < .85 ? 0 : 1, c = k ? lt - .85 : lt; const pts = k ? [V3(-.55, 0, 2.9), V3(-.5, 0, .45), V3(-1.9, 0, 3.6)] : [V3(-1.9, 0, 3.4), V3(-.55, 0, .6), V3(-1.9, 0, 3.4)];
        // quick in-and-out grab (first visit .0-.7, second .85-1.45)
        const dur = k ? .6 : .75; const u = clamp(c / dur); if (u < .5) { const w = smooth(u / .5); dpos = V3(lerp(-1.9, -.4, w), 0, lerp(3.2, .65, w)); dyaw = Math.atan2(-.4 + 1.9, .65 - 3.2); run = t * 28; sock = false; } else { const w = smooth((u - .5) / .5); dpos = V3(lerp(-.4, -1.9, w), 0, lerp(.65, 3.2, w)); dyaw = Math.atan2(-1.9 + .4, 3.2 - .65); run = t * 30; sock = true; hx = .15; } lid = .35; }
      else if (lt < 2.2) { dpos = V3(-1.9, 0, 3.4); dog.visible = false; }
      if (lt >= 2.2) { const u = smooth((lt - 2.2) / .5); dpos = V3(lerp(-1.9, -.55, u), 0, lerp(3.4, 1.15, u)); dyaw = lt < 2.7 ? Math.atan2(-.55 + 1.9, 1.15 - 3.4) : 1.15; run = lt < 2.7 ? t * 24 : 0; sit = lt < 2.7 ? 0 : smooth((lt - 2.7) / .25); if (lt >= 2.7) { lid = smooth((lt - 3.3) / .3) * .8; hy = Math.sin(lt * 3) * .1 + .25; tongue = false; } }
      const showDog = !(lt >= 1.45 && lt < 2.2);
      if (showDog) setDog({ x: dpos.x, y: 0, z: dpos.z, yaw: dyaw, run, sit, wag: t * (sit ? 8 : 20), tongue, lid, sock, hx, hy, hz: (lt > 3.0 ? -.2 : 0) });
      // you: wring hands, then scoop and drop the pile into the drawer
      youBase(-1.15, -.55, Math.PI / 2 - .35); YOU.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 };
      if (lt < 1.9) { YOU.arms = { lx: -2.2 + Math.sin(t * 16) * .15, lz: .1, rx: -2.2 + Math.sin(t * 16 + 2) * .15, rz: -.1 }; YOU.yaw = Math.PI / 2 - .55 + Math.sin(t * 1.2) * .15; shock = lt > .3; }
      else { const u = smooth((lt - 1.9) / .55); YOU.x = lerp(-1.15, -.2, u); YOU.z = lerp(-.55, -.2, u); YOU.yaw = Math.PI / 2; YOU.anim = u < 1 ? 'walk' : 'idle'; YOU.speed = 1.2; YOU.arms = { lx: -1.3, lz: -.05, rx: -1.3, rz: .05 }; YOU.pitch = .1; }
      // drawer: opens at 2.3, sock flights, closes 3.4
      drawerOpen = .5 * smooth((lt - 2.1) / .3) * (1 - smooth((lt - 3.3) / .35));
      for (let i = 0; i < 6; i++) { const t0 = 2.55 + i * .08, u = (lt - t0) / .4; if (u > 0 && u < 1) { const a = V3(-.3, 1.15, -.2 + (cr(i, 6) - .5) * .2), b = V3(.95 - drawerOpen * 0 + .05, .9, -.2 + (cr(i, 7) - .5) * .3); const q = arcTo(a, b, u, .35); sockAt(i, q.x, q.y, q.z, 0, 0, u * 6 + i, 1.2); } }
      inDrawer.forEach((s, i) => { s.visible = lt > 2.55 + Math.min(i, 5) * .08 + .35; });
      counter = ['SOCKS STOLEN', String(stolen), lt < 1.0 ? 'by the dog' : lt < 2.0 ? 'again' : 'time for a drawer', true];
      if (lt > .25 && lt < 1.0) lbShow(lbPlus, true, V3(-1.1, 1.45, 2.0 - lt * 0), .5, Math.min(1, (lt - .25) * 8));
      if (lt >= 1.0 && lt < 1.6) lbShow(lbStolen, true, V3(-1.35, 2.2, -.55), .45, Math.min(1, (lt - 1.0) * 8));
      if (lt >= 3.45) lbShow(lbQ, true, V3(-.55 + .1, 1.55, 1.15), .5, Math.min(1, (lt - 3.45) * 6));
      rig(lt, [[0, dk(-1.9, 1.7, 7.0), dk(-1.8, 1.65, 6.6), dk(-.1, .75, 0), dk(0, .8, 0), 50, 48], [2.0, dk(-1.8, 1.65, 6.6), dk(-1.6, 1.55, 6.0), dk(.3, .85, -.15), dk(.5, .9, -.2), 48, 44]], t);
    } else if (bi === 1) {
      // ---- 1: you close the drawer, 'Clever!'; dog trots up, nudges the drawer with its nose, it slides open, socks fly out
      let dpos = V3(-1.9, 0, 2.6), dyaw = 0, run = 0, hx = 0, hz = 0, hy = 0, lid = 0, tongue = false, wag = t * 8, wagAmp = .6;
      const noseX = 1.55 - .42 - .81 + .08; // dog stands here so the nose touches the drawer front (x)
      const stand = V3(1.1 - .81 - .02, 0, -.2);
      if (lt < 1.45) { const u = smooth(lt / 1.45); dpos = V3(lerp(-1.4, stand.x, u), 0, lerp(2.6, stand.z, u)); dyaw = lt < .3 ? 0 : Math.atan2(stand.x - dpos.x, stand.z - dpos.z) * (1 - u) + (Math.PI / 2) * u; run = t * 22; wag = t * 16; hx = 0; }
      else { dpos = stand; dyaw = Math.PI / 2; }
      let nudge = 0; // 0..1 nose lift
      const nudges = [[1.5, .08], [1.9, .16], [2.3, .24]];
      if (lt >= 1.45 && lt < 2.45) { lid = smooth((lt - 1.45) / .25) * .85; wag = t * 5; wagAmp = .25; const c = (lt - 1.45) % .4; nudge = lt < 2.35 ? Math.sin(clamp(c / .4) * Math.PI) : 0; hx = -.55 * nudge; dpos = V3(stand.x - nudge * .0, 0, stand.z); }
      if (lt >= 2.35) { const l = lt - 2.35; hx = -.9 * Math.sin(clamp(l / .35) * Math.PI) * (l < .35 ? 1 : 0) ; lid = .85 * (1 - smooth((lt - 3.0) / .3)); wag = t * 22; tongue = lt > 3.0; wagAmp = .8; hy = 0; }
      if (lt > 3.0) { hz = Math.sin(lt * 6) * .12; hx = Math.sin(lt * 9) * .12; }
      const nose = lt < 2.35 ? 0 : 1;
      drawerOpen = lt < 1.5 ? 0 : lt < 2.35 ? (lt < 1.9 ? .05 + .08 * smooth((lt - 1.5) / .3) : lt < 2.3 ? .13 + .08 * smooth((lt - 1.9) / .3) : .21) : lerp(.21, .5, smooth((lt - 2.35) / .22));
      inDrawer.forEach((s, i) => { s.visible = lt < 2.4 + i * .05; });
      // you
      youBase(-.85, -.35, Math.PI / 2 - .2); YOU.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 };
      if (lt < 1.0) { const w = 1 - smooth(lt / .6); YOU.arms = { lx: -.2, lz: .1, rx: -1.0 - w * .3, rz: -.05 }; YOU.pitch = .05; YOU.extra = 0; YOU.y = Math.abs(Math.sin(lt * 6)) * .04; YOU.x = -.45; }
      else if (lt < 1.6) { YOU.arms = { lx: -.2, lz: .1, rx: -2.9, rz: .2 }; YOU.x = -.7; }
      if (lt >= 2.35) { shock = true; YOU.arms = { lx: -2.7 + Math.sin(t * 14) * .12, lz: .15, rx: -2.7 + Math.sin(t * 14 + 1) * .12, rz: -.15 }; }
      // sock burst
      for (let i = 0; i < 14; i++) { const t0 = 2.38 + i * .015, l = lt - t0; if (l < 0) continue; const o = drawerWorld(.35); const vx = -.9 - cr(i, 11) * 1.8, vy = 2.3 + cr(i, 12) * 1.7, vz = (cr(i, 13) - .5) * 2.2; let x = o.x + vx * l, y = o.y + vy * l - 4.9 * l * l * 1.6, z = o.z + vz * l; let ry = l * (5 + cr(i, 14) * 6), rz = cr(i, 15) * 6 + l * 8;
        if (y < .05) { y = .05; const lf = Math.sqrt(Math.max(0, 2 * (o.y - .05) / (4.9 * 1.6) + (vy / 3.9) ** 2)) + vy / 3.9; const l2 = lf; x = o.x + vx * l2; z = o.z + vz * l2; ry = l2 * 6; rz = Math.PI / 2 + cr(i, 16) * 3; sockAt(i, x, y, z, Math.PI / 2, ry, rz, 1.3); } else sockAt(i, x, y, z, 0, ry, rz, 1.3); }
      setDog({ x: dpos.x, y: Math.abs(Math.sin(lt * 18)) * (lt < 1.45 ? .05 : 0), z: dpos.z, yaw: dyaw, run: lt < 1.45 ? run : 0, wag, wagAmp, lid, hx, hz, hy, tongue, sit: 0 });
      counter = ['SOCKS STOLEN', lt < 2.4 ? '5' : String(5 + Math.min(14, Math.floor((lt - 2.4) * 12))), lt < 2.4 ? 'drawer: installed' : 'drawer: defeated', true];
      if (lt > .12 && lt < 1.25) lbShow(lbClever, true, V3(-.5, 2.1, -.35), .42, Math.min(1, (lt - .12) * 6));
      if (lt > 1.5 && lt < 2.4) lbShow(lbQ, true, V3(.15, 1.45, -.2), .42, Math.min(1, (lt - 1.5) * 6));
      rig(lt, [[0, dk(-2.0, 1.55, 6.2), dk(-1.8, 1.5, 5.8), dk(.2, .8, -.2), dk(.45, .85, -.2), 48, 45], [2.2, dk(-1.7, 1.3, 5.3), dk(-1.3, 1.3, 5.0), dk(.65, .85, -.1), dk(.7, .9, -.1), 44, 40]], t);
    } else if (bi === 2) {
      // ---- 2: lock goes on; key tossed in the plant pot; 'Much better!'; the dog digs it out and trots off with it
      drawerOpen = lt < .45 ? .5 * (1 - smooth(lt / .4)) : 0;
      inDrawer.forEach((s) => { s.visible = lt < .4; });
      if (lt > .5) { const k = smooth((lt - .5) / .22); lock.visible = true; lock.scale.setScalar(.01 + k * 1.15 + Math.sin(k * Math.PI) * .25); }
      let dpos = V3(.0, 0, -.2), dyaw = Math.PI / 2, run = 0, sit = 1, hx = 0, hy = 0, hz = 0, lid = .8, wag = t * 5, wagAmp = .25, tongue = false, key = false, dy = 0, pitch = 0;
      if (lt < 3.0) { dpos = V3(.05, 0, -.2); dyaw = Math.PI / 2; sit = smooth(lt / .3); lid = lt < 1.2 ? 0 : .85 * smooth((lt - 1.2) / .4); hz = lt > 1.7 ? Math.sin(lt * 3.4) * .18 : 0; hy = lt < 1.5 ? 0 : Math.sin(lt * 1.5) * .0; }
      else if (lt < 3.45) { const u = smooth((lt - 3.0) / .45); dpos = V3(lerp(.05, POT.x + .55, u), 0, lerp(-.2, POT.z - .12, u)); dyaw = lerp(Math.PI / 2, -Math.PI / 2 + .15, smooth(Math.min(1, (lt - 3.0) / .2))); run = t * 26; sit = 1 - smooth((lt - 3.0) / .15); lid = .4; wag = t * 20; tongue = true; dpos.x = lerp(.05, POT.x + .72, u); }
      else if (lt < 4.05) { dpos = V3(POT.x + .72, 0, POT.z - .12); dyaw = -Math.PI / 2 + .15; sit = 0; const c = lt - 3.45; hx = .9 + Math.sin(c * 22) * .2; wag = t * 24; wagAmp = .8; for (let i = 0; i < 24; i++) { const u = ((c * 1.6) + i * .045) % 1; dirtP.set(i, POT.x + .1 + (cr(i, 21) - .5) * .5 + u * -.2, .4 + u * (.5 + cr(i, 22) * .6) - 2 * u * u * .8, POT.z + (cr(i, 23) - .5) * .4, (1 - u) * 1.0); } dirtP.done(); }
      else { const u = smooth((lt - 4.05) / .83); dpos = V3(lerp(POT.x + .72, 1.0 - 1.9 + 1.2, u) - u * 0, 0, lerp(POT.z - .12, 3.4, u)); dyaw = lerp(-Math.PI / 2 + .15, 0.12, smooth(Math.min(1, (lt - 4.05) / .25))); run = t * 22; sit = 0; key = true; lid = .85; tongue = false; wag = t * 20; wagAmp = .8; dy = Math.abs(Math.sin(t * 22)) * .03; hx = -.12; dpos.x = lerp(POT.x + .72, -.2, u); }
      if (lt >= 3.9 && lt < 4.05) key = true;
      // key moves from you -> pot, then out of the pot into the dog's mouth
      if (lt >= 1.3 && lt < 2.0) { const q = arcTo(V3(-.45, 1.2, -.1), V3(POT.x, .45, POT.z), (lt - 1.3) / .7, .5); keyFly.visible = true; keyFly.position.copy(q); keyFly.rotation.set(0, 0, (lt - 1.3) * 12); }
      if (lt >= 2.0 && lt < 3.7) { keyFly.visible = lt < 3.7; keyFly.position.set(POT.x, .42 + (lt > 3.55 ? .0 : 0), POT.z); keyFly.rotation.set(.2, 0, 1.2); if (lt > 3.5) keyFly.visible = false; }
      if (lt >= 3.5 && lt < 3.95) key = lt > 3.75; if (lt >= 3.95) key = true;
      setDog({ x: dpos.x, y: dy, z: dpos.z, yaw: dyaw, run, wag, wagAmp, lid, hx, hy, hz, tongue, sit, key, pitch });
      // you
      youBase(.1, -.9, Math.PI / 2 + .1); YOU.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 };
      if (lt < .45) { YOU.arms = { lx: -1.3, lz: -.05, rx: -1.3, rz: .05 }; YOU.pitch = .1; YOU.x = .25; YOU.z = -.55; }
      else if (lt < 1.0) { YOU.x = .25; YOU.z = -.55; YOU.arms = { lx: -.4, lz: .05, rx: -1.0 - Math.sin(lt * 20) * .1, rz: -.05 }; YOU.pitch = .08; }
      else if (lt < 1.5) { const u = smooth((lt - 1.0) / .5); YOU.x = lerp(.25, -.15, u); YOU.z = lerp(-.55, .15, u); YOU.yaw = lerp(Math.PI / 2, -.9, u); YOU.anim = 'walk'; YOU.speed = 1.2; YOU.arms = { lx: -.2, lz: .1, rx: -1.0, rz: -.1 }; }
      else if (lt < 2.2) { YOU.x = -.15; YOU.z = .15; YOU.yaw = -.8 + Math.sin(t * 1.5) * .05; YOU.arms = { lx: -2.4 + Math.sin(t * 9) * .1, lz: .12, rx: -2.4, rz: -.12 }; YOU.y = Math.abs(Math.sin(t * 8)) * .05; }
      else { YOU.x = -.15; YOU.z = .15; YOU.yaw = -.7 - smooth((lt - 3.0) / .4) * .6; YOU.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 }; if (lt > 3.4) { shock = true; YOU.arms = { lx: -2.6 + Math.sin(t * 15) * .1, lz: .1, rx: -2.6, rz: -.1 }; } if (lt > 4.1) { YOU.yaw = -1.4; } }
      counter = ['SOCKS STOLEN', lt < 4.0 ? '19' : '19', lt < 1.0 ? 'lock: installing' : lt < 3.0 ? 'drawer: secure' : lt < 4.0 ? 'key: hidden (ish)' : 'key: found', true];
      lbShow(lbBetter, lt > 1.7 && lt < 3.0, V3(-.1, 2.15, .15), .4, Math.min(1, (lt - 1.7) * 6));
      lbShow(lbWoof, lt > 3.1 && lt < 3.55, V3(POT.x + .35, 1.5, POT.z), .3, Math.min(1, (lt - 3.1) * 8));
      lbShow(lbKey, lt > 4.15, V3(-.55, 1.6, 2.4), .4, Math.min(1, (lt - 4.15) * 6));
      rig(lt, [[0, dk(-2.0, 1.55, 6.2), dk(-1.8, 1.5, 6.0), dk(.3, .8, -.3), dk(.3, .8, -.3), 50, 48], [3.0, dk(-2.4, 1.4, 5.4), dk(-2.0, 1.3, 5.2), dk(-.2, .7, .4), dk(-.3, .75, .6), 46, 44], [4.0, dk(-1.8, 1.2, 5.6), dk(-1.2, 1.15, 5.2), dk(-.3, .6, 1.8), dk(-.3, .6, 2.6), 46, 44]], t);
    } else if (bi === 3) {
      // ---- 3: SOCK MUSEUM hall, dog proud in the aisle, then the gift shop
      const hall = lt < 2.3;
      const wag = t * 10;
      const walk = clamp(lt / 1.0);
      const dpos = lt < 2.0 ? V3(lerp(OM + .0, OM, 1), 0, lerp(-6.0, -3.2, smooth(walk))) : V3(OM + lerp(0, 2.55, smooth((lt - 2.0) / .6)), 0, lerp(-3.2, -.95, smooth((lt - 2.0) / .6)));
      let yaw = 0, run = 0, sit = 0, lid = .7, tongue = true;
      if (lt < 1.0) { yaw = 0; run = t * 24; } else if (lt < 2.0) { yaw = Math.sin((lt - 1.0) * 1.2) * .5; sit = smooth((lt - 1.0) / .3); }
      else if (lt < 2.6) { yaw = lerp(0, Math.atan2(1, 1.1), smooth((lt - 2.0) / .2)); run = t * 22; sit = 0; } else { yaw = Math.PI / 2 + .5 * smooth((lt - 2.7) / .4) * 0 - .35; sit = smooth((lt - 2.6) / .3); }
      setDog({ x: dpos.x, y: 0, z: dpos.z, yaw: lt < 2.0 ? yaw : (lt < 2.6 ? Math.atan2(1.0, 1.0) : -Math.PI / 2 + .75), run, sit, wag, tongue, lid, hz: lt > 1.1 && lt < 2.0 ? Math.sin(lt * 2) * .08 : 0, tailBig: 1 });
      // tourists
      const T0 = [[-2.0, -3.6, Math.PI / 2 - .2], [2.0, -5.0, -Math.PI / 2 + .2], [.0, -1.9, 0]];
      for (let i = 0; i < 3; i++) { const o = PP[2 + i]; place(o, OM + (i === 0 ? -1.9 : i === 1 ? 1.9 : -1.9), 0, i === 0 ? -3.55 : i === 1 ? -5.05 : -5.05, i === 1 ? -Math.PI / 2 + .1 : Math.PI / 2 - .1, 'idle', .5); o.arms = { lx: -.2, lz: .12, rx: -1.2, rz: -.1 }; o.pitch = .06; }
      if (lt > 2.4) { const o = PP[5]; place(o, OM + 1.55, 0, .6, -Math.PI / 2 + .3, 'idle', .5); o.arms = { lx: -.2, lz: .1, rx: -1.0, rz: -.1 }; }
      shock = false;
      const nSock = lt < 1.0 ? 6 : Math.round(lerp(6, 240, smooth((lt - 1.0) / 2.6)));
      counter = ['SOCKS ON DISPLAY', fmt(nSock), lt < 2.0 ? 'dog: curator' : 'dog: gift shop owner', true];
      lbShow(lbBang, lt > .95 && lt < 1.6, V3(OM + .5, 1.8, -3.2), .5, Math.min(1, (lt - .95) * 8));
      rig(lt, [[0, dk(OM + .0, 1.4, 5.0), dk(OM + .0, 1.45, 2.4), dk(OM, 2.0, -6.0), dk(OM, 2.2, -6.0), 62, 58], [2.0, dk(OM - 1.1, 1.3, -.9), dk(OM - .6, 1.3, -.8), dk(OM + 2.6, 1.0, -1.1), dk(OM + 3.0, 1.0, -1.1), 56, 52]], t);
    } else if (bi === 4) {
      // ---- 4: ticket desk. you hand over $8; a queue of tourists; the dog is at the front desk
      const tag = true;
      const dogHead = lt > 2.8 ? Math.sin((lt - 2.8) * 4) * .12 : 0;
      setDog({ s: 1.4, x: OK - .15, y: 1.27, z: -2.2 + .3, yaw: 0, sit: 1, wag: t * 7, lid: .55 + (lt > 1.2 && lt < 2.0 ? .25 : 0), hy: dogHead, hz: lt > 2.9 ? -.15 : 0, hx: lt > 1.4 && lt < 2.0 ? .15 : 0, tag, tongue: lt > 3.8 });
      const handAt = clamp((lt - 1.0) / .55);
      youBase(OK - .95, -.35, Math.PI / 2 + .35);
      YOU.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 };
      if (lt < 1.0) { const u = smooth(lt / 1.0); YOU.x = lerp(OK - 1.55, OK - .85, u); YOU.z = lerp(.1, -.55, u); YOU.yaw = Math.PI / 2 + .35; YOU.anim = 'walk'; YOU.speed = 1.3; YOU.arms = { lx: -.2, lz: .12, rx: -.9, rz: -.1 }; hold = true; }
      else { YOU.x = OK - .85; YOU.z = -.55; YOU.anim = 'idle'; YOU.arms = { lx: -.2, lz: .12, rx: -.9 - 1.0 * smooth((lt - 1.0) / .4) * (lt < 2.0 ? 1 : 1 - smooth((lt - 2.0) / .4)), rz: -.1 }; YOU.yaw = Math.PI / 2 + .45; hold = true; shock = lt > 2.2; }
      // bill goes from hand to desk
      if (lt < 1.7) { bill.visible = true; attach(bill, YOU, 'handR', [0, -.02, .05], [0, 0, 0]); bill.visible = true; hold = true; }
      else if (lt < 2.5) { const u = smooth((lt - 1.7) / .4); const a = V3(YOU.x + .35, 1.0, YOU.z - .1); bill.matrixAutoUpdate = true; bill.position.set(lerp(a.x, OK + .1, u), lerp(1.0, 1.1, u), lerp(a.z, -1.3, u)); bill.rotation.set(0, 0, 0); bill.visible = lt < 2.2; }
      // queue
      const qx = OK - 1.45; const shuffle = smooth((lt - 2.0) / .8);
      for (let i = 0; i < 4; i++) { const o = PP[1 + i]; if (i === 0) { place(o, OK - 1.6, 0, .3 + .0, Math.PI / 2 + .2, 'idle', .5); o.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 }; } else { place(o, OK - 1.6 - (i % 2) * .35, 0, .3 + i * .85, Math.PI / 2 + .1, 'idle', .5); o.arms = { lx: -.2, lz: .12, rx: -1.0, rz: -.1 }; } o.z -= shuffle * .55; if (i === 3) { o.arms = { lx: -1.2, lz: .1, rx: -.2, rz: -.1 }; } o.extra = 0; }
      attach(camProp, PP[3], 'handL', [0, -.05, .1], [0, 0, 0]); camProp.visible = true;
      counter = ['YOU PAID', '$8', lt < 2.0 ? 'to see your own socks' : lt < 2.9 ? 'for your own socks' : 'dog: front desk', true];
      lbShow(lbQ, lt > 2.2 && lt < 2.9, V3(OK - .85, 2.2, -.55), .45, Math.min(1, (lt - 2.2) * 6));
      rig(lt, [[0, dk(OK + 2.0, 1.9, 7.2), dk(OK + 1.6, 1.8, 6.8), dk(OK - .5, 1.5, -1.3), dk(OK - .4, 1.5, -1.5), 52, 50], [2.6, dk(OK + 1.5, 1.7, 6.0), dk(OK + .9, 1.7, 4.4), dk(OK - .3, 1.5, -1.5), dk(OK - .15, 1.6, -2.0), 48, 38]], t);
    } else {
      // ---- 5: dog stamps FAMILY DISCOUNT, hearts, tail wag
      const sc = lt < .45 ? 0 : lt < .75 ? smooth((lt - .45) / .3) : 1; // stamp press at 0.75
      const press = lt > .6 && lt < .9 ? 1 : 0;
      const stamped = lt > .8;
      ticket.visible = true; ticket.material.map = stamped ? tkB.t : tkA.t; ticket.position.set(.45, 1.28, -1.0); ticket.rotation.set(-.55, 0, .04);
      const happy = lt > 1.0;
      setDog({ s: 1.4, x: OK - .15, y: 1.27, z: -2.2 + .3, yaw: 0, sit: 1, wag: t * (happy ? 30 : 8), wagAmp: happy ? .95 : .6, lid: happy ? 0 : .55, hy: happy ? Math.sin(t * 4) * .15 : 0, hz: happy ? .2 : 0, tag: true, tongue: happy, paw: lt < .3 ? 0 : (lt < .6 ? smooth((lt - .3) / .3) * 1.1 : lt < .9 ? 1.1 + .0 : 1.1 * (1 - smooth((lt - .9) / .3))), tailBig: happy ? 1 : 0 });
      stamp.visible = lt > .2 && lt < 1.3; const sy = lt < .6 ? lerp(1.9, 1.62, smooth((lt - .2) / .4)) : lt < .8 ? lerp(1.62, 1.46, smooth((lt - .6) / .2)) : lerp(1.46, 1.9, smooth((lt - .8) / .4)); stamp.position.set(.45, sy - .12, -1.0); stamp.rotation.set(-.55, 0, 0);
      youBase(OK - .9, -.45, Math.PI / 2 + .5); YOU.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 };
      if (lt > 1.1) { YOU.arms = { lx: -1.0, lz: .1, rx: -1.0, rz: -.1 }; YOU.y = Math.abs(Math.sin(lt * 7)) * .04; shock = false; }
      const qx = OK - 1.55; for (let i = 0; i < 3; i++) { const o = PP[1 + i]; place(o, qx - (i % 2) * .35, 0, -.0 + i * .85 - .45, Math.PI / 2 + .15, 'idle', .5); o.arms = { lx: -.2, lz: .12, rx: -.2, rz: -.12 }; }
      hearts.forEach((h, i) => { if (i > 7) return; const l = lt - (1.05 + i * .1); if (l < 0 || l > 1.4) return; h.visible = true; h.position.set(OK + .15 + Math.sin(i * 2.3) * .5, 2.1 + l * .5, -1.9 + Math.cos(i * 1.7) * .1); const s = .24 + .1 * Math.sin(clamp(l / .25) * Math.PI * .5) + .03 * Math.sin(l * 9); h.scale.set(s, s, 1); h.material.opacity = 1 - clamp((l - .9) / .5); });
      counter = ['YOU PAID', stamped ? '$4' : '$8', stamped ? 'family discount' : 'dog: stamping', stamped];
      lbShow(lbDisc, lt > 1.35, V3(OK + .2, 2.75, -1.3), .38, Math.min(1, (lt - 1.35) * 6));
      rig(lt, [[0, dk(OK + 1.7, 1.7, 4.8), dk(OK + 1.2, 1.65, 4.2), dk(OK - .35, 1.45, -1.5), dk(OK - .2, 1.5, -1.7), 46, 40]], t);
    }
    // shared prop poses
    DR.position.z = drawerOpen; lock.visible = lock.visible && bi === 2;
    if (bi === 0 || bi === 1) lock.visible = false;
    if (bi === 2) { DR.position.z = drawerOpen; }
    A.follow(bi === 3 ? OM : bi >= 4 ? OK : 0, bi === 3 ? -2 : 0);
    S.fog.near = 40; S.fog.far = 120;
    crowd.setFace(shock ? 'shock' : 'calm'); crowd.update(t);
    if (bi === 4) { attach(camProp, PP[3], 'handL', [0, -.05, .1], [0, 0, 0]); camProp.visible = true; if (lt < 1.7) { attach(bill, YOU, 'handR', [0, -.02, .05], [0, 0, 0]); bill.visible = true; } }
    A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    if (counter) hud.counter(counter[0], counter[1], counter[2], '', counter[3]);
    hud.tm(''); hud.pop('', 0);
  } };
}
