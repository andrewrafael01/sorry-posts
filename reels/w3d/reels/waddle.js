// What if your balls doubled in size every day? Non-explicit: the joke is in the words; the visuals are a waddle, a security guard, a wheelbarrow named Kevin, and a huge sack that rolls and becomes a planet-sized "situation".
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, addBox, mat, Crowd, Particles, R, clamp, smooth, lerp, attach } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const st = makeStage({ shadowExtent: 50, fogNear: 130, fogFar: 560, sunDir: [-.5, .8, -.3], sunI: 2.9 }); const S = st.scene; const city = buildStreet(S, { seed: 5 });
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const burlap = cvs(256, 256, (g, w, h) => { g.fillStyle = '#b48a56'; g.fillRect(0, 0, w, h); const r = R(3); for (let i = 0; i < 2600; i++) { g.fillStyle = r() < .5 ? 'rgba(90,60,30,.18)' : 'rgba(230,200,150,.16)'; g.fillRect(r() * w, r() * h, 6, 1.5); g.fillRect(r() * w, r() * h, 1.5, 6); } g.strokeStyle = 'rgba(60,40,20,.5)'; g.lineWidth = 3; g.setLineDash([10, 8]); g.beginPath(); g.moveTo(0, 128); g.lineTo(256, 128); g.stroke(); });
  const sack = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 30), new THREE.MeshStandardMaterial({ map: burlap, roughness: .95 })); sack.castShadow = true; sack.receiveShadow = true; sack.visible = false; S.add(sack);
  const tie = new THREE.Mesh(new THREE.TorusGeometry(.3, .05, 8, 20), mat(0x6a4a2a)); tie.visible = false; S.add(tie);
  // wheelbarrow named Kevin
  const wb = new THREE.Group(); { const tray = new THREE.Mesh(new THREE.BoxGeometry(1.0, .5, 1.5), mat(0xd9a52a)); tray.position.y = .62; const nameT = cvs(256, 96, (g, w, h) => { g.fillStyle = '#d9a52a'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.font = '900 60px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('KEVIN', w / 2, 70); }); for (const sx of [-1, 1]) { const pl = new THREE.Mesh(new THREE.PlaneGeometry(.9, .34), new THREE.MeshStandardMaterial({ map: nameT })); pl.position.set(sx * .51, .62, 0); pl.rotation.y = sx * Math.PI / 2; wb.add(pl); } const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .12, 18), mat(0x222222)); wheel.rotation.z = Math.PI / 2; wheel.position.set(0, .3, .85); wb.userData.wheel = wheel; const leg = (x, z) => { const l = new THREE.Mesh(new THREE.BoxGeometry(.06, .4, .06), mat(0x555555)); l.position.set(x, .2, z); return l; }; wb.add(tray, wheel, leg(-.4, -.7), leg(.4, -.7)); wb.traverse((m) => (m.castShadow = true)); wb.visible = false; S.add(wb); }
  const handles = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.BoxGeometry(.05, .05, 1), mat(0x6a4a2a)); m.castShadow = true; m.visible = false; S.add(m); return m; });
  const bar = (m, a, b) => { m.position.copy(a).add(b).multiplyScalar(.5); m.lookAt(b); m.scale.set(1, 1, a.distanceTo(b)); };
  const bench = addBox(S, 0, .25, 8, .9, .5, 2.6, 0x7a5230); bench.visible = false; const signT = cvs(512, 128, (g, w, h) => { g.fillStyle = '#1f3f8a'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 64px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('SECURITY CHECK', w / 2, 88); }); const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.6, .9), new THREE.MeshStandardMaterial({ map: signT, emissive: 0x111a33 })); sign.visible = false; S.add(sign);
  const wand = addBox(S, 0, 1, 0, .05, .05, .45, 0x222222); wand.visible = false; const beep = new THREE.PointLight(0xff2020, 0, 6); S.add(beep);
  // people
  const NB = 14, crowd = new Crowd(S, NB + 2, 61); const P = crowd.p; const col = (i, k, c) => crowd.parts[k].setColorAt(i, new THREE.Color(c));
  const HERO = NB, GUARD = NB + 1; ['torso', 'armL', 'armR'].forEach((k) => col(HERO, k, 0x3f7fd6)); ['legL', 'legR'].forEach((k) => col(HERO, k, 0x2a2f3c)); ['torso', 'armL', 'armR'].forEach((k) => col(GUARD, k, 0xd9d33a)); ['legL', 'legR'].forEach((k) => col(GUARD, k, 0x1d2233)); for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const hero = P[HERO], guard = P[GUARD]; const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const DAY = [0, 1, 3, 7, 10, 14, 20, 30]; const NOTE = ['', 'slight waddle', 'sits like a king', 'airport security is concerned', 'his name is kevin', 'everyone moves', 'gravity is a suggestion', 'legally a planet'];
  const POPS = ['', 'HURT YOUR LEG?', 'A VERY UNCOMFORTABLE KING', 'WHAT\'S IN THE BAG', 'KEVIN', 'EVERYONE MOVES', 'NASA CALLED', 'THE SITUATION'];
  const SPD = 1.4; const z0 = 6;
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 7); const dayF = lerp(DAY[Math.max(0, bi - 0)], DAY[Math.min(7, bi + 1)], smooth(p)); const hz = z0 + t * SPD * (bi >= 3 && bi !== 3 ? 1 : .85);
    for (let i = 0; i < P.length; i++) { P[i].vis = false; P[i].arms = null; P[i].pitch = 0; P[i].extra = 0; }
    const place = (o, x, z, yaw, anim, y = 0, sp = .5) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.vis = true; o.scale = 1.2; };
    const sway = Math.sin(t * 4.6); const lvl = clamp(bi / 4);
    let cam; sack.visible = tie.visible = wb.visible = bench.visible = sign.visible = wand.visible = false; handles.forEach((h) => (h.visible = false)); beep.intensity = 0;
    const R0 = [0, 0, 0, 0, .5, 1.3, 6, 40][bi]; const R1 = [0, 0, 0, 0, .5, 1.3, 6, 40][Math.min(7, bi + 1)]; const rad = bi >= 4 ? lerp(R0, bi < 7 ? [0, 0, 0, 0, .5, 1.3, 6, 40][bi + 1] : 40, smooth(p)) : 0;
    // bystanders: stare from the far sidewalk, then flee as the sack gets big
    for (let i = 0; i < NB; i++) { const o = P[i]; const base = 6 + i * 6; const flee = clamp((bi - 4 + p) / 1.2); const zz = hz + (i - 5) * 4.5; place(o, 8.4 + (i % 3) * .7, zz + flee * flee * 24 * (i % 2 ? 1 : -1), -Math.PI / 2 + flee * (i % 2 ? .5 : -.5), flee > .05 ? 'run' : 'idle', 0, 1.2); }
    if (bi === 0) { place(hero, 0, hz, 0, 'idle', 0, .5); cam = [-6.2, 1.8, hz + .8, 0, 1.5, hz, 40]; }
    else if (bi === 1) { place(hero, sway * .13, hz, sway * .3, 'walk', 0, .56); hero.arms = null; cam = [-8.5, 1.6, hz + 2.4, 0, 1.2, hz + .3, 50]; }
    else if (bi === 2) { bench.visible = true; bench.position.set(0, .25, hz + 3); place(hero, 0, hz + 3, -Math.PI / 2, 'sit', .5 - .68 * 1.2, .4); hero.arms = { lx: -.35, lz: -.55, rx: -.35, rz: .55 }; cam = [-8.0, 1.5, hz + 3, 0, 1.2, hz + 3, 46]; }
    else if (bi === 3) { place(hero, 0, hz, 0, 'idle', 0, .5); place(guard, 0, hz + 1.5, Math.PI, 'idle', 0, .5); guard.arms = { lx: -.3, lz: -.1, rx: -1.6, rz: .1 }; sign.visible = true; sign.position.set(0, 3.4, hz + 1.5); sign.rotation.y = Math.PI / 2; wand.visible = true; cam = [-8.5, 1.8, hz + .75, 0, 1.5, hz + .75, 48]; beep.intensity = lt > 1.0 ? 6 + Math.sin(t * 30) * 5 : 0; beep.position.set(0, 1.4, hz + 1); }
    else if (bi === 4) { place(hero, sway * .08, hz, sway * .15, 'walk', 0, .56); hero.arms = { lx: -1.15, lz: .08, rx: -1.15, rz: -.08 }; wb.visible = true; sack.visible = true; cam = [-9.5, 2.0, hz + 1.1, 0, 1.0, hz + 1.1, 52]; }
    else if (bi === 5) { place(hero, 0, hz, 0, 'walk', 0, .6); hero.arms = { lx: -1.45, lz: .12, rx: -1.45, rz: -.12 }; sack.visible = true; cam = [-13, 3.0, hz + 3, 0, 1.5, hz + 3, 56]; }
    else if (bi === 6) { place(hero, 0, hz, 0, 'walk', 0, .6); hero.arms = { lx: -1.45, lz: .12, rx: -1.45, rz: -.12 }; sack.visible = true; cam = [-42, 12 + p * 6, hz + 8, 0, 4, hz + 8, 58]; }
    else { place(hero, 0, hz, 0, 'walk', 0, .6); hero.arms = { lx: -1.45, lz: .12, rx: -1.45, rz: -.12 }; sack.visible = true; cam = [-120, 32, hz + 60, 0, 28, hz + 60, 62]; }
    crowd.update(t); city.updateCrowd(t, null);
    // sack / wheelbarrow follow the hero
    if (bi >= 4) { const sz = hz + 1.0 + (bi === 4 ? .75 : rad + .55); const cy = bi === 4 ? 1.05 + rad * .5 : rad; sack.scale.setScalar(Math.max(.01, rad)); sack.position.set(hero.x, cy, hz + (bi === 4 ? 1.75 : rad + .75)); sack.rotation.x = bi >= 5 ? (hz / Math.max(.3, rad)) : 0; tie.visible = bi === 4; tie.position.set(hero.x, 1.05 + rad * 1.15, sack.position.z); tie.rotation.x = Math.PI / 2; if (bi === 7) sack.position.set(0, rad * .9, hz + rad + 4); if (bi === 7) sack.position.set(0, 24 + rad * .25, hz + 60);
      if (bi === 4) { wb.position.set(hero.x, 0, hz + 1.75); wb.userData.wheel.rotation.x = hz * 3; const a = hp(hero, 'handL'), b = hp(hero, 'handR'); handles.forEach((h) => (h.visible = true)); bar(handles[0], a, new THREE.Vector3(a.x, .75, hz + 1.1)); bar(handles[1], b, new THREE.Vector3(b.x, .75, hz + 1.1)); } }
    if (bi === 3) { const g = hp(guard, 'handR'); wand.position.set(g.x, g.y, g.z + .05 + Math.sin(t * 6) * .0); wand.rotation.set(Math.sin(t * 5) * .5, 0, 0); }
    st.cam(...cam); st.follow(0, hz); st.render();
    hud.style('C'); hud.question('What if your *balls* doubled in size every day?', 1, bi > 0);
    if (bi === 0 && lt < 1.0) hud.counter('', '', ''); else { const d = Math.max(1, Math.round(dayF)); const v = Math.pow(2, d); hud.counter('Day ' + d + ' · Size', v < 1e6 ? fmt(v) + '×' : v < 1e9 ? (v / 1e6).toFixed(1) + ' million ×' : (v / 1e9).toFixed(1) + ' billion ×', NOTE[bi], '×2 every day', bi >= 5); hud.tm(''); }
    hud.pop(POPS[bi] && lt > .5 ? POPS[bi] : '', Math.min(1, (lt - .5) * 6));
  } };
}
