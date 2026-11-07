import { bedroom2 } from './_bed.js';
// What if every fart you ripped was twice as strong as the last? Bed -> hot air balloon blanket -> liftoff through the roof -> orbit.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, buildEarth, Particles, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ fog: 0x4a5070, fogNear: 16, fogFar: 50, clouds: false, skyTop: 0x4a5070, skyMid: 0x4a5070, skyBot: 0x4a5070, shadowExtent: 12, hemi: 1.9, sunI: 2.0, sunDir: [-.5, .8, .6], exposure: 1.3 }); const bA = bedroom2(lib, A, A.scene);
  const B = makeStage({ shadowExtent: 40, fogNear: 200, fogFar: 700 }); buildStreet(B.scene, {}); const bB = bedroom2(lib, B, B.scene, { room: false });
  const C = makeStage({ clouds: false, skyTop: 0x020409, skyMid: 0x020409, skyBot: 0x020409, fog: 0x020409, fogNear: 900, fogFar: 1000, hemi: .7, sunI: 3.0, sunDir: [-1, .5, .7], shadowExtent: 14 }); const sp = buildEarth(C.scene, 60); sp.earth.position.set(0, -75, 20); sp.atm.position.copy(sp.earth.position); const bC = bedroom2(lib, C, C.scene, { room: false });
  const gasA = new Particles(A.scene, 50, 0x9bc24a, .35, { rough: 1 }); const exB = new Particles(B.scene, 60, 0xb8d96a, .4, { rough: 1, emissive: 0x405018 }); const exC = new Particles(C.scene, 60, 0xb8d96a, .4, { rough: 1, emissive: 0x405018 });
  const NT = [[0, 0], [1, 2], [4, 7], [9, 11], [15, 19], [19, 22], [22, 25], [25, 25]];
  const starts = []; { let c = 0; for (const bt of tl.beats) { starts.push(c); c += bt.dur; } }
  const nAt = (t) => { let k = 0; for (let i = 0; i < starts.length; i++) if (t >= starts[i]) k = i; const p = clamp((t - starts[k]) / (tl.beats[k].dur || 1)); return lerp(NT[k][0], NT[k][1], p); };
  const S = { t: 0, h: 0, v: 0, tl: -1 };
  const stepTo = (t) => { if (t < S.t) { S.t = 0; S.h = 0; S.v = 0; } const dt = 1 / 120; while (S.t < t) { const n = nAt(S.t); const F = Math.min(4e4, .01 * Math.pow(2, n - 1)) * (n > 0 ? 1 : 0); const a = (F - 800) / 80; if (F > 800 || S.h > 0) { S.v += (F > 800 ? a : -9.8) * dt; S.h += S.v * dt; if (S.h < 0) { S.h = 0; S.v = 0; } } S.t += dt; } };
  const place = (bd, Y, t, n, puff) => { bd.bedG.position.y = Y; const P = bd.person; P.anim = 'sit'; P.x = 0; P.y = .06 + Y; P.z = 3.5; P.yaw = 0; P.extra = clamp(n / 40) * .6; bd.crowd.setFace(n > 3 && n < 20 ? 'shock' : 'calm'); bd.crowd.update(t); bd.blanket.userData.update(t, .1 + .1 * Math.sin(t * 6), 0, puff * (bd === bA && lib.__closeup ? .25 : 1)); bd.strings.forEach((m, k) => m.position.set(-.1 + k * .2, 1.62, 3.84)); };
  return {
    frame({ t, bi, lt, p, beat }) {
      stepTo(t); const n = nAt(t); const h = S.h, Y = 30 * Math.asinh(h / 25); const puff = clamp((n - 2) / 8) * (.65 + .35 * Math.sin(t * 7));
      lib.__closeup = bi === 3; const inRoom = bi <= 3 || (bi === 4 && Y < 3.2); const inSpace = bi >= 6; const shake = Math.sin(t * 60) * clamp(n / 30) * .06;
      if (inRoom) {
        const Yr = Math.min(Y, 3.2); place(bA, Yr, t, n, puff); A.scene.fog.color.set(new THREE.Color(0x4a5070).lerp(new THREE.Color(0x6b8a3a), clamp(n / 14) * .6));
        const cams = [[4.8, 2.1, 6.6, .3, 1.6, 4.0, 52], [4.6, 2.0, 6.3, .2, 1.6, 4.0, 50], [5.4 + shake, 2.5, 7.4, 0, 1.6, 4.4, 56], [.6 + shake, 2.5, 5.9, 0, 2.2, 3.5, 34, -.1 + shake * .3], [4.2 + shake, 3.0 + Yr * .5, 7.0, 0, 1.8 + Yr * .6, 4.2, 56]]; A.cam(...cams[bi]); A.follow(0, 4);
        for (let i = 0; i < 50; i++) { const g = clamp((n - 2) / 8); if (g <= 0) { gasA.set(i, 0, 0, 0, 0); continue; } const a = t * .8 + i * 2.399, r2 = .6 + (i % 7) * .35; gasA.set(i, Math.cos(a) * r2 * 1.3, 1.1 + (i % 5) * .35 + Math.sin(t * 2 + i) * .15 + Yr, 4.4 + Math.sin(a) * r2, g * (.6 + (i % 4) * .25) * (bi === 3 ? .2 : bi === 4 ? .35 : .6)); } gasA.done(); A.render();
      } else if (!inSpace) {
        place(bB, Y, t, n, puff * .3); const camY = Y + 1.6; B.cam(7 + shake, camY + 1.0, 10.5, 0, Y + 1.2, 4.6, 58); B.follow(0, 20);
        for (let i = 0; i < 60; i++) { const a = (t * 3 + i * .3) % 6; exB.set(i, Math.sin(i * 2.3) * .5, Y + .5 - a * (.6 + n * .05), 4.7 + Math.cos(i * 1.7) * .5, clamp(1 - a / 6) * (.5 + a * .15)); } exB.done(); B.render();
      } else {
        place(bC, 0, t, n, puff * .3); sp.earth.rotation.y = t * .02; C.cam(5 + shake, 2.4, 9.0, 0, 1.3, 4.4, 56); C.follow(0, 4); bC.bedG.rotation.z = Math.sin(t * .4) * .06;
        for (let i = 0; i < 60; i++) { const a = (t * 2 + i * .3) % 6; exC.set(i, Math.sin(i * 2.3) * .6, .4 - a * .7, 4.7 + Math.cos(i * 1.7) * .6, clamp(1 - a / 6) * (.5 + a * .12)); } exC.done(); C.render();
      }
      hud.style('C'); hud.question('What if every *fart* was twice as strong as the last?', 1, bi > 0);
      if (bi === 0 && lt < 1.0) hud.counter('', '', ''); else { const F = .01 * Math.pow(2, Math.max(0, n - 1)); const fm = (v) => v < 1 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : v < 1e6 ? fmt(v) : (v / 1e6).toFixed(1) + ' million';
        const note = F < .1 ? 'barely audible' : F < 5 ? 'a leaf blower' : F < 100 ? 'a pressure washer' : F < 800 ? 'a jet ski' : F < 20000 ? 'more thrust than your body weight' : 'a small rocket engine';
        hud.counter('Fart ' + Math.max(1, Math.round(n)) + ' · Age 25', fm(F) + ' N', note, '×2 every fart', F > 800); hud.tm('Loudness: ' + Math.round(40 + 3 * n) + ' dB'); }
      const POP = ['', 'BRO.', 'THE BLANKET', 'SIR???', 'WE HAVE LIFTOFF', 'MY ASS', 'HOUSTON', 'THE SMELL'][bi]; hud.pop(POP && lt > .5 ? POP : '', Math.min(1, (lt - .5) * 6));
    }
  };
}
