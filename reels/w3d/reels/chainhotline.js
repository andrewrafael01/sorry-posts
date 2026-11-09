// 660 invention chain: Drake keeps calling -> block -> courtside phone -> new number -> caption -> Canada -> Mexico dance -> ocean -> owl.
// Six small sets far apart in x; one hero object per beat (phone screens, banner, post card, globe, boarding pass, owl).
import { drakeLook, makeBubble } from './_drake.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0x0a1030, fogNear: 40, fogFar: 140, clouds: false, skyTop: 0x0a1030, skyMid: 0x1c2a55, skyBot: 0x2a3a6a, shadowExtent: 16, shadowRes: 2048, hemi: 1.2, sunI: 1.2, sunDir: [-.35, .9, .5], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const rr = (g, x, y, w, h, r, fill, stroke, lw = 6) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw; g.strokeStyle = stroke; g.stroke(); } };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const OFF = { A: 0, B: 60, C: 120, D: 180, E: 240, F: 300 }; const CUT = 40;
  const grp = (x) => { const g = new THREE.Group(); g.position.x = x; S.add(g); return g; };
  const GA = grp(OFF.A), GB = grp(OFF.B), GC = grp(OFF.C), GD = grp(OFF.D), GE = grp(OFF.E), GF = grp(OFF.F); const GS = [GA, GB, GC, GD, GE, GF];
  const bx = (G, x, y, z, w, h, d, c, o) => addBox(G, x, y, z, w, h, d, c, o);
  const backdrop = (G, x, z, c1, c2, bw = 26, bh = 18) => { const t = cvs(8, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(0, 0, w, h); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), new THREE.MeshBasicMaterial({ map: t.t, fog: false })); m.position.set(x, 0, z); G.add(m); return m; };
  const plane = (G, w, h, tex, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: !!o.tr, toneMapped: o.tm ?? false, fog: false, side: o.side || THREE.FrontSide })); m.position.set(x, y, z); G.add(m); return m; };
  const flat = (G, w, h, c, x, y, z, rx = -Math.PI / 2) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat(c)); m.rotation.x = rx; m.position.set(x, y, z); m.receiveShadow = true; G.add(m); return m; };
  const cyl = (G, rt, rb, h, c, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, o.seg || 20), o.material || mat(c, o.mat)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; G.add(m); return m; };

  // ------------------------------------------------------------------ people
  const NS = 40; const N = 2 + NS; const crowd = new Crowd(S, N, 77); const P = crowd.p; const YOU = P[0], DR = P[1];
  const colr = (i, ks, c) => ks.forEach((k) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; });
  colr(0, ['torso', 'armL', 'armR'], 0x3a78d8); colr(0, ['legL', 'legR'], 0x2b3347); colr(0, ['hair'], 0x4a2f1c);
  const look = drakeLook(lib, S, crowd, 1, { jersey: 0xc8102e }); YOU.h = 1; DR.h = 1.04; DR.scale = 1.08;
  const place = (o, x, y, z, yaw, anim, sp = .5) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = o === DR ? 1.08 : 1; o.arms = null; o.pitch = 0; o.lie = 0; };
  const hide = (o) => { o.vis = false; };
  const camLabelMk = (text, c1, c2, w = 768, size = 150, rot = 0) => { const l = cvs(w, 256, (g, ww, h) => txt(g, text, ww / 2, 134, size, c1, { stroke: c2, sw: size * .16 })); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false, fog: false, rotation: rot })); s.visible = false; s.renderOrder = 20; S.add(s); return s; };
  const lbClever = camLabelMk('CLEVER!', '#ffe23a', '#111'), lbBetter = camLabelMk('MUCH BETTER!', '#7dff6a', '#111', 1024, 140), lbBling = camLabelMk('HOTLINE BLING', '#ffe23a', '#111', 1024, 130, .06);
  const stampT = cvs(768, 320, (g, w, h) => { rr(g, 18, 18, w - 36, h - 36, 24, 'rgba(255,255,255,.9)', '#e0201b', 22); txt(g, 'BLOCKED', w / 2, h / 2 + 6, 150, '#e0201b'); });
  const stamp = new THREE.Sprite(new THREE.SpriteMaterial({ map: stampT.t, transparent: true, depthWrite: false, depthTest: false, fog: false, rotation: -.22 })); stamp.visible = false; stamp.renderOrder = 21; S.add(stamp);
  const E = new THREE.Vector3(), T2 = new THREE.Vector3(), FW = new THREE.Vector3(), UPV = new THREE.Vector3();
  const putCam = (s, d, offY, k = 1, wk = 1) => { const cam = A.camera; cam.getWorldDirection(FW); UPV.copy(cam.up).applyQuaternion(cam.quaternion).normalize(); s.position.copy(cam.position).addScaledVector(FW, d).addScaledVector(UPV, offY); const hh = 2 * d * Math.tan(cam.fov * Math.PI / 360); const a = s.material.map.image; s.scale.set(hh * .5625 * .9 * k * wk, hh * .5625 * .9 * k * (a.height / a.width) * wk, 1); s.visible = k > 0; };

  // ------------------------------------------------------------------ phone factory + screens
  const mkPhone = (G, s = 1) => { const g = new THREE.Group(); const body = new THREE.Mesh(new lib.RoundedBoxGeometry(.5 * s, 1.0 * s, .06 * s, 3, .05 * s), mat(0x14161b, { roughness: .35, metalness: .5 })); body.castShadow = true; g.add(body); const sc = cvs(512, 1024); const sm = new THREE.Mesh(new THREE.PlaneGeometry(.455 * s, .94 * s), new THREE.MeshBasicMaterial({ map: sc.t, toneMapped: false, fog: false })); sm.position.z = .0315 * s; g.add(sm); G.add(g); return { g, sc, s, draw(fn) { fn(sc.g, 512, 1024); sc.t.needsUpdate = true; } }; };
  const avatar = (g, x, y, r, who) => { g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip(); if (who === 'owl') { g.fillStyle = '#6b4a2a'; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.fillStyle = '#c99a5a'; g.beginPath(); g.ellipse(x, y + r * .35, r * .62, r * .6, 0, 0, 7); g.fill(); for (const sx of [-1, 1]) { g.fillStyle = '#fff'; g.beginPath(); g.arc(x + sx * r * .38, y - r * .12, r * .3, 0, 7); g.fill(); g.fillStyle = '#f2b81a'; g.beginPath(); g.arc(x + sx * r * .38, y - r * .12, r * .19, 0, 7); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(x + sx * r * .38, y - r * .12, r * .09, 0, 7); g.fill(); g.fillStyle = '#6b4a2a'; g.beginPath(); g.moveTo(x + sx * r * .72, y - r * .95); g.lineTo(x + sx * r * .25, y - r * .6); g.lineTo(x + sx * r * .85, y - r * .4); g.fill(); } g.fillStyle = '#f08a1a'; g.beginPath(); g.moveTo(x - r * .13, y + r * .08); g.lineTo(x + r * .13, y + r * .08); g.lineTo(x, y + r * .36); g.fill(); g.fillStyle = '#f2c230'; g.fillRect(x - r * .5, y + r * .62, r, r * .1); } else { g.fillStyle = '#4a5a8a'; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.fillStyle = '#a8764f'; g.fillRect(x - r * .5, y - r * .45, r, r * .95); g.fillStyle = '#14100d'; g.fillRect(x - r * .56, y - r * .62, r * 1.12, r * .34); for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(x - r * .46 + i * r * .185, y - r * .62, r * .12, 0, 7); g.fill(); } g.fillRect(x - r * .5, y + r * .2, r, r * .3); g.fillStyle = '#fff'; g.fillRect(x - r * .26, y + r * .12, r * .52, r * .1); g.fillStyle = '#f2c230'; g.fillRect(x - r * .55, y + r * .72, r * 1.1, r * .08); } g.restore(); g.lineWidth = 6; g.strokeStyle = '#ffffff55'; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); };
  const bell = (g, x, y, sz, ang) => { g.save(); g.translate(x, y - sz); g.rotate(ang); g.translate(0, sz); g.fillStyle = '#ffd23a'; g.beginPath(); g.moveTo(-sz * .55, sz * .5); g.quadraticCurveTo(-sz * .5, -sz * .6, 0, -sz * .62); g.quadraticCurveTo(sz * .5, -sz * .6, sz * .55, sz * .5); g.lineTo(sz * .75, sz * .62); g.lineTo(-sz * .75, sz * .62); g.closePath(); g.fill(); g.beginPath(); g.arc(0, sz * .78, sz * .16, 0, 7); g.fill(); g.fillRect(-sz * .06, -sz * .8, sz * .12, sz * .2); g.restore(); };
  const callScreen = (g, w, h, who, num, t, st, hdr) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1d2250'); gr.addColorStop(1, '#0a0c1c'); g.fillStyle = gr; g.fillRect(0, 0, w, h); txt(g, hdr, 256, 70, 46, '#9fb0e8', { w: 700 }); txt(g, 'incoming call', 256, 135, 36, '#8a96c8', { w: 600 }); const pul = 1 + .05 * Math.sin(t * 14); g.save(); g.translate(256, 300); g.scale(pul, pul); avatar(g, 0, 0, 100, who); g.restore();
    txt(g, who === 'owl' ? 'OWL' : 'DRAKE', 256, 470, 110, '#fff'); txt(g, num, 256, 548, 44, '#b8c4f0', { w: 700 }); bell(g, 256, 650, 62, Math.sin(t * 17) * .38 * (st === 'ring' || st === 'press' ? 1 : 0));
    const press = st === 'press'; rr(g, 40, 800, 200, 120, 60, press ? '#ff8a80' : '#e0302a'); txt(g, 'BLOCK', 140, 862, 50, '#fff'); rr(g, 272, 800, 200, 120, 60, '#3a3f5c'); txt(g, 'ANSWER', 372, 862, 42, '#c8d0f0'); if (who === 'owl') { rr(g, 40, 800, 200, 120, 60, '#e0302a'); txt(g, 'BLOCK', 140, 862, 50, '#fff'); }
    if (st === 'blocked') { g.fillStyle = 'rgba(30,32,44,.92)'; g.fillRect(0, 0, w, h); g.fillStyle = '#e0302a'; g.beginPath(); g.arc(256, 380, 110, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(206, 330); g.lineTo(306, 430); g.moveTo(306, 330); g.lineTo(206, 430); g.stroke(); txt(g, 'BLOCKED', 256, 590, 96, '#fff'); txt(g, 'DRAKE  ' + num, 256, 680, 40, '#b8c0d8', { w: 700 }); txt(g, 'He will not be calling again.', 256, 760, 32, '#8a90a8', { w: 600 }); } };

  // ================================================================== SET A: bedroom at night
  bx(GA, 0, -.05, 0, 16, .1, 14, 0x5b4331); bx(GA, 0, 2.6, -3.5, 14, 5.2, .2, 0x2b3454); bx(GA, 5.2, 2.6, 0, .2, 5.2, 14, 0x28304e); bx(GA, -6.0, 2.6, 0, .2, 5.2, 14, 0x28304e);
  const moonT = cvs(256, 256, (g, w, h) => { g.fillStyle = '#0c1740'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; for (let i = 0; i < 26; i++) g.fillRect((i * 97) % 256, (i * 53) % 256, 3, 3); g.fillStyle = '#fbf3c8'; g.beginPath(); g.arc(150, 100, 46, 0, 7); g.fill(); g.fillStyle = '#0c1740'; g.beginPath(); g.arc(172, 88, 40, 0, 7); g.fill(); });
  bx(GA, -3.4, 2.7, -3.36, 2.3, 2.1, .1, 0x1d2238); plane(GA, 1.9, 1.7, moonT.t, -3.4, 2.7, -3.3);
  bx(GA, -3.4, 2.7, -3.28, .06, 1.7, .05, 0x1d2238); bx(GA, -3.4, 2.7, -3.28, 1.9, .06, .05, 0x1d2238);
  bx(GA, -.7, .28, -1.4, 2.7, .55, 3.1, 0x5a3a2a); bx(GA, -.7, .6, -1.4, 2.55, .22, 2.95, 0xf1f1f5, { round: .06 }); bx(GA, -.7, .95, -3.0, 2.8, 1.9, .16, 0x4a2f22); bx(GA, -1.2, .82, -2.5, .95, .2, .55, 0xffffff, { round: .08 }); bx(GA, -.2, .82, -2.5, .95, .2, .55, 0xffffff, { round: .08 });
  bx(GA, -.7, .8, -.35, 2.6, .5, 1.75, 0x3b5ea8, { round: .1 }); bx(GA, -.7, .83, .52, 2.62, .1, .18, 0x9fb7f0);
  bx(GA, 1.55, .38, -2.35, 1.0, .76, .8, 0x4a3426); bx(GA, 1.55, .38, -1.93, .9, .06, .04, 0x2e2018);
  cyl(GA, .05, .09, .4, 0x333333, 2.0, .96, -2.5); const shade = cyl(GA, .2, .32, .32, 0xffd9a0, 2.0, 1.32, -2.5, { cast: false, material: new THREE.MeshStandardMaterial({ color: 0xffd9a0, emissive: 0xffb050, emissiveIntensity: .9 }) });
  const lamp = new THREE.PointLight(0xffb868, 7, 8); lamp.position.set(2.0, 1.5, -2.2); GA.add(lamp);
  const phoneGlow = new THREE.PointLight(0x7fa8ff, 0, 5); phoneGlow.position.set(1.4, 1.5, -1.5); GA.add(phoneGlow);
  const clockT = cvs(256, 128); const drawClock = (on) => { const g = clockT.g; g.fillStyle = '#120405'; g.fillRect(0, 0, 256, 128); txt(g, '2:00', 100, 66, 92, on ? '#ff3a2a' : '#ff3a2a', { w: 800 }); txt(g, 'AM', 214, 84, 40, '#ff3a2a', { w: 800 }); clockT.t.needsUpdate = true; }; drawClock(true);
  bx(GA, 1.15, .94, -2.2, .62, .34, .24, 0x1b1b20, { round: .04 }); plane(GA, .56, .28, clockT.t, 1.15, .94, -2.07);
  const PA = mkPhone(GA, 1.0); PA.g.position.set(1.75, 1.3, -2.12); PA.g.rotation.x = -.22; const PAbase = PA.g.position.clone();
  const finger = new THREE.Mesh(new THREE.BoxGeometry(.11, .11, .55), mat(0xe0ac86, { roughness: .6 })); finger.castShadow = true; GA.add(finger); finger.visible = false;
  YOU.arms = null;

  // ================================================================== SET B: arena
  const courtT = cvs(512, 1024, (g, w, h) => { g.fillStyle = '#c98c4c'; g.fillRect(0, 0, w, h); for (let i = 0; i < 24; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.04)'; g.fillRect(i * 22, 0, 22, h); } g.strokeStyle = '#fff'; g.lineWidth = 7; g.strokeRect(20, 20, w - 40, h - 40); g.beginPath(); g.moveTo(20, h / 2); g.lineTo(w - 20, h / 2); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 90, 0, 7); g.stroke(); g.fillStyle = 'rgba(140,20,30,.75)'; for (const y of [20, h - 20 - 230]) g.fillRect(w / 2 - 95, y, 190, 230); for (const y of [20, h - 20]) { g.beginPath(); g.arc(w / 2, y === 20 ? 250 : h - 250, 190, y === 20 ? 0 : Math.PI, y === 20 ? Math.PI : 2 * Math.PI); g.stroke(); } g.save(); g.translate(w / 2, h / 2); g.rotate(-Math.PI / 2); txt(g, 'RAPTORS', 0, 0, 120, '#c8102e', { stroke: '#fff', sw: 14 }); g.restore(); });
  const court = new THREE.Mesh(new THREE.PlaneGeometry(13, 24), new THREE.MeshStandardMaterial({ map: courtT.t, roughness: .5 })); court.rotation.x = -Math.PI / 2; court.position.set(0, .01, -5); court.receiveShadow = true; GB.add(court);
  bx(GB, 0, -.1, -5, 40, .1, 40, 0x1a1d28); const tiers = [];
  for (let k = 0; k < 4; k++) { const top = .7 * (k + 1); bx(GB, -7.4 - 1.4 * k, top / 2, -5, 1.4, top, 26, k % 2 ? 0x1b2a55 : 0x23366b); bx(GB, 7.4 + 1.4 * k, top / 2, -5, 1.4, top, 26, k % 2 ? 0x1b2a55 : 0x23366b); bx(GB, 0, top / 2, 8 + 1.4 * k, 22, top, 1.4, k % 2 ? 0x1b2a55 : 0x23366b); bx(GB, 0, top / 2, -17 - 1.4 * k, 22, top, 1.4, k % 2 ? 0x1b2a55 : 0x23366b); }
  bx(GB, 0, 5, -23, 40, 14, .4, 0x0f1220); bx(GB, -13.4, 4, -5, .3, 10, 40, 0x0f1220); bx(GB, 13.4, 4, -5, .3, 10, 40, 0x0f1220);
  for (const z of [-16.4]) { bx(GB, 0, .08, z, 6.5, .12, .12, 0xf2f2f2); } // baseline strips
  for (const z of [-15.6]) { bx(GB, 0, 1.6, z, .12, 3.2, .12, 0x333a4a); bx(GB, 0, 3.2, z + (z < 0 ? .4 : -.4), 1.8, 1.2, .08, 0xffffff, { mat: { transparent: true, opacity: .4 } }); const hoop = new THREE.Mesh(new THREE.TorusGeometry(.38, .03, 8, 20), mat(0xff6a1a)); hoop.rotation.x = Math.PI / 2; hoop.position.set(0, 2.9, z + (z < 0 ? .85 : -.85)); GB.add(hoop); }
  for (let i = 0; i < 6; i++) { bx(GB, -9 + i * 3.6, 12, -5, .5, .5, .5, 0xffffff, { cast: false, mat: { emissive: 0xffffff, emissiveIntensity: 2 } }); bx(GB, -9 + i * 3.6, 12.4, -5, .3, .1, 30, 0x2a2f40, { cast: false }); }
  // jumbotron + banner
  const jumboT = cvs(896, 512); const drawJumbo = (t, lt) => { const g = jumboT.g, w = 896, h = 512; const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a1450'); gr.addColorStop(1, '#0a0820'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#c8102e'; g.fillRect(0, 0, w, 62); txt(g, 'COURTSIDE CALL', w / 2, 33, 46, '#fff');
    g.save(); g.translate(230, 290); g.fillStyle = '#a8764f'; g.fillRect(-100, -120, 200, 230); g.fillStyle = '#14100d'; g.fillRect(-112, -150, 224, 60); for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(-96 + i * 32, -150, 22, 0, 7); g.fill(); } g.fillRect(-90, 50, 180, 70); g.fillStyle = '#fff'; g.fillRect(-26, 30, 52, 16); g.fillStyle = '#111'; g.fillRect(-62, -50, 28, 14); g.fillRect(34, -50, 28, 14); g.fillStyle = '#f2c230'; g.fillRect(-110, 128, 220, 16); g.fillRect(-26, 140, 52, 56); g.fillStyle = '#c8102e'; g.fillRect(-100, 190, 200, 60); g.restore();
    g.save(); g.translate(655, 250); g.rotate(Math.sin(t * 24) * .12); g.fillStyle = '#35d06a'; rr(g, -70, -110, 140, 230, 26, '#35d06a'); g.fillStyle = '#0a2d18'; g.fillRect(-52, -88, 104, 150); g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 90, 14, 0, 7); g.fill(); g.restore(); g.strokeStyle = '#ffd23a'; g.lineWidth = 10; g.lineCap = 'round'; for (let i = 0; i < 3; i++) { const a = ((t * 2.2 + i / 3) % 1); g.globalAlpha = 1 - a; g.beginPath(); g.arc(655, 250, 100 + a * 90, -.8, .8); g.stroke(); g.beginPath(); g.arc(655, 250, 100 + a * 90, Math.PI - .8, Math.PI + .8); g.stroke(); } g.globalAlpha = 1;
    txt(g, 'CALLING: YOU', 655, 432, 52, '#ffd23a'); txt(g, '647-555-0142', 655, 484, 44, '#fff', { w: 800 }); jumboT.t.needsUpdate = true; };
  bx(GB, 0, 7.4, -13.3, 8.2, 4.8, .5, 0x15171f); const jumbo = plane(GB, 7.8, 4.45, jumboT.t, 0, 7.4, -13.02);
  const bannerT = cvs(1024, 220, (g, w, h) => { g.fillStyle = '#c8102e'; g.fillRect(0, 0, w, h); g.fillStyle = '#7a0a1c'; g.fillRect(0, h - 22, w, 22); txt(g, 'RAPTORS', w / 2, h / 2 - 8, 170, '#fff', { stroke: '#111', sw: 16 }); }); bx(GB, 0, 10.8, -13.2, 10.6, 2.2, .3, 0x300408); plane(GB, 10.4, 2.1, bannerT.t, 0, 10.8, -13.03);
  const bannerT2 = cvs(256, 600, (g, w, h) => { g.fillStyle = '#c8102e'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, h - 100); g.lineTo(w / 2, h); g.lineTo(0, h - 100); g.fill(); g.save(); g.translate(w / 2, 280); g.rotate(-Math.PI / 2); txt(g, 'TORONTO', 0, 0, 90, '#fff', { stroke: '#111', sw: 10 }); g.restore(); });
  for (const sx of [-7, 7]) plane(GB, 1.6, 3.7, bannerT2.t, sx, 7.6, -13.0, { tr: true });
  // courtside table + red phone + chair (Drake)
  bx(GB, -6.2, .8, -3.0, .9, .1, 1.2, 0x2a2a34); bx(GB, -6.2, .4, -3.0, .12, .8, .12, 0x2a2a34); bx(GB, -5.1, .3, -4.1, .8, .5, .8, 0x15171f, { round: .06 });
  const rphone = new THREE.Group(); { const base = new THREE.Mesh(new THREE.BoxGeometry(.5, .16, .4), mat(0xd01a2a, { roughness: .3 })); const cradle = new THREE.Mesh(new THREE.BoxGeometry(.5, .08, .12), mat(0xd01a2a)); cradle.position.set(0, .11, -.1); const hs = new THREE.Mesh(new THREE.BoxGeometry(.58, .08, .1), mat(0xb01020, { roughness: .3 })); hs.position.set(0, .2, -.06); const dial = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .02, 16), mat(0xf2f2f2)); dial.position.set(0, .09, .06); rphone.add(base, cradle, hs, dial); rphone.traverse((m) => { m.castShadow = true; }); rphone.position.set(-6.1, .9, -2.6); GB.add(rphone); }
  const handset = new THREE.Mesh(new THREE.BoxGeometry(.1, .08, .55), mat(0xb01020, { roughness: .3 })); handset.castShadow = true; S.add(handset);
  const ringT = cvs(512, 160, (g, w, h) => txt(g, 'RING RING', w / 2, 84, 110, '#ffe23a', { stroke: '#111', sw: 18 })); const ringS = new THREE.Sprite(new THREE.SpriteMaterial({ map: ringT.t, transparent: true, depthTest: false, depthWrite: false, fog: false })); ringS.scale.set(.9, .28, 1); ringS.renderOrder = 15; ringS.visible = false; S.add(ringS);
  // spectators layout
  const SP = []; { let i = 0; const rs = lib.R(5); for (let side = 0; side < 3; side++) for (let k = 0; k < 3; k++) { const per = side === 2 ? 5 : 6; for (let j = 0; j < per; j++) { if (i >= NS) break; const top = .7 * (k + 1); const u = j / (per - 1) - .5; if (side === 0) SP.push({ x: -7.4 - 1.4 * k, y: top, z: -5 + u * 20 + (rs() - .5), ry: Math.PI / 2 }); else if (side === 1) SP.push({ x: 7.4 + 1.4 * k, y: top, z: -5 + u * 20 + (rs() - .5), ry: -Math.PI / 2 }); else SP.push({ x: u * 14 + (rs() - .5), y: top, z: 8 + 1.4 * k, ry: Math.PI }); i++; } } while (SP.length < NS) SP.push({ x: -8.5 - SP.length * .1, y: 1.4, z: -2, ry: Math.PI / 2 }); }
  const specCol = [0xe74c3c, 0xffffff, 0x2a3f8f, 0xf1c40f, 0xc8102e, 0x34495e, 0xffffff, 0x8e44ad]; for (let i = 0; i < NS; i++) { const c = specCol[i % 8]; colr(2 + i, ['torso', 'armL', 'armR'], c); }

  // ================================================================== SET C: new number + post card (cutaway)
  backdrop(GC, OFF.C ? 0 : 0, -9, '#2a1a4e', '#0b0a1c'); GC.children[0].position.z = -9;
  const PC = mkPhone(GC, 2.2); PC.g.position.set(0, 0, 0);
  const NUM = '647-555-0188';
  const cardT = cvs(1024, 1520); const wrapText = (g, text, x, y, maxW, lh, hlk, tt) => { const ws = text.split(' '); let line = [], cy = y; const flush = () => { let cx = x; for (const w of line) { const isN = w.startsWith('647'); const ww = g.measureText(w).width; if (isN) { const pul = .55 + .45 * Math.sin(tt * 10); g.fillStyle = hlk ? `rgba(255,222,40,${.55 + .4 * pul})` : 'rgba(255,222,40,0)'; if (hlk) g.fillRect(cx - 6, cy - lh * .62, ww + 12, lh * .96); g.fillStyle = hlk ? '#111' : '#222'; } else g.fillStyle = '#222'; g.fillText(w, cx, cy); cx += ww + g.measureText(' ').width; } cy += lh; line = []; }; for (const w of ws) { const test = [...line, w].join(' '); if (g.measureText(test).width > maxW && line.length) flush(); line.push(w); } flush(); return cy; };
  const PARAS = ['Healing is not linear. Neither is my new number, which is ' + NUM + '. Please save it.', 'I learned a lot about myself this year. Mostly that ' + NUM + ' goes to voicemail, and voicemail is a love language.', 'To everyone who said I should let it go: ' + NUM + '. I let it go. Then I let it ring. Then I let it ring again.', 'Whoever has this number, pick up. Growth is a phone call, and the phone call is ' + NUM + '. Love, me. 4:12 AM'];
  const drawCard = (tt, lt) => { const g = cardT.g, w = 1024, h = 1520; g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2f2f6'; g.fillRect(0, 0, w, 150); avatar(g, 100, 78, 52, 'drake'); g.textAlign = 'left'; g.textBaseline = 'middle'; g.font = `900 46px ${FONT}`; g.fillStyle = '#111'; g.fillText('The 6 God Account', 175, 56); g.font = `600 30px ${FONT}`; g.fillStyle = '#777'; g.fillText('parody caption  ·  4:12 AM', 175, 104);
    g.font = `500 37px ${FONT}`; let y = 215; for (let i = 0; i < 4; i++) { const on = lt > 2.0 + i * .5; y = wrapText(g, PARAS[i], 54, y, 916, 50, on, tt + i) + 22; }
    const likes = Math.round(lerp(212, 48210, smooth((lt - 1.5) / 2.6))); g.fillStyle = '#e0245e'; g.beginPath(); g.moveTo(80, h - 98); g.bezierCurveTo(50, h - 128, 62, h - 158, 90, h - 142); g.bezierCurveTo(118, h - 158, 130, h - 128, 80, h - 98); g.fill(); g.font = `900 46px ${FONT}`; g.fillStyle = '#111'; g.textAlign = 'left'; g.fillText(likes.toLocaleString('en-US') + ' likes', 150, h - 128); cardT.t.needsUpdate = true; };
  const card = plane(GC, 3.4, 5.03, cardT.t, 7, 0, 0);

  // ================================================================== SET D: globe + Toronto
  backdrop(GD, CUT, -9, '#05060f', '#101a3a'); const stars = new THREE.Group(); { const r2 = lib.R(9); for (let i = 0; i < 60; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.03, 4, 3), new THREE.MeshBasicMaterial({ color: 0xffffff })); m.position.set(CUT + (r2() - .5) * 20, (r2() - .5) * 14, -7 + r2() * 2); stars.add(m); } GD.add(stars); }
  const gT = cvs(1024, 512, (g, w, h) => { g.fillStyle = '#1f6fb5'; g.fillRect(0, 0, w, h); const X = (lo) => (lo + 180) / 360 * w, Y = (la) => (90 - la) / 180 * h; const poly = (pts, c) => { g.fillStyle = c; g.beginPath(); pts.forEach(([lo, la], i) => (i ? g.lineTo(X(lo), Y(la)) : g.moveTo(X(lo), Y(la)))); g.closePath(); g.fill(); };
    poly([[-123, 49], [-95, 49], [-83, 42], [-67, 45], [-75, 35], [-80, 25], [-97, 26], [-105, 20], [-117, 32]], '#4e9e4a'); poly([[-117, 32], [-97, 26], [-92, 18], [-87, 21], [-95, 15], [-105, 20]], '#c9a14a');
    poly([[-141, 69], [-130, 70], [-110, 72], [-95, 73], [-80, 70], [-65, 60], [-60, 52], [-55, 48], [-67, 45], [-83, 42], [-95, 49], [-123, 49], [-130, 55], [-141, 60]], '#d83a3a'); poly([[-80, 8], [-60, 10], [-35, -6], [-50, -30], [-70, -55], [-75, -20]], '#4e9e4a'); poly([[-10, 36], [30, 36], [50, 12], [30, -34], [15, -34], [-15, 10]], '#c9a14a'); poly([[-10, 40], [40, 40], [60, 70], [30, 70]], '#4e9e4a'); poly([[50, 10], [140, 10], [150, 50], [110, 70], [60, 60]], '#4e9e4a'); poly([[112, -12], [153, -12], [150, -38], [115, -34]], '#c9a14a'); poly([[-60, 80], [-20, 80], [-30, 62], [-55, 62]], '#fff'); txt(g, 'CANADA', X(-100), Y(58), 44, '#fff', { stroke: '#7a1010', sw: 8 }); });
  const globe = new THREE.Mesh(new THREE.SphereGeometry(1.7, 48, 32), new THREE.MeshStandardMaterial({ map: gT.t, roughness: .8 })); globe.position.set(CUT, 0, 0); globe.castShadow = true; GD.add(globe);
  const planeM = new THREE.Group(); { const f = new THREE.Mesh(new THREE.BoxGeometry(.12, .12, .55), mat(0xffffff)); const wg = new THREE.Mesh(new THREE.BoxGeometry(.6, .03, .16), mat(0xe0e6f0)); wg.position.z = .02; const tl = new THREE.Mesh(new THREE.BoxGeometry(.24, .03, .1), mat(0xc8102e)); tl.position.z = -.24; const fin = new THREE.Mesh(new THREE.BoxGeometry(.03, .16, .1), mat(0xc8102e)); fin.position.set(0, .08, -.24); planeM.add(f, wg, tl, fin); planeM.scale.setScalar(1.6); GD.add(planeM); }
  const pin = new THREE.Mesh(new THREE.ConeGeometry(.22, .6, 12), mat(0xffe23a, { emissive: 0xffa000, emissiveIntensity: .6 })); pin.rotation.x = Math.PI; GD.add(pin);
  // Toronto
  { const tt = cvs(256, 256, (g, w, h) => { g.fillStyle = '#9ab09a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#7e957e'; g.lineWidth = 3; for (let i = 0; i < 8; i++) { g.strokeRect(0, i * 32, w, 32); } }); }
  flat(GD, 90, 60, 0x8aa48a, 0, 0, 5); flat(GD, 90, 40, 0x2f86c4, 0, .02, -34); bx(GD, 0, -.04, -13, 70, .1, 2, 0xb8b09a);
  const rsk = lib.R(12); for (let i = 0; i < 26; i++) { const x = -28 + i * 2.3 + (rsk() - .5), h = 3 + rsk() * 7.5, d = 1.8 + rsk() * 1.4; bx(GD, x, h / 2, -15 - rsk() * 3, 1.8 + rsk() * .8, h, d, [0x6d8fb3, 0x86a6c8, 0x5b7a9c, 0x9db6d0][i % 4], { mat: { metalness: .3, roughness: .35 } }); }
  cyl(GD, .4, .75, 9.5, 0xcfd3d8, 5.5, 4.75, -13.2, { seg: 14 }); cyl(GD, 1.5, 1.5, .55, 0xc2c7cf, 5.5, 9.6, -13.2, { seg: 22 }); cyl(GD, .75, 1.3, .45, 0xb4b9c2, 5.5, 9.2, -13.2, { seg: 22 }); cyl(GD, .22, .35, 3.1, 0xb4b9c2, 5.5, 11.45, -13.2); cyl(GD, .04, .16, 5.5, 0xd8dce2, 5.5, 15.2, -13.2);
  const signT = cvs(1024, 400, (g, w, h) => { g.fillStyle = '#12306b'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f2c230'; g.lineWidth = 14; g.strokeRect(20, 20, w - 40, h - 40); txt(g, 'WELCOME', w / 2 - 190, 130, 116, '#fff'); txt(g, 'TO THE', w / 2 - 250, 270, 96, '#fff'); txt(g, '6', w / 2 + 270, h / 2 + 10, 340, '#f2c230', { stroke: '#7a5a00', sw: 20 }); });
  const sign = new THREE.Group(); GD.add(sign); sign.position.set(-.6, 0, -3); bx(sign, 0, 2.7, 0, 5.6, 2.2, .22, 0x0a1a3c); plane(sign, 5.4, 2.1, signT.t, 0, 2.7, .125); bx(sign, -2.5, 1.0, -.05, .2, 2.0, .2, 0x4a4a52); bx(sign, 2.5, 1.0, -.05, .2, 2.0, .2, 0x4a4a52);
  const flagT = cvs(512, 256, (g, w, h) => { g.fillStyle = '#e0201b'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.fillRect(w * .25, 0, w * .5, h); g.fillStyle = '#e0201b'; g.beginPath(); const cx = w / 2, cy = h / 2 + 6, R = 74; for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2 - Math.PI / 2; const r = [1, .55, .9, .5, 1, .6][i % 6] * R * (i % 2 ? .62 : 1); g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } g.closePath(); g.fill(); g.fillRect(cx - 5, cy + 30, 10, 56); });
  cyl(GD, .06, .06, 6, 0xcccccc, 5.4, 3, -2.2); const flagM = plane(GD, 2.4, 1.2, flagT.t, 6.6, 5.2, -2.2, { side: THREE.DoubleSide }); flagM.geometry.translate(0, 0, 0);
  const suitcase = new THREE.Mesh(new lib.RoundedBoxGeometry(.5, .75, .28, 3, .05), mat(0x2a7a58, { roughness: .5 })); suitcase.castShadow = true; GD.add(suitcase);
  const maple = camLabelMk('CANADA', '#ff5a4a', '#fff', 768, 150); maple.material.rotation = -.08;
  const phoneD = mkPhone(GD, .55); phoneD.g.visible = false;

  // ================================================================== SET E: Mexican apartment + boarding pass
  flat(GE, 14, 10, 0xb5532d, 0, 0, 0); const rugT = cvs(256, 192, (g, w, h) => { g.fillStyle = '#e8d9b8'; g.fillRect(0, 0, w, h); const cols = ['#c8102e', '#1b8a8f', '#f2a90a', '#2a3f8f']; for (let i = 0; i < 6; i++) { g.strokeStyle = cols[i % 4]; g.lineWidth = 10; g.strokeRect(10 + i * 14, 10 + i * 12, w - 20 - i * 28, h - 20 - i * 24); } }); plane(GE, 5.2, 3.9, rugT.t, 0, .03, -.8).rotation.x = -Math.PI / 2;
  bx(GE, 0, 2.5, -4.3, 14, 5, .2, 0xe8a33a); bx(GE, 0, .2, -4.18, 14, .4, .1, 0xc8652a, { cast: false }); bx(GE, -5.1, 2.5, -2.4, .2, 5, 3.8, 0xdc8a3a); bx(GE, -5.1, 2.5, 3.1, .2, 5, 2.8, 0xdc8a3a); bx(GE, -5.1, 4.3, .7, .2, 1.3, 1.6, 0xdc8a3a); bx(GE, -5.1, 1.8, 3.6, .22, .1, 1.0, 0x6b3a1c);
  bx(GE, -5.1, 1.0, .0, .22, 2.0, .12, 0x6b3a1c); bx(GE, -5.1, 1.0, 1.4, .22, 2.0, .12, 0x6b3a1c); bx(GE, 5.1, 2.5, -1, .2, 5, 6, 0xdc8a3a);
  const winT = cvs(512, 420, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#4aa8f0'); gr.addColorStop(1, '#bfe6ff'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#ffe14a'; g.beginPath(); g.arc(400, 90, 56, 0, 7); g.fill(); g.fillStyle = '#c98a4a'; g.beginPath(); g.moveTo(0, 300); g.lineTo(120, 200); g.lineTo(240, 290); g.lineTo(360, 210); g.lineTo(512, 300); g.lineTo(512, 420); g.lineTo(0, 420); g.fill(); g.fillStyle = '#2e8a3a'; g.fillRect(90, 250, 34, 130); g.fillRect(60, 285, 34, 16); g.fillRect(60, 270, 14, 30); g.fillRect(124, 300, 34, 14); g.fillRect(144, 285, 14, 30); });
  bx(GE, 2.8, 2.6, -4.18, 2.5, 2.1, .1, 0x1b8a8f); plane(GE, 2.2, 1.8, winT.t, 2.8, 2.6, -4.1);
  const mxT = cvs(256, 160, (g, w, h) => { g.fillStyle = '#0a8a3a'; g.fillRect(0, 0, 85, h); g.fillStyle = '#fff'; g.fillRect(85, 0, 86, h); g.fillStyle = '#d4202c'; g.fillRect(171, 0, 85, h); g.fillStyle = '#8a5a2a'; g.beginPath(); g.arc(128, 80, 24, 0, 7); g.fill(); }); bx(GE, -2.2, 3.2, -4.15, 2.0, 1.3, .06, 0x3a2a1a); plane(GE, 1.85, 1.15, mxT.t, -2.2, 3.2, -4.1);
  bx(GE, -2.2, .55, -3.4, 3.2, .7, 1.2, 0x1b8a8f, { round: .1 }); bx(GE, -2.2, 1.15, -3.85, 3.2, .8, .35, 0x1b8a8f, { round: .1 }); bx(GE, -3.7, .85, -3.4, .35, .5, 1.2, 0x167a7e, { round: .08 }); bx(GE, -.7, .85, -3.4, .35, .5, 1.2, 0x167a7e, { round: .08 });
  cyl(GE, .4, .3, .6, 0xb5532d, 4.2, .3, -3.5); for (let i = 0; i < 6; i++) { const lf = new THREE.Mesh(new THREE.SphereGeometry(.34, 8, 6), mat(0x2a9a3a)); lf.position.set(4.2 + Math.cos(i) * .3, 1.0 + (i % 3) * .3, -3.5 + Math.sin(i) * .3); lf.scale.y = 1.4; lf.castShadow = true; GE.add(lf); }
  const pic = []; { const cs = [0xe0201b, 0xffe23a, 0x2aa83a, 0x2a7aff, 0xff7aa2, 0xff9a1a, 0xffffff]; for (let i = 0; i < 14; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(.62, .46), new THREE.MeshBasicMaterial({ color: cs[i % 7], side: THREE.DoubleSide })); m.position.set(-5 + i * .78 + .4, 4.45, -4.0); GE.add(m); pic.push(m); } bx(GE, 0, 4.7, -4.05, 11, .03, .03, 0x333333, { cast: false }); }
  const phE = mkPhone(GE, .45); phE.g.position.set(1.1, .33, -.2); phE.g.rotation.set(-Math.PI / 2 + .08, 0, .5); phE.draw((g, w, h) => callScreen(g, w, h, 'drake', '647-555-0188', 0, 'ring', '4:12 AM')); bx(GE, 1.1, .16, -.2, .6, .02, .6, 0xe8d9b8, { cast: false });
  const bagE = new THREE.Mesh(new lib.RoundedBoxGeometry(.5, .75, .28, 3, .05), mat(0x2a7a58, { roughness: .5 })); bagE.castShadow = true; GE.add(bagE);
  const lbMex = camLabelMk('MEXICO', '#7dff6a', '#111', 768, 150);
  // boarding pass
  backdrop(GE, CUT, -9, '#0a2a4a', '#04101e');
  const passT = cvs(1024, 560, (g, w, h) => { g.fillStyle = '#f6f2e6'; g.fillRect(0, 0, w, h); g.fillStyle = '#12306b'; g.fillRect(0, 0, w, 90); txt(g, 'BOARDING PASS', 40, 46, 56, '#fff', { al: 'left' }); txt(g, 'PARODY AIR', w - 40, 46, 40, '#f2c230', { al: 'right' });
    g.fillStyle = '#d6d2c2'; g.fillRect(0, 300, w, 6); txt(g, 'PASSENGER', 40, 130, 28, '#888', { al: 'left', w: 700 }); txt(g, 'DRAKE', 40, 190, 90, '#111', { al: 'left' }); txt(g, 'TORONTO  →  MEXICO CITY', 40, 262, 52, '#12306b', { al: 'left' }); txt(g, 'DEPARTED  9:05 AM', 40, 350, 46, '#111', { al: 'left' }); txt(g, 'LANDED  11:10 AM', 40, 410, 46, '#16a34a', { al: 'left' }); txt(g, 'YOU  boards  6:30 PM', 40, 490, 46, '#999', { al: 'left' });
    g.save(); g.translate(790, 420); g.rotate(-.2); rr(g, -170, -64, 340, 128, 14, null, '#16a34a', 10); txt(g, 'ARRIVED', 0, 4, 82, '#16a34a'); g.restore(); for (let i = 0; i < 26; i++) { g.fillStyle = '#111'; g.fillRect(660 + i * 12, 130, 4 + (i * 7 % 5), 120); } });
  const passM = plane(GE, 4.4, 2.4, passT.t, CUT, 0, 0); const passShadow = bx(GE, CUT + .12, -.12, -.12, 4.4, 2.4, .04, 0x000000, { cast: false, mat: { transparent: true, opacity: .35 } });

  // ================================================================== SET F: ocean + owl
  backdrop(GF, 0, -80, '#7fc4ff', '#dff1ff', 400, 200); const sea = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), new THREE.MeshStandardMaterial({ color: 0x1f86c4, roughness: .25, metalness: .1 })); sea.rotation.x = -Math.PI / 2; sea.receiveShadow = true; sea.position.y = 0; GF.add(sea);
  bx(GF, -7, .3, 0, 7, .6, 3.6, 0xb89868); bx(GF, -7, .64, 0, 7, .08, 3.6, 0xc9a878); for (let i = 0; i < 8; i++) bx(GF, -9.8 + i * .8, .1, 1.9, .2, .8, .2, 0x6b4a2a);
  const waves = []; { const rw = lib.R(4); for (let i = 0; i < 40; i++) { const w = bx(GF, -8 + rw() * 30, .03, -rw() * 24 - 2, 1.5 + rw() * 2, .04, .18, 0xffffff, { cast: false }); w.userData.p = rw() * 6; waves.push(w); } }
  bx(GF, 6.4, .6, -5, 3.2, 1.8, 2.8, 0x6e6a66, { round: .2 }); bx(GF, 5.6, .5, -4.2, 2.2, 1.4, 2.2, 0x7d7873, { round: .2 }); bx(GF, 7.3, .9, -5.3, 2.4, 2.2, 2.2, 0x66625e, { round: .2 });
  const owl = new THREE.Group(); owl.position.set(6.6, 2.5, -4.8); GF.add(owl); const brown = 0x7a5530, tan = 0xd4a96a;
  { const o = (m) => { m.castShadow = true; owl.add(m); return m; }; const B = (w, h, d, c, x, y, z, ro = .12) => { const m = new THREE.Mesh(new lib.RoundedBoxGeometry(w, h, d, 3, ro), mat(c, { roughness: .8 })); m.position.set(x, y, z); return o(m); };
    B(2.0, 2.3, 1.5, brown, 0, 1.15, 0, .3); B(1.4, 1.7, .2, tan, 0, 1.0, .72, .1); const head = B(2.1, 1.3, 1.5, brown, 0, 2.7, 0, .3); B(.5, .55, .3, brown, -.8, 3.5, 0, .1).rotation.z = .3; B(.5, .55, .3, brown, .8, 3.5, 0, .1).rotation.z = -.3;
    for (const sx of [-1, 1]) { const w = o(new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .1, 24), mat(0xffffff))); w.rotation.x = Math.PI / 2; w.position.set(sx * .55, 2.8, .76); const ir = o(new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .12, 24), mat(0xf2b81a))); ir.rotation.x = Math.PI / 2; ir.position.set(sx * .55, 2.8, .78); const pu = o(new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, .14, 16), mat(0x111111))); pu.rotation.x = Math.PI / 2; pu.position.set(sx * .55, 2.8, .8); B(.55, 1.8, .6, 0x6a4626, sx * 1.15, 1.2, .15, .2).rotation.z = sx * -.12; }
    const beak = o(new THREE.Mesh(new THREE.ConeGeometry(.25, .5, 4), mat(0xf08a1a))); beak.rotation.x = Math.PI / 2; beak.position.set(0, 2.4, .95); B(.25, .35, .2, 0xf08a1a, -.3, .12, .75, .05); B(.25, .35, .2, 0xf08a1a, .3, .12, .75, .05);
    const gold = new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: .9, roughness: .25 }); const ch = o(new THREE.Mesh(new THREE.TorusGeometry(.75, .07, 8, 28), gold)); ch.position.set(0, 1.85, .45); ch.rotation.x = Math.PI / 2 - .35; const pend = o(new THREE.Mesh(new THREE.BoxGeometry(.4, .46, .08), gold)); pend.position.set(0, 1.15, .82); }
  const phO = mkPhone(GF, 1.15); const phT = mkPhone(GF, .7);
  phT.draw((g, w, h) => callScreen(g, w, h, 'drake', '647-555-0188', 0, 'ring', '4:12 AM'));
  const splash = []; for (let i = 0; i < 14; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(.08, 6, 5), mat(0xdff4ff)); d.visible = false; GF.add(d); splash.push(d); } const ring = new THREE.Mesh(new THREE.TorusGeometry(1, .06, 6, 28), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })); ring.rotation.x = Math.PI / 2; ring.visible = false; GF.add(ring);
  const bub = makeBubble(lib, S, 3.8, 1.5);

  const tvC = cvs(540, 960); const tvM = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: tvC.t, transparent: true, depthTest: false, depthWrite: false, toneMapped: false, fog: false })); tvM.renderOrder = 18; tvM.visible = false; S.add(tvM);
  const drawTv = (t, lt) => { const g = tvC.g, w = 540, h = 960; g.clearRect(0, 0, w, h); g.fillStyle = '#0b0b0e'; g.beginPath(); g.rect(0, 0, w, h); g.roundRect(34, 70, w - 68, h - 220, 40); g.fill('evenodd'); g.fillStyle = 'rgba(0,0,0,.14)'; for (let y = 70; y < h - 150; y += 6) g.fillRect(34, y, w - 68, 2); rr(g, 54, 100, 120, 44, 10, '#e0201b'); txt(g, 'LIVE', 114, 123, 30, '#fff'); txt(g, 'ARENA CAM  ·  CH 6', w / 2, h - 90, 34, '#bbb', { w: 700 }); g.fillStyle = '#e0201b'; g.beginPath(); g.arc(w - 80, h - 90, 10 + 3 * Math.sin(t * 8), 0, 7); g.fill(); tvC.t.needsUpdate = true; };
  // ------------------------------------------------------------------ camera rig
  const rv = (v) => (typeof v === 'function' ? v() : v);
  const rig = (lt, shots, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35); const e0 = rv(s[1]), e1 = rv(s[2]), g0 = rv(s[3]), g1 = rv(s[4]);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .03 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .025 + Math.cos(t * 57) * shake; E.z += Math.cos(t * .8) * .03; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .01); };
  const sky = A.sky.material.uniforms;
  const MOODS = [
    { top: 0x0a1030, mid: 0x1c2a55, bot: 0x2a3a6a, fog: 0x0a1030, hemi: .5, sun: .25, sc: 0x8aa0ff, ex: 1.25 },
    { top: 0x10141f, mid: 0x1a2236, bot: 0x2a3044, fog: 0x1a2236, hemi: 1.7, sun: 1.5, sc: 0xfff1d8, ex: 1.1 },
    { top: 0x1a1030, mid: 0x2a1a4e, bot: 0x2a1a4e, fog: 0x2a1a4e, hemi: 1.8, sun: 1.5, sc: 0xfff1d8, ex: 1.05 },
    { top: 0x3f86d8, mid: 0x9cc8f0, bot: 0xe2eef9, fog: 0xbcd8ee, hemi: 1.7, sun: 2.2, sc: 0xfff1d8, ex: 1.1 },
    { top: 0xf2a65a, mid: 0xf6c98a, bot: 0xfbe6c4, fog: 0xf6d8aa, hemi: 1.7, sun: 2.0, sc: 0xffe2b0, ex: 1.1 },
    { top: 0x3f86d8, mid: 0x9cc8f0, bot: 0xe2eef9, fog: 0xbcd8ee, hemi: 1.7, sun: 2.3, sc: 0xfff1d8, ex: 1.1 }];
  const CALLS = [[0, 3], [3, 11], [11, 47], [47, 128], [128, 409], [409, 1337]]; const NOTE = ['unknown caller at 2:00 AM', 'courtside phone, all 19,800 seats', 'the caption has a number in it', 'welcome to the 6', 'hotline bling in the living room', 'the owl has his number'];
  const DUR = tl.beats.map((b) => b.dur);

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    let set = bi; if (bi === 1 && lt < 1.3) set = 0; if (bi === 3 && lt >= 0) set = 3;
    GS.forEach((g, i) => (g.visible = i === set)); const mo = MOODS[set]; sky.top.value.set(mo.top); sky.mid.value.set(mo.mid); sky.bot.value.set(mo.bot); S.fog.color.set(mo.fog); A.hemi.intensity = mo.hemi; A.sun.intensity = mo.sun; A.sun.color.set(mo.sc); A.renderer.toneMappingExposure = mo.ex; A.fogc.set(mo.fog);
    for (const o of P) o.vis = false; let followX = OFF['ABCDEF'[set]]; let shake = 0; let faceShock = false; let labelK = 0; let stampK = 0;
    [lbClever, lbBetter, lbBling, stamp, maple, lbMex, ringS].forEach((s) => (s.visible = false)); bub.hide(); finger.visible = false; handset.visible = false; planeM.visible = false; pin.visible = false;
    const WALL = -3.2;

    if (set === 0) {
      // ---------------- bedroom at 2 AM; phone rings, YOU taps BLOCK
      const bl = bi === 0 ? lt : 99; const st = bi === 1 ? 'blocked' : bl < 2.88 ? 'ring' : bl < 3.05 ? 'press' : 'blocked';
      PA.draw((g, w, h) => callScreen(g, w, h, 'drake', '416-555-0100', t, st, '2:00 AM'));
      const ringing = st === 'ring'; PA.g.position.set(PAbase.x + (ringing ? Math.sin(t * 52) * .012 : 0), PAbase.y + (ringing ? Math.abs(Math.sin(t * 26)) * .01 : 0), PAbase.z); PA.g.rotation.z = ringing ? Math.sin(t * 47) * .03 : 0; phoneGlow.intensity = st === 'blocked' ? 1.5 : 5 + 3 * Math.sin(t * 14);
      place(YOU, -.7, -.02, -1.8, 0, 'sit', .3); YOU.pitch = .08; const wake = bi === 0 ? smooth(lt / .6) : 1; YOU.arms = { lx: -.9 * wake, lz: -.12, rx: -1.0 * wake, rz: .12 }; faceShock = false;
      if (bi === 0 && lt > 2.15 && lt < 3.2) { const k = lt < 2.85 ? smooth((lt - 2.15) / .7) : 1 - smooth((lt - 3.0) / .2); const bp = V3((140 / 512 - .5) * .455, (.5 - 862 / 1024) * .94, .035); PA.g.updateMatrixWorld(true); const wp = PA.g.localToWorld(bp.clone()); finger.visible = k > .001; finger.position.set(wp.x + .25 * (1 - k) - .02, wp.y - .45 * (1 - k) - .05, wp.z + .3 + .55 * (1 - k)); finger.rotation.set(.35 * (1 - k), -.1, 0); finger.updateMatrixWorld(true); }
      if (bi === 0 && lt > 3.1) stampK = smooth((lt - 3.1) / .12) * (1 + .12 * Math.exp(-(lt - 3.2) * 9) * Math.sin((lt - 3.2) * 30));
      if (bi === 1) labelK = Math.min(1.1, (lt - .05) * 6) * (lt < 1.3 ? 1 : 0);
      const PH = V3(1.75, 1.28, -2.1);
      if (bi === 0) rig(lt, [[0, [.2, 1.75, 5.2], [.6, 1.7, 4.4], [.2, 1.2, -1.9], [.7, 1.2, -2.0], 52, 48], [1.35, [1.75, 1.45, .6], [1.75, 1.4, .2], [1.75, 1.27, -2.1], [1.75, 1.27, -2.1], 38, 36], [2.1, [1.75, 1.34, 1.0], [1.75, 1.3, .55], [1.75, 1.27, -2.1], [1.75, 1.27, -2.1], 36, 34], [3.3, [1.75, 1.3, .55], [1.2, 1.9, 3.0], [1.75, 1.27, -2.1], [1.2, 1.3, -2.1], 34, 46]], t, ringing ? .004 : 0);
      else rig(lt, [[0, [1.75, 1.3, .55], [1.75, 1.3, .75], [1.75, 1.27, -2.1], [1.75, 1.27, -2.1], 34, 34]], t);
      A.follow(OFF.A, -1);
    } else if (set === 1) {
      // ---------------- arena
      drawJumbo(t, lt); const turn = bi === 1 ? smooth((lt - 4.75) / .6) : 0; const camAt = V3(OFF.B - 1.5, 2.3, -5); faceShock = lt > 4.8;
      SP.forEach((s, i) => { const o = P[2 + i]; const cheer = i % 3 === 0 ? 'jump' : 'idle'; place(o, OFF.B + s.x, s.y, s.z, s.ry, turn > 0 ? 'idle' : cheer, 1 + (i % 4) * .15); o.phase = i * 1.3; if (s.y < .8 && turn <= 0) o.anim = 'idle'; const ty = Math.atan2(camAt.x - o.x, camAt.z - o.z); o.yaw = lerp(s.ry, ty, turn); if (turn > 0) { o.arms = null; } });
      place(DR, OFF.B - 5.1, -.12, -4.1, Math.PI / 2, 'sit', .3); DR.pitch = .04; const ringPh = Math.sin(t * 30); DR.arms = { lx: -.35, lz: .1, rx: -2.1, rz: -.2 }; DR.vis = true; look.setVisible(true);
      handset.visible = true; attach(handset, DR, 'handR', [0, -.08, .02], [.0, 0, 0]); handset.position.x += 0; rphone.rotation.z = ringPh * .03; ringS.visible = bi === 1 && lt > 1.9 && lt < 3.4; ringS.position.set(OFF.B - 6.1, 1.7 + Math.abs(ringPh) * .06, -2.6);
      const D0 = [OFF.B, 0, 0]; const cx = OFF.B;
      rig(lt, [[1.3, [cx + 0, 3.6, 7.2], [cx + .3, 3.2, 5.6], [cx, 3.2, -9], [cx, 4.5, -9], 56, 54], [2.2, [cx - 2.4, 1.9, .9], [cx - 3.4, 1.8, -.2], [cx - 5.6, 1.35, -3.0], [cx - 5.8, 1.3, -3.0], 52, 46], [3.35, [cx - .6, 2.6, 5.2], [cx, 3.4, 3.6], [cx, 7.8, -13], [cx, 8.2, -13], 50, 48], [4.7, [cx - 1.5, 2.3, -5], [cx - 1.4, 2.3, -5], [cx - 9, 2.5, -5], [cx - 9, 2.6, -5], 64, 62]], t);
      if (bi === 1 && lt >= 4.7) { /* TV bezel on camera */ }
      lbClever.visible = false; A.follow(OFF.B, -4);
    } else if (set === 2) {
      // ---------------- new number + four paragraph card
      const slide = smooth((lt - 1.3) / .35); const rot = Math.sin(t * .8) * .05; PC.g.position.set(-slide * 4, 0, 0); card.position.set(4 * (1 - slide), 0, 0); PC.g.rotation.y = rot; PC.g.rotation.x = .03;
      PC.draw((g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#102a1a'); gr.addColorStop(1, '#06120c'); g.fillStyle = gr; g.fillRect(0, 0, w, h); txt(g, 'Settings', 256, 70, 44, '#9fd8b0', { w: 700 }); g.fillStyle = '#16a34a'; g.beginPath(); g.arc(256, 250, 96, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 24; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(206, 255); g.lineTo(244, 295); g.lineTo(312, 212); g.stroke(); txt(g, 'NEW NUMBER', 256, 450, 70, '#fff'); const nn = Math.min(NUM.length, Math.floor(lt * 14)); txt(g, NUM.slice(0, nn), 256, 540, 66, '#ffe23a', { w: 900 }); txt(g, 'Only you have this one.', 256, 640, 36, '#9fd8b0', { w: 600 }); rr(g, 70, 790, 372, 110, 55, '#16a34a'); txt(g, 'SAVED', 256, 846, 52, '#fff'); });
      drawCard(t, lt); card.visible = true; PC.g.visible = true;
      const C = OFF.C; rig(lt, [[0, [C, .15, 5.0], [C, .1, 4.5], [C, 0, 0], [C, 0, 0], 40, 38], [1.3, [C, .3, 9.4], [C, .2, 9.2], [C, 0, 0], [C, 0, 0], 42, 42], [2.2, [C, .3, 9.4], [C, -.1, 8.5], [C, 0, 0], [C, -.1, 0], 40, 40]], t);
      A.follow(OFF.C, 0);
    } else if (set === 3) {
      // ---------------- globe -> Toronto
      if (lt < 2.2) {
        const cx = OFF.D + CUT; globe.rotation.set(.55, lerp(-1.3, .15, smooth(lt / 1.7)) , 0); globe.visible = true; stars.visible = true; planeM.visible = true; pin.visible = false; followX = cx;
        const a = smooth((lt - .1) / 1.9); const d0 = V3(.3, .25, 1).normalize(), d1 = V3(-.15, .85, .5).normalize(); const dir = d0.clone().lerp(d1, a).normalize(); const rad = 1.7 + .35 + Math.sin(a * Math.PI) * .45; const pos = dir.clone().multiplyScalar(rad); planeM.position.set(CUT + pos.x, pos.y, pos.z); const nxt = d0.clone().lerp(d1, Math.min(1, a + .02)).normalize().multiplyScalar(rad); planeM.lookAt(CUT + nxt.x, nxt.y, nxt.z); const bob = Math.sin(t * 5) * .06; pin.position.set(CUT + .1, 2.55 + bob + .0, 1.3); pin.position.y = 1.55 + Math.abs(Math.sin(t * 6)) * .2; pin.position.set(CUT - .35, 1.8 + Math.abs(Math.sin(t * 6)) * .2, 1.6);
        if (lt > 1.2) { putCam(maple, 4.5, -.15, Math.min(1, (lt - 1.2) * 5) * (lt > 2.0 ? 0 : 1), 1); maple.position.y += 0; }
        rig(lt, [[0, [cx + .5, 1.2, 12.5], [cx, .9, 10.8], [cx, .2, 0], [cx, .7, 0], 40, 36]], t);
        A.sun.intensity = 2.0; A.hemi.intensity = 1.0; S.fog.color.set(0x05060f); sky.top.value.set(0x05060f); sky.mid.value.set(0x0a1230); sky.bot.value.set(0x101a3a);
        globe.visible = true; sign.visible = true; // keep set simple
      } else {
        stars.visible = false; globe.visible = false; followX = OFF.D;
        const l2 = lt - 2.2; const wx = lerp(-8.0, -4.0, smooth(l2 / 1.4)); place(YOU, OFF.D + wx, 0, 2.2, 1.45, l2 < 1.5 ? 'walk' : 'idle', .55); YOU.arms = { lx: -.2, lz: -.15, rx: l2 < 1.5 ? -.15 : -.6, rz: .12 }; suitcase.visible = true; suitcase.position.set(wx + .45, .42, 2.45); suitcase.rotation.y = 1.45;
        const dsh = lt >= 3.5; place(DR, OFF.D + 3.7, 0, -2.2, -.35, 'idle', .5); DR.vis = lt >= 3.3; DR.arms = { lx: -.3, lz: .1, rx: -2.5 + Math.sin(t * 9) * .35, rz: -.3 }; look.setVisible(DR.vis);
        faceShock = lt > 3.6; flagM.rotation.y = Math.sin(t * 3) * .2; flagM.position.z = -2.2 + Math.sin(t * 3) * .1; sign.scale.setScalar(lt > 3.4 ? 1 + .06 * Math.exp(-(lt - 3.4) * 7) * Math.sin((lt - 3.4) * 30) : 1);
        if (lt >= 2.2) labelK = lt > 2.25 && lt < 3.45 ? Math.min(1.1, (lt - 2.25) * 6) : 0; if (lt > 3.5) { putCam(maple, 4.5, 3.2, Math.min(1.1, (lt - 3.5) * 6), 1); maple.visible = true; }
        rig(lt, [[2.2, [OFF.D - 1.5, 2.4, 12.5], [OFF.D - .5, 2.5, 11.2], [OFF.D - 1.6, 1.8, 0], [OFF.D - .6, 2.3, -3], 58, 56], [3.3, [OFF.D - .5, 2.6, 11.5], [OFF.D, 3.0, 10.2], [OFF.D - .3, 2.8, -3], [OFF.D, 3.0, -3], 58, 56]], t);
        }
      A.follow(followX, 0);
    } else if (set === 4) {
      // ---------------- Mexico apartment
      const fx = OFF.E; const entering = lt < 2.0; const dance = lt >= 3.2;
      const pic2 = pic; pic2.forEach((m, i) => { m.rotation.z = Math.sin(t * 2 + i) * .12; });
      const wlk = clamp(lt / 1.8); const yx = dance ? -3.3 : lerp(-6.8, -3.3, smooth(wlk)); place(YOU, fx + yx, 0, .7, Math.PI / 2, wlk < 1 ? 'walk' : 'idle', .6);
      if (!dance) YOU.arms = { lx: -.2, lz: -.15, rx: -.3, rz: .12 }; else { YOU.arms = { lx: -2.4, lz: -.35, rx: -2.5, rz: .35 }; YOU.pitch = -.12; faceShock = true; }
      bagE.visible = true; bagE.position.set(yx + .5, .42, .98); bagE.rotation.y = Math.PI / 2;
      if (dance) { const s1 = Math.sin(t * 4.4), s2 = Math.sin(t * 2.2); place(DR, fx + .6 + s2 * .5, Math.abs(s1) * .05, -.9, -.4 + s2 * .45, 'walk', .45); DR.pitch = .12 * Math.sin(t * 4.4 + 1); DR.arms = { lx: -1.15 + s1 * .85, lz: -.5, rx: -1.15 - s1 * .85, rz: .5 }; DR.vis = true; look.setVisible(true); }
      if (lt >= 2.0 && lt < 3.2) { DR.vis = false; look.setVisible(false); }
      // boarding pass cutaway
      const inPass = lt >= 2.0 && lt < 3.2; passM.visible = inPass; passShadow.visible = inPass; if (inPass) { const k = smooth((lt - 2.0) / .35); passM.position.set(CUT, 0, 0); passM.rotation.z = lerp(.12, -.03, k) + Math.sin(t * 2) * .01; passM.scale.setScalar(lerp(.7, 1, k)); }
      if (inPass) followX = OFF.E + CUT; if (lt > 6.0 && lt < 7.5) putCam(lbBling, 4.3, 3.0, Math.min(1.1, (lt - 6.0) * 6) * (1 + .04 * Math.sin(t * 14)));
      if (lt < 1.7 && lt > .4) putCam(lbMex, 4.5, 3.1, Math.min(1.1, (lt - .4) * 6) * (lt > 1.45 ? 0 : 1));
      const dx = () => [fx + .6, 1.15, -.9];
      rig(lt, [[0, [fx + 3.2, 1.8, 6.0], [fx + 2.2, 1.9, 5.6], [fx - 3.2, 1.2, .2], [fx - 3.6, 1.2, .5], 54, 50], [2.0, [fx + CUT - .3, .4, 9.8], [fx + CUT + .2, .3, 8.6], [fx + CUT, 0, 0], [fx + CUT, -.05, 0], 46, 40], [3.2, [fx + 3.4, 2.2, 8.0], [fx + 2.6, 2.1, 7.0], [fx - 1.5, 1.2, -.5], [fx - 1.5, 1.25, -.5], 62, 58], [5.2, [fx - 1.0, 1.3, 3.2], [fx + 1.4, 1.5, 3.4], [fx + .4, 1.2, -.9], [fx + .6, 1.2, -.9], 48, 44], [6.7, [fx + 2.6, 2.4, 6.2], [fx + 3.8, 2.6, 6.8], [fx - .8, 1.2, -1.0], [fx - 1.0, 1.2, -1.0], 56, 56]], t);
      A.follow(inPass ? OFF.E + CUT : fx - 1, 0);
    } else {
      // ---------------- ocean + owl
      const fx = OFF.F; place(YOU, fx - 6.4, .64, 0, Math.PI / 2, 'idle', .3); const th = clamp((lt - .55) / .3); const wind = lt < .55 ? -2.7 : lerp(-2.7, .6, smooth(th)); YOU.arms = { lx: -.2, lz: -.15, rx: lt > .85 ? lerp(-1.4, .3, clamp((lt - .85) / .3)) : wind + (lt < .55 ? Math.sin(lt * 10) * .1 : 0), rz: .1 }; YOU.pitch = lt > .55 && lt < 1.0 ? .25 : 0; faceShock = false;
      // thrown phone
      const T0 = .85, T1 = 1.55; const showT = bi === 5 && lt < 2.6; phT.g.visible = showT; const fu = clamp((lt - T0) / (T1 - T0)); if (lt < T0) { const hp = V3(-6.0, 2.1, .2); phT.g.position.copy(hp); phT.g.rotation.set(0, 0, 0); } else if (lt < 2.6) { const x = lerp(-5.6, 1.8, fu), z = lerp(.2, -2.4, fu); const y = fu < 1 ? 1.6 + Math.sin(fu * Math.PI) * 2.6 - fu * 1.4 : 0; const sink = clamp((lt - T1) / .9); phT.g.position.set(x, fu < 1 ? Math.max(.1, y) : -.3 - sink * 1.2, z); phT.g.rotation.set(t * 11, 0, t * 7); phT.g.visible = !(lt > T1 + .5); }
      const sp = lt - T1; ring.visible = sp > 0 && sp < 1.2; if (ring.visible) { ring.position.set(1.8, .06, -2.4); const r = .3 + sp * 2.4; ring.scale.set(r, r, r); ring.material.opacity = 1 - sp / 1.2; }
      splash.forEach((d, i) => { const on = sp > 0 && sp < 1.0; d.visible = on; if (on) { const a = i / splash.length * Math.PI * 2, v = 1.4 + (i % 4) * .5; d.position.set(1.8 + Math.cos(a) * v * sp * .8, .1 + v * 2.2 * sp - 5 * sp * sp, -2.4 + Math.sin(a) * v * sp * .8); d.scale.setScalar(1 - sp * .8); } });
      // owl
      const ob = lt >= 2.3; owl.visible = true; owl.position.y = 2.5 + (ob ? Math.abs(Math.sin(t * 26)) * .03 : 0); owl.rotation.y = -.55; owl.rotation.z = ob ? Math.sin(t * 40) * .015 : 0;
      const ringing = lt >= 2.3; phO.draw((g, w, h) => callScreen(g, w, h, 'owl', lt > 3.9 ? 'has his number' : '647-555-0188', t, ringing ? 'ring' : 'ring', '4:13 AM')); phO.g.visible = true; phO.g.position.set(6.2 - .35, 3.3, -3.85); phO.g.rotation.set(-.15, -.55, ringing ? Math.sin(t * 46) * .05 : 0); phO.g.position.x += ringing ? Math.sin(t * 40) * .015 : 0;
      if (lt >= 3.9) { bub.show('I HAVE HIS NUMBER', fx + 5.6, 7.3, -3.0); }
      const wob = lt >= 3.5 ? 1 : 0;
      rig(lt, [[0, [fx - 2.2, 2.4, 7.2], [fx - 1.4, 2.4, 6.6], [fx - 4.4, 1.4, 0], [fx - 1.8, 1.6, -.6], 60, 58], [1.5, [fx + .5, 2.4, 3.8], [fx + .9, 2.2, 3.2], [fx + 1.8, .4, -2.4], [fx + 1.8, 0, -2.4], 56, 50], [2.3, [fx + 1.6, 3.4, 4.8], [fx + 2.4, 3.6, 3.2], [fx + 6.2, 2.6, -4.6], [fx + 6.2, 3.0, -4.6], 58, 54], [3.05, [fx + 4.4, 3.4, -1.4], [fx + 5.3, 3.4, -2.2], [fx + 5.85, 3.3, -3.85], [fx + 5.85, 3.3, -3.85], 36, 33], [3.95, [fx + 3.0, 3.8, 6.0], [fx + 2.4, 4.0, 7.0], [fx + 6.0, 4.4, -4.6], [fx + 6.0, 4.6, -4.6], 60, 60]], t);
      A.follow(fx, -2);
    }

    // arena TV bezel at the end of beat 1: crowd stares at you through a TV
    tvM.visible = false; if (set === 1 && bi === 1 && lt >= 4.7) { const hh = 2 * 1.2 * Math.tan(A.camera.fov * Math.PI / 360); A.camera.getWorldDirection(FW); tvM.position.copy(A.camera.position).addScaledVector(FW, 1.2); tvM.quaternion.copy(A.camera.quaternion); tvM.scale.set(hh * .5625, hh, 1); tvM.visible = true; drawTv(t, lt); }
    if (stampK > 0) putCam(stamp, 3.0, -.1, stampK, 1);
    if (labelK > 0) { const L = bi === 3 ? lbBetter : lbClever; putCam(L, 4.3, 3.0, labelK, 1); }
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t); look.update(); look.setVisible(DR.vis);
    // ---- hud
    const [c0, c1] = CALLS[bi]; const ck = clamp(lt / (DUR[bi] * .85)); const val = Math.round(lerp(c0, c1, smooth(ck))); hud.style('C'); hud.layout('B'); hud.question('', 0);
    hud.counter('MISSED CALLS', val.toLocaleString('en-US'), NOTE[bi], 'PARODY', bi >= 2); hud.tm(''); hud.pop('', 0);
    A.render();
  } };
}
