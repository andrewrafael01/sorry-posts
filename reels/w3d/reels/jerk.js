import { bedroom2 } from './_bed.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, Crowd, Particles, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ fog: 0xece4ea, fogNear: 16, fogFar: 60, clouds: false, skyTop: 0xece4ea, skyMid: 0xece4ea, skyBot: 0xece4ea, shadowExtent: 12, hemi: 1.25, sunI: 1.9 }); const bd = bedroom2(lib, A, A.scene);
  const smoke = new Particles(A.scene, 40, 0x6b6b72, .25, { rough: 1 }); const fire = new Particles(A.scene, 44, 0xff8a1e, .16, { emissive: 0xff5a00, rough: .6 }); const ringsA = []; for (let i = 0; i < 5; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .08, 8, 64), new THREE.MeshBasicMaterial({ color: 0xffe6b8, transparent: true, opacity: .8 })); m.rotation.x = Math.PI / 2; A.scene.add(m); ringsA.push(m); }
  const B = makeStage({ shadowExtent: 52, fogNear: 110, fogFar: 420 }); const town = buildStreet(B.scene, {}); const debris = new Particles(B.scene, 300, 0xd77a30, .4, { emissive: 0xff5a00, rough: .7 }); const rg = []; for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .15, 8, 80), new THREE.MeshBasicMaterial({ color: 0xfff0d0, transparent: true, opacity: .8 })); m.rotation.x = Math.PI / 2; B.scene.add(m); rg.push(m); }
  const RT = [[1, 1], [1, 2], [4, 8], [32, 64], [500, 1200], [1200, 20000], [1e6, 1e9], [1e9, 1e9]]; const ST = [0, 0, 0, 0, 1, 2, 3, 3];
  const rs = R(5); const deb = []; for (let i = 0; i < 300; i++) deb.push({ a: rs() * 6.283, v: 10 + rs() * 40, up: 8 + rs() * 24 });
  return {
    frame({ t, bi, lt, p }) {
      const rate = RT[bi][0] * Math.pow(RT[bi][1] / RT[bi][0], p) , stage = ST[bi];
      if (stage < 3) {
        const cams = [[4.0, 3.3, 2.6, 0, 1.0, 4.4, 58], [3.8, 3.1, 3.4, 0, 1.0, 4.4, 56], [-4.0, 3.3, 3.0, 0, 1.0, 4.4, 56], [1.6, 3.0, 3.0, 0, 1.2, 3.7, 44], [2.4 + Math.sin(t * 60) * .04, 3.0, 3.4, 0, 1.3, 4.4, 52], [3.6 - 1.4 * p, 2.8, 7.4, 0, 1.0, 4.4, 62]]; A.cam(...cams[bi]); A.follow(0, 4);
        const vis = Math.min(rate, 5) * (stage < 2 ? 1 : 3); const amp = .05 + .05 * Math.log2(Math.max(1, rate)) / 4; const bump = Math.sin(t * Math.PI * 2 * vis) * amp; const sh = rate < 40 ? 0 : Math.min(.35, .03 * Math.log2(rate));
        const jit = Math.sin(t * 90) * sh * .25, jit2 = Math.cos(t * 77) * sh * .2; const P = bd.person; P.y = 1.14 + Math.abs(bump) * .4 + Math.abs(jit) * .3; P.x = jit * .5; P.speed = 1 + Math.min(4, rate / 30); bd.crowd.update(t);
        bd.blanket.visible = stage < 2; bd.fold.visible = false; bd.blanket.position.x = jit; bd.blanket.rotation.z = jit * .3; bd.blanket.position.y = 1.18 + Math.abs(bump) * .3;
        bd.lump.position.y = bd.base.lumpY + bump * 1.6 - (stage >= 2 ? .35 : 0); bd.lump.position.x = .05 + jit; bd.lump.scale.set(1.0, .7 + Math.abs(bump) * 3, 1.5 + bump * 2); if (stage >= 2) { bd.lump.material = bd.lump.userData.hot || (bd.lump.userData.hot = new THREE.MeshStandardMaterial({ color: 0x3a2020, emissive: 0xff5a00, emissiveIntensity: 1.4, roughness: .6 })); }
        const SM = new THREE.Matrix4(), HIDE = new THREE.Matrix4().makeScale(0, 0, 0); for (let i = 0; i < 20; i++) { if (bi >= 2 && stage < 3) { const u = (t * .8 + i * .17) % 1; SM.makeTranslation(.2 + Math.sin(i * 2.3) * .22, 1.39 + .01 * Math.sin(i), 3.55 + Math.cos(i * 1.7) * .15 + u * .15); bd.sweat.setMatrixAt(i, SM); } else bd.sweat.setMatrixAt(i, HIDE); } bd.sweat.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < 40; i++) { if (stage >= 1) { const a = t * 3 + i; smoke.set(i, Math.sin(a) * .5, 1.6 + ((t * 1.2 + i * .13) % 2.6), 4.6 + Math.cos(a * .8) * .5, 1); } else smoke.set(i, 0, 0, 0, 0); } smoke.done();
        for (let i = 0; i < 44; i++) { if (stage >= 2) { const a = t * 9 + i * 1.7; fire.set(i, Math.sin(a) * 1.4, .9 + Math.abs(Math.sin(t * 7 + i)) * 1.6, 4.7 + Math.cos(a * .7) * 1.6, 1); } else fire.set(i, 0, 0, 0, 0); } fire.done();
        ringsA.forEach((m, k) => { m.visible = stage >= 1 && bi >= 4; const r = ((t * 6 + k * 1.3) % 6); m.position.set(0, 1.2, 4.6); m.scale.setScalar(.2 + r); m.material.opacity = .7 * (1 - r / 6); });
        A.render();
      } else {
        const bt = bi === 6 ? lt : lt + 6; B.cam(0, 5 + 14 * (bi === 6 ? p : 1) , -6 - 4 * (bi === 6 ? p : 1), 0, 1, 18, 70); B.follow(0, 30); town.updateCrowd(t, null); const rr = bt * 28;
        town.buildings.forEach((b) => { const d = Math.hypot(b.position.x, b.position.z - 14); b.visible = d > rr; }); town.cars.forEach((c) => { const d = Math.hypot(c.m.position.x, c.m.position.z - 14); c.m.visible = d > rr; });
        rg.forEach((m, k) => { m.position.set(0, 1.5, 14); m.scale.setScalar(Math.max(.1, rr * (.95 - k * .1))); m.material.opacity = .8 * (1 - clamp(rr / 220)); });
        for (let i = 0; i < 300; i++) { const d = deb[i]; const r2 = rr * .7 * (d.v / 30); if (rr > 3) debris.set(i, Math.cos(d.a) * r2, 1 + d.up * (1 - Math.pow(clamp(rr / 200), 2)) * (rr / 80), 14 + Math.sin(d.a) * r2, 1); else debris.set(i, 0, 0, 0, 0); } debris.done();
        B.render();
      }
      hud.question('What if every *jerk* was twice as fast as the last?', 1, bi > 0); if (bi === 0) hud.counter('', '', ''); else { const hand = rate * .3; hud.counter('Strokes per second', fmt(rate), 'hand speed ' + fmt(hand) + ' m/s' + (hand > 100 ? ' · sound is 343' : '')); }
    }
  };
}
