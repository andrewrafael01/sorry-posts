import { room } from './_rooms.js';
import { drakeLook } from './_drake.js';
// Invention chain: Drake bets on the Raptors (generic parody caricature, no likeness). Bet slips, scoreboard TV, ref, tie, cancelled season, "Drake Rule".
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, ground, Crowd, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0xbcd0e4, fogNear: 40, fogFar: 150, clouds: true, skyTop: 0x3f86d8, skyMid: 0x9cc8f0, skyBot: 0xe2eef9, shadowExtent: 34, hemi: 1.5, sunI: 1.6, sunDir: [-.25, .9, -.55], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };

  // ------------------------------------------------------------------ world: living room + plaza
  ground(S, 0x7fae5a, 900, { y: -.04 });
  const plaza = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), mat(0xcfc9bd)); plaza.rotation.x = -Math.PI / 2; plaza.position.set(0, -.01, -23); plaza.receiveShadow = true; S.add(plaza);
  room(lib, S, { wall: 0x2f3f66, floor: 0x9a7650, w: 14, d: 12 });
  S.children.forEach((m) => { if (m.isMesh && Math.abs(m.position.y - 3.55) < .01) m.visible = false; });
  // rug
  { const rug = new THREE.Mesh(new THREE.PlaneGeometry(7, 6), mat(0xa63a3a)); rug.rotation.x = -Math.PI / 2; rug.position.set(-1.2, .012, 3.8); rug.receiveShadow = true; S.add(rug); const r2 = new THREE.Mesh(new THREE.PlaneGeometry(6.3, 5.3), mat(0xe9d9b8)); r2.rotation.x = -Math.PI / 2; r2.position.set(-1.2, .014, 3.8); S.add(r2); }
  // wall decor: Raptors-ish poster, lamp, plant
  { const p = cvs(256, 360, (g, w, h) => { g.fillStyle = '#c8102e'; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; g.fillRect(0, h - 70, w, 70); txt(g, 'RAPTORS', w / 2, 60, 52, '#fff'); g.strokeStyle = '#fff'; g.lineWidth = 12; g.beginPath(); g.arc(w / 2, 190, 62, .3, 5.9); g.stroke(); txt(g, 'GO', w / 2, h - 36, 40, '#ffd92a'); });
    const pm = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.1), new THREE.MeshStandardMaterial({ map: p.t, roughness: .9 })); pm.position.set(3.4, 2.2, 8.33); pm.rotation.y = Math.PI; S.add(pm); addBox(S, 3.4, 2.2, 8.34, 1.62, 2.22, .05, 0x1a1a1a, { cast: false }); }
  { addBox(S, 6.1, .8, 6.9, .08, 1.6, .08, 0x222222); const sh = new THREE.Mesh(new THREE.CylinderGeometry(.28, .45, .5, 14), new THREE.MeshStandardMaterial({ color: 0xffe9a8, emissive: 0xffd36a, emissiveIntensity: .8 })); sh.position.set(6.1, 1.8, 6.9); S.add(sh); addBox(S, 6.1, .04, 6.9, .6, .06, .6, 0x222222); }
  { const pot = new THREE.Mesh(new THREE.CylinderGeometry(.3, .24, .5, 12), mat(0x9a5a3a)); pot.position.set(-6.2, .25, 1.4); pot.castShadow = true; S.add(pot); for (let i = 0; i < 4; i++) { const lf = new THREE.Mesh(new THREE.IcosahedronGeometry(.34, 0), mat(0x2e8a4a, { flatShading: true })); lf.position.set(-6.2 + Math.sin(i * 2) * .18, .8 + i * .22, 1.4 + Math.cos(i * 2) * .18); lf.castShadow = true; S.add(lf); } }
  // TV (corner, angled toward the couch). Screen plane faces +local z.
  const TVyaw = 2.43; const tv = new THREE.Group(); tv.position.set(-4.4, 0, 6.3); tv.rotation.y = TVyaw; S.add(tv);
  const SCRW = 4.6, SCRH = 2.6; const tvc = cvs(1024, 580);
  { const frame = new THREE.Mesh(new THREE.BoxGeometry(SCRW + .24, SCRH + .24, .22), mat(0x0e0f12, { roughness: .4 })); frame.position.set(0, 2.15, .0); frame.castShadow = true; tv.add(frame);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(SCRW, SCRH), new THREE.MeshBasicMaterial({ map: tvc.t, toneMapped: false })); scr.position.set(0, 2.15, .12); tv.add(scr);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(SCRW + .6, .78, .8), mat(0x3a2a1e)); cab.position.set(0, .39, .1); cab.castShadow = true; tv.add(cab); }
  const tvPos = new THREE.Vector3(); tv.updateMatrixWorld(true); tvPos.set(0, 2.15, .1).applyMatrix4(tv.matrixWorld);
  const tvLight = new THREE.PointLight(0x9fc4ff, 0, 14); tvLight.position.set(-3.6, 2.0, 6.4); S.add(tvLight);
  // couch + ottoman (local frame faces +z). Drake sits on it.
  const CX = .5, CZ = 1.5, CYAW = -.71; const couch = new THREE.Group(); couch.position.set(CX, 0, CZ); couch.rotation.y = CYAW; S.add(couch);
  { const cm = mat(0x3c6e9e, { roughness: .8 }); const add = (w, h, d, x, y, z, m = cm) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; couch.add(b); return b; };
    add(3.6, .42, 1.3, 0, .22, -.2); add(3.6, .95, .36, 0, .88, -.78); add(.4, .7, 1.4, -1.85, .45, -.2); add(.4, .7, 1.4, 1.85, .45, -.2);
    for (let i = -1; i <= 1; i += 2) add(1.0, .14, 1.0, i * .85, .5, -.15, mat(0x4a82b6));
    add(1.5, .45, .9, 0, .23, 1.55, mat(0x2d567e)); add(.4, .4, .12, -1.2, .75, -.5, mat(0xf2c230)); }
  const tvTable = null;
  // ------------------------------------------------------------------ plaza: Capitol-style building, steps, easel + giant paper
  const cap = new THREE.Group(); S.add(cap);
  { const stone = mat(0xd6cdb8, { roughness: .9 }); const add = (g, x, y, z) => { g.position.set(x, y, z); g.castShadow = true; g.receiveShadow = true; cap.add(g); return g; };
    add(new THREE.Mesh(new THREE.BoxGeometry(26, 2.25, 10), stone), 0, 1.125, -30); add(new THREE.Mesh(new THREE.BoxGeometry(22, 6, 7), stone), 0, 5.25, -29.5);
    for (let i = 0; i < 9; i++) add(new THREE.Mesh(new THREE.BoxGeometry(15 - i * .1, .3, .95), stone), 0, .15 + i * .26, -17.2 - i * .9 - 0);
    for (let i = 0; i < 8; i++) add(new THREE.Mesh(new THREE.CylinderGeometry(.5, .55, 5.2, 14), mat(0xfffdf8)), -7.7 + i * 2.2, 4.85, -25.9);
    add(new THREE.Mesh(new THREE.BoxGeometry(18.4, .8, 3.4), stone), 0, 7.9, -26.3);
    const sh = new THREE.Shape(); sh.moveTo(-9.2, 0); sh.lineTo(9.2, 0); sh.lineTo(0, 2.4); sh.closePath(); const ped = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 1.2, bevelEnabled: false }), stone); add(ped, 0, 8.3, -27.4);
    add(new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.6, 2.4, 24), stone), 0, 9.45, -29.5);
    add(new THREE.Mesh(new THREE.SphereGeometry(3.5, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xe4ddcc, { roughness: .8 })), 0, 10.65, -29.5);
    add(new THREE.Mesh(new THREE.CylinderGeometry(.5, .6, 1.3, 12), stone), 0, 14.5, -29.5); add(new THREE.Mesh(new THREE.ConeGeometry(.35, 1.0, 10), mat(0xd9ad2b, { metalness: .8, roughness: .3 })), 0, 15.7, -29.5);
    for (let i = 0; i < 6; i++) { const w = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.0, .1), mat(0x4b6a8a)); add(w, -8 + i * 3.2 + (i > 2 ? 0 : 0), 5.3, -25.95 + .2); w.visible = false; }
    for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) add(new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.9, .1), mat(0x5a7a9a)), sx * (13.8 + 0) , 5.5, -24.9 + 0).visible = false;
    cap.position.set(0, 0, 0); }
  // flag poles
  for (const sx of [-1, 1]) { const pole = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 7, 8), mat(0xdddddd)); pole.position.set(sx * 11, 3.5, -14); S.add(pole); const fl = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.3), new THREE.MeshStandardMaterial({ map: cvs(220, 130, (g, w, h) => { for (let i = 0; i < 13; i++) { g.fillStyle = i % 2 ? '#f4f4f4' : '#c8272d'; g.fillRect(0, i * h / 13, w, h / 13 + 1); } g.fillStyle = '#243a7a'; g.fillRect(0, 0, w * .42, h * 7 / 13); }).t, side: THREE.DoubleSide })); fl.position.set(sx * 11 + 1.15, 6.3, -14); S.add(fl); }
  // easel + paper
  const EZ = -12.5; const paperC = cvs(512, 704); const paperM = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.4), new THREE.MeshStandardMaterial({ map: paperC.t, roughness: .9 })); paperM.position.set(0, 2.9, EZ); paperM.castShadow = true; S.add(paperM);
  { const wood = mat(0x6b4a2c); for (const sx of [-1.2, 1.2]) { const l = new THREE.Mesh(new THREE.BoxGeometry(.12, 3.4, .12), wood); l.position.set(sx, 1.7, EZ - .1); l.castShadow = true; S.add(l); } addBox(S, 0, 1.0, EZ - .02, 3.6, .14, .3, 0x6b4a2c); }
  const SIG = (u) => [135 + u * 290 + 30 * Math.sin(u * 24), 552 + 34 * Math.cos(u * 24) - 22 * u];
  let lastSig = -2; const drawPaper = (u, stamp) => { const g = paperC.g, w = 512, h = 704; g.fillStyle = '#f1e7c9'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8a6f3a'; g.lineWidth = 8; g.strokeRect(14, 14, w - 28, h - 28);
    txt(g, 'THE', w / 2, 70, 44, '#3a2a14', { w: 800 }); txt(g, 'DRAKE', w / 2, 150, 104, '#7a1c1c'); txt(g, 'RULE', w / 2, 250, 104, '#7a1c1c'); g.fillStyle = '#3a2a14'; g.fillRect(70, 315, w - 140, 5);
    txt(g, 'SECTION 1: Drake shall', w / 2, 370, 30, '#3a2a14', { w: 700 }); txt(g, 'not watch basketball.', w / 2, 408, 30, '#3a2a14', { w: 700 }); txt(g, 'SECTION 2: See Section 1.', w / 2, 466, 28, '#3a2a14', { w: 700 });
    g.fillStyle = '#3a2a14'; g.fillRect(110, 590, 300, 3); txt(g, 'SIGNED', 150, 618, 24, '#3a2a14', { w: 800, al: 'left' });
    if (u > 0) { g.strokeStyle = '#0d2a8a'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); const n = Math.max(2, Math.floor(u * 140)); for (let i = 0; i <= n; i++) { const [x, y] = SIG(i / 140); if (i === 0) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke(); }
    if (stamp > 0) { g.save(); g.translate(380, 660); g.rotate(-.35); g.scale(.6 + .4 * stamp, .6 + .4 * stamp); g.globalAlpha = stamp; g.strokeStyle = '#1f8a3a'; g.lineWidth = 8; g.strokeRect(-92, -34, 184, 68); txt(g, 'PASSED', 0, 2, 52, '#1f8a3a'); g.restore(); }
    paperC.t.needsUpdate = true; };
  drawPaper(0, 0);
  const pen = new THREE.Group(); { const body = new THREE.Mesh(new THREE.CylinderGeometry(.045, .05, 1.1, 8), mat(0x1c3a8a)); body.position.y = .65; const tip = new THREE.Mesh(new THREE.ConeGeometry(.05, .22, 8), mat(0x111111)); tip.rotation.x = Math.PI; tip.position.y = .0; const feather = new THREE.Mesh(new THREE.BoxGeometry(.3, .8, .02), mat(0xf4f4f4)); feather.position.set(.14, 1.5, 0); feather.rotation.z = -.3; pen.add(body, tip, feather); pen.rotation.z = -.35; pen.scale.setScalar(.45); pen.visible = false; S.add(pen); }
  // ------------------------------------------------------------------ people
  const NP = 6, NCG = 8, N = 2 + NP + NCG; const crowd = new Crowd(S, N, 91); const P = crowd.p; const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  const D = P[0], REF = P[1]; const look = drakeLook(lib, S, crowd, 0, { jersey: 0x1f5a3a }); D.h = 1; D.scale = 1.15; // Drake in a green jersey (generic cue)
  col(1, ['torso', 'armL', 'armR'], 0x16161a); col(1, ['legL', 'legR'], 0x16161a); col(1, ['hair'], 0x2a1d14);
  for (let i = 0; i < NP; i++) { const j = 2 + i; const home = i % 2 === 0; col(j, ['torso', 'armL', 'armR'], home ? 0xc8102e : 0xf4f4f4); col(j, ['legL', 'legR'], home ? 0x111111 : 0x1d3f9a); P[j].h = 1.04 + (i % 3) * .06; }
  for (let i = 0; i < NCG; i++) { const j = 2 + NP + i; col(j, ['torso', 'armL', 'armR', 'legL', 'legR'], [0x1b1f2a, 0x252a38, 0x2a2118][i % 3]); }
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const stripeM = new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: .8 }); const refStripes = [-.2, 0, .2].map((y) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.6, .07, .34), stripeM); S.add(m); return m; });
  const whistle = new THREE.Mesh(new THREE.BoxGeometry(.06, .05, .09), mat(0xdddddd)); S.add(whistle);
  const place = (o, x, z, yaw, anim, y = 0, sp = .5) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.extra = 0; o.vis = true; o.scale = o.sc0 ?? 1; o.arms = null; o.pitch = 0; o.lie = 0; };
  // question marks
  const qT = cvs(128, 128, (g) => { txt(g, '?', 64, 70, 120, '#ffd92a', { stroke: '#111', sw: 14 }); }); const qs = []; for (let i = 0; i < NP + 3; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: qT.t, transparent: true, depthWrite: false })); sp.visible = false; S.add(sp); qs.push(sp); }
  // bet slips
  const mkSlip = (team, c1) => { const s = cvs(256, 360, (g, w, h) => { g.fillStyle = '#fbfbf6'; g.fillRect(0, 0, w, h); g.fillStyle = '#17233f'; g.fillRect(0, 0, w, 62); txt(g, 'BET SLIP', w / 2, 32, 38, '#fff'); g.fillStyle = '#d7d7cf'; for (let i = 0; i < 6; i++) g.fillRect(24, 330 - i * 6, w - 48, 2); txt(g, 'BET ON', w / 2, 100, 26, '#555', { w: 800 }); txt(g, team, w / 2, 160, team.length > 8 ? 46 : 58, c1, { stroke: 'rgba(0,0,0,.0)' }); g.fillStyle = '#ddd'; g.fillRect(20, 200, w - 40, 3); txt(g, '$1,000,000', w / 2, 250, 46, '#0d7a3a'); txt(g, 'NO REFUNDS', w / 2, 304, 24, '#a33', { w: 800 }); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(.5, .7), new THREE.MeshBasicMaterial({ map: s.t, side: THREE.DoubleSide, toneMapped: false })); m.visible = false; S.add(m); return m; };
  const slipA = mkSlip('RAPTORS', '#c8102e'), slipB = mkSlip('AGAINST', '#b01010');
  // banner
  const banT = cvs(1024, 280, (g, w, h) => { g.fillStyle = '#d4141c'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.fillRect(0, 14, w, 8); g.fillRect(0, h - 22, w, 8); txt(g, 'SEASON', w / 2, 100, 150, '#fff', { stroke: '#4a0508', sw: 14 }); txt(g, 'CANCELLED', w / 2, 210, 130, '#ffd92a', { stroke: '#4a0508', sw: 14 }); });
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.75), new THREE.MeshBasicMaterial({ map: banT.t, side: THREE.DoubleSide, toneMapped: false })); banner.visible = false; S.add(banner);
  // 3D confetti
  const NC = 140; const conf = new THREE.InstancedMesh(new THREE.BoxGeometry(.09, .02, .06), new THREE.MeshBasicMaterial({ toneMapped: false }), NC); conf.frustumCulled = false; S.add(conf); const CCOL = [0xffd92a, 0xff3b3b, 0x3bd1ff, 0x6dff6d, 0xff6bd6, 0xffffff]; const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); }; for (let i = 0; i < NC; i++) conf.setColorAt(i, new THREE.Color(CCOL[i % 6])); conf.instanceColor.needsUpdate = true; const hideM = new THREE.Matrix4().makeScale(0, 0, 0);
  // curse cloud + bolt + rain
  const cloud = new THREE.Group(); { const cm = new THREE.MeshStandardMaterial({ color: 0x2c303c, roughness: 1, flatShading: true }); [[0, 0, 0, .62], [.55, .05, .1, .5], [-.55, -.02, -.05, .52], [.2, .25, -.1, .45], [-.25, .2, .12, .42], [.85, -.1, 0, .34], [-.85, -.12, 0, .34]].forEach(([x, y, z, r]) => { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), cm); s.position.set(x, y, z); s.scale.y = .7; s.castShadow = true; cloud.add(s); }); cloud.visible = false; S.add(cloud); }
  const boltM = new THREE.MeshBasicMaterial({ color: 0xfff27a, toneMapped: false }); const bolt = new THREE.Group(); { const pts = [[0, 0], [.18, -.3], [-.05, -.32], [.2, -.65], [-.02, -.68], [.14, -1.0]]; for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; const len = Math.hypot(x1 - x0, y1 - y0); const b = new THREE.Mesh(new THREE.BoxGeometry(.07, len + .04, .07), boltM); b.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); b.rotation.z = -Math.atan2(x1 - x0, y1 - y0) ; bolt.add(b); } bolt.visible = false; S.add(bolt); }
  const NR = 36; const rain = new THREE.InstancedMesh(new THREE.BoxGeometry(.014, .26, .014), new THREE.MeshBasicMaterial({ color: 0x8fb8ff, toneMapped: false }), NR); rain.frustumCulled = false; S.add(rain);
  // ------------------------------------------------------------------ TV canvas
  const drawTV = (state, t, lt, flash) => { const g = tvc.g, w = 1024, h = 580; g.save(); const empty = state === 'cancel' || state === 'banned';
    g.fillStyle = empty ? '#1a1d26' : '#0f1d33'; g.fillRect(0, 0, w, h);
    // bleachers
    const r = (i, k) => cr(i, k); for (let i = 0; i < 180; i++) { const x = (i % 36) * 29 + 8, y = 120 + Math.floor(i / 36) * 28; g.fillStyle = empty ? '#272b36' : `hsl(${(r(i, 1) * 360) | 0},55%,${40 + r(i, 2) * 25}%)`; g.beginPath(); g.arc(x, y + (empty ? 0 : Math.sin(t * 4 + i) * 2), 11, 0, 7); g.fill(); }
    // court
    g.fillStyle = empty ? '#6b5236' : '#d79a52'; g.beginPath(); g.moveTo(80, 575); g.lineTo(944, 575); g.lineTo(800, 275); g.lineTo(224, 275); g.closePath(); g.fill();
    g.strokeStyle = empty ? '#8a7a66' : '#fff'; g.lineWidth = 5; g.stroke(); g.beginPath(); g.moveTo(152, 425); g.lineTo(872, 425); g.stroke(); g.beginPath(); g.ellipse(512, 425, 74, 26, 0, 0, 7); g.stroke(); g.beginPath(); g.moveTo(420, 275); g.lineTo(380, 340); g.lineTo(644, 340); g.lineTo(604, 275); g.stroke();
    for (const x of [512]) { g.fillStyle = '#e8e8ea'; g.fillRect(x - 38, 240, 76, 44); g.strokeStyle = '#e8451c'; g.lineWidth = 6; g.strokeRect(x - 38, 240, 76, 44); }
    if (!empty && state !== 'tie') { for (let i = 0; i < 10; i++) { const home = i % 2 === 0; const px = 512 + Math.sin(t * (.8 + i * .13) + i * 2.1) * (210 - (i % 3) * 20), py = 360 + Math.cos(t * (.6 + i * .09) + i) * 55 + (i % 3) * 38; g.fillStyle = home ? '#c8102e' : '#f4f4f4'; g.beginPath(); g.ellipse(px, py + 6, 15, 7, 0, 0, 7); g.fillStyle = 'rgba(0,0,0,.35)'; g.fill(); g.fillStyle = home ? '#c8102e' : '#f2f2f2'; g.fillRect(px - 9, py - 30, 18, 28); g.fillStyle = '#d9a37a'; g.beginPath(); g.arc(px, py - 38, 9, 0, 7); g.fill(); } g.fillStyle = '#ff8a1c'; g.beginPath(); g.arc(512 + Math.sin(t * 3) * 120, 330 + Math.abs(Math.sin(t * 5)) * -70, 11, 0, 7); g.fill(); }
    if (state === 'tie') for (let i = 0; i < 6; i++) { const px = 330 + i * 70, py = 420 + (i % 2) * 40; g.fillStyle = i % 2 ? '#f4f4f4' : '#c8102e'; g.fillRect(px - 9, py - 30, 18, 28); g.fillStyle = '#d9a37a'; g.beginPath(); g.arc(px, py - 38, 9, 0, 7); g.fill(); txt(g, '?', px, py - 70 + Math.sin(t * 4 + i) * 4, 34, '#ffd92a', { stroke: '#000', sw: 6 }); }
    // scoreboard bar
    const sc = { live: ['96', '98'], loss: ['96', '104'], win: ['104', '98'], both: ['0', '0'], tie: ['0', '0'], cancel: ['--', '--'], banned: ['--', '--'] }[state]; g.fillStyle = '#05070c'; g.beginPath(); g.roundRect(30, 18, w - 60, 112, 18); g.fill();
    txt(g, 'RAPTORS', 180, 54, 40, '#fff'); txt(g, sc[0], 180, 100, 62, '#ff3b4a'); txt(g, 'OPPONENT', 844, 54, 40, '#fff'); txt(g, sc[1], 844, 100, 62, '#9cc4ff');
    txt(g, 'RAPTORS vs OPPONENT', 512, 46, 30, '#ffd92a'); const clk = state === 'live' ? `Q4  0:${String(Math.max(0, 14 - Math.floor(lt * 3 % 14))).padStart(2, '0')}` : state === 'cancel' || state === 'banned' ? 'OFFSEASON' : 'FINAL'; txt(g, clk, 512, 98, 44, '#fff');
    if (state === 'loss') { g.fillStyle = 'rgba(180,0,20,.38)'; g.fillRect(0, 140, w, h); g.fillStyle = '#b3001b'; g.fillRect(0, 440, w, 100); txt(g, 'RAPTORS LOSE (AGAIN)', 512, 492, 66, '#fff', { stroke: '#2a0008', sw: 10 }); }
    if (state === 'win') { g.fillStyle = 'rgba(255,215,60,.2)'; g.fillRect(0, 140, w, h); g.fillStyle = '#0d7a3a'; g.fillRect(0, 440, w, 100); txt(g, 'RAPTORS WIN!', 512, 492, 74, '#fff', { stroke: '#04200f', sw: 10 }); const u = Math.max(0, lt - 3.4); for (let i = 0; i < 90; i++) { const x = (cr(i, 3) * w + Math.sin(u * 3 + i) * 30), y = ((u * (160 + cr(i, 4) * 260) + cr(i, 5) * 300) % 700) - 80; if (u > 0) { g.save(); g.translate(x, y); g.rotate(u * 5 + i); g.fillStyle = ['#ffd92a', '#ff3b3b', '#3bd1ff', '#6dff6d', '#ff6bd6', '#fff'][i % 6]; g.fillRect(-9, -5, 18, 10); g.restore(); } } }
    if (state === 'both') { g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(0, 140, w, h); g.strokeStyle = '#ff1c2e'; g.lineWidth = 62; g.lineCap = 'round'; const k = smooth((lt - 4.3) / .22); g.beginPath(); g.moveTo(200, 190); g.lineTo(200 + 624 * k, 190 + 350 * k); g.stroke(); const k2 = smooth((lt - 4.45) / .22); g.beginPath(); g.moveTo(824, 190); g.lineTo(824 - 624 * k2, 190 + 350 * k2); g.stroke(); txt(g, 'BOTH LOST', 512, 505, 100, '#fff', { stroke: '#000', sw: 16 }); }
    if (state === 'tie') { g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(0, 140, w, h); txt(g, 'TIE', 512, 250, 130, '#ffd92a', { stroke: '#000', sw: 16 }); txt(g, '0 - 0', 512, 380, 150, '#fff', { stroke: '#000', sw: 16 }); txt(g, 'NEW RULE: ???', 512, 500, 64, '#ff8a8a', { stroke: '#000', sw: 10 }); }
    if (state === 'cancel') { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 140, w, h); txt(g, 'SEASON CANCELLED', 512, 330, 92, '#ff3b3b', { stroke: '#000', sw: 14 }); txt(g, 'arena empty', 512, 430, 44, '#c8ccd8', { w: 700 }); }
    if (state === 'banned') { g.fillStyle = '#10131a'; g.fillRect(0, 130, w, h); g.fillStyle = '#ff8a1c'; g.beginPath(); g.arc(512, 300, 100, 0, 7); g.fill(); g.strokeStyle = '#7a3a00'; g.lineWidth = 6; g.beginPath(); g.arc(512, 300, 100, 0, 7); g.moveTo(412, 300); g.lineTo(612, 300); g.moveTo(512, 200); g.lineTo(512, 400); g.stroke(); g.strokeStyle = '#e0141e'; g.lineWidth = 26; g.beginPath(); g.arc(512, 300, 150, 0, 7); g.moveTo(406, 194); g.lineTo(618, 406); g.stroke(); txt(g, 'NO BASKETBALL', 512, 500, 88, '#fff', { stroke: '#000', sw: 14 }); }
    if (flash > 0) { g.fillStyle = `rgba(255,255,255,${flash * .9})`; g.fillRect(0, 0, w, h); }
    g.restore(); tvc.t.needsUpdate = true; };
  // ------------------------------------------------------------------ camera rig
  const E = new THREE.Vector3(), T2 = new THREE.Vector3(), V = new THREE.Vector3(), V2 = new THREE.Vector3(), Q = new THREE.Quaternion(); const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  // shots: [tStart, eye0, eye1, target0, target1, fov0, fov1]; each shot eases inside itself, shots cut. eye/target may be arrays or fn(an)
  const rig = (lt, shots, an, t) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .4);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .035; E.y += Math.sin(t * 1.3 + 1) * .03; E.z += Math.cos(t * .8) * .03; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .012); };
  const SD = Math.sin(CYAW), CD = Math.cos(CYAW);
  const loc = (x, y, z) => [CX + x * CD + z * SD, y, CZ - x * SD + z * CD]; // couch-local -> world
  // ------------------------------------------------------------------ frame
  let curState = '';
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    for (let i = 0; i < N; i++) P[i].vis = false;
    // ---- Drake pose (seated on couch)
    place(D, CX + SD * 0, CZ + 0, CYAW, 'sit', -.3, .4); { const sp = loc(0, 0, .02); D.x = sp[0]; D.z = sp[2]; }
    D.yaw = CYAW; const slumpArms = { lx: -.05, lz: -.12, rx: -.05, rz: .12 }; const cheer = (lt) => Math.sin(lt * 10) * .15;
    let faceShock = false; let slipRpose = false;
    const A0 = { lx: -.35, lz: -.12, rx: -1.35, rz: -.2 };
    if (bi === 0) { const s = smooth((lt - 2.0) / .55); D.arms = { lx: lerp(-.45, slumpArms.lx, s), lz: -.12, rx: lerp(-1.4, -.05, s), rz: lerp(-.2, .12, s) }; D.pitch = lerp(-.04, .62, s); faceShock = lt > 1.95; D.extra = 0; }
    else if (bi === 1) { const prou = smooth((lt - 1.7) / .35), shock = smooth((lt - 3.3) / .3), fp = smooth((lt - 3.7) / .3); D.pitch = lerp(lerp(.05, -.2, prou), .25, shock); D.arms = { lx: lerp(lerp(-.45, -2.5, prou), -.4, shock), lz: -.12 - prou * .1, rx: lerp(lerp(-1.4, -1.5, prou), -2.25, fp), rz: lerp(lerp(-.2, -.1, prou), .5, fp) }; faceShock = lt > 3.3 && lt < 3.75; }
    else if (bi === 2) { const pump = smooth((lt - 2.0) / .3) * (1 - smooth((lt - 3.2) / .3)); const shr = smooth((lt - 5.2) / .35); D.pitch = lerp(-.05, -.18, pump) + lerp(0, -.1, shr); const sw = Math.sin(lt * 14) * .22 * pump; D.arms = { lx: lerp(lerp(-1.4, -2.3, pump) + sw, -.45, shr), lz: lerp(lerp(-.18, -.4, pump), -1.05, shr), rx: lerp(lerp(-1.4, -2.3, pump) - sw, -.45, shr), rz: lerp(lerp(.18, .4, pump), 1.05, shr) }; faceShock = lt > 4.3 && lt < 5.2; }
    else if (bi === 3) { D.pitch = .05 + Math.sin(lt * 2) * .02; D.arms = { lx: -.2, lz: -.12, rx: -2.4 + Math.sin(lt * 9) * .12, rz: .55 }; faceShock = true; }
    else if (bi === 4) { const s = smooth((lt - 1.4) / .8); D.pitch = lerp(.1, .62, s); D.arms = { lx: -.05, lz: -.12, rx: -.05, rz: .12 }; faceShock = false; }
    else { D.pitch = .3; const e = smooth((lt - 3.5) / .3); D.arms = { lx: lerp(-.05, -2.5, e), lz: lerp(-.12, -.9, e), rx: lerp(-.05, -2.5, e), rz: lerp(.12, .9, e) }; }
    // ---- ref + players + congress
    const players = (vis, f) => { for (let i = 0; i < NP; i++) { const o = P[2 + i]; place(o, 2.6 + (i % 3) * 1.45 + (i > 2 ? .7 : 0), 3.2 + Math.floor(i / 3) * 1.9, Math.PI - .15, 'idle', 0, .9); o.sc0 = 1; o.vis = vis; f && f(o, i); } };
    if (bi === 2) { place(REF, -3.2, 3.6, 2.32, 'idle', 0, 1); REF.scale = .8; REF.arms = { lx: -.3, lz: -.1, rx: -2.55 + Math.sin(lt * 10) * .22, rz: .5 }; REF.pitch = .03; }
    if (bi === 3) { place(REF, 1.2, 5.6, Math.PI + .3, 'idle', 0, 1); REF.scale = .85; REF.arms = { lx: -.3, lz: -.1, rx: -2.5 + Math.sin(lt * 10) * .22, rz: .5 }; }
    if (bi === 3) players(true, (o, i) => { const sh = Math.sin(lt * 3 + i); o.arms = i % 2 ? { lx: -2.4 + Math.sin(lt * 9 + i) * .15, lz: -.55, rx: -.2, rz: .12 } : { lx: -.2, lz: -.7 - sh * .15, rx: -.2, rz: .7 + sh * .15 }; o.pitch = .04 * Math.sin(lt * 2 + i); });
    if (bi === 4 && lt < 1.6) players(true, (o, i) => { o.anim = 'walk'; o.speed = 1; o.yaw = Math.PI / 2; o.x = 2.6 + (i % 3) * 1.45 + lt * 3.6; if (o.x > 6.4) o.vis = false; });
    for (let i = 0; i < NCG; i++) { const o = P[2 + NP + i]; if (bi === 5) { const r = i % 2 ? 1 : -1, k = Math.floor(i / 2); place(o, r * (2.8 + k * 1.7), EZ + 3.4 - (k % 2) * .8, (r > 0 ? -.4 : .4), 'idle', 0, .9); const cl = Math.sin(lt * 9 + i); o.arms = { lx: -1.25, lz: .1, rx: -1.25 + cl * .0, rz: -.1 }; o.arms.lx = -1.2 + cl * .15; o.arms.rx = -1.2 - cl * .15; } }
    // ---- TV state
    const tr = { 0: [[1.95, 'loss']], 1: [[3.4, 'win']], 2: [[4.3, 'both']], 3: [[1.5, 'tie']], 4: [[.34, 'cancel']], 5: [[3.9, 'banned']] }[bi]; const init = { 0: 'live', 1: 'live', 2: 'live', 3: 'both', 4: 'tie', 5: 'cancel' }[bi]; let state = init, tt = -9; for (const [ts, s] of tr) if (lt >= ts) { state = s; tt = ts; }
    drawTV(state, t, lt, Math.max(0, 1 - (lt - tt) / .3) * (tt > -9 ? 1 : 0)); tvLight.intensity = state === 'cancel' || state === 'banned' ? .4 : 1.6;
    // ---- poses -> matrices
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t); look.update(); look.setVisible(D.vis);
    // ref stripes
    const rv0 = REF.vis; refStripes.forEach((m, i) => { m.visible = rv0; if (rv0) attach(m, REF, 'torso', [0, -.2 + i * .2, 0]); }); whistle.visible = rv0; if (rv0) attach(whistle, REF, 'torso', [.1, .18, .18]);
    const hR = hp(D, 'handR'), hL = hp(D, 'handL'), head = hp(D, 'head'); const upv = new THREE.Vector3(0, 1, 0);
    // ---- slips
    const right = new THREE.Vector3(CD, 0, -SD); const slipAt = (hand, side) => V.copy(hand).addScaledVector(right, side * .3).add(new THREE.Vector3(0, .4, 0).addScaledVector(new THREE.Vector3(SD, 0, CD), .05));
    slipA.visible = slipB.visible = false; const sa = new THREE.Vector3(), sb = new THREE.Vector3(); let sA = false, sB = false;
    if (bi === 0) { sA = true; sa.copy(slipAt(hR, 1)); const f = Math.max(0, lt - 2.15); sa.y = Math.max(.1, sa.y - 4.9 * f * f); sa.x += f * .3; if (lt < .85) { const u = smooth(lt / .85); sa.y -= (1 - u) * .8; } sA = lt > .1; }
    if (bi === 1) { if (lt < .75) { sA = true; sa.copy(slipAt(hR, 1)); const f = lt / .75; sa.y += f * 1.2; sa.x -= f * .6; sa.z += f * -1; } sB = lt > .3; sb.copy(slipAt(hR, 1)); if (lt < .9) sb.y -= (1 - smooth((lt - .3) / .6)) * .7; }
    if (bi === 2) { sA = true; sB = true; sa.copy(slipAt(hR, 1)); sb.copy(slipAt(hL, -1)); }
    if (bi === 3 || bi === 4) { sA = true; sB = true; sa.set(CX + .8, .12, CZ + 1.3); sb.set(CX - .2, .12, CZ + 1.6); if (bi === 3) { sa.set(CX + .9, .03, CZ + 1.5); } if (bi === 3) { sB = true; } }
    if (bi === 5) { sA = false; sB = false; }
    if ((bi === 0 && lt > 1.7 && lt < 2.8) || (bi === 1 && lt > 2.2 && lt < 3.45) || (bi === 2 && lt > 3.2 && lt < 4.7)) { sA = false; sB = false; }
    // ---- cloud / bolt / rain
    const cl = bi >= 4; cloud.visible = cl; bolt.visible = false; let cr0 = 0; if (cl) { const grow = bi === 4 ? smooth((lt - 2.0) / .6) : 1; cloud.position.set(head.x, head.y + 1.25 + Math.sin(t * 2) * .04, head.z); cloud.scale.setScalar(.01 + grow * (bi === 5 ? .6 : .75)); cloud.visible = grow > .01 && !(bi === 5 && lt > 3.4 && lt < 4.5);
      const ph = (bi === 4 ? lt - 2.6 : lt) * 1.7; const fl = (ph > 0 && ((ph % 1) < .13 || ((ph + .35) % 1) < .06)); bolt.visible = fl && cloud.visible; bolt.position.set(cloud.position.x + .05, cloud.position.y - .3, cloud.position.z + .2); bolt.scale.setScalar(1.15); if (fl) cr0 = 1; }
    A.hemi.intensity = lerp(1.5, .7, cl ? 1 : 0) * (1) + cr0 * 1.6; A.sun.intensity = cl ? .8 + cr0 * 1.2 : 1.6;
    for (let i = 0; i < NR; i++) { const on = cl && cloud.visible; if (!on) { rain.setMatrixAt(i, hideM); continue; } const u = ((t * 1.7 + i * .137) % 1); const m = new THREE.Matrix4().setPosition(cloud.position.x + (cr(i, 7) - .5) * 1.5, cloud.position.y - .3 - u * 1.9, cloud.position.z + (cr(i, 8) - .5) * 1.0); rain.setMatrixAt(i, m); } rain.instanceMatrix.needsUpdate = true;
    // ---- confetti (beat 1 win + beat 2 start none)
    { const u = bi === 1 ? lt - 3.4 : -1; const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(1, 1, 1), ps = new THREE.Vector3(); for (let i = 0; i < NC; i++) { if (u <= 0) { conf.setMatrixAt(i, hideM); continue; } const bx = -3.6 + (cr(i, 1) - .5) * 2.6, bz = 5.4 + (cr(i, 2) - .5) * 2.4; ps.set(bx + (cr(i, 3) - .5) * 1.2 * u, 3.9 + (cr(i, 4)) * .9 - u * (1.2 + cr(i, 5) * 1.0), bz + (cr(i, 6) - .5) * u * 1.1); if (ps.y < .05) ps.y = .05; e.set(u * 6 + i, u * 4 + i * 2, i); q.setFromEuler(e); m.compose(ps, q, sc); conf.setMatrixAt(i, m); } conf.instanceMatrix.needsUpdate = true; }
    // ---- banner (beat 4)
    banner.visible = bi === 4 && lt > .3 || bi === 5 && lt < 3.4; if (bi === 4) { const f = Math.max(0, lt - .3); const y = Math.max(2.9, 6.5 - 14 * f * f * 1.2); const b = f > .45 ? Math.sin((f - .45) * 14) * Math.exp(-(f - .45) * 4) * .25 : 0; banner.position.set(.5, y + Math.abs(b), 8.32); banner.rotation.y = Math.PI; } else { banner.position.set(.5, 2.9, 8.32); banner.rotation.y = Math.PI; }
    // ---- question marks
    qs.forEach((s) => (s.visible = false)); if (bi === 3 || (bi === 2 && lt > 4.4)) { let k = 0; if (bi === 3) for (let i = 0; i < NP; i++) { const o = P[2 + i]; const s = qs[k++]; s.visible = lt > 1.5 + i * .1; s.position.set(o.x, 2.55 + Math.sin(t * 3 + i) * .08, o.z); s.scale.setScalar(.5 * clamp((lt - 1.5 - i * .1) / .2)); } const r = REF; if (r.vis) { const s = qs[k++]; s.visible = true; s.position.set(r.x, 2.15 + Math.sin(t * 3) * .06, r.z); s.scale.setScalar(.5); } if (bi === 3) { const s = qs[k++]; s.visible = lt > 2.6; s.position.set(head.x, head.y + .8, head.z); s.scale.setScalar(.5); } }
    // ---- paper / pen
    paperM.visible = pen.visible = false; const showP = bi === 5 && lt < 3.4; paperM.visible = showP; cap.visible = true; if (showP) { const u = clamp((lt - 2.3) / .85), st2 = clamp((lt - 3.2) / .15); const key = Math.round(u * 140) + st2 * 1000; if (key !== lastSig) { lastSig = key; drawPaper(u, st2); } if (u > 0 && u < 1) { const [cx, cy] = SIG(u); pen.visible = true; pen.position.set((cx / 512 - .5) * 3.2 + .05, 2.9 + (.5 - cy / 704) * 4.4, EZ + .15); } }
    // ---- camera
    const an = { slip: new THREE.Vector3(), head }; an.slip.copy(bi === 2 ? sa.clone().lerp(sb, .5) : bi === 1 && lt > .6 ? sb : sa);
    const Fw = new THREE.Vector3(SD, 0, CD); const dk = (x, y, z) => [x, y, z];
    const fr = (r, s, u) => (a) => [a.head.x + Fw.x * r + right.x * s, a.head.y + u, a.head.z + Fw.z * r + right.z * s]; // in front of Drake, looking at his face
    const bh = (r, s, u) => (a) => [a.head.x - Fw.x * r + right.x * s, a.head.y + u, a.head.z - Fw.z * r + right.z * s]; // behind Drake, over the shoulder
    const slF = (r, s, u) => (a) => [a.slip.x + Fw.x * r + right.x * s, a.slip.y + u, a.slip.z + Fw.z * r + right.z * s];
    const slT = (a) => [a.slip.x, a.slip.y, a.slip.z]; const hdT = (dy = 0) => (a) => [a.head.x, a.head.y + dy, a.head.z]; const TVt = dk(tvPos.x + .3, tvPos.y - .1, tvPos.z - .3);
    if (bi === 0) rig(lt, [[0, fr(3.0, -.6, .55), fr(2.3, -.4, .35), hdT(0.15), hdT(0.1), 46, 42], [1.0, slF(1.5, .25, .05), slF(1.0, .15, .0), slT, slT, 42, 38], [1.7, bh(1.9, 1.3, 1.3), bh(1.4, 1.0, 1.1), TVt, TVt, 56, 46], [2.8, fr(2.4, .3, .3), fr(1.7, .2, 0), hdT(0.1), hdT(0.0), 44, 40]], an, t);
    else if (bi === 1) rig(lt, [[0, fr(2.7, .6, .25), fr(2.0, .4, .15), hdT(-0.05), hdT(0.0), 46, 42], [1.2, fr(2.3, -.5, .2), fr(1.7, -.3, .1), hdT(0.2), hdT(0.15), 42, 40], [2.2, bh(2.1, -1.3, 1.4), bh(1.6, -1.0, 1.2), TVt, TVt, 56, 46], [3.45, fr(2.3, .3, .2), fr(1.8, .2, .1), hdT(0.2), hdT(0.2), 44, 40]], an, t);
    else if (bi === 2) rig(lt, [[0, fr(2.5, 0, .1), fr(2.0, 0, 0), (a) => [a.slip.x, a.slip.y - .1, a.slip.z], (a) => [a.slip.x, a.slip.y - .15, a.slip.z], 50, 46], [1.5, fr(2.8, .5, .3), fr(2.2, .4, .2), hdT(0.0), hdT(-0.1), 46, 42], [3.2, bh(2.1, 1.3, 1.4), bh(1.5, 1.0, 1.2), TVt, TVt, 56, 46], [4.7, dk(0, 2.1, .3), dk(-.3, 2.1, .6), dk(-3.3, 1.25, 3.7), dk(-3.3, 1.3, 3.7), 46, 40], [5.5, fr(3.0, .2, .5), fr(2.5, .2, .4), hdT(-0.1), hdT(-0.1), 52, 48]], an, t);
    else if (bi === 3) rig(lt, [[0, bh(3.6, 1.0, 1.3), bh(2.9, .6, 1.2), TVt, TVt, 54, 48], [1.5, dk(0, 2.0, -1.5), dk(1.0, 2.2, -1.8), dk(4.2, 1.4, 4.2), dk(4.3, 1.4, 4.2), 52, 58], [3.0, fr(2.7, .5, .4), fr(2.1, .4, .3), hdT(0.1), hdT(0.05), 52, 46]], an, t);
    else if (bi === 4) rig(lt, [[0, dk(1.2, 2.4, -1.2), dk(2.6, 2.6, -1.8), dk(.5, 2.4, 6.0), dk(.5, 2.4, 6.0), 62, 60], [1.4, bh(3.5, 1.3, 1.5), bh(3.0, 1.0, 1.3), dk(-.8, 2.3, 6.2), dk(-.8, 2.3, 6.2), 56, 52], [2.8, fr(3.1, .4, .8), fr(2.4, .3, .9), hdT(.5), hdT(.55), 50, 44], [4.3, fr(2.3, .8, 1.1), fr(1.8, .6, 1.0), hdT(.7), hdT(.8), 44, 40]], an, t);
    else if (bi === 5) rig(lt, [[0, dk(-7, 3.6, -2.5), dk(-4.5, 3.6, -8), dk(0, 5.5, -30), dk(0, 5.5, -30), 58, 54], [1.3, dk(1.5, 2.8, -7.5), dk(.6, 2.9, -8.8), dk(0, 2.9, EZ), dk(0, 2.9, EZ), 50, 46], [2.3, dk(.9, 3.0, -10.4), dk(.3, 3.0, -9.9), dk(.2, 2.6, EZ), dk(.2, 2.3, EZ), 40, 34], [3.45, bh(3.2, 1.2, 1.3), bh(2.6, 1.0, 1.2), TVt, TVt, 56, 48], [4.5, fr(2.9, .4, .3), fr(2.0, .2, .1), hdT(0.3), hdT(0.2), 50, 40]], an, t);
    // ---- slips (billboard toward camera)
    const cm = A.camera; for (const [m, on, pos] of [[slipA, sA, sa], [slipB, sB, sb]]) { m.visible = on; if (on) { m.position.copy(pos); m.quaternion.copy(cm.quaternion); const f = bi === 0 && lt > 2.15 ? lt * 5 : 0; m.rotateZ(.12 + Math.sin(f) * .5); } }
    if (bi === 1 && lt < .75) { slipA.rotateZ(lt * 6); }
    A.follow(0, 2); A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    const LAB = 'Drake’s losses', VAL = ['$1,000,000', '$2,000,000', '$4,000,000', '$4,000,000', '$4,000,000', '$0 left to lose'][bi], NOTE = ['all on the Raptors', 'betting against them', 'betting both sides', 'refund pending', 'the curse is undefeated', 'one federal law later'][bi];
    hud.counter(LAB, VAL, '', 'PARODY', bi >= 2); { const tg = document.getElementById('tag'); tg.style.display = 'block'; tg.style.top = '246px'; }
    hud.tm(''); hud.pop('', 0);
  } };
}
