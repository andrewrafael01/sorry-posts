// What if your ex got a notification every time you looked at their profile? Two apartments in cutaway: you (left, in bed with your phone) and her (right).
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, mat, Crowd, clamp, smooth, lerp, attach, addBox } = lib;
  const st = makeStage({ shadowExtent: 26, fogNear: 80, fogFar: 300, sunDir: [-.4, .9, -.7], sunI: 2.2, clouds: false }); const S = st.scene;
  const easeBack = (u) => { u = clamp(u); const c1 = 1.9; return 1 + (c1 + 1) * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
  const mkSign = (w, h, cw, ch, draw, o = {}) => { const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const g = cv.getContext('2d'); draw(g, cw, ch); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: !!o.transparent, side: o.side || THREE.FrontSide, depthWrite: !o.transparent })); S.add(m); return { m, g, tex, cv, w: cw, h: ch }; };
  const FONT = 'Liberation Sans, Arial';
  const LX = 3.2, RX = -3.2, BZ = 4.0, FZ = -1.6, WH = 3.5;

  // ---------------- world
  const gnd = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), mat(0x5d6a52, { roughness: 1 })); gnd.rotation.x = -Math.PI / 2; gnd.position.y = -.05; gnd.receiveShadow = true; S.add(gnd);
  const street = addBox(S, 10.6, -.02, 10, 4.6, .04, 120, 0x34373e, { cast: false }); for (let k = 0; k < 24; k++) addBox(S, 10.6, .01, -8 + k * 4, .15, .02, 1.6, 0xe8d36a, { cast: false });
  addBox(S, 7.6, -.02, 1.5, 2.2, .1, 6, 0xb9b3a6, { cast: false }); // hallway landing outside the door
  const mkRoom = (cx, floorC, wallC) => {
    addBox(S, cx, -.01, (BZ + FZ) / 2, 6, .12, BZ - FZ, floorC, { round: .02 });
    addBox(S, cx, WH / 2, BZ + .12, 6.2, WH, .24, wallC);
    addBox(S, cx, .12, BZ - .02, 6, .24, .08, 0xe8e8ec, { cast: false });
  };
  mkRoom(LX, 0xb98a58, 0x8d96b8); mkRoom(RX, 0xc9b49a, 0xc79ab0);
  addBox(S, 0, WH / 2, (BZ + FZ) / 2 + .1, .24, WH, BZ - FZ + .2, 0xd9d9e0); // party wall
  addBox(S, -6.1, WH / 2, (BZ + FZ) / 2 + .1, .2, WH, BZ - FZ + .2, 0xc79ab0); // her outer wall
  // your outer wall with a door gap at z in [1.3, 2.7]
  addBox(S, 6.2, WH / 2, (FZ + 1.3) / 2, .2, WH, 1.3 - FZ, 0x8d96b8); addBox(S, 6.2, WH / 2, (BZ + 2.7) / 2, .2, WH, BZ - 2.7, 0x8d96b8); addBox(S, 6.2, 2.85, 2.0, .2, WH - 2.85, 1.4, 0x8d96b8);
  const doorG = new THREE.Group(); doorG.position.set(6.2, 0, 2.7); S.add(doorG); { const leaf = addBox(doorG, 0, 1.3, -.7, .1, 2.6, 1.4, 0x7a4a2c, { cast: true }); addBox(doorG, -.07, 1.2, -1.2, .06, .1, .1, 0xd8b84a); const eye = addBox(doorG, -.07, 1.7, -.7, .05, .05, .05, 0x222222); }
  // window on her back wall + your back wall
  const winMat = new THREE.MeshStandardMaterial({ color: 0xbfd4ec, emissive: 0x7f9fc8, emissiveIntensity: .6 });
  const win = (x) => { const w = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.3, .06), winMat.clone()); w.position.set(x, 2.1, BZ - .04); S.add(w); addBox(S, x, 2.1, BZ - .08, 1.9, .06, .05, 0xf4f4f4); addBox(S, x, 2.1, BZ - .08, .06, 1.4, .05, 0xf4f4f4); return w; };
  const winL = win(LX + 1.7), winR = win(RX + 1.6);
  // bed builder (head against back wall)
  const mkBed = (cx, duvetC, name) => {
    const g = new THREE.Group(); S.add(g);
    addBox(g, cx, .3, 2.4, 2.8, .5, 3.4, 0x4a3524, { round: .05 }); addBox(g, cx, 1.0, BZ - .25, 2.9, 1.7, .16, 0x4a3524, { round: .04 }); addBox(g, cx, .62, 2.4, 2.65, .2, 3.25, 0xe9e9ee, { round: .08 });
    addBox(g, cx - .6, .85, BZ - .6, 1.0, .2, .5, 0xf6f6fa, { round: .1 }); addBox(g, cx + .6, .85, BZ - .6, 1.0, .2, .5, 0xf6f6fa, { round: .1 });
    const duv = addBox(g, cx, .86, 1.45, 2.75, .45, 2.2, duvetC, { round: .14 }); return { g, duv };
  };
  const bedL = mkBed(LX, 0x4d6faa), bedR = mkBed(RX, 0xd8788f);
  // furniture
  const nsL = addBox(S, LX - 2.0, .35, 3.5, .7, .7, .6, 0x6b4a30, { round: .03 }); const nsR = addBox(S, RX + 2.0, .35, 3.5, .8, .7, .7, 0x6b4a30, { round: .03 });
  const lampL = new THREE.PointLight(0xffc27a, 6, 9, 1.6); lampL.position.set(LX - 2.0, 1.5, 3.4); S.add(lampL); const lampR = new THREE.PointLight(0xffb0c8, 6, 9, 1.6); lampR.position.set(RX + 2.0, 1.5, 3.4); S.add(lampR);
  for (const x of [LX - 2.0, RX + 2.0]) { addBox(S, x, .95, 3.5, .08, .5, .08, 0xd8c8a8); const sh = new THREE.Mesh(new THREE.CylinderGeometry(.2, .3, .35, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xffe0a8, emissive: 0xffc070, emissiveIntensity: .9, side: THREE.DoubleSide })); sh.position.set(x, 1.35, 3.5); S.add(sh); }
  const roomFill = new THREE.PointLight(0xffffff, 10, 16, 1.3); roomFill.position.set(0, 3.1, 0); S.add(roomFill);
  const rugL = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, .03, 32), mat(0xc0564f)); rugL.position.set(LX + .1, .04, .2); rugL.receiveShadow = true; S.add(rugL);
  const emptyG = new THREE.Group(); S.add(emptyG); { const sg = mkSign(1.6, .8, 400, 200, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#d83a3a'; g.fillRect(0, 0, w, 62); g.fillStyle = '#fff'; g.font = '900 52px ' + FONT; g.textAlign = 'center'; g.fillText('FOR RENT', w / 2, 50); g.fillStyle = '#16181d'; g.font = '800 40px ' + FONT; g.fillText('EMPTY', w / 2, 128); g.font = '700 28px ' + FONT; g.fillText('(it was you)', w / 2, 172); }); S.remove(sg.m); sg.m.position.set(LX - 1.5, 2.5, BZ - .1); sg.m.rotation.y = Math.PI; emptyG.add(sg.m); emptyG.visible = false; }
  // wall clock in her room (analog) + big digital readout sprite
  const clockG = new THREE.Group(); clockG.position.set(RX - .4, 2.9, BZ - .08); S.add(clockG);
  { const f = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .06, 28), mat(0x16181d)); f.rotation.x = Math.PI / 2; clockG.add(f); const fc = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, .07, 28), mat(0xfbf6e8)); fc.rotation.x = Math.PI / 2; fc.position.z = -.01; clockG.add(fc); }
  const hand = (len, w) => { const h = new THREE.Mesh(new THREE.BoxGeometry(w, len, .03), mat(0x16181d)); h.geometry.translate(0, len / 2, 0); h.position.z = -.06; clockG.add(h); return h; };
  const hH = hand(.25, .05), hM = hand(.38, .035);
  const digital = mkSign(2.8, 1.0, 560, 200, (g, w, h) => { g.fillStyle = '#0b0d12'; g.beginPath(); g.roundRect(4, 4, w - 8, h - 8, 28); g.fill(); g.strokeStyle = '#ff3b3b'; g.lineWidth = 8; g.stroke(); g.fillStyle = '#ff3b3b'; g.font = '900 120px ' + FONT; g.textAlign = 'center'; g.fillText('3:00 AM', w / 2, 142); }); digital.m.visible = false;

  // ---------------- people
  const cr = new Crowd(S, 1, 71); const crH = new Crowd(S, 2, 72); // 0 = you, her = crH[0], spare crH[1]
  const YOU = cr.p[0], HER = crH.p[0];
  const colr = (c, i, k, v) => { c.parts[k].setColorAt(i, new THREE.Color(v)); c.parts[k].instanceColor.needsUpdate = true; };
  const dress = (c, i, shirt, pants, skin, hair) => { ['torso', 'armL', 'armR'].forEach((k) => colr(c, i, k, shirt)); ['legL', 'legR'].forEach((k) => colr(c, i, k, pants)); ['head', 'neck', 'handL', 'handR'].forEach((k) => colr(c, i, k, skin)); colr(c, i, 'hair', hair); };
  dress(cr, 0, 0xe3bd54, 0x2f3a5c, 0xe7b48f, 0x2a1d12); dress(crH, 0, 0xf2d6e6, 0xf2d6e6, 0xf0c7a4, 0x5a2f1a);
  [YOU, HER].forEach((o) => { o.h = 1; o.vis = true; });
  crH.p[1].vis = false;
  // angry face for her
  crH.faces.angry = (() => { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 192; const g = cv.getContext('2d'); const eye = (x) => { g.fillStyle = '#f4f4f0'; g.fillRect(x - 22, 78, 44, 22); g.fillStyle = '#7a3a1a'; g.fillRect(x - 10, 80, 20, 20); g.fillStyle = '#10151c'; g.fillRect(x - 5, 84, 10, 12); }; eye(78); eye(178); g.fillStyle = '#2a170d'; g.save(); g.translate(78, 62); g.rotate(.45); g.fillRect(-34, -8, 68, 15); g.restore(); g.save(); g.translate(178, 62); g.rotate(-.45); g.fillRect(-34, -8, 68, 15); g.restore(); g.fillStyle = 'rgba(120,70,40,.28)'; g.fillRect(120, 90, 16, 40); g.fillStyle = '#7a1f2a'; g.beginPath(); g.moveTo(88, 166); g.quadraticCurveTo(128, 134, 168, 166); g.lineTo(160, 172); g.quadraticCurveTo(128, 148, 96, 172); g.fill(); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const nightGown = new THREE.Mesh(new THREE.CylinderGeometry(.34, .5, .95, 14), mat(0xf0d8ec, { roughness: .8 })); nightGown.castShadow = true; nightGown.visible = false; S.add(nightGown);

  // phones
  const mkPhone = (sw, sh, cw, ch, draw) => { const g = new THREE.Group(); const body = new THREE.Mesh(new lib.RoundedBoxGeometry(sw + .06, sh + .08, .05, 3, .03), mat(0x15181f)); body.castShadow = true; g.add(body); const sc = mkSign(sw, sh, cw, ch, draw); S.remove(sc.m); sc.m.position.z = -.03; sc.m.rotation.y = Math.PI; g.add(sc.m); const sc2 = mkSign(sw, sh, cw, ch, draw); S.remove(sc2.m); sc2.m.position.z = .03; g.add(sc2.m); g.visible = false; S.add(g); return { g, sc, sc2 }; };
  const drawProf = (g, w, h) => { g.fillStyle = '#fbfbfd'; g.fillRect(0, 0, w, h); g.fillStyle = '#ff7ab0'; g.fillRect(0, 0, w, h * .42); g.fillStyle = '#7a3a66'; g.beginPath(); g.arc(w / 2, h * .22, w * .2, 0, 7); g.fill(); g.fillStyle = '#f0c7a4'; g.beginPath(); g.arc(w / 2, h * .24, w * .15, 0, 7); g.fill(); g.fillStyle = '#16181d'; g.font = '900 ' + (w * .13) + 'px ' + FONT; g.textAlign = 'center'; g.fillText('Mia, 27', w / 2, h * .56); g.fillStyle = '#999'; g.fillRect(w * .12, h * .64, w * .76, 10); g.fillRect(w * .12, h * .7, w * .6, 10); g.fillStyle = '#ff3b6b'; g.beginPath(); g.arc(w / 2, h * .86, w * .1, 0, 7); g.fill(); };
  const youPhone = mkPhone(.26, .46, 208, 368, drawProf);
  const herPhone = mkPhone(.26, .46, 208, 368, (g, w, h) => { g.fillStyle = '#0b1220'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 60px ' + FONT; g.textAlign = 'center'; g.fillText('swipr', w / 2, h * .3); g.fillStyle = '#ff3b6b'; g.beginPath(); g.arc(w / 2, h * .6, 40, 0, 7); g.fill(); });
  // floating profile card (what you look at) + her notification banner
  const mkCard = () => mkSign(1.7, 2.39, 640, 900, (g) => { g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 28; g.shadowOffsetY = 10; g.fillStyle = '#fbfbfd'; g.beginPath(); g.roundRect(40, 30, 560, 840, 54); g.fill(); g.shadowColor = 'transparent'; g.save(); g.beginPath(); g.roundRect(40, 30, 560, 840, 54); g.clip(); const gr = g.createLinearGradient(0, 30, 640, 300); gr.addColorStop(0, '#ff7ab0'); gr.addColorStop(1, '#ffffff'); g.fillStyle = gr; g.fillRect(40, 30, 560, 250); g.restore(); g.fillStyle = '#d8456f'; g.beginPath(); g.roundRect(215, 205, 210, 130, [60, 60, 0, 0]); g.fill(); g.fillStyle = '#f0c7a4'; g.beginPath(); g.arc(320, 150, 70, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 10; g.beginPath(); g.arc(320, 150, 74, 0, 7); g.stroke(); g.fillStyle = '#16181d'; g.font = '800 64px ' + FONT; g.textAlign = 'center'; g.fillText('Mia, 27', 320, 400); g.fillStyle = '#d33a5a'; g.font = '700 26px ' + FONT; g.fillText('MY EX', 320, 446); g.fillStyle = '#16181d'; g.font = '900 italic 64px ' + FONT; g.fillText('“Not looking', 320, 560); g.fillText('for drama”', 320, 640); g.fillStyle = '#ff3b6b'; g.beginPath(); g.arc(320, 790, 52, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(320, 818); g.bezierCurveTo(272, 786, 282, 750, 305, 754); g.bezierCurveTo(314, 756, 320, 764, 320, 768); g.bezierCurveTo(320, 764, 326, 756, 335, 754); g.bezierCurveTo(358, 750, 368, 786, 320, 818); g.fill(); }, { transparent: true });
  const card = mkCard(); card.m.renderOrder = 5; card.m.material.depthWrite = false; card.m.visible = false;
  const mkBanner = () => { const b = mkSign(3.1, .95, 620, 190, (g, w, h) => { g.fillStyle = 'rgba(250,250,252,.97)'; g.beginPath(); g.roundRect(6, 6, w - 12, h - 12, 38); g.fill(); g.strokeStyle = '#111'; g.lineWidth = 6; g.stroke(); g.fillStyle = '#ff3b6b'; g.beginPath(); g.roundRect(26, 32, 110, 110, 26); g.fill(); g.fillStyle = '#fff'; g.font = '900 56px ' + FONT; g.textAlign = 'center'; g.fillText('♥', 81, 106); g.fillStyle = '#7a7f8a'; g.textAlign = 'left'; g.font = '700 28px ' + FONT; g.fillText('SWIPR  ·  now', 160, 56); g.fillStyle = '#16181d'; g.font = '900 37px ' + FONT; g.fillText('Alex viewed your profile', 160, 122); }, { transparent: true }); b.m.renderOrder = 6; b.m.visible = false; return b; };
  const banners = Array.from({ length: 5 }, mkBanner);
  const rings = Array.from({ length: 6 }, () => { const r = new THREE.Mesh(new THREE.TorusGeometry(.3, .035, 8, 28), new THREE.MeshBasicMaterial({ color: 0xffe14a, transparent: true, opacity: 0 })); r.visible = false; S.add(r); return r; });
  const sprBub = (w, h, text, fg = '#111', bg = '#fff') => mkSign(w, h, 520, Math.round(520 * h / w), (g, W, H) => { g.fillStyle = bg; g.strokeStyle = '#111'; g.lineWidth = 8; g.beginPath(); g.roundRect(8, 8, W - 16, H - 16, 30); g.fill(); g.stroke(); g.fillStyle = fg; g.font = '900 ' + Math.floor(H * .5) + 'px ' + FONT; g.textAlign = 'center'; g.fillText(text, W / 2, H * .66); }, { transparent: true });
  const dingB = sprBub(1.9, .7, 'DING DONG', '#111', '#ffe14a'); dingB.m.visible = false; dingB.m.renderOrder = 7;
  const knockB = sprBub(1.6, .6, 'BANG BANG', '#fff', '#e02020'); knockB.m.visible = false; knockB.m.renderOrder = 7;
  const bell = addBox(S, 6.35, 1.3, 3.0, .08, .22, .22, 0xf2f2f2, { cast: false }); const bellDot = addBox(S, 6.4, 1.3, 3.0, .04, .09, .09, 0xffcc33, { cast: false });
  // z-bubble stack on your side (looks counter)
  const zBub = [sprBub(.9, .5, 'Z'), sprBub(.9, .5, 'ZZ')]; zBub.forEach((z) => { z.m.visible = false; });
  // moving truck (rear view, drives away along the street)
  const truck = new THREE.Group(); S.add(truck); truck.visible = false;
  { const box = addBox(truck, 0, 1.7, 0, 2.4, 2.8, 5.0, 0xf4f4f6, { round: .05 }); addBox(truck, 0, 1.7, -2.52, 2.2, 2.6, .05, 0x1b1d24, { cast: false });
    addBox(truck, 0, 1.2, 3.7, 2.3, 2.0, 2.0, 0xe03a3a, { round: .1 }); addBox(truck, 0, 2.0, 4.65, 2.0, .9, .06, 0x9fd0f2, { cast: false }); addBox(truck, 0, .75, 0, 2.5, .5, 8.2, 0x2a2c33, { cast: false });
    for (const sx of [-1, 1]) for (const z of [-1.8, 1.4, 4.0]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .4, 14), mat(0x111111)); w.rotation.z = Math.PI / 2; w.position.set(sx * 1.2, .5, z); truck.add(w); }
    const lg = new THREE.Group(); truck.add(lg); // cargo: your stuff visible through the open back
    addBox(lg, -.3, .55, -1.7, 1.2, .5, 1.7, 0xe9e9ee, { round: .05 }); addBox(lg, -.3, .95, -1.7, 1.15, .35, 1.6, 0x4d6faa, { round: .08 }); addBox(lg, .65, .62, -1.9, .7, .7, .7, 0xc9a06a); addBox(lg, .65, 1.3, -1.9, .6, .55, .6, 0xc9a06a); addBox(lg, -.7, 1.6, -2.1, .2, 1.2, .2, 0xd8c8a8); addBox(lg, .5, .5, -.8, .8, .8, .8, 0xc9a06a); addBox(lg, -.6, 1.4, -.9, .9, .6, .9, 0xb98a58); }
  const sunLight = st.sun, hemi = st.hemi;
  { const sty = document.createElement('style'); sty.textContent = '#val,#lab,#note,#tag{-webkit-text-stroke:2px #111;paint-order:stroke fill;text-shadow:0 2px 12px rgba(0,0,0,.9)} #val{-webkit-text-stroke:4px #111}'; document.head.appendChild(sty); }
  const POP = ['', 'ONE LOOK.', 'TWO LOOKS.', '11 LOOKS. 3 AM.', 'SHE IS AT YOUR DOOR.', 'YOU MOVED.'];
  const POPT = [0, .1, .1, .1, .1, .1];
  const NOTE = ['', 'one buzz', 'two buzzes', 'buzzing nonstop', 'she found out', 'new address'];
  // ---------------- per-frame helpers
  const buzzT = [[], [.4], [.4, .95], [.1, .35, .6, .85, 1.1, 1.35, 1.6, 1.85, 2.1, 2.35, 2.6], [], []];
  const clockSet = (hh, mm) => { hH.rotation.z = -((hh % 12) + mm / 60) / 12 * Math.PI * 2; hM.rotation.z = -mm / 60 * Math.PI * 2; };
  const PHX = RX + 1.55, PHY = 1.0, PHZ = 3.4; // her phone on the nightstand-side of bed (on duvet)
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    const night = bi === 3 || bi === 4 ? 1 : bi === 5 ? .35 : 0;
    S.background = new THREE.Color().setRGB(lerp(.45, .03, night), lerp(.68, .04, night), lerp(.95, .1, night)); st.sky.visible = night < .05; S.fog = null;
    hemi.intensity = lerp(.7, .12, night); sunLight.intensity = lerp(2.2, .25, night); roomFill.intensity = lerp(10, 5, night); lampL.intensity = lerp(6, 9, night); lampR.intensity = lerp(6, 9, night);
    gnd.material.color.setHex(night > .5 ? 0x232a22 : 0x5d6a52);
    winL.material.emissiveIntensity = winR.material.emissiveIntensity = lerp(.6, .05, night); winL.material.color.setHex(night > .5 ? 0x1a2238 : 0xbfd4ec); winR.material.color.setHex(night > .5 ? 0x1a2238 : 0xbfd4ec);
    // defaults
    banners.forEach((b) => (b.m.visible = false)); rings.forEach((r) => (r.visible = false)); zBub.forEach((z) => (z.m.visible = false));
    [youPhone, herPhone].forEach((ph) => (ph.g.visible = false)); card.m.visible = false; digital.m.visible = false; dingB.m.visible = false; knockB.m.visible = false; truck.visible = false; nightGown.visible = false; emptyG.visible = false;
    bedL.g.visible = true; nsL.visible = true; rugL.visible = true; doorG.rotation.y = 0;
    crH.p[1].vis = false; YOU.vis = true; HER.vis = true; YOU.arms = null; HER.arms = null; YOU.pitch = 0; HER.pitch = 0; YOU.lie = 0; HER.lie = 0; YOU.extra = 0; HER.extra = 0;
    cr.setFace('calm'); crH.setFace('calm');
    // base poses
    const yp = { x: LX, y: -.3, z: 3.1, yaw: Math.PI, anim: 'sit', speed: 1, scale: 1.2 }; Object.assign(YOU, yp);
    const hp = { x: RX, y: -.3, z: 3.1, yaw: Math.PI, anim: 'sit', speed: 1, scale: 1.2 }; Object.assign(HER, hp);
    // you: phone held up in right hand, thumb scrolling
    const youHold = () => { YOU.arms = { lx: -.35, rx: -1.15, lz: .05, rz: -.15 }; youPhone.g.visible = true; attach(youPhone.g, YOU, 'handR', [0, .12, .12], [-.5, 0, 0]); YOU.pitch = .06; };
    // her phone lying on bed beside her (screen up)
    const herPhoneOnBed = (shake = 0) => { herPhone.g.visible = true; herPhone.g.matrixAutoUpdate = true; herPhone.g.position.set(PHX + Math.sin(t * 90) * shake * .06, PHY + .02, PHZ - .8 + Math.cos(t * 83) * shake * .05); herPhone.g.rotation.set(-Math.PI / 2, 0, .3 + Math.sin(t * 70) * shake * .25); };
    const bannerAt = (k, age, x, y, z) => { const b = banners[k]; const e = easeBack(age / .3); b.m.visible = e > .02; b.m.position.set(x, y + age * .0, z); b.m.scale.setScalar(Math.max(.01, e)); b.m.quaternion.copy(st.camera.quaternion); };
    const ringAt = (k, age, x, y, z) => { const r = rings[k]; if (age < 0 || age > .45) { r.visible = false; return; } r.visible = true; r.position.set(x, y, z); r.scale.setScalar(1 + age * 6); r.material.opacity = 1 - age / .45; r.quaternion.copy(st.camera.quaternion); };
    const cardAbove = (x, lt2) => { card.m.visible = true; card.m.position.set(x, 5.5 + Math.sin(lt2 * 2.2) * .05, 1.2); card.m.scale.setScalar(.95 * (1 + .02 * Math.sin(lt2 * 5))); card.m.quaternion.copy(st.camera.quaternion); };
    clockSet(10, 31); let views = 0; let cam; let shake = 0; let hot = false;
    const bubZ = () => { const k = Math.floor(t * 2.5) % 2; zBub[k].m.visible = true; zBub[k].m.position.set(LX + .9, 2.7 + (t * .6 % 1) * .3, 3.0); zBub[k].m.quaternion.copy(st.camera.quaternion); };

    if (bi === 0) {
      youHold(); herPhoneOnBed(0); const u = smooth(clamp(lt / 6));
      // you swipe through the profile; she is chill, scrolling her own phone
      HER.arms = { lx: -.2, rx: -.4, lz: 0, rz: 0 }; HER.pitch = .05; cardAbove(LX - 2.0, lt);
      const tb = 3.3; // notification lands as the narration says "notification"
      const age = lt - tb; if (age > 0 && age < 2.3) { bannerAt(0, age, RX + .1, 4.6, 1.2); ringAt(0, age % 2 > .45 ? 9 : age, PHX, PHY + .35, PHZ - .8); herPhoneOnBed(age < .5 ? 1 : 0); }
      views = 0; hot = false;
      cam = [lerp(-.4, .4, u), 3.4, -17.5 + u * .8, 0, 1.2, 1.5, 54];
    } else if (bi === 1) {
      youHold(); cardAbove(LX - 2.0, lt); HER.arms = { lx: -.2, rx: -.4 }; HER.pitch = .05;
      herPhoneOnBed(buzzT[1].some((b) => lt > b && lt < b + .3) ? 1 : 0);
      buzzT[1].forEach((b, k) => { const a = lt - b; ringAt(k, a, PHX, PHY + .35, PHZ - .8); if (a > 0 && a < 1.4) bannerAt(0, a, RX + .1, 4.6, 1.2); });
      views = lt > .4 ? 1 : 0; hot = views > 0;
      cam = [lerp(-.2, -.8, p), 3.2, -14.2, lerp(-.2, -.9, p), 1.3, 1.5, 54];
    } else if (bi === 2) {
      youHold(); cardAbove(LX - 2.0, lt); HER.arms = { lx: -.2, rx: -.4 }; HER.pitch = .05;
      herPhoneOnBed(buzzT[2].some((b) => lt > b && lt < b + .3) ? 1 : 0);
      buzzT[2].forEach((b, k) => { const a = lt - b; ringAt(k, a, PHX, PHY + .35, PHZ - .8); ringAt(k + 2, a - .12, PHX, PHY + .35, PHZ - .8); });
      banners[0].m.visible = false; const a1 = lt - .4, a2 = lt - .95; if (a1 > 0) bannerAt(0, a1, RX + .1, 4.7, 1.2); if (a2 > 0) bannerAt(1, a2, RX + .1, 5.35, 1.2);
      views = lt > .95 ? 2 : lt > .4 ? 1 : 0; hot = true;
      cam = [lerp(-.8, -1.2, p), 3.0, -12.4, lerp(-.9, -1.3, p), 1.3, 1.5, 54];
    } else if (bi === 3) {
      // 3 AM: you still scrolling, she buzzes nonstop then sits bolt upright
      youHold();
      const sit = smooth(clamp((lt - 1.5) / .45)); const buzzing = lt < 2.6;
      HER.pitch = lerp(.75, 0, sit); HER.y = -.3 + Math.sin(sit * Math.PI) * .12; HER.arms = sit > .5 ? { lx: -.9, rx: -.9, lz: .1, rz: -.1 } : { lx: .2, rx: .2 };
      HER.extra = sit > .9 ? .04 : 0; if (sit > .6) crH.setFace('shock');
      herPhoneOnBed(buzzing ? 1.6 : 0);
      buzzT[3].forEach((b, k) => { const a = lt - b; ringAt(k % 6, a, PHX, PHY + .35, PHZ - .8); });
      for (let k = 0; k < 5; k++) { const a = lt - (.1 + k * .25); if (a > 0) bannerAt(k, a, RX + .1 + Math.sin(k * 2) * .15, 4.9 + k * .42, 1.2 - k * .01); }
      digital.m.visible = true; digital.m.position.set(0, 2.9, 3.85); digital.m.quaternion.copy(st.camera.quaternion); digital.m.position.set(RX, 3.95, 3.6); digital.m.scale.setScalar(.8);
      clockSet(3, 0); views = lt > 1.0 ? 11 : lt > .75 ? 10 : lt > .5 ? 9 : lt > .25 ? 8 : lt > .1 ? 7 : 6; if (lt < .1) views = 5; if (lt > .1) views = Math.min(11, 3 + Math.floor((lt + .05) / .25) + 3); if (lt > 1.8) views = 11; hot = true; shake = buzzing ? .03 : 0;
      cam = [lerp(-1.2, -2.6, smooth(clamp(lt / 3))), 3.0, -11.0, lerp(-1.3, -2.8, smooth(clamp(lt / 3))), 1.5, 1.5, 54];
    } else if (bi === 4) {
      // her at your door, nightgown, arms crossed, bell, you awake in bed in terror
      views = 11; hot = true; youHold(); YOU.arms = { lx: -.9, rx: -.9, lz: .1, rz: -.1 }; youPhone.g.visible = false; cr.setFace('shock'); YOU.extra = .03;
      const walkIn = smooth(clamp(lt / .5)); const hx = lerp(10.2, 7.6, walkIn);
      Object.assign(HER, { x: hx, y: 0, z: 2.0, yaw: lerp(-1.9, 2.7, walkIn), anim: lt < .45 ? 'walk' : 'idle', scale: 1.2, speed: 1.2 }); crH.setFace('angry'); HER.arms = lt < .45 ? null : { lx: -1.4, rx: -1.4, lz: .05, rz: -.05 };
      nightGown.visible = true; nightGown.position.set(hx, .78, 2.0); nightGown.rotation.y = HER.yaw; nightGown.scale.set(.85, 1, .85);
      herPhone.g.visible = false; HER.vis = true;
      const bd = lt > .5 && lt < 1.0; dingB.m.visible = bd; dingB.m.position.set(5.2, 4.3, 2.0); dingB.m.quaternion.copy(st.camera.quaternion); dingB.m.scale.setScalar(bd ? 1 + .1 * Math.sin(lt * 60) : 1);
      const kn = lt > 1.0; knockB.m.visible = kn; knockB.m.position.set(5.2, 4.3, 2.0); knockB.m.quaternion.copy(st.camera.quaternion); knockB.m.scale.setScalar(kn ? 1 + .12 * Math.sin(lt * 40) : 1);
      doorG.rotation.y = kn ? Math.sin(lt * 36) * .035 : 0; shake = kn ? .02 : 0;
      cardAbove(LX - 2.0, lt);
      cam = [lerp(12.0, 10.5, p), 2.8, lerp(-10.5, -11.5, p), 5.2, 1.7, 2.2, 54];
    } else {
      // you moved: truck leaving, door open, empty apartment with her standing in it
      views = 11; hot = true; bedL.g.visible = false; nsL.visible = false; rugL.visible = false; emptyG.visible = true; YOU.vis = false;
      const op = easeBack(lt / .35); doorG.rotation.y = 1.45 * Math.min(1.08, op);
      const wk = smooth(clamp((lt - .1) / .8)); Object.assign(HER, { x: lerp(7.6, 3.8, wk), y: -.3 + .3, z: lerp(2.0, 1.7, wk), yaw: lerp(-1.9, -Math.PI, wk), anim: wk > .02 && wk < .98 ? 'walk' : 'idle', scale: 1.2, speed: 1.1 }); crH.setFace(wk > .95 ? 'calm' : 'angry'); HER.arms = wk > .95 ? { lx: .15, rx: .15, lz: .05, rz: -.05 } : (wk < .02 ? { lx: -1.4, rx: -1.4, lz: .05, rz: -.05 } : null);
      nightGown.visible = true; nightGown.position.set(HER.x, .78, HER.z); nightGown.rotation.y = HER.yaw; nightGown.scale.set(.85, 1, .85); herPhone.g.visible = false;
      truck.visible = true; const d = Math.max(0, lt - .05); truck.position.set(9.9, 0, 2.6 + d * d * 9.5); truck.rotation.y = 0;
      cam = [lerp(8.0, 6.8, p), 2.9, lerp(-12.5, -13.5, p), 6.4, 1.7, 2.5, 56];
      if (HER.y !== 0) HER.y = 0;
    }
    if (bi !== 4 && bi !== 5) { nightGown.visible = false; }
    cr.update(t); crH.update(t);
    st.follow(0, 0);
    const sx = Math.sin(t * 83) * shake, sy = Math.cos(t * 71) * shake * .6;
    st.cam(cam[0] + sx, cam[1] + sy, cam[2], cam[3], cam[4], cam[5], cam[6]);
    if (bi === 3) { digital.m.quaternion.copy(st.camera.quaternion); }
    st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if your ex got a *notification* every time you looked at their profile?' : '', bi === 0 ? 1 : 0);
    hud.counter('VIEWS', String(views), NOTE[bi], bi === 0 ? '' : 'STALKER MODE', hot); hud.tm('');
    hud.pop(bi ? POP[bi] : '', Math.min(1, Math.max(0, (lt - POPT[bi]) * 8)));
  } };
}
