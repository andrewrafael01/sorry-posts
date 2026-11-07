import { room } from './_rooms.js';
// What if Shrek became the mayor of Ohio? PARODY: generic green blocky ogre, no likeness. Interior = city hall, exterior = town.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, ground, tree, Crowd, Particles, clamp, smooth, lerp, attach, dropBounce } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ fog: 0xd8d2c4, fogNear: 16, fogFar: 50, clouds: false, skyTop: 0xd8d2c4, skyMid: 0xd8d2c4, skyBot: 0xd8d2c4, shadowExtent: 14, hemi: 1.5, sunI: 1.8, sunDir: [-.4, .9, -.3], exposure: 1.12 });
  const B = makeStage({ shadowExtent: 40, fogNear: 60, fogFar: 300, skyTop: 0x4a86c8, skyMid: 0x9cc4e6, skyBot: 0xe8f0f6, fog: 0xd7e6f0, sunDir: [-.5, .75, -.4], sunI: 2.8, clouds: true });
  const SA = A.scene, SB = B.scene; const GREEN = 0x7cb342;
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t, draw(...a) { f(g, w, h, ...a); t.needsUpdate = true; } }; };
  const plane = (S, w, h, tex, x, y, z, ry = 0, basic = false) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic ? new THREE.MeshBasicMaterial({ map: tex, transparent: true }) : new THREE.MeshStandardMaterial({ map: tex, roughness: .8 })); m.position.set(x, y, z); m.rotation.y = ry; S.add(m); return m; };
  const board = (S, w, h, x, y, z, bg, fg, txt, font) => { const cv = cvs(512, Math.round(512 * h / w), (g, W, H, tx) => { g.fillStyle = bg; g.fillRect(0, 0, W, H); g.fillStyle = fg; g.font = `800 ${font}px Liberation Sans, Arial`; g.textAlign = 'center'; const ls = String(tx).split('\n'); ls.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (ls.length - 1) / 2) * font * 1.1 + font * .35)); }); cv.draw(txt); const m = plane(S, w, h, cv.t, x, y, z, Math.PI); m.userData.cv = cv; return m; };
  const onionMesh = (r = .12) => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat(0xc9a05a)); b.scale.y = .88; g.add(b); const i = new THREE.Mesh(new THREE.SphereGeometry(r * .86, 12, 8), mat(0xe9c9d6, { roughness: .5 })); i.scale.set(1, .9, 1); i.position.y = r * .12; g.add(i); const s = new THREE.Mesh(new THREE.ConeGeometry(r * .3, r * .8, 6), mat(0x9bbf5a)); s.position.y = r * .95; g.add(s); g.traverse((m) => { if (m.isMesh) m.castShadow = true; }); return g; };
  const layerOnion = (S, R) => { const g = new THREE.Group(); const cols = [0xb48ad0, 0xd9b6e6, 0xefe0f2, 0xffffff]; const sh = cols.map((c, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(R * (1 - i * .22), 20, 14), new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: i === 3 ? .95 : .5, roughness: .3, depthWrite: i === 3 })); g.add(m); return m; }); const s = new THREE.Mesh(new THREE.ConeGeometry(R * .22, R * .7, 6), mat(0x9bbf5a)); s.position.y = R * 1.0; g.add(s); g.userData.sh = sh; g.visible = false; S.add(g); return g; };
  const bubbleMk = (S) => { const cv = cvs(320, 128, (g, w, h, t) => { g.clearRect(0, 0, w, h); g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 7; g.beginPath(); g.roundRect(6, 6, 308, 84, 22); g.fill(); g.stroke(); g.fillStyle = '#111'; g.font = '800 40px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText(t, 160, 62); }); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: cv.t, transparent: true, depthWrite: false })); sp.scale.set(1.2, .48, 1); sp.visible = false; S.add(sp); let cur = null; return { sp, set(t) { if (t !== cur) { cur = t; cv.draw(t); } } }; };
  const colorize = (crowd, i, o) => { for (const k in o) { const c = new THREE.Color(o[k]); k.split(',').forEach((p) => crowd.parts[p].setColorAt(i, c)); } for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true; };
  const ogre = (crowd, i, S) => { colorize(crowd, i, { torso: 0x6b4423, 'armL,armR': 0xcdb98c, 'legL,legR': 0x4a3a2a, 'head,neck,handL,handR,hair': GREEN }); const o = crowd.p[i]; o.h = 1; o.scale = 1.5; const earL = addBox(S, 0, 0, 0, .09, .16, .05, GREEN, { round: .02 }), earR = addBox(S, 0, 0, 0, .09, .16, .05, GREEN, { round: .02 }), nose = addBox(S, 0, 0, 0, .09, .07, .08, 0x6aa036, { round: .02 }); const sash = addBox(S, 0, 0, 0, .1, .9, .03, 0xd9b030, { mat: { metalness: .5, roughness: .4 } }), medal = addBox(S, 0, 0, 0, .09, .09, .03, 0xf2d56a, { mat: { metalness: .8, roughness: .25 } }); const hold = onionMesh(.1); S.add(hold); return { o, hold, upd() { attach(earL, o, 'head', [-.27, .02, 0], [0, 0, .5]); attach(earR, o, 'head', [.27, .02, 0], [0, 0, -.5]); attach(nose, o, 'head', [0, -.06, .24]); attach(sash, o, 'torso', [0, .02, .17], [0, 0, .78]); attach(medal, o, 'torso', [-.14, -.18, .18]); } }; };
  // ---------------- A: city hall interior
  room(lib, SA, { wall: 0xe4d8bc, floor: 0x9a7a52, w: 14, d: 13 });
  const crA = new Crowd(SA, 6, 61), PA = crA.p; const mayA = ogre(crA, 0, SA);
  colorize(crA, 1, { torso: 0x3a5a8a }); colorize(crA, 2, { torso: 0x8a3a4a }); colorize(crA, 3, { torso: 0x4a6a4a }); colorize(crA, 4, { torso: 0x6a5a8a });
  addBox(SA, 0, .5, 6.9, 1.2, 1.0, .75, 0x5a3b22, { round: .03 }); addBox(SA, 0, 1.03, 6.82, 1.3, .08, .9, 0x6b4a2c, { round: .02 }); addBox(SA, .3, 1.2, 6.8, .03, .3, .03, 0x333333); addBox(SA, .3, 1.36, 6.74, .04, .04, .14, 0x333333);
  for (const sx of [-1, 1]) { addBox(SA, sx * 2.5, .72, 4.5, 2.4, .08, .9, 0x8a6a42); addBox(SA, sx * 2.5, .38, 4.9, 2.4, .72, .06, 0x6e5232); addBox(SA, sx * 5.2, 1.9, 8.3, 1.5, 1.6, .06, 0x9fd0f2, { mat: { emissive: 0x6aa8d8, emissiveIntensity: .35 } }); }
  board(SA, 4, .8, 0, 3.0, 8.3, '#3a2a1a', '#f1e3b8', 'CITY HALL · OHIO', 44); const timer = board(SA, 1.7, .7, -2.6, 2.2, 8.3, '#111', '#ff5a4a', '', 52); const timerFn = (a, b) => { timer.userData.cv.draw(a + '\n' + b); };
  addBox(SA, 6.88, 1.25, 3.0, .1, 2.5, 1.4, 0x4a3320); addBox(SA, 6.82, 1.25, 3.55, .06, .12, .12, 0xd9b030);
  const desk = addBox(SA, 0, .72, 4.3, 2.6, .1, 1.1, 0x8a6a42); const desk2 = addBox(SA, 0, .36, 4.8, 2.5, .72, .06, 0x6e5232); desk.visible = desk2.visible = false;
  const posterCv = cvs(256, 256, (g) => { g.fillStyle = '#fff'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#c9a05a'; g.beginPath(); g.ellipse(128, 150, 70, 78, 0, 0, 7); g.fill(); g.strokeStyle = '#e8c9d6'; g.lineWidth = 6; for (let k = 1; k < 4; k++) { g.beginPath(); g.ellipse(128, 150, 70 - k * 17, 78, 0, 0, 7); g.stroke(); } g.fillStyle = '#9bbf5a'; g.fillRect(122, 40, 12, 40); g.strokeStyle = '#d62828'; g.lineWidth = 22; g.beginPath(); g.moveTo(30, 30); g.lineTo(226, 226); g.moveTo(226, 30); g.lineTo(30, 226); g.stroke(); }); posterCv.draw(); const poster = plane(SA, 1.1, 1.1, posterCv.t, 0, .55, 6.5, Math.PI);
  const bigOn = layerOnion(SA, .55); const councilOn = [1, 2, 3, 4].map(() => { const g = onionMesh(.1); SA.add(g); return g; });
  const donkeyG = new THREE.Group(); SA.add(donkeyG); { const gr = 0x8c8c94, dk = 0x55555c, lt = 0xd8d4cc; const bx = (w, h, d, x, y, z, c) => { const m = addBox(SA, x, y, z, w, h, d, c, { round: .02 }); SA.remove(m); donkeyG.add(m); return m; }; bx(.5, .46, .85, 0, .62, 0, gr); bx(.3, .3, .34, 0, .98, -.5, gr).rotation.x = .3; bx(.22, .16, .2, 0, .86, -.72, lt); bx(.05, .05, .02, -.08, 1.03, -.68, 0x111111); bx(.05, .05, .02, .08, 1.03, -.68, 0x111111); bx(.1, .4, .05, -.1, 1.3, -.42, gr).rotation.z = .25; bx(.1, .4, .05, .1, 1.3, -.42, gr).rotation.z = -.25; bx(.06, .3, .03, -.1, 1.3, -.4, 0xe8a0a8).rotation.z = .25; bx(.06, .3, .03, .1, 1.3, -.4, 0xe8a0a8).rotation.z = -.25; bx(.08, .1, .5, 0, 1.12, -.2, dk); bx(.08, .08, .3, 0, .62, .52, dk).rotation.x = .5; bx(.08, .26, .03, 0, .64, -.44, 0xd62828); }
  const legsD = []; for (const [x, z] of [[-.17, -.3], [.17, -.3], [-.17, .3], [.17, .3]]) { const l = addBox(SA, 0, 0, 0, .12, .4, .12, 0x6a6a72); SA.remove(l); const pv = new THREE.Group(); pv.position.set(x, .4, z); l.position.y = -.2; pv.add(l); donkeyG.add(pv); legsD.push(pv); }
  donkeyG.position.set(1.0, .76, 1.7); donkeyG.rotation.y = -.2; donkeyG.scale.setScalar(1.15); donkeyG.visible = false;
  const dDesk = new THREE.Group(); SA.add(dDesk); for (const m of [addBox(SA, 1.0, .7, 1.7, 1.6, .08, 1.0, 0x8a6a42), addBox(SA, 1.0, .35, 1.7, 1.5, .7, .9, 0x6e5232)]) { SA.remove(m); dDesk.add(m); } dDesk.visible = false;
  const scrCv = cvs(256, 160, (g, w, h, a, b) => { g.fillStyle = '#12202e'; g.fillRect(0, 0, w, h); g.fillStyle = '#7fe8a8'; g.font = '700 26px monospace'; g.textAlign = 'left'; g.fillText('SENT: ' + a, 10, 40); g.fillStyle = '#ffffff'; g.font = '700 22px monospace'; g.fillText('SUBJECT:', 10, 80); g.fillText(b, 10, 112); }); const scr = plane(SA, .8, .5, scrCv.t, .45, 1.22, 1.78, Math.PI, true); const lap = addBox(SA, .45, .84, 1.76, .84, .04, .6, 0x333333); const lapBack = addBox(SA, .45, 1.1, 2.02, .84, .56, .04, 0x2a2a2a); lap.visible = lapBack.visible = scr.visible = false;
  const stackD = addBox(SA, 1.7, .8, 1.7, .5, .1, .4, 0xf6f6f0); stackD.visible = false;
  const envCv = cvs(128, 90, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d33'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); g.beginPath(); g.moveTo(3, 3); g.lineTo(w / 2, h * .6); g.lineTo(w - 3, 3); g.stroke(); }); envCv.draw();
  const ENV = 100; const envs = new THREE.InstancedMesh(new THREE.PlaneGeometry(.42, .3), new THREE.MeshBasicMaterial({ map: envCv.t, side: THREE.DoubleSide }), ENV); envs.frustumCulled = false; SA.add(envs); const eM = new THREE.Matrix4(), eP = new THREE.Vector3(), eS = new THREE.Vector3();
  const bubD = bubbleMk(SA), bubM = bubbleMk(SA);
  const sheets = []; for (let k = 0; k < 14; k++) { const s = addBox(SA, 0, 0, 0, 1.0, .11, .75, k % 2 ? 0xf6f6f0 : 0xeaeadf); s.visible = false; sheets.push(s); }
  const polCv = cvs(256, 300, (g, w, h) => { g.fillStyle = '#f6f6f0'; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; g.font = '800 34px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('PARKING', w / 2, 100); g.fillText('POLICY', w / 2, 146); g.font = '700 28px Liberation Sans'; g.fillText('14 PAGES', w / 2, 210); }); polCv.draw(); const polTop = plane(SA, .9, .75, polCv.t, 0, 0, 0); polTop.rotation.x = -Math.PI / 2; polTop.visible = false;
  addBox(SA, 5.6, 2.6, 8.25, 1.4, .7, .06, 0x7a5230); const swCv = cvs(256, 128, (g, w, h) => { g.fillStyle = '#7a5230'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8e87a'; g.font = '800 54px Liberation Sans'; g.textAlign = 'center'; g.fillText('SWAMP', w / 2, 82); }); swCv.draw(); plane(SA, 1.3, .62, swCv.t, 5.6, 2.6, 8.2, Math.PI);
  // ---------------- B: exterior
  ground(SB, 0x74b04e, 1400);
  addBox(SB, 0, 3.5, 26, 16, 7, 8, 0xb5533c); addBox(SB, 0, 7.4, 26, 17, .8, 9, 0xf2eee6); const ped = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-8.5, 0), new THREE.Vector2(8.5, 0), new THREE.Vector2(0, 3)]), { depth: 1, bevelEnabled: false }), mat(0xf2eee6)); ped.position.set(0, 7.8, 21.4); ped.castShadow = true; SB.add(ped); addBox(SB, 0, 11.6, 26, 3.4, 5, 3.4, 0xd9d2c4); addBox(SB, 0, 14.6, 26, 4, 1, 4, 0x4a5a6a); addBox(SB, 0, 11.8, 24.25, 2.2, 2.2, .1, 0xffffff, { round: .5 });
  for (let i = -3; i <= 3; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, 5.6, 14), mat(0xf2eee6)); c.position.set(i * 2.1, 3.1, 21.6); c.castShadow = true; SB.add(c); }
  for (let i = 0; i < 4; i++) addBox(SB, 0, .15 + i * .3, 20.6 - i * .6, 14 - i * 1.0, .3, 1.2, 0xcfcac0, { cast: false }); addBox(SB, 0, 2.2, 22.05, 2.4, 3.6, .2, 0x4a3320);
  board(SB, 8, 1.4, 0, 6.6, 21.3, '#f2eee6', '#3a2a1a', 'CITY HALL', 90);
  addBox(SB, 0, 0.02, 8, 5, .04, 40, 0xc9c4b8, { cast: false }); for (const [x, z, s] of [[-14, 14, 1.4], [14, 12, 1.3], [-20, 26, 1.5], [20, 28, 1.5], [-12, 40, 1.4], [12, 42, 1.6], [26, 6, 1.2], [-26, 4, 1.2]]) tree(SB, x, z, s, (x * 7 + z) | 0);
  addBox(SB, 8.2, 5, 8, .1, 10, .1, 0xdddddd); addBox(SB, 6.9, 8.8, 8, 2.6, 1.5, .05, 0x2a4a9a);
  const mud = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .06, 40), mat(0x4a5a2a, { roughness: 1 })); mud.position.set(-1.5, .03, 10); mud.receiveShadow = true; SB.add(mud); const pud = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .09, 40), new THREE.MeshStandardMaterial({ color: 0x5d9a2a, roughness: .2, metalness: .1, emissive: 0x1a3a08 })); pud.position.set(-1.5, .05, 10); pud.receiveShadow = true; SB.add(pud);
  const reeds = []; for (let i = 0; i < 16; i++) { const a = i * 2.4, rr = .85 + (i % 3) * .08; const r = addBox(SB, 0, .6, 0, .06, 1.1 + (i % 4) * .2, .06, 0x6a8a2a); reeds.push([r, a, rr]); }
  const parkBits = [addBox(SB, 3.2, .5, 7.2, 2.0, .12, .5, 0x8a5a30), addBox(SB, 3.2, .9, 7.4, 2.0, .5, .08, 0x8a5a30), addBox(SB, 5, 2, 10.5, .12, 4, .12, 0x333333), addBox(SB, 5, 4.1, 10.5, .5, .4, .5, 0xffe9a8, { mat: { emissive: 0xffe9a8, emissiveIntensity: .6 } })];
  const houses = []; const houseCvs = []; for (const [x, z] of [[-8, 7], [-8, 13.5]]) { const g = new THREE.Group(); const b = addBox(SB, 0, 1.2, 0, 3.4, 2.4, 3.2, 0xe8d8b0); SB.remove(b); const r = new THREE.Mesh(new THREE.ConeGeometry(3, 1.8, 4), mat(0x8a3a2a)); r.rotation.y = Math.PI / 4; r.position.y = 3.3; r.castShadow = true; const d = addBox(SB, 0, .8, -1.62, .7, 1.6, .06, 0x6a3a22); SB.remove(d); g.add(b, r, d); g.position.set(x, 0, z); SB.add(g); const ph = cvs(256, 128, (gg, w, h, txt) => { gg.fillStyle = '#fff'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#c0392b'; gg.font = '800 34px Liberation Sans'; gg.textAlign = 'center'; gg.fillText('FOR SALE', w / 2, 44); gg.fillStyle = '#111'; gg.font = '800 56px Liberation Sans'; gg.fillText(txt, w / 2, 106); }); ph.draw('$400K'); plane(SB, 1.6, .8, ph.t, x + 3.0, 1.6, z - 1.8, Math.PI); addBox(SB, x + 3.0, .7, z - 1.75, .08, 1.4, .08, 0x6a4a2a); houses.push(g); houseCvs.push(ph); }
  const stageB = [addBox(SB, 0, .3, 6, 9, .6, 4, 0x9a7a52, { round: .02 }), addBox(SB, -2.4, 1.1, 6.8, 1.2, 1.0, .8, 0x5a3b22), addBox(SB, 2.4, 1.1, 6.8, 1.2, 1.0, .8, 0x5a3b22), board(SB, 7, 1.2, 0, 9.5, 8.2, '#c8272d', '#fff', 'OHIO MAYOR RACE', 52)]; stageB.forEach((m) => (m.visible = false));
  const tallyCv = cvs(512, 512, (g, w, h, a, b, ta, tb) => { g.fillStyle = '#16202c'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '800 48px Liberation Sans'; g.textAlign = 'center'; g.fillText('RESULTS', w / 2, 64); g.fillStyle = '#2f3b4a'; g.fillRect(30, 130, 452, 100); g.fillRect(30, 300, 452, 100); g.fillStyle = '#7cd14a'; g.fillRect(30, 130, 452 * a, 100); g.fillStyle = '#e0a030'; g.fillRect(30, 300, 452 * b, 100); g.fillStyle = '#fff'; g.font = '700 34px Liberation Sans'; g.textAlign = 'left'; g.fillText('MAYOR ' + ta, 40, 118); g.fillText('RIVAL ' + tb, 40, 288); }); tallyCv.draw(0, 0, '', ''); const tallyB = [plane(SB, 3.4, 3.4, tallyCv.t, -6.0, 3, 5, Math.PI), addBox(SB, -7.2, 1.4, 5.1, .1, 2.8, .1, 0x333333), addBox(SB, -4.8, 1.4, 5.1, .1, 2.8, .1, 0x333333)]; tallyB.forEach((m) => (m.visible = false));
  const townCv = cvs(768, 320, (g, w, h, l1, l2, pr, pr2, base) => { g.fillStyle = '#2a5fa8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 10; g.strokeRect(10, 10, w - 20, h - 20); g.textAlign = 'center'; if (pr < .02) { g.font = '800 54px Liberation Sans'; g.fillStyle = '#fff'; g.fillText(base[0], w / 2, 130); g.font = '800 70px Liberation Sans'; g.fillText(base[1], w / 2, 240); return; } g.fillStyle = '#fff'; g.save(); g.beginPath(); g.rect(0, 0, w * pr, 140); g.rect(0, 140, w * pr2, 180); g.clip(); g.font = '800 62px Liberation Sans'; g.fillStyle = '#fff'; g.fillText(l1, w / 2, 125); g.fillStyle = '#ffd93a'; g.font = '800 46px Liberation Sans'; g.fillText(l2, w / 2, 235); g.restore(); }); const townB = [plane(SB, 6.4, 2.7, townCv.t, .8, 4, 9, Math.PI), addBox(SB, -2.1, 1.2, 9.1, .2, 2.6, .2, 0x4a3320), addBox(SB, 3.7, 1.2, 9.1, .2, 2.6, .2, 0x4a3320)]; townB.forEach((m) => (m.visible = false));
  const crB = new Crowd(SB, 22, 77), PB = crB.p; const mayB = ogre(crB, 0, SB); const rival = PB[5]; colorize(crB, 5, { 'torso,armL,armR': 0x3a3a44, 'legL,legR': 0x2a2a30, 'head,neck,handL,handR': 0xe6c3a0, hair: 0x1b1511 }); rival.h = 1; rival.scale = 2.1; const bowl = addBox(SB, 0, 0, 0, .5, .2, .52, 0x1b1511, { round: .04 }), fringe = addBox(SB, 0, 0, 0, .5, .08, .06, 0x1b1511);
  const swampSignB = new THREE.Group(); { const p = addBox(SB, 0, 0, 0, .06, 1.5, .06, 0x6a4a2a); SB.remove(p); p.position.y = -.35; swampSignB.add(p); } const bSign = board(SB, 1.5, .8, 0, 0, 0, '#7a5230', '#c8e87a', 'SWAMP', 100); SB.remove(bSign); swampSignB.add(bSign); bSign.position.set(0, .3, 0); bSign.rotation.y = 0; swampSignB.scale.setScalar(.6); SB.add(swampSignB); swampSignB.visible = false;
  const brush = addBox(SB, 0, 0, 0, .1, .1, .5, 0xd9b030); brush.visible = false; const phones = [1, 2, 3].map(() => { const m = addBox(SB, 0, 0, 0, .12, .02, .2, 0x111111); m.visible = false; return m; });
  const bigOnB = onionMesh(.16); SB.add(bigOnB); bigOnB.visible = false; const altar = addBox(SB, 0, .6, 17.2, 1.0, 1.2, .8, 0x777777); altar.visible = false;
  const bubB = [0, 1, 2, 3, 4, 5].map(() => bubbleMk(SB)); const conf = new Particles(SB, 150, 0x7cd14a, .09, { emissive: 0x204010 });
  const camPush = (a, b, p) => a.map((v, i) => lerp(v, b[i], smooth(p)));
  const popA = [[], [[1.5, 'NO ONIONS'], [5.1, 'LAYERS']], [[5.6, 'NOBODY NOTICES']], [[3.6, '4,000 EMAILS'], [7.0, 'ARE WE THERE YET']], [[7.4, "IT'S OHIO"]], [[4.3, 'GET OUT']], [[3.9, 'PARKING POLICY']]];
  const stageOf = [B, A, B, A, B, B, A];
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 6); const ST = stageOf[bi]; const crowd = ST === A ? crA : crB; const P = crowd.p; const may = ST === A ? mayA : mayB; const mo = may.o;
    for (const o of P) { o.vis = false; o.arms = null; o.extra = 0; o.pitch = 0; o.y = 0; o.scale = o === mo ? 1.5 : o === rival ? 2.1 : 1.2; o.h = (o === mo || o === rival) ? 1 : o.h; }
    mayA.hold.visible = mayB.hold.visible = false; mayA.hold.matrixAutoUpdate = true;
    for (const m of [bubM.sp, bubD.sp, ...bubB.map((b) => b.sp)]) m.visible = false;
    let counter = ['', '', '', '', false], cam = null, face = 'calm';
    const seat = (o, x, z, yaw = Math.PI) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = 'sit'; o.y = .72 - .68 * 1.2 + .02; o.speed = .4; o.vis = true; o.scale = 1.2; o.arms = { lx: -.4, lz: -.1, rx: -.4, rz: .1 }; };
    const stand = (o, x, z, yaw, anim = 'idle') => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = .5; o.vis = true; };
    const hideA = () => { bigOn.visible = false; poster.visible = false; donkeyG.visible = dDesk.visible = false; envs.visible = false; scr.visible = lap.visible = lapBack.visible = stackD.visible = false; sheets.forEach((s) => (s.visible = false)); polTop.visible = false; councilOn.forEach((g) => (g.visible = false)); desk.visible = desk2.visible = false; };
    if (ST === A) hideA();
    const hideB = () => { stageB.forEach((m) => (m.visible = false)); tallyB.forEach((m) => (m.visible = false)); townB.forEach((m) => (m.visible = false)); swampSignB.visible = false; altar.visible = false; bigOnB.visible = false; brush.visible = false; phones.forEach((m) => (m.visible = false)); parkBits.forEach((m) => (m.visible = false)); bowl.visible = fringe.visible = false; };
    if (ST === B) hideB();
    // ============ BEAT 0 (B): swearing in on the steps
    if (bi === 0) {
      stand(mo, 0, 15.0, Math.PI); mo.y = .0; mo.arms = { lx: -1.1, lz: .1, rx: -2.8 + Math.sin(t * 6) * .04, rz: -.1 }; altar.visible = true; altar.position.set(1.3, .6, 14.6); bigOnB.visible = true; bigOnB.position.set(1.3, 1.35, 14.6); bigOnB.scale.setScalar(1.6);
      [1, 2, 3].forEach((k, i) => { stand(P[k], [-3.6, 3.6, -5.6][i], 14.0 + i % 2, Math.PI, 'idle'); P[k].arms = { lx: -.4, lz: -.1, rx: -.4, rz: .1 }; });
      crB.update(t); mayB.upd();
      cam = camPush([-1.0, 2.0, 6.5, 0, 2.4, 15, 60], [.3, 2.2, 8.5, 0, 2.5, 15, 56], p);
    }
    // ============ BEAT 1 (A): onions banned from city hall
    if (bi === 1) {
      const U = lt; const resign = U > 6.1;
      PA.forEach((o, i) => { if (i >= 1 && i <= 4) seat(o, (i < 3 ? 1 : -1) * (i % 2 ? 1.9 : 3.1), 5.4); });
      mo.vis = true; mo.z = 7.4; mo.x = 0; mo.yaw = Math.PI; mo.anim = 'idle'; mo.speed = .5;
      const holding = U < 1.1;
      mo.arms = { lx: -.5, lz: -.1, rx: holding ? -1.3 + Math.sin(t * 3) * .05 : -.6, rz: .1 };
      if (U > 1.1 && U < 1.7) mo.arms = { lx: -.5, lz: -.1, rx: -1.1 - Math.sin((U - 1.1) / .6 * Math.PI) * 1.3, rz: .1 };
      let freeOnion = false; const dropU = U - 1.1;
      if (U >= 1.1 && U < 3.3) { freeOnion = true; const db = dropBounce(1.9, 1.2, Math.max(0, dropU)); mayA.hold.visible = true; mayA.hold.position.set(.15, db.y + .12, 6.1 - Math.min(dropU, .8) * .4); mayA.hold.scale.setScalar(1.5); mayA.hold.rotation.set(0, 0, 0); mayA.hold.updateMatrix(); }
      if (U >= 1.1) { poster.visible = true; const ps = smooth((U - 1.4) / .35); poster.scale.setScalar(Math.max(.01, ps * (1 + .08 * Math.sin(U * 12) * (1 - ps)))); }
      councilOn.forEach((g, i) => { g.visible = U > 3.3 + i * .25; });
      if (U > 3.3) [1, 2, 3, 4].forEach((i) => { const o = PA[i]; const lv = smooth((U - 3.3 - (i - 1) * .25) / .35); o.arms = { lx: -.4, lz: -.1, rx: lerp(-.4, -2.5 + Math.sin(t * 5 + i) * .15, lv), rz: .1 }; });
      const bigP = clamp((U - 5.0) / .4); const bigOut = clamp((U - 6.4) / .6);
      face = U > 5.0 && U < 7 ? 'shock' : 'calm';
      if (U > 5.0 && U < 6.1) { mo.pitch = -.22; mo.arms = { lx: -1.0, lz: -.5, rx: -1.0, rz: .5 }; }
      if (resign) { const wt = U - 6.1; const ph = clamp(wt / 1.4); const back = U > 7.5; mo.vis = true; if (!back) { mo.x = lerp(0, 6.4, ph); mo.z = lerp(7.4, 3.2, ph); mo.yaw = Math.PI / 2 + .2; mo.anim = 'walk'; mo.speed = .9; mo.arms = null; mo.vis = ph < .97; } else { const bt = clamp((U - 7.5) / .75); mo.x = lerp(6.4, 1.6, bt); mo.z = lerp(3.2, 7.4, bt); mo.yaw = -Math.PI / 2 - .2; mo.anim = 'walk'; mo.speed = .9; mo.arms = null; } }
      const tsec = U < 6.1 ? 0 : Math.min(240, (U - 6.1) / 1.4 * 240); const mm = Math.floor(tsec / 60), ss = Math.floor(tsec % 60); timerFn(U < 6.1 ? 'MAYOR' : (tsec >= 240 ? 'BACK' : 'RESIGNED'), U < 6.1 ? 'IN OFFICE' : mm + ':' + String(ss).padStart(2, '0'));
      crA.setFace(face); crA.update(t); mayA.upd();
      if (!freeOnion && holding) attach(mayA.hold, mo, 'handR', [0, -.06, .1]);
      councilOn.forEach((g, i) => attach(g, PA[1 + i], 'handR', [0, -.06, .08]));
      bigOn.visible = bigP > 0 && bigOut < 1; if (bigOn.visible) { const sc = smooth(bigP) * (1 - bigOut); bigOn.position.set(0, 2.3 + Math.sin(t * 2) * .05, 3.2); bigOn.scale.setScalar(Math.max(.01, sc)); bigOn.rotation.y = t * .6; bigOn.userData.sh.forEach((s, i) => { const k = smooth((U - 5.1 - i * .12) / .5); s.scale.setScalar(1 + k * (.15 + i * .1)); s.position.y = (i - 1.5) * .1 * k; }); }
      cam = camPush([0, 2.3, -2.6, 0, 2.0, 6.0, 62], [.1, 2.3, -1.8, 0, 2.0, 6.0, 56], p);
      counter = ['Onions banned', U < 1.5 ? '0' : '1', U < 6.1 ? 'from city hall' : 'mayor resigned (4 min)', 'PARODY', U > 3.3];
    }
    // ============ BEAT 2 (B): swamp -> public park
    if (bi === 2) {
      const U = lt; const parkP = smooth((U - 2.4) / .5); const growP = smooth((U - 3.6) / 2.2);
      stand(mo, -.3, 7.4, Math.PI); mo.arms = { lx: -.4, lz: -.1, rx: -1.5 + Math.sin(t * 3) * .05, rz: -.15 }; swampSignB.visible = true; bSign.userData.cv.draw(U < 2.4 ? 'SWAMP' : 'PUBLIC\nPARK');
      const Rr = lerp(1.9, 5.8, growP); mud.scale.set(Rr + .5, 1, Rr + .5); pud.scale.set(Rr, 1, Rr); mud.position.set(-1.5 - growP * 1.5, .03, 10); pud.position.copy(mud.position); pud.position.y = .05;
      reeds.forEach(([r, a, rr]) => { r.position.x = mud.position.x + Math.cos(a) * (rr + (Rr - 1.9)); r.position.z = 10 + Math.sin(a) * (rr + (Rr - 1.9)); });
      parkBits.forEach((m) => (m.visible = parkP > .5));
      const price = lerp(400, 40, growP); houseCvs.forEach((c) => c.draw('$' + Math.round(price) + 'K')); houses.forEach((h, i) => { h.rotation.z = growP * .12 * (i ? -1 : 1); h.position.y = -growP * .35; });
      for (let i = 1; i <= 3; i++) { const o = P[i]; o.anim = 'walk'; o.speed = .55; o.vis = U > 3.4; o.yaw = -Math.PI / 2; o.x = lerp(11, -6, clamp((U - 3.4) / 4.8 + (i - 1) * .17)); o.z = 5.3 + (i % 2) * .8; o.pitch = .4; o.arms = { lx: -.4, lz: -.1, rx: -1.8, rz: 0 }; }
      crB.setFace(U > 5.6 ? 'shock' : 'calm');
      crB.update(t); mayB.upd(); phones.forEach((m, i) => { attach(m, P[i + 1], 'handR', [0, -.04, .09], [.6, 0, 0]); m.visible = P[i + 1].vis; });
      attach(swampSignB, mo, 'handR', [0, -.1, .5], [1.5, 0, 0]);
      cam = camPush([.8, 2.6, -2.8, -.5, 1.6, 9.5, 66], [1.0, 2.8, -3.0, -1.4, 1.6, 9.5, 68], p);
      counter = ['Property value', '$' + Math.round(price) + 'K', U < 3.6 ? 'one swamp, now public' : 'down ' + Math.round((1 - price / 400) * 100) + '%', 'PARODY', U > 4.2];
    }
    // ============ BEAT 3 (A): donkey chief of staff
    if (bi === 3) {
      timerFn('MAYOR', 'IN OFFICE'); const U = lt; dDesk.visible = true; scr.visible = lap.visible = lapBack.visible = stackD.visible = true; envs.visible = true;
      PA.forEach((o, i) => { if (i >= 1 && i <= 4) seat(o, (i < 3 ? 1 : -1) * (i % 2 ? 1.9 : 3.1), 5.4); });
      stand(mo, -1.4, 7.4, Math.PI); mo.arms = { lx: -.5, lz: -.1, rx: -.6, rz: .1 };
      const typing = U > 1.4; legsD.forEach((l, i) => { l.rotation.x = typing && i < 2 ? Math.sin(t * 22 + i * 2) * .5 : 0; }); donkeyG.position.y = .76 + (U > 2.6 && U < 3.0 ? Math.abs(Math.sin((U - 2.6) / .4 * Math.PI)) * .15 : 0); donkeyG.visible = U > .5;
      const sent = U < 3.6 ? 0 : Math.round(4000 * smooth((U - 3.6) / 1.1)); scrCv.draw(fmt(sent), U > 5.7 ? 'are we there yet' : '(none)'); stackD.scale.y = 1 + sent / 4000 * 5; stackD.position.y = .76 + stackD.scale.y * .05;
      for (let i = 0; i < ENV; i++) { const q = ((t - 3.6) * 1.3 + i / ENV * 3.7) % 1; const on = U > 3.6; eP.set(-.3 + Math.sin(i * 7.3) * .4 - q * (1.0 + Math.sin(i * 3.1) * 1.0), 1.6 + q * 2.0 + Math.sin(i * 1.7) * .3, 1.9 - q * 1.2 + Math.cos(i * 5.1) * .3); eS.setScalar(on ? (q < .1 ? q * 10 : 1.2 - q * .3) * .8 : 0); eM.compose(eP, A.camera.quaternion, eS); envs.setMatrixAt(i, eM); } envs.instanceMatrix.needsUpdate = true;
      face = U > 5.6 ? 'shock' : 'calm'; crA.setFace(face); crA.update(t); mayA.upd();
      bubD.sp.visible = U > 5.7; bubD.set('are we there yet'); bubD.sp.position.set(.2, 3.0, 1.7); bubD.sp.scale.set(1.9, .76, 1);
      cam = camPush([.3, 2.3, -2.6, .2, 2.0, 3.0, 66], [-.1, 2.2, -2.6, -.1, 2.0, 3.0, 66], p);
      counter = ['Emails', fmt(sent), U < 3.6 ? 'chief of staff (donkey)' : 'all say the same thing', 'PARODY', sent > 2000];
    }
    // ============ BEAT 4 (B): election vs tall rival
    if (bi === 4) {
      const U = lt; stageB.forEach((m) => (m.visible = true)); tallyB.forEach((m) => (m.visible = true));
      stand(mo, -2.0, 6.2, Math.PI); mo.y = .6; mo.arms = { lx: -.5, lz: -.1, rx: -.9, rz: .1 }; stand(rival, 2.0, 6.2, Math.PI); rival.y = .6; rival.arms = { lx: -.5, lz: -.1, rx: -.9, rz: .1 }; rival.vis = U > 1.5;
      const win = U > 7.4; face = U > 5.6 ? 'shock' : 'calm';
      for (let i = 0; i < 6; i++) { const o = P[6 + i]; stand(o, -3.2 + i * 1.3, .6, 0, 'idle'); o.scale = 1.0; o.arms = { lx: -.4, lz: -.1, rx: win ? -2.7 : -.4, rz: .1 }; }
      if (U > 5.6 && !win) for (let i = 0; i < 5; i++) { const o = P[6 + i]; bubB[i].set('?'); bubB[i].sp.visible = true; bubB[i].sp.position.set(o.x, 3.2, o.z); bubB[i].sp.scale.set(.9, .36, 1); }
      if (win) { mo.arms = { lx: -2.7 + Math.sin(t * 9) * .12, lz: .2, rx: -2.7 - Math.sin(t * 9) * .12, rz: -.2 }; rival.arms = { lx: -.5, lz: -.1, rx: -.2, rz: .1 }; }
      const votes = win ? Math.round(4006000 * smooth((U - 7.4) / .8)) : Math.round(2000000 * clamp((U - 2) / 5) * (.9 + .1 * Math.sin(U * 5)));
      const a = win ? .98 : clamp((U - 2) / 5) * .5, bb = win ? .02 : clamp((U - 2) / 5) * .5; tallyCv.draw(a, bb, fmt(votes), win ? '0 (confused)' : fmt(Math.round(votes * .98))); crB.setFace(face);
      crB.update(t); mayB.upd(); attach(bowl, rival, 'head', [0, .16, 0]); attach(fringe, rival, 'head', [0, .06, .24]); bowl.visible = fringe.visible = rival.vis;
      conf.clear(); if (win) for (let i = 0; i < 150; i++) { const u = ((U - 7.4) * .5 + i * .0071) % 1; const a2 = i * 2.4; conf.set(i, -2.4 + Math.cos(a2) * u * 4, 8.5 - u * u * 4 + Math.sin(i) * .3, 6 + Math.sin(a2) * u * 2, (1 - u) * 1.2); } conf.done();
      cam = camPush([0, 3.4, -6.5, 0, 4.2, 6.5, 62], [0, 3.4, -5.5, 0, 4.4, 6.5, 58], p);
      counter = ['Votes · mayor', fmt(votes), win ? 'rival: 0 (confused)' : 'a very tall opponent', 'PARODY', win];
    }
    if (bi !== 4) { conf.clear(); conf.done(); }
    // ============ BEAT 5 (B): welcome sign + tourism
    if (bi === 5) {
      const U = lt; townB.forEach((m) => (m.visible = true));
      const p1 = clamp((U - 2.6) / 1.5), p2 = clamp((U - 4.2) / 1.2); townCv.draw('WELCOME TO OHIO', 'GET OUT OF MY SWAMP', p1, p2, ['ENTERING', 'OHIO']);
      stand(mo, -3.4, 8.2, Math.PI); const painting = U > 1.8 && U < 5.6; const sweep = U < 4.2 ? Math.sin((U - 2.6) * 3.2) : Math.sin((U - 4.2) * 3.2); mo.arms = { lx: -.4, lz: -.1, rx: painting ? -2.0 : -.4, rz: painting ? -.3 + sweep * .5 : .1 }; brush.visible = painting;
      const tour = Math.round(clamp((U - 5.4) / 2) * 400); const nT = Math.round(clamp((U - 5.2) / 2.2) * 15);
      for (let i = 0; i < 15; i++) { const o = P[6 + i]; const k = clamp((U - 5.0 - i * .08) / 2.4); o.vis = i < nT; o.anim = i % 2 ? 'run' : 'walk'; o.speed = .7; o.yaw = -Math.PI / 2; o.x = lerp(12, -9, k); o.z = 4 + (i % 4) * .8; o.arms = { lx: -.4, lz: -.1, rx: -1.6, rz: 0 }; }
      crB.setFace(U > 4.3 ? 'shock' : 'calm'); crB.update(t); mayB.upd(); attach(brush, mo, 'handR', [0, -.1, .1], [.4, 0, 0]); brush.visible = painting;
      cam = camPush([.8, 2.8, -3.2, .2, 3.0, 9, 68], [1.0, 3.0, -3.6, .3, 3.1, 9, 68], p);
      counter = ['Tourism', '+' + tour + '%', tour === 0 ? 'town sign repaint' : 'visitors from everywhere', 'PARODY', tour > 200];
    }
    // ============ BEAT 6 (A): buried in the parking policy
    if (bi === 6) {
      timerFn('MAYOR', 'IN OFFICE'); const U = lt; desk.visible = desk2.visible = true;
      seat(mo, 0, 5.6); mo.scale = 1.5; mo.y = .72 - .68 * 1.5 + .02; mo.arms = { lx: -.5, lz: -.1, rx: -.9, rz: .1 };
      PA.forEach((o, i) => { if (i >= 1 && i <= 4) seat(o, (i < 3 ? 1 : -1) * (i % 2 ? 1.9 : 3.1), 5.4); });
      let shown = 0; sheets.forEach((s, k) => { const tt = U - (3.0 + k * .08); s.visible = tt > 0; if (tt > 0) { const d = dropBounce(3.2 + k * .1, 0, tt, .15); const top = .83 + k * .11; s.position.set(Math.sin(k * 2.3) * .1, top + d.y, 4.1 + Math.cos(k * 1.9) * .08); s.rotation.y = Math.sin(k * 1.7) * .08; if (d.settled || d.y < .05) shown++; } });
      polTop.visible = U > 3.0 + 13 * .08 + .6; polTop.position.set(0, .83 + 14 * .11 + .01, 4.1);
      crA.setFace('calm'); crA.update(t); mayA.upd();
      bubM.sp.visible = U < 2.4; bubM.set('leave me alone'); bubM.sp.position.set(0, 4.2, 5.6); bubM.sp.scale.set(1.9, .76, 1);
      cam = camPush([.3, 2.4, -2.4, 0, 2.2, 5.2, 58], [.1, 2.4, -1.4, 0, 2.3, 5.2, 52], p);
      counter = ['Policy pages', U < 3.0 ? '0' : String(Math.min(14, Math.round((U - 3.0) / .08))), U < 3.0 ? 'he wanted to be left alone' : 'parking', 'PARODY', U > 3.4];
    }
    cam = cam || [0, 2.5, -2, 0, 1.5, 5, 55];
    ST.cam(...cam); ST.follow(cam[3], ST === A ? 4 : 9); ST.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if *Shrek* became the *mayor of Ohio?*' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter(...counter); hud.tm('');
    const pops = popA[bi].filter((q) => lt >= q[0]); const cur = pops.length ? pops[pops.length - 1] : null; hud.pop(cur ? cur[1] : '', cur ? Math.min(1, (lt - cur[0]) * 6) : 0);
  } };
}
