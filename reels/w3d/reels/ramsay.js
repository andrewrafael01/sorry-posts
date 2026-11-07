import { room } from './_rooms.js';
// What if a celebrity chef (generic caricature: blond swept hair, scowl, chef whites) became your school lunch lady? PARODY, no likeness.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, Particles, clamp, smooth, lerp, attach, car } = lib;
  const A = makeStage({ fog: 0xd8d2c4, fogNear: 16, fogFar: 60, clouds: false, skyTop: 0xcfe3f6, skyMid: 0xd8d2c4, skyBot: 0xd8d2c4, shadowExtent: 14, hemi: 1.5, sunI: 1.8, sunDir: [-.4, .9, -.3], exposure: 1.15 }); const S = A.scene;
  room(lib, S, { wall: 0xe3d9b8, floor: 0xa9b4b8, w: 15, d: 13 });
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const lit = (g) => { g.textAlign = 'center'; };
  // ---------------- cafeteria set
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.2, .9), new THREE.MeshStandardMaterial({ map: cvs(640, 140, (g, w, h) => { g.fillStyle = '#2b5a8a'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '800 92px Liberation Sans, Arial'; lit(g); g.fillText('CAFETERIA', w / 2, 105); }) })); sign.position.set(-.4, 3.1, 8.15); sign.rotation.y = Math.PI; S.add(sign);
  const menu = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.4), new THREE.MeshStandardMaterial({ map: cvs(384, 224, (g, w, h) => { g.fillStyle = '#20302a'; g.fillRect(0, 0, w, h); g.fillStyle = '#eee'; g.font = '700 34px Georgia'; g.textAlign = 'left'; ['MENU', 'pizza (frozen)', 'nuggets', 'ketchup: no'].forEach((l, i) => g.fillText(l, 26, 50 + i * 52)); }) })); menu.position.set(-5.6, 2.1, 8.15); menu.rotation.y = Math.PI; S.add(menu);
  addBox(S, -1, .48, 5.7, 8, .96, .9, 0x9aa4ac); addBox(S, -1, .98, 5.7, 8.2, .08, 1.0, 0xd9dde0, { cast: true }); addBox(S, -1, 1.15, 6.15, 8, .3, .05, 0xbfd6e6, { cast: false });
  for (const [x, z] of [[-3.1, 5.55], [-2.2, 5.55], [-1.3, 5.55]]) addBox(S, x, 1.03, z, .8, .02, .55, 0xc6cbd0);
  const table = (x) => { addBox(S, x, .72, 2.8, .62, .06, 4.2, 0xc09a62); for (const z of [.9, 4.7]) addBox(S, x, .36, z, .5, .7, .06, 0x555555); }; table(-1.05); table(1.05);
  // exterior parking lot, far from the room
  const LX = 50; addBox(S, LX, -.05, 4, 26, .1, 22, 0x4a4d52); for (let i = 0; i < 6; i++) addBox(S, LX - 7.5 + i * 3, .0, 8, .12, .02, 4, 0xf2f2f2, { cast: false }); addBox(S, LX, 3, 14.5, 26, 6, .5, 0xb5654a); addBox(S, LX, 4.4, 14.2, 7, 1.0, .1, 0xe9e4d6, { cast: false });
  const lotSign = new THREE.Mesh(new THREE.PlaneGeometry(6, 1), new THREE.MeshStandardMaterial({ map: cvs(600, 100, (g, w, h) => { g.fillStyle = '#e9e4d6'; g.fillRect(0, 0, w, h); g.fillStyle = '#7a2a1f'; g.font = '800 64px Liberation Sans, Arial'; lit(g); g.fillText('LINCOLN MIDDLE', w / 2, 74); }) })); lotSign.position.set(LX, 4.4, 14.1); lotSign.rotation.y = Math.PI; S.add(lotSign);
  car(S, LX - 6, 9.5, 0.2, 0x3a6ea5); car(S, LX + 6.5, 9.0, -.3, 0xc0392b); car(S, LX + 1, 11.5, .1, 0xdddddd);
  // walk-in freezer (right side of back wall); open-front box + hinged door
  const FX = 4.6, FZ = 7.3; const steel = new THREE.MeshStandardMaterial({ color: 0xdfe6ea, metalness: .6, roughness: .35 });
  const fbox = (x, y, z, w, h, d, c) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), c); m.position.set(FX + x, y, FZ + z); m.castShadow = m.receiveShadow = true; S.add(m); return m; };
  fbox(0, 3.1, 0, 2.6, .2, 2.0, steel); fbox(-1.2, 1.5, 0, .2, 3.0, 2.0, steel); fbox(1.2, 1.5, 0, .2, 3.0, 2.0, steel); fbox(0, 1.5, .9, 2.4, 3.0, .2, new THREE.MeshStandardMaterial({ color: 0xcfe9ff, emissive: 0x4a7aa8, emissiveIntensity: .6 })); fbox(0, .02, 0, 2.4, .04, 2.0, new THREE.MeshStandardMaterial({ color: 0xbfd8ee }));
  const door = new THREE.Group(); door.position.set(FX - 1.15, 0, FZ - .98); S.add(door); const dm = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.9, .12), steel); dm.position.set(1.15, 1.5, 0); dm.castShadow = true; door.add(dm);
  const handle = new THREE.Mesh(new THREE.BoxGeometry(.08, .5, .1), mat(0x333333)); handle.position.set(2.0, 1.4, -.1); door.add(handle);
  const frostMat = new THREE.MeshBasicMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0, depthWrite: false }); const frost = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.9), frostMat); frost.position.set(1.15, 1.5, -.075); frost.rotation.y = Math.PI; door.add(frost);
  const wsign = new THREE.Mesh(new THREE.PlaneGeometry(1.8, .4), new THREE.MeshStandardMaterial({ map: cvs(360, 80, (g, w, h) => { g.fillStyle = '#1b4a7a'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '800 46px Liberation Sans, Arial'; lit(g); g.fillText('WALK-IN', w / 2, 56); }) })); wsign.position.set(1.15, 2.6, -.08); wsign.rotation.y = Math.PI; door.add(wsign);
  // ---------------- people: 0 chef, 1 inspector, 2 hero kid, 3.. kids
  const NK = 9, crowd = new Crowd(S, 3 + NK, 619); const P = crowd.p; const col = (i, k, c) => crowd.parts[k].setColorAt(i, new THREE.Color(c));
  const G = P[0]; ['torso', 'armL', 'armR'].forEach((k) => col(0, k, 0xf4f4ee)); ['legL', 'legR'].forEach((k) => col(0, k, 0x2b2f3a)); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(0, k, 0xe0b496)); col(0, 'hair', 0xe6c06a);
  const INS = P[1]; ['torso', 'armL', 'armR'].forEach((k) => col(1, k, 0x59616e)); ['legL', 'legR'].forEach((k) => col(1, k, 0x3a3f4b)); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(1, k, 0xd9ad8a)); col(1, 'hair', 0x3a3a3a);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const mk = (geo, color, o = {}) => { const m = new THREE.Mesh(geo, o.m || mat(color, o)); m.castShadow = true; S.add(m); return m; };
  const BX = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  // Gordon-ish cues: swept blond quiff, hairnet, heavy scowl brows + frown, chef whites + dark apron, neck scarf
  const quiff = mk(BX(.44, .13, .34), 0xe6c06a), quiff2 = mk(BX(.36, .1, .14), 0xdcb25a), net = mk(BX(.48, .3, .5), 0, { m: new THREE.MeshStandardMaterial({ color: 0xcfe8ff, transparent: true, opacity: .28, roughness: .4 }) });
  const browL = mk(BX(.14, .035, .04), 0x5a3f1e), brow = mk(BX(.14, .035, .04), 0x5a3f1e), frown = mk(BX(.15, .028, .03), 0x6a2a24), frL = mk(BX(.04, .03, .03), 0x6a2a24), frR = mk(BX(.04, .03, .03), 0x6a2a24);
  const apron = mk(BX(.52, .5, .05), 0x2c3a52), apTop = mk(BX(.34, .2, .05), 0x2c3a52), scarf = mk(BX(.26, .07, .24), 0xc23b3b), pocket = mk(BX(.16, .12, .06), 0x3d4d6a), buttons = mk(BX(.03, .5, .03), 0xdddddd);
  const insTie = mk(BX(.06, .26, .03), 0xb02020), badge = mk(BX(.09, .09, .03), 0xf2c230), insHat = mk(BX(.4, .05, .4), 0x2a2f38);
  // props
  const ladle = new THREE.Group(); { const h = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .6, 8), mat(0x999999, { metalness: .8, roughness: .3 })); h.position.y = 0; const b = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xaaaaaa, { metalness: .8, roughness: .3 })); b.position.y = .3; b.rotation.x = Math.PI; ladle.add(h, b); ladle.children.forEach((c) => (c.castShadow = true)); S.add(ladle); }
  const pizza = new THREE.Group(); { const crust = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .035, 24), mat(0xe2b86a)); const cheese = new THREE.Mesh(new THREE.CylinderGeometry(.29, .29, .04, 24), mat(0xf4dc8a)); pizza.add(crust, cheese); for (const [x, z] of [[.1, .05], [-.12, .1], [.02, -.14], [-.1, -.1], [.17, -.08]]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .045, 12), mat(0xa8322a)); p.position.set(x, .002, z); pizza.add(p); } const fr = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, .05, 24), new THREE.MeshStandardMaterial({ color: 0xe8f6ff, transparent: true, opacity: .62, roughness: .2 })); pizza.add(fr); pizza.children.forEach((c) => (c.castShadow = true)); S.add(pizza); }
  const ice = new THREE.InstancedMesh(new THREE.OctahedronGeometry(.04), new THREE.MeshStandardMaterial({ color: 0xd8f0ff, emissive: 0x6aa0d0, emissiveIntensity: .5 }), 30); ice.frustumCulled = false; S.add(ice);
  const tray = mk(BX(.95, .05, .62), 0x6a7480); const trayRim = mk(BX(.97, .08, .64), 0x4d5662);
  const NUG = []; for (let i = 0; i < 6; i++) NUG.push(mk(BX(.16, .09, .12), 0xc98a3a)); const NOFF = [[-.28, -.12], [-.1, .12], [.08, -.1], [.26, .1], [-.18, .0], [.15, .02]];
  const starShape = new THREE.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? .12 : .28, a = Math.PI / 2 + i * Math.PI / 5; i ? starShape.lineTo(Math.cos(a) * r, Math.sin(a) * r) : starShape.moveTo(Math.cos(a) * r, Math.sin(a) * r); } starShape.closePath();
  const star = new THREE.Mesh(new THREE.ExtrudeGeometry(starShape, { depth: .08, bevelEnabled: true, bevelSize: .02, bevelThickness: .02, bevelSegments: 2 }), new THREE.MeshStandardMaterial({ color: 0xf6c935, metalness: .9, roughness: .2, emissive: 0xaa7a10, emissiveIntensity: .6 })); star.castShadow = true; S.add(star);
  const ketchup = new THREE.Group(); { const b = new THREE.Mesh(new THREE.CylinderGeometry(.05, .06, .22, 10), mat(0xc0201a)); const c = new THREE.Mesh(new THREE.CylinderGeometry(.02, .035, .06, 8), mat(0xf2f2f2)); c.position.y = .14; ketchup.add(b, c); S.add(ketchup); }
  const pans = []; for (let i = 0; i < NK + 2; i++) { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(.2, .17, .07, 16), mat(0x2b2b2e, { metalness: .6, roughness: .4 })); const r = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, .02, 16), mat(0xf2e9c8)); r.position.y = .035; const hd = new THREE.Mesh(new THREE.BoxGeometry(.3, .03, .04), mat(0x2b2b2e)); hd.position.set(.3, .02, 0); g.add(p, r, hd); g.children.forEach((c) => (c.castShadow = true)); S.add(g); pans.push(g); }
  const rawSign = new THREE.Group(); { const pole = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .7, 6), mat(0x8a6a42)); pole.position.y = -.3; const pl = new THREE.Mesh(new THREE.PlaneGeometry(.85, .55), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: cvs(340, 220, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = '#111'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); g.fillStyle = '#111'; g.font = '800 120px Liberation Sans, Arial'; lit(g); g.fillText('RAW', w / 2, 150); g.strokeStyle = '#e01818'; g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(50, 30); g.lineTo(290, 195); g.moveTo(290, 30); g.lineTo(50, 195); g.stroke(); }) })); pl.position.y = .1; rawSign.add(pole, pl); S.add(rawSign); }
  const clip = mk(BX(.24, .32, .02), 0x9a7a4a);
  const tears = new Particles(S, 40, 0x7fc4ff, .035, { rough: .1 }), sparks = new Particles(S, 40, 0xffe27a, .04, { emissive: 0xaa8a20 }), frostP = new Particles(S, 50, 0xeef8ff, .05, { rough: .8 });
  const mkBubble = (wpx, tw) => { const c = document.createElement('canvas'); c.width = wpx; c.height = 128; const g = c.getContext('2d'); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); sp.scale.set(tw, tw * 128 / wpx, 1); sp.visible = false; S.add(sp); let cur = null; return { sp, set(text, col = '#fff') { if (text === cur) return; cur = text; g.clearRect(0, 0, wpx, 128); g.fillStyle = col; g.strokeStyle = '#111'; g.lineWidth = 7; g.beginPath(); g.roundRect(6, 6, wpx - 12, 84, 22); g.fill(); g.stroke(); g.fillStyle = '#111'; g.font = '800 46px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText(text, wpx / 2, 66); tex.needsUpdate = true; } }; };
  const gb = mkBubble(768, 2.2), hb = mkBubble(384, 1.1), kb = Array.from({ length: 3 }, () => mkBubble(384, 1.1)), ib = mkBubble(512, 1.5);
  const say = (b, text, x, y, z, on, col) => { b.sp.visible = !!on; if (on) { b.set(text, col); b.sp.position.set(x, y, z); } };
  // kid seats
  const SEAT = []; for (const sd of [-1, 1]) for (const z of [1.2, 2.0, 2.8, 3.6, 4.4]) SEAT.push([sd * 1.75, z, -sd * Math.PI / 2]); SEAT.splice(3, 1); const HSEAT = [-1.75, 3.6, Math.PI / 2]; // hero is kid 0 -> seat index 3? keep 11 seats + hero
   const kids = P.slice(2); const seatKids = kids.slice(1); // kids[0] hero
  const sit = (o, x, z, yaw) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = 'sit'; o.y = .72 - .68 * 1.2 + .02; o.speed = .4; o.vis = true; o.scale = 1.2; o.arms = { lx: -.5, lz: -.1, rx: -.5, rz: .1 }; };
  const stand = (o, x, z, yaw, y = 0) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = 'idle'; o.y = y; o.speed = .4; o.vis = true; o.scale = 1.2; o.arms = { lx: -.1, lz: -.1, rx: -.1, rz: .1 }; };
  const level = (m, o, key, off, rx, rot = [0, 0, 0]) => attach(m, o, key, off, [-rx + rot[0], rot[1], rot[2]]);
  const CNT = (v) => String(Math.round(v)); const ease = smooth;
  const POP = ['', 'RAW', 'THE PARKING LOT', 'STILL NUGGETS', 'THE CAFETERIA', 'LOVINGLY', 'RISOTTO'];
  const POPT = [0, 3.35, 4.2, 3.7, 5.9, 4.8, 2.85]; // lt each pop starts
  const POPE = [0, 4.6, 6.2, 5.6, 9.5, 6.9, 4.1]; // lt each pop ends
  const HV = new THREE.Vector3(), M4 = new THREE.Matrix4(), D = new THREE.Object3D();
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 6); for (let i = 0; i < P.length; i++) { P[i].vis = false; P[i].arms = null; P[i].extra = 0; P[i].pitch = 0; P[i].hs = 1; }
    [ladle, pizza, tray, trayRim, star, ketchup, rawSign, clip, ...NUG, ...pans, ice.parent && ice].forEach((m) => m && (m.visible = false));
    tears.clear(); sparks.clear(); frostP.clear(); [...kb, gb, hb, ib].forEach((b) => (b.sp.visible = false)); let shock = false;
    // default seated kids
    seatKids.forEach((o, i) => { const s = SEAT[i]; sit(o, s[0], s[1], s[2]); });
    const H = kids[0]; sit(H, HSEAT[0], HSEAT[1], HSEAT[2]);
    // Gordon base
    G.vis = true; G.x = 0; G.z = 6.4; G.yaw = Math.PI; G.anim = 'idle'; G.speed = .5; G.scale = 1.3; G.y = 0; G.arms = { lx: -.3, lz: -.1, rx: -.5, rz: .1 };
    const armsG = (l, r, lz = -.1, rz = .1) => (G.arms = { lx: l, lz, rx: r, rz });
    let cam = [0, 2.4, -1.6, 0, 1.55, 6.4, 46]; let count = '', cval = '', cnote = '', hot = false; let cry = 0; let showLadle = false, showPizza = false, showTray = false, nuggetsOn = false, starOn = 0;
    let gbText = '', gbOn = false, hbText = '', hbOn = false, hbX = 0, hbZ = 0;
    let pizzaMode = 0; // 0 hand, 1 at mouth
    let insVis = false, doorAng = 0, frostA = 0, rawKids = false; let ketchupInHand = false;
    if (bi === 0) { showLadle = true; armsG(-.3, -.9 + Math.sin(t * 3) * .12); cam = [lerp(-1.6, 0, ease(p)), 2.4, lerp(1.0, 1.4, p), .5, 1.95, 6.4, lerp(44, 48, p)]; }
    if (bi === 1) {
      count = 'Kids watching'; showPizza = true; const w = (lo, hi) => clamp((lt - lo) / (hi - lo));
      const toMouth = ease(w(1.25, 2.0)) * (1 - ease(w(3.0, 3.5))); const yell = w(2.85, 3.0) * (1 - w(5.6, 5.7)); pizzaMode = toMouth > .5 ? 1 : 0;
      armsG(lerp(-.3, -1.1, ease(w(.4, 1.2))), lerp(-1.25, -2.35, toMouth) + (lt > 2.85 && lt < 3.9 ? Math.sin(t * 12) * .25 : 0) - (lt > 5.7 ? 0 : 0));
      if (lt > 3.9) { armsG(-1.3, -1.4); } // hold the frozen pizza up to show it
      if (lt > 5.7) { armsG(-2.3, -2.3); G.pitch = .15; cry = 1; } // hands on face, sob
      if (lt > 2.85 && lt < 4.0) G.extra = .06;
      if (lt > 5.7) G.extra = .03;
      const bt = lt < 1.2 ? '' : lt < 2.0 ? 'mm.' : lt < 2.85 ? '...' : lt < 4.3 ? 'THIS IS RAW' : lt < 5.7 ? "IT'S FROZEN" : '';
      gbText = bt; gbOn = bt !== ''; shock = lt > 3.0;
      const cnt = lt < 6.86 ? 0 : 400 * ease(w(6.86, 7.8)); cval = CNT(cnt); cnote = cnt > 0 ? 'and counting' : 'waiting'; hot = cnt >= 400;
      cam = lt < 3.2 ? [lerp(-.7, -0.5, w(0, 3.2)), 2.5, lerp(1.0, 1.8, w(0, 3.2)), .5, 1.95, 6.4, 44] : lt < 5.6 ? [-.6, 2.5, 1.8, .5, 1.95, 6.4, 44] : [lerp(-.6, 0, ease(w(5.6, 7.8))), lerp(2.5, 3.4, ease(w(5.6, 7.8))), lerp(1.8, -3.2, ease(w(5.6, 7.8))), lerp(.5, 0, ease(w(5.6, 7.8))), lerp(1.95, 1.2, ease(w(5.6, 7.8))), lerp(6.4, 5.0, ease(w(5.6, 7.8))), lerp(44, 58, ease(w(5.6, 7.8)))];
    }
    if (bi === 2) {
      count = 'Kids crying'; cval = lt < 5.0 ? '0' : '1'; cnote = lt < 5.0 ? '' : 'the kid, in a parking lot';
      const w = (lo, hi) => clamp((lt - lo) / (hi - lo)); const outside = lt >= 3.95;
      if (!outside) {
        stand(H, -1.0, 4.5, 0); H.arms = { lx: -.1, lz: -.1, rx: -.1, rz: .1 }; hbText = lt < 2.4 ? 'ketchup?' : 'ketchup?'; hbOn = lt > 1.3; hbX = H.x; hbZ = H.z;
        const wl = ease(w(2.8, 3.5)); armsG(-.4, -.5 - wl * .9 + (lt > 2.4 ? Math.sin(t * 14) * .08 : 0)); G.extra = lt > 2.4 && lt < 3.4 ? .02 : 0; shock = lt > 2.4;
        if (lt > 3.3) { G.z = lerp(6.4, 5.1, ease(w(3.3, 3.95))); G.x = lerp(0, H.x + .4, ease(w(3.3, 3.95))); }
        cam = [.5 - w(0, 3.9) * .2, 2.9, -1.0, -.2, 1.8, 6.0, lerp(46, 42, w(0, 3.9))];
        kids.forEach((o) => { if (o !== H && lt > 2.4) o.anim = 'sit'; });
        if (lt > 2.4) say(kb[0], 'oh no', -2.0, 1.95, 3.4, true);
        ketchupInHand = true;
      } else {
        // parking lot
        const u = w(3.95, 5.6), wk = ease(u); H.vis = true; H.x = LX - 2.2 + wk * 2.2; H.z = 7.5 - wk * 1.0; H.yaw = Math.PI * .75; H.anim = lt < 5.6 ? 'walk' : 'idle'; H.speed = .5; H.scale = 1.2; H.y = 0; H.arms = { lx: -.1, lz: -.1, rx: -.9, rz: .1 }; if (lt >= 5.6) { H.yaw = Math.PI * .85; }
        G.x = H.x + .9; G.z = H.z - .7; G.y = 0; G.yaw = -Math.PI * .7; G.anim = lt < 5.6 ? 'walk' : 'idle'; G.speed = .5; G.pitch = lt >= 5.6 ? .2 : 0; armsG(-.3, lt >= 5.6 ? -2.3 + Math.sin(t * 6) * .15 : -1.0);
        ketchupInHand = true; say(gb, lt < 5.6 ? 'KETCHUP.' : 'WHAT DID YOU DO TO DESERVE THIS', G.x, 3.25, G.z, lt > 4.2, '#fff'); if (lt >= 5.6) { gb.sp.scale.set(2.8, 2.8 * 128 / 768, 1); } else gb.sp.scale.set(1.3, 1.3 * 128 / 768, 1);
        say(hb, lt < 6.6 ? '...' : 'idk', H.x, 2.5, H.z, lt > 5.2); gbOn = false; hbOn = false;
        cam = [LX - 1.8, 2.6, -.4, LX + .2, 1.5, 6.6, 48];
      }
    }
    if (bi === 3) {
      count = 'Stars'; showTray = true; nuggetsOn = true; const w = (lo, hi) => clamp((lt - lo) / (hi - lo)); const st = w(2.7, 3.4);
      cval = lt < 3.0 ? '0' : '1'; cnote = lt < 3.0 ? 'nuggets' : 'still nuggets'; hot = lt >= 3.0;
      armsG(-1.25, -1.25 + Math.sin(t * 2) * .02); G.anim = 'idle';
      starOn = st; shock = lt > 5.2;
      kids.forEach((o) => { if (lt > 5.1) { o.anim = 'sit'; o.arms = { lx: -2.2, lz: -.1, rx: -2.2, rz: .1 }; o.extra = lt > 5.2 ? .1 : 0; } });
      if (lt > 5.1) { seatKids.forEach((o, i) => { o.x = SEAT[i][0] + Math.sign(SEAT[i][0]) * ease(w(5.1, 5.6)) * .4; }); }
      if (lt > 1.6 && lt < 3.0) say(kb[0], 'nuggets?', SEAT[2][0], 1.95, SEAT[2][1], true);
      if (lt > 5.4) say(kb[1], 'sir?', SEAT[7][0], 1.95, SEAT[7][1], true); if (lt > 5.7) say(kb[2], 'please no', SEAT[1][0], 1.95, SEAT[1][1], true);
      { const wd = ease(w(4.7, 5.5)); cam = [lerp(-.6, 0, wd), lerp(2.5, 3.4, wd), lerp(1.8, -3.2, wd), lerp(.5, 0, wd), lerp(1.95, 1.2, wd), lerp(6.4, 5.0, wd), lerp(44, 58, wd)]; }
    }
    if (bi === 4) {
      count = 'Kids crying'; const w = (lo, hi) => clamp((lt - lo) / (hi - lo)); const rant = w(3.3, 3.5);
      cval = lt < 1.5 ? '1' : lt < 5.9 ? '2' : lt < 8.6 ? '3' : '4'; cnote = lt < 5.9 ? 'one kid, not hungry' : 'pointing at the sign';
      stand(H, -1.0, 4.6, 0); H.arms = { lx: -.1, lz: -.1, rx: -.1, rz: .1 }; if (lt > 3.4) { H.anim = 'idle'; H.pitch = -.15 - Math.min(.1, (lt - 3.4) * .05); H.y = 0; }
      hbOn = lt > 1.3 && lt < 3.3; hbText = 'not hungry'; hbX = H.x; hbZ = H.z;
      G.z = lerp(6.4, 5.95, ease(w(3.2, 3.6))); G.pitch = lerp(0, .35, rant);
      const point = lt > 5.8 ? ease(w(5.8, 6.2)) : 0; const again = lt > 7.3 ? 1 : 0;
      armsG(lt > 3.3 ? -1.6 + Math.sin(t * 9) * .25 * (1 - point) : -.4, lt > 3.3 ? lerp(-1.4 + Math.sin(t * 8) * .3, -2.6, point) : -.5);
      if (lt > 3.3) G.extra = .015; if (lt > 5.8) G.extra = 0; shock = lt > 3.3;
      gbOn = lt > 3.3 && lt < 5.5; gbText = 'WHY ARE YOU IN MY KITCHEN'; if (lt >= 5.5 && lt < 7.2) { gbOn = true; gbText = "IT'S THE CAFETERIA"; } if (lt >= 7.3) { gbOn = true; gbText = 'IT WAS ALWAYS THE CAFETERIA'; }
      if (lt > 3.3) { seatKids.forEach((o, i) => { o.anim = 'sit'; o.arms = { lx: -2.2, lz: -.1, rx: -2.2, rz: .1 }; }); }
      kids.forEach((o, i) => { if (lt > 8.2 && i % 2 === 0) o.extra = .04; });
      sign.scale.setScalar(1 + (lt > 5.8 ? Math.abs(Math.sin(t * 9)) * .06 * (lt < 9.4 ? 1 : 0) : 0));
      cam = [lerp(.5, 0, w(0, 9)), 2.9, -1.0, -.3, lerp(1.9, 2.4, ease(w(5.6, 6.4))), 6.3, 46];
    }
    if (bi === 5) {
      count = 'Inspectors in freezer'; const w = (lo, hi) => clamp((lt - lo) / (hi - lo)); insVis = true;
      cval = lt < 5.3 ? '0' : '1'; cnote = lt < 5.3 ? 'on his clipboard' : 'lovingly'; hot = lt >= 5.3;
      G.x = 2.7; G.z = 5.6; G.yaw = Math.PI; G.scale = 1.3;
      INS.vis = true; INS.scale = 1.2; INS.y = 0; INS.arms = { lx: -1.0, lz: -.1, rx: -.1, rz: .1 }; INS.anim = 'idle'; INS.yaw = Math.PI; INS.speed = .5;
      const walkIn = ease(w(1.0, 2.8)); INS.x = lerp(-2.0, 1.9, walkIn); INS.z = lerp(3.2, 4.9, walkIn); INS.yaw = lerp(Math.PI * .6, Math.PI * .85, walkIn); INS.anim = lt < 2.8 ? 'walk' : 'idle'; INS.speed = .5;
      const grab = ease(w(3.0, 3.5)), lead = ease(w(3.5, 4.4)), shove = ease(w(4.4, 5.0));
      G.x = lerp(2.7, 3.2, lead) - 0; INS.x = lerp(INS.x, 3.4, lead); INS.z = lerp(INS.z, 6.2, lead); INS.z = lerp(INS.z, 7.5, shove); G.z = lerp(5.6, 6.0, lead) + shove * .4; INS.yaw = Math.PI * .5 + (1 - lead) * 1.0;
      INS.anim = lt > 3.5 && lt < 4.4 ? 'walk' : INS.anim; INS.arms = lt > 4.4 ? { lx: -2.5, lz: -.1, rx: -2.5, rz: .1 } : INS.arms;
      G.yaw = lerp(Math.PI, Math.PI * .65, grab); G.pitch = 0;
      armsG(lt < 3.0 ? -.3 : -1.3, lt < 3.0 ? -.5 : (lt < 4.4 ? -1.35 : -1.6 + Math.sin(t * 10) * .1));
      doorAng = -ease(w(3.2, 4.0)) * 1.9 + ease(w(5.0, 5.7)) * 1.9; frostA = ease(w(5.6, 6.8)) * .6;
      gbOn = lt > 2.8 && lt < 4.0; gbText = 'INSPECT THIS'; hbOn = false; say(ib, "I'M FROM THE COUNTY", INS.x, 2.7, INS.z, lt > 1.9 && lt < 3.0); say(ib, 'KNOCK KNOCK', 4.0, 3.3, 6.6, lt > 6.0);
      shock = lt > 4.4; if (lt > 5.7) { G.arms = { lx: -.3, lz: -.1, rx: -2.4 + Math.sin(t * 5) * .2, rz: .1 }; }
      for (let i = 0; i < 50; i++) { const u = ((t * .4 + i * .02) % 1); const on = lt > 5.0 ? Math.min(1, (lt - 5.0) / 1.2) : 0; frostP.set(i, 4.0 + Math.sin(i * 3.7) * .9, .3 + u * 2.4, 6.5 - u * .6 + Math.cos(i * 2.1) * .3, on * (1 - u) * 1.4); }
      seatKids.forEach((o, i) => { if (SEAT[i][0] > 0) o.vis = false; });
      cam = [.4, 2.6, -.4, lerp(1.8, 3.0, ease(w(0, 4.2))), 1.8, 6.4, lerp(56, 50, w(0, 6.5))];
    }
    if (bi === 6) {
      count = 'Kids who can cook risotto'; const w = (lo, hi) => clamp((lt - lo) / (hi - lo));
      cval = lt < 2.9 ? '0' : CNT(Math.min(12, 12 * w(2.9, 3.6))); cnote = lt < 4.0 ? '' : 'say the word: 0'; hot = lt >= 3.6;
      const ls = ease(w(0, 1.2)); rawKids = true;
      const row = [H, ...seatKids]; row.forEach((o, i) => { const x = ((i >> 1) - 2) * .8 + (i % 2) * .4, z = 3.2 + (i % 2) * .5; o.x = lerp(o.x, x, ls); o.z = lerp(o.z, z, ls); o.yaw = lerp(o.yaw, Math.PI, ls); o.anim = 'idle'; o.y = lerp(o.y, 0, ls); o.speed = .4; o.arms = { lx: -.1, lz: -.1, rx: -.1, rz: .1 }; const up = ease(w(.6 + i * .08, 1.4 + i * .08)); o.arms = { lx: lerp(-.5, -1.35, up), lz: -.1, rx: lerp(-.5, -1.35, up), rz: .1 }; });
      H.x = lerp(H.x, 0, ls); H.z = lerp(H.z, 2.3, ls); H.arms = { lx: -.1, lz: -.1, rx: lt > 4.0 ? -2.8 : -1.35, rz: .1 }; if (lt > 4.0) H.arms.rx = lerp(-1.35, -2.8, ease(w(4.0, 4.6)));
      G.x = 0; G.z = 6.4; armsG(-1.45, -1.45); G.pitch = 0; kids.forEach((o) => (o.extra = 0)); G.extra = 0;
      kb.forEach((b) => (b.sp.visible = false)); say(gb, 'MY SON.', 0, 3.2, 6.4, lt > 1.6 && lt < 2.8); gbText = ''; gbOn = false;
      cam = [lerp(-.8, 0, ease(w(0, 6.2))), 2.7, -1.6, 0, 1.75, 4.6, 54];
    }
    crowd.update(t);
    // ----- chef accessories
    attach(quiff, G, 'head', [0, .27, .08], [-.35, 0, 0]); attach(quiff2, G, 'head', [-.12, .22, .22], [-.2, 0, .5]); attach(net, G, 'head', [0, .18, -.02]);
    attach(brow, G, 'head', [.09, .075, .235], [0, 0, .42]); attach(browL, G, 'head', [-.09, .075, .235], [0, 0, -.42]);
    attach(frown, G, 'head', [0, -.125, .236]); attach(frL, G, 'head', [-.085, -.105, .236], [0, 0, -.6]); attach(frR, G, 'head', [.085, -.105, .236], [0, 0, .6]);
    attach(scarf, G, 'torso', [0, .36, .02]); attach(apron, G, 'torso', [0, -.06, .17]); attach(apTop, G, 'torso', [0, .24, .17]); attach(pocket, G, 'torso', [.1, -.1, .2]); attach(buttons, G, 'torso', [-.18, .1, .17]);
    attach(insTie, INS, 'torso', [0, .12, .17]); attach(badge, INS, 'torso', [-.15, .16, .17]); attach(insHat, INS, 'head', [0, .25, 0]); insTie.visible = badge.visible = insHat.visible = INS.vis;
    // ----- props
    if (showLadle) { level(ladle, G, 'handR', [0, -.1, .0], -.9, [-.6, 0, 0]); ladle.visible = G.vis; }
    if (showPizza) { if (pizzaMode === 1) level(pizza, G, 'handR', [0, -.13, .1], -2.35, [-1.2, 0, 0]); else level(pizza, G, 'handR', [-.2, -.15, .06], -1.4, [0, 0, 0]); pizza.visible = true; if (lt > 4.3 && lt < 5.7) { pizza.scale.setScalar(1.15); } else pizza.scale.setScalar(1); }
    if (showPizza) { ice.visible = lt > 3.5 && lt < 5.8; if (ice.visible) { const pp = new THREE.Vector3().setFromMatrixPosition(pizza.matrix); for (let i = 0; i < 30; i++) { const u = (t * .6 + i * .033) % 1; D.position.set(pp.x + Math.sin(i * 2.3) * .3, pp.y - u * .8, pp.z + Math.cos(i * 1.7) * .25); D.rotation.set(t * 3 + i, i, 0); D.scale.setScalar(1 - u); D.updateMatrix(); ice.setMatrixAt(i, D.matrix); } ice.instanceMatrix.needsUpdate = true; } }
    else ice.visible = false;
    if (showTray) { level(tray, G, 'handR', [-.42, -.1, .0], -1.25); level(trayRim, G, 'handR', [-.42, -.1, -.02], -1.25); tray.visible = trayRim.visible = true; NUG.forEach((n, i) => { level(n, G, 'handR', [-.42 + NOFF[i][0], -.1 + NOFF[i][1] * .5, .075], -1.25, [0, i * .7, 0]); n.visible = true; }); }
    if (starOn > 0 && showTray) { const sp = new THREE.Vector3().setFromMatrixPosition(tray.matrix); star.position.set(sp.x + .55, sp.y + .5 + starOn * .4 + Math.sin(t * 3) * .03, sp.z - .0); star.rotation.set(0, Math.PI + Math.sin(t * 2) * .5, 0); star.scale.setScalar(Math.max(.01, starOn * (1 + .15 * Math.sin(t * 6)))); star.visible = true; for (let i = 0; i < 24; i++) { const a = i * .9 + t * 2, r = .3 + ((t * .7 + i * .05) % 1) * .35; sparks.set(i, star.position.x + Math.cos(a) * r, star.position.y + Math.sin(a * 1.3) * r * .8, star.position.z + Math.sin(a) * .1, (1 - ((t * .7 + i * .05) % 1)) * starOn); } }
    if (ketchupInHand) { if (bi === 2) { level(ketchup, H, 'handR', [0, -.1, .05], H.arms.rx, [0, 0, 0]); ketchup.visible = H.vis; ketchup.scale.setScalar(1.2); } }
    if (rawKids) { const row = [H, ...seatKids]; row.forEach((o, i) => { if (o === H) return; level(pans[i], o, 'handR', [-.2, -.2, 0], -1.35, [0, 0, 0]); pans[i].visible = true; }); level(pans[NK + 1], H, 'handL', [.2, -.2, 0], -1.35); pans[NK + 1].visible = true; rawSign.visible = lt > 3.8; if (rawSign.visible) { level(rawSign, H, 'handR', [0, -.45, 0], H.arms.rx, [0, 0, 0]); rawSign.scale.setScalar(1.3); } }
    // pans in left hands too for the row (rice-colored)
    if (rawKids) { const row = [H, ...seatKids]; row.forEach((o, i) => { }); }
    // tears
    if (cry) for (let i = 0; i < 40; i++) { const u = (t * .9 + i * .025) % 1; const s = i % 2 ? .09 : -.09; HV.set(s, -.03, .23).applyMatrix4(G.M.head); tears.set(i, HV.x + s * .3 * u * (i % 3), HV.y - u * .9, HV.z - u * .15, 1 - u * .3); } tears.done(); sparks.done(); frostP.done();
    door.rotation.y = insVis || bi === 5 ? doorAng : 0; frostMat.opacity = frostA; if (bi !== 5) { door.rotation.y = 0; frostMat.opacity = 0; }
    if (bi !== 4) sign.scale.setScalar(1);
    crowd.setFace(shock ? 'shock' : 'calm');
    // bubbles
    if (bi !== 2) { say(gb, gbText, G.x, 3.0, G.z, gbOn); gb.sp.scale.set(gbText.length > 18 ? 2.1 : 1.5, (gbText.length > 18 ? 2.1 : 1.5) * 128 / 768, 1); }
    if (gbOn && bi !== 2) gb.sp.position.set(G.x - (bi === 4 ? .7 : .5), bi === 1 ? 2.95 : 3.0, G.z - .5); if (bi === 5 && gbOn) gb.sp.position.set(G.x - .8, 3.3, G.z - .4);
    if (bi !== 6 && bi !== 3 && bi !== 2) say(hb, hbText, hbX, 2.6, hbZ, hbOn);
    if (bi === 3 && lt < 3.0) { /* kid bubbles set above */ }
    if (bi === 5) { INS.vis = true; }
    A.cam(...cam); A.follow(bi === 2 && lt >= 3.95 ? LX : 0, bi === 2 && lt >= 3.95 ? 6 : 4); A.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if *Gordon Ramsay* became your school lunch lady?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter(count, cval, cnote, 'PARODY', hot); hud.tm('');
    const pt = POPT[bi], pe = POPE[bi]; hud.pop(POP[bi] && lt > pt && lt < pe ? POP[bi] : '', Math.min(1, (lt - pt) * 6));
  } };
}
