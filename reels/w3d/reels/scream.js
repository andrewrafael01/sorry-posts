export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, buildEarth, Particles, R, clamp, smooth, lerp } = lib;
  const A = makeStage({ shadowExtent: 52, fogNear: 110, fogFar: 420 }); const city = buildStreet(A.scene, {}); const shards = new Particles(A.scene, 900, 0xe8f6ff, .09, { rough: .05, metal: .2 });
  const birds = []; const rb = R(4); for (let i = 0; i < 26; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.7, .12, .3), new THREE.MeshStandardMaterial({ color: 0x24262c })); A.scene.add(m); birds.push({ m, x: (rb() - .5) * 30, z: 8 + rb() * 60, y: 12 + rb() * 18 }); }
  const rings = []; for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .06, 8, 64), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8 })); A.scene.add(m); rings.push(m); }
  const C = makeStage({ clouds: false, skyTop: 0x020409, skyMid: 0x020409, skyBot: 0x020409, fog: 0x020409, fogNear: 900, fogFar: 1000, hemi: .5, sunI: 3.0, sunDir: [-1, .5, .7], shadowExtent: 12 }); const sp = buildEarth(C.scene, 6);
  let broke = false; const rs = R(9), sh = []; for (let i = 0; i < 900; i++) { const s = rs() < .5 ? -1 : 1; sh.push({ x: s * (14 + rs() * 24), y: 3 + rs() * 36, z: rs() * 80, vx: -s * (3 + rs() * 8), vy: 2 + rs() * 3, vz: (rs() - .5) * 4 }); }
  const setBroken = (b) => { if (b === broke) return; broke = b; city.buildings.forEach((m) => { m.material = b ? m.userData.broken : m.userData.whole; }); };
  const L = [[0, 0], [0, 110], [110, 209], [209, 209], [209, 209], [0, 0], [0, 0]];
  return {
    frame({ t, bi, lt, p, beat }) {
      if (bi === 5) { C.cam(0, 0, 34, 0, 0, 0, 40); C.follow(0, 0); sp.earth.rotation.y = lt * .12; C.renderer.render(C.scene, C.camera); }
      else {
        const shT = bi === 3 ? ((beat.words.find((w) => /wave/i.test(w[0])) || [0, 2])[1] - .2) : (bi >= 4 ? -9 : 1e9); const brk = bi >= 4 || (bi === 3 && lt > shT); setBroken(brk || bi === 6);
        const cams = [[0, 2.4, -3 + 3 * p, 0, 4.0, 40, 64], [0, 2.2, -2 + 2 * p, 0, 3.5, 40, 62], [0, 2.2, 2 * p, 0, 3.5, 40, 60], [Math.sin(t * 40) * .15, 2.2 + Math.cos(t * 44) * .15, 2, 0, 3.5, 40, 60], [0, 24 - 4 * p, -14, 0, 5, 46, 72], 0, [0, 2.4, -3 + 3 * p, 0, 4.0, 40, 64]];
        A.cam(...cams[bi]); A.follow(0, 40); city.updateCrowd(t, brk ? 0 : null);
        const tt = bi === 3 ? Math.max(0, lt - shT) : bi >= 4 ? lt + 3 : 0;
        const useRings = bi === 1 || bi === 2; rings.forEach((m, k) => { m.visible = useRings; if (useRings) { const r = (lt * 7 + k * 3.3) % 20; m.position.set(0, 1.7, 14); m.scale.setScalar(.2 + r * .55); m.material.opacity = .8 * (1 - r / 20); } });
        for (let i = 0; i < 900; i++) { if (tt > 0 && bi >= 3 && bi <= 4) { const s = sh[i]; shards.set(i, s.x + s.vx * tt, Math.max(.1, s.y + s.vy * tt - 6 * tt * tt), s.z + s.vz * tt, 1); } else shards.set(i, 0, 0, 0, 0); } shards.done();
        birds.forEach((b) => { const fall = (bi >= 3 && tt > 0) ? Math.min(b.y, 6 * tt * tt) : 0; b.m.visible = bi !== 6 || true; b.m.position.set(b.x, b.y - fall, b.z); b.m.rotation.y = t * 8 + b.z; });
        city.cars.forEach((c, i) => { const lift = (bi >= 4) ? Math.min(5, tt * 6) * Math.abs(Math.sin(c.z0)) : 0; c.m.position.y = lift; c.m.rotation.z = lift * .3; });
        A.renderer.render(A.scene, A.camera);
      }
      hud.question('What if every human on Earth *screamed* at the same time?', 1, bi > 0);
      const lo = L[bi][0], hi = L[bi][1]; if (bi === 0) hud.counter('', '', ''); else hud.counter(bi === 5 ? 'Loudness in space' : 'Loudness', Math.round(lerp(lo, hi, smooth(p))) + ' dB', bi === 5 ? 'no air. no sound.' : bi >= 3 && bi <= 4 ? 'past 194 db it is a shock wave' : '');
    }
  };
}
