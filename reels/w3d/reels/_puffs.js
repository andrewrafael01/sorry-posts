export function puffs(lib, scene, n, o = {}) {
  const { THREE } = lib; const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: o.color ?? 0xf3f3f0, roughness: 1, flatShading: true, transparent: true, opacity: o.opacity ?? .88 }), n); im.frustumCulled = false; scene.add(im);
  const M = new THREE.Matrix4(), H = new THREE.Matrix4().makeScale(0, 0, 0);
  im.place = (cx, cy, cz, k, t) => { for (let i = 0; i < n; i++) { if (k <= 0) { im.setMatrixAt(i, H); continue; } const a = i * 2.399, b = ((i * 37) % 100) / 100, rr = k * (.3 + b * 1.4); const s = k * (.28 + ((i * 13) % 10) / 40); M.makeScale(s, s * .85, s); M.setPosition(cx + Math.cos(a) * rr, cy + (b - .3) * k * .9 + Math.sin(t * 1.4 + i) * .04, cz + Math.sin(a) * rr); im.setMatrixAt(i, M); } im.instanceMatrix.needsUpdate = true; };
  return im;
}
