// A lived-in bedroom with a real person lying in bed under a duvet: lamp, nightstand, tissues, window, rug, poster, door, clothes.
export function bedroom2(lib, st, scene) {
  const { THREE, addBox, mat, Crowd } = lib; const W = 12, D = 12;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ color: 0xa97c4f, roughness: .5 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, 3); fl.receiveShadow = true; scene.add(fl);
  for (let i = -6; i < 6; i++) { const pl = new THREE.Mesh(new THREE.PlaneGeometry(.02, D), mat(0x7b5532)); pl.rotation.x = -Math.PI / 2; pl.position.set(i + .5, .005, 3); scene.add(pl); }
  const wall = 0xc9b3ad; addBox(scene, 0, 2.0, 8.5, W, 4, .3, wall); addBox(scene, -W / 2, 2.0, 3, .3, 4, D, 0xbfa7a1); addBox(scene, W / 2, 2.0, 3, .3, 4, D, 0xbfa7a1); addBox(scene, 0, 4.05, 3, W, .2, D, 0xf1ece6, { cast: false });
  addBox(scene, 0, .12, 8.3, W, .24, .1, 0xf3efe9); addBox(scene, -5.8, .12, 3, .1, .24, D, 0xf3efe9);
  // window with daylight + curtains
  addBox(scene, 3.4, 2.4, 8.32, 2.4, 1.7, .08, 0xcfe8ff, { mat: { emissive: 0x9fcdf5, emissiveIntensity: .8 } }); for (const dx of [-1.3, 1.3]) addBox(scene, 3.4 + dx, 2.4, 8.2, .12, 1.9, .1, 0xffffff); addBox(scene, 3.4, 2.4, 8.2, 2.5, .08, .1, 0xffffff); addBox(scene, 3.4, 1.6, 8.2, 2.6, .1, .2, 0xffffff);
  addBox(scene, 2.0, 2.2, 8.15, .7, 2.6, .12, 0xe4a39a, { round: .05 }); addBox(scene, 4.8, 2.2, 8.15, .7, 2.6, .12, 0xe4a39a, { round: .05 });
  // poster, door, wardrobe
  addBox(scene, -3.2, 2.5, 8.32, 1.5, 1.9, .05, 0x2e4a6d); addBox(scene, -3.2, 2.5, 8.28, 1.3, 1.7, .05, 0xf0c04a); addBox(scene, -3.2, 2.35, 8.24, .8, .8, .05, 0xd9575a, { round: .3 });
  addBox(scene, -5.8 + .2, 1.5, 6.0, .12, 3.0, 1.8, 0x9b7a5a); addBox(scene, -5.55, 1.5, 6.0, .06, 2.7, 1.5, 0xb28f6b);
  addBox(scene, -5.55, 1.1, 5.35, .1, .16, .1, 0xd8d8d8);
  // rug, clothes, shoes
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, .03, 40), mat(0x5b8fa8)); rug.position.set(-1.8, .03, 3.4); rug.receiveShadow = true; scene.add(rug);
  addBox(scene, -2.6, .1, 2.4, .6, .12, .5, 0xdc6a5b, { round: .05, ry: .4 }); addBox(scene, -2.1, .08, 2.1, .5, .1, .4, 0x3d5a80, { round: .05, ry: -.3 }); addBox(scene, -1.4, .06, 4.6, .22, .12, .5, 0xf2f2f2, { round: .05, ry: .3 }); addBox(scene, -1.1, .06, 4.9, .22, .12, .5, 0xf2f2f2, { round: .05, ry: -.2 });
  // bed
  addBox(scene, 0, .35, 4.7, 2.9, .7, 3.4, 0x6b4a33, { round: .06 }); addBox(scene, 0, .92, 2.95, 3.0, 1.5, .18, 0x6b4a33, { round: .05 }); addBox(scene, 0, .78, 4.75, 2.7, .26, 3.2, 0xf3f0ea, { round: .1 }); // frame, headboard, mattress
  const pil = addBox(scene, 0, .98, 3.5, 1.7, .16, .8, 0xfdfdfd, { round: .07 });
  // nightstand + lamp + tissues
  addBox(scene, -2.2, .4, 3.3, .8, .8, .7, 0x8a5e3b, { round: .04 }); addBox(scene, -2.2, .9, 3.3, .8, .06, .7, 0xa77b53); addBox(scene, -2.2, .96, 3.1, .5, .02, .5, 0xe6e0d6);
  addBox(scene, -2.2, 1.2, 3.35, .12, .6, .12, 0xd8c8a8); const shade = new THREE.Mesh(new THREE.CylinderGeometry(.22, .32, .38, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xffe0a8, emissive: 0xffc070, emissiveIntensity: .9, side: THREE.DoubleSide })); shade.position.set(-2.2, 1.6, 3.35); scene.add(shade);
  const lamp = new THREE.PointLight(0xffc27a, 6, 9, 1.6); lamp.position.set(-2.2, 1.6, 3.35); scene.add(lamp);
  addBox(scene, -2.45, 1.02, 3.1, .32, .16, .2, 0xcfe6f0, { round: .04 }); for (let k = 0; k < 6; k++) addBox(scene, -1.95 + (k % 3) * .02, .98 + k * .0, 3.1 + (k % 2) * .1, .12, .01, .12, 0xffffff, { ry: k });
  // the person: lying on his back, head on the pillow (head toward -z)
  const cr = new Crowd(scene, 1, 8); const h = cr.p[0]; h.lie = Math.PI / 2; h.scale = 1.0; h.h = 1; h.x = 0; h.y = 1.14; h.z = 5.3; h.yaw = 0; h.anim = 'idle'; h.speed = 1; h.shirt.set(0x9fb8d9); h.pants.set(0x3a3f4b);
  for (const k of ['torso', 'armL', 'armR']) { cr.parts[k].setColorAt(0, h.shirt); cr.parts[k].instanceColor.needsUpdate = true; } for (const k of ['legL', 'legR']) { cr.parts[k].setColorAt(0, h.pants); cr.parts[k].instanceColor.needsUpdate = true; }
  // duvet: lower body, with a moving mound on top
  const duvetMat = mat(0xd9575a, { roughness: .95 }); const blanket = new THREE.Mesh(new (lib.RoundedBoxGeometry)(2.5, .42, 2.2, 4, .18), duvetMat); blanket.position.set(0, 1.18, 5.15); blanket.castShadow = true; blanket.receiveShadow = true; scene.add(blanket);
  const fold = new THREE.Mesh(new (lib.RoundedBoxGeometry)(2.55, .2, .5, 3, .09), mat(0xf5f0e6)); fold.position.set(0, 1.32, 4.1); fold.castShadow = true; scene.add(fold);
  const lump = new THREE.Mesh(new THREE.IcosahedronGeometry(.34, 2), duvetMat); lump.scale.set(1.0, .7, 1.5); lump.position.set(.05, 1.46, 4.65); lump.castShadow = true; scene.add(lump);
  const sweat = new THREE.InstancedMesh(new THREE.SphereGeometry(.03, 6, 5), new THREE.MeshStandardMaterial({ color: 0xaee0ff, roughness: .1, metalness: .1 }), 20); sweat.frustumCulled = false; scene.add(sweat);
  return { crowd: cr, person: h, blanket, lump, fold, arm: { position: { y: 0 } }, head: pil, sweat, lamp, base: { lumpY: 1.46 } };
}
