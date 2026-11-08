// What if your butt cheeks were horizontal? Played dead serious: clinical load-capacity counter, a coffee, a laptop, a cake, a family of four having dinner. Clothed, cartoon, no commentary.
import { beachWorld } from './_beachworld.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, ground, addBox, mat, Crowd, Particles, R, clamp, smooth, lerp, attach, dropBounce } = lib;
  const W = beachWorld(lib, { n: 26 }); const st = W.st, S = W.S;
  const crowd = new Crowd(S, 5, 8); crowd.setFace('shock'); const P = crowd.p; const H = P[0]; const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  ['torso', 'armL', 'armR'].forEach((k) => col(0, k, 0xe8e8ec)); ['legL', 'legR'].forEach((k) => col(0, k, 0x2c4a7a)); for (let i = 1; i < 5; i++) { ['torso', 'armL', 'armR'].forEach((k) => col(i, k, [0xe84a8a, 0x3c8fe8, 0xf2d03c, 0x2ea84f][i - 1])); ['legL', 'legR'].forEach((k) => col(i, k, 0x2a2f3c)); }
  const jean = mat(0x2c4a7a, { roughness: .85 }); const shelf = new THREE.Mesh(new THREE.BoxGeometry(.5, .14, .42), jean); shelf.castShadow = shelf.receiveShadow = true; S.add(shelf); const seam = new THREE.Mesh(new THREE.BoxGeometry(.51, .02, .43), mat(0x1c3050)); S.add(seam);
  const cup = new THREE.Group(); { const c1 = new THREE.Mesh(new THREE.CylinderGeometry(.09, .07, .2, 14), mat(0xf4f4f4)); const c2 = new THREE.Mesh(new THREE.CylinderGeometry(.095, .095, .03, 14), mat(0x5a2f1a)); c2.position.y = .11; cup.add(c1, c2); cup.traverse((m) => (m.castShadow = true)); S.add(cup); }
  const lap = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(.36, .03, .26), mat(0x9aa0a8, { metalness: .6, roughness: .3 })); const s = new THREE.Mesh(new THREE.BoxGeometry(.36, .24, .02), mat(0x15161a)); s.position.set(0, .13, -.12); s.rotation.x = -.25; const sc = new THREE.Mesh(new THREE.PlaneGeometry(.32, .2), new THREE.MeshBasicMaterial({ color: 0x9fd0ff })); sc.position.set(0, .13, -.108); sc.rotation.x = -.25; lap.add(b, s, sc); lap.traverse((m) => (m.castShadow = true)); S.add(lap); }
  const cake = new THREE.Group(); { const c1 = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .12, 20), mat(0xf6d7e0)); const c2 = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, .1, 20), mat(0xfff0f5)); c2.position.y = .11; cake.add(c1, c2); for (let i = 0; i < 5; i++) { const cd = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .1, 6), mat(0xffe08a)); const a = i / 5 * 6.28; cd.position.set(Math.cos(a) * .08, .21, Math.sin(a) * .08); const fl = new THREE.Mesh(new THREE.SphereGeometry(.018, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffa030 })); fl.position.set(Math.cos(a) * .08, .28, Math.sin(a) * .08); cake.add(cd, fl); } cake.traverse((m) => (m.castShadow = true)); S.add(cake); }
  const table = new THREE.Mesh(new THREE.BoxGeometry(.62, .03, .5), mat(0xf4f1e6)); table.castShadow = true; S.add(table); const dishes = []; for (let i = 0; i < 4; i++) { const d = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .01, 12), mat(0xffffff)); S.add(d); dishes.push(d); }
  const place = (o, x, y, z, yaw, anim, sc, sp = .3) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.vis = true; o.scale = sc; };
  const SC = 1.5; const LOAD = [0, 2, 14, 90, 400]; const LABEL = ['', 'COFFEE', 'LAPTOP', 'BIRTHDAY CAKE', 'FAMILY OF 4 · DINNER'];
  const dropY = (t0, y1, lt) => { const r = dropBounce(1.8, 0, Math.max(0, lt - t0), .25); return lt < t0 ? 9 : r.y + y1; };
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 4); for (let i = 0; i < 5; i++) { P[i].vis = false; P[i].arms = null; P[i].pitch = 0; P[i].extra = 0; }
    place(H, 0, 0, 0, Math.PI / 2, 'idle', SC, .2); H.arms = { lx: -.1, lz: -.05, rx: -.1, rz: .05 };
    crowd.update(t);
    // shelf at the back (-x) at hip height, horizontal, clothed in the same denim
    const hip = .8 * SC * H.h; shelf.position.set(-.36 * SC * .75, hip - .02, 0); seam.position.copy(shelf.position); shelf.scale.set(SC * 1.3, SC * .85, SC * 1.0); seam.scale.copy(shelf.scale);
    const top = hip - .02 + .07 * SC * .85; const sx = shelf.position.x;
    cup.visible = bi >= 1; cup.position.set(sx + .08, dropY(0, top + .1 * 1, bi === 1 ? lt : 99) , .08); lap.visible = bi >= 2; lap.position.set(sx - .02, top + .02 + (bi >= 2 ? (dropY(0, 0, bi === 2 ? lt : 99) - 0) : 9), -.05 * 0); lap.scale.setScalar(SC * 1.6);
    cup.position.y = bi === 1 ? dropY(.6, top + .1, lt) : top + .1; cup.position.x = sx + .12; cup.position.z = .1; cup.scale.setScalar(SC * 1.4);
    lap.position.set(sx - .08, bi === 2 ? dropY(.5, top + .02, lt) : top + .02, -.06); lap.rotation.y = Math.PI / 2;
    cake.visible = bi >= 3; cake.position.set(sx + .08, bi === 3 ? dropY(.5, top + .06, lt) : top + .06, 0); cake.scale.setScalar(SC * 1.4);
    const fam = bi >= 4; table.visible = fam; dishes.forEach((d) => (d.visible = fam)); if (fam) { const ty = dropY(.3, top + .02, lt); table.position.set(sx, ty + .04, 0); table.rotation.y = Math.PI / 2; table.scale.setScalar(SC * 1.5); dishes.forEach((d, i) => d.position.set(sx + (i % 2 ? .24 : -.24), ty + .1, i < 2 ? -.2 : .2)); cake.position.set(sx, ty + .13 + .0, 0); cake.visible = true; cake.scale.setScalar(SC * .8);
      const seat = [[-.36, -.34, -Math.PI / 2 + Math.PI], [0, -.34, 0], [-.36, .34, 0], [0, .34, 0]]; for (let i = 1; i < 5; i++) { place(P[i], sx + (i % 2 ? .38 : -.38), ty - .06, i < 3 ? -.62 : .62, i < 3 ? 0 : Math.PI, 'sit', .62, .2); P[i].arms = { lx: -.6, lz: 0, rx: -.6, rz: 0 }; } crowd.update(t); }
    const react = bi === 0 ? 0 : bi === 1 ? 1 : bi === 2 ? 4 : bi === 3 ? 2 : 3; W.update(t, react, [0, 0]);
    const orb = bi === 0 ? 0 : (t * .12); const rr = bi >= 4 ? 12 : 10.5; st.cam(Math.sin(-.15 + orb * .6) * -1.2, bi >= 4 ? 2.6 : 1.7, -rr, -.3, 1.15, 0, bi === 0 ? 40 : 46); st.follow(0, 0); st.render();
    hud.style('C'); hud.question(bi === 0 ? 'What if your butt cheeks were *horizontal*?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter('Load capacity', LOAD[bi] + ' kg', LABEL[bi], 'SUBJECT: GARY', bi >= 3); hud.tm('');
    hud.pop('', 0);
  } };
}
