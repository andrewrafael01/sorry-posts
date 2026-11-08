import { drakeLook, makeBubble } from './_drake.js';
// What if Drake worked the drive-thru? Parody caricature, generic BURGER WINDOW stand (no real logo).
// Beats: hook / Big Mac + "have you eaten today" / 40 crying cars / free fries + speech on a crate / manager hug + quits (tie) / closing, SORRY FOR THE WAIT, 6 hours.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, tree, addBox, mat, Crowd, Particles, clamp, smooth, lerp, attach } = lib;
  const st = makeStage({ shadowExtent: 34, fogNear: 130, fogFar: 480, sunDir: [-.55, .8, -.3], sunI: 2.8 }); const S = st.scene; ground(S, 0x7fb05a, 900);
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const FL = .12; // sidewalk / interior floor height
  // ---- lot
  const asph = new THREE.Mesh(new THREE.PlaneGeometry(15, 520), mat(0x3b3e45)); asph.rotation.x = -Math.PI / 2; asph.position.set(-.5, .02, 100); asph.receiveShadow = true; S.add(asph);
  for (let i = 0; i < 60; i++) addBox(S, -2.9, .04, -20 + i * 6, .14, .02, 2.6, 0xf2c230, { cast: false });
  addBox(S, 2.15, FL / 2, -1.5, 1.7, FL, 17.4, 0xc9c4b8, { cast: false });
  // ---- stand (front wall x=3, window opening at z=0, side door at z=-6.5)
  const cream = 0xf1e6c8, red = 0xc4262b, yel = 0xf2c230;
  addBox(S, 3, 2.1, -8.2, .4, 4.2, 1.6, cream); addBox(S, 3, 2.1, -3.275, .4, 4.2, 4.65, cream); addBox(S, 3, 3.25, -6.5, .4, 1.9, 1.8, cream);
  addBox(S, 3, 2.1, 3.475, .4, 4.2, 5.05, cream); addBox(S, 3, .6, 0, .4, 1.1, 1.9, cream); addBox(S, 3, 3.2, 0, .4, 2.0, 1.9, cream);
  addBox(S, 2.55, 1.1, 0, .6, .09, 2.1, 0x8d1b20); // sill shelf
  addBox(S, 5.2, 4.4, -1.5, 7.2, .4, 15.4, red); addBox(S, 1.62, 4.4, -1.5, .14, .55, 15.4, yel); addBox(S, 2.78, 3.97, -1.5, .1, .3, 15, yel, { cast: false });
  addBox(S, 6.4, FL / 2, -1.5, 6.8, FL, 15.2, 0x8a8478, { cast: false }); addBox(S, 9.8, 2.1, -1.5, .2, 4.2, 15.2, 0xd9c9a4); addBox(S, 6.4, 2.1, -9.1, 6.8, 4.2, .2, cream); addBox(S, 6.4, 2.1, 6.1, 6.8, 4.2, .2, cream);
  addBox(S, 9.0, .55, -1.5, 1.0, 1.1, 8, 0xb9bfc7); addBox(S, 9.0, 1.15, -1.5, 1.0, .1, 8, 0x8d949c); addBox(S, 5.6, .45, 4.6, 1.2, .9, 2.4, yel); addBox(S, 6.2, .55, -4.2, 1.0, 1.1, 2.4, 0x9aa0a6);
  const light = new THREE.PointLight(0xfff0d0, 30, 16); light.position.set(5.4, 3.4, 0); S.add(light);
  // yellow pillars flanking the window
  addBox(S, 2.6, 1.7, -1.1, .3, 3.4, .22, red); addBox(S, 2.6, 1.7, 1.1, .3, 3.4, .22, red);
  // roof sign (generic, no logo)
  const signCv = document.createElement('canvas'); signCv.width = 1024; signCv.height = 256; const sg = signCv.getContext('2d'); const signTex = new THREE.CanvasTexture(signCv); signTex.colorSpace = THREE.SRGBColorSpace; signTex.anisotropy = 4; let signTxt = '';
  const drawSign = (txt, flash) => { const key = txt + flash; if (key === signTxt) return; signTxt = key; sg.fillStyle = flash ? '#8d1b20' : '#d62828'; sg.fillRect(0, 0, 1024, 256); sg.strokeStyle = '#ffd22e'; sg.lineWidth = 14; sg.strokeRect(14, 14, 996, 228); let px = 120; sg.textAlign = 'center'; sg.font = '900 ' + px + 'px Liberation Sans, Arial'; while (sg.measureText(txt).width > 900) { px -= 4; sg.font = '900 ' + px + 'px Liberation Sans, Arial'; } sg.fillStyle = '#ffd22e'; sg.fillText(txt, 512, 128 + px * .35); signTex.needsUpdate = true; };
  drawSign('BURGER WINDOW', 0);
  addBox(S, 2.1, 5.7, -1.5, .2, 1.9, 7.4, 0x7a1519); addBox(S, 2.1, 4.75, -4.6, .2, .3, .25, 0x555555); addBox(S, 2.1, 4.75, 1.6, .2, .3, .25, 0x555555);
  const signFace = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.75), new THREE.MeshBasicMaterial({ map: signTex })); signFace.position.set(1.98, 5.7, -1.5); signFace.rotation.y = -Math.PI / 2; S.add(signFace);
  // menu board next to the lane
  const menu = cvs(256, 384, (g, w, h) => { g.fillStyle = '#1b1e26'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd22e'; g.font = '800 34px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('MENU', 128, 50); g.fillStyle = '#fff'; g.font = '700 26px Liberation Sans, Arial'; ['BURGER', 'FRIES', 'SHAKE', 'BIG ONE'].forEach((s, i) => g.fillText(s, 128, 110 + i * 62)); });
  addBox(S, 1.9, 1.1, 5.2, .12, 2.2, .12, 0x555555); const menuFace = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.65), new THREE.MeshBasicMaterial({ map: menu })); menuFace.position.set(1.82, 1.9, 5.2); menuFace.rotation.y = -Math.PI / 2; S.add(menuFace);
  // wall clock (right of the window)
  const clock = new THREE.Group(); { const face = new THREE.Mesh(new THREE.CylinderGeometry(.8, .8, .1, 32), new THREE.MeshBasicMaterial({ map: cvs(256, 256, (g) => { g.fillStyle = '#f7f3e6'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.strokeStyle = '#111'; g.lineWidth = 10; g.stroke(); g.fillStyle = '#111'; g.font = '800 34px Liberation Sans, Arial'; g.textAlign = 'center'; for (let i = 1; i <= 12; i++) g.fillText(String(i), 128 + Math.sin(i * Math.PI / 6) * 96, 142 - Math.cos(i * Math.PI / 6) * 96); }) })); face.rotation.z = Math.PI / 2; const rim = new THREE.Mesh(new THREE.CylinderGeometry(.86, .86, .08, 32), mat(0x222222)); rim.rotation.z = Math.PI / 2; rim.position.x = .03; clock.add(rim, face); clock.position.set(2.72, 3.05, 3.3); S.add(clock); }
  const hand = (len, w, c) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.04, len, w), mat(c)); m.geometry.translate(0, len / 2 - .05, 0); const g = new THREE.Group(); g.add(m); g.position.set(2.62, 3.05, 3.3); S.add(g); return g; };
  const hHand = hand(.42, .09, 0x111111), mHand = hand(.62, .06, 0x111111);
  const closed = new THREE.Mesh(new THREE.PlaneGeometry(1.5, .6), new THREE.MeshBasicMaterial({ map: cvs(256, 100, (g, w, h) => { g.fillStyle = '#f2f2ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#c1272d'; g.font = '900 64px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('CLOSED', 128, 76); }) })); closed.position.set(2.5, 2.7, -2.4); closed.rotation.y = -Math.PI / 2; closed.visible = false; S.add(closed);
  // scenery
  for (let i = 0; i < 12; i++) tree(S, -10 - (i % 2) * 3, 30 + i * 18, 1.3, i * 7); for (let i = 0; i < 8; i++) tree(S, 13 + (i % 2) * 3, 12 + i * 22, 1.3, i * 3 + 1);
  const lamps = []; for (let i = 0; i < 4; i++) { const z = -8 + i * 22; addBox(S, -4.4, 2.4, z, .14, 4.8, .14, 0x444444); const lh = addBox(S, -4.4, 4.85, z, .5, .18, .5, 0xfff2c0, { cast: false, mat: { emissive: 0xffd88a, emissiveIntensity: 0 } }); lamps.push(lh); }
  // ---- cars
  const COLS = [0xd62828, 0x2f6fe0, 0x2ea84f, 0xf28a2e, 0x8a4fe8, 0x1abc9c, 0xff6fa0, 0xf4f4f0, 0xf2d03c, 0x34495e];
  const mkCar = (c) => { const g = new THREE.Group(); const part = (w, h, d, x, y, z, color, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, o)); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; };
    part(1.9, .55, 4.3, 0, .6, 0, c, { roughness: .4, metalness: .2 }); part(1.9, .22, 2.0, 0, 1.0, 1.1, c, { roughness: .4, metalness: .2 }); part(1.72, .52, .08, 0, 1.2, -.78, 0x9ec8ee, { roughness: .1, transparent: true, opacity: .75 }).rotation.x = -.45; part(1.6, .2, .9, 0, .9, -.1, 0x2a2a30);
    part(.34, .14, .06, -.6, .62, -2.17, 0xfff2b0, { emissive: 0xffe08a, emissiveIntensity: .6 }); part(.34, .14, .06, .6, .62, -2.17, 0xfff2b0, { emissive: 0xffe08a, emissiveIntensity: .6 }); part(1.7, .1, .06, 0, .62, 2.17, 0xaa1111);
    for (const sx of [-.95, .95]) for (const sz of [-1.4, 1.4]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, .3, 12), mat(0x1b1c20)); w.rotation.z = Math.PI / 2; w.position.set(sx, .38, sz); g.add(w); }
    g.visible = false; S.add(g); return g; };
  const NC = 40, SP = 5.2; const cars = []; for (let i = 0; i < NC; i++) cars.push(mkCar(COLS[(i * 3 + (i > 4 ? 1 : 0)) % COLS.length]));
  const crowd = new Crowd(S, 42, 646); crowd.setFace('calm'); const P = crowd.p; const look = drakeLook(lib, S, crowd, 0, { jersey: 0x1f5a3a });
  const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  const D = P[0], GUY = P[1], MGR = P[2]; const drv = (i) => (i === 0 ? GUY : P[2 + i]);
  ['torso', 'armL', 'armR'].forEach((k) => col(1, k, 0x3c8fe8)); ['legL', 'legR'].forEach((k) => col(1, k, 0x2a2f3c));
  ['torso', 'armL', 'armR'].forEach((k) => col(2, k, 0xf4f4f0)); ['legL', 'legR'].forEach((k) => col(2, k, 0x15181f));
  crowd.parts.hair.setColorAt(2, new THREE.Color(0x8a8a8a)); crowd.parts.hair.instanceColor.needsUpdate = true;
  // Drake headset (generic cue for working the window)
  const headband = new THREE.Mesh(new THREE.TorusGeometry(.25, .018, 6, 20, Math.PI), mat(0x111111)); const cup = new THREE.Mesh(new THREE.BoxGeometry(.06, .13, .1), mat(0x111111)); const boom = new THREE.Mesh(new THREE.BoxGeometry(.015, .015, .16), mat(0x111111)); const mic = new THREE.Mesh(new THREE.SphereGeometry(.025, 8, 6), mat(0xdd2222)); [headband, cup, boom, mic].forEach((m) => S.add(m));
  // props
  const crate = addBox(S, 2.2, FL + .3, -2.5, 1.1, .6, 1.1, 0xe0b020); crate.visible = false; const crate2 = addBox(S, 2.2, FL + .45, -2.5, 1.14, .1, 1.14, 0xc4262b); crate2.visible = false;
  const tie = new THREE.Group(); { const k = new THREE.Mesh(new THREE.BoxGeometry(.1, .08, .05), mat(0xb01820)); const b = new THREE.Mesh(new THREE.BoxGeometry(.1, .5, .03), mat(0xb01820)); b.position.y = -.27; const st2 = new THREE.Mesh(new THREE.BoxGeometry(.1, .08, .035), mat(0xffd22e)); st2.position.set(0, -.24, .01); tie.add(k, b, st2); S.add(tie); }
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(.24, .12), new THREE.MeshBasicMaterial({ map: cvs(192, 96, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#c4262b'; g.fillRect(0, 0, w, 28); g.fillStyle = '#fff'; g.font = '800 22px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('MANAGER', 96, 22); g.fillStyle = '#111'; g.font = '900 44px Liberation Sans, Arial'; g.fillText('DALE', 96, 76); }) })); S.add(tag);
  const NF = 90; const fries = new THREE.InstancedMesh(new THREE.BoxGeometry(.05, .3, .05), mat(0xffd22e, { emissive: 0x6a4a00, emissiveIntensity: .35 }), NF); fries.frustumCulled = false; fries.castShadow = false; S.add(fries);
  const tears = new Particles(S, 130, 0x7fd0ff, .045, { rough: .1, emissive: 0x1a5a8a });
  // bubbles
  const bub = (w, h) => { const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false })); sp.renderOrder = 20; sp.center.set(.5, 0); sp.scale.set(w, h, 1); sp.visible = false; S.add(sp); let cur = null;
    return { hide() { sp.visible = false; }, show(text, x, y, z) { if (text !== cur) { cur = text; g.clearRect(0, 0, 512, 256); const words = text.split(' '); let lines = [text]; if (text.length > 11 && words.length > 1) { let best = 1e9; for (let k = 1; k < words.length; k++) { const a = words.slice(0, k).join(' '), b = words.slice(k).join(' '); const sc = Math.abs(a.length - b.length); if (sc < best) { best = sc; lines = [a, b]; } } } const ml = Math.max(...lines.map((l) => l.length)); const px = Math.min(88, Math.floor(430 / (ml * .56))); g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 10; g.beginPath(); g.roundRect(10, 10, 492, 190, 34); g.fill(); g.stroke(); g.beginPath(); g.moveTo(226, 196); g.lineTo(256, 248); g.lineTo(290, 196); g.closePath(); g.fillStyle = '#fff'; g.fill(); g.stroke(); g.fillStyle = '#fff'; g.fillRect(232, 192, 52, 14); g.fillStyle = '#111'; g.font = '900 ' + px + 'px Liberation Sans, Arial'; g.textAlign = 'center'; const lh = px * 1.08, y0 = 105 - (lines.length - 1) * lh / 2 + px * .33; lines.forEach((l, i) => g.fillText(l, 256, y0 + i * lh)); tex.needsUpdate = true; } sp.position.set(x, y, z); sp.visible = true; } }; };
  const bG = bub(1.9, .95), bD = bub(2.4, 1.2), bM = bub(1.6, .8);
  const ease = (u) => { u = clamp(u); return 1 - Math.pow(1 - u, 3); };
  const place = (o, x, z, yaw, anim = 'idle', y = FL, sc = 1.25, sp = .5) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.vis = true; o.scale = sc; };
  const sky = st.sky.material.uniforms; const base = { top: sky.top.value.clone(), mid: sky.mid.value.clone(), bot: sky.bot.value.clone(), fog: S.fog.color.clone(), sun: st.sun.intensity, sunC: st.sun.color.clone(), hemi: st.hemi.intensity, light: light.intensity };
  const DUSK = { top: new THREE.Color(0x1d2150), mid: new THREE.Color(0xc8683f), bot: new THREE.Color(0xf0a060), sunC: new THREE.Color(0xff8a50) };
  const POPS = ['', '', '', '', '', ''];
  const V = new THREE.Vector3(), Q = new THREE.Quaternion(), E = new THREE.Euler(), M4 = new THREE.Matrix4(), SC = new THREE.Vector3(), V2 = new THREE.Vector3();
  const headPos = (o, dy = 0) => V2.setFromMatrixPosition(o.M.head).add(new THREE.Vector3(0, dy, 0));
  return { frame({ t, bi, lt }) {
    bi = Math.min(bi, 5);
    for (let i = 0; i < 42; i++) { P[i].vis = false; P[i].arms = null; P[i].pitch = 0; P[i].extra = 0; P[i].lie = 0; } [bG, bD, bM].forEach((b) => b.hide()); crate.visible = crate2.visible = false; closed.visible = bi === 5; tie.visible = false;
    // dusk (beat 5)
    const dk = bi === 5 ? .6 + .4 * smooth(lt / 2.5) : 0; sky.top.value.lerpColors(base.top, DUSK.top, dk); sky.mid.value.lerpColors(base.mid, DUSK.mid, dk); sky.bot.value.lerpColors(base.bot, DUSK.bot, dk); S.fog.color.lerpColors(base.fog, DUSK.bot, dk); st.sun.intensity = lerp(base.sun, .55, dk); st.sun.color.lerpColors(base.sunC, DUSK.sunC, dk); st.hemi.intensity = lerp(base.hemi, base.hemi * .35, dk); light.intensity = lerp(base.light, 60, dk); lamps.forEach((l) => (l.material.emissiveIntensity = dk * 2));
    drawSign(bi === 5 ? 'SORRY FOR THE WAIT' : 'BURGER WINDOW', bi === 5 && Math.floor(t * 2) % 2 ? 1 : 0);
    let cam = [-9, 3, -4, 2.6, 2.6, -1.2, 52]; let cnt = ''; let label = ''; let note = ''; let hot = false; let pop = ''; const says = [];
    // ---- cars + drivers
    const mode = bi === 2 ? 'cry' : bi === 3 ? (lt > 2.4 ? 'cheer' : 'cry') : bi === 4 ? 'cheer' : bi === 5 ? 'sleep' : 'calm';
    let nShow = bi === 0 ? 6 : bi === 1 ? 5 : NC; let shift = 0; let arrived = 0;
    if (bi === 0) shift = lt < 1.6 ? 12 * (1 - ease(lt / 1.6)) : 0; if (bi === 1) shift = 0;
    const tearList = [];
    for (let i = 0; i < NC; i++) { const c = cars[i]; let z = i * SP + shift, vis = i < nShow; if (bi === 2 && i >= 5) { const a = lt - .15 - (i - 5) * .045; vis = a > 0; z += 26 * (1 - ease(a / .7)); if (vis && a > .7) arrived++; } else if (vis) arrived++;
      c.visible = vis; c.position.set(((i * 37) % 7 - 3) * .05, Math.sin(t * 22 + i) * .006, z); c.traverse((m) => { if (m.isMesh) m.castShadow = i < 8; });
      const d = drv(i); if (!vis) continue; const dz = z - .1, dx = c.position.x + .42; place(d, dx, dz, Math.PI / 2, 'sit', -.12, 1.0, .3);
      if (mode === 'cry' && i > 0) { d.arms = { lx: -2.45 + .4 * Math.sin(t * 9 + i), lz: -.3, rx: -2.45 + .4 * Math.sin(t * 9 + i * 2), rz: .3 }; d.extra = .06; d.pitch = .1 * Math.sin(t * 7 + i); if (i < 17) tearList.push(i); }
      else if (mode === 'cheer' && i > 0) { d.arms = { lx: -2.7 + .35 * Math.sin(t * 8 + i), lz: -.2, rx: -2.7 + .35 * Math.sin(t * 8 + i * 3), rz: .2 }; d.pitch = -.05; }
      else if (mode === 'sleep') { d.pitch = .55; d.arms = { lx: .1, lz: -.05, rx: .1, rz: .05 }; }
      else d.arms = { lx: -.9, lz: -.1, rx: -.9, rz: .1 };
    }
    crowd.setFace(bi === 2 || (bi === 3 && lt < 2.4) ? 'shock' : 'calm');
    // ---- Drake + beats
    const dBase = { x: 4.3, z: 0 };
    if (bi === 0) { place(D, 4.2, 0, -Math.PI / 2, 'idle'); D.arms = { lx: -.2, lz: -.1, rx: -2.6 + .4 * Math.sin(t * 6), rz: .15 }; D.pitch = .06; GUY.arms = { lx: -.9, lz: -.1, rx: -.9, rz: .1 };
      const u = smooth(lt / 3.5); cam = [lerp(-16, -12, u), lerp(4, 3.2, u), lerp(-8, -3, u), 2.6, 2.8, -.6, 52]; label = ''; }
    else if (bi === 1) { const lean = smooth((lt - 3.0) / .7); place(D, lerp(4.3, 3.45, lean), 0, -Math.PI / 2, 'idle'); D.pitch = .9 * lean; D.arms = { lx: -.2 - 1.2 * lean, lz: -.1, rx: -.2 - 1.2 * lean, rz: .1 };
      GUY.arms = lt < 3.0 ? { lx: -.9, lz: -.1, rx: lt > 2.0 && lt < 3.0 ? -1.6 : -.9, rz: .1 } : { lx: -.9, lz: -.1, rx: -.9, rz: .1 }; GUY.pitch = lt > 3.9 ? .08 * Math.sin(t * 4) : 0;
      if (lt > 2.0 && lt < 3.4) says.push([bG, GUY, 'Big Mac']); if (lt > 3.4 && lt < 5.2) says.push([bD, D, 'have you eaten today?']); if (lt >= 5.2) says.push([bD, D, 'really eaten?']);
      const u = lt / 6.3; cam = [lerp(-8.5, -7.5, u), lerp(3.0, 2.7, u), lerp(7, 6, u), 1.9, 1.9, 0, 40]; label = 'ORDERS TAKEN'; cnt = lt < 5 ? '0' : '0'; note = 'big mac. 0 big macs.'; pop = lt > 2.0 && lt < 3.2 ? 'BIG MAC' : lt > 5.4 ? 'REALLY EATEN?' : '';
      cnt = '1'; }
    else if (bi === 2) { place(D, 3.7, 0, -Math.PI / 2, 'idle'); D.pitch = .5; D.arms = { lx: -1.3, lz: -.1, rx: -1.3, rz: .1 };
      const u = smooth(lt / 6.0); cam = [lerp(-3.6, -9, u), lerp(2.6, 17, u), lerp(-5, -24, u), lerp(0, 0, u), lerp(1.4, 0, u), lerp(14, 72, u), 50]; label = 'CARS IN LINE'; cnt = String(Math.min(NC, arrived)); note = lt < 3 ? 'nobody is honking' : 'nobody is mad. they are crying.'; hot = true; pop = lt > 2.0 && lt < 3.6 ? 'FORTY CARS' : lt > 4.7 ? 'CRYING' : ''; }
    else if (bi === 3) { place(D, 2.2, -2.5, 0, 'idle', FL + .6); crate.visible = crate2.visible = true; const sp = lt > 2.6; D.yaw = Math.PI * .05; D.arms = sp ? { lx: -2.3 + .4 * Math.sin(t * 5), lz: -.6, rx: -2.3 + .4 * Math.sin(t * 5 + 2), rz: .6 } : { lx: -.5, lz: -.1, rx: -1.7 - .5 * Math.abs(Math.sin(t * 10)), rz: .1 }; D.pitch = sp ? -.1 : .15;
      if (lt > 2.6) says.push([bD, D, 'WE ARE ALL HUNGRY']); const u = lt / 4.2; cam = [lerp(-5, -4, u), lerp(5.2, 4.4, u), lerp(11, 9, u), 2.0, 2.2, -2.2, 52]; label = 'FREE FRIES'; const nl = clamp((lt - .25) / 2.3) * NF; cnt = String(Math.floor(nl) * 5); note = 'speech included'; hot = true; pop = lt > 2.3 ? 'FREE FRIES' : ''; }
    else if (bi === 4) {
      const hugT = 3.0, wk = clamp((lt - 1.2) / 1.8); const mx = lerp(3.6, 2.1, smooth(wk)), mz = lerp(-6.5, -3.1, smooth(wk));
      place(D, 2.1, -2.3, Math.PI, 'idle'); D.arms = { lx: -.3, lz: -.1, rx: -.3, rz: .1 };
      const hug = lt > hugT && lt < 4.4; const walking = lt > 1.0 && wk < 1;
      if (lt > 1.0) { place(MGR, mx, mz, wk < 1 ? Math.atan2(2.1 - 3.6, -3.1 + 6.5) : 0, walking ? 'walk' : 'idle'); MGR.speed = .55; if (wk >= 1) MGR.yaw = 0; }
      if (hug) { D.arms = { lx: -1.6, lz: .35, rx: -1.6, rz: -.35 }; MGR.arms = { lx: -1.6, lz: .35, rx: -1.6, rz: -.35 }; D.pitch = .12; MGR.pitch = .1; }
      const tieOff = lt > 4.9; if (lt > 4.4 && lt < 4.9) MGR.arms = { lx: -2.1, lz: .5, rx: -2.1, rz: -.2 };
      if (lt >= 4.9) { MGR.anim = 'jump'; MGR.arms = null; D.arms = { lx: -2.7 + .3 * Math.sin(t * 9), lz: -.2, rx: -2.7 + .3 * Math.sin(t * 9 + 2), rz: .2 }; }
      if (lt > 4.9) says.push([bM, MGR, 'I QUIT']); if (lt > 1.6 && lt < 3.0) says.push([bM, MGR, 'DRAKE???']);
      const u = lt / 6.3; cam = [lerp(-10, -8.5, u), 2.8, -4.2, 2.4, 1.6, -3.9, 50]; label = 'MANAGERS LEFT'; cnt = lt > 4.9 ? '0' : '1'; note = lt > 4.9 ? 'resigned mid-hug' : 'he came to help'; hot = lt > 4.9; pop = lt > 3.1 && lt < 4.3 ? 'HUG' : lt > 4.85 ? 'I QUIT' : '';
      var tieT = lt - 4.9, tieLive = tieOff; }
    else { place(D, 3.5, 0, -Math.PI / 2, 'idle'); D.pitch = .65; D.arms = { lx: -1.2, lz: -.1, rx: -1.2, rz: .1 }; const h = 6 * smooth((lt - .5) / 3.4);
      hHand.rotation.x = 0; mHand.rotation.x = 0; hHand.rotation.x = -((2 + h) / 12) * Math.PI * 2; mHand.rotation.x = -h * Math.PI * 2;
      const u = lt / 5.6; cam = [lerp(-17, -14.5, u), lerp(6.5, 5.4, u), lerp(2, 0, u), 2.6, 4.6, .2, 56]; label = 'HOURS WAITED'; cnt = String(Math.floor(h + .001)); note = 'sorry for the wait'; hot = true; pop = lt > 4.3 ? 'SIX HOURS' : lt > .6 && lt < 2.8 ? 'CLOSING TIME' : ''; }
    if (bi !== 5) { const h = 2; hHand.rotation.x = -(h / 12) * Math.PI * 2; mHand.rotation.x = 0; }
    crowd.update(t); look.update();
    // headset on Drake
    attach(headband, D, 'head', [0, .06, 0], [0, 0, 0]); attach(cup, D, 'head', [-.24, -.02, 0]); attach(boom, D, 'head', [-.23, -.12, .09], [0, 0, 0]); attach(mic, D, 'head', [-.2, -.14, .17]); [headband, cup, boom, mic].forEach((m) => (m.visible = D.vis)); look.setVisible(D.vis);
    // manager props
    if (bi === 4 && MGR.vis) { attach(tag, MGR, 'torso', [-.15, .2, .165]); tag.visible = true; if (!tieLive) { attach(tie, MGR, 'torso', [0, .24, .168]); tie.visible = true; } else { tie.matrixAutoUpdate = true; MGR.M.torso.decompose(V, Q, SC); const g = 9.8, tt = Math.min(tieT, 1.15); const x0 = 2.1, y0 = 1.9, z0 = -3.1; const px = x0 - 4.2 * tt, py = Math.max(.07, y0 + 5.0 * tt - .5 * g * tt * tt), pz = z0 - 1.2 * tt; tie.position.set(px, py, pz); tie.rotation.set(tt * 14, tt * 9, py <= .08 ? Math.PI / 2 : 0); if (py <= .08) tie.rotation.set(Math.PI / 2, 0, .7); tie.visible = true; } } else tag.visible = false;
    // tears
    tears.clear(); let tk = 0; tearList.forEach((i) => { const d = drv(i); for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { if (tk >= 130) break; const a = (t * 1.8 + k / 3 + i * .17 + (sx > 0 ? .5 : 0)) % 1; V.set(sx * .078, -.025, .225).applyMatrix4(d.M.head); tears.set(tk++, V.x + .06 * a * (bi === 2 ? 1 : 1), V.y - a * a * .75, V.z + sx * .07 * a, 1 - a * .25); } }); tears.done();
    // fries
    if (bi === 3) { for (let j = 0; j < NF; j++) { const s = .25 + j * .026, age = lt - s; if (age < 0) { M4.makeScale(0, 0, 0); fries.setMatrixAt(j, M4); continue; } const zt = 2 + ((j * 7.37) % 30), T = 1.0 + zt / 45, xt = ((j * 13) % 9 - 4) * .18, yt = 1.4; const p0x = 2.0, p0y = 2.5, p0z = -2.5; const a = Math.min(age, T); if (age > T + .35) { M4.makeScale(0, 0, 0); fries.setMatrixAt(j, M4); continue; } const vx = (xt - p0x) / T, vz = (zt - p0z) / T, vy = (yt - p0y) / T + .5 * 9.8 * T; V.set(p0x + vx * a, p0y + vy * a - .5 * 9.8 * a * a, p0z + vz * a); E.set(age * (6 + j % 5), age * 4, age * 3 + j); Q.setFromEuler(E); SC.set(1, 1, 1); M4.compose(V, Q, SC); fries.setMatrixAt(j, M4); } }
    else { M4.makeScale(0, 0, 0); for (let j = 0; j < NF; j++) fries.setMatrixAt(j, M4); }
    fries.instanceMatrix.needsUpdate = true;
    // bubbles
    says.forEach(([b, o, txt]) => { const hp = headPos(o, 0); const dyHead = .4 * (o.scale || 1) + .15; b.show(txt, hp.x, hp.y + dyHead, hp.z); });
    st.cam(...cam); st.follow(bi === 2 ? 0 : 1.5, bi === 2 ? 14 : -1); st.render();
    hud.style('C'); hud.question(bi === 0 ? "What if *Drake* worked the McDonald's drive-thru?" : '', bi === 0 ? 1 : 0);
    hud.counter(label, cnt, note, 'PARODY', hot); hud.tm('');
    hud.pop(pop, Math.min(1, 6 * Math.max(0, lt - .1)) );
  } };
}
