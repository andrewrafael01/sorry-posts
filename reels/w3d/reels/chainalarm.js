// 658 invention chain: can't wake up -> alarm clock -> snooze x11 -> clock across room -> sleepwalk slap -> clock with legs -> chase in boxers -> caught, wide awake -> it's Saturday.
import { bedroom2 } from './_bed.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, ground, road, tree, Crowd, clamp, smooth, lerp, attach, RoundedBoxGeometry } = lib;
  const A = makeStage({ fog: 0x2a2d42, fogNear: 40, fogFar: 160, clouds: true, skyTop: 0x5a6fb5, skyMid: 0xf4a97c, skyBot: 0xffd9a0, shadowExtent: 24, shadowRes: 2048, hemi: 1.2, sunI: 2.2, sunColor: 0xffb878, sunDir: [-.8, .5, .35], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const OX = 400; // street offset

  // ============================================================ bedroom
  const roomG = new THREE.Group(); S.add(roomG);
  const bed = bedroom2(lib, A, roomG); bed.cones.count = 0; bed.slabs.count = 0; bed.embers.count = 0; bed.bolt.count = 0; bed.strings.forEach((s) => { s.visible = false; });
  bed.blanket.position.y = .26; roomG.children.forEach((m) => { if (m.isMesh && Math.abs(m.position.x + 2.2) < .01 && m.position.y > 1.0 && m.position.y < 2) m.visible = false; });
  const RP = bed.person; const rcrowd = bed.crowd;
  // dresser (far side of room, under the window)
  addBox(roomG, 4.7, .55, 7.9, 1.9, 1.1, .7, 0x7a5532, { round: .03 }); for (const y of [.3, .62, .92]) { addBox(roomG, 4.7, y, 7.53, 1.7, .26, .03, 0x8d6540); addBox(roomG, 4.7, y, 7.5, .22, .05, .04, 0xd8c8a0); }
  addBox(roomG, 4.7, 1.12, 7.9, 1.96, .05, .76, 0x5e4126);
  // ============================================================ alarm clock
  const makeClock = () => {
    const g = new THREE.Group(); const red = mat(0xd8342a, { roughness: .35, metalness: .15 }); const gold = mat(0xe8b830, { roughness: .3, metalness: .6 });
    const body = new THREE.Mesh(new RoundedBoxGeometry(.58, .58, .28, 4, .1), red); body.castShadow = true; g.add(body);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(.235, .235, .02, 28), mat(0xf4f4f0)); rim.rotation.x = Math.PI / 2; rim.position.z = .142; g.add(rim);
    const fc = cvs(256, 256, (c) => { c.fillStyle = '#f7f3e4'; c.beginPath(); c.arc(128, 128, 126, 0, 7); c.fill(); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; c.fillStyle = '#222'; c.save(); c.translate(128, 128); c.rotate(a); c.fillRect(-4, -118, 8, i % 3 ? 18 : 30); c.restore(); } });
    const face = new THREE.Mesh(new THREE.CircleGeometry(.215, 32), new THREE.MeshStandardMaterial({ map: fc.t, roughness: .5 })); face.position.z = .154; g.add(face);
    const mkHand = (len, w, col) => { const p = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(w, len, .012), mat(col)); b.position.y = len / 2 - .02; p.add(b); p.position.z = .165; g.add(p); return p; };
    const hH = mkHand(.11, .026, 0x111111), hM = mkHand(.17, .018, 0x111111);
    const pin = new THREE.Mesh(new THREE.SphereGeometry(.02, 8, 6), mat(0xd8342a)); pin.position.z = .172; g.add(pin);
    const bells = []; for (const s of [-1, 1]) { const b = new THREE.Group(); const dome = new THREE.Mesh(new THREE.SphereGeometry(.15, 18, 10, 0, 6.3, 0, 1.45), gold); dome.castShadow = true; b.add(dome); b.position.set(s * .2, .3, 0); b.rotation.z = -s * .55; g.add(b); bells.push(b); }
    const ham = new THREE.Group(); const stem = new THREE.Mesh(new THREE.BoxGeometry(.02, .15, .02), mat(0x555555)); stem.position.y = .075; const ball = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 6), mat(0x333333)); ball.position.y = .16; ham.add(stem, ball); ham.position.set(0, .3, 0); g.add(ham);
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(.075, .085, .06, 14), mat(0xffd02a, { roughness: .4 })); btn.position.set(0, .32, 0); btn.castShadow = true; g.add(btn);
    const lab = cvs(320, 80, (c, w, h) => { c.fillStyle = '#ffd02a'; c.fillRect(0, 0, w, h); c.fillStyle = '#111'; c.fillRect(0, 0, w, 6); c.fillRect(0, h - 6, w, 6); txt(c, 'SNOOZE', w / 2, 42, 58, '#111'); });
    const lp = new THREE.Mesh(new THREE.PlaneGeometry(.36, .09), new THREE.MeshBasicMaterial({ map: lab.t })); lp.position.set(0, .225, .145); g.add(lp);
    const legs = []; for (const s of [-1, 1]) { const l = new THREE.Group(); const th = new THREE.Mesh(new THREE.BoxGeometry(.075, .3, .075), mat(0x222222)); th.position.y = -.15; const sh = new THREE.Mesh(new THREE.BoxGeometry(.13, .06, .22), mat(0xf2f2f2)); sh.position.set(0, -.31, .05); l.add(th, sh); l.position.set(s * .15, -.26, 0); l.visible = false; l.traverse((m) => { m.castShadow = true; }); g.add(l); legs.push(l); }
    const fts = []; for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(.08, .06, .08), mat(0x333333)); f.position.set(s * .2, -.31, 0); g.add(f); fts.push(f); }
    // ring bars
    const bars = new THREE.Group(); for (let i = 0; i < 14; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(.035, .16, .035), new THREE.MeshBasicMaterial({ color: 0xffe14a })); bars.add(b); } bars.visible = false; g.add(bars);
    g.userData = { body, hH, hM, bells, ham, btn, legs, fts, bars }; g.traverse((m) => { if (m.isMesh && m.material !== undefined) m.castShadow = true; }); return g;
  };
  const clock = makeClock(); S.add(clock);
  const setClock = (t, o) => { // o: ring (0..1), tm (minutes), legsOn, run, droop
    const u = clock.userData; const rg = o.ring || 0; const sh = Math.sin(t * 90) * .04 * rg;
    u.body.rotation.z = sh; u.body.position.x = Math.sin(t * 77) * .012 * rg;
    u.bells.forEach((b, i) => { const s = i ? 1 : -1; b.rotation.z = (i ? -1 : 1) * (-.55 - (o.droop || 0) * 1.1) * (i ? 1 : -1) * -1; b.rotation.z = s * -1 * .55 * (i ? -1 : 1) * (i ? 1 : 1) * 0 + (i ? -.55 : .55) * 1; b.rotation.z = (i ? -1 : 1) * (.55 + (o.droop || 0) * .9) * -1 * -1; b.rotation.z += Math.sin(t * 95 + i) * .08 * rg; });
    u.bells[0].rotation.z = -(.55 + (o.droop || 0) * .9) * -1 * 0 + (-1) * (-.55) * 0 + (.55 + (o.droop || 0) * .9) * -1 * -1 * 0; // overwritten below
    u.bells[0].rotation.z = (.55 + (o.droop || 0) * .9) * 1 + Math.sin(t * 95) * .08 * rg; u.bells[1].rotation.z = -(.55 + (o.droop || 0) * .9) + Math.sin(t * 95 + 2) * .08 * rg; u.bells[0].position.y = u.bells[1].position.y = .3 - (o.droop || 0) * .05;
    u.ham.rotation.z = Math.sin(t * 110) * .45 * rg;
    const m = o.tm ?? 0; u.hM.rotation.z = -(m / 60) * Math.PI * 2; u.hH.rotation.z = -(.19 + m / 720) * Math.PI * 2; // 6:30 start
    u.bars.visible = rg > .01; if (u.bars.visible) u.bars.children.forEach((b, i) => { const a = (i / 14) * Math.PI * 2 + Math.floor(t * 18) * .3; const r = .55 + .15 * ((t * 12 + i * .37) % 1); b.position.set(Math.cos(a) * r * 1.1, Math.sin(a) * r * .9 + .08, .05); b.rotation.z = a - Math.PI / 2; b.visible = ((i + Math.floor(t * 20)) % 2) === 0; });
    u.legs.forEach((l, i) => { l.visible = !!o.legsOn; if (o.legsOn) { const ph = o.run ? Math.sin(t * 22 + (i ? Math.PI : 0)) : Math.sin(t * 6 + i * 2) * .3; l.rotation.x = ph * (o.run ? 1.15 : .6); } }); u.fts.forEach((f) => { f.visible = !o.legsOn; });
  };
  // giant hand
  const hand = new THREE.Group(); { const skin = mat(0xf0c6a0, { roughness: .6 }); const slv = mat(0xe3bd54, { roughness: .8 });
    const palm = new THREE.Mesh(new RoundedBoxGeometry(.62, .17, .6, 3, .06), skin); hand.add(palm);
    for (let i = 0; i < 4; i++) { const f = new THREE.Mesh(new RoundedBoxGeometry(.13, .13, .4, 3, .05), skin); f.position.set(-.235 + i * .156, 0, .46 - (i === 1 || i === 2 ? -.04 : 0)); hand.add(f); }
    const th = new THREE.Mesh(new RoundedBoxGeometry(.14, .13, .32, 3, .05), skin); th.position.set(.38, 0, .12); th.rotation.y = -.7; hand.add(th);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(.4, 4.0, .4), slv); arm.position.set(0, 2.0, -.34); arm.rotation.x = .0; hand.add(arm);
    hand.traverse((m) => { m.castShadow = true; }); hand.visible = false; S.add(hand); }
  // sleep mask
  const mask = new THREE.Group(); { const mt = cvs(256, 96, (g, w, h) => { g.fillStyle = '#4b3a8f'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f0e6ff'; g.lineWidth = 8; g.lineCap = 'round'; for (const x of [70, 186]) { g.beginPath(); g.arc(x, 36, 20, .15 * Math.PI, .85 * Math.PI); g.stroke(); for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(x + k * 12, 56); g.lineTo(x + k * 15, 70); g.stroke(); } } });
    const f = new THREE.Mesh(new THREE.BoxGeometry(.5, .17, .07), [mat(0x4b3a8f), mat(0x4b3a8f), mat(0x4b3a8f), mat(0x4b3a8f), new THREE.MeshStandardMaterial({ map: mt.t, roughness: .8 }), mat(0x4b3a8f)]); f.position.z = .035; const st = new THREE.Mesh(new THREE.BoxGeometry(.47, .06, .44), mat(0x3a2c75)); st.position.z = -.22; mask.add(f, st); mask.traverse((m) => { m.castShadow = true; }); mask.visible = false; S.add(mask); }
  const bulge = new THREE.Group(); { for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.13, 16, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .2 })); e.position.set(s * .1, 0, 0); const p = new THREE.Mesh(new THREE.SphereGeometry(.038, 10, 8), mat(0x0a0a10)); p.position.set(s * .1, 0, .12); const hl = new THREE.Mesh(new THREE.SphereGeometry(.014, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); hl.position.set(s * .1 + .014, .02, .15); bulge.add(e, p, hl); } bulge.visible = false; S.add(bulge); }
  // labels
  const mkLabel = (text, c1, c2, w = 512, fs = 110) => { const l = cvs(w, 160, (g, ww, h) => { txt(g, text, ww / 2, 84, text.length > 9 ? 84 : fs, c1, { stroke: c2, sw: 20 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const lbClever = mkLabel('CLEVER!', '#ffe23a', '#111'), lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111', 640, 100), lbBonk = mkLabel('BONK!', '#ff7a3a', '#111', 384), lbSnz = mkLabel('SNOOZE!', '#ff5a4a', '#111', 448, 96), lbZ = mkLabel('Z', '#cfe3ff', '#223', 192);
  const zzz = [0, 1, 2].map(() => { const s = lbZ.clone(); s.material = lbZ.material.clone(); S.add(s); return s; });
  const labelAt = (s, on, p, sc, k = 1) => { s.visible = on; if (on) { s.position.copy(p); const a = clamp(k); s.scale.set(sc * 1.15 * a, sc * .36 * a, 1); } };

  // ============================================================ street
  const stG = new THREE.Group(); stG.position.x = OX; S.add(stG);
  ground(stG, 0x7a9a58, 800, { y: -.02 }); road(stG, 0, 120, 10, 400);
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(2.2, .2, 400), new THREE.MeshStandardMaterial({ color: 0xcfc9bc, roughness: 1 })); w.position.set(s * 6.1, .1, 120); w.receiveShadow = true; stG.add(w); const cb = new THREE.Mesh(new THREE.BoxGeometry(.2, .22, 400), mat(0xb5b0a4)); cb.position.set(s * 5.05, .1, 120); stG.add(cb); }
  const HC = [0xe9c8a0, 0xb7d0e0, 0xe8b3a0, 0xc8d8a8, 0xe0d090, 0xd4b0d8, 0xf0e0c8, 0xa8c4d0];
  const house = (x, z, s, i) => { const g = new THREE.Group(); const W = 8.5 + cr(i, 1) * 3, H = 4.4 + cr(i, 2) * 1.4, D = 8; const b = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), mat(HC[i % 8])); b.position.y = H / 2; b.castShadow = b.receiveShadow = true; g.add(b);
    const r = new THREE.Mesh(new THREE.ConeGeometry(Math.max(W, D) * .78, 2.6, 4), mat([0x8a4a3a, 0x4a566a, 0x6a4a3a, 0x5a6a4a][i % 4])); r.rotation.y = Math.PI / 4; r.scale.set(W / Math.max(W, D), 1, D / Math.max(W, D)); r.position.y = H + 1.3; r.castShadow = true; g.add(r);
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, .15), mat(0x7a2e2a)); door.position.set(s * -(W / 2 + .04), 1.1, 0); door.rotation.y = Math.PI / 2; g.add(door);
    for (const dz of [-2.4, 2.4]) for (const y of [1.5, 3.6]) { const w = new THREE.Mesh(new THREE.BoxGeometry(.1, 1.1, 1.3), new THREE.MeshStandardMaterial({ color: 0xffe9a0, emissive: 0xffc860, emissiveIntensity: cr(i + dz, y) > .5 ? .7 : .05, roughness: .4 })); w.position.set(s * -(W / 2 + .03), y, dz); g.add(w); }
    g.position.set(x, 0, z); g.rotation.y = 0; stG.add(g); return g; };
  for (let i = 0; i < 16; i++) for (const s of [-1, 1]) house(s * 16.5, -10 + i * 14 + (s > 0 ? 5 : 0), s, i * 2 + (s > 0 ? 1 : 0));
  for (let z = -4; z < 220; z += 14) for (const s of [-1, 1]) { tree(stG, s * 7.6, z + 3, .8 + cr(z, s) * .3, (z * 3 + s) | 0); }
  for (let z = 0; z < 220; z += 9) for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(.08, .7, 8.6), mat(0xf4f0e6)); f.position.set(s * 9.9, .35, z + 4); f.castShadow = true; stG.add(f); }
  for (let z = 6; z < 200; z += 26) for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, 5.0, 8), mat(0x3b3f46)); p.position.set(s * 5.9, 2.5, z); p.castShadow = true; stG.add(p); const hd = new THREE.Mesh(new THREE.BoxGeometry(.6, .12, .3), mat(0x3b3f46)); hd.position.set(s * 5.6, 5.0, z); stG.add(hd); }
  const carCols = [0xc0392b, 0x2e86c1, 0xf1c40f, 0x1e8449, 0xecf0f1, 0x8e44ad]; for (let i = 0; i < 9; i++) { const s = i % 2 ? 1 : -1; lib.car(stG, s * 4.0, 4 + i * 20 + cr(i, 4) * 6, Math.PI / 2 * 0 + (s > 0 ? 0 : Math.PI), carCols[i % 6]); }
  // mailboxes, bins
  for (let z = 2; z < 200; z += 14) for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.BoxGeometry(.25, .3, .5), mat(0x2d4aa8)); m.position.set(s * 7.0, .9, z + 1); stG.add(m); const pp = new THREE.Mesh(new THREE.BoxGeometry(.08, .9, .08), mat(0x555555)); pp.position.set(s * 7.0, .45, z + 1); stG.add(pp); }
  // street people + you
  const sc = new Crowd(stG, 8, 31); const SP = sc.p; const YOU = SP[0];
  const colS = (i, ks, c) => ks.forEach((k) => sc.parts[k].setColorAt(i, new THREE.Color(c)));
  colS(0, ['torso'], 0xf4f4f0); colS(0, ['armL', 'armR', 'legL', 'legR'], 0xe9c3a0); colS(0, ['hair'], 0x3a2a1c); colS(0, ['head', 'neck', 'handL', 'handR'], 0xe9c3a0);
  const robes = [0x6f8fc8, 0xc86f8f, 0x7fbf7f, 0xd8a050, 0x9a7ac8, 0x70b0b0, 0xc8c870]; for (let i = 1; i < 8; i++) { colS(i, ['torso', 'armL', 'armR'], robes[i - 1]); colS(i, ['legL', 'legR'], 0xe0e0e0); }
  for (const k in sc.parts) if (sc.parts[k].instanceColor) sc.parts[k].instanceColor.needsUpdate = true;
  // boxers with hearts
  const bxt = cvs(128, 128, (g, w, h) => { g.fillStyle = '#f6f2ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#e0263c'; for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) { const cx = 22 + x * 42 + (y % 2) * 14, cy = 20 + y * 40; g.beginPath(); g.moveTo(cx, cy + 10); g.bezierCurveTo(cx - 20, cy - 6, cx - 8, cy - 18, cx, cy - 6); g.bezierCurveTo(cx + 8, cy - 18, cx + 20, cy - 6, cx, cy + 10); g.fill(); } });
  const boxers = new THREE.Mesh(new THREE.BoxGeometry(.62, .34, .36), new THREE.MeshStandardMaterial({ map: bxt.t, roughness: .9 })); boxers.castShadow = true; stG.add(boxers);
  // dog
  const dog = new THREE.Group(); const dogM = mat(0xb8793a); { const bd = new THREE.Mesh(new RoundedBoxGeometry(.5, .45, 1.0, 3, .12), dogM); bd.position.y = .6; const hd = new THREE.Mesh(new RoundedBoxGeometry(.4, .4, .42, 3, .1), dogM); hd.position.set(0, .88, .6); const sn = new THREE.Mesh(new THREE.BoxGeometry(.22, .18, .3), mat(0xd9a064)); sn.position.set(0, .8, .88); const ns = new THREE.Mesh(new THREE.BoxGeometry(.08, .07, .06), mat(0x111111)); ns.position.set(0, .86, 1.04); const ear = (s) => { const e = new THREE.Mesh(new THREE.BoxGeometry(.1, .3, .16), mat(0x8a5524)); e.position.set(s * .22, .9, .55); e.rotation.z = -s * .3; return e; }; const tail = new THREE.Mesh(new THREE.BoxGeometry(.08, .08, .5), dogM); tail.position.set(0, .82, -.62); tail.rotation.x = .6; dog.add(bd, hd, sn, ns, ear(-1), ear(1), tail); dog.userData.legs = []; for (const [x, z] of [[-.17, .35], [.17, .35], [-.17, -.35], [.17, -.35]]) { const l = new THREE.Group(); const lg = new THREE.Mesh(new THREE.BoxGeometry(.12, .42, .12), dogM); lg.position.y = -.21; l.add(lg); l.position.set(x, .42, z); dog.add(l); dog.userData.legs.push(l); } dog.userData.tail = tail; dog.traverse((m) => { m.castShadow = true; }); stG.add(dog); }
  // calendar sign (beat 4)
  const calG = new THREE.Group(); { const cvx = cvs(768, 640, (g, w, h) => { g.fillStyle = '#fbfaf5'; g.fillRect(0, 0, w, h); g.fillStyle = '#d83a2e'; g.fillRect(0, 0, w, 150); txt(g, 'NOVEMBER', w / 2, 78, 100, '#fff'); for (const x of [150, 618]) { g.fillStyle = '#222'; g.beginPath(); g.arc(x, 22, 14, 0, 7); g.fill(); } txt(g, '14', w / 2, 300, 290, '#222'); txt(g, 'SAT', w / 2, 500, 190, '#d83a2e'); txt(g, 'NO WORK TODAY', w / 2, 598, 52, '#555', { w: 800 }); g.strokeStyle = '#ccc'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); });
    const bd = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.0, .14), mat(0x6a4a2c)); bd.position.set(0, 3.0, 0); const pg = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.83), new THREE.MeshStandardMaterial({ map: cvx.t, roughness: .8 })); pg.position.set(0, 3.0, -.075); pg.rotation.y = Math.PI; calG.add(bd); calG.add(pg); for (const x of [-1.5, 1.5]) { const po = new THREE.Mesh(new THREE.BoxGeometry(.16, 3.2, .16), mat(0x4a3420)); po.position.set(x, 1.6, 0); calG.add(po); } calG.traverse((m) => { m.castShadow = true; }); calG.visible = false; stG.add(calG); }
  // rain cloud (sad)
  const cloud = new THREE.Group(); { const cm = mat(0x7d8696, { roughness: 1 }); for (const [x, y, r] of [[0, 0, .42], [-.4, -.05, .32], [.4, -.05, .34], [.15, .2, .3]]) { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), cm); s.position.set(x, y, 0); cloud.add(s); } cloud.userData.rain = []; for (let i = 0; i < 16; i++) { const d = new THREE.Mesh(new THREE.BoxGeometry(.03, .22, .03), new THREE.MeshBasicMaterial({ color: 0x8fb8ff })); cloud.add(d); cloud.userData.rain.push(d); } cloud.visible = false; stG.add(cloud); }
  stG.add(bulge);
  // ============================================================ camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3(); let ox = 0;
  const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .015 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .012 + Math.cos(t * 57) * shake; E.x += ox; T2.x += ox; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .008); };
  const place = (o, x, y, z, yaw, anim, sp = 1) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; };
  // clock home positions
  const NS = [-2.2, 1.17, 3.3], DR = [4.35, 1.5, 7.85]; const DRY = Math.atan2(3.5 - DR[0], 7.2 - DR[2]);
  const SLAM0 = 4.55, SLAMD = .24;
  const xc = (tg) => -.4 + 1.6 * Math.sin(Math.min(tg, 7.0) * 1.5), zc = (tg) => 10 + 8.4 * Math.min(tg, 7.0);
  const gapf = (tg) => lerp(4.8, 2.3, smooth(tg / 6.9));
  const zyf = (tg) => zc(tg) - gapf(tg), xyf = (tg) => xc(tg - .45);
  const ZS = zc(7.0), XS = xc(7.0);
  const DUR = [7.5, 4.5, 8.25, 3.0, 1.5];

  return { frame({ t, bi, lt }) {
    bi = Math.min(bi, 4); const inRoom = bi <= 1 || (bi === 2 && lt < 1.9); roomG.visible = inRoom; stG.visible = !inRoom;
    clock.visible = true; clock.matrixAutoUpdate = true; clock.scale.setScalar(1);
    hand.visible = false; mask.visible = false; bulge.visible = false; cloud.visible = false; calG.visible = false; dog.visible = false; boxers.visible = false;
    let counter = ['SNOOZES', '0'], note = '', hot = false; let shake = 0; let an = {};
    zzz.forEach((s) => { s.visible = false; }); [lbClever, lbBetter, lbBonk, lbSnz].forEach((s) => { s.visible = false; });
    A.scene.fog.color.set(inRoom ? 0x23263a : 0xf0b890); A.scene.fog.near = inRoom ? 40 : 60; A.scene.fog.far = inRoom ? 160 : 230;
    A.sun.intensity = inRoom ? 0 : 2.3; A.hemi.intensity = inRoom ? .5 : .75; bed.lamp.intensity = inRoom ? 6 : 0; ox = inRoom ? 0 : OX;
    // ---------------- ROOM beats
    if (inRoom) {
      RP.anim = 'lie'; RP.x = 0; RP.y = 1.0; RP.z = 5.3; RP.yaw = 0; RP.lie = Math.PI / 2; RP.scale = 1; RP.h = 1; RP.vis = true; RP.arms = { lx: -.2, lz: -.1, rx: -.2, rz: .1 }; RP.pitch = 0; RP.speed = .3; RP.extra = 0;
      let breathe = Math.sin(t * 2.0) * .5 + .5, wake = 0; let mm = 0, ring = 0, legsOn = false, run = false; let cp = V3(...NS), cry = 0, ctilt = 0, cs = 1; let handPos = null;
      mask.visible = false;
      if (bi === 0) {
        const nPress = lt < SLAM0 ? 0 : Math.min(11, Math.floor((lt - SLAM0) / SLAMD) + 1);
        // clock drops onto the nightstand ("buy")
        const drop = clamp((lt - 2.6) / .55); const dy = Math.max(0, 3.2 * (1 - drop) * (1 - drop)) + (drop >= 1 && lt < 3.4 ? Math.abs(Math.sin((lt - 3.15) * 16)) * .1 * Math.exp(-(lt - 3.15) * 5) : 0);
        clock.visible = lt >= 2.6; cp.y = NS[1] + dy;
        ring = lt > 3.3 ? 1 : 0; let cyc = (lt - SLAM0) / SLAMD; const ph = cyc - Math.floor(cyc); let hy = 3.4, press = 0;
        if (lt >= SLAM0 - .3 && nPress < 11 + (cyc < 11 ? 0 : 1)) {
          if (lt < SLAM0) { hy = lerp(3.4, 1.9, smooth((lt - (SLAM0 - .3)) / .3)); } else if (cyc < 11) { hy = ph < .35 ? lerp(1.9, 0, smooth(ph / .35)) : ph < .5 ? 0 : lerp(0, 1.9, smooth((ph - .5) / .5)); press = ph >= .3 && ph < .55 ? 1 : 0; } else { hy = lerp(0, 3.4, smooth((cyc - 11) / 1.6)); }
          hand.visible = true; handPos = V3(NS[0], NS[1] + .37 + .14 + hy, NS[2] + .0); }
        if (lt >= SLAM0 && cyc < 11) { const pressed = ph > .3 && ph < .6; if (pressed) ring = 0; shake = (ph > .3 && ph < .5) ? .03 : 0; } if (cyc >= 11) ring = 0;
        mm = nPress * 9; ctilt = (lt >= SLAM0 && cyc < 11 && ph > .3 && ph < .6) ? -.12 : 0; cs = (lt >= SLAM0 && cyc < 11 && ph > .3 && ph < .5) ? .92 : 1;
        wake = 0; counter = ['SNOOZES', String(nPress)]; hot = nPress > 0; note = ['sleeping', 'sleeping', 'sleeping', 'sleeping', 'sleeping', 'sleeping', 'sleeping', 'sleeping', 'sleeping', 'sleeping', 'sleeping', 'ALARM: 0  YOU: 11'][nPress > 10 ? 11 : 0] || ''; note = nPress ? 'you vs. the alarm' : 'zzz';
        zzz.forEach((s, i) => { const l = ((lt * .5 + i / 3) % 1); const on = lt < 5.0 || true; s.visible = on; s.position.set(-.1 + l * .4 + i * .12, 2.0 + l * 1.0, 3.7); const a = Math.sin(l * Math.PI); s.scale.set(.5 * a + .05, .5 * a * .6 + .03, 1); s.material.opacity = a; });
        labelAt(lbClever, lt > 3.92 && lt < 4.9, V3(NS[0] + .3, NS[1] + 1.1, NS[2] + .5), .95, Math.min(1.1, (lt - 3.92) * 5));
        labelAt(lbSnz, lt >= SLAM0 && cyc < 11 && ph > .3 && ph < .62 && lt > 5.2 && Math.floor(cyc) % 3 === 0, V3(NS[0] + .7, NS[1] + 1.1 + (ph - .3), NS[2] + .7), .55, 1);
        an = { cp };
        // camera
        rig(lt, [[0, [3.0, 2.8, 8.0], [2.0, 2.4, 7.4], [0, 1.1, 4.4], [-.2, 1.1, 4.4], 68, 64], [2.5, [-4.6, 1.9, 5.8], [-4.0, 1.7, 5.2], [-2.2, 1.4, 3.4], [-2.2, 1.4, 3.3], 46, 42], [4.3, [-4.3, 2.0, 5.3], [-4.0, 2.0, 5.1], [-2.2, 1.9, 3.4], [-2.2, 1.9, 3.4], 50, 52], [5.9, [-.5, 3.1, 7.4], [-1.0, 2.9, 7.0], [-1.4, 1.6, 3.8], [-1.7, 1.6, 3.7], 60, 58]], an, t, shake);
      } else if (bi === 1) {
        // clock hops across the room (0.35..1.3)
        const hop = clamp((lt - .35) / .95); const hh = Math.sin(hop * Math.PI) * 2.6; cp = V3(lerp(NS[0], DR[0], smooth(hop)), lerp(NS[1], DR[1], hop) + hh, lerp(NS[2], DR[2], smooth(hop))); cry = lerp(0, DRY, smooth(hop)) + hop * 6.28 * (hop < 1 ? 1 : 0); ring = lt < .35 ? 1 : (lt > 1.35 ? 1 : 0); if (lt > 3.4) ring = 0;
        if (hop > 0 && hop < 1) ctilt = Math.sin(hop * 12) * .15;
        mm = 99; cry = hop >= 1 ? DRY : cry;
        // sleeper stirs, then sleepwalker
        const rise = clamp((lt - 1.7) / .45), out = clamp((lt - 2.15) / .35), walk = clamp((lt - 2.35) / .95), back = clamp((lt - 3.75) / .75);
        const bedSide = V3(1.95, 0, 5.0), standAt = V3(3.45, 0, 7.15);
        if (rise > 0) { RP.lie = lerp(Math.PI / 2, 0, smooth(rise)); RP.x = lerp(0, 1.2, smooth(out)); RP.y = lerp(1.0, 0, smooth(out)); RP.z = lerp(5.3, 5.0, smooth(rise)); RP.anim = out >= 1 ? 'walk' : 'lie'; RP.speed = 1.3; }
        let px = RP.x, pz = RP.z;
        if (lt >= 2.35 && lt < 3.75) { const u = smooth(walk); px = lerp(1.2, standAt.x, u); pz = lerp(5.0, standAt.z, u); RP.yaw = Math.atan2(standAt.x - 1.2, standAt.z - 5.0); RP.anim = walk < 1 ? 'walk' : 'idle'; RP.speed = 1.6; }
        else if (lt >= 3.75) { const u = smooth(back); px = lerp(standAt.x, 1.6, u); pz = lerp(standAt.z, 5.1, u); RP.yaw = Math.atan2(1.6 - standAt.x, 5.1 - standAt.z); RP.anim = back < 1 ? 'walk' : 'idle'; RP.speed = 1.0; }
        else if (rise > 0 && out < 1) { RP.yaw = 0; }
        RP.x = px; RP.z = pz;
        // arms: zombie, slap at 3.35
        if (lt >= 2.3) { let rx = -1.55, lx = -1.55; const hit = lt - 3.33; if (hit > -.25 && hit < .6) { rx = hit < 0 ? lerp(-1.55, -2.9, smooth((hit + .25) / .25)) : lerp(-2.9, -1.9, smooth(hit / .12)); if (hit > .15) rx = lerp(-1.9, -1.55, smooth((hit - .15) / .3)); } if (lt > 3.75) { rx = -1.3; lx = -1.3; } RP.arms = { lx, lz: -.05, rx, rz: .05 }; RP.pitch = 0.1; mask.visible = true; RP.lie = rise < 1 ? RP.lie : 0; }
        else { mask.visible = lt > 1.7 || true; }
        mask.visible = true;
        const slapT = lt - 3.35; if (slapT > 0 && slapT < .35) { cs = lerp(.8, 1, slapT / .35); ctilt = -.5 * Math.exp(-slapT * 7) * Math.sin(slapT * 30); shake = .02 * (1 - slapT / .35); ring = 0; }
        if (lt > 3.35) ring = 0;
        const steps = lt < 2.35 ? 0 : Math.min(11, Math.floor((Math.min(lt, 3.35) - 2.35) * 11));
        counter = lt < 2.3 ? ['SNOOZES', '11'] : ['STEPS TO THE CLOCK', String(steps)]; hot = true; note = lt < 2.3 ? 'clock: across the room' : lt > 3.35 ? 'clock: hit' : 'eyes: closed';
        labelAt(lbBonk, slapT > 0 && slapT < .8, V3(DR[0] - .5, DR[1] + .9 + slapT * .6, DR[2] - .3), .8, Math.min(1.1, slapT * 8));
        labelAt(lbClever, false, V3());
        zzz.forEach((s, i) => { const l = ((lt * .5 + i / 3) % 1); const on = lt < 2.1; s.visible = on; s.position.set(-.1 + l * .4 + i * .12, 2.0 + l * 1.0, 3.7); const a = Math.sin(l * Math.PI); s.scale.set(.5 * a + .05, .5 * a * .6 + .03, 1); s.material.opacity = a; });
        cs = cs * 1.0;
        an = {};
        rig(lt, [[0, [-5.6, 3.4, 2.0], [-5.4, 3.2, 2.4], [2.0, 1.0, 6.5], [2.2, 1.0, 6.6], 76, 72], [1.35, [3.3, 2.1, 5.2], [3.7, 2.0, 5.5], [4.3, 1.5, 7.9], [4.35, 1.5, 7.9], 40, 36], [1.95, [.2, 2.6, 7.7], [.6, 2.4, 7.7], [2.6, 1.0, 5.9], [3.0, 1.0, 6.3], 60, 56], [3.0, [.9, 2.7, 7.7], [1.2, 2.6, 7.7], [4.1, 1.5, 7.8], [4.2, 1.5, 7.8], 46, 42], [3.85, [-5.6, 3.3, 2.2], [-5.4, 3.2, 2.4], [2.3, 1.1, 5.9], [2.4, 1.1, 5.9], 76, 72]], an, t, shake);
      } else { // beat 2, bedroom half: legs pop, hop off the dresser, run out
        cs = 1; legsOn = lt > .35; const pop = clamp((lt - .3) / .25);
        const jumpT = lt - 1.0; cp = V3(...DR); cry = DRY; ring = lt < 1.0 ? 1 : 0;
        if (jumpT > 0) { const u = clamp(jumpT / .9); cp.x = lerp(DR[0], -4.6, u); cp.z = lerp(DR[2], DR[2] - .5 - 0, u); const fall = clamp(jumpT / .28); cp.y = lerp(DR[1], .4, fall * fall) + (jumpT > .28 ? Math.abs(Math.sin(jumpT * 20)) * .12 : 0); cry = Math.atan2(-1, -.1) + Math.sin(jumpT * 7) * 0; run = true; ring = .6; }
        mm = 99; if (legsOn && !run) ctilt = 0;
        labelAt(lbClever, false, V3());
        const lgs = pop; an = {};
        // sleeper stays asleep in the lump
        RP.lie = Math.PI / 2; RP.x = 0; RP.y = 1.0; RP.z = 5.3; RP.yaw = 0;
        counter = ['ALARMS THAT RUN', '1']; hot = true; note = 'it has legs now';
        an = { cp }; rig(lt, [[0, [2.2, 2.2, 5.9], [2.8, 2.1, 6.4], [4.3, 1.5, 7.8], [4.3, 1.4, 7.8], 40, 36], [1.0, [5.2, 1.7, 5.4], [5.2, 1.8, 5.2], (a) => [a.cp.x - 1.2, .6, a.cp.z], (a) => [a.cp.x - 1.6, .6, a.cp.z], 62, 62]], an, t, 0);
      }
      // apply clock transform
      clock.position.copy(cp); clock.rotation.set(0, cry, ctilt); clock.scale.setScalar(cs * 1.2);
      setClock(t, { ring, tm: mm, legsOn, run });
      if (bi === 2) { clock.userData.legs.forEach((l, i) => { l.visible = legsOn; }); }
      if (handPos) { hand.visible = true; hand.position.copy(handPos); hand.rotation.set(0, -.3, 0); hand.scale.setScalar(1); }
      bed.blanket.userData.update(t, 0, 0, .09 * (Math.sin(t * 2.0) * .5 + .5));
      // people
      rcrowd.update(t);
      if (mask.visible) attach(mask, RP, 'head', [0, .0, .252]), mask.visible = true;
      // sleeper mask in bed (beats 0, 1, early 2)
      if (bi === 0 || (bi === 1 && lt < 2.3) || (bi === 2)) { attach(mask, RP, 'head', [0, .0, .252]); mask.visible = true; }
    } else {
      // ---------------- STREET beats
      const tg = bi === 2 ? lt - 1.9 : bi === 3 ? 6.35 + lt : 7.0 + 3 + lt;
      sc.setFace(bi === 4 ? 'calm' : 'shock');
      // neighbours
      const nb = [[-9.4, 22], [9.6, 30], [-9.8, 42], [9.3, 50], [-9.2, 58], [9.7, 66], [-9.6, 75]];
      const chaseZ = Math.min(zc(tg), ZS);
      for (let i = 1; i < 8; i++) { const o = SP[i]; const [x, z] = nb[i - 1]; place(o, x, 0.0, z, 0, 'idle', .5); const tx = xc(tg), tz = chaseZ; o.yaw = Math.atan2(tx - x, tz - z); o.scale = 1; o.h = .95 + cr(i, 8) * .12; o.arms = { lx: -.25, lz: -.1, rx: lt > 0 && bi === 2 && i % 2 ? -2.0 : -1.15, rz: .1 }; if (i % 2 === 0) o.arms = { lx: -1.2, lz: -.2, rx: -1.2, rz: .2 }; o.pitch = .05; }
      if (bi === 4) for (let i = 1; i < 8; i++) { const [x, z] = nb[i - 1]; SP[i].yaw = Math.atan2(XS - x, ZS - z); }
      let clockPos = V3(xc(tg), 1.02, zc(tg)); let clockRy = Math.PI, clockRx = 0, ctilt = 0; let legsOn = true, run = true; let youHand = false; let eyes = false; let droop = 0;
      if (bi === 2) {
        place(YOU, xyf(tg), 0, zyf(tg), Math.atan2(xc(tg) - xyf(tg), zc(tg) - zyf(tg)) * .5, 'sprint', 1.0); YOU.arms = null;
        clockPos.y = 1.02 + Math.abs(Math.sin(tg * 11)) * .1;
        dog.visible = tg > 2.2; if (dog.visible) { const dz = zyf(tg) - 7 + (tg - 2.2) * 8.6 + (tg > 2.2 ? 0 : 0); dog.position.set(-6.0 + Math.sin(tg) * .0, 0, Math.min(dz, zyf(tg) + 3)); dog.rotation.y = 0; dog.position.z = lerp(zyf(tg) - 14, zyf(tg) + 2, smooth((tg - 2.2) / 2.2)); dog.position.x = 2.6 + Math.sin(t * 2) * .2; dog.scale.setScalar(1.1); dog.userData.legs.forEach((l, i) => { l.rotation.x = Math.sin(t * 20 + (i % 2 ? 0 : Math.PI) + (i > 1 ? 1.5 : 0)) * .9; }); dog.userData.tail.rotation.z = Math.sin(t * 25) * .5; dog.position.y = Math.abs(Math.sin(t * 20)) * .1; }
        counter = ['BLOCKS CHASED', String(Math.min(14, Math.floor(Math.max(0, tg) * 2.2)))]; hot = tg > 0; note = tg < 3 ? 'it is faster than you' : 'pants: not found';
      } else if (bi === 3) {
        counter = ['AWAKENESS', lt < 1.76 ? String(Math.min(99, Math.round(20 + lt * 40))) + '%' : '100%']; hot = true; note = lt < 1.76 ? 'still catching' : 'eyes: open';
        const u = clamp((lt - .05) / .6); const dive = u < 1;
        if (lt < .05) { place(YOU, xyf(tg), 0, zyf(tg), 0, 'sprint', 1.0); }
        else { const z0 = zyf(6.35 + .05), z1 = ZS - 2.15; place(YOU, lerp(xyf(6.4), XS, smooth(u)), Math.sin(u * Math.PI) * 1.0 + lerp(0, .22, smooth(u)), lerp(z0, z1, u) + (lt > .65 ? Math.min(.6, (lt - .65) * 1.2) : 0), 0, 'sprint', 1.0); YOU.lie = -Math.PI / 2 * smooth(Math.min(1, u * 2.2)); YOU.arms = { lx: -2.9, lz: -.05, rx: -2.9, rz: .05 }; YOU.anim = 'idle'; YOU.extra = 0; if (lt > .7) { YOU.x = XS; YOU.y = .2; } }
        // clock: runs until pinned, then flails under hands, then lifted
        if (tg >= 7.0) { run = true; const tr = smooth((lt - .55) / .15); clockRx = -Math.PI / 2 * tr; clockRy = lerp(Math.PI, 0, tr); clockPos = V3(XS, lerp(1.02, .3, tr), ZS + .1); }
        if (lt > 1.2) { const up = smooth((lt - 1.2) / .7); YOU.lie = -Math.PI / 2 * (1 - up); YOU.y = lerp(.2, 0, up); YOU.z = lerp(ZS - 2.15 + .6, ZS - 1.0, up); YOU.arms = { lx: lerp(-2.9, -1.35, up), lz: lerp(-.05, -.15, up), rx: lerp(-2.9, -1.35, up), rz: lerp(.05, .15, up) }; YOU.anim = 'idle'; YOU.pitch = .1 * up; }
        if (lt > 1.2) { youHand = true; }
        if (lt > 1.7) eyes = true;
        ctilt = Math.sin(t * 24) * .25;
        if (lt > 1.2) { const up = smooth((lt - 1.2) / .7); clockRx = -Math.PI / 2 * (1 - up); clockPos.y = lerp(.3, 1.25, up); clockPos.z = lerp(ZS + .1, ZS - 1.0 + .45, up); clockPos.x = XS; ctilt = Math.sin(t * 24) * .25 * (1 - .3 * up); }
        cloud.visible = false;
      } else { // 4: saturday
        place(YOU, XS, 0, ZS - 1.0, Math.PI * 0, 'idle', .3); YOU.arms = { lx: -1.15, lz: -.1, rx: -1.15, rz: .1 }; const d = smooth(lt / .9); YOU.pitch = .1 + .3 * smooth((lt - .8) / .5); YOU.anim = 'idle'; eyes = true;
        youHand = true; legsOn = false; run = false; droop = smooth((lt - .7) / .5); clockPos = V3(XS, 1.25, ZS - 1.0 + .45); ctilt = 0;
        calG.visible = true; calG.position.set(XS, 0, ZS + 5.6); calG.rotation.y = 0; calG.scale.setScalar(.8);
        const cl = clamp((lt - .1) / .2); calG.position.y = lerp(5, 0, cl * cl);
        counter = ['DAYS OFF', '2']; hot = true; note = 'weekend: loading';
        cloud.visible = lt > .85; cloud.position.set(XS, 2.9, ZS - 1.0); cloud.userData.rain.forEach((d2, i) => { const p = ((t * 2.2 + i * .37) % 1); d2.position.set(-.45 + (i % 8) * .13, -.4 - p * 1.0, ((i * .31) % .4) - .2); d2.visible = true; });
      }
      // people update
      sc.update(t);
      if (YOU.vis) { boxers.visible = true; attach(boxers, YOU, 'torso', [0, -.4, 0]); boxers.visible = true; }
      if (eyes) { bulge.visible = true; attach(bulge, YOU, 'head', [0, .02, .24]); bulge.visible = true; bulge.matrix.scale(V3(bi === 4 ? 1.1 : 1.35, bi === 4 ? 1.1 : 1.35, 1.35)); }
      clock.visible = true;
      if (youHand && bi >= 3) { clock.matrixAutoUpdate = true; }
      clock.position.copy(clockPos); clock.position.x += OX; clock.rotation.set(clockRx, bi === 4 ? 0 : clockRy, ctilt); if (bi === 3 && lt >= 1.2) clock.rotation.y = 0; clock.scale.setScalar(1.7);
      setClock(t, { ring: bi === 4 ? 0 : (bi === 3 && lt > 1.9 ? 0 : .5), tm: 99, legsOn, run, droop });
      if (bi === 4) clock.userData.legs.forEach((l) => { l.rotation.x = .1; });
      // labels
      const hY = hp(YOU, 'head');
      labelAt(lbBetter, bi === 2 && lt > 2.64 && lt < 3.9, V3(clockPos.x + OX, clockPos.y + 1.4, clockPos.z + .3), 1.9, Math.min(1.1, (lt - 2.64) * 5));
      // camera
      const cxx = clockPos.x, czz = clockPos.z, yx = YOU.x, yz = YOU.z;
      A.follow(OX, bi === 2 ? chaseZ : ZS);
      if (bi === 2) {
        rig(lt, [[1.9, [-7.5, 1.5, 15.5], [-7.5, 1.5, 17.0], (a) => [0, 1.1, czz + 1.0], (a) => [0, 1.1, czz + 2.0], 60, 56], [3.3, (a) => [3.4, 4.6, yz - 9.5], (a) => [3.2, 4.2, yz - 8.0], (a) => [-.5, 1.0, yz + 4], (a) => [-.5, 1.0, yz + 5], 60, 56], [5.0, (a) => [9.0, 1.4, czz - 3.0], (a) => [9.0, 1.4, czz + 1.5], (a) => [0, 1.1, czz - 1.5], (a) => [0, 1.1, czz + .5], 62, 58], [6.3, (a) => [xc(tg) + 3.2, 1.0, yz - 4.2], (a) => [xc(tg) + 3.0, 1.05, yz - 3.8], (a) => [xc(tg) - .4, 1.0, yz + 3.0], (a) => [xc(tg) - .4, 1.0, yz + 3.4], 54, 52]], an, t, 0);
      } else if (bi === 3) {
        rig(lt, [[0, (a) => [-6.5, 1.3, YOU.z - 2.5], (a) => [-5.8, 1.1, YOU.z + 0.5], (a) => [YOU.x + .5, .8, YOU.z + 2.2], (a) => [XS, .7, ZS - .5], 58, 54], [1.0, (a) => [XS + 3.4, 1.4, ZS - 2.2], (a) => [XS + 3.0, 1.5, ZS - 2.4], (a) => [XS, .4, ZS - .8], (a) => [XS, .6, ZS - .8], 50, 46], [1.7, (a) => [XS + .2, 1.6, ZS + 3.6], (a) => [XS + .2, 1.55, ZS + 3.3], (a) => [XS, 1.4, ZS - 1.0], (a) => [XS, 1.4, ZS - 1.0], 48, 44]], an, t, 0);
      } else {
        rig(lt, [[0, [XS + .3, 3.0, ZS + .8], [XS + .3, 2.9, ZS + 1.0], [XS, 2.5, ZS + 5.6], [XS, 2.5, ZS + 5.6], 50, 48], [.85, [XS - 2.4, 1.9, ZS - 6.0], [XS - 2.2, 1.8, ZS - 5.6], [XS, 2.0, ZS + 2.4], [XS, 2.0, ZS + 2.6], 56, 54]], an, t, 0);
      }
    }
    A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    hud.counter(counter[0], counter[1], note, '', hot); hud.tm(''); hud.pop('', 0);
  } };
}
