import { makeBubble } from './_drake.js';
// Dating-app openers said out loud. One woman, identical "hey" guys, a street, one visual gag per beat.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, mat, Crowd, clamp, smooth, lerp, attach } = lib;
  const st = makeStage({ shadowExtent: 30, fogNear: 120, fogFar: 480, sunDir: [-.5, .8, -.3], sunI: 2.8 }); const S = st.scene;
  const city = buildStreet(S, { seed: 7 }); city.cars.forEach((c) => (c.m.visible = false)); city.crowd.p.forEach((o) => (o.vis = false)); city.crowd.update(0);
  const CZ = 20, NG = 130;
  const crowd = new Crowd(S, 4 + NG, 33); const P = crowd.p;
  const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  const dress = (i, shirt, pants, skin, hair) => { ['torso', 'armL', 'armR'].forEach((k) => col(i, k, shirt)); ['legL', 'legR'].forEach((k) => col(i, k, pants)); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(i, k, skin)); col(i, 'hair', hair); };
  const W = 0, GA = 1, GB = 2, GS = 3;
  dress(W, 0xff6fa0, 0x3a3f5a, 0xf0c7a4, 0x3a2412);
  for (let i = 1; i < 4 + NG; i++) dress(i, 0x2f6fd8, 0x39404c, 0xe7b48f, 0x2a1d12); // identical guys
  dress(GS, 0x17181c, 0x17181c, 0xe7b48f, 0x2a1d12);
  P.forEach((o) => { o.h = 1; });
  const place = (i, x, z, yaw, anim = 'idle', o = {}) => { const p = P[i]; p.x = x; p.z = z; p.yaw = yaw; p.anim = anim; p.y = o.y || 0; p.speed = o.sp ?? 1; p.scale = o.sc ?? 1; p.vis = true; p.pitch = o.pitch || 0; p.arms = o.arms || null; p.extra = o.extra || 0; };
  const face = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
  const easeBack = (u) => { u = clamp(u); const c1 = 1.9; return 1 + (c1 + 1) * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
  const mkSign = (w, h, cw, ch, draw, o = {}) => { const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const g = cv.getContext('2d'); draw(g, cw, ch); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide })); m.visible = false; m.renderOrder = o.ro || 5; S.add(m); return { m, g, tex }; };
  const bx = (w, h, d, c, parent = S) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)); m.castShadow = true; m.receiveShadow = true; m.visible = false; parent.add(m); return m; };

  // ---- HEY bubbles: one shared texture, 130 sprites
  const heyTex = (() => { const cv = document.createElement('canvas'); cv.width = 384; cv.height = 192; const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 12; g.beginPath(); g.roundRect(10, 10, 364, 130, 36); g.fill(); g.stroke(); g.beginPath(); g.moveTo(150, 138); g.lineTo(130, 184); g.lineTo(200, 138); g.fill(); g.fillStyle = '#111'; g.font = '900 104px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('HEY', 192, 112); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; })();
  const heyM = new THREE.SpriteMaterial({ map: heyTex, transparent: true, depthWrite: false });
  const heys = Array.from({ length: NG + 3 }, () => { const s = new THREE.Sprite(heyM); s.visible = false; s.renderOrder = 6; S.add(s); return s; });
  const hey = (k, x, y, z, sc) => { const s = heys[k]; s.visible = true; s.position.set(x, y, z); s.scale.set(2 * sc, sc, 1); };

  // ---- hearts + chat screen (beat 0)
  const hs = new THREE.Shape(); hs.moveTo(0, -.5); hs.bezierCurveTo(-.8, .1, -.45, .75, 0, .35); hs.bezierCurveTo(.45, .75, .8, .1, 0, -.5);
  const heartGeo = new THREE.ExtrudeGeometry(hs, { depth: .2, bevelEnabled: true, bevelSize: .05, bevelThickness: .05, bevelSegments: 2 });
  const hearts = Array.from({ length: 7 }, (_, k) => { const m = new THREE.Mesh(heartGeo, new THREE.MeshStandardMaterial({ color: 0xff3b6b, emissive: 0x551020, roughness: .4 })); m.visible = false; S.add(m); return m; });
  const chat = mkSign(2.0, 2.8, 500, 700, (g, w, h) => {
    g.fillStyle = '#16181d'; g.beginPath(); g.roundRect(0, 0, w, h, 50); g.fill(); g.fillStyle = '#fbfbfd'; g.beginPath(); g.roundRect(14, 14, w - 28, h - 28, 40); g.fill();
    g.fillStyle = '#ff3b6b'; g.fillRect(14, 14, w - 28, 90); g.fillStyle = '#fff'; g.font = '900 50px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('NEW MATCH ♥', w / 2, 76);
    g.fillStyle = '#e6e8ee'; g.beginPath(); g.roundRect(40, 180, 250, 130, 40); g.fill(); g.fillStyle = '#16181d'; g.font = '900 86px Liberation Sans, Arial'; g.textAlign = 'left'; g.fillText('hey', 78, 270);
    g.fillStyle = '#999'; g.font = '700 34px Liberation Sans, Arial'; g.fillText('Tyler • 2m ago', 44, 350);
    g.fillStyle = '#e6e8ee'; g.beginPath(); g.roundRect(40, 400, 250, 130, 40); g.fill(); g.fillStyle = '#16181d'; g.font = '900 86px Liberation Sans, Arial'; g.fillText('hey', 78, 490);
    g.fillStyle = '#e6e8ee'; g.beginPath(); g.roundRect(40, 560, 250, 90, 40); g.fill(); g.fillStyle = '#16181d'; g.fillText('hey', 78, 625);
  });
  const phoneG = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(.3, .55, .04), mat(0x15181f)); b.castShadow = true; phoneG.add(b); const sc = new THREE.Mesh(new THREE.PlaneGeometry(.26, .5), new THREE.MeshBasicMaterial({ color: 0xff6fa0 })); sc.position.z = .022; phoneG.add(sc); phoneG.visible = false; S.add(phoneG); }

  // ---- beat 4 props: suitcase, plane, passport
  const suitcase = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(.55, .75, .28), mat(0xd9482f)); b.castShadow = true; b.position.y = .45; suitcase.add(b); const h = new THREE.Mesh(new THREE.BoxGeometry(.3, .04, .04), mat(0x222222)); h.position.set(0, .88, 0); suitcase.add(h); suitcase.visible = false; S.add(suitcase); }
  const plane = new THREE.Group(); { const wm = mat(0xf2f4f8, { roughness: .5 }); const fus = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, 7, 16).rotateZ(Math.PI / 2), wm); fus.castShadow = true; plane.add(fus); const nose = new THREE.Mesh(new THREE.SphereGeometry(.55, 16, 12), wm); nose.position.x = 3.5; plane.add(nose); const wing = new THREE.Mesh(new THREE.BoxGeometry(1.6, .12, 8), wm); wing.position.set(.3, -.1, 0); wing.castShadow = true; plane.add(wing); const tail = new THREE.Mesh(new THREE.BoxGeometry(1, 1.6, .12), mat(0xd9482f)); tail.position.set(-3.2, .9, 0); plane.add(tail); const tw = new THREE.Mesh(new THREE.BoxGeometry(.9, .1, 2.8), wm); tw.position.set(-3.2, .3, 0); plane.add(tw); const st2 = new THREE.Mesh(new THREE.BoxGeometry(5, .12, .02), mat(0x2f6fd8)); st2.position.set(.2, .1, .56); plane.add(st2); plane.visible = false; S.add(plane); }
  const passport = mkSign(2.0, 2.6, 400, 520, (g, w, h) => { g.fillStyle = '#1d3a8a'; g.beginPath(); g.roundRect(0, 0, w, h, 24); g.fill(); g.fillStyle = '#f2c230'; g.font = '900 52px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('PASSPORT', w / 2, 120); g.beginPath(); g.arc(w / 2, 270, 70, 0, 7); g.lineWidth = 10; g.strokeStyle = '#f2c230'; g.stroke(); g.fillStyle = '#f2c230'; g.fillRect(w / 2 - 6, 200, 12, 140); g.fillRect(w / 2 - 70, 264, 140, 12); });
  const stamp = mkSign(2.6, 1.0, 520, 200, (g, w, h) => { g.strokeStyle = '#d6182a'; g.fillStyle = '#d6182a'; g.lineWidth = 14; g.beginPath(); g.roundRect(10, 10, w - 20, h - 20, 20); g.stroke(); g.font = '900 100px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('ABROAD', w / 2, 132); }, { ro: 7 });

  // ---- beat 5: arch, confetti, long bubble, bouquet
  const arch = new THREE.Group(); { const pm = mat(0xf4f0e6, { roughness: .6 }); [-1.6, 1.6].forEach((x) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, 3.6, 12), pm); p.position.set(x, 1.8, 0); p.castShadow = true; arch.add(p); }); const top = new THREE.Mesh(new THREE.TorusGeometry(1.6, .13, 10, 28, Math.PI), pm); top.position.y = 3.6; top.castShadow = true; arch.add(top); const fl = [0xff6fa0, 0xffd34a, 0xffffff, 0xff8a5a]; for (let i = 0; i < 26; i++) { const a = Math.PI * i / 25; const f = new THREE.Mesh(new THREE.SphereGeometry(.2, 8, 6), mat(fl[i % 4])); f.position.set(Math.cos(a) * 1.6, 3.6 + Math.sin(a) * 1.6, 0); arch.add(f); } for (const x of [-1.6, 1.6]) for (let k = 0; k < 6; k++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.19, 8, 6), mat(fl[k % 4])); f.position.set(x, .3 + k * .6, 0); arch.add(f); } arch.visible = false; S.add(arch); }
  const NC = 360; const conf = new THREE.InstancedMesh(new THREE.BoxGeometry(.16, .02, .1), new THREE.MeshBasicMaterial({ color: 0xffffff }), NC); conf.frustumCulled = false; conf.visible = false; S.add(conf);
  const cc = [0xff3b6b, 0xffd92a, 0x4cd9a0, 0x5b8cff, 0xffffff]; const CF = Array.from({ length: NC }, (_, i) => { const r = (a) => { const v = Math.sin(i * 12.9898 + a * 78.233) * 43758.5453; return v - Math.floor(v); }; conf.setColorAt(i, new THREE.Color(cc[i % 5])); return { x: -4 + r(1) * 8, z: CZ - 3 + r(2) * 8, y: 5 + r(3) * 7, ph: r(4) * 6.28, sp: 2 + r(5) * 3 }; });
  const longB = mkSign(3.9, 1.5, 1040, 400, (g, w, h) => { g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 14; g.beginPath(); g.roundRect(14, 14, w - 28, 290, 56); g.fill(); g.stroke(); g.beginPath(); g.moveTo(420, 300); g.lineTo(470, 385); g.lineTo(550, 300); g.fill(); g.fillStyle = '#111'; g.font = '900 100px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('your dog is so cute,', w / 2, 140); g.fillText('what’s his name?', w / 2, 255); });
  const dogP = mkSign(1.2, 1.2, 200, 200, (g) => { g.fillStyle = '#c9944f'; g.beginPath(); g.ellipse(100, 120, 60, 50, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(100, 70, 44, 40, 0, 0, 7); g.fill(); g.fillStyle = '#7a4a1f'; g.beginPath(); g.ellipse(60, 70, 14, 30, .3, 0, 7); g.ellipse(140, 70, 14, 30, -.3, 0, 7); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(85, 68, 6, 0, 7); g.arc(115, 68, 6, 0, 7); g.arc(100, 88, 9, 0, 7); g.fill(); });

  const POP = [[], [['SAYS "HEY"', .12]], [['ALSO "HEY"', .12]], [['1000 GUYS', .12], ['ALL "HEY"', 1.5]], [['PASSPORT STAMPED', .1]], [['ONE REAL SENTENCE', .15], ['MARRIED', 2.5]]];
  const NOTE = ['', 'her replies: 0', 'her replies: 0', 'her replies: 0', 'her replies: 0', 'her replies: 1'];
  const camLook = (cam) => { st.cam(...cam); st.follow(cam[3], cam[5]); };
  // crowd layout
  const CP = []; { let k = 0; for (let r = 0; r < 14; r++) for (let c = 0; c < 10; c++) { if (k >= NG - 1) break; const rj = Math.sin(k * 4.1) * .25, cj = Math.sin(k * 7.3) * .25; CP.push([-5.4 + c * 1.2 + (r % 2) * .6 + cj, CZ - 10 + r * 1.7 + rj, k]); k++; } }
  CP.sort((a, b) => Math.hypot(a[0] - 1.6, a[1] - CZ - 2) - Math.hypot(b[0] - 1.6, b[1] - CZ - 2));
  const WX = 1.7, WZ = CZ + 2.0;

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5);
    P.forEach((o) => { o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; });
    heys.forEach((h) => (h.visible = false)); hearts.forEach((h) => (h.visible = false)); chat.m.visible = phoneG.visible = suitcase.visible = plane.visible = passport.m.visible = stamp.m.visible = arch.visible = conf.visible = longB.m.visible = dogP.m.visible = false;
    let cam, n = 0, hot = false;
    const u = smooth(clamp(lt / tl.beats[bi].dur));
    const womanHold = (x, z, yaw) => { place(W, x, z, yaw, 'idle', { sc: 1.0, arms: { lx: .1, rx: -1.25, lz: .05, rz: 0 } }); phoneG.visible = true; attach(phoneG, P[W], 'handR', [0, .22, .12], [1.3, 0, 0]); };
    const heartsAround = (x, y, z, k0) => hearts.forEach((h, k) => { const ph = t * 1.6 + k * .9; const a = (ph % 3) / 3; h.visible = true; h.position.set(x + Math.sin(k * 2.1) * 1.1, y + a * 1.8, z + Math.cos(k * 1.7) * .4); h.rotation.set(0, Math.sin(t * 2 + k) * .5, 0); h.scale.setScalar(Math.max(.01, Math.sin(a * Math.PI)) * .4 * k0); });
    if (bi === 0) {
      womanHold(-.7, CZ, Math.PI); heartsAround(-.7, 2.2, CZ - .3, 1);
      const g = easeBack((lt - .5) / .5); chat.m.visible = true; chat.m.position.set(1.5, 2.9 + Math.sin(t * 2) * .05, CZ); chat.m.scale.setScalar(Math.max(.01, g) * .8); chat.m.quaternion.copy(st.camera.quaternion);
      cam = [lerp(-.6, .6, u), 2.0, CZ - 7.0 + u * .8, .8, 2.3, CZ, 56];
    } else if (bi <= 2) {
      const gx = -.5, gz = CZ + 1; womanHold(-2.0, CZ - 2.2, face(-2.0, CZ - 2.2, gx, gz));
      place(GA, gx, gz, Math.PI + .15, 'idle', { arms: { lx: .1, rx: .1 } });
      hey(0, gx, 3.2, gz, .95 * easeBack((lt - .12) / .3) + .001);
      if (bi === 2) { const bx2 = 1.7, bz2 = CZ + 1; place(GB, bx2, bz2, Math.PI - .15, 'idle', { arms: { lx: .1, rx: .1 } }); hey(1, bx2, 3.2, bz2, .95 * easeBack((lt - .12) / .3) + .001); }
      n = bi; hot = true;
      cam = [lerp(-.3, .3, u), 3.3, CZ - 9.0, .2, 2.0, CZ + 1, 56];
    } else if (bi === 3) {
      womanHold(WX, WZ, Math.PI);
      let cnt = 2; const total = Math.floor(lt * 60);
      CP.forEach((c, k) => { const tApp = 0.05 + k * .016; if (lt < tApp) return; const pp = easeBack((lt - tApp) / .2); cnt++; const sc = Math.max(.1, pp); place(4 + c[2], c[0], c[1], face(c[0], c[1], WX, WZ), 'idle', { sc }); P[4 + c[2]].phase = k * 1.7; hey(2 + k, c[0], 2.7 * sc, c[1], .95 * Math.max(.01, pp)); });
      place(GA, -.3, CZ - .2, face(-.3, CZ - .2, WX, WZ)); place(GB, -1.9, CZ - 1.5, face(-1.9, CZ - 1.5, WX, WZ)); hey(0, -.4, 3.1, CZ - .2, 1.2); hey(1, -2.0, 3.1, CZ - 1.5, 1.2);
      n = Math.min(1000, Math.round(2 + Math.pow(clamp(lt / 2.4), 1.6) * 998)); hot = true;
      cam = [lerp(-5, 5, u), lerp(19, 15, u), CZ - 17 + u * 2, 0, 0, CZ - 1, 60];
    } else if (bi === 4) {
      const x = lerp(-1.2, 1.6, u), z = CZ; place(W, x, z, Math.PI / 2, 'walk', { sp: 1.3, arms: { lx: -.2, rx: -.25 } });
      suitcase.visible = true; suitcase.position.set(x + .5, 0, z + .1); suitcase.rotation.y = Math.PI / 2;
      const pu = clamp((lt - .1) / 1.4); plane.visible = true; plane.position.set(lerp(-11, 11, pu), lerp(5.2, 8.5, pu * pu), CZ + 1); plane.scale.setScalar(.8); plane.rotation.set(0, 0, .14 + pu * .1);
      const g = easeBack((lt - .1) / .3); passport.m.visible = true; passport.m.position.set(-1.4, 3.6, CZ - 1); passport.m.scale.setScalar(Math.max(.01, g) * .75); passport.m.quaternion.copy(st.camera.quaternion);
      const sg = easeBack((lt - .55) / .2); stamp.m.visible = sg > .02; stamp.m.position.set(-1.4, 3.3, CZ - 1.4); stamp.m.scale.setScalar(Math.max(.01, 1.9 - 1.0 * Math.min(1, sg)) * .75);
      n = 1000; hot = true;
      cam = [0, 2.4, CZ - 7.0, 0, 3.0, CZ, 58];
    } else {
      arch.visible = true; arch.position.set(0, 0, CZ + 2.2);
      place(GS, -.75, CZ, Math.PI, 'idle', { arms: { lx: .1, rx: .1 } });
      place(W, .75, CZ, Math.PI, 'idle', { arms: { lx: .3, rx: .3 } }); P[W].phase = 2; col(W, 'torso', 0xffffff); col(W, 'armL', 0xffffff); col(W, 'armR', 0xffffff); col(W, 'legL', 0xffffff); col(W, 'legR', 0xffffff);
      const g = easeBack((lt - .1) / .5); longB.m.visible = true; longB.m.position.set(-.3, 3.5 + Math.sin(t * 2) * .04, CZ - .6); longB.m.scale.setScalar(Math.max(.01, g) * .82); longB.m.quaternion.copy(st.camera.quaternion);
      dogP.m.visible = lt > 1.0; dogP.m.position.set(-1.9, 1.0 + Math.sin(t * 3) * .05, CZ - .6); dogP.m.quaternion.copy(st.camera.quaternion);
      heartsAround(0, 2.3, CZ - .2, lt > 2.3 ? 1.4 : 0);
      const cw = lt - 2.4; conf.visible = cw > 0; const tmx = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s3 = new THREE.Vector3(1, 1, 1), pos = new THREE.Vector3();
      CF.forEach((c, i) => { const y0 = c.y - cw * (2.6 + c.sp * .3); const y = Math.max(.03, y0); e.set(y0 > .03 ? t * c.sp + c.ph : 0, c.ph, y0 > .03 ? t * c.sp * .7 : 0); q.setFromEuler(e); pos.set(c.x + (y0 > .03 ? Math.sin(t * 3 + c.ph) * .4 : 0), y, c.z); tmx.compose(pos, q, s3); conf.setMatrixAt(i, tmx); }); conf.instanceMatrix.needsUpdate = true;
      n = 1000; hot = lt > 2.4;
      cam = [lerp(-.5, .4, u), 2.1, CZ - 9.8, 0, 2.6, CZ + 1, 56];
    }
    crowd.update(t);
    camLook(cam);
    [chat.m, passport.m, longB.m, dogP.m].forEach((m) => m.quaternion.copy(st.camera.quaternion)); if (stamp.m.visible) { stamp.m.quaternion.copy(st.camera.quaternion); stamp.m.rotateZ(-.2); }
    st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if every dating app *opener* was said out loud?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter('HEYS', String(n), NOTE[bi], 'OPENERS OUT LOUD', hot); hud.tm('');
    { let pt = '', pa = 0; (POP[bi] || []).forEach(([tx, tt]) => { if (lt >= tt) { pt = tx; pa = Math.min(1, (lt - tt) * 8); } }); hud.pop(pt, pa); }
  } };
}
