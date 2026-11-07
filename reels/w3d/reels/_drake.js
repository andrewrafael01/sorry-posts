// Shared parody-caricature look (curly hair, colorful clips, beard, grill, jersey, chain + owl pendant). Generic cues only; no photo.
export function drakeLook(lib, S, crowd, idx, o = {}) {
  const { THREE, mat, R, attach } = lib; const T = crowd.p[idx]; const jersey = o.jersey ?? 0x1f5a3a;
  const col = (k, c) => { crowd.parts[k].setColorAt(idx, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  ['torso', 'armL', 'armR'].forEach((k) => col(k, o.shirt ?? jersey)); ['legL', 'legR'].forEach((k) => col(k, o.pants ?? 0x15181f)); ['head', 'neck', 'handL', 'handR'].forEach((k) => col(k, 0xa8764f)); col('hair', 0x14100d);
  const curls = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.07, 1), mat(0x14100d, { roughness: .9 }), 46); curls.castShadow = true; curls.frustumCulled = false; S.add(curls); const CL = []; { const r2 = R(31); for (let i = 0; i < 46; i++) CL.push([(r2() - .5) * .56, r2() * .22, (r2() - .55) * .52, .8 + r2() * .8]); }
  const clips = [0xf6d13a, 0x4fd16a, 0xa9e26a, 0xff9a3c, 0xff5f9a].map((c) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.2, .025, .045), mat(c)); S.add(m); return m; });
  const gold = new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: .9, roughness: .25 });
  const beard = new THREE.Mesh(new THREE.BoxGeometry(.36, .15, .07), mat(0x16110d)), stache = new THREE.Mesh(new THREE.BoxGeometry(.2, .035, .05), mat(0x16110d));
  const grill = new THREE.Mesh(new THREE.BoxGeometry(.13, .035, .03), new THREE.MeshStandardMaterial({ color: 0xdfe6ee, metalness: 1, roughness: .15 }));
  const chain = new THREE.Mesh(new THREE.TorusGeometry(.2, .035, 8, 20), gold), pend = new THREE.Mesh(new THREE.BoxGeometry(.13, .15, .03), gold);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(.58, .09, .33), mat(0xe8c02e)), stripe2 = new THREE.Mesh(new THREE.BoxGeometry(.58, .09, .33), mat(0xf4f4f0));
  const all = [beard, stache, grill, chain, pend, stripe, stripe2, ...clips]; all.forEach((m) => S.add(m));
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), SC = new THREE.Vector3();
  return { person: T, setVisible(v) { all.forEach((m) => (m.visible = v)); curls.visible = v; },
    update() { attach(beard, T, 'head', [0, -.17, .2]); attach(stache, T, 'head', [0, -.075, .224]); attach(grill, T, 'head', [0, -.105, .226]);
      for (let i = 0; i < 46; i++) { const c = CL[i]; V.set(c[0] * .85, .13 + c[1] * .55, c[2] * .8 - .04); V.applyMatrix4(T.M.head); SC.set(c[3], c[3], c[3]); M4.compose(V, Q, SC); curls.setMatrixAt(i, M4); } curls.instanceMatrix.needsUpdate = true;
      clips.forEach((m, i) => attach(m, T, 'head', [-.2 + i * .1, .2, .1 - i * .03], [0, .2 - i * .08, -.5 + i * .12]));
      attach(chain, T, 'torso', [0, .3, .02], [Math.PI / 2, 0, 0]); attach(pend, T, 'torso', [0, .1, .175]); attach(stripe, T, 'torso', [0, .16, 0]); attach(stripe2, T, 'torso', [0, -.22, 0]); } };
}
// speech/thought bubble sprite helper
export function makeBubble(lib, S, w = .9, h = .36) {
  const { THREE } = lib; const c = document.createElement('canvas'); c.width = 384; c.height = 144; const g = c.getContext('2d'); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); sp.scale.set(w, h, 1); sp.visible = false; S.add(sp); let cur = null;
  return { sp, show(text, x, y, z) { if (text !== cur) { cur = text; g.clearRect(0, 0, 384, 144); g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 8; g.beginPath(); g.roundRect(8, 8, 368, 104, 26); g.fill(); g.stroke(); g.fillStyle = '#111'; g.font = '800 54px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText(text, 192, 84); tex.needsUpdate = true; } sp.position.set(x, y, z); sp.visible = true; }, hide() { sp.visible = false; } };
}
