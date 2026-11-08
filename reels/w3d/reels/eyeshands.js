import { makeFig } from './_fig.js';
// What if your eyes were on your hands? Played straight, front-on studio: eyes on both palms looking around, a wave, a clap (eyes squash), a high five (eyes slapped shut), a finger to the nose (huge eye closeup). Face is blank.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, mat, clamp, smooth, lerp } = lib;
  const st = makeStage({ shadowExtent: 14, fogNear: 40, fogFar: 100, skyTop: 0xe3e6ea, skyMid: 0xe3e6ea, skyBot: 0xe3e6ea, fog: 0xe3e6ea, clouds: false, sunDir: [-.4, .9, .5], sunI: 2.4, hemi: 1.6 }); const S = st.scene;
  const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 48), mat(0xeeeeee, { roughness: .6 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; S.add(floor);
  const F = makeFig(lib, S, { eyesOnHands: true, face: false }), G = makeFig(lib, S, { shirt: 0xe84a8a, pants: 0x3a3f4b, face: true });
  const LAB = ['', 'WAVING', 'CLAPPING', 'HIGH FIVE', 'NOSE']; const NOTE = ['', 'eyes visible: 2', 'eyes squashed: 2', 'eyes slapped: 2', 'privacy: none'];
  const look = (e, tx, ty, s = 1) => { const ir = e.userData.iris, pu = e.userData.pup; ir.position.x = tx * .035 * s; ir.position.y = ty * .035 * s; pu.position.x = ir.position.x; pu.position.y = ir.position.y; };
  const shut = (e, v) => { e.scale.set(1, 1 - v * .92, 1); };
  const reset = () => { for (const f of [F, G]) { f.L.th.rotation.set(0, 0, 0); f.R.th.rotation.set(0, 0, 0); f.L.sh.rotation.set(0, 0, 0); f.R.sh.rotation.set(0, 0, 0); f.AL.up.rotation.set(0, 0, 0); f.AR.up.rotation.set(0, 0, 0); f.AL.fo.rotation.set(0, 0, 0); f.AR.fo.rotation.set(0, 0, 0); f.head.rotation.set(0, 0, 0); f.hips.position.y = .95; f.AL.hand.rotation.set(0, 0, 0); f.AR.hand.rotation.set(0, 0, 0); } F.eyes.forEach((e) => { e.scale.set(1, 1, 1); e.position.set(0, -.04, .06); }); G.g.visible = false; };
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 4); reset(); F.set({ x: 0, z: 0, yaw: 0 }); let cam = [0, 1.5, 6.2, 0, 1.2, 0, 44]; const sc = Math.sin(t * 2);
    // facing the camera: figure's left arm is on screen right; palms face the camera when forearms bend up
    F.AL.fo.rotation.x = -1.3; F.AR.fo.rotation.x = -1.3; F.AL.up.rotation.z = -(.35); F.AR.up.rotation.z = -(-.35); F.AL.up.rotation.x = -.25; F.AR.up.rotation.x = -.25;
    F.eyes.forEach((e, i) => look(e, Math.sin(t * 1.3 + i * 2), Math.cos(t * 1.7 + i), 1));
    if (bi === 1) { F.AR.up.rotation.z = -(-2.4); F.AR.up.rotation.x = 0; F.AR.fo.rotation.x = 0; F.AR.fo.rotation.z = Math.sin(t * 7) * .6; F.AL.up.rotation.z = -(.1); F.AL.fo.rotation.x = 0; look(F.eyes[1], Math.sin(t * 7) * 1.5, 0); look(F.eyes[0], 0, -.5); cam = [0, 1.7, 5.6, 0, 1.4, 0, 44]; }
    else if (bi === 2) { const c = Math.abs(Math.sin(t * 5)); F.AL.up.rotation.z = -(lerp(.2, -.9, c)); F.AR.up.rotation.z = -(lerp(-.2, .9, c)); F.AL.up.rotation.x = -1.4; F.AR.up.rotation.x = -1.4; F.AL.fo.rotation.x = 0; F.AR.fo.rotation.x = 0; F.eyes.forEach((e) => { shut(e, c > .8 ? 1 : c * .6); e.scale.x = 1 + c * .3; }); cam = [0, 1.6, 5.2, 0, 1.45, 0, 42]; }
    else if (bi === 3) { G.g.visible = true; G.set({ x: 1.2, z: 0, yaw: -Math.PI / 2 - .3 }); const c = Math.abs(Math.sin(t * 4)); F.AR.up.rotation.z = -(-2.5 + c * .5); F.AR.up.rotation.x = 0; F.AR.fo.rotation.x = 0; G.AL.up.rotation.z = -(1.6 - c * .3); G.AL.up.rotation.x = 0; G.AL.fo.rotation.x = 0; shut(F.eyes[1], c > .85 ? 1 : 0); look(F.eyes[1], 0, 0); F.eyes[0].scale.set(1, 1, 1); cam = [-1.4, 1.7, 5.4, 0, 1.6, 0, 44]; }
    else if (bi === 4) { F.AR.up.rotation.x = -1.9 + Math.sin(t * 3) * .12; F.AR.up.rotation.z = -(0); F.AR.fo.rotation.x = -1.4; F.AR.hand.rotation.x = 0; look(F.eyes[1], 0, 1.3, 1); look(F.eyes[0], 0, 0); cam = [0, 1.9, 3.6, 0, 1.75, 0, 38]; }
    st.cam(...cam); st.follow(0, 0); S.updateMatrixWorld(true); F.eyes.forEach((e) => { const sx = e.scale.x, sy = e.scale.y; e.lookAt(st.camera.position); e.scale.x = sx; e.scale.y = sy; }); st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if your eyes were on your *hands*?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter('Subject: Gary', LAB[bi], NOTE[bi], 'CLINICAL FOOTAGE', bi >= 3); hud.tm(''); hud.pop('', 0);
  } };
}
