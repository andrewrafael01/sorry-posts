// What if your aura doubled every minute? Deadpan escalation: barista, pigeons, line-cutter, ex, sun, gravity, planet.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, Crowd, Particles, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const st = makeStage({ shadowExtent: 40, fogNear: 120, fogFar: 520, skyTop: 0x5f9be0, skyMid: 0xaed0ee, skyBot: 0xf0e8dc, fog: 0xdce6ee, sunDir: [-.6, .7, .4], sunI: 2.8, clouds: true });
  const city = buildStreet(st.scene, { seed: 3 }); const hero = new Crowd(st.scene, 1, 31); const h = hero.p[0]; h.scale = 1.25; h.shirt.set(0xf2c94c); h.pants.set(0x1d2233); hero.parts.torso.setColorAt(0, h.shirt); hero.parts.armL.setColorAt(0, h.shirt); hero.parts.armR.setColorAt(0, h.shirt); hero.parts.legL.setColorAt(0, h.pants); hero.parts.legR.setColorAt(0, h.pants); for (const k of ['torso', 'armL', 'armR', 'legL', 'legR']) hero.parts[k].instanceColor.needsUpdate = true;
  const sg = new THREE.Mesh(new THREE.BoxGeometry(.44, .09, .05), new THREE.MeshStandardMaterial({ color: 0x050505, roughness: .1 })); st.scene.add(sg);
  const NP = 70, ppl = new Crowd(st.scene, NP, 17); const r = R(4); const pp = []; for (let i = 0; i < NP; i++) { const a = r() * 3.14 - .1, rad = 2.5 + r() * 8; pp.push({ x: (2.4 + r() * 8) * (r() < .5 ? -1 : 1), z: 0 + r() * 8.5, ph: r() * 6.28, rad: 3 + r() * 8, a0: r() * 6.28 }); }
  const mk = (rad, op, col) => { const m = new THREE.Mesh(new THREE.SphereGeometry(rad, 40, 28), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); st.scene.add(m); return m; };
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; { const g = cv.getContext('2d'); const gr = g.createRadialGradient(128, 128, 6, 128, 128, 126); gr.addColorStop(0, 'rgba(255,236,150,.9)'); gr.addColorStop(.35, 'rgba(255,200,70,.45)'); gr.addColorStop(1, 'rgba(255,170,30,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); } const gt = new THREE.CanvasTexture(cv);
  const shells = [0, 1].map((i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, opacity: .5 })); st.scene.add(s); return s; }); const rings = []; for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .035, 8, 90), new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); m.rotation.x = Math.PI / 2; st.scene.add(m); rings.push(m); }
  const sparks = new Particles(st.scene, 120, 0xffe07a, .06, { rough: 1, emissive: 0xffc030 }); const pig = new Particles(st.scene, 12, 0x9aa0aa, .14, { rough: 1 }); const bread = new Particles(st.scene, 12, 0xd9a35a, .09, { rough: 1 });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(18, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff1b0, fog: false })); sun.position.set(-190, 150, 420); st.scene.add(sun);
  const M = [0, 1, 4, 8, 12, 16, 20, 24, 24]; const NOTE = ['npc', 'slightly cooler than your friends', 'barista has your order', 'pigeons respect you', 'main character', 'the sun is concerned', 'gravity is optional', 'legally a deity', 'legally a deity'];
  const L = tl.beats.length;
  return { frame({ t, bi, lt, p }) {
    const m = lerp(M[bi], M[bi + 1] ?? M[bi], smooth(p)); const k = clamp(m / 24), aura = 100 * Math.pow(2, m);
    const HX = 0, HZ = 6; h.x = HX; h.z = HZ; h.yaw = 0; h.anim = 'idle'; h.speed = .6; h.y = bi >= 6 ? .15 + .3 * Math.sin(t * 1.5) + (bi - 6 + p) * .5 : 0; h.extra = 0; hero.update(t);
    sg.position.set(HX, h.y + 1.25 * 1.0 * 1.0 + .66 * 1.25 * .0 + 1.25 * .93 - 1.25 * .0, HZ + .28 * 1.25); sg.position.y = h.y + 2.3; sg.position.z = HZ + .31; sg.visible = false;
    const R0 = .8 + k * 7 * (.4 + .6 * k); const cy = h.y + 1.3; shells.forEach((s, i) => { s.position.set(HX, cy + .2, HZ - 1.6); s.scale.setScalar((2.5 + R0 * 2.2) * (i ? 1.6 : 1) * (1 + .04 * Math.sin(t * 6 + i))); s.material.opacity = (.18 + .5 * k) * (i ? .5 : 1); });
    rings.forEach((g, i) => { const u = ((t * (.4 + k) + i / 4) % 1); g.position.set(HX, cy - .9 + u * .3, HZ); g.scale.setScalar(.6 + u * R0 * 2.8); g.material.opacity = (1 - u) * .5 * clamp(k * 3 + .1); });
    // people: stare, bow, then float in orbit
    for (let i = 0; i < NP; i++) { const o = ppl.p[i], q = pp[i]; o.scale = 1; o.vis = true; let x = q.x, z = q.z, y = 0, anim = 'idle';
      if (bi >= 6) { const a = q.a0 + t * (.3 + k * .2), rad = q.rad * .9; x = HX + Math.cos(a) * rad; z = HZ + Math.sin(a) * rad; y = 1.2 + Math.sin(t * 1.2 + q.ph) * .8 + (bi - 6 + p) * .8; anim = 'panic'; o.speed = .3; }
      else if (bi >= 3) { anim = 'bend'; o.speed = .4; } else { o.speed = .5; }
      o.x = x; o.z = z; o.y = y; o.yaw = Math.atan2(HX - x, HZ - z); o.anim = anim; o.extra = 0; } ppl.update(t);
    city.updateCrowd(t, null);
    // gravity beat: parked cars orbit the hero's head
    city.cars.forEach((c, i) => { if (bi >= 6) { const a = t * (.6 + (i % 4) * .1) + i; const rad = 5 + (i % 5) * 1.3, up = 3 + (i % 4) * 1.1 + (bi - 6 + p) * 1.5; c.m.position.set(HX + Math.cos(a) * rad, up, HZ + Math.sin(a) * rad); c.m.rotation.y = -a; c.m.rotation.z = Math.sin(a * 2) * .5; } else { c.m.position.y = 0; c.m.position.z = c.z0; c.m.rotation.z = 0; c.m.rotation.y = c.x > 0 ? 0 : Math.PI; c.m.position.x = c.x; } });
    for (let i = 0; i < 120; i++) { const a = t * .9 + i * 2.39996, u = ((t * .35 + i * .0833) % 1); const rad = R0 * (.4 + u); sparks.set(i, HX + Math.cos(a) * rad, cy - 1 + u * (2 + k * 5), HZ + Math.sin(a) * rad, k > .02 ? (1 - u) * (.4 + k) : 0); } sparks.done();
    for (let i = 0; i < 12; i++) { const on = bi === 2 || bi === 3; const a = t * 2 + i; const x = HX + Math.cos(i * 1.7) * 2.2 + Math.sin(a) * .1, z = HZ + 2.0 + Math.sin(i * 2.1) * 1.5, y = .12 + (on ? 0 : -9) + Math.abs(Math.sin(a * 3 + i)) * .1; pig.set(i, x, y, z, on ? 1 : 0); bread.set(i, HX + Math.cos(i * 1.7) * 1.1, on && bi >= 2 ? .1 + (i % 3) * .01 : -9, HZ + 1.0 + Math.sin(i * 2.1) * .6, on ? 1 : 0); } pig.done(); bread.done();
    // sun gets concerned, then dims
    const dim = clamp((m - 14) / 5); st.sun.intensity = lerp(2.8, .35, dim); st.hemi.intensity = lerp(.58, .2, dim); sun.material.color.set(new THREE.Color(0xfff1b0).lerp(new THREE.Color(0x553020), dim)); sun.position.y = 150 - dim * 60; st.fogc.set(new THREE.Color(0xdce6ee).lerp(new THREE.Color(0x30303c), dim)); st.scene.fog.color.copy(st.fogc);
    const sh = k > .6 ? Math.sin(t * 50) * .03 * (k - .6) : 0;
    const cams = [[1.4, 1.5, 10.2, 0, 1.8, 6, 48], [-1.4, 1.5, 10, 0, 1.8, 6, 46], [2.0, 1.0, 9.5, 0, 1.2, 6.2, 52], [-2.2, 1.4, 10, 0, 1.8, 6, 48], [1.8, 1.6, 10.5, 0, 2.0, 6, 50], [-2.4, 1.3, 11, 0, 2.3, 6, 56], [3 + sh, 3.2 + p * 1.2, 16, 0, 3 + p, 6, 62], [0 + sh, 3.5, 22 - 6 * p, 0, 4.5, 6, 66], [0, 4, 20, 0, 4.5, 6, 66]];
    st.cam(...cams[Math.min(bi, 8)]); st.follow(0, 6); st.render();
    hud.style('C'); hud.question('What if your *aura* doubled every minute?', 1, bi > 0);
    if (bi === 0 && lt < 1.0) hud.counter('', '', ''); else { hud.counter('Minute ' + Math.floor(m) + ' · Aura', fmt(aura) + ' pts', NOTE[bi], '×2 every minute', k > .5); hud.tm(''); }
    const POP = ['', 'THE USUAL, SIR?', 'THE PIGEONS??', 'HE APOLOGIZED TO THE FLOOR', 'HER BLESSING??', 'SUN: MY BAD', 'MOM: FINALLY', 'A GAS GIANT. FAIR.'][bi] || ''; hud.pop(POP && lt > .5 ? POP : '', Math.min(1, (lt - .5) * 6));
  } };
}
