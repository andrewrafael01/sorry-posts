// What if every human took a shit at the same time (8.2e9 x 128 g = 1.05 Mt = 3 Empire State Buildings = 29 cm over Central Park).
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, road, building, tree, Crowd, Particles, R, clamp, smooth, lerp, wander } = lib;
  const st = makeStage({ shadowExtent: 48, fogNear: 120, fogFar: 520 }); const { scene } = st; const r = R(7);
  ground(scene, 0x86a672, 1600); const sx = (x) => x;
  // park paths
  for (const [x, w] of [[0, 4.6], [-14, 3], [15, 3]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 300), new THREE.MeshStandardMaterial({ color: 0xcfc3a6, roughness: 1 })); m.rotation.x = -Math.PI / 2; m.position.set(x, .02, 90); m.receiveShadow = true; scene.add(m); }
  for (let z = -10; z < 260; z += 12) for (const s of [-1, 1]) tree(scene, s * (10 + r() * 30), z + r() * 6, .9 + r() * .5, (z * 7 + s * 3) | 0);
  for (let z = -10; z < 260; z += 30) for (const s of [-1, 1]) building(scene, s * (78 + r() * 8), z, 24, 40 + r() * 80, 24, [0xd9c7a8, 0xc9d3dc, 0xbdb2a0, 0xe0c6b0, 0xa9bccc][(r() * 5) | 0], (z * 13 + s) | 0);
  const N = 260, crowd = new Crowd(scene, N, 3); const pos = [], pos2 = [];
  for (let i = 0; i < N; i++) { pos.push([(r() - .5) * 26, 8 + r() * 72, r() * 6.28, r(), 1.0 + r() * 1.4]); pos2.push([(r() - .5) * 8, 4 + r() * 26, r() * 6.28, r(), 1.5 + r() * 2.5]); }
  // piles: three stacked blobs per person
  const brown = new THREE.MeshStandardMaterial({ color: 0x6d4524, roughness: .55, metalness: .05 });
  const pile = [0, 1, 2].map((k) => { const m = new THREE.InstancedMesh(new THREE.SphereGeometry(.5, 14, 10), brown, N); m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; scene.add(m); return m; });
  const flies = new Particles(scene, 260, 0x111111, .05); const M = new THREE.Matrix4(), HID = new THREE.Matrix4().makeScale(0, 0, 0);
  const slab = new THREE.Mesh(new THREE.PlaneGeometry(400, 400, 1, 1), new THREE.MeshStandardMaterial({ color: 0x5b3a1c, roughness: .45, metalness: .05 })); slab.rotation.x = -Math.PI / 2; slab.receiveShadow = true; scene.add(slab);
  const MASS = 8.2e9 * 0.128, fmt = (v) => Math.round(v).toLocaleString('en-US');
  return {
    frame({ t, bi, lt, p, beat, ck }) {
      const ground_ = bi === 3 || bi === 4 || bi === 6; const aer = !ground_;
      let k = 0; if (bi === 1) k = smooth(p); else if (bi === 2 || bi === 5) k = 1; else if (ground_) k = bi === 3 ? smooth(p) : 1;
      // camera
      let cam;
      if (bi === 0) cam = [0, 17 - 3 * p, 0, 0, 0, 46, 66]; else if (bi === 1) cam = [9, 13 - 2 * p, 4, 0, 0, 40, 66]; else if (bi === 2) cam = [-9, 12, 4 + 6 * p, 0, 0, 42, 66];
      else if (bi === 3) cam = [0, 1.7, -3, 0, 1.2, 20, 66]; else if (bi === 4) cam = [1.5, 1.3 + .3 * p, 2, 0, 1.2, 20, 62]; else if (bi === 5) cam = [0, 30 - 8 * p, 10, 0, 0, 60, 70]; else cam = [2.5 - 2 * p, 1.6, -2, 0, 1.0, 18, 66];
      st.cam(...cam, ); st.follow(cam[0] * .3, aer ? 40 : 14);
      slab.visible = ground_; slab.position.y = .29 * clamp(k * 1.2) + .01 * Math.sin(t);
      const nShow = aer ? N : 70;
      for (let i = 0; i < N; i++) {
        const o = crowd.p[i], q = (aer ? pos : pos2)[i]; o.vis = i < nShow;
        if (!o.vis) { for (let j = 0; j < 3; j++) pile[j].setMatrixAt(i, HID); continue; }
        o.x = q[0]; o.z = q[1]; o.yaw = q[2];
        const tp = clamp(k * 1.4 - q[3] * .4);
        if (aer) { o.anim = tp > 0 ? 'squat' : 'walk'; o.speed = 1.0; o.y = 0; if (o.anim === 'walk') { const w = wander(q[0], q[1], q[2], q[4], t, -13, 13, 8, 80); o.x = w[0]; o.z = w[1]; o.yaw = w[2]; q[5] = w; q[0] = q[0]; } else if (q[5]) { o.x = q[5][0]; o.z = q[5][1]; o.yaw = q[5][2]; } }
        else { o.anim = i % 2 === 0 ? 'run' : 'panic'; o.speed = 1.3; const w = wander(q[0], q[1], q[2], q[4], t, -5, 5, 3, 28); o.x = w[0]; o.z = w[1]; o.yaw = w[2]; o.y = .29 * clamp(k * 1.2); }
        if (aer && tp > 0) { const px = o.x - Math.sin(o.yaw) * .45, pz = o.z - Math.cos(o.yaw) * .45; const s = tp; const sc = [[.9, .5, .9, 0.25], [.62, .42, .62, .62], [.34, .34, .34, .98]];
          sc.forEach((c, j) => { M.makeScale(c[0] * s + .01, c[1] * s + .01, c[2] * s + .01); M.setPosition(px, c[3] * s * .6 + .1, pz); pile[j].setMatrixAt(i, M); }); }
        else for (let j = 0; j < 3; j++) pile[j].setMatrixAt(i, HID);
      }
      crowd.update(t); pile.forEach((m) => (m.instanceMatrix.needsUpdate = true));
      // flies
      for (let f = 0; f < 260; f++) { const i = f % N, o = crowd.p[i]; if (!o.vis || (aer && k < .35) || (!aer && f > 120)) { flies.set(f, 0, 0, 0, 0); continue; } const a = t * 6 + f * 2.1; flies.set(f, o.x + Math.cos(a) * .5, (aer ? .9 : 1.5) + Math.sin(t * 9 + f) * .25, o.z + Math.sin(a) * .5, 1); }
      flies.done(); st.renderer.render(scene, st.camera);
      // HUD
      hud.question('What if every human on Earth took a *shit* at the same time?', 1, bi > 0);
      if (bi === 1) hud.counter('Shit produced', fmt(MASS * smooth(p * 1.1)) + ' kg', '8.2 billion people · 128 g each');
      else if (bi === 2) hud.counter('Shit produced', fmt(MASS) + ' kg', 'three empire state buildings');
      else if (bi === 3) hud.counter('Depth over Central Park', Math.round(29 * smooth(p * 1.2)) + ' cm', 'of shit');
      else if (bi >= 4) hud.counter(bi === 5 ? 'Shit produced' : 'Depth over Central Park', bi === 5 ? fmt(MASS) + ' kg' : '29 cm', bi === 5 ? '' : 'of shit'); else hud.counter('', '', '');
    }
  };
}
