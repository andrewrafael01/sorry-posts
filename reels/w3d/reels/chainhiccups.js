// 665 invention chain: hiccups -> hold breath -> pass out -> drink upside down -> wedding -> friend scares you -> next county -> groom hiccups.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, ground, Crowd, clamp, smooth, lerp, attach, tree, Particles } = lib;
  const A = makeStage({ fog: 0xcfdcea, fogNear: 70, fogFar: 300, clouds: true, skyTop: 0x3f86d8, skyMid: 0x9cc8f0, skyBot: 0xe2eef9, shadowExtent: 13, shadowRes: 2048, hemi: 1.7, sunI: 1.7, sunDir: [-.35, .9, .55], exposure: 1.08 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const PI = Math.PI;
  const LX = -60, RX = 120; // living room / road world offsets (church sits at the origin)
  ground(S, 0x6fa84e, 700, { y: -.02 });
  const grp = (x = 0) => { const g = new THREE.Group(); g.position.x = x; S.add(g); return g; };
  const LR = grp(LX), CH = grp(0), RD = grp(RX);
  const stdM = (map, r = .85) => new THREE.MeshStandardMaterial({ map, roughness: r });
  const bm = (w, h, d, c, p, g, o = {}) => addBox(g, p[0], p[1], p[2], w, h, d, c, o);

  // ================================================================== LIVING ROOM
  { const wood = cvs(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = ['#b98a58', '#ad7f4e', '#c19463'][i % 3]; g.fillRect(0, i * 32, w, 30); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, i * 32 + 30, w, 2); } }); wood.t.wrapS = wood.t.wrapT = THREE.RepeatWrapping; wood.t.repeat.set(4, 4);
    addBox(LR, 0, -.06, -.4, 10.6, .12, 9.6, 0xffffff, { material: stdM(wood.t, .7) });
    bm(10.6, 3.5, .2, 0xe9d9c0, [0, 1.75, -4.5], LR); bm(.2, 3.5, 9.6, 0xe3d2b8, [-5.2, 1.75, -.4], LR); bm(.2, 3.5, 9.6, 0xe3d2b8, [5.2, 1.75, -.4], LR);
    bm(10.6, .14, .08, 0xf5eee0, [0, .08, -4.38], LR, { cast: false });
    const rug = cvs(256, 256, (g, w, h) => { g.fillStyle = '#c0453b'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f2dcae'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28); g.fillStyle = '#2f5d8c'; g.fillRect(50, 50, w - 100, h - 100); g.strokeStyle = '#f2dcae'; g.lineWidth = 5; g.strokeRect(70, 70, w - 140, h - 140); });
    addBox(LR, 0, .015, -.6, 4.4, .03, 3.4, 0xffffff, { material: stdM(rug.t, .95), cast: false });
    // window
    const sk = new THREE.MeshBasicMaterial({ color: 0xbfe2ff, toneMapped: false }); const wnd = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.5), sk); wnd.position.set(2.4, 2.0, -4.38); LR.add(wnd);
    bm(1.9, .12, .1, 0xf6f0e2, [2.4, 2.8, -4.36], LR); bm(1.9, .12, .1, 0xf6f0e2, [2.4, 1.2, -4.36], LR); bm(.12, 1.7, .1, 0xf6f0e2, [1.5, 2.0, -4.36], LR); bm(.12, 1.7, .1, 0xf6f0e2, [3.3, 2.0, -4.36], LR); bm(.07, 1.5, .08, 0xf6f0e2, [2.4, 2.0, -4.35], LR); bm(1.7, .07, .08, 0xf6f0e2, [2.4, 2.0, -4.35], LR);
    bm(.5, 2.0, .12, 0xd8604a, [1.15, 2.0, -4.3], LR); bm(.5, 2.0, .12, 0xd8604a, [3.65, 2.0, -4.3], LR);
    // sofa
    const sofa = 0x2f8f8a; bm(3.4, .5, 1.15, sofa, [-2.0, .27, -3.8], LR, { round: .08 }); bm(3.4, .85, .3, sofa, [-2.0, .75, -4.2], LR, { round: .08 }); bm(.3, .7, 1.15, sofa, [-3.55, .55, -3.8], LR, { round: .08 }); bm(.3, .7, 1.15, sofa, [-.45, .55, -3.8], LR, { round: .08 });
    bm(.6, .5, .18, 0xf2c84b, [-2.8, .75, -3.95], LR, { round: .05 }); bm(.6, .5, .18, 0xd8604a, [-1.3, .75, -3.95], LR, { round: .05 });
    // coffee table, lamp, plant, shelf, frames, clock
    bm(1.5, .1, .8, 0x7a4e28, [-3.6, .5, -1.6], LR); for (const [x, z] of [[-4.2, -1.9], [-3.0, -1.9], [-4.2, -1.3], [-3.0, -1.3]]) bm(.1, .5, .1, 0x5a381c, [x, .25, z], LR);
    const mugM = mat(0xf2f2f4); const mug = new THREE.Mesh(new THREE.CylinderGeometry(.09, .08, .12, 12), mugM); mug.position.set(-3.5, .61, -1.6); LR.add(mug);
    { const g = new THREE.Group(); const pole = new THREE.Mesh(new THREE.CylinderGeometry(.03, .04, 1.9, 8), mat(0x2a2a2e)); pole.position.y = .95; const sh = new THREE.Mesh(new THREE.CylinderGeometry(.22, .4, .42, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xffe3a0, emissive: 0xffc860, emissiveIntensity: .8, side: THREE.DoubleSide })); sh.position.y = 1.95; const bs = new THREE.Mesh(new THREE.CylinderGeometry(.22, .25, .05, 12), mat(0x2a2a2e)); bs.position.y = .02; g.add(pole, sh, bs); g.position.set(-4.7, 0, -4.0); g.traverse((m) => { m.castShadow = true; }); LR.add(g); }
    { const pot = new THREE.Mesh(new THREE.CylinderGeometry(.3, .22, .45, 12), mat(0xc0643c)); pot.position.set(4.4, .22, -3.9); pot.castShadow = true; LR.add(pot); for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.IcosahedronGeometry(.3 + cr(i, 1) * .12, 0), mat(0x3f9a3c, { flatShading: true })); l.position.set(4.4 + (cr(i, 2) - .5) * .5, .8 + cr(i, 3) * .7, -3.9 + (cr(i, 4) - .5) * .4); l.castShadow = true; LR.add(l); } }
    bm(.5, 2.2, 2.4, 0x8a5a30, [4.85, 1.1, -1.6], LR); for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) bm(.2, .32, .08, [0xd8604a, 0x3a78d8, 0xf2c84b, 0x6bbf8a][(i + j) % 4], [4.55, .45 + i * .5, -2.6 + j * .27], LR, { cast: false });
    [[-2.4, 2.4, .9, .7, 0x3a78d8], [-1.2, 2.55, .6, .8, 0xf2c84b], [-0.2, 2.35, .8, .6, 0xd8604a]].forEach(([x, y, w, h, c]) => { bm(w + .12, h + .12, .06, 0x5a381c, [x, y, -4.38], LR); bm(w, h, .05, c, [x, y, -4.34], LR, { cast: false }); });
    const clk = cvs(128, 128, (g) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.strokeStyle = '#222'; g.lineWidth = 6; g.stroke(); g.lineWidth = 6; g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 24); g.moveTo(64, 64); g.lineTo(92, 74); g.stroke(); });
    const clm = new THREE.Mesh(new THREE.CircleGeometry(.3, 24), new THREE.MeshBasicMaterial({ map: clk.t })); clm.position.set(.7, 3.0, -4.38); LR.add(clm); }

  // ================================================================== CHURCH (origin; altar z=-7.4, nave doors z=+7.9, side doors on x=+6)
  const stone = cvs(256, 256, (g, w, h) => { g.fillStyle = '#cdbfa6'; g.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = (i + j) % 2 ? '#c2b398' : '#d6c9b0'; g.fillRect(i * 64 + 2, j * 64 + 2, 60, 60); } }); stone.t.wrapS = stone.t.wrapT = THREE.RepeatWrapping; stone.t.repeat.set(6, 8);
  const WALLC = 0xf0e6d2, WH = 5.6;
  { addBox(CH, 0, -.06, 0, 12.4, .12, 16.4, 0xffffff, { material: stdM(stone.t, .6) });
    addBox(CH, 0, .012, .2, 2.5, .025, 16, 0xa82a2a, { cast: false });
    // walls
    bm(.3, WH, 16.4, WALLC, [-6.15, WH / 2, 0], CH); bm(12.6, WH, .3, WALLC, [0, WH / 2, -8.1], CH); bm(12.6, WH, .3, WALLC, [0, WH / 2, 8.1], CH);
    bm(.3, WH, 10.9 + .15, WALLC, [6.15, WH / 2, -2.55 - .075 + .0], CH); // z -8 .. 2.9
    bm(.3, WH, 2.55, WALLC, [6.15, WH / 2, 6.8], CH); bm(.3, WH - 3.4, 2.7, WALLC, [6.15, 3.4 + (WH - 3.4) / 2, 4.2], CH); // above door
    // ceiling + beams (no shadow cast so the sun still lights the nave)
    const ceil = new THREE.Mesh(new THREE.BoxGeometry(12.6, .2, 16.4), mat(0x9a7a56)); ceil.position.set(0, WH + .1, 0); ceil.receiveShadow = true; CH.add(ceil);
    for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(12.6, .3, .3), mat(0x5a3a1e)); b.position.set(0, WH - .1, -7 + i * 2.8); CH.add(b); }
    // stained glass
    const glassT = (hue) => cvs(128, 256, (g, w, h) => { g.fillStyle = '#222'; g.fillRect(0, 0, w, h); for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) { g.fillStyle = `hsl(${(hue + (r * 4 + c) * 37) % 360},80%,${r < 2 ? 62 : 55}%)`; g.fillRect(c * 32 + 3, r * 32 + 3, 26, 26); } });
    for (const sgn of [-1, 1]) for (let k = 0; k < 4; k++) { const gt = glassT(k * 70 + (sgn > 0 ? 30 : 0)); const m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.3), new THREE.MeshBasicMaterial({ map: gt.t, toneMapped: false })); m.position.set(sgn * 5.98, 3.5, -5.7 + k * 3.2 + (sgn > 0 && k > 2 ? 1.6 : 0)); m.rotation.y = -sgn * PI / 2; if (!(sgn > 0 && k > 2)) CH.add(m); }
    // altar wall: big window + gold cross
    const aw = cvs(256, 384, (g, w, h) => { g.fillStyle = '#222'; g.fillRect(0, 0, w, h); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffe9a0'); gr.addColorStop(1, '#ff9a5a'); g.fillStyle = gr; g.beginPath(); g.moveTo(10, h - 10); g.lineTo(10, 130); g.arc(128, 130, 118, PI, 0); g.lineTo(w - 10, h - 10); g.fill(); g.fillStyle = '#3a78d8'; for (let i = 0; i < 6; i++) { g.fillRect(24 + (i % 2) * 112, 150 + ((i / 2) | 0) * 70, 96, 56); } g.fillStyle = '#222'; g.fillRect(118, 20, 20, h); g.fillRect(10, 160, w, 14); });
    const awm = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3.9), new THREE.MeshBasicMaterial({ map: aw.t, toneMapped: false })); awm.position.set(0, 3.55, -7.93); CH.add(awm);
    // altar platform
    bm(7.0, .35, 3.1, 0xb9a688, [0, .175, -6.4], CH); bm(7.0, .17, .8, 0xc8b698, [0, .085, -4.55], CH); bm(1.7, .95, .6, 0xf4f0e8, [0, .35 + .475, -7.3], CH, { round: .03 }); bm(1.9, .08, .7, 0xe0d8c8, [0, .35 + .95, -7.3], CH);
    bm(.1, .9, .06, 0xe8b830, [0, 1.75, -7.55], CH); bm(.55, .1, .06, 0xe8b830, [0, 1.95, -7.55], CH);
    for (const sx of [-.6, .6]) { const cd = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .3, 8), mat(0xf6f2e8)); cd.position.set(sx, .35 + .95 + .19, -7.3); CH.add(cd); const fl = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd060, toneMapped: false })); fl.position.set(sx, .35 + .95 + .38, -7.3); fl.scale.y = 1.5; CH.add(fl); }
    // flower stands
    for (const sx of [-2.9, 2.9]) { bm(.3, 1.0, .3, 0xe8e4da, [sx, .85, -6.9], CH); for (let i = 0; i < 12; i++) { const fb = new THREE.Mesh(new THREE.SphereGeometry(.17, 8, 6), mat([0xff7aa8, 0xffffff, 0xffd0e0, 0xff5a8a][i % 4])); fb.position.set(sx + (cr(i, 1) - .5) * .7, 1.55 + cr(i, 2) * .55, -6.9 + (cr(i, 3) - .5) * .5); fb.castShadow = true; CH.add(fb); } }
    // pews
    const wood = 0x7a4a26; for (const sgn of [-1, 1]) for (let row = 0; row < 5; row++) { const z = -5 + row * 1.5; bm(3.7, .1, .6, wood, [sgn * 3.15, .5, z], CH); bm(3.7, .95, .1, wood, [sgn * 3.15, .98, z + .33], CH); bm(.1, 1.1, .75, 0x5a381c, [sgn * 1.32, .55, z + .05], CH); bm(.1, 1.1, .75, 0x5a381c, [sgn * 4.98, .55, z + .05], CH); }
    // wedding arch (aisle, z=2.3) with a crossbar you can hang from
    const ARCH_Z = 2.3, BAR_Y = 2.7; for (const sx of [-1.15, 1.15]) bm(.16, BAR_Y + .1, .16, 0xf4f0e8, [sx, (BAR_Y + .1) / 2, ARCH_Z], CH); bm(2.6, .14, .14, 0xf4f0e8, [0, BAR_Y, ARCH_Z], CH);
    for (let i = 0; i < 26; i++) { const fb = new THREE.Mesh(new THREE.SphereGeometry(.1 + cr(i, 4) * .05, 8, 6), mat([0xff7aa8, 0xffffff, 0xffd0e0, 0x4f9a46][i % 4])); fb.position.set(-1.25 + i * .1, BAR_Y + .02 + (cr(i, 5) - .3) * .12, ARCH_Z + (cr(i, 6) - .5) * .22); fb.castShadow = true; CH.add(fb); }
    for (const sx of [-1.15, 1.15]) for (let i = 0; i < 7; i++) { const fb = new THREE.Mesh(new THREE.SphereGeometry(.1, 8, 6), mat([0xff7aa8, 0xffffff, 0x4f9a46][i % 3])); fb.position.set(sx + (cr(i, 7) - .5) * .2, 1.6 + i * .15, ARCH_Z + (cr(i, 8) - .5) * .2); CH.add(fb); }
    // side doors (leaves hinged at z=2.9 and z=5.5, open outward)
    var doorL = new THREE.Group(), doorR = new THREE.Group(); doorL.position.set(6.1, 0, 2.9); doorR.position.set(6.1, 0, 5.5); CH.add(doorL, doorR);
    const dm = (g, sgn) => { const leaf = new THREE.Mesh(new THREE.BoxGeometry(.12, 3.3, 1.3), mat(0x6a3f1e)); leaf.position.set(0, 1.65, sgn * .65); leaf.castShadow = true; g.add(leaf); const knob = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), mat(0xe8b830)); knob.position.set(-.1, 1.5, sgn * 1.15); g.add(knob); const pn = new THREE.Mesh(new THREE.BoxGeometry(.14, 1.2, .9), mat(0x7e4e28)); pn.position.set(-.01, 2.2, sgn * .65); g.add(pn); };
    dm(doorL, 1); dm(doorR, -1);
    // lawn + steps outside the side doors
    bm(2.4, .12, 3.0, 0xcdbfa6, [7.2, .06, 4.2], CH); bm(1.2, .06, 3.0, 0xcdbfa6, [8.1, .03, 4.2], CH);
  }

  // ================================================================== ROAD (local to RD)
  { addBox(RD, 0, .005, -30, 7, .04, 160, 0x4a4c52, { cast: false }); for (let i = 0; i < 40; i++) bm(.18, .02, 1.6, 0xf2c830, [0, .03, 10 - i * 3.6], RD, { cast: false }); for (const sx of [-3.3, 3.3]) bm(.12, .02, 160, 0xf0f0f0, [sx, .03, -30], RD, { cast: false });
    for (let i = 0; i < 30; i++) { for (const sx of [-5.6, 5.6]) bm(.12, 1.0, .12, 0x8a5a30, [sx, .5, 8 - i * 2.8], RD); } for (const sx of [-5.6, 5.6]) { bm(.06, .08, 90, 0xa8723c, [sx, .85, -34], RD, { cast: false }); bm(.06, .08, 90, 0xa8723c, [sx, .5, -34], RD, { cast: false }); }
    // fields
    for (let i = 0; i < 9; i++) bm(10, .04, 10, [0xd8bf4a, 0x8cc04a, 0xc9a93c][i % 3], [(i % 2 ? 1 : -1) * (13 + (i >> 1) * 1.3), .01, -2 - i * 9], RD, { cast: false });
    tree(RD, -9, -12, 1.8, 3); tree(RD, 9, -18, 2.0, 7); tree(RD, 14, -6, 1.5, 11); tree(RD, -15, -4, 1.6, 5); tree(RD, 10, 4, 1.4, 9);
    for (let i = 0; i < 5; i++) { const h = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), mat([0x4f9a46, 0x5aa850, 0x3f8a3c][i % 3])); h.scale.set(24 + i * 6, 6 + i * 2, 18); h.position.set(-60 + i * 38, -1.5, -80 - (i % 2) * 20); RD.add(h); }
    // barn + hay + cows
    bm(5, 3, 4, 0xb53a2c, [-14, 1.5, -22], RD); { const r1 = new THREE.Mesh(new THREE.BoxGeometry(5.4, .2, 2.7), mat(0x6a2a20)); r1.position.set(-14, 3.5, -23.3); r1.rotation.x = -.75; r1.castShadow = true; const r2 = r1.clone(); r2.position.z = -20.7; r2.rotation.x = .75; RD.add(r1, r2); bm(1.8, 2.2, .1, 0xf0e8d8, [-14, 1.1, -19.95], RD); }
    for (let i = 0; i < 4; i++) { const hb = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, .7, 14), mat(0xe0c25a)); hb.rotation.z = PI / 2; hb.position.set(9 + i * 1.3, .4, -9 - (i % 2) * 1.2); hb.castShadow = true; RD.add(hb); }
    const cow = (x, z, ry) => { const g = new THREE.Group(); const add = (w, h, d, c, px, py, pz) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)); b.position.set(px, py, pz); b.castShadow = true; g.add(b); }; add(.7, .65, 1.3, 0xf8f8f4, 0, .95, 0); add(.72, .3, .5, 0x1a1a1c, 0, 1.1, .2); add(.45, .45, .5, 0xf8f8f4, 0, 1.15, .85); add(.3, .2, .2, 0xe8a8a0, 0, 1.05, 1.15); for (const sx of [-.25, .25]) for (const sz of [-.45, .45]) add(.14, .65, .14, 0xf0f0ec, sx, .33, sz); g.position.set(x, 0, z); g.rotation.y = ry; RD.add(g); };
    cow(8, -4, .6); cow(11, -13, -.4); cow(-9, -7, 2.1);
    // tiny church far away (where you ran from)
    bm(3, 2, 2.4, 0xf0e6d2, [-26, 1, -70], RD); bm(.9, 3.2, .9, 0xf0e6d2, [-27.5, 1.6, -70], RD); { const rf = new THREE.Mesh(new THREE.ConeGeometry(1.0, 1.6, 4), mat(0x8a3a2a)); rf.position.set(-27.5, 3.9, -70); rf.rotation.y = PI / 4; RD.add(rf); }
    // NEXT COUNTY sign
    const sg = cvs(512, 320, (g, w, h) => { g.fillStyle = '#1b6b3a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 10; g.strokeRect(12, 12, w - 24, h - 24); txt(g, 'NEXT', w / 2, 100, 120, '#fff'); txt(g, 'COUNTY', w / 2, 224, 120, '#fff'); });
    const sgm = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.1, .1), [mat(0x6a6a6a), mat(0x6a6a6a), mat(0x6a6a6a), mat(0x6a6a6a), stdM(sg.t, .5), mat(0x6a6a6a)]); sgm.position.set(-3.2, 2.9, -7); sgm.castShadow = true; RD.add(sgm);
    for (const sx of [-4.5, -1.9]) bm(.14, 3.0, .14, 0x8a8a90, [sx, 1.5, -7.1], RD); }

  // ================================================================== people
  const guests = []; let gi = 5; for (const side of [-1, 1]) for (let row = 0; row < 5; row++) { const z = -5 + row * 1.5; [1.9, 2.6, 3.3, 4.0].forEach((ax, j) => { if (j >= 2 && cr(gi * 3 + row, 3) < .3) return; guests.push({ i: gi++, x: side * ax, z: z + .08, row }); }); }
  const lobby = [{ i: gi++, x: 4.3, z: 3.5 }, { i: gi++, x: 5.2, z: 4.8 }, { i: gi++, x: 3.6, z: 4.9 }, { i: gi++, x: 5.6, z: 3.5 }];
  const crowd = new Crowd(S, gi, 91); const P = crowd.p; const YOU = P[0], FR = P[1], BR = P[2], GR = P[3], PA = P[4];
  const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  const skin = (i, c) => col(i, ['head', 'neck', 'handL', 'handR'], c);
  const SK_YOU = new THREE.Color(0xf0c39a);
  col(0, ['torso', 'armL', 'armR'], 0x3a78d8); col(0, ['legL', 'legR'], 0x2b3347); col(0, ['hair'], 0x4a2f1c); skin(0, 0xf0c39a);
  col(1, ['torso', 'armL', 'armR'], 0xf0902a); col(1, ['legL', 'legR'], 0x3f5a3a); col(1, ['hair'], 0x16110c); skin(1, 0xe0a878);
  col(2, ['torso', 'armL', 'armR', 'legL', 'legR'], 0xfdfcf8); col(2, ['hair'], 0x6a3a1c); skin(2, 0xf6d2b0);
  col(3, ['torso', 'armL', 'armR', 'legL', 'legR'], 0x1c1d24); col(3, ['hair'], 0x2a1a10); skin(3, 0xc98d62);
  col(4, ['torso', 'armL', 'armR', 'legL', 'legR'], 0x5a3a96); col(4, ['hair'], 0xcfcfd4); skin(4, 0xe8bb94);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  YOU.h = 1; FR.h = 1.04; BR.h = .96; GR.h = 1.04; PA.h = 1.02;
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; o.roll = 0; };
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const hideAll = () => P.forEach((o) => { o.vis = false; });
  const tmpC = new THREE.Color(); const PURP = new THREE.Color(0x7a3fb0), RED = new THREE.Color(0xe8584a), PALE = new THREE.Color(0xf6e8d8);
  const tint = (amt, red) => { tmpC.copy(SK_YOU); if (red > 0) tmpC.lerp(RED, red); if (amt > 0) tmpC.lerp(PURP, amt); for (const k of ['head', 'neck', 'handL', 'handR']) { crowd.parts[k].setColorAt(0, tmpC); crowd.parts[k].instanceColor.needsUpdate = true; } };

  // props
  const cheeks = []; for (let i = 0; i < 2; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.14, 14, 10), new THREE.MeshStandardMaterial({ color: 0xf0c39a, roughness: .8 })); m.castShadow = true; m.visible = false; S.add(m); cheeks.push(m); }
  const glass = new THREE.Group(); { const gl = new THREE.Mesh(new THREE.CylinderGeometry(.11, .08, .26, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xd8f0ff, transparent: true, opacity: .45, roughness: .05, metalness: .2, side: THREE.DoubleSide })); const wt = new THREE.Mesh(new THREE.CylinderGeometry(.095, .075, .17, 14), new THREE.MeshStandardMaterial({ color: 0x3aa0ff, emissive: 0x0a4a99, emissiveIntensity: .5, roughness: .1 })); wt.position.y = -.04; const bs = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .02, 14), new THREE.MeshStandardMaterial({ color: 0xd8f0ff, transparent: true, opacity: .6 })); bs.position.y = -.13; glass.add(gl, wt, bs); glass.visible = false; S.add(glass); }
  const sheet = new THREE.Group(); { const sm = mat(0xfafaf6, { roughness: .95 }); const cyl = new THREE.Mesh(new THREE.CylinderGeometry(.5, .72, 1.6, 18), sm); cyl.position.y = .05; const dome = new THREE.Mesh(new THREE.SphereGeometry(.5, 18, 10, 0, 7, 0, 1.6), sm); dome.position.y = .85; const eyeM = new THREE.MeshBasicMaterial({ color: 0x111111 }); for (const sx of [-.16, .16]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8), eyeM); e.scale.set(.8, 1.4, .5); e.position.set(sx, .72, .47); sheet.add(e); } const mo = new THREE.Mesh(new THREE.SphereGeometry(.09, 10, 8), eyeM); mo.scale.set(1, 1.3, .5); mo.position.set(0, .45, .56); sheet.add(mo); sheet.add(cyl, dome); sheet.traverse((m) => { m.castShadow = true; }); sheet.visible = false; S.add(sheet); }
  const bouquet = new THREE.Group(); { const st = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .4, 6), mat(0x3f8a3c)); st.position.y = -.05; bouquet.add(st); for (let i = 0; i < 9; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.1, 10, 8), mat([0xff7aa8, 0xffffff, 0xff5a8a][i % 3])); f.position.set((cr(i, 1) - .5) * .28, .22 + cr(i, 2) * .1, (cr(i, 3) - .5) * .28); bouquet.add(f); } bouquet.traverse((m) => { m.castShadow = true; }); bouquet.visible = false; S.add(bouquet); }
  const trophy = new THREE.Group(); { const gm = new THREE.MeshStandardMaterial({ color: 0xffc830, metalness: .85, roughness: .25, emissive: 0x6a4a00, emissiveIntensity: .3 }); const cup = new THREE.Mesh(new THREE.CylinderGeometry(.22, .1, .34, 16), gm); cup.position.y = .3; const stem = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .2, 10), gm); stem.position.y = .06; const bs = new THREE.Mesh(new THREE.BoxGeometry(.3, .1, .3), gm); bs.position.y = -.08; trophy.add(cup, stem, bs); for (const sx of [-1, 1]) { const h = new THREE.Mesh(new THREE.TorusGeometry(.11, .025, 6, 12), gm); h.position.set(sx * .24, .32, 0); h.rotation.y = PI / 2; trophy.add(h); } trophy.traverse((m) => { m.castShadow = true; }); trophy.scale.setScalar(1.5); trophy.visible = false; S.add(trophy); }
  const veil = new THREE.Mesh(new THREE.BoxGeometry(.5, .06, .62), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .85 })); veil.visible = false; S.add(veil);
  const dress = new THREE.Mesh(new THREE.CylinderGeometry(.34, .62, .82, 16), mat(0xfdfcf8, { roughness: .8 })); dress.castShadow = true; dress.visible = false; S.add(dress);
  const bowtie = new THREE.Mesh(new THREE.BoxGeometry(.2, .1, .05), mat(0xd8201e)); bowtie.visible = false; S.add(bowtie);
  const robe = new THREE.Mesh(new THREE.CylinderGeometry(.34, .5, .8, 14), mat(0x5a3a96)); robe.castShadow = true; robe.visible = false; S.add(robe);
  // sprites: bubbles & labels
  const mkSprite = (c, w, h) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: c.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; s.userData.w = w; s.userData.h = h; S.add(s); return s; };
  const bubCv = () => cvs(512, 340, (g, w, h) => { g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 16; g.lineJoin = 'round'; g.beginPath(); g.roundRect(24, 20, 464, 220, 80); g.moveTo(110, 232); g.lineTo(60, 322); g.lineTo(200, 238); g.closePath(); g.stroke(); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(120, 226); g.lineTo(82, 296); g.lineTo(186, 232); g.closePath(); g.fill(); txt(g, 'HIC!', w / 2, 130, 140, '#e8252b'); });
  const bubs = []; for (let i = 0; i < 3; i++) bubs.push(mkSprite(bubCv(), 1.25, .83));
  const lblCv = (text, c1, c2, w = 640) => cvs(w, 180, (g, ww, h) => { txt(g, text, ww / 2, 92, text.length > 9 ? 98 : 130, c1, { stroke: c2, sw: 24 }); });
  const lbClever = mkSprite(lblCv('CLEVER!', '#ffe23a', '#111'), 1.5, .42), lbBetter = mkSprite(lblCv('MUCH BETTER!', '#7dff6a', '#111'), 2.1, .6), lbBoo = mkSprite(lblCv('BOO!', '#ffffff', '#c41414', 420), 1.5, .64), lbWin = mkSprite(lblCv('WINNER!', '#ffe23a', '#111'), 1.8, .52);
  const mad = mkSprite(cvs(256, 256, (g) => { g.strokeStyle = '#e8252b'; g.lineWidth = 22; g.lineCap = 'round'; for (const [x, y, dx, dy] of [[70, 70, 1, 1], [186, 70, -1, 1], [70, 186, 1, -1], [186, 186, -1, -1]]) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx * 40, y); g.moveTo(x, y); g.lineTo(x, y + dy * 40); g.stroke(); } }), .5, .5);
  const starC = cvs(128, 128, (g) => { g.fillStyle = '#ffe23a'; g.strokeStyle = '#a86a00'; g.lineWidth = 6; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -PI / 2 + i * PI / 5, r = i % 2 ? 24 : 58; g.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke(); });
  const stars = []; for (let i = 0; i < 5; i++) stars.push(mkSprite(starC, .26, .26));
  const birdC = cvs(160, 120, (g) => { g.fillStyle = '#3fa7ff'; g.beginPath(); g.ellipse(70, 70, 40, 28, 0, 0, 7); g.fill(); g.beginPath(); g.arc(110, 52, 20, 0, 7); g.fill(); g.fillStyle = '#ffb21a'; g.beginPath(); g.moveTo(128, 50); g.lineTo(152, 58); g.lineTo(128, 64); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(114, 48, 4, 0, 7); g.fill(); g.fillStyle = '#2a7fd0'; g.beginPath(); g.ellipse(60, 56, 26, 12, -.5, 0, 7); g.fill(); });
  const birds = []; for (let i = 0; i < 2; i++) birds.push(mkSprite(birdC, .5, .38));
  // particles
  const dust = new Particles(S, 24, 0xe8dcc8, .2, { rough: .95 }), drops = new Particles(S, 10, 0x7fc8ff, .045, { emissive: 0x1a5a9a }), sweat = new Particles(S, 6, 0xbfe6ff, .05, { emissive: 0x2a6a9a });
  // speed lines
  const streaks = []; for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(1, .035, .035), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8, toneMapped: false })); m.visible = false; S.add(m); streaks.push(m); }

  // ------------------------------------------------------------------ camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3(); const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .02 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .02 + Math.cos(t * 57) * shake; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .008); };
  const dk = (x, y, z) => [x, y, z];
  const hicT = [[.45, 1.0, 1.55], [2.35], [4.9, 5.7], [.8, 3.4], [2.2, 2.8, 3.4, 3.95], [.5, 1.2, 2.2, 2.7, 3.2, 3.65, 4.0]];
  const C0 = [0, 5, 7, 15, 31, 78], C1 = [5, 7, 15, 31, 78, 101]; const DURS = tl.beats.map((b) => b.dur);
  const jolt = (times, lt) => { let j = 0; for (const th of times) { const d = lt - th; if (d >= 0 && d < .4) j = Math.max(j, Math.sin(d * 28) * Math.exp(-d * 9) + .5 * Math.exp(-d * 14)); } return j; };
  const NOTE = ['hiccups: on', 'fix 1: hold your breath', 'fix 2: drink upside down', 'fix 3: friend scares you', 'result: next county', 'it transferred to the groom'];
  const DOORX = 6.1;

  // ------------------------------------------------------------------ frame
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); hideAll();
    LR.visible = bi <= 1; CH.visible = bi === 2 || bi === 3 || bi === 5; RD.visible = bi === 4;
    const fx = { shock: false, puff: 0, purple: 0, red: 0 };
    let headTarget = null; let glassOn = false, sheetOn = false, bouqOn = false, trophyOn = false, madOn = false, streakOn = false;
    let popFor = YOU; const J = jolt(hicT[bi], lt);
    stars.forEach((s) => { s.visible = false; }); birds.forEach((s) => { s.visible = false; }); [lbClever, lbBetter, lbBoo, lbWin, mad].forEach((s) => { s.visible = false; }); bubs.forEach((s) => { s.visible = false; });
    dust.clear(); drops.clear(); sweat.clear(); streaks.forEach((s) => { s.visible = false; });
    let sceneCX = 0, sceneCZ = 0; let showGuests = false, lobbyOn = false, coupleOn = false, shockAll = false; let guestLook = 0; let groomJ = 0; let youPos = V3(0, 0, 0);
    const youArmsNose = (k) => ({ lx: -.15, lz: -.12, rx: lerp(-.15, -1.95, k), rz: lerp(.12, -.5, k) });

    if (bi === 0) {
      sceneCX = LX; sceneCZ = -1;
      place(YOU, LX, J * .05, -.6, 0, 'idle', .4); YOU.pitch = .05 + J * .12; YOU.extra = 0;
      const hold = smooth((lt - 1.75) / .3); const reach = smooth((lt - 1.65) / .25);
      YOU.arms = youArmsNose(reach); fx.puff = hold; fx.red = smooth((lt - 2.2) / 1.2) * .7;
      fx.shock = hicT[0].some((th) => lt >= th && lt < th + .18);
      if (hold > .02) YOU.pitch = .05 + .03 * Math.sin(lt * 9);
    } else if (bi === 1) {
      sceneCX = LX; sceneCZ = -1.4;
      const fu = clamp((lt - 1.42) / .42); const ang = PI / 2 * fu * fu; const sway = lt < 1.42 ? Math.sin(lt * 7.5) * (.03 + .08 * smooth(lt / 1.4)) : 0;
      place(YOU, LX, .17 * fu, -.6, 0, 'idle', .3); YOU.pitch = .05 + sway; YOU.lie = ang;
      if (lt > 1.84) { const d = lt - 1.84; YOU.lie = PI / 2 - Math.abs(Math.sin(d * 15)) * .1 * Math.exp(-d * 7); YOU.y = .17 + Math.abs(Math.sin(d * 15)) * .1 * Math.exp(-d * 7); }
      YOU.arms = fu < .05 ? youArmsNose(1) : { lx: -.1, lz: -.15, rx: -.1, rz: .15 };
      fx.puff = lt < 1.4 ? 1 : Math.max(0, 1 - (lt - 1.4) * 6); fx.purple = smooth((lt - .05) / 1.25); fx.red = (1 - fx.purple) * .7;
      fx.shock = lt > 1.4 && lt < 1.6;
    } else if (bi === 2) {
      sceneCX = 0; sceneCZ = -1; showGuests = true; coupleOn = true;
      const sw = Math.sin(lt * 2.6) * .09 + J * .12; place(YOU, 0, 2.68, 2.3, PI, 'idle', .3); YOU.lie = PI + sw;
      YOU.arms = { lx: PI - .25, lz: .2, rx: -2.8, rz: .6 }; glassOn = true; YOU.extra = 0;
      const rev = smooth((lt - 3.6) / .3); shockAll = lt > 3.7; fx.shock = lt > 3.75 || (lt > 4.8 && lt < 5.1);
      guestLook = rev; headTarget = 'you';
    } else if (bi === 3) {
      sceneCX = 0; sceneCZ = 3; showGuests = true; lobbyOn = true; coupleOn = true; streakOn = lt > 2.9;
      const scare = 1.95; const fall = clamp((lt - 2.15) / .5);
      // friend sneaks in under a sheet
      const wk = clamp(lt / 1.75); const fp = smooth(wk);
      const fxp = lerp(3.4, .5, fp), fzp = lerp(5.6, 3.3, fp);
      if (lt < 1.75) place(FR, fxp, 0, fzp, Math.atan2(.5 - 3.4, 3.3 - 5.6), 'walk', .35 + .15 * Math.sin(lt * 3));
      else place(FR, .5, 0, 3.3, Math.atan2(-.5, -1), 'idle', .5);
      sheetOn = true; FR.arms = { lx: -.4, lz: .25, rx: -.4, rz: -.25 };
      if (lt >= scare) { const j = smooth((lt - scare) / .12); FR.arms = { lx: -2.7, lz: .5, rx: -2.7, rz: -.5 }; FR.y = Math.sin(clamp((lt - scare) / .5) * PI) * .55; FR.z = 3.3 - .2 * j; }
      if (lt < scare) FR.arms = { lx: -1.2 + Math.sin(lt * 4) * .08, lz: .15, rx: -1.2 - Math.sin(lt * 4) * .08, rz: -.15 };
      FR.pitch = lt >= scare ? -.25 : .15;
      // you: hanging upside down, then flip off the bar and sprint through the door
      if (lt < 2.15) { place(YOU, 0, 2.68, 2.3, PI, 'idle', .3); YOU.lie = PI + Math.sin(lt * 2.6) * .09 + (lt > scare ? Math.sin((lt - scare) * 50) * .08 : 0) + J * .1; YOU.arms = { lx: PI - .25, lz: .2, rx: PI - .3, rz: -.2 }; fx.shock = lt > scare - .02; if (lt > scare) YOU.extra = .5; }
      else if (lt < 2.65) { const u = fall; place(YOU, 0, 2.68 * (1 - u * u), 2.3, PI, 'idle', .3); YOU.lie = PI + PI * smooth(u); YOU.arms = { lx: -2.7, lz: .5, rx: -2.7, rz: -.5 }; fx.shock = true; YOU.extra = .3; }
      else { const r = lt - 2.65; const k = Math.min(r / 1.5, 1); const px = lerp(0, 5.95, k * k * (3 - 2 * k) * 0 + k * k * .85 + k * .15), pz = lerp(2.3, 4.1, k); const out = lt > 4.12 ? (lt - 4.12) : 0; const X = lt <= 4.12 ? px : 5.95 + out * 11, Z = lt <= 4.12 ? pz : 4.1 + out * .6; place(YOU, X, Math.abs(Math.sin(lt * 10)) * .05, Z, lt <= 4.12 ? Math.atan2(5.95, 1.8) : Math.atan2(11, .6), 'sprint', 1.3); YOU.pitch = .25; fx.shock = true; YOU.arms = null; }
      // flung lobby guests
      lobby.forEach((g, n) => { const o = P[g.i]; place(o, g.x, 0, g.z, PI + (cr(n, 1) - .5), 'idle', .4); const tf = (g.x - 0.6) / 5.95 * 1.5 + 2.65 - .06; const d = lt - tf; if (d > 0) { const dir = n % 2 ? 1 : -1; const vz = dir * (3.2 + cr(n, 2) * 2), vx = 5 + cr(n, 3) * 3, vy = 6 + cr(n, 4) * 2.5; o.anim = 'panic'; o.speed = 1; o.x = g.x + vx * d * .5; o.z = g.z + vz * d * .6; o.y = Math.max(0, vy * d - 4.9 * d * d * 1.5); o.lie = d * 7 * (n % 2 ? 1 : -1); o.roll = d * 4; if (o.y <= 0 && d > .6) { o.y = 0; o.lie = PI / 2; o.roll = 0; } } else { o.arms = { lx: -.2, lz: .1, rx: -.2, rz: -.1 }; } });
      if (lt > 4.12) { /* door burst */ }
      guestLook = 1; headTarget = 'you';
    } else if (bi === 4) {
      sceneCX = RX; sceneCZ = -3;
      const run = clamp(lt / 1.15); const zz = lerp(-46, -2.2, 1 - Math.pow(1 - run, 3));
      if (lt < 1.15) { place(YOU, RX, Math.abs(Math.sin(lt * 14)) * .06, zz, 0, 'sprint', 1.6); YOU.pitch = .3; streakOn = true; fx.shock = true; }
      else { const s = lt - 1.15; place(YOU, RX + .2, 0, -2.2, .25, 'bend', .6); YOU.pitch = .75 + .12 * Math.sin(lt * 11) + J * .2; YOU.arms = { lx: -.5, lz: .1, rx: -.5, rz: -.1 }; fx.shock = hicT[4].some((th) => lt >= th && lt < th + .18);  }
    } else {
      sceneCX = 0; sceneCZ = -4; coupleOn = true; showGuests = true; guestLook = 0; bouqOn = true; trophyOn = true; madOn = true;
      groomJ = jolt(hicT[5], lt);
    }

    // ---- church cast
    if (coupleOn) {
      place(PA, 0, .35, -7.0, 0, 'idle', .3); PA.arms = { lx: -1.2, lz: .1, rx: -1.2, rz: -.1 };
      place(BR, -1.05, .35, -5.95, .35, 'idle', .3); place(GR, 1.05, .35, -5.95, -.35, 'idle', .3); BR.arms = { lx: -.3, lz: -.1, rx: -.4, rz: .1 }; GR.arms = { lx: -.4, lz: .1, rx: -.3, rz: -.1 };
      if (bi === 5) { place(FR, 0, .35, -5.2, .0, 'idle', .6); FR.arms = { lx: -.9, lz: .3, rx: -2.75 + Math.sin(lt * 4) * .08, rz: -.3 }; FR.pitch = -.08; FR.y = .35 + Math.abs(Math.sin(lt * 5)) * .06;
        BR.yaw = .85; BR.arms = { lx: -1.15, lz: .85, rx: -1.15, rz: -.85 }; BR.pitch = .02; BR.y = .35; BR.x = -1.15; if (Math.sin(lt * 7) > .6) BR.yaw += .05; GR.pitch = .05 + groomJ * .25; GR.y = .35 + groomJ * .12; GR.yaw = -.2; GR.arms = { lx: -.3, lz: .1, rx: -.3 - groomJ * .4, rz: -.1 }; }
      if (bi === 2 || bi === 3) { GR.arms = { lx: -.9, lz: .2, rx: -.3, rz: -.1 }; if (lt > 3.7 || bi === 3) { PA.arms = { lx: -2.4, lz: .5, rx: -2.4, rz: -.5 }; BR.arms = { lx: -2.5, lz: .4, rx: -2.5, rz: -.4 }; GR.arms = { lx: -2.5, lz: .4, rx: -2.5, rz: -.4 }; if (bi === 2) { BR.yaw = 0; GR.yaw = 0; } } }
    }
    if (showGuests) guests.forEach((g, n) => { const o = P[g.i]; const base = PI + (cr(n, 9) - .5) * .25; place(o, g.x, -.3, g.z, base, 'sit', .4); o.arms = { lx: -.15, lz: -.1, rx: -.15, rz: .1 };
      if (guestLook > 0) { const tx = (bi === 3 ? Math.min(6, Math.max(0, (lt - 2.65) * 4)) : 0), tz = bi === 3 ? 2.3 + Math.max(0, (lt - 2.65)) * 1.2 : 2.3; const look = Math.atan2(tx - g.x, tz - g.z); const d = cr(n, 5) * .5; const u = bi === 2 ? smooth((lt - 3.62 - d * .5) / .25) : 1; let dy = look - base; while (dy > PI) dy -= 2 * PI; while (dy < -PI) dy += 2 * PI; o.yaw = base + dy * u * 1.0; if (u > .5 && bi === 3) o.y = -.3 + (lt > 2.0 && lt < 2.5 ? Math.abs(Math.sin((lt - 2.0) * 14)) * .15 : 0); } });
    crowd.setFace((fx.shock || shockAll) ? 'shock' : 'calm'); tint(fx.purple, fx.red); crowd.update(t);

    // ---- props that follow bodies
    const headY = hp(YOU, 'head'), headF = hp(FR, 'head'), headG = hp(GR, 'head'), headB = hp(BR, 'head'), hRy = hp(YOU, 'handR');
    youPos = hp(YOU, 'torso');
    cheeks.forEach((c, i) => { const on = fx.puff > .02 && bi <= 1; c.visible = on; if (on) { attach(c, YOU, 'head', [(i ? 1 : -1) * (.2 + .03 * fx.puff), -.07, .13]); c.matrix.scale(V3(1 + fx.puff * .38, 1 + fx.puff * .34, 1 + fx.puff * .3)); c.visible = true; c.material.color.copy(tmpC); } });
    glass.visible = glassOn; if (glassOn) { const hh = hp(YOU, 'handR'); glass.position.set(hh.x, hh.y + .02, hh.z - .1 + Math.sin(t * 5) * .01); glass.rotation.set(-.3 - .1 * Math.sin(t * 3), 0, 0); }
    sheet.visible = sheetOn; if (sheetOn) { attach(sheet, FR, 'torso', [0, .15, 0]); const sc = bi === 3 && lt >= 1.95 ? 1 + .3 * Math.exp(-(lt - 1.95) * 4) : 1; sheet.matrix.scale(V3(sc, sc, sc)); sheet.visible = true; }
    bouquet.visible = bouqOn; if (bouqOn) { attach(bouquet, FR, 'handL', [0, .1, .05], [-.3, 0, 0]); bouquet.visible = true; }
    trophy.visible = trophyOn; if (trophyOn) { attach(trophy, FR, 'handR', [0, .12, .0], [0, 0, 0]); trophy.visible = true; }
    veil.visible = coupleOn; dress.visible = coupleOn; bowtie.visible = coupleOn; robe.visible = coupleOn;
    if (coupleOn) { attach(veil, BR, 'head', [0, .27, -.04]); veil.visible = true; attach(dress, BR, 'torso', [0, -.5, 0]); dress.visible = true; attach(bowtie, GR, 'torso', [0, .28, .18]); bowtie.visible = true; attach(robe, PA, 'torso', [0, -.45, 0]); robe.visible = true; }
    // water drops under the glass
    if (bi === 2 && lt < 3.2) for (let i = 0; i < 6; i++) { const ph = (t * 1.3 + i / 6) % 1; const gp = V3(headY.x + .02 + (cr(i, 1) - .5) * .06, headY.y - .1, headY.z + .3 + (cr(i, 2) - .5) * .06); drops.set(i, gp.x, Math.max(.03, gp.y - ph * ph * gp.y * 1.1), gp.z, 1); }
    // sweat
    if (bi === 4 && lt > 1.2) for (let i = 0; i < 5; i++) { const ph = (t * 1.1 + i / 5) % 1; sweat.set(i, headY.x + (i % 2 ? .34 : -.34) + (cr(i, 3) - .5) * .1, headY.y + .1 - ph * .5, headY.z + .1, Math.sin(ph * PI)); }
    // door leaves + dust at the door burst
    if (CH.visible) { const hit = bi === 3 ? lt - 4.06 : -1; const open = hit > 0 ? (1 - Math.exp(-hit * 11) * Math.cos(hit * 9)) * 1.75 : 0; doorL.rotation.y = -open; doorR.rotation.y = open; if (bi === 5 || bi === 2) { doorL.rotation.y = 0; doorR.rotation.y = 0; } if (bi === 3 && hit > 0) for (let i = 0; i < 14; i++) { const ph = hit * 1.3; dust.set(i, 6.4 + cr(i, 1) * 2.2 * ph * 2, .3 + cr(i, 2) * .9 * ph * 2, 3.2 + cr(i, 3) * 2.2, clamp(ph * 3) * (1 - ph * .8)); } }
    dust.done(); drops.done(); sweat.done();
    // speed lines
    if (streakOn) { const dirv = bi === 3 ? V3(Math.sin(YOU.yaw), 0, Math.cos(YOU.yaw)) : V3(0, 0, 1); streaks.forEach((m, i) => { const ph = (t * 6 + i * .37) % 1; const len = 1.8 + cr(i, 1) * 1.6; const back = 1.2 + ph * 3.2; m.visible = bi === 3 ? lt < 4.9 : true; m.scale.set(len, 1, 1); const side = (cr(i, 2) - .5) * 1.8; const up = .2 + cr(i, 3) * 1.6; const px = YOU.x - dirv.x * back + dirv.z * side * .0; m.position.set(YOU.x - dirv.x * back, YOU.y + up, YOU.z - dirv.z * back + (bi === 3 ? side * .4 : side)); m.rotation.y = Math.atan2(-dirv.z, dirv.x); m.material.opacity = (1 - ph) * .8; }); }
    // ---- labels / bubbles (world sprites)
    const sp = (s, pos, k = 1) => { s.visible = true; s.position.copy(pos); s.scale.set(s.userData.w * k, s.userData.h * k, 1); };
    const hic = hicT[bi]; let bn = 0; hic.forEach((th) => { const d = lt - th; if (d >= 0 && d < .7 && bn < 3) { const tgt = bi === 5 ? headG : headY; const k = (d < .14 ? 1.25 * (d / .14) : 1.25 - .25 * clamp((d - .14) / .1)) * (d > .55 ? 1 - (d - .55) / .15 : 1); const off = bi === 2 ? V3(.6, .55, 0) : bi === 4 ? V3(.45, .62, 0) : bi === 3 ? V3(.7, 1.0, 0) : bi === 5 ? V3(-.45, .85, .3) : V3(.3, .62, .1); sp(bubs[bn], V3(tgt.x + off.x, tgt.y + off.y, tgt.z + off.z), Math.max(.01, k) * (bi === 4 ? .8 : bi === 0 ? .62 : .8)); bn++; } });
    if (bi === 1 && lt > .1 && lt < 1.35) sp(lbClever, V3(headY.x + .0, headY.y + .85 + Math.min(.1, (lt - .1) * .4), headY.z + .1), Math.min(1.1, (lt - .1) * 6) * 1.35);
    if (bi === 2 && lt > 2.3 && lt < 3.6) sp(lbBetter, V3(headY.x + .75, headY.y + .6, headY.z + .3), Math.min(1.1, (lt - 2.3) * 6) * .6);
    if (bi === 3 && lt > 1.95 && lt < 2.9) sp(lbBoo, V3(FR.x + .05, 2.55 + Math.min(.15, (lt - 1.95) * .5), FR.z), Math.min(1.15, (lt - 1.95) * 8) * 1.4);
    if (bi === 5 && lt > .25 && lt < 3.0) sp(lbWin, V3(FR.x, 3.0, FR.z), Math.min(1.1, (lt - .25) * 6) * 1.0);
    if (madOn) { sp(mad, V3(headB.x - .05, headB.y + .5 + .04 * Math.sin(lt * 12), headB.z + .2), 1 + .15 * Math.sin(lt * 12)); }
    // stars + birds circling the fallen head
    if (bi === 1 && lt > 1.95) { const hy = headY; const d = lt - 1.95; stars.forEach((s, i) => { const a = d * 5 + i * 1.256; sp(s, V3(hy.x + Math.cos(a) * .55, hy.y + .5 + Math.sin(a * 2) * .04, hy.z + Math.sin(a) * .3), Math.min(1, d * 6) * (1 + .15 * Math.sin(d * 14 + i))); }); birds.forEach((s, i) => { const a = -d * 3.4 + i * PI; sp(s, V3(hy.x + Math.cos(a) * .95, hy.y + .95 + Math.sin(d * 5 + i) * .08, hy.z + Math.sin(a) * .5), Math.min(1, d * 5)); }); }

    // ---- camera
    const an = { hy: headY, hf: headF, hg: headG, ht: youPos, yp: V3(YOU.x, YOU.y, YOU.z) };
    const hyF = (dx, dy, dz) => (a) => [a.hy.x + dx, a.hy.y + dy, a.hy.z + dz]; const hgF = (dx, dy, dz) => (a) => [a.hg.x + dx, a.hg.y + dy, a.hg.z + dz];
    if (bi === 0) rig(lt, [[0, dk(LX + 3.0, 1.8, 3.4), dk(LX + 2.6, 1.78, 3.0), dk(LX, 1.15, -.6), dk(LX, 1.15, -.6), 42, 38], [1.45, dk(LX + 1.6, 1.85, 3.0), dk(LX + 1.3, 1.9, 2.8), hyF(0, -.02, 0), hyF(0, -.02, 0), 32, 29]], an, t);
    else if (bi === 1) rig(lt, [[0, dk(LX + 1.3, 1.9, 2.8), dk(LX + 1.5, 1.9, 3.0), hyF(0, -.02, 0), hyF(0, -.02, 0), 29, 31], [1.2, dk(LX + 3.3, 2.2, 2.5), dk(LX + 3.0, 2.0, 2.2), dk(LX, .9, -1.3), dk(LX, .6, -1.5), 44, 40]], an, t);
    else if (bi === 2) rig(lt, [[0, dk(1.9, .9, 6.5), dk(1.6, .9, 6.2), hyF(0, -.05, 0), hyF(0, -.05, 0), 36, 36], [2.9, dk(1.6, .9, 6.2), dk(0, 4.8, 7.4), hyF(0, -.05, 0), dk(0, 1.0, -2.0), 38, 52], [4.3, dk(0, 4.8, 7.4), dk(0, 4.6, 7.0), dk(0, 1.0, -2.0), dk(0, .9, -1.2), 52, 48]], an, t);
    else if (bi === 3) rig(lt, [[0, dk(-5.5, 1.7, 5.8), dk(-5.5, 1.7, 5.8), dk(.3, 1.2, 3.0), dk(.3, 1.2, 3.0), 52, 50], [1.7, dk(-5.5, 1.7, 5.8), dk(-5.5, 1.7, 5.8), dk(.3, 1.2, 3.0), dk(.2, 1.2, 2.8), 46, 44], [2.65, dk(-5.5, 1.8, 5.8), dk(-4.5, 1.9, 6.2), (a) => [a.yp.x * .6 + .2, 1.1, 3.0], (a) => [a.yp.x * .8 + .8, 1.1, 3.7], 48, 52], [4.0, dk(-2.5, 1.9, 6.4), dk(.5, 2.0, 6.8), dk(6.5, 1.1, 4.2), dk(7.5, 1.1, 4.2), 50, 44]], an, t, lt > 4.1 && lt < 4.5 ? .02 : 0);
    else if (bi === 4) rig(lt, [[0, dk(RX + .6, 1.2, 3.2), dk(RX + .4, 1.3, 2.8), dk(RX - .2, 1.3, -25), (a) => [RX, 1.3, a.yp.z], 38, 34], [1.1, dk(RX + 2.4, 1.5, 2.6), dk(RX + 2.1, 1.55, 2.3), dk(RX - 1.2, 1.6, -4.5), dk(RX - 1.0, 1.6, -4.3), 40, 38], [2.1, dk(RX + 2.6, 1.5, 2.2), dk(RX + 2.2, 1.45, 1.8), (a) => [a.hy.x - .3, a.hy.y - .15, a.hy.z], (a) => [a.hy.x - .25, a.hy.y - .15, a.hy.z], 38, 36]], an, t);
    else rig(lt, [[0, dk(0, 2.1, 4.6), dk(0, 2.0, 4.0), dk(0, 1.5, -6), dk(0, 1.55, -6), 46, 44], [1.9, dk(0, 2.0, 4.0), dk(.5, 1.9, -.4), dk(0, 1.55, -6), (a) => [a.hg.x - .2, a.hg.y - .1, a.hg.z], 44, 36]], an, t);
    globalThis.__dbg = { hand: hp(YOU,'handR').toArray(), head: headY.toArray(), handL: hp(YOU,'handL').toArray() };
    A.follow(sceneCX, sceneCZ); A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    const u = clamp(lt / (DURS[bi] * .95)); const VAL = Math.floor(lerp(C0[bi], C1[bi], u * (2 - u)));
    hud.counter('HICCUPS', String(VAL), NOTE[bi], '', bi >= 2);
    hud.tm(''); hud.pop('', 0);
  } };
}
