export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, tree, mat, addBox, Crowd, Particles, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ shadowExtent: 34, fogNear: 80, fogFar: 300 }); ground(A.scene, 0x86a672, 600); const r = R(6);
  const path = new THREE.Mesh(new THREE.PlaneGeometry(6, 120), new THREE.MeshStandardMaterial({ color: 0xcfc3a6, roughness: 1 })); path.rotation.x = -Math.PI / 2; path.position.set(0, .02, 20); path.receiveShadow = true; A.scene.add(path);
  for (let q = 0; q < 10; q++) tree(A.scene, q % 2 ? -13 : 14, 4 + q * 7, 1.3, q);
  const brown = new THREE.MeshStandardMaterial({ color: 0x6d4524, roughness: .55 }); const pile = [0, 1, 2, 3].map((k) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.5, 24, 16), brown); m.castShadow = true; m.receiveShadow = true; A.scene.add(m); return m; });
  const mkHippo = (sc) => { const g = new THREE.Group(); const gm = mat(0x8c7f98, { roughness: .6 }); const add = (geo, x, y, z, col) => { const m = new THREE.Mesh(geo, col || gm); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m; };
    const body = add(new THREE.SphereGeometry(1, 24, 16), 0, 1.35, 0); body.scale.set(1.15, .95, 1.8); add(new THREE.SphereGeometry(.75, 20, 14), 0, 1.45, 1.9).scale.set(1.0, .85, 1.1); add(new THREE.SphereGeometry(.6, 16, 12), 0, 1.0, 2.7, mat(0xb08a9a)).scale.set(1.1, .7, .9);
    for (const ex of [-.4, .4]) { add(new THREE.SphereGeometry(.09, 8, 8), ex, 1.95, 2.0, mat(0x14141a)); add(new THREE.SphereGeometry(.16, 8, 8), ex * 1.3, 2.2, 1.65); }
    for (const lx of [-.7, .7]) for (const lz of [-1.1, 1.1]) { const l = add(new THREE.CylinderGeometry(.34, .38, .8, 12), lx, .4, lz); }
    g.scale.setScalar(sc); A.scene.add(g); return g; };
  const hp = [mkHippo(1), mkHippo(1), mkHippo(.55)]; hp.forEach((h) => (h.visible = false)); const spr = new Particles(A.scene, 40, 0x6d4524, .1, { rough: .6 });
  const hero = new Crowd(A.scene, 1, 6);
  const PF = [() => 0, (p) => .08 * p, (p) => .1 + .9 * smooth(p), () => 1, () => 1, () => 1]; const MS = [() => 0, (p) => .128 * (1 + 364 * p), (p) => 3738 * smooth(p), () => 3738, () => 3738, () => 3738]; const SB = ['age 0', 'year one', 'age 80', 'two and a half hippos', 'hippos do it better', ''];
  const cams = [(p) => [2.5, 2.6, -2.5, -1, 1.2, 8, 64], (p) => [3.5 - p, 2.6, -1.5, -2, 1.0, 8, 62], (p) => [4 + 5 * p, 3 + 3 * p, -4, -1, 1.5, 9, 64], (p) => [14 - 6 * p, 4, 2, 6, 1.4, 12, 64], (p) => [12, 2.6, 4 + 2 * p, 8, 1.5, 12, 58], (p) => [2.5, 2.6 + 6 * p, -2.5 - 6 * p, -1, 1.2, 10, 66]];
  return {
    frame({ t, bi, lt, p }) {
      const f = PF[bi](p); A.cam(...cams[bi](p)); A.follow(2, 8);
      const h = 4.2 * f; [[1.0, 1.9, .55], [.66, 1.4, .8], [.36, 1.0, 1.0]].forEach((c, k) => { const m = pile[k]; const s = f; m.scale.set((1.6 + 3 * f) * c[0] * (k ? .8 : 1) + .01, (.9 + h * .45) * (k === 0 ? 1 : .6) + .01, (1.5 + 3 * f) * c[0] * (k ? .8 : 1) + .01); m.position.set(-3, k === 0 ? .4 : (k === 1 ? .6 + h * .28 : .9 + h * .5), 8); }); pile[3].visible = false;
      const hr = hero.p[0]; hr.x = 1.6; hr.z = 6; hr.yaw = -Math.PI / 2; hr.anim = 'idle'; hero.update(t);
      hp[0].visible = f > .45; hp[0].position.set(8.5, 0, 11); hp[0].rotation.y = Math.PI; hp[1].visible = f > .75; hp[1].position.set(8.5, 0, 16); hp[1].rotation.y = Math.PI; hp[2].visible = f > .95; hp[2].position.set(12.5, 0, 13.5); hp[2].rotation.y = Math.PI;
      for (let i = 0; i < 40; i++) { if (bi === 4) { const a = t * 9 + i * .7; spr.set(i, 8.5 + Math.sin(a) * .8, 1.6 + Math.cos(a) * .35, 11 - 1.9 - (i % 8) * .22, 1); } else spr.set(i, 0, 0, 0, 0); } spr.done();
      A.render(); hud.question('What if you *kept* every shit you ever took?', 1, bi > 0); if (bi === 0) hud.counter('', '', ''); else hud.counter('You shat', fmt(MS[bi](p)) + ' kg', SB[bi]);
    }
  };
}
