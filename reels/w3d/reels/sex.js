import { puffs } from './_puffs.js';
export default async function build({ lib, tl, hud }) {
  globalThis.__night = true; const { THREE, makeStage, buildStreet, buildEarth, building, Crowd, Particles, R, clamp, smooth, lerp } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ clouds: false, skyTop: 0x040815, skyMid: 0x0f1d3a, skyBot: 0x28385c, fog: 0x132240, fogNear: 60, fogFar: 380, hemi: .55, hemiSky: 0x6f8fd8, hemiGround: 0x1b2236, sunColor: 0x9db4ff, sunI: 1.1, sunDir: [.4, 1, -.5], shadowExtent: 50 }); const city = buildStreet(A.scene, { grass: 0x2a3a35 }); const hum = []; const r0 = R(3);
  for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .2, 8, 64), new THREE.MeshBasicMaterial({ color: 0xffb8d6, transparent: true, opacity: .3 })); m.rotation.x = Math.PI / 2; A.scene.add(m); hum.push(m); }
  globalThis.__night = false;
  const C = makeStage({ clouds: false, skyTop: 0x020409, skyMid: 0x020409, skyBot: 0x020409, fog: 0x020409, fogNear: 900, fogFar: 1000, hemi: .5, sunI: 3.0, sunDir: [-1, .5, .7], shadowExtent: 12 }); const sp = buildEarth(C.scene, 6);
  const D = makeStage({ shadowExtent: 40, fogNear: 100, fogFar: 380, skyTop: 0xf4a67a, skyMid: 0xf6c9a0, skyBot: 0xfbe6c6, fog: 0xf2d7bd }); const dc = buildStreet(D.scene, {}); const babies = new Crowd(D.scene, 90, 14); const hosp = new THREE.Mesh(new THREE.BoxGeometry(30, 22, 16), new THREE.MeshStandardMaterial({ color: 0xf2f2f4 })); hosp.position.set(0, 11, 40); hosp.castShadow = true; D.scene.add(hosp); const cross = new THREE.Mesh(new THREE.BoxGeometry(6, 1.6, .3), new THREE.MeshStandardMaterial({ color: 0xe0393e })); cross.position.set(0, 16, 31.9); D.scene.add(cross); const cross2 = cross.clone(); cross2.rotation.z = Math.PI / 2; D.scene.add(cross2);
  const rb = R(5), bp = []; for (let i = 0; i < 90; i++) bp.push([(rb() - .5) * 26, 6 + rb() * 22, rb() * 6.28]);
  return {
    frame({ t, bi, lt, p }) {
      if (bi === 4) { C.cam(0, 0, 34, 0, 0, 0, 40); C.follow(0, 0); sp.earth.rotation.y = lt * .05; C.renderer.render(C.scene, C.camera); }
      else if (bi === 5) { D.cam(0, 5, -8 + 4 * p, 0, 6, 40, 66); D.follow(0, 30); dc.updateCrowd(t, null); for (let i = 0; i < 90; i++) { const o = babies.p[i]; o.scale = .38; o.x = bp[i][0]; o.z = bp[i][1]; o.yaw = bp[i][2] + t * .3; o.anim = 'walk'; o.speed = .6; } babies.update(t); D.renderer.render(D.scene, D.camera); }
      else {
        const sh = bi >= 2 ? Math.min(1, lt / 2) * (bi === 2 ? .12 : .18) : 0; A.cam(Math.sin(t * 30) * sh * .3, 8 + (bi === 0 ? 4 * p : 0) + Math.cos(t * 27) * sh * .3, -6 + (bi === 0 ? 4 * p : 0), 0, 9, 60, 66); A.follow(0, 40);
        city.buildings.forEach((b, i) => { b.rotation.z = Math.sin(t * 26 + i) * sh * .02; b.position.x = Math.sign(b.position.x) * Math.abs(b.position.x) + Math.sin(t * 31 + i) * sh * .12; }); city.updateCrowd(t, null);
        hum.forEach((m, k) => { m.visible = bi >= 2; const r = ((t * 6 + k * 3.6) % 22); m.position.set(0, 1, 30); m.scale.setScalar(.5 + r * 1.6); m.material.opacity = .32 * (1 - r / 22); }); A.renderer.render(A.scene, A.camera);
      }
      hud.question('What if every adult on Earth had *sex* at the exact same time?', 1);
      if (bi === 0) hud.counter('', '', ''); else if (bi === 1) hud.counter('Adults involved', fmt(5.6e9 * smooth(p)), 'about 5 minutes each', 'lights on · phones off'); else if (bi === 2) hud.counter('Beds squeaking', fmt(2.8e9 * smooth(p)), 'one low hum from space', '2.8 billion beds'); else if (bi === 3) hud.counter('Energy burned', fmt(117 * smooth(p)) + ' kt TNT', 'mostly sweat', 'pure cardio', true); else if (bi === 4) hud.counter('Earth moved', '0 m', 'sorry', 'disappointing', false); else hud.counter('Babies, nine months later', fmt(1.2e8 * smooth(p)), 'every maternity ward is full', 'congratulations, everybody');
    }
  };
}
