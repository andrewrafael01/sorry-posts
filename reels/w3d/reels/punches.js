export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, road, tree, Crowd, buildEarth, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ shadowExtent: 60, fogNear: 100, fogFar: 380 }); ground(A.scene, 0x86b86c, 1600); road(A.scene, 0, 120, 8, 500); const r = R(3); for (let z = 10; z < 240; z += 16) for (const s of [-1, 1]) tree(A.scene, s * (8 + r() * 6), z, .9 + r() * .4, z | 0);
  const line = new Crowd(A.scene, 300, 21), hero = new Crowd(A.scene, 1, 6);
  for (let i = 0; i < 300; i++) { const o = line.p[i]; o.x = 0; o.z = 1.1 + i * .62; o.yaw = Math.PI; o.anim = i === 0 ? 'punch' : 'idle'; o.phase = i * .13; }
  const hp = hero.p[0]; hp.x = 0; hp.z = 0; hp.yaw = 0; hp.anim = 'idle'; hp.shirt.set(0xffd13a);
  const C = makeStage({ clouds: false, skyTop: 0x020409, skyMid: 0x020409, skyBot: 0x020409, fog: 0x020409, fogNear: 900, fogFar: 1000, hemi: .5, sunI: 3.0, sunDir: [-1, .5, .7], shadowExtent: 12 }); const sp = buildEarth(C.scene, 6);
  const rings = new THREE.Group(); C.scene.add(rings); const ringList = []; for (let k = 0; k < 122; k++) { const ph = (k / 121 - .5) * 2.5; const rad = 6.04 * Math.cos(ph), y = 6.04 * Math.sin(ph); const pts = []; for (let a = 0; a <= 64; a++) pts.push(new THREE.Vector3(Math.cos(a / 64 * 6.283) * rad, y, Math.sin(a / 64 * 6.283) * rad)); const l = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffffff })); rings.add(l); ringList.push(l); }
  const V = [[0, 3], [3, 8.2e9], [8.2e9, 8.2e9], [8.2e9, 8.2e9], [8.2e9, 8.2e9], [8.2e9, 8.2e9]];
  return {
    frame({ t, bi, lt, p, beat }) {
      if (bi === 3) { C.cam(0, 0, 34, 0, 0, 0, 40); C.follow(0, 0); sp.earth.rotation.y = lt * .12; ringList.forEach((l, k) => (l.visible = k < 122 * p)); C.renderer.render(C.scene, C.camera); }
      else {
        const cams = [[3.2, 2.0, -2.5 + .5 * p, 0, 1.2, 8, 62], [4, 3 + 10 * p, -3 - 6 * p, 0, 1, 20 + 30 * p, 62], [0, 4 + 60 * p, -10 - 20 * p, 0, 0, 60 + 80 * p, 64], 0, [3.2, 2.0, -2.5, 0, 1.2, 8, 62], [6, 2.6 + 6 * p, -4 - 10 * p, 0, 1, 40, 60]];
        A.cam(...cams[bi]); A.follow(0, 20); line.p[0].phase = t * 0; line.update(t); hero.update(t); line.p.forEach((o, i) => { o.vis = i < 300; }); A.renderer.render(A.scene, A.camera);
      }
      hud.question('What if every human on Earth punched you once?', 1, bi > 0); if (bi === 0) hud.counter('', '', ''); else { const v = lerp(V[bi][0], V[bi][1], smooth(p)); hud.counter('Punches', fmt(v), bi === 1 ? fmt(v / 3.15e7) + ' years of punching' : bi === 2 ? 'line length 4.9 million km' : bi === 3 ? 'wraps earth 122 times' : bi === 4 ? 'still going' : ''); }
    }
  };
}
