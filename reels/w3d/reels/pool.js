export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, tree, building, addBox, mat, Crowd, Particles, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ shadowExtent: 28, fogNear: 60, fogFar: 240 }); ground(A.scene, 0x86a672, 400);
  const dk = new THREE.Mesh(new THREE.BoxGeometry(11, .25, 8), mat(0xe6e0d2)); dk.position.set(0, .12, 8); dk.receiveShadow = true; A.scene.add(dk);
  const water = new THREE.Mesh(new THREE.BoxGeometry(9, .08, 6), new THREE.MeshStandardMaterial({ color: 0x4aa3f0, roughness: .04, metalness: .1 })); water.position.set(0, .22, 8); water.receiveShadow = true; A.scene.add(water);
  addBox(A.scene, 0, 3.4, 24, 20, 6.8, 10, 0xe9d3b8, { round: .1 }); addBox(A.scene, 0, 7.4, 24, 21.4, 1.6, 11.4, 0xa2493e, { round: .2 }); for (let i = -2; i <= 2; i++) addBox(A.scene, i * 3.6, 3.4, 18.9, 1.8, 2.2, .08, 0x6f9ecf, { mat: { roughness: .05, metalness: .5 } });
  const r = R(4); for (const x of [-12, 12, -8, 9]) tree(A.scene, x, 15 + r() * 3, 1.3, x | 0); for (let x = -13; x <= 13; x += 2.6) addBox(A.scene, x, .6, 13, .2, 1.2, .1, 0xf2f2f2);
  const cr = new Crowd(A.scene, 2, 6); const pee = new Particles(A.scene, 36, 0xf0e050, .07, { rough: .05, emissive: 0x806c00 });
  const blue = new THREE.Color(0x4aa3f0), grn = new THREE.Color(0x86c45a), yel = new THREE.Color(0xe4cd3a);
  const cams = [(p) => [-1.5, 2.2, -2, -3, 1.0, 6, 62], (p) => [-6.5 + p, 1.6, 1, -4, 1.2, 6, 58], (p) => [3 - 6 * p, 5 + 3 * p, -3, 0, .5, 8, 64], (p) => [8 - 4 * p, 7, -6, 0, .5, 9, 62], (p) => [0, 4, -4 + 2 * p, 0, .5, 9, 66], (p) => [-1.5, 2.2, -2 + 2 * p, -3, 1.0, 6, 62]];
  const FR = [() => 0, (p) => .02, (p) => smooth(p), () => 1, () => 1, () => 1]; const LIT = [() => 0, () => 1.5, (p) => 41000 * smooth(p), () => 41000, () => 41000, (p) => 41000 + 1.5 * p]; const SUB = ['', 'per day', '75 years', 'a backyard swimming pool', 'dave is fine', ''];
  return {
    frame({ t, bi, lt, p }) {
      A.cam(...cams[bi](p)); A.follow(0, 8); const f = FR[bi](p); if (f < .5) water.material.color.copy(blue).lerp(grn, f * 2); else water.material.color.copy(grn).lerp(yel, (f - .5) * 2);
      const h = cr.p[0]; h.x = -5.2; h.z = 7; h.yaw = Math.PI / 2; h.anim = 'idle'; h.shirt; const d = cr.p[1]; d.vis = bi === 4; d.x = 1.2; d.z = 8; d.y = bi === 4 ? -.55 : 0; d.yaw = -.6; d.anim = bi === 4 ? 'jump' : 'idle'; d.speed = .5; cr.update(t);
      for (let q = 0; q < 36; q++) { const u = (q / 36 + t * 1.5) % 1; pee.set(q, -4.8 + u * 4.4, 1.05 + .55 * Math.sin(u * Math.PI) - .75 * u * u, 7, 1); } pee.done();
      A.render();
      hud.question('What if you *pissed* every second of your life?', 1, bi > 0); if (bi === 0) hud.counter('', '', ''); else { const v = LIT[bi](p); hud.counter('Piss produced', v < 10 ? v.toFixed(1) + ' L' : fmt(v) + ' L', SUB[bi]); }
    }
  };
}
