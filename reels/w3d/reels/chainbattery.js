// 662 invention chain: phone at 1% -> cable too short -> stand by outlet (bladder) -> power bank (also 1%) -> suitcase bank -> 100% and no texts.
// Two sets: a long hallway (beats 0-3) and a sidewalk (beats 4-5). Object close-ups + moving camera + climbing HOURS counter.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, addBox, mat, ground, Crowd, clamp, smooth, lerp, tree, building, car } = lib;
  const A = makeStage({ fog: 0xe9dcc6, fogNear: 38, fogFar: 150, clouds: true, skyTop: 0x5f9ae0, skyMid: 0xa9cdee, skyBot: 0xeaf1f8, shadowExtent: 15, shadowRes: 2048, hemi: 1.7, sunI: 1.7, sunDir: [-.3, .95, .45], exposure: 1.12 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const rr = (g, x, y, w, h, r, fill, stroke, lw = 6) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw; g.strokeStyle = stroke; g.stroke(); } };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const GH = new THREE.Group(), GS = new THREE.Group(); S.add(GH, GS);
  const bx = (g, ...a) => { const m = addBox(S, ...a); g.add(m); return m; };
  const SX = 60; // street set x offset

  // ================================================================== HALLWAY
  ground(S, 0x86a672, 500, { y: -.05 });
  const woodT = cvs(256, 256, (g, w, h) => { g.fillStyle = '#b98b59'; g.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) { g.fillStyle = `rgba(${i % 2 ? '255,230,190' : '60,30,10'},.12)`; g.fillRect(i * 64, 0, 64, h); g.fillStyle = 'rgba(50,25,8,.55)'; g.fillRect(i * 64, 0, 3, h); } for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(70,40,15,.12)'; g.fillRect(cr(i, 1) * 256, cr(i, 2) * 256, 2, 8 + cr(i, 3) * 30); } });
  woodT.t.wrapS = woodT.t.wrapT = THREE.RepeatWrapping; woodT.t.repeat.set(1, 8);
  { const fl = new THREE.Mesh(new THREE.PlaneGeometry(4.1, 32), new THREE.MeshStandardMaterial({ map: woodT.t, roughness: .6 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, -10); fl.receiveShadow = true; GH.add(fl); }
  for (const s of [-1, 1]) { bx(GH, s * 2.05, 1.6, -10, .1, 3.2, 32, 0xf0e4cd, { cast: true }); bx(GH, s * 1.99, .55, -10, .06, 1.1, 32, 0xd8c5a2, { cast: false }); bx(GH, s * 1.97, .09, -10, .07, .18, 32, 0xfaf4e6, { cast: false }); bx(GH, s * 1.98, 1.12, -10, .08, .07, 32, 0xfaf4e6, { cast: false }); }
  bx(GH, 0, 1.6, -26.05, 4.2, 3.2, .1, 0xeadcc2); bx(GH, 0, 1.6, 6.5, 4.2, 3.2, .1, 0xeadcc2, { cast: false }).visible = false;
  { // rug
    const rug = cvs(128, 512, (g, w, h) => { g.fillStyle = '#9c2f2f'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e8d9a8'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16); g.strokeStyle = '#d9b05a'; g.lineWidth = 3; g.strokeRect(20, 20, w - 40, h - 40); for (let i = 0; i < 14; i++) { g.fillStyle = '#e8d9a8'; g.beginPath(); g.moveTo(64, 40 + i * 33); g.lineTo(84, 56 + i * 33); g.lineTo(64, 72 + i * 33); g.lineTo(44, 56 + i * 33); g.fill(); } });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 26), new THREE.MeshStandardMaterial({ map: rug.t, roughness: 1 })); m.rotation.x = -Math.PI / 2; m.position.set(0, .012, -9); m.receiveShadow = true; const t = rug.t; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 6); GH.add(m); }
  // pictures on the right wall (x = 2), facing -x
  for (let i = 0; i < 7; i++) { const z = 3 - i * 3.3; const w = .7 + cr(i, 5) * .3, h = .8 + cr(i, 6) * .3; const fr = bx(GH, 1.94, 1.9, z, .05, h + .12, w + .12, 0x5a3a22, { cast: false });
    const art = cvs(128, 128, (g, ww, hh) => { g.fillStyle = ['#8ec5e8', '#f2c27a', '#a8d7a0', '#e9a3b4'][i % 4]; g.fillRect(0, 0, ww, hh); g.fillStyle = ['#3f7ea8', '#c0653a', '#4d8f48', '#b04a68'][i % 4]; g.beginPath(); g.arc(40 + cr(i, 8) * 50, 50, 26, 0, 7); g.fill(); g.fillRect(0, 92, ww, 36); });
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: art.t, roughness: .8 })); p.rotation.y = -Math.PI / 2; p.position.set(1.91, 1.9, z); GH.add(p); }
  // plant, console + lamp near the camera end
  { const pot = new THREE.Mesh(new THREE.CylinderGeometry(.28, .22, .5, 12), mat(0xc2693a)); pot.position.set(1.55, .25, -5.5); pot.castShadow = true; GH.add(pot); for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.IcosahedronGeometry(.3, 1), mat(0x3f8a3c, { flatShading: true })); l.position.set(1.55 + (cr(i, 1) - .5) * .5, .85 + cr(i, 2) * .6, -5.5 + (cr(i, 3) - .5) * .5); l.castShadow = true; GH.add(l); } }
  bx(GH, 1.65, .55, 3.0, .6, .06, 1.6, 0x6b4a2c); for (const dz of [-.65, .65]) bx(GH, 1.65, .27, 3.0 + dz, .5, .54, .06, 0x6b4a2c);
  { const lamp = new THREE.Mesh(new THREE.CylinderGeometry(.18, .26, .38, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xffe9b0, emissive: 0xffd88a, emissiveIntensity: .8, side: THREE.DoubleSide })); lamp.position.set(1.65, 1.0, 3.0); GH.add(lamp); const st = new THREE.Mesh(new THREE.CylinderGeometry(.04, .06, .4, 8), mat(0x333)); st.position.set(1.65, .78, 3.0); GH.add(st); }
  // outlet on the left wall (faces +x)
  const OUT = V3(-1.96, .55, 0);
  { const t = cvs(256, 330, (g, w, h) => { rr(g, 4, 4, w - 8, h - 8, 26, '#f4f1e8', '#c9c4b4', 6); for (const cy of [95, 235]) { rr(g, 40, cy - 62, 176, 124, 40, '#e4dfd0', '#b8b3a2', 4); g.fillStyle = '#1a1612'; rr(g, 88, cy - 34, 16, 52, 4, '#1a1612'); rr(g, 152, cy - 34, 16, 52, 4, '#1a1612'); g.beginPath(); g.arc(128, cy + 34, 10, 0, 7); g.fill(); } g.fillStyle = '#9a958a'; g.beginPath(); g.arc(128, 165, 5, 0, 7); g.fill(); });
    const o = new THREE.Mesh(new THREE.PlaneGeometry(.4, .52), new THREE.MeshStandardMaterial({ map: t.t, roughness: .5 })); o.rotation.y = Math.PI / 2; o.position.set(OUT.x + .001, OUT.y, OUT.z); GH.add(o); const pl = bx(GH, OUT.x - .018, OUT.y, OUT.z, .04, .54, .42, 0xf4f1e8, { cast: false }); }
  // wall clock above the outlet
  const clockG = new THREE.Group(); clockG.position.set(-1.97, 2.35, 0); clockG.rotation.y = Math.PI / 2; GH.add(clockG); let hHand, mHand, sHand;
  { const face = cvs(256, 256, (g, w, h) => { g.fillStyle = '#fafafa'; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 - 1.5708; txt(g, String(i || 12), 128 + Math.cos(a) * 92, 128 + Math.sin(a) * 92, 36, '#222', { w: 800 }); } for (let i = 0; i < 60; i++) { const a = i / 60 * 6.283; g.fillStyle = '#555'; g.fillRect(128 + Math.cos(a) * 118 - 1, 128 + Math.sin(a) * 118 - 1, 3, 3); } });
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .06, 32), mat(0x2a2a2e)); rim.rotation.x = Math.PI / 2; clockG.add(rim); const fc = new THREE.Mesh(new THREE.CircleGeometry(.39, 32), new THREE.MeshStandardMaterial({ map: face.t, roughness: .4 })); fc.position.z = .033; clockG.add(fc);
    const hand = (w, l, c, z) => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.BoxGeometry(w, l, .015), new THREE.MeshBasicMaterial({ color: c })); m.position.y = l / 2 - .03; g.add(m); g.position.z = z; clockG.add(g); return g; }; hHand = hand(.035, .2, 0x111111, .042); mHand = hand(.025, .3, 0x111111, .046); sHand = hand(.012, .33, 0xd01818, .05); }
  // bathroom door at the far end + WC sign
  { bx(GH, 0, 1.25, -25.95, 1.5, 2.5, .08, 0x5a4a3c); bx(GH, 0, 1.25, -25.9, 1.2, 2.3, .08, 0x9b7a52); const knob = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8), mat(0xd9c27a, { metalness: .7, roughness: .3 })); knob.position.set(.45, 1.15, -25.82); GH.add(knob);
    const t = cvs(512, 256, (g, w, h) => { rr(g, 6, 6, w - 12, h - 12, 24, '#1b6fd0', '#fff', 8); txt(g, 'WC', 150, 138, 130, '#fff'); g.fillStyle = '#fff'; for (const [cx, k] of [[330, 0], [420, 1]]) { g.beginPath(); g.arc(cx, 82, 17, 0, 7); g.fill(); if (k) { g.beginPath(); g.moveTo(cx, 100); g.lineTo(cx + 30, 190); g.lineTo(cx - 30, 190); g.fill(); } else { g.fillRect(cx - 15, 100, 30, 56); g.fillRect(cx - 12, 156, 10, 38); g.fillRect(cx + 2, 156, 10, 38); } } });
    const s = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .7), new THREE.MeshBasicMaterial({ map: t.t, toneMapped: false })); s.position.set(0, 2.85, -25.85); GH.add(s); }
  // blade sign hanging off the right wall (readable from the camera end)
  const bladeSign = new THREE.Group(); { const t = cvs(512, 256, (g, w, h) => { rr(g, 6, 6, w - 12, h - 12, 28, '#1b6fd0', '#fff', 10); txt(g, 'WC', 170, 118, 150, '#fff', { stroke: '#0d3d80', sw: 16 }); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(330, 118); g.lineTo(400, 60); g.lineTo(400, 98); g.lineTo(478, 98); g.lineTo(478, 138); g.lineTo(400, 138); g.lineTo(400, 176); g.fill(); txt(g, '30 FT', 256, 214, 44, '#cfe6ff'); });
    const s = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .8), new THREE.MeshBasicMaterial({ map: t.t, toneMapped: false, side: THREE.DoubleSide })); s.position.set(0, 0, 0); bladeSign.add(s); const rod = new THREE.Mesh(new THREE.BoxGeometry(.05, .05, 1), mat(0x222)); rod.position.set(.85, .52, 0); bladeSign.add(rod); bladeSign.position.set(1.0, 2.35, -7.5); GH.add(bladeSign); }

  // ================================================================== PROPS
  const PW = .58, PH = 1.1, PD = .07;
  const mkPhone = () => { const g = new THREE.Group(); const body = new THREE.Mesh(new RoundedBoxGeometry(PW, PH, PD, 3, .05), mat(0x1a1c22, { roughness: .3, metalness: .5 })); body.castShadow = true; g.add(body);
    const sc = cvs(290, 550); const scr = new THREE.Mesh(new THREE.PlaneGeometry(PW - .05, PH - .07), new THREE.MeshBasicMaterial({ map: sc.t, toneMapped: false })); scr.position.z = PD / 2 + .002; g.add(scr);
    const port = new THREE.Mesh(new THREE.BoxGeometry(.1, .03, .03), mat(0x333)); port.position.set(0, -PH / 2, 0); g.add(port); g.userData = { sc, sig: '' }; S.add(g); g.visible = false; return g; };
  const drawPhone = (ph, mode, pct, o = {}) => { const sig = mode + '|' + pct + '|' + (o.chg ? 1 : 0) + '|' + (o.fl ? 1 : 0); if (ph.userData.sig === sig) return; ph.userData.sig = sig; const { g, t } = ph.userData.sc; const w = 290, h = 550;
    if (mode === 'bat') { g.fillStyle = o.fl ? '#2a0c0c' : '#0e1014'; g.fillRect(0, 0, w, h); txt(g, '9:41', 145, 34, 30, '#9aa0aa', { w: 700 }); const low = pct <= 20; const col = low ? '#ff3b30' : '#35d36b';
      rr(g, 35, 110, 205, 105, 24, null, '#e8e8ec', 9); rr(g, 240, 144, 16, 38, 6, '#e8e8ec'); const fw = Math.max(8, (205 - 22) * pct / 100); rr(g, 46, 121, fw, 83, 14, col);
      txt(g, pct + '%', 145, 330, pct >= 100 ? 108 : 138, col, { w: 900 }); txt(g, low ? 'LOW BATTERY' : (pct >= 100 ? 'FULLY CHARGED' : 'CHARGING'), 145, 420, 32, low ? '#ff8a80' : '#9bf0b8', { w: 800 });
      if (o.chg) { g.fillStyle = '#ffd92a'; g.beginPath(); g.moveTo(166, 126); g.lineTo(112, 172); g.lineTo(142, 172); g.lineTo(122, 208); g.lineTo(180, 158); g.lineTo(148, 158); g.closePath(); g.fill(); txt(g, 'charging...', 145, 480, 28, '#ffd92a', { w: 700 }); } else if (low) txt(g, '10% remaining', 145, 480, 26, '#777', { w: 600 }); }
    else { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#1d2f55'); gr.addColorStop(1, '#4a2166'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.beginPath(); g.arc(145, 46, 10, 0, 7); g.fill(); g.fillRect(135, 46, 20, 18); txt(g, '3:47', 145, 140, 120, '#fff', { w: 300 }); txt(g, 'Tuesday, November 9', 145, 208, 26, '#d8d8f0', { w: 600 }); rr(g, 18, 270, 254, 150, 26, 'rgba(255,255,255,.18)', 'rgba(255,255,255,.4)', 3); txt(g, 'NO NEW', 145, 322, 52, '#fff'); txt(g, 'MESSAGES', 145, 380, 46, '#fff'); for (const cx of [48, 242]) { g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.arc(cx, 490, 26, 0, 7); g.fill(); } txt(g, '100%', 145, 510, 24, '#bfe9c8', { w: 800 }); }
    t.needsUpdate = true; };
  const phone = mkPhone();
  const mkBank = (w, h, d, big = false) => { const g = new THREE.Group(); const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, big ? .07 : .05), mat(big ? 0xd8542a : 0xc6ccd6, { roughness: .35, metalness: big ? .3 : .75 })); body.castShadow = true; body.receiveShadow = true; body.position.y = h / 2; g.add(body);
    const cw = big ? 520 : 250, ch = big ? 340 : 400; const sc = cvs(cw, ch); const face = new THREE.Mesh(new THREE.PlaneGeometry(w - .05, h - .05), new THREE.MeshBasicMaterial({ map: sc.t, toneMapped: false })); face.position.set(0, h / 2, d / 2 + .003); g.add(face); g.userData = { sc, sig: '', w, h, d, big }; S.add(g); g.visible = false; return g; };
  const drawBank = (b, text, color, sub = '') => { const sig = text + color + sub; if (b.userData.sig === sig) return; b.userData.sig = sig; const { g, t } = b.userData.sc; const big = b.userData.big; const w = g.canvas.width, h = g.canvas.height;
    if (!big) { const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#aeb4be'); gr.addColorStop(.5, '#e4e8ee'); gr.addColorStop(1, '#a9afb9'); g.fillStyle = gr; g.fillRect(0, 0, w, h); rr(g, 22, 28, w - 44, 150, 14, '#06080a', '#444', 4); txt(g, text, w / 2, 104, text.length > 4 ? 62 : 96, color, { w: 900 }); for (let i = 0; i < 4; i++) { g.fillStyle = i < (sub === 'full' ? 4 : 0) ? '#35d36b' : '#555'; g.beginPath(); g.arc(50 + i * 50, 224, 12, 0, 7); g.fill(); } txt(g, 'POWER BANK', w / 2, 290, 30, '#444', { w: 800 }); txt(g, '10000 mAh', w / 2, 330, 24, '#666', { w: 700 }); }
    else { g.fillStyle = '#d8542a'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1a1a'; g.fillRect(0, 0, w, 22); g.fillRect(0, h - 22, w, 22); for (let i = 0; i < 10; i++) { g.fillStyle = '#ffd92a'; g.fillRect(20 + i * 52, 6, 26, 10); g.fillRect(20 + i * 52, h - 16, 26, 10); } rr(g, 26, 48, 270, 150, 14, '#06080a', '#222', 5); txt(g, text, 161, 125, 92, color, { w: 900 }); txt(g, 'MEGA BANK', 395, 100, 56, '#fff', { stroke: '#7a2a10', sw: 8 }); txt(g, '99,999 mAh', 395, 160, 44, '#ffe9b0'); for (let i = 0; i < 6; i++) { g.fillStyle = '#35d36b'; rr(g, 30 + i * 46, 230, 36, 26, 5, '#35d36b'); } txt(g, 'SUITCASE EDITION', 160, 300, 30, '#1a1a1a', { w: 800 }); txt(g, '38 LB', 420, 285, 46, '#1a1a1a'); }
    t.needsUpdate = true; };
  const bankS = mkBank(.62, 1.0, .2); const bankSM = mkBank(.46, .74, .16); const bankL = mkBank(1.3, .85, .5, true);
  // mega bank extras: wheels + telescoping handle
  { for (const sx of [-.55, .55]) for (const sz of [-.15, .15]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, .08, 12), mat(0x1a1a1a)); w.rotation.z = Math.PI / 2; w.position.set(sx, .1, sz); w.castShadow = true; bankL.add(w); }
    bankL.children[0].position.y = .12 + .425; bankL.children[1].position.y = .12 + .425; bankL.children[1].children; }
  { const bl = bankL; bl.children[0].position.y = .545; bl.children[1].position.y = .545; for (const sx of [-.4, .4]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .5, 8), mat(0xb8bcc4, { metalness: .8, roughness: .3 })); r.position.set(sx, .97 + .25, -.15); r.castShadow = true; bl.add(r); } const gr = new THREE.Mesh(new THREE.BoxGeometry(1.0, .07, .09), mat(0x222)); gr.position.set(0, .97 + .5, -.15); gr.castShadow = true; bl.add(gr); }
  // mega bank sparkle ring (used for the "just bought" pop)
  const brick = new THREE.Group(); { const b = new THREE.Mesh(new RoundedBoxGeometry(.26, .34, .2, 3, .04), mat(0xf5f5f5, { roughness: .4 })); b.castShadow = true; brick.add(b); const usb = new THREE.Mesh(new THREE.BoxGeometry(.1, .03, .07), mat(0x222)); usb.position.set(0, -.17, 0); brick.add(usb); for (const dz of [-.05, .05]) { const p = new THREE.Mesh(new THREE.BoxGeometry(.015, .08, .04), mat(0xb0b0b0, { metalness: .8 })); p.position.set(-.07, 0, 0); p.position.z = dz; p.position.x = 0; p.position.y = 0; p.rotation.y = 0; brick.add(p); } brick.userData.bodyDepth = .2; brick.rotation.y = 0; S.add(brick); brick.visible = false;
    // body long axis along x? we want protruding axis = +x when plugged; body depth .2 is z, so rotate -90 on y to put z->x
  }
  const ruler = new THREE.Group(); { const L = 2.4; const t = cvs(1024, 96, (g, w, h) => { g.fillStyle = '#f2c94c'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; for (let i = 0; i <= 24; i++) { g.fillRect(8 + i * (w - 16) / 24 - 2, 0, 4, i % 6 === 0 ? 46 : (i % 2 ? 20 : 30)); } for (let i = 0; i <= 4; i++) txt(g, String(i * 6), 8 + i * 6 * (w - 16) / 24, 68, 28, '#222', { w: 800 }); });
    const r = new THREE.Mesh(new THREE.BoxGeometry(L, .03, .22), [mat(0xf2c94c), mat(0xf2c94c), new THREE.MeshStandardMaterial({ map: t.t, roughness: .5 }), mat(0xf2c94c), mat(0xf2c94c), mat(0xf2c94c)]); r.castShadow = true; ruler.add(r); S.add(ruler); ruler.visible = false; }
  const bag = new THREE.Group(); { const b = new THREE.Mesh(new RoundedBoxGeometry(.6, .66, .3, 3, .03), mat(0xe8453c, { roughness: .5 })); b.position.y = .33; b.castShadow = true; bag.add(b); const tt = cvs(256, 256, (g, w, h) => { g.fillStyle = '#e8453c'; g.fillRect(0, 0, w, h); txt(g, 'TECH', 128, 70, 62, '#fff'); txt(g, 'SHOP', 128, 130, 62, '#fff'); g.fillStyle = '#ffd92a'; g.beginPath(); g.moveTo(150, 160); g.lineTo(100, 215); g.lineTo(130, 215); g.lineTo(112, 250); g.lineTo(170, 190); g.lineTo(140, 190); g.fill(); }); const f = new THREE.Mesh(new THREE.PlaneGeometry(.58, .64), new THREE.MeshBasicMaterial({ map: tt.t, toneMapped: false })); f.position.set(0, .33, .152); bag.add(f); const h = new THREE.Mesh(new THREE.TorusGeometry(.15, .018, 6, 14, Math.PI), mat(0xffffff)); h.position.set(0, .66, 0); bag.add(h); S.add(bag); bag.visible = false; }
  // cables (tubes rebuilt per frame)
  const mkCable = (color) => { const m = new THREE.Mesh(new THREE.BufferGeometry(), mat(color, { roughness: .45 })); m.castShadow = true; m.frustumCulled = false; S.add(m); m.visible = false; return m; };
  const cabA = mkCable(0xf2f2f2), cabB = mkCable(0x1c1c1c), cabC = mkCable(0xffffff), cabD = mkCable(0x111111);
  const setCable = (m, a, b, L, floor = .03, rad = .028) => { const d = a.distanceTo(b); const sag = d >= L ? 0 : Math.sqrt(3 * Math.max(d, .15) * (L - d) / 8); const n = 26, pts = []; for (let i = 0; i <= n; i++) { const u = i / n; const p = a.clone().lerp(b, u); p.y -= 4 * sag * u * (1 - u); p.y = Math.max(p.y, floor); pts.push(p); } m.geometry.dispose(); m.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, rad, 6, false); m.visible = true; m.userData.pts = pts; return pts; };
  const pulses = []; for (let i = 0; i < 8; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffe14a, toneMapped: false })); s.visible = false; S.add(s); pulses.push(s); }
  const runPulses = (pts, i0, t, n = 4, spd = 1.4) => { for (let k = 0; k < n; k++) { const s = pulses[i0 + k]; if (!pts) { s.visible = false; continue; } const u = ((t * spd + k / n) % 1); const f = u * (pts.length - 1); const a = pts[Math.floor(f)], b = pts[Math.min(pts.length - 1, Math.ceil(f))]; s.position.copy(a).lerp(b, f - Math.floor(f)); s.visible = true; } };
  const wp = (o, x, y, z) => { o.updateWorldMatrix(true, false); return o.localToWorld(V3(x, y, z)); };
  // world labels
  const mkLabel = (text, c1, c2, w = 512) => { const l = cvs(w, 160, (g, ww) => { txt(g, text, ww / 2, 84, text.length > 9 ? 78 : 110, c1, { stroke: c2, sw: 20 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const lbClever = mkLabel('CLEVER!', '#ffe23a', '#111'), lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111'), lbFt = mkLabel('2 FT', '#ff5a4a', '#fff', 360), lbBuy = mkLabel('BIGGER!', '#ffb02e', '#111');
  const lb = (s, on, pos, k = 1, sc = 1) => { s.visible = on; if (on) { s.position.copy(pos); const a = clamp(k); s.scale.set(1.15 * a * sc, .36 * a * sc, 1); } };
  // bladder meter + urgency lines + sweat
  const bl = cvs(300, 130); const blS = new THREE.Sprite(new THREE.SpriteMaterial({ map: bl.t, transparent: true, depthWrite: false, depthTest: false })); blS.renderOrder = 9; blS.visible = false; S.add(blS); let blSig = -1;
  const drawBladder = (pct) => { if (pct === blSig) return; blSig = pct; const g = bl.g; g.clearRect(0, 0, 300, 130); rr(g, 4, 4, 292, 122, 20, 'rgba(20,20,30,.88)', '#fff', 5); txt(g, 'BLADDER', 150, 36, 36, '#ffe08a', { w: 800 }); rr(g, 22, 62, 256, 40, 10, '#333'); rr(g, 22, 62, Math.max(6, 256 * pct / 100), 40, 10, pct > 80 ? '#ff3b30' : '#ffb02e'); txt(g, pct + '%', 150, 83, 32, '#fff', { w: 900 }); bl.t.needsUpdate = true; };
  const urgT = cvs(512, 512, (g) => { g.translate(256, 256); for (let i = 0; i < 40; i++) { const a = i / 40 * 6.283 + cr(i, 4) * .1; const r0 = 120 + cr(i, 6) * 40, r1 = 240; g.fillStyle = i % 3 ? 'rgba(255,60,50,.8)' : 'rgba(255,220,60,.85)'; g.beginPath(); g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); g.lineTo(Math.cos(a + .045) * r1, Math.sin(a + .045) * r1); g.lineTo(Math.cos(a - .045) * r1, Math.sin(a - .045) * r1); g.fill(); } });
  const urg = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: urgT.t, transparent: true, depthWrite: false, opacity: .9 })); urg.visible = false; S.add(urg);
  const sweat = []; for (let i = 0; i < 5; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(.06, 8, 6), new THREE.MeshStandardMaterial({ color: 0x8fd0ff, roughness: .2 })); d.scale.y = 1.4; d.visible = false; S.add(d); sweat.push(d); }
  // ================================================================== STREET
  { const g = GS; const road = bx(g, SX, .0, 2, 70, .1, 8, 0x3d4048, { cast: false }); for (let i = 0; i < 12; i++) bx(g, SX - 30 + i * 5.4, .06, 2, 2.6, .02, .18, 0xf2cf4a, { cast: false });
    bx(g, SX, .09, -4.3, 70, .18, 4.6, 0xcfc9bc, { cast: false }); bx(g, SX, .09, -2.0, 70, .22, .25, 0xa9a396, { cast: false }); for (let i = 0; i < 24; i++) bx(g, SX - 34 + i * 3, .19, -4.3, .03, .01, 4.6, 0xb4aea0, { cast: false });
    bx(g, SX, .09, 7.2, 70, .18, 2.4, 0xcfc9bc, { cast: false });
    const cols = [0xd9c7a8, 0xc9d3dc, 0xbdb2a0, 0xe0c6b0, 0xa9bccc, 0xcfa9a0, 0xd8d0b8]; for (let i = 0; i < 9; i++) { const w = 9 + cr(i, 1) * 4; building(S, SX - 40 + i * 10.2, -12.5, w, 9 + cr(i, 2) * 14, 8, cols[i % cols.length], 40 + i * 7); g.add(S.children[S.children.length - 1]); }
    for (const x of [-12, 4, 16]) { tree(S, SX + x, -6.7, 1.1, 5 + x); g.add(S.children[S.children.length - 1]); }
    for (const x of [-14, 12]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, 3.6, 8), mat(0x2c3036)); p.position.set(SX + x, 1.8, -2.4); p.castShadow = true; g.add(p); const hd = new THREE.Mesh(new THREE.BoxGeometry(.7, .12, .25), mat(0x2c3036)); hd.position.set(SX + x + .3, 3.6, -2.4); g.add(hd); }
    const hy = new THREE.Group(); { const b = new THREE.Mesh(new THREE.CylinderGeometry(.16, .18, .55, 10), mat(0xd62b2b)); b.position.y = .28 + .18; hy.add(b); const c = new THREE.Mesh(new THREE.SphereGeometry(.17, 10, 6, 0, 7, 0, 1.6), mat(0xd62b2b)); c.position.y = .78; hy.add(c); hy.position.set(SX + 9, 0, -2.9); hy.traverse((m) => { m.castShadow = true; }); g.add(hy); }
    // bench + store sign "BATTERY WORLD"
    bx(g, SX - 7.5, .5, -3.1, 1.8, .1, .5, 0x8b5a2b); bx(g, SX - 7.5, .85, -3.35, 1.8, .45, .08, 0x8b5a2b); for (const dx of [-.8, .8]) bx(g, SX - 7.5 + dx, .25, -3.1, .08, .5, .45, 0x333);
    const sg = cvs(512, 160, (gg, w, h) => { rr(gg, 6, 6, w - 12, h - 12, 18, '#ffd92a', '#111', 8); txt(gg, 'BATTERY WORLD', w / 2, 84, 62, '#111'); }); const s = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.06), new THREE.MeshBasicMaterial({ map: sg.t, toneMapped: false })); s.position.set(SX - 12.5, 3.0, -8.45); g.add(s);
    const cr1 = car(S, SX + 14, 3.6, Math.PI / 2, 0x3e7fd9); g.add(cr1); }
  GS.visible = false; GH.visible = true;

  // ================================================================== PEOPLE
  const crowd = new Crowd(S, 1, 91); const P = crowd.p; const YOU = P[0];
  const col = (i, ks, c) => { ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c))); };
  col(0, ['torso', 'armL', 'armR'], 0x3a78d8); col(0, ['legL', 'legR'], 0x2b3347); col(0, ['hair'], 0x4a2f1c);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; };
  const hp = (key) => V3().setFromMatrixPosition(YOU.M[key]);
  // ------------------------------------------------------------------ camera
  const E = V3(0, 0, 0), T2 = V3(0, 0, 0);
  const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .015 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .012 + Math.cos(t * 57) * shake; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .008); };
  const dk = (x, y, z) => [x, y, z];
  const NOTE = ['PHONE 1%  ·  PLUGGING IN', 'CABLE: 2 FT  ·  PHONE: 1%', 'BLADDER: 100%  ·  PHONE: 1%', 'POWER BANK: 1%  ·  PHONE: 1%', 'SUITCASE: 38 LB  ·  PHONE: 1%', 'PHONE 100%  ·  TEXTS: 0'];
  const HRS = [0, .1, .9, 2.6, 6.4, 11.5, 17.0]; // value at start of each beat, last = end
  const SIT = .1;
  let prevBi = -1;

  return { frame({ t, bi, lt, p, beat }) {
    bi = Math.min(bi, 5); const D = beat ? beat.dur : tl.beats[bi].dur;
    // reset
    for (const o of [phone, bankS, bankSM, bankL, brick, ruler, bag, cabA, cabB, cabC, cabD, blS, urg, ...sweat, ...pulses, lbClever, lbBetter, lbFt, lbBuy]) o.visible = false;
    GH.visible = bi <= 3; GS.visible = bi >= 4;
    let faceShock = false; let shake = 0; let an = {};
    const SPC = { x: 0, y: 0, z: 0 };
    place(YOU, 0, 0, 3, 0, 'idle', .4); YOU.pitch = .06; YOU.arms = { lx: -.12, lz: -.12, rx: -.12, rz: .12 };
    let phoneAt = null, phonePct = 1, phoneMode = 'bat', phoneChg = false, phoneFl = false, phoneYaw = 0, phoneRot = [0, 0, 0];
    let pHand = null; // [handKey, offset(x,y,z)] resolved after crowd.update
    let post = () => { };
    const OUTLET_BRICK = V3(OUT.x + .12, OUT.y, OUT.z);
    const setBrick = (pos) => { brick.visible = true; brick.rotation.set(0, -Math.PI / 2 * -1, 0); brick.rotation.y = Math.PI / 2 * 1; brick.position.copy(pos); };
    // brick body local: depth axis is z; rotate +90 so z -> +x (protrudes from left wall)

    if (bi === 0) {
      // 0-1.45 hero close-up of the giant phone in your hand, 1.45-2.4 walk to the outlet, 2.4-3.0 plug in, then it charges
      const walkA = 1.45, walkB = 2.35;
      if (lt < walkA) { place(YOU, 0.05, 0, 2.3, 0, 'idle', .4); YOU.pitch = .06; YOU.arms = { lx: -.1, lz: -.12, rx: -1.15, rz: .14 }; }
      else { const u = clamp((lt - walkA) / (walkB - walkA)); const sx = lerp(-.1, -1.0, smooth(u)), sz = lerp(1.6, -.4, smooth(u)); const turn = clamp((lt - walkB) / .25); const heading = Math.atan2(-.9, -2.0); const yaw = u < 1 ? heading : lerp(heading, -Math.PI / 2, smooth(turn));
        if (u < 1) { place(YOU, sx, 0, sz, yaw, 'walk', .75); YOU.arms = { lx: -.35, lz: -.1, rx: -1.2, rz: .12 }; } else { place(YOU, -1.0, 0, -.4, yaw, 'idle', .4); const pl = smooth(clamp((lt - 2.45) / .35)); const back = smooth(clamp((lt - 3.0) / .35)); YOU.pitch = .06 + .38 * pl * (1 - back); YOU.arms = { lx: -.9, lz: -.1, rx: lerp(-1.05, -1.75, pl * (1 - back)), rz: .1 }; } }
      phoneChg = lt > 2.9; phonePct = 1; phoneFl = lt < 2.4 && Math.sin(lt * 9) > 0;
      faceShock = lt < 1.3;
      post = () => {
        const hL = hp('handL'), hR = hp('handR');
        if (lt < walkA) { const hh = hR; phoneAt = V3(hh.x + .02, hh.y + .22, hh.z + .22); phoneYaw = 0; phoneRot = [-.05, 0, 0]; phone.position.copy(phoneAt); }
        else { phoneAt = V3(hL.x, hL.y + .18, hL.z + .02); phoneYaw = YOU.yaw; phoneRot = [-.2, YOU.yaw + 3.14 - 0.7, 0]; phone.position.copy(phoneAt); }
        // brick: in right hand, then slides into the outlet
        const ins = smooth(clamp((lt - 2.75) / .22)); const bp = lt < 2.75 ? V3(hR.x, hR.y + .05, hR.z + .06) : V3(lerp(hR.x, OUTLET_BRICK.x, ins), lerp(hR.y + .05, OUTLET_BRICK.y, ins), lerp(hR.z + .06, OUTLET_BRICK.z, ins)); if (lt < walkA - .2) bp.set(OUTLET_BRICK.x + 1.2, 1.0, 1.4); setBrick(bp);
        if (lt >= walkA - .2) { setCable(cabA, wp(phone, 0, -PH / 2, 0), wp(brick, 0, -.17, 0), 2.4); if (lt > 2.95) runPulses(cabA.userData.pts, 0, t, 4, 1.1); }
        // spark
        lb(lbClever, false, V3(0, 0, 0)); if (lt > 2.88 && lt < 3.1) { pulses.forEach((s, i) => { if (i >= 4) { const a = i * 1.2; s.visible = true; s.position.set(OUTLET_BRICK.x + .1, OUT.y + Math.sin(a) * .18 * (lt - 2.88) * 5, OUT.z + Math.cos(a) * .18 * (lt - 2.88) * 5); } }); }
      };
      an.cam = [[0, dk(0.1, 1.45, 5.3), dk(0.1, 1.4, 4.7), (a) => [phone.position.x, phone.position.y, phone.position.z], (a) => [phone.position.x, phone.position.y, phone.position.z], 38, 36], [walkA - .05, dk(1.5, 1.5, 3.9), dk(1.0, 1.4, 3.4), dk(-.7, 1.0, 1.1), dk(-1.0, 1.0, .2), 52, 48], [2.25, dk(-.95, 1.2, 3.6), dk(-1.0, 1.15, 3.3), dk(-1.15, .95, -.3), dk(-1.15, .95, -.3), 44, 42]];
    } else if (bi === 1) {
      // Clever! -> walk off with the phone until the 2 ft cable goes taut -> phone yanked out of hand -> measure with a ruler
      const turn = smooth(clamp(lt / .35)); const taut = 1.55;
      if (lt < taut + .1) { const wu = clamp((lt - .35) / (taut - .35)); const sx = lerp(-1.0, -.05, smooth(wu * .9 + wu * .1)); place(YOU, sx, 0, -.4, lerp(-Math.PI / 2, Math.PI / 2, turn), lt < .35 ? 'idle' : 'walk', .55); YOU.arms = { lx: -.4, lz: -.1, rx: -1.15, rz: .12 }; if (lt > taut - .2) { const j = smooth(clamp((lt - (taut - .2)) / .2)); YOU.pitch = .06 - .25 * j; YOU.arms.lx = -1.15 + 1.9 * j; } }
      else if (lt < 2.2) { const k = clamp((lt - (taut + .1)) / .55); place(YOU, lerp(-.05, -1.15, k), 0, lerp(-.4, .55, smooth(clamp((lt - 1.9) / .3))), lerp(Math.PI / 2, -Math.PI / 2 + .2, smooth(clamp(k * 2))), 'sprint', 1.15); }
      else { const sq = smooth(clamp((lt - 2.2) / .35)); place(YOU, -1.15, 0, .65, Math.PI + .25, 'squat', .05); YOU.pitch = .25 * sq; YOU.arms = { lx: -.5, lz: -.15, rx: -1.35, rz: .1 }; }
      faceShock = lt > 1.7;
      const hitT = taut + .02; const land = clamp((lt - (taut + .06)) / .38);
      post = () => {
        const hL = hp('handL'); const brickP = OUTLET_BRICK.clone(); setBrick(brickP);
        if (lt < taut + .06) { phone.position.set(hL.x, hL.y + .12, hL.z + .02); phoneRot = [-.1, YOU.yaw + 3.14 - .6, 0]; }
        else { const fy = Math.max(.07, lerp(hL.y + .12, .07, land * land) + Math.sin(clamp(land) * 3.14) * .1 * (1 - land)); const fx = lerp(hL.x, -1.88 + 2.4, smooth(land)); phone.position.set(fx, fy, lerp(hL.z, 0.08, smooth(land))); phoneRot = [-Math.PI / 2 + .05, lerp(YOU.yaw, 0, .8), lerp(0, .2, land)]; }
        phoneAt = phone.position; phoneChg = true; phonePct = 1;
        setCable(cabA, wp(phone, 0, -PH / 2, 0), wp(brick, 0, -.17, 0), 2.4, .03);
        if (lt >= 2.2) { ruler.visible = true; ruler.position.set(-1.88 + 1.2, .035, .3); ruler.rotation.set(0, 0, 0); lb(lbFt, lt > 2.55, V3(-.7, .85, .3), Math.min(1.1, (lt - 2.55) * 5), 1.35); }
        lb(lbClever, lt > .12 && lt < 1.0, V3(YOU.x + .1, 2.4, YOU.z + .3), Math.min(1.1, (lt - .12) * 6), 1.15);
        if (lt >= taut && lt < taut + .35) shake = .018;
      };
      an.cam = [[0, dk(.7, 1.35, 3.1), dk(.95, 1.3, 3.0), (a) => [YOU.x - .3, 1.05, -.2], (a) => [YOU.x + .4, 1.05, -.2], 54, 52], [1.62, dk(-.4, 1.0, 3.0), dk(-.5, 1.0, 2.9), dk(-.6, .6, 0), dk(-.6, .6, 0), 52, 50], [2.2, dk(.5, 1.15, 2.9), dk(-.1, 1.0, 2.7), dk(-.6, .3, .3), dk(-.7, .3, .3), 56, 52]];
    } else if (bi === 2) {
      // stand next to the outlet; start hopping; WC sign far down the hall
      const k = clamp((lt - 1.4) / 1.8); const hop = smooth(k); const calm = lt < 1.4;
      place(YOU, -1.2, 0, -.2, .55, calm ? 'idle' : 'run', calm ? .4 : lerp(.55, 1.5, hop)); YOU.pitch = calm ? .12 : .16 + .08 * hop; YOU.arms = calm ? { lx: -.3, lz: -.1, rx: -1.1, rz: .12 } : { lx: -.5, lz: -.4, rx: -.5, rz: .4 };
      if (!calm) YOU.y = Math.abs(Math.sin(t * 7.5 * (.8 + hop))) * .1 * (.4 + hop);
      faceShock = lt > 1.6;
      post = () => {
        const hL = hp('handL'), hR = hp('handR'); setBrick(OUTLET_BRICK);
        if (calm) { phone.position.set(hR.x + .05, hR.y + .18, hR.z + .05); phoneRot = [-.35, YOU.yaw - .3, 0]; } else { phone.position.set(hR.x - .02, hR.y + .1, hR.z + .12); phoneRot = [-.2, YOU.yaw - .5, .2]; }
        phoneAt = phone.position; phoneChg = true; setCable(cabA, wp(phone, 0, -PH / 2, 0), wp(brick, 0, -.17, 0), 2.4, .03); runPulses(cabA.userData.pts, 0, t, 3, .8);
        const bp = Math.round(lerp(38, 100, clamp((lt - .8) / 2.8))); drawBladder(bp); blS.visible = true; blS.position.set(YOU.x + .95, 2.6, YOU.z + .3); blS.scale.set(1.15 + .06 * Math.sin(t * 14) * (bp > 85 ? 1 : 0), .5, 1);
        if (lt > 1.6) { urg.visible = true; urg.position.set(YOU.x, 1.15, YOU.z - .55); urg.rotation.z = t * .8; const sc = 3.0 + .25 * Math.sin(t * 11); urg.scale.set(sc, sc, 1); urg.material.opacity = clamp((lt - 1.6) * 2) * .85; }
        sweat.forEach((d, i) => { const l = ((lt * 1.3 + i * .21) % 1); const on = lt > 2.0; d.visible = on; if (on) { const a = (i - 2) * .55; d.position.set(YOU.x + Math.sin(a) * (.35 + l * .5), 1.95 - l * .1 + Math.sin(l * 3.1) * .25, YOU.z + .22 + Math.cos(a) * .15); d.scale.set(1, 1.4, 1).multiplyScalar(1 - l * .5); } });
        sHand.rotation.z = -lt * 5.2 - t * .3; mHand.rotation.z = -lt * .9; hHand.rotation.z = -lt * .08 - 1.2;
      };
      an.cam = [[0, dk(1.6, 1.5, 3.7), dk(1.3, 1.5, 3.4), (a) => [-1.1, 1.3, -.1], (a) => [-1.1, 1.3, -.1], 52, 52], [1.4, dk(.9, 1.2, 2.8), dk(.6, 1.2, 2.6), dk(-1.2, 1.0, -.2), dk(-1.2, 1.0, -.2), 46, 44], [2.55, dk(-.55, 1.55, 3.9), dk(-.2, 1.5, 2.6), dk(.1, 1.35, -14), dk(.1, 1.45, -14), 54, 52]];
    } else if (bi === 3) {
      // buy a power bank: walk in with a bag, show it off, "Much better!", then the bank shows 1%
      const walkEnd = 1.35; const wk = clamp(lt / walkEnd); const px = lerp(.15, 0, wk), pz = lerp(-4.0, 2.2, smooth(wk));
      place(YOU, px, 0, pz, 0, lt < walkEnd ? 'walk' : 'idle', .65); YOU.pitch = .05;
      const raise = smooth(clamp((lt - 1.2) / .5)); const hold = lt > 3.1;
      YOU.arms = { lx: -.35 * (1 - raise) - 1.55 * raise, lz: -.1 - .3 * raise, rx: -1.15, rz: .12 }; if (lt < 1.0) YOU.arms.lx = -.1;
      faceShock = lt > 3.25;
      post = () => {
        const hL = hp('handL'), hR = hp('handR'); setBrick(OUTLET_BRICK); brick.visible = false;
        // phone in right hand
        phone.position.set(hR.x + .05, hR.y + .2, hR.z + .2); phoneRot = [-.1, 0, 0]; phoneAt = phone.position; phonePct = 1;
        // bag on the floor next to you once the bank is out, else carried by left hand
        bag.visible = true; if (lt < 1.2) { bag.position.set(hL.x - .05, hL.y - .62, hL.z + .02); bag.rotation.set(0, -.3, 0); } else { bag.position.set(px - .9, 0, pz + .1); bag.rotation.set(0, .5, 0); }
        // bank
        bankS.visible = lt >= 1.2; const bk = V3(hL.x, hL.y + .35, hL.z + .12); if (lt < 1.2) bankS.visible = false; bankS.scale.setScalar(.65); bankS.position.set(bk.x - .1, hL.y - .15, bk.z + .1); bankS.rotation.set(-.05, 0, 0);
        if (lt < 3.22) drawBank(bankS, lt < 1.9 ? '...' : 'READY!', '#35d36b'); else drawBank(bankS, '1%', Math.sin(lt * 12) > -.3 ? '#ff3b30' : '#661510');
        if (lt >= 1.9) setCable(cabB, wp(phone, 0, -PH / 2, 0), wp(bankS, 0, .03, 0), 1.9, .03); if (lt >= 1.9) runPulses(cabB.userData.pts, 0, t, 4, 1.2);
        lb(lbBetter, lt > 1.94 && lt < 3.1, V3(px - .1, 2.5, pz), Math.min(1.1, (lt - 1.94) * 5), 1.3);
        if (lt >= 3.22) { lb(lbBuy, false, V3(0, 0, 0)); }
        an.bank = bankS.position;
      };
      an.cam = [[0, dk(.4, 1.3, 6.2), dk(.2, 1.35, 5.0), (a) => [YOU.x, 1.05, YOU.z], (a) => [YOU.x, 1.05, YOU.z], 50, 46], [1.4, dk(1.35, 1.6, 4.5), dk(.95, 1.6, 4.1), (a) => [YOU.x - .5, 1.3, YOU.z], (a) => [YOU.x - .5, 1.35, YOU.z], 42, 40], [3.1, (a) => [bankS.position.x + .15, bankS.position.y + .33, bankS.position.z + 1.45], (a) => [bankS.position.x + .05, bankS.position.y + .33, bankS.position.z + 1.0], (a) => [bankS.position.x, bankS.position.y + .33, bankS.position.z], (a) => [bankS.position.x, bankS.position.y + .33, bankS.position.z], 34, 28], [4.5, dk(1.6, 1.5, 5.3), dk(1.1, 1.5, 5.0), (a) => [YOU.x - .3, 1.15, YOU.z], (a) => [YOU.x - .3, 1.15, YOU.z], 46, 44]];
    } else if (bi === 4) {
      // bigger power bank to charge the power bank -> suitcase. Walk along the sidewalk, camera ahead of you.
      const TH = 1.3; const v = 1.5; const t0 = lt; const X0 = SX - 3.5, Z0 = -6.0; const dir = V3(Math.sin(TH), 0, Math.cos(TH));
      const pos = V3(X0, 0, Z0).addScaledVector(dir, v * Math.max(0, lt - .15) * (lt > .15 ? 1 : 0));
      place(YOU, pos.x, 0, pos.z, TH, lt < .15 ? 'idle' : 'walk', v / 2.4 * 1.15); YOU.pitch = .22 + .05 * Math.sin(t * 6); YOU.arms = { lx: .55, lz: -.65, rx: -1.35, rz: .12 };
      faceShock = lt > 3.7;
      shake = lt > 3.8 ? .006 : 0;
      post = () => {
        const hL = hp('handL'), hR = hp('handR'); const a = .62, H = .97; const u = V3(Math.sin(a) * dir.x, Math.cos(a), Math.sin(a) * dir.z);
        const base = hL.clone().addScaledVector(u, -H); base.y = Math.max(0, base.y);
        bankL.visible = true; bankL.rotation.order = 'YXZ'; bankL.rotation.set(a, TH, 0); bankL.position.copy(base);
        const pop = lt < .75 ? smooth(clamp((lt - .1) / .5)) * 1.0 + .1 * Math.sin(clamp((lt - .1) / .5) * 3.14) : 1; bankL.scale.setScalar(Math.max(.01, pop));
        // small bank taped on the front face (right half)
        bankSM.visible = true; bankSM.rotation.order = 'YXZ'; bankSM.rotation.set(a, TH, 0); bankSM.scale.setScalar(Math.max(.01, pop)); bankSM.position.copy(bankL.localToWorld(V3(.37, .125 + .06, .27)).sub(V3(0, 0, 0)));
        bankSM.position.copy(wp(bankL, .37, .13, .252));
        const ramp = clamp((lt - 1.9) / 1.4); const pc = Math.round(lerp(1, 99, ramp)); drawBank(bankSM, pc + '%', pc < 20 ? '#ff3b30' : '#35d36b', pc >= 99 ? 'full' : ''); drawBank(bankL, '100%', '#35d36b');
        phone.position.set(hR.x + .02, hR.y + .15, hR.z + .25); phoneRot = [-.1, TH + 3.14 - .8 + 3.14, 0]; phoneRot = [-.15, TH - .4 + 3.14 - 3.14, 0]; phoneAt = phone.position; phonePct = 1; phoneChg = lt > 1.0;
        setCable(cabC, wp(bankL, .06, .26, .27), wp(bankSM, 0, -.37, 0), 1.0, .03); runPulses(cabC.userData.pts, 0, t, 3, 1.4);
        setCable(cabD, wp(phone, 0, -PH / 2, 0), wp(bankSM, 0, -.37, 0), 2.5, .03); runPulses(cabD.userData.pts, 3, t, 3, .9);
        lb(lbBuy, lt > .3 && lt < 1.1, V3(base.x, 1.9, base.z + .2), Math.min(1.1, (lt - .3) * 5), 1.2);
        an.bank = bankL.position; an.pp = pos; an.dir = dir; an.sm = bankSM.position;
        // sweat when it gets heavy
        sweat.forEach((d, i) => { const l = ((lt * 1.2 + i * .23) % 1); const on = lt > 3.5; d.visible = on; if (on) { d.position.set(YOU.x + (i - 2) * .12 + .1, 2.0 - l * .3, YOU.z + (i % 2 ? .22 : -.22)); d.scale.set(1, 1.4, 1).multiplyScalar(1 - l * .5); } });
      };
      const cf = (dx, dy, dz) => (a) => { const d = a.dir || V3(.96, 0, .27); return [a.pp.x + d.x * dx + -d.z * dz, dy, a.pp.z + d.z * dx + d.x * dz]; };
      const ct = (dx, dy, dz) => (a) => { const d = a.dir || V3(.96, 0, .27); return [a.pp.x + d.x * dx + -d.z * dz, dy, a.pp.z + d.z * dx + d.x * dz]; };
      an.cam = [[0, cf(.9, .7, 3.6), cf(.6, .85, 3.2), ct(-.9, .55, 0), ct(-.9, .5, 0), 52, 48], [1.55, cf(2.6, .8, 1.5), cf(2.4, .85, 1.1), (a) => [a.sm.x, a.sm.y, a.sm.z], (a) => [a.sm.x, a.sm.y, a.sm.z], 42, 34], [3.35, cf(3.3, 1.2, 1.4), cf(5.2, 1.7, 1.8), ct(-.6, 1.0, 0), ct(-.5, 1.0, 0), 56, 62], [5.5, cf(5.2, 1.7, 1.8), cf(5.2, 1.7, 1.8), ct(-.5, 1.0, 0), ct(-.5, 1.0, 0), 62, 62]];
    } else {
      // phone 100% -> lock screen NO NEW MESSAGES -> slump on the suitcase, tumbleweed
      const bx0 = SX + 2.4, bz0 = -4.1;
      place(YOU, bx0, SIT, bz0, 0, 'sit', .3); YOU.pitch = lt > 3.3 ? .38 : .1; YOU.arms = { lx: -.5, lz: -.14, rx: -1.35, rz: .12 };
      if (lt > 3.3) YOU.arms = { lx: -.2, lz: -.14, rx: -.6, rz: .12 };
      faceShock = false;
      phoneMode = lt > 1.55 ? 'lock' : 'bat'; const ru = clamp((lt - .05) / .95); phonePct = Math.max(1, Math.round(lerp(1, 100, ru * ru * (3 - 2 * ru)))); phoneChg = phonePct < 100;
      post = () => {
        const hR = hp('handR'); bankL.visible = true; bankL.scale.setScalar(1); bankL.rotation.order = 'YXZ'; bankL.rotation.set(0, 0, 0); bankL.position.set(bx0, 0, bz0); drawBank(bankL, '100%', '#35d36b');
        bankSM.visible = true; bankSM.rotation.set(0, 0, 0); bankSM.scale.setScalar(1); bankSM.position.copy(wp(bankL, .37, .13, .252)); drawBank(bankSM, '100%', '#35d36b', 'full');
        const slump = smooth(clamp((lt - 3.2) / .5)); if (lt <= 3.2) phone.position.set(hR.x - .02, hR.y + .1, hR.z + .3); else phone.position.set(hR.x - .02, hR.y + .08 - .1 * slump, hR.z + .25 - .1 * slump); phoneRot = [-.12 + .5 * slump, 0, 0]; phoneAt = phone.position;
        setCable(cabD, wp(phone, 0, -PH / 2, 0), wp(bankSM, 0, -.37, 0), 2.5, .03); if (lt < 1.2) runPulses(cabD.userData.pts, 0, t, 4, 1.5);
        setCable(cabC, wp(bankL, .06, .26, .27), wp(bankSM, 0, -.37, 0), 1.0, .03);
        // tumbleweed
        const tw = pulses[7]; tw.visible = false;
        an.sm = bankSM.position;
      };
      const pt = (a) => [phone.position.x, phone.position.y, phone.position.z]; an.cam = [[0, dk(bx0 + .2, 1.7, bz0 + 4.3), dk(bx0 + .12, 1.68, bz0 + 3.7), pt, pt, 38, 36], [.95, dk(bx0 + .12, 1.68, bz0 + 3.7), dk(bx0 + .05, 1.66, bz0 + 3.3), pt, pt, 36, 34], [2.8, dk(bx0 + .05, 1.66, bz0 + 3.3), dk(bx0 + 1.2, 1.4, bz0 + 6.8), pt, dk(bx0 + .3, 1.0, bz0), 34, 50], [4.1, dk(bx0 + 1.2, 1.4, bz0 + 6.8), dk(bx0 + 1.2, 1.4, bz0 + 6.8), dk(bx0 + .3, 1.0, bz0), dk(bx0 + .3, 1.0, bz0), 50, 50]];
    }
    // ---- shared per-frame updates
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t);
    post();
    if (bi === 5) { // tumbleweed (mesh created lazily)
      if (!build.tw) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(.4, 1), new THREE.MeshStandardMaterial({ color: 0x9a7440, flatShading: true, roughness: 1 })); m.castShadow = true; const cage = new THREE.Mesh(new THREE.IcosahedronGeometry(.46, 1), new THREE.MeshBasicMaterial({ color: 0x6b4a22, wireframe: true })); m.add(cage); S.add(m); build.tw = m; } const tw = build.tw; tw.visible = lt > 1.3; const u = clamp((lt - 1.3) / 2.8); tw.position.set(SX + 8 - u * 11, .42 + Math.abs(Math.sin(t * 5)) * .18, -2.7); tw.rotation.z = u * 22; tw.rotation.x = u * 6; } else if (build.tw) build.tw.visible = false;
    // phone state + transform
    const big = (bi === 0 && lt < 1.45) || (bi === 5); phone.scale.setScalar(big ? 1 : .55);
    if (phoneAt) { phone.visible = true; drawPhone(phone, phoneMode, phonePct, { chg: phoneChg, fl: phoneFl }); phone.rotation.set(phoneRot[0], phoneRot[1], phoneRot[2], 'YXZ'); }
    // camera
    const shots = an.cam; rig(lt, shots, an, t, shake);
    A.follow(bi >= 4 ? SX + 1 : 0, bi >= 4 ? -3 : 0); A.render();
    // ---- HUD
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    const hv = lerp(HRS[bi], HRS[bi + 1], smooth(clamp(lt / D)));
    hud.counter('HOURS SPENT CHARGING', hv.toFixed(1), NOTE[bi], '', bi >= 1);
    hud.tm(''); hud.pop('', 0);
  } };
}
