import { makeBubble } from './_drake.js';
// What if every burp was twice as loud? Hook: frame one is the climax (tower mid-collapse, shockwave, HUD question).
// Beats: 0 hook, 1 grandma, 2 pigeon+letter, 3 phone/wifi/Kyle, 4 building+mayor (DAVE), 5 ocean+fish, 6 sun+scientists, 7 Earth/Moon.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, buildEarth, building, addBox, mat, Crowd, Particles, R, clamp, smooth, lerp, attach } = lib;
  const DB = [120, 40, 67, 93, 120, 147, 173, 200], NUM = [13, 1, 5, 9, 13, 17, 21, 25];
  const NOTE = ['', 'a polite burp', 'one pigeon, gone', 'phone cracked. wifi gone', 'a building left', 'the ocean left', 'the sun is flickering', 'earth reversed. moon cracked'];
  const POP = ['', 'EXCUSE YOU', 'A LETTER', 'WHO BURPED', 'DAVE', 'WAS THAT A BURP', 'THEY LOOK AT YOU', 'THE MOON'], POPT = [0, 3.5, 5.1, 6.0, 7.0, 5.0, 5.12, 7.3];
  const starts = []; { let c = 0; for (const b of tl.beats) { starts.push(c); c += b.dur; } }
  const col = (crowd, i, ks, c) => ks.forEach((k) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; });
  const V = new THREE.Vector3(), V2 = new THREE.Vector3();
  const hp = (o, k, out = V) => out.setFromMatrixPosition(o.M[k]);
  const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return { c, g, t, w, h }; };
  const easeIn = (u) => u * u, easeOut = (u) => 1 - (1 - u) * (1 - u);

  // ---------------------------------------------------------------- stage A: town + beach
  const A = makeStage({ shadowExtent: 42, fogNear: 150, fogFar: 600, sunDir: [-.45, .55, .7], sunI: 2.8 }); const SA = A.scene;
  const city = buildStreet(SA, { seed: 4 });
  const BX = 500; // beach offset
  const crowd = new Crowd(SA, 10, 12); const P = crowd.p;
  const [HERO, GRAN, KYLE, MAYOR, SC1, SC2, SC3] = P;
  col(crowd, 0, ['torso', 'armL', 'armR'], 0x2f9e44); col(crowd, 0, ['legL', 'legR'], 0x23293a); col(crowd, 0, ['hair'], 0x4a2f1c);
  col(crowd, 1, ['torso', 'armL', 'armR'], 0x9a6aa8); col(crowd, 1, ['legL', 'legR'], 0x6b5b6b); col(crowd, 1, ['hair'], 0xdcdcdc); col(crowd, 1, ['head', 'neck', 'handL', 'handR'], 0xf1c9a5);
  col(crowd, 2, ['torso', 'armL', 'armR'], 0xe8c030); col(crowd, 2, ['legL', 'legR'], 0x2c3e6b); col(crowd, 2, ['hair'], 0xb5532a);
  col(crowd, 3, ['torso', 'armL', 'armR'], 0x1e2a44); col(crowd, 3, ['legL', 'legR'], 0x1e2a44); col(crowd, 3, ['hair'], 0x8a8a8a);
  [4, 5, 6].forEach((i) => { col(crowd, i, ['torso', 'armL', 'armR'], 0xf6f6f8); col(crowd, i, ['legL', 'legR'], 0x3a3f4b); col(crowd, i, ['hair'], [0x2b1d14, 0x101010, 0x6a4a2a][i - 4]); });
  const heroProps = (S) => { const hood = addBox(S, 0, 0, 0, .56, .36, .2, 0x2f9e44, { round: .08 }), pocket = addBox(S, 0, 0, 0, .4, .16, .05, 0x27853a, { cast: false }), s1 = addBox(S, 0, 0, 0, .025, .22, .025, 0xf4f4f0, { cast: false }), s2 = addBox(S, 0, 0, 0, .025, .22, .025, 0xf4f4f0, { cast: false }); return { hood, pocket, s1, s2, all: [hood, pocket, s1, s2], update(o) { attach(hood, o, 'torso', [0, .42, -.2]); attach(pocket, o, 'torso', [0, -.17, .165]); attach(s1, o, 'head', [-.07, -.34, .2]); attach(s2, o, 'head', [.07, -.34, .2]); } }; };
  const hpA = heroProps(SA);
  // grandma cane, scientist clipboards
  const cane = addBox(SA, 0, 0, 0, .05, 1.0, .05, 0x6b4a2a, { cast: true }); const hook = addBox(SA, 0, 0, 0, .05, .05, .2, 0x6b4a2a);
  const shawl = addBox(SA, 0, 0, 0, .66, .12, .38, 0xd9a0c8, { round: .04 });
  const clip = [0, 1, 2].map(() => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(.34, .44, .03), mat(0xb98a54)); const pp = new THREE.Mesh(new THREE.BoxGeometry(.28, .38, .01), mat(0xfafafa)); pp.position.z = .02; g.add(b, pp); g.traverse((m) => (m.castShadow = true)); SA.add(g); return g; });
  const suit = [addBox(SA, 0, 0, 0, .2, .5, .03, 0xc23a3a, { cast: false })]; // mayor tie
  // bubbles
  const bub = { hero: makeBubble(lib, SA, 1.7, .64), gran: makeBubble(lib, SA, 1.9, .71), kyle: makeBubble(lib, SA, 1.7, .64), fish: makeBubble(lib, SA, 2.3, .86), sci: makeBubble(lib, SA, 2.1, .78), sorryA: makeBubble(lib, SA, 1.4, .52) };
  // shockwave set
  const mkWave = (S) => { const sph = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), new THREE.MeshBasicMaterial({ color: 0x66ff88, transparent: true, opacity: .2, depthWrite: false, side: THREE.DoubleSide, fog: false })); const mk = () => new THREE.Mesh(new THREE.TorusGeometry(1, .05, 8, 96), new THREE.MeshBasicMaterial({ color: 0x9dffb0, transparent: true, opacity: .8, depthWrite: false, fog: false })); const rg = mk(), rv = mk(), rg2 = mk(); rg.rotation.x = rg2.rotation.x = Math.PI / 2; [sph, rg, rv, rg2].forEach((m) => { m.visible = false; m.renderOrder = 5; S.add(m); });
    return { set(c, r, Rmax, camD) { const on = r > .05 && r < Rmax * 1.02; const f = clamp(1 - r / Rmax); sph.visible = rg.visible = rv.visible = rg2.visible = on; if (!on) return; const op = Math.pow(f, .6); sph.position.set(c[0], c[1], c[2]); sph.scale.setScalar(r); sph.material.opacity = .15 * op * (r > camD * .8 ? .25 : 1); rg.position.set(c[0], .2, c[2]); rg.scale.setScalar(r); rg.material.opacity = .85 * op; rg2.position.set(c[0], .2, c[2]); rg2.scale.setScalar(r * .72); rg2.material.opacity = .55 * op; rv.position.set(c[0], c[1], c[2]); rv.scale.setScalar(r); rv.material.opacity = .9 * op; } , off() { sph.visible = rg.visible = rv.visible = rg2.visible = false; } }; };
  const waveA = mkWave(SA);
  const cloud = new Particles(SA, 14, 0x9bff7a, .13, { emissive: 0x3a9a2a, rough: .8 });
  const dust = new Particles(SA, 90, 0xcfc8b8, .7, { rough: 1 }); const chunks = new Particles(SA, 60, 0x9a8f80, .22, { rough: 1, cast: true });
  const rr = R(7); const CH = []; for (let i = 0; i < 60; i++) CH.push({ a: (rr() - .5) * 1.4, vx: 2 + rr() * 8, vy: 4 + rr() * 9, vz: (rr() - .5) * 6, y0: rr() * 3, s: .6 + rr() * 1.4 });
  const DU = []; for (let i = 0; i < 90; i++) DU.push({ a: rr() * 6.28, d: rr() * 7, up: 1 + rr() * 4, s: .8 + rr() * 1.3, dl: rr() * .6 });

  // tower
  const TZ = 34, TH = 16, TPX = -3.5; const towerG = new THREE.Group(); towerG.position.set(TPX, 0, TZ); SA.add(towerG);
  { const m = building(SA, 0, 0, 5.4, TH, 5.4, 0xc9d3dc, 9); towerG.add(m); m.position.set(-2.7, TH / 2, 0); const roof = addBox(SA, 0, 0, 0, 3.4, 1.6, 3.4, 0x8d9aa8); towerG.add(roof); roof.position.set(-2.7, TH + .8, 0); const ant = addBox(SA, 0, 0, 0, .12, 3, .12, 0x555a66); towerG.add(ant); ant.position.set(-2.7, TH + 3, 0); }
  // street clutter near scene: hide cars close to camera path
  city.cars.forEach((c) => { c.m.visible = false; });
  // pole + pigeon
  const POLE = { x: -1.9, z: 15.5, h: 4.4 }; const poleM = addBox(SA, POLE.x, POLE.h / 2, POLE.z, .16, POLE.h, .16, 0x3b3f46); const lampM = addBox(SA, POLE.x, POLE.h + .05, POLE.z, .5, .12, .5, 0x3b3f46);
  const pigeon = new THREE.Group(); { const g = (w, h, d, c, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)); m.position.set(x, y, z); m.castShadow = true; pigeon.add(m); return m; };
    g(.4, .28, .62, 0x8f95a3, 0, 0, 0); g(.22, .22, .22, 0x6d7384, 0, .22, .3); g(.24, .12, .2, 0x7a4a9a, 0, .1, .22); g(.06, .05, .12, 0xf0a030, 0, .2, .46); g(.3, .05, .2, 0x6d7384, 0, 0, -.38);
    const eye = g(.04, .04, .04, 0x111111, .09, .27, .4); const eye2 = g(.04, .04, .04, 0x111111, -.09, .27, .4);
    pigeon.wl = new THREE.Group(); pigeon.wr = new THREE.Group(); const wm = (sx) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.6, .04, .34), mat(0x7b8190)); m.position.x = sx * .3; m.castShadow = true; return m; }; pigeon.wl.add(wm(1)); pigeon.wr.add(wm(-1)); pigeon.wl.position.set(.18, .1, 0); pigeon.wr.position.set(-.18, .1, 0); pigeon.add(pigeon.wl, pigeon.wr); pigeon.scale.setScalar(1.7); SA.add(pigeon); }
  const feathers = []; for (let i = 0; i < 8; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(.2, .01, .07), mat(0xf2f2f2)); SA.add(f); feathers.push(f); }
  const letterT = canvasTex(256, 176, (g, w, h) => { g.fillStyle = '#f6efe0'; g.fillRect(0, 0, w, h); g.strokeStyle = '#b8a888'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); g.beginPath(); g.moveTo(4, 4); g.lineTo(w / 2, h * .58); g.lineTo(w - 4, 4); g.stroke(); g.fillStyle = '#c23a3a'; g.fillRect(w - 66, h - 64, 46, 46); g.fillStyle = '#fff'; g.font = '800 26px Liberation Sans, Arial'; g.fillText('PO', w - 62, h - 32); g.fillStyle = '#444'; g.font = 'italic 24px Liberation Sans, Arial'; g.fillText('Dear Human,', 22, h - 40); });
  const letter = new THREE.Mesh(new THREE.PlaneGeometry(.62, .43), new THREE.MeshBasicMaterial({ map: letterT.t, side: THREE.DoubleSide })); SA.add(letter);
  // phone + wifi
  const phoneCache = {}; const phoneTex = canvasTex(256, 448, () => {}); let phoneKey = '';
  const drawPhone = (crack, wifi) => { const k = crack + '|' + wifi; if (k === phoneKey) return; phoneKey = k; const g = phoneTex.g; g.clearRect(0, 0, 256, 448); const gr = g.createLinearGradient(0, 0, 0, 448); gr.addColorStop(0, '#2b4a8a'); gr.addColorStop(1, '#6a3a8a'); g.fillStyle = gr; g.fillRect(0, 0, 256, 448); g.fillStyle = '#fff'; g.font = '700 70px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('9:41', 128, 120);
    if (wifi) { g.strokeStyle = '#fff'; g.lineWidth = 14; g.lineCap = 'round'; for (let i = 1; i <= 3; i++) { g.beginPath(); g.arc(128, 330, i * 36, -Math.PI * .75, -Math.PI * .25); g.stroke(); } g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 330, 10, 0, 7); g.fill(); } else { g.fillStyle = '#ffd0d0'; g.font = '700 34px Liberation Sans, Arial'; g.fillText('No Wi-Fi', 128, 300); g.fillStyle = '#fff'; g.font = '700 26px Liberation Sans, Arial'; g.fillText('(it left)', 128, 340); }
    if (crack > 0) { const rs = R(5); const cx = 150, cy = 210; const n = 11; g.lineCap = 'round'; for (let pass = 0; pass < 2; pass++) { g.strokeStyle = pass ? 'rgba(255,255,255,.95)' : 'rgba(10,10,20,.9)'; g.lineWidth = pass ? 2.5 : 6; for (let i = 0; i < n; i++) { const a = i / n * 6.283 + (rs() - .5) * .3; let x = cx, y = cy; g.beginPath(); g.moveTo(x, y); const len = (160 + rs() * 220) * crack; const segs = 9; for (let s = 1; s <= segs; s++) { const d = len * s / segs; const aa = a + (rs() - .5) * .35; x = cx + Math.cos(aa) * d; y = cy + Math.sin(aa) * d; g.lineTo(x, y); } g.stroke(); } if (pass === 0) rs.call || 0; }
      g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2; const r2 = R(9); for (let ring = 1; ring <= 4; ring++) { const rad = ring * 38 * crack; g.beginPath(); for (let s = 0; s <= 14; s++) { const a = s / 14 * 6.283, rd = rad * (.85 + r2() * .3); const x = cx + Math.cos(a) * rd, y = cy + Math.sin(a) * rd; s ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      if (crack > .3) { g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + 90, cy - 70); g.lineTo(cx + 120, cy + 30); g.fill(); } }
    phoneTex.t.needsUpdate = true; };
  const phone = new THREE.Group(); { const body = new THREE.Mesh(new THREE.BoxGeometry(.36, .62, .05), mat(0x15151a, { roughness: .3 })); body.castShadow = true; const scr = new THREE.Mesh(new THREE.PlaneGeometry(.33, .58), new THREE.MeshBasicMaterial({ map: phoneTex.t })); scr.position.z = .028; phone.add(body, scr); SA.add(phone); }
  const wifiT = canvasTex(160, 160, (g) => { g.fillStyle = '#2b7fe0'; g.beginPath(); g.arc(80, 80, 76, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 11; g.lineCap = 'round'; for (let i = 1; i <= 3; i++) { g.beginPath(); g.arc(80, 112, i * 24, -Math.PI * .75, -Math.PI * .25); g.stroke(); } g.fillStyle = '#fff'; g.beginPath(); g.arc(80, 112, 7, 0, 7); g.fill(); });
  const wifi = new THREE.Group(); { const ic = new THREE.Mesh(new THREE.PlaneGeometry(.7, .7), new THREE.MeshBasicMaterial({ map: wifiT.t, transparent: true, side: THREE.DoubleSide })); const sc = new THREE.Mesh(new THREE.BoxGeometry(.3, .22, .1), mat(0x8a5a2a)); sc.position.set(.2, -.45, 0); const hd = new THREE.Mesh(new THREE.BoxGeometry(.12, .05, .04), mat(0x4a2a12)); hd.position.set(.2, -.31, 0); wifi.add(ic, sc, hd); SA.add(wifi); }
  // podium + statement board (mayor)
  const podium = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.25, .7), mat(0x7a5634)); b.position.y = .62; b.castShadow = true; const top = new THREE.Mesh(new THREE.BoxGeometry(1.35, .08, .85), mat(0x5a3d22)); top.position.y = 1.28; const mic = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .5, 6), mat(0x222222)); mic.position.set(0, 1.55, .15); const mh = new THREE.Mesh(new THREE.SphereGeometry(.06, 8, 6), mat(0x222222)); mh.position.set(0, 1.82, .15); const seal = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .02, 20), mat(0xd8b040, { metalness: .6, roughness: .3 })); seal.rotation.x = Math.PI / 2; seal.position.set(0, .7, .36); podium.add(b, top, mic, mh, seal); SA.add(podium); }
  const boardT = canvasTex(512, 320, () => {}); let boardKey = null;
  const drawBoard = (txt) => { if (txt === boardKey) return; boardKey = txt; const g = boardT.g; g.fillStyle = '#fbfaf4'; g.fillRect(0, 0, 512, 320); g.strokeStyle = '#1e2a44'; g.lineWidth = 10; g.strokeRect(5, 5, 502, 310); g.fillStyle = '#1e2a44'; g.font = '800 30px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('OFFICIAL STATEMENT', 256, 58); g.fillRect(60, 74, 392, 4); g.fillStyle = txt === 'DAVE' ? '#b01818' : '#555'; g.font = '900 ' + (txt === 'DAVE' ? 150 : 60) + 'px Liberation Sans, Arial'; g.fillText(txt, 256, txt === 'DAVE' ? 230 : 200); boardT.t.needsUpdate = true; };
  const board = new THREE.Group(); { const pl = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.06), new THREE.MeshBasicMaterial({ map: boardT.t })); const fr = new THREE.Mesh(new THREE.BoxGeometry(1.78, 1.14, .06), mat(0x3a2a1a)); fr.position.z = -.04; const l1 = new THREE.Mesh(new THREE.BoxGeometry(.06, 1.6, .06), mat(0x3a2a1a)); l1.position.set(-.5, -1.1, -.1); l1.rotation.z = .12; const l2 = l1.clone(); l2.position.x = .5; l2.rotation.z = -.12; board.add(fr, pl, l1, l2); SA.add(board); }
  // beach
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(700, 900), new THREE.MeshStandardMaterial({ color: 0xe6d3a8, roughness: 1 })); sand.rotation.x = -Math.PI / 2; sand.position.set(BX, .05, 200); sand.receiveShadow = true; SA.add(sand);
  const wet = new THREE.Mesh(new THREE.PlaneGeometry(400, 10), new THREE.MeshStandardMaterial({ color: 0xb59d76, roughness: .8 })); wet.rotation.x = -Math.PI / 2; wet.position.y = .07; wet.receiveShadow = true; SA.add(wet);
  const seaGeo = new THREE.PlaneGeometry(800, 800, 100, 100); seaGeo.rotateX(-Math.PI / 2); seaGeo.translate(0, 0, 400); const seaPos = seaGeo.attributes.position; const seaBase = Float32Array.from(seaPos.array);
  const sea = new THREE.Mesh(seaGeo, new THREE.MeshStandardMaterial({ color: 0x2a93bd, roughness: .25, metalness: .1, transparent: true, opacity: .9, flatShading: true })); sea.receiveShadow = true; SA.add(sea);
  const foam = new THREE.Mesh(new THREE.BoxGeometry(400, .12, 1.6), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: .85 })); SA.add(foam);
  const decor = []; { const r3 = R(41); for (let i = 0; i < 26; i++) { const k = r3(); const m = k < .45 ? addBox(SA, 0, 0, 0, .5 + r3(), .3 + r3() * .5, .5 + r3(), 0x8a8478, { round: .1 }) : k < .75 ? addBox(SA, 0, 0, 0, .06, .8 + r3() * .8, .06, 0x2f8a3a) : addBox(SA, 0, 0, 0, .25, .12, .2, 0xf2dcc8); m.position.set(BX + (r3() - .5) * 26, m.geometry.parameters.height / 2 + .05, 6 + r3() * 40); m.rotation.y = r3() * 6; decor.push(m); } }
  const mkFish = (c) => { const g = new THREE.Group(); const add = (w, h, d, cc, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(cc)); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; }; add(.34, .42, .8, c, 0, 0, 0); add(.3, .3, .3, c, 0, 0, .5); add(.08, .38, .2, 0xffffff, 0, 0, -.5); add(.05, .5, .3, c, 0, 0, -.62); const e1 = add(.16, .16, .08, 0xffffff, .13, .1, .62), e2 = add(.16, .16, .08, 0xffffff, -.13, .1, .62); add(.07, .07, .05, 0x111111, .13, .13, .67); add(.07, .07, .05, 0x111111, -.13, .13, .67); g.scale.setScalar(2.3); SA.add(g); return g; };
  const FISH = [[-1.8, 5, 0xf08a30], [1.5, 6.5, 0x4a8fd8], [-.3, 8.5, 0xe8c030], [2.6, 10, 0xd85a8a], [-2.8, 10.5, 0x6ac08a], [.9, 13, 0xf08a30], [-1.6, 15, 0x4a8fd8], [3, 16, 0xe8c030]].map(([x, z, c]) => ({ g: mkFish(c), x, z }));
  // sun
  const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(60, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffe066, fog: false })); SA.add(sunMesh);
  const glowT = canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(255,240,170,.95)'); gr.addColorStop(.4, 'rgba(255,220,120,.4)'); gr.addColorStop(1, 'rgba(255,200,100,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT.t, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); sunGlow.scale.set(600, 600, 1); SA.add(sunGlow);
  const setSun = (az, el) => { const c = Math.cos(el); const d = new THREE.Vector3(Math.sin(az) * c, Math.sin(el), Math.cos(az) * c); A.sun.userData.dir.copy(d).multiplyScalar(80); A.sky.material.uniforms.sunDir.value.copy(d); return d; };

  // ---------------------------------------------------------------- stage B: space
  const B = makeStage({ fog: 0x03040a, fogNear: 900, fogFar: 1500, clouds: false, skyTop: 0x02030a, skyMid: 0x04060e, skyBot: 0x070a16, shadowExtent: 24, hemi: .55, hemiSky: 0x445577, hemiGround: 0x223344, sunDir: [-.6, .5, .7], sunI: 3.2, exposure: 1.1 }); const SB = B.scene;
  const earth = buildEarth(SB, 6); earth.stars.material.size = 2.2;
  const crowdB = new Crowd(SB, 1, 12); const HB = crowdB.p[0]; col(crowdB, 0, ['torso', 'armL', 'armR'], 0x2f9e44); col(crowdB, 0, ['legL', 'legR'], 0x23293a); col(crowdB, 0, ['hair'], 0x4a2f1c); const hpB = heroProps(SB);
  const waveB = mkWave(SB); const bubB = { hero: makeBubble(lib, SB, 3.2, 1.2) };
  const moonTex = canvasTex(512, 256, () => {}); const moonBase = document.createElement('canvas'); moonBase.width = 512; moonBase.height = 256; { const g = moonBase.getContext('2d'); g.fillStyle = '#bdbdc4'; g.fillRect(0, 0, 512, 256); const r = R(17); for (let i = 0; i < 46; i++) { const x = r() * 512, y = 20 + r() * 216, rad = 6 + r() * 26; g.fillStyle = `rgba(110,110,122,${.35 + r() * .3})`; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill(); g.strokeStyle = 'rgba(235,235,240,.5)'; g.lineWidth = 2; g.beginPath(); g.arc(x - 1, y - 1, rad, 0, 7); g.stroke(); } }
  let moonKey = -1; const drawMoon = (cp) => { const k = Math.round(cp * 14); if (k === moonKey) return; moonKey = k; const g = moonTex.g; g.drawImage(moonBase, 0, 0); if (cp > 0) { const rs = R(23); const cx = 256, cy = 128; for (let pass = 0; pass < 2; pass++) { g.strokeStyle = pass ? 'rgba(255,255,255,.9)' : 'rgba(15,15,22,.95)'; g.lineWidth = pass ? 2.5 : 7; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + (rs() - .5) * .4; g.beginPath(); g.moveTo(cx, cy); let x = cx, y = cy; const len = (130 + rs() * 130) * cp; for (let s = 1; s <= 8; s++) { const d = len * s / 8, aa = a + (rs() - .5) * .45; x = cx + Math.cos(aa) * d; y = cy + Math.sin(aa) * d * .8; g.lineTo(x, y); } g.stroke(); } } } moonTex.t.needsUpdate = true; };
  const moonMat = new THREE.MeshStandardMaterial({ map: moonTex.t, roughness: .95, side: THREE.DoubleSide, emissive: 0x333344, emissiveIntensity: .35 }); const MR = 1.9;
  const moonG = new THREE.Group(); SB.add(moonG); const moonWhole = new THREE.Mesh(new THREE.SphereGeometry(MR, 48, 32), moonMat); moonWhole.castShadow = true; moonG.add(moonWhole);
  const halves = [0, 1].map((i) => { const g = new THREE.Group(); const h = new THREE.Mesh(new THREE.SphereGeometry(MR, 40, 28, i * Math.PI, Math.PI), moonMat); const cap = new THREE.Mesh(new THREE.CircleGeometry(MR, 32), new THREE.MeshStandardMaterial({ color: 0x7a7a86, roughness: 1, side: THREE.DoubleSide })); cap.rotation.y = Math.PI / 2; g.add(h, cap); g.visible = false; moonG.add(g); return g; });
  const mchunks = new Particles(SB, 24, 0xa8a8b4, .22, { rough: 1 });
  const CLK = []; for (let i = 0; i < 6; i++) { const g = new THREE.Group(); const face = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, .12, 24), mat(0xf6f6f2, { roughness: .4 })); face.rotation.x = Math.PI / 2; const rim = new THREE.Mesh(new THREE.TorusGeometry(.62, .06, 8, 24), mat([0xe74c3c, 0x3498db, 0xf1c40f, 0x2ecc71, 0x9b59b6, 0xe67e22][i])); const hh = new THREE.Mesh(new THREE.BoxGeometry(.06, .4, .04), mat(0x111111)); hh.position.z = .09; const hm = new THREE.Mesh(new THREE.BoxGeometry(.04, .54, .04), mat(0x222222)); hm.position.z = .11; const pvH = new THREE.Group(), pvM = new THREE.Group(); hh.position.y = .17; hm.position.y = .24; pvH.add(hh); pvM.add(hm); g.add(face, rim, pvH, pvM); g.visible = false; SB.add(g); CLK.push({ g, pvH, pvM, ph: i * 1.05, rad: 7.5 + (i % 3) * 1.4, tilt: (i - 2.5) * .22 }); }
  const sorryRing = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .035, 8, 64), new THREE.MeshBasicMaterial({ color: 0xbfe6ff, transparent: true, opacity: .9, depthWrite: false, fog: false })); m.visible = false; SB.add(m); return m; });
  const bubSorry = makeBubble(lib, SB, 2.2, .82);
  const earthAngle = (lt) => { let a = 0; const dt = 1 / 60; for (let s = 0; s < lt; s += dt) { const w = .5 - 3.0 * smooth((s - 1.6) / 1.5); a += w * Math.min(dt, lt - s); } return a; };

  // ---------------------------------------------------------------- helpers
  const place = (o, x, z, yaw, anim = 'idle', sc = 1.1, y = 0) => { o.x = x; o.z = z; o.y = y; o.yaw = yaw; o.anim = anim; o.vis = true; o.scale = sc; o.speed = 1; o.pitch = 0; o.extra = 0; o.arms = null; };
  const FACE = Math.PI;
  const burpAt = (lt) => { const u = (lt - .1) / .9; return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0; };
  const feather = (i, t0, lt, x, y, z) => { const u = lt - t0; const f = feathers[i]; if (u < 0) { f.visible = false; return; } f.visible = true; const fall = Math.min(u * .9, y - .1); f.position.set(x + Math.sin(u * 2.3 + i) * .5 + u * (i - 3.5) * .08, y - fall + (u * u > 99 ? 0 : 0), z + Math.cos(u * 1.9 + i) * .4); f.rotation.set(Math.sin(u * 3 + i) * .9, u * 2 + i, Math.cos(u * 2.4 + i) * .9); };
  const fmt = (n) => String(Math.round(n));
  const dbShow = (bi, lt) => { const a = DB[Math.max(0, bi - 1)], b = DB[bi]; return bi <= 1 ? b : lerp(a, b, smooth(lt / .7)); };

  return { frame({ t, bi, lt, p }) {
    const space = bi === 7; const dur = tl.beats[bi].dur;
    // reset
    for (const o of P) { o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; } HB.vis = false; HB.arms = null;
    Object.values(bub).forEach((b) => b.hide()); bubB.hero.hide(); bubSorry.hide();
    [cane, hook, shawl, ...clip, ...suit, phone, wifi, letter, pigeon, podium, board, sunMesh, sunGlow, poleM, lampM, towerG, sea, foam, wet, sand].forEach((m) => (m.visible = false)); feathers.forEach((f) => (f.visible = false)); FISH.forEach((f) => (f.g.visible = false)); decor.forEach((m) => (m.visible = false));
    cloud.clear(); dust.clear(); chunks.clear();
    const heroO = space ? HB : HERO; const bp = burpAt(lt); const HX = 0, HZ = 12;
    let cam = [3, 2, 5, 0, 1.6, 12, 46]; let wave = null; // wave: [center, radius, Rmax]
    const Rb = bi === 0 ? 26 : 2.5 * Math.pow(2, bi - 1); const vb = Rb / 1.3; const rNow = bi === 0 ? vb * (lt + .55) : vb * (lt - .15);
    A.sun.intensity = 2.8; A.hemi.intensity = 1.05 * .55; setSun(-.62, .96);
    let hbase = [HX, HZ]; let town = !space && bi !== 5 && bi !== 6; let beach = bi === 5 || bi === 6;
    const towerAngle = (k) => k;
    // tower state
    let thet = 0;
    // ============================================================ BEATS
    if (bi === 0) {
      place(HERO, .9, 6.6, FACE + .1, 'idle', 1.45); HERO.pitch = -.3 * (1 - smooth((lt - 1.4) / 1)); HERO.arms = { lx: -.9, lz: .2, rx: -.9, rz: -.2 };
      thet = Math.min(1.5, .7 + .25 * lt + .22 * lt * lt); towerG.visible = true; towerG.rotation.z = -thet;
      const imp = lt - 1.44; const bounce = imp > 0 ? -.06 * Math.exp(-imp * 4) * Math.abs(Math.sin(imp * 14)) : 0; towerG.rotation.z = -(thet + bounce); towerG.position.y = imp > 0 ? Math.abs(Math.sin(imp * 10)) * .25 * Math.exp(-imp * 3) : 0;
      // dust + debris from impact point (tower top lands near x = TPX+TH*cos)
      const tipX = TPX + (TH + 1) * Math.sin(Math.min(thet, 1.5));
      for (let i = 0; i < 90; i++) { const d = DU[i]; const u = lt - 1.3 - d.dl * .5; if (u > 0) { const sp = 1 + u * 1.2; dust.set(i, tipX - 2 + Math.cos(d.a) * d.d * (u * .9 + .15), .3 + d.up * Math.min(u, 1.6) * .6 + u * .4, TZ + Math.sin(d.a) * d.d * (u * .8 + .1), d.s * sp * clamp(1 - (u - 2.5) / 2.5)); } }
      for (let i = 0; i < 60; i++) { const c = CH[i]; const u = lt + .2; const y = c.y0 + TH * .5 + c.vy * u - 4.9 * u * u; const bx = lt < 1.44 ? TPX + (TH * .6) * Math.sin(thet) : tipX; const yy = Math.max(.15, y); chunks.set(i, bx + c.vx * u * .5 * (lt > 1.44 ? 1 : .3) - 2, yy, TZ + c.vz * u * .5, lt + .2 > 0 ? c.s * (u < 4 ? 1 : 0) : 0); }
      wave = [[HERO.x, 1.6, HERO.z], rNow, Rb]; if (lt < 3.6) { cam = [4.5, 2.6, -1.5, -.8, 3.3, 22, 56]; } else cam = [4.5, 2.6, -1.5, -.8, 3.3, 22, 56];
      const k = smooth((lt - 3.3) / 2.2); cam = [lerp(3.6, .6, k), lerp(2.0, 2.0, k), lerp(-1.6, 1.0, k), lerp(-.4, 0, k), lerp(4.4, 2.6, k), lerp(24, 7, k), lerp(56, 50, k)];
      if (lt > 3.3) { HERO.pitch = 0; HERO.arms = null; }
    } else if (bi === 1) {
      place(HERO, 0, HZ, FACE, 'idle', 1.2); HERO.pitch = -.32 * bp; HERO.arms = bp > .05 ? { lx: -.6, lz: .2, rx: -.6 - bp * .4, rz: -.2 } : null;
      const w = smooth(lt / 2.6); const gx = lerp(5.6, 2.1, w); place(GRAN, gx, lerp(11, 11, w), lt < 2.6 ? FACE + 1.2 * (1 - w) + .5 : FACE - .5 + .15 * Math.sin(lt * 3), lt < 2.6 ? 'walk' : 'idle', 1.0); GRAN.speed = .5; GRAN.scale = .98;
      const pushed = clamp(1 - Math.abs(lt - 1.3) / .6); GRAN.pitch = -.22 * pushed * (lt < 2.6 ? 0 : 0);
      if (lt >= 2.6) { const s = lt - 2.6; GRAN.arms = { lx: -.6 - .25 * Math.max(0, Math.sin(s * 9)) * (lt > 3.4 ? 1 : 0), lz: .1, rx: -.12, rz: -.05 }; GRAN.pitch = lt > 3.4 && lt < 4.6 ? .1 : 0; }
      if (lt > 3.5 && lt < 7.4) bub.gran.show('excuse you', GRAN.x - .1, 3.15, GRAN.z - .2);
      cam = [1.0, 2.0, 1.2, 1.0, 2.3, 12, 50]; towerG.visible = false; wave = [[HERO.x, 1.3, HERO.z], rNow, Rb];
    } else if (bi === 2) {
      place(HERO, 0, HZ, FACE + .15, 'idle', 1.2); HERO.pitch = -.32 * bp; HERO.arms = bp > .05 ? { lx: -.6, lz: .2, rx: -.6 - bp * .4, rz: -.2 } : null; poleM.visible = lampM.visible = true;
      // pigeon perched until blasted at lt 1.35
      const L0 = 1.35, u = lt - L0; const px = POLE.x, py = POLE.h + .32, pz = POLE.z;
      pigeon.visible = true;
      if (u < 0) { pigeon.position.set(px, py + Math.abs(Math.sin(lt * 7)) * .02, pz); pigeon.rotation.set(0, Math.PI * .85, 0); pigeon.wl.rotation.z = pigeon.wr.rotation.z = 0; const wob = clamp((lt - .95) / .4); pigeon.rotation.z = Math.sin(lt * 40) * .1 * wob; }
      else { const k = 1.1; const e = (1 - Math.exp(-k * u)) / k; const vx = 7, vy = 8.5, vz = 11; pigeon.position.set(px - vx * e * .4 + Math.sin(u * 5) * .4 * Math.exp(-u), py + vy * e - .0 + 1.2 * Math.sin(u * 3) * Math.exp(-u * .5), pz + vz * e); pigeon.lookAt(pigeon.position.x - vx * .4, pigeon.position.y + vy * .6, pigeon.position.z + vz); pigeon.rotateZ(Math.sin(u * 14) * .5 * Math.exp(-u * 1.6)); const f = Math.sin(u * 38) * .9; pigeon.wl.rotation.z = f; pigeon.wr.rotation.z = -f; pigeon.scale.setScalar(1.7); if (u > 2.4) pigeon.visible = false; }
      for (let i = 0; i < 8; i++) feather(i, L0 + .05 + i * .07, lt, px + (i - 3.5) * .15, py + .6, pz + .2);
      // letter
      if (lt > 4.35) { const s = clamp((lt - 4.35) / 1.55); const hand = hp(HERO, 'handL', V2); const sx = -4.5, sy = 8.5, sz = 22; const sw = (1 - s) * Math.sin(s * 14) * 1.1; const lx = lerp(sx, hand.x, smooth(s)) + sw, ly = lerp(sy, hand.y + .1, easeOut(s) * .6 + s * .4), lz = lerp(sz, hand.z - .2, smooth(s)); letter.visible = true; letter.position.set(lx, ly, lz); letter.rotation.set(Math.sin(s * 11) * .8 * (1 - s) - .2 * s, Math.PI + Math.sin(s * 8) * .6 * (1 - s), Math.sin(s * 13) * .9 * (1 - s)); const sc = lerp(1.0, 2.2, smooth(s)); letter.scale.setScalar(sc); if (s > .9) { HERO.arms = { lx: -1.2, lz: .1, rx: -.2, rz: -.1 }; } HERO.pitch = Math.max(HERO.pitch, .1 * s); }
      cam = [-.5, 2.0, 1.2, -.5, 2.9, 12, 52]; towerG.visible = false; wave = [[HERO.x, 1.5, HERO.z], rNow, Rb];
    } else if (bi === 3) {
      place(HERO, 0, HZ, FACE, 'idle', 1.2); HERO.pitch = -.32 * bp; HERO.arms = null;
      // phone raised to camera after burp
      const raise = smooth((lt - .7) / .5); HERO.arms = { lx: -.15, lz: .1, rx: lerp(-.3, -1.35, raise) - .1 * bp, rz: -.15 };
      const crackP = clamp((lt - 1.9) / .35); drawPhone(Math.round(crackP * 10) / 10, !(lt > 3.1)); const hand = hp(HERO, 'handR', V2); phone.visible = lt > .6;
      phone.position.set(hand.x - .12, hand.y + .27, hand.z + .1); phone.rotation.set(-.05, FACE, 0); const sh = lt > 1.9 && lt < 2.25 ? Math.sin(lt * 90) * .05 : 0; phone.rotation.z = sh; phone.scale.setScalar(2.1 + (lt > 1.9 && lt < 2.1 ? .15 : 0));
      // wifi flees ballistically
      if (lt > 3.1) { const u = lt - 3.1; const gy = 6; const x0 = phone.position.x, y0 = phone.position.y, z0 = phone.position.z; wifi.visible = true; wifi.position.set(x0 + 4.2 * u, y0 + 5.5 * u - .5 * gy * u * u + (u < .15 ? 0 : 0), z0 + 1.2 * u); wifi.position.y = Math.max(.6, wifi.position.y); wifi.rotation.set(0, FACE, Math.sin(u * 6) * .25 - u * .4); wifi.scale.setScalar(1 + u * .2); if (wifi.position.y <= .61 && u > .3) { const b = Math.abs(Math.sin((u - .75) * 4)) * Math.exp(-(u - .75) * 1.2); wifi.position.y = .61 + (u > 1.2 ? b * .6 : 0); } }
      // Kyle
      const kw = smooth((lt - 3.9) / 1.2); const kx = lerp(-6.5, -2.2, kw); place(KYLE, kx, 10.2, lerp(FACE - 1.3, FACE + .15, kw), kw < 1 ? 'walk' : 'idle', 1.15); KYLE.speed = .6; if (kw >= 1) { KYLE.arms = { lx: -.2, lz: .1, rx: -1.8, rz: -.2 }; KYLE.pitch = .05 * Math.sin(lt * 4); }
      if (lt > 5.7 && lt < 9) bub.kyle.show('who burped', KYLE.x + .1, 3.3, KYLE.z - .1);
      { const pb = smooth((lt - 3.4) / 1.0); cam = [lerp(.9, .0, pb), 2.0, lerp(6, 3.0, pb), lerp(.1, -.9, pb), lerp(2.4, 2.1, pb), 12, 50]; } towerG.visible = false; wave = [[HERO.x, 1.5, HERO.z], rNow, Rb];
    } else if (bi === 4) {
      place(HERO, 3.4, 15, FACE - .35, 'idle', 1.2); HERO.pitch = -.32 * bp; HERO.arms = bp > .05 ? { lx: -.6, lz: .2, rx: -1.0, rz: -.2 } : null; if (lt > 2.6) HERO.pitch = .12;
      towerG.visible = true; towerG.position.set(TPX + 5.5, 0, 30);
      // polite fall: slight lean back, then slow bow forward, soft landing
      const u = clamp((lt - 1.25) / 1.75); let a = 0; if (lt < 1.25) a = 0; else { const lean = -.06 * Math.sin(Math.PI * clamp(u / .25)); a = lean * (u < .25 ? 1 : 0) + (1.48) * smooth(clamp((u - .12) / .88)) * (.35 + .65 * smooth(clamp((u - .12) / .88))); }
      towerG.rotation.z = -Math.min(1.52, a + .0); const land = u >= 1 ? lt - 3.0 : -1;
      if (land > 0) { for (let i = 0; i < 40; i++) { const d = DU[i]; const uu = land - d.dl * .2; if (uu > 0) dust.set(i, TPX + 5.5 + 15.6 + Math.cos(d.a) * d.d * .5 * uu, .3 + d.up * .25 * Math.min(uu, 1.2), 30 + Math.sin(d.a) * d.d * .4 * uu, d.s * .55 * (1 + uu) * clamp(1 - (uu - 1.4) / 1.6)); } }
      // mayor at podium + board
      const mv = smooth((lt - 3.2) / .7); const mx = -1.0, mz = 14.2;
      if (lt > 3.2) { place(MAYOR, lerp(-4.5, mx, mv), mz, FACE, mv < 1 ? 'walk' : 'idle', 1.2); MAYOR.speed = .6; if (mv >= 1) { MAYOR.arms = { lx: -.9, lz: .15, rx: -.9, rz: -.15 }; MAYOR.pitch = .04; } }
      podium.visible = lt > 3.2; podium.position.set(lerp(-4.5, mx, mv), 0, mz - .95); podium.rotation.y = FACE; podium.rotation.y = 0; podium.position.set(mx, 0, mz - .95);
      if (lt < 3.2) podium.visible = false; else { const pdrop = smooth((lt - 3.2) / .5); podium.position.y = lerp(4, 0, easeIn(clamp((lt - 3.2) / .45))) ; podium.visible = true; if (pdrop >= 1) podium.position.y = 0; }
      board.visible = lt > 3.7; const bd = smooth((lt - 3.7) / .4); board.position.set(2.2 - 0, 1.55 * bd + .1, 13.6); board.rotation.y = FACE + .05; board.scale.setScalar(bd * (lt > 6.85 ? 1 + .22 * Math.max(0, Math.sin((lt - 6.85) * 14)) * Math.exp(-(lt - 6.85) * 5) : 1)); board.position.x = 1.3; board.position.y = 1.1 * bd + .3;
      drawBoard(lt < 5.2 ? '' : lt < 6.9 ? '...' : 'DAVE');
      cam = lt < 3.1 ? [4.2, 2.4, 3.5, -2, 4.2, 26, 56] : [.4, 2.0, 3.6, .4, 2.1, 13.5, 50]; if (lt >= 3.1) { const kk = smooth((lt - 3.1) / .6); const c0 = [4.2, 2.4, 3.5, -2, 4.2, 26, 56], c1 = [.4, 2.0, 3.6, .4, 2.1, 13.5, 50]; cam = c0.map((v, i) => lerp(v, c1[i], kk)); }
      wave = [[HERO.x, 1.5, HERO.z], rNow, Rb]; city.updateCrowd(t, null);
    } else if (bi === 5) {
      const E = lerp(4.5, 40, smooth((lt - 1.4) / 1.8)); // water edge z (retreats away)
      place(HERO, BX + .2, 0, FACE, 'idle', 1.2); HERO.pitch = -.32 * bp; HERO.arms = bp > .05 ? { lx: -.6, lz: .2, rx: -1.0, rz: -.2 } : null;
      sand.visible = sea.visible = foam.visible = wet.visible = true; sea.position.set(BX, .2, E); foam.position.set(BX, .24, E - .2 + Math.sin(t * 2) * .2); wet.position.set(BX, .07, E - 5);
      const pa = seaPos.array; for (let i = 0; i < seaPos.count; i++) { const x = seaBase[i * 3], z = seaBase[i * 3 + 2]; pa[i * 3 + 1] = Math.sin(x * .09 + t * 1.2) * .22 + Math.sin((z + E) * .07 - t * 1.4) * .26; } seaPos.needsUpdate = true; sea.geometry.computeVertexNormals();
      decor.forEach((m) => { m.visible = m.position.z < E + (m.geometry.parameters.height > .5 ? 0 : 0) - .3; });
      FISH.forEach((f, i) => { const g = f.g; g.position.set(BX + f.x, .22, f.z); const vis = f.z < E - .6; g.visible = vis; const lookUp = smooth((lt - 2.8) / .7); const flop = Math.sin(t * 9 + i * 2) * .25 * (1 - lookUp * .8) * (lt > 2 ? 1 : 0); g.rotation.order = 'YXZ'; g.rotation.set(-.75 * lookUp + flop * .3, (i % 2 ? 1 : -1) * (Math.PI / 2 + flop * .15), flop * .25); g.position.y = .35 + Math.abs(Math.sin(t * 6 + i)) * .08 * (1 - lookUp) + lookUp * .2; });
      if (lt > 4.5) bub.fish.show('was that a burp', BX - .3, 2.9, 8.5);
      cam = [BX + .3, 2.3, -8.5, BX + .3, 2.0, 8, 52]; wave = [[BX, 1.5, 0], rNow, Rb]; towerG.visible = false;
      cloud.clear();
    } else if (bi === 6) {
      // sun flickers
      sunMesh.visible = sunGlow.visible = true; const fl = lt > 1.46 && lt < 3.2 ? ((Math.sin(lt * 31) > -.1 ? 1 : .08) * (lt < 2.34 ? 1 : (1 - (lt - 2.34) / .86 * .0)) + (lt > 2.34 ? 0 : 0)) : 1; const flv = lt > 1.46 && lt < 2.5 ? (Math.floor((lt - 1.46) * 9) % 2 ? .1 : 1) : 1;
      A.sun.intensity = 2.8 * (.18 + .82 * flv); A.hemi.intensity = 1.05 * .55 * (.3 + .7 * flv); sunMesh.material.color.setRGB(1, .85 * (.4 + .6 * flv), .35 * (.2 + .8 * flv)); sunGlow.material.opacity = .25 + .75 * flv; sunMesh.scale.setScalar(1 + (1 - flv) * -.08);
      sand.visible = sea.visible = foam.visible = wet.visible = true; sea.position.set(BX, .2, 70); foam.position.set(BX, .24, 69.8); wet.position.set(BX, .07, 65); const pa = seaPos.array; for (let i = 0; i < seaPos.count; i++) { const x = seaBase[i * 3], z = seaBase[i * 3 + 2]; pa[i * 3 + 1] = Math.sin(x * .09 + t * 1.2) * .22 + Math.sin((z + 70) * .07 - t * 1.4) * .26; } seaPos.needsUpdate = true; sea.geometry.computeVertexNormals();
      decor.forEach((m) => (m.visible = m.position.z < 69));
      place(HERO, BX + 1.3, 0, FACE, 'idle', 1.2); HERO.pitch = -.32 * bp; HERO.arms = bp > .05 ? { lx: -.6, lz: .2, rx: -1.0, rz: -.2 } : null;
      const sx = [BX - 1.3, BX - 2.5, BX - 3.7]; const turn = smooth((lt - 5.0) / .45); const upLook = (lt > 1.2 ? 1 : 0) * (1 - turn);
      [SC1, SC2, SC3].forEach((o, i) => { place(o, sx[i], 0 + i * .35, FACE + (-.5 * i * .3) * (1 - turn) + turn * (-Math.PI / 2 - FACE + FACE + (-.15 * i)) * 0 , 'idle', 1.15); o.yaw = lerp(FACE - .15 * i, -Math.PI / 2 + 0.0 + (i * .04) + Math.PI * 0 , turn) ; o.pitch = -.4 * upLook; o.arms = lt > 3.1 && lt < 5.0 ? { lx: -.3 - .8 * Math.max(0, Math.sin(lt * 7 + i)) * (lt < 4.5 ? 1 : 0), lz: .5, rx: -.3, rz: -.5 } : { lx: -.5, lz: .1, rx: -1.0, rz: -.1 }; });
      // face hero: yaw so front (+z local) points toward -x : atan2(dx,dz) with dx=-1,dz=0 => -pi/2 ; FACE=pi equals -pi, so lerp(pi -> -pi/2) would spin through the wrong way: use lerp(-pi, -pi/2)
      [SC1, SC2, SC3].forEach((o, i) => { o.yaw = lerp(Math.PI + .12 * i, Math.PI / 2 + .05 * i, turn); });
      if (lt > 3.2 && lt < 5.0) bub.sci.show('we do not know', sx[1] - .2, 3.35, 1.0);
      cam = [BX - 1.2, 1.6, -13, BX - 1.2, 2.6, 6, 52]; wave = [[HERO.x, 1.5, HERO.z], rNow, Rb]; towerG.visible = false;
    } else {
      // space
      HB.vis = true; HB.x = 0; HB.y = 6.0; HB.z = 0; HB.yaw = FACE; HB.scale = .95; HB.anim = 'idle'; HB.speed = 1; HB.pitch = -.32 * bp; HB.arms = bp > .05 ? { lx: -.6, lz: .2, rx: -1.0, rz: -.2 } : null; HB.extra = 0;
      earth.earth.rotation.y = earthAngle(lt); earth.atm.rotation.y = 0;
      // clocks
      CLK.forEach((c, i) => { const on = lt > 3.4 + i * .12; c.g.visible = on; if (!on) return; const u = lt - (3.4 + i * .12); const app = smooth(u / .6); const w = (i % 2 ? 1 : -1) * (.5 + .2 * i); const a = c.ph + lt * w * .9 + (lt > 4.2 ? Math.sin(lt * 1.3 + i) * .6 : 0); const rad = lerp(14, c.rad, app); c.g.position.set(Math.cos(a) * rad * 1.15, 6.5 + Math.sin(a * 1.3 + i) * 2.5 + c.tilt * 3, Math.sin(a) * rad * .9 + 3); c.g.rotation.set(.15, Math.sin(a) * .5 + .6 * (i % 2 ? 1 : -1), 0); c.g.scale.setScalar(app * (1 + .6)); c.pvH.rotation.z = -lt * (6 + i * 2) * (i % 2 ? -1 : 1); c.pvM.rotation.z = -lt * (28 + i * 9) * (i % 3 ? 1 : -1); });
      // moon
      const mp = new THREE.Vector3(6.4, 9.0, -2); moonG.position.copy(mp); moonG.rotation.y = lt * .15; const crackP = clamp((lt - 6.7) / .75); drawMoon(lt > 7.5 ? 1 : crackP);
      const brk = lt - 7.8; moonWhole.visible = brk < 0; halves.forEach((h, i) => { h.visible = brk >= 0; if (brk >= 0) { const s = (i ? 1 : -1); h.position.set(0, 0, 0); h.position.x = s * (.1 + brk * .9 + brk * brk * .2); h.position.y = .5 * brk - brk * brk * .3; h.rotation.set(s * brk * .4, 0, -s * brk * .6); } }); if (brk < 0 && lt > 7.3) moonWhole.position.set(Math.sin(lt * 70) * .05 * (lt - 7.3), Math.cos(lt * 63) * .05 * (lt - 7.3), 0); else moonWhole.position.set(0, 0, 0);
      mchunks.clear(); for (let i = 0; i < 24; i++) { if (brk >= 0) { const a = i * 2.4, v = 1.5 + (i % 5) * .5; mchunks.set(i, mp.x + Math.cos(a) * v * brk * 1.6, mp.y + Math.sin(a * 1.3) * v * brk * 1.4, mp.z + Math.sin(a) * v * brk, .5 + (i % 4) * .25); } } mchunks.done();
      // sorry
      if (lt > 5.66 && lt < 6.9) { const hp2 = hp(HB, 'head', V2); bubB.hero.show('sorry', HB.x + 1.3, 8.4, HB.z + .5); }
      const su = lt - 6.2; sorryRing.forEach((r, i) => { const uu = su - i * .12; if (uu < 0 || uu > 1.5) { r.visible = false; return; } r.visible = true; const f = uu / 1.5; r.position.set(lerp(0, mp.x, f), lerp(7.4, mp.y, f), lerp(0, mp.z, f)); r.lookAt(mp.x * 3, mp.y * 3 + 3, mp.z * 3 - 8); r.scale.setScalar(.5 + f * .8); r.material.opacity = .9 * (1 - f * .3); });
      wave = [[0, 6.8, 0], rNow * .35, 40];
      cam = [3.2 + Math.sin(lt * .3) * .3, 8.6, 17, 3.2, 7.0, 0, 54];
    }
    // ---------------------------------------------------------------- shared updates
    crowd.setFace(bp > .02 || (bi === 0 && lt < 3.3) ? 'shock' : 'calm'); crowdB.setFace(bp > .02 ? 'shock' : 'calm');
    if (!space) { city.updateCrowd(t, bi >= 4 && bi <= 4 ? starts[bi] + .8 : (bi === 0 ? 0 : null)); crowd.update(t); hpA.update(HERO); hpA.all.forEach((m) => (m.visible = HERO.vis));
      // props that follow bodies
      if (GRAN.vis) { hp(GRAN, 'handR', V2); cane.visible = hook.visible = true; cane.matrixAutoUpdate = true; cane.position.set(V2.x, V2.y - .38, V2.z + .06); cane.rotation.set(0, 0, 0); hook.position.set(V2.x, V2.y + .1, V2.z + .12); attach(shawl, GRAN, 'torso', [0, .3, 0]); shawl.visible = true; }
      [SC1, SC2, SC3].forEach((o, i) => { if (!o.vis) return; hp(o, 'handR', V2); clip[i].visible = true; clip[i].position.set(V2.x, V2.y + .1, V2.z); clip[i].rotation.set(0, o.yaw + Math.PI, .1); });
      if (MAYOR.vis) { attach(suit[0], MAYOR, 'torso', [0, .05, .165]); suit[0].visible = true; }
      if (bi === 0 && lt < 2.4) hp(HERO, 'head', V2);
    } else { crowdB.update(t); hpB.update(HB); hpB.all.forEach((m) => (m.visible = HB.vis)); }
    // burp cloud puffs from mouth
    if (bp > 0 || (lt > .1 && lt < 1.6 && bi !== 0) || (bi === 0 && lt < 1.2)) { const heroNow = space ? HB : HERO; hp(heroNow, 'head', V2); const u0 = bi === 0 ? lt + .3 : lt - .1; const sc = bi === 0 ? 1 : Math.min(1 + bi * .22, 2.2); if (!space && u0 > 0) for (let i = 0; i < 14; i++) { const ph = (u0 * 1.1 + i * .09); if (ph > 1.1) continue; cloud.set(i, V2.x + Math.sin(i * 2.3) * .2 * ph, V2.y - .15 + ph * .15, V2.z - .25 - ph * 1.6 * sc + Math.cos(i) * .1, (.5 + ph * 1.8) * sc * (1 - ph / 1.1)); } cloud.done(); } else cloud.done();
    dust.done(); chunks.done();
    // ---------------------------------------------------------------- render
    const camD = (c) => Math.hypot(c[0] - (wave ? wave[0][0] : 0), c[2] - (wave ? wave[0][2] : 0));
    if (space) {
      waveB.off(); if (wave) waveB.set(wave[0], wave[1], wave[2], 21);
      B.cam(...cam); B.follow(0, 0); B.render();
    } else {
      if (wave) waveA.set(wave[0], wave[1], wave[2], camD(cam)); else waveA.off();
      const fx = beach ? BX : HX; const fz = beach ? 4 : HZ; A.follow(fx, fz);
      if (beach) { // sun follows camera so it holds a stable screen position
        const d = setSun(bi === 6 ? -.12 : -.7, bi === 6 ? .3 : .75); sunMesh.position.set(cam[0] + d.x * 700, cam[1] + d.y * 700, cam[2] + d.z * 700); sunGlow.position.copy(sunMesh.position);
        A.follow(BX, 4); }
      A.cam(...cam); A.render();
    }
    // ---------------------------------------------------------------- HUD
    hud.style('C'); hud.question('What if every *burp* was twice as loud?', 1, bi > 0);
    if (bi === 0) hud.counter('', '', ''); else { const db = dbShow(bi, lt); hud.counter('Burp ' + NUM[bi], fmt(db) + ' dB', NOTE[bi], 'twice as loud, again', db > 100); }
    hud.tm('');
    hud.pop(POP[bi] && lt > POPT[bi] ? POP[bi] : '', Math.min(1, (lt - POPT[bi]) * 6));
  } };
}
