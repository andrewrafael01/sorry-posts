// What if every human flushed at the same time. 8.2e9 x 6 L = 49.2e9 L = 19,700 Olympic pools.
import { bathroom } from './_rooms.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, buildStreet, buildEarth, Crowd, Particles, R, clamp, smooth, lerp } = lib; const LIT = 49.2e9, POOL = 2.5e6, fmt = (v) => Math.round(v).toLocaleString('en-US');
  const mk = (opts) => makeStage(opts);
  // three separate worlds, switched by beat
  const A = mk({ fog: 0xdde8f0, fogNear: 14, fogFar: 60, clouds: false, skyTop: 0xcfe3f2, skyMid: 0xdfeaf3, skyBot: 0xe8f0f6, shadowExtent: 10, hemi: 1.25, sunI: 2.0 }); const bath = bathroom(lib, A.scene); const bp = new Crowd(A.scene, 4, 9); const sw = new Particles(A.scene, 14, 0xe6f4ff, .06);
  const B = mk({ shadowExtent: 52, fogNear: 110, fogFar: 420 }); const city = buildStreet(B.scene, {}); const spray = new Particles(B.scene, 2600, 0xb9defa, .13, { rough: .1 }); const covers = []; for (const m of city.manholes) covers.push(m);
  const flood = new THREE.Mesh(new THREE.PlaneGeometry(240, 400), new THREE.MeshStandardMaterial({ color: 0x4a9be6, roughness: .12, metalness: .1, transparent: true, opacity: .86 })); flood.rotation.x = -Math.PI / 2; flood.position.set(0, .16, 90); B.scene.add(flood);
  const C = mk({ clouds: false, skyTop: 0x020409, skyMid: 0x020409, skyBot: 0x020409, fog: 0x020409, fogNear: 900, fogFar: 1000, shadowExtent: 12, hemi: .5, sunI: 3.0, sunDir: [-1, .5, .7] }); const sp = buildEarth(C.scene, 6); const jets = new THREE.Group(); C.scene.add(jets); const jr = R(3); const jetMat = new THREE.MeshBasicMaterial({ color: 0xdff0ff }); const jetList = [];
  for (let i = 0; i < 70; i++) { const a = jr() * 6.283, b = Math.acos(2 * jr() - 1); const dir = new THREE.Vector3(Math.sin(b) * Math.cos(a), Math.cos(b), Math.sin(b) * Math.sin(a)); const m = new THREE.Mesh(new THREE.CylinderGeometry(.03, .06, 1, 6), jetMat); jets.add(m); jetList.push({ m, dir, t0: .2 + jr() * 1.6, len: .8 + jr() * 1.6 }); }
  const walkers = new Crowd(A.scene, 3, 4);
  const M4 = new THREE.Matrix4();
  return {
    frame({ t, bi, lt, p, beat, ck }) {
      let st = A, kind = 'bath';
      if (bi === 2 || bi === 3 || bi === 4 || bi === 6) { st = B; kind = 'city'; } else if (bi === 5) { st = C; kind = 'space'; }
      if (kind === 'bath') {
        const press = bi === 1 ? (beat.words.find((w) => /billion/i.test(w[0])) || [0, .9])[1] : 99; const last = bi === 7;
        if (bi === 0) st.cam(.5, 2.2 - .3 * p, -1.4 + .6 * p, -.2, .6, 3.2, 68); else if (bi === 1) st.cam(.8 - .8 * p, 1.7, -.2 + .8 * p, 0, .5, 3.3, 56); else st.cam(2.6, 2.3, -1.6, .4, .8, 3.0, 68);
        st.follow(0, 3);
        const pr = bp.p[0]; pr.x = -.9; pr.z = 2.3; pr.yaw = Math.PI / 2; pr.anim = 'idle'; pr.shirt; pr.vis = !last; for (let i = 1; i < 4; i++) bp.p[i].vis = false;
        if (last) { for (let i = 0; i < 3; i++) { const o = walkers.p[i]; o.vis = true; o.anim = 'walk'; o.speed = .5; o.x = Math.min(3.8, -1.4 + lt * .7 + i * .5); o.z = 1.6 + .6 * i; o.yaw = Math.PI / 2; } } else for (let i = 0; i < 3; i++) walkers.p[i].vis = false;
        bp.update(t); walkers.update(t);
        const u = lt - press; bath.handle.position.y = 1.38 - (u > 0 && u < .35 ? .05 : 0);
        for (let k = 0; k < 14; k++) { if (u > 0 && u < 2.2) { const a = u * 7 + k * .62, rr = .27 * (1 - clamp(u / 1.9)) * (1 - k * .05); sw.set(k, Math.cos(a) * rr, .7, 3.15 + Math.sin(a) * rr, 1); } else sw.set(k, 0, 0, 0, 0); } sw.done();
      } else if (kind === 'city') {
        const t0 = bi === 3 ? (beat.words.find((w) => /manhole/i.test(w[0])) || [0, 1])[1] - .3 : (bi >= 4 ? -2 : 1e9); const tt = bi === 4 ? lt + 3 : bi === 6 ? lt + 6 : lt;
        const floodK = bi === 4 ? smooth(p) : bi === 6 ? 1 : 0; flood.visible = floodK > 0; flood.scale.x = .06 + floodK * .94; flood.position.y = .14 + floodK * .1;
        if (bi === 2) st.cam(0, 2.4, -2 + 3 * p, 0, 2.6, 40, 64); else if (bi === 3) { const sh = Math.max(0, 1 - Math.abs(lt - t0 - .6) / 1.2) * .25; st.cam(Math.sin(lt * 40) * sh, 2.4 + Math.cos(lt * 47) * sh, -2 + 6 * p, 0, 5 + 5 * smooth(p), 40, 64); } else if (bi === 4) st.cam(30 - 6 * p, 52 - 8 * p, -30, 0, 2, 46, 62); else st.cam(0, 80 - 10 * p, 20, 0, 0, 60, 64);
        st.follow(0, 40); city.updateCrowd(tt, t0 > 0 && t0 < 100 ? tt - (tt - lt) + 0 : (bi >= 4 ? -9 : null));
        city.cars.forEach((c, i) => { c.m.position.z = c.z0 - (Math.abs(c.x) < 3 ? tt * 2 * (c.x > 0 ? 1 : 0) : 0); c.m.position.y = floodK > .3 ? .2 + Math.sin(tt * 2 + i) * .18 * floodK : 0; c.m.rotation.z = floodK * Math.sin(tt * 1.7 + i) * .12; });
        let si = 0; const rs = R(5);
        covers.forEach((c, k) => { const tb = bi === 3 ? lt - (t0 + (c.z - 9) / 11 * .16 + (c.x + 3.6) * .02) : (bi >= 4 ? 5 + k * .01 : -1); if (tb < 0) { c.m.position.set(c.x, .06, c.z); c.m.rotation.set(0, 0, 0); return; }
          const hgt = Math.min(16, 34 * tb) * (tb < 2.6 ? 1 : Math.max(0, 1 - (tb - 2.6) * .5)); const yc = 22 * tb - 4.9 * tb * tb; c.m.position.set(c.x, .06 + Math.max(0, yc), c.z); c.m.rotation.set(tb * 5, tb * 3, 0);
          if (bi === 3) { for (let q = 0; q < 12 && si < 2600; q++) { const yy = q / 11 * hgt; spray.set(si++, c.x + Math.sin(q * 1.7 + tb * 9) * .25, .3 + yy, c.z, 1.0 - q * .02); } for (let q = 0; q < 26 && si < 2600; q++) { const a = (q * 2.399 + k) % 6.283, sp2 = 2 + (q % 5), tq = (tb * .9 + q * .07) % 1.6; spray.set(si++, c.x + Math.cos(a) * sp2 * tq, .3 + 15 * tq - 8.8 * tq * tq + (q % 4) * .4, c.z + Math.sin(a) * sp2 * tq * .6, .6); } } });
        for (; si < 2600; si++) spray.set(si, 0, 0, 0, 0); spray.done();
      } else {
        st.cam(0, 0, 34, 0, 0, 0, 40); const s = 1 + .05 * lt; sp.earth.scale.setScalar(s); sp.atm.scale.setScalar(s); sp.earth.rotation.y = lt * .12; st.follow(0, 0);
        jetList.forEach((j) => { const u = clamp((lt - j.t0) / .5); j.m.visible = u > 0; const L = j.len * u; j.m.scale.set(1, L, 1); const pos = j.dir.clone().multiplyScalar(6 * s + L * .5 * s); j.m.position.copy(pos); j.m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), j.dir); });
      }
      st.renderer.render(st.scene, st.camera);
      // HUD
      const frac = bi <= 2 ? 0 : bi === 3 ? smooth(clamp((lt - 1) / Math.max(.5, beat.dur - 1.4))) * .6 : bi === 4 ? .6 + .3 * p : bi === 5 ? .9 + .07 * p : bi === 6 ? .97 + .03 * smooth(p) : 1;
      hud.question('What if every human on Earth flushed the toilet at the exact same time?', 1, bi > 0);
      if (bi >= 2) hud.counter('Water flushed', fmt(LIT * frac) + ' L', frac > 0 ? '= ' + fmt(LIT * frac / POOL) + ' olympic pools' : ''); else if (bi === 1) hud.counter('Flushes', fmt(8.2e9 * clamp((lt - 1) / 4)) , '8.2 billion people · 6 liters each'); else hud.counter('', '', '');
    }
  };
}
