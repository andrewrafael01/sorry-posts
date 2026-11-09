import { drakeLook } from './_drake.js';
// Invention chain: Drake's diss track (generic parody caricature, no likeness, no real lyrics: scribbles + placeholder text only).
// 6 sets side by side along +x (one per beat); camera cuts inside each beat.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, ground, Crowd, clamp, smooth, lerp, attach, dropBounce } = lib;
  const A = makeStage({ fog: 0xb9c6dc, fogNear: 45, fogFar: 160, clouds: true, skyTop: 0x3f6fb8, skyMid: 0x93b4e0, skyBot: 0xdfe6f2, shadowExtent: 26, hemi: 1.6, sunI: 1.5, sunDir: [-.3, .9, -.5], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const rnd = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const OX = [0, 50, 100, 150, 200, 250], SHOP = 300;
  const grp = OX.concat([SHOP]).map(() => { const g = new THREE.Group(); S.add(g); return g; });
  const flat = (g, x, y, z, w, d, color, o = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), o.m || mat(color, { roughness: o.r ?? .8 })); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; g.add(m); return m; };
  const board = (g, tex, x, y, z, w, h, ry = 0, basic = true) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic ? new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, side: THREE.DoubleSide }) : new THREE.MeshStandardMaterial({ map: tex, roughness: .9, side: THREE.DoubleSide })); m.position.set(x, y, z); m.rotation.y = ry; g.add(m); return m; };
  const scribble = (g, x, y, w, seed, col = '#2a3a8a', lw = 4, amp = 5, jag = 1) => { g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.beginPath(); const n = 26; for (let i = 0; i <= n; i++) { const u = i / n; const px = x + u * w * (.7 + .3 * rnd(seed, 1)), py = y + Math.sin(u * 40 * jag + seed) * amp * (.4 + rnd(seed, 2) * .8); if (i === 0) g.moveTo(px, py); else g.lineTo(px, py); } g.stroke(); };
  const sadFace = (g, x, y, r, col = '#1c2a6a') => { g.strokeStyle = col; g.lineWidth = r * .12; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.fillStyle = col; g.beginPath(); g.arc(x - r * .35, y - r * .2, r * .1, 0, 7); g.arc(x + r * .35, y - r * .2, r * .1, 0, 7); g.fill(); g.beginPath(); g.arc(x, y + r * .62, r * .34, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); g.fillStyle = '#4aa8ff'; g.beginPath(); g.ellipse(x + r * .5, y + r * .15, r * .09, r * .2, 0, 0, 7); g.fill(); };
  const label = (text, w, h, bg, fg, size) => { const c = cvs(512, Math.round(512 * h / w), (g, W, H) => { g.fillStyle = bg; g.beginPath(); g.roundRect(6, 6, W - 12, H - 12, 24); g.fill(); g.strokeStyle = fg; g.lineWidth = 8; g.stroke(); txt(g, text, W / 2, H / 2 + 3, size, fg); }); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: c.t, transparent: true, depthWrite: false, toneMapped: false })); sp.scale.set(w, h, 1); sp.visible = false; S.add(sp); return sp; };

  // ================================================================== SET 0: recording booth
  const g0 = grp[0], X0 = OX[0];
  flat(g0, X0, 0, 0, 16, 14, 0x3a2c28, { r: .5 }); addBox(g0, X0, 3, -3.2, 16, 6, .3, 0x1d2640); addBox(g0, X0 - 8, 3, 1, .3, 6, 8, 0x1d2640); addBox(g0, X0 + 8, 3, 1, .3, 6, 8, 0x1d2640);
  for (let i = 0; i < 9; i++) for (let j = 0; j < 3; j++) addBox(g0, X0 - 7 + i * 1.7, 2.2 + j * 1.15, -3.0, 1.45, 1.0, .18, (i + j) % 2 ? 0x2c3a5c : 0x151c30, { cast: false });
  { const ow = cvs(512, 200, (g, w, h) => { g.fillStyle = '#7a0d16'; g.fillRect(0, 0, w, h); g.fillStyle = '#ff3340'; g.fillRect(10, 10, w - 20, h - 20); txt(g, 'RECORDING', w / 2, h / 2 + 4, 104, '#fff'); }); board(g0, ow.t, X0 + 4.3, 4.6, -2.8, 2.6, 1.0); }
  addBox(g0, X0, .5, -.5 - .35, 1.1, .1, 1.0, 0x222428); // chair
  addBox(g0, X0, 1.0, -1.05, 1.0, 1.0, .12, 0x222428); addBox(g0, X0, .22, -.5, .12, .44, .12, 0x555a66);
  addBox(g0, X0, .92, 1.0, 4.4, .12, 1.7, 0x6b4a2c, { round: .02 }); for (const sx of [-2.05, 2.05]) addBox(g0, X0 + sx, .46, 1.0, .12, .92, 1.6, 0x4e3620);
  // mic stand + pop filter
  { const st = addBox(g0, X0 - 1.2, 1.55, .65, .06, 1.2, .06, 0x15171c); addBox(g0, X0 - 1.2, .99, .65, .5, .05, .5, 0x15171c); const mic = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .42, 14), mat(0x2a2d36, { metalness: .6, roughness: .35 })); mic.position.set(X0 - 1.0, 2.05, .85); mic.rotation.x = 1.25; g0.add(mic); const gr = new THREE.Mesh(new THREE.SphereGeometry(.14, 14, 10), mat(0x9aa3b0, { metalness: .8, roughness: .3 })); gr.position.set(X0 - 1.0, 2.08, 1.04); g0.add(gr); const ring = new THREE.Mesh(new THREE.TorusGeometry(.26, .02, 8, 24), mat(0x111111)); ring.position.set(X0 - .88, 2.05, 1.28); g0.add(ring); const mesh = new THREE.Mesh(new THREE.CircleGeometry(.25, 20), new THREE.MeshBasicMaterial({ color: 0x23262e, transparent: true, opacity: .55, side: THREE.DoubleSide })); mesh.position.copy(ring.position); g0.add(mesh); }
  // title card propped on desk + notebook
  { const card = cvs(512, 300, (g, w, h) => { g.fillStyle = '#f6efd8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#7a1c1c'; g.lineWidth = 10; g.strokeRect(10, 10, w - 20, h - 20); txt(g, 'DISS', w / 2, 96, 120, '#7a1c1c'); txt(g, 'TRACK', w / 2, 212, 120, '#7a1c1c'); }); const m = board(g0, card.t, X0 + 1.35, 1.62, .42, 1.5, .88, 0, false); m.rotation.x = -.18; m.castShadow = true; addBox(g0, X0 + 1.35, 1.0, .55, 1.4, .05, .3, 0x222222); }
  const nbC = cvs(512, 660); let nbLast = -1; const drawNB = (n) => { if (n === nbLast) return; nbLast = n; const g = nbC.g, w = 512, h = 660; g.fillStyle = '#f7f3e6'; g.fillRect(0, 0, w, h); g.strokeStyle = '#a8c4e0'; g.lineWidth = 2; for (let y = 130; y < h; y += 46) { g.beginPath(); g.moveTo(14, y); g.lineTo(w - 14, y); g.stroke(); } g.strokeStyle = '#e07a8a'; g.beginPath(); g.moveTo(60, 0); g.lineTo(60, h); g.stroke(); txt(g, 'DISS TRACK', w / 2 + 20, 62, 66, '#7a1c1c'); g.fillStyle = '#7a1c1c'; g.fillRect(90, 98, 340, 6); for (let i = 0; i < n; i++) scribble(g, 80, 152 + i * 46, 380 - (i % 3) * 60, i + 3, '#1f2f7a', 5, 6, 1.3); nbC.t.needsUpdate = true; };
  drawNB(0); const nb = board(g0, nbC.t, X0 + .15, 1.0, .5, 1.2, 1.55, 0, false); nb.rotation.x = -Math.PI / 2; nb.rotation.z = 0; nb.castShadow = true;
  const pencil = new THREE.Group(); { const b = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .55, 8), mat(0xf2c230)); const tip = new THREE.Mesh(new THREE.ConeGeometry(.03, .1, 8), mat(0x222222)); tip.position.y = -.32; tip.rotation.x = Math.PI; const er = new THREE.Mesh(new THREE.CylinderGeometry(.032, .032, .06, 8), mat(0xe06a7a)); er.position.y = .3; pencil.add(b, tip, er); S.add(pencil); }

  // ================================================================== SET 1: scroll hall (scroll unrolls along +z toward far timer)
  const g1 = grp[1], X1 = OX[1]; const Z0 = -5, SL = 3, NS = 8, SW = 2.4;
  flat(g1, X1, 0, 8, 22, 46, 0x3e3858, { r: .6 }); addBox(g1, X1, 3.5, 24.5, 22, 7, .4, 0x2a2540); addBox(g1, X1 - 11, 3.5, 8, .4, 7, 46, 0x2a2540); addBox(g1, X1 + 11, 3.5, 8, .4, 7, 46, 0x2a2540); addBox(g1, X1, 3.5, -14.5, 22, 7, .4, 0x2a2540);
  for (let i = 0; i < 6; i++) for (const sx of [-1, 1]) { addBox(g1, X1 + sx * 10.5, 2.6, -8 + i * 6, .5, 5.2, .7, 0x4a4368); addBox(g1, X1 + sx * 10.2, 4.5, -8 + i * 6, .1, .5, 2.4, 0xffd88a, { cast: false, mat: { emissive: 0xffc860, emissiveIntensity: .8 } }); }
  const segs = []; for (let i = 0; i < NS; i++) { const c = cvs(512, 640, (g, w, h) => { g.fillStyle = '#f3ead0'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9b98e'; g.lineWidth = 6; g.strokeRect(4, 0, w - 8, h + 4); if (i === 0) { g.fillStyle = '#ffd92a'; g.fillRect(24, 38, w - 48, 120); txt(g, 'VERSE 1:', w / 2, 80, 64, '#2a2a2a'); txt(g, 'SORRY', w / 2, 140, 78, '#c8102e'); } else txt(g, 'VERSE ' + (i + 1), w / 2, 70, 56, '#4a3a22'); for (let k = 0; k < 8; k++) scribble(g, 56 + (k % 2) * 8, (i === 0 ? 220 : 130) + k * 52, 380, i * 9 + k + 4, '#26357a', 5, 7, 1.2); if (i === 0) sadFace(g, 420, 560, 34); else if (i % 3 === 2) sadFace(g, 90 + (i % 2) * 300, 590, 30); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(SW, SL), new THREE.MeshStandardMaterial({ map: c.t, roughness: .9 })); m.rotation.x = -Math.PI / 2; m.position.set(X1, .015 + i * .0004, Z0 + SL * i + SL / 2); m.receiveShadow = true; g1.add(m); segs.push({ m, c }); }
  const roll = new THREE.Mesh(new THREE.CylinderGeometry(.26, .26, SW + .3, 20), mat(0xf3ead0)); roll.rotation.z = Math.PI / 2; g1.add(roll); { for (const sx of [-1, 1]) { const cap = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .1, 12), mat(0x8a5a2a)); cap.rotation.z = Math.PI / 2; cap.position.x = sx * (SW / 2 + .2); roll.add(cap); } }
  const clkC = cvs(640, 320); const drawClk = (t) => { const g = clkC.g; g.fillStyle = '#16181f'; g.fillRect(0, 0, 640, 320); g.strokeStyle = '#ff3a3a'; g.lineWidth = 10; g.strokeRect(10, 10, 620, 300); txt(g, 'RUN TIME', 320, 62, 52, '#ff8a8a'); const on = (t * 1.6 % 1) < .75; txt(g, on ? '9:00' : '9:00', 320, 188, 190, on ? '#ff3a3a' : '#c02424', { w: 700 }); txt(g, 'MINUTES', 320, 280, 36, '#ff8a8a'); clkC.t.needsUpdate = true; }; drawClk(0);
  { board(g1, clkC.t, X1, 3.2, 23.9, 8, 4, Math.PI); addBox(g1, X1, 3.2, 24.1, 8.4, 4.4, .2, 0x15161c, { cast: false }); }
  // second timer near the start so the number reads in the opening shot
  { const m = board(g1, clkC.t, X1 + 3.6, 1.9, Z0 - .9, 2.4, 1.2, 0); addBox(g1, X1 + 3.6, 1.9, Z0 - 1.02, 2.5, 1.3, .1, 0x15161c); addBox(g1, X1 + 3.6, .8, Z0 - 1.05, .12, 1.6, .12, 0x15161c); }
  const hl = new THREE.Mesh(new THREE.PlaneGeometry(SW, .9), new THREE.MeshBasicMaterial({ color: 0xff3a3a, transparent: true, opacity: .0, toneMapped: false, depthWrite: false })); hl.rotation.x = -Math.PI / 2; hl.position.set(X1, .03, Z0 + 1.1); g1.add(hl);

  // ================================================================== SET 2: editing table (scissors cut SORRY strip, pasted back in verse 2)
  const g2 = grp[2], X2 = OX[2];
  flat(g2, X2, 0, 0, 20, 16, 0x5a4636, { r: .55 }); addBox(g2, X2, 3.2, -4.2, 20, 6.4, .3, 0x2d4a52); addBox(g2, X2 - 10, 3.2, 0, .3, 6.4, 12, 0x2d4a52); addBox(g2, X2 + 10, 3.2, 0, .3, 6.4, 12, 0x2d4a52);
  addBox(g2, X2, .86, -.2, 8.4, .16, 4.4, 0x7a5a38, { round: .03 }); for (const sx of [-4, 4]) for (const sz of [-2, 1.6]) addBox(g2, X2 + sx, .42, sz, .22, .84, .22, 0x4a3320);
  const mkPage = (title, hasHole) => { const c = cvs(512, 680); const draw = (hole) => { const g = c.g, w = 512, h = 680; g.fillStyle = '#f7f2e2'; g.fillRect(0, 0, w, h); g.strokeStyle = '#b9ad8a'; g.lineWidth = 6; g.strokeRect(5, 5, w - 10, h - 10); txt(g, title, w / 2, 70, 60, '#4a3a22'); if (hasHole) { g.fillStyle = hole ? '#8a7a58' : '#f7f2e2'; g.fillRect(40, 118, w - 80, 120); if (hole) { g.setLineDash([14, 10]); g.strokeStyle = '#4a3a22'; g.lineWidth = 4; g.strokeRect(40, 118, w - 80, 120); g.setLineDash([]); } } for (let k = 0; k < 7; k++) scribble(g, 56, 290 + k * 54, 380, k + (hasHole ? 1 : 20), '#26357a', 5, 7, 1.2); c.t.needsUpdate = true; }; draw(false); return { c, draw }; };
  const pgA = mkPage('VERSE 1', true), pgB = mkPage('VERSE 2', false); let holeShown = false;
  const PA = [X2 - 2.3, .96, -.2], PB = [X2 + 2.3, .96, -.2], PW = 2.4, PH = 3.15;
  { const m = board(g2, pgA.c.t, PA[0], PA[1], PA[2], PW, PH, 0, false); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; const m2 = board(g2, pgB.c.t, PB[0], PB[1], PB[2], PW, PH, 0, false); m2.rotation.x = -Math.PI / 2; m2.receiveShadow = true; }
  const mkStrip = () => { const c = cvs(512, 128, (g, w, h) => { g.fillStyle = '#ffe14a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c8102e'; g.lineWidth = 8; g.strokeRect(5, 5, w - 10, h - 10); txt(g, 'SORRY', w / 2, h / 2 + 4, 96, '#c8102e'); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(PW - .45, .56), new THREE.MeshBasicMaterial({ map: c.t, toneMapped: false, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; g2.add(m); return m; };
  const strip1 = mkStrip(), strip2 = mkStrip(), strip3 = mkStrip(); const SLOT_A = [PA[0], PA[1] + .012, PA[2] - PH / 2 + 1.0], SLOT_B = [PB[0], PB[1] + .012, PB[2] - PH / 2 + 1.0], SLOT_B2 = [PB[0], PB[1] + .012, PB[2] + .85];
  const scis = new THREE.Group(); { const bl = mat(0xc9ced8, { metalness: .9, roughness: .25 }); const mkBlade = (s) => { const b = new THREE.Group(); const bb = new THREE.Mesh(new THREE.BoxGeometry(.09, .03, 1.5), bl); bb.position.z = .75; b.add(bb); const hd = new THREE.Mesh(new THREE.TorusGeometry(.2, .05, 8, 16), mat(0xe8402a)); hd.rotation.x = Math.PI / 2; hd.position.set(s * .02, 0, -.3); b.add(hd); return b; }; scis.userData.a = mkBlade(1); scis.userData.b = mkBlade(-1); scis.add(scis.userData.a, scis.userData.b); g2.add(scis); }
  const chk = label('✓', 1.3, 1.3, '#1f9a4a', '#ffffff', 340), glue = label('GLUE', 1.2, .5, '#ffffff', '#1f6ad8', 150);

  // ================================================================== SET 3: ghostwriter's den
  const g3 = grp[3], X3 = OX[3];
  flat(g3, X3, 0, 0, 16, 14, 0x4a3a2c, { r: .5 }); addBox(g3, X3, 3, -3.2, 16, 6, .3, 0x3a2f4e); addBox(g3, X3 - 8, 3, 1, .3, 6, 8, 0x3a2f4e); addBox(g3, X3 + 8, 3, 1, .3, 6, 8, 0x3a2f4e);
  for (const sx of [-5.2, 5.2]) { addBox(g3, X3 + sx, 2.4, -2.8, 2.4, 4.8, .6, 0x2a1c12); for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) addBox(g3, X3 + sx - .9 + k * .36, .75 + r * 1.1, -2.45, .26, .8, .3, [0x8a2a2a, 0x2a5a8a, 0x6a8a2a, 0xc8a02a][(r + k) % 4], { cast: false }); }
  addBox(g3, X3, .5, -.7 - .35, 1.1, .1, 1.0, 0x2a2030); addBox(g3, X3, 1.0, -1.25, 1.0, 1.0, .12, 0x2a2030);
  addBox(g3, X3, .92, 1.0, 4.4, .12, 1.7, 0x6b4a2c, { round: .02 }); for (const sx of [-2.05, 2.05]) addBox(g3, X3 + sx, .46, 1.0, .12, .92, 1.6, 0x4e3620);
  const tw = new THREE.Group(); tw.position.set(X3, .98, .95); g3.add(tw); { addBox(tw, 0, .22, 0, 1.6, .44, 1.0, 0x2a2e36, { round: .06 }); addBox(tw, 0, .5, -.38, 1.3, .22, .32, 0x1a1c22); const rodm = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 1.6, 10), mat(0x888d99, { metalness: .8 })); rodm.rotation.z = Math.PI / 2; rodm.position.set(0, .66, .16); tw.add(rodm); tw.userData.keys = []; for (let r = 0; r < 3; r++) for (let k = 0; k < 9; k++) { const kk = addBox(tw, -.62 + k * .155 + r * .04, .5 + r * .04 - .06, -.02 + r * .12 + .12, .12, .07, .1, 0xe8e4d8, { cast: false }); tw.userData.keys.push(kk); } }
  const ppC = cvs(512, 680); let ppLast = -1; const drawPP = (n, tears) => { const key = n * 100 + tears; if (key === ppLast) return; ppLast = key; const g = ppC.g, w = 512, h = 680; g.fillStyle = '#fbf8ee'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d9d2b8'; g.lineWidth = 6; g.strokeRect(5, 5, w - 10, h - 10); txt(g, 'DRAFT 1', w / 2, 56, 50, '#7a1c1c'); for (let i = 0; i < n; i++) { const y = 130 + i * 118; sadFace(g, 80, y + 24, 36); scribble(g, 140, y + 10, 300, i + 40, '#1f2f7a', 6, 7, 1.2); scribble(g, 140, y + 46, 220, i + 70, '#1f2f7a', 6, 7, 1.2); } for (let i = 0; i < tears; i++) { g.fillStyle = 'rgba(80,160,255,.55)'; g.beginPath(); g.ellipse(60 + rnd(i, 4) * 400, 120 + rnd(i, 5) * 500, 14 + rnd(i, 6) * 18, 10 + rnd(i, 7) * 12, 0, 0, 7); g.fill(); } ppC.t.needsUpdate = true; };
  drawPP(0, 0); const paperF = board(g3, ppC.t, X3, 2.3, 1.2, 1.1, 1.45, Math.PI, false), paperB = board(g3, ppC.t, X3, 2.3, 1.2 + .01, 1.1, 1.45, 0, false);
  const env = new THREE.Mesh(new THREE.BoxGeometry(.5, .06, .34), mat(0xf4e9c0)); const envT = cvs(128, 96, (g, w, h) => txt(g, '$$$', w / 2, h / 2, 64, '#1f7a3a')); const envL = new THREE.Mesh(new THREE.PlaneGeometry(.44, .3), new THREE.MeshBasicMaterial({ map: envT.t, toneMapped: false })); envL.rotation.x = -Math.PI / 2; envL.position.y = .032; env.add(envL); S.add(env);

  // ================================================================== SET 4: arena center court
  const g4 = grp[4], X4 = OX[4];
  { const ct = cvs(1024, 560, (g, w, h) => { g.fillStyle = '#c98c4a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.05)'; g.fillRect(i * 26, 0, 26, h); } g.strokeStyle = '#fff'; g.lineWidth = 8; g.strokeRect(24, 24, w - 48, h - 48); g.beginPath(); g.moveTo(w / 2, 24); g.lineTo(w / 2, h - 24); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 90, 0, 7); g.stroke(); g.fillStyle = '#c8102e'; g.beginPath(); g.arc(w / 2, h / 2, 82, 0, 7); g.fill(); txt(g, 'RAPTORS', w / 2, h / 2, 40, '#fff'); for (const sx of [24, w - 24]) { g.strokeRect(sx < w / 2 ? 24 : w - 24 - 190, h / 2 - 100, 190, 200); } }); const m = new THREE.Mesh(new THREE.PlaneGeometry(34, 18.6), new THREE.MeshStandardMaterial({ map: ct.t, roughness: .45 })); m.rotation.x = -Math.PI / 2; m.position.set(X4, .005, 0); m.receiveShadow = true; g4.add(m); }
  addBox(g4, X4, 4, -14, 40, 8, .4, 0x14182a);
  const stageP = addBox(g4, X4, .3, 1, 5.4, .6, 5, 0x1c1d24, { round: .04 }); addBox(g4, X4, .62, 1, 5.4, .05, 5, 0xc8102e, { cast: false, mat: { emissive: 0xc8102e, emissiveIntensity: .35 } });
  for (const sx of [-3.6, 3.6]) { addBox(g4, X4 + sx, 1.4, -.6, 1.2, 2.8, 1.1, 0x15161c, { round: .05 }); const sp = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, .08, 18), mat(0x333640)); sp.rotation.x = Math.PI / 2; sp.position.set(X4 + sx, 1.0, -.03); g4.add(sp); const sp2 = sp.clone(); sp2.position.y = 1.9; g4.add(sp2); }
  for (let r = 0; r < 4; r++) addBox(g4, X4, .45 + r * .9, -9.2 - r * 1.2, 34, .9 + r * .0, 1.2, [0x8a1020, 0x2a3a6a][r % 2], { cast: false });
  for (const sx of [-1, 1]) { const hx = X4 + sx * 16.2; addBox(g4, hx, 3.6, 0, .12, 2.0, 2.7, 0xffffff, { cast: false }); addBox(g4, hx, 1.6, 0, .24, 3.2, .24, 0x333844); const ring = new THREE.Mesh(new THREE.TorusGeometry(.5, .05, 8, 20), mat(0xff6a1c)); ring.rotation.x = Math.PI / 2; ring.position.set(hx - sx * .6, 3.2, 0); g4.add(ring); }
  const jbC = cvs(1024, 560); const drawJB = (pulse) => { const g = jbC.g, w = 1024, h = 560; g.fillStyle = '#0a0d18'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ffd92a'; g.lineWidth = 12; g.strokeRect(10, 10, w - 20, h - 20); txt(g, 'HALFTIME', w / 2, 74, 84, '#ffd92a'); txt(g, 'RAPTORS', 210, 168, 52, '#fff'); txt(g, 'VISITORS', 814, 168, 52, '#fff'); g.fillStyle = '#1a0a0e'; g.fillRect(70, 200, 280, 220); g.fillRect(674, 200, 280, 220); txt(g, '0', 210, 312, 230, pulse ? '#ff5a5a' : '#ff3a3a', { w: 700 }); txt(g, '0', 814, 312, 230, pulse ? '#ff5a5a' : '#ff3a3a', { w: 700 }); txt(g, '–', 512, 312, 150, '#fff'); txt(g, 'Q2   0:00', 512, 470, 60, '#9cc4ff'); jbC.t.needsUpdate = true; }; drawJB(0);
  { addBox(g4, X4, 6.3, -3, 7.6, 4.4, .6, 0x15161c, { cast: false }); board(g4, jbC.t, X4, 6.3, -2.68, 7.2, 4.0, 0); for (const sx of [-3, 3]) addBox(g4, X4 + sx, 9.5, -3, .06, 5, .06, 0x888888, { cast: false }); }

  // ================================================================== SET 5a: lone speaker + SET 5b: candle shop
  const g5 = grp[5], X5 = OX[5];
  flat(g5, X5, 0, 0, 30, 18, 0x4a4a58, { r: .9 }); addBox(g5, X5, 4, -6, 30, 8, .4, 0x2a2c40);
  for (let i = 0; i < 6; i++) addBox(g5, X5 - 12 + i * 4.8, 2.4, -5.6, 2.2, 4.8, .3, i % 2 ? 0x2f3250 : 0x24263a, { cast: false });
  const spk = new THREE.Group(); spk.position.set(X5 + 3.0, 0, 1.2); spk.rotation.y = -Math.PI / 2; g5.add(spk); { addBox(spk, 0, .9, 0, 1.6, 1.8, 1.2, 0x15161c, { round: .05 }); addBox(spk, 0, 2.5, 0, 1.4, 1.4, 1.0, 0x1b1c24, { round: .05 }); for (const [y, r] of [[.8, .55], [1.5, .3], [2.5, .45]]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r * .85, .1, 22), mat(0x333844)); c.rotation.x = Math.PI / 2; c.position.set(0, y, .55); spk.add(c); const cap = new THREE.Mesh(new THREE.CircleGeometry(r * .3, 14), mat(0x777c88)); cap.position.set(0, y, .61); spk.add(cap); } }
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x9cd8ff, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }); const rings = [0, 1, 2].map(() => { const r = new THREE.Mesh(new THREE.TorusGeometry(1, .035, 8, 40), ringMat.clone()); r.rotation.y = Math.PI / 2; r.visible = false; S.add(r); return r; });
  const beatLbl = label('1 BEAT', 2.2, .8, '#ffffff', '#111a40', 190), retLbl = label('RETIRED', 2.4, .8, '#c8102e', '#ffffff', 190);
  const g6 = grp[6], X6 = SHOP;
  flat(g6, X6, 0, 0, 14, 14, 0x9a6a40, { r: .55 }); addBox(g6, X6, 3.2, -3.4, 14, 6.4, .3, 0xe7cba0); addBox(g6, X6 - 7, 3.2, 0, .3, 6.4, 8, 0xd9b988); addBox(g6, X6 + 7, 3.2, 0, .3, 6.4, 8, 0xd9b988);
  { const sg = cvs(1024, 280, (g, w, h) => { g.fillStyle = '#2b1d3a'; g.beginPath(); g.roundRect(8, 8, w - 16, h - 16, 30); g.fill(); g.strokeStyle = '#f2c230'; g.lineWidth = 10; g.stroke(); txt(g, 'THE SAD', w / 2, 96, 120, '#fff4d8'); txt(g, 'CANDLE CO.', w / 2, 210, 110, '#f2c230'); }); board(g6, sg.t, X6, 5.3, 3.42, 6.2, 1.7, 0); addBox(g6, X6, 5.3, 3.22, 6.5, 1.95, .16, 0x15101c, { cast: false }); for (const sx of [-2.6, 2.6]) addBox(g6, X6 + sx, 6.6, 3.3, .06, 1.5, .06, 0x333333, { cast: false }); }
  for (let i = 0; i < 9; i++) addBox(g6, X6 - 3.4 + i * .85, 4.05, 1.8, .85, .5, 2.2, i % 2 ? 0xd94a4a : 0xf6efe0, { cast: false });
  addBox(g6, X6, 1.0, 1.0, 5.2, 1.0, 1.1, 0x6b4a2c, { round: .03 }); addBox(g6, X6, 1.52, 1.0, 5.4, .1, 1.3, 0x8a5a38);
  for (let r = 0; r < 3; r++) addBox(g6, X6 + 3.2, .9 + r * 1.1, -2.9, 3.0, .12, .7, 0x6b4a2c); addBox(g6, X6 - 3.2, 2.0, -2.9, 3.0, .12, .7, 0x6b4a2c); addBox(g6, X6 - 3.2, 3.1, -2.9, 3.0, .12, .7, 0x6b4a2c);
  const flames = [], candles = new THREE.Group(); g6.add(candles); const mkCandle = (x, y, z, h, c, s = 1) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(.14 * s, .14 * s, h, 14), mat(c, { roughness: .5 })); b.position.set(x, y + h / 2, z); b.castShadow = true; candles.add(b); const f = new THREE.Mesh(new THREE.SphereGeometry(.07 * s, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffc23a, toneMapped: false })); f.scale.y = 1.7; f.position.set(x, y + h + .1 * s, z); candles.add(f); flames.push(f); };
  { const cc = [0xf6efe0, 0xd94a4a, 0x9ac8f0, 0xf2c230, 0xb48ae0]; for (let k = 0; k < 6; k++) mkCandle(X6 - 2.3 + k * .75, 1.57, 1.1, .5 + (k % 3) * .15, cc[k % 5], 1.1); for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) mkCandle(X6 + 2.0 + k * .55, 1.0 + r * 1.1 + .06, -2.9 + (k % 2) * .1, .4 + (k % 3) * .12, cc[(k + r) % 5], .9); for (let k = 0; k < 4; k++) { mkCandle(X6 - 4.2 + k * .75, 2.06, -2.9, .5, cc[k % 5], 1); mkCandle(X6 - 4.2 + k * .75, 3.16, -2.9, .45, cc[(k + 2) % 5], 1); } }
  const owl = new THREE.Group(); owl.position.set(X6 + 4.0, 3.2, -2.8); g6.add(owl); { const bm = mat(0x7a5a3a, { roughness: .9 }); const body = new THREE.Mesh(new THREE.SphereGeometry(.42, 14, 12), bm); body.scale.set(1, 1.2, .9); body.position.y = .5; body.castShadow = true; const belly = new THREE.Mesh(new THREE.SphereGeometry(.3, 12, 10), mat(0xe0cfa8)); belly.scale.set(1, 1.15, .6); belly.position.set(0, .46, .26); const head = new THREE.Mesh(new THREE.SphereGeometry(.34, 14, 12), bm); head.position.y = 1.08; for (const sx of [-1, 1]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(.1, .24, 6), bm); ear.position.set(sx * .22, 1.4, 0); owl.add(ear); const ey = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff6c8, toneMapped: false })); ey.position.set(sx * .14, 1.12, .28); const pu = new THREE.Mesh(new THREE.SphereGeometry(.06, 8, 8), new THREE.MeshBasicMaterial({ color: 0x111111, toneMapped: false })); pu.position.set(sx * .14, 1.12, .38); owl.add(ey, pu); owl.userData['e' + sx] = ey; } const beak = new THREE.Mesh(new THREE.ConeGeometry(.07, .16, 6), mat(0xf2a23a)); beak.rotation.x = Math.PI / 2; beak.position.set(0, 1.02, .38); owl.add(body, belly, head, beak); }
  for (let i = 0; i < 10; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(.08, 8, 8), new THREE.MeshBasicMaterial({ color: [0xffd88a, 0xff9a6a, 0xfff2c0][i % 3], toneMapped: false })); b.position.set(X6 - 3.6 + i * .8, 4.55 + Math.sin(i * 1.3) * .12, 1.9); g6.add(b); }
  const regC = cvs(256, 128, (g, w, h) => { g.fillStyle = '#16181f'; g.fillRect(0, 0, w, h); txt(g, '$0.00', w / 2, h / 2, 64, '#59ff8a'); }); { addBox(g6, X6 + 1.8, 1.72, 1.0, .8, .24, .6, 0x333844); board(g6, regC.t, X6 + 1.8, 1.85, 1.31, .6, .26, 0); }

  // ================================================================== people
  const NCG = 20, N = 2 + NCG; const crowd = new Crowd(S, N, 61); const P = crowd.p; const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  const D = P[0], W2 = P[1]; const look = drakeLook(lib, S, crowd, 0, { coat: true, shirt: 0x1f5a3a }); D.h = 1; D.scale = 1.12;
  col(1, ['torso', 'armL', 'armR'], 0x16161c); col(1, ['legL', 'legR'], 0x23262e); col(1, ['hair'], 0x2a1d14); col(1, ['head', 'neck', 'handL', 'handR'], 0xe0b08c); W2.h = 1.0; W2.scale = 1.0;
  for (let i = 0; i < NCG; i++) { const j = 2 + i; col(j, ['torso', 'armL', 'armR'], [0xc8102e, 0xf4f4f4, 0x2a3a6a, 0x1b1f2a, 0xffd92a][i % 5]); col(j, ['legL', 'legR'], [0x1b1f2a, 0x2a3a6a][i % 2]); P[j].h = .95 + (i % 4) * .05; }
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const glasses = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.TorusGeometry(.085, .015, 8, 16), mat(0x111111)); S.add(m); return m; }); const gbridge = new THREE.Mesh(new THREE.BoxGeometry(.07, .015, .015), mat(0x111111)); S.add(gbridge);
  const place = (o, x, z, yaw, anim, y = 0, sp = .5) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.extra = 0; o.vis = true; o.scale = o.sc0 ?? o.scale; o.arms = null; o.pitch = 0; o.lie = 0; };
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const mic = new THREE.Group(); { const h = new THREE.Mesh(new THREE.CylinderGeometry(.035, .03, .3, 10), mat(0x15171c)); const hd = new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 10), mat(0x9aa3b0, { metalness: .8, roughness: .3 })); hd.position.y = .19; mic.add(h, hd); mic.visible = false; S.add(mic); }
  const phones = []; for (let i = 0; i < NCG; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.13, .22, .02), new THREE.MeshBasicMaterial({ color: 0xcfe8ff, toneMapped: false })); m.visible = false; S.add(m); phones.push(m); }
  const NT = 30; const tears = new THREE.InstancedMesh(new THREE.SphereGeometry(.045, 8, 8), new THREE.MeshBasicMaterial({ color: 0x5ab4ff, toneMapped: false }), NT); tears.frustumCulled = false; S.add(tears); const hideM = new THREE.Matrix4().makeScale(0, 0, 0);
  const tearAt = (srcs, on, t, spread = .7, fall = 1.3) => { const m = new THREE.Matrix4(), ps = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3(.8, 1.4, .8); for (let i = 0; i < NT; i++) { if (!on || !srcs.length) { tears.setMatrixAt(i, hideM); continue; } const s = srcs[i % srcs.length]; const u = (t * 1.1 + i * .137) % 1; const side = (i % 2 ? 1 : -1); ps.set(s.x + side * (.1 + u * spread * (.5 + rnd(i, 3))), s.y - .02 - u * u * fall + .12 * Math.sin(u * 3), s.z + .18 + rnd(i, 9) * .1); m.compose(ps, q, sc); tears.setMatrixAt(i, m); } tears.instanceMatrix.needsUpdate = true; };

  // ================================================================== camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3(); const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .4);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .03; E.y += Math.sin(t * 1.3 + 1) * .025; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .01); };
  const ez = (a, b, lt, t0, t1) => lerp(a, b, smooth((lt - t0) / (t1 - t0)));
  const VALS = ['0', '1', '1', '9', '47', '999'];

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); const ox = OX[bi];
    for (let i = 0; i < N; i++) P[i].vis = false;
    grp.forEach((g, i) => (g.visible = (i === bi) || (bi === 5 && i === 6 && lt >= 3.5)));
    mic.visible = false; glasses.forEach((m) => (m.visible = false)); gbridge.visible = false; pencil.visible = false; env.visible = false; phones.forEach((m) => (m.visible = false));
    [beatLbl, retLbl, chk, glue].forEach((s) => (s.visible = false)); rings.forEach((r) => (r.visible = false));
    let faceShock = false, tearSrc = [], tearOn = false, hudVal = VALS[bi], hot = bi >= 2; let an = {}; let ctr = ox;
    const head = () => hp(D, 'head');
    // ---------------------------------------------------------------- beat 0: booth
    if (bi === 0) {
      place(D, X0, -.55, 0, 'sit', -.25, .4); D.scale = 1.12;
      const wr = Math.sin(lt * 13); const act = smooth((lt - .6) / .4);
      D.pitch = .12 + .05 * Math.sin(lt * 2); D.arms = { lx: -.15, lz: -.15, rx: lerp(-.5, -1.38 + .05 * wr, act), rz: lerp(-.1, .12, act) };
      if (lt > 2.4) { const s = smooth((lt - 2.4) / .5); D.arms.lx = lerp(-.15, -1.3, s); D.arms.lz = -.1; }
      drawNB(Math.min(14, Math.floor(clamp((lt - .9) / 2.6) * 12)));
      const hR = hp(D, 'handR'); pencil.visible = true; pencil.position.copy(hR).add(new THREE.Vector3(.0, .13, .1)); pencil.rotation.set(.45 + .05 * wr, 0, .15);
      an = { p: new THREE.Vector3(X0 + .15, 1.05, .5), h: head() };
      rig(lt, [[0, [X0 - .8, 2.4, 4.6], [X0 + .2, 2.3, 4.0], [X0, 1.3, -.2], [X0, 1.3, -.2], 50, 46], [1.5, [X0 + 1.0, 3.2, 3.5], [X0 + .5, 3.0, 2.9], [X0 + .35, 1.1, .45], [X0 + .3, 1.1, .35], 44, 40], [2.8, [X0 + 2.8, 2.3, 4.8], [X0 + 2.0, 2.4, 4.3], [X0 + .3, 1.5, .2], [X0 + .2, 1.5, .2], 50, 46]], an, t);
    }
    // ---------------------------------------------------------------- beat 1: scroll
    if (bi === 1) {
      const zr = Z0 + 24 * smooth((lt - 1.0) / 2.0) ; const fl = smooth((lt - 1.0) / .3) * (1 - smooth((lt - 1.5) / .5));
      place(D, X1 + 1.9, Z0 + .2, 0, 'idle', 0, .5); D.scale = 1.12; const prou = smooth((lt - .15) / .3) * (1 - smooth((lt - .9) / .3));
      D.arms = { lx: lerp(-.1, -2.5, prou), lz: -.12, rx: lerp(-.1, -2.5, prou), rz: .12 }; D.pitch = lerp(.04, -.12, prou);
      if (lt > 1.0) { const th = Math.sin(smooth((lt - 1.0) / .4) * Math.PI); D.arms = { lx: -.1, lz: -.1, rx: -1.1 * th - .1, rz: .15 }; } if (lt > 3.4) { D.pitch = .3; D.arms = { lx: -.2, lz: -.1, rx: -.2, rz: .12 }; faceShock = false; }
      faceShock = lt > 1.9 && lt < 2.9;
      roll.position.set(X1, .27, lt < 1.0 ? Z0 + .05 : zr); roll.rotation.set(0, 0, Math.PI / 2); roll.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), (roll.position.z - Z0) / .26);
      for (let i = 0; i < NS; i++) { const s0 = Z0 + SL * i, f = clamp((zr - s0) / SL); const { m, c } = segs[i]; const ff = lt < 1.0 ? 0 : f; m.visible = ff > .01; if (ff > .01) { m.scale.y = ff; m.position.z = s0 + SL * ff / 2; c.t.repeat.set(1, ff); c.t.offset.set(0, 1 - ff); } }
      roll.visible = !(zr > Z0 + 23.9 && lt > 3.1); drawClk(t); const pulse = lt > 3.5 ? .35 + .3 * Math.sin(lt * 7) : 0; hl.material.opacity = pulse;
      an = { h: head() };
      rig(lt, [[0, [X1 + .5, 2.2, Z0 + 5.4], [X1 + .3, 2.0, Z0 + 4.8], [X1 + 1.2, 1.2, Z0 + .2], [X1 + 1.2, 1.2, Z0 + .2], 52, 48], [1.0, [X1 + .5, 5.5, Z0 + 17], [X1 + .5, 4.6, Z0 + 14], [X1, 0, Z0 + 4], [X1, 0, Z0 + 8], 58, 54], [2.1, [X1 - 1.0, 2.6, 13.5], [X1 - .6, 2.5, 15.2], [X1, 3.0, 23], [X1, 3.0, 23], 52, 46], [3.55, [X1 - .4, 3.8, Z0 + 4.0], [X1 - .2, 3.5, Z0 + 3.4], [X1 + .1, .1, Z0 + .8], [X1 + .1, .1, Z0 + .8], 46, 42]], an, t);
    }
    // ---------------------------------------------------------------- beat 2: scissors, cut + paste
    if (bi === 2) {
      place(D, X2 + .2, -3.0, 0, 'idle', 0, .6); D.scale = 1.12; D.pitch = .1; D.arms = { lx: -.4, lz: -.1, rx: -.4, rz: .1 };
      const cutU = clamp((lt - .35) / .95); const cutDone = lt > 1.3; const sx0 = PA[0] - (PW - .45) / 2, sx1 = PA[0] + (PW - .45) / 2; const sx = lerp(sx0 - .2, sx1 + .1, cutU);
      if (lt > .1 && lt < 1.9) { scis.visible = true; scis.position.set(sx, 1.1 + (lt < .35 ? (1 - smooth((lt - .1) / .25)) * .6 : 0) - smooth((lt - 1.4) / .5) * 0, SLOT_A[2] + .1); scis.rotation.set(-.12, Math.PI / 2 * 0 + 0, 0); scis.rotation.y = 0; const o = .22 + .2 * Math.sin(lt * 26); scis.userData.a.rotation.y = o * (lt < 1.4 ? 1 : .3); scis.userData.b.rotation.y = -o * (lt < 1.4 ? 1 : .3); scis.position.x = sx; const a = scis.userData; a.a.position.set(0, 0, 0); a.b.position.set(0, 0, 0); scis.rotation.y = Math.PI / 2; scis.rotation.z = 0; } else scis.visible = false;
      if (scis.visible) { scis.position.z = SLOT_A[2] + .12 - .0; scis.position.y = 1.15; }
      // strip 1: on page, then falls aside, then carried to B
      let s1 = SLOT_A.slice(), s1r = 0; if (lt >= 1.3 && lt < 3.35) { const f = smooth((lt - 1.3) / .5); s1 = [SLOT_A[0] + 1.2 * f, .98 - 0 * f, SLOT_A[2] + 1.9 * f]; s1[1] = .96 + .012; s1r = .5 * f; } if (lt >= 3.35) { const u = clamp((lt - 3.35) / .75); const a0 = [SLOT_A[0] + 1.2, .97, SLOT_A[2] + 1.9]; s1 = [lerp(a0[0], SLOT_B[0], smooth(u)), lerp(a0[1], SLOT_B[1], u) + Math.sin(u * Math.PI) * 1.6, lerp(a0[2], SLOT_B[2], smooth(u))]; s1r = .5 * (1 - u) + Math.sin(u * 6) * .2 * (1 - u); }
      strip1.position.set(...s1); strip1.rotation.z = s1r; strip1.visible = true; if (cutU < 1) { strip1.visible = true; }
      const cutVis = cutU < 1 && lt > .35; if (cutVis) { strip1.scale.set(1, 1, 1); }
      if (cutDone && !holeShown) { pgA.draw(true); holeShown = true; } if (!cutDone && holeShown) { pgA.draw(false); holeShown = false; }
      const u2 = clamp((lt - 4.55) / .35); strip2.visible = lt > 4.55; strip2.position.set(SLOT_B2[0], SLOT_B2[1] + (1 - smooth(u2)) * 1.1, SLOT_B2[2]); strip2.scale.setScalar(lerp(1.4, 1, smooth(u2))); strip2.rotation.z = (1 - u2) * .5;
      strip3.visible = false;
      hudVal = lt < 4.1 ? '1' : lt < 4.6 ? '2' : '3'; hot = true;
      chk.visible = lt > 2.05 && lt < 3.2; chk.position.set(PA[0] + .0, 1.55 + .15 * Math.sin(lt * 6), PA[2] + .6); chk.scale.setScalar(1.3 * clamp((lt - 2.05) / .25));
      glue.visible = lt > 3.95 && lt < 4.5; glue.position.set(PB[0] + 1.1, 1.5, PB[2] - .5);
      const reach = smooth((lt - 3.1) / .4) * (1 - smooth((lt - 4.2) / .4)); D.arms = { lx: -.4, lz: -.1, rx: lerp(-.4, -1.35 + Math.sin(lt * 9) * .1, reach) , rz: .1 }; if (lt > 4.5) { const s = smooth((lt - 4.5) / .3); D.arms.lx = lerp(-.4, -2.4, s); D.arms.lz = -.1 - s * .3; D.arms.rx = lerp(-.4, -2.4, s); D.arms.rz = .1 + s * .3; }
      faceShock = lt > 4.5; an = { h: head() };
      const xc = ez(PA[0], PB[0], lt, 2.5, 3.2);
      rig(lt, [[0, [PA[0] - .6, 3.9, 4.3], [PA[0] - .2, 3.6, 3.6], [PA[0], .95, -.1], [PA[0], .95, -.5], 46, 42], [1.9, [PA[0] + .9, 3.7, 4.0], [PA[0] + 1.6, 3.8, 4.6], [PA[0] + .3, .95, -.4], [PA[0] + 1.0, .95, -.2], 50, 52], [2.7, [X2 + 0, 4.4, 5.0], [X2 + .3, 4.2, 5.4], [X2, .95, -.5], [X2 + .3, .95, -.4], 56, 60], [3.4, [PB[0] - .2, 3.7, 4.2], [PB[0] + .2, 3.6, 3.8], [PB[0], .95, -.45], [PB[0], .95, -.3], 48, 44]], an, t);
    }
    // ---------------------------------------------------------------- beat 3: ghostwriter
    if (bi === 3) {
      place(W2, X3, -.75, 0, 'sit', -.25, .4); place(D, X3 + 3.2, .9, -Math.PI / 2 - .2, 'idle', 0, .6); D.scale = 1.12;
      const typing = smooth((lt - .9) / .3); const hy = Math.sin(lt * 17); W2.pitch = .12; W2.arms = { lx: lerp(-.3, -1.35 + .08 * hy, typing), lz: -.05, rx: lerp(-.3, -1.35 - .08 * hy, typing), rz: .05 };
      const give = smooth((lt - .15) / .35) * (1 - smooth((lt - 1.0) / .3)); D.arms = { lx: -.1, lz: -.1, rx: lerp(-.2, -1.2, give), rz: .15 }; D.pitch = .05; if (lt > 2.6) { const s = smooth((lt - 2.6) / .4); D.arms = { lx: -.1, lz: -.1, rx: lerp(-.2, -2.2, s), rz: .6 }; D.pitch = .25 * s; }
      const rise = smooth((lt - 1.0) / 1.2), nLines = Math.min(4, Math.floor(clamp((lt - .9) / 2.0) * 5)); const tn = Math.floor(clamp((lt - 2.3) / 2.5) * 14); drawPP(nLines, tn);
      const py = lerp(1.35, 2.35, rise); paperF.position.y = paperB.position.y = py + (rise > 0 ? 0 : -1); paperF.visible = paperB.visible = lt > .8;
      tw.userData.keys.forEach((k, i) => { k.position.y = .44 + (typing > .5 && Math.sin(lt * 21 + i * 2.1) > .85 ? -.05 : 0) + (Math.floor(i / 9)) * .04 - .0; });
      env.visible = lt < 1.3; { const hD = hp(D, 'handR'); const u = smooth((lt - .55) / .7); env.position.set(lerp(hD.x - .1, X3 + .4, u), lerp(hD.y, 1.02, u), lerp(hD.z + .1, .55, u)); env.rotation.y = .3; }
      gbridge.visible = true; glasses.forEach((m) => (m.visible = true)); { const h = W2; attach(glasses[0], h, 'head', [-.1, .02, .222]); attach(glasses[1], h, 'head', [.1, .02, .222]); attach(gbridge, h, 'head', [0, .03, .222]); }
      faceShock = lt > 2.0 && lt < 2.9; const hW = hp(W2, 'head'); tearSrc = [hW]; tearOn = lt > 2.2; an = { h: hW };
      rig(lt, [[0, [X3 + 2.0, 3.0, 7.4], [X3 + 1.4, 2.9, 6.6], [X3 + 1.0, 1.4, 0], [X3 + .8, 1.4, 0], 52, 50], [1.45, [X3 - .4, 3.2, 5.6], [X3 - .2, 3.3, 5.0], [X3, 2.0, .9], [X3, 2.2, .9], 48, 44], [3.1, [X3 - 1.6, 3.4, 6.2], [X3 - .8, 3.3, 5.6], [X3, 1.9, .6], [X3, 2.0, .8], 50, 46]], an, t);
    }
    // ---------------------------------------------------------------- beat 4: arena
    if (bi === 4) {
      place(D, X4, 1.0, 0, 'idle', .6, .5); D.scale = 1.15;
      const sing = Math.sin(lt * 5) * .06; const cry = smooth((lt - 3.0) / .5); D.pitch = lerp(.0, .22, cry) + sing * .3; D.arms = { lx: lerp(-.3, -.4, cry), lz: -.12, rx: lerp(-1.75 + sing, -1.95, cry), rz: .12 };
      if (lt > 3.0) D.arms.lx = lerp(-.3, -2.1, cry * (.8 + .2 * Math.sin(lt * 6))); if (lt > 3.0) D.arms.lz = lerp(-.12, -.35, cry);
      mic.visible = true; { attach(mic, D, 'handR', [0, -.12, .08], [.25, 0, 0]); mic.visible = true; }
      for (let i = 0; i < NCG; i++) { const o = P[2 + i]; const row = Math.floor(i / 10), k = i % 10; place(o, X4 - 6.3 + k * 1.4 + (row ? .7 : 0), -6.4 - row * 1.2, rnd(i, 1) * .3 - .15, 'sit', .9 + row * .9 - .73 + .1, .5); o.scale = 1.0; const wv = Math.sin(lt * 4 + i * 1.7) * .18; const up = lt > 1.4 || i % 3 === 0; o.arms = up ? { lx: -.15, lz: -.15, rx: -2.55 + wv, rz: .25 } : { lx: -.2, lz: -.1, rx: -.2, rz: .1 }; if (i % 2) o.arms.lx = -2.4 - wv; o.pitch = 0; }
      for (let i = 0; i < NCG; i++) { const o = P[2 + i]; if (!(lt > 1.0 || i % 3 === 0)) continue; const h = hp(o, 'handR'); phones[i].visible = true; phones[i].position.copy(h).add(new THREE.Vector3(0, .13, .12)); phones[i].quaternion.set(0, 0, 0, 1); }
      drawJB(Math.floor(t * 2) % 2); const hd = head(); tearSrc = [hd.clone().add(new THREE.Vector3(-.1, 0, .0)), hd.clone().add(new THREE.Vector3(.1, 0, 0))]; tearOn = lt > 3.0; faceShock = lt > 3.0; an = { h: hd };
      rig(lt, [[0, [X4 - 9.0, 3.2, 9.5], [X4 - 6.4, 2.8, 8.2], [X4 + .5, 1.8, -1.0], [X4 + 1, 1.8, -1.5], 56, 52], [2.3, [X4 + 2.0, 1.55, 6.6], [X4 + 1.2, 1.7, 5.4], [X4, 1.85, 1.0], [X4, 1.85, 1.0], 44, 38], [4.5, [X4 + .0, 2.2, 7.6], [X4 + .0, 3.0, 6.0], [X4, 5.4, -3], [X4, 5.9, -3], 58, 54]], an, t);
    }
    // ---------------------------------------------------------------- beat 5: speaker drop + candle shop
    if (bi === 5) {
      if (lt < 3.5) {
        // speaker (right) fires rings toward Drake (left)
        const hit = clamp((lt - 1.45) / .3); const back = smooth((lt - 1.5) / .6) * (1 - smooth((lt - 2.6) / .5));
        const walk = lt > 2.9; place(D, X5 - 1.6 - back * .5 - (walk ? (lt - 2.9) * 2.6 : 0), 1.2, walk ? -Math.PI / 2 : Math.PI / 2, walk ? 'walk' : 'idle', 0, walk ? .8 : .5); D.scale = 1.12; D.pitch = -.15 * back;
        D.arms = lt < 2.5 ? { lx: -.2, lz: -.15, rx: lerp(-1.75, -2.4, back), rz: .12 + back * .5 } : { lx: -.2, lz: -.1, rx: -.2, rz: .1 }; if (lt >= 2.5 && lt < 2.9) D.arms = { lx: -.2, lz: -.1, rx: -.2, rz: .1 }; if (walk) D.arms = null; if (walk) D.pitch = .25;
        faceShock = lt > 1.4 && lt < 2.9;
        const rel = lt - 2.5; const hR = hp(D, 'handR'); mic.visible = true; if (lt < 2.5) attach(mic, D, 'handR', [0, -.12, .08], [.25, 0, 0]); else { const db = dropBounce(Math.max(.2, lt < 2.55 ? hR.y : 1.0), 0, rel, .3); mic.position.set(X5 - 3.4 + 0 * rel, db.y + .05, 1.45); mic.matrixAutoUpdate = true; mic.rotation.set(Math.PI / 2 * Math.min(1, rel * 3) + .0, 0, .3); mic.visible = true; }
        for (let r = 0; r < 3; r++) { const u = (lt - (.75 + r * .22)) / 1.0; const on = u > 0 && u < 1.15; rings[r].visible = on; if (on) { const x = X5 + 2.0 - u * 3.9; rings[r].position.set(x, 1.3, 1.2); rings[r].scale.set(.5 + u * .9, .5 + u * .9, .5 + u * .9); rings[r].material.opacity = .85 * (1 - clamp(u - .3, 0, 1)); } }
        beatLbl.visible = lt > .6 && lt < 2.1; beatLbl.position.set(X5 + 2.6, 4.2 + .1 * Math.sin(t * 8), 1.2); beatLbl.scale.set(2.2 * clamp((lt - .6) / .15), .8 * clamp((lt - .6) / .15), 1);
        retLbl.visible = lt > 2.75 && lt < 3.5; { const hD = head(); retLbl.position.set(hD.x, hD.y + .9, hD.z + .3); retLbl.scale.set(1.8 * clamp((lt - 2.75) / .15), .6 * clamp((lt - 2.75) / .15), 1); }
        an = { h: head() }; ctr = X5;
        rig(lt, [[0, [X5 + .6, 3.0, 17.5], [X5 + .4, 2.8, 16.0], [X5 + .6, 1.8, 0], [X5 + .6, 1.8, 0], 56, 54], [1.5, [X5 - .6, 2.4, 9.5], [X5 - 1.4, 2.4, 9.0], [X5 - 1.6, 1.4, 1.2], [X5 - 1.8, 1.4, 1.2], 50, 48], [2.5, [X5 - 1.5, 2.8, 10.5], [X5 - 2.5, 2.6, 10.0], [X5 - 2.8, 1.3, 1.4], [X5 - 3.6, 1.2, 1.4], 52, 54]], an, t);
      } else {
        const l2 = lt - 3.5; ctr = X6;
        place(D, X6 - .6, -.55, 0, 'idle', 0, .5); D.scale = 1.12; col(0, ['torso', 'armL', 'armR'], 0xd9b38c); crowd.parts.torso.instanceColor.needsUpdate = true; crowd.parts.armL.instanceColor.needsUpdate = true; crowd.parts.armR.instanceColor.needsUpdate = true;
        const wipe = smooth((l2 - 1.2) / .3) * (1 - smooth((l2 - 1.9) / .3)); D.pitch = .05; D.arms = { lx: -.25, lz: -.12, rx: lerp(-.3, -2.35, wipe), rz: lerp(.12, .55, wipe) }; if (l2 > 2.2) { const s = smooth((l2 - 2.2) / .3); D.arms.lx = lerp(-.25, -1.3, s); D.arms.lz = -.1; }
        tearSrc = [head()]; tearOn = l2 > .4; faceShock = false;
        owl.rotation.y = Math.sin(t * .8) * .25; const bl = (t % 3) > 2.85 ? .1 : 1; owl.userData.e1.scale.y = bl; owl.userData['e-1'].scale.y = bl;
        an = { h: head() };
        rig(l2, [[0, [X6 + .5, 3.6, 14.5], [X6 + .4, 3.5, 13.0], [X6, 3.9, 0], [X6, 3.8, 0], 54, 52], [1.0, [X6 - .6, 2.5, 8.8], [X6 - .2, 2.4, 8.0], [X6 + .2, 2.2, -.6], [X6 + .4, 2.2, -.7], 52, 48]], an, t);
      }
      hot = true; hudVal = '999';
      if (lt >= 3.5) col(0, ['torso', 'armL', 'armR'], 0xd9b38c);
    }
    if (bi !== 5 || lt < 3.5) { col(0, ['torso', 'armL', 'armR'], 0x1f5a3a); }
    if (bi !== 2) { strip1.visible = strip2.visible = strip3.visible = false; scis.visible = false; }
    if (bi === 5 && lt >= 3.5) { crowd.parts.torso.instanceColor.needsUpdate = true; }
    // flame flicker
    flames.forEach((f, i) => { f.scale.set(1 + .15 * Math.sin(t * 12 + i), 1.7 + .35 * Math.sin(t * 9 + i * 2), 1 + .15 * Math.sin(t * 11 + i)); });
    crowd.parts.torso.instanceColor.needsUpdate = true; crowd.parts.armL.instanceColor.needsUpdate = true; crowd.parts.armR.instanceColor.needsUpdate = true;
    // tears
    const tr = tearSrc.length ? tearSrc : []; tearAt(tr, tearOn, t, bi === 4 ? 1.1 : .6, bi === 4 ? 1.8 : 1.0);
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t); look.update(); look.setVisible(D.vis);
    // ghostwriter accessories must follow after crowd.update (matrices captured)
    if (bi === 3) { attach(glasses[0], W2, 'head', [-.1, .02, .222]); attach(glasses[1], W2, 'head', [.1, .02, .222]); attach(gbridge, W2, 'head', [0, .03, .222]); glasses.forEach((m) => (m.visible = true)); gbridge.visible = true; }
    if (bi === 4) { attach(mic, D, 'handR', [0, -.12, .08], [.25, 0, 0]); mic.visible = true; for (let i = 0; i < NCG; i++) { const o = P[2 + i]; if (!phones[i].visible) continue; phones[i].position.copy(hp(o, 'handR')).add(new THREE.Vector3(0, .14, .12)); } }
    if (bi === 5 && lt < 2.5) { attach(mic, D, 'handR', [0, -.12, .08], [.25, 0, 0]); mic.visible = true; }
    if (bi === 0) { const hR = hp(D, 'handR'); pencil.position.copy(hR).add(new THREE.Vector3(0, .14, .1)); pencil.visible = true; }
    A.follow(ctr, 0); A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    hud.counter('Sorries in the diss track', hudVal, '', 'PARODY', hot); { const tg = document.getElementById('tag'); tg.style.display = 'block'; tg.style.top = '246px'; }
    hud.tm(''); hud.pop('', 0);
  } };
}
