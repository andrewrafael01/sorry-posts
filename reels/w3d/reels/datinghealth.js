// What if every first date had a health bar? Candlelit restaurant table, two blocky people, two HP bars that take damage each beat.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, mat, Crowd, clamp, smooth, lerp, attach, tri } = lib;
  const st = makeStage({ shadowExtent: 12, fogNear: 60, fogFar: 200, sunDir: [-.3, .75, -.8], sunI: 1.5, sunColor: 0xffd9a8, clouds: false, exposure: 1.0 }); const S = st.scene;
  st.hemi.intensity = .5; st.sky.visible = false; S.background = new THREE.Color(0x1a0f10); S.fog = null;
  const K = 1.2, PX = 1.6, TOPY = 1.24;
  const starts = tl.beats.map((b) => b.start);
  const easeBack = (u) => { u = clamp(u); const c1 = 1.9; return 1 + (c1 + 1) * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
  const mk = (geo, m, x = 0, y = 0, z = 0, parent = S, cast = true) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = cast; o.receiveShadow = true; parent.add(o); return o; };
  const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const mkSign = (w, h, cw, ch, draw, o = {}) => { const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const g = cv.getContext('2d'); draw(g, cw, ch); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; if (o.nearest) { tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter; } const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: !!o.transparent, side: o.side || THREE.FrontSide, depthWrite: !o.transparent })); S.add(m); return { m, g, tex, cv }; };
  const mkSprite = (w, h, cw, ch, draw) => { const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const g = cv.getContext('2d'); draw(g, cw, ch); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false })); sp.scale.set(w, h, 1); sp.renderOrder = 20; sp.visible = false; S.add(sp); return { sp, g, tex, cv }; };

  // ---- people
  const crowd = new Crowd(S, 3, 33); const P = crowd.p;
  const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  const dress = (i, shirt, pants, skin, hair) => { ['torso', 'armL', 'armR'].forEach((k) => col(i, k, shirt)); ['legL', 'legR'].forEach((k) => col(i, k, pants)); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(i, k, skin)); col(i, 'hair', hair); };
  const HIM = 0, HER = 1, WAIT = 2;
  dress(HIM, 0x2f6fd8, 0x2f3340, 0xe7b48f, 0x2a1d12); dress(HER, 0xd8456f, 0x2a2a38, 0xf0c7a4, 0x5a2f1a); dress(WAIT, 0xf4f4f4, 0x15151a, 0xc98e63, 0x15100c);
  P.forEach((o) => { o.h = 1; });
  const place = (i, x, z, yaw, anim = 'idle', o = {}) => { const p = P[i]; p.x = x; p.z = z; p.yaw = yaw; p.anim = anim; p.y = o.y || 0; p.speed = o.sp ?? 1; p.scale = o.sc ?? K; p.vis = true; p.pitch = o.pitch || 0; p.arms = o.arms || null; p.extra = 0; p.lie = o.lie || 0; };
  const YH = Math.PI + .65, YS = Math.PI - .65;
  const seatHim = (o = {}) => place(HIM, PX, 0, YH, 'sit', o); const seatHer = (o = {}) => place(HER, -PX, 0, YS, 'sit', o);

  // ---- restaurant
  mk(box(40, .2, 30), mat(0x3b2415, { roughness: .6 }), 0, -.1, 3, S, false);
  mk(box(40, 14, .4), mat(0x6e1f2a, { roughness: .9 }), 0, 7, 4.2, S, false);
  mk(box(40, 1.5, .5), mat(0x3a1a14, { roughness: .7 }), 0, .75, 4.0, S, false);
  mk(box(.4, 14, 30), mat(0x5a1a24), -10, 7, 3, S, false); mk(box(.4, 14, 30), mat(0x5a1a24), 10, 7, 3, S, false);
  const woodM = mat(0x5a3a22, { roughness: .5 }), clothM = mat(0xf2ead8, { roughness: .9 });
  mk(box(2 * 1.15, .08, 1.6), clothM, 0, TOPY - .04, 0); mk(box(2 * 1.2, .5, .04), clothM, 0, TOPY - .3, -.8); mk(box(.2, TOPY - .08, .2), woodM, 0, (TOPY - .08) / 2, 0, S, false);
  for (const sx of [-1, 1]) {
    const cx = sx * PX; mk(box(1.0, .1, 1.0), woodM, cx, .74, 0); mk(box(.1, .8, 1.0), woodM, cx + sx * .5, 1.15, 0); mk(box(.1, .72, .1), woodM, cx - .4, .36, -.4, S, false); mk(box(.1, .72, .1), woodM, cx - .4, .36, .4, S, false); mk(box(.1, .72, .1), woodM, cx + .45, .36, -.4, S, false); mk(box(.1, .72, .1), woodM, cx + .45, .36, .4, S, false);
    mk(new THREE.CylinderGeometry(.34, .34, .03, 24), mat(0xffffff, { roughness: .3 }), sx * .62, TOPY + .015, -.15);
    mk(new THREE.CylinderGeometry(.045, .05, .03, 10), mat(0xdddddd), sx * .9, TOPY + .015, .3); mk(new THREE.CylinderGeometry(.01, .01, .22, 6), mat(0xdddddd), sx * .9, TOPY + .12, .3);
    mk(new THREE.CylinderGeometry(.09, .06, .16, 12), new THREE.MeshStandardMaterial({ color: 0xcfe6ff, transparent: true, opacity: .45, roughness: .1 }), sx * .9, TOPY + .1, .3, S, false);
  }
  // chair that can tip (her chair)
  // candle + light
  mk(new THREE.CylinderGeometry(.07, .08, .34, 12), mat(0xfff0c8), 0, TOPY + .17, .35);
  const flame = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffc450 })); flame.scale.y = 1.7; flame.position.set(0, TOPY + .42, .35); S.add(flame);
  const candle = new THREE.PointLight(0xff9a45, 5, 14, 1.6); candle.position.set(0, TOPY + .7, .1); S.add(candle);
  const fill = new THREE.PointLight(0xffd9b0, 14, 16, 1.4); fill.position.set(0, 5.5, -4); S.add(fill);
  const phoneLight = new THREE.PointLight(0x7ab8ff, 0, 5, 1.8); S.add(phoneLight);
  // wall lamps
  for (const sx of [-6, -3, 3, 6]) { const l = new THREE.Mesh(new THREE.SphereGeometry(.18, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffd48a })); l.position.set(sx, 4.6, 3.9); S.add(l); }
  // wall clock
  const clock = new THREE.Group(); clock.position.set(0, 5.9, 3.95); S.add(clock);
  { const f = mkSign(2.0, 2.0, 400, 400, (g) => { g.fillStyle = '#16181d'; g.beginPath(); g.arc(200, 200, 198, 0, 7); g.fill(); g.fillStyle = '#fbf6e8'; g.beginPath(); g.arc(200, 200, 178, 0, 7); g.fill(); g.fillStyle = '#16181d'; for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; g.save(); g.translate(200 + Math.sin(a) * 150, 200 - Math.cos(a) * 150); g.rotate(a); g.fillRect(-5, -14, 10, 28); g.restore(); } }, { transparent: true }); S.remove(f.m); f.m.rotation.y = Math.PI; clock.add(f.m); }
  const hHand = mk(box(.1, .6, .04).translate(0, .3, 0), mat(0x16181d), 0, 0, -.04, clock, false), mHand = mk(box(.07, .85, .04).translate(0, .42, 0), mat(0x16181d), 0, 0, -.06, clock, false);
  const clockSign = mkSign(3.4, .7, 680, 140, (g, w, h) => { g.fillStyle = '#16181d'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd92a'; g.font = '900 78px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('DATE AT 7:00', w / 2, 100); }); clockSign.m.rotation.y = Math.PI; clockSign.m.position.set(0, 4.55, 3.93);
  const setClock = (hr, mn) => { hHand.rotation.z = (hr / 12) * Math.PI * 2; mHand.rotation.z = (mn / 60) * Math.PI * 2; };
  // TV with the ex
  const tvG = new THREE.Group(); tvG.position.set(.6, 3.9, 3.85); S.add(tvG);
  mk(box(5.0, 3.5, .15), mat(0x0e0e12), 0, 0, 0, tvG, false);
  { const ex = mkSign(4.7, 3.2, 940, 640, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#ffb3d1'); gr.addColorStop(1, '#ff6fa3'); g.fillStyle = gr; g.fillRect(0, 0, w, h); const heart = (x, y, s, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(x, y + s * .35); g.bezierCurveTo(x - s, y - s * .3, x - s * .5, y - s * .95, x, y - s * .45); g.bezierCurveTo(x + s * .5, y - s * .95, x + s, y - s * .3, x, y + s * .35); g.fill(); }; [[120, 110, 70], [820, 90, 90], [110, 500, 60], [840, 480, 80], [700, 300, 50]].forEach((a) => heart(a[0], a[1], a[2], 'rgba(255,255,255,.55)'));
    g.fillStyle = '#6b3a1e'; g.beginPath(); g.ellipse(470, 250, 190, 230, 0, 0, 7); g.fill(); g.fillRect(280, 250, 380, 330); g.fillStyle = '#e8a43a'; g.fillRect(250, 520, 440, 140); g.fillStyle = '#f2c9a8'; g.beginPath(); g.ellipse(470, 260, 130, 160, 0, 0, 7); g.fill(); g.fillStyle = '#22262c'; g.fillRect(410, 235, 18, 34); g.fillRect(516, 235, 18, 34); g.fillStyle = '#c0304a'; g.beginPath(); g.moveTo(400, 330); g.quadraticCurveTo(470, 405, 540, 330); g.quadraticCurveTo(470, 365, 400, 330); g.fill();
    g.fillStyle = '#fff'; g.font = '900 70px Liberation Sans, Arial'; g.textAlign = 'center'; g.strokeStyle = '#a2234f'; g.lineWidth = 10; g.strokeText('JESSICA 2019', 470, 612); g.fillText('JESSICA 2019', 470, 612); }); S.remove(ex.m); ex.m.rotation.y = Math.PI; ex.m.position.set(0, 0, -.09); tvG.add(ex.m); }
  tvG.visible = false;

  // ---- HP bars (sprites)
  const mkBar = () => { const cv = document.createElement('canvas'); cv.width = 520; cv.height = 190; const g = cv.getContext('2d'); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false })); sp.scale.set(1.9, 190 / 520 * 1.9, 1); sp.renderOrder = 10; sp.visible = false; S.add(sp); return { cv, g, tex, sp }; };
  const bars = [mkBar(), mkBar()]; const NAMES = ['HIM', 'HER'];
  const drawBar = (b, name, hp, chip, flash, shown) => {
    const g = b.g; g.clearRect(0, 0, 520, 190); g.fillStyle = flash ? '#ffffff' : '#101319'; g.strokeStyle = '#fff'; g.lineWidth = 10; g.beginPath(); g.roundRect(8, 8, 504, 174, 26); g.fill(); g.stroke();
    g.fillStyle = flash ? '#101319' : '#ffffff'; g.font = '900 54px Liberation Mono, monospace'; g.textAlign = 'left'; g.fillText(name, 34, 70); g.textAlign = 'right'; g.fillText('HP ' + Math.round(hp), 488, 70);
    g.fillStyle = '#2a2f3a'; g.fillRect(34, 98, 452, 58); const w = 452; g.fillStyle = '#ff3b3b'; g.fillRect(34, 98, w * clamp(chip / 100), 58); const c = hp > 55 ? '#3be04a' : hp > 25 ? '#ffd02a' : '#ff3b3b'; g.fillStyle = c; g.fillRect(34, 98, w * clamp(hp / 100), 58); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(34, 98, w * clamp(hp / 100), 12); g.fillStyle = '#101319'; for (let k = 1; k < 10; k++) g.fillRect(34 + w * k / 10 - 2, 98, 4, 58);
    b.tex.needsUpdate = true;
  };
  // hp timeline in absolute time
  const EV = [[1, 1.5, 0, 10], [2, 1.65, 1, 40], [3, 1.85, 1, 50], [4, 1.6, 1, 10]].map(([bi, lt, who, d]) => ({ T: starts[bi] + lt, who, d, bi }));
  const R0 = starts[6] + .5;
  const base = (who, T) => { let v = 100; for (const e of EV) if (e.who === who) { const u = clamp((T - e.T) / .4); v -= e.d * smooth(u); } return v; };
  const hpOf = (who, T) => { const b = base(who, T); if (T <= R0) return b; return lerp(base(who, R0), 100, smooth(clamp((T - R0) / .7))); };
  const chipOf = (who, T) => { const h = hpOf(who, T); const c = hpOf(who, T - .55); return Math.max(h, c); };
  // damage numbers
  const dmg = EV.map((e) => mkSprite(1.5, .85, 300, 170, (g) => { g.font = '900 130px Liberation Sans, Arial'; g.textAlign = 'center'; g.lineWidth = 22; g.strokeStyle = '#111'; g.lineJoin = 'round'; g.strokeText('-' + e.d, 150, 125); g.fillStyle = '#ff2d2d'; g.fillText('-' + e.d, 150, 125); }));
  // bubbles
  const mkBub = () => { const cv = document.createElement('canvas'); cv.width = 512; cv.height = 256; const g = cv.getContext('2d'); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false })); sp.renderOrder = 15; sp.visible = false; S.add(sp); let cur = null; return { show(text, x, y, z, w = 2.2) { if (text !== cur) { cur = text; g.clearRect(0, 0, 512, 256); g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 9; g.beginPath(); g.roundRect(10, 10, 492, 190, 34); g.fill(); g.stroke(); g.beginPath(); g.moveTo(230, 198); g.lineTo(256, 250); g.lineTo(290, 198); g.fill(); g.fillStyle = '#111'; g.font = '800 62px Liberation Sans, Arial'; g.textAlign = 'center'; const L = text.split('\n'); L.forEach((l, i) => g.fillText(l, 256, 105 + (i - (L.length - 1) / 2) * 68 + 22)); tex.needsUpdate = true; } const lim = 2.0 - w / 2; x = Math.max(-lim, Math.min(lim, x)); sp.position.set(x, y, z); sp.scale.set(w, w / 2, 1); sp.visible = true; }, hide() { sp.visible = false; } }; };
  const bubs = [mkBub(), mkBub(), mkBub()];
  // props
  const menu = new THREE.Group(); { const cvr = mk(box(.8, 1.0, .05), mat(0x7a1c1c), 0, 0, 0, menu); const mf = mkSign(.7, .9, 280, 360, (g, w, h) => { g.fillStyle = '#f7f0dc'; g.fillRect(0, 0, w, h); g.fillStyle = '#16181d'; g.font = '900 50px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('MENU', w / 2, 60); g.font = '700 34px Liberation Sans, Arial'; ['Steak  $48', 'Pasta  $32', 'Salad  $14', 'Soup  $11'].forEach((l, i) => g.fillText(l, w / 2, 130 + i * 56)); g.strokeStyle = '#e8252b'; g.lineWidth = 7; g.beginPath(); g.ellipse(w / 2, 130 + 2 * 56 - 11, 112, 28, 0, 0, 7); g.stroke(); }); S.remove(mf.m); mf.m.rotation.y = Math.PI; mf.m.position.z = -.03; menu.add(mf.m); menu.position.set(.55, TOPY + .5, -.4); menu.rotation.x = -.15; S.add(menu); }
  const pad = mk(box(.28, .38, .03), mat(0xf6f6f0), 0, 0, 0, S, false); pad.visible = false;
  const mkPhone = () => { const g = new THREE.Group(); mk(box(.36, .66, .04), mat(0x15181f), 0, 0, 0, g, false); const sc = mkSign(.32, .6, 160, 300, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#e9f4ff'); gr.addColorStop(1, '#7ab8ff'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#2f6fd8'; for (let i = 0; i < 4; i++) c.fillRect(14, 20 + i * 70, 132, 52); }); S.remove(sc.m); sc.m.position.z = .021; g.add(sc.m); g.visible = false; S.add(g); return g; };
  const phone = mkPhone();
  const overBanner = (txt, w, h, col1, col2) => mkSprite(w, h, 1024, Math.round(1024 * h / w), (g, cw, ch) => { g.imageSmoothingEnabled = false; const lo = document.createElement('canvas'); lo.width = 128; lo.height = Math.round(128 * ch / cw); const l = lo.getContext('2d'); l.font = 'bold 21px Liberation Mono, monospace'; l.textAlign = 'center'; l.textBaseline = 'middle'; const cy = lo.height / 2 + 1; l.fillStyle = '#000'; l.fillText(txt, 65, cy + 2); l.fillText(txt, 63, cy + 2); l.fillStyle = col2; l.fillText(txt, 64, cy + 1.5); l.fillStyle = col1; l.fillText(txt, 64, cy); g.drawImage(lo, 0, 0, cw, ch); });
  const over = overBanner('GAME OVER', 6.2, 1.8, '#ff3030', '#7a0a0a'), resp = overBanner('RESPAWN', 5.2, 1.5, '#4cff7a', '#0b6a2a');
  const NC = 260; const conf = new THREE.InstancedMesh(new THREE.BoxGeometry(.2, .03, .13), new THREE.MeshBasicMaterial({ color: 0xffffff }), NC); conf.frustumCulled = false; conf.visible = false; S.add(conf);
  const CF = Array.from({ length: NC }, (_, i) => { const r = (a) => { const v = Math.sin(i * 12.9898 + a * 78.233) * 43758.5453; return v - Math.floor(v); }; return { vx: (r(1) - .5) * 9, vy: 6 + r(2) * 7, vz: (r(3) - .3) * 4, ph: r(4) * 6.28, sp: 2.5 + r(5) * 4 }; });
  { const cc = [0xff3b6b, 0xffd92a, 0x4cd9a0, 0x5b8cff, 0xff9a3c, 0xffffff]; CF.forEach((c, i) => conf.setColorAt(i, new THREE.Color(cc[i % 6]))); conf.instanceColor.needsUpdate = true; }
  // check cards (two halves)
  const mkHalf = (side) => { const g = new THREE.Group(); const m = mk(box(.55, .85, .04), mat(0xfbf6e6), 0, 0, 0, g, false); const sg = mkSign(.5, .8, 200, 320, () => {}); S.remove(sg.m); sg.m.rotation.y = Math.PI; sg.m.position.z = -.025; g.add(sg.m); g.visible = false; S.add(g); return { g, sg, shown: '' }; };
  const halves = [mkHalf(-1), mkHalf(1)];
  const drawHalf = (h, side, txt) => { if (h.shown === txt) return; h.shown = txt; const g = h.sg.g; g.fillStyle = '#fbf6e6'; g.fillRect(0, 0, 200, 320); g.fillStyle = '#16181d'; g.font = '900 38px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText(side < 0 ? 'CHECK' : 'THE', 100, 62); g.fillStyle = '#c3b99a'; g.fillRect(24, 90, 152, 5); g.font = '900 54px Liberation Sans, Arial'; g.fillStyle = '#d02828'; g.fillText(txt, 100, 200); g.fillStyle = '#16181d'; g.font = '700 28px Liberation Sans, Arial'; g.fillText(txt === '$186' ? 'total' : 'each', 100, 262); h.sg.tex.needsUpdate = true; };
  const weed = new THREE.Group(); { const wm = new THREE.MeshStandardMaterial({ color: 0xc9a25a, roughness: 1, wireframe: true }); const a = new THREE.Mesh(new THREE.IcosahedronGeometry(.6, 1), wm), b = new THREE.Mesh(new THREE.IcosahedronGeometry(.45, 1), wm), c = new THREE.Mesh(new THREE.IcosahedronGeometry(.3, 0), wm); b.rotation.set(1, 2, 0); weed.add(a, b, c); weed.visible = false; S.add(weed); }
  { const sty = document.createElement('style'); sty.textContent = '#pop{-webkit-text-stroke:9px #111}'; document.head.appendChild(sty); }
  const POP = ['', 'ARRIVES LATE', 'ORDERS FOR HER', 'TALKS ABOUT HIS EX', 'CHECKS HIS PHONE', 'THE CHECK ARRIVES', 'SPLIT IT. RESPAWN.'];
  const POPT = [0, .15, .15, .12, .12, .12, .12];
  const lookTo = new THREE.Vector3();
  const BARY = 3.1;

  return { frame({ t, bi, lt }) {
    bi = Math.min(bi, 6);
    P.forEach((o) => { o.vis = false; o.arms = null; o.pitch = 0; o.lie = 0; o.y = 0; });
    bubs.forEach((b) => b.hide()); tvG.visible = false; phone.visible = false; pad.visible = false; over.sp.visible = false; resp.sp.visible = false; conf.visible = false; weed.visible = false; halves.forEach((h) => (h.g.visible = false)); dmg.forEach((d) => (d.sp.visible = false)); menu.visible = bi === 2;
    phoneLight.intensity = 0; fill.intensity = 14; candle.intensity = 5 + Math.sin(t * 17) * .6 + Math.sin(t * 29) * .4; flame.scale.set(1 + Math.sin(t * 23) * .1, 1.7 + Math.sin(t * 19) * .25, 1);
    let cam = [0, 2.9, -8.4, 0, .95, 0, 58]; let shake = 0; let shown = [1, 1]; let hit = [0, 0];
    const u = smooth(clamp(lt / 3));
    setClock(7, 0); clockSign.m.visible = bi <= 1;
    seatHim(); seatHer(); const cc = [0, 0, 0]; let herLie = 0, herY = 0, herX = 0;
    let tipChair = 0;
    if (bi === 0) {
      P[HIM].arms = { lx: -.9, rx: -.5 + Math.sin(t * 3) * .12, lz: 0, rz: 0 }; P[HER].arms = { lx: -.5, rx: -.9, lz: 0, rz: 0 };
      shown = [easeBack((lt - 3.0) / .45), easeBack((lt - 3.15) / .45)];
      cam = [lerp(-.3, .3, u), 2.9, lerp(-9.0, -8.2, u), 0, .95, 0, 58];
      setClock(7, 0);
    } else if (bi === 1) {
      const rt = clamp(lt / 1.1); const arrived = lt >= 1.1;
      if (!arrived) place(HIM, lerp(5.2, PX + .2, rt), 0, lerp(-Math.PI / 2 + .1, YH, rt * rt), 'run', { sp: 1.2 }); else seatHim({ pitch: Math.max(0, .2 - (lt - 1.1) * .6) });
      P[HER].arms = { lx: -.5 - .5 * (Math.sin(t * 7) > 0 ? 1 : 0), rx: -.5, lz: 0, rz: 0 }; // tapping the watch
      if (lt > .25 && lt < 1.3) bubs[0].show('SORRY!!', P[HIM].x, 4.45, -.2, 1.9);
      if (lt > .4) { bubs[1].show('7:40...', -PX, 4.45, -.2, 1.9); }
      setClock(7, 40);
      cam = [lerp(-.8, .2, u), 2.9, -8.4, lerp(-.5, 0, u), .95, 0, 58];
      shown = [1, 1]; shake = (lt > 1.5 ? .05 * Math.exp(-(lt - 1.5) * 6) : 0);
    } else if (bi === 2) {
      const wu = smooth(clamp(lt / .7)); place(WAIT, -.4, lerp(3.2, 1.1, wu), Math.PI, wu < 1 ? 'walk' : 'idle', { sc: K * 1.0 });
      pad.visible = true; attach(pad, P[WAIT], 'handL', [0, .15, .12], [1.2, 0, 0]);
      const pt = lt > .9;
      P[HIM].arms = { lx: -.4, rx: pt ? -1.55 : -.6, lz: 0, rz: pt ? -.35 : 0 }; seatHim({ arms: P[HIM].arms });
      if (lt > .9) bubs[0].show("She'll have\nthe salad.", PX + .4, 4.45, -.3, 2.6);
      P[HER].arms = { lx: lt > 1.65 ? -2.4 : -.5, rx: lt > 1.65 ? -2.4 : -.9, lz: 0, rz: 0 }; seatHer({ arms: P[HER].arms });
      if (lt > 1.7) bubs[1].show('EXCUSE ME?!', -PX, 4.45, -.3, 2.2);
      cam = [lerp(.5, -.2, u), 2.9, lerp(-8.6, -8.0, u), 0, .95, 0, 58];
      shake = lt > 1.65 ? .22 * Math.exp(-(lt - 1.65) * 5) : 0;
    } else if (bi === 3) {
      const tu = easeBack((lt - .25) / .5); tvG.visible = tu > .02; tvG.scale.setScalar(Math.max(.01, tu));
      const gest = Math.sin(t * 5);
      seatHim({ arms: { lx: -1.3 + gest * .4, rx: -1.3 - gest * .4, lz: .3, rz: -.3 } });
      const sl = smooth(clamp((lt - 1.6) / 1.2));
      seatHer({ pitch: sl * .5, arms: { lx: -.6, rx: -.9, lz: 0, rz: 0 } });
      bubs[0].show(lt < 1.5 ? 'My ex...' : 'Anyway, my ex', PX, 4.45, -.3, lt < 1.5 ? 1.9 : 2.5);
      cam = [lerp(.2, -.4, u), 2.7, lerp(-8.4, -7.7, u), -.3, 1.1, 0, 58];
      shake = lt > 1.85 ? .14 * Math.exp(-(lt - 1.85) * 5) : 0;
    } else if (bi === 4) {
      const pu = smooth(clamp(lt / .5)); const go = lt > 1.6;
      seatHim({ pitch: .25 * pu, arms: { lx: -.3, rx: -1.65 * pu - .3 * (1 - pu), lz: .05, rz: 0 } });
      phone.visible = true; attach(phone, P[HIM], 'handR', [0, .22, .1], [1.55, 0, 0]); phone.matrix.multiply(new THREE.Matrix4().makeRotationY(Math.PI));
      phoneLight.intensity = 60 * pu; phoneLight.position.set(PX + .55, 2.35, -1.4);
      const fall = smooth(clamp((lt - 1.95) / .6));
      seatHer({ pitch: lt > 1.0 ? .3 : 0, arms: { lx: -.5, rx: -.9, lz: 0, rz: 0 } });
      if (fall > 0) { place(HER, -PX - 1.1 * fall, 0, YS, 'sit', { lie: -1.5 * fall, y: .25 * fall }); tipChair = fall; }
      if (go) { over.sp.visible = true; const gu = easeBack((lt - 1.6) / .35); over.sp.scale.set(4.4 * Math.max(.01, gu), 1.28 * Math.max(.01, gu), 1); over.sp.position.set(0, 5.0, 0); }
      cam = [lerp(-.6, -.2, u), 2.8, lerp(-8.1, -7.4, u), -.2, 1.0, 0, 58];
      shake = go ? .3 * Math.exp(-(lt - 1.6) * 4) : 0;
      if (go) { fill.intensity = 6; candle.intensity *= .6; }
    } else if (bi === 5) {
      seatHim({ pitch: .1, arms: { lx: -.5, rx: -.5, lz: 0, rz: 0 } }); seatHer({ pitch: .5, arms: { lx: -.3, rx: -.3, lz: 0, rz: 0 } });
      const dr = easeBack((lt - .15) / .4);
      halves.forEach((h, k) => { h.g.visible = dr > .02; drawHalf(h, k ? 1 : -1, '$186'); const side = k ? 1 : -1; h.g.position.set(side * .275, TOPY + .43 + (1 - Math.min(1, dr)) * 1.8, -.4); h.g.rotation.set(-.2, 0, 0); h.g.scale.setScalar(Math.max(.01, dr)); });
      weed.visible = lt > .4; { const wu = (lt - .4) / 2.4; weed.position.set(lerp(-3.4, 3.4, wu), .7 + Math.abs(Math.sin(wu * 13)) * .5, -2.4); weed.rotation.z = -wu * 20; weed.rotation.y = wu * 3; }
      if (lt > .8) bubs[0].show('...', PX, 4.45, -.3, 1.2); if (lt > 1.4) bubs[1].show('...', -PX, 4.45, -.3, 1.2);
      const spin = lt > .1 ? (lt - .1) * 9 : 0; setClock(7 + spin * .3, spin * 12); clockSign.m.visible = false;
      cam = [lerp(.3, -.3, u), 2.9, lerp(-8.4, -7.6, u), 0, .95, 0, 58];
    } else {
      const jm = lt > .8; const jt = lt - .8;
      const j = (id, x) => place(id, x, 0, id === HIM ? YH : YS, jm ? 'jump' : 'sit', { y: 0, sp: .9 });
      if (!jm) { seatHim({ pitch: .1 }); seatHer({ pitch: .3 }); } else { place(HIM, PX, -.9, YH, 'jump', { sp: .9 }); place(HER, -PX, -.9, YS, 'jump', { sp: .9 }); P[HIM].phase = 0; P[HER].phase = 1; }
      halves.forEach((h, k) => { const side = k ? 1 : -1; h.g.visible = true; drawHalf(h, side, '$93'); const sep = smooth(clamp((lt - .1) / .5)); h.g.position.set(side * (.275 + sep * .55), TOPY + .43, -.4 - sep * .1); h.g.rotation.set(-.2, 0, side * sep * .15); h.g.scale.setScalar(1); });
      if (lt > .75) { conf.visible = true; const bt = lt - .75; const tmx = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc3 = new THREE.Vector3(1, 1, 1), pos = new THREE.Vector3();
        CF.forEach((c, i) => { const y = 1.6 + c.vy * bt - 4.2 * bt * bt; const x = c.vx * bt * .8 + Math.sin(t * 3 + c.ph) * .2; const z = c.vz * bt - 1; const fl = y > .03; e.set(fl ? t * c.sp + c.ph : 0, c.ph, fl ? t * c.sp * .7 : 0); q.setFromEuler(e); pos.set(x, Math.max(.03, y), z); tmx.compose(pos, q, sc3); conf.setMatrixAt(i, tmx); }); conf.instanceMatrix.needsUpdate = true; }
      if (lt > 1.1) { resp.sp.visible = true; const gu = easeBack((lt - 1.1) / .35); resp.sp.scale.set(4.0 * Math.max(.01, gu), 1.15 * Math.max(.01, gu), 1); resp.sp.position.set(0, 4.2, 0); }
      setClock(7, 0); clockSign.m.visible = false;
      cam = [lerp(.2, -.3, u), 2.9, lerp(-8.6, -8.0, u), 0, .95, 0, 58];
      shake = lt > 1.1 ? .08 * Math.exp(-(lt - 1.1) * 5) : 0;
    }
    cam[0] *= .2; cam[3] *= .2; cam[2] -= .6; cam[4] += .55; cam[6] = 54;
    // HP bars
    const T = t; const bx = [1.2, -1.2];
    for (let k = 0; k < 2; k++) {
      const b = bars[k]; const hp = hpOf(k, T), ch = chipOf(k, T); let fl = false; for (const e of EV) if (e.who === k && T > e.T && T < e.T + .3) fl = Math.floor((T - e.T) * 20) % 2 === 0;
      const sh = shown[k]; b.sp.visible = sh > .02; const sc = Math.max(.01, sh); b.sp.scale.set(1.9 * sc, 190 / 520 * 1.9 * sc, 1);
      let jx = 0; for (const e of EV) if (e.who === k && T > e.T && T < e.T + .4) jx = Math.sin((T - e.T) * 90) * .1 * (1 - (T - e.T) / .4);
      b.sp.position.set(bx[k] + jx, BARY, -.5);
      drawBar(b, NAMES[k], hp, ch, fl, sh);
    }
    EV.forEach((e, i) => { if (e.bi !== bi) return; const a = T - e.T; if (a < -.05 || a > 1.1) return; const d = dmg[i]; d.sp.visible = true; const pu = easeBack(a / .22); d.sp.scale.set(2.0 * Math.max(.01, pu), 1.13 * Math.max(.01, pu), 1); d.sp.position.set(bx[e.who] + (e.who ? .5 : -.5), BARY + .75 + Math.max(0, a) * .8, -.5); d.sp.material.opacity = 1 - smooth(clamp((a - .7) / .4)); });
    // her chair tipping
    st.follow(0, 0);
    crowd.update(t);
    const sx = Math.sin(t * 83) * shake, sy = Math.cos(t * 71) * shake * .6;
    st.cam(cam[0] + sx, cam[1] + sy, cam[2], cam[3], cam[4], cam[5], cam[6]);
    st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if every first date had a *health bar*?' : '', bi === 0 ? 1 : 0); hud.counter('', '', ''); hud.tm('');
    hud.pop(bi ? POP[bi] : '', Math.min(1, Math.max(0, (lt - POPT[bi]) * 8)));
  } };
}
