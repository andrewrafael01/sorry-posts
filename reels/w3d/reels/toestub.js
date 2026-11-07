import { room } from './_rooms.js';
import { makeBubble } from './_drake.js';
// What if every toe stub screamed twice as loud? Beat 0 = hook payoff (plane banks away from a scream ring), beats 1..7 = stubs 1,3,6,10,14,18,20.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, ground, tree, car, Crowd, Particles, buildEarth, clamp, smooth, lerp, attach, R } = lib;
  const G = 9.8, seg = (lt, a, b) => clamp((lt - a) / (b - a)), easeOut = (u) => 1 - Math.pow(1 - clamp(u), 3);
  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const M4 = new THREE.Matrix4(), M5 = new THREE.Matrix4(), DUM = new THREE.Object3D();
  const WALL = 0xeadfc8;

  // ===================================================================== stage A: the world
  const A = makeStage({ skyTop: 0x1d5fc4, skyMid: 0x5ea2e8, skyBot: 0xcfe3f6, fog: 0xd5e6f5, fogNear: 150, fogFar: 560, shadowExtent: 24, hemi: 1.2, sunI: 2.5, exposure: 1.1, sunDir: [-.45, 1, -.55] });
  const S = A.scene; S.add(A.camera); ground(S, 0x84ab62, 1600);
  const n0 = S.children.length; room(lib, S, { wall: WALL, floor: 0xb98a58, w: 9, d: 11 });
  const hm = S.children.slice(n0); hm[0].position.y = .03; S.remove(hm[4]); S.remove(hm[2]); hm.splice(2, 1); hm.pop();
  const hb = (...a) => { const m = addBox(S, ...a); hm.push(m); return m; };
  hb(-4.5, 1.75, -.35, .3, 3.5, 4.3, WALL); hb(-4.5, 1.75, 7.05, .3, 3.5, 2.9, WALL); hb(-4.5, .35, 3.7, .3, .7, 3.8, WALL); hb(-4.5, 3.25, 3.7, .3, .5, 3.8, WALL);
  hb(-4.45, .74, 3.7, .5, .08, 3.95, 0xffffff); hb(-4.45, 3.0, 3.7, .5, .08, 3.95, 0xffffff); hb(-4.2, 1.85, 1.9, .12, 2.2, .45, 0xc0392b); hb(-4.2, 1.85, 5.5, .12, 2.2, .45, 0xc0392b);
  hb(-.3, .015, 3.9, 4.6, .03, 3.2, 0x8a3b3b, { cast: false }); hb(-1.6, 2.1, 8.32, 1.3, .9, .06, 0x3b6ea5); hb(-1.6, 2.1, 8.28, 1.1, .7, .06, 0xf2c94c); hb(3.1, 2.2, 8.32, .8, 1.1, .06, 0x7a5a3a); hb(3.1, 2.2, 8.28, .6, .9, .06, 0x9fd0a8);
  hb(3.8, .3, 7.7, .6, .6, .6, 0xa0522d); hb(3.8, 1.0, 7.7, .9, .9, .9, 0x3f8f4a, { round: .25 }); hb(-3.6, .55, 6.2, .5, 1.1, .5, 0x333a44); hb(-3.6, 1.35, 6.2, .8, .35, .8, 0xf7e7b0, { mat: { emissive: 0xf0d080, emissiveIntensity: .5 } });
  hb(4.6, 1.75, 3, .06, 3.5, 11.0, WALL, { cast: false });
  const grp = (f) => { const g = new THREE.Group(); f(g); g.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); S.add(g); return g; };
  const bx = (g, w, h, d, x, y, z, c, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c, o)); m.position.set(x, y, z); g.add(m); return m; };
  const table = grp((g) => { bx(g, 1.7, .12, .85, 0, .42, 0, 0x9b6a3c); bx(g, 1.5, .06, .65, 0, .16, 0, 0x7d5230); for (const sx of [-.75, .75]) for (const sz of [-.34, .34]) bx(g, .1, .4, .1, sx, .2, sz, 0x6e4724); bx(g, .3, .06, .22, .2, .48, .05, 0xf0f0f0); });
  const couch = grp((g) => { bx(g, 2.9, .3, 1.1, 0, .15, 0, 0x3f5f95); bx(g, 2.9, .95, .35, 0, .72, .46, 0x3f5f95); for (const sx of [-1.5, 1.5]) bx(g, .35, .7, 1.1, sx, .35, 0, 0x37548a); for (const sx of [-.95, 0, .95]) bx(g, .9, .2, .8, sx, .4, -.05, 0x5b7fb8); for (const sx of [-.95, .95]) bx(g, .8, .55, .2, sx, .85, .28, 0x6b8fc6); for (const sx of [-1.3, 1.3]) for (const sz of [-.4, .4]) bx(g, .12, .12, .12, sx, .0, sz, 0x2a1d12); });
  couch.position.set(.8, .06, 7.65);
  const block = grp((g) => { bx(g, .32, .32, .32, 0, .16, 0, 0xe03a3a); bx(g, .1, .06, .1, -.08, .35, -.08, 0xe03a3a); bx(g, .1, .06, .1, .08, .35, .08, 0xe03a3a); });
  const dog = grp((g) => {
    const c = 0xc98b4f, d = 0x8a5a2c; bx(g, .5, .42, 1.0, 0, .55, 0, c); const head = new THREE.Group(); head.position.set(0, .82, .55); g.add(head); g.userData.head = head;
    bx(head, .44, .4, .42, 0, 0, 0, c); bx(head, .22, .18, .22, 0, -.08, .3, 0x4a3320); bx(head, .07, .07, .05, 0, -.01, .42, 0x111111); bx(head, .12, .26, .1, -.26, .0, -.02, d); bx(head, .12, .26, .1, .26, .0, -.02, d);
    for (const sx of [-.12, .12]) bx(head, .07, .09, .05, sx, .08, .22, 0x111111); for (const sx of [-.17, .17]) for (const sz of [-.34, .34]) bx(g, .13, .38, .13, sx, .19, sz, d);
    const tail = new THREE.Group(); tail.position.set(0, .7, -.5); g.add(tail); bx(tail, .09, .09, .42, 0, .1, -.16, d); g.userData.tail = tail;
  }); dog.scale.setScalar(1.3);
  const dogPose = (x, y, z, yaw, t, wag = 10) => { dog.position.set(x, y, z); dog.rotation.y = yaw; dog.userData.tail.rotation.y = .5 * Math.sin(t * wag); dog.userData.head.rotation.x = .08 * Math.sin(t * 2); dog.visible = true; };

  // pool next door + neighbor house
  addBox(S, -12, .16, 3.8, 11, .32, 9, 0xd9d2c3); addBox(S, -12, .3, 3.8, 8.6, .08, 6.6, 0x35a7e0, { mat: { roughness: .08, metalness: .1, emissive: 0x0b4a78, emissiveIntensity: .35 } }); const WY = .35;
  addBox(S, -7.6, .55, 6.7, .08, .5, .08, 0xcfd6dd, { mat: { metalness: .9 } }); addBox(S, -8.4, .35, 6.7, .08, .08, .8, 0xcfd6dd);
  const ripple = []; for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(new THREE.RingGeometry(.9, 1, 40), new THREE.MeshBasicMaterial({ color: 0xe8f6ff, transparent: true, opacity: .7, side: THREE.DoubleSide, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.visible = false; S.add(m); ripple.push(m); }
  const lounge = grp((g) => { bx(g, .7, .12, 1.6, 0, .3, 0, 0xf4f0e8); bx(g, .7, .5, .12, 0, .5, .7, 0xf4f0e8); for (const sx of [-.3, .3]) for (const sz of [-.7, .7]) bx(g, .06, .3, .06, sx, .12, sz, 0x888888); }); lounge.position.set(-7.2, .32, 3.2); lounge.rotation.y = 1.4;

  // street, rows of houses with breakable glass
  addBox(S, 0, .03, -10.2, 500, .06, 7.4, 0x3c3f46, { cast: false }); addBox(S, 0, .05, -6.1, 500, .1, 2.2, 0xc9c4b8, { cast: false }); addBox(S, 0, .05, -14.3, 500, .1, 2.2, 0xc9c4b8, { cast: false });
  for (let x = -240; x < 240; x += 7) addBox(S, x, .07, -10.2, 2.4, .02, .18, 0xe8d65a, { cast: false });
  const panes = []; const rr = R(7); const HC = [0xe6d4b8, 0xb8d4e6, 0xe6b8c4, 0xcfe3b4, 0xe8cf9a, 0xc4b8e6];
  const paneMat = new THREE.MeshStandardMaterial({ color: 0x9fd0ff, roughness: .05, metalness: .2, transparent: true, opacity: .72, emissive: 0x294a6a, emissiveIntensity: .3 });
  function house(x, zc, f, w, d, h, color) {
    addBox(S, x, h / 2, zc, w, h, d, color); const roof = new THREE.Mesh(new THREE.ConeGeometry(w * .78, 2.4, 4), mat(0x7a3b2a)); roof.rotation.y = Math.PI / 4; roof.position.set(x, h + 1.2, zc); roof.scale.set(1, 1, d / w * 1.05); roof.castShadow = true; S.add(roof);
    const zf = zc + f * d / 2; addBox(S, x, 1.05, zf + f * .05, 1.1, 2.1, .1, 0x5a3a20);
    for (const [px, py] of [[-2.4, 1.8], [2.4, 1.8], [0, 3.35]]) {
      addBox(S, x + px, py, zf + f * .02, 1.5, 1.7, .06, 0xffffff, { cast: false }); addBox(S, x + px, py, zf + f * .05, 1.2, 1.4, .06, 0x1c2230, { cast: false });
      const pm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, .05), paneMat); pm.position.set(x + px, py, zf + f * .09); S.add(pm); panes.push({ m: pm, x: x + px, y: py, z: zf + f * .09, f, d: Math.hypot(x + px, zf - 3.5) });
    }
  }
  for (const x of [11, 21.5, 32, 42.5, -27, -38, -49, -60, -71, -82]) house(x, 1, -1, 8, 7, 4.2, HC[(rr() * 6) | 0]);
  for (let x = -85; x <= 45; x += 10.5) if (Math.abs(x + 8) > 7) house(x, -20.5, 1, 8, 7, 4.6, HC[(rr() * 6) | 0]);
  for (const [x, z] of [[-14, -5.6], [14, -5.6], [26, -5.6], [-34, -5.6], [-20, -15.4], [6, -15.4], [20, -15.4], [-60, -15.4], [-40, 12], [30, 12], [10, 14], [-12, 14]]) tree(S, x, z, 1.1, (x * 3 + z) | 0);
  // church with a worried bell
  const church = new THREE.Group(); S.add(church); const cb = (w, h, d, x, y, z, c, o) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c, o)); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; church.add(m); return m; };
  cb(9, 6, 12, -8, 3, -23, 0xe9e2d0); cb(4.4, 9, 4.4, -8, 4.5, -19.2, 0xdcd3be); cb(2.4, 3.2, .1, -8, 2, -16.95, 0x6b4a2a); cb(.9, 1.6, .1, -8, 6.2, -16.95, 0x33425a, { emissive: 0x112244 });
  for (const sx of [-1.9, 1.9]) for (const sz of [-1.9, 1.9]) cb(.4, 3, .4, -8 + sx, 10.5, -19.2 + sz, 0xdcd3be);
  cb(4.8, .35, 4.8, -8, 12.1, -19.2, 0xb34a3a); const spire = new THREE.Mesh(new THREE.ConeGeometry(3.6, 4.2, 4), mat(0xb34a3a)); spire.rotation.y = Math.PI / 4; spire.position.set(-8, 14.4, -19.2); spire.castShadow = true; church.add(spire); cb(.14, 1.1, .14, -8, 16.9, -19.2, 0xf2c230); cb(.6, .14, .14, -8, 16.9, -19.2, 0xf2c230);
  const bellPivot = new THREE.Group(); bellPivot.position.set(-8, 11.9, -19.2); church.add(bellPivot);
  { const gold = { color: 0xd9a62b, metalness: .6, roughness: .35 }; const body = new THREE.Mesh(new THREE.CylinderGeometry(.55, 1.0, 1.3, 20), new THREE.MeshStandardMaterial(gold)); body.position.y = -1.0; const dome = new THREE.Mesh(new THREE.SphereGeometry(.55, 16, 10), new THREE.MeshStandardMaterial(gold)); dome.position.y = -.35; const lip = new THREE.Mesh(new THREE.TorusGeometry(1.0, .09, 8, 24), new THREE.MeshStandardMaterial(gold)); lip.rotation.x = Math.PI / 2; lip.position.y = -1.65;
    const clap = new THREE.Mesh(new THREE.SphereGeometry(.22, 10, 8), mat(0x3a2a12)); clap.position.y = -1.85; bellPivot.add(body, dome, lip, clap);
    const eyeW = new THREE.MeshBasicMaterial({ color: 0xffffff }), eyeB = new THREE.MeshBasicMaterial({ color: 0x111111 });
    for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.CircleGeometry(.2, 16), eyeW); e.position.set(sx * .27, -.78, .79); const p = new THREE.Mesh(new THREE.CircleGeometry(.09, 12), eyeB); p.position.set(sx * .27, -.8, .8); const br = new THREE.Mesh(new THREE.BoxGeometry(.34, .06, .02), eyeB); br.position.set(sx * .27, -.5, .8); br.rotation.z = sx * .45; bellPivot.add(e, p, br); }
    const mo = new THREE.Mesh(new THREE.BoxGeometry(.36, .05, .02), eyeB); mo.position.set(0, -1.15, .87); bellPivot.add(mo); bellPivot.traverse((m) => { if (m.isMesh) m.castShadow = true; }); }
  // alarm cars
  const CARX = [3.0, .4, -2.2], CARC = [0xd63a3a, 0xf2c230, 0x3a78d6]; const cars = CARX.map((x, i) => { const g = car(S, x, -9.5, Math.PI, CARC[i]); const lights = []; for (const sx of [-.7, .7]) for (const sz of [-2.1, 2.1]) { const m = new THREE.Mesh(new THREE.BoxGeometry(.28, .22, .2), new THREE.MeshStandardMaterial({ color: 0xff9a1a, emissive: 0xff7a00, emissiveIntensity: 0 })); m.position.set(sx, .85, sz); g.add(m); lights.push(m); } const pl = new THREE.PointLight(0xffa030, 0, 9, 1.6); pl.position.set(0, 1.6, 0); g.add(pl); return { g, lights, pl }; });

  // people (crowd A): 0 hero, 1 neighbor, 2 far man, 3 pilot, 4 copilot, 5-7 street folk
  const crowd = new Crowd(S, 8, 77), P = crowd.p; const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  const outfit = (i, shirt, pants, o = {}) => { ['torso'].forEach((k) => col(i, k, shirt)); ['armL', 'armR'].forEach((k) => col(i, k, o.sleeve ?? shirt)); ['legL', 'legR'].forEach((k) => col(i, k, pants)); };
  outfit(0, 0x2aa7a0, 0x4a4f5e, { sleeve: 0xe0ac86 }); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(0, k, 0xe0ac86)); col(0, 'hair', 0x2b1d14);
  outfit(1, 0xff7aa2, 0xf2d03c, { sleeve: 0xf1c9a5 }); outfit(2, 0x7a8a3a, 0x5b4a2a); outfit(3, 0xf4f4f4, 0x1f2a44); outfit(4, 0xf4f4f4, 0x1f2a44, {});
  const hero = P[0], neigh = P[1], farman = P[2], pil = P[3], cop = P[4]; hero.h = 1; hero.scale = 1.1; neigh.scale = 1.1;
  const hat = (mc) => { const g = new THREE.Group(); const a = new THREE.Mesh(new THREE.BoxGeometry(.5, .13, .5), mat(mc)); const b = new THREE.Mesh(new THREE.BoxGeometry(.5, .03, .22), mat(mc)); b.position.set(0, -.04, .3); const c = new THREE.Mesh(new THREE.BoxGeometry(.52, .04, .52), mat(0xe8c02e)); c.position.y = -.05; g.add(a, b, c); S.add(g); return g; };
  const hatP = hat(0x1b2a55), hatC = hat(0x1b2a55); const mug = new THREE.Mesh(new THREE.CylinderGeometry(.07, .06, .14, 10), mat(0xffffff)); S.add(mug);
  const _hat = (m, o) => { attach(m, o, 'head', [0, .24, 0]); };
  // far man (next county) + sign
  const FX = -165, farSign = new THREE.Group(); { const post = new THREE.Mesh(new THREE.BoxGeometry(.3, 4, .3), mat(0x5a3a20)); post.position.y = 2; const brd = new THREE.Mesh(new THREE.BoxGeometry(6.4, 1.8, .2), mat(0x2f6b3a)); brd.position.y = 4.1; const cv = document.createElement('canvas'); cv.width = 512; cv.height = 144; const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.font = '900 64px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('NEXT COUNTY', 256, 92); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; const lab = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.6), new THREE.MeshBasicMaterial({ map: tx, transparent: true })); lab.position.set(0, 4.1, .12); farSign.add(post, brd, lab); farSign.position.set(FX - 5, 0, -11); farSign.rotation.y = Math.PI / 2 + .5; farSign.traverse((m) => { if (m.isMesh) m.castShadow = true; }); S.add(farSign); farSign.rotation.y = Math.PI / 2; farSign.position.set(FX - 6, 0, -11.5); }
  addBox(S, FX - 14, 2.2, -16, 10, 4.4, 8, 0xd8b890); { const rf = new THREE.Mesh(new THREE.ConeGeometry(8, 3, 4), mat(0x7a3b2a)); rf.rotation.y = Math.PI / 4; rf.position.set(FX - 14, 5.8, -16); rf.scale.set(1, 1, .8); S.add(rf); }
  const paneFar = new THREE.Mesh(new THREE.BoxGeometry(2, 1.6, .06), paneMat); paneFar.position.set(FX - 14 + 3, 2.4, -11.96); S.add(paneFar);
  // bubbles
  const mkB = (w, h, sc) => { const b = makeBubble(lib, S, w, h); b.w = w; b.h = h; b.sc = sc; return b; };
  const bubs = { dog: mkB(1.5, .56, 1), hero: mkB(1.5, .56, 1), neigh: mkB(1.5, .56, 1), bell: mkB(3.0, 1.1, 1), gary: mkB(1.5, .56, 1.25), pil: mkB(1.8, .68, .62), cop: mkB(.9, .36, .5) }; let BQ = [];
  const bubq = (b, text, x, y, z, mul = 1) => BQ.push([b, text, x, y, z, mul]);
  const flushB = () => { for (const [b, text, x, y, z, mul] of BQ) { b.show(text, x, y, z); const d = A.camera.position.distanceTo(b.sp.position); const k = d / 6.2 * mul * b.sc; b.sp.scale.set(b.w * k, b.h * k, 1); } BQ = []; };
  for (const k in bubs) { bubs[k].sp.material.depthTest = false; bubs[k].sp.renderOrder = 40; }
  // fx: billboard rings, shock shell + cylinder wave, splash, shards, debris, smoke, flash, crater
  const rings = []; for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.RingGeometry(.93, 1, 72), new THREE.MeshBasicMaterial({ color: 0xfff2b0, transparent: true, opacity: .8, depthTest: false, depthWrite: false, side: THREE.DoubleSide, fog: false })); m.renderOrder = 20; m.visible = false; S.add(m); rings.push(m); }
  const ringAt = (i, pos, r, op, color = 0xfff2b0, cam = A.camera) => { const m = rings[i]; m.visible = op > .01 && r > .02; if (!m.visible) return; m.position.copy(pos); m.scale.setScalar(r); m.lookAt(cam.position); m.material.opacity = op; m.material.color.set(color); };
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .1, side: THREE.DoubleSide, depthWrite: false, fog: false })); shell.visible = false; S.add(shell);
  const wave = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 80, 1, true), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .14, side: THREE.DoubleSide, depthWrite: false })); wave.visible = false; S.add(wave);
  const splash = new Particles(S, 80, 0xd8f2ff, .1, { rough: .1 }); const smoke = new Particles(S, 60, 0x8f8f98, .3, { rough: 1 }); const fire = new Particles(S, 30, 0xff8a1e, .16, { emissive: 0xff5a00, rough: .6 }); const trails = [new Particles(S, 30, 0xffffff, .3, { rough: 1, emissive: 0x666666 }), new Particles(S, 30, 0xffffff, .3, { rough: 1, emissive: 0x666666 }), new Particles(S, 30, 0xffffff, .3, { rough: 1, emissive: 0x666666 })];
  class Boxes { constructor(n, color, o = {}) { this.n = n; this.im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial(Object.assign({ color, roughness: .8 }, o.m || {})), n); this.im.frustumCulled = false; this.im.castShadow = o.cast ?? false; S.add(this.im); this.hide = new THREE.Matrix4().makeScale(0, 0, 0); this.clear(); }
    clear() { for (let i = 0; i < this.n; i++) this.im.setMatrixAt(i, this.hide); this.im.instanceMatrix.needsUpdate = true; }
    put(i, x, y, z, rx, ry, rz, sx, sy, sz) { DUM.position.set(x, y, z); DUM.rotation.set(rx, ry, rz); DUM.scale.set(sx, sy, sz); DUM.updateMatrix(); this.im.setMatrixAt(i, DUM.matrix); } done() { this.im.instanceMatrix.needsUpdate = true; } }
  const flyP = (p0, v, tau, gy) => { const tl2 = (v.y + Math.sqrt(Math.max(0, v.y * v.y + 2 * G * (p0.y - gy)))) / G; const k = Math.min(tau, tl2); return { x: p0.x + v.x * k + (tau > tl2 ? v.x * (tau - tl2) * .08 : 0), y: tau >= tl2 ? gy : p0.y + v.y * k - .5 * G * k * k, z: p0.z + v.z * k, landed: tau >= tl2, k }; };
  const rs = R(91); const SH = []; for (const pn of panes) { for (let k = 0; k < 6; k++) { const a = rs() * 6.283; SH.push({ pn, v: { x: (rs() - .5) * 3, y: 1 + rs() * 3, z: pn.f * (2 + rs() * 4) }, dx: (rs() - .5) * 1, dy: (rs() - .5) * 1.1, s: .3 + rs() * .4, spin: [rs() * 8, rs() * 8, rs() * 8] }); } }
  const shards = new Boxes(SH.length, 0xbfe8ff, { m: { transparent: true, opacity: .75, roughness: .05, metalness: .2 } });
  const DEB = []; { const r2 = R(13); const cols = [0xeadfc8, 0xb98a58, 0xf4f6f8, 0x7a3b2a, 0xd7c8a8]; for (let i = 0; i < 70; i++) { const a = r2() * 6.283, sp = 3 + r2() * 9; DEB.push({ p0: { x: (r2() - .5) * 7, y: .8 + r2() * 2, z: 3.5 + (r2() - .5) * 8 }, v: { x: Math.cos(a) * sp, y: 8 + r2() * 12, z: Math.sin(a) * sp }, s: [.3 + r2() * 1.1, .15 + r2() * .5, .3 + r2() * 1.0], c: cols[(r2() * 5) | 0], spin: [r2() * 5, r2() * 5, r2() * 5] }); } }
  const debris = new Boxes(70, 0xffffff, { cast: true }); { const cc = new THREE.Color(); DEB.forEach((d, i) => { cc.set(d.c); debris.im.setColorAt(i, cc); }); debris.im.instanceColor.needsUpdate = true; }
  const crater = new THREE.Group(); { const scorch = new THREE.Mesh(new THREE.CircleGeometry(9.5, 48), mat(0x1c1612)); scorch.rotation.x = -Math.PI / 2; scorch.position.y = .04; scorch.receiveShadow = true; crater.add(scorch); const inner = new THREE.Mesh(new THREE.CircleGeometry(5.2, 48), mat(0x0f0b09)); inner.rotation.x = -Math.PI / 2; inner.position.y = .05; crater.add(inner);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(6.4, 1.5, 12, 56), mat(0x5a4330)); rim.rotation.x = Math.PI / 2; rim.scale.set(1, 1, .55); rim.position.y = .2; rim.castShadow = rim.receiveShadow = true; crater.add(rim); const rim2 = new THREE.Mesh(new THREE.TorusGeometry(7.9, 1.0, 12, 56), mat(0x6b5240)); rim2.rotation.x = Math.PI / 2; rim2.scale.set(1, 1, .4); rim2.position.y = .1; crater.add(rim2);
    const r3 = R(5); for (let i = 0; i < 26; i++) { const a = r3() * 6.283, d = 5 + r3() * 4; const b = new THREE.Mesh(new THREE.BoxGeometry(.5 + r3() * .9, .4 + r3() * .6, .5 + r3() * .9), mat([0x4a3a2c, 0x3a2f26, 0x6b5240, 0xb98a58][i % 4])); b.position.set(Math.cos(a) * d, .35, Math.sin(a) * d); b.rotation.set(r3(), r3() * 6, r3()); b.castShadow = true; crater.add(b); }
    const glow = new THREE.Mesh(new THREE.CircleGeometry(2.2, 32), new THREE.MeshBasicMaterial({ color: 0xff6a1a, transparent: true, opacity: .55 })); glow.rotation.x = -Math.PI / 2; glow.position.y = .07; crater.add(glow); }
  crater.position.set(.2, 0, 4.2); crater.visible = false; S.add(crater);
  const mkFlash = (cam, scene) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false })); m.position.z = -.5; m.renderOrder = 100; m.visible = false; cam.add(m); scene.add(cam); return (a) => { m.visible = a > .01; m.material.opacity = clamp(a); }; };
  const flashA = mkFlash(A.camera, S);

  // planes
  function makePlane(tint) { const g = new THREE.Group(), inner = new THREE.Group(); g.add(inner); const w = new THREE.MeshStandardMaterial({ color: 0xf4f6fa, roughness: .4, metalness: .1 }), t = new THREE.MeshStandardMaterial({ color: tint, roughness: .5 });
    const fus = new THREE.Mesh(new THREE.CylinderGeometry(.95, .95, 12, 18), w); fus.rotation.x = Math.PI / 2; const nose = new THREE.Mesh(new THREE.ConeGeometry(.95, 2.6, 18), w); nose.rotation.x = Math.PI / 2; nose.position.z = 7.3; const tailc = new THREE.Mesh(new THREE.ConeGeometry(.95, 3.4, 18), w); tailc.rotation.x = -Math.PI / 2; tailc.position.z = -7.7;
    const str = new THREE.Mesh(new THREE.BoxGeometry(1.98, .3, 11), t); str.position.y = -.1; inner.add(fus, nose, tailc, str);
    for (const s of [-1, 1]) { const wg = new THREE.Mesh(new THREE.BoxGeometry(7.2, .2, 2.6), w); wg.position.set(s * 4.2, -.35, .4); wg.rotation.y = -s * .38; const tip = new THREE.Mesh(new THREE.BoxGeometry(.2, 1.1, 1.0), t); tip.position.set(s * 7.6, .1, -.7); const eng = new THREE.Mesh(new THREE.CylinderGeometry(.55, .5, 2.2, 14), new THREE.MeshStandardMaterial({ color: 0xb9c0c8, metalness: .6, roughness: .3 })); eng.rotation.x = Math.PI / 2; eng.position.set(s * 3.4, -1.15, 1.6); const hs = new THREE.Mesh(new THREE.BoxGeometry(2.8, .14, 1.1), w); hs.position.set(s * 1.6, .5, -6.4); hs.rotation.y = -s * .3; inner.add(wg, tip, eng, hs); }
    const fin = new THREE.Mesh(new THREE.BoxGeometry(.16, 2.6, 1.9), t); fin.position.set(0, 1.9, -6.5); fin.rotation.x = -.35; inner.add(fin); for (let i = 0; i < 10; i++) { const wn = new THREE.Mesh(new THREE.BoxGeometry(1.98, .26, .34), mat(0x2a3446)); wn.position.set(0, .35, 3.4 - i * .62); wn.scale.x = .99; inner.add(wn); }
    g.userData.inner = inner; g.scale.setScalar(1.15); S.add(g); return g; }
  const PL = [{ m: makePlane(0x2a5db0), x0: 3, y0: 22, z0: 16, psi0: .3, sp: 11, th: -.8, dpsi: -Math.PI * 1.02, tdur: 3.4, bank: 1.15 }, { m: makePlane(0xc0392b), x0: 20, y0: 36, z0: 30, psi0: -.35, sp: 12, th: 2.2, dpsi: Math.PI * 1.0, tdur: 1.6, bank: 1.0 }, { m: makePlane(0x2a9d5c), x0: -22, y0: 30, z0: 40, psi0: .35, sp: 12, th: 2.8, dpsi: -Math.PI * .95, tdur: 1.5, bank: 1.0 }];
  const planeTrack = (pl, tEnd, thOv) => { const th = thOv ?? pl.th, S0 = smooth(clamp(-th / pl.tdur)); const out = [{ t: 0, x: pl.x0, y: pl.y0, z: pl.z0, psi: pl.psi0, bank: 0 }]; let x = pl.x0, z = pl.z0, t = 0; const dt = 1 / 30; const psiAt = (tt) => pl.psi0 + pl.dpsi * (smooth(clamp((tt - th) / pl.tdur)) - S0); const bankAt = (tt) => { const u = clamp((tt - th) / pl.tdur); return pl.bank * smooth(u * 4) * (1 - smooth((u - .8) * 5)); };
    out[0].bank = bankAt(0); while (t < tEnd) { const ps = psiAt(t); x += Math.sin(ps) * pl.sp * dt; z += Math.cos(ps) * pl.sp * dt; t += dt; out.push({ t, x, y: pl.y0 + 2 * Math.sin(t * .5), z, psi: psiAt(t), bank: bankAt(t) }); } return out; };

  // ===================================================================== stage B: space
  const B = makeStage({ fog: 0x03040a, fogNear: 300, fogFar: 1100, clouds: false, skyTop: 0x02030a, skyMid: 0x04061a, skyBot: 0x070b22, hemi: .5, sunI: 3.4, sunDir: [.6, .45, .8], shadowExtent: 30, exposure: 1.1, hemiSky: 0x6677aa, hemiGround: 0x223355 });
  const earth = buildEarth(B.scene, 6); const flashB = mkFlash(B.camera, B.scene);
  const tinyHouse = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(.5, .32, .5), mat(0xeadfc8)); b.position.y = .16; const r = new THREE.Mesh(new THREE.ConeGeometry(.42, .3, 4), mat(0x7a3b2a)); r.rotation.y = Math.PI / 4; r.position.y = .47; tinyHouse.add(b, r); tinyHouse.position.set(0, 6, 0); B.scene.add(tinyHouse); }
  const sShell = new THREE.Mesh(new THREE.SphereGeometry(1, 56, 36), new THREE.MeshBasicMaterial({ color: 0xffe8a0, transparent: true, opacity: .12, side: THREE.DoubleSide, depthWrite: false, fog: false })); B.scene.add(sShell);
  const sRings = []; for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.RingGeometry(.985, 1, 96), new THREE.MeshBasicMaterial({ color: 0xfff2b0, transparent: true, opacity: .9, side: THREE.DoubleSide, depthWrite: false, depthTest: false, fog: false })); m.renderOrder = 20; B.scene.add(m); sRings.push(m); }
  const pod = new THREE.Group(); { const plat = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.5, .36, 28), new THREE.MeshStandardMaterial({ color: 0xaab2bd, metalness: .6, roughness: .35 })); const lipr = new THREE.Mesh(new THREE.TorusGeometry(2.3, .1, 8, 40), new THREE.MeshStandardMaterial({ color: 0x40e0ff, emissive: 0x20a0d0, emissiveIntensity: 1 })); lipr.rotation.x = Math.PI / 2; lipr.position.y = .1; const thr = new THREE.Mesh(new THREE.ConeGeometry(.9, 1.4, 16), new THREE.MeshStandardMaterial({ color: 0xff9a30, emissive: 0xff6a00, emissiveIntensity: 1.2 })); thr.rotation.x = Math.PI; thr.position.y = -.9; const bar = new THREE.Mesh(new THREE.BoxGeometry(.2, 1.8, .2), mat(0xcfd6dd)); bar.position.set(-1.9, .9, -1.2); const flag = new THREE.Mesh(new THREE.BoxGeometry(.9, .5, .04), mat(0xe03a3a)); flag.position.set(-1.45, 1.6, -1.2); pod.add(plat, lipr, thr, bar, flag); pod.traverse((m) => { if (m.isMesh) m.castShadow = true; }); B.scene.add(pod); }
  const crowdB = new Crowd(B.scene, 2, 19), PB = crowdB.p; const colB = (i, k, c) => { crowdB.parts[k].setColorAt(i, new THREE.Color(c)); crowdB.parts[k].instanceColor.needsUpdate = true; };
  for (let i = 0; i < 2; i++) { ['torso', 'armL', 'armR', 'legL', 'legR'].forEach((k) => colB(i, k, i ? 0xf2f2f2 : 0xffffff)); ['handL', 'handR'].forEach((k) => colB(i, k, 0xdddddd)); ['head', 'neck'].forEach((k) => colB(i, k, 0xe0ac86)); colB(i, 'hair', 0x222222); PB[i].scale = .95; PB[i].h = 1; }
  const helm = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(.4, 16, 12), new THREE.MeshStandardMaterial({ color: 0x9fd0ff, transparent: true, opacity: .32, roughness: .05, metalness: .6 })); B.scene.add(m); return m; });
  const packs = [0, 1].map((i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.5, .6, .24), mat(0xcfd6dd)); B.scene.add(m); return m; });
  const bubB = [makeBubble(lib, B.scene, 4.2, 1.6), makeBubble(lib, B.scene, 4.2, 1.6)]; bubB.forEach((b) => { b.sp.material.depthTest = false; b.sp.renderOrder = 40; });

  // cockpit (far up in the sky, camera inside)
  const K = { x: 220, y: 300, z: 0 }; const ck = new THREE.Group(); ck.position.set(K.x, K.y, K.z); S.add(ck);
  const cbx = (w, h, d, x, y, z, c, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c, o)); m.position.set(x, y, z); ck.add(m); return m; };
  cbx(4.2, .1, 5, 0, 0, 0, 0x555b66); cbx(.12, 2.6, 5, -2.0, 1.3, 0, 0xaab0b8); cbx(.12, 2.6, 5, 2.0, 1.3, 0, 0xaab0b8); cbx(4.2, .12, 5, 0, 2.7, 0, 0xc4cad2); cbx(4.2, 2.6, .12, 0, 1.3, -2.5, 0xb4bac2); cbx(1.2, 2.2, .1, 1.2, 1.1, -2.42, 0x8c929c);
  cbx(4.0, .5, .6, 0, .45, 1.55, 0x2c3038); cbx(3.6, .06, .5, 0, .72, 1.55, 0x1c1f24); for (let i = 0; i < 9; i++) cbx(.3, .2, .05, -1.5 + i * .375, .55, 1.25, [0x2fe07a, 0xe0c02f, 0x2fb0e0][i % 3], { emissive: [0x1fa050, 0xa08a1f, 0x1f80a0][i % 3], emissiveIntensity: .9 });
  cbx(.9, .4, .05, -.9, .95, 1.3, 0x0f1c2e, { emissive: 0x2a6aa0, emissiveIntensity: .8 }); cbx(.9, .4, .05, .9, .95, 1.3, 0x0f1c2e, { emissive: 0x2a6aa0, emissiveIntensity: .8 });
  for (let i = 0; i < 14; i++) cbx(.16, .08, .1, -1.6 + i * .25, 2.62, 0, [0xf2f2f2, 0xe03a3a, 0x2fe07a][i % 3]); cbx(.5, .5, .9, 0, .3, 0, 0x2c3038);
  for (const sx of [-.7, .7]) { cbx(.7, .12, .7, sx, .4, -.1, 0x1c2230); cbx(.7, 1.0, .14, sx, .95, -.55, 0x1c2230); }
  const CKP = { px: K.x - .7, py: K.y, pz: K.z - .1 };

  // ---------------------------------------------------------------------------------------------------------- helpers per frame
  const _l = new THREE.Matrix4(), _o = new THREE.Matrix4(); const hv = V3();
  function heroLegs(o, lift) { if (!o.vis) return; const s = o.scale * o.h; const root = _l.makeRotationY(o.yaw); root.setPosition(o.x, o.y, o.z); root.multiply(M4.makeScale(s, s, s)); const m = _o.copy(root); m.multiply(M4.makeTranslation(.13, .8, 0)); m.multiply(M4.makeRotationX(-lift)); m.multiply(M4.makeTranslation(0, -.4, 0)); m.multiply(M4.makeScale(.24, .8, .26)); crowd.parts.legR.setMatrixAt(0, m); crowd.parts.legR.instanceMatrix.needsUpdate = true; }
  const HIT = { x: .6, z: 3.35 }; let lift = 0, hopY = 0;
  // hero approaches, stubs at tHit, then hops on one leg holding the foot
  function heroSeq(lt, tHit, o = {}) {
    const H0 = o.hit || HIT; const sx = H0.x + 2.0, sz = H0.z - .9; hero.vis = true; hero.h = 1; hero.scale = 1.1; hero.extra = 0; hero.pitch = 0; hero.arms = null; lift = 0; hopY = 0;
    if (lt < tHit) { const u = lt / tHit; hero.x = lerp(sx, H0.x, u); hero.z = lerp(sz, H0.z, u); hero.y = 0; hero.yaw = Math.atan2(H0.x - sx, H0.z - sz); hero.anim = tHit < .8 ? 'run' : 'walk'; hero.speed = tHit < .8 ? .8 : .55; crowd.setFace('calm'); return { hit: false, tau: -1 }; }
    const tau = lt - tHit; const amp = o.amp ?? 1; const per = .56, ph = (tau % per) / per; hopY = (4 * ph * (1 - ph)) * .34 * amp; const turn = smooth(tau / .25);
    hero.anim = 'punch'; hero.speed = 1; hero.yaw = lerp(Math.atan2(H0.x - sx, H0.z - sz), Math.PI + .12, turn); hero.pitch = .82 * smooth(tau / .12); lift = 1.38 * smooth(tau / .1);
    hero.x = H0.x + .28 * Math.sin(tau * 2.1) * amp; hero.z = H0.z + (-.1 - .22 * Math.sin(tau * 1.6)) * amp; hero.y = hopY;
    hero.arms = { lx: -1.38, lz: .95, rx: -1.38, rz: -.95 }; crowd.setFace('shock'); return { hit: true, tau };
  }
  let curT = 0; const headPos = (o) => { crowd.update(curT); return hv.setFromMatrixPosition(o.M.head).clone(); };
  const hudSet = (bi, lt) => {
    if (bi === 0) { hud.counter('', '', ''); return; } const ST = [0, 1, 3, 6, 10, 14, 18, 20], DBL = [0, 60, 90, 120, 150, 180, 200, 220], NOTE = ['', 'a tiny ow', 'lawn mower', 'rock concert', 'jet engine', 'rocket launch', 'meteor strike', 'crater'];
    const v = lt < .3 ? ST[bi - 1] : ST[bi], d = lt < .3 ? DBL[bi - 1] || 40 : DBL[bi]; hud.counter('Stub', String(v), d + ' dB · ' + NOTE[bi], '2× per stub', bi >= 4);
  };
  const POPS = [['', 0], ['OW', 1.66], ["IT'S NOT FINE", 5.62], ['THE BELL IS CONCERNED', 4.76], ['GARY', 4.96], ['A TOE', 4.1], ['SYMPATHETIC OW', 4.44], ['THE COUCH SURVIVED', 4.46]];
  const setHouse = (v) => hm.forEach((m) => (m.visible = v));
  const wavePos = V3(0, 0, 3.5);
  const showWave = (r, h, op) => { wave.visible = r > .1 && op > .01; wave.scale.set(r, h, r); wave.position.set(wavePos.x, h / 2, wavePos.z); wave.material.opacity = op; };

  return {
    frame({ t, bi, lt, p }) {
      curT = t; BQ = [];
      // ---- reset
      for (let i = 0; i < 8; i++) { P[i].vis = false; P[i].arms = null; P[i].pitch = 0; P[i].extra = 0; P[i].lie = 0; } Object.values(bubs).forEach((b) => b.hide()); bubB.forEach((b) => b.hide());
      rings.forEach((m) => (m.visible = false)); shell.visible = false; wave.visible = false; ripple.forEach((m) => (m.visible = false)); dog.visible = false; block.visible = false; table.visible = false; crater.visible = false;
      PL.forEach((pl) => (pl.m.visible = false)); trails.forEach((tr) => tr.clear()); splash.clear(); smoke.clear(); fire.clear(); shards.clear(); debris.clear(); flashA(0); flashB(0); hatP.visible = hatC.visible = mug.visible = false; farSign.visible = false;
      cars.forEach((c) => { c.g.position.y = 0; c.g.rotation.z = 0; c.lights.forEach((m) => (m.material.emissiveIntensity = 0)); c.pl.intensity = 0; c.g.visible = false; }); bellPivot.rotation.z = 0; paneFar.visible = true;
      setHouse(true); couch.visible = true; lift = 0; let space = false, usePanes = false; let cam = null; const mouth = () => { const h = headPos(hero); h.y += .0; return h; };
      const camHero = (k = 0) => [1.95, 2.7, -8.6, .95, 1.15, 3.8, 48];
      const ringBurst = (lt0, speed, n = 4, gap = .16, life = 1.1, col = 0xfff2b0) => { const m0 = mouth(); for (let k = 0; k < n; k++) { const a = lt - lt0 - k * gap; if (a > 0 && a < life) ringAt(k, m0, a * speed + .2, .85 * (1 - a / life), col); } };
      const FIX = [.5, 1.3, 3.7];
      const pops = POPS[bi];
      // =============================================================== beat 0: hook
      if (bi === 0) {
        if (lt < 2.65) {
          // sky: plane banking away from scream rings; house cutaway at the bottom
          cam = [0, 2.2, -33, 0, 15.5, 6, 56]; PL[0].th = -.75; const tr = planeTrack(PL[0], lt + .01); const q = tr[tr.length - 1]; const pl = PL[0].m; pl.visible = true; pl.position.set(q.x, q.y, q.z); pl.rotation.set(0, q.psi, 0); pl.userData.inner.rotation.z = -Math.sign(PL[0].dpsi) * q.bank;
          [1, 2].forEach((i) => { const tt = planeTrack(PL[i], lt + .01, -.2 - i * .1); const qq = tt[tt.length - 1]; const m = PL[i].m; m.visible = true; m.position.set(qq.x, qq.y, qq.z); m.rotation.set(0, qq.psi, 0); m.userData.inner.rotation.z = -Math.sign(PL[i].dpsi) * qq.bank; });
          const c0 = V3(0, 2.3, 3.5); for (let k = 0; k < 4; k++) { const a = (lt * 1.0 + .8 + k * .42) % 1.7; ringAt(k, c0, 3 + a * 17, .9 * (1 - a / 1.7), 0xfff2b0); }
          shell.visible = true; shell.position.copy(c0); const rS = 5 + ((lt * 1.0 + .8) % 1.7) * 17; shell.scale.setScalar(rS); shell.material.opacity = .06;
          heroSeq(lt + 3, .5, { hit: { x: 0, z: 3.5 } });
          const tr0 = planeTrack(PL[0], lt + .01); for (let k = 0; k < 30; k++) { const idx = Math.max(0, tr0.length - 1 - k * 4); const q2 = tr0[idx]; const f = 1 - k / 30; trails[0].set(k, q2.x - Math.sin(q2.psi) * 2, q2.y + .2, q2.z - Math.cos(q2.psi) * 2, (.6 + k * .09) * (idx > 0 ? 1 : 0)); }
          trails[0].done();
        } else {
          // cut to the hero hopping in the living room, rings pulsing
          const u = lt - 2.65; cam = camHero(.1); table.visible = true; table.position.set(-1.0, 0, 4.0); table.rotation.set(0, 0, 0); heroSeq(u + .6, .5, { amp: .85 }); dogPose(-2.2, 0, 5.4, 2.2, t, 16); dog.rotation.z = 0;
          ringBurst(0, 10, 4, .2, 1.0);
          for (let k = 0; k < 4; k++) { const a = (u * 1.4 + k * .25) % 1; ringAt(k, mouth(), a * 8 + .3, .8 * (1 - a), 0xfff2b0); }
        }
      }
      // =============================================================== beat 1: stub 1, tiny ow
      else if (bi === 1) {
        const tHit = 1.45; const amp = lt < 4.3 ? 1 : lt < 5.6 ? lerp(1, .3, (lt - 4.3) / 1.3) : .25; heroSeq(lt, tHit, { amp }); table.visible = true; table.position.set(-1.0, 0, 4.0); table.rotation.set(0, 0, 0);
        dogPose(-2.2, 0, 5.4, 2.2, t, 8 + (lt > 2.4 ? 6 : 0)); dog.userData.head.rotation.z = lt > 2.6 ? .22 : 0;
        cam = camHero(.1); const hh = headPos(hero);
        if (lt > tHit) ringBurst(tHit, 3, 1, .2, 1.0);
        if (lt > 2.7 && lt < 4.35) bubq(bubs.dog, 'you good', -2.2, 2.4, 5.4); if (lt > 4.4) bubq(bubs.hero, "I'm fine", hh.x - .25, hh.y + .85, hh.z - .1);
        if (lt > 5.7) { hero.extra = .9; }
      }
      // =============================================================== beat 2: the table leaves for the neighbour's pool
      else if (bi === 2) {
        const tHit = .95; const L0 = lt; heroSeq(lt, tHit, { amp: lt < 4 ? 1 : .5 }); table.visible = true; const TL = 1.1, T = 1.35, p0 = { x: -1.0, y: .45, z: 4.0 }, p1 = { x: -12.2, y: WY + .08, z: 4.3 }; const vy = (p1.y - p0.y + .5 * G * T * T) / T;
        const tau = lt - TL; let tp = V3(-1.0, .45, 4.0), landed = false;
        if (tau > 0) { const k = Math.min(tau, T); tp.set(lerp(p0.x, p1.x, k / T), p0.y + vy * k - .5 * G * k * k, lerp(p0.z, p1.z, k / T)); table.rotation.set(k * 3.1, k * 1.7, k * 7.5); landed = tau >= T; if (landed) { const q = tau - T; tp.y = WY + .08 + .035 * Math.sin(q * 3.3) * Math.exp(-q * .3); tp.x = p1.x - .12 * q; tp.z = p1.z + .05 * Math.sin(q * 1.1); table.rotation.set(.05 * Math.sin(q * 2.2), .5 + q * .1, .06 * Math.sin(q * 2.9)); } } else table.rotation.set(0, 0, 0);
        table.position.copy(tp);
        if (landed) { const q = lt - TL - T; for (let i = 0; i < 4; i++) { const a = q - i * .35; if (a > 0 && a < 1.8) { const m = ripple[i]; m.visible = true; m.position.set(p1.x, WY + .015, p1.z); m.scale.setScalar(.4 + a * 1.4); m.material.opacity = .7 * (1 - a / 1.8); } } }
        { const rsp = R(33); const q = lt - TL - T; for (let i = 0; i < 80; i++) { const a = rsp() * 6.283, hs = 1 + rsp() * 3.4, vv = 3 + rsp() * 6, sz = .5 + rsp() * .9; if (q > 0) { const r = flyP({ x: p1.x, y: WY, z: p1.z }, { x: Math.cos(a) * hs, y: vv, z: Math.sin(a) * hs }, q, WY); if (!r.landed) splash.set(i, r.x, r.y, r.z, sz); else splash.set(i, 0, 0, 0, 0); } } splash.done(); }
        dogPose(-2.2, 0, 5.4, 2.2, t, 12); const hh = headPos(hero);
        if (lt > tHit) { ringBurst(tHit, 8, 3, .18, 1.0); }
        const sh = smooth(seg(lt, 1.3, 3.3)); const cx = lerp(1.95, -3.0, sh), cz = lerp(-8.6, -16, sh), cy = lerp(2.7, 3.6, sh);
        const fx = lt < 1.3 ? .95 : lerp(.95, tp.x, smooth(seg(lt, 1.3, 2.0))); const fxx = lt > 2.6 ? lerp(fx, -10.2, smooth(seg(lt, 2.6, 3.4))) : fx;
        cam = [cx, cy, cz, fxx, lerp(1.15, 1.4, sh), 3.8, 48];
        neigh.vis = true; neigh.x = -7.4; neigh.z = 1.6; neigh.y = .32; neigh.yaw = Math.PI + .2; neigh.anim = 'idle'; neigh.speed = .5; neigh.scale = 1.1; neigh.arms = { lx: -.2, lz: -.1, rx: lt > 4.2 ? -.2 : -.3, rz: .1 }; if (lt > 3.2) neigh.arms = { lx: -.3, lz: -.15, rx: -1.0, rz: .2 + .1 * Math.sin(t * 3) };
        if (lt > 3.4) crowd.setFace('calm'); else if (lt > 2.7) crowd.setFace('shock');
        if (lt > 4.3 && lt < 5.7) bubq(bubs.neigh, "it's fine", neigh.x, neigh.y + 2.85, neigh.z);
      }
      // =============================================================== beat 3: cars + bell
      else if (bi === 3) {
        if (lt < 1.3) { const tHit = .85; heroSeq(lt, tHit); block.visible = true; const kt = lt - tHit; if (kt <= 0) block.position.set(.7, 0, 2.9), block.rotation.set(0, .3, 0); else { const r = flyP({ x: .7, y: .2, z: 2.9 }, { x: -6, y: 5, z: 1.6 }, kt, .16); block.position.set(r.x, r.y - .16, r.z); block.rotation.set(kt * 9, kt * 6, 0); } dogPose(-2.2, 0, 5.4, 2.2, t, 16); cam = camHero(.1); if (lt > tHit) ringBurst(tHit, 14, 3, .16, 1.0); }
        else {
          const u = lt - 1.3; flashA(.9 * (1 - seg(lt, 1.3, 1.55))); cars.forEach((c) => (c.g.visible = true));
          cam = [1.6, 2.3, 3.0, -2.6, 4.3, -17, 60]; { const k = smooth(seg(lt, 3.2, 4.5)); cam = [lerp(1.6, -5.4, k), lerp(2.3, 9.2, k), lerp(3.0, -8.2, k), lerp(-2.6, -8, k), lerp(4.3, 11.0, k), lerp(-17, -19.2, k), lerp(60, 44, k)]; }
          const st = [1.5, 1.8, 2.08]; cars.forEach((c, i) => { const a = lt - st[i]; if (a > 0) { const on = Math.floor(a * 7 + i) % 2 === 0; c.lights.forEach((m, j) => (m.material.emissiveIntensity = ((j + (on ? 0 : 1)) % 2 ? 2.4 : .05))); c.pl.intensity = on ? 5 : 0; c.pl.color.set(on ? 0xffa030 : 0xff5030); c.g.position.y = Math.abs(Math.sin(a * 40 + i)) * .045; c.g.rotation.z = Math.sin(a * 38 + i * 2) * .018; const pos = V3(CARX[i], 1.2, -9.5); for (let k = 0; k < 2; k++) { const aa = (a * 1.6 + k * .5) % 1; ringAt(3 + i * 2 + k, pos, .8 + aa * 3.4, .65 * (1 - aa), 0xffb040); } } });
          const sw = lt > 2.66 ? Math.min(1, (lt - 2.66) / 1.2) : 0; bellPivot.rotation.z = sw * (.5 + .12 * Math.min(1, sw)) * Math.sin((lt - 2.66) * 7.5); bellPivot.rotation.x = 0;
          showWave(Math.max(0, (u) * 22), 14, Math.max(0, .14 * (1 - u / 3)));
          if (lt > 3.6 && lt < 6.3) bubq(bubs.bell, 'concerned', -5.4, 13.8, -18.6, .3);
        }
      }
      // =============================================================== beat 4: glass on the street + Gary in the next county
      else if (bi === 4) {
        usePanes = true;
        if (lt < 1.15) { const tHit = .8; heroSeq(lt, tHit); block.visible = true; const kt = lt - tHit; if (kt <= 0) block.position.set(.7, 0, 2.9), block.rotation.set(0, .3, 0); else { const r = flyP({ x: .7, y: .2, z: 2.9 }, { x: -9, y: 7, z: 1.6 }, kt, .16); block.position.set(r.x, r.y - .16, r.z); } dogPose(-2.2, 0, 5.4, 2.2, t, 16); cam = camHero(.1); if (lt > tHit) ringBurst(tHit, 22, 3, .14, .9); }
        else if (lt < 3.45) {
          const u = lt - 1.15; flashA(.9 * (1 - seg(lt, 1.15, 1.4))); const k = smooth(seg(lt, 1.15, 3.4)); cam = [lerp(8, 3, k), 2.0, -6.4, lerp(-20, -30, k), 3.2, -16.5, 56];
          showWave(u * 34, 12, .13 * (1 - clamp(u / 3.2)));
        } else {
          // telephoto down the road at the man in the next county
          const u = lt - 3.45; farSign.visible = true; cam = [lerp(14, 4, smooth(seg(lt, 3.45, 6.8))), 2.8, -8.5, FX - 10, 2.4, -11.2, lerp(11, 7.5, smooth(seg(lt, 3.45, 6.8)))]; paneFar.visible = lt < 3.7; farman.vis = true; farman.x = FX; farman.z = -10.6; farman.y = 0; farman.yaw = Math.PI / 2 + .2; farman.anim = 'idle'; farman.scale = 1.2; farman.speed = .5; farman.arms = lt > 4.9 ? { lx: -.2, lz: -.1, rx: -2.55, rz: -.3 } : { lx: -.2, lz: -.1, rx: -.2, rz: .1 }; crowd.setFace(lt > 4.9 ? 'shock' : 'calm');
          if (lt > 4.9 && lt < 6.9) bubq(bubs.gary, lt < 5.5 ? 'Gary,' : 'Gary, are you okay', FX, 8.6, -11.5);
        }
      }
      // =============================================================== beat 5: planes + pilots
      else if (bi === 5) {
        if (lt < .85) { const tHit = .45; heroSeq(lt, tHit); block.visible = true; const kt = lt - tHit; if (kt <= 0) block.position.set(.7, 0, 2.9), block.rotation.set(0, .3, 0); else { const r = flyP({ x: .7, y: .2, z: 2.9 }, { x: -14, y: 10, z: 3 }, kt, .16); block.position.set(r.x, r.y - .16, r.z); } dogPose(-2.2, 0, 5.4, 2.2, t, 16); cam = camHero(.1); if (lt > tHit) ringBurst(tHit, 40, 3, .12, .8); }
        else if (lt < 2.62) {
          flashA(.9 * (1 - seg(lt, .85, 1.1))); const u = lt - .85; cam = [0, 2.2, -33, 0, 15.5, 6, 56]; const c0 = V3(0, 2.3, 3.5); const sp = 30; const rr0 = u * sp;
          shell.visible = true; shell.position.copy(c0); shell.scale.setScalar(rr0 + .1); shell.material.opacity = .08; for (let k = 0; k < 3; k++) { const a = rr0 - k * 5; if (a > 0) ringAt(k, c0, a, .9 * (1 - clamp(a / 90)), 0xfff2b0); }
          PL.forEach((pl, i) => { const d = Math.hypot(pl.x0 - c0.x, pl.y0 - c0.y, pl.z0 - c0.z); const th = i === 0 ? d / sp + .05 : d / sp + .05 - 0; const tt = planeTrack(pl, u + .01, th); const q = tt[tt.length - 1]; const m = pl.m; m.visible = true; m.position.set(q.x, q.y, q.z); m.rotation.set(0, q.psi, 0); m.userData.inner.rotation.z = -Math.sign(pl.dpsi) * q.bank; for (let k = 0; k < 30; k++) { const idx = Math.max(0, tt.length - 1 - k * 4); const q2 = tt[idx]; trails[i].set(k, q2.x - Math.sin(q2.psi) * 2.2, q2.y + .2, q2.z - Math.cos(q2.psi) * 2.2, (.5 + k * .07) * (idx > 0 ? 1 : 0)); } trails[i].done(); });
        } else {
          // cockpit
          const u = lt - 2.62; cam = null; pil.vis = cop.vis = true; for (const [o, x] of [[pil, -.7], [cop, .7]]) { o.x = K.x + x; o.z = K.z - .1; o.y = K.y + .5 - .74 - .0; o.yaw = 0; o.anim = 'sit'; o.speed = .5; o.scale = 1.0; o.h = 1; }
          crowd.setFace(lt < 4.5 ? 'shock' : 'calm'); pil.arms = lt > 4.6 ? { lx: -2.5, lz: .0, rx: -2.4, rz: .3 } : { lx: -1.25, lz: .1, rx: -1.25, rz: -.1 }; cop.arms = lt > 4.6 ? { lx: -.5, lz: .1, rx: -2.1 + .15 * Math.sin(t * 2), rz: -.1 } : { lx: -1.25, lz: .1, rx: -1.25, rz: -.1 }; if (lt > 4.6) { pil.pitch = .25; cop.extra = 0; }
          hatP.visible = hatC.visible = true; mug.visible = lt > 4.6;
          B_cockpitCam(this, u);
          if (lt > 3.9 && lt < 5.5) bubq(bubs.pil, 'we heard a toe', K.x - .05, K.y + 2.7, K.z + .5); if (lt > 5.9 && lt < 7.8) bubq(bubs.cop, '...', K.x + .75, K.y + 2.45, K.z + .5);
        }
      }
      // =============================================================== beat 6: space
      else if (bi === 6) {
        if (lt < .85) { const tHit = .4; heroSeq(lt, tHit); block.visible = true; const kt = lt - tHit; if (kt <= 0) block.position.set(.7, 0, 2.9), block.rotation.set(0, .3, 0); else { const r = flyP({ x: .7, y: .2, z: 2.9 }, { x: -20, y: 14, z: 3 }, kt, .16); block.position.set(r.x, r.y - .16, r.z); } dogPose(-2.2, 0, 5.4, 2.2, t, 16); cam = camHero(.1); if (lt > tHit) ringBurst(tHit, 80, 3, .1, .6); flashA(lt > .6 ? clamp((lt - .6) / .22) : 0); }
        else space = true;
      }
      // =============================================================== beat 7: crater
      else {
        const boom = .5;
        if (lt < boom) { heroSeq(lt, .35); block.visible = false; dogPose(-2.2, 0, 5.4, 2.2, t, 16); cam = camHero(.1); if (lt > .35) ringBurst(.35, 150, 3, .06, .5); flashA(lt > .3 ? clamp((lt - .3) / .2) : 0); }
        else {
          const u = lt - boom; flashA(1 - seg(lt, boom, 1.05)); setHouse(false); couch.visible = true; crater.visible = true; const ck2 = easeOut(seg(lt, boom, 1.2)); crater.scale.set(ck2, Math.max(.01, ck2), ck2);
          for (let i = 0; i < 70; i++) { const d = DEB[i]; const r = flyP(d.p0, d.v, u * 1.1, d.s[1] / 2); debris.put(i, r.x, r.y, r.z, r.landed ? d.spin[0] : d.spin[0] * r.k, r.landed ? d.spin[1] : d.spin[1] * r.k, r.landed ? 0 : d.spin[2] * r.k, d.s[0], d.s[1], d.s[2]); } debris.done();
          for (let i = 0; i < 40; i++) { const q = ((t * .22 + i * .0613) % 1), a = i * 2.39; const rad = 1.5 + (i % 7) * .55; smoke.set(i, crater.position.x + Math.cos(a) * rad * (.6 + q), .5 + q * 7, crater.position.z + Math.sin(a) * rad * (.6 + q), ck2 > .5 ? .6 + q * 2.0 : 0); } smoke.done();
          for (let i = 0; i < 30; i++) { const q = ((t * .9 + i * .131) % 1), a = i * 2.17; fire.set(i, crater.position.x + Math.cos(a) * (1.5 + (i % 5) * .9), .15 + q * 2.4, crater.position.z + Math.sin(a) * (1.5 + (i % 5) * .9), ck2 > .5 ? (1 - q) * 1.2 : 0); } fire.done();
          hero.vis = true; hero.h = 1; hero.scale = 1.1; hero.x = .2; hero.z = 7.25; hero.y = .5 - .74 + .02; hero.yaw = Math.PI; hero.anim = 'sit'; hero.speed = .5; hero.arms = lt > 1.4 ? { lx: -.3, lz: .1, rx: -2.5 + .45 * Math.sin(t * 5), rz: -.25 } : { lx: -.3, lz: .1, rx: -.3, rz: -.1 }; crowd.setFace(lt > 1.4 ? 'calm' : 'shock'); dogPose(1.35, .5, 7.2, Math.PI, t, 14);
          const k = smooth(seg(lt, 1.1, 5.8)); cam = [lerp(4, 2.6, k), lerp(8, 3.6, k), lerp(-25, -5.5, k), lerp(.5, .6, k), lerp(.6, 1.3, k), 5.5, lerp(46, 48, k)];
          if (lt > 1.45 && lt < 3.0) bubq(bubs.hero, 'fine', hero.x - .15, 3.05, hero.z - .2);
        }
      }
      // ---------------------------------------------------------------------------------------------- finalize + render
      if (space) {
        const u = lt - .85, L = lt; const k = smooth(seg(L, .85, 3.3)); flashB(1 - seg(L, .85, 1.2));
        const dist = 2.6 * Math.pow(27 / 2.6, k); const ang = lerp(.5, 0, k); const tgt = [lerp(0, 3.6, k), lerp(6, 10.4, k), lerp(0, 1, k)];
        B.cam(tgt[0] + Math.sin(ang) * dist * .6 - lerp(0, 1.2, k), tgt[1] + dist * lerp(.35, .05, k), tgt[2] + Math.cos(ang) * dist, tgt[0], tgt[1], tgt[2], lerp(52, 40, k)); B.follow(0, 0);
        const rS = Math.max(0, (L - .8) * 3.9); sShell.visible = rS > .05; sShell.position.set(0, 6, 0); sShell.scale.setScalar(rS + .01); sShell.material.opacity = .02 * (1 - clamp(rS / 26));
        sRings.forEach((m, i) => { const a = rS - i * 1.6; m.visible = a > .1; m.position.set(0, 6, 0); m.scale.setScalar(Math.max(.01, a)); m.lookAt(B.camera.position); m.material.opacity = .9 * (1 - clamp(a / 26)); });
        const jolt = Math.exp(-Math.pow((L - 2.85) * 3, 2)) * .35; pod.position.set(4.9 + jolt, 11.3 + .12 * Math.sin(t * 1.4) + jolt * .6, 1 + jolt * .7); pod.rotation.z = .04 * Math.sin(t * 1.1) + jolt * .3;
        const toes = L > 6.4, at = L > 4.4; const bendK = smooth(seg(L, 6.4, 6.9));
        for (let i = 0; i < 2; i++) { const o = PB[i]; o.vis = true; o.x = pod.position.x + (i ? 1.0 : -.8); o.z = pod.position.z + .2; o.y = pod.position.y + .18; o.yaw = i ? .15 : -.1; o.anim = toes ? 'bend' : 'idle'; o.speed = .6; o.pitch = 0; o.arms = at && !toes ? { lx: -.2, lz: .1, rx: -2.2, rz: -.3 } : null; o.extra = 0; if (toes) { o.pitch = 0; } if (at && !toes) o.arms = { lx: -.3, lz: .1, rx: -.3 - .4 * Math.sin(L * 9 + i), rz: -.1 }; }
        crowdB.setFace(at ? 'shock' : 'calm'); crowdB.update(t); for (let i = 0; i < 2; i++) { attach(helm[i], PB[i], 'head', [0, .0, .02]); attach(packs[i], PB[i], 'torso', [0, 0, -.28]); }
        if (L > 4.44 && L < 6.3) bubB[0].show('ow', PB[0].x - .5, PB[0].y + 3.0, PB[0].z + .4); if (L > 4.92 && L < 6.4) bubB[1].show('ow', PB[1].x + .6, PB[1].y + 3.3, PB[1].z + .4);
        B.render();
      } else {
        if (pops && false) { }
        if (usePanes) { const base = 1.15; const ts = lt - base; panes.forEach((pn) => { const tb = pn.d / 34; pn.m.visible = !(ts > tb); }); SH.forEach((s, i) => { const tb = s.pn.d / 34, tau = ts - tb; if (tau > 0) { const r = flyP({ x: s.pn.x, y: s.pn.y + s.dy, z: s.pn.z }, { x: s.v.x, y: s.v.y, z: s.v.z }, tau, s.s / 2); shards.put(i, r.x, r.y, r.z, s.spin[0] * (r.landed ? 0 : r.k), s.spin[1] * r.k, s.spin[2] * r.k, s.s, s.s * .9, .02); } }); shards.done(); } else panes.forEach((pn) => (pn.m.visible = true));
        if (cam) { A.cam(...cam); A.follow(cam[3], cam[5] > cam[2] ? cam[5] * .5 : cam[2] * .5); } if (bi === 4 && lt > 3.45) A.follow(FX, -10); else if (bi === 4 && lt > 1.15) A.follow(-12, -9); else if (bi === 3 && lt > 1.3) A.follow(-3, -10); else if (bi === 5 && lt > 2.62) A.follow(K.x, 0);
        crowd.update(t); if (hero.vis && lift > 0) heroLegs(hero, lift);
        if (hero.vis && bi >= 1) { }
        hatP.visible && _hat(hatP, pil); hatC.visible && _hat(hatC, cop); if (mug.visible) attach(mug, cop, 'handR', [0, -.1, .0]);
        // hero hat-free; bubbles that track hero are positioned above; render
        flushB(); A.render();
      }
      hud.style('C'); hud.question('What if every *stub* screamed twice as loud?', 1, bi > 0); hudSet(bi, lt); hud.tm('');
      const [pt, t0] = POPS[bi]; hud.pop(pt && lt > t0 ? pt : '', Math.min(1, (lt - t0) * 6));
    }
  };
  function B_cockpitCam(self, u) { A.cam(K.x + .05 * Math.sin(u * .6), K.y + 2.3, K.z + 4.0, K.x, K.y + 1.35, K.z - .1, 46); A.follow(K.x, 0); }
}
