import { room } from './_rooms.js';
import { makeBubble } from './_drake.js';
// What if you had to announce your crush on the morning announcements? A school: principal's office + cafeteria.
// Gags: hero at the PA mic (sound rings, "copy that", VP crying) / vote 412 to 3 (tall brothers) / Maya "who?" "me" + freeze + fork falls /
// lunch lady "aww" shakes the building / couple holds hands, hearts, applause / yearbook "SEE ANNOUNCEMENTS", brothers on page 12.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, Particles, clamp, smooth, lerp, attach, dropBounce } = lib;
  const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ fog: 0xe9dcc0, fogNear: 22, fogFar: 60, clouds: false, skyTop: 0xe9dcc0, skyMid: 0xe9dcc0, skyBot: 0xe9dcc0, shadowExtent: 16, hemi: 1.6, sunI: 1.7, sunDir: [-.3, 1, -.45], exposure: 1.12 });
  const S = A.scene;
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const SANS = 'Liberation Sans, Arial, sans-serif';
  room(lib, S, { wall: 0xf2e4b8, floor: 0xd8d0bc, w: 20, d: 12 });
  // checker floor over the cafeteria half
  { const ck = cvs(256, 256, (g) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#e4dcc6' : '#c9c2ac'; g.fillRect(i * 32, j * 32, 32, 32); } }); ck.t.wrapS = ck.t.wrapT = THREE.RepeatWrapping; ck.t.repeat.set(5, 5); const f = new THREE.Mesh(new THREE.PlaneGeometry(20, 12), new THREE.MeshStandardMaterial({ map: ck.t, roughness: .5 })); f.rotation.x = -Math.PI / 2; f.position.set(0, .006, 3); f.receiveShadow = true; S.add(f); }
  // ---------------- office
  addBox(S, 6.6, .025, 6.0, 6.8, .05, 5.2, 0x35508c, { cast: false });
  const desk = addBox(S, 5.6, .45, 5.8, 1.1, .9, 2.6, 0x8a5a34, { round: .04 }); addBox(S, 5.6, .93, 5.8, 1.25, .06, 2.75, 0xa56e3e, { round: .02 });
  addBox(S, 5.9, 1.0, 6.7, .5, .02, .35, 0xf4f4ee); addBox(S, 5.75, 1.03, 4.8, .12, .1, .35, 0x222831); // paper + phone
  const mic = new THREE.Group(); { const mm = mat(0x2a2d33, { metalness: .5, roughness: .35 }); const base = new THREE.Mesh(new THREE.CylinderGeometry(.16, .18, .05, 16), mm); base.position.y = .025; const stalk = new THREE.Mesh(new THREE.CylinderGeometry(.025, .03, .55, 8), mm); stalk.position.set(-.1, .3, 0); stalk.rotation.z = .35; const head = new THREE.Mesh(new THREE.SphereGeometry(.1, 16, 12), mat(0x888d96, { metalness: .6, roughness: .3 })); head.position.set(-.2, .58, 0); const grille = new THREE.Mesh(new THREE.CylinderGeometry(.105, .105, .02, 16), mat(0xe03c3c)); grille.position.set(-.2, .47, 0); grille.rotation.z = 0; mic.add(base, stalk, head, grille); mic.traverse((m) => (m.castShadow = true)); mic.position.set(5.2, .96, 5.4); S.add(mic); }
  const MICH = new THREE.Vector3(5.0, 1.54, 5.4); // mic head world position
  { const plq = cvs(256, 64, (g) => { g.fillStyle = '#c9a24a'; g.fillRect(0, 0, 256, 64); g.fillStyle = '#2a1f0d'; g.font = '800 34px ' + SANS; g.textAlign = 'center'; g.fillText('PRINCIPAL', 128, 44); }); const pl = new THREE.Mesh(new THREE.BoxGeometry(.9, .22, .08), [0, 1, 2, 3, 4, 5].map((i) => (i === 4 ? new THREE.MeshStandardMaterial({ map: plq.t }) : mat(0xc9a24a)))); pl.position.set(5.12, 1.07, 6.8); pl.rotation.y = -Math.PI / 2; S.add(pl); pl.visible = false; }
  // office wall dressing (east wall x=9.85)
  addBox(S, 9.8, 2.2, 5.6, .06, 1.3, 1.8, 0x9fd0f2, { mat: { emissive: 0x7ab4e0, emissiveIntensity: .45 } }); addBox(S, 9.78, 2.2, 5.6, .05, 1.4, .08, 0xffffff); addBox(S, 9.78, 2.2, 5.6, .05, .08, 1.9, 0xffffff);
  for (let i = 0; i < 3; i++) addBox(S, 9.8, 2.2 + (i % 2) * .15, 7.6 + i * .0, .05, .5, .4, 0x5a3b22).position.z = 3.3 + i * .6;
  addBox(S, 9.8, 1.6, 8.0, .05, .08, .08, 0x777777); const flag = addBox(S, 9.78, 2.2, 8.0, .04, .9, 1.3, 0x2f4fa8); addBox(S, 9.76, 2.2, 8.0, .03, .22, 1.3, 0xffffff); addBox(S, 9.76, 2.45, 8.0, .03, .15, 1.3, 0xd0302f);
  addBox(S, 3.0, 1.0, 4.5, .12, 2.0, 4.0, 0xffffff, { cast: false }).visible = false;
  // ---------------- lockers (colored boxes) along back wall + west wall
  const LK = [0xd8433b, 0x3a7bd5, 0xf0b429, 0x3fb38a, 0x8a5bd0, 0xe97f3a];
  for (let i = 0; i < 17; i++) { const x = -9.5 + i * .56; const c = LK[i % LK.length]; addBox(S, x, 1.1, 8.15, .54, 2.2, .5, c); addBox(S, x, 1.75, 7.88, .34, .08, .02, 0x20242c, { cast: false }); addBox(S, x, 1.0, 7.88, .06, .22, .03, 0xcfd3da, { cast: false }); }
  for (let i = 0; i < 9; i++) { const z = 1.6 + i * .56; const c = LK[(i + 3) % LK.length]; addBox(S, -9.55, 1.1, z + 2.5, .5, 2.2, .54, c); addBox(S, -9.28, 1.75, z + 2.5, .02, .08, .34, 0x20242c, { cast: false }); addBox(S, -9.28, 1.0, z + 2.5, .03, .22, .06, 0xcfd3da, { cast: false }); }
  // ---------------- tables + trays
  const TB = [[-6.8, 4.4], [-2.6, 4.4], [-6.8, 1.0], [-2.6, 1.0]]; const trays = [];
  for (const [cx, cz] of TB) {
    addBox(S, cx, .85, cz, 3.0, .08, 1.1, 0xe9e2cf, { round: .02 }); for (const dx of [-1.3, 1.3]) addBox(S, cx + dx, .42, cz, .08, .84, .9, 0x6b7280);
    for (const s of [-1, 1]) { addBox(S, cx, .48, cz + s * .95, 2.9, .06, .4, 0xc86a3a, { round: .02 }); for (const dx of [-1.3, 1.3]) addBox(S, cx + dx, .24, cz + s * .95, .08, .48, .3, 0x6b7280); }
    for (const s of [-1, 1]) for (const k of [-1, 1]) { const g = new THREE.Group(); const tr = new THREE.Mesh(new THREE.BoxGeometry(.8, .05, .55), mat(0xe8503d)); tr.castShadow = true; tr.receiveShadow = true; const f1 = new THREE.Mesh(new THREE.BoxGeometry(.28, .08, .22), mat(0xf2c14a)); f1.position.set(-.18, .06, 0); const f2 = new THREE.Mesh(new THREE.BoxGeometry(.2, .1, .2), mat(0x6bbf59)); f2.position.set(.15, .07, .1); const f3 = new THREE.Mesh(new THREE.BoxGeometry(.16, .14, .16), mat(0xf4f4f4)); f3.position.set(.2, .1, -.15); [f1, f2, f3].forEach((m) => (m.castShadow = true)); g.add(tr, f1, f2, f3); g.position.set(cx + k * .8, .93, cz + s * .25); S.add(g); trays.push({ g, ph: Math.random() * 6, y0: .93 }); }
  }
  // speakers on the walls
  const SPK = [[-9.2, 3.0, 8.28, 0], [-1.5, 3.0, 8.28, 0], [4.5, 3.05, 8.28, 0], [9.7, 2.9, 3.0, -Math.PI / 2]]; const spk = SPK.map(([x, y, z, ry]) => { const g = new THREE.Group(); const bx = new THREE.Mesh(new THREE.BoxGeometry(.7, .7, .22), mat(0x6c7078)); const cone = new THREE.Mesh(new THREE.CylinderGeometry(.22, .1, .1, 14), mat(0x1f2228)); cone.rotation.x = Math.PI / 2; cone.position.z = .14; g.add(bx, cone); g.position.set(x, y, z - .1); g.rotation.y = ry + Math.PI * 0 ; if (ry === 0) g.rotation.y = Math.PI; g.traverse((m) => (m.castShadow = true)); S.add(g); return { g, cone, x, y, z }; });
  // ---------------- scoreboard (back wall)
  const sb = cvs(1024, 280, () => {}); const sbMat = new THREE.MeshBasicMaterial({ map: sb.t }); const sbMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 1.04), sbMat); sbMesh.position.set(-6.5, 2.9, 8.2); sbMesh.rotation.y = Math.PI; S.add(sbMesh); const sbBack = addBox(S, -6.5, 2.9, 8.26, 4.0, 1.2, .08, 0x1b1f27);
  let sbKey = ''; const drawSB = (a, b, show) => { const k = a + '|' + b + '|' + show; if (k === sbKey) return; sbKey = k; const g = sb.g; g.fillStyle = '#0d1a2e'; g.fillRect(0, 0, 1024, 280); g.textAlign = 'center'; g.font = '800 34px ' + SANS; g.fillStyle = '#9fd0ff'; g.fillText('ANNOUNCEMENT VOTE', 512, 44); g.fillStyle = '#3fe08a'; g.fillText('FOR', 270, 96); g.fillStyle = '#ff6a5a'; g.fillText('AGAINST', 760, 96); g.font = '900 150px ' + SANS; g.fillStyle = '#3fe08a'; g.fillText(String(a), 270, 235); g.fillStyle = '#ff6a5a'; g.fillText(show ? String(b) : '0', 760, 235); g.fillStyle = '#334'; g.fillRect(508, 70, 8, 190); sb.t.needsUpdate = true; };
  // ---------------- people
  const NS = 16; const crowd = new Crowd(S, 8 + NS + 1, 91); const P = crowd.p; const HERO = P[0], MAYA = P[1], PRIN = P[2], VP = P[3], LADY = P[4], BRO = [P[5], P[6], P[7]]; const ST = P.slice(8, 8 + NS), WALK = P[8 + NS];
  const col = (i, ks, c) => ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c)));
  const paint = (i, o) => { if (o.shirt != null) col(i, ['torso', 'armL', 'armR'], o.shirt); if (o.pants != null) col(i, ['legL', 'legR'], o.pants); if (o.skin != null) col(i, ['head', 'neck', 'handL', 'handR'], o.skin); if (o.hair != null) col(i, ['hair'], o.hair); };
  paint(0, { shirt: 0xe8793a, pants: 0x2a3a5c, skin: 0xf1c9a5, hair: 0x4a2f1c }); paint(1, { shirt: 0xb07ae0, pants: 0x3b3f5a, skin: 0xc68642, hair: 0x1a1210 }); paint(2, { shirt: 0x3c4150, pants: 0x30343f, skin: 0xe0ac86, hair: 0xe0ac86 }); paint(3, { shirt: 0x6a9a62, pants: 0x4a4f5c, skin: 0xf6d7b8, hair: 0x9a9a9a }); paint(4, { shirt: 0xf08fb0, pants: 0x3a3f4b, skin: 0xad7a52, hair: 0x5a3a22 });
  [0x2f5a8a, 0x3a6a9a, 0x24486e].forEach((c, k) => paint(5 + k, { shirt: c, pants: 0x1f2430, skin: [0xc68642, 0xb87a3c, 0xc68642][k], hair: 0x14100d }));
  const SH = [0xe74c3c, 0xf1c40f, 0x2ecc71, 0x3498db, 0x9b59b6, 0xe67e22, 0x1abc9c, 0xff7aa2, 0xffffff, 0x7fd1ae]; ST.forEach((o, i) => paint(8 + i, { shirt: SH[i % SH.length] })); paint(8 + NS, { shirt: 0x34c0a0, pants: 0x3a3f4b });
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const box = (w, h, d, c, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.m || mat(c)); m.castShadow = true; S.add(m); return m; };
  const hood = box(.62, .3, .22, 0xe8793a), pocket = box(.4, .2, .04, 0xd0662b), hoodStr1 = box(.04, .22, .03, 0xf4f4f4), hoodStr2 = box(.04, .22, .03, 0xf4f4f4);
  const pony = box(.16, .46, .16, 0x1a1210), tie2 = box(.07, .08, .1, 0xffd92a);
  const tie = box(.1, .42, .03, 0xc4252a), tieK = box(.14, .1, .04, 0xc4252a), collar = box(.34, .06, .03, 0xf4f4f0);
  const apron = box(.6, .6, .04, 0xffffff), net = box(.5, .2, .5, 0x9fd0ff, { m: mat(0x9fd0ff, { transparent: true, opacity: .55 }) });
  const tissue = box(.14, .14, .04, 0xffffff), tissue2 = box(.14, .14, .04, 0xffffff), thumb = box(.05, .13, .05, 0xe0ac86);
  const glasses = box(.01, .01, .01, 0x222222); glasses.visible = false;
  const fork = (() => { const g = new THREE.Group(); const m = mat(0xdfe3ea, { metalness: .9, roughness: .2 }); const h = new THREE.Mesh(new THREE.BoxGeometry(.04, .3, .02), m); h.position.y = -.12; g.add(h); const b = new THREE.Mesh(new THREE.BoxGeometry(.14, .05, .02), m); b.position.y = .06; g.add(b); for (let i = -1; i <= 1; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(.025, .16, .02), m); t.position.set(i * .055, .16, 0); g.add(t); } g.traverse((q) => (q.castShadow = true)); g.matrixAutoUpdate = false; S.add(g); return g; })();
  const bites = []; for (let i = 0; i < 8; i++) { const f = fork.clone(true); f.matrixAutoUpdate = false; f.visible = false; S.add(f); bites.push(f); }
  // heart sprites + particles
  const heartTex = cvs(128, 128, (g) => { g.fillStyle = '#ff4f8a'; g.strokeStyle = '#8a1245'; g.lineWidth = 7; g.beginPath(); g.moveTo(64, 112); g.bezierCurveTo(8, 72, 14, 18, 64, 40); g.bezierCurveTo(114, 18, 120, 72, 64, 112); g.closePath(); g.fill(); g.stroke(); });
  const hearts = []; for (let i = 0; i < 44; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: heartTex.t, transparent: true, depthWrite: false })); sp.visible = false; S.add(sp); hearts.push(sp); }
  const sweat = new Particles(S, 14, 0xaee0ff, .035, { rough: .1 }), tears = new Particles(S, 40, 0x7fc8ff, .04, { rough: .1 }), steam = new Particles(S, 24, 0xff7a6a, .06, { rough: .6 });
  const rings = []; for (let i = 0; i < 10; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1, .035, 8, 64), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0, depthWrite: false })); r.rotation.x = Math.PI / 2; r.visible = false; S.add(r); rings.push(r); }
  const wrings = []; for (let i = 0; i < 12; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1, .04, 8, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false })); r.visible = false; S.add(r); wrings.push(r); }
  const bub = Array.from({ length: 6 }, () => makeBubble(lib, S, 1.5, .56));
  let bn = 0; const say = (text, x, y, z, w = 1.5) => { const b = bub[bn++ % bub.length]; b.sp.scale.set(w, w * .375, 1); b.show(text, x, y, z); };
  // ---------------- yearbook
  const BW = .62, BH = .86; const pageTex = (kind, n) => cvs(256, 352, (g, w, h) => {
    g.fillStyle = '#fbf4e0'; g.fillRect(0, 0, w, h); g.fillStyle = '#6b1f2a'; g.textAlign = 'center';
    if (kind === 'see') { g.font = '900 54px ' + SANS; g.fillText('SEE', 128, 130); g.font = '900 31px ' + SANS; g.fillText('ANNOUNCE-', 128, 176); g.fillText('MENTS', 128, 214); g.font = '700 14px ' + SANS; g.fillText('PAGE 1', 128, 330); }
    else if (kind === 'blank') { for (let i = 0; i < 6; i++) { g.fillStyle = '#cfd5db'; g.fillRect(24 + (i % 2) * 112, 28 + ((i / 2) | 0) * 98, 100, 80); g.fillStyle = '#6b1f2a'; g.font = '700 11px ' + SANS; g.fillText('see announcements', 74 + (i % 2) * 112, 118 + ((i / 2) | 0) * 98); } if (n > 0) { g.font = '700 14px ' + SANS; g.fillText('PAGE ' + n, 128, 336); } }
    else if (kind === 'bros') { g.fillStyle = '#e8ecf0'; g.fillRect(14, 14, 228, 270); const cs = ['#2f5a8a', '#3a6a9a', '#24486e']; for (let i = 0; i < 3; i++) { const x = 28 + i * 70; g.fillStyle = '#c68642'; g.fillRect(x, 70, 52, 50); g.fillStyle = '#14100d'; g.fillRect(x, 64, 52, 12); g.fillStyle = '#111'; g.fillRect(x + 10, 88, 10, 7); g.fillRect(x + 32, 88, 10, 7); g.fillRect(x + 12, 106, 28, 5); g.fillRect(x + 8, 82, 16, 4); g.fillRect(x + 28, 82, 16, 4); g.fillStyle = cs[i]; g.fillRect(x - 6, 122, 64, 112); g.fillRect(x + 4, 230, 18, 46); g.fillRect(x + 30, 230, 18, 46); g.fillStyle = '#c68642'; g.fillRect(x - 2, 150, 56, 12); g.fillRect(x + 4, 166, 44, 12); } g.fillStyle = '#6b1f2a'; g.font = '900 20px ' + SANS; g.fillText('MAYA\'S BROTHERS', 128, 312); g.font = '700 14px ' + SANS; g.fillText('PAGE 12', 128, 336); }
    else { g.fillStyle = '#cfd5db'; g.fillRect(28, 40, 200, 240); g.fillStyle = '#6b1f2a'; g.font = '700 14px ' + SANS; g.fillText('PAGE ' + n, 128, 336); }
  });
  const spreads = [{ L: pageTex('blank', 0), R: pageTex('see', 1) }]; for (let k = 1; k <= 6; k++) spreads.push({ L: pageTex(k === 6 ? 'bros' : 'blank', 2 * k), R: pageTex('blank', 2 * k + 1) });
  const book = new THREE.Group(); const pm = (t) => new THREE.MeshStandardMaterial({ map: t.t, roughness: .8 });
  const cover = new THREE.Mesh(new THREE.BoxGeometry(BW * 2 + .08, BH + .06, .05), mat(0x7a1f2e)); cover.position.z = -.04; book.add(cover);
  const lp = new THREE.Mesh(new THREE.PlaneGeometry(BW, BH), pm(spreads[0].L)); lp.position.set(-BW / 2, 0, .0); const rp = new THREE.Mesh(new THREE.PlaneGeometry(BW, BH), pm(spreads[0].R)); rp.position.set(BW / 2, 0, .0); book.add(lp, rp);
  const leaf = new THREE.Group(); const lf = new THREE.Mesh(new THREE.PlaneGeometry(BW, BH).translate(BW / 2, 0, 0), pm(spreads[0].R)); lf.position.z = .012; const lb = new THREE.Mesh(new THREE.PlaneGeometry(BW, BH).translate(-BW / 2, 0, 0), pm(spreads[1].L)); lb.rotation.y = Math.PI; lb.position.z = .008; leaf.add(lf, lb); book.add(leaf); leaf.visible = false; book.traverse((m) => (m.castShadow = true)); book.visible = false; S.add(book);
  const setBook = (lt) => { // flips 2.45.. every .22s, each .2s
    const T0 = 2.45, DT = .22, FD = .2; let k = 0, th = 0; if (lt >= T0) { const f = Math.floor((lt - T0) / DT); k = Math.min(6, f); const u = (lt - T0) - f * DT; if (f < 6) th = u < FD ? Math.PI * smooth(u / FD) : 0, k = f; else k = 6; if (f < 6 && u >= FD) k = f + 1; }
    const cur = Math.min(6, k); const flipping = th > 0 && k < 6; lp.material = pm(spreads[cur].L); rp.material = pm(spreads[flipping ? cur + 1 : cur].R); leaf.visible = flipping; if (flipping) { lf.material = pm(spreads[cur].R); lb.material = pm(spreads[cur + 1].L); leaf.rotation.y = -th; if (th > Math.PI / 2) lp.material = pm(spreads[cur].L); }
    return flipping ? cur * 2 : cur * 2; };
  const matCache = new Map(); const _pm = pm; // (materials are cheap; no caching needed)
  const V = new THREE.Vector3(), V2 = new THREE.Vector3(), Q = new THREE.Quaternion(), SC = new THREE.Vector3(1, 1, 1), M4 = new THREE.Matrix4(), EU = new THREE.Euler(), SC2 = new THREE.Vector3(1.7, 1.7, 1.7);
  const place = (o, x, z, yaw, anim = 'idle', y = 0, sp = .5, sc = 1.1) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.vis = true; o.scale = sc; o.h = 1; };
  const handW = (o, key, off, out) => { out.set(off[0], off[1], off[2]).applyMatrix4(o.M[key]); return out; };
  // camera keys: [[lt, [px,py,pz,tx,ty,tz,fov]], ...] smooth interpolation, duplicate time for a cut
  const camAt = (keys, lt) => { if (lt <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) { if (lt <= keys[i][0]) { const [a, ca] = keys[i - 1], [b, cb] = keys[i]; const u = b - a < .002 ? 1 : smooth((lt - a) / (b - a)); return ca.map((v, j) => lerp(v, cb[j], u)); } } return keys[keys.length - 1][1]; };
  const SEATY = -.22; const seat = (i) => { const ti = (i / 4) | 0, s = ((i % 4) / 2) | 0, k = i % 2; const [cx, cz] = TB[ti]; return { x: cx + (k ? .8 : -.8), z: cz + (s ? .95 : -.95), yaw: s ? Math.PI : 0 }; };
  const POP = ['', 'COPY THAT', '412 TO 3', 'A FORK FELL', 'AWW', 'EVERYONE CLAPS', 'PAGE 12'], POPT = [0, 4.0, 3.28, 7.56, 2.08, 6.06, 3.5], POPE = [0, 4.9, 6.4, 9.8, 7.4, 8.0, 5.1];
  const NOTE = ['', 'MONDAY · THIRD PERIOD', 'TUESDAY · THE VOTE', 'WEDNESDAY · MAYA REPLIES', 'THURSDAY · THE LUNCH LADY', 'FRIDAY · THE ANNOUNCEMENT', 'THE YEARBOOK'];
  let forkRel = null;
  const idle = (o, x, z, yaw) => place(o, x, z, yaw, 'idle', 0, .4, 1.1);
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 6); const rr = (a, b) => clamp((lt - a) / (b - a));
    for (let i = 0; i < P.length; i++) { P[i].vis = false; P[i].arms = null; P[i].pitch = 0; P[i].extra = 0; }
    bub.forEach((b) => b.hide()); bn = 0;
    crowd.setFace('calm');
    // permanent seating
    ST.forEach((o, i) => { const s = seat(i); place(o, s.x, s.z, s.yaw, 'sit', SEATY, .3, 1.0); o.phase = i * 1.7; o.arms = { lx: -1.25, lz: .05, rx: -1.25, rz: -.05 }; });
    place(WALK, -9, -9, 0); WALK.vis = false;
    let cam = [3.5, 1.9, 1.0, 5.2, 1.5, 5.8, 46], shake = 0, tilt = 0;
    const HERO_SC = 1.1; sbMesh.visible = sbBack.visible = bi === 2;
    let cryOn = false, tearOn = false, sweatOn = false, heartsOn = 0, steamOn = false, brosShow = false, bookOn = false, clap = false, tableJump = 0, ringT0 = -1, ringE = 0, cafeRing = -1;
    let VPon = false, LADYon = false, PRINon = false, MAYAon = false;
    const heroMic = () => { place(HERO, 4.3, 5.84, Math.PI / 2, 'idle', 0, .5, HERO_SC); HERO.pitch = .32; HERO.arms = { lx: -.3, lz: .1, rx: -1.15, rz: .08 }; };
    const prinStand = () => { place(PRIN, 6.9, 5.8, -Math.PI / 2, 'idle', 0, .4, 1.2); PRIN.arms = { lx: -.2, lz: -.1, rx: -.25, rz: .1 }; };
    const vpAt = (x, z) => place(VP, x, z, -Math.PI / 2, 'idle', 0, .4, 1.15);
    if (bi === 0) {
      heroMic(); sweatOn = true; crowd.setFace('shock'); prinStand(); PRINon = true; vpAt(6.8, 4.5); VPon = true; VP.arms = { lx: -.25, lz: -.1, rx: -.8, rz: .1 };
      cam = camAt([[0, [.2, 2.4, -.4, 5.0, 1.6, 5.8, 52]], [3.6, [2.6, 2.0, 2.8, 5.0, 1.6, 5.7, 44]]], lt); HERO.pitch = .32 + .05 * Math.sin(t * 9);
    } else if (bi === 1) {
      sweatOn = true; PRINon = true; VPon = true;
      // hero at the mic speaking until ~3.0, then steps back
      const back = smooth(rr(3.1, 3.7)); place(HERO, lerp(4.3, 3.2, back), 5.84, Math.PI / 2, back < 1 ? 'idle' : 'idle', 0, .5, HERO_SC); HERO.pitch = lerp(.32, 0, back); HERO.arms = lt < 3.1 ? { lx: -.3, lz: .1, rx: -1.15, rz: .08 } : { lx: -.2, lz: .1, rx: -.2, rz: -.1 };
      if (lt < 3.3) crowd.setFace('shock');
      prinStand(); const cp = rr(3.9, 4.4); PRIN.arms = { lx: -.2, lz: -.1, rx: lerp(-.25, -1.6, smooth(cp)), rz: .1 };
      vpAt(6.8, 4.6); VP.arms = { lx: -2.3, lz: -.8, rx: -2.3, rz: .8 }; cryOn = lt > 6.3 || lt < .1; if (lt > 6.5) { VP.pitch = .25 + .05 * Math.sin(t * 20); tearOn = true; }
      if (lt > 6.5) VP.arms = { lx: -2.3, lz: -.8, rx: -2.3, rz: .8 }; else VP.arms = { lx: -.2, lz: -.1, rx: -.25, rz: .1 };
      if (lt > 1.45 && lt < 3.1) say('Maya in third period', 5.1, 3.05, 5.8, 1.9);
      if (lt > 4.0 && lt < 5.6) say('copy that', 6.8, 3.15, 5.8, 1.6);
      if (lt > 1.5) { ringT0 = 1.5; }
      MAYAon = lt > 4.7 && lt < 6.6; if (MAYAon) { place(MAYA, -2.6, -.4, Math.PI * .9, 'sit', SEATY, .3, 1.05); }
      // Maya at her desk in the cafeteria
      if (lt >= 4.7 && lt < 6.6) { place(MAYA, TB[3][0] + .8, TB[3][1] + .95, Math.PI, 'sit', SEATY, .3, 1.05); MAYA.arms = { lx: -1.25, lz: .05, rx: -2.9, rz: -.05 }; MAYA.pitch = 0; ST[15].vis = false; if (lt > 5.3) say('fine :)', MAYA.x, 2.6, MAYA.z, 1.3); MAYA.arms = { lx: -1.25, lz: .05, rx: -1.7 - .3 * Math.sin(t * 6), rz: -.05 }; }
      cam = camAt([[0, [.6, 2.3, .4, 5.2, 1.7, 5.7, 46]], [3.2, [1.2, 2.3, .8, 5.6, 1.7, 5.7, 44]], [3.25, [1.8, 2.3, 1.6, 6.5, 1.9, 5.8, 44]], [4.65, [1.8, 2.3, 1.6, 6.5, 1.9, 5.8, 44]], [4.66, [-1.9, 3.5, -3.6, -1.9, 1.5, 1.95, 44]], [6.6, [-1.9, 3.5, -3.6, -1.9, 1.5, 1.95, 44]], [6.61, [1.4, 2.3, 1.0, 6.8, 1.8, 4.6, 44]], [8.8, [2.4, 2.3, 1.6, 6.8, 1.8, 4.6, 40]]], lt);
      if (lt > 6.6) { crowd.setFace('shock'); }
    } else if (bi === 2) {
      // voting: students wave hands, counter climbs, scoreboard; brothers revealed at the end
      const vote = rr(1.1, 3.28), forN = Math.round(412 * smooth(vote)); const showA = lt > 4.32;
      drawSB(forN, 3, showA);
      ST.forEach((o, i) => { const w = Math.sin(t * 7 + i * 1.9); o.arms = lt < 3.5 && lt > .9 ? { lx: -2.7 + .3 * w, lz: -.1, rx: -2.7 - .3 * w, rz: .1 } : { lx: -1.25, lz: .05, rx: -1.25, rz: -.05 }; if (lt > 3.5) o.arms = { lx: -.4, lz: .1, rx: -.4, rz: -.1 }; });
      BRO.forEach((o, k) => { const x = -7.9 + k * 1.4; place(o, x, 6.5, Math.PI, 'idle', 0, .3, 1.45); o.arms = { lx: -1.1, lz: 1.1, rx: -1.3, rz: -1.1 }; o.pitch = .0; });
      brosShow = lt > 4.9; BRO.forEach((o) => (o.vis = lt > 4.9)); steamOn = brosShow;
      
      tableJump = 0; cam = camAt([[0, [-3.4, 3.0, -3.6, -4.6, 2.9, 6.0, 56]], [4.9, [-3.6, 3.0, -2.6, -5.0, 3.0, 6.5, 52]], [7.3, [-3.8, 3.0, -1.6, -5.4, 3.0, 6.5, 48]]], lt);
      if (lt < 1) drawSB(0, 3, false);
    } else if (bi === 3) {
      // Maya at the mic -> hero in the aisle raises his hand -> cafeteria freezes -> fork falls
      if (lt < 4.25) { place(MAYA, 4.3, 5.84, Math.PI / 2, 'idle', 0, .5, 1.05); MAYA.pitch = .3; MAYA.arms = { lx: -.3, lz: .1, rx: -1.15, rz: .08 }; MAYAon = true; if (lt > 1.4 && lt < 2.9) { ringT0 = 1.46; } if (lt > 3.2) say('who?', 5.0, 3.0, 5.8, 1.2); prinStand(); PRIN.arms = { lx: -.2, lz: -.1, rx: -.25, rz: .1 }; vpAt(6.8, 4.5); }
      ST.forEach((o, i) => { const w = Math.sin(t * 6 + i * 2.1); if (lt < 5.76) o.arms = { lx: -1.25 + .3 * w, lz: .05, rx: -1.25 - .3 * w, rz: -.05 }; else o.arms = { lx: -1.25, lz: .05, rx: -2.0 + (i % 3) * .08, rz: -.05 }; });
      const frozen = lt > 5.76; if (frozen) crowd.setFace('shock'); if (lt > 4.2) crowd.setFace(frozen ? 'shock' : 'shock');
      const hRaise = rr(4.35, 4.7); place(HERO, lerp(-5.0, -6.4, smooth(rr(5.9, 7.0))), .25, Math.PI, 'idle', 0, .5, HERO_SC); HERO.arms = { lx: -.2, lz: .05, rx: lerp(-.3, -2.9, smooth(hRaise)), rz: .05 }; if (lt < 4.2) HERO.vis = false;
      if (lt > 4.46 && lt < 5.5) say('me', -5.0, 2.55, .25, 1.0);
      place(WALK, -4.1, 1.7, Math.PI, 'idle', 0, .4, 1.0); WALK.vis = lt > 4.2; WALK.arms = { lx: -.3, lz: .05, rx: -2.15, rz: -.05 }; WALK.speed = .01;
      sweatOn = lt > 4.2;
      attach(fork, WALK, 'handR', [0, -.08, .06], [-.3, 0, 0]); fork.matrix.multiply(M4.makeScale(1.7, 1.7, 1.7)); fork.visible = WALK.vis; forkRel = lt > 7.56 ? lt - 7.56 : null;
      cam = camAt([[0, [.6, 2.3, .4, 5.2, 1.7, 5.7, 46]], [4.15, [1.2, 2.3, .8, 5.2, 1.7, 5.7, 44]], [4.16, [-4.6, 1.9, -5.4, -4.6, 1.4, 1.6, 46]], [5.7, [-4.6, 1.9, -5.4, -4.6, 1.4, 1.6, 46]], [5.9, [-3.0, 3.2, -4.6, -4.6, 1.0, 3.5, 56]], [7.2, [-3.0, 3.2, -4.6, -4.6, 1.0, 3.5, 56]], [7.45, [-3.2, 1.0, -1.6, -4.0, .45, 1.7, 52]], [10.2, [-3.2, 1.0, -1.6, -4.0, .35, 1.7, 52]]], lt);
    } else if (bi === 4) {
      // lunch lady leans into the mic: aww; the building shakes
      const lean = smooth(rr(1.5, 2.1)); place(LADY, 4.3, lerp(2.6, 5.84, smooth(rr(.9, 1.8))), lt < 1.8 ? 0 : Math.PI / 2, lt < 1.8 ? 'walk' : 'idle', 0, .5, 1.15); if (lt >= 1.8) { LADY.pitch = .42 * lean; LADY.arms = { lx: -.3, lz: .1, rx: -1.15, rz: .08 }; } if (lt < .9) LADY.vis = false; LADYon = true;
      prinStand(); PRIN.arms = { lx: -.2, lz: -.1, rx: -.25, rz: .1 }; if (lt > 1.2) PRIN.arms = { lx: -.2, lz: -.1, rx: -.25 - .15 * Math.sin(t * 40) * (lt > 5.1 ? 1 : 0), rz: .1 };
      vpAt(6.8, 4.5); VP.arms = { lx: -2.3, lz: -.8, rx: -2.3, rz: .8 }; tearOn = true;
      if (lt > 2.0 && lt < 5.0) say('aww', 5.5, 3.0, 5.84, lt > 2.9 ? 1.9 : 1.5); if (lt > 5.0) crowd.setFace('shock');
      ST.forEach((o, i) => { o.arms = { lx: -1.25, lz: .05, rx: -1.25, rz: -.05 }; });
      if (lt > 2.08) ringT0 = 2.08; const hit = rr(5.1, 5.5); const blast = lt > 5.1 && lt < 7.6; shake = blast ? .16 * Math.min(1, hit * 2) : 0; tableJump = blast ? 1 : 0; cafeRing = lt > 5.1 ? lt - 5.1 : -1;
      if (lt > 2.08 && lt < 5.0) { shake = .006 + .012 * (lt > 2.4 ? 1 : 0); }
      if (blast) { crowd.setFace('shock'); ST.forEach((o, i) => { o.y = SEATY + Math.abs(Math.sin(t * 14 + i)) * .12; }); }
      cam = camAt([[0, [.6, 2.3, .4, 5.4, 1.7, 5.8, 46]], [2.0, [1.6, 2.3, 1.2, 5.2, 1.8, 5.8, 42]], [4.9, [1.6, 2.3, 1.2, 5.2, 1.8, 5.8, 40]], [5.0, [-4.7, 3.0, -4.2, -4.7, 1.1, 4.0, 54]], [8.0, [-4.7, 3.0, -4.2, -4.7, 1.1, 4.0, 54]]], lt);
    } else if (bi === 5) {
      // Friday: couple, hands, hearts, applause
      const walkU = smooth(rr(.1, 1.4)); const hx = lerp(-1.6, -5.14, walkU); const clapU = lt > 6.06;
      const wk = walkU < 1 ? 'walk' : 'idle';
      place(HERO, hx, -.9, Math.PI + .0, wk, 0, .55, 1.1); place(MAYA, hx + .88, -.9, Math.PI, wk, 0, .55, 1.05); HERO.arms = { lx: -.15, lz: .0, rx: -.25, rz: .0 }; MAYA.arms = { lx: -.25, lz: 0, rx: -.25, rz: 0 }; HERO.arms = { lx: -.15, lz: 0, rx: -.18, rz: 0 };
      if (lt < 1.4) { HERO.arms = null; MAYA.arms = { lx: null }; MAYA.arms = null; }
      sweatOn = true; if (lt > 1.4) { heartsOn = 1; }
      ST.forEach((o, i) => { const w = lt > 6.06 ? Math.sin(t * 15 + i * .3) * .5 + .5 : 0; if (lt > 6.06) o.arms = { lx: -.9, lz: lerp(.15, 1.05, w), rx: -.9, rz: -lerp(.15, 1.05, w) }; else o.arms = { lx: -1.25, lz: .05, rx: -1.25, rz: -.05 }; });
      BRO.forEach((o, k) => { place(o, -8.6 + k * 1.0, 7.0, Math.PI, 'idle', 0, .3, 1.45); o.arms = { lx: -1.1, lz: 1.1, rx: -1.3, rz: -1.1 }; o.vis = lt > 5.5; }); steamOn = lt > 5.5; clap = lt > 6.06;
      if (lt > 2.7 && lt < 4.1) say('they are dating', -4.7, 3.2, 3.5, 1.9);
      if (lt > 4.86 && lt < 5.9) say('nobody asked', ST[13].x, 2.3, ST[13].z, 1.8);
      if (lt >= 3.4) crowd.setFace('calm');
      cam = camAt([[0, [-3.0, 1.9, -5.0, -3.0, 1.3, -.9, 46]], [1.4, [-4.7, 1.8, -4.4, -4.7, 1.35, -.9, 44]], [5.5, [-4.7, 1.8, -4.4, -4.7, 1.35, -.9, 44]], [6.2, [-4.7, 3.1, -5.4, -4.7, 1.2, 1.0, 56]], [8.0, [-4.7, 3.1, -5.4, -4.7, 1.2, 1.0, 56]]], lt);
      ST.forEach((o) => { o.yaw += 0; });
    } else {
      // yearbook
      bookOn = true; place(HERO, -4.3, 1.9, Math.PI, 'idle', 0, .4, 1.1); HERO.arms = { lx: -1.25, lz: -.35, rx: -1.25, rz: .35 }; HERO.pitch = .05; sweatOn = lt < 2.4;
      cam = camAt([[0, [-4.3, 1.9, -3.8, -4.3, 1.3, 1.9, 42]], [2.5, [-4.3, 1.8, -3.0, -4.3, 1.3, 1.9, 40]], [5.2, [-4.3, 1.75, -2.6, -4.3, 1.3, 1.9, 38]]], lt);
    }
    crowd.update(t);
    // ---- props attached to people
    const att = (m, o, k, off, rot, on) => { attach(m, o, k, off, rot); m.visible = on && o.vis; };
    att(hood, HERO, 'torso', [0, .36, -.2], [.3, 0, 0], true); att(pocket, HERO, 'torso', [0, -.12, .17], [0, 0, 0], true); att(hoodStr1, HERO, 'torso', [-.06, .2, .175], [0, 0, 0], true); att(hoodStr2, HERO, 'torso', [.06, .2, .175], [0, 0, 0], true);
    att(pony, MAYA, 'head', [0, -.12, -.3], [.35, 0, 0], true); att(tie2, MAYA, 'head', [0, .04, -.28], [0, 0, 0], true);
    att(tie, PRIN, 'torso', [0, .0, .17], [0, 0, 0], true); att(tieK, PRIN, 'torso', [0, .24, .17], [0, 0, 0], true); att(collar, PRIN, 'torso', [0, .3, .16], [0, 0, 0], true);
    att(apron, LADY, 'torso', [0, -.02, .17], [0, 0, 0], true); att(net, LADY, 'head', [0, .17, -.02], [0, 0, 0], true);
    att(tissue, VP, 'handR', [0, -.1, .05], [0, 0, 0], VP.arms && VP.arms.rx < -2); att(tissue2, VP, 'handL', [0, -.1, .05], [0, 0, 0], VP.arms && VP.arms.rx < -2);
    att(thumb, PRIN, 'handR', [0, .1, .1], [0, 0, 0], PRIN.vis && PRIN.arms && PRIN.arms.rx < -1.2 && bi === 1);
    bites.forEach((f, k) => { const on = bi === 3 && lt > 5.76; if (on) { attach(f, ST[3 + k], 'handR', [0, -.08, .06], [-.3, 0, 0]); f.matrix.multiply(M4.makeScale(1.4, 1.4, 1.4)); } f.visible = on; });
    // fork: held, or falling with bounce physics
    if (bi === 3 && forkRel !== null) { const hw = handW(WALK, 'handR', [0, -.08, .06], V); const y0 = fork.userData.y0 ?? (fork.userData.y0 = 1.45); const x0 = fork.userData.x0 ?? (fork.userData.x0 = hw.x), z0 = fork.userData.z0 ?? (fork.userData.z0 = hw.z); const d = dropBounce(1.45, 0, forkRel, .42); const ang = Math.min(forkRel, 1.3); EU.set(d.settled ? 1.45 : ang * 9, d.settled ? 0 : ang * 3, d.settled ? .6 : ang * 5); Q.setFromEuler(EU); V2.set(x0 + .12 * Math.min(forkRel, 1.2), d.y + .03, z0 - .35 * Math.min(forkRel, 1.2)); SC2.set(1.7, 1.7, 1.7); M4.compose(V2, Q, SC2); fork.matrix.copy(M4); fork.visible = true; }
    else { fork.userData.y0 = undefined; fork.userData.x0 = undefined; fork.userData.z0 = undefined; if (!(bi === 3)) fork.visible = false; }
    // ---- sweat / tears / steam
    for (let i = 0; i < 14; i++) { const u = ((t * 1.3 + i * .27) % 1); const hw = handW(HERO, 'head', [(i % 2 ? .24 : -.24), .1 - u * .4, .1 * Math.sin(i)], V); sweat.set(i, hw.x, hw.y, hw.z, sweatOn && HERO.vis ? 1 - u * .5 : 0); } sweat.done();
    for (let i = 0; i < 40; i++) { const u = ((t * 1.4 + i * .137) % 1); const sd = i % 2 ? .1 : -.1; const hw = handW(VP, 'head', [sd, -.02 - u * .5, .24], V); tears.set(i, hw.x, hw.y, hw.z, tearOn && VP.vis ? 1 : 0); } tears.done();
    for (let i = 0; i < 24; i++) { const u = ((t * .9 + i * .131) % 1); const b = BRO[i % 3]; const hw = handW(b, 'head', [(i % 2 ? .25 : -.25), .1 + u * .8, 0], V); steam.set(i, hw.x, hw.y, hw.z, steamOn && b.vis ? (1 - u) : 0); } steam.done();
    // ---- sound rings from the mic (mic at MICH) crossing the school + speakers pulse
    rings.forEach((r) => (r.visible = false)); wrings.forEach((r) => (r.visible = false));
    if (ringT0 >= 0) { for (let k = 0; k < 8; k++) { const age = lt - ringT0 - k * .22; if (age < 0 || age > 2.4) continue; const u = age / 2.4; const r = rings[k]; r.visible = true; r.position.set(MICH.x, 1.3, MICH.z); r.scale.set(.2 + u * 15, .2 + u * 15, 1); r.rotation.x = Math.PI / 2; r.material.opacity = .85 * (1 - u); } }
    spk.forEach((s, i) => { let pulse = 0; if (ringT0 >= 0) { for (let k = 0; k < 8; k++) { const age = lt - ringT0 - k * .22 - Math.hypot(s.x - MICH.x, s.z - MICH.z) / 6.3; if (age > 0 && age < .25) pulse = Math.max(pulse, 1 - age / .25); } } s.g.scale.setScalar(1 + .12 * pulse); s.cone.material.emissive = new THREE.Color(0xffd23f); s.cone.material.emissiveIntensity = pulse * 1.2; if (pulse > 0) for (let k = 0; k < 2; k++) { const r = wrings[(i * 2 + k) % 12]; r.visible = true; r.position.set(s.x, s.y, s.z - .05 * (s.z > 5 ? 1 : 0)); r.rotation.set(0, i === 3 ? Math.PI / 2 : 0, 0); const sc = .5 + (1 - pulse) * 1.1 + k * .5; r.scale.set(sc, sc, 1); r.material.opacity = pulse * .8; } });
    // cafeteria blast ripples + trays
    if (cafeRing >= 0) for (let k = 0; k < 5; k++) { const age = cafeRing - k * .35; const r = rings[k]; if (age < 0 || age > 2.2) continue; const u = age / 2.2; r.visible = true; r.position.set(-3.4, .08, 2.8); r.scale.set(.5 + u * 12, .5 + u * 12, 1); r.rotation.x = Math.PI / 2; r.material.opacity = .95 * (1 - u); r.material.color.set(0xff9a1e); r.scale.z = 1; }
    else rings.forEach((r) => r.material.color.set(0xffd23f));
    trays.forEach((tr, i) => { tr.g.position.y = tr.y0 + (tableJump ? Math.abs(Math.sin(t * 15 + tr.ph * 3)) * (.35 + .1 * Math.sin(i)) : 0); tr.g.rotation.z = tableJump ? .25 * Math.sin(t * 22 + i) : 0; tr.g.rotation.x = tableJump ? .2 * Math.sin(t * 19 + i * 2) : 0; });
    // hearts: burst from joined hands, rise and fade
    const jh = new THREE.Vector3(); if (bi === 5) { const a = handW(HERO, 'handL', [0, 0, 0], V), b = handW(MAYA, 'handR', [0, 0, 0], V2); jh.copy(a).add(b).multiplyScalar(.5); }
    hearts.forEach((sp, i) => { if (!heartsOn || bi !== 5) { sp.visible = false; return; } const birth = 1.45 + (i % 22) * .09 + (i >= 22 ? 2.6 : 0); const age = lt - birth; if (age < 0 || age > 2.2) { sp.visible = false; return; } const u = age / 2.2; const ang = i * 2.4; sp.visible = true; sp.position.set(jh.x + Math.cos(ang) * (.15 + u * .9) * .8, jh.y + .1 + u * 1.7, jh.z - .25 + Math.sin(ang) * .2); const s = (.18 + .25 * ((i * 7) % 5) / 5) * (1 - u * .4); sp.scale.set(s, s, 1); sp.material.opacity = 1 - u * u; });
    // yearbook held up by the hero
    book.visible = bookOn; if (bookOn) { const pg = setBook(lt); const a = handW(HERO, 'handL', [0, 0, 0], V), b = handW(HERO, 'handR', [0, 0, 0], V2); book.position.copy(a).add(b).multiplyScalar(.5); book.position.y += .16; book.position.z += .04; book.rotation.set(0, Math.PI, 0); book.scale.setScalar(.9); }
    // ---- camera
    const sx = shake ? shake * (Math.sin(t * 61) + .6 * Math.sin(t * 97)) : 0, sy = shake ? shake * (Math.sin(t * 53 + 1) + .6 * Math.sin(t * 83)) : 0;
    A.cam(cam[0] + sx, cam[1] + sy, cam[2], cam[3] + sx * .4, cam[4] + sy * .4, cam[5], cam[6], shake ? .02 * Math.sin(t * 47) : 0); A.follow(0, 4); A.render();
    // ---- HUD
    hud.style('C'); hud.question(bi === 0 ? 'What if you had to announce *your crush* on the morning announcements?' : '', bi === 0 ? 1 : 0);
    let lab = '', val = '', hot = false;
    if (bi === 1) { lab = 'Students who heard'; val = fmt(1284 * smooth(rr(1.6, 4.2))); hot = lt > 3.5; }
    else if (bi === 2) { if (lt > 4.3) { lab = 'Votes against'; val = '3'; hot = true; } else { lab = 'Votes for'; val = fmt(412 * smooth(rr(1.1, 3.28))); hot = lt > 3.28; } }
    else if (bi === 3) { if (lt >= 7.5) { lab = 'Forks dropped'; val = '1'; hot = true; } else if (lt >= 5.7) { lab = 'Students frozen'; val = fmt(412 * smooth(rr(5.76, 6.7))); hot = true; } else { lab = 'Replies'; val = lt > 3.3 ? '1' : '0'; } }
    else if (bi === 4) { lab = 'Decibels'; val = lt < 2.08 ? '62' : lt < 5.1 ? String(Math.round(lerp(96, 118, rr(2.08, 5)))) : String(Math.round(lerp(118, 192, smooth(rr(5.1, 7.4))))); hot = lt > 2.08; }
    else if (bi === 5) { if (lt >= 6.06) { lab = 'Claps'; val = fmt(412 * smooth(rr(6.06, 7.6))); hot = true; } else { lab = 'Couples'; val = lt > 1.45 ? '1' : '0'; } }
    else if (bi === 6) { lab = 'Yearbook page'; val = String(lt < 2.45 ? 1 : 2 * Math.max(0, Math.min(6, Math.floor((lt - 2.45) / .22 + 1 - 0.0)))); if (lt >= 3.77) val = '12'; hot = lt > 3.7; }
    if (bi === 0) hud.counter('', '', ''); else hud.counter(lab, val, NOTE[bi], 'MORNING ANNOUNCEMENTS', hot); hud.tm('');
    const pa = POP[bi] && lt > POPT[bi] ? Math.min(1, (lt - POPT[bi]) * 7, Math.max(0, (POPE[bi] - lt) * 6)) : 0; hud.pop(pa > 0.01 ? POP[bi] : '', pa);
  } };
}
