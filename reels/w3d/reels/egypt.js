// What if the Ancient Egyptians had one phone? Pyramid site, a phone passes pharaoh -> workers -> overseer -> everyone; battery dies.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, addBox, mat, Crowd, Particles, R, clamp, smooth, lerp, attach, dropBounce } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const st = makeStage({ shadowExtent: 45, fogNear: 90, fogFar: 420, skyTop: 0x3c6fb0, skyMid: 0x86a9c8, skyBot: 0xe9dcc0, fog: 0xe3d5b8, sunColor: 0xfff0d0, sunDir: [-.6, .65, -.3], sunI: 2.9, exposure: 1.05, clouds: false }); const S = st.scene;
  ground(S, 0xdcca9e, 1400);
  // pyramids
  const stone = 0xd9cba8; for (let k = 0; k < 16; k++) { const w = 120 - k * 7; addBox(S, 10, 3 + k * 6, 150, w, 6, w, new THREE.Color(stone).offsetHSL(0, 0, -k * .004).getHex(), { cast: false }); } for (let k = 0; k < 9; k++) { const w = 60 - k * 6; addBox(S, -120, 2 + k * 4, 170, w, 4, w, stone, { cast: false }); }
  // work site: blocks, ramp, logs
  const plat = addBox(S, 0, .5, 7.2, 8.4, 1.0, 4.2, 0xc9bb98, { round: .04 }); for (const [x, z, w, h, d] of [[-9, 12, 3, 1.4, 2.4], [9, 14, 3.4, 1.6, 2.6]]) addBox(S, x, h / 2, z, w, h, d, 0xe6dcc2, { round: .04 });
  for (let i = 0; i < 8; i++) addBox(S, -3 + i * 1.2, .15, 3, .2, .3, 2.0, 0x6a4a2b, { cast: false, ry: 0 });
  const palm = (x, z) => { const t = addBox(S, x, 1.6, z, .22, 3.2, .22, 0x7b5a34); for (let i = 0; i < 6; i++) { const l = addBox(S, x + Math.cos(i) * .9, 3.3, z + Math.sin(i) * .9, 2, .06, .35, 0x3a7a3a, { ry: -i }); l.rotation.z = Math.sin(i) * .3; } }; palm(-9, 3); palm(10, 4);
  // people
  const WK = 120, crowd = new Crowd(S, WK + 4, 33); const P = crowd.p; const SK = [0xc9966b, 0xb98255, 0xd7a779, 0xa86f44];
  const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); }; const finish = () => { for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true; };
  for (let i = 0; i < WK; i++) { const o = P[i]; const sk = SK[i % 4]; o.skin.set(sk); o.shirt.set(sk); o.pants.set(0xf1ece0); o.hair.set(0x14110f); ['torso', 'armL', 'armR'].forEach((k) => col(i, k, sk)); ['head', 'handL', 'handR', 'neck'].forEach((k) => col(i, k, sk)); ['legL', 'legR'].forEach((k) => col(i, k, 0xf1ece0)); col(i, 'hair', 0x14110f); }
  const PH = WK, OV = WK + 1, HE = WK + 2; // pharaoh, overseer, hero (orange hoodie)
  { const o = P[PH]; o.skin.set(0xc9966b); o.shirt.set(0xc9966b); o.pants.set(0xf1ece0); ['torso', 'armL', 'armR', 'head', 'handL', 'handR', 'neck'].forEach((k) => col(PH, k, 0xc9966b)); ['legL', 'legR'].forEach((k) => col(PH, k, 0xf1ece0)); col(PH, 'hair', 0x14110f);
    const w = P[OV]; ['torso', 'armL', 'armR', 'head', 'handL', 'handR', 'neck'].forEach((k) => col(OV, k, 0x8d5a34)); ['legL', 'legR'].forEach((k) => col(OV, k, 0xf1ece0)); col(OV, 'hair', 0x0a0a0a); col(OV, 'torso', 0x8d5a34);
    const h = P[HE]; ['torso', 'armL', 'armR'].forEach((k) => col(HE, k, 0xe8892f)); ['legL', 'legR'].forEach((k) => col(HE, k, 0x3a3f4b)); ['head', 'handL', 'handR', 'neck'].forEach((k) => col(HE, k, 0xe6c3a0)); col(HE, 'hair', 0x5a3a22); finish(); }
  // pharaoh headdress + collar + throne, overseer whip, phone
  const gold = mat(0xe3b93c, { roughness: .35, metalness: .5 }), blue = mat(0x2a4fa5), strip = mat(0xf0e2b0); const hd = new THREE.Group(); { const cap = new THREE.Mesh(new THREE.BoxGeometry(.56, .22, .56), strip); cap.position.y = .42; hd.add(cap); for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(.58, .045, .58), i % 2 ? blue : gold); b.position.y = .32 + i * .06; hd.add(b); } for (const sx of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(.12, .5, .4), strip); f.position.set(sx * .3, -.05, -.02); hd.add(f); } const col2 = new THREE.Mesh(new THREE.BoxGeometry(.8, .1, .5), gold); col2.position.y = -.4; hd.add(col2); const beard = new THREE.Mesh(new THREE.BoxGeometry(.1, .24, .1), blue); beard.position.set(0, -.32, .26); hd.add(beard); } S.add(hd);
  const throne = new THREE.Group(); { const b1 = new THREE.Mesh(new THREE.BoxGeometry(2.0, .5, 1.6), gold); b1.position.y = .25; const b2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.6, .3), gold); b2.position.set(0, 1.5, -.7); const b3 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, .1), blue); b3.position.set(0, 1.5, -.52); throne.add(b1, b2, b3); throne.traverse((m) => { m.castShadow = true; }); throne.position.set(0, 0, 22); S.add(throne); }
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(4, 16), mat(0xc0564f)); rug.rotation.x = -Math.PI / 2; rug.position.set(0, .02, 14); S.add(rug);
  const whip = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(.2, -.4, .3), new THREE.Vector3(.4, -1.2, .5), new THREE.Vector3(.2, -2, .3)]), 14, .018, 5), mat(0x5a3a22)); whip.visible = false; S.add(whip);
  const phone = new THREE.Group(); { const body = new THREE.Mesh(new THREE.BoxGeometry(.16, .3, .035), mat(0x15161a, { roughness: .2 })); const scr = new THREE.Mesh(new THREE.BoxGeometry(.14, .27, .005), new THREE.MeshBasicMaterial({ color: 0x9fd0ff })); scr.position.z = .02; phone.add(body, scr); } phone.scale.setScalar(1.7); S.add(phone); const glow = new THREE.PointLight(0x9fd0ff, 2.5, 6); S.add(glow);
  const sparks = new Particles(S, 40, 0xffe9a0, .06, { rough: .6, emissive: 0x806020 });
  const N_ = [0, 0, 1, 3, 41, 4000, 3790012, 3790012]; const NOTES = ['', '', 'one very curious king', 'one curious work crew', 'one very calm boss', 'a small city', 'every single Egyptian', '0 scrolls left'];
  const HX = 3.2, HZ = 5.0;
  const place = (i, x, z, yaw, anim, y = 0, sp = .5) => { const o = P[i]; o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; };
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 7); const ph = P[PH], ov = P[OV], he = P[HE]; for (let i = 0; i < WK + 4; i++) { P[i].vis = false; P[i].arms = null; }
    let cam, pos = new THREE.Vector3(0, -9, 0);
    if (bi === 0) { place(PH, 0, 6, 0, 'idle', 0, .4); ph.scale = 1.3; ph.extra = .02; cam = [.5, 2.3, 11, 0, 2.2, 6, 36]; pos.set(.1, 2.0, 6.5); }
    else if (bi === 1) { place(HE, -2, 6, 0, 'idle', 0, .5); place(PH, 3.5, 3.5, .2, 'idle', 0, .3); const fall = clamp((lt - .6) / 1.0); const y = lerp(1.3, .04, fall * fall); pos.set(-1.2, y, 6.5); cam = [-5.5, 1.8, 11, -1.2, 1.2, 6, 46]; for (let i = 0; i < 6; i++) place(i, -8 + i * 3, 1.2, 0, 'idle', 0, .4); }
    else if (bi === 2) { place(PH, -.7, 6, Math.PI / 2, 'idle', 0, .4); ph.scale = 1.15; place(0, .7, 6, -Math.PI / 2, 'idle', 0, .4); place(1, 2.6, 6.6, -Math.PI / 2 + .3, 'idle', 0, .4); const u = clamp(p * 1.4); pos.set(lerp(-.4, .4, smooth(u)), 1.55 + Math.sin(u * 3.14) * .25, 6); cam = [0, 1.8, 11.5, 0, 1.5, 6, 46]; }
    else if (bi === 3) { for (let i = 0; i < 3; i++) place(i, -2 + i * 2.0, 5.6, 0, 'sit', .15, .4); for (let i = 3; i < 9; i++) place(i, -9 + (i - 3) * 3.6, 3 - (i % 2) * 1.2, 0, 'idle', 0, .4); P[0].extra = .03; pos.set(0, 1.55 + Math.sin(t * 5) * .02, 5.9); cam = [.8, 2.1, 12.5, 0, 1.5, 5.6, 42]; }
    else if (bi === 4) { const ap = smooth(clamp(p * 1.1)); for (let i = 0; i < 3; i++) place(i, -2 + i * 2.0, 5.6, 0, 'sit', .15, .4); const ox = lerp(8, 3.9, ap); place(OV, ox, 5.6, -Math.PI / 2, p > .75 ? 'sit' : 'walk', p > .75 ? .15 : 0, .6); if (p > .75) ov.yaw = 0; whip.visible = p < .7; whip.position.set(ox - .6, 1.6, 5.9); pos.set(0, 1.55, 5.9); cam = [3.5, 2.1, 12.5, 1, 1.5, 5.6, 44]; }
    else if (bi >= 5) { const rows = 8, per = 15; for (let i = 0; i < WK; i++) { const r = Math.floor(i / per), c = i % per; place(i, -9 + c * 1.35, 9 + r * 1.7, Math.PI, 'idle', 0, .5); P[i].extra = bi === 6 ? .5 : .06; if (bi >= 6) { P[i].anim = 'panic'; } } place(PH, 0, 7, Math.PI, 'idle', 0, .4); ph.scale = 1.2; place(HE, 3.2, 5.5, Math.PI + .3, 'idle', 0, .5); if (bi === 7) { ph.anim = 'panic'; ph.extra = .5; } pos.set(0, 4 + Math.sin(t * 4) * .1, 7.2); cam = bi === 5 ? [3 - p * 3, 2.0, 1 - p * 2, 0, 1.8, 14, 58] : bi === 6 ? [0, 12 - p * 4, -4, 0, 1, 14, 62] : [0, 2.4, 3.2, 0, 2.4, 7, 46]; }
    // ---- hand interactions: arms reach, the phone is attached to a real hand (or falls with bounces)
    let holder = null, free = null; const PHN = [0, .04, .1];
    if (bi === 0) { ph.arms = { lx: 0, lz: -.08, rx: -1.9, rz: .05 }; holder = { o: ph, key: 'handR', th: -1.9 }; }
    else if (bi === 1) { const REL = .9; const holdA = { lx: 0, lz: -.1, rx: -1.7, rz: .05 }; he.arms = holdA; if (lt < REL) holder = { o: he, key: 'handR', th: -1.7 }; else { crowd.update(t - (lt - REL)); attach(phone, he, 'handR', PHN, [1.7, Math.PI, 0]); free = { pos: new THREE.Vector3().setFromMatrixPosition(phone.matrix), dt: lt - REL }; he.arms = { lx: -.4, lz: -.25, rx: -.5, rz: .25 }; } }
    else if (bi === 2) { const u = clamp(p * 1.4), w0 = P[0]; const kp = smooth(clamp(u / .3)) * (1 - smooth(clamp((u - .62) / .25))), kw = smooth(clamp((u - .25) / .3)) * (1 - smooth(clamp((u - .9) / .1))); ph.arms = { lx: -1.55 * kp - .1, lz: 0, rx: 0, rz: .1 }; w0.arms = { lx: 0, lz: -.1, rx: -1.55 * kw - .05, rz: .05 }; holder = u < .5 ? { o: ph, key: 'handL', th: ph.arms.lx, psi: -Math.PI / 2 } : { o: w0, key: 'handR', th: w0.arms.rx, psi: Math.PI / 2 }; }
    else if (bi === 3 || bi === 4) { const w1 = P[1]; w1.arms = { lx: 0, lz: -.05, rx: -1.3 + Math.sin(t * 4) * .06, rz: 0 }; holder = { o: w1, key: 'handR', th: w1.arms.rx }; if (bi === 4) ov.arms = { lx: 0, lz: 0, rx: -1.7 + Math.sin(t * 9) * .5, rz: .05 }; }
    else if (bi === 5 || bi === 6) { ph.arms = { lx: -.2, lz: -.15, rx: -3.0, rz: .08 }; holder = { o: ph, key: 'handR', th: -3.0 }; }
    else { if (lt < 1.6) { ph.arms = { lx: -2.9, lz: -.2, rx: -3.0, rz: .2 }; holder = { o: ph, key: 'handR', th: -3.0 }; } else { ph.arms = { lx: -2.9, lz: -.2, rx: -2.9, rz: .2 }; crowd.update(t - (lt - 1.6)); ph.arms = { lx: -2.9, lz: -.2, rx: -3.0, rz: .2 }; crowd.update(t - (lt - 1.6)); attach(phone, ph, 'handR', PHN, [3.0, Math.PI, 0]); free = { pos: new THREE.Vector3().setFromMatrixPosition(phone.matrix), dt: lt - 1.6 }; ph.arms = { lx: -2.9, lz: -.2, rx: -2.9, rz: .2 }; } }
    crowd.update(t);
    if (ov.arms && ov.vis) { whip.visible = bi === 4 && p < .7; attach(whip, ov, 'handR', [0, -.1, .05], [-.4, 0, 0]); }
    // props follow bodies
    const poseHead = (o) => { const sc = o.scale * o.h; return [o.x, o.y + 1.73 * sc, o.z]; };
    hd.visible = true; { const q = poseHead(ph); hd.position.set(q[0], q[1] - .1 * ph.scale, q[2]); hd.rotation.y = ph.yaw; hd.scale.setScalar(ph.scale * 1.05); }
    throne.visible = bi === 7 || bi === 5 || bi === 6 || bi === 0; plat.visible = bi === 3 || bi === 4; if (bi === 0) { throne.position.set(0, 0, 4.7); throne.rotation.y = 0; } else { throne.position.set(0, 0, 8.1); throne.rotation.y = Math.PI; }
    if (holder) { const th = holder.th; attach(phone, holder.o, holder.key, PHN, [-th, holder.psi ?? Math.PI, 0]); phone.visible = true; }
    else if (free) { const f = dropBounce(free.pos.y, 0, free.dt, .3); phone.matrixAutoUpdate = true; phone.position.set(free.pos.x + Math.min(free.dt, .8) * .15, f.y + .02, free.pos.z); phone.rotation.set(-Math.min(free.dt * 3, 1) * 1.45, Math.PI * (1 + Math.min(free.dt, 1) * .2), 0); phone.visible = true; }
    else { phone.visible = false; } pos.copy(phone.visible ? new THREE.Vector3().setFromMatrixPosition(phone.matrixWorld.copy(phone.matrixAutoUpdate ? phone.matrix : phone.matrix)) : new THREE.Vector3(0, -9, 0)); glow.position.copy(pos); glow.intensity = phone.visible && bi !== 7 ? 2.2 : 0;
    for (let i = 0; i < 40; i++) { const u = ((t * .6 + i * .0731) % 1); sparks.set(i, pos.x + Math.cos(i * 2.4) * .6, pos.y + u * 1.4, pos.z + Math.sin(i * 1.7) * .6, bi >= 6 && bi < 7 ? 1 - u : 0); } sparks.done();
    st.cam(...cam); st.follow(0, 10); st.render();
    const n = bi >= 4 ? lerp(N_[bi - 1], N_[bi], smooth(p)) : N_[bi]; const bat = bi < 7 ? 100 : Math.max(0, Math.round(100 * (1 - p * 2.2)));
    hud.egypt(true, bi === 7 ? '#d9503a' : bi >= 6 ? '#2f9a4f' : '#d9a12b', bi === 0); hud.question(bi === 0 ? 'What if the Ancient Egyptians had one *phone*?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else { hud.counter('Scrolls taken', fmt(n), '≈ ' + NOTES[bi], bi >= 6 ? 'BATTERY ' + bat + '%' : '2560 BC', false); }
  } };
}
