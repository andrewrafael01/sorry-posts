import { bedroom2 } from './_bed.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, Crowd, Particles, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ fog: 0x4a5070, fogNear: 16, fogFar: 50, clouds: false, skyTop: 0x4a5070, skyMid: 0x4a5070, skyBot: 0x4a5070, shadowExtent: 12, hemi: 1.9, sunI: 2.0, sunDir: [-.5, .8, .6], exposure: 1.3 }); const bd = bedroom2(lib, A, A.scene);
  const smoke = new Particles(A.scene, 40, 0x6b6b72, .25, { rough: 1 }); const fire = new Particles(A.scene, 44, 0xff8a1e, .16, { emissive: 0xff5a00, rough: .6 }); const ringsA = []; for (let i = 0; i < 5; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .08, 8, 64), new THREE.MeshBasicMaterial({ color: 0xffe6b8, transparent: true, opacity: .8 })); m.rotation.x = Math.PI / 2; A.scene.add(m); ringsA.push(m); }
  const B = makeStage({ shadowExtent: 52, fogNear: 110, fogFar: 420 }); const town = buildStreet(B.scene, {}); const debris = new Particles(B.scene, 300, 0xd77a30, .4, { emissive: 0xff5a00, rough: .7 }); const rg = []; for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .15, 8, 80), new THREE.MeshBasicMaterial({ color: 0xfff0d0, transparent: true, opacity: .8 })); m.rotation.x = Math.PI / 2; B.scene.add(m); rg.push(m); }
  const RT = [[1, 1], [1, 2], [4, 8], [32, 64], [500, 1200], [1200, 20000], [1e6, 1e9], [1e9, 1e9]]; const ST = [0, 0, 0, 0, 1, 2, 3, 3];
  const rs = R(5); const deb = []; for (let i = 0; i < 300; i++) deb.push({ a: rs() * 6.283, v: 10 + rs() * 40, up: 8 + rs() * 24 });
  return {
    frame({ t, bi, lt, p }) {
      const rate = RT[bi][0] * Math.pow(RT[bi][1] / RT[bi][0], p) , stage = ST[bi];
      if (stage < 3) {
        const P = bd.person, standing = bi === 5, onFire = bi === 4;
        const camsA = [[4.8, 2.1, 6.6, .3, 1.6, 4.0, 52], [4.6, 2.0, 6.3, .2, 1.6, 4.0, 50], [3.6, 2.2, 5.4, .2, 1.7, 3.8, 48], [.5 + Math.sin(t * 40) * .02, 2.35, 5.6, 0, 2.15, 3.5, 36, -.12 + Math.sin(t * 33) * .02], [4.2, 3.6, 7.4, 0, 1.2, 4.2, 54], [.3, 1.7, -2.0, -.3, 1.5, 2.7, 58]];
        const cm = camsA[bi]; A.cam(...cm); A.follow(0, 4);
        const vis = Math.min(rate, 5) * (stage < 2 ? 1 : 3); const amp = .05 + .05 * Math.log2(Math.max(1, rate)) / 4; const bump = Math.sin(t * Math.PI * 2 * vis) * amp; const sh = rate < 40 ? 0 : Math.min(.35, .03 * Math.log2(rate));
        const jit = Math.sin(t * 90) * sh * .25;
        bd.crowd.setFace(bi >= 2 && bi <= 3 ? 'shock' : 'calm'); P.extra = Math.min(.5, Math.log2(Math.max(1, rate)) * .035); P.speed = 1;
        if (standing) { P.anim = 'idle'; P.x = -.4 + jit * .3; P.y = 0; P.z = 2.7; P.yaw = Math.PI; P.scale = 1.25; P.extra = .35; } else { P.anim = 'sit'; P.x = jit * .4; P.y = .06 + Math.abs(jit) * .2; P.z = 3.5; P.yaw = 0; }
        bd.crowd.update(t);
        bd.blanket.visible = !standing; bd.lump.visible = !standing; bd.strings.forEach((m, k) => { m.visible = !standing; m.position.set(-.1 + k * .2, 1.62, 3.84); });
        bd.blanket.position.x = jit; bd.blanket.rotation.z = jit * .3; bd.blanket.position.y = 1.08 + Math.abs(bump) * .3; bd.blanket.material.color.set(onFire ? 0x35456b : 0x4d6faa);
        bd.lump.position.y = bd.base.lumpY + bump * 1.6; bd.lump.position.x = jit; bd.lump.scale.set(1.0, .7 + Math.abs(bump) * 3, 1.4 + bump * 2);
        const D = new THREE.Object3D(); for (let i = 0; i < 34; i++) { const on = onFire || standing; const u = (i * .6180339) % 1, v = (i * .7548777) % 1; const fl = .5 + .5 * Math.abs(Math.sin(t * 9 + i * 2.1)); if (on && !standing) { D.position.set((u - .5) * 2.2, 1.34, 3.9 + v * 2.1); D.scale.set(.9, .45 + fl * .8, .9); D.rotation.set(0, i, Math.sin(t * 6 + i) * .15); } else { D.position.set(0, -9, 0); D.scale.set(0, 0, 0); } D.updateMatrix(); bd.cones.setMatrixAt(i, D.matrix); D.position.y += 0; } bd.cones.instanceMatrix.needsUpdate = true;
        const rsd = R(21); for (let i = 0; i < 36; i++) { const x = (rsd() - .5) * 5.0, z = (i % 4 === 0 ? 1.9 + rsd() * .5 : 3.0 + rsd() * 2.4), ry = rsd() * 3, sc = .4 + rsd() * .8; D.position.set(x, .08 + (standing ? 0 : -9), z); D.rotation.set(0, ry, 0); D.scale.set(standing ? sc : 0, 1, standing ? sc * .8 : 0); D.updateMatrix(); bd.slabs.setMatrixAt(i, D.matrix); } bd.slabs.instanceMatrix.needsUpdate = true;
        const re = R(33); for (let i = 0; i < 28; i++) { const x = (re() - .5) * 4.5, z = 1.2 + re() * 3.4; D.position.set(x, standing ? .22 + .15 * Math.abs(Math.sin(t * 5 + i)) : -9, z); D.rotation.set(t + i, i, 0); D.scale.set(1, 1, 1); D.updateMatrix(); bd.embers.setMatrixAt(i, D.matrix); } bd.embers.instanceMatrix.needsUpdate = true;
        // lightning bolts: jagged yellow chains re-rolled every few frames, arcing from his hands/legs
        const seed = Math.floor(t * 14); const rb = R(seed * 7 + 3); let bi2 = 0; const V = new THREE.Vector3(), V2 = new THREE.Vector3();
        for (let k = 0; k < 10; k++) { V.set(-.4 + (rb() - .5) * 1.2, .5 + rb() * 1.7, 2.7 + (rb() - .5) * .6); for (let sgm = 0; sgm < 6; sgm++) { if (bi2 >= 60) break; V2.set(V.x + (rb() - .5) * .9, V.y + (rb() - .5) * .9, V.z + (rb() - .5) * .5); const len = V.distanceTo(V2); D.position.copy(V).add(V2).multiplyScalar(.5); D.lookAt(V2); D.scale.set(standing ? .035 : 0, standing ? .035 : 0, standing ? len : 0); D.updateMatrix(); bd.bolt.setMatrixAt(bi2++, D.matrix); V.copy(V2); } }
        for (; bi2 < 60; bi2++) { D.position.set(0, -9, 0); D.scale.set(0, 0, 0); D.updateMatrix(); bd.bolt.setMatrixAt(bi2, D.matrix); } bd.bolt.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < 40; i++) { if (bi >= 4 && stage >= 1) { const a = t * 3 + i; smoke.set(i, 2.6 * Math.sin(i * 1.7) * .8, 3.1 + Math.sin(i) * .4 + ((t * .4 + i * .13) % 1) * .6, 3.6 + Math.cos(i * 2.3) * 2.2 + Math.sin(a) * .2, .9); } else smoke.set(i, 0, 0, 0, 0); } smoke.done();
        for (let i = 0; i < 44; i++) fire.set(i, 0, 0, 0, 0); fire.done();
        ringsA.forEach((m) => { m.visible = false; });
        A.render();
      } else {
        const bt = bi === 6 ? lt : lt + 6; B.cam(0, 5 + 14 * (bi === 6 ? p : 1) , -6 - 4 * (bi === 6 ? p : 1), 0, 1, 18, 70); B.follow(0, 30); town.updateCrowd(t, null); const rr = bt * 28;
        town.buildings.forEach((b) => { const d = Math.hypot(b.position.x, b.position.z - 14); b.visible = d > rr; }); town.cars.forEach((c) => { const d = Math.hypot(c.m.position.x, c.m.position.z - 14); c.m.visible = d > rr; });
        rg.forEach((m, k) => { m.position.set(0, 1.5, 14); m.scale.setScalar(Math.max(.1, rr * (.95 - k * .1))); m.material.opacity = .8 * (1 - clamp(rr / 220)); });
        for (let i = 0; i < 300; i++) { const d = deb[i]; const r2 = rr * .7 * (d.v / 30); if (rr > 3) debris.set(i, Math.cos(d.a) * r2, 1 + d.up * (1 - Math.pow(clamp(rr / 200), 2)) * (rr / 80), 14 + Math.sin(d.a) * r2, 1); else debris.set(i, 0, 0, 0, 0); } debris.done();
        B.render();
      }
      hud.style('C'); hud.question('What if every *jerk* was twice as fast as the last?', 1, bi > 0);
      if (bi === 0 && lt < 1.0) hud.counter('', '', ''); else { const n = Math.max(1, Math.round(Math.log2(Math.max(1, rate))) + 1); const mph = rate * .3 * 2.237; const fm = (v) => v < 10 ? v.toFixed(1) : v < 1e6 ? fmt(v) : v < 1e9 ? (v / 1e6).toFixed(1) + ' million' : (v / 1e9).toFixed(1) + ' billion';
        const note = mph < 3 ? 'slower than walking' : mph < 12 ? 'about a jogger, but worse' : mph < 60 ? 'faster than a bike' : mph < 300 ? 'faster than a cheetah' : mph < 767 ? 'approaching the speed of sound' : mph < 20000 ? 'hot enough to start fires' : mph < 1e6 ? 'faster than earth orbits the sun' : 'faster than light. sort of.';
        hud.counter('Stroke ' + n + ' · Age 25', fm(mph) + ' mph', note, '×2 every stroke', mph > 760 && mph < 1e6); hud.tm('Time: ' + (2 - Math.pow(2, 1 - n)).toFixed(n > 9 ? 6 : 3) + ' s'); }
      const POP = ['', 'BRO.', 'WAIT. WHAT.', 'SIR???', 'THE BED. THE BED.', 'MY HANDS', '', ''][bi]; hud.pop(POP && lt > .5 ? POP : '', Math.min(1, (lt - .5) * 6));
    }
  };
}
