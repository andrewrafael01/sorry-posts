// 669 invention chain: friend spoils the show -> ask nicely -> points & gasps -> headphones (screams ending) -> tape (writes sign) -> blindfold (guesses it) -> show cancelled.
// One living room (couch + TV), object cutaways, climbing SPOILERS counter.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, clamp, smooth, lerp, attach, RoundedBoxGeometry } = lib;
  const A = makeStage({ fog: 0x14162a, fogNear: 30, fogFar: 90, clouds: false, skyTop: 0x14162a, skyMid: 0x1a1d36, skyBot: 0x23284a, shadowExtent: 9, shadowRes: 2048, hemi: 1.0, sunI: .5, sunColor: 0xbcc8ff, sunDir: [.3, 1, .6], exposure: 1.2 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const mk = (geo, m, parent, x = 0, y = 0, z = 0) => { const q = new THREE.Mesh(geo, m); q.position.set(x, y, z); q.castShadow = true; q.receiveShadow = true; parent.add(q); return q; };

  // ------------------------------------------------------------------ room
  const floorT = cvs(256, 256, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#8a5a38' : '#7c4f30'; g.fillRect(i * 32, 0, 32, 256); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(i * 32, 0, 2, 256); } }); floorT.t.wrapS = floorT.t.wrapT = THREE.RepeatWrapping; floorT.t.repeat.set(3, 3);
  { const fl = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshStandardMaterial({ map: floorT.t, roughness: .5 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, 0); fl.receiveShadow = true; S.add(fl); }
  const WALL = 0x5a4a7a;
  addBox(S, 0, 1.75, -3.65, 9, 3.5, .3, WALL); addBox(S, -4.35, 1.75, 0, .3, 3.5, 9, 0x4f406e); addBox(S, 4.35, 1.75, 0, .3, 3.5, 9, 0x4f406e); addBox(S, 0, 1.75, 4.4, 9, 3.5, .3, WALL);
  addBox(S, 0, .1, -3.48, 8.6, .2, .06, 0xe8e0f0, { cast: false });
  { const rg = cvs(256, 256, (g, w, h) => { g.fillStyle = '#c0453a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f2d38a'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28); g.strokeStyle = '#2b5a8a'; g.lineWidth = 6; g.strokeRect(38, 38, w - 76, h - 76); }); const rug = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3.6), new THREE.MeshStandardMaterial({ map: rg.t, roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.set(0, .012, -.8); rug.receiveShadow = true; S.add(rug); }
  // floor lamp, plant, pictures
  { const lp = new THREE.Group(); mk(new THREE.CylinderGeometry(.04, .04, 1.6, 8), mat(0x333333), lp, 0, .8, 0); mk(new THREE.CylinderGeometry(.18, .18, .04, 16), mat(0x333333), lp, 0, .02, 0); mk(new THREE.CylinderGeometry(.18, .3, .34, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe2a0, side: THREE.DoubleSide }), lp, 0, 1.7, 0); lp.position.set(3.2, 0, -1.4); S.add(lp); const l = new THREE.PointLight(0xffd9a0, 22, 0, 2); l.position.set(3.2, 1.7, -1.3); S.add(l); }
  { const pot = mk(new THREE.CylinderGeometry(.2, .15, .3, 12), mat(0xb8573a), S, -3.5, .15, 1.4); for (let i = 0; i < 5; i++) { const lf = mk(new THREE.IcosahedronGeometry(.22, 1), mat(0x3f9a45, { flatShading: true }), S, -3.5 + (cr(i, 1) - .5) * .3, .55 + i * .12, 1.4 + (cr(i, 2) - .5) * .3); lf.scale.y = 1.3; } }
  for (let i = 0; i < 3; i++) { const pc = cvs(64, 80, (g, w, h) => { g.fillStyle = ['#e8b84a', '#4aa8d8', '#d8584a'][i]; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.arc(32, 44, 18 + i * 3, 0, 7); g.fill(); }); addBox(S, -2.6 + i * 1.6, 2.5, -3.47, .56, .7, .04, 0xf0e8d4, { cast: false }); const pp = new THREE.Mesh(new THREE.PlaneGeometry(.46, .58), new THREE.MeshBasicMaterial({ map: pc.t })); pp.position.set(-2.6 + i * 1.6, 2.5, -3.44); S.add(pp); }
  // ------------------------------------------------------------------ TV + stand (back wall, screen faces +z)
  const TVY = 1.55, TVZ = -3.35; const tvG = new THREE.Group(); S.add(tvG);
  addBox(tvG, 0, .32, TVZ + .1, 3.2, .64, .8, 0x5a3a24, { round: .03 }); addBox(tvG, 0, TVY, TVZ, 2.7, 1.6, .16, 0x0c0c10, { round: .04 }); addBox(tvG, 0, 1.0, TVZ + .05, .3, .3, .12, 0x1a1a20);
  const tvT = cvs(512, 288); const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.4), new THREE.MeshBasicMaterial({ map: tvT.t, toneMapped: false })); scr.position.set(0, TVY, TVZ + .09); S.add(scr);
  const tvLight = new THREE.PointLight(0x7fa6ff, 30, 0, 2); tvLight.position.set(0, 1.5, TVZ + 1.2); S.add(tvLight);
  const drawTV = (mode, t, sub, flash = 0) => { const g = tvT.g, W = 512, H = 288;
    if (mode === 'static') { g.fillStyle = '#777'; g.fillRect(0, 0, W, H); const fr = Math.floor(t * 20); for (let i = 0; i < 700; i++) { const v = Math.floor(cr(i, fr) * 255); g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(cr(i, fr + 3) * W, cr(i, fr + 7) * H, 24 + cr(i, 2) * 40, 6 + cr(i, 4) * 10); } }
    else { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0b1230'); gr.addColorStop(1, '#2a3a6a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.fillStyle = '#e8ecc8'; g.beginPath(); g.arc(400, 70, 34, 0, 7); g.fill(); // moon
      g.fillStyle = 'rgba(255,255,255,.12)'; for (let i = 0; i < 6; i++) g.fillRect(60 + i * 30, 0, 14, H); // blinds light
      g.fillStyle = '#0a0a12'; g.fillRect(0, 232, W, 56); g.fillRect(300, 150, 22, 90); // street lamp
      g.fillStyle = '#ffd98a'; g.fillRect(296, 144, 30, 12);
      const sx = 190 + Math.sin(t * .5) * 3; // detective silhouette
      g.fillStyle = '#05050a'; g.beginPath(); g.moveTo(sx - 38, 240); g.lineTo(sx - 26, 120); g.lineTo(sx + 26, 120); g.lineTo(sx + 38, 240); g.closePath(); g.fill(); g.beginPath(); g.arc(sx, 100, 20, 0, 7); g.fill(); g.fillRect(sx - 36, 82, 72, 8); g.fillRect(sx - 20, 62, 40, 24);
      g.fillStyle = '#ff9a3a'; g.fillRect(sx + 20, 104, 10, 3); // cigarette glow
      txt(g, 'THE BLACK CASE', 150, 36, 22, 'rgba(255,255,255,.7)', { w: 700 });
      g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, W, 8); g.fillRect(0, H - 8, W, 8); }
    if (sub) { g.fillStyle = 'rgba(0,0,0,.75)'; g.fillRect(40, 236, W - 80, 44); txt(g, sub, W / 2, 259, sub.length > 26 ? 24 : 30, sub[0] === '[' ? '#ffe23a' : '#fff', { w: 800 }); }
    if (flash > 0) { g.fillStyle = `rgba(255,255,255,${flash})`; g.fillRect(0, 0, W, H); }
    tvT.t.needsUpdate = true; };
  const banner = new THREE.Sprite(new THREE.SpriteMaterial({ map: cvs(1024, 256, (g) => { g.fillStyle = '#d8201a'; g.fillRect(0, 20, 1024, 216); g.strokeStyle = '#fff'; g.lineWidth = 10; g.strokeRect(10, 30, 1004, 196); txt(g, 'CANCELLED', 512, 132, 170, '#fff', { stroke: '#5a0a08', sw: 12 }); }).t, transparent: true, depthTest: false })); banner.renderOrder = 11; banner.visible = false; S.add(banner);
  // ------------------------------------------------------------------ couch (people face -z toward TV; camera on TV side sees faces)
  const CZ = .3; const couch = new THREE.Group(); S.add(couch);
  { const cm = mat(0x3f6fa8, { roughness: .9 }), cd = mat(0x335b8c, { roughness: .9 }); mk(new RoundedBoxGeometry(2.8, .4, 1.0, 3, .08), cm, couch, 0, .26, CZ + .05); mk(new RoundedBoxGeometry(2.8, .8, .28, 3, .1), cd, couch, 0, .7, CZ + .68); for (const s of [-1, 1]) mk(new RoundedBoxGeometry(.28, .62, 1.0, 3, .1), cd, couch, s * 1.4, .42, CZ + .05); for (const s of [-1, 1]) mk(new RoundedBoxGeometry(1.2, .14, .9, 3, .06), cm, couch, s * .64, .5, CZ + .02);
    const pw = mk(new RoundedBoxGeometry(.4, .36, .12, 3, .05), mat(0xe8b84a), couch, -1.0, .75, CZ + .5); pw.rotation.z = .3; }
  addBox(S, 0, .22, -1.55, 1.4, .08, .7, 0x6a4a30, { round: .02 }); for (const sx of [-.6, .6]) for (const sz of [-1.3, -1.8]) addBox(S, sx, .1, sz, .08, .2, .08, 0x4a3220, { cast: false });
  // ------------------------------------------------------------------ props
  const bowl = new THREE.Group(); { mk(new THREE.CylinderGeometry(.2, .14, .16, 16), mat(0xd8342a), bowl, 0, 0, 0); const rim = mk(new THREE.TorusGeometry(.2, .02, 6, 16), mat(0xffffff), bowl, 0, .08, 0); rim.rotation.x = Math.PI / 2; for (let i = 0; i < 9; i++) mk(new THREE.IcosahedronGeometry(.055, 0), mat(0xfff2c0), bowl, (cr(i, 1) - .5) * .26, .1 + cr(i, 2) * .05, (cr(i, 3) - .5) * .26); S.add(bowl); }
  const kern = []; for (let i = 0; i < 24; i++) { const k = new THREE.Mesh(new THREE.IcosahedronGeometry(.035 + cr(i, 5) * .015, 0), mat(0xfff2c0)); k.castShadow = true; k.visible = false; S.add(k); kern.push(k); }
  const phones = new THREE.Group(); { const pm = mat(0x1d1f26, { roughness: .4 }), pr = mat(0xff3a6a, { roughness: .4 }); const band = mk(new THREE.TorusGeometry(.3, .035, 8, 24, Math.PI), pm, phones, 0, 0, 0); band.scale.set(1, 1.05, 1); for (const s of [-1, 1]) { const cup = mk(new THREE.CylinderGeometry(.14, .14, .1, 18), pm, phones, s * .3, 0, 0); cup.rotation.z = Math.PI / 2; const cap = mk(new THREE.CylinderGeometry(.1, .1, .04, 18), pr, phones, s * .36, 0, 0); cap.rotation.z = Math.PI / 2; } phones.visible = false; S.add(phones); }
  const tape = new THREE.Group(); { const tm = new THREE.MeshStandardMaterial({ color: 0xb8b8b0, roughness: .35 }); const td = new THREE.MeshStandardMaterial({ color: 0x55554e, roughness: .4 }); mk(new THREE.BoxGeometry(.32, .075, .012), tm, tape, 0, 0, 0); const a = mk(new THREE.BoxGeometry(.2, .035, .012), td, tape, 0, 0, .012); const b = mk(new THREE.BoxGeometry(.2, .035, .012), td, tape, 0, 0, .012); a.rotation.z = .6; b.rotation.z = -.6; tape.visible = false; S.add(tape); }
  const blind = new THREE.Group(); { mk(new THREE.BoxGeometry(.5, .11, .5), mat(0x111114, { roughness: .8 }), blind, 0, 0, 0); mk(new THREE.BoxGeometry(.36, .05, .02), mat(0x111114), blind, .12, -.02, -.27).rotation.z = .4; blind.visible = false; S.add(blind); }
  const signT = cvs(512, 340, (g, w, h) => { g.fillStyle = '#f6efd8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d8342a'; g.lineWidth = 14; g.strokeRect(10, 10, w - 20, h - 20); g.strokeStyle = '#222'; g.lineWidth = 7; g.lineCap = 'round'; txt(g, 'IT WAS', w / 2, 118, 130, '#161616', { w: 900 }); txt(g, 'HIM', w / 2, 242, 150, '#d8342a', { w: 900 }); g.beginPath(); g.moveTo(90, 322); g.bezierCurveTo(200, 296, 300, 330, 420, 300); g.stroke(); });
  const sign = new THREE.Group(); { mk(new THREE.BoxGeometry(1.0, .66, .04), mat(0xf6efd8), sign); const sp = new THREE.Mesh(new THREE.PlaneGeometry(.96, .62), new THREE.MeshBasicMaterial({ map: signT.t })); sp.position.z = .025; sign.add(sp); sign.visible = false; S.add(sign); }
  const weed = new THREE.Group(); { const wm = new THREE.MeshStandardMaterial({ color: 0x9a7a3a, roughness: 1 }); for (let i = 0; i < 7; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.22 + (i % 3) * .02, .012, 4, 14), wm); r.rotation.set(cr(i, 1) * 3, cr(i, 2) * 3, cr(i, 3) * 3); r.castShadow = true; weed.add(r); } weed.visible = false; S.add(weed); }
  // ------------------------------------------------------------------ people
  const crowd = new Crowd(S, 2, 77); const P = crowd.p; const ME = P[0], FR = P[1];
  const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  col(0, ['torso', 'armL', 'armR'], 0x3a9a6a); col(0, ['legL', 'legR'], 0x2b3347); col(0, ['hair'], 0x4a2f1c); col(1, ['torso', 'armL', 'armR'], 0xf0902a); col(1, ['legL', 'legR'], 0x3f3f5a); col(1, ['hair'], 0x16110c);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  ME.h = 1; FR.h = 1.04;
  const SEAT = -.3;
  const sit = (o, x, yaw, pitch = 0) => { o.x = x; o.y = SEAT; o.z = CZ; o.yaw = yaw; o.anim = 'sit'; o.speed = .5; o.extra = 0; o.vis = true; o.scale = 1; o.pitch = 0; o.sitPitch = pitch; o.lie = 0; o.arms = { lx: -.5, lz: .1, rx: -.5, rz: -.1 }; };
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const MX = -.55, FX = .55;
  // ------------------------------------------------------------------ labels
  const mkLabel = (text, c1, c2, w = 640, size) => { const l = cvs(w, 160, (g, ww) => { txt(g, text, ww / 2, 84, size || (text.length > 9 ? 84 : 112), c1, { stroke: c2, sw: 20 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const mkBubble = (lines, fg = '#111', bg = '#fff', size = 120, tail = 0) => { const n = lines.length, H = 100 + n * size * 1.05; const l = cvs(1024, H + 90, (g, w) => { g.fillStyle = bg; g.strokeStyle = '#111'; g.lineWidth = 14; g.beginPath(); g.roundRect(14, 14, w - 28, H - 14, 70); g.fill(); g.stroke(); g.beginPath(); const tx = w / 2 + tail; g.moveTo(tx - 50, H - 20); g.lineTo(tx + 10, H + 76); g.lineTo(tx + 60, H - 20); g.closePath(); g.fill(); g.stroke(); g.fillStyle = bg; g.fillRect(tx - 44, H - 28, 100, 16); lines.forEach((s, i) => txt(g, s, w / 2, 70 + size * .62 + i * size * 1.05, size, fg, { w: 900 })); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.userData.ar = (H + 90) / 1024; s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const lbClever = mkLabel('CLEVER!', '#ffe23a', '#111'), lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111', 760, 92), lbCorrect = mkLabel('CORRECT!', '#5dff7a', '#0a3a14', 760, 120);
  const bbPlease = mkBubble(['PLEASE', 'STOP'], '#111', '#fff', 150), bbPsst = mkBubble(['psst… HE', 'DID IT…'], '#333', '#e6e6f0', 110), bbOhNo = mkBubble(['OH NO!!'], '#d8201a', '#fff', 190), bbButler = mkBubble(['IT WAS', 'THE BUTLER!'], '#d8201a', '#fff', 170), bbGuess = mkBubble(['IT’S THE', 'BUTLER!'], '#111', '#fff', 165);
  const chk = new THREE.Sprite(new THREE.SpriteMaterial({ map: cvs(256, 256, (g) => { g.fillStyle = '#2fd45a'; g.beginPath(); g.arc(128, 128, 118, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 30; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(66, 134); g.lineTo(112, 180); g.lineTo(194, 84); g.stroke(); }).t, transparent: true, depthTest: false })); chk.renderOrder = 10; chk.visible = false; S.add(chk);
  const lab = (s, on, pos, w = 1.15, k = 1, ar) => { s.visible = on; if (on) { s.position.copy(pos); const a = clamp(k); const r = ar || s.userData.ar || .25; s.scale.set(w * a, w * r * a, 1); } };
  const ALL = [lbClever, lbBetter, lbCorrect, bbPlease, bbPsst, bbOhNo, bbButler, bbGuess, chk, banner];
  // ------------------------------------------------------------------ camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3();
  const rig = (lt, shots, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = s[1], e1 = s[2], g0 = s[3], g1 = s[4];
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .012 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .01 + Math.cos(t * 57) * shake; if (E.z < -.9) E.z -= .8; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .005); };
  const dk = (x, y, z) => [x, y, z];
  // shot library. FACE = camera on the TV side looking at faces; WIDE = high behind the couch, TV in frame.
  const WIDE = (a = 0) => [dk(2.3 + a, 2.3, 3.4), dk(2.0 + a, 2.25, 3.2), dk(0, 1.25, -2.0), dk(0, 1.3, -2.0), 54, 52];
  const faceBoth = (z0 = -2.4) => [dk(0, 1.5, z0), dk(0, 1.5, z0 + .15), dk(0, 1.4, .3), dk(0, 1.4, .3), 50, 46];
  const faceOne = (x, z0 = -2.6, fov = 40) => [dk(x + .05, 1.5, z0), dk(x, 1.5, z0 + .15), dk(x, 1.5, .3), dk(x, 1.5, .3), fov, fov - 3];
  const BOTH = [dk(0, 1.6, -2.3), dk(0, 1.6, -2.15), dk(0, 1.4, .3), dk(0, 1.4, .3), 56, 53];
  const ONE = (x, f = 44) => [dk(x * .7, 1.65, -2.3), dk(x * .7, 1.65, -2.15), dk(x, 1.5, .3), dk(x, 1.5, .3), f, f - 3];
  const handsOn = (o, ax = -.5) => { o.arms = { lx: ax, lz: .1, rx: ax, rz: -.1 }; };

  // ------------------------------------------------------------------ frame
  const pass = ({ t, bi, lt, p }, final) => {
    bi = Math.min(bi, 5);
    let count = 0, note = '', face = 'calm', shake = 0, sub = '', tvMode = 'show', flash = 0, glow = 1;
    ALL.forEach((x) => { x.visible = false; }); phones.visible = false; tape.visible = false; blind.visible = false; sign.visible = false; weed.visible = false; kern.forEach((k) => { k.visible = false; });
    sit(ME, MX, Math.PI); sit(FR, FX, Math.PI);
    bowl.position.set(FX, .7, CZ - .38); bowl.rotation.set(0, 0, 0);
    const hME = () => hp(ME, 'head'), hFR = () => hp(FR, 'head');
    const popcorn = (t0, dur = 1.1) => { const l = lt - t0; kern.forEach((k, i) => { if (l < 0 || l > dur + cr(i, 9) * .5) return; const vx = (cr(i, 1) - .5) * 2.4, vy = 2.4 + cr(i, 2) * 2.2, vz = (cr(i, 3) - .55) * 2.0; k.visible = true; k.position.set(FX + vx * l * .55, .85 + vy * l - 4.9 * l * l, CZ - .35 + vz * l * .55); k.rotation.set(l * 6 + i, l * 5, i); }); };
    // =============================================================== beat 0: he whispers + points, you ask him to stop
    if (bi === 0) {
      count = lt < .55 ? 0 : lt < 1.2 ? 1 : lt < 1.9 ? 2 : 3; note = 'friend: whispering';
      sub = lt < 2.6 ? 'He is the one who…' : 'The killer is—';
      // friend leans toward you whispering, pointing at TV; you lean away irritated
      const lean = smooth(lt / .5); FR.yaw = Math.PI + .5 * lean; FR.sitPitch = .12 * lean; FR.arms = { lx: -.5, lz: .1, rx: -1.55 - Math.sin(lt * 9) * .12, rz: -.15 }; // right arm points
      if (lt < 2.2) { ME.yaw = Math.PI - .2; face = 'calm'; ME.arms = { lx: -.5, lz: .1, rx: -.5, rz: -.1 }; }
      else { // you turn, palm out: ask him to stop
        const q = smooth((lt - 2.1) / .35); ME.yaw = lerp(Math.PI - .2, Math.PI - .9, q); ME.arms = { lx: -.5, lz: .1, rx: lerp(-.5, -1.6, q) + Math.sin(lt * 12) * .06 * q, rz: -.1 }; FR.arms = { lx: -.5, lz: .1, rx: lerp(-1.55, -.9, smooth((lt - 2.9) / .4)), rz: -.15 }; FR.yaw = Math.PI + lerp(.5, .3, smooth((lt - 2.9) / .4)); face = lt > 2.9 ? 'calm' : 'calm'; }
      const mh = hME(), fh = hFR();
      lab(bbPsst, lt > .35 && lt < 2.0, V3(fh.x + .1, fh.y + .78, fh.z - .05), 1.7, Math.min(1, (lt - .35) * 6));
      lab(bbPlease, lt > 2.3, V3(mh.x - .05, mh.y + .95, mh.z - .1), 1.0, Math.min(1, (lt - 2.3) * 7));
      rig(lt, [[0, ...WIDE()], [2.1, ...BOTH]], t);
    }
    // =============================================================== beat 1: clever (silent) -> point + gasp + popcorn
    else if (bi === 1) {
      count = 3 + (lt < 3.5 ? (lt > 2.2 ? 1 : 0) : Math.min(4, Math.floor((lt - 3.5) * 6) + 1)); note = lt < 3.5 ? 'friend: "silent"' : 'friend: GASPING';
      sub = lt < 2.8 ? '[ tense music ]' : 'NO ONE MOVE.';
      const fh = hFR(), mh = hME();
      if (lt < 1.05) { ME.arms = { lx: -.5, lz: .1, rx: -2.0, rz: -.1 }; ME.yaw = Math.PI - .4; FR.arms = { lx: -.5, lz: .1, rx: -.5, rz: -.1 }; lab(lbClever, true, V3(mh.x + .1, mh.y + .85, mh.z), 1.25, Math.min(1.1, lt * 8)); }
      const pt = smooth((lt - 1.2) / .5); FR.yaw = Math.PI + .12; if (lt >= 1.2) { FR.arms = { lx: -.5, lz: .1, rx: lerp(-.5, -1.55, pt) - (lt > 2.2 ? Math.sin(lt * 14) * .1 : 0), rz: -.15 }; FR.sitPitch = .1 * pt; }
      if (lt >= 2.0 && lt < 3.5) FR.arms = { lx: -1.2, lz: .15, rx: -1.55 - Math.sin(lt * 14) * .1, rz: -.15 }; // both point-ish
      if (lt >= 3.5) { face = 'shock'; FR.arms = { lx: -2.7, lz: .3, rx: -1.7, rz: -.15 }; FR.sitPitch = -.15; FR.extra = .12 * Math.max(0, 1 - (lt - 3.5) / .6); ME.arms = { lx: -.5, lz: .1, rx: -2.4, rz: -.4 }; ME.yaw = Math.PI - .5; lab(bbOhNo, true, V3(fh.x + .05, fh.y + .85, fh.z - .1), 1.0, Math.min(1.1, (lt - 3.5) * 7)); popcorn(3.5, 1.2); bowl.position.y = .7 + Math.max(0, .12 - (lt - 3.5) * .3); bowl.rotation.x = -.5 * Math.min(1, (lt - 3.5) * 4); }
      if (lt >= 3.4 && lt < 3.6) flash = .0;
      rig(lt, [[0, ...BOTH], [1.1, ...ONE(FX)], [3.4, ...ONE(FX, 40)]], t, lt >= 3.5 && lt < 3.8 ? .006 : 0);
    }
    // =============================================================== beat 2: headphones on -> screams ending
    else if (bi === 2) {
      count = 7 + (lt < 3.4 ? 0 : Math.min(5, Math.floor((lt - 3.4) * 2.6) + 1)); note = lt < 3.4 ? 'headphones: ON' : 'friend: screaming ending';
      const fh = hFR(), mh = hME();
      const dropK = clamp((lt - .5) / .45); const dropE = 1 - smooth(dropK);
      sub = lt < 3.4 ? 'The detective turns around…' : '[ someone shouting the ending ]';
      // you turn to friend and press the headphones on
      const turn = smooth((lt - .15) / .3) * (1 - smooth((lt - 1.5) / .4)); ME.yaw = Math.PI - .85 * turn; ME.arms = { lx: -.5, lz: .1, rx: lerp(-.5, -2.0, turn), rz: -.1 };
      FR.yaw = Math.PI + .2; phones.visible = lt > .12;
      let ph = V3(fh.x, fh.y + .12 + dropE * .9, fh.z); const wob = lt > 1.4 ? 0 : 0; phones.position.copy(ph); phones.rotation.set(0, 0, 0); phones.scale.setScalar(1);
      if (lt > 3.4) { face = 'shock'; FR.extra = .1; FR.sitPitch = -.12; FR.arms = { lx: -2.3, lz: .35, rx: -2.3, rz: -.35 }; ME.arms = { lx: -2.1, lz: -.65, rx: -2.1, rz: .65 }; ME.yaw = Math.PI - .15; ME.sitPitch = .12; }
      else if (lt > 2.1) { ME.arms = { lx: -.5, lz: .1, rx: -1.0, rz: -.1 }; if (lt > 2.2) { ME.arms.rx = -2.4; ME.arms.rz = -.15; } ME.yaw = Math.PI - .3; FR.arms = { lx: -.5, lz: .1, rx: -.5, rz: -.1 }; face = 'calm'; FR.sitPitch = .02; }
      // headphones snap on (use head matrix offsets)
      if (lt > .12) { attach(phones, FR, 'head', [0, .0 + dropE * .9 / 1.04, 0], [0, 0, 0]); phones.visible = true; phones.scale.setScalar(.95); }
      lab(lbBetter, lt > 2.2 && lt < 3.35, V3(fh.x - .05, fh.y + .95, fh.z), 1.35, Math.min(1.1, (lt - 2.2) * 6));
      lab(bbButler, lt > 3.5, V3(fh.x + .02, fh.y + 1.0 + Math.sin(lt * 30) * .012, fh.z), 1.05 + Math.sin(lt * 26) * .02, Math.min(1.1, (lt - 3.5) * 7));
      const subOn = lt > 3.4;
      rig(lt, [[0, ...BOTH], [1.5, ...ONE(FX)], [3.4, ...ONE(FX, 46)], [4.9, ...WIDE(-.3)]], t, lt > 3.5 ? .005 : 0);
      if (lt > 4.9) sub = '[ someone shouting the ending ]';
    }
    // =============================================================== beat 3: tape -> writes sign
    else if (bi === 3) {
      count = 12 + (lt < 2.3 ? 0 : Math.min(3, Math.floor((lt - 2.3) * 4) + 1)); note = lt < 2.0 ? 'mouth: TAPED' : 'ending: written';
      const fh = hFR(), mh = hME(); sub = lt < 2.0 ? 'The detective lights a cigarette.' : 'He knew all along.';
      // headphones off (on lap) from earlier: not shown
      const tp = smooth((lt - .3) / .2); const turn = smooth((lt - .1) / .2) * (1 - smooth((lt - 1.0) / .3)); ME.yaw = Math.PI - .85 * turn; ME.arms = { lx: -.5, lz: .1, rx: lerp(-.5, -2.0, turn), rz: -.1 };
      FR.yaw = Math.PI + .1;
      if (lt > .55) { tape.visible = true; attach(tape, FR, 'head', [0, -.115, .245], [0, 0, 0]); tape.visible = true; const k = Math.min(1.15, (lt - .55) * 9); tape.scale.setScalar(Math.max(.01, k > 1 ? 1 + (1.15 - k) * .6 : k)); if (lt < .85) { tape.position.z += 0; } }
      face = 'shock';
      if (lt < 1.9) { FR.arms = { lx: -.5, lz: .1, rx: lt > .6 ? -2.3 : -.5, rz: -.15 }; FR.sitPitch = .02; FR.extra = lt > .6 && lt < 1.4 ? .07 : 0; if (lt > .6) { FR.arms.rx = -1.9 + Math.sin(lt * 12) * .1; } }
      if (lt > 1.9 && lt < 2.0) { /* hold */ }
      const sg = smooth((lt - 1.95) / .35); // sign rises from lap
      if (lt >= 1.9) { sign.visible = true; attach(sign, FR, 'torso', [0, lerp(-.5, .22, sg), lerp(.1, .55, sg)], [lerp(-.3, 0, sg), 0, Math.sin(lt * 7) * .03 * sg]); sign.visible = true; sign.scale.setScalar(1.0); FR.arms = { lx: lerp(-.5, -1.35, sg), lz: .15, rx: lerp(-.5, -1.35, sg), rz: -.15 }; FR.sitPitch = .05; FR.extra = 0; lab(bbPlease, false, V3()); }
      ME.arms = lt > 1.3 ? { lx: -.5, lz: .1, rx: -.5, rz: -.1 } : ME.arms; if (lt > 2.4) { ME.arms = { lx: -.5, lz: .1, rx: -1.0, rz: -.1 }; ME.yaw = Math.PI - .25; face = 'shock'; }
      rig(lt, [[0, ...BOTH], [.5, ...ONE(FX)], [1.9, ...ONE(FX, 46)]], t);
    }
    // =============================================================== beat 4: blindfold -> guesses out loud, CORRECT
    else if (bi === 4) {
      count = 15 + (lt < 3.3 ? 0 : 1); note = lt < 3.1 ? 'eyes: COVERED' : lt < 4.2 ? 'friend: guessing' : 'guess: correct';
      const fh = hFR(), mh = hME(); sub = lt < 3.2 ? '[ tense music ]' : lt < 4.2 ? 'the butler did it.' : 'THE BUTLER DID IT.';
      const turn = smooth((lt - .05) / .25) * (1 - smooth((lt - .9) / .3)); ME.yaw = Math.PI - .85 * turn; ME.arms = { lx: -.5, lz: .1, rx: lerp(-.5, -2.0, turn), rz: -.1 };
      FR.yaw = Math.PI + .1; FR.arms = { lx: -.5, lz: .1, rx: -.5, rz: -.1 }; face = 'shock';
      if (lt > .45) { blind.visible = true; attach(blind, FR, 'head', [0, -.005, 0], [0, 0, 0]); blind.visible = true; const k = Math.min(1, (lt - .45) * 8); blind.scale.set(1 + (1 - k) * .4, 1, 1 + (1 - k) * .4); }
      if (lt > 1.6 && lt < 3.0) { FR.arms = { lx: -.5, lz: .1, rx: -1.0 + Math.sin(lt * 5) * .5, rz: -.5 + Math.sin(lt * 5 + 1) * .15 }; FR.sitPitch = Math.sin(lt * 4) * .06; FR.yaw = Math.PI + Math.sin(lt * 3) * .25; } // feeling around, thinking
      if (lt >= 3.05) { FR.arms = { lx: -2.5, lz: .4, rx: -2.5, rz: -.4 }; FR.sitPitch = -.16; FR.extra = .1 * Math.max(0, 1 - (lt - 3.05) / .9); FR.yaw = Math.PI; ME.arms = { lx: -.5, lz: .1, rx: -1.5, rz: -.2 }; }
      lab(bbGuess, lt > 3.1 && lt < 4.5, V3(fh.x + .02, fh.y + 1.0 + Math.sin(lt * 30) * .01, fh.z), 1.05, Math.min(1.1, (lt - 3.1) * 7));
      if (lt > 4.25) { const k = clamp((lt - 4.25) / .22); const ov = 1 + .25 * Math.sin(k * Math.PI); lab(chk, true, V3(fh.x - .5, fh.y + .2, fh.z + .1), .6 * ov, k, 1); lab(lbCorrect, true, V3(fh.x - .02, fh.y + .95, fh.z), 1.0, Math.min(1.1, (lt - 4.3) * 6)); face = 'shock'; }
      if (lt > 4.25) { ME.arms = { lx: -2.3, lz: .1, rx: -2.3, rz: -.1 }; ME.sitPitch = .1; }
      rig(lt, [[0, ...BOTH], [.45, ...ONE(FX)], [1.6, ...BOTH], [3.0, ...ONE(FX, 44)], [4.2, ...ONE(FX, 50)]], t, lt > 3.05 && lt < 3.4 ? .006 : 0);
    }
    // =============================================================== beat 5: cancelled
    else {
      count = 16; note = 'show: cancelled'; tvMode = lt < .25 ? 'show' : 'static'; sub = lt < .25 ? 'Next week: the s—' : '';
      glow = .6; face = 'calm';
      const sl = smooth((lt - .7) / .8); ME.sitPitch = .5 * sl; FR.sitPitch = .55 * sl; ME.yaw = Math.PI + .1 * sl; FR.yaw = Math.PI - .1 * sl; ME.arms = { lx: lerp(-.5, -.1, sl), lz: .1, rx: lerp(-.5, -.1, sl), rz: -.1 }; FR.arms = { lx: lerp(-.5, -.15, sl), lz: .1, rx: lerp(-.5, -.1, sl), rz: -.1 };
      if (lt > .25) { const k = clamp((lt - .25) / .18); banner.visible = true; banner.position.set(0, TVY + .05, TVZ + .25); const w = 2.3 * (1 + .25 * (1 - k)); banner.scale.set(w * k + .001, w * .25 * k + .001, 1); }
      const wx = lerp(2.2, -2.2, clamp((lt - 2.3) / 2.1)); weed.visible = lt > .5; weed.scale.setScalar(1.3); weed.position.set(wx * .8, .4 + Math.abs(Math.sin(lt * 4)) * .25, -1.2); weed.rotation.set(lt * 3, lt * 5, lt * 4);
      rig(lt, [[0, dk(.6, 2.7, 3.8), dk(.4, 2.6, 3.5), dk(0, 1.25, -2.2), dk(0, 1.25, -2.2), 54, 50], [1.5, ...ONE(0, 52)], [2.5, dk(0, 1.05, -2.3), dk(0, 1.05, -2.15), dk(0, .85, .3), dk(0, .85, .3), 58, 55]], t);
    }
    // =============================================================== common updates
    crowd.setFace(face); crowd.update(t);
    // headphones/tape/blind/sign/phones use freshly computed head matrices (crowd.update first), so re-place attachments now
    drawTV(tvMode, t, sub, flash);
    tvLight.intensity = (tvMode === 'static' ? 34 : 26 + Math.sin(t * 7) * 3) * glow; tvLight.color.set(tvMode === 'static' ? 0xdfe6ff : 0x7fa6ff);
    if (!final) return;
    A.follow(0, 0); A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    hud.counter('SPOILERS', String(Math.round(count)), note, '', bi >= 1);
    hud.tm(''); hud.pop('', 0);
  };
  return { frame(a) { pass(a, false); pass(a, true); } };
}
