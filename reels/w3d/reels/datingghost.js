import { makeBubble } from './_drake.js';
// What if ghosting made you transparent? One guy on a city street fades day by day: solid, 80%, 50%, hat+shoes, gone, then he texts back.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, mat, Crowd, clamp, smooth, lerp, attach } = lib;
  const st = makeStage({ shadowExtent: 34, fogNear: 110, fogFar: 460, sunDir: [-.5, .8, -.3], sunI: 2.8 }); const S = st.scene;
  const city = buildStreet(S, { seed: 7 }); city.cars.forEach((c) => (c.m.visible = false)); city.crowd.p.forEach((o) => (o.vis = false)); city.crowd.update(0);
  const CZ = 20;
  const easeBack = (u) => { u = clamp(u); const c1 = 1.9; return 1 + (c1 + 1) * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
  const dressC = (cr, i, shirt, pants, skin, hair) => { const c = (k, v) => { cr.parts[k].setColorAt(i, new THREE.Color(v)); cr.parts[k].instanceColor.needsUpdate = true; }; ['torso', 'armL', 'armR'].forEach((k) => c(k, shirt)); ['legL', 'legR'].forEach((k) => c(k, pants)); ['head', 'neck', 'handL', 'handR'].forEach((k) => c(k, skin)); c('hair', hair); };
  // solid crowd: 0 hero, 1-2 passers, 3 her, 4 new guy
  const crowd = new Crowd(S, 5, 21); const P = crowd.p;
  dressC(crowd, 0, 0x2d6cdf, 0x2f3a52, 0xe7b48f, 0x2a1d12); dressC(crowd, 1, 0x4a9a5a, 0x3a3a46, 0xc98e63, 0x15100c); dressC(crowd, 2, 0xe0a030, 0x2f3a52, 0xf0c7a4, 0x5a2f1a);
  dressC(crowd, 3, 0xe0527a, 0x2a2a38, 0xf0c7a4, 0x5a2f1a); dressC(crowd, 4, 0x4b4f5a, 0x23252c, 0xe7b48f, 0x3a2214);
  // ghost crowd: same hero with transparent materials
  const gc = new Crowd(S, 1, 22); const G = gc.p[0]; dressC(gc, 0, 0x2d6cdf, 0x2f3a52, 0xe7b48f, 0x2a1d12);
  for (const k in gc.parts) { const m = gc.parts[k].material; m.transparent = true; m.depthWrite = false; m.alphaTest = 0; gc.parts[k].renderOrder = k === 'face' ? 6 : k === 'hair' ? 5 : k === 'head' ? 4 : 3; gc.parts[k].castShadow = false; }
  const setOp = (o) => { for (const k in gc.parts) gc.parts[k].material.opacity = o; };
  [...P, G].forEach((o) => { o.h = 1; });
  const place = (o, x, z, yaw, anim = 'idle', op = {}) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = op.y || 0; o.speed = op.sp ?? 1; o.scale = op.sc ?? 1; o.vis = true; o.pitch = op.pitch || 0; o.arms = op.arms || null; o.extra = op.extra || 0; };
  const UB = new THREE.BoxGeometry(1, 1, 1); const UC = new THREE.CylinderGeometry(.5, .5, 1, 18); const sc4 = new THREE.Matrix4();
  const scaled = (m, sx, sy, sz) => { sc4.makeScale(sx, sy, sz); m.matrix.multiply(sc4); };
  const mk = (geo, c, o = {}) => { const m = new THREE.Mesh(geo, o.m || mat(c, o.mat)); m.castShadow = o.cast !== false; m.receiveShadow = true; m.visible = false; S.add(m); return m; };
  const sign = (w, h, cw, ch, draw, o = {}) => { const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const g = cv.getContext('2d'); draw(g, cw, ch); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })); m.visible = false; m.renderOrder = 6; S.add(m); return m; };
  const bubs = [makeBubble(lib, S, 1.4, .52), makeBubble(lib, S, 1.4, .52)];
  const faceCam = (m) => m.quaternion.copy(st.camera.quaternion);
  const rr = (g, x, y, w, h, r, c) => { g.fillStyle = c; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); };

  // ---- props
  const hat = { crown: mk(UC, 0xe0302c), brim: mk(UB, 0xb02020), btn: mk(UB, 0xffffff) };
  const shoes = [mk(UB, 0xe0302c), mk(UB, 0xe0302c)]; const soles = [mk(UB, 0xffffff), mk(UB, 0xffffff)];
  const phoneScreen = (() => { const cv = document.createElement('canvas'); cv.width = 200; cv.height = 360; const g = cv.getContext('2d'); g.fillStyle = '#f2f4f8'; g.fillRect(0, 0, 200, 360); g.fillStyle = '#2f6fd8'; g.fillRect(0, 0, 200, 56); g.fillStyle = '#fff'; g.font = '800 30px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('Mia', 100, 38); rr(g, 14, 80, 150, 50, 16, '#2f8cff'); rr(g, 14, 146, 120, 50, 16, '#2f8cff'); g.fillStyle = '#7a808c'; g.font = '700 22px Liberation Sans, Arial'; g.textAlign = 'right'; g.fillText('Seen 3:12 PM', 188, 230); g.fillStyle = '#e83a4a'; g.beginPath(); g.arc(158, 40, 18, 0, 7); g.fill(); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const dark = new THREE.MeshStandardMaterial({ color: 0x15181f, roughness: .5 });
  const phone = new THREE.Mesh(UB, [dark, dark, dark, dark, new THREE.MeshBasicMaterial({ map: phoneScreen }), dark]); phone.castShadow = true; phone.visible = false; S.add(phone);
  const chatCard = (seen) => sign(1.9, 1.15, 760, 460, (g, w, h) => { rr(g, 6, 6, w - 12, h - 12, 46, '#ffffff'); g.strokeStyle = '#16181d'; g.lineWidth = 8; g.beginPath(); g.roundRect(6, 6, w - 12, h - 12, 46); g.stroke(); g.fillStyle = '#f0c0d0'; g.beginPath(); g.arc(80, 76, 38, 0, 7); g.fill(); g.fillStyle = '#16181d'; g.font = '800 44px Liberation Sans, Arial'; g.textAlign = 'left'; g.fillText('Mia', 140, 90); rr(g, 50, 140, 470, 80, 40, '#2f8cff'); g.fillStyle = '#fff'; g.font = '700 42px Liberation Sans, Arial'; g.fillText('you free friday?', 84, 195); rr(g, 50, 240, 190, 80, 40, '#2f8cff'); g.fillStyle = '#fff'; g.fillText('hello??', 84, 295); g.fillStyle = '#e8252b'; g.font = '900 52px Liberation Sans, Arial'; g.textAlign = 'right'; g.fillText(seen, w - 50, 405); });
  const chats = [chatCard('Seen 3:12 PM'), chatCard('Seen 3 days ago')];
  const calCard = (n) => sign(1.15, 1.35, 460, 540, (g, w, h) => { g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 20; rr(g, 24, 24, w - 48, h - 48, 30, '#fbfbf6'); g.shadowColor = 'transparent'; g.save(); g.beginPath(); g.roundRect(24, 24, w - 48, h - 48, 30); g.clip(); g.fillStyle = '#e8252b'; g.fillRect(24, 24, w - 48, 120); g.restore(); g.fillStyle = '#fff'; g.font = '900 78px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('DAY', w / 2, 112); g.fillStyle = '#16181d'; g.font = '900 ' + (n > 9 ? 260 : 300) + 'px Liberation Sans, Arial'; g.fillText(String(n), w / 2, 420); g.fillStyle = '#e8252b'; g.fillRect(150, 8, 14, 50); g.fillRect(w - 164, 8, 14, 50); });
  const cals = { 1: calCard(1), 3: calCard(3), 7: calCard(7), 10: calCard(10) };
  const bubbleMsg = sign(2.7, 1.5, 720, 400, (g, w, h) => { g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 18; rr(g, 20, 20, w - 40, 250, 70, '#2f8cff'); g.shadowColor = 'transparent'; g.beginPath(); g.moveTo(120, 262); g.lineTo(70, 330); g.lineTo(200, 262); g.fillStyle = '#2f8cff'; g.fill(); g.fillStyle = '#fff'; g.font = '800 70px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('hey sorry', w / 2, 125); g.fillText('I was busy', w / 2, 215); g.fillStyle = '#6a707c'; g.font = '700 44px Liberation Sans, Arial'; g.fillText('Delivered', w / 2, 370); });
  const heartTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); g.fillStyle = '#ff3b6b'; g.strokeStyle = '#fff'; g.lineWidth = 8; g.beginPath(); g.moveTo(64, 112); g.bezierCurveTo(8, 72, 14, 20, 50, 22); g.bezierCurveTo(60, 23, 64, 32, 64, 38); g.bezierCurveTo(64, 32, 68, 23, 78, 22); g.bezierCurveTo(114, 20, 120, 72, 64, 112); g.fill(); g.stroke(); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const hearts = Array.from({ length: 9 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: heartTex, transparent: true, depthWrite: false })); s.visible = false; s.renderOrder = 8; S.add(s); return s; });
  const starTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 60); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,240,150,.7)'); gr.addColorStop(1, 'rgba(255,240,150,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(64, 2); g.lineTo(72, 56); g.lineTo(126, 64); g.lineTo(72, 72); g.lineTo(64, 126); g.lineTo(56, 72); g.lineTo(2, 64); g.lineTo(56, 56); g.closePath(); g.fill(); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const sparks = Array.from({ length: 22 }, () => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: starTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); m.visible = false; m.renderOrder = 9; S.add(m); return m; });
  const weed = new THREE.Group(); { const wm = new THREE.MeshStandardMaterial({ color: 0xb98a3a, roughness: 1, wireframe: true }); const a = new THREE.Mesh(new THREE.IcosahedronGeometry(.45, 1), wm), b = new THREE.Mesh(new THREE.IcosahedronGeometry(.33, 1), wm), c = new THREE.Mesh(new THREE.IcosahedronGeometry(.22, 0), wm); b.rotation.set(1, 2, 0); weed.add(a, b, c); weed.visible = false; S.add(weed); }
  const cup = [mk(UC, 0xffffff), mk(UC, 0xffffff)]; const table = [mk(UC, 0x6a4a2a), mk(UC, 0x3a3a40)];
  { const sty = document.createElement('style'); sty.textContent = '#pop{-webkit-text-stroke:9px #111}'; document.head.appendChild(sty); }
  const POP = ['', 'DAY 1: SLIGHTLY FADED', 'DAY 3: SEE THROUGH', 'DAY 7: JUST A HAT', 'DAY 10: GONE', "HE TEXTS BACK. SHE'S MOVED ON."];
  const DAYS = ['0', '1', '3', '7', '10', '10']; const OPS = [1, .8, .5, 0, 0, 0];
  const HIDE = [phone, ...Object.values(hat), ...shoes, ...soles, ...chats, ...Object.values(cals), bubbleMsg, ...hearts, ...sparks, weed, ...cup, ...table];
  const HY = 2.0; // hero basis
  const heroPose = (arms, pitch = .2) => place(G, 0, CZ, Math.PI, 'idle', { sc: 1.1, arms, pitch });
  const phoneArms = (t) => ({ lx: -.2, rx: -1.35 + Math.sin(t * 2) * .03, lz: 0, rz: -.1 });
  const sparkBurst = (lt, t0, x, y, z, n = 22, life = 1.1) => { const a = lt - t0; if (a < 0 || a > life) return; sparks.forEach((m, j) => { if (j >= n) return; const ang = j * 2.4, sp = 1.1 + (j % 5) * .45; m.visible = true; m.position.set(x + Math.cos(ang) * sp * a * .8, y + .3 + (j % 7) * .12 + a * (.9 + (j % 4) * .35), z + Math.sin(ang) * sp * a * .4 - .3); const s = .12 * (1 - a / life) * (1 + (j % 3) * .4); m.scale.set(s * 2.2, s * 2.2, 1); m.material.rotation = a * 4 + j; }); };

  return { frame({ t, bi, lt }) {
    bi = Math.min(bi, 5);
    [...P, G].forEach((o) => { o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; });
    bubs.forEach((b) => b.hide()); HIDE.forEach((m) => (m.visible = false)); crowd.setFace('calm'); gc.setFace('calm');
    const u = smooth(clamp(lt / 3));
    // opacity timeline
    let op = OPS[bi]; if (bi === 1) op = lerp(1, .8, smooth(clamp(lt / .6))); if (bi === 2) op = lerp(.8, .5, smooth(clamp(lt / .6))); if (bi === 3) op = lerp(.5, .1, smooth(clamp(lt / .7))); if (bi === 4) op = Math.max(0, lerp(.1, 0, smooth(clamp(lt / .4))));
    if (bi === 0) op = 1;
    setOp(op);
    let cam = [0, 2.3, CZ - 7, 0, 2.1, CZ, 50]; let day = DAYS[bi]; let note = 'OPACITY ' + Math.round(op * 100) + '%';
    const swap = (k) => { const m = cals[k]; const a = easeBack(lt / .5); m.visible = true; m.position.set(-.85, 3.5, CZ - .4); m.scale.set(Math.max(.01, Math.abs(Math.cos((1 - clamp(lt / .4)) * 1.4))), Math.max(.01, a), 1); faceCam(m); };
    const holdPhone = () => { phone.visible = true; attach(phone, G, 'handR', [0, .22, .08], [1.55, 0, 0]); phone.matrix.multiply(new THREE.Matrix4().makeRotationY(Math.PI)); scaled(phone, .2, .36, .04); };
    if (bi === 0) {
      const solid = P[0]; place(solid, 0, CZ, Math.PI, 'idle', { sc: 1.1, arms: phoneArms(t), pitch: .22 });
      const cs = chats[0]; if (lt > 1.4) { const a = easeBack((lt - 1.4) / .4); cs.visible = true; cs.position.set(.8, 3.3, CZ - .5); cs.scale.setScalar(Math.max(.01, a) * .72); faceCam(cs); }
      cam = [lerp(-.4, .2, u), 2.3, lerp(CZ - 7.6, CZ - 6.4, u), 0, 2.15, CZ, 50]; day = '0'; note = 'OPACITY 100%';
    } else if (bi === 1) {
      heroPose(phoneArms(t)); swap(1);
      const cs = chats[0]; cs.visible = true; cs.position.set(.8, 3.3, CZ - .5); cs.scale.setScalar(.72); faceCam(cs);
      cam = [lerp(.5, -.1, u), 2.3, lerp(CZ - 7.2, CZ - 6.3, u), 0, 2.15, CZ, 50];
    } else if (bi === 2) {
      heroPose(phoneArms(t)); swap(3);
      const cs = chats[1]; cs.visible = true; cs.position.set(.8, 3.3, CZ - .5); cs.scale.setScalar(.72); faceCam(cs);
      // passers walk behind him, visible through his body
      place(P[1], lerp(-4.5, 4.5, clamp((lt - .1) / 2.4)), CZ + 1.5, -Math.PI / 2, 'walk', { sc: 1.05, sp: .9 });
      place(P[2], lerp(4.5, -4.5, clamp((lt - .0) / 2.5)), CZ + 2.6, Math.PI / 2, 'walk', { sc: 1.05, sp: .85 });
      if (lt > .9 && lt < 2.4) bubs[0].show('...is he see-through?', P[1].x * .85 - .3, 3.75, CZ + 1.4);
      cam = [lerp(-.5, .2, u), 2.2, lerp(CZ - 7.2, CZ - 6.3, u), 0, 2.15, CZ, 50]; crowd.setFace('shock');
    } else if (bi === 3) {
      swap(7);
      heroPose({ lx: -.2, rx: -.2, lz: 0, rz: 0 }, 0);
      // phone drops to the pavement
      const f = clamp((lt - .05) / .35); phone.visible = true; phone.matrixAutoUpdate = true; phone.rotation.set(-Math.PI / 2 + .1, 0, .3); phone.position.set(.45, lerp(1.2, .05, f * f), CZ - .35); phone.scale.set(.2, .36, .04);
      // hat + shoes stay solid; bob a little
            [hat.crown, hat.brim, hat.btn, ...shoes, ...soles].forEach((m) => (m.visible = true));
      const cs = chats[1]; cs.visible = false;
      cam = [lerp(.4, -.2, u), 2.2, lerp(CZ - 7.0, CZ - 6.0, u), 0, 2.0, CZ, 50];
    } else if (bi === 4) {
      swap(10);
      phone.visible = true; phone.matrixAutoUpdate = true; phone.rotation.set(-Math.PI / 2 + .1, 0, .3); phone.position.set(.45, .05, CZ - .35); phone.scale.set(.2, .36, .04);
      if (lt < .4) { heroPose({ lx: -.2, rx: -.2, lz: 0, rz: 0 }, 0); [hat.crown, hat.brim, hat.btn, ...shoes, ...soles].forEach((m) => (m.visible = true)); }
      sparkBurst(lt, .35, 0, 1.2, CZ, 22, 1.4); if (lt > 1.1) sparkBurst(lt, 1.1, 0, .6, CZ, 10, 1.0);
      const wu = clamp(lt / 2.0); weed.visible = lt > .5; weed.position.set(lerp(-3.4, 3.4, wu), .45 + Math.abs(Math.sin(wu * 11)) * .22, CZ + .4); weed.rotation.z = -wu * 14; weed.rotation.y = wu * 3;
      cam = [lerp(.3, -.2, u), 2.0, lerp(CZ - 6.6, CZ - 6.0, u), 0, 1.7, CZ, 50]; if (lt > 1.5) bubs[0].show('...', 0, 2.2, CZ);
    } else {
      const sp = lt;
      const b = bubbleMsg; const a = easeBack((lt - .15) / .45); b.visible = true; b.position.set(.3, 2.45 + Math.sin(t * 2.4) * .08, CZ - .3); b.scale.setScalar(Math.max(.01, a) * .72); faceCam(b);
      phone.visible = true; phone.matrixAutoUpdate = true; phone.rotation.set(-Math.PI / 2 + .1, 0, .3); phone.position.set(.3, .05, CZ - .35); phone.scale.set(.2, .36, .04);
      // across the street: her + new guy at a cafe table, laughing
      const px = 1.9, pz = CZ + 3.2; const lg = Math.sin(t * 16) * .5 + .5;
      place(P[3], px - .55, pz, Math.PI / 2 + .6 + .4, 'idle', { sc: 1.05, extra: lt > .9 ? .12 : 0, arms: { lx: -.3, rx: -1.0, lz: 0, rz: 0 }, pitch: lt > .9 ? -.12 + .05 * lg : 0 });
      place(P[4], px + .55, pz, -Math.PI / 2 - .6 - .4, 'idle', { sc: 1.1, arms: { lx: -.2, rx: -.9, lz: 0, rz: 0 } });
      crowd.setFace('shock');
      table[0].visible = true; table[0].position.set(px, .55, pz - .05); table[0].scale.set(.7, .05, .7); table[1].visible = true; table[1].position.set(px, .28, pz - .05); table[1].scale.set(.1, .56, .1);
      cup.forEach((c, j) => { c.visible = true; c.position.set(px + (j ? .18 : -.18), .65, pz - .05); c.scale.set(.1, .14, .1); });
      hearts.forEach((h, j) => { const ph = ((lt * .6 + j / hearts.length) % 1); const on = lt > .5; h.visible = on; h.position.set(px + Math.sin(j * 2.1 + t * 2) * .55, 2.4 + ph * 1.8, pz - .7); const s = (.34 + (j % 3) * .08) * Math.min(1, ph * 6) * (1 - ph * .5); h.scale.set(s, s, 1); h.material.opacity = 1 - ph * ph; });
      cam = [lerp(.1, .3, u), 2.3, lerp(CZ - 8.8, CZ - 8.0, u), .6, 2.1, CZ, 50]; day = '10'; note = 'HE ANSWERED. SHE DID NOT';
    }
    // sparkles around fading hero on the way down
    if ((bi === 2 || bi === 3) && lt % 1 < .6) { const a = bi === 3 ? lt : lt; sparks.forEach((m, j) => { if (j > 7) return; const ang = j * 1.7 + t * 2; m.visible = true; m.position.set(Math.cos(ang) * .7, 1.0 + (((t * .6) + j / 8) % 1) * 1.8, CZ + Math.sin(ang) * .3 - .3); const s = .05 + .04 * (j % 3); const tw = .5 + .5 * Math.sin(t * 9 + j * 2); m.scale.set(s * 5 * (.4 + tw), s * 5 * (.4 + tw), 1); m.material.rotation = t * 2 + j; }); }
    crowd.update(t); gc.update(t);
    if (bi >= 1 && bi <= 3) { /* ghost hero updated above */ }
    if (bi === 1 || bi === 2) { holdPhone(); }
    if (bi === 0) { attach(phone, P[0], 'handR', [0, .22, .08], [1.55, 0, 0]); phone.matrix.multiply(new THREE.Matrix4().makeRotationY(Math.PI)); scaled(phone, .2, .36, .04); phone.visible = true; }
    if (bi === 3) { /* props attached after gc.update */ const reAtt = true; const h = hat.crown; attach(h, G, 'head', [0, .46 + Math.sin(t * 3) * .015, 0]); scaled(h, .5, .2, .5); attach(hat.brim, G, 'head', [0, .36 + Math.sin(t * 3) * .015, .22]); scaled(hat.brim, .5, .04, .34); attach(hat.btn, G, 'head', [0, .58 + Math.sin(t * 3) * .015, 0]); scaled(hat.btn, .07, .05, .07); [0, 1].forEach((j) => { const k = j ? 'legR' : 'legL'; attach(shoes[j], G, 'torso', [j ? .2 : -.2, -1.04, -.06]); scaled(shoes[j], .26, .14, .42); attach(soles[j], G, 'torso', [j ? .2 : -.2, -1.12, -.06]); scaled(soles[j], .27, .05, .44); }); }
    if (bi === 4 && lt < .4) { attach(hat.crown, G, 'head', [0, .46, 0]); scaled(hat.crown, .5, .2, .5); attach(hat.brim, G, 'head', [0, .36, .22]); scaled(hat.brim, .5, .04, .34); attach(hat.btn, G, 'head', [0, .58, 0]); scaled(hat.btn, .07, .05, .07); [0, 1].forEach((j) => { const kk = j ? 'legR' : 'legL'; attach(shoes[j], G, 'torso', [j ? .2 : -.2, -1.04, -.06]); scaled(shoes[j], .26, .14, .42); attach(soles[j], G, 'torso', [j ? .2 : -.2, -1.12, -.06]); scaled(soles[j], .27, .05, .44); }); }
    st.cam(...cam); st.follow(cam[3], cam[5]);
    st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if *ghosting* made you transparent?' : '', bi === 0 ? 1 : 0); hud.counter('', '', ''); hud.tm('');
    hud.pop(POP[bi], Math.min(1, Math.max(0, (lt - .1) * 8)));
  } };
}
