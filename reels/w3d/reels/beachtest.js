export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, beach, Crowd, R, wander } = lib;
  const st = makeStage({ shadowExtent: 40, fogNear: 140, fogFar: 700, skyTop: 0x6ea8d8, skyMid: 0xbcd8ea, skyBot: 0xf2ece0, fog: 0xdfe8ec, sunDir: [-.7, .55, -.45], sunI: 2.9, clouds: false });
  const b = beach(st.scene, { shoreZ: 40 }); const r = R(4); const N = 40, c = new Crowd(st.scene, N, 7);
  const q = []; for (let i = 0; i < N; i++) q.push([(r() - .5) * 28, 14 + r() * 20, r() * 6.28, r()]);
  return { frame({ t, bi, p }) {
    b.update(t);
    for (let i = 0; i < N; i++) { const o = c.p[i]; o.x = q[i][0]; o.z = q[i][1]; o.yaw = i < 30 ? (q[i][0] > 0 ? .15 : -.15) : Math.PI + .3*Math.sin(i); o.anim = i % 3 ? 'idle' : 'walk'; o.speed = .6; }
    st.cam(-1.5 + p * 2, 1.2, 6, 0, 1.6, 40, 62); st.follow(0, 20); c.update(t); st.render();
    hud.question('What if everyone *farted* at once?', 1); hud.counter('', '', ''); } };
}
