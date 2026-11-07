// What if you had to shit every time someone said your name? Dave, at the gym, then the city.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, Crowd, Particles, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const st = makeStage({ shadowExtent: 50, fogNear: 140, fogFar: 520 }); const city = buildStreet(st.scene, { seed: 7 });
  const hero = new Crowd(st.scene, 1, 41); const h = hero.p[0]; h.scale = 1.2; h.shirt.set(0x3f7fd6); h.pants.set(0x2a2f3c); for (const k of ['torso', 'armL', 'armR']) { hero.parts[k].setColorAt(0, h.shirt); hero.parts[k].instanceColor.needsUpdate = true; } for (const k of ['legL', 'legR']) { hero.parts[k].setColorAt(0, h.pants); hero.parts[k].instanceColor.needsUpdate = true; }
  const NP = 40, ppl = new Crowd(st.scene, NP, 19); const r = R(6); const pp = []; for (let i = 0; i < NP; i++) pp.push({ x: (r() < .5 ? -1 : 1) * (2.5 + r() * 5), z: 12 + r() * 9, ph: r() * 6.28 });
  const brown = new THREE.MeshStandardMaterial({ color: 0x6d4524, roughness: .5, metalness: .05 }); const pile = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(.5, 20, 14), brown); m.castShadow = true; m.receiveShadow = true; st.scene.add(m); return m; });
  const flies = new Particles(st.scene, 60, 0x111111, .05); const word = [];
  const NN = [[0, 0], [1, 1], [2, 9], [10, 12], [12, 3e6], [3e6, 8.2e9], [8.2e9, 8.2e9]];
  const CAM = [[4.2, 1.5, 12, -.2, 1.1, 8, 50], [3.6, 1.2, 11.5, -.2, 1.0, 8, 48], [4.6, 1.3, 11.5, -.3, 1.1, 8, 50], [3.8, 1.4, 12, -.2, 1.1, 8, 50], [0, 4, 15, 0, 3, 8, 62], [0, 9, 26, 0, 6, 8, 66], [0, 14, 36, 0, 8, 8, 66]];
  return { frame({ t, bi, lt, p }) {
    const n = lerp(NN[Math.min(bi, 6)][0], NN[Math.min(bi, 6)][1], smooth(p)) * (bi >= 4 ? 1 : 1); const lg = Math.log10(1 + n); const H = .25 + lg * .32 * (bi >= 5 ? 1.5 : 1);
    h.x = 0; h.z = 8; h.yaw = .9; h.anim = 'squat'; h.speed = 1; h.extra = 0; h.scale = 1.2; hero.update(t);
    const px = 0 - Math.sin(.9) * .55 * 1.2, pz = 8 - Math.cos(.9) * .55 * 1.2; [[1.0, .55, 1.0, .25], [.7, .5, .7, .62], [.4, .4, .4, .98]].forEach((c, j) => { const s = H; pile[j].scale.set(c[0] * s + .01, c[1] * s + .01, c[2] * s + .01); pile[j].position.set(px, c[3] * s * .6 + .02, pz); });
    for (let i = 0; i < NP; i++) { const o = ppl.p[i], q = pp[i]; o.x = q.x; o.z = q.z; o.y = 0; o.scale = 1; o.yaw = Math.atan2(0 - q.x, 8 - q.z); o.anim = bi >= 4 ? 'run' : (bi === 2 ? 'panic' : 'idle'); o.speed = 1; if (bi >= 4) { o.x = q.x + Math.sin(t * 2 + q.ph) * 6; o.z = q.z + ((t * 3 + q.ph * 3) % 20) - 4; o.yaw = Math.PI; } o.extra = 0; } ppl.update(t);
    city.updateCrowd(t, bi >= 4 ? 0 : null);
    for (let f = 0; f < 60; f++) { if (n < 3) { flies.set(f, 0, 0, 0, 0); continue; } const a = t * 7 + f * 2.1; flies.set(f, Math.cos(a) * (.6 + H * .4), H * .8 + .5 + Math.sin(t * 9 + f) * .3, 7.2 + Math.sin(a) * (.6 + H * .4), 1); } flies.done();
    const c = CAM[Math.min(bi, 6)]; st.cam(c[0], c[1] + (bi === 6 ? p * 3 : 0), c[2], c[3], c[4], c[5], c[6]); st.follow(0, 14); st.render();
    hud.style('C'); hud.question('What if you had to *shit* every time someone said your name?', 1, bi > 0);
    const NOTE = ['', 'gym guy said dave', 'gym situation', 'chappelle counts', '3 million other daves', 'dave day', 'do not name your kid chad'][Math.min(bi, 6)];
    if (bi === 0) hud.counter('', '', ''); else { hud.counter('Times someone said "Dave"', n < 1e6 ? fmt(n) : n < 1e9 ? (n / 1e6).toFixed(1) + ' million' : (n / 1e9).toFixed(1) + ' billion', NOTE, 'one shit each', n > 1e5); hud.tm('Shit produced: ' + (n * .128 < 1e6 ? fmt(n * .128) + ' kg' : (n * .128 / 1e6).toFixed(1) + ' thousand tonnes')); }
    const POP = ['', 'DAVE.', 'DAVE AGAIN.', 'CHAPPELLE?!', '3 MILLION DAVES', 'DAVE DAY', 'CHAD.'][Math.min(bi, 6)]; hud.pop(POP && lt > .5 ? POP : '', Math.min(1, (lt - .5) * 6));
  } };
}
