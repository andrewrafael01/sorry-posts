// 684 invention chain: toddler keeps escaping the crib -> bars up -> toy stairs -> net -> spoon -> locked door -> pillow ladder + window -> roof with briefcase -> better schedule than you.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, addBox, mat, ground, Crowd, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0xe8e2d8, fogNear: 60, fogFar: 200, clouds: false, skyTop: 0x6aa6e8, skyMid: 0xa9cdf0, skyBot: 0xe8f0f8, shadowExtent: 9, shadowRes: 2048, hemi: 1.7, sunI: 1.7, sunDir: [-.3, .9, .6], exposure: 1.12 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const ramp = (x, a, b) => smooth((x - a) / (b - a));
  const BX = 0, RX = 26, CX = -26; // zones: nursery, roof, hall
  const WALLZ = -3.3;
  // crib geometry
  const CRX = .1, CZ = -2.15, CW = 2.2, CD = 1.7, MT = .5;
  const BAR0 = .55, BAR1 = 1.0, POSTH = 1.45, NETY = 1.97;
  // ================================================================= NURSERY
  { addBox(S, BX, -.05, .3, 11, .1, 8.4, 0xd9a86c, { cast: false });
    for (let i = 0; i < 14; i++) addBox(S, BX - 5 + i * .78, .002, .3, .02, .002, 8.4, 0xb98650, { cast: false });
    const W = 0xbfe6d6; // mint walls, back wall with window hole x 3.5..4.9, y 1.5..2.7
    addBox(S, BX - 1, 2.1, WALLZ - .1, 9, 4.4, .2, W, { cast: false }); addBox(S, BX + 5.2, 2.1, WALLZ - .1, .6, 4.4, .2, W, { cast: false });
    addBox(S, BX + 4.2, 3.55, WALLZ - .1, 1.4, 1.7, .2, W, { cast: false }); addBox(S, BX + 4.2, .75, WALLZ - .1, 1.4, 1.5, .2, W, { cast: false });
    addBox(S, BX - 5.5, 2.1, .3, .2, 4.4, 8.4, W, { cast: false }); addBox(S, BX + 5.5, 2.1, .3, .2, 4.4, 8.4, W, { cast: false });
    addBox(S, BX, .12, WALLZ + .02, 11, .24, .06, 0xffffff, { cast: false });
    for (let i = 0; i < 11; i++) addBox(S, BX - 5 + i * 1.0, 2.0, WALLZ + .01, .22, 3.6, .01, 0xaedcc8, { cast: false }); // wallpaper stripes
    addBox(S, BX - 1.1, .01, -.9, 4.0, .02, 3.0, 0xf3a6b8, { cast: false, round: .01 }); addBox(S, BX - 1.1, .012, -.9, 3.5, .02, 2.5, 0xfbd3dc, { cast: false });
    // stars poster
    { const p = cvs(256, 340, (g, w, h) => { g.fillStyle = '#2a2f6a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffe36a'; g.beginPath(); g.arc(128, 150, 52, 0, 7); g.fill(); g.fillStyle = '#2a2f6a'; g.beginPath(); g.arc(150, 140, 46, 0, 7); g.fill(); txt(g, 'GOODNIGHT', 128, 40, 40, '#fff'); txt(g, 'MOON', 128, 300, 52, '#ffe36a'); }); const pm = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.33), new THREE.MeshStandardMaterial({ map: p.t, roughness: .8 })); pm.position.set(BX - 1.3, 3.1, WALLZ + .03); S.add(pm); }
    // door (left of back wall)
    addBox(S, BX - 3.9, 1.35, WALLZ + .04, 1.5, 2.7, .08, 0xffffff); addBox(S, BX - 3.9, 1.3, WALLZ + .09, 1.2, 2.55, .06, 0xb87840, { round: .02 });
    for (const dy of [.55, 1.85]) addBox(S, BX - 3.9, dy, WALLZ + .13, .9, .9, .03, 0xa86a34);
    addBox(S, BX - 3.45, 1.15, WALLZ + .16, .1, .1, .1, 0xffd23a, { round: .03 });
    // window frame + sky
    addBox(S, BX + 4.2, 2.1, WALLZ - .05, 1.55, 1.35, .04, 0xffffff, { cast: false }); addBox(S, BX + 4.2, 2.1, WALLZ - .2, 1.4, 1.2, .02, 0xbfe3ff, { mat: { emissive: 0x9ccaf0, emissiveIntensity: .9 }, cast: false });
    // toy chest + lamp + plant
    addBox(S, BX - 4.5, .3, -1.7, 1.0, .6, .6, 0xe0556a, { round: .04 }); addBox(S, BX - 4.5, .64, -1.7, 1.06, .08, .66, 0xc23d52);
    addBox(S, BX + 5.0, .4, -1.2, .7, .8, .7, 0xe8d8b8, { round: .03 }); { const lb = new THREE.Mesh(new THREE.CylinderGeometry(.18, .26, .3, 16), mat(0xffd9a0, { emissive: 0xffc070, emissiveIntensity: .5 })); lb.position.set(BX + 5.0, 1.05, -1.2); S.add(lb); }
  }
  // ---- crib
  const woodL = 0xeed2a6, woodD = 0xc99a66;
  addBox(S, CRX, .26, CZ, CW + .1, .1, CD + .1, woodD, { round: .02 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) addBox(S, CRX + sx * (CW / 2), .13, CZ + sz * (CD / 2), .1, .26, .1, woodD);
  addBox(S, CRX, .44, CZ, CW - .1, .12, CD - .1, 0xf7f2ff, { round: .05 }); addBox(S, CRX, .5, CZ, CW - .14, .01, CD - .14, 0xcfe3ff, { cast: false });
  for (let i = 0; i < 6; i++) addBox(S, CRX - .9 + i * .36, .505, CZ, .16, .01, CD - .14, 0xffffff, { cast: false });
  const mkRail = (n, len, alongX) => { const g = new THREE.Group(); for (let i = 0; i < n; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(.04, 1, .04), mat(woodL)); b.castShadow = true; const u = (i + .5) / n - .5; b.position.set(alongX ? u * len : 0, .5, alongX ? 0 : u * len); g.add(b); } S.add(g); return g; };
  const railF = mkRail(11, CW - .12, true), railB = mkRail(11, CW - .12, true), railL = mkRail(8, CD - .12, false), railR = mkRail(8, CD - .12, false);
  railF.position.set(CRX, MT, CZ + CD / 2); railB.position.set(CRX, MT, CZ - CD / 2); railL.position.set(CRX - CW / 2, MT, CZ); railR.position.set(CRX + CW / 2, MT, CZ);
  const topF = addBox(S, CRX, 1, CZ + CD / 2, CW, .07, .08, woodD), topB = addBox(S, CRX, 1, CZ - CD / 2, CW, .07, .08, woodD), topL = addBox(S, CRX - CW / 2, 1, CZ, .08, .07, CD, woodD), topR = addBox(S, CRX + CW / 2, 1, CZ, .08, .07, CD, woodD);
  const posts = []; for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(.1, 1, .1), mat(woodD)); p.castShadow = true; p.position.set(CRX + sx * CW / 2, MT, CZ + sz * CD / 2); p.scale.y = POSTH; p.position.y = MT + POSTH / 2; S.add(p); posts.push(p); addBox(S, CRX + sx * CW / 2, MT + POSTH + .05, CZ + sz * CD / 2, .14, .1, .14, woodD, { round: .03 }); }
  let barH = -1; const setBars = (H) => { if (Math.abs(H - barH) < 1e-4) return; barH = H; for (const r of [railF, railB, railL, railR]) r.scale.y = H; const y = MT + H + .03; for (const t of [topF, topB, topL, topR]) t.position.y = y; };
  // ---- net
  const NW = 512, NH = 400; const netC = cvs(NW, NH); let netR = -1;
  const drawNet = (r) => { if (Math.abs(r - netR) < .004) return; netR = r; const g = netC.g; g.clearRect(0, 0, NW, NH); g.strokeStyle = '#2d3a4a'; g.lineWidth = 5; g.beginPath(); for (let x = 0; x <= NW; x += 32) { g.moveTo(x, 0); g.lineTo(x, NH); } for (let y = 0; y <= NH; y += 32) { g.moveTo(0, y); g.lineTo(NW, y); } g.stroke();
    g.strokeStyle = '#2d3a4a'; g.lineWidth = 12; g.strokeRect(2, 2, NW - 4, NH - 4);
    if (r > 0) { g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.ellipse(NW / 2 + 6, NH / 2, r * 330, r * 250, 0, 0, 7); g.fill(); g.globalCompositeOperation = 'source-over'; g.strokeStyle = 'rgba(40,60,80,.9)'; g.lineWidth = 4; for (let i = 0; i < 18; i++) { const a = i / 18 * 6.28; const rx = r * 330, ry = r * 250; g.beginPath(); g.moveTo(NW / 2 + 6 + Math.cos(a) * rx, NH / 2 + Math.sin(a) * ry); g.lineTo(NW / 2 + 6 + Math.cos(a) * (rx + 16 + cr(i, 3) * 14), NH / 2 + Math.sin(a) * (ry + 12 + cr(i, 4) * 12)); g.stroke(); } }
    netC.t.needsUpdate = true; };
  const netM = new THREE.Mesh(new THREE.PlaneGeometry(CW + .2, CD + .2), new THREE.MeshBasicMaterial({ map: netC.t, transparent: true, alphaTest: .25, side: THREE.DoubleSide })); netM.rotation.x = -Math.PI / 2; netM.visible = false; S.add(netM);
  // ---- toy cubes (beat 1)
  const cubeCols = [0xe5453a, 0x3a8fe5, 0xffc83a, 0x4fbf5a, 0xb35ae0, 0xff8a3a]; const cubes = [];
  for (let i = 0; i < 6; i++) { const c = cvs(128, 128, (g, w, h) => { g.fillStyle = '#' + new THREE.Color(cubeCols[i]).getHexString(); g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8); txt(g, 'ABCDEF'[i], 64, 68, 80, '#fff', { stroke: 'rgba(0,0,0,.35)', sw: 8 }); }); const m = new THREE.Mesh(new RoundedBoxGeometry(.22, .22, .22, 3, .03), new THREE.MeshStandardMaterial({ map: c.t, roughness: .6 })); m.castShadow = true; m.visible = false; S.add(m); cubes.push(m); }
  const cubeFrom = [[-.6, -1.75], [-.2, -2.6], [-.75, -2.4], [.35, -2.65], [-.45, -1.65], [.6, -2.6]]; // scattered on mattress
  const cubeTo = [[.15, 0], [.45, 0], [.45, 1], [.75, 0], [.75, 1], [.75, 2]]; // col x, level
  const stepX = [.15, .45, .75];
  // ---- pillows (beat 3)
  const pillows = []; const pCols = [0xffffff, 0xffc8d8, 0xc8e4ff, 0xfff1b0, 0xe3d4ff, 0xffffff, 0xffc8d8, 0xc8e4ff, 0xfff1b0, 0xe3d4ff];
  for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new RoundedBoxGeometry(.6, .28, .5, 4, .1), mat(pCols[i], { roughness: .95 })); m.castShadow = true; m.visible = false; S.add(m); pillows.push(m); }
  const pTo = [[0, 0], [1, 0], [1, 1], [2, 0], [2, 1], [2, 2], [3, 0], [3, 1], [3, 2], [3, 3]]; // column, level
  const pColX = [1.95, 2.55, 3.15, 3.75];
  const pFrom = pTo.map((_, i) => [.5 + (i % 5) * .45, -1.4 + Math.floor(i / 5) * .55]);
  // window sashes (hinged), door lock
  const sashes = []; for (const s of [-1, 1]) { const g = new THREE.Group(); g.position.set(BX + 4.2 + s * .7, 0, WALLZ - .08); const f = new THREE.Mesh(new THREE.BoxGeometry(.7, 1.2, .05), mat(0xffffff)); f.position.set(-s * .35, 2.1, 0); f.castShadow = true; g.add(f); const gl = new THREE.Mesh(new THREE.BoxGeometry(.56, 1.06, .02), new THREE.MeshStandardMaterial({ color: 0xbfe3ff, emissive: 0x9ccaf0, emissiveIntensity: .8, transparent: true, opacity: .8 })); gl.position.set(-s * .35, 2.1, .01); g.add(gl); S.add(g); sashes.push([g, s]); }
  const padlock = new THREE.Group(); { const b = new THREE.Mesh(new RoundedBoxGeometry(.3, .26, .1, 3, .03), mat(0xffc82a, { metalness: .6, roughness: .35 })); padlock.add(b); const sh = new THREE.Mesh(new THREE.TorusGeometry(.09, .025, 8, 14, Math.PI), mat(0xb8c0cc, { metalness: .85, roughness: .3 })); sh.position.y = .13; padlock.add(sh); padlock.position.set(BX - 3.45, .85, WALLZ + .2); padlock.visible = false; S.add(padlock); }
  const key = new THREE.Mesh(new THREE.BoxGeometry(.06, .3, .02), mat(0xffd23a, { metalness: .7, roughness: .3 })); key.visible = false; S.add(key);
  // ================================================================= ROOF (beat 4)
  { addBox(S, RX, -.15, 0, 13, .3, 9, 0x6e4b48); for (let i = 0; i < 12; i++) addBox(S, RX, .002, -4.2 + i * .75, 13, .01, .06, 0x56383a, { cast: false });
    addBox(S, RX, .3, -4.35, 13, .6, .3, 0x8a5a50); addBox(S, RX - 6.35, .3, 0, .3, .6, 9, 0x8a5a50); addBox(S, RX + 6.35, .3, 0, .3, .6, 9, 0x8a5a50); addBox(S, RX, .04, 4.4, 13, .12, .3, 0x4a3030);
    addBox(S, RX - 4.0, 1.2, -3.0, 1.0, 2.4, 1.0, 0xa8503a); addBox(S, RX - 4.0, 2.45, -3.0, 1.2, .14, 1.2, 0x7a3a2a); for (let j = 0; j < 5; j++) addBox(S, RX - 4.0, .3 + j * .5, -2.49, 1.0, .02, .02, 0x7a3a2a, { cast: false });
    addBox(S, RX - 2.0, 1.2, -3.6, .05, 2.4, .05, 0x444444); addBox(S, RX - 2.0, 2.0, -3.6, 1.0, .05, .05, 0x444444); addBox(S, RX - 2.0, 1.6, -3.6, .7, .05, .05, 0x444444);
    // far city + ground
    ground(S, 0x2a2540, 400, { y: -22 }); const colc = [0x2c2a4a, 0x35305a, 0x262244, 0x3a3463];
    for (let i = 0; i < 26; i++) { const h = 8 + cr(i, 80) * 26, w = 3 + cr(i, 81) * 5; addBox(S, RX - 55 + i * 4.4 + cr(i, 82) * 3, h / 2 - 22 + 8, -34 - cr(i, 83) * 20, w, h, w, colc[i % 4], { cast: false, mat: { emissive: 0x2a1830, emissiveIntensity: .6 } }); }
    const sun = new THREE.Mesh(new THREE.CircleGeometry(7, 40), new THREE.MeshBasicMaterial({ color: 0xffb04a, fog: false })); sun.position.set(RX + 14, 1.5, -80); S.add(sun);
    const hatchHole = addBox(S, RX + 3.3, .01, -1.2, 1.1, .02, 1.1, 0x15101a, { cast: false }); }
  const hatch = new THREE.Group(); hatch.position.set(RX + 3.3, .03, -1.75); S.add(hatch); { const lid = new THREE.Mesh(new THREE.BoxGeometry(1.15, .07, 1.15), mat(0x8a909c, { metalness: .4, roughness: .5 })); lid.position.z = .575; lid.castShadow = true; hatch.add(lid); }
  const bubC = cvs(512, 256, (g, w, h) => { g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 10; g.beginPath(); g.ellipse(256, 108, 236, 92, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(120, 170); g.lineTo(80, 238); g.lineTo(190, 186); g.closePath(); g.fillStyle = '#fff'; g.fill(); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.ellipse(256, 108, 228, 84, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(126, 168); g.lineTo(90, 228); g.lineTo(184, 182); g.closePath(); g.fill(); txt(g, 'MEETING', 256, 112, 92, '#111'); });
  const bubble = new THREE.Sprite(new THREE.SpriteMaterial({ map: bubC.t, transparent: true, depthTest: false, depthWrite: false })); bubble.renderOrder = 12; bubble.visible = false; S.add(bubble);
  // ================================================================= HALL (beat 5)
  const calEntries = [['7:00', 'NAP', '#4a8be0'], ['8:00', 'BOARD MEETING', '#3fae5a'], ['9:30', 'SNACK', '#f29a2e'], ['10:30', 'INVESTOR CALL', '#9b5ae0'], ['12:00', 'LUNCH W/ CEO', '#e0503f'], ['1:00', 'NAP', '#4a8be0'], ['2:30', 'GOLF (BLOCKS)', '#2fb8b0']];
  const calC = cvs(768, 1100); let calN = -1;
  const drawCal = (n) => { if (n === calN) return; calN = n; const g = calC.g; g.fillStyle = '#fffdf6'; g.fillRect(0, 0, 768, 1100); g.fillStyle = '#d63a3a'; g.fillRect(0, 0, 768, 130); txt(g, 'HIS SCHEDULE', 384, 68, 80, '#fff'); g.strokeStyle = '#111'; g.lineWidth = 8; g.strokeRect(4, 4, 760, 1092);
    for (let i = 0; i < 7; i++) { const y = 150 + i * 134; g.strokeStyle = '#d8d2c0'; g.lineWidth = 3; g.beginPath(); g.moveTo(20, y + 128); g.lineTo(748, y + 128); g.stroke(); txt(g, calEntries[i][0], 20, y + 64, 40, '#777', { al: 'left' }); if (i < n) { g.fillStyle = calEntries[i][2]; g.beginPath(); g.roundRect(160, y + 10, 590, 108, 18); g.fill(); txt(g, calEntries[i][1], 455, y + 66, calEntries[i][1].length > 12 ? 50 : 62, '#fff', { stroke: 'rgba(0,0,0,.35)', sw: 6 }); } }
    calC.t.needsUpdate = true; };
  { const fl = addBox(S, CX, -.05, .3, 11, .1, 8.4, 0xc99a66, { cast: false }); addBox(S, CX, 2.1, WALLZ - .1, 11, 4.4, .2, 0xf3e6d0, { cast: false }); addBox(S, CX - 5.5, 2.1, .3, .2, 4.4, 8.4, 0xf3e6d0, { cast: false }); addBox(S, CX + 5.5, 2.1, .3, .2, 4.4, 8.4, 0xf3e6d0, { cast: false }); addBox(S, CX, .12, WALLZ + .02, 11, .24, .06, 0xffffff, { cast: false });
    addBox(S, CX, .01, -.5, 4.6, .02, 3.4, 0x8a6fb0, { cast: false, round: .01 });
    addBox(S, CX + 1.35, 2.4, WALLZ + .04, 2.6, 3.5, .06, 0x333333);
    const cm = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 3.4), new THREE.MeshStandardMaterial({ map: calC.t, roughness: .7 })); cm.position.set(CX + 1.35, 2.4, WALLZ + .08); S.add(cm); }
  const planC = cvs(512, 360, (g, w, h) => { g.fillStyle = '#f2ecd8'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8402a'; g.fillRect(0, 0, w, 56); txt(g, 'MY PLANNER', w / 2, 30, 38, '#fff'); g.strokeStyle = '#d0c8ae'; g.lineWidth = 3; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(24, 100 + i * 46); g.lineTo(w - 24, 100 + i * 46); g.stroke(); } txt(g, '(empty)', w / 2, 220, 56, '#b8b09a', { w: 700 }); });
  const planner = new THREE.Mesh(new THREE.BoxGeometry(.9, .05, .62), [mat(0xc8402a), mat(0xc8402a), new THREE.MeshStandardMaterial({ map: planC.t, roughness: .8 }), mat(0xc8402a), mat(0xc8402a), mat(0xc8402a)]); planner.castShadow = true; planner.visible = false; S.add(planner);
  // ================================================================= people
  const crowd = new Crowd(S, 2, 77); const P = crowd.p; const YOU = P[0], KID = P[1];
  const setCol = (i, ks, c) => ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c)));
  const flush = () => { for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true; };
  setCol(0, ['torso', 'armL', 'armR'], 0x8e6cf0); setCol(0, ['legL', 'legR'], 0x34548e); setCol(0, ['hair'], 0x3a2418);
  let suitState = null; const kidCol = (suit) => { if (suit === suitState) return; suitState = suit; setCol(1, ['torso', 'armL', 'armR'], suit ? 0x34456f : 0x7cc4f0); setCol(1, ['legL', 'legR'], suit ? 0x34456f : 0xf5c6a0); setCol(1, ['hair'], 0x6a3b18); setCol(1, ['head', 'neck', 'handL', 'handR'], 0xf5c6a0); flush(); };
  YOU.h = 1; KID.h = .55; KID.hs = 1.7; kidCol(false);
  const reset = (o) => { o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; o.extra = 0; o.speed = .5; o.anim = 'idle'; o.roll = 0; };
  const place = (o, x, y, z, yaw, anim = 'idle', sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; };
  const hp = (o, k) => new THREE.Vector3().setFromMatrixPosition(o.M[k]);
  const armsT = (o, lx, lz, rx, rz) => { o.arms = { lx, lz, rx, rz }; };
  const FWD = (p) => -(Math.PI / 2 + p);
  // toddler face overlays (his own expressions)
  const SKIN = '#f5c6a0';
  const mkFace = (kind) => cvs(256, 192, (g, w, h) => { const eye = (x, y, o = {}) => { const ew = o.w || 44, eh = o.h || 54; g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y, ew / 2, eh / 2, 0, 0, 7); g.fill(); g.strokeStyle = '#2a1a12'; g.lineWidth = 5; g.stroke(); g.fillStyle = '#2a1a12'; g.beginPath(); g.ellipse(x + (o.dx || 0), y + (o.dy || 0), ew * .27, eh * .3, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x + (o.dx || 0) + 5, y + (o.dy || 0) - 6, 5, 0, 7); g.fill(); };
    const brow = (x, y, ang, len = 56, th = 12) => { g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = '#4a2a14'; g.beginPath(); g.roundRect(-len / 2, -th / 2, len, th, 6); g.fill(); g.restore(); };
    const cheeks = () => { g.fillStyle = 'rgba(240,110,110,.45)'; g.beginPath(); g.ellipse(36, 128, 24, 16, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(220, 128, 24, 16, 0, 0, 7); g.fill(); };
    cheeks(); g.lineCap = 'round'; g.lineJoin = 'round';
    if (kind === 'determined') { eye(78, 86, { dy: 6 }); eye(178, 86, { dy: 6 }); brow(78, 52, .4); brow(178, 52, -.4); g.fillStyle = '#7a2e2a'; g.beginPath(); g.ellipse(128, 150, 22, 14, 0, 0, 7); g.fill(); g.fillStyle = '#ff7c93'; g.beginPath(); g.ellipse(142, 160, 15, 12, 0, 0, 7); g.fill(); }
    else if (kind === 'outrage') { eye(78, 84, { w: 52, h: 62 }); eye(178, 84, { w: 52, h: 62 }); brow(78, 40, -.25); brow(178, 40, .25); g.fillStyle = '#7a2e2a'; g.beginPath(); g.ellipse(128, 152, 30, 26, 0, 0, 7); g.fill(); g.fillStyle = '#ff7c93'; g.beginPath(); g.ellipse(128, 164, 20, 10, 0, 0, 7); g.fill(); }
    else if (kind === 'smug') { for (const x of [78, 178]) { eye(x, 90, { dy: 2 }); g.fillStyle = SKIN; g.fillRect(x - 28, 56, 56, 32); g.fillStyle = '#4a2a14'; g.fillRect(x - 28, 86, 56, 8); } brow(78, 48, .1); brow(178, 48, -.1); g.strokeStyle = '#7a2e2a'; g.lineWidth = 9; g.beginPath(); g.moveTo(94, 150); g.quadraticCurveTo(150, 168, 188, 138); g.stroke(); }
    else if (kind === 'proud') { g.strokeStyle = '#2a1a12'; g.lineWidth = 11; for (const x of [78, 178]) { g.beginPath(); g.arc(x, 96, 24, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } brow(78, 50, -.15); brow(178, 50, .15); g.fillStyle = '#7a2e2a'; g.beginPath(); g.moveTo(80, 134); g.quadraticCurveTo(128, 196, 176, 134); g.closePath(); g.fill(); g.fillStyle = '#fff'; g.fillRect(96, 136, 64, 12); g.fillStyle = '#ff7c93'; g.beginPath(); g.ellipse(128, 168, 22, 10, 0, 0, 7); g.fill(); }
    else if (kind === 'evil') { for (const x of [78, 178]) { eye(x, 92, { w: 46, h: 36, dy: 2 }); } brow(78, 56, .45); brow(178, 56, -.45); g.fillStyle = '#7a2e2a'; g.beginPath(); g.moveTo(70, 138); g.quadraticCurveTo(128, 188, 186, 138); g.quadraticCurveTo(128, 150, 70, 138); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(84, 142); g.quadraticCurveTo(128, 166, 172, 142); g.lineTo(166, 148); g.quadraticCurveTo(128, 160, 90, 148); g.fill(); }
    else if (kind === 'biz') { eye(78, 88, { w: 40, h: 46 }); eye(178, 88, { w: 40, h: 46 }); brow(78, 56, .08, 52); brow(178, 56, -.08, 52); g.strokeStyle = '#222'; g.lineWidth = 6; g.beginPath(); g.arc(78, 88, 30, 0, 7); g.stroke(); g.beginPath(); g.arc(178, 88, 30, 0, 7); g.stroke(); g.beginPath(); g.moveTo(108, 88); g.lineTo(148, 88); g.stroke(); g.strokeStyle = '#7a2e2a'; g.lineWidth = 9; g.beginPath(); g.moveTo(100, 152); g.lineTo(156, 152); g.stroke(); }
    else if (kind === 'wink') { eye(78, 88, { dx: 4 }); g.strokeStyle = '#2a1a12'; g.lineWidth = 11; g.beginPath(); g.arc(178, 96, 22, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); brow(78, 50, -.15); brow(178, 52, .05); g.fillStyle = '#7a2e2a'; g.beginPath(); g.moveTo(88, 138); g.quadraticCurveTo(138, 182, 186, 132); g.quadraticCurveTo(140, 150, 88, 138); g.fill(); }
    else { eye(78, 88); eye(178, 88); brow(78, 52, 0); brow(178, 52, 0); g.strokeStyle = '#7a2e2a'; g.lineWidth = 9; g.beginPath(); g.moveTo(104, 152); g.lineTo(152, 152); g.stroke(); } });
  const FACES = {}; for (const k of ['determined', 'outrage', 'smug', 'proud', 'evil', 'biz', 'wink', 'plain']) FACES[k] = mkFace(k).t;
  const kfaceM = new THREE.Mesh(new THREE.PlaneGeometry(1, .75), new THREE.MeshBasicMaterial({ map: FACES.plain, transparent: true, alphaTest: .3 })); S.add(kfaceM);
  const diaper = new THREE.Mesh(new RoundedBoxGeometry(.66, .3, .38, 3, .08), mat(0xffffff, { roughness: .9 })); diaper.castShadow = true; S.add(diaper);
  const tie = new THREE.Mesh(new THREE.BoxGeometry(.09, .34, .03), mat(0xe8262b)); S.add(tie); const collar = new THREE.Mesh(new THREE.BoxGeometry(.24, .08, .03), mat(0xffffff)); S.add(collar);
  const briefcase = new THREE.Group(); { const bc = new THREE.Mesh(new RoundedBoxGeometry(.5, .34, .12, 3, .03), mat(0x6b3b1e, { roughness: .5 })); briefcase.add(bc); const hn = new THREE.Mesh(new THREE.TorusGeometry(.07, .014, 6, 12, Math.PI), mat(0x222222)); hn.position.y = .17; briefcase.add(hn); const lk = new THREE.Mesh(new THREE.BoxGeometry(.08, .04, .02), mat(0xffd23a)); lk.position.set(0, .06, .07); briefcase.add(lk); briefcase.traverse((m) => { m.castShadow = true; }); briefcase.visible = false; S.add(briefcase); }
  const watch = new THREE.Mesh(new THREE.BoxGeometry(.2, .1, .2), mat(0xffd23a, { metalness: .7, roughness: .3 })); watch.visible = false; S.add(watch);
  const spoon = new THREE.Group(); { const hd = new THREE.Mesh(new THREE.CylinderGeometry(.035, .03, 1.3, 8), mat(0xc9a06a)); hd.position.y = -.65; spoon.add(hd); const bw = new THREE.Mesh(new THREE.SphereGeometry(.16, 12, 10), mat(0xd9b27c)); bw.scale.set(1, 1.5, .4); bw.position.y = -1.45; spoon.add(bw); spoon.traverse((m) => { m.castShadow = true; }); spoon.visible = false; S.add(spoon); }
  const mkSprite = (text, c1, c2, w = 480) => { const l = cvs(w, 128, (g, ww) => { txt(g, text, ww / 2, 68, 84, c1, { stroke: c2, sw: 16 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const sawTxt = mkSprite('SAW SAW', '#ffe23a', '#a30a0a', 460); const clunk = mkSprite('CLUNK!', '#ffffff', '#111', 420); const click = mkSprite('CLICK!', '#ffe23a', '#111', 420);
  // ================================================================= camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3(); const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .02 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .02 + Math.cos(t * 57) * shake; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .008); };
  const D = (x, y, z) => [x, y, z];
  const skyU = A.sky.material.uniforms; const cNight = { top: new THREE.Color(0x3a2f7a), mid: new THREE.Color(0xe86a6a), bot: new THREE.Color(0xffb86a) }, cDay = { top: new THREE.Color(0x6aa6e8), mid: new THREE.Color(0xa9cdf0), bot: new THREE.Color(0xe8f0f8) };
  const hopPos = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) + Math.sin(u * Math.PI) * h, lerp(a[2], b[2], u)];
  // ================================================================= frame
  const inner = ({ t, bi, lt, p }, pre) => {
    bi = Math.min(bi, 5);
    reset(YOU); reset(KID);
    let faceShock = false, zone = BX, popTxt = '', popA = 1; let counter = ['', '', '', false];
    let face = 'plain', diaperOn = false, tieOn = false, bcOn = false, watchOn = false, spoonOn = false, spoonRot = [-1.57, 0, 0], keyOn = false, padOn = false, bubOn = false, bubS = 1;
    let H = BAR0, netOn = false, netPos = V3(CRX, 3.4, CZ), netHole = 0, sawOn = false, clunkOn = 0, clickOn = 0, sashOpen = 0, hatchOpen = 0, pillowsOn = false, cubesOn = false;
    const night = bi === 4; kidCol(bi >= 4);
    // -------------------------------------------------------------- beat 0: bars go up
    if (bi === 0) {
      zone = BX; const u = ramp(lt, 1.2, 2.5); const q = Math.floor(u * 4 + .001) / 4 + ramp(u * 4 % 1, .6, 1) / 4; H = lerp(BAR0, BAR1, lt < 1.2 ? 0 : u >= 1 ? 1 : q);
      diaperOn = true; counter = ['ESCAPES', '3', 'crib bars: ' + Math.round(H * 100) + ' cm', false];
      if (lt < 1.2) { // toddler hops and grabs for the top rail
        place(KID, CRX + .05, MT, CZ, 0, 'jump', .75); KID.y = MT; const hop = Math.abs(Math.sin(lt * 7)); KID.y = MT + hop * .22; armsT(KID, -2.9, -.25, -2.9, .25); face = 'determined';
      } else if (lt < 2.5) { place(KID, CRX + .05, MT, CZ, 0, 'idle', .8); armsT(KID, -2.7, -.3, -2.7, .3); face = 'outrage'; KID.extra = .06; }
      else { place(KID, CRX + .05, MT, CZ, 0, 'idle', .8); armsT(KID, -.95, .75, -.95, -.75); face = 'smug'; }
      // you push the rail top up
      place(YOU, CRX - CW / 2 - .75, 0, CZ + .1, Math.PI / 2, 'idle'); YOU.pitch = .08 * ramp(lt, 1.2, 1.5); armsT(YOU, FWD(0) - .15, .0, FWD(0) - .15, .0);
      if (lt >= 2.55) { YOU.pitch = 0; armsT(YOU, -.25, -.9, -.25, .9); }
      if (lt > 2.4 && lt < 3.0) clunkOn = ramp(lt, 2.4, 2.5) * (1 - ramp(lt, 2.8, 3.0));
      if (lt >= 2.6 && lt < 4.0) { popTxt = 'ESCAPE-PROOF'; popA = clamp((lt - 2.6) * 6) * (1 - ramp(lt, 3.6, 3.95)); }
    }
    // -------------------------------------------------------------- beat 1: toy staircase
    if (bi === 1) {
      zone = BX; H = BAR1; diaperOn = true; cubesOn = true; const stand = lt < 1.5;
      for (let i = 0; i < 6; i++) { const st = .15 + i * .2, u = clamp((lt - st) / .45); const to = [CRX + (cubeTo[i][0] - .1) , MT + .11 + cubeTo[i][1] * .22, CZ]; const fr = [CRX + cubeFrom[i][0] - .1, MT + .11, cubeFrom[i][1]]; const pp = hopPos(fr, to, u, .55); cubes[i].position.set(pp[0], pp[1], pp[2]); cubes[i].rotation.set(0, (1 - u) * 1.5, 0); }
      const vault = ramp(lt, 2.4, 3.05), landed = lt >= 3.05;
      if (stand) { place(KID, CRX - .35, MT, CZ + .05, .6, 'idle', .8); KID.pitch = .5; armsT(KID, -1.9 + Math.sin(lt * 14) * .3, -.1, -1.9 - Math.sin(lt * 14) * .3, .1); face = 'determined'; }
      else if (lt < 2.4) { const u = (lt - 1.5) / .9; const s = clamp(u * 3); const k = Math.min(2, Math.floor(s)); const f = s - k; const hop = Math.sin(f * Math.PI) * .12; const x0 = k === 0 ? CRX - .3 : CRX + stepX[k - 1] - .1, y0 = k === 0 ? MT : MT + .22 * k; const x1 = CRX + stepX[k] - .1, y1 = MT + .22 * (k + 1); place(KID, lerp(x0, x1, ramp(f, 0, 1)), lerp(y0, y1, ramp(f, 0, 1)) + hop, CZ, .9, 'idle', .8); armsT(KID, -2.0, -.2, -2.0, .2); face = 'determined'; KID.pitch = .15; }
      else if (!landed) { const x0 = CRX + .65, x1 = CRX + CW / 2 + .75; place(KID, lerp(x0, x1, vault), lerp(MT + .66, 0, vault * vault) + Math.sin(vault * Math.PI) * .55, CZ, 1.1, 'idle', .8); armsT(KID, -2.7, -.5, -2.7, .5); KID.pitch = -.15; face = 'outrage'; }
      else { place(KID, CRX + CW / 2 + .75, 0, CZ + .1, .25, 'idle', .8); face = 'proud'; armsT(KID, -.25, -.3, -3.05 + .12 * Math.sin(lt * 9), .15); }
      if (lt < .12 && !stand) { /* noop */ }
      for (let i = 0; i < 6; i++) if (landed || lt > 1.4) { /* cubes stay */ }
      counter = ['ESCAPES', landed ? '4' : '3', landed ? 'toys: stairs' : 'building...', landed];
      place(YOU, CRX - CW / 2 - .9, 0, CZ + .5, 1.0, 'idle'); armsT(YOU, -.3, -.2, -.3, .2); YOU.yaw = lerp(1.0, .8, ramp(lt, .5, 1));
      if (lt >= .1 && lt < 1.0) { popTxt = 'CLEVER!'; popA = clamp((lt - .1) * 7) * (1 - ramp(lt, .75, 1.0)); }
      if (landed) { faceShock = true; armsT(YOU, -2.5, -.35, -2.5, .35); }
    }
    // -------------------------------------------------------------- beat 2: net + spoon
    if (bi === 2) {
      zone = BX; H = BAR1; diaperOn = true; netOn = true; const down = ramp(lt, .1, 1.2); netPos = V3(CRX, lerp(3.5, NETY, down), CZ);
      counter = ['ESCAPES', lt > 5.0 ? '5' : '4', lt > 5.0 ? 'net: defeated' : 'net: installed', lt > 5.0];
      place(YOU, CRX - CW / 2 - .85, 0, CZ + .2, Math.PI / 2, 'idle'); armsT(YOU, -2.5 + .5 * down, -.2, -2.5 + .5 * down, .2);
      if (lt > 1.4) armsT(YOU, -.3, -.2, -.3, .2);
      if (lt >= 2.0 && lt < 3.1) { armsT(YOU, -.3, -.2, -2.9, .35); popTxt = 'MUCH BETTER!'; popA = clamp((lt - 2.0) * 6) * (1 - ramp(lt, 2.85, 3.1)); }
      place(KID, CRX + .05, MT, CZ, 0, 'idle', .8); face = 'outrage'; armsT(KID, -2.6, -.3, -2.6, .3);
      if (lt < 1.3) { face = 'outrage'; KID.extra = .05; } else if (lt < 3.0) { face = 'smug'; armsT(KID, -.95, .75, -.95, -.75); }
      if (lt >= 3.0) { spoonOn = true; face = lt > 5.0 ? 'proud' : 'evil'; const sw = lt > 5.0 ? 0 : Math.sin((lt - 3.0) * 16); armsT(KID, FWD(0) - .9 + sw * .08, 0, FWD(0) - .9 + sw * .08, 0); KID.pitch = -.12; KID.x = CRX + .05 + sw * .05; spoonRot = [-.6, 0, 0]; }
      if (lt >= 3.3) { netHole = ramp(lt, 3.3, 5.0) * .62; sawOn = lt < 5.0; }
      if (lt >= 5.0) { faceShock = true; armsT(YOU, -2.5, -.35, -2.5, .35); }
    }
    // -------------------------------------------------------------- beat 3: locked door, pillow ladder, window
    if (bi === 3) {
      zone = BX; H = BAR1; netOn = true; netPos = V3(CRX, NETY, CZ); netHole = .62; diaperOn = true; pillowsOn = true;
      counter = ['ESCAPES', lt > 4.7 ? '6' : '5', lt > 4.7 ? 'window: open' : lt > 1.8 ? 'door: locked' : 'locking...', lt > 4.7];
      place(YOU, BX - 3.05, 0, -2.95, -1.57, 'idle'); YOU.pitch = .05;
      if (lt < 1.9) { keyOn = true; armsT(YOU, -.2, -.1, FWD(0) + .05, 0); face = 'plain'; padOn = lt > 1.1; if (lt > 1.0 && lt < 1.7) { clickOn = ramp(lt, 1.0, 1.1) * (1 - ramp(lt, 1.5, 1.7)); } }
      else { armsT(YOU, -.35, -.8, -.35, .8); }
      place(KID, BX + 1.4, 0, -.9, 0, 'idle', .8);
      const vis0 = lt >= 1.8; KID.vis = vis0;
      const bi2 = Math.floor(clamp((lt - 2.1) / 1.4) * 9.99);
      for (let i = 0; i < 10; i++) { const st = 2.1 + i * .13, u = clamp((lt - st) / .42); const to = [pColX[pTo[i][0]], .14 + pTo[i][1] * .28, -2.97]; const pp = hopPos([pFrom[i][0] + 0, .14, pFrom[i][1]], to, u, .6); pillows[i].position.set(pp[0], pp[1], pp[2]); pillows[i].rotation.set(0, (1 - u) * 1.2, (1 - u) * .5); }
      if (lt < 3.7) { place(KID, BX + 1.4 + .15 * Math.sin(lt * 3), 0, -.9, 0, lt < 2.1 ? 'walk' : 'idle', .8); if (lt >= 2.1) { KID.pitch = .6; armsT(KID, FWD(.6) + .2 + Math.sin(lt * 12) * .3, -.1, FWD(.6) + .2 - Math.sin(lt * 12) * .3, .1); face = 'determined'; } if (lt < 2.1) { face = 'smug'; armsT(KID, -.3, -.2, -.3, .2); } if (lt >= 1.8 && lt < 2.1) { KID.x = BX + 1.4; } }
      else { const s = clamp((lt - 3.7) / .9) * 3.99; const k = Math.min(3, Math.floor(s)), f = s - Math.floor(s); const xs = [BX + 1.4, ...pColX.slice(0, 3)]; const ys = [0, .28, .56, .84, 1.12]; const x0 = k === 0 ? BX + 1.4 : pColX[k - 1], y0 = ys[k] , x1 = pColX[k], y1 = ys[k + 1]; const zz = lerp(-.9, -2.7, Math.min(1, s / 1.5)); place(KID, lerp(x0, x1, ramp(f, 0, 1)), lerp(y0, y1, ramp(f, 0, 1)) + Math.sin(f * Math.PI) * .12, zz, 1.1, 'idle', .8); armsT(KID, -2.1, -.2, -2.1, .2); face = 'determined'; KID.pitch = .1; if (lt >= 4.6) { place(KID, pColX[3], 1.12, -2.75, 0.35, 'idle', .8); armsT(KID, -2.6, -.4, -2.6, .4); } }
      sashOpen = ramp(lt, 4.3, 4.95) * 1.7; if (lt >= 4.95) { face = 'proud'; armsT(KID, -.3, -.4, -3.05, .2); }
    }
    // -------------------------------------------------------------- beat 4: roof, briefcase, meeting
    if (bi === 4) {
      zone = RX; tieOn = true; bcOn = true; counter = ['ESCAPES', '7', 'location: roof', true];
      hatchOpen = ramp(lt, .15, .6) * 1.55; const rise = ramp(lt, .5, 1.1);
      place(YOU, RX + 3.3, lerp(-1.6, -.62, rise), -1.2, -1.2, 'idle'); armsT(YOU, -2.6, -1.0, -2.6, 1.0); faceShock = true; if (lt < .5) YOU.vis = false;
      place(KID, RX + 1.05, 0, -.25, 1.15, 'idle', .8); face = 'biz'; armsT(KID, -.25, -.2, -.1, .1);
      if (lt >= .9 && lt < 2.5) { armsT(KID, -2.0, .15, -.1, .1); watchOn = true; face = 'biz'; }
      if (lt >= 2.5) { armsT(KID, -.25, -.2, -.1, .1); KID.yaw = 1.0; face = 'smug'; }
      bubOn = lt >= 2.55; bubS = ramp(lt, 2.55, 2.85);
    }
    // -------------------------------------------------------------- beat 5: his calendar, your planner
    if (bi === 5) {
      zone = CX; tieOn = true; bcOn = true; const n = clamp(Math.floor((lt - .2) / .38) + 1, 0, 7); drawCal(lt < .2 ? 0 : n);
      counter = ['APPOINTMENTS TODAY', 'HIM: ' + (lt < .2 ? 0 : n), 'YOU: 0', true];
      place(YOU, CX - 1.35, -.68, -.4, .15, 'sit'); YOU.pitch = .8 + .04 * Math.sin(t * 1.5); armsT(YOU, -.6, -.2, -.6, .2); faceShock = false;
      const go = ramp(lt, 2.7, 3.45);
      place(KID, CX + 1.5 + go * 3.2, 0, -.6, lt < 2.7 ? .35 : 1.4, lt < 2.7 ? 'idle' : 'walk', .9);
      if (lt < 2.7) { face = 'wink'; if (lt > .9 && lt < 2.0) { armsT(KID, -2.0, .15, -.1, .1); watchOn = true; face = 'biz'; } else if (lt >= 2.0) { armsT(KID, -.25, -.2, -.1, .1); face = 'wink'; } else armsT(KID, -.25, -.2, -.1, .1); } else { face = 'smug'; armsT(KID, -.3, -.1, -.1, .1); }
      planner.visible = true; planner.position.set(CX - 1.3, .55, .12); planner.rotation.set(-.55, .1, 0);
    }
    // -------------------------------------------------------------- common
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t); if (pre) return;
    { const z = new THREE.Matrix4().makeScale(0, 0, 0); crowd.parts.face.setMatrixAt(1, z); crowd.parts.face.instanceMatrix.needsUpdate = true; }
    // sky + light
    { const c = night ? cNight : cDay; skyU.top.value.copy(c.top); skyU.mid.value.copy(c.mid); skyU.bot.value.copy(c.bot); A.scene.fog.color.set(night ? 0x8a4a5a : 0xe8e2d8); A.hemi.intensity = night ? .8 : .935; A.sun.color.set(night ? 0xffa060 : 0xfff1d8); A.sun.intensity = night ? 1.4 : 1.7; }
    setBars(H);
    netM.visible = netOn; if (netOn) { netM.position.copy(netPos); drawNet(netHole); }
    cubes.forEach((c) => { c.visible = cubesOn; });
    pillows.forEach((c) => { c.visible = pillowsOn; });
    sashes.forEach(([g, s]) => { g.rotation.y = s * sashOpen; });
    padlock.visible = padOn; keyOn && (key.visible = true); key.visible = keyOn; if (keyOn) { attach(key, YOU, 'handR', [0, -.18, 0], [0, 0, 1.57 + Math.sin(lt * 14) * .2]); key.visible = true; }
    hatch.rotation.x = -hatchOpen;
    const ptw = (o, k, off) => { const v = V3(off[0], off[1], off[2]); return v; };
    // toddler accessories
    attach(kfaceM, KID, 'head', [0, -.03 * KID.hs, .226 * KID.hs]); kfaceM.material.map = FACES[face]; kfaceM.matrix.multiply(new THREE.Matrix4().makeScale(.4 * KID.hs, .4 * KID.hs, 1)); kfaceM.matrixWorldNeedsUpdate = true;
    diaper.visible = diaperOn; if (diaperOn) attach(diaper, KID, 'torso', [0, -.3, 0]);
    tie.visible = collar.visible = tieOn; if (tieOn) { attach(tie, KID, 'torso', [0, .12, .165]); attach(collar, KID, 'torso', [0, .3, .16]); }
    briefcase.visible = bcOn; if (bcOn) { attach(briefcase, KID, 'handR', [0, -.28, 0], [0, Math.PI / 2, 0]); }
    watch.visible = watchOn; if (watchOn) attach(watch, KID, 'handL', [0, .12, 0]);
    spoon.visible = spoonOn; if (spoonOn) attach(spoon, KID, 'handR', [0, 0, 0], spoonRot);
    // text sprites
    const sp = (s, on, x, y, z, sc) => { s.visible = on > 0; if (on > 0) { s.position.set(x, y, z); s.scale.set(sc * 1.6, sc * .4, 1); s.material.opacity = on; } };
    sp(sawTxt, sawOn ? .95 : 0, CRX + .15 + Math.sin(lt * 9) * .03, 2.6 + .05 * Math.sin(lt * 7), CZ + 1.1, 1);
    sp(clunk, clunkOn, CRX - CW / 2 - .15, 2.2, CZ + .3, .9); sp(click, clickOn, BX - 3.3, 1.8, WALLZ + .6, .8);
    bubble.visible = bubOn; if (bubOn) { const hh = hp(KID, 'head'); bubble.position.set(hh.x + .75, hh.y + .6, hh.z + .3); bubble.scale.set(1.9 * bubS, .95 * bubS, 1); }
    hud.pop(popTxt, popA);
    // -------------------------------------------------------------- camera
    const an = { hk: hp(KID, 'head') };
    A.follow(zone, 0);
    if (bi === 0) rig(lt, [[0, D(CRX + 1.9, 2.0, 5.6), D(CRX + 1.5, 2.0, 5.2), D(CRX - .5, 1.2, CZ), D(CRX - .5, 1.2, CZ), 50, 46], [1.2, D(CRX + 1.5, 2.0, 5.2), D(CRX + 1.2, 2.3, 5.0), D(CRX - .5, 1.3, CZ), D(CRX - .5, 1.4, CZ), 46, 44]], an, t, lt > 2.4 && lt < 2.7 ? .012 : 0);
    else if (bi === 1) rig(lt, [[0, D(CRX + 2.2, 2.1, 5.6), D(CRX + 2.0, 2.0, 5.3), D(CRX + .5, 1.15, CZ), D(CRX + .7, 1.15, CZ), 48, 46], [2.3, D(CRX + 2.2, 1.9, 5.4), D(CRX + 2.4, 1.7, 5.0), D(CRX + 1.0, 1.1, CZ), D(CRX + 1.3, .8, CZ), 46, 44]], an, t);
    else if (bi === 2) rig(lt, [[0, D(CRX + 1.5, 2.6, 5.9), D(CRX + 1.2, 2.5, 5.5), D(CRX - .3, 1.55, CZ), D(CRX - .2, 1.5, CZ), 50, 48], [3.0, D(CRX + 1.0, 2.4, 5.2), D(CRX + .6, 2.3, 4.7), D(CRX + .1, 1.6, CZ), D(CRX + .1, 1.7, CZ), 46, 38]], an, t);
    else if (bi === 3) rig(lt, [[0, D(BX - 1.2, 1.8, 5.0), D(BX - 1.0, 1.7, 4.8), D(BX - 3.6, 1.1, WALLZ), D(BX - 3.6, 1.1, WALLZ), 46, 42], [1.9, D(BX - 1.0, 1.7, 4.8), D(BX + 1.6, 2.0, 6.4), D(BX - 3.6, 1.1, WALLZ), D(BX + 3.0, 1.5, -2.4), 42, 52], [2.6, D(BX + 1.6, 2.0, 6.4), D(BX + 2.8, 2.1, 6.4), D(BX + 3.0, 1.5, -2.4), D(BX + 3.4, 1.7, -2.5), 52, 52]], an, t);
    else if (bi === 4) rig(lt, [[0, D(RX + 2.4, 1.7, 7.4), D(RX + 2.4, 1.7, 7.0), D(RX + 2.1, 1.1, -.6), D(RX + 2.1, 1.1, -.6), 50, 48], [2.5, D(RX + 2.4, 1.7, 7.0), D(RX + 2.1, 1.6, 6.2), D(RX + 2.1, 1.1, -.6), D(RX + 1.9, 1.2, -.5), 48, 42]], an, t);
    else rig(lt, [[0, D(CX + .1, 2.2, 7.4), D(CX + .3, 2.2, 7.0), D(CX + .1, 1.7, -1.0), D(CX + .2, 1.7, -1.0), 60, 58]], an, t);
    A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0); hud.counter(counter[0], counter[1], counter[2], '', counter[3]); hud.tm('');
  };
  return { frame(a) { inner(a, true); inner(a, false); } };
}
