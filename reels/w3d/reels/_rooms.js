// Shared interior builders: bathroom (toilet + sink), gym (treadmill), bedroom (bed + window).
export function room(lib, scene, o = {}) {
  const { THREE, addBox, mat } = lib; const wall = o.wall ?? 0x7bc3cf, floor = o.floor ?? 0xe9edf2, w = o.w ?? 9, d = o.d ?? 11;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ color: floor, roughness: .35, metalness: .05 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, 3); fl.receiveShadow = true; scene.add(fl);
  addBox(scene, 0, 1.75, 8.5, w, 3.5, .3, wall); addBox(scene, -w / 2, 1.75, 3, .3, 3.5, d, wall); addBox(scene, w / 2, 1.75, 3, .3, 3.5, d, wall); addBox(scene, 0, 3.55, 3, w, .2, d, 0xf4f6f8, { cast: false });
  scene.userData.room = { w, d };
}
export function bathroom(lib, scene) {
  const { THREE, addBox, mat } = lib; room(lib, scene, { wall: 0x7ec8d4, floor: 0xeef2f6 });
  for (let i = -4; i < 5; i++) for (let j = -2; j < 9; j++) if ((i + j) % 2) { const t = new THREE.Mesh(new THREE.PlaneGeometry(.98, .98), new THREE.MeshStandardMaterial({ color: 0xb5dcea, roughness: .3 })); t.rotation.x = -Math.PI / 2; t.position.set(i, .005, j); t.receiveShadow = true; scene.add(t); }
  const wh = { round: .12, mat: { roughness: .18, metalness: .02 } };
  addBox(scene, 0, .24, 3.3, .6, .48, .8, 0xffffff, wh); addBox(scene, 0, .54, 3.15, .68, .22, .9, 0xffffff, wh); const water = addBox(scene, 0, .66, 3.15, .52, .04, .7, 0x58a8f0, { mat: { roughness: .05 } }); addBox(scene, 0, 1.05, 3.95, .66, .9, .28, 0xffffff, wh); const handle = addBox(scene, .3, 1.38, 3.77, .12, .08, .16, 0xc9ced6, { mat: { metalness: .8, roughness: .3 } });
  addBox(scene, 2.9, .5, 3.9, 1.0, 1.0, .62, 0xffffff, wh); addBox(scene, 2.9, 1.03, 3.9, 1.08, .1, .7, 0xfafafa, wh); addBox(scene, 2.9, 1.2, 4.2, .07, .35, .07, 0xc9ced6, { mat: { metalness: .8 } });
  addBox(scene, 2.9, 2.35, 4.32, 1.4, 1.2, .06, 0xdde9f5, { mat: { metalness: .9, roughness: .05 } });
  return { water, handle };
}
export function gym(lib, scene) {
  const { THREE, addBox, mat } = lib; room(lib, scene, { wall: 0xe9c88a, floor: 0xb98a58, w: 16, d: 14 });
  for (let i = -3; i < 4; i++) addBox(scene, i * 2.2, 2.2, 8.3, 1.9, 2.4, .05, 0x9cc9e6, { mat: { metalness: .8, roughness: .08 } });
  addBox(scene, 0, .22, 4, 1.4, .44, 3.2, 0x2d2f36, { round: .1 }); const belt = addBox(scene, 0, .48, 4, 1.05, .06, 2.9, 0x1c1d22, { cast: false }); const stripes = [];
  for (let k = 0; k < 10; k++) { const s = addBox(scene, 0, .52, 3, .9, .02, .09, 0xf3f4f8, { cast: false }); stripes.push(s); }
  addBox(scene, -.6, 1.1, 5.4, .1, 1.7, .1, 0x2d2f36); addBox(scene, .6, 1.1, 5.4, .1, 1.7, .1, 0x2d2f36); addBox(scene, 0, 1.9, 5.4, 1.2, .5, .12, 0x15171b, { round: .06 });
  return { stripes };
}
export function bedroom(lib, scene) {
  const { THREE, addBox, mat } = lib; room(lib, scene, { wall: 0xd8b9c8, floor: 0xb98a58, w: 12, d: 12 });
  addBox(scene, 3.6, 2.2, 8.3, 2.2, 1.6, .06, 0x9fd0f2, { mat: { emissive: 0x6aa8d8, emissiveIntensity: .35 } });
  addBox(scene, 0, .35, 5.2, 2.7, .7, 4.4, 0x5b5ea6, { round: .1 }); addBox(scene, 0, .78, 3.6, 2.5, .2, 1.1, 0xfafafa, { round: .1 }); const head = addBox(scene, 0, 1.08, 3.62, .42, .42, .42, 0xf0c8a0, { round: .2 }); addBox(scene, 0, 1.3, 3.65, .44, .14, .44, 0x3a2a1c, { round: .06 });
  const blanket = addBox(scene, 0, .85, 5.6, 2.55, .26, 3.1, 0xd9575a, { round: .12 }); const lump = addBox(scene, .5, 1.0, 5.6, .34, .32, .55, 0xd9575a, { round: .16 }); const arm = addBox(scene, .95, 1.05, 5.0, .22, .22, .8, 0xf5c542, { round: .1 });
  return { head, blanket, lump, arm };
}
