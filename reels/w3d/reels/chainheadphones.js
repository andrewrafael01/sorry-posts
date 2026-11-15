// 682 invention chain: headphones tangle -> neat wrap -> pocket re-tangle -> wireless, lose one -> buy more, all in couch -> COUCH INC. -> the cloud.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, ground, Crowd, clamp, smooth, lerp, attach, RoundedBoxGeometry } = lib;
  const A = makeStage({ fog: 0xdfe9f4, fogNear: 40, fogFar: 140, clouds: true, skyTop: 0x4a90e0, skyMid: 0xa8d0f2, skyBot: 0xeaf2fb, shadowExtent: 11, shadowRes: 2048, hemi: 1.5, sunI: 1.9, sunDir: [-.4, .9, .6], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const SX = [0, 40, 80, 120, 160, 200]; // set origins (one cutaway set per beat)
  const white = mat(0xf6f6f8, { roughness: .25 });

  // ------------------------------------------------------------------ sets
  const sets = SX.map(() => new THREE.Group()); sets.forEach((g, i) => { g.position.x = SX[i]; S.add(g); });
  const room = (i, floorC, wallC, w = 16) => { const g = sets[i]; const f = new THREE.Mesh(new THREE.BoxGeometry(w, .3, 14), mat(floorC, { roughness: .7 })); f.position.set(0, -.15, 0); f.receiveShadow = true; g.add(f); const b = new THREE.Mesh(new THREE.BoxGeometry(w, 9, .3), mat(wallC)); b.position.set(0, 4.5, -5); b.receiveShadow = true; g.add(b); return g; };
  room(0, 0xb98a5a, 0xf2e4c8); room(1, 0x4a5568, 0x6b7a90); room(2, 0xc9a06a, 0xcfe0ea); room(3, 0xa9774a, 0xeadfc6); room(4, 0x6b7280, 0xdfe6f0, 22);
  { const g = sets[5]; const h = new THREE.Mesh(new THREE.CylinderGeometry(14, 16, .6, 40), mat(0x6fb04e)); h.position.y = -.3; h.receiveShadow = true; g.add(h); }
  // baseboard + frame on set 0 wall
  addBox(sets[0], 0, .35, -4.8, 16, .7, .1, 0xe8d6b0, { cast: false }); addBox(sets[3], 0, .35, -4.8, 16, .7, .1, 0xd8c8a4, { cast: false });
  const label = (text, c1, c2, sw = 512, sh = 160, fs) => { const l = cvs(sw, sh, (g, w, h) => { txt(g, text, w / 2, h / 2 + 4, fs || (text.length > 10 ? 76 : 100), c1, { stroke: c2, sw: 20 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const popLabel = (s, on, pos, k, w = 1.5, h = .47) => { s.visible = on; if (on) { s.position.copy(pos); const a = clamp(k); s.scale.set(w * a, h * a, 1); } };

  // ------------------------------------------------------------------ cable (instanced beads) that morphs between a neat wrap and a knot
  const mkCable = (n, r = .028, color = 0xf4f4f6) => { const im = new THREE.InstancedMesh(new THREE.SphereGeometry(r, 8, 6), mat(color, { roughness: .35 }), n); im.castShadow = true; im.frustumCulled = false; S.add(im); const d = new THREE.Object3D(); const pts = []; for (let i = 0; i < n; i++) pts.push(new THREE.Vector3()); return { im, n, d, pts, set(fn) { for (let i = 0; i < n; i++) { fn(i, pts[i]); d.position.copy(pts[i]); d.scale.setScalar(1); d.updateMatrix(); im.setMatrixAt(i, d.matrix); } im.instanceMatrix.needsUpdate = true; } }; };
  const knotP = (i, n, c, R, t, seed = 0, wig = .02) => { const u = i / n * Math.PI * 2 * 3; return V3(c.x + R * (Math.sin(u * 1.0 + seed) + .5 * Math.sin(u * 2.3 + 1 + seed)) * .8 + wig * Math.sin(t * 9 + i * .4), c.y + R * (Math.cos(u * 1.3 + 2 + seed) + .5 * Math.sin(u * 1.9 + seed)) * .8 + wig * Math.cos(t * 8 + i * .3), c.z + R * (Math.sin(u * 0.7 + 4 + seed) + .6 * Math.cos(u * 2.9 + seed)) * .8 + wig * Math.sin(t * 7 + i * .5)); };
  const bud = () => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(.09, 14, 10), white); const st = new THREE.Mesh(new THREE.CylinderGeometry(.028, .024, .17, 10), white); st.position.y = -.12; const tip = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 8, 0, 6.3, 0, 1.2), mat(0xdadde2)); tip.scale.set(.5, .5, .5); tip.position.set(0, .0, .075); tip.rotation.x = Math.PI / 2 - .2; g.add(b, st); g.traverse((m) => { m.castShadow = true; }); return g; };
  // phone prop
  const mkPhone = (sx = 1) => { const g = new THREE.Group(); const body = new THREE.Mesh(new RoundedBoxGeometry(.5, .95, .07, 3, .03), mat(0x1c1f26, { roughness: .3, metalness: .4 })); const scr = new THREE.Mesh(new THREE.PlaneGeometry(.45, .88), new THREE.MeshBasicMaterial({ color: 0x4aa3ff })); scr.position.z = .037; g.add(body, scr); g.userData.scr = scr; g.traverse((m) => { m.castShadow = true; }); g.scale.setScalar(sx); g.matrixAutoUpdate = false; g.visible = false; S.add(g); return g; };

  // ---- beat 0: ball in hand + neat wrap around the phone
  const phone0 = mkPhone(.6); const cab0 = mkCable(260, .016);
  const wrapP = (i, n, phone, w = 1) => { const turns = 9; const u = i / n; const a = u * turns * Math.PI * 2; const y = (u - .5) * .8 * .6; return V3(Math.cos(a) * .32 * .6, y, Math.sin(a) * .1 * .6).applyMatrix4(phone.matrix); };
  // ---- beat 1: pocket
  const jeans = new THREE.Group(); jeans.position.copy(V3(0, 0, 0)); sets[1].add(jeans);
  { const dn = mat(0x2c5aa0, { roughness: .95 }); const back = new THREE.Mesh(new THREE.BoxGeometry(5.0, 6.4, .16), dn); back.position.set(0, 3.2, -.2); back.receiveShadow = true; jeans.add(back);
    const dk = mat(0x1d3d70, { roughness: .95 }); const inner = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.2, .02), dk); inner.position.set(0, 2.55, -.1); jeans.add(inner); // dark pocket hollow
    for (const [x, y, w, h] of [[-1.55, 2.55, .14, 3.2], [1.55, 2.55, .14, 3.2], [0, 4.15, 3.2, .14]]) { const e = new THREE.Mesh(new THREE.BoxGeometry(w, h, .3), mat(0x3b6fbf, { roughness: .9 })); e.position.set(x, y, .0); e.castShadow = true; jeans.add(e); const st = new THREE.Mesh(new THREE.BoxGeometry(w * .3 + (w > h ? 0 : .03), h * .3 + (h > w ? 0 : .03), .02), mat(0xf0b84a)); st.position.set(x, y, .16); jeans.add(st); }
    const bot = new THREE.Mesh(new THREE.BoxGeometry(3.2, .5, .3), mat(0x3b6fbf)); bot.position.set(0, .8, 0); jeans.add(bot); jeans.traverse((m) => { if (m.isMesh) m.receiveShadow = true; });
    // lint + coin
    const lint = new THREE.Mesh(new THREE.IcosahedronGeometry(.16, 1), mat(0xd8d2c4)); lint.position.set(-.9, 1.25, .05); jeans.add(lint); const coin = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .04, 18), mat(0xd9b04a, { metalness: .7, roughness: .3 })); coin.position.set(1.0, 1.2, .0); coin.rotation.x = 1.2; jeans.add(coin); }
  const phone1 = mkPhone(2.0); const cab1 = mkCable(260, .05);

  // ---- beat 2: earbud case on a table + magnifier
  const T2 = new THREE.Group(); sets[2].add(T2);
  { const top = new THREE.Mesh(new THREE.BoxGeometry(7, .2, 3.4), mat(0x9a6a3c)); top.position.set(0, .95, 0); top.castShadow = true; top.receiveShadow = true; T2.add(top); for (const x of [-3.1, 3.1]) for (const z of [-1.4, 1.4]) addBox(T2, x, .45, z, .24, .9, .24, 0x7a4e28); }
  const caseG = new THREE.Group(); caseG.position.set(0, 1.05, .3); T2.add(caseG);
  { const base = new THREE.Mesh(new RoundedBoxGeometry(1.7, .55, 1.1, 4, .2), white); base.position.y = .27; base.castShadow = true; caseG.add(base);
    const inn = new THREE.Mesh(new RoundedBoxGeometry(1.5, .1, .9, 3, .06), mat(0x2a2d34)); inn.position.set(0, .56, 0); caseG.add(inn);
    const lid = new THREE.Group(); lid.position.set(0, .55, -.5); const lm = new THREE.Mesh(new RoundedBoxGeometry(1.7, .3, 1.1, 4, .2), white); lm.position.set(0, .12, .5); lid.add(lm); lid.rotation.x = -1.95; lid.userData.m = lm; caseG.add(lid); caseG.userData.lid = lid;
    for (const x of [-.4, .4]) { const slot = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .04, 20), mat(0x0a0b0d)); slot.position.set(x, .62, .0); caseG.add(slot); }
    const led = new THREE.Mesh(new THREE.SphereGeometry(.05, 10, 8), new THREE.MeshBasicMaterial({ color: 0x40ff70, toneMapped: false })); led.position.set(0, .45, .56); caseG.add(led); caseG.userData.led = led;
    const b1 = bud(); b1.scale.setScalar(1.7); b1.position.set(-.4, .75, .0); caseG.add(b1); caseG.userData.b1 = b1; }
  const lbQ = label('?', '#ffe23a', '#111', 256, 256, 200);
  // magnifier
  const mag = new THREE.Group(); { const ring = new THREE.Mesh(new THREE.TorusGeometry(.52, .07, 10, 28), mat(0x222428, { metalness: .6, roughness: .3 })); ring.position.set(0, .0, 0); const lens = new THREE.Mesh(new THREE.CircleGeometry(.5, 28), new THREE.MeshStandardMaterial({ color: 0xbfe6ff, transparent: true, opacity: .3, roughness: .05 })); const hnd = new THREE.Mesh(new THREE.CylinderGeometry(.06, .08, .9, 10), mat(0x5a3a1c)); hnd.position.y = -.98; mag.add(ring, lens, hnd); mag.traverse((m) => { m.castShadow = true; }); mag.visible = false; S.add(mag); }
  // ---- couches (beat 3 & 4)
  const mkCouch = (parent, lift) => { const g = new THREE.Group(); parent.add(g); const cm = mat(0x7a3b3a, { roughness: .95 }); const rb = (w, h, d, x, y, z, m = cm) => { const b = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, .12), m); b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; g.add(b); return b; };
    rb(8, .9, 3.0, 0, .45, .3, mat(0x5e2c2b)); rb(8, 2.2, .9, 0, 1.55, -1.4); rb(.9, 1.7, 3.0, -4.0, 1.0, .3); rb(.9, 1.7, 3.0, 4.0, 1.0, .3);
    const cushions = []; for (let i = 0; i < 3; i++) { const p = new THREE.Group(); p.position.set(-2.6 + i * 2.6, .9, -.95); const c = new THREE.Mesh(new RoundedBoxGeometry(2.5, .45, 2.3, 4, .15), cm); c.position.set(0, .22, 1.15); c.castShadow = true; c.receiveShadow = true; p.add(c); g.add(p); cushions.push(p); } g.userData.cushions = cushions; return g; };
  const couch3 = mkCouch(sets[3]); const couch4 = mkCouch(sets[4]); couch4.position.z = -2.6;
  // earbud pile (instanced): bodies + stems + cases
  const NB = 420, NC = 46; const bodyIM = new THREE.InstancedMesh(new THREE.SphereGeometry(.12, 10, 8), white, NB), stemIM = new THREE.InstancedMesh(new THREE.CylinderGeometry(.034, .03, .22, 8), white, NB); const caseIM = new THREE.InstancedMesh(new RoundedBoxGeometry(.5, .3, .34, 2, .08), mat(0xffffff, { roughness: .3 }), NC);
  for (const im of [bodyIM, stemIM, caseIM]) { im.castShadow = true; im.frustumCulled = false; sets[3].add(im); }
  { const cc = [0xffffff, 0x222428, 0xf2c0d0, 0xbfd8ff, 0xe8e8ee]; for (let i = 0; i < NC; i++) caseIM.setColorAt(i, new THREE.Color(cc[i % 5])); caseIM.instanceColor.needsUpdate = true; }
  const pile = []; for (let i = 0; i < NB + NC; i++) { const tx = (cr(i, 1) - .5) * 7.0, tz = -.45 + cr(i, 2) * 1.6; const heapH = 1.0 + (1 - Math.abs(tx) / 3.6) * .0; pile.push({ x: tx, z: tz, y: .55 + cr(i, 3) * .55 + (cr(i, 5) > .8 ? .3 : 0), rx: cr(i, 4) * 6, ry: cr(i, 6) * 6, rz: cr(i, 7) * 6, d: cr(i, 8) }); }
  const _o = new THREE.Object3D(), _s = new THREE.Object3D(); const hideM = new THREE.Matrix4().makeScale(0, 0, 0);
  const setPile = (frac, lt) => { const cnt = Math.floor(frac * NB), cc = Math.floor(frac * NC); for (let i = 0; i < NB; i++) { const q = pile[i]; if (i >= cnt) { bodyIM.setMatrixAt(i, hideM); stemIM.setMatrixAt(i, hideM); continue; } const born = i / NB / Math.max(.001, frac) * 0 + (i / NB) * 0; const fall = clamp((frac * NB - i) / 14); const y = q.y + (1 - fall) * (1 - fall) * 5; _o.position.set(q.x, y, q.z); _o.rotation.set(q.rx, q.ry, q.rz); _o.scale.setScalar(1); _o.updateMatrix(); bodyIM.setMatrixAt(i, _o.matrix); _s.position.copy(_o.position); _s.rotation.copy(_o.rotation); _s.translateY(-.16); _s.updateMatrix(); stemIM.setMatrixAt(i, _s.matrix); }
    for (let i = 0; i < NC; i++) { const q = pile[NB + i]; if (i >= cc) { caseIM.setMatrixAt(i, hideM); continue; } const fall = clamp((frac * NC - i) / 4); _o.position.set(q.x * .95, q.y + .15 + (1 - fall) * (1 - fall) * 5, q.z); _o.rotation.set(q.rx, q.ry, q.rz); _o.scale.setScalar(1); _o.updateMatrix(); caseIM.setMatrixAt(i, _o.matrix); }
    bodyIM.instanceMatrix.needsUpdate = stemIM.instanceMatrix.needsUpdate = caseIM.instanceMatrix.needsUpdate = true; };
  // falling "new pair" budlets (beat 3 opening)
  const fallB = [bud(), bud(), bud(), bud()]; fallB.forEach((b) => { b.scale.setScalar(1.8); b.visible = false; S.add(b); });
  // ---- beat 4: COUCH INC.
  const signT = cvs(1024, 320, (g, w, h) => { g.fillStyle = '#12151c'; g.beginPath(); g.roundRect(6, 6, w - 12, h - 12, 36); g.fill(); g.strokeStyle = '#ffd23a'; g.lineWidth = 12; g.stroke(); txt(g, 'COUCH INC.', w / 2, 180, 150, '#ffffff', { stroke: '#000', sw: 14 }); g.fillStyle = '#ffd23a'; g.beginPath(); g.arc(100, 78, 36, 0, 7); g.fill(); g.fillStyle = '#12151c'; g.fillRect(80, 66, 40, 24); txt(g, 'EST. UNDER CUSHIONS', w / 2, 52, 40, '#ffd23a', { w: 700 }); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 2.0), new THREE.MeshStandardMaterial({ map: signT.t, roughness: .5 })); sign.position.set(0, 6.8, -4.2); sign.castShadow = false; sets[4].add(sign); for (const x of [-2.8, 2.8]) { const pole = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 3, 8), mat(0x888)); pole.position.set(x, 5.5, -4.2); sets[4].add(pole); }
  const boardT = new THREE.Mesh(new RoundedBoxGeometry(6.2, .22, 2.0, 3, .08), mat(0x5a3820, { roughness: .35 })); boardT.position.set(0, 1.35, 2.2); boardT.castShadow = true; boardT.receiveShadow = true; sets[4].add(boardT); for (const x of [-2.5, 2.5]) addBox(sets[4], x, .65, 2.2, .3, 1.3, 1.4, 0x3d2614);
  const suit = [0x1c2230, 0x262c3c, 0x2a1f2c, 0x1d2e2a, 0x30261c, 0x202030]; const dir = []; const dirG = new THREE.Group(); sets[4].add(dirG);
  const mkDir = (i, x, z, ry) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; const c = new THREE.Mesh(new RoundedBoxGeometry(1.15, 1.35, .6, 4, .22), mat([0xc86a3a, 0xd6a24a, 0x8a5aa8, 0x5a8aa8, 0x7a9a5a, 0xc05a6a][i], { roughness: .9 })); c.position.y = .78; c.castShadow = true; g.add(c);
    const j = new THREE.Mesh(new RoundedBoxGeometry(1.2, .74, .66, 3, .1), mat(suit[i], { roughness: .7 })); j.position.set(0, .5, .02); j.castShadow = true; g.add(j);
    const sh = new THREE.Mesh(new THREE.BoxGeometry(.36, .5, .02), mat(0xf4f4f4)); sh.position.set(0, .56, .345); g.add(sh); const tie = new THREE.Mesh(new THREE.BoxGeometry(.1, .46, .03), mat([0xd8242a, 0xffc82a, 0x2a8ad8, 0xd8242a, 0x38b86a, 0xe86aa8][i])); tie.position.set(0, .54, .36); g.add(tie);
    for (const sxn of [-1, 1]) { const lap = new THREE.Mesh(new THREE.BoxGeometry(.22, .5, .03), mat(suit[i] === 0x1c2230 ? 0x2b3447 : 0x394560)); lap.position.set(sxn * .24, .56, .35); lap.rotation.z = -sxn * .35; g.add(lap); const eye = new THREE.Mesh(new THREE.SphereGeometry(.1, 10, 8), mat(0xffffff, { roughness: .2 })); eye.position.set(sxn * .24, 1.2, .29); g.add(eye); const pu = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 6), mat(0x111)); pu.position.set(sxn * .24, 1.2, .37); g.add(pu); const arm = new THREE.Mesh(new RoundedBoxGeometry(.2, .55, .22, 3, .08), mat(suit[i])); arm.position.set(sxn * .66, .72, .1); arm.rotation.x = -.5; arm.castShadow = true; g.add(arm); }
    const mo = new THREE.Mesh(new THREE.BoxGeometry(.28, .05, .02), mat(0x331111)); mo.position.set(0, 1.0, .31); g.add(mo); dirG.add(g); dir.push(g); };
  [[-2.3, 3.6, Math.PI], [0, 3.6, Math.PI], [2.3, 3.6, Math.PI]].forEach((p, k) => mkDir(k, p[0], p[1] + .15, p[2])); [[-2.3, .8, 0], [0, .8, 0], [2.3, .8, 0]].forEach((p, k) => mkDir(k + 3, p[0], p[1] + .15, p[2]));
  // charts screen
  const scrT = cvs(1024, 640); const scr4 = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 3.5), new THREE.MeshBasicMaterial({ map: scrT.t })); scr4.position.set(0, 3.4, -4.7); sets[4].add(scr4); addBox(sets[4], 0, 3.4, -4.76, 6.0, 3.9, .1, 0x15171c); // frame
  const drawScr = (lt) => { const g = scrT.g, w = 1024, h = 640; g.fillStyle = '#0d1b2e'; g.fillRect(0, 0, w, h); txt(g, 'Q4: EARBUDS', 70, 56, 52, '#fff', { al: 'left' }); txt(g, 'FOUND: 0', w - 70, 56, 52, '#ff6b6b', { al: 'right' }); g.strokeStyle = 'rgba(255,255,255,.15)'; g.lineWidth = 3; for (let i = 1; i < 5; i++) { g.beginPath(); g.moveTo(60, 120 + i * 90); g.lineTo(w - 60, 120 + i * 90); g.stroke(); }
    const n = 60, g1 = clamp(lt / 3.2); g.beginPath(); g.lineWidth = 12; g.strokeStyle = '#35e07a'; g.lineJoin = 'round'; for (let i = 0; i <= n * g1; i++) { const u = i / n; const y = 560 - (u * u * 360 + u * 90 + Math.sin(u * 22) * 18 * u); i ? g.lineTo(80 + u * 860, y) : g.moveTo(80, y); } g.stroke(); g.beginPath(); g.lineWidth = 8; g.strokeStyle = '#ff5a5a'; for (let i = 0; i <= n * g1; i++) { const u = i / n; const y = 560 - (u * 40 + Math.sin(u * 12) * 10); i ? g.lineTo(80 + u * 860, y) : g.moveTo(80, y); } g.stroke(); txt(g, 'COUCH $$$', 760, 190, 54, '#35e07a', { al: 'left' }); txt(g, '+4000%', 760, 250, 60, '#fff', { al: 'left' }); scrT.t.needsUpdate = true; };

  // ---- beat 5: cloud + radar
  const cloud = new THREE.Group(); { const cm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, emissive: 0x9fb8d8, emissiveIntensity: .35 }); for (const [x, y, z, r] of [[0, 0, 0, 1.9], [-1.9, -.35, .2, 1.45], [1.9, -.3, -.1, 1.55], [-.8, .85, -.2, 1.45], [.9, .9, .1, 1.4], [3.3, -.6, 0, 1.0], [-3.2, -.65, 0, 1.0], [0, -.7, .4, 1.6]]) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 3), cm); m.position.set(x, y, z); cloud.add(m); } cloud.scale.setScalar(.55); sets[5].add(cloud); }
  const buds5 = []; for (let i = 0; i < 12; i++) { const b = bud(); b.scale.setScalar(2.2); sets[5].add(b); buds5.push(b); }
  const pings = []; for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.RingGeometry(.9, 1.0, 48), new THREE.MeshBasicMaterial({ color: 0x38d6ff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, toneMapped: false })); m.renderOrder = 5; sets[5].add(m); pings.push(m); }
  const lbFind = label('FIND MY', '#39d6ff', '#04202a', 640, 180); const lbSeen = label('LAST SEEN: CLOUD', '#ffffff', '#111', 1024, 160, 90);
  const phone5 = mkPhone(1.5); const radT = cvs(256, 512); phone5.userData.scr.material = new THREE.MeshBasicMaterial({ map: radT.t });
  const drawRad = (lt) => { const g = radT.g; g.fillStyle = '#071a24'; g.fillRect(0, 0, 256, 512); txt(g, 'Find My', 128, 40, 36, '#39d6ff'); g.strokeStyle = '#1b8fb0'; g.lineWidth = 3; for (const r of [40, 80, 120]) { g.beginPath(); g.arc(128, 250, r, 0, 7); g.stroke(); } const a = lt * 3.5; g.fillStyle = 'rgba(57,214,255,.35)'; g.beginPath(); g.moveTo(128, 250); g.arc(128, 250, 120, a - .6, a); g.fill(); g.strokeStyle = '#39d6ff'; g.lineWidth = 5; g.beginPath(); g.moveTo(128, 250); g.lineTo(128 + Math.cos(a) * 120, 250 + Math.sin(a) * 120); g.stroke(); const bl = (Math.sin(lt * 7) > 0) ? '#fff' : '#39d6ff'; g.fillStyle = bl; g.beginPath(); g.arc(128, 92, 9, 0, 7); g.fill(); txt(g, 'NOT HERE', 128, 410, 44, '#ff6b6b'); txt(g, '(it is up)', 128, 456, 30, '#9ec', { w: 700 }); radT.t.needsUpdate = true; };

  // ------------------------------------------------------------------ people
  const crowd = new Crowd(S, 1, 91); const YOU = crowd.p[0]; YOU.h = 1;
  { const col = (ks, c) => ks.forEach((k) => crowd.parts[k].setColorAt(0, new THREE.Color(c))); col(['torso', 'armL', 'armR'], 0x3a78d8); col(['legL', 'legR'], 0x2b3347); col(['hair'], 0x4a2f1c); for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true; }
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; };
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const lbTang = label('TANGLED AGAIN', '#ff6b6b', '#111', 900, 170, 96), lbNeat = label('SO NEAT!', '#7dff6a', '#111'), lbWow = label('MUCH BETTER!', '#7dff6a', '#111', 640, 170, 88), lbLost = label('LOST ONE', '#ff6b6b', '#111');

  // ------------------------------------------------------------------ camera
  const E = new THREE.Vector3(), G = new THREE.Vector3();
  const rig = (lt, sx, shots, t) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    E.set(sx + lerp(s[1][0], s[2][0], u), lerp(s[1][1], s[2][1], u), lerp(s[1][2], s[2][2], u)); G.set(sx + lerp(s[3][0], s[4][0], u), lerp(s[3][1], s[4][1], u), lerp(s[3][2], s[4][2], u)); E.x += Math.sin(t * .9) * .03; E.y += Math.sin(t * 1.3 + 1) * .025; A.cam(E.x, E.y, E.z, G.x, G.y, G.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .008); };

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); const sx = SX[bi]; YOU.vis = false; crowd.update(t);
    sets.forEach((g, i) => { g.visible = i === bi; });
    [phone0, cab0.im, phone1, cab1.im, mag, phone5].forEach((o) => { o.visible = false; }); fallB.forEach((b) => { b.visible = false; });
    [lbTang, lbNeat, lbWow, lbLost, lbQ, lbFind, lbSeen].forEach((s) => { s.visible = false; });
    jeans.visible = bi === 1; dirG.visible = bi === 4; bodyIM.visible = stemIM.visible = caseIM.visible = bi === 3;
    let cLab = 'TANGLES', cVal = '0', cNote = '', cHot = false;
    if (bi === 0) {
      // you stand, ball of cable in the right hand, phone in the left; then you wrap it neatly
      place(YOU, 0, 0, 0, 0, 'idle', .5); YOU.pitch = .12; const hold = smooth(lt / .5);
      const wr = clamp((lt - 1.6) / 1.5); const spin = wr * 18;
      YOU.arms = { lx: lerp(-.4, -1.3, hold), lz: -.05, rx: lerp(-.4, -1.0, hold) + Math.sin(lt * 14) * .12 * (lt < 1.6 ? 1 : .6), rz: .2 };
      crowd.setFace(lt > 3.0 ? 'calm' : 'shock'); crowd.update(t);
      // phone in left hand, held up as the winding post
      attach(phone0, YOU, 'handL', [.28, -.12, .2], [1.2, 0, 0]); phone0.matrix.scale(V3(.6, .6, .6)); phone0.visible = true;
      const bc = hp(YOU, 'handR'); bc.y += .12; bc.z += .3; bc.x += .05;
      const kk = clamp(wr * 1.7); phone0.userData.k = kk; cab0.im.visible = true;
      cab0.set((i, v) => { const k = clamp(kk * 1.8 - (i / cab0.n) * .8); const kn = knotP(i, cab0.n, bc, .15 + .03 * Math.sin(lt * 5), t, 0, .012); const w = wrapP(i, cab0.n, phone0); v.copy(kn).lerp(w, smooth(k)); });
      cLab = 'TANGLES'; cVal = lt < 1.6 ? String(1 + Math.floor(lt * 3)) : (lt > 3.1 ? '0' : String(5 - Math.floor((lt - 1.6) * 3))); cHot = lt < 1.6; cNote = lt < 1.6 ? 'it is a knot' : (lt > 3.1 ? 'neatly wrapped' : 'wrapping...');
      popLabel(lbNeat, lt > 3.15, V3(sx + .1, 2.8, .4), (lt - 3.15) * 5);
      rig(lt, sx, [[0, [.3, 2.0, 5.6], [.2, 1.9, 5.0], [0, 1.35, .2], [0, 1.25, .3], 40, 36], [1.5, [-.4, 1.9, 4.0], [-.5, 1.85, 3.5], [-.1, 1.3, .5], [-.1, 1.3, .55], 36, 32]], t);
    } else if (bi === 1) {
      const sh = Math.sin(lt * 14) * .06 * (lt < 3 ? 1 : .3); jeans.position.set(Math.sin(lt * 9) * .08, sh * 1.5, 0); jeans.rotation.z = Math.sin(lt * 7) * .04; jeans.updateMatrixWorld(true);
      const sw = clamp((lt - 1.1) / 1.0); const ph = phone1; const pm = new THREE.Matrix4().makeTranslation(sx + jeans.position.x * .0 + Math.sin(lt * 11) * .08, 1.9 + Math.abs(Math.sin(lt * 9)) * .12, .5).multiply(new THREE.Matrix4().makeRotationZ(Math.sin(lt * 7) * .15 + .1)); ph.matrix.copy(pm); ph.matrix.scale(V3(2, 2, 2)); ph.visible = true;
      const c = V3(sx, 2.4, .6); cab1.im.visible = true; const sc = 2.0;
      cab1.set((i, v) => { const k = clamp(sw * 1.8 - (i / cab1.n) * .8); const kn = knotP(i, cab1.n, c, .95 + .1 * Math.sin(lt * 6), t, 1.3, .06); const u = i / cab1.n; const a = u * 9 * Math.PI * 2; const w = V3(Math.cos(a) * .32 * sc, (u - .5) * .8 * sc, Math.sin(a) * .1 * sc + .03).applyMatrix4(ph.matrix); v.copy(w).lerp(kn, smooth(k)); });
      popLabel(lbTang, lt > 2.4, V3(sx, 5.2, .8), (lt - 2.4) * 5, 3.0, .57);
      cVal = lt < 1.2 ? '0' : String(Math.min(12, 1 + Math.floor((lt - 1.2) * 6))); cHot = lt > 1.2; cNote = lt < 1.2 ? 'neat. for now' : 'pocket gremlins';
      rig(lt, sx, [[0, [0, 3.0, 6.2], [.2, 2.9, 5.2], [0, 2.4, 0], [0, 2.3, .2], 44, 38]], t);
    } else if (bi === 2) {
      // case with one bud; you search with a magnifying glass
      place(YOU, sx + 2.0, 0, -1.7, -.1, 'idle', .5); YOU.pitch = .3 + .06 * Math.sin(lt * 3); const sweepX = Math.sin(lt * 2.0) * .8; YOU.arms = { lx: -.5, lz: -.15, rx: -1.25, rz: -.45 + Math.sin(lt * 2.0) * .35 }; crowd.setFace(lt > 3.1 ? 'shock' : 'calm'); crowd.update(t);
      const lid = caseG.userData.lid; lid.rotation.x = -1.95 + (lt < .6 ? 1.6 * (1 - smooth(lt / .6)) : 0);
      const b1 = caseG.userData.b1; b1.visible = true; b1.position.y = .75 + (lt > .6 ? 0 : 0); caseG.userData.led.material.color.set(lt > 3.0 ? 0xff3030 : 0x40ff70);
      const hr = hp(YOU, 'handR'); attach(mag, YOU, 'handR', [0, -.05, .55], [-1.0 - Math.sin(lt * 2) * .15, 0, 0]); mag.matrix.scale(V3(.9, .9, .9)); mag.visible = lt > 1.0;
      popLabel(lbQ, lt > 3.1, V3(sx + .4, 2.6 + Math.sin(lt * 5) * .08, .35), (lt - 3.1) * 5, 1.1, 1.1);
      popLabel(lbLost, lt > 3.2, V3(sx + .4, 3.7, .3), (lt - 3.2) * 5);
      cLab = 'EARBUDS LEFT'; cVal = lt < 3.0 ? '2' : '1'; cHot = lt >= 3.0; cNote = lt < 3.0 ? 'a perfect pair' : 'where is the other one';
      rig(lt, sx, [[0, [.6, 3.4, 4.4], [.3, 3.1, 3.7], [0, 1.4, .3], [0, 1.4, .3], 40, 34], [1.0, [1.0, 3.4, 8.2], [.8, 3.2, 7.4], [1.0, 1.7, -.6], [1.0, 1.8, -.7], 46, 46]], t);
    } else if (bi === 3) {
      // couch with lifted cushions, pile of earbuds growing
      const cu = couch3.userData.cushions; cu.forEach((c, i) => { c.rotation.x = -1.0 - Math.sin(t * 2 + i) * .02; });
      const frac = smooth(clamp((lt - .5) / 4.6)); setPile(frac, lt);
      place(YOU, sx - 5.2, 0, 1.6, 1.25, 'idle', .5); YOU.pitch = .35; const dg = Math.sin(lt * 9); YOU.arms = { lx: -1.3 + dg * .25, lz: -.1, rx: -1.3 - dg * .25, rz: .1 }; crowd.setFace(lt > 2.8 ? 'shock' : 'calm'); crowd.update(t);
      // pairs falling in: at 0.2 and 1.7 s
      [0, 1].forEach((k) => { const st = [.1, 1.3][k]; const l = lt - st; fallB[k * 2].visible = fallB[k * 2 + 1].visible = l > 0 && l < .9; if (l > 0 && l < .9) { const y = 5.5 - 5.2 * (l / .9) * (l / .9); fallB[k * 2].position.set(sx - .5 + k * 2, y, .4); fallB[k * 2 + 1].position.set(sx - .1 + k * 2, y + .05, .5); fallB[k * 2].rotation.set(l * 5, 0, l * 4); fallB[k * 2 + 1].rotation.set(-l * 4, 0, l * 6); } });
      cLab = 'EARBUDS IN COUCH'; cVal = String(Math.round(2 + frac * 410)); cHot = true; cNote = 'we do not talk about them';
      rig(lt, sx, [[0, [1.0, 6.2, 7.4], [.6, 5.8, 6.4], [0, 1.2, -.2], [0, 1.2, -.2], 50, 46], [2.8, [.4, 5.8, 5.6], [-.2, 5.2, 4.6], [-.2, 1.0, .0], [-.2, 1.1, .0], 46, 40]], t);
      A.follow(sx, 0);
    } else if (bi === 4) {
      drawScr(lt); dir.forEach((d, k) => { d.position.y = Math.abs(Math.sin(lt * 3.2 + k * 1.3)) * .06 * (lt > 1.8 ? 1 : .3); d.rotation.z = Math.sin(lt * 2.4 + k) * .03; });
      const v = Math.round(lerp(4, 4800, smooth(lt / 3.6))); cLab = 'COUCH INC. VALUATION'; cVal = '$' + v.toLocaleString('en-US') + 'M'; cHot = true; cNote = 'pre-revenue. pre-couch.';
      rig(lt, sx, [[0, [0, 4.2, 13.5], [0, 3.9, 12], [0, 3.1, -3], [0, 2.9, -3], 56, 52], [1.6, [9.5, 3.2, 3.4], [7.6, 3.0, 3.2], [0, 1.9, 2.0], [0, 1.8, 2.0], 48, 42]], t);
      A.follow(sx, 0);
    } else {
      place(YOU, sx - .3, 0, 4.0, 2.85, 'idle', .5); YOU.pitch = -.18; YOU.arms = { lx: -.35, lz: -.12, rx: -1.95 + Math.sin(lt * 2) * .05, rz: .1 }; crowd.setFace('shock'); crowd.update(t);
      attach(phone5, YOU, 'handR', [0, -.1, .3], [Math.PI * .06, 0, 0]); phone5.matrix.scale(V3(.8, .8, .8)); phone5.visible = true; drawRad(lt);
      cloud.position.set(1.0 + Math.sin(t * .6) * .15, 5.4 + Math.sin(t * 1.1) * .1, -2.0);
      buds5.forEach((b, i) => { const a = t * (.5 + cr(i, 1) * .5) + i * 1.9; const r = 2.4 + cr(i, 2) * 2.0; b.position.set(cloud.position.x + Math.cos(a) * r * 1.2, cloud.position.y - .2 + Math.sin(a * 1.3 + i) * 1.1 + (cr(i, 3) - .5) * .8, cloud.position.z + Math.sin(a) * r * .6 + 1.5); b.rotation.set(Math.sin(t * 2 + i) * .6, a, Math.cos(t * 1.7 + i) * .6); });
      pings.forEach((m, i) => { const ph = ((t * .75 + i / 3) % 1); m.position.set(cloud.position.x, cloud.position.y, cloud.position.z + 2.0); m.scale.setScalar(.4 + ph * 2.6); m.material.opacity = (1 - ph) * .9; m.quaternion.copy(A.camera.quaternion); });
      popLabel(lbFind, true, V3(sx + 1.0, 7.9 + Math.sin(t * 3) * .05, -2.0), clamp(lt * 4), 2.6, .73);
      popLabel(lbSeen, lt > .8, V3(sx + .2, 3.2, 1.5), clamp((lt - .8) * 4), 3.3, .52);
      cLab = 'EARBUDS FOUND'; cVal = '0'; cHot = true; cNote = 'last seen: the cloud';
      rig(lt, sx, [[0, [1.0, 2.4, 11], [.8, 2.6, 10.2], [-.2, 3.4, 0], [.2, 3.9, -.5], 54, 50]], t);
    }
    if (bi !== 3 && bi !== 4) A.follow(sx, 0); else A.follow(sx, 0);
    A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    hud.counter(cLab, cVal, cNote, '', cHot); hud.tm(''); hud.pop('', 0);
  } };
}
