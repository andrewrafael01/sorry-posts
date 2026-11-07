import { bedroom2 } from './_bed.js';
// What if your 2 AM thoughts played on the town loudspeaker? Bedroom (night) <-> town street (night) <-> Derek's room, morning button.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, mat, addBox, Crowd, Particles, buildStreet, building, R, clamp, smooth, lerp, attach } = lib;
  const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const seg = (x, a, b) => clamp((x - a) / (b - a));
  const ob = (x) => { const u = clamp(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
  const PI = Math.PI;
  globalThis.__night = true;
  const NIGHT = { top: 0x0a0f24, mid: 0x141c3c, bot: 0x2a3055, fog: 0x141a2c };
  const DAWN = { top: 0x5a86c8, mid: 0xf0b88e, bot: 0xf7d9ae, fog: 0xd9b99a };
  const tint = (st, k, sunI0, sunI1, hemi0, hemi1) => {
    const u = st.sky.material.uniforms; const c = new THREE.Color();
    u.top.value.set(NIGHT.top).lerp(c.set(DAWN.top), k); u.mid.value.set(NIGHT.mid).lerp(c.set(DAWN.mid), k); u.bot.value.set(NIGHT.bot).lerp(c.set(DAWN.bot), k);
    st.scene.fog.color.set(NIGHT.fog).lerp(c.set(DAWN.fog), k); st.sun.intensity = lerp(sunI0, sunI1, k); st.sun.color.set(0x8fa6ff).lerp(c.set(0xffd9a8), k); st.hemi.intensity = lerp(hemi0, hemi1, k);
  };

  // ------------------------------------------------------------------ shared sprite helpers
  const wrapLines = (g, text, maxW) => { const ws = text.split(' '); const out = []; let cur = ''; for (const w of ws) { const t2 = cur ? cur + ' ' + w : w; if (g.measureText(t2).width > maxW && cur) { out.push(cur); cur = w; } else cur = t2; } out.push(cur); return out; };
  const mkBub = (S, text, kind = 'speak', o = {}) => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'); g.lineJoin = 'round';
    const boxW = kind === 'think' ? 350 : kind === 'shout' ? 330 : 420, boxH = kind === 'label' ? 200 : 130; let fs = o.fs || 104, lines;
    do { g.font = `900 ${fs}px Liberation Sans, Arial`; lines = wrapLines(g, text, boxW); fs -= 4; } while ((lines.length * fs * 1.1 > boxH || lines.some((l) => g.measureText(l).width > boxW)) && fs > 20);
    g.lineWidth = 9; g.strokeStyle = '#111'; g.fillStyle = '#fff';
    if (kind === 'think') {
      const cs = [[256, 100, 140, 70], [120, 100, 80, 58], [392, 100, 80, 58], [190, 52, 70, 48], [322, 52, 70, 48], [190, 148, 70, 48], [322, 148, 70, 48]];
      for (const [x, y, rx, ry] of cs) { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.stroke(); } for (const [x, y, rx, ry] of cs) { g.beginPath(); g.ellipse(x, y, rx - 2, ry - 2, 0, 0, 7); g.fill(); }
      g.lineWidth = 8; for (const [x, y, r] of [[120, 196, 18], [76, 226, 12], [48, 246, 8]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.stroke(); }
    } else if (kind === 'speak') {
      g.beginPath(); g.roundRect(16, 14, 480, 176, 44); g.fill(); g.stroke(); g.beginPath(); g.moveTo(96, 186); g.lineTo(150, 186); g.lineTo(78, 244); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(100, 184); g.lineTo(146, 184); g.lineTo(150, 190); g.lineTo(98, 190); g.fill();
    } else if (kind === 'shout') {
      g.fillStyle = o.fill || '#ffd92a'; g.beginPath(); for (let i = 0; i < 32; i++) { const a = i / 32 * 6.2832, r = i % 2 ? .8 : 1; const x = 256 + Math.cos(a) * 246 * r, y = 128 + Math.sin(a) * 118 * r; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); g.stroke(); g.fill();
    } else if (kind === 'label') {
      g.fillStyle = o.fill || '#111'; g.strokeStyle = o.stroke || '#f2f2f2'; g.beginPath(); g.roundRect(14, 30, 484, 196, 30); g.fill(); g.stroke();
    }
    g.fillStyle = kind === 'label' ? (o.ink || '#fff') : '#111'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${fs + 4}px Liberation Sans, Arial`;
    const cy = kind === 'label' ? 128 : 100; lines.forEach((l, i) => g.fillText(l, 256, cy + (i - (lines.length - 1) / 2) * (fs + 4) * 1.08));
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, alphaTest: .3, depthWrite: true, fog: false, toneMapped: false })); sp.visible = false; sp.renderOrder = 5; S.add(sp);
    if (kind === 'think' || kind === 'speak') sp.center.set(.3, .05);
    return { sp, put(x, y, z, w, age = 1) { if (age < 0) { sp.visible = false; return; } const s = w * ob(age / .22); sp.visible = true; sp.position.set(x, y, z); sp.scale.set(s, s / 2, 1); }, hide() { sp.visible = false; } };
  };
  const mkTextSprite = (S, text, color = '#fff', o = {}) => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d'); g.font = `900 ${o.fs || 100}px Liberation Sans, Arial`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 12; g.strokeStyle = '#111'; g.lineJoin = 'round'; g.strokeText(text, 128, 70); g.fillStyle = color; g.fillText(text, 128, 70);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, alphaTest: .2, depthWrite: true, fog: false, toneMapped: false })); sp.visible = false; sp.renderOrder = 5; S.add(sp); return sp;
  };
  const mkNote = (S, color) => {
    const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.fillStyle = color; g.strokeStyle = '#111'; g.lineWidth = 7;
    g.beginPath(); g.ellipse(48, 98, 26, 19, -.4, 0, 7); g.fill(); g.stroke(); g.fillRect(66, 22, 9, 76); g.strokeRect(66, 22, 9, 76); g.beginPath(); g.moveTo(75, 22); g.quadraticCurveTo(110, 40, 100, 78); g.lineTo(92, 74); g.quadraticCurveTo(98, 50, 75, 42); g.fill(); g.stroke(); g.fillRect(67, 24, 8, 74);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, alphaTest: .2, depthWrite: true, fog: false, toneMapped: false })); sp.visible = false; sp.renderOrder = 5; S.add(sp); return sp;
  };
  const clockTex = (txt) => { const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d'); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; let cur = null; return { tex, set(s, on = 1) { const key = s + on; if (key === cur) return; cur = key; g.fillStyle = '#0a0304'; g.fillRect(0, 0, 256, 128); g.fillStyle = '#ff2a1a'; g.shadowColor = '#ff2a1a'; g.shadowBlur = on ? 22 : 0; g.font = 'bold 104px Liberation Mono, monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.globalAlpha = on ? 1 : .25; g.fillText(s, 128, 70); g.globalAlpha = 1; tex.needsUpdate = true; } }; };
  const mkClock = (S, x, y, z, ry, sc = 1) => { const ck = clockTex(); const grp = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, .78, .22), mat(0x15161a, { roughness: .4 })); const face = new THREE.Mesh(new THREE.PlaneGeometry(1.36, .66), new THREE.MeshBasicMaterial({ map: ck.tex, toneMapped: false })); face.position.z = .115; grp.add(body, face); grp.position.set(x, y, z); grp.rotation.y = ry; grp.scale.setScalar(sc); S.add(grp); const gl = new THREE.PointLight(0xff3a22, 1.6, 5); gl.position.set(x, y, z + .5); S.add(gl); return { ck, grp, gl }; };
  const colorize = (crowd, i, o) => { const col = (k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; }; if (o.shirt != null) ['torso', 'armL', 'armR'].forEach((k) => col(k, o.shirt)); if (o.pants != null) ['legL', 'legR'].forEach((k) => col(k, o.pants)); if (o.skin != null) ['head', 'neck', 'handL', 'handR'].forEach((k) => col(k, o.skin)); if (o.hair != null) col('hair', o.hair); };
  const mkLids = (S, crowd, idx) => { const p = crowd.p[idx]; const lm = mat(p.skin.getHex(), { roughness: .9 }), dk = mat(0x2a1a12); const ms = []; for (const sx of [-1, 1]) { const a = new THREE.Mesh(new THREE.BoxGeometry(.115, .06, .012), lm); const b = new THREE.Mesh(new THREE.BoxGeometry(.1, .01, .014), dk); S.add(a, b); ms.push([a, b, sx]); } return { upd(show) { for (const [a, b, sx] of ms) { attach(a, p, 'head', [sx * .078, -.004, .228]); attach(b, p, 'head', [sx * .078, -.03, .231]); a.visible = b.visible = show && p.vis; } } }; };
  const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _m = new THREE.Matrix4(), _s = new THREE.Vector3();
  const holdW = (mesh, o, key, off, rot) => { const s = o.scale * o.h; _v.setFromMatrixPosition(o.M[key]); const c = Math.cos(o.yaw), sn = Math.sin(o.yaw); _v.set(_v.x + (c * off[0] + sn * off[2]) * s, _v.y + off[1] * s, _v.z + (-sn * off[0] + c * off[2]) * s); _e.set(rot[0], o.yaw + rot[1], rot[2], 'YXZ'); _q.setFromEuler(_e); _s.set(s, s, s); _m.compose(_v, _q, _s); mesh.matrixAutoUpdate = false; mesh.matrix.copy(_m); mesh.visible = o.vis; };
  const headPos = (o, dx = 0, dy = 0, dz = 0) => new THREE.Vector3(dx, dy, dz).applyMatrix4(o.M.head);
  const mkZ = (S, n) => { const a = []; for (let i = 0; i < n; i++) a.push(mkTextSprite(S, 'Z', '#cfe3ff', { fs: 110 })); return { a, put(p, t, on, sc = 1) { a.forEach((sp, i) => { sp.visible = on; if (!on) return; const u = ((t * .5 + i / a.length) % 1); const hp = headPos(p, 0, 0, 0); sp.position.set(hp.x + .25 + u * .6, hp.y + .3 + u * .55, hp.z); const s = (.25 + u * .35) * sc; sp.scale.set(s * 2, s, 1); sp.material.opacity = 1 - u * u; }); } }; };

  // ================================================================== STAGE A: his bedroom (night) + window + outside platform
  const A = makeStage({ fog: NIGHT.fog, fogNear: 16, fogFar: 80, clouds: false, skyTop: NIGHT.top, skyMid: NIGHT.mid, skyBot: NIGHT.bot, shadowExtent: 16, hemi: .85, sunI: .55, sunColor: 0x8fa6ff, sunDir: [-.5, .8, .6], exposure: 1.3 });
  const bd = bedroom2(lib, A, A.scene); bd.lamp.intensity = 2.4; const SA = A.scene; const P = bd.person;
  SA.children.slice().forEach((m) => { if (m.isMesh && m.geometry.type === 'BoxGeometry') { const g = m.geometry.parameters; if (Math.abs(m.position.z - 8.5) < .01 && g.width === 12) SA.remove(m); else if (Math.abs(m.position.z - 8.32) < .01 && g.width === 2.2 && g.height === 1.6) SA.remove(m); else if (Math.abs(m.position.z - 8.2) < .01 && (g.width === 2.3 || g.height === 1.7)) SA.remove(m); } });
  const WC = 0x6f7690; addBox(SA, -2.4, 2.0, 8.5, 7.2, 4, .3, WC); addBox(SA, 5.7, 2.0, 8.5, .6, 4, .3, WC); addBox(SA, 3.3, .6, 8.5, 4.2, 1.2, .3, WC); addBox(SA, 3.3, 3.7, 8.5, 4.2, .6, .3, WC); addBox(SA, 3.3, 1.22, 8.3, 4.5, .07, .55, 0xdedede); addBox(SA, 3.3, 3.4, 8.3, 4.4, .07, .12, 0xeeeeee); addBox(SA, 1.2, 2.3, 8.3, .08, 2.2, .12, 0xeeeeee); addBox(SA, 5.4, 2.3, 8.3, .08, 2.2, .12, 0xeeeeee); addBox(SA, 3.3, 2.3, 8.3, .07, 2.2, .1, 0xeeeeee);
  { const og = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), mat(0x1a242c, { roughness: 1 })); og.rotation.x = -PI / 2; og.position.set(0, -.02, 60); og.receiveShadow = true; SA.add(og); }
  addBox(SA, 4.5, .25, 12.4, 15, .5, 7.2, 0x2a3a2c); addBox(SA, 3.6, .54, 12.0, 3.0, .04, 6.0, 0x8a1c26, { cast: false });
  { const r2 = R(7); for (let i = 0; i < 7; i++) building(SA, -22 + i * 11 + (r2() - .5) * 3, 46 + r2() * 4, 9 + r2() * 4, 16 + r2() * 14, 12, [0xb9a98a, 0x9fb0c2, 0xc2a79a, 0xa9bccc][i % 4], 30 + i); }
  { const pole = new THREE.Mesh(new THREE.CylinderGeometry(.08, .1, 5.4, 8), mat(0x2b2f36)); pole.position.set(8.4, 2.7, 13); SA.add(pole); const hd = new THREE.Mesh(new THREE.SphereGeometry(.28, 12, 8), new THREE.MeshStandardMaterial({ color: 0xffe0a8, emissive: 0xffc070, emissiveIntensity: 1.5 })); hd.position.set(8.4, 5.5, 13); SA.add(hd); const pl = new THREE.PointLight(0xffd9a0, 30, 30); pl.position.set(8.0, 5.2, 12.5); SA.add(pl); const pl2 = new THREE.PointLight(0xffd9a0, 14, 20); pl2.position.set(3.3, 3.6, 12.2); SA.add(pl2); }
  const clockA = mkClock(SA, .75, 2.2, 3.12, .78, .5);
  const phone = new THREE.Group(); { const cv = document.createElement('canvas'); cv.width = 128; cv.height = 512; const g = cv.getContext('2d'); const rr = R(2); for (let i = 0; i < 18; i++) { g.fillStyle = `hsl(${rr() * 360},70%,${45 + rr() * 20}%)`; g.fillRect(6, i * 28 + 4, 116, 22); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(14, i * 28 + 10, 50 + rr() * 40, 5); } var stex = new THREE.CanvasTexture(cv); stex.wrapT = THREE.RepeatWrapping; stex.repeat.set(1, .5); stex.colorSpace = THREE.SRGBColorSpace; const body = new THREE.Mesh(new THREE.BoxGeometry(.16, .3, .035), mat(0x15161a, { roughness: .2 })); const scr = new THREE.Mesh(new THREE.BoxGeometry(.14, .27, .005), new THREE.MeshBasicMaterial({ map: stex })); scr.position.z = .02; phone.add(body, scr); } phone.scale.setScalar(1.7); SA.add(phone); const glow = new THREE.PointLight(0x7fb0ff, 3, 6); SA.add(glow);
  const lidsGuy = mkLids(SA, bd.crowd, 0); const zGuy = mkZ(SA, 3);
  // thought bubbles (exact thoughts)
  const THINK = [null, 'I should text her.', 'One more episode.', 'What I said in 2014.', 'What if she liked me?', 'How is Derek doing?'];
  const thinkB = THINK.map((tx) => tx && mkBub(SA, tx, 'think', { fs: 100 })); thinkB.forEach((b) => b && (b.sp.material.depthTest = false));
  // premiere crowd outside the window
  const PN = 9; const pc = new Crowd(SA, PN, 41); const SPOT = [[2.2, 9.5], [3.1, 9.45], [4.0, 9.5], [4.9, 9.5], [2.6, 10.5], [3.5, 10.45], [4.4, 10.5], [1.6, 10.6], [5.2, 10.6]];
  pc.p.forEach((p, i) => { p.scale = 1; p.h = .95 + (i % 4) * .04; }); const pcLids = pc.p.map((_, i) => mkLids(SA, pc, i));
  const popBox = pc.p.map((_, i) => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(.2, .26, .17), mat(0xd8262d)); const st = new THREE.Mesh(new THREE.BoxGeometry(.205, .26, .06), mat(0xf6f2e6)); g.add(b, st); for (let k = 0; k < 6; k++) { const pf = new THREE.Mesh(new THREE.IcosahedronGeometry(.06, 0), mat(0xfff0b0)); pf.position.set(((k % 3) - 1) * .06, .16 + (k > 2 ? .05 : 0), (k % 2 - .5) * .06); g.add(pf); } g.traverse((m) => { m.castShadow = true; }); SA.add(g); return g; });
  const popBits = new Particles(SA, 24, 0xfff0b0, .035, { rough: .8, emissive: 0x201800 });
  const zPC = pc.p.map((_, i) => (i % 3 === 0 ? mkZ(SA, 2) : null));
  const premSign = mkBub(SA, 'NOW SHOWING: HIM', 'label', { fill: '#7a1620', stroke: '#ffd92a' });

  // ================================================================== STAGE B: night street + loudspeaker
  const B = makeStage({ fog: NIGHT.fog, fogNear: 50, fogFar: 300, clouds: false, skyTop: NIGHT.top, skyMid: NIGHT.mid, skyBot: NIGHT.bot, shadowExtent: 34, hemi: .9, hemiSky: 0x6070b0, hemiGround: 0x1c2030, sunI: .6, sunColor: 0x8fa6ff, sunDir: [-.5, .8, .6], exposure: 1.35 });
  const SB = B.scene; const street = buildStreet(SB, { grass: 0x18241f, seed: 3 });
  street.buildings.forEach((b) => { (b.userData.whole || []).forEach((m) => { if (m.emissiveIntensity != null && m.emissiveMap) m.emissiveIntensity = .3; m.color && m.color.multiplyScalar(.6); }); });
  street.crowd.p.forEach((p) => { p.vis = false; }); street.crowd.update(0); street.cars.forEach((c) => { if (c.m.position.z > 10 && c.m.position.z < 70) c.m.visible = false; });
  { const lp = []; for (const z of [24, 36, 48]) for (const s of [-1, 1]) { const l = new THREE.PointLight(0xffd9a0, 22, 26); l.position.set(s * 7.2, 5.2, z); SB.add(l); lp.push(l); } B.lamps = lp; for (let z = 4; z < 120; z += 22) for (const s of [-1, 1]) { const hd = new THREE.Mesh(new THREE.SphereGeometry(.24, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffe0a8, emissive: 0xffc070, emissiveIntensity: 1.4 })); hd.position.set(s * 7.4, 5.3, z); SB.add(hd); } }
  const moon = new THREE.Mesh(new THREE.SphereGeometry(7, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff0c0, fog: false })); moon.position.set(-3, 17, 78); SB.add(moon);
  const SPK = { x: -3.2, z: 22, h: 6.4 }; const spkYaw = Math.atan2(3.2, 10); const dirv = new THREE.Vector3(Math.sin(spkYaw), 0, Math.cos(spkYaw));
  const horn = new THREE.Group(); { const metal = new THREE.MeshStandardMaterial({ color: 0xc9ced6, metalness: .6, roughness: .35, side: THREE.DoubleSide });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.14, .2, SPK.h, 10), mat(0x30343c)); pole.position.set(SPK.x, SPK.h / 2, SPK.z); pole.castShadow = true; SB.add(pole); addBox(SB, SPK.x, .25, SPK.z, 1.2, .5, 1.2, 0x30343c);
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(1.35, .38, 1.9, 24, 1, true), metal); cone.rotation.x = PI / 2; cone.position.z = .95; cone.castShadow = true; horn.add(cone);
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(1.3, .34, 1.86, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0x5a606c, side: THREE.BackSide })); inner.rotation.x = PI / 2; inner.position.z = .95; horn.add(inner);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.35, .07, 8, 32), new THREE.MeshStandardMaterial({ color: 0xe8ecf2, metalness: .7, roughness: .25 })); rim.position.z = 1.9; horn.add(rim);
    const drv = new THREE.Mesh(new THREE.BoxGeometry(.95, .95, .95), mat(0x2b2f36)); drv.position.z = -.35; drv.castShadow = true; horn.add(drv);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(.4, .4, .5, 14), mat(0x2b2f36)); cap.rotation.x = PI / 2; cap.position.z = -.95; horn.add(cap);
    var redL = new THREE.Mesh(new THREE.SphereGeometry(.14, 10, 8), new THREE.MeshStandardMaterial({ color: 0xff3020, emissive: 0xff2010, emissiveIntensity: 2 })); redL.position.set(0, .62, -.1); horn.add(redL); }
  horn.position.set(SPK.x, SPK.h, SPK.z); horn.rotation.y = spkYaw; SB.add(horn);
  const mouth = new THREE.Vector3(SPK.x, SPK.h, SPK.z).addScaledVector(dirv, 1.95);
  const rings = []; for (let i = 0; i < 14; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .05, 8, 44), new THREE.MeshBasicMaterial({ color: 0xcfeaff, transparent: true, opacity: 0, fog: false, depthWrite: false })); m.visible = false; m.rotation.y = spkYaw; SB.add(m); rings.push(m); }
  const notes = []; for (let i = 0; i < 10; i++) notes.push(mkNote(SB, ['#9fb8ff', '#ffffff', '#c9a8ff'][i % 3]));
  const hornBub = [null, mkBub(SB, 'I SHOULD TEXT HER.', 'shout', { fs: 96 }), null, mkBub(SB, 'WHAT I SAID IN 2014', 'shout', { fs: 96 }), null, null, mkBub(SB, 'zzzzz', 'shout', { fs: 120, fill: '#cfe3ff' })];
  const hornBub0 = mkBub(SB, 'hm.', 'shout', { fs: 120 });
  // people in town
  const NB = 30; const tc = new Crowd(SB, NB, 99); const T = tc.p; const MAYOR = 0, GREG = 11;
  colorize(tc, MAYOR, { shirt: 0x2a3a6a, pants: 0x1a1d2a }); T[MAYOR].scale = 1.12;
  colorize(tc, GREG, { shirt: 0x6a2a4a, pants: 0x20222c, skin: 0xe2b896, hair: 0x4a3524 }); T[GREG].skin.set(0xe2b896);
  const tHat = new THREE.Group(); { const h1 = new THREE.Mesh(new THREE.CylinderGeometry(.19, .21, .36, 14), mat(0x15161a)); h1.position.y = .2; const h2 = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .035, 18), mat(0x15161a)); const hb = new THREE.Mesh(new THREE.CylinderGeometry(.205, .205, .06, 14), mat(0xb8262d)); hb.position.y = .06; tHat.add(h1, h2, hb); tHat.traverse((m) => (m.castShadow = true)); SB.add(tHat); }
  addBox(SB, -.3, .25, 26.2, 1.3, .5, 1.1, 0x5a3a2a);
  const sash = new THREE.Mesh(new THREE.BoxGeometry(.1, .92, .345), mat(0xd8262d)); SB.add(sash); const medal = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .02, 12), new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: .9, roughness: .25 })); medal.rotation.x = PI / 2; SB.add(medal);
  const lidsT = T.map((_, i) => mkLids(SB, tc, i)); const zT = T.map((_, i) => (i % 4 === 0 ? mkZ(SB, 2) : null));
  const dontB = []; for (let i = 0; i < 6; i++) dontB.push(mkBub(SB, "DON'T", 'speak', { fs: 110 })); const mayorB1 = mkBub(SB, "DON'T.", 'speak', { fs: 110 }), mayorB2 = mkBub(SB, "DON'T.", 'speak', { fs: 110 });
  // violin + bow (box built), Greg
  const violin = new THREE.Group(); { const inner = new THREE.Group(); const wood = mat(0xa04a1c, { roughness: .45 }), dark = mat(0x1d130c, { roughness: .5 });
    const lo = new THREE.Mesh(new THREE.BoxGeometry(.26, .09, .17), wood), wa = new THREE.Mesh(new THREE.BoxGeometry(.17, .09, .1), wood); wa.position.x = -.19; const up = new THREE.Mesh(new THREE.BoxGeometry(.2, .09, .14), wood); up.position.x = -.12; up.visible = false;
    const neck = new THREE.Mesh(new THREE.BoxGeometry(.4, .035, .05), dark); neck.position.x = -.42; const scroll = new THREE.Mesh(new THREE.BoxGeometry(.07, .05, .06), dark); scroll.position.x = -.65; const chin = new THREE.Mesh(new THREE.BoxGeometry(.09, .03, .06), dark); chin.position.set(.08, .06, 0);
    const fb = new THREE.Mesh(new THREE.BoxGeometry(.38, .008, .045), mat(0x0a0a0c)); fb.position.set(-.38, .02, 0); lo.position.x = 0; inner.add(lo, wa, neck, scroll, chin, fb); for (let k = -1; k <= 1; k += 2) { const stg = new THREE.Mesh(new THREE.BoxGeometry(.7, .004, .004), mat(0xe8e0c0)); stg.position.set(-.3, .045, k * .012); inner.add(stg); } inner.traverse((m) => (m.castShadow = true)); violin.add(inner); SB.add(violin); }
  const bow = new THREE.Group(); { const stick = new THREE.Mesh(new THREE.BoxGeometry(.03, .03, .78), mat(0x3a2414)); const hair = new THREE.Mesh(new THREE.BoxGeometry(.012, .02, .74), mat(0xf4f0e0)); hair.position.y = -.025; const frog = new THREE.Mesh(new THREE.BoxGeometry(.05, .06, .07), mat(0x15110c)); frog.position.z = -.35; bow.add(stick, hair, frog); bow.traverse((m) => (m.castShadow = true)); SB.add(bow); }
  const tears = new Particles(SB, 40, 0x8fd8ff, .045, { rough: .1, emissive: 0x1a4a70 }); const gregName = mkBub(SB, 'GREG', 'label', { fs: 120 });
  // dogs (box built)
  const mkDog = (color, patch, scale) => { const g = new THREE.Group(); const m = mat(color, { roughness: .9 }), pm = mat(patch, { roughness: .9 }); const part = (w, h, d, x, y, z, mm = m) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mm); b.position.set(x, y, z); b.castShadow = true; g.add(b); return b; };
    part(.38, .36, .85, 0, .52, 0); part(.3, .2, .3, 0, .6, -.2, pm); for (const [x, z] of [[-.13, .3], [.13, .3], [-.13, -.3], [.13, -.3]]) part(.1, .38, .1, x, .19, z);
    const head = new THREE.Group(); head.position.set(0, .72, .38); g.add(head); const hb = new THREE.Mesh(new THREE.BoxGeometry(.28, .26, .3), m); hb.position.set(0, .06, .1); hb.castShadow = true; head.add(hb); const sn = new THREE.Mesh(new THREE.BoxGeometry(.17, .13, .24), pm); sn.position.set(0, 0, .36); sn.castShadow = true; head.add(sn); const nose = new THREE.Mesh(new THREE.BoxGeometry(.07, .05, .04), mat(0x0a0a0a)); nose.position.set(0, .04, .49); head.add(nose);
    for (const x of [-.15, .15]) { const ear = new THREE.Mesh(new THREE.BoxGeometry(.07, .17, .08), pm); ear.position.set(x, .22, .02); ear.rotation.z = x * 2; head.add(ear); const eye = new THREE.Mesh(new THREE.BoxGeometry(.04, .045, .02), mat(0x0a0a0a)); eye.position.set(x * .75, .12, .26); head.add(eye); }
    const jawP = new THREE.Group(); jawP.position.set(0, -.04, .28); head.add(jawP); const jaw = new THREE.Mesh(new THREE.BoxGeometry(.13, .04, .2), pm); jaw.position.set(0, -.02, .1); jawP.add(jaw); const tongue = new THREE.Mesh(new THREE.BoxGeometry(.07, .015, .12), mat(0xe0707a)); tongue.position.set(0, .0, .1); jawP.add(tongue);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(.07, .07, .4), m); tail.position.set(0, .66, -.55); tail.rotation.x = .9; tail.castShadow = true; g.add(tail); g.scale.setScalar(scale); SB.add(g); return { g, head, jawP, tail }; };
  const DOGS = [[0x8a5a34, 0xf0e4cc, 1.2, -2.4, 29.5, 1.3], [0x25252a, 0x7a5a3a, 1.3, -1.1, 31.6, -1.3], [0xe0cfa8, 0x8a5a34, 1.2, .2, 29.2, 1.5], [0xf2f2ee, 0x3a3a3e, 1.25, 1.4, 31.4, -1.4], [0x6a4a2e, 0x2a2018, 1.35, 2.5, 29.6, 1.2], [0x9a8a7a, 0xf0e8dc, 1.15, -.4, 33.4, -1.2]].map(([c, pc2, s, x, z, yw]) => Object.assign(mkDog(c, pc2, s), { x, z, yw }));
  const awoo = DOGS.map(() => mkBub(SB, 'AWOOO', 'shout', { fs: 100 })); const cap2014 = mkBub(SB, '2014', 'label', { fs: 200, fill: '#101018', stroke: '#ffd92a', ink: '#ffd92a' });

  // ================================================================== STAGE C: Derek's room, three towns over
  const C = makeStage({ fog: 0x1a2020, fogNear: 14, fogFar: 46, clouds: false, skyTop: 0x101820, skyMid: 0x101820, skyBot: 0x101820, shadowExtent: 14, hemi: .85, hemiSky: 0x8fb8a0, sunI: .5, sunDir: [.5, .8, .6], exposure: 1.3 });
  const bdC = bedroom2(lib, C, C.scene); bdC.lamp.intensity = 1.0; bdC.lamp.color.set(0xa8e0b0); const D = bdC.person; bdC.blanket.material.color.set(0x5a7a5a); const SC = C.scene;
  colorize(bdC.crowd, 0, { shirt: 0x8a8f99, hair: 0x2a1b10, skin: 0xc99872 }); D.skin.set(0xc99872);
  const clockC = mkClock(SC, 3.0, 2.3, 3.05, 0, 1.0); const lidsD = mkLids(SC, bdC.crowd, 0); const zD = mkZ(SC, 3);
  const derekLabel = mkBub(SC, 'DEREK · 3 TOWNS OVER', 'label', { fs: 90, fill: '#10201a', stroke: '#9fe0b0' }); const derekB = mkBub(SC, "I'm good, man.", 'speak', { fs: 100 });

  // ================================================================== frame
  const CLOCKS = ['2:00', '2:03', '2:17', '2:41', '3:12', '3:58', '7:30'];
  const CAMA = { bed: [4.9, 2.2, 6.9, .1, 1.95, 3.9, 56], winIn: [-.3, 2.4, 5.3, 3.3, 2.3, 9.8, 54], winOut: [4.6, 4.4, 13.2, 1.0, 2.2, 4.5, 56] };
  return {
    frame({ t, bi, lt, p }) {
      bi = Math.min(bi, 6); let view = 'A', cam = 'bed';
      if (bi === 0) { view = 'B'; cam = 'title'; }
      else if (bi === 1) { if (lt < 3.7) view = 'A'; else { view = 'B'; cam = lt < 5.0 ? 'horn' : lt < 6.8 ? 'crowd' : 'mayor'; } }
      else if (bi === 2) { view = 'A'; cam = lt < 3.9 ? 'bed' : lt < 5.6 ? 'winIn' : 'winOut'; }
      else if (bi === 3) { if (lt < 4.4) view = 'A'; else { view = 'B'; cam = lt < 5.3 ? 'horn' : 'dogs'; } }
      else if (bi === 4) { if (lt < 3.7) view = 'A'; else { view = 'B'; cam = lt < 5.8 ? 'horn' : 'greg'; } }
      else if (bi === 5) { if (lt < 3.8) view = 'A'; else { view = 'C'; cam = 'derek'; } }
      else { if (lt < 2.9) { view = 'B'; cam = 'dawn'; } else { view = 'A'; cam = lt < 4.2 ? 'bed' : 'winOut'; } }
      const morning = bi === 6; const clk = CLOCKS[bi];
      // ---------------- A world (guy, window crowd, clock)
      if (view === 'A') {
        const asleep = morning; P.anim = 'sit'; P.x = 0; P.z = 3.5; P.y = .06; P.yaw = 0; P.hs = 1; P.extra = 0; P.vis = true; P.arms = asleep ? { lx: -.15, lz: -.1, rx: -.35, rz: .05 } : { lx: -.35, lz: -.12, rx: -1.85, rz: .05 };
        bd.crowd.setFace('calm'); bd.crowd.update(t); bd.blanket.userData.update(t, .02, 0, 0);
        tint(A, morning ? seg(lt, 0, 2.9) * 0 + 1 : 0, .55, 2.2, .85, 1.3); bd.lamp.intensity = morning ? .6 : 2.4;
        if (!asleep) { attach(phone, P, 'handR', [0, .04, .1], [1.85, PI, 0]); phone.visible = true; const pp = new THREE.Vector3().setFromMatrixPosition(phone.matrix); glow.position.copy(pp).add(new THREE.Vector3(0, 0, -.3)); glow.intensity = 3 + Math.sin(t * 9) * .4; stex.offset.y = (t * .35) % 1; }
        else { phone.matrixAutoUpdate = true; phone.position.set(.5, 1.22, 4.3); phone.rotation.set(-PI / 2 + .1, 0, .6); phone.visible = true; glow.position.set(.5, 1.5, 4.3); glow.intensity = 1; }
        lidsGuy.upd(asleep); zGuy.put(P, t, asleep, 1.3);
        const flick = bi >= 1 && bi <= 5 ? (lt < .25 ? ((lt * 24 | 0) % 2) : 1) : 1; clockA.ck.set(morning ? '7:30' : clk, flick); clockA.gl.intensity = 1.6 * flick;
        const th = THINK[bi]; const hp = headPos(P, 0, .1, 0); thinkB.forEach((b, i) => b && b.hide());
        const tS = [0, 2.08, 2.04, 1.98, 1.7, 1.8][bi] ?? 99; const tE = [0, 3.7, 3.9, 4.4, 3.7, 3.8][bi] ?? 0;
        if (th && lt >= tS && lt < tE) thinkB[bi].put(hp.x - .1, hp.y + .45, hp.z + .2, 1.9, lt - tS);
        // premiere crowd
        const show = (bi === 2 && lt >= 3.9 && cam !== 'bed') || (morning && cam === 'winOut');
        pc.p.forEach((o, i) => {
          o.vis = show; o.arms = null; o.lie = 0; o.pitch = 0; o.anim = 'idle'; o.extra = 0; o.y = .5; o.speed = 1; const sp = SPOT[i]; o.yaw = PI + (i % 2 ? .12 : -.12) * (sp[0] > 3.6 ? 1 : -1);
          if (bi === 2) { const arr = 3.9 + i * .22; const u = seg(lt, arr, arr + 1.5); const sx = sp[0] + 6 + i * .8, sz = sp[1] + 3.5; o.x = lerp(sx, sp[0], smooth(u)); o.z = lerp(sz, sp[1], smooth(u)); o.anim = u < 1 ? 'walk' : 'idle'; o.yaw = u < 1 ? Math.atan2(sp[0] - sx, sp[1] - sz) : o.yaw; o.speed = 1; if (u >= 1) { const eat = .5 + .5 * Math.sin(lt * 4.2 + i * 1.7); o.arms = { lx: lerp(-.9, -2.3, eat > .7 ? 1 : eat * .5), lz: -.1, rx: -1.0, rz: -.2 }; } else o.arms = { lx: -.9, lz: -.1, rx: -1.0, rz: -.2 }; }
          else { o.x = sp[0] + (i % 3 - 1) * .1; o.z = sp[1] - .5; o.yaw = PI; o.pitch = 1.25 + (i % 3) * .08; o.arms = { lx: -.6, lz: -.1, rx: -.4, rz: .1 }; }
        });
        pc.update(t); pcLids.forEach((l, i) => l.upd(morning && show)); zPC.forEach((z, i) => z && z.put(pc.p[i], t, morning && show, 1.2));
        popBox.forEach((g, i) => { const o = pc.p[i]; holdW(g, o, 'handR', [0, -.02, .05], [morning ? 1.2 : -.1, 0, 0]); g.visible = show; });
        { let n = 0; for (let i = 0; i < 24; i++) { if (bi === 2 && show && lt > 5.0) { const o = pc.p[i % PN]; const a = (lt * 1.3 + i * .37) % 1; popBits.set(i, o.x + Math.sin(i * 2.1) * .25, 2.1 + a * 1.0 - a * a * .9 + (i % 3) * .08, o.z - .35 + Math.cos(i) * .1, (1 - a) * 1.0); n++; } else popBits.set(i, 0, 0, 0, 0); } popBits.done(); }
        premSign.hide(); if (bi === 2 && cam === 'winOut' && lt >= 5.8) premSign.put(.4, 2.5, 8.1, 1.9, lt - 5.8);
        let cc = CAMA[cam]; if (cam === 'bed') { const d = bi === 6 ? [3.4, 2.3, 6.6, .0, 1.7, 3.9, 50] : [4.9 - lt * .03, 2.2, 6.9 - lt * .03, .3, 1.8, 3.9, 56]; cc = d; } if (cam === 'winOut' && morning) cc = [4.6 - lt * .05, 4.4, 13.2, 1.0, 2.2, 4.5, 56]; A.cam(...cc); A.follow(0, 6); A.render();
      }
      // ---------------- B world (town)
      if (view === 'B') {
        const dawn = morning ? 1 : 0; tint(B, dawn, .6, 2.3, .9, 1.2); B.lamps.forEach((l) => (l.intensity = lerp(22, 3, dawn)));
        T.forEach((o) => { o.vis = false; o.arms = null; o.lie = 0; o.pitch = 0; o.anim = 'idle'; o.extra = 0; o.y = 0; o.speed = 1; o.hs = 1; });
        T[MAYOR].scale = 1.12; T[GREG].scale = 1.05; tc.setFace('calm');
        let talkStart = null, talkEnd = null, spkVal = 0, spkKind = 0; // loudspeaker emission window in lt
        if (bi === 1) { talkStart = 3.78; talkEnd = 5.0; } if (bi === 3) { talkStart = 4.4; talkEnd = 5.3; } if (bi === 4) { talkStart = 3.7; talkEnd = 6.2; spkKind = 1; } if (bi === 0) { talkStart = 1.8; talkEnd = 4.0; }
        // crowd of people facing the speaker (b0, b1, b3 horn shot positions)
        const arc = (k, n, r, a0, a1) => { const a = lerp(a0, a1, n > 1 ? k / (n - 1) : .5); return [SPK.x + r * Math.sin(a), SPK.z + r * Math.cos(a), a]; };
        const place = (i, x, z, yaw, anim = 'idle') => { const o = T[i]; o.vis = true; o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; };
                if (bi === 0 || bi === 1) {
          for (let k = 0; k < 12; k++) { const row = (k / 4) | 0, col = k % 4; place(1 + k, -1.95 + col * 1.3 + (row % 2) * .45 + ((k * 7) % 5 - 2) * .06, 30.2 + row * 1.7, ((k * 5) % 7 - 3) * .05); }
          place(MAYOR, -.3, 26.2, 0); T[MAYOR].y = .5;
        }
        if (bi === 1) {
          const shout = lt >= 5.8 && lt < 6.8; tc.setFace(shout || lt >= 6.8 ? 'shock' : 'calm');
          for (let k = 0; k < 12; k++) { const o = T[1 + k]; if (lt >= 5.5) { const w = Math.sin(lt * 10 + k); o.arms = { lx: -1.45 + w * .12, lz: -.1, rx: -1.45 - w * .12, rz: .1 }; } if (cam === 'mayor' && Math.abs(o.x + .3) < 1.5) o.vis = false; }
          const m = T[MAYOR]; if (lt >= 5.5) { const w = Math.sin(lt * 11); m.arms = { lx: -.3, lz: -.15, rx: -1.5 + w * .25, rz: .1 }; } if (lt >= 6.8) { const w = Math.sin(lt * 11); m.arms = { lx: -1.5 - w * .15, lz: -.15, rx: -1.5 + w * .25, rz: .1 }; }
        }
        if (bi === 3) {
          for (let k = 0; k < 6; k++) { const o = T[1 + k]; const x = -2.6 + k * 1.04, z = 37.5 + (k % 3) * 1.3; place(1 + k, x, z, PI); if (lt >= 7.56) { const w = Math.sin(lt * 3 + k); o.arms = { lx: -.3, lz: .95, rx: -.4 + w * .08, rz: -.95 }; } }
        }
        if (bi === 4) {
          const g = T[GREG]; place(GREG, -.6, 27, 0.0); g.y = .5; g.arms = null;
          for (let k = 0; k < 6; k++) { const x = (k < 3 ? -3.2 + k * .8 : 1.6 + (k - 3) * .8), z = 29.5 + (k % 2) * .9; place(1 + k, x, z, PI + (x + .6) * -.12); T[1 + k].arms = { lx: -2.4, lz: .3, rx: -2.4, rz: -.3 }; }
        }
        if (bi === 6) {
          T[MAYOR].vis = true; for (let i = 1; i < NB; i++) T[i].vis = i !== GREG || true;
          for (let i = 0; i < NB; i++) { const o = T[i]; o.vis = true; const rr = R(500 + i); const r1 = rr(), r2 = rr(), r3 = rr(); o.x = -4.5 + r1 * 9; o.z = 27 + r2 * 10; if (Math.abs(o.x) < 2.2 && (i % 5)) o.x += 3.4 * (o.x < 0 ? -1 : 1); o.yaw = r3 * 6.28; const kind = i % 3; if (kind === 0) { o.lie = PI / 2; o.y = .16; o.arms = { lx: -.2, lz: -.7, rx: .1, rz: .8 }; } else if (kind === 1) { o.pitch = 1.35; o.anim = 'idle'; o.arms = { lx: .1, lz: 0, rx: .2, rz: 0 }; } else { o.anim = 'sit'; o.lie = .3; o.y = -.72; o.arms = { lx: -.1, lz: -.4, rx: -.1, rz: .4 }; } }
          T[MAYOR].x = -1.2; T[MAYOR].z = 29; T[MAYOR].lie = PI / 2; T[MAYOR].y = .17; T[MAYOR].yaw = .3; T[MAYOR].anim = 'idle'; T[MAYOR].pitch = 0; T[MAYOR].arms = { lx: -.3, lz: -.7, rx: -.2, rz: .6 }; T[MAYOR].scale = 1.12;
          T[GREG].lie = PI / 2; T[GREG].y = .16; T[GREG].x = 1.6; T[GREG].z = 33; T[GREG].yaw = 3.4; T[GREG].anim = 'idle'; T[GREG].pitch = 0; T[GREG].arms = { lx: -1.5, lz: -.7, rx: -1.7, rz: .5 };
        }
        tc.update(t);
        // mayor props
        const mo = T[MAYOR]; if (bi <= 1 || bi === 6) { holdW(tHat, mo, 'head', [0, .29, 0], [bi === 6 ? .15 : 0, 0, 0]); attach(sash, mo, 'torso', [0, 0, .01], [0, 0, .75]); attach(medal, mo, 'torso', [-.14, .05, .175], [PI / 2, 0, 0]); tHat.visible = sash.visible = medal.visible = mo.vis; } else { tHat.visible = sash.visible = medal.visible = false; }
        lidsT.forEach((l, i) => l.upd(bi === 6)); zT.forEach((z, i) => z && z.put(T[i], t, bi === 6 && cam === 'dawn', 1.4));
        // greg's violin
        const gr = T[GREG]; const gv = bi === 4;
        if (gv) { const saw = Math.sin(lt * 5.2); const sobbing = seg(lt, 7.2, 7.6); gr.arms = { lx: -.86, lz: -.625, rx: -.76 + saw * .16, rz: -.865 + saw * .02 }; gr.extra = sobbing * .05; tc.setFace(lt >= 7.3 ? 'shock' : 'calm'); gr.pitch = .05 + sobbing * .12; tc.update(t); holdW(violin, gr, 'torso', [-.2, -.02, .5], [0, 0, 0]); violin.matrix.copy(violin.matrix); holdW(bow, gr, 'handR', [0, 0, 0], [0, 0, 0]); violin.visible = bow.visible = true; bow.position.set(0, 0, 0); } else violin.visible = bow.visible = false;
        // tears
        tears.clear(); if (gv && lt >= 7.15) { const gen = seg(lt, 7.15, 7.8); for (let side = -1; side <= 1; side += 2) for (let j = 0; j < 20; j++) { const age = ((lt * 1.3 + j / 20) % 1); const a = age; const v = new THREE.Vector3(side * (.08 + .55 * a * gen), -.005 + .3 * a - 1.5 * a * a, .226 + .18 * a).applyMatrix4(gr.M.head); tears.set(j + (side > 0 ? 20 : 0), v.x, v.y, v.z, Math.min(1, 1.6 - a) * gen); } tears.done(); } else tears.done();
        gregName.hide(); if (gv && lt >= 5.9 && lt < 7.4) { const hp = headPos(gr, 0, .55, 0); gregName.put(hp.x, hp.y, hp.z, 1.7, lt - 5.9); }
        // loudspeaker rings/bubbles
        rings.forEach((r) => (r.visible = false)); notes.forEach((n) => (n.visible = false)); hornBub.forEach((b) => b && b.hide()); hornBub0.hide();
        const talking = talkStart !== null && lt >= talkStart && lt < talkEnd + 1.0; redL.material.emissiveIntensity = talking ? 1.5 + 1.5 * Math.sin(t * 20) : .3;
        if (talkStart !== null && lt >= talkStart) for (let i = 0; i < rings.length; i++) { const ts = talkStart + i * .2; if (ts > talkEnd) break; const age = lt - ts; if (age < 0 || age > 1.6) continue; const rg = rings[i]; rg.visible = true; const d = age * 8.0; rg.position.copy(mouth).addScaledVector(dirv, d); rg.scale.setScalar(1.0 + age * 1.5); rg.material.opacity = (1 - age / 1.6) * .55; rg.material.color.set(spkKind ? 0xa8b8ff : 0xcfeaff); }
        if (spkKind && talkStart !== null) for (let i = 0; i < notes.length; i++) { const ts = talkStart + 0.3 + i * .22; const age = lt - ts; if (age < 0 || age > 2.2) continue; const n = notes[i]; n.visible = true; const sd = (i % 2 ? 1 : -1); n.position.copy(mouth).addScaledVector(dirv, age * 3.2 + .6); n.position.x += sd * (.5 + age * .6); n.position.y += 1.0 + age * 1.1 + Math.sin(age * 5 + i) * .25; const s = 1.5; n.scale.set(s, s, 1); n.material.opacity = 1; }
        const hb = [hornBub0, hornBub[1], null, hornBub[3], null, null, hornBub[6]][bi];
        if (bi === 0 && lt > 2.2 && lt < 4.2) hornBub0.put(mouth.x + dirv.x * 1.6 + 1.0, mouth.y + 1.7, mouth.z + dirv.z * 1.6, 3.0, lt - 2.2);
        if (cam === 'horn' && (bi === 1 || bi === 3) && lt >= talkStart + .15 && lt < talkEnd + 1.6) hb.put(mouth.x + dirv.x * 2.2 + 1.2, mouth.y + 1.8, mouth.z + dirv.z * 2.2, 4.4, lt - talkStart - .15);
        if (bi === 6 && cam === 'dawn') hornBub[6].put(mouth.x + dirv.x * 1.6 + 1.0, mouth.y + 1.5, mouth.z + dirv.z * 1.6, 3.4, lt - .2);
        horn.rotation.x = bi === 6 ? .5 : 0;
        // bubbles over crowd / mayor
        dontB.forEach((b) => b.hide()); mayorB1.hide(); mayorB2.hide();
        if (bi === 1) { const ids = [1, 2, 3, 4, 6, 7]; ids.forEach((id, j) => { const a = lt - (5.84 + j * .1); if (a >= 0 && lt < 8.0 && T[id].vis) { const hp = headPos(T[id], 0, .5, 0); dontB[j].put(hp.x, hp.y, hp.z, 1.7, a); } }); const mh = headPos(mo, 0, .5, 0); const a1 = lt - 6.84, a2 = lt - 7.56; if (a1 >= 0) mayorB1.put(mh.x - .3, mh.y + .5, mh.z, 1.9, a1); if (a2 >= 0) mayorB2.put(mh.x - .1, mh.y + 1.4, mh.z, 2.4, a2); }
        // dogs
        cap2014.hide(); awoo.forEach((b) => b.hide());
        DOGS.forEach((d, i) => { const vis = bi === 3 && lt >= 4.4; d.g.visible = vis; d.g.position.set(d.x, 0, d.z); d.g.rotation.y = d.yw; if (!vis) return; const hs = 5.3 + i * .22; const u = seg(lt, hs, hs + .5); const howl = smooth(u); d.head.rotation.x = lerp(.12, -1.05, howl) + Math.sin(t * 3 + i) * .05 * howl; d.jawP.rotation.x = howl * (.3 + .25 * Math.sin(t * 7 + i * 2)); d.tail.rotation.z = Math.sin(t * 9 + i) * .5 * (1 - howl); d.g.position.y = 0; if (u > 0) { const hp = new THREE.Vector3(0, .9, .6).multiplyScalar(d.g.scale.x).applyAxisAngle(new THREE.Vector3(0, 1, 0), d.yw); awoo[i].put(d.x + hp.x, 2.3 * d.g.scale.x / 1.5 + .4 + Math.sin(t * 4 + i) * .08, d.z + hp.z, 1.8 + (i % 2) * .3, lt - hs); } });
        if (bi === 3 && lt >= 5.3) cap2014.put(0.2, 4.3, 31, 2.6, lt - 5.3);
        // camera
        const dollyT = lt;
        const cams = { title: [9 - t * .4, 4.2, 42 - t * .6, SPK.x + .5, 5.2, SPK.z + 4, 52], horn: [7.5, 3.6, 40.5, SPK.x + .6, 5.4, 25, 50], crowd: [.4, 2.7, 40.2, -.3, 2.6, 31, 52], mayor: [1.6, 2.7, 33.5, -.3, 2.6, 26.4, 44], dogs: [.2 + lt * .02, 1.4, 22.0, 0, 1.7, 33, 54], greg: [1.6, 2.2, 34.5, -.6, 1.95, 27, 42], dawn: [3.2, 3.6, 39 - lt * .5, -.5, .8, 30, 60] };
        const cb = cams[cam]; if (cam === 'greg') { const k = seg(lt, 7.0, 8.4); cb[0] = lerp(1.6, .5, k); cb[2] = lerp(34.5, 31.2, k); cb[4] = lerp(1.95, 2.45, k); cb[6] = lerp(42, 34, k); } B.cam(...cb); B.follow(cb[3], Math.min(cb[5], 33)); B.render();
      }
      // ---------------- C world (Derek)
      if (view === 'C') {
        const wake = seg(lt, 5.3, 5.7); const asleep = lt < 5.3;
        D.anim = 'sit'; D.x = 0; D.z = 3.5; D.y = .06; D.yaw = 0; D.hs = 1; D.vis = true; D.extra = (lt >= 5.3 && lt < 5.75) ? .6 * (1 - seg(lt, 5.3, 5.75)) : 0;
        D.arms = asleep ? { lx: -.3, lz: -.1, rx: -.3, rz: .05 } : (lt < 6.5 ? { lx: -2.6 + Math.sin(lt * 9) * .1, lz: -.2, rx: -2.6, rz: .2 } : { lx: -.4, lz: -.1, rx: -1.0 + Math.sin(lt * 6) * .18, rz: .5 - Math.sin(lt * 6) * .2 });
        bdC.crowd.setFace(asleep ? 'calm' : lt < 6.5 ? 'shock' : 'calm'); bdC.crowd.update(t); bdC.blanket.userData.update(t, .02, 0, 0);
        lidsD.upd(asleep); zD.put(D, t, asleep, 1.3); clockC.ck.set('3:58', 1);
        derekLabel.hide(); derekB.hide(); const hp = headPos(D, 0, .1, 0);
        if (lt >= 3.9 && lt < 6.0) derekLabel.put(.4, 3.6, 3.05, 3.4, lt - 3.9);
        if (lt >= 6.5) derekB.put(hp.x - .2, hp.y + .2, hp.z + .6, 2.4, lt - 6.5);
        C.cam(4.7, 2.3, 6.5, .15, 1.85, 3.9, 52); C.follow(0, 4); C.render();
      }
      // ---------------- HUD
      hud.style('C'); hud.question('What if your 2 AM thoughts played on the *town loudspeaker*?', 1, bi > 0);
      const note = (a, b) => (lt >= a ? b : '');
      let lab = '', val = '', nt = '', tag = '', hot = false;
      if (bi === 0) { if (lt >= 1.0) { lab = 'People who heard'; val = '0'; nt = 'loudspeaker: on'; tag = '2:00 AM'; } }
      else if (bi === 1) { lab = 'People who heard'; val = fmt(lerp(0, 4812, smooth(seg(lt, 5.0, 6.5)))); nt = lt >= 6.84 ? 'the mayor, twice' : lt >= 5 ? 'the whole town' : 'nobody yet'; tag = 'live on air'; hot = lt >= 6; }
      else if (bi === 2) { lab = 'People who heard'; val = fmt(lerp(4814, 11340, smooth(seg(lt, 3.9, 6.4)))); nt = lt >= 5.6 ? 'snacks: yes' : 'one more episode'; tag = 'live on air'; hot = lt >= 5; }
      else if (bi === 3) { lab = 'Dogs howling'; val = fmt(lerp(0, 312, smooth(seg(lt, 5.3, 7.4)))); nt = lt >= 5.3 ? 'every one of them' : 'quiet street'; tag = 'since 2014'; hot = lt >= 6.5; }
      else if (bi === 4) { lab = 'Violinists crying'; val = lt >= 7.5 ? '1' : '0'; nt = lt >= 7.5 ? 'Greg' : lt >= 5.8 ? 'he was off tonight' : 'the speaker plays'; tag = 'sad violin'; hot = lt >= 7.5; }
      else if (bi === 5) { lab = 'People who heard'; val = fmt(lerp(11340, 38206, smooth(seg(lt, 3.8, 5.2)))); nt = lt >= 6.54 ? 'Derek: unaffected' : lt >= 3.9 ? 'three towns over' : 'one more thought'; tag = 'live on air'; hot = lt >= 5; }
      else { lab = 'Time'; val = lt < 2.9 ? '7:30 AM' : '9:41 AM'; nt = 'town: asleep'; tag = 'you: asleep'; hot = false; }
      hud.counter(lab, val, nt, tag, hot); hud.tm(bi >= 1 && bi <= 5 ? 'TIME · ' + clk + ' AM' : '');
      const POP = ['', "DON'T.", "IT'S A PREMIERE", 'WHICH THING', 'GREG IS CRYING', "I'M GOOD, MAN", 'NOBODY TELLS HIM'][bi]; const PT = [0, 5.84, 6.38, 8.2, 7.52, 6.54, 4.26][bi];
      hud.pop(POP && lt >= PT ? POP : '', Math.min(1, (lt - PT) * 8));
    }
  };
}
