// "DON'T SAY BRO" — MrBeast-style dumb competition: 100 hoodie guys in a giant arena, kill feed, ALIVE + BRO counters, bro bubbles, lone winner with the cash case.
import { makeBubble } from './_drake.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, Crowd, Particles, R, clamp, smooth, lerp, wander, attach, dropBounce } = lib;
  const hash = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const M = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .85, metalness: 0 }, o));
  const cnv = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

  // ---------------------------------------------------------------- HUD styling (kept off the top-right corner: the prize chip lives there)
  const css = document.createElement('style'); css.textContent = `
    html body #lab{left:44px!important;top:150px!important;font:900 38px 'Liberation Sans',Arial,sans-serif!important;letter-spacing:7px!important;color:#fff!important;background:#e8252b;border:4px solid #111;padding:2px 20px;opacity:1!important;text-shadow:none!important}
    html body #val{left:40px!important;top:200px!important;font:900 210px/1 'Liberation Sans',Arial,sans-serif!important;color:#fff!important;-webkit-text-stroke:16px #111;paint-order:stroke fill;text-shadow:0 9px 0 #111!important}
    html body #note{left:44px!important;top:432px!important;font:900 46px 'Liberation Sans',Arial,sans-serif!important;letter-spacing:1px!important;text-transform:none!important;font-style:normal!important;color:#ffe23a!important;-webkit-text-stroke:10px #111;paint-order:stroke fill;text-shadow:0 5px 0 #111!important;opacity:1!important;transform-origin:0 50%}
    html body #cap{left:60px!important;right:60px!important;top:1590px!important;font:900 56px/1.1 'Liberation Sans',Arial,sans-serif!important;font-style:normal!important;color:#fff!important;-webkit-text-stroke:9px #000;paint-order:stroke fill;text-shadow:0 5px 0 #000!important}
    html body #pop{font-size:86px!important;top:1400px!important}
    #bfeed{position:absolute;left:44px;top:520px;width:600px;font-family:'Liberation Sans',Arial,sans-serif;pointer-events:none}
    #bfeed div{margin:0 0 7px 0;width:max-content;max-width:600px;background:rgba(18,18,24,.86);border-left:7px solid #e8252b;padding:5px 14px;font-size:30px;font-weight:800;color:#f2f2f6;white-space:nowrap}
    #bfeed b{color:#ffd23f}`; document.head.appendChild(css);
  const feedEl = document.createElement('div'); feedEl.id = 'bfeed'; feedEl.className = 't'; document.body.appendChild(feedEl);

  // ---------------------------------------------------------------- arena
  globalThis.__night = true;
  const st = makeStage({ shadowExtent: 42, fogNear: 140, fogFar: 520, skyTop: 0x070b26, skyMid: 0x18265a, skyBot: 0x3a4c92, fog: 0x1a2554, sunColor: 0xfff0dc, sunDir: [-.25, 1, -.45], sunI: 2.9, hemi: 1.15, hemiSky: 0xbfd0ff, hemiGround: 0x9a7a5a, exposure: 1.18 });
  const S = st.scene;
  const floorTex = cnv(1024, 1536, (g, w, h) => { g.fillStyle = '#d9a35a'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 64) { g.fillStyle = (x / 64) % 2 ? 'rgba(120,70,20,.10)' : 'rgba(255,230,160,.08)'; g.fillRect(x, 0, 64, h); g.fillStyle = 'rgba(90,50,15,.35)'; g.fillRect(x, 0, 2, h); }
    g.strokeStyle = '#f6f2e8'; g.lineWidth = 10; g.strokeRect(70, 70, w - 140, h - 140); g.beginPath(); g.moveTo(70, h / 2); g.lineTo(w - 70, h / 2); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 150, 0, 6.283); g.stroke();
    g.fillStyle = 'rgba(200,30,40,.85)'; g.fillRect(70, 70, w - 140, 120); g.fillRect(70, h - 190, w - 140, 120); g.fillStyle = '#fff'; g.font = '900 90px Liberation Sans'; g.textAlign = 'center'; g.fillText('$100,000', w / 2, 168); g.fillText('$100,000', w / 2, h - 100); });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(72, 106), M(0xffffff, { map: floorTex, roughness: .55, metalness: .05 })); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, -7); floor.receiveShadow = true; S.add(floor);
  const wallM = M(0x2a56b8, { roughness: .9 }), padM = M(0xe8252b, { roughness: .9 });
  const wall = (x, z, w, d) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, 34, d), wallM); m.position.set(x, 17, z); m.receiveShadow = true; S.add(m); const pad = new THREE.Mesh(new THREE.BoxGeometry(w + (d < 2 ? 0 : -.2), 4, d + (d < 2 ? -.2 : 0.4)), padM); pad.position.set(x, 2, z); S.add(pad); };
  wall(0, 47, 76, 2); wall(0, -61, 76, 2); wall(-37, -7, 2, 110); wall(37, -7, 2, 110);
  // bleachers
  for (const sx of [-1, 1]) for (let k = 0; k < 6; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2 + k * 1.2, 100), M(k % 2 ? 0xe8e8ee : 0x2d3f8a)); b.position.set(sx * (31.6 + k * .7), (1.2 + k * 1.2) / 2, -7); b.receiveShadow = true; S.add(b); }
  // hoops on the side walls
  for (const sx of [-1, 1]) for (const hz of [-26, 12]) { const bb = new THREE.Mesh(new THREE.BoxGeometry(.4, 5, 7), M(0xffffff, { roughness: .4 })); bb.position.set(sx * 29.2, 14, hz); S.add(bb); const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, .1, 8, 24), M(0xff6a1a)); ring.rotation.y = Math.PI / 2; ring.position.set(sx * 27.8, 12.4, hz); S.add(ring); }
  // floodlight towers
  for (const sx of [-1, 1]) for (const z of [-54, -30, -6, 18, 40]) { const pole = new THREE.Mesh(new THREE.BoxGeometry(.8, 30, .8), M(0x2a2d38)); pole.position.set(sx * 31.5, 15, z); S.add(pole); const lamp = new THREE.Mesh(new THREE.BoxGeometry(5, 3, .6), M(0xfff6d8, { emissive: 0xfff0c0, emissiveIntensity: 1.6 })); lamp.position.set(sx * 30.6, 31, z); lamp.rotation.y = sx * .6; S.add(lamp); }
  // banner
  const bannerTex = cnv(1600, 800, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#e8252b'); gr.addColorStop(1, '#a8121a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; g.fillRect(0, 0, w, 24); g.fillRect(0, h - 24, w, 24);
    g.textAlign = 'center'; g.font = '900 250px Liberation Sans'; g.lineJoin = 'round'; g.lineWidth = 44; g.strokeStyle = '#111'; g.strokeText("DON'T SAY", w / 2, 270); g.fillStyle = '#fff'; g.fillText("DON'T SAY", w / 2, 270);
    g.font = '900 330px Liberation Sans'; g.strokeText('BRO', w / 2, 560); g.fillStyle = '#ffe23a'; g.fillText('BRO', w / 2, 560);
    g.font = '900 100px Liberation Sans'; g.lineWidth = 22; g.strokeText('LAST ONE WINS $100,000', w / 2, 730); g.fillStyle = '#fff'; g.fillText('LAST ONE WINS $100,000', w / 2, 730); });
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(44, 22), new THREE.MeshBasicMaterial({ map: bannerTex, fog: false })); banner.position.set(0, 21, 45.9); banner.rotation.y = Math.PI; S.add(banner);
  // podium + briefcase
  const pod = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.8, 3.6, 36), M(0xf4f4f8, { roughness: .35 })); pod.position.set(0, 1.8, 24); pod.castShadow = true; pod.receiveShadow = true; S.add(pod);
  const podTop = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, .25, 36), M(0xf2c230, { metalness: .9, roughness: .25 })); podTop.position.set(0, 3.7, 24); S.add(podTop);
  const dollarTex = cnv(256, 180, (g, w, h) => { g.fillStyle = '#1b1d24'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f2c230'; g.lineWidth = 8; g.strokeRect(8, 8, w - 16, h - 16); g.fillStyle = '#f2c230'; g.font = '900 140px Liberation Sans'; g.textAlign = 'center'; g.fillText('$', w / 2, 140); });
  function mkCase(open, sc) {
    const g = new THREE.Group(); const dark = M(0x23262e, { roughness: .35, metalness: .6 }), gold = M(0xf2c230, { metalness: .9, roughness: .25 });
    const shell = new THREE.Mesh(new THREE.BoxGeometry(1.4, .95, .5), dark); shell.castShadow = true; g.add(shell);
    const dec = new THREE.Mesh(new THREE.PlaneGeometry(.9, .63), new THREE.MeshBasicMaterial({ map: dollarTex })); dec.position.set(0, 0, .252); g.add(dec);
    for (const lx of [-.4, .4]) { const l = new THREE.Mesh(new THREE.BoxGeometry(.14, .12, .06), gold); l.position.set(lx, .43, .26); g.add(l); }
    const pivot = new THREE.Group(); pivot.position.set(0, .475, -.25); g.add(pivot);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.4, .07, .5), dark); lid.position.set(0, .035, .25); pivot.add(lid); const lin = new THREE.Mesh(new THREE.BoxGeometry(1.3, .02, .4), M(0x8a1020)); lin.position.set(0, -.005, .25); pivot.add(lin);
    if (open) { pivot.rotation.x = -1.75; const GREEN = M(0x3fb04e, { roughness: .7, emissive: 0x0a3a10, emissiveIntensity: .6 }), BAND = M(0xe9e2c2, { roughness: .8 });
      for (let a = 0; a < 3; a++) for (let b = 0; b < 2; b++) { const br = new THREE.Mesh(new THREE.BoxGeometry(.4, .24, .19), GREEN); br.position.set((a - 1) * .43, .55, -.1 + b * .21); g.add(br); const bd = new THREE.Mesh(new THREE.BoxGeometry(.41, .25, .05), BAND); bd.position.set((a - 1) * .43, .55, -.1 + b * .21); g.add(bd); } }
    else { const h = new THREE.Mesh(new THREE.BoxGeometry(.5, .08, .08), gold); h.position.set(0, .56, 0); g.add(h); for (const hx of [-.22, .22]) { const hh = new THREE.Mesh(new THREE.BoxGeometry(.05, .12, .05), gold); hh.position.set(hx, .52, 0); g.add(hh); } }
    g.scale.setScalar(sc); g.traverse((m) => { if (m.isMesh) m.castShadow = true; }); return g;
  }
  const giant = mkCase(true, 4.2); giant.position.set(0, 3.8 + .475 * 4.2, 24); giant.rotation.y = Math.PI; S.add(giant);
  const caseGlow = new THREE.PointLight(0xffd36a, 60, 40); caseGlow.position.set(0, 10, 21); S.add(caseGlow);
  for (const bx of [-1, 1]) { const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 5.2, 36, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: .13, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); beam.position.set(bx * 5, 20, 24); beam.rotation.z = bx * .18; S.add(beam); }
  const sparkle = new Particles(S, 40, 0xffe27a, .09, { emissive: 0xaa8820 });
  const chadCase = mkCase(false, 1.0); chadCase.matrixAutoUpdate = false; chadCase.visible = false; S.add(chadCase);
  // skillet
  const skillet = new THREE.Group(); { const pan = new THREE.Mesh(new THREE.CylinderGeometry(.42, .38, .09, 24), M(0x1b1b1f, { roughness: .35, metalness: .7 })); pan.position.set(0, 0, 1.0); skillet.add(pan); const hd = new THREE.Mesh(new THREE.BoxGeometry(.1, .07, .62), M(0x2a2a30)); hd.position.set(0, 0, .5); skillet.add(hd); const egg = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .03, 18), M(0xfafafa)); egg.position.set(0, .06, 1.0); skillet.add(egg); const yolk = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 8), M(0xffc41a)); yolk.position.set(0, .1, 1.0); skillet.add(yolk); const glow = new THREE.Mesh(new THREE.CylinderGeometry(.43, .39, .02, 24), M(0xff5a1a, { emissive: 0xff3a00, emissiveIntensity: 1.4 })); glow.position.set(0, -.05, 1.0); skillet.add(glow); skillet.traverse((m) => { if (m.isMesh) m.castShadow = true; }); skillet.matrixAutoUpdate = true; S.add(skillet); }
  const hotFoot = new THREE.Mesh(new THREE.SphereGeometry(.28, 14, 10), M(0xff7a20, { emissive: 0xff4a00, emissiveIntensity: 1.6, transparent: true, opacity: .75 })); hotFoot.visible = false; S.add(hotFoot);
  const steam = new Particles(S, 24, 0xffffff, .16, { rough: 1 });
  // cooking counter (beat 2 set)
  { const tb = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.05, 1.1), M(0xc9ccd4, { metalness: .5, roughness: .4 })); tb.position.set(4.6, .525, 8.8); tb.castShadow = true; tb.receiveShadow = true; S.add(tb); for (const bx of [3.9, 5.3]) { const bn = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .06, 18), M(0x222226)); bn.position.set(bx, 1.08, 8.8); S.add(bn); } const pot = new THREE.Mesh(new THREE.CylinderGeometry(.3, .28, .4, 16), M(0xaab0ba, { metalness: .8, roughness: .3 })); pot.position.set(5.3, 1.3, 8.8); pot.castShadow = true; S.add(pot); }

  // ---------------------------------------------------------------- crowd (100 hoodie guys)
  const crowd = new Crowd(S, 100, 21);
  const HOODS = [0x3a3f4c, 0x1e2a5e, 0xc8352f, 0x20262e, 0x2f7d4a, 0x6a3fa8, 0xe07a2a, 0x7c8493, 0x1b6f9a, 0xa8496e, 0x4a4a52, 0xd9c23a];
  const CAPS = [0xd8362f, 0x1e2a5e, 0x20262e, 0xf2f2f2, 0x2f7d4a, 0xe07a2a, 0x1b6f9a];
  const rc = R(9); const hoodCol = [], capCol = [], hasCap = [];
  for (let i = 0; i < 100; i++) { const o = crowd.p[i]; let hc = HOODS[(rc() * HOODS.length) | 0]; if (i === 0) hc = 0xf2b61e; if (i === 1) hc = 0x1fb5b0; hoodCol.push(hc); capCol.push(CAPS[(rc() * CAPS.length) | 0]); hasCap.push(i > 1 && rc() < .6); const c = new THREE.Color(hc); o.shirt.copy(c); ['torso', 'armL', 'armR'].forEach((k) => crowd.parts[k].setColorAt(i, c)); if (i < 2) o.h = 1; }
  ['torso', 'armL', 'armR'].forEach((k) => (crowd.parts[k].instanceColor.needsUpdate = true));
  const hoodM = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), M(0xffffff), 100), crownM = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), M(0xffffff), 100), billM = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), M(0xffffff), 100);
  [hoodM, crownM, billM].forEach((m) => { m.frustumCulled = false; m.castShadow = true; S.add(m); }); const tc = new THREE.Color();
  for (let i = 0; i < 100; i++) { hoodM.setColorAt(i, tc.set(hoodCol[i]).multiplyScalar(.8)); crownM.setColorAt(i, tc.set(capCol[i])); billM.setColorAt(i, tc.set(capCol[i]).multiplyScalar(.85)); }
  [hoodM, crownM, billM].forEach((m) => (m.instanceColor.needsUpdate = true));
  // finalist brows + sweat
  const browM = M(0x24120a, { roughness: .9 }); const brows = [0, 1, 2, 3].map(() => { const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), browM); m.matrixAutoUpdate = false; m.visible = false; m.castShadow = true; S.add(m); return m; });
  const beads = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), M(0x9fe0ff, { roughness: .1, emissive: 0x2a6a9a, emissiveIntensity: .5 })); m.matrixAutoUpdate = false; m.visible = false; S.add(m); return m; });

  // ---------------------------------------------------------------- effects
  const puff = new Particles(S, 150, 0xffffff, .5, { rough: 1 }), spark = new Particles(S, 130, 0xffe14a, .12, { emissive: 0x8a6a00 });
  const NBILL = 70; const bills = new THREE.InstancedMesh(new THREE.BoxGeometry(.5, .02, .26), M(0x4cbf5a, { emissive: 0x145a20, emissiveIntensity: .7, roughness: .6 }), NBILL); bills.frustumCulled = false; S.add(bills);
  const bubs = []; for (let k = 0; k < 14; k++) { const b = makeBubble(lib, S, 1, .4); b.sp.material.depthTest = false; b.sp.renderOrder = 30; bubs.push(b); }

  // ---------------------------------------------------------------- schedule
  const starts = []; { let c = 0; for (const bt of tl.beats) { starts.push(c); c += bt.dur; } }
  const NB = tl.beats.length; const T = (b, lt) => starts[b] + lt;
  const bOf = (t) => { let k = 0; for (let i = 0; i < NB; i++) if (t >= starts[i]) k = i; return Math.min(k, 5); };
  const deathT = new Array(100).fill(1e9);
  { const L = []; for (let i = 99; i >= 31; i--) if (i < 60 || i > 66) L.push(i); L.forEach((i, k) => (deathT[i] = T(1, .9 + 2.1 * Math.pow(k / (L.length - 1), 1.4)))); [66, 65, 64, 63, 62, 61, 60].forEach((i, k) => (deathT[i] = T(1, 1.0 + k * .06))); deathT[30] = T(1, 3.4);
    deathT[29] = T(2, 2.8); for (let i = 28; i >= 20; i--) deathT[i] = T(2, 3.0 + (28 - i) / 8 * 1.25);
    deathT[19] = T(3, .35); deathT[18] = T(3, 1.05); deathT[17] = T(3, 2.15); for (let k = 0; k < 15; k++) deathT[16 - k] = T(3, 2.7 + 2.3 * Math.pow(k / 14, 1.2));
    deathT[1] = T(5, .3); }
  const deaths = []; for (let i = 0; i < 100; i++) if (deathT[i] < 1e8) deaths.push({ t: deathT[i], i }); deaths.sort((a, b) => a.t - b.t);
  const aliveAt = (t) => { let n = 100; for (const d of deaths) if (d.t <= t) n--; return n; };
  const BROT = T(5, 3.22); const broAt = (t) => { let n = 0; for (const d of deaths) if (d.t <= t) n++; return n + (t >= BROT ? 1 : 0); };
  const NAMES = ['BRAD', 'TREVOR', 'DYLAN', 'JAKE', 'LOGAN', 'TYLER', 'COLE', 'MASON', 'NOAH', 'EVAN', 'XAVI', 'KYLE', 'ZACK', 'DEREK', 'GREG', 'OWEN', 'RYAN', 'CARTER', 'JETT', 'LIAM', 'MILES', 'PETE', 'SETH', 'HUNTER', 'TODD', 'DUANE', 'GAVIN', 'COOPER', 'ELI', 'FINN', 'REX', 'MARCUS', 'TANNER', 'WYATT', 'BEN', 'LUCA', 'DEAN', 'NICK', 'ROSS', 'SHAWN'];
  const names = []; { const seen = {}; for (let i = 0; i < 100; i++) { let n = NAMES[(i * 7 + 3) % NAMES.length]; seen[n] = (seen[n] || 0) + 1; names.push(seen[n] > 1 ? n + ' ' + seen[n] : n); } names[0] = 'CHAD'; names[1] = 'KEVIN'; names[33] = 'DEV'; names[29] = 'TREVOR'; names[30] = 'DYLAN'; }
  const PHR = ['said the word', 'said bro', 'slipped. said bro', 'said "bro" out loud', 'whispered bro', 'said bro by accident', 'coughed. it sounded like bro'];
  const SPECIAL = { 29: 'dropped a pan. said bro', 30: 'did not even know', 1: 'cracked. said bro' };
  const BRO = ['BRO', 'bro?!', 'BROOO', 'oh bro', 'my bad bro', 'bro...', 'BRO!!'];
  const CHAT = ['lol', 'no way', 'nice hoodie', 'so true', 'haha', 'wait what', 'ikr'];

  // ---------------------------------------------------------------- placement per person
  const GRID = (i) => { const gp = (i * 37) % 100; return [((gp % 10) - 4.5) * 3, (((gp / 10) | 0) - 4.5) * 3]; };
  const push = (x, z, discs) => { for (const d of discs) { const dx = x - d[0], dz = z - d[1], dd = Math.hypot(dx, dz); if (dd < d[2]) { const k = d[2] / Math.max(dd, .01); x = d[0] + dx * k; z = d[1] + dz * k; } } return [x, z]; };
  const D1 = [[8, 14, 6], [8, 8.5, 3.5], [-6, 6.5, 4.2]], D2 = [[0, 8, 7.5], [-3, 5.5, 3]], D3 = [[-4.2, 3.8, 3.2], [7, 8.5, 3.4], [.5, 12, 3.6]];
  const H3 = { 19: [-4, 6], 18: [5.5, 11], 17: [-1, 15] };
  function place(i, t) {
    const bi = bOf(t), lt = t - starts[bi]; const o = { x: 0, z: 0, yaw: Math.PI, y: 0, anim: 'idle', speed: 1, extra: 0, arms: null, hs: 1, pitch: 0, vis: t < deathT[i] };
    const sp = 1.7 + (i % 5) * .35, ang = i * 2.1;
    const W = (b) => wander(((i * 37) % 48) - 24, ((i * 53) % 56) - 28, ang, sp, t, b[0], b[1], b[2], b[3]);
    if (bi === 0) { const g = GRID(i); o.x = g[0]; o.z = g[1]; o.yaw = Math.PI + Math.sin(i) * .08; o.anim = lt < 1.8 && i % 3 === 0 ? 'jump' : 'idle'; o.speed = .7 + (i % 4) * .15; if (lt > 3.6 && lt < 4.7) o.extra = .05; }
    else if (bi === 1) {
      if (i >= 60 && i <= 66) { const k = i - 60, a = k / 7 * 6.283; o.x = 8 + Math.cos(a) * 1.7; o.z = 14 + Math.sin(a) * 1.7; o.yaw = Math.atan2(8 - o.x, 14 - o.z); o.speed = .8; if (lt > .9) o.extra = .04; }
      else if (i === 30) { o.x = -6; o.z = 8; o.yaw = Math.PI; o.speed = .6; }
      else { const w = W([-24, 24, -28, 28]); const q = push(w[0], w[1], D1); o.x = q[0]; o.z = q[1]; o.yaw = w[2]; o.anim = 'walk'; o.speed = .9; }
    } else if (bi === 2) {
      const gx = 0, gz = 8;
      if (i === 29) { o.x = gx; o.z = gz; o.yaw = Math.PI;
        if (lt < 1.0) o.arms = { lx: .2 * Math.sin(t * 3), rx: -1.2 + .12 * Math.sin(t * 9) + smooth((lt - .8) / .2) * .9 };
        else if (lt < 1.4) o.arms = { lx: .2, rx: -.3 };
        else { const u = lt - 1.4; o.y = Math.abs(Math.sin(u * 8)) * .5; o.yaw = Math.PI + .55 * Math.sin(u * 7); o.pitch = .15; o.arms = { lx: -2.4 + .5 * Math.sin(t * 14), rx: -2.4 + .5 * Math.sin(t * 14 + 1.5) }; } }
      else if (i >= 20 && i <= 28) { const k = i - 20; o.x = (k - 4) * 1.5; o.z = 12.5 + (k % 2) * 1.3; o.yaw = Math.PI; o.extra = lt > 1.4 ? .03 : 0; o.speed = .7; }
      else { const w = W([-24, 24, -28, 28]); const q = push(w[0], w[1], D2); o.x = q[0]; o.z = q[1]; o.yaw = w[2]; o.anim = 'walk'; o.speed = .9; }
    } else if (bi === 3) {
      if (H3[i]) { o.x = H3[i][0]; o.z = H3[i][1]; o.yaw = Math.PI; o.extra = .04; o.speed = .6; }
      else { const w = W([-12, 12, 0, 22]); const q = push(w[0], w[1], D3); o.x = q[0]; o.z = q[1]; o.yaw = w[2]; o.anim = lt < 2.7 ? 'walk' : 'panic'; o.speed = 1; if (o.anim === 'panic') { o.speed = 1; } }
    } else if (bi === 4) { o.hs = 1.25; if (i === 0) { o.x = -1.6; o.z = 6; o.yaw = Math.PI - .9; } else { o.x = 1.6; o.z = 6; o.yaw = Math.PI + .9; } o.speed = .6; o.extra = .012; }
    else { o.hs = 1.15;
      if (i === 0) { o.x = 0; o.z = 6; o.yaw = Math.PI; o.speed = .8; const u = smooth((lt - .55) / .9), hop = lt > 4.5 ? Math.abs(Math.sin((lt - 4.5) * 6)) * .12 : 0; o.y = hop;
        const lx0 = lt < 4.34 ? lerp(0, -3.0, u) : -.5; o.arms = { rx: lerp(0, -3.0, u), lx: lx0, lz: lt >= 4.34 ? -.9 : 0, rz: 0 }; if (lt >= 4.34) o.arms.lx = -.35 + .08 * Math.sin(t * 5); }
      else { o.x = 2.4; o.z = 6; o.yaw = Math.PI + .4; o.speed = .6; } }
    return o;
  }

  // ---------------------------------------------------------------- cameras
  const CAM = [
    [[0, 0, 36, -55, 0, 7, 6, 54, 0], [1.8, 0, 24, -42, 0, 5, 8, 54, 0],
     [1.8, 0, 6.5, -26, 0, 2.2, -12, 46, 0], [2.6, 0, 2.8, -16.8, 0, 1.9, -13.5, 44, .03],
     [2.6, -2.4, 1.95, -16.3, -1.5, 1.78, -13.5, 33, .1], [3.7, -2.0, 1.95, -15.6, -1.5, 1.78, -13.5, 27, .12],
     [3.7, -13, 2.1, -17.5, -9, 1.8, -13.5, 42, -.1], [4.6, 11, 2.1, -17.5, 8, 1.8, -13.5, 42, .1],
     [4.6, 3, 2.6, -19, 0, 2.4, -13, 50, 0], [8.0, 0, 9.5, 1, 0, 6.0, 24, 44, 0]],
    [[0, 7.8, 1.55, 3.2, 8, 1.65, 14, 52, 0], [1.35, 8.4, 1.7, 7.5, 8, 1.7, 14, 40, .05],
     [1.35, -12, 9, -20, 0, 2, 4, 62, -.06], [2.3, 12, 7, -18, 0, 2, 4, 62, .06],
     [2.3, -6.8, 2.0, 3.9, -6, 1.85, 8, 40, -.04], [4.0, -6.4, 1.95, 5.3, -6, 1.85, 8, 31, 0]],
    [[0, -2.6, 1.45, 4.6, 0, 1.25, 8, 50, .03], [.9, -2.0, 1.5, 5.2, 0, 1.2, 8, 46, 0],
     [.9, 1.4, .65, 6.0, -.1, .3, 7.7, 40, -.1], [1.9, .9, .7, 6.4, -.1, .3, 7.7, 34, -.12],
     [1.9, 0, 1.75, 5.3, 0, 1.75, 8, 36, .1], [2.9, 0, 1.8, 6.0, 0, 1.78, 8, 31, .12],
     [2.9, -9, 5.5, 1.0, 0, 2, 11, 60, -.05], [4.67, -4, 4.2, 0, 0, 2, 11, 60, .05]],
    [[0, -4.8, 1.85, 1.7, -4, 1.75, 6, 38, .1], [.72, -4.4, 1.85, 2.6, -4, 1.75, 6, 30, .14],
     [.72, 8.2, 2.0, 6.0, 5.5, 1.75, 11, 38, -.12], [1.82, 7.2, 1.95, 6.8, 5.5, 1.75, 11, 30, -.16],
     [1.82, 2.2, 1.85, 10.0, -1, 1.75, 15, 36, .08], [3.2, 1.2, 2.3, 8.0, -1, 1.75, 15, 52, .22],
     [3.2, -7, 3.2, -3, 0, 2.2, 12, 64, -.12], [5.34, 6, 5.5, -5, 0, 2.5, 12, 60, .16]],
    [[0, 0, 1.35, .2, 0, 1.5, 6, 52, .1], [.8, 0, 1.5, 1.8, 0, 1.55, 6, 46, .06],
     [.8, -.7, 1.85, 3.4, -1.6, 1.8, 6, 34, .06], [1.5, -.9, 1.85, 3.9, -1.6, 1.82, 6, 26, .1],
     [1.5, .7, 1.85, 3.4, 1.6, 1.8, 6, 34, -.06], [2.3, .9, 1.85, 3.9, 1.6, 1.82, 6, 26, -.1],
     [2.3, -.55, 1.9, 4.3, -1.6, 1.88, 6, 22, .12], [2.8, -.5, 1.9, 4.6, -1.6, 1.88, 6, 18, .14],
     [2.8, .55, 1.9, 4.3, 1.6, 1.88, 6, 22, -.12], [3.34, .5, 1.9, 4.6, 1.6, 1.88, 6, 18, -.14]],
    [[0, 0, 1.7, .6, 1.2, 1.6, 6, 54, .05], [.6, 0, 1.6, 1.4, .8, 1.6, 6, 50, 0],
     [.6, 0, .9, 1.8, 0, 1.9, 6, 52, 0], [1.5, 0, 1.5, 2.3, 0, 2.3, 6, 46, 0],
     [1.5, 0, 1.85, 3.3, 0, 1.8, 6, 30, 0], [3.0, 0, 1.85, 4.0, 0, 1.85, 6, 26, 0],
     [3.0, 0, 2.3, -.3, 0, 2.7, 6, 48, .04], [4.34, 0, 2.3, .6, 0, 2.9, 6, 44, -.04],
     [4.34, 0, 1.3, 1.5, 0, 2.5, 6, 52, 0], [6.0, 0, 2.5, -.2, 0, 2.3, 6, 46, 0]]];
  const kf = (K, lt) => { let i = 0; while (i < K.length - 1 && lt >= K[i + 1][0]) i++; const a = K[i], b = K[Math.min(i + 1, K.length - 1)]; if (b === a || b[0] <= a[0]) return a.slice(1, 9); const u = smooth(clamp((lt - a[0]) / (b[0] - a[0]))); return a.slice(1, 9).map((v, j) => lerp(v, b[j + 1], u)); };
  const shakeAt = (lt, t0, amp, dur = .4) => { const d = lt - t0; return d < 0 || d > dur ? 0 : amp * (1 - d / dur); };

  // ---------------------------------------------------------------- frame
  const V = new THREE.Vector3(), M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), SC = new THREE.Vector3(), E = new THREE.Euler(), DUM = new THREE.Object3D();
  const POP = [[[2.55, 4.3, "DON'T SAY BRO"], [5.2, 8, '$100,000 PRIZE']], [[.1, 1.4, 'MINUTE ONE'], [1.4, 4, 'THEY DID NOT KNOW']], [[0, 1.4, 'HOT PAN'], [1.4, 2.5, 'OUCH'], [2.5, 5, 'HE SAID IT']], [[0, 3.2, 'BRO. BRO. BRO.'], [3.2, 6, 'DROPPING FAST']], [[0, 1.4, 'TWO LEFT'], [1.4, 2.4, 'NO WORDS'], [2.4, 4, 'EYEBROWS ONLY']], [[0, 1.5, 'CHAD WINS'], [1.5, 3.1, 'UH OH'], [3.1, 4.3, 'BRO'], [4.3, 7, 'HE WINS ANYWAY']]];
  return { frame({ t, bi, lt }) {
    bi = Math.min(bi, 5);
    // camera
    let c = kf(CAM[bi], lt); let sk = 0;
    if (bi === 2) sk = shakeAt(lt, 1.4, .14); if (bi === 3) sk = Math.max(shakeAt(lt, .35, .1), shakeAt(lt, 1.05, .1), shakeAt(lt, 2.15, .1)); if (bi === 5) sk = shakeAt(lt, 3.22, .07, .6); if (bi === 0) sk = shakeAt(lt, 3.66, .06, .6);
    if (sk) { c = c.slice(); c[0] += Math.sin(t * 91) * sk; c[1] += Math.cos(t * 83) * sk; }
    st.cam(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7]); st.follow(lerp(c[0], c[3], .5), lerp(c[2], c[5], .5));
    const CP = new THREE.Vector3(c[0], c[1], c[2]);
    // faces
    const shock = (bi === 0 && lt > 3.6 && lt < 4.8) || (bi === 1 && lt > .95) || (bi === 2 && lt > 1.3) || bi === 3 || (bi === 5 && lt > 1.9 && lt < 4.3); crowd.setFace(shock ? 'shock' : 'calm');
    // people
    const bl = [];
    for (let i = 0; i < 100; i++) { const o = crowd.p[i], pl = place(i, t); o.x = pl.x; o.z = pl.z; o.y = pl.y; o.yaw = pl.yaw; o.anim = pl.anim; o.speed = pl.speed; o.extra = pl.extra; o.arms = pl.arms; o.hs = pl.hs; o.pitch = pl.pitch; o.vis = pl.vis; if (!o.vis) continue;
      const hy = o.y + 2.0 * o.h * (pl.hs > 1 ? 1.12 : 1);
      const dd = deathT[i] - t; const big = (i === 29 || H3[i] || i === 1 || i === 30) ? 2.0 : 1;
      if (dd > 0 && dd < .55) bl.push({ text: BRO[(i * 5) % BRO.length], x: o.x, y: hy, z: o.z, pri: big > 1 ? 4 : 2, big, d: CP.distanceTo(V.set(o.x, hy, o.z)) });
      else if (bi === 1 && i >= 60 && i <= 66 && lt < .95 && ((t * 1.1 + (i - 60) * .43) % 1) < .55) bl.push({ text: CHAT[(Math.floor(t * 1.1 + (i - 60) * .43) + i) % CHAT.length], x: o.x, y: hy, z: o.z, pri: 1, big: 1, d: CP.distanceTo(V.set(o.x, hy, o.z)) });
    }
    crowd.update(t);
    // hoods + caps
    for (let i = 0; i < 100; i++) { const o = crowd.p[i]; const on = o.vis; const hs = o.hs;
      if (on) { M4.copy(o.M.torso); V.set(0, .34, -.14); SC.set(.52, .2, .22); M4.multiply(new THREE.Matrix4().compose(V, Q.identity(), SC)); hoodM.setMatrixAt(i, M4); } else { M4.makeScale(0, 0, 0); hoodM.setMatrixAt(i, M4); }
      if (on && hasCap[i]) { M4.copy(o.M.head); V.set(0, .27 * hs, -.01 * hs); SC.set(.5 * hs, .13 * hs, .5 * hs); crownM.setMatrixAt(i, M4.clone().multiply(new THREE.Matrix4().compose(V, Q.identity(), SC)));
        V.set(0, .2 * hs, .31 * hs); E.set(.12, 0, 0); Q.setFromEuler(E); SC.set(.42 * hs, .03 * hs, .3 * hs); billM.setMatrixAt(i, M4.clone().multiply(new THREE.Matrix4().compose(V, Q, SC))); Q.identity(); }
      else { M4.makeScale(0, 0, 0); crownM.setMatrixAt(i, M4); billM.setMatrixAt(i, M4); } }
    hoodM.instanceMatrix.needsUpdate = crownM.instanceMatrix.needsUpdate = billM.instanceMatrix.needsUpdate = true;
    // brows + sweat on finalists
    const fin = bi === 4 ? [0, 1] : bi === 5 ? [0] : []; brows.forEach((m) => (m.visible = false)); beads.forEach((m) => (m.visible = false));
    fin.forEach((fi, k) => { const o = crowd.p[fi], hs = o.hs; for (const s of [-1, 1]) { const m = brows[k * 2 + (s < 0 ? 0 : 1)]; const w = Math.sin(t * 13 + (s > 0 ? 1.6 : 0) + k * 1.1) * (bi === 4 && lt > 1.4 ? 1 : .35); V.set(s * .085 * hs, (.085 + .035 * w) * hs, .24 * hs); E.set(0, 0, s * (.18 + .3 * w)); Q.setFromEuler(E); SC.set(.17 * hs, .05 * hs, .04 * hs); m.matrix.copy(o.M.head).multiply(new THREE.Matrix4().compose(V, Q, SC)); m.matrixWorldNeedsUpdate = true; m.visible = true; }
      const b = beads[k]; const u = ((t * .8 + k * .4) % 1); V.set(.2 * hs, (.12 - u * .3) * hs, .17 * hs); SC.set(.02 * hs, .035 * hs, .02 * hs); b.matrix.copy(o.M.head).multiply(new THREE.Matrix4().compose(V, Q.identity(), SC)); b.matrixWorldNeedsUpdate = true; b.visible = bi === 4 && lt > .7; });
    // bubbles
    if (bi === 5) { const o = crowd.p[0]; if (t >= BROT && lt < 5.6) { const hy = o.y + 2.0 * o.h * 1.15; bl.push({ text: 'BRO', x: o.x, y: hy + .1, z: o.z, pri: 9, big: 3.3, d: CP.distanceTo(V.set(o.x, hy, o.z)) }); } }
    bl.sort((a, b) => b.pri - a.pri || a.d - b.d);
    for (let k = 0; k < bubs.length; k++) { const b = bl[k]; if (!b) { bubs[k].hide(); continue; } const f = clamp(b.d * .11, .3, 5) * b.big; bubs[k].show(b.text, b.x, b.y + .22 * f + .1, b.z); const pop = 1 + .12 * Math.sin(t * 22 + k); bubs[k].sp.scale.set(1 * f * pop, .4 * f * pop, 1); }
    // poofs
    puff.clear(); spark.clear(); let pi = 0, si = 0;
    for (const d of deaths) { const dt = t - d.t; if (dt < 0 || dt > .55) continue; const pl = place(d.i, d.t); const u = dt / .55; const pk = clamp(CP.distanceTo(V.set(pl.x, 1.5, pl.z)) / 8, .22, 1);
      for (let k = 0; k < 3 && pi < puff.n; k++) { const a = k * 2.1 + d.i; puff.set(pi++, pl.x + Math.cos(a) * .5 * u, 1 + u * 1.2 + k * .25, pl.z + Math.sin(a) * .5 * u, (.6 + u * 1.5) * (1 - u * .9) * pk); }
      for (let k = 0; k < 4 && si < spark.n; k++) { const a = k * 1.57 + d.i * 3.1; spark.set(si++, pl.x + Math.cos(a) * 1.4 * u, 1.2 + u * 1.6 - u * u * 1.8 + k * .1, pl.z + Math.sin(a) * 1.4 * u, 1 - u); } }
    puff.done(); spark.done();
    // skillet scene
    skillet.visible = bi === 2; hotFoot.visible = false; steam.clear();
    if (bi === 2) { const gx = 0, gz = 8, g = crowd.p[29];
      if (lt < 1.0) { attach(skillet, g, 'handR', [0, .02, .05], [1.2 - smooth((lt - .8) / .2) * .9 + .0, 0, 0]); skillet.matrixAutoUpdate = false; }
      else { skillet.matrixAutoUpdate = true; const tt = lt - 1.0; const sx = gx - .4, sz = gz - 1.195; const ex = gx - .1, ez = gz - .55; const fall = dropBounce(.77, 0, tt, .38); const k = smooth(clamp(tt / .4)); const cx = lerp(sx, ex, k), cz = lerp(sz, ez, k); skillet.position.set(cx, Math.max(.05, fall.y), cz + 1.0); skillet.rotation.set(0, Math.PI, fall.settled ? 0 : Math.sin(tt * 9) * .25 * (1 - tt / 1.5)); skillet.scale.setScalar(1); skillet.updateMatrix(); }
      if (lt > 1.38) { const u = lt - 1.38; hotFoot.visible = true; hotFoot.position.set(gx - .13, .15 + Math.abs(Math.sin(u * 10)) * .5 * (g.y > 0 ? 1 : 0), gz - .1); hotFoot.scale.setScalar(.8 + .3 * Math.sin(u * 20)); }
      for (let k = 0; k < 24; k++) { const u = ((t * .9 + k * .043) % 1); steam.set(k, gx - .1 + Math.sin(k * 3) * .25 * u, .3 + u * 1.8, gz - .9 + Math.cos(k * 2) * .2 * u, lt > 1.38 ? (1 - u) * .5 : 0); } }
    steam.done();
    // chad's case
    chadCase.visible = bi === 5 && lt > .5; giant.visible = bi <= 4 || lt < .0;
    if (chadCase.visible) { const o = crowd.p[0]; const u = smooth((lt - .55) / .9); const hp = V.setFromMatrixPosition(o.M.head); const tx = hp.x, ty = hp.y + .85, tz = hp.z; const px = lerp(1.1, tx, u), py = lerp(.5, ty, u), pz = lerp(5.6, tz, u); DUM.position.set(px, py, pz); DUM.rotation.set(0, Math.PI, Math.sin(t * 6) * .04 * u); DUM.scale.setScalar(1.0 + .0 * u); DUM.updateMatrix(); chadCase.matrix.copy(DUM.matrix); chadCase.matrixWorldNeedsUpdate = true; }
    // sparkles + bills
    for (let k = 0; k < 40; k++) { const a = t * .8 + k * 2.4, r = 3.6 + (k % 5) * .35; sparkle.set(k, Math.cos(a) * r, 5.5 + ((t * .6 + k * .17) % 1) * 7, 24 + Math.sin(a) * r * .6, bi === 0 || bi === 4 ? .8 : 0); } sparkle.done();
    const bm = (bi === 0 && lt > 5.2) ? 1 : (bi === 5 && lt > 3.0) ? 2 : 0;
    for (let k = 0; k < NBILL; k++) { if (!bm) { M4.makeScale(0, 0, 0); bills.setMatrixAt(k, M4); continue; } const u = ((t * (bm === 1 ? .7 : .45) + k / NBILL) % 1), h1 = hash(k), h2 = hash(k + 9), h3 = hash(k + 31);
      if (bm === 1) DUM.position.set((h1 - .5) * 9 * u, 8.2 + 11 * u * (1 - u) * 1.7 * (.6 + h3) - 0 * u, 21 + (h2 - .2) * -7 * u); else DUM.position.set((h1 - .5) * 8, 9 - 9.5 * u, 6 + (h2 - .5) * 4);
      DUM.rotation.set(t * 3 + k, t * 4 + k * 2, t * 2); DUM.scale.setScalar(1); DUM.updateMatrix(); bills.setMatrixAt(k, DUM.matrix); }
    bills.instanceMatrix.needsUpdate = true;
    st.render();
    // HUD
    const al = aliveAt(t), bro = broAt(t);
    hud.question('', 0); hud.counter('ALIVE', String(al), 'BRO COUNTER: ' + bro, '', false);
    const noteEl = document.getElementById('note'); let pulse = 1; for (const d of deaths) { const dt = t - d.t; if (dt >= 0 && dt < .2) pulse = Math.max(pulse, 1.18 - dt); } if (t >= BROT && t < BROT + .25) pulse = 1.3; noteEl.style.transform = `scale(${pulse})`;
    document.getElementById('val').style.transform = `scale(${1 + (al < 100 && deaths.some((d) => t - d.t >= 0 && t - d.t < .15) ? .06 : 0)})`; document.getElementById('val').style.transformOrigin = '0 50%';
    const recent = deaths.filter((d) => t - d.t >= 0 && t - d.t < 2.4).slice(-5); feedEl.innerHTML = recent.map((d) => `<div style="opacity:${clamp(1.1 - (t - d.t) / 2.4 + .2)}"><b>${names[d.i]}</b> ${SPECIAL[d.i] || PHR[(d.i * 3) % PHR.length]}</div>`).join('');
    let pt = ''; for (const q of POP[bi]) if (lt >= q[0] && lt < q[1]) pt = q[2]; hud.pop(pt, 1);
  } };
}
