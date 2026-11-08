import { drakeLook, makeBubble } from './_drake.js';
// What if Drake coached your little league team? Parody caricature. Strike three -> apologizes to the ball, nine-minute bucket speech,
// everybody cries (ump too), game 8 forfeit on purpose + handshakes, season ends 0 wins and a group hug with confetti.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, tree, addBox, mat, Crowd, Particles, clamp, smooth, lerp, attach } = lib;
  const st = makeStage({ shadowExtent: 34, fogNear: 90, fogFar: 380, sunDir: [-.45, .85, -.35], sunI: 2.9 }); const S = st.scene; ground(S, 0x6fae4a, 900);
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const flat = (shape, x, z, ry, color, y = .02) => { const m = new THREE.Mesh(shape, mat(color, { roughness: 1 })); m.rotation.x = -Math.PI / 2; m.rotation.z = ry; m.position.set(x, y, z); m.receiveShadow = true; S.add(m); return m; };
  // ---- field: diamond is a rotated square; home (0,-8), 1st (+7,-1), 2nd (0,6), 3rd (-7,-1)
  flat(new THREE.PlaneGeometry(10.2, 10.2), 0, -1, Math.PI / 4, 0xb98152, .02);
  flat(new THREE.PlaneGeometry(6.4, 6.4), 0, -1, Math.PI / 4, 0x78b852, .03);
  flat(new THREE.CircleGeometry(1.0, 24), 0, -1.5, 0, 0xb98152, .04); flat(new THREE.CircleGeometry(1.7, 24), 0, -8, 0, 0xb98152, .035);
  addBox(S, 0, .1, -1.5, 1.3, .2, 1.3, 0xb98152, { cast: false, round: .1 }).scale.set(1, 1, 1);
  [[0, -8], [7, -1], [0, 6], [-7, -1]].forEach(([x, z], i) => { if (i) addBox(S, x, .05, z, .5, .1, .5, 0xffffff, { cast: false }).rotation.y = Math.PI / 4; });
  const plate = addBox(S, 0, .05, -8, .55, .08, .55, 0xffffff, { cast: false }); plate.rotation.y = Math.PI / 4;
  for (const sx of [-1, 1]) { const L = 34; const m = addBox(S, sx * (L / 2 * .7071) , .03, -8 + L / 2 * .7071, L, .02, .12, 0xffffff, { cast: false }); m.rotation.y = -sx * Math.PI / 4; m.position.set(sx * L / 2 * .7071, .03, -8 + L / 2 * .7071); }
  // ---- outfield fence + scoreboard + bleachers + dugout
  const FZ = 21; addBox(S, 0, .9, FZ, 46, 1.8, .2, 0x1f6b3a); addBox(S, 0, 1.85, FZ, 46, .12, .3, 0xf2c230);
  for (const sx of [-1, 1]) { const w = addBox(S, sx * 23, .9, FZ - 14, .2, 1.8, 28, 0x1f6b3a); addBox(S, sx * 23, 1.85, FZ - 14, .3, .12, 28, 0xf2c230); }
  const SB = cvs(1024, 576, () => {}); const sbMesh = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 5.4), new THREE.MeshBasicMaterial({ map: SB.t })); sbMesh.position.set(0, 5.1, FZ - .25); sbMesh.rotation.y = Math.PI; S.add(sbMesh);
  addBox(S, 0, 5.1, FZ + .1, 10, 5.8, .3, 0x20242c); for (const sx of [-1, 1]) addBox(S, sx * 4.4, 1.6, FZ + .1, .3, 3.2, .3, 0x20242c);
  let sbKey = ''; const drawSB = (k) => { if (k === sbKey) return; sbKey = k; const g = SB.g; g.fillStyle = '#0f1a14'; g.fillRect(0, 0, 1024, 576); g.fillStyle = '#e8c02e'; g.fillRect(0, 0, 1024, 14); g.fillRect(0, 562, 1024, 14); g.textAlign = 'center';
    if (k === 'forfeit') { g.fillStyle = '#9fe08a'; g.font = '800 70px Liberation Sans, Arial'; g.fillText('GAME 8 · FINAL', 512, 100); g.fillStyle = '#ff4a3a'; g.font = '900 120px Liberation Sans, Arial'; g.fillText('FORFEIT', 512, 290); g.fillStyle = '#ffd92a'; g.font = '900 100px Liberation Sans, Arial'; g.fillText('(ON PURPOSE)', 512, 430); g.fillStyle = '#ffffff'; g.font = '700 48px Liberation Sans, Arial'; g.fillText('TIGERS  0     SHARKS  0', 512, 520); }
    else if (k === 'wins') { g.fillStyle = '#9fe08a'; g.font = '800 70px Liberation Sans, Arial'; g.fillText('SEASON FINAL', 512, 110); g.fillStyle = '#ffd92a'; g.font = '900 190px Liberation Sans, Arial'; g.fillText('WINS: 0', 512, 340); g.fillStyle = '#ffffff'; g.font = '700 54px Liberation Sans, Arial'; g.fillText('LOSSES: 0   (WE ARE FINE)', 512, 470); }
    else { g.fillStyle = '#9fe08a'; g.font = '800 70px Liberation Sans, Arial'; g.fillText('LITTLE LEAGUE', 512, 110); g.fillStyle = '#ffffff'; g.font = '900 90px Liberation Sans, Arial'; g.fillText('TIGERS  0', 512, 270); g.fillText('SHARKS 14', 512, 400); g.fillStyle = '#ffd92a'; g.font = '700 48px Liberation Sans, Arial'; g.fillText('INNING 6', 512, 512); } SB.t.needsUpdate = true; };
  for (let r = 0; r < 4; r++) { addBox(S, 15, .35 + r * .4, 8 + r * .9, 1.0, .7 + r * .8 - .3, 12, 0x9aa3ad, { cast: true }); addBox(S, 14.4, .75 + r * .4, 8 + r * .9, .5, .06, 12, 0xcfd6dd, { cast: false }); }
  addBox(S, -10.5, .55, -5.5, 2.0, .1, 7, 0x6a4a2c); addBox(S, -11.4, 1.6, -5.5, .12, 2.2, 7.2, 0xc9b08a); addBox(S, -10.5, 2.75, -5.5, 2.4, .14, 7.6, 0x8a2b2b); addBox(S, -10.5, .3, -5.5, .3, .6, 6.8, 0x4a3320);
  for (let i = 0; i < 10; i++) tree(S, -30 + i * 7, 28 + (i % 3) * 3, 1.5, i * 3);
  // ---- people. 0 Drake, 1 umpire, 2 pitcher, 3 batter, 4 catcher, 5-9 team A (red), 10-15 team B (blue)
  const N = 16; const crowd = new Crowd(S, N, 47); const P = crowd.p; const D = P[0], UMP = P[1], PIT = P[2], BAT = P[3], CAT = P[4];
  const look = drakeLook(lib, S, crowd, 0, { jersey: 0x1f5a3a });
  const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  const dress = (i, shirt, pants) => { ['torso', 'armL', 'armR'].forEach((k) => col(i, k, shirt)); ['legL', 'legR'].forEach((k) => col(i, k, pants)); };
  dress(1, 0x16161a, 0x30343c); crowd.parts.hair.setColorAt(1, new THREE.Color(0x888888)); crowd.parts.hair.instanceColor.needsUpdate = true;
  [2, 4, 5, 6, 7, 8, 9].forEach((i) => dress(i, 0xe03a2e, 0xf2f2f2)); [3, 10, 11, 12, 13, 14, 15].forEach((i) => dress(i, 0x2d6fe0, 0xe8e8ee));
  const TEAMA = [2, 4, 5, 6, 7, 8, 9], TEAMB = [3, 10, 11, 12, 13, 14, 15]; const KIDS = [...TEAMA, ...TEAMB]; const KS = .7;
  // ---- props
  const ball = new THREE.Mesh(new THREE.SphereGeometry(.1, 14, 10), mat(0xffffff, { roughness: .5 })); ball.castShadow = true; S.add(ball); const seam = new THREE.Mesh(new THREE.TorusGeometry(.1, .008, 6, 20), mat(0xd23030)); ball.add(seam);
  const bat = new THREE.Mesh(new THREE.BoxGeometry(.9, .07, .07), mat(0xc49a5c)); bat.castShadow = true; S.add(bat);
  const bucket = new THREE.Mesh(new THREE.CylinderGeometry(.34, .28, .5, 16), mat(0xf08a1c)); bucket.position.set(2.2, .25, -5.0); bucket.castShadow = true; S.add(bucket); const rim = new THREE.Mesh(new THREE.TorusGeometry(.34, .03, 6, 20), mat(0xd27010)); rim.rotation.x = Math.PI / 2; rim.position.set(2.2, .5, -5.0); S.add(rim);
  const CK = cvs(512, 256, () => {}); const clock = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), new THREE.MeshBasicMaterial({ map: CK.t })); clock.visible = false; S.add(clock); const clockPole = addBox(S, 0, 0, 0, .06, 1.8, .06, 0x555555); clockPole.visible = false;
  let ckTxt = ''; const drawClock = (txt, hot) => { if (txt + hot === ckTxt) return; ckTxt = txt + hot; const g = CK.g; g.fillStyle = '#10151f'; g.fillRect(0, 0, 512, 256); g.strokeStyle = '#ffd92a'; g.lineWidth = 12; g.strokeRect(6, 6, 500, 244); g.fillStyle = '#9fe08a'; g.font = '800 44px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('SPEECH', 256, 62); g.fillStyle = hot ? '#ff4a3a' : '#ffffff'; g.font = '900 140px Liberation Sans, Arial'; g.fillText(txt, 256, 205); CK.t.needsUpdate = true; };
  const flag = new THREE.Group(); { const pole = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 1.9, 6), mat(0xdddddd)); pole.position.y = .6; const cl = new THREE.Mesh(new THREE.PlaneGeometry(.9, .6), new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, roughness: .9 })); cl.position.set(.45, 1.35, 0); flag.add(pole, cl); flag.userData.cl = cl; flag.visible = false; S.add(flag); }
  const clip = new THREE.Mesh(new THREE.BoxGeometry(.28, .04, .38), mat(0x6a4a2c)); const clipP = new THREE.Mesh(new THREE.BoxGeometry(.25, .01, .34), mat(0xfafafa)); clipP.position.y = .025; clip.add(clipP); clip.castShadow = true; S.add(clip);
  const tears = new Particles(S, 220, 0x6fc4ff, .03, { rough: .1, emissive: 0x1a5a9a }); const CONF = [0xff4a6e, 0xffd92a, 0x4fd16a, 0x4aa8ff, 0xc060ff].map((c) => new Particles(S, 70, c, .07, { rough: .6, emissive: c })); const rr = lib.R(9); const CF = []; for (let i = 0; i < 350; i++) CF.push([(rr() - .5) * 8, rr(), rr() * 6.28, .6 + rr() * .8]);
  const bB = makeBubble(lib, S, 1.5, .56), bP = makeBubble(lib, S, 1.1, .42), bU = makeBubble(lib, S, 1.1, .42);
  const place = (o, x, z, yaw, anim = 'idle', sp = .4, sc = 1.25, y = 0) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.vis = true; o.scale = sc; };
  const kid = (o, x, z, yaw, anim = 'idle', sp = .4, y = 0) => place(o, x, z, yaw, anim, sp, KS, y);
  const hpos = (o, key, off = [0, 0, 0]) => { const v = new THREE.Vector3(off[0], off[1], off[2]); return v.applyMatrix4(o.M[key]); };
  const POP = ['', 'STRIKE THREE', 'NINE MINUTES', 'THE UMPIRE TOO', 'ON PURPOSE', 'ZERO WINS']; const NOTE = ['', 'sorry, ball', 'he did not stop', 'both teams. nobody left.', 'out of respect', 'nobody has ever been this happy'];
  const mmss = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); for (let i = 0; i < N; i++) { P[i].vis = false; P[i].arms = null; P[i].pitch = 0; P[i].extra = 0; } [bB, bP, bU].forEach((b) => b.hide());
    ball.visible = bat.visible = clip.visible = flag.visible = clock.visible = clockPole.visible = false; tears.clear(); CONF.forEach((c) => c.clear());
    let cam = [0, 3, -12, 0, 1.4, -3, 50]; let sb = 'idle'; let cnt = '', cry = [];
    const idleArms = { lx: -.15, lz: -.1, rx: -.15, rz: .1 };
    // shared "field in play" cast: fielders for beats 0-2
    const fielders = () => { kid(CAT, 0, -9.3, 0, 'idle', .3); CAT.pitch = .55; CAT.arms = { lx: -1.5, lz: .1, rx: -.3, rz: .1 }; place(UMP, 0, -10.7, 0, 'idle', .3); UMP.pitch = .3; UMP.arms = { lx: -.3, lz: -.1, rx: -.3, rz: .1 };
      const f = [[-5, 3.5], [5, 3.5], [0, 7.5], [-6.5, 11], [6.5, 11], [-2.2, 13]]; TEAMA.slice(2).concat([]).forEach((id, k) => kid(P[id], f[k][0], f[k][1], Math.PI + (k % 2 ? .3 : -.3), 'idle', .35)); };
    if (bi === 0) { // hook: Drake in whistle-and-clipboard pose, team lined up behind, kids bouncing
      place(D, 0, -1.2, Math.PI, 'idle', .4); D.arms = { lx: -.3, lz: -.1, rx: -1.0, rz: .1 }; D.pitch = .06; cam = [-.8, 2.0, -9.6, 0, 1.7, -1.2, 46];
      KIDS.slice(0, 12).forEach((id, k) => { const row = k < 6 ? 0 : 1, c = k % 6; kid(P[id], -2.7 + c * 1.08 + row * .5, 1.3 + row * 1.2, Math.PI, 'idle', .4, Math.abs(Math.sin(t * 5 + k)) * .1); P[id].arms = { lx: -.2, lz: -.1, rx: -.2, rz: .1 }; }); }
    else if (bi === 1) {
      sb = 'idle'; fielders(); kid(PIT, 0, -1.6, Math.PI, 'idle', .3); kid(BAT, -1.0, -8.0, Math.PI / 2, 'idle', .3);
      const wind = smooth(clamp((lt - .55) / .4)); PIT.arms = { lx: -.3, lz: -.1, rx: lt < 1.0 ? lerp(-.3, -2.9, wind) : lerp(-2.9, .3, smooth((lt - 1.0) / .25)), rz: .1 };
      ball.visible = bat.visible = true; bat.visible = true; const swing = smooth(clamp((lt - 1.15) / .3)); BAT.yaw = Math.PI / 2 + lerp(.5, -1.1, swing); BAT.arms = { lx: -1.4, lz: .05, rx: -1.4, rz: -.05 }; BAT.pitch = .1; attach(bat, BAT, 'handR', [.12, -.1, 0], [0, 0, 0]);
      const r0 = hpos(PIT, 'handR', [0, -.1, .0]);
      if (lt < 1.0) ball.position.copy(r0); else if (lt < 1.45) { const u = (lt - 1.0) / .45; ball.position.set(0, lerp(r0.y, .9, u) + Math.sin(u * Math.PI) * .15, lerp(-1.6, -9.3, u)); } else if (lt < 2.0) ball.position.set(0, .78, -9.3); else if (lt < 2.6) { const u = (lt - 2.0) / .6; ball.position.set(0, lerp(.78, 1.0, u) + Math.sin(u * Math.PI) * .6, lerp(-9.3, -1.7, u)); } else ball.position.copy(hpos(PIT, 'handR', [0, -.1, 0]));
      if (lt > 1.5 && lt < 2.7) { UMP.arms = { lx: -.3, lz: -.1, rx: -2.9, rz: .1 }; }
      // Drake walks out of the dugout to the mound
      const w = smooth(clamp((lt - 2.5) / 1.7)); const dx = lerp(-9.5, .95, w); const dz = lerp(-5.5, -1.5, w);
      if (lt >= 2.5) { place(D, dx, dz, w < 1 ? Math.atan2(.95 + 9.5, 4) * 0 + Math.PI / 2 : Math.PI / 2 + .25, w < 1 ? 'walk' : 'squat', .6); }
      if (lt >= 4.1) { place(D, .95, -1.5, Math.PI / 2 + .35, 'squat', .6); D.arms = { lx: -1.1, lz: .12, rx: -1.1, rz: -.12 }; D.pitch = .5; const m = hpos(D, 'handL').add(hpos(D, 'handR')).multiplyScalar(.5); ball.position.copy(m).add(new THREE.Vector3(0, .04, .0)); PIT.x = -.7; PIT.yaw = Math.PI / 2 - .3; PIT.arms = { lx: -.1, lz: -.1, rx: -.1, rz: .1 }; if (lt > 4.5) bB.show('sorry, ball', .6, 2.35, -1.5); }
      else if (lt >= 3.2) { PIT.x = lerp(0, -.7, smooth((lt - 3.2) / .9)); PIT.yaw = Math.PI / 2 - .3; }
      if (lt > 5.2) { bP.show('...ok', -.7, 1.65, -1.5); }
      cam = lt < 2.4 ? [4.5, 5.0, -15.5, 0, 1.0, -5.0, 48] : [8.0, 2.0, -5.9, -.2, 1.15, -1.7, 50]; }
    else if (bi === 2) {
      sb = 'idle'; kid(CAT, 0, -9.3, 0, 'idle', .3); CAT.pitch = .55; CAT.arms = { lx: -1.5, lz: .1, rx: -.3, rz: .1 }; place(UMP, 0, -10.7, 0, 'idle', .3); UMP.pitch = .3; UMP.arms = { lx: -.3, lz: -.1, rx: -.3, rz: .1 };
      TEAMA.slice(1, 5).forEach((id, k) => kid(P[id], 5.4 + (k % 2) * .8, -4.2 - k * .9 - 3.2, Math.PI / 2 + .3, 'idle', .3));
      TEAMB.slice(1, 5).forEach((id, k) => kid(P[id], -4.6 - (k % 2) * .8, -4.2 - k * .9 - 3.2, -Math.PI / 2 - .3, 'idle', .3));
      const sw = clamp((lt - .6) / 1.0); if (lt < 2.9) { kid(BAT, -1.0, -8.0, Math.PI / 2, 'idle', .3); bat.visible = true; BAT.arms = { lx: -1.4, lz: .05, rx: -1.4, rz: -.05 }; BAT.yaw = Math.PI / 2 + lerp(.5, -1.1, smooth(clamp((lt - 1.2) / .3))); attach(bat, BAT, 'handR', [.12, -.1, 0], [0, 0, 0]); if (lt > 1.6) UMP.arms = { lx: -.3, lz: -.1, rx: -2.9, rz: .1 };
        if (lt > 2.0) { BAT.yaw = Math.PI / 2 + .1; BAT.pitch = .35; BAT.arms = { lx: -.6, lz: .05, rx: -.6, rz: -.05 }; } }
      else { // batter shuffles over to Drake's bucket, head down, bat dragging
        const u = smooth(clamp((lt - 2.9) / 1.0)); kid(BAT, lerp(-1.0, .5, u), lerp(-8.0, -5.4, u), u < 1 ? .4 : Math.PI / 2 - .2, u < 1 ? 'walk' : 'idle', .3); BAT.pitch = .3; BAT.arms = { lx: -.2, lz: -.1, rx: -.2, rz: .1 }; bat.visible = true; attach(bat, BAT, 'handR', [0, -.35, .05], [0, 0, 1.2]);
        // Drake steps onto the bucket
        const du = smooth(clamp((lt - 2.9) / 1.0)); const bx = 2.2, bz = -5.0; place(D, lerp(5.5, bx, du), lerp(-6.5, bz, du), Math.PI + .12 * Math.sin(lt * 1.3), du < 1 ? 'walk' : 'idle', .6, 1.25, du >= 1 ? .5 : 0);
        if (du >= 1) { const g = Math.sin(lt * 6), g2 = Math.sin(lt * 4.3 + 1); D.arms = { lx: -1.2 + .8 * g, lz: .5 + .3 * g2, rx: -1.5 - .8 * g2, rz: -.5 - .3 * g }; D.pitch = .08 + .08 * Math.sin(lt * 3); if (lt < 4.6) bB.show('listen up', 2.3, 3.6, -5.0); }
        clock.visible = clockPole.visible = true; clock.position.set(.7, 3.4, -5.0); clock.rotation.y = Math.PI; clockPole.position.set(.7, 1.7, -5.0); const el = lt < 3.4 ? 0 : clamp((lt - 3.4) / 2.5) * 540; drawClock(mmss(el), el >= 539); cnt = mmss(el); }
      cam = lt < 2.9 ? [4.5, 5.0, -15.5, 0, 1.0, -5.0, 48] : [3.6, 2.6, -10.2, 1.2, 2.0, -4.0, 54]; }
    else if (bi === 3) {
      sb = 'idle'; const n = Math.min(KIDS.length, 3 + Math.floor(lt * 4)); // crying spreads through both teams
      KIDS.forEach((id, k) => { const side = k % 2 ? 1 : -1, idx = k >> 1; kid(P[id], side * 2.2, -5.4 + idx * 1.15, -side * Math.PI / 2, 'idle', .3); const c = k < n; P[id].arms = c ? { lx: -2.3 + .08 * Math.sin(t * 9 + k), lz: .35, rx: -2.3 + .08 * Math.sin(t * 9 + k + 1), rz: -.35 } : { lx: -.2, lz: -.1, rx: -.2, rz: .1 }; P[id].pitch = c ? .2 : 0; P[id].extra = c ? .035 : 0; if (c) cry.push(id); });
      place(D, 0, -2.0, Math.PI, 'idle', .4); D.arms = { lx: -2.2 + .1 * Math.sin(t * 8), lz: .4, rx: -2.2, rz: -.4 }; D.extra = .03; D.pitch = .2; cry.push(0);
      const uu = smooth(clamp((lt - 2.3) / 1.5)); place(UMP, lerp(8, 0, uu), -4.6, uu < 1 ? -Math.PI / 2 : Math.PI, uu < 1 ? 'walk' : 'idle', .5); if (uu >= 1) { UMP.arms = { lx: -2.3, lz: .35, rx: -2.3 + .08 * Math.sin(t * 9), rz: -.35 }; UMP.extra = .03; UMP.pitch = .2; cry.push(1); if (lt > 3.9) bU.show('allergies', .1, 2.7, -4.6); }
      cam = [0, 3.3, -11.0, 0, 1.2, -1.5, 52]; cnt = String(Math.min(16, cry.length) + (cry.includes(1) ? 0 : 0)); }
    else if (bi === 4) {
      sb = 'forfeit'; const u = smooth(clamp((lt - .2) / 1.2)); const n = 6;
      for (let k = 0; k < n; k++) { const x = -3.0 + k * 1.2; const a = TEAMA[k], b = TEAMB[k]; const meet = u; kid(P[a], x + .15, lerp(3.0, 8.0, meet) + 0, 0, u < 1 ? 'walk' : 'idle', .5); kid(P[b], x - .15, lerp(14.0, 9.2, meet), Math.PI, u < 1 ? 'walk' : 'idle', .5); if (u >= .98) { const sh = .15 * Math.sin(t * 9 + k); P[a].arms = { lx: -.2, lz: -.1, rx: -1.35 + sh, rz: .1 }; P[b].arms = { lx: -.2, lz: -.1, rx: -1.35 - sh, rz: .1 }; } else { P[a].arms = null; P[b].arms = null; } }
      kid(P[TEAMB[6]], 4.0, 8.0, Math.PI, 'idle', .3); TEAMB.length; P[TEAMB[6]].vis = false;
      place(D, -1.2, 12.2, Math.PI + .2, 'idle', .4); D.arms = { lx: -.3, lz: -.1, rx: -2.7, rz: .15 }; D.pitch = -.05; flag.visible = true; attach(flag, D, 'handR', [0, -.35, .0], [0, 0, 0]); flag.userData.cl.rotation.y = .25 * Math.sin(t * 6); flag.userData.cl.scale.set(1 + .08 * Math.sin(t * 7), 1, 1);
      place(UMP, 4.2, 6.6, Math.PI - .4, 'idle', .4); UMP.arms = { lx: -.3, lz: -.1, rx: -1.2, rz: .1 };
      cam = [-2.0, 2.3, -.2, 0.6, 2.2, 14.5, 56]; cnt = '1'; }
    else {
      sb = 'wins'; const spin = t * .5; const ring = (ids, r, y0) => ids.forEach((id, k) => { const a = spin + (k / ids.length) * Math.PI * 2; const px = Math.sin(a) * r, pz = Math.cos(a) * r; kid(P[id], px, 11.5 + pz, a + Math.PI, 'idle', .3, Math.abs(Math.sin(t * 4 + k * 1.7)) * .16); P[id].arms = { lx: -1.55, lz: .25, rx: -1.55, rz: -.25 }; P[id].pitch = .08; });
      ring([...TEAMA, TEAMB[0]], 1.15, 0); ring([...TEAMB.slice(1)], 1.85, 0);
      place(D, 0, 11.5, Math.PI + Math.sin(t * 1.5) * .5, 'idle', .4, 1.25, Math.abs(Math.sin(t * 4)) * .12); D.arms = { lx: -1.7, lz: .5, rx: -1.7, rz: -.5 };
      { const a = spin + .4; place(UMP, Math.sin(a) * 2.5, 11.5 + Math.cos(a) * 2.5, a + Math.PI, 'idle', .3, 1.25, Math.abs(Math.sin(t * 4 + 2)) * .12); UMP.arms = { lx: -1.5, lz: .3, rx: -1.5, rz: -.3 }; }
      CONF.forEach((c, ci) => { for (let i = 0; i < 70; i++) { const q = CF[ci * 70 + i], u = ((t * (.35 + q[3] * .2) + q[1]) % 1); c.set(i, q[0] + Math.sin(t * 2 + q[2]) * .4, 8 - u * 8, 11 + (q[1] - .5) * 7 + Math.cos(t * 1.7 + q[2]) * .4, lt > .25 ? .35 + .2 * Math.abs(Math.sin(t * 6 + q[2])) : 0); } c.done(); });
      cam = [.8, 3.6, .2, 0, 2.5, 11.8, 52]; cnt = '0'; }
    crowd.update(t); look.update(); look.setVisible(D.vis);
    // tears: two streams per crier, from the eye line down the cheeks
    if (cry.length) { let q = 0; const per = Math.floor(220 / (cry.length * 2)); cry.forEach((id) => { const o = P[id], s = o.scale * o.h, f = [Math.sin(o.yaw), Math.cos(o.yaw)], r = [Math.cos(o.yaw), -Math.sin(o.yaw)]; for (const sd of [-1, 1]) for (let i = 0; i < per && q < 220; i++) { const u = ((t * 1.1 + i / per + sd * .13 + id * .37) % 1); const y = o.y + 1.72 * s - u * .55 * s - (o.pitch ? .1 * s : 0); tears.set(q++, o.x + f[0] * (.27 + u * .08) * s + r[0] * sd * .1 * s, y, o.z + f[1] * (.27 + u * .08) * s + r[1] * sd * .1 * s, 1.2 - u * .6); } }); for (; q < 220; q++) tears.set(q, 0, 0, 0, 0); tears.done(); }
    if (clip.visible === false && bi === 0) { clip.visible = true; attach(clip, D, 'handL', [0, -.05, .1], [0, 0, 0]); }
    drawSB(sb);
    st.cam(...cam); st.follow(0, 4); st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if *Drake* coached your little league team?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter(['', 'Apologies to the ball', 'Speech length', 'People crying', 'Games forfeited', 'Wins'][bi], bi === 1 ? String(lt > 4.5 ? 1 : 0) : cnt, NOTE[bi], 'PARODY', bi >= 3); hud.tm('');
    hud.pop(POP[bi] && lt > .5 ? POP[bi] : '', Math.min(1, (lt - .5) * 6));
  } };
}
