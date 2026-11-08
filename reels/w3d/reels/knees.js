import { makeFig } from './_fig.js';
// What if your knees bent backwards? Played straight in a plain studio: walking, stairs, soccer (ball goes backwards into his own face), running. No commentary.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, mat, addBox, Crowd, clamp, smooth, lerp } = lib;
  const st = makeStage({ shadowExtent: 14, fogNear: 40, fogFar: 100, skyTop: 0xe3e6ea, skyMid: 0xe3e6ea, skyBot: 0xe3e6ea, fog: 0xe3e6ea, clouds: false, sunDir: [-.4, .9, .5], sunI: 2.4, hemi: 1.6 }); const S = st.scene;
  const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 48), mat(0xeeeeee, { roughness: .6 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; S.add(floor);
  const F = makeFig(lib, S); const ball = new THREE.Mesh(new THREE.SphereGeometry(.16, 20, 14), mat(0xf4f4f4)); ball.castShadow = true; S.add(ball);
  const stairs = new THREE.Group(); for (let i = 0; i < 6; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(2, .22, .5), mat(0xd9cdb5)); s.position.set(0, 1.32 - i * .22 - .11, -1.5 + i * .5); s.castShadow = s.receiveShadow = true; stairs.add(s); } stairs.rotation.y = 0; S.add(stairs);
  const crowd = new Crowd(S, 8, 3); const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; }; for (let i = 0; i < 8; i++) { ['torso', 'armL', 'armR'].forEach((k) => col(i, k, [0xe84a8a, 0x3c8fe8, 0xf2d03c, 0x2ea84f][i % 4])); ['legL', 'legR'].forEach((k) => col(i, k, 0x2a2f3c)); }
  const LAB = ['', 'WALKING', 'STAIRS', 'SOCCER', 'RUNNING']; const NOTE = ['', 'knee angle: reversed', 'knee angle: reversed', 'goal: own', 'witnesses: 8'];
  const gait = (ph, amp, kn) => { const a = Math.sin(ph); const b = Math.sin(ph + Math.PI); const k = (x, ph2) => -kn * Math.max(0, Math.sin(ph2 + .9)); F.L.th.rotation.x = a * amp; F.L.sh.rotation.x = k(0, ph); F.R.th.rotation.x = b * amp; F.R.sh.rotation.x = k(0, ph + Math.PI); F.AL.up.rotation.x = b * amp * .8; F.AR.up.rotation.x = a * amp * .8; F.AL.fo.rotation.x = -.3; F.AR.fo.rotation.x = -.3; };
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 4); crowd.p.forEach((o) => (o.vis = false)); ball.visible = false; stairs.visible = false; F.set({ x: 0, y: 0, z: 0, yaw: 0 });
    let cam = [8.5, 1.4, 0, 0, 1.0, 0, 44]; const run = bi === 4;
    if (bi === 0) { gait(t * 2.2, .35, 1.0); F.hips.position.y = .95 + .02 * Math.sin(t * 4.4); F.set({ x: 0, z: 0, yaw: 0 }); cam = [8.0, 1.4, 0, 0, 1.0, 0, 44]; }
    else if (bi === 1) { gait(t * 3.2, .6, 1.3); F.hips.position.y = .95 + Math.abs(Math.sin(t * 3.2)) * .05; F.set({ z: lerp(-3.5, 3.5, (lt * .45) % 1), yaw: 0 }); cam = [8.0, 1.4, F.g.position.z * .4, 0, 1.0, F.g.position.z * .4, 44]; }
    else if (bi === 2) { stairs.visible = true; const u = clamp(lt / 1.5); const z = lerp(-1.3, 1.2, u); const step = Math.min(5, Math.max(0, Math.floor((z + 1.5) / .5))); const y = 1.32 - (step + 1) * .22 + .11 + .0; gait(t * 4, .55, 1.4); F.hips.position.y = .95; F.set({ x: 0, z, y: Math.max(0, 1.1 - (step + 1) * .22) - .0, yaw: 0 }); F.g.position.y = 1.32 - (step + 1) * .22 + .11 - .11; cam = [8.0, 1.5, 0, 0, 1.0, 0, 46]; }
    else if (bi === 3) { const k = lt; gait(0, 0, 0); F.set({ z: -.6, yaw: 0 }); const swing = k < .15 ? 0 : k < .4 ? smooth((k - .15) / .25) : 1; F.R.th.rotation.x = -.2 - swing * 1.2; F.R.sh.rotation.x = swing * 1.3 * -1 + .0; F.AL.up.rotation.x = .3; F.AR.up.rotation.x = -.3; ball.visible = true; const kick = (k - .4); if (kick < 0) ball.position.set(0, .16, .3); else { const u = kick; ball.position.set(0, .16 + Math.max(0, 2.1 * u - 3.6 * u * u) * 2 + (u > .9 ? 0 : 0), lerp(.3, -.25, Math.min(1, u * 1.4))); if (u > .75) ball.position.set(0, 1.75, -.25); } F.head.rotation.x = kick > .7 ? -.5 : 0; cam = [8.5, 1.4, 0, 0, 1.0, 0, 44]; }
    else { const sp = t * 7; gait(sp, .8, 1.6); F.hips.position.y = .95 + Math.abs(Math.sin(sp)) * .12; F.set({ x: 0, z: lerp(-4, 4, (lt * .7) % 1), yaw: 0 }); crowd.p.forEach((o, i) => { o.vis = true; o.x = -7 - (i % 2) * 1.5; o.z = -4 + i * 1.1; o.y = 0; o.yaw = Math.PI / 2; o.anim = 'idle'; o.speed = .3; o.scale = 1.1; o.arms = null; }); cam = [10.5, 1.8, 0, 0, 1.2, 0, 50]; }
    crowd.update(t); st.cam(...cam); st.follow(0, 0); st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if your knees bent *backwards*?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter('Subject: Gary', LAB[bi], NOTE[bi], 'CLINICAL FOOTAGE', bi >= 3); hud.tm(''); hud.pop('', 0);
  } };
}
