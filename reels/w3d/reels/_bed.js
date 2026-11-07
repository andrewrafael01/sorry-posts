// Moody bedroom: a hoodie guy sitting up in bed under a long blue duvet (like the whatifbombo reference), shelves, poster, lamp, rug.
export function bedroom2(lib, st, scene) {
  const { THREE, addBox, mat, Crowd } = lib; const W = 12, D = 12;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ color: 0xa6764a, roughness: .55 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, 3); fl.receiveShadow = true; scene.add(fl);
  for (let i = -6; i < 6; i++) { const pl = new THREE.Mesh(new THREE.PlaneGeometry(.025, D), mat(0x6e4a2c)); pl.rotation.x = -Math.PI / 2; pl.position.set(i + .5, .005, 3); scene.add(pl); }
  const wall = 0x6f7690; addBox(scene, 0, 2.0, 8.5, W, 4, .3, wall); addBox(scene, -W / 2, 2.0, 3, .3, 4, D, 0x646a84); addBox(scene, W / 2, 2.0, 3, .3, 4, D, 0x646a84); addBox(scene, 0, 4.05, 3, W, .2, D, 0x252a3c, { cast: false });
  addBox(scene, 0, 2.0, -3.2, W, 4, .3, 0x6f7690);
  addBox(scene, 0, .12, 8.3, W, .24, .1, 0xcfcfd8); addBox(scene, -5.8, .12, 3, .1, .24, D, 0xcfcfd8);
  // wall: poster behind the headboard, floating shelf cubes, window
  addBox(scene, -.3, 2.6, 3.1, 1.7, 2.0, .06, 0x2d7ea6); addBox(scene, -.3, 2.45, 3.06, 1.1, 1.1, .05, 0xe3b53f);
  for (const [x, y] of [[2.2, 2.9], [3.6, 2.9], [-2.6, 3.0]]) addBox(scene, x, y, 3.1, .9, .55, .1, 0xb9a77a);
  addBox(scene, 3.6, 2.2, 8.32, 2.2, 1.6, .08, 0xbfd4ec, { mat: { emissive: 0x7f9fc8, emissiveIntensity: .55 } }); addBox(scene, 3.6, 2.2, 8.2, 2.3, .07, .1, 0xeeeeee); addBox(scene, 3.6, 2.2, 8.2, .07, 1.7, .1, 0xeeeeee);
  addBox(scene, -3.8, 1.5, 8.2, 1.3, 3.0, .1, 0x8a6a4a);
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, .03, 40), mat(0xc0564f)); rug.position.set(-1.0, .03, 1.6); rug.receiveShadow = true; scene.add(rug);
  // bed: frame, mattress, headboard, pillows
  addBox(scene, 0, .35, 4.7, 2.9, .7, 3.5, 0x4a3524, { round: .05 }); addBox(scene, 0, 1.0, 2.88, 3.0, 2.0, .16, 0x4a3524, { round: .04 }); addBox(scene, 0, .8, 4.72, 2.74, .22, 3.3, 0xd7d7de, { round: .08 });
  const pil = addBox(scene, 0, 1.3, 3.15, 1.5, .8, .3, 0xe8e8ee, { round: .1 }); pil.rotation.x = -.15;
  // nightstand + lamp (warm)
  addBox(scene, -2.2, .4, 3.3, .8, .8, .7, 0x6b4a30, { round: .04 }); addBox(scene, -2.2, 1.18, 3.35, .1, .6, .1, 0xd8c8a8); const shade = new THREE.Mesh(new THREE.CylinderGeometry(.22, .32, .38, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xffe0a8, emissive: 0xffc070, emissiveIntensity: .9, side: THREE.DoubleSide })); shade.position.set(-2.2, 1.6, 3.35); scene.add(shade);
  const lamp = new THREE.PointLight(0xffc27a, 5, 9, 1.6); lamp.position.set(-2.2, 1.6, 3.35); scene.add(lamp);
  // the guy: sitting up against the headboard in a mustard hoodie, facing the foot of the bed (+z)
  const cr = new Crowd(scene, 1, 8); const h = cr.p[0]; h.scale = 1.25; h.h = 1; h.x = 0; h.z = 3.5; h.y = .06; h.yaw = 0; h.anim = 'sit'; h.speed = 1; h.skin.set(0xe9c3a0); h.hair.set(0x3a2a1c); h.shirt.set(0xe3bd54); h.pants.set(0x2f3a5c);
  const col = (k, c) => { cr.parts[k].setColorAt(0, c); cr.parts[k].instanceColor.needsUpdate = true; }; ['torso', 'armL', 'armR'].forEach((k) => col(k, h.shirt)); ['legL', 'legR'].forEach((k) => col(k, h.pants)); ['head', 'handL', 'handR'].forEach((k) => col(k, h.skin)); col('hair', h.hair);
  // hoodie drawstrings
  const dr = (x) => addBox(scene, x, 1.62, 3.82, .035, .3, .02, 0xf2f2f2); const strings = [dr(-.1), dr(.1)];
  // duvet (blue), long block over his legs + a mound that moves
  const duvetMat = mat(0x4d6faa, { roughness: .95 }); const blanket = new THREE.Mesh(new (lib.RoundedBoxGeometry)(2.6, .5, 2.7, 4, .2), duvetMat); blanket.position.set(0, 1.08, 5.0); blanket.castShadow = true; blanket.receiveShadow = true; scene.add(blanket);
  const lump = new THREE.Mesh(new THREE.IcosahedronGeometry(.34, 2), duvetMat); lump.scale.set(1.0, .7, 1.4); lump.position.set(0, 1.42, 4.05); lump.castShadow = true; scene.add(lump);
  // flame cones on the bed
  const cones = new THREE.InstancedMesh(new THREE.ConeGeometry(.2, .8, 5), new THREE.MeshStandardMaterial({ color: 0xffa05a, emissive: 0xff6a2a, emissiveIntensity: .8, flatShading: true, roughness: .6 }), 34); cones.frustumCulled = false; scene.add(cones); const cc = new THREE.Color(); for (let i = 0; i < 34; i++) { cc.setHSL(.03 + (i * .37 % 1) * .08, .95, .62); cones.setColorAt(i, cc); } cones.instanceColor.needsUpdate = true;
  // floor debris + lightning (used in the standing beat)
  const slabs = new THREE.InstancedMesh(new THREE.BoxGeometry(1, .12, 1), mat(0x1d1f26, { roughness: .9 }), 36); slabs.frustumCulled = false; slabs.castShadow = true; slabs.receiveShadow = true; scene.add(slabs);
  const embers = new THREE.InstancedMesh(new THREE.BoxGeometry(.2, .2, .2), new THREE.MeshStandardMaterial({ color: 0xff9a40, emissive: 0xff6a10, emissiveIntensity: 1.2 }), 28); embers.frustumCulled = false; scene.add(embers);
  const bolt = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xfff2a8 }), 60); bolt.frustumCulled = false; scene.add(bolt);
  return { crowd: cr, person: h, blanket, lump, strings, cones, slabs, embers, bolt, lamp, base: { lumpY: 1.42 } };
}
