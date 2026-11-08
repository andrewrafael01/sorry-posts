import { drakeLook, makeBubble } from './_drake.js';
// What if Drake officiated a stranger's wedding for $100k? Parody MrBeast-energy: blocky generic people, big props, crowd of 30 in shock.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, tree, addBox, mat, Crowd, Particles, clamp, smooth, lerp } = lib;
  const st = makeStage({ shadowExtent: 34, fogNear: 90, fogFar: 340, sunDir: [-.5, .9, .6], sunI: 2.8 }); const S = st.scene; ground(S, 0x7fb05a, 900);
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const D = { x: 0, z: -5 };
  // set dressing: platform, carpet aisle, arch with flowers, trees
  addBox(S, 0, .15, D.z, 8, .3, 4.2, 0xd8cfc0); addBox(S, 0, .02, 4, 2.2, .04, 22, 0xc4283a, { cast: false });
  for (const sx of [-1, 1]) { addBox(S, sx * 2.9, 2.8, D.z - 1.3, .35, 5.6, .35, 0xf4f1ea); }
  addBox(S, 0, 5.7, D.z - 1.3, 6.2, .4, .4, 0xf4f1ea);
  const fl = [0xff5f9a, 0xffd23a, 0xffffff, 0xff8a3c, 0xb27cff]; const rr = lib.R(5);
  for (let i = 0; i < 70; i++) { const a = rr() * Math.PI; const f = new THREE.Mesh(new THREE.IcosahedronGeometry(.2 + rr() * .15, 1), mat(fl[i % 5])); const side = i % 3; if (side === 0) f.position.set((rr() - .5) * 6.2, 5.7 + (rr() - .3) * .6, D.z - 1.3 + (rr() - .5) * .5); else f.position.set((side === 1 ? -1 : 1) * (2.9 + (rr() - .5) * .5), .4 + rr() * 5.2, D.z - 1.3 + (rr() - .5) * .5); f.castShadow = true; S.add(f); }
  for (let z = -2; z < 12; z += 2.2) for (const sx of [-1, 1]) { const f = new THREE.Mesh(new THREE.IcosahedronGeometry(.28, 1), mat(fl[(z + 20) % 5 | 0])); f.position.set(sx * 1.35, .3, z); S.add(f); }
  for (let i = 0; i < 14; i++) { tree(S, (i % 2 ? 1 : -1) * (14 + (i % 4) * 4), -14 + i * 4.5, 1.6, i * 3); }
  for (let i = 0; i < 10; i++) { const c = new THREE.Mesh(new THREE.SphereGeometry(.55, 12, 10), mat(fl[i % 5])); c.scale.y = 1.25; c.position.set((i % 2 ? 1 : -1) * 3.6, 6 + (i % 3) * .5, D.z - 1.1 + (i % 5) * .15); S.add(c); }
  // cast: 0 Drake, 1 bride, 2 groom, 3 priest, 4 caterer, 5 photographer, 6..35 guests
  const crowd = new Crowd(S, 36, 77); const P = crowd.p;
  const look = drakeLook(lib, S, crowd, 0, { coat: true, shirt: 0x14161c, pants: 0x14161c });
  const col = (i, ks, c) => ks.forEach((k) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; });
  col(1, ['torso', 'armL', 'armR', 'legL', 'legR'], 0xffffff); col(2, ['torso', 'armL', 'armR', 'legL', 'legR'], 0x23262e);
  col(3, ['torso', 'armL', 'armR', 'legL', 'legR'], 0x111111); col(4, ['torso', 'armL', 'armR'], 0xf4f4f4); col(4, ['legL', 'legR'], 0x2b2b30); col(5, ['torso', 'armL', 'armR'], 0x5a6270); col(5, ['legL', 'legR'], 0x2b2b30);
  col(1, ['hair'], 0x4a2a14); col(3, ['hair'], 0xd8d8d8);
  const veil = new THREE.Mesh(new THREE.BoxGeometry(.5, .55, .06), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .55 })); S.add(veil);
  const hat = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .32, 12), mat(0xffffff)); S.add(hat);
  const cam3 = new THREE.Mesh(new THREE.BoxGeometry(.3, .22, .2), mat(0x15151a)); const lens = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .14, 10), mat(0x9ab)); lens.rotation.x = Math.PI / 2; const camG = new THREE.Group(); lens.position.z = .15; camG.add(cam3, lens); camG.traverse((m) => (m.castShadow = true)); S.add(camG);
  // guests: flank the aisle, angled toward the camera so the faces read
  const G = []; { const r = lib.R(9); for (let k = 0; k < 30; k++) { const side = k % 2 ? 1 : -1, n = (k / 2) | 0, col2 = n % 3, row = (n / 3) | 0; const g = P[6 + k]; g.hx = side * (2.3 + col2 * 1.15 + r() * .3); g.hz = -1.8 + row * 1.7 + (col2 % 2) * .5; g.hyaw = side < 0 ? Math.PI / 2 - .55 - r() * .4 : -(Math.PI / 2 - .55 - r() * .4); g.scale = 1.0 + r() * .1; G.push(g); } }
  const bub = [0, 1, 2].map(() => makeBubble(lib, S, 2.3, .86));
  // cake
  const cake = new THREE.Group(); { [[1.3, .8, 0xfff0f4], [.95, .7, 0xffc0d4], [.6, .6, 0xff8fb4]].reduce((y, [r, h, c]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24), mat(c)); m.position.y = y + h / 2; cake.add(m); return y + h; }, .5); const cart = new THREE.Mesh(new THREE.BoxGeometry(3, .5, 3), mat(0x8a6a4a)); cart.position.y = .25; cake.add(cart); const cherry = new THREE.Mesh(new THREE.SphereGeometry(.18, 10, 8), mat(0xd01030)); cherry.position.y = 2.75; cake.add(cherry); cake.traverse((m) => (m.castShadow = true)); cake.visible = false; S.add(cake); }
  // vows scroll
  const vowTex = () => cvs(256, 320, (g, w, h) => { g.fillStyle = '#f7efd6'; g.fillRect(0, 0, w, h); g.fillStyle = '#3a2a1a'; g.font = '700 30px Georgia'; for (let i = 0; i < 7; i++) g.fillText(['MY VOWS', 'I promise to', 'also love your', 'dog Greg and', 'every cousin', 'and the DJ', 'and Ohio'][i], 18, 44 + i * 42); g.strokeStyle = '#a88a52'; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8); });
  const scTex = vowTex(); scTex.wrapS = scTex.wrapT = THREE.RepeatWrapping;
  const scroll = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1), new THREE.MeshBasicMaterial({ map: scTex, side: THREE.DoubleSide })); scroll.rotation.x = -Math.PI / 2; S.add(scroll);
  const drop = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.9), new THREE.MeshBasicMaterial({ map: vowTex(), side: THREE.DoubleSide })); S.add(drop);
  const rollEnd = new THREE.Mesh(new THREE.CylinderGeometry(.28, .28, 1.7, 14), mat(0xe9dcb4)); rollEnd.rotation.z = Math.PI / 2; S.add(rollEnd);
  // clock
  const clk = new THREE.Group(); { const f = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, .3, 40), mat(0x111111)); f.rotation.x = Math.PI / 2; const fc = new THREE.Mesh(new THREE.CircleGeometry(2.0, 40), new THREE.MeshBasicMaterial({ map: cvs(512, 512, (g) => { g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 512); g.fillStyle = '#111'; g.font = '800 54px Liberation Sans, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2; g.fillText(String(i), 256 + Math.sin(a) * 205, 256 - Math.cos(a) * 205); } }) })); fc.position.z = .17; const mh = new THREE.Mesh(new THREE.BoxGeometry(.14, 1.7, .06), mat(0xc4283a)); const hh = new THREE.Mesh(new THREE.BoxGeometry(.2, 1.1, .06), mat(0xc4283a)); mh.geometry.translate(0, .85, 0); hh.geometry.translate(0, .55, 0); mh.position.z = .22; hh.position.z = .24; clk.add(f, fc, mh, hh); clk.userData = { mh, hh }; clk.position.set(0, 9.6, D.z - 3.5); clk.scale.setScalar(1.4); clk.visible = false; S.add(clk); }
  const tears = new Particles(S, 160, 0x7fd0ff, .1, { rough: .1 }), conf = new Particles(S, 90, 0xffffff, .09, { rough: .5 }), spd = new Particles(S, 70, 0xffffff, .05, { rough: 1 });
  const place = (o, x, z, yaw, anim = 'idle', sp = 1, sc = 1, y = 0) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.vis = true; o.scale = sc; o.arms = null; o.pitch = 0; o.extra = 0; };
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const POP = ['DRAKE OFFICIATES', 'ARE YOU OKAY?', 'VOWS x4', '90 MINUTES IN', 'HE QUIT', 'NOBODY KISSES'];
  const UP = { lx: -2.9, rx: -2.9, lz: -.2, rz: .2 }, FACE = { lx: -2.2, rx: -2.2, lz: .5, rz: -.5 }, FWD = { lx: -1.45, rx: -1.45, lz: 0, rz: 0 };
  const DS = 2.1, DY = .3; const V = new THREE.Vector3(), V2 = new THREE.Vector3(), X = new THREE.Vector3(), Y = new THREE.Vector3(), Z = new THREE.Vector3();
  const bridePos = [-2.0, D.z + 1.2], groomPos = [2.0, D.z + 1.2];
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); const dur = [5.12, 6.59, 5.12, 6.59, 5.12, 7.32][bi]; const u = clamp(lt / dur); crowd.setFace('shock');
    P.forEach((o) => { o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; }); bub.forEach((b) => b.hide()); cake.visible = clk.visible = false; scroll.visible = drop.visible = rollEnd.visible = false; camG.visible = true; veil.visible = hat.visible = true;
    tears.clear(); conf.clear(); spd.clear();
    place(P[0], D.x, D.z, 0, 'idle', .5, DS, DY); P[0].arms = { lx: -.25, lz: -.5, rx: -.25, rz: .5 };
    place(P[1], bridePos[0], bridePos[1], .45, 'idle', .8, 1.05, DY); place(P[2], groomPos[0], groomPos[1], -.45, 'idle', .8, 1.05, DY); place(P[3], 3.7, D.z - .2, -.3, 'idle', .5, 1.05, DY);
    G.forEach((g) => place(g, g.hx, g.hz, g.hyaw, 'jump', 1, g.scale));
    let cam = [0, 5, 14, 0, 2.5, D.z, 55, 0]; let cnt = '30', lab = 'Guests shocked', note = 'all of them', hot = false;
    camG.visible = false; P[4].vis = false; P[5].vis = false;
    if (bi === 0) {
      // wide aerial drop -> fast push-in on giant Drake
      place(P[4], -4.2, D.z - .2, .3, 'idle', .5, 1.05, DY); place(P[5], 5.5, 3, -2.4, 'idle', .5, 1.05);
      G.forEach((g, k) => { g.arms = UP; }); P[1].arms = { lx: -2.4, rx: -2.4, lz: -.2, rz: .2 }; P[2].arms = { lx: -2.4, rx: -2.4, lz: -.2, rz: .2 }; P[3].arms = UP;
      const a = smooth(clamp(u / .55)), b2 = smooth(clamp((u - .45) / .55));
      cam = [lerp(-16, -1.2, a) + lerp(0, 1.8, b2), lerp(22, 3.4, a), lerp(26, 8, a) - b2 * 4.5, 0, lerp(.5, 3.6, a), D.z, lerp(60, 50, a), lerp(.12, -.07, b2)];
      cnt = String(Math.min(30, Math.round(u * 60))); for (let i = 0; i < 90; i++) { const ph = hash(i); const y = 9 - ((lt * (2 + ph * 2) + ph * 9) % 9); conf.set(i, (hash(i + 5) - .5) * 14, y, D.z + 2 + (hash(i + 9) - .5) * 14, 1); } conf.done();
    } else if (bi === 1) {
      lab = 'Are you okay?'; const k = lt < 2.2 ? 0 : lt < 4.0 ? 1 : 2; cnt = String(Math.min(3, k + 1)); note = ['asked the bride', 'asked the groom', 'asked the cake'][k]; hot = false;
      G.forEach((g) => { g.anim = 'idle'; g.arms = UP; g.extra = .06; });
      P[0].pitch = k === 0 ? .25 : k === 1 ? .22 : .5; P[0].yaw = k === 0 ? .55 : k === 1 ? -.55 : 0; P[0].arms = { lx: -1.1, lz: -.3, rx: -1.1, rz: .3 }; P[1].arms = { lx: -.5, rx: -.5, lz: -.1, rz: .1 }; P[2].arms = { lx: -.5, rx: -.5, lz: -.1, rz: .1 };
      P[1].pitch = k === 0 ? -.1 : 0; place(P[4], -4.2, D.z - .2, .3, 'idle', .5, 1.05, DY); P[3].arms = UP;
      if (lt > .3 && lt < 2.2) bub[0].show('are you okay?', bridePos[0] - .2, 3.5, bridePos[1]); if (lt >= 2.2 && lt < 4.0) bub[1].show('are you okay?', groomPos[0] + .2, 3.5, groomPos[1]);
      const cs = smooth(clamp((lt - 3.7) / .35)); const cz = lerp(9, -.2, smooth(clamp((lt - 3.5) / .9))); cake.visible = lt > 3.5; cake.position.set(0, 0, cz); cake.scale.setScalar(1.8 * (.4 + .6 * cs) * (1 + .04 * Math.sin(lt * 20)));
      if (lt >= 4.3) bub[2].show('are you okay?', 0, 7.2, D.z + 1);
      const cuts = [[bridePos[0] + 1.8, 2.9, 1.4, bridePos[0] - .2, 2.5, bridePos[1], 50, -.08], [groomPos[0] - 1.8, 2.9, 1.4, groomPos[0] + .2, 2.5, groomPos[1], 50, .08], [lerp(-6, 3.5, smooth(clamp((lt - 4) / 2.5))), 4.2, 12, 0, 3.6, lerp(-3, -4.6, u), 54, -.06]];
      cam = cuts[k]; const ph = k === 2 ? lt - 4 : k === 1 ? lt - 2.2 : lt; if (k < 2) { cam = cam.slice(); cam[0] += Math.sin(ph * 1.5) * .35 - ph * .3; cam[6] -= ph * 3; }
    } else if (bi === 2) {
      lab = 'Vows'; const stp = lt < 1.2 ? 1 : lt < 2.4 ? 2 : lt < 3.6 ? 3 : 4; cnt = 'x' + stp; note = ['normal vows', 'twice as long', 'wait', 'FOUR TIMES LONGER'][stp - 1]; hot = stp === 4;
      const Ls = [3, 8, 16, 34]; const Lt = [0, 1, 2, 3].map((i) => i), tt = lt / 1.2; const idx = Math.min(3, Math.floor(tt)), f = smooth(clamp(tt - idx)); const len = idx === 0 ? lerp(.3, Ls[0], f) : lerp(Ls[idx - 1], Ls[idx], f) * (idx === 3 ? 1 : 1);
      G.forEach((g) => { g.anim = 'panic'; g.arms = null; }); P[0].arms = { lx: -1.5, lz: -.15, rx: -1.5, rz: .15 }; P[0].yaw = Math.sin(lt * 3) * .2; P[0].pitch = .15; place(P[4], -4.2, D.z - .2, .3, 'panic', 1, 1.05, DY); P[3].anim = 'panic';
      const hy = 3.0; scroll.visible = drop.visible = rollEnd.visible = true; const sz0 = D.z + 1.6; drop.position.set(0, hy - .95 - .35, sz0); scroll.position.set(0, .09, sz0 + len / 2 + .8); scroll.scale.set(1, len, 1); scTex.repeat.set(1, Math.max(1, len / 2)); rollEnd.position.set(0, .3, sz0 + len + .8);
      const rl = new THREE.Mesh(); // (hand roll visual: reuse drop top)
      cam = [lerp(5, -2.5, smooth(u)), lerp(8, 3.4, smooth(u)), lerp(6, 15, smooth(u)), 0, lerp(1.2, 2.2, smooth(u)), lerp(D.z + 1, 2, smooth(u)), lerp(62, 50, u), lerp(-.1, .1, u)];
    } else if (bi === 3) {
      lab = 'Minutes in'; cnt = String(Math.min(90, Math.round(u * 180))); note = 'everyone is crying'; hot = true;
      clk.visible = true; clk.userData.mh.rotation.z = -lerp(0, Math.PI * 2 * 1.5, smooth(clamp(u / .45))) ; clk.userData.hh.rotation.z = -(lerp(0, Math.PI * 2 * 1.5, smooth(clamp(u / .45))) / 12) - Math.PI / 6 * 0;
      cnt = u > .45 ? '90' : String(Math.round(smooth(clamp(u / .45)) * 90));
      G.forEach((g) => { g.anim = 'idle'; g.arms = FACE; g.extra = .12; }); [P[1], P[2]].forEach((o) => { o.arms = FACE; o.extra = .1; }); P[3].arms = FACE; P[3].extra = .15; P[3].yaw = .2; place(P[4], 4.6, D.z + 1.2, -.4, 'idle', .5, 1.05, DY); P[4].arms = FACE; P[4].extra = .2;
      const src = [P[1], P[2], P[3], P[4], ...G.slice(0, 20)]; for (let i = 0; i < 160; i++) { const s = src[i % src.length], ph = hash(i * 1.7), q = (lt * 1.6 + ph) % 1; const eye = (i & 1) ? .1 : -.1; const hs = s.scale; const fx = Math.sin(s.yaw), fz = Math.cos(s.yaw); const rx = Math.cos(s.yaw) * eye * hs, rz = -Math.sin(s.yaw) * eye * hs; tears.set(i, s.x + fx * .2 * hs + rx + (ph - .5) * .1 + fx * q * 1.3, s.y + 1.7 * hs - q * q * 1.5 + q * .3, s.z + fz * .2 * hs + rz + fz * q * 1.3, 1); } tears.done();
      cam = [lerp(-3, 3, smooth(u)), lerp(7.5, 2.6, smooth(clamp(u / .6))), lerp(10, 12, u), 0, lerp(6, 2.6, smooth(clamp(u / .6))), lerp(D.z, -1, u), 54, lerp(.1, -.08, u)];
      if (u < .3) cam = [lerp(-1, 0, u / .3), 6, 4, 0, lerp(9, 6, u / .3), D.z - 3.5, 50, .05];
    } else if (bi === 4) {
      lab = 'Photographers'; cnt = lt < 2.0 ? '1' : '0'; note = lt < 2 ? 'still working' : 'he quit'; hot = lt > 2;
      G.forEach((g) => { g.anim = 'idle'; g.arms = FACE; g.extra = .08; }); [P[1], P[2], P[3]].forEach((o) => { o.arms = FACE; o.extra = .08; }); place(P[4], -4.2, D.z - .2, .3, 'idle', .5, 1.05, DY); P[4].arms = FACE;
      const drop2 = clamp((lt - 1.4) / .6), walkT = clamp((lt - 2.6) / 2.4); const ph = P[5]; const px = lerp(0, -8, smooth(walkT)); place(ph, px, 7.6, lt < 2.6 ? 0 : -Math.PI / 2, lt < 2.6 ? 'idle' : 'walk', 1, 1.15);
      ph.arms = lt < 1.5 ? { lx: -1.5, rx: -1.5, lz: .1, rz: -.1 } : lt < 2.6 ? { lx: -.2, rx: -.2, lz: -.1, rz: .1 } : null; ph.anim = lt < 2.6 ? 'idle' : 'walk';
      camG.visible = true; if (lt < 1.5) { V.set(0, 1.5, 8.3); camG.position.copy(V); camG.rotation.set(0, 0, 0); } else { const dt = lt - 1.5; const y = Math.max(.12, 1.5 - 4.9 * dt * dt); camG.position.set(.15 * dt, y, 8.3 + .3 * dt); camG.rotation.set(dt * 2.4 * (y > .13 ? 1 : 0), 0, dt * 1.4 * (y > .13 ? 1 : 0)); }
      if (lt > 2.4) bub[0].show('i quit', px + 1.4, 3.1, 7.6);
      cam = lt < 2.2 ? [lerp(-.6, .8, u * 2), 2.4, lerp(15, 12.5, u * 2), 0, 1.5, 7.6, 46, -.05] : [lerp(1, -2, smooth(walkT)), 2.6, 14, lerp(0, px, .8), 1.7, 7.6, 46, .08];
    } else {
      lab = lt < 2 ? 'Kisses' : 'Hugs'; const run = clamp((lt - 2.0) / 1.5); const hugs = lt < 2 ? 0 : Math.round(smooth(clamp((lt - 2.0) / 2.4)) * 36); cnt = lt < 2 ? '0' : String(hugs); note = lt < 2 ? 'nobody kissed' : 'giant group hug'; hot = lt >= 2;
      if (lt < 2) { G.forEach((g) => { g.anim = 'idle'; g.arms = FACE; g.extra = .05; }); P[1].arms = { lx: -.4, rx: -.4, lz: -.1, rz: .1 }; P[2].arms = P[1].arms; P[3].arms = UP; place(P[4], -4.2, D.z - .2, .3, 'idle', .5, 1.05, DY); P[5].vis = false; }
      P[0].arms = lt < 2.2 ? { lx: -.25, lz: -.5, rx: -.25, rz: .5 } : { lx: -2.2, lz: -.9, rx: -2.2, rz: .9 }; P[0].pitch = lt > 2.2 ? -.1 : 0;
      if (lt > .3 && lt < 2.0) bub[0].show('you may now kiss', -.8, 5.7, D.z + 1.2);
      const ids = [1, 2, 3, 4, 5, ...G.map((g, i) => 6 + i)]; ids.forEach((id, n) => { const o = P[id]; const hx = id === 1 ? bridePos[0] : id === 2 ? groomPos[0] : id === 3 ? 3.7 : id === 4 ? -4.2 : id === 5 ? 12 : o.hx; const hz = id <= 2 ? bridePos[1] : id === 3 ? D.z - .2 : id === 4 ? D.z - .2 : id === 5 ? 6 : o.hz; const ang = n / ids.length * Math.PI * 2 * 2.3, rad = .95 + (n % 3) * .42; const tx = D.x + Math.sin(ang) * rad * 1.15, tz = D.z + Math.cos(ang) * rad * .9 + .5; const k = smooth(clamp(run * 1.2 - hash(n) * .2)); o.vis = true; o.scale = id < 6 ? 1.05 : o.scale; o.x = lerp(hx, tx, k); o.z = lerp(hz, tz, k); o.y = id <= 4 ? lerp(DY, 0, 0) : 0; if (id <= 4 && k > .8) o.y = DY * 0; o.yaw = k > .9 ? Math.atan2(D.x - o.x, D.z - o.z) : Math.atan2(D.x - o.x, D.z - o.z) * k + (o.yaw || 0) * (1 - k); if (k > 0 && k < .95) { o.anim = 'sprint'; o.arms = null; } else if (k >= .95) { o.anim = 'jump'; o.arms = FWD; o.speed = 1.4; } });
      P[5].vis = true; P[5].scale = 1.15;
      if (lt > 3) for (let i = 0; i < 90; i++) { const ph = hash(i), q = (lt * 1.2 + ph) % 1; conf.set(i, D.x + (hash(i + 5) - .5) * 7, 1 + q * 9, D.z + (hash(i + 9) - .5) * 7, 1); } conf.done();
      const a = smooth(u), ang = -.9 + lt * .22, rd = lerp(11, 7.5, a); cam = [D.x + Math.sin(ang) * rd, lerp(3.2, 6.5, a), D.z + Math.cos(ang) * rd, D.x, lerp(2.6, 3.4, a), D.z, lerp(54, 48, a), Math.sin(lt * 2) * .04];
      if (lt < 2) cam = [lerp(-6, 0, smooth(lt / 2)), 3, lerp(9, 6.5, lt / 2), 0, 3.4, D.z, 50, .06];
    }
    crowd.update(t); look.update(); look.setVisible(true);
    attach2(veil, P[1], 'head', [0, .05, -.28]); attach2(hat, P[4], 'head', [0, .4, 0]);
    st.cam(...cam); st.camera.updateMatrixWorld();
    if (bi !== 1 && bi !== 3) { const m = st.camera.matrixWorld.elements; X.set(m[0], m[1], m[2]); Y.set(m[4], m[5], m[6]); Z.set(-m[8], -m[9], -m[10]); const sp = bi === 4 ? .6 : 1; for (let i = 0; i < 70; i++) { const ph = hash(i * 3.3), q = 1 - ((t * (1.4 + ph) * sp + ph * 7) % 1); const d = 7 + q * 22; V.set(cam[0], cam[1], cam[2]).addScaledVector(Z, d).addScaledVector(X, (hash(i + 1) - .5) * 9).addScaledVector(Y, (hash(i + 2) - .5) * 14); spd.set(i, V.x, V.y, V.z, .25 + (1 - q) * .5); } spd.done(); }
    st.follow(0, -2); st.render();
    hud.style('C'); hud.question(bi === 0 ? 'I let *Drake* officiate a stranger\'s wedding' : '', bi === 0 ? 1 : 0);
    hud.counter(lab, cnt, note, 'PARODY', hot); hud.tm('');
    hud.pop(lt > .4 ? POP[bi] : '', Math.min(1, (lt - .4) * 6));
    function attach2(m, o, k, off) { lib.attach(m, o, k, off); m.visible = o.vis; }
  } };
}
