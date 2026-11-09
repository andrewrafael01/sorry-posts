// 657 invention chain: friend keeps stealing fries -> wall -> moat -> hot sauce moat -> safe -> locked out. One picnic table, moving camera, object cutaways.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, ground, Crowd, clamp, smooth, lerp, attach, tree } = lib;
  const A = makeStage({ fog: 0xbcd8ee, fogNear: 45, fogFar: 170, clouds: true, skyTop: 0x3f86d8, skyMid: 0x9cc8f0, skyBot: 0xe2eef9, shadowExtent: 14, shadowRes: 2048, hemi: 1.5, sunI: 1.9, sunDir: [-.35, .9, .5], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const hideM = new THREE.Matrix4().makeScale(0, 0, 0);

  // ------------------------------------------------------------------ backyard
  ground(S, 0x6fa84e, 400, { y: -.02 });
  const patio = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, .05, 48), mat(0xc9c2b4)); patio.position.y = .0; patio.receiveShadow = true; S.add(patio);
  for (let i = 0; i < 26; i++) { const x = -13 + i * 1.04; addBox(S, x, 1.0, -9, .94, 2.0, .12, i % 2 ? 0xe9dfc9 : 0xf1e8d4, { cast: false }); addBox(S, x, .55, -8.94, .94, .1, .05, 0xd6ccb4, { cast: false }); }
  addBox(S, 0, 1.55, -8.9, 27, .12, .1, 0xcfc4a8, { cast: false });
  tree(S, -7.5, -6.5, 1.8, 3); tree(S, 8.5, -7, 2.1, 7); tree(S, 11, 3, 1.5, 11);
  for (let i = 0; i < 9; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(.7 + cr(i, 1) * .4, 1), mat(0x3f8a3c, { flatShading: true })); b.position.set(-12 + i * 2.7, .45, -8.2); b.castShadow = true; S.add(b); }
  for (let i = 0; i < 60; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.06, 6, 5), mat([0xffd92a, 0xff6b8a, 0xffffff, 0xc77dff][i % 4])); const a = cr(i, 2) * 6.28, d = 6 + cr(i, 3) * 12; f.position.set(Math.cos(a) * d, .08, Math.sin(a) * d - 2); S.add(f); }
  // grill
  { const g = new THREE.Group(); const bowl = new THREE.Mesh(new THREE.SphereGeometry(.55, 16, 10, 0, 7, 0, 1.6), mat(0x222428, { metalness: .5, roughness: .4 })); bowl.rotation.x = Math.PI; bowl.position.y = 1.25; g.add(bowl); for (const [x, z] of [[-.3, -.2], [.3, -.2], [0, .3]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 1.1, 6), mat(0x222222)); l.position.set(x, .55, z); g.add(l); } g.position.set(-5.4, 0, -3.6); g.traverse((m) => { m.castShadow = true; }); S.add(g); }
  // ------------------------------------------------------------------ picnic table
  const TY = 1.01, TH = .55, BZ = 1.3; // table top surface y, bench top, bench z
  { const cloth = cvs(256, 128, (g, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) { g.fillStyle = (i + j) % 2 ? '#f4f0e6' : '#d6403a'; g.fillRect(i * 32, j * 32, 32, 32); } }); cloth.t.wrapS = cloth.t.wrapT = THREE.RepeatWrapping; cloth.t.repeat.set(3, 3);
    const top = new THREE.Mesh(new THREE.BoxGeometry(3.6, .1, 2.1), mat(0x9a6a3c)); top.position.set(0, TY - .06, 0); top.castShadow = true; top.receiveShadow = true; S.add(top);
    const cl = new THREE.Mesh(new THREE.BoxGeometry(3.5, .02, 2.0), new THREE.MeshStandardMaterial({ map: cloth.t, roughness: .95 })); cl.position.set(0, TY - .0, 0); cl.receiveShadow = true; S.add(cl);
    for (const sz of [-1, 1]) { addBox(S, 0, TH - .06, sz * BZ, 3.6, .1, .55, 0x8a5a30); for (const sx of [-1.4, 1.4]) { addBox(S, sx, .27, sz * BZ, .14, .54, .5, 0x7a4e28); } }
    for (const sx of [-1.4, 1.4]) { addBox(S, sx, .5, 0, .12, .1, 2.9, 0x7a4e28); addBox(S, sx, .52, .5, .12, 1.0, .12, 0x7a4e28, { ry: 0 }); addBox(S, sx, .52, -.5, .12, 1.0, .12, 0x7a4e28); } }
  // ------------------------------------------------------------------ plate + fries
  const plate = new THREE.Group(); plate.position.set(0, TY + .01, 0); S.add(plate);
  { const p1 = new THREE.Mesh(new THREE.CylinderGeometry(.42, .34, .05, 36), mat(0xf8f6f0, { roughness: .35 })); p1.position.y = .025; p1.castShadow = true; p1.receiveShadow = true; plate.add(p1); const p2 = new THREE.Mesh(new THREE.CylinderGeometry(.28, .28, .01, 30), mat(0xe2ddd0, { roughness: .4 })); p2.position.y = .052; plate.add(p2); }
  const NF = 20; const fryGeo = new THREE.BoxGeometry(.05, .05, .34); const fryM = mat(0xf2c230, { roughness: .6 }); const fries = []; const fryHome = [];
  for (let i = 0; i < NF; i++) { const m = new THREE.Mesh(fryGeo, fryM); const a = cr(i, 4) * 6.28, r = cr(i, 5) * .17; const h = .09 + (i % 5) * .035; m.position.set(Math.cos(a) * r, h, Math.sin(a) * r); m.rotation.set((cr(i, 6) - .5) * .9, cr(i, 7) * 3.14, (cr(i, 8) - .5) * .9); m.castShadow = true; plate.add(m); fries.push(m); fryHome.push(m.position.clone()); }
  const hotFry = new THREE.Mesh(fryGeo, fryM); hotFry.castShadow = true; hotFry.visible = false; S.add(hotFry); // traveling fry (friend / you)
  const myFry = new THREE.Mesh(fryGeo, fryM); myFry.castShadow = true; myFry.visible = false; S.add(myFry);
  const fryWorld = (i) => { const v = fries[i].getWorldPosition(new THREE.Vector3()); return v; };
  // ------------------------------------------------------------------ wall (bricks)
  const brickT = cvs(256, 128, (g, w, h) => { g.fillStyle = '#d9d2c4'; g.fillRect(0, 0, w, h); for (let r = 0; r < 4; r++) for (let c = -1; c < 4; c++) { const x = c * 64 + (r % 2 ? 32 : 0); g.fillStyle = ['#b5503a', '#a8452f', '#c25f44'][(r * 3 + c + 9) % 3]; g.fillRect(x + 2, r * 32 + 2, 60, 28); } }); brickT.t.wrapS = brickT.t.wrapT = THREE.RepeatWrapping;
  const WH = .72, WS = .62, WT = .16; const wallG = new THREE.Group(); S.add(wallG); const walls = [];
  for (let k = 0; k < 4; k++) { const alongX = k < 2; const t = brickT.t.clone(); t.needsUpdate = true; t.repeat.set(alongX ? 4 : 4, 2); const m = new THREE.Mesh(new THREE.BoxGeometry(alongX ? 2 * WS + WT : WT, WH, alongX ? WT : 2 * WS + WT), new THREE.MeshStandardMaterial({ map: t, roughness: .9 })); const sgn = k % 2 ? 1 : -1; m.position.set(alongX ? 0 : sgn * WS, TY, alongX ? sgn * WS : 0); m.castShadow = true; m.receiveShadow = true; wallG.add(m); walls.push(m); }
  const setWall = (u) => { walls.forEach((m, k) => { const s = clamp(u * 4 - k * .55 + .0) ; const e = smooth(s); m.scale.y = Math.max(.001, e); m.position.y = TY + WH * .5 * m.scale.y; m.visible = e > .002; }); };
  // little trowel / mortar bucket
  // ------------------------------------------------------------------ moat
  const MI = .52, MO = .98; const moat = new THREE.Group(); moat.position.set(0, TY, 0); S.add(moat);
  const waterM = new THREE.MeshStandardMaterial({ color: 0x2b9bff, roughness: .12, metalness: .1, emissive: 0x0a3a77, emissiveIntensity: .55, transparent: true, opacity: .92 });
  { const w = new THREE.Mesh(new THREE.RingGeometry(MI, MO, 64, 1), waterM); w.rotation.x = -Math.PI / 2; w.position.y = .1; w.receiveShadow = true; moat.add(w);
    const rimM = mat(0x8a6a48); const oc = new THREE.Mesh(new THREE.CylinderGeometry(MO + .04, MO + .04, .12, 64, 1, true), new THREE.MeshStandardMaterial({ color: 0xb0825a, side: THREE.DoubleSide, roughness: .8 })); oc.position.y = .05; moat.add(oc); const ic = new THREE.Mesh(new THREE.CylinderGeometry(MI - .04, MI - .04, .12, 64, 1, true), new THREE.MeshStandardMaterial({ color: 0xb0825a, side: THREE.DoubleSide, roughness: .8 })); ic.position.y = .05; moat.add(ic);
    const bt = new THREE.Mesh(new THREE.RingGeometry(MI - .04, MO + .04, 64, 1), mat(0x6a4a2a)); bt.rotation.x = -Math.PI / 2; bt.position.y = .012; moat.add(bt); }
  const waterTex = cvs(256, 256, (g, w, h) => { }); // ripple rings texture (animated)
  const rip = []; for (let i = 0; i < 14; i++) { const m = new THREE.Mesh(new THREE.RingGeometry(.05, .065, 20), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .0, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; moat.add(m); rip.push(m); }
  const NB = 18; const bubGeo = new THREE.SphereGeometry(.035, 8, 6); const bubM = new THREE.MeshStandardMaterial({ color: 0xffb27a, emissive: 0xff5a1a, emissiveIntensity: .6, roughness: .3 }); const bubs = []; for (let i = 0; i < NB; i++) { const m = new THREE.Mesh(bubGeo, bubM); m.visible = false; S.add(m); bubs.push(m); }
  const COL_W = new THREE.Color(0x2b9bff), COL_R = new THREE.Color(0xd41808), EM_W = new THREE.Color(0x0a3a77), EM_R = new THREE.Color(0x7a0800);
  // ------------------------------------------------------------------ hot sauce bottle
  const bottle = new THREE.Group(); { const lab = cvs(256, 256, (g, w, h) => { g.fillStyle = '#d41808'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffe9a8'; g.fillRect(14, 60, w - 28, 140); txt(g, 'HOT', w / 2, 100, 64, '#b30c00', { stroke: 'rgba(0,0,0,0)' }); txt(g, 'SAUCE', w / 2, 158, 56, '#b30c00'); g.fillStyle = '#ff9a1a'; g.beginPath(); g.moveTo(w / 2, 14); g.quadraticCurveTo(w / 2 + 30, 40, w / 2, 58); g.quadraticCurveTo(w / 2 - 30, 40, w / 2, 14); g.fill(); });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .46, 20), new THREE.MeshStandardMaterial({ map: lab.t, roughness: .3 })); body.rotation.y = Math.PI * .5; bottle.add(body);
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(.045, .11, .14, 16), mat(0xc41505, { roughness: .3 })); sh.position.y = .3; bottle.add(sh); const nk = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .1, 12), mat(0xf4f4f0)); nk.position.y = .42; bottle.add(nk); bottle.traverse((m) => { m.castShadow = true; }); bottle.visible = false; S.add(bottle); }
  const streamM = new THREE.MeshStandardMaterial({ color: 0xd41808, emissive: 0x7a0800, emissiveIntensity: .5, roughness: .3 }); const stream = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 1, 8), streamM); stream.visible = false; S.add(stream);
  // ------------------------------------------------------------------ safe
  const SAFE = new THREE.Group(); SAFE.position.set(0, TY, 0); S.add(SAFE); const SW = 1.3, SHt = 1.15, SD = 1.0;
  const steel = new THREE.MeshStandardMaterial({ color: 0x8a919c, roughness: .35, metalness: .85 }); const steelD = new THREE.MeshStandardMaterial({ color: 0x5d636d, roughness: .4, metalness: .85 });
  { const add = (w, h, d, x, y, z, m = steel) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; SAFE.add(b); return b; }; const T = .13;
    add(SW, T, SD, 0, SHt - T / 2, 0); add(SW, T, SD, 0, T / 2 + .08, 0); add(T, SHt - .08, SD, -SW / 2 + T / 2, .08 + (SHt - .08) / 2, 0); add(T, SHt - .08, SD, SW / 2 - T / 2, .08 + (SHt - .08) / 2, 0); add(SW, SHt - .08, .1, 0, .08 + (SHt - .08) / 2, -SD / 2 + .05, steelD);
    for (const sx of [-.5, .5]) for (const sz of [-.35, .35]) add(.16, .09, .16, sx, .045, sz, steelD);
    // shelf + interior light
    add(SW - .3, .04, SD - .2, 0, .5, 0, steelD); }
  const door = new THREE.Group(); door.position.set(-SW / 2 + .02, 0, SD / 2); SAFE.add(door); // hinge on the left edge; door spans local x 0..SW-.04
  { const DW = SW - .04, DH = SHt - .08, DY = .08 + DH / 2; const slab = (w, h, x, y, m = steel) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, .12), m); b.position.set(x, y, .06); b.castShadow = true; b.receiveShadow = true; door.add(b); return b; };
    // frame around a glass window (window upper-left area), dial + wheel lower area
    slab(DW, .2, DW / 2, DY + DH / 2 - .1); slab(DW, .12, DW / 2, DY - DH / 2 + .06); slab(.16, DH, .08, DY); slab(.16, DH, DW - .08, DY); slab(DW - .32, .18, DW / 2, DY + .06); // mid bar
    const glass = new THREE.Mesh(new THREE.BoxGeometry(DW - .32, DH - .5, .04), new THREE.MeshStandardMaterial({ color: 0xbfe6ff, transparent: true, opacity: .22, roughness: .05, metalness: .2 })); glass.position.set(DW / 2, DY + DH / 2 - .1 - (DH - .5) / 2 - .0 + .0, .08); glass.position.y = DY + .15 + (DH / 2 - .2 - .15 - (DH - .5) / 2) ; door.add(glass); door.userData.glass = glass;
    // dial
    const dialT = cvs(256, 256, (g, w, h) => { g.fillStyle = '#1a1c20'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.strokeStyle = '#e8e8ea'; g.lineWidth = 5; for (let i = 0; i < 40; i++) { const a = i / 40 * 6.283, l = i % 5 ? 12 : 26; g.beginPath(); g.moveTo(128 + Math.cos(a) * (112 - l), 128 + Math.sin(a) * (112 - l)); g.lineTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112); g.stroke(); } for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; txt(g, String(i * 10), 128 + Math.cos(a) * 72, 128 + Math.sin(a) * 72, 28, '#fff', { w: 700 }); } g.fillStyle = '#c92a1e'; g.beginPath(); g.moveTo(128, 6); g.lineTo(140, 36); g.lineTo(116, 36); g.fill(); });
    const dial = new THREE.Group(); dial.position.set(DW * .27, DY - DH * .22, .12); door.add(dial); const dBase = new THREE.Mesh(new THREE.CylinderGeometry(.2, .22, .06, 28), steelD); dBase.rotation.x = Math.PI / 2; dial.add(dBase); const dFace = new THREE.Mesh(new THREE.CircleGeometry(.185, 32), new THREE.MeshStandardMaterial({ map: dialT.t, roughness: .4, metalness: .3 })); dFace.position.z = .035; dial.add(dFace); const knob = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .06, 16), steel); knob.rotation.x = Math.PI / 2; knob.position.z = .07; dial.add(knob); door.userData.dialFace = dFace; door.userData.dial = dial; dial.userData.rot = dFace;
    // wheel handle
    const wheel = new THREE.Group(); wheel.position.set(DW * .72, DY - DH * .22, .12); door.add(wheel); for (let i = 0; i < 3; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(.4, .06, .05), steel); sp.rotation.z = i * Math.PI / 3; sp.position.z = .05; sp.castShadow = true; wheel.add(sp); const kb = new THREE.Mesh(new THREE.SphereGeometry(.05, 10, 8), mat(0xc92a1e)); kb.position.set(Math.cos(i * Math.PI / 3) * .2, Math.sin(i * Math.PI / 3) * .2, .06); wheel.add(kb); const kb2 = kb.clone(); kb2.position.x *= -1; kb2.position.y *= -1; wheel.add(kb2); } const hub = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .08, 14), steelD); hub.rotation.x = Math.PI / 2; hub.position.z = .05; wheel.add(hub); door.userData.wheel = wheel;
    // LED + plate
    const led = new THREE.Mesh(new THREE.SphereGeometry(.05, 12, 8), new THREE.MeshBasicMaterial({ color: 0xff2a1a, toneMapped: false })); led.position.set(DW * .5, DY - DH * .22 + .02, .12); door.add(led); door.userData.led = led;
    const nameT = cvs(256, 64, (g, w, h) => { g.fillStyle = '#c9a34a'; g.fillRect(0, 0, w, h); txt(g, 'FRIES ONLY', w / 2, 34, 40, '#2a1d06'); }); const np = new THREE.Mesh(new THREE.PlaneGeometry(.52, .13), new THREE.MeshStandardMaterial({ map: nameT.t, metalness: .6, roughness: .4 })); np.position.set(DW * .5, DY - DH * .43, .125); door.add(np);
    for (let i = 0; i < 14; i++) { const rv = new THREE.Mesh(new THREE.SphereGeometry(.028, 8, 6), steelD); const side = i % 4; const u = (i >> 2) / 3; rv.position.set(side === 0 ? .06 : side === 1 ? DW - .06 : .06 + u * (DW - .12), side < 2 ? DY - DH / 2 + .06 + (i * .37 % 1) * (DH - .12) : side === 2 ? DY + DH / 2 - .05 : DY - DH / 2 + .05, .125); door.add(rv); } }
  const interiorLight = new THREE.PointLight(0xffe2a0, 0, 3); interiorLight.position.set(0, TY + .75, .1); S.add(interiorLight);
  // ------------------------------------------------------------------ people
  const crowd = new Crowd(S, 2, 91); const P = crowd.p; const YOU = P[0], FR = P[1];
  const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  col(0, ['torso', 'armL', 'armR'], 0x3a78d8); col(0, ['legL', 'legR'], 0x2b3347); col(0, ['hair'], 0x4a2f1c); col(1, ['torso', 'armL', 'armR'], 0xf0902a); col(1, ['legL', 'legR'], 0x3f5a3a); col(1, ['hair'], 0x16110c);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  YOU.h = 1; FR.h = 1.04;
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; };
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  // props: snorkel + mask, burger
  const mask = new THREE.Group(); { const fr = new THREE.Mesh(new THREE.BoxGeometry(.5, .2, .1), mat(0x111418, { roughness: .4 })); const gl = new THREE.Mesh(new THREE.BoxGeometry(.4, .13, .03), new THREE.MeshStandardMaterial({ color: 0x7fd8ff, roughness: .05, metalness: .3, transparent: true, opacity: .6 })); gl.position.z = .06; const strap = new THREE.Mesh(new THREE.BoxGeometry(.5, .05, .46), mat(0x1c1c22)); strap.position.z = -.22; mask.add(fr, gl, strap); const tube = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .85, 8), mat(0xffa21a)); tube.position.set(.3, .38, -.05); tube.rotation.z = -.08; mask.add(tube); const tip = new THREE.Mesh(new THREE.CylinderGeometry(.04, .03, .12, 8), mat(0xe21e1e)); tip.position.set(.31, .83, -.05); mask.add(tip); const mp = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .22, 8), mat(0xffa21a)); mp.rotation.x = Math.PI / 2; mp.position.set(.3, -.02, .08); mp.visible = false; mask.add(mp); mask.traverse((m) => { m.castShadow = true; }); mask.visible = false; S.add(mask); }
  const burger = new THREE.Group(); { const b1 = new THREE.Mesh(new THREE.CylinderGeometry(.24, .21, .08, 18), mat(0xd9953c)); const pat = new THREE.Mesh(new THREE.CylinderGeometry(.25, .25, .07, 18), mat(0x5a2f18)); pat.position.y = .08; const ch = new THREE.Mesh(new THREE.BoxGeometry(.5, .02, .5), mat(0xffc82a)); ch.position.y = .13; ch.rotation.y = .7; const lt = new THREE.Mesh(new THREE.CylinderGeometry(.27, .27, .03, 8), mat(0x56b84a)); lt.position.y = .16; const tp = new THREE.Mesh(new THREE.SphereGeometry(.25, 18, 8, 0, 7, 0, 1.57), mat(0xe0a24a)); tp.position.y = .18; tp.scale.y = .8; burger.add(b1, pat, ch, lt, tp); burger.traverse((m) => { m.castShadow = true; }); burger.visible = false; S.add(burger); }
  // floating labels (world sprites)
  const mkLabel = (text, c1, c2, w = 512) => { const l = cvs(w, 160, (g, ww, h) => { txt(g, text, ww / 2, 84, text.length > 9 ? 84 : 110, c1, { stroke: c2, sw: 20 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const lbClever = mkLabel('CLEVER!', '#ffe23a', '#111'), lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111'), lbSafe = mkLabel('SAFE!', '#9fe8ff', '#111');
  const lbPlus = mkLabel('+1', '#ff5a4a', '#111', 256); const plusA = []; for (let i = 0; i < 3; i++) plusA.push(lbPlus.clone()); plusA.forEach((s) => { s.material = lbPlus.material.clone(); S.add(s); });
  // ------------------------------------------------------------------ camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3();
  const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .03 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .025 + Math.cos(t * 57) * shake; E.z += Math.cos(t * .8) * .03; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .01); };
  const SIT_Y = -.3;
  const mouthOf = (o) => { const h = hp(o, 'head'); return h; };
  const DUR = [3.49, 5.58, 2.79, 7.67, 4.88, 2.09];
  // ------------------------------------------------------------------ frame
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    let faceShock = false; let wallU = 0, moatU = 0, sauce = 0, showSafe = false, doorA = -1.75, dialRot = 0, wheelRot = 0, ledOn = 0, safeShake = 0, streamOn = false, bottleOn = false, maskOn = false, burgerOn = false, plateOn = true, friendFry = -1;
    place(YOU, 0, SIT_Y, BZ, Math.PI, 'sit', .4); place(FR, 0, SIT_Y, -BZ, 0, 'sit', .4);
    const fx = { [0]: [], [1]: [] };
    // ---- YOU pose defaults
    YOU.pitch = .08; YOU.arms = { lx: -.15, lz: -.12, rx: -.15, rz: .12 }; FR.pitch = .05; FR.arms = { lx: -.15, lz: .12, rx: -.15, rz: -.12 };
    const lean = (o, k, rx) => { o.pitch = .6 * k + .05; return -(1.57 + o.pitch) - rx; };
    let eatFry = false, stolenFx = []; let counterN = 0;
    if (bi === 0) {
      // YOU eats a fry (arm up to mouth), FRIEND lunges for fries 3 times
      const c = (lt * 1.5) % 1; const up = smooth(Math.sin(clamp(c) * Math.PI)); YOU.arms = { lx: -.15, lz: -.12, rx: lerp(-1.05, -2.35, up), rz: .1 }; YOU.pitch = .08 + .04 * up; eatFry = true;
      const steals = [.55, 1.45, 2.35]; let u = 0, k = -1; steals.forEach((s, i) => { if (lt >= s) k = i; });
      if (k >= 0) { const l = lt - steals[k]; const ext = smooth(l / .22), ret = smooth((l - .26) / .26); u = ext * (1 - ret); friendFry = k; var stealL = l; }
      FR.pitch = .05 + .6 * u; FR.arms = { lx: -.15, lz: .12, rx: lerp(-.15, -(1.57 + FR.pitch + .35), u), rz: -.05 };
      if (k >= 0 && stealL > .26) { /* fry flies hand->mouth */ }
      counterN = lerp(0, 3, p) | 0; if (lt > 2.6) counterN = 3; else if (lt > 1.8) counterN = 2; else if (lt > .8) counterN = 1; else counterN = 0;
      faceShock = lt > 2.2;
    } else if (bi === 1) {
      wallU = clamp(lt / 2.0);
      // you: mix mortar + pump, friend watches then climbs
      const bld = Math.sin(lt * 9) * .25; const pose = smooth((lt - 2.2) / .25) * (1 - smooth((lt - 3.2) / .25));
      YOU.pitch = .3 * (1 - pose); YOU.arms = { lx: lerp(-1.4 + bld, -2.6, pose), lz: -.1 - pose * .3, rx: lerp(-1.4 - bld, -2.6, pose), rz: .1 + pose * .3 };
      if (lt >= 2.3 && lt < 3.3) faceShock = false;
      FR.arms = { lx: -.15, lz: .12, rx: lerp(-.15, -1.6, smooth((lt - 1.4) / .3)), rz: -.2 }; FR.pitch = .1;
      counterN = Math.round(lerp(3, 3, 1)) + (lt > 3.8 ? Math.min(6, Math.floor((lt - 3.8) * 6)) : 0);
      faceShock = lt > 3.5;
      // friend stands + climbs
      if (lt >= 2.55) {
        const s0 = 2.55; const st = smooth((lt - s0) / .3); const climbU = clamp((lt - 3.4) / 1.35); // 0 on bench .. 1 inside
        place(FR, 0, 0, -BZ, 0, 'idle', .8); FR.y = lerp(SIT_Y, TH, st); FR.arms = { lx: -.2, lz: .15, rx: -.2, rz: -.15 };
        if (lt >= 3.1) { const w = smooth((lt - 3.1) / .55); FR.anim = 'walk'; FR.speed = 1.2; FR.z = lerp(-BZ, -1.05, w); FR.y = lerp(TH, TY, smooth((lt - 3.2) / .35)); FR.arms = { lx: -.4, lz: .15, rx: -.4, rz: -.15 }; }
        if (lt >= 3.7) { const q = clamp((lt - 3.7) / .95); FR.anim = 'jump'; FR.speed = .5; FR.z = lerp(-1.05, -.05, smooth(q)); FR.y = TY + Math.sin(q * Math.PI) * 1.0; FR.pitch = .45 * Math.sin(q * Math.PI); FR.arms = { lx: -2.7 + Math.sin(lt * 20) * .3, lz: .3, rx: -2.7 - Math.sin(lt * 20) * .3, rz: -.3 }; if (q >= 1) { FR.anim = 'squat'; FR.speed = .7; FR.arms = null; FR.y = TY + .22; } }
        if (lt >= 4.7) { FR.anim = 'squat'; FR.y = TY + .02; FR.z = -.06; FR.pitch = .25; }
      }
    } else if (bi === 2) {
      wallU = 1 - smooth((lt - .15) / .5); moatU = smooth((lt - .2) / .75);
      YOU.arms = { lx: -.15 - Math.sin(lt * 10) * .4, lz: -.12, rx: -1.0 + Math.sin(lt * 10) * .4, rz: .12 }; YOU.pitch = .35; // you dig
      faceShock = lt > 1.7;
      // friend swims across the moat in freestyle
      { const q = smooth((lt - 1.45) / 1.3); place(FR, lerp(-1.9, .0, q), TY + .12, -.62, Math.PI / 2, 'walk', 1.6); FR.lie = -Math.PI / 2; FR.yaw = Math.PI / 2; FR.anim = 'idle'; const ph = lt * 9; FR.arms = { lx: ph, lz: 0, rx: ph + Math.PI, rz: 0 }; FR.pitch = 0; if (lt < 1.45) { place(FR, 0, SIT_Y, -BZ, 0, 'sit', .4); FR.pitch = .05; FR.arms = { lx: -.15, lz: .12, rx: -.15, rz: -.12 }; } }
      counterN = 9 + (lt > 2.0 ? Math.min(18, Math.floor((lt - 2.0) * 22)) : 0);
    } else if (bi === 3) {
      wallU = 0; moatU = 1; bottleOn = true; streamOn = lt > .55 && lt < 3.0; sauce = smooth((lt - .7) / 2.4);
      const pour = smooth((lt - .15) / .4) * (1 - smooth((lt - 3.0) / .4)); YOU.pitch = .5 * pour + .05; YOU.arms = { lx: -.15, lz: -.12, rx: lerp(-.3, -2.05, pour), rz: lerp(.12, .15, pour) };
      if (lt > 2.4) { const ch = smooth((lt - 2.4) / .25); YOU.arms.lx = lerp(-.15, -2.7, ch); YOU.arms.lz = -.4 * ch; YOU.arms.rx = lerp(YOU.arms.rx, -2.6, ch); YOU.pitch = .05; YOU.arms.rz = .4 * ch; }
      faceShock = lt > 3.7;
      if (lt > 3.2) { YOU.arms.lx = -2.5; YOU.arms.rx = -2.5; YOU.arms.lz = .2; YOU.arms.rz = -.2; YOU.arms.lx = -2.5; }
      // friend: floats on his back with a snorkel
      if (lt >= 3.35) { const dr = (lt - 3.35); const x = .95 + lerp(.5, -.4, smooth(dr / 4.3)); place(FR, x, TY + .26 + Math.sin(lt * 2.2) * .03, -.62, Math.PI / 2, 'idle', .3); FR.lie = -Math.PI / 2; FR.yaw = -Math.PI / 2; const up = smooth((lt - 6.05) / .25); FR.arms = { lx: lerp(-2.9, -2.9, 0), lz: .3, rx: lerp(-.4, -2.6, up), rz: .6 }; FR.pitch = 0; maskOn = true; FR.arms.lx = -2.8 + Math.sin(lt * 1.8) * .12; FR.arms.lz = .2; }
      else { FR.arms = { lx: -.15, lz: .12, rx: -.15, rz: -.12 }; FR.pitch = .05; FR.y = 5; FR.vis = false; }
      counterN = 27 + (lt > 3.7 ? Math.min(54, Math.floor((lt - 3.7) * 14)) : 0);
    } else if (bi === 4) {
      showSafe = true; plateOn = false;
      const drop = lt - .05; // safe lands on table
      doorA = lerp(-1.75, 0, smooth((lt - 1.3) / .55)); const slam = lt > 1.85; safeShake = lt > 1.85 && lt < 2.1 ? Math.sin(lt * 80) * .02 * (1 - (lt - 1.85) / .25) : 0;
      dialRot = lt > 2.0 ? (lt - 2.0) * 14 * Math.exp(-(lt - 2.0) * .45) : 0; wheelRot = lt > 2.5 ? smooth((lt - 2.5) / .5) * 1.6 : 0; ledOn = lt > 3.0 ? 1 : 0;
      YOU.pitch = .1; YOU.arms = { lx: -1.2, lz: -.25, rx: -1.2, rz: .25 }; if (lt > 2.9) { YOU.arms = { lx: -2.4, lz: -.35, rx: -2.4, rz: .35 }; YOU.pitch = -.05; }
      FR.pitch = -.12; FR.arms = { lx: -2.5, lz: -.9, rx: -2.5, rz: .9 }; // hands behind head, smug
      counterN = 81;
    } else {
      showSafe = true; plateOn = false; doorA = 0; ledOn = 1; wheelRot = 1.6; safeShake = Math.sin(lt * 70) * .018 * (lt > .1 ? 1 : 0);
      const pn = Math.sin(lt * 17); YOU.pitch = .35; YOU.arms = { lx: -1.9 + pn * .35, lz: -.1, rx: -1.9 - pn * .35, rz: .1 }; faceShock = true; YOU.extra = 0;
      FR.pitch = .12 + .08 * Math.sin(lt * 9); burgerOn = true; const bite = Math.sin(lt * 6) * .5 + .5; FR.arms = { lx: -.15, lz: .12, rx: lerp(-2.05, -2.5, bite), rz: -.1 }; counterN = 81;
    }
    // sauce / water visuals
    // ---- people -> matrices
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t);
    const headY = hp(YOU, 'head'), headF = hp(FR, 'head'), hRy = hp(YOU, 'handR'), hLy = hp(YOU, 'handL'), hRf = hp(FR, 'handR');
    // ---- wall, moat
    wallG.visible = wallU > .001 && bi <= 2; if (wallG.visible) setWall(wallU);
    moat.visible = moatU > .001 && bi <= 3; const mg = moat; mg.scale.set(.2 + .8 * smooth(moatU), 1, .2 + .8 * smooth(moatU)); mg.scale.y = 1;
    waterM.color.copy(COL_W).lerp(COL_R, sauce); waterM.emissive.copy(EM_W).lerp(EM_R, sauce); waterM.emissiveIntensity = lerp(.55, .8, sauce);
    rip.forEach((m, i) => { const on = moat.visible && moatU > .9; const ph = (t * .6 + i * .31) % 1; const a = cr(i, 9) * 6.28 + 0; const r = MI + .12 + cr(i, 10) * (MO - MI - .24); m.position.set(Math.cos(a) * r, .105, Math.sin(a) * r); const s = .6 + ph * 3; m.scale.setScalar(s); m.material.opacity = on ? (1 - ph) * .5 * (1 - sauce * .5) : 0; m.visible = on; });
    // bubbles in the sauce
    bubs.forEach((m, i) => { const on = bi === 3 && sauce > .35 && moat.visible; m.visible = on; if (!on) return; const ph = (t * .9 + cr(i, 11)) % 1; const a = cr(i, 12) * 6.28, r = MI + .1 + cr(i, 13) * (MO - MI - .2); m.position.set(Math.cos(a) * r, TY + .12 + Math.sin(ph * Math.PI) * .09, Math.sin(a) * r); m.scale.setScalar(.5 + Math.sin(ph * Math.PI) * 1.1); });
    // ---- fries on plate
    plate.visible = plateOn; fries.forEach((m, i) => { m.visible = true; });
    if (bi === 0) { const k = friendFry; fries.forEach((m, i) => { m.visible = !(k >= 0 && i <= k && (lt - [.55, 1.45, 2.35][i]) > .26) || false; }); fries.forEach((m, i) => { const st = [.55, 1.45, 2.35][i]; if (i <= 2 && lt >= st + .2) m.visible = false; }); }
    // traveling fries
    hotFry.visible = false; myFry.visible = false;
    if (bi === 0) {
      // your fry attached to your right hand (hide at mouth peak)
      myFry.visible = true; attach(myFry, YOU, 'handR', [0, -.05, .1], [0, 0, 0]); myFry.visible = true;
      const steals = [.55, 1.45, 2.35]; for (let k = 0; k < 3; k++) { const l = lt - steals[k]; if (l > .2 && l < .75) { hotFry.visible = true; attach(hotFry, FR, 'handR', [0, -.05, .12], [0, 0, 0]); hotFry.visible = true; if (l > .55) hotFry.visible = false; } }
    }
    if (bi === 1 && lt > 4.7) { const q = lt - 4.7; hotFry.visible = true; attach(hotFry, FR, 'handR', [0, -.05, .12]); hotFry.visible = Math.sin(q * 8) > -.3; }
    // ---- bottle / stream
    bottle.visible = bottleOn; stream.visible = false;
    if (bottleOn) { const pour = smooth((lt - .15) / .4) * (1 - smooth((lt - 3.0) / .4)); const bm = new THREE.Matrix4(); attach(bottle, YOU, 'handR', [0, -.02, .06], [Math.PI * lerp(.15, .92, pour) , 0, 0]); bottle.visible = true;
      if (lt < .15) bottle.visible = true;
      if (streamOn) { const tip = new THREE.Vector3(0, .5, 0).applyMatrix4(bottle.matrix); const wy = TY + .12; stream.position.set(tip.x, (tip.y + wy) / 2, tip.z); stream.scale.set(1 + Math.sin(t * 40) * .15, Math.max(.01, tip.y - wy), 1 + Math.sin(t * 37) * .15); stream.visible = tip.y > wy + .05; } }
    // ---- safe
    SAFE.visible = showSafe; if (showSafe) { const dropU = bi === 4 ? clamp((lt - .05) / .5) : 1; const y0 = bi === 4 ? Math.max(0, 6 * (1 - dropU) * (1 - dropU)) + (dropU >= 1 && lt < .8 ? Math.abs(Math.sin((lt - .55) * 14)) * .12 * Math.exp(-(lt - .55) * 5) : 0) : 0; SAFE.position.set(safeShake, TY + y0, 0); door.rotation.y = doorA; door.userData.dial.rotation.z = 0; door.userData.dialFace.rotation.z = -dialRot; door.userData.wheel.rotation.z = wheelRot; door.userData.led.material.color.set(ledOn ? 0x39ff5a : 0xff2a1a);
      // fries + plate inside the safe (on shelf)
      plate.visible = true; plate.position.set(0, TY + .5 + .02 + y0, .0); plate.scale.setScalar(.78); if (safeShake) plate.position.x = safeShake; } else { plate.position.set(0, TY + .01, 0); plate.scale.setScalar(1); }
    interiorLight.intensity = showSafe ? 1.4 : 0; interiorLight.position.set(0, TY + .75, .15);
    // ---- friend mask
    mask.visible = maskOn; if (maskOn) { attach(mask, FR, 'head', [0, .02, .34]); mask.matrix.scale(V3(1.5, 1.5, 1.5)); mask.visible = true; }
    burger.visible = burgerOn; if (burgerOn) { attach(burger, FR, 'handR', [0, -.05, .15], [Math.PI / 2 - .3, 0, 0]); burger.visible = true; const bite = 1 - clamp((lt) / 2.1) * .4; burger.children.forEach((c, i) => { }); burger.scale.setScalar(1.1 * bite); }
    // ---- labels
    const lb = (s, on, pos, k = 1) => { s.visible = on; if (on) { s.position.copy(pos); const a = clamp(k); s.scale.set(1.15 * a, .36 * a, 1); } };
    lb(lbClever, bi === 1 && lt > 2.32 && lt < 3.2, V3(headY.x + .1, headY.y + .8 + Math.min(.12, (lt - 2.32) * .5), headY.z - .1), Math.min(1.1, (lt - 2.32) * 5));
    lb(lbBetter, bi === 3 && lt > 2.4 && lt < 3.5, V3(headY.x, headY.y + .85, headY.z - .1), Math.min(1.1, (lt - 2.4) * 5) * 1.25);
    lb(lbSafe, bi === 4 && lt > 3.5 && lt < 4.7, V3(0, TY + 1.8, .2), Math.min(1.1, (lt - 3.5) * 5));
    plusA.forEach((s, k) => { const st = bi === 0 ? [.8, 1.7, 2.6][k] : -9; const l = lt - st; const on = bi === 0 && l > 0 && l < .7; s.visible = on; if (on) { s.position.set(headF.x + .45, headF.y + .55 + l * .7, headF.z + .15); s.scale.set(.42, .21, 1); s.material.opacity = 1 - l / .7; } });
    // ---- camera
    const an = { hy: headY, hf: headF, hRy, hRf };
    const dk = (x, y, z) => [x, y, z]; const PL = dk(0, TY + .15, 0); const chead = (dx, dy, dz) => (a) => [a.hf.x + dx, a.hf.y + dy, a.hf.z + dz]; const thead = (dy = 0) => (a) => [a.hf.x, a.hf.y + dy, a.hf.z];
    const yhead = (dx, dy, dz) => (a) => [a.hy.x + dx, a.hy.y + dy, a.hy.z + dz]; const tyh = (dy = 0) => (a) => [a.hy.x, a.hy.y + dy, a.hy.z];
    const fry = (a) => dk(0, TY + .25, 0);
    let shake = 0;
    if (bi === 0) rig(lt, [[0, dk(4.4, 3.9, 3.0), dk(3.7, 3.4, 2.6), dk(0, 1.1, 0), dk(0, 1.1, 0), 50, 46], [.95, dk(1.7, 2.0, .6), dk(1.25, 1.85, .4), dk(0, TY + .2, -.15), dk(0, TY + .15, -.15), 40, 36], [2.0, dk(-4.4, 3.8, -3.0), dk(-3.7, 3.4, -2.6), dk(0, 1.1, 0), dk(0, 1.1, 0), 50, 46]], an, t);
    else if (bi === 1) rig(lt, [[0, dk(2.4, 2.3, 2.0), dk(1.75, 2.15, 1.6), dk(0, TY + .3, 0), dk(0, TY + .35, 0), 42, 38], [2.25, dk(1.9, 2.5, -.7), dk(1.6, 2.4, -.5), (a) => [a.hy.x, a.hy.y + .45, a.hy.z], (a) => [a.hy.x, a.hy.y + .45, a.hy.z], 40, 36], [3.1, dk(4.6, 2.8, -.4), dk(4.4, 3.2, -.2), dk(0, 2.0, -.5), dk(0, 2.1, -.4), 62, 58], [4.7, dk(1.4, 2.2, -.7), dk(1.1, 2.0, -.5), dk(0, TY + .5, -.05), dk(0, TY + .5, -.05), 40, 36]], an, t);
    else if (bi === 2) rig(lt, [[0, dk(2.1, 3.1, 1.6), dk(1.7, 3.3, 1.2), dk(0, TY, 0), dk(0, TY, 0), 44, 42], [1.4, dk(1.9, 2.5, -3.1), dk(.9, 2.3, -2.7), dk(.2, TY + .2, -.7), dk(.0, TY + .2, -.7), 50, 46]], an, t);
    else if (bi === 3) rig(lt, [[0, dk(1.9, 2.9, 1.9), dk(1.5, 2.6, 1.55), dk(.1, TY + .5, .45), dk(.1, TY + .35, .45), 42, 38], [2.0, dk(-2.9, 3.4, 2.5), dk(-2.4, 3.1, 2.1), dk(0, 1.1, 0), dk(0, 1.1, 0), 46, 42], [3.45, dk(-3.4, 2.2, -1.5), dk(-3.0, 2.15, -1.3), dk(0, TY + .3, -.7), dk(0, TY + .3, -.7), 46, 42], [4.9, (a) => [a.hf.x + .9, a.hf.y + 1.3, a.hf.z + 1.2], (a) => [a.hf.x + .7, a.hf.y + 1.1, a.hf.z + 1.0], thead(0), thead(0), 40, 34], [6.2, (a) => [a.hf.x + 1.5, a.hf.y + 1.0, a.hf.z + 1.5], (a) => [a.hf.x + 2.3, a.hf.y + 1.3, a.hf.z + 1.9], (a) => [a.hf.x + .4, a.hf.y - .1, a.hf.z], (a) => [a.hf.x + .5, a.hf.y - .1, a.hf.z], 46, 52]], an, t);
    else if (bi === 4) rig(lt, [[0, dk(3.2, 3.0, 2.7), dk(2.6, 2.7, 2.3), dk(0, 1.6, 0), dk(0, 1.6, 0), 50, 46], [1.05, dk(1.9, 2.3, 2.4), dk(1.5, 2.15, 2.0), dk(-.05, TY + .65, .3), dk(-.05, TY + .65, .3), 40, 36], [2.0, dk(.55, TY + .55, 1.55), dk(.6, TY + .45, 1.35), dk(.25, TY + .4, .5), dk(.25, TY + .35, .5), 38, 34], [3.0, dk(-3.5, 2.8, -2.4), dk(-3.0, 2.6, -2.1), dk(0, 1.6, 0), dk(0, 1.6, 0), 50, 46], [3.9, dk(2.2, 2.6, 2.2), dk(1.8, 2.5, 1.9), dk(0, TY + .6, .35), dk(0, TY + .6, .35), 42, 38]], an, t);
    else rig(lt, [[0, dk(1.9, 2.1, 2.1), dk(1.4, 2.0, 1.75), dk(0, TY + .55, .45), dk(0, TY + .55, .45), 42, 38], [.85, dk(2.6, 2.8, 2.8), dk(8.5, 7.6, 8.6), dk(0, 1.4, 0), dk(0, 1.3, 0), 48, 58]], an, t, safeShake ? .01 : 0);
    A.follow(0, 0); A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    const VAL = String(Math.round(counterN)); const NOTE = ['his hand is fast', 'walls are for climbing', 'he does freestyle', 'he likes it spicy', 'fries: protected', 'fries you can reach: 0'][bi];
    hud.counter('FRIES STOLEN', VAL, NOTE, '', bi >= 1);
    hud.tm(''); hud.pop('', 0);
  } };
}
