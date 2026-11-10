import { makeBubble } from './_drake.js';
// What if dating-app red flags were actual flags? One blocky guy per beat, a floating profile card, and the red flag becomes literally true.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, mat, Crowd, clamp, smooth, lerp, attach, tri } = lib;
  const st = makeStage({ shadowExtent: 34, fogNear: 110, fogFar: 460, sunDir: [-.5, .8, -.3], sunI: 2.8 }); const S = st.scene;
  const city = buildStreet(S, { seed: 7 }); city.cars.forEach((c) => (c.m.visible = false)); city.crowd.p.forEach((o) => (o.vis = false)); city.crowd.update(0);
  const CZ = 20;
  const crowd = new Crowd(S, 14, 21); const P = crowd.p;
  const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  const dress = (i, shirt, pants, skin, hair) => { ['torso', 'armL', 'armR'].forEach((k) => col(i, k, shirt)); ['legL', 'legR'].forEach((k) => col(i, k, pants)); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(i, k, skin)); col(i, 'hair', hair); };
  const SK = [0xe7b48f, 0xc98e63, 0x8d5a3b, 0xf0c7a4];
  const HC = [0x2a1d12, 0x4a2c18, 0x8a6a32, 0x15100c];
  const SH = [0x2f6fd8, 0xe3a21a, 0x2f8f6a, 0x8a6fd0, 0xe08a3c, 0x4aa0d8, 0xb04a6a, 0x5a6a7a, 0x3a9a9a, 0x9a5a3a];
  const GUY = 0, MOM = 1;
  for (let i = 0; i < 14; i++) dress(i, SH[i % 10], [0x2f3a52, 0x39404c, 0x4a4036][i % 3], SK[i % 4], HC[i % 4]);
  dress(MOM, 0xe85d8a, 0x5a4a6a, SK[3], 0xc8c8cc);
  P.forEach((o) => { o.h = 1; });
  const place = (i, x, z, yaw, anim = 'idle', o = {}) => { const p = P[i]; p.x = x; p.z = z; p.yaw = yaw; p.anim = anim; p.y = o.y || 0; p.speed = o.sp ?? 1; p.scale = o.sc ?? 1; p.vis = true; p.pitch = o.pitch || 0; p.arms = o.arms || null; p.extra = o.extra || 0; p.lie = o.lie || 0; };
  const mk = (geo, m, parent = S) => { const x = new THREE.Mesh(geo, m); x.castShadow = true; x.receiveShadow = true; x.visible = false; parent.add(x); return x; };
  const easeBack = (u) => { u = clamp(u); const c1 = 1.9; return 1 + (c1 + 1) * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };

  // ---- profile cards
  const mkCard = (name, bio, accent, shirt) => {
    const cv = document.createElement('canvas'); cv.width = 640; cv.height = 900; const g = cv.getContext('2d');
    g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 28; g.shadowOffsetY = 10; g.fillStyle = '#fbfbfd'; g.beginPath(); g.roundRect(40, 30, 560, 840, 54); g.fill(); g.shadowColor = 'transparent';
    g.save(); g.beginPath(); g.roundRect(40, 30, 560, 840, 54); g.clip(); const gr = g.createLinearGradient(0, 30, 640, 300); gr.addColorStop(0, accent); gr.addColorStop(1, '#ffffff'); g.fillStyle = gr; g.fillRect(40, 30, 560, 250); g.restore();
    g.fillStyle = '#' + new THREE.Color(shirt).getHexString(); g.beginPath(); g.roundRect(215, 205, 210, 130, [60, 60, 0, 0]); g.fill(); g.fillStyle = '#e9c3a2'; g.beginPath(); g.arc(320, 150, 70, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 10; g.beginPath(); g.arc(320, 150, 74, 0, 7); g.stroke();
    g.fillStyle = '#16181d'; g.font = '800 60px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText(name, 320, 400);
    g.fillStyle = '#d33a5a'; g.font = '700 26px Liberation Sans, Arial'; g.fillText('ABOUT ME', 320, 440);
    const txt = '“' + bio + '”'; let fs = 84; let lines; for (; fs >= 36; fs -= 4) { g.font = '900 italic ' + fs + 'px Liberation Sans, Arial'; const words = txt.split(' '); lines = []; let cur = ''; words.forEach((w) => { const t2 = cur ? cur + ' ' + w : w; if (g.measureText(t2).width > 500 && cur) { lines.push(cur); cur = w; } else cur = t2; }); lines.push(cur); if (lines.length <= 3 && lines.every((l) => g.measureText(l).width <= 510)) break; }
    g.fillStyle = '#16181d'; lines.forEach((l, k) => g.fillText(l, 320, 590 + k * (fs + 8) - (lines.length - 1) * (fs + 8) * .5 + fs * .3));
    g.fillStyle = '#ff3b6b'; g.beginPath(); g.arc(320, 790, 52, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(320, 818); g.bezierCurveTo(272, 786, 282, 750, 305, 754); g.bezierCurveTo(314, 756, 320, 764, 320, 768); g.bezierCurveTo(320, 764, 326, 756, 335, 754); g.bezierCurveTo(358, 750, 368, 786, 320, 818); g.fill();
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; const m = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.39), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })); m.visible = false; m.renderOrder = 5; S.add(m); return m;
  };
  const cards = [mkCard('Tyler, 29', 'Super chill', '#5b8cff', SH[0]), mkCard('Jake, 30', 'Totally over my ex', '#ff7ab0', SH[1]), mkCard('Ben, 28', 'Close with my family', '#ffc233', SH[2]), mkCard('Chase, 27', 'Always creating', '#4cd9a0', SH[3]), mkCard('Kyle, 31', 'Just a normal guy', '#9a8cff', SH[4])];
  const cardAt = (k, x, y, z, sc = 1, t = 0) => { const c = cards[k]; c.visible = true; c.position.set(x, y + Math.sin(t * 2.2 + k) * .05, z); c.scale.setScalar(sc * (1 + .025 * Math.sin(t * 5 + k))); c.quaternion.copy(st.camera.quaternion); };
  const mkSign = (w, h, cw, ch, draw, o = {}) => { const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const g = cv.getContext('2d'); draw(g, cw, ch); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: !!o.transparent, side: o.side || THREE.FrontSide })); m.visible = false; S.add(m); return { m, g, tex, cv }; };
  const bubbles = Array.from({ length: 4 }, () => makeBubble(lib, S, 1.3, .5));
  const bub = (k, text, x, y, z) => bubbles[k].show(text, x, y, z);

  // ---- red flags: pole + waving cloth, pool of 10
  const clothTex = (() => { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 164; const g = cv.getContext('2d'); g.fillStyle = '#e0211f'; g.fillRect(0, 0, 256, 164); g.fillStyle = '#b01412'; g.fillRect(0, 0, 256, 10); g.fillRect(0, 154, 256, 10); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(112, 28); g.lineTo(144, 28); g.lineTo(138, 100); g.lineTo(118, 100); g.fill(); g.beginPath(); g.arc(128, 128, 12, 0, 7); g.fill(); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const poleM = mat(0xe8e0d0, { roughness: .5, metalness: .3 }), goldM = new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: .8, roughness: .3 });
  const FL = Array.from({ length: 10 }, (_, k) => {
    const g = new THREE.Group(); const pole = new THREE.Mesh(new THREE.CylinderGeometry(.06, .07, 1, 8).translate(0, .5, 0), poleM); pole.castShadow = true; g.add(pole);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 8), goldM); g.add(ball);
    const geo = new THREE.PlaneGeometry(1.4, .9, 14, 6).translate(.7, 0, 0); const base = geo.attributes.position.array.slice();
    const cloth = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: clothTex, side: THREE.DoubleSide, roughness: .8, emissive: 0x330000 })); cloth.castShadow = true; g.add(cloth);
    g.visible = false; S.add(g); return { g, pole, ball, cloth, geo, base, ph: k * 1.7 };
  });
  const flag = (k, x, z, H, grow, t, dir = 1, cl = 1, o = {}) => {
    const f = FL[k]; if (grow < .01) { f.g.visible = false; return; } f.g.visible = true; f.g.position.set(x, o.y0 || 0, z); f.g.rotation.z = o.rz || 0;
    const h = H * grow; f.pole.scale.y = h; f.ball.position.y = h + .08; f.cloth.position.set(.04 * dir, h - .45 * cl * grow, 0); f.cloth.scale.set(dir * cl * Math.max(.05, grow), cl * grow, 1);
    const pa = f.geo.attributes.position.array; for (let i = 0; i < pa.length; i += 3) { const x0 = f.base[i], y0 = f.base[i + 1]; const u = x0 / 1.4; pa[i + 2] = Math.sin(x0 * 5 - t * 9 + f.ph) * .13 * u; pa[i + 1] = y0 + Math.sin(x0 * 4 - t * 7 + f.ph) * .045 * u - u * .05; } f.geo.attributes.position.needsUpdate = true; f.geo.computeVertexNormals();
  };
  const SLOT = [[1.4, CZ + 1.0, -1], [-1.55, CZ + 1.0, 1], [2.35, CZ + 2.4, -1], [-2.35, CZ + 2.4, 1], [0, CZ + 3.6, 1]];
  const slotFlag = (k, grow, t) => { const [x, z, d] = SLOT[k]; flag(k, x, z, k === 4 ? 6.6 : 5.8, grow, t, d, 1.1); };

  // ---- B1: calendar (flips 1 -> 2 -> 3)
  const cal = mkSign(1.5, 1.8, 450, 540, () => {}, { side: THREE.DoubleSide }); let calShown = -1;
  const drawCal = (d) => { const g = cal.g; g.fillStyle = '#fffdf6'; g.fillRect(0, 0, 450, 540); g.fillStyle = '#d83a3a'; g.fillRect(0, 0, 450, 110); g.fillStyle = '#fff'; g.font = '900 78px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('DAY', 225, 84); g.fillStyle = '#16181d'; g.font = '900 290px Liberation Sans, Arial'; g.fillText(String(d), 225, 400); g.fillStyle = '#777'; g.font = '800 46px Liberation Sans, Arial'; g.fillText('no reply yet', 225, 480); cal.tex.needsUpdate = true; };
  // phone (tiny, on the ground / in hand) with a canvas screen
  const mkPhone = (txt, bg) => { const g = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(.3, .55, .04), mat(0x15181f)); body.castShadow = true; g.add(body); const scr = mkSign(.26, .49, 208, 392, (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = '900 64px Liberation Sans, Arial'; c.textAlign = 'center'; const L = txt.split('\n'); L.forEach((l, i) => c.fillText(l, w / 2, h / 2 + (i - (L.length - 1) / 2) * 76 + 22)); }); S.remove(scr.m); scr.m.position.z = .022; scr.m.visible = true; g.add(scr.m); g.visible = false; S.add(g); return g; };
  const phone = mkPhone('MOM\n☎', '#2fa04a');
  // ---- B2: ex photo frame + heart
  const frame = new THREE.Group(); { const fr = new THREE.Mesh(new THREE.BoxGeometry(.8, .95, .05), goldM); fr.castShadow = true; frame.add(fr); const ph = mkSign(.66, .81, 264, 324, (g, w, h) => { g.fillStyle = '#ffd6e6'; g.fillRect(0, 0, w, h); g.fillStyle = '#7a3a66'; g.beginPath(); g.ellipse(132, 120, 82, 96, 0, 0, 7); g.fill(); g.fillStyle = '#f2c9a8'; g.beginPath(); g.ellipse(132, 140, 60, 70, 0, 0, 7); g.fill(); g.fillStyle = '#7a3a66'; g.beginPath(); g.ellipse(132, 88, 66, 36, 0, 0, 7); g.fill(); g.fillStyle = '#ff3b6b'; for (const x of [108, 156]) { g.beginPath(); g.moveTo(x, 150); g.bezierCurveTo(x - 20, 130, x - 8, 112, x, 126); g.bezierCurveTo(x + 8, 112, x + 20, 130, x, 150); g.fill(); } g.fillStyle = '#d33a5a'; g.beginPath(); g.arc(132, 188, 14, 0, Math.PI); g.fill(); g.fillStyle = '#fff'; g.font = '800 34px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('MY EX', 132, 300); }); S.remove(ph.m); ph.m.position.z = .03; ph.m.visible = true; frame.add(ph.m); frame.visible = false; S.add(frame); }
  const heartShape = new THREE.Shape(); heartShape.moveTo(0, -.5); heartShape.bezierCurveTo(-.8, .1, -.45, .75, 0, .35); heartShape.bezierCurveTo(.45, .75, .8, .1, 0, -.5);
  const heart = new THREE.Mesh(new THREE.ExtrudeGeometry(heartShape, { depth: .25, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 2 }), new THREE.MeshStandardMaterial({ color: 0xff2e63, roughness: .4, emissive: 0x550018 })); heart.castShadow = true; heart.visible = false; S.add(heart);
  // ---- B4: mic, headphones, episode stack, mic-topped flag
  const micG = new THREE.Group(); { const mm = mat(0x22252b, { metalness: .6, roughness: .35 }); const base = new THREE.Mesh(new THREE.CylinderGeometry(.22, .26, .05, 16), mm); base.position.y = .03; micG.add(base); const rod = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 1.5, 8), mm); rod.position.y = .8; micG.add(rod); const head = new THREE.Mesh(new THREE.SphereGeometry(.14, 14, 10), new THREE.MeshStandardMaterial({ color: 0x3a3f48, metalness: .5, roughness: .6 })); head.position.y = 1.62; head.scale.y = 1.25; micG.add(head); const ring = new THREE.Mesh(new THREE.TorusGeometry(.14, .02, 6, 16), mat(0xf2c230)); ring.position.y = 1.55; ring.rotation.x = Math.PI / 2; micG.add(ring); micG.visible = false; S.add(micG); }
  const micTop = new THREE.Group(); { const hd = new THREE.Mesh(new THREE.SphereGeometry(.3, 14, 10), new THREE.MeshStandardMaterial({ color: 0xaab0ba, metalness: .5, roughness: .4 })); hd.scale.y = 1.3; hd.position.y = .34; micTop.add(hd); const rg = new THREE.Mesh(new THREE.TorusGeometry(.3, .04, 6, 18), mat(0xf2c230)); rg.position.y = .18; rg.rotation.x = Math.PI / 2; micTop.add(rg); micTop.visible = false; S.add(micTop); }
  const hpG = new THREE.Group(); { const band = new THREE.Mesh(new THREE.TorusGeometry(.27, .03, 8, 20, Math.PI), mat(0x15181f)); band.position.y = .02; hpG.add(band); for (const sx of [-1, 1]) { const cup = new THREE.Mesh(new THREE.BoxGeometry(.1, .2, .2), mat(0xff3b3b)); cup.position.set(sx * .27, .0, 0); hpG.add(cup); } hpG.visible = false; S.add(hpG); }
  const epTex = (() => { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 64; const g = cv.getContext('2d'); g.fillStyle = '#ffd92a'; g.fillRect(0, 0, 256, 64); g.fillStyle = '#16181d'; g.fillRect(0, 0, 256, 6); g.fillRect(0, 58, 256, 6); g.font = '900 46px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('EP 1', 128, 48); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const eps = Array.from({ length: 7 }, (_, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(1.0, .17, .7), new THREE.MeshStandardMaterial({ map: epTex, roughness: .7 })); m.castShadow = true; m.visible = false; S.add(m); return m; });
  // ---- B5: confetti + banner
  const NC = 320; const conf = new THREE.InstancedMesh(new THREE.BoxGeometry(.26, .03, .17), new THREE.MeshBasicMaterial({ color: 0xffffff }), NC); conf.frustumCulled = false; conf.visible = false; S.add(conf);
  const CF = Array.from({ length: NC }, (_, i) => { const r = (a) => { const v = Math.sin(i * 12.9898 + a * 78.233) * 43758.5453; return v - Math.floor(v); }; return { x: -4 + r(1) * 8, z: 5 + r(2) * 22, y: 4 + r(3) * 8, ph: r(4) * 6.28, sp: 2.5 + r(5) * 3 }; });
  { const cc = [0xff3b6b, 0xffd92a, 0x4cd9a0, 0x5b8cff, 0xff9a3c, 0xffffff]; CF.forEach((c, i) => conf.setColorAt(i, new THREE.Color(cc[i % 6]))); conf.instanceColor.needsUpdate = true; }
  const banner = mkSign(7.5, 1.3, 960, 166, (g, w, h) => { g.fillStyle = '#ffd92a'; g.fillRect(0, 0, w, h); g.fillStyle = '#16181d'; g.fillRect(0, 0, w, 10); g.fillRect(0, h - 10, w, 10); g.font = '900 96px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('RED FLAG PARADE', w / 2, 118); });
  // ---- B6: giant phone with swipe
  const GPZ = CZ + 4; const gp = new THREE.Group(); S.add(gp); gp.visible = false;
  const gbody = new THREE.Mesh(new lib.RoundedBoxGeometry(3.3, 5.9, .3, 4, .22), mat(0x14161b, { roughness: .35, metalness: .4 })); gbody.castShadow = true; gp.add(gbody);
  const gscr = mkSign(3.0, 5.5, 450, 825, () => {}); gscr.m.material.color.setScalar(.72); S.remove(gscr.m); gscr.m.rotation.y = Math.PI; gscr.m.position.z = -.16; gscr.m.visible = true; gp.add(gscr.m);
  const cardPal = [['#5b8cff', 'Tyler, 29'], ['#ff7ab0', 'Jake, 30'], ['#ffc233', 'Ben, 28'], ['#4cd9a0', 'Chase, 27'], ['#9a8cff', 'Kyle, 31']];
  const drawScreen = (lt) => {
    const g = gscr.g; g.fillStyle = '#f4f5f8'; g.fillRect(0, 0, 450, 825); g.fillStyle = '#ff3b6b'; g.fillRect(0, 0, 450, 70); g.fillStyle = '#fff'; g.font = '900 40px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('swipr', 225, 50);
    g.fillStyle = '#9aa0ab'; g.font = '800 34px Liberation Sans, Arial'; g.fillText('no more profiles nearby', 225, 440); g.font = '800 30px Liberation Sans, Arial'; g.fillText('MATCHES: 0', 225, 490);
    for (let k = 4; k >= 0; k--) { const t0 = .32 + k * .08; const u = clamp((lt - t0) / .32); const e = u * u; const x = 225 - e * 640, rot = -e * .7, y = 400 + k * 6 * (1 - e); g.save(); g.translate(x, y); g.rotate(rot); g.shadowColor = 'rgba(0,0,0,.3)'; g.shadowBlur = 14; g.fillStyle = '#fff'; g.beginPath(); g.roundRect(-190, -300, 380, 560, 28); g.fill(); g.shadowColor = 'transparent'; g.fillStyle = cardPal[k][0]; g.beginPath(); g.roundRect(-190, -300, 380, 220, [28, 28, 0, 0]); g.fill(); g.fillStyle = '#e9c3a2'; g.beginPath(); g.arc(0, -150, 60, 0, 7); g.fill(); g.fillStyle = '#16181d'; g.font = '900 46px Liberation Sans, Arial'; g.fillText(cardPal[k][1], 0, -30); g.fillStyle = '#d33a5a'; g.font = '800 36px Liberation Sans, Arial'; g.fillText('⚑ red flags: ' + (k + 1) * 2, 0, 30); g.fillStyle = '#16181d'; g.font = '700 30px Liberation Sans, Arial'; g.fillText('swipe right?', 0, 150); if (u > .1) { g.strokeStyle = '#e02020'; g.lineWidth = 8; g.fillStyle = 'rgba(224,32,32,.9)'; g.font = '900 78px Liberation Sans, Arial'; g.save(); g.rotate(-.3); g.strokeText('NOPE', -10, -170); g.fillText('NOPE', -10, -170); g.restore(); } g.restore(); }
    gscr.tex.needsUpdate = true;
  };
  const thumb = new THREE.Group(); { const sk = mat(0xe7b48f, { roughness: .7 }); const th = new THREE.Mesh(new lib.RoundedBoxGeometry(1.0, 2.6, .9, 4, .42), sk); th.castShadow = true; th.rotation.x = .0; thumb.add(th); const nail = new THREE.Mesh(new lib.RoundedBoxGeometry(.5, .6, .06, 2, .02), mat(0xf6dcd0, { roughness: .4 })); nail.position.set(0, .7, -.42); thumb.add(nail); thumb.visible = false; S.add(thumb); }
  const weed = new THREE.Group(); { const wm = new THREE.MeshStandardMaterial({ color: 0x9a7a45, roughness: 1, wireframe: true }); const a = new THREE.Mesh(new THREE.IcosahedronGeometry(.55, 1), wm); const b = new THREE.Mesh(new THREE.IcosahedronGeometry(.4, 1), wm); b.rotation.set(1, 2, 0); const c = new THREE.Mesh(new THREE.IcosahedronGeometry(.28, 0), wm); weed.add(a, b, c); weed.visible = false; S.add(weed); }

  { const sty = document.createElement('style'); sty.textContent = '#val,#lab,#note,#tag{-webkit-text-stroke:2px #111;paint-order:stroke fill;text-shadow:0 2px 12px rgba(0,0,0,.9)} #val{-webkit-text-stroke:4px #111}'; document.head.appendChild(sty); }
  const POP = ['', '3 DAYS TO TEXT BACK', 'STILL LOVES HIS EX', 'CALLS MOM. TWICE.', 'HAS A PODCAST', '10 RED FLAGS', 'NOBODY SWIPES RIGHT'];
  const POPT = [0, .12, .12, .12, .12, .12, .15];
  const NOTE = ['', 'texts back in 3 days', 'still loves his ex', 'calls his mom daily. twice.', 'has a podcast', 'a parade', 'matches: 0'];
  const parade = [GUY, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const camLook = (cam) => { st.cam(...cam); st.follow(cam[3], cam[5]); };

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 6);
    P.forEach((o) => { o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; o.lie = 0; });
    cards.forEach((c) => (c.visible = false)); bubbles.forEach((b) => b.hide()); FL.forEach((f) => (f.g.visible = false));
    cal.m.visible = false; phone.visible = false; frame.visible = false; heart.visible = false; micG.visible = false; micTop.visible = false; hpG.visible = false; eps.forEach((m) => (m.visible = false)); conf.visible = false; banner.m.visible = false; gp.visible = false; thumb.visible = false; weed.visible = false;
    let cam = [0, 2.4, CZ - 7.4, 0, 2.8, CZ + 1, 56]; let n = 0; let hot = false; let note = NOTE[bi];
    const u7 = smooth(clamp(lt / 3));
    const both = { lx: -.9, rx: -.9 };
    if (bi === 0) {
      const xs = [-1.9, 0, 1.9], ids = [GUY, 2, 3], cs = [0, 3, 4];
      ids.forEach((id, k) => { place(id, xs[k], CZ, Math.PI, 'idle', { sc: .95 }); P[id].phase = k * 2; });
      ids.forEach((id, k) => cardAt(cs[k], xs[k], 3.45, CZ, .72, lt + k));
      ids.forEach((id, k) => { const g = easeBack((lt - 3.1 - k * .22) / .45); flag(k, xs[k] * 1.0, CZ + 1.4, k === 1 ? 6.9 : 5.6, g, t, k === 0 ? 1 : k === 2 ? -1 : 1, 1.1); });
      cam = [lerp(-.6, .6, u7), 2.4, CZ - 10.2 + u7 * 1.2, 0, 2.7, CZ + 1, 56];
      n = 0;
    } else if (bi === 1) {
      place(GUY, 0, CZ, -Math.PI / 2, 'idle', { sc: 1.0, lie: Math.PI / 2, y: .2, speed: .3 }); P[GUY].arms = { lx: .1, rx: .2, lz: .3, rz: -.3 };
      cardAt(0, .7, 3.35, CZ, .72, lt);
      bub(0, ['Z', 'ZZ', 'ZZZ'][Math.floor(lt * 3) % 3] + '...', 1.0, 1.7, CZ - .3);
      const day = lt < .5 ? 1 : lt < .95 ? 2 : 3; const tc = lt < .5 ? 0 : lt < .95 ? .5 : .95; const ph = clamp((lt - tc) / .22);
      if (!(ph < .5 && lt >= .5) || true) { const shown = (lt >= .5 && ph < .5) ? day - 1 : day; if (shown !== calShown) { calShown = shown; drawCal(shown); } }
      cal.m.visible = true; cal.m.position.set(-1.45, 1.4, CZ + .8); cal.m.quaternion.copy(st.camera.quaternion); cal.m.scale.set(1, lt >= .5 && ph < 1 ? Math.max(.05, Math.abs(Math.cos(ph * Math.PI))) : 1, 1);
      phone.visible = true; phone.position.set(1.0, .12, CZ - .8); phone.rotation.set(-Math.PI / 2, 0, .4);
      const g = easeBack((lt - 1.2) / .45); slotFlag(0, g, t); n = lt > 1.25 ? 1 : 0; hot = n > 0;
      cam = [lerp(.5, -.2, u7 * 2), 3.0, CZ - 6.4, 0, 2.3, CZ + .8, 56];
    } else if (bi === 2) {
      slotFlag(0, 1, t); const g = easeBack((lt - .55) / .4); slotFlag(1, g, t); n = lt > .6 ? 2 : 1; hot = true;
      place(GUY, 0, CZ, Math.PI, 'idle', { sc: 1.1, arms: { lx: -.9, rx: -.9, lz: -.1, rz: .1 } });
      frame.visible = true; attach(frame, P[GUY], 'handL', [.4, -.06, .12], [.9, 0, 0]);
      cardAt(1, 0, 3.55, CZ, .8, lt);
      const hp = easeBack((lt - .25) / .4); heart.visible = hp > .02; heart.position.set(SLOT[0][0], 2.4 + Math.sin(t * 6) * .05, SLOT[0][1] + .2); heart.rotation.set(0, Math.sin(t * 2) * .3, 0); heart.scale.setScalar(Math.max(.01, hp) * (1 + .08 * Math.sin(t * 9)) * 1.3);
      if (lt > .5) bub(0, 'I miss her', -1.1, 2.5, CZ - .6);
      cam = [lerp(.3, -.1, p), 2.3, CZ - 7.4, 0, 2.8, CZ + 1, 56];
    } else if (bi === 3) {
      slotFlag(0, 1, t); slotFlag(1, 1, t); const g = easeBack((lt - 1.1) / .45); slotFlag(2, g, t); n = lt > 1.15 ? 3 : 2; hot = true;
      place(GUY, 0, CZ, Math.PI, 'idle', { sc: 1.1, arms: { lx: .1, rx: -1.3, lz: .1, rz: 0 } });
      phone.visible = true; attach(phone, P[GUY], 'handR', [0, .22, .12], [1.3, 0, 0]);
      const ring = (lt > .2 && lt < 1.3) || (lt > 1.78 && lt < 2.7); const shake = ring ? Math.sin(t * 60) * .05 : 0; phone.matrix.multiply(new THREE.Matrix4().makeRotationZ(shake));
      cardAt(2, 0, 3.55, CZ, .8, lt);
      if (lt > .22 && lt < 1.3) bub(0, 'RING!', 1.15, 2.7, CZ - .6); if (lt > 1.8 && lt < 2.7) bub(0, 'RING! RING!', 1.3, 2.7, CZ - .6);
      const mx = tri(t * .9, -1.3, 1.3), dir = (((t * .9 + 1.3) % 5.2) + 5.2) % 5.2 < 2.6 ? 1 : -1;
      place(MOM, mx, CZ + 1.6, dir > 0 ? Math.PI / 2 : -Math.PI / 2, 'walk', { sc: .48, sp: 1.3 });
      if (lt > .3) bub(1, lt < 1.8 ? 'call me!' : 'CALL ME!!', -mx * .5 + (mx > 0 ? -.8 : .8), 1.45, CZ + 1.5);
      note = lt < 1.8 ? 'mom calls today: 1' : 'mom calls today: 2';
      cam = [lerp(-.2, .3, p), 2.3, CZ - 7.4, 0, 2.8, CZ + 1, 56];
    } else if (bi === 4) {
      slotFlag(0, 1, t); slotFlag(1, 1, t); slotFlag(2, 1, t);
      const g3 = easeBack((lt - .45) / .4), g4 = easeBack((lt - .75) / .4); slotFlag(3, g3, t);
      // mic-topped flag: mic sits on the ball of pole 3, second flag tops the episode stack
      micTop.visible = g3 > .02; micTop.position.set(SLOT[3][0], 5.8 * g3 + .12, SLOT[3][1]); micTop.scale.setScalar(Math.max(.01, g3));
      n = lt > .5 ? (lt > .8 ? 5 : 4) : 3; hot = true;
      place(GUY, 0, CZ, Math.PI, 'idle', { sc: 1.1, arms: { lx: -.3, rx: -.5, lz: .1, rz: -.1 }, extra: .02 });
      hpG.visible = true; attach(hpG, P[GUY], 'head', [0, .05, 0]);
      const mg = easeBack((lt - .12) / .35); micG.visible = true; micG.position.set(-.45, 0, CZ - .75); micG.scale.setScalar(Math.max(.01, mg)); micG.rotation.y = -.5;
      const ex0 = 1.35, ez0 = CZ - .5; let top = 0; eps.forEach((m, i) => { const q = easeBack((lt - .1 - i * .06) / .25); m.visible = q > .02; m.position.set(ex0 + (i % 2 ? .06 : -.05), .085 + i * .175, ez0); m.rotation.y = (i % 3 - 1) * .12; m.scale.setScalar(Math.max(.01, q)); if (q > .5) top = i + 1; });
      const stackTop = .17 * top + .06; const gf = easeBack((lt - .75) / .4); flag(4, ex0, ez0, 2.6 * gf + 0.001, gf > .02 ? 1 : 0, t, -1, .9, { y0: stackTop });
      cardAt(3, 0, 3.55, CZ, .8, lt);
      if (lt > .55) bub(0, 'SUBSCRIBE', -1.2, 3.0, CZ - 1.1);
      cam = [lerp(.3, -.1, p), 2.3, CZ - 7.4, 0, 2.8, CZ + 1, 56];
    } else if (bi === 5) {
      let cnt = 5; parade.forEach((id, k) => {
        const row = k >> 1, side = k & 1 ? 1 : -1; const tApp = k < 5 ? 0 : .25 + (k - 5) * .12; const vis = lt >= tApp; if (k >= 5 && vis) cnt = Math.max(cnt, 5 + k - 4);
        if (!vis) return; const pp = easeBack((lt - tApp) / .2); const z = 16.5 + row * 3.3 - 2.4 * lt; const x = side * 1.5 + side * (row % 2) * .5; const sc = 1.1 * Math.max(.1, pp);
        place(id, x, z, Math.PI, 'walk', { sc, sp: 1.0, arms: { lx: -.3, rx: -.45 } }); P[id].phase = k * .9;
        flag(k, x - .5 * sc, z - .35 * sc, 3.6, pp, t, side, 1.0, { y0: .75 * sc });
      });
      n = k10(cnt, lt);
      banner.m.visible = true; banner.m.position.set(0, 6.4, CZ + 6); banner.m.quaternion.setFromEuler(new THREE.Euler(0, Math.PI, 0));
      conf.visible = lt > 1.0; const tmx = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc3 = new THREE.Vector3(1, 1, 1), pos = new THREE.Vector3();
      CF.forEach((c, i) => { const fall = 3.2 + c.sp * .3; const y0 = 9 + c.y * .4 - (lt - 1.0) * fall; const y = Math.max(.03, y0); const sw = y0 > .03 ? Math.sin(t * 3 + c.ph) * .4 : 0; e.set(y0 > .03 ? t * c.sp + c.ph : 0, c.ph, y0 > .03 ? t * c.sp * .7 : 0); q.setFromEuler(e); pos.set(c.x + sw, y, c.z); tmx.compose(pos, q, sc3); conf.setMatrixAt(i, tmx); }); conf.instanceMatrix.needsUpdate = true;
      hot = true; cam = [lerp(-.4, .4, p), 2.7, 2.6, 0, 2.3, 22, 58];
    } else {
      gp.visible = true; gp.position.set(0, 3.3, GPZ); drawScreen(lt);
      for (let k = 0; k < 10; k++) { const side = k < 5 ? 1 : -1; const kk = k % 5; flag(k, side * (4.1 + (kk % 2) * .9), GPZ - 1.5 + kk * 1.8, 4.6, 1, t, -side, 1.0); }
      thumb.visible = lt < 1.2; const tu = clamp((lt - .12) / .75); const te = tu * tu * (3 - 2 * tu); thumb.position.set(lerp(-1.4, 1.6, te), lerp(2.6, 3.6, te) - .2 + (lt < .12 ? 1 - lt / .12 : 0) * -.5, GPZ - .7 - .15 * (1 - te)); thumb.rotation.set(0, 0, lerp(-.3, .5, te));
      weed.visible = lt > .9; { const wu = (lt - .9) / 1.2; weed.position.set(lerp(-5, 5, clamp(wu)), .62 + Math.abs(Math.sin(wu * 11)) * .45, CZ - 2); weed.rotation.z = -wu * 14; weed.rotation.y = wu * 3; }
      n = 10; hot = true; note = lt > .9 ? 'matches: 0' : 'swiping left on all 10';
      cam = [lerp(.4, -.2, p), 3.0, CZ - 5.6, 0, 3.1, GPZ, 56];
    }
    crowd.update(t);
    camLook(cam);
    cards.forEach((c) => { if (c.visible) c.quaternion.copy(st.camera.quaternion); });
    if (bi === 1) cal.m.quaternion.copy(st.camera.quaternion), cal.m.scale.set(1, lt >= .5 && clamp((lt - (lt < .95 ? .5 : .95)) / .22) < 1 ? Math.max(.05, Math.abs(Math.cos(clamp((lt - (lt < .95 ? .5 : .95)) / .22) * Math.PI))) : 1, 1);
    st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if dating app *red flags* were actual flags?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter('RED FLAGS', String(n), note, 'RED FLAGS COME TRUE', hot); hud.tm('');
    hud.pop(bi ? POP[bi] : '', Math.min(1, Math.max(0, (lt - POPT[bi]) * 8)));
  } };
}
const k10 = (c) => Math.min(10, c);
