import { room } from './_rooms.js';
// What if every time you said "bro" your teacher aged a year? Classroom: students say bro, Mrs. Davis ages to dust.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, Particles, R, clamp, smooth, lerp, attach } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ fog: 0xd8d2c4, fogNear: 14, fogFar: 46, clouds: false, skyTop: 0xd8d2c4, skyMid: 0xd8d2c4, skyBot: 0xd8d2c4, shadowExtent: 12, hemi: 1.5, sunI: 1.8, sunDir: [-.4, .9, -.3], exposure: 1.15 }); const S = A.scene;
  room(lib, S, { wall: 0xc9d6c2, floor: 0xb99a6a, w: 12, d: 13 });
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  // board on the left wall? we look at the teacher from the back: board on the far wall (z=8.3)
  const bt = cvs(512, 256, (g, w, h) => { g.fillStyle = '#1f3d2e'; g.fillRect(0, 0, w, h); g.fillStyle = '#eee'; g.font = '700 44px Georgia'; g.fillText('MRS. DAVIS', 30, 70); g.font = '700 30px Georgia'; g.fillText('MATH. PLEASE BE QUIET.', 30, 120); g.fillText('2 + 2 = 4', 30, 190); }); const board = new THREE.Mesh(new THREE.PlaneGeometry(6, 2.6), new THREE.MeshStandardMaterial({ map: bt })); board.position.set(0, 2.1, 8.3); board.rotation.y = Math.PI; S.add(board);
  const desk = (x, z) => { addBox(S, x, .72, z, .9, .06, .6, 0xc09a62); for (const [dx, dz] of [[-.4, -.25], [.4, -.25], [-.4, .25], [.4, .25]]) addBox(S, x + dx, .36, z + dz, .05, .7, .05, 0x555555); }; const SPOS = [[-3.2, 1.8], [-3.2, 3.4], [-3.2, 5.0], [3.2, 1.8], [3.2, 3.4], [3.2, 5.0]]; for (const [x, z] of SPOS) desk(x, z + .45);
  // people: 0 teacher, 1..8 students
  const crowd = new Crowd(S, 9, 66); const P = crowd.p; const col = (i, k, c) => crowd.parts[k].setColorAt(i, new THREE.Color(c));
  const T = P[0]; ['torso', 'armL', 'armR'].forEach((k) => col(0, k, 0xb04a6a)); ['legL', 'legR'].forEach((k) => col(0, k, 0x3a3f4b)); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(0, k, 0xe6c3a0)); crowd.parts.hair.setColorAt(0, new THREE.Color(0x5a3a22)); for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  const mkBubble = () => { const c = document.createElement('canvas'); c.width = 320; c.height = 128; const g = c.getContext('2d'); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); sp.scale.set(.9, .36, 1); S.add(sp); let cur = null; return { sp, set(text) { if (text === cur) return; cur = text; g.clearRect(0, 0, 320, 128); g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 7; g.beginPath(); g.roundRect(6, 6, 308, 84, 22); g.fill(); g.stroke(); g.fillStyle = '#111'; g.font = '800 48px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText(text, 160, 66); tex.needsUpdate = true; } }; };
  const bub = P.map(() => mkBubble()); const cane = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 1.0, 6), mat(0x7a5230)); cane.visible = false; S.add(cane); const beard = new THREE.Mesh(new THREE.BoxGeometry(.3, .1, .06), mat(0xf4f4f4)); beard.visible = false; S.add(beard); const dust = new Particles(S, 120, 0xcfc8b8, .09, { rough: 1 });
  const AGE = [30, 30, 31, 45, 70, 100, 140, 200, 200]; const NOTE = ['', 'still fine', 'back in my day', 'math in cursive', 'remembers the war', 'built the school around her', 'dust', 'mrs. davis has a family']; const POP = ['', 'BRO. BATHROOM.', 'BRO. BRO. BRO.', 'IN CURSIVE', 'ALL OF THEM', 'THE SCHOOL WAS BUILT AROUND HER', 'DUST: DETENTION', 'MRS. DAVIS HAS A FAMILY'];
  const WH = new THREE.Color(0xeeeeee), BR = new THREE.Color(0x5a3a22);
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 7); const age = lerp(AGE[bi], AGE[bi + 1] ?? AGE[bi], smooth(p)); const old = clamp((age - 31) / 110);
    for (let i = 0; i < P.length; i++) { P[i].vis = false; P[i].arms = null; P[i].extra = 0; P[i].pitch = 0; bub[i].sp.visible = false; }
    // teacher: hunches, shrinks, hair whitens, grows a beard, cane
    const dustPhase = bi >= 6 ? clamp((bi === 6 ? lt - 1.2 : 99) / 2.2) : 0; T.vis = dustPhase < 1; T.x = 0; T.z = 6.6; T.yaw = Math.PI; T.anim = 'idle'; T.speed = .4; T.scale = 1.25 * (1 - old * .18); T.pitch = old * .75; T.y = 0; T.arms = { lx: -.2, lz: -.1, rx: old > .25 ? -.7 : -.25, rz: .1 };
    crowd.parts.hair.setColorAt(0, BR.clone().lerp(WH, clamp(old * 1.6))); crowd.parts.hair.instanceColor.needsUpdate = true;
    for (let i = 1; i < 7; i++) { place(P[i], SPOS[i - 1][0], SPOS[i - 1][1], 0, 'sit'); }
    function place(o, x, z, yaw, anim) { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = .72 - .68 * 1.2 + .02 - .0; o.speed = .4; o.vis = true; o.scale = 1.2; }
    const said = bi >= 1 && lt > .4; const sayer = 1 + (Math.floor(t * 2.5) % 6); if (said && bi < 7 && dustPhase < 1) for (let k = 0; k < 3; k++) { const i = 1 + ((sayer + k * 2) % 6); bub[i].set('bro'); bub[i].sp.visible = true; bub[i].sp.position.set(P[i].x, 2.1, P[i].z); }
    for (let i = 1; i < 7; i++) { P[i].arms = { lx: -.4, lz: -.1, rx: -.4, rz: .1 }; }
    crowd.update(t);
    // props: cane + beard follow the teacher
    cane.visible = old > .45 && T.vis; if (cane.visible) { const h = new THREE.Vector3().setFromMatrixPosition(T.M.handR); cane.position.set(h.x, .5, h.z); cane.rotation.set(0, 0, 0); } beard.visible = old > .5 && T.vis; if (beard.visible) { attach(beard, T, 'head', [0, -.2, .2]); beard.scale.set(1, 1 + old * 3, 1); }
    for (let i = 0; i < 120; i++) { const u = ((t * .5 + i * .0083) % 1); const a = i * 2.4 + t; const on = bi >= 6 && (bi === 7 || lt > 1.2); dust.set(i, Math.cos(a) * (.2 + u * .9), 1.0 + u * 1.7 + Math.sin(a * 1.7) * .1, 6.6 + Math.sin(a) * (.2 + u * .9), on ? (1 - u) * 1.2 : 0); } dust.done();
    if (bi >= 6 && dustPhase >= 1) { bub[0].set('detention'); bub[0].sp.visible = true; bub[0].sp.position.set(0, 2.6, 6.6); bub[0].sp.scale.set(2.2, .88, 1); }
    const sd = bi % 2 ? 1 : -1; const cams = [[3.6, 1.7, 3.8, 0, 1.55, 6.6, 46], [3.8 * sd, 1.6, 3.6, 0, 1.5, 6.6, 42], [3.8 * sd, 1.6, 3.6, 0, 1.5, 6.6, 42], [3.8 * sd, 1.6, 3.6, 0, 1.4, 6.6, 42], [3.8 * sd, 1.6, 3.6, 0, 1.4, 6.6, 42], [3.6, 1.7, 3.8, 0, 1.3, 6.6, 44], [3.8, 1.7, 3.8, 0, 1.4, 6.6, 46], [3.6, 1.9, 3.8, 0, 1.6, 6.6, 50]];
    A.cam(...cams[bi]); A.follow(0, 4); A.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if every *bro* aged your teacher one year?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter('Mrs. Davis · Age', String(Math.round(age)), NOTE[bi], 'BRO COUNT ' + fmt((age - 30) * 1), age > 100); hud.tm('');
    hud.pop(POP[bi] && lt > .5 ? POP[bi] : '', Math.min(1, (lt - .5) * 6));
  } };
}
