import { drakeLook, makeBubble } from './_drake.js';
// What if Drake drove a city bus for 24 hours? Animated-MrBeast parody. Generic blocky people, no real likeness.
// 0 giant Drake at the wheel, 60 shocked people | 1 runner + waiting + "and your feelings?" | 2 40 MIN LATE, snacks passed along rows
// 3 group chat "Wheels On The Bus" | 4 final stop, everybody hugs Drake | 5 pull-back: still in the parking lot, odometer 0 MILES
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, tree, addBox, mat, building, car, Crowd, Particles, clamp, smooth, lerp, attach } = lib;
  const st = makeStage({ shadowExtent: 46, fogNear: 150, fogFar: 560, sunDir: [-.4, .9, -.5], sunI: 2.8, exposure: 1.08 }); const S = st.scene; ground(S, 0x7fb05a, 900);
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const plane = (w, h, tex, o = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: !!o.tr, side: THREE.DoubleSide, alphaTest: o.at ?? 0, opacity: o.op ?? 1, depthWrite: !o.tr })); S.add(m); return m; };
  const T4 = tl.beats[4].start, T5 = tl.beats[5].start;
  // ------------------------------------------------------------------ world: parking lot (looks like a street until the pull-back)
  const asphalt = new THREE.Mesh(new THREE.PlaneGeometry(110, 60), mat(0x3a3d44, { roughness: 1 })); asphalt.rotation.x = -Math.PI / 2; asphalt.position.y = .012; asphalt.receiveShadow = true; S.add(asphalt);
  const lot = new THREE.Group(); S.add(lot);
  for (let x = -27; x <= 27; x += 3) lot.add(addBox(S, x, .03, 0, .14, .02, 11, 0xf2f2f2, { cast: false }));
  for (const z of [-5.6, 5.6]) lot.add(addBox(S, 0, .03, z, 56, .02, .14, 0xf2f2f2, { cast: false }));
  for (const z of [-26, 26]) lot.add(addBox(S, 0, .25, z, 110, .5, .8, 0x9a9da3, { cast: false }));
  [-22.5, -19.5, -16.5, -13.5, -10.5, -7.5, 9, 12, 15, 18, 21].forEach((x, i) => { const c = car(S, x + (i % 2) * .15, i % 3 ? 1.2 : -.8, 0, [0xd9423a, 0x3a7bd9, 0xe8e8ec, 0x3a3f48, 0x4fb06a][i % 5]); lot.add(c); });
  [-1, 1].forEach((s) => [-40, -20, 0, 20, 40].forEach((x, i) => { if (s > 0) building(S, x, 36, 16 + (i % 3) * 3, 14 + ((i * 7) % 5) * 5, 14, [0xd9c9a8, 0xb8c6d9, 0xd9b8b8, 0xc9d9b8, 0xd8d0e0][i], i + 3); }));
  [-62, 62].forEach((x, i) => [-30, -8, 14].forEach((z, j) => building(S, x, z, 14, 16 + ((i + j) * 5) % 12, 14, [0xd9c9a8, 0xb8c6d9, 0xd9b8b8][j], 20 + i * 3 + j)));
  const scen = []; for (let i = 0; i < 12; i++) { const t = tree(S, 0, 11 + (i % 2) * 2.5, 1.4, i * 3 + 1); scen.push({ o: t, k: i * 6.6 }); }
  for (let i = 0; i < 8; i++) { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(.1, .14, 6, 8), mat(0x555a62)); p.position.y = 3; const h = new THREE.Mesh(new THREE.BoxGeometry(1.4, .22, .3), mat(0xfff0b0, { emissive: 0xffe9a0, emissiveIntensity: .5 })); h.position.set(.6, 6, 0); g.add(p, h); g.traverse((m) => (m.castShadow = true)); S.add(g); scen.push({ o: g, k: i * 10, z: 8 }); }
  const SPD = 24, NSTK = 70; const strk = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .55 }), NSTK); strk.frustumCulled = false; S.add(strk);
  const SK = []; { const r = lib.R(5); for (let i = 0; i < NSTK; i++) SK.push([r() * 90, .5 + r() * 6.5, (r() < .5 ? -1 : 1) * (4.5 + r() * 9), 1.5 + r() * 2.5]); }
  const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), v3 = new THREE.Vector3(), s3 = new THREE.Vector3();
  // ------------------------------------------------------------------ the bus (open-top cutaway so we can see 28 people)
  const busG = new THREE.Group(); S.add(busG); const YEL = 0xf5c518, BLU = 0x1d56c8, FL = .5;
  const bb = (x, y, z, w, h, d, c, o = {}) => addBox(busG, x, y, z, w, h, d, c, o);
  bb(.35, .42, 0, 12.8, .16, 3.7, 0x2b3038); bb(-1.2, .505, 0, 10, .02, .55, 0x4a4f5a, { cast: false });
  bb(-2.05, .75, -1.85, 7.9, .9, .12, YEL); bb(5.1, .75, -1.85, 3.2, .9, .12, YEL); bb(-2.05, 1.18, -1.86, 7.9, .14, .13, BLU); bb(5.1, 1.18, -1.86, 3.2, .14, .13, BLU);
  bb(.35, .75, 1.85, 12.8, .9, .12, YEL); bb(.35, 1.18, 1.86, 12.8, .14, .13, BLU); bb(-6, .75, 0, .12, .9, 3.7, YEL); bb(-6.02, 1.18, 0, .13, .14, 3.7, BLU);
  [-6, -3.9, -1.8, .3, 2.4, 4.5, 6.6].forEach((x) => bb(x, 2.45, 1.85, .18, 2.7, .18, BLU)); [-6, 6.6].forEach((x) => bb(x, 2.45, -1.85, .18, 2.7, .18, BLU)); bb(-6, 2.45, 0, .18, 2.7, .18, BLU);
  bb(.35, 3.9, 1.85, 12.8, .15, .15, BLU); bb(.35, 3.9, -1.85, 12.8, .15, .15, BLU); for (let x = -6; x <= 6.6; x += 2.1) bb(x, 3.9, 0, .15, .12, 3.7, BLU);
  bb(6.3, 1.0, 0, .8, 1.0, 3.7, 0x1c3f8f); bb(6.65, 2.65, -1.85, .14, 2.3, .14, BLU); bb(6.65, 2.65, 0, .14, 2.3, .14, BLU); bb(6.65, 3.8, 0, .18, .25, 3.7, BLU);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.3), new THREE.MeshBasicMaterial({ color: 0xbfe6ff, transparent: true, opacity: .1, side: THREE.DoubleSide, depthWrite: false })); glass.rotation.y = Math.PI / 2; glass.position.set(6.66, 2.65, 0); busG.add(glass);
  { const d = cvs(768, 160, (g, w, h) => { g.fillStyle = '#10151f'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffb534'; g.font = '900 96px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('CITY BUS  LINE 24', w / 2, 116); }); const dm = plane(3.4, .7, d.t); dm.rotation.y = Math.PI / 2; dm.position.set(6.78, 4.2, 0); busG.add(dm); }
  { const d = cvs(768, 128, (g, w, h) => { g.fillStyle = '#1d56c8'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 78px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('CITY TRANSIT', w / 2, 94); }); const dm = plane(4.4, .73, d.t); dm.position.set(-2.4, .74, -1.935); dm.rotation.y = Math.PI; busG.add(dm); }
  [-4.5, -2.4, -.3, 1.4].forEach((x) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 3.4, 8), mat(0xf5c518)); p.position.set(x, 2.2, 0); busG.add(p); });
  const wheels = []; [[-3.6, -1.95], [-3.6, 1.95], [4.4, -1.95], [4.4, 1.95]].forEach(([x, z]) => { const g = new THREE.Group(); const w = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, .34, 18), mat(0x1c1d20)); w.rotation.x = Math.PI / 2; const hub = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .36, 10), mat(0xc9ccd2, { metalness: .6, roughness: .3 })); hub.rotation.x = Math.PI / 2; const nub = new THREE.Mesh(new THREE.BoxGeometry(.5, .06, .4), mat(0xff3b3b)); g.add(w, hub, nub); g.position.set(x, .62, z); g.traverse((m) => (m.castShadow = true)); busG.add(g); wheels.push(g); });
  // door + step (near side, x 1.9..3.5)
  const doorG = new THREE.Group(); { const leaf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.6, .07), mat(0x5aa0e8, { roughness: .3 })); leaf.position.set(-.78, 1.8, 0); leaf.castShadow = true; const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.5, .12, .08), mat(0xf5c518)); stripe.position.set(-.78, 1.1, 0); doorG.add(leaf, stripe); doorG.position.set(3.5, 0, -1.85); busG.add(doorG); }
  busG.add(addBox(S, 2.7, .18, -2.3, 1.5, .36, .8, 0x6a6e78));
  // seats (blue benches facing +x)
  const COLX = []; for (let k = 0; k < 7; k++) COLX.push(-5 + 1.05 * k); const ROWZ = [-1.4, -.8, .8, 1.4]; const ST = FL + .5;
  COLX.forEach((cx, k) => [-1.1, 1.1].forEach((z) => { const c = k % 2 ? 0x2e56b8 : 0xe0891e; bb(cx, ST - .07, z, .7, .14, 1.3, c); bb(cx - .36, ST + .4, z, .12, .9, 1.3, c); bb(cx, FL + .22, z, .55, .44, 1.2, 0x2a2e38, { cast: false }); }));
  bb(3.4, ST - .07, .4, .9, .14, .9, 0x1c3f8f); bb(2.9, ST + .5, .4, .12, 1.1, .9, 0x1c3f8f); bb(3.4, FL + .22, .4, .75, .44, .8, 0x2a2e38, { cast: false });
  // clock board hung behind the bus (beat 2)
  const CK = cvs(1024, 512); const clockG = new THREE.Group(); { const back = new THREE.Mesh(new THREE.BoxGeometry(.3, 4.4, 8.4), mat(0x15181f)); back.position.set(-.05, 0, 0); const face = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), new THREE.MeshBasicMaterial({ map: CK.t })); face.rotation.y = Math.PI / 2; face.position.set(.12, 0, 0); clockG.add(back, face); for (const z of [-3.6, 3.6]) { const p = addBox(clockG, 0, -3.6, z, .3, 7, .3, 0x555a62); } clockG.position.set(-6.9, 5.9, 0); clockG.scale.setScalar(.8); S.add(clockG); }
  let ckKey = ''; const drawClock = (mins, late) => { const k = mins + '|' + late; if (k === ckKey) return; ckKey = k; const g = CK.g; g.fillStyle = '#10151f'; g.fillRect(0, 0, 1024, 512); g.strokeStyle = '#ffd92a'; g.lineWidth = 16; g.strokeRect(10, 10, 1004, 492);
    g.save(); g.translate(240, 256); g.fillStyle = '#f6f6f2'; g.beginPath(); g.arc(0, 0, 180, 0, 7); g.fill(); g.strokeStyle = '#111'; g.lineWidth = 10; g.stroke(); for (let i = 0; i < 12; i++) { g.save(); g.rotate(i * Math.PI / 6); g.fillStyle = '#111'; g.fillRect(-6, -168, 12, 28); g.restore(); }
    g.save(); g.rotate(-Math.PI / 3 + (mins / 60) * Math.PI / 6); g.fillStyle = '#111'; g.fillRect(-9, -100, 18, 100); g.restore(); g.save(); g.rotate((mins / 60) * Math.PI * 2); g.fillStyle = '#d62a2a'; g.fillRect(-6, -150, 12, 150); g.restore(); g.fillStyle = '#111'; g.beginPath(); g.arc(0, 0, 14, 0, 7); g.fill(); g.restore();
    g.textAlign = 'center'; g.fillStyle = '#9fe08a'; g.font = '800 60px Liberation Sans, Arial'; g.fillText('ARRIVAL 8:00', 700, 120); g.fillStyle = late ? '#ff3b2e' : '#ffffff'; g.font = '900 210px Liberation Sans, Arial'; g.fillText(String(mins), 640, 330); g.font = '900 78px Liberation Sans, Arial'; g.fillText('MIN LATE', 760, 440); CK.t.needsUpdate = true; };
  // ------------------------------------------------------------------ people. 0 Drake, 1 runner, 2..29 passengers (7 columns x 4 rows), 30..63 outside crowd
  const N = 64; const crowd = new Crowd(S, N, 61); const P = crowd.p;
  const look = drakeLook(lib, S, crowd, 0, { shirt: 0x1d56c8, pants: 0x14234d, coat: true }); const D = P[0]; D.h = 1; const RUN = P[1];
  const colr = (i, ks, c) => ks.forEach((k) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; });
  colr(1, ['torso', 'armL', 'armR'], 0x5a5f6b); colr(1, ['legL', 'legR'], 0x30343c);
  // Drake's transit extras: hi-vis vest, cap, own smug face (so he can stay calm while everyone else is shocked)
  const vest = new THREE.Mesh(new THREE.BoxGeometry(.6, .34, .345), mat(0xff8a1c)), vestS = new THREE.Mesh(new THREE.BoxGeometry(.61, .05, .35), mat(0xeaf3f0, { emissive: 0x888888 }));
  const cap = new THREE.Mesh(new THREE.BoxGeometry(.5, .14, .5), mat(0x15298a)), brim = new THREE.Mesh(new THREE.BoxGeometry(.44, .03, .22), mat(0x0e1c66)), badge = new THREE.Mesh(new THREE.BoxGeometry(.1, .08, .02), new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: .9, roughness: .25 }));
  const dfC = cvs(256, 192, (g) => { g.drawImage(crowd.faces.calm.image, 0, 0); g.clearRect(92, 148, 76, 30); g.strokeStyle = '#5a2a26'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.arc(128, 142, 34, .2 * Math.PI, .8 * Math.PI); g.stroke(); });
  const dface = new THREE.Mesh(new THREE.PlaneGeometry(.4, .3), new THREE.MeshBasicMaterial({ map: dfC.t, transparent: true, alphaTest: .3 }));
  [vest, vestS, cap, brim, badge, dface].forEach((m) => S.add(m)); vest.castShadow = true;
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(.72, .07, 8, 28), mat(0x15181f)); S.add(wheel); const hub = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .1, 12), mat(0xf5c518)); hub.rotation.z = Math.PI / 2; wheel.add(hub); const col = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, 1, 8), mat(0x2b3038)); S.add(col);
  const wq = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), .55).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2));
  const brief = new THREE.Mesh(new THREE.BoxGeometry(.55, .38, .12), mat(0x6a4426)); brief.castShadow = true; const clasp = new THREE.Mesh(new THREE.BoxGeometry(.08, .06, .13), mat(0xf2c230, { metalness: .8 })); brief.add(clasp); S.add(brief);
  const phones = new THREE.InstancedMesh(new THREE.BoxGeometry(.13, .22, .025), new THREE.MeshStandardMaterial({ color: 0xcfeaff, emissive: 0x9fd6ff, emissiveIntensity: 1.1 }), 28); phones.frustumCulled = false; S.add(phones);
  // snack bags + cookies passed along the rows
  const SNK = []; for (let j = 0; j < 16; j++) { const bag = j % 2 === 0; const m = new THREE.Mesh(bag ? new THREE.BoxGeometry(.3, .4, .1) : new THREE.CylinderGeometry(.17, .17, .05, 14), mat(bag ? [0xf2c230, 0xe84a3a, 0x3a9ee8, 0x4fd16a][(j / 2 | 0) % 4] : 0xb87a3e)); if (bag) { const b = new THREE.Mesh(new THREE.BoxGeometry(.24, .12, .11), mat(0xffffff)); b.position.y = .03; m.add(b); } m.castShadow = true; S.add(m); SNK.push(m); }
  const crumbs = new Particles(S, 120, 0xb87a3e, .035, { rough: .9 });
  const sweat = new Particles(S, 24, 0x9fdcff, .06, { rough: .1, emissive: 0x2a6a9a });
  const mkHeart = (c) => { const d = cvs(128, 128, (g) => { g.fillStyle = c; g.strokeStyle = '#fff'; g.lineWidth = 8; g.beginPath(); g.moveTo(64, 108); g.bezierCurveTo(8, 70, 18, 20, 64, 44); g.bezierCurveTo(110, 20, 120, 70, 64, 108); g.closePath(); g.fill(); g.stroke(); }); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: d.t, transparent: true, depthWrite: false })); sp.visible = false; S.add(sp); return sp; };
  const hearts = []; for (let i = 0; i < 20; i++) hearts.push(mkHeart(['#ff4a7a', '#ff2a5a', '#ff7aa8'][i % 3]));
  const mkChat = (txt) => { const d = cvs(192, 96, (g) => { g.fillStyle = '#34c759'; g.strokeStyle = '#fff'; g.lineWidth = 6; g.beginPath(); g.roundRect(8, 8, 176, 64, 22); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.font = '900 44px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText(txt, 96, 55); }); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: d.t, transparent: true, depthWrite: false })); sp.scale.set(.9, .45, 1); sp.visible = false; S.add(sp); return sp; };
  const chats = ['LOL', 'OMG', '!!!', 'HI', 'AWW', 'LOL', 'NO WAY', 'OMG', 'AWW', 'HI', '!!!', 'LOL'].map(mkChat);
  const BN = 70; const bills = new THREE.InstancedMesh(new THREE.BoxGeometry(.5, .02, .26), mat(0x4fc46a, { emissive: 0x1a6a30, emissiveIntensity: .5 }), BN); bills.frustumCulled = false; S.add(bills); const BL = []; { const r = lib.R(17); for (let i = 0; i < BN; i++) BL.push([(r() - .5) * 20, r() * 8, (r() - .5) * 14, 3.5 + r() * 3, r() * 6.28, 1 + r() * 3]); }
  // parking lot sign + odometer (revealed in the pull-back)
  const reveal = new THREE.Group(); S.add(reveal);
  { const pole = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, 7, 8), mat(0x666b73)); pole.position.set(15, 3.5, -9); pole.castShadow = true; reveal.add(pole);
    const pd = cvs(256, 256, (g) => { g.fillStyle = '#1d56c8'; g.fillRect(0, 0, 256, 256); g.strokeStyle = '#fff'; g.lineWidth = 14; g.strokeRect(10, 10, 236, 236); g.fillStyle = '#fff'; g.font = '900 210px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('P', 128, 205); });
    const pm = plane(3.2, 3.2, pd.t); pm.position.set(15, 6.7, -9.2); pm.rotation.y = Math.PI; reveal.add(pm);
    const td = cvs(512, 160, (g) => { g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 160); g.fillStyle = '#1d56c8'; g.font = '900 78px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('PARKING LOT', 256, 100); g.fillStyle = '#d62a2a'; g.font = '800 30px Liberation Sans, Arial'; g.fillText('BUSES PARK HERE', 256, 142); });
    const tm = plane(4.2, 1.3, td.t); tm.position.set(15, 4.2, -9.2); tm.rotation.y = Math.PI; reveal.add(tm);
    const od = cvs(1024, 512, (g) => { g.fillStyle = '#0b0e14'; g.fillRect(0, 0, 1024, 512); g.strokeStyle = '#ffd92a'; g.lineWidth = 18; g.strokeRect(12, 12, 1000, 488); g.textAlign = 'center'; g.fillStyle = '#ffd92a'; g.font = '800 70px Liberation Sans, Arial'; g.fillText('ODOMETER', 512, 100); g.fillStyle = '#17331f'; g.fillRect(70, 150, 884, 220); g.fillStyle = '#6dff8a'; g.font = '900 190px Liberation Sans, Arial'; g.fillText('0 MILES', 512, 320); g.fillStyle = '#ff4a3a'; g.font = '800 54px Liberation Sans, Arial'; g.fillText('SINCE STOP ONE', 512, 440); });
    const om = plane(7.2, 3.6, od.t); om.position.set(-9.5, 4.2, -9.4); om.rotation.y = Math.PI; reveal.add(om); for (const x of [-12.6, -6.4]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 4.4, 8), mat(0x666b73)); p.position.set(x, 2.2, -9.5); p.castShadow = true; reveal.add(p); } }
  const bD = makeBubble(lib, S, 2.8, 1.05), bP = makeBubble(lib, S, 3.4, 1.27), bQ = makeBubble(lib, S, 3.4, 1.27);
  // ------------------------------------------------------------------ static plans: seats, exit paths, hug slots
  const place = (o, x, z, yaw, anim = 'idle', sp = .4, sc = .95, y = 0) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.vis = true; o.scale = sc; };
  const sitY = (o, sc, st = ST) => st + .13 * sc * o.h - .8 * sc * o.h;
  const seatOf = (id) => { const i = id - 2, k = i >> 2, r = i & 3; return [COLX[k], ROWZ[r], k, r]; };
  const mkPath = (pts) => { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, cum, tot: cum[cum.length - 1] }; };
  const atPath = (pa, s) => { s = clamp(s, 0, pa.tot); let i = 1; while (i < pa.pts.length - 1 && s > pa.cum[i]) i++; const a = pa.pts[i - 1], b = pa.pts[i], d = pa.cum[i] - pa.cum[i - 1] || 1, u = (s - pa.cum[i - 1]) / d; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2(b[0] - a[0], b[1] - a[1])]; };
  const HC = [3.4, -5.2]; const rings = [[1.25, 8], [2.0, 14], [2.8, 19]]; const slots = []; rings.forEach(([r, n], ri) => { for (let j = 0; j < n; j++) { const ph = Math.PI / 2 + (j % 2 ? 1 : -1) * Math.ceil(j / 2) * (2 * Math.PI / n); slots.push({ x: HC[0] + Math.cos(ph + ri * .15) * r, z: HC[1] + Math.sin(ph + ri * .15) * r, ring: ri, ord: ri * 100 + j }); } });
  slots.sort((a, b) => a.ord - b.ord);
  const LEAVE = {}, EXIT = {}; const PSP = 4.6; const pids = []; for (let id = 2; id < 30; id++) pids.push(id);
  pids.forEach((id) => { const [x, z, k, r] = seatOf(id); LEAVE[id] = 1.95 + (6 - k) * .09 + (r % 2) * .05 + .03 * ((id * 7) % 5); });
  const order = pids.slice().sort((a, b) => LEAVE[a] - LEAVE[b]);
  order.forEach((id, n) => { const [x, z] = seatOf(id); const sl = slots[n]; const pts = [[x, z]]; if (z > 0) pts.push([x, 0], [2.65, 0]); else pts.push([2.65, z]); pts.push([2.7, -1.9], [2.7, -3.2], [sl.x, sl.z]); const pa = mkPath(pts); EXIT[id] = { pa, slot: sl, arrive: LEAVE[id] + pa.tot / PSP }; });
  const XT = []; for (let j = 0; j < 13; j++) { const sl = slots[28 + j]; XT.push({ id: 30 + j, sl, x0: -9.5 - (j % 5) * 1.5, z0: -6.5 - ((j / 5) | 0) * 1.7, go: 3.0 + j * .06 }); XT[j].arrive = XT[j].go + Math.hypot(sl.x - XT[j].x0, sl.z - XT[j].z0) / 7; }
  const DPATH = mkPath([[3.4, .4], [2.75, .1], [2.7, -1.9], [2.7, -3.3], [HC[0], HC[1]]]); const DGO = .55, DSP = 3.4;
  // cheering crowd (outside) grid
  const stopPos = (j) => j < 24 ? [-9.5 - (j % 6) * 1.5, -4.8 - ((j / 6) | 0) * 1.7] : [-8.5 - ((j - 24) % 5) * 1.6, 4.5 + (((j - 24) / 5) | 0) * 1.7];
  const POP = ['BUS DRIVER', 'HE WAITED', '40 MIN LATE', 'GROUP CHAT', 'GROUP HUG', '0 MILES'];
  const MSG = [[1.5, 'Greg', 'is anyone else crying or is that just me', 0], [2.35, 'Brenda', 'he said take as long as you need', 0], [3.0, 'Dev', 'my stop was 3 stops ago. im staying', 0], [3.7, 'Tammy', 'who has the cookies', 0], [4.35, 'Drake (driver)', 'all of you are valid. next stop: feelings', 1]];
  // phone overlay (beat 3), DOM
  const ph = document.createElement('div'); ph.style.cssText = 'position:absolute;left:600px;top:340px;width:430px;height:800px;z-index:6;display:none;border-radius:54px;background:#101114;border:10px solid #2a2d33;box-shadow:0 20px 60px rgba(0,0,0,.55);overflow:hidden;font-family:Liberation Sans,Arial,sans-serif;transform-origin:50% 50%';
  ph.innerHTML = '<div style="height:84px;background:#1f2127;color:#fff;padding:22px 24px 0;box-sizing:border-box"><div id="phT" style="font-weight:900;font-size:35px;line-height:1.05">Wheels On The Bus</div><div style="font-size:19px;color:#9aa0ab;margin-top:5px">31 members</div></div><div id="phM" style="padding:16px 14px;height:620px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;gap:10px"></div><div style="position:absolute;left:14px;right:14px;bottom:14px;height:50px;border-radius:25px;background:#23262d;color:#7c828d;font-size:22px;line-height:50px;padding-left:20px">Message</div>';
  document.body.appendChild(ph); const phM = ph.querySelector('#phM'), phT = ph.querySelector('#phT'); let phN = -1;
  const setPhone = (lt) => { const n = MSG.filter((m) => lt >= m[0]).length; if (n !== phN) { phN = n; phM.innerHTML = MSG.slice(0, n).map((m) => '<div style="align-self:' + (m[3] ? 'flex-end' : 'flex-start') + ';max-width:330px"><div style="font-size:17px;font-weight:700;color:' + (m[3] ? '#ffd23f' : '#8fb4ff') + ';margin:0 8px 3px">' + m[1] + '</div><div style="background:' + (m[3] ? '#1d56c8' : '#2d3038') + ';color:#fff;padding:11px 16px;border-radius:20px;font-size:25px;line-height:1.15;font-weight:600">' + m[2] + '</div></div>').join(''); }
    const pulse = 1 + .06 * Math.max(0, 1 - Math.abs(lt - 3.9) / .35); phT.style.transform = 'scale(' + pulse + ')'; phT.style.transformOrigin = '0 50%'; ph.style.transform = 'rotate(' + (3.5 + Math.sin(lt * 1.3) * 1.2) + 'deg) translateY(' + (Math.sin(lt * 2.1) * 6 + (1 - smooth(clamp((lt - .9) / .35))) * 1100) + 'px)'; };
  // camera keyframes [t, px,py,pz, tx,ty,tz, fov, roll]
  const kf = (keys, t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++; const a = keys[i], b = keys[i + 1]; const u = smooth(clamp((t - a[0]) / (b[0] - a[0]))); return a.slice(1).map((v, j) => lerp(v, b[j + 1], u)); };
  const CAMS = [
    [[0, -30, 26, -38, -2, 1.5, -3, 58, .06], [2.1, -5, 9.5, -16, 1.5, 2.2, -2.5, 50, -.04], [3.0, 14, 6.8, -8, 3, 2.7, -.5, 46, .05], [4.62, 10.5, 5.2, -3.4, 3.6, 2.5, .1, 40, -.05]],
    [[0, 5, 1.8, -8, -10, 1.4, -3.6, 44, .08], [2.6, 6, 2.2, -7.5, -1.5, 1.6, -3.4, 46, -.06], [3.2, 8.5, 3.0, -8.5, 2.9, 2.0, -1.2, 44, .05], [5.4, 8, 3.2, -7.5, 3.3, 2.9, .2, 42, -.04]],
    [[0, 14, 8.5, -4.5, -2, 2.6, .2, 56, -.05], [2.6, 10, 6.4, -3, -2.5, 3.2, 0, 48, .05], [3.6, 6.0, 5.0, -3.4, -1.0, 2.0, .2, 42, -.04], [6.16, 1.5, 5.2, -3.2, -3.5, 1.7, .3, 38, .06]],
    [[0, 16, 9, -2, -2, 1.5, -2.0, 54, .05], [5.4, 10.5, 6.8, -2.6, -2, 1.6, -2, 44, -.05]],
    [[0, 12, 4.8, -9, 2, 1.8, -1.5, 48, .05], [2.2, 8.5, 3.8, -8.8, 3, 1.5, -3, 44, -.05], [3.6, 9, 6.8, -11, 3.4, 2.6, -5.2, 46, .06], [6.93, 9.5, 8.6, -11, 3.4, 2.7, -5.2, 44, -.05]],
    [[0, 8, 6.8, -9.2, 3.4, 2.9, -5.2, 38, -.05], [1.7, 15, 13, -18, 2.5, 1.8, -3.5, 46, .05], [3.3, 24, 24, -33, 1, .8, -3, 54, -.04], [6.93, 28, 34, -43, 1.5, 0, -3, 56, .03]],
  ];
  const ptsHeld = new Set();
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); lt = p * [4.62, 5.38, 6.15, 5.38, 6.92, 6.92][bi]; const spd = bi < 4 ? 1 : bi === 4 ? Math.max(0, 1 - lt) : 0; const dist = SPD * (Math.min(t, T4) + (bi >= 4 ? Math.min(lt + (bi - 4) * 99, 1) - Math.min(lt + (bi - 4) * 99, 1) ** 2 / 2 : 0));
    for (let i = 0; i < N; i++) { P[i].vis = false; P[i].arms = null; P[i].pitch = 0; P[i].extra = 0; } [bD, bP, bQ].forEach((b) => b.hide());
    brief.visible = false; sweat.clear(); crumbs.clear(); SNK.forEach((m) => (m.visible = false)); hearts.forEach((h) => (h.visible = false)); chats.forEach((c) => (c.visible = false)); phones.count = 0; bills.count = 0; wheel.visible = col.visible = true;
    lot.visible = reveal.visible = bi === 5; clockG.visible = bi === 2; ph.style.display = bi === 3 && lt > .9 ? 'block' : 'none'; if (bi === 3) setPhone(lt);
    const bump = spd * (Math.sin(t * 37) * .014 + Math.sin(t * 23) * .01); busG.position.y = bump;
    wheels.forEach((w) => { w.rotation.z = -dist / .62; });
    const doorOpen = bi === 1 ? smooth(clamp((lt - 1.6) / .6)) : bi >= 2 ? 1 : 0; doorG.rotation.y = -1.5 * doorOpen;
    scen.forEach((s) => { s.o.position.x = 42 - ((s.k + dist) % 84); if (s.z) s.o.position.z = s.z; });
    for (let i = 0; i < NSTK; i++) { const k = SK[i]; const len = k[3] * 3 * spd; if (spd < .02) { strk.setMatrixAt(i, m4.makeScale(0, 0, 0)); continue; } v3.set(46 - ((k[0] + dist * 1.9) % 92), k[1], k[2]); s3.set(len, .05, .05); m4.compose(v3, q4, s3); strk.setMatrixAt(i, m4); } strk.instanceMatrix.needsUpdate = true;
    let face = 'shock', cam = kf(CAMS[bi], lt), cnt = ['', '', ''], hot = false;
    const drakeSeat = (sc = 1.9) => { place(D, 3.4, .4, Math.PI / 2, 'sit', .3, sc, sitY(D, sc) + bump); D.arms = { lx: -1.45, lz: .1, rx: -1.45, rz: -.1 }; };
    const pax = (fn) => { for (let id = 2; id < 30; id++) { const [x, z, k, r] = seatOf(id); const o = P[id]; place(o, x, z, Math.PI / 2, 'sit', .3, .95, sitY(o, .95) + bump); fn && fn(o, id, k, r); } };
    const shockArms = (o, a = 1) => { const w = Math.sin(t * 9 + o.phase * 3); o.arms = { lx: -2.75 + .3 * w, lz: -.2, rx: -2.75 - .3 * w, rz: .2 }; o.extra = .06 * a; };
    let showWheel = true;
    if (bi === 0) {
      drakeSeat(); D.yaw = Math.PI / 2 + .35 * smooth(clamp((lt - 2.5) / .8)); pax((o) => shockArms(o));
      for (let j = 0; j < 34; j++) { const [x, z] = stopPos(j), o = P[30 + j]; place(o, x, z, j < 24 ? Math.PI / 2 + .3 : -Math.PI / 2 + .3, 'jump', 1 + (j % 3) * .15, .95); }
      cnt = ['PASSENGERS', '28', 'one city bus'];
    } else if (bi === 1) {
      drakeSeat(); const turn = smooth(clamp((lt - 1.0) / .6)); D.yaw = lerp(Math.PI / 2, Math.PI * .86, turn); const wave = lt > 1.6 && lt < 3.4; if (lt > 1.0) D.arms = { lx: -1.45, lz: .1, rx: wave ? -2.1 + .45 * Math.sin(t * 9) : -1.0, rz: wave ? -.1 : -.3 };
      pax((o, id) => { const w = Math.sin(t * 7 + o.phase * 3); const up = lt > 3.6 || (id % 3 === 0); o.arms = up ? { lx: -2.7 + .3 * w, lz: -.2, rx: -2.7 - .3 * w, rz: .2 } : { lx: -.5, lz: -.1, rx: -.5, rz: .1 }; o.pitch = lt < 2.6 ? .15 : 0; });
      const run = clamp(lt / 2.7); const rx = lerp(-15, 2.5, run); const arrived = lt >= 2.7;
      if (!arrived) { place(RUN, rx, -3.7, Math.PI / 2, 'sprint', 1.05, 1.15); RUN.arms = { lx: -.2, lz: -.1, rx: -1.0, rz: .1 }; } else { place(RUN, 2.6, -2.9, Math.PI, 'bend', .6, 1.15); }
      attach(brief, RUN, 'handR', [0, -.45, 0], [0, 0, 0]);
      if (!arrived) for (let i = 0; i < 24; i++) { const u = ((t * 2.2 + i * .37) % 1); sweat.set(i, RUN.x - .3 - u * 1.2 + Math.sin(i) * .2, 2.4 - u * .9 + Math.cos(i * 2) * .2, RUN.z + Math.sin(i * 3) * .35, 1 - u * .5); } sweat.done();
      if (lt > 3.65) bD.show('and your feelings?', 3.4, 5.0, .2);
      cnt = ['STOP', '1', arrived ? 'waited for his feelings' : 'running late'];
    } else if (bi === 2) {
      const flip = lt < 3.0; face = flip ? 'shock' : 'calm'; drakeSeat(); D.yaw = Math.PI / 2 + .25; const flow = smooth(clamp((lt - 2.9) / .5));
      pax((o, id, k, r) => { const w = Math.sin(t * 6 + o.phase * 3); if (flip) shockArms(o); else { o.arms = { lx: -1.2 + .12 * w, lz: -.1, rx: -1.2 - .12 * w, rz: .1 }; o.pitch = .04 * Math.sin(t * 3 + o.phase); } });
      if (flow > 0) for (let j = 0; j < 16; j++) { const row = j % 4, lane = (j / 4) | 0; const s = (t * 1.5 + lane * 1.75 + row * .45) % 7; const rz = ROWZ[row]; const kk = Math.floor(s), u = s - kk; const xx = COLX[6 - kk] - u * 1.05 * (kk < 6 ? 1 : 0); const m = SNK[j]; m.visible = true; const yy = ST + .62 + Math.sin(u * Math.PI) * .45; m.position.set(xx, yy + bump, rz + .0); m.rotation.set(0, Math.PI / 2, Math.sin(t * 4 + j) * .3); m.scale.setScalar(flow * 1.9);
        if (u < .08 || u > .92) { /* handoff */ } for (let c = 0; c < 7; c++) { const idx = j * 7 + c, cu = ((t * 1.7 + c * .17 + j * .3) % 1); if (idx < 120) crumbs.set(idx, xx + Math.sin(idx * 5) * .2, yy - cu * 1.0, rz + Math.cos(idx * 3) * .25, cu < .9 ? 1 : 0); } } crumbs.done();
      if (lt > 4.7) bD.show('want a cookie?', COLX[3], 5.0, -1.1);
      cnt = ['LATE', String(Math.round(40 * smooth(clamp((lt - .4) / 2.0)))), lt > 3.3 ? 'nobody is mad' : 'minutes behind']; hot = lt < 3.3;
      drawClock(Math.round(40 * smooth(clamp((lt - .4) / 2.0))), lt < 3.3 ? 1 : 0);
    } else if (bi === 3) {
      face = 'calm'; drakeSeat(); D.yaw = Math.PI / 2 - .25 + Math.sin(lt * 1.5) * .1; phones.count = 28; let pn = 0;
      pax((o, id, k, r) => { const w = Math.sin(t * 5 + o.phase * 3); o.arms = { lx: -1.0, lz: -.1, rx: -1.35 + .05 * w, rz: .1 }; o.pitch = .3; });
      for (let id = 2; id < 30; id++) { const o = P[id]; m4.copy(o.M.handR); const tt = new THREE.Matrix4().makeTranslation(-.02, -.05, .12); m4.multiply(tt); m4.multiply(new THREE.Matrix4().makeRotationX(-.5)); const sc = new THREE.Matrix4().makeScale(.95, .95, .95); m4.multiply(sc); phones.setMatrixAt(pn++, m4); } phones.instanceMatrix.needsUpdate = true;
      chats.forEach((c, i) => { const u = ((lt * .75 + i * .31) % 1); const id = 2 + ((i * 9 + 5) % 28); const [x, z] = seatOf(id); c.visible = lt > 1.2; c.position.set(x, 3.3 + u * 1.6, z); c.material.opacity = Math.min(1, u * 6, (1 - u) * 4); c.scale.set(.95 * (.6 + .4 * Math.min(1, u * 5)), .47 * (.6 + .4 * Math.min(1, u * 5)), 1); });
      cnt = ['GROUP CHAT', String(MSG.filter((m) => lt >= m[0]).length + 26), 'messages'];
    } else if (bi === 4) {
      const brake = Math.sin(clamp(lt / 1.2) * Math.PI);
      // Drake gets off
      const ds = (lt - DGO) * DSP; if (ds <= 0) { drakeSeat(); D.arms = { lx: -1.45 - brake * .3, lz: .1, rx: -1.45 - brake * .3, rz: -.1 }; D.pitch = brake * .25; D.yaw = Math.PI / 2 + .25; }
      else { const [x, z, yw] = atPath(DPATH, ds); const sc = lerp(1.9, 2.2, smooth(clamp(ds / DPATH.tot))); const arr = ds >= DPATH.tot; const seatU = smooth(clamp(ds / .5)); place(D, x, z, arr ? Math.PI : yw, arr ? 'idle' : 'walk', .55, sc, lerp(sitY(D, 1.9), 0, seatU) + bump * (1 - seatU)); D.arms = arr ? { lx: 0, lz: -1.15 + Math.sin(t * 5) * .08, rx: 0, rz: 1.15 - Math.sin(t * 5) * .08 } : { lx: -.5, lz: -.2, rx: -.5, rz: .2 }; if (arr) D.yaw = Math.PI + Math.sin(t * 1.5) * .12; }
      let hugs = 0;
      for (const id of pids) { const o = P[id], e = EXIT[id], [x, z] = seatOf(id); const s = (lt - LEAVE[id]) * PSP;
        if (s <= 0) { place(o, x, z, Math.PI / 2, 'sit', .3, .95, sitY(o, .95) + bump); o.pitch = brake * .5; o.arms = lt < 1.6 ? { lx: -2.75, lz: -.2, rx: -2.75, rz: .2 } : { lx: -.5, lz: -.1, rx: -.5, rz: .1 }; if (lt < .6) shockArms(o); }
        else if (s < e.pa.tot) { const [px, pz, yw] = atPath(e.pa, s); const up = smooth(clamp(s / .35)); const gy = pz > -1.95 ? FL : lerp(FL, 0, clamp((-1.95 - pz) / 1.2)); place(o, px, pz, yw, 'walk', 1.6, .95, lerp(sitY(o, .95), gy, up)); o.arms = { lx: -2.5, lz: -.2, rx: -2.5, rz: .2 }; }
        else { const sl = e.slot; hugs++; place(o, sl.x, sl.z, Math.atan2(HC[0] - sl.x, HC[1] - sl.z), 'idle', .5, .95, Math.abs(Math.sin(t * (5 + (id % 4)) + o.phase)) * (sl.ring ? .16 : .05)); o.arms = sl.ring === 0 ? { lx: -1.55, lz: -.2, rx: -1.55, rz: .2 } : { lx: -2.7 + .2 * Math.sin(t * 7 + o.phase), lz: -.2, rx: -2.7 - .2 * Math.sin(t * 7 + o.phase), rz: .2 }; o.pitch = sl.ring === 0 ? .12 : 0; } }
      XT.forEach((e) => { const o = P[e.id]; if (lt < e.go) place(o, e.x0, e.z0, Math.PI / 2, 'jump', 1.1, .95); else if (lt < e.arrive) { const u = (lt - e.go) / (e.arrive - e.go); place(o, lerp(e.x0, e.sl.x, u), lerp(e.z0, e.sl.z, u), Math.atan2(e.sl.x - e.x0, e.sl.z - e.z0), 'run', 1.0, .95); o.arms = null; } else { hugs++; place(o, e.sl.x, e.sl.z, Math.atan2(HC[0] - e.sl.x, HC[1] - e.sl.z), 'idle', .5, .95, Math.abs(Math.sin(t * 6 + o.phase)) * .15); o.arms = { lx: -2.7, lz: -.2, rx: -2.7, rz: .2 }; } });
      for (let j = 13; j < 34; j++) { const [x, z] = stopPos(j); place(P[30 + j], x, z, Math.PI / 2 + .6, 'jump', 1 + (j % 3) * .15, .95); }
      if (lt > 5.0) bP.show('one more hug', 3.4, 6.7, -5.2); if (lt > 6.0) bQ.show('ok one more', 3.4, 8.3, -5.2);
      const hu = hugs + (D.vis && lt > 3 ? 1 : 0); cnt = ['HUGS', String(hugs), lt > 4.6 ? 'nobody wants to leave' : 'everyone gets off'];
      hearts.forEach((h, i) => { const u = ((t * .8 + i * .17) % 1); h.visible = lt > 3.4; h.position.set(HC[0] + Math.sin(i * 2.3) * 2.4, 4 + u * 3.4, HC[1] + Math.cos(i * 1.9) * 2.4); h.scale.setScalar(.7 * Math.min(1, u * 5) * (1 - u * .4)); h.material.opacity = Math.min(1, (1 - u) * 3); });
    } else {
      const sc = 2.2; place(D, HC[0], HC[1], Math.PI + Math.sin(t * 1.5) * .12, 'idle', .5, sc, 0); D.arms = { lx: 0, lz: -1.15 + Math.sin(t * 5) * .08, rx: 0, rz: 1.15 - Math.sin(t * 5) * .08 };
      for (const id of pids) { const o = P[id], sl = EXIT[id].slot; place(o, sl.x, sl.z, Math.atan2(HC[0] - sl.x, HC[1] - sl.z), 'idle', .5, .95, Math.abs(Math.sin(t * (5 + (id % 4)) + o.phase)) * (sl.ring ? .16 : .05)); o.arms = sl.ring === 0 ? { lx: -1.55, lz: -.2, rx: -1.55, rz: .2 } : { lx: -2.7 + .2 * Math.sin(t * 7 + o.phase), lz: -.2, rx: -2.7 - .2 * Math.sin(t * 7 + o.phase), rz: .2 }; o.pitch = sl.ring === 0 ? .12 : 0; }
      XT.forEach((e) => { const o = P[e.id]; place(o, e.sl.x, e.sl.z, Math.atan2(HC[0] - e.sl.x, HC[1] - e.sl.z), 'idle', .5, .95, Math.abs(Math.sin(t * 6 + o.phase)) * .15); o.arms = { lx: -2.7, lz: -.2, rx: -2.7, rz: .2 }; });
      for (let j = 13; j < 34; j++) { const [x, z] = stopPos(j); place(P[30 + j], x, z, Math.PI / 2 + .6, 'jump', 1 + (j % 3) * .15, .95); }
      hearts.forEach((h, i) => { const u = ((t * .8 + i * .17) % 1); h.visible = true; h.position.set(HC[0] + Math.sin(i * 2.3) * 2.4, 4 + u * 3.4, HC[1] + Math.cos(i * 1.9) * 2.4); h.scale.setScalar(.7 * Math.min(1, u * 5) * (1 - u * .4)); h.material.opacity = Math.min(1, (1 - u) * 3); });
      const mt = -1; if (mt > 0) { bills.count = BN; for (let i = 0; i < BN; i++) { const b = BL[i]; const y = 26 + b[1] - (mt + b[5] * .0) * b[3] * 2.2 - (b[0] > 0 ? 0 : 0); const yy = y < .1 ? .05 : y; q4.setFromEuler(new THREE.Euler(t * b[5] + b[4], t * b[5] * .7, b[4])); v3.set(HC[0] + b[0] * 1.2, yy, HC[1] + b[2]); s3.set(1, 1, 1); m4.compose(v3, y < .1 ? new THREE.Quaternion().setFromEuler(new THREE.Euler(0, b[4], 0)) : q4, s3); bills.setMatrixAt(i, m4); } bills.instanceMatrix.needsUpdate = true; }
      cnt = ['MILES DRIVEN', '0', 'never left the lot']; hot = true;
    }
    // Drake wheel + accessories
    crowd.setFace(face); crowd.update(t); look.update(); look.setVisible(D.vis);
    crowd.parts.face.setMatrixAt(0, m4.makeScale(0, 0, 0)); crowd.parts.face.instanceMatrix.needsUpdate = true;
    attach(vest, D, 'torso', [0, -.1, 0]); attach(vestS, D, 'torso', [0, -.03, 0]); attach(cap, D, 'head', [0, .24, -.01]); attach(brim, D, 'head', [0, .18, .27], [.1, 0, 0]); attach(badge, D, 'head', [0, .26, .25]); attach(dface, D, 'head', [0, -.03, .226]);
    const seated = bi <= 3 || (bi === 4 && lt < DGO + .3);
    wheel.visible = col.visible = seated; if (seated) { const hl = new THREE.Vector3().setFromMatrixPosition(D.M.handL), hr = new THREE.Vector3().setFromMatrixPosition(D.M.handR); wheel.position.copy(hl).add(hr).multiplyScalar(.5); wheel.quaternion.copy(wq); const a = wheel.position, b = new THREE.Vector3(6.0, 1.15, a.z); const dir = b.clone().sub(a); col.position.copy(a).add(b).multiplyScalar(.5); col.scale.set(1, dir.length(), 1); col.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()); }
    const hh = (a, f, ph0) => Math.sin(t * f + ph0) * a;
    st.cam(cam[0] + hh(.05, 3.1, 0), cam[1] + hh(.05, 2.3, 1), cam[2] + hh(.05, 2.7, 2), cam[3], cam[4], cam[5], cam[6], cam[7]);
    st.follow(2, -3); st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if *Drake* became your bus driver?' : '', bi === 0 ? 1 : 0); hud.counter(cnt[0], cnt[1], cnt[2], 'PARODY', hot || bi === 5); hud.tm('');
    hud.pop(lt > .45 ? POP[bi] : '', Math.min(1, (lt - .45) * 6));
  } };
}
