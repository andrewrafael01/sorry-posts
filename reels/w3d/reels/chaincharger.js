// 671 invention chain: little brother keeps taking your charger -> pillow -> freezer -> pocket -> wrist chain -> second charger / businessman.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, addBox, mat, ground, Crowd, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0xe8e2d8, fogNear: 60, fogFar: 200, clouds: false, skyTop: 0x6aa6e8, skyMid: 0xa9cdf0, skyBot: 0xe8f0f8, shadowExtent: 9, shadowRes: 2048, hemi: 1.7, sunI: 1.7, sunDir: [-.3, .9, .6], exposure: 1.12 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const ramp = (x, a, b) => smooth((x - a) / (b - a));
  const BX = 0, KX = 16, SX = -16; // zone centres: bedroom, kitchen, street
  const WALLZ = -3.3;
  const room = (cx, wall, floor, o = {}) => {
    const fl = addBox(S, cx, -.05, .3, 11, .1, 8.4, floor, { cast: false });
    addBox(S, cx, 2.1, WALLZ - .1, 11, 4.4, .2, wall, { cast: false });
    addBox(S, cx - 5.5, 2.1, .3, .2, 4.4, 8.4, wall, { cast: false }); addBox(S, cx + 5.5, 2.1, .3, .2, 4.4, 8.4, wall, { cast: false });
    addBox(S, cx, .12, WALLZ + .02, 11, .24, .06, o.base || 0xf4f0e8, { cast: false });
    return fl;
  };
  // ================================================================= BEDROOM
  { const fl = room(BX, 0xb9c8ee, 0xc99a66); // wood planks
    for (let i = 0; i < 14; i++) addBox(S, BX - 5 + i * .78, .002, .3, .02, .002, 8.4, 0xa9794a, { cast: false });
    addBox(S, BX + .6, .01, -.2, 3.4, .02, 2.6, 0xe1708f, { cast: false, round: .01 }); // rug
    addBox(S, BX + .6, .012, -.2, 2.9, .02, 2.1, 0xf7c3d2, { cast: false });
    // bed (x -2.6..-.6, z -3.2..-.4)
    addBox(S, BX - 1.6, .22, -1.8, 2.1, .36, 2.9, 0x8a5a36, { round: .04 });
    addBox(S, BX - 1.6, .62, -1.8, 2.0, .34, 2.8, 0xf2f2f6, { round: .08 });
    addBox(S, BX - 1.6, .6, -3.22, 2.2, 1.4, .1, 0x8a5a36);
    addBox(S, BX - 1.6, .82, -1.0, 2.04, .1, 1.7, 0x4f7be0, { round: .05 }); // blanket
    addBox(S, BX - 1.6, .84, -.28, 2.06, .16, .2, 0x3d63c0, { round: .06 });
    addBox(S, BX - 1.1, .85, -1.55, 1.0, .02, .02, 0xffffff);
    // dresser + lamp
    addBox(S, BX + 3.1, .56, -2.8, 1.9, 1.12, .9, 0xe8d8b8, { round: .03 });
    for (let i = 0; i < 3; i++) { addBox(S, BX + 3.1, .26 + i * .36, -2.33, 1.74, .3, .04, 0xd3bf96); addBox(S, BX + 3.1, .26 + i * .36, -2.3, .26, .05, .05, 0x555555); }
    { const lb = new THREE.Mesh(new THREE.CylinderGeometry(.22, .3, .34, 16), mat(0xffd9a0, { emissive: 0xffc070, emissiveIntensity: .5 })); lb.position.set(BX + 3.55, 1.52, -2.85); S.add(lb); addBox(S, BX + 3.55, 1.2, -2.85, .08, .35, .08, 0x666666); }
    // window + poster + shelf
    addBox(S, BX + 1.2, 2.6, WALLZ + .02, 2.0, 1.5, .06, 0xffffff); addBox(S, BX + 1.2, 2.6, WALLZ + .06, 1.8, 1.3, .02, 0x9fd4ff, { mat: { emissive: 0x6aaee8, emissiveIntensity: .4 } }); addBox(S, BX + 1.2, 2.6, WALLZ + .08, .06, 1.3, .02, 0xffffff); addBox(S, BX + 1.2, 2.6, WALLZ + .08, 1.8, .06, .02, 0xffffff);
    { const p = cvs(256, 340, (g, w, h) => { g.fillStyle = '#1b1f3a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ff5fa8'; g.beginPath(); g.arc(128, 150, 70, 0, 7); g.fill(); g.fillStyle = '#ffd23a'; for (let i = 0; i < 8; i++) { g.fillRect(30 + i * 26, 260, 14, 30 + (i * 37) % 50); } txt(g, 'VIBES', 128, 40, 56, '#fff'); }); const pm = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.33), new THREE.MeshStandardMaterial({ map: p.t, roughness: .8 })); pm.position.set(BX - 1.6, 2.3, WALLZ + .03); S.add(pm); }
    // wall outlet (chain anchor) next to the bed
    addBox(S, BX - .2, .5, WALLZ + .04, .24, .34, .04, 0xffffff); addBox(S, BX - .2, .56, WALLZ + .07, .08, .1, .02, 0x333333); addBox(S, BX - .2, .43, WALLZ + .07, .08, .1, .02, 0x333333);
    // plant
    { const pot = new THREE.Mesh(new THREE.CylinderGeometry(.22, .17, .32, 12), mat(0xc9683a)); pot.position.set(BX + 4.7, .16, -2.5); S.add(pot); for (let i = 0; i < 7; i++) { const lf = new THREE.Mesh(new THREE.SphereGeometry(.2, 8, 6), mat(0x3f9a4a)); lf.scale.set(.5, 1.5, .3); const a = i / 7 * 6.28; lf.position.set(BX + 4.7 + Math.cos(a) * .18, .7 + (i % 3) * .1, -2.5 + Math.sin(a) * .18); lf.rotation.set(Math.sin(a) * .5, 0, -Math.cos(a) * .5); S.add(lf); } }
  }
  // pillow + toss
  const pillow = new THREE.Mesh(new RoundedBoxGeometry(.9, .2, .58, 4, .08), mat(0xffffff, { roughness: .95 })); pillow.castShadow = true; S.add(pillow);
  // ================================================================= KITCHEN
  const fridgeZ = -2.6;
  { room(KX, 0xffe9a8, 0xe8e2d8, { base: 0xffffff });
    for (let i = 0; i < 12; i++) for (let j = 0; j < 3; j++) addBox(S, KX - 5 + i * .9, 1.5 + j * .0, WALLZ + .01, .02, 2.2, .01, 0xe2c870, { cast: false }); // tile grout lines
    // counters (left of fridge)
    addBox(S, KX - 2.1, .5, -2.75, 3.6, 1.0, 1.0, 0x6a8fb8, { round: .02 }); addBox(S, KX - 2.1, 1.03, -2.75, 3.7, .08, 1.08, 0xf4f1ea);
    for (let i = 0; i < 4; i++) addBox(S, KX - 3.3 + i * .8, .5, -2.24, .74, .86, .03, 0x7ca3cf);
    addBox(S, KX - 2.3, 3.0, -2.95, 3.0, .9, .6, 0xf0ede4); for (let i = 0; i < 3; i++) addBox(S, KX - 3.1 + i * 1.0, 3.0, -2.62, .95, .8, .03, 0xe0dccd);
    // kettle + fruit bowl
    { const k = new THREE.Mesh(new THREE.CylinderGeometry(.18, .24, .36, 14), mat(0xd23a30, { metalness: .3, roughness: .35 })); k.position.set(KX - 3.0, 1.26, -2.8); k.castShadow = true; S.add(k); const bw = new THREE.Mesh(new THREE.SphereGeometry(.3, 14, 8, 0, 7, 1.5, 1.6), mat(0xc9a36a)); bw.position.set(KX - 1.4, 1.28, -2.7); S.add(bw); for (let i = 0; i < 3; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.1, 10, 8), mat([0xe53b2f, 0xffb11a, 0x7cc13a][i])); f.position.set(KX - 1.4 + (i - 1) * .14, 1.36, -2.7 + (i % 2) * .08); S.add(f); } }
    // fridge body (x KX+.6 .. KX+2.4)
    { const fm = { metalness: .3, roughness: .35 }; addBox(S, KX + 1.91, 1.7, fridgeZ - .05, .98, 3.4, 1.2, 0xdfe5ec, { mat: fm }); addBox(S, KX + 1.0, 1.7, -3.05, .82, 3.4, .4, 0xdfe5ec, { mat: fm }); addBox(S, KX + .62, 1.7, -2.45, .04, 3.4, .8, 0xdfe5ec, { mat: fm }); addBox(S, KX + 1.4, 1.7, -2.45, .04, 3.4, .8, 0xdfe5ec, { mat: fm }); addBox(S, KX + 1.0, 3.38, -2.45, .82, .04, .8, 0xdfe5ec, { mat: fm }); addBox(S, KX + 1.0, .02, -2.45, .82, .04, .8, 0xdfe5ec, { mat: fm }); }
    addBox(S, KX + 1.9, 1.7, fridgeZ + .6, .02, 3.3, .02, 0x9aa3ad);
    addBox(S, KX + 2.15, 1.3, fridgeZ + .6, .06, .6, .05, 0x8c949e); // fridge handle
  }
  // freezer door (hinged on its right edge KX+1.4), interior
  const FZ = fridgeZ + .58; // door front plane z
  const fzDoor = new THREE.Group(); fzDoor.position.set(KX + 1.4, 0, FZ); S.add(fzDoor);
  const frostT = cvs(256, 512, (g, w, h) => { g.clearRect(0, 0, w, h); for (let i = 0; i < 900; i++) { const x = cr(i, 31) * w, y = cr(i, 32) * h; const r = 3 + cr(i, 33) * 14; g.fillStyle = `rgba(255,255,255,${.1 + cr(i, 34) * .35})`; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } });
  let frostMat;
  { const dm = mat(0xeef2f7, { metalness: .3, roughness: .35 }); const d = new THREE.Mesh(new THREE.BoxGeometry(.8, 3.3, .08), dm); d.position.set(-.4, 1.7, .04); d.castShadow = true; fzDoor.add(d);
    const hd = addBox(fzDoor, -.12, 1.5, .13, .06, .7, .08, 0x8c949e); hd.castShadow = true;
    frostMat = new THREE.MeshBasicMaterial({ map: frostT.t, transparent: true, opacity: 0, depthWrite: false }); const f = new THREE.Mesh(new THREE.PlaneGeometry(.8, 3.3), frostMat); f.position.set(-.4, 1.7, .09); fzDoor.add(f);
    // door inner shelves face
    addBox(fzDoor, -.4, 1.7, -.03, .72, 3.2, .04, 0xcfe9ff, { cast: false }); }
  { 
    const cav = new THREE.Mesh(new THREE.PlaneGeometry(.76, 3.3), new THREE.MeshStandardMaterial({ color: 0x8fc0ea, emissive: 0x3a78b8, emissiveIntensity: .25 })); cav.position.set(KX + 1.0, 1.7, -2.84); S.add(cav);
    for (const y of [.9, 1.55, 2.2]) addBox(S, KX + 1.0, y, -2.45, .76, .04, .78, 0xf2faff, { cast: false });
  }
  const frzLight = new THREE.PointLight(0xbfe6ff, 0, 5); frzLight.position.set(KX + 1.0, 1.9, fridgeZ + .9); S.add(frzLight);
  // ice cube tray (on shelf y=.92)
  const tray = new THREE.Group(); tray.position.set(KX + 1.0, .94, fridgeZ + .32); S.add(tray);
  { const tb = new THREE.Mesh(new RoundedBoxGeometry(.62, .1, .44, 3, .02), mat(0x5a9ae0, { roughness: .4 })); tb.position.y = .05; tb.castShadow = true; tray.add(tb); for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const c = new THREE.Mesh(new THREE.BoxGeometry(.12, .08, .14), new THREE.MeshStandardMaterial({ color: 0xcdeeff, transparent: true, opacity: .6, roughness: .05 })); c.position.set(-.21 + i * .14, .12, -.1 + j * .2); tray.add(c); } }
  // thermometer (wall)
  const thermo = new THREE.Group(); thermo.position.set(KX - .3, 2.2, WALLZ + .1); S.add(thermo); let merc;
  { const body = new THREE.Mesh(new RoundedBoxGeometry(.3, 1.5, .07, 3, .03), mat(0xffffff)); thermo.add(body); const slot = new THREE.Mesh(new THREE.BoxGeometry(.1, 1.1, .02), mat(0xdde6ee)); slot.position.set(0, .06, .04); thermo.add(slot);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.12, 14, 10), new THREE.MeshStandardMaterial({ color: 0xe53b2f, emissive: 0x7a0e08, emissiveIntensity: .4 })); bulb.position.set(0, -.58, .05); thermo.add(bulb);
    merc = new THREE.Mesh(new THREE.BoxGeometry(.07, 1, .02), new THREE.MeshStandardMaterial({ color: 0xe53b2f, emissive: 0x7a0e08, emissiveIntensity: .4 })); merc.position.set(0, 0, .05); thermo.add(merc);
    for (let i = 0; i < 7; i++) { const tk = new THREE.Mesh(new THREE.BoxGeometry(.1, .015, .02), mat(0x333333)); tk.position.set(.12, -.42 + i * .17, .045); thermo.add(tk); } }
  const merCol = new THREE.Color(0xe53b2f), merCold = new THREE.Color(0x3a9bff);
  // frosty fridge: ice block (charger inside) + stick
  const ice = new THREE.Group(); S.add(ice); let iceBlock; const iceMat = new THREE.MeshPhysicalMaterial({ color: 0xaee3ff, transparent: true, opacity: .55, roughness: .1, metalness: 0, clearcoat: 1, emissive: 0x4fa0d8, emissiveIntensity: .25 });
  { iceBlock = new THREE.Mesh(new RoundedBoxGeometry(.62, .52, .34, 4, .07), iceMat); ice.add(iceBlock);
    const stick = new THREE.Mesh(new THREE.BoxGeometry(.07, .62, .02), mat(0xdcb078, { roughness: .8 })); stick.position.set(0, -.52, 0); stick.castShadow = true; ice.add(stick);
    for (let i = 0; i < 5; i++) { const ic = new THREE.Mesh(new THREE.ConeGeometry(.035, .13 + cr(i, 41) * .1, 6), new THREE.MeshStandardMaterial({ color: 0xdff4ff, transparent: true, opacity: .85 })); ic.rotation.x = Math.PI; ic.position.set(-.24 + i * .12, -.31 - .0, .13 * (i % 2 ? 1 : -1)); ice.add(ic); }
    for (let i = 0; i < 9; i++) { const fr = new THREE.Mesh(new THREE.IcosahedronGeometry(.045 + cr(i, 42) * .04, 0), mat(0xffffff, { roughness: 1 })); fr.position.set((cr(i, 43) - .5) * .55, .24 + cr(i, 44) * .02, (cr(i, 45) - .5) * .28); ice.add(fr); } }
  const mist = []; for (let i = 0; i < 14; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.18, 8, 6), new THREE.MeshBasicMaterial({ color: 0xeaf8ff, transparent: true, opacity: 0, depthWrite: false })); S.add(m); mist.push(m); }
  const tongue = new THREE.Mesh(new RoundedBoxGeometry(.1, .05, .14, 3, .02), mat(0xff7c93, { roughness: .6 })); S.add(tongue);
  // ================================================================= STREET (businessman)
  { ground(S, 0x6faa4a, 60, { y: -.02 }); // grass base
    const sw = addBox(S, SX, -.02, .8, 14, .06, 5.5, 0xbdbab0, { cast: false }); addBox(S, SX, .0, 3.7, 14, .14, .3, 0xd8d5cc, { cast: false });
    addBox(S, SX, 2.2, WALLZ - .3, 14, 4.6, .4, 0xf0c98e, { cast: false }); // house facade
    addBox(S, SX + 3.0, 1.1, WALLZ - .05, 1.3, 2.2, .1, 0x7a3b2a); addBox(S, SX + 3.35, 1.1, WALLZ + .02, .1, .1, .1, 0xffd23a);
    for (const wx of [-3.6, -1.2, 5.3]) { addBox(S, SX + wx, 2.5, WALLZ - .05, 1.5, 1.3, .08, 0xffffff); addBox(S, SX + wx, 2.5, WALLZ, 1.3, 1.1, .04, 0x9fd4ff, { mat: { emissive: 0x6aaee8, emissiveIntensity: .35 } }); }
    for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(.45 + cr(i, 51) * .2, 1), mat(0x3f8a3c, { flatShading: true })); b.position.set(SX - 6 + i * 2.4, .35, WALLZ + .5); b.castShadow = true; S.add(b); }
    addBox(S, SX, 4.6, WALLZ - .3, 14, .5, .5, 0xa04a3a, { cast: false }); }
  // stand
  const stand = new THREE.Group(); stand.position.set(SX, 0, -.5); S.add(stand);
  let standBills, signBoard;
  { addBox(stand, 0, .45, 0, 2.2, .9, .8, 0x6a4a2a, { round: .02 }); addBox(stand, 0, .92, 0, 2.3, .08, .9, 0xe8c48a);
    const front = cvs(512, 160, (g, w, h) => { g.fillStyle = '#ffd23a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#111'; g.lineWidth = 8; g.strokeRect(6, 6, w - 12, h - 12); txt(g, 'CHARGERS $5', w / 2, 84, 72, '#d41808', { stroke: '#111', sw: 12 }); });
    const fp = new THREE.Mesh(new THREE.PlaneGeometry(2.1, .66), new THREE.MeshStandardMaterial({ map: front.t, roughness: .7 })); fp.position.set(0, .48, .405); stand.add(fp);
    for (const sx of [-1.05, 1.05]) addBox(stand, sx, 1.7, -.35, .08, 1.6, .08, 0x6a4a2a);
    const hdr = cvs(512, 200, (g, w, h) => { g.fillStyle = '#d41808'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ffe23a'; g.lineWidth = 10; g.strokeRect(8, 8, w - 16, h - 16); txt(g, 'CHARGERS', w / 2, 74, 84, '#fff', { stroke: '#111', sw: 14 }); txt(g, 'ONLY $5', w / 2, 152, 70, '#ffe23a', { stroke: '#111', sw: 12 }); });
    signBoard = new THREE.Mesh(new THREE.BoxGeometry(2.4, .9, .06), [mat(0x333333), mat(0x333333), mat(0x333333), mat(0x333333), new THREE.MeshStandardMaterial({ map: hdr.t, roughness: .6 }), mat(0x333333)]); signBoard.position.set(0, 2.45, -.32); stand.add(signBoard);
    // chargers on display + cash box
    for (let i = 0; i < 9; i++) { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(.2, .16, .1), mat(0xffffff)); b.position.y = .08; g.add(b); const c = new THREE.Mesh(new THREE.TorusGeometry(.09, .014, 6, 14), mat(0xffffff)); c.position.set(.0, .08, .06); c.rotation.x = .3; g.add(c); g.position.set(-.9 + i * .22, .96, .22 + (i % 2) * .1); g.rotation.y = (cr(i, 61) - .5) * .5; g.traverse((m) => { m.castShadow = true; }); stand.add(g); }
    const cash = addBox(stand, .9, 1.08, -.1, .42, .22, .3, 0x34a853, { round: .02 }); addBox(stand, .9, 1.2, -.1, .36, .02, .24, 0x1b5c2e);
    standBills = []; for (let i = 0; i < 10; i++) { const bl = new THREE.Mesh(new THREE.BoxGeometry(.22, .012, .11), mat(0x7fd68a)); bl.visible = false; S.add(bl); standBills.push(bl); } }
  const briefcase = new THREE.Group(); { const bc = new THREE.Mesh(new RoundedBoxGeometry(.5, .34, .12, 3, .03), mat(0x6b3b1e, { roughness: .5 })); briefcase.add(bc); const hn = new THREE.Mesh(new THREE.TorusGeometry(.07, .014, 6, 12, Math.PI), mat(0x222222)); hn.position.y = .17; briefcase.add(hn); const lk = new THREE.Mesh(new THREE.BoxGeometry(.08, .04, .02), mat(0xffd23a)); lk.position.set(0, .06, .07); briefcase.add(lk); briefcase.traverse((m) => { m.castShadow = true; }); briefcase.visible = false; S.add(briefcase); }
  // ================================================================= people
  const NC = 5; const crowd = new Crowd(S, 2 + NC, 77); const P = crowd.p; const YOU = P[0], KID = P[1];
  const setCol = (i, ks, c) => ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c)));
  const flush = () => { for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true; };
  setCol(0, ['torso', 'armL', 'armR'], 0x8e6cf0); setCol(0, ['legL', 'legR'], 0x34548e); setCol(0, ['hair'], 0x3a2418);
  const kidCol = (suit) => { setCol(1, ['torso', 'armL', 'armR'], suit ? 0x1d2028 : 0xffc83a); setCol(1, ['legL', 'legR'], suit ? 0x1d2028 : 0x4a8a3a); setCol(1, ['hair'], 0x6a3b18); flush(); };
  kidCol(false); YOU.h = 1; KID.h = .7; KID.hs = 1.18; let suitState = false;
  for (let i = 0; i < NC; i++) { const o = P[2 + i]; o.h = .96 + (i % 3) * .04; }
  const reset = (o) => { o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; o.extra = 0; o.speed = .5; o.anim = 'idle'; o.roll = 0; };
  const place = (o, x, y, z, yaw, anim = 'idle', sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; };
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  // ---- charger props
  const cableMat = mat(0xffffff, { roughness: .4 }); const makeCharger = () => { const g = new THREE.Group(); const brick = new THREE.Mesh(new RoundedBoxGeometry(.3, .24, .16, 3, .04), mat(0xffffff, { roughness: .3 })); brick.castShadow = true; g.add(brick); for (const x of [-.06, .06]) { const pr = new THREE.Mesh(new THREE.BoxGeometry(.03, .08, .012), mat(0xc4c8cf, { metalness: .8, roughness: .3 })); pr.position.set(x, .15, 0); g.add(pr); }
    const plug = new THREE.Group(); const pb = new THREE.Mesh(new RoundedBoxGeometry(.1, .14, .07, 2, .02), mat(0xffffff)); pb.castShadow = true; plug.add(pb); const tp = new THREE.Mesh(new THREE.BoxGeometry(.06, .06, .04), mat(0xc4c8cf, { metalness: .8, roughness: .3 })); tp.position.y = -.1; plug.add(tp); S.add(g); S.add(plug);
    const cab = new THREE.Mesh(new THREE.BufferGeometry(), cableMat); cab.castShadow = true; cab.frustumCulled = false; S.add(cab);
    return { g, plug, cab, brick }; };
  const CH1 = makeCharger(), CH2 = makeCharger();
  const setCharger = (ch, B, E, sag = .25, vis = true, rz = 0) => { ch.g.visible = ch.plug.visible = ch.cab.visible = vis; if (!vis) return;
    ch.g.position.copy(B); ch.g.rotation.set(0, 0, rz); ch.plug.position.copy(E);
    const start = V3(B.x, B.y - .12, B.z), end = V3(E.x, E.y + .08, E.z); const mid = start.clone().lerp(end, .5); mid.y -= sag; const q1 = start.clone().lerp(end, .25); q1.y -= sag * .75; const q3 = start.clone().lerp(end, .75); q3.y -= sag * .75;
    const curve = new THREE.CatmullRomCurve3([start, q1, mid, q3, end]); const geo = new THREE.TubeGeometry(curve, 20, .03, 6, false); ch.cab.geometry.dispose(); ch.cab.geometry = geo; };
  // chain links
  const linkMat = mat(0xb8c0cc, { metalness: .85, roughness: .3 }); const NL = 16; const links = []; for (let i = 0; i < NL; i++) { const l = new THREE.Mesh(new THREE.TorusGeometry(.055, .017, 6, 12), linkMat); l.scale.x = 1.45; l.castShadow = true; l.visible = false; S.add(l); links.push(l); }
  const ux = V3(1, 0, 0), tq = new THREE.Quaternion(), rq = new THREE.Quaternion();
  const setChain = (P0, P1, sag, vis) => { const mid = P0.clone().lerp(P1, .5); mid.y -= sag; const curve = new THREE.QuadraticBezierCurve3(P0, mid, P1); links.forEach((l, i) => { l.visible = vis; if (!vis) return; const u = (i + .5) / NL; const p = curve.getPoint(u), tg = curve.getTangent(u).normalize(); l.position.copy(p); tq.setFromUnitVectors(ux, tg); rq.setFromAxisAngle(tg, (i % 2) * Math.PI / 2); l.quaternion.copy(rq).multiply(tq); }); };
  const band = new THREE.Mesh(new THREE.TorusGeometry(.115, .035, 8, 18), mat(0xe8262b, { roughness: .5 })); band.castShadow = true; S.add(band); const lockM = new THREE.Mesh(new RoundedBoxGeometry(.1, .12, .06, 2, .02), mat(0xffd23a, { metalness: .5, roughness: .3 })); S.add(lockM);
  // bolt cutters
  const cutter = new THREE.Group(); const hA = new THREE.Group(), hB = new THREE.Group(); { const hm = mat(0xe8262b, { roughness: .45 }); const mk = (grp) => { const h = new THREE.Mesh(new THREE.BoxGeometry(.07, .9, .06), hm); h.position.y = .45; h.castShadow = true; grp.add(h); const j = new THREE.Mesh(new THREE.BoxGeometry(.08, .22, .07), mat(0x8c939e, { metalness: .85, roughness: .3 })); j.position.y = -.1; j.castShadow = true; grp.add(j); const tip = new THREE.Mesh(new THREE.ConeGeometry(.045, .12, 4), mat(0xcdd3dc, { metalness: .85, roughness: .25 })); tip.position.set(0, -.27, 0); tip.rotation.z = Math.PI; grp.add(tip); }; mk(hA); mk(hB); cutter.add(hA, hB); const pivot = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .1, 8), mat(0x333333)); pivot.rotation.x = Math.PI / 2; cutter.add(pivot); cutter.visible = false; S.add(cutter); }
  // accessories
  const pocket = new THREE.Mesh(new RoundedBoxGeometry(.24, .26, .04, 2, .02), mat(0x2b4577, { roughness: .9 })); pocket.castShadow = true; S.add(pocket);
  const phone = new THREE.Mesh(new RoundedBoxGeometry(.17, .3, .03, 2, .02), mat(0x15171c, { roughness: .3 })); const scr = new THREE.Mesh(new THREE.PlaneGeometry(.14, .26), new THREE.MeshBasicMaterial({ color: 0x8fd0ff })); scr.position.z = .017; phone.add(scr); S.add(phone);
  const badge = cvs(256, 256, (g, w, h) => { g.translate(128, 128); g.fillStyle = '#ff3b6b'; for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.fillRect(-14, -126, 28, 60); } g.rotate(0); g.fillStyle = '#ff3b6b'; g.beginPath(); g.arc(0, 0, 100, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 80, 0, 7); g.fill(); g.setTransform(1, 0, 0, 1, 0, 0); txt(g, '9', 128, 138, 150, '#ff3b6b'); });
  const badgeM = new THREE.Mesh(new THREE.PlaneGeometry(.3, .3), new THREE.MeshBasicMaterial({ map: badge.t, transparent: true, alphaTest: .3 })); S.add(badgeM);
  const hat = new THREE.Mesh(new THREE.ConeGeometry(.17, .38, 12), mat(0xff3b6b, { roughness: .5 })); hat.castShadow = true; S.add(hat); const pom = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 6), mat(0xffe23a)); S.add(pom);
  const grin = cvs(128, 64, (g, w, h) => { g.fillStyle = '#5a2a26'; g.beginPath(); g.moveTo(10, 14); g.quadraticCurveTo(64, 70, 118, 14); g.quadraticCurveTo(64, 28, 10, 14); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(24, 20); g.quadraticCurveTo(64, 48, 104, 20); g.lineTo(98, 24); g.quadraticCurveTo(64, 38, 30, 24); g.fill(); });
  const grinM = new THREE.Mesh(new THREE.PlaneGeometry(.2, .1), new THREE.MeshBasicMaterial({ map: grin.t, transparent: true, alphaTest: .2 })); S.add(grinM);
  const tie = new THREE.Mesh(new THREE.BoxGeometry(.08, .3, .03), mat(0xe8262b)); S.add(tie); const collar = new THREE.Mesh(new THREE.BoxGeometry(.2, .1, .03), mat(0xffffff)); S.add(collar);
  const shoes = []; // (unused placeholder)
  // money sprites / labels
  const mkSprite = (text, c1, c2, w = 320) => { const l = cvs(w, 128, (g, ww, h) => { txt(g, text, ww / 2, 68, 84, c1, { stroke: c2, sw: 16 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const plus = []; for (let i = 0; i < NC + 1; i++) plus.push(mkSprite('+$5', '#7dff6a', '#0a3a10'));
  const snip = mkSprite('SNIP!', '#ffe23a', '#a30a0a', 420); const zzz = mkSprite('FOUND IT', '#ffffff', '#111', 480);
  const sparks = []; for (let i = 0; i < 8; i++) { const s = new THREE.Mesh(new THREE.OctahedronGeometry(.045, 0), new THREE.MeshBasicMaterial({ color: 0xffe266 })); s.visible = false; S.add(s); sparks.push(s); }
  // ================================================================= camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3(); const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .02 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .02 + Math.cos(t * 57) * shake; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .008); };
  const D = (x, y, z) => [x, y, z];
  const armsT = (o, lx, lz, rx, rz) => { o.arms = { lx, lz, rx, rz }; };
  const FWD = (p) => -(Math.PI / 2 + p); // arm angle that points arm straight forward given torso pitch p
  // ================================================================= frame
  const inner = ({ t, bi, lt, p }, pre) => {
    bi = Math.min(bi, 5);
    for (let i = 0; i < 2 + NC; i++) { reset(P[i]); if (i >= 2) P[i].vis = false; }
    let faceShock = false, zone = BX; let popTxt = '', popA = 1;
    const hidePocket = true; let pocketOn = false, phoneOn = false, badgeOn = false, hatOn = false, grinOn = false, tieOn = false, bcOn = false, cutterOn = false, bandOn = false, lockOn = false;
    let counter = ['', '', '', false]; let tmpC = 20;
    let pillowPos = V3(BX - 1.35, .88, -2.85), pillowRot = [0, 0, 0], chOn = [true, false]; let chB = V3(0, -9, 0), chE = V3(0, -9, 0), chSag = .25, chRz = 0, ch2B = null, ch2E = null;
    let chainOn = false, chainA = V3(), chainB = V3(), chainSag = .3; let iceOn = false, icePos = V3(0, -9, 0), iceRot = 0, fzOpen = 0, frost = 0, lick = 0, mercU = 0; let tongueOn = false; let sparkU = -1; let sparkAt = V3();
    let billsFx = []; var iceHeld = false;
    if (suitState !== (bi === 5 && lt >= 3.45)) { suitState = bi === 5 && lt >= 3.45; kidCol(suitState); }
    // -------------------------------------------------------------- beat 0: hide it in your room
    if (bi === 0) {
      zone = BX; const handCharger = lt >= 2.5; counter = ['STOPWATCH', '0.0 SEC', 'CHARGER: HIDDEN', false];
      // 0..2.1: kid snatches the charger from the outlet and runs off
      place(YOU, BX + .3, 0, -.6, .2); armsT(YOU, -.3, -.2, -.3, .2);
      const wall = V3(BX - .2, .5, WALLZ + .12);
      if (lt < 2.1) {
        // kid runs in from right, grabs plug, sprints left
        const run = ramp(lt, .1, .9), flee = ramp(lt, 1.0, 1.9); const kx = lerp(BX + 4.6, BX - .1, run) + lerp(0, -5.5, flee), kz = lerp(-1.0, -2.7, run) + lerp(0, 4.0, flee);
        const kyaw = flee > .01 ? -1.55 : (run < 1 ? -1.95 : Math.PI);
        place(KID, kx, 0, kz, kyaw, run < 1 || flee > 0 ? 'sprint' : 'idle', .55); if (flee <= 0.01 && run >= 1) { place(KID, kx, 0, kz, Math.PI, 'idle'); armsT(KID, FWD(0), 0, FWD(0), 0); }
        if (flee > .01 || run > .995) { // holds charger over head
          if (flee > .01) armsT(KID, -2.6, -.1, -2.6, .1);
        }
        const kh = hp(KID, 'handR'); if (lt < .95 + .0) { chB = wall.clone(); chE = V3(wall.x + .1, .2, wall.z + .25); chSag = .18; } else { chB = kh.clone().add(V3(0, .05, .05)); chE = kh.clone().add(V3(.12, -.35, .1)); chSag = .22; }
        YOU.yaw = lerp(.2, -.35, ramp(lt, 1.0, 1.3)); armsT(YOU, -.1, -.5, -2.4, .3); // "hey!" arms up after
        if (lt < 1.0) armsT(YOU, -.3, -.2, -.3, .2);
      } else {
        // YOU stash it: walk to the bed, lift pillow, slide charger under
        const walkIn = ramp(lt, 2.1, 2.9);
        const yx = lerp(BX + 1.2, BX - .35, walkIn), yz = lerp(-.5, -2.5, walkIn);
        place(YOU, yx, 0, yz, -1.57 + .0, walkIn < 1 ? 'walk' : 'idle', .6); YOU.pitch = .5 * walkIn; KID.vis = false;
        const lift = ramp(lt, 3.05, 3.45) * (1 - ramp(lt, 3.7, 4.0));
        const slide = ramp(lt, 3.35, 3.75);
        armsT(YOU, -.3, -.15, FWD(YOU.pitch) + .35 - .1 * lift, .3);
        // charger in right hand until the pillow is lifted, then under the pillow
        const hr = hp(YOU, 'handR');
        pillowPos = V3(BX - 1.35, .88 + lift * .5, -2.85 + lift * .15); pillowRot = [-lift * .5, 0, 0];
        if (lt < 3.75) { chB = hr.clone().add(V3(0, .0, .0)); chE = hr.clone().add(V3(0, -.45, .1)); chSag = .25; chOn[0] = true; }
        else { chB = V3(BX - 1.35, .7, -2.85); chE = V3(BX - 1.2, .7, -2.6); chSag = .02; chOn[0] = false; }
        if (lt >= 3.75) chOn[0] = false;
        if (lt < 2.9) { chB = hr.clone(); chE = hr.clone().add(V3(0, -.45, .1)); }
        if (lt >= 3.55) { popTxt = 'HIDDEN!'; popA = clamp((lt - 3.55) * 5) * (1 - ramp(lt, 4.5, 4.67)); counter = ['STOPWATCH', '0.0 SEC', 'CHARGER: HIDDEN', false]; }
      }
    }
    // -------------------------------------------------------------- beat 1: found in 4 seconds
    if (bi === 1) {
      zone = BX; const secs = clamp((lt - .3) / 2.0) * 4.0; counter = ['STOPWATCH', secs.toFixed(1) + ' SEC', lt > 2.35 ? 'FOUND IT' : 'searching...', lt > 2.35];
      place(YOU, BX + .9, 0, -.2, .2, 'idle'); armsT(YOU, -.6, -.3, -2.0, .35); YOU.pitch = -.05; // smug arms crossed-ish then shocked
      const run = ramp(lt, .25, 1.0), jump = ramp(lt, 1.0, 1.3); const kx = lerp(BX + 4.4, BX - .35, run), kz = lerp(-.6, -2.2, run);
      if (lt < 1.0) place(KID, kx, 0, kz, lerp(-1.9, -1.5, run), 'sprint', .55);
      else { const by = .66 * jump; place(KID, lerp(BX - .35, BX - 1.0, jump), by * (1 - ramp(lt, 1.3, 1.45)) + .66 * ramp(lt, 1.3, 1.45), lerp(-2.2, -2.55, jump), -1.57, 'idle'); KID.y = .66 * jump; }
      if (lt >= 1.0) { KID.pitch = .85; const dig = Math.sin(lt * 22) * .35; armsT(KID, FWD(.85) + .1 + dig, -.1, FWD(.85) + .1 - dig, .1); if (lt > 1.9) { KID.pitch = .3; armsT(KID, -2.9, 0, -2.9, 0); KID.y = .66; } }
      // pillow flies up and over at ~1.55
      const pf = clamp((lt - 1.55) / .7); const hop = Math.sin(pf * Math.PI) * 1.4; pillowPos = lt < 1.55 ? V3(BX - 1.35, .88, -2.85) : V3(BX - 1.35 - pf * 1.2, .88 + hop, -2.85 + pf * .9); pillowRot = [pf * 3.2, pf * 1.5, pf * 2];
      if (pf >= 1) { pillowPos = V3(BX - 2.55, .78, -1.95); pillowRot = [.0, 1.5, 0]; }
      // charger revealed on mattress, then pulled up in his hand
      const kh = hp(KID, 'handR');
      if (lt < 1.75) chOn[0] = false; else if (lt < 2.0) { chB = V3(BX - 1.35, .78, -2.85); chE = V3(BX - 1.1, .74, -2.6); chSag = .02; } else { chB = kh.clone().add(V3(0, .1, 0)); chE = kh.clone().add(V3(.05, -.4, .05)); chSag = .22; }
      chOn[0] = lt >= 1.75;
      if (lt >= .12 && lt < .9) { popTxt = 'CLEVER!'; popA = clamp((lt - .12) * 6) * (1 - ramp(lt, .65, .9)); faceShock = false; }
      if (lt > 2.35) { faceShock = true; } YOU.arms = lt > 2.35 ? { lx: -2.4, lz: -.3, rx: -2.4, rz: .3 } : { lx: -.5, lz: -.3, rx: -1.9, rz: .4 };
    }
    // -------------------------------------------------------------- beat 2: freezer popsicle
    if (bi === 2) {
      zone = KX; fzOpen = 0; frost = 0; const yx = KX - .55; counter = ['CHARGER TEMP', '', '', false];
      place(YOU, KX - .55, 0, fridgeZ + .9, Math.PI / 2 - .8, 'idle'); YOU.pitch = .12;
      const reachIn = ramp(lt, .15, .75), out = ramp(lt, .95, 1.2);
      // door: open at start, closes ~1.1; reopens at 3.0
      fzOpen = lt < 1.05 ? 1.9 : lt < 1.3 ? 1.9 * (1 - ramp(lt, 1.05, 1.3)) : lt < 3.0 ? 0 : 1.9 * ramp(lt, 3.0, 3.5);
      const hr0 = V3(KX + .8, 1.0, fridgeZ + .9); armsT(YOU, -.2, -.2, FWD(.1) - .3 * reachIn + .0, .25); YOU.yaw = Math.PI / 2 - .8 + .3 * ramp(lt, .0, .3);
      const hr = hp(YOU, 'handR');
      // charger goes from hand to the tray
      if (lt < .55) { chB = hr.clone(); chE = hr.clone().add(V3(.05, -.45, .1)); chSag = .22; } else { chB = V3(KX + 1.0, 1.12, fridgeZ + .35); chE = V3(KX + 1.25, 1.02, fridgeZ + .52); chSag = .03; }
      if (lt >= .75 && lt < 1.3) { const sh = ramp(lt, .75, 1.0); chB.y = 1.12; }
      // after freezing: charger inside ice block
      const iced = lt >= 3.0; frost = ramp(lt, 1.3, 2.9) * (lt < 3.0 ? 1 : 1 - ramp(lt, 3.0, 3.5));
      tmpC = lt < .9 ? 20 : lerp(20, -18, ramp(lt, 1.0, 2.7)); mercU = clamp((tmpC + 25) / 45); counter = ['CHARGER TEMP', Math.round(tmpC) + '°C', tmpC <= -10 ? 'FROZEN SOLID' : 'room temp', tmpC < 0];
      faceShock = lt > 3.5 && lt < 5.0;
      if (lt >= 1.9 && lt < 3.0) { popTxt = 'MUCH BETTER!'; popA = clamp((lt - 1.9) * 6) * (1 - ramp(lt, 2.75, 3.0)); armsT(YOU, -.2, -.2, -2.7, .25); YOU.pitch = 0; YOU.yaw = Math.PI / 2 - .8; }
      if (iced) { iceOn = true; icePos = V3(KX + 1.0, 1.28 + .26, fridgeZ + .35); iceRot = 0; chOn[0] = true; chB = icePos.clone().add(V3(-.08, 0, 0)); chE = icePos.clone().add(V3(.22, -.1, .0)); chSag = .0;
        if (lt > 3.4) { armsT(YOU, -.35, -.25, -1.4, .45); YOU.pitch = .2; }
      }
      // kid enters, takes the popsicle by the stick, licks it
      const kIn = ramp(lt, 3.8, 4.7), grab = ramp(lt, 4.7, 5.0);
      if (lt > 3.7) {
        const kx = lerp(KX + 3.8, KX + 1.5, kIn), kz = lerp(.8, fridgeZ + 1.4, kIn); place(KID, kx, 0, kz, lerp(-1.4, -.2 + .0, kIn) + (kIn >= 1 ? 0 : 0), kIn < 1 ? 'walk' : 'idle', .6);
        if (kIn >= 1) { KID.yaw = lerp(-.5, 0, ramp(lt, 5.2, 5.6)); }
        const hrk = hp(KID, 'handR'); const lickU = ramp(lt, 5.2, 6.0); const stickHand = hp(KID, 'handR');
        if (lt < 4.7) armsT(KID, FWD(.0) + .3, -.1, FWD(0) + .5, .1);
        else if (lt < 5.2) { armsT(KID, -.4, -.2, FWD(0) - .1 - .5 * grab, .1); }
        else { armsT(KID, -.4, -.2, -2.15, .15); KID.pitch = -.1; }
        if (lt >= 4.9) { iceHeld = true; const hh = hp(KID, 'handR'); icePos = hh.clone().add(V3(.05, .25, .3)); chB = icePos.clone().add(V3(-.08, 0, 0)); chE = icePos.clone().add(V3(.22, -.1, 0)); }
        tongueOn = lt > 5.4; lick = clamp((lt - 5.4) / .15) * (.5 + .5 * Math.sin(lt * 12));
      }
      if (lt > 3.5) counter = ['CHARGER TEMP', '-18°C', 'POPSICLE', true];
    }
    // -------------------------------------------------------------- beat 3: pocket
    if (bi === 3) {
      zone = BX; counter = ['POCKETS PICKED', lt > 2.5 ? '1' : '0', lt > 3.4 ? 'thief age: 9' : lt > 1.7 ? 'he is behind you' : 'charger: in pocket', lt > 2.5];
      const cx0 = BX + 1.0; place(YOU, cx0, 0, -.6, 0, 'idle'); YOU.pitch = .05; pocketOn = true; phoneOn = true;
      armsT(YOU, -1.15, .05, -1.15, -.1);
      const stuff = ramp(lt, .25, .9);
      place(KID, lerp(cx0 + 3.8, cx0 + .98, ramp(lt, 1.3, 2.3)), 0, lerp(-.2, -.2, 1), lerp(-.5, -.4, 1), lt < 2.3 ? 'walk' : 'idle', .45); if (lt < 1.3) KID.vis = true;
      // charger path: your hand stuffs it into pocket, then hangs out; kid's hand pulls it
      const pocketP = V3(cx0 + .2, .78, -.6 + .19);
      const hr = hp(YOU, 'handR'); const hl = hp(YOU, 'handL');
      if (lt < .25) { /* in hand */ }
      armsT(YOU, -1.15, .05, lt < .9 ? lerp(-1.15, -.6, stuff) : -1.15, lt < .9 ? lerp(-.1, .55, stuff) : -.1);
      const kh = hp(KID, 'handL'); const reach = ramp(lt, 2.1, 2.6), pull = ramp(lt, 2.55, 3.0);
      if (lt >= 1.3) { armsT(KID, lerp(-.2, -.35, reach), lerp(-.15, -1.5, reach) * (1 - pull) + (-.5) * pull, -.2, .2); }
      if (lt < .9) { const pos = hr.clone(); chB = pos.clone(); chE = pos.clone().add(V3(0, -.4, .1)); chSag = .2; if (stuff > .8) { chB = V3().lerpVectors(hr, pocketP.clone().add(V3(0, .1, .03)), 1); } }
      else if (lt < 2.55) { chB = pocketP.clone().add(V3(0, .1, .04)); chE = pocketP.clone().add(V3(.08, -.45, .05)); chSag = .1; }
      else { const khl = hp(KID, 'handL'); const w = pull; const up = V3(khl.x, khl.y - .02, khl.z + .06); chB = V3().lerpVectors(pocketP.clone().add(V3(0, .1, .04)), up, w); chE = V3().lerpVectors(pocketP.clone().add(V3(.08, -.45, .05)), up.clone().add(V3(-.05, -.4, .0)), w); chSag = .18; }
      if (lt >= 3.0) { /* cut handled by camera */ const kh2 = hp(KID, 'handL'); armsT(KID, -.3, -2.7, -.2, .2); }
      badgeOn = true; hatOn = true; grinOn = lt > 1.7;
      if (lt >= 3.0) { place(KID, cx0 + .98, 0, -.2, -.1, 'idle'); armsT(KID, -.5, -.9, -.2, .2); const hh = hp(KID, 'handL'); armsT(KID, -2.7, -.4, -.2, .2); const hh2 = hp(KID, 'handL'); chB = hh2.clone().add(V3(0, .15, .05)); chE = hh2.clone().add(V3(.0, -.4, .05)); chSag = .15; }
      if (lt > 2.7 && lt < 3.5) { popTxt = 'PICKED!'; popA = clamp((lt - 2.7) * 6) * (1 - ramp(lt, 3.3, 3.5)); }
    }
    // -------------------------------------------------------------- beat 4: wrist chain
    if (bi === 4) {
      zone = BX; const cutT = 2.3; const snipped = lt >= cutT; counter = ['WRISTS OWNED', snipped ? '0' : '1', snipped ? 'he took the wrist' : 'chain: unbreakable', snipped];
      place(YOU, BX + 1.7, 0, -1.7, 0.0, 'idle'); YOU.pitch = .0; armsT(YOU, -.9, -.1, -.3, .25);
      const wristL = (() => { const h = hp(YOU, 'handL'); return h; })();
      const outlet = V3(BX - .2, .52, WALLZ + .12);
      if (lt < cutT) { chOn[0] = true; chB = outlet.clone(); chB.y = .46; chE = V3(outlet.x + .1, .2, outlet.z + .2); chSag = .1; chainOn = true; bandOn = true; lockOn = true; chainA = V3(outlet.x + .12, .5, outlet.z + .14); chainB = wristL.clone().add(V3(.0, .06, .0)); chainSag = .5; }
      const kin = ramp(lt, .0, 1.5) ; const kcx = lerp(BX + 4.8, BX + .15, kin), kcz = lerp(-.4, -1.55, kin);
      if (lt < cutT + .15) place(KID, kcx, 0, kcz, lerp(-1.6, -.3, kin), kin < 1 ? 'walk' : 'idle', .5);
      if (lt < 1.5) { KID.yaw = lerp(-1.6, -.3, kin); }
      const open = lt < 1.9 ? 1 : lt < cutT ? 1 - ramp(lt, 1.9, cutT) : 1; const close = lt < 1.5 ? 0 : 1;
      if (lt < cutT + .2) { cutterOn = true; armsT(KID, FWD(.0) - .05, .0, FWD(.0) - .05, .0); }
      if (lt >= cutT + .15) { // sprint away with the wristband
        const fl = clamp((lt - cutT - .15) / 1.0); place(KID, BX + .15 - fl * fl * 7.5, 0, -1.55 + fl * 2.6, -1.57 - .0, 'sprint', .55); armsT(KID, -2.6, -.1, -2.6, .1); cutterOn = false; }
      // cutter attached to kid's hands
      const hr = hp(KID, 'handR');
      if (cutterOn) { const jaw = lt < 1.9 ? .5 : lt < cutT ? lerp(.5, 0.0, ramp(lt, 2.05, cutT)) : 0; hA.rotation.z = jaw; hB.rotation.z = -jaw; attach(cutter, KID, 'handR', [0, -.05, .0], [0, 0, 0]); cutter.matrix.multiply(new THREE.Matrix4().makeRotationX(Math.PI)); cutter.visible = true; }
      // broken: band + chain fly
      if (snipped) { const f = lt - cutT; bandOn = true; lockOn = false; chainOn = false; chOn[0] = true;
        const hhA = hp(KID, 'handR'); band.position.copy(hhA); band.rotation.set(1.1, 0, f * 8); band.visible = true; // band in kid's hand
        chB = V3(outlet.x, .46 - Math.min(.25, f * f * 4), outlet.z + .14); chE = V3(outlet.x + .1 + f * .1, Math.max(.05, .2 - f * f * 3), outlet.z + .25); chSag = .05;
        const swr = hp(YOU, 'handL'); sparkU = clamp(f / .5); sparkAt = V3(BX + .6, .85, -2.3);
        if (f < 1.0) { chainOn = true; chainA = V3(outlet.x + .12, .5 - Math.min(.3, f * f * 5), outlet.z + .14); chainB = V3(outlet.x + .12 + Math.min(.5, f * 1.2), Math.max(.06, .35 - f * f * 3), outlet.z + .2); chainSag = .1; }
        armsT(YOU, -2.3, -.35, -2.3, .35); faceShock = true; YOU.pitch = -.08;
        popTxt = f < 1.1 ? 'SNIP!' : ''; popA = clamp(f * 8) * (1 - ramp(f, .85, 1.1)); }
      else faceShock = false;
    }
    // -------------------------------------------------------------- beat 5: second charger -> businessman
    if (bi === 5) {
      if (lt < 3.45) {
        zone = BX; counter = ['CHARGERS OWNED', lt < 1.8 ? '2' : lt < 3.1 ? '2' : '0', lt < 3.1 ? 'second charger: bought' : 'he took both', lt >= 3.1];
        const tIn = lt;
        place(YOU, BX + .3, 0, -.4, 0, 'idle'); armsT(YOU, -.9 - .15 * Math.sin(lt * 3), -.5, -.9 + .15 * Math.sin(lt * 3), .5);
        const hl = hp(YOU, 'handL'), hr = hp(YOU, 'handR'); const kin = ramp(lt, 2.4, 3.0);
        const flee = ramp(lt, 3.05, 3.45);
        if (lt >= 2.3) { place(KID, lerp(BX + 4.8, BX + .1, kin) - flee * 3, 0, lerp(.2, -.1, kin) + flee * 1.5, lt < 3.05 ? -1.0 : -1.57, lt < 3.0 ? 'sprint' : 'sprint', .55); armsT(KID, lerp(-.2, -1.5, kin), -.3, lerp(-.2, -1.5, kin), .3); if (lt >= 3.05) armsT(KID, -2.6, -.2, -2.6, .2); }
        else KID.vis = false;
        const k = lt >= 3.05 ? 'kid' : 'you';
        const khL = hp(KID, 'handL'), khR = hp(KID, 'handR');
        chOn[0] = true; chOn[1] = true;
        if (lt < 3.05) { chB = hr.clone().add(V3(0, .06, 0)); chE = hr.clone().add(V3(.0, -.45, .1)); chSag = .22; ch2B = hl.clone().add(V3(0, .06, 0)); ch2E = hl.clone().add(V3(0, -.45, .1)); }
        else { chB = khR.clone().add(V3(0, .1, 0)); chE = khR.clone().add(V3(0, -.4, .1)); chSag = .22; ch2B = khL.clone().add(V3(0, .1, 0)); ch2E = khL.clone().add(V3(0, -.4, .1)); }
        if (lt >= 3.1) { faceShock = true; armsT(YOU, -.3, -.5, -.3, .5); } YOU.pitch = 0;
        if (lt > 3.05 && lt < 3.45) { popTxt = 'GONE!'; popA = clamp((lt - 3.05) * 8); }
        if (lt < 2.3 && lt > 1.1) { /* receipt-y bubble */ }
      } else {
        zone = SX; chOn[0] = false; chOn[1] = false; YOU.vis = false;
        const f = lt - 3.45; const sold = clamp(Math.floor(Math.max(0, f - .15) / .45), 0, 5); const part = (Math.max(0, f - .15) % .45) / .45;
        const cash = Math.min(50, sold * 5 + (part > .5 ? 5 : 0) + (f > .15 ? 0 : 0)); const cash2 = Math.min(5, 5) && sold * 5 + (part > .35 && sold < 5 ? 5 : 0);
        counter = ['CASH', '$' + (f < .15 ? 0 : cash2), 'chargers sold: ' + Math.min(sold + (part > .35 ? 1 : 0), 6), true];
        place(KID, SX - .1, .0, -1.15, 0, 'idle'); tieOn = true; bcOn = true; KID.scale = 1;
        armsT(KID, -.35, -.3, -.35 - .3 * Math.max(0, Math.sin(f * 7)), .4);
        // customers queue to the right, first one at the counter
        for (let c = 0; c < NC; c++) { const o = P[2 + c]; const slot = c - Math.floor(Math.max(0, f - .15) / .45); const adv = (Math.max(0, f - .15) % .45) / .45; let sx; if (slot < 0) { sx = SX + 1.5 - (-slot - 1 + adv) * 2.2; o.vis = slot > -3; place(o, sx, 0, .45, -1.57, 'walk', .5); }
          else { const pos = slot - (slot === 0 ? 0 : 0) + (slot >= 1 ? 0 : 0); const target = SX + 1.5 + slot * .85; const prev = SX + 1.5 + (slot + 1) * .85; o.vis = true; sx = lerp(prev, target, adv); if (slot === 0 && adv < .5) sx = lerp(SX + 1.5 + .85, SX + 1.5, ramp(adv, 0, .5)); place(o, sx, 0, .05, -1.0, (slot >= 0 && Math.abs(sx - target) > .05) ? 'walk' : 'idle', .45); if (slot === 0 && adv > .3 && adv < .7) { armsT(o, -.2, -.2, -1.5, .15); } }
          if (c < NC && slot >= 0 && Math.abs(slot) > 4) o.vis = false; }
        badgeOn = true;
      }
    }
    // -------------------------------------------------------------- common: people matrices
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t); if (pre) return;
    // -------------------------------------------------------------- props
    pillow.visible = bi <= 1 || false; if (pillow.visible) { pillow.position.copy(pillowPos); pillow.rotation.set(...pillowRot); }
    setCharger(CH1, chB, chE, chSag, chOn[0] && bi !== 5 ? true : (bi === 5 && chOn[0] && lt < 3.45), chRz);
    if (bi === 5 && ch2B) setCharger(CH2, ch2B, ch2E, chSag, chOn[1] && lt < 3.45); else setCharger(CH2, V3(0, -9, 0), V3(0, -9, 0), 0, false);
    // ice block
    ice.visible = iceOn; if (iceOn) { ice.position.copy(icePos); ice.rotation.set(0, 0, iceRot); ice.scale.setScalar(iceHeld ? .7 : 1); }
    // door + frost + light + mist
    fzDoor.rotation.y = fzOpen; frostMat.opacity = frost * .85; frzLight.intensity = fzOpen > .5 && zone === KX ? 2.2 : 0;
    mist.forEach((m, i) => { const on = zone === KX && fzOpen > .5; m.visible = on; if (!on) return; const ph = (t * .5 + cr(i, 70)) % 1; m.position.set(KX + .7 + cr(i, 71) * .7 + Math.sin(t + i) * .05, 1.5 - ph * .9, fridgeZ + .8 + ph * .3); m.scale.setScalar(.7 + ph); m.material.opacity = (1 - ph) * .28; });
    thermo.visible = zone === KX; merc.scale.y = Math.max(.02, mercU * 1.1); merc.position.y = -.5 + mercU * .55; merc.material.color.copy(merCol).lerp(merCold, 1 - mercU); merc.material.emissive.copy(merCol).lerp(merCold, 1 - mercU).multiplyScalar(.5);
    // person accessories
    pocket.visible = pocketOn; if (pocketOn) attach(pocket, YOU, 'torso', [.2, -.2, .175]);
    phone.visible = phoneOn; if (phoneOn) { attach(phone, YOU, 'handR', [-.12, -.02, .1], [-.2, 0, 0]); }
    badgeM.visible = badgeOn; if (badgeOn) attach(badgeM, KID, 'torso', [.1, .06, .18]);
    hat.visible = pom.visible = hatOn; if (hatOn) { attach(hat, KID, 'head', [0, .32, 0], [0, 0, -.15]); attach(pom, KID, 'head', [.03, .52, 0]); }
    grinM.visible = grinOn; if (grinOn) attach(grinM, KID, 'head', [.0, -.09, .226 * 1.18]);
    tie.visible = collar.visible = tieOn; if (tieOn) { attach(tie, KID, 'torso', [0, .12, .17]); attach(collar, KID, 'torso', [0, .28, .165]); }
    briefcase.visible = bcOn; if (bcOn) { briefcase.position.set(SX - 1.15, 1.2, -.35); briefcase.rotation.set(0, .2, 0); briefcase.matrixAutoUpdate = true; }
    tongue.visible = tongueOn; if (tongueOn) { attach(tongue, KID, 'head', [.0, -.14, .27 + lick * .1], [.4, 0, 0]); }
    // wristband + lock + chain
    band.visible = bandOn && !(bi === 4 && lt >= 2.3 ? false : false); lockM.visible = lockOn;
    if (bi === 4 && lt < 2.3) { const hl = hp(YOU, 'handL'); band.position.copy(hl).add(V3(0, .08, 0)); band.rotation.set(1.57, 0, 0); lockM.position.copy(hl).add(V3(-.03, .1, .1)); }
    if (!(bi === 4)) band.visible = false;
    setChain(chainA, chainB, chainSag, chainOn);
    // sparks
    sparks.forEach((s, i) => { const on = sparkU >= 0 && sparkU < 1; s.visible = on; if (on) { const a = i / 8 * 6.28; s.position.set(sparkAt.x + Math.cos(a) * sparkU * .5, sparkAt.y + Math.sin(a) * sparkU * .5, sparkAt.z + .2); s.scale.setScalar(1 - sparkU); } });
    // plus money sprites + bills
    plus.forEach((s, i) => { s.visible = false; });
    standBills.forEach((b) => { b.visible = false; });
    if (bi === 5 && lt >= 3.45) { const f = lt - 3.45; for (let k = 0; k < 6; k++) { const st = .15 + k * .45 + .15; const l = f - st; const on = l > 0 && l < .6; if (!on) continue; const s = plus[k % plus.length]; s.visible = true; s.position.set(SX + .7, 1.7 + l * .8, .3); s.scale.set(.75, .3, 1); s.material.opacity = 1 - l / .6; const b = standBills[k % 10]; b.visible = true; b.position.set(SX + 1.3 - l * 1.4, 1.2 + Math.sin(l * 5) * .15, -.2); b.rotation.set(0, l * 6, 0); } }
    // pop text
    hud.pop(popTxt, popA);
    // -------------------------------------------------------------- camera
    const an = { hy: hp(YOU, 'head'), hk: hp(KID, 'head'), hr: hp(YOU, 'handR'), hl: hp(YOU, 'handL'), kr: hp(KID, 'handR'), kl: hp(KID, 'handL') };
    A.follow(zone, 0);
    if (bi === 0) rig(lt, [[0, D(BX + 3.4, 3.0, 6.2), D(BX + 2.2, 2.8, 5.8), D(BX + 0.2, 1.1, -1.2), D(BX + 0, 1.0, -1.3), 48, 46], [2.1, D(BX - 4.6, 3.1, 3.8), D(BX - 4.2, 2.9, 3.4), D(BX - 1.0, 1.3, -2.4), D(BX - 1.0, 1.3, -2.4), 48, 44]], an, t);
    else if (bi === 1) rig(lt, [[0, D(BX - 5.2, 3.4, 5.0), D(BX - 4.8, 3.2, 4.6), D(BX - .8, 1.5, -2.0), D(BX - 1.0, 1.5, -2.2), 46, 44], [1.0, D(BX - 4.4, 3.2, 3.6), D(BX - 4.2, 3.1, 3.4), D(BX - 1.0, 1.5, -2.4), D(BX - 1.1, 1.6, -2.4), 44, 42]], an, t);
    else if (bi === 2) rig(lt, [[0, D(KX + .2, 2.1, 4.1), D(KX + .5, 2.0, 3.8), D(KX + .3, 1.3, -1.4), D(KX + .5, 1.3, -1.4), 44, 40], [3.0, D(KX + .5, 2.1, 4.0), D(KX + .8, 2.0, 3.6), D(KX + .7, 1.5, -1.4), D(KX + .9, 1.5, -1.4), 42, 40], [4.3, D(KX + 1.0, 1.9, 3.6), D(KX + 1.4, 1.7, 2.8), (a) => [a.hk.x - .1, a.hk.y + .05, a.hk.z], (a) => [a.hk.x - .1, a.hk.y + .05, a.hk.z], 42, 36]], an, t);
    else if (bi === 3) rig(lt, [[0, D(BX + 2.2, 2.6, 5.4), D(BX + 2.0, 2.5, 5.0), D(BX + 1.2, 1.4, -.6), D(BX + 1.2, 1.4, -.6), 42, 40], [2.0, D(BX + 3.6, 2.4, 4.4), D(BX + 3.3, 2.3, 4.0), D(BX + 1.6, 1.2, -.3), D(BX + 1.6, 1.2, -.3), 40, 38], [3.2, D(BX + 2.2, 1.35, 1.7), D(BX + 2.1, 1.3, 1.5), (a) => [a.hk.x - .1, a.hk.y - .1, a.hk.z], (a) => [a.hk.x - .1, a.hk.y - .1, a.hk.z], 32, 28]], an, t);
    else if (bi === 4) rig(lt, [[0, D(BX + 4.2, 2.2, 3.4), D(BX + 3.6, 2.0, 3.0), D(BX + .9, 1.0, -1.9), D(BX + .9, .9, -1.9), 46, 42], [2.0, D(BX + 3.0, 1.7, 2.6), D(BX + 2.6, 1.6, 2.2), D(BX + .8, .9, -1.9), D(BX + .6, .9, -1.9), 38, 36], [2.5, D(BX + 3.0, 2.2, 3.2), D(BX + 2.6, 2.2, 3.0), D(BX + .4, 1.0, -1.0), D(BX - .2, 1.0, -.6), 50, 54]], an, t, lt > 2.3 && lt < 2.6 ? .02 : 0);
    else if (lt < 3.45) rig(lt, [[0, D(BX + 2.8, 2.7, 5.6), D(BX + 2.2, 2.6, 5.2), D(BX + .6, 1.4, -.3), D(BX + .5, 1.4, -.3), 44, 42], [2.2, D(BX + 3.1, 2.6, 5.2), D(BX + 2.5, 2.5, 5.0), D(BX + .3, 1.4, -.2), D(BX + .1, 1.4, -.2), 44, 44]], an, t);
    else rig(lt - 3.45, [[0, D(SX - .6, 2.8, 8.6), D(SX - .2, 2.6, 8.0), D(SX + .6, 1.6, -.5), D(SX + .8, 1.5, -.3), 50, 46]], an, t);
    A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0); hud.counter(counter[0], counter[1], counter[2], '', counter[3]); hud.tm('');
  };
  return { frame(a) { inner(a, true); inner(a, false); } };
}
