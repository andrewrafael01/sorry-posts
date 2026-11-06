export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, tree, building, buildEarth, Crowd, Particles, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ shadowExtent: 48, fogNear: 120, fogFar: 520 }); ground(A.scene, 0x84b86a, 1600); const r = R(7);
  for (const [x, w] of [[0, 4.6], [-14, 3], [15, 3]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 300), new THREE.MeshStandardMaterial({ color: 0xcfc3a6, roughness: 1 })); m.rotation.x = -Math.PI / 2; m.position.set(x, .02, 90); m.receiveShadow = true; A.scene.add(m); }
  for (let z = -10; z < 260; z += 12) for (const s of [-1, 1]) tree(A.scene, s * (10 + r() * 30), z + r() * 6, .9 + r() * .5, (z * 7 + s * 3) | 0);
  for (let z = -10; z < 260; z += 30) for (const s of [-1, 1]) building(A.scene, s * (78 + r() * 8), z, 24, 40 + r() * 80, 24, [0xd9c7a8, 0xc9d3dc, 0xbdb2a0, 0xe0c6b0, 0xa9bccc][(r() * 5) | 0], (z * 13 + s) | 0);
  const N = 240, crowd = new Crowd(A.scene, N, 3); const pos = [], pos2 = []; for (let i = 0; i < N; i++) { pos.push([(r() - .5) * 26, 8 + r() * 72, r() * 6.28, r() * .6]); pos2.push([(r() - .5) * 10, 3 + r() * 20, r() * 6.28, r() * .6]); }
  const NP = 1800, chunk = new Particles(A.scene, NP, 0xb9c24a, .09, { rough: .5 }); const puddle = new THREE.InstancedMesh(new THREE.CylinderGeometry(.5, .5, .04, 14), new THREE.MeshStandardMaterial({ color: 0xa9b83e, roughness: .3 }), N); puddle.frustumCulled = false; puddle.receiveShadow = true; A.scene.add(puddle); const M = new THREE.Matrix4(), HID = new THREE.Matrix4().makeScale(0, 0, 0);
  const C = makeStage({ clouds: false, skyTop: 0x020409, skyMid: 0x020409, skyBot: 0x020409, fog: 0x020409, fogNear: 900, fogFar: 1000, hemi: .5, sunI: 3.0, sunDir: [-1, .5, .7], shadowExtent: 12 }); const sp = buildEarth(C.scene, 6);
  const K = [() => 0, (p) => p, () => 1, () => 1, () => 1, () => 1], LV = [() => 0, (p) => 4.1e9 * smooth(p), () => 4.1e9, () => 4.1e9, () => 4.1e9, () => 4.1e9];
  const cams = [(p) => [0, 17 - 3 * p, 0, 0, 0, 46, 66], (p) => [8, 12, 4, 0, 0, 40, 66], (p) => [-9, 12 - 2 * p, 6 + 6 * p, 0, 0, 42, 66], (p) => [0, 30 - 8 * p, 10, 0, 0, 60, 70], 0, (p) => [2.5, 3.2, -3, 0, 1.0, 16, 66]];
  return {
    frame({ t, bi, lt, p }) {
      if (bi === 4) { C.cam(0, 0, 34, 0, 0, 0, 40); C.follow(0, 0); sp.earth.rotation.y = lt * .12; C.renderer.render(C.scene, C.camera); }
      else {
        const ground_ = bi === 5; const k = K[bi](p); A.cam(...cams[bi](p)); A.follow(0, ground_ ? 14 : 40); const show = ground_ ? 60 : N; let pi = 0;
        for (let i = 0; i < N; i++) { const o = crowd.p[i], q = (ground_ ? pos2 : pos)[i]; o.vis = i < show; if (!o.vis) { puddle.setMatrixAt(i, HID); continue; } o.x = q[0]; o.z = q[1]; o.yaw = q[2]; const on = k > q[3]; o.anim = on ? 'bend' : 'walk'; o.speed = .6;
          if (on) { for (let c = 0; c < 7 && pi < NP; c++) { const u = ((t * 1.6 + c * .13 + i * .07) % 1); chunk.set(pi++, o.x + Math.sin(o.yaw) * (.6 + .9 * u), 1.0 - 1.0 * u * u + .25, o.z + Math.cos(o.yaw) * (.6 + .9 * u), 1); } M.makeScale(1, 1, 1); M.setPosition(o.x + Math.sin(o.yaw) * 1.3, .03, o.z + Math.cos(o.yaw) * 1.3); puddle.setMatrixAt(i, M); } else puddle.setMatrixAt(i, HID); }
        for (; pi < NP; pi++) chunk.set(pi, 0, 0, 0, 0); chunk.done(); puddle.instanceMatrix.needsUpdate = true; crowd.update(t); A.renderer.render(A.scene, A.camera);
      }
      hud.question('What if every human on Earth puked at the same time?', 1, bi > 0); if (bi === 0) hud.counter('', '', ''); else { const l = LV[bi](p); hud.counter('Puke', fmt(l) + ' L', '= ' + fmt(l / 2.5e6) + ' olympic pools'); }
    }
  };
}
