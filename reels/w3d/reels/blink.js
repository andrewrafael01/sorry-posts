import { room } from './_rooms.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, Particles, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ fog: 0xe8ecef, fogNear: 14, fogFar: 40, clouds: false, skyTop: 0xe8ecef, skyMid: 0xe8ecef, skyBot: 0xe8ecef, shadowExtent: 12, hemi: 1.2, sunI: 1.8 }); room(lib, A.scene, { wall: 0xd7dde6, floor: 0x9aa0ad, w: 14, d: 14 });
  addBox(A.scene, 0, .8, 6, 3.4, .14, 6.2, 0x9b6b3f, { round: .05 }); addBox(A.scene, 0, .4, 6, .5, .8, 5, 0x6d4a2b); addBox(A.scene, 0, 2.2, 10.2, 6.2, 1.6, .06, 0xfafafc, { mat: { emissive: 0xffffff, emissiveIntensity: .25 } });
  const cr = new Crowd(A.scene, 7, 5); const SEAT = [[-2.4, 4], [-2.4, 6], [-2.4, 8], [2.4, 4], [2.4, 6], [2.4, 8], [0, 1.8]];
  const gas = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), new THREE.MeshStandardMaterial({ color: 0x9fcb4a, roughness: .9, transparent: true, opacity: .42 }), 220); gas.frustumCulled = false; A.scene.add(gas); const M = new THREE.Matrix4(), HID = new THREE.Matrix4().makeScale(0, 0, 0);
  const FR = [() => 0, (p) => .05 * p, (p) => .05 + .3 * p, (p) => .35 + .25 * p, (p) => .6 + .4 * p, () => 1], FA = [() => 0, (p) => 15000 * p, (p) => 15000 + 15000 * p, (p) => 105000 + 100000 * p, () => 555000, () => 555000];
  const cams = [(p) => [2.5, 2.2, -1, 0, 1.3, 6, 66], (p) => [2.6, 2.2, -.6, 0, 1.3, 6, 64], (p) => [2.6, 2.4, 0, 0, 1.3, 6, 62], (p) => [0, 3.0, 0, 0, 1.0, 7, 70], (p) => [3 - 3 * p, 3.4, -1.5, 0, 1.0, 6, 72], (p) => [2.4, 2.2, -1, 0, 1.3, 6, 66]];
  return {
    frame({ t, bi, lt, p }) {
      A.cam(...cams[bi](p)); A.follow(0, 6); const f = FR[bi](p);
      SEAT.forEach((s, i) => { const o = cr.p[i]; o.x = s[0]; o.z = s[1]; o.yaw = i === 6 ? 0 : (s[0] < 0 ? Math.PI / 2 : -Math.PI / 2); o.anim = 'idle'; o.speed = .4; }); cr.p[6].shirt; cr.update(t);
      const n = Math.floor(f * 200); for (let q = 0; q < 220; q++) { if (q < n) { const a = q * 2.399, r = 1.0 + 5.5 * f * Math.pow(((q * 7) % 100) / 100, .6); const sc = .22 + .2 * ((q % 5) / 5); M.makeScale(sc, sc, sc); M.setPosition(Math.cos(a) * r * .9, 1.0 + ((q * 13) % 60) / 60 * 2.4 * Math.min(1, f * 2 + .2) + Math.sin(t * 1.5 + q) * .1, 5 + Math.sin(a) * r * .9); gas.setMatrixAt(q, M); } else gas.setMatrixAt(q, HID); } gas.instanceMatrix.needsUpdate = true;
      A.render(); hud.question('What if you farted every time you blinked?', 1, bi > 0); if (bi === 0) hud.counter('', '', ''); else { const v = FA[bi](p); hud.counter('Farts', fmt(v), fmt(v * .09) + ' L of gas'); }
    }
  };
}
