import { makeBubble } from './_drake.js';
// What if every dating app photo was accurate? One blocky guy per beat, a floating profile card, the photo becomes literally true.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, mat, Crowd, clamp, smooth, lerp, attach, dropBounce } = lib;
  const st = makeStage({ shadowExtent: 34, fogNear: 110, fogFar: 460, sunDir: [-.5, .8, -.3], sunI: 2.8 }); const S = st.scene;
  const city = buildStreet(S, { seed: 7 }); city.cars.forEach((c) => (c.m.visible = false)); city.crowd.p.forEach((o) => (o.vis = false)); city.crowd.update(0);
  const CZ = 20;
  const crowd = new Crowd(S, 14, 21); const P = crowd.p;
  const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  const dress = (i, shirt, pants, skin, hair) => { ['torso', 'armL', 'armR'].forEach((k) => col(i, k, shirt)); ['legL', 'legR'].forEach((k) => col(i, k, pants)); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(i, k, skin)); col(i, 'hair', hair); };
  const SK = [0xe7b48f, 0xc98e63, 0x8d5a3b, 0xf0c7a4];
  // 0 hero, 1-6 group guys, 7 stranger
  dress(0, 0x2d6cdf, 0x2f3a52, SK[0], 0x2a1d12);
  for (let i = 1; i <= 6; i++) dress(i, i === 4 ? 0x3a78e8 : 0x2d6cdf, 0x2f3a52, SK[(i === 3 || i === 5) ? 3 : 0], [0x2a1d12, 0x3a2214, 0x2a1d12, 0x4a2c18, 0x2a1d12, 0x3a2214][i - 1]);
  dress(7, 0xd8423c, 0x3a3a46, SK[1], 0x15100c);
  for (let i = 8; i < 14; i++) dress(i, 0x888888, 0x333333, SK[0], 0x222222);
  P.forEach((o) => { o.h = 1; });
  const place = (i, x, z, yaw, anim = 'idle', o = {}) => { const p = P[i]; p.x = x; p.z = z; p.yaw = yaw; p.anim = anim; p.y = o.y || 0; p.speed = o.sp ?? 1; p.scale = o.sc ?? 1; p.vis = true; p.pitch = o.pitch || 0; p.arms = o.arms || null; p.extra = o.extra || 0; p.hs = o.hs ?? 1; };
  const UB = new THREE.BoxGeometry(1, 1, 1); const sc4 = new THREE.Matrix4();
  const scaled = (m, sx, sy, sz) => { sc4.makeScale(sx, sy, sz); m.matrix.multiply(sc4); };
  const mk = (w, h, d, c, o = {}) => { const m = new THREE.Mesh(UB, mat(c, o.mat)); m.castShadow = o.cast !== false; m.receiveShadow = true; m.userData.s = [w, h, d]; m.visible = false; S.add(m); return m; };
  const sfree = (m, x, y, z, ry = 0, rz = 0, rx = 0, k = 1) => { const [w, h, d] = m.userData.s; m.matrixAutoUpdate = true; m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.scale.set(w * k, h * k, d * k); m.visible = true; };
  const sat = (m, o, key, off, rot, k = 1) => { const [w, h, d] = m.userData.s; attach(m, o, key, off, rot); scaled(m, w * k, h * k, d * k); };
  const sign = (w, h, cw, ch, draw, tr = true) => { const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const g = cv.getContext('2d'); draw(g, cw, ch); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: tr })); m.visible = false; S.add(m); return m; };
  const bubbles = Array.from({ length: 6 }, () => makeBubble(lib, S, 1.3, .5)); const bub = (k, text, x, y, z) => bubbles[k].show(text, x, y, z);
  const faceCam = (m) => m.quaternion.copy(st.camera.quaternion);

  // ---------- profile photos (drawn on card canvases)
  const FR = [60, 80, 520, 520]; // photo frame inside card
  const sky = (g, a, b) => { const gr = g.createLinearGradient(0, FR[1], 0, FR[1] + FR[3]); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(...FR); };
  const head = (g, x, y, r, skin = '#e9c3a2', hair = '#2a1d12') => { g.fillStyle = skin; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.fillStyle = hair; g.beginPath(); g.arc(x, y - r * .25, r, Math.PI, 0); g.fill(); g.fillStyle = '#222'; g.fillRect(x - r * .5, y - r * .05, r * .2, r * .2); g.fillRect(x + r * .3, y - r * .05, r * .2, r * .2); g.fillRect(x - r * .3, y + r * .45, r * .6, r * .1); };
  const PH = {
    hero: (g) => { sky(g, '#6ecbff', '#ffe9b0'); g.fillStyle = '#2f7fd0'; g.fillRect(60, 420, 520, 180); head(g, 320, 250, 70); g.fillStyle = '#e9c3a2'; g.fillRect(250, 320, 140, 120); },
    fish: (g) => { sky(g, '#9ad8ff', '#4a90c8'); g.fillStyle = '#e9c3a2'; g.fillRect(60, 520, 520, 80); g.fillStyle = '#e8a03a'; g.beginPath(); g.ellipse(320, 340, 230, 95, -.18, 0, 7); g.fill(); g.beginPath(); g.moveTo(500, 300); g.lineTo(590, 230); g.lineTo(590, 400); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(190, 320, 22, 0, 7); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(184, 320, 11, 0, 7); g.fill(); g.fillStyle = '#e9c3a2'; g.fillRect(250, 400, 90, 140); g.fillRect(400, 400, 90, 140); },
    group: (g) => { sky(g, '#ffd6a0', '#f08a60'); for (let i = 0; i < 6; i++) { const x = 115 + i * 78; g.fillStyle = '#2d6cdf'; g.fillRect(x - 32, 360, 64, 220); head(g, x, 320, 34, i % 3 === 1 ? '#f0c7a4' : '#e7b48f'); } g.fillStyle = 'rgba(255,255,255,.85)'; g.font = '900 280px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('?', 320, 280); },
    gym: (g) => { sky(g, '#3a3d46', '#1c1e24'); g.fillStyle = '#e9c3a2'; g.fillRect(190, 280, 260, 260); g.fillRect(110, 300, 90, 200); g.fillRect(440, 300, 90, 200); g.fillStyle = '#c99c78'; g.fillRect(250, 340, 140, 40); g.fillRect(250, 420, 140, 40); g.save(); g.filter = 'blur(12px)'; g.fillStyle = '#e9c3a2'; g.beginPath(); g.arc(320, 200, 62, 0, 7); g.fill(); g.restore(); g.fillStyle = '#111'; g.font = '800 34px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('(face not found)', 320, 560); g.fillStyle = '#fff'; g.fillRect(140, 100, 100, 6); g.fillRect(400, 100, 100, 6); },
    shades: (g) => { sky(g, '#12121c', '#050509'); head(g, 320, 330, 150); g.fillStyle = '#000'; g.fillRect(150, 290, 340, 80); g.fillStyle = '#fff'; g.fillRect(180, 300, 40, 12); g.fillStyle = '#ff3b6b'; g.font = '900 54px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('11:47 PM', 320, 150); g.fillStyle = '#eee'; g.fillText('INDOORS', 320, 570); },
    dog: (g) => { sky(g, '#a8e0ff', '#7bc46a'); head(g, 190, 280, 70); g.fillStyle = '#2d6cdf'; g.fillRect(150, 350, 80, 190); g.fillStyle = '#8a5a2a'; g.fillRect(310, 400, 250, 120); g.fillRect(480, 320, 100, 100); g.fillRect(310, 500, 40, 80); g.fillRect(520, 500, 40, 80); g.fillStyle = '#111'; g.fillRect(540, 345, 14, 14); g.fillStyle = '#d33'; g.fillRect(320, 410, 30, 14); },
    real: (g) => { g.fillStyle = '#5a4a3a'; g.fillRect(...FR); g.fillStyle = '#7a3b3b'; g.fillRect(60, 400, 520, 200); g.fillStyle = '#c8c2a8'; g.fillRect(60, 80, 520, 200); g.fillStyle = '#e9c3a2'; g.beginPath(); g.arc(300, 330, 70, 0, 7); g.fill(); g.fillStyle = '#2d6cdf'; g.fillRect(210, 390, 190, 100); g.fillStyle = '#ffd23a'; g.fillRect(360, 410, 120, 110); g.fillStyle = '#d33'; g.fillRect(380, 440, 80, 30); g.fillStyle = '#e9c3a2'; g.fillRect(250, 330, 30, 8); g.fillRect(320, 330, 30, 8); },
  };
  const mkCard = (name, photo, noise = false) => {
    const cv = document.createElement('canvas'); cv.width = 640; cv.height = 900; const g = cv.getContext('2d');
    g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 28; g.shadowOffsetY = 10; g.fillStyle = '#fbfbfd'; g.beginPath(); g.roundRect(20, 20, 600, 860, 54); g.fill(); g.shadowColor = 'transparent';
    g.save(); g.beginPath(); g.roundRect(FR[0], FR[1], FR[2], FR[3], 36); g.clip();
    if (noise) { g.filter = 'blur(5px) saturate(.5) contrast(.8)'; photo(g); g.filter = 'none'; for (let i = 0; i < 2600; i++) { const v = (Math.random() * 255) | 0; g.fillStyle = `rgba(${v},${v},${v},.22)`; g.fillRect(FR[0] + Math.random() * FR[2], FR[1] + Math.random() * FR[3], 6, 6); } g.fillStyle = 'rgba(40,30,10,.18)'; g.fillRect(...FR); } else photo(g);
    g.restore(); g.strokeStyle = '#16181d'; g.lineWidth = 8; g.beginPath(); g.roundRect(FR[0], FR[1], FR[2], FR[3], 36); g.stroke();
    g.fillStyle = '#16181d'; g.font = '800 62px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText(name, 320, 670);
    g.fillStyle = '#9aa0ab'; g.font = '700 30px Liberation Sans, Arial'; g.fillText('2 miles away', 320, 716);
    g.fillStyle = '#ff3b6b'; g.beginPath(); g.arc(320, 800, 48, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(320, 826); g.bezierCurveTo(276, 796, 285, 764, 306, 768); g.bezierCurveTo(314, 770, 320, 777, 320, 781); g.bezierCurveTo(320, 777, 326, 770, 334, 768); g.bezierCurveTo(355, 764, 364, 796, 320, 826); g.fill();
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; const m = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.39), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })); m.visible = false; m.renderOrder = 5; S.add(m); return m;
  };
  const cards = [mkCard('Chad, 29', PH.hero), mkCard('Kyle, 31', PH.fish), mkCard('Kyle, 30', PH.group), mkCard('Brad, 28', PH.gym), mkCard('Derek, 33', PH.shades), mkCard('Tyler, 27', PH.dog), mkCard('Josh, 29', PH.real, true)];
  const cardAt = (k, x, y, z, sc = 1, t = 0) => { const c = cards[k]; c.visible = true; c.position.set(x, y + Math.sin(t * 2.2 + k) * .05, z); c.scale.setScalar(sc * (1 + .025 * Math.sin(t * 5 + k))); c.quaternion.copy(st.camera.quaternion); };

  // ---------- beat 1: fish
  const fish = { body: mk(1.9, .55, .4, 0xe8892a), belly: mk(1.5, .2, .42, 0xf6d8a8), tail: mk(.45, .8, .06, 0xd8601c), eyeW: mk(.1, .16, .16, 0xffffff), eyeB: mk(.11, .08, .08, 0x111111), fin: mk(.4, .3, .05, 0xd8601c), drip: [0, 1, 2].map(() => mk(.06, .12, .06, 0x6ec0ff, { cast: false })) };
  // ---------- beat 2: arrows
  const arrows = Array.from({ length: 6 }, () => ({ sh: mk(.09, .9, .09, 0xff3b3b, { mat: { emissive: 0xff3b3b, emissiveIntensity: .5 } }), hd: mk(.3, .3, .3, 0xff3b3b, { mat: { emissive: 0xff3b3b, emissiveIntensity: .5 } }) }));
  // ---------- beat 3: gym
  const frameBars = [mk(2.6, .12, .1, 0xf4f4f4), mk(2.6, .12, .1, 0xf4f4f4), mk(.12, 2.4, .1, 0xf4f4f4), mk(.12, 2.4, .1, 0xf4f4f4)];
  const mosaic = sign(.55, .55, 64, 64, (g) => { for (let a = 0; a < 8; a++) for (let b = 0; b < 8; b++) { const v = 130 + ((a * 7 + b * 13) % 5) * 22; g.fillStyle = `rgb(${v},${v - 20},${v - 40})`; g.fillRect(a * 8, b * 8, 8, 8); } }, false);
  const phone = mk(.2, .36, .04, 0x15151a); const dumbbells = [mk(.5, .12, .12, 0x333338), mk(.5, .12, .12, 0x333338)];
  const flashQ = sign(1.4, 1.4, 128, 128, (g) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); });
  // ---------- beat 4: dark room
  const room = [mk(16, .3, 9, 0x14141c, { cast: false }), mk(.4, 6, 9, 0x1c1c26), mk(16, 6, .4, 0x15151e, { cast: false }), mk(16, .3, 9, 0x101018, { cast: false })];
  const sunN = [mk(.6, .1, .6, 0x050507), mk(.6, .1, .6, 0x050507)]; const sunBr = mk(.2, .06, .08, 0x050507); const sunStars = Array.from({ length: 4 }, () => mk(.14, .14, .14, 0xffe14a, { mat: { emissive: 0xffe14a, emissiveIntensity: 1 }, cast: false }));
  const neon = sign(1.6, .5, 256, 80, (g, w, h) => { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, 0, w, h); g.fillStyle = '#ff2a7a'; g.shadowColor = '#ff2a7a'; g.shadowBlur = 20; g.font = '900 56px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('NIGHT', w / 2, 58); });
  const moon = sign(.9, .9, 128, 128, (g) => { g.fillStyle = '#ffe9a0'; g.beginPath(); g.arc(64, 64, 52, 0, 7); g.fill(); g.fillStyle = '#0a0a12'; g.beginPath(); g.arc(84, 54, 46, 0, 7); g.fill(); });
  // ---------- beat 5: dog
  const dogP = { body: mk(.5, .45, 1.1, 0x8a5a2a), head: mk(.42, .4, .45, 0x9a6a38), snout: mk(.24, .2, .22, 0x6a4018), ear1: mk(.1, .22, .14, 0x4a2a10), ear2: mk(.1, .22, .14, 0x4a2a10), legs: [0, 1, 2, 3].map(() => mk(.12, .4, .12, 0x6a4018)), tail: mk(.08, .08, .5, 0x6a4018), eyes: [mk(.08, .07, .04, 0xff2a2a, { cast: false }), mk(.08, .07, .04, 0xff2a2a, { cast: false })], brow: [mk(.16, .04, .04, 0x111111, { cast: false }), mk(.16, .04, .04, 0x111111, { cast: false })], leash: mk(.04, .04, 1, 0xd22, { cast: false }) };
  // ---------- beat 6: couch
  const couch = [mk(3.0, .5, 1.1, 0x7a3b3b), mk(3.0, 1.1, .35, 0x6a3030), mk(.35, .9, 1.1, 0x6a3030), mk(.35, .9, 1.1, 0x6a3030)]; const chips = mk(.45, .55, .12, 0xffd23a); const chipsBits = [0, 1, 2, 3, 4].map(() => mk(.1, .04, .1, 0xf0b820, { cast: false }));
  const tvGlow = sign(3.2, 1.9, 8, 8, (g) => { g.fillStyle = '#9ad0ff'; g.fillRect(0, 0, 8, 8); }, false); const zzz = [0, 1, 2].map((k) => sign(.5, .5, 128, 128, (g) => { g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 8; g.font = '900 96px Liberation Sans, Arial'; g.textAlign = 'center'; g.strokeText('Z', 64, 96); g.fillText('Z', 64, 96); }));

  const HID = [fish.body, fish.belly, fish.tail, fish.eyeW, fish.eyeB, fish.fin, ...fish.drip, ...arrows.flatMap((a) => [a.sh, a.hd]), ...frameBars, mosaic, phone, ...dumbbells, flashQ, ...room, ...sunN, sunBr, ...sunStars, neon, moon, dogP.body, dogP.head, dogP.snout, dogP.ear1, dogP.ear2, ...dogP.legs, dogP.tail, ...dogP.eyes, ...dogP.brow, dogP.leash, ...couch, chips, ...chipsBits, tvGlow, ...zzz];
  const POP = [[], [['HOLDING A FISH', .1]], [['GROUP PHOTO', .12], ['WHICH ONE?', 1.5]], [['GYM MIRROR', .12], ['NO FACE', 1.2]], [['SUNGLASSES', .12], ['INDOORS', 1.16], ['AT NIGHT', 2.58]], [['NOT HIS DOG', .12]], [['THE REAL PHOTO', .12]]];
  const dir = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2]; return { len: Math.hypot(dx, dy, dz), ry: Math.atan2(dx, dz), rx: -Math.atan2(dy, Math.hypot(dx, dz)) }; };

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 6); const dur = tl.beats[bi] ? tl.beats[bi].dur : 3;
    P.forEach((o) => { o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; o.hs = 1; });
    cards.forEach((c) => (c.visible = false)); bubbles.forEach((b) => b.hide()); HID.forEach((m) => (m.visible = false)); crowd.setFace && crowd.setFace('calm');
    let cam = [0, 2, 8, 0, 2, 20, 50];
    const ppl = (k) => P[k];
    if (bi === 0) {
      place(0, 0, CZ, Math.PI, 'idle', { sc: 1.1, arms: { lx: -.2, rx: -.2 } });
      const u = smooth(clamp(lt / 4.6)); cardAt(0, 0, 3.7, CZ, 1, lt); cam = [lerp(1.0, -.2, u), 2.5, CZ - lerp(8.5, 6.2, u), 0, 2.7, CZ, 52];
      if (lt > 2.4) bub(0, 'looks like me', 1.7, 3.0, CZ - .2);
    } else if (bi === 1) {
      const gr = dropBounce(1.2, 0, Math.max(0, lt - .08), .3, 22); const k = smooth(clamp((lt - .08) / .22));
      place(0, 0, CZ, Math.PI, 'idle', { sc: 1.1, arms: { lx: -1.25, rx: -1.25, lz: .1, rz: -.1 }, pitch: -.12 + .06 * Math.sin(lt * 14) });
      cardAt(1, 0, 4.5, CZ, .95, lt);
      const fw = Math.sin(lt * 11) * .5 * k; const fx = 0, fy = 1.5, fz = CZ - .6; const kk = Math.max(.01, k);
      sfree(fish.body, fx, fy, fz, 0, fw * .12, 0, kk); sfree(fish.belly, fx, fy - .2 * kk, fz - .02, 0, fw * .12, 0, kk);
      sfree(fish.tail, fx + 1.0 * kk, fy + fw * .12 * kk, fz, 0, .3 * Math.sin(lt * 18), 0, kk); sfree(fish.fin, fx + .2 * kk, fy + .45 * kk, fz, 0, 0, 0, kk);
      sfree(fish.eyeW, fx - .72 * kk, fy + .1 * kk, fz - .2 * kk, 0, 0, 0, kk); sfree(fish.eyeB, fx - .74 * kk, fy + .1 * kk, fz - .25 * kk, 0, 0, 0, kk);
      fish.drip.forEach((d, j) => sfree(d, fx - .5 + j * .5, Math.max(.1, 1.0 - ((lt * 2 + j * .33) % 1) * .9), fz - .2, 0, 0, 0, 1));
      if (lt > .5) bub(0, '...what', 1.15, 3.0, CZ - .3);
      cam = [.2, 2.4, CZ - 6.5 + lt * .5, 0, 2.5, CZ, 50];
    } else if (bi === 2) {
      const xs = [-3.0, -1.8, -.6, .6, 1.8, 3.0];
      for (let i = 0; i < 6; i++) place(1 + i, xs[i], CZ, Math.PI, 'idle', { sc: 1, arms: { lx: -.2, rx: -.2, lz: i < 5 ? .5 : 0, rz: i > 0 ? -.5 : 0 } });
      cardAt(2, 0, 5.2, CZ, 1.0, lt);
      for (let i = 0; i < 6; i++) { const u = smooth(clamp((lt - .5 - i * .1) / .25)); if (u <= 0) continue; const hx = xs[i], hy0 = 2.15, tgt = [0, 3.9, CZ], src = [hx, hy0, CZ - .2]; const d = dir(src, tgt); const L = d.len * .55 * u; const mid = [src[0] + (tgt[0] - src[0]) * .3 * u, src[1] + (tgt[1] - src[1]) * .3 * u, CZ - .2];
        const sh = arrows[i].sh; const dx = tgt[0] - src[0], dy = tgt[1] - src[1]; const ang = Math.atan2(dx, dy); sfree(sh, mid[0], mid[1] + .05, mid[2], 0, -ang, 0, 1); sh.scale.y = L * 1.1 / 1; const hx2 = src[0] + dx * (L / d.len), hy2 = src[1] + dy * (L / d.len); sfree(arrows[i].hd, hx2 + Math.sin(ang) * .12, hy2 + Math.cos(ang) * .12, mid[2], 0, -ang + Math.PI / 4, 0, 1); }
      if (lt > 1.9) bub(0, 'which one??', 0, 6.5, CZ - .2);
      cam = [0, 3.4, CZ - 11.5 + lt * .2, 0, 3.4, CZ, 55];
    } else if (bi === 3) {
      const fl = lt > .7 && lt < .85 ? 1 : 0; const flex = lt > .5 ? .5 + .5 * Math.sin(lt * 7) : 0;
      place(0, 0, CZ, Math.PI, 'idle', { sc: 1.15, arms: { lx: -.2, rx: -.2, lz: 1.5 + .2 * flex, rz: -1.5 - .2 * flex }, pitch: .0 });
      const o = P[0]; const hy = 2.05; const W = 2.4;
      // viewfinder frame crops at the neck: top bar sits right under the chin
      sfree(frameBars[0], 0, 1.55, CZ - .5, 0, 0, 0, 1); sfree(frameBars[1], 0, -.1 + .2, CZ - .5, 0, 0, 0, 1); sfree(frameBars[2], -1.3, .85, CZ - .5, 0, 0, 0, 1); sfree(frameBars[3], 1.3, .85, CZ - .5, 0, 0, 0, 1);
      frameBars[0].scale.set(2.8, .14, .1); frameBars[1].scale.set(2.8, .14, .1); frameBars[2].scale.set(.14, 1.8, .1); frameBars[3].scale.set(.14, 1.8, .1);
      mosaic.visible = true; mosaic.position.set(0, 1.93, CZ - .45); mosaic.scale.setScalar(1.15); mosaic.quaternion.copy(st.camera.quaternion);
      cardAt(3, 0, 4.2, CZ, .95, lt);
      if (fl) { flashQ.visible = true; flashQ.position.set(.9, 1.8, CZ - .9); flashQ.scale.setScalar(2.2); flashQ.quaternion.copy(st.camera.quaternion); }
      if (lt > 1.5) bub(0, 'where is my face', 1.6, 3.1, CZ - .2);
      cam = [.1, 2.3, CZ - 6.8 + lt * .3, 0, 2.6, CZ, 50];
    } else if (bi === 4) {
      // side view; dark room. camera at -x looking +x
      const X0 = -2.5, XW = 3.6; const walk = clamp((lt - .1) / 2.35); const px = lerp(X0, XW - .55, walk); const bonk = lt > 2.45;
      const bt = Math.max(0, lt - 2.45); const back = bonk ? Math.min(1, bt / .35) : 0; const x = px - back * .45 + (bonk ? 0 : 0);
      place(0, x, CZ, Math.PI / 2, bonk ? 'idle' : 'walk', { sc: 1.1, sp: .45, arms: bonk ? null : { lx: -.1, rx: -.1, lz: 0, rz: 0 }, pitch: bonk ? -.3 * Math.sin(Math.min(1, bt * 4) * Math.PI / 1.4) : 0 });
      // room shell: back wall at z=CZ+4, wall he hits at x=XW, floor
      sfree(room[0], 0, -.15, CZ, 0, 0, 0, 1); sfree(room[1], XW + .2, 3, CZ, 0, 0, 0, 1); sfree(room[2], 0, 3, CZ + 3.5, 0, 0, 0, 1); sfree(room[3], 0, 6.1, CZ, 0, 0, 0, 1);
      neon.visible = true; neon.position.set(XW - .1, 3.4, CZ - 2.2); neon.rotation.set(0, -Math.PI / 2, 0); moon.visible = true; moon.position.set(XW - .1, 4.4, CZ + 2.6); moon.rotation.set(0, -Math.PI / 2, 0);
      cardAt(4, 1.0, 4.3, CZ + 1.8, .9, lt);
      if (bonk) { sunStars.forEach((m, j) => { const a = bt * 7 + j * 1.57; sfree(m, x + .1, 2.55 + .06 * Math.sin(bt * 9 + j), CZ + Math.sin(a) * .5, a, 0, 0, 1); }); if (bt > .1) bub(0, 'BONK', x - 1.3, 3.0, CZ - .2); }
      else if (lt > 1.4) bub(1, 'I can see fine', x - 1.4, 3.1, CZ - .2);
      cam = [-5.2, 2.5, CZ - 5.0, 1.0, 1.9, CZ, 55];
    } else if (bi === 5) {
      const w = lt; const gx = -.5 + w * .9, dx = 1.8 + w * 1.9; // guy dragged slightly vs dog trotting off
      place(0, gx, CZ, Math.PI / 2, 'walk', { sc: 1.1, sp: .6, arms: { lx: -.25, rx: -1.45, lz: 0, rz: 0 }, pitch: .12 });
      place(7, 3.6 + w * 1.0, CZ, -Math.PI / 2, 'walk', { sc: 1.05, sp: .5, arms: { lx: -.3, rx: -1.2 } });
      const dBody = [dx, .62, CZ];
      const bob = Math.sin(lt * 20) * .03;
      sfree(dogP.body, dx, .7 + bob, CZ, Math.PI / 2, 0, 0, 1.1); sfree(dogP.head, dx + .75, 1.0 + bob, CZ - .0, Math.PI / 2 + .9, 0, 0, 1.1); sfree(dogP.snout, dx + .98, .92 + bob, CZ - .26, Math.PI / 2, 0, 0, 1.1);
      sfree(dogP.ear1, dx + .6, 1.3 + bob, CZ - .15, 0, 0, 0, 1.1); sfree(dogP.ear2, dx + .6, 1.3 + bob, CZ + .15, 0, 0, 0, 1.1);
      dogP.legs.forEach((m, j) => sfree(m, dx + (j < 2 ? .4 : -.4), .28 + Math.max(0, Math.sin(lt * 14 + j * 1.6)) * .08, CZ + (j % 2 ? .15 : -.15), 0, 0, 0, 1.1));
      sfree(dogP.tail, dx - .7, .95, CZ, 0, 0, 0, 1.1);
      sfree(dogP.eyes[0], dx + .95, 1.08 + bob, CZ - .38, 0, 0, 0, 1.1); sfree(dogP.eyes[1], dx + .78, 1.08 + bob, CZ - .38, 0, 0, 0, 1.1);
      sfree(dogP.brow[0], dx + .95, 1.18 + bob, CZ - .4, 0, 0, .0 + .5, 1.1); sfree(dogP.brow[1], dx + .78, 1.18 + bob, CZ - .4, 0, 0, -.5, 1.1);
      const hand = [gx + .62, 1.0, CZ - .1], coll = [dx + .45, .95 + bob, CZ - .1]; const d = dir(hand, coll); sfree(dogP.leash, (hand[0] + coll[0]) / 2, (hand[1] + coll[1]) / 2, CZ - .1, d.ry, 0, d.rx, 1); dogP.leash.scale.z = d.len;
      cardAt(5, gx + .9, 4.0, CZ + .3, .95, lt);
      if (lt > .55) bub(0, 'Biscuit, come!', 4.5 + w, 3.0, CZ - .3);
      cam = [1.6, 2.1, CZ - 8.2, 1.8, 1.8, CZ, 52];
    } else {
      const zoom = smooth(clamp((lt - .55) / .95)); const SZ = CZ;
      couch.forEach((m) => (m.visible = true)); sfree(couch[0], 0, .45, SZ, 0, 0, 0, 1); sfree(couch[1], 0, 1.05, SZ + .6, 0, 0, 0, 1); sfree(couch[2], -1.6, .75, SZ, 0, 0, 0, 1); sfree(couch[3], 1.6, .75, SZ, 0, 0, 0, 1);
      place(0, 0, SZ + .1, Math.PI, 'sit', { sc: 1.0, y: .12, pitch: -.35, arms: { lx: -.6, rx: -.6, lz: .2, rz: -.2 } });
      chips.visible = true;
      chipsBits.forEach((m, j) => sfree(m, -.15 + j * .08, .95 - ((lt * .9 + j * .2) % 1) * .4, SZ - .5 + j * .03, j, 0, 0, 1));
      tvGlow.visible = true; tvGlow.position.set(0, 2.3, SZ - 3.5); tvGlow.quaternion.copy(st.camera.quaternion); tvGlow.material.opacity = 1; tvGlow.visible = false;
      zzz.forEach((m, j) => { const u = ((lt * .8 + j / 3) % 1); m.visible = true; m.position.set(.5 + u * .8 + j * .15, 2.1 + u * 1.2, SZ - .3); m.scale.setScalar(.6 + u * .6); m.quaternion.copy(st.camera.quaternion); m.material.opacity = 1 - u; });
      cardAt(6, 0, lerp(4.0, 2.6, zoom), SZ - 1.0 - zoom * 3.6, lerp(1.0, 3.2, zoom), lt);
      cam = [.2, 2.6, SZ - 7.4, 0, lerp(2.4, 2.6, zoom), SZ, lerp(52, 38, zoom)];
    }
    crowd.update(t);
    // props that follow bodies (after crowd.update so matrices are fresh)
    if (bi === 6) sat(chips, P[0], 'torso', [0, .05, .42], [-.5, 0, .12]);
    if (bi === 4) { const oo = P[0]; attach(sunN[0], oo, 'head', [0, .04, .27]); scaled(sunN[0], .6, .24, .09); attach(sunN[1], oo, 'head', [0, .04, .02]); scaled(sunN[1], .56, .06, .5); sunN[1].visible = true; }
    if (bi === 5) { /* leash handled */ }
    st.cam(...cam); st.follow(cam[3], cam[5]);
    cards.forEach((c) => { if (c.visible) c.quaternion.copy(st.camera.quaternion); });
    st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if every dating app *photo* was accurate?' : '', bi === 0 ? 1 : 0); hud.counter('', '', ''); hud.tm('');
    let pt = ''; let pa = 0; POP[bi].forEach(([s, t0]) => { if (lt > t0) { pt = s; pa = Math.min(1, (lt - t0) * 7); } }); hud.pop(pt, pa);
  } };
}
