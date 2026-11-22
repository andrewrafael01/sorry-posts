// 688 invention chain: parrot repeats everything -> you go silent -> it repeats the silence -> whisper -> it whispers to neighbors -> neighbors keep notes -> cracker + card number -> parrot gets you fired and gets hired.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, mat, Crowd, clamp, smooth, lerp, tree } = lib;
  const A = makeStage({ fog: 0xbcd8ee, fogNear: 40, fogFar: 150, clouds: true, skyTop: 0x3f86d8, skyMid: 0x9cc8f0, skyBot: 0xe2eef9, shadowExtent: 12, shadowRes: 2048, hemi: 1.5, sunI: 1.9, sunDir: [-.3, .9, .6], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t, w, h }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rbox = (w, h, d, c, o = {}) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * .2), o.mat || mat(c, o.m || {})); m.castShadow = o.cast !== false; m.receiveShadow = true; return m; };
  const put = (par, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); par.add(m); return m; };
  const sph = (par, r, c, x, y, z, sx = 1, sy = 1, sz = 1, o = {}) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), o.mat || mat(c, { roughness: .75 })); m.scale.set(sx, sy, sz); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; par.add(m); return m; };
  const eob = (u) => { u = clamp(u); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); }; // ease out back
  const win = (lt, a, b) => lt >= a && lt < b;

  // ================================================================== ROOM
  const ROOM = new THREE.Group(); S.add(ROOM); const WALL = new THREE.Group(); ROOM.add(WALL);
  const WX0 = 0, WX1 = 3.2, WY0 = .95, WY1 = 2.55, WZ = -3.0;
  { const fl = new THREE.Mesh(new THREE.PlaneGeometry(9.4, 7.4), mat(0xb98a5a, { roughness: .6 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, .5); fl.receiveShadow = true; ROOM.add(fl);
    for (let i = -4; i < 5; i++) { const pl = new THREE.Mesh(new THREE.PlaneGeometry(.012, 7.4), mat(0x8a6234)); pl.rotation.x = -Math.PI / 2; pl.position.set(i * 1.05, .003, .5); ROOM.add(pl); }
    const wc = 0xf3e6cf; const wl = (x0, x1, y0, y1, c = wc) => { const w = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, .2), mat(c)); w.position.set((x0 + x1) / 2, (y0 + y1) / 2, WZ - .1); w.receiveShadow = true; w.castShadow = true; WALL.add(w); };
    wl(-4.7, WX0, 0, 3.6); wl(WX1, 4.7, 0, 3.6); wl(WX0, WX1, 0, WY0); wl(WX0, WX1, WY1, 3.6);
    put(WALL, rbox(9.4, .16, .06, 0xffffff, { cast: false }), 0, .08, WZ + .03);
    // window frame + sill
    put(WALL, rbox(WX1 - WX0 + .3, .09, .26, 0xffffff), (WX0 + WX1) / 2, WY1 + .02, WZ + .02); put(WALL, rbox(.1, WY1 - WY0 + .1, .26, 0xffffff), WX0 - .02, (WY0 + WY1) / 2, WZ + .02); put(WALL, rbox(.1, WY1 - WY0 + .1, .26, 0xffffff), WX1 + .02, (WY0 + WY1) / 2, WZ + .02);
    put(WALL, rbox(WX1 - WX0 + .5, .07, .5, 0xffffff), (WX0 + WX1) / 2, WY0 - .01, WZ + .15);
    for (const sx of [-1, 1]) { const cu = rbox(.5, 1.95, .08, 0xd9604a); cu.position.set(sx < 0 ? WX0 - .32 : WX1 + .32, 1.55, WZ + .1); WALL.add(cu); }
    const lw = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 3.6), mat(0xe9d9bd)); lw.rotation.y = Math.PI / 2; lw.position.set(-4.7, 1.8, .5); ROOM.add(lw);
    const rw = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 3.6), mat(0xe9d9bd)); rw.rotation.y = -Math.PI / 2; rw.position.set(4.7, 1.8, .5); ROOM.add(rw);
    const ce = new THREE.Mesh(new THREE.PlaneGeometry(9.4, 7.4), mat(0xf6f0e4)); ce.rotation.x = Math.PI / 2; ce.position.set(0, 3.6, .5); ROOM.add(ce);
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, .02, 40), mat(0x3f6fa8)); rug.position.set(0, .011, -.5); rug.scale.z = .7; rug.receiveShadow = true; ROOM.add(rug);
    const rug2 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, .025, 40), mat(0xe8d9a8)); rug2.position.set(0, .013, -.5); rug2.scale.z = .7; ROOM.add(rug2);
    // couch
    const C = new THREE.Group(); C.position.set(-.8, 0, -2.45); ROOM.add(C); const cc = 0xd9a441;
    put(C, rbox(2.2, .26, .95, 0x8a5a24), 0, .13, 0); put(C, rbox(1.7, .2, .8, cc), 0, .36, .03); put(C, rbox(2.2, .75, .22, cc), 0, .72, -.4); for (const sx of [-1, 1]) put(C, rbox(.22, .55, .95, 0xc4902e), sx * 1.0, .5, 0);
    put(C, rbox(.5, .42, .12, 0xe05a4a), -.62, .78, -.26, -.15, 0, .12);
    // plant + picture + lamp
    put(ROOM, new THREE.Mesh(new THREE.CylinderGeometry(.22, .17, .4, 14), mat(0xc4673a)), -3.2, .2, -2.5); sph(ROOM, .5, 0x3d8a3a, -3.2, .85, -2.5, 1, 1.15, 1, { mat: mat(0x3d8a3a, { flatShading: true }) });
    const pic = cvs(160, 200, (g, w, h) => { g.fillStyle = '#e8c76a'; g.fillRect(0, 0, w, h); g.fillStyle = '#6fb0e0'; g.fillRect(14, 14, w - 28, h - 28); g.fillStyle = '#f4f0e0'; g.beginPath(); g.arc(60, 60, 20, 0, 7); g.fill(); g.fillStyle = '#4f9a4a'; g.beginPath(); g.moveTo(14, h - 14); g.lineTo(70, 110); g.lineTo(110, 150); g.lineTo(150, 100); g.lineTo(w - 14, h - 14); g.fill(); });
    const pm = new THREE.Mesh(new THREE.PlaneGeometry(.8, 1.0), new THREE.MeshBasicMaterial({ map: pic.t })); pm.position.set(-1.9, 2.1, WZ + .01); ROOM.add(pm);
    // perch stand
    const PRX = .75, PRZ = -1.3;
    put(ROOM, new THREE.Mesh(new THREE.CylinderGeometry(.3, .34, .05, 20), mat(0x4a3320)), PRX, .025, PRZ); put(ROOM, new THREE.Mesh(new THREE.CylinderGeometry(.035, .04, .72, 10), mat(0x6a4a2a)), PRX, .38, PRZ); put(ROOM, new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .55, 10), mat(0x8a6234)), PRX, .74, PRZ, 0, 0, Math.PI / 2);
    // desk-ish tray (beat 5) is added separately
  }
  const PERCH = V3(.75, .78, -1.3);
  // ================================================================== YARD (always visible)
  const YARD = new THREE.Group(); S.add(YARD);
  { const gr = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), mat(0x6fa84e, { roughness: 1 })); gr.rotation.x = -Math.PI / 2; gr.position.y = -.03; gr.receiveShadow = true; YARD.add(gr);
    const FZ = -4.2; const FH = .78;
    for (let i = 0; i < 46; i++) { const x = -5 + i * .24; const pk = rbox(.19, FH, .05, 0xfafafa, { m: { roughness: .6 } }); pk.position.set(x, FH / 2, FZ); YARD.add(pk); const tp = new THREE.Mesh(new THREE.ConeGeometry(.095, .1, 4), mat(0xfafafa)); tp.rotation.y = Math.PI / 4; tp.position.set(x, FH + .04, FZ); YARD.add(tp); }
    for (const y of [.25, .6]) put(YARD, rbox(11, .07, .05, 0xeeeeee), 0.5, y, FZ - .05);
    // neighbor house, far
    const H = new THREE.Group(); H.position.set(1.6, 0, -13); YARD.add(H); put(H, rbox(9, 4.6, 5, 0xc9d8e8), 0, 2.3, 0); for (const s of [-1, 1]) put(H, rbox(5.2, .3, 6, 0x42536b), s * 2.2, 5.0, 0, 0, 0, -s * .5);
    for (const [x, y] of [[-2.4, 2.8], [2.4, 2.8], [-2.4, 1.0], [2.4, 1.0]]) put(H, rbox(1.3, 1.2, .1, 0xffffff), x, y, 2.5); for (const [x, y] of [[-2.4, 2.8], [2.4, 2.8], [-2.4, 1.0], [2.4, 1.0]]) put(H, rbox(1.1, 1.0, .06, 0x9fd0f0, { m: { roughness: .1 } }), x, y, 2.55);
    tree(S, -6, -9, 1.7, 3); tree(S, 9, -8, 2.0, 7); S.children.slice(-2).forEach((o) => { S.remove(o); YARD.add(o); });
    for (let i = 0; i < 40; i++) { const f = sph(YARD, .06, [0xffd92a, 0xff6b8a, 0xffffff, 0xc77dff][i % 4], -7 + cr(i, 2) * 14, .08, -5 - cr(i, 3) * 6, 1, 1, 1, { cast: false }); } }

  // ================================================================== PARROT
  const mkParrot = () => {
    const g = new THREE.Group(); const GR = 0x2db84d, GRD = 0x1f9a3a, LIME = 0x9be34f, RED = 0xe5342a, BLUE = 0x2a6fd8, YEL = 0xffc928, IV = 0xf3e7c6, IVD = 0xc9b98f;
    const body = new THREE.Group(); body.position.y = .30; g.add(body);
    sph(body, .2, GR, 0, .22, 0, .98, 1.32, .92); sph(body, .17, LIME, 0, .2, .075, .86, 1.12, .66);
    const wings = [-1, 1].map((sx) => { const w = new THREE.Group(); w.position.set(sx * .185, .43, 0); body.add(w); sph(w, .05, GRD, sx * .025, -.2, -.015, 1, 5.2, 3.1); sph(w, .045, BLUE, sx * .025, -.44, -.01, 1, 2.6, 2.6); sph(w, .035, YEL, sx * .03, -.58, -.01, 1, 1.9, 2.0); return w; });
    const tail = new THREE.Group(); tail.position.set(0, .12, -.16); body.add(tail); { const f = (x, len, c, rz, c2) => { const q = new THREE.Group(); q.rotation.z = rz; tail.add(q); const fm = rbox(.075, len, .02, c); fm.position.set(x, -len / 2, 0); q.add(fm); const tp = rbox(.075, .09, .022, c2); tp.position.set(x, -len - .03, 0); q.add(tp); };
      f(0, .5, RED, 0, YEL); f(-.07, .42, BLUE, .12, BLUE); f(.07, .42, BLUE, -.12, BLUE); f(-.13, .34, GRD, .26, YEL); f(.13, .34, GRD, -.26, YEL); tail.rotation.x = .38; }
    const head = new THREE.Group(); head.position.set(0, .50, .03); body.add(head);
    sph(head, .165, RED, 0, .14, .0, 1, 1.0, 1.02); sph(head, .1, RED, 0, .26, -.02, 1, .6, 1); // crown tuft
    const eyes = [-1, 1].map((sx) => { const e = new THREE.Group(); e.position.set(sx * .085, .18, .115); head.add(e); sph(e, .06, 0xffffff, 0, 0, 0, 1.0, 1.05, .62, { cast: false }); const pu = sph(e, .03, 0x111111, 0, 0, .026, 1, 1, .6, { cast: false }); const hl = sph(e, .009, 0xffffff, .01, .012, .038, 1, 1, 1, { cast: false });
      const lid = sph(e, .066, RED, 0, .11, .012, 1, .9, .7, { cast: false }); return { e, pu, hl, lid }; });
    const beak = new THREE.Group(); beak.position.set(0, .115, .145); head.add(beak);
    sph(beak, .08, 0xffb21f, 0, .0, .06, 1, 1.0, 1.45); sph(beak, .05, 0xe0891a, 0, -.075, .16, .9, 1.6, 1);
    const lower = new THREE.Group(); lower.position.set(0, -.03, .02); beak.add(lower); sph(lower, .055, 0xd9961a, 0, -.02, .05, 1, .55, 1.4); const tongue = rbox(.05, .012, .08, 0xff7a98); tongue.position.set(0, .005, .06); lower.add(tongue);
    const tip = new THREE.Object3D(); tip.position.set(0, -.04, .17); beak.add(tip);
    sph(head, .075, 0xffffff, -.1, .15, .085, .6, .9, .5, { cast: false }); sph(head, .075, 0xffffff, .1, .15, .085, .6, .9, .5, { cast: false });
    // accessories
    const hs = new THREE.Group(); head.add(hs); hs.visible = false; { const arc = new THREE.Mesh(new THREE.TorusGeometry(.17, .014, 8, 22, Math.PI), mat(0x222222)); arc.rotation.z = 0; arc.position.set(0, .15, 0); arc.rotation.y = Math.PI / 2; hs.add(arc); for (const sx of [-1, 1]) put(hs, rbox(.04, .09, .08, 0x333333), sx * .17, .15, 0); const bm = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .17, 6), mat(0x222222)); bm.rotation.z = Math.PI / 2; bm.position.set(-.1, .15, .09); hs.add(bm); put(hs, new THREE.Mesh(new THREE.SphereGeometry(.018, 8, 6), mat(0xe8252b)), -.19, .15, .11); const bl = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .12, 6), mat(0x222222)); bl.position.set(-.17, .11, .05); bl.rotation.set(.9, 0, 0); hs.add(bl); }
    const tie = new THREE.Group(); body.add(tie); tie.visible = false; put(tie, rbox(.07, .07, .03, 0xd8201a), 0, .36, .2); put(tie, rbox(.085, .22, .02, 0xd8201a), 0, .24, .2, .0, 0, 0); put(tie, rbox(.04, .06, .021, 0xa81410), 0, .09, .205);
    const tagC = cvs(640, 300, (c, w, h) => { c.fillStyle = '#fff'; c.beginPath(); c.roundRect(6, 6, w - 12, h - 12, 28); c.fill(); c.strokeStyle = '#111'; c.lineWidth = 10; c.stroke(); c.fillStyle = '#2a6fd8'; c.fillRect(20, 20, w - 40, 78); txt(c, 'HELLO, I AM', w / 2, 60, 52, '#fff'); txt(c, 'NEW', w / 2, 158, 84, '#d8201a'); txt(c, 'EMPLOYEE', w / 2, 240, 70, '#111'); });
    const tag = new THREE.Mesh(new THREE.PlaneGeometry(.46, .215), new THREE.MeshBasicMaterial({ map: tagC.t, transparent: true })); tag.position.set(0, .2, .235); tag.visible = false; body.add(tag);
    for (const sx of [-1, 1]) { const ln = rbox(.014, .3, .01, 0x2a6fd8, { cast: false }); ln.position.set(sx * .06, .34, .205); ln.rotation.z = sx * -.22; ln.userData.lan = true; tie.add(ln); }
    // feet
    const feet = [-1, 1].map((sx) => { const f = new THREE.Group(); f.position.set(sx * .075, .03, .02); g.add(f); put(f, rbox(.035, .22, .035, 0xe58a1a), 0, .13, -.02); for (const [x, z] of [[-.03, .06], [0, .08], [.03, .06]]) put(f, rbox(.03, .025, .09, 0xff9a1a), x, 0, z); return f; });
    return { g, body, head, beak, lower, tongue, wings, tail, eyes, tip, hs, tie, tag, feet };
  };
  const P = mkParrot(); S.add(P.g); const PS = 1.25;
  const setP = (o = {}) => { const d = Object.assign({ x: PERCH.x, y: PERCH.y, z: PERCH.z, yaw: -.4, s: PS, lean: 0, roll: 0, hp: 0, hy: 0, hr: 0, beak: 0, wl: [0, 0], wr: [0, 0], tail: 0, lid: 0, lx: 0, ly: 0, blink: 0, bob: 0, vis: true, hs: false, tie: false, tag: false, tongue: false }, o);
    P.g.visible = d.vis; P.g.position.set(d.x, d.y + d.bob, d.z); P.g.rotation.set(0, d.yaw, 0, 'YXZ'); P.g.scale.setScalar(d.s); P.body.rotation.set(d.lean, 0, d.roll); P.head.rotation.set(d.hp, d.hy, d.hr); P.lower.rotation.x = d.beak * .75; P.tongue.visible = d.beak > .2;
    P.wings[0].rotation.set(d.wl[0], 0, -d.wl[1]); P.wings[1].rotation.set(d.wr[0], 0, d.wr[1]); P.tail.rotation.set(.0, 0, d.tail); P.hs.visible = d.hs; P.tie.visible = d.tie; P.tag.visible = d.tag;
    P.eyes.forEach((q) => { q.pu.position.set(d.lx * .022, d.ly * .02, .026); q.hl.position.set(.01 + d.lx * .022, .012 + d.ly * .02, .038); q.lid.position.y = lerp(.12, .028, d.lid) - d.blink * .09; q.e.scale.y = 1 - d.blink * .1; }); };
  const wave = (t, f, ph = 0) => Math.sin(t * f + ph);
  const idleP = (t, o = {}) => Object.assign({ bob: Math.sin(t * 2.4) * .01, hr: Math.sin(t * 1.3) * .05, hy: Math.sin(t * .9) * .08, blink: (t % 3.1) < .12 ? 1 : 0, tail: Math.sin(t * 1.7) * .05, wl: [0, .12 + Math.sin(t * 1.9) * .02], wr: [0, .12 + Math.sin(t * 1.9 + 1) * .02] }, o);
  const beakTipW = () => { P.g.updateMatrixWorld(true); return P.tip.getWorldPosition(new THREE.Vector3()); };

  // ================================================================== PEOPLE
  const crowd = new Crowd(S, 3, 61); const YOU = crowd.p[0], N1 = crowd.p[1], N2 = crowd.p[2];
  const colr = (i, ks, c) => ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c)));
  colr(0, ['torso', 'armL', 'armR'], 0x3a78d8); colr(0, ['legL', 'legR'], 0x2b3347); colr(0, ['hair'], 0x4a2f1c);
  colr(1, ['torso', 'armL', 'armR'], 0xc8a02a); colr(1, ['legL', 'legR'], 0x5b4a3a); colr(1, ['hair'], 0xcfcfcf); colr(2, ['torso', 'armL', 'armR'], 0xb84a8a); colr(2, ['legL', 'legR'], 0x30404f); colr(2, ['hair'], 0x2a1a12);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; o.sitPitch = 0; o.hs = 1; };
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const SEAT_Y = .42 - .8;

  // ================================================================== props: zipper, cracker, crumbs, clipboards, box, card, board
  const zip = new THREE.Group(); { put(zip, rbox(.3, .022, .012, 0x777777), 0, 0, 0); for (let i = 0; i < 10; i++) put(zip, rbox(.012, .03, .014, i % 2 ? 0xdddddd : 0x444444), -.135 + i * .03, 0, .002); put(zip, rbox(.045, .07, .02, 0xffd23a), .1, -.03, .01); } zip.visible = false; S.add(zip);
  const cracker = new THREE.Group(); { put(cracker, rbox(.2, .03, .2, 0xe4b25a), 0, 0, 0); for (let i = 0; i < 9; i++) put(cracker, new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .035, 6), mat(0xb77a2c)), -.06 + (i % 3) * .06, 0, -.06 + ((i / 3) | 0) * .06); cracker.scale.setScalar(1.15); } cracker.visible = false; S.add(cracker);
  const NC = 18; const crumbs = []; for (let i = 0; i < NC; i++) { const m = rbox(.035, .03, .035, 0xe4b25a, { cast: false }); m.visible = false; S.add(m); crumbs.push(m); }
  const mkClip = () => { const g = new THREE.Group(); put(g, rbox(.5, .64, .03, 0x7a4e28), 0, 0, 0); const sh = cvs(256, 320, (c, w, h) => { c.fillStyle = '#fffdf2'; c.fillRect(0, 0, w, h); c.strokeStyle = '#9ab'; c.lineWidth = 3; for (let y = 60; y < h; y += 34) { c.beginPath(); c.moveTo(16, y); c.lineTo(w - 16, y); c.stroke(); } txt(c, 'NOTES', w / 2, 30, 36, '#111'); c.strokeStyle = '#222'; c.lineWidth = 5; for (let y = 78; y < 290; y += 34) { c.beginPath(); c.moveTo(24, y); c.lineTo(24 + 60 + cr(y, 1) * 150, y); c.stroke(); } });
    const pg = new THREE.Mesh(new THREE.PlaneGeometry(.44, .55), new THREE.MeshBasicMaterial({ map: sh.t })); pg.position.set(0, -.02, .018); g.add(pg); put(g, rbox(.2, .07, .04, 0xc8c8d0, { m: { metalness: .6 } }), 0, .3, .02); g.scale.setScalar(.85); g.visible = false; S.add(g); return g; };
  const clip1 = mkClip(), clip2 = mkClip();
  const BOXG = new THREE.Group(); { put(BOXG, rbox(.5, .32, .38, 0xc79a62), 0, 0, 0); put(BOXG, rbox(.3, .02, .02, 0xa87a42), 0, .165, .1); sph(BOXG, .1, 0x3d8a3a, -.1, .28, 0, 1, 1.3, 1); put(BOXG, new THREE.Mesh(new THREE.CylinderGeometry(.06, .05, .1, 12), mat(0xffffff)), .12, .21, .02); } BOXG.visible = false; S.add(BOXG);
  // cork board with polaroids and red string
  const BW = 1.9, BH = 1.3, BCX = 1.6, BCY = 1.72, BCZ = -5.7; const bcv = cvs(1024, 700);
  const polas = [[170, 150, 'yoga'], [600, 120, 'latte'], [850, 200, 'car'], [210, 430, 'pizza'], [520, 470, 'cookie'], [840, 470, 'clock']]; // top-left px of 200 wide photos
  const drawPhoto = (g, kind, x, y, w, h) => { g.save(); g.translate(x, y); g.fillStyle = '#e8f0f6'; g.fillRect(0, 0, w, h); g.fillStyle = '#9ccf7a'; g.fillRect(0, h * .72, w, h * .28);
    if (kind === 'me') { g.fillStyle = '#3a78d8'; g.fillRect(w * .28, h * .56, w * .44, h * .3); g.fillStyle = '#efd0a6'; g.fillRect(w * .34, h * .22, w * .32, h * .32); g.fillStyle = '#4a2f1c'; g.fillRect(w * .32, h * .16, w * .36, h * .1); g.fillStyle = '#111'; g.fillRect(w * .4, h * .34, w * .05, h * .05); g.fillRect(w * .56, h * .34, w * .05, h * .05); g.fillRect(w * .43, h * .46, w * .14, h * .03); }
    else if (kind === 'latte') { g.fillStyle = '#fff'; g.fillRect(w * .25, h * .35, w * .42, h * .42); g.fillRect(w * .66, h * .45, w * .14, h * .18); g.fillStyle = '#9a6a3a'; g.fillRect(w * .28, h * .38, w * .36, h * .1); }
    else if (kind === 'car') { g.fillStyle = '#2a6fd8'; g.fillRect(w * .12, h * .5, w * .76, h * .2); g.fillRect(w * .3, h * .36, w * .38, h * .16); g.fillStyle = '#111'; g.beginPath(); g.arc(w * .3, h * .72, w * .1, 0, 7); g.arc(w * .7, h * .72, w * .1, 0, 7); g.fill(); }
    else if (kind === 'pizza') { g.fillStyle = '#e8b04a'; g.beginPath(); g.moveTo(w * .5, h * .8); g.lineTo(w * .15, h * .3); g.lineTo(w * .85, h * .3); g.fill(); g.fillStyle = '#d8301a'; g.beginPath(); g.arc(w * .42, h * .42, w * .06, 0, 7); g.arc(w * .6, h * .45, w * .06, 0, 7); g.arc(w * .5, h * .6, w * .06, 0, 7); g.fill(); }
    else if (kind === 'cookie') { g.fillStyle = '#c98a3e'; g.beginPath(); g.arc(w * .5, h * .5, w * .3, 0, 7); g.fill(); g.fillStyle = '#4a2a14'; for (const [a, b] of [[.4, .4], [.58, .44], [.5, .6], [.38, .56], [.6, .6]]) { g.beginPath(); g.arc(w * a, h * b, w * .04, 0, 7); g.fill(); } }
    else if (kind === 'yoga') { g.fillStyle = '#b84a8a'; g.fillRect(w * .36, h * .4, w * .28, h * .3); g.fillStyle = '#efd0a6'; g.beginPath(); g.arc(w * .5, h * .3, w * .1, 0, 7); g.fill(); g.strokeStyle = '#b84a8a'; g.lineWidth = w * .06; g.beginPath(); g.moveTo(w * .36, h * .5); g.lineTo(w * .14, h * .3); g.moveTo(w * .64, h * .5); g.lineTo(w * .86, h * .3); g.stroke(); }
    else if (kind === 'clock') { g.fillStyle = '#fff'; g.beginPath(); g.arc(w * .5, h * .5, w * .32, 0, 7); g.fill(); g.strokeStyle = '#111'; g.lineWidth = w * .04; g.beginPath(); g.moveTo(w * .5, h * .5); g.lineTo(w * .5, h * .28); g.moveTo(w * .5, h * .5); g.lineTo(w * .66, h * .56); g.stroke(); }
    g.restore(); };
  const capt = { yoga: 'TUES: YOGA (BADLY)', latte: 'OAT LATTE x3', car: 'BLUE CAR, DENT', pizza: 'PIZZA, 11 PM', cookie: 'THE LAST COOKIE', clock: 'WAKES AT 7:42' };
  const drawBoard = (lt) => { const g = bcv.g; g.fillStyle = '#c8955a'; g.fillRect(0, 0, 1024, 700); for (let i = 0; i < 700; i++) { g.fillStyle = cr(i, 1) < .5 ? 'rgba(120,70,30,.35)' : 'rgba(255,220,160,.3)'; g.fillRect(cr(i, 2) * 1024, cr(i, 3) * 700, 3 + cr(i, 4) * 5, 3 + cr(i, 5) * 4); }
    g.strokeStyle = '#6b4220'; g.lineWidth = 22; g.strokeRect(11, 11, 1002, 678);
    const PW = 190, PH = 175; const pins = polas.map(([x, y]) => [x + PW / 2, y + 8]); const cx = 512 - 20, cy = 345;
    // string
    g.strokeStyle = '#e0201a'; g.lineWidth = 6; g.lineCap = 'round'; const order = [0, 1, 2, 5, 4, 3]; order.forEach((k, i) => { const u = clamp((lt - .25 - i * .18) / .35); if (u <= 0) return; const [px, py] = pins[k]; g.beginPath(); g.moveTo(cx, cy); g.lineTo(lerp(cx, px, u), lerp(cy, py, u)); g.stroke(); });
    const u2 = clamp((lt - 1.5) / .5); if (u2 > 0) { g.beginPath(); g.moveTo(pins[0][0], pins[0][1]); g.lineTo(lerp(pins[0][0], pins[3][0], u2), lerp(pins[0][1], pins[3][1], u2)); g.stroke(); }
    // photos
    const photo = (x, y, w, h, kind, cap, rot) => { g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.translate(-w / 2, -h / 2); g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 10; g.shadowOffsetY = 5; g.fillStyle = '#fff'; g.fillRect(-8, -8, w + 16, h + 56); g.shadowColor = 'transparent'; drawPhoto(g, kind, 0, 0, w, h); txt(g, cap, w / 2, h + 24, 28, '#222', { w: 800 }); g.fillStyle = '#e0201a'; g.beginPath(); g.arc(w / 2, -4, 8, 0, 7); g.fill(); g.restore(); };
    polas.forEach(([x, y, k], i) => photo(x, y, PW, PH, k, capt[k], (cr(i, 9) - .5) * .12));
    photo(cx - 120, cy - 108, 240, 215, 'me', 'THE NEIGHBOR (YOU)', 0); g.fillStyle = '#ffe23a'; g.save(); g.translate(60, 640); g.rotate(-.05); g.fillRect(0, -40, 360, 58); txt(g, 'CASE FILE: YOU', 180, -10, 36, '#111'); g.restore();
    bcv.t.needsUpdate = true; };
  const BOARD = new THREE.Group(); BOARD.position.set(BCX, BCY, BCZ); YARD.add(BOARD);
  { put(BOARD, new THREE.Mesh(new THREE.PlaneGeometry(BW, BH), new THREE.MeshBasicMaterial({ map: bcv.t })), 0, 0, .04); put(BOARD, rbox(BW + .16, BH + .16, .06, 0x6b4220), 0, 0, 0); for (const sx of [-1, 1]) put(BOARD, rbox(.07, BCY + .1, .07, 0x6b4220), sx * (BW / 2 - .1), -BCY / 2 - .05, -.12, .0, 0, 0); }
  const BTOP = V3(BCX, BCY + BH / 2 + .08, BCZ + .0);

  // ================================================================== bubbles & labels
  const sprites = [];
  const mkBubble = (lines, o = {}) => { const size = o.size || 150, fg = o.fg || '#111', bg = o.bg || '#fff', tail = o.tail || 0; const n = lines.length, H = 70 + n * size * 1.08; const cw = 1024; const l = cvs(cw, H + 100, (g, w) => { g.fillStyle = bg; g.strokeStyle = '#111'; g.lineWidth = 14; if (o.dash) g.setLineDash([34, 22]); g.beginPath(); g.roundRect(14, 14, w - 28, H - 14, 72); g.fill(); g.stroke(); g.setLineDash([]); g.beginPath(); const tx = w / 2 + tail; g.moveTo(tx - 56, H - 20); g.lineTo(tx + 8, H + 86); g.lineTo(tx + 58, H - 20); g.closePath(); g.fill(); g.stroke(); g.fillStyle = bg; g.fillRect(tx - 50, H - 27, 106, 16); lines.forEach((s, i) => txt(g, s, w / 2, 48 + size * .62 + i * size * 1.08, size, fg, { w: 900 })); });
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.userData.ar = (H + 100) / cw; s.center.set((cw / 2 + tail) / cw, (H + 100 - (H + 86)) / (H + 100)); s.visible = false; s.renderOrder = 10; S.add(s); sprites.push(s); return s; };
  const mkLabel = (text, c1, c2, size = 120, w = 900) => { const l = cvs(w, size * 1.7, (g, ww, hh) => { txt(g, text, ww / 2, hh / 2, size, c1, { stroke: c2, sw: size * .2 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.userData.ar = l.h / l.w; s.visible = false; s.renderOrder = 11; S.add(s); sprites.push(s); return s; };
  const showS = (s, on, pos, w, k = 1) => { s.visible = on; if (!on) return; s.position.copy(pos); const a = Math.max(.01, eob(k)); s.scale.set(w * a, w * s.userData.ar * a, 1); };
  const bYou1 = mkBubble(['GOOD', 'MORNING!'], { size: 150, tail: -120 }), bPar1 = mkBubble(['GOOD', 'MORNING!'], { size: 150, tail: 100, fg: '#1f9a3a', bg: '#fff7d6' });
  const bYou2 = mkBubble(['STOP', 'THAT.'], { size: 150, tail: -120 }), bPar2 = mkBubble(['STOP', 'THAT.'], { size: 150, tail: 100, fg: '#1f9a3a', bg: '#fff7d6' });
  const lbZip = mkLabel('zzzip', '#ffffff', '#111', 130, 700), lbZip2 = mkLabel('zzzip', '#b6ff9a', '#111', 130, 700), lbClever = mkLabel('CLEVER!', '#ffe23a', '#111', 150, 900), lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111', 130, 1100);
  const bDots = [1, 2, 3].map((n) => mkBubble(['.'.repeat(n * 1)].map(() => '•'.repeat(n)), { size: 190, tail: -60, bg: '#fff7d6', fg: '#1f9a3a' }));
  const lbEcho = mkLabel('(…silence)', '#ffffff', '#111', 100, 900);
  const bWhY = mkBubble(['psst… I hid', 'the last cookie'], { size: 110, fg: '#666', bg: '#eef', dash: true, tail: 60 }), bWhP = mkBubble(['psst… he hid', 'the last cookie'], { size: 110, fg: '#1f6a30', bg: '#eef', dash: true, tail: 0 });
  const bPolly = mkBubble(['POLLY WANTS', 'A CRACKER!'], { size: 122, fg: '#1f9a3a', bg: '#fff7d6', tail: -100 }), bCard = mkBubble(['**** **** ****', '**** ****'], { size: 130, fg: '#111', bg: '#d6f2ff', tail: -60 }), lbCard = mkLabel('+ YOUR CARD #', '#ff5a4a', '#111', 90, 900);
  const bBoss = mkBubble(["YOU'RE", 'FIRED!'], { size: 150, fg: '#d8201a', bg: '#fff', tail: 80 }), bHire = mkBubble(['WELCOME', 'ABOARD!'], { size: 130, fg: '#1f6a30', bg: '#fff', tail: 80 });
  // boss call card
  const bossC = cvs(512, 512); const drawBoss = (lt, talk, mad) => { const g = bossC.g; g.fillStyle = '#1b2336'; g.fillRect(0, 0, 512, 512); g.fillStyle = '#9fb3d0'; g.fillRect(0, 0, 512, 40); txt(g, 'BOSS  ' + (talk ? 'on call' : 'calling…'), 256, 22, 28, '#10151c');
    g.fillStyle = '#e6c9a0'; g.beginPath(); g.roundRect(150, 130, 212, 230, 40); g.fill(); g.fillStyle = '#6a6a72'; g.fillRect(140, 112, 232, 56); g.fillStyle = '#10151c'; const ey = 220; g.fillRect(190, ey, 36, mad ? 14 : 30); g.fillRect(286, ey, 36, mad ? 14 : 30);
    g.save(); g.fillStyle = '#2a1a12'; g.translate(208, ey - 22); g.rotate(mad ? .38 : 0); g.fillRect(-30, -6, 60, 12); g.restore(); g.save(); g.translate(304, ey - 22); g.rotate(mad ? -.38 : 0); g.fillRect(-30, -6, 60, 12); g.restore();
    const mo = talk ? 20 + 16 * Math.abs(Math.sin(lt * 14)) : 6; g.fillStyle = '#5a1a1a'; g.fillRect(216, 300, 80, mo); g.fillStyle = '#2a4a8a'; g.fillRect(130, 400, 252, 112); g.fillStyle = '#d8201a'; g.fillRect(246, 372, 20, 130); bossC.t.needsUpdate = true; };
  const bossS = new THREE.Sprite(new THREE.SpriteMaterial({ map: bossC.t, transparent: true, depthWrite: false, depthTest: false })); bossS.renderOrder = 9; bossS.visible = false; S.add(bossS);

  // ================================================================== camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3();
  const rig = (lt, shots, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .45);
    E.set(lerp(s[1][0], s[2][0], u), lerp(s[1][1], s[2][1], u), lerp(s[1][2], s[2][2], u)); T2.set(lerp(s[3][0], s[4][0], u), lerp(s[3][1], s[4][1], u), lerp(s[3][2], s[4][2], u)); E.x += Math.sin(t * .9) * .02; E.y += Math.sin(t * 1.3 + 1) * .02 + Math.cos(t * 57) * shake; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .008); };
  const dk = (x, y, z) => [x, y, z];

  const ECH = [[3, 48], [48, 913], [913, 12400], [12400, 205000], [205000, 3100000], [3100000, 48000000]];
  const SHOUT = { arms: { lx: -2.6, lz: -.3, rx: -2.6, rz: .3 } };
  // ================================================================== frame
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    ROOM.visible = bi !== 3; WALL.visible = !globalThis.__dbgw; sprites.forEach((s) => { s.visible = false; }); zip.visible = false; cracker.visible = false; crumbs.forEach((c) => { c.visible = false; }); clip1.visible = clip2.visible = false; BOXG.visible = false; bossS.visible = false;
    let shock = false; let shake = 0;
    const YP = V3(-.8, 0, -2.45); // seat
    const youSit = (arms, sitPitch = 0, face = false) => { place(YOU, YP.x, SEAT_Y, YP.z + .03, 0, 'sit', .5); YOU.arms = arms; YOU.sitPitch = sitPitch; shock = face; };
    place(N1, 9, 0, 9, 0, 'idle'); place(N2, 9, 0, 9, 0, 'idle'); N1.vis = N2.vis = false;
    let pp = idleP(t, { yaw: -.45 }); let cam = null; let zipOn = false, zipK = 1; const upd = () => { crowd.setFace(shock ? 'shock' : 'calm'); crowd.update(t); }; const mouthOn = { v: 0 };
    // ---------------------------------------------------------- beat 0: repeating everything -> zip lips -> parrot zips too
    if (bi === 0) {
      const talk = (a, b) => (lt >= a && lt < b) ? Math.sin(t * 16) : 0; const youTalk = win(lt, .1, 1.0) || win(lt, 1.6, 2.3); const parTalk = win(lt, .7, 1.55) || win(lt, 2.1, 2.9);
      const zU = clamp((lt - 3.0) / .75); const zipped = lt > 3.75;
      let arms = { lx: -.7 + (youTalk ? Math.sin(t * 9) * .25 : 0), lz: -.1, rx: -.7 + (youTalk ? Math.sin(t * 9 + 2) * .25 : 0), rz: .1 };
      if (lt >= 2.7) { const up = smooth((lt - 2.7) / .35); const sweep = clamp((lt - 3.1) / .55); const down = smooth((lt - 4.2) / .3); const k = up * (1 - down); arms = { lx: -.7, lz: -.1, rx: lerp(-.7, -1.85, k), rz: lerp(.1, lerp(.62, .16, sweep), k) }; }
      youSit(arms, 0, lt > 2.35 && lt < 3.0 || (lt > 4.3));
      pp = idleP(t, { yaw: -.45, hr: Math.sin(t * 5) * .1 * (parTalk ? 1 : 0), beak: parTalk ? .45 + .35 * Math.abs(Math.sin(t * 16)) : 0, hp: parTalk ? .12 * Math.sin(t * 8) : 0, lx: -.6 });
      if (lt < .7) { pp.lx = -.7; pp.hr = .3 * smooth(lt / .5); } // cocks head, listening
      if (lt >= 3.7) { const k = smooth((lt - 3.7) / .3) * (1 - smooth((lt - 4.45) / .25)); pp.wl = [lerp(0, -2.55, k), lerp(.12, .5, k)]; pp.hp = .1 * k; pp.lid = .5 * k; pp.lx = -.4; pp.hr = .12 * k; }
      if (lt >= 3.1 && lt < 3.7) { pp.lid = .6; pp.hr = .2; pp.lx = -.7; }
      if (zU > 0) { zipK = lt < 3.75 ? Math.max(.12, clamp((lt - 3.1) / .55)) : 1; zipOn = lt > 3.1; }
      showS(bYou1, win(lt, .1, 1.1), V3(-.95, 1.95, -1.6).add(V3(0, 0, 0)), 1.05, (lt - .1) / .25); showS(bPar1, win(lt, .75, 1.7), V3(.6, 2.2, -.9), .92, (lt - .75) / .25);
      showS(bYou2, win(lt, 1.65, 2.5), V3(-.45, 1.9, -1.6), .92, (lt - 1.65) / .25); showS(bPar2, win(lt, 2.1, 3.05), V3(.6, 2.2, -.9), .92, (lt - 2.1) / .25);
      showS(lbZip, win(lt, 3.35, 4.1), V3(-.55, 1.95, -1.6), .9, (lt - 3.35) / .2); showS(lbZip2, win(lt, 3.85, 4.66), V3(.55, 2.3, -.9), .85, (lt - 3.85) / .2);
      cam = [[0, dk(.05, 1.55, 4.7), dk(.05, 1.5, 4.3), dk(.0, 1.3, -2), dk(.0, 1.3, -2), 50, 47]];
    }
    // ---------------------------------------------------------- beat 1: clever! -> parrot repeats the silence
    else if (bi === 1) {
      const smug = lt < 1.05; const stare = smooth((lt - 1.05) / .5);
      youSit(smug ? { lx: -.6, lz: -.1, rx: lerp(-.6, -2.5, smooth(lt / .3)), rz: .3 } : { lx: -.6, lz: -.1, rx: -.6, rz: .1 }, smug ? 0 : .08, !smug);
      pp = idleP(t, { yaw: lerp(-.4, -.75, stare), hr: lerp(0, .38, stare) + (lt > 1.4 ? Math.sin(t * 3) * .04 : 0), hp: .12 * stare, lid: .55 * stare, lx: -.8, ly: -.1 });
      if (lt > 1.35) { const m = (Math.sin(t * 7) > .1) ? 1 : 0; pp.beak = .35 + .4 * m; pp.hp += .06 * m; } // mouthing silence
      zipOn = true; zipK = 1;
      showS(lbClever, win(lt, .15, 1.15), V3(-.5, 2.0, -1.6), 1.0, (lt - .15) / .2);
      const n = lt < 1.5 ? 0 : lt < 2.0 ? 1 : lt < 2.5 ? 2 : 3; if (lt >= 1.5) showS(bDots[n - 1], true, V3(.55, 2.2, -.9), .7 + .08 * n, (lt - 1.5) / .25);
      showS(lbEcho, win(lt, 2.7, 4.0), V3(-.3, 2.75, -.9), .95, (lt - 2.7) / .25);
      cam = [[0, dk(.05, 1.55, 4.6), dk(.05, 1.5, 4.1), dk(.0, 1.3, -2), dk(.1, 1.3, -2), 50, 46]];
    }
    // ---------------------------------------------------------- beat 2: whisper -> parrot flies to fence, whispers to neighbors
    else if (bi === 2) {
      const lean = smooth((lt - .05) / .3) * (1 - smooth((lt - 1.0) / .3)); const thumbs = smooth((lt - 1.5) / .25);
      const FENCE = V3(1.6, .78 + .02, -4.2);
      const fly = clamp((lt - 2.1) / 1.1); const fe = smooth(fly); const inFlight = fly > 0 && fly < 1;
      if (lt < 2.1) { youSit(lt < 1.3 ? { lx: -.6, lz: -.1, rx: lerp(-.6, -2.1, lean), rz: lerp(.1, .5, lean) } : { lx: -.6, lz: -.1, rx: lerp(-2.1, -2.7, thumbs), rz: .3 }, .18 * lean, false); }
      else youSit({ lx: -.6, lz: -.1, rx: -.6, rz: .1 }, 0, lt > 3.2);
      // parrot path: perch -> window -> fence
      const A0 = PERCH, A1 = V3(1.6, 1.55, -2.9), A2 = FENCE;
      let px, py, pz; if (fly < .5) { const u = fly / .5; px = lerp(A0.x, A1.x, smooth(u)); pz = lerp(A0.z, A1.z, smooth(u)); py = lerp(A0.y, A1.y, smooth(u)) + Math.sin(u * Math.PI) * .45; } else { const u = (fly - .5) / .5; px = lerp(A1.x, A2.x, smooth(u)); pz = lerp(A1.z, A2.z, smooth(u)); py = lerp(A1.y, A2.y, smooth(u)) + Math.sin(u * Math.PI) * .3; }
      const flap = inFlight ? .9 + 1.0 * Math.sin(t * 34) : 0;
      if (fly <= 0) { pp = idleP(t, { yaw: lerp(-.45, -.75, smooth(lt / .4)), hr: lt < 1.4 ? .3 : 0, lid: .1, hp: lt > 1.4 && lt < 2.1 ? .12 * Math.sin(t * 6) : 0 }); if (lt > 1.5 && lt < 2.1) { pp.hp = .12 * Math.abs(Math.sin(t * 9)); } }
      else if (inFlight) { pp = { x: px, y: py, z: pz, yaw: lerp(-.4, 0, smooth(fly * 1.6)) + (fly < .5 ? lerp(-.4, 3.14 + .0, 0) * 0 : 0), lean: .25, wl: [0, flap], wr: [0, flap], tail: 0, lx: 0, bob: 0 }; pp.yaw = fly < .5 ? lerp(-.4, .0, smooth(fly / .5)) : 0; pp.x = px; pp.y = py; pp.z = pz; }
      else { const q = lt - 3.2; pp = idleP(t, { x: FENCE.x, y: FENCE.y, z: FENCE.z, yaw: 0, lean: .12, hr: Math.sin(t * 2.2) * .12, hy: Math.sin(t * 2.2 + 1.2) * .6, beak: win(lt, 3.45, 4.6) ? .25 + .2 * Math.abs(Math.sin(t * 11)) : 0, lid: .3, lx: Math.sin(t * 2.2 + 1.2) * .6, wl: [0, .12], wr: [0, .12] }); if (q < .2) pp.bob = .03 * Math.exp(-q * 12) * Math.sin(q * 60); }
      // neighbors pop up over the fence
      const nu = clamp((lt - 3.35) / .4); const ny = lerp(-.7, 0, eob(nu) > 1.15 ? 1.15 : eob(nu)); // rise from behind fence
      if (lt > 3.3) { N1.vis = N2.vis = true; place(N1, .85, ny, -4.7, -.5, 'idle', .5); place(N2, 2.35, ny, -4.7, .5, 'idle', .5); const lk = smooth((lt - 3.7) / .4); N1.pitch = .22 * lk; N2.pitch = .22 * lk; N1.arms = { lx: -.2, lz: -.1, rx: lerp(-.2, -2.2, lk), rz: lerp(.12, .85, lk) }; N2.arms = { lx: lerp(-.2, -2.2, lk), lz: -lerp(.12, .85, lk), rx: -.2, rz: .1 }; }
      shock = false;
      showS(bWhY, win(lt, .15, 1.45), V3(-1.0, 1.95, -2.1), .95, (lt - .15) / .25);
      showS(lbBetter, win(lt, 1.52, 2.5), V3(.35, 2.55, -1.2), 1.45, (lt - 1.52) / .22);
      showS(bWhP, win(lt, 3.55, 5.33), V3(2.0, 2.4, -3.4), 1.15, (lt - 3.55) / .25);
      cam = [[0, dk(.05, 1.55, 4.3), dk(.15, 1.55, 4.1), dk(.0, 1.3, -2), dk(.2, 1.3, -2), 50, 49], [2.1, dk(.45, 1.6, 3.6), dk(1.4, 1.75, 1.6), dk(.6, 1.4, -2.5), dk(1.6, 1.65, -4.4), 49, 48], [3.3, dk(1.5, 1.8, 1.4), dk(1.6, 1.8, .9), dk(1.6, 1.4, -4.4), dk(1.6, 1.4, -4.5), 52, 50]];
      ROOM.visible = true; N1.vis = N2.vis = lt > 3.3;
    }
    // ---------------------------------------------------------- beat 3: neighbors have notes
    else if (bi === 3) {
      N1.vis = N2.vis = true; place(N1, .55, 0, -4.9, .3, 'idle', .5); place(N2, 2.65, 0, -4.9, -.3, 'idle', .5); N1.pitch = .06; N2.pitch = .06;
      const wr1 = Math.sin(t * 14) * .18, wr2 = Math.sin(t * 12 + 1) * .18; const flip = smooth(lt - 2.1 > 0 ? (lt - 2.1) / .3 : 0) * (1 - smooth((lt - 2.5) / .3));
      N1.arms = { lx: -1.45, lz: .3, rx: -1.5 + wr1, rz: -.05 }; N2.arms = { lx: -1.45 + wr2, lz: .05, rx: -1.5, rz: -.3 }; N1.extra = 0; N2.extra = 0;
      shock = false; drawBoard(lt); ROOM.visible = false;
      pp = idleP(t, { x: BTOP.x + .5, y: BTOP.y, z: BTOP.z + .02, s: .8, yaw: 0, lean: .05, hr: Math.sin(t * 4) * .1, hy: Math.sin(t * 3) * .3, lx: Math.sin(t * 3) * .7, lid: .3, beak: (lt > .4 && lt < 3.2) ? .2 + .15 * Math.abs(Math.sin(t * 12)) : 0 });
      pp.tail = 0; cam = [[0, dk(1.6, 1.75, .2), dk(1.6, 1.75, -.6), dk(1.6, 1.7, -5.7), dk(1.6, 1.65, -5.7), 58, 54]];
    }
    // ---------------------------------------------------------- beat 4: cracker -> polly wants a cracker + card number
    else if (bi === 4) {
      const offer = smooth((lt - .15) / .4); const snap = lt > 1.45;
      const YX = -.75, YZ = -1.95; const yaw = Math.atan2(PERCH.x - YX, PERCH.z - YZ) + 0.0; const yawV = 1.1;
      place(YOU, YX, 0, YZ, yawV, 'idle', .5); const gasp = lt > 4.2;
      YOU.arms = gasp ? { lx: -2.5 + Math.sin(t * 20) * .05, lz: -1.0, rx: -2.5, rz: 1.0 } : { lx: lerp(-.3, -1.55, offer) * (snap ? .8 : 1) - (snap ? .1 : 0), lz: .1, rx: -.25, rz: -.1 }; YOU.pitch = gasp ? -.12 : .04; shock = gasp; if (gasp) YOU.extra = .015;
      const near = lt < 1.5; const peck = lt > 1.25 && lt < 1.5 ? smooth((lt - 1.25) / .25) : 0;
      pp = idleP(t, { yaw: -.55, lx: lt < 1.5 ? -.9 : 0, ly: lt < 1.3 ? .0 : 0, lid: lt < 1.3 ? 0 : .1, hr: lt < 1.3 ? .15 + Math.sin(t * 4) * .05 : 0 });
      if (lt > 1.0 && lt < 1.6) { pp.lean = .18 * peck; pp.hp = .2 * peck; pp.beak = lt < 1.25 ? .6 : .8 * (1 - peck); }
      if (lt >= 1.6 && lt < 2.1) { pp.beak = .3 * Math.abs(Math.sin(t * 22)); pp.hr = .1; pp.lid = .3; }
      const talk1 = win(lt, 2.2, 3.75), talk2 = win(lt, 4.2, 5.4);
      if (talk1) { pp.beak = .5 + .35 * Math.abs(Math.sin(t * 16)); pp.hp = .12 * Math.sin(t * 8); pp.lx = 0; pp.wl = [0, .12 + .5 * (Math.sin(t * 7) > 0 ? 1 : 0)]; }
      if (lt >= 3.9) { const k = smooth((lt - 3.9) / .4); pp.lid = .55 * k; pp.hr = .2 * k; pp.lx = -.8; pp.hp = .1 * k; pp.lean = .1 * k; pp.wr = [0, .12 + .6 * k]; if (talk2) { pp.beak = .4 + .3 * Math.abs(Math.sin(t * 14)); pp.hp = .12 * Math.sin(t * 8); } }
      // cracker
      upd(); const hL = hp(YOU, 'handL'); const fwd = V3(Math.sin(yawV), 0, Math.cos(yawV));
      if (lt < 1.5) { const cp = hL.clone().add(fwd.clone().multiplyScalar(.14)).add(V3(0, .02, 0)); const tip = beakTipW(); const k = smooth((lt - 1.1) / .35); cp.lerp(tip, k); cracker.position.copy(cp); cracker.rotation.set(.1, yawV, .3 * k); cracker.scale.setScalar(1.15 * (1 - .5 * k)); cracker.visible = true; if (lt > 1.4) cracker.visible = false; }
      if (lt > 1.4) { for (let i = 0; i < NC; i++) { const ts = 1.45 + i * .07 + (lt > 2.1 ? 0 : 0); const a = lt - ts; if (a < 0 || a > 1.3) continue; const th = cr(i, 1) * 6.28; const v = V3(Math.cos(th) * (.5 + cr(i, 2) * .6), 1.0 + cr(i, 3) * .8, Math.abs(Math.sin(th)) * .8 + .2); const c = crumbs[i]; c.visible = true; c.position.set(PERCH.x - .08 + v.x * a, PERCH.y + 1.0 + v.y * a - 4.9 * a * a, PERCH.z + .45 + v.z * a * .6); c.rotation.set(a * 9, a * 7, 0); c.scale.setScalar(.6 + cr(i, 4) * .6); } }
      showS(bPolly, talk1 || win(lt, 2.2, 4.1), V3(.62, 2.45, -1.0), 1.3, (lt - 2.2) / .25);
      showS(bCard, lt >= 4.15, V3(.45, 2.35, -1.0), 1.25, (lt - 4.15) / .25);
      cam = [[0, dk(0, 1.55, 4.9), dk(.05, 1.5, 4.3), dk(0, 1.3, -1.4), dk(.05, 1.3, -1.4), 50, 47]];
      if (talk2) shake = .003;
    }
    // ---------------------------------------------------------- beat 5: parrot on the phone -> you fired -> parrot hired
    else {
      const walkOut = clamp((lt - 4.0) / 1.8); const boxIn = lt > 3.0;
      pp = idleP(t, { yaw: -.35, hs: true, lid: .15, lx: -.4, hy: Math.sin(t * 1.4) * .1 });
      const bossOn = lt > .8;
      const bossTalk = win(lt, 2.4, 3.6) || win(lt, 4.1, 5.5); const parTalk = win(lt, .9, 2.3) || win(lt, 3.6, 4.1); const hired = lt > 4.05;
      if (parTalk) { pp.beak = .4 + .3 * Math.abs(Math.sin(t * 15)); pp.hp = .08 * Math.sin(t * 9); pp.wl = [0, .12]; }
      if (!bossTalk && lt > 3.6 && lt < 4.1) { pp.beak = .4; }
      if (lt > 2.4 && lt < 3.6) { pp.hr = .2 + .1 * Math.sin(t * 6); pp.lid = .4; pp.lx = .6; pp.wr = [0, .6 + .1 * Math.sin(t * 5)]; }   // smug mmhm
      if (hired) { const k = smooth((lt - 4.05) / .35); pp.lean = -.06 * k; pp.wl = [0, .12 + .4 * k]; pp.wr = [0, .12 + .4 * k]; pp.hp = -.1 * k; pp.lid = .5 * k; pp.tie = true; pp.tag = lt > 4.45; pp.hr = 0; }
      if (lt > 4.05) { const q = lt - 4.05; P.tie.scale.setScalar(1 + .6 * Math.exp(-q * 6) * Math.sin(q * 20)); } else P.tie.scale.setScalar(1);
      const wy = lt < 3.0 ? 0 : 0;
      youSit({ lx: -.7, lz: -.1, rx: -.7, rz: .1 }, 0, false); YOU.vis = false;
      const yx = lerp(-.6, -2.4, smooth(walkOut)); const walking = walkOut > 0 && walkOut < 1;
      place(YOU, boxIn ? yx : -.6, 0, -1.0, boxIn && walkOut > 0 ? -Math.PI / 2 : .5, walking ? 'walk' : 'idle', walking ? .8 : .5);
      YOU.arms = boxIn ? { lx: -1.3, lz: .15, rx: -1.3, rz: -.15 } : { lx: -.3, lz: -.05, rx: lt > 1.4 ? -2.5 + Math.sin(t * 5) * .2 : -.3, rz: .2 }; // pointing at the parrot, "hey!"
      if (!boxIn && lt > 1.4) { YOU.arms = { lx: -.3, lz: -.05, rx: -2.4, rz: .1 }; }
      shock = lt > .3; YOU.pitch = boxIn ? .22 : 0;
      if (lt > 2.4 && !boxIn) { YOU.arms = { lx: -2.5, lz: -1.0, rx: -2.5, rz: 1.0 }; YOU.pitch = -.1; }
      upd(); if (boxIn) { const hmid = hp(YOU, 'handL').add(hp(YOU, 'handR')).multiplyScalar(.5); BOXG.visible = true; BOXG.position.copy(hmid).add(V3(0, -.0, .0 + (walkOut > 0 ? 0 : .2))); BOXG.rotation.y = walkOut > 0 ? -Math.PI / 2 : 0; BOXG.position.y += .0; if (walkOut > 0) BOXG.position.add(V3(-.28, 0, 0)); else BOXG.position.add(V3(0, 0, .2)); const pop = eob((lt - 3.0) / .25); BOXG.scale.setScalar(Math.max(.01, pop)); }
      if (bossOn) { drawBoss(t, bossTalk, lt > 2.3 && !hired); bossS.visible = true; bossS.position.set(.95, 2.5, -1.0); const sk = bossTalk && lt < 3.6 ? Math.sin(t * 40) * .03 : 0; bossS.position.x += sk; bossS.scale.setScalar(.62 * Math.max(.01, eob((lt - .8) / .3))); }
      showS(bBoss, win(lt, 2.45, 3.7), V3(.5, 3.0, -1.0), 1.1, (lt - 2.45) / .2); showS(bHire, win(lt, 4.15, 5.7), V3(.5, 3.0, -1.0), 1.1, (lt - 4.15) / .2);
      cam = [[0, dk(.15, 1.95, 4.7), dk(.2, 1.9, 4.2), dk(.1, 1.7, -1.2), dk(.1, 1.7, -1.2), 48, 46], [4.0, dk(.25, 1.65, 4.3), dk(.3, 1.6, 3.7), dk(.2, 1.4, -1.2), dk(.2, 1.4, -1.2), 48, 44]];
    }
    // ---------------------------------------------------------- apply
    upd(); { const hh = hp(YOU, 'head'); zip.visible = zipOn; zip.position.set(hh.x - .15 * (1 - zipK), hh.y - .125, hh.z + .245); zip.scale.set(1.25 * zipK, 1.25, 1); }
    BOARD.visible = bi === 3;
    if (bi === 5 && lt > 0) { setP(Object.assign(pp, { x: PERCH.x, y: PERCH.y, z: PERCH.z })); } else setP(pp);
    // headset on the parrot (beat 5 only)
    if (bi === 5) P.hs.visible = true;
    // clipboards follow neighbor hands
    if (bi === 3) { const a = hp(N1, 'handR'), b = hp(N2, 'handL'); clip1.visible = clip2.visible = true; clip1.position.copy(a).add(V3(.05, .06, .16)); clip2.position.copy(b).add(V3(-.05, .06, .16)); clip1.rotation.set(-.15, .2, .0); clip2.rotation.set(-.15, -.2, .0); }
    // zipper uses head matrix in beat 0/1 handled above
    // ---------------------------------------------------------- camera
    rig(lt, cam, t, shake);
    A.follow(0, -1); A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    const [e0, e1] = ECH[bi]; const dur = tl.beats[bi].dur; const ev = lerp(e0, e1, smooth(lt / (dur * .8)));
    hud.counter('ECHOES', fmt(ev), '', '', bi >= 3); hud.tm(''); hud.pop('', 0);
  } };
}
