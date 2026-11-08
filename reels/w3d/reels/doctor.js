import { room } from './_rooms.js';
import { drakeLook, makeBubble } from './_drake.js';
// What if Drake became your doctor? Parody caricature (generic blocky cues, no likeness). Thermometer + hug, rhyme prescription, candle support group, clinic of fine people, bill = 1 hug.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, Particles, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0xe8f0f2, fogNear: 18, fogFar: 55, clouds: false, skyTop: 0xe8f0f2, skyMid: 0xe8f0f2, skyBot: 0xe8f0f2, shadowExtent: 12, hemi: 1.6, sunI: 1.7, sunDir: [-.3, .9, -.4], exposure: 1.1 }); const S = A.scene;
  room(lib, S, { wall: 0xcfe6e4, floor: 0xe6e9ec, w: 12, d: 13 });
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const plane = (w, h, tex, dbl = true) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, side: dbl ? THREE.DoubleSide : THREE.FrontSide, transparent: true })); S.add(m); return m; };
  const FONT = 'Liberation Sans, Arial';
  const heart = (g, x, y, s, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(x, y + s * .35); g.bezierCurveTo(x - s, y - s * .2, x - s * .5, y - s * .9, x, y - s * .4); g.bezierCurveTo(x + s * .5, y - s * .9, x + s, y - s * .2, x, y + s * .35); g.fill(); };
  S.children.forEach((m) => { if (m.isMesh && Math.abs(m.position.y - 3.55) < .01) m.visible = false; });
  // wall decor: red cross sign, window
  addBox(S, -3.5, 2.5, 8.3, 1.0, 1.0, .06, 0xffffff); addBox(S, -3.5, 2.5, 8.25, .7, .22, .06, 0xd8343c); addBox(S, -3.5, 2.5, 8.25, .22, .7, .06, 0xd8343c);
  addBox(S, 3.6, 2.1, 8.3, 2.4, 1.4, .06, 0xa9d6f2, { mat: { emissive: 0x6aa8d8, emissiveIntensity: .35 } });
  // exam table + chairs
  const table = new THREE.Group(); { const t = addBox(S, .8, .6, 6.2, 1.9, .16, 1.1, 0x3aa1b5, { round: .05 }); const base = addBox(S, .95, .3, 6.2, 1.2, .6, .7, 0xc9ced6); const pap = addBox(S, .8, .69, 6.2, 1.8, .02, 1.0, 0xfafafa, { cast: false }); table.add(t, base, pap); S.add(table); }
  const chairs = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(); const sx = new THREE.Mesh(new THREE.BoxGeometry(.6, .08, .6), mat(0x8a5a38)); sx.position.y = .46; const bk = new THREE.Mesh(new THREE.BoxGeometry(.6, .6, .07), mat(0x8a5a38)); bk.position.set(0, .8, -.3); const lg = new THREE.Mesh(new THREE.BoxGeometry(.52, .44, .52), mat(0x6a4426)); lg.position.y = .22; g.add(sx, bk, lg); g.traverse((m) => (m.castShadow = true)); S.add(g); chairs.push(g); }
  const N = 19, crowd = new Crowd(S, N, 77); const P = crowd.p; const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  const D = P[0], PAT = P[1]; const look = drakeLook(lib, S, crowd, 0, { shirt: 0xf6f8fa, pants: 0x2a3340, coat: true });
  ['torso', 'armL', 'armR'].forEach((k) => col(1, k, 0xe8a23c)); ['legL', 'legR'].forEach((k) => col(1, k, 0x3a4152));
  const TC = [0xe84a8a, 0x3c8fe8, 0xf2d03c, 0x2ea84f, 0x8a4fe8, 0xff7a3c, 0x40c4b0]; for (let i = 2; i < N; i++) { ['torso', 'armL', 'armR'].forEach((k) => col(i, k, TC[i % 7])); ['legL', 'legR'].forEach((k) => col(i, k, [0x2a2f3c, 0x4a4036, 0x3a4a6a][i % 3])); }
  // coat details: stethoscope, lab-coat collar flaps
  const steth = new THREE.Mesh(new THREE.TorusGeometry(.17, .022, 8, 20), mat(0x222831)); const disc = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .03, 12), new THREE.MeshStandardMaterial({ color: 0xb8c0cc, metalness: .8, roughness: .3 })); const lapL = new THREE.Mesh(new THREE.BoxGeometry(.2, .3, .02), mat(0xffffff)), lapR = lapL.clone(); const pocket = new THREE.Mesh(new THREE.BoxGeometry(.14, .14, .02), mat(0xdfe6ec)); const tag = new THREE.Mesh(new THREE.BoxGeometry(.13, .07, .02), mat(0x3aa1b5)); [steth, disc, lapL, lapR, pocket, tag].forEach((m) => S.add(m));
  const thermo = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(.04, .04, .36), mat(0xf4f4f6)); const tip = new THREE.Mesh(new THREE.BoxGeometry(.045, .045, .06), mat(0xd8343c)); tip.position.z = .2; thermo.add(b, tip); S.add(thermo); }
  const clip = new THREE.Group(); { const bd = new THREE.Mesh(new THREE.BoxGeometry(.34, .44, .02), mat(0x8a5a38)); const pg = new THREE.Mesh(new THREE.BoxGeometry(.3, .38, .01), mat(0xfbf8ee)); pg.position.z = .012; clip.add(bd, pg); S.add(clip); }
  const pen = new THREE.Mesh(new THREE.BoxGeometry(.02, .2, .02), mat(0x2a4fd8)); S.add(pen);
  const RHYME = ['Rx:', 'Sip some tea, then rest your head.', 'Skip the stress and go to bed.', 'Two soft naps, a lozenge too,', 'Text me when you feel brand new.'];
  const rxTex = (n) => cvs(768, 560, (g, w, h) => { g.fillStyle = '#fbf8ee'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9b88a'; g.lineWidth = 8; g.strokeRect(6, 6, w - 12, h - 12); g.fillStyle = '#1b2a5c'; g.font = `900 78px ${FONT}`; g.fillText(RHYME[0], 40, 100); g.font = `700 40px Georgia`; for (let i = 1; i < 5; i++) { const txt = RHYME[i]; const k = clamp(n - (i - 1)); g.fillText(txt.slice(0, Math.ceil(txt.length * k)), 40, 100 + i * 92); } heart(g, 665, 470, 55, '#d8343c'); g.fillStyle = '#1b2a5c'; g.font = 'italic 34px Georgia'; g.fillText('Dr. D.', 520, 520); });
  let rxN = -1; const rx = plane(2.0, 1.46, rxTex(0));
  const chkTex = cvs(128, 128, (g) => { g.fillStyle = '#2ea84f'; g.beginPath(); g.arc(64, 64, 58, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 16; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(34, 66); g.lineTo(56, 90); g.lineTo(96, 40); g.stroke(); });
  const chkSp = []; for (let i = 0; i < 16; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: chkTex, transparent: true, depthTest: false })); sp.scale.set(.5, .5, 1); sp.visible = false; sp.renderOrder = 5; S.add(sp); chkSp.push(sp); }
  const chartTex = cvs(256, 200, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = '#333'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); heart(g, 70, 62, 52, '#e84a6a'); g.strokeStyle = '#2ea84f'; g.lineWidth = 8; g.beginPath(); g.moveTo(130, 70); for (let i = 0; i < 6; i++) g.lineTo(140 + i * 20, i % 2 ? 50 : 90); g.stroke(); g.fillStyle = '#333'; g.font = `800 34px ${FONT}`; g.fillText('FEELINGS: OK', 20, 168); });
  const charts = []; for (let i = 0; i < 16; i++) { const m = plane(.42, .33, chartTex, true); charts.push(m); }
  const wallChart = plane(3.6, 1.7, cvs(768, 360, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2a3a50'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); g.fillStyle = '#2a3a50'; g.font = `900 56px ${FONT}`; g.fillText('CLINIC FEELINGS CHART', 40, 80); heart(g, 140, 220, 100, '#e84a6a'); g.strokeStyle = '#2ea84f'; g.lineWidth = 12; g.beginPath(); g.moveTo(280, 230); for (let i = 0; i < 9; i++) g.lineTo(300 + i * 52, i % 2 ? 160 : 270); g.stroke(); g.fillStyle = '#2ea84f'; g.font = `900 52px ${FONT}`; g.fillText('ALL FINE', 560, 330); }));
  const billTex = cvs(1024, 560, (g, w, h) => { g.fillStyle = '#fbf8ee'; g.fillRect(0, 0, w, h); g.strokeStyle = '#1b2a5c'; g.lineWidth = 14; g.strokeRect(8, 8, w - 16, h - 16); g.fillStyle = '#1b2a5c'; g.font = `900 80px ${FONT}`; g.fillText('THE BILL', 50, 110); g.font = `700 52px ${FONT}`; g.fillText('Visit ........ $0', 50, 200); g.fillText('Feelings ..... $0', 50, 270); g.fillStyle = '#d8343c'; g.font = `900 120px ${FONT}`; g.fillText('TOTAL: 1 HUG', 50, 440); });
  const bill = plane(2.3, 1.26, billTex); const pole = [addBox(S, 1.0, .9, 5.3, .08, 1.8, .08, 0x6a4a2c), addBox(S, 2.4, .9, 5.3, .08, 1.8, .08, 0x6a4a2c)];
  const candles = []; for (let i = 0; i < 20; i++) { const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .22, 8), mat(0xf6f0dc)); const f = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffc23a })); f.position.y = .15; f.scale.y = 1.5; g.add(c, f); g.userData.f = f; S.add(g); candles.push(g); }
  const hearts = new Particles(S, 24, 0xff4a7a, .06, { rough: .3, emissive: 0x551122 }); const tears = new Particles(S, 40, 0x7fc8ff, .03, { rough: .1 }); const puffs = new Particles(S, 14, 0xffffff, .05, { rough: 1 });
  const bD = makeBubble(lib, S, 1.5, .56), bP = makeBubble(lib, S, 1.2, .45), bX = makeBubble(lib, S, 1.2, .45);
  const place = (o, x, z, yaw, anim = 'idle', y = 0, sp = .4, sc = 1.25) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.vis = true; o.scale = sc; };
  const yawTo = (ax, az, bx, bz) => Math.atan2(bx - ax, bz - az);
  const SEATY = .5 - .74; const TABLEY = .66 - .74;
  const POP = ['', 'ARE YOU OKAY?', 'RX: A RHYME', 'CANDLE CIRCLE', 'EVERYONE FINE', 'TOTAL: 1 HUG']; const NOTE = ['', 'temperature: emotional', 'cough: acknowledged', 'waiting room: now a circle', 'diagnosis: feelings', 'no insurance accepted'];
  const LABEL = ['', 'Hugs given', 'Rhymes written', 'Candles lit', 'Patients fine', 'Total due'];
  const V = new THREE.Vector3(), V2 = new THREE.Vector3();
  const CX = 0, CZ = 5.0, CR = 1.85;
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); for (let i = 0; i < N; i++) { P[i].vis = false; P[i].arms = null; P[i].pitch = 0; P[i].extra = 0; } [bD, bP, bX].forEach((b) => b.hide());
    table.visible = bi <= 2; pole.forEach((p) => (p.visible = bi === 5)); thermo.visible = false; clip.visible = false; pen.visible = false; rx.visible = false; wallChart.visible = false; bill.visible = false; chairs.forEach((c) => (c.visible = false)); candles.forEach((c) => (c.visible = false)); chkSp.forEach((s) => (s.visible = false)); charts.forEach((c) => (c.visible = false));
    hearts.clear(); tears.clear(); puffs.clear();
    let cam = [2.4, 1.9, 1.6, -.2, 1.4, 6.0, 50]; let cnt = '0';
    const PX = .8, PZ = 6.2, DX = -.62, TURN = .45;
    if (bi === 0) { place(D, 0, 4.4 + .0 * lt, Math.PI, 'idle'); D.x = lerp(-1.5, 0, smooth(clamp(lt / 1.2))); D.anim = lt < 1.2 ? 'walk' : 'idle'; D.arms = lt < 1.2 ? null : { lx: -.25, lz: -.12, rx: -.9, rz: .1 }; place(PAT, PX + 1.5, PZ + .2, yawTo(PX + 1.5, PZ + .2, 0, 4.4), 'sit', TABLEY, .3); PAT.vis = false; cam = [0, 1.7, -.9, 0, 1.6, 5, 52]; }
    else if (bi === 1) {
      const hug = smooth(clamp((lt - 3.1) / .8)); const dx = lerp(DX, -.02, hug);
      place(PAT, PX, PZ, yawTo(PX, PZ, DX, PZ) - TURN, 'sit', TABLEY, .3); PAT.arms = { lx: -.5, lz: -.1, rx: -.5, rz: .1 };
      place(D, dx, PZ, yawTo(dx, PZ, PX, PZ) + TURN, 'idle'); D.arms = hug > .05 ? { lx: -1.5, lz: .35, rx: -1.5, rz: -.35 } : { lx: -.25, lz: -.1, rx: -1.45, rz: -.05 }; D.pitch = .06 + .1 * hug;
      thermo.visible = lt < 2.9; if (thermo.visible) { V.setFromMatrixPosition(PAT.M.head); V.x += Math.sin(PAT.yaw) * .2; V.z += Math.cos(PAT.yaw) * .2; V.y -= .1; V2.setFromMatrixPosition(D.M.handR); V2.lerp(V, .55 + .05 * Math.sin(lt * 6)); thermo.position.copy(V2); thermo.lookAt(V); }
      if (lt > 1.2 && lt < 3.0) { bX.show('37.0°', PX - .5, 3.45, PZ); } if (lt > 3.4) bD.show('are you okay?', dx - .1, 3.7, PZ); if (lt > 4.2) bP.show('...yes?', PX + .2, 3.2, PZ);
      if (lt > 3.3) for (let i = 0; i < 12; i++) { const u = ((lt * .5 + i * .083) % 1); hearts.set(i, .3 + Math.sin(i * 2.1 + lt * 2) * .6, 2.5 + u * 1.0, PZ + Math.cos(i * 1.7) * .3, Math.sin(Math.PI * u)); } hearts.done(); puffs.done();
      cam = [.15, 1.9, .7, .2, 1.55, 6.2, 56]; cnt = String(lt > 3.4 ? 1 : 0); }
    else if (bi === 2) {
      place(PAT, PX, PZ, yawTo(PX, PZ, DX, PZ) - TURN, 'sit', TABLEY, .3); PAT.extra = (lt % 1.2 < .5 && lt > 1.5 && lt < 3) ? .25 : 0; PAT.arms = { lx: -.5, lz: -.1, rx: -.5, rz: .1 };
      place(D, DX, PZ, yawTo(DX, PZ, PX, PZ) + TURN, 'idle');
      const writing = lt > 2.9 && lt < 5.2; D.arms = { lx: -1.25, lz: .25, rx: -1.3, rz: -.2 }; D.pitch = .1; clip.visible = true; attach(clip, D, 'handL', [-.0, -.12, .1], [-.9, 0, 0]); pen.visible = true; attach(pen, D, 'handR', [0, -.12, .04], [0, 0, .3 + (writing ? .15 * Math.sin(t * 22) : 0)]);
      if (lt > 1.4 && lt < 3.1) { bP.show('*cough*', PX + .1, 3.3, PZ); const k = (lt - 1.4) % 1.2; if (k < .6) for (let i = 0; i < 10; i++) puffs.set(i, PX - .5 - k * .8 - i * .03, 2.0 - i * .015 + k * .1, PZ + Math.sin(i) * .15, .4 + k * 1.4); }
      puffs.done(); hearts.done();
      const show = smooth(clamp((lt - 3.3) / .5)); if (lt > 3.3) { rx.visible = true; const nn = clamp((lt - 3.6) / 1.5) * 4; rx.material.map = rxTex(nn); }
      rx._show = show;
      cam = [-.5, 1.95, .8, .1, 1.5, 6.2, 56]; cnt = String(lt > 3.6 ? Math.min(4, 1 + Math.floor((lt - 3.6) / .4)) : 0); }
    else if (bi === 3) {
      for (let i = 0; i < 8; i++) { const a = Math.PI * .5 + i * (Math.PI * 2 / 8) + .39; const x = CX + Math.cos(a) * CR, z = CZ + Math.sin(a) * CR; chairs[i].visible = true; chairs[i].position.set(x, 0, z); chairs[i].rotation.y = yawTo(x, z, CX, CZ); const o = P[i + 1]; place(o, x, z, yawTo(x, z, CX, CZ), 'sit', SEATY, .3, 1.15); const k = i % 3; o.arms = k === 0 ? { lx: -1.0, lz: -.1, rx: -1.0, rz: .1 } : { lx: -1.3, lz: .35, rx: -1.3, rz: -.35 }; o.pitch = 0;
        const c = candles[i]; c.visible = true; c.position.set(x + (CX - x) * .22, 1.05, z + (CZ - z) * .22); }
      place(D, CX, CZ + .2, Math.PI, 'idle'); D.arms = { lx: -1.2, lz: .55, rx: -1.2, rz: -.55 }; D.pitch = .05; D.x = CX; D.z = CZ - .3;
      for (let k = 0; k < 8; k++) { const c = candles[8 + k]; c.visible = true; const a = k * Math.PI / 4; c.position.set(CX + Math.cos(a) * .7, .11, CZ - .3 + Math.sin(a) * .7); }
      candles.forEach((c) => { if (c.visible) { c.userData.f.scale.set(1.5 + .2 * Math.sin(t * 17 + c.position.x * 5), 2.2 + .5 * Math.sin(t * 13 + c.position.z * 3), 1); } });
      if (lt > 1.8) { for (let i = 0; i < 40; i++) { const id = 1 + (i % 8), o = P[id], u = ((t * .8 + i * .0713) % 1); const side = (i % 2) ? -.09 : .09; const hv = (i % 5 === 0) ? 1 : 0; tears.set(i, o.x + side, 1.45 - u * .9, o.z + .05, hv && (id % 2) ? 1 : 0); } }
      tears.done(); hearts.done(); puffs.done();
      if (lt > 2.2) bD.show('I feel that', CX, 3.2, CZ - .2); if (lt > 3.6) bX.show('me too', P[3].x + .2, 2.55, P[3].z);
      cam = [0, 4.6, -5.2, 0, .6, 4.9, 60]; cnt = String(Math.min(16, Math.floor(lt * 4))); }
    else if (bi === 4) {
      wallChart.visible = true; wallChart.position.set(0, 2.5, 8.2); wallChart.rotation.y = Math.PI;
      let k = 0; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const o = P[3 + k]; const x = -1.95 + c * 1.3 + (r % 2) * .35, z = 3.6 + r * 1.15; place(o, x, z, Math.PI + Math.sin(k) * .15, 'idle', 0, .5, 1.1); o.arms = { lx: -.2, lz: -.1, rx: -1.35, rz: .1 }; const delay = .6 + k * .22; const on = clamp((lt - delay) / .25); const ch = charts[k]; ch.visible = true; attach(ch, o, 'handR', [-.12, -.12, .12], [0, 0, 0]); ch.rotation.y = Math.PI; V.setFromMatrixPosition(o.M.head); const sp = chkSp[k]; if (on > 0) { sp.visible = true; sp.position.set(o.x, 2.55 + Math.sin(t * 3 + k) * .03, z); sp.scale.setScalar(.55 * smooth(on) * (1 + .25 * Math.sin(Math.PI * clamp(on)))); } k++; }
      place(D, -2.7, 2.5, yawTo(-2.7, 2.5, -1.0, 4.2), 'idle'); D.arms = { lx: -.2, lz: -.1, rx: -1.7, rz: -.4 + .15 * Math.sin(t * 3) }; D.pitch = .05;
      cnt = Math.min(16, Math.floor(clamp((lt - .6) / .22) + 0)) + ''; { let n = 0; for (let i = 0; i < 16; i++) if (lt > .6 + i * .22 + .1) n++; cnt = n + '/16'; }
      if (lt > 4.4) bD.show('you are all fine', -2.3, 4.2, 2.5);
      cam = [-.6, 5.4, -5.6, -.7, 1.0, 5.0, 64]; }
    else {
      bill.visible = true; bill.position.set(1.7, 1.95, 5.2); bill.rotation.y = Math.PI; bill.scale.setScalar(.85 + .15 * smooth(clamp(lt / .5)));
      const op = smooth(clamp((lt - .05) / .5)); place(D, -.8, lerp(5.0, 4.2, smooth(clamp(lt / 1.4))), Math.PI, 'idle'); D.arms = { lx: lerp(-.3, -.15, op), lz: lerp(-.1, -1.45, op), rx: lerp(-.3, -.15, op), rz: lerp(.1, 1.45, op) }; D.pitch = 0; D.y = 0;
      cam = [.7, 1.8, -2.4, .7, 1.7, 6.0, 62]; cnt = '1 hug';
      for (let i = 0; i < 12; i++) { const u = ((lt * .6 + i * .083) % 1); hearts.set(i, -.8 + Math.sin(i * 2.4) * 1.5, 1.2 + u * 1.8, 4.4 + Math.cos(i * 1.9) * .5, op * Math.sin(Math.PI * u)); } hearts.done(); }
    crowd.update(t); look.update(); look.setVisible(D.vis);
    if (D.vis) { attach(steth, D, 'torso', [0, .3, .17], [0, 0, 0]); attach(disc, D, 'torso', [0, .02, .18], [Math.PI / 2, 0, 0]); attach(lapL, D, 'torso', [-.14, .3, .17], [0, 0, .35]); attach(lapR, D, 'torso', [.14, .3, .17], [0, 0, -.35]); attach(pocket, D, 'torso', [.17, -.05, .17]); attach(tag, D, 'torso', [-.17, .08, .175]); }
    [steth, disc, lapL, lapR, pocket, tag].forEach((m) => (m.visible = D.vis));
    A.cam(...cam); A.follow(0, 4);
    if (rx.visible) { const cm = A.camera; V.set(0, 0, -1).applyQuaternion(cm.quaternion); V2.set(0, 1, 0).applyQuaternion(cm.quaternion); rx.position.copy(cm.position).addScaledVector(V, 4.2).addScaledVector(V2, 1.6); rx.quaternion.copy(cm.quaternion); rx.scale.setScalar((.55 + .45 * rx._show) * .9); }
    A.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if *Drake* became your doctor?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter(LABEL[bi], cnt, NOTE[bi], 'PARODY', bi >= 4); hud.tm('');
    hud.pop(POP[bi] && lt > .5 ? POP[bi] : '', Math.min(1, (lt - .5) * 6));
  } };
}
