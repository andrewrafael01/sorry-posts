import { makeFig } from './_fig.js';
import { beachWorld } from './_beachworld.js';
// What if your head was on backwards? Walks forward looking back, eats (spoon goes to the back of the head), drives a car, says hello to the wrong direction.
export default async function build({ lib, tl, hud }) {
  const { THREE, mat, addBox, clamp, smooth, lerp } = lib; const W = beachWorld(lib, { n: 24 }); const st = W.st, S = W.S; const F = makeFig(lib, S); F.head.rotation.y = Math.PI;
  const car = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(1.8, .5, 3.6), mat(0xd22b2b, { roughness: .3, metalness: .2 })); b.position.y = .55; const c = new THREE.Mesh(new THREE.BoxGeometry(1.5, .5, 1.5), mat(0x9ab8d8, { roughness: .1 })); c.position.set(0, 1.0, -.2); const wh = new THREE.Mesh(new THREE.TorusGeometry(.2, .03, 8, 20), mat(0x111111)); wh.position.set(0, 1.05, .75); wh.rotation.x = -.5; car.add(b, c, wh); for (const sx of [-.9, .9]) for (const sz of [-1.1, 1.1]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .25, 14), mat(0x222222)); w.rotation.z = Math.PI / 2; w.position.set(sx, .34, sz); car.add(w); } car.traverse((m) => (m.castShadow = true)); car.visible = false; S.add(car); }
  const spoon = new THREE.Group(); { const h = new THREE.Mesh(new THREE.CylinderGeometry(.01, .01, .22, 6), mat(0xcccccc)); const s = new THREE.Mesh(new THREE.SphereGeometry(.04, 10, 8), mat(0xcccccc)); s.position.y = .12; s.scale.set(1, .5, 1); const food = new THREE.Mesh(new THREE.SphereGeometry(.035, 10, 8), mat(0xe8833a)); food.position.y = .14; spoon.add(h, s, food); spoon.visible = false; S.add(spoon); }
  const LAB = ['', 'WALKING', 'EATING', 'DRIVING', 'HELLO']; const NOTE = ['', 'forward: forward', 'accuracy: 0%', 'speed: 0', 'greeted: the wrong person'];
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 4); car.visible = false; spoon.visible = false; const s = Math.sin(t * 5); F.set({ x: 0, z: 0, yaw: Math.PI / 2 }); let cam = [0, 1.3, -6.4, 0, 1.05, 0, 44];
    for (const l of [F.L, F.R]) { l.th.rotation.set(0, 0, 0); l.sh.rotation.set(0, 0, 0); } for (const a of [F.AL, F.AR]) { a.up.rotation.set(0, 0, 0); a.fo.rotation.set(0, 0, 0); } F.hips.position.y = .95;
    if (bi === 1) { F.L.th.rotation.x = s * .6; F.R.th.rotation.x = -s * .6; F.AL.up.rotation.x = -s * .5; F.AR.up.rotation.x = s * .5; F.hips.position.y = .95 + Math.abs(s) * .03; F.set({ x: 0, z: lerp(-2.5, 2.5, (lt * .5) % 1), yaw: Math.PI / 2 }); F.head.rotation.y = Math.PI + Math.sin(t * 2) * .05; }
    else if (bi === 2) { const e = (Math.sin(t * 3) * .5 + .5); F.AR.up.rotation.x = -1.0 - e * .7; F.AR.fo.rotation.x = -1.3; F.AR.up.rotation.z = .4 - e * .5; spoon.visible = true; const h = new THREE.Vector3(); F.AR.hand.getWorldPosition(h); spoon.position.copy(h); spoon.rotation.set(0, 0, 0); F.head.rotation.y = Math.PI; cam = [0, 1.3, -6.4, 0, 1.05, 0, 44]; }
    else if (bi === 3) { car.visible = true; car.position.set(0, 0, 0); car.rotation.y = Math.PI / 2; F.set({ x: -.2, z: 0, y: .25, yaw: Math.PI / 2 }); F.hips.position.y = .55; F.L.th.rotation.x = -1.5; F.R.th.rotation.x = -1.5; F.L.sh.rotation.x = 1.5; F.R.sh.rotation.x = 1.5; F.AL.up.rotation.x = -1.2; F.AR.up.rotation.x = -1.2; F.head.rotation.y = Math.PI; car.position.x = Math.sin(t * .6) * .0; car.position.z = (lt * 3) % 12 - 6; F.g.position.z = car.position.z; cam = [0, 1.3, -6.4, 0, 1.05, 0, 44]; }
    else if (bi === 4) { F.AR.up.rotation.x = -2.9 + Math.sin(t * 7) * .3; F.set({ x: 0, z: 0, yaw: Math.PI / 2 }); F.head.rotation.y = Math.PI; cam = [0, 1.3, -6.4, 0, 1.05, 0, 44]; }
    W.update(t, [0, 1, 4, 2, 3][bi], [0, 0], 1); st.cam(...cam); st.follow(0, 0); st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if your head was on *backwards*?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter('Subject: Gary', LAB[bi], NOTE[bi], 'CLINICAL FOOTAGE', bi >= 3); hud.tm(''); hud.pop('', 0);
  } };
}
