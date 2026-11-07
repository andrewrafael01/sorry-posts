import { makeBubble } from './_drake.js';
// What if every dating app bio became physically true? One blocky person per beat, a floating profile card, the bio becomes literal.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, addBox, mat, Crowd, clamp, smooth, lerp, attach, dropBounce, tri } = lib;
  const st = makeStage({ shadowExtent: 34, fogNear: 110, fogFar: 460, sunDir: [-.5, .8, -.3], sunI: 2.8 }); const S = st.scene;
  const city = buildStreet(S, { seed: 7 }); city.cars.forEach((c) => (c.m.visible = false)); city.crowd.p.forEach((o) => (o.vis = false)); city.crowd.update(0);
  const CZ = 20; // action line on the street
  const crowd = new Crowd(S, 14, 21); const P = crowd.p;
  const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  const dress = (i, shirt, pants, skin, hair) => { ['torso', 'armL', 'armR'].forEach((k) => col(i, k, shirt)); ['legL', 'legR'].forEach((k) => col(i, k, pants)); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(i, k, skin)); col(i, 'hair', hair); };
  const CHAD = 0, JESS = 1, DAVE = 2, BRAD = 3, KA = 4, KB = 5, SOME = 6; // 7..13 extras
  const SK = [0xe7b48f, 0xc98e63, 0x8d5a3b, 0xf0c7a4];
  dress(CHAD, 0x1d2a44, 0x2f3a52, SK[0], 0x2a1d12); dress(JESS, 0xe85d8a, 0x2f3f5f, SK[1], 0x3a2214); dress(DAVE, 0xe3a21a, 0x4a5a3a, SK[3], 0x6b3d1c); dress(BRAD, 0x2f8f6a, 0x39404c, SK[0], 0xc9a24a);
  dress(KA, 0x3b6fd8, 0x9a8a62, SK[0], 0x4a2f1a); dress(KB, 0x9a8a62, 0x3b6fd8, SK[0], 0xd6b45a); dress(SOME, 0x8a6fd0, 0x30343c, SK[2], 0x15100c);
  const ex = [[0xd84a4a, 0x2a2f3c], [0x4aa0d8, 0x3a3a46], [0x6ac05a, 0x4a4036], [0xd8d04a, 0x2c3a54], [0xb04ad8, 0x35323a], [0xe08a3c, 0x2a2f3c], [0x4ad8c0, 0x40343a]];
  for (let i = 7; i < 14; i++) dress(i, ex[i - 7][0], ex[i - 7][1], SK[i % 4], [0x1a1410, 0x4a2c18, 0x8a6a32][i % 3]);
  // chad's legs are bare: the pants are separate boxes of fixed world length
  col(CHAD, 'legL', SK[0]); col(CHAD, 'legR', SK[0]);
  P.forEach((o) => { o.h = 1; });
  [CHAD, KA, KB].forEach((i) => { P[i].M.legL = new THREE.Matrix4(); P[i].M.legR = new THREE.Matrix4(); });
  const UB = new THREE.BoxGeometry(1, 1, 1); const sc4 = new THREE.Matrix4();
  const place = (i, x, z, yaw, anim = 'idle', o = {}) => { const p = P[i]; p.x = x; p.z = z; p.yaw = yaw; p.anim = anim; p.y = o.y || 0; p.speed = o.sp ?? 1; p.scale = o.sc ?? 1; p.vis = true; p.pitch = o.pitch || 0; p.arms = o.arms || null; p.extra = o.extra || 0; p.hs = o.hs ?? 1; };
  const scaled = (mesh, sx, sy, sz) => { sc4.makeScale(sx, sy, sz); mesh.matrix.multiply(sc4); };
  const mk = (geo, m, parent = S) => { const x = new THREE.Mesh(geo, m); x.castShadow = true; x.receiveShadow = true; x.visible = false; parent.add(x); return x; };

  // ---- profile cards (canvas texture planes)
  const mkCard = (name, bio, accent, shirt) => {
    const cv = document.createElement('canvas'); cv.width = 640; cv.height = 900; const g = cv.getContext('2d');
    g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 28; g.shadowOffsetY = 10; g.fillStyle = '#fbfbfd'; g.beginPath(); g.roundRect(40, 30, 560, 840, 54); g.fill(); g.shadowColor = 'transparent';
    g.save(); g.beginPath(); g.roundRect(40, 30, 560, 840, 54); g.clip(); const gr = g.createLinearGradient(0, 30, 640, 300); gr.addColorStop(0, accent); gr.addColorStop(1, '#ffffff'); g.fillStyle = gr; g.fillRect(40, 30, 560, 250); g.restore();
    g.fillStyle = '#' + new THREE.Color(shirt).getHexString(); g.beginPath(); g.roundRect(215, 205, 210, 130, [60, 60, 0, 0]); g.fill(); g.fillStyle = '#e9c3a2'; g.beginPath(); g.arc(320, 150, 70, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 10; g.beginPath(); g.arc(320, 150, 74, 0, 7); g.stroke();
    g.fillStyle = '#16181d'; g.font = '800 60px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText(name, 320, 400);
    g.fillStyle = '#d33a5a'; g.font = '700 26px Liberation Sans, Arial'; g.fillText('BIO', 320, 440);
    const txt = '“' + bio + '”'; let fs = 84; let lines; for (; fs >= 36; fs -= 4) { g.font = '900 italic ' + fs + 'px Liberation Sans, Arial'; const words = txt.split(' '); lines = []; let cur = ''; words.forEach((w) => { const t2 = cur ? cur + ' ' + w : w; if (g.measureText(t2).width > 500 && cur) { lines.push(cur); cur = w; } else cur = t2; }); lines.push(cur); if (lines.length <= 3 && lines.every((l) => g.measureText(l).width <= 510)) break; }
    g.fillStyle = '#16181d'; lines.forEach((l, k) => g.fillText(l, 320, 590 + k * (fs + 8) - (lines.length - 1) * (fs + 8) * .5 + fs * .3));
    g.fillStyle = '#ff3b6b'; g.beginPath(); g.arc(320, 790, 52, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(320, 818); g.bezierCurveTo(272, 786, 282, 750, 305, 754); g.bezierCurveTo(314, 756, 320, 764, 320, 768); g.bezierCurveTo(320, 764, 326, 756, 335, 754); g.bezierCurveTo(358, 750, 368, 786, 320, 818); g.fill();
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; const m = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.39), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })); m.visible = false; m.renderOrder = 5; S.add(m); return m;
  };
  const cards = [mkCard('Chad, 29', '6 FT', '#5b8cff', 0x1d2a44), mkCard('Jessica, 27', 'I love to travel', '#ff7ab0', 0xe85d8a), mkCard('Dave, 31', "I'm very funny", '#ffc233', 0xe3a21a), mkCard('Brad, 28', "I'm a good listener", '#4cd9a0', 0x2f8f6a), mkCard('Kyle, 30', 'looking for my other half', '#9a8cff', 0x3b6fd8), mkCard('Somebody', 'no drama', '#b0b8c4', 0x8a6fd0)];
  const cardAt = (k, x, y, z, sc = 1, t = 0) => { const c = cards[k]; c.visible = true; c.position.set(x, y + Math.sin(t * 2.2 + k) * .05, z); c.scale.setScalar(sc * (1 + .025 * Math.sin(t * 5 + k))); c.quaternion.copy(st.camera.quaternion); };

  // ---- generic canvas sign
  const mkSign = (w, h, cw, ch, draw, o = {}) => { const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const g = cv.getContext('2d'); draw(g, cw, ch); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: !!o.transparent })); m.visible = false; S.add(m); return { m, g, tex, cv }; };
  const bubbles = Array.from({ length: 6 }, () => makeBubble(lib, S, 1.0, .4));
  const bub = (k, text, x, y, z) => bubbles[k].show(text, x, y, z);

  // ---- height chart beside Chad
  const chart = new THREE.Group(); S.add(chart); chart.visible = false;
  { const post = new THREE.Mesh(new THREE.BoxGeometry(.14, 3.2, .05), mat(0xf2ead2)); post.position.y = 1.6; chart.add(post); for (let i = 0; i <= 12; i++) { const tk = new THREE.Mesh(new THREE.BoxGeometry(i % 4 === 0 ? .26 : .17, .015, .06), mat(0x222222)); tk.position.set(-.1, .5 + i * .16, .01); chart.add(tk); } }
  const mark = (y, c) => { const m = new THREE.Mesh(new THREE.BoxGeometry(2.0, .05, .06), mat(c, { emissive: c, emissiveIntensity: .3 })); m.position.set(-.8, y, .02); chart.add(m); return m; };
  const oldMark = mark(1.5, 0xff4040), newMark = mark(1.9, 0x30c060);
  const chartLab = mkSign(.8, .3, 256, 96, (g, w, h) => { g.fillStyle = '#ff4040'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 64px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('5\'7"', w / 2, 70); }); chartLab.m.visible = false;
  const chartLab2 = mkSign(.8, .3, 256, 96, (g, w, h) => { g.fillStyle = '#30c060'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 64px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('6\'0"', w / 2, 70); });

  // ---- chad's pants / socks / shoes (fixed world length, attached to the leg matrices)
  const pantsM = [0, 1].map(() => mk(UB, mat(0x2f3a52))), sockM = [0, 1].map(() => mk(UB, mat(0xf4f4f0))), shoeM = [0, 1].map(() => mk(UB, mat(0x1a1a1e)));
  const chadPants = (o, lenWorld) => { const s = o.scale; ['legL', 'legR'].forEach((k, j) => { const Ls = lenWorld / s; attach(pantsM[j], o, k, [0, .4 - Ls / 2, 0]); scaled(pantsM[j], .3, Ls, .33); attach(sockM[j], o, k, [0, -.4 + .1, 0]); scaled(sockM[j], .26, .14, .28); attach(shoeM[j], o, k, [0, -.4 + .05, .07]); scaled(shoeM[j], .29, .12, .44); }); [...pantsM, ...sockM, ...shoeM].forEach((m) => (m.visible = true)); };
  const chadPantsHide = () => [...pantsM, ...sockM, ...shoeM].forEach((m) => (m.visible = false));

  // ---- jessica: cart + terminal
  const cart = new THREE.Group(); S.add(cart); cart.visible = false;
  { const add = (g, m, x, y, z) => { const q = new THREE.Mesh(g, m); q.position.set(x, y, z); q.castShadow = true; q.receiveShadow = true; cart.add(q); return q; };
    const steel = mat(0xb8c0c8, { metalness: .6, roughness: .35 }); add(new THREE.BoxGeometry(.8, .06, 1.3), steel, 0, -.5, 1.4); add(new THREE.BoxGeometry(.8, .04, .04), steel, 0, .12, .68); for (const x of [-.4, .4]) { add(new THREE.BoxGeometry(.04, .65, .04), steel, x, -.2, .68); for (const z of [.9, 1.9]) add(new THREE.CylinderGeometry(.09, .09, .06, 12), mat(0x222222), x * 1.05, -.62, z).rotation.z = Math.PI / 2; }
    add(new RB(.7, .5, .35), mat(0xd23c3c), 0, -.2, 1.0); add(new RB(.62, .42, .32), mat(0x2a9cc4), 0, -.24, 1.5); add(new RB(.5, .36, .3), mat(0xf2c230), .03, .17, 1.15); add(new RB(.3, .06, .04), mat(0x333333), 0, .12, .84); add(new RB(.07, .5, .5), mat(0x111111), .35, -.45, 1.4); }
  function RB(w, h, d) { return new lib.RoundedBoxGeometry(w, h, d, 3, .04); }
  const term = new THREE.Group(); S.add(term); term.visible = false; const TZ = CZ + 5.5; term.position.set(0, 0, TZ);
  const tb = (w, h, d, c, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.material || mat(c, o.mat)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; term.add(m); return m; };
  const wallsG = new THREE.Group(); term.add(wallsG);
  { const tw = (w, h, d, c, x, y, z, o) => { const m = tb(w, h, d, c, x, y, z, o); term.remove(m); wallsG.add(m); m.position.y = y; return m; };
    tw(7.2, .14, 7.4, 0xb9c3cf, 0, .07, 0, { cast: false }); for (let k = -3; k <= 3; k++) tw(.04, .02, 7.4, 0x8a96a4, k, .15, 0, { cast: false }); tw(7.2, 5.6, .3, 0xe3e8ee, 0, 2.8, 3.6); tw(.3, 5.6, 7.4, 0xdfe5ec, -3.6, 2.8, 0); tw(.3, 5.6, 7.4, 0xdfe5ec, 3.6, 2.8, 0);
    tw(5.6, 2.4, .08, 0x9fd0ee, 0, 2.5, 3.42, { mat: { roughness: .1, metalness: .2, transparent: true, opacity: .55 } }); tw(5.6, .08, .1, 0x555555, 0, 1.25, 3.4); tw(.08, 2.1, .1, 0x555555, -1.4, 2.3, 3.4); tw(.08, 2.1, .1, 0x555555, 1.4, 2.3, 3.4);
    for (const x of [-2.4, 2.4]) tw(.9, .45, .5, 0xd8dde4, x, .3, 2.8); }
  const roof = tb(7.6, .3, 7.8, 0xcfd6df, 0, 5.75, 0); for (const x of [-2.2, 0, 2.2]) { const l = tb(1.2, .06, 4.6, 0xffffff, x, 5.57, 0, { cast: false, mat: { emissive: 0xffffff, emissiveIntensity: .9 } }); }
  const plane = new THREE.Group(); term.add(plane); { const wh = mat(0xf4f6f8, { roughness: .4 }); const fu = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, 5.4, 16), wh); fu.rotation.z = Math.PI / 2; fu.castShadow = true; plane.add(fu); const nose = new THREE.Mesh(new THREE.SphereGeometry(.45, 12, 8), wh); nose.position.x = 2.7; plane.add(nose); const wing = new THREE.Mesh(new THREE.BoxGeometry(1.1, .08, 2.6), mat(0xd7dde3)); wing.position.set(.2, -.15, 0); plane.add(wing); const fin = new THREE.Mesh(new THREE.BoxGeometry(.8, 1.2, .08), mat(0x2a6ad8)); fin.position.set(-2.4, .85, 0); plane.add(fin); for (let i = 0; i < 6; i++) { const w2 = new THREE.Mesh(new THREE.BoxGeometry(.18, .18, .05), mat(0x203040)); w2.position.set(1.8 - i * .45, .12, .46); plane.add(w2); } plane.position.set(-.5, 2.35, 5.0); }
  const signB = mkSign(2.6, .8, 768, 240, (g, w, h) => { g.fillStyle = '#ffd400'; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; g.font = '900 120px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('TERMINAL B', w / 2, 150); g.fillRect(0, 190, w, 50); g.fillStyle = '#ffd400'; g.font = '800 40px Liberation Sans, Arial'; g.fillText('→  GATES 21–40', w / 2, 230); });
  signB.m.parent.remove(signB.m); term.add(signB.m); const rods = [-1.0, 1.0].map((x) => { const r = new THREE.Mesh(new THREE.BoxGeometry(.05, 1, .05), mat(0x333333)); r.position.set(x, 0, 0); signB.m.add(r); return r; });
  const calend = mkSign(1.5, 1.9, 450, 570, () => {}); calend.m.parent.remove(calend.m); term.add(calend.m);
  const drawCal = (xs) => { const g = calend.g, w = 450, h = 570; g.fillStyle = '#fffdf6'; g.fillRect(0, 0, w, h); g.fillStyle = '#d83a3a'; g.fillRect(0, 0, w, 130); g.fillStyle = '#fff'; g.font = '900 84px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('MARCH', w / 2, 98); g.fillStyle = '#222'; g.font = '700 26px Liberation Sans, Arial'; const D = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; D.forEach((d, i) => g.fillText(d, 45 + i * 60, 170)); for (let d = 0; d < 31; d++) { const cx = 45 + ((d + 5) % 7) * 60, cy = 225 + Math.floor((d + 5) / 7) * 70; g.fillStyle = '#222'; g.font = '700 30px Liberation Sans, Arial'; g.fillText(String(d + 1), cx, cy); if (d < xs) { g.strokeStyle = '#d83a3a'; g.lineWidth = 7; g.beginPath(); g.moveTo(cx - 24, cy - 32); g.lineTo(cx + 24, cy + 10); g.moveTo(cx + 24, cy - 32); g.lineTo(cx - 24, cy + 10); g.stroke(); } } calend.tex.needsUpdate = true; }; let calXs = -1;
  calend.m.position.set(1.9, 2.6, 3.25); signB.m.position.set(1.4, 4.4, 3.1); signB.m.scale.setScalar(.7);

  // ---- brad: satellite dishes
  const dishes = [0, 1].map((j) => { const grp = new THREE.Group(); const cap = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 10, 0, Math.PI * 2, 0, .62), new THREE.MeshStandardMaterial({ color: 0xe6eaee, metalness: .55, roughness: .3, side: THREE.DoubleSide })); cap.scale.set(1, .55, 1); cap.castShadow = true; grp.add(cap); const rim = new THREE.Mesh(new THREE.TorusGeometry(Math.sin(.62), .035, 8, 32), mat(0xbfc6cd, { metalness: .6, roughness: .3 })); rim.rotation.x = Math.PI / 2; rim.position.y = Math.cos(.62) * .55 + 1 * 0; rim.position.y = (Math.cos(.62) - 1) * .55 + .55 - .55 + .0; grp.add(rim); const arm = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .9, 6), mat(0x555a60)); arm.position.y = .45; grp.add(arm); const feed = new THREE.Mesh(new THREE.SphereGeometry(.08, 10, 8), mat(0xff4040)); feed.position.y = .92; grp.add(feed); const post = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .3, 8), mat(0x666b72)); post.position.y = -.1; grp.add(post); grp.visible = false; S.add(grp); return grp; });
  const norway = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 176; const g = c.getContext('2d'); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); sp.scale.set(1.5, .515, 1); sp.visible = false; S.add(sp);
    g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 8; g.beginPath(); g.roundRect(8, 8, 496, 140, 30); g.fill(); g.stroke();
    g.fillStyle = '#ba0c2f'; g.fillRect(28, 32, 150, 92); g.fillStyle = '#fff'; g.fillRect(70, 32, 44, 92); g.fillRect(28, 62, 150, 32); g.fillStyle = '#00205b'; g.fillRect(80, 32, 24, 92); g.fillRect(28, 72, 150, 12); g.strokeStyle = '#111'; g.lineWidth = 5; g.strokeRect(28, 32, 150, 92);
    g.fillStyle = '#111'; g.font = '900 64px Liberation Sans, Arial'; g.textAlign = 'left'; g.fillText('podcast', 200, 100); tex.needsUpdate = true; return sp; })();

  // ---- kyle: angry brows, flash
  const brows = [0, 1, 2, 3].map(() => mk(UB, mat(0x120c08)));
  const flash = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8 })); flash.visible = false; S.add(flash);
  const browOn = (o, a, b) => { [[-.085, -.5], [.085, .5]].forEach(([x, r], j) => { const m = brows[a + j]; attach(m, o, 'head', [x * (o.hs ?? 1), .045 * (o.hs ?? 1), .236 * (o.hs ?? 1)], [0, 0, r]); scaled(m, .11 * (o.hs ?? 1), .026, .02); m.visible = true; }); };

  // ---- finale clock
  const clock = mkSign(2.4, 2.4, 384, 384, () => {}, { transparent: true }); const drawClock = (u) => { const g = clock.g; g.clearRect(0, 0, 384, 384); g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 14; g.beginPath(); g.arc(192, 192, 176, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#111'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.fillRect(192 + Math.sin(a) * 150 - 5, 192 - Math.cos(a) * 150 - 5, 10, 10); } g.lineWidth = 12; g.lineCap = 'round'; const hand = (a, l, w) => { g.lineWidth = w; g.beginPath(); g.moveTo(192, 192); g.lineTo(192 + Math.sin(a) * l, 192 - Math.cos(a) * l); g.stroke(); }; hand(u * 6.283, 135, 9); hand(u / 12 * 6.283, 85, 15); g.fillStyle = '#d33'; g.beginPath(); g.arc(192, 192, 14, 0, 7); g.fill(); clock.tex.needsUpdate = true; };
  const dust = new THREE.Group(); S.add(dust); const puffs = Array.from({ length: 10 }, () => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 1, transparent: true, opacity: .6 })); m.visible = false; dust.add(m); return m; });

  const POP = ['', 'PANTS NOT INFORMED', 'TERMINAL B', 'ALONE IN THE LAUGH', 'NORWAY PODCAST', 'TWO KYLES', 'THE ENTIRE CAST'];
  const POPT = [0, 5.9, 5.8, 5.3, 4.9, 3.6, 6.15];
  const facing = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 6); const dur = tl.beats[bi] ? tl.beats[bi].dur : 7;
    P.forEach((o) => { o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; o.hs = 1; });
    cards.forEach((c) => (c.visible = false)); bubbles.forEach((b) => b.hide()); chart.visible = false; chartLab.m.visible = false; chartLab2.m.visible = false; cart.visible = false; term.visible = false; dishes.forEach((d) => (d.visible = false)); norway.visible = false; brows.forEach((m) => (m.visible = false)); flash.visible = false; clock.m.visible = false; puffs.forEach((m) => (m.visible = false)); chadPantsHide();
    let cam = [0, 2, 8, 0, 2, 20, 50]; let cnt = ['', '', '', '', false]; let cartOn = false; let chadPantsOn = null; let browsOn = []; let dishOn = null; let jessCart = false;
    const noArms = null;
    if (bi === 0) {
      const xs = [-5.2, -3.1, -1.0, 1.1, 3.2, 5.3], ids = [CHAD, JESS, DAVE, BRAD, KA, SOME];
      ids.forEach((id, k) => place(id, xs[k] + (k % 2) * .0, CZ + (k % 2) * 1.1, Math.PI, 'idle', { sc: id === CHAD ? .88 : 1 }));
      ids.forEach((id, k) => { const o = P[id]; o.phase = k; });
      chadPantsOn = 'short';
      const u = smooth(clamp(lt / 3.6)); cam = [lerp(-1.2, 1.2, u), 2.3, 4.5 - u * 2.2, 0, 2.7, CZ, 52];
      cnt = ['', '', '', '', false];
    } else if (bi === 1) {
      // lt: 0-2.0 bio, 2.08-3.8 grows, 3.8-5.64 old height shown, 5.64+ pants
      const grow = smooth(clamp((lt - 2.1) / 1.4)); const over = grow >= 1 ? 0 : 0; const k = lerp(.88, 1.3, grow) + (lt > 3.5 && lt < 4.2 ? .02 * Math.sin((lt - 3.5) * 14) * (1 - (lt - 3.5) / .7) : 0);
      const down = smooth(clamp((lt - 5.5) / .6));
      place(CHAD, 0, CZ, Math.PI, 'idle', { sc: k, pitch: .85 * down, arms: down > 0 ? { lx: -.85 * down + .75 * down, rx: -.85 * down + .75 * down } : (lt > 2.1 && lt < 3.9 ? { lx: -.3, rx: -.3, lz: .35, rz: -.35 } : null) });
      chadPantsOn = 'chad'; chart.visible = true; chart.position.set(1.75, 0, CZ + .3); chart.rotation.y = 0;
      const sc0 = k; // chart marks: 5'7" = old height line, 6'0" = new
      oldMark.position.y = 1.85; newMark.position.y = 2.55; oldMark.visible = lt > 3.8; newMark.visible = lt > 2.3; oldMark.material.emissiveIntensity = lt > 3.8 && lt < 5.6 ? .4 + .5 * Math.sin(lt * 14) : .3;
      chartLab.m.visible = lt > 3.8; chartLab.m.position.set(1.75 - 1.9, 1.85 - .0, CZ - .25); chartLab2.m.visible = lt > 2.3; chartLab2.m.position.set(1.75 - 1.9, 2.6, CZ - .25);
      cardAt(0, 0, 1.22 * 1.8 + 1.25 + .1, CZ, 1, lt);
      if (lt > 3.8 && lt < 5.7) bub(0, 'was 5\'7"', 1.9, 3.0, CZ - .2);
      const inch = Math.round(lerp(67, 72, grow)); cnt = ['Height', Math.floor(inch / 12) + "'" + (inch % 12) + '"', 'Bios made true: 1', 'BIOS COME TRUE', grow > .02];
      const u = smooth(clamp((lt - 5.2) / 1.2)); cam = [lerp(.8, 1.0, u), lerp(2.6, 1.0, u), CZ - lerp(7.4, 4.6, u), lerp(.6, .3, u), lerp(2.6, .9, u), CZ, lerp(52, 48, u)];
      if (lt > 6.3) bub(1, 'uh...', .9, 2.5, CZ - .1);
    } else if (bi === 2) {
      const inT = clamp((lt - 2.8) / .9); const ptz = TZ;
      // jessica paces inside once the terminal exists
      const px = lt > 2.8 ? tri(lt * .85 + 1.2, -1.3, .4) : 0; const dir = Math.cos((lt * .85 + 1.2) * 1) ; const vdir = (() => { const L = 2.1; const u = ((lt * .85 + 1.2) % (2 * L) + 2 * L) % (2 * L); return u < L ? 1 : -1; })();
      const jx = lt > 2.8 ? px : -1.0, jz = lt > 2.8 ? TZ - .2 : CZ; const yaw = lt > 2.8 ? (vdir > 0 ? Math.PI / 2 : -Math.PI / 2) : Math.PI / 2;
      place(JESS, jx, jz, yaw, 'walk', { sp: .5, sc: 1.1, arms: { lx: -1.35, rx: -1.35 } }); cartOn = true;
      cardAt(1, jx, lt > 2.8 ? 3.45 : 3.6, jz, lt > 2.8 ? .8 : 1, lt);
      term.visible = lt > 2.8; if (lt > 2.8) { wallsG.scale.y = Math.max(.001, smooth(clamp((lt - 2.8) / .5)) * (1 + (1 - smooth(clamp((lt - 2.8) / .5))) * 0)); const rd = dropBounce(6, 0, Math.max(0, lt - 3.2), .3, 20); roof.position.y = 5.75 + rd.y; roof.visible = true; plane.position.x = lerp(-1.6, 1.6, clamp((lt - 3) / 4)); }
      signB.m.visible = lt > 5.3; if (lt > 5.3) { const d = dropBounce(.8, 0, lt - 5.3, .35, 22); signB.m.position.y = 4.4 + d.y; rods.forEach((r) => { r.scale.y = 1.2 + d.y; r.position.y = .4 + (.6 + d.y / 2) * 1; }); }
      calend.m.visible = lt > 3.9; if (lt > 3.9) { const xs = Math.floor(clamp((lt - 4.0) / 3.0) * 31); if (xs !== calXs) { calXs = xs; drawCal(xs); } const pp = smooth(clamp((lt - 3.9) / .4)); calend.m.scale.setScalar(Math.max(.01, pp)); }
      const days = lt < 2.9 ? 0 : lt < 5.24 ? Math.floor((lt - 2.9) * 1.2) : Math.floor(lerp(3, 251, smooth(clamp((lt - 5.24) / 1.9))));
      cnt = ['Days in airport', String(days), 'Bios made true: 2', 'BIOS COME TRUE', lt > 5.2];
      const u = smooth(clamp(lt / 7)); cam = lt < 2.8 ? [1.4, 2.3, 10.6, jx + .4, 2.5, jz, 50] : [lerp(.9, .4, u), 2.4, CZ - 3.2, .3 + jx * .3, 3.0, TZ - .2, 56];
    } else if (bi === 3) {
      const R6 = 3.3; const cx = 0, cz = CZ; place(DAVE, cx, cz, Math.PI, 'bend', { sp: 1.0, extra: .05, sc: 1.1 });
      for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 + .35; const ex2 = cx + Math.sin(a) * R6, ez = cz + Math.cos(a) * R6; place(7 + i, ex2, ez, facing(ex2, ez, cx, cz), 'idle', { sp: .5, sc: 1.0, arms: { lx: -1.15, rx: -1.15, lz: .85, rz: -.85 } }); }
      cardAt(2, cx, 3.5, cz, 1, lt);
      const hh = Math.floor(lt * 5 + 1); bub(0, ['HA HA', 'HAHA', 'HA HA HA'][Math.floor(lt * 4) % 3], cx - 1.5, 2.9, cz - .5);
      if (lt > 2.4) bub(1, '...', cx - 3.0, 2.6, cz - 2.2); if (lt > 3.6) bub(2, 'ok', cx + 3.2, 2.4, cz - 1.0); if (lt > 5.3) bub(3, 'no.', cx + 2.1, 2.4, cz + 2.6);
      const a = -.5 + lt * .12; cam = [Math.sin(a) * 9.5, 5.0, cz - Math.cos(a) * 9.5, cx + .8, 1.4, cz, 55];
      cnt = ['Laughs · Dave vs everyone', String(Math.floor(lt * 5.2) + (lt > 2.5 ? 12 : 0)), 'everyone else: 0', 'BIOS COME TRUE', lt > 2.5];
    } else if (bi === 4) {
      const gr = smooth(clamp((lt - 2.76) / .5)); const bx = 0, bz = CZ;
      const hear = lt > 2.76; place(BRAD, bx, bz, Math.PI, 'idle', { sc: 1.1, arms: hear ? { lx: -2.5, rx: -2.5, lz: -.3, rz: .3 } : null, hs: 1.0 });
      dishOn = { g: gr, sway: hear ? Math.sin(lt * 3.2) * .22 : 0 };
      cardAt(3, bx, 3.95, bz, 1, lt);
      if (lt > 5.4) norway.visible = true; if (lt > 5.4) norway.position.set(bx - 1.9, 3.5, bz - .3);
      if (lt > 4.86 && lt < 5.4) bub(0, '...', bx - 1.7, 3.5, bz - .3);
      for (let k = 0; k < 3; k++) if (lt > 4.9) { const u = ((lt * 1.2 + k / 3) % 1); }
      const u = smooth(clamp(lt / 7)); cam = [lerp(.4, -.4, u), 2.3, bz - lerp(7.0, 6.2, u), .7, 2.6, bz, 52];
      cnt = ['Bios made true', hear ? '4' : '3', hear ? 'ears: satellite' : 'Brad: listening', 'BIOS COME TRUE', hear];
    } else if (bi === 5) {
      const split = smooth(clamp((lt - 3.2) / .45)); const ax = lerp(0, -.62, split), bx2 = lerp(0, .62, split); const bz = CZ;
      const yawA = lerp(Math.PI, Math.PI + .95, split), yawB = lerp(Math.PI, Math.PI - .95, split);
      const shove = lt > 4.5 ? Math.sin(lt * 17) * .05 : 0; const two = lt > 3.2;
      place(KA, ax - shove, bz, yawA, 'idle', { sc: 1.1, arms: two ? { lx: -1.15, rx: -1.15, lz: .9, rz: -.9 } : { lx: .3, rx: .3 }, pitch: two ? .08 : 0 });
      if (two) place(KB, bx2 + shove, bz, yawB, 'idle', { sc: 1.1, arms: { lx: -1.15, rx: -1.15, lz: .9, rz: -.9 }, pitch: .08 });
      if (two) { P[KB].phase = 2.2; browOn(P[KA], 0); browOn(P[KB], 2); } else if (lt > 2.6) browOn(P[KA], 0);
      if (lt > 3.0 && lt < 3.7) { flash.visible = true; const fu = (lt - 3.0) / .7; flash.position.set(0, 1.7, bz - .2); flash.scale.setScalar(.4 + fu * 2.2); flash.material.opacity = .85 * (1 - fu); }
      if (!two) cardAt(4, 0, 3.7, bz, 1, lt);
      else { cardAt(4, 0, 5.2, bz, .8, lt); }
      if (lt > 3.9) bub(0, '$#@%!', ax - .3, 3.2, bz - .5); if (lt > 4.2) bub(1, 'YOU?!', bx2 + .3, 3.2, bz - .5);
      const u = smooth(clamp(lt / 6.5)); cam = [lerp(.3, -.2, u), 2.4, bz - lerp(9.0, 8.0, u), .3, 2.6, bz, 52];
      cnt = ['Kyles', two ? '2' : '1', two ? 'each other\'s other half' : 'looking for his other half', 'BIOS COME TRUE', two];
    } else {
      // 0-2.4 no drama card, 2.5-4.6 empty street, 4.64+ cast arrives
      if (lt < 2.45) { place(SOME, 0, CZ, Math.PI, 'idle', { sc: 1.1, arms: { lx: -.2, rx: -.2 } }); cardAt(5, 0, 3.7, CZ, 1, lt); cam = [.4, 2.3, CZ - 7.2, .6, 2.5, CZ, 50]; cnt = ['Bios made true', '5', 'drama: none', 'BIOS COME TRUE', false]; }
      else {
        const quiet = lt < 4.55; const u = clamp((lt - 2.5) / 1.7);
        // clock hangs over the empty street
        clock.m.visible = quiet; if (quiet) { clock.m.position.set(1.2, 7.0, CZ + 22); clock.m.scale.setScalar(2.6); clock.m.quaternion.copy(st.camera.quaternion); drawClock(u * 1.0); }
        const run = lt - 4.55;
        if (run > 0) {
          const L = [CHAD, JESS, DAVE, BRAD, KA, KB, SOME, 7, 8, 9, 10, 11, 12, 13]; const rs = [[-3.6, 40], [-1.8, 43], [-.3, 38], [1.4, 42], [2.9, 39], [-2.8, 46], [.7, 47], [3.8, 44], [-4.3, 41], [-1.0, 50], [2.2, 52], [-3.0, 36], [1.8, 36], [4.4, 49]];
          L.forEach((id, k) => { const z0 = rs[k][1]; const sp = 9.5 + (k % 4) * .5; const z = z0 - sp * run; const x = rs[k][0] * (1 - .12 * clamp(run / 1.8)); const sc = id === CHAD ? 1.3 : 1.05; place(id, x, Math.max(z, 9.0 + (k % 5) * .5), Math.PI, id === DAVE ? 'sprint' : 'sprint', { sc, arms: id === JESS ? { lx: -1.35, rx: -1.35 } : null, extra: .02 }); });
          cartOn = true; chadPantsOn = 'chad'; browsOn = [KA, KB]; dishOn = { g: 1, sway: Math.sin(lt * 9) * .2, who: 'brad' };
          const yellz = ['!!!', 'HA HA', 'LISTEN', 'MARCH!', 'UGH', 'EXCUSE ME', 'WAIT'];
          for (let b = 0; b < 6; b++) { const id = [CHAD, DAVE, BRAD, KA, KB, JESS][b]; const o = P[id]; if (run > .15 + b * .04) bub(b, ['PANTS', 'HA HA', 'PODCAST', 'YOU', 'NO YOU', 'GATE B'][b], o.x + (b % 2 ? 1.0 : -1.0), 3.3 - (b % 3) * .15, o.z - .3); }
          puffs.forEach((m, k) => { m.visible = run < 2.2; const zz = Math.max(14, 40 - 9.5 * run) + k * 1.3; m.position.set(-4 + k * .9, .5, zz + (k % 3)); m.scale.setScalar(.4 + run * .7); m.material.opacity = Math.max(0, .55 - run * .2); });
        }
        const sh = run > 0 ? Math.sin(run * 40) * .04 * clamp(run * 2) : 0;
        cam = [sh, 1.55 + sh, 3.4, .2, 2.0, 30, 54]; if (!quiet) cam = [sh, 1.65, 4.4, 0, 2.0, 30, 54];
        const hrs = quiet ? Math.min(60, Math.floor(u * 60)) : 60;
        const castN = run > 0 ? Math.min(14, Math.floor(run * 16) + 1) : 0;
        cnt = quiet ? ['Silence', '0:' + String(hrs).padStart(2, '0'), 'hours with no drama', 'BIOS COME TRUE', false] : ['Cast on this street', String(run > 0 ? 14 : 0), 'the entire cast', 'BIOS COME TRUE', true];
        if (quiet && u >= 1) cnt[1] = '1:00';
        if (quiet) { cnt[0] = 'Silence'; cnt[1] = (u >= 1 ? '1:00' : '0:' + String(hrs).padStart(2, '0')); }
      }
    }
    crowd.update(t);
    // props that follow bodies
    if (chadPantsOn === 'short') chadPants(P[CHAD], .5); else if (chadPantsOn === 'chad') chadPants(P[CHAD], .5);
    if (cartOn) { attach(cart, P[JESS], 'torso', [0, 0, 0]); cart.visible = true; }
    browsOn.forEach((id, j) => browOn(P[id], j * 2)); if (bi === 5) { /* handled above */ }
    if (bi === 5) { const two = lt > 3.2; if (two) { browOn(P[KA], 0); browOn(P[KB], 2); } else if (lt > 2.6) browOn(P[KA], 0); }
    if (dishOn) { const o = P[dishOn.who === 'brad' ? BRAD : BRAD]; const g = dishOn.g; const ovs = 1 + (g < 1 ? Math.sin(g * Math.PI) * .25 : 0); dishes.forEach((d, j) => { const sd = j ? 1 : -1; attach(d, o, 'head', [sd * .42, .02, 0], [0, 0, -sd * (Math.PI / 2 - .35) + 0]); d.matrix.multiply(new THREE.Matrix4().makeRotationY(sd * dishOn.sway * 1.0)); scaled(d, Math.max(.001, g * ovs) * .95, Math.max(.001, g * ovs) * .95, Math.max(.001, g * ovs) * .95); d.visible = g > .01; d.traverse((m) => { if (m !== d) m.visible = true; }); }); }
    st.cam(...cam); st.follow(cam[3], cam[5]);
    // camera-facing sprites need camera set; reposition cards after camera
    cards.forEach((c) => { if (c.visible) c.quaternion.copy(st.camera.quaternion); }); if (bi === 0) { const ids = [CHAD, JESS, DAVE, BRAD, KA, SOME]; ids.forEach((id, k) => { const o = P[id]; cardAt(k, o.x, (id === CHAD ? 1.5 : 1.7) * o.scale * 1.0 + 1.4, o.z, .78, lt + k); }); }
    st.render();
    const bioN = [0, 1, 2, 3, 4, 5, 6][bi];
    hud.style('C'); hud.question(bi === 0 ? 'What if every dating app *bio* became physically true?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter(cnt[0], cnt[1], cnt[2], cnt[3], cnt[4]); hud.tm('');
    hud.pop(POP[bi] && lt > POPT[bi] ? POP[bi] : '', Math.min(1, (lt - POPT[bi]) * 6));
  } };
}
