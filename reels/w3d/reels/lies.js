import { room } from './_rooms.js';
import { puffs } from './_puffs.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, R, clamp, smooth, lerp } = lib;
  const A = makeStage({ fog: 0xe6e0d6, fogNear: 14, fogFar: 46, clouds: false, skyTop: 0xe6e0d6, skyMid: 0xe6e0d6, skyBot: 0xe6e0d6, shadowExtent: 14, hemi: 1.1, sunI: 2.0, sunDir: [-.8, .9, -.4] });
  const rooms = [0x9db6cf, 0xd8b0a4, 0xe6d3a0, 0xc9d3e0, 0xdcdcdc]; const groups = rooms.map((w, i) => { const g = new THREE.Group(); g.position.x = i * 40; A.scene.add(g); room(lib, g, { wall: w, floor: i === 1 ? 0x6a3a28 : 0xb8a58a, w: 12, d: 12 }); return g; });
  addBox(groups[0], 0, .78, 6, 3.0, .12, 1.4, 0x9b6b3f); addBox(groups[1], 0, .78, 6, 1.6, .12, 1.4, 0xffffff); addBox(groups[1], 0, 1.0, 6, .08, .3, .08, 0xffd080, { mat: { emissive: 0xffc060, emissiveIntensity: 1.5 } });
  addBox(groups[2], 0, .85, 6, 3.4, .12, 1.8, 0xc9a173); addBox(groups[3], 0, 3.6, 8.6, 9, 4, .3, 0xd9d9d9); for (let i = 0; i < 8; i++) addBox(groups[3], -4 + i * 1.15, 1.6, 8.0, .35, 3.2, .35, 0xf3f3f3);
  const cr = new Crowd(A.scene, 40, 22); const P = [puffs(lib, A.scene, 40), puffs(lib, A.scene, 40)];
  const CAM = [[.4, 1.55, 3.6, 0, 1.5, 6, 42], [.2, 1.6, 4.0, 0, 1.35, 6, 44], [40 + .3, 1.6, 3.8, 40, 1.35, 6, 44], [80 + .2, 1.7, 3.6, 80, 1.35, 6, 44], [120, 4.2, 0, 120, 1.6, 7.5, 70], [0, 1.6, 3.6, 0, 1.4, 6, 44]];
  return {
    frame({ t, bi, lt, p, beat }) {
      const room_ = [0, 0, 0, 1, 2, 3, 4][bi]; const ox = room_ * 40; const cams = [[ox + .4, 1.7, 2.6, ox, 1.45, 6, 52], [ox + .2, 1.7, 2.4, ox, 1.4, 6, 54], [ox, 1.7, 2.2, ox, 1.35, 5.2, 56], [ox, 1.7, 2.2, ox, 1.35, 5.4, 58], [ox, 4.6, 1.0, ox, 1.6, 7.5, 70], [ox, 1.8, 2.6, ox, 1.4, 6, 54]]; const ci = bi <= 5 ? bi : 5; const cc = bi === 6 ? [ox, 1.8, 2.6, ox, 1.4, 6, 54] : cams[ci]; A.cam(...cc); A.follow(ox, 6);
      const pf = beat.words.find((w) => /pfft/i.test(w[0])); const fart = pf ? lt > pf[1] + .1 : false; const k = fart ? clamp((lt - pf[1]) / 1.4) * (bi === 5 ? 3.2 : 1.1) : 0;
      cr.p.forEach((o, i) => { o.vis = false; });
      const hero = cr.p[0]; hero.vis = true; hero.x = ox; hero.z = 6; hero.yaw = Math.PI; hero.anim = 'idle'; hero.speed = .5; hero.shirt;
      const other = cr.p[1]; other.vis = bi >= 2 && bi <= 4; other.x = ox + (bi === 4 ? 1.8 : 0); other.z = bi === 3 ? 6 : (bi === 2 ? 4.4 : 6.4); other.yaw = bi === 2 ? 0 : Math.PI;
      if (bi === 2) { other.x = ox + 1.2; other.z = 5.0; other.yaw = -Math.PI / 2 - .7; hero.x = ox - 1.2; hero.z = 5.0; hero.yaw = Math.PI / 2 + .7; if (fart) other.pitch = -.2; }
      if (bi === 3) { other.x = ox + 1.2; other.z = 5.0; other.yaw = fart ? Math.PI * .5 : -Math.PI * .5; other.anim = fart ? 'walk' : 'idle'; other.speed = 1.0; if (fart) other.x = ox + 1.0 + (lt - pf[1]) * 1.2; hero.x = ox - .8; }
      if (bi === 4) { other.x = ox + 1.6; other.z = 6.3; other.yaw = -Math.PI * .8; other.shirt; hero.x = ox - .8; }
      if (bi === 5) { for (let i = 0; i < 38; i++) { const o = cr.p[2 + i]; if (2 + i >= 40) break; o.vis = true; const row = Math.floor(i / 13), col = i % 13; const ang = (col / 12 - .5) * 2.3; o.x = ox + Math.sin(ang) * (5.5 - row * 1.0) * 1.0; o.z = 4.6 + Math.cos(ang) * (3.4 + row * 1.2) * .1 + row * 1.0; o.yaw = Math.PI + ang * .5 + .0; o.anim = k > .6 ? 'panic' : 'idle'; o.speed = 1.0; } hero.vis = false; }
      if (bi === 6) { hero.x = ox; hero.z = 6; hero.anim = 'idle'; }
      cr.update(t);
      P[0].place(hero.x, 1.1, bi === 3 ? 6.0 : 6.3, bi === 5 ? 0 : k, t); P[1].place(ox, 2.6, 7.0, bi === 5 ? k : 0, t); A.renderer.render(A.scene, A.camera);
      hud.question('What if you *farted* every time you lied?', 1);
      if (bi === 0) hud.counter('', '', ''); else hud.counter(bi === 1 ? 'Lies per day' : 'Lies told', bi === 1 ? '1.65' : (bi === 5 ? '535' : String(bi - 1)), bi === 1 ? 'the average person' : '', 'one fart each', false);
    }
  };
}
