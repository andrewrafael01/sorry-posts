// No Nut November battle royale (format: 100 men drop in, kill feed, last one standing). Non-explicit; all jokes are in the words.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, tree, building, Crowd, Particles, R, clamp, smooth, lerp, wander } = lib;
  const r = R(77);
  const mkWorld = (o) => {
    globalThis.__night = !!o.night; const st = makeStage(Object.assign({ shadowExtent: 55, fogNear: 120, fogFar: 600, clouds: !o.night }, o.stage)); const S = st.scene;
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), new THREE.MeshStandardMaterial({ color: o.sea ?? 0x2f78c8, roughness: .25, metalness: .1 })); sea.rotation.x = -Math.PI / 2; sea.position.y = -.5; S.add(sea);
    const isle = new THREE.Mesh(new THREE.CylinderGeometry(95, 100, 1.2, 56), new THREE.MeshStandardMaterial({ color: o.grass ?? 0x6fc04a, roughness: 1 })); isle.position.y = -.7; isle.receiveShadow = true; S.add(isle);
    const sand = new THREE.Mesh(new THREE.CylinderGeometry(104, 106, 1.0, 56), new THREE.MeshStandardMaterial({ color: 0xe6d3a0, roughness: 1 })); sand.position.y = -.8; S.add(sand);
    const rr = R(5); for (let i = 0; i < 46; i++) { const a = rr() * 6.283, d = 10 + rr() * 80; tree(S, Math.cos(a) * d, Math.sin(a) * d, 1.2 + rr() * .8, i * 13); }
    for (let i = 0; i < 8; i++) { const a = rr() * 6.283, d = 25 + rr() * 55; const hill = new THREE.Mesh(new THREE.SphereGeometry(6 + rr() * 7, 20, 14), new THREE.MeshStandardMaterial({ color: o.hill ?? 0x5eae3f, roughness: 1 })); hill.scale.y = .45; hill.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); hill.castShadow = true; hill.receiveShadow = true; S.add(hill); }
    const crowd = new Crowd(S, 100, 21); const RED = new THREE.Color(0xd8362f); crowd.p.forEach((p, i) => { p.shirt.copy(RED); ['torso', 'armL', 'armR'].forEach((k) => crowd.parts[k].setColorAt(i, RED)); }); ['torso', 'armL', 'armR'].forEach((k) => (crowd.parts[k].instanceColor.needsUpdate = true));
    return { st, S, crowd };
  };
  const SUN = mkWorld({ stage: { skyTop: 0x6a4fa0, skyMid: 0xe0807a, skyBot: 0xf8c77a, fog: 0xf0b080, sunColor: 0xffa860, sunDir: [-.6, .22, -.5], sunI: 2.6, hemi: .9, exposure: 1.1 }, sea: 0x3c6fb8 });
  const DAY = mkWorld({ stage: { skyTop: 0x4f9bf0, skyMid: 0x9fd0f6, skyBot: 0xeaf4fa, fog: 0xcfe6f2, sunDir: [-.5, .8, -.4], sunI: 3.0 } });
  const NIGHT = mkWorld({ night: true, stage: { skyTop: 0x060a1c, skyMid: 0x0e1536, skyBot: 0x1a2250, fog: 0x0e1536, sunColor: 0x9fb4ff, sunI: .9, hemi: .5, sunDir: [.4, .7, .3], exposure: 1.3 }, grass: 0x2c5a30, hill: 0x24502a, sea: 0x0a1c40 });
  // wifi hill beam (day world)
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(3, 5, 90, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0x9dff7a, transparent: true, opacity: .32, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); beam.position.set(32, 45, 30); DAY.S.add(beam);
  // the package (day world)
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.1, .9, 1.1), new THREE.MeshStandardMaterial({ color: 0xc89a5a, roughness: .8 })); box.position.set(0, .45, 0); box.castShadow = true; DAY.S.add(box); const tape = new THREE.Mesh(new THREE.BoxGeometry(1.12, .02, .2), new THREE.MeshStandardMaterial({ color: 0xe9d8b0 })); tape.position.set(0, .91, 0); DAY.S.add(tape);
  const boxGlow = new THREE.PointLight(0xff4fd8, 0, 14); boxGlow.position.set(0, 1.2, 0); DAY.S.add(boxGlow);
  // shower (day world)
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 3, 8), new THREE.MeshStandardMaterial({ color: 0xcfd6dd, metalness: .8, roughness: .3 })); pipe.position.set(60, 1.5, 0); DAY.S.add(pipe); const head = new THREE.Mesh(new THREE.ConeGeometry(.35, .25, 16), pipe.material); head.position.set(60.3, 3.05, 0); head.rotation.z = -.3; DAY.S.add(head);
  const drops = new Particles(DAY.S, 120, 0x9fd8ff, .035, { rough: .1 }); const puff = new Particles(DAY.S, 100, 0xffffff, .5, { rough: 1 }), puffS = new Particles(SUN.S, 20, 0xffffff, .5, { rough: 1 }), puffN = new Particles(NIGHT.S, 20, 0xffffff, .5, { rough: 1 });
  const tears = new Particles(SUN.S, 14, 0x7fc8ff, .04, { rough: .1 }); const conf = new Particles(NIGHT.S, 160, 0xffd23f, .07, { rough: .6, emissive: 0x403000 });
  // library (night world)
  globalThis.__night = true; const lib1 = building(NIGHT.S, 0, 12, 18, 12, 10, 0xb9a98a, 5); lib1.position.set(0, 6, -12);
  const sign = new THREE.Mesh(new THREE.BoxGeometry(6, 1.0, .3), new THREE.MeshStandardMaterial({ color: 0xfff1b0, emissive: 0xffd070, emissiveIntensity: 1 })); sign.position.set(0, 2.6, -6.8); NIGHT.S.add(sign);
  const lamp = new THREE.PointLight(0xffd9a0, 8, 22); lamp.position.set(0, 4, 3); NIGHT.S.add(lamp);
  // parachutes (sunset world)
  const chute = new THREE.InstancedMesh(new THREE.SphereGeometry(1.7, 14, 8, 0, 6.283, 0, 1.6), new THREE.MeshStandardMaterial({ roughness: .8, side: THREE.DoubleSide }), 100); chute.frustumCulled = false; chute.castShadow = true; SUN.S.add(chute); const cc = new THREE.Color(); const PCOL = [0x2ea84f, 0xf2762e, 0xe84a8a, 0x3c8fe8, 0xf2d03c, 0x8a4fe8]; for (let i = 0; i < 100; i++) { cc.set(PCOL[i % PCOL.length]); chute.setColorAt(i, cc); } chute.instanceColor.needsUpdate = true;
  const A = [[100, 100], [100, 96], [96, 62], [62, 41], [41, 12], [12, 2], [2, 1], [1, 1], [1, 1]];
  const aliveAt = (bi, p) => { const a = A[Math.min(bi, 8)]; return Math.floor(lerp(a[0], a[1], smooth(bi === 4 ? clamp((p - .5) / .5) : p)) + .0001); };
  const starts = []; { let c = 0; for (const bt of tl.beats) { starts.push(c); c += bt.dur; } }
  const NB = tl.beats.length; const aliveT = (t) => { let k = 0; for (let i = 0; i < NB; i++) if (t >= starts[i]) k = i; return aliveAt(Math.min(k, 7), clamp((t - starts[k]) / (tl.beats[k].dur || 1))); };
  const deathT = new Array(100).fill(1e9); { const dtl = tl.beats[NB - 1].start ?? (starts[NB - 1] + tl.beats[NB - 1].dur); for (let t = 0; t < starts[NB - 1] + tl.beats[NB - 1].dur + 1; t += 1 / 30) { const a = aliveT(t); for (let i = a; i < 100; i++) if (deathT[i] === 1e9) deathT[i] = t; } }
  const DAYS = ['DAY 1 · 9:00 AM', 'DAY 1 · 9:15 AM', 'DAY 4 · 4:00 PM', 'DAY 15 · 2:10 PM', 'DAY 22 · 7:30 AM', 'DAY 29 · 6:00 PM', 'DAY 30 · 11:04 PM', 'DEC 1 · 12:01 AM'];
  const FEED = [[], [], [[2, '<b>FRANK</b> eliminated himself', .15], [2, '<b>EVAN</b> eliminated himself', .45], [2, '<b>DEV</b> was eliminated by <b>WIFI</b>', .75]], [[3, '<b>BRAD</b> was eliminated by <b>A PACKAGE</b>', .5]], [[4, '<b>XAVI</b> was eliminated by <b>A WARM SHOWER</b>', .55], [4, '<b>CHAD</b> eliminated himself', .8]], [[5, '<b>KYLE</b> was eliminated by <b>HIS EX\'S STORY</b>', .2]], [[6, '<b>LAST MAN STANDING</b>', .5]], []];
  const worlds = [SUN, DAY, DAY, DAY, DAY, SUN, NIGHT, NIGHT]; const pcs = [puffS, puff, puff, puff, puff, puffS, puffN, puffN];
  const D = new THREE.Object3D();
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 7); const W = worlds[bi], st = W.st, crowd = W.crowd; const al = aliveAt(bi, p);
    const isChute = bi === 0;
    for (let i = 0; i < 100; i++) { const o = crowd.p[i]; o.scale = 1; o.extra = 0; o.vis = i < al || (t - deathT[i] < .35 && t >= deathT[i] - 1e-6 && false); o.y = 0; o.anim = 'run'; o.speed = 1;
      const base = wander((i * 37) % 70 - 35, (i * 53) % 70 - 35, i * 2.1, 2.2 + (i % 5) * .5, t, -60, 60, -60, 60); let x = base[0], z = base[1], yaw = base[2];
      if (isChute) { const sx = ((i * 29) % 100 - 50) * .8, sz = ((i * 47) % 60) * 1.0 + 5; x = sx; z = sz; o.y = Math.max(.5, 46 - (i % 9) * 3 - lt * 3 - (i % 4) * 4); o.anim = 'idle'; o.yaw = 0; yaw = 0; }
      else if (bi === 2) { const hx = 32, hz = 30; const u = smooth(clamp(p * 1.3 + (i % 7) * .02)); x = lerp(x, hx + Math.cos(i) * (5 - u * 4), u); z = lerp(z, hz + Math.sin(i) * (5 - u * 4), u); yaw = Math.atan2(hx - x, hz - z); }
      else if (bi === 3) { const k = i % 20; if (i < 41) { const a = k / 20 * 6.283 + t * .0; x = Math.cos(a) * 5.5; z = Math.sin(a) * 5.5; yaw = Math.atan2(-x, -z); o.anim = i % 2 ? 'idle' : 'bend'; o.speed = .4; } else { x = 80; z = 80; } }
      else if (bi === 4) { if (i === 40) { x = 60; z = 1.2; yaw = Math.PI; o.anim = p > .46 ? 'bend' : 'idle'; o.speed = .5; } else if (i >= 36 && i < 40) { x = 57 + (i - 36) * 1.8; z = -3; yaw = Math.atan2(60 - x, 0 - z); o.anim = 'idle'; o.speed = .4; } else { x = 90; z = 90; } }
      else if (bi === 5) { if (i === 0) { x = -.85; z = 0; yaw = Math.PI / 2; o.anim = 'idle'; o.speed = .3; } else if (i === 1) { x = .85; z = 0; yaw = -Math.PI / 2; o.anim = 'idle'; o.speed = .3; } else { x = 90; z = 90; } }
      else if (bi >= 6) { if (i === 0) { x = 0; z = .5; yaw = 0; o.anim = 'idle'; o.speed = .4; if (bi === 7) { o.anim = 'sprint'; o.speed = 1.4; yaw = Math.PI; z = .5 - Math.min(lt, 2.5) * 2.2; } } else { x = 90; z = 90; } }
      o.x = x; o.z = z; o.yaw = yaw; if (bi === 5 && i === 0) o.extra = .04; }
    crowd.update(t);
    // deaths: poof where they were (approx, at wander position)
    const pf = pcs[bi]; for (let i = 0; i < pf.n; i++) pf.set(i, 0, 0, 0, 0); let pi = 0; if (bi >= 1) for (let i = 0; i < 100 && pi < pf.n; i++) { const dt = t - deathT[i]; if (dt >= 0 && dt < .5 && (bi < 3 || i >= 36)) { const o = crowd.p[i]; pf.set(pi++, o.x, 1 + dt * 2, o.z, (1 - dt / .5) * 1.2); } } pf.done();
    // props animation
    beam.material.opacity = .22 + .12 * Math.sin(t * 5); box.rotation.y = t * .3; boxGlow.intensity = bi === 3 ? 20 + 15 * Math.sin(t * 6) : 0;
    for (let i = 0; i < 120; i++) { const u = ((t * 1.4 + i * .0617) % 1); drops.set(i, 60.35 + Math.sin(i * 7) * .3 * u, 3 - u * 3, Math.cos(i * 5) * .3 * u, bi === 4 ? 1 : 0); } drops.done();
    for (let i = 0; i < 14; i++) { const u = ((t * .9 + i * .071) % 1); tears.set(i, -.85 + .1 + Math.sin(i) * .05, 2.4 - u * 2.1, .24 + (i % 2) * .1, bi === 5 ? 1 : 0); } tears.done();
    for (let i = 0; i < 160; i++) { const u = ((t * .5 + i * .0625) % 1); conf.set(i, Math.cos(i * 2.4) * 5 + Math.sin(t + i) * .4, 9 - u * 9, -1 + Math.sin(i * 3.1) * 3, bi === 6 ? 1 : 0); } conf.done();
    for (let i = 0; i < 100; i++) { const o = crowd.p[i]; D.position.set(o.x, o.y + 3.1, o.z); D.scale.set(isChute && i < al ? 1 : 0, isChute && i < al ? 1 : 0, isChute && i < al ? 1 : 0); D.rotation.set(Math.sin(t + i) * .08, 0, 0); D.updateMatrix(); chute.setMatrixAt(i, D.matrix); } chute.instanceMatrix.needsUpdate = true;
    // cameras
    const ang = t * .25; const cams = [[0, 18, -26, 0, 20, 30, 60], [-14, 2.2, -8, 4, 1.4, 6, 58], [14 + p * 6, 4.5, 4, 32, 3, 30, 60], [Math.cos(ang) * 11, 13, Math.sin(ang) * 11, 0, 0, 0, 62], [53, 2.0, 5.5, 60, 1.6, 0, 52], [0, 1.4, 6.2, 0, 1.5, 0, 46], [-2.5, 1.4, 7.5, 0, 1.6, 0, 50], [0, 2.4, 7.5, 0, 1.8, -2 - Math.min(lt, 2.5) * 1.5, 60]];
    const c = cams[bi]; st.cam(...c); st.follow(c[3], c[5]); st.render();
    // HUD
    hud.question('', 0); const feed = []; for (const f of FEED[bi] || []) if (lt > f[2] * (tl.beats[bi].dur) * .0 + f[2] * 3.0 && lt < f[2] * 3.0 + 3.5) feed.push([f[1], 0, 1]);
    hud.royale(true, al, DAYS[bi], feed, [18 + (bi * 13) % 70, 18 + (bi * 29) % 60]); hud.counter('', '', '');
    hud.pop(bi === 0 && lt < 2.2 ? 'NO NUT NOVEMBER' : bi === 7 && lt > .4 ? 'BACK AT IT' : '', 1);
  } };
}
