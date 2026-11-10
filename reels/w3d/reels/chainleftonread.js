// 667 invention chain: left on read -> text again (Delivered) -> voicemail -> 9 min, 4 sorries -> her house (moved) -> "who is this?"
import { makeBubble } from './_drake.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0x0a1030, fogNear: 40, fogFar: 140, clouds: false, skyTop: 0x0a1030, skyMid: 0x1c2a55, skyBot: 0x2a3a6a, shadowExtent: 16, shadowRes: 2048, hemi: 1.2, sunI: 1.2, sunDir: [-.35, .9, .5], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const rr = (g, x, y, w, h, r, fill, stroke, lw = 6) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw; g.strokeStyle = stroke; g.stroke(); } };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const grp = (x) => { const g = new THREE.Group(); g.position.x = x; S.add(g); return g; };
  const GA = grp(0), GB = grp(60), GC = grp(120); const GS = [GA, GB, GC];
  const bx = (G, x, y, z, w, h, d, c, o) => addBox(G, x, y, z, w, h, d, c, o);
  const plane = (G, w, h, tex, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: !!o.tr, toneMapped: false, fog: false, side: o.side || THREE.FrontSide })); m.position.set(x, y, z); G.add(m); return m; };
  const flat = (G, w, h, c, x, y, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat(c)); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; G.add(m); return m; };
  const cyl = (G, rt, rb, h, c, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, o.seg || 20), mat(c, o.mat)); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; G.add(m); return m; };
  const backdrop = (G, x, z, c1, c2, bw = 26, bh = 18) => { const t = cvs(8, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(0, 0, w, h); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), new THREE.MeshBasicMaterial({ map: t.t, fog: false })); m.position.set(x, 0, z); G.add(m); return m; };

  // ---------------------------------------------------------------- people: 0 YOU, 1-4 new family
  const N = 5; const crowd = new Crowd(S, N, 41); const P = crowd.p; const YOU = P[0];
  const colr = (i, ks, c) => ks.forEach((k) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; });
  colr(0, ['torso', 'armL', 'armR'], 0x3a78d8); colr(0, ['legL', 'legR'], 0x2b3347); colr(0, ['hair'], 0x4a2f1c);
  const FAM = [[0xe8a33a, 0x4a3a2a], [0xd24a7a, 0x8a5a2a], [0x2aa86a, 0x1b1b1b], [0x7a5adf, 0xc8a050]]; FAM.forEach(([c, h], k) => { colr(1 + k, ['torso', 'armL', 'armR'], c); colr(1 + k, ['legL', 'legR'], 0x3b4660); colr(1 + k, ['hair'], h); });
  const place = (o, x, y, z, yaw, anim, sp = .5, sc = 1) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = sc; o.arms = null; o.pitch = 0; o.lie = 0; };

  const camSprite = (text, c1, c2, w = 900, size = 140) => { const l = cvs(w, 256, (g, ww) => txt(g, text, ww / 2, 134, size, c1, { stroke: c2, sw: size * .16 })); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false, fog: false })); s.visible = false; s.renderOrder = 20; S.add(s); return s; };
  const lbClever = camSprite('CLEVER!', '#ffe23a', '#111', 768, 150), lbBetter = camSprite('MUCH BETTER!', '#7dff6a', '#111', 1100, 140);
  const E = new THREE.Vector3(), T2 = new THREE.Vector3(), FW = new THREE.Vector3(), UPV = new THREE.Vector3();
  const putCam = (s, d, fy, k) => { const cam = A.camera; cam.getWorldDirection(FW); UPV.copy(cam.up).applyQuaternion(cam.quaternion).normalize(); const hh = 2 * d * Math.tan(cam.fov * Math.PI / 360); s.position.copy(cam.position).addScaledVector(FW, d).addScaledVector(UPV, fy * hh); const a = s.material.map.image; const w = hh * .5625 * .9 * k; s.scale.set(w, w * a.height / a.width, 1); s.visible = k > 0; };

  // ---------------------------------------------------------------- phones
  const mkPhone = (G, s = 1) => { const g = new THREE.Group(); const body = new THREE.Mesh(new lib.RoundedBoxGeometry(.5 * s, 1.0 * s, .06 * s, 3, .05 * s), mat(0x14161b, { roughness: .35, metalness: .5 })); body.castShadow = true; g.add(body); const sc = cvs(512, 1024); const sm = new THREE.Mesh(new THREE.PlaneGeometry(.455 * s, .94 * s), new THREE.MeshBasicMaterial({ map: sc.t, toneMapped: false, fog: false })); sm.position.z = .0315 * s; g.add(sm); G.add(g); return { g, sc, draw(fn) { fn(sc.g, 512, 1024); sc.t.needsUpdate = true; } }; };
  const PB = mkPhone(GC, 2.2); PB.g.rotation.x = .02;      // close-up phone
  const PH = mkPhone(S, .55);                              // phone in hand
  const heart = (g, x, y, s, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(x, y + s * .9); g.bezierCurveTo(x - s * 1.3, y - s * .1, x - s * .5, y - s * 1.1, x, y - s * .35); g.bezierCurveTo(x + s * .5, y - s * 1.1, x + s * 1.3, y - s * .1, x, y + s * .9); g.fill(); };
  const bubble = (g, side, y, s, w = null, c) => { g.font = `700 44px ${FONT}`; const ww = w || Math.max(120, g.measureText(s).width + 70); const x = side === 'r' ? 480 - ww : 32; rr(g, x, y, ww, 84, 42, c || (side === 'r' ? '#1f8bff' : '#e7e7ec')); txt(g, s, x + ww / 2, y + 44, 44, side === 'r' ? '#fff' : '#111', { w: 700 }); };
  const chatHead = (g, w, h, clock, seenN) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#f4f4f8'; g.fillRect(0, 0, w, 190); txt(g, clock, 256, 38, 32, '#222', { w: 800 }); g.fillStyle = '#ff6fa0'; g.beginPath(); g.arc(256, 108, 44, 0, 7); g.fill(); heart(g, 256, 106, 22, '#fff'); txt(g, 'Crush', 256, 170, 34, '#111'); rr(g, 346, 20, 140, 40, 20, '#222'); txt(g, 'SEEN x' + seenN, 416, 41, 24, '#ffd23a'); };
  const typeBar = (g, w, h, text, caret) => { g.fillStyle = '#f4f4f8'; g.fillRect(0, h - 150, w, 150); rr(g, 24, h - 120, 400, 80, 40, '#fff', '#c8c8d0', 4); txt(g, text + (caret ? '|' : ''), 48, h - 79, 40, '#111', { al: 'left', w: 600 }); g.fillStyle = text ? '#1f8bff' : '#b8c8e0'; g.beginPath(); g.arc(466, h - 80, 30, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(466, h - 68); g.lineTo(466, h - 92); g.moveTo(455, h - 82); g.lineTo(466, h - 92); g.lineTo(477, h - 82); g.stroke(); };
  const callBase = (g, w, h, c1, c2) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(0, 0, w, h); };
  const callAvatar = (g, y, r) => { g.fillStyle = '#ff6fa0'; g.beginPath(); g.arc(256, y, r, 0, 7); g.fill(); heart(g, 256, y - 4, r * .5, '#fff'); };
  const hangup = (g) => { g.fillStyle = '#e0302a'; g.beginPath(); g.arc(256, 880, 62, 0, 7); g.fill(); g.save(); g.translate(256, 880); g.rotate(2.3); rr(g, -36, -12, 72, 24, 12, '#fff'); g.restore(); };
  const fmt = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const screen = (g, w, h, t, bi, lt) => {
    if (bi === 0) { const typed = 'hey??'; const n = clamp((lt - 2.0) / .8) * typed.length; const sent = lt > 3.0; chatHead(g, w, h, '2:31 AM', sent ? 2 : 1); bubble(g, 'r', 240, 'hey'); txt(g, 'Seen 2:14 AM', 440, 350, 30, '#7a7a88', { al: 'right', w: 700 });
      if (sent) { bubble(g, 'r', 392, typed); txt(g, 'Delivered', 440, 498, 30, '#7a7a88', { al: 'right', w: 700 }); } typeBar(g, w, h, sent ? '' : typed.slice(0, Math.floor(n)), (t * 3 | 0) % 2 === 0 && !sent); }
    else if (bi === 1) { chatHead(g, w, h, '2:31 AM', 2); bubble(g, 'r', 240, 'hey'); txt(g, 'Seen 2:14 AM', 440, 350, 30, '#7a7a88', { al: 'right', w: 700 }); bubble(g, 'r', 392, 'hey??'); const pop = clamp((lt - .1) / .3); g.globalAlpha = pop; txt(g, 'Delivered', 440, 498, 40 + 8 * (1 - pop), '#222', { al: 'right', w: 900 }); g.globalAlpha = 1;
      g.setLineDash([14, 12]); g.lineWidth = 5; g.strokeStyle = '#d0d0d8'; g.beginPath(); g.roundRect(32, 590, 190, 84, 42); g.stroke(); g.setLineDash([]); g.globalAlpha = .55; txt(g, 'no dots', 127, 632, 28, '#b0b0b8', { w: 700 }); g.globalAlpha = 1; txt(g, 'Nothing else.', 256, 800, 46, '#8a8a98', { w: 800 }); typeBar(g, w, h, '', false); }
    else if (bi === 2) { if (lt < 3.9) { const ph = lt < 2.44 ? 'ring' : lt < 3.0 ? 'beep' : 'rec'; if (ph === 'ring') { callBase(g, w, h, '#1d2250', '#0a0c1c'); txt(g, lt < 1.4 ? 'calling...' : 'RINGING...', 256, 90, 52, '#9fb0e8', { w: 800 }); callAvatar(g, 330, 110 + (lt * 3 % 1) * 6); for (let i = 0; i < 3; i++) { const a = (lt * 1.2 + i / 3) % 1; g.strokeStyle = `rgba(160,176,232,${1 - a})`; g.lineWidth = 6; g.beginPath(); g.arc(256, 330, 120 + a * 120, 0, 7); g.stroke(); } txt(g, 'Crush', 256, 560, 96, '#fff'); txt(g, 'mobile', 256, 630, 40, '#9fb0e8', { w: 600 }); hangup(g); }
        else if (ph === 'beep') { callBase(g, w, h, '#3a1450', '#10061c'); txt(g, 'VOICEMAIL', 256, 380, 94, '#ffe23a', { stroke: '#111', sw: 12 }); txt(g, '"she is not available"', 256, 500, 40, '#d8c8f0', { w: 700 }); const pul = 1 + .12 * Math.sin(t * 30); g.save(); g.translate(256, 650); g.scale(pul, pul); txt(g, 'BEEP', 0, 0, 120, '#ff5a4a', { stroke: '#fff', sw: 14 }); g.restore(); hangup(g); }
        else { callBase(g, w, h, '#2a0f18', '#0c0408'); g.fillStyle = '#e0302a'; g.beginPath(); g.arc(150, 130, 20 + 4 * Math.sin(t * 8), 0, 7); g.fill(); txt(g, 'REC', 270, 130, 56, '#fff'); txt(g, fmt((lt - 3) * 25), 256, 330, 130, '#fff', { w: 800 }); for (let i = 0; i < 18; i++) { const hh = 30 + 150 * Math.abs(Math.sin(t * 9 + i * 1.7)) * (.5 + .5 * Math.sin(i * .9 + 1)); rr(g, 40 + i * 24, 600 - hh / 2, 14, hh, 7, '#ff7a6a'); } txt(g, 'Voicemail to Crush', 256, 800, 38, '#d8a8b0', { w: 700 }); hangup(g); } } }
    else if (bi === 3) { const v = Math.min(540, 400 + lt * 140); callBase(g, w, h, '#2a0f18', '#0c0408'); g.fillStyle = '#e0302a'; g.beginPath(); g.arc(150, 130, 20 + 4 * Math.sin(t * 8), 0, 7); g.fill(); txt(g, 'REC', 270, 130, 56, '#fff'); txt(g, fmt(v), 256, 330, 190, lt > .85 ? '#ffe23a' : '#fff', { w: 900 }); for (let i = 0; i < 18; i++) { const hh = 30 + 150 * Math.abs(Math.sin(t * 9 + i * 1.7)) * (.5 + .5 * Math.sin(i * .9 + 1)); rr(g, 40 + i * 24, 600 - hh / 2, 14, hh, 7, '#ff7a6a'); } if (lt > .85) txt(g, '9 MINUTES', 256, 790, 70, '#ffe23a', { stroke: '#111', sw: 10 }); hangup(g); }
    else { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#16213e'); gr.addColorStop(1, '#2b1a3a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); txt(g, '2:47', 256, 250, 190, '#fff', { w: 700 }); txt(g, 'Tuesday, 2:47 AM', 256, 360, 40, '#c8cfe8', { w: 600 });
      const k = smooth((lt - 1.0) / .35); const ny = lerp(-200, 520, k); rr(g, 24, ny, 464, 190, 34, 'rgba(250,250,255,.95)'); g.fillStyle = '#ff6fa0'; g.beginPath(); g.arc(88, ny + 62, 36, 0, 7); g.fill(); heart(g, 88, ny + 60, 18, '#fff'); txt(g, 'Crush', 148, ny + 50, 40, '#111', { al: 'left' }); txt(g, 'now', 466, ny + 50, 30, '#777', { al: 'right', w: 600 }); txt(g, lt > 1.8 ? 'who is this?' : '...', 148, ny + 122, 54, '#111', { al: 'left', w: 800 }); } };

  // ================================================================= SET A: bedroom
  bx(GA, 0, -.05, 0, 16, .1, 14, 0x5b4331); bx(GA, 0, 2.6, -3.5, 14, 5.2, .2, 0x2b3454); bx(GA, 5.2, 2.6, 0, .2, 5.2, 14, 0x28304e); bx(GA, -6.0, 2.6, 0, .2, 5.2, 14, 0x28304e);
  const moonT = cvs(256, 256, (g) => { g.fillStyle = '#0c1740'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#fff'; for (let i = 0; i < 26; i++) g.fillRect((i * 97) % 256, (i * 53) % 256, 3, 3); g.fillStyle = '#fbf3c8'; g.beginPath(); g.arc(150, 100, 46, 0, 7); g.fill(); g.fillStyle = '#0c1740'; g.beginPath(); g.arc(172, 88, 40, 0, 7); g.fill(); });
  bx(GA, -3.4, 2.7, -3.36, 2.3, 2.1, .1, 0x1d2238); plane(GA, 1.9, 1.7, moonT.t, -3.4, 2.7, -3.3);
  bx(GA, -.7, .28, -1.4, 2.7, .55, 3.1, 0x5a3a2a); bx(GA, -.7, .6, -1.4, 2.55, .22, 2.95, 0xf1f1f5, { round: .06 }); bx(GA, -.7, .95, -3.0, 2.8, 1.9, .16, 0x4a2f22); bx(GA, -1.2, .82, -2.5, .95, .2, .55, 0xffffff, { round: .08 }); bx(GA, -.2, .82, -2.5, .95, .2, .55, 0xffffff, { round: .08 });
  bx(GA, -.7, .8, -.35, 2.6, .5, 1.75, 0x3b5ea8, { round: .1 }); bx(GA, -.7, .83, .52, 2.62, .1, .18, 0x9fb7f0);
  bx(GA, 1.55, .38, -2.35, 1.0, .76, .8, 0x4a3426); cyl(GA, .05, .09, .4, 0x333333, 2.0, .96, -2.5);
  cyl(GA, .2, .32, .32, 0xffd9a0, 2.0, 1.32, -2.5).material = new THREE.MeshStandardMaterial({ color: 0xffd9a0, emissive: 0xffb050, emissiveIntensity: .9 });
  const lamp = new THREE.PointLight(0xffb868, 7, 8); lamp.position.set(2.0, 1.5, -2.2); GA.add(lamp);
  const glow = new THREE.PointLight(0x7fa8ff, 2, 6); glow.position.set(-.7, 1.9, -.2); GA.add(glow);
  const SORRY = []; { const mk = (i) => { const t = cvs(512, 200, (g) => { g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 200); g.strokeStyle = '#e0201b'; g.lineWidth = 16; g.strokeRect(8, 8, 496, 184); txt(g, 'SORRY', 256, 104, 130, '#e0201b'); }); const grp2 = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(1.6, .64, .06), mat(0xffffff)); b.castShadow = true; grp2.add(b); const f = new THREE.Mesh(new THREE.PlaneGeometry(1.56, .6), new THREE.MeshBasicMaterial({ map: t.t, toneMapped: false, fog: false })); f.position.z = .035; grp2.add(f); grp2.visible = false; GA.add(grp2); return grp2; }; for (let i = 0; i < 4; i++) SORRY.push(mk(i)); }
  const sweat = []; for (let i = 0; i < 7; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), new THREE.MeshStandardMaterial({ color: 0x7fd0ff, emissive: 0x2a80c0, emissiveIntensity: .5 })); d.scale.y = 1.4; d.visible = false; GA.add(d); sweat.push(d); }
  const bub = makeBubble(lib, S, 3.4, 1.3);

  // ================================================================= SET B: her old house
  backdrop(GB, 0, -30, '#7fc4ff', '#e2f1ff', 200, 90); flat(GB, 120, 80, 0x62b24a, 0, 0, 0); bx(GB, 0, .02, 8, 120, .06, 5, 0x4a4d55); bx(GB, 0, .05, 8, 120, .02, .16, 0xf2d24a, { cast: false }); bx(GB, 6.0, .03, 3.6, 3.0, .05, 8, 0x8a8d94);
  bx(GB, 1.5, 1.9, -4, 7.4, 3.8, 4.4, 0xf2e2c0); bx(GB, 1.5, .1, -1.75, 4.6, .28, 1.5, 0xb8a888); bx(GB, 1.5, .02, 0, 1.6, .22, 1.0, 0xa89878);
  { const sh = new THREE.Shape(); sh.moveTo(-4.1, 0); sh.lineTo(4.1, 0); sh.lineTo(0, 2.2); sh.closePath(); const g = new THREE.ExtrudeGeometry(sh, { depth: 4.8, bevelEnabled: false }); const m = new THREE.Mesh(g, mat(0xb8402a)); m.position.set(1.5, 3.8, -6.4); m.castShadow = true; GB.add(m); }
  bx(GB, 1.5, 1.2, -1.78, 1.3, 2.3, .1, 0x3a2418); bx(GB, 1.5, 1.2, -1.82, 1.0, 2.0, .06, 0x1a1210);
  for (const wx of [-1.0, 4.0]) { bx(GB, wx, 2.0, -1.79, 1.5, 1.4, .1, 0x2f86c4); bx(GB, wx, 2.0, -1.74, 1.3, 1.2, .04, 0xbfe4ff, { cast: false }); bx(GB, wx, 1.2, -1.6, 1.7, .22, .35, 0x6b3a1c); for (let i = 0; i < 3; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.14, 8, 6), mat([0xff5a7a, 0xffd23a, 0xff8a3a][i])); f.position.set(wx - .5 + i * .5, 1.42, -1.6); GB.add(f); } }
  bx(GB, 1.5, 4.7, -1.4, 1.0, .5, .08, 0xfff0d0, { cast: false });
  // fence + trees
  for (let i = 0; i < 14; i++) { bx(GB, -9 + i * 1.1, .45, 2.4, .16, .9, .1, 0xffffff); } bx(GB, -4.9, .6, 2.4, 14, .1, .08, 0xffffff);
  const tree = (x, z, s = 1) => { cyl(GB, .22 * s, .3 * s, 1.6 * s, 0x6b4a2a, x, .8 * s, z); const c = new THREE.Mesh(new THREE.SphereGeometry(1.4 * s, 10, 8), mat(0x2e8a3a)); c.position.set(x, 2.5 * s, z); c.castShadow = true; GB.add(c); }; tree(-7, -3, 1.3); tree(9.5, -3.5, 1.2); tree(-4.8, -3.8, .9);
  // sale sign
  const saleT = cvs(512, 400, (g) => { g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 400); g.fillStyle = '#c8102e'; g.fillRect(0, 0, 512, 160); txt(g, 'FOR SALE', 256, 82, 112, '#fff'); txt(g, 'Happy Homes Realty', 256, 215, 38, '#444', { w: 700 }); g.save(); g.translate(256, 305); g.rotate(-.12); rr(g, -210, -60, 420, 120, 14, '#16a34a'); txt(g, 'SOLD', 0, 4, 100, '#fff'); g.restore(); });
  const sale = new THREE.Group(); sale.position.set(-1.9, 0, 1.5); GB.add(sale); bx(sale, 0, .9, 0, .14, 1.8, .14, 0x6b4a2a); bx(sale, 0, 1.5, 0, 1.9, 1.5, .1, 0xffffff); plane(sale, 1.8, 1.4, saleT.t, 0, 1.5, .06);
  // moving van
  const van = new THREE.Group(); GB.add(van); bx(van, 0, 1.15, 0, 4.4, 2.1, 2.1, 0xf4f4f6, { round: .1 }); bx(van, 2.55, .9, 0, 1.3, 1.6, 2.0, 0xe0a82a, { round: .1 }); bx(van, 3.05, 1.1, 0, .12, .7, 1.7, 0x9fd0ff, { cast: false }); for (const [wx, wz] of [[-1.4, 1.05], [1.4, 1.05], [-1.4, -1.05], [1.4, -1.05], [2.7, 1.0], [2.7, -1.0]]) { const w = cyl(van, .42, .42, .3, 0x16171c, wx, .42, wz, { seg: 14 }); w.rotation.x = Math.PI / 2; }
  const vanT = cvs(512, 200, (g) => { g.fillStyle = '#e0201b'; g.fillRect(0, 0, 512, 200); txt(g, 'MOVERS', 256, 104, 130, '#fff', { stroke: '#111', sw: 12 }); }); plane(van, 3.6, 1.4, vanT.t, 0, 1.3, 1.07); const vanB = plane(van, 3.6, 1.4, vanT.t, 0, 1.3, -1.07); vanB.rotation.y = Math.PI;
  const bouquet = new THREE.Group(); S.add(bouquet); { const st = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .55, 6), mat(0x2e8a3a)); st.position.y = .1; bouquet.add(st); const cs = [0xff3a5a, 0xffd23a, 0xff7ab8, 0xffffff, 0xff8a3a]; for (let i = 0; i < 7; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.14, 8, 6), mat(cs[i % 5])); const a = i / 7 * 6.28; f.position.set(Math.cos(a) * .14, .42 + (i % 2) * .06, Math.sin(a) * .14); bouquet.add(f); } }
  const dust = []; for (let i = 0; i < 8; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(.3, 6, 5), new THREE.MeshBasicMaterial({ color: 0xe8e0d0, transparent: true, opacity: .6 })); d.visible = false; GB.add(d); dust.push(d); }

  // ================================================================= SET C (cutaway stage)
  backdrop(GC, 0, -9, '#2a1a4e', '#0b0a1c');

  const rig = (lt, shots, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35); const e0 = s[1], e1 = s[2], g0 = s[3], g1 = s[4];
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .03 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .025; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .01); };
  const sky = A.sky.material.uniforms;
  const MOODS = [{ top: 0x0a1030, mid: 0x1c2a55, bot: 0x2a3a6a, fog: 0x0a1030, hemi: .55, sun: .25, sc: 0x8aa0ff, ex: 1.3 }, { top: 0x3f86d8, mid: 0x9cc8f0, bot: 0xe2eef9, fog: 0xbcd8ee, hemi: 1.7, sun: 2.2, sc: 0xfff1d8, ex: 1.1 }, { top: 0x1a1030, mid: 0x2a1a4e, bot: 0x2a1a4e, fog: 0x2a1a4e, hemi: 1.9, sun: 1.6, sc: 0xfff1d8, ex: 1.05 }];
  const CR = [[0, 12], [12, 64], [64, 311], [311, 2400], [2400, 48000], [48000, 999999]]; const NOTE = ['she saw it. she did not reply', 'delivered. that is all it says', 'you are recording a voicemail', 'nine minutes. four sorrys', 'she moved. new family waves', 'who is this?'];
  const DUR = tl.beats.map((b) => b.dur);
  const Y0 = V3(-.7, 0, -1.8);

  return { frame({ t, bi, lt }) {
    bi = Math.min(bi, 5);
    // set selection: 0 bedroom wide, 1 house, 2 phone cutaway
    let set = 0; if (bi === 0) set = lt < 1.1 ? 0 : 2; else if (bi === 1) set = lt < 2.6 ? 2 : 0; else if (bi === 2) set = lt < 3.9 ? 2 : 0; else if (bi === 3) set = lt < 1.1 ? 2 : 0; else if (bi === 4) set = 1; else set = lt < 1.0 ? 0 : lt < 3.1 ? 2 : 0;
    GS.forEach((g, i) => (g.visible = i === set)); const mo = MOODS[set]; sky.top.value.set(mo.top); sky.mid.value.set(mo.mid); sky.bot.value.set(mo.bot); S.fog.color.set(mo.fog); A.hemi.intensity = mo.hemi; A.sun.intensity = mo.sun; A.sun.color.set(mo.sc); A.renderer.toneMappingExposure = mo.ex; A.fogc.set(mo.fog);
    for (const o of P) o.vis = false; bouquet.visible = false; PH.g.visible = false; [lbClever, lbBetter].forEach((s) => (s.visible = false)); bub.hide(); SORRY.forEach((s) => (s.visible = false)); sweat.forEach((s) => (s.visible = false)); dust.forEach((s) => (s.visible = false));
    let followX = 0, faceShock = false, shake = 0;

    if (set === 2) {
      PB.draw((g, w, h) => screen(g, w, h, t, bi, lt)); PB.g.position.set(0, 0, 0); PB.g.rotation.y = Math.sin(t * .6) * .05; PB.g.rotation.x = .03; followX = 120;
      const ringing = bi === 2 && lt > 1.4 && lt < 2.44; if (ringing) { PB.g.position.x = Math.sin(t * 50) * .02; PB.g.rotation.z = Math.sin(t * 44) * .025; } else PB.g.rotation.z = 0;
      const z0 = bi === 5 ? 6.6 : 6.2; rig(lt, [[0, [120 + .2, .15, z0], [120, .05, z0 - .9], [120, 0, 0], [120, 0, 0], 40, 38]], t, ringing ? .004 : 0);
    } else if (set === 0) {
      // bedroom wide
      let lw = lt; place(YOU, -.7, -.02, -1.8, 0, 'sit', .3); YOU.pitch = .08; YOU.vis = true; PH.g.visible = true;
      let sitAnim = { lx: -.9, lz: -.12, rx: -1.15, rz: .12 }; glow.intensity = 2 + Math.sin(t * 3) * .4;
      const putPhone = (ang) => { attach(PH.g, YOU, 'handR', [0, -.12, .12], [ang, 0, 0]); PH.g.visible = true; };
      if (bi === 0) { YOU.arms = sitAnim; putPhone(-.2); rig(lt, [[0, [.3, 1.9, 5.4], [-.2, 1.8, 4.2], [-.7, 1.2, -1.8], [-.7, 1.1, -1.8], 52, 46]], t); }
      else if (bi === 1) { const k = smooth((lt - 2.6) / .3); YOU.arms = { lx: -.4, lz: -.1, rx: -.6, rz: .1 }; YOU.pitch = .2; putPhone(-.2); rig(lt, [[2.6, [-.1, 1.7, 4.8], [-.4, 1.65, 4.0], [-.7, 1.25, -1.8], [-.7, 1.2, -1.8], 46, 40]], t); }
      else if (bi === 2) { YOU.arms = { lx: -.4, lz: -.1, rx: -2.6, rz: .0 }; putPhone(.9); const sp = lt > 4.5; if (sp) bub.show(lt < 5.3 ? 'um... hi. it is me.' : 'so about earlier...', -.7, 3.5, -1.0); faceShock = false; rig(lt, [[3.9, [-.2, 1.9, 5.2], [-.5, 1.85, 4.1], [-.7, 1.35, -1.8], [-.7, 1.4, -1.8], 52, 44]], t); }
      else if (bi === 3) { const l3 = lt - 1.1; YOU.arms = { lx: -.4, lz: -.1, rx: -2.6, rz: .0 }; putPhone(.9); YOU.pitch = .1; faceShock = true;
        const at = [1.86, 2.35, 2.85, 3.3]; const pos = [[-1.2, 2.55], [.6, 3.2], [-1.0, 3.9], [.5, 4.55]];
        SORRY.forEach((s, i) => { const a = lt - at[i]; s.visible = a > 0; if (a > 0) { const pop = 1 + .35 * Math.exp(-a * 9) * Math.cos(a * 22); s.position.set(-.7 + pos[i][0] * .55 * (i % 2 ? 1 : -1) * -1, pos[i][1] - .15 + Math.sin(t * 2 + i) * .06, -1.3); s.scale.setScalar(pop * .85); s.rotation.z = (i % 2 ? -1 : 1) * .07; } });
        sweat.forEach((d, i) => { const ph = (t * .9 + i * .31) % 1; d.visible = lt > .0; d.position.set(-.7 + (i % 2 ? .38 : -.38) + Math.sin(i * 2) * .06, 1.75 - ph * .9 + (i % 3) * .05, -1.3 + .15); d.scale.setScalar(.8 + .3 * (1 - ph)); });
        rig(lt, [[1.1, [-.5, 2.4, 7.8], [-.5, 2.7, 6.8], [-.7, 2.6, -1.8], [-.7, 2.7, -1.8], 50, 50]], t); }
      else { const k = smooth((lt - 3.1) / .4); const g0 = lt < 1.0; YOU.arms = g0 ? { lx: -.4, lz: -.1, rx: -.8, rz: .1 } : { lx: -.1, lz: -.12, rx: lerp(-.8, -.05, k), rz: .1 }; YOU.pitch = g0 ? .1 : lerp(.1, .42, k); faceShock = true; putPhone(g0 ? -.2 : lerp(-.2, .1, k)); glow.intensity = g0 ? 2 + Math.sin(t * 40) * 1.5 : 1;
        rig(lt, [[0, [.3, 1.9, 5.4], [-.1, 1.8, 4.4], [-.7, 1.2, -1.8], [-.7, 1.1, -1.8], 52, 46], [3.1, [-.2, 1.7, 4.8], [-.5, 1.55, 3.9], [-.7, 1.1, -1.8], [-.7, 1.0, -1.8], 46, 40]], t); }
      followX = 0;
    } else {
      // her old house
      followX = 60; const fx = 60; const vx = lt < 1.9 ? 4.6 : 4.6 + Math.pow(lt - 1.9, 2.1) * 2.2; van.position.set(fx + vx, 0, 3.6); van.rotation.y = 0;
      if (lt > 1.9 && lt < 4.2) dust.forEach((d, i) => { const a = clamp((lt - 1.9 - i * .06) / 1.4); d.visible = a > 0 && a < 1; d.position.set(fx + 4.0 + a * 1.5 - i * .15, .3 + a * 1.2, 3.6 + (i % 3 - 1) * .5); d.scale.setScalar(.5 + a * 2); d.material.opacity = .6 * (1 - a); });
      const wk = clamp(lt / 1.5); const yz = lerp(5.6, 3.2, smooth(wk)); place(YOU, fx - 2.3 + lerp(-3, 0, smooth(wk)) + 0, 0, yz, Math.PI * .88, wk < 1 ? 'walk' : 'idle', .55); YOU.arms = { lx: -.2, lz: -.15, rx: wk < 1 ? -1.0 : -1.2 + Math.sin(t * 2) * .05, rz: .12 }; YOU.pitch = lt > 2.4 ? .2 : 0; YOU.vis = true; bouquet.visible = true; attach(bouquet, YOU, 'handR', [0, -.1, .15], [-.3, 0, 0]);
      const show = lt >= 3.2; const wave = (i, sc) => { const o = P[1 + i]; place(o, fx + .2 + i * 1.0 + (i > 1 ? .2 : 0), .26, -.95, .05 * (i - 1.5), 'idle', .5 + i * .1, sc); o.arms = { lx: -.2, lz: -.12, rx: -2.55 + Math.sin(t * 9 + i) * .4, rz: -.35 }; o.vis = show; }; wave(0, 1.05); wave(1, 1.0); wave(2, .7); wave(3, .62);
      faceShock = false;
      rig(lt, [[0, [fx + 1.0, 2.1, 10.5], [fx + .4, 2.2, 10.0], [fx + .6, 1.5, 0], [fx + .6, 1.6, 0], 46, 46], [2.4, [fx + 2.8, 2.2, 10.2], [fx + 1.6, 2.4, 9.2], [fx + .6, 1.6, 0], [fx + 1.2, 1.7, -.4], 44, 40]], t);
    }
    // labels
    if (bi === 1 && lt < 1.0) putCam(lbClever, 4.3, .36, Math.min(1.1, (lt + .05) * 6) * (lt > .85 ? Math.max(0, 1 - (lt - .85) * 6) : 1));
    if (bi === 2 && lt > 3.22 && lt < 4.7) putCam(lbBetter, 4.3, .36, Math.min(1.1, (lt - 3.22) * 6) * (lt > 4.5 ? Math.max(0, 1 - (lt - 4.5) * 5) : 1));
    crowd.setFace(faceShock ? 'shock' : 'calm'); crowd.update(t);
    A.follow(followX, 0);
    const [c0, c1] = CR[bi]; const ck = clamp(lt / (DUR[bi] * .85)); const val = Math.round(lerp(c0, c1, smooth(ck)));
    hud.style('C'); hud.layout('B'); hud.question('', 0); hud.counter('CRINGE LEVEL', val.toLocaleString('en-US'), NOTE[bi], 'PARODY', bi >= 2); hud.tm(''); hud.pop('', 0);
    A.render();
  } };
}
