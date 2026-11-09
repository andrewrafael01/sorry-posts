// 659 invention chain: roommate eats leftovers -> name label -> padlock+chain on fridge -> bolt cutters -> safe -> forgot combo -> starving -> roommate orders pizza.
// One apartment kitchen, object cutaways (container, padlock, dial, clock), climbing STOLEN counter.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, clamp, smooth, lerp, attach, RoundedBoxGeometry } = lib;
  const A = makeStage({ fog: 0x1b1d2a, fogNear: 30, fogFar: 90, clouds: false, skyTop: 0x1a2040, skyMid: 0x252b4a, skyBot: 0x30384f, shadowExtent: 9, shadowRes: 2048, hemi: 1.3, sunI: 1.5, sunColor: 0xfff0d8, sunDir: [.25, 1, .55], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const mk = (geo, m, parent, x = 0, y = 0, z = 0) => { const q = new THREE.Mesh(geo, m); q.position.set(x, y, z); q.castShadow = true; q.receiveShadow = true; parent.add(q); return q; };
  const steel = new THREE.MeshStandardMaterial({ color: 0x8a919c, roughness: .35, metalness: .85 }), steelD = new THREE.MeshStandardMaterial({ color: 0x5d636d, roughness: .4, metalness: .85 });

  // ------------------------------------------------------------------ room
  const floorT = cvs(256, 256, (g) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#e6dcc4' : '#9fc2bd'; g.fillRect(i * 32, j * 32, 32, 32); } }); floorT.t.wrapS = floorT.t.wrapT = THREE.RepeatWrapping; floorT.t.repeat.set(4, 4);
  { const fl = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 9), new THREE.MeshStandardMaterial({ map: floorT.t, roughness: .45 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, 1.2); fl.receiveShadow = true; S.add(fl); }
  const WALL = 0xe8d7a4;
  addBox(S, 0, 1.75, -3.15, 8.6, 3.5, .3, WALL); addBox(S, -4.15, 1.75, 1.2, .3, 3.5, 9, WALL);
  addBox(S, 4.15, 1.75, -1.5, .3, 3.5, 3.6, WALL); addBox(S, 4.15, 1.75, 3.7, .3, 3.5, 3.4, WALL); addBox(S, 4.15, 3.05, 1.1, .3, .9, 1.6, WALL);
  addBox(S, 0, .1, -2.98, 8, .2, .06, 0xf4efe0, { cast: false }); addBox(S, -3.98, .1, 1.2, .06, .2, 8.4, 0xf4efe0, { cast: false });
  // porch + backdrop outside the door
  { const p = new THREE.Mesh(new THREE.PlaneGeometry(4, 6), mat(0x4b4f5c)); p.rotation.x = -Math.PI / 2; p.position.set(6, -.01, 1.5); p.receiveShadow = true; S.add(p); addBox(S, 8, 2, 1.5, .2, 4, 8, 0x2a3350, { cast: false }); }
  // front door (hinged at z=1.9, swings outward)
  const doorG = new THREE.Group(); doorG.position.set(4.15, 0, 1.9); S.add(doorG); addBox(doorG, 0, 1.3, -.8, .1, 2.6, 1.6, 0x9b4a32, { round: .02 }); addBox(doorG, -.07, 1.2, -1.4, .08, .08, .14, 0xd8c070);
  // window (night) on back wall
  { addBox(S, 2.9, 2.0, -2.98, 1.5, 1.2, .05, 0xf2eee0, { cast: false }); const w = cvs(128, 96, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0a1030'); gr.addColorStop(1, '#27336a'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = '#fff6c8'; g.beginPath(); g.arc(88, 30, 12, 0, 7); g.fill(); for (let i = 0; i < 14; i++) { g.fillStyle = '#fff'; g.fillRect(cr(i, 1) * W, cr(i, 2) * H * .8, 2, 2); } }); const pl = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.0), new THREE.MeshBasicMaterial({ map: w.t })); pl.position.set(2.9, 2.0, -2.94); S.add(pl); addBox(S, 2.9, 2.0, -2.93, .05, 1.0, .03, 0xf2eee0, { cast: false }); addBox(S, 2.9, 2.0, -2.93, 1.3, .05, .03, 0xf2eee0, { cast: false }); }
  // left counter + cabinets
  const CT = 1.01;
  addBox(S, -3.6, .48, -.45, .8, .96, 4.9, 0xb7855a, { round: .02 }); addBox(S, -3.55, CT - .02, -.45, .95, .06, 4.95, 0xe9e4da, { round: .01 });
  for (let i = 0; i < 5; i++) addBox(S, -3.19, .48, -2.5 + i * 1.0, .03, .82, .92, 0xc79668, { cast: false }), addBox(S, -3.16, .62, -2.15 + i * 1.0, .03, .03, .22, 0xd8d8d8, { cast: false });
  addBox(S, -3.75, 2.55, -1.75, .5, 1.0, 2.3, 0xb7855a, { round: .02 });
  // toaster + plant + mugs on counter for life
  addBox(S, -3.7, CT + .13, 1.5, .3, .22, .4, 0xc7ccd4, { round: .04 }); addBox(S, -3.65, CT + .1, 1.85, .22, .2, .22, 0xb8472e, { round: .03 }); { const lf = new THREE.Mesh(new THREE.IcosahedronGeometry(.17, 1), mat(0x3f9a45, { flatShading: true })); lf.position.set(-3.65, CT + .34, 1.85); S.add(lf); }
  // wall clock (analog) right above the counter near the back + sticker poster
  addBox(S, 0, 2.6, -2.98, .9, 1.1, .04, 0xf7e9b8, { cast: false });
  { const pst = cvs(128, 160, (g, w, h) => { g.fillStyle = '#f7e9b8'; g.fillRect(0, 0, w, h); txt(g, 'FRIDGE', 64, 52, 30, '#b8472e'); txt(g, 'RULES', 64, 86, 30, '#b8472e'); txt(g, '(IGNORED)', 64, 124, 18, '#555', { w: 700 }); }); const pp = new THREE.Mesh(new THREE.PlaneGeometry(.86, 1.06), new THREE.MeshBasicMaterial({ map: pst.t })); pp.position.set(0, 2.6, -2.95); S.add(pp); }
  // lamp light
  const lamp = new THREE.PointLight(0xffe6b8, 60, 0, 2); lamp.position.set(0, 3.1, .8); S.add(lamp);
  // ------------------------------------------------------------------ fridge
  const FX = -1.2, FZ = -2.2; const fridge = new THREE.Group(); fridge.position.set(FX, 0, FZ); S.add(fridge);
  const fM = new THREE.MeshStandardMaterial({ color: 0xcfd8df, roughness: .3, metalness: .5 }), fIn = new THREE.MeshStandardMaterial({ color: 0xc4d6e0, roughness: .6, emissive: 0x25303a, emissiveIntensity: .08 });
  { const b = (w, h, d, x, y, z, m = fM) => mk(new THREE.BoxGeometry(w, h, d), m, fridge, x, y, z);
    b(.08, 3, 1.5, -.71, 1.5, 0); b(.08, 3, 1.5, .71, 1.5, 0); b(1.5, 3, .08, 0, 1.5, -.71, fIn); b(1.5, .08, 1.5, 0, 2.96, 0); b(1.42, .08, 1.5, 0, .1, 0, fIn); b(1.5, .1, 1.5, 0, .05, 0, steelD);
    for (const y of [.85, 1.45, 2.05, 2.62]) b(1.34, .04, 1.4, 0, y, .02, new THREE.MeshStandardMaterial({ color: 0xcfe9f2, transparent: true, opacity: .75, roughness: .1 }));
    // contents
    b(.16, .3, .12, .35, 1.02, -.1, mat(0xf2f2ee)); b(.16, .06, .12, .35, 1.2, -.1, mat(0x3a78d8)); mk(new THREE.CylinderGeometry(.08, .08, .26, 14), mat(0xd24a2a), fridge, .5, 1.0, .1); mk(new THREE.CylinderGeometry(.09, .09, .2, 14), mat(0xe9c34a), fridge, -.5, 1.58, .1); mk(new THREE.CylinderGeometry(.06, .06, .34, 12), mat(0x4aa84a), fridge, .5, 1.64, -.15); mk(new THREE.SphereGeometry(.09, 10, 8), mat(0xf2d13a), fridge, .33, 2.15, .1); mk(new THREE.SphereGeometry(.09, 10, 8), mat(0xe35a2a), fridge, .5, 2.15, -.1); b(.34, .2, .26, -.4, 2.17, -.2, mat(0xf2f0e6)); b(.3, .26, .3, .35, 2.74, 0, mat(0x3a78d8)); }
  const fIC = new THREE.PointLight(0xdff2ff, 0, 5, 2); fIC.position.set(FX, 2.3, FZ + .45); S.add(fIC);
  const fdoor = new THREE.Group(); fdoor.position.set(-.75, 0, .75); fridge.add(fdoor); // hinge left
  { mk(new THREE.BoxGeometry(1.5, 2.95, .14), fM, fdoor, .75, 1.5, .07); mk(new THREE.BoxGeometry(.07, 1.2, .08), steelD, fdoor, 1.38, 1.5, .18); b2(); function b2() { mk(new THREE.BoxGeometry(1.3, .02, .02), mat(0x8a919c), fdoor, .75, 2.55, .15); }
    for (let i = 0; i < 4; i++) mk(new THREE.BoxGeometry(.14, .14, .03), mat([0xe35a2a, 0x3a78d8, 0xf2d13a, 0x4aa84a][i]), fdoor, .3 + i * .22, 2.2 - (i % 2) * .15, .17);
    for (const y of [.7, 1.2, 1.7]) mk(new THREE.BoxGeometry(1.1, .05, .22), new THREE.MeshStandardMaterial({ color: 0xdcecf2, roughness: .2 }), fdoor, .75, y, -.1);
    fdoor.traverse((m) => { m.castShadow = true; }); }
  // ------------------------------------------------------------------ container with spaghetti (group origin = bottom center, +z = label side)
  const cont = new THREE.Group(); S.add(cont); const food = new THREE.Group(); cont.add(food);
  { const wm = new THREE.MeshStandardMaterial({ color: 0x9fd0ee, roughness: .35 }); const cb = (w, h, d, x, y, z) => mk(new THREE.BoxGeometry(w, h, d), wm, cont, x, y, z);
    cb(.52, .02, .38, 0, .01, 0); cb(.52, .2, .02, 0, .1, .18); cb(.52, .2, .02, 0, .1, -.18); cb(.02, .2, .38, .25, .1, 0); cb(.02, .2, .38, -.25, .1, 0);
    const sp = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12, 0, 6.3, 0, 1.6), mat(0xf0c25a, { roughness: .6 })); sp.scale.set(.22, .13, .16); sp.position.y = .03; sp.castShadow = true; food.add(sp);
    const sa = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10, 0, 6.3, 0, 1.4), mat(0xc02a1a, { roughness: .4 })); sa.scale.set(.14, .06, .1); sa.position.y = .12; food.add(sa);
    for (let i = 0; i < 3; i++) { const mb = new THREE.Mesh(new THREE.SphereGeometry(.05, 10, 8), mat(0x6b3a22)); mb.position.set(-.08 + i * .08, .17 + (i % 2) * .01, (i - 1) * .02); mb.castShadow = true; food.add(mb); }
    for (let i = 0; i < 7; i++) { const tr = new THREE.Mesh(new THREE.TorusGeometry(.06 + cr(i, 1) * .06, .008, 5, 16), mat(0xf6d070)); tr.rotation.set(Math.PI / 2 + (cr(i, 2) - .5) * .6, 0, cr(i, 3) * 3); tr.position.set((cr(i, 4) - .5) * .28, .08 + cr(i, 5) * .06, (cr(i, 6) - .5) * .18); food.add(tr); } }
  const sticker = cvs(512, 192, () => { }); const stickerM = new THREE.Mesh(new THREE.PlaneGeometry(.46, .17), new THREE.MeshBasicMaterial({ map: sticker.t })); stickerM.position.set(0, .1, .192); cont.add(stickerM);
  let lastChars = -2; const drawSticker = (n) => { if (n === lastChars) return; lastChars = n; const g = sticker.g; g.fillStyle = '#fffdf4'; g.fillRect(0, 0, 512, 192); g.strokeStyle = '#d8342a'; g.lineWidth = 12; g.strokeRect(6, 6, 500, 180); const s = "MIKE'S"; txt(g, s.slice(0, n), 256, 82, 120, '#111'); if (n >= 6) txt(g, 'DO NOT EAT', 256, 158, 44, '#d8342a'); sticker.t.needsUpdate = true; }; drawSticker(0);
  const setCont = (x, y, z, ry, f = 1, sc = 1.6) => { cont.position.set(x, y, z); cont.rotation.y = ry; cont.scale.setScalar(sc); food.scale.set(lerp(.3, 1, f), lerp(.2, 1, f), lerp(.3, 1, f)); cont.visible = true; };
  // ------------------------------------------------------------------ props: fork, marker, pepper, arm props
  const mkFork = () => { const g = new THREE.Group(); mk(new THREE.BoxGeometry(.025, .025, .3), steel, g, 0, 0, .0); for (const s of [-.025, 0, .025]) mk(new THREE.BoxGeometry(.01, .012, .13), steel, g, s, 0, .21); const tw = mk(new THREE.SphereGeometry(.05, 10, 8), mat(0xf0c25a), g, 0, 0, .2); tw.scale.set(1, .8, 1.2); g.userData.tw = tw; g.visible = false; S.add(g); return g; };
  const forkW = mkFork(), forkA = mkFork();
  const marker = new THREE.Group(); { mk(new THREE.CylinderGeometry(.022, .022, .26, 10), mat(0x111111), marker).rotation.x = Math.PI / 2; const cp = mk(new THREE.CylinderGeometry(.026, .026, .1, 10), mat(0xd8342a), marker, 0, 0, -.14); cp.rotation.x = Math.PI / 2; mk(new THREE.ConeGeometry(.02, .05, 8), mat(0x111111), marker, 0, 0, .15).rotation.x = Math.PI / 2; marker.visible = false; S.add(marker); }
  const pepper = new THREE.Group(); { const pb = cvs(128, 128, (g, w, h) => { g.fillStyle = '#eee'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.fillRect(0, 50, w, 40); txt(g, 'PEPPER', 64, 72, 26, '#fff'); }); mk(new THREE.CylinderGeometry(.06, .06, .2, 16), new THREE.MeshStandardMaterial({ map: pb.t, roughness: .3 }), pepper); mk(new THREE.CylinderGeometry(.062, .062, .05, 16), steel, pepper, 0, .125, 0); pepper.visible = false; S.add(pepper); }
  const specks = []; for (let i = 0; i < 14; i++) { const q = new THREE.Mesh(new THREE.SphereGeometry(.012, 5, 4), mat(0x151515)); q.visible = false; S.add(q); specks.push(q); }
  const mkArm = (color) => { const g = new THREE.Group(); mk(new THREE.BoxGeometry(.13, .13, 1.6), mat(color), g, 0, 0, -.8); mk(new THREE.BoxGeometry(.13, .1, .16), mat(0xe7b48a), g, 0, 0, .05); g.visible = false; S.add(g); return g; };
  const armO = mkArm(0xf0902a), armB = mkArm(0x3a78d8);
  const setArm = (g, tip, aim, on = true) => { g.visible = on; g.position.copy(tip); g.lookAt(aim.x, aim.y, aim.z); };
  // ------------------------------------------------------------------ chain + padlock (beat 1)
  const ZF = FZ + .94 - .02, ZB = FZ - .78, XL = FX - .86, XR = FX + .86, CY = 1.55; // loop around body + door
  const path = [[FX, ZF], [XR, ZF], [XR, ZB], [XL, ZB], [XL, ZF], [FX, ZF]]; const segs = []; let totalL = 0; for (let i = 0; i < path.length - 1; i++) { const a = path[i], b = path[i + 1]; const L = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push({ a, b, L, o: totalL }); totalL += L; }
  const NL = Math.round(totalL / .085); const chainM = new THREE.MeshStandardMaterial({ color: 0xb8bec8, roughness: .3, metalness: .9 }); const links = [];
  for (let i = 0; i < NL; i++) { const d = (i + .5) / NL * totalL; const sg = segs.find((s) => d <= s.o + s.L) || segs[segs.length - 1]; const u = (d - sg.o) / sg.L; const x = lerp(sg.a[0], sg.b[0], u), z = lerp(sg.a[1], sg.b[1], u); const along = Math.abs(sg.b[0] - sg.a[0]) > 0; const o = new THREE.Group(); o.rotation.y = along ? 0 : Math.PI / 2; const l = new THREE.Mesh(new THREE.TorusGeometry(.04, .013, 6, 12), chainM); l.scale.set(1.45, 1, 1); l.rotation.x = (i % 2) * Math.PI / 2; l.castShadow = true; o.add(l); o.visible = false; S.add(o); links.push({ o, x, z, i, d }); }
  const lockG = new THREE.Group(); S.add(lockG); const gold = mat(0xe0b030, { roughness: .3, metalness: .75 }); const shackle = new THREE.Mesh(new THREE.TorusGeometry(.07, .018, 8, 16, Math.PI), steel); shackle.position.y = .1; shackle.castShadow = true; lockG.add(shackle); mk(new RoundedBoxGeometry(.24, .2, .1, 3, .03), gold, lockG); mk(new THREE.CylinderGeometry(.025, .025, .02, 8), mat(0x111111), lockG, 0, .02, .055).rotation.x = Math.PI / 2; mk(new THREE.BoxGeometry(.012, .06, .02), mat(0x111111), lockG, 0, -.03, .056); lockG.visible = false;
  const LOCK0 = V3(FX, CY - .17, ZF + .02);
  // bolt cutters
  const cutters = new THREE.Group(); const cutA = new THREE.Group(), cutB = new THREE.Group(); { const hm = mat(0xd8342a, { roughness: .5 }); for (const [gp, s] of [[cutA, 1], [cutB, -1]]) { mk(new THREE.BoxGeometry(.05, .05, .95), hm, gp, 0, 0, .52); mk(new THREE.BoxGeometry(.06, .06, .2), mat(0x222), gp, 0, 0, 1.0); mk(new THREE.BoxGeometry(.04, .07, .16), steelD, gp, -s * .02, 0, .0); cutters.add(gp); } cutters.visible = false; S.add(cutters); }
  // ------------------------------------------------------------------ safe
  const SX = 1.5, SZ = -2.2, SW = 1.1, SHt = 1.25, SD = .9; const safe = new THREE.Group(); safe.position.set(SX, 0, SZ); S.add(safe); let sdoor, sdial, swheel, sled;
  { const T = .1; const add = (w, h, d, x, y, z, m = steel) => mk(new THREE.BoxGeometry(w, h, d), m, safe, x, y, z);
    add(SW, T, SD, 0, SHt - T / 2, 0); add(SW, T, SD, 0, T / 2 + .06, 0); add(T, SHt - .06, SD, -SW / 2 + T / 2, .06 + (SHt - .06) / 2, 0); add(T, SHt - .06, SD, SW / 2 - T / 2, .06 + (SHt - .06) / 2, 0); add(SW, SHt - .06, .08, 0, .06 + (SHt - .06) / 2, -SD / 2 + .04, steelD); add(SW - .2, .03, SD - .2, 0, .55, 0, steelD);
    for (const sx of [-.45, .45]) for (const sz of [-.3, .3]) add(.14, .06, .14, sx, .03, sz, steelD);
    sdoor = new THREE.Group(); sdoor.position.set(-SW / 2 + .02, 0, SD / 2); safe.add(sdoor); const DW = SW - .04, DH = SHt - .08, DY = .06 + DH / 2;
    mk(new THREE.BoxGeometry(DW, DH, .12), steel, sdoor, DW / 2, DY, .06); for (let i = 0; i < 12; i++) { const side = i % 4, u = (i >> 2) / 2; mk(new THREE.SphereGeometry(.025, 8, 6), steelD, sdoor, side === 0 ? .07 : side === 1 ? DW - .07 : .07 + u * (DW - .14), side < 2 ? DY - DH / 2 + .08 + ((i * .37) % 1) * (DH - .16) : side === 2 ? DY + DH / 2 - .06 : DY - DH / 2 + .06, .125); }
    const dialT = cvs(256, 256, (g) => { g.fillStyle = '#1a1c20'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.strokeStyle = '#e8e8ea'; g.lineWidth = 5; for (let i = 0; i < 40; i++) { const a = i / 40 * 6.283, l = i % 5 ? 12 : 26; g.beginPath(); g.moveTo(128 + Math.cos(a) * (112 - l), 128 + Math.sin(a) * (112 - l)); g.lineTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112); g.stroke(); } for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; txt(g, String(i * 10), 128 + Math.cos(a) * 70, 128 + Math.sin(a) * 70, 28, '#fff', { w: 700 }); } });
    sdial = new THREE.Group(); sdial.position.set(DW / 2, .76, .12); sdoor.add(sdial); const dBase = mk(new THREE.CylinderGeometry(.21, .23, .05, 28), steelD, sdial); dBase.rotation.x = Math.PI / 2; const dFace = new THREE.Mesh(new THREE.CircleGeometry(.2, 32), new THREE.MeshStandardMaterial({ map: dialT.t, roughness: .4, metalness: .3 })); dFace.position.z = .03; sdial.add(dFace); sdial.userData.face = dFace; mk(new THREE.CylinderGeometry(.06, .06, .06, 16), steel, sdial, 0, 0, .06).rotation.x = Math.PI / 2; mk(new THREE.ConeGeometry(.03, .06, 3), mat(0xc92a1e), sdial, 0, .23, .04);
    swheel = new THREE.Group(); swheel.position.set(DW / 2, .3, .12); sdoor.add(swheel); for (let i = 0; i < 3; i++) { const sp = mk(new THREE.BoxGeometry(.42, .05, .05), steel, swheel, 0, 0, .05); sp.rotation.z = i * Math.PI / 3; for (const s of [-1, 1]) mk(new THREE.SphereGeometry(.05, 10, 8), mat(0xc92a1e), swheel, s * Math.cos(i * Math.PI / 3) * .21, s * Math.sin(i * Math.PI / 3) * .21, .06); } mk(new THREE.CylinderGeometry(.07, .07, .08, 14), steelD, swheel, 0, 0, .05).rotation.x = Math.PI / 2;
    sled = mk(new THREE.SphereGeometry(.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff2a1a, toneMapped: false }), sdoor, DW * .85, 1.08, .13);
    const np = cvs(256, 64, (g, w, h) => { g.fillStyle = '#c9a34a'; g.fillRect(0, 0, w, h); txt(g, 'FOOD ONLY', w / 2, 34, 40, '#2a1d06'); }); const npm = new THREE.Mesh(new THREE.PlaneGeometry(.5, .125), new THREE.MeshStandardMaterial({ map: np.t, metalness: .5, roughness: .4 })); npm.position.set(DW / 2, 1.1, .125); sdoor.add(npm); }
  safe.visible = false;
  // sticky notes on the safe door
  const COMBOS = ['12-34-56', '07-21-88', '30-15-04', '42-42-42', '1-2-3-4', '99-00-11']; const notes = COMBOS.map((c, i) => { const nt = cvs(128, 128, (g, w, h) => { g.fillStyle = ['#ffe94a', '#ff9ec4', '#8ee8ff', '#a8f28a'][i % 4]; g.fillRect(0, 0, w, h); txt(g, c, 64, 52, c.length > 7 ? 24 : 30, '#222', { w: 800 }); txt(g, '✗', 64, 98, 56, '#d8201a'); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(.26, .26), new THREE.MeshBasicMaterial({ map: nt.t })); m.visible = false; S.add(m); return m; });
  const noteSpots = [[-.3, 1.0], [.28, 1.0], [-.22, .62], [.34, .6], [0, .24], [.38, .24]]; // relative to safe center front
  // ------------------------------------------------------------------ digital clock (beat 2)
  const clock = new THREE.Group(); { const cb = mk(new RoundedBoxGeometry(.7, .34, .26, 3, .04), mat(0x15161a, { roughness: .4 }), clock, 0, .17, 0); const mkC = (colon) => cvs(512, 256, (g, w, h) => { g.fillStyle = '#240606'; g.fillRect(0, 0, w, h); txt(g, '2' + (colon ? ':' : ' ') + '00', 215, 132, 190, '#ff2a1a', { w: 700 }); txt(g, 'AM', 438, 190, 70, '#ff2a1a', { w: 700 }); g.fillStyle = 'rgba(255,40,20,.18)'; g.fillRect(0, 0, w, h); }); clock.userData.t = [mkC(true), mkC(false)]; const scr = new THREE.Mesh(new THREE.PlaneGeometry(.6, .26), new THREE.MeshBasicMaterial({ map: clock.userData.t[0].t, toneMapped: false })); scr.position.set(0, .17, .132); clock.add(scr); clock.userData.scr = scr; clock.position.set(-3.5, CT, 1.0); clock.rotation.y = Math.PI / 2; S.add(clock); clock.visible = false; }
  // ------------------------------------------------------------------ pizza
  const pizzaBox = new THREE.Group(); { const tp = cvs(256, 256, (g, w, h) => { g.fillStyle = '#d9b27a'; g.fillRect(0, 0, w, h); g.fillStyle = '#d8342a'; g.fillRect(20, 20, w - 40, h - 40); g.fillStyle = '#fff'; g.fillRect(28, 28, w - 56, h - 56); txt(g, 'PIZZA', 128, 108, 72, '#d8342a'); txt(g, 'HOT & FRESH', 128, 170, 28, '#333', { w: 800 }); g.fillStyle = '#f2c84b'; g.beginPath(); g.moveTo(128, 200); g.lineTo(100, 236); g.lineTo(156, 236); g.fill(); }); mk(new THREE.BoxGeometry(.8, .07, .8), mat(0xd9b27a), pizzaBox); const tpm = new THREE.Mesh(new THREE.PlaneGeometry(.78, .78), new THREE.MeshBasicMaterial({ map: tp.t })); tpm.rotation.x = -Math.PI / 2; tpm.position.y = .037; pizzaBox.add(tpm); pizzaBox.visible = false; S.add(pizzaBox); }
  const slice = new THREE.Group(); { const sl = mk(new THREE.CylinderGeometry(.33, .33, .035, 3), mat(0xf2b838, { roughness: .5 }), slice); sl.rotation.y = Math.PI; mk(new THREE.CylinderGeometry(.045, .045, .04, 10), mat(0xc0301e), slice, 0, .02, .1); mk(new THREE.CylinderGeometry(.045, .045, .04, 10), mat(0xc0301e), slice, .05, .02, .0); mk(new THREE.CylinderGeometry(.045, .045, .04, 10), mat(0xc0301e), slice, -.05, .02, .02); slice.visible = false; S.add(slice); }
  const cap = new THREE.Group(); { mk(new THREE.BoxGeometry(.5, .13, .5), mat(0xd8342a), cap); mk(new THREE.BoxGeometry(.5, .04, .22), mat(0xd8342a), cap, 0, -.04, .34); cap.visible = false; S.add(cap); }
  // ------------------------------------------------------------------ people
  const crowd = new Crowd(S, 3, 91); const P = crowd.p; const YOU = P[0], FR = P[1], DL = P[2];
  const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  col(0, ['torso', 'armL', 'armR'], 0x3a78d8); col(0, ['legL', 'legR'], 0x2b3347); col(0, ['hair'], 0x4a2f1c); col(1, ['torso', 'armL', 'armR'], 0xf0902a); col(1, ['legL', 'legR'], 0x3f5a3a); col(1, ['hair'], 0x16110c); col(2, ['torso', 'armL', 'armR'], 0xd8342a); col(2, ['legL', 'legR'], 0x22252e); col(2, ['hair'], 0x2a1c10);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  YOU.h = 1; FR.h = 1.04; DL.h = 1;
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; };
  const hide = (o) => { place(o, 0, -9, 0, 0, 'idle'); o.vis = false; };
  // ------------------------------------------------------------------ labels
  const mkLabel = (text, c1, c2, w = 512) => { const l = cvs(w, 160, (g, ww) => { txt(g, text, ww / 2, 84, text.length > 9 ? 78 : 110, c1, { stroke: c2, sw: 20 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const lbClever = mkLabel('CLEVER!', '#ffe23a', '#111'), lbSeason = mkLabel('SEASONING!', '#ffb36a', '#111'), lbSnip = mkLabel('SNIP!', '#ff5a4a', '#111'), lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111'), lbLocked = mkLabel('LOCKED', '#9fe8ff', '#111'), lbGrr = mkLabel('GRRRRR', '#ffd28a', '#111'), lbDing = mkLabel('DING DONG', '#fff', '#111'), lbHm = mkLabel('NOPE.', '#ff7a6a', '#111');
  const lbPlus = mkLabel('+1', '#ff5a4a', '#111', 256); const plusA = [lbPlus]; for (let i = 0; i < 5; i++) { const s = lbPlus.clone(); s.material = lbPlus.material.clone(); S.add(s); plusA.push(s); }
  const lab = (s, on, pos, w = 1.15, k = 1) => { s.visible = on; if (on) { s.position.copy(pos); const a = clamp(k); s.scale.set(w * a, w * .3125 * a, 1); } };
  const sweat = []; for (let i = 0; i < 8; i++) { const q = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 6), new THREE.MeshBasicMaterial({ color: 0x8fd8ff })); q.scale.y = 1.4; q.visible = false; S.add(q); sweat.push(q); }
  const rings = []; for (let i = 0; i < 3; i++) { const c = cvs(128, 128, (g) => { g.strokeStyle = '#ffd28a'; g.lineWidth = 10; g.beginPath(); g.arc(64, 64, 52, 0, 7); g.stroke(); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: c.t, transparent: true, depthTest: false })); s.visible = false; s.renderOrder = 9; S.add(s); rings.push(s); }
  // ------------------------------------------------------------------ camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3(); const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .015 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .012 + Math.cos(t * 57) * shake; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .006); };
  const dk = (x, y, z) => [x, y, z];
  const SHELF = V3(FX, 1.47, FZ + .12);
  // ------------------------------------------------------------------ frame
  const pass = ({ t, bi, lt, p }, final) => {
    bi = Math.min(bi, 4);
    let night = 0, fdoorA = 0, count = 0, label = 'LEFTOVERS STOLEN', note = '', faceShock = false, shake = 0, nameChars = 6, spagF = 1, hot = false;
    hide(YOU); hide(FR); hide(DL); [lbClever, lbSeason, lbSnip, lbBetter, lbLocked, lbGrr, lbDing, lbHm, ...plusA].forEach((x) => { x.visible = false; });
    forkW.visible = false; forkA.visible = false; marker.visible = false; pepper.visible = false; armO.visible = false; armB.visible = false; cutters.visible = false; lockG.visible = false; pizzaBox.visible = false; slice.visible = false; cap.visible = false; cont.visible = false; clock.visible = false; safe.visible = false;
    links.forEach((l) => { l.o.visible = false; }); notes.forEach((n) => { n.visible = false; }); specks.forEach((q) => { q.visible = false; }); sweat.forEach((q) => { q.visible = false; }); rings.forEach((r) => { r.visible = false; });
    let sdoorA = 0, dialRot = 0, wheelRot = 0, ledOn = 0, safeY = 0, lockedDoor = false; let noteN = 0; let chainU = 0, lockOn = false, fallT = -1, lockPos = LOCK0.clone(); let showClockSprite = false; let showPlus = [];
    const cutterAim = V3(FX + .2, 0.95, ZF + 1.0);
    const stdFR = (pitch = .05) => { FR.pitch = pitch; FR.arms = { lx: -.15, lz: .12, rx: -.15, rz: -.12 }; };
    let an = {};
    // =============================================================== beat 0
    if (bi === 0) {
      count = lt < .55 ? 0 : lt < 1.35 ? 1 : lt < 2.15 ? 2 : lt < 2.9 ? 3 : lt < 6.5 ? 3 : lt < 7.0 ? 4 : lt < 7.6 ? 5 : 6; if (lt < 2.9) count = Math.min(count, 3);
      night = smooth((lt - 5.35) / .25);
      if (lt < 2.85) { // close-up: fork-arm raids the container on the shelf
        fdoorA = -1.9; spagF = lt < .55 ? 1 : lt < 1.35 ? .78 : lt < 2.15 ? .55 : .36; setCont(SHELF.x, SHELF.y, SHELF.z, 0, spagF); drawSticker(0); stickerM.visible = false;
        const raid = (s) => { const l = lt - s; return l > 0 && l < .75 ? Math.sin(clamp(l / .75) * Math.PI) : 0; };
        const r = Math.max(raid(.3), raid(1.1), raid(1.9)); const tip = V3(SHELF.x + .1, SHELF.y + .22 - r * .02, lerp(SHELF.z + .9, SHELF.z + .1, smooth(r))); setArm(armO, tip, V3(tip.x - .8, tip.y - .3, tip.z - .7), r > .01);
        forkA.visible = r > .01; if (forkA.visible) { forkA.position.set(tip.x - .02, tip.y - .08, tip.z - .04); forkA.rotation.set(.9, 0, 0); forkA.userData.tw.visible = r > .6 || lt % .8 > .55; }
        plusA.forEach((s, k) => { const l = lt - [.55, 1.35, 2.15][k]; const on = k < 3 && l > 0 && l < .7; lab(s, on, V3(SHELF.x + .1, SHELF.y + .7 + l * .35, SHELF.z + .5), .5, 1); if (on) s.material.opacity = 1 - l / .7; });
      } else if (lt < 4.95) { // writing the name
        nameChars = Math.min(6, Math.floor((lt - 3.05) / .26) + 1); if (lt < 3.0) nameChars = 0; fdoorA = -1.9; setCont(-3.5, CT, -.1, Math.PI / 2, 1); stickerM.visible = true; drawSticker(nameChars);
        const wr = clamp((lt - 3.0) / 1.6); const tip = V3(-3.28, CT + .13 + Math.sin(lt * 14) * .006, -.1 - .17 + wr * .34); setArm(armB, V3(tip.x + .18, tip.y + .18, tip.z + .02), V3(-3.6, CT + .1, tip.z)); marker.visible = lt < 4.7; marker.position.set(tip.x + .12, tip.y + .08, tip.z); marker.lookAt(tip.x - .1, tip.y - .1, tip.z);
        armB.position.set(tip.x + .26, tip.y + .17, tip.z + .0); armB.lookAt(tip.x - .5, tip.y - .1, tip.z - .02);
        count = 3; if (lt > 4.3) lab(lbClever, false, V3());
      } else { // wide: you slide the labeled container into the fridge
        const u = smooth((lt - 4.95) / .5); fdoorA = -1.9; stickerM.visible = true; drawSticker(6);
        setCont(lerp(-.45, SHELF.x + .15, u), lerp(1.3, SHELF.y, u), lerp(-.9, SHELF.z, u), lerp(.6, 0, u), 1);
        place(YOU, .1, 0, -.95, Math.PI + .55, 'idle', .5); YOU.arms = { lx: -.15, lz: -.12, rx: lerp(-1.3, -1.5, u), rz: .1 }; YOU.pitch = .05;
        if (lt > 5.2) { const th = smooth((lt - 5.2) / .2); YOU.arms.lx = lerp(-.15, -2.3, th); YOU.arms.lz = -.3 * th; }
        faceShock = false; lab(lbClever, lt > 5.08 && lt < 5.95, V3(.35, 2.45 + Math.min(.1, (lt - 5.08) * .5), -.9), 1.5, Math.min(1.1, (lt - 5.08) * 5));
      }
      if (lt >= 5.6) { // night: roommate sneaks in, takes the container, eats, adds pepper
        stickerM.visible = true; drawSticker(6);
        const wk = clamp((lt - 5.55) / .85); const rx = lerp(.75, -.45, smooth(wk)), rz = lerp(.45, -.55, smooth(wk));
        fdoorA = lt < 6.15 ? 0 : -1.9 * smooth((lt - 6.15) / .4);
        place(FR, rx, 0, rz, Math.PI + .25 + (lt > 6.5 ? smooth((lt - 6.5) / .3) * (Math.PI * 2 - .5 - Math.PI - .25) : 0), wk < 1 ? 'walk' : 'idle', 1.0); FR.pitch = wk < 1 ? .38 : .18; FR.arms = { lx: -.35, lz: .12, rx: -.35, rz: -.12 };
        const hasC = lt >= 6.55; const hL = hp(FR, 'handL'), hR = hp(FR, 'handR');
        if (lt >= 6.5) { const q = clamp((lt - 6.5) / .25); FR.arms = { lx: lerp(-.35, -1.35, q), lz: .12, rx: lerp(-.35, -1.0, q), rz: -.12 }; }
        if (lt >= 6.75 && lt < 7.45) { const bite = Math.sin((lt - 6.75) * 6.3) * .5 + .5; FR.arms.rx = lerp(-1.1, -2.35, bite); FR.pitch = .18 + .1 * bite; forkA.visible = false; forkW.visible = true; attach(forkW, FR, 'handR', [0, -.02, .02], [-.9, 0, 0]); forkW.visible = true; forkW.userData.tw.visible = bite > .35; spagF = lerp(.36, .1, clamp((lt - 6.75) / .7)); }
        else if (lt >= 7.45) { spagF = .1; }
        if (lt >= 7.45 && lt < 8.9) { FR.arms.rx = -1.2 + Math.sin(lt * 20) * .35; FR.arms.rz = -.2; pepper.visible = true; attach(pepper, FR, 'handR', [0, .1, .05], [-1.7 + Math.sin(lt * 20) * .25, 0, 0]); pepper.visible = true; specks.forEach((q, i) => { const ph = ((lt * 3 + cr(i, 1)) % 1); const hp0 = new THREE.Vector3().setFromMatrixPosition(pepper.matrix); q.visible = true; q.position.set(hp0.x + (cr(i, 2) - .5) * .12, hp0.y - .12 - ph * .55, hp0.z + (cr(i, 3) - .5) * .12); }); lab(lbSeason, lt > 7.9, V3(rx + .55, 2.35, rz + .1), 1.6, Math.min(1.1, (lt - 7.9) * 5)); }
        if (hasC) { const hl = hp(FR, 'handL'); setCont(hl.x + .02, hl.y + .08, hl.z - .02, .5, spagF); } else { setCont(SHELF.x, SHELF.y, SHELF.z, 0, 1); }
        crowd.setFace('calm'); an = { hl: hp(FR, 'handL') };
        count = lt < 6.55 ? 3 : lt < 7.0 ? 4 : lt < 7.45 ? 5 : lt < 8.0 ? 6 : 7; if (lt > 8.2) count = 8;
        plusA.forEach((s, k) => { const st = [6.8, 7.15, 7.6, 8.25][k]; const l = lt - st; const on = k < 4 && l > 0 && l < .6; lab(s, on, V3(rx + .1, 2.35 + l * .5, rz - .1), .55, 1); if (on) s.material.opacity = 1 - l / .6; });
        if (lt > 6.15) fIC.intensity = 10 * smooth((lt - 6.15) / .4);
      }
      an.hy = hp(YOU, 'head');
      const sh0 = [[0, dk(-.95, 2.3, 1.5), dk(-1.0, 2.2, 1.3), dk(FX + .0, SHELF.y - .05, FZ + .1), dk(FX, SHELF.y - .07, FZ + .1), 40, 36],
        [2.85, dk(-2.45, 1.55, 1.15), dk(-2.55, 1.5, .95), dk(-3.5, CT + .08, -.1), dk(-3.5, CT + .1, -.1), 36, 32],
        [4.95, dk(-.2, 1.9, 2.4), dk(-.4, 1.9, 2.1), dk(-.6, 1.4, -1.5), dk(-.7, 1.4, -1.5), 46, 42],
        [5.6, dk(2.4, 1.55, 1.9), dk(1.2, 1.5, 1.6), dk(-.4, 1.2, -1.0), dk(-.6, 1.2, -1.0), 50, 44],
        [6.5, dk(-2.8, 1.5, 1.6), dk(-2.6, 1.5, 1.4), dk(-.7, 1.25, -.6), dk(-.7, 1.25, -.6), 50, 46],
        [7.45, dk(-2.5, 1.5, 1.5), dk(-2.3, 1.5, 1.3), dk(-.7, 1.3, -.6), dk(-.7, 1.3, -.6), 46, 42]];
      rig(lt, sh0, an, t);
    }
    // =============================================================== beat 1
    else if (bi === 1) {
      count = 8 + (lt < 3.0 ? 0 : Math.floor((lt - 3.0) * 10)); count = Math.min(count, 14); fdoorA = lt > 3.55 ? -1.9 * smooth((lt - 3.55) / .45) : 0; if (lt > 3.55) fIC.intensity = 8;
      chainU = clamp((lt - .12) / 1.15); lockOn = true; lockPos.copy(LOCK0);
      const shackleDown = lt > 1.4;
      // your arm clicks the lock on
      { const ap = smooth((lt - .7) / .45) * (1 - smooth((lt - 1.55) / .4)); const tip = V3(LOCK0.x + .45 * (1 - ap) + .12, LOCK0.y - .12 + .2 * (1 - ap), LOCK0.z + 1.0 * (1 - ap) + .2); setArm(armB, tip, V3(LOCK0.x, LOCK0.y, LOCK0.z - .3), lt > .6 && lt < 2.0); }
      let rx = 1.2; const cut = lt >= 2.3;
      if (lt >= 1.95) { const w = clamp((lt - 1.95) / .5); rx = lerp(1.7, FX + .4, smooth(w)); place(FR, rx, 0, ZF + 1.25, Math.PI, 'walk', 1.1); FR.pitch = .15; if (w >= 1) { FR.anim = 'idle'; } FR.arms = { lx: -1.0, lz: .15, rx: -1.0, rz: -.15 }; }
      const open = lt < 2.35 ? 0 : lt < 2.9 ? smooth((lt - 2.35) / .3) * .22 : .02; const snapAt = 2.9; const snapped = lt >= snapAt; const op = snapped ? lerp(.02, .24, 0) : (lt < 2.35 ? 0.24 : .24 * (1 - smooth((lt - 2.55) / .35)) + .02);
      if (lt >= 2.0) { cutters.visible = true; cutters.position.set(LOCK0.x, LOCK0.y + .13, LOCK0.z + .03); cutters.lookAt(cutterAim.x, cutterAim.y, cutterAim.z); const spread = snapped ? .02 : (lt < 2.3 ? .1 + smooth((lt - 2.0) / .3) * .12 : lerp(.22, .02, smooth((lt - 2.55) / .35))); cutA.rotation.y = spread; cutB.rotation.y = -spread; }
      if (lt >= 1.95 && lt < 4.09) { FR.arms = { lx: -1.1, lz: .1, rx: -1.1, rz: -.1 }; if (lt > 3.4) { FR.arms = { lx: -2.6, lz: .3, rx: -2.6, rz: -.3 }; FR.anim = 'idle'; } cutters.visible = lt < 3.45; }
      if (snapped) fallT = lt - snapAt; if (snapped) lockOn = true;
      lab(lbLocked, lt > 1.45 && lt < 2.1, V3(LOCK0.x + .1, LOCK0.y + .62, LOCK0.z + .25), .85, Math.min(1.1, (lt - 1.45) * 6));
      lab(lbSnip, lt > snapAt && lt < snapAt + .7, V3(LOCK0.x - .35, LOCK0.y + .55, LOCK0.z + .3), 1.0, Math.min(1.1, (lt - snapAt) * 8));
      plusA.forEach((s, k) => { const st = 3.1 + k * .18; const l = lt - st; const on = k < 5 && l > 0 && l < .6; lab(s, on, V3(FX + .3 + k * .12, 2.5 + l * .5, ZF + .3), .5, 1); if (on) s.material.opacity = 1 - l / .6; });
      an.lp = lockPos; an.hy = hp(YOU, 'head');
      rig(lt, [[0, dk(-3.0, 1.6, .55), dk(-2.7, 1.55, .15), dk(LOCK0.x - .1, LOCK0.y + .08, LOCK0.z - .1), dk(LOCK0.x, LOCK0.y + .05, LOCK0.z), 33, 29],
        [2.0, dk(-2.9, 1.5, .55), dk(-2.6, 1.45, .2), dk(LOCK0.x, LOCK0.y + .05, LOCK0.z - .1), dk(LOCK0.x + .05, LOCK0.y, LOCK0.z - .1), 34, 30],
        [3.05, dk(-3.2, 1.6, 2.2), dk(-3.0, 1.7, 1.9), dk(FX + .1, 1.0, ZF - .3), dk(FX + .3, 1.0, ZF - .2), 46, 44]], an, t, snapped && fallT < .2 ? .01 : 0);
      var cutOpenState = snapped;
    }
    // =============================================================== beat 2
    else if (bi === 2) {
      safe.visible = true; night = lt < 3.3 ? .25 : smooth((lt - 3.3) / .35) * .75 + .25;
      count = 14 + (lt > 5.2 ? Math.min(28, Math.floor((lt - 5.2) * 12)) : Math.floor(lt * 1.2)); fdoorA = -1.9;
      const dropU = clamp(lt / .55); safeY = lt < .55 ? 6 * (1 - dropU) * (1 - dropU) : Math.abs(Math.sin((lt - .55) * 13)) * .1 * Math.exp(-(lt - .55) * 5); if (lt > .55 && lt < .85) shake = .012 * (1 - (lt - .55) / .3);
      sdoorA = lt < .8 ? 0 : lt < 1.25 ? -1.7 * smooth((lt - .8) / .45) : lt < 1.6 ? -1.7 : -1.7 * (1 - smooth((lt - 1.6) / .4));
      if (lt >= 1.95 && lt < 2.7) dialRot = (lt - 1.95) * 16 * Math.exp(-(lt - 1.95) * .5); if (lt >= 2.7) dialRot = 5; wheelRot = lt > 2.0 ? smooth((lt - 2.0) / .3) * 1.5 : 0; ledOn = lt > 2.0 ? 1 : 0;
      if (lt < 1.7) { const sx = lt > .9 && lt < 1.65; const a2 = smooth((lt - .95) / .35) * (1 - smooth((lt - 1.35) / .3)); stickerM.visible = true; drawSticker(6); const cz = lerp(SZ + 1.1, SZ + .0, smooth((lt - .95) / .35)); setCont(SX, .6 + (lt < .95 ? .65 : 0) * (1 - smooth((lt - .8) / .15)), lt < .95 ? SZ + 1.0 : cz, 0, .1, 1); cont.visible = lt > .8; const tip = V3(SX, .86, cz + .22); setArm(armB, tip, V3(SX, .8, SZ - .5), lt > .9 && lt < 1.65); }
      else cont.visible = false;
      if (lt >= 5.2 || lt >= 3.3 && false) { /* you at the safe */ }
      if (lt >= 5.1) {
        place(YOU, SX - .85, 0, SZ + 1.05, 2.5, 'idle', .5); YOU.pitch = .18; faceShock = true; const tw = Math.sin(lt * 5); YOU.arms = { lx: -1.25 + tw * .08, lz: .2, rx: -.3, rz: -.1 }; dialRot = 5 + (lt - 5.1) * Math.sin(lt * 3) * 2;
        for (let i = 0; i < 6; i++) { const st = 5.4 + i * .34; notes[i].visible = lt > st; if (lt > st) { const k = smooth((lt - st) / .12); notes[i].position.set(SX + noteSpots[i][0] * 1.02, noteSpots[i][1] + .04, SZ + SD / 2 + .15 + 0.002 * i + (1 - k) * .3); notes[i].rotation.set(0, 0, (cr(i, 3) - .5) * .6); notes[i].scale.setScalar(.9 + .1 * k); } }
        const hh = hp(YOU, 'head'); sweat.forEach((q, i) => { const ph = ((lt * 1.6 + cr(i, 1)) % 1); q.visible = true; q.position.set(hh.x + (cr(i, 2) - .5) * .5, hh.y + .1 - ph * .6, hh.z - .2 - cr(i, 4) * .1); q.material.opacity = 1; });
        an.hy = hh;
      }
      showClockSprite = lt >= 3.74 && lt < 5.1; clock.visible = lt >= 3.65 && lt < 5.1;
      if (clock.visible) { const bl = Math.floor(lt * 2) % 2; clock.userData.scr.material.map = clock.userData.t[bl].t; }
      lab(lbBetter, lt > 2.18 && lt < 3.2, V3(SX + .05, 1.62, SZ + 1.1), 1.5, Math.min(1.1, (lt - 2.18) * 5));
      rig(lt, [[0, dk(3.0, 2.1, 1.9), dk(2.7, 1.9, 1.6), dk(SX, .8, SZ + .3), dk(SX, .7, SZ + .3), 46, 42],
        [.85, dk(SX + 1.0, 1.1, SZ + 2.0), dk(SX + .75, 1.0, SZ + 1.6), dk(SX, .62, SZ + .3), dk(SX - .1, .62, SZ + .2), 34, 30],
        [1.65, dk(SX + .15, 1.05, SZ + 2.6), dk(SX + .1, 1.0, SZ + 2.1), dk(SX, .86, SZ + .5), dk(SX, .86, SZ + .5), 34, 28],
        [2.55, dk(3.0, 2.0, 1.4), dk(2.8, 1.9, 1.2), dk(SX, 1.0, SZ + .5), dk(SX, 1.0, SZ + .5), 44, 42],
        [3.65, dk(-1.0, 1.4, 1.0), dk(-1.3, 1.38, 1.0), dk(-3.5, CT + .2, 1.0), dk(-3.5, CT + .2, 1.0), 36, 30],
        [5.1, dk(3.0, 1.6, 1.9), dk(2.8, 1.55, 1.6), dk(SX - .3, 1.0, SZ + .5), dk(SX - .3, 1.0, SZ + .5), 46, 44]], an, t, shake);
    }
    // =============================================================== beat 3
    else if (bi === 3) {
      safe.visible = true; night = 1; count = 42; label = 'MEALS I CAN REACH'; hot = true; count = 0; note = 'safe: 1, food: locked in it'; sdoorA = 0; ledOn = 0; fdoorA = -1.9;
      place(YOU, SX - .1, .15, SZ + 2.5, 0, 'idle', .3); YOU.lie = Math.PI / 2; YOU.arms = { lx: -2.75, lz: -.15, rx: -2.75, rz: .15 }; YOU.pitch = 0; faceShock = true;
      notes.forEach((n, i) => { n.visible = true; n.position.set(SX + noteSpots[i][0] * 1.02, noteSpots[i][1] + .04, SZ + SD / 2 + .15 + 0.002 * i); n.rotation.set(0, 0, (cr(i, 3) - .5) * .6); }); dialRot = 5;
      const st = V3(SX - .1, .55, SZ + 1.4);
      rings.forEach((r, i) => { const ph = ((lt * 1.6 + i / 3) % 1); r.visible = true; r.position.copy(st); r.scale.setScalar(.25 + ph * .9); r.material.opacity = (1 - ph) * .9; });
      lab(lbGrr, true, V3(st.x + .6, st.y + .55 + Math.sin(lt * 18) * .02, st.z + .55), 1.2 + Math.sin(lt * 18) * .05, Math.min(1.1, lt * 8));
      rig(lt, [[0, dk(3.4, 1.7, 2.2), dk(2.9, 1.4, 1.6), dk(SX - .1, .45, SZ + 1.5), dk(SX - .1, .4, SZ + 1.4), 52, 46]], an, t);
    }
    // =============================================================== beat 4
    else {
      safe.visible = true; night = .5; label = 'PIZZA SLICES (HIS)'; hot = true; fdoorA = -1.9; sdoorA = 0; dialRot = 5; count = lt < 1.0 ? 0 : Math.min(8, Math.floor((lt - 1.0) * 7) + 1);
      notes.forEach((n, i) => { n.visible = true; n.position.set(SX + noteSpots[i][0] * 1.02, noteSpots[i][1] + .04, SZ + SD / 2 + .15 + 0.002 * i); n.rotation.set(0, 0, (cr(i, 3) - .5) * .6); });
      place(YOU, SX - .1, .15, SZ + 2.5, 0, 'idle', .3); YOU.lie = Math.PI / 2; YOU.arms = { lx: -2.75, lz: -.15, rx: -2.75, rz: .15 }; faceShock = true;
      const dr = smooth((lt - .15) / .3); doorG.rotation.y = -1.6 * smooth((lt - .05) / .3);
      place(DL, 5.0, 0, 1.15, -Math.PI / 2, 'idle', .5); DL.arms = { lx: -1.4, lz: .1, rx: -1.4, rz: -.1 }; DL.pitch = .05;
      const walk = smooth((lt - .95) / .6);
      place(FR, lerp(3.6, 2.4, walk), 0, lerp(1.15, -.1, walk), lerp(Math.PI / 2, Math.PI * .85, walk), lt > .95 && walk < 1 ? 'walk' : 'idle', .9); FR.arms = { lx: -1.4, lz: -.1, rx: -1.4, rz: .1 }; FR.pitch = 0;
      if (lt > 1.5) { const bite = Math.sin((lt - 1.5) * 7) * .5 + .5; FR.arms.rx = lerp(-1.5, -2.35, bite); FR.pitch = -.12; FR.arms.lx = -1.1; FR.arms.lz = .2; }
      const dh = hp(DL, 'handL'), dh2 = hp(DL, 'handR'), fh = hp(FR, 'handL'), fh2 = hp(FR, 'handR');
      pizzaBox.visible = true; const pass = smooth((lt - .4) / .35);
      const dm = V3((dh.x + dh2.x) / 2 - .02, (dh.y + dh2.y) / 2 + .09, (dh.z + dh2.z) / 2); const fm = V3((fh.x + fh2.x) / 2, (fh.y + fh2.y) / 2 + .09, (fh.z + fh2.z) / 2);
      if (lt < .95) { pizzaBox.position.set(lerp(dm.x, fm.x, pass), lerp(dm.y, fm.y, pass), lerp(dm.z, fm.z, pass)); pizzaBox.rotation.set(0, 0, 0); } else { attach(pizzaBox, FR, 'handL', [0, .12, .1], [-.2, 0, 0]); pizzaBox.visible = true; pizzaBox.scale.setScalar(1); }
      cap.visible = true; attach(cap, DL, 'head', [0, .27, .0]); cap.visible = true;
      if (lt > 1.15) { slice.visible = true; attach(slice, FR, 'handR', [0, -.02, .12], [-1.0, 0, 0]); slice.visible = true; slice.scale.setScalar(lt > 1.8 ? .75 : 1); }
      lab(lbDing, lt < .45, V3(3.2, 2.5, 1.2), 1.5, Math.min(1.1, lt * 8 + .3));
      an = { fm: fm, hy: hp(FR, 'head') };
      rig(lt, [[0, dk(5.9, 1.4, -1.8), dk(5.8, 1.4, -1.5), dk(4.3, 1.15, 1.15), dk(4.3, 1.15, 1.15), 36, 33],
        [.95, dk(.4, 1.3, 3.5), dk(.7, 1.25, 3.2), dk(2.0, .9, -.4), dk(2.1, 1.0, -.4), 50, 46]], an, t);
    }
    // =============================================================== common updates
    // lighting
    A.hemi.intensity = lerp(.9, .25, night); A.sun.intensity = lerp(1.7, .22, night); lamp.intensity = lerp(70, 55, night); S.environmentIntensity = lerp(.9, .22, night); A.renderer.toneMappingExposure = lerp(1.1, 1.25, night);
    if (bi !== 0 || lt < 6.1) fIC.intensity = fdoorA < -.1 ? 5 : 0; if (bi === 1) fIC.intensity = fdoorA < -.3 ? 8 : 0;
    fdoor.rotation.y = fdoorA;
    // chain + lock
    if (bi === 1) {
      const nVis = Math.floor(chainU * NL); links.forEach((l, i) => { const vis = i < nVis; l.o.visible = vis; let y = CY, ox = 0, oz = 0, rz = 0; if (fallT >= 0) { const dl = Math.max(0, fallT - .03 - .1 * Math.abs(l.d - totalL * .5) / totalL * 2); const drop = Math.min(CY - .04, 4.9 * dl * dl); y = CY - drop; rz = dl * (cr(i, 1) - .5) * 4; const spreadK = 1 - Math.exp(-dl * 3); ox = (cr(i, 2) - .5) * .5 * spreadK; oz = (cr(i, 3)) * .35 * spreadK; } l.o.position.set(l.x + ox, y, l.z + oz); l.o.rotation.z = rz; });
      lockG.visible = lockOn; lockG.position.copy(LOCK0); lockG.rotation.set(0, 0, 0); shackle.position.y = .1 + (lt < 1.4 ? .05 : 0) + (fallT >= 0 ? .05 : 0);
      if (fallT >= 0) { const dl = Math.max(0, fallT - .02); const drop = Math.min(LOCK0.y - .12, 4.9 * dl * dl); lockG.position.set(LOCK0.x, LOCK0.y - drop, LOCK0.z + (1 - Math.exp(-dl * 3)) * .3); lockG.rotation.set(dl * 3, 0, dl * 2.2); if (LOCK0.y - drop <= .13) { lockG.rotation.set(1.57, 0, .6); } }
      if (lt < .3) lockG.visible = false;
    } else { lockG.visible = false; }
    // safe state
    if (safe.visible) { safe.position.set(SX + (shake ? Math.sin(t * 90) * shake : 0), safeY, SZ); sdoor.rotation.y = sdoorA; sdial.userData.face.rotation.z = -dialRot; swheel.rotation.z = wheelRot; sled.material.color.set(ledOn ? 0x39ff5a : 0xff2a1a); }
    // crowd
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t);
    if (bi === 0 && lt >= 5.6) { const hl = hp(FR, 'handL'); if (lt >= 6.55) cont.position.set(hl.x + .02, hl.y + .08, hl.z - .02); }
    // clock + extras
    // hud
    if (!final) return;
    A.follow(0, 0); A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    let VAL = String(Math.round(count));
    if (bi === 0) note = lt < 3 ? 'he is not subtle' : lt < 5.6 ? 'container: labeled' : 'he adds "seasoning"';
    else if (bi === 1) note = lt < 2.3 ? 'fridge: locked' : 'lock: ex-lock';
    else if (bi === 2) note = lt < 3.7 ? 'food: in safe' : lt < 5.1 ? 'time: 2:00 AM' : 'combos tried: ' + Math.min(6, Math.max(0, Math.floor((lt - 5.4) / .34) + 1));
    else if (bi === 4) note = 'pizza: not mine';
    hud.counter(label, VAL, note, '', hot || bi >= 1);
    hud.tm(''); hud.pop('', 0);
  };
  return { frame(a) { pass(a, false); pass(a, true); } };
}
