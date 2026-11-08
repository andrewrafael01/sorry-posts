// "Don't Laugh" MrBeast-style competition: 100 blocky people, one rule, last one standing wins $100,000. Non-explicit; own arena/stage/props.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, Crowd, Particles, R, clamp, smooth, lerp, RoundedBoxGeometry } = lib;
  const r = R(652);
  const SY = 0.6; // stage top height
  const st = makeStage({ shadowExtent: 62, fogNear: 140, fogFar: 520, clouds: false, skyTop: 0x080c26, skyMid: 0x18246a, skyBot: 0x3a4aa6, fog: 0x1a2562, sunColor: 0xfff0e0, sunDir: [-.25, 1, -.45], sunI: 2.5, hemi: 1.25, hemiSky: 0xdde6ff, hemiGround: 0x8a7fb0, exposure: 1.0 });
  const S = st.scene;
  const M = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .7 }, o));
  const box = (p, x, y, z, w, h, d, c, o = {}) => { const m = new THREE.Mesh(o.round ? new RoundedBoxGeometry(w, h, d, 3, o.round) : new THREE.BoxGeometry(w, h, d), o.mat || M(c, o.m)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; p.add(m); return m; };
  const cnv = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); fn(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const strokeText = (g, s, x, y, size, fill, line = 14) => { g.font = `900 ${size}px Liberation Sans, Arial`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = line; g.strokeStyle = '#111'; g.strokeText(s, x, y); g.fillStyle = fill; g.fillText(s, x, y); };
  const sign = (p, w, h, x, y, z, ry, tex, emis = .0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: .6, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: emis })); m.position.set(x, y, z); m.rotation.y = ry; p.add(m); return m; };

  // ------------------------------------------------------------------ arena
  const floorTex = cnv(1024, 1024, (g, w, h) => { const n = 16; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = (i + j) % 2 ? '#8d99cc' : '#7684b8'; g.fillRect(i * w / n, j * h / n, w / n + 1, h / n + 1); } });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), new THREE.MeshStandardMaterial({ map: floorTex, roughness: .5, metalness: .05 })); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, 8); floor.receiveShadow = true; S.add(floor);
  const ring = new THREE.Mesh(new THREE.RingGeometry(21, 22.2, 64), new THREE.MeshBasicMaterial({ color: 0xe8252b })); ring.rotation.x = -Math.PI / 2; ring.position.set(0, .02, -2); S.add(ring);
  // bleachers (back and sides)
  for (let k = 0; k < 7; k++) {
    const h = (k + 1) * 1.15; box(S, 0, h / 2, -27 - k * 2.6, 130, h, 2.6, k % 2 ? 0x1c2b6b : 0x24378a, { cast: false });
    for (const sd of [-1, 1]) box(S, sd * (40 + k * 2.6), h / 2, 8, 2.6, h, 90, k % 2 ? 0x1c2b6b : 0x24378a, { cast: false });
    const sm = M(k % 2 ? 0xd8362f : 0xf2b632, { roughness: .9 });
    for (let i = -24; i <= 24; i++) { box(S, i * 2.4, h + .18, -27.6 - k * 2.6, 1.8, .36, .9, 0, { mat: sm, cast: false }); }
  }
  // light towers + sweeping beams
  const beams = []; const bm = new THREE.MeshBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: .02, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  for (let i = 0; i < 6; i++) { const sx = (i % 2 ? 1 : -1) * 34, sz = -22 + Math.floor(i / 2) * 26; box(S, sx, 14, sz, 1.4, 28, 1.4, 0x2a2f45); box(S, sx, 28.6, sz, 5, 2, 1, 0xffffff, { m: { emissive: 0xfff4d0, emissiveIntensity: 2 }, cast: false });
    const g = new THREE.Mesh(new THREE.CylinderGeometry(.5, 6, 60, 20, 1, true), bm); g.frustumCulled = false; S.add(g); beams.push({ g, sx, sz, ph: i * 1.3 }); }
  // giant banner + DON'T LAUGH backdrop sign (behind crowd, facing +z)
  const banner = cnv(1024, 340, (g, w, h) => { g.fillStyle = '#d8232a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 14; g.strokeRect(14, 14, w - 28, h - 28); strokeText(g, 'LAST ONE WINS', w / 2, 92, 120, '#fff', 16); strokeText(g, '$100,000', w / 2, 240, 170, '#ffe23a', 22); });
  sign(S, 27, 9, 0, 15.5, -21, 0, banner, .35); box(S, -14.5, 10, -21.3, .6, 20, .6, 0x2a2f45); box(S, 14.5, 10, -21.3, .6, 20, .6, 0x2a2f45);
  const dl = (ry) => cnv(1024, 320, (g, w, h) => { g.fillStyle = '#ffe23a'; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; g.fillRect(0, 0, w, 16); g.fillRect(0, h - 16, w, 16); strokeText(g, "DON'T LAUGH", w / 2 + 70, h / 2 + 4, 150, '#e8252b', 18); g.save(); g.translate(120, h / 2); g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 92, 0, 7); g.fill(); g.strokeStyle = '#111'; g.lineWidth = 8; g.stroke(); g.fillStyle = '#111'; g.fillRect(-38, -36, 14, 26); g.fillRect(24, -36, 14, 26); g.beginPath(); g.arc(0, 8, 46, .15, Math.PI - .15); g.lineWidth = 11; g.stroke(); g.strokeStyle = '#e8252b'; g.lineWidth = 18; g.beginPath(); g.arc(0, 0, 92, 0, 7); g.moveTo(-65, -65); g.lineTo(65, 65); g.stroke(); g.restore(); });
  sign(S, 18, 5.6, 0, 6.5, -21.1, 0, dl(), .3);

  // podium + giant open briefcase of cash
  const mkCase = (open) => { const g = new THREE.Group(); const bodyM = M(0x5a3a22, { roughness: .45 }), gold = M(0xf2c230, { metalness: .8, roughness: .25 });
    box(g, 0, .14, 0, 1.3, .28, .86, 0, { mat: bodyM, round: .04 }); box(g, 0, .27, 0, 1.12, .04, .68, 0x2d1d10);
    const bill = M(0x56c466, { roughness: .6 }), band = M(0xeaf3da, { roughness: .8 });
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const sx = -.42 + i * .28, sz = -.2 + j * .22; box(g, sx, .36, sz, .25, .16, .19, 0, { mat: bill }); box(g, sx, .36, sz, .08, .165, .195, 0, { mat: band }); }
    const lid = new THREE.Group(); lid.position.set(0, .28, -.43); g.add(lid); box(lid, 0, .0, .42, 1.3, .06, .86, 0, { mat: bodyM, round: .02 }); box(lid, 0, .04, .42, 1.1, .02, .66, 0x2d1d10);
    lid.rotation.x = open ? -1.75 : 0; lid.position.z = -.43; g.userData.lid = lid; box(g, -.3, .28, .43, .12, .05, .05, 0, { mat: gold }); box(g, .3, .28, .43, .12, .05, .05, 0, { mat: gold }); box(g, 0, .1, .44, .26, .12, .05, 0, { mat: gold }); return g; };
  const podium = new THREE.Group(); podium.position.set(0, 0, 15); S.add(podium); box(podium, 0, .7, 0, 2.6, 1.4, 2.0, 0x1b1f3a, { round: .1 }); box(podium, 0, 1.43, 0, 2.9, .12, 2.3, 0xf2c230, { m: { metalness: .8, roughness: .25 } }); box(podium, 0, .25, 1.05, 2.0, .3, .05, 0xf2c230, { m: { metalness: .8, roughness: .3 }, cast: false });
  const bigCase = mkCase(true); bigCase.scale.setScalar(2.4); bigCase.position.set(0, 1.5, 0); podium.add(bigCase);
  const cashGlow = new THREE.PointLight(0xffe08a, 40, 18); cashGlow.position.set(0, 4.2, 15.8); S.add(cashGlow);
  const spot = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 3, 17, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: .13, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); spot.position.set(0, 9, 15); S.add(spot);

  // stage (finale area) at z=31
  const stage = new THREE.Group(); S.add(stage); box(stage, 0, SY / 2, 31, 28, SY, 14, 0x7a1220, { round: .05 }); box(stage, 0, SY + .01, 31, 26, .03, 12, 0xb01c2e); box(stage, 0, SY / 2, 24.05, 28, .25, .15, 0xf2c230, { m: { metalness: .8, roughness: .3 } });
  const curtain = new THREE.Mesh(new THREE.PlaneGeometry(46, 15), new THREE.MeshStandardMaterial({ color: 0x4c0f1d, roughness: .95 })); curtain.position.set(0, 7.5, 37.2); curtain.rotation.y = Math.PI; S.add(curtain);
  for (let i = -11; i <= 11; i++) box(stage, i * 2, 7.5, 37.0, .25, 15, .2, 0x3a0a16, { cast: false });
  sign(S, 24, 7.5, 0, 12.5, 36.9, Math.PI, dl(), .35);
  for (let i = -6; i <= 6; i++) box(stage, i * 3.4, 4.2, 36.8, .25, .25, .2, 0xfff0b0, { m: { emissive: 0xffd870, emissiveIntensity: 2 }, cast: false });
  const stageLight = new THREE.PointLight(0xfff0d0, 60, 40); stageLight.position.set(0, 9, 28); S.add(stageLight);
  // news set
  const news = new THREE.Group(); S.add(news);
  box(news, 0, SY + .65, 29.3, 4.6, 1.3, 1.0, 0x1a3a8a, { round: .05 }); box(news, 0, SY + 1.33, 29.3, 4.9, .1, 1.2, 0xe8e8ee);
  const nTex = cnv(512, 160, (g, w, h) => { g.fillStyle = '#d8232a'; g.fillRect(0, 0, w, h); strokeText(g, 'GOAT NEWS 9', w / 2, h / 2, 90, '#fff', 12); });
  sign(news, 4.2, 1.0, 0, SY + .65, 28.78, Math.PI, nTex, .3);
  const bTex = cnv(1024, 340, (g, w, h) => { g.fillStyle = '#10205a'; g.fillRect(0, 0, w, h); g.fillStyle = '#d8232a'; g.fillRect(0, 190, w, 150); strokeText(g, 'BREAKING NEWS', w / 2, 90, 120, '#fff', 12); strokeText(g, 'NOTHING IS FUNNY', w / 2, 265, 84, '#ffe23a', 10); });
  sign(news, 12, 4, 0, SY + 4.6, 34, Math.PI, bTex, .5);
  box(news, .9, SY + 1.7, 29.1, .06, .5, .06, 0x222222); box(news, .9, SY + 2.0, 29.1, .14, .2, .14, 0x222222, { round: .05 });
  const goat = new THREE.Group(); goat.position.set(0, SY, 31.4); goat.rotation.y = Math.PI; news.add(goat);
  { const tux = M(0x14141a, { roughness: .6 }), cream = M(0xf0e6d0), dark = M(0x2a2a30), yel = M(0xf2d03c, { roughness: .4 }), horn = M(0xcdbf9a, { roughness: .5 });
    box(goat, 0, 1.4, 0, 1.4, 1.55, .9, 0, { mat: tux, round: .1 }); box(goat, 0, 1.45, .46, .5, 1.25, .05, 0xffffff); box(goat, -.07, 1.95, .5, .22, .18, .06, 0xd8232a); box(goat, .15, 1.95, .5, .22, .18, .06, 0xd8232a); box(goat, .04, 1.95, .53, .1, .1, .06, 0xa01820);
    box(goat, -.3, .45, 0, .45, .9, .5, 0, { mat: tux }); box(goat, .3, .45, 0, .45, .9, .5, 0, { mat: tux });
    box(goat, 0, 2.3, 0, .5, .35, .5, 0, { mat: cream });
    const head = new THREE.Group(); head.position.set(0, 2.9, .05); goat.add(head); goat.userData.head = head;
    box(head, 0, 0, 0, .95, 1.0, .85, 0, { mat: cream, round: .1 }); box(head, 0, -.18, .55, .55, .5, .55, 0, { mat: M(0xe6d8bc), round: .06 }); box(head, 0, -.05, .84, .26, .18, .1, 0, { mat: dark, round: .04 });
    const jaw = new THREE.Group(); jaw.position.set(0, -.34, .4); head.add(jaw); goat.userData.jaw = jaw; box(jaw, 0, -.04, .22, .5, .12, .5, 0, { mat: M(0xe6d8bc) }); box(jaw, 0, -.3, .1, .2, .4, .2, 0, { mat: cream, rx: .2 });
    for (const sd of [-1, 1]) { box(head, sd * .25, .17, .43, .26, .17, .06, 0, { mat: M(0xfffbe8) }); box(head, sd * .25, .17, .465, .19, .05, .05, 0x111111); box(head, sd * .62, .3, -.05, .5, .13, .3, 0, { mat: cream, rz: sd * .35 });
      const hm = new THREE.Mesh(new THREE.ConeGeometry(.15, 1.0, 10), horn); hm.position.set(sd * .32, .8, -.12); hm.rotation.set(-.35, 0, -sd * .28); hm.castShadow = true; head.add(hm); const hm2 = new THREE.Mesh(new THREE.ConeGeometry(.09, .45, 8), horn); hm2.position.set(sd * .43, 1.3, -.32); hm2.rotation.set(-.9, 0, -sd * .5); head.add(hm2);
      const arm = box(goat, sd * .82, 1.65, .35, .3, .3, 1.15, 0, { mat: tux, rx: -.35 }); box(goat, sd * .82, 1.35, .88, .34, .2, .26, 0, { mat: dark }); }
    box(goat, 0, 1.55, .85, 1.2, .04, .8, 0xffffff, { rx: -.15 }); }
  const micGlow = null;

  // ------------------------------------------------------------------ faces for the extra expressions
  const ink = '#10151c', brow = '#3a2417';
  const mkFace = (kind) => cnv(256, 192, (g) => { const eyeOpen = (x, w, h, pup) => { g.fillStyle = '#f4f4f0'; g.fillRect(x - w / 2, 84 - h / 2, w, h); g.fillStyle = '#3b6ea5'; g.fillRect(x - 10, 84 - 10, 20, 20); g.fillStyle = ink; g.fillRect(x - pup / 2, 84 - pup / 2, pup, pup); };
    const brw = (x, rot, y) => { g.save(); g.fillStyle = brow; g.translate(x, y); g.rotate(rot); g.fillRect(-28, -6, 56, 11); g.restore(); };
    g.fillStyle = 'rgba(120,70,40,.28)'; g.fillRect(120, 90, 16, 40); g.fillRect(108, 126, 40, 10);
    if (kind === 'laugh') { g.strokeStyle = ink; g.lineWidth = 12; g.lineCap = 'round'; for (const x of [78, 178]) { g.beginPath(); g.arc(x, 98, 24, Math.PI * 1.12, Math.PI * 1.88); g.stroke(); } brw(78, -.2, 44); brw(178, .2, 44); g.fillStyle = '#5a1c1c'; g.beginPath(); g.moveTo(70, 134); g.lineTo(186, 134); g.lineTo(168, 188); g.lineTo(88, 188); g.fill(); g.fillStyle = '#fff'; g.fillRect(76, 134, 104, 14); g.fillStyle = '#e0697a'; g.fillRect(100, 172, 56, 15); g.fillStyle = '#6cc6ff'; for (const x of [52, 204]) { g.fillRect(x - 6, 98, 12, 34); g.fillRect(x - 6 + (x < 100 ? -8 : 8), 120, 10, 22); } }
    else if (kind === 'grin') { eyeOpen(78, 44, 34, 12); eyeOpen(178, 44, 34, 12); brw(78, -.15, 40); brw(178, .15, 40); g.strokeStyle = '#d8232a'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.arc(128, 120, 54, .25, Math.PI - .25); g.stroke(); g.fillStyle = '#d8232a'; g.fillRect(40, 66, 8, 8); }
    else { eyeOpen(78, 44, 40, 12); eyeOpen(178, 44, 40, 12); brw(78, .22, 40); brw(178, -.22, 40); g.fillStyle = 'rgba(238,150,130,.95)'; g.beginPath(); g.arc(46, 130, 34, 0, 7); g.fill(); g.beginPath(); g.arc(210, 130, 34, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(34, 112, 14, 10); g.fillRect(200, 112, 14, 10); g.strokeStyle = '#7a3f34'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(104, 160); g.lineTo(120, 154); g.lineTo(136, 162); g.lineTo(152, 156); g.stroke(); g.fillStyle = '#6cc6ff'; g.fillRect(122, 28, 14, 26); } });
  const FLAUGH = mkFace('laugh'), FGRIN = mkFace('grin'), FPUFF = mkFace('puff');

  // ------------------------------------------------------------------ people
  const colorize = (c, i, o) => { for (const [k, v, parts] of [['shirt', o.shirt, ['torso', 'armL', 'armR']], ['pants', o.pants, ['legL', 'legR']], ['skin', o.skin, ['handL', 'handR', 'head', 'neck']], ['hair', o.hair, ['hair']]]) if (v !== undefined) { const col = new THREE.Color(v); c.p[i][k].copy(col); for (const pn of parts) { c.parts[pn].setColorAt(i, col); c.parts[pn].instanceColor.needsUpdate = true; } } };
  const A = new Crowd(S, 100, 21), B = new Crowd(S, 100, 21); B.faces.laugh = FLAUGH; B.setFace('laugh'); A.faces.puff = FPUFF;
  const HD = new Crowd(S, 1, 41), HR = new Crowd(S, 2, 31), HC = new Crowd(S, 1, 5), HB = new Crowd(S, 1, 17);
  HD.faces.puff = FPUFF; HD.faces.laugh = FLAUGH; HC.faces.grin = FGRIN; HC.setFace('grin'); HB.faces.laugh = FLAUGH;
  colorize(HD, 0, { shirt: 0x2d7be0, pants: 0x1c2b4a, skin: 0xe8b890, hair: 0x4a2c14 }); colorize(HR, 0, { shirt: 0xe9e9ee, pants: 0x2a2a30 }); colorize(HR, 1, { shirt: 0x15151b, pants: 0x15151b, skin: 0xd9a37c, hair: 0x1a1a1a });
  colorize(HC, 0, { shirt: 0x7a2bd6, pants: 0xe8252b, skin: 0xf7f2ea, hair: 0xff7a1a }); colorize(HB, 0, { shirt: 0xf2762e, pants: 0x2c3e66 });
  // grid
  const cells = []; for (let rr = 0; rr < 10; rr++) for (let c = 0; c < 10; c++) cells.push([(c - 4.5) * 2.35, -12.5 + rr * 2.25]);
  const DAVE_CELL = 8 * 10 + 5, RIV_CELL = 8 * 10 + 4; const rest = cells.filter((_, i) => i !== DAVE_CELL && i !== RIV_CELL); for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
  const pos = []; for (let i = 0; i < 98; i++) pos.push([rest[i][0] + (r() - .5) * .5, rest[i][1] + (r() - .5) * .4]); pos.push(cells[RIV_CELL], cells[DAVE_CELL]);
  const starts = tl.beats.map((b) => b.start); const T = (bi, lt) => starts[bi] + lt;
  // elimination schedule
  const dieT = new Array(100).fill(1e9); const events = [];
  const near = (ids, px, pz) => ids.slice().sort((a, b) => Math.hypot(pos[a][0] - px, pos[a][1] - pz) - Math.hypot(pos[b][0] - px, pos[b][1] - pz));
  let pool = Array.from({ length: 88 }, (_, i) => i);
  const sched = (ids, ta, tb) => { ids.forEach((id, k) => { dieT[id] = ta + (k + r() * .6) / ids.length * (tb - ta); }); };
  { const e1 = near(pool, -2.7, 9).slice(0, 11); pool = pool.filter((x) => !e1.includes(x)); const e2 = near(pool, 3, 8).slice(0, 40); pool = pool.filter((x) => !e2.includes(x));
    sched(e1, T(1, 1.3), T(1, 2.2)); sched(e2, T(2, 1.4), T(2, 2.5)); sched(near(pool, 0, 4), T(3, 2.0), T(3, 3.4)); sched(Array.from({ length: 10 }, (_, k) => 88 + k), T(4, .3), T(4, 1.0)); }
  const rivalT = T(5, .15);
  const aliveAt = (t) => { let n = 100; for (let i = 0; i < 98; i++) if (dieT[i] <= t) n--; if (rivalT <= t) n--; return n; };
  for (let i = 0; i < 98; i++) events.push({ t: dieT[i], x: pos[i][0], y: 0, z: pos[i][1] }); events.push({ t: rivalT, x: -2.6, y: SY, z: 31 });
  const puff = new Particles(S, 480, 0xffffff, .26, { rough: 1 }), stars = new Particles(S, 300, 0xffe23a, .09, { rough: .5, emissive: 0x806000 });
  const sweat = new Particles(S, 14, 0x8fd8ff, .05, { rough: .1 }), tears = new Particles(S, 24, 0x8fd8ff, .06, { rough: .1 }), conf = new Particles(S, 150, 0xffd23f, .09, { rough: .6, emissive: 0x403000 });
  // clown props
  const clownG = new THREE.Group(); S.add(clownG); const shoeM = M(0xe8252b, { roughness: .5 }); const shoeL = box(clownG, 0, 0, 0, .34, .22, .95, 0, { mat: shoeM, round: .08 }), shoeR = box(clownG, 0, 0, 0, .34, .22, .95, 0, { mat: shoeM, round: .08 });
  const cNose = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 10), M(0xe8252b)); S.add(cNose); const wigs = []; for (const p of [[-.3, .02, 0, .14], [.3, .02, 0, .14], [-.22, .24, -.04, .15], [.22, .24, -.04, .15], [0, .32, -.04, .15], [-.3, .16, -.1, .13], [.3, .16, -.1, .13]]) { const m = new THREE.Mesh(new THREE.SphereGeometry(p[3], 10, 8), M(0xff7a1a)); m.userData.p = p; S.add(m); wigs.push(m); }
  const hornG = new THREE.Group(); S.add(hornG); { const hb = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 8), M(0xe8252b)); hornG.add(hb); const hc = new THREE.Mesh(new THREE.ConeGeometry(.1, .3, 10), M(0xffd23f)); hc.rotation.x = Math.PI / 2; hc.position.z = .2; hornG.add(hc); }
  const ruff = new THREE.Mesh(new THREE.TorusGeometry(.2, .07, 8, 14), M(0xffffff)); S.add(ruff);
  const rings = []; for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .04, 6, 28), new THREE.MeshBasicMaterial({ color: 0xffe23a, transparent: true, opacity: 0, fog: false })); S.add(m); rings.push(m); }
  // banana
  const peelG = new THREE.Group(); S.add(peelG); { const ym = M(0xffd92a, { roughness: .4 }); const banana = new THREE.Mesh(new THREE.TorusGeometry(.5, .13, 8, 16, Math.PI * .85), ym); banana.rotation.x = Math.PI / 2; banana.rotation.z = -.3; banana.position.y = .14; banana.castShadow = true; peelG.add(banana);
    for (let i = 0; i < 3; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.26, 10, 6), M(0xf2c81c, { roughness: .6 })); f.scale.set(1, .12, .45); f.position.set(Math.cos(i * 2.1) * .3, .06, Math.sin(i * 2.1) * .3 + .1); f.rotation.y = -i * 2.1; f.castShadow = true; peelG.add(f); } peelG.scale.setScalar(1.5); }
  // check + overhead case + final briefcase
  const checkTex = cnv(768, 340, (g, w, h) => { g.fillStyle = '#f6f1d8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2a7a3a'; g.lineWidth = 12; g.strokeRect(8, 8, w - 16, h - 16); g.fillStyle = '#222'; g.font = '700 30px Liberation Sans, Arial'; g.textAlign = 'left'; g.fillText('PAY TO THE ORDER OF', 36, 66); g.font = '900 64px Liberation Sans, Arial'; g.fillText('DAVE', 36, 130); strokeText(g, '$100,000', w / 2 + 60, 230, 130, '#2fb34a', 12); g.fillStyle = '#222'; g.fillRect(450, 100, 280, 5); });
  const check = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.33), new THREE.MeshStandardMaterial({ map: checkTex, roughness: .7, side: THREE.DoubleSide })); check.castShadow = true; S.add(check);
  const winCase = mkCase(true); winCase.scale.setScalar(1.15); S.add(winCase);
  const cashLight = new THREE.PointLight(0xffe08a, 0, 14); S.add(cashLight);

  // ------------------------------------------------------------------ hud overlays (own DOM, nothing in the top-right corner)
  const css = document.createElement('style'); css.textContent = `#ba{position:absolute;left:40px;top:292px;padding:6px 22px 4px 22px;background:rgba(10,10,20,.82);border:6px solid #ffe23a;border-radius:14px;font-family:'Liberation Sans',Arial,sans-serif;text-align:center;transform-origin:left top}#ba small{display:block;font-size:34px;letter-spacing:5px;font-weight:900;color:#ffe23a}#ba b{display:block;font-size:150px;line-height:1;font-weight:900;color:#fff;-webkit-text-stroke:6px #111;paint-order:stroke fill}#bf{position:absolute;right:36px;top:300px;width:560px;font-family:'Liberation Sans',Arial,sans-serif;text-align:right}#bf div{margin:8px 0 0 auto;width:max-content;max-width:560px;background:rgba(18,18,26,.88);border-right:7px solid #e8252b;padding:8px 16px;font-size:28px;font-weight:800;color:#f0f0f4}#bf b{color:#ffe23a}`;
  document.head.appendChild(css); const ba = document.createElement('div'); ba.id = 'ba'; ba.className = 't'; ba.innerHTML = '<small>ALIVE</small><b>100</b>'; document.body.appendChild(ba); const bf = document.createElement('div'); bf.id = 'bf'; bf.className = 't'; document.body.appendChild(bf);
  const popEl = document.getElementById('pop'); popEl.style.top = '1480px'; popEl.style.fontSize = '120px';
  const FEED = [[1, 1.5, '<b>FRANK</b> was eliminated by <b>A CLOWN</b>'], [1, 1.85, '<b>BRENDA</b> lost it at the shoes'], [1, 2.2, '<b>+9 MORE</b> are out'], [2, 1.5, '<b>KEVIN</b> was eliminated by <b>A BANANA</b>'], [2, 1.85, '<b>GARY</b> laughed at KEVIN'], [2, 2.2, '<b>+38 MORE</b> are out'], [3, 2.1, '<b>LINDA</b> was eliminated by <b>A GOAT</b>'], [3, 2.5, '<b>BRAD</b> lost it at the bowtie'], [3, 2.95, '<b>+35 MORE</b> are out'], [4, .3, '<b>10 MORE</b> cracked at once'], [4, .8, '<b>CHAD</b> was eliminated by <b>HIS OWN FACE</b>'], [5, .2, '<b>HOWARD</b> was eliminated by <b>DAVE</b>']];
  const POP = [[[0, 'DON\'T LAUGH'], [2.2, '']], [[.1, 'A CLOWN?!'], [1.5, 'HONK!!!']], [[.1, 'NO WAY'], [1.1, 'SPLAT!']], [[.1, 'GOAT NEWS'], [2.1, '37 DOWN']], [[.1, 'FINAL 2'], [2.9, 'HE IS CRACKING']], [[0, '$100,000'], [3.1, 'HE LAUGHED!']]];
  POP[0] = [[2.4, 'DON\'T LAUGH'], [3.7, '']]; POP[0].push([4.9, '$100,000?!'], [6.4, '']);
  const rand = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  // camera keyframes: [lt, px,py,pz, tx,ty,tz, fov, roll]
  const KEYS = [
    [[0, 0, 50, 36, 0, 2, -2, 54, 0], [1.75, 6, 20, 30, 0, 4, -4, 56, 0], [1.9, 7, 19, 29, 0, 4, -4, 56, 0], [2.05, -3, 2.1, 11.2, -1, 1.8, 0, 50, .14], [3.5, -1, 2.05, 9.7, -.5, 1.85, -1, 42, -.04], [3.62, 4, 2.3, 10.5, 1, 1.9, 4, 50, -.16], [4.9, 2, 2.2, 9.6, 0, 1.9, 2, 42, .06], [5.05, 6, 3.2, 21, 0, 3.4, 15, 52, -.1], [6.2, 3.4, 3.6, 19.2, 0, 3.4, 15, 40, .04], [6.35, 0, 36, 33, 0, 4, -2, 54, 0], [7.5, 0, 28, 30, 0, 4, -2, 54, 0]],
    [[0, 3.5, 1.5, 15.6, -3.3, 2.2, 10.5, 55, .03], [.72, 0.2, 2.1, 14, -2.7, 2.4, 10.5, 44, 0], [.86, 5, 2.4, 12.5, -1, 1.8, 2, 56, .14], [1.8, 2.5, 2.2, 11.8, -1.5, 1.8, 0, 46, -.05], [1.95, 9, 6.5, 17, -2.5, 1.2, 6, 56, 0], [3, 6.5, 5, 14.5, -2.5, 1.4, 7.5, 54, 0]],
    [[0, 5, .45, 13.6, 1.8, .5, 11, 56, .05], [.9, 4.2, .5, 13, 3, .5, 11, 50, .1], [1.1, 9, 2.4, 15.5, 4.5, 1, 11, 56, -.12], [1.8, 8, 2.2, 14.5, 5, .9, 11, 56, -.05], [1.95, 0, 2.3, 11.6, .5, 1.8, 1, 58, .1], [3, 1, 2.4, 11, 0, 1.8, -1, 48, -.05]],
    [[0, -9, 2.4, 19.5, 0, 2.8, 30, 58, .04], [1.0, -5.5, 2.6, 22, 0, 3.1, 30, 50, 0], [1.12, .4, 3.4, 25.2, 0, 3.4, 30, 40, .07], [2.0, .2, 3.4, 26.5, 0, 3.4, 30, 36, .1], [2.15, -3, 2.4, 11.4, 0, 1.8, 0, 58, -.12], [3.75, 0, 2.6, 11.2, 0, 1.8, -2, 50, .05]],
    [[0, 0, 2, 22.5, 0, 2, 31, 56, 0], [1.25, 1.2, 1.9, 25.5, 0, 2.1, 31, 50, .05], [1.4, .3, 2.4, 27, 1.5, 2.3, 31, 38, .08], [2.4, .9, 2.45, 28.4, 1.5, 2.3, 31, 36, .1], [2.5, -.4, 2.4, 28.2, -1.5, 2.3, 31, 38, -.06], [2.9, -.5, 2.4, 28.6, -1.5, 2.3, 31, 36, -.06], [3.0, 1.1, 2.4, 28.4, 1.5, 2.3, 31, 32, .05], [4.5, 1.35, 2.4, 29.6, 1.5, 2.3, 31, 28, .12]],
    [[0, 0, 1.0, 24.6, 0, 2.7, 31, 62, 0], [1.1, 0, 1.4, 25.4, 0, 2.7, 31, 60, 0], [1.2, .3, 2.2, 27.0, 0, 2.2, 31, 46, .04], [2.5, .3, 2.2, 27.6, 0, 2.2, 31, 42, .06], [2.65, -1.6, 2.3, 24.0, .8, 1.9, 31, 58, -.08], [3.0, -1.2, 2.3, 24.4, .8, 1.9, 31, 58, -.08], [3.12, .1, 1.9, 27.2, 0, 1.5, 30.8, 50, 0], [3.75, .1, 1.8, 27.9, 0, 1.5, 30.8, 44, .08]],
  ];
  const kcam = (keys, lt) => { let k = 0; for (let i = 0; i < keys.length; i++) if (lt >= keys[i][0]) k = i; const a = keys[k], b = keys[Math.min(k + 1, keys.length - 1)]; const u = a === b ? 0 : smooth((lt - a[0]) / (b[0] - a[0])); return a.slice(1).map((v, i) => lerp(v, b[i + 1], u)); };
  const V = new THREE.Vector3(), O3 = new THREE.Object3D();
  const headAt = (o, x, y, z, out) => { V.set(x, y, z).applyMatrix4(o.M.head); out[0] = V.x; out[1] = V.y; out[2] = V.z; };
  const hp = [0, 0, 0];

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); const al = aliveAt(t); const cx = [0, -2.7, 3, 0, 0, 0][bi], cz = [30, 10.5, 11, 30, 30, 30][bi];
    // ---- crowd
    for (let i = 0; i < 98; i++) { const a = A.p[i], b = B.p[i]; const [x, z] = pos[i]; const lf = dieT[i] - .55; const dead = t >= dieT[i]; const laughing = !dead && t >= lf && i < 88; const live = !dead && !laughing;
      const yaw = bi === 0 ? 0 : bi <= 3 ? Math.atan2(cx - x, cz - z) * smooth(lt / .5) * (bi === 3 ? .5 : 1) : 0;
      for (const o of [a, b]) { o.x = x; o.z = z; o.y = 0; o.yaw = yaw; o.scale = 1; o.extra = 0; o.pitch = 0; o.speed = 1; o.anim = 'idle'; o.lie = 0; }
      a.vis = live; b.vis = laughing; if (laughing) { const k = i % 3; b.anim = k === 1 ? 'jump' : 'bend'; b.speed = 1.5; b.extra = .1; if (k === 1) b.y = 0; b.yaw = yaw + Math.sin(t * 9 + i) * .15; }
      if (live && bi === 0 && lt > 3.2) a.extra = .014 + .01 * rand(i); if (live && bi >= 1) a.extra = .02 + .02 * rand(i) * smooth(lt / 1.0); }
    const daveCrowd = bi <= 3, rivalCrowd = bi <= 3;
    // 98 = rival, 99 = Dave
    { const o = HD.p[0]; o.vis = bi >= 3 ? true : true; o.scale = 1; o.extra = 0; o.pitch = 0; o.lie = 0; o.arms = null; o.hs = 1; o.y = 0; o.speed = 1; o.anim = 'idle';
      const w = HR.p[0], h = HR.p[1]; for (const q of [w, h]) { q.vis = false; q.arms = null; q.extra = 0; q.y = 0; q.pitch = 0; q.lie = 0; q.anim = 'idle'; q.speed = 1; q.scale = 1; }
      if (bi <= 3) { o.x = pos[99][0]; o.z = pos[99][1]; o.yaw = 0; o.extra = .02; w.vis = !(t >= dieT[98] && false); w.x = pos[98][0]; w.z = pos[98][1]; w.yaw = 0; w.vis = true; w.extra = .015; if (bi >= 1) { o.yaw = Math.atan2(cx - o.x, cz - o.z) * smooth(lt / .5) * (bi === 3 ? .5 : 1); w.yaw = o.yaw; } }
      else if (bi === 4) { o.x = 1.5; o.z = 31; o.y = SY; o.yaw = -Math.PI / 2 - .55; o.extra = .07 + .05 * smooth((lt - 1.4) / 2); o.hs = 1 + .03 * Math.sin(t * 40) * smooth((lt - 1.4) / 1.5); w.vis = true; w.x = -1.5; w.z = 31; w.y = SY; w.yaw = Math.PI / 2 + .55; w.arms = { lx: -.3, rx: -.3, lz: -.12, rz: .12 }; }
      else { // finale
        o.x = 0; o.z = 31; o.y = SY; o.yaw = Math.PI; w.vis = lt < .15 + .01; w.x = -2.6; w.z = 31; w.y = SY; w.yaw = Math.PI / 2 + .6;
        if (lt < 1.2) { o.arms = { lx: -2.85, rx: -2.85, lz: .1, rz: -.1 }; o.anim = 'jump'; o.speed = .6; o.extra = .02; }
        else if (lt < 2.9) { const u = smooth((lt - 1.2) / .45); o.arms = { lx: lerp(-2.85, -.2, u), rx: lerp(-2.85, -.2, u), lz: 0, rz: 0 }; o.extra = .06; }
        else { const u = smooth((lt - 2.7) / .3); o.arms = { lx: lerp(-.2, -1.0, u), rx: lerp(-.2, -1.0, u), lz: 0, rz: 0 }; if (lt > 3.05) { o.anim = 'idle'; o.pitch = .5 + .14 * Math.sin(t * 15); o.speed = 1.8; o.extra = .2; o.hs = 1; o.arms = { lx: -.7 + Math.sin(t * 20) * .2, rx: -.7 - Math.sin(t * 20) * .2, lz: 0, rz: 0 }; } else o.extra = .05; }
        const hh = HR.p[1]; const hu = smooth((lt - 1.9) / .75); hh.vis = lt > 1.9; hh.x = lerp(5.5, 1.35, hu); hh.z = 31; hh.y = SY; hh.yaw = -Math.PI / 2; hh.anim = hu < 1 ? 'walk' : 'idle'; hh.speed = 1; hh.arms = { lx: -1.2, rx: -1.2, lz: 0, rz: 0 }; }
    }
    // clown + banana guy
    { const c = HC.p[0]; c.vis = bi === 1 || bi === 2 || bi === 3 || (bi === 0 && false); c.scale = 1.4; c.arms = null; c.extra = 0; c.y = 0; c.speed = 1; c.pitch = 0; c.lie = 0; c.hs = 1;
      const honk = bi === 1 ? clamp((lt - .72) / 1.5) : 0; let cxp = -2.7, czp = 10.5;
      if (bi === 1) { cxp = lt < .72 ? -7.2 + lt / .72 * 4.5 : -2.7; c.anim = lt < .72 ? 'walk' : 'idle'; c.speed = 1.3; c.yaw = lt < .72 ? Math.PI / 2 - .3 : lerp(Math.PI / 2 - .3, .25, smooth((lt - .72) / .25)); if (lt >= .72) { const hb = Math.max(0, Math.sin((lt - .72) * 30)); c.arms = { lx: .5, rx: -1.35 + .2 * hb, lz: .1, rz: 0 }; c.y = .08 * hb; c.extra = .03; } }
      else { cxp = bi === 2 ? -2.7 : -2.7; c.anim = 'idle'; c.yaw = .25; c.arms = { lx: .4, rx: -1.35, lz: .1, rz: 0 }; c.extra = .03; c.vis = bi === 2 && lt < 1.0 ? true : (bi === 1); if (bi === 2) { c.x = -6; c.z = 12; } }
      if (bi === 1) { c.x = cxp; c.z = czp; } else if (bi === 2) { c.x = -6; c.z = 12.5; c.yaw = .5; c.vis = true; } else if (bi === 3) { c.x = -6; c.z = 12.5; c.yaw = .5; c.vis = lt < 2.0; c.anim = 'idle'; }
      const g = HB.p[0]; g.vis = bi === 2; g.scale = 1; g.arms = null; g.extra = 0; g.speed = 1; g.pitch = 0; g.lie = 0; g.y = 0; g.yaw = Math.PI / 2; g.z = 11;
      const ts = .95; if (bi === 2) { if (lt < ts) { g.x = -3.65 + 7 * lt; g.anim = 'run'; g.speed = 1.05; }
        else { const d = lt - ts; g.x = 3 + 6 * d - 4.2 * d * d; g.anim = 'panic'; g.speed = .8; g.y = Math.max(0, 1.5 * d * 3.4 - 5 * 3.4 * d * d * .72 * .6) * (d < .62 ? 1 : 0); const lu = smooth(d / .55); g.lie = 1.45 * lu; if (d >= .55) { g.y = .17 * lu; g.anim = 'idle'; g.arms = { lx: -2.2 + Math.sin(t * 14) * .3, rx: -2.0 + Math.cos(t * 14) * .3, lz: .6, rz: -.6 }; } else g.arms = { lx: -2.6 + Math.sin(t * 22) * 1.0, rx: -2.4 + Math.cos(t * 24) * 1.0, lz: .8 * Math.sin(t * 19), rz: -.8 * Math.cos(t * 21) }; } }
      g.x = g.x ?? 0; }
    // faces
    const shock = (bi === 0 && lt > 4.25 && lt < 6.2) || (bi === 1 && lt > .72 && lt < 1.8) || (bi === 2 && lt > .9 && lt < 2.0) || (bi === 3 && lt > 1.4 && lt < 2.2);
    A.setFace(shock ? 'shock' : 'calm'); HR.setFace(shock ? 'shock' : 'calm'); HB.setFace(bi === 2 && lt > .95 ? 'shock' : 'shock');
    HD.setFace(bi === 5 && lt > 3.05 ? 'laugh' : bi === 5 && lt < 1.2 ? 'shock' : bi >= 4 || (bi === 5) ? 'puff' : shock ? 'shock' : 'calm');
    A.update(t); B.update(t); HD.update(t); HR.update(t); HC.update(t); HB.update(t);
    // ---- clown props
    { const c = HC.p[0]; clownG.visible = c.vis; if (c.vis) { const s = c.scale * c.h; clownG.position.set(c.x, c.y, c.z); clownG.rotation.y = c.yaw; clownG.scale.setScalar(s); const w = Math.sin(c.phase + t * 8.5 * c.speed); const sw = c.anim === 'walk' ? .62 * w : 0;
        shoeL.position.set(-.14, .11 + (c.anim === 'walk' ? Math.max(0, w) * .15 : 0), -.8 * Math.sin(sw) + .2); shoeR.position.set(.14, .11 + (c.anim === 'walk' ? Math.max(0, -w) * .15 : 0), .8 * Math.sin(sw) + .2); }
      cNose.visible = ruff.visible = hornG.visible = c.vis; wigs.forEach((m) => (m.visible = c.vis));
      if (c.vis) { O3.matrixAutoUpdate = false; const at = (mesh, o, key, off) => { V.set(off[0], off[1], off[2]).applyMatrix4(o.M[key]); mesh.position.copy(V); mesh.scale.setScalar(c.scale * c.h); mesh.quaternion.setFromRotationMatrix(o.M[key]); };
        at(cNose, c, 'head', [0, -.02, .26]); wigs.forEach((m) => at(m, c, 'head', [m.userData.p[0], m.userData.p[1], m.userData.p[2]])); at(ruff, c, 'torso', [0, .33, 0]); ruff.rotateX(Math.PI / 2); at(hornG, c, 'handR', [0, -.1, .12]); hornG.scale.setScalar(c.scale * c.h * (1 + .35 * Math.max(0, Math.sin((lt - .72) * 30)) * (bi === 1 && lt > .72 ? 1 : 0))); } }
    for (let i = 0; i < 3; i++) { const hl = bi === 1 ? lt - .72 - i * .22 : -1; const m = rings[i]; m.visible = hl > 0 && hl < .9; if (m.visible) { const h = HC.p[0]; V.set(0, -.1, .12).applyMatrix4(h.M.handR); m.position.copy(V); m.position.y += .05; m.scale.setScalar(.4 + hl * 6); m.material.opacity = (1 - hl / .9) * .8; m.quaternion.setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)); m.lookAt(st.camera.position); } }
    // banana peel
    peelG.visible = bi === 2; if (bi === 2) { const d = lt - .95; if (d < 0) { peelG.position.set(3, 0, 11); peelG.rotation.set(0, .4, 0); } else { const bx = 3 + 4.5 * d, by = Math.max(0, 5.2 * d - 6 * d * d), bz = 11 - 2.5 * d; peelG.position.set(bx, by, bz); peelG.rotation.set(d * 7, .4 + d * 9, d * 4); if (by <= 0 && d > .6) { peelG.rotation.set(0, .4 + .6 * 9, 0); peelG.position.set(3 + 4.5 * .86 + (d - .86) * 0, 0, 11 - 2.5 * .86); } } }
    // ---- poofs
    puff.clear(); stars.clear(); let pi = 0, si = 0; for (const e of events) { const dt = t - e.t; if (dt < 0 || dt > .6) continue; const u = dt / .6; for (let k = 0; k < 6 && pi < puff.n; k++) { const a = k * 1.047 + e.x, rr = .3 + dt * 3.2; puff.set(pi++, e.x + Math.cos(a) * rr, e.y + 1.1 + dt * 1.8 + .3 * Math.sin(k * 2), e.z + Math.sin(a) * rr, (1 - u) * 1.15 + .15); } for (let k = 0; k < 4 && si < stars.n; k++) { const a = k * 1.7 + e.z; stars.set(si++, e.x + Math.cos(a) * dt * 4, e.y + 1.4 + dt * 3 - dt * dt * 5, e.z + Math.sin(a) * dt * 4, (1 - u) * 1.3); } } puff.done(); stars.done();
    // ---- sweat + tears
    for (let k = 0; k < 14; k++) sweat.set(k, 0, 0, 0, 0); for (let k = 0; k < 24; k++) tears.set(k, 0, 0, 0, 0);
    if (bi === 4 && lt > .8) { const o = HD.p[0]; const f = smooth((lt - .8) / 1); for (let k = 0; k < 14; k++) { const u = (t * 1.9 + k * .37) % 1; const sd = k % 2 ? 1 : -1; const rr = rand(k + 3); headAt(o, sd * (.22 + u * (.12 + rr * .3)), .2 + rr * .12 - u * .2 - u * u * (.7 + rr * .5), .1 + rr * .12, hp); sweat.set(k, hp[0], hp[1], hp[2], (1 - u * .5) * f * (.55 + rr * .3)); } }
    if (bi === 5 && lt > 3.05) { const o = HD.p[0]; for (let k = 0; k < 24; k++) { const u = (t * 2.2 + k / 24) % 1; const sd = k % 2 ? 1 : -1; headAt(o, sd * (.14 + u * .35), .0 - u * .3 - u * u * .4, .24 + u * .15, hp); tears.set(k, hp[0], hp[1], hp[2], .8 * (1 - u * .5)); } }
    sweat.done(); tears.done();
    for (let k = 0; k < 150; k++) { const u = ((t * .55 + k * .0667) % 1); conf.set(k, Math.cos(k * 2.4) * 9 + Math.sin(t + k) * .5, 14 - u * 14, 31 + Math.sin(k * 3.1) * 5, bi === 5 && lt > 2.9 ? 1 : 0); } conf.done();
    // ---- check / cases
    check.visible = bi === 5 && lt > 1.9; if (check.visible) { const hu = smooth((lt - 1.9) / .75), tu = smooth((lt - 2.7) / .35); const hx = lerp(5.5 - .8, 1.35 - .9, hu); const ld = smooth((lt - 3.05) / .2); check.position.set(lerp(hx, 0, tu), lerp(lerp(SY + 1.75, SY + 1.45, tu), SY + .5, ld), lerp(lerp(30.5, 30.45, tu), 28.9, ld)); check.rotation.set(-.5 * ld, Math.PI, Math.sin(t * 40) * .01 * tu); }
    winCase.visible = bi === 5; if (bi === 5) { const dw = smooth((lt - 1.15) / .35); const drop = lt > 1.15 ? Math.max(0, 1 - ((lt - 1.15) / .3) ** 2) : 1; winCase.position.set(lerp(0, 2.2, dw), lerp(SY + 2.55, SY + .05, 1 - drop), lerp(30.9, 29.5, dw)); winCase.rotation.set(0, Math.PI + (lt < 1.2 ? Math.sin(t * 6) * .12 : 0), 0); winCase.scale.setScalar(1.15 + .15 * (1 - dw)); cashLight.position.set(winCase.position.x, winCase.position.y + 1.6, winCase.position.z - .6); cashLight.intensity = 20; } else cashLight.intensity = 0;
    // ---- set dressing
    goat.visible = news.visible = bi === 3; if (bi === 3) { const sp = lt > 1.0 && lt < 3.3 ? 1 : 0; const head = goat.userData.head, jaw = goat.userData.jaw; head.rotation.set(.06 * Math.sin(t * 7) * sp, Math.sin(t * 2.4) * .16 * sp, Math.sin(t * 5) * .05 * sp); jaw.rotation.x = sp * (.1 + .22 * Math.max(0, Math.sin(t * 17))); }
    spot.material.opacity = .11 + .04 * Math.sin(t * 4); cashGlow.intensity = 36 + 10 * Math.sin(t * 5);
    bigCase.userData.lid && (bigCase.userData.lid.rotation.x = -1.75 + .03 * Math.sin(t * 3)); bigCase.rotation.y = Math.sin(t * .8) * .06;
    for (const b of beams) { const ph = t * .5 + b.ph; const tx = Math.sin(ph) * 14, tz = Math.cos(ph * 1.3) * 12 + 6; const from = new THREE.Vector3(b.sx, 29, b.sz), to = new THREE.Vector3(tx, 0, tz); const d = to.clone().sub(from); const len = d.length(); b.g.position.copy(from).addScaledVector(d, .5); b.g.scale.set(1, len / 60, 1); b.g.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d.normalize()); }
    // ---- camera
    const c = kcam(KEYS[bi], lt); const sh = .018; st.cam(c[0] + Math.sin(t * 11) * sh, c[1] + Math.cos(t * 13) * sh, c[2], c[3] + Math.sin(t * 7) * sh, c[4], c[5], c[6], c[7]); st.follow(c[3] * .5, c[5] * .6); st.render();
    // ---- hud
    hud.question('', 0); hud.counter('', '', '');
    ba.querySelector('b').textContent = al; ba.style.transform = `scale(${1 + .12 * Math.max(0, 1 - ((t - (events.filter((e) => e.t <= t).reduce((m, e) => Math.max(m, e.t), -9))) / .18))})`; ba.style.display = 'block';
    let fh = ''; const shown = FEED.filter((f) => f[0] === bi && lt >= f[1] && lt < f[1] + 2.6); for (const f of shown.slice(-4)) fh += `<div>${f[2]}</div>`; if (bf._h !== fh) { bf.innerHTML = fh; bf._h = fh; }
    let pop = ''; for (const q of POP[bi]) if (lt >= q[0]) pop = q[1]; hud.pop(pop, 1);
  } };
}
