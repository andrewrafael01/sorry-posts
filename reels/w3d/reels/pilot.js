import { drakeLook, makeBubble } from './_drake.js';
// What if Drake was your airline pilot for 24 hours? PARODY (generic blocky caricature, no likeness, no lyrics). MrBeast-energy animated style.
// 0 exterior flyby -> huge Drake in aisle, shocked cabin. 1 PA apology while the water glass sits dead flat. 2 row-by-row hugs + counter.
// 3 circling above clouds (exterior), poem in the cockpit, empty fuel gauge. 4 whole cabin + crew crying (flood). 5 touchdown, WRONG CITY, ovation.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, addBox, mat, Crowd, Particles, clamp, smooth, lerp, attach, R } = lib;
  const st = makeStage({ shadowExtent: 34, fogNear: 260, fogFar: 1500, sunDir: [-.35, .95, -.25], sunI: 2.3, exposure: 1.08, skyTop: 0x2c76de, skyMid: 0x86bdf2, skyBot: 0xe6f0fb });
  const S = st.scene; const cam3 = st.camera;
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const grp = () => { const g = new THREE.Group(); S.add(g); return g; };
  const bx = (g, x, y, z, w, h, d, color, o = {}) => { const m = addBox(S, x, y, z, w, h, d, color, o); g.add(m); return m; };
  const font = (px) => `900 ${px}px Liberation Sans, Arial`;
  const sunTo = (x, y, z) => { const s = st.sun; s.target.position.set(x, y, z); s.position.set(x, y, z).add(s.userData.dir); };

  // ================================================================ CABIN (nose at z=0, aisle along +z, passengers face -z)
  const CAB = grp(); const L = 28, NR = 14, ZR0 = 4.2, DZ = 1.6, SX = [-3.5, -2.5, -1.5, 1.5, 2.5, 3.5], CH = 4.8;
  bx(CAB, 0, -.06, L / 2, 8.8, .12, L + .4, 0x39465c, { cast: false }); bx(CAB, 0, .01, L / 2, 1.9, .03, L, 0xc42a3a, { cast: false });
  for (const sx of [-1, 1]) { bx(CAB, sx * 4.4, CH / 2, L / 2, .2, CH, L + .4, 0xf0ece2, { cast: false }); bx(CAB, sx * 3.55, 4.05, L / 2, 1.9, .7, L, 0xe8e4da, { cast: false, round: .1 }); bx(CAB, sx * 1.2, CH - .05, L / 2, .22, .05, L, 0xffffff, { cast: false, mat: { emissive: 0xffffff, emissiveIntensity: 1.2 } }); }
  bx(CAB, 0, CH + .05, L / 2, 9, .15, L + .4, 0xf4f1ea, { cast: false }); bx(CAB, 0, CH / 2, L + .15, 9, CH, .2, 0xe9e5db, { cast: false });
  bx(CAB, 0, CH / 2, -.05, 8.8, CH, .2, 0xe4e0d6, { cast: false }); bx(CAB, 0, 1.5, .08, 1.5, 3.0, .08, 0x2e3a4d, { cast: false, round: .03 }); bx(CAB, 0, 2.5, .13, .5, .5, .03, 0x9fd0ff, { cast: false, mat: { emissive: 0x6fa0d0, emissiveIntensity: .5 } });
  // windows with scrolling speed streaks
  const WT = cvs(256, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#3f8be8'); gr.addColorStop(1, '#bfe0fb'); g.fillStyle = gr; g.fillRect(0, 0, w, h); const r = R(7); for (let i = 0; i < 16; i++) { g.fillStyle = `rgba(255,255,255,${.35 + r() * .5})`; g.fillRect(r() * w, r() * h, 50 + r() * 150, 3 + r() * 6); } }); WT.t.wrapS = WT.t.wrapT = THREE.RepeatWrapping;
  const winMat = new THREE.MeshBasicMaterial({ map: WT.t }); const winGeo = new THREE.PlaneGeometry(.95, 1.15);
  for (const sx of [-1, 1]) for (let i = 0; i < 16; i++) { const z = 3.4 + i * 1.6; const w = new THREE.Mesh(winGeo, winMat); w.position.set(sx * 4.29, 2.35, z); w.rotation.y = -sx * Math.PI / 2; CAB.add(w); bx(CAB, sx * 4.31, 2.35, z, .06, 1.35, 1.15, 0xd8d3c6, { cast: false }); }
  // seats (instanced)
  const NS = NR * 6; const seatBase = new THREE.InstancedMesh(new RoundedBoxGeometry(.85, .24, .8, 2, .06), mat(0x2c4f9e), NS), seatBack = new THREE.InstancedMesh(new RoundedBoxGeometry(.85, 1.35, .2, 2, .06), mat(0x2c4f9e), NS), seatLeg = new THREE.InstancedMesh(new THREE.BoxGeometry(.18, .4, .5), mat(0x20252f), NS);
  { const d = new THREE.Object3D(); for (let i = 0; i < NS; i++) { const r = (i / 6) | 0, c = i % 6, x = SX[c], z = ZR0 + r * DZ; d.position.set(x, .38, z); d.updateMatrix(); seatBase.setMatrixAt(i, d.matrix); d.position.set(x, 1.18, z + .48); d.updateMatrix(); seatBack.setMatrixAt(i, d.matrix); d.position.set(x, .2, z); d.updateMatrix(); seatLeg.setMatrixAt(i, d.matrix); } [seatBase, seatBack, seatLeg].forEach((m) => { m.castShadow = m.receiveShadow = true; m.frustumCulled = false; CAB.add(m); }); }
  // hanging LED sign across the aisle (faces the camera that looks aft)
  const SG = cvs(1024, 300, () => {}); let sgKey = ''; const sgMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 1.64), new THREE.MeshBasicMaterial({ map: SG.t })); sgMesh.rotation.y = Math.PI; CAB.add(sgMesh);
  bx(CAB, 0, 4.55, 0, .12, .5, .12, 0x333333, { cast: false }).visible = false;
  const drawSign = (a, b, col) => { const k = a + b + col; if (k === sgKey) return; sgKey = k; const g = SG.g; g.fillStyle = '#0b0f18'; g.fillRect(0, 0, 1024, 300); g.strokeStyle = col; g.lineWidth = 12; g.strokeRect(10, 10, 1004, 280); g.textAlign = 'center'; g.fillStyle = '#c8d0dd'; g.font = font(54); g.fillText(b, 512, 80); g.fillStyle = col; g.font = font(150); g.fillText(a, 512, 245); SG.t.needsUpdate = true; };
  // giant cash stacks
  const CT = cvs(128, 128, (g, w, h) => { g.fillStyle = '#6fb35a'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 6) { g.fillStyle = y % 12 ? 'rgba(255,255,255,.28)' : 'rgba(0,60,0,.25)'; g.fillRect(0, y, w, 3); } g.fillStyle = '#f2ead0'; g.fillRect(0, 50, w, 26); g.fillStyle = '#2c6a2a'; g.font = font(30); g.textAlign = 'center'; g.fillText('$100', 64, 72); });
  const cashMk = (w, h, d) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, .05), new THREE.MeshStandardMaterial({ map: CT.t, roughness: .7 })); m.castShadow = true; S.add(m); return m; };
  const CASH = [cashMk(.95, 1.5, .8), cashMk(.95, 1.5, .8), cashMk(.95, 1.0, .8), cashMk(.95, 1.0, .8), cashMk(.95, 1.9, .8), cashMk(.95, 1.3, .8)];
  // giant glass of water (beat 1 gag)
  const glass = grp(); { const gl = new THREE.Mesh(new THREE.CylinderGeometry(.5, .42, 1.15, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0xd8f0ff, transparent: true, opacity: .35, roughness: .05, side: THREE.DoubleSide })); gl.position.y = .575; const wt = new THREE.Mesh(new THREE.CylinderGeometry(.47, .41, .85, 24), new THREE.MeshStandardMaterial({ color: 0x4aa8ff, transparent: true, opacity: .8, roughness: .1 })); wt.position.y = .45; const base = new THREE.Mesh(new THREE.CylinderGeometry(.6, .6, .08, 24), mat(0x333a48)); base.position.y = .04; glass.add(base, gl, wt); glass.visible = false; }

  // ================================================================ COCKPIT (dollhouse, camera side open) z -6..0
  const COCK = grp(); bx(COCK, 0, -.06, -3.1, 6.4, .12, 6.4, 0x39465c, { cast: false }); bx(COCK, -3.1, 2.2, -3.1, .2, 4.4, 6.4, 0xdcd8ce, { cast: false });
  bx(COCK, 0, .85, -5.6, 6.4, 1.7, 1.2, 0x242b38); bx(COCK, 0, 4.2, -5.8, 6.4, .6, .8, 0xcfcbc1, { cast: false }); for (const sx of [-1, 1]) bx(COCK, sx * 3.1, 2.8, -5.9, .25, 2.4, .5, 0xcfcbc1, { cast: false });
  const WS = cvs(512, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2f78da'); gr.addColorStop(.6, '#9ccbf3'); gr.addColorStop(1, '#f5fbff'); g.fillStyle = gr; g.fillRect(0, 0, w, h); const r = R(11); for (let i = 0; i < 26; i++) { const x = r() * w, y = 110 + r() * 140; for (let k = 0; k < 6; k++) { g.fillStyle = `rgba(255,255,255,${.6 + r() * .3})`; g.beginPath(); g.arc(x + (r() - .5) * 90, y + (r() - .5) * 26, 20 + r() * 40, 0, 7); g.fill(); } } });
  const ws = new THREE.Mesh(new THREE.PlaneGeometry(5.9, 2.5), new THREE.MeshBasicMaterial({ map: WS.t })); ws.position.set(0, 2.85, -5.45); COCK.add(ws);
  const GA = cvs(512, 512, () => {}); const gaMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ map: GA.t })); gaMesh.position.set(.1, 1.6, -5.0); gaMesh.rotation.x = -.5; COCK.add(gaMesh);
  const drawGauge = (f, flash) => { const g = GA.g; g.fillStyle = '#10151f'; g.fillRect(0, 0, 512, 512); g.strokeStyle = '#ffd92a'; g.lineWidth = 14; g.strokeRect(7, 7, 498, 498); g.textAlign = 'center'; g.fillStyle = '#9fe08a'; g.font = font(58); g.fillText('FUEL', 256, 74);
    g.lineWidth = 26; for (let i = 0; i < 3; i++) { g.strokeStyle = ['#ff3a2e', '#ffd92a', '#4fd16a'][i]; g.beginPath(); g.arc(256, 340, 190, Math.PI * (1 + i / 3), Math.PI * (1 + (i + 1) / 3) - .03); g.stroke(); }
    const a = Math.PI * (1 + f); g.strokeStyle = '#fff'; g.lineWidth = 14; g.beginPath(); g.moveTo(256, 340); g.lineTo(256 + Math.cos(a) * 170, 340 + Math.sin(a) * 170); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(256, 340, 20, 0, 7); g.fill();
    g.fillStyle = '#ff4a3a'; g.font = font(54); g.fillText('E', 78, 432); g.fillStyle = '#4fd16a'; g.fillText('F', 434, 432); g.fillStyle = flash ? '#ff2a2a' : '#7a1a1a'; g.fillRect(150, 440, 212, 56); g.fillStyle = '#fff'; g.font = font(42); g.fillText('LOW FUEL', 256, 482); GA.t.needsUpdate = true; };
  for (const sx of [-2.3, -1.2, 1.5, 2.4]) { const dial = new THREE.Mesh(new THREE.CircleGeometry(.28, 18), new THREE.MeshBasicMaterial({ color: 0x1b2a3c })); dial.position.set(sx, 1.78, -4.98); dial.rotation.x = -.5; COCK.add(dial); const ring = new THREE.Mesh(new THREE.TorusGeometry(.28, .03, 6, 18), mat(0xc9cfd8)); ring.position.copy(dial.position); ring.rotation.x = -.5; COCK.add(ring); }
  const seatC = (x) => { bx(COCK, x, .38, -2.6, 1.0, .24, .9, 0x2a2f3a, { round: .06 }); bx(COCK, x, 1.25, -2.05, 1.0, 1.5, .24, 0x2a2f3a, { round: .06 }); bx(COCK, x, .17, -2.6, .3, .34, .5, 0x20252f); };
  seatC(-1.2); seatC(1.5);
  const nb = new THREE.Mesh(new THREE.BoxGeometry(.5, .04, .66), mat(0xfaf6e8)); nb.castShadow = true; S.add(nb); const pen = new THREE.Mesh(new THREE.BoxGeometry(.04, .04, .4), mat(0x1c4fd8)); S.add(pen);
  const PT = cvs(256, 330, (g, w, h) => { g.fillStyle = '#fbf8ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.font = '800 30px Georgia'; g.textAlign = 'center'; g.fillText('ODE TO CLOUDS', w / 2, 46); g.font = 'italic 26px Georgia'; g.textAlign = 'left'; ['oh cloud, you are', 'big and white.', 'i am big too.', 'we are both', 'out of fuel.'].forEach((s, i) => g.fillText(s, 24, 100 + i * 44)); });
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.93), new THREE.MeshBasicMaterial({ map: PT.t, side: THREE.DoubleSide })); paper.visible = false; S.add(paper);

  // ================================================================ EXTERIOR (high altitude + landing)
  const SKYG = grp(); const cloudFloor = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), new THREE.MeshStandardMaterial({ color: 0x93a8c8, roughness: 1 })); cloudFloor.rotation.x = -Math.PI / 2; cloudFloor.position.y = 330; cloudFloor.receiveShadow = true; SKYG.add(cloudFloor);
  { const NP = 260, im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: 0xe6edf8, roughness: 1, flatShading: true }), NP); const d = new THREE.Object3D(), r = R(21); for (let i = 0; i < NP; i++) { const a = r() * 6.28, rr = 40 + Math.pow(r(), .7) * 900; d.position.set(Math.cos(a) * rr, 330 + r() * 6, Math.sin(a) * rr); const s = 18 + r() * 46; d.scale.set(s, s * (.35 + r() * .35), s); d.updateMatrix(); im.setMatrixAt(i, d.matrix); } im.receiveShadow = true; im.frustumCulled = false; SKYG.add(im); }
  const makePlane = () => { const g = new THREE.Group(), inner = new THREE.Group(); g.add(inner); const white = mat(0xf4f6fa, { roughness: .45 }), red = mat(0xd8262e, { roughness: .5 }), dark = mat(0x1e2a3a, { roughness: .2, metalness: .3 });
    const add = (m, x, y, z) => { m.position.set(x, y, z); m.castShadow = true; inner.add(m); return m; };
    const fus = add(new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 26, 24), white), 0, 0, 0); fus.rotation.z = Math.PI / 2; const nose = add(new THREE.Mesh(new THREE.SphereGeometry(1.9, 24, 16), white), 13, 0, 0); nose.scale.set(1.8, 1, 1);
    const tail = add(new THREE.Mesh(new THREE.ConeGeometry(1.9, 9, 24), white), -17.5, .5, 0); tail.rotation.z = Math.PI / 2;
    for (let i = 0; i < 17; i++) for (const sz of [-1, 1]) add(new THREE.Mesh(new THREE.BoxGeometry(.5, .55, .12), dark), 11 - i * 1.4, .35, sz * 1.86);
    for (const sz of [-1, 1]) add(new THREE.Mesh(new THREE.BoxGeometry(26, .28, .08), red), -1, -.4, sz * 1.88);
    add(new THREE.Mesh(new THREE.BoxGeometry(1.4, .6, 2.6), dark), 14.3, .75, 0);
    for (const sz of [-1, 1]) { const w = add(new THREE.Mesh(new THREE.BoxGeometry(8.5, .3, 15), white), -1.5, -.9, sz * 8.5); w.rotation.y = sz * .5; w.position.x = -1.5 - 3.4; const w2 = w; w2.position.z = sz * 8.0; const en = add(new THREE.Mesh(new THREE.CylinderGeometry(.85, .85, 3.4, 16), white), 1.2, -1.9, sz * 6.0); en.rotation.z = Math.PI / 2; add(new THREE.Mesh(new THREE.CylinderGeometry(.6, .6, .1, 16), dark), 2.95, -1.9, sz * 6.0).rotation.z = Math.PI / 2; add(new THREE.Mesh(new THREE.BoxGeometry(3, .2, 8), white), -19.5, .6, sz * 4.2).rotation.y = sz * .35; }
    const fin = add(new THREE.Mesh(new THREE.BoxGeometry(5, 6, .35), red), -18.5, 3.6, 0); fin.rotation.z = .35;
    const gear = new THREE.Group(); for (const [x, z] of [[9.5, 0], [-1.5, -2.2], [-1.5, 2.2]]) { const s = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 1.6, 8), dark); s.position.set(x, -2.4, z); const wh = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, .5, 14), mat(0x15181d)); wh.rotation.x = Math.PI / 2; wh.position.set(x, -3.25, z); gear.add(s, wh); } gear.children.forEach((c) => (c.castShadow = true)); inner.add(gear); g.userData = { inner, gear }; g.visible = false; S.add(g); return g; };
  const plane = makePlane();
  const LAND = grp(); const X0 = 700; { const gr = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), mat(0x8a9a6a, { roughness: 1 })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; gr.position.set(X0, -.02, 0); LAND.add(gr);
    const rw = new THREE.Mesh(new THREE.PlaneGeometry(1200, 46), mat(0x353a44, { roughness: .95 })); rw.rotation.x = -Math.PI / 2; rw.position.set(X0, 0, 0); rw.receiveShadow = true; LAND.add(rw); for (let i = -30; i < 30; i++) { const dsh = addBox(S, X0 + i * 20, .03, 0, 9, .02, .7, 0xffffff, { cast: false }); LAND.add(dsh); }
    for (const sz of [-1, 1]) for (let i = -60; i < 60; i++) { const l = addBox(S, X0 + i * 10, .2, sz * 22.5, .4, .4, .4, 0xffe9a0, { cast: false, mat: { emissive: 0xffe08a, emissiveIntensity: 1 } }); LAND.add(l); }
    const rr = R(33); for (let i = 0; i < 46; i++) { const h = 14 + rr() * 56, w = 8 + rr() * 12, x = X0 - 260 + i * 17 + rr() * 6, z = -90 - rr() * 110; const b = addBox(S, x, h / 2, z, w, h, w, [0x8a96a8, 0x6f7c92, 0xa6b0c0, 0x5d6a80][(rr() * 4) | 0], { cast: false }); LAND.add(b); }
    const SIGN = cvs(1024, 360, (g, w, h) => { g.fillStyle = '#ffd92a'; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; for (let i = 0; i < 30; i++) { g.save(); g.translate(i * 40 - 20, 0); g.rotate(.6); g.fillRect(0, -40, 18, 80); g.restore(); g.save(); g.translate(i * 40 - 20, h); g.rotate(.6); g.fillRect(0, -40, 18, 80); g.restore(); } g.fillStyle = '#ffd92a'; g.fillRect(36, 36, w - 72, h - 72); g.fillStyle = '#111'; g.textAlign = 'center'; g.font = font(54); g.fillText('WELCOME TO', w / 2, 112); g.fillStyle = '#d8262e'; g.font = font(160); g.fillText('WRONG CITY', w / 2, 270); });
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(15, 5.27), new THREE.MeshBasicMaterial({ map: SIGN.t })); sg.position.set(X0 + 34, 6.4, -22); LAND.add(sg); for (const sx of [-6, 6]) LAND.add(addBox(S, X0 + 34 + sx, 2.9, -22.4, .5, 5.8, .5, 0x444a55)); }
  LAND.visible = SKYG.visible = false;
  const streaks = new THREE.InstancedMesh(new THREE.BoxGeometry(14, .12, .12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .75 }), 70); streaks.frustumCulled = false; S.add(streaks); const SK = []; { const r = R(5); for (let i = 0; i < 70; i++) SK.push([r() * 360, (r() - .5) * 80, (r() - .5) * 130, 90 + r() * 120]); }
  const trail = new Particles(S, 140, 0xffffff, 1, { rough: 1, emissive: 0x9aa8b8 }); const smoke = new Particles(S, 70, 0xe8e8e8, 1, { rough: 1, emissive: 0x555555 });
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, 1, 6), mat(0x111111)); S.add(cord); const hs = new THREE.Mesh(new THREE.BoxGeometry(.14, .55, .14), mat(0x15181d)); hs.castShadow = true; S.add(hs);
  const clip = new THREE.Mesh(new THREE.BoxGeometry(.5, .04, .66), mat(0x6a4a2c)); clip.castShadow = true; S.add(clip); const clipP = new THREE.Mesh(new THREE.BoxGeometry(.44, .01, .6), mat(0xfafafa)); clipP.position.y = .025; clip.add(clipP);
  const tissue = new THREE.Mesh(new RoundedBoxGeometry(1.1, .6, .6, 2, .08), mat(0x7fc4f2)); tissue.castShadow = true; S.add(tissue); const tis2 = new THREE.Mesh(new THREE.BoxGeometry(.5, .4, .3), mat(0xffffff)); tis2.position.y = .45; tissue.add(tis2);
  const flood = new THREE.Mesh(new THREE.PlaneGeometry(8.4, L), new THREE.MeshStandardMaterial({ color: 0x3f9cf0, transparent: true, opacity: .5, roughness: .1, metalness: .1 })); flood.rotation.x = -Math.PI / 2; flood.position.set(0, .05, L / 2); flood.visible = false; S.add(flood);
  const tears = new Particles(S, 900, 0x9fdcff, .05, { rough: .1, emissive: 0x2a7acb }); const hearts = new Particles(S, 60, 0xff5fa0, .09, { rough: .4, emissive: 0xff2f7a });
  const bills = new THREE.InstancedMesh(new THREE.BoxGeometry(.5, .015, .26), new THREE.MeshStandardMaterial({ color: 0x6cc26a, roughness: .6, emissive: 0x1d5a1d }), 160); bills.frustumCulled = false; S.add(bills); const BL = []; { const r = R(41); for (let i = 0; i < 160; i++) BL.push([(r() - .5) * 6, r(), 2 + r() * 14, r() * 6.28, 1 + r() * 2]); }

  // ================================================================ PEOPLE
  const NP = NS + 8; const crowd = new Crowd(S, NP, 53); const P = crowd.p; const FA0 = NS;
  const dcrowd = new Crowd(S, 1, 9); const D = dcrowd.p[0]; dcrowd.setFace('calm');
  const look = drakeLook(lib, S, dcrowd, 0, { jersey: 0x131a2c, pants: 0x0f121a, coat: true });
  const col = (c, i, k, v) => { c.parts[k].setColorAt(i, new THREE.Color(v)); c.parts[k].instanceColor.needsUpdate = true; };
  for (let i = FA0; i < NP; i++) { ['torso', 'armL', 'armR'].forEach((k) => col(crowd, i, k, 0xc8283c)); ['legL', 'legR'].forEach((k) => col(crowd, i, k, 0x1c2433)); }
  { const uni = mat(0x131a2c, { roughness: .8 }), gold = new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: .9, roughness: .25 });
    var crown = new THREE.Mesh(new THREE.BoxGeometry(.6, .22, .58), uni), band = new THREE.Mesh(new THREE.BoxGeometry(.62, .05, .6), mat(0xf4f4f0)), visor = new THREE.Mesh(new THREE.BoxGeometry(.4, .03, .22), mat(0x0a0a0c, { roughness: .3 })), badge = new THREE.Mesh(new THREE.BoxGeometry(.14, .14, .03), gold);
    var epL = new THREE.Mesh(new THREE.BoxGeometry(.22, .05, .34), gold), epR = new THREE.Mesh(new THREE.BoxGeometry(.22, .05, .34), gold), wings = new THREE.Mesh(new THREE.BoxGeometry(.2, .05, .02), gold), cufL = [], cufR = [];
    var uniAll = [crown, band, visor, badge, epL, epR, wings]; uniAll.forEach((m) => { m.castShadow = true; S.add(m); }); }
  const bub = [makeBubble(lib, S, 1.5, .56), makeBubble(lib, S, 1.5, .56)];
  const place = (o, x, z, yaw, anim = 'idle', sp = .4, sc = 1.1, y = 0) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.vis = true; o.scale = sc; };
  const sitAt = (o, x, z, yawOff = 0, bob = 0) => { place(o, x, z, Math.PI + yawOff, 'sit', .4, 1.05); o.y = .5 - .67 * o.scale * o.h + bob; };
  const standOn = (o, x, z, bob = 0) => place(o, x, z, Math.PI, 'idle', .4, 1.05, .5 + bob);
  const up = (o, t, k) => { o.arms = { lx: -2.7 + .22 * Math.sin(t * 9 + k), lz: .2, rx: -2.7 + .22 * Math.sin(t * 8.3 + k * 2), rz: -.2 }; };
  const brace = (o, t, k) => { o.arms = { lx: -1.35, lz: -.05, rx: -1.35, rz: .05 }; o.extra = .018; o.pitch = .08; };
  const cry = (o, t, k) => { o.arms = { lx: -2.3 + .08 * Math.sin(t * 9 + k), lz: .35, rx: -2.3 + .08 * Math.sin(t * 9 + k + 1), rz: -.35 }; o.pitch = .2; o.extra = .03; };
  const clap = (o, t, k) => { const c = .25 * Math.sin(t * 13 + k); o.arms = { lx: -1.45 + c * .3, lz: -.22 + c, rx: -1.45 - c * .3, rz: .22 - c }; };
  const hv = (o, key, off = [0, 0, 0]) => new THREE.Vector3(off[0], off[1], off[2]).applyMatrix4(o.M[key]);
  const mmss = (s) => { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 3600)).padStart(2, '0') + ':' + String(Math.floor(s / 60) % 60).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
  const HOURS = [0, 1, 2, 4, 6, 24];
  const POP = ['HE IS YOUR PILOT', 'APOLOGY #1', 'HUG EVERYONE', 'OUT OF FUEL', 'EVERYONE IS CRYING', 'WRONG CITY. STANDING OVATION.']; const NOTE = ['drake is flying for 24 hours', 'turbulence (none. sorry anyway)', 'passengers checked', 'fuel left. poem: in progress', 'people crying (crew too)', 'cities landed in: wrong one'];

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); const dur = tl.beats[bi].dur;
    for (let i = 0; i < NP; i++) { const o = P[i]; o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; } D.vis = false; D.arms = null; D.pitch = 0; D.extra = 0;
    [CAB, COCK, SKYG, LAND, glass, plane, nb, pen, paper, clip, tissue, flood, cord, hs, ...CASH].forEach((m) => (m.visible = false)); streaks.visible = bills.visible = false; trail.clear(); smoke.clear(); tears.clear(); hearts.clear(); bub.forEach((b) => b.hide());
    let cam = [0, 2, 1, 0, 2, 8, 55, 0], sun = [0, 0, 8], sgA = '24:00:00', sgB = 'SHIFT TIME LEFT', sgC = '#ffd92a', cnt = '', hot = false, bT = null; const faceShock = bi !== 4; let inCab = true, ext = 0;
    winMat.color.set(bi === 4 ? 0xffb070 : 0xffffff); WT.t.offset.x = -t * 1.4;
    const seatedAll = (fn, skip) => { for (let i = 0; i < NS; i++) { if (skip && skip(i)) continue; const [x, z] = [SX[i % 6], ZR0 + ((i / 6) | 0) * DZ]; sitAt(P[i], x, z, 0, fn.bob ? Math.abs(Math.sin(t * 5.5 + P[i].phase)) * fn.bob : 0); fn.pose(P[i], t, i); } };
    const cashSeats = (rows) => { let k = 0; for (const r of rows) for (const sx of [-1.5, 1.5]) { const m = CASH[k++]; const h = m.geometry.parameters.height; m.visible = true; m.position.set(sx, .5 + h / 2, ZR0 + r * DZ); m.rotation.y = sx * .12; } };
    const fas = (pose, zs) => { for (let k = 0; k < 8; k++) { const o = P[FA0 + k]; place(o, (k % 2 ? .48 : -.48), zs[k >> 1], Math.PI, 'idle', .4, 1.1); pose(o, t, k + 90); } };
    const dh = () => hv(D, 'head');
    const rowHide = (rows) => (i) => rows.includes((i / 6) | 0) && (i % 6 === 2 || i % 6 === 3);

    if (bi === 0) {
      if (lt < 1.2) { inCab = false; ext = 1; const u = lt / 1.2, px = 36 * t * 0 + 40 * lt; plane.visible = true; plane.position.set(px, 400, 0); plane.rotation.y = 0; plane.userData.inner.rotation.x = .16 + .05 * Math.sin(t * 4); plane.userData.gear.visible = false;
        cam = [px + 72 - u * 34, 414 - u * 6, 56 - u * 16, px, 400, 0, 58 - u * 6, .13]; sun = [px, 400, 0];
        for (let i = 0; i < 120; i++) trail.set(i, px - 21 - i * 1.5, 400.4, 0, 1.2 * (1 - i / 140) + .2); trail.done(); }
      else { const u = (lt - 1.2) / (dur - 1.2); seatedAll({ pose: up, bob: .16 }, rowHide([0, 1])); cashSeats([0, 1]); fas(up, [10.5, 12.8, 15.1, 17.4]);
        place(D, 0, 7.2, Math.PI, 'idle', .4, 1.8); D.arms = { lx: -1.9 + .12 * Math.sin(t * 6), lz: .6, rx: -1.9 + .12 * Math.sin(t * 5.2), rz: -.6 }; D.extra = .006;
        cam = [.25 * Math.sin(u * 3), 2.15 + u * .5, .7 + u * 2.6, 0, 2.55, 7.4, 70 - u * 28, -.09 + u * .1]; sun = [0, 0, 8]; sgA = '24:00:00'; sgB = 'DRAKE FLIGHT TIME'; sgC = '#ffd92a'; }
      cnt = lt < 1.2 ? '24:00:00' : '24:00:00'; }
    else if (bi === 1) {
      const A = lt < 3.5; seatedAll({ pose: A ? up : brace, bob: A ? .1 : 0 }, rowHide([0, 1])); cashSeats([0, 1]); fas(A ? up : brace, [10.5, 12.8, 15.1, 17.4]);
      place(D, 0, A ? 6.8 : 8.2, Math.PI, 'idle', .4, 1.8); D.arms = { lx: -.3, lz: -.1, rx: -2.1, rz: .1 }; D.pitch = .05;
      if (A) { const u = lt / 3.5; cam = [.3 - u * .2, 2.8 + u * .25, .9 + u * 1.5, 0, 3.2, 6.8, 58 - u * 8, -.1 + u * .05]; sgA = 'APOLOGY #1'; sgB = 'AIRLINE CAPTAIN'; sgC = '#ffd92a'; if (lt > 1.4) bT = ['sorry for the turbulence', dh(), -.1, 1.9]; }
      else { const u = (lt - 3.5) / (dur - 3.5); glass.visible = true; glass.position.set(-.35, 0, 4.4); glass.scale.setScalar(.8); cam = [.5 - u * .3, 2.3 + u * .1, 1.0 + u * .6, -.1, 1.7, 10.5, 64 - u * 6, .08 - u * .06]; sgA = '0.0'; sgB = 'TURBULENCE (CALM)'; sgC = '#4fe06a'; }
      sun = [0, 0, 8]; cnt = A ? '0.0' : '0.0'; }
    else if (bi === 2) {
      const u = clamp((lt - .25) / 6.2), Z0 = 25.6, Z1 = ZR0 + 4 * DZ; const kf = u * 10.0, kr = Math.floor(kf), f = kf - kr; const dz = Z0 - (kr + smooth(clamp((f - .5) / .5))) * DZ * 1.0 * (21.4 / (10 * DZ)); const dzc = Z0 - kf * (Z0 - Z1) / 10;
      const row = 13 - Math.min(10, Math.round(kf - .15)); const side = (kr % 2 ? -1 : 1); const turn = f < .62 ? smooth(Math.sin(Math.PI * clamp(f / .62)) * 1.4) : 0; const hugging = turn > .3;
      seatedAll({ pose: up, bob: .14 }, (i) => hugging && ((i / 6) | 0) === 13 - Math.min(10, kr + 0) && (i % 6 === (side > 0 ? 2 : 3)));
      fas(up, [9.2, 11.5, 13.8, 16.1]);
      const dzz = lerp(Z0, Z1, smooth(u * .0 + u)); place(D, 0, dzc, Math.PI + side * (Math.PI / 2) * Math.min(1, turn), 'walk', .5, 1.8); D.pitch = .25 * turn;
      D.arms = { lx: -1.0 - .45 * turn, lz: -.1 - .25 * turn, rx: -1.0 - .45 * turn, rz: .1 + .25 * turn }; if (turn < .2) { D.arms = { lx: -.35, lz: -.1, rx: -1.0, rz: .1 }; } else D.anim = 'idle';
      const hr = 13 - Math.min(10, kr); const hp = P[hr * 6 + (side > 0 ? 2 : 3)];
      if (hugging) { sitAt(hp, SX[side > 0 ? 2 : 3], ZR0 + hr * DZ, side > 0 ? -.9 : .9, 0); hp.arms = { lx: -1.3, lz: -.35, rx: -1.3, rz: .35 }; for (let h = 0; h < 8; h++) { const a = (lt * 2.6 + h / 8) % 1; hearts.set(h, SX[side > 0 ? 2 : 3] + Math.sin(h * 2.3) * .3, 2.2 + a * 1.4, ZR0 + hr * DZ + Math.cos(h * 1.7) * .2, 1.2 - a); } hearts.done(); }
      clip.visible = true; attach(clip, D, 'handL', [0, -.05, .12], [0, 0, 0]);
      cam = [Math.sin(u * 5) * .35, 3.2 + .3 * Math.sin(u * 4), dzc - 5.6, 0, 2.5, dzc + .5, 64 - 4 * Math.sin(u * 6), .07 * Math.sin(u * 7)]; sun = [0, 0, dzc]; const n = Math.round(200 * smooth(clamp((lt - .3) / 6.0))); cnt = n + '/200'; sgA = 'ROW ' + Math.max(1, Math.round(row)); sgB = 'PASSENGER CHECK'; sgC = '#4fe06a'; }
    else if (bi === 3) {
      if (lt < 3.0) { inCab = false; ext = 1; const u = lt / 3.0, th = lt * .62 + .4, Rc = 55; const px = Math.cos(th) * Rc, pz = Math.sin(th) * Rc; plane.visible = true; plane.position.set(px, 400, pz); plane.rotation.y = Math.atan2(-Math.cos(th), -Math.sin(th)); plane.userData.inner.rotation.x = .38; plane.userData.gear.visible = false;
        for (let i = 0; i < 140; i++) { const a = th - i * .018; trail.set(i, Math.cos(a) * Rc - 0, 400.2, Math.sin(a) * Rc, 1.8 * (1 - i / 160) + .2); } trail.done();
        const tx = lerp(0, px, smooth(u)), tz = lerp(0, pz, smooth(u)); cam = [lerp(-30, px * .6 + 20, smooth(u)), lerp(440, 418, smooth(u)), lerp(170, pz * .6 + 75, smooth(u)), tx, 400, tz, 62 - 10 * u, .14]; sun = [px, 400, pz]; }
      else { inCab = false; const sh = lt < 5.0; const u = sh ? (lt - 3.0) / 2.0 : (lt - 5.0) / (dur - 5.0); COCK.visible = true; ext = 2; sun = [0, 0, -3];
        place(D, -1.2, -2.6, 1.2, 'sit', .4, 1.45); D.yaw = 1.2; D.y = .5 - .67 * 1.45 * D.h; D.pitch = .22; D.arms = { lx: -1.15, lz: -.2, rx: -1.0 + .14 * Math.sin(t * 15), rz: .15 + .06 * Math.sin(t * 11) };
        const CP = P[0]; sitAt(CP, 1.5, -2.6, 0, 0); CP.z = -2.6; CP.scale = 1.2; CP.y = .5 - .67 * 1.2 * CP.h; CP.yaw = Math.PI + .25; CP.arms = { lx: -2.5, lz: .55, rx: -2.5, rz: -.55 }; CP.extra = .01;
        nb.visible = pen.visible = true; const hl = hv(D, 'handL', [0, -.1, .1]); nb.position.copy(hl).add(new THREE.Vector3(0, .02, 0)); nb.rotation.set(-.4, D.yaw, 0); attach(pen, D, 'handR', [0, -.1, .15], [0, 0, 0]);
        paper.position.set(-2.5, 3.1, -3.3); paper.rotation.set(0, .5 + Math.PI, 0); paper.rotation.y = Math.PI * 1.0 + .45; paper.scale.setScalar(.9 + .08 * Math.sin(t * 2));
        cashSeats([]); CASH[0].visible = CASH[1].visible = true; CASH[0].position.set(2.5, .5 + .75, -4.2); CASH[1].position.set(2.5, .5 + 2.25, -4.2); CASH[1].scale.set(.9, .9, .9);
        ws.rotation.z = .12 * Math.sin(t * .9); const fuel = lerp(.09, .015, smooth((lt - 3) / 3.8));
        if (sh) { cam = [3.4 - u * .5, 2.7, .9 - u * .3, -1.0, 2.3, -2.6, 56 - 6 * u, -.07 - u * .05]; bT = ['oh cloud, you are big', dh(), -1.0, 1.4]; }
        else { cam = [.15, 2.9 - u * .2, -.4 - u * 1.4, .1, 1.9, -5.0, 66 - 16 * u, .08 - .06 * u]; }
        drawGauge(fuel, Math.floor(t * 4) % 2 === 0); cnt = Math.round(fuel * 100) + '%'; hot = true; } }
    else if (bi === 4) {
      const u = lt / dur; seatedAll({ pose: cry, bob: 0 }, null); fas(cry, [9.2, 11.5, 13.8, 16.1]); flood.visible = true; flood.position.y = .05 + .5 * smooth(clamp(lt / 5.0));
      const sx = lt < 3.3 ? 0 : 1; place(D, 0, 5.6, Math.PI + .0, 'idle', .4, 1.8); D.arms = { lx: -1.3, lz: -.15, rx: -1.3, rz: .15 }; D.pitch = .08; tissue.visible = true; tissue.position.copy(hv(D, 'handL').add(hv(D, 'handR')).multiplyScalar(.5)).add(new THREE.Vector3(0, .05, .0)); tissue.rotation.y = D.yaw;
      cam = lt < 3.3 ? [.2 * Math.sin(u * 4), 4.15, .55 + u * 2, 0, 1.3, 12.5, 78 - u * 8, -.1 + u * .05] : [-.5 + (lt - 3.3) * .3, 2.5, 2.2 + (lt - 3.3) * .5, 0, 2.7, 6.5, 52 - (lt - 3.3) * 5, .08]; sun = [0, 0, 8]; sgA = 'HOUR 6'; sgB = '0 DRY EYES'; sgC = '#7fd0ff';
      cnt = Math.round(200 * smooth(clamp(lt / 2.4))) + '/200'; hot = true; if (lt > 3.6) bT = ['it is going great!', dh(), -1.0, 1.4]; }
    else {
      if (lt < 2.9) { inCab = false; ext = 3; LAND.visible = true; const tdn = 1.5, v0 = 62; const u = lt / tdn; const xx = lt < tdn ? X0 - 92 + v0 * lt * (1 - .0) : X0 - 92 + v0 * tdn + (v0 * .78) * (lt - tdn) - 18 * (lt - tdn) * (lt - tdn); const y = lt < tdn ? 3.7 + 17 * Math.pow(1 - u, 1.5) : 3.7 + Math.max(0, .35 * Math.exp(-(lt - tdn) * 7) * Math.sin((lt - tdn) * 18));
        plane.visible = true; plane.position.set(xx, y, 0); plane.rotation.y = 0; plane.userData.inner.rotation.x = 0; plane.rotation.z = lt < tdn ? .1 * (1 - u) + .05 : lerp(.05, 0, smooth((lt - tdn) / .5)); plane.userData.gear.visible = true;
        const sgx = X0 + 34, w = smooth(clamp((lt - 1.3) / .8)); cam = [lerp(X0 - 6 + lt * 18, sgx + 2, w), lerp(3.0, 4.4, w), lerp(24, 15, w), lerp(xx, sgx, w), lerp(y + 1, 6.0, w), lerp(0, -22, w), 56 - 8 * w, .05 + .05 * w]; sun = [xx, 0, 0];
        if (lt > tdn) for (let i = 0; i < 50; i++) { const a = (i / 50); const age = (lt - tdn) * (1 - a); smoke.set(i, xx - 14 + (-a * 60), .6 + age * 1.2, ((i * 37) % 7 - 3) * .35 + (i % 2 ? 2.1 : -2.1), age > 0 ? clamp(age * 3, 0, 1) * 1.6 : 0); } smoke.done(); }
      else { const u = (lt - 2.9) / (dur - 2.9); seatedAll({ pose: clap, bob: 0 }, null); for (let i = 0; i < NS; i++) { const o = P[i], x = SX[i % 6], z = ZR0 + ((i / 6) | 0) * DZ; standOn(o, x, z, Math.abs(Math.sin(t * 6 + o.phase)) * .22); if (i % 3 === 0) up(o, t, i); else clap(o, t, i); }
        for (const i of [2, 3, 8, 9]) P[i].vis = false; cashSeats([0, 1]); fas(clap, [9.2, 11.5, 13.8, 16.1]);
        place(D, 0, 7.4, Math.PI + .0, 'idle', .4, 1.8, Math.abs(Math.sin(t * 3.2)) * .18); D.arms = { lx: -.5, lz: -.2, rx: -2.8, rz: .12 }; D.pitch = .03 + .04 * Math.sin(t * 3.2);
        bills.visible = true; const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), vv = new THREE.Vector3(), sc = new THREE.Vector3(1, 1, 1); for (let i = 0; i < 160; i++) { const b = BL[i], k = ((t * (.18 + b[4] * .1) + b[1]) % 1); e.set(t * b[4] + b[3], b[3] * 2 + t * 1.3, t * b[4] * .7); q.setFromEuler(e); vv.set(b[0] + Math.sin(t * 2 + b[3]) * .5, 4.4 - k * 4.3, b[2] + Math.cos(t * 1.7 + b[3]) * .5); m4.compose(vv, q, sc); bills.setMatrixAt(i, m4); } bills.instanceMatrix.needsUpdate = true;
        cam = [.3 * Math.sin(u * 4), 2.4 + u * .6, .5 + u * 1.8, 0, 2.7 - u * .2, 8.5, 74 - u * 20, .11 - u * .06]; sun = [0, 0, 8]; sgA = 'WRONG CITY'; sgB = 'FLIGHT COMPLETE'; sgC = '#ff5a4a'; if (lt > 3.6) bT = ['we made it!', dh(), -.5, 1.2]; }
      cnt = lt < 2.9 ? '0' : '1'; hot = true; }

    // ---- world visibility
    CAB.visible = inCab; if (ext === 1 || (bi === 3 && lt < 3.0)) SKYG.visible = true; if (ext === 2) SKYG.visible = true; if (ext === 3) LAND.visible = true;
    // streak particles for exterior flights
    if (bi === 0 && lt < 1.2) { streaks.visible = true; const m4 = new THREE.Matrix4(), cx = 40 * lt; for (let i = 0; i < 70; i++) { const s = SK[i]; m4.makeTranslation(cx + 180 - ((s[0] + lt * s[3] * 2.4) % 360), 400 + s[1], s[2]); streaks.setMatrixAt(i, m4); } streaks.instanceMatrix.needsUpdate = true; }
    else if (bi === 3 && lt < 3.0) { streaks.visible = true; const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), vv = new THREE.Vector3(), sc = new THREE.Vector3(1, 1, 1), th = lt * .62 + .4; for (let i = 0; i < 70; i++) { const s = SK[i], a = th - .05 - (s[0] / 360) * .5, rr = 90 + s[1] * .5; q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a - Math.PI / 2 + Math.PI); vv.set(Math.cos(a + lt * .1) * rr, 400 + s[2] * .5, Math.sin(a + lt * .1) * rr); m4.compose(vv, q, sc); streaks.setMatrixAt(i, m4); } streaks.instanceMatrix.needsUpdate = true; }
    // ---- people + props
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t); dcrowd.update(t); look.update(); look.setVisible(D.vis);
    { const h = D.M; const vis = D.vis; attach(crown, D, 'head', [0, .27, -.02]); attach(band, D, 'head', [0, .18, -.02]); attach(visor, D, 'head', [0, .2, .33], [.2, 0, 0]); attach(badge, D, 'head', [0, .22, .3]); attach(epL, D, 'torso', [-.34, .34, 0]); attach(epR, D, 'torso', [.34, .34, 0]); attach(wings, D, 'torso', [-.2, .14, .17]); uniAll.forEach((m) => (m.visible = vis)); }
    if (bi === 1 && D.vis) { const hr = hv(D, 'handR', [0, -.12, .05]); hs.visible = cord.visible = true; hs.position.copy(hr); hs.rotation.set(0, D.yaw, .3); const a = new THREE.Vector3(0, CH - .1, D.z), b = hr.clone().add(new THREE.Vector3(0, .25, 0)); const dir = b.clone().sub(a), len = dir.length(); cord.position.copy(a).add(b).multiplyScalar(.5); cord.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()); cord.scale.set(1, len, 1); }
    if (bi === 4 || (bi === 3 && false)) { let q = 0; const crying = []; for (let i = 0; i < NP; i++) if (P[i].vis) crying.push(i); const per = Math.max(1, Math.floor(900 / (crying.length * 2))); crying.forEach((id) => { const o = P[id], s = o.scale * o.h, f = [Math.sin(o.yaw), Math.cos(o.yaw)], r = [Math.cos(o.yaw), -Math.sin(o.yaw)]; for (const sd of [-1, 1]) for (let i = 0; i < per && q < 900; i++) { const uu = ((t * 1.3 + i / per + sd * .13 + id * .37) % 1); const y = o.y + 1.72 * s - uu * .75 * s - .1 * s; tears.set(q++, o.x + f[0] * (.3 + uu * .1) * s + r[0] * sd * .1 * s, y, o.z + f[1] * (.3 + uu * .1) * s + r[1] * sd * .1 * s, (1.4 - uu * .6) * (lt > .15 ? 1 : 0)); } }); for (; q < 900; q++) tears.set(q, 0, 0, 0, 0); tears.done(); }
    // ---- sign + gauge
    if (inCab) { sgMesh.position.set(0, 4.0, bi === 2 ? sun[2] + 9 : 14.5); sgMesh.position.y = 4.3; sgMesh.scale.setScalar(.5); drawSign(sgA, sgB, sgC); }
    // ---- camera, sun, bubbles
    st.cam(...cam); cam3.updateMatrixWorld(); sunTo(...sun);
    if (bT) { const rt = new THREE.Vector3().setFromMatrixColumn(cam3.matrixWorld, 0), upv = new THREE.Vector3().setFromMatrixColumn(cam3.matrixWorld, 1); const pos = bT[1].clone().addScaledVector(rt, bT[2] * 1.2).addScaledVector(upv, bT[3] * .6); const dist = pos.distanceTo(cam3.position); const w = dist * (bi === 5 ? .34 : .46); bub[0].show(bT[0], pos.x, pos.y, pos.z); bub[0].sp.scale.set(w, w * .373, 1); }
    st.render();
    hud.style('C'); hud.question(bi === 0 ? 'I made *Drake* your airline pilot' : '', bi === 0 ? 1 : 0);
    hud.counter('HOUR ' + HOURS[bi] + ' OF 24', cnt, NOTE[bi], 'PARODY', hot); hud.tm('');
    hud.pop(bi > 0 && lt > .55 ? POP[bi] : '', Math.min(1, (lt - .55) * 6));
  } };
}
