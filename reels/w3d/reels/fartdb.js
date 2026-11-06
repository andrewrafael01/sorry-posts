import { room } from './_rooms.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, buildStreet, buildEarth, Crowd, R, clamp, smooth, lerp } = lib;
  const puffMat = new THREE.MeshStandardMaterial({ color: 0xf3f3f0, roughness: 1, flatShading: true, transparent: true, opacity: .88 });
  const mkPuffs = (scene, n) => { const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), puffMat, n); im.frustumCulled = false; scene.add(im); return im; };
  const placePuffs = (im, cx, cy, cz, k, t) => { const M = new THREE.Matrix4(), H = new THREE.Matrix4().makeScale(0, 0, 0); const n = im.count; for (let i = 0; i < n; i++) { if (k <= 0) { im.setMatrixAt(i, H); continue; } const a = i * 2.399, b = ((i * 37) % 100) / 100, rr = k * (.3 + b * 1.4) * 1.0; const s = k * (.28 + ((i * 13) % 10) / 40); M.makeScale(s, s * .85, s); M.setPosition(cx + Math.cos(a) * rr, cy + (b - .3) * k * .9 + Math.sin(t * 1.4 + i) * .04, cz + Math.sin(a) * rr); im.setMatrixAt(i, M); } im.instanceMatrix.needsUpdate = true; };
  // world A: an office meeting room (close-up, wide, whiteout)
  const A = makeStage({ fog: 0xe6dccb, fogNear: 14, fogFar: 40, clouds: false, skyTop: 0xe6dccb, skyMid: 0xe6dccb, skyBot: 0xe6dccb, shadowExtent: 12, hemi: 1.1, sunI: 2.1, sunDir: [-.9, .8, -.4] }); room(lib, A.scene, { wall: 0xe9e1d3, floor: 0xb68a55, w: 14, d: 14 });
  addBox(A.scene, 0, .78, 6, 3.4, .14, 6.0, 0x9b6b3f); addBox(A.scene, 0, .38, 6, .5, .78, 4.8, 0x6d4a2b); addBox(A.scene, 0, 2.3, 10.2, 5.4, 1.5, .08, 0x254f3a); for (let i = 0; i < 5; i++) addBox(A.scene, -6 + i * 3, 3.45, 5, 1.8, .05, 1.0, 0xffffff, { mat: { emissive: 0xffffff, emissiveIntensity: .7 }, cast: false });
  const cr = new Crowd(A.scene, 8, 12); const SEAT = [[-2.2, 4], [-2.2, 6], [-2.2, 8], [2.2, 4], [2.2, 6], [2.2, 8], [0, 9.2], [0, 2.4]]; const pA = mkPuffs(A.scene, 60);
  // world B: the street and aerial city
  const B = makeStage({ shadowExtent: 52, fogNear: 90, fogFar: 380, skyTop: 0x7f9bb8, skyMid: 0xb9c6d2, skyBot: 0xe3e0da, fog: 0xd5d6d6 }); const city = buildStreet(B.scene, {}); const pB = mkPuffs(B.scene, 70); const hero2 = new Crowd(B.scene, 1, 3);
  // world C: space
  const C = makeStage({ clouds: false, skyTop: 0x020409, skyMid: 0x020409, skyBot: 0x020409, fog: 0x020409, fogNear: 900, fogFar: 1000, hemi: .5, sunI: 3.0, sunDir: [-1, .5, .7], shadowExtent: 12 }); const sp = buildEarth(C.scene, 40); sp.earth.position.y = -40; sp.atm.position.y = -40; const hero3 = new Crowd(C.scene, 1, 3); const pC = mkPuffs(C.scene, 50);
  const DB = [0, 60, 90, 140, 190, 240, 0], NOTE = ['', 'a normal conversation', 'a lawnmower', 'a jet taking off', 'the limit of air', 'a rocket engine', 'no air, no sound'], NUM = ['', 1, 4, 9, 14, 19, 24];
  return {
    frame({ t, bi, lt, p, beat }) {
      const k = bi === 0 ? 0 : bi === 1 ? smooth(p) * .5 : bi === 2 ? 1 : 1.4;
      if (bi <= 2 || bi === 5) {
        A.scene.fog.near = bi === 5 ? 1 : 14; A.scene.fog.far = bi === 5 ? 22 : 40;
        const cams = [[.3, 1.55, 4.6, 0, 1.5, 2.6, 40], [.3, 1.55, 4.2, 0, 1.5, 2.6, 42], [2.0, 2.6, 8.8, 0, 1.2, 4.2, 62], 0, 0, [0, 1.6, 4.6, 0, 1.5, 2.6, 50]]; A.cam(...cams[bi === 5 ? 5 : bi]); A.follow(0, 5);
        SEAT.forEach((s, i) => { const o = cr.p[i]; o.x = s[0]; o.z = s[1]; o.yaw = i === 7 ? 0 : (i === 6 ? Math.PI : (s[0] < 0 ? Math.PI / 2 : -Math.PI / 2)); o.anim = 'idle'; o.speed = .4; if (bi >= 2 && i < 6) o.yaw = Math.atan2(0 - s[0], 2.6 - s[1]); });
        cr.p[7].x = 0; cr.p[7].z = 2.6; cr.p[7].yaw = 0; cr.update(t); placePuffs(pA, 0, 1.3, 2.7, bi === 5 ? 3.4 : k, t); A.renderer.render(A.scene, A.camera);
      } else if (bi === 3 || bi === 4) {
        B.scene.fog.near = 90; B.scene.fog.far = 380; const cams = [0, 0, 0, [0, 3.0, -3, 0, 3.0, 40, 66], [0, 46 - 6 * p, 6, 0, 0, 60, 60]]; B.cam(...cams[bi]); B.follow(0, 40); city.updateCrowd(t, bi >= 3 ? 0 : null);
        const h = hero2.p[0]; h.x = 0; h.z = 5; h.yaw = Math.PI; h.anim = 'idle'; h.vis = bi === 3; hero2.update(t); placePuffs(pB, 0, 1.4, 5.4, bi === 3 ? 2.0 + p * 2 : 7, t);
        city.buildings.forEach((b) => { b.material = bi === 4 && lt > beat.dur * .5 ? b.userData.broken : b.userData.whole; }); B.renderer.render(B.scene, B.camera);
      } else { C.cam(2, 1.4, -5, 0, 2.0, 3, 56); C.follow(0, 0); sp.earth.rotation.y = lt * .02; const h = hero3.p[0]; h.x = 0; h.z = 0; h.y = 0; h.yaw = Math.PI * .6; h.anim = 'idle'; hero3.update(t); placePuffs(pC, 0, 1.6, 0, 1.2 + p, t); C.renderer.render(C.scene, C.camera); }
      hud.question('What if your *fart* got twice as loud every time?', 1);
      if (bi === 0) hud.counter('', '', ''); else hud.counter('Fart #' + NUM[bi], DB[bi] + ' dB', NOTE[bi] ? '≈ ' + NOTE[bi] : '', '+10 dB = twice as loud', DB[bi] >= 190 && bi !== 6);
    }
  };
}
