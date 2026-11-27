// 692 invention chain: little sister keeps borrowing your hoodie -> closet -> map -> lock + hair clip -> school lawyer -> store return -> LITTLE SISTER.
// Roblox-avatar look (big rounded head, dot eyes, big red D mouth) with per-character face decals, lip-synced to word times.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, addBox, mat, ground, clamp, smooth, lerp } = lib;
  const A = makeStage({ fog: 0xe8e2d8, fogNear: 60, fogFar: 200, clouds: false, skyTop: 0x6aa6e8, skyMid: 0xa9cdf0, skyBot: 0xe8f0f8, shadowExtent: 9, shadowRes: 2048, hemi: 1.7, sunI: 1.7, sunDir: [-.3, .9, .6], exposure: 1.12 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const ramp = (x, a, b) => smooth((x - a) / (b - a));
  const BX = 0, SCH = 24, STO = -24, WALLZ = -3.3;
  const plane = (w, h, map, o = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial(Object.assign({ map, transparent: true }, o))); return m; };
  const rbx = (w, h, d, c, r = .12, o = {}) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.2, h / 2.2, d / 2.2)), mat(c, Object.assign({ roughness: .55 }, o))); m.castShadow = true; m.receiveShadow = true; return m; };
  const room = (cx, wall, floor) => { addBox(S, cx, -.05, .3, 11, .1, 8.4, floor, { cast: false }); addBox(S, cx, 2.1, WALLZ - .1, 11, 4.4, .2, wall, { cast: false }); addBox(S, cx - 5.5, 2.1, .3, .2, 4.4, 8.4, wall, { cast: false }); addBox(S, cx + 5.5, 2.1, .3, .2, 4.4, 8.4, wall, { cast: false }); addBox(S, cx, .12, WALLZ + .02, 11, .24, .06, 0xf4f0e8, { cast: false }); };
  // ============================================================== BEDROOM + CLOSET (closet centre x = .4, door plane z = -2.45)
  const CX = .4, CZ = -2.45; let doorL, doorR, shackle, lockG, closetLight;
  { room(BX, 0xb9c8ee, 0xc99a66);
    for (let i = 0; i < 14; i++) addBox(S, BX - 5 + i * .78, .002, .3, .02, .002, 8.4, 0xa9794a, { cast: false });
    addBox(S, BX + .4, .01, -.6, 4.2, .02, 3.0, 0xe1708f, { cast: false, round: .01 }); addBox(S, BX + .4, .012, -.6, 3.7, .02, 2.5, 0xf7c3d2, { cast: false });
    // bed far left
    addBox(S, BX - 3.4, .22, -1.6, 2.1, .36, 2.9, 0x8a5a36, { round: .04 }); addBox(S, BX - 3.4, .62, -1.6, 2.0, .34, 2.8, 0xf2f2f6, { round: .08 }); addBox(S, BX - 3.4, .6, -3.02, 2.2, 1.4, .1, 0x8a5a36); addBox(S, BX - 3.4, .82, -.8, 2.04, .1, 1.7, 0x4f7be0, { round: .05 });
    // window right
    addBox(S, BX + 3.6, 2.6, WALLZ + .02, 2.0, 1.5, .06, 0xffffff); addBox(S, BX + 3.6, 2.6, WALLZ + .06, 1.8, 1.3, .02, 0x9fd4ff, { mat: { emissive: 0x6aaee8, emissiveIntensity: .4 } }); addBox(S, BX + 3.6, 2.6, WALLZ + .08, .06, 1.3, .02, 0xffffff); addBox(S, BX + 3.6, 2.6, WALLZ + .08, 1.8, .06, .02, 0xffffff);
    { const p = cvs(256, 340, (g, w, h) => { g.fillStyle = '#1b1f3a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ff5fa8'; g.beginPath(); g.arc(128, 150, 70, 0, 7); g.fill(); g.fillStyle = '#ffd23a'; for (let i = 0; i < 8; i++) g.fillRect(30 + i * 26, 260, 14, 30 + (i * 37) % 50); txt(g, 'VIBES', 128, 40, 56, '#fff'); }); const pm = plane(1.0, 1.33, p.t, { transparent: false }); pm.position.set(BX - 3.4, 2.7, WALLZ + .03); S.add(pm); }
    // closet: frame, interior, rail, clothes
    const wood = 0xd9c7a3;
    addBox(S, CX, 3.15, CZ - .45, 2.9, .22, 1.1, wood, { round: .03 }); addBox(S, CX - 1.4, 1.6, CZ - .45, .2, 3.1, 1.1, wood, { round: .03 }); addBox(S, CX + 1.4, 1.6, CZ - .45, .2, 3.1, 1.1, wood, { round: .03 }); addBox(S, CX, .06, CZ - .45, 2.6, .12, 1.1, 0x6b4a30);
    addBox(S, CX, 1.6, WALLZ + .1, 2.6, 3.0, .08, 0x5a4a3c, { cast: false, mat: { emissive: 0x2a2018, emissiveIntensity: .5 } });
    addBox(S, CX, 2.7, CZ - .5, 2.5, .05, .05, 0xb8b8c0, { mat: { metalness: .8, roughness: .3 } });
    [[-.85, 0x4a78d8], [-.55, 0xe85a6a], [-.25, 0xf2d04a], [1.05, 0x8a5cd8], [1.4, 0xf2f2f6]].forEach(([dx, c]) => { if (Math.abs(CX + dx - CX) > 1.2) return; addBox(S, CX + dx - .05 * 0, 2.25, CZ - .5, .26, .9, .14, c, { round: .04 }); });
    closetLight = new THREE.PointLight(0xfff0d0, .9, 6); closetLight.position.set(CX, 2.4, CZ + .5); S.add(closetLight);
    const mkDoor = (hx, dir) => { const g = new THREE.Group(); g.position.set(hx, 0, CZ); S.add(g); const d = rbx(1.3, 2.95, .1, 0xf0e2c0, .03); d.position.set(dir * .65, 1.55, 0); g.add(d); const pan = rbx(1.0, 2.5, .04, 0xe4d3ad, .02); pan.position.set(dir * .65, 1.55, .06); g.add(pan); const kn = rbx(.12, .12, .1, 0x8a8a92, .05, { metalness: .8, roughness: .3 }); kn.position.set(dir * (1.3 - .2), 1.1, .12); g.add(kn); return g; };
    doorL = mkDoor(CX - 1.3, 1); doorR = mkDoor(CX + 1.3, -1);
    // padlock (hung on the knobs, between the doors)
    lockG = new THREE.Group(); { const body = rbx(.22, .2, .1, 0xffd23a, .04, { metalness: .6, roughness: .3 }); body.position.y = -.12; lockG.add(body); shackle = new THREE.Group(); shackle.position.set(-.07, -.02, 0); const sh = new THREE.Mesh(new THREE.TorusGeometry(.075, .02, 8, 16, Math.PI), mat(0xcdd3dc, { metalness: .9, roughness: .25 })); sh.position.x = .07; shackle.add(sh); lockG.add(shackle); const kh = new THREE.Mesh(new THREE.CircleGeometry(.025, 10), new THREE.MeshBasicMaterial({ color: 0x222222 })); kh.position.set(0, -.13, .055); lockG.add(kh); lockG.position.set(CX, 1.22, CZ + .13); S.add(lockG); lockG.visible = false; }
  }
  // ============================================================== SCHOOL HALLWAY
  { const cx = SCH; addBox(S, cx, -.05, .3, 11, .1, 8.4, 0xe9e2d0, { cast: false });
    const tile = cvs(256, 256, (g) => { g.fillStyle = '#e8e0cc'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#c9bd9c'; g.fillRect(0, 0, 128, 128); g.fillRect(128, 128, 128, 128); }); tile.t.wrapS = tile.t.wrapT = THREE.RepeatWrapping; tile.t.repeat.set(6, 4);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(11, 8.4), new THREE.MeshStandardMaterial({ map: tile.t, roughness: .5 })); fl.rotation.x = -Math.PI / 2; fl.position.set(cx, .01, .3); fl.receiveShadow = true; S.add(fl);
    addBox(S, cx, 2.1, WALLZ - .1, 11, 4.4, .2, 0xcfe0c8, { cast: false }); addBox(S, cx - 5.5, 2.1, .3, .2, 4.4, 8.4, 0xcfe0c8, { cast: false }); addBox(S, cx + 5.5, 2.1, .3, .2, 4.4, 8.4, 0xcfe0c8, { cast: false });
    const lc = [0x3b6fd0, 0x3b6fd0, 0x2f5db8, 0x3b6fd0, 0x2f5db8, 0x3b6fd0, 0x3b6fd0, 0x2f5db8];
    for (let i = 0; i < 8; i++) { const lx = cx - 4.55 + i * 1.3; const lk = rbx(1.2, 2.9, .5, lc[i], .04); lk.position.set(lx, 1.5, WALLZ + .3); S.add(lk); for (let j = 0; j < 3; j++) addBox(S, lx, 2.5 - j * .35, WALLZ + .56, .8, .05, .02, 0x1d3a78, { cast: false }); addBox(S, lx + .35, 1.2, WALLZ + .57, .08, .3, .04, 0xcfd3da); const nm = cvs(64, 64, (g) => txt(g, String(100 + i * 7), 32, 34, 30, '#fff')); const np = plane(.4, .4, nm.t); np.position.set(lx - .25, 2.75, WALLZ + .575); S.add(np); }
    const bn = cvs(1024, 160, (g, w, h) => { g.fillStyle = '#ffd23a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#111'; g.lineWidth = 10; g.strokeRect(6, 6, w - 12, h - 12); txt(g, 'SCHOOL', w / 2, 84, 110, '#1d3a78'); }); const bp = plane(5.4, .85, bn.t); bp.position.set(cx, 3.8, WALLZ + .02); S.add(bp);
    const ck = cvs(128, 128, (g) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 64, 58, 0, 7); g.fill(); g.strokeStyle = '#222'; g.lineWidth = 8; g.beginPath(); g.arc(64, 64, 58, 0, 7); g.stroke(); g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 28); g.moveTo(64, 64); g.lineTo(90, 72); g.stroke(); }); const cp = plane(.9, .9, ck.t); cp.position.set(cx + 4.3, 3.6, WALLZ + .02); S.add(cp); }
  // ============================================================== STORE
  const rackHoodies = [];
  { const cx = STO; addBox(S, cx, -.05, .3, 11, .1, 8.4, 0xd9cdb8, { cast: false }); addBox(S, cx, 2.1, WALLZ - .1, 11, 4.4, .2, 0xf2d8c8, { cast: false }); addBox(S, cx - 5.5, 2.1, .3, .2, 4.4, 8.4, 0xf2d8c8, { cast: false }); addBox(S, cx + 5.5, 2.1, .3, .2, 4.4, 8.4, 0xf2d8c8, { cast: false });
    addBox(S, cx, 1.3, WALLZ + .25, 10, .06, .6, 0xb08a5a, { cast: false }); addBox(S, cx, 2.5, WALLZ + .25, 10, .06, .6, 0xb08a5a, { cast: false });
    const hc = [0x3b6fd0, 0xe85a6a, 0xf2d04a, 0x8a5cd8, 0x2ecc71, 0xe67e22, 0x34495e, 0xff7aa2];
    for (let i = 0; i < 16; i++) { const row = i % 2, k = Math.floor(i / 2); const b = rbx(.7, .55, .3, hc[(i * 3) % 8], .08); b.position.set(cx - 4.2 + k * 1.2, 1.62 + row * 1.2, WALLZ + .3); S.add(b); }
    const sg = cvs(1024, 200, (g, w, h) => { g.fillStyle = '#e8262b'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ffe23a'; g.lineWidth = 12; g.strokeRect(10, 10, w - 20, h - 20); txt(g, 'HOODIE HUT', w / 2, 100, 120, '#fff', { stroke: '#111', sw: 16 }); }); const sp = plane(3.4, .66, sg.t); sp.position.set(cx, 3.7, WALLZ + .02); S.add(sp);
    // counter + register
    addBox(S, cx + .2, .6, -1.35, 5.2, 1.2, .9, 0xb08a5a, { round: .03 }); addBox(S, cx + .2, 1.23, -1.35, 5.4, .1, 1.05, 0xf4f1ea, { round: .02 });
    addBox(S, cx + 1.4, 1.5, -1.45, .8, .42, .6, 0x2a2e36, { round: .04 }); addBox(S, cx + 1.4, 1.78, -1.2, .6, .26, .06, 0x8fd0ff, { cast: false, mat: { emissive: 0x4a90c8, emissiveIntensity: .6 } }); }
  // ============================================================== AVATARS (Roblox style)
  const INK = '#15181d', MOUTH = '#c8242b', TONGUE = '#f08a8a';
  const paintFace = (g, f) => { g.clearRect(0, 0, 256, 192); const sk = f.skin || '#f2b98a';
    const dot = (x, y, r) => { g.fillStyle = INK; g.beginPath(); g.ellipse(x, y, r, r * 1.25, 0, 0, 7); g.fill(); };
    const arc = (x, y, r, w = 9) => { g.strokeStyle = INK; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.arc(x, y + r * .7, r, Math.PI * 1.12, Math.PI * 1.88); g.stroke(); };
    const brow = (x, y, rot, w = 38) => { g.strokeStyle = INK; g.lineWidth = 7; g.lineCap = 'round'; g.save(); g.translate(x, y); g.rotate(rot); g.beginPath(); g.moveTo(-w / 2, 0); g.lineTo(w / 2, 0); g.stroke(); g.restore(); };
    const closed = (x, y) => { g.strokeStyle = INK; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 17, y); g.quadraticCurveTo(x, y + 9, x + 17, y); g.stroke(); };
    const eye = (x, y, side) => { const e = f.blink ? 'closed' : f.eyes; if (e === 'dot') dot(x, y, 12); else if (e === 'wide') dot(x, y, 14.5); else if (e === 'flat') dot(x, y, 7.5); else if (e === 'arc') arc(x, y, 21); else if (e === 'closed') closed(x, y); else if (e === 'wink') { if (side < 0) dot(x, y, 12); else arc(x, y, 20); } else if (e === 'lid') { dot(x, y, 10); g.fillStyle = sk; g.fillRect(x - 16, y - 18, 32, 18); g.strokeStyle = INK; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 16, y); g.lineTo(x + 16, y); g.stroke(); } };
    eye(78, 86, -1); eye(178, 86, 1);
    if (f.brow) { const [a, b, y1, y2] = f.brow; brow(78, y1 ?? 56, a); brow(178, y2 ?? 56, b); }
    if (f.cheek) { g.fillStyle = 'rgba(255,120,120,.35)'; g.beginPath(); g.ellipse(48, 128, 20, 11, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(208, 128, 20, 11, 0, 0, 7); g.fill(); }
    const m = f.mouth; const cx = 128, cy = 142;
    if (m === 'D') { const w = f.mw || 96, h = 12 + (f.mh || 60) * (f.open ?? 1); g.fillStyle = MOUTH; g.beginPath(); g.moveTo(cx - w / 2, cy - h * .3); g.lineTo(cx + w / 2, cy - h * .3); g.quadraticCurveTo(cx + w / 2, cy + h * .8, cx, cy + h * .8); g.quadraticCurveTo(cx - w / 2, cy + h * .8, cx - w / 2, cy - h * .3); g.fill(); if (h > 40) { g.fillStyle = TONGUE; g.beginPath(); g.ellipse(cx, cy + h * .5, w * .24, h * .17, 0, 0, 7); g.fill(); } if (f.teeth) { g.fillStyle = '#fff'; g.fillRect(cx - w / 2 + 6, cy - h * .3, w - 12, Math.min(14, h * .25)); } }
    else if (m === 'smile') { g.strokeStyle = INK; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 28, cy); g.quadraticCurveTo(cx, cy + 22, cx + 28, cy); g.stroke(); }
    else if (m === 'smirk') { g.strokeStyle = INK; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(96, cy + 8); g.quadraticCurveTo(150, cy + 20, 176, cy - 8); g.stroke(); g.beginPath(); g.moveTo(176, cy - 8); g.lineTo(182, cy - 18); g.stroke(); }
    else if (m === 'o') { g.fillStyle = MOUTH; g.beginPath(); g.ellipse(cx, cy + 8, 20, 26, 0, 0, 7); g.fill(); }
    else if (m === 'flat') { g.strokeStyle = INK; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(100, cy + 6); g.lineTo(156, cy + 6); g.stroke(); }
    else if (m === 'frown') { g.strokeStyle = INK; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 26, cy + 24); g.quadraticCurveTo(cx, cy + 2, cx + 26, cy + 24); g.stroke(); }
    else if (m === 'grit') { g.fillStyle = '#fff'; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.roundRect(cx - 40, cy - 2, 80, 30, 8); g.fill(); g.stroke(); g.beginPath(); g.moveTo(cx - 20, cy - 2); g.lineTo(cx - 20, cy + 28); g.moveTo(cx, cy - 2); g.lineTo(cx, cy + 28); g.moveTo(cx + 20, cy - 2); g.lineTo(cx + 20, cy + 28); g.stroke(); }
    if (f.tear) { g.fillStyle = '#7fc8ff'; g.beginPath(); g.ellipse(214, 118, 7, 12, 0, 0, 7); g.fill(); }
    if (f.sweat) { g.fillStyle = '#9fd8ff'; g.beginPath(); g.ellipse(220, 40, 9, 15, 0, 0, 7); g.fill(); } };
  // named expressions (mouth 'D' takes the lip-sync open amount)
  const FX = { grin: { eyes: 'arc', mouth: 'D', mw: 100, mh: 62, cheek: 1 }, talk: { eyes: 'dot', mouth: 'D', mw: 72, mh: 46 }, smug: { eyes: 'lid', mouth: 'smirk', brow: [-.1, .35, 58, 46] }, smugD: { eyes: 'lid', mouth: 'D', mw: 84, mh: 46, brow: [-.1, .3, 58, 46], teeth: 1 }, devil: { eyes: 'dot', mouth: 'D', mw: 104, mh: 58, brow: [.35, -.35, 52, 52], teeth: 1 }, neutral: { eyes: 'dot', mouth: 'smile' }, shock: { eyes: 'wide', mouth: 'o', brow: [-.15, .15, 44, 44] }, shockD: { eyes: 'wide', mouth: 'D', mw: 64, mh: 64, brow: [-.15, .15, 44, 44] }, wink: { eyes: 'wink', mouth: 'smile', brow: [-.1, 0, 56, 56] }, deadpan: { eyes: 'flat', mouth: 'flat', brow: [0, 0, 64, 64] }, sad: { eyes: 'dot', mouth: 'frown', brow: [-.4, .4, 62, 62], tear: 1 }, angry: { eyes: 'dot', mouth: 'grit', brow: [.4, -.4, 56, 56] }, proud: { eyes: 'arc', mouth: 'D', mw: 70, mh: 44 }, grit: { eyes: 'dot', mouth: 'grit', brow: [.25, -.25, 54, 54], sweat: 1 }, scrunch: { eyes: 'flat', mouth: 'frown', brow: [.3, -.3, 58, 58] } };
  const AVS = [];
  const makeAv = (o) => {
    const k = o.k ?? .25; const root = new THREE.Group(); S.add(root); const body = new THREE.Group(); body.scale.setScalar(k); root.add(body);
    const sk = o.skin ?? 0xf2b98a; const skinC = '#' + new THREE.Color(sk).getHexString(); const av = { k, root, body, o, s: null, faceKey: '', hs: o.hs ?? 1 };
    const mkLeg = (x) => { const g = new THREE.Group(); g.position.set(x, 1.9, 0); body.add(g); const l = rbx(.92, 1.9, .92, o.pants ?? 0x394a6b, .1); l.position.y = -.95; g.add(l); const sh = rbx(.98, .36, 1.2, o.shoes ?? 0x23262d, .14); sh.position.set(0, -1.72, .12); g.add(sh); return g; };
    av.legL = mkLeg(.5); av.legR = mkLeg(-.5);
    av.tor = new THREE.Group(); av.tor.position.y = 1.9; body.add(av.tor);
    const tm = rbx(2.0, 2.0, 1.0, o.shirt ?? 0xf2f2f6, .16); tm.position.y = 1.0; av.tor.add(tm); av.torMesh = tm;
    const neck = rbx(.7, .3, .7, sk, .08); neck.position.y = 2.1; av.tor.add(neck);
    const mkArm = (x, sgn) => { const g = new THREE.Group(); g.position.set(x, 1.9, 0); av.tor.add(g); const a = rbx(.9, 1.5, .9, o.shirt ?? 0xf2f2f6, .14); a.position.y = -.75 + .1; g.add(a); const h = rbx(.88, .55, .88, sk, .14); h.position.y = -1.55; g.add(h); const anc = new THREE.Object3D(); anc.position.set(0, -1.7, 0); g.add(anc); g.userData.anc = anc; g.userData.sleeveBase = a; return g; };
    av.armL = mkArm(1.45, 1); av.armR = mkArm(-1.45, -1);
    av.head = new THREE.Group(); av.head.position.y = 3.45; av.tor.add(av.head);
    const hm = rbx(2.7, 2.5, 2.3, sk, 1.0); av.head.add(hm);
    av.fc = cvs(256, 192, () => {}); av.fc.skinC = skinC; const fp = plane(2.25, 1.69, av.fc.t); fp.position.set(0, -.1, 1.165 + .01); av.head.add(fp); av.facePlane = fp;
    // hair
    const hc = o.hair ?? 0x2b1d14; if (o.hairStyle !== 'none') { const cap = rbx(2.86, .95, 2.55, hc, .42); cap.position.set(0, 1.0, -.08); av.head.add(cap); const back = rbx(2.8, 1.8, .7, hc, .3); back.position.set(0, .1, -1.0); av.head.add(back); }
    if (o.hairStyle === 'pigtails') { for (const sx of [-1, 1]) { const pt = rbx(.75, 1.7, .75, hc, .3); pt.position.set(sx * 1.78, -.1, -.45); pt.rotation.z = -sx * .28; av.head.add(pt); const band = rbx(.82, .26, .82, 0xff4f9a, .1); band.position.set(sx * 1.52, .72, -.45); band.rotation.z = -sx * .28; av.head.add(band); const bow = rbx(.5, .3, .3, 0xff4f9a, .1); bow.position.set(sx * 1.55, 1.0, -.1); av.head.add(bow); } }
    if (o.cap) { const cp = rbx(2.95, .95, 2.65, o.cap, .4); cp.position.set(0, 1.12, -.05); av.head.add(cp); const br = rbx(2.0, .16, 1.0, o.cap, .06); br.position.set(0, .66, 1.55); av.head.add(br); }
    // outfit: hoodie / blazer / apron overlay
    const om = mat(0x3fa05a, { roughness: .6 }); av.om = om;
    av.hT = rbx(2.22, 2.1, 1.22, 0x3fa05a, .2); av.hT.material = om; av.tor.add(av.hT);
    av.hSL = rbx(1.06, 1.6, 1.06, 0x3fa05a, .16); av.hSL.material = om; av.armL.add(av.hSL); av.hSR = rbx(1.06, 1.6, 1.06, 0x3fa05a, .16); av.hSR.material = om; av.armR.add(av.hSR);
    av.hood = rbx(1.9, .95, .8, 0x3fa05a, .3); av.hood.material = om; av.hood.position.set(0, 2.25, -.62); av.tor.add(av.hood);
    av.pocket = rbx(1.3, .45, .06, 0x358f4e, .04); av.pocket.position.set(0, .62, .64); av.tor.add(av.pocket);
    av.strL = rbx(.08, .6, .05, 0xffffff, .02); av.strL.position.set(.32, 1.62, .64); av.tor.add(av.strL); av.strR = rbx(.08, .6, .05, 0xffffff, .02); av.strR.position.set(-.32, 1.62, .64); av.tor.add(av.strR);
    av.pc = cvs(256, 256, () => {}); av.pc.key = ''; av.print = plane(1.7, 1.7, av.pc.t); av.print.position.set(0, 1.18, .645); av.tor.add(av.print);
    if (o.glasses) { for (const sx of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.34, .06, 8, 18), mat(0x15171b)); r.position.set(sx * .85, .15, 1.2); av.head.add(r); } const br = rbx(.5, .07, .07, 0x15171b, .02); br.position.set(0, .2, 1.2); av.head.add(br); av.glasses = true; }
    AVS.push(av); return av;
  };
  const PRINTS = { sister: (g) => { txt(g, 'LITTLE', 128, 92, 70, '#ffe14a', { stroke: '#1d4a2a', sw: 10 }); txt(g, 'SISTER', 128, 172, 70, '#ffe14a', { stroke: '#1d4a2a', sw: 10 }); }, kids: (g) => { txt(g, 'KIDS', 128, 100, 84, '#fff'); txt(g, 'AGE 6', 128, 176, 44, '#ffe9f2'); }, tie: (g) => { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(40, 0); g.lineTo(128, 130); g.lineTo(216, 0); g.fill(); g.fillStyle = '#c8242b'; g.beginPath(); g.moveTo(112, 40); g.lineTo(144, 40); g.lineTo(156, 210); g.lineTo(128, 236); g.lineTo(100, 210); g.fill(); g.fillStyle = '#0d1c3a'; g.beginPath(); g.moveTo(0, 0); g.lineTo(34, 0); g.lineTo(104, 160); g.lineTo(40, 256); g.lineTo(0, 256); g.fill(); g.beginPath(); g.moveTo(256, 0); g.lineTo(222, 0); g.lineTo(152, 160); g.lineTo(216, 256); g.lineTo(256, 256); g.fill(); }, apron: (g) => { txt(g, 'HOODIE', 128, 92, 62, '#fff'); txt(g, 'HUT', 128, 168, 80, '#ffe23a'); } };
  // spec: { color, len, w, slv, print, hood, pocket } or null
  const hoodieMeshes = (av) => [av.hT, av.hSL, av.hSR, av.hood, av.pocket, av.strL, av.strR, av.print];
  const outfitProto = {
    setOutfit(spec) { const on = !!spec; hoodieMeshes(this).forEach((m) => { m.visible = on; }); if (!on) return; this.om.color.set(spec.color); const len = spec.len ?? 1, w = spec.w ?? 1, sl = spec.slv ?? 1;
      this.hT.scale.set(w, len, 1); this.hT.position.y = 2.08 - 1.05 * len; this.hSL.scale.set(w > 1 ? 1 : w < 1 ? .92 : 1, sl, 1); this.hSR.scale.copy(this.hSL.scale); this.hSL.position.y = .12 - .8 * sl; this.hSR.position.y = this.hSL.position.y;
      this.hood.visible = spec.hood !== false; this.pocket.visible = spec.pocket !== false && len > .8; this.strL.visible = this.strR.visible = spec.hood !== false;
      this.pocket.position.y = 2.08 - 2.1 * len + .55 * Math.min(1, len); this.pocket.material.color.set(spec.pocketColor ?? 0x358f4e);
      const key = spec.print || ''; if (this.pc.key !== key) { this.pc.key = key; const g = this.pc.g; g.clearRect(0, 0, 256, 256); if (key) PRINTS[key](g); this.pc.t.needsUpdate = true; } this.print.visible = !!key; this.print.position.y = key === 'tie' ? 1.2 : 1.18 + (len < .8 ? -.1 : 0); this.print.position.z = .645 + (len > 1 ? .0 : 0); this.print.scale.setScalar(key === 'tie' ? 1.15 : 1); },
    face(spec, t, talk = 0) { const f = typeof spec === 'string' ? FX[spec] : spec; const blink = ((t * .31 + this.o.ph) % 1) > .965; let open = 1, mouth = f.mouth; if (mouth === 'D' || (talk > 0 && (mouth === 'smile' || mouth === 'smirk' || mouth === 'flat'))) { if (talk > 0) { open = Math.max(.12, Math.round(talk * 4) / 4); mouth = 'D'; } else if (f.mouth !== 'D') open = 1; else open = f.open ?? 1; } const key = `${f.eyes}|${blink ? 1 : 0}|${mouth}|${Math.round(open * 4)}|${(f.brow || []).join(',')}|${f.cheek || 0}|${f.teeth || 0}|${f.tear || 0}|${f.sweat || 0}|${f.mw || 0}|${mouth !== f.mouth ? 'T' : ''}`; if (key === this.faceKey) return; this.faceKey = key; paintFace(this.fc.g, Object.assign({}, f, { blink, mouth, open: (talk > 0 || f.mouth === 'D') ? open : 1, skin: this.fc.skinC, mw: talk > 0 && f.mouth !== 'D' ? 72 : f.mw, mh: talk > 0 && f.mouth !== 'D' ? 46 : f.mh })); this.fc.t.needsUpdate = true; },
  };
  const newAv = (o) => { o.ph = o.ph ?? (AVS.length * .37 + .11); const av = makeAv(o); Object.assign(av, outfitProto); av.setOutfit(null); return av; };
  // pose + animation -----------------------------------------------------
  const reset = (av) => { av.s = { x: 0, y: 0, z: 0, yaw: 0, walk: 0, ph: 0, aL: null, aR: null, pitch: 0, nod: 0, hyaw: 0, tilt: 0, roll: 0, vis: true, sq: 1, lean: 0 }; };
  const finalize = (av, t) => { const s = av.s; av.root.visible = s.vis; av.root.position.set(s.x, s.y, s.z); av.root.rotation.set(0, s.yaw, s.roll); const sw = Math.sin(s.ph); av.legL.rotation.x = sw * .75 * s.walk; av.legR.rotation.x = -sw * .75 * s.walk;
    const bob = s.walk ? Math.abs(Math.cos(s.ph)) * .06 : Math.sin(t * 2.1 + av.o.ph * 6) * .02; av.tor.position.y = 1.9 + bob; av.tor.rotation.set(s.pitch, 0, s.lean);
    const dL = s.aL || [-sw * .6 * s.walk + Math.sin(t * 1.7 + av.o.ph * 3) * .05, .1], dR = s.aR || [sw * .6 * s.walk - Math.sin(t * 1.7 + av.o.ph * 3) * .05, .1];
    av.armL.rotation.set(dL[0], 0, dL[1]); av.armR.rotation.set(dR[0], 0, -dR[1]); av.head.rotation.set(s.nod, s.hyaw, s.tilt); av.head.scale.setScalar(av.hs); av.head.position.y = 3.45 + (av.hs - 1) * 1.25; av.root.scale.set(1, s.sq, 1); };
  const anc = (av, side) => (side === 'L' ? av.armL : av.armR).userData.anc;
  const hold = (prop, av, side, off = [0, 0, 0], rot = [0, 0, 0], sc = 1) => { const a = anc(av, side); if (prop.parent !== a) a.add(prop); prop.position.set(off[0] / av.k, off[1] / av.k, off[2] / av.k); prop.rotation.set(rot[0], rot[1], rot[2]); prop.scale.setScalar(sc / av.k); prop.visible = true; };
  const free = (prop, x, y, z, rx = 0, ry = 0, rz = 0, sc = 1) => { if (prop.parent !== S) S.add(prop); prop.position.set(x, y, z); prop.rotation.set(rx, ry, rz); prop.scale.setScalar(sc); prop.visible = true; };
  // ---------------------------------------------------------------- props
  const mkHoodieProp = (color, print) => { const g = new THREE.Group(); const m = mat(color, { roughness: .6 }); const bd = rbx(.5, .58, .1, color, .05); bd.material = m; bd.position.y = -.36; g.add(bd); for (const sx of [-1, 1]) { const sl = rbx(.16, .5, .1, color, .05); sl.material = m; sl.position.set(sx * .3, -.3, 0); sl.rotation.z = sx * .35; g.add(sl); } const hd = rbx(.3, .13, .1, color, .05); hd.material = m; hd.position.set(0, -.04, -.02); g.add(hd); const hk = new THREE.Mesh(new THREE.TorusGeometry(.04, .01, 6, 10, Math.PI * 1.5), mat(0xb8b8c0, { metalness: .8 })); hk.position.y = .03; g.add(hk); if (print) { const c = cvs(256, 256, (gg) => PRINTS[print](gg)); const p = plane(.36, .36, c.t); p.position.set(0, -.36, .056); g.add(p); } g.traverse((q) => { q.castShadow = true; }); g.visible = false; S.add(g); return g; };
  const hoodieG = mkHoodieProp(0x3fa05a, null);
  const pinkG = mkHoodieProp(0xff7aa8, 'kids'); { const tag = cvs(128, 64, (g) => { g.fillStyle = '#fff'; g.fillRect(0, 0, 128, 64); g.strokeStyle = '#e8262b'; g.lineWidth = 6; g.strokeRect(3, 3, 122, 58); txt(g, '$29', 64, 34, 40, '#e8262b'); }); const tg = plane(.16, .08, tag.t, { side: THREE.DoubleSide }); tg.position.set(.28, -.6, .06); tg.rotation.z = .3; pinkG.add(tg); }
  const mkPaper = (w, h, draw, pw = 512) => { const ph = Math.round(pw * h / w); const q = cvs(pw, ph, (g, ww, hh) => draw(g, ww, hh)); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: q.t, side: THREE.DoubleSide })); const g = new THREE.Group(); g.add(m); g.visible = false; S.add(g); return g; };
  const mapG = mkPaper(.5, .62, (g, w, h) => { g.fillStyle = '#f0dcaa'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8a6a3a'; g.lineWidth = 10; g.strokeRect(8, 8, w - 16, h - 16); txt(g, 'TREASURE MAP', w / 2, 62, 58, '#6a4a22'); g.strokeStyle = '#6a4a22'; g.lineWidth = 6; g.strokeRect(80, 130, 180, 150); g.fillStyle = '#c9a66a'; g.fillRect(84, 134, 172, 142); g.beginPath(); g.moveTo(170, 134); g.lineTo(170, 276); g.stroke(); txt(g, 'CLOSET', 170, 306, 38, '#6a4a22'); g.setLineDash([14, 12]); g.strokeStyle = '#2a7ad8'; g.lineWidth = 8; g.beginPath(); g.moveTo(60, 560); g.quadraticCurveTo(300, 520, 330, 440); g.quadraticCurveTo(360, 380, 250, 340); g.stroke(); g.setLineDash([]); g.strokeStyle = '#d4181f'; g.lineWidth = 26; g.lineCap = 'round'; g.beginPath(); g.moveTo(130, 160); g.lineTo(210, 250); g.moveTo(210, 160); g.lineTo(130, 250); g.stroke(); txt(g, 'YOU ARE HERE', 130, 520, 30, '#6a4a22'); g.fillStyle = '#3b6fd0'; g.beginPath(); g.arc(60, 560, 14, 0, 7); g.fill(); }, 640);
  const slipG = mkPaper(.6, .8, (g, w, h) => { g.fillStyle = '#fffdf3'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8242b'; g.fillRect(0, 0, w, 120); txt(g, 'PERMISSION', w / 2, 56, 84, '#fff'); txt(g, 'SLIP', w / 2, 104, 64, '#fff'); txt(g, 'The bearer of this slip', w / 2, 200, 40, '#222', { w: 700 }); txt(g, 'is my LAWYER.', w / 2, 270, 62, '#c8242b'); txt(g, 'Please release the hoodie.', w / 2, 350, 40, '#222', { w: 700 }); g.strokeStyle = '#333'; g.lineWidth = 4; g.beginPath(); g.moveTo(60, 470); g.lineTo(330, 470); g.stroke(); txt(g, 'signed: ME (11)', 190, 505, 34, '#333', { w: 700 }); g.save(); g.translate(400, 600); g.rotate(-.3); g.strokeStyle = '#2a7ad8'; g.lineWidth = 8; g.strokeRect(-110, -44, 220, 88); txt(g, 'APPROVED', 0, 4, 42, '#2a7ad8'); g.restore(); }, 512);
  const receiptG = mkPaper(.42, .72, (g, w, h) => { g.fillStyle = '#fffef6'; g.fillRect(0, 0, w, h); txt(g, 'HOODIE HUT', w / 2, 56, 56, '#222'); txt(g, 'RETURN SLIP', w / 2, 112, 42, '#555', { w: 700 }); g.fillStyle = '#999'; for (let i = 0; i < 20; i++) g.fillRect(24 + i * 18, 140, 10, 4); txt(g, 'pink hoodie  -$29', w / 2, 200, 32, '#222', { w: 700 }); txt(g, 'WRONG SHADE', w / 2, 260, 36, '#c8242b'); txt(g, 'EXCHANGE FOR:', w / 2, 360, 36, '#222', { w: 700 }); txt(g, 'YOUR', w / 2, 430, 76, '#c8242b'); txt(g, 'HOODIE', w / 2, 510, 76, '#c8242b'); }, 384);
  const bcG = new THREE.Group(); { const bc = rbx(.5, .34, .12, 0x6b3b1e, .03); bcG.add(bc); const hn = new THREE.Mesh(new THREE.TorusGeometry(.07, .014, 6, 12, Math.PI), mat(0x222222)); hn.position.y = .17; bcG.add(hn); const lk = rbx(.08, .04, .02, 0xffd23a, .01); lk.position.set(0, .06, .07); bcG.add(lk); bcG.visible = false; S.add(bcG); }
  const clipG = new THREE.Group(); { const c1 = rbx(.2, .035, .03, 0xff4f9a, .01, { metalness: .5 }); clipG.add(c1); const c2 = rbx(.16, .02, .02, 0xcdd3dc, .01, { metalness: .9, roughness: .2 }); c2.position.set(.06, -.03, 0); clipG.add(c2); clipG.visible = false; S.add(clipG); }
  const badge = cvs(256, 256, (g) => { g.translate(128, 128); g.fillStyle = '#ff3b6b'; for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.fillRect(-14, -126, 28, 60); } g.fillStyle = '#ff3b6b'; g.beginPath(); g.arc(0, 0, 100, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 80, 0, 7); g.fill(); g.setTransform(1, 0, 0, 1, 0, 0); txt(g, '11', 128, 140, 120, '#ff3b6b'); }); const badgeM = plane(.7, .7, badge.t, { alphaTest: .2 }); badgeM.visible = false; S.add(badgeM);
  const stampG = cvs(512, 160, (g, w, h) => { g.strokeStyle = '#c8242b'; g.lineWidth = 14; g.strokeRect(10, 10, w - 20, h - 20); txt(g, 'RETURNED', w / 2, 84, 100, '#c8242b'); }); const stampM = plane(1.0, .31, stampG.t); stampM.visible = false; S.add(stampM);
  const clickG = new THREE.Group(); const sparks = []; for (let i = 0; i < 8; i++) { const s = new THREE.Mesh(new THREE.OctahedronGeometry(.04, 0), new THREE.MeshBasicMaterial({ color: 0xffe266 })); s.visible = false; S.add(s); sparks.push(s); }
  // ---------------------------------------------------------------- cast
  const YOU = newAv({ k: .25, skin: 0xf2b98a, hair: 0x2b1d14, shirt: 0xf2f2f6, pants: 0x394a6b, ph: .1 });
  const SIS = newAv({ k: .2, skin: 0xf6c9a0, hair: 0x7a4420, shirt: 0xff7ac2, pants: 0x6a4fd0, hairStyle: 'pigtails', hs: 1.16, ph: .55, glasses: false });
  const CLK = newAv({ k: .25, skin: 0xc68642, hair: 0x15110d, shirt: 0xe8262b, pants: 0x2a2e36, cap: 0xe8262b, ph: .8 });
  // sister's lawyer glasses (toggle)
  const lawGl = new THREE.Group(); for (const sx of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.4, .07, 8, 18), mat(0x15171b)); r.position.set(sx * .85, -.05, 1.24); lawGl.add(r); } { const br = rbx(.5, .08, .08, 0x15171b, .02); br.position.set(0, -.02, 1.24); lawGl.add(br); } SIS.head.add(lawGl);
  // ---------------------------------------------------------------- helpers: talking + camera
  const tAmt = (bi, lt, off = 0) => { const W = tl.beats[bi].words; for (let i = 0; i < W.length; i++) { if (lt >= W[i][1] + off && lt <= W[i][2] + off) return .3 + .7 * (.5 + .5 * Math.sin(lt * 21 + i * 1.7)); } return 0; };
  const E = new THREE.Vector3(), T2 = new THREE.Vector3();
  const rig = (lt, shots, t) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    E.set(lerp(s[1][0], s[2][0], u), lerp(s[1][1], s[2][1], u), lerp(s[1][2], s[2][2], u)); T2.set(lerp(s[3][0], s[4][0], u), lerp(s[3][1], s[4][1], u), lerp(s[3][2], s[4][2], u)); E.x += Math.sin(t * .9) * .02; E.y += Math.sin(t * 1.3 + 1) * .02; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .006); };
  const D = (x, y, z) => [x, y, z];
  const lp = (a, b, u) => a + (b - a) * clamp(u);
  const walkTo = (av, x0, z0, x1, z1, u, spd = 1) => { const uu = clamp(u); av.s.x = lerp(x0, x1, uu); av.s.z = lerp(z0, z1, uu); if (uu > 0 && uu < 1) { av.s.walk = 1 * spd; av.s.ph = (uu * 9 * Math.hypot(x1 - x0, z1 - z0) / 3) * 3.2 + 0; } };
  // ================================================================= frame
  const inner = ({ t, bi, lt }) => {
    bi = Math.min(bi, 5); reset(YOU); reset(SIS); reset(CLK); CLK.s.vis = false;
    let zone = BX, counter = ['', '', '', false], popTxt = '', popA = 1; let youF = 'neutral', sisF = 'grin', clkF = 'deadpan';
    let youTalk = 0, sisTalk = tAmt(bi, lt), clkTalk = 0;
    YOU.setOutfit(null); SIS.setOutfit(null); lawGl.visible = false; hoodieG.visible = pinkG.visible = false; mapG.visible = slipG.visible = receiptG.visible = bcG.visible = clipG.visible = badgeM.visible = stampM.visible = false; lockG.visible = false;
    let doorOpen = 0; sparks.forEach((s) => { s.visible = false; });
    const G = { color: 0x3fa05a, len: 1.25, w: 1.18, slv: 1.18, print: null };
    const sisHood = (p = null) => SIS.setOutfit({ color: 0x3fa05a, len: 1.42, w: 1.12, slv: 1.45, print: p });
    // -------------------------------------------------------------- beat 0: borrowing -> closet
    if (bi === 0) {
      zone = BX; counter = ['BORROWED', 'x 7', lt > 3.7 ? 'hoodie: in the closet' : 'this month', false];
      const run = ramp(lt, .0, 1.1);
      YOU.s.x = -1.1; YOU.s.z = -.2; YOU.s.yaw = .25;
      if (lt < 2.35) { sisHood();
        if (lt < 1.2) { walkTo(SIS, 4.6, -.1, 1.3, -.2, run, 1.15); SIS.s.yaw = -1.0 + .9 * run; SIS.s.aL = [-.6 * Math.sin(SIS.s.ph), .3]; SIS.s.aR = [.6 * Math.sin(SIS.s.ph), .3]; }
        else { SIS.s.x = 1.3; SIS.s.z = -.2; SIS.s.yaw = -.15 + Math.sin(lt * 6) * .25; SIS.s.aL = [-.2, 1.15]; SIS.s.aR = [-.2, 1.15]; SIS.s.y = Math.abs(Math.sin((lt - 1.2) * 7)) * .1; }
        sisF = 'grin'; youF = lt > 1.5 ? 'angry' : 'deadpan'; if (lt > 1.5) { YOU.s.aL = [-.2, 1.1]; YOU.s.aR = [-2.5 + Math.sin(lt * 14) * .15, .3]; } YOU.s.yaw = .5;
        if (lt > 1.6 && lt < 2.3) { popTxt = 'AGAIN?!'; popA = clamp((lt - 1.6) * 8) * (1 - ramp(lt, 2.1, 2.3)); }
        hoodieG.visible = false; }
      else {
        // you take it back: hoodie flies sister -> you, then you hide it
        const fly = ramp(lt, 2.3, 2.75); sisF = 'smug'; SIS.s.x = 1.3; SIS.s.z = -.2; SIS.s.yaw = -.35; SIS.s.aL = [-.3, .5]; SIS.s.aR = [-.3, .5];
        const toCl = ramp(lt, 2.75, 3.3), open = ramp(lt, 3.1, 3.4), put = ramp(lt, 3.35, 3.55), shut = ramp(lt, 3.6, 3.95);
        YOU.s.x = lerp(-1.1, CX - .2, toCl); YOU.s.z = lerp(-.2, -1.6, toCl); YOU.s.yaw = lerp(.5, 0, toCl); if (toCl < 1 && toCl > 0) { YOU.s.walk = 1; YOU.s.ph = lt * 9; } youF = lt > 3.5 ? 'smug' : 'angry';
        YOU.s.aR = [-1.1 - .5 * open, .15]; YOU.s.aL = [-.2, .2]; if (lt > 3.3) YOU.s.aR = [-1.35, .1];
        doorOpen = lt < 3.1 ? 0 : lt < 3.6 ? open * 1.7 : 1.7 * (1 - shut);
        if (lt < 2.75) { const p0 = V3(1.3, .9, -.1), p1 = V3(-.9, 1.05, -.1); free(hoodieG, lerp(p0.x, p1.x, fly), lerp(p0.y, p1.y, fly) + Math.sin(fly * Math.PI) * .6, -.1, 0, 0, fly * 6, 1.4); }
        else if (lt < 3.4) hold(hoodieG, YOU, 'R', [0, .12, .05], [0, 0, 0], 1.4);
        else free(hoodieG, CX, 2.62, -2.9, 0, 0, 0, 1.5);
        if (lt >= 2.75) { /* sister creeps toward closet, peeking, big grin */ const pe = ramp(lt, 2.8, 3.6); SIS.s.x = lerp(1.3, 1.15, pe); SIS.s.z = lerp(-.2, -.55, pe); SIS.s.yaw = lerp(-.35, -.3, pe); SIS.s.tilt = .22 * pe; SIS.s.aL = [-.5, .9]; SIS.s.aR = [-.2, .3]; if (pe > 0 && pe < 1) { SIS.s.walk = .6; SIS.s.ph = lt * 8; } sisF = 'devil'; }
        if (lt > 3.5 && lt < 4.4) { popTxt = 'HIDDEN!'; popA = clamp((lt - 3.5) * 6) * (1 - ramp(lt, 4.2, 4.4)); }
      }
    }
    // -------------------------------------------------------------- beat 1: found in four seconds (map)
    if (bi === 1) {
      zone = BX; const secs = clamp((lt - .95) / (2.66 - .95)) * 4.0; counter = ['STOPWATCH', secs.toFixed(1) + ' SEC', lt > 2.66 ? 'FOUND IT' : 'searching...', lt > 2.66];
      hoodieG.visible = false; YOU.s.x = -1.0; YOU.s.z = -1.3; YOU.s.yaw = .3; youF = lt < 2.7 ? 'smug' : 'shock'; YOU.s.aL = [-.5, .4]; YOU.s.aR = [-1.0, .3]; if (lt > 2.7) { YOU.s.aL = [-2.4, .3]; YOU.s.aR = [-2.4, .3]; YOU.s.nod = -.1; }
      if (lt < .9) { popTxt = lt > .1 ? 'CLEVER!' : ''; popA = clamp((lt - .12) * 6) * (1 - ramp(lt, .6, .9)); }
      const run = ramp(lt, .6, 1.9); const open = ramp(lt, 2.0, 2.45);
      doorOpen = lt < 2.0 ? 0 : 1.6 * open;
      if (lt < 2.5) { walkTo(SIS, 4.4, -.4, CX + 1.2, -1.5, run, 1.1); SIS.s.yaw = lerp(-1.4, -.4, run); SIS.s.aR = [-2.0, .4]; SIS.s.aL = [-.5 * Math.sin(SIS.s.ph), .3]; sisF = 'smug'; hold(mapG, SIS, 'R', [0, .22, .05], [0, 0, 0], 1.0); if (lt > 1.9) { SIS.s.x = CX + 1.2; SIS.s.z = -1.5; SIS.s.walk = 0; SIS.s.aR = [-2.9 + .2 * Math.sin(lt * 20), .3]; SIS.s.aL = [-1.4, .5]; } }
      else { const f2 = ramp(lt, 2.5, 3.1); SIS.s.x = lerp(CX + 1.2, .9, f2); SIS.s.z = lerp(-1.5, -.5, f2); SIS.s.yaw = lerp(-.4, 0, f2); SIS.s.aL = [-.5, 1.0]; SIS.s.aR = [-2.6, .75]; sisF = 'devil'; const sc = lerp(1, 2.3, ramp(lt, 3.1, 3.5)); hold(mapG, SIS, 'R', [-.12 * sc, .28 + .1 * sc, .1], [0, 0, -.12], sc); }
      if (lt > 2.1 && lt < 3.0) { const p = V3(CX, 1.85, CZ - .35); free(hoodieG, CX, 2.62 - ramp(lt, 2.3, 2.7) * .2, -2.9, 0, 0, 0, 1.5); hoodieG.visible = lt < 2.75; }
      if (lt > 2.66 && lt < 3.4) { popTxt = 'FOUND IT'; popA = clamp((lt - 2.66) * 8) * (1 - ramp(lt, 3.2, 3.4)); }
    }
    // -------------------------------------------------------------- beat 2: lock + hair clip + eleven
    if (bi === 2) {
      zone = BX; const click = lt >= 4.62; counter = ['CLOSET LOCK', click ? 'PICKED' : lt < .9 ? 'OPEN' : 'LOCKED', click ? 'tool: hair clip' : lt < .9 ? '' : 'padlock: $12', click];
      doorOpen = lt < .3 ? 1.1 * (1 - ramp(lt, .0, .3)) : 0; if (lt < .3) { /* doors closing from the end of last beat */ }
      lockG.visible = lt > .55; { const dr = ramp(lt, .55, .9); lockG.position.set(CX, 1.22 + (1 - dr) * .1, CZ + .13); shackle.rotation.z = click ? lerp(0, 1.0, ramp(lt, 4.62, 4.8)) : 0; shackle.position.y = click ? -.02 + .05 * ramp(lt, 4.62, 4.8) : -.02; }
      hoodieG.visible = false;
      YOU.s.x = -.7; YOU.s.z = -1.55; YOU.s.yaw = lerp(.1, .15, ramp(lt, 1, 2)); YOU.s.aR = [-1.2 - .1 * Math.sin(lt * 30), .2]; YOU.s.aL = [-.2, .2];
      if (lt > 1.2) { YOU.s.aR = [-1.1, .5]; YOU.s.aL = [-.3, .4]; YOU.s.yaw = .35; } if (lt > 1.9 && lt < 3.2) { YOU.s.aR = [-2.9, .2]; YOU.s.aL = [-.4, .5]; } youF = lt < 1.2 ? 'grit' : lt < 3.4 ? 'grin' : lt < 5.1 ? 'shock' : 'deadpan'; if (lt >= 3.4) { YOU.s.aL = [-2.4, .3]; YOU.s.aR = [-2.4, .3]; }
      if (lt > 1.9 && lt < 3.0) { popTxt = 'MUCH BETTER!'; popA = clamp((lt - 1.9) * 6) * (1 - ramp(lt, 2.75, 3.0)); }
      // sister: arrives at ~1.3, crouches at lock, picks it
      const arr = ramp(lt, 1.0, 2.7);
      const atLock = lt > 3.0;
      if (!atLock) { walkTo(SIS, 4.6, -.2, 1.55, -1.2, arr, 1.0); SIS.s.yaw = lerp(-1.2, -.5, arr); sisF = 'smug'; SIS.s.aL = [-.3, .3]; SIS.s.aR = [-.3, .3]; }
      else { SIS.s.x = 1.0; SIS.s.z = -1.95; SIS.s.yaw = -.62; SIS.s.pitch = .12; SIS.s.y = 0; SIS.s.aR = [-1.55 + .12 * Math.sin(lt * 26), .6]; SIS.s.aL = [-.3, .3]; sisF = lt < 5.4 ? 'devil' : 'grin'; }
      if (lt >= 3.0 && lt < 5.5) { hold(clipG, SIS, 'R', [0, .06, .04], [0, .6, 0.1], 1.0); clipG.visible = true; }
      if (lt > 4.62 && lt < 5.4) { popTxt = 'CLICK!'; popA = clamp((lt - 4.62) * 8) * (1 - ramp(lt, 5.2, 5.4)); sparks.forEach((s, i) => { const u = clamp((lt - 4.62) / .5); s.visible = u < 1; const a = i / 8 * 6.28; s.position.set(CX + Math.cos(a) * u * .35, 1.12 + Math.sin(a) * u * .35, CZ + .3); s.scale.setScalar(1 - u); }); }
      if (lt > 5.45) { const bu = ramp(lt, 5.45, 5.85); badgeM.visible = true; badgeM.position.set(.7, 1.35 + bu * .1, -.8); badgeM.scale.setScalar(lerp(.1, .95, bu) * (1 + .04 * Math.sin(lt * 9))); badgeM.rotation.z = .12 * Math.sin(lt * 4); SIS.s.aL = [-.4, 1.0]; SIS.s.aR = [-2.7, .4]; SIS.s.pitch = 0; SIS.s.yaw = lerp(-.62, -.15, ramp(lt, 5.4, 6.0)); SIS.s.x = lerp(1.0, 1.1, ramp(lt, 5.4, 6)); SIS.s.z = lerp(-1.95, -1.3, ramp(lt, 5.4, 6)); sisF = 'grin'; }
    }
    // -------------------------------------------------------------- beat 3: school + permission slip
    if (bi === 3) {
      zone = SCH; const cx = SCH; counter = ['HOODIE SAFE?', lt < 5.2 ? 'YES' : 'LEGAL', lt < 2.1 ? 'at school' : lt < 5.2 ? 'sister at school' : 'she has a lawyer', lt > 5.2];
      YOU.setOutfit(G); const wk = ramp(lt, .0, 1.6);
      if (lt < 1.7) { walkTo(YOU, cx - 4.2, -.4, cx - 1.2, -.3, wk, .9); YOU.s.yaw = lerp(-.9, .15, wk); YOU.s.aR = [-.6 * Math.sin(YOU.s.ph) * -1, .2]; YOU.s.aL = [.6 * Math.sin(YOU.s.ph), .2]; youF = 'grin'; }
      else { YOU.s.x = cx - 1.2; YOU.s.z = -.3; YOU.s.yaw = lerp(.15, .35, ramp(lt, 1.7, 2.4)); YOU.s.aR = [-.5, .3]; YOU.s.aL = [-1.3, .55]; youF = lt < 2.15 ? 'grin' : lt < 5.2 ? 'shock' : 'sad'; }
      if (lt > 2.5 && lt < 3.3) { YOU.s.aL = [-2.4, .3]; YOU.s.aR = [-2.4, .3]; }
      SIS.s.vis = lt > 1.6; SIS.setOutfit({ color: 0x0d1c3a, len: 1.0, w: 1.02, slv: 1.0, hood: false, pocket: false, print: 'tie' }); lawGl.visible = true;
      const en = ramp(lt, 1.7, 3.2); walkTo(SIS, cx + 5.2, 1.1, cx + .9, .6, en, 1.0); SIS.s.yaw = lerp(1.3, .0, en) - 0 * 1; if (lt < 3.2) { SIS.s.yaw = lerp(1.5, -.1, en); SIS.s.aR = [-.4, .2]; SIS.s.aL = [-.4 * Math.sin(SIS.s.ph), .2]; } else { SIS.s.x = cx + .9; SIS.s.z = .6; SIS.s.yaw = -.12; }
      sisF = lt < 5.2 ? 'smugD' : 'devil'; if (lt < 3.2) { SIS.s.aR = [-.2, .2]; }
      hold(bcG, SIS, 'L', [0, -.12, .05], [0, 1.57, 0], 1.0);
      if (lt >= 3.3 && lt < 4.0) { SIS.s.aL = [-.4, .3]; SIS.s.aR = [-1.0, .5]; }
      if (lt >= 4.0) { const up = ramp(lt, 3.9, 4.3); SIS.s.aR = [-2.9 + .2 * Math.sin(lt * 16) * (lt < 5 ? 1 : 0), .4]; slipG.visible = true; free(slipG, SIS.s.x - .6, .95 + .1 * up, SIS.s.z + .4, 0, 0, -.05, lerp(.6, 1.0, up)); }
      if (lt >= 5.2) { SIS.s.aR = [-2.9, .4]; SIS.s.aL = [-1.7, 1.0]; free(slipG, SIS.s.x - .62, 1.0, SIS.s.z + .4, 0, 0, -.06, 1.0); YOU.s.aL = [-2.4, .3]; YOU.s.aR = [-2.4, .3]; YOU.s.nod = .12; }
      if (lt > 4.1 && lt < 5.0) { popTxt = 'PERMISSION'; popA = clamp((lt - 4.1) * 6) * (1 - ramp(lt, 4.8, 5.0)); }
      if (lt > 6.0 && lt < 7.2) { popTxt = 'LAWYER'; popA = clamp((lt - 6.0) * 6); }
    }
    // -------------------------------------------------------------- beat 4: store return
    if (bi === 4) {
      zone = STO; const cx = STO; counter = ['RETURNS', lt < 4.7 ? '0' : '1', lt < 2.56 ? 'new hoodie: $29' : lt < 4.3 ? 'wrong shade' : lt < 5.7 ? 'returned' : 'exchange: YOUR hoodie', lt > 4.7];
      CLK.s.vis = true; CLK.s.x = cx - .2; CLK.s.z = -2.15; CLK.s.yaw = 0; CLK.setOutfit({ color: 0xe8262b, len: .9, w: 1.0, slv: .45, hood: false, pocket: false, print: 'apron' }); clkF = lt > 4.3 && lt < 5.5 ? 'deadpan' : 'neutral'; CLK.s.aL = [-1.2, .2]; CLK.s.aR = [-.4, .2];
      if (lt > 4.9 && lt < 5.5) { CLK.s.aR = [-.4 - .7 * Math.sin((lt - 4.9) / .6 * Math.PI), .2]; }
      const youHood = lt < 6.0; if (youHood) YOU.setOutfit(G);
      YOU.s.x = cx - 1.35; YOU.s.z = -.35; YOU.s.yaw = .3; youF = lt < 1.7 ? 'grin' : lt < 2.5 ? 'proud' : lt < 4.2 ? 'deadpan' : lt < 5.5 ? 'sad' : 'shock'; YOU.s.aL = [-.3, .2];
      const give = ramp(lt, .9, 1.7), sistake = ramp(lt, 1.7, 2.3);
      YOU.s.aR = [-1.4 + .0, .25]; if (lt < 1.9) YOU.s.aR = [-1.5, .2];
      if (lt < 2.4) { hold(pinkG, YOU, 'R', [0, .08, .05], [0, 0, 0], 1.2); }
      SIS.setOutfit({ color: 0x0d1c3a, len: 1.0, w: 1.02, slv: 1.0, hood: false, pocket: false, print: 'tie' }); lawGl.visible = true;
      SIS.s.x = cx + .35; SIS.s.z = -.1; SIS.s.yaw = -.5; sisF = lt < 2.5 ? 'smug' : lt < 4.3 ? 'scrunch' : 'devil';
      if (lt >= 1.7 && lt < 4.35) { hold(pinkG, SIS, 'R', [0, .05, .06], [0, 0, 0], 1.2); SIS.s.aR = [-1.3, .4]; SIS.s.aL = [-.5, .4]; if (lt > 2.56 && lt < 3.9) { SIS.s.aR = [-1.7 + .1 * Math.sin(lt * 14), .5]; SIS.s.aL = [-.5, 1.3]; SIS.s.yaw = -.2 + .25 * Math.sin(lt * 6); SIS.s.nod = .25; } }
      if (lt >= 4.35 && lt < 5.0) { const sl = ramp(lt, 4.3, 4.8); pinkG.visible = true; free(pinkG, lerp(cx + .35 + 0, cx + 0.3, sl), lerp(1.55, 1.42, sl), lerp(-.3, -1.3, sl), 0, 0, 0, 1.2); SIS.s.aR = [-1.9, .3]; }
      else if (lt >= 5.0 && lt < 6.4) { free(pinkG, cx + .5, 1.45, -1.35, 0, 0, -.5, 1.2); }
      else if (lt >= 6.4) pinkG.visible = false;
      if (lt >= 4.5 && lt < 5.7) { stampM.visible = true; stampM.position.set(cx + .7, 1.95, -.9); stampM.rotation.z = -.15; stampM.scale.setScalar(lt < 4.7 ? lerp(2.2, 1, ramp(lt, 4.5, 4.7)) : 1); popTxt = lt < 5.3 ? 'RETURNED!' : ''; popA = clamp((lt - 4.5) * 8) * (1 - ramp(lt, 5.1, 5.3)); }
      if (lt >= 5.3) { receiptG.visible = true; const ru = ramp(lt, 5.3, 5.8); free(receiptG, SIS.s.x - .6, .95 + .1 * ru, SIS.s.z + .4, 0, 0, -.1, lerp(.6, 1.15, ru)); SIS.s.aR = [-2.7, .45]; SIS.s.aL = [-.5, .5]; SIS.s.yaw = -.25; }
      if (lt >= 5.95 && lt < 6.4) { const fl = ramp(lt, 5.95, 6.4); YOU.s.x = cx - 1.35 - .3 * Math.sin(fl * Math.PI); YOU.s.yaw = .3 + fl * 4.0; YOU.s.aL = [-2.4, .3]; YOU.s.aR = [-2.4, .3]; free(hoodieG, lerp(cx - 1.35, cx + .35, fl), 1.2 + Math.sin(fl * Math.PI) * .6, -.25, 0, 0, fl * 8, 1.5); }
      if (lt >= 6.4) { sisHood(); SIS.s.aL = [-.2, 1.25]; SIS.s.aR = [-.2, 1.25]; sisF = 'grin'; YOU.s.aL = [-2.4, .3]; YOU.s.aR = [-2.4, .3]; youF = 'shock'; receiptG.visible = false; }
      if (lt > 2.56 && lt < 3.7) { popTxt = 'WRONG SHADE'; popA = clamp((lt - 2.56) * 7) * (1 - ramp(lt, 3.4, 3.7)); }
    }
    // -------------------------------------------------------------- beat 5: LITTLE SISTER
    if (bi === 5) {
      zone = BX; const printOn = lt >= 1.9; counter = ['BORROWED', lt < 3.78 ? 'ME: 0' : 'ME: 1', lt < 3.78 ? 'HER: 1' : 'the hoodie is hers now', lt >= 3.78];
      SIS.setOutfit({ color: 0x3fa05a, len: 1.42, w: 1.12, slv: 1.45, print: printOn ? 'sister' : null });
      SIS.s.x = .1; SIS.s.z = -.7; SIS.s.yaw = -.12 + Math.sin(lt * 1.4) * .12; SIS.s.aL = [-.25, 1.05 + .1 * Math.sin(lt * 6)]; SIS.s.aR = [-.25, 1.05 + .1 * Math.sin(lt * 6 + 1)]; SIS.s.y = lt > .3 && lt < 1.9 ? Math.abs(Math.sin(lt * 5)) * .05 : 0; sisF = lt < 1.9 ? 'grin' : lt < 3.7 ? 'smugD' : 'devil';
      if (printOn) { const pu = ramp(lt, 1.9, 2.25); popTxt = ''; popA = clamp((lt - 1.9) * 7) * (1 - ramp(lt, 2.8, 3.0)); }
      // you: too-small pink kids hoodie
      YOU.setOutfit({ color: 0xff7aa8, len: .66, w: .93, slv: .55, print: 'kids', pocket: false, hood: true });
      const en = ramp(lt, 3.0, 4.2); YOU.s.x = lerp(-3.2, -1.2, en); YOU.s.z = lerp(-.3, -.2, en); YOU.s.yaw = lerp(.9, .3, en); if (en > 0 && en < 1) { YOU.s.walk = .8; YOU.s.ph = lt * 8; }
      if (lt >= 4.2) { YOU.s.aL = [-.4, .3]; YOU.s.aR = [-1.3, .4]; if (lt > 4.4 && lt < 5.3) { YOU.s.aR = [-1.2 - .15 * Math.sin(lt * 18), .2]; YOU.s.aL = [-1.2 + .15 * Math.sin(lt * 18), .2]; YOU.s.pitch = .12; } }
      youF = lt < 3.78 ? 'deadpan' : lt < 5.1 ? 'sad' : 'sad'; if (lt < 3.0) YOU.s.vis = false;
      if (lt > 3.8 && lt < 5.2) { popTxt = lt > 4.4 ? 'BORROWING' : ''; popA = clamp((lt - 4.4) * 6); }
      hoodieG.visible = false; pinkG.visible = false;
    }
    // -------------------------------------------------------------- finalize people
    doorL.rotation.y = -doorOpen; doorR.rotation.y = doorOpen; closetLight.visible = zone === BX; closetLight.intensity = .5 + doorOpen * .6;
    [YOU, SIS, CLK].forEach((a) => finalize(a, t));
    S.updateMatrixWorld(true);
    YOU.face(youF, t, youTalk); SIS.face(sisF, t, sisTalk); CLK.face(clkF, t, clkTalk);
    hud.pop(popTxt, popA);
    // -------------------------------------------------------------- camera
    A.follow(zone, 0);
    const Z = zone;
    if (bi === 0) rig(lt, [[0, D(BX + .8, 2.2, 6.0), D(BX + .6, 2.1, 5.6), D(BX + .5, 1.1, -.6), D(BX + .4, 1.1, -.6), 52, 50], [2.3, D(BX + 1.2, 1.9, 5.0), D(BX + 1.2, 1.7, 4.2), D(BX + .6, 1.2, -1.0), D(BX + .9, 1.2, -1.2), 50, 44]], t);
    else if (bi === 1) rig(lt, [[0, D(BX + .3, 2.2, 6.0), D(BX + .4, 2.1, 5.6), D(BX + .2, 1.2, -1.0), D(BX + .3, 1.2, -1.0), 52, 50], [2.5, D(BX + 1.0, 1.5, 4.0), D(BX + 1.0, 1.4, 3.1), D(BX + .6, 1.15, 0), D(BX + .6, 1.2, 0), 42, 34]], t);
    else if (bi === 2) rig(lt, [[0, D(BX + .2, 2.0, 5.6), D(BX + .4, 1.9, 5.2), D(BX + .0, 1.2, -1.3), D(BX + .3, 1.2, -1.5), 52, 50], [3.0, D(BX + .55, 1.55, .6), D(BX + .6, 1.5, .1), D(BX + .7, 1.2, -2.2), D(BX + .7, 1.2, -2.2), 32, 26], [5.4, D(BX + 1.1, 1.3, 2.4), D(BX + 1.1, 1.3, 1.9), D(BX + 1.05, .9, -1.3), D(BX + 1.05, .95, -1.3), 34, 30]], t);
    else if (bi === 3) rig(lt, [[0, D(SCH - 1.0, 2.0, 6.0), D(SCH - .6, 1.9, 5.6), D(SCH - 1.3, 1.1, -.3), D(SCH - .7, 1.1, -.3), 52, 50], [2.1, D(SCH - .1, 1.8, 5.2), D(SCH - .1, 1.7, 4.8), D(SCH - .1, 1.0, .0), D(SCH - .1, 1.0, .0), 50, 46], [3.9, D(SCH + .6, 1.6, 4.6), D(SCH + .7, 1.55, 4.1), D(SCH + .6, 1.0, .6), D(SCH + .7, 1.0, .6), 42, 38], [5.3, D(SCH + .9, 1.7, 5.0), D(SCH + .6, 1.6, 5.4), D(SCH + .1, 1.1, 0), D(SCH + .2, 1.1, 0), 48, 50]], t);
    else if (bi === 4) rig(lt, [[0, D(STO - .5, 2.2, 5.8), D(STO - .3, 2.1, 5.4), D(STO - .4, 1.2, -.5), D(STO - .2, 1.2, -.5), 52, 50], [2.4, D(STO + .3, 1.8, 4.6), D(STO + .3, 1.7, 4.0), D(STO - .4, 1.1, -.3), D(STO - .2, 1.1, -.3), 46, 40], [4.3, D(STO + .5, 1.9, 4.8), D(STO + .6, 1.8, 4.2), D(STO + .5, 1.5, -1.0), D(STO + .5, 1.5, -1.0), 44, 38], [5.6, D(STO + .3, 1.8, 4.2), D(STO + .2, 1.6, 3.8), D(STO - .1, 1.1, -.2), D(STO - .1, 1.1, -.2), 46, 44]], t);
    else rig(lt, [[0, D(BX + .8, 1.5, 4.8), D(BX + .7, 1.5, 4.3), D(BX + .6, 1.25, -.7), D(BX + .6, 1.25, -.7), 46, 42], [1.8, D(BX + .7, 1.3, 3.2), D(BX + .6, 1.25, 2.4), D(BX + .6, 1.05, -.7), D(BX + .6, 1.05, -.7), 40, 30], [3.0, D(BX - .3, 1.8, 6.0), D(BX - .2, 1.7, 5.6), D(BX - .2, 1.15, -.5), D(BX - .2, 1.15, -.5), 50, 48], [4.8, D(BX - .3, 1.4, 5.0), D(BX - .3, 1.4, 4.6), D(BX - .3, 1.05, -.5), D(BX - .3, 1.05, -.5), 42, 40]], t);
    A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0); hud.counter(counter[0], counter[1], counter[2], '', counter[3]); hud.tm('');
  };
  return { frame(a) { inner(a); inner(a); } };
}
