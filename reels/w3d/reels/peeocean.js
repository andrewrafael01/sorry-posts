// What if every human peed in the ocean at the same time (8.2e9 x 1.4 L = 1.15e10 L = 4,600 Olympic pools; sea level +0.00003 mm).
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, beach, Crowd, Particles, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const st = makeStage({ shadowExtent: 40, fogNear: 160, fogFar: 700, skyTop: 0x6ea8d8, skyMid: 0xbcd8ea, skyBot: 0xf2ece0, fog: 0xdfe8ec, sunDir: [-.7, .55, -.45], sunI: 2.9, clouds: false });
  const bch = beach(st.scene, { shoreZ: 60, dress: 1, boats: 3, gulls: 12 }); const r = R(9); const N = 130, crowd = new Crowd(st.scene, N, 5);
  const q = []; for (let i = 0; i < N; i++) { const row = i % 4; q.push([(r() - .5) * 46, 63 + row * 2.4 + r() * 1.2, (r() - .5) * .5, r()]); }
  const PER = 10, drops = new Particles(st.scene, N * PER, 0xf4d646, .1, { rough: .2, emissive: 0x806a10 });
  const MASS = 8.2e9 * 1.4;
  return { frame({ t, bi, lt, p }) {
    bch.update(t); const k = bi === 0 ? 0 : bi === 1 ? smooth(p) * .3 : bi === 2 ? .3 + .35 * smooth(p) : bi === 3 ? .65 + .15 * p : bi === 4 ? .8 + .2 * smooth(p) : 1;
    bch.seaMat.uniforms.tint.value.set(.75 * k, 0, 0);
    const pee = bi >= 1;
    for (let i = 0; i < N; i++) { const o = crowd.p[i], c = q[i]; o.x = c[0]; o.z = c[1]; o.y = -.1; o.yaw = c[2] + (bi === 5 ? Math.PI * smooth(clamp(lt * 2)) * (i % 3 === 0 ? 1 : 0) : 0); o.anim = 'idle'; o.speed = .5; o.extra = pee ? .05 : 0; }
    crowd.update(t);
    for (let i = 0; i < N; i++) for (let j = 0; j < PER; j++) { const k2 = i * PER + j; const c = q[i]; if (!pee) { drops.set(k2, 0, 0, 0, 0); continue; } const u = ((t * 1.1 + j / PER + c[3]) % 1) * .8; const vz = 2.6 + c[3], vy = 1.7; const y = .8 + vy * u - 4.9 * u * u; if (y < 0) { drops.set(k2, 0, 0, 0, 0); continue; } drops.set(k2, c[0] + (c[3] - .5) * .1, y, c[1] + .25 + vz * u, 1); } drops.done();
    const cams = [[-10, 1.7, 48, 0, 1.4, 72, 60], [8, 1.5, 56, -4, 1.2, 74, 56], [0, 22 - 4 * p, 50, 0, 0, 72, 62], [3.2, .9, 58, 0, .9, 70, 55], [-12 + 4 * p, 3.0, 54, 0, 1.0, 78, 62], [-16, 5, 46, 0, 1.5, 74, 62], [-16, 5, 46, 0, 1.5, 74, 62]];
    st.cam(...cams[Math.min(bi, 6)]); st.follow(0, 68); st.render();
    hud.style('C'); hud.question('What if every human *peed* in the ocean at the same time?', 1, bi > 0);
    if (bi === 0) hud.counter('', '', ''); else if (bi <= 2) { hud.counter('Pee produced', fmt(MASS * smooth(clamp(bi === 1 ? p : 1))) + ' L', '8.2 billion people · 1.4 L each', '', false); hud.tm(bi === 2 ? '≈ ' + fmt(4592 * smooth(p)) + ' Olympic pools' : ''); }
    else if (bi === 3) { hud.counter('Sea level rise', '0.00003 mm', 'you literally cannot see it', '', false); hud.tm(''); } else { hud.counter('Beach status', 'warm bath', 'forever', '', true); hud.tm(''); }
    hud.pop(['', '', 'WHY ARE YOU LIKE THIS', 'NOTHING HAPPENS', 'WARM BATH', 'FREE HOT TUB', 'DISGUSTING'][Math.min(bi, 6)] && lt > .5 ? ['', '', 'WHY ARE YOU LIKE THIS', 'NOTHING HAPPENS', 'WARM BATH', 'FREE HOT TUB', 'DISGUSTING'][Math.min(bi, 6)] : '', Math.min(1, (lt - .5) * 6));
  } };
}
