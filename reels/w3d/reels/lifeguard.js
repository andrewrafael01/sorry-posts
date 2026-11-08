import { drakeLook, makeBubble } from './_drake.js';
// What if Drake was the lifeguard at the world's biggest pool? Parody caricature (generic blocky people, no likeness).
// MrBeast-style: aerial establishing shot, huge props, 36 shocked spectators, 100 crying swimmers, sad whistle rings, hug scoreboard.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, tree, addBox, mat, Crowd, Particles, R, clamp, smooth, lerp, attach } = lib;
  const st = makeStage({ shadowExtent: 60, fogNear: 140, fogFar: 520, skyTop: 0x3f8fe6, skyMid: 0x9fd0f5, skyBot: 0xf4eee2, fog: 0xe3ecf0, sunDir: [-.5, .8, -.45], sunI: 3.0, clouds: false, exposure: 1.05 }); const S = st.scene;
  ground(S, 0xe9ddc2, 900);
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  // ---------------- giant pool
  const water = new THREE.Mesh(new THREE.PlaneGeometry(130, 130), mat(0x1fa3ee, { roughness: .08, metalness: .05 })); water.rotation.x = -Math.PI / 2; water.position.set(0, .02, 65); water.receiveShadow = true; S.add(water);
  const shim = cvs(256, 256, (g) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, 256, 256); const r = R(9); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 3; for (let i = 0; i < 46; i++) { g.beginPath(); const x = r() * 256, y = r() * 256; g.arc(x, y, 6 + r() * 16, r() * 6, r() * 6 + 1.6); g.stroke(); } });
  shim.t.wrapS = shim.t.wrapT = THREE.RepeatWrapping; shim.t.repeat.set(40, 40);
  const shimM = new THREE.Mesh(new THREE.PlaneGeometry(130, 130), new THREE.MeshBasicMaterial({ map: shim.t, transparent: true, opacity: .32, depthWrite: false })); shimM.rotation.x = -Math.PI / 2; shimM.position.set(0, .06, 65); S.add(shimM);
  addBox(S, 0, .06, -.5, 130, .12, 1.0, 0xf4f4f0, { cast: false }); addBox(S, -64.5, .06, 65, 1.0, .12, 130, 0xf4f4f0, { cast: false }); addBox(S, 64.5, .06, 65, 1.0, .12, 130, 0xf4f4f0, { cast: false });
  for (const x of [-52, -44, -36, 36, 44, 52]) { const lane = addBox(S, x, .12, 62, .16, .1, 120, (x / 8 | 0) % 2 ? 0xe8252b : 0xffffff, { cast: false }); }
  // deck dressing: umbrellas, banner, slide, palms
  const banner = cvs(1024, 256, (g, w, h) => { g.fillStyle = '#e8252b'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.fillRect(0, 0, w, 16); g.fillRect(0, h - 16, w, 16); g.fillStyle = '#ffe23a'; g.strokeStyle = '#111'; g.lineWidth = 12; g.font = '900 104px Liberation Sans, Arial'; g.textAlign = 'center'; g.strokeText('LIFEGUARD', w / 2, 170); g.fillText('LIFEGUARD', w / 2, 170); g.font = '800 40px Liberation Sans, Arial'; g.fillStyle = '#fff'; g.strokeText('ON DUTY', w / 2, 220); g.fillText('ON DUTY', w / 2, 220); });
  { const bm = new THREE.Mesh(new THREE.PlaneGeometry(36, 9), new THREE.MeshBasicMaterial({ map: banner.t, side: THREE.DoubleSide })); bm.position.set(-4, 13.5, -22); S.add(bm); for (const x of [-21, 13]) addBox(S, x, 6, -22.2, .6, 12, .6, 0x44464e); }
  // slide tower (left) with big red tube into the pool
  addBox(S, -30, 7, -10, 7, .6, 7, 0xffffff); for (const [dx, dz] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) addBox(S, -30 + dx, 3.5, -10 + dz, .5, 7, .5, 0x3a62c8);
  { const tube = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 22, 16, 1, true), mat(0xe8252b, { roughness: .3, side: THREE.DoubleSide })); tube.position.set(-30, 3.6, 3.6); tube.rotation.x = Math.PI / 2 - .5 + Math.PI; tube.rotation.x = -(Math.PI / 2 - .5); tube.castShadow = true; S.add(tube); }
  // giant inflatable ducks
  const duck = (x, z, s, ry) => { const g = new THREE.Group(); const y = mat(0xffd92a, { roughness: .4 }); const b = new THREE.Mesh(new THREE.SphereGeometry(1.2, 18, 12), y); b.scale.set(1.2, .9, 1.7); b.position.y = .8; const h = new THREE.Mesh(new THREE.SphereGeometry(.7, 16, 12), y); h.position.set(0, 2.2, 1.3); const bk = new THREE.Mesh(new THREE.BoxGeometry(.7, .2, .6), mat(0xff8a1f)); bk.position.set(0, 2.1, 2.0); const tl2 = new THREE.Mesh(new THREE.ConeGeometry(.5, 1, 8), y); tl2.rotation.x = -1.2; tl2.position.set(0, 1.3, -2.2); for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.1, 8, 8), mat(0x111111)); e.position.set(sx * .35, 2.4, 1.7); g.add(e); } g.add(b, h, bk, tl2); g.traverse((m) => (m.castShadow = true)); g.scale.setScalar(s); g.position.set(x, .3, z); g.rotation.y = ry; S.add(g); return g; };
  const ducks = [duck(-40, 44, 4, .6), duck(46, 62, 5, -.8), duck(-48, 80, 4, 2.2), duck(44, 95, 5, .3)];
  for (let i = 0; i < 9; i++) tree(S, -58 + i * 14.5, -30 - (i % 3) * 4, 2.4, i * 3);
  // ---------------- lifeguard chair (giant)
  const CH = { x: 0, z: -3, seat: 3.7 };
  { const white = 0xffffff; for (const [dx, dz] of [[-1.2, -.9], [1.2, -.9], [-1.2, .9], [1.2, .9]]) { const l = addBox(S, CH.x + dx * 1.1, CH.seat / 2, CH.z + dz * 1.1, .26, CH.seat, .26, 0xe8252b); } addBox(S, CH.x, CH.seat - .15, CH.z, 3.4, .3, 3.0, white, { round: .05 }); addBox(S, CH.x, CH.seat + 1.3, CH.z - 1.45, 3.4, 2.6, .25, 0xe8252b, { round: .05 }); addBox(S, CH.x, 1.0, CH.z + 1.4, 3.0, .15, .15, white); addBox(S, CH.x, 2.0, CH.z + 1.4, 3.0, .15, .15, white);
    for (let i = 0; i < 6; i++) addBox(S, CH.x + (i % 2 ? 1.0 : -1.0) * 0, .3 + i * .55, CH.z + 1.9 + .0, 2.6, .12, .5, white);
    const pole = addBox(S, CH.x + 1.7, CH.seat + 3.2, CH.z - 1.2, .16, 6.4, .16, 0xdddddd); const um = new THREE.Mesh(new THREE.ConeGeometry(4.6, 1.6, 12), mat(0xe8252b)); um.position.set(CH.x + 1.7, CH.seat + 6.9, CH.z - 1.2); um.castShadow = true; S.add(um); const um2 = new THREE.Mesh(new THREE.ConeGeometry(4.62, 1.62, 12, 1, true, 0, .52), mat(0xffffff)); um2.position.copy(um.position); S.add(um2);
    const buoy = new THREE.Mesh(new THREE.TorusGeometry(.8, .22, 10, 22), mat(0xff5a1f)); buoy.position.set(CH.x - 1.9, CH.seat - .4, CH.z + .3); buoy.rotation.y = Math.PI / 2; S.add(buoy); }
  // ---------------- bleachers with the shocked crowd
  const TI = 6; for (let k = 0; k < TI; k++) addBox(S, 17, .45 * (k + 1), -5 - k * 2.0, 26, .9 * (k + 1), 2.0, k % 2 ? 0xcfd6e0 : 0xb9c3d1, { round: .03 });
  // scoreboard (beat 5), a giant sign on poles behind the chair
  const sb = cvs(1024, 512, () => {}); const sbDraw = (hugs, fl) => { const g = sb.g, w = 1024, h = 512; g.fillStyle = '#10151f'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ffd92a'; g.lineWidth = 14; g.strokeRect(10, 10, w - 20, h - 20); g.textAlign = 'left'; g.font = '900 96px Liberation Sans, Arial'; g.fillStyle = '#ff4a4a'; g.fillText('DROWNING', 50, 170); g.font = '900 190px Liberation Sans, Arial'; g.fillText('0', 780, 190); g.font = '900 96px Liberation Sans, Arial'; g.fillStyle = fl ? '#fff' : '#9fe08a'; g.fillText('HUGS', 50, 370); g.font = '900 190px Liberation Sans, Arial'; g.fillText(String(hugs), 780, 390); sb.t.needsUpdate = true; };
  sbDraw(0, false); let sbState = '0';
  const board = new THREE.Mesh(new THREE.PlaneGeometry(18, 9), new THREE.MeshBasicMaterial({ map: sb.t })); board.position.set(2, 10, -17); board.rotation.y = 0; S.add(board); const bpoles = [-8, 8].map((dx) => addBox(S, 2 + dx, 5, -17.2, .5, 10, .5, 0x44464e));
  // ---------------- people: 0 Drake, 1 kid, 2..37 bleachers, 38..137 swimmers
  const NB = 36, NSW = 100, I0 = 2, J0 = 38; const crowd = new Crowd(S, 2 + NB + NSW, 77); const P = crowd.p;
  const look = drakeLook(lib, S, crowd, 0, { shirt: 0xe8252b, pants: 0xe8252b, coat: true }); const H = P[0], KID = P[1]; H.h = 1;
  { const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; }; ['torso', 'armL', 'armR'].forEach((k) => col(1, k, 0xff9a3c)); ['legL', 'legR'].forEach((k) => col(1, k, 0x2a62d8)); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(1, k, 0xf1c9a0)); KID.h = 1; col(1, 'hair', 0x5a3a1c); }
  // faces: sad (frown, tears) and happy
  const faceTex = (kind) => cvs(256, 192, (g) => { const eye = (x) => { if (kind === 'happy') { g.strokeStyle = '#2a1a12'; g.lineWidth = 9; g.beginPath(); g.arc(x, 92, 22, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); return; } g.fillStyle = '#f4f4f0'; g.fillRect(x - 21, 74, 42, 22); g.fillStyle = '#3b6ea5'; g.fillRect(x - 10, 76, 20, 18); g.fillStyle = '#10151c'; g.fillRect(x - 5, 80, 10, 10); if (kind === 'sad') { g.fillStyle = 'rgba(120,200,255,.9)'; g.fillRect(x - 6, 98, 12, 52); g.fillRect(x - 10, 98, 20, 10); } };
    eye(78); eye(178); g.fillStyle = '#3a2417'; const l = kind === 'sad' ? -.38 : 0; g.save(); g.translate(78, 50); g.rotate(l); g.fillRect(-28, -6, 56, 11); g.restore(); g.save(); g.translate(178, 50); g.rotate(-l); g.fillRect(-28, -6, 56, 11); g.restore(); g.fillStyle = 'rgba(120,70,40,.28)'; g.fillRect(120, 90, 16, 40); g.fillRect(108, 126, 40, 10);
    g.strokeStyle = '#6a2a24'; g.lineWidth = 10; g.fillStyle = '#7a2e28'; if (kind === 'sad') { g.beginPath(); g.arc(128, 188, 34, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); } else if (kind === 'happy') { g.beginPath(); g.arc(128, 136, 34, .15, Math.PI - .15); g.fill(); g.stroke(); } });
  crowd.faces.sad = faceTex('sad').t; crowd.faces.happy = faceTex('happy').t;
  const whistle = new THREE.Mesh(new THREE.BoxGeometry(.17, .09, .1), mat(0xdddddd, { metalness: .6, roughness: .3 })); S.add(whistle); const lany = new THREE.Mesh(new THREE.TorusGeometry(.16, .015, 6, 16), mat(0xe8252b)); S.add(lany);
  const bd = makeBubble(lib, S, 3.0, 1.1), bk = makeBubble(lib, S, 2.0, .8);
  // ---------------- fx
  const spl = new Particles(S, 160, 0xe8f8ff, .08, { rough: .1 }); const tears = new Particles(S, 300, 0x7fd0ff, .11, { rough: .05, emissive: 0x2a6a9a }); const rain = new Particles(S, 36, 0x6fb0ff, .1, { emissive: 0x204a8a });
  const rings = []; for (let i = 0; i < 8; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .06, 8, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })); m.visible = false; S.add(m); rings.push(m); }
  const rip = []; for (let i = 0; i < 8; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .05, 6, 36), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })); m.rotation.x = Math.PI / 2; m.visible = false; S.add(m); rip.push(m); }
  const cloud = new THREE.Group(); { const cm = mat(0x66707e, { roughness: 1 }); [[0, 0, 0, 1.5], [1.3, -.2, .2, 1.1], [-1.3, -.2, -.1, 1.2], [.5, .5, .1, 1.0], [-.6, .4, .3, 1.0]].forEach(([x, y, z, r]) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), cm); s.position.set(x, y, z); cloud.add(s); }); cloud.visible = false; S.add(cloud); }
  const NS = 48; const spd = new THREE.InstancedMesh(new THREE.BoxGeometry(.05, .05, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .55, fog: false }), NS); spd.frustumCulled = false; S.add(spd); const sr = R(23); const SD = []; for (let i = 0; i < NS; i++) SD.push([sr() * 2 - 1, sr() * 2 - 1, sr(), .6 + sr() * .8]);
  const M4 = new THREE.Matrix4(), V = new THREE.Vector3(), SC = new THREE.Vector3(), Q = new THREE.Quaternion(), V2 = new THREE.Vector3();
  const speedLines = (t, k) => { const cam = st.camera; for (let i = 0; i < NS; i++) { const d = SD[i]; if (k <= 0) { M4.makeScale(0, 0, 0); spd.setMatrixAt(i, M4); continue; } const u = (d[2] + t * d[3] * 1.6) % 1; const dist = 4 + u * 16; V.set(d[0] * dist * .42, d[1] * dist * .6, -dist).applyQuaternion(cam.quaternion).add(cam.position); SC.set(1, 1, .6 + k * 3.2 * d[3]); Q.copy(cam.quaternion); M4.compose(V, Q, SC); spd.setMatrixAt(i, M4); } spd.instanceMatrix.needsUpdate = true; };
  const K = { x: 6, z: 16 }; const SEATY = (s) => CH.seat - .74 * s;
  const put = (o, x, z, yaw, anim = 'idle', sc = 1.2, y = 0, sp = .6) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.scale = sc; o.speed = sp; o.vis = true; };
  const mix = (a, b, u) => a.map((v, i) => lerp(v, b[i], u));
  const eio = (u) => smooth(clamp(u));
  // spectators in the stands: fixed spots
  const BS = []; { const r = R(5); for (let i = 0; i < NB; i++) { const row = i % TI, col = (i / TI) | 0; BS.push({ x: 6.5 + col * 3.6 + (row % 2) * 1.6 + (r() - .5) * .4, z: -5.4 - row * 2.0 + (r() - .5) * .2, y: .9 * (row + 1), ph: r() * 6.28 }); } }
  // swimmers: grid around Drake & kid (center 0,18)
  const SW = []; { const r = R(11); let n = 0; for (let row = 0; row < 14 && n < NSW; row++) for (let c = 0; c < 9 && n < NSW; c++) { const x = (c - 4) * 3.1 + (row % 2) * 1.5 + (r() - .5) * .6, z = 7 + row * 2.2 + (r() - .5) * .5; if (Math.hypot(x - K.x, z - K.z) < 5.5) continue; SW.push({ x, z, ph: r() * 6.28 }); n++; } while (SW.length < NSW) SW.push({ x: 20 + SW.length % 3, z: 8 + SW.length * .3, ph: 1 }); }
  const POP = [['', 0], ['', 0]]; let popT = '';
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); const dur = [3.66, 4.39, 3.66, 5.12, 3.66, 3.66][bi];
    for (let i = 0; i < P.length; i++) { const o = P[i]; o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; o.y = 0; o.anim = 'idle'; }
    board.visible = bpoles.forEach((q) => (q.visible = bi === 5)) || bi === 5; bd.hide(); bk.hide(); cloud.visible = false; whistle.visible = false; lany.visible = false; rings.forEach((m) => (m.visible = false)); rip.forEach((m) => (m.visible = false)); spl.clear(); tears.clear(); rain.clear();
    crowd.setFace(bi <= 2 ? 'shock' : bi <= 4 ? 'sad' : 'happy');
    let cam, cnt = '', cl = '', cnote = '', pop = '', hot = false, spdK = 0, focus = [0, 10];
    const jump = (i, sp = 1.1) => { const b = BS[i], o = P[I0 + i]; put(o, b.x, b.z, Math.atan2(K.x - b.x, K.z - b.z) * .4 + Math.PI * 0, 'jump', 1.2, b.y, sp); o.phase = b.ph; };
    const bleachers = (mode) => { for (let i = 0; i < NB; i++) { const b = BS[i], o = P[I0 + i]; const yaw = Math.atan2(-b.x + 0, 30) * .6 + (mode === 'chair' ? Math.atan2(CH.x - b.x, CH.z - b.z) : Math.atan2(K.x - b.x, K.z - b.z)); put(o, b.x, b.z, yaw, mode === 'cheer' ? 'jump' : 'idle', 1.2, b.y, mode === 'cheer' ? 1.4 : 1); o.phase = b.ph;
      if (mode === 'chair' || mode === 'kid') { o.anim = 'jump'; o.speed = .9 + (i % 5) * .08; } else if (mode === 'sad') { o.anim = 'idle'; o.arms = { lx: -2.3 + Math.sin(t * 5 + b.ph) * .15, rx: -2.3 + Math.sin(t * 5 + b.ph + 1) * .15, lz: .25, rz: -.25 }; o.extra = .05; o.pitch = -.12; } } };
    const sit = (o, x, z, yaw, sc, y) => { put(o, x, z, yaw, 'sit', sc, y); };
    const swimmers = (n, mode) => { for (let i = 0; i < NSW; i++) { const o = P[J0 + i], s = SW[i]; if (i >= n) { o.vis = false; continue; } put(o, s.x, s.z, Math.PI + Math.sin(t * .4 + s.ph) * .35 + Math.atan2(s.x, 8) * .3, 'idle', 1.15, -.62 + Math.sin(t * 2.3 + s.ph) * .06, .8); o.phase = s.ph;
      if (mode === 'cry') { o.arms = { lx: -2.5 + Math.sin(t * 6 + s.ph) * .35, rx: -2.5 + Math.sin(t * 6 + s.ph + 2) * .35, lz: .35, rz: -.35 }; o.pitch = -.28 + Math.sin(t * 3 + s.ph) * .08; o.extra = .1; } else if (mode === 'cheer') { o.anim = 'jump'; o.y = -.62; o.speed = 1; o.arms = null; o.pitch = 0; } } };
    const kidWave = (x, z, k = 1) => { for (let q = 0; q < 36; q++) { const u = (t * 1.7 + q / 36) % 1, a = q * 2.4, r = .5 + u * 1.6 * k; spl.set(q, x + Math.cos(a) * r, .12 + Math.sin(u * Math.PI) * 1.8 * k, z + Math.sin(a) * r, .9 * (1 - u * .3)); } };
    const ripple = (x, z, n = 3) => { for (let i = 0; i < n; i++) { const u = (t * .9 + i / n) % 1; const m = rip[i]; m.visible = true; m.position.set(x, .09, z); m.scale.setScalar(.8 + u * 3.2); m.material.opacity = (1 - u) * .8; } };
    if (bi === 0) {
      // aerial establishing -> fast push onto huge Drake on the chair
      const u = eio(p * 1.15); cam = [...mix([60, 68, 110, 0, 0, 6, 52, .1], [-3.5, 7.0, 18, 2.6, 4.6, -4, 46, -.05], u)]; focus = [0, 0];
      put(H, CH.x, CH.z, 0, 'sit', 2.2, SEATY(2.2)); H.arms = { lx: -.2, rx: -.2, lz: -.15, rz: .15 }; H.pitch = -.04 + Math.sin(t * 3) * .02;
      bleachers('chair'); put(KID, K.x, K.z, 2.3, 'idle', .75, -.4); KID.vis = true; swimmers(0, '');
      cnt = String(Math.round(36 * eio((lt - .2) / 2.2))); cl = 'SHOCKED PEOPLE'; cnote = 'huge pool'; pop = lt > .3 ? 'LIFEGUARD: DRAKE' : ''; spdK = lt < 1.8 ? .8 * (1 - lt / 1.8) : 0;
    } else if (bi === 1) {
      // kid drowning, Drake sprints, jumps in, sits down next to him
      const ts = .95, te = 2.1; const dx = K.x - 1.9, dz = K.z; let hx = CH.x, hz = CH.z, hy = SEATY(2.2), hs = 2.2, anim = 'sit', yaw = Math.atan2(K.x - CH.x, K.z - CH.z); const run = eio((lt - ts) / (te - ts));
      if (lt < ts) { put(H, CH.x, CH.z, yaw, 'sit', 2.2, SEATY(2.2)); H.arms = { lx: -2.5, rx: -2.5, lz: .2, rz: -.2 }; H.pitch = -.05; }
      else if (lt < te) { hx = lerp(CH.x, dx, run); hz = lerp(CH.z, dz, run); const air = clamp((lt - ts) / .5); hs = lerp(2.2, 1.6, air); const ground = air < 1 ? lerp(SEATY(2.2), 0, eio(air)) + Math.sin(air * Math.PI) * 1.2 : Math.abs(Math.sin(lt * 17)) * .3; hy = ground - (hz > 0 ? clamp((hz) / 5) * .5 : 0); put(H, hx, hz, Math.atan2(dx - CH.x, dz - CH.z), air < 1 ? 'jump' : 'sprint', hs, hy, 1.6); H.pitch = air < 1 ? 0 : .3; H.arms = null; spdK = 1; }
      else { const sd = eio((lt - te - .05) / 1.2); const sc = lerp(1.6, 1.5, sd); sit(H, dx, dz, Math.PI / 2, sc, lerp(-.55, -.74 * sc, sd)); H.arms = { lx: -1.1, rx: -1.1, lz: .05, rz: -.05 }; if (lt - te < .35) kidWave(dx, dz, 2.2); }
      if (lt > ts + .3 && lt < te + .5 && hz > 0 && hz < dz - 1) { for (let q = 0; q < 24; q++) { const u = (t * 2.4 + q / 24) % 1; spl.set(80 + q, hx + (Math.random() - .5) * 0, .1 + u * 1.6, hz - u * 1.2, .8 * (1 - u)); } }
      put(KID, K.x, K.z, -Math.PI / 2 + .3, 'panic', .75, -.42 + Math.abs(Math.sin(t * 6)) * .18); KID.vis = true; kidWave(K.x, K.z); ripple(K.x, K.z);
      bleachers('kid'); swimmers(0, '');
      if (lt < .9) bk.show('HELP!!', K.x + 1.3, 3.6, K.z + .5); else if (lt > 3.6) bd.show('...', dx + 1, 4.6, dz + .5);
      pop = lt < .95 ? 'KID DROWNING!!' : lt < 2.1 ? 'SPRINTING' : lt < 3.4 ? 'HE SITS.' : 'IN. THE. WATER.'; cl = 'DROWNING KIDS'; cnt = '1'; cnote = 'drake is on it'; hot = lt < 2.1;
      const cp = [mix([-8, 18, 40, 0, 0, 8, 50, .12], [-6, 6, 8, 2, 3, 12, 56, -.08], eio(lt / .95)), mix([-12, 3.5, -8, 3, 1.5, 9, 52, -.08], [-9, 2.6, 13, 3, 1.8, 15, 56, .06], eio((lt - .9) / 1.2)), mix([-2, 3, 8, 3.5, 1.6, K.z, 48, .06], [-1.5, 3.4, K.z + 10, 4, 1.8, K.z, 44, -.07], eio((lt - 2.1) / 2.3))];
      cam = lt < .95 ? cp[0] : lt < 2.1 ? cp[1] : cp[2]; focus = [3, 10];
    } else if (bi === 2) {
      const dx = K.x - 1.9, dz = K.z; sit(H, dx, dz, Math.PI / 2, 1.5, -.74 * 1.5); H.arms = { lx: -1.3 + Math.sin(t * 3) * .1, rx: -1.0, lz: .1, rz: -.1 }; H.pitch = .12 + Math.sin(t * 2) * .03;
      put(KID, K.x, K.z, -Math.PI / 2 + .1, 'panic', .75, -.42 + Math.abs(Math.sin(t * 6)) * .18); KID.vis = true; kidWave(K.x, K.z, 1.1); ripple(K.x, K.z); ripple(dx, dz, 2);
      bleachers('kid'); swimmers(0, '');
      if (lt > .4 && lt < 1.1) bd.show('how are you', dx + 1.2, 4.6, dz); else if (lt >= 1.1 && lt < 2.2) bd.show('REALLY feeling?', dx + 1.2, 4.6, dz); if (lt > 2.3) bk.show('GLUB', K.x + .5, 3.4, K.z + .3);
      pop = lt < 2.2 ? 'HOW ARE YOU REALLY FEELING' : 'STILL DROWNING'; cl = 'KID STATUS'; cnt = 'DROWNING'; cnote = lt < 2.2 ? 'drake asks the real questions' : 'still drowning'; hot = lt > 2.2;
      cam = mix([K.x - 6, 4.6, K.z + 11, K.x - .8, 2, K.z, 50, .1], [K.x - 3.3, 2.4, K.z + 5.5, K.x - .6, 2.0, K.z, 38, -.08], eio(p)); focus = [K.x, K.z];
    } else if (bi === 3) {
      const n = Math.round(100 * eio((lt - .5) / 2.7)); const dx = K.x - 1.9, dz = K.z;
      swimmers(n, 'cry'); const sc = 1.5; sit(H, dx, dz, Math.PI / 2, sc, -.74 * sc); H.arms = { lx: -1.0, rx: -1.0, lz: .1, rz: -.1 }; H.pitch = .1;
      put(KID, K.x, K.z, -Math.PI / 2 + .1, 'panic', .75, -.42 + Math.abs(Math.sin(t * 6)) * .18); KID.vis = true; kidWave(K.x, K.z, 1.1); ripple(K.x, K.z);
      bleachers('sad'); ripple(dx, dz, 2);
      cnt = String(n); cl = 'SWIMMERS CRYING'; cnote = 'ten minutes later'; hot = true; pop = lt < 1.3 ? '10 MINUTES LATER' : lt < 3.0 ? '100 SWIMMERS' : 'ALL. CRYING.';
      cam = lt < 2.6 ? mix([-22, 32, 58, 0, 0, 16, 52, .12], [-10, 15, 40, 1, 0, 16, 50, -.09], eio(lt / 2.6)) : mix([-10, 15, 40, 1, 0, 16, 50, -.09], [-4, 7.5, 31, 2, 1.2, 17, 44, .08], eio((lt - 2.6) / 2.4)); focus = [0, 16];
    } else if (bi === 4) {
      // sad whistle: Drake back on the chair, droopy, cloud over his head, rings sag
      const dr = eio(lt / 1.3); put(H, CH.x, CH.z, 0, 'sit', 2.2, SEATY(2.2)); H.pitch = .15 + .55 * dr; H.arms = { lx: lerp(-.3, .35, dr), rx: lerp(-.3, .3, dr), lz: -.2, rz: .2 };
      swimmers(100, 'cry'); bleachers('sad');
      look.update(); // placeholder to keep matrices fresh
      const hp = V2.setFromMatrixPosition(H.M.head); const wy = hp.y - .3;
      whistle.visible = lany.visible = true; whistle.position.set(hp.x, hp.y - .55, hp.z + 1.0); whistle.scale.setScalar(2.2); lany.position.set(hp.x, hp.y - 1.2, hp.z + .6); lany.scale.setScalar(2.4); lany.rotation.x = 1.2;
      cloud.visible = true; cloud.position.set(hp.x, hp.y + 2.4 + Math.sin(t * 2) * .12, hp.z); cloud.scale.setScalar(1.15);
      for (let q = 0; q < 36; q++) { const u = (t * 1.4 + q / 36) % 1; rain.set(q, hp.x + Math.sin(q * 5.1) * 1.7, hp.y + 2.0 - u * 3.6, hp.z + Math.cos(q * 3.3) * .9, u < .96 ? 1 : 0); }
      for (let k = 0; k < 8; k++) { const u = (lt - .25 - k * .4) / 1.6; const m = rings[k]; if (u < 0 || u > 1) continue; m.visible = true; const r = .8 + u * 7; m.position.set(hp.x, hp.y - .5 - u * u * 2.6, hp.z + 1.2 + u * 6); m.scale.set(r, r * (1 - u * .35), r); m.material.opacity = (1 - u) * .95; m.material.color.setHex(k % 2 ? 0xffe9a0 : 0xffffff); m.rotation.x = -u * .8; }
      pop = lt < 1.1 ? 'WHISTLE.' : 'SADDEST. WHISTLE. EVER.'; cl = 'SWIMMERS CRYING'; cnt = String(100 + Math.round(lt * 0)); cnote = 'it got worse'; hot = true;
      const u = eio(p * 1.1); cam = mix([2.4, 5.8, 3.5, -.2, 6.0, -2.5, 36, -.1], [16, 9, 22, -1, 4.2, -2, 46, .1], u); focus = [0, 8];
    } else {
      // kid hops out fine, hugs Drake; scoreboard flips to HUGS: 1
      const hx = 3.4, hz = -1.6; const sc = 1.8; put(H, hx, hz, .1, 'idle', sc, 0, .5); H.pitch = lt > 1.5 ? .5 : .05; const hugT = 1.7;
      const hug = eio((lt - 1.5) / .5);
      if (lt < .7) { const u = lt / .7; put(KID, lerp(4.2, 3.9, u), lerp(3, -.6, u), Math.PI + .0, 'jump', .75, Math.sin(u * Math.PI) * 1.4 - lerp(.42, 0, eio(u * 2)), 1.2); }
      else if (lt < hugT) { const u = (lt - .7) / (hugT - .7); put(KID, lerp(3.9, hx + .0, u), lerp(-.6, hz + 1.2, u), Math.PI + Math.sin(u * 3) * .1, 'run', .75, 0, 1.1); }
      else { put(KID, hx, hz + 1.25, Math.PI, 'idle', .75, .25 + Math.abs(Math.sin(t * 6)) * .1); KID.arms = { lx: -2.6, rx: -2.6, lz: .5, rz: -.5 }; }
      KID.vis = true; if (lt >= hugT) { H.arms = { lx: -1.35, rx: -1.35, lz: .5, rz: -.5 }; H.yaw = .1; }
      const hugs = lt >= hugT ? 1 : 0; const key = hugs + (lt > hugT && lt < hugT + .5 ? 'f' : ''); if (key !== sbState) { sbState = key; sbDraw(hugs, key.endsWith('f')); }
      if (hugs) { for (let q = 0; q < 30; q++) { const u = ((t * 1.3 + q / 30) % 1), a = q * 2.4; spl.set(q, hx + Math.cos(a) * 1.4, 3 + u * 5, hz + .6 + Math.sin(a) * .8, 0); } }
      bleachers('cheer'); swimmers(100, 'cheer');
      pop = lt < .7 ? 'KID HOPS OUT' : lt < 1.7 ? 'NEVER DROWNING' : lt < 2.7 ? 'JUST WANTED A HUG' : 'DROWNING: 0   HUGS: 1'; cl = 'DROWNING / HUGS'; cnt = hugs ? '0 / 1' : '0 / 0'; cnote = hugs ? 'drake wins' : 'checking the board'; hot = hugs; spdK = lt < .6 ? .4 : 0;
      cam = lt < 1.5 ? mix([-6, 7, 16, 3.5, 2.5, 0, 50, .1], [3.4, 4.8, 13, 3.4, 3.6, -2, 50, -.06], eio(lt / 1.5)) : mix([3.4, 4.8, 13, 3.4, 3.6, -2, 50, -.06], [3.2, 4.4, 9, 3.3, 3.2, -1.5, 40, .05], eio((lt - 1.5) / 2.1)); focus = [3, 0];
    }
    // tears: fall from crying swimmers' faces
    crowd.update(t); look.update(); look.setVisible(H.vis);
    if (bi === 3 || bi === 4) { for (let k = 0; k < 300; k++) { const o = P[J0 + (k % NSW)]; if (!o.vis) continue; V2.set((k & 1 ? 1 : -1) * .1, -.06, .23).applyMatrix4(o.M.head); const u = (t * 1.6 + (k * .377)) % 1; tears.set(k, V2.x + (k & 1 ? .15 : -.15) * u, V2.y - u * u * 1.5, V2.z + .2 * u, (1 - u * .6)); } }
    spl.done(); tears.done(); rain.done();
    shim.t.offset.set(t * .02, t * .015); ducks.forEach((d, i) => { d.position.y = .3 + Math.sin(t * 1.4 + i) * .12; d.rotation.z = Math.sin(t * 1.1 + i) * .03; });
    // slight handheld drift keeps the camera alive
    const w = t * 1.7; st.cam(cam[0] + Math.sin(w) * .12, cam[1] + Math.cos(w * 1.3) * .08, cam[2], cam[3], cam[4], cam[5], cam[6], cam[7] + Math.sin(t * .9) * .008);
    speedLines(t, spdK); st.follow(focus[0], focus[1]); st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if *Drake* became your lifeguard?' : '', bi === 0 ? 1 : 0);
    hud.counter(cl, cnt, cnote, 'PARODY', hot); hud.tm('');
    hud.pop(pop, pop ? Math.min(1, (lt % 1.4 + .5) * 3) : 0);
  } };
}
