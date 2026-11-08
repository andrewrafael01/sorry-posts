import { makeFig } from './_fig.js';
import { beachWorld } from './_beachworld.js';
// What if your arms and legs were swapped? Arms on the hips (short walkers), legs on the shoulders (long dangling wavers).
export default async function build({ lib, tl, hud }) {
  const { THREE, mat, clamp, smooth, lerp } = lib; const W = beachWorld(lib, { n: 24 }); const st = W.st, S = W.S; const F = makeFig(lib, S);
  // swap: legs go up to the shoulders, arms go down to the hips
  F.torso.add(F.L.th); F.torso.add(F.R.th); F.L.th.position.set(-.36, .56, 0); F.R.th.position.set(.36, .56, 0); F.L.th.scale.setScalar(.9); F.R.th.scale.setScalar(.9);
  F.hips.add(F.AL.up); F.hips.add(F.AR.up); F.AL.up.position.set(-.14, -.05, 0); F.AR.up.position.set(.14, -.05, 0); F.AL.up.scale.setScalar(1.15); F.AR.up.scale.setScalar(1.15);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(.16, 20, 14), mat(0xf4f4f4)); ball.castShadow = true; S.add(ball); const LAB = ['', 'WALKING', 'WAVING', 'SOCCER', 'HANDSHAKE']; const NOTE = ['', 'limbs: swapped', 'limbs: swapped', 'goal: own', 'shoulder pressure: high'];
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 4); ball.visible = false; F.set({ x: 0, z: 0, yaw: Math.PI / 2 }); const s = Math.sin(t * 5); const reset = () => { for (const l of [F.L, F.R]) { l.th.rotation.set(0, 0, 0); l.sh.rotation.set(0, 0, 0); } for (const a of [F.AL, F.AR]) { a.up.rotation.set(0, 0, 0); a.fo.rotation.set(0, 0, 0); } F.hips.position.y = .62; }; reset();
    let cam = [0, 1.3, -6.4, 0, 1.05, 0, 44]; F.hips.position.y = .45 + Math.abs(s) * .04;
    // walking on the short arm-legs, long leg-arms dangling/swinging at the shoulders
    F.AL.up.rotation.x = s * .9; F.AR.up.rotation.x = -s * .9; F.L.th.rotation.x = -s * .5; F.R.th.rotation.x = s * .5; F.L.th.rotation.z = .5 + Math.sin(t * 3) * .15; F.R.th.rotation.z = -.5 - Math.sin(t * 3) * .15;
    if (bi === 1) F.set({ x: 0, z: lerp(-2.5, 2.5, (lt * .5) % 1), yaw: Math.PI / 2 });
    else if (bi === 2) { F.AL.up.rotation.x = 0; F.AR.up.rotation.x = 0; F.R.th.rotation.z = -2.7 + Math.sin(t * 8) * .35; F.R.th.rotation.x = 0; F.L.th.rotation.z = .4; F.set({ x: 0, z: 0, yaw: Math.PI / 2 }); cam = [0, 1.3, -6.4, 0, 1.05, 0, 44]; }
    else if (bi === 3) { ball.visible = true; const k = lt; F.AL.up.rotation.x = 0; F.AR.up.rotation.x = k < .3 ? 0 : -smooth(clamp((k - .3) / .3)) * 1.4; F.L.th.rotation.x = 0; F.set({ x: 0, z: 0, yaw: Math.PI / 2 }); const u = clamp((k - .55) / .8); ball.position.set(0, .16 + Math.sin(u * 3.14) * 1.6, lerp(.45, -.2, u)); if (u > .95) ball.position.set(0, 1.9, -.1); cam = [0, 1.3, -6.4, 0, 1.05, 0, 44]; }
    else if (bi === 4) { F.AL.up.rotation.x = 0; F.AR.up.rotation.x = 0; F.L.th.rotation.z = .5; F.R.th.rotation.z = -.5 + Math.sin(t * 6) * .0; F.R.th.rotation.x = -1.5 + Math.sin(t * 6) * .12; F.R.th.rotation.z = -.2; cam = [0, 1.3, -6.4, 0, 1.05, 0, 44]; }
    W.update(t, [0, 1, 3, 2, 4][bi], [0, 0], 1); st.cam(...cam); st.follow(0, 0); st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if your arms and legs were *swapped*?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter('Subject: Gary', LAB[bi], NOTE[bi], 'CLINICAL FOOTAGE', bi >= 3); hud.tm(''); hud.pop('', 0);
  } };
}
