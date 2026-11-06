import { gym } from './_rooms.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, buildStreet, Crowd, Particles, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ fog: 0xf1eadf, fogNear: 24, fogFar: 70, clouds: false, skyTop: 0xf1eadf, skyMid: 0xf1eadf, skyBot: 0xf1eadf, shadowExtent: 12, hemi: 1.3, sunI: 1.8 }); const g = gym(lib, A.scene);
  const cr = new Crowd(A.scene, 6, 2); const fire = new Particles(A.scene, 40, 0xff8a1e, .05, { emissive: 0xff5a00, rough: .6 });
  const B = makeStage({ shadowExtent: 52, fogNear: 110, fogFar: 420 }); const city = buildStreet(B.scene, {}); const hero = new Crowd(B.scene, 1, 8); const trail = new Particles(B.scene, 60, 0xff9a2a, .16, { emissive: 0xff5a00, rough: .6 });
  const SP = [[1, 4], [5, 12], [15, 22], [36, 45], [90, 110], [250, 320], [320, 387], [1, 4]];
  return {
    frame({ t, bi, lt, p, beat }) {
      const fly = bi === 6; const sp = lerp(SP[bi][0], SP[bi][1], p);
      if (!fly) {
        const cams = [[3.2, 2.0, .5, 0, 1.0, 4.0, 66], [3.0 - p, 1.9, .8, 0, 1.0, 4.0, 66], [2.6, 1.7, 1.3, 0, 1.0, 4.0, 62], [2.4, 1.6, 1.8, 0, 1.1, 4.0, 60], [2.8, 1.9, 0.6, 0, 1.0, 4.0, 62], [2.6 + Math.sin(t * 50) * .06, 1.8, 0.8, 0, 1.0, 4.0, 62], 0, [3.2, 2.0, .5, 0, 1.0, 4.0, 66]];
        A.cam(...cams[bi]); A.follow(0, 4);
        const h = cr.p[0]; h.x = 0; h.z = 3.6; h.y = .5; h.yaw = 0; h.anim = sp > 80 ? 'sprint' : sp > 7 ? 'run' : 'walk'; h.speed = Math.min(2.2, .25 + sp / 40); h.shirt;
        const ons = [[-5, 6.0], [-4.2, 3.0], [5.0, 5.2], [4.4, 2.2], [-6, 4.4]]; ons.forEach((q, i) => { const o = cr.p[i + 1]; o.x = q[0]; o.z = q[1]; o.yaw = q[0] < 0 ? Math.PI / 2 : -Math.PI / 2; o.anim = sp > 150 ? 'panic' : 'idle'; });
        cr.update(t); g.stripes.forEach((s, k) => { s.position.z = 2.6 + ((k * .27 + t * sp * .28) % 2.7); });
        for (let i = 0; i < 40; i++) { if (sp > 80) fire.set(i, ((i * 37) % 9) / 40 - .1, .6 + (i % 5) * .13 + Math.abs(Math.sin(t * 20 + i)) * .15, 3.5 - (i % 4) * .12, 1); else fire.set(i, 0, 0, 0, 0); } fire.done();
        A.renderer.render(A.scene, A.camera);
      } else {
        const z = -6 + lt * 40; B.cam(8, 6, z - 16, 0, 3, z + 14, 66); B.follow(0, z); city.updateCrowd(t, 0);
        const h = hero.p[0]; h.x = 0; h.z = z; h.y = 1.6 + Math.sin(lt * 3) * .2; h.yaw = 0; h.anim = 'panic'; h.speed = 1.2; hero.update(t);
        for (let i = 0; i < 60; i++) trail.set(i, ((i * 13) % 5) / 3 - .8, 1.4 + (i % 4) * .2, z - 1.2 - i * .35, 1 - i * .012); trail.done(); city.cars.forEach((c) => { c.m.position.z = c.z0; });
        B.renderer.render(B.scene, B.camera);
      }
      hud.question('What if a treadmill got 1 km/h faster every minute?', 1, bi > 0); if (bi === 0) hud.counter('', '', ''); else hud.counter('Treadmill speed', fly ? '387 km/h' : fmt(sp) + ' km/h', fly ? 'out of the building' : 'minute ' + Math.floor(sp));
    }
  };
}
