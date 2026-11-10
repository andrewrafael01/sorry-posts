// 666 invention chain: slow wifi -> hug router -> dog on router -> roof -> bird nest -> bird streams -> flock -> ladder + 2M followers.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, mat, ground, Crowd, clamp, smooth, lerp, attach, tree } = lib;
  const A = makeStage({ fog: 0xbcd8ee, fogNear: 45, fogFar: 170, clouds: true, skyTop: 0x3f86d8, skyMid: 0x9cc8f0, skyBot: 0xe2eef9, shadowExtent: 15, shadowRes: 2048, hemi: 1.5, sunI: 1.9, sunDir: [-.35, .9, .55], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t, w, h }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rbox = (w, h, d, c, o = {}) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * .2), o.mat || mat(c, o.m || {})); m.castShadow = o.cast !== false; m.receiveShadow = true; return m; };
  const put = (par, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); par.add(m); return m; };
  const SL = .24, RY0 = 3.05, roofY = (z) => RY0 - z * SL; // sloped (shed) roof surface height at depth z (<=0)

  // ================================================================== living room (beats 0-1)
  const ROOM = new THREE.Group(); S.add(ROOM);
  { const fl = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), mat(0xb98a5a, { roughness: .6 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; ROOM.add(fl);
    for (let i = -8; i < 8; i++) { const pl = new THREE.Mesh(new THREE.PlaneGeometry(.012, 40), mat(0x8a6234)); pl.rotation.x = -Math.PI / 2; pl.position.set(i * 1.2, .003, 0); ROOM.add(pl); }
    const wallC = 0xf3e6cf; const bw = new THREE.Mesh(new THREE.PlaneGeometry(24, 6), mat(wallC)); bw.position.set(0, 3, -3.6); bw.receiveShadow = true; ROOM.add(bw);
    const lw = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), mat(0xe9d9bd)); lw.rotation.y = Math.PI / 2; lw.position.set(-5.2, 3, 3); ROOM.add(lw);
    const rw = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), mat(0xe9d9bd)); rw.rotation.y = -Math.PI / 2; rw.position.set(5.2, 3, 3); ROOM.add(rw);
    put(ROOM, rbox(24, .18, .06, 0xffffff, { cast: false }), 0, .09, -3.56);
    // window with sky view
    const win = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), new THREE.MeshBasicMaterial({ color: 0x9fd2ff })); win.position.set(-2.4, 1.9, -3.56); ROOM.add(win);
    put(ROOM, rbox(2.4, .1, .12, 0xffffff), -2.4, 2.75, -3.52); put(ROOM, rbox(2.4, .1, .12, 0xffffff), -2.4, 1.05, -3.52); put(ROOM, rbox(.1, 1.8, .12, 0xffffff), -3.55, 1.9, -3.52); put(ROOM, rbox(.1, 1.8, .12, 0xffffff), -1.25, 1.9, -3.52); put(ROOM, rbox(.06, 1.6, .1, 0xffffff), -2.4, 1.9, -3.5); put(ROOM, rbox(2.2, .06, .1, 0xffffff), -2.4, 1.9, -3.5);
    // rug, plant, lamp, picture
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, .02, 40), mat(0x3f6fa8)); rug.position.set(.2, .011, .6); rug.scale.z = .7; rug.receiveShadow = true; ROOM.add(rug);
    const rug2 = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, .025, 40), mat(0xe8d9a8)); rug2.position.set(.2, .013, .6); rug2.scale.z = .7; ROOM.add(rug2);
    put(ROOM, new THREE.Mesh(new THREE.CylinderGeometry(.2, .16, .38, 14), mat(0xc4673a)), -4.2, .19, -2.7); { const pl = new THREE.Mesh(new THREE.IcosahedronGeometry(.5, 1), mat(0x3d8a3a, { flatShading: true })); pl.position.set(-4.2, .85, -2.7); pl.castShadow = true; ROOM.add(pl); }
    put(ROOM, new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 1.5, 8), mat(0x333333)), 3.9, .75, -3.0); { const sh = new THREE.Mesh(new THREE.CylinderGeometry(.22, .32, .36, 14), new THREE.MeshStandardMaterial({ color: 0xffe9b0, emissive: 0xffd27a, emissiveIntensity: .5 })); sh.position.set(3.9, 1.7, -3.0); ROOM.add(sh); }
    const pic = cvs(160, 200, (g, w, h) => { g.fillStyle = '#e8c76a'; g.fillRect(0, 0, w, h); g.fillStyle = '#6fb0e0'; g.fillRect(14, 14, w - 28, h - 28); g.fillStyle = '#f4f0e0'; g.beginPath(); g.arc(60, 60, 20, 0, 7); g.fill(); g.fillStyle = '#4f9a4a'; g.beginPath(); g.moveTo(14, h - 14); g.lineTo(70, 110); g.lineTo(110, 150); g.lineTo(150, 100); g.lineTo(w - 14, h - 14); g.fill(); });
    const pm = new THREE.Mesh(new THREE.PlaneGeometry(.8, 1.0), new THREE.MeshBasicMaterial({ map: pic.t })); pm.position.set(1.6, 2.2, -3.56); ROOM.add(pm);
    const ce = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), mat(0xf6f0e4)); ce.rotation.x = Math.PI / 2; ce.position.y = 3.6; ROOM.add(ce);
    // console table
    const TBY = .72; put(ROOM, rbox(2.4, .08, .8, 0x7a4e28), 1.0, TBY - .04, -2.5);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(ROOM, rbox(.09, TBY - .08, .09, 0x5f3b1c), 1.0 + sx * 1.1, (TBY - .08) / 2, -2.5 + sz * .32);
    put(ROOM, rbox(2.2, .05, .7, 0x6a4322), 1.0, .3, -2.5); }
  const TBY = .72, RX = 1.0, RZ = -2.5; // router on the console
  // ================================================================== router builder
  function mkRouter() {
    const g = new THREE.Group(); put(g, rbox(.95, .46, .5, 0x23283a, { m: { roughness: .4 } }), 0, .23, 0); put(g, rbox(.9, .04, .46, 0x343c58), 0, .47, 0);
    const leds = []; for (let i = 0; i < 5; i++) { const lm = new THREE.MeshStandardMaterial({ color: 0x151515, emissive: 0x000000, emissiveIntensity: 2.2 }); const l = new THREE.Mesh(new THREE.BoxGeometry(.075, .075, .02), lm); l.position.set(-.3 + i * .15, .24, .256); g.add(l); leds.push(lm); }
    const ants = [[-.38, -.17, .12], [0, -.2, 0], [.38, -.17, -.12]].map(([x, z, tz]) => { const p = new THREE.Group(); p.position.set(x, .47, z); p.rotation.z = tz; const a = rbox(.055, .95, .055, 0x15171f); a.position.y = .48; p.add(a); const tip = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 6), mat(0x15171f)); tip.position.y = .97; tip.castShadow = true; p.add(tip); g.add(p); return p; });
    g.userData = { leds, ants }; return g;
  }
  const LON = new THREE.Color(0x35ff6a), LBAD = new THREE.Color(0xff3322), LOFF = new THREE.Color(0x151515);
  const setLeds = (g, n, bad, t) => g.userData.leds.forEach((lm, i) => { const on = i < n && (!bad || i > 0 || Math.sin(t * 9) > -.2); lm.color.copy(on ? (bad ? LBAD : LON) : LOFF); lm.emissive.copy(on ? (bad ? LBAD : LON) : new THREE.Color(0)); });
  const routerIn = mkRouter(); routerIn.position.set(RX, TBY, RZ); ROOM.add(routerIn);

  // ================================================================== laptop
  const LAPW = 512, LAPH = 330;
  const lapScr = cvs(LAPW, LAPH);
  const drawBars = (g, x, y, n, bad, sz = 1) => { for (let i = 0; i < 5; i++) { const h = (14 + i * 11) * sz, w = 11 * sz; g.fillStyle = i < n ? (bad ? '#ff4433' : '#3cff6e') : 'rgba(255,255,255,.22)'; g.fillRect(x + i * 16 * sz, y - h, w, h); } };
  const drawLaptop = (t, bars, pct) => { const g = lapScr.g; g.fillStyle = '#0f1420'; g.fillRect(0, 0, LAPW, LAPH); g.fillStyle = '#1c2436'; g.fillRect(0, 0, LAPW, 34); g.fillStyle = '#ff5f57'; g.beginPath(); g.arc(20, 17, 6, 0, 7); g.fill(); g.fillStyle = '#febc2e'; g.beginPath(); g.arc(40, 17, 6, 0, 7); g.fill(); g.fillStyle = '#28c840'; g.beginPath(); g.arc(60, 17, 6, 0, 7); g.fill();
    drawBars(g, LAPW - 110, 28, bars, bars <= 2, .75);
    const cx = LAPW / 2, cy = 150; g.lineWidth = 16; g.lineCap = 'round'; g.strokeStyle = 'rgba(255,255,255,.14)'; g.beginPath(); g.arc(cx, cy, 52, 0, 7); g.stroke(); g.strokeStyle = bars <= 2 ? '#ff7a5a' : '#6fe0ff'; g.beginPath(); const a0 = t * 6; g.arc(cx, cy, 52, a0, a0 + 1.9); g.stroke();
    txt(g, bars > 3 ? 'PLAYING' : 'BUFFERING...', cx, 252, 42, '#fff'); txt(g, pct + '%', cx, 296, 28, '#9fb0c8', { w: 700 }); lapScr.t.needsUpdate = true; };
  const mkLaptop = () => { const g = new THREE.Group(); put(g, rbox(.6, .035, .4, 0x9aa0ad, { m: { metalness: .6, roughness: .35 } }), 0, .0175, 0); const sc = new THREE.Group(); sc.position.set(0, .03, -.19); sc.rotation.x = -.22; g.add(sc); put(sc, rbox(.6, .4, .03, 0x9aa0ad, { m: { metalness: .6, roughness: .35 } }), 0, .2, 0);
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(.54, .348), new THREE.MeshBasicMaterial({ map: lapScr.t })); pl.position.set(0, .2, .0165); sc.add(pl); return g; };
  const laptop = mkLaptop(); S.add(laptop);

  // ================================================================== dog
  const dog = new THREE.Group(); S.add(dog); const dogP = {};
  { const fur = 0xc98a4a, dark = 0x8a5524, lite = 0xefd2a0; const c = (k, m) => { dogP[k] = m; return m; };
    c('body', put(dog, rbox(.34, .3, .62, fur), 0, .36, 0)); put(dog, rbox(.3, .12, .5, lite), 0, .24, .02);
    c('head', put(dog, rbox(.3, .27, .27, fur), 0, .6, .36)); put(dog, rbox(.2, .14, .17, lite), 0, .54, .5); put(dog, rbox(.08, .06, .05, 0x1a1a1a), 0, .58, .6);
    c('tongue', put(dog, rbox(.07, .02, .1, 0xff7a98), 0, .47, .56));
    for (const sx of [-1, 1]) { put(dog, rbox(.05, .05, .03, 0x111111), sx * .08, .66, .5); put(dog, rbox(.07, .2, .12, dark), sx * .17, .6, .33, 0, 0, sx * .25); }
    dogP.legs = [[-.1, .2], [.1, .2], [-.1, -.2], [.1, -.2]].map(([x, z]) => { const p = new THREE.Group(); p.position.set(x, .26, z); dog.add(p); const l = rbox(.1, .28, .12, fur); l.position.y = -.14; p.add(l); const f = rbox(.11, .05, .15, lite); f.position.set(0, -.27, .02); p.add(f); return p; });
    const tp = new THREE.Group(); tp.position.set(0, .44, -.3); dog.add(tp); dogP.tail = tp; const tl2 = rbox(.14, .7, .14, fur); tl2.position.y = .35; tp.add(tl2); const tl3 = rbox(.22, .24, .2, lite); tl3.position.y = .7; tp.add(tl3); }
  const DOGS = 1.35; dog.scale.setScalar(DOGS); dog.visible = false;
  const setDog = (x, y, z, yaw, pitch, run, wag, tongue) => { dog.position.set(x, y, z); dog.rotation.set(pitch, yaw, 0, 'YXZ'); dogP.legs.forEach((p, i) => { p.rotation.x = Math.sin(run * 1 + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI * .5 : 0)) * (run ? .9 : 0); }); dogP.tail.rotation.set(-.2, 0, Math.sin(wag) * .55); dogP.tail.rotation.x = -.15; dogP.tongue.visible = tongue; };

  // ================================================================== exterior
  const EXT = new THREE.Group(); S.add(EXT);
  const grass = ground(S, 0x6fa84e, 400, { y: -.02 }); S.remove(grass); EXT.add(grass);
  { const SA = Math.atan(SL); const Dp = 8.6, Wd = 9.4;
    const shp = new THREE.Shape(); shp.moveTo(0, 0); shp.lineTo(Dp, 0); shp.lineTo(Dp, 2.75 + SL * Dp); shp.lineTo(0, 2.75); shp.closePath();
    const house = new THREE.Mesh(new THREE.ExtrudeGeometry(shp, { depth: Wd, bevelEnabled: false }), mat(0xf3e2c0)); house.rotation.y = Math.PI / 2; house.position.set(-Wd / 2, 0, 0); house.castShadow = true; house.receiveShadow = true; EXT.add(house);
    const slab = new THREE.Mesh(new THREE.BoxGeometry(Wd + .6, .3, Dp + .6), mat(0xa5503a)); const zc = -Dp / 2 + .1; const zs = zc + .15 * Math.sin(SA); slab.position.set(0, roofY(zs) - .15 * Math.cos(SA), zc); slab.rotation.x = SA; slab.castShadow = true; slab.receiveShadow = true; EXT.add(slab);
    put(EXT, rbox(1.0, 2.1, .12, 0x7a4a28), 2.7, 1.05, .04); put(EXT, new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 6), mat(0xe8c24a)), 2.4, 1.0, .12);
    for (const wx of [-2.8, -.4]) { put(EXT, rbox(1.5, 1.2, .1, 0xffffff), wx, 1.65, .04); const gl = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.0), new THREE.MeshStandardMaterial({ color: 0x8ec8ee, emissive: 0x2a5a8a, emissiveIntensity: .35, roughness: .15 })); gl.position.set(wx, 1.65, .1); EXT.add(gl); put(EXT, rbox(.05, 1.0, .02, 0xffffff, { cast: false }), wx, 1.65, .115); put(EXT, rbox(1.3, .05, .02, 0xffffff, { cast: false }), wx, 1.65, .115); }
    put(EXT, rbox(4.2, .06, 6, 0xcfc8b8, { cast: false }), 2.7, .01, 3.0); // path
    tree(S, -8.5, -3, 2.0, 3); tree(S, 9, -4, 2.3, 8); tree(S, -11, 9, 1.6, 11); S.children.slice(-3).forEach((o) => { S.remove(o); EXT.add(o); });
    for (let i = 0; i < 9; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(.45 + cr(i, 1) * .25, 1), mat(0x3f8a3c, { flatShading: true })); b.position.set(-4.2 + i * 1.05 - (i > 5 ? 0 : 0), .35, 1.0 + cr(i, 2) * .4); if (Math.abs(b.position.x - 2.7) < 1.4) b.position.x += 3.0; b.castShadow = true; EXT.add(b); }
    for (let i = 0; i < 50; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.06, 6, 5), mat([0xffd92a, 0xff6b8a, 0xffffff, 0xc77dff][i % 4])); const a = cr(i, 2) * 6.28, d = 5 + cr(i, 3) * 12; f.position.set(Math.cos(a) * d, .08, Math.sin(a) * d + 4); EXT.add(f); } }
  // roof router on a mast
  const MX = .8, MZ = -2.7, MBY = roofY(MZ) + .95; // router base y
  const routerR = mkRouter(); EXT.add(routerR);
  put(EXT, rbox(.12, .95, .12, 0x30343f), MX, roofY(MZ) + .475, MZ); put(EXT, rbox(.6, .08, .5, 0x30343f), MX, roofY(MZ) + .04, MZ);
  // nest
  const NT = 34; const nest = new THREE.Group(); EXT.add(nest); const twigs = [];
  for (let i = 0; i < NT; i++) { const ring = i % 2; const a = (i / NT) * 6.28 * 1.0 + cr(i, 4) * .3; const r = .3 + ring * .08 + cr(i, 5) * .03; const tw = rbox(.28, .035, .035, [0x7a5230, 0x9a6b3a, 0x5f3e22][i % 3]); tw.position.set(Math.cos(a) * r, .02 + ring * .045, Math.sin(a) * r); tw.rotation.set((cr(i, 6) - .5) * .3, -a + Math.PI / 2 + (cr(i, 7) - .5) * .5, (cr(i, 8) - .5) * .25); nest.add(tw); twigs.push(tw); }
  const nestPad = new THREE.Mesh(new THREE.CylinderGeometry(.3, .26, .05, 16), mat(0x6a4a2a)); nestPad.position.y = .01; nest.add(nestPad);
  // ladder
  const LAD = new THREE.Group(); EXT.add(LAD); { const L = 3.9; for (const sx of [-1, 1]) { const r = rbox(.07, L, .05, 0xc8c8d0, { m: { metalness: .6, roughness: .35 } }); r.position.set(sx * .24, L / 2, 0); LAD.add(r); } for (let i = 0; i < 12; i++) { const rg = rbox(.5, .045, .045, 0xc8c8d0, { m: { metalness: .6, roughness: .35 } }); rg.position.set(0, .3 + i * .3, 0); LAD.add(rg); } }
  const LADX = -.15, LADZ = 2.15; LAD.position.set(LADX, 0, LADZ); LAD.rotation.x = -Math.atan((LADZ - .1) / 3.1); LAD.visible = false;
  // box (bigger router)
  const BOX = new THREE.Group(); S.add(BOX); { const bx = new THREE.Mesh(new THREE.BoxGeometry(.8, .5, .6), mat(0xc79a62)); bx.castShadow = true; BOX.add(bx); const lb = cvs(256, 160, (g, w, h) => { g.fillStyle = '#c79a62'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8c24a'; g.fillRect(10, 10, w - 20, 54); txt(g, 'BIGGER', w / 2, 38, 40, '#222'); txt(g, 'ROUTER', w / 2, 104, 54, '#3a2a14'); }); const pl = new THREE.Mesh(new THREE.PlaneGeometry(.76, .46), new THREE.MeshBasicMaterial({ map: lb.t })); pl.position.z = .302; BOX.add(pl); BOX.position.y = 0; BOX.visible = false; }

  // ================================================================== bird (hero + flock)
  const parts = ['body', 'belly', 'head', 'beak', 'eyeL', 'eyeR', 'tail', 'wingL', 'wingR'];
  const _m = new THREE.Matrix4(), _a = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(), _p = new THREE.Vector3();
  const base = new THREE.Matrix4();
  const mkBase = (x, y, z, yaw, pitch, s) => { _e.set(pitch, yaw, 0, 'YXZ'); _q.setFromEuler(_e); _p.set(x, y, z); _s.set(s, s, s); return base.compose(_p, _q, _s); };
  const bp = (out, bs, tx, ty, tz, rx, rz, ox, oy, oz, sx, sy, sz) => { out.copy(bs); _a.makeTranslation(tx, ty, tz); out.multiply(_a); if (rz) { _a.makeRotationZ(rz); out.multiply(_a); } if (rx) { _a.makeRotationX(rx); out.multiply(_a); } _a.makeTranslation(ox, oy, oz); out.multiply(_a); _a.makeScale(sx, sy, sz); out.multiply(_a); return out; };
  const birdMats = (bs, flap, head, f) => ({
    body: bp(f.body, bs, 0, .2, 0, 0, 0, 0, 0, 0, .30, .26, .34), belly: bp(f.belly, bs, 0, .16, .06, 0, 0, 0, 0, 0, .24, .16, .28),
    head: bp(f.head, bs, 0, .40, .08, head, 0, 0, 0, 0, .25, .22, .22), beak: bp(f.beak, bs, 0, .39, .08, head, 0, 0, 0, .16, .07, .05, .12),
    eyeL: bp(f.eyeL, bs, -.07, .43, .08, head, 0, 0, 0, .115, .04, .045, .03), eyeR: bp(f.eyeR, bs, .07, .43, .08, head, 0, 0, 0, .115, .04, .045, .03),
    tail: bp(f.tail, bs, 0, .24, -.17, .45, 0, 0, 0, -.06, .13, .05, .2),
    wingL: bp(f.wingL, bs, -.16, .28, 0, 0, flap, -.02, -.07, 0, .045, .22, .26), wingR: bp(f.wingR, bs, .16, .28, 0, 0, -flap, .02, -.07, 0, .045, .22, .26) });
  const BCOL = { body: 0x4aa3ff, belly: 0xffffff, head: 0x4aa3ff, beak: 0xff9a1a, eyeL: 0x111111, eyeR: 0x111111, tail: 0x2f6fc0, wingL: 0x2f6fc0, wingR: 0x2f6fc0 };
  const unit = new RoundedBoxGeometry(1, 1, 1, 2, .14);
  // hero
  const hero = {}; for (const k of parts) { const m = new THREE.Mesh(unit, mat(BCOL[k], { roughness: .7 })); m.castShadow = true; m.matrixAutoUpdate = false; S.add(m); hero[k] = m; } const heroF = {}; for (const k of parts) heroF[k] = new THREE.Matrix4();
  const setHero = (x, y, z, yaw, pitch, s, flap, head, vis) => { const bs = mkBase(x, y, z, yaw, pitch, s); const o = birdMats(bs, flap, head, heroF); for (const k of parts) { hero[k].matrix.copy(o[k]); hero[k].visible = vis; } };
  // flock
  const NFL = 30; const flock = {}; const SCOL = [0x4aa3ff, 0xffd23a, 0xff6a6a, 0x6adf7a, 0xff7ad0, 0xb48cff]; const fc = new THREE.Color();
  for (const k of parts) { const im = new THREE.InstancedMesh(unit, mat(0xffffff, { roughness: .7 }), NFL); im.castShadow = true; im.frustumCulled = false; for (let i = 0; i < NFL; i++) { fc.set(BCOL[k]); if (k === 'body' || k === 'head') fc.set(SCOL[i % 6]); if (k === 'tail' || k === 'wingL' || k === 'wingR') fc.set(SCOL[i % 6]).multiplyScalar(.7); im.setColorAt(i, fc); } S.add(im); flock[k] = im; }
  const ringG = new THREE.TorusGeometry(.11, .02, 8, 22); const ringI = new THREE.InstancedMesh(ringG, new THREE.MeshBasicMaterial({ color: 0xffffff }), NFL); ringI.frustumCulled = false; S.add(ringI);
  const haloT = cvs(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(.4, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  const haloI = new THREE.InstancedMesh(new THREE.PlaneGeometry(.7, .7), new THREE.MeshBasicMaterial({ map: haloT.t, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: .8 }), NFL); haloI.frustumCulled = false; S.add(haloI);
  const RC = [0x7ff0ff, 0xff9ae0, 0xfff27a, 0x9aff9a, 0xc4a0ff, 0xffffff]; for (let i = 0; i < NFL; i++) { fc.set(RC[i % 6]); ringI.setColorAt(i, fc); haloI.setColorAt(i, fc); }
  const slots = []; { let n = 0; for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) { const x = -3.7 + c * 1.5 + (r % 2) * .55 + (cr(n, 21) - .5) * .35; const z = -.9 - r * 1.15 + (cr(n, 22) - .5) * .3; slots.push([Math.min(3.6, x), z]); n++; } }
  // swap two slots that collide with the mast/nest and the hero
  for (const s of slots) { if (Math.hypot(s[0] - MX, s[1] - MZ) < 1.0) { s[0] += s[0] < MX ? -1.0 : 1.0; } }
  const flF = {}; for (const k of parts) flF[k] = new THREE.Matrix4(); const flM = new THREE.Matrix4(), flR = new THREE.Matrix4(), hide = new THREE.Matrix4().makeScale(0, 0, 0);
  const placeFlock = (lt, t, on, arrive0, arrDur, excite) => {
    for (let i = 0; i < NFL; i++) {
      const [sx, sz] = slots[i]; const ta = arrive0 + (i / NFL) * arrDur + cr(i, 3) * .25; const u = clamp((lt - ta) / .9);
      if (!on || lt < ta) { for (const k of parts) flock[k].setMatrixAt(i, hide); ringI.setMatrixAt(i, hide); haloI.setMatrixAt(i, hide); continue; }
      const gy = roofY(sz) + .02; let x, y, z, yaw = 0, pitch = 0, flap, head = 0, ringS = 0;
      if (u < 1) { const e = u * u * (3 - 2 * u); x = lerp(sx + (cr(i, 5) - .5) * 9, sx, e); z = lerp(-16 - cr(i, 6) * 4, sz, e); y = lerp(gy + 5 + cr(i, 7) * 3, gy, e) + Math.sin(u * Math.PI) * 1.2; yaw = Math.atan2(x - lerp(sx + (cr(i, 5) - .5) * 9, sx, Math.min(1, e + .02)), 1); yaw = 0; pitch = .35 * (1 - u); flap = .55 + .95 * Math.sin(t * 30 + i * 2); }
      else { const sinceLand = lt - ta - .9; const hop = excite * Math.max(0, Math.sin(t * (5 + cr(i, 8) * 4) + i * 1.7)) ; const land = Math.max(0, .12 * Math.exp(-sinceLand * 5) * Math.abs(Math.sin(sinceLand * 18)));
        x = sx; z = sz; y = gy + hop * .16 + land; yaw = Math.sin(t * .8 + i) * .22 + (cr(i, 9) - .5) * .3; flap = .12 + (hop > .5 ? .5 * Math.sin(t * 34 + i) : 0) + .05 * Math.sin(t * 3 + i); head = .1 * Math.sin(t * 2.5 + i * 1.3); ringS = clamp(sinceLand / .3); }
      const bs = mkBase(x, y, z, yaw, pitch, 1.12); const o = birdMats(bs, flap, head, flF);
      for (const k of parts) flock[k].setMatrixAt(i, o[k]);
      // ring light + halo in front of the bird, facing camera
      bp(flM, bs, 0, .33, .37, 0, 0, 0, 0, 0, ringS, ringS, ringS); ringI.setMatrixAt(i, flM); bp(flM, bs, 0, .33, .3, 0, 0, 0, 0, 0, ringS * (1.3 + .15 * Math.sin(t * 6 + i)), ringS * (1.3 + .15 * Math.sin(t * 6 + i)), 1); haloI.setMatrixAt(i, flM);
    }
    for (const k of parts) flock[k].instanceMatrix.needsUpdate = true; ringI.instanceMatrix.needsUpdate = true; haloI.instanceMatrix.needsUpdate = true; ringI.instanceColor.needsUpdate = true; haloI.instanceColor.needsUpdate = true;
  };
  // hero streaming gear
  const GEAR = new THREE.Group(); EXT.add(GEAR); const ringL = new THREE.Mesh(new THREE.TorusGeometry(.15, .028, 10, 26), new THREE.MeshBasicMaterial({ color: 0xffffff })); ringL.position.set(0, .32, 0); GEAR.add(ringL); put(GEAR, rbox(.1, .17, .02, 0x15171f), 0, .32, 0); const recDot = new THREE.Mesh(new THREE.SphereGeometry(.018, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff2a2a })); recDot.position.set(0, .38, .015); GEAR.add(recDot); put(GEAR, new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .3, 6), mat(0x222222)), 0, .15, 0); GEAR.visible = false;
  const heroHalo = new THREE.Mesh(new THREE.PlaneGeometry(.9, .9), new THREE.MeshBasicMaterial({ map: haloT.t, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: .85, color: 0xaaf0ff })); EXT.add(heroHalo); heroHalo.visible = false;
  // live badge + counters (sprites)
  const liveT = cvs(512, 200); const drawLive = (n) => { const g = liveT.g; g.clearRect(0, 0, 512, 200); g.fillStyle = '#e8252b'; g.strokeStyle = '#111'; g.lineWidth = 10; g.beginPath(); g.roundRect(8, 10, 180, 84, 18); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(46, 52, 12, 0, 7); g.fill(); txt(g, 'LIVE', 120, 54, 52, '#fff'); g.fillStyle = 'rgba(15,15,20,.85)'; g.beginPath(); g.roundRect(8, 110, 496, 84, 18); g.fill(); txt(g, '♥ ' + fmt(n), 256, 154, 58, '#ff7a9a', { stroke: '#111', sw: 8 }); liveT.t.needsUpdate = true; };
  const liveS = new THREE.Sprite(new THREE.SpriteMaterial({ map: liveT.t, transparent: true, depthWrite: false, depthTest: false })); liveS.renderOrder = 11; liveS.visible = false; S.add(liveS);
  const heartT = cvs(96, 96, (g) => { txt(g, '♥', 48, 52, 84, '#ff4d78', { stroke: '#7a0a2a', sw: 8 }); });
  const hearts = []; for (let i = 0; i < 14; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: heartT.t, transparent: true, depthWrite: false })); s.visible = false; S.add(s); hearts.push(s); }
  const barsT = cvs(256, 160); const barsS = new THREE.Sprite(new THREE.SpriteMaterial({ map: barsT.t, transparent: true, depthWrite: false, depthTest: false })); barsS.renderOrder = 11; barsS.visible = false; S.add(barsS);
  const drawBarsSprite = (n, bad) => { const g = barsT.g; g.clearRect(0, 0, 256, 160); g.fillStyle = 'rgba(15,15,20,.75)'; g.beginPath(); g.roundRect(4, 4, 248, 152, 22); g.fill(); drawBars(g, 36, 130, n, bad, 2.0); barsT.t.needsUpdate = true; };
  const mkLabel = (text, c1, c2, w = 512) => { const l = cvs(w, 160, (g, ww, h) => { txt(g, text, ww / 2, 84, text.length > 9 ? 84 : 110, c1, { stroke: c2, sw: 20 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const lbClever = mkLabel('CLEVER!', '#ffe23a', '#111'), lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111');
  const lbDog = mkLabel('WOOF', '#ffffff', '#111', 384);

  // ================================================================== you
  const crowd = new Crowd(S, 1, 61); const YOU = crowd.p[0];
  const colr = (ks, c) => ks.forEach((k) => crowd.parts[k].setColorAt(0, new THREE.Color(c))); colr(['torso', 'armL', 'armR'], 0x3a78d8); colr(['legL', 'legR'], 0x2b3347); colr(['hair'], 0x4a2f1c);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true; YOU.h = 1;
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; };
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);

  // ================================================================== camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3(); const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .03 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .025 + Math.cos(t * 57) * shake; E.z += Math.cos(t * .8) * .03; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .01); };
  const dk = (x, y, z) => [x, y, z];
  const bob2 = (lt, p0, p1) => smooth(clamp((lt - p0) / (p1 - p0)));

  // ================================================================== frame
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    ROOM.visible = bi <= 1; EXT.visible = bi >= 2;
    place(YOU, 0, 0, 0, 0, 'idle', .5); YOU.arms = { lx: -.15, lz: -.12, rx: -.15, rz: .12 }; YOU.pitch = .02;
    let faceShock = false, bars = 1, bad = true, pct = 2, speed = 0.4, followers = 0, lapOn = false, lapPos = null, lapYaw = 0, lapSc = 1, doge = false, barsPos = null, ladOn = false, boxOn = false, routerRs = 1, routerCarried = false, routerPos = [MX, MBY, MZ], nestN = 0, heroOn = false, heroFly = null, gearOn = false, flockOn = false, excite = 0, heartRate = 0, liveOn = false;
    let heroState = { x: MX, y: 0, z: MZ, yaw: 0, pitch: 0, flap: .1, head: 0 };
    const an = {}; let shakeC = 0;
    // ---------------------------------------------------------- beat 0: you stand far, laptop spins, walk to router, hug
    if (bi === 0) {
      faceShock = lt > .5; bars = 1; bad = true; speed = lerp(.4, .8, smooth(lt / 4.2)); pct = Math.min(9, 2 + Math.floor(lt * 2)); lapOn = true;
      const walk = clamp((lt - 1.66) / 1.35); const wx = lerp(-1.55, .05, smooth(walk)); const walking = walk > 0 && walk < 1;
      const hugU = smooth((lt - 3.1) / .5);
      place(YOU, wx, 0, .1, walking ? Math.PI / 2 : lerp(0, 1.15, hugU), walking ? 'walk' : 'idle', walking ? 1.1 : .5);
      if (walking) { YOU.arms = { lx: -1.25, lz: .15, rx: -1.25, rz: -.15 }; YOU.pitch = .02; }
      else if (walk <= 0) { YOU.arms = { lx: -1.3 + Math.sin(lt * 14) * .04, lz: .15, rx: -1.3 - Math.sin(lt * 14) * .04, rz: -.15 }; YOU.pitch = .0; YOU.extra = lt > 1.1 ? .02 : 0; }
      else { YOU.arms = { lx: lerp(-1.25, -1.25, hugU), lz: lerp(.15, -.45, hugU), rx: lerp(-1.25, -1.45, hugU), rz: lerp(-.15, .55, hugU) }; YOU.pitch = .02 + .35 * hugU; }
      const hmid = (u) => 0; // hands midpoint set after crowd.update
      if (walk >= 1) { const setD = smooth((lt - 2.95) / .5); lapPos = [lerp(wx, RX + 1.0, setD), lerp(1.25, TBY + .02, setD), lerp(.5, RZ + .55, setD)]; lapSc = 1; lapYaw = 0; lapPos.hold = 1 - setD; }
    } else if (bi === 1) {
      faceShock = lt > 1.6; bars = 1; bad = true; speed = lerp(.8, 1.1, smooth(lt / 4.2)); pct = 11; lapOn = true; lapPos = [RX + 1.0, TBY + .02, RZ + .55]; lapPos.hold = 0;
      place(YOU, .05, 0, .1, 1.15, 'idle', .5); const hugU = 1; YOU.arms = { lx: -.45 + Math.sin(lt * 3) * .03, lz: -.45, rx: -1.45, rz: .55 }; YOU.pitch = .37; YOU.arms.lx = -1.25; YOU.arms.lz = -.45;
      if (lt > 2.2) { YOU.pitch = .25; }
    }
    // ---------------------------------------------------------- beat 2: roof
    if (bi === 2) {
      ladOn = true; const walk = clamp(lt / 1.5); const yx = lerp(-3.1, -.55, smooth(walk)); const walking = walk < 1; const yz = -2.15;
      const thumbs = smooth((lt - 2.4) / .3) * (1 - smooth((lt - 3.3) / .3));
      place(YOU, yx, roofY(yz), yz, walking ? Math.PI / 2 : lerp(Math.PI / 2, 1.05, smooth((lt - 1.6) / .4)), walking ? 'walk' : 'idle', 1.0);
      if (lt < 2.0) { YOU.arms = { lx: -1.3, lz: .15, rx: -1.3, rz: -.15 }; YOU.pitch = .02; routerCarried = lt < 1.75; } else { YOU.arms = { lx: -.2, lz: -.15, rx: lerp(-.2, -2.7, thumbs), rz: lerp(.12, .28, thumbs) }; }
      if (lt >= 1.5 && lt < 2.0) { const l = clamp((lt - 1.5) / .5); YOU.arms = { lx: lerp(-1.3, -1.9, Math.sin(l * Math.PI)), lz: .15, rx: lerp(-1.3, -1.9, Math.sin(l * Math.PI)), rz: -.15 }; YOU.pitch = .1; }
      faceShock = lt > 3.6; bars = lt > 2.3 ? 5 : 1; bad = !(lt > 2.3); speed = lt < 2.3 ? 1.1 : lerp(1.1, 940, smooth((lt - 2.3) / 1.0)); pct = 100;
      nestN = lt > 4.0 ? Math.min(NT, Math.floor((lt - 4.0) / .045)) : 0;
      // bird glides in from behind the house, lands in the router top
      const topY = MBY + .48 * routerRs;
      if (lt > 3.0) { const u = clamp((lt - 3.0) / 1.25); const e = smooth(u); heroOn = true; const sx = 5.5, sy = topY + 4.5, sz = -10; const hx = lerp(sx, MX, e), hy = lerp(sy, topY + .02, e) + Math.sin(u * Math.PI) * 1.0, hz = lerp(sz, MZ, e);
        heroState = { x: hx, y: hy, z: hz, yaw: 0, pitch: .3 * (1 - u), flap: u < 1 ? .6 + .95 * Math.sin(t * 30) : .12, head: u >= 1 ? .35 * Math.max(0, Math.sin((lt - 4.25) * 9)) : 0 }; }
      if (YOU.arms && lt > 3.6 && lt <= 3.9) {}
    }
    // ---------------------------------------------------------- beat 3: bird streams, you buffer below
    if (bi === 3) {
      heroOn = true; nestN = NT; gearOn = lt > .35; liveOn = lt > .35; const gt = clamp((lt - .35) / 3.5);
      followers = lt < .8 ? 0 : lerp(0, 12400, gt * gt) | 0; heartRate = lt > .8 ? 5 : 0;
      heroState = { x: MX, y: MBY + .48 * routerRs + .03, z: MZ, yaw: 0, pitch: 0, flap: lt > 1.0 ? .12 + .5 * Math.max(0, Math.sin(t * 9)) : .12, head: .08 * Math.sin(t * 5) };
      place(YOU, -.9, 0, 2.2, 0, 'idle', .6); faceShock = lt > 2.0; bars = 1; bad = true; speed = 0.2; pct = 3; lapOn = true; lapPos = [-.9, 1.32, 2.2 + .35]; lapPos.hold = 1; lapPos.held = true;
      YOU.arms = { lx: -1.3 + Math.sin(lt * 12) * .05, lz: .15, rx: -1.3, rz: -.15 }; YOU.pitch = 0; YOU.extra = lt > 2.4 ? .02 : 0;
    }
    // ---------------------------------------------------------- beat 4: bigger router, friends arrive
    if (bi === 4) {
      boxOn = lt < 1.25; const rs = lt < 1.2 ? 1 : lerp(1, 2.1, smooth((lt - 1.2) / .35)) + (lt > 1.5 && lt < 2.0 ? .08 * Math.sin((lt - 1.5) * 20) * (1 - (lt - 1.5) * 2) : 0); routerRs = rs;
      heroOn = true; nestN = NT; gearOn = true; liveOn = true; flockOn = lt > 1.9; excite = clamp((lt - 3.6) / 1); followers = lerp(12400, 480000, smooth((lt - 1.5) / 4.0)) | 0; heartRate = 8;
      const topY = MBY + .48 * rs; heroState = { x: MX, y: topY + .03, z: MZ, yaw: 0, pitch: 0, flap: .12 + .4 * Math.max(0, Math.sin(t * 10)), head: .1 * Math.sin(t * 5) };
      place(YOU, -.9, 0, 2.5, boxOn ? 0 : 0, 'idle', .6); faceShock = lt > 2.4; bars = 1; bad = true; speed = 0.1; pct = 1;
      YOU.arms = boxOn ? { lx: -1.35, lz: .12, rx: -1.35, rz: -.12 } : { lx: -.15, lz: -.12, rx: -.15, rz: .12 }; if (!boxOn && lt > 3.2) YOU.arms = { lx: -2.7, lz: -.35, rx: -2.7, rz: .35 };
    }
    // ---------------------------------------------------------- beat 5: ladder + 2M
    if (bi === 5) {
      ladOn = true; routerRs = 2.1; heroOn = true; nestN = NT; gearOn = true; liveOn = true; flockOn = true; excite = 1; heartRate = 14;
      followers = lerp(480000, 2000000, smooth((lt - 2.5) / 1.55)); if (lt > 4.05) followers = 2000000; followers |= 0;
      const topY = MBY + .48 * 2.1; heroState = { x: MX, y: topY + .03, z: MZ, yaw: 0, pitch: 0, flap: .12 + .6 * Math.max(0, Math.sin(t * 12)), head: .12 * Math.sin(t * 6) };
      place(YOU, LADX, 0, LADZ + .5, Math.PI, 'idle', .6); YOU.pitch = -.2; YOU.arms = { lx: -2.05, lz: -.1, rx: -2.05, rz: .1 }; YOU.extra = .02 * (1 - clamp((lt - .6) / .3)) + .01; faceShock = true; bars = 1; bad = true; speed = 0.1; pct = 1;
    }
    // ---------------------------------------------------------- apply
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t);
    const headY = hp(YOU, 'head'), hL = hp(YOU, 'handL'), hR = hp(YOU, 'handR');
    const hmid = hL.clone().add(hR).multiplyScalar(.5);
    // laptop
    laptop.visible = lapOn; if (lapOn) { drawLaptop(t, bars, pct); let pos; let yaw = 0;
      if (bi === 0 && lapPos == null) { pos = hmid.clone().add(V3(0, -.06, .1)); }
      else if (bi === 0) { const h = lapPos.hold; const pv = V3(lapPos[0], lapPos[1], lapPos[2]); pos = pv.lerp(hmid.clone().add(V3(0, -.06, .1)), h); }
      else if (bi === 3) { pos = hmid.clone().add(V3(0, -.06, .1)); yaw = 0; } else { pos = V3(lapPos[0], lapPos[1], lapPos[2]); }
      laptop.position.copy(pos); laptop.rotation.set(0, yaw, 0); }
    // router indoor + roof
    setLeds(routerIn, bi <= 1 ? 1 : 5, true, t);
    if (bi <= 1) routerIn.userData.ants.forEach((a, i) => { a.rotation.z = [.12, 0, -.12][i] + Math.sin(t * 2 + i) * .01; });
    routerR.visible = bi >= 2; if (bi >= 2) { const carry = routerCarried; let rp = V3(MX, MBY, MZ); if (carry) { rp = hmid.clone().add(V3(0, -.3, .25)); } else if (bi === 2 && lt < 2.0) { const k = smooth((lt - 1.75) / .25); rp = hmid.clone().add(V3(0, -.3, .25)).lerp(V3(MX, MBY, MZ), k); rp.y += Math.sin(k * Math.PI) * .25; }
      routerR.position.copy(rp); routerR.scale.setScalar(routerRs); setLeds(routerR, bars, bad, t); const wob = routerCarried ? 0 : 1; routerR.userData.ants.forEach((a, i) => { a.rotation.z = [.12, 0, -.12][i] + wob * Math.sin(t * 3 + i) * .015; }); }
    if (bi === 2) { barsPos = V3(MX, MBY + 1.5, MZ + .3); }
    if (bi === 3) { barsPos = V3(-.9, 2.5, 2.2); }
    // dog (beat 1)
    dog.visible = bi === 1 && lt > 1.0; if (dog.visible) {
      const topY = TBY + .46; const tl1 = lt;
      if (tl1 < 1.9) { const u = (tl1 - 1.0) / .9; setDog(lerp(3.6, 2.05, u), 0, -.3 + (-2.5 + .3) * 0, -Math.PI / 2, 0, tl1 * 20, 0, true); dog.position.z = RZ + .05; }
      else if (tl1 < 2.5) { const u = (tl1 - 1.9) / .6; const e = u; setDog(lerp(2.05, RX, e), lerp(0, topY, smooth(e)) + Math.sin(u * Math.PI) * .55, RZ + .05, lerp(-Math.PI / 2, 0, smooth(e)), -.25 * Math.sin(u * Math.PI), 2.4, tl1 * 20, true); }
      else { const l = tl1 - 2.5; const sq = Math.exp(-l * 6) * Math.sin(l * 16) * .05; setDog(RX, topY + sq, RZ, 0, 0, 0, t * 17, Math.sin(t * 9) > 0); dogP.legs.forEach((pp) => { pp.rotation.x = 0; }); dogP.tail.rotation.set(-.15, 0, Math.sin(t * 17) * .55); dogP.tail.position.z = -.3; }
      // tail covers antennas: raise tail dramatically after landing
      if (tl1 >= 2.5) { dogP.tail.rotation.x = -.45; dogP.tail.scale.set(1.6, 1.35, 1.6); } else dogP.tail.scale.set(1, 1, 1); }
    // bird hero
    setHero(heroState.x, heroState.y, heroState.z, heroState.yaw, heroState.pitch, 1.15, heroState.flap, heroState.head, heroOn);
    // nest
    nest.visible = nestN > 0 && bi >= 2; if (nest.visible) { const topY = MBY + .48 * routerRs; nest.position.set(MX, topY, MZ); nest.scale.setScalar(Math.max(1, routerRs * .75)); nestPad.visible = nestN > 8; twigs.forEach((tw, i) => { const k = clamp((nestN - i) / 1.2); tw.visible = k > 0; const s = smooth(k); tw.scale.setScalar(.01 + s * (1 + .3 * (1 - s))); }); }
    // streaming gear
    GEAR.visible = gearOn && bi >= 3; heroHalo.visible = GEAR.visible; if (GEAR.visible) { const topY = MBY + .48 * routerRs; const rs = Math.max(1, routerRs * .75); GEAR.position.set(MX, topY, MZ + .5 * rs); GEAR.scale.setScalar(rs); recDot.visible = Math.sin(t * 5) > -.3; heroHalo.position.set(MX, topY + .45, MZ + .56 * rs); heroHalo.scale.setScalar(rs * (1.2 + .1 * Math.sin(t * 7))); }
    // flock
    placeFlock(lt, t, flockOn, bi === 4 ? 1.9 : -9, bi === 4 ? 2.1 : 0, excite);
    ringI.visible = haloI.visible = Object.values(flock).every(() => true); // always
    // live badge + hearts
    liveS.visible = liveOn && bi >= 3; if (liveS.visible) { drawLive(followers); const topY = MBY + .48 * routerRs; const k = Math.max(1, routerRs * .55); liveS.position.set(MX - .6 * k - .35, topY + .95 * k + .35, MZ + .2); liveS.scale.set(1.6 * k * .9, .63 * k * .9, 1); if (bi === 3 && lt < 1.8) liveS.position.y -= 0; }
    hearts.forEach((s, i) => { const on = heartRate > 0 && bi >= 3; s.visible = false; if (!on) return; const per = 1.6 - heartRate * .06; const ph = ((t + cr(i, 31) * 3) / per) % 1; const topY = MBY + .48 * routerRs; s.visible = true; s.position.set(MX + (cr(i, 32) - .4) * 1.4 + Math.sin(ph * 6 + i) * .15, topY + .4 + ph * 1.6, MZ + .5); const sc = (.28 + cr(i, 33) * .12) * clamp(ph * 8) * Math.max(1, routerRs * .55); s.scale.set(sc, sc, 1); s.material.opacity = 1 - ph * ph; });
    // bars sprite
    barsS.visible = !!barsPos; if (barsPos) { drawBarsSprite(bars, bad); barsS.position.copy(barsPos); const k = bi === 2 ? .85 : 1.15; barsS.scale.set(k * 1.0, k * .625, 1); if (bi === 2 && lt > 2.3 && lt < 2.7) { const s2 = 1 + .35 * Math.sin((lt - 2.3) / .4 * Math.PI); barsS.scale.multiplyScalar(s2); } }
    // box
    BOX.visible = boxOn; if (boxOn) { BOX.position.copy(hmid.clone().add(V3(0, .0, .3))); BOX.rotation.set(0, 0, 0); }
    // ladder
    LAD.visible = ladOn;
    // dog woof label etc: labels
    const lb = (s, on, pos, k = 1) => { s.visible = on; if (on) { s.position.copy(pos); const a = clamp(k); s.scale.set(1.15 * a, .36 * a, 1); } };
    lb(lbClever, bi === 1 && lt > .45 && lt < 1.6, V3(headY.x + .55, headY.y + .62 + Math.min(.12, (lt - .45) * .5), headY.z), Math.min(1.25, (lt - .45) * 5) * 1.3);
    lb(lbBetter, bi === 2 && lt > 2.4 && lt < 3.6, V3(MX - .1, MBY + 2.2, MZ + .4), Math.min(1.25, (lt - 2.4) * 5) * 2.1);
    lbDog.visible = false;
    // ---------------------------------------------------------- camera
    const hy = headY; an.hy = hy; const router = V3(MX, MBY + .3 * routerRs, MZ);
    if (bi === 0) rig(lt, [[0, dk(-.4, 1.45, 5.1), dk(-.1, 1.45, 4.6), dk(-1.05, 1.25, 0), dk(-.9, 1.25, 0), 46, 44], [1.6, dk(.1, 1.5, 6.0), dk(.5, 1.45, 5.6), dk(-.5, 1.15, 0), dk(.35, 1.15, -.3), 54, 50], [3.0, dk(1.2, 1.5, 4.2), dk(1.0, 1.4, 3.8), dk(.35, 1.1, -.2), dk(.35, 1.05, -.3), 46, 42]], an, t);
    else if (bi === 1) rig(lt, [[0, dk(1.3, 1.55, 4.4), dk(1.2, 1.5, 4.1), dk(.5, 1.1, -.2), dk(.5, 1.1, -.3), 46, 44], [1.5, dk(1.9, 1.5, 3.7), dk(1.5, 1.7, 3.3), dk(.9, 1.15, -.4), dk(1.0, 1.4, -.9), 40, 36], [2.6, dk(1.9, 1.95, 2.6), dk(1.2, 2.0, 2.2), dk(1.0, 1.45, -1.2), dk(1.0, 1.5, -1.4), 38, 34]], an, t);
    else if (bi === 2) rig(lt, [[0, dk(3.4, 5.6, 3.6), dk(2.6, 5.2, 3.0), dk(-.9, 3.9, -2.4), dk(-.4, 3.95, -2.4), 56, 50], [3.2, dk(2.4, 5.8, 1.4), dk(1.9, 5.5, .9), dk(.8, 4.6, -2.6), dk(.8, 4.7, -2.6), 42, 36]], an, t);
    else if (bi === 3) rig(lt, [[0, dk(2.1, 5.2, .6), dk(1.6, 5.0, .4), dk(.8, 4.6, -2.7), dk(.8, 4.65, -2.7), 38, 34], [1.7, dk(1.2, 2.2, 8.8), dk(.9, 2.3, 7.8), dk(.15, 3.0, 0), dk(.1, 3.0, 0), 56, 52]], an, t);
    else if (bi === 4) rig(lt, [[0, dk(1.0, 1.55, 6.6), dk(.7, 1.55, 6.1), dk(-.6, 1.45, 2.4), dk(-.6, 1.5, 2.4), 44, 42], [1.2, dk(2.8, 4.8, 8.2), dk(2.2, 5.6, 7.4), dk(.2, 3.9, -2.5), dk(.1, 4.0, -2.6), 54, 50], [3.7, dk(-3.6, 4.6, 6.4), dk(-2.6, 4.9, 6.0), dk(.7, 4.2, -2.3), dk(.7, 4.3, -2.3), 54, 50]], an, t);
    else rig(lt, [[0, dk(-5.2, 2.4, 9.8), dk(-4.2, 2.7, 9.0), dk(-.3, 3.0, -1.0), dk(-.3, 3.3, -1.2), 62, 58]], an, t, .004);
    A.follow(0, 0); A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    if (bi <= 2) { const v = bi === 2 && speed > 100 ? fmt(speed) + ' Mbps' : speed.toFixed(1) + ' Mbps'; hud.counter('WIFI SPEED', v, ['standing closer', 'the dog is also on it', 'router on the roof'][bi], '', bi < 2 || speed < 100 ? true : false); }
    else { hud.counter('BIRD FOLLOWERS', fmt(followers), ['it is live', 'friends are joining', 'two million'][bi - 3], '', false); }
    hud.tm(bi >= 3 ? 'YOUR SPEED  ' + speed.toFixed(1) + ' MBPS' : ''); hud.pop('', 0);
  } };
}
