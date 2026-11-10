// 668 invention chain: someone steals your lunch -> name label -> label swap -> chained fridge -> security guard eats it -> safe stolen -> it was the boss.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, Particles, clamp, smooth, lerp, attach, dropBounce } = lib;
  const A = makeStage({ fog: 0xe6e0d4, fogNear: 40, fogFar: 130, clouds: false, skyTop: 0xd9d3c6, skyMid: 0xe6e0d4, skyBot: 0xeee9de, shadowExtent: 15, shadowRes: 2048, hemi: 1.9, sunI: 1.5, sunDir: [-.3, 1, .7], exposure: 1.08 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const plane = (w, h, tex, x, y, z, ry = 0, o = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: .8, transparent: !!o.tr })); m.position.set(x, y, z); m.rotation.y = ry; if (o.g) o.g.add(m); else S.add(m); return m; };
  const gold = new THREE.MeshStandardMaterial({ color: 0xd9a92e, roughness: .3, metalness: .85 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x8a919c, roughness: .35, metalness: .85 }); const steelD = new THREE.MeshStandardMaterial({ color: 0x5d636d, roughness: .4, metalness: .85 });
  const box = (g, w, h, d, x, y, z, m) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; g.add(b); return b; };

  // ------------------------------------------------------------------ break room
  const FZ = -3.0; // fridge center z (front face at -2.5)
  { const fl = cvs(256, 256, (g) => { g.fillStyle = '#c9c3b4'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#b6af9e'; g.fillRect(0, 0, 128, 128); g.fillRect(128, 128, 128, 128); }); fl.t.wrapS = fl.t.wrapT = THREE.RepeatWrapping; fl.t.repeat.set(14, 8);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(28, 16), new THREE.MeshStandardMaterial({ map: fl.t, roughness: .6 })); f.rotation.x = -Math.PI / 2; f.position.set(0, 0, 4.4); f.receiveShadow = true; S.add(f);
    addBox(S, 0, 2.0, -3.62, 28, 4.0, .2, 0xe4dcc8); addBox(S, -13.9, 2.0, 3, .2, 4.0, 14, 0xdcd3be); addBox(S, 13.9, 2.0, 3, .2, 4.0, 14, 0xdcd3be);
    addBox(S, 0, .12, -3.5, 28, .24, .06, 0x8a7d66, { cast: false });
    // exit doorway in the back wall at x=4 (dark hallway behind)
    addBox(S, 4, 3.4, -3.5, 1.5, .5, .3, 0xd0c7b0); addBox(S, 4, 1.1, -4.5, 1.3, 2.4, .1, 0x23242a, { cast: false });
    const ex = cvs(256, 96, (g, w, h) => { g.fillStyle = '#16a34a'; g.fillRect(0, 0, w, h); txt(g, 'EXIT', w / 2, 52, 62, '#fff'); }); plane(.7, .26, ex.t, 4, 3.0, -3.34); }
  // wall decor: clock (12:00), rules poster
  const clockT = cvs(256, 256, (g) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 128, 122, 0, 7); g.fill(); g.lineWidth = 10; g.strokeStyle = '#222'; g.stroke(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.lineWidth = i % 3 ? 4 : 8; g.beginPath(); g.moveTo(128 + Math.sin(a) * 100, 128 - Math.cos(a) * 100); g.lineTo(128 + Math.sin(a) * 114, 128 - Math.cos(a) * 114); g.stroke(); } g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 52); g.stroke(); g.lineWidth = 8; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 28); g.stroke(); g.fillStyle = '#d33'; g.beginPath(); g.arc(128, 128, 9, 0, 7); g.fill(); });
  plane(1.0, 1.0, clockT.t, -3.2, 3.0, -3.5);
  { const pt = cvs(256, 320, (g, w, h) => { g.fillStyle = '#fff6c9'; g.fillRect(0, 0, w, h); g.fillStyle = '#c0392b'; g.fillRect(0, 0, w, 60); txt(g, 'FRIDGE RULES', w / 2, 32, 34, '#fff'); for (let i = 0; i < 4; i++) { g.fillStyle = '#444'; g.fillRect(34, 100 + i * 52, 190 - i * 24, 10); g.strokeStyle = '#444'; g.lineWidth = 3; g.strokeRect(16, 92 + i * 52, 14, 14); } txt(g, 'DO NOT STEAL', w / 2, 290, 30, '#c0392b'); }); plane(.8, 1.0, pt.t, -1.9, 2.2, -3.5); }
  // counter along back wall (left): microwave, coffee, plant
  { const g = new THREE.Group(); S.add(g); box(g, 4.4, .95, .72, -4.3, .475, -3.2, mat(0x9b8467)); box(g, 4.5, .06, .78, -4.3, .98, -3.2, mat(0x3e3f44, { roughness: .4 })); box(g, .8, .42, .5, -5.4, 1.24, -3.2, mat(0xd7d9dc, { metalness: .3, roughness: .4 })); box(g, .5, .3, .04, -5.5, 1.24, -2.94, mat(0x111418)); box(g, .3, .4, .3, -3.6, 1.2, -3.2, mat(0x2b2d32)); box(g, .22, .14, .22, -3.6, 1.0, -3.1, mat(0xffffff)); const pot = new THREE.Mesh(new THREE.CylinderGeometry(.2, .15, .3, 12), mat(0xb5532a)); pot.position.set(-6.4, 1.15, -3.2); g.add(pot); const lf = new THREE.Mesh(new THREE.IcosahedronGeometry(.32, 1), mat(0x3f8a3c, { flatShading: true })); lf.position.set(-6.4, 1.55, -3.2); g.add(lf); }
  // desk-lined cubicle hint on the right wall
  addBox(S, 12.4, .5, 1.5, 1.2, 1.0, 2.4, 0x8a7d66); addBox(S, 12.4, 1.1, 1.5, .8, .5, .6, 0x30343c);

  // ------------------------------------------------------------------ fridge
  const FR = new THREE.Group(); S.add(FR); const whiteF = mat(0xeef0f2, { roughness: .35 }); const inner = mat(0xdde6ee, { roughness: .6 });
  box(FR, .08, 2.2, 1.0, -.79, 1.1, FZ, whiteF); box(FR, .08, 2.2, 1.0, .79, 1.1, FZ, whiteF); box(FR, 1.66, .1, 1.0, 0, 2.15, FZ, whiteF); box(FR, 1.66, .1, 1.0, 0, .05, FZ, whiteF); box(FR, 1.5, 2.1, .06, 0, 1.1, FZ - .47, inner);
  const shelfY = [.62, 1.12, 1.62]; shelfY.forEach((y) => box(FR, 1.5, .04, .9, 0, y, FZ, mat(0xbfd3e3, { roughness: .2, transparent: true, opacity: .7 })));
  const fridgeLight = new THREE.PointLight(0xfff4dd, 0, 4); fridgeLight.position.set(0, 1.4, FZ + .1); S.add(fridgeLight);
  const doorG = new THREE.Group(); doorG.position.set(.79, 0, FZ + .5); FR.add(doorG); // hinge on right; door spans local -x
  { box(doorG, 1.58, 2.2, .1, -.79, 1.1, .05, whiteF); box(doorG, .06, .9, .08, -1.45, 1.2, .14, steel); const mag = cvs(64, 64, (g) => { g.fillStyle = '#e4572e'; g.fillRect(0, 0, 64, 64); }); box(doorG, .16, .16, .02, -.35, 1.9, .11, mat(0xe4572e)); box(doorG, .16, .12, .02, -.6, 1.5, .11, mat(0x2ea3e4)); }
  const setDoor = (a) => { doorG.rotation.y = a; };
  // thing inside: milk, yogurt, salad, bag B
  const milk = new THREE.Group(); box(milk, .16, .3, .16, 0, .15, 0, mat(0xffffff)); box(milk, .16, .08, .16, 0, .34, 0, mat(0x3a8fe4)); S.add(milk);
  const yog = new THREE.Group(); { const c = new THREE.Mesh(new THREE.CylinderGeometry(.09, .07, .13, 14), mat(0xff8fb1)); c.position.y = .065; c.castShadow = true; yog.add(c); const l = new THREE.Mesh(new THREE.CylinderGeometry(.095, .095, .02, 14), mat(0xf4f4f4)); l.position.y = .14; yog.add(l); S.add(yog); }
  // label factory
  const mkLabel = (name, prog = 1, bg = '#fffdf0') => { const L = cvs(512, 256, null); L.draw = (p) => { const g = L.g; g.clearRect(0, 0, 512, 256); g.fillStyle = bg; g.fillRect(0, 0, 512, 256); g.fillStyle = '#e63946'; g.fillRect(0, 0, 512, 54); txt(g, 'HELLO MY NAME IS', 256, 29, 32, '#fff'); g.save(); g.beginPath(); g.rect(0, 60, 512 * p, 196); g.clip(); txt(g, name, 256, 160, name.length > 4 ? 100 : 130, '#12275e', { w: 900 }); g.restore(); L.t.needsUpdate = true; }; L.draw(prog); return L; };
  const mkBag = (L, w = .46, h = .5) => { const g = new THREE.Group(); box(g, w, h, .26, 0, h / 2, 0, mat(0xb98a55, { roughness: .95 })); const top = box(g, w - .02, .1, .27, 0, h + .02, 0, mat(0xa07644)); top.rotation.z = .05; plane(w * .82, w * .82 * .5, L.t, 0, h * .5, .132, 0, { g }); S.add(g); return g; };
  const LA = mkLabel('SAM', 0); const bagA = mkBag(LA); const LB = mkLabel('KEN'); const bagB = mkBag(LB);
  const LS = mkLabel('SAM'); const sticker = plane(.38, .19, LS.t, 0, 0, 0); sticker.visible = false;
  // salad bowl
  const salad = new THREE.Group(); { const b = new THREE.Mesh(new THREE.CylinderGeometry(.24, .17, .16, 18, 1, true), new THREE.MeshStandardMaterial({ color: 0xcfeaff, transparent: true, opacity: .45, side: THREE.DoubleSide, roughness: .1 })); b.position.y = .08; salad.add(b); const bt = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .02, 18), mat(0xcfeaff)); bt.position.y = .01; salad.add(bt); for (let i = 0; i < 14; i++) { const l = new THREE.Mesh(new THREE.IcosahedronGeometry(.075, 0), mat([0x4aa84a, 0x7ccf5a, 0xe8452e, 0xf2d14a][i % 4], { flatShading: true })); const a = cr(i, 3) * 6.28, r = cr(i, 4) * .15; l.position.set(Math.cos(a) * r, .1 + cr(i, 5) * .08, Math.sin(a) * r); l.castShadow = true; salad.add(l); } S.add(salad); }
  // sandwich
  const sandwich = new THREE.Group(); { box(sandwich, .34, .06, .24, 0, 0, 0, mat(0xe3b878)); box(sandwich, .36, .03, .26, 0, .05, 0, mat(0x56b84a)); box(sandwich, .34, .04, .24, 0, .09, 0, mat(0xe86a6a)); box(sandwich, .33, .03, .23, 0, .13, 0, mat(0xffc82a)); box(sandwich, .34, .06, .24, 0, .18, 0, mat(0xe3b878)); sandwich.visible = false; S.add(sandwich); }
  const SANDY = 1.0 + (1.12 - 1.0);
  // chain + padlock
  const links = []; const NL = 52; { const lm = mat(0x9aa3ae, { metalness: .9, roughness: .3 }); for (let i = 0; i < NL; i++) { const l = new THREE.Mesh(new THREE.TorusGeometry(.075, .028, 8, 14), lm); l.castShadow = true; l.visible = false; S.add(l); links.push(l); } }
  const chainPt = (u) => { const hw = .86, hd = .56, cx = 0, cz = FZ; const per = 2 * (2 * hw + 2 * hd); let d = ((u + .5 * (2 * hw) / per) % 1) * per; const segs = [[hw, 0, -1, 0, 2 * hw], [0, 0, 0, -1, 2 * hd], [0, 0, 1, 0, 2 * hw], [0, 0, 0, 1, 2 * hd]]; // front (+z side) first
    let x, z, dir; if (d < 2 * hw) { x = hw - d; z = hd; dir = 0; } else if ((d -= 2 * hw) < 2 * hd) { x = -hw; z = hd - d; dir = 1; } else if ((d -= 2 * hd) < 2 * hw) { x = -hw + d; z = -hd; dir = 0; } else { d -= 2 * hw; x = hw; z = -hd + d; dir = 1; } return [cx + x, cz + z, dir]; };
  const padlock = new THREE.Group(); { box(padlock, .3, .26, .12, 0, 0, 0, gold); const sh = new THREE.Mesh(new THREE.TorusGeometry(.1, .03, 8, 16, Math.PI), steel); sh.position.y = .13; padlock.add(sh); const kh = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .02, 8), mat(0x222222)); kh.rotation.x = Math.PI / 2; kh.position.set(0, -.02, .07); padlock.add(kh); box(padlock, .02, .08, .02, 0, -.06, .07, mat(0x222222)); padlock.scale.setScalar(1.8); padlock.visible = false; S.add(padlock); }
  const keyM = new THREE.Group(); { box(keyM, .06, .22, .02, 0, 0, 0, gold); const k = new THREE.Mesh(new THREE.TorusGeometry(.06, .02, 6, 12), gold); k.position.y = .15; keyM.add(k); keyM.visible = false; S.add(keyM); }

  // ------------------------------------------------------------------ desk + safe (beat 4)
  const DX = 2.0, DZ = -1.6, DTOP = .92;
  const deskG = new THREE.Group(); S.add(deskG);
  { box(deskG, 1.7, .08, .85, DX, DTOP - .04, DZ, mat(0x8a5a30)); [-.75, .75].forEach((x) => { box(deskG, .1, DTOP - .08, .75, DX + x, (DTOP - .08) / 2, DZ, mat(0x6b4524)); }); box(deskG, 1.5, .5, .04, DX, .55, DZ - .35, mat(0x7a4e28));
    const mon = new THREE.Group(); box(mon, .6, .4, .04, 0, .5, 0, mat(0x14161a)); box(mon, .56, .34, .01, 0, .5, .026, mat(0x2a6fb8, { emissive: 0x143a66, emissiveIntensity: .5 })); box(mon, .06, .26, .06, 0, .22, 0, steelD); box(mon, .24, .02, .16, 0, .09, 0, steelD); mon.position.set(DX + .45, DTOP, DZ - .2); deskG.add(mon); }
  const SAFE = new THREE.Group(); S.add(SAFE); const SW = .86, SH = .74, SD = .62;
  { const T = .09; box(SAFE, SW, T, SD, 0, SH - T / 2, 0, steel); box(SAFE, SW, T, SD, 0, T / 2, 0, steel); box(SAFE, T, SH, SD, -SW / 2 + T / 2, SH / 2, 0, steel); box(SAFE, T, SH, SD, SW / 2 - T / 2, SH / 2, 0, steel); box(SAFE, SW, SH, .06, 0, SH / 2, -SD / 2 + .03, steelD); box(SAFE, SW - .2, .03, SD - .1, 0, .3, 0, steelD); for (const sx of [-.34, .34]) box(SAFE, .12, .05, .12, sx, -.02, 0, steelD); }
  const sdoor = new THREE.Group(); sdoor.position.set(-SW / 2, 0, SD / 2); SAFE.add(sdoor); let dialF;
  { const DW = SW - .02; box(sdoor, DW, SH - .02, .08, DW / 2, SH / 2, .04, steel); box(sdoor, DW - .12, SH - .14, .02, DW / 2, SH / 2, .09, steelD);
    const dt = cvs(256, 256, (g) => { g.fillStyle = '#1a1c20'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.strokeStyle = '#e8e8ea'; g.lineWidth = 6; for (let i = 0; i < 36; i++) { const a = i / 36 * 6.283, l = i % 3 ? 12 : 26; g.beginPath(); g.moveTo(128 + Math.cos(a) * (112 - l), 128 + Math.sin(a) * (112 - l)); g.lineTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112); g.stroke(); } g.fillStyle = '#c92a1e'; g.beginPath(); g.moveTo(128, 6); g.lineTo(142, 40); g.lineTo(114, 40); g.fill(); });
    dialF = new THREE.Mesh(new THREE.CircleGeometry(.15, 32), new THREE.MeshStandardMaterial({ map: dt.t, roughness: .4, metalness: .3 })); dialF.position.set(DW * .34, SH * .6, .105); sdoor.add(dialF);
    const hand = new THREE.Group(); hand.position.set(DW * .74, SH * .5, .11); sdoor.add(hand); for (let i = 0; i < 3; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(.3, .045, .04), steel); sp.rotation.z = i * Math.PI / 3; hand.add(sp); } sdoor.userData.wheel = hand;
    const nameT = cvs(256, 64, (g, w, h) => { g.fillStyle = '#c9a34a'; g.fillRect(0, 0, w, h); txt(g, 'SAM ONLY', w / 2, 34, 40, '#2a1d06'); }); plane(.4, .1, nameT.t, DW * .5, SH * .17, .102, 0, { g: sdoor }); }
  const safeCarry = { on: false };

  // ------------------------------------------------------------------ boss office (offset)
  const X0 = 24; const bossG = new THREE.Group(); S.add(bossG);
  { const cp = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), mat(0x5b2d34, { roughness: 1 })); cp.rotation.x = -Math.PI / 2; cp.position.set(X0, .01, 2); cp.receiveShadow = true; S.add(cp);
    addBox(S, X0, 2.2, -3.8, 14, 4.4, .2, 0x2f3b4a); addBox(S, X0 - 6.9, 2.2, 1, .2, 4.4, 10, 0x2f3b4a); addBox(S, X0 + 6.9, 2.2, 1, .2, 4.4, 10, 0x2f3b4a);
    const win = cvs(256, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#6aa9e8'); gr.addColorStop(1, '#d9ecfa'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); g.fillStyle = '#7d8aa0'; for (let i = 0; i < 9; i++) g.fillRect(i * 30 - 4, 256 - 60 - (i * 37 % 90), 26, 200); g.fillStyle = '#fff'; g.fillRect(124, 0, 8, 256); g.fillRect(0, 124, 256, 8); }); plane(3.4, 2.4, win.t, X0, 2.2, -3.68);
    const fr = new THREE.Mesh(new THREE.BoxGeometry(3.6, .1, .1), mat(0xe8e4dc)); fr.position.set(X0, 3.45, -3.66); S.add(fr);
    box(S, 2.6, .12, 1.2, X0, .9, -1.35, mat(0x4a2a18)); box(S, 2.4, .86, 1.0, X0, .43, -1.35, mat(0x3b2012)); box(S, .8, .86, .06, X0 - .6, .43, -.82, mat(0x2e180d)); // desk
    box(S, 1.0, 1.0, .12, X0, .95, -2.35, mat(0x1e1e24, { roughness: .6 })); box(S, .9, .6, .12, X0, 1.7, -2.4, mat(0x1e1e24)); box(S, .12, .06, .5, X0 - .6, .3, -2.3, steelD);
    const plt = cvs(256, 80, (g, w, h) => { g.fillStyle = '#d9a92e'; g.fillRect(0, 0, w, h); g.strokeStyle = '#7a5a10'; g.lineWidth = 6; g.strokeRect(5, 5, w - 10, h - 10); txt(g, 'BOSS', w / 2, 44, 62, '#2a1d06'); });
    const np = new THREE.Mesh(new THREE.BoxGeometry(.96, .3, .06), [mat(0xb8901f), mat(0xb8901f), mat(0xb8901f), mat(0xb8901f), new THREE.MeshStandardMaterial({ map: plt.t, metalness: .5, roughness: .4 }), mat(0xb8901f)]); np.position.set(X0 + .1, .96 + .15, -.82); np.rotation.x = -.28; np.castShadow = true; S.add(np); }
  const pile = []; { const names = ['SAM', 'DEB', 'RAJ', 'LEE', 'KIM', 'MO', 'TINA', 'JOE', 'AMY', 'BOB', 'ZOE', 'ED']; names.forEach((n, i) => { const L = mkLabel(n); const b = mkBag(L, .5, .46); const row = i % 6 < 3 ? 0 : 1, cc = i % 3; b.position.set(X0 - 2.7 + cc * .56 + (row ? .26 : 0) - (i > 5 ? .0 : 0), 0, -1.7 + (i > 5 ? .0 : 0)); b.position.y = i >= 6 ? .5 : 0; b.position.x = X0 - 2.9 + cc * .56 + (i >= 6 ? .28 : 0); b.position.z = -1.4 + ((i % 6) >= 3 ? .45 : 0); b.rotation.y = (cr(i, 7) - .5) * .5; pile.push(b); }); }
  const chair = new THREE.Group(); box(chair, .9, .12, .85, 0, .55, 0, mat(0x1b1b20)); box(chair, .9, 1.0, .12, 0, 1.1, -.4, mat(0x1b1b20)); chair.position.set(X0, 0, -2.0); S.add(chair);

  // ------------------------------------------------------------------ people
  const crowd = new Crowd(S, 16, 77); const P = crowd.p; const YOU = P[0], THF = P[1], GRD = P[2], BOSS = P[3];
  const col = (i, ks, c) => ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c)));
  col(0, ['torso', 'armL', 'armR'], 0x3a78d8); col(0, ['legL', 'legR'], 0x2b3347); col(0, ['hair'], 0x4a2f1c); col(0, ['head', 'handL', 'handR', 'neck'], 0xe0ac86);
  col(1, ['torso', 'armL', 'armR', 'legL', 'legR', 'head', 'neck', 'hair', 'handL', 'handR'], 0x14151a);
  col(2, ['torso', 'armL', 'armR'], 0x1d2a4a); col(2, ['legL', 'legR'], 0x161d33); col(2, ['hair'], 0x111111); col(2, ['head', 'handL', 'handR', 'neck'], 0xc68642);
  col(3, ['torso', 'armL', 'armR'], 0x23252e); col(3, ['legL', 'legR'], 0x1c1d24); col(3, ['hair'], 0x8a8a8a); col(3, ['head', 'handL', 'handR', 'neck'], 0xf1c9a5);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  YOU.h = 1; THF.h = 1.0; GRD.h = 1.18; BOSS.h = 1.12;
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; };
  const away = (o) => { o.vis = false; };
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const faceTo = (o, tx, tz) => Math.atan2(tx - o.x, tz - o.z);
  // props on people
  const cap = new THREE.Group(); { box(cap, .5, .14, .5, 0, 0, 0, mat(0x14203d)); box(cap, .5, .04, .22, 0, -.06, .34, mat(0x0c1426)); const bd = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .02, 12), gold); bd.rotation.x = Math.PI / 2; bd.position.set(0, .01, .26); cap.add(bd); cap.visible = false; S.add(cap); }
  const badge = new THREE.Group(); { const sh = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .03, 6), gold); sh.rotation.x = Math.PI / 2; badge.add(sh); const st = cvs(64, 64, (g) => { txt(g, 'SEC', 32, 34, 26, '#3a2a00'); }); plane(.15, .15, st.t, 0, 0, .02, 0, { g: badge, tr: true }); badge.visible = false; S.add(badge); }
  const tie = new THREE.Group(); { box(tie, .22, .5, .02, 0, 0, 0, mat(0xf4f4f4)); box(tie, .09, .42, .03, 0, -.02, .02, mat(0xc4162a)); box(tie, .12, .1, .04, 0, .2, .02, mat(0xa61222)); tie.visible = false; S.add(tie); }
  const eyes = new THREE.Group(); { box(eyes, .07, .05, .01, -.1, 0, 0, mat(0xffffff)); box(eyes, .07, .05, .01, .1, 0, 0, mat(0xffffff)); eyes.visible = false; }
  const holder = new THREE.Group(); S.add(holder);
  const crumbs = new Particles(S, 24, 0xe3b878, .035); const dust = new Particles(S, 26, 0xd8cdb8, .22, { rough: 1 });
  // hungry coworkers
  const CW = []; for (let i = 0; i < 12; i++) { const o = P[4 + i]; CW.push(o); }
  // sprites
  const sprite = (text, c1, c2, w = 512, fs = 110) => { const l = cvs(w, 160, (g, ww) => { txt(g, text, ww / 2, 84, fs, c1, { stroke: c2, sw: 20 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const spClever = sprite('CLEVER!', '#ffe23a', '#111'), spBetter = sprite('MUCH BETTER!', '#7dff6a', '#111', 640, 96), spQ = sprite('?', '#ffffff', '#111', 256, 150), spWho = sprite('WHO?!', '#ffffff', '#111', 384, 110), spCr = sprite('CRUNCH', '#ffd92a', '#111', 512, 100);
  const spGr = []; for (let i = 0; i < 12; i++) { const s = sprite('GRRR', '#ffe9a8', '#7a2a00', 320, 100); spGr.push(s); }
  const lbl = (s, on, pos, k = 1, w = 1.2) => { s.visible = on; if (on) { s.position.copy(pos); const a = clamp(k); s.scale.set(w * a, w * .31 * a, 1); } };

  // ------------------------------------------------------------------ camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3();
  const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .02; E.y += Math.sin(t * 1.3 + 1) * .015; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .008); };
  const dk = (x, y, z) => [x, y, z];
  const setLabel = (L, p) => { if (L._p !== p) { L._p = p; L.draw(p); } };
  const placeIn = (g, x, y, z) => { g.position.set(x, y, z); g.visible = true; };
  const pOnShelf = (si, x, zf = 0) => V3(x, shelfY[si] + .02, FZ + zf);
  const NOTE = ['3 LUNCHES GONE', 'NAME LABEL: STOLEN', 'FRIDGE LOCKED · EATING: 0', 'GUARD: ON DUTY', 'SAFE: SECURE', 'SUSPECT: FOUND'];

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    let faceShock = false, counterN = 0, doorA = 0, fridgeOn = false, chainU = 0, lockY = -9, safeOn = false, safeY = 0, safeDoor = -1.75, dialRot = 0, wheelRot = 0, crumbsOn = false, dustT = -1;
    let bagAHeld = null, bagAShelf = true, bagBOn = false, milkOn = false, yogOn = false, saladOn = false, sandOn = false, stickerOn = false, pointer = null;
    [YOU, THF, GRD, BOSS, ...CW].forEach(away);
    const yaw0 = Math.PI; const upd = () => { crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t); };
    [spClever, spBetter, spQ, spWho, spCr, ...spGr].forEach((q) => { q.visible = false; });
    let shots, an = {}; let hungry = false; let penOn = false, penX = 0;
    cap.visible = false; badge.visible = false; tie.visible = false; eyes.visible = false; bagBOn = false; [bagA, bagB, sandwich, salad, milk, yog, padlock, SAFE, keyM, sticker].forEach((m) => { m.visible = false; });
    links.forEach((l) => { l.visible = false; }); pile.forEach((b) => { b.visible = false; });
    // ============================================================ beat 0
    if (bi === 0) {
      fridgeOn = true; doorA = lerp(0, 1.75, smooth((lt - .35) / .75)); const open = doorA > .4;
      milkOn = lt < 1.65; yogOn = lt < 2.15; bagBOn = lt < 2.55;
      // thief: sneaks in from the left, three grabs with the right hand
      const walkIn = smooth((lt - .1) / 1.0); const tx = lerp(-3.4, -.62, walkIn), tz = lerp(-2.3, -1.9, walkIn);
      const retreat = smooth((lt - 2.75) / .55); const px = lerp(tx, -3.8, retreat);
      place(THF, px, 0, tz, lerp(Math.PI * .5, 2.5, walkIn * (1 - retreat)) + (retreat > 0 ? lerp(0, -2.6, retreat) : 0), walkIn < 1 || retreat > 0 ? 'walk' : 'idle', 1.3);
      if (walkIn >= 1 && retreat === 0) { THF.yaw = 2.5; const gr = [1.35, 1.85, 2.35]; let u = 0; gr.forEach((g) => { const l = lt - g; if (l > 0 && l < .55) u = Math.max(u, Math.sin(clamp(l / .5) * Math.PI)); }); THF.pitch = .2 * u; THF.arms = { lx: -.2, lz: .1, rx: lerp(-.4, -1.75, u), rz: -.1 }; }
      if (retreat > 0) { THF.arms = { lx: -.4, lz: .1, rx: -1.7, rz: -.3 }; }
      counterN = lt > 2.5 ? 3 : lt > 2.0 ? 2 : lt > 1.5 ? 1 : 0; faceShock = false;
      // items
      upd(); const hand = hp(THF, 'handR'); const bagHeld = lt > 2.4;
      if (bagBOn || lt < 2.55) { const gu = smooth((lt - 2.3) / .25); const sp = pOnShelf(0, -.3); placeIn(bagB, lerp(sp.x, hand.x, gu), lerp(sp.y, hand.y - .25, gu), lerp(sp.z, hand.z, gu)); }
      if (lt >= 2.55) { placeIn(bagB, hand.x, hand.y - .25, hand.z); bagB.visible = lt < 3.2; }
      if (lt > 1.35 && lt < 1.85) { const l = smooth((lt - 1.5) / .3); const sp = pOnShelf(2, .35); placeIn(milk, lerp(sp.x, hand.x, l), lerp(sp.y, hand.y - .2, l), lerp(sp.z, hand.z, l)); }
      else if (lt <= 1.35) { const sp = pOnShelf(2, .35); placeIn(milk, sp.x, sp.y, sp.z); } else milk.visible = false;
      if (lt > 1.85 && lt < 2.35) { const l = smooth((lt - 2.0) / .3); const sp = pOnShelf(2, -.3); placeIn(yog, lerp(sp.x, hand.x, l), lerp(sp.y, hand.y - .15, l), lerp(sp.z, hand.z, l)); }
      else if (lt <= 1.85) { const sp = pOnShelf(2, -.3); placeIn(yog, sp.x, sp.y, sp.z); } else yog.visible = false;
      const sA = pOnShelf(1, -.15, .05); bagA.position.copy(sA); bagA.visible = true;
      const sl = pOnShelf(0, .3, .05); salad.position.copy(sl); salad.visible = true;
      // closeup writing: marker + hand from the right
      penOn = lt > 3.3; const wp = clamp((lt - 3.5) / 1.35); setLabel(LA, wp); penX = lerp(-.14, .14, wp);
      sandwich.visible = false; milk.rotation.y = .3;
      shots = [[0, dk(4.2, 2.7, 6.8), dk(3.0, 2.4, 5.0), dk(-.6, 1.2, -2.6), dk(-.4, 1.2, -2.6), 50, 46], [1.2, dk(3.4, 2.3, 3.6), dk(2.9, 2.2, 3.0), dk(-.4, 1.4, -2.4), dk(-.3, 1.4, -2.5), 40, 38], [3.0, dk(.4, 1.5, -1.2), dk(.3, 1.45, -1.35), dk(-.02, 1.36, -2.85), dk(-.02, 1.36, -2.85), 30, 26]];
    }
    // ============================================================ beat 1
    else if (bi === 1) {
      fridgeOn = true; doorA = 1.75; counterN = lt > 4.2 ? 5 : lt > 2.3 ? 4 : 3;
      const sA = pOnShelf(1, -.15, .05); const sl = pOnShelf(0, .3, .05);
      // you proudly present (0-1.3), thief arrives, takes the bag (1.5-2.3), peels label (2.4-3.0), sticks on salad (3.0-3.4), leaves
      const tin = smooth((lt - .9) / .6); const tx = lerp(-3.4, -.62, tin), tz = lerp(-2.3, -1.9, tin);
      const tout = smooth((lt - 3.2) / .5);
      if (lt >= .9) { place(THF, lerp(tx, -3.8, tout), 0, tz, tout > 0 ? Math.PI * 1.5 : 2.5, tin < 1 || tout > 0 ? 'walk' : 'idle', 1.3); if (tin >= 1 && tout === 0) { THF.yaw = 2.5; const u = smooth((lt - 1.5) / .3) * (1 - smooth((lt - 2.1) / .35)); THF.arms = { lx: -.2, lz: .1, rx: lerp(-.4, -1.75, u + (lt > 2.4 ? 1 : 0) * .1), rz: -.1 }; if (lt > 2.45) THF.arms = { lx: -.9, lz: .1, rx: -1.4 + Math.sin(lt * 14) * .15, rz: -.25 }; if (lt > 3.0) THF.arms = { lx: -.9, lz: .1, rx: lerp(-1.4, -1.8, smooth((lt - 3.0) / .15)), rz: -.25 }; } if (tout > 0) THF.arms = { lx: -.4, lz: .1, rx: -1.0, rz: -.3 }; }
      upd(); const hand = hp(THF, 'handR');
      // bag A
      const grab = smooth((lt - 1.85) / .3); if (lt < 1.8) { bagA.position.copy(sA); bagA.visible = true; } else if (lt < 3.2) { placeIn(bagA, lerp(sA.x, hand.x, grab), lerp(sA.y, hand.y - .25, grab), lerp(sA.z, hand.z, grab)); } else { placeIn(bagA, hand.x, hand.y - .25, hand.z); }
      setLabel(LA, 1); bagA.children[bagA.children.length - 1].visible = lt < 2.45; // label peels off the bag at 2.45
      // sticker: peel (rises off bag), flies to salad, lands on its front
      if (lt >= 2.45 && lt < 3.4) { stickerOn = true; const q = clamp((lt - 2.45) / .9); const from = V3(hand.x, hand.y - .2, hand.z + .15); const to = V3(sl.x, sl.y + .09, sl.z + .26); const e = smooth(q); sticker.position.set(lerp(from.x, to.x, e), lerp(from.y, to.y, e) + Math.sin(q * Math.PI) * .25, lerp(from.z, to.z, e)); sticker.rotation.set(0, 0, Math.sin(q * 6) * .5 * (1 - q)); const sc = lerp(1, .55, e); sticker.scale.setScalar(sc); sticker.visible = true; }
      else if (lt >= 3.4) { sticker.position.set(sl.x, sl.y + .09, sl.z + .26); sticker.rotation.set(0, 0, 0); sticker.scale.setScalar(.55); sticker.visible = true; }
      salad.position.copy(sl); salad.visible = lt < 3.9;
      // you (right side) reach in for lunch with a confused face
      if (lt >= 3.7) { const yin = smooth((lt - 3.6) / .5); place(YOU, lerp(1.6, .55, yin), 0, lerp(-1.5, -1.7, yin), 0, 'idle', .6); YOU.yaw = Math.atan2(-.15 - YOU.x, -2.9 - YOU.z); YOU.arms = { lx: -.1, lz: -.1, rx: lerp(-.3, -1.9, yin), rz: .2 }; YOU.pitch = .1; faceShock = lt > 4.1; upd(); const yh = hp(YOU, 'handR'); if (lt > 3.9) { placeIn(salad, yh.x - .05, yh.y - .12, yh.z + .1); salad.visible = true; salad.position.y = yh.y - .1; const sa = hp(YOU, 'handR'); sticker.position.set(salad.position.x, salad.position.y + .09, salad.position.z + .26); } }
      else { place(YOU, 1.6, 0, -1.5, Math.PI * .85, 'idle', .6); YOU.arms = { lx: -.3, lz: -.1, rx: -.3, rz: .2 }; }
      lbl(spClever, lt > .1 && lt < 1.1, V3(.2, 1.95, FZ + .6), Math.min(1.1, (lt - .1) * 6), 1.0);
      lbl(spQ, lt > 4.15, V3(.5, 2.1, -1.6), Math.min(1.1, (lt - 4.15) * 5) * 1, .8);
      upd(); an = { hy: hp(YOU, 'head') };
      shots = [[0, dk(1.4, 1.8, .6), dk(.9, 1.7, .1), dk(-.1, 1.35, -2.8), dk(-.1, 1.3, -2.8), 38, 34], [1.0, dk(3.4, 2.3, 3.6), dk(2.9, 2.2, 3.0), dk(-.4, 1.4, -2.4), dk(-.3, 1.4, -2.5), 40, 38], [3.4, dk(2.2, 1.9, 1.6), dk(1.8, 1.8, 1.2), dk(.0, 1.2, -2.6), dk(.1, 1.25, -2.5), 36, 32], [4.0, dk(2.4, 1.9, .8), dk(2.1, 1.9, .5), (a) => [a.hy.x - .6, 1.4, a.hy.z - 1.0], (a) => [a.hy.x - .7, 1.4, a.hy.z - 1.1], 40, 36]];
    }
    // ============================================================ beat 2
    else if (bi === 2) {
      fridgeOn = true; doorA = 0; counterN = 5; chainU = smooth((lt - .15) / 1.0); const lockT = lt - 1.0; lockY = 1.28; const dp = lockT > 0 ? dropBounce(1.5, 0, lockT, .3).y : 1.5; lockY = 1.28 + dp * .0 + (lockT > 0 ? dp : 1.5); if (lockT < 0) lockY = -9;
      place(YOU, 1.7, 0, -1.7, Math.atan2(-1.7, -.8), 'idle', .5); YOU.pitch = 0; const thumbs = smooth((lt - 2.2) / .3) * (1 - smooth((lt - 3.3) / .3)); YOU.arms = { lx: -.2, lz: -.1, rx: lerp(-.3, -2.0, thumbs), rz: .2 }; faceShock = false;
      lbl(spBetter, lt > 2.3 && lt < 3.05, V3(1.0, 2.7, -1.7), Math.min(1.1, (lt - 2.3) * 5), 1.9);
      // line of hungry coworkers (appear from 3.2)
      hungry = lt > 3.0; if (hungry) { faceShock = lt > 4.9; CW.forEach((o, i) => { const x = 1.9 + i * .78, z = -1.4 + (i % 2) * .05; place(o, x, 0, z, -Math.PI * .5 + (cr(i, 2) - .5) * .25, 'idle', .5); o.h = .95 + cr(i, 3) * .12; o.extra = .03 + (lt > 4.9 ? .04 : 0); const sh = lt > 5.3 ? 1 : 0; o.arms = { lx: lerp(-.5, -1.3, sh), lz: -.5 - .3 * sh, rx: lerp(-.5, -1.3, sh), rz: .5 + .3 * sh }; o.pitch = .12 + .05 * Math.sin(t * 5 + i); const q = (t * 2 + cr(i, 4) * 3) % 3; lbl(spGr[i], i % 2 === lt > 5 ? 1 : 0 && false, V3(x, 2.5, z), 1, .0); }); spGr.forEach((s, i) => { const on = lt > 3.5 && ((Math.floor(t * 2.5 + i * .7)) % 3 === 0); lbl(s, on, V3(CW[i].x - .1, 2.45 + .1 * Math.sin(t * 8 + i), CW[i].z + .5), 1, .65); }); }
      counterN = 5;
      shots = [[0, dk(1.4, 1.8, .9), dk(1.0, 1.7, .5), dk(0, 1.4, FZ), dk(0, 1.35, FZ), 38, 34], [2.0, dk(2.0, 2.0, .6), dk(1.7, 2.0, .4), dk(.5, 1.7, -2.0), dk(.6, 1.7, -2.0), 40, 36], [3.1, dk(-2.4, 2.1, 1.4), dk(-1.8, 2.0, .8), dk(5.0, 1.3, -1.6), dk(4.6, 1.3, -1.6), 54, 52], [5.1, dk(3.6, 1.8, 1.4), dk(3.0, 1.8, 1.0), dk(7.0, 1.4, -1.5), dk(6.4, 1.4, -1.5), 46, 42]];
    }
    // ============================================================ beat 3
    else if (bi === 3) {
      fridgeOn = true; counterN = lt > 2.4 ? 6 : 5; const open = smooth((lt - 1.9) / .5); doorA = 1.75 * open;
      const gx = lerp(4.8, 1.55, smooth((lt - .05) / 1.1)); const arrive = smooth((lt - .05) / 1.1);
      place(GRD, gx, 0, -1.8, lerp(Math.PI * 1.5, Math.atan2(-.7 - 1.55, -2.7 + 1.8) * 1, smooth((lt - 1.0) / .35)), arrive < 1 ? 'walk' : 'idle', 1.0);
      if (arrive >= 1) { GRD.yaw = lerp(Math.PI * 1.5, Math.atan2(-.1 - GRD.x, FZ - GRD.z + .6), 1); }
      GRD.arms = { lx: -1.2, lz: .55, rx: -1.2, rz: -.55 };
      upd(); const gh = hp(GRD, 'handR'); const sA = pOnShelf(1, -.15, .05); const yogS = pOnShelf(2, -.3);
      saladOn = true; const sl = pOnShelf(0, .3, .05); salad.position.copy(sl); salad.visible = true; sticker.position.set(sl.x, sl.y + .09, sl.z + .26); sticker.scale.setScalar(.55); sticker.visible = true;
      bagA.visible = false; bagBOn = false;
      // guard eats a sandwich from your bag
      sandwich.visible = false; const reach = smooth((lt - 2.0) / .25); const eat = lt > 2.35;
      if (lt >= 1.9 && lt < 2.35) { GRD.arms = { lx: -.4, lz: .2, rx: lerp(-1.2, -1.75, reach), rz: -.3 }; const sp = V3(-.1, shelfY[1] + .1, FZ + .05); sandwich.position.set(lerp(sp.x, gh.x, reach), lerp(sp.y, gh.y, reach), lerp(sp.z, gh.z, reach)); sandwich.visible = true; }
      else if (lt < 1.9) { sandwich.position.set(-.1, shelfY[1] + .1, FZ + .05); sandwich.visible = true; }
      if (eat) { const c = (lt - 2.35) * 1.8; const up = smooth(Math.sin((c % 1) * Math.PI)); GRD.arms = { lx: -.4, lz: .2, rx: lerp(-1.0, -2.45, up), rz: -.25 }; GRD.pitch = .1 + .05 * up; GRD.extra = 0; upd(); const hh = hp(GRD, 'handR'); const hd = hp(GRD, 'head'); sandwich.position.set(hh.x, hh.y, hh.z + .02); sandwich.rotation.set(0, GRD.yaw, 0); sandwich.visible = lt < 4.15; sandwich.scale.set(1.3 - Math.min(.45, (lt - 2.35) * .27), 1.3, 1.3 - Math.min(.45, (lt - 2.35) * .27)); crumbsOn = true; lbl(spCr, lt > 2.6 && lt < 3.6, V3(hd.x + .4, hd.y + .75, hd.z), Math.min(1.1, (lt - 2.6) * 5), 1.4); }
      // you behind, shocked
      place(YOU, -2.0, 0, -1.2, Math.PI * .75, 'idle', .5); YOU.arms = { lx: -.4, lz: -.1, rx: -.4, rz: .1 }; faceShock = lt > 2.5; if (lt > 2.5) YOU.arms = { lx: -2.6, lz: -.5, rx: -2.6, rz: .5 };
      upd(); an = { hg: hp(GRD, 'head') };
      shots = [[0, dk(5.5, 2.3, 3.8), dk(4.0, 2.2, 3.2), dk(2.2, 1.2, -2.2), dk(1.0, 1.3, -2.2), 48, 46], [1.8, dk(.6, 1.9, .7), dk(.9, 1.9, .5), dk(.4, 1.5, -2.2), dk(.4, 1.45, -2.2), 38, 34]];
      // closeup on guard eating from 2.7
      shots.push([2.6, (a) => [a.hg.x + 1.5, a.hg.y + .2, a.hg.z + 2.4], (a) => [a.hg.x + 1.2, a.hg.y + .1, a.hg.z + 2.1], (a) => [a.hg.x, a.hg.y - .3, a.hg.z], (a) => [a.hg.x, a.hg.y - .3, a.hg.z], 42, 34]);
    }
    // ============================================================ beat 4
    else if (bi === 4) {
      counterN = lt > 2.5 ? 7 : 6; safeOn = true;
      const dr = clamp((lt - .1) / .5); safeY = bi === 4 && lt > 2.3 ? 0 : Math.max(0, 5 * (1 - dr) * (1 - dr)) + (dr >= 1 && lt < .9 ? Math.abs(Math.sin((lt - .6) * 14)) * .1 * Math.exp(-(lt - .6) * 5) : 0);
      safeDoor = lt < .9 ? -1.75 : lt < 1.2 ? -1.75 : lerp(-1.75, 0, smooth((lt - 1.15) / .4)); dialRot = lt > 1.5 ? (lt - 1.5) * 12 * Math.exp(-(lt - 1.5) * .6) : 0; wheelRot = lt > 1.4 ? smooth((lt - 1.4) / .3) * 1.6 : 0;
      place(YOU, DX - 1.35, 0, DZ + .35, 0, 'idle', .6); YOU.yaw = faceTo(YOU, DX, DZ); YOU.arms = { lx: -.3, lz: -.1, rx: -1.3, rz: .2 }; YOU.pitch = .15; if (lt > 1.4 && lt < 2.2) YOU.arms = { lx: -.3, lz: -.1, rx: -1.7 + Math.sin(lt * 12) * .25, rz: .2 }; faceShock = lt > 2.9; if (faceShock) YOU.arms = { lx: -2.6, lz: -.5, rx: -2.6, rz: .5 };
      // bag in safe, visible until the safe closes
      const sp = V3(DX, DTOP + .3, DZ); bagA.position.set(sp.x, sp.y + .02, sp.z); bagA.scale.setScalar(.8); bagA.visible = lt > .9 && lt < 1.45 && true; if (lt > .5 && lt < 1.1) { const q = smooth((lt - .5) / .4); bagA.position.set(lerp(DX - 1.0, DX, q), lerp(DTOP + 1.0, DTOP + .3, q), lerp(DZ + .6, DZ, q)); bagA.visible = true; }
      // thief appears behind the desk at the right and hauls the safe out the exit
      const st = lt - 1.9; if (st > -.1) { const tw = smooth((st) / 1.0); const tx2 = lerp(DX - .3, 4.0, tw), tzz = lerp(-2.5, -2.9, smooth((st - .6) / .5)); place(THF, tx2, 0, tzz, st < .35 ? Math.PI : Math.PI * .5 + .0, 'walk', 1.4); THF.pitch = .25; THF.arms = { lx: -1.45, lz: .1, rx: -1.45, rz: -.1 }; THF.yaw = tw < .12 ? Math.PI : Math.PI / 2; }
      upd(); if (lt > 1.9 + .35) { safeCarry.on = true; const tt = hp(THF, 'torso'); const wy = Math.PI / 2; SAFE.position.set(tt.x + Math.sin(wy) * .5, tt.y - .55, tt.z + Math.cos(wy) * .5); SAFE.rotation.y = wy + Math.PI; } else { SAFE.position.set(DX + (lt > 1.7 ? Math.sin(lt * 80) * .0 : 0), DTOP + safeY, DZ); SAFE.rotation.y = 0; }
      if (lt > 1.9 + .35) { sdoor.rotation.y = 0; }
      if (lt > 3.0) dustT = lt - 3.0;
      // exiting: thief walks into the hallway (z<-3.5 is wall -> slide to dark) -> hide after reaching door
      if (lt > 2.95) { THF.vis = lt < 3.1; if (!THF.vis) { SAFE.visible = false; } }
      shots = [[0, dk(1.0, 1.9, .5), dk(1.4, 1.7, .2), dk(DX, DTOP + .45, DZ), dk(DX, DTOP + .4, DZ), 44, 38], [1.4, dk(.8, 1.5, -.1), dk(1.1, 1.4, -.3), dk(DX, DTOP + .4, DZ), dk(DX, DTOP + .35, DZ), 36, 32], [1.9, dk(.5, 2.1, 1.8), dk(1.5, 2.0, 2.6), dk(DX + .8, 1.1, -2.2), dk(DX + 1.6, 1.1, -2.6), 50, 52], [2.8, dk(1.0, 1.7, 2.2), dk(1.5, 1.7, 2.0), dk(4.0, 1.0, -3.0), dk(4.0, 1.0, -3.0), 46, 44]];
    }
    // ============================================================ beat 5
    else {
      if (lt < 2.0) {
        fridgeOn = true; doorA = 1.75; counterN = 7; place(YOU, 1.2, 0, -1.4, Math.atan2(-.0 - 1.2, FZ + 1.4), 'idle', .5); YOU.pitch = .08; const sh = Math.sin(lt * 6); YOU.arms = { lx: lerp(-.9, -1.25, (sh + 1) / 2), lz: -.55, rx: lerp(-.9, -1.25, (1 - sh) / 2), rz: .55 }; faceShock = true; YOU.yaw = Math.atan2(-.0 - YOU.x, FZ - YOU.z + 1.0);
        lbl(spWho, lt > .25, V3(.9, 2.15, -1.4), Math.min(1.1, (lt - .25) * 5), 1.05);
        shots = [[0, dk(2.9, 1.9, 2.4), dk(2.4, 1.85, 1.8), dk(.5, 1.3, -2.0), dk(.5, 1.3, -2.0), 44, 40]];
      } else {
        const q = lt - 2.0; counterN = q > 1.3 ? Math.round(lerp(7, 100, smooth((q - 1.3) / 1.4))) : 7;
        place(BOSS, X0, -.3, -1.95, 0, 'sit', .3); BOSS.pitch = -.12 + .05 * Math.sin(t * 1.2); BOSS.arms = { lx: -1.15, lz: -.35, rx: -1.15, rz: .35 }; faceShock = false; tie.visible = true;
        pile.forEach((b) => { b.visible = true; });
        upd(); an = { hb: hp(BOSS, 'head') };
        shots = [[2.0, dk(X0 + 1.6, 1.9, 4.6), dk(X0 + .8, 1.8, 2.8), dk(X0 - .6, 1.2, -1.4), dk(X0, 1.15, -1.9), 46, 38], [3.0, dk(X0 + .8, 1.8, 2.8), dk(X0 + .1, 1.6, 1.6), dk(X0, 1.2, -1.9), (a) => [a.hb.x, a.hb.y - .05, a.hb.z], 38, 24]];
      }
    }
    // ---- people -> matrices
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t);
    // props attached to people
    if (GRD.vis) { attach(cap, GRD, 'head', [0, .26, .0]); cap.visible = true; cap.matrix.scale(V3(1.3, 1.3, 1.3)); attach(badge, GRD, 'torso', [.14, .1, .18]); badge.matrix.scale(V3(1.4, 1.4, 1.4)); badge.visible = true; }
    if (BOSS.vis) { attach(tie, BOSS, 'torso', [0, .05, .17]); tie.matrix.scale(V3(1.15, 1.15, 1.15)); tie.visible = true; }
    deskG.visible = bi === 4;
    // fridge visuals
    FR.visible = true; setDoor(doorA); fridgeLight.intensity = doorA > .3 ? 1.6 * clamp(doorA / 1.0) : 0;
    // chain
    links.forEach((l, i) => { const u = i / NL; const on = bi === 2 && u < chainU; if (!on) return; const [x, z, d] = chainPt(u); l.position.set(x, 1.3 + (i % 2 ? .02 : 0), z); l.rotation.set(i % 2 ? Math.PI / 2 : 0, d ? Math.PI / 2 : 0, 0); l.visible = true; l.scale.setScalar(1.1); });
    if (bi === 2 && lockY > -5) { padlock.position.set(0, lockY - .0, FZ + .58); padlock.visible = true; }
    // marker + hand
    sandwich.rotation.x = 0; bagA.scale.setScalar(bi === 4 ? .8 : 1); if (bi !== 4) bagA.scale.setScalar(1);
    holder.visible = false;
    if (penOn && bi === 0) { if (!holder.userData.built) { const m = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .26, 8), mat(0xe63946)); m.rotation.x = Math.PI / 2; m.position.set(0, 0, .14); holder.add(m); const tp = new THREE.Mesh(new THREE.ConeGeometry(.018, .04, 8), mat(0x111111)); tp.rotation.x = -Math.PI / 2; tp.position.set(0, 0, -.01); holder.add(tp); const hd = new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 8), mat(0xe0ac86)); hd.position.set(.07, .04, .15); hd.scale.set(1, .8, 1.2); holder.add(hd); const sl = new THREE.Mesh(new THREE.BoxGeometry(.13, .13, .6), mat(0x3a78d8)); sl.position.set(.42, .1, .2); sl.rotation.set(0, 1.35, .1); holder.add(sl); holder.userData.built = true; holder.children.forEach((c) => { c.castShadow = true; }); }
      holder.position.set(-.02 + penX * 1.0, 1.36 + Math.sin(lt * 30) * .008, FZ + .205); holder.rotation.set(0, 0, 0); holder.visible = true; }
    // safe
    if (safeOn) { SAFE.visible = SAFE.visible !== false && !(bi === 4 && lt > 3.1); if (bi === 4 && lt < 1.9 + .35) { SAFE.position.set(DX, DTOP + safeY, DZ); SAFE.rotation.y = 0; } SAFE.visible = !(bi === 4 && lt > 3.1); sdoor.rotation.y = lt > 1.55 + .35 && bi === 4 ? 0 : safeDoor; dialF.rotation.z = -dialRot; sdoor.userData.wheel.rotation.z = wheelRot; }
    // crumbs / dust
    for (let i = 0; i < 24; i++) { if (!crumbsOn) { crumbs.set(i, 0, 0, 0, 0); continue; } const hd = hp(GRD, 'head'); const ph = (t * 1.4 + cr(i, 20)) % 1; crumbs.set(i, hd.x - .1 + (cr(i, 21) - .5) * .5, hd.y - .2 - ph * .9, hd.z + .25 + (cr(i, 22) - .5) * .3, ph < .95 ? 1 : 0); } crumbs.done();
    for (let i = 0; i < 26; i++) { if (dustT < 0) { dust.set(i, 0, 0, 0, 0); continue; } const a = cr(i, 30) * 6.28, r = (.1 + dustT * 1.2) * (.4 + cr(i, 31)); const k = clamp(dustT / 1.2); dust.set(i, 4.0 + Math.cos(a) * r * .8, .4 + cr(i, 32) * .8 + dustT * .6, -3.0 + Math.sin(a) * r * .4 + .3, (.5 + cr(i, 33)) * (1 - k * .8) * (dustT > 0 ? 1 : 0)); } dust.done();
    // ---- camera
    rig(lt, shots, an, t);
    A.follow(0, 0); A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    hud.counter('LUNCHES STOLEN', String(Math.round(counterN)), NOTE[bi], '', bi >= 1);
    hud.tm(''); hud.pop('', 0);
  } };
}
