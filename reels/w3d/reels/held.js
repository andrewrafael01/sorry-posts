export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, Crowd, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ shadowExtent: 60, fogNear: 110, fogFar: 460, skyTop: 0x6f93bb, skyMid: 0xaec3d6, skyBot: 0xe5e3dc, fog: 0xd8d9d8 }); const city = buildStreet(A.scene, {}); const hero = new Crowd(A.scene, 1, 3); const crowd2 = new Crowd(A.scene, 6, 5);
  const GAS = [() => 0, (p) => 1.35 * p, (p) => 1.35 + 39420 * smooth(p), () => 39420, () => 39420, () => 39420], SZ = [() => 1, () => 1, (p) => 1 + 2 * smooth(p), (p) => 3 + 10 * smooth(p), (p) => 13 + 70 * smooth(p), (p) => 83 + 30 * p];
  return {
    frame({ t, bi, lt, p, beat }) {
      const sc = SZ[bi](p); const h = hero.p[0]; h.x = 0; h.z = 12; h.yaw = Math.PI; h.scale = sc; h.y = bi >= 5 ? 20 + 60 * p : (bi >= 4 ? 4 * smooth(p) : 0); h.anim = bi >= 4 ? 'panic' : 'idle'; h.speed = .5;
      for (let i = 0; i < 6; i++) { const o = crowd2.p[i]; o.x = -4 + i * 1.6; o.z = 8 + (i % 2) * 3; o.yaw = Math.PI; o.anim = bi >= 3 ? 'panic' : 'idle'; }
      const dist = 6 + sc * 1.6, hy = h.y + sc * .85; const cams = [[2.0, 1.7, 7.5, 0, 1.0, 12, 52], [1.6, 1.7, 8.0, 0, 1.0, 12, 50], [3.0 + sc * .6, 2.2 + sc * .5, 12 - dist, 0, hy, 12, 58], [dist * .5, 3 + sc * .6, 12 - dist, 0, hy, 12, 62], [dist * .6, h.y * .5 + sc * .5, 12 - dist * 1.1, 0, hy, 12, 62], [dist * .5, h.y * .7 + 20, 12 - dist * 1.1, 0, hy, 12, 62]];
      A.cam(...cams[bi]); A.follow(0, 12); city.updateCrowd(t, bi >= 3 ? 0 : null); hero.update(t); crowd2.update(t); A.renderer.render(A.scene, A.camera);
      hud.question('What if you *held in* every single fart for your entire life?', 1); if (bi === 0) hud.counter('', '', ''); else hud.counter('Gas trapped inside you', (GAS[bi](p) < 10 ? GAS[bi](p).toFixed(2) : fmt(GAS[bi](p))) + ' L', bi >= 3 ? '≈ ' + fmt(Math.min(560, GAS[bi](p) / 70)) + ' times your volume' : '', bi >= 2 ? 'age ' + Math.round(80 * (bi === 2 ? smooth(p) : 1)) : '', bi >= 3);
    }
  };
}
