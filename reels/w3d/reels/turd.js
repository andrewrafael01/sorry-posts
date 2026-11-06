export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, Crowd, building, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ shadowExtent: 110, shadowRes: 2048, fogNear: 200, fogFar: 700, skyTop: 0x6f93bb, skyMid: 0xaec3d6, skyBot: 0xe5e3dc, fog: 0xd8d9d8 }); const city = buildStreet(A.scene, {}); const r = R(8);
  for (let z = -10; z < 260; z += 34) for (const s of [-1, 1]) building(A.scene, s * 52, z, 22, 40 + r() * 70, 22, [0xd9c7a8, 0xc9d3dc, 0xbdb2a0, 0xe0c6b0][(r() * 4) | 0], z | 0);
  const brown = new THREE.MeshStandardMaterial({ color: 0x6d4524, roughness: .5, metalness: .05 }); const coil = new THREE.Group(); const rings = [[52, 20, 0], [44, 18, 24], [34, 16, 46], [24, 13, 64], [14, 10, 78], [7, 7, 88]];
  rings.forEach(([rad, tube, y]) => { const m = new THREE.Mesh(new THREE.TorusGeometry(rad, tube, 18, 40), brown); m.rotation.x = Math.PI / 2; m.position.y = y + tube * .6; m.castShadow = true; m.receiveShadow = true; coil.add(m); }); const tip = new THREE.Mesh(new THREE.ConeGeometry(8, 22, 18), brown); tip.position.y = 100; tip.castShadow = true; coil.add(tip); coil.position.set(0, 0, 70); A.scene.add(coil);
  // Statue of Liberty stand-in: a green figure 93 m tall
  const green = new THREE.MeshStandardMaterial({ color: 0x6fb39b, roughness: .6 }); const sg = new THREE.Group(); const pedestal = new THREE.Mesh(new THREE.BoxGeometry(12, 47, 12), new THREE.MeshStandardMaterial({ color: 0xcfc7b8 })); pedestal.position.y = 23; sg.add(pedestal); const body = new THREE.Mesh(new THREE.CylinderGeometry(4, 6, 30, 10), green); body.position.y = 62; sg.add(body); const head = new THREE.Mesh(new THREE.SphereGeometry(3.4, 12, 10), green); head.position.y = 80; sg.add(head); const torch = new THREE.Mesh(new THREE.CylinderGeometry(.8, .8, 14, 8), green); torch.position.set(4, 88, 0); sg.add(torch); sg.traverse((m) => { m.castShadow = true; }); sg.position.set(-70, 0, 70); A.scene.add(sg);
  const hero = new Crowd(A.scene, 3, 2); const HT = [() => 0, (p) => 20 * smooth(p), (p) => 20 + 104 * smooth(p), () => 124, () => 124, () => 124];
  return {
    frame({ t, bi, lt, p }) {
      const s = bi === 0 ? .02 : bi === 1 ? .02 + .5 * smooth(p) : bi === 2 ? .5 + .5 * smooth(p) : 1; coil.scale.setScalar(s); coil.position.y = bi >= 4 ? -Math.min(8, lt * 3) : 0; sg.visible = bi >= 2;
      const cams = [[8, 2, 4, 0, 2, 20, 60], [0, 18, -34, 0, 24, 70, 62], [0, 46, -60, 0, 44, 70, 62], [-30, 58, -64, -38, 56, 70, 64], [10, 54, -20, 0, 52, 70, 66], [0, 150, -140, 0, 40, 70, 60]]; A.cam(...cams[bi]); A.follow(0, 60);
      city.updateCrowd(t, bi >= 4 ? 0 : null); for (let i = 0; i < 3; i++) { const o = hero.p[i]; o.vis = bi === 0; o.x = -1 + i; o.z = 8; o.yaw = Math.PI; o.anim = 'idle'; } hero.update(t); A.renderer.render(A.scene, A.camera);
      hud.question('What if one day of human *shit* became one giant turd?', 1); if (bi === 0) hud.counter('', '', ''); else hud.counter('Height of the turd', Math.round(HT[bi](p)) + ' m', bi >= 3 ? '≈ bigger than the statue of liberty (93 m)' : '≈ about a million cubic meters of shit', '8.2 billion people · 128 g each', bi >= 3);
    }
  };
}
