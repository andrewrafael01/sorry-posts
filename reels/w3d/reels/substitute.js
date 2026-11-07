import { room } from './_rooms.js';
// What if Drake became your substitute teacher? Parody: generic blocky character, beard + chain + owl pendant, original rhymes only (no real lyrics).
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, R, clamp, smooth, lerp, attach } = lib;
  const A = makeStage({ fog: 0xd8d2c4, fogNear: 14, fogFar: 46, clouds: false, skyTop: 0xd8d2c4, skyMid: 0xd8d2c4, skyBot: 0xd8d2c4, shadowExtent: 12, hemi: 1.5, sunI: 1.8, sunDir: [-.4, .9, -.3], exposure: 1.15 }); const S = A.scene;
  room(lib, S, { wall: 0xc9d6c2, floor: 0xb99a6a, w: 12, d: 13 });
  const boardCv = document.createElement('canvas'); boardCv.width = 768; boardCv.height = 384; const bg = boardCv.getContext('2d'); const btex = new THREE.CanvasTexture(boardCv); btex.colorSpace = THREE.SRGBColorSpace;
  const BOARD = ['Sorry, Dylan.\nSorry, Dylan.\nSorry, Dylan.', 'Ch. 9 due by 9\nI\'m not mad\nI\'m disappointed', 'Q1: Are you okay?\n(A) yes (B) no (C) hug', 'DETENTION\n(feelings)', 'MR. PRUITT\nWE NEED TO TALK\nABOUT US', 'CLASS AVG: 100\nDYLAN: ABSENT'];
  const drawBoard = (txt) => { bg.fillStyle = '#1f3d2e'; bg.fillRect(0, 0, 768, 384); bg.fillStyle = '#eee'; bg.font = '700 40px Georgia'; txt.split('\n').forEach((l, i) => bg.fillText(l, 330, 110 + i * 82)); btex.needsUpdate = true; };
  const board = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), new THREE.MeshStandardMaterial({ map: btex })); board.position.set(0, 2.1, 8.3); board.rotation.y = Math.PI; S.add(board);
  const desk = (x, z) => { addBox(S, x, .72, z, .9, .06, .6, 0xc09a62); for (const [dx, dz] of [[-.4, -.25], [.4, -.25], [-.4, .25], [.4, .25]]) addBox(S, x + dx, .36, z + dz, .05, .7, .05, 0x555555); };
  const SPOS = [[-3.2, 1.8], [-3.2, 3.4], [-3.2, 5.0], [3.2, 1.8], [3.2, 3.4], [3.2, 5.0]]; for (const [x, z] of SPOS) desk(x, z + .45);
  const crowd = new Crowd(S, 8, 66); const P = crowd.p; const col = (i, k, c) => crowd.parts[k].setColorAt(i, new THREE.Color(c));
  const T = P[0]; ['torso', 'armL', 'armR'].forEach((k) => col(0, k, 0x1f5a3a)); ['legL', 'legR'].forEach((k) => col(0, k, 0x15181f)); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(0, k, 0xa8764f)); col(0, 'hair', 0x14100d);
  const PR = P[7]; ['torso', 'armL', 'armR'].forEach((k) => col(7, k, 0x333a4a)); ['legL', 'legR'].forEach((k) => col(7, k, 0x222222)); for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  // caricature cues from the reference photo (no photo texture): curly dark hair, colorful hair clips, full beard, silver grill, green/yellow/white jersey
  const curls = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.07, 1), mat(0x14100d, { roughness: .9 }), 46); curls.castShadow = true; S.add(curls); const CL = []; { const r2 = R(31); for (let i = 0; i < 46; i++) CL.push([(r2() - .5) * .56, .04 + r2() * .22, (r2() - .55) * .52, .8 + r2() * .8]); }
  const CLIP = [0xf6d13a, 0x4fd16a, 0xa9e26a, 0xff9a3c, 0xff5f9a]; const clips = CLIP.map((c, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.2, .025, .045), mat(c)); S.add(m); return m; });
  const grill = new THREE.Mesh(new THREE.BoxGeometry(.13, .035, .03), new THREE.MeshStandardMaterial({ color: 0xdfe6ee, metalness: 1, roughness: .15 })); S.add(grill);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(.58, .09, .33), mat(0xe8c02e)); S.add(stripe); const stripe2 = new THREE.Mesh(new THREE.BoxGeometry(.58, .09, .33), mat(0xf4f4f0)); S.add(stripe2);
  const gold = new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: .9, roughness: .25 }); const beard = new THREE.Mesh(new THREE.BoxGeometry(.36, .15, .07), mat(0x16110d)), stache = new THREE.Mesh(new THREE.BoxGeometry(.2, .035, .05), mat(0x16110d)); const chain = new THREE.Mesh(new THREE.TorusGeometry(.2, .035, 8, 20), gold), pend = new THREE.Mesh(new THREE.BoxGeometry(.13, .15, .03), gold); const chalk = new THREE.Mesh(new THREE.BoxGeometry(.03, .03, .1), mat(0xffffff)); S.add(beard, stache, chain, pend, chalk);
  const mkB = () => { const c = document.createElement('canvas'); c.width = 320; c.height = 128; const g = c.getContext('2d'); const tex = new THREE.CanvasTexture(c); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); sp.scale.set(.9, .36, 1); S.add(sp); sp.visible = false; return { sp, set(t) { g.clearRect(0, 0, 320, 128); g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 7; g.beginPath(); g.roundRect(6, 6, 308, 84, 22); g.fill(); g.stroke(); g.fillStyle = '#111'; g.font = '800 46px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText(t, 160, 66); tex.needsUpdate = true; } }; }; const bub = Array.from({ length: 6 }, mkB); bub.forEach((b, i) => b.set(['absent', 'oh no', 'AN A??', 'candles??', 'resign.', 'hug'][i]));
  const hearts = new THREE.InstancedMesh(new THREE.SphereGeometry(.08, 8, 6), new THREE.MeshStandardMaterial({ color: 0xff4f7a, emissive: 0x802030 }), 30); hearts.frustumCulled = false; S.add(hearts); const D = new THREE.Object3D();
  const POP = ['', 'SORRY, DYLAN. x4', 'IN RHYME', 'EVERYONE GETS AN A', 'TWO KIDS ASK TO BE SUSPENDED', 'MR. PRUITT RESIGNS', 'DYLAN IS STILL ABSENT'];
  const NOTE = ['', 'dylan is absent', 'not mad, disappointed', 'dylan got a hug', 'candlelit', 'principal resigned', 'still writing the apology'];
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 6); for (let i = 0; i < P.length; i++) { P[i].vis = false; P[i].arms = null; P[i].extra = 0; P[i].pitch = 0; } bub.forEach((b) => (b.sp.visible = false));
    drawBoard(BOARD[Math.max(0, bi - 1)]);
    const sit = (o, x, z) => { o.x = x; o.z = z; o.yaw = 0; o.anim = 'sit'; o.y = .72 - .68 * 1.2 + .02; o.speed = .4; o.vis = true; o.scale = 1.2; o.arms = { lx: -.4, lz: -.1, rx: -.4, rz: .1 }; };
    for (let i = 1; i < 7; i++) sit(P[i], SPOS[i - 1][0], SPOS[i - 1][1]);
    T.vis = true; T.x = bi === 4 ? -1.2 : 0; T.z = 6.6; T.yaw = Math.PI; T.anim = 'idle'; T.speed = .4; T.scale = 1.25; T.y = 0; const write = bi === 1 || bi === 5 || bi === 6; T.arms = { lx: bi === 2 ? -2.7 + Math.sin(t * 5) * .15 : -.2, lz: -.1, rx: write ? -2.0 + Math.sin(t * 7) * .25 : bi === 3 ? -1.2 : -.35, rz: .1 }; T.hs = 1.0;
    if (bi === 4) { PR.vis = true; PR.x = 1.4; PR.z = 3.6; PR.yaw = Math.PI; PR.anim = 'walk'; PR.speed = .6; PR.scale = 1.25; PR.y = 0; if (lt > 3.4) { PR.z = 3.6 + clamp(lt - 3.4) * 7; PR.anim = 'run'; PR.yaw = 0; } PR.z = Math.min(PR.z, 12); }
    crowd.update(t);
    attach(beard, T, 'head', [0, -.17, .2]); attach(grill, T, 'head', [0, -.105, .226]); grill.visible = true; const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), SC = new THREE.Vector3(); for (let i = 0; i < 46; i++) { const c = CL[i]; V.set(c[0] * .85, .13 + c[1] * .55, c[2] * .8 - .04); V.applyMatrix4(T.M.head); SC.set(c[3], c[3], c[3]); M4.compose(V, Q, SC); curls.setMatrixAt(i, M4); } curls.instanceMatrix.needsUpdate = true; clips.forEach((m, i) => attach(m, T, 'head', [-.2 + i * .1, .2, .1 - i * .03], [0, .2 - i * .08, -.5 + i * .12])); attach(stripe, T, 'torso', [0, .16, 0]); attach(stripe2, T, 'torso', [0, -.22, 0]); attach(stache, T, 'head', [0, -.075, .224]); attach(chain, T, 'torso', [0, .3, .02], [Math.PI / 2, 0, 0]); attach(pend, T, 'torso', [0, .1, .175]); attach(chalk, T, 'handR', [0, -.05, .06]); chalk.visible = write;
    if (bi === 3 || bi === 6) { const i0 = bi === 3 ? 0 : 5; const o = P[1 + i0]; bub[0].sp.visible = bi === 6; bub[0].sp.position.set(o.x, 2.1, o.z); bub[5].sp.visible = bi === 3 && lt > 3; bub[5].sp.position.set(o.x, 2.1, o.z); }
    if (bi === 1) { bub[0].sp.visible = true; bub[0].sp.position.set(SPOS[0][0], 2.1, SPOS[0][1] + .5); }
    if (bi === 3 && lt > 1.0) { bub[2].sp.visible = true; bub[2].sp.position.set(SPOS[3][0], 2.1, SPOS[3][1]); }
    for (let i = 0; i < 30; i++) { const u = ((t * .5 + i * .033) % 1); const on = bi === 3 && lt > 3; D.position.set(SPOS[0][0] + Math.sin(i * 3) * .4, 1.2 + u * 1.2, SPOS[0][1] + .4); D.scale.setScalar(on ? 1 - u : 0); D.updateMatrix(); hearts.setMatrixAt(i, D.matrix); } hearts.instanceMatrix.needsUpdate = true;
    const sw = Math.sin(t * .3) * .3; const cam = bi === 4 ? [-.6, 2.0, 1.6, .3, 1.55, 6.4, 42] : [sw, 2.0, 1.6, 0, 1.55, 6.4, 42];
    A.cam(...cam); A.follow(0, 4); A.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if *Drake* became your substitute teacher?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter('Mr. D (substitute) · Week 1', [ '', '4 min', '1 rhyme', '100%', '2', '1', '100' ][bi], NOTE[bi], 'PARODY', false); hud.tm('');
    hud.pop(POP[bi] && lt > .5 ? POP[bi] : '', Math.min(1, (lt - .5) * 6));
  } };
}
