import { room } from './_rooms.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, buildStreet, Crowd, Particles, R, clamp, smooth, lerp } = lib;
  const A = makeStage({ fog: 0x2a1c14, fogNear: 10, fogFar: 34, clouds: false, skyTop: 0x2a1c14, skyMid: 0x2a1c14, skyBot: 0x2a1c14, shadowExtent: 12, hemi: .7, hemiSky: 0xffd6a0, hemiGround: 0x4a2c1c, sunColor: 0xffc880, sunI: 1.5, sunDir: [-.6, .9, -.5] });
  room(lib, A.scene, { wall: 0x5b3a2a, floor: 0x7a4b2a, w: 12, d: 12 }); addBox(A.scene, 0, .55, 7.6, 11, 1.1, 1.4, 0x3a2418, { round: .05 }); addBox(A.scene, 0, 1.15, 7.6, 11.2, .1, 1.6, 0xb8793e); for (let i = 0; i < 14; i++) addBox(A.scene, -5 + i * .78, 1.45, 7.7, .22, .62, .22, [0x3fa34d, 0xe0a030, 0x9b3fa3, 0x3f78d0][i % 4], { mat: { emissive: 0x222222, roughness: .2 } });
  for (let i = 0; i < 5; i++) addBox(A.scene, -4 + i * 2, 3.0, 8.6, 1.6, .1, .3, 0xffe2a8, { mat: { emissive: 0xffd080, emissiveIntensity: 1.2 } }); for (let i = 0; i < 5; i++) addBox(A.scene, -5 + i * 2.5, 2.4, 8.7, 2, .9, .05, 0x2d1a10);
  for (const x of [-3, 3]) { const L = new THREE.PointLight(0xffc27a, 55, 14); L.position.set(x, 3, 5); A.scene.add(L); } const cr = new Crowd(A.scene, 6, 6); const fire = new Particles(A.scene, 60, 0xff8a1e, .13, { emissive: 0xff5a00, rough: .6 });
  const B = makeStage({ shadowExtent: 40, fogNear: 100, fogFar: 380, skyTop: 0xf6a96a, skyMid: 0xf5c690, skyBot: 0xfbe2c0, fog: 0xf0d8bb }); const st = buildStreet(B.scene, {}); const hero2 = new Crowd(B.scene, 1, 9); const cone = new THREE.Mesh(new THREE.ConeGeometry(.35, 1.0, 16), mat(0xff6a1a)); cone.position.set(1.4, .5, 6); cone.castShadow = true; B.scene.add(cone); const ring = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .12, 16), mat(0xffffff)); ring.position.set(1.4, .6, 6); B.scene.add(ring);
  const ABV = [0, 5, 20, 40, 80, 100, 0], NOTE = ['', 'a beer', 'a strong cocktail', 'vodka', 'bad decisions', 'a fire hazard', ''], NUM = ['', 1, 3, 4, 5, 6, ''];
  return {
    frame({ t, bi, lt, p }) {
      if (bi === 6) { B.cam(3.2, 1.6, 2.0, 0, 1.2, 6.5, 60); B.follow(0, 6); st.updateCrowd(t, null); const h = hero2.p[0]; h.x = 0; h.z = 6; h.yaw = Math.PI * .85; h.anim = 'idle'; hero2.update(t); B.renderer.render(B.scene, B.camera); }
      else {
        const amp = bi === 0 ? 0 : ABV[bi] / 100; const cams = [[.4, 1.7, 1.0, 0, 1.3, 6, 52], [.4, 1.7, .9, 0, 1.3, 6, 52], [.5, 1.8, .8, 0, 1.3, 6, 52], [.5, 1.8, .7, 0, 1.3, 6, 52], [.4, 1.9, .5, 0, 1.3, 6, 54], [.4, 1.8, .8, 0, 1.2, 6, 56]]; A.cam(...cams[bi]); A.follow(0, 6);
        cr.p.forEach((o, i) => { o.anim = 'idle'; o.speed = .6 + amp; o.vis = true; o.x = i === 0 ? 0 : [-3.5, 3.2, -2, 2.4, 4.4][i - 1]; o.z = i === 0 ? 6 : [5.4, 5.8, 3.8, 3.4, 6.2][i - 1]; o.yaw = i === 0 ? Math.PI : Math.PI + (i % 2 ? .5 : -.5); });
        const h = cr.p[0]; h.pitch = .22 * amp * Math.sin(t * 1.6) + .1 * amp; h.yaw = Math.PI + amp * .8 * Math.sin(t * 1.3); h.x = amp * .5 * Math.sin(t * .9); cr.update(t);
        for (let i = 0; i < 60; i++) { if (bi >= 5) { const a = t * 8 + i * 1.3; fire.set(i, h.x + Math.sin(a) * .55, 1.0 + Math.abs(Math.sin(t * 7 + i)) * 1.0, 6 + Math.cos(a * .8) * .4, 1); } else fire.set(i, 0, 0, 0, 0); } fire.done(); A.renderer.render(A.scene, A.camera);
      }
      hud.question('What if every *drink* was twice as strong as the last?', 1);
      if (bi === 0 || bi === 6) hud.counter('', '', ''); else hud.counter('Drink #' + NUM[bi], ABV[bi] + '% alcohol', '≈ ' + NOTE[bi], 'twice as strong every drink', ABV[bi] >= 80);
    }
  };
}
