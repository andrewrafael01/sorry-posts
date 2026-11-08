import { makeFig } from './_fig.js';
import { beachWorld } from './_beachworld.js';
// What if your hands were the size of your body? Giant mitts: wave, clap (shockwave), type on a tiny laptop, hug a spectator.
export default async function build({ lib, tl, hud }) {
  const { THREE, mat, clamp, smooth, lerp } = lib; const W = beachWorld(lib, { n: 24 }); const st = W.st, S = W.S; const F = makeFig(lib, S); F.AL.hand.scale.setScalar(5.5); F.AR.hand.scale.setScalar(5.5);
  const lap = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(.3, .02, .2), mat(0x9aa0a8)); const s = new THREE.Mesh(new THREE.BoxGeometry(.3, .2, .015), mat(0x15161a)); s.position.set(0, .11, -.09); s.rotation.x = -.3; lap.add(b, s); lap.visible = false; S.add(lap); }
  const LAB = ['', 'WAVING', 'CLAPPING', 'TYPING', 'HUG']; const NOTE = ['', 'hand size: 100%', 'wind: 40 km/h', 'keys hit per press: 11', 'ribs: concerned']; const ring = new THREE.Mesh(new THREE.TorusGeometry(.5, .04, 8, 30), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })); ring.visible = false; S.add(ring);
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 4); lap.visible = false; ring.visible = false; F.set({ x: 0, z: 0, yaw: Math.PI }); for (const a of [F.AL, F.AR]) { a.up.rotation.set(0, 0, 0); a.fo.rotation.set(0, 0, 0); } let cam = [0, 1.7, 7.5, 0, 1.4, 0, 46];
    F.AL.up.rotation.z = -.35; F.AR.up.rotation.z = .35; F.AL.fo.rotation.x = -.3; F.AR.fo.rotation.x = -.3;
    if (bi === 1) { F.AR.up.rotation.z = 2.5; F.AR.fo.rotation.z = Math.sin(t * 7) * .5; F.AR.up.rotation.z = -2.5; F.AR.up.rotation.z = 2.5; }
    else if (bi === 2) { const c = Math.abs(Math.sin(t * 4)); F.AL.up.rotation.x = -1.5; F.AR.up.rotation.x = -1.5; F.AL.up.rotation.z = lerp(-.15, .6, 1 - c); F.AR.up.rotation.z = lerp(.15, -.6, 1 - c); if (c < .12) { ring.visible = true; ring.position.set(0, 1.2, .8); ring.scale.setScalar(1 + (.12 - c) * 30); ring.material.opacity = .6; } }
    else if (bi === 3) { F.AL.up.rotation.x = -1.3 + Math.sin(t * 17) * .08; F.AR.up.rotation.x = -1.3 + Math.sin(t * 19) * .08; F.AL.up.rotation.z = -.15; F.AR.up.rotation.z = .15; lap.visible = true; lap.position.set(0, .95, .6); lap.rotation.y = Math.PI; lap.scale.setScalar(.8); cam = [0, 2.0, 6.8, 0, 1.2, 0, 44]; }
    else if (bi === 4) { const u = smooth(clamp(lt / 1.2)); F.AL.up.rotation.z = lerp(-.35, -1.5, u); F.AR.up.rotation.z = lerp(.35, 1.5, u); F.AL.up.rotation.x = -.7 * u; F.AR.up.rotation.x = -.7 * u; cam = [0, 1.7, 7.0, 0, 1.3, 0, 46]; }
    W.update(t, [0, 1, 3, 4, 2][bi], [0, 0], -1); st.cam(...cam); st.follow(0, 0); st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if your hands were the size of your *body*?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter('Subject: Gary', LAB[bi], NOTE[bi], 'CLINICAL FOOTAGE', bi >= 3); hud.tm(''); hud.pop('', 0);
  } };
}
