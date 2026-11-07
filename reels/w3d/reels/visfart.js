// What if every fart was visible, neon colored? Beach crowd lighting up with rainbow clouds; density ramps by beat.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, beach, Crowd, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const st = makeStage({ shadowExtent: 40, fogNear: 160, fogFar: 700, skyTop: 0x6ea8d8, skyMid: 0xbcd8ea, skyBot: 0xf2ece0, fog: 0xdfe8ec, sunDir: [-.7, .55, -.45], sunI: 2.9, clouds: false });
  const bch = beach(st.scene, { shoreZ: 70, dress: 3, boats: 3, gulls: 8 }); const r = R(12); const N = 120, crowd = new Crowd(st.scene, N, 15);
  const q = []; for (let i = 0; i < N; i++) q.push([(r() - .5) * 40, 22 + r() * 36, r() * 6.28, r()]);
  const PC = 480; const puffs = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ roughness: .6, emissive: 0x222222, flatShading: true, transparent: true, opacity: .82 }), PC); puffs.frustumCulled = false; scene_add(); function scene_add() { st.scene.add(puffs); }
  const PAL = [0xff3fa4, 0x9b5cff, 0x2de2a6, 0xffd23f, 0x3fb8ff, 0x7dff3f, 0xff7a3f]; const col = new THREE.Color(); const owner = [], per = [], off = []; for (let i = 0; i < PC; i++) { owner.push((i * 7) % N); per.push(2.2 + r() * 2); off.push(r() * 5); col.set(PAL[(i * 3 + ((i / 7) | 0)) % PAL.length]); puffs.setColorAt(i, col); } puffs.instanceColor.needsUpdate = true;
  const D = [0, .1, .25, .45, .7, .9, 1, 1];
  const M = new THREE.Matrix4(), HID = new THREE.Matrix4().makeScale(0, 0, 0), Q = new THREE.Quaternion(), V = new THREE.Vector3(), S3 = new THREE.Vector3();
  return { frame({ t, bi, lt, p }) {
    bch.update(t); const dens = lerp(D[bi], D[bi + 1] ?? D[bi], smooth(p)); const active = Math.floor(dens * PC);
    for (let i = 0; i < N; i++) { const o = crowd.p[i], c = q[i]; o.x = c[0]; o.z = c[1]; o.yaw = c[2]; o.y = 0; o.anim = bi >= 3 ? (i % 4 === 0 ? 'jump' : 'idle') : 'idle'; o.speed = .6; o.extra = 0; o.scale = 1; } crowd.update(t);
    for (let i = 0; i < PC; i++) { if (i >= active) { puffs.setMatrixAt(i, HID); continue; } const u = ((t + off[i]) / per[i]) % 1; const c = q[owner[i]]; const grow = 1 - Math.pow(1 - u, 2); const sc = (.2 + grow * (.55 + dens * .8)) * (u > .85 ? (1 - u) / .15 : 1); V.set(c[0] + Math.sin(i * 1.9 + u * 3) * .6 * grow, .8 + u * 2.6, c[1] - .4 + Math.cos(i * 2.3) * .5 * grow); S3.set(sc, sc * .8, sc); M.compose(V, Q, S3); puffs.setMatrixAt(i, M); } puffs.instanceMatrix.needsUpdate = true;
    const cams = [[-6, 1.7, 14, 0, 1.5, 40, 58], [4, 1.4, 20, 0, 1.4, 42, 52], [-8, 1.6, 24, 0, 1.6, 44, 54], [6, 1.8, 18, 0, 1.8, 42, 58], [0, 2.4, 14, 0, 1.6, 44, 56], [0, 14, 20, 0, 1.0, 44, 62], [0, 6, 18 + 4 * p, 0, 2.0, 44, 62], [0, 6, 22, 0, 2.0, 44, 62]];
    st.cam(...cams[Math.min(bi, 7)]); st.follow(0, 40); st.render();
    hud.style('C'); hud.question('What if every *fart* was visible?', 1, bi > 0);
    const NOTE = ['', 'one pink problem', 'brenda. brenda.', 'nobody can lie anymore', 'dating is over', 'the color is regret', 'the thanksgiving incident'][Math.min(bi, 6)];
    if (bi === 0) hud.counter('', '', ''); else { hud.counter('Visible farts per day', fmt(115e9 * (.05 + .95 * dens)), NOTE, '8.2 billion people · 14 a day', dens > .6); hud.tm(''); }
    const POP = ['', 'HOT PINK. EVERYONE KNOWS.', 'BRENDA.', 'GARY IS JUST GREEN', 'NEITHER OF YOU SAYS ANYTHING', 'REGRET (PANTONE)', 'NOBODY MAKES IT OUT'][Math.min(bi, 6)]; hud.pop(POP && lt > .5 ? POP : '', Math.min(1, (lt - .5) * 6));
  } };
}
