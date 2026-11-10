// SWIPR LIVE: what if swiping on dating apps was a real stadium sport? 100 blocky guys, a giant phone scoreboard, a giant thumb.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, Crowd, R, clamp, smooth, lerp, RoundedBoxGeometry, attach } = lib;
  const st = makeStage({ shadowExtent: 44, fogNear: 130, fogFar: 460, clouds: false, skyTop: 0x050818, skyMid: 0x111b55, skyBot: 0x2c3c8c, fog: 0x141c48, sunColor: 0xfff0e0, sunDir: [-.25, 1, .55], sunI: 2.5, hemi: 1.35, hemiSky: 0xdde6ff, hemiGround: 0x7a78a8, exposure: 1.0 });
  const S = st.scene; const rnd = R(675);
  const M = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .7 }, o));
  const box = (p, x, y, z, w, h, d, c, o = {}) => { const m = new THREE.Mesh(o.round ? new RoundedBoxGeometry(w, h, d, 3, o.round) : new THREE.BoxGeometry(w, h, d), o.mat || M(c, o.m)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; p.add(m); return m; };
  const cnv = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); fn(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const FONT = 'Liberation Sans, Arial';
  const stroke = (g, s, x, y, size, fill, line = 14) => { g.font = `900 ${size}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = line; g.strokeStyle = '#111'; g.strokeText(s, x, y); g.fillStyle = fill; g.fillText(s, x, y); };
  const sign = (p, w, h, x, y, z, ry, tex, emis = 0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: .6, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: emis })); m.position.set(x, y, z); m.rotation.y = ry; p.add(m); return m; };
  const heartPath = (g, cx, cy, s) => { g.beginPath(); g.moveTo(cx, cy + s * .9); g.bezierCurveTo(cx - s * 1.5, cy - s * .1, cx - s * .8, cy - s * 1.1, cx, cy - s * .35); g.bezierCurveTo(cx + s * .8, cy - s * 1.1, cx + s * 1.5, cy - s * .1, cx, cy + s * .9); g.closePath(); };

  // ---------------------------------------------------------------- field, stands, lights
  const gtex = cnv(512, 512, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#2f8a4a' : '#379a52'; g.fillRect(0, i * h / 8, w, h / 8 + 1); } g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 8; g.strokeRect(14, 14, w - 28, h - 28); g.beginPath(); g.moveTo(14, h / 2); g.lineTo(w - 14, h / 2); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 70, 0, 7); g.stroke(); });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(56, 74), new THREE.MeshStandardMaterial({ map: gtex, roughness: .95 })); field.rotation.x = -Math.PI / 2; field.position.set(0, 0, 6); field.receiveShadow = true; S.add(field);
  const apron = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), M(0x171c36, { roughness: 1 })); apron.rotation.x = -Math.PI / 2; apron.position.set(0, -.03, 0); apron.receiveShadow = true; S.add(apron);
  const ads = [0xe8252b, 0xf2b632, 0x2f6fd8, 0x2f8f6a];
  for (let i = 0; i < 12; i++) for (const sd of [-1, 1]) box(S, sd * 13.2, .55, -26 + i * 6.3, .35, 1.1, 5.9, ads[(i + (sd > 0 ? 1 : 0)) % 4], { m: { emissive: ads[(i + (sd > 0 ? 1 : 0)) % 4], emissiveIntensity: .35 }, cast: false });
  const NT = 5, FANS = []; const fr = R(31);
  for (let k = 0; k < NT; k++) for (const sd of [-1, 1]) { const x = sd * (15.2 + k * 2.2), h = (k + 1) * 1.0; box(S, x, h / 2, 5, 2.2, h, 62, k % 2 ? 0x24378a : 0x1c2b6b, { cast: false }); for (let i = 0; i < 12; i++) FANS.push({ x, y: h, z: -16 + i * 3.4 + fr() * .8, yaw: -sd * Math.PI / 2 + (fr() - .5) * .4, ph: fr() * 6 }); }
  box(S, 0, 3, -33, 70, 6, 2, 0x1c2b6b, { cast: false });
  for (let i = 0; i < 4; i++) { const sx = (i % 2 ? 1 : -1) * 27, sz = i < 2 ? -24 : 26; box(S, sx, 15, sz, 1.4, 30, 1.4, 0x2a2f45); box(S, sx, 30.6, sz, 6, 2.2, 1.2, 0xffffff, { m: { emissive: 0xfff4d0, emissiveIntensity: 2.2 }, cast: false }); }
  const beams = []; const bm = new THREE.MeshBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: .018, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  for (let i = 0; i < 4; i++) { const g = new THREE.Mesh(new THREE.CylinderGeometry(.5, 6, 50, 18, 1, true), bm); g.frustumCulled = false; S.add(g); beams.push({ g, sx: (i % 2 ? 1 : -1) * 27, sz: i < 2 ? -24 : 26, ph: i * 1.7 }); }

  // ---------------------------------------------------------------- giant phone scoreboard
  const PZ = -24; const phone = new THREE.Group(); phone.position.set(0, 0, PZ); S.add(phone);
  box(phone, 0, 15.2, 0, 15.4, 27.4, 1.5, 0x101218, { round: .5, m: { roughness: .35, metalness: .4 } });
  box(phone, -4.5, 1.1, -.2, 1.6, 2.2, 1.6, 0x2a2f45); box(phone, 4.5, 1.1, -.2, 1.6, 2.2, 1.6, 0x2a2f45);
  const SC = document.createElement('canvas'); SC.width = 540; SC.height = 1000; const sg = SC.getContext('2d'); const stex = new THREE.CanvasTexture(SC); stex.colorSpace = THREE.SRGBColorSpace; stex.anisotropy = 8;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(14.2, 26.2), new THREE.MeshBasicMaterial({ map: stex, toneMapped: false })); scr.position.set(0, 15.2, .76); phone.add(scr);
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(26, 40), new THREE.MeshBasicMaterial({ color: 0x6aa0ff, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); halo.position.set(0, 15.2, -.9); phone.add(halo);
  const banner = cnv(1024, 256, (g, w, h) => { g.fillStyle = '#12142a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ff3b6b'; g.lineWidth = 14; g.strokeRect(10, 10, w - 20, h - 20); stroke(g, 'SWIPR', 330, 134, 150, '#ff4d7e', 14); g.fillStyle = '#e8252b'; g.beginPath(); g.roundRect(600, 70, 380, 130, 20); g.fill(); stroke(g, 'LIVE', 790, 136, 100, '#fff', 8); });
  sign(phone, 12, 3, 0, 31.8, 0, 0, banner, .8);
  box(phone, -5.6, 30.4, -.2, .3, 3, .3, 0x2a2f45); box(phone, 5.6, 30.4, -.2, .3, 3, .3, 0x2a2f45);
  let scrKey = '';
  const drawScreen = (state, a = 0, n = 0) => {
    const key = state + '|' + a + '|' + n; if (key === scrKey) return; scrKey = key; const g = sg, w = 540, h = 1000;
    const bgc = { title: ['#1b1f4a', '#0d0f26'], count: ['#1b1f4a', '#0d0f26'], left: ['#4a1118', '#1a0508'], right: ['#0e4a2a', '#04180c'], ghost: ['#2a2c36', '#101118'], match: ['#ff4d7e', '#ff9a3c'], over: ['#4a0f12', '#12060a'] }[state];
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, bgc[0]); gr.addColorStop(1, bgc[1]); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(0, 0, w, 120); stroke(g, 'SWIPR', 190, 62, 78, '#ff4d7e', 10); g.fillStyle = '#e8252b'; g.beginPath(); g.roundRect(340, 28, 170, 68, 16); g.fill(); stroke(g, 'LIVE', 425, 63, 48, '#fff', 4);
    const C = w / 2;
    if (state === 'title') { stroke(g, 'THE SPORT', C, 420, 84, '#fff', 14); stroke(g, 'OF SWIPING', C, 560, 78, '#ffd92a', 14); g.fillStyle = '#ff3b6b'; heartPath(g, C, 780, 100); g.fill(); }
    else if (state === 'count') { stroke(g, 'GUYS', C, 330, 120, '#fff', 14); stroke(g, String(n), C, 560, 210, '#ffd92a', 22); stroke(g, 'MATCHES: 0', C, 800, 66, '#ff6b6b', 10); }
    else if (state === 'left') { g.fillStyle = '#e8252b'; g.beginPath(); g.arc(C, 480, 210, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 46; g.lineCap = 'round'; g.beginPath(); g.moveTo(C - 100, 380); g.lineTo(C + 100, 580); g.moveTo(C + 100, 380); g.lineTo(C - 100, 580); g.stroke(); stroke(g, 'NOPE', C, 800, 170, '#fff', 16); stroke(g, 'LAUNCHED: ' + n, C, 930, 54, '#ffd92a', 8); }
    else if (state === 'right') { g.fillStyle = '#2fd06a'; g.beginPath(); g.arc(C, 480, 210, 0, 7); g.fill(); g.fillStyle = '#fff'; heartPath(g, C, 480, 120); g.fill(); stroke(g, 'LIKE', C, 800, 170, '#fff', 16); stroke(g, 'HUGGED: ' + n, C, 930, 54, '#ffd92a', 8); }
    else if (state === 'ghost') { g.fillStyle = '#e8e8f0'; g.beginPath(); g.moveTo(C - 130, 600); g.lineTo(C - 130, 400); g.arc(C, 400, 130, Math.PI, 0); g.lineTo(C + 130, 600); for (let i = 0; i < 4; i++) g.lineTo(C + 130 - (i + .5) * 65, i % 2 ? 600 : 660); g.lineTo(C - 130, 600); g.fill(); g.fillStyle = '#222'; g.fillRect(C - 70, 380, 36, 56); g.fillRect(C + 34, 380, 36, 56); stroke(g, 'GHOSTED', C, 800, 96, '#fff', 14); stroke(g, 'SEEN 3 DAYS AGO', C, 920, 46, '#9aa0b8', 8); }
    else if (state === 'match') { stroke(g, "IT'S A", C, 330, 110, '#fff', 14); stroke(g, 'MATCH!', C, 490, 118, '#fff', 18); g.fillStyle = '#fff'; heartPath(g, C - 110, 760, 80); g.fill(); heartPath(g, C + 110, 760, 80); g.fill(); stroke(g, 'SAY HI', C, 930, 60, '#fff', 8); }
    else if (state === 'over') { stroke(g, 'OVERTIME', C, 330, 84, '#ff6b6b', 14); stroke(g, a ? '99:59' : '99 59', C, 560, 190, '#fff', 20); stroke(g, 'NO NEW MESSAGES', C, 800, 44, '#ffd92a', 8); stroke(g, 'MESSAGES SENT: 0', C, 910, 42, '#9aa0b8', 6); }
    stex.needsUpdate = true;
  };

  // ---------------------------------------------------------------- commentator booth
  const booth = new THREE.Group(); booth.position.set(-13.2, 0, 22); S.add(booth);
  box(booth, 0, .8, 0, 5, 1.6, 1.2, 0x2a2f45, { round: .05 }); box(booth, 0, 1.64, 0, 5.3, .1, 1.5, 0xe8e8ee); box(booth, 0, 4.6, -.4, 5.6, .2, 2.2, 0x2a2f45); box(booth, -2.6, 3.0, -.4, .2, 3.2, .2, 0x2a2f45); box(booth, 2.6, 3.0, -.4, .2, 3.2, .2, 0x2a2f45);
  const bsn = cnv(512, 160, (g, w, h) => { g.fillStyle = '#12142a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ff3b6b'; g.lineWidth = 10; g.strokeRect(8, 8, w - 16, h - 16); stroke(g, 'SWIPR LIVE', w / 2, h / 2 + 4, 96, '#ffffff', 10); });
  sign(booth, 4.6, 1.3, 0, .85, .62, 0, bsn, .7); sign(booth, 4.6, 1.0, 0, 4.0, .75, 0, bsn, .5);

  // ---------------------------------------------------------------- people
  const N = 100, NF = FANS.length; const crowd = new Crowd(S, N + NF, 77); const P = crowd.p;
  const hero = new Crowd(S, 8, 78); const HP = hero.p; const ghostC = new Crowd(S, 1, 79); const GP = ghostC.p[0];
  const colOf = (c, i, k, v) => { c.parts[k].setColorAt(i, new THREE.Color(v)); c.parts[k].instanceColor.needsUpdate = true; };
  const dress = (c, i, shirt, pants, skin, hair) => { ['torso', 'armL', 'armR'].forEach((k) => colOf(c, i, k, shirt)); ['legL', 'legR'].forEach((k) => colOf(c, i, k, pants)); ['head', 'neck', 'handL', 'handR'].forEach((k) => colOf(c, i, k, skin)); colOf(c, i, 'hair', hair); };
  const SK = [0xe7b48f, 0xc98e63, 0x8d5a3b, 0xf0c7a4], HC = [0x2a1d12, 0x4a2c18, 0x8a6a32, 0x15100c];
  const SH = [0x2f6fd8, 0xe3a21a, 0x2f8f6a, 0x8a6fd0, 0xe08a3c, 0x4aa0d8, 0xb04a6a, 0x5a6a7a, 0x3a9a9a, 0x9a5a3a, 0xd8423c, 0x3a4a9a];
  for (let i = 0; i < N; i++) dress(crowd, i, SH[i % 12], [0x2f3a52, 0x39404c, 0x4a4036][i % 3], SK[(i * 7) % 4], HC[(i * 5) % 4]);
  for (let i = N; i < N + NF; i++) dress(crowd, i, [0xe8252b, 0xf2b632, 0xffffff, 0x2f6fd8, 0xff7aa2][i % 5], 0x2f3a52, SK[i % 4], HC[(i * 3) % 4]);
  dress(hero, 0, 0xe85d8a, 0x5a4a6a, SK[3], 0x3a1c10); dress(hero, 1, 0x15151a, 0x15151a, SK[1], 0x222222); dress(hero, 2, 0x2d6cdf, 0x2f3a52, SK[0], 0x2a1d12);
  dress(hero, 3, 0x2a2a3a, 0x2a2a3a, SK[0], 0x4a2c18); dress(hero, 4, 0x6a2a3a, 0x2a2a3a, SK[2], 0x15100c); dress(hero, 5, 0x2d6cdf, 0x2f3a52, SK[0], 0x2a1d12); dress(hero, 6, 0x3a3a46, 0x2f3a52, SK[1], 0x15100c);
  dress(ghostC, 0, 0x2d6cdf, 0x2f3a52, SK[0], 0x2a1d12);
  P.forEach((o) => { o.h = 1; }); HP.forEach((o) => { o.h = 1; }); GP.h = 1;
  const ghostMats = Object.values(ghostC.parts).map((im) => im.material); ghostMats.forEach((m) => { m.transparent = true; m.depthWrite = false; if (m.emissive) { m.emissive.set(0x9fc4ff); m.emissiveIntensity = .55; } });
  const place = (o, x, z, yaw, anim = 'idle', q = {}) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = q.y || 0; o.speed = q.sp ?? 1; o.scale = q.sc ?? 1; o.vis = true; o.pitch = q.pitch || 0; o.arms = q.arms || null; o.extra = q.extra || 0; o.lie = q.lie || 0; o.hs = q.hs ?? 1; };
  const gx = (c) => -7.65 + 1.7 * c, gz = (r) => -2 + 2.0 * r; const CARD_ARMS = { lx: -.95, rx: -.95, lz: .22, rz: -.22 };

  // profile cards: one instanced mesh, tinted per guy
  const cardTex = cnv(128, 160, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8cde0'; g.fillRect(8, 8, w - 16, 100); g.fillStyle = '#7b83a8'; g.beginPath(); g.arc(w / 2, 52, 22, 0, 7); g.fill(); g.fillRect(w / 2 - 32, 78, 64, 40); g.fillStyle = '#ff3b6b'; heartPath(g, w / 2, 134, 14); g.fill(); g.fillStyle = '#333'; g.fillRect(24, 112, 80, 5); });
  const cards = new THREE.InstancedMesh(new THREE.PlaneGeometry(.62, .78), new THREE.MeshBasicMaterial({ map: cardTex, side: THREE.DoubleSide }), N); cards.frustumCulled = false; S.add(cards);
  const CP = ['#ffffff', '#ffe9ef', '#e9f2ff', '#fff6d8', '#e8ffe9']; for (let i = 0; i < N; i++) cards.setColorAt(i, new THREE.Color(CP[i % 5])); cards.instanceColor.needsUpdate = true;
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(1, 1, 1), _p = new THREE.Vector3();
  const setCard = (i, x, y, z, rz = 0, ry = 0, s = 1) => { _e.set(0, ry, rz); _q.setFromEuler(_e); _p.set(x, y, z); _s.setScalar(s); _m.compose(_p, _q, _s); cards.setMatrixAt(i, _m); };

  // giant thumb
  const thumb = new THREE.Group(); S.add(thumb); const skinM = M(0xf0b88c, { roughness: .55 });
  const t1 = box(thumb, 0, 0, 0, 3.3, 3.0, 6.5, 0, { mat: skinM, round: 1.2 }); const t2 = box(thumb, 0, 0, 0, 3.7, 3.4, 9, 0, { mat: skinM, round: 1.3 });
  const nail = box(thumb, 0, 0, 0, 2.2, .3, 3.0, 0, { m: { color: 0xffd7c0, roughness: .25 }, round: .12 });
  const tipRing = new THREE.Mesh(new THREE.RingGeometry(.9, 1.2, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8, depthWrite: false, side: THREE.DoubleSide })); tipRing.rotation.x = -Math.PI / 2; S.add(tipRing);
  const EL = .72; // elevation of finger body above horizontal
  const thumbAt = (x, y, z, roll = 0, vis = true) => {
    thumb.visible = vis; if (!vis) return; thumb.position.set(x, y, z); thumb.rotation.set(0, 0, roll);
    const d = new THREE.Vector3(0, Math.sin(EL), -Math.cos(EL)); // from tip toward the back
    t1.position.copy(d).multiplyScalar(3.0).add(new THREE.Vector3(0, 1.3, 0)); t1.rotation.set(EL, 0, 0);
    t2.position.copy(d).multiplyScalar(9.2).add(new THREE.Vector3(0, 2.2, 0)); t2.rotation.set(EL + .22, 0, 0);
    nail.position.copy(d).multiplyScalar(2.4).add(new THREE.Vector3(0, 3.1, 0)); nail.rotation.set(EL, 0, 0);
    tipRing.visible = true; tipRing.position.set(x, .06, z + .4);
  };
  const trail = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xe8252b, transparent: true, opacity: .4, blending: THREE.AdditiveBlending, depthWrite: false })); trail.rotation.x = -Math.PI / 2; S.add(trail);

  // speed lines (pool of thin additive streaks)
  const SL = Array.from({ length: 30 }, () => { const m = new THREE.Mesh(new THREE.BoxGeometry(1, .07, .07), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false })); m.visible = false; S.add(m); return m; });
  const heartTex = cnv(128, 128, (g) => { g.fillStyle = '#ff3b6b'; g.strokeStyle = '#fff'; g.lineWidth = 8; heartPath(g, 64, 62, 38); g.fill(); g.stroke(); });
  const HS = Array.from({ length: 24 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: heartTex, transparent: true, depthWrite: false })); s.visible = false; S.add(s); return s; });
  const CF = 220; const confM = new THREE.InstancedMesh(new THREE.BoxGeometry(.28, .04, .18), new THREE.MeshBasicMaterial({}), CF); confM.frustumCulled = false; S.add(confM);
  { const cc = [0xff4d7e, 0xffd92a, 0x4ad0ff, 0x7dff7a, 0xff9a3c, 0xffffff]; for (let i = 0; i < CF; i++) confM.setColorAt(i, new THREE.Color(cc[i % 6])); confM.instanceColor.needsUpdate = true; }
  const confHide = new THREE.Matrix4().makeScale(0, 0, 0);

  // ref props, cards, phones, crickets
  const whistle = box(S, 0, 0, 0, .12, .08, .18, 0xdddddd, { cast: false }); whistle.visible = false;
  const ycard = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.25), new THREE.MeshBasicMaterial({ map: cnv(380, 250, (g, w, h) => { g.fillStyle = '#ffd92a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#111'; g.lineWidth = 14; g.strokeRect(7, 7, w - 14, h - 14); g.font = `900 66px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#111'; g.fillText('GHOSTED', w / 2, h / 2 + 4); }), side: THREE.DoubleSide })); ycard.visible = false; S.add(ycard);
  const waves = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.RingGeometry(.9, 1, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8, depthWrite: false, side: THREE.DoubleSide })); m.visible = false; S.add(m); return m; });
  const phoneMat = new THREE.MeshBasicMaterial({ color: 0x7ec8ff, toneMapped: false });
  const phA = new THREE.Mesh(new THREE.BoxGeometry(.2, .34, .04), [M(0x111, {}), M(0x111, {}), M(0x111, {}), M(0x111, {}), phoneMat, M(0x111, {})]), phB = phA.clone(); phA.visible = phB.visible = false; S.add(phA); S.add(phB);
  const crick = Array.from({ length: 6 }, () => { const m = new THREE.Mesh(new THREE.BoxGeometry(.16, .1, .3), M(0x4a7a2a)); m.visible = false; S.add(m); return m; });
  const wd = (txt, color = '#fff') => { const t = cnv(512, 160, (g, w, h) => { stroke(g, txt, w / 2, h / 2, 96, color, 14); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false })); s.scale.set(3.6, 1.1, 1); s.visible = false; S.add(s); return s; };
  const chirp = wd('chirp chirp...', '#d8e8ff'), whoosh = wd('WHOOSH', '#ffffff');
  const tumble = new THREE.Group(); tumble.visible = false; S.add(tumble); { const tm = new THREE.Mesh(new THREE.IcosahedronGeometry(.45, 1), M(0xa8845a, { roughness: 1, flatShading: true })); tm.scale.set(1, .9, 1); tumble.add(tm); const tm2 = tm.clone(); tm2.scale.set(.8, .8, .8); tm2.rotation.set(1, 1, 0); tumble.add(tm2); }

  // ---------------------------------------------------------------- timing helpers
  const tOf = (i) => tl.beats[i].start;
  const POP = [[], [['A HUNDRED GUYS', .1]], [['SWIPE LEFT', .1], ['LAUNCHED', 1.35]], [['SWIPE RIGHT', .1], ['HUGGED', 1.4]], [['GHOSTED', .1], ['WHISTLE!', 1.35]], [['IT\'S A MATCH', .1], ['CROWD GOES WILD', 1.65]], [['THEY NEVER TEXT', .1], ['OVERTIME', 1.0]]];
  const inv = (u) => { let a = 0, b = 1; for (let k = 0; k < 18; k++) { const m = (a + b) / 2; if (smooth(m) < u) a = m; else b = m; } return (a + b) / 2; };
  const HX = 13; // swipe start x
  const sweepL = (lt, t0, t1) => lerp(HX, -HX, smooth(clamp((lt - t0) / (t1 - t0)))); // beat 2 (right -> left)
  const sweepR = (lt, t0, t1) => lerp(-HX, HX, smooth(clamp((lt - t0) / (t1 - t0))));
  // guy launch parameters (row 9 = front row)
  const LT0 = .3, LT1 = 1.55, LROW = 9;
  const launchHit = (c) => { const x = gx(c) + 1.7; const u = (HX - x) / (2 * HX); return LT0 + inv(clamp(u)) * (LT1 - LT0); };
  const GR = 14; const lv = (c) => ({ vx: -(9 + (c * 7 % 5) * 1.5), vy: 13 + (c * 3 % 4) * 1.5, vz: 1.5 + c % 3, sp: 3 + c % 4 * .8 });
  const HUGC = 6, HUGR = 8, GHC = 4, GHR = 8; // hugged guy col/row, ghosted guy col/row

  const wave = (o, k, t, hyp = 1) => { o.anim = 'jump'; o.speed = .8 + (k % 5) * .06; o.arms = { lx: -2.7 + .3 * Math.sin(t * 9 + k), rx: -2.7 + .3 * Math.cos(t * 9 + k), lz: .3, rz: -.3 }; };

  return { frame({ t, bi, lt }) {
    bi = Math.min(bi, 6); const dur = tl.beats[bi] ? tl.beats[bi].dur : 3;
    P.forEach((o) => { o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; o.lie = 0; o.hs = 1; o.scale = 1; o.anim = 'idle'; o.y = 0; }); HP.forEach((o) => { o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; o.lie = 0; o.scale = 1; o.y = 0; o.anim = 'idle'; }); GP.vis = false; GP.arms = null;
    thumb.visible = false; tipRing.visible = false; trail.visible = false; SL.forEach((m) => (m.visible = false)); HS.forEach((s) => (s.visible = false)); whistle.visible = ycard.visible = false; waves.forEach((m) => (m.visible = false)); phA.visible = phB.visible = false; crick.forEach((m) => (m.visible = false)); chirp.visible = whoosh.visible = tumble.visible = false;
    for (let i = 0; i < CF; i++) confM.setMatrixAt(i, confHide);
    confM.visible = bi === 5; cards.visible = true; for (let i = 0; i < N; i++) cards.setMatrixAt(i, confHide);
    let cam = [0, 20, 50, 0, 8, 0, 55]; let cnt = ['', '', '']; let screen = ['count', 0, 100];
    // fans: always there (cheering by default, bored in the last beat)
    FANS.forEach((f, i) => { const o = P[N + i]; place(o, f.x, f.z, f.yaw, 'idle', { y: f.y }); o.phase = f.ph; if (bi === 0 || bi === 5) { o.anim = 'jump'; o.speed = .55 + (i % 7) * .05; o.arms = { lx: -2.6 + .3 * Math.sin(t * 8 + i), rx: -2.6 + .3 * Math.cos(t * 8 + i), lz: .25, rz: -.25 }; } else if (bi === 6) { o.anim = 'sit'; o.y = f.y; } else { o.anim = 'idle'; o.extra = 0; } });
    // commentators
    const comm = (k, x, ph) => { const o = HP[k]; place(o, x, 21.1, Math.PI * 0 + 0, 'idle', { y: 0, arms: { lx: -1.1, rx: -1.1, lz: .3, rz: -.3 } }); o.phase = ph; if (bi === 5) { o.anim = 'jump'; o.arms = { lx: -2.7, rx: -2.7, lz: .3, rz: -.3 }; } };
    comm(3, -14.4, 1); comm(4, -12.0, 2);

    // ------------------------------------------------ guy grid helper (state per beat)
    const guy = (c, r) => P[r * 10 + c];
    const putGrid = (rowsShown, opt = {}) => {
      for (let r = 0; r < rowsShown; r++) for (let c = 0; c < 10; c++) {
        const i = r * 10 + c, o = P[i]; if (opt.skip && opt.skip(c, r)) continue;
        const app = opt.pop ? smooth(clamp((lt - .1 - r * .09 - c * .005) / .18)) : 1; if (app <= 0) continue;
        place(o, gx(c), gz(r), 0, 'idle', { arms: CARD_ARMS, sc: app }); o.phase = (i * 1.7) % 6.28;
        setCard(i, gx(c), 1.18 * app + (opt.wave ? Math.max(0, Math.sin(lt * 7 - r * .7)) * .25 : 0), gz(r) + .58, Math.sin(t * 2 + i) * .04, 0, app);
      }
    };

    if (bi === 0) {
      // establishing: empty field, fans going nuts, the giant thumb practising its swipe in front of the phone
      putGrid(0); screen = ['title', 0, 0];
      const sx = 6 * Math.sin(lt * 2.4); thumbAt(sx, 3.2, 14, -Math.cos(lt * 2.4) * .22);
      cam = [lerp(-6, 2, smooth(lt / 4.5)), lerp(15, 8, smooth(lt / 4.5)), lerp(54, 32, smooth(lt / 4.5)), 0, 11, -20, 56];
    } else if (bi === 1) {
      putGrid(10, { pop: true, wave: lt > 1.3 }); let shown = 0; for (let i = 0; i < N; i++) if (P[i].vis && P[i].scale > .95) shown++;
      const u = smooth(clamp(lt / dur)); cam = [lerp(-2, 2, u), lerp(28, 21, u), lerp(38, 33, u), 0, 1.5, 5, 54];
      cnt = ['GUYS', String(shown), 'on the field'];
      screen = ['count', 0, shown];
    } else if (bi === 2) {
      const sx = sweepL(lt, LT0, LT1); const gone = (c) => lt >= launchHit(c);
      putGrid(9, {}); let launched = 0;
      for (let c = 0; c < 10; c++) {
        const o = guy(c, LROW), i = LROW * 10 + c; const th = launchHit(c);
        if (lt < th) { place(o, gx(c), gz(LROW), 0, 'idle', { arms: CARD_ARMS }); o.phase = (i * 1.7) % 6.28; setCard(i, gx(c), 1.18, gz(LROW) + .58, Math.sin(t * 2 + i) * .04); continue; }
        launched++; const dt = lt - th, v = lv(c); const px = gx(c) + v.vx * dt, py = .2 + v.vy * dt - .5 * GR * dt * dt, pz = gz(LROW) + v.vz * dt;
        place(o, px, pz, -Math.PI / 2, 'panic', { y: Math.max(0, py), speed: 1.4 }); o.lie = -(dt * v.sp * 2.2); o.pitch = 0; o.yaw = lerp(0, -Math.PI / 2, clamp(dt / .1));
        setCard(i, px + .5, py + 1.4 - 0 * dt, pz + .6, dt * 9 + c, dt * 5, 1);
        if (dt < .9) { const m = SL[c]; m.visible = true; const len = 2.4 + v.vy * .08; m.position.set(px + len * .55 * Math.cos(Math.atan2(v.vy - GR * dt, -v.vx)), py + 1.1 + len * .55 * Math.sin(Math.atan2(v.vy - GR * dt, -v.vx)), pz + .2); m.scale.set(len, 1, 1); m.rotation.set(0, 0, -Math.atan2(v.vy - GR * dt, -v.vx)); m.material.opacity = .85 * (1 - dt / .9); }
      }
      // the extra streaks near the thumb
      for (let k = 0; k < 10; k++) { const m = SL[10 + k]; const u = (lt * 1.5 + k * .23) % 1; if (lt < LT0 || lt > LT1 + .25) continue; m.visible = true; m.scale.set(4 + (k % 3), 1, 1); m.position.set(sx + 3.5 + u * 5, 4.2 + (k % 5) * .55, gz(LROW) + 2.2 + (k % 3) * .4); m.rotation.set(0, 0, 0); m.material.opacity = .5 * (1 - u); }
      thumbAt(sx, 2.7, gz(LROW) + .3, (sx > -HX + .5 && lt > LT0 && lt < LT1 + .05) ? .28 : 0, lt > .12 && lt < LT1 + .3); if (lt <= .12 || lt >= LT1 + .3) thumb.visible = false;
      // enter / exit slide for thumb
      if (lt <= LT0) thumbAt(HX, lerp(9, 2.7, smooth(clamp((lt - .1) / (LT0 - .1)))), gz(LROW) + .3, 0, lt > .1); if (lt > LT1) thumbAt(-HX, lerp(2.7, 9, smooth(clamp((lt - LT1) / .3))), gz(LROW) + .3, 0, lt < LT1 + .3);
      if (lt > LT0 && lt < LT1 + .1) { trail.visible = true; trail.material.color.set(0xe8252b); const w = Math.abs(HX - sx); trail.scale.set(w, 2.0, 1); trail.position.set((HX + sx) / 2, 2.2, gz(LROW) + .3); }
      whoosh.visible = lt > 1.1 && lt < 2.2; whoosh.position.set(-5.5, 7.5 + (lt - 1.1) * .6, gz(LROW)); whoosh.material.opacity = 1 - clamp((lt - 1.9) / .3);
      cnt = ['GUYS', String(100 - launched), 'launched ' + launched]; screen = ['left', 0, launched];
      cam = [lerp(1.5, -1.5, smooth(lt / dur)), 9.5, 43, 0, 2.2, 13, 58];
    } else if (bi === 3) {
      const sx = sweepR(lt, .25, 1.4);
      putGrid(9, {}); // front row gone; row 8 is now the front row
      let liked = 0;
      for (let c = 0; c < 10; c++) { const hit = lt > .25 + inv(clamp((gx(c) - 1.7 + HX) / (2 * HX))) * 1.15; if (hit) { liked++; const h = HS[c]; h.visible = true; const dt = lt - (.25 + inv(clamp((gx(c) - 1.7 + HX) / (2 * HX))) * 1.15); const s = clamp(dt / .2) * .9; h.scale.set(s, s, 1); h.position.set(gx(c) + Math.sin(dt * 6 + c) * .15, 3.0 + dt * 1.6, gz(HUGR) + .2); h.material.opacity = 1 - clamp((dt - 1.0) / .5); guy(c, HUGR).pitch = -.08; guy(c, HUGR).extra = 0; } }
      // the woman runs in and hugs the guy in column HUGC
      const hx = gx(HUGC), hz = gz(HUGR); const W = HP[0]; const run0 = 1.0, run1 = 1.9; const ru = smooth(clamp((lt - run0) / (run1 - run0)));
      const hugged = lt >= run1; const wxT = hx + .86;
      if (lt >= run0 - .2) {
        const wxp = lerp(HX + 5, wxT, ru), wzp = lerp(hz + 1.9, hz, smooth(clamp((ru - .72) / .28)));
        if (!hugged) { place(W, wxp, wzp, -Math.PI / 2, 'run', { sp: 1.0 }); }
        else { const hb = Math.abs(Math.sin((lt - run1) * 7)) * .12; place(W, wxT, hz, -Math.PI / 2, 'idle', { y: hb, arms: { lx: -1.5, rx: -1.5, lz: .15, rz: -.15 } }); const G = guy(HUGC, HUGR); G.yaw = Math.PI / 2; G.arms = { lx: -1.5, rx: -1.5, lz: -.15, rz: .15 }; G.y = hb; G.phase = 0; setCard(HUGR * 10 + HUGC, hx, 1.2, hz, 0, 0, .0001); }
      }
      if (hugged) { for (let k = 0; k < 14; k++) { const dt = lt - run1 - k * .11; if (dt < 0) continue; const h = HS[10 + k]; h.visible = true; const s = (.6 + (k % 3) * .25) * clamp(dt / .15); h.scale.set(s, s, 1); h.position.set(hx + .43 + Math.sin(dt * 4 + k * 2) * .8 + (k % 2 ? .4 : -.4), 3.0 + dt * 2.1, hz); h.material.opacity = 1 - clamp((dt - .8) / .4); } }
      thumbAt(sx, lt < .25 ? lerp(9, 2.7, smooth(clamp((lt - .1) / .15))) : (lt > 1.4 ? lerp(2.7, 9, smooth(clamp((lt - 1.4) / .3))) : 2.7), gz(HUGR) + 1.4, lt > .25 && lt < 1.4 ? -.28 : 0, lt > .1 && lt < 1.75);
      if (lt > .25 && lt < 1.45) { trail.visible = true; trail.material.color.set(0x2fd06a); const w = Math.abs(sx + HX); trail.scale.set(w, 2.0, 1); trail.position.set((sx - HX) / 2, 2.2, gz(HUGR) + 1.4); }
      cnt = ['GUYS', '90', hugged ? 'one got hugged' : 'swiped right']; screen = ['right', 0, hugged ? 1 : liked];
      const cz = smooth(clamp((lt - 1.0) / 1.5)); cam = [lerp(0, hx + .6, cz), lerp(9.5, 4.6, cz), lerp(43, hz + 12, cz), lerp(0, hx + .43, cz), lerp(2.2, 1.7, cz), lerp(13, hz, cz), lerp(58, 52, cz)];
    } else if (bi === 4) {
      putGrid(9, { skip: (c, r) => c === GHC && r === GHR }); const gxp = gx(GHC), gzp = gz(GHR);
      // ghost: fades while a ref sprints in
      const fade = 1 - smooth(clamp((lt - .35) / 1.1)); const gy = smooth(clamp((lt - .3) / 1.5)) * .7;
      GP.vis = true; place(GP, gxp, gzp, 0, 'idle', { y: gy + Math.sin(lt * 3) * .06, arms: { lx: -.9, rx: -.9, lz: .2, rz: -.2 } }); ghostMats.forEach((m) => (m.opacity = Math.max(.16, fade * (1 - .1 * Math.sin(lt * 14) * (1 - fade)))));
      setCard(GHR * 10 + GHC, gxp, 1.18 + gy, gzp + .58, 0, 0, 1); { const ci = GHR * 10 + GHC; const ff = Math.max(.12, fade); setCard(ci, gxp, 1.2 + gy, gzp + .58, 0, 0, ff); }
      const R1 = HP[1]; const rx0 = gx(GHC) + .6, rz0 = gz(9) + .6; const run = smooth(clamp((lt - .55) / .75)); const rpx = lerp(HX, rx0 + 1.6, run);
      const arrived = lt >= 1.3;
      if (!arrived) place(R1, rpx, rz0, -Math.PI / 2, 'run', { sp: 1.1 }); else { const bl = lt > 1.45; place(R1, rx0 + 1.6, rz0, -.3, 'idle', { arms: { lx: -.5, rx: -3.0, lz: .15, rz: -.1 }, pitch: bl ? -.1 : 0 }); }
      if (arrived) { whistle.visible = true; ycard.visible = lt > 1.6; waves.forEach((m, k) => { const dt = lt - 1.45 - k * .12; if (dt < 0) return; m.visible = true; const s = .3 + dt * 4; m.scale.setScalar(s); m.material.opacity = Math.max(0, .8 - dt * 1.4); });
      }
      cnt = ['GUYS', lt > 1.0 ? '89' : '90', lt > 1.0 ? 'ghosted' : 'seen 3 days ago']; screen = ['ghost', 0, 0];
      const zu = smooth(clamp(lt / 1.7)); cam = [lerp(-1, gx(GHC) + 1.9, zu), lerp(8, 4.4, zu), lerp(40, 25, zu), lerp(0, gx(GHC) + 1.7, zu), lerp(2.4, 2.0, zu), lerp(13, 15, zu), lerp(56, 48, zu)];
    } else if (bi === 5) {
      // match: confetti, everyone jumps
      putGrid(9, {}); for (let i = 0; i < N; i++) { const o = P[i]; if (!o.vis) continue; o.anim = 'jump'; o.speed = .75 + (i % 7) * .07; o.arms = { lx: -2.7 + .3 * Math.sin(t * 9 + i), rx: -2.7 + .3 * Math.cos(t * 9 + i), lz: .3, rz: -.3 }; }
      for (let i = 0; i < N; i++) if (P[i].vis) { const bounce = Math.abs(Math.sin(P[i].phase + t * 4.5 * P[i].speed)) * .6; setCard(i, P[i].x, 1.9 + bounce * 1.2 + P[i].y, P[i].z + .1, Math.sin(t * 6 + i) * .5, 0, 1); }
      const A = HP[5], B = HP[0]; const mu = smooth(clamp((lt - .1) / 1.2)); const cx = 0, cz = 17.6;
      const hugd = lt > 1.3; const hb = hugd ? Math.abs(Math.sin((lt - 1.3) * 6)) * .35 : 0;
      place(A, lerp(-7, -.35, mu), cz, Math.PI / 2 * (1 - mu) + Math.PI * mu * .0, hugd ? 'idle' : 'run', { y: hb, sp: .9, arms: hugd ? { lx: -2.7, rx: -2.7, lz: .3, rz: -.3 } : null });
      place(B, lerp(7, .35, mu), cz, -Math.PI / 2 * (1 - mu), hugd ? 'idle' : 'run', { y: hb, sp: .9, arms: hugd ? { lx: -2.7, rx: -2.7, lz: .3, rz: -.3 } : null });
      if (hugd) { A.yaw = Math.PI / 2; B.yaw = -Math.PI / 2; }
      // spinning couple pivots at centre
      if (hugd) { const a = (lt - 1.3) * 3.2; A.x = Math.cos(a) * .4; A.z = cz + Math.sin(a) * .4; B.x = -Math.cos(a) * .4; B.z = cz - Math.sin(a) * .4; A.yaw = a + Math.PI / 2 + Math.PI; B.yaw = a + Math.PI / 2; }
      for (let k = 0; k < CF; k++) { const u = ((t * .55 + k * .0453) % 1), ang = k * 2.4; const on = lt > .5; if (!on) continue; const px = Math.cos(ang) * 16 + Math.sin(t * 1.3 + k) * 1.2, pz = Math.sin(ang * 1.7) * 18 + 8; _e.set(t * 6 + k, t * 4 + k * 2, 0); _q.setFromEuler(_e); _p.set(px, 22 - u * 22, pz); _s.setScalar(1.3); _m.compose(_p, _q, _s); confM.setMatrixAt(k, _m); }
      cnt = ['MATCH', 'YES', 'two people matched']; screen = ['match', 0, 0];
      const du = smooth(clamp(lt / dur)); cam = [lerp(-3, 2, du), lerp(13, 9, du), lerp(40, 34, du), 0, 4.0, 10, 60];
    } else {
      // overtime: the couple that matched never texts. Empty, silent stadium.
      putGrid(9, {}); for (let i = 0; i < N; i++) { const o = P[i]; if (o.vis) { o.pitch = .25; o.arms = { lx: -.2, rx: -.2, lz: .1, rz: -.1 }; } }
      for (let i = 0; i < N; i++) if (P[i].vis) setCard(i, P[i].x, .6, P[i].z + .5, 0, 0, .0001);
      const A = HP[5], B = HP[0];
      place(A, -1.7, 30, Math.PI * .5 + .6, 'idle', { arms: { lx: -1.25, rx: -1.25, lz: -.1, rz: .1 }, pitch: .3 }); place(B, 1.7, 30, -Math.PI * .5 - .6, 'idle', { arms: { lx: -1.25, rx: -1.25, lz: -.1, rz: .1 }, pitch: .3 });
      A.yaw = Math.PI * .5 + .15; B.yaw = -Math.PI * .5 - .15; A.x = -1.7; B.x = 1.7;
      phA.visible = phB.visible = true;
      for (let k = 0; k < 6; k++) { const m = crick[k]; m.visible = true; const hop = Math.max(0, Math.sin(t * 5 + k * 1.9)) * .3; m.position.set(-5 + k * 2 + Math.sin(k * 7) * .5, .06 + hop, 31.5 + Math.cos(k * 3) * 1.4); m.rotation.y = k; }
      chirp.visible = lt > .5; chirp.position.set(3.8, 1.6, 33); chirp.scale.set(3.2, 1, 1);
      tumble.visible = true; tumble.position.set(lerp(9, -9, ((t * .08) % 1)), .5 + Math.abs(Math.sin(t * 4)) * .15, 33.5); tumble.rotation.z = -t * 3;
      const blink = Math.floor(t * 1.8) % 2; screen = ['over', blink, 0];
      cnt = ['MESSAGES SENT', '0', 'clock: 99:59']; const zu = smooth(clamp(lt / dur));
      cam = [lerp(0, .6, zu), lerp(3.3, 3.0, zu), lerp(40, 38, zu), 0, lerp(7.3, 7.0, zu), 14, 56];
    }
    drawScreen(screen[0], screen[1], screen[2]);

    crowd.update(t); hero.update(t); ghostC.update(t);
    // phones in hand, whistle, card
    if (bi === 6) { attach(phA, HP[5], 'handR', [.05, -.05, .08], [-.5, 0, 0]); attach(phB, HP[0], 'handR', [-.05, -.05, .08], [-.5, 0, 0]); phA.visible = phB.visible = true; }
    if (bi === 4 && whistle.visible) { attach(whistle, HP[1], 'head', [0, -.12, .26]); }
    if (bi === 4 && ycard.visible) { attach(ycard, HP[1], 'head', [0, 1.05, .05], [0, 0, 0]); ycard.matrix.multiply(new THREE.Matrix4().makeScale(1, 1, 1)); ycard.visible = HP[1].vis; }
    if (bi === 4 && !whistle.visible) whistle.visible = false;
    for (const b of beams) { const ph = t * .5 + b.ph; const tx = Math.sin(ph) * 12, tz = Math.cos(ph * 1.3) * 10 + 6; const from = new THREE.Vector3(b.sx, 30, b.sz), to = new THREE.Vector3(tx, 0, tz); const d = to.clone().sub(from); const len = d.length(); b.g.position.copy(from).addScaledVector(d, .5); b.g.scale.set(1, len / 50, 1); b.g.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d.normalize()); }
    cards.instanceMatrix.needsUpdate = true; confM.instanceMatrix.needsUpdate = true;
    const sh = .02; st.cam(cam[0] + Math.sin(t * 11) * sh, cam[1] + Math.cos(t * 13) * sh, cam[2], cam[3], cam[4], cam[5], cam[6]); st.follow(cam[3] * .5, cam[5] * .5); st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if swiping on *dating apps* was a real sport?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter(cnt[0], cnt[1], cnt[2], '', bi === 6 || (bi === 2));
    hud.tm('');
    let pt = '', pa = 0; POP[bi].forEach(([s, t0]) => { if (lt > t0) { pt = s; pa = Math.min(1, (lt - t0) * 7); } }); hud.pop(pt, pa);
  } };
}
