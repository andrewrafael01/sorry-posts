import { makeFig } from './_fig.js';
import { beachWorld } from './_beachworld.js';
// What if every time you stroked X (beard / cat / goat) you went twice as fast? Doubling speed run, speed lines, crowd blown over, sonic ring. Config by key.
export default async function build({ lib, tl, hud }) {
  const { THREE, mat, Particles, clamp, smooth, lerp, attach } = lib; const W = beachWorld(lib, { n: 24 }); const st = W.st, S = W.S; const F = makeFig(lib, S);
  const KEY = tl.key || ''; const KIND = KEY.includes('cat') ? 'cat' : KEY.includes('goat') ? 'goat' : 'beard';
  const beard = new THREE.Mesh(new THREE.BoxGeometry(.34, .3, .1), mat(0x6a4a2a)); beard.visible = KIND === 'beard'; S.add(beard);
  const pet = new THREE.Group(); { const wh = KIND === 'cat' ? 0xe8a24a : 0xf2efe6; const b = new THREE.Mesh(new THREE.BoxGeometry(.3, .26, .5), mat(wh)); b.position.y = .3; const h = new THREE.Mesh(new THREE.BoxGeometry(.22, .2, .22), mat(wh)); h.position.set(0, .45, .3); for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.ConeGeometry(.05, .12, 4), mat(wh)); e.position.set(sx * .07, .6, .3); pet.add(e); if (KIND === 'goat') { const hn = new THREE.Mesh(new THREE.ConeGeometry(.03, .16, 5), mat(0x8a7a60)); hn.position.set(sx * .08, .63, .27); hn.rotation.z = -sx * .4; pet.add(hn); } } const t = new THREE.Mesh(new THREE.BoxGeometry(.05, .05, .3), mat(wh)); t.position.set(0, .4, -.35); pet.add(b, h, t); pet.traverse((m) => (m.castShadow = true)); pet.scale.setScalar(1.6); pet.visible = KIND !== 'beard'; S.add(pet); }
  const lines = new THREE.InstancedMesh(new THREE.BoxGeometry(.02, .02, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .7 }), 60); lines.frustumCulled = false; S.add(lines); const ring = new THREE.Mesh(new THREE.TorusGeometry(1, .06, 8, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })); ring.visible = false; S.add(ring); const D = new THREE.Object3D();
  const SPD = [0, 1, 4, 8, 12, 16]; const MPH = (n) => Math.round(3 * Math.pow(2, n)); const NOTE = ['', 'walking', 'a bicycle', 'a car', 'a bullet train', 'the speed of sound'];
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 5); const n = bi === 0 ? 0 : lerp(SPD[bi - 1] || 0, SPD[bi], smooth(clamp(lt / 1.0))); const sp = 1.2 * Math.pow(1.45, n); const x = ((t * sp) % 26) - 13; F.set({ x, z: 0, y: 0, yaw: Math.PI / 2 });
    const ph = t * (4 + n * 1.1); const a = Math.sin(ph); for (const l of [F.L, F.R]) { l.th.rotation.set(0, 0, 0); l.sh.rotation.set(0, 0, 0); } F.L.th.rotation.x = a * .8; F.R.th.rotation.x = -a * .8; F.L.sh.rotation.x = Math.max(0, -a) * .7; F.R.sh.rotation.x = Math.max(0, a) * .7; F.hips.position.y = .95 + Math.abs(a) * .05; F.torso.rotation.x = .1 + n * .03;
    // stroke arm: right hand to chin (beard) or down to the pet beside him
    F.AL.up.rotation.x = -a * .8; F.AL.fo.rotation.x = -.3; const stroke = Math.sin(t * 9); if (KIND === 'beard') { F.AR.up.rotation.x = -1.7 + stroke * .12; F.AR.fo.rotation.x = -1.6; } else { F.AR.up.rotation.x = -.5 + stroke * .2; F.AR.fo.rotation.x = -.4; pet.rotation.y = Math.PI / 2; pet.position.set(x + .1, Math.abs(a) * .06, -.75); }
    F.g.updateMatrixWorld(true); attach(beard, F.head.parent === F.torso ? { M: { head: new THREE.Matrix4() }, vis: true } : null, 'head', [0, 0, 0]);
    const hp = new THREE.Vector3(); F.head.getWorldPosition(hp); const q = new THREE.Quaternion(); F.head.getWorldQuaternion(q); beard.position.copy(hp).add(new THREE.Vector3(.0, -.12, 0).applyQuaternion(q)).add(new THREE.Vector3(0, 0, 0)); beard.quaternion.copy(q); beard.translateZ(.2); beard.scale.set(1, 1 + n * .12, 1);
    const cx = 0; let cam = [-8, 1.5, 0, 0, 1.0, 0, 46]; const cxp = Math.max(-5, Math.min(5, x * .7)); cam = [cxp, 1.4, -7.5, cxp, 1.1, 0, 46];
    for (let i = 0; i < 60; i++) { const u = ((t * (1 + n * .4) + i * .137) % 1); D.position.set(x - 1.2 - (1 - u) * 3 * (1 + n * .2), .3 + (i % 11) * .18, -.9 - (i % 7) * .1); D.rotation.y = Math.PI / 2; D.scale.set(1, 1, .5 + n * .35); D.updateMatrix(); lines.setMatrixAt(i, D.matrix); D.position.y = -9; } lines.instanceMatrix.needsUpdate = true; lines.visible = n > 3;
    ring.visible = bi === 5 && lt > .8; if (ring.visible) { ring.position.set(x, 1, 0); ring.rotation.y = 0; ring.scale.setScalar(1 + (lt - .8) * 9); ring.material.opacity = clamp(1 - (lt - .8) * .6); }
    W.update(t, bi >= 4 ? 2 : bi >= 2 ? 1 : 0, [0, 4.5], 1); st.cam(...cam); st.follow(x, 0); st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if every time you stroked your *' + (KIND === 'cat' ? 'cat' : KIND === 'goat' ? 'goat' : 'beard') + '*, you went twice as fast?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter('Speed · stroke ' + Math.round(n), MPH(n) + ' mph', NOTE[bi], '×2 every stroke', bi >= 4); hud.tm(''); hud.pop('', 0);
  } };
}
