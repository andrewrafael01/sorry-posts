import { drakeLook, makeBubble } from './_drake.js';
// What if Drake became your landlord? Parody caricature (generic blocky look, no real lyrics/likeness).
// 0 hook (keys) | 1 Day 1 six-minute voice note, sorry x2 | 2 Day 5 geyser sink, floor sit, "how are you really doing" | 3 Day 12 rent up/down + poem | 4 Day 20 hallway group chat | 5 Day 30 hallway cry, RENT STILL DUE
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, Particles, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0xe9dcc6, fogNear: 34, fogFar: 100, shadowExtent: 15, hemi: 1.7, sunI: 2.0, sunDir: [-.25, 1, -.3], exposure: 1.12, shadowRes: 2048 }); const S = A.scene;
  let welcome; const OX = [0, 40, 80, 120]; // living room, kitchen, lobby, hallway
  const HGT = 4.2;
  const shell = (ox, w, z0, z1, wall, floor) => {
    const mid = (z0 + z1) / 2, len = z1 - z0;
    addBox(S, ox, -.05, mid, w, .1, len, floor, { cast: false, mat: { roughness: .5 } });
    addBox(S, ox, HGT / 2, z1 + .15, w, HGT, .3, wall); addBox(S, ox - w / 2 - .15, HGT / 2, mid, .3, HGT, len, wall); addBox(S, ox + w / 2 + .15, HGT / 2, mid, .3, HGT, len, wall);
    addBox(S, ox, HGT + .1, mid, w + .6, .2, len, 0xf4f1ea, { cast: false });
    addBox(S, ox, .12, z1 - .02, w, .24, .06, 0xffffff, { cast: false }); addBox(S, ox - w / 2 + .02, .12, mid, .06, .24, len, 0xffffff, { cast: false }); addBox(S, ox + w / 2 - .02, .12, mid, .06, .24, len, 0xffffff, { cast: false });
  };
  const tex = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t, w, h }; };
  const plane = (T, w, h, x, y, z, ry = 0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: T.t, side: THREE.DoubleSide })); m.position.set(x, y, z); m.rotation.y = ry; S.add(m); return m; };
  const FONT = 'Liberation Sans, Arial';
  const rrect = (g, x, y, w, h, r, fill) => { g.fillStyle = fill; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); };

  // ------------------------------------------------------------------ set 0: living room (hook + voice note)
  { const o = OX[0]; shell(o, 12, -8, 8, 0xe9d3a8, 0x8a5d3a);
    addBox(S, o + 1.3, .27, 7.1, 2.6, .55, 1.1, 0x4f6fb0, { round: .1 }); addBox(S, o + 1.3, 1.0, 7.6, 2.6, .9, .3, 0x4f6fb0, { round: .1 }); addBox(S, o + 2.75, .6, 7.1, .3, .75, 1.1, 0x4a6aa8, { round: .08 }); addBox(S, o - .15, .6, 7.1, .3, .75, 1.1, 0x4a6aa8, { round: .08 });
    addBox(S, o - 2.6, .45, 7.4, 1.4, .9, 1.0, 0x6a4a2c, { round: .05 }); const rug = addBox(S, o, .01, 4.5, 6, .02, 5, 0xc9553c, { cast: false });
    addBox(S, o, .5, 5.3, .9, 1.0, .9, 0x8a5d3a, { round: .05 }); // side table (phone stand)
    const door = addBox(S, o - 3.2, 1.65, 7.88, 1.7, 3.3, .1, 0x7a4a2a); addBox(S, o - 2.6, 1.6, 7.8, .12, .12, .1, 0xf2c230);
    const wc = tex(512, 160); wc.g.fillStyle = '#f7f2e4'; wc.g.fillRect(0, 0, 512, 160); wc.g.fillStyle = '#c1272d'; wc.g.fillRect(0, 0, 512, 20); wc.g.fillStyle = '#222'; wc.g.font = '900 54px ' + FONT; wc.g.textAlign = 'center'; wc.g.fillText('WELCOME HOME', 256, 92); wc.g.font = '700 30px ' + FONT; wc.g.fillText('Unit 4C. Please. Be happy.', 256, 134); wc.t.needsUpdate = true; welcome = plane(wc, 3.0, .94, o + .6, 3.0, 7.82, Math.PI);
    addBox(S, o + 5.4, 1.6, 4, .1, 1.4, 1.8, 0x9fd0f2, { cast: false, mat: { emissive: 0x6aa8d8, emissiveIntensity: .4 } });
    for (let i = 0; i < 4; i++) addBox(S, o + 4.3 - (i % 2) * .3, .3 + (i > 1 ? .6 : 0), 3.2 + (i % 2) * .15, .9, .6, .7, 0xc89a5a, { round: .02 });
  }
  // ------------------------------------------------------------------ set 1: kitchen
  let spray, sprayMat; const kit = OX[1];
  { const o = kit; shell(o, 12, -8, 8, 0xf2d878, 0xd8c7a0);
    for (let i = -6; i <= 5; i++) addBox(S, o + i + .5, 1.55 + 0, 7.84, .98, 1.1, .02, 0xffffff, { cast: false });
    addBox(S, o, .5, 7.4, 6.0, 1.0, .95, 0x6aa0d8, { round: .03 }); addBox(S, o, 1.04, 7.4, 6.2, .08, 1.05, 0xefefea); addBox(S, o + .3, 1.08, 7.1, .9, .06, .6, 0xaab4be, { mat: { metalness: .8, roughness: .25 } });
    addBox(S, o + .3, 1.4, 7.55, .1, .6, .1, 0xaab4be, { mat: { metalness: .85, roughness: .2 } }); const faucetTop = addBox(S, o + .3, 1.72, 7.35, .1, .1, .5, 0xaab4be, { mat: { metalness: .85, roughness: .2 } });
    addBox(S, o + 3.95, 1.6, 7.4, 1.3, 3.2, 1.0, 0xe8ecf0, { round: .05, mat: { roughness: .3 } }); addBox(S, o + 3.95, 1.6, 6.88, 1.26, .04, .04, 0x888f98);
    addBox(S, o - 4.2, 2.6, 7.65, 2.0, 1.4, .06, 0x9fd0f2, { cast: false, mat: { emissive: 0x6aa8d8, emissiveIntensity: .35 } });
    addBox(S, o - 1.2, .55, 3.0, .55, .55, .55, 0xe03a3a, { round: .04 }); // red toolbox far-left, off the action
    sprayMat = new THREE.MeshStandardMaterial({ color: 0x66c2ff, roughness: .1, metalness: 0, emissive: 0x1a4a7a, emissiveIntensity: .5 }); spray = new THREE.InstancedMesh(new THREE.SphereGeometry(.07, 8, 6), sprayMat, 220); spray.frustumCulled = false; S.add(spray);
  }
  const puddle = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshStandardMaterial({ color: 0x66b6f0, roughness: .05, transparent: true, opacity: .72 })); puddle.rotation.x = -Math.PI / 2; puddle.position.set(kit + .5, .02, 5); puddle.visible = false; S.add(puddle);
  // ------------------------------------------------------------------ set 2: lobby (rent sign + poem)
  const lob = OX[2]; const signT = tex(640, 420); let board, scroll, scrollPaper, scrollT;
  { const o = lob; shell(o, 14, -8, 8, 0x8fc4c0, 0x9a9a9a);
    for (let i = 0; i < 6; i++) addBox(S, o - 6.4, 1.3 + (i % 3) * .5 - .5, 6.5 + (i > 2 ? .7 : 0) - (i > 2 ? 0 : .0), .12, .4, .5, 0xb8bcc2, { cast: false });
    addBox(S, o + 5.6, 1.6, 6.4, .5, 3.2, 3.2, 0xc9873a, { cast: false });
    board = new THREE.Group(); board.add(new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.9, .14), mat(0x6a4a2a))); const face = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.75), new THREE.MeshBasicMaterial({ map: signT.t })); face.position.z = -.08; face.rotation.y = Math.PI; board.add(face);
    for (const sx of [-1.1, 1.1]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(.14, 1.4, .14), mat(0x5a3a1a)); leg.position.set(sx, -1.6, 0); board.add(leg); } board.traverse((m) => (m.castShadow = true)); board.position.set(o, 2.9, 5.6); S.add(board);
    scrollT = tex(512, 700); scroll = new THREE.Group(); scrollPaper = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.9), new THREE.MeshBasicMaterial({ map: scrollT.t, side: THREE.DoubleSide })); scroll.add(scrollPaper);
    for (const sy of [1, -1]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, 2.4, 12), mat(0x8a5a2a)); r.rotation.z = Math.PI / 2; r.position.y = sy * 1.45; r.userData.sy = sy; scroll.add(r); } scroll.userData.rolls = scroll.children.slice(1); scroll.visible = false; scroll.rotation.y = Math.PI; S.add(scroll);
    const g = scrollT.g; g.fillStyle = '#f3e3b3'; g.fillRect(0, 0, 512, 700); g.strokeStyle = '#a07a3a'; g.lineWidth = 10; g.strokeRect(10, 10, 492, 680); g.fillStyle = '#4a2f12'; g.textAlign = 'center'; g.font = 'italic 800 54px Georgia, serif'; g.fillText('Ode to the Rent', 256, 100); g.font = 'italic 600 46px Georgia, serif'; ['the rent went up,', 'the rent went down,', 'I feel so bad', 'in this whole town.'].forEach((l, i) => g.fillText(l, 256, 200 + i * 78)); g.font = 'italic 600 34px Georgia, serif'; g.fillText('with love, your landlord', 256, 560); g.fillText('(sorry)', 256, 612); scrollT.t.needsUpdate = true;
  }
  // ------------------------------------------------------------------ set 3: hallway (group chat + crying)
  const hal = OX[3]; const banT = tex(768, 200); let banner;
  { const o = hal; shell(o, 5.6, -6, 15, 0xd9c7a6, 0x7a2a2a);
    addBox(S, o, .02, 4.5, 2.2, .02, 21, 0x3a1c1c, { cast: false });
    const dc = [0x3a6ea8, 0x2a8a5a, 0xc9873a, 0x8a3a6a, 0x6a4a8a, 0xb8483a];
    [[-1, 2.5], [1, 4.5], [-1, 6.5], [1, 8.5], [-1, 10.5], [1, 12.5]].forEach(([sd, z], i) => { addBox(S, o + sd * 2.62, 1.55, z, .1, 3.1, 1.5, dc[i]); addBox(S, o + sd * 2.56, 2.5, z, .04, .28, .5, 0xf2f2e8, { cast: false }); addBox(S, o + sd * 2.56, 1.5, z + .5, .06, .1, .1, 0xf2c230, { cast: false }); });
    for (let i = 0; i < 5; i++) addBox(S, o, HGT - .02, i * 3.5 - 2, 1.4, .06, .5, 0xfff4d0, { cast: false, mat: { emissive: 0xffe6a0, emissiveIntensity: .8 } });
    addBox(S, o, 1.6, 14.84, 2.0, 3.2, .06, 0x5a3a1a);
    banner = plane(banT, 5.2, 1.35, o, 3.45, 14.6); banner.rotation.y = Math.PI; banner.visible = false;
  }
  // ------------------------------------------------------------------ people + props
  const NP = 20; const crowd = new Crowd(S, NP, 77); const P = crowd.p; const D = P[0], T = P[1];
  const look = drakeLook(lib, S, crowd, 0, { jersey: 0x1f5a3a });
  const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  ['torso', 'armL', 'armR'].forEach((k) => col(1, k, 0xe8553c)); ['legL', 'legR'].forEach((k) => col(1, k, 0x2a3350));
  const SH = [0x3c8fe8, 0xf2d03c, 0x2ea84f, 0xe84a8a, 0x8a4fe8, 0xff8a3c, 0x3cc9c0];
  for (let i = 2; i < NP; i++) { ['torso', 'armL', 'armR'].forEach((k) => col(i, k, SH[i % SH.length])); ['legL', 'legR'].forEach((k) => col(i, k, 0x2a2f3c)); }
  const keys = new THREE.Group(); { const ring = new THREE.Mesh(new THREE.TorusGeometry(.14, .02, 8, 16), new THREE.MeshStandardMaterial({ color: 0xcfd4da, metalness: .9, roughness: .25 })); keys.add(ring); for (let i = 0; i < 6; i++) { const k = new THREE.Mesh(new THREE.BoxGeometry(.06, .3, .015), new THREE.MeshStandardMaterial({ color: i % 2 ? 0xf2c230 : 0xcfd4da, metalness: .9, roughness: .3 })); const a = i * 1.05; k.position.set(Math.sin(a) * .1, -.2 - (i % 3) * .03, Math.cos(a) * .06); k.rotation.z = Math.sin(a) * .25; keys.add(k); } S.add(keys); }
  const lease = new THREE.Mesh(new THREE.PlaneGeometry(.55, .7), new THREE.MeshBasicMaterial({ map: (() => { const t = tex(256, 320); t.g.fillStyle = '#fbf8ee'; t.g.fillRect(0, 0, 256, 320); t.g.fillStyle = '#222'; t.g.font = '800 34px ' + FONT; t.g.fillText('LEASE', 20, 52); t.g.fillStyle = '#999'; for (let i = 0; i < 12; i++) t.g.fillRect(20, 80 + i * 16, 200 - (i % 3) * 30, 6); t.g.fillStyle = '#c1272d'; t.g.fillText('sign here (sorry)', 20, 296); t.t.needsUpdate = true; return t.t; })(), side: THREE.DoubleSide })); S.add(lease);
  const mkPhone = (w, h) => { const g = new THREE.Group(); const body = new THREE.Mesh(new RoundedBox(w + .12, h + .12, .1, .08), mat(0x15171c, { roughness: .35 })); body.castShadow = true; g.add(body); const T2 = tex(512, Math.round(512 * h / w)); const scr = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: T2.t })); scr.position.z = -.055; scr.rotation.y = Math.PI; g.add(scr); g.userData.T = T2; S.add(g); return g; };
  function RoundedBox(w, h, d, r) { return new lib.RoundedBoxGeometry(w, h, d, 3, r); }
  const voice = mkPhone(1.5, 2.67); const chat = mkPhone(1.7, 3.02);
  const hphone = new THREE.Mesh(new THREE.BoxGeometry(.14, .26, .03), mat(0x15171c)); S.add(hphone);
  const tissue = new THREE.Mesh(new THREE.BoxGeometry(.3, .16, .2), mat(0x7fd0f0)); S.add(tissue);
  const mkB = (w, h) => { const c = document.createElement('canvas'); c.width = 512; c.height = Math.round(512 * h / w); const g = c.getContext('2d'); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthWrite: false })); sp.scale.set(w, h, 1); sp.visible = false; S.add(sp); let cur = null;
    return { show(text, x, y, z) { if (text !== cur) { cur = text; const ls = text.split('\n'); g.clearRect(0, 0, c.width, c.height); g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 10; g.beginPath(); g.roundRect(8, 8, c.width - 16, c.height - 16, 40); g.fill(); g.stroke(); g.fillStyle = '#111'; const fs = Math.min(112, Math.floor((c.width - 60) / (Math.max(...ls.map((l) => l.length)) * .52)), Math.floor((c.height - 40) / ls.length / 1.15)); g.font = '800 ' + fs + 'px ' + FONT; g.textAlign = 'center'; ls.forEach((l, i) => g.fillText(l, c.width / 2, c.height / 2 + (i - (ls.length - 1) / 2) * fs * 1.12 + fs * .34)); tx.needsUpdate = true; } sp.position.set(x, y, z); sp.visible = true; }, hide() { sp.visible = false; } }; };
  const bD = mkB(1.35, .62), bW = mkB(2.1, 1.0), bT = mkB(1.2, .55), bQ = mkB(1.7, .64);
  const tears = new Particles(S, 220, 0x7fcaff, .05, { rough: .1, emissive: 0x1a5aa0 }); const sweat = new Particles(S, 14, 0xaee0ff, .04, { rough: .1 });
  const place = (o, x, z, yaw, anim = 'idle', y = 0, sp = .5, sc = 1.25) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.vis = true; o.scale = sc; o.pitch = 0; };
  const sitY = (o, top = 0) => top + .18 - .8 * o.scale * o.h;
  const HOLD = { lx: -.25, lz: -.1, rx: -.3, rz: .1 };

  // ------------------------------------------------------------------ canvas UIs
  function drawVoice(lt) {
    const { g, w, h } = voice.userData.T; const prog = clamp((lt - .6) / 6.3);
    g.fillStyle = '#ece5dd'; g.fillRect(0, 0, w, h); g.fillStyle = '#1f6f5c'; g.fillRect(0, 0, w, 120);
    g.fillStyle = '#d8b48c'; g.beginPath(); g.arc(64, 70, 36, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '800 38px ' + FONT; g.textAlign = 'left'; g.fillText('Landlord Drake', 118, 66); g.font = '600 24px ' + FONT; g.fillStyle = '#c6efe0'; g.fillText('recording audio...', 118, 98);
    rrect(g, 24, 160, w - 48, 74, 14, '#c1272d'); g.fillStyle = '#fff'; g.font = '900 40px ' + FONT; g.textAlign = 'center'; g.fillText('RENT DUE THE 1ST', w / 2, 212);
    rrect(g, 24, 270, w - 48, 330, 28, '#d9fdd3'); g.fillStyle = '#1f6f5c'; g.beginPath(); g.moveTo(66, 318); g.lineTo(66, 376); g.lineTo(114, 347); g.closePath(); g.fill();
    for (let i = 0; i < 36; i++) { const a = Math.abs(Math.sin(i * .8 + i * i * .021)) * (.35 + .65 * Math.abs(Math.sin(i * 1.9))); const pulse = lt > .6 && lt < 6.9 ? .72 + .28 * Math.sin(lt * 11 + i * .9) : 1; const bh = 12 + a * 96 * pulse; g.fillStyle = i / 36 < prog ? '#1f6f5c' : '#8fb8a6'; g.fillRect(134 + i * 9.6, 347 - bh / 2, 6, bh); }
    g.fillStyle = '#d4d4d4'; g.fillRect(40, 440, w - 80, 8); g.fillStyle = '#1f6f5c'; g.fillRect(40, 440, (w - 80) * prog, 8); g.beginPath(); g.arc(40 + (w - 80) * prog, 444, 14, 0, 7); g.fill();
    g.fillStyle = '#111'; g.font = '900 210px ' + FONT; g.textAlign = 'center'; g.fillText('6:00', w / 2, 590); g.font = '700 30px ' + FONT; g.fillStyle = '#555'; g.fillText('voice note, 1 of 1', w / 2, 640);
    g.fillStyle = '#fff'; rrect(g, 24, 700, w - 48, 90, 20, '#fff'); g.fillStyle = '#aaa'; g.font = '600 30px ' + FONT; g.textAlign = 'left'; g.fillText('Reply...', 50, 758); voice.userData.T.t.needsUpdate = true;
  }
  const MSG = [[.5, 'Drake', 'hi everyone. sorry'], [1.3, 'Drake', 'sorry for the group chat'], [2.1, '2B', 'who added Drake'], [2.8, 'Drake', 'i added everyone'], [3.7, '4A', 'he is in my kitchen'], [4.6, 'Drake', 'sorry']];
  function drawChat(lt) {
    const { g, w, h } = chat.userData.T; g.fillStyle = '#0e1621'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#1c2a3a'; g.fillRect(0, 0, w, 150); g.fillStyle = '#3c8fe8'; g.beginPath(); g.arc(64, 78, 38, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '900 30px ' + FONT; g.textAlign = 'center'; g.fillText('4', 64, 90);
    g.textAlign = 'left'; const named = lt > 3.4; const nm = named ? 'Started From The Lease' : 'Building Group Chat'; g.font = '800 34px ' + FONT; g.fillStyle = named ? '#ffd92a' : '#fff'; g.fillText(nm, 120, 72); g.font = '600 26px ' + FONT; g.fillStyle = '#8fa4b8'; g.fillText('24 members', 120, 114);
    let y = 190; for (const [t0, who, msg] of MSG) { if (lt < t0) continue; const me = who === 'Drake'; const u = clamp((lt - t0) * 6); g.globalAlpha = u; const bw = Math.min(440, 40 + msg.length * 22); const x = me ? 36 : w - 36 - bw; rrect(g, x, y, bw, 100, 22, me ? '#2b5278' : '#26323f'); g.fillStyle = me ? '#9fd0ff' : '#e0a060'; g.font = '800 24px ' + FONT; g.fillText(who, x + 20, y + 32); g.fillStyle = '#fff'; g.font = '600 31px ' + FONT; g.fillText(msg, x + 20, y + 76); y += 122; g.globalAlpha = 1; }
    chat.userData.T.t.needsUpdate = true;
  }
  function drawSign(rent, dir) {
    const { g, w, h } = signT; g.fillStyle = '#11202b'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e8c02e'; g.lineWidth = 14; g.strokeRect(10, 10, w - 20, h - 20); g.fillStyle = '#e8c02e'; g.font = '900 78px ' + FONT; g.textAlign = 'center'; g.fillText('MONTHLY RENT', w / 2, 112);
    const c = dir > 0 ? '#ff4a4a' : dir < 0 ? '#5ee08a' : '#ffffff'; g.fillStyle = c; g.font = '900 190px ' + FONT; g.fillText('$' + Math.round(rent).toLocaleString('en-US'), w / 2 + 14, 310);
    if (dir) { g.beginPath(); if (dir > 0) { g.moveTo(54, 330); g.lineTo(104, 330); g.lineTo(79, 270); } else { g.moveTo(54, 230); g.lineTo(104, 230); g.lineTo(79, 290); } g.closePath(); g.fill(); }
    g.fillStyle = '#9ab'; g.font = '700 34px ' + FONT; g.fillText('per month (negotiable, sorry)', w / 2, 380); signT.t.needsUpdate = true;
  }
  function drawBanner() { const { g, w, h } = banT; g.fillStyle = '#c1272d'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 10; g.strokeRect(12, 12, w - 24, h - 24); g.fillStyle = '#fff'; g.font = '900 96px ' + FONT; g.textAlign = 'center'; g.fillText('RENT STILL DUE', w / 2, 138); banT.t.needsUpdate = true; }
  drawBanner();

  const M = new THREE.Matrix4(), V = new THREE.Vector3(), Q = new THREE.Quaternion(), SCl = new THREE.Vector3(); const rpos = [];
  const POP = ['', 'SORRY. SORRY.', 'ON THE FLOOR.', 'A POEM.', 'STARTED FROM THE LEASE', 'STILL DUE'];
  const NOTE = ['', 'six minute voice note', 'water everywhere, he asked about feelings', 'up, down, poem', 'the whole building is in it', 'tissues provided'];

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); for (let i = 0; i < NP; i++) { const o = P[i]; o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; o.y = 0; } [bD, bW, bT, bQ].forEach((b) => b.hide());
    keys.visible = lease.visible = hphone.visible = tissue.visible = voice.visible = chat.visible = puddle.visible = false; board.visible = scroll.visible = banner.visible = false; welcome.visible = bi === 0; spray.visible = false; tears.clear(); sweat.clear(); tears.done(); sweat.done();
    const o = OX[Math.min(3, bi < 2 ? 0 : bi === 2 ? 1 : bi === 3 ? 2 : 3)]; let cam, cnt = '', lab = '', hot = false, camFocus = [o, 4];
    let applied = 0; // how many apologies
    if (bi === 0) {
      const u = smooth(clamp(lt / 1.4)); place(D, o - .9 + u * .1, lerp(7.0, 3.6, u), Math.PI, u < 1 ? 'walk' : 'idle', 0, .55); D.arms = { lx: -1.3, lz: -.1, rx: -2.2, rz: .1 }; if (u < 1) D.arms = { lx: -1.3, lz: -.1, rx: -2.2, rz: .1 };
      place(T, o + 1.35, 4.8, Math.PI + .5, 'idle'); T.arms = { lx: -2.4, lz: .2, rx: -2.4, rz: -.2 }; crowd.setFace('shock');
      cam = [o + .2, 2.4 - u * .1, -3.4 + u * .6, o + .2, 1.8, 5.2, 54]; camFocus = [o, 4];
    } else if (bi === 1) {
      crowd.setFace('calm'); place(D, o - 1.45, 3.9, Math.PI - .35, 'idle'); D.arms = { lx: -.4 - .3 * Math.max(0, Math.sin(lt * 3.1)), lz: -.25, rx: -2.15, rz: .1 }; D.pitch = .05 + .04 * Math.sin(lt * 4.6);
      place(T, o + 1.3, 7.0, Math.PI + .25, 'sit', sitY({ scale: 1.25, h: T.h }, .55)); T.arms = { lx: -.5, lz: -.1, rx: -2.4, rz: .15 }; T.y = .55 + .18 - .8 * 1.25 * T.h; T.pitch = lt > 3 ? .08 : 0;
      voice.visible = true; voice.position.set(o, 2.4, 5.3); voice.rotation.set(-.05, Math.sin(t * .6) * .05, 0); drawVoice(lt);
      hphone.visible = true; attach(hphone, D, 'handR', [0, -.06, .1], [-.2, 0, 0]);
      const apo = (lt > 2.5 ? 1 : 0) + (lt > 4.7 ? 1 : 0); applied = apo; if (lt > 2.6 && lt < 4.0) bD.show('sorry', o - 1.2, 3.45, 3.9); if (lt > 4.8 && lt < 6.2) bD.show('sorry', o - 1.2, 3.45, 3.9);
      cam = [o, 2.2, -3.4, o - .05, 2.0, 5.2, 56]; cnt = String(apo); lab = 'Apologies';
    } else if (bi === 2) {
      crowd.setFace('calm'); const leakT = 1.5; const spl = lt > leakT;
      const dw = smooth(clamp((lt - 2.9) / .9)); const dsit = lt > 4.05; const tWalk = smooth(clamp((lt - 4.5) / .7));
      const pt = lerp(o - 4.2, o - .6, dw);
      if (lt < 3.8) place(D, pt, 4.2, Math.PI / 2 - 1.1 * dw + 1.2 * dw, dw < 1 ? 'walk' : 'idle', 0, .6);
      else if (lt < 4.3) { place(D, o - .6, 4.2, Math.PI - .5, 'squat', lerp(0, sitY({ scale: 1.25, h: D.h }), smooth(clamp((lt - 4.0) / .3))), .3); }
      else { place(D, o - .6, 4.2, Math.PI - .5, 'sit', sitY({ scale: 1.25, h: D.h }), .3); D.arms = { lx: -.5, lz: -.15, rx: -.55, rz: .15 }; }
      if (lt < 3.8) D.arms = { lx: -.3, lz: -.1, rx: -.3, rz: .1 };
      if (lt < 4.5) { place(T, o + 1.6, 4.9, Math.PI + .3, spl ? 'panic' : 'idle', 0, .4); T.extra = 0; } else if (tWalk < 1) place(T, lerp(o + 1.6, o + .6, tWalk), lerp(4.9, 4.2, tWalk), Math.PI + .5, 'walk', 0, .5); else place(T, o + .6, 4.2, Math.PI + .5, lt > 5.3 ? 'sit' : 'squat', lt > 5.3 ? sitY({ scale: 1.25, h: T.h }) : lerp(0, sitY({ scale: 1.25, h: T.h }), smooth(clamp((lt - 5.0) / .3))), .3);
      if (lt > 5.35) T.arms = { lx: -.5, lz: -.15, rx: -.55, rz: .15 }; if (lt > 5.1 && lt < 6.0) { T.arms = T.arms || null; }
      puddle.visible = spl; { const r = lerp(.2, 3.4, 1 - Math.pow(1 - clamp((lt - leakT) / 5.3), 2)); puddle.scale.set(r, r, r); puddle.position.set(o + .1, .02, 5.2); }
      spray.visible = spl; if (spl) { const N = 220; const ft = o + .3; for (let i = 0; i < N; i++) { const ph = (i / N) + t * 1.15; const u = ph % 1; const a = i * 2.399; const sp = (.35 + .65 * ((i * 0.618) % 1)); const x = ft + Math.cos(a) * sp * 1.15 * u, z = 7.15 - Math.abs(Math.sin(a)) * sp * 1.6 * u, y = 1.8 + 6.0 * u - 6.0 * u * u * (1 + .35 * ((i * .37) % 1)); const s = y < .1 ? 0 : 1; V.set(x, Math.max(.05, y), z); SCl.set(s, s, s); M.compose(V, Q, SCl); spray.setMatrixAt(i, M); } spray.instanceMatrix.needsUpdate = true; }
      if (lt > 5.1 && lt < 7.14) bW.show('how are you\nreally doing', o - .6, 3.7, 4.2);
      cam = [o + 3.2, 2.2, -2.4, o, 1.7, 5.2, 54]; cnt = '0'; lab = 'Sinks fixed';
    } else if (bi === 3) {
      crowd.setFace('calm'); const rises = smooth(clamp((lt - 1.2) / 1.1)), falls = smooth(clamp((lt - 2.7) / 1.0)); let rent = 1800 + 2400 * rises - 3300 * falls, dir = lt < 2.4 ? (lt > 1.2 ? 1 : 0) : (lt < 3.8 ? -1 : -1); if (lt < 1.2) dir = 0; drawSign(rent, dir);
      const slide = smooth(clamp((lt - 4.0) / .6)); board.visible = slide < 1; board.position.set(o + slide * 5.2, 2.9, 5.6); board.rotation.y = 0;
      place(D, o - 1.95, 4.3, Math.PI - .3, 'idle'); D.arms = { lx: -.3, lz: -.1, rx: lt < 3.9 ? -1.9 + .2 * Math.sin(lt * 6) : -.6, rz: .1 };
      place(T, o + 1.95, 4.3, Math.PI + .3, 'idle'); T.arms = lt < 1.2 ? HOLD : lt < 2.7 ? { lx: -2.7, lz: .25, rx: -2.7, rz: -.25 } : lt < 4.1 ? { lx: -.3, lz: -.1, rx: -.3, rz: .1 } : { lx: -2.3, lz: .2, rx: -2.3, rz: -.2 }; if (lt < 2.7 && lt > 1.5) T.extra = .12;
      const su = smooth(clamp((lt - 4.1) / .7)), un = smooth(clamp((lt - 4.7) / .9)); scroll.visible = lt > 4.1; { const topY = lerp(6.5, 3.16, su), hgt = 2.9 * un + .05; scroll.position.set(o, 0, 4.9); scroll.scale.setScalar(1.25); scroll.children[0].position.y = topY - hgt / 2; scroll.children[0].scale.y = hgt / 2.9; scroll.children[1].position.y = topY; scroll.children[2].position.y = topY - hgt; }
      if (lt > 5.4) bD.show('sorry', o - 1.9, 3.6, 4.3);
      cam = [o, 2.5, -4.4, o, 2.2, 5.2, 58]; cnt = '$' + Math.round(rent).toLocaleString('en-US'); lab = 'Monthly rent'; hot = dir > 0;
    } else if (bi === 4) {
      crowd.setFace('calm'); const L = [[-1.85, 3.0], [1.85, 4.9], [-1.85, 6.9], [1.85, 8.9], [-1.85, 10.9], [1.85, 12.9]];
      L.forEach(([x, z], k) => { const q = P[2 + k]; place(q, o + x, z, x < 0 ? Math.PI / 2 + .55 : -Math.PI / 2 - .55, 'idle', 0, .4, 1.15); q.arms = { lx: -1.35, lz: -.1, rx: -1.35, rz: .1 }; q.pitch = .12; });
      place(D, o - .95, 6.2, Math.PI - .2, 'idle'); D.arms = { lx: -1.3, lz: -.1, rx: -1.3, rz: .1 }; D.pitch = .1;
      chat.visible = true; chat.position.set(o + .5, 2.2 + Math.sin(t * 1.4) * .05, 2.6); chat.rotation.set(0, 0, 0); drawChat(lt);
      if (lt > 5.0) bD.show('sorry', o - .95, 3.6, 6.2);
      cam = [o, 2.35, -3.6, o, 2.0, 6.0, 54]; cnt = String(Math.min(214, Math.floor(lt * 40))); lab = 'Unread'; hot = true;
    } else {
      crowd.setFace('shock'); const cry = [[-1.8, 1.9], [1.8, 3.1], [-1.5, 4.5], [1.6, 5.7], [-1.9, 7.1], [1.7, 8.3], [-1.4, 9.7], [1.9, 11.0], [-1.0, 6.6], [1.0, 9.0], [-1.0, 12.2], [1.1, 13.0]];
      rpos.length = 0; cry.forEach(([x, z], k) => { const q = P[2 + k]; const side = x < 0 ? 1 : -1; place(q, o + x, z, Math.PI + (x < 0 ? -.45 : .45) * (k % 3 ? 1 : .4), 'idle', 0, .4, 1.15 + (k % 3) * .05); q.arms = k % 2 ? { lx: -2.4, lz: .15, rx: -2.2, rz: -.1 } : { lx: -2.3, lz: .1, rx: -.3, rz: .1 }; q.extra = .06; q.pitch = .1 + .05 * Math.sin(lt * 9 + k); rpos.push(q); });
      const nCry = Math.min(12, 1 + Math.floor(lt * 3.2)); rpos.forEach((q, k) => { q.vis = k < nCry; });
      const dd = smooth(clamp(lt / 3.4)); place(D, o + .1, lerp(5.0, 11.0, 1 - dd) , Math.PI, 'walk', 0, .5); D.z = lerp(11.8, 4.6, dd); D.x = o + Math.sin(dd * 3) * .2; D.arms = { lx: -1.3, lz: -.2, rx: -1.3, rz: .2 }; D.anim = dd < 1 ? 'walk' : 'idle';
      tissue.visible = true; V.set(D.x, 1.3, D.z + .5); tissue.position.copy(V); tissue.rotation.y = 0; { const hl = new THREE.Vector3().setFromMatrixPosition(D.M.handL), hr = new THREE.Vector3().setFromMatrixPosition(D.M.handR); tissue.position.copy(hl).add(hr).multiplyScalar(.5).add(new THREE.Vector3(0, .05, .05)); }
      if (lt > 3.3) { banner.visible = true; const k = clamp((lt - 3.3) * 5); const sc = 1 + .4 * Math.pow(1 - k, 2) * (k < 1 ? 1 : 0); banner.scale.set(sc, sc, 1); }
      if (lt > 1.2 && lt < 3.2) bD.show('sorry', D.x + .1, 3.5, D.z);
      let n = 0; const tdrop = (q) => { const s = q.scale * q.h; const sy = Math.sin(q.yaw), cy = Math.cos(q.yaw); for (const side of [-1, 1]) for (let j = 0; j < 4; j++) { if (n >= 220) return; const u = ((t * 1.35 + j * .25 + (q.phase * .3) + (side > 0 ? .13 : 0)) % 1); const ex = q.x + s * (cy * .08 * side + sy * .25), ez = q.z + s * (-sy * .08 * side + cy * .25); const y = s * 1.7 - u * u * 1.6 * s - u * .1; tears.set(n++, ex + cy * side * u * .08, Math.max(.05, y), ez + sy * u * .15 + (-sy) * side * u * .08, q.vis ? 1 : 0); } }; rpos.forEach(tdrop); tears.done();
      cam = [o + .1 - dd * .0, 2.35, -2.8 + dd * 1.4, o, 2.0, 8.5, 54]; cnt = String(nCry); lab = 'Tenants crying'; hot = true; camFocus = [o, 6];
    }
    crowd.update(t); look.update(); look.setVisible(D.vis);
    if (bi === 0) { keys.visible = lease.visible = true; attach(keys, D, 'handR', [0, -.1, .02], [0, .0, 0]); keys.rotation.set(0, 0, 0); if (D.M.handL) attach(lease, D, 'handL', [-.05, .0, .2], [-.3, .3, 0]); keys.children.forEach((c, i) => { if (i) c.rotation.z = Math.sin(t * 7 + i) * .3; }); }
    A.cam(...cam); A.follow(camFocus[0], camFocus[1]); A.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if *Drake* became your landlord?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter(lab, cnt, NOTE[bi], 'PARODY', hot); hud.tm('');
    hud.pop(POP[bi] && lt > .5 ? POP[bi] : '', Math.min(1, (lt - .5) * 6));
  } };
}
